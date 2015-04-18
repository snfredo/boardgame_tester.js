Game.Screen = {};

// Define our initial start screen
Game.Screen.startScreen = {
    enter: function() {    console.log("Entered start screen."); },
    exit: function() { console.log("Exited start screen."); },
    render: function(display) {
        // Render our prompt to the screen
        display.drawText(1,1, "%c{yellow}Javascript Boardgame Prototype");
        display.drawText(1,2, "Press [Enter] to start or [Escape] to adjust options");
    },
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.playScreen);
            } else if (inputData.keyCode === ROT.VK_ESCAPE) {
                Game.switchScreen(Game.Screen.optionScreen);
            }
        }
    }
};

Game.Screen.optionScreen = {
    enter: function() { console.log("Entered options screen."); },
    exit: function() { console.log("Exited options screen."); },
    _overrides : {},
    _currIndex : 0,
    _currEntry : '',
    _keys : Object.keys(Game.Options).sort(),
    render: function(display) {
        // Render our prompt to the screen
        display.drawText(1,1, "%c{green}Game Options");
        display.drawText(1,Game.getScreenHeight() - 1, "Press [Enter] to start");
        for (var i = 0; i < this._keys.length; i++) {
            if (i == this._currIndex) {
                display.drawText(1,3 + i, sprintf("%%b{grey}%s [default=%s]:%s",
                    this._keys[i], Game.Options[this._keys[i]], this._currEntry));
            } else {
                display.drawText(1,3 + i, sprintf("%s [default=%s]:%s",
                    this._keys[i],
                    Game.Options[this._keys[i]], 
                    this._keys[i] in this._overrides ? this._overrides[this._keys[i]] : ''));   
            }
        }
    },
    saveEntry: function() {
        if (this._currEntry != '') {
            this._overrides[this._keys[this._currIndex]] = this._currEntry;
        }
    },
    loadEntry: function() {
        if (this._keys[this._currIndex] in this._overrides) {
            this._currEntry = this._overrides[this._keys[this._currIndex]];
        } else {
            this._currEntry = '';
        }
    },
    handleInput: function(inputType, inputData) {
        if (inputType == 'keypress') {  // Printable chars only.
            this._currEntry = this._currEntry + String.fromCharCode(inputData.charCode);
            Game.refresh();
        } else if (inputType === 'keydown') {  // Triggered for all characters
            if (inputData.keyCode === ROT.VK_RETURN) {
                // TODO(mderosa): Update options values from overrides.
                Game.switchScreen(Game.Screen.playScreen);
            } else if (inputData.keyCode === ROT.VK_DOWN) {
                this.saveEntry();
                if (this._currIndex < this._keys.length - 1) {
                    this._currIndex++;
                }
                this.loadEntry();
                Game.refresh();
            } else if (inputData.keyCode === ROT.VK_UP) {
                this.saveEntry();
                if (this._currIndex > 0) {
                   this._currIndex--;
                }
                this.loadEntry();
                Game.refresh();
            } else if (inputData.keyCode === ROT.VK_BACK_SPACE) {
                if (this._currEntry.length > 0) {
                    this._currEntry = this._currEntry.substring(0, this._currEntry.length - 1);
                }
                inputData.preventDefault();  // Prevent page navigation on backspace.
                Game.refresh();
            }
        }
    }
};

Game.Screen.playScreen = {
    enter: function() {    console.log("Entered play screen."); },
    exit: function() { console.log("Exited play screen."); },
    render: function(display) {
        // Render our prompt to the screen
        display.drawText(1,1, "%c{red}Content Goes Here");
    },
    handleInput: function(inputType, inputData) {
    }
};