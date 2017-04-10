const NRP = require('node-redis-pubsub');
const Easyac = require('easyac-crawler');
const debug = require('debug')('worker')

const config = {
  host: 'localhost',
  port  : 6379,
  scope : 'senac'
};
const nrp = new NRP(config);

debug('Booting Worker');

nrp.on('worker:login', data => {
  const {username, password, unity} = data;

  debug('Start login process for %s', username);
  Easyac
  .login(username, password, unity)
  .then(cookie => {
    debug('Cookie sucessfully found for %s', username);
    nrp.emit('api:save-cookie', {username, cookie});
  })
  .catch(err => debug(err));
});

nrp.on('worker:sync', data => {
  const {cookie, username} = data;

  debug('Syncing for %s', username);
  let AlunoBot = Easyac.aluno(cookie);
  AlunoBot.get()
    .then(() => AlunoBot.getTurmas())
    .then((data) => {
      debug('Syncing found classes for %s', username);

      if(!data || !data.turmas){
        debug('Data not found');
        return;
      }

    })
    .catch(err => debug(err));
});
