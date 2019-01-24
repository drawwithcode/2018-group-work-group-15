let inputs = [];
let anxietyMod = 0;
let barImg;
let pillImg;
let hit = false;
let bar = 0;
let spaceD = 0;

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

        stroke(color(random(255), random(255), random(255)));
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

const Pill = function () {
    this.position = [random(40, width - 40), random(40, height - 70)];
    this.update = function (i, arr) {
        if (this.mouseIsOn()) {
            anxietyMod -= 1;
            arr.splice(i, 1)
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
        }else{

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

const GameI = function () {
    let entities = [Mouse];
    let nextCircle = 300;
    let nextBullet = 600;
    let nextPill = 1200;

    this.addEntity = function (newEntity) {
        entities.push(newEntity);
    }

    this.update = function () {
        entities.some(e => e instanceof Circle) ? /*anxietyMod += 0.005*/ null : anxietyMod -= 0.025;
        if (anxietyMod < 0)
            anxietyMod = 0;

        if (nextCircle <= 0) {
            nextCircle = random(50, 200) - (millis() / 1000);

            this.addEntity(new Circle())
        } else {
            nextCircle--;
        }

        if (nextBullet <= 0) {
            nextBullet = random(200, 500) - (millis() / 1000);

            this.addEntity(new Bullet())
        } else {
            nextBullet--;
        }

        if (nextPill <= 0) {
            nextPill = random(350, 450) - (millis() / 1000);

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

function preload() {
    barImg = loadImage('assets/bar.png');
    pillImg = loadImage('assets/pill.png');
}

let c;
const Game = new GameI();
Game.addEntity(new Bar())

function setup() {
    c = createCanvas(windowWidth, windowHeight);
    c.elt.requestPointerLock();

}

function draw() {
    if (!inputs.includes(81)){
        background('#112');
        Game.update();
        Game.draw();
        inputs = [];
        hit = false;
    }else{
        background('#1121');
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    if (document.pointerLockElement !== c.elt) c.elt.requestPointerLock()
    inputs.push(mouseButton);
}

function keyPressed() {
    inputs.push(keyCode)
}
function keyReleased() {
    keyCode == 81 ? inputs = [] : null;
}

document.onmousemove = function (e) {
    Mouse.position[0] += e.movementX + random(-e.movementX * 2, e.movementX * 2);
    Mouse.position[1] += e.movementY + random(-e.movementY * 2, e.movementY * 2);

}
