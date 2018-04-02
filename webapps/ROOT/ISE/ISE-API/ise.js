/*-------------------------------------------------------------------------
 * ise.js - Handle the Ajax call to get the information from db.
 *
 * DEPENDENCIES
 *  - ise-utils.js
 *  - ISE_Ajax_Service.js
 *-------------------------------------------------------------------------*/
var ISE = {


    /**
       * Send Service call to get list of organizations
       * @getAllOrganizations function      
       */
    getAllOrganizations: function() {
        var resp = ISE_Ajax_Service.ajaxGetRequest('CommonRestService', 'json', 'organizations');
        return resp;
    },

   /**
       * Send Service call with login information to check valid user or not
       * @authenticateUser function
       * @param {string} username
       * @param {string} password       
       * @param {string} organization  
       */
     /* authenticateUser: function(username, password, organization) {

        sessionStorage.setItem('organization', organization);
        var data = '{"username":"' + username + '","password":"' + password + '","orgid":"' + organization + '"}'
        var resp = ISE_Ajax_Service.ajaxPostRequest('CommonRestService', 'json', 'authenticate', data);
        return JSON.parse(resp);
    },  */
	 authenticateUser: function(username, password12, organization) {

        sessionStorage.setItem('organization', organization);
		// please do not change key "username"  
        var json_Data = {username:username,password:password12,OrgId:organization}
		if(iseConstants.organization != "" && iseConstants.organization != null && iseConstants.organization.toLowerCase() == 'cisco')
		{
			 json_Data = {username:username,password:password12,organizationName:iseConstants.organization}
		}
        var resp = ISE_Ajax_Service._genericServiceCall('authenticate',json_Data);
		console.log("resp"+resp)
        return resp;
    },  
    
     licenseCheckValidation: function(username) {
	 console.log("-------36---------------ise.js--------")
        var data = '{"username":"' + username + '"}'
        var resp = ISE_Ajax_Service.ajaxPostRequest('CommonRestService', 'json', 'licenseCheck', data);
        return JSON.parse(resp);
    },
    
     /**
       * Send Service call for sign up new user
       */
    signUpUser: function(token, userName, userPassWord, fullName, organization, emailId, alternateEmailId, phoneNo, roleName, department, address, orgId, roleId,projectName) {
		
        var json_data = '{"token":"' + token + '","username":"' + userName + '","password":"' + userPassWord + '","fullName":"' + fullName + '","organizationName":"' + organization + '","emailId":"' + emailId + '","alternateEmailId":"' + alternateEmailId + '","phoneNo":"' + phoneNo + '","roleName":"' + roleName + '","department":"' + department + '","address":"' + address + '","orgId":"' + orgId + '","roleId":"' + roleId + '","projectName":"' + projectName + '"}' 
		var resp = ISE_Ajax_Service.signUpUser(json_data);
		console.log("ise.signUpUser():resp:");
		console.log(resp);
		return resp;
    },
	sendMail: function(mailPwd, emailId, sendMailCallBackFunction) {
	
		//var json_data = '{"requesttype":"email","from":"salimuddin.k@hcl.com","to":"salimuddin.k@hcl.com","subject":"ISE Login Password","mailBody":"Your password is : 123"}'
		var json_data = JSON.stringify({requesttype:"email", from :"salimuddin.k@hcl.com", to: emailId, subject: "ISE Login Password",mailBody: "Your password is : "+mailPwd});
		var resp = ISE_Ajax_Service.ajaxPostReq('EmailService', 'json', localStorage.authtoken, json_data,sendMailCallBackFunction);
		console.log("ise.sendMail():resp:");
		console.log(resp);
		return resp;
    },

	getKibanaData:function(requestObject,callBackFunction){
	
		console.log(" getKibanaData : ============");
		if(!requestObject) {
			callBackFunction(null); 
			return;
		}
		var masterBucket = new Array(); 
		var eachfeature ={};     
		var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

		client.search({
			index: requestObject.collectionName,
			type:requestObject.projectName,
			body: {  
				"query": {
					"match_all": {}
				},"size": 1000
																																		  
			}
		}).then(function (resp) {
			  console.log(resp); 
			  masterBucket = [];
			  var temp = resp.hits.hits;
			  
			  for(var i=0;i<temp.length;i++){
					eachfeature ={}; 
				  eachfeature._index = temp[i]._index;
						  eachfeature._id = temp[i]._id;
				  eachfeature.title = temp[i]._source.title;
				  masterBucket.push(eachfeature);
			  }
										  
			   //masterBucket.push(temp);
			   console.log("masterBucket data ========== ");
			   console.log(masterBucket); 
			  callBackFunction(masterBucket);       

		},function (error) {console.log(error);callBackFunction([])} );                              		  
	},

   /**
       * Send Service call to get list of projects
       * @listAllProjects function
       * @param {string} fileName
       * @param {obj} params   
       * @param {boolean} fromCache       
       */
    listAllProjects: function(fileName, params, fromCache, callBackFunction) {
        try {

            var respListProjects;
            var data = '{"username":"' + localStorage.username + '"}';
			if(callBackFunction)
				ISE_Ajax_Service.ajaxPostRequest('CommonRestService', 'json', 'projects', data,callBackFunction);
			else 
				respListProjects = ISE_Ajax_Service.ajaxPostRequest('CommonRestService', 'json', 'projects', data);
            return respListProjects;

        } catch (e) {
            console.log("listAllProjects exception -  " + e);
        }
    },
	/**
       * Send Service call to change projects
       * @changeProject function
       * @param {string} fileName
       * @param {obj} params   
       * @param {boolean} fromCache       
       */
    changeProject: function(fileName, params, fromCache) {
        try {

            var respListProjects;
            var data = '{"userid":"' + params[0] + '","projectname":"' + params[1] + '"}';
            respListProjects = ISE_Ajax_Service.ajaxPostRequest('CommonRestService', 'json', 'changeprojects', data);

            return respListProjects;

        } catch (e) {
            console.log("listAllProjects exception -  " + e);
        }
    },
   /**
       * Send Service call to get list of all releases
       * @listTotalReleases function
       * @param {string} fileName
       * @param {obj} params   
       * @param {string} projectName   
       * @param {boolean} fromCache  
       */
    listTotalReleases: function(fileName, params, projectName, fromCache,callBackFunction) {


        try {

            var data = '{"fileName":"' + fileName + '","params":"' + params + '","projectName":"' + projectName + '","fromCache":"' + fromCache + '"}';
            var resp = ISE_Ajax_Service.ajaxPostReq('QueryReportingRestService', 'json', localStorage.authtoken, data,callBackFunction);
           // resp = eval("(" + resp + ")");
            return resp;

        } catch (e) {
            console.log("listTotalReleases exception -  " + e);
        }

    },

    /**
       * Send Service call to get test execution failures information
       * @getTestExecutionFailures function
       * @param {string} fileName
       * @param {string} projectName   
       * @param {string} releaseID   
       * @param {boolean} fromCache  
       */
    getTestExecutionFailures: function(fileName, projectName, releaseID, fromCache,callBackFunction) {


        try {

            var params = ['PARAM1=' + releaseID];
            var data = '{"fileName":"' + fileName + '","params":"' + params + '","projectName":"' + projectName + '","fromCache":"' + fromCache + '"}';
            ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken, data,callBackFunction);
           

        } catch (e) {
            console.log("GetTestExecutionFailures exception -  " + e);
        }

    },
     /**
       * Send Ajax Service call to get internal & external defect information
       * @getIntExtDefects function
       * @param {string} fileName
       * @param {string} projectName   
       * @param {string} releaseID   
       * @param {boolean} fromCache  
       */
    getIntExtDefects: function(fileName, projectName, releaseID, fromCache,callBackFunction) {


        try {

            var params = ['PARAM1=' + releaseID];
            var data = '{"fileName":"' + fileName + '","params":"' + params + '","projectName":"' + projectName + '","fromCache":"' + fromCache + '"}';
            ISE_Ajax_Service.ajaxPostReq('QueryReportingRestService', 'json', localStorage.authtoken, data,callBackFunction);
          

        } catch (e) {
            console.log("GetIntExtDefects exception -  " + e);

        }
    },

    getDefectdetailsByID:function(fileName,params,projectName,fromCache,callBackFunction){

      var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
      ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,callBackFunction);
     
     
    },
	
	prioritiesListQuery:function(fileName,params,projectName,fromCache,callBackFunction){

      var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
	  ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,callBackFunction);
	  
    },
	
	features:function(fileName,params,projectName,fromCache,callBackFunction){
	
      var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
	  ISE_Ajax_Service.ajaxPostReq('QueryReportingRestService', 'json', localStorage.authtoken,data,callBackFunction);
	   
    },
	bugpriorityfeatures:function(fileName,params,projectName,fromCache,callBackFunction){
	
      var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
	  ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,callBackFunction);
	   
    },
	clustersDetail:function(fileName,params,projectName,fromCache,callBackFunction){		
      var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
	  ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,callBackFunction);
    },
	
	clustersDetailOne:function(fileName,params,projectName,fromCache,callBackFunction){		
      var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
	  ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,callBackFunction);
    },
	
	executionID:function(fileName,params,projectName,fromCache,callBackFunction){

      var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
	  ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,callBackFunction);
	  
    },
	
	clusterUserAssignation:function(fileName,params,projectName,fromCache,callBackFunction){

      var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
	  ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,callBackFunction);
	  
    },
	
	clustersDetailQuery:function(collectionName,queryString,projectName,groupCount,duplicatePercent,executionIDValue,callBackFunction){

     var data = '{"requesttype":"clusterresults","file":"clusterresults","indexname":"'+collectionName+'","indexquery":"'+queryString+'","projectName":"'+projectName+'","groupCount":"'+groupCount+'","executionIDValue":"'+executionIDValue+'","duplicatePercent":"'+duplicatePercent+'"}';
     ISE_Ajax_Service.ajaxPostReq('IndexingRestService', 'json', localStorage.authtoken,data,callBackFunction);
	
    },

   getSearchResults:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
   
	requestObject.username = localStorage.getItem('username');
	var jsondata = requestObject//{username:localStorage.getItem('username'),operation:'list'}
	 var serviceName='JscriptWS'; 
	var hostUrl = '/DevTest/rest/';
	var methodname = 'contextSearch'
	var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + 
	localStorage.projectName+'&sname='+methodname;
		var html;					
		$.ajax({
		type: "POST",
		url: Url,
		async: true,
		data: JSON.stringify(jsondata),
		success: function(msg) {
		resultsData = JSON.parse(msg);
		console.log(resultsData)
		callBackFunction(resultsData.data);
		},
		error: function(msg) {
		console.log(error);callBackFunction([])
		}
		});
			
			
  },

  /* getQuery:function(requestObject) {
    var filteJson = {};
    if(requestObject.filterString && requestObject.filterString != '') {
      filteJson = {
          "query" : {
            "query_string" : {
              "query" : requestObject.filterString,
              "default_operator":"AND"
            }
          }
      }
    }

    //SIMY(08OCT): changing the type
    if(requestObject.serachType && requestObject.serachType == "conextsearch") {
    
     //SIMY(08OCT): changing the query
    var query = {
      "filtered" : { 
        "query": {
        "bool": {
         "should": [{ "more_like_this": { "fields" : ["_all"] , "like_text":""+requestObject.title+" "+requestObject.searchString, "min_term_freq": 1,"min_doc_freq": 1,"max_query_terms": 100,"percent_terms_to_match":0.01,"analyzer" :"cess_analyzer"}},
               { "more_like_this": { "fields" : ["title"] , "like_text":""+requestObject.title, "min_term_freq": 1,"min_doc_freq": 1,"max_query_terms": 100,"boost":10,"analyzer" :"cess_analyzer" }},
            {"match": {"_all": {"query" :""+requestObject.title+" "+requestObject.searchString, "operator": "and","boost": 3,"analyzer" :"cess_analyzer"}}},
			{"match": {"_id": {"query" :""+requestObject.title+" "+requestObject.searchString, "operator": "and","boost": 3,"analyzer" :"cess_analyzer"}}},
            {"match_phrase": {"_all": {"query" :""+requestObject.title+" "+requestObject.searchString,"analyzer" :"cess_analyzer"}}}, 
{ "fuzzy_like_this": { "fields" : ["_all"] , "like_text":""+requestObject.title+" "+requestObject.searchString,"max_query_terms": 12,"boost":0.5,"analyzer" :"cess_analyzer" }}
            ],
        "minimum_should_match": 1
        }
      },"filter" : filteJson
      }
    };
    return query;
    }
    else {
    var query = {"filtered" : { 
                  "query": {"query_string": {"query": requestObject.searchString}},
                  "filter" : filteJson
                }};
    return query;
    }
  }, */
getQuery:function(requestObject) {
    var filteJson = {};
    if(requestObject.filterString && requestObject.filterString != '') {
      filteJson = {
          "query" : {
            "query_string" : {
              "query" : requestObject.filterString,
              "default_operator":"AND"
            }
          }
      }
    }

    //SIMY(08OCT): changing the type
    if(requestObject.serachType && requestObject.serachType == "conextsearch") {
    
	if(requestObject.deploymenttype != 'CISCO')	
	{
     //SIMY(08OCT): changing the query
    var query = {
      "filtered" : { 
        "query": {
        "bool": {
         "should": [
		 { "more_like_this": { "fields" : ["_all"] , "like_text":""+requestObject.title+" "+requestObject.searchString, "min_term_freq": 1,"min_doc_freq": 1,"max_query_terms": 100,"percent_terms_to_match":0.01,"analyzer" :"cess_analyzer"}},
               { "more_like_this": { "fields" : ["title"] , "like_text":""+requestObject.title, "min_term_freq": 1,"min_doc_freq": 1,"max_query_terms": 100,"boost":10,"analyzer" :"cess_analyzer" }},
			   {"match": {"title": {"query" :""+requestObject.title, "operator": "and","boost": 3,"analyzer" :"cess_analyzer"}}},
            {"match": {"_all": {"query" :""+requestObject.title+" "+requestObject.searchString, "operator": "and","boost": 3,"analyzer" :"cess_analyzer"}}},
			{"match": {"_id": {"query" :""+requestObject.title+" "+requestObject.searchString, "operator": "and","boost": 3,"analyzer" :"cess_analyzer"}}},
			{"match_phrase": {"title": {"query" :""+requestObject.title,"boost":10}}}
//{ "fuzzy_like_this": { "fields" : ["_all"] , "like_text":""+requestObject.title+" "+requestObject.searchString,"max_query_terms": 12,"boost":0.5,"analyzer" :"cess_analyzer" }}
            ],
        "minimum_should_match": 1
        }
      },"filter" : filteJson
      }
    };
    return query;
    }
	else
	{
		 var query = {
      "filtered" : { 
        "query": {
        "bool": {
         "should": [{ "more_like_this": { "fields" : ["_all"] , "like_text":""+requestObject.title+" "+requestObject.searchString, "min_term_freq": 1,"min_doc_freq": 1,"max_query_terms": 100,"percent_terms_to_match":0.01,"analyzer" :"cess_analyzer"}},
               { "more_like_this": { "fields" : ["title"] , "like_text":""+requestObject.title, "min_term_freq": 1,"min_doc_freq": 1,"max_query_terms": 100,"boost":10,"analyzer" :"cess_analyzer" }},
			    { "more_like_this": { "fields" : ["fileslist"] , "like_text":""+requestObject.title, "min_term_freq": 1,"min_doc_freq": 1,"max_query_terms": 100,"boost":10,"analyzer" :"cess_analyzer" }},
				{ "more_like_this": { "fields" : ["filediff"] , "like_text":""+requestObject.title, "min_term_freq": 1,"min_doc_freq": 1,"max_query_terms": 100,"boost":10,"analyzer" :"cess_analyzer" }},
            {"match": {"_all": {"query" :""+requestObject.title+" "+requestObject.searchString, "operator": "and","boost": 3,"analyzer" :"cess_analyzer"}}},
			{"match": {"_id": {"query" :""+requestObject.title+" "+requestObject.searchString, "operator": "and","boost": 3,"analyzer" :"cess_analyzer"}}},
            {"match": {"fileslist": {"query" :""+requestObject.title+" "+requestObject.searchString,"boost": 10,"analyzer" :"cess_analyzer"}}},
			 {"match": {"filediff": {"query" :""+requestObject.title+" "+requestObject.searchString,"boost": 10,"analyzer" :"cess_analyzer"}}},
			{"match_phrase": {"_all": {"query" :""+requestObject.title+" "+requestObject.searchString,"analyzer" :"cess_analyzer"}}}, 
{ "fuzzy_like_this": { "fields" : ["_all"] , "like_text":""+requestObject.title+" "+requestObject.searchString,"max_query_terms": 12,"boost":0.5,"analyzer" :"cess_analyzer" }}
            ],
        "minimum_should_match": 1
        }
      },"filter" : filteJson
      }
    };
		return query;
	}
	}
    else {
		if(requestObject.isAnalyzerRequired || requestObject.isAnalyzerRequired == "true")
		{
			var query = {"filtered" : { 
						  "query": {"query_string": {"query": requestObject.searchString, "analyzer" :"cess_analyzer"}},
						  "filter" : filteJson
						}};
		
			return query;
		}
		else	
		{
    var query = {"filtered" : { 
                  "query": {"query_string": {"query": requestObject.searchString}},
                  "filter" : filteJson
                }};
		
    return query;
    }
    }
  },


  setSimilarity:function(masterBucket,tempAry) {
      
   
      for (var i = 0; i < masterBucket.length; i++) {
        masterBucket[i].similarity  = tempAry[i]._score;
        masterBucket[i].score     = tempAry[i]._score
        masterBucket[i]._matchCount = ISE.countUniqueHighlighted(tempAry[i]);
      }
    
      masterBucket = ISE.normalizeSimilarity(masterBucket);  
    
      return masterBucket;
  },
  
  normalizeSimilarity:function(dataArr) {
  
    if(dataArr) {
      var termscount = ISE.lastSearchTermCount;
    //console.log("Number of terms in last search: " + termscount);
    if( termscount == null ) termscount = 1;
    
      var max=0;
      for (var i = 0; i < dataArr.length; i++) {
        
        if(parseFloat(dataArr[i].similarity) > max)
          max = parseFloat(dataArr[i].similarity);
      }
       
      for (var i = 0; i < dataArr.length; i++) {
        //B <= A * 0.5 + 0.25
        //C <= Y * 0.25
        //S <= (B + C) * 100
        var val = parseFloat(dataArr[i].similarity);
    var totalCount = parseFloat(dataArr[i]._matchCount);
        var normalizedVal = parseFloat((1 / max) * val);
        
        
        if(totalCount>termscount){
          totalCount =termscount;
        }
        var optSim = normalizedVal * 0.25 + 0.5;
        var occur = (totalCount/termscount)*0.25;
        //code added for test strts
        if(termscount == 0){
      occur = 0;
        }
        //code added for test ends
        var percent  = parseInt((optSim + occur) * 100);
		if( occur == 0.25) {
			var percent  = parseInt((normalizedVal * 0.1 + 0.9)*100);
		}
        dataArr[i].similarity = percent;
      }
    }
   
    return dataArr;
  },
  
  countUniqueHighlighted:function(record){
    if( record.highlight != null) {
    var uList = {};
    //getting all highlighted string
    var str = "";
        for(var K in record.highlight){
       for (var n = 0; n < record.highlight[K].length; n++) {
        str += record.highlight[K][n];
       }
        }
    
    //multi reg match
    var wlist = str.match(/<em class='iseH'>([^<]+)<\/em>/g);
    for( var i = 0; i < wlist.length ; i++ ) {
          var v = wlist[i].toUpperCase();;
          uList[v] = 1;
    }
    
    var count = Object.keys(uList).length;
    return count;
                     
    }
    return 0;
  },
  
  occurrences:function(string, subString, allowOverlapping){
    string+=""; subString+="";
    if(subString.length<=0) return string.length+1;

    var n=0, pos=0;
    var step=(allowOverlapping)?(1):(subString.length);

    while(true){
      pos=string.indexOf(subString,pos);
      if(pos>=0){ n++; pos+=step; } else break;
    }
    return(n);
  },
