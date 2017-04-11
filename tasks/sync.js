const Easyac = require('easyac-crawler');
const debug = require('debug')('worker');

module.exports = (data, nrp) => {
  const {cookie, username} = data;
  debug('Syncing for %s', username);

  let StudentBot = Easyac.aluno(cookie);
  StudentBot.get()
    .then(() => StudentBot.getTurmas())
    .then(data => {
      debug('Syncing found classes for %s', username);

      if(!data || !data.turmas){
        debug('Data not found');
        return;
      }

      debug('Data for %s sent to API', username);
      nrp.emit('api:save-classes', data);
    })
    .catch(err => debug(err));
}
