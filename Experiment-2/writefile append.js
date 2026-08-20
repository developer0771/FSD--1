const fs = require('fs');

fs.appendFile('example.txt', '\nThis is an appended content' , (err) => {
    if(err) throw err;
    console.log('File updated (appended)!');
});   