/**
       * Send Ajax Service call to get internal & external defect information
       * @getIntExtDefects function
       * @param {string} fileName
       * @param {string} projectName   
       * @param {string} releaseID   
       * @param {boolean} fromCache  
       */
       getTestingMetricsLeftGraph:function(fileName,params,projectName,fromCache,callBackFunction)
       {

        var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
        ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', sessionStorage.authtoken,data,callBackFunction);
  
       },
	   
	   defectsLocalizationData:function(fileName,params,projectName,fromCache,callBackFunction){
	
      var data = '{"fileName":"'+fileName+'","params":"'+""+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
      ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,callBackFunction);
     
    },
	
	
	defectsLocalizationData1:function(fileName,params,projectName,fromCache,callBackFunction){
	
      var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
	 ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,callBackFunction);
     
    },
	
	builds:function(fileName,params,projectName,fromCache,callBackFunction){

      var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
                  console.log("@builds in ISE");
      ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,callBackFunction);
                  console.log("@builds in ISE after ajax");
     
    },

	releases:function(fileName,params,projectName,fromCache,callBackFunction){

      var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
                  console.log("@release in ISE");
      ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,callBackFunction);
                  console.log("@releases in ISE after ajax");
     
    },
	
	features1:function(fileName,params,projectName,fromCache,callBackFunction){
      var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
      ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,callBackFunction);
    },

	
	methodDefectCount:function(fileName,params,projectName,fromCache,callBackFunction){
		var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,callBackFunction);
    },
	
	getIndices:function(fileName,params,projectName,fromCache,callBackFunction){
		console.log("indices calling.......")
		var data = '{"requesttype":"indicesresults"}';			
		ISE_Ajax_Service.ajaxPostReq('IndexingRestService', 'json', localStorage.authtoken,data,callBackFunction);
    },
	
   getDefLocalizationSearch:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
      //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
            client.search({
              index: requestObject.collectionName ,
              size: requestObject.maxResults, //15
              body: {
                
                "query": {
                 
					  "query_string": {
                        "query": requestObject.searchString
                       }
					  } 
			}
             
            }).then(function (resp) {
             //console.log( "------------540-----------"+JSON.stringify(resp));
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){

                if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
					masterBucket[i] = tempAry[i]._source;
					masterBucket[i]._index = tempAry[i]._index;
                }else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
					masterBucket[i] = tempAry[i].source;
                }
              }              
                        
             // datArr = processDefectsDataObject_ElasticSearch(masterBucket,tempAry);
              callBackFunction(masterBucket);
            });
},



 getDefLocalizationBetweenDatesSearch:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
	  
	  console.log("requestObject.fromDate----"+requestObject.fromDate)
	  console.log("requestObject.toDate----"+requestObject.toDate)
      //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});           
		   client.search({
              index: requestObject.collectionName ,
              size: requestObject.maxResults, //15
              body: {
                
                "highlight": {
                 "pre_tags" : ["<span style='background-color:YELLOW'>"],
                  "post_tags" : ["</span>"],
              
                  
                  "fields": {
                    "description":{},
            "title":{},
                  }
                  },
               
			   
			   "query": {
					"filtered": {
					   "query": {
							"match_all": {}
					   }
					}
				}, 
				"filter": {
					"range" : {
						"last_updated_date" : {
							"gte": requestObject.fromDate,
							"lte": requestObject.toDate   

							//"gte": "2015-10-4",
							//"lte": "2016-11-3"  							
						}
					}
				}
			
			
			   
			}
             
            }).then(function (resp) {
              //console.log( "dates between Datea search ------------"+resp);
			 // console.log( "dates between Datea search json ------------"+JSON.stringify(resp));
             
			  var temp = resp.hits;
              var tempAry = temp.hits;
			  
              for(var i = 0;i< tempAry.length;i++){
				if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
					masterBucket[i] = tempAry[i]._source;
					masterBucket[i]._index = tempAry[i]._index;
                }else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
					masterBucket[i] = tempAry[i].source;
                }
              }
                        
             // datArr = processDefectsDataObject_ElasticSearch(masterBucket,tempAry);
              callBackFunction(masterBucket);
            });
},

//Files Starts
	getDefLocalizationFiles:function(requestObject,callBackFunction) {

		  if(!requestObject) {
        callBackFunction(null); 
        return;
      }
	  
	  //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
            client.search({
              index: requestObject.collectionName ,
              size: requestObject.maxResults, //15
              body: {
                
                "highlight": {
                 "pre_tags" : ["<span style='background-color:YELLOW'>"],
                  "post_tags" : ["</span>"],
              
                  
                  "fields": {
                    //"no_match_size": 150},
            "description":{},
            "title":{},
                  }
                  },
               
			   
			   "query": {
					"filtered": {
					   "query": {
							//"match_all": {}
							"query_string" : {
                        "query" : "_exists_:file"
                    }
					   }
					}
				}
				/*, 
				"filter": {
					"range" : {
						"last_updated_date" : {
							// to do change below hot coded values
							"gte": requestObject.fromDate,
							"lte": requestObject.toDate         
							//"gte": "2015-09-12",
							//"lte": "2015-10-20" 							
						}
					}
				}*/
			
			
			   
			}
             
            }).then(function (resp) {
              //console.log( "dates between Datea search ------------"+resp);
			 // console.log( "dates between Datea search json ------------"+JSON.stringify(resp));
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){

                if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
					masterBucket[i] = tempAry[i]._source;
					masterBucket[i]._index = tempAry[i]._index;
                }else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
					masterBucket[i] = tempAry[i].source;
                }
              }              
                        
             // datArr = processDefectsDataObject_ElasticSearch(masterBucket,tempAry);
              callBackFunction(masterBucket);
            });
},

//Files Ends
getDefLocalizationTestSearch:function(requestObject,callBackFunction) {

			  if(!requestObject) {
				callBackFunction(null); 
				return;
			  }
			  //need to write other error checks
			  var masterBucket = new Array();
				var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
					client.search({
					  index: requestObject.collectionName ,
					  size: requestObject.maxResults, //15
					  body: {
						"query": {
									"match": {"status": "failed"}
								},
								"sort": [{"date": { "order": "desc" } }]
					}
					 
					}).then(function (resp) {
					  //console.log( "testcaserespons"+JSON.stringify(resp));
					  var temp = resp.hits;
					  var tempAry = temp.hits;
					 for(var i = 0;i< tempAry.length;i++){

						if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
							masterBucket[i] = tempAry[i]._source;
							masterBucket[i]._index = tempAry[i]._index;
						}else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
							masterBucket[i] = tempAry[i].source;
							
						}
					  }              
								
					 callBackFunction(masterBucket);
					});
		},
		
		getDefLocalizationTestDateSearch:function(requestObject,callBackFunction) {

			  if(!requestObject) {
				callBackFunction(null); 
				return;
			  }
			 var tcidval = requestObject.searchString;
			 console.log("tcdateval-------"+tcidval);
			  //need to write other error checks
			  var masterBucket = new Array();
				var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
					client.search({
					  index: requestObject.collectionName ,
					  size: requestObject.maxResults, //15
					  body: {
						
						
						"query" : {
							  "filtered" : { 
								  "query":  { "match": { "testcaseid": tcidval }},
								"filter" : {
									"bool" : {
									  "must" : [
										 { "term" : {"status" : "passed"}}
									  ]
								   }
								   
								 }
							  }
						   },
						   "sort": [{"date": { "order": "desc" } }],
						   "size": 1
						
						
					}
					 
					}).then(function (resp) {
					 console.log( "testcasedaterespons---"+JSON.stringify(resp));
					  var temp = resp.hits;
					  var tempAry = temp.hits;
					 for(var i = 0;i< tempAry.length;i++){

						if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
							masterBucket[i] = tempAry[i]._source;
							masterBucket[i]._index = tempAry[i]._index;
						}else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
							masterBucket[i] = tempAry[i].source;
							
						}
					  }              
								
					 callBackFunction(masterBucket);
					});
		},
// added 

	getSearchResultsByDateRange:function(requestObject,callBackFunction) { 
			
		var toDaterplVal = new Date(requestObject.fromOutputDate).getTime();
		var fromDaterplVal = new Date(requestObject.fromInputDate).getTime();
		
		if(!requestObject) {
			callBackFunction(null); 
			return;
      }
      //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
            client.search({
              index: requestObject.collectionName ,
              size: requestObject.maxResults, //15
              body: {
                
                
                "query": {
                
						"range" : {
							"date" : {
							"gte": fromDaterplVal,
							"lte": toDaterplVal
							
								}
							}
						} 
			}
             
            }).then(function (resp) {
              //console.log( "-------763------dates range"+resp);
              var temp = resp.hits;
             var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){

                if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
                 
                  masterBucket[i] = tempAry[i]._source;
					masterBucket[i]._index = tempAry[i]._index;
                }else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
                 
                  masterBucket[i] = tempAry[i].source;
                }
                
              }              
              callBackFunction(masterBucket);
            });
	},

getCountForThefield:function(requestfield,callBackFunction) {
                                                
                var toDaterplVal = new Date(requestfield.fromOutputDate).getTime(); 
                var fromDaterplVal = new Date(requestfield.fromInputDate).getTime();
                var field=requestfield.field;
                
                //var filterfield=requestfield.filterfield;
                var number=requestfield.no;     
                if(!requestfield) {
        callBackFunction(null); 
        return;
      }
                   var masterBucket = new Array();
                
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});                         
            client.search({
              index: requestfield.collectionName ,             
              body: {
                                                                                "query": {
                                                                                                                "filtered": {
                                                                                                                   "query": {
                                                                                                                                                "match_all": {}
                                                                                                                   }
                                                                                                                }
                                                                                                },    
                                                                                "aggregations": {
                                                                                                "prioritybucket": {
                                                                                                  "terms": { "field": "priority" },
                                                                                                                "aggregations": {
                                                                                                                "featurebucket": {
                                                                                                                   "terms": { "field": field, "size":0 }
                                                                                                                }
                                                                                                 }
                                                                                                }
                                                                                  
                                                                                },    "size":0

                                                                }
                                                }).then(function (resp) {
                                                                                                                                
                                                                var resAgg = resp.aggregations;
                                                                var totaldefect = resp.hits.total;                                                                
                                                                var terms=resAgg.prioritybucket.buckets;                                                                                           
                                                                masterBucket[0]=totaldefect;  
                                                                masterBucket[1]=terms;              
                                                                //console.log(masterBucket);                                                    
                                                                callBackFunction(masterBucket,field);
            });
                                
                                
                
                
},

getResultsBasedOnID:function(requestId,callBackFunction) {
                
                var Id=requestId.Id ;      
                
                if(!Id) {
        callBackFunction(null); 
        return;
      }
                  
                  var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
            client.search({
              index: requestId.collectionName,              
              body: {
                                                                "query" : {
                                                                "term" : { "_id" : Id }
    
    
                                                                                }
                                                                }
                                                }).then(function (resp) {
                                                                                                                                
                                                                //var tempAry = ;
                                                                masterBucket[0]=resp.hits.hits;                                                                
                                                                callBackFunction(masterBucket);
            });
                
},

