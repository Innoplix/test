var ITS = {
	
count:0,

_CreateIndexService: function(inputParam, col) {
	
    var surlcreate = iseConstants.elasticsearchHost+"/" + col;
	$.support.cors = true;
	$.ajax({
        type: "POST",
        url: surlcreate,
        dataType: 'json',
        crossDomain: true,
        success: function (responseText) {
            if (responseText.acknowledged == true) {              
			  ITS._Createmappings(inputParam, col);
            }
        },
        error: function (xhr) {
          
            if (xhr.responseText.indexOf("IndexAlreadyExistsException") > -1) {
					ITS._Createmappings(inputParam, col);
				}
            else if (xhr.responseText.indexOf("InvalidIndexNameException") > -1) {
              
				}
			}
		});

	},
	
	_Createmappings:function(inputParam, col) {  
	
    var surl = iseConstants.elasticsearchHost+"/" + col + "/" + col + "/_mapping";
    $.support.cors = true;
    $.ajax({
        type: "POST",
        url: surl,
        dataType: 'json',
        data: JSON.stringify(inputParam),
        crossDomain: true,
        success: function (responseText) {
            if (responseText.acknowledged == true) { 
               ITS._QueryForAnalyzer(col);
            }
        },
        error: function (xhr) {          
            if (xhr.responseText.indexOf("IndexAlreadyExistsException") > -1) {
                ITS._QueryForAnalyzer(col);
				}            
			}
		});
	},
	
	_QueryForAnalyzer:function (col) {
		var query = {
			"analysis": {
				"filter": {
					"english_stop": {
						"type": "stop",
						"stopwords": "_english_"
					},
					"light_english_stemmer": {
						"type": "stemmer",
						"language": "light_english"
					},
					"english_possessive_stemmer": {
						"type": "stemmer",
						"language": "possessive_english"
					}
				},
				"analyzer": {
					"pssanalyzer": {
						"tokenizer": "standard",
						"filter": [
				"english_possessive_stemmer",
				"lowercase",
				"english_stop",
				"light_english_stemmer",
				"asciifolding"
			  ]
					}
				}
			}
			
		}
		 ITS._AnalyzerCreation(col, query);
	},
	_AnalyzerCreation:function (col, query) {	
		
		var surl = iseConstants.elasticsearchHost+"/" + col + "/_settings";
		var a = ITS._UpdateFunction(col, "_close");
		$.support.cors = true;
		$.ajax({
			type: "PUT",
			url: surl,
			dataType: 'json',
			data: JSON.stringify(query),
			crossDomain: true,
			success: function (responseText) {
				ITS._UpdateFunction(col, "_open");
			},
			error: function (xhr) {
				ITS._UpdateFunction(col, "_open");
			}
		});
	},

	// Function for close/open collection
	_UpdateFunction:function (col, status) {
		
		var surl = iseConstants.elasticsearchHost+"/" + col + "/" + status;
		var a = "";
		$.support.cors = true;
		$.ajax({
			type: "POST",
			url: surl,
			dataType: 'json',
			crossDomain: true,
			success: function (responseText) {
				if(status=="_open")
				{
				itsuploadadmin._receivedStatus("Success","create");
				}
			},
			error: function (xhr) {
				if(status=="_open")
				{
				itsuploadadmin._receivedStatus(xhr.responseText,"create");
				}
			}
		});
		return a;
	},
	
	_Getcollection:function (callback) {
		var surl = "";
		var list = [];
		surl = iseConstants.elasticsearchHost+"/" + "_stats/indexes?random=" + (new Date()).getTime() + Math.floor(Math.random() * 1000000);
		$.support.cors = true;
		$.ajax({
			type: "GET",
			url: surl,
			dataType: 'json',
			async: false,
			crossDomain: true,
			success: function (responseText) {
				_.each(responseText.indices, function (key, val) {
					if (val != "configuration" && val.indexOf('its-')>-1 ) {
						list.push(val);
					}
				}, this);

				if (typeof callback === "function") callback(list);
			},
			error: function (xhr) {
						 
			}
		});
	},
	_AjaxCallForConfiguration:function (query, viewname) {
		var surl = iseConstants.elasticsearchHost+"/" + "configuration" + "/configuration/" + viewname;
		$.support.cors = true;
		$.ajax({
			type: "POST",
			url: surl,
			dataType: 'json',
			data: JSON.stringify(query),
			crossDomain: true,
			success: function (responseText) {
			    alert('View Configuration Successfully Saved');
			   itsadmin._clearViewControls();
			},
			error: function (xhr) {
				//  alert("Error Occurred");
			}
		});
	},
	_GetCollectionFields:function (col, type) {
    var surl = "";
	surl = iseConstants.elasticsearchHost+"/" + col + "/" + col + "/_mapping";
    
    $.support.cors = true;
		$.ajax({
			type: "GET",
			url: surl,
			dataType: 'json',
			asyn: false,
			crossDomain: true,
			success: function (responseText) {
				var s = eval(responseText);
				var l = s[col]["mappings"][col]["properties"];
				if (type != "view") {
				itsadmin._DisplayCollectionFields(l);
				}
				else {
				itsadmin._CreateCheckforFieldInView(l, col);
				}
			},
			error: function (xhr) {
				//MessageForUnAvailiability();
			}
		});

	},
	_GetViewList:function (collectioname,projectName,callBackFunction) {
		var surl = "";
		var res = 0;
		surl = iseConstants.elasticsearchHost+"/" + collectioname + "/" + collectioname + "/" + "_search?q=ProjectName:"+projectName+"&random=" + (new Date()).getTime() + Math.floor(Math.random() * 1000000);
		$.support.cors = true;
		$.ajax({
			type: "GET",
			url: surl,
			dataType: 'json',
			async: false,
			crossDomain: true,
			success: function (responseText) {
				res = 1;           
			   //itsadmin._GetViewCollection(responseText);
			  callBackFunction(responseText);
			},
			error: function (xhr) {

			}
		});

	},
	_GetAnalyzerAllData:function (collectioname, callBackFunction) {
		var surl = "";
		var res = 0;
		surl = iseConstants.elasticsearchHost+"/" + collectioname + "/" + "_search?q=*&size=1000";
		$.support.cors = true;
		$.ajax({
			type: "GET",
			url: surl,
			dataType: 'json',
			async: false,
			crossDomain: true,
			success: function (responseText) {
				res = 1;           
			   //itsadmin._GetViewCollection(responseText);
			  callBackFunction(responseText);
			},
			error: function (xhr) {

			}
		});

	},
	_GetItsSupportInsightViewData:function (collectioname, callBackFunction) {
		var surl = "";
		var res = 0;
		surl = iseConstants.elasticsearchHost+"/" + collectioname + "/" + "_search?q=*&size=1000";
		$.support.cors = true;
		$.ajax({
			type: "GET",
			url: surl,
			dataType: 'json',
			async: false,
			crossDomain: true,
			success: function (responseText) {
				res = 1;           
			   //itsadmin._GetViewCollection(responseText);
			  callBackFunction(responseText);
			},
			error: function (xhr) {

			}
		});

	},
	_GetIssueList:function (requestObject,callBackFunction) {
		if(!requestObject) {
			callBackFunction(null); 
			return;
		  }
		var surl = "";
		var res = 0;
		surl = iseConstants.elasticsearchHost+"/" + requestObject.collectionName + "/" + requestObject.collectionName + "/" + "_search?_source=issueno&q="+requestObject.searchString+"*&size=10";
		$.support.cors = true;
		$.ajax({
			type: "GET",
			url: surl,
			dataType: 'json',
			async: false,
			crossDomain: true,
			success: function (responseText) {
				res = 1;           
			   //itsadmin._GetViewCollection(responseText);
			  callBackFunction(responseText);
			},
			error: function (xhr) {

			}
		});

	},
	_CreateType:function (requestObject, callbackMethod) {
		
		var client = new elasticsearch.Client({"host" : endpoint});
		client.indices.putMapping({	
		index: requestObject.index,
		type: requestObject.type,
		body: requestObject.body
			}).then(function (resp) {

			callbackMethod(resp);
		}
		,function (error)
		{
			console.log(error);
		})
	},
	
	_CreateCollection:function (requestObject, callbackMethod) {
		var client = new elasticsearch.Client({"host" : endpoint});
		client.indices.create({	
		index: requestObject.index,	
		body: requestObject.body
			}).then(function (resp) {

			callbackMethod(resp);
		}
		,function (error)
		{
			console.log(error);
		})
	  
	},
	
	_IndexForConfigurationFilter:function (inputParam, collectioname,viewname) {    
    var surl = iseConstants.elasticsearchHost+"/" + "configuration/"+viewname+"/" + collectioname;
    $.support.cors = true;
    $.ajax({
        type: "POST",
        url: surl,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: inputParam,
        crossDomain: true,
        success: function (responseText) {
            alert("Fields Configured Successfully for " + collectioname);
        },
        error: function (xhr) {

        }
    });
	},
	_GetResultSearch:function (requestObject,callBackFunction) {  
	if(!requestObject) {
        callBackFunction(null); 
        return;
      }
	// var query={         
        // "query": {           
                    // "filtered": {                      
					   // "query": 
							// {
							// "bool": {
							  // "should": [
								// {
								  // "match": {
									// "_all": {
											// "query" : requestObject.searchString, 
											// "analyzer": requestObject.analyzer,
											// "minimum_should_match": "75%"
									// }
								  // }
								// },
								// {
								  // "match": {
									// "summary": {
											// "query" : requestObject.searchString, 
											// "analyzer": requestObject.analyzer,
											// "boost": 2
									// }
								  // }
								// },
								// {
								  // "match": {
									// "_all": {
											// "query" : requestObject.searchString, 
											// "analyzer": requestObject.analyzer,
											// "operator": "and",
											// "boost": 3
									// }
								  // }
								// },
								// {
								  // "match_phrase": {
									// "_all": {
											// "query" : requestObject.searchString
												           
									// }
								  // }
								// }
							  // ],
							  // "minimum_should_match": 2
							// }
							// }
                    // }
            
        // }
    // }
	var query ="";
	var surl="";
	if(requestObject.searchString!="")
	{
	query={
           // "query": { "match": { "_all": { "query": requestObject.searchString, "analyzer": requestObject.analyzer}} }
		   "query": { "match": { "_all": { "query": requestObject.searchString}} }
            }
	surl = iseConstants.elasticsearchHost+"/" + requestObject.collectionName + "/_search?size=" + requestObject.maxResults;
	}
	else
	{
	query={
			"query": { "match_all": {} }
		  }
	surl = iseConstants.elasticsearchHost+"/" + requestObject.collectionName + "/_search?size=" + requestObject.maxResults;
	}
			
	
	
    $.support.cors = true;
	
    $.ajax({
        type: "POST",
        url: surl,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data:  JSON.stringify(query),
        crossDomain: true,
        success: function (responseText) {
			  var masterBucket = new Array();
              var temp = responseText.hits;
              var tempAry = temp.hits;
              for(var i = 0;i< tempAry.length;i++){

                if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
					masterBucket[i] = tempAry[i]._source;
					//masterBucket[i] = temp.hits;
					masterBucket[i]._index = tempAry[i]._index;
					if(requestObject.label!=undefined)
					{
						masterBucket[i]._label=requestObject.label;
						masterBucket[i]._cnt=ITS.count;
						ITS.count++;
					}
                }else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
					masterBucket[i] = tempAry[i].source;
                }
              }
			  var masterBucket=ISE.setSimilarity(masterBucket,temp.hits);
              callBackFunction(masterBucket);
        },
        error: function (xhr) {

        }
    });
	},
	_AnalyzeSearch:function (requestObject,callbackMethod) {  
	 
		var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost+"/"});
		var _type;
		var queryBody;
		if(requestObject.type == undefined)
			_type = "";
			else
			_type = requestObject.type;
		if(requestObject.q == undefined && requestObject.search_type ){
			queryBody = {
			"index": requestObject.index,
			"type": _type,
			"body": requestObject.body,
			"search_type":requestObject.search_type
			}
		}else if(requestObject.q == undefined)
		{
			queryBody = {
			"index": requestObject.index,
			"type": _type,
			"body": requestObject.body	
			}
		}
		else
		{
		queryBody = {
			"index": requestObject.index,
			"type": _type,
			"q": requestObject.q
			}
		}	
		
		client.search(queryBody).then(function (resp) {
				
			
			if(requestObject.formatdata == "1" && requestObject.getSuggestion == "1")
				callbackMethod(ITS._BucketizeAndSuggestionResponse(resp));
			else if(requestObject.formatdata == "1")	
				callbackMethod(ITS._BucketizeResponse(resp));
			else
				callbackMethod(resp);
		}
		,function (error)
		{
			console.log(error);
		})
	 },
	 _AnalyzeClusterSearch:function (requestObject,collection_name, project_name,callbackMethod) {  
	 
		var surl = "";
		var res = 0;
		surl = iseConstants.elasticsearchHost+"/" + collection_name+"/"+project_name+"/_search_with_clusters";
		//$.support.cors = true;
		//'{"search_request": {"fields": ["title", "description", "status" ], "query":   {"match" : {"_all" : "defect"}},"filter": {   "and" : [ {"term": {"status": "Closed"}},  {"range": {        "date": { "gte": "2010-01-06T15:21:20.000Z", "lte": "2016-01-06T15:21:20.000Z" }} }] },"size": 50  }, "include_hits": "true", "query_hint": "",  "field_mapping": {    "title": ["fields.title"],    "content": ["fields.description"],     "url": ["fields._id"]  }}'
		$.ajax({
			type: "POST",
			url: surl,
			dataType: 'json',
			async: false,
			data: requestObject,
			success: function (responseText) {
				res = 1;           
			   //itsadmin._GetViewCollection(responseText);
			  callbackMethod(responseText);
			},
			error: function (xhr) {
			console.log("_AnalyzeClusterSearch ERROR :"+xhr)
			}
		});
	},
	  _MultiAnalyzeSearch:function (requestObject, callbackMethod)
	 {
		var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost+"/"});
		client.msearch(requestObject).then(function (resp) {
			var masterBucket = new Array();
			for(var i = 0; i< resp.responses.length; i++)
			{
				masterBucket[i] = ITS._BucketizeResponse(resp.responses[i]);
			}		
			
			callbackMethod(masterBucket);
		}
		,function (error)
		{
			console.log(error);
		})
	 },
 	_BucketizeResponse:function (resp) { 
		var masterBucket = new Array();
		var temp = resp.hits;
		var tempAry = temp.hits;	
				for(var i = 0;i< tempAry.length;i++){				
					if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
						masterBucket[i] = tempAry[i]._source;
						masterBucket[i]._collection = tempAry[i]._index;
						masterBucket[i]._confidenceLevel = tempAry[i]._score * 100;
					}else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
						masterBucket[i] = tempAry[i].source;							
					}
				}
		return masterBucket;
	 },
 _BucketizeAndSuggestionResponse:function (resp) {
	var mainBucket = {};
	var masterBucket = new Array();
	var temp = resp.hits;
	var tempAry = temp.hits;	
			for(var i = 0;i< tempAry.length;i++){				
				if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
					masterBucket[i] = tempAry[i]._source;
					masterBucket[i]._collection = tempAry[i]._index;
					masterBucket[i]._confidenceLevel = tempAry[i]._score * 100;
				}else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
					masterBucket[i] = tempAry[i].source;							
				}
			}
	 
	mainBucket.mainData = masterBucket;
	mainBucket.didyoumeanArray = resp.suggest.didyoumean[0].options;
	return mainBucket;
 },
	_MultiAnalyzeAssignationUserSearch:function (requestObject, callbackMethod)
	 {
		 
		var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost+"/"});
		client.msearch(requestObject).then(function (resp) {
			var masterBucket = new Array();
			/* for(var i = 0; i< resp.responses.length; i++)
			{
				masterBucket[i] = ITS._BucketizeAssignationUserResponse(resp.responses[i].aggregations.prifeaturebucket.buckets);
			} */		
			
			callbackMethod(resp);
		}
		,function (error)
		{
			console.log(error);
		})
	 },
	 _GetConfViewDetails:function (collectioname,collectiotype, query_str,callBackFunction) {
		var surl = "";
		var res = 0;
		if(query_str)
			surl = iseConstants.elasticsearchHost+"/" + collectioname + "/" + collectiotype + "/" + "_search?q="+query_str;
		else
			surl = iseConstants.elasticsearchHost+"/" + collectioname + "/" + collectiotype + "/_search";
		
		$.support.cors = true;
		$.ajax({
			type: "POST",
			url: surl,
			dataType: 'json',
			async: false,
			crossDomain: true,
			success: function (responseText) {
				res = 1;
			  callBackFunction(responseText);
			},
			error: function (xhr) {

			}
		});

	},
 
  _PerformGet:function (requestObject, callbackMethod)
 {
	var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost+"/"});
	client.get(requestObject).then(function (resp) {
	
		if(requestObject.formatdata == "1")	
			callbackMethod(ITS._BucketizeResponse(resp));
		else
			callbackMethod(resp);
	}
	,function (error)
	{
		console.log(error);
	})
 }
 

	
}