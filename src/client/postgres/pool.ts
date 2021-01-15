import { Pool } from 'pg';
import config from '../../config.json';

const pool = new Pool({ 
    host: config.postgres.host, 
    port: config.postgres.port || 5432,
    database: config.postgres.database, 
    user: config.postgres.user,
    password: config.postgres.password
});

export { pool };