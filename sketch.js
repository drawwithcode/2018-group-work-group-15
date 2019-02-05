//Define variables
let inputs = [];
let anxietyMod = 0;
let barImg;
let pillImg;
let font;
let hit = false;
let bar = 0;
let tutorial = 0;
let spaceD = 0;
let start = false;
let end = false;
let mySounds = [];


//Define the pointer object
const Mouse = {
    position: [window.innerWidth / 2, window.innerHeight / 2],
    update: function () {
        this.position[0] < 0 ? this.position[0] = 0 : null;
        this.position[1] < 0 ? this.position[1] = 0 : null;
        this.position[0] > width ? this.position[0] = width : null;
        this.position[1] > height ? this.position[1] = height : null;
    },
    drawExtra: function () {},
    draw: function () {
        push()
        noStroke();
        fill('#fff');
        ellipseMode(CENTER);
        ellipse(...this.position, 20)
        pop();
    },
    get x() {
        return this.position[0]
    },
    get y() {
        return this.position[1]
    },
}

//Define the Circle object constructor
const Circle = function () {
    this.position = [random(40, width - 40), random(40, height - 70)];
    this.update = function (i, arr) {

        anxietyMod += 0.005;

        this.position[0] += random(-1, 1);
        this.position[1] += random(-1, 1);
        if (this.mouseIsOn() && inputs.includes(LEFT))
            arr.splice(i, 1)

    }
    this.drawExtra = function () {
        push();

        this.mouseIsOn() ? fill('#fff5') : noFill();

        stroke(color(random(255), random(255), random(255), 100));
        strokeWeight(3);
        ellipseMode(CENTER);
        let p = [this.position[0] + random(-5, 5), this.position[1] + random(-5, 5)]
        ellipse(...p, 40);
        pop();
    }
    this.draw = function () {
        push();

        this.mouseIsOn() ? fill('#fff5') : noFill();

        stroke('white');
        strokeWeight(3);
        ellipseMode(CENTER);
        let p = [this.position[0], this.position[1]]
        ellipse(...p, 40);
        pop();
    }
    this.mouseIsOn = function () {
        return dist(Mouse.x, Mouse.y, this.position[0], this.position[1]) < 20;

    }
}

//Define the Pill object constructor
const Pill = function () {
    this.position = [random(40, width - 40), random(40, height - 70)];
    this.update = function (i, arr) {
        if (this.mouseIsOn()) {
            anxietyMod -= 1;
            arr.splice(i, 1)
            for (let j = 0; j < 10; j++) {
                let ri = ~~random(arr.length - 1);
                if (arr[ri] instanceof Circle)
                    arr.splice(ri, 1)
            }
        }

    }
    this.drawExtra = function () {}
    this.draw = function () {
        push();
        imageMode(CENTER)
        image(pillImg, ...this.position);

        pop();
    }
    this.mouseIsOn = function () {
        return dist(Mouse.x, Mouse.y, ...this.position) < 20;

    }
}

//Define the Bullet object constructor
const Bullet = function () {
    this.position = function () {
        switch (~~random(0, 3)) {
            case 0:
                return [0, random(height)];
                break;
            case 1:
                return [width, random(height)];
                break;
            case 2:
                return [random(width), 0];
                break;
            case 3:
                return [random(width), height];
                break;
        }
    }();
    this.update = function (i, arr) {


        {

            let i = dist(Mouse.x, Mouse.y, this.position[0], this.position[1]);
            let c1 = Mouse.x - this.position[0];
            let c2 = Mouse.y - this.position[1];
            let cos = c1 / i;
            let sin = c2 / i;
            this.position[0] += (cos) * 5;
            this.position[1] += (sin) * 5;
        }

        if (this.touch()) {
            anxietyMod += 0.05;
            arr.splice(i, 1);
            hit = true;
        } else {

            if (this.inReach() && inputs.includes(32) && spaceD === 0)
                arr.splice(i, 1);
        }

    }
    this.draw = function () {
        push();
        fill('white');
        noStroke();
        ellipseMode(CENTER);
        let p = [this.position[0], this.position[1]]
        ellipse(...p, 7);
        pop();
    }
    this.drawExtra = function () {
        push();
        fill(color(random(255), random(255), random(255)));
        noStroke();
        ellipseMode(CENTER);
        let p = [this.position[0] + random(-5, 5), this.position[1] + random(-5, 5)]
        ellipse(...p, 7);
        pop();
    }
    this.inReach = function () {
        return dist(Mouse.x, Mouse.y, this.position[0], this.position[1]) < 50;
    }

    this.touch = function () {
        return dist(Mouse.x, Mouse.y, this.position[0], this.position[1]) < 10;
    }
}

