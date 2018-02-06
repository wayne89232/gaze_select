var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var zmq = require('zeromq')
var serialize = require('node-serialize');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.post("/start_gaze", function(req, res) {
  var not = {'subject':'task.start', 'data':'time'}
  var payload = serialize.serialize(not);
  topic = 'web.' + not['subject']
  sock1.send(topic)
  res.json({})
});

app.post("/stop_gaze", function(req, res) {
  var not = {'subject':'task.end', 'data':'time'}
  var payload = serialize.serialize(not);
  topic = 'web.' + not['subject']
  sock1.send(topic)
  res.json({})
});

var sock1 = zmq.socket("req");
sock1.connect('tcp://localhost:50020');

// var not = {'subject':'task.end', 'data':'time'}
// var payload = serialize.serialize(not);
// topic = 'web.' + not['subject']
// sock1.send(topic)

module.exports = app;
app.listen(3000);
