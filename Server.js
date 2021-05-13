var express = require('express');
var fs = require('fs');

const path = require('path');

//app is our server.
var app = express();

//this tells it that we will use public as our default static folder. When receiving a request for a file like "index.html" or "index.js" it will check public/index.js or 
// public/index.html first

//body parser parses JSON bodies into nice javascript objects.
var bodyParser = require('body-parser');

//this is important so we can parse bodies up to 50 megabytes.
app.use(bodyParser.json({limit:'50mb'}));

//Sasme Thing Here
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//loading in ports from an external file so these can be edited easily.

var port = 5000;

app.listen(port, function () {

    console.log("==Server is listening on port ",port);
});

//this says that if we get a request for a page, first it will look through our
//publicCat/ folder to see if it can find it there. So if it gets a request for index.html
//it will look first to see if it's in there, and if it is just send it.
app.use(express.static(__dirname + '/public'));






//if we get here, then none of the above gets have worked, so we send this. You could also send a nice 404 page.
app.get('*', function (req, res) {
    res.status(404);
    res.send("The page you requested doesn't exist");
});


//this expects to receive a JSON body that looks like this:
/*
{
    "imageAmount":5,
    "collageTitle":"This is a title",
    "images":
        [
            "blahblah64bit image text here","another image here","another here"
        ]
}



*/
app.post('/postImages',function(req,res){
    var amountOfImages = req.body.imageAmount;
    var title = req.body.collageTitle;
    var dirLocation = __dirname + "/images/"+title
    var imagesText = req.body.images;
    //if the folder doesn't exist for our title yet
    if (!fs.existsSync(dirLocation)) {
        fs.mkdirSync(dirLocation, 0744);
    }
    
    
    for(var i = 0; i < amountOfImages; i++){
        //regex that gets rid of the header for base64 files.
        var matches = imagesText[i].match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1]; //we don't do anything with this, but for pngs this should be "png"... I think. Feel free to log it.
        response.data = new Buffer(matches[2], 'base64');   //matches[2] is our actual data that we create a base64 buffer from.
        var fileOut = dirLocation + "/" + i + ".png"
        fs.writeFileSync(fileOut,response.data,err=>{
         
            if(err){
                console.log(err);
            }
        })
    }
    res.status(200).send();
})


