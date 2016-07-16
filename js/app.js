// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Initiate enemy position
    this.resetPosition();
};

// Sets enemy's position and travel speed
Enemy.prototype.resetPosition = function() {
    /* Variables: Y_OFFSET, Adjust sprite position to be centered on stone tile
     *            TILE_WIDTH, Width of tile
     *            EXPOSED_TILE_HEIGHT, Height of the stone tile exposed
     *            DEFAULT_SPEED, Default speed of enemy
     */

    var Y_OFFSET = -24,
        TILE_WIDTH = 101,
        EXPOSED_TILE_HEIGHT = 83,
        DEFAULT_SPEED = 60;

    // Set enemy's X position to be 1 tile off screen
    this.x = -TILE_WIDTH;

    // Set enemy's Y position with a random number between 1 - 3
    // to correspond to the 3 rows of stone tiles
    this.y = Y_OFFSET + EXPOSED_TILE_HEIGHT * (Math.floor(Math.random() * (3 - 1 + 1)) + 1);

    // Set enemy's speed by multiplying default speed with a randomly
    // generated number between 1 - 5
    this.speed = DEFAULT_SPEED * (Math.floor(Math.random() * (5 - 1 + 1)) + 1);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // If enemy reaches off screen, reset to start position and
    // generate new vertical position and speed
    if (this.x > 505) {
        this.resetPosition();
    } else {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += dt * this.speed;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class with initial score and 3 lives
var Player = function() {
    this.score = 0;
    this.lives = 3;
    this.alive = true;
    this.sprite = 'images/char-boy.png';

    // Initate starting position
    this.resetPosition();
};

// Resets the player to it's initial position
Player.prototype.resetPosition = function() {
    var CANVAS_HEIGHT = 606;
    var CANVAS_WIDTH = 505;
    var TILE_HEIGHT = 171;
    var SPRITE_WIDTH = 50;
    var Y_OFFSET = 30;

    var yStartPosition = CANVAS_HEIGHT - TILE_HEIGHT - Y_OFFSET;
    var xStartPosition = CANVAS_WIDTH / 2 - SPRITE_WIDTH;

    this.x = xStartPosition;
    this.y = yStartPosition;

    // Resurrect player if dead
    if(!this.alive)
        this.alive = true;
};

// Function to add points to the player's current score
Player.prototype.addPoints = function(points) {
    this.score += points;
    document.querySelector(".score").innerHTML = this.score;
};

// Function to determine what happens when specific
// game keys are pressed
Player.prototype.handleInput = function(keyCode) {
    // Only allow input if player is alive
    if (this.alive) {
        switch(keyCode) {
            case 'left':
                // Check to see if player has reach edge of screen
                if (this.x > 1) {
                    this.x += -101;
                }
                break;
            case 'up':
                // Check to see if player has reached the river
                if (this.y > 0) {
                    this.y += -83;

                    // Add to score when river has been reached and
                    // reset player position
                    if (this.y === -10) {
                        this.addPoints(10);
                        this.resetPosition();
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
    }
};

// Function to handle the player's death
Player.prototype.death = function() {
    /* Variable: alive, determines if the player has already been hit.
     * On first impact, it is set to false so that it does not repeatedly trigger
     * the same death. This allows adding a slight delay before resetting the
     * position of the player, allowing the user to see the impact with the enemy.
     */
    if (this.alive) {
        // Set player to dead and subtract lives
        this.alive = false;
        this.lives -= 1;
        document.querySelector(".lives").innerHTML = this.lives;

        // Reset player position after 150ms
        var _this = this;
        setTimeout(function(){_this.resetPosition();}, 750);

        if (this.lives === 0) {
            message.showMessage("Game Over!", 1500, true);
            this.lives = 3;
            this.score = 0;
            document.querySelector(".lives").innerHTML = 3;
            document.querySelector(".score").innerHTML = 0;
        } else {
            message.showMessage("Ouch!", 750, true);
        }
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Gem class
var Gem = function() {
    this.resetPosition();
    this.startTimer(5000);
};

// Function to randomly assign sprite, point value, and position of generated gem
Gem.prototype.resetPosition = function() {
    var EXPOSED_TILE_HEIGHT = 83,
        TILE_WIDTH = 101,
        Y_OFFSET = 13,
        X_OFFSET = 15,
        COLUMNS = 5;

    var initGem = (Math.floor(Math.random() * (3 - 1 + 1)) + 1);

    switch(initGem) {
        case 1:
            this.sprite = 'images/Gem Blue.png';
            this.points = 100;
            break;
        case 2:
            this.sprite = 'images/Gem Green.png';
            this.points = 200;
            break;
        case 3:
            this.sprite = 'images/Gem Orange.png';
            this.points = 300;
            break;
    }

    this.x = X_OFFSET + TILE_WIDTH * (Math.floor(Math.random() * (COLUMNS - 1 - 0 + 1)) + 0);
    this.y = Y_OFFSET + EXPOSED_TILE_HEIGHT * (Math.floor(Math.random() * (3 - 1 + 1)) + 1);
};

// Function that calls the resetPosition function after a specified amount of time
// Parameter: timer, amount of time between each reset
Gem.prototype.startTimer = function(time) {
    var _this = this;

    this.timer = setInterval(function(){
        _this.resetPosition();
    }, time);
};

// Function to stop the current timer
Gem.prototype.stopTimer = function() {
    clearInterval(this.timer);
};

/* Draw the gem on the screen, required method for game
 * Variables: SCALE, Scale to draw gem sprite
 *            TILE_HEIGHT, Width of tile
 *            TILE_WIDTH, Height of tile
 */
Gem.prototype.render = function () {
    var SCALE = 0.7,
        TILE_HEIGHT = 171,
        TILE_WIDTH = 101;

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, TILE_WIDTH * SCALE, TILE_HEIGHT * SCALE);
};

/* This class handles the displaying of messages in the game
 * Variable: isMessage, set to true to display message.
 */
var Message = function() {
    this.isMessage = false;
    this.showBackground = false;
    this.message = "";
};

/* Function to display messages
 * Parameters: message, the message string to display
 *             time, length of time to show message
 *             background, set to true to display black overlay background
 */
Message.prototype.showMessage = function(message, time, background) {
    this.isMessage = true;
    this.message = message;
    var _this = this;

    if (background)
        this.showBackground = true;

    setTimeout(function(){
        _this.isMessage = false;
        _this.showBackground = false;
    }, time);
};

// Draw the message on the screen, required method for game
Message.prototype.render = function() {
    // Save current context
    ctx.save();

    // If showBackground is true, draw a black background at 65% opacity
    if (this.showBackground) {
        ctx.globalAlpha = 0.65;
        ctx.fillStyle = "black";
        ctx.fillRect(1, 52, ctx.canvas.width - 2, ctx.canvas.height - 74);
        ctx.globalAlpha = 1;
    }

    ctx.font = "36pt Impact";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = "2";
    ctx.fillText(this.message, ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.strokeText(this.message, ctx.canvas.width / 2, ctx.canvas.height / 2);

    // Restore context
    ctx.restore();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

// Generate 5 enemies on screen at a time
for (var i = 0; i < 5; i++) {
    allEnemies[i] = new Enemy();
}

var player = new Player();
var gem = new Gem();
var message = new Message();

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