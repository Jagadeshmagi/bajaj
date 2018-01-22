import io from 'socket.io-client'


var socket = io.connect(NetworkConstants.NODEJS_SERVER_SOCKETS
  // , {
  //   reconnect: true,
  //   transports: ['websocket'] }
);

module.exports = {io:socket}
