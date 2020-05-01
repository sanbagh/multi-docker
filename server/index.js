const keys = require('./keys');
const { Pool } = require('pg');
const redis = require('redis');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());
const pgClient = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  database: keys.pgDatabase,
  user: keys.pgUser,
  password: keys.pgPassword,
});
pgClient.on('error', () => console.log('pg connection down'));
pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch((err) => console.log(err));

const client = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const pub = client.duplicate();
app.get('/', (req, res) => {
  res.send('Hi');
});
app.get('/values/all', async (req, res) => {
  console.log('sanjeev received');
  const result = await pgClient.query('SELECT * from values');
  console.log('sanjeev ' + result.rows);
  res.send(result.rows);
});
app.get('/values/current', async (req, res) => {
  client.hgetall('Values', (err, data) => {
    res.send(data);
  });
});
app.post('/values', async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index should be less than 40');
  }
  client.hset('values', index, 'None');
  pub.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
  res.send({ working: true });
});
app.listen(8000, () => {
  console.log('server started at port 8000');
});
