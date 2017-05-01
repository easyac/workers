const Easyac = require('easyac-crawler');
const debug = require('debug')('worker');

module.exports = (data) => {
  const { cookie, username } = data;
  debug('Syncing for %s', username);

  return new Promise((resolve, reject) => {
    const StudentBot = Easyac.aluno(cookie);
    StudentBot.get()
      .then(() => StudentBot.getTurmas())
      .then((botData) => {
        debug('Syncing found classes for %s: %s', username, JSON.stringify(botData));

        if (!botData || !botData.turmas) {
          reject('Data not found');
          return;
        }

        debug('Data for %s sent to API', username);
        resolve({ username, data: botData });
      })
      .catch(err => reject(err));
  });
};
