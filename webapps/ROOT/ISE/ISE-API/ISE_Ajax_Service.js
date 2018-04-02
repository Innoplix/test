/*-------------------------------------------------------------------------
 * ISE_Ajax_Service.js - Handle Service Calls.
 *-------------------------------------------------------------------------*/
var ISE_Ajax_Service = {

    hostUrl: '/DevTest/rest/',
    authToken: 'null',


    ajaxGetRequest: function(serviceName, respType, command) {
        //var Url = ISE_Ajax_Service.hostUrl + serviceName + '?command=' + command + '&resptype=' + respType;
		var Url = ISE_Ajax_Service.hostUrl + serviceName + '?command=' + command + '&resptype=' + respType + '&projectname=' + localStorage.getItem('projectName');
        var respJson;
        $.ajax({
            type: "GET",
            url: Url,
            async: false,
            success: function(msg) {
                respJson =  msg; //returning as object.
               if (/Authentication Failed/i.test(respJson.ERROR)) {
                     ISE_Ajax_Service.invalidTokenCallback();
                 }
                 
                
                return respJson;
            },
            failure: function(msg) {
               console.log("failure");
            }
        });
        return respJson;

    },

    ajaxPostRequest: function(serviceName, respType, command, data, callBackFunction) {

        //var Url = ISE_Ajax_Service.hostUrl + serviceName + '?command=' + command + '&resptype=' + respType;
		var Url = ISE_Ajax_Service.hostUrl + serviceName + '?command=' + command + '&resptype=' + respType + '&projectname=' + localStorage.getItem('projectName');
        var respJson;
        $.ajax({
            type: "POST",
            url: Url,
            async: false,
            data: data,
            success: function(msg) {
                respJson = msg; //returning as object 
               if (/Authentication Failed/i.test(respJson.ERROR)) {
                     ISE_Ajax_Service.invalidTokenCallback();
                 }
                if(callBackFunction)
					callBackFunction(msg);
				else 
					return respJson;
            },
            failure: function(msg) {
                 console.log("failure");
            }
        });
        return respJson;
    },

    ajaxPostReq: function(serviceName, respType, authToken, data,callBackFunction) {
        var respJson;
        //var Url = ISE_Ajax_Service.hostUrl + serviceName + '?type=' + respType + '&authtoken=' + authToken;
		//var dataObj = JSON.parse(data).object;
		//var projectName = (dataObj && dataObj.projectName && dataObj.projectName !== "") ? dataObj.projectName : localStorage.getItem('projectName');
		var Url = ISE_Ajax_Service.hostUrl + serviceName + '?type=' + respType + '&authtoken=' + authToken + '&projectname=' + localStorage.getItem('projectName');
	//	var Url = ISE_Ajax_Service.hostUrl + serviceName + '?type=' + respType + '&authtoken=' + authToken + '&projectname=' + projectName;
        $.ajax({
            type: "POST",
            url: Url,
            async: true,
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(msg) {
                 
                                     
               if(typeof callBackFunction === 'function')
               {
                  callBackFunction(msg);
                   if (/Authentication Failed/i.test(msg.ERROR)) {
                    ISE_Ajax_Service.invalidTokenCallback();
                }
               }
               else
               {
                   respJson = msg;  
                if (/Authentication Failed/i.test(respJson.ERROR)) {
                    ISE_Ajax_Service.invalidTokenCallback();
                }
                
                return respJson;
               }
               

            },
            failure: function(msg) {
                 console.log("failure");
            }
        });
        return respJson;
    },

     
    //something that can be modified by user
    invalidTokenCallback: function() {
		localStorage.setItem("redirectURL", window.location.href);
        //alert("Session Invalid");
        window.location = "login.html";
    },
	
_genericServiceCall:function(methodname,json_Data)
	{	
	 var respJson;
	//userManagement.roleList = {};
	var resultsData;
	var serviceName='JscriptWS'; 
	var hostUrl = '/DevTest/rest/';
	var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&isAuthReq=true&sname='+methodname;
								
	$.ajax({
	type: "POST",
	url: Url,
	async: false,
	data: JSON.stringify(json_Data),
	success: function(msg) {
	
	respJson = JSON.parse(msg)
	 //callBackFunction(msg);
	return respJson
	},
	error: function(msg) {
		 //test=JSON.parse(msg);
		 $("#sp").css("color", "red");
		 $("#sp").text("\t File not modified.");
		 console.log("failure");
	}
	
	});
	return respJson
	},
	
	signUpUser:function(json_data){
				var respJson;
				var resultsData;
				var serviceName='JscriptWS'; 
				var hostUrl = '/DevTest/rest/';
				var methodname = 'selfSignUp';
				var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&isAuthReq=true&sname='+methodname;
											
				$.ajax({
				type: "POST",
				url: Url,
				async: false,
				data: json_data,
				success: function(msg) {
					respJson = JSON.parse(msg)
					console.log("Self signup success.");
					return respJson
				},
				error: function(msg) {
					 console.log("Self signup failure.");
				}
				
				});	
				return respJson;
	},
	ajaxPostReq1: function(serviceName, respType, authToken, data,callBackFunction) {
        var respJson;
        //var Url = ISE_Ajax_Service.hostUrl + serviceName + '?type=' + respType + '&authtoken=' + authToken;
		var Url = ISE_Ajax_Service.hostUrl + serviceName + '?type=' + respType + '&authtoken=' + authToken + '&projectname=' + localStorage.getItem('projectName');
        $.ajax({
            type: "POST",
            url: Url,
            async: true,
            data: data,
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function(msg) {
                 
                                     
               if(typeof callBackFunction === 'function')
               {
                  callBackFunction(msg);
                   if (/Authentication Failed/i.test(msg.ERROR)) {
                    ISE_Ajax_Service.invalidTokenCallback();
                }
               }
               else
               {
                   respJson = msg;  
                if (/Authentication Failed/i.test(respJson.ERROR)) {
                    ISE_Ajax_Service.invalidTokenCallback();
                }
                
                return respJson;
               }
               

            },
            failure: function(msg) {
                 console.log("failure");
            }
        });
        return respJson;
    }
};
