const fs = require('fs');

const fileName = 'example.txt';

// CREATE
fs.writeFile(fileName, 'Hello World!', (err) => {
    if (err) throw err;
    console.log('File created!');

    // READ
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) throw err;
        console.log('File content:', data);

        // UPDATE - APPEND
        fs.appendFile(fileName, '\nThis line was added.', (err) => {
            if (err) throw err;
            console.log('File updated!');

            // DELETE
            fs.unlink(fileName, (err) => {
                if (err) throw err;
                console.log('File deleted!');
            });
        });
    });
});