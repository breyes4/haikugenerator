var Studio = require('stdio');
var RandomWord = require('random-words');
var Syllable = require('syllable');
var Request = require('rest-request');
var RestAPI = new Request('https://api.datamuse.com');



var commands = Studio.getopt({
});

var createRandomLine = function (syllableCount) {
    if (syllableCount === void 0 || syllableCount !== parseInt(syllableCount, 10)) {
        syllableCount = 5;
    }

    var line = '';
    do {
        line = RandomWord() + ' ' + RandomWord() + ' ' + RandomWord();
    } while (Syllable(line) != syllableCount);

    return line;
};


var createLine = function (syllableCount, wordPool) {
    if (syllableCount === void 0 || syllableCount !== parseInt(syllableCount, 10)) {
        syllableCount = 5;
    }

    var line = '';
    var totalSyllableCount = 0;
    do {
        line += ' ' + wordPool[Math.floor(Math.random() * wordPool.length)].word;
        totalSyllableCount = Syllable(line);

        if (totalSyllableCount > syllableCount) {
            line = '';
            totalSyllableCount = 0;
        }
    } while (totalSyllableCount < syllableCount);

    return line.trim();
};

var randomHaiku = function () {
    var haiku = [
        createRandomLine(5),
        createRandomLine(7),
        createRandomLine(5)
    ];

    console.log(haiku);
};

var haiku = function (mainWords) {

    RestAPI.get('/words', {rel_jja: mainWords, max: 100})
        .then(
            function (words) {
                // TODO: this can come back null, handle the error
                var wordPool = words;

                /**
                 *
                 */
                var haiku = [
                    createLine(5, wordPool),
                    createLine(7, wordPool),
                    createLine(5, wordPool)
                ];

                console.log(haiku);
            },
            function () {
                console.log('There\'s an error with something?');
            }

        );
};



/* Main command */
if (commands.all_random) {
    randomHaiku();
} else {
    // if there's no words requested, the haiku will be all random words
    if (!commands.theme) {
        randomHaiku();
    } else {
        haiku(commands.args);
    }
    $("p#haiku").text(randomHaiku);
}
