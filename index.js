const WebSocket = require('ws');

const wss = new WebSocket.Server({
	//perMessageDeflate: false,
	port: 8080
}, function onListening() {

	console.log('listening');
	console.log(arguments);

});


const robot = require("robotjs");
var mouse = robot.getMousePos();
var last=null;


wss.on('connection', function connection(ws) {
	console.log('connection');
	mouse = robot.getMousePos();
	ws.on('message', function incoming(message) {
		//console.log('received: %s', message);



		if(message.indexOf('{')===0){
			var gesture=JSON.parse(message);

			if(last!==gesture.event){
				console.log('store mouse on: '+gesture.event);
				mouse = robot.getMousePos();
				last=gesture.event;
			}

			
			if(gesture.event==='move'){
				robot.moveMouse(mouse.x+gesture.dx, mouse.y+gesture.dy);
			}

			if(gesture.event==='click'){
				robot.mouseClick();
			}

			if(gesture.event==='key'){
				try{
				robot.keyTap(gesture.key);
				}catch(e){
					console.log(e);
					console.log(gesture.key);
				}
			}

		}

		ws.send(message);
	});



});