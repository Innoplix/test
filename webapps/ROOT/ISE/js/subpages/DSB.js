

var DSB = {

  
    /* Init function  */
    init: function() {
	
		
		//load only first time ..
		if( typeof DSB.urlList === 'undefined' ) {
			$.ajax({ type : 'GET', dataType : 'json', async: false, url : 'json/DSB_urllist.config.json?_=' + Math.random(),
					 success : function(data) {
						DSB.urlList = data;
					}} );
		}
						
		
	
		var page = window.location.hash.slice(1);
		var c = $('#pageContainer').find('#page_' + page).find('iframe');
		DSB.setTFDimenstions(c);
		var subpage = page.split('_')[1];
		var url = DSB.urlList[subpage];
		//console.log("Trying to load '"+url +"' in iframe");
		//var url = DSB.urlList[subpage];
           if (!(typeof url === "string")) {
                     c.css('height',url.height );
                     url = url.src;
                     
           }

		   // if there is no url, 
		   if(!url) {
		   //DevTest/dashboard/index.html#/dashboard/SampleTest?embed &_g=(time:(from:now-1y,mode:quick,to:now))&_a=(filters:!(),query:(query_string:(analyze_wildcard:!t,query:'product:iSE%20AND%20(priority:P0%20OR%20priority:P1)')),title:SampleTest)"
				
				// If Dashboard is configured then construct default url by adding dashboard name and title.
				if(DSB.urlList[subpage].kibanaDashboardName && DSB.urlList[subpage].kibanaDashboardName!=""){
				var dashboardName = DSB.urlList[subpage].kibanaDashboardName.replace(/ /g, "-");
				url = DSB.urlList["kibanaURL"]+dashboardName+"?embed&title:"+DSB.urlList[subpage].kibanaDashboardName;	
				
				
					//if time filter is there, add it to url.
					if( DSB.urlList[subpage].kibanaDashboardTimeFilter && DSB.urlList[subpage].kibanaDashboardTimeFilter != "" ){
						url = url+ "&_g=(time:"+DSB.urlList[subpage].kibanaDashboardTimeFilter+")";	
					}
					//if time filter is not there or timefilter is there but value is undefined then set default time.
					if( !(DSB.urlList[subpage].kibanaDashboardTimeFilter) || DSB.urlList[subpage].kibanaDashboardTimeFilter === undefined ){
						url = url+ "&_g=(time:(from:now-1y,mode:quick,to:now))";	
					}
					//if dashboard filter is there, add it to url
					if( DSB.urlList[subpage].kibanaDashboardFilter && DSB.urlList[subpage].kibanaDashboardFilter != "" ){
						url = url+ "&_a=(filters:!(),query:(query_string:(analyze_wildcard:!t,query:'"+DSB.urlList[subpage].kibanaDashboardFilter+"')))";
					} 
				  
				   if(DSB.urlList[subpage].kibanadDashboardDisplaySearchBar && DSB.urlList[subpage].kibanadDashboardDisplaySearchBar == "false" ){
						url = url+ "&hidebar=1";
					} 
					//url = DSB.urlList["kibanaURL"]+DSB.urlList[subpage].kibanaDashboardName+"?embed &_a=(filters:!(),query:(query_string:(analyze_wildcard:!t,query:'"+DSB.urlList[subpage].kibanaDashboardFilter+"')),title:"+DSB.urlList[subpage].kibanaDashboardName+")";	
					console.log(url);
				}
				
				//If Dashboard is not configured.
				else {
				
					console.log("No Dashboard Configured");
				}
		   }
           setTimeout( function() { c.parent().unblock(); }, 1000);
           c.parent().block({
                message: 'Wait while loading .. this may take few seconds .. ..', 
                     centerY: false,
                css:
                { 
                    border: '3px solid gray',
                    top: '200px',
                    position:'fixed'
                }
            });

	
		url = url.replace(/%USERNAME%/g,sessionStorage.getItem('username'));
		url = url.replace(/%RELEASE%/g,localStorage.getItem('releaseId'));
		
		c.prop('src', url );


    },


    setTFDimenstions: function(c) {
		
        var container = c.parent();
        c.attr('width', container.width()); //max width
        c.attr('height', container.height()); //max height

    },

    onFullscreen: function() {

        window.setTimeout(function() {
            setTFDimenstions();
        }, 10);
    }
};
