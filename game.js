window.onload = first;

var Width = 500, Height = 600, key_left = 37, key_right = 39;
var canvas, ctx, keyState, score, best, lose, dx = 3, dy = 3, sw,

bar = {
	x : null,
	y : null,
	width : 100,
	height : 20,
	
	update : function() {
		if(keyState[key_left])
			this.x -= 15;		//move the bar to left
		if(keyState[key_right])
			this.x += 15;		//move the bar to right
		this.x = Math.max(Math.min(this.x, Width - this.width), 0);   //for the bar to not leave the frame
	},
	
	draw : function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);		//draw the bar
	}
},

ball = {
	x : null,
	y : null,
	side : 20,
	
	update : function() {
		
		this.x = this.x + dx;
		if(this.x > Width - this.side) {   //if the bar reaches the right side
			this.x -= 2 *Math.abs(dx);     //turn the ball
			if(dx > 0)
				dx = -dx;   //change the sign of dx to move the other way
		}
		if(this.x < 0) {   //if the bar reaches the left side
			this.x += 2 * Math.abs(dx);    //turn the ball
			if(dx < 0)
				dx = -dx;   //change the sign of dx to move the other way
		}
		
		this.y = this.y + dy;
		if(this.y > Height - 2 * bar.height) {  //if the  ball reaches the bar level
			if((this.x < bar.x - this.side + 1) || this.x > (bar.x + bar.width + this.side -1))   //if the ball doesn't touch the bar
				lose = true;
			else {
				score++;
				if(score%5 == 0)   //increase the speed at every 5 points made
				{	dx+=2;
					dy+=2;
				}
				this.y = 0;
				this.x = rand_ball();
			}
		}
	},
	
	draw : function() {   //draw the ball
		ctx.beginPath();
		ctx.arc(this.x, this.y, 10, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
	}
};

function create_canvas(){
	canvas = document.createElement("canvas");
	canvas.width = Width;
	canvas.height = Height;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
}

function first() {
	set_title(document.getElementById("title"));
	best = -1;
	initialize();
	create_canvas();
	sw = document.getElementById("checkb");
	sw.checked = false;
	draw();
	ctx.fillStyle = "#FFFFCC";
	ball.draw();
}

function rand_ball(){	//get a random position where the ball to start
	return Math.floor(Math.random() * 491);
}

function initialize() {	 //initialize the coords, score
	score = 0;
	lose = false;
	bar.y = Height - bar.height - 10;
	bar.x = (Width - bar.width)/2;
	ball.y = 0;
	ball.x = rand_ball();
}

function main() {
	keyState = {};   // keep track of keyboard presses
	document.addEventListener("keydown", function(evt) {
		keyState[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keyState[evt.keyCode];
	})
	
	initialize();
	
	var repeat = function() {
		update();
		draw();
		if(lose)
			game_over();
		else
			window.requestAnimationFrame(repeat, canvas);
	};
	window.requestAnimationFrame(repeat, canvas);
}

function update() {  //update the ball position
	bar.update();
	ball.update();
}

function draw() {    //draw the canvas, the bar, the ball, the score
	ctx.font = "30px Verdana";
	if(sw.checked) {
		ctx.fillStyle = "#676761";
		ctx.fillRect(0, 0, Width, Height);
		ctx.save();
		ctx.fillStyle = "#DB944D";
		bar.draw();
		ctx.fillStyle = "#FF4719";
		ball.draw();
	}
	else {
		ctx.fillStyle = "#FFFFCC";
		ctx.fillRect(0, 0, Width, Height);
		ctx.save();
		ctx.fillStyle = "#663D00";
		bar.draw();
		ctx.fillStyle = "#4C0000";
		ball.draw();
	}
	ctx.fillStyle = "#FF6600";
	ctx.fillText("Score: " + score, 345, 32);
	ctx.restore();
}

function update_best() {
	var highSc = document.getElementById("highScore");
	if(score > best) {
		best = score;
		highSc.innerHTML = "High Score: " + best;
	}
}

function game_over() {
	update_best();
	ctx.font = "50px Verdana";
	ctx.fillStyle = "black";
	ctx.fillText("Game Over!", 100, 250);
	dx = 3;
	dy = 3;
}

function set_title(title) {
	title.style.position = "absolute";
	title.style.left = "36%";
	title.style.right =  "36%";
	title.style.bottom = "40%";
	title.style.font = "65px Verdana";
	title.style.color = "black";
	title.style.zIndex = "2";
	setTimeout(function() { title.parentNode.removeChild(title); }, 3000);
	clearTimeout();
}