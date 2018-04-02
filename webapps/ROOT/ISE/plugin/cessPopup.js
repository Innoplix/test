
		//var ikeSearchURL = "http://10.98.11.17:8080/ISE/?SearchObj={%22type%22:%22advanced%22,%22input%22:%22%22,%22input2%22:%22SELECTTEXT%22,%22filter%22:[],%22indexes%22:%22defect_collection%22,%22lastSearch%22:1473306463190}#defectsearch";
		
		//10.98.11.17/
		
		var ikeSearchURL = "http://10.98.11.17/ISE/?gQuery=SELECTTEXT#knowledgestore";
		var iseSearchURL = "http://10.98.11.17/ISE/?SearchObj={%22type%22:%22advanced%22,%22input%22:%22%22,%22input2%22:%22SELECTTEXT%22,%22filter%22:[],%22indexes%22:%22defect_collection%22,%22lastSearch%22:1473306463190}#defectsearch";
		var stackoverflowURL = "http://www.google.com/#q=SELECTTEXT";
		var googleURL = "http://www.google.com/#q=SELECTTEXT";
		//var ikeAddSelectionURL	  = "http://localhost/ISE/KBSubmission.html?title=DOCTITLE&description=SELECTTEXT"; //"https://www.bing.com/search?go=Submit&q=SELECTTEXT";
		var ikeAddSelectionURL	  = "http://10.98.11.17/ISE/?gQuery=DOCTITLE&description=SELECTHTML#knowledgereadandedit"; //"https://www.bing.com/search?go=Submit&q=SELECTTEXT";
		var ikeAddPageURL	  = "http://10.98.11.17/ISE/?gQuery=DOCTITLE&urlname=GETCURRENTURL#knowledgereadandedit"; //"https://www.bing.com/search?go=Submit&q=SELECTTEXT";
		//var iseSimilarSearchURL = "http://10.98.11.17:8080/ISE/?gQuery=SEARCH_TEXT_TITLE&gQueryD=SEARCH_TEXT_DESC#defectsearch";
		var iseSimilarSearchURL = "http://10.98.11.17/ISE/?gQuery=SEARCH_TEXT_TITLE#knowledgestore";

		function ikeSearchClick() { 
			chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
				chrome.tabs.sendMessage(tab[0].id, {action: "SELECTTEXT" , url : ikeSearchURL, winid:"ike"}, function(res) {
					console.log("Searched " + res.text);
				} );
			});    
		}
		
		function iseSearchClick() { 
			chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
				chrome.tabs.sendMessage(tab[0].id, {action: "SELECTTEXT" , url : iseSearchURL, winid:"ise"}, function(res) {
					console.log("Searched " + res.text);
				} );
			});    
		}
		
		function stackoverflowClick() { 
			chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
				chrome.tabs.sendMessage(tab[0].id, {action: "SELECTTEXT", url : stackoverflowURL, winid:"stack"}, function(res) {
					console.log("Searched " + res.text);
				} );
			});    
		}
		
		function googleClick() { 
			chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
				chrome.tabs.sendMessage(tab[0].id, {action: "SELECTTEXT", url : googleURL, winid:"google"}, function(res) {
					console.log("Searched " + res.text);
				} );
			});    
		}

		function ikeAddSelectionClick() { 
			chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
				chrome.tabs.sendMessage(tab[0].id, {action: "SELECTHTML" , url : ikeAddSelectionURL, winid:"ikesel"}, function(res) {
					console.log("Searched " + res.text);
				} );
			});    
		}
	
		function ikeAddPageClick() { 
			chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
				chrome.tabs.sendMessage(tab[0].id, {action: "SELECTHTML" , url : ikeAddPageURL, winid:"ikesel"}, function(res) {
					console.log("Searched " + res.text);
				} );
			});    
		}
		
		function iseSimilarSearchClick() { 
			chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
				chrome.tabs.sendMessage(tab[0].id, {action: "SIMILARSEARCH" , url : iseSimilarSearchURL, winid:"ise"}, function(res) {
					console.log("Searched " + res.text);
				} );
			});    
		}
		
		
		
		
		//SIMY: Changed next line ; Added 'false' as third parameters
		//Looks like this is getting executed multiple times ???
		document.getElementById('ikeSearch').addEventListener('click', ikeSearchClick, false);
		document.getElementById('iseSearch').addEventListener('click', iseSearchClick, false);
		document.getElementById('stackoverflow').addEventListener('click', stackoverflowClick, false);
		document.getElementById('google').addEventListener('click', googleClick, false);
		document.getElementById('ikeAddSelection').addEventListener('click', ikeAddSelectionClick, false);
		document.getElementById('ikeAddPage').addEventListener('click', ikeAddPageClick, false);
		document.getElementById('iseSimilarSearch').addEventListener('click', iseSimilarSearchClick, false);
		
