/*-------------------------------------------------------------------------
 * ISE Seacrh API
 * Author: SURESH 
 *
 * DEPENDENCIES
 *  elasticsearch.js
 *  callBackFunction should be difined in local client js, which would get the results object
 * Ex.
 * callBackFunction(responseObject) {
 *  //responseObject has the results or error message
 * }
 *  USAGE:
 *  getSearchResults(requestObject,callBackFunction)
 
 * requestObject is a JSON object, expecting the below inputs
 *  requestObject.collectionName (Manndatory) ---its the collection name to search
 *  requestObject.serachType ---can be more_like_this/generic ...?
 *  requestObject.searchString (Manndatory) --- seacth text
 *  requestObject.filters --- seacth text
 *  requestObject.maxResults --- number of max results to return
 *  requestObject.??
 *  requestObject.??
 *  
 *
 *  
 *-------------------------------------------------------------------------*/

 //this needs to be moved to config json
 var elasticsearchHost	= "http://10.98.11.18:9200";


function getSearchResults(requestObject,callBackFunction) {
	if(!requestObject) {
		callBackFunction(null); // need to write error object here
		return;
	}
	//need to write other error checks
	var masterBucket = new Array();
    var client = new elasticsearch.Client({"host" : elasticsearchHost});
				client.search({
					index: requestObject.collectionName ,
					size: requestObject.maxResults, //15
					body: {
						
						"highlight": {
					  // "require_field_match": true,
							
							"pre_tags" : ["<span style='background-color:YELLOW'>"],
							"post_tags" : ["</span>"],
					
							
							"fields": {
                //"no_match_size": 150},
				"description":{},
				"title":{},
							//"description":{},
							//"primary_feature":{}

							}
						  },
						"query": {
						  "bool": {
							 "should": [
									 {
										"more_like_this" : 
										{
										//"fields" : ["title", "description"],
										"like_text" : requestObject.searchString, //searchString,
										"min_term_freq" : 1,
										"max_query_terms" : 25,
										"boost" : 1,
										"min_doc_freq" :1,
										"min_word_len" :0,
										"max_word_len" :0,
										"analyzer" :"stop"
										
									}
									}	
							 ]
						  
						}

				 }
					 
				 }
				 
				}).then(function (resp) {
					console.log( resp);
					var temp = resp.hits;
					//console.log("temp"+temp);
					var tempAry = temp.hits;
					//console.log(tempAry[i].getHighlightFields())
					for(var i = 0;i< tempAry.length;i++){

						if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
						 
							masterBucket[i] = tempAry[i]._source;
						}else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
						 
							masterBucket[i] = tempAry[i].source;
						}
						
					}
					
										
					datArr = processDefectsDataObject_ElasticSearch(masterBucket,tempAry);
					callBackFunction(datArr);
				});
}

function processDefectsDataObject_ElasticSearch(defectsidArr,tempAry) {
			var defectsDataArray = new Array();
			for (var i = 0; i < defectsidArr.length; i++) {
					var eachObj = new Object();
					eachObj.DefectID = defectsidArr[i]._id;
					eachObj.Link = defectsidArr[i]._id;
					eachObj.Similarity ='90';
					//eachObj.Title = defectsidArr[i].title;
					eachObj.Release = defectsidArr[i].release;
					eachObj.ReleaseId = defectsidArr[i].release;
					eachObj.Build = "";
					//eachObj.Description = defectsidArr[i].description;
					if(defectsidArr[i].status != undefined){
						
						eachObj.Status = defectsidArr[i].status;
					}else{
					
						eachObj.Status = 'N.A'
					}
					
					if(defectsidArr[i].product != undefined){
						
						eachObj.Product = defectsidArr[i].product;
					}else{
					
						eachObj.Product = 'N.A'
					}
					
					eachObj.FeatureName = defectsidArr[i].feature;
					eachObj.FeatureName = defectsidArr[i].feature;
					eachObj.FileName = defectsidArr[i].file;
					var indx = -1;
					var indx1 = -1;
						
					if (null != defectsidArr[i].file && defectsidArr[i].file.length > 0)
						eachObj.IsEnabled = true;
					else
						eachObj.IsEnabled = false;
						if(tempAry[i].highlight != undefined || tempAry[i].highlight  != null)
						{
							var frags =''
							if(undefined !=tempAry[i].highlight['description'] && tempAry[i].highlight['description'] !=null)
							{
								for (var n = 0; n < tempAry[i].highlight['description'].length; n++) {
									frags =frags+" "+ tempAry[i].highlight['description'][n];
								}
								eachObj.Description = frags;
							}
							else
							{
								eachObj.Description = defectsidArr[i].description;								

							}
							if(undefined !=tempAry[i].highlight['title'] && tempAry[i].highlight['title'] !=null)
							{
								var  title= ''
								for (var n = 0; n < tempAry[i].highlight['title'].length; n++) {
									title =title+" "+ tempAry[i].highlight['title'][n];
								}
								eachObj.Title = title;
							}
							
							else
							{
								eachObj.Title = defectsidArr[i].title;
							
							}
							
						}
						else
						{
							eachObj.Description = defectsidArr[i].description;
							eachObj.Title = defectsidArr[i].title;
						}
				    eachObj.Priority = defectsidArr[i].priority;
					eachObj.Severity = defectsidArr[i].severity;
					eachObj.PrimaryFeature = defectsidArr[i].primary_feature;
					eachObj.SecondaryFeature = defectsidArr[i].secondary_feature;

					defectsDataArray.push(eachObj);
                          
                   
            }
			
			return defectsDataArray;
}
