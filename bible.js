var fs = require("fs");
var copyFile = require('quickly-copy-file');
    
const bibles = [
    "raw_json/esv.json",
    "raw_json/nlt.json",
    "raw_json/niv.json",
    "raw_json/msg.json"
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

function generateChapterPages (bible, title) {
    const books = Object.keys(bible);
    var count = 0;
    
    books.forEach(function(element) {
      num_chapters = Object.keys(bible[element]).length;
      for(var i = 1; i <= num_chapters; i++) {
        //   console.log(esv[element][i]);

        var dir = title;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        var dir = title + "/" + books[count];
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        console.log(dir + '/' + i + '.html');

        copyFile('default.html', dir + '/' + i + '.html', function(error) {
            if (error) return console.error(error);
            console.log('File was copied!')
          });

          console.log("Generating: " + dir + " " + i);
      } 
      count++;
    });
}

var esv = JSON.parse(fs.readFileSync(bibles[0]));
var nlt = JSON.parse(fs.readFileSync(bibles[1]));
var niv = JSON.parse(fs.readFileSync(bibles[2]));
var msg = JSON.parse(fs.readFileSync(bibles[3]));

splitIntoChapters(esv, "ESV");
splitIntoChapters(nlt, "NLT");
splitIntoChapters(niv, "NIV");
splitIntoChapters(msg, "MSG");

// generateChapterPages(esv, "ESV");
// generateChapterPages(nlt, "NLT");
// generateChapterPages(niv, "NIV");
// generateChapterPages(msg, "MSG");