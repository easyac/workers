const kue = require('kue');
const gcm = require('node-gcm');
const debug = require('debug')('worker');
const Tasks = require('./tasks');

const config = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

const queue = kue.createQueue(config);

function enqueueJob(type, data) {
  debug('enqueueJob, %s ', type);

  queue
    .create(`worker:${type}`, data)
    .priority('normal')
    .save((err) => {
      if (err) debug(err);
    });
}

function sendToApi(type, data) {
  queue
    .create(`api:${type}`, data)
    .priority('normal')
    .save((err) => {
      if (err) debug(err);
    });
}

queue.process('worker:login', 2, (job, done) => {
  const { data } = job;
  Tasks.login(data)
  .then((res) => {
    debug(res);
    sendToApi('save-cookie', res);
    enqueueJob('sync', res);
    done();
  })
  .catch((err) => {
    debug(err);
    sendToApi('login-error', err);
    done();
  });
});

queue.process('worker:sync', 3, (job, done) => {
  const { data } = job;
  Tasks.sync(data)
  .then((res) => {
    debug(res);
    sendToApi('save-classes', res);
    done();
  })
  .catch((err) => {
    debug(err);
    sendToApi('sync-error', err);
    done();
  });
});

// Send in error case only
queue.process('worker:notify-login', 2, (job, done) => {
  const { data } = job;
  const retryTimes = 2;
  const sender = new gcm.Sender(process.env.FGM_KEY);

  const message = new gcm.Message({
    collapseKey: 'easyac',
    priority: 'high',
    contentAvailable: true,
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
      title: 'Easyac: Erro ao conectar no portal',
      message: 'Verifique os seus dados e tente novamente',
    },
    notification: {
      title: 'Easyac: Erro ao conectar no portal',
      body: 'Verifique os seus dados e tente novamente',
      icon: 'ic_launcher',
    },
  });

  sender.send(message, [data.devices.android], retryTimes, (err, result) => {
    if (err) {
      debug('%s %o', 'worker:notify-login err', err);
    } else {
      debug('%s %o', 'worker:notify-login', result);
    }
    done();
  });
});

queue.process('worker:notify-sync', 2, (job, done) => {
  const { data } = job;
  const retryTimes = 2;
  const sender = new gcm.Sender(process.env.FGM_KEY);

  const message = new gcm.Message({
    collapseKey: 'easyac',
    priority: 'high',
    contentAvailable: true,
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
      title: 'Easyac: Dados prontos!',
      message: 'Os dados estão atualizados para consulta',
    },
    notification: {
      title: 'Easyac: Dados prontos!',
      body: 'Os dados estão atualizados para consulta',
      icon: 'ic_launcher',
    },
  });

  sender.send(message, [data.devices.android], retryTimes, (err, result) => {
    if (err) {
      debug('%s %o', 'worker:notify-sync err', err);
    } else {
      debug('%s %o', 'worker:notify-sync', result);
    }
    done();
  });
});

queue.process('worker:notify-absense', 2, (job, done) => {
  const { data } = job;
  const retryTimes = 2;
  const sender = new gcm.Sender(process.env.FGM_KEY);

  const message = new gcm.Message({
    collapseKey: 'absense',
    tag: 'absense',
    priority: 'normal',
    contentAvailable: true,
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
      title: 'Easyac: Novas faltas publicadas',
      message: data.class.descricaoDisciplina,
    },
    notification: {
      title: 'Easyac: Novas faltas publicadas',
      body: data.class.descricaoDisciplina,
      icon: 'ic_launcher',
    },
  });

  sender.send(message, [data.devices.android], retryTimes, (err, result) => {
    if (err) {
      debug('%s %o', 'worker:notify-absense err', err);
    } else {
      debug('%s %o', 'worker:notify-absense', result);
    }
    done();
  });
});

queue.process('worker:notify-grade', 2, (job, done) => {
  const { data } = job;
  const retryTimes = 2;
  const sender = new gcm.Sender(process.env.FGM_KEY);

  const message = new gcm.Message({
    collapseKey: 'grade',
    tag: 'grade',
    priority: 'normal',
    contentAvailable: true,
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
      title: 'Easyac: Novas notas publicadas',
      message: data.class.descricaoDisciplina,
    },
    notification: {
      title: 'Easyac: Novas notas publicadas',
      body: data.class.descricaoDisciplina,
      icon: 'ic_launcher',
    },
  });

  sender.send(message, [data.devices.android], retryTimes, (err, result) => {
    if (err) {
      debug('%s %o', 'worker:notify-grade err', err);
    } else {
      debug('%s %o', 'worker:notify-grade', result);
    }
    done();
  });
});
