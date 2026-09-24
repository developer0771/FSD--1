const EventEmitter = require('events');

class Element extends EventEmitter {
  constructor(name, parent = null) {
    super();
    this.name = name;
    this.parent = parent;
  }

  addEventListener(type, handler) {
    this.on(type, handler);
  }

  removeEventListener(type, handler) {
    this.off(type, handler);
  }

  dispatchEvent(type, data) {
    const event = {
      type,
      target: this,
      currentTarget: this,
      data,
      propagationStopped: false,
      stopPropagation() {
        this.propagationStopped = true;
      }
    };

    let node = this;
    while (node && !event.propagationStopped) {
      event.currentTarget = node;
      node.emit(type, event);
      node = node.parent;
    }

    return event;
  }
}

const document = new Element('document');
const form = new Element('form', document);
const button = new Element('button', form);

let stopAtForm = false;

const describe = (event) =>
  `type=${event.type}, target=${event.target.name}, currentTarget=${event.currentTarget.name}, data=${JSON.stringify(event.data)}`;

const buttonClick = (event) => {
  console.log(`[button] handler -> ${describe(event)}`);
};

const formClick = (event) => {
  console.log(`[form] handler -> ${describe(event)}`);
  if (stopAtForm) {
    console.log('[form] calling stopPropagation()');
    event.stopPropagation();
  }
};

const documentClick = (event) => {
  console.log(`[document] handler -> ${describe(event)}`);
};

const formKeypress = (event) => {
  console.log(`[form] keypress handler -> ${describe(event)}`);
};

button.addEventListener('click', buttonClick);
form.addEventListener('click', formClick);
document.addEventListener('click', documentClick);
form.addEventListener('keypress', formKeypress);

console.log('--- Scenario A: click bubbles to document ---');
button.dispatchEvent('click', { x: 10, y: 20 });

console.log('\n--- Scenario B: form stops propagation ---');
stopAtForm = true;
button.dispatchEvent('click', { x: 30, y: 40 });

console.log('\n--- Scenario C: button listener removed ---');
stopAtForm = false;
button.removeEventListener('click', buttonClick);
button.dispatchEvent('click', { x: 50, y: 60 });

console.log('\n--- keypress on form ---');
form.dispatchEvent('keypress', { key: 'Enter' });