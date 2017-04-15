const NRP = require('node-redis-pubsub');
const debug = require('debug')('worker');
const Tasks = require('./tasks');

const config = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  scope: 'senac',
};
const nrp = new NRP(config);

debug('Booting Worker');

nrp.on('worker:login', data => Tasks.login(data, nrp));
nrp.on('worker:sync', data => Tasks.sync(data, nrp));
