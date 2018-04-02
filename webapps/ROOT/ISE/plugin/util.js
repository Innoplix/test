
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
		if (request.action == "SELECTTEXT") {
			console.log("SELECTTEXT");
			var ret = getSelectionData();
			var u = request.url.replace('DOCTITLE',encodeURI(ret.title));
			u = u.replace('SELECTTEXT',encodeURI(ret.text));
			u = u.replace('GETCURRENTURL',encodeURI(window.location.href));
			console.log( 'opening ' + u);
			window.open(u,request.winid);
			sendResponse(ret);
		}
		else if (request.action == "SELECTHTML") {
			console.log("SELECTHTML");
			var ret = getSelectionHtml();
			var u = request.url.replace('DOCTITLE',encodeURI(ret.title));
			u = u.replace('SELECTHTML',encodeURI(ret.selection));
			u = u.replace('GETCURRENTURL',encodeURI(window.location.href));
			
			if(u.length >=30000)
			{
				alert('Select less chracters to use this option or use (Add this page to ike knowledgebase) option'); 
			}
			else 
			{
				console.log( 'opening ' + u);
				window.open(u,request.winid);
			}
			
			sendResponse(ret);
		}
		else if (request.action == "SIMILARSEARCH") {
			console.log("SIMILARSEARCH");
			var ret = getDetails();
			var u = request.url.replace('SEARCH_TEXT_TITLE',encodeURI(ret.title));
			u = u.replace('SEARCH_TEXT_DESC',encodeURI(ret.desc));
			console.log( 'opening ' + u);
			window.open(u,request.winid);
			sendResponse(ret);
		}
    }
);
