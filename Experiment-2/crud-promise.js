const fs = require('fs').promises;

const fileName = 'example.txt';

async function run() {
    try {
        // CREATE
        await fs.writeFile(fileName, 'Hello!');
        console.log('File created!');

        // READ
        let data = await fs.readFile(fileName, 'utf8');
        console.log('File content:', data);

        // UPDATE - OVERWRITE
        await fs.writeFile(fileName, 'This is the updated content.');
        console.log('File overwritten!');

        // UPDATE - APPEND
        await fs.appendFile(fileName, '\nThis line was added.');
        console.log('File updated!');

        // READ UPDATED CONTENT
        data = await fs.readFile(fileName, 'utf8');
        console.log('Updated content:', data);

        // DELETE
        await fs.unlink(fileName);
        console.log('File deleted!');
    } catch (err) {
        console.error('Error:', err);
    }
}

run();