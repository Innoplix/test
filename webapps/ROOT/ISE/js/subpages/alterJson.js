
 var alterJson = {

      /* Init function  */
      init: function()
      {
	  $(".js-example-basic-single").select2();
	  $("#s2id_jsonfile").css("width", "200px");
	  
		var orgnl_json;
	    var test;
		var jsonFile;
		var url;
		var defectId ;
					  
					$('#getdata_btn').click(function() {
						defectId = $('#defectid').val();
						
					var jsonString='{"requesttype":"getJsonDataById","collection":"defects","columnname":"_id","columnvalue":"'+defectId+'","projectName":"' + localStorage.getItem('projectName') + '"}';
					console.log(jsonString)
					var defectData = ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString,alterJson.displyDataById);
											
					});
					/* when update button is clicked then it calls a rest service 'JscriptWS' . Inside JscriptWS class, first execute() will be called and 
					this method will call executeJS(). Then executeJS() will load java script file and will evaluate it then the modified json file will be 
					saved in the specified location. */
					
					$("#update_btn").click(function(){
					
								var modified_Json = $("#jsondata").val();
								
								// if modified json file is not in proper JSON format then return without saving the file.
								if( ! alterJson.IsJsonString(modified_Json)){
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
									// service call..
									 var jsonString='{"requesttype":"insertJsonObject","collection":"defects","object":'+JSON.stringify(modified_Json)+',"projectName":"' + localStorage.getItem('projectName') + '"}';
									 ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString,alterJson.jsonResponse);
																
									
					});
    },
	
	displyDataById:function(statusObject){

        	console.log(JSON.stringify(statusObject));
			orgnl_json = JSON.stringify(statusObject,null,2)
			$("#jsondata").val(orgnl_json);

        },
		jsonResponse:function(statusObject){
			var resp = JSON.stringify(statusObject);
			if (resp.indexOf("true") >= 0){
				$("#sp").css("color", "green");
				$("#sp").text("Record updated successfully...");
			}else{
				$("#sp").css("color", "red");
				$("#sp").text("Problem occured while updating record...");
			}
        	 

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
