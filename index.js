const kue = require('kue');
const debug = require('debug')('worker');
const Tasks = require('./tasks');

const config = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

const queue = kue.createQueue(config);

function sendToApi(type, data) {
  queue
    .create(`api:${type}`, data)
    .priority('normal')
    .save((err) => {
      if (err) debug(err);
      debug('cookie for %s sent to API', data.username);
    });
}

queue.process('worker:login', 2, (job, done) => {
  const { data } = job;
  Tasks.login(data)
  .then((res) => {
    debug(res);
    sendToApi('save-cookie', { data: res });
    done();
  })
  .catch((err) => {
    debug(err);
    sendToApi('login-error', { data: err });
    done();
  });
});

queue.process('worker:sync', 3, (job, done) => {
  const { data } = job;
  Tasks.sync(data)
  .then((res) => {
    debug(res);
    sendToApi('save-classes', { data: res });
    done();
  })
  .catch((err) => {
    debug(err);
    sendToApi('sync-error', { data: err });
    done();
  });
});
