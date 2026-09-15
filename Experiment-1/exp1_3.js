const fs = require('fs');

console.log('1_2: Start(sync)');

setTimeout(() => {
    console.log('2_2: setTimeout (macrotask - timers phase)');
}, 0);

setImmediate(() => {
    console.log('3_2: setImmediate (macrotask - check phase)');
});

process.nextTick(() => {
    console.log('4_2: process.nextTick (highest priority microtask)');
});

Promise.resolve().then(() => {
    console.log('5_2: Promise.then (microtask)');
});

console.log('6_2: end (sync)');