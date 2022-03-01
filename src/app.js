const fs = require('fs');
const os = require('os');
const { Client } = require('pg');
const express = require('express');
const app = express();

const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;

const pg = new Client({
    host: POSTGRES_HOST,
    port: 5432,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
});

pg.connect()
    .then(() => console.log('Webapp: Connected to postgres'))
    .catch((err) => console.log("Webapp: Failed to connected to postgres ", err));

app.use((req, res, next) => {
    const { ip, hostname, path } = req;

    const command = 'INSERT INTO requests (ip, path, host, requested_at) VALUES ($1, $2, $3, $4)'
    pg.query(command, [ip, path, os.hostname(), new Date().toISOString()]);

    next();
});

app.get('/', async (req, res) => {
    const result = await pg.query('SELECT ip, path, host, requested_at FROM requests ORDER BY id DESC LIMIT 25;');

    res.json(result.rows);
});

app.listen(3333, '0.0.0.0', () => console.log('Web server: started'));