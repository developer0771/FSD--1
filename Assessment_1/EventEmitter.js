const EventEmitter = require('events');

class SessionManager extends EventEmitter {
  constructor() {
    super();

    this.on('greet', (username) => {
      console.log(`Hello, ${username}! Welcome.`);
    });

    this.on('exit', (code) => {
      console.log(`Session closed with code ${code}. Goodbye!`);
    });

    this.once('greet', () => {
      console.log('First login of the day!');
    });
  }

  trigger(command, ...args) {
    if (command === 'greet' || command === 'exit') {
      return this.emit(command, ...args);
    }
    console.log(`Unknown event: ${command}`);
    return false;
  }
}

const session = new SessionManager();

session.on('error', (err) => {
  console.log(`Error handled: ${err.message}`);
});

session.trigger('greet', 'Alice');
session.trigger('greet', 'Bob');
session.trigger('greet', 'Charlie');

console.log(`Listener count for greet: ${session.listenerCount('greet')}`);

session.trigger('exit', 0);
session.trigger('login');

session.emit('error', new Error('Something went wrong in the session'));