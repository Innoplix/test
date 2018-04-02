
 var tsfileupload = {	
	
	/* Init function  */
	init: function()
	{			
		console.log("tsfileupload init()"); 
		$(function()
		{
			$('#file1').on('change',function ()
			{
				var filePath = $(this).val();
				console.log("==13#=="+document.getElementById("file1").files[0].fileName);
			});
		});

	},
	
	tsfileUpload :function(){ //capture form input data
	    
		var sampleFile = document.getElementById("file1").files[0];
       
	   var formdata = new FormData();
	   
        formdata.append("file", sampleFile);		
		tsfileupload.performAjaxSubmit(formdata);
	
	},	
	
	performAjaxSubmit :function(formdata) { //send form input data to servlet      
		//console.log("formdata == "+JSON.stringify(formdata));
        var xhr = new XMLHttpRequest();       
		$('#textSummerization').empty();
        xhr.open("POST","../DevTest/services/TsUploadServlet", true);

        xhr.send(formdata);

        xhr.onload = function(e) {

            if (this.status == 200) {
			 var output="";
				/* var data = this.responseText.split("#&#")
				if(data != null && data.length>0){
					console.log("==43=="+data.length);
					for(var i=0;i<data.length;i++){
						output = output+data[i]+"\n";
					}
					console.log("==48=="+output);
					$('#textSummerization').html(output);
				} */
				$('#textSummerization').html(this.responseText);
               //console.log(this.responseText);

            }

        };                    

    }
	
	  
  };