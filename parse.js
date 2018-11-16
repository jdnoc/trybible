var fs = require("fs");

const bibles = [
    "esv.json",
    "nlt.json",
    "niv.json",
    "msg.json"
];

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// Get the size of an object

function splitIntoChapters(bible, title) {
    const books = Object.keys(bible);
    var count = 0;
    
    books.forEach(function(element) {
      num_chapters = Object.keys(bible[element]).length;
      for(var i = 1; i <= num_chapters; i++) {
        //   console.log(esv[element][i]);
        var dir = "Bibles";
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        var dir = "Bibles/" + title;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        var dir = "Bibles/" + title + "/" + books[count];
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        var dir = "Bibles/" + title + "/" + books[count];
        fs.writeFile(dir + '/' + i + '.json', JSON.stringify(bible[element][i]), 'utf8', callback);
        console.log("Generating: " + dir + " " + i);

        function callback (err) {
            if(err) {
                console.log(err);
            }
        }
      } 
      count++;
    })
}

var esv = JSON.parse(fs.readFileSync(bibles[0]));
var nlt = JSON.parse(fs.readFileSync(bibles[1]));
var niv = JSON.parse(fs.readFileSync(bibles[2]));
var msg = JSON.parse(fs.readFileSync(bibles[3]));

splitIntoChapters(esv, "ESV");
splitIntoChapters(nlt, "NLT");
splitIntoChapters(niv, "NIV");
splitIntoChapters(esv, "MSG");