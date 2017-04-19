const Easyac = require('easyac-crawler');
const debug = require('debug')('worker');

module.exports = (data, nrp) => {
  const { cookie, username } = data;
  debug('Syncing for %s', username);

  const StudentBot = Easyac.aluno(cookie);
  StudentBot.get()
    .then(() => StudentBot.getTurmas())
    .then((botData) => {
      debug('Syncing found classes for %s: %o', username, botData);

      if (!botData || !botData.turmas) {
        debug('Data not found');
        return;
      }

      debug('Data for %s sent to API', username);
      nrp.emit('api:save-classes', { username, data: botData });
    })
    .catch(err => debug(err));
};
