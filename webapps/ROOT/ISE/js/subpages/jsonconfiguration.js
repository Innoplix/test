
 var jsonconfiguration = {

      /* Init function  */
      init: function()
      {
	  $(".js-example-basic-single").select2();
	  $("#s2id_jsonfile").css("width", "200px");
	  
		var orgnl_json;
	    var test;
		var jsonFile;
		var url;
					// when load button is clicked, then it fetches the specified json file and loads it in text area.
					$("#jsonfile").change(function(){
					
																					
								jsonFile=$("#jsonfile").val();
								$("#sp").text("");
								// if no file is selected.
								if ( jsonFile == "")
								{
									$("#ta").val("");
									$("#sp").css("color", "red");
									//$("#sp").text("\t Please select a file");
									return;
								}
								
								if ( jsonFile == "MozillaFireFox-date_formats" ){
									url= '/DevTest/config/DateFormatter/';
								
								}else{
									url = 'json/';
								}
								
								 $.ajax({ type : 'GET', dataType : 'json', async: true, url : url+jsonFile+'.json',
											success : function(result) {
											    orgnl_json=JSON.stringify(result, null, "\t");
												$("#ta").val(orgnl_json);
											},
											error: function(msg) {
											 //test=JSON.parse(msg);
											 $("#sp").css("color", "red");
											 $("#sp").text("\t File not loaded. Possible reasons: file not found or not in json format.");
											 $("#ta").val("");
											 console.log("failure");
										}
										} );
								
								
					 });  
		 
		
					/* when update button is clicked then it calls a rest service 'JscriptWS' . Inside JscriptWS class, first execute() will be called and 
					this method will call executeJS(). Then executeJS() will load java script file and will evaluate it then the modified json file will be 
					saved in the specified location. */
					
					$("#update_btn").click(function(){
					
								var modified_Json = $("#ta").val();
								
								// if modified json file is not in proper JSON format then return without saving the file.
								if( ! jsonconfiguration.IsJsonString(modified_Json)){
								    $("#sp").css("color", "red");
									$("#sp").text("\t Not in json format, please correct it.");
										return; 
								}
								
									// if file not modified, donot proceed to call service method, simply return.
									if( modified_Json == orgnl_json ){  
										 $("#sp").css("color", "red");
										$("#sp").text("\t No changes made.");
										return; 
									}
								var json_Data = { username : sessionStorage.getItem('username') , orgnl_json: orgnl_json, modified_Json : modified_Json, jsonFile : jsonFile, projectName : localStorage.projectName };
								var serviceName='JscriptWS'; 
								var methodname = "modifyJson";
								var hostUrl = '/DevTest/rest/';
								var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&sname='+methodname;
										
										$.ajax({
										type: "POST",
										url: Url,
										async: true,
										data: JSON.stringify(json_Data),
										success: function(msg) {
											
											 test=JSON.parse(msg);
											
											if (test.result == "success"){
												 $("#sp").css("color", "blue");
												$("#sp").text("\t File modified successfully.");
											}else{
												 $("#sp").css("color", "red");
												$("#sp").text("\t File not modified.");
											}
												
											
											 console.log(msg); 
											 
										},
										error: function(msg) {
											 //test=JSON.parse(msg);
											 $("#sp").css("color", "red");
											 $("#sp").text("\t File not modified.");
											 console.log("failure");
										}
										
									});
									
							/*	if(test === undefined){
									$("#sp").text("\t  failure: "+jsonFile+".json file not modified.");
								} */
								
									
					});
    },
	

	displayText: function(){
	 alert("123");
	},
	
	//function IsJsonString(str) {
	IsJsonString: function(str){
	
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
  };
