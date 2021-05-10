/* Scoreboard*/
var intervalID = window.setInterval(checkScore, 1000);

function checkScore() {
  // go check API 
 	Http.open("GET", url);
	Http.send();
	console.log("works")
}

const Http = new XMLHttpRequest();
const url = 'http://localhost:3000';
Http.open("GET", url);
Http.send();

var count = 0;
var scoreboard = 0;

var count = 0;
function myCounter() {
  counter.innerHTML = "Count: " + ++count;
  score.innerHTML = "Score: " + scoreboard;
}

Http.onreadystatechange=(e)=> {

	if (Http.responseText.includes("checkpoint 1")){
		checkpoint = Http.responseText
		console.log(Http.responseText)
		checkpoint1.innerHTML = "Status checkpoint 1: " + checkpoint;
		scoreboard += 10;
	}
	else if (Http.responseText.includes("checkpoint 2")){
		checkpoint = Http.responseText
		console.log(Http.responseText)
		checkpoint2.innerHTML = "Status checkpoint 2: " + checkpoint;
		scoreboard += 20;
	}

}

document.getElementById('startbutton').addEventListener('click', (e) => {
	myTimer = setInterval(myCounter, 1000);
});

document.getElementById('resetbutton').addEventListener('click', (e) => {
	count = 0;
	scoreboard = 0;
	counter.innerHTML = "Count: " + count;
	score.innerHTML = "Count: " + scoreboard;
});

document.getElementById('stopbutton').addEventListener('click', (e) => {
	myTimer = setInterval(0, 0);
});

/* var testbutton = document.getElementById("testbutton"), count = 0;
testbutton.onclick = function() {
	count += 1;
	count = Http.responseText
	score.innerHTML = "Score: " + count;
}
 */

/* Pills */

document.getElementById('control').addEventListener('click', (e) => {
	document.body.classList.remove('control', 'customize');
	document.body.classList.add('control');
});

document.getElementById('customize').addEventListener('click', (e) => {
	document.body.classList.remove('control', 'customize');
	document.body.classList.add('customize');
});




var emulateState = false;
var lightsState = false;

/* Keyboard events */

document.addEventListener('keydown', handleKeyEvent);
document.addEventListener('keyup', handleKeyEvent);			

var lastKey = null;

var activeKeys = {
    'ArrowUp':    false,
    'ArrowDown':  false,
    'ArrowLeft':  false,
    'ArrowRight': false
}

function handleKeyEvent(event) {
    if (event.target.tagName == 'STYLE') return;
    if (event.type != 'keydown' && event.type != 'keyup') return;

	if (event.key == 'l' && event.type == 'keydown') {
		executeCommand('lights');
		event.preventDefault();

		return;
	}

	if (activeKeys.hasOwnProperty(event.key)) {
		activeKeys[event.key] = event.type == 'keydown';

		if (event.type == 'keydown') {
			lastKey = event.key;
		}

		event.preventDefault();
	}
	
	evaluateCommands();
}




/* Gamepad support */

var activeButtons = {
    'ArrowUp':    false,
    'ArrowDown':  false,
    'ArrowLeft':  false,
    'ArrowRight': false
}

const gamepad = new Gamepad();

gamepad.on('press', 'd_pad_up', () => { activeButtons.ArrowUp = true; evaluateCommands(); } );
gamepad.on('release', 'd_pad_up', () => { activeButtons.ArrowUp = false; evaluateCommands(); } );
gamepad.on('press', 'd_pad_left', () => { activeButtons.ArrowLeft = true; evaluateCommands(); } );
gamepad.on('release', 'd_pad_left', () => { activeButtons.ArrowLeft = false; evaluateCommands(); } );
gamepad.on('press', 'd_pad_right', () => { activeButtons.ArrowRight = true; evaluateCommands(); } );
gamepad.on('release', 'd_pad_right', () => { activeButtons.ArrowRight = false; evaluateCommands(); } );
gamepad.on('press', 'd_pad_down', () => { activeButtons.ArrowDown = true; evaluateCommands(); } );
gamepad.on('release', 'd_pad_down', () => { activeButtons.ArrowDown = false; evaluateCommands(); } );

gamepad.on('press', 'button_1', () => executeCommand('lights') );