//Feature Mapping Starts
getFeatureMappingResults:function(projectName, filter, isPopup, callBackFunction) {

      if(!projectName) {
        callBackFunction(null); 
        return;
      }
    
      //need to write other error checks
      var masterBucket = new Array();
    
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

    client.search({
              index: iseConstants.featureMapping,
              type:projectName,
              body: {       "query": {
		"filtered": {
		   "query": {
				"match_all": {}
		   },"filter" : {
                "query" : {
                    "query_string" : {
                        "query" : filter +" NOT primary_feature:\"\"",
                        "default_operator":"OR"
                    }
                }
        },
		}
	},   
  "aggregations": {
     "collectionbucket":{
      "terms":{ "field": "_index","size":0 },
       "aggregations": {
        "prifeaturebucket":{
          "terms":{ "field": "primary_feature_parent","size":0 },
          "aggregations": {
            "featurebucket": {
              "terms": { "field": "primary_feature","size":0 }
            }
          }
        }
       }
      }
  },    "size":0

      }
            }).then(function (resp) {
         console.log( "------------Feature Mapping 907--------"+JSON.stringify(resp));
        /*console.log("----------"+resp.aggregations.collectionbucket.buckets[0].key);//defect_collection
        console.log("----------"+resp.aggregations.collectionbucket.buckets[0].prifeaturebucket.buckets[0].key);//parent feature --N.A
        console.log("----------"+resp.aggregations.collectionbucket.buckets[0].prifeaturebucket.buckets[0].featurebucket.buckets[0].key); */
        var pFeatureBuckets = resp.aggregations.collectionbucket.buckets;
     console.log("before popup---"+isPopup+"pFeatureBuckets--len---"+pFeatureBuckets.length);


      if(!isPopup){
        masterBucket = ISE.getFeatureMappingData(pFeatureBuckets);
        //console.log("masterBucket--915--"+JSON.stringify(masterBucket));
        ISE.getUnmappedFeatureMappingData("*",masterBucket,callBackFunction);
      }
      else {
        masterBucket = ISE.getFeatureMappingData(pFeatureBuckets);
        if(masterBucket[0].subfeatures.length >0){
          //sub features available
          masterBucket = ISE.getFeatureMappingData(pFeatureBuckets);
          //console.log("-----------------927 master--"+JSON.stringify(masterBucket));
          masterBucket = ISE.getSubFeatureMappingData(masterBucket);
          //console.log("master sub bucket---927--"+JSON.stringify(masterBucket));

        }else{
            //no sub features

          
        }

        callBackFunction(masterBucket);
      }

        //ISE.addFestureTestCases(projectName,filter,isPopup,masterBucket,callBackFunction);
        
       //callBackFunction(masterBucket);
            },function (error) {console.log(error);callBackFunction([])} );
  },

  getSubFeatureMappingData:function(masterBucketSub) {
    //get feature mapping sub features data
console.log("----------947--"+masterBucketSub[0].name);
console.log("----------947--"+masterBucketSub[0].defects);
console.log("----------947--"+masterBucketSub[0].testcases);
console.log("----------947--"+masterBucketSub[0].source);
    var masterBucket = []
   
    
    
    for(var p = 0;p< masterBucketSub[0].subfeatures.length;p++){
       var eachFeature = {};
    eachFeature.name = masterBucketSub[0].subfeatures[p].name;
    eachFeature.defects = masterBucketSub[0].subfeatures[p].defects;
    eachFeature.testcases = masterBucketSub[0].subfeatures[p].testcase;
    eachFeature.source = masterBucketSub[0].subfeatures[p].source;
    masterBucket.push(eachFeature);
    }

   /*  var eachFeature = {};
    eachFeature.name = masterBucketSub[0].name;
    eachFeature.defects = masterBucketSub[0].defects;
    eachFeature.testcases = masterBucketSub[0].testcases;
    eachFeature.source = masterBucketSub[0].source;
     masterBucket.push(eachFeature);

     console.log("-----971----"+JSON.stringify(masterBucket)); */
     
     return masterBucket;

  },
  
  getFeatureMappingData:function(collectionBuckets) {
  masterBucket = [];
  //defects
  for(var coll = 0;coll< collectionBuckets.length;coll++){
    if(collectionBuckets[coll].key == "defect_collection") {
      var pFeatureBuckets = collectionBuckets[coll].prifeaturebucket.buckets; 
      for(var p = 0;p< pFeatureBuckets.length;p++){
        if(pFeatureBuckets[p].key == "N.A") {
          var featureBuckets = pFeatureBuckets[p].featurebucket.buckets;
          for(var i = 0;i< featureBuckets.length;i++){
            var eachFeature = {};
            eachFeature.name = featureBuckets[i].key;
            eachFeature.defects = featureBuckets[i].doc_count; //primary feature defects count only
            eachFeature.totaldefects = featureBuckets[i].doc_count; //all primary + sub feature counts defects
            eachFeature.testcases = 0;
            eachFeature.totaltestcases = 0;
            eachFeature.source = 0;
            eachFeature.totalsource = 0;
            eachFeature.subfeatures = []; 
            masterBucket.push(eachFeature);
          }
        break;
        }
      }
                                                
      for(var p = 0;p< pFeatureBuckets.length;p++){
        if(pFeatureBuckets[p].key != "N.A") {
          var eachFeature = _.findWhere(masterBucket, {name: pFeatureBuckets[p].key});
          var featureBuckets = pFeatureBuckets[p].featurebucket.buckets;
          if(eachFeature) {
            eachFeature.totaldefects = eachFeature.totaldefects+pFeatureBuckets[p].doc_count;
            for(var i = 0;i< featureBuckets.length;i++){
              var eachSubFeature = {};
              eachSubFeature.name = featureBuckets[i].key;
              eachSubFeature.defects = featureBuckets[i].doc_count;
              eachSubFeature.testcase = 0;
              eachSubFeature.source = 0;
              eachFeature.subfeatures.push(eachSubFeature); 
            }
          }
          else {
            var eachFeature = {};
            eachFeature.name = pFeatureBuckets[p].key;
            eachFeature.defects = 0;
            eachFeature.totaldefects = pFeatureBuckets[p].doc_count;
            eachFeature.testcases = 0;
            eachFeature.totaltestcases = 0;
            eachFeature.source = 0;
            eachFeature.totalsource = 0;
            eachFeature.subfeatures = []; 
            for(var i = 0;i< featureBuckets.length;i++){
              var eachSubFeature = {};
              eachSubFeature.name = featureBuckets[i].key;
              eachSubFeature.defects = featureBuckets[i].doc_count;
              eachSubFeature.testcase = 0;
              eachSubFeature.source = 0;
              eachFeature.subfeatures.push(eachSubFeature); 
            }
            masterBucket.push(eachFeature);
          }
        }
      }
    }
  }
                //console.log("----990----"+JSON.stringify(masterBucket));
                //testcases
  for(var coll = 0;coll< collectionBuckets.length;coll++){
    if(collectionBuckets[coll].key == "testcase_collection") {
      var pFeatureBuckets = collectionBuckets[coll].prifeaturebucket.buckets; 
      for(var p = 0;p< pFeatureBuckets.length;p++){
        if(pFeatureBuckets[p].key == "N.A" || pFeatureBuckets[p].key == "n.a") {
          var featureBuckets = pFeatureBuckets[p].featurebucket.buckets;
          for(var i = 0;i< featureBuckets.length;i++){
            var eachFeature = _.findWhere(masterBucket, {name: featureBuckets[i].key});
            if(eachFeature){
              eachFeature.testcases = featureBuckets[i].doc_count; 
              eachFeature.totaltestcases = featureBuckets[i].doc_count; 
            }
            else {
              var eachFeature = {};
              eachFeature.name = featureBuckets[i].key;
              eachFeature.defects = 0;
              eachFeature.totaldefects = 0;
              eachFeature.testcases = featureBuckets[i].doc_count;
              eachFeature.totaltestcases = featureBuckets[i].doc_count; 
              eachFeature.source = 0;
              eachFeature.totalsource = 0;
              eachFeature.subfeatures = []; 
              masterBucket.push(eachFeature);
            }
          }
        break;
        }
      }
                                                
      for(var p = 0;p< pFeatureBuckets.length;p++){
        if(pFeatureBuckets[p].key != "N.A" || pFeatureBuckets[p].key == "n.a") {
          var eachFeature = _.findWhere(masterBucket, {name: pFeatureBuckets[p].key});
          var featureBuckets = pFeatureBuckets[p].featurebucket.buckets;
          if(eachFeature) {
            eachFeature.totaltestcases = eachFeature.totaltestcases+pFeatureBuckets[p].doc_count;
            for(var i = 0;i< featureBuckets.length;i++){
              var eachSubFeature = _.findWhere(eachFeature.subfeatures, {name: featureBuckets[i].key});
              if(eachSubFeature) {
                eachSubFeature.testcase = featureBuckets[i].doc_count;
              }
              else {
                var eachSubFeature = {};
                eachSubFeature.name = featureBuckets[i].key;
                eachSubFeature.defects = 0;
                eachSubFeature.testcase = featureBuckets[i].doc_count;
                eachSubFeature.source = 0;
                eachFeature.subfeatures.push(eachSubFeature); 
              }
            }
          }
          else {
            var eachFeature = {};
            eachFeature.name = pFeatureBuckets[p].key;
            eachFeature.defects = 0;
            eachFeature.totaldefects = 0;
            eachFeature.testcases = 0;
            eachFeature.totaltestcases = pFeatureBuckets[p].doc_count;
            eachFeature.source = 0;
            eachFeature.totalsource = 0;
            eachFeature.subfeatures = []; 
            for(var i = 0;i< featureBuckets.length;i++){
              var eachSubFeature = {};
              eachSubFeature.name = featureBuckets[i].key;
              eachSubFeature.defects = 0;
              eachSubFeature.testcase = featureBuckets[i].doc_count;
              eachSubFeature.source = 0;
              eachFeature.subfeatures.push(eachSubFeature); 
            }
            masterBucket.push(eachFeature);
          }
        }
      }
    }
  }
                
                //source
  for(var coll = 0;coll< collectionBuckets.length;coll++){
  //console.log("-------1122--------"+collectionBuckets[coll].key);
    if(collectionBuckets[coll].key == "sourcecode_collection") {
	//console.log("-------1124---------------");
      var pFeatureBuckets = collectionBuckets[coll].prifeaturebucket.buckets; 
      for(var p = 0;p< pFeatureBuckets.length;p++){
        if(pFeatureBuckets[p].key == "N.A" || pFeatureBuckets[p].key == "n.a") {
		//console.log("----------1128----------");
          var featureBuckets = pFeatureBuckets[p].featurebucket.buckets;
          for(var i = 0;i< featureBuckets.length;i++){
            var eachFeature = _.findWhere(masterBucket, {name: featureBuckets[i].key});
            if(eachFeature){
              eachFeature.source = featureBuckets[i].doc_count; 
              eachFeature.totalsource = featureBuckets[i].doc_count; 
            }
            else {
              var eachFeature = {};
              eachFeature.name = featureBuckets[i].key;
              eachFeature.defects = 0;
              eachFeature.totaldefects = 0;
              eachFeature.testcases = 0;
              eachFeature.totaltestcases = 0;
              eachFeature.source = featureBuckets[i].doc_count;
              eachFeature.totalsource = featureBuckets[i].doc_count;
              eachFeature.subfeatures = []; 
              masterBucket.push(eachFeature);
            }
          }
        break;
        }
      }
        
      for(var p = 0;p< pFeatureBuckets.length;p++){
        if(pFeatureBuckets[p].key != "N.A") {
          var eachFeature = _.findWhere(masterBucket, {name: pFeatureBuckets[p].key});
          var featureBuckets = pFeatureBuckets[p].featurebucket.buckets;
          if(eachFeature) {
            eachFeature.totalsource = eachFeature.totalsource+pFeatureBuckets[p].doc_count;
            for(var i = 0;i< featureBuckets.length;i++){
              var eachSubFeature = _.findWhere(eachFeature.subfeatures, {name: featureBuckets[i].key});
              if(eachSubFeature) {
                eachSubFeature.source = featureBuckets[i].doc_count;
              }
              else {
                var eachSubFeature = {};
                eachSubFeature.name = featureBuckets[i].key;
                eachSubFeature.defects = 0;
                eachSubFeature.testcase = 0;
                eachSubFeature.source = featureBuckets[i].doc_count;
                eachFeature.subfeatures.push(eachSubFeature); 
              }
            }
          }
          else {
            var eachFeature = {};
            eachFeature.name = pFeatureBuckets[p].key;
            eachFeature.defects = 0;
            eachFeature.totaldefects = 0;
            eachFeature.testcases = 0;
            eachFeature.totaltestcases = 0;
            eachFeature.source = pFeatureBuckets[p].doc_count;
            eachFeature.totalsource = 0;
            eachFeature.subfeatures = []; 
            for(var i = 0;i< featureBuckets.length;i++){
              var eachSubFeature = {};
              eachSubFeature.name = featureBuckets[i].key;
              eachSubFeature.defects = 0;
              eachSubFeature.testcase = 0;
              eachSubFeature.source = featureBuckets[i].doc_count;
              eachFeature.subfeatures.push(eachSubFeature); 
            }
            masterBucket.push(eachFeature);
          }
        }
      }
    }
  }
  //console.log("-----1142-----"+JSON.stringify(masterBucket));
  
  return masterBucket;
  
  },
  
  //Feature Mapping Ends

