
function getDetails() {
   var ret = {};
	if(window.getSelection() && window.getSelection().toString())
		ret['text'] =  window.getSelection().toString();
	else {
		var textb = document.querySelectorAll( '#txtSearch')[0];
		ret['text'] = textb.value;
	}
	return ret;
}