/* Mouse events */
var controls = document.getElementById('controls');

controls.addEventListener('mousedown', handleMouseEvent);
controls.addEventListener('mouseup', handleMouseEvent);
controls.addEventListener('touchstart', handleMouseEvent);
controls.addEventListener('touchend', handleMouseEvent);

function handleMouseEvent(event) {
    if (event.target.tagName != 'BUTTON') {
        return;
    }
    
    var type = event.type == 'mousedown' || event.type == 'touchstart' ? 'down' : 'up'
    var command = event.target.dataset[type];
    executeCommand(command);

    event.preventDefault();
}





/* Connect to device */

document.getElementById('connect')
	.addEventListener('click', () => {
		SBrick.connect('SBrick')
			.then(()=> {
				document.body.classList.add('connected');
			});
	});

document.getElementById('emulate')
	.addEventListener('click', () => {
	    emulateState = true;
		document.body.classList.add('connected');
	});


	
	
	
/* Handle commands */


var lastCommand = 'stop';

function evaluateCommands() {
	command = 'stop';
	if (activeKeys.ArrowUp || activeButtons.ArrowUp) command = 'forward';
	if (activeKeys.ArrowDown || activeButtons.ArrowDown) command = 'reverse';
	if (activeKeys.ArrowLeft || activeButtons.ArrowLeft) command = 'left';
	if (activeKeys.ArrowRight || activeButtons.ArrowRight) command = 'right';
	
	
    if (lastCommand != command) {
        executeCommand(command);
        lastCommand = command;
    }
}

function updateCommand(value) {
	document.body.classList.remove('forward');
	document.body.classList.remove('reverse');
	document.body.classList.remove('left');
	document.body.classList.remove('right');
	
	if (value) {
		document.body.classList.add(value);
	}
}

function executeCommand(value) {
	if (emulateState) {
		if (value == 'forward' || value == 'reverse' || value == 'left' || value == 'right') {
        	playSound();
		}

		if (value == 'stop') {
        	stopSound();
		}
	}
	
    switch (value) {
        case 'forward':
        	updateCommand('forward');
        	
			if (SBrick.isConnected()) {		            	
            	SBrick.quickDrive([
					{ channel: SBrick.CHANNEL1, direction: SBrick.CW, power: SBrick.MAX },
					{ channel: SBrick.CHANNEL3, direction: SBrick.CCW, power: SBrick.MAX }
				]);
			}
				
			break;
        
        case 'reverse':
        	updateCommand('reverse');
        	
			if (SBrick.isConnected()) {		            	
            	SBrick.quickDrive([
					{ channel: SBrick.CHANNEL1, direction: SBrick.CCW, power: SBrick.MAX },
					{ channel: SBrick.CHANNEL3, direction: SBrick.CW, power: SBrick.MAX }
				]);
			}
				
			break;
        
        case 'right':
        	updateCommand('right');
        	
			if (SBrick.isConnected()) {		            	
            	SBrick.quickDrive([
					{ channel: SBrick.CHANNEL1, direction: SBrick.CCW, power: SBrick.MAX },
					{ channel: SBrick.CHANNEL3, direction: SBrick.CCW, power: SBrick.MAX }
				]);
			}
				
			break;
        
        case 'left':
        	updateCommand('left');

			if (SBrick.isConnected()) {		            	
            	SBrick.quickDrive([
					{ channel: SBrick.CHANNEL1, direction: SBrick.CW, power: SBrick.MAX },
					{ channel: SBrick.CHANNEL3, direction: SBrick.CW, power: SBrick.MAX }
				]);
			}
				
			break;
        
        case 'lights':
			if (SBrick.isConnected()) {		            	
            	if (lightsState) {
	            	SBrick.stop(SBrick.CHANNEL0);
	            	lightsState = false;	
            	} else {
	            	SBrick.drive(SBrick.CHANNEL0, SBrick.CW, SBrick.MAX);							
	            	lightsState = true;	
				}
			}
			
			break;

        case 'stop':
        	updateCommand();

			if (SBrick.isConnected()) {		            	
            	SBrick.stop(SBrick.CHANNEL1);
            	SBrick.stop(SBrick.CHANNEL3);
            }
            
			break;
        
    }
}
