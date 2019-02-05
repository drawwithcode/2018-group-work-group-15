![Header](imgs/logo.png)

### Developed by:
* Beatrice Curti
* Emanuele Leonardi
* Matteo Tarda

### Course:
[Creative Coding 2018/2019](https://drawwithcode.github.io/2018/)<br>
**Politecnico di Milano** - Scuola del Design<br>
**Faculty:** Michele Mauri, Tommaso Elli

![Recap](imgs/recap.gif)

## Project idea

The main concept behind our project is Anxiety, not everyday anxiety but unreasonable levels of anxiety that affect many of us and make it difficult to complete even simple tasks.<br>
We want to raise awareness on anxiety disorders through a simple interaction that shows how hard it is to keep up when not in complete control of ourselves.

## Developement

To keep the code simple and easy to read we went with a more object oriented structure, so that the core of the **draw loop** is:
```
Game.update();
Game.draw();
```
While the rest of the code in the function is used to handle other parts of the sketch like Title Screen, Ending Screen...

### Game object

The Game object contains the list of entites, some timers and the functions to update and draw the entities:

```
const GameI = function () {
    let entities;
    let nextCircle;
    let nextBullet;
    let nextPill;

    this.init = function () {...}

    this.addEntity = function (newEntity) {...}

    this.update = function () {...};

    this.draw = function () {...};

}
```

Since our solution is object oriented, the **draw** and **update** functions mainly just call the same named functions in our Entities, as we can see in the next section.

### Entity objects

All the entities have the same functions used to **update** and **draw** them and some also have other *utility* functions.



```
const Bar = function () {
    let val = 0.1;
    let acc = 0;
    
    this.drawExtra = function () {};

    this.draw = function () {...}

    this.update = function () {...}
}
```
```
const Bullet = function () {
    this.position = function () {...}();
    
    this.update = function (i, arr) {...}
    
    this.draw = function () {...}
    
    this.drawExtra = function () {...}
    
    this.inReach = function () {...}

    this.touch = function () {...}
}
```
```
const Pill = function () {
    this.position = [...];
    
    this.update = function (i, arr) {...}
    
    this.drawExtra = function () {}
    
    this.draw = function () {...}
    
    this.mouseIsOn = function () {...}
}
```
```
const Circle = function () {
    this.position = [...];
    
    this.update = function (i, arr) {...}
    
    this.drawExtra = function () {...}
    
    this.draw = function () {...}
    
    this.mouseIsOn = function () {...}
}
```


## Challenges

The main challenge was to design the right interactions for the feelings that we're trying to convey.