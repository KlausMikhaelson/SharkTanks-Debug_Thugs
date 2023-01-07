'use strict';

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);


const FIELD_WIDTH = 5000, FIELD_HEIGHT = 5000;
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
        if(this.x < -5000 || this.x + this.width >= FIELD_WIDTH || this.y < -5000 || this.y + this.height >= FIELD_HEIGHT){
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


app.use(express.static("public"));

const port = 3001;
server.listen(port, () => {
  console.log(`Starting server on port ${port}`);
});
