const Easyac = require('easyac-crawler');
const debug = require('debug')('worker');

module.exports = (data, nrp) => {
  const {username, password, unity} = data;

  debug('Start login process for %s', username);
  Easyac
  .login(username, password, unity)
  .then(cookie => {
    debug('Cookie sucessfully found for %s', username);
    nrp.emit('api:save-cookie', {username, cookie});
  })
  .catch(err => debug(err));
};
