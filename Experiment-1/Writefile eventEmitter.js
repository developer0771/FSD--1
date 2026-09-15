const EventEmitter = require('events');
const myEmitter = new EventEmitter();

myEmitter.on('greet', (name) => {
  console.log(`Hello, ${name}! Welcome to Node.js!`);
});
myEmitter.on('exit', () => {
    console.log('Exiting the application. Goodbye!');
});

myEmitter.emit('greet', 'Tarun');
myEmitter.emit('exit');


