'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

//var _bodyParser = require('body-parser');

//var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var usernames = {};

app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.use('/public', _express2.default.static('public'));
//app.use(_bodyParser2.default.urlencoded({ extended: true }));
//app.use(_bodyParser2.default.json());

app.get('/', function (req, res) {
  return res.render('index');
});

io.sockets.on('connection', function (socket) {
  socket.on('sendchat', function (data) {
    io.sockets.emit('updatechat', socket.username, data);
  });

  socket.on('adduser', function (username) {
    socket.username = username;

    usernames[username] = username;

    socket.emit('servernotification', {
      connected: true,
      toSelf: true,
      username: username
    });

    socket.broadcast.emit('servernotification', { connected: true, username: username });

    io.sockets.emit('updateusers', usernames);
  });

  socket.on('disconnect', function () {
    delete usernames[socket.username];

    io.sockets.emit('updateusers', usernames);

    socket.broadcast.emit('servernotification', { username: socket.username });
  });
});

server.listen(process.env.PORT || 3000, function () {
  console.log("Application started on *3000");
});