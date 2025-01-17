let img1 = new Image(50, 50);
img1.src = "Canny.webp";
let img2 = new Image(50, 50);
img2.src = "Uncanny.webp";
let img3 = new Image(50, 50);
img3.src = "Uncanny2.webp";

let correct = new Audio('correct.mp3');

let wrong = new Audio('wrong.mp3');

let sz = 50;
let ch = 150;
let velocity = 10/60;

function updateCharacters(arr, dt, canvas) {
    arr.forEach(e => {
        e.pos.x += e.v.x * dt;
        e.pos.y += e.v.y * dt;
        if((e.v.x < 0 && e.pos.x < 0)
             || (e.v.x > 0 && e.pos.x > canvas.width - sz)) e.v.x *= -1;
        if((e.v.y < 0 && e.pos.y < 0)
             || (e.v.y > 0 && e.pos.y > canvas.height - sz)) e.v.y *= -1;
    });
}

function createCharacter(sz, pos, vel, char) {
    return {
        "size": sz,
        "pos": pos,
        "v": vel,
        "z": Math.random(),
        "c": char
    };
}

function getFile(selectorID) {
    return document.getElementById(selectorID).files[0];
}

const characters = {
    "find": [],
    "c1": [],
    "c2": []
};
let drawChars = [];
let mainLoop = null;
function reload() {
    sz = Number.parseInt(document.getElementById("sz").value);
    ch = Number.parseInt(document.getElementById("n").value);
    velocity = Number.parseInt(document.getElementById("vel").value)/60;
    characters.find = [];
    characters.c1 = [];
    characters.c2 = [];
    drawChars = [];

    let c1 = getFile("file1");
    let c2 = getFile("file2");
    let c3 = getFile("file3");
    if(c1 !== undefined) img1.src = URL.createObjectURL(c1);
    if(c2 !== undefined) img2.src = URL.createObjectURL(c2);
    if(c3 !== undefined) {
        img3.src = URL.createObjectURL(c3);
        document.getElementById("wimg").src = img3.src;
    }

    let a = document.getElementById("wanted");
    a.width = document.getElementById("w").value;
    a.height = document.getElementById("h").value;
    a.onmousedown = a.ontouchstart = (e) => {
        let x = characters["find"][0].pos.x;
        let y = characters["find"][0].pos.y;
        console.log(e.offsetX - x);
        console.log(e.offsetY - y);
        if (e.offsetX <= x + sz && e.offsetX >= x &&
                e.offsetY <= y + sz && e.offsetY >= y) {
            correct.play();
            document.getElementById("correct").style = "opacity: 1;";
            setTimeout(() => {
                document.getElementById("correct").style = "opacity: 0;";
            }, 1500);
        } else {
            wrong.play();
            document.getElementById("wrong").style = "opacity: 1;";
            setTimeout(() => {
                document.getElementById("wrong").style = "opacity: 0;";
            }, 1500);
        }
    };

    function newChar(char) {
        const angle = Math.random() * Math.PI * 2;
        return createCharacter(sz,
            {'x': Math.random() * (a.width - sz - 100) + 50, 'y': Math.random() * (a.height - sz - 100) + 50},
            {'x': Math.cos(angle) * velocity, 'y': Math.sin(angle) * velocity},
            char
        );
    }

    characters["find"].push(newChar());
    for(let i = 0; i < ch; i++) {
        characters["c1"].push(newChar(1));
        characters["c2"].push(newChar(2));
    }

    drawChars = drawChars.concat(characters["c1"]).concat(characters["c2"]);
    drawChars.sort((a, b) => a.z - b.z);

    if(mainLoop !== null) clearInterval(mainLoop);
    mainLoop = setInterval(() => updateGame(a), 1000/60);
    const g = a.getContext("2d");
    window.requestAnimationFrame(() => {drawCanvas(a, g)});
}

let frameTime = 0, lastFrame = new Date, thisFrame;

function updateGame(canvas) {
    thisFrame = new Date;
    let thisFrameTime = thisFrame - lastFrame;
    frameTime += (thisFrameTime - frameTime);
    lastFrame = thisFrame;
    if(thisFrameTime > 200) thisFrameTime = 200;

    updateCharacters(characters["find"], thisFrameTime, canvas);
    updateCharacters(characters["c1"], thisFrameTime, canvas);
    updateCharacters(characters["c2"], thisFrameTime, canvas);
}

function drawCanvas(canvas, g) {
    g.clearRect(0, 0, canvas.width, canvas.height);
    // draw first
    characters["find"].forEach(e => {
        g.drawImage(img3, e.pos.x, e.pos.y, sz, sz);
    });
    drawChars.forEach(e => {
        g.drawImage(e.c == 1 ? img1:img2, e.pos.x, e.pos.y, sz, sz);
    });
    window.requestAnimationFrame(() => {drawCanvas(canvas, g)});
}

window.onload = () => {
    reload();
};
