'use strict';

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);


const ground_width = 5000, ground_height = 5000;
class GameObject{
    constructor(obj={}){
        this.id = Math.floor(Math.random()*1000000000);
        this.x = obj.x;
        this.y = obj.y;
        this.width = obj.width;
        this.height = obj.height;
        this.angle = obj.angle;
    }
    move(distance){
        const oldX = this.x, oldY = this.y;
        
        this.x += distance * Math.cos(this.angle);
        this.y += distance * Math.sin(this.angle);
        
        let collision = false;
        if(this.x < -5000 || this.x + this.width >= ground_width || this.y < -5000 || this.y + this.height >= ground_height){
            collision = true;
        }
        if(this.intersectWalls()){
            collision = true;
        }
        if(collision){
            this.x = oldX; this.y = oldY;
        }
        return !collision;
    }
    intersect(obj){
        return (this.x <= obj.x + obj.width) &&
            (this.x + this.width >= obj.x) &&
            (this.y <= obj.y + obj.height) &&
            (this.y + this.height >= obj.y);
    }
    intersectWalls(){
        return Object.values(walls).some((wall) => this.intersect(wall));
    }
    toJSON(){
        return {id: this.id, x: this.x, y: this.y, width: this.width, height: this.height, angle: this.angle};
    }
}

class Player extends Game{
    constructor(obj={}) {
        super(obj);
        this.socketId = obj.socketId;
        this.name = obj.name;
        this.width = 100;
        this.height = 100;
        this.health = this.maxHealth = 10;
        this.bullets = {};
        this.point = 0;

        do {
            this.x = Math.random() * (ground_width - this.width);
            this.y = Math.random() * (ground_height - this.height);
            this.angle = Math.random() * 2 * Math.PI;

        } while (this.intersectWalls());

    }
    shoots() {
        if(Object.keys(this.bullets).length >= 5) {
            return console.log("reloading")
        }
        const bullet = new Bullet ({
            x: this.x + this.width/2,
            y: this.y + this.height/2,
            angle: this.angle,
            player: this,
        });
        bullet.move(this.width/2);
        this.bullets[bullet.id] = bullet;
        bullets[bullet.id] = bullet;
    } 
    damage() {
        this.health -= 1;
        if(this.health === 0) {
            this.remove();
        }
    }
}

app.use(express.static("public"));

const port = 3001;
server.listen(port, () => {
  console.log(`Starting server on port ${port}`);
});
