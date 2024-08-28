const express = require('express');
const app = express();
const fs = require('node:fs');
const path = require('node:path');
const { exec } = require('child_process');
const https = require('https');  
const PORT = 4000  

const outputDirectory = './output';
const logFilePath = './output/testlog.txt';

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

// Endpoint to list files
app.get('/api/files', (req, res) => {
    fs.readdir(outputDirectory, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Unable to scan directory' });
      }
      console.log('files read')
      res.json({ files });
    });
  });


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
app.get('/iperf3', (req, res) => {
    const outputFileNames = ['downlinkdata.txt', 'uplinkdata.txt', 'maxdata.txt'];
    runScriptAndReturnFiles('iperf3script', outputFileNames, res);
});


app.get('/ping', (req, res) => {
    runScriptAndReturnFile('pingm', 'pingresults.txt', res);
});

app.get('/mtr', (req, res) => {
    runScriptAndReturnFile('mtr_script', 'mtr_results.txt', res);
});

app.get('/Ookla5G', (req, res) => {
    runScriptAndReturnFile('Ookla5G', res);
});

app.get('/SignalParams', (req, res) => {
    runScriptAndReturnFile('SignalParams', res);
});

app.get('/GPS', (req, res) => {
    // Options for the HTTPS request
    const options = {
        hostname: 'www.cradlepointecm.com',
        path: '/api/v2/locations/',
        method: 'GET',
        headers: {
            'X-ECM-API-ID': 'd7310036-1e43-4490-a480-6d6d9d2dea1d',
            'X-ECM-API-KEY': 'c34a6f657dba6c15efe5911cc0b3bac63602d5a2',
            'X-CP-API-ID': '77384b9a',
            'X-CP-API-KEY': 'c609221dbe701bc4218ec871797399b7',
        }
    };

    // Making the HTTPS request
    const request = https.request(options, (response) => {
        let data = '';

        // Listen for data chunks
        response.on('data', (chunk) => {
            data += chunk;
        });

        // End of response
        response.on('end', () => {
            try {
                // Parse the JSON data
                const jsonData = JSON.parse(data);

                // Check if jsonData.data exists and is an array
                if (jsonData.data && Array.isArray(jsonData.data)) {
                    // Extract required data
                    const locationData = jsonData.data.map(item => {
                        // Get current local time in HH:MM:SS format
                        const now = new Date();
                        const hours = now.getHours().toString().padStart(2, '0');
                        const minutes = now.getMinutes().toString().padStart(2, '0');
                        const seconds = now.getSeconds().toString().padStart(2, '0');
                        const timestamp = `${hours}:${minutes}:${seconds}`;

                        return {
                            latitude: item.latitude,
                            longitude: item.longitude,
                            altitude_meters: item.altitude_meters,
                            accuracy: item.accuracy,
                            timestamp: timestamp  // Using local time in HH:MM:SS format
                        };
                    });

                    // Append the location data to the text file
                    const filePath = path.join(__dirname, './output/gps_data.txt');
                    const fileContent = locationData.map(item => JSON.stringify(item)).join('\n') + '\n';

                    fs.appendFile(filePath, fileContent, (err) => {
                        if (err) {
                            console.error('Error appending to file:', err);
                            res.status(500).json({ error: 'Failed to append GPS data to file' });
                            return;
                        }

                        // Generate a download link
                        const fileLink = `<a href="./output/gps_data.txt" download>Download GPS Data</a>`;
                        const downloadPage = `<html>
                                                <body>
                                                    ${fileLink}
                                                </body>
                                              </html>`;

                        // Send the download page to the client
                        res.status(200).send(downloadPage);
                    });
                } else {
                    console.error('Invalid data format:', jsonData);
                    res.status(500).json({ error: 'Invalid data format received from API' });
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.status(500).json({ error: 'Failed to parse JSON response' });
            }
        });
    });

    // Handle request errors
    request.on('error', (error) => {
        console.error('Error fetching GPS data:', error);
        res.status(500).json({ error: 'Failed to fetch GPS data' });
    });

    // End the request
    request.end();
});

// Endpoint to delete all files in the output directory
app.delete('/api/reset-output', (req, res) => {
    console.log('Request received for DELETE');

    fs.readdir(outputDirectory, (err, files) => {
        if (err) {
            console.error('Unable to read output directory:', err);
            return res.status(500).json({ error: 'Unable to read output directory' });
        }

        // Iterate through each file and delete it
        files.forEach((file) => {
            const filePath = path.join(outputDirectory, file);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${filePath}`, err);
                } else {
                    console.log(`Deleted file: ${filePath}`);
                }
            });
        });

        res.status(200).json({ message: 'All files deleted from output directory' });
    });
});

app.get('/teststatus', (req, res) => {
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading test log file:', err);
            return res.status(500).send('Error reading test log file');
        }
        res.status(200).send(data); // Send the file content as response
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));   