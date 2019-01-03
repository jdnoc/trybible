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

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $('#account').attr("onclick", 'signOut()');
        $('#account').text('Logout');
        $('#profile').html(user.displayName.substring(0, user.displayName.indexOf(" ")) + '<i class="ml-2 fas fa-bible"></i>');
        $('#profile').removeClass('d-none');
        user_valid = true;
        app_user = user;
        if (translation && chapter && book) {
            syncDown();
        }
        $(document).ready(function () {
            pageIsReady();
        });
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
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        app_user = result.user;
        $('#account').attr("onclick", 'signOut()');
        $('#account').text('Logout');
        $('#profile').html(user.displayName.substring(0, user.displayName.indexOf(" ")) + '<i class="ml-2 fas fa-bible"></i>');
        $('#profile').removeClass('d-none');
        user_valid = true;
        if (translation && chapter && book) {
            syncDown();
        }
    }).catch(function(error) {
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
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        $('#account').attr("onclick", 'signIn()');
        $('#account').html('Login / Register <i class="fab fa-google"></i>');
        $('#profile').addClass('d-none'); 
        user_valid = false;
    }).catch(function(error) {
        // An error happened.
    });
}

var timeout = null;
var sync_up_ok = false;

function syncUp() {
    if(user_valid && sync_up_ok) {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            var chapterDocumentRef = db.doc('users/' + app_user.uid + '/chapter_sync/' + book + '-' + chapter);
            chapterDocumentRef.set({
                data: $('#chapter').html()
            })
            .then(function() {
                //Document sync successful.
                // Should probably do a green check or something.
                console.log("synced.");
            });
        }, 1500);    
    }
}

var data_synced_down = false;

function syncDown() {
    if(user_valid) {
        console.log('users/' + app_user.uid + '/chapter_sync/' + book + '-' + chapter);
        var chapterDocumentRef = db.doc('users/' + app_user.uid + '/chapter_sync/' + book + '-' + chapter);
        chapterDocumentRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                $('#chapter').html( doc.data().data);
                data_synced_down = true;
                sync_up_ok = true;
                $(document).ready(function () {
                    pageIsReady();
                });
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                $(document).ready(function () {
                    pageIsReady();
                });
                sync_up_ok = true;
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
            pageIsReady()
        });
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

function navigate () {
    var book = $('#book').val();
    var chapter = $('#chapter_select').val();
    var translation = $('#translation').val();

    window.location = "/chapter?tr=" + translation + "&bk=" + book + "&ch=" + chapter;
}

