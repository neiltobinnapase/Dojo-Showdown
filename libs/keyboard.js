window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);


var Key = {
  _pressed: {},

	A: 65,
    B: 66,
    D: 68,
    F: 70,
    G: 71,
    L: 76,
    R: 82,
    S: 83,
    U: 85,
    W: 87,
  Q: 81,
  
  _1: 49,
  _2: 50,
  _3: 51,
  _4: 52,
  _5: 53,

  M: 77,

    SPACE: 32,
	
	TAB: 9,
	ESCAPE: 27,

    LEFTARROW: 37,
    UPARROW: 38,
    RIGHTARROW: 39,
    DOWNARROW: 40,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};


/*
    window.addEventListener("keydown", function(evt) {
        alert("keydown: " + evt.keyCode);
    }, false);
*/