//Define the Bar object constructor
const Bar = function () {
    let val = 0.1;
    let acc = 0;
    this.drawExtra = function () {};

    this.draw = function () {
        push();
        stroke('white');
        strokeWeight(3);
        image(barImg, 0, height - 20, width, 20);
        line((width / 2) + val, height - 30, (width / 2) + val, height + 30)
        pop();
    }

    this.update = function () {
        val > 0 ? acc += (0.025 + (anxietyMod / 100)) : acc -= (0.025 + (anxietyMod / 100));
        if (inputs.includes(65))
            acc -= 5;
        if (inputs.includes(68))
            acc += 5;

        // val > 0 ? val+=(acc+(anxietyMod/2)) : val+=(acc-(anxietyMod/2));
        val += acc;
        if (Math.abs(val) > width / 4) {
            anxietyMod += 0.01;
            bar++;
            bar > 255 ? bar = 255 : null;
        } else {
            bar--;
            bar < 0 ? bar = 0 : null;
        };

        if (anxietyMod < 0)
            anxietyMod = 0;

        val < -width / 2 ? val = -width / 2 : null;
        val > width / 2 ? val = width / 2 : null;

    }
}

//Define the Game Implementation object constructor
const GameI = function () {
    let entities = [Mouse];
    let nextCircle = 300;
    let nextBullet = 600;
    let nextPill = 1200;

    this.init = function () {
        entities = [Mouse];
        nextCircle = 300;
        nextBullet = 600;
        nextPill = 1200;
        anxietyMod = 0;
        hit = false;
        bar = 0;
        spaceD = 0;
        start = false;
        this.addEntity(new Bar());
        Mouse.position = [window.innerWidth / 2, window.innerHeight / 2];
        mySounds[1].stop();
        mySounds[1].loop();
        mySounds[0].stop();
    }

    this.addEntity = function (newEntity) {
        entities.push(newEntity);
    }

    this.update = function () {
        entities.some(e => e instanceof Circle) ? /*anxietyMod += 0.005*/ null : anxietyMod -= 0.025;
        if (anxietyMod < 0)
            anxietyMod = 0;

        if (nextCircle <= 0) {
            nextCircle = random(50, 200) - (milliss() / 1000);

            this.addEntity(new Circle())
        } else {
            nextCircle--;
        }

        if (nextBullet <= 0) {
            nextBullet = random(200, 500) - (milliss() / 1000);

            this.addEntity(new Bullet())
        } else {
            nextBullet--;
        }

        if (nextPill <= 0) {
            nextPill = random(350, 450) - (milliss() / 1000);

            this.addEntity(new Pill())
        } else {
            nextPill--;
        }

        entities.forEach(function (e, i, arr) {
            e.update(i, arr);
        });
        spaceD > 0 ? spaceD-- : null;
        console.log(anxietyMod)
    };

    this.draw = function () {
        if (inputs.includes(32) && spaceD === 0) {
            spaceD = 60;
            push();
            noFill()
            stroke('#aaaaff');
            strokeWeight(7);
            ellipseMode(CENTER);
            ellipse(Mouse.x, Mouse.y, 50);
            stroke('#ffffff');
            strokeWeight(3);
            ellipse(Mouse.x, Mouse.y, 50);
            pop();
        }
        for (let i = 1; i < 10 && i < anxietyMod; i++) {
            entities.forEach(function (e) {
                e.drawExtra();
            });
        }
        entities.forEach(function (e) {
            e.draw();
        });
        if (hit) {
            fill('red');
            rect(0, 0, width, height);
        }
        if (bar == 255){
            end = true;
            document.exitPointerLock();
            mySounds[1].stop();
            mySounds[2].play();
            mySounds[3].play();
        }
        let tmp = bar.toString(16);
        tmp.length < 2 ? tmp = '0' + tmp : null;
        fill('#ff0000' + tmp)
        rect(0, 0, width, height);

        if (anxietyMod > 10 && frameCount % 50 == 0) {
            fill(color(random(255), random(255), random(255), 100));
            rect(0, 0, width, height);
        }
        if (anxietyMod > 15 && frameCount % 33 == 0) {
            fill(color(random(255), random(255), random(255), 100));
            rect(0, 0, width, height);
        }
        if (anxietyMod > 25 && frameCount % 17 == 0) {
            fill(color(random(255), random(255), random(255), 100));
            rect(0, 0, width, height);
        }
    };

}