function pageIsReady() {
    // Set the title
    $('#title').text(book + ' ' + chapter);
        if(!translation) {
            translation = "NIV";
        } 
        if(!chapter) {
            chapter = "1";
        } if(!book) {
            book = "Genesis";
        }
        //Initialize with Genesis
        $('#book').empty()
        for (var i = 0; i < books.length; i++) {
            if(i == books.indexOf(book)) {
                var book_link =  "<option selected>" + books[i] +"</option>";
            } else {
                var book_link =  "<option>" + books[i] +"</option>";
            }
            $('#book').append(book_link);
        }
    
        $('#translation').empty()
        for (var i = 0; i < translations.length; i++) {
            if(i == translations.indexOf(translation)) {
                var translation_link =  "<option value=" + translations[i] +" selected>" + translations_title[i] +"</option>";
            } else {
                var translation_link =  "<option value=" + translations[i] +">" + translations_title[i] +"</option>";
            }
            $('#translation').append(translation_link);
        }
    
        $('#chapter_select').empty();
        for(var i = 1; i <= num_chapters[books.indexOf(book)]; i++) {
            if(i == chapter) {
                var chapter_link =  "<option selected>" + i +"</option>";
            } else {
                var chapter_link =  "<option>" + i +"</option>";
            }
            $('#chapter_select').append(chapter_link);
        }
    
        $( "#book" ).on('input', function() {
            $("#chapter_select").empty();
            var this_book = $("#book option:checked").val();
            var book_num = books.indexOf(this_book);
            for(var i = 1; i <= num_chapters[book_num]; i++) {
                if(i == 0) {
                    var chapter_link =  "<option selected>" + i +"</option>";
                } else {
                    var chapter_link =  "<option>" + i +"</option>";
                }
                $('#chapter_select').append(chapter_link);
            }
        });
    
    if(!data_synced_down){
        if(translation && book && chapter) {
            $.getJSON("/Bibles/" + translation + "/" + book +"/" + chapter + ".json", function(chapter_data) {

                // make and set the verses
                var verse_numbers = Object.keys(chapter_data);
                for(i = 1; i <= verse_numbers.length; i++){
                    verse_html = '<div class="verse row justify-content-center"><div class="col-md-2 col-4 order-1 order-md-1 text-center"><div class="btn-group vs_tr_btn"><button class="verse_button_prev btn btn-sm btn-primary shadow" id="' + i + '"> < </button><button value="' + translations.indexOf(translation) + '" class="verse_button_select btn btn-sm btn-primary shadow" id="' + i + '">' + translation + '</button><button class="verse_button_next btn btn-sm btn-primary shadow" id="' + i + '"> > </button></div></div><div class="col-md-2 col-4 order-2 order-md-3 text-center"><button id="' + i + '" class="vs_tr_btn add_note shadow mx-2 btn btn-sm btn-primary" value="0"> 📝 </button></div><div class="my-1 col-md-8 order-3 order-md-2"><p class="w-100 chapter_text d-inline"><sup> ' + i + ' </sup></p><p class="chapter_text verse_text d-inline"> ' + chapter_data[i] + '</p></div></div>';
                    $('#chapter').append(verse_html);
                }

                $('body').on('touchstart', function() {});

                $('.verse_button_prev').click(function () {
                    let this_button = this;
                    var this_verse = $(this_button).attr('id');
                    var current = $(this_button).siblings('.verse_button_select').val();
                    current--;
                    if (current < 0) {
                        current = translations.length - 1;
                    }
                    $(this_button).siblings('.verse_button_select').attr('value', current);
                    $(this_button).siblings('.verse_button_select').text(translations[current]);
                    $.getJSON("/Bibles/" + translations[current] + "/" + book +"/" + chapter + ".json", function(chapter_data) {
                        var new_verse_text = chapter_data[this_verse];
                        $(this_button).parents('.verse').find('.verse_text').text(new_verse_text);
                        syncUp();
                    });
                });

                $('.verse_button_next').click(function () {
                    let this_button = this;
                    var this_verse = $(this_button).attr('id');
                    var current = $(this_button).siblings('.verse_button_select').val();
                    current++;
                    if (current >= translations.length) {
                        current = 0;
                    }
                    $(this_button).siblings('.verse_button_select').attr('value', current);
                    $(this_button).siblings('.verse_button_select').text(translations[current]);
                    $.getJSON("/Bibles/" + translations[current] + "/" + book +"/" + chapter + ".json", function(chapter_data) {
                        var new_verse_text = chapter_data[this_verse];
                        $(this_button).parents('.verse').find('.verse_text').text(new_verse_text);
                        syncUp();
                    });
                });

                $('.add_note').click(function () {
                    syncUp();
                    if($(this).attr('value') === '0') {
                        if( $(this).parent().parent().find('.summernote').length == 0) {
                            $(this).parent().parent().append("<div class='note my-2 w-100 order-4 justify-content-center col-md-8'><div class='summernote'></div></div></div>");
                            $(this).parent().parent().find('.summernote').summernote({
                                airMode: true,
                                placeholder: 'Write a note...',
                                popover: {
                                    air: [
                                    ]
                                }
                            });
                            $(this).parent().parent().find('.note-editable').addClass("chapter_text rounded bg-light py-2 px-3 my-0");
                            $(this).parent().parent().find('.note-editable').children().addClass("my-0");
                            $(this).parent().parent().find('.note-placeholder').addClass("py-2 px-3 chapter_text_muted my-0");
                            // $(this).parent().parent().find('.note-placeholder').data('text', 'Write a note...');
                            // $('.summernote').summernote({placeholder: 'Write a note...'});
                            // $(this).parent().parent().find('.summernote').summernote('focus');
                            $(this).text(' ❌ ');
                            $(this).attr('value', '1');
                        }
                    } else {
                        $(this).parent().parent().find('.note').remove();
                        $(this).text(' 📝 ');
                        $(this).attr('value', '0');
                    }
                });

                $("body").on('DOMSubtreeModified', ".note-editable", function() {
                    syncUp();
                });

                if (window.location.pathname === "/chapter" || "/chapter/") {
                    if(chapter > 1) {
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

                //Watch for inputs so we can syncUp data to the DB
                $( ".verse_button_prev" ).on( "click", syncUp());
                $( ".verse_button_next" ).on( "click", syncUp());
                $( ".summernote" ).on( "input", syncUp());
            });
        } else {
            
        }
    } else {
        $('body').on('touchstart', function() {});

        $('.verse_button_prev').click(function () {
            let this_button = this;
            var this_verse = $(this_button).attr('id');
            var current = $(this_button).siblings('.verse_button_select').val();
            current--;
            if (current < 0) {
                current = translations.length - 1;
            }
            $(this_button).siblings('.verse_button_select').attr('value', current);
            $(this_button).siblings('.verse_button_select').text(translations[current]);
            $.getJSON("/Bibles/" + translations[current] + "/" + book +"/" + chapter + ".json", function(chapter_data) {
                var new_verse_text = chapter_data[this_verse];
                $(this_button).parents('.verse').find('.verse_text').text(new_verse_text);
                syncUp();
            });
        });

        $('.verse_button_next').click(function () {
            let this_button = this;
            var this_verse = $(this_button).attr('id');
            var current = $(this_button).siblings('.verse_button_select').val();
            current++;
            if (current >= translations.length) {
                current = 0;
            }
            $(this_button).siblings('.verse_button_select').attr('value', current);
            $(this_button).siblings('.verse_button_select').text(translations[current]);
            $.getJSON("/Bibles/" + translations[current] + "/" + book +"/" + chapter + ".json", function(chapter_data) {
                var new_verse_text = chapter_data[this_verse];
                $(this_button).parents('.verse').find('.verse_text').text(new_verse_text);
                syncUp();
            });
        });

        $('.add_note').click(function () {
            if($(this).attr('value') === '0') {
                if( $(this).parent().parent().find('.summernote').length == 0) {
                    $(this).parent().parent().append("<div class='note my-2 w-100 justify-content-center col-md-8'><div class='summernote'></div></div></div>");
                    $(this).parent().parent().find('.summernote').summernote({
                        airMode: true,
                        popover: {
                            air: [
                            ]
                        }
                    });
                    $(this).parent().parent().find('.note-editable').addClass("chapter_text rounded bg-light py-2 px-3 my-0");
                    $(this).parent().parent().find('.note-editable').children().addClass("my-0");
                    $(this).parent().parent().find('.summernote').summernote('focus');
                    $(this).text(' ❌ ');
                    $(this).attr('value', '1');
                }
            } else {
                $(this).parent().parent().find('.note').remove();
                $(this).text(' 📝 ');
                $(this).attr('value', '0');
            }
        });

        $("body").on('DOMSubtreeModified', ".note-editable", function() {
            syncUp();
        });

        if (window.location.pathname === "/chapter/") {
            if(chapter > 1) {
                chapter--;
                $("#previous").find('button').text("Chapter " + chapter);
                $("#previous").attr("href", window.location.protocol + "//" + window.location.host + "/chapter/?tr=" + translation + "&bk=" + book + "&ch=" + chapter);
                $("#previous").removeClass("d-none");
                chapter++;
            } 
            var chap_in_book = num_chapters[books.indexOf(book)];
            if (chapter < chap_in_book) {
                chapter++
                $("#next").find('button').text("Chapter " + chapter);
                $("#next").attr("href", window.location.protocol + "//" + window.location.host + "/chapter/?tr=" + translation + "&bk=" + book + "&ch=" + chapter);
                $("#next").removeClass("d-none");
                chapter--;
            }
        }

        //Watch for inputs so we can syncUp data to the DB
        $( ".verse_button_prev" ).on( "click", syncUp());
        $( ".verse_button_next" ).on( "click", syncUp());
        $( ".summernote" ).on( "input", syncUp());
    }
}