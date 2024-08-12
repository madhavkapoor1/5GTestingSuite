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
app.get('/', (req, res) => {

    fs.readFile('./public/index.html', 'utf8', (err, html) => {
        if (err) {
            res.status(501).send('Sorry, something went wrong');
            return;
        }
        res.status(200).send(html);
    });
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