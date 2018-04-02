/*-------------------------------------------------------------------------
 * ISE framework classes for the user login.
 *
 * DEPENDENCIES
 *  - ise-utils.js
 *  - metronic.js
 *-------------------------------------------------------------------------*/
 var hostname = window.location.hostname;
 var port = window.location.port;
 var protocol = window.location.protocol;
 var elasticsearchHostUrl= protocol+'//'+hostname+':'+port+'/DevTest/ES';
 console.log('elasticsearchHost:::::'+elasticsearchHostUrl);
var iseConstants = {
    
    /*  Common Constants    */
    url: window.location.protocol + "//" + window.location.host + "/" + window.location.pathname.split("/")[1],
    str_success : "success",

    /*  Login.js Constants  */
    str_login_ErrorMsg: "Login Details Provided are Incorrect",
    str_login_Dropdown_Initialvalue: "-- Select Organization --",    
    int_login_Dropdown_SetIndex: 0,
    str_login_License_ErrorMsg: "Invalid License. Please contact System Admin",
	 str_docs_collection:"kb_docs_collection",
	 str_package_collection:"package_collection",
     str_assignation_collection:"assignation_collection",
	 str_forum_collection:"forum_collection",
	 str_ikeforum_collection:"ikeforum_collection",
	 EnableSmartFAQ:false,
	 ConvertDocstoHTML:true,
	 NewDocsCreator:false,
	 isDownloadAllowed:false,
	 maxFileSize :50, // Bytes
	 
    /*  Elastic Search    */
    //elasticsearchHost	: "http://localhost/DevTest/ES",
	//serverHost: "10.98.11.17",
	//console.log(window.location.hostname);
	
	elasticsearchHost	: elasticsearchHostUrl,
	serverHost: hostname,
	graphName:'All-Defect-Insights',
	featureMapping	:	"defect_collection,testcase_collection,sourcecode_collection",
	organization : '',
	multilingual : false,
	useAbbyy : false
};
