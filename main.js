var provider = new firebase.auth.GoogleAuthProvider();

const translations = [
    "NIV",
    "NLT",
    "MSG",
    "ESV"
];

const translations_title = [
    "New International Version (NIV)",
    "New Living Translation (NLT)",
    "The Message (MSG)",
    "English Standard Version (ESV)"
];

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

const num_chapters = [
    "50",
    "40",
    "27",
    "36",
    "34",
    "24",
    "21",
    "4",
    "31",
    "24",
    "22",
    "25",
    "29",
    "36",
    "10",
    "13",
    "10",
    "42",
    "150",
    "31",
    "12",
    "8",
    "66",
    "52",
    "5",
    "48",
    "12",
    "14",
    "3",
    "9",
    "1",
    "4",
    "7",
    "3",
    "3",
    "3",
    "2",
    "14",
    "4",
    "28",
    "16",
    "24",
    "21",
    "28",
    "16",
    "16",
    "13",
    "6",
    "6",
    "4",
    "4",
    "5",
    "3",
    "6",
    "4",
    "3",
    "1",
    "13",
    "5",
    "5",
    "3",
    "5",
    "1",
    "1",
    "1",
    "22"
]

var user_valid = false;
var app_user = null;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("user is logged in");
        user_valid = true;
        app_user = user;
        $(document).ready(function () {
            $('#account').attr("onclick", 'signOut()');
            $('#account').text('Logout');
            $('#profile').html(user.displayName.substring(0, user.displayName.indexOf(" ")) + '<i class="ml-2 fas fa-bible"></i>');
            $('#profile').removeClass('d-none');    
            pageIsReady();
        });
        console.log(user.uid);
        // User is signed in.
    } else {
        // No user is signed in.
        $('#account').attr("onclick", 'signIn()');
        $('#account').html('Login / Register <i class="fab fa-google"></i>');
        $('#profile').addClass('d-none');
        user_valid = false;
        $(document).ready(function () {
            pageIsReady();
        });
    }
});

function signIn() {
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        app_user = result.user;
        user_valid = true;
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        $('#account').attr("onclick", 'signIn()');
        $('#account').html('Login / Register <i class="fab fa-google"></i>');
        $('#profile').addClass('d-none');
        user_valid = false;
    });
}

function signOut() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        $('#account').attr("onclick", 'signIn()');
        $('#account').html('Login / Register <i class="fab fa-google"></i>');
        $('#profile').addClass('d-none');
        // refresh the page
        user_valid = false;
        location.reload(); 
    }).catch(function (error) {
        // An error happened.
    });
}

var timeout = null;

// sync up verse
function sync_up_verse(verse_number) {
    if (user_valid) {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            var v_obj = {};
            v_obj[verse_number] = $('#' + verse_number).find(".verse_button_select").val()
            var chapterDocumentRef = db.doc('users/' + app_user.uid + '/chapter_sync/' + book + ' ' + chapter);
            chapterDocumentRef.update(v_obj)
                .then(function () {
                    console.log("Synced verse." + v_obj);
                })
                .catch(function (error) {
                    // The document probably doesn't exist.
                    // We need to create the document in Cloud Firestore
                    chapterDocumentRef.set(v_obj)
                        .then(function () {
                            console.log("Created verse: " + v_obj);
                        })
                        .catch(function (error) {
                            console.error("Error updating document: ", error);
                        })
                });
        }, 1000);
    } else {
        console.log("Not logged in");
    }
}

// sync up note
function sync_up_note(note_number) {
    if (user_valid) {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            var n_obj = {};
            if ($('#' + note_number)[0] === undefined) {
                console.log("Note has been deleted");
                n_obj[note_number] = firebase.firestore.FieldValue.delete();
            } else {
                console.log("Note is present");
                n_obj[note_number] = $('#' + note_number)[0].innerHTML;
            }
            var chapterDocumentRef = db.doc('users/' + app_user.uid + '/chapter_sync/' + book + ' ' + chapter);
            chapterDocumentRef.update(n_obj)
                .then(function () {
                    console.log("Updated note: " + n_obj);
                })
                .catch(function (error) {
                    // The document probably doesn't exist.
                    // We need to create the document in Cloud Firestore
                    chapterDocumentRef.set(n_obj)
                        .then(function () {
                            console.log("Created note: " + n_obj);
                        })
                        .catch(function (error) {
                            console.error("Error updating document: ", error);
                        })
                });
        }, 1000);
    } else {
        console.log("Not logged in");
    }
}

