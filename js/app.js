// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.init();
};

// Initializes enemy's position and travel speed
Enemy.prototype.init = function() {
    var X_START_POSITION = -101;
    var Y_OFFSET = -24;
    var TILE_HEIGHT = 83;
    var DEFAULT_SPEED = 15;

    // Set enemy's X position
    this.x = X_START_POSITION;

    // Set enemy's Y position with a random number between 1 - 3
    // to correspond to the 3 rows of stone tiles
    this.y = Y_OFFSET + TILE_HEIGHT * (Math.floor(Math.random() * (3 - 1 + 1)) + 1);

    // Set enemy's speed by multiplying default speed with a randomly
    // generated number between 1 - 5
    this.speed = DEFAULT_SPEED * (Math.floor(Math.random() * (5 - 1 + 1)) + 1);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // If enemy reaches off screen, reset to start position and
    // generate new vertical position and speed
    if (this.x > 505) {
        this.init();
    } else {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += 2 * dt * this.speed;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Set score to zero and lives to 3
    this.score = 0;
    this.lives = 3;
    this.sprite = 'images/char-boy.png';
    this.resetPosition();
};

// Resets the player to it's initial position
Player.prototype.resetPosition = function() {
    var CANVAS_HEIGHT = 600;
    var TILE_HEIGHT = 171;
    var Y_OFFSET = 24;

    var Y_START_POSITION = CANVAS_HEIGHT - TILE_HEIGHT - Y_OFFSET;
    var X_START_POSITION = 202;

    this.x = X_START_POSITION;
    this.y = Y_START_POSITION;
};

// Adjust the lives and score of the player when a collision
// with the enemy occurs
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    if(this.checkCollision()) {
        this.lives -= 1;
        document.querySelector(".lives").innerHTML = this.lives;
        this.resetPosition();

        if(this.lives === 0) {
            alert("Game Over");
            this.lives = 3;
            this.score = 0;
            document.querySelector(".lives").innerHTML = 3;
            document.querySelector(".score").innerHTML = 0;
        }
    }
};

// Checks to see if the player's position and the enemy's position
// collides. Returns true if a collision occurs.
Player.prototype.checkCollision = function() {
    // Player's Y is slightly higher than the enemy. This
    // difference is adjusted to match the enemy's position
    var playerY = this.y - 14;
    var playerX = this.x;
    var collide = false;

    allEnemies.forEach(function(enemy) {
        // If the enemy is on the same row as the player and is within
        // 80 pixels of the player's left or right, trigger a collison
        if ((enemy.y === playerY) && (enemy.x >= playerX - 80) && (enemy.x <= playerX + 80))
            collide = true;
    });

    return collide;
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Function to determine what happens when specific game
// keys are pressed
Player.prototype.handleInput = function(keyCode) {
    switch(keyCode) {
        case 'left':
            // Check to see if player has reach edge or screen
            if (this.x > 0) {
                this.x += -101;
            }
            break;
        case 'up':
            // Check to see if player has reached the river
            if (this.y > 0) {
                this.y += -83;

                // Trigger win function when river has been reached
                if (this.y === -10) {
                    this.win();
                }
            }
            break;
        case 'right':
            if (this.x < 404) {
                this.x += 101;
            }
            break;
        case 'down':
            if (this.y < 405) {
                this.y += 83;
            }
            break;
    }
};

// When the player wins, add to score and reset player position
Player.prototype.win = function() {
    this.score += 1;
    document.querySelector(".score").innerHTML = this.score;
    this.resetPosition();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

for (var i = 0; i < 5; i++) {
    allEnemies[i] = new Enemy();
}

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'left', // Added WASD keys
        87: 'up',
        68: 'right',
        83: 'down',
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
