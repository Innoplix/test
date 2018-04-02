

var IF = {

  
    /* Init function  */
    init: function() {
	
		
		//load only first time ..
		if( typeof IF.urlList === 'undefined' ) {
			$.ajax({ type : 'GET', dataType : 'json', async: false, url : 'json/IF_urllist.config.json?_=' + Math.random(),
					 success : function(data) {
						IF.urlList = data;
					}} );
		}
						
		
	
		var page = window.location.hash.slice(1);
		var c = $('#pageContainer').find('#page_' + page).find('iframe');
		IF.setTFDimenstions(c);
		var subpage = page.split('_')[1];
		var url = IF.urlList[subpage];
		//console.log("Trying to load '"+url +"' in iframe");
		//var url = IF.urlList[subpage];
           if (!(typeof url === "string")) {
                     c.css('height',url.height );
                     url = url.src;
                     
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
