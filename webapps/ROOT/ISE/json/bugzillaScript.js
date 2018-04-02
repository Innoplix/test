function () {if((document.getElementById('short_desc') && document.getElementById('short_desc').value  != searchTitle) || (document.getElementById('comment') && document.getElementById('comment').value  != searchDesc)) {
			if(document.getElementById('short_desc'))
					{searchTitle = document.getElementById('short_desc').value;}
			if(document.getElementById('comment'))
					{searchDesc = document.getElementById('comment').value;}
			chrome.extension.sendMessage({sendBack:true, type:'data', id:searchId, title:searchTitle, desc:searchDesc});
		}
}