var data_synced_down = false;

function syncDown() {
    if (user_valid) {
        console.log('users/' + app_user.uid + '/chapter_sync/' + book + ' ' + chapter);
        var chapterDocumentRef = db.doc('users/' + app_user.uid + '/chapter_sync/' + book + ' ' + chapter);
        chapterDocumentRef.get()
        .then(function(doc) {
            if (doc.exists) {
                var keys = Object.keys(doc.data());
                for (var key of keys) {
                    if(key.charAt(0) == "n") {
                        //Add notes
                        console.log(doc.data()[key]);
                        console.log(key.replace("n_", ""));
                        addNote (key.replace("n_", ""), doc.data()[key]);
                    } if (key.charAt(0) == "v") {
                        //Update verses
                        var verse_id = key;
                        var translation = doc.data()[key];
                        var this_verse = verse_id.replace('v_', '');
                        $("#" + key).find('.verse_button_select').attr('value', translation);
                        $("#" + key).find('.verse_button_select').text(translations[translation]);
                        updateVerse(this_verse, translation);
                    }
                }
            } else {
                console.log('document not found');
            }
          })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }
}

function updateVerse(verse_id, translation) {
    $.getJSON("/Bibles/" + translations[translation] + "/" + book + "/" + chapter + ".json", function (chapter_data) {
        var new_verse_text = chapter_data[verse_id];
        $("#v_" + verse_id).find('.verse_text').text(new_verse_text);
    });
}
function addNote (verse_id, verse_html) { 
    var verse = $('#v_' + verse_id);
    if ($('#v_' + verse_id).find('.summernote').length == 0) {
        $('#v_' + verse_id).append("<div class='note my-2 w-100 order-4 justify-content-center col-md-8'><div class='summernote'></div></div></div>");
        if (verse_html != undefined) {
            $('#v_' + verse_id).find('.summernote').summernote({
                airMode: true,
                popover: {
                    air: [
                    ]
                }
            });    
        } else {
            $('#v_' + verse_id).find('.summernote').summernote({
                airMode: true,
                placeholder: 'Write a note...',
                popover: {
                    air: [
                    ]
                }
            });
        }
        $('#v_' + verse_id).find('.note-editable').addClass("chapter_text rounded bg-light py-2 px-3 my-0");
        $('#v_' + verse_id).find('.note-editable').children().addClass("my-0 verse_note");
        $('#v_' + verse_id).find('.note-placeholder').addClass("py-2 px-3 chapter_text_muted my-0");
        var note_id = 'n_' + verse_id;
        $('#v_' + verse_id).find('.note-editable').attr('id', note_id);
        $('#v_' + verse_id).find('.add_note').text('❌ Delete');
        $('#v_' + verse_id).find('.add_note').attr('value', '1');
        if(verse_html != undefined) {
            $('#v_' + verse_id).find('.note-editable').html(verse_html);
        }
    }
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

var translation = getUrlParameter("tr")
var book = getUrlParameter('bk');
var chapter = getUrlParameter('ch');

function navigate() {
    var book = $('#book').val();
    var chapter = $('#chapter_select').val();
    var translation = $('#translation').val();

    window.location = "/chapter?tr=" + translation + "&bk=" + book + "&ch=" + chapter;
}

function pageIsReady() {
    // Set the title
    $('#title').text(book + ' ' + chapter);
    if (!translation) {
        translation = "NIV";
    }
    if (!chapter) {
        chapter = "1";
    } if (!book) {
        book = "Genesis";
    }
    //Initialize with Genesis
    $('#book').empty()
    for (var i = 0; i < books.length; i++) {
        if (i == books.indexOf(book)) {
            var book_link = "<option selected>" + books[i] + "</option>";
        } else {
            var book_link = "<option>" + books[i] + "</option>";
        }
        $('#book').append(book_link);
    }

    $('#translation').empty()
    for (var i = 0; i < translations.length; i++) {
        if (i == translations.indexOf(translation)) {
            var translation_link = "<option value=" + translations[i] + " selected>" + translations_title[i] + "</option>";
        } else {
            var translation_link = "<option value=" + translations[i] + ">" + translations_title[i] + "</option>";
        }
        $('#translation').append(translation_link);
    }

    $('#chapter_select').empty();
    for (var i = 1; i <= num_chapters[books.indexOf(book)]; i++) {
        if (i == chapter) {
            var chapter_link = "<option selected>" + i + "</option>";
        } else {
            var chapter_link = "<option>" + i + "</option>";
        }
        $('#chapter_select').append(chapter_link);
    }

    $("#book").on('input', function () {
        $("#chapter_select").empty();
        var this_book = $("#book option:checked").val();
        var book_num = books.indexOf(this_book);
        for (var i = 1; i <= num_chapters[book_num]; i++) {
            if (i == 0) {
                var chapter_link = "<option selected>" + i + "</option>";
            } else {
                var chapter_link = "<option>" + i + "</option>";
            }
            $('#chapter_select').append(chapter_link);
        }
    });
    if (translation && book && chapter) {
        $.getJSON("/Bibles/" + translation + "/" + book + "/" + chapter + ".json", function (chapter_data) {

            // make and set the verses
            var verse_numbers = Object.keys(chapter_data);
            for (i = 1; i <= verse_numbers.length; i++) {
                verse_html = '<div id="v_' + i + '" class="verse row justify-content-center"><div class="col-md-2 col-4 order-1 order-md-1 text-center"><div class="btn-group vs_tr_btn"><button class="verse_button_prev btn btn-sm btn-primary shadow"> < </button><button value="' + translations.indexOf(translation) + '" class="verse_button_select btn btn-sm btn-primary shadow">' + translation + '</button><button class="verse_button_next btn btn-sm btn-primary shadow"> > </button></div></div><div class="col-md-2 col-4 order-2 order-md-3 text-center"><button id="' + i + '" class="vs_tr_btn add_note shadow mx-2 btn btn-sm btn-primary" value="0">➕ Note</button></div><div class="my-1 col-md-8 order-3 order-md-2"><p class="w-100 chapter_text d-inline"><sup> ' + i + ' </sup></p><p class="chapter_text verse_text d-inline"> ' + chapter_data[i] + '</p></div></div>';
                $('#chapter').append(verse_html);
            }

            $('body').on('touchstart', function () { });

            $('.verse_button_prev').click(function () {
                let this_button = this;
                var this_verse_id = $(this_button).parent().parent().parent().attr('id');
                var this_verse = this_verse_id.replace('v_', '');
                var current = $(this_button).siblings('.verse_button_select').val();
                current--;
                if (current < 0) {
                    current = translations.length - 1;
                }
                $(this_button).siblings('.verse_button_select').attr('value', current);
                $(this_button).siblings('.verse_button_select').text(translations[current]);
                updateVerse(this_verse, current);
            });

            $('.verse_button_next').click(function () {
                let this_button = this;
                var this_verse_id = $(this_button).parent().parent().parent().attr('id');
                var this_verse = this_verse_id.replace('v_', '');
                var current = $(this_button).siblings('.verse_button_select').val();
                current++;
                if (current >= translations.length) {
                    current = 0;
                }
                $(this_button).siblings('.verse_button_select').attr('value', current);
                $(this_button).siblings('.verse_button_select').text(translations[current]);
                updateVerse(this_verse, current);
            });

            $('.add_note').click(function () {
                if ($(this).attr('value') === '0') {
                    var verse = $(this).prop("id");
                    console.log(verse);
                    addNote(verse);
                } else {
                    $(this).parent().parent().find('.note').remove();
                    $(this).text('➕ Note');
                    $(this).attr('value', '0');
                    var verse_id = $(this).parent().parent().prop("id");
                    var note_id = verse_id.replace('v', 'n');
                    sync_up_note(note_id);
                }
            });

            $("body").on('DOMSubtreeModified', ".note-editable", function () {
                sync_up_note($(this).attr("id"));
            });

            if (window.location.pathname === "/chapter" || "/chapter/") {
                if (chapter > 1) {
                    chapter--;
                    $("#previous").find('button').text("👈 Chapter " + chapter);
                    $("#previous").attr("href", window.location.protocol + "//" + window.location.host + "/chapter?tr=" + translation + "&bk=" + book + "&ch=" + chapter);
                    $("#previous").removeClass("d-none");
                    chapter++;
                }
                var chap_in_book = num_chapters[books.indexOf(book)];
                if (chapter < chap_in_book) {
                    chapter++
                    $("#next").find('button').text("👉 Chapter " + chapter);
                    $("#next").attr("href", window.location.protocol + "//" + window.location.host + "/chapter?tr=" + translation + "&bk=" + book + "&ch=" + chapter);
                    $("#next").removeClass("d-none");
                    chapter--;
                }
            }

            //Now sync the user's data down
            syncDown();
        });
    }
}