const socket = io();
const ssi = {};
socket.on('id', (id) => ssi['id'] = id);