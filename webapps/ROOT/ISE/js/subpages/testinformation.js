 var testinformation = {
		files:[],
		fileNames:[],
		fileCRCollection: new Array(),
		crs_Arry: [],
		testcaseArr:[],
	
	 init: function()
		{
			console.log("starting in DEFECT TEST INFORMATION PAGE......");
			var selectedProject = localStorage.getItem('projectName');
			console.log("selectedProject......"+selectedProject);
			//$('#searchID').on('change', testinformation._similarSearchIdKeyUpFunc);			
			$("#submitForm").click(function(event) {
				var criValue = document.getElementById('searchID').value.trim();	
			testinformation._getCRIValues(criValue);
			});
		},
		
		// getting CRI values
		_getCRIValues(criValue){
		var crList = [];
		var selectedProject = localStorage.getItem('projectName');
		var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
		client.search({
						  index: "defect_collection",
						  type:selectedProject,
						  body: {       "fields" : ["_id"],
										"query": { "filtered": {   "query": {                                    
										"match_all": {}										
										},"filter" : {
											"query" : {
												"query_string" : {
													"query" : "cr_id:"+criValue+""
												}
											}
										}                                                                                                
									}	                            
								} 
							}
            }).then(function (resp) {
			var crHitsCount = resp.hits.hits;
			for(var k=0;k<crHitsCount.length;k++){
				var crValue = crHitsCount[k]._id;
				crList.push(crHitsCount[k]._id);
			}
			testinformation._showFiles(crList);
			},function (error) {console.log(error);callBackFunction([])} );
			},
			
			// getting Files related to CRI's
			_showFiles(crList){
				var selectedProject = localStorage.getItem('projectName');
				var crFileData="";
				var finalCRID = "cr_id:";
				var cr_id ="";
				for(var m=0;m<crList.length;m++){
				finalCRID = finalCRID +'"'+crList[m]+'"'+" "+"cr_id:";
				}
				cr_id = finalCRID.slice(0,-7).trim();
				var sString =cr_id;
				var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
				client.search({
				index: "defect_collection",
				type:selectedProject,
					body: {   
								"fields" : ["file"],
								"query": {
									"filtered": {
										"query": {
												"match_all": {}
									},"filter" : {
										"query" : {
										"query_string" : {
											"query" : sString,
											"default_operator":"OR"
												}
											}
										}
									}
								}
							}
					}).then(function (resp) {
					var fileHitsCount = resp.hits.hits;
					for(var k=0;k<fileHitsCount.length;k++){
						if(fileHitsCount[k].hasOwnProperty('fields')){
							var files_Arry = fileHitsCount[k].fields.file;
							var filesData = JSON.stringify(files_Arry);
							var stringData = filesData.substring(3, filesData.length-3);
							
							crFileData = crFileData+","+stringData;
							if( crFileData.charAt( 0 ) === ',' )
							crFileData = crFileData.slice( 1 );
							crFileData = crFileData.trim();
							}
					}
					var fileAry = crFileData.split(",");
					var fileSplitAry = crFileData.split(",");
					var splitFiles = fileSplitAry.map(function(e){return e.trim();});
					var finalFiles = _.unique(splitFiles);
					testinformation._showCRValues(finalFiles);
					},function (error) {console.log(error);callBackFunction([])} );
				},
			

				// getting CR related to Files
				_showCRValues(fileNames){
					var  crFileTcArr=[];
					var eachObj = new Object();
					var crValues = [];
					var crValues1 = [];
					var crValues2 = [];
					var finalCR = "fileslist:";
					var cd_id_Value ="";
					var selectedProject = localStorage.getItem('projectName');
					for(var m=0;m<fileNames.length;m++){
						
						finalCR = finalCR +'"'+fileNames[m].trim()+'"'+" "+"fileslist:";
						cd_id_Value = finalCR.slice(0,-11).trim();
					
					}
					var finalCrQry = cd_id_Value;
					var finalQry = finalCrQry.trim();
					var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
					client.search({
								  index: "defect_files_collection",
							  type:selectedProject,
							  body: {      
										"query": {
											"filtered": {
											"query": {
											"match_all": {}
											},"filter" : {
										"query" : {
										"query_string" : {
												"query" : finalCrQry,
												"default_operator":"OR"
												}
											}
										}
									}
								},"size":1000
							}
						}).then(function (resp) {
								var crValueForFile = resp.hits.hits;
								var stringDataForCR = JSON.stringify(crValueForFile);
								var crArr = new Array();
								for(var k=0;k<crValueForFile.length;k++){
									crValues1.push(crValueForFile[k]._source.fileslist);
								}
								
								testinformation.fileCRCollection = [];
								testinformation.crs_Arry.length = 0;
								for(var k=0;k<fileNames.length;k++){
									crArr.length = 0;
									for(var m=0;m<crValues1.length;m++){
										var fdata = JSON.stringify(crValues1[m]);
										if(fdata.indexOf(fileNames[k].trim()) > -1){
											crValues2.push(JSON.stringify(crValueForFile[m]._source.link.split(".",1)));
											var jsonValue  = JSON.stringify(crValueForFile[m]._source.link.split(".",1));
											var jsonAfterSplit = jsonValue.replace(/[[\]]/g,'');
											var finalCrid = jsonAfterSplit.replace(/"/g,'');
											crArr.push(finalCrid);
										}
										else{
										//console.log(" NO CR for --"+fileNames[k]+"---------");
										}
									}
									var crArr1 = new Array();
									for(var i=0;i<crArr.length;i++) {
										crArr1.push(crArr[i]);
										testinformation.crs_Arry.push(crArr[i]);
									}
									eachObj={};
									eachObj.fileName = fileNames[k];
									eachObj.CRsArr = crArr1;
									testinformation.fileCRCollection.push(eachObj);
								}
								//console.log("---------243----"+testinformation.crs_Arry);
								testinformation._CRValuesResults();
							});
				},	
				
			// getting the Testcases for the associated CR's
			_CRValuesResults: function() {
				var crValueAry1 = testinformation.crs_Arry;
				var tcArry=[];	
				var finalTC = "_id:";
				var tc_id_Value ="";
				var selectedProject = localStorage.getItem('projectName');
				for(var m=0;m<crValueAry1.length;m++) {
					finalTC = finalTC +'"'+crValueAry1[m]+'"'+" "+"_id:";
					tc_id_Value = finalTC.slice(0,-5);
				}

				var TcQry = tc_id_Value;
				var finalTcQry = TcQry;
				var selectedProject = localStorage.getItem('projectName');
				var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
				client.search({
						index: "defect_collection",
						type:selectedProject,
						body: {      
								"query": { "filtered": {   "query": {                                    
								"match_all": {}										
								},"filter" : {
									"query" : {
										"query_string" : {
											"query" :finalTcQry,
											"default_operator":"OR"
										}
									}
								}                                                                                                
							}	                            
						},"size":1000 
					}
				}).then(function (resp) {
				
					var testcaseAry = new Array();
					//testinformation.tcArr1.length = 0;
					var tcId = resp.hits.hits;
					
					var counter=0;
					for(var k=0;k<tcId.length;k++){
						if(tcId[k]._source.hasOwnProperty('testcases')){
							 var obj = {};
							 var jsonValue  = JSON.stringify(tcId[k]._source._id.split(".",1));
							 var jsonAfterSplit = jsonValue.replace(/[[\]]/g,'');
							 obj.crid = jsonAfterSplit.replace(/"/g,'');
							 obj.testcase = tcId[k]._source.testcases[0].test_case_id;
							tcArry.push(obj);		
						}		
						
					}
					testinformation.testcaseArr = tcArry;
					testinformation._displayData();
				});
			
			},
			
			// Final Result ...Displaying the table...
			_displayData: function() {
					var htmltodisplay="<table class='table table-bordered table-hover'><thead><tr class='active'><th>File Name</th><th>Associated CR's </th><th>Associated TestCase</th></tr></thead><tbody>";
					$("#testinfor_restable").empty();
				
					if(testinformation.fileCRCollection.length>1){
					for(var i=0;i<testinformation.fileCRCollection.length;i++) {
						console.log("-------326-------"+testinformation.fileCRCollection[i].CRsArr.length);
							for(var j=0;j<testinformation.fileCRCollection[i].CRsArr.length;j++) {
								
								var tc_ids = _.where(testinformation.testcaseArr, {crid: testinformation.fileCRCollection[i].CRsArr[j]});
								var test_case ="No Testcase Mapping Found";
								if(tc_ids.length>0){
									test_case = tc_ids[0].testcase
								}else{
									test_case ="No Testcase Mapping Found";
								}
								
									if(j==0) {
										htmltodisplay += '<tr class="success">';
											htmltodisplay +='<td rowspan='+testinformation.fileCRCollection[i].CRsArr.length+' style="border: 1px solid black;"><div style="word-wrap: break-word;width: 446px;">'+testinformation.fileCRCollection[i].fileName+'</div></td>';
										htmltodisplay +='<td style="border: 1px solid black; padding-left: 4%;"><label onclick="javascript:openDefectDetails_test(this.innerHTML);" id="lbl_"'+testinformation.fileCRCollection[i].CRsArr[0]+' class="LblTreeDefectId">'+testinformation.fileCRCollection[i].CRsArr[0]+'</td>';
										htmltodisplay +='<td style="border: 1px solid black; padding-left: 4%;">'+test_case+'</td>';
										htmltodisplay+='</tr>';
									} else {
							
										console.log("--347--"+test_case)
										htmltodisplay += '<tr class="success">'
										htmltodisplay +='<td style="border: 1px solid black; padding-left: 4%;"><label onclick="javascript:openDefectDetails_test(this.innerHTML);" id="lbl_"'+testinformation.fileCRCollection[i].CRsArr[j]+' class="LblTreeDefectId">'+testinformation.fileCRCollection[i].CRsArr[j]+'</td>';
										htmltodisplay +='<td style="border: 1px solid black; padding-left: 4%;">'+test_case+'</td>';
									}
							}
					}
				}					
				else{
					htmltodisplay +='<table><tr><td style="padding-left: 567px;">No Data to Display</td></tr></table>';
				}
						htmltodisplay+='</tbody></table>';
						$("#testinfor_tbl").removeClass("hide");
						$("#testinfor_restable").append(htmltodisplay);	
				}
				
				
			
};
	