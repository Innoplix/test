function(){
	var titles= document.evaluate('//div[@class="clearquestForm dijitLayoutContainer dijitContainer dijitTabPane dijitTabContainerTop-child dijitTabContainerTop-dijitLayoutContainer dijitVisible"]//input[starts-with(@id,"cq_widget_CqURLTextBox_")]', document, null, XPathResult.ANY_TYPE, null );
		//alert(titles)
		var title = titles.iterateNext();
		var sTitle = title.value;
		var descs= document.evaluate('//div[@class="clearquestForm dijitLayoutContainer dijitContainer dijitTabPane dijitTabContainerTop-child dijitTabContainerTop-dijitLayoutContainer dijitVisible"]//div[starts-with(@id,"cq_widget_CqReadonlyTextArea_")]', document, null, XPathResult.ANY_TYPE, null ); 
		var desc = descs.iterateNext();
		var sDesc = desc.textContent;
		
		console.log("title:"+sTitle+" : desc : "+sDesc)
		  //aria-valuenow
		
    if((sTitle  != searchTitle) || ( sDesc  != searchDesc)) {			
					searchTitle = sTitle;			
					searchDesc = sDesc;
			chrome.extension.sendMessage({sendBack:true, type:'data', id:searchId, title:searchTitle, desc:searchDesc});
	}
							
}