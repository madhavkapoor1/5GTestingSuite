const express = require('express');
const app = express();
const fs = require('node:fs');
const PORT = 4000  

//Temp Database
const db = [];

//Middleware
app.use(express.json());
//app.use(express.static('public'));
app.use(require('cors')());

//Routes
//sample get request for when user goes to base URL, return and display index.html
app.get('/', (req, res) => {

    fs.readFile('./public/index.html', 'utf8', (err, html) => {
        if (err) {
            res.status(500).send('Sorry, something went wrong');
            return;
        }
        res.status(200).send(html);
    });
});

const runScriptAndReturnFile = (scriptName, res) => {
    exec(`./scripts/${scriptName}.sh`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing ${scriptName}:`, error);
            res.status(500).send(`Error executing ${scriptName}`);
            return;
        }

        // Assuming the script generates a file named ${scriptName}.txt
        const filePath = path.join(__dirname, 'output', `${scriptName}.txt`);

        // Send the output of the shell command and the file contents
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading file ${filePath}:`, err);
                res.status(500).send(`Error reading file ${filePath}`);
                return;
            }
            res.status(200).json({
                output: stdout,
                fileContent: data
            });
        });
    });
};

// Define endpoints for each test
app.get('/iPerf3', (req, res) => {
    runScriptAndReturnFile('iPerf3', res);
});

app.get('/ICMPLatency', (req, res) => {
    runScriptAndReturnFile('ICMPLatency', res);
});

app.get('/MyTraceRoute', (req, res) => {
    runScriptAndReturnFile('MyTraceRoute', res);
});

app.get('/Ookla5G', (req, res) => {
    runScriptAndReturnFile('Ookla5G', res);
});

app.get('/SignalParams', (req, res) => {
    runScriptAndReturnFile('SignalParams', res);
});

app.get('/IncludeGPS', (req, res) => {
    runScriptAndReturnFile('IncludeGPS', res);
});

app.post('/api/info', (req, res) => {
    
    const { information } = req.body;
    console.log('The posted request was: ', information);  
    db.push(information);
    console.log('DB', db);
    res.status(201).json({"YourMessage": information});
});

app.put('/api', (req, res) => {    
    // const { information } = req.body;
    // console.log(information); 
    const {word, banana} = req.query;
    console.log(word, banana); 
    res.status(200).send('Hello World!');
});

app.delete('/delete/:id', (req, res) => {

    console.log('Request received for DELETE'); 

});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));   