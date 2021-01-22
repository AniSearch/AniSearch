import { Client } from './client/Client';

const client = new Client();

client.on('error', console.error);
process.on('unhandledRejection', console.error);

client.login(client.config.token);