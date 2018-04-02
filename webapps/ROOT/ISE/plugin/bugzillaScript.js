
function getDetails() {
	var ret = {};	
	if(document.getElementById('short_desc'))
		{ret['title'] = document.getElementById('short_desc').value;}
	if(document.getElementById('comment'))
		{ret['desc'] = document.getElementById('comment').value;}
	return ret;
}

if(document.getElementById('deadline') && /bugzilla\/show_bug/.test(window.location.href)) {
	if(document.getElementById('deadline').value == "") {
		//alert("ETA is not entered");
		var d = document.createElement('div');
		d.setAttribute('class', "blinkDIV");
		d.innerHTML="ETA is not entered";
		document.getElementById("header").appendChild(d);
	}
	else {
		var dtDeadline = new Date(document.getElementById('deadline').value);
		var dtNow = new Date();
		if(dtDeadline < dtNow) {
			//alert("ETA corossed");
			var d = document.createElement('div');
			d.setAttribute('class', "blinkDIV");
			d.innerHTML="ETA crossed";
			document.getElementById("header").appendChild(d);
		}
	}
}

if(document.getElementById('commit')) {
	document.getElementById('commit').disabled=true;
}

if(document.getElementById('commit') && document.getElementById('comment')) {
	document.getElementById('comment').onkeyup = function() {
		if(document.getElementById('comment').value.length > 49)
			document.getElementById('commit').disabled=false;
	};
}