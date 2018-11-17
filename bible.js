var fs = require("fs");
var copyFile = require('quickly-copy-file');

const books = [
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy",
    "Joshua",
    "Judges",
    "Ruth",
    "1 Samuel",
    "2 Samuel",
    "1 Kings",
    "2 Kings",
    "1 Chronicles",
    "2 Chronicles",
    "Ezra",
    "Nehemiah",
    "Esther",
    "Job",
    "Psalms",
    "Proverbs",
    "Ecclesiastes",
    "Song of Solomon",
    "Isaiah",
    "Jeremiah",
    "Lamentations",
    "Ezekiel",
    "Daniel",
    "Hosea",
    "Joel",
    "Amos",
    "Obadiah",
    "Jonah",
    "Micah",
    "Nahum",
    "Habakkuk",
    "Zephaniah",
    "Haggai",
    "Zechariah",
    "Malachi",
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Romans",
    "1 Corinthians",
    "2 Corinthians",
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    "1 Thessalonians",
    "2 Thessalonians",
    "1 Timothy",
    "2 Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1 Peter",
    "2 Peter",
    "1 John",
    "2 John",
    "3 John",
    "Jude",
    "Revelation"
]
    
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

function numberOfChapters(bible) {
    const books = Object.keys(bible);
    var count = 0;
    var chapters = {};
    
    books.forEach(function(element) {
      num_chapters = Object.keys(bible[element]).length;
      chapters.push(num_chapters);
        count++;
    });
}

var esv = JSON.parse(fs.readFileSync(bibles[0]));
var nlt = JSON.parse(fs.readFileSync(bibles[1]));
var niv = JSON.parse(fs.readFileSync(bibles[2]));
var msg = JSON.parse(fs.readFileSync(bibles[3]));

// splitIntoChapters(esv, "ESV");
// splitIntoChapters(nlt, "NLT");
// splitIntoChapters(niv, "NIV");
// splitIntoChapters(msg, "MSG");

// generateChapterPages(esv, "ESV");
// generateChapterPages(nlt, "NLT");
// generateChapterPages(niv, "NIV");
// generateChapterPages(msg, "MSG");