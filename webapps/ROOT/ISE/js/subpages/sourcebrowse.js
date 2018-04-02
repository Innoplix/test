
 var sourcebrowse = {

      /* Init function  */
      init: function()
      {

        var projectName = localStorage.getItem('projectName');
        var sourceURL = "http://10.98.11.16/DevTest/"+projectName+"/html/dir_75a1725232d4be58c1d1f8e1728428f1.html";
        
		  $('#sourceBrowseIframe').attr('src', sourceURL)
       
	   
        $('#sourceBrowseIframe').on('load', function(){
		
		
		 $("#sourceBrowseIframe").each(function () { 		 
		 
		   $(this).contents().find('div[id=nav-path] ul li').eq(0).css({"display":"none"});
		   $(this).contents().find('div[id=nav-path] ul li').eq(1).css({"display":"none"});	
		
				
          });
    });
	
         
    },   
    
  };
