// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.resetPosition();
};

// Sets enemy's position and travel speed
Enemy.prototype.resetPosition = function() {
    // Adjust sprite position to be centered on stone tile
    var Y_OFFSET = -24;

    // Height of the stone tile exposed
    var TILE_HEIGHT = 83;

    // Default speed of enemy
    var DEFAULT_SPEED = 60;

    // Set enemy's X position to be 1 tile off screen
    this.x = -101;

    // Set enemy's Y position with a random number between 1 - 3
    // to correspond to the 3 rows of stone tiles
    this.y = Y_OFFSET + TILE_HEIGHT * (Math.floor(Math.random() * (3 - 1 + 1)) + 1);

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
    var TILE_WIDTH = 50;
    var Y_OFFSET = 30;

    var Y_START_POSITION = CANVAS_HEIGHT - TILE_HEIGHT - Y_OFFSET;
    var X_START_POSITION = CANVAS_WIDTH / 2 - TILE_WIDTH;

    this.x = X_START_POSITION;
    this.y = Y_START_POSITION;

    if(!this.alive)
        this.alive = true;
};

// Function to determine what happens when specific
// game keys are pressed
Player.prototype.handleInput = function(keyCode) {
    // Only allow input if player is alive
    if (this.alive) {
        switch(keyCode) {
            case 'left':
                // Check to see if player has reach edge of screen
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
    }
};

// When the player wins, add to score and reset player position
Player.prototype.win = function() {
    this.score += 10;
    document.querySelector(".score").innerHTML = this.score;
    this.resetPosition();
};

// Function to handle the player's death
Player.prototype.death = function() {
    /* Variable: alive, determines if the player has already been hit.
     * On first impact, it is set to false so that it does not repeatedly trigger
     * the same death. This allows adding a slight delay before resetting the
     * position of the player. The purpose is to allow the user to see the impact
     * with the enemy.
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
            msg.showMessage("Game Over", 1500, true);
            this.lives = 3;
            this.score = 0;
            document.querySelector(".lives").innerHTML = 3;
            document.querySelector(".score").innerHTML = 0;
        } else {
            msg.showMessage("Ouch!", 750, true);
        }
    }
};

// Function to call to update player variables. Not in used at the moment
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    };

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
 *             timer, length of time to show message
 *             background, set to true to display black overlay background
 */
Message.prototype.showMessage = function(message, timer, background) {
    this.isMessage = true;
    this.message = message;
    var _this = this;

    if (background)
        this.showBackground = true;

    setTimeout(function(){
        _this.isMessage = false;
        _this.showBackground = false;
    }, timer);
};

// Draw the message on the screen, required method for game
Message.prototype.render = function() {
    // Save current context
    ctx.save();

    // If showBackground is true, draw a black background at 65% opacity
    if (this.showBackground) {
        ctx.globalAlpha = 0.65;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
var msg = new Message();

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