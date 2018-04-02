
// SIMY: No Jquery to avoid conflicts
// SIMY: Checking for document ready
(function(){
    var tId = setInterval(function() {
        if (document.readyState == "complete") __onComplete()
    }, 250);
    function __onComplete(){
        clearInterval(tId);
		HCLBot_OnDocumentLoad();
           
    };
})()

var HCLBot_url ;

//All function names should be prefixed to avoid conflicts
function HCLBot_OnDocumentLoad() {
	
	var jsFileLocation = document.querySelector('script[src*=HCLchatbot]').getAttribute('src');  // the js file path
	jsFileLocation = jsFileLocation.replace('HCLchatbot.js', '');   // the js folder path
	
	
	var link 	= document.createElement("link");
	link.href 	= jsFileLocation + 'windowfiles/dhtmlwindow.css';
	link.type 	= "text/css";
	link.rel 	= "stylesheet";
	document.head.appendChild(link);
	
	link 	= document.createElement("link");
	link.href 	= jsFileLocation + 'HCLchatbot.css';
	link.type 	= "text/css";
	link.rel 	= "stylesheet";
	document.head.appendChild(link);
	
	var script 	= document.createElement('script');
	script.src	= jsFileLocation + 'windowfiles/dhtmlwindow.js';
	script.onload = createWindow; // SIMY: Invoke this function once the script is loaded !
	document.head.appendChild(script);
	
	


	
	
	//setTimeout(createWindow,3000); // after 3 seconds .. ie after loading above scripts !
	
}

function createWindow() {
	var el  	= document.querySelector('script[src*=HCLchatbot]');
	var jsf 	= el.getAttribute('src').replace('HCLchatbot.js', '');  // the js file path
	var url 	= el.getAttribute('botUrl');
	var height 	= el.getAttribute('height');
	var width   = el.getAttribute('width');
	var bottom	= el.getAttribute('bottom');
	var left	= el.getAttribute('left');
	
	console.log(height);
	
	HCLBot_url 	= url?url:"ws://localhost:8889/";
	var h		= height!= null?parseInt(height):200;
	var w		= width != null?parseInt(width):300;
	var b		= bottom!= null?parseInt(bottom):40;
	var l		= left	!= null?parseInt(left):40;
	
	
	
	
	
	
	
	
	
	dhtmlwindow.imagefiles = [jsf+'windowfiles/min.png', jsf+'windowfiles/close.gif', jsf+'windowfiles/restore.gif', jsf+'windowfiles/resize.gif'];
	
	var innerHTML = '<div class="HCLBotConsole" id="HCLBot_console"></div><br/>' +
					'<div class="bottom-ctrl-conatiner"><input type="text" class="HCLBotText" onkeypress="HCLBot_OnKeyPress(event)" id="HCLBot_text"/> <input class="HCLBotSendButton" type="submit" onclick="HCLBot_OnSend()" value="Send" id="HCLBot_send"/><div>';
	
	
	var l1 = window.innerWidth - w - l;
	var t1 = window.innerHeight - h - b;

	var inlinewin=dhtmlwindow.open("HCLBotwindow", "inline", innerHTML, "Autobot", "width="+w+"px,height="+h+"px,left="+l1+"px,top="+t1+"px,resize=1,scrolling=0", "recal");
	
}

function HCLBot_OnSend() {
	var t = document.getElementById('HCLBot_text');
	
	HCLBot_WebSocket(t.value);
	t.value = "";
	t.focus();
}



function HCLBot_OnKeyPress(e) {
    if (e.keyCode == 13) {
        HCLBot_OnSend();
    }
}


var HCLBot_ws;


function HCLBot_WebSocket(m) {
        
		
		if( HCLBot_ws ) {
			HCLBot_ws.send(m);
			HCLBot_AppendConsole(m,'red');
		} else {
               // Let us open a web socket first time
               HCLBot_ws = new WebSocket(HCLBot_url);
				
               HCLBot_ws.onopen = function()
               {
                  // Web Socket is connected, send data using send()
                  HCLBot_ws.send(m);
				  HCLBot_AppendConsole('Connected with bot','green');
				  HCLBot_AppendConsole(m,'red');	
               };
				
               HCLBot_ws.onmessage = function (evt) 
               { 
                  var received_msg = evt.data;
                  HCLBot_AppendConsole(received_msg,'blue');
               };
				
               HCLBot_ws.onclose = function()
               { 
                  HCLBot_AppendConsole('Good Bye','green');
				  HCLBot_ws = undefined;
               };
        }
            
}

var HCLBot_timer;
function HCLBot_AppendConsole(m, color) {
	
	var s = document.createElement("div");
	s.className  = 'HCLBot_'+color;
	if(color=="blue")
		s.innerHTML = '<div class="HCLBot_img"><img  src="chatbot/windowfiles/face_img_1.png"></div>'+m ; //+ "<br/>";
	else
		s.innerHTML = m;
	var element = document.getElementById("HCLBot_console");
	element.appendChild(s);
	element.scrollTop = element.scrollHeight; // SIMY: scroll down
	
	//add image
	var i = document.createElement("div");
	i.className  = 'HCLBot_img';
	i.innerHTML = '<div class="HCLBot_img"><img src="chatbot/windowfiles/face_1.png"></div>' ;
	//element.appendChild(i);
	//var ielement = document.getElementsByClassName('HCLBot_blue');
	//ielement.appendChild(i);
	
	//inactive Timeout
	clearTimeout(HCLBot_timer);
	HCLBot_timer = setTimeout(function(){ eval ('HCLBot_ws.close()'); HCLBot_ws = undefined;},60000);
}
