'use strict';

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);


const ground_width = 2500, ground_height = 2500;
class GameObject {
    constructor(obj = {}) {
        this.id = Math.floor(Math.random() * 1000000000);
        this.x = obj.x;
        this.y = obj.y;
        this.width = obj.width;
        this.height = obj.height;
        this.angle = obj.angle;
    }
    move(distance) {
        const oldX = this.x, oldY = this.y;

        this.x += distance * Math.cos(this.angle);
        this.y += distance * Math.sin(this.angle);

        let collision = false;
        if (this.x < -2500 || this.x + this.width >= ground_width || this.y < -2500 || this.y + this.height >= ground_height) {
            collision = true;
        }
        if (this.intersectWalls()) {
            collision = true;
        }
        if (collision) {
            this.x = oldX; this.y = oldY;
        }
        return !collision;
    }
    intersect(obj) {
        return (this.x <= obj.x + obj.width) &&
            (this.x + this.width >= obj.x) &&
            (this.y <= obj.y + obj.height) &&
            (this.y + this.height >= obj.y);
    }
    intersectWalls() {
        return Object.values(walls).some((wall) => this.intersect(wall));
    }
    toJSON() {
        return { id: this.id, x: this.x, y: this.y, width: this.width, height: this.height, angle: this.angle };
    }
}



class Player extends GameObject {
    constructor(obj = {}) {
        super(obj);
        this.socketId = obj.socketId;
        this.nickname = obj.nickname;
        this.width = 80;
        this.height = 80;
        this.health = this.maxHealth = 10;
        this.bullets = {};
        this.point = 0;
        this.movement = {};

        do {
            this.x = Math.random() * (ground_width - this.width);
            this.y = Math.random() * (ground_height - this.height);
            this.angle = Math.random() * 2 * Math.PI;
        } while (this.intersectWalls());
    }
    shoot() {
        if (Object.keys(this.bullets).length >= 10) {
            return console.log("reloading");
        }
        const bullet = new Bullet({
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            angle: this.angle,
            player: this,
        });
        bullet.move(this.width / 2);
        this.bullets[bullet.id] = bullet;
        bullets[bullet.id] = bullet;
    }
    damage() {
        this.health--;
        if (this.health === 0) {
            this.remove();
        }
    }
    remove() {
        delete players[this.id];
        io.to(this.socketId).emit('dead');
    }
    toJSON() {
        return Object.assign(super.toJSON(), { health: this.health, maxHealth: this.maxHealth, socketId: this.socketId, point: this.point, nickname: this.nickname });
    }
}
class Bullet extends GameObject {
    constructor(obj) {
        super(obj);
        this.width = 15;
        this.height = 15;
        this.player = obj.player;
    }
    remove() {
        delete this.player.bullets[this.id];
        delete bullets[this.id];
    }
}
class BotPlayer extends Player {
    constructor(obj) {
        super(obj);
        this.timer = setInterval(() => {
            if (!this.move(4)) {
                this.angle = Math.random() * Math.PI * 2;
            }
            if (Math.random() < 0.03) {
                this.shoot();
            }
        }, 1000 / 30);
    }
    remove() {
        super.remove();
        clearInterval(this.timer);
        setTimeout(() => {
            const bot = new BotPlayer({ nickname: this.nickname });
            players[bot.id] = bot;
        }, 3000);
    }
}
class Wall extends GameObject {
}

let players = {};
let bullets = {};
let walls = {};


const wall1 = new Wall({
    x: 0,
    y: 2,
    width: 200,
    height: 1000,

})
walls[wall1.id] = wall1;

const wall2 = new Wall({
    x: 1000,
    y: 100,
    width: 200,
    height: 1000,

})
walls[wall2.id] = wall2;

const wall3 = new Wall({
    x: 2000,
    y: 1000,
    width: 200,
    height: 1000,
})
walls[wall3.id] = wall3;

const wall4 = new Wall({
    x: -1000,
    y: -1000,
    width: 200,
    height: 1000,
})
walls[wall4.id] = wall4;

const wall5 = new Wall({
    x: -1500,
    y: 700,
    width: 200,
    height: 1000,
})
walls[wall5.id] = wall5;


const bot = new BotPlayer({ nickname: 'bot' });
players[bot.id] = bot;



io.on('connection', function (socket) {
    let player = null;
    socket.on('game-start', (config) => {
        player = new Player({
            socketId: socket.id,
            nickname: config.nickname,
        });
        players[player.id] = player;
    });
    socket.on('movement', function (movement) {
        if (!player || player.health === 0) { return; }
        player.movement = movement;
    });
    socket.on('shoot', function () {
        if (!player || player.health === 0) { return; }
        player.shoot();
    });
    socket.on('disconnect', () => {
        if (!player) { return; }
        delete players[player.id];
        player = null;
    });
});

setInterval(() => {
    Object.values(players).forEach((player) => {
        const movement = player.movement;
        if (movement.forward) {
            player.move(20);
        }
        if (movement.back) {
            player.move(-20);
        }
        if (movement.left) {
            player.angle -= 0.05;
        }
        if (movement.right) {
            player.angle += 0.05;
        }
    });
    Object.values(bullets).forEach((bullet) => {
        if (!bullet.move(50)) {
            bullet.remove();
            return;
        }
        Object.values(players).forEach((player) => {
            if (bullet.intersect(player)) {
                if (player !== bullet.player) {
                    player.damage();
                    bullet.remove();
                    bullet.player.point += 1;
                }
            }
        });
    });
    io.sockets.emit('state', players, bullets, walls);
}, 1000 / 30);


app.use(express.static("public"));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Starting server on port ${PORT}`);
});
