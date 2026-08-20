const fs = require('fs');

fs.writeFile('example.txt', 'Hello World!' , (err) => {
    if(err) throw err;
    console.log('File created!');


fs.readFile('example.txt','utf8',(err,data)=>{
    if(err) throw err;
    console.log(data);
});
});



