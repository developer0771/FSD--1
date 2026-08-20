function add(a, b) {
    return a + b;
}   
console.log(add(2, 3)); // Output: 5       

const greet = (name = "Guest") => 'hello,${name}';
console.log(greet()); 
CONSOLE.log(greet(Alice)); // Output: hello Alice

const numbers = [1, 2, 3, 4, 5];

const doubledNumbers = numbers.map(num => num * 2);
const evens = numbers.filter(num => num % 2 === 0);
const sum = numbers.reduce((acc, curr) => acc + curr, 0);

console.log(doubledNumbers); // Output: [2, 4, 6, 8, 10]
console.log(evens); // Output: [2, 4]
console.log(sum); // Output: 15
