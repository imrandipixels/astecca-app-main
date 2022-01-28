import io from 'socket.io-client';

const SocketController = {
  connect(ENDPOINT) {
    try {
      const socket = io(ENDPOINT);
      return socket;
    } catch (error) {
      console.log(error);
    }
  },

  subscribe(socket, userId) {
    socket.emit('subscribe', userId);
  },

  sendMessage(socket, payload, cb) {
    socket.emit('send-message', payload);
    cb();
  },

  readMessages(socket, payload) {
    socket.emit('message-seen', payload);
  },
};

export default SocketController;
