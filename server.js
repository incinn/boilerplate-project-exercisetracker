const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
​
let usersStore = [];
let exerciseStore = [];
​
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});
​
app.post('/api/users', (req, res) => {
  const user = {
    username: req.body.username,
    _id: uuidv4()
  }
  ​  
  usersStore.push(user);
  res.json(user);
});
​
app.post('/api/users/:id/exercises', (req, res) => {
  const user = getUserById(req.params.id);
  ​  
  const exercise = {
    description: req.body.description,
    duration: +req.body.duration,
    date: req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString()
  }
  ​
  exerciseStore.push({...exercise, _id: user._id});
  ​  
  res.json({...exercise, ...user});
});
​
app.get('/api/users', (req, res) => {
  res.json(usersStore);
});
​
app.get('/api/users/:id', (req, res) => {
  const user = getUserById(req.params.id);
  const log = getUserExercisesById(user._id);
  const output = {...user, count: log.length, log};
  ​  
  res.json(output);
});
​
app.get('/api/users/:id/logs', (req, res) => {
  const user = getUserById(req.params.id);
  let log = getUserExercisesById(user._id);
  ​
  log.filter((item) => {
    if(req.query.from && req.query.to) {
      const from = new Date(req.query.from);
      const to = new Date(req.query.to);
      const d = new Date(item.date);
      return d >= from && d <= to;
    }
  });
  ​
  if(req.query.limit) {
    const logCopy = log;
    log = [];
    for(i = 0; i < req.query.limit; i++) {
      log.push(logCopy[i]);
    }
  }
  ​  
  res.json({ ...user, count: log.length, log });
});
​
function getUserById(id) {
  return usersStore.find((u) => u._id === id);
}
​
function getUserExercisesById(id) {
    return exerciseStore.filter((ex) => ex._id === id);
}
​
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
​
