//mqtt protocol

function startConnect() {
    //define a client id
    clientID = "clientID-21"
	host = "mqtt.devbit.be"
	port = 80
	topic = "projectweek2021"
    
    // Initialize new Paho client connection
    client = new Paho.MQTT.Client(host, Number(port), clientID);

    // Set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // Connect the client, if successful, call onConnect function
    client.connect({ 
        onSuccess: onConnect,
    });
}

// Called when the client connects
function onConnect() {
    // Subscribe to the requested topic
    client.subscribe(topic);
}

//Called when the client loses its connection
function onConnectionLost(responseObject) {
    document.getElementById("messages").innerHTML += '<span>ERROR: Connection lost</span><br/>';
    if (responseObject.errorCode !== 0) {
        document.getElementById("messages").innerHTML += '<span>ERROR: ' + + responseObject.errorMessage + '</span><br/>';
    }
}

// Called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived: " + message.payloadString);
	statuscheckpoint = message.payloadString
	if (statuscheckpoint.includes('1')) {
		checkpoint1.innerHTML = "Status checkpoint 1: passed";
	}
	else if (statuscheckpoint.includes('2')) {
		checkpoint2.innerHTML = "Status checkpoint 2: passed";
		
	}
    //document.getElementById("messages").innerHTML += '<span>Topic: ' + message.destinationName + '  | ' + message.payloadString + '</span><br/>';
}

// Called when the disconnection button is pressed
function startDisconnect() {
    client.disconnect();
    document.getElementById("messages").innerHTML += '<span>Disconnected</span><br/>';
}

// Updates #messages div to auto-scroll
function updateScroll() {
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
}


/* Scoreboard*/
var statuscheckpoint
var milisecondcount = 0;
var secondcount = 0;
var scoreboard = 0;
var counterstate = false;

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

//timer start door op de toets naar voor in te drukken op het toetsenbord
document.getElementById('button-forward').addEventListener('click', (e) => {
	if (!counterstate) {
		startConnect()
		myTimer = setInterval(myCounter, 10);
		counterstate = true;
	}
});
//start timer
document.getElementById('startbutton').addEventListener('click', (e) => {
	if (!counterstate) {
		myTimer = setInterval(myCounter, 10);
		counterstate = true;
	}
});
//reset timer
document.getElementById('resetbutton').addEventListener('click', (e) => {
	milisecondcount = 0;
	secondcount = 0;
	counter.innerHTML = "Count: " + secondcount + ":" + milisecondcount;
});
//Stop timer
document.getElementById('stopbutton').addEventListener('click', (e) => {
	stopCounter();
});

function stopCounter() {
	myTimer = setInterval(0, 0);
	counterstate = false;
}
function myCounter() {
	milisecondcount++;
	milisecondcount = milisecondcount % 100
	if (milisecondcount == 99) {
		secondcount++;
	}
	//checkpoints data van raspberry pi ging hier komen
	
		//popup bij het einde 
		modaltext.innerHTML = "You finished the parkour with a time of: " + secondcount + "," + milisecondcount + "seconds";
		modal.style.display = "block";
	
  	counter.innerHTML = "Count: " + secondcount + ":" + milisecondcount;

}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

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
        	if (!counterstate) {
						myTimer = setInterval(myCounter, 10);
						counterstate = true;
					}
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
