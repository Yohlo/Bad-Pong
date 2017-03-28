var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60) // 60 fps!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    };
var canvas = document.createElement("canvas");
var WIDTH = 400;
var HEIGHT = 600;
canvas.width = WIDTH;
canvas.height = HEIGHT;
var context = canvas.getContext('2d');

// initialize game components 
var player = new Player();
var computer = new Computer();
var ball = new Ball(WIDTH/2, HEIGHT/2);

var keysDown = {};

var render = function () {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    player.render();
    computer.render();
    ball.render();
};

var update = function () {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
};

var step = function () {
    update();
    render();
    animate(step);
};

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
	this.score = 0;
}

Paddle.prototype.render = function () {
    context.fillStyle = "#FFFFFF";
    context.fillRect(this.x, this.y, this.width, this.height);
	context.fillText(this.score, WIDTH/2, HEIGHT/2 + (this.y/50))
};

Paddle.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if (this.x < 0) {
        this.x = 0;
        this.x_speed = 0;
    } else if (this.x + this.width > WIDTH) {
        this.x = WIDTH - this.width;
        this.x_speed = 0;
    }
};

function Computer() {
    this.paddle = new Paddle(WIDTH/2 - 25, HEIGHT-20, 50, 10);
}

Computer.prototype.render = function () {
    this.paddle.render();
};

Computer.prototype.update = function (ball) {
    var x_pos = ball.x;
    var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
    if (diff < 0 && diff < -4) {
        diff = -5;
    } else if (diff > 0 && diff > 4) {
        diff = 5;
    }
    this.paddle.move(diff, 0);
    if (this.paddle.x < 0) {
        this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > WIDTH) {
        this.paddle.x = WIDTH - this.paddle.width;
    }
};

function Player() {
    this.paddle = new Paddle(WIDTH/2-25, 10, 50, 10);
}

Player.prototype.render = function () {
    this.paddle.render();
};

Player.prototype.update = function () {
    for (var key in keysDown) {
        var value = Number(key);
        if (value == 37) {
            this.paddle.move(-4, 0);
        } else if (value == 39) {
            this.paddle.move(4, 0);
        } else {
            this.paddle.move(0, 0);
        }
    }
};

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = -3;
}

Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, 5, 2 * Math.PI, false);
    context.fillStyle = "#FFFFFF";
    context.fill();
};

Ball.prototype.update = function (paddle1, paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;

    if (this.x - 5 < 0) {
        this.x = 5;
        this.x_speed = -this.x_speed;
    } else if (this.x + 5 > WIDTH) {
        this.x = WIDTH - 5;
        this.x_speed = -this.x_speed;
    }

    if (this.y < 0) {
        this.x_speed = 0;
        this.y_speed = -3;
        this.x = WIDTH/2;
        this.y = HEIGHT/2;
		paddle2.score += 1
    } else if (this.y > HEIGHT) {
		this.x_speed = 0;
        this.y_speed = -3;
        this.x = WIDTH/2;
        this.y = HEIGHT/2;
		paddle1.score += 1
	}

    if (top_y < HEIGHT/2) {
        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed = 3;
            this.x_speed += (paddle1.x_speed/2);
            this.y += this.y_speed;
        }
    } else {
        if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
            this.y_speed = -3;
            this.x_speed += (paddle2.x_speed/2);
            this.y += this.y_speed;
        }
    }
};

document.body.appendChild(canvas);
animate(step);

window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});
