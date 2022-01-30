const texts = [
    "Charles Babbage",
    "Dennis Ritchie",
    "Linus Torvalds",
    "John McCarthy",
];

const form = document.getElementById("searchForm");
typeWriter();

let i = 0;
let j = 0;
function typeWriter() {
    texts.reduce(
        (promise, text) => promise.then((_) => drawText(text)),
        Promise.resolve()
    );
}

function drawText(text) {
    i = 0;
    j++;
    return new Promise((resolve) => {
        form.placeholder = "";
        const letters = text.split("");
        letters.reduce(
            (promise, letter, i) =>
                promise.then((_) => {
                    if (i === letters.length - 1) {
                        setTimeout(resolve, 1000);
                    }
                    return addChar(letter, letters.length, i);
                }),
            Promise.resolve()
        );
    });
}

function addChar(letter, len) {
    form.placeholder += letter;
    i++;
    if (i === len && j === texts.length) {
        j = 0;
        setTimeout(typeWriter, 1000);
    }
    return new Promise((resolve) => setTimeout(resolve, 100));
}
