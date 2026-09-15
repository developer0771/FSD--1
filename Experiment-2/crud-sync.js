const fs = require('fs');

const fileName = 'example.txt';

try {
    // CREATE
    fs.writeFileSync(fileName, 'Hello World!');
    console.log('File created!');

    // READ
    let data = fs.readFileSync(fileName, 'utf8');
    console.log('File content:', data);

    // UPDATE - OVERWRITE
    fs.writeFileSync(fileName, 'This is the updated content.');
    console.log('File overwritten!');

    // UPDATE - APPEND
    fs.appendFileSync(fileName, '\nThis line was added.');
    console.log('File updated!');

    // READ UPDATED CONTENT
    data = fs.readFileSync(fileName, 'utf8');
    console.log('Updated content:', data);

    // DELETE
    fs.unlinkSync(fileName);
    console.log('File deleted!');
} catch (err) {
    console.error('Error:', err);
}