//Define the Tutorial Game Implementation object constructor
const TutorialI = function () {
    let entities = [Mouse];
    let nextCircle = 300;
    let nextBullet = 300;
    let nextPill = 300;



    this.step = 0;

    this.init = function () {
        this.step = 0;
        entities = [Mouse];
        anxietyMod = 0;
        hit = false;
        bar = 0;
        spaceD = 0;
        this.addEntity(new Bar());
        Mouse.position = [window.innerWidth / 2, window.innerHeight / 2];
    }

    this.addEntity = function (newEntity) {
        entities.push(newEntity);
    }

    this.update = function () {
        anxietyMod = 0;

        if (this.step > 0) {
            if (nextCircle <= 0) {
                nextCircle = random(100, 200);

                this.addEntity(new Circle())

            } else {
                nextCircle--;
            }
        }

        if (this.step > 1) {
            if (nextBullet <= 0) {
                nextBullet = random(200, 500);

                this.addEntity(new Bullet())
            } else {
                nextBullet--;
            }
        }

        if (this.step > 2) {
            if (nextPill <= 0) {
                nextPill = random(500, 800);

                this.addEntity(new Pill())
            } else {
                nextPill--;
            }
        }


        entities.forEach(function (e, i, arr) {
            e.update(i, arr);
        });
        spaceD > 0 ? spaceD-- : null;
    };

    this.draw = function () {
        if (inputs.includes(32) && spaceD === 0) {
            spaceD = 60;
            push();
            noFill()
            stroke('#aaaaff');
            strokeWeight(7);
            ellipseMode(CENTER);
            ellipse(Mouse.x, Mouse.y, 50);
            stroke('#ffffff');
            strokeWeight(3);
            ellipse(Mouse.x, Mouse.y, 50);
            pop();
        }
        entities.forEach(function (e) {
            e.draw();
        });
        if (hit) {
            hit = false;
        }
    };

}

//Standard p5 preload function
function preload() {
    barImg = loadImage('assets/bar.png');
    pillImg = loadImage('assets/pill.png');
    font = loadFont('assets/GT-America-Bold.otf');
    mySounds[0] = loadSound('assets/loop1.mp3');
    mySounds[1] = loadSound('assets/loop2.mp3');
    mySounds[2] = loadSound('assets/s1.mp3');
    mySounds[3] = loadSound('assets/s2.mp3');
}

let c;
const Game = new GameI();
Game.addEntity(new Bar())

const Tutorial = new TutorialI();

//Standard p5 setup function
function setup() {
    c = createCanvas(windowWidth, windowHeight);
    textFont(font);
    mySounds[0].loop();
    mySounds[1].setVolume(0.01);
    mySounds[0].setVolume(0.02);
    mySounds[2].setVolume(0.5);
    mySounds[3].setVolume(0.02);

}

