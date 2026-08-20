const fs = require('fs');


fs.writeFile('example.txt', 'This is a update content' , (err) => {
    if(err) throw err;
    console.log('File overwritten (update)!');
});
