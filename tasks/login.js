const Easyac = require('easyac-crawler');
const debug = require('debug')('worker');

module.exports = (data) => {
  const { username, password, unity } = data;

  return new Promise((resolve, reject) => {
    debug('Start login process for %s', username);
    Easyac
    .login(username, password, unity)
    .then((cookie) => {
      debug('Cookie sucessfully found for %s', username);
      resolve({ username, cookie });
    })
    .catch(err => reject(err));
  });
};