//Standard p5 draw function
function draw() {
    if (tutorial) {
        //TUTORIAL STARTED
        if (!inputs.includes(81)) {
            background('#112');
            fill('#fff');
            if (document.pointerLockElement === c.elt) {
                //TUTORIAL SCREEN
                let tuttext = [];
                textSize(width / 50);
                switch (tutorial) {
                    case 1:
                        tuttext[0] = "Stay relaxed, press A & D to balance your breath,";
                        tuttext[1] = "don't let the bar get too close to the edges";
                        tuttext[2] = "Press T to continue";
                        inputs.includes(84) ? tutorial++ : null;
                        break;
                    case 2:
                        Tutorial.step = 1;
                        tuttext[0] = "You have one simple task to carry on,";
                        tuttext[1] = "when circles appear just click on them,";
                        tuttext[2] = "easy, right?";
                        tuttext[3] = "Press T to continue";
                        inputs.includes(84) ? tutorial++ : null;
                        break;
                    case 3:
                        Tutorial.step = 2;
                        tuttext[0] = "The world is a unpredictable place,";
                        tuttext[1] = "watch out for the coming splinters and shield yourself with SPACE";
                        tuttext[2] = "press T to continue";
                        inputs.includes(84) ? tutorial++ : null;
                        break;
                    case 4:
                        Tutorial.step = 3;
                        tuttext[0] = "If you think you can take it";
                        tuttext[1] = "you can always press Q to take a break,";
                        tuttext[2] = "or you can resort to the modern solutions";
                        tuttext[3] = "press T to finish";
                        inputs.includes(84) ? tutorial = 0 : null;
                        break;
                }
                for (let i = 0; i < tuttext.length; i++) {
                    text(tuttext[i], (width - textWidth(tuttext[i])) / 2, height * (2 + i) / 10);
                }
                Tutorial.update();
                Tutorial.draw();
            } else {
                //POINTER LOCK REQUIRED SCREEN
                text('Pointer lock is required', (width - textWidth('Pointer lock is required')) / 2, height / 2);
                text('Click to continue', (width - textWidth('Click to continue')) / 2, height * 3 / 4);

            }
            inputs = [];
        } else {
            //PAUSED
            background('#1121');
        }

    } else {
        if (start) {
            if (end) {
                //ENDING SCREEN
                background('#112');
                textSize(width / 30);
                text('Not so easy as it seemed right?', (width - textWidth('Not so easy as it seemed right?')) / 2, height / 2);
                            textSize(width / 50);
                text('Anxiety is overwhelming and any effort to fight it seems useless.', (width - textWidth('Anxiety is overwhelming and any effort to fight it seems useless.')) / 2, height * 3 / 4);

            } else {
                if (document.pointerLockElement === c.elt) {
                    //GAME SCREEN
                    if (!inputs.includes(81)) {
                        background('#112');
                        Game.update();
                        Game.draw();
                        inputs = [];
                        hit = false;
                    } else {
                        background('#1121');
                    }
                } else {
                    //POINTER LOCK REQUIRED SCREEN
                    background('#112');
                    textSize(width / 30);
                    fill('#fff');

                    text('Pointer lock is required', (width - textWidth('Pointer lock is required')) / 2, height / 2);
                    text('Click to continue', (width - textWidth('Click to continue')) / 2, height * 3 / 4);
                }
            }
        } else {
            if (inputs.includes(84)) {
                c.elt.requestPointerLock();
                tutorial = 1;
                Tutorial.init();
            }
            //TITLE SCREEN
            background('#112');
            textSize(width / 9);
            for (let i = 0; i < 2; i++) {
                fill(color(random(255), random(255), random(255), 100));
                text('Axietrip', ((width - textWidth('Axietrip')) / 2) + random(-10, 10), (height / 2) + random(-10, 10));
            }
            fill('#fff');
            text('Axietrip', (width - textWidth('Axietrip')) / 2, height / 2);
            textSize(width / 30);
            text('Click to begin, press T for tutorial', (width - textWidth('Click to begin, press t for tutorial')) / 2, height * 3 / 4);
            textSize(width / 70);
            text('WARNING: This site contains flashing lights and/or colors.', (width - textWidth('WARNING: This site contains flashing lights and/or colors.')) / 2, height * 9 / 10);
            inputs = [];
        }
    }
}

//Handle window resize
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

//Handle mouse presses
function mousePressed() {
    if (!end && document.pointerLockElement !== c.elt)
        c.elt.requestPointerLock();
    if (!start && !tutorial) {
        startMil = millis();
        Game.init();
        c.elt.requestPointerLock();
        start = true;
    }
    inputs.push(mouseButton);
}

//Handle key presses
function keyPressed() {
    inputs.push(keyCode);
}

//Handle key release
function keyReleased() {
    keyCode == 81 ? inputs = [] : null;
}

function milliss() {
    return millis() - startMil;
}

//Handle mouse movement
document.onmousemove = function (e) {
    if (!inputs.includes(81) && (start || tutorial)) {
        Mouse.position[0] += e.movementX + random(-e.movementX * 2, e.movementX * 2);
        Mouse.position[1] += e.movementY + random(-e.movementY * 2, e.movementY * 2);
    }

}
