const express = require('express');
const app = express();
const fs = require('node:fs');
const path = require('node:path');
const { exec } = require('child_process');
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

const runScriptAndReturnFile = (scriptName, outputFileName, res) => {
    exec(`./scripts/${scriptName}.sh`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing ${scriptName}:`, error);
            res.status(500).send(`Error executing ${scriptName}`);
            return;
        }

        // Assuming the script generates a file named outputFileName
        const filePath = path.join(__dirname, 'output', outputFileName);

        // Check if the file exists and then generate a download link
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error(`File not found: ${filePath}`);
                res.status(404).send(`File not found: ${outputFileName}`);
                return;
            }

            // Generate an HTML page with a download link
            const downloadLink = `<html>
                                    <body>
                                        <p><a href="/download/${outputFileName}">Click here to download ${outputFileName}</a></p>
                                    </body>
                                  </html>`;

            res.status(200).send(downloadLink);
        });
    });
};

const runScriptAndReturnFiles = (scriptName, outputFileNames, res) => {
    exec(`./scripts/${scriptName}.sh`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing ${scriptName}:`, error);
            res.status(500).send(`Error executing ${scriptName}`);
            return;
        }

        // Check if all files exist and generate a download link for each
        let fileLinks = '';
        let filesMissing = false;

        outputFileNames.forEach((outputFileName) => {
            const filePath = path.join(__dirname, 'output', outputFileName);

            if (fs.existsSync(filePath)) {
                fileLinks += `<p><a href="/download/${outputFileName}">Click here to download ${outputFileName}</a></p>`;
            } else {
                console.error(`File not found: ${filePath}`);
                filesMissing = true;
            }
        });

        if (filesMissing) {
            res.status(404).send('One or more files were not found.');
        } else {
            // Generate an HTML page with download links for all files
            const downloadPage = `<html>
                                    <body>
                                        ${fileLinks}
                                    </body>
                                  </html>`;

            res.status(200).send(downloadPage);
        }
    });
};


// Endpoint to serve the downloadable file
app.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, 'output', fileName);

    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error(`Error sending file: ${filePath}`, err);
            res.status(500).send(`Error sending file: ${fileName}`);
        }
    });
});



// Define endpoints for each test
app.get('/iPerf3', (req, res) => {
    const outputFileNames = ['downlinkdata.txt', 'uplinkdata.txt', 'maxdata.txt'];
    runScriptAndReturnFiles('iperf3script', outputFileNames, res);
});


app.get('/Ping', (req, res) => {
    runScriptAndReturnFile('pingm', 'pingresults.txt', res);
});

app.get('/MyTraceRoute', (req, res) => {
    runScriptAndReturnFile('mtr_script', 'mtr_results.txt', res);
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