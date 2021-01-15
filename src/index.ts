import { Client } from './client/Client';
import config from './config.json';

const client = new Client();

client.on('error', console.error);
process.on('unhandledRejection', console.error);

client.login(config.token);