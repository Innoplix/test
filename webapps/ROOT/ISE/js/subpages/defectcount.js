    var defectcount = {
	 //console.log("Starting of defect count page22222222222");
	//project:"",
	selectReleases:[],
	selectFeatures:[],
	selectPriorties:[],
	selectReleases1:[],
	qryStringForRelease:"*",
	qryStringForyears:"*",
	featureCount:"0",
	//elasticsearchHost:"http://10.98.11.18:9200",
	countString:"",
	lastValue1:"",
	typeNew:"",
	url:"",
	url1:"",
	url2:"",
	url3:"",
	type:"",
	//collectionName:sessionStorage.projname+"_defect_collection",

    /* Init function  */
      init: function()
      {
	  
		//$( '#cmb_Features' ).select2( 'val', "All" );
		//$( '#Cmb_priority' ).select2( 'val', "All" );

		if (jQuery().datepicker) {
		
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                orientation: "left",
                autoclose: true
            }); 
			};
	  
	  $('#Cmb_Releases').select2({
            placeholder: "Release",
            allowClear: true
        });
		
		$('#Cmb_priority').select2({
            placeholder: "Priority",
            allowClear: true
        });
		
		$('#cmb_Features').select2({
            placeholder: "Feature",
            allowClear: true
        });
		
		$("#releaseSelect").hide();
		//$('#dateSelect').removeClass('hide');
		
		var d = new Date();
		var year = d.getFullYear() - 3;
		var strtDt = d.getDate() +"-" + d.getMonth()+"-" + year;
		var endDt = d.getDate() +"-" + d.getMonth()+"-" + d.getFullYear(); 
		
		$("#startDate").val(strtDt);
		$("#endDate").val(endDt);
		
		$("#submitForm").click(function(event) {
				// kiran
				
				var predictionValue = 0;
				var predValue = document.getElementById('prediction').value.trim();
				console.log("predValue----"+predValue);
				
				if(document.getElementById('prediction').value.trim() != "" && document.getElementById('prediction').value != null && document.getElementById('prediction').value != undefined){
					console.log("predValue----IN IF ---:");
					predictionValue = document.getElementById('prediction').value;
					flag = true;
					defectcount.getSelectedValue();
				}
				else
					{
					alert("Please enter prediction value");
					console.log("predValue----IN ELSE ---:");
				}
				//unblockElementFunction("");
				
				
				if(startDate && endDate){
				console.log("datess startDate submit"+startDate);
				console.log("datess endDate submit"+endDate);
					var startDateSelect = new Date(startDate);
					var endDateSelect = new Date(endDate);
					if(startDateSelect>endDateSelect){
						alert("End Date not less than Start Date");
					}else{
						console.log("else condition");
						//defectcount.forcastDataByDates(startDate,endDate);
					}
				}
		});
		
		console.log("starting......")
		var selectedProject = localStorage.getItem('projectName');
		console.log("selectedProject......"+selectedProject);
		ISE.listTotalReleases("getReleases", "", selectedProject, false, defectcount._AllRelease);
		var data = '{"fileName":"DefectsFeatureQry","params":"","projectName":"' + defectcount.selectedProject + '","fromCache":"false"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken, data,defectcount._callBackFeatureDataArray);
		//var data1 = '{"fileName":"DefectsPriorityQry","params":"","projectName":"' + defectcount.selectedProject + '","fromCache":"false"}';
		//ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken, data1,defectcount._callBackPriorityDataArray);
		
		},
		
		getSelectedValue: function() {
			//var qryStringForyears = "*";
			//var collectionName = localStorage.getItem('projectName')+"_defect_collection";
			var collectionName = "defect_collection";
			var elasticsearchHost = "http://10.98.11.15:9200";
			//var qryStringForRelease="*";
			var todate =1435647260105;
			var fromdate=1277874479297;
			console.log("in get getSelectedValue 111111 method");
			
			// start of build/release select function
			if($("#releases").is(':checked')){
				$("#releaseSelect").show();
				$("#dateSelect").hide();
				defectcount.GetSelectedReleases();
				
				$("#cmb_Features option:selected").each(function() {
					console.log("priority value $$$ 117 --"+$(this).val())
					var featureValue = $(this).val();
					console.log("feature Value -- "+featureValue);
					if(featureValue == "All")
					{
						console.log("feature Value is -------122----ALL ");
						type = "defects_release_"+qryStringForyears;
						//type = "defect_features_"+qryStringForyears;
						featureCount = 10;
					}
					else{
						console.log("feature Value is -------125----"+featureValue );
						type = "defect_features_"+qryStringForyears;
						//type = "defects_release_"+qryStringForyears;
						featureCount = 10;
					}
						
				});
				
				/*if($("#cmb_Features option:selected"))
					{
					console.log("priority value $$$--"+$(this).val())
					//defectcount.selectPriorties.push($(this).val());
					
					console.log("Feature Selected");
					type = "defect_features"+qryStringForyears;
					}
					else{
					console.log("Feature is NOT selected");
					type = "defects_release_"+qryStringForyears;
				}*/
				//type = "defects_release_"+qryStringForyears;
				countString = ''
				//console.log(type);
				console.log("type--qryStringForyears--kiran--114:"+type);
				
				url ='';
				url = 'http://10.98.11.15:9090/DevTest/dashboard/index.html#/visualize/create?embed&type=histogram&indexPattern=projectName&_g=(time:(from:now-5y,mode:quick,to:now))&_a=(filters:!(),linked:!f,query:(query_string:(analyze_wildcard:!t,query:queryString)),vis:(aggs:!((id:\'1\',params:(),schema:metric,type:count),(id:\'2\',params:(field:release,order:desc,orderBy:\'1\',size:50),schema:segment,type:terms),(id:\'3\',params:(field:build,order:desc,orderBy:\'1\',size:50),schema:group,type:terms)),listeners:(),params:(addLegend:!t,addTooltip:!t,defaultYExtents:!f,mode:stacked,shareYAxis:!t),type:histogram))'  
	
			url = url.replace('queryString',"\'"+escape(qryStringForyears)+"\'");
			console.log("collectionName----kiran:"+collectionName);
			console.log("url----url:"+url);
			url = url.replace('projectName',collectionName);
			console.log("url----url--url---url:"+url);
			console.log("releases:"+qryStringForyears);
			var client = new elasticsearch.Client({"host" : elasticsearchHost});
			console.log("client----kiran:"+client);
			console.log("collectionName:"+collectionName);
			console.log("qryStringForyears:"+qryStringForyears);
			
			client.search({
					index:collectionName,
			
			  body:{
			  "size": 0,
			  "query": {
				"filtered": {
				  "query": {
					"query_string": {
					  "query": qryStringForyears,
					  "analyze_wildcard": true
					}
				  }
				}
			  },
			  "aggs": {
				"2": {
				  "terms": {
					"field": "release",
					"size": 50,
					"order": {
					  "_count": "desc"
					}
				  },
				  "aggs": {
					"3": {
					  "terms": {
						"field": "build",
						"size": 50,
						"order": {
						  "_count": "desc"
						}
					  },
					  "aggs": {
						"4": {
							"terms": {
								"field": "primary_feature",
								"size": 2,
								"order": {
									"_count": "desc"
								}
							}
						}
					}
					}
				  }
				}
			  }
			}
			
			}).then(function (resp) {
				console.log("resp-----"+resp);
				
				//document.getElementById('iframeid').src = '';
				//document.getElementById('iframeid').src = url;
				//document.getElementById('iframeid').style.display = "block";
				if(resp.aggregations != null  && resp.aggregations != undefined)
				{
					var tempDate = new Date();
					var tempDateStr = tempDate.getTime();
					var historyCount = 0;
					var dataArray = resp.aggregations[2]['buckets'];
					//console.log("resp.aggregations[2] -- kiran--205------"+resp.aggregations[1]);
					console.log("resp.aggregations[2] -- kiran--206-------"+resp.aggregations[2]);
					if(null !=dataArray && undefined != dataArray)
					{
						 countString = '';
						for(var d=0;d<dataArray.length;d++)
						{
							for(var r=0;r<dataArray[d][3]['buckets'].length;r++)
							{
							//var splitArray = dataArray[d][3]['buckets'][r]["key"].split("-");
//							var stringModified = dataArray[d]["key"]+"_"+dataArray[d][3]['buckets'][r]["key"]+"_"+dataArray[d][3]['buckets'][r]["doc_count"]
								for(var k=0;k<dataArray[d][3]['buckets'][r][4]['buckets'].length;k++) {
									//var stringModified = dataArray[d]["key"]+"_Build"+r+"_"+dataArray[d][3]['buckets'][r]["doc_count"];
									var stringModified = dataArray[d]["key"]+"_"+r+"_"+dataArray[d][3]['buckets'][r][4]['buckets'][k]["key"]+"_"+dataArray[d][3]['buckets'][r][4]['buckets'][k]["doc_count"];
									stringModified =stringModified+","+dataArray[d]["key"]+"_"+parseInt(r+1)+"_"+dataArray[d][3]['buckets'][r][4]['buckets'][k]["key"]+"_"+parseInt(dataArray[d][3]['buckets'][r][4]['buckets'][k]["doc_count"]+1);
									stringModified =stringModified+","+dataArray[d]["key"]+"_"+parseInt(r+2)+"_"+dataArray[d][3]['buckets'][r][4]['buckets'][k]["key"]+"_"+parseInt(dataArray[d][3]['buckets'][r][4]['buckets'][k]["doc_count"]);
									//lastValue1 = dataArray[d][3]['buckets'][r]["doc_count"];
									lastValue1 = dataArray[d][3]['buckets'][r][4]['buckets'][k]["doc_count"];
								
									console.log("stringModified -- kiran--218-------"+stringModified);
									console.log("lastValue1 -- kiran--219-------"+lastValue1);
									//console.log("stringModified"+stringModified)
									//if(r==0)
									//countString = stringModified
									//else
									countString = countString+","+stringModified
									historyCount++;
									historyCount++;
									historyCount++;
								}
							}
						}
						countString = countString.replace(",","")
						console.log("countString"+countString)
						
					}
					if(flag)
						{
							console.log("featureCount----279--"+featureCount);
							console.log("historyCount----280--"+historyCount);
							var selectedProject = localStorage.getItem('projectName');
							console.log("in IFFFFFFFFFFFFF LOOOOOOPPPPPP");
							if (historyCount > featureCount) {
							var predictVal = document.getElementById('prediction').value
							console.log("predictVal----"+predictVal);
							flag =false;
							//alert("It may take 1 minute, please waite.....");
							//countString = countString.replace('__','_');
							//alert(countString);
							type = type.replace(/"/g, " ");
							type = type.replace(/\(/g, " ");
							type = type.replace(/\)/g, " ");
							typeNew = type;
							var data = '{"defectscount":"'+countString+'","uniqueval":"'+type+'","predictionval":"'+predictVal+'","projectName": "'+selectedProject+'"}';
ISE_Ajax_Service.ajaxPostReq('ForecatsDefectRestFullService', 'json', localStorage.authtoken, data,defectcount._callbackForcastdataForBuilds);


						//alert(1);
							/*url1='';
							url1='http://10.98.11.18/DevTest/dashboard/index.html#/visualize/create?embed&_a=(filters:!(),linked:!f,query:(query_string:(analyze_wildcard:!t,query:\'model_name:%22MODELNAME%22\')),vis:(aggs:!((id:\'1\',params:(field:count),schema:metric,type:sum),(id:\'2\',params:(field:Builds,order:asc,orderAgg:(id:\'2-orderAgg\',params:(field:seq),schema:orderAgg,type:sum),orderBy:custom,size:2000),schema:segment,type:terms)),listeners:(),params:(addLegend:!t,addTooltip:!t,defaultYExtents:!f,shareYAxis:!t),type:line))&indexPattern=ise_mongo_demo1c_trainset_data&type=line&_g=(time:(from:now-5y,mode:quick,to:now))';
							url1 = url1.replace('MODELNAME',escape(type));
							console.log("URLLLLLLL----->"+url1);
							document.getElementById('iframeforecast').src = '';
							document.getElementById('iframeforecast').src = url1;
							document.getElementById('iframeforecast').style.display = "block";
							
							url2='';
							url2=
'http://10.98.11.18/DevTest/dashboard/index.html#/visualize/create?embed&_a=(filters:!(),linked:!f,query:(query_string:(analyze_wildcard:!t,query:\'(model_name:%22MODELNAME%22)%20AND%20(method:arima)\')),vis:(aggs:!((id:\'1\',params:(field:Point.Forecast),schema:metric,type:sum),(id:\'2\',params:(field:seq,order:asc,orderAgg:(id:\'2-orderAgg\',params:(field:seq),schema:orderAgg,type:sum),orderBy:custom,size:2000),schema:segment,type:terms),(id:\'3\',params:(field:Hi.80),schema:metric,type:sum),(id:\'4\',params:(field:Lo.80),schema:metric,type:sum)),listeners:(),params:(addLegend:!t,addTooltip:!t,defaultYExtents:!f,shareYAxis:!t),type:line))&indexPattern=ise_mongo_demo1d_testset_data&type=line&_g=(time:(from:now-5y,mode:quick,to:now))';
							url2 = url2.replace('MODELNAME',escape(type));
							document.getElementById('iframeAH').src = '';
							document.getElementById('iframeAH').src = url2;
							document.getElementById('iframeAH').style.display = "block";
							
							url3=url2.replace('arima','holts');
							document.getElementById('iframeH').src = '';
							document.getElementById('iframeH').src = url3;*/
							}
							else {alert("Selected historical data is too small for prediction");}
						}
				}
				
			})
				
			} // end of build/release selection 
			
			// start of date function
			if($("#year").is(':checked')){
				//var collectionName = localStorage.getItem('projectName')+"_defect_collection";
				var collectionName = "defect_collection";
				console.log("collectionName -- "+collectionName);
				//var qryStringForRelease="*";
				var elasticsearchHost = "http://10.98.11.15:9200";
				$("#dateSelect").show();
				$("#releaseSelect").hide();
				defectcount.OnTestcaseReleaseChange();
				
				$("#cmb_Features option:selected").each(function() {
					console.log("priority value $$$ 117 --"+$(this).val())
					var featureValue = $(this).val();
					console.log("feature Value -- "+featureValue);
					if(featureValue == "All")
					{
						console.log("feature Value is -------122----ALL ");
						type = "defects_years_"+qryStringForyears;
						featureCount = 10;
					}
					else{
						console.log("feature Value is -------125----"+featureValue );
						type = "defect_featureyears_"+qryStringForyears;
						featureCount = 10;
					}
						
				});
				
				
				//type = "defects_years_"+qryStringForyears;
				countString = ''
				console.log("type--->"+type);
				$("#iframeid").empty();
				url ='';
				url = 'http://10.98.11.15:9090/DevTest/dashboard/index.html#/visualize/create?embed&type=histogram&indexPattern=defect_collection&_g=(time:(from:fromdate,mode:absolute,to:todate))&_a=(filters:!(),linked:!f,query:(query_string:(analyze_wildcard:!t,query:queryString)),vis:(aggs:!((id:\'1\',params:(),schema:metric,type:count),(id:\'2\',params:(extended_bounds:(),field:date,interval:year,min_doc_count:1),schema:segment,type:date_histogram),(id:\'3\',params:(extended_bounds:(),field:date,interval:month,min_doc_count:1),schema:group,type:date_histogram)),listeners:(),params:(addLegend:!t,addTooltip:!t,defaultYExtents:!f,mode:stacked,shareYAxis:!t,spyPerPage:10),type:histogram))'
				var toDaterplVal = (new Date(todate).toISOString())
				console.log("toDaterplVal--->"+toDaterplVal);
				var fromDaterplVal = (new Date(fromdate).toISOString())
				console.log("toDaterplVal--->"+toDaterplVal);
				url = url.replace('queryString',"\'"+escape(qryStringForRelease)+"\'");
				url = url.replace('projectName',collectionName);
				url = url.replace('todate',"\'"+toDaterplVal+"\'");
				url = url.replace('fromdate',"\'"+fromDaterplVal+"\'");
				console.log("url--->"+url);
				//alert("year:"+qryStringForRelease);
				var client = new elasticsearch.Client({"host" : elasticsearchHost});
				console.log("client--->"+client);
				console.log("collectionName ---->>>>>"+collectionName);
				console.log("qryStringForRelease ---->>>>>"+qryStringForRelease);
				client.search({
					index:collectionName,
				body:
				{
								
				  "size": 0,
				  "query": {
					"filtered": {
					  "query": {
						"query_string": {
						  "analyze_wildcard": true,
						  "query": qryStringForRelease
						}
					  },
					  "filter": {
						"bool": {
						  "must": [
							{
							  "range": {
								"date": {
								  "gte": fromdate,
								  "lte": todate
								}
							  }
							}
						  ],
						  "must_not": []
						}
					  }
					}
				  },
				  "aggs": {
					"2": {
					  "date_histogram": {
						"field": "date",
						"interval": "1y",
						"pre_zone": "+05:30",
						"pre_zone_adjust_large_interval": true,
						"min_doc_count": 1,
						"extended_bounds": {
						  "min": 1262284200000,
						  "max": 1263407400000
						}
					  },
					  "aggs": {
						"3": {
						  "date_histogram": {
							"field": "date",
							"interval": "1M",
							"pre_zone": "+05:30",
							"pre_zone_adjust_large_interval": true,
							"min_doc_count": 1,
							"extended_bounds": {
							  "min": 1262284200000,
							  "max": 1263407400000
							}
						  },
						  "aggs": {
							"4": {
								"terms": {
									"field": "primary_feature",
									"size": 2,
									"order": {
										"_count": "desc"
									}
								}
							}
							}
						}
					  }
					}
				  }
				
				}
				}).then(function (resp) {
					console.log("resp in DATE ---->"+resp);
				var lastvalue;
				//document.getElementById('iframeid').src = '';
				//document.getElementById('iframeid').src = url;
				//document.getElementById('iframeid').style.display = "block";
				var startgDt1=""
				var endgDt1="";
				var startgDt="";
				var endgDt="";
				var historyCount=0;
				if(resp.aggregations != null  && resp.aggregations != undefined)
				{
					var dataArray = resp.aggregations[2]['buckets'];
					if(null !=dataArray && undefined != dataArray)
					{
						 countString = '';
						 
						for(var d=0;d<dataArray.length;d++)
						{
							for(var r=0;r<dataArray[d][3]['buckets'].length;r++)
							{
							
							for(var k=0;k<dataArray[d][3]['buckets'][r][4]['buckets'].length;k++) {
									/*var stringModified12 = dataArray[d]["key"]+"_"+r+"_"+dataArray[d][3]['buckets'][r][4]['buckets'][k]["key"]+"_"+dataArray[d][3]['buckets'][r][4]['buckets'][k]["doc_count"];
									console.log("stringModified---388---Kiran"+stringModified12);
									
									var lastValue12 = dataArray[d][3]['buckets'][r][4]['buckets'][k]["doc_count"];
									console.log("lastValue1---392---Kiran"+lastValue12);*/
							
							//old
									var splitArray = dataArray[d][3]['buckets'][r]["key_as_string"].split("-");
									console.log("splitArray--387-->"+splitArray);
									
									//var stringModified = splitArray[0]+"_"+splitArray[1]+"_"+dataArray[d][3]['buckets'][r]["doc_count"]+"_"+dataArray[d][3]['buckets'][r]["key"]
									var stringModified = splitArray[0]+"_"+splitArray[1]+"_"+dataArray[d][3]['buckets'][r][4]['buckets'][k]["key"]+"_"+dataArray[d][3]['buckets'][r][4]['buckets'][k]["doc_count"]+"_"+dataArray[d][3]['buckets'][r]["key"]
									//console.log("stringModified"+stringModified)
									lastvalue = stringModified;
									lastValue1=dataArray[d][3]['buckets'][r]["doc_count"];
									countString = countString+","+stringModified
									historyCount++;
									if(d==0)
										startgDt1 = dataArray[d][3]['buckets'][r]["key_as_string"];
									if(d==(dataArray.length-1))
										endgDt1 = dataArray[d][3]['buckets'][r]["key_as_string"];
							//old
								}
							}
						} 	
						
						var lastValueArray = lastvalue.split("_");
							lastValuemonth = lastValueArray[1];
							lastValueyear = lastValueArray[0]
							var nextDate;
							var  newValue =0;
							var data =document.getElementById('prediction').value
							var data1 = parseInt(data)
							for(var n=0; n<data1 ; n++)
							{
								if(parseInt(lastValueArray[1])<12)
								{
									if(n==0)
									{
									 newValue = parseInt(lastValueArray[1])+1;
									}
									else
									{
										newValue = newValue+1;
									}
									
									if(newValue <=12 )
									{
										nextDate = new Date(parseInt(lastValueyear),parseInt(newValue)-1);
										var nextDateStr = nextDate.getTime();
										countString = countString +","+lastValueyear+"_"+newValue.toString()+"_p_"+"0_"+nextDateStr;
									}
									else
									{
										var newyear = parseInt(lastValueyear)+1
										lastValueyear = newyear.toString();
										newValue = 1;
										nextDate = new Date(parseInt(lastValueyear),0);
										var nextDateStr = nextDate.getTime();
										countString = countString +","+newyear.toString()+"_1_"+"p_"+"0_"+nextDateStr;
									}
								}
								else
									{
										var newyear = parseInt(lastValueyear)+1
													lastValueyear = newyear.toString();
													lastValuemonth = 1;
													nextDate = new Date(parseInt(newyear),0);
													var nextDateStr = nextDate.getTime();
													countString = countString +","+newyear.toString()+"_1_"+"p_"+nextDateStr;
									}
									
									if(n==0)
										startgDt = nextDate.toISOString();
									if(n==(data1-1))
										endgDt = nextDate.toISOString();
						}
						console.log("countString"+countString)
					}
					if(flag)
					{
						var selectedProject = localStorage.getItem('projectName');
						if (historyCount > featureCount) {
						countString = countString.replace(",","")
						var predictVal = document.getElementById('prediction').value
							flag =false;
							//alert("It may take 1 minute, please waite.....");
							//countString = countString.replace('__','_');
							//alert(countString);
							type = type.replace(/"/g, " ");
							type = type.replace(/\(/g, " ");
							type = type.replace(/\)/g, " ");
							typeNew = type;
							//var xyz = foreCastDefects(countString,type,predictVal,projectName);
							var data = '{"defectscount":"'+countString+'","uniqueval":"'+type+'","predictionval":"'+predictVal+'","projectName": "'+selectedProject+'"}';
ISE_Ajax_Service.ajaxPostReq('ForecatsDefectRestFullService', 'json', localStorage.authtoken, data,defectcount._callbackForcastdataForBuilds);
							/*url1='';
							url1='http://10.98.11.18/DevTest/dashboard/index.html#/visualize/create?embed&_a=(filters:!(),linked:!f,query:(query_string:(analyze_wildcard:!t,query:\'model_name:%22MODELNAME%22\')),vis:(aggs:!((id:\'1\',params:(field:count),schema:metric,type:sum),(id:\'2\',params:(extended_bounds:(),field:TimeInterval,interval:auto,min_doc_count:1),schema:segment,type:date_histogram)),listeners:(),params:(addLegend:!t,addTooltip:!t,defaultYExtents:!f,shareYAxis:!t),type:line))&indexPattern=ise_mongo_demo1c_trainset_data&type=line&_g=(time:(from:\'gStart\',mode:absolute,to:\'gEnd\'))';
//							(from:now-5y,mode:quick,to:now))';
							url1 = url1.replace('MODELNAME',escape(type));
							console.log("URLLLLLLL----->"+url1);
							url1 = url1.replace('gStart',startgDt1);
							url1 = url1.replace('gEnd',endgDt1);
							document.getElementById('iframeforecast').src = '';
							document.getElementById('iframeforecast').src = url1;
							document.getElementById('iframeforecast').style.display = "block";
							
							url2='';
							url2=
'http://10.98.11.18/DevTest/dashboard/index.html#/visualize/create?embed&_a=(filters:!(),linked:!f,query:(query_string:(analyze_wildcard:!t,query:\'(model_name:%22MODELNAME%22)%20AND%20(method:arima)\')),vis:(aggs:!((id:\'1\',params:(field:Point.Forecast),schema:metric,type:sum),(id:\'2\',params:(extended_bounds:(),field:TimeInterval,interval:auto,min_doc_count:1),schema:segment,type:date_histogram),(id:\'3\',params:(field:Hi.80),schema:metric,type:sum),(id:\'4\',params:(field:Lo.80),schema:metric,type:sum)),listeners:(),params:(addLegend:!t,addTooltip:!t,defaultYExtents:!f,shareYAxis:!t),type:line))&indexPattern=ise_mongo_demo1d_testset_data&type=line&_g=(time:(from:\'gStart\',mode:absolute,to:\'gEnd\'))';
							url2 = url2.replace('MODELNAME',escape(type));
							url2 = url2.replace('gStart',startgDt);
							url2 = url2.replace('gEnd',endgDt);
							document.getElementById('iframeAH').src = '';
							document.getElementById('iframeAH').src = url2;
							document.getElementById('iframeAH').style.display = "block";
							
							url3=url2.replace('arima','holts');
							document.getElementById('iframeH').src = '';
							document.getElementById('iframeH').src = url3;*/
						}
						else {alert("Selected historical data is too small for prediction");}
					}
				}
				//getDataForPopup(lastvalue)
			})
			
			} // end of date function
				
			
		},
		
		getcheckboxValue: function(event) {
		
		   
			console.log("get all selected relaese method");
			console.log("in get selected release 222222222 method");
			defectcount.selectReleases=[];
			$("#Cmb_Releases option").each(function() {
			
				if ($(event).is(':checked')) {
                console.log("All Release value $$$--"+$(this).val())
				defectcount.selectReleases.push($(this).val());
				$( '#s2id_Cmb_Releases' ).select2( 'val', "All" );												
				}
				else{
				$( '#s2id_Cmb_Releases' ).select2( 'val', "" );
				}
            });
		},
		
		
		OnTestcaseReleaseChange: function() {
		
			//defectsDataArray = new Array();
			//testCasecountArray = new Array();
			//testCaseFeatureArray = new Array();
			
			defectcount.selectPriorties=[];
				$("#Cmb_priority option:selected").each(function() {
					console.log("priority value $$$--"+$(this).val())
					defectcount.selectPriorties.push($(this).val());
																	
				});
				
				defectcount.selectFeatures=[];
				$("#cmb_Features option:selected").each(function() {
					console.log("Features value $$$--"+$(this).val())
					defectcount.selectFeatures.push($(this).val());
																	
				});
				
				dataArr = new Array();
				var startDate11 = $("#startDate").val();
				console.log("startDate11---"+startDate11);
				var endDate11 = $("#endDate").val();
				console.log("endDate11---"+endDate11);
				
				var priority = defectcount.selectPriorties;
		
				var feature = defectcount.selectFeatures;
				
				if(startDate11=="" && endDate11!=""){
					alert("Please enter start date");
					}else if(endDate11=="" && startDate11!=""){
					alert("Please enter end date");
					}else if(endDate11=="" && startDate11=="")
					{
						if(priority == 'All' && feature == 'All')
						{
									qryStringForyears = "*"
									qryStringForRelease= "*"
						}
						else if(priority != 'All' && feature == 'All')
						{
									qryStringForyears = '(priority:"'+priority+'")';
									qryStringForRelease = '(priority:"'+priority+'")';
						}
						else if(priority == 'All' && feature != 'All')
						{
									qryStringForyears = '(primary_feature:"'+feature+'")';
									qryStringForRelease = '(primary_feature:"'+feature+'")';
						}
						else if(priority != 'All' && feature != 'All')
						{
									qryStringForyears = '(priority:"'+priority+'") AND (primary_feature:"'+feature+'")';
									qryStringForRelease = '(priority:"'+priority+'") AND (primary_feature:"'+feature+'")';
						}
					}
					else
					{
						var d = new Date(startDate11);
						var n = d.getTime();
						var d1 = new Date(endDate11);
						var n1 = d1.getTime();
						todate = n1;
						fromdate =n;
						if(priority == 'All' && feature == 'All')
						{
							qryStringForyears = n+"_"+n1;
							qryStringForRelease = "*"
						}
						else if(priority != 'All' && feature == 'All')
						{
							qryStringForyears = n+"_"+n1+"_"+"priority:"+priority
							qryStringForRelease = '(priority:"'+priority+'")';
						}
						else if(priority == 'All' && feature != 'All')
						{
							qryStringForyears = n+"_"+n1+"_"+"primary_feature:"+feature
							qryStringForRelease = '(primary_feature:"'+feature+'")';
						}
						else if(priority != 'All' && feature != 'All')
						{
									qryStringForyears = n+"_"+n1+"_priority:"+priority+"_primary_feature:"+feature
									qryStringForRelease = '(priority:"'+priority+'") AND (primary_feature:"'+feature+'")';
						}
						}
						console.log("qryStringForyears in 11111111111-----" +qryStringForyears);
		
		
		},
		
		GetSelectedReleases: function() {
			
			console.log("in get selected release 222222222 method");
			defectcount.selectReleases=[];
			defectcount.selectReleases1=[];
			
			/*$("#Cmb_Releases option").each(function() {
                console.log("Release value $$$--"+$(this).val())
				defectcount.selectReleases.push($(this).val());
																
            });*/
			
			$("#Cmb_Releases option:selected").each(function() {
                console.log("Release value $$$--"+$(this).val());
				var releaseValue = $(this).val();
				//releaseValue.replace("ALL" ,"")
				if (releaseValue == "All"){
					console.log("in ALLLLLLLL");
					$("#Cmb_Releases option").each(function() {
					console.log("Release value $$$--"+$(this).val())
					defectcount.selectReleases.push($(this).val());
																
					});
				}
				else{
					console.log("in NOTTTTTTTTTTT ALLLLLLLL");
					defectcount.selectReleases.push($(this).val());
				}
																
            });

		
			try {
			
				var SelectedReleasesArray = defectcount.selectReleases;
				console.log("SelectedReleasesArray---"+SelectedReleasesArray);
				console.log("SelectedReleasesArray-length--"+SelectedReleasesArray.length);
				console.log("SelectedReleasesArray-121312--"+defectcount.selectReleases);
				
				defectcount.selectPriorties=[];
				$("#Cmb_priority option:selected").each(function() {
					console.log("priority value $$$--"+$(this).val())
					defectcount.selectPriorties.push($(this).val());
																	
				});
				
				defectcount.selectFeatures=[];
				$("#cmb_Features option:selected").each(function() {
					console.log("Features value $$$--"+$(this).val())
					defectcount.selectFeatures.push($(this).val());
																	
				});
				
				//var val = document.getElementById("cmb_priority").value;
				var val = defectcount.selectPriorties;
				var releaseString='' ;
				//var val1 = document.getElementById("cmb_Features").value;
				var val1 = defectcount.selectFeatures;
				console.log("priority values ****--"+val);
				console.log("Feature values ****--"+val1);
				if(SelectedReleasesArray.length >0)
				{
					for(var r=0; r<SelectedReleasesArray.length;r++)
						{
							releaseString = releaseString + 'release:"'+SelectedReleasesArray[r] + '" '
						}
						
						releaseString = "("+releaseString+")";
				}
			
				if((SelectedReleasesArray.length ==0 && val== 'All' &&  val1 == 'All' ) || (document.getElementById('selectAll').checked && val== 'All' &&  val1 == 'All') )
				{
					qryStringForyears = '*'
					
				}
				else if(SelectedReleasesArray.length >0 &&  val1 != 'All' && val != 'All')
				{
					qryStringForyears = releaseString + ' AND (priority:"'+val+'") AND (primary_feature:"'+val1 +'")'
				}
				
				else if(SelectedReleasesArray.length >0 && val1 == 'All' && val!='All')
				{
					qryStringForyears =  releaseString + ' AND (priority:"'+val+'")';
				}
				
				else if(SelectedReleasesArray.length >0 && val == 'All'&&  val1!='All')
				{
					qryStringForyears = releaseString+' AND (primary_feature:"'+val1+'")';
				}
				else if(SelectedReleasesArray.length >0 && val == 'All'&&  val1=='All')
				{
					qryStringForyears = releaseString;
				}
				else if(SelectedReleasesArray.length >0 && val == 'All'&&  val1!='All')
				{
					qryStringForyears = '(primary_feature:"'+val1+'")';
				}
				else if(SelectedReleasesArray.length ==0 && val != 'All'&&  val1=='All')
				{
					qryStringForyears =  '(priority:"'+val+'")';
				}
				
				else if(SelectedReleasesArray.length ==0 && val != 'All'&&  val1!='All')
				{
					qryStringForyears = '(priority:"'+val+'") AND (primary_feature:"'+val1+'")';
				}
				else if(SelectedReleasesArray.length ==0 && val == 'All'&&  val1!='All')
				{
					qryStringForyears = '(primary_feature:"'+val1+'")';
				}
			
				console.log('qryStringForyears in 222222222' + qryStringForyears)
			//getSelectedValue();
		}
		catch (e) {
			console.log("GetSelectedReleases : " + e);
		}
		},
		
		forcastDataByDates: function(startDate, endDate) {
			var requestObject = new Object();
            requestObject.collectionName = "defect_collection";
			requestObject.fromInputDate = startDate;
			requestObject.fromOutputDate = endDate;
			requestObject.maxResults = 15;
            ISE.getSearchResultsByDateRange(requestObject, defectcount._receivedSearchResults);
		},
		
		_receivedSearchResults: function(dataObj) {
			var table = $('#sample_41');
			$("#tableBody").empty();
			$.getJSON("json/DynamicTabArrayLoc.json", function(data) {
                $.each(data, function(key, item) {

                    defectcount._getTableHeaderLables(item[0].defects.Details.fields);
                    $('input[type="checkbox"]', '#sample_4_column_toggler').change(function () {

                                  var iCol = parseInt($(this).attr("data-column"));



                        if (!$(this).is(':checked')) {
                             
                              $('td:nth-child('+iCol+'),th:nth-child('+iCol+')').hide() 
                            }
                            else
                            {
                               $('td:nth-child('+iCol+'),th:nth-child('+iCol+')').show() 
                            }    

                    });

                    var newRowContent = '';

                    for (var i = 0; i < dataObj.length; i++) {
                        newRowContent = '<tr>';
                        for (var j = 0; j < item[0].defects.Details.fields.length; j++) {



                            switch (item[0].defects.Details.fields[j].SourceName) {

                                case "_id":

                                    newRowContent += '<td id="defectIdVal'+i+'" value="' + dataObj[i]._id +'">'+ dataObj[i]._id+ '</td>';

                                    break;
								
								case "primary_feature":
									if (dataObj[i].primary_feature != undefined) {
										newRowContent += '<td id="featureIdVal'+i+'" value="'+ dataObj[i].primary_feature+ '">'+dataObj[i].primary_feature + '</td>';
									}
									 else {
                                        newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
                                    }
                                 break;     
								
								case "date":
									if(dataObj[i].date != undefined){
                                    newRowContent += '<td>' + dataObj[i].date + '</td>';
									}else {
                                        newRowContent += '<td>N.A</td>';
                                    }
                                  break; 
									
								case "severity":
									
									if(dataObj[i].severity != undefined){
                                    newRowContent += '<td>' + dataObj[i].severity + '</td>';
									}else {
                                        newRowContent += '<td>N.A</td>';
                                    }
									
								break;
								
								case "priority":
									
									if(dataObj[i].priority != undefined){
                                    newRowContent += '<td>' + dataObj[i].priority + '</td>';
									}else {
                                        newRowContent += '<td>N.A</td>';
                                    }
									
								break;
						
								case "internaldefect":
									if(dataObj[i].req_type != undefined){
									
										if(dataObj[i].internaldefect == "1"){
											newRowContent += '<td>' + "Internal" + '</td>';
										}else{
											newRowContent += '<td>' + "External" + '</td>';
										}
									}
									else{
									  newRowContent += '<td>N.A</td>';
									}
                                    break;
									
									

							   case "title":
                                    if (dataObj[i].highlight != undefined || dataObj[i].highlight != null) {
                                        if (undefined != dataObj[i].highlight['title'] && dataObj[i].highlight['title'] != null) {
                                            var title = ''
                                            for (var n = 0; n < dataObj[i].highlight['title'].length; n++) {
                                                title = title + " " + dataObj[i].highlight['title'][n];
                                            }

                                            newRowContent += '<td>' + title + '</td>';
                                        } else {
                                            newRowContent += '<td>' + dataObj[i].title + '</td>';

                                        }
                                    } else {
                                        newRowContent += '<td>' + dataObj[i].title + '</td>';
                                    }
                                    break;
								
									case "":
									
									newRowContent += '<td ><a class="scrolling"  id="'+dataObj[i]._id+'&#&'+dataObj[i].primary_feature+'" name="FeatureDefectCB123" type="button" value="'+dataObj[i]._id+'" onclick="defectcount._onView(this);">' + "view" + '</a></td>';								
									break;

                              

                                default:
								
								
                                    break;
                            }
                        }

                        newRowContent += '</tr>';

                        $('#tableBody').last().append(newRowContent);
                    }

                     }); 
            
            });

         


            $('#searchResultsTable').removeClass("hide");
             ISEUtils.portletUnblocking("pageContainer");


        },
		
		
		
		_getTableHeaderLables: function(headerObj) {

              $('#sample_4_column_toggler').empty();
          for(var i=0;i<headerObj.length;i++){

            var colunmnID = i+1;

            if(i<5)
            {
            $('#sample_4_column_toggler').append('<label><input type="checkbox" name="column" checked="true" data-column='+colunmnID+'>'+ headerObj[i].displayName + '</label>');
              }     
           else
          {
             $('#sample_4_column_toggler').append('<label><input type="checkbox" name="column"  data-column='+colunmnID+'>'+ headerObj[i].displayName + '</label>');
               break;

          }
          }

      

            $('#defectIDHeader').text(headerObj[0].displayName);                     
			$('#featureHeader').text(headerObj[1].displayName);
            $('#dateHeader').text(headerObj[2].displayName);
			$('#severityHeader').text(headerObj[3].displayName);
			$('#priorityHeader').text(headerObj[4].displayName);
			$('#defectyypeHeader').text(headerObj[5].displayName);
			$('#titleHeader').text(headerObj[6].displayName);
				$('#viewHeader').text(headerObj[7].displayName);
           },
		
		
		_AllRelease: function(data) {
			console.log("data--1010->"+data);
			var selectFeatureData = $('#Cmb_Releases');
			var newOptionContent = '';
			var newOptionContentAll ='<option value="All"> All </option>'
			$( '#Cmb_Releases' ).select2( 'val', "All" );
			selectFeatureData.append(newOptionContentAll);
			for(var i=0; i<data.length; i++) {
				var fData = (data[i]).release;
				console.log("fData--1018->"+fData);
				newOptionContent = '<option value="' 
				newOptionContent += fData + '">'+fData + '</option>';
				selectFeatureData.last().append(newOptionContent);
			
			}
		},
		
		_callBackFeatureDataArray:function(featuredata){
			for(var i=0; i<featuredata.length; i++) {
				//console.log("-----features---------"+featuredata[i].primary_feature);
				}
			
			var selectFeatureData = $('#cmb_Features');
			var newOptionContent = '';
			var newOptionContentAll ='<option value="All"> All </option>'
			$( '#cmb_Features' ).select2( 'val', "All" );
			selectFeatureData.append(newOptionContentAll);
			for(var i=0; i<featuredata.length; i++) {
				var fData = featuredata[i].primary_feature;
				newOptionContent = '<option value="' 
				newOptionContent += fData + '">'+fData + '</option>';
				selectFeatureData.last().append(newOptionContent);
			
			}
			var data1 = '{"fileName":"DefectsPriorityQry","params":"","projectName":"' + defectcount.selectedProject + '","fromCache":"false"}';
			ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken, data1,defectcount._callBackPriorityDataArray);
		
		},
	  
	  _callBackPriorityDataArray:function(prioritydata){
			console.log("starting _callBackPriorityDataArray function***********")
			var selectFeatureData = $('#Cmb_priority');
			var newOptionContent = '';
			var newOptionContentAll ='<option value="All"> All </option>'
			$( '#Cmb_priority' ).select2( 'val', "All" );
			selectFeatureData.append(newOptionContentAll);
			for(var i=0; i<prioritydata.length; i++) {
				var fData = prioritydata[i].priority;
				newOptionContent = '<option value="' 
				newOptionContent += fData + '">'+fData + '</option>';
				selectFeatureData.last().append(newOptionContent);
			
			}
		},
		
		_callbackForcastdataForBuilds:function(data)
		{
							console.log("type--1082--->"+type);
							url1='';
							url1='http://10.98.11.15:9090/DevTest/dashboard/index.html#/visualize/create?embed&_a=(filters:!(),linked:!f,query:(query_string:(analyze_wildcard:!t,query:\'model_name:%22MODELNAME%22\')),vis:(aggs:!((id:\'1\',params:(field:count),schema:metric,type:sum),(id:\'2\',params:(field:Builds,order:asc,orderAgg:(id:\'2-orderAgg\',params:(field:seq),schema:orderAgg,type:sum),orderBy:custom,size:2000),schema:segment,type:terms)),listeners:(),params:(addLegend:!t,addTooltip:!t,defaultYExtents:!f,shareYAxis:!t),type:line))&indexPattern=demoproj_trainset_data&type=line&_g=(time:(from:now-5y,mode:quick,to:now))';
							url1 = url1.replace('MODELNAME',escape(type));
							console.log("URLLLLLLL----->"+url1);
							document.getElementById('iframeforecast').src = '';
							document.getElementById('iframeforecast').src = url1;
							document.getElementById('iframeforecast').style.display = "block";
							
							url2='';
							url2=
'http://10.98.11.15:9090/DevTest/dashboard/index.html#/visualize/create?embed&_a=(filters:!(),linked:!f,query:(query_string:(analyze_wildcard:!t,query:\'(model_name:%22MODELNAME%22)%20AND%20(method:arima)\')),vis:(aggs:!((id:\'1\',params:(field:Point.Forecast),schema:metric,type:sum),(id:\'2\',params:(field:seq,order:asc,orderAgg:(id:\'2-orderAgg\',params:(field:seq),schema:orderAgg,type:sum),orderBy:custom,size:2000),schema:segment,type:terms),(id:\'3\',params:(field:Hi.80),schema:metric,type:sum),(id:\'4\',params:(field:Lo.80),schema:metric,type:sum)),listeners:(),params:(addLegend:!t,addTooltip:!t,defaultYExtents:!f,shareYAxis:!t),type:line))&indexPattern=demoproj_testset_data&type=line&_g=(time:(from:now-5y,mode:quick,to:now))';
							url2 = url2.replace('MODELNAME',escape(type));
							document.getElementById('iframeAH').src = '';
							document.getElementById('iframeAH').src = url2;
							document.getElementById('iframeAH').style.display = "block";
							
							url3=url2.replace('arima','holts');
							document.getElementById('iframeH').src = '';
							document.getElementById('iframeH').src = url3;
		},
		
		_callbackForcastdataForYears:function(data)
			{
							url1='';
							url1='http://10.98.11.18/DevTest/dashboard/index.html#/visualize/create?embed&_a=(filters:!(),linked:!f,query:(query_string:(analyze_wildcard:!t,query:\'model_name:%22MODELNAME%22\')),vis:(aggs:!((id:\'1\',params:(field:count),schema:metric,type:sum),(id:\'2\',params:(extended_bounds:(),field:TimeInterval,interval:auto,min_doc_count:1),schema:segment,type:date_histogram)),listeners:(),params:(addLegend:!t,addTooltip:!t,defaultYExtents:!f,shareYAxis:!t),type:line))&indexPattern=demoproj_trainset_data&type=line&_g=(time:(from:\'gStart\',mode:absolute,to:\'gEnd\'))';
//							(from:now-5y,mode:quick,to:now))';
							console.log("type--1108--->"+type);
							url1 = url1.replace('MODELNAME',escape(type));
							console.log("URLLLLLLL----->"+url1);
							url1 = url1.replace('gStart',startgDt1);
							url1 = url1.replace('gEnd',endgDt1);
							document.getElementById('iframeforecast').src = '';
							document.getElementById('iframeforecast').src = url1;
							document.getElementById('iframeforecast').style.display = "block";
							
							url2='';
							url2=
'http://10.98.11.18/DevTest/dashboard/index.html#/visualize/create?embed&_a=(filters:!(),linked:!f,query:(query_string:(analyze_wildcard:!t,query:\'(model_name:%22MODELNAME%22)%20AND%20(method:arima)\')),vis:(aggs:!((id:\'1\',params:(field:Point.Forecast),schema:metric,type:sum),(id:\'2\',params:(extended_bounds:(),field:TimeInterval,interval:auto,min_doc_count:1),schema:segment,type:date_histogram),(id:\'3\',params:(field:Hi.80),schema:metric,type:sum),(id:\'4\',params:(field:Lo.80),schema:metric,type:sum)),listeners:(),params:(addLegend:!t,addTooltip:!t,defaultYExtents:!f,shareYAxis:!t),type:line))&indexPattern=demoproj_testset_data&type=line&_g=(time:(from:\'gStart\',mode:absolute,to:\'gEnd\'))';
							url2 = url2.replace('MODELNAME',escape(type));
							url2 = url2.replace('gStart',startgDt);
							url2 = url2.replace('gEnd',endgDt);
							document.getElementById('iframeAH').src = '';
							document.getElementById('iframeAH').src = url2;
							document.getElementById('iframeAH').style.display = "block";
							
							url3=url2.replace('arima','holts');
							document.getElementById('iframeH').src = '';
							document.getElementById('iframeH').src = url3;
		}
	  
};
 