
var Chat = {};

	Chat.socket = null;

	Chat.connect = (function(host) {
		if ('WebSocket' in window) {
			Chat.socket = new WebSocket(host);
		} else if ('MozWebSocket' in window) {
			Chat.socket = new MozWebSocket(host);
		} else {
			Console.log('Error: Log BroadCasing is not supported by this browser.');
			return;
		}

		Chat.socket.onopen = function () {				
		   Console.log('Info: Log BroadCasing connection opened. ');
			/* document.getElementById('chat').onkeydown = function(event) {
				if (event.keyCode == 13) {
					Chat.sendMessage();
				}
			}; */
		};

		Chat.socket.onclose = function () {
			document.getElementById('chat').onkeydown = null;
			Console.log('Info: WebSocket closed.');
			alert("closed")
		};

		Chat.socket.onmessage = function (message) {
			Console.log(message.data);
		};
	});
	

	Chat.initialize = function() {    
		
		if (window.location.protocol == 'http:') {
			Chat.connect('ws://' + window.location.host + '/DevTest/upload/LogBroadCasting?filter=' + localStorage.getItem('projectName') );
		} else {
			Chat.connect('wss://' + window.location.host + '/DevTest/upload/LogBroadCasting?filter=' + localStorage.getItem('projectName') );
		}
	};
  

	var Console = {};

	Console.log = (function(message) {	

	if(message.indexOf('%') != -1){
		//alert(message)
		//fileupload.actualprogress = message.slice(-3);			
		//fileupload.actualprogress = fileupload.actualprogress.slice(0, -1);	
		fileupload.actualprogress=message.substring(message.lastIndexOf(":")+1,message.length-1)
		//alert(fileupload.actualprogress)
		
	}else if(message.indexOf('Sec') != -1) 
	{
	//alert(message)
	//fileupload.timeLeft = message.slice(-14);		
	fileupload.timeLeft = message.substring(message.lastIndexOf(":")+1,message.length)

	}
	/* else if(message.indexOf('done') != -1)
	{
	fileupload.actualprogress1 = message.slice(-6);
	fileupload.actualprogress1 = fileupload.actualprogress1.slice(0,-4);		
	} */
	else
		{
	
			if(message.indexOf('Please wait') != -1) {
			
			alert(message);
			//continue; 
			}
			var console = document.getElementById('console');
			var p = document.createElement('p');
			p.style.wordWrap = 'break-word';
			p.innerHTML = message+ "\n";
			console.appendChild(p);
		
	   
		while (console.childNodes.length > 1000) {
			console.removeChild(console.firstChild);
		}
		
		message = '';
		console.scrollTop = console.scrollHeight;
	 }
			
      
 });