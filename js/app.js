// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Set default speed of enemy
    this.baseSpeed = 60;

    // Initiate enemy position
    this.resetPosition();
};

// Sets enemy's position and travel speed
Enemy.prototype.resetPosition = function() {
    /* Variables: Y_OFFSET, Adjust sprite position to be centered on stone tile
     *            TILE_WIDTH, Width of tile
     *            EXPOSED_TILE_HEIGHT, Height of the stone tile exposed
     */

    var Y_OFFSET = -24,
        TILE_WIDTH = 101,
        EXPOSED_TILE_HEIGHT = 83;

    // Set enemy's X position to be 1 tile off screen
    this.x = -TILE_WIDTH;

    // Set enemy's Y position with a random number between 1 - 3
    // to correspond to the 3 rows of stone tiles
    this.y = Y_OFFSET + EXPOSED_TILE_HEIGHT * (Math.floor(Math.random() * (3 - 1 + 1)) + 1);

    // Set enemy's speed by multiplying default speed with a randomly
    // generated number between 1 - 5
    this.speed = this.baseSpeed * (Math.floor(Math.random() * (5 - 1 + 1)) + 1);
};

// Function to increase base speed of the enemy
// Parameter: amount, amount of speed to increase by
//            maxSpeed, set the maximum speed 
Enemy.prototype.addSpeed = function(amount, maxSpeed) {
    // Make sure current speed is less than the defined limit
    if (this.baseSpeed < maxSpeed)
        this.baseSpeed += amount;
};

