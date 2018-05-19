//Run node app.js to run this server script
//use  curl -v -X POST -H 'Content-Type: application/xml' -d '<hello>world</hello>' http://localhost:3000/parsexml

/*
 fieldinpural : [{
     type: Schema.Types.ObjectId,
     ref: 'cname'
 }]
*/
const express = require('express');
const path = require('path');
const fs = require('fs');
const zipFolder = require('zip-folder');
const convert = require('xml-js');
const Dock = require('./Dock');
const ModelsGenerator = require('./modelsgenerator');

const app = express();
const bodyParser = require('body-parser');
require('body-parser-xml-json')(bodyParser);

app.use(bodyParser.json());
app.use(bodyParser.xml());
app.use(express.static('public'));


let models = [
    {
        cname: "User",
        schemaname: function(){
            return this.cname+'Schema';
        }
    },
    {
        cname: "Blog",
        schemaname: function(){
            return this.cname+'Schema';
        }
    }
];

app.get('/', (req, res) => {
    res.status(200).send("Hello Server is Working")
});

app.post('/download', (req, res) => {
    let DockObj = new Dock('userid', 'modelid');
    let modelDir = DockObj.modelDir;
    let userDir = DockObj.userDir;
    let zip =  `${userDir}/Diagram1.zip`;

    DockObj.genModelFiles(models)
            .then(() => {
                zipFolder(modelDir, zip, (err) => {
                    if(err) {
                        console.log('oh no! Error compressing', err);
                        res.status(304).send("ERROR");
                    } else {
                        console.log('EXCELLENT');
                        res.download(zip, 'Diagram1.zip')
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(304).send("ERROR");
            });
});


app.post('/gendownload', (req, res)=> {
    
        let DockObj = new Dock('userid', 'modelid');
        let modelDir = DockObj.modelDir;
        let userDir = DockObj.userDir;
        let zip =  `${userDir}/models.zip`;

        DockObj.genModelFiles(ModelsGenerator(req.body))
            .then(() => {
                zipFolder(modelDir, zip, (err) => {
                    if(err) {
                        console.log('oh no! Error compressing', err);
                        res.status(304).send("ERROR");
                    } else {
                        console.log('EXCELLENT');
                        DockObj.cleanUpModelDir();
                        res.download(zip, 'models.zip');
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(304).send("ERROR");
            });
    
});

app.get('/samplejsondata', (req, res) => {
    res.status(200).json({"Hello": "World"});
});

app.post('/save', (req, res, body) => {
    console.log(req.query.filename);
    res.json(req.body);
});

app.get('/samplexmldata', (req, res) => {
    fs.readFile('hello.xml', (err, data) => {
       res.set('Content-Type','application/xml');
       res.send(data);
    });
});

//Parse the XML receieved on Post request and send it back
app.post('/parsexml', function(req, res, body) {
    // Any request with an XML payload will be parsed 
    // and a JavaScript object produced on req.body 
    // corresponding to the request payload. 
    console.log(req.body)
    res.status(200).json(req.body);
  });

app.get('/examplejson', (req, res) => {

    fs.readFile('hello1.xml', (err, data) => {
        let jsobj = JSON.parse(convert.xml2json(data));
        let modelPrimitives = ModelsGenerator(jsobj);
        console.log(modelPrimitives);
        res.json(modelPrimitives);  
    });
  
});

app.listen(3000, () => {
    console.log('listening on port :'+3000);
});