getOrphanResults:function(projectName, filter, isPopup, callBackFunction) {

      if(!projectName) {
        callBackFunction(null); 
        return;
      }
    
      //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

		client.search({
						  index: "defect_collection",
						  type:projectName,
						  body: {      "query": {
						"filtered": {
							"query": {
								"match_all": {}
							},"filter" : {
                "query" : {
                    "query_string" : {
                        "query" : filter,
                        "default_operator":"OR"
                    }
                }
        }
						}
					},     
			"aggregations": {
                "prifeaturebucket":{
                    "terms":{ "field": "primary_feature_parent","size":0 },
                    "aggregations": {
				"featurebucket": {
				  "terms": { "field": "primary_feature","size":0 },
					"aggregations": {
					"intextbucket": {
					   "terms": { "field": "internaldefect","size":0  },
					   "aggregations": {
					"tcbucket": {
					   //"terms": { "field": "test_case_id","size":0  }
					   "filter": { "exists": { "field": "testcases" } }
					}
				  }
					}
				  }
				}
                    }
                }
			  
			},    "size":0

			}
            }).then(function (resp) {
             // console.log( resp);
			var pFeatureBuckets = resp.aggregations.prifeaturebucket.buckets;
			
			if(!isPopup)
				masterBucket = ISE.getDefectFeatureBuckets(pFeatureBuckets);
			else if (pFeatureBuckets.length > 1)
				masterBucket = ISE.getDefectSubFeatureBuckets(pFeatureBuckets);
					
			ISE.addFestureTestCases(projectName,filter,isPopup,masterBucket,callBackFunction);
            },function (error) {console.log(error);callBackFunction([])} );
  },
  
  getDefectFeatureBuckets:function(pFeatureBuckets) {
		masterBucket = []
		for(var p = 0;p< pFeatureBuckets.length;p++){
		if(pFeatureBuckets[p].key == "N.A") {
			var featureBuckets = pFeatureBuckets[p].featurebucket.buckets;
			for(var i = 0;i< featureBuckets.length;i++){
				var eachFeature = {};
				eachFeature.name = featureBuckets[i].key;
				eachFeature.tcCount = 0; 
				eachFeature.intDefCount = 0;
				eachFeature.intOrphDefCount = 0; 
				eachFeature.extDefCount = 0;
				eachFeature.extOrphDefCount = 0; 
				var tcDefCount=0;
				var defCount=0;
				if(featureBuckets[i].intextbucket.buckets) {
					for(var j=0;j<featureBuckets[i].intextbucket.buckets.length;j++) {
						defCount=featureBuckets[i].intextbucket.buckets[j].doc_count
						if(featureBuckets[i].intextbucket.buckets[j].tcbucket) 
							tcDefCount = featureBuckets[i].intextbucket.buckets[j].tcbucket.doc_count;
						if(featureBuckets[i].intextbucket.buckets[j].key == "1") {
							eachFeature.intDefCount = tcDefCount;
							eachFeature.intOrphDefCount = defCount-tcDefCount;
							if (eachFeature.intOrphDefCount < 0)
									eachFeature.intOrphDefCount = 0;
						}
						else {
							eachFeature.extDefCount = tcDefCount;
							eachFeature.extOrphDefCount = defCount-tcDefCount;
							if (eachFeature.extOrphDefCount < 0)
									eachFeature.extOrphDefCount = 0;
						}
					}
				}
				masterBucket.push(eachFeature);
			}
			break;
		}
	}
	  
	for(var p = 0;p< pFeatureBuckets.length;p++){
		if(pFeatureBuckets[p].key != "N.A") {
			var eachFeature = _.findWhere(masterBucket, {name: pFeatureBuckets[p].key});
			var featureBuckets = pFeatureBuckets[p].featurebucket.buckets;
			if(eachFeature) {
				for(var i = 0;i< featureBuckets.length;i++){
					var tcDefCount=0;
					var defCount=0;
					if(featureBuckets[i].intextbucket.buckets) {
						for(var j=0;j<featureBuckets[i].intextbucket.buckets.length;j++) {
							defCount=featureBuckets[i].intextbucket.buckets[j].doc_count
							if(featureBuckets[i].intextbucket.buckets[j].tcbucket) 
								tcDefCount = featureBuckets[i].intextbucket.buckets[j].tcbucket.doc_count;
							if(featureBuckets[i].intextbucket.buckets[j].key == "1") {
								eachFeature.intDefCount = eachFeature.intDefCount+tcDefCount;
								eachFeature.intOrphDefCount = eachFeature.intOrphDefCount+(defCount-tcDefCount);
								if (eachFeature.intOrphDefCount < 0)
									eachFeature.intOrphDefCount = 0;
							}
							else {
								eachFeature.extDefCount = eachFeature.extDefCount+tcDefCount;
								eachFeature.extOrphDefCount = eachFeature.extOrphDefCount+(defCount-tcDefCount);
								if (eachFeature.extOrphDefCount < 0)
									eachFeature.extOrphDefCount = 0;
							}
						}
					}
				}
			}
			else {
				var eachFeature = {};
				eachFeature.name = pFeatureBuckets[p].key;
				eachFeature.tcCount = 0; 
				eachFeature.intDefCount = 0;
				eachFeature.intOrphDefCount = 0; 
				eachFeature.extDefCount = 0;
				eachFeature.extOrphDefCount = 0; 
				var tcDefCount=0;
				var defCount=0;
				for(var i = 0;i< featureBuckets.length;i++){
					if(featureBuckets[i].intextbucket.buckets) {
						for(var j=0;j<featureBuckets[i].intextbucket.buckets.length;j++) {
							defCount=featureBuckets[i].intextbucket.buckets[j].doc_count
							if(featureBuckets[i].intextbucket.buckets[j].tcbucket) 
								tcDefCount = featureBuckets[i].intextbucket.buckets[j].tcbucket.doc_count;
							if(featureBuckets[i].intextbucket.buckets[j].key == "1") {
								eachFeature.intDefCount = eachFeature.intDefCount+tcDefCount;
								eachFeature.intOrphDefCount = eachFeature.intOrphDefCount+(defCount-tcDefCount);
								if (eachFeature.intOrphDefCount < 0)
									eachFeature.intOrphDefCount = 0;
							}
							else {
								eachFeature.extDefCount = eachFeature.extDefCount+tcDefCount;
								eachFeature.extOrphDefCount = eachFeature.extOrphDefCount+(defCount-tcDefCount);
								if (eachFeature.extOrphDefCount < 0)
									eachFeature.extOrphDefCount = 0;
							}
						}
					}
				}
				masterBucket.push(eachFeature);
			}
		}
	}
	return masterBucket;
  },
  
  getDefectSubFeatureBuckets:function(pFeatureBuckets) {
	masterBucket = []
	for(var p = 0;p< pFeatureBuckets.length;p++){
		var featureBuckets = pFeatureBuckets[p].featurebucket.buckets;
		for(var i = 0;i< featureBuckets.length;i++){
			var eachFeature = {};
			eachFeature.name = featureBuckets[i].key;
			eachFeature.tcCount = 0; 
			eachFeature.intDefCount = 0;
			eachFeature.intOrphDefCount = 0; 
			eachFeature.extDefCount = 0;
			eachFeature.extOrphDefCount = 0; 
			var tcDefCount=0;
			var defCount=0;
			if(featureBuckets[i].intextbucket.buckets) {
				for(var j=0;j<featureBuckets[i].intextbucket.buckets.length;j++) {
					defCount=featureBuckets[i].intextbucket.buckets[j].doc_count
					if(featureBuckets[i].intextbucket.buckets[j].tcbucket) 
						tcDefCount = featureBuckets[i].intextbucket.buckets[j].tcbucket.doc_count;
					if(featureBuckets[i].intextbucket.buckets[j].key == "1") {
						eachFeature.intDefCount = tcDefCount;
						eachFeature.intOrphDefCount = defCount-tcDefCount;
						if (eachFeature.intOrphDefCount < 0)
									eachFeature.intOrphDefCount = 0;
					}
					else {
						eachFeature.extDefCount = tcDefCount;
						eachFeature.extOrphDefCount = defCount-tcDefCount;
						if (eachFeature.extOrphDefCount < 0)
							eachFeature.extOrphDefCount = 0;
					}
				}
			}
			masterBucket.push(eachFeature);
		}
	}
	return masterBucket;
  },
  
  addFestureTestCases:function(projectName,filter,isPopup,masterBucket,callBackFunction) {

      if(!projectName) {
        callBackFunction(null); 
        return;
      }
    
      //need to write other error checks
      //var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

		client.search({
				index: "testcase_collection",
				type:projectName,
				body: { 
    				"query": {
						"filtered": {
							"query": {
								"match_all": {}
							},"filter" : {
                "query" : {
                    "query_string" : {
                        "query" : filter,
                        "default_operator":"OR"
                    }
                }
        }
						}
					},     
					"aggregations": {
                        "prifeaturebucket":{
                            "terms":{ "field": "primary_feature_parent","size":0 },
                            "aggregations": {
						        "featurebucket": {
							    "terms": { "field": "primary_feature","size":0 }
							    }
                            }
                        }
					},    "size":0

				}
            }).then(function (resp) {
              //console.log( resp);
				var pFeatureBuckets = resp.aggregations.prifeaturebucket.buckets;
				if(!isPopup) {
					masterBucket = ISE.getTestcaseFeatureBuckets(pFeatureBuckets,masterBucket);
					ISE.getNoFeatureDefectResults(projectName,filter,isPopup,masterBucket,callBackFunction);
					//callBackFunction(masterBucket);
				}
				else if (pFeatureBuckets.length > 1) {
					masterBucket = ISE.getTestcaseSubFeatureBuckets(pFeatureBuckets,masterBucket);
					callBackFunction(masterBucket);
				}
				else
					callBackFunction(masterBucket);
            },function (error) {console.log(error);callBackFunction([])} );
  },
  
  getTestcaseFeatureBuckets:function(pFeatureBuckets,masterBucket) {
	for(var p = 0;p< pFeatureBuckets.length;p++){
		if(pFeatureBuckets[p].key == "N.A") {
			var featureBuckets = pFeatureBuckets[p].featurebucket.buckets;
			for(var i = 0;i< featureBuckets.length;i++){
				var eachFeature = _.findWhere(masterBucket, {name: featureBuckets[i].key});
				if(eachFeature) {
					eachFeature.tcCount = featureBuckets[i].doc_count;
				}
				else {
					var eachFeature = {};
					eachFeature.name = featureBuckets[i].key;
					eachFeature.tcCount = featureBuckets[i].doc_count;
					eachFeature.intDefCount = 0;
					eachFeature.intOrphDefCount = 0; 
					eachFeature.extDefCount = 0;
					eachFeature.extOrphDefCount = 0; 
					masterBucket.push(eachFeature);
				}
			}
			break;
		}
	}
	
	for(var p = 0;p< pFeatureBuckets.length;p++){
		if(pFeatureBuckets[p].key != "N.A") {
			var eachFeature = _.findWhere(masterBucket, {name: pFeatureBuckets[p].key});
			var featureBuckets = pFeatureBuckets[p].featurebucket.buckets;
			if(eachFeature) {
				for(var i = 0;i< featureBuckets.length;i++){
					eachFeature.tcCount = eachFeature.tcCount+featureBuckets[i].doc_count;
				}
			}
			else {
				var eachFeature = {};
				eachFeature.name = pFeatureBuckets[p].key;
				eachFeature.tcCount = 0; 
				eachFeature.intDefCount = 0;
				eachFeature.intOrphDefCount = 0; 
				eachFeature.extDefCount = 0;
				eachFeature.extOrphDefCount = 0; 
				for(var i = 0;i< featureBuckets.length;i++){
					eachFeature.tcCount = eachFeature.tcCount+featureBuckets[i].doc_count;
				}
				masterBucket.push(eachFeature);
			}
		}
	}
	return masterBucket;
  },
  
  getTestcaseSubFeatureBuckets:function(pFeatureBuckets,masterBucket) {
	for(var p = 0;p< pFeatureBuckets.length;p++){
		var featureBuckets = pFeatureBuckets[p].featurebucket.buckets;
		for(var i = 0;i< featureBuckets.length;i++){
			var eachFeature = _.findWhere(masterBucket, {name: featureBuckets[i].key});
			if(eachFeature) {
				eachFeature.tcCount = featureBuckets[i].doc_count;
			}
			else {
				var eachFeature = {};
				eachFeature.name = featureBuckets[i].key;
				eachFeature.tcCount = featureBuckets[i].doc_count;
				eachFeature.intDefCount = 0;
				eachFeature.intOrphDefCount = 0; 
				eachFeature.extDefCount = 0;
				eachFeature.extOrphDefCount = 0; 
				masterBucket.push(eachFeature);
			}
		}
	}
	return masterBucket;
  },
  
  getNoFeatureDefectResults:function(projectName,filter,isPopup,masterBucket,callBackFunction) {

      if(!projectName) {
        callBackFunction(null); 
        return;
      }
    
      //need to write other error checks
      
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

		client.search({
						  index: "defect_collection",
						  type:projectName,
						  body: {      "query": {
    					"filtered": {
							"query": {
								"match_all": {}
							},"filter" :  {
            "query" : {
                    "query_string" : {
                        "query" : "_missing_:primary_feature OR primary_feature:\"\""
                        
                    }
                } 
        }

						}
					},     
			"aggregations": {
                "intextbucket":{
                    "terms":{ "field": "internaldefect","size":0 },
                    "aggregations": {
				"tcbucket": {
				  //"terms": { "field": "test_case_id","size":0 }
				  "filter": { "exists": { "field": "testcases" } }
				}
                    }
                }
			  
			},    "size":0

			}
            }).then(function (resp) {
              //console.log( resp);
			var othersBucket = resp.aggregations.intextbucket.buckets;
			
			var eachFeature = {};
			eachFeature.name = "Others";
			eachFeature.tcCount = 0; 
			eachFeature.intDefCount = 0;
			eachFeature.intOrphDefCount = 0; 
			eachFeature.extDefCount = 0;
			eachFeature.extOrphDefCount = 0; 
			var tcDefCount=0;
			var defCount=0;
			if(othersBucket.length>0) {
				for(var j=0;j<othersBucket.length;j++) {
					defCount=othersBucket[j].doc_count
					if(othersBucket[j].tcbucket) 
						tcDefCount = othersBucket[j].tcbucket.doc_count;
					if(othersBucket[j].key == "1") {
						eachFeature.intDefCount = tcDefCount;
						eachFeature.intOrphDefCount = defCount-tcDefCount;
						if (eachFeature.intOrphDefCount < 0)
									eachFeature.intOrphDefCount = 0;
					}
					else {
						eachFeature.extDefCount = tcDefCount;
						eachFeature.extOrphDefCount = defCount-tcDefCount;
						if (eachFeature.extOrphDefCount < 0)
									eachFeature.extOrphDefCount = 0;
					}
				}
				masterBucket.push(eachFeature);
			}
			ISE.getNoFeatureTCResults(projectName,filter,isPopup,masterBucket,callBackFunction);
			//callBackFunction(masterBucket);	
            },function (error) {console.log(error);callBackFunction([])} );
  },
  
  getNoFeatureTCResults:function(projectName,filter,isPopup,masterBucket,callBackFunction) {

      if(!projectName) {
        callBackFunction(null); 
        return;
      }
    
      //need to write other error checks
      
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

		client.search({
						  index: "testcase_collection",
						  type:projectName,
						  body: {      "query": {
    					"filtered": {
							"query": {
								"match_all": {}
							},"filter" :  {
             "query" : {
                    "query_string" : {
                        "query" : "_missing_:primary_feature OR primary_feature:\"\""
                        
                    }
                } 
        }

						}
					},     
    		"aggregations": {
                "tcbucket":{
                    "terms":{ "field": "_id","size":0 }
                }
			  
			},    "size":0

			}
            }).then(function (resp) {
              //console.log( resp);
			var othersTCCount = resp.hits.total;
			if(othersTCCount>0) {
				var eachFeature = _.findWhere(masterBucket, {name: "Others"});
				if(eachFeature)
					eachFeature.tcCount = othersTCCount;
				else {
					var eachFeature = {};
					eachFeature.name = "Others";
					eachFeature.tcCount = othersTCCount; 
					eachFeature.intDefCount = 0;
					eachFeature.intOrphDefCount = 0; 
					eachFeature.extDefCount = 0;
					eachFeature.extOrphDefCount = 0; 
					masterBucket.push(eachFeature);
				}
			}
			
			callBackFunction(masterBucket);	
            },function (error) {console.log(error);callBackFunction([])} );
  },
  getFileDiffSearchResults:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
      //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

         
            client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
              size: requestObject.maxResults, //15
              body: {
                
               
					"query" : {
						"filtered" : { 
							"filter" : {
								"query" : {
									"query_string" : {
											//"query" : "link:\"ih_evc_54290_4\" AND fileslist:\"/vobs/evc_V1/ap/cp/ohm/src/DSCommonTPViewCallback.cpp\""
											"query" : requestObject.searchString
											}
									}
								}
							}
						}
					}
            }).then(function (resp) {
			  console.log( resp);
              var temp = resp.hits;
              var tempAry = temp.hits;
               for(var i = 0;i< tempAry.length;i++){

                if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
					masterBucket[i] = tempAry[i]._source;
					masterBucket[i]._index = tempAry[i]._index;
					masterBucket[i].defTitle = requestObject.defTitle;
					masterBucket[i].searchFile = requestObject.searchFile;
					masterBucket[i].searchDefId = requestObject.searchDefId;
					masterBucket[i].searchFileFlag = requestObject.searchFileFlag;
					masterBucket[i].projName = requestObject.projectName;
                }else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
					masterBucket[i] = tempAry[i].source;
					masterBucket[i].defTitle = requestObject.defTitle;
					masterBucket[i].searchFile = requestObject.searchFile;
					masterBucket[i].searchDefId = requestObject.searchDefId;
					masterBucket[i].searchFileFlag = requestObject.searchFileFlag;
					masterBucket[i].projName = requestObject.projectName;
                }
              }              
                        
             console.log(masterBucket);
              callBackFunction(masterBucket);
			  
            },function (error) {console.log(error);callBackFunction([])} );
  },

  getProjectsSearchResults:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
      //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

         
            client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
              size: requestObject.maxResults, //15
              body: {
                
          
          "query" : {
            "filtered" : { 
              "filter" : {
                "query" : {
                  "query_string" : {
                      //"query" : "link:\"ih_evc_54290_4\" AND fileslist:\"/vobs/evc_V1/ap/cp/ohm/src/DSCommonTPViewCallback.cpp\""
                      "query" : requestObject.searchString
                      }
                  }
                }
              }
            }
          }
            }).then(function (resp) {
        console.log( resp);
              var temp = resp.hits;
              var tempAry = temp.hits;
               for(var i = 0;i< tempAry.length;i++){

                if(tempAry[i] !='undefined' && tempAry[i] != null && tempAry[i] != 'null'){
          //masterBucket[i] = tempAry[i].fields.release;

            if(tempAry[i]._source.hasOwnProperty('projectname')) {
                 masterBucket[i] = tempAry[i]._source.projectname;
               }
                else
                {
                  masterBucket[i]="NoProject";
                }
              }
          /*masterBucket[i] = tempAry[i]._source;
          masterBucket[i]._index = tempAry[i]._index;
          masterBucket[i].defTitle = requestObject.defTitle;
          masterBucket[i].searchFile = requestObject.searchFile;
          masterBucket[i].searchDefId = requestObject.searchDefId;
          masterBucket[i].searchFileFlag = requestObject.searchFileFlag;
          masterBucket[i].projName = requestObject.projectName;*/
                }/*else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
          masterBucket[i] = tempAry[i].source;
          masterBucket[i].defTitle = requestObject.defTitle;
          masterBucket[i].searchFile = requestObject.searchFile;
          masterBucket[i].searchDefId = requestObject.searchDefId;
          masterBucket[i].searchFileFlag = requestObject.searchFileFlag;
          masterBucket[i].projName = requestObject.projectName;
                }*/
                           
                       
             console.log(masterBucket);
              callBackFunction(masterBucket);
        
            },function (error) {console.log(error);callBackFunction([])} );
  },
  
  getFileSearchDiffResults:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
    
    //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

         
            client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
              size: requestObject.maxResults, //15
              body: {
					"_source":"fileslist",
					"query" : {
						"filtered" : { 
							"filter" : {
								"query" : {
									"wildcard" : {
											//"fileslist" : "*ECSIsvrDefs.h*"
											"fileslist" : requestObject.searchString
											}
									}
								}
							}
						}
					}
            }).then(function (resp) {
			console.log( resp);
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){

                if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
					masterBucket[i] = tempAry[i]._source;
					masterBucket[i]._index = tempAry[i]._index;
					masterBucket[i].defTitle = requestObject.defTitle;
					masterBucket[i].searchFile = requestObject.searchFile;
					masterBucket[i].searchDefId = requestObject.searchDefId;
					masterBucket[i].searchFileFlag = requestObject.searchFileFlag;
                }else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
					masterBucket[i] = tempAry[i].source;
					masterBucket[i].defTitle = requestObject.defTitle;
					masterBucket[i].searchFile = requestObject.searchFile;
					masterBucket[i].searchDefId = requestObject.searchDefId;
					masterBucket[i].searchFileFlag = requestObject.searchFileFlag;
                }
              }              
                        
              console.log(masterBucket);
              callBackFunction(masterBucket);
			  
            },function (error) {console.log(error);callBackFunction([])} );
  },
  getFeatures:function(projectName, callBackFunction) {

      if(!projectName) {
        callBackFunction(null); 
        return;
      }
    
      //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

		client.search({
						  index: "defect_collection",
						  type:projectName,
						  body: {      "query": {
    					"filtered": {
							"query": {
								"match_all": {}
							},"filter" : {
                "query" : {
                    "query_string" : {
                        "query" : "*",
                        "default_operator":"OR"
                    }
                }
        }
						}
					},     
			"aggregations": {
                "prifeaturebucket":{
                    "terms":{ "field": "primary_feature_parent","size":0 },
                    "aggregations": {
				"featurebucket": {
				  "terms": { "field": "primary_feature","size":0 },
					"aggregations": {
					"intextbucket": {
					   "terms": { "field": "_id","size":0  }
					}
				  }
				}
                    }
                }
			  
			},    "size":0

			}
            }).then(function (resp) {
              //console.log( resp);
			var pFeatureBuckets = resp.aggregations.prifeaturebucket.buckets;
			
			masterBucket = ISE.getFeatureBuckets(pFeatureBuckets);
			callBackFunction(masterBucket);
            },function (error) {console.log(error);callBackFunction([])} );
  },
  
  getFeatureBuckets:function(pFeatureBuckets) {
		masterBucket = []
		for(var p = 0;p< pFeatureBuckets.length;p++){
		if(pFeatureBuckets[p].key == "N.A") {
			var featureBuckets = pFeatureBuckets[p].featurebucket.buckets;
			for(var i = 0;i< featureBuckets.length;i++){
				var eachFeature = {};
				eachFeature.text = featureBuckets[i].key;
				eachFeature.children = []; 
				masterBucket.push(eachFeature);
			}
			break;
		}
	}
	  
	for(var p = 0;p< pFeatureBuckets.length;p++){
		if(pFeatureBuckets[p].key != "N.A") {
			var eachFeature = _.findWhere(masterBucket, {name: pFeatureBuckets[p].key});
			var featureBuckets = pFeatureBuckets[p].featurebucket.buckets;
			if(eachFeature) {
				for(var i = 0;i< featureBuckets.length;i++){
					eachFeature.children.push(featureBuckets[i].key);
				}
			}
			else {
				var eachFeature = {};
				eachFeature.text = pFeatureBuckets[p].key;
				eachFeature.children = []; 
				for(var i = 0;i< featureBuckets.length;i++){
					eachFeature.children.push(featureBuckets[i].key);
				}
				masterBucket.push(eachFeature);
			}
		}
	}
	return masterBucket;
  },

    getSearchDocsResults:function(requestObject,callBackFunction){

         if(!requestObject) {
        callBackFunction(null); 
        return;
      }
       var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
        var currentDate = new Date().getTime();
     


         
            client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
             // size: requestObject.maxResults, //15
              body: {
              "_source": {
        "exclude": [ "documentcontent" ]
    },

   "query" : {
      "filtered" : { 
                     

                "query" : {
                  
                    "query_string" : {
                        "query" : requestObject.searchString
                        
                    },

                    
                }

                 
                
    }

}
}
             
            }).then(function (resp) {
             

             var temp = resp.hits;
              //console.log("temp"+temp);
              var tempAry = temp.hits;
              
              masterBucket=[];

        
                for(var i = 0;i< tempAry.length;i++){

                 // console.log(resp1[i])

                   masterBucket[i] = tempAry[i]._source;
                  masterBucket[i]._index = tempAry[i]._index;
                   masterBucket[i]._id = tempAry[i]._id;

                }
                            
                              
             // datArr = processDefectsDataObject_ElasticSearch(masterBucket,tempAry);
              callBackFunction(masterBucket);
            },function (error) {console.log(error);callBackFunction([])} );




    },


     /* Usage metrics logging 
        params:
                      eventName: event name
                      projectName: project name
                      use, role: ****can be accessed from here
                      usageData: usage data, which can be varied for event to event
        */
      CreateDocEntry:function(docData,callbackFunction) {
			
			 console.log("Inside CreateDocEntry : ");
			  console.log(docData);
              var inputDate = new Date().toISOString();
              var dataObj = new Object();

        var projectName = ""+localStorage.getItem('projectName');
              dataObj.projectName=projectName;     
              dataObj.published_at = inputDate;
              dataObj.user=localStorage.getItem('username');
              dataObj.role=localStorage.getItem('rolename');
        dataObj.urlPath=window.location.pathname  + window.location.hash;
              jQuery.extend(docData, dataObj);
              var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
              client.index({
                index:iseConstants.str_docs_collection,
                type: projectName, 
				id:docData.documentId,
                body: docData
                              }, function (error, response) {
								  console.log("response in CreateDocEntry : ");
								  console.log(response);
                  if( error != null ) {
                    console.log("error posting usage details ..");
                    console.log(error);
                  }
            });

                callbackFunction();
      },
      CreateDocEntryMongo:function(docData,callbackFunction) {
              var inputDate = new Date().toISOString();
              var dataObj = new Object();

        var projectName = ""+localStorage.getItem('projectName');
              dataObj.projectName=projectName;     
              dataObj.published_at = inputDate;
              dataObj.user=localStorage.getItem('username');
              dataObj.role=localStorage.getItem('rolename');
			  dataObj.urlPath=window.location.pathname  + window.location.hash;
              jQuery.extend(docData, dataObj); 
			  
			  var jsonString='{"requesttype":"updateObjectModel","collection":"kb_docs","upsert":"true", "multi":"false","columnname":"_id","columnvalue":"'+docData.documentId+'","object":'+JSON.stringify(docData)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}';			  
			  //var jsonString='{"requesttype":"insertJsonObject","collection":"kb_docs", "object":'+JSON.stringify(docData)+',"projectName":"' + localStorage.getItem('projectName') + '"}';
			  ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString,callbackFunction);
					
                callbackFunction();
      },

       //gourik
      PackageAssignationMongo:function(docData,callbackFunction) {

           if(docData.length > 0)
           {
            for(var i=0; i< docData.length; i++)
            {
                 var inputDate = new Date().toISOString();
                 var dataObj = new Object();

			    var projectName = ""+localStorage.getItem('projectName');
                dataObj.projectName=projectName;     
                dataObj.published_at = inputDate;
                dataObj.user=localStorage.getItem('username');
                dataObj.role=localStorage.getItem('rolename');
                dataObj.urlPath=window.location.pathname  + window.location.hash;
                jQuery.extend(docData, dataObj);
			    var jsonString='{"requesttype":"insertJsonObject","collection":"assignation_collection","object":'+JSON.stringify(docData[i])+',"projectName":"' + localStorage.getItem('projectName') + '"}';
                ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString);			
           
            }

           }
            setTimeout(callbackFunction,1000);
      },
	
	  
        UpdateDocEntry:function(docData,callbackFunction) {
              var inputDate = new Date().toISOString();
              var dataObj = new Object();

        var projectName = ""+localStorage.getItem('projectName');
              dataObj.projectName=projectName;     
              dataObj.published_at = inputDate;
              dataObj.user=localStorage.getItem('username');
              dataObj.role=localStorage.getItem('rolename');
        dataObj.urlPath=window.location.pathname  + window.location.hash;
              jQuery.extend(docData, dataObj);
              var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
              client.update({
                index:iseConstants.str_docs_collection,
                type: projectName, 
                id:docData.documentId,
                body:  {
                  doc: {

                       title: docData.title,
                       name:docData.name,
                       description:docData.description,
                       url:docData.url, 
                       fileName:docData.fileName,                   
                       documentcontent:docData.documentcontent,
                       expiryDate:docData.expiryDate
                  }, 
                }
                // "detect_noop": false
                              }, function (error, response) {
                  if( error != null ) {
                    console.log("error posting usage details ..");
                    console.log(error);
                  }
            });

                setTimeout(callbackFunction,1000);
      },
      
	  addAttachment:function(docData,callbackFunction) {
	  
			 console.log(" Inside addAttachment : " + docData.documentId);
            
              var dataObj = new Object();
			  var projectName = ""+localStorage.getItem('projectName');
              jQuery.extend(docData, dataObj);
              var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
           
			client.update({
				  index: iseConstants.str_docs_collection,
				  type:  projectName, 
				  id: docData.documentId,
				  body: {
					script: 'ctx._source.documentcontent += newDoc',
					params: { newDoc: docData.documentcontent }
				  }
				}, function (error, response) {
					if( error != null ) {
                    console.log("Error updating attachment in ISE.addAttachment()");
                    console.log(error);
                  }
		
			});
                callbackFunction();
      },

	   InsertPackageEntryMongo:function(docData,callbackFunction) {
            var inputDate = new Date().toISOString();
            var dataObj = new Object();

			var projectName = ""+localStorage.getItem('projectName');
            dataObj.projectName=projectName;     
            dataObj.published_at = inputDate;
            dataObj.user=localStorage.getItem('username');
            dataObj.role=localStorage.getItem('rolename');
            dataObj.urlPath=window.location.pathname  + window.location.hash;
            jQuery.extend(docData, dataObj);
			var jsonString='{"requesttype":"insertJsonObject","collection":"package_collection","object":'+JSON.stringify(docData)+',"projectName":"' + localStorage.getItem('projectName') + '"}';
            //var jsonString='{"requesttype":"insertJsonObject","collection":"package_collection","upsert":'+ true +',"multi":' + false +',"columnname":"_id","columnvalue":'+docData._id+', "object":'+JSON.stringify(docData)+',"projectName":"' + localStorage.getItem('projectName') + '"}';
			ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString);			
            setTimeout(callbackFunction,1000);
      },
	  
	  UpdatePackageEntryMongo:function(docData,callbackFunction) {
              var inputDate = new Date().toISOString();
              var dataObj = new Object();

        var projectName = ""+localStorage.getItem('projectName');
              dataObj.projectName=projectName;     
              dataObj.published_at = inputDate;
              dataObj.user=localStorage.getItem('username');
              dataObj.role=localStorage.getItem('rolename');
              dataObj.urlPath=window.location.pathname  + window.location.hash;
              jQuery.extend(docData, dataObj);
              var jsonString='{"requesttype":"updateObjectModel","collection":"package_collection","upsert":"true", "multi":"false","columnname":"_id","columnvalue":"'+docData._id+'","object":'+JSON.stringify(docData)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}'; 
			   ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString);
					

                setTimeout(callbackFunction,1000);
            
      },
	  
	  UpdateQuestionMongo:function(docData,callbackFunction) {
              var inputDate = new Date().toISOString();
              var dataObj = new Object();
        var projectName = ""+localStorage.getItem('projectName');
              dataObj.projectName=projectName;     
              dataObj.published_at = inputDate;
              dataObj.user=localStorage.getItem('username');
              dataObj.role=localStorage.getItem('rolename');
              dataObj.urlPath=window.location.pathname  + window.location.hash;
              jQuery.extend(docData, dataObj);
              var jsonString='{"requesttype":"updateObjectModel","collection":"forum_collection","upsert":"true", "multi":"false","columnname":"_id","columnvalue":"'+docData._id+'","object":'+JSON.stringify(docData)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}'; 
			   ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString);
                setTimeout(callbackFunction,1000);
      },
	  
	  UpdateForumMongo:function(docData,callbackFunction) {
              var inputDate = new Date().toISOString();
              var dataObj = new Object();
        var projectName = ""+localStorage.getItem('projectName');
              dataObj.projectName=projectName;     
              dataObj.published_at = inputDate;
              dataObj.user=localStorage.getItem('username');
              dataObj.role=localStorage.getItem('rolename');
              dataObj.urlPath=window.location.pathname  + window.location.hash;
              jQuery.extend(docData, dataObj);
              var jsonString='{"requesttype":"updateObjectModel","collection":"ikeforum_collection","upsert":"true", "multi":"false","columnname":"_id","columnvalue":"'+docData._id+'","object":'+JSON.stringify(docData)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}'; 
			   ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString);
                setTimeout(callbackFunction,1000);
      },
	  UpdateForumViewcountMongo:function(docData,callbackFunction) {
              var inputDate = new Date().toISOString();
              var dataObj = new Object();
        var projectName = ""+localStorage.getItem('projectName');
              dataObj.projectName=projectName;     
              dataObj.user=localStorage.getItem('username');
              dataObj.role=localStorage.getItem('rolename');
              dataObj.urlPath=window.location.pathname  + window.location.hash;
              jQuery.extend(docData, dataObj);
              var jsonString='{"requesttype":"updateObjectModel","collection":"ikeforum_collection","upsert":"true", "multi":"false","columnname":"_id","columnvalue":"'+docData._id+'","object":'+JSON.stringify(docData)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}'; 
			   ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString);
                setTimeout(callbackFunction,1000);
      },

         UpdateKnowledgeHistoryMongo:function(docData,callbackFunction) {
              var inputDate = new Date().toISOString();
              var dataObj = new Object();
        var projectName = ""+localStorage.getItem('projectName');
              dataObj.projectName=projectName;     
              dataObj.published_at = inputDate;
              dataObj.user=localStorage.getItem('username');
              dataObj.role=localStorage.getItem('rolename');
              dataObj.urlPath=window.location.pathname  + window.location.hash;
              jQuery.extend(docData, dataObj);
              var jsonString='{"requesttype":"updateObjectModel","collection":"knowledge_history_collection","upsert":"true", "multi":"false","columnname":"_id","columnvalue":"'+docData._id+'","object":'+JSON.stringify(docData)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}'; 
			   ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString);
                setTimeout(callbackFunction,1000);
      },
	  
      UpdateDocEntryMongo:function(docData,callbackFunction) {
              var inputDate = new Date().toISOString();
              var dataObj = new Object();
        var projectName = ""+localStorage.getItem('projectName');
	if (!docData.projectName || docData.projectName === "undefined" || docData.projectName === "")
              dataObj.projectName=projectName;     
            
              dataObj.published_at = inputDate;
			if (!docData.user || docData.user === "" || docData.user === "undefined")
              dataObj.user=localStorage.getItem('username');
              dataObj.role=localStorage.getItem('rolename');
              dataObj.urlPath=window.location.pathname  + window.location.hash;
              jQuery.extend(docData, dataObj);
            var jsonString = '{"requesttype":"updateObjectModel","collection":"kb_docs","upsert":"true", "multi":"false","columnname":"_id","columnvalue":"'+docData._id+'","object":'+JSON.stringify(docData)+',"projectName":"' + docData.projectName + '","fromCache":"false"}'; 
			   ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString);
                setTimeout(callbackFunction,1000);
      },
	  
	  UpdatePackageAssignationEntryMongo:function(docData,callbackFunction) {
              var inputDate = new Date().toISOString();
              var dataObj = new Object();

              var projectName = ""+localStorage.getItem('projectName');
              dataObj.projectName=projectName;     
              dataObj.published_at = inputDate;
              dataObj.user=localStorage.getItem('username');
              dataObj.role=localStorage.getItem('rolename');
              dataObj.urlPath=window.location.pathname  + window.location.hash;
              jQuery.extend(docData, dataObj);
              var jsonString='{"requesttype":"updateObjectModel","collection":"assignation_collection","upsert":"true", "multi":"false","columnname":"_id","columnvalue":"'+docData._id+'","object":'+JSON.stringify(docData)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}'; 
			   ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString);
					

                setTimeout(callbackFunction,1000);
      },
	  
	  
      editExpiryDateForDeleteDocument:function(docData,callbackFunction) {
              var inputDate = new Date().toISOString();
              var dataObj = new Object();

        var projectName = ""+localStorage.getItem('projectName');
              dataObj.projectName=projectName;     
              dataObj.published_at = inputDate;
              dataObj.user=localStorage.getItem('username');
              dataObj.role=localStorage.getItem('rolename');
        dataObj.urlPath=window.location.pathname  + window.location.hash;
              jQuery.extend(docData, dataObj);
              var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
              client.update({
                index:iseConstants.str_docs_collection,
                type: projectName, 
                id:docData.documentId,
                body:  {
                  doc: {
                      expiryDate:docData.expiryDate                   
                  }, 
                }
                // "detect_noop": false
                              }, function (error, response) {
                  if( error != null ) {
                    console.log("error posting usage details ..");
                    console.log(error);
                  }
            });

                setTimeout(callbackFunction,1000);
      },


      addExpiryDateForDeleteDocument:function(docData,callbackFunction) {
              var inputDate = new Date().toISOString();
              var dataObj = new Object();

        var projectName = ""+localStorage.getItem('projectName');
              dataObj.projectName=projectName;     
              dataObj.published_at = inputDate;
              dataObj.user=localStorage.getItem('username');
              dataObj.role=localStorage.getItem('rolename');
        dataObj.urlPath=window.location.pathname  + window.location.hash;
              jQuery.extend(docData, dataObj);
              var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
              client.update({
                index:iseConstants.str_docs_collection,
                type: projectName, 
                id:docData.documentId,
                body:  {
                  doc: {
                        "expiryDate":docData.expiryDate                      
                  }, 
                }
                // "detect_noop": false
                              }, function (error, response) {
                  if( error != null ) {
                    console.log("error posting usage details ..");
                    console.log(error);
                  }
            });

                setTimeout(callbackFunction,1000);
      },

       deleteDocumentFromIndex:function(docData,callBackFunction) {
              var inputDate = new Date().toISOString();
              var dataObj = new Object();

        var projectName = ""+localStorage.getItem('projectName');
              dataObj.projectName=projectName;     
              dataObj.published_at = inputDate;
              dataObj.user=localStorage.getItem('username');
              dataObj.role=localStorage.getItem('rolename');
        dataObj.urlPath=window.location.pathname  + window.location.hash;
              jQuery.extend(docData, dataObj);
              var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
              client.delete({
                index:iseConstants.str_docs_collection,
                type: projectName, 
                id:docData.documentId ,
                  body: docData               
              
                }, function (error, response) {
                  if( error != null ) {
                    console.log("error posting usage details ..");
                    console.log(error);
                  }
            });

                setTimeout(callbackFunction,10);
      },


      getContextSearchDocsResults:function(requestObject,callBackFunction){

         if(!requestObject) {
        callBackFunction(null); 
        return;
      }
       var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

         
            client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
              size: requestObject.maxResults, //15
              body: { 

           //    "_source": {
     //   "exclude": [ "documentcontent" ]
   // },



             "highlight": {
                // "require_field_match": true,
                
                  "fragment_size" : 150,
                  "number_of_fragments" : 3,
             "pre_tags" : ["<span style='background-color:YELLOW'>"],
                  "post_tags" : ["</span>"],
                   "encoder" : "html",
                  
                  "fields": {

                    //"no_match_size": 150},
            "documentcontent.content": {},
            "description":{},
            "title":{}
           
                  
                  }
                  },           

               "query" : {
                    "query_string" : {
                        "query" : requestObject.searchString
                        
                }
            }

           /* "highlight": {
                // "require_field_match": true,
                
                  "fragment_size" : 150,
                  "number_of_fragments" : 3,
                //  "pre_tags" : ["<em class='iseH'>"],
                //  "post_tags" : ["</em>"],
                   "encoder" : "html",
                  
                  "fields": {

                    //"no_match_size": 150},
                       "title":{}
           // "documentcontent.content": {},
           
                  
                  }
                  },           

               "query" : {
                    "query_string" : {
                        "query" : requestObject.searchString,
                        "default_operator":"AND"
                }
            }*/
          }
             
            }).then(function (resp) {

              console.log(resp);
             

             var temp = resp.hits;
           
              var tempAry = temp.hits;
              
              masterBucket=[];

        
                for(var i = 0;i< tempAry.length;i++){

                
                   masterBucket[i] = tempAry[i]._source;
                  masterBucket[i]._index = tempAry[i]._index;
                    masterBucket[i].highlight = tempAry[i]._source.title;
                   for(var K in tempAry[i].highlight){
                            masterBucket[i][K] = tempAry[i].highlight[K][0].replace(/\n/g,"<br/>");
                           // masterBucket[i].highlight = tempAry[i].highlight[K][0].replace(/\n/g,"<br/>");
                      }
              


                }

             console.log(masterBucket)
              callBackFunction(masterBucket);
            },function (error) {console.log(error);callBackFunction([])} );

    },

  
  getFileContentsforDownloadFile:function(requestObject,callBackFunction){

         if(!requestObject) {
        callBackFunction(null); 
        return;
      }
       var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

         
            client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
              size: requestObject.maxResults, //15
              body: {
          "_source": {
            "include": [ "fileName","documentcontent" ]
          },

           "query" : {
              "query_string" : {
                "query" : requestObject.searchString,
                "default_operator":"AND"
              }
              }
        }
               
            }).then(function (resp) {
             

             var temp = resp.hits;
              //console.log("temp"+temp);
              var tempAry = temp.hits;
              
              masterBucket=[];

        
                for(var i = 0;i< tempAry.length;i++){

                 // console.log(resp1[i])

                   masterBucket[i] = tempAry[i]._source;
                  masterBucket[i]._index = tempAry[i]._index;

                }
                            
                              
             // datArr = processDefectsDataObject_ElasticSearch(masterBucket,tempAry);
              callBackFunction(masterBucket);
            },function (error) {console.log(error);callBackFunction([])} );

    },

    getTestCaseFeaturesForDevDashboard:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
    
       
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
              body: {      

                "query": {
                "filtered": {
                                   "query": {
                                       "match_all": {}
                                   },"filter" : {
                    "query" : {
                        "query_string" : {
                            "query" : requestObject.searchString,
                            "default_operator":"OR"
                        }
                              }
                      }
                   }
                },

            "aggregations": {
              "testcases": {
                "terms": {
                  "field": "testcaseid","size":0
                },
                "aggregations": {
                  "status": {
                    "terms": {
          "field": "status","size":0
                    },
                    "aggregations": {
                 "maxdate": {
                    "max": {
                           "field": "buildnumber"
                    }
                  }

               }
                  }
               }
              }
            }
           


      }
            }).then(function (resp) {

              console.log(resp);


               var temp = resp.aggregations;           
              var tempAry = temp.testcases.buckets;              
              masterBucket=[];            

        
                for(var i = 0;i< tempAry.length;i++){             

                   masterBucket[i] = tempAry[i];               

                }          
          
              callBackFunction(masterBucket);            
       
            },function (error) {console.log(error);callBackFunction([])} );
  },
  
  //bug 2434 - starts
  // unmapped defects and testcases
	//ISE.getUnmappedFeatureMappingData("*",masterBucket,callBackFunction)
	getUnmappedFeatureMappingData:function(filter,masterBucket,callBackFunction) {

      /*iif(!requestObject) {
        callBackFunction(null); 
        return;
      }*/
       //var masterBucket = new Array();
	   //var selectedProject = localStorage.getItem('projectName');
	   var projectName = ""+localStorage.getItem('projectName');
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

         
            var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

				client.search({
						  index: iseConstants.featureMapping,
						  type:projectName,
						  body: {       "query": {
					"filtered": {
					   "query": {
							"match_all": {}
					   },"filter" : {
							"query" : {
								"query_string" : {
									"query" : filter,
									"default_operator":"OR"
								}
							}
					},
					}
				},   
			  "aggregations": {
				 "collectionbucket":{
				  "terms":{ "field": "_index","size":0 },
				   "aggregations": {
					"unmappedprifeaturebucket":{
					  "filter": { "missing": { "field": "primary_feature" } }
					}
				   }
				  }
			  },    "size":0

				  }
            }).then(function (resp) {
             
			var unMappedFeatureBuckets = resp.aggregations.collectionbucket.buckets;
             
			//masterBucket = [];
			var eachFeature = {};
            eachFeature.name = "Unmapped";
            eachFeature.defects = 0; //primary feature defects count only
            eachFeature.totaldefects = 0; //all primary + sub feature counts defects
            eachFeature.testcases = 0;
            eachFeature.totaltestcases = 0;
            eachFeature.source = 0;
            eachFeature.totalsource = 0;
            eachFeature.subfeatures = []; 
            
			
			for(var coll = 0;coll< unMappedFeatureBuckets.length;coll++){
			if(unMappedFeatureBuckets[coll].key == "defect_collection") {
			//var pdefUnmappedFeatureBuckets = unMappedFeatureBuckets[1].unmappedprifeaturebucket.doc_count;
				eachFeature.defects = unMappedFeatureBuckets[coll].unmappedprifeaturebucket.doc_count;
				eachFeature.totaldefects = unMappedFeatureBuckets[coll].unmappedprifeaturebucket.doc_count;
			}
			if(unMappedFeatureBuckets[coll].key == "sourcecode_collection") {
				//var psourceUnmappedFeatureBuckets = unMappedFeatureBuckets[0].unmappedprifeaturebucket.doc_count;
				eachFeature.source = unMappedFeatureBuckets[coll].unmappedprifeaturebucket.doc_count;
				eachFeature.totalsource = unMappedFeatureBuckets[coll].unmappedprifeaturebucket.doc_count
			}
			if(unMappedFeatureBuckets[coll].key == "testcase_collection") {
				//var ptestcaseUnmappedFeatureBuckets = unMappedFeatureBuckets[2].unmappedprifeaturebucket.doc_count;
				eachFeature.testcases = unMappedFeatureBuckets[coll].unmappedprifeaturebucket.doc_count;
				eachFeature.totaltestcases = unMappedFeatureBuckets[coll].unmappedprifeaturebucket.doc_count;
			}
			}
			masterBucket.push(eachFeature);
			callBackFunction(masterBucket);
			//console.log("all values -----"+"def:"+pdefUnmappedFeatureBuckets+"$$"+"source:"+psourceUnmappedFeatureBuckets+"$$"+"test:"+ptestcaseUnmappedFeatureBuckets)
			//return "def:"+pdefUnmappedFeatureBuckets+"source:"+psourceUnmappedFeatureBuckets+"test:"+ptestcaseUnmappedFeatureBuckets;
            
            });
	},
	
	
  getNoFeatureSearchResults:function(requestObject,callBackFunction) {


      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
    
      //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

         
            client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
              size: requestObject.maxResults, //15
              body: {
                "query": {
                "filtered": {
                                   "query": {
                                                                "match_all": {}
                                   },"filter" : {
                "query" : {
        "filtered" : {
            "filter": {
                "missing" : { "field" : "primary_feature" }
            }
        }
    }
        }
                                }
                }
               
             }
             
            }).then(function (resp) {
              //console.log( resp);
              var temp = resp.hits;
              //console.log("temp"+temp);
              var tempAry = temp.hits;
              //console.log(tempAry[i].getHighlightFields())
        masterBucket = [];
              for(var i = 0;i< tempAry.length;i++){

                if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
                 
                  masterBucket[i] = tempAry[i]._source;
                  masterBucket[i]._index = tempAry[i]._index;
                  if( tempAry[i].highlight !='undefined') {
                   //SIMY: TODO .. there is some issue here 
                      for(var K in tempAry[i].highlight){
                            masterBucket[i][K] = tempAry[i].highlight[K][0].replace(/\n/g,"<br/>");
                      }
          
                     
                  }

                }else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
                  masterBucket[i] = tempAry[i].source;
          //._score
                }
                
              }              
               var masterBucket=ISE.setSimilarity(masterBucket,tempAry);    
               
             // datArr = processDefectsDataObject_ElasticSearch(masterBucket,tempAry);
              callBackFunction(masterBucket);
            },function (error) {console.log(error);callBackFunction([])} );
  },
  //bug 2434 - ends

   getFileListForDefectId:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
      //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

         
            client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
              size: requestObject.maxResults, //15
              body: {
                
               
           "query" : {
              "query_string" : {
                "query" : requestObject.searchString,
                "default_operator":"AND",
                "analyzer" :"cess_analyzer"	
              }
              }
          }
            }).then(function (resp) {
        console.log( resp);
              var temp = resp.hits;
              var tempAry = temp.hits;
                 for(var i = 0;i< tempAry.length;i++){             

                   masterBucket[i] = tempAry[i]._source;
                  masterBucket[i]._index = tempAry[i]._index;

                }
                         
                        
             console.log(masterBucket);
              callBackFunction(masterBucket);
        
            },function (error) {console.log(error);callBackFunction([])} );
  },


  getBugCountForDevWorkFlow:function(requestObject,callBackFunction){

    if(!requestObject) {
        callBackFunction(null); 
        return;
      }
      //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

         
            client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
              size: requestObject.maxResults, //15
              body: {
                
               
          "query": {
                "filtered": {
              "query": {
                "match_all": {}
              },"filter" : {
                "query" : {
                    "query_string" : {
                        "query" : requestObject.searchString
                       
                    }
                }
        }
            }
          },     
      "aggregations": {
                "files":{
                    "terms":{ "field": "fileslist","size":0 },
                    "aggregations": {
          "defects": {
          "terms": { "field": "link","size":0 }
        }
                    }
                }
        
      }
          }
            }).then(function (resp) {
        console.log( resp);
             var temp = resp.aggregations;           
              var tempAry = temp.files.buckets;              
              masterBucket=[];            

        
                for(var i = 0;i< tempAry.length;i++){              

                   masterBucket[i] = tempAry[i];               

                }               
                        
           
              callBackFunction(masterBucket);
        
            },function (error) {console.log(error);callBackFunction([])} );
 


  },

   getChangedFilesCountForDevWorkFlow:function(requestObject,callBackFunction){

    if(!requestObject) {
        callBackFunction(null); 
        return;
      }
      //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

         
            client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
              size: requestObject.maxResults, //15
              body: {
                
               
            "query": {
                "filtered": {
              "query": {
                "match_all": {}
              },"filter" : {
                "query" : {
                    "query_string" : {
                        "query" : requestObject.searchString
                       
                    }
                }
        }
            }
          },     
      "aggregations": {
                "files":{
                    "terms":{ "field": "fileslist","size":0 }
                }
        
      }
          }
            }).then(function (resp) {
        console.log( resp);
             var temp = resp.aggregations;           
              var tempAry = temp.files.buckets;              
              masterBucket=[];            

        
                for(var i = 0;i< tempAry.length;i++){              

                   masterBucket[i] = tempAry[i];               

                }               
                        
           
              callBackFunction(masterBucket);
        
            },function (error) {console.log(error);callBackFunction([])} );
 


  },

  getPersonsCountForDevWorkFlow:function(requestObject,callBackFunction){

    if(!requestObject) {
        callBackFunction(null); 
        return;
      }
      //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

         
            client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
              size: requestObject.maxResults, //15
              body: {
                
               
            "query": {
                  "filtered": {
              "query": {
                "match_all": {}
              },"filter" : {
                "query" : {
                    "query_string" : {
                        "query" : requestObject.searchString
                       
                    }
                }
        }
            }
          },     
      "aggregations": {
                "files":{
                    "terms":{ "field": "fileslist","size":0 },
                    "aggregations": {
          "owner": {
          "terms": { "field": "fixedby","size":0 }
        }
                    }
                }
        
      }
          }
            }).then(function (resp) {
        console.log( resp);
             var temp = resp.aggregations;           
              var tempAry = temp.files.buckets;              
              masterBucket=[];            

        
                for(var i = 0;i< tempAry.length;i++){              

                   masterBucket[i] = tempAry[i];               

                }               
                        
           
              callBackFunction(masterBucket);
        
            },function (error) {console.log(error);callBackFunction([])} );
 


  },
  getNoPrioritySearchResults:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
      var masterBucket = new Array();
		var eachFeature = {};
            eachFeature.id = "";
            eachFeature.priority = "";
			
	   var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
			  index: requestObject.collectionName,
              type:requestObject.projectName,
              body: {		
					"query": {
						"filtered": {
						  "filter": {
							"term": {
							  "priority": ""
							}
						  }
						}
					  },"size":10000
				  }
            }).then(function (resp) {
              console.log(resp); 
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
			  var eachFeature = {};			  
					eachFeature.id = tempAry[i]._id;
					eachFeature.priority = tempAry[i]._source.priority;
					masterBucket.push(eachFeature);													  
				}             
              callBackFunction(masterBucket);            
       
            },function (error) {console.log(error);callBackFunction([])} );
		},
		
	getAutomationUDPriorityEmptySearchResults:function(requestObject,callBackFunction) {
      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
      var masterBucket = new Array();
		var eachFeature = {};
            eachFeature.id = "";
            //eachFeature.priority = "";
			
	   var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
			  index: requestObject.collectionName,
              type:requestObject.projectName,
              body: {		
			   "query": {
								
					"constant_score" : {
						"filter" : {
							"exists" : { "field" : "automation" }
						}     
					}    
					},"size": 10000

				  }
            }).then(function (resp) {
              console.log(resp); 
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
			  var eachFeature = {};			  
					eachFeature.id = tempAry[i]._id;
					//eachFeature.priority = tempAry[i]._source.priority;
					masterBucket.push(eachFeature);													  
				}             
              callBackFunction(masterBucket);            
       
            },function (error) {console.log(error);callBackFunction([])} );
		},
		
		getPriorityUDResults:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
      var masterBucket = new Array();
		var eachFeature = {};
            eachFeature.id = "";
            eachFeature.priority = "";
			
	   var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
			  index: requestObject.collectionName,
              type:requestObject.projectName,
              body: {		
			  "query": {
        		
					"constant_score" : {
						"filter" : {
							"missing" : { "field" : "priority" }
						}     
					}    
					},"size": 10000

				  }
            }).then(function (resp) {
              console.log(resp); 
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
			  var eachFeature = {};			  
					eachFeature.id = tempAry[i]._id;
					eachFeature.priority = tempAry[i]._source.priority;
					masterBucket.push(eachFeature);													  
				}             
              callBackFunction(masterBucket);            
       
            },function (error) {console.log(error);callBackFunction([])} );
		},
		
	getAutomationEmptyPriorityUDResults:function(requestObject,callBackFunction) {
      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
      var masterBucket = new Array();
		var eachFeature = {};
            eachFeature.id = "";
            eachFeature.priority = "";
			
	   var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
			  index: requestObject.collectionName,
              type:requestObject.projectName,
              body: {		
			  "query": {
					"filtered": {
					   "query": {
							"match_all": {}
					   }
					}
				},   
			  "aggregations": {
				 "collectionbucket":{
				  "terms":{ "field": "_index","size":0 },
				   "aggregations": {
					"unmappedprifeaturebucket":{
					  "filter": { "missing": { "field": "priority" } }
					}
				   }
				  }
			  },    "size":10000

				  }
            }).then(function (resp) {
              console.log(resp); 
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
			  var eachFeature = {};			  
					eachFeature.id = tempAry[i]._id;
					eachFeature.priority = tempAry[i]._source.priority;
					masterBucket.push(eachFeature);													  
				}             
              callBackFunction(masterBucket);            
       
            },function (error) {console.log(error);callBackFunction([])} );
		},
	getTestCasesInfoForDevDashboard:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }    
        var masterBucket = new Array();
		var eachFeature = {};
            eachFeature.id = "";
            eachFeature.priority = "";
			eachFeature.automation = "";
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
			  index: requestObject.collectionName,
              type:requestObject.projectName,
              body: {		
			"query": {"match_all": {}},"size": 10000
			}
            }).then(function (resp) {
              console.log(resp); 
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
			  var eachFeature = {};			  
					eachFeature.id = tempAry[i]._id;
					
					if(!tempAry[i]._source.hasOwnProperty('priority')){
					eachFeature.priority = "unspecified";
					}else if(tempAry[i]._source.priority == ""){
					eachFeature.priority = "No Priority";
					}
					else{
					eachFeature.priority = tempAry[i]._source.priority;
					}

					if(!tempAry[i]._source.hasOwnProperty('automation') || tempAry[i]._source.automation == null || tempAry[i]._source.automation == ""){
					eachFeature.automation = "unspecified";
					}else{
					eachFeature.automation = tempAry[i]._source.automation;
					}
					masterBucket.push(eachFeature);
													  
				}             
              callBackFunction(masterBucket);            
       
            },function (error) {console.log(error);callBackFunction([])} );
  },
  getTestExecutionsForDevDashboard:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
       
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
              body: {          
                                   "query": {
                                       "match_all": {}
                                   },

            "aggregations": {
              "testcases": {
                "terms": {
                  "field": "testcaseid","size":0
                },
                "aggregations": {
                  "status": {
                    "terms": {
          "field": "status","size":0
                    },
                    "aggregations": {
                 "maxdate": {
                    "max": {
                           "field": "buildnumber"
                    }
                  }

               }
                  }
               }
              }
            }
      }
            }).then(function (resp) {
              console.log(resp);
			  
               var temp = resp.aggregations;           
              var tempAry = temp.testcases.buckets;              
              masterBucket=[];  
			  
                for(var i = 0;i< tempAry.length;i++){ 
                   masterBucket[i] = tempAry[i];    
				   }          
          
              callBackFunction(masterBucket);            
       
            },function (error) {console.log(error);callBackFunction([])} );
  },  
  getDevDashBoardSearch:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
      var masterBucket = new Array();
		var eachFeature = {};
            eachFeature.id = "";
            eachFeature.priority = "";
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
			  index: requestObject.collectionName,
              type:requestObject.projectName,
              body: {		
			"query": {                 
					  "query_string": {
                        "query": requestObject.searchString
                       }
					  }, "size": 10000
			}
            }).then(function (resp) {
              console.log(resp); 
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
			  var eachFeature = {};			  
					eachFeature.id = tempAry[i]._id;
					eachFeature.priority = tempAry[i]._source.priority;
					masterBucket.push(eachFeature);													  
				}             
              callBackFunction(masterBucket);            
       
            },function (error) {console.log(error);callBackFunction([])} );
},
_getAllProjects:function(){
        try {

            var respListProjects;
            var data = {OrgId:parseInt(localStorage.getItem('organization')),operation:'orglist',username:localStorage.getItem('username')};
			if(iseConstants.organization != '' && iseConstants.organization != undefined && iseConstants.organization.toLowerCase() == 'cisco')
			{
				 data = {organizationName:localStorage.getItem('organization'),operation:'orglist',username:localStorage.getItem('username')};
				
			}
				respListProjects = ISE_Ajax_Service._genericServiceCall('projectManagement',data);
            return respListProjects;

        } catch (e) {
            console.log("listAllProjects exception -  " + e);
        }
    },
	 updateProject: function(projectName) {
        try {

            var respListProjects;
            var data = {organizationName:localStorage.getItem('organization'), username:localStorage.getItem("username"),projectName:projectName,operation:'update'};
				respListProjects = ISE_Ajax_Service._genericServiceCall('projectManagement',data);
            return respListProjects;

        } catch (e) {
            console.log("listAllProjects exception -  " + e);
        }
    },
    
    // get Test Execution Details based on testcase ID
	getTestExceResults:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
      //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

         
            client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
              size: requestObject.maxResults, //15
              body: {
                "query": {
						"filtered": {
						"query": {
						"match_all": {}
						},"filter" : {
							"query" : {
							"query_string" : {
									"query" :requestObject.searchString
									//"default_operator":"OR"
									}
								}
							}
						}
					}  
				}
            }).then(function (resp) {
			  console.log( "getting all reponse----For Popup"+resp);
              var temp = resp.hits;
              var tempAry = temp.hits;
               for(var i = 0;i< tempAry.length;i++){

                if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
					masterBucket[i] = tempAry[i]._source;
					masterBucket[i]._index = tempAry[i]._index;
				}else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
					masterBucket[i] = tempAry[i].source;
                }
              }              
                        
             console.log(masterBucket);
              callBackFunction(masterBucket);
			  
            },function (error) {console.log(error);callBackFunction([])} );
  	},
	getRegPlanOptsMapSearchResults:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
		var masterBucket = new Array();
		var eachFeature = {};
            eachFeature.option_key = "";
			eachFeature.option_type = "";
			eachFeature.option_value = "";
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
			  index: requestObject.collectionName,
              type:requestObject.projectName,
              body: {		
				"query": {
				  "filtered": {
					 "query": {
						"match_all": {}
					 },
					 "filter": {
						"bool": {
						   "must": [
							  {
								 "term": {
								"plan_name": requestObject.searchString
								 }
							  }
						   ]
						}
					 }
				  }
			   },"size": 2000    
			}
            }).then(function (resp) {
              console.log(resp); 
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
			        eachFeature = {};
			        eachFeature.option_key = tempAry[i]._source.option_key;
					eachFeature.option_type = tempAry[i]._source.option_type; 
					eachFeature.option_value = tempAry[i]._source.option_value; 					
					masterBucket.push(eachFeature);													  
				}             
              callBackFunction(masterBucket);            
       
            },function (error) {console.log(error);callBackFunction([])} );
  },
	//Analyze Changes, Reg Opt Mongo query to Elastic--->3
	getBuildsInfo:function(requestObject,callBackFunction){
	  
	  if(!requestObject) {
			callBackFunction(null); 
			return;
		  }
		var masterBucket = new Array(); 
		var eachFeature = {};
				eachFeature.build = "";
				eachFeature.release = "";
				eachFeature.build_type = "";
				eachFeature.wt_distribution = "";
				eachFeature.created_date = "";
			var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

			client.search({
				  index: requestObject.collectionName,
				  type:requestObject.projectName,
				  body: {		
					"query": {
					"match_all": {}
						},"size": 1000
				}
				}).then(function (resp) {
				  console.log(resp); 
				  var temp = resp.hits;
				  var tempAry = temp.hits;
				  for(var i = 0;i< tempAry.length;i++){
						eachFeature = {};
						eachFeature.build = tempAry[i]._source.build;
						eachFeature.release = tempAry[i]._source.release;  
						eachFeature.build_type = tempAry[i]._source.build_type;  
						eachFeature.wt_distribution= tempAry[i]._source.wt_distribution;  
						eachFeature.created_date = tempAry[i]._source.created_date; 					
						masterBucket.push(eachFeature);														  
					}             
				  callBackFunction(masterBucket);       
		   
				},function (error) {console.log(error);callBackFunction([])} );			
	},
	//Analyze Changes, Reg Opt Mongo query to Elastic--->4
	getTestExecsInfo:function(requestObject,callBackFunction){
  
		if(!requestObject) {
			callBackFunction(null); 
			return;
		  }
		var masterBucket = new Array(); 
		var eachFeature = {};
				eachFeature.build = "";
				eachFeature.release = "";
				//eachFeature._id = "";
			var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

			client.search({
				  index: requestObject.collectionName,
				  type:requestObject.projectName,
			  body: {		
					"size": 0,
					"aggregations" : {
					"releases" : {

					"terms" : {
							 "field" : "release","size":100
					},
					"aggregations" : { 
						"builds": {
							"terms": {"field": "build","size":500}                    
						}
					}
				 }
				}
			 }
				}).then(function (resp) {
				  console.log(resp); 
				  var releases = resp.aggregations.releases;           
				  var releasesArry = releases.buckets;
				  for(var i = 0;i< releasesArry.length;i++){
				  var buildsArry = releasesArry[i].builds.buckets;
				  for(var k = 0; k< buildsArry.length; k++){
						eachFeature = {};
						eachFeature.build = buildsArry[k].key;
						eachFeature.release = releasesArry[i].key;  
						//eachFeature._id = tempAry[i]._source._id; 										
						masterBucket.push(eachFeature);		  
				  }
																			  
					}             
				  callBackFunction(masterBucket);       
		   
				},function (error) {console.log(error);callBackFunction([])} );			
	},
	//Reg Opt Mongo query to Elastic--->5
	getRegressionReleaseBuildDefectsSearchResults:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
      var masterBucket = new Array();
      var eachFeature = {};
            eachFeature.defect = "";
			eachFeature._id = "";
			eachFeature.title = "";
			eachFeature.feature = "";				
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
			  index: requestObject.collectionName,
              type:requestObject.projectName,
              body: {		
			"query": {                 
					  "query_string": {
                        "query": requestObject.searchString
                       }
					  }, "size": 10000
			}
            }).then(function (resp) {
              console.log(resp); 
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
			        eachFeature = {};
			        eachFeature.defect = tempAry[i]._id;
					eachFeature._id = tempAry[i]._id;  
					eachFeature.title = tempAry[i]._source.title;
					eachFeature.feature = tempAry[i]._source.primary_feature; 					
					masterBucket.push(eachFeature);													  
				}             
              callBackFunction(masterBucket);            
       
            },function (error) {console.log(error);callBackFunction([])} );
	},
	//Reg Opt Mongo query to Elastic--->7
	getRegressionPlanSearchResults:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
		var masterBucket = new Array();
		var eachFeature = {};
            eachFeature.created_date = "";
			eachFeature.recommendation_executionid = "";
			eachFeature.optimization_executionid = "";
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
			  index: requestObject.collectionName,
              type:requestObject.projectName,
              body: {		
				"query": {
				  "filtered": {
					 "query": {
						"match_all": {}
					 },
					 "filter": {
						"bool": {
						   "must": [
							  {
								 "term": {
								"plan_name": requestObject.searchString
								 }
							  }
						   ]
						}
					 }
				  }
			   }    
			}
            }).then(function (resp) {
              console.log(resp); 
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
			        eachFeature = {};
			        eachFeature.created_date = tempAry[i]._source.created_date;
					eachFeature.recommendation_executionid = tempAry[i]._source.recommendation_executionid; 
					eachFeature.optimization_executionid = tempAry[i]._source.optimization_executionid; 					
					masterBucket.push(eachFeature);													  
				}             
              callBackFunction(masterBucket);            
       
            },function (error) {console.log(error);callBackFunction([])} );
	},
	//Reg Opt Mongo query to Elastic--->8,9
	getRegressionTestCaseSearchResults:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
		var masterBucket = new Array();
		/* var eachFeature = {};
            eachFeature._id = "";
			eachFeature.buckets = "";
			eachFeature.optimization_executionid = ""; */
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
			  index: requestObject.collectionName,
              type:requestObject.projectName,
              body: {		
				"query": {
				  "filtered": {
					 "query": {
						"match_all": {}
					 },
					 "filter": {
						"bool": {
						   "must": [
							  {
								 "term": {
								"_id": requestObject.searchString
								 }
							  }
						   ]
						}
					 }
				  }
			   }    
			}
            }).then(function (resp) {
              console.log(resp); 
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
			        /* eachFeature = {};
			        eachFeature._id = tempAry[i]._id;
					eachFeature.buckets = tempAry[i]._source.buckets;  */					 					
					masterBucket.push(tempAry[i]._source);													  
				}             
              callBackFunction(masterBucket);            
       
            },function (error) {console.log(error);callBackFunction([])} );
	},
	//Reg Opt Mongo query to Elastic--->10
	getEnvironments:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
	  var masterBucket = new Array();
	  var eachFeature = {};
			eachFeature._id = "";
            eachFeature.distribution = "";
			eachFeature.env_name = "";			
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
			  index: requestObject.collectionName,
              type:requestObject.projectName,
              body: {		
			"query": {
						"match_all": {}
					 },"size": 1000
			}
            }).then(function (resp) {
              console.log(resp); 
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
			        eachFeature = {};
					eachFeature._id = tempAry[i]._id;  
			        eachFeature.distribution = tempAry[i]._source.distribution;
					eachFeature.env_name = tempAry[i]._source.env_name;  					
					masterBucket.push(eachFeature);													  
				}             
              callBackFunction(masterBucket);            
       
            },function (error) {console.log(error);callBackFunction([])} );
	},
	//Bug Prior Mongo query to Elastic-->2
	getDropDownReleases:function(requestObject,callBackFunction){

	 /*  var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
				  console.log("@release in ISE");
	  ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,callBackFunction);
				  console.log("@releases in ISE after ajax"); */
	 if(!requestObject) {
		callBackFunction(null); 
		return;
	  }
	var masterBucket = new Array(); 
	var eachFeature = {};
		eachFeature.release = "";
		var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

		client.search({
			  index: requestObject.collectionName,
			  type:requestObject.projectName,
		  body: {		
			"size": 0,
			"aggregations" : {
			"releases" : {
				"terms" : {
						 "field" : "release","size":1000
				}			
			 }
			}
		 }
			}).then(function (resp) {
			  console.log(resp); 
			  var releases = resp.aggregations.releases;           
			  var releasesArry = releases.buckets;
			  for(var k = 0; k< releasesArry.length; k++){
					eachFeature = {};
					eachFeature.release = releasesArry[k].key;  
					masterBucket.push(eachFeature);		  
			  }			         
			  callBackFunction(masterBucket);       
	   
			},function (error) {console.log(error);callBackFunction([])} );	     
    },
	getDropDownFeatures:function(requestObject,callBackFunction){

		/*  var data = '{"fileName":"'+fileName+'","params":"'+params+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
                  console.log("@release in ISE");
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,callBackFunction);
                  console.log("@releases in ISE after ajax"); */
		if(!requestObject) {
			callBackFunction(null); 
			return;
		}
		var masterBucket = new Array(); 
		var eachFeature = {};
		var features = [];
        eachFeature.primary_feature = "";
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
			  index: requestObject.collectionName,
              type:requestObject.projectName,
          body: {			
				"query" : {
					"match_all": {}
			}, "size": 100
		 }
            }).then(function (resp) {
              console.log(resp); 
              /* var features = resp.aggregations.features;           
              var featuresArry = features.buckets;
			  for(var k = 0; k< featuresArry.length; k++){
					eachFeature = {};
					eachFeature.feature = featuresArry[k].key;  
					masterBucket.push(eachFeature);		  
			  }			         
              callBackFunction(masterBucket);   */   
			  var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
					if(features.indexOf(tempAry[i]._source.feature) == -1){
					features.push(tempAry[i]._source.feature);
			        eachFeature = {};
					eachFeature.primary_feature = tempAry[i]._source.feature;  
					masterBucket.push(eachFeature);
					}					
				}     	         
              callBackFunction(masterBucket);   			  
       
            },function (error) {console.log(error);callBackFunction([])} );	     
    },
	getDropDownPriority:function(requestObject,callBackFunction){
		if(!requestObject) {
			callBackFunction(null); 
			return;
		}
		var masterBucket = new Array(); 
		var eachPriority = {};
		var priority = [];
        eachPriority.priority = "";
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
			  index: requestObject.collectionName,
              type:requestObject.projectName,
          body: {			
				"query" : {
					"match_all": {}
			}, "size": 100
		 }
            }).then(function (resp) {
              console.log(resp); 
              /* var features = resp.aggregations.features;           
              var featuresArry = features.buckets;
			  for(var k = 0; k< featuresArry.length; k++){
					eachFeature = {};
					eachFeature.feature = featuresArry[k].key;  
					masterBucket.push(eachFeature);		  
			  }			         
              callBackFunction(masterBucket);   */   
			  var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
					if(priority.indexOf(tempAry[i]._source.priority) == -1){
					priority.push(tempAry[i]._source.priority);
			        eachPriority = {};
					eachPriority.priority = tempAry[i]._source.priority;  
					masterBucket.push(eachPriority);
					}					
				}     	         
              callBackFunction(masterBucket);   			  
       
            },function (error) {console.log(error);callBackFunction([])} );	     
    },
	getDefectsHeatMapResults:function(requestObject,callBackFunction){

		if(!requestObject) {
					 callBackFunction(null); 
					 return;
			 }
		   var masterBucket = new Array(); 
		   var eachFeature = {};
		   eachFeature.featureName = "";  
		   eachFeature.defectcount = ""; 		   
		   var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

		   client.search({
				index: requestObject.collectionName,
				type:requestObject.projectName,
				size:2000
				
			 }).then(function (resp) {
              console.log(resp); 
              var temp = resp.hits;
				var tempAry = temp.hits;
				for(var i = 0;i< tempAry.length;i++){

                if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
                 
                  masterBucket[i] = tempAry[i]._source;
                  masterBucket[i]._index = tempAry[i]._index;
                 

                }else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
                  masterBucket[i] = tempAry[i].source;
          //._score
                }
                
              }    
                         
              callBackFunction(masterBucket);       
       
            },function (error) {console.log(error);callBackFunction([])} );	                   
	},
	getMaxCountofDefectsHeatmap:function(requestObject,callBackFunction){

		if(!requestObject) {
					 callBackFunction(null); 
					 return;
			 }
		   var masterBucket = new Array(); 
		   var eachFeature = {};
		   eachFeature.featureName = "";  
		   eachFeature.defectcount = ""; 		   
		   var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

		   client.search({
				index: requestObject.collectionName,
				type:requestObject.projectName,
				size:0,
				body: {		
					"aggs" : {
						"maxvalue" : {
							"max" : { 
								"field" : "count"
									}
											}
							}
				}
				
			 }).then(function (resp) {
              console.log(resp); 
				var maxcountbucket = resp.aggregations.maxvalue;  
                    masterBucket[0] = maxcountbucket     
              callBackFunction(masterBucket);       
       
            },function (error) {console.log(error);callBackFunction([])} );	                   
	},
	getDistinctReleasesInfo:function(requestObject,callBackFunction){

		if(!requestObject) {
					 callBackFunction(null); 
					 return;
			 }
		   var masterBucket = new Array(); 
		   var eachFeature = {};
		   eachFeature.release = "";                                
		   var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

		   client.search({
				index: requestObject.collectionName,
				type:requestObject.projectName,
				body: {                 
						 "size": 0, 
						   "aggregations" : {
									"releases" : {

										"terms" : {
												 "field" : "release","size":10000
										}
									}
						   }
			  }
			 }).then(function (resp) {
              console.log(resp); 
              var releases = resp.aggregations.releases;           
              var releasesArry = releases.buckets;
              for(var i = 0;i< releasesArry.length;i++){			 
					eachFeature = {};
					eachFeature.release = releasesArry[i].key;  
					//eachFeature._id = tempAry[i]._source._id; 										
					masterBucket.push(eachFeature);																		  
				}             
              callBackFunction(masterBucket);       
       
            },function (error) {console.log(error);callBackFunction([])} );	                   
	  },
	  
	  //SAIDAREDDY started regopt ES queries
	multipleExactValuesESQuery : function (reqObj,callBackFunction){
		if(!reqObj) {
			callBackFunction(null); 
			return;
		}
		var resultObj={};
		 var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
		client.search({
		  index: reqObj.collectionName,
		  type: reqObj.projectName,
		  size: reqObj.maxResults,
		  ignore: [404],
		  body: reqObj.query,
		  
		}).then(function (resp) {
			resultObj = resp.hits.hits;
			if(callBackFunction)
				callBackFunction(resultObj);
			//alert("------------------------------------"+resultObj.length);
		}, function (err) {
			alert(err.message);
		});
	//return resultObj;
	},
	
	multipleExactValuesESQuerySpl : function (reqObj,callBackFunction,tcType){
		if(!reqObj) {
			callBackFunction(null); 
			return;
		}
		var resultObj={};
		 var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
		client.search({
		  index: reqObj.collectionName,
		  type: reqObj.projectName,
		  ignore: [404],
		  size: reqObj.maxResults,
		  body: reqObj.query,
		}).then(function (resp) {
			resultObj.data = resp.hits.hits;
			resultObj.tcType = tcType;
			
			if(callBackFunction)
				callBackFunction(resultObj);
			//alert("------------------------------------"+resultObj.length);
		}, function (err) {
			alert(err.message);
		});
	//return resultObj;
	},
	//SAIDAREDDY ended regopt ES queries
	//Organization based Roles
	_getAllRoles:function(){
        try {

            var respListProjects;
            var data = {OrgId:parseInt(localStorage.getItem('organization')),operation:'orglist',username:localStorage.getItem('username')};
			if(iseConstants.organization != '' && iseConstants.organization != undefined && iseConstants.organization.toLowerCase() == 'cisco')
			{
				 data = {organizationName:localStorage.getItem('organization'),operation:'orglist',username:localStorage.getItem('username')};
				
			}
				respListProjects = ISE_Ajax_Service._genericServiceCall('RoleManagement',data);
            return respListProjects;

        } catch (e) {
            console.log("listAllProjects exception -  " + e);
        }
    },
	//Added regression Highlighting
	getMaxCountForReleasesInfo:function(requestObject,callBackFunction){

		if(!requestObject) {
					 callBackFunction(null); 
					 return;
			 }
		   var masterBucket = new Array(); 
		   var eachFeature = {};
		   eachFeature.release = "";                                
		   var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

		   client.search({
				index: requestObject.collectionName,
				type:requestObject.projectName,
				size:0,
				body: {                 
						 "query" : {
								"filtered" : { 
									"query" : {
									"query_string" : {
										"query" :requestObject.searchstring
										}
									}
								}
		
								},"aggs" : {
											"maxvalue" : {
													"max" : { 
														"field" : "count"
															}
																	}
													}
			  }
			 }).then(function (resp) {
              console.log(resp); 
              //onsole.log(resp); 
				var maxcountbucket = resp.aggregations.maxvalue;  
                    masterBucket[0] = maxcountbucket     
              callBackFunction(masterBucket);       
              //callBackFunction(masterBucket);       
       
            },function (error) {console.log(error);callBackFunction([])} );	                   
	  },
	  getMaxFeaturesofDefects:function(requestObject,callBackFunction){

		if(!requestObject) {
					 callBackFunction(null); 
					 return;
			 }
		   var masterBucket = new Array(); 
		   var eachFeature = {};
		   eachFeature.featureName = "";  
		   eachFeature.defectcount = ""; 		   
		   var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

		   client.search({
				index: requestObject.collectionName,
				type:requestObject.projectName,
				size:2000,
				body: {		
					
			"query" : {"filtered" : { 
                  "query": {"query_string": {"query": requestObject.searchString}}
                }}
				}
				
			 }).then(function (resp) {
              
		if(resp != null && resp != "undefined" && resp!= "" )
			{
				
			 var temp = resp.hits;
			
              var tempAry = temp.hits;
              
				masterBucket = new Array();
              for(var i = 0;i< tempAry.length;i++){

                if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
                 
                  var eachobj = new Object();
				  eachobj.feature = tempAry[i]._source.feature;
				  eachobj.count = tempAry[i]._source.count;
				  eachobj.release = tempAry[i]._source.release;
                  masterBucket.push(eachobj);
                  }

                else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
				 var eachobj = new Object();
				  eachobj.feature = tempAry[i]._source.feature;
				  eachobj.count = tempAry[i]._source.count;
				  eachobj.release = tempAry[i]._source.release;
                  masterBucket.push(eachobj);
          //._score
                 }
				}				 
               callBackFunction(masterBucket);	
				}
				
            },function (error) {console.log(error);callBackFunction([])} );	                   
	},
	//End Regression highlight
	
	//EXACT SEARCH
	getExactSearchResults:function(requestObject,callBackFunction) {

	      if(!requestObject) {
	        callBackFunction(null); 
	        return;
	      }
	    
			var masterBucket = new Array();
	        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
	         
	            client.search({
	              index: requestObject.collectionName,
	              type:requestObject.projectName,
	              size: requestObject.maxResults, //25
	              body: {
				  "highlight": {
	                // "require_field_match": true,
	                  "number_of_fragments" : 0,
	                  "pre_tags" : ["<em class='iseH'>"],
	                  "post_tags" : ["</em>"],
	                  "encoder" : "html",
	                  
	                  "fields": {

	                    //"no_match_size": 150},
	            "description": {},
	            "title":{},
	             "notes":{}     
	                  }
	                  },
	                
	                "query": {
						"query_string": {
							//"default_operator": "and", 					
						   "query": requestObject.searchString,"analyzer" :"cess_analyzer"		   
						}
					}               
	             }
	             
	            }).then(function (resp) {
	              //console.log( resp);
	              var temp = resp.hits;
	              //console.log("temp"+temp);
	              var tempAry = temp.hits;
	              //console.log(tempAry[i].getHighlightFields())
	        masterBucket = [];
	              for(var i = 0;i< tempAry.length;i++){				
					//var id = tempAry[i]._id.split('.');
					//if(id.length == 2){
						if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
						 
						  masterBucket[i] = tempAry[i]._source;
						  masterBucket[i]._index = tempAry[i]._index;
						  if( tempAry[i].highlight != undefined && tempAry[i].highlight !='undefined') {
						   //SIMY: TODO .. there is some issue here 
							  for(var K in tempAry[i].highlight){
									masterBucket[i][K] = tempAry[i].highlight[K][0].replace(/\n/g,"<br/>");
									//masterBucket[i][K] = tempAry[i].highlight[K][0].replace(/.\t/g,".#");
							  }						 
						  }

						}else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
						  masterBucket[i] = tempAry[i].source;
				  //._score
						}
					//}
	                
	              }              
	               var masterBucket=ISE.setSimilarity(masterBucket,tempAry);    
	               
	             // datArr = processDefectsDataObject_ElasticSearch(masterBucket,tempAry);
	              callBackFunction(masterBucket);
	            },function (error) {console.log(error);callBackFunction([])} );			
	    },
	    
		//AND CONDITION FOR DIFFERENT FIELDS
		getAdvancedSearchANDResults: function(requestObject,callBackFunction) {

	      if(!requestObject) {
	        callBackFunction(null); 
	        return;
	      }
	      var masterBucket = [];		
	        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

	        client.search({
				  index: requestObject.collectionName,
	              type:requestObject.projectName,
					  body: {
					"highlight": {
	                // "require_field_match": true,
	                  "number_of_fragments" : 0,
	                  "pre_tags" : ["<em class='iseH'>"],
	                  "post_tags" : ["</em>"],
	                  "encoder" : "html",
	                  
	                  "fields": {

	                    //"no_match_size": 150},
	            "description": {},
	            "title":{},
	                  
	                  }
	                  },
					"query": {
	    				"query_string": {
	    				   "query": requestObject.searchString
	    				}
					  }, "size": 100
				}
	            }).then(function (resp) {
	             //console.log( resp);
	              var temp = resp.hits;
	              //console.log("temp"+temp);
	              var tempAry = temp.hits;
	              //console.log(tempAry[i].getHighlightFields())
	             masterBucket = [];
	              for(var i = 0;i< tempAry.length;i++){

	                if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
	                 
	                  masterBucket[i] = tempAry[i]._source;
	                  masterBucket[i]._index = tempAry[i]._index;
	                  if( tempAry[i].highlight !='undefined') {
	                   //SIMY: TODO .. there is some issue here 
	                      for(var K in tempAry[i].highlight){
	                            masterBucket[i][K] = tempAry[i].highlight[K][0].replace(/\n/g,"<br/>");
	                            //masterBucket[i][K] = tempAry[i].highlight[K][0].replace(/.\t/g,".#");
	                      }
	          
	                     
	                  }

	                }else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
	                  masterBucket[i] = tempAry[i].source;
	          //._score
	                }
	                
	              }              
	               var masterBucket=ISE.setSimilarity(masterBucket,tempAry);    
	               
	             // datArr = processDefectsDataObject_ElasticSearch(masterBucket,tempAry);
	              callBackFunction(masterBucket);
	            },function (error) {console.log(error);callBackFunction([])} );
		},
			//Analyze Changes 
	getDefectFileSearchResults:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
    var eachFeature = {};
            eachFeature.source = "";
			//eachFeature.file = "";
    //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
         
            client.search({
            index: requestObject.collectionName,
            type:requestObject.projectName,
            size: requestObject.maxResults, //15
            body: {
			"query": {
				"filtered": {
				"query": {
				"match_all": {}
				},"filter" : {
					"query" : {
						"query_string" : {
								"query" :requestObject.searchString, "analyzer" :"cess_analyzer",
								"default_operator":"OR"
								
							}
						}
			         }
			   }
			}	
			}
            }).then(function (resp) {
			console.log( resp);
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
			  eachFeature = {};
					 eachFeature.source = tempAry[i]._source;   
					 //eachFeature.file = tempAry[i]._source.file;
					masterBucket.push(eachFeature);					 
              }              
                        
              console.log(masterBucket);
              callBackFunction(masterBucket);
			  
            },function (error) {console.log(error);callBackFunction([])} );
  },
  
  //Analyze Changes 
  getDefectFileReleaseBuildSearchResults:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
    var masterBucket = new Array();
 var eachFeature = {};
            eachFeature.build = "";
			eachFeature._id = "";
			eachFeature.codecomponent = "";			
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
			  index: requestObject.collectionName,
              //type:requestObject.projectName,
              body: {		
			"query": {                 
					  "query_string": {
                        "query": requestObject.searchString
                       }
					  }, "size": 100
			}
            }).then(function (resp) {
              console.log(resp); 
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
			        eachFeature = {};
			        eachFeature.build = tempAry[i]._source.build;
					eachFeature._id = tempAry[i]._id;  
					eachFeature.codecomponent = tempAry[i]._source.codecomponent;  					
					masterBucket.push(eachFeature);													  
				}             
              callBackFunction(masterBucket);            
       
            },function (error) {console.log(error);callBackFunction([])} );
  },
  
  //Analyze Changes bug 2434 - ends
   getFilePartialSearchResults:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
    
    //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
         
            client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
              size: requestObject.maxResults, //15
              body: {
					 /* "query": {
							"filtered": {
							"query": {
							"match_all": {}
							},"filter" : {
						"query" : {
						"query_string" : {
						//"query":"file:\"*///Client/Mitel.Communicator.API.Contract/Mitel.Communicator.API.Contract.csproj\"*"
												  // "query" :requestObject.searchString									   
													//}
									//}
					//	}
					//	}
						//}	 */
						
						"query": {
								"query_string": {
								  
								   "query": requestObject.searchString,"analyzer": "cess_analyzer"
								}
							}	
								}
						}).then(function (resp) {
						console.log( resp);
						  var temp = resp.hits;
						  var tempAry = temp.hits;
						  for(var i = 0;i< tempAry.length;i++){

							if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
								masterBucket[i] = tempAry[i]._source;
								masterBucket[i]._index = tempAry[i]._index;
								masterBucket[i]._id = tempAry[i]._id;
								masterBucket[i].status = tempAry[i]._source.status;
								masterBucket[i].searchFile = requestObject.searchFile;
								masterBucket[i].searchFileFlag = requestObject.searchFileFlag;
							}else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
								masterBucket[i] = tempAry[i].source;
								masterBucket[i].searchFile = requestObject.searchFile;
								masterBucket[i].searchFileFlag = requestObject.searchFileFlag;
							}
						  }              
									
						  console.log(masterBucket);
						  callBackFunction(masterBucket);
						  
						},function (error) {console.log(error);callBackFunction([])} );
  },
  
  //Analyze Changes
  getFilteredDefectsSearchResults:function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
	  var masterBucket = new Array();
	  var eachFeature = {};
			eachFeature._id = "";
            eachFeature.status = "";
			eachFeature.build = "";
			eachFeature.file = "";
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

        client.search({
		  index: requestObject.collectionName,
		  type:requestObject.projectName,
		     body: {		
			 "query": {
				"query_string" : {
						"query" : requestObject.searchString
				}
			  },"size": 10000
			}
            }).then(function (resp) {
              console.log(resp); 
              var temp = resp.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){
			        eachFeature = {};
					eachFeature._id = tempAry[i]._id;
					if(tempAry[i]._source.status == undefined){
						eachFeature.status = "";
					}else{					
						eachFeature.status = tempAry[i]._source.status;
					}
					if(tempAry[i]._source.build == undefined){
						eachFeature.build = "";
					}else{					
						eachFeature.build = tempAry[i]._source.build;
					}
					if(tempAry[i]._source.file == undefined){
						eachFeature.file = "";
					}else{					
						eachFeature.file = tempAry[i]._source.file;
					}
					masterBucket.push(eachFeature);													  
				}          
              callBackFunction(masterBucket);            
       
            },function (error) {console.log(error);callBackFunction([])} );
  }
  
  

}
