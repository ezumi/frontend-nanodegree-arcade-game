// Create audio context using web audio api
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/* The gameSounds object is used to load, decode and play sound files
 * Variables: soundUrlList, an array list of all sound files to be loaded into the buffer
 *            soundBufferList, a buffer array to hold all decoded sounds files for playback
 */
var gameSounds = function() {
    this.soundUrlList = [// Source: https://www.freesound.org/people/bradwesson/sounds/135936/
                        'sounds/135936__bradwesson__collectcoin.mp3',
                        // Source: https://www.freesound.org/people/DrMinky/sounds/166186/
                        'sounds/166186__drminky__menu-screen-mouse-over.mp3',
                        // Source: https://www.freesound.org/people/grunz/sounds/109662/
                        'sounds/109662__grunz__success.mp3',
                        // Source: https://www.freesound.org/people/metekavruk/sounds/348271/
                        'sounds/348271__metekavruk__fruitbite.ogg',
                        // Source: https://www.freesound.org/people/notchfilter/sounds/43696/
                        'sounds/43696__notchfilter__game-over01.mp3'];
    this.soundBufferList = [];
    this.init();
};

// Function to load all sound files from the soundUrlList
gameSounds.prototype.init = function() {
    if (this.soundUrlList.length > 0)
        for (var i = 0; i < this.soundUrlList.length; i++) {
            this.loadSounds(this.soundUrlList[i], i);
        }
};

gameSounds.prototype.loadSounds = function(url, index) {
    // use XHR to load an audio track
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    var _this = this;

    request.onload = function() {
        // Use decodeAudioData to decode track and assign to buffer.
        audioCtx.decodeAudioData(request.response, function(buffer) {
            _this.soundBufferList[index] = buffer;
        },

        function(e){"Error with decoding audio data" + e.err});
    }

    request.send();
};

// Function to play back sound files
gameSounds.prototype.playSound = function (sound) {
    // Create a new buffer for playback
    var playBuffer = audioCtx.createBufferSource();

    // Copy the decoded audio into the new buffer variable
    playBuffer.buffer = this.soundBufferList[sound];

    // Connect buffer to pc speakers
    playBuffer.connect(audioCtx.destination);

    // Play audio from buffer
    playBuffer.start(0);
};