// Function to set the enemy's base speed
// Parameter: newSpeed, new base speed
Enemy.prototype.setSpeed = function(newSpeed) {
    this.baseSpeed = newSpeed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // If enemy reaches off screen, reset to start position and
    // generate new vertical position and speed
    if (this.x > ctx.canvas.width) {
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

// Player class
var Player = function() {
    this.alive = true;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.selectSprite = 0;
    this.sprite = 'images/char-boy.png';

    // Initate starting position
    this.resetPosition();
};

// Function for changing the sprite image of the player
Player.prototype.changeHero = function() {
    // Holds an array of images that the user can choose from
    var sprites = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
    ];
    this.sprite = sprites[this.selectSprite];
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
// Parameter: points, points to add to player's score
Player.prototype.addPoints = function(points) {
    this.score += points;
    document.querySelector(".score").innerHTML = this.score;
};

// Function to add lives to the player's remaining lives
// Parameter: lives, amount of lives to add to player's lives
Player.prototype.addLives = function(lives) {
    this.lives += lives;
    document.querySelector(".lives").innerHTML = this.lives;
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
                    if (this.y === -10) {
                        this.levelUp();
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
        // Play moving sound effect
        sounds.playSound(1);
    }
};

// Function to handle when the player crosses the river
Player.prototype.levelUp = function() {
    sounds.playSound(2);

    // Each time the player crosses the river, he gains a level and
    // the score increases by a multiple of this level
    this.level++;
    this.addPoints(this.level*500);
    document.querySelector(".levels").innerHTML = this.level;

    // Reset the player position
    var _this = this;
    setTimeout(function(){_this.resetPosition();}, 200);

    // Increase enemy speeds by the player's level multiplied by 5. Maximum
    // speed limit is 130
    for (var i = 0; i < allEnemies.length; i++) {
            allEnemies[i].addSpeed(this.level * 5, 130);
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
            sounds.playSound(4);
            message.showMessage("Game Over!\nFinal Score: "+this.score, 2000, true);
            this.lives = 3;
            this.score = 0;
            this.level = 1;
            document.querySelector(".lives").innerHTML = this.lives;
            document.querySelector(".score").innerHTML = this.score;
            document.querySelector(".levels").innerHTML = this.level;

            // Reset enemies base speed
            for (var i = 0; i < allEnemies.length; i++) {
                allEnemies[i].setSpeed(60);
            }
        } else {
            sounds.playSound(3);
            message.showMessage("Ouch!", 750, true);
        }
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Powerup class
var Powerup = function() {
    // Initialize powerup position
    this.resetPosition();

    // Start timer that generates a new position and powerup after 5 seconds
    this.startTimer(5000);
};

// Function to randomly assign sprite, point value, and position of generated powerup
Powerup.prototype.resetPosition = function() {
    var EXPOSED_TILE_HEIGHT = 83,
        TILE_WIDTH = 101,
        Y_OFFSET = 13,
        X_OFFSET = 15,
        COLUMNS = 5;

    // Randomly generate a number from 1 - 5 to correspond to an unique powerup
    var initPowerup = (Math.floor(Math.random() * (5 - 1 + 1)) + 1);

    // Resets variables to zero.
    // Variable: yAdjustment, holds a variable that is for centering the heart
    //           and key image on the tiles.
    //           lives, holds that amount of lives to add when the player
    //           collects a heart powerup
    //           points, holds the point value of gems
    this.yAdjustment = 0;
    this.lives = 0;
    this.points = 0;

    switch(initPowerup) {
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
        case 4:
            this.sprite = 'images/Heart.png';

            // y offset needs to be adjusted for this powerup
            // due to the image size differences. This is for
            // centering purposes 
            this.yAdjustment = 11;
            this.lives = 1;
            break;
        case 5:
            this.sprite = 'images/Key.png';

            // y offset needs to be adjusted for this powerup
            // due to the image size differences. This is for
            // centering purposes 
            this.yAdjustment = 5;

            // Slow all enemies speed by 30%
            for (var i = 0; i < allEnemies.length; i++) {
                if (allEnemies[i].baseSpeed > 60)
                    allEnemies[i].setSpeed(allEnemies[i].baseSpeed*0.30);
            }
            break;
    }

    this.x = X_OFFSET + TILE_WIDTH * (Math.floor(Math.random() * (COLUMNS - 1 - 0 + 1)) + 0);
    this.y = Y_OFFSET + this.yAdjustment + EXPOSED_TILE_HEIGHT * (Math.floor(Math.random() * (3 - 1 + 1)) + 1);
};

// Function that calls the resetPosition function after a specified amount of time
// Parameter: timer, amount of time between each reset
Powerup.prototype.startTimer = function(time) {
    var _this = this;

    this.timer = setInterval(function(){
        _this.resetPosition();
    }, time);
};

// Function to stop the current timer
Powerup.prototype.stopTimer = function() {
    clearInterval(this.timer);
};

// Function called when player grabs a powerup
Powerup.prototype.gotPowerup = function() {
    if (player.alive) {
        player.addPoints(this.points);

        // Add lives if powerup is the Heart
        if (this.lives) {
            player.addLives(this.lives);
            this.lives = 0;
        }
        sounds.playSound(0);
    }

    this.stopTimer();
    this.resetPosition();
    this.startTimer(5000);
};

/* Draw the powerup on the screen, required method for game
 * Variables: SCALE, Scale to draw powerup sprite
 *            TILE_HEIGHT, Width of tile
 *            TILE_WIDTH, Height of tile
 */
Powerup.prototype.render = function () {
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
    this.message = [];
};

/* Function to display messages
 * Parameters: message, the message string to display
 *             time, length of time to show message
 *             background, set to true to display black overlay background
 */
Message.prototype.showMessage = function(message, time, background) {
    this.isMessage = true;
    this.message = message.split("\n");
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
    // variable to define line height for text that spans multiple rows
    var LINE_HEIGHT = 50;

    // Save current context
    ctx.save();

    // If showBackground is true, draw a black background at 65% opacity
    if (this.showBackground) {
        ctx.globalAlpha = 0.65;
        ctx.fillStyle = "black";
        ctx.fillRect(1, 52, ctx.canvas.width - 2, ctx.canvas.height - 74);
        ctx.globalAlpha = 1;
    }

    ctx.font = "34pt Impact";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = "2";

    // Loop and print message string. If message array index is greater than 1, multiply
    // line number by the LINE_HEIGHT for the new line's Y position
    for (var i = 0; i < this.message.length; i++) {
        ctx.fillText(this.message[i], ctx.canvas.width / 2, ctx.canvas.height / 2 + i * LINE_HEIGHT);
        ctx.strokeText(this.message[i], ctx.canvas.width / 2, ctx.canvas.height / 2 + i * LINE_HEIGHT);
    }

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
var powerup = new Powerup();
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

$(document).ready(function(){
    // Click event handler, when user clicks on an avatar image
    $('.avatar-hero').click(function(){
        // Variable to hold the detached selector image
        var select = $('.selector').detach();

        // Attaches the selector image to the avatar image that is clicked
        $(this).prepend(select);

        // Clears the color from all heroes
        $('.hero-image').removeClass('hero-image-color');

        // Apply color to the avatar image that is clicked
        $(this).children('.hero-image').toggleClass('hero-image-color');

        // Stores selected sprite index into player class' selectSprite
        // variable
        player.selectSprite = $(this).index();
    });
});