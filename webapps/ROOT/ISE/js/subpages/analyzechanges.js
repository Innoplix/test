 var analyzechanges = {
	
	tcList : [],
	uniqList: [],
	recSet : {},
	configData1 : {},
	testBedDist : [],
	optResults : {},
	settings:{},	
	//optSettings : {},
	//totalExe : 150,
	
	featureArr: [],
	relaseArr:[],
	buildArr:[],
	rbArry:[],
	buildsArry: [],
	testExecutionArry: [],
	codeElmentsArry: [],
	featureKeys: [],
	envsArry: [],
	browseArry: [],
	marketArry: [],	
	recommendTCsArr: [],
	optimizeTCsArr: [],
	testBedKeys:[],
	optimizeId: "",
	st_date:"",
	end_date:"",
	noOfDays:0,
	capacityPlanning: {},
	isFromJson: true,
	job_id:"",
	selectedFilesToAnalyze: [],
	associatedbuildsforfiles:[],
	//selectedDefectsFilesToAnalyze: [],
	//associatedDefectsbuildsforfiles:[],
	associatedbuildsforfiles1:[],
	selectedDefArry:[],
	files:[],
	filePath:"",
	elementId:"",
	nodefilename:"",
	defid:[],
	analyzeData:"",
	testdata:[],
	fileDataArray: [],
	defectId:"",
	/* Init function  */
    init: function() {	
		analyzechanges.callbackFiles();
        console.log("analyze changes init()");   
		var projectName = localStorage.getItem('projectName');
		analyzechanges.getBuilds();			
     }, 
	 
	 treeLoaded:function(event, data){	
		data.instance.select_node(analyzechanges.rbArry); //node ids that you want to check
	 },
	
	onDisplayHeaderElements: function() {

            //   ISEUtils.showReleaseHeaderDropdown();
			console.log("onDisplayHeaderElements-s");
			analyzechanges._getfiledata();
			console.log(analyzechanges.fileDataArray);
			console.log("onDisplayHeaderElements-e");
			},
		_getfiledata: function() {
				console.log("_getfiledata-s")
				var searchString = "*";
				var requestObject = new Object();
                requestObject.searchString = searchString;
                //requestObject.projectName = defectsearch.projectName;
				requestObject.projectName = localStorage.getItem('projectName');
                requestObject.maxResults = 50;
                requestObject.collectionName = "defect_files_collection";
                ISE.getFileDiffSearchResults(requestObject, analyzechanges._receivedfiledata);				
        },
		
		 _receivedfiledata: function(data) {
			console.log("***************************************************************8");
            console.log(data);
			
			analyzechanges.fileDataArray.length =0;
			
			for(i=0;i<data.length;i++) {
				var eachObj = new Object();
				eachObj.fileslist = data[i].fileslist;
				analyzechanges.fileDataArray.push(eachObj);
			}
	
			analyzechanges.fileDataArray = _.uniq(analyzechanges.fileDataArray, function (object) { return object.fileslist; })
			
			console.log("inside receivedfiledata");
			console.log(analyzechanges.fileDataArray);
			
			var numbers = new Bloodhound({
			datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.fileslist); },
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			local: analyzechanges.fileDataArray
			});
         //analyzechanges.fileDataArray
			// initialize the bloodhound suggestion engine
			numbers.initialize();         
			// instantiate the typeahead UI
			if (Metronic.isRTL()) {
			$('#analyzechanges_filesearchInput').attr("dir", "rtl");  
			}
			$('#analyzechanges_filesearchInput').typeahead(null, {
			displayKey: 'fileslist',
			hint: (Metronic.isRTL() ? false : true),
			source: numbers.ttAdapter()
			});
			analyzechanges.callbackFiles();
		},
	 
	callbackFiles:function(){		
                        if(sessionStorage.files != null && sessionStorage.files != undefined && sessionStorage.files != ''){				
                                    var fileNamesArr = new Array();
                                    var defsArr = new Array();
                                    fileNamesArr =  sessionStorage.files.split(',');
									if(fileNamesArr.length >0){
									analyzechanges.selectedFilesToAnalyze = [];
									analyzechanges.associatedbuildsforfiles = [];
									//analyzechanges.selectedDefectsFilesToAnalyze = [];
									//analyzechanges.associatedDefectsbuildsforfiles:[],
									}
                                    if(sessionStorage.defs != null && sessionStorage.defs != undefined && sessionStorage.defs != '')
                                          defsArr = sessionStorage.defs.split(',');														
										//analyzechanges.associatedbuildsforfiles = [];								
										//analyzechanges.selectedFilesToAnalyze = [];
										//analyzechanges.selectedDefectsFilesToAnalyze = [];
									   // analyzechanges.associatedDefectsbuildsforfiles = [];
										$('#defectsTableBody').empty();
									 var fileNM = [];
                                    for(var i=0;i<fileNamesArr.length;i++){

                                          if(fileNamesArr[i] != null && fileNamesArr[i] !=''){
                                                var index=fileNamesArr[i].lastIndexOf("/")+1;                                               
												fileNM.push(fileNamesArr[i].substr(index,fileNamesArr[i].length));                     
                                          }
                                    }
									analyzechanges.addFileChangedToTable("analyzechanges_defectsTable",fileNamesArr,fileNM,defsArr);
                                    //sessionStorage.files = '';
                        }else{
                        //alert('session storgae is empty');
                        }		
	 },
	 
	addFileChangedToTable:function(elementId,files,nodefilename,defid){	  
	  analyzechanges.elementId=elementId;
	  analyzechanges.nodefilename=nodefilename;
	  analyzechanges.defid=defid;
	  analyzechanges.files = files;	  	  
	  var finalCR = "file:";
	  var cd_id_Value ="";
	  for(var m=0;m<files.length;m++){
			finalCR = finalCR +'"'+files[m].trim()+'"'+" "+"file:";
			cd_id_Value = finalCR.slice(0,-5).trim();					
		}
	  //analyzechanges.filePath=filePath;
	  //analyzechanges.selectedFilesToAnalyze = []; 
	  
		//var searchString = "file:\""+filePath.trim()+"\"";
		var finalCrQry = cd_id_Value;
		var finalQry = finalCrQry.trim();
		ISEUtils.portletBlocking("pageContainer");
		var requestObject = new Object();
		 requestObject.collectionName = "defect_collection";
        requestObject.projectName = localStorage.getItem('projectName');
		requestObject.searchString =	finalQry;
		ISE.getDefectFileSearchResults(requestObject, analyzechanges.receivedDefectFileSearchResults); 		 
	  },
	  
	receivedDefectFileSearchResults:function(data){
		$('#filesTableBody').empty();
		$('#defectsTableBody').empty();
		//analyzechanges.getBuilds();
		//$('#releasejstree').jstree(true).deselect_all();
		var tabledata = "";
		for(i = 0; i < analyzechanges.files.length; i++){
		for(var a = 0; a < data.length; a++){
		if((data[a].source.file.indexOf(analyzechanges.files[i])) != -1 && (analyzechanges.defid.indexOf(data[a].source._id) != -1)){			
			analyzechanges.selectedFilesToAnalyze.push(analyzechanges.files[i]);
				var build="2.2";
			if (data[a].source.hasOwnProperty("build") && data[a].source.build != undefined) 
				build =data[a].source.build;
			
			analyzechanges.associatedbuildsforfiles.push(build)
			//alert(build)
			tabledata +='<tr id="tr_'+analyzechanges.files[i]+'">';
			//tabledata +='<td>'+analyzechanges.files[i]+'</td>';
			tabledata +='<td><a onclick=analyzechanges._fileDetails("'+analyzechanges.files[i]+'")>'+analyzechanges.files[i]+'</a></td>';
			tabledata +='<td>'+data[a].source._id+'</td>';
			tabledata +='<td></td>';
			tabledata +='<td valign="middle" align="center" style="width:100px;text-align:center" title="This element is not considered for the Analysis">'+build+'</td>';
			tabledata +='<td valign="middle" align="center"><img src="images/wrong.png" width="12px" value="'+analyzechanges.files[i]+'#'+build+'" onclick=analyzechanges.fn_clearFilesChangedTB("'+analyzechanges.files[i]+'#'+build+'")></td>';
			tabledata +='</tr>';		
			}		
		 }
		 }
		 //$('#defectsTableBody').append(tabledata);
		 console.log("receivedDefectFileSearchResults FilesToAnalyze"+analyzechanges.selectedFilesToAnalyze.length);
		 console.log("receivedDefectFileSearchResults buildsforfiles"+analyzechanges.associatedbuildsforfiles.length);		 
		 $('.nav-tabs a[href="#filesTab"]').tab('show');
		 $('#filesTableBody').append(tabledata);
		 sessionStorage.files = '';
		 $('#analyzeResultsTable').hide();
		 $('#releasejstree').jstree(true).deselect_all();
		ISEUtils.portletUnblocking("pageContainer");		
	  },	 
	  
	getBuilds:function(){		
		//pending-->5 done
		//var data = '{"fileName":"get_builds","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		//ISE_Ajax_Service.ajaxPostReq('QueryReportingRestService', 'json', localStorage.authtoken,data,analyzechanges.callBackGetBuilds);
		ISEUtils.portletBlocking("pageContainer");
		var requestObject = new Object();
        requestObject.projectName = localStorage.getItem('projectName');
		 requestObject.collectionName = "builds_collection";
        ISE.getBuildsInfo(requestObject, analyzechanges.callBackGetBuilds);		
	},	
	callBackGetBuilds:function(data){
		ISEUtils.portletUnblocking("pageContainer");
		analyzechanges.buildsArry=data;
		analyzechanges.getTestExecutionData();
		//console.log("buildsdata ---> "+JSON.stringify(data))
		//console.log("buildsdata ---> "+JSON.stringify(analyzechanges.buildsArry))		
	},
	getTestExecutionData:function(){
		//pending-->6 done
		/* var data = '{"fileName":"release_test_exec","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,analyzechanges.callBackGetTestExecutionsData); */
		ISEUtils.portletBlocking("pageContainer");
		var requestObject = new Object();
        requestObject.projectName = localStorage.getItem('projectName');
		 requestObject.collectionName = "test_executions_collection";
        ISE.getTestExecsInfo(requestObject, analyzechanges.callBackGetTestExecutionsData);
	},
	callBackGetTestExecutionsData:function(data){
		ISEUtils.portletUnblocking("pageContainer");
		analyzechanges.testExecutionArry = data;
		//console.log("testExectionsdata ---> "+JSON.stringify(analyzechanges.testExecutionArry));		
		analyzechanges.codeElementsData();	  
	},
	codeElementsData:function(){
		ISEUtils.portletBlocking("pageContainer");
		var data = '{"fileName":"unq_builds_from_code_elements_by_date","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		//pending-->7 not needed
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,analyzechanges.callBackcodeElementsData);
	},
	callBackcodeElementsData:function(data){
		ISEUtils.portletUnblocking("pageContainer");
		analyzechanges.codeElmentsArry = data;
		//console.log("codeElementData ---> "+JSON.stringify(analyzechanges.codeElmentsArry));
		var releaseArry = "";
		releaseArry = analyzechanges.getReleaseBuilds("U");
		//console.log(""+JSON.stringify(releaseArry));

		/* $('#releasejstree').jstree({			
			"core" : {
			"themes" : {
			"variant" : "large"
			},
			'data' : releaseArry
			},	  

			"plugins" : [ "wholerow", "checkbox" ]
		}); */
		
		
		var fet=0;
		analyzechanges.testdata=[];
			 console.log(releaseArry)
              
                for(var index in releaseArry)
                {
                	var fetKeyObj = {};
					fet++;
					fetKeyObj.id = "FET"+fet.toString();
					fetKeyObj.fetval = releaseArry[index].id;
					fetKeyObj.ddid = "FETDD"+fet.toString();
					console.log(releaseArry[index].id)
					console.log(fetKeyObj.id );					
								                 
			        var parentNode=new Array();            
					 if(releaseArry[index].children != undefined)
						 {

							 for(var i=0;i<releaseArry[index].children.length;i++){
							  var fetKeyObj1 = {};   
							fet++;
							fetKeyObj1.id = "FET"+fet.toString();
							fetKeyObj1.fetval = releaseArry[index].children[i].id;
							fetKeyObj1.ddid = "FETDD"+fet.toString();
							
							var childNode=new Object();
							childNode.id=fetKeyObj1.id+"_child";
							childNode.text=fetKeyObj1.fetval;          
							parentNode.push(childNode);							
							}
						 }
						 
						// var parentPriorityData=new Object();
			                  //	 parentPriorityData.Priority='<select id="'+ fetKeyObj.fetval + '" onchange=""></select>';
						 
						 if(parentNode.length > 0){                               

					                  	 analyzechanges.testdata.push({
                                            "id":fetKeyObj.id+"_parent_"+parentNode.length,
					                    	"text":fetKeyObj.fetval, 
					                    	"data": fetKeyObj.fetval,                    	       	
					                    	"children":parentNode,					                    	
					                    	state: { opened : true} 
					                    })					                  	
			                  	 }
			                  	 else
			                  	 {            
			                  	 	 analyzechanges.testdata.push({
			                  	 	 		"id":fetKeyObj.id+"_parent_0",
					                    	"text":releaseArry[index].title, 
					                    	"data": parentPriorityData,
					                    	//state: { opened : true} 					                    	 
					                    })
								}
                }

		console.log(analyzechanges.testdata)
			$("#releasejstree").jstree({
			  "core": {
				"data":analyzechanges.testdata,
			  },
			  'checkbox': {
				'keep_selected_style': true,
				'tie_selection': true,
				'whole_node': true
				//"three_state" : false	       
			},         
	 
		 "plugins": ["checkbox","grid"],

			  "grid": {
				"columns": [
				  {"width": 150, "cellClass": "col1","header": "Releases/Builds","title":"_DATA_" , 'tree' : true ,'resizable' : true }              
				]
			  },          
			});	
	},
	changedJstree:function() {			
			analyzechanges.relaseArr=[];
			analyzechanges.buildArr=[];
			//var selectedReleases = $(this).jstree('get_top_selected');			
			var totalSelectedCheckBoxes = $("#releasejstree").jstree('get_top_selected');
			if(totalSelectedCheckBoxes.length>0){
			$("#page_analyzechanges .build-select-error").hide();
			var selectedReleases = [];
			for(var i=0; i< totalSelectedCheckBoxes.length; i++){
			var chkID = totalSelectedCheckBoxes[i];
			if((chkID.indexOf("parent") !=  -1) && (selectedReleases.indexOf($("#"+chkID+" .jstree-clicked").text()) == -1)){
			selectedReleases.push($("#"+chkID+" .jstree-clicked")[0].text); 
			}
			}
			console.log(selectedReleases);
			//var selectedBuilds = $(this).jstree('get_bottom_selected');
			var totalBottomSelectedCheckBoxes = $("#releasejstree").jstree('get_bottom_selected')
			var selectedBuilds = [];
			for(var i=0; i< totalBottomSelectedCheckBoxes.length; i++){
			var chkID = totalBottomSelectedCheckBoxes[i];
			if((chkID.indexOf("child") !=  -1) && (selectedBuilds.indexOf($("#"+chkID+" .jstree-clicked").text()) == -1)){
			selectedBuilds.push($("#"+chkID+" .jstree-clicked").text()); 
			}
			}			
			console.log(selectedBuilds);
			
			for(var i = 0; i< selectedReleases.length; i++){
			if(analyzechanges.relaseArr.indexOf(selectedReleases[i]) == -1){
			analyzechanges.relaseArr.push(selectedReleases[i]);
			}
			}
			for(var j = 0; j< selectedBuilds.length; j++){
			if(analyzechanges.buildArr.indexOf(selectedBuilds[j]) == -1){
			analyzechanges.buildArr.push(selectedBuilds[j]);
			}
			} 
			console.log("relaseArr array length"+analyzechanges.relaseArr.length);
			console.log("buildArr array length"+analyzechanges.buildArr.length);			
			analyzechanges.constructDefectsByBuilds();	
			}else{
			  $("#page_analyzechanges .build-select-error").show();
			}
	},
    constructDefectsByBuilds:function(){
		// console.log("release arry --- 186 -- "+JSON.stringify(analyzechanges.relaseArr))
		 ISEUtils.portletBlocking("pageContainer");
		var val="";		
		var formatReleases = [];
		var formatBuilds = [];		
		//if(undefined == analyzechanges.relaseArr || analyzechanges.relaseArr.length<=0){
		if(undefined == analyzechanges.relaseArr){
		 $('#defectsTableBody').empty();
		 ISEUtils.portletUnblocking("pageContainer");
		return
		}
		/* for(var i=0;i<analyzechanges.relaseArr[0].length;i++){
		    if(analyzechanges.buildArr[0].indexOf(analyzechanges.relaseArr[0][i]) == -1){
			formatReleases.push('"'+analyzechanges.relaseArr[0][i]+'"');
			}
		}
		for(var i=0;i<analyzechanges.buildArr[0].length;i++){
			formatBuilds.push('"'+analyzechanges.buildArr[0][i]+'"');
		}
		
		var params = 'PARAM1='+formatReleases.toString()+'#&#'+'PARAM2='+formatBuilds;	
		console.log("--196----"+params)
		var fileName = "get_defects_by_build";	
		var fromCache ="false";		
		var data = "{fileName:'"+fileName+"',params:'"+params+"',projectName:'"+localStorage.getItem('projectName')+"',fromCache:'"+fromCache+"'}";		
		ISE_Ajax_Service.ajaxPostReq('QueryReportingRestService', 'json', localStorage.authtoken,data,analyzechanges.callBackConstructDefectsByBuilds); */
		var buildString="";
		var releaseString="";
		var finalString;
		
		for(var i=0;i<analyzechanges.buildArr.length;i++){
			buildString += 'build:"'+analyzechanges.buildArr[i]+'" OR ';					
		}
		    buildString="("+buildString.slice(0,-3)+")"
					
		for(var j=0;j<analyzechanges.relaseArr.length;j++){
			releaseString += 'release:"'+analyzechanges.relaseArr[j]+'" OR ';	
			}					
		
			releaseString="("+releaseString.slice(0,-3)+")"	
		if(analyzechanges.relaseArr.length!=0){
		finalString= releaseString+" AND "+buildString;
		}else{
			finalString= buildString;
			}
		ISEUtils.portletBlocking("pageContainer");
		var requestObject = new Object();
		requestObject.collectionName = "codeelements_collection";
        requestObject.projectName = localStorage.getItem('projectName');
		requestObject.searchString = finalString;
		ISE.getDefectFileReleaseBuildSearchResults(requestObject, analyzechanges.receivedDefectFileReleaseBuildSearchResultss);
	},
		
	receivedDefectFileReleaseBuildSearchResultss:function(data){		
        analyzechanges.selectedFilesToAnalyze=[];	
		analyzechanges.associatedbuildsforfiles=[];
		$('#analyzeDefectsResultsTable').hide();
		if(data.length >0){
		//$('#defectsTableBody').empty();
		//for(var i = 0; i<data.length; i++){			
			//analyzechanges.associatedDefectsbuildsforfiles.push(data[i].build);			
			//analyzechanges.selectedDefectsFilesToAnalyze.push(data[i].codecomponent);
					
		//}		
		console.log("builreleasedata***"+data);
		var loopCount = 0;		
		 //var table = $('#analyzechanges_defectsTable');
			 var tabledata = "";
			 for(var i = 0; i<data.length; i++){
			    if(analyzechanges.selectedFilesToAnalyze.indexOf(data[i].codecomponent) == -1){
				analyzechanges.selectedFilesToAnalyze.push(data[i].codecomponent);
				analyzechanges.associatedbuildsforfiles.push(data[i].build);
								
				tabledata +='<tr id="tr_'+data[i].codecomponent+'">';				
				/* tabledata +='<td style="width:30px;text-align:center"><input type="checkbox" checked name="changedDefectsCheckbox" id:"changedDefectsCheckbox" value="'+data[i].codecomponent+'#'+data[i].build+'" onclick=analyzechanges.fn_defectsChangedTB("'+data[i].codecomponent+'#'+data[i].build+'")></td>'; */
				tabledata +='<td>'+data[i].codecomponent+'</td>';
				tabledata +='<td></td>';
				tabledata +='<td></td>';
				tabledata +='<td valign="middle" align="center" style="width:100px;text-align:center" title="This element is not considered for the Analysis">'+data[i].build+'</td>';
				tabledata +='<td valign="middle" align="center"><img src="images/wrong.png" width="12px" value="'+data[i].codecomponent+'#'+data[i]._id+'" onclick=analyzechanges.fn_clearFilesChangedTB("'+data[i].codecomponent+'#'+data[i].build+'")></td>';
				tabledata +='</tr>';
				loopCount++;
				}
				}				
			//table.append(tabledata);  
			console.log("loopCount"+loopCount);
			//$('#defectsTableBody').append(tabledata);
			console.log("receivedDefectFileReleaseBuildSearchResultss FilesToAnalyze"+analyzechanges.selectedFilesToAnalyze.length);
		    console.log("receivedDefectFileReleaseBuildSearchResultss buildsforfiles"+analyzechanges.associatedbuildsforfiles.length);
			$('#pivot_tbl2').DataTable().clear().destroy();
			$('#analyzeResultsTable').hide();
			$('.nav-tabs a[href="#filesTab"]').tab('show')
			$('#filesTableBody').html(tabledata);			
		}
		ISEUtils.portletUnblocking("pageContainer");
	  },    
	
	getReleaseBuilds:function(buildType){	
		console.log("------------releaseTree-------------- ");				
		var resultsArry=[];
		if(buildType =='L') { 
			//var testExecReleaseData = ISEUtils.getDynamicDataByParams("release_test_exec", "", "mongoMapReduce", false);	
			var testExecBuilds=[];
			if(undefined != analyzechanges.testExecutionArry && null != analyzechanges.testExecutionArry && analyzechanges.testExecutionArry.length>0 && analyzechanges.buildsArry.length>0){
				for(var i=0;i<analyzechanges.buildsArry.length;i++){
					for(var j=0;j<analyzechanges.testExecutionArry.length;j++){
						if(analyzechanges.testExecutionArry[j].build == analyzechanges.buildsArry[i].build && analyzechanges.testExecutionArry[j].release == analyzechanges.buildsArry[i].release){
							var obj = new Object();							
							obj.build = analyzechanges.buildsArry[i].build;
							obj.release=analyzechanges.buildsArry[i].release;
							obj.build_type=analyzechanges.buildsArry[i].build_type;
							obj.wt_distribution=analyzechanges.buildsArry[i].wt_distribution;
							obj.created_date=analyzechanges.buildsArry[i].created_date;
							
							testExecBuilds.push(obj);
							break;
						}
					}
				}
				//console.log("testExecBuilds *** "+JSON.stringify(testExecBuilds))
				resultsArry = analyzechanges.formatParentChildReleationArry(testExecBuilds);
			}
		} else if(buildType =='T'){			
			var codeElementBuilds=[];
			var counter=0;
			if(undefined != analyzechanges.codeElmentsArry && null != analyzechanges.codeElmentsArry && analyzechanges.codeElmentsArry.length>0 && analyzechanges.buildsArry.length>0){	
				for(var i=0;i<analyzechanges.buildsArry.length;i++){
					for(var j=0;j<analyzechanges.codeElmentsArry.length;j++){
						if(analyzechanges.codeElmentsArry[j].build == analyzechanges.buildsArry[i].build && analyzechanges.codeElmentsArry[j].release == analyzechanges.buildsArry[i].release){
							var obj = new Object();							
							obj.build = analyzechanges.buildsArry[i].build;
							obj.release=analyzechanges.buildsArry[i].release;
							obj.build_type=analyzechanges.buildsArry[i].release;
							obj.wt_distribution=analyzechanges.buildsArry[i].wt_distribution;
							obj.created_date=analyzechanges.buildsArry[i].created_date;
							
							codeElementBuilds.push(obj);
							break;
						}
					}
				}
				//console.log("codeElementBuilds === "+JSON.stringify(codeElementBuilds))
			
				resultsArry = analyzechanges.formatParentChildReleationArry(codeElementBuilds);
			}			
		} else{		
			//var builds = ISEUtils.getDynamicDataByParams("get_builds", "", "mongo", false);				
			if(undefined != analyzechanges.buildsArry && null != analyzechanges.buildsArry && analyzechanges.buildsArry.length>0){				
				resultsArry = analyzechanges.formatParentChildReleationArry(analyzechanges.buildsArry);
			}			
		}
		return resultsArry;		
	},	
	formatParentChildReleationArry: function(builds){
		var releaseArry=[];
			var releasesGrp = _.groupBy(builds, function (object) { return object.release; })												
			if(releasesGrp){
				_.each(releasesGrp, function (rVal, rKey) {						
					var relObj = new Object();
						relObj.id = rKey;
						relObj.text = rKey;
						relObj.title2 = "";
						relObj.title3 = "";
						relObj.higher = "false";								
						var buildArry=[];															
						for (var j=0;j<rVal.length;j++){
							var buildObj = new Object();
							buildObj.id = rVal[j].build;
							buildObj.text = rVal[j].build;
							buildObj.title2 = rVal[j].build_type;
							buildObj.title3 = rVal[j].wt_distribution;
							buildObj.title4 = rVal[j].created_date;
							buildObj.higher = "false";
							buildArry.push(buildObj);
						}
						relObj.children=buildArry;
						releaseArry.push(relObj);									
					
				});
				//console.log("parent child relation *** "+JSON.stringify(releaseArry));
			}
		return 	releaseArry;
	}, 
	isEmpty:function(val){
		return (val === undefined || val == null || val.length <= 0) ? true : false;			
	},
	
	onButtonChangeTab:function(nextTab){
		if(nextTab == 'filesTab'){
			$('#AnalyzetabUL a[href="#filesTab"]').trigger('click');
		}/*else if(nextTab == 'testBedsTab'){
			$('#AnalyzetabUL a[href="#testBedsTab"]').trigger('click');
		}else if(nextTab == 'testSettingsTab'){
			$('#AnalyzetabUL a[href="#testSettingsTab"]').trigger('click');
		}else if(nextTab == 'optimizationsTab'){
			$('#AnalyzetabUL a[href="#optimizationsTab"]').trigger('click');
		}	*/ 
	},
	
	_fileSearchKeyUpFunc: function() {
			var fileName = $('#analyzechanges_filesearchInput').val();
			var searchDefId = "";
			if(fileName == "" || fileName == null || fileName =='undefined') {
				$("#analyzechanges_filelistmodalheader").empty();
				$("#analyzechanges_filelistmodaldata").empty();
				$("#analyzechanges_modalPopupbody").removeClass("hide");
				document.getElementById("analyzechanges_filelistmodalheader").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;Please Enter File Name...";
					
			} else {
			
			analyzechanges._onFileSearchAll(fileName, searchDefId);
			}
		},
		
			_onFileSearchAll: function(fileName, searchDefId) {
			//"file:\"*/Client/Mitel.Communicator.API.Contract/Mitel.Communicator.API.Contract.csproj\"*"
			console.log("File Name -->"+fileName);
			//var searchString = "*"+fileName.trim()+"*";
			//var searchString = "file:\"*"+fileName.trim()+"\"*";
			var searchString = "file:\\\""+fileName.trim()+"\\\"";
			console.log("searchString --> "+searchString);
			 
				var requestObject = new Object();

                requestObject.searchString = searchString;
				requestObject.searchDefId = searchDefId;
                requestObject.searchFile = fileName.trim();				
                requestObject.searchFileFlag = true;
                requestObject.projectName = localStorage.getItem('projectName');;
                requestObject.maxResults = 6000;
                requestObject.collectionName = "defect_collection";
                ISE.getFilePartialSearchResults(requestObject, analyzechanges._receivedFileSearchResults);
			
			},
		_receivedFileSearchResults:function(data) {
			console.log(data);
			
			var fileNamesArr = new Array();
			var chkBxFileDiv = "";
			for(var i=0;i<data.length;i++) {
					var eachObj = new Object();
					//eachObj.fileslist = data[i].file;
					var a = new Array();
					if(data[i].file != undefined){
					a = (data[i].file).split(",");
					for(var j=0;j<a.length;j++) {
						eachObj.fileslist = a[j].replace("]","");
						eachObj.fileslist = eachObj.fileslist.replace("[","");
						eachObj.fileslist = eachObj.fileslist.replace(" ","");
						eachObj.build = data[i].build;
						eachObj.id = data[i]._id;
						eachObj.status = data[i].status;
						searchfile = data[i].searchFile;
						fileNamesArr.push(eachObj);		
					}	
					}
			}			
			//defectsearch.fileDiffCollection = _.uniq(defectsearch.fileDiffCollection.cRsArr);
			fileNamesArr = _.uniq(fileNamesArr, function (object) { return object.fileslist; })
			console.log("after unique of fileNamesArr");
			 
			console.log(fileNamesArr);
			console.log("===719===="+fileNamesArr.length);
			var fileNames = new Array();
			
				$("#analyzechanges_filelistmodalheader").empty();
				$("#analyzechanges_filelistmodaldata").empty();
				//$("#analyzechanges_filelistmodalLabel").empty();
				
				if(fileNamesArr.length == 0){
					$("#analyzechanges_filelistmodalheader").empty();
					$("#analyzechanges_filelistmodaldata").empty();
					$("#analyzechanges_modalPopupbody").removeClass("hide");
					document.getElementById("analyzechanges_filelistmodalheader").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;No data Available for Searched File";
				} else {				
					//checkbox code
					//$("#analyzechanges_filelistmodalLabel").empty();
					$("#analyzechanges_filelistmodalheader").empty();
					$("#analyzechanges_filelistmodaldata").empty();
					$("#analyzechanges_modalPopupbody").removeClass("hide");
					$("#analyzechanges_modalPopupFooter").removeClass("hide");
					
					chkBxFileDiv += "<div class='portlet box yellow'>"
					chkBxFileDiv += "<div style='padding-top:10px;padding-bottom:10px;padding-left:10px;' class='caption'>Files Found for the Search String - "+"<span style='background-color:yellow'>"+ searchfile +"</span>. <span style='color:blue'>Please Select files from below...</span></div>"					
					chkBxFileDiv += '<div class="portlet-body" style="height:250px; overflow-y:scroll;"><div class="icheck-list">'
					
					for(var i=0;i<fileNamesArr.length;i++) {
						if(fileNames.indexOf(fileNamesArr[i].fileslist) == -1){
						fileNames.push(fileNamesArr[i].fileslist);
							chkBxFileDiv += '<label><input type="checkbox" name="fileName" id="fileNameId" value="'+fileNamesArr[i].fileslist+'#'
							+fileNamesArr[i].build+'#'+fileNamesArr[i].id+'#'+fileNamesArr[i].status+'#'+'">'+fileNamesArr[i].fileslist+'</label>'
						}						
					}
					chkBxFileDiv += '</div></div>';					
					$("#analyzechanges_filelistmodaldata").append(chkBxFileDiv); 					
				}		
		},
		
		_selectedFilesToAnalyze:function() {	
			 //fileSelected = $('input[name="fileName"]:checked', '#fileNameId').val();
			 //fileSelected = $('input[name="fileName"]:checked').val();
			   var checkboxes = document.querySelectorAll('input[name="fileName"]:checked'); 
			   values = [];
				Array.prototype.forEach.call(checkboxes, function(el) {
				values.push(el.value);
				});
			 console.log("fileSelected-----------------");
			 console.log(values);
			 
			 //Metronic.unblockUI('analyzechanges_filelistmodal');
			 //alert("Selection Done");  
				filesArr = new Array();
				buildArr = new Array();
			 //var table = $('#analyzechanges_filesChangedTable');
			 //$('#filesTableBody').empty();
			 var tabledata = "";
			for(var i=0;i<values.length;i++) {
				var a = new Array();
				a= values[i].split("#");
				if(analyzechanges.selectedFilesToAnalyze.indexOf(a[0].trim()) == -1){
				analyzechanges.selectedFilesToAnalyze.push(a[0].trim());
				analyzechanges.associatedbuildsforfiles.push(a[1]);
				tabledata +='<tr id="tr_'+a[0].trim()+'">';
				tabledata +='<td>'+a[0].trim()+'</td>';
				tabledata +='<td>'+a[2]+'</td>';
				tabledata +='<td>'+a[3]+'</td>';
				tabledata +='<td valign="middle" align="center" style="width:100px;text-align:center" title="This element is not considered for the Analysis">'+a[1]+'</td>';
				tabledata +='<td valign="middle" align="center"><img src="images/wrong.png" width="12px" value="'+a[0].trim()+'#'+a[1].trim()+'" onclick=analyzechanges.fn_clearFilesChangedTB("'+a[0].trim()+'#'+a[1].trim()+'")></td>';
				tabledata +='</tr>';
				}				
			 }
			 console.log("_selectedFilesToAnalyze FilesToAnalyze"+analyzechanges.selectedFilesToAnalyze.length);
		     console.log("_selectedFilesToAnalyze buildsforfiles"+analyzechanges.associatedbuildsforfiles.length);
			 $('.nav-tabs a[href="#filesTab"]').tab('show')
			 $('#filesTableBody').append(tabledata);
			 ISEUtils.portletUnblocking("pageContainer");
			//table.append(tabledata);			 
	},	
	
	fn_clearFilesChangedTB:function(fileChanged) {
		console.log("filechanged"+fileChanged);
		var filesDeleted = fileChanged.split("#");		
		var index1 = analyzechanges.selectedFilesToAnalyze.indexOf(filesDeleted[0]);
		if(index1!=-1){
		   analyzechanges.selectedFilesToAnalyze.splice(index1, 1);
		}
		var index2 = analyzechanges.associatedbuildsforfiles.indexOf(filesDeleted[1]);
		if(index2!=-1){
		   analyzechanges.associatedbuildsforfiles.splice(index2, 1);
		}
		var node =  document.getElementById('tr_'+filesDeleted[0]);
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}			
		console.log("clearFilesChangedTB FilesToAnalyze"+analyzechanges.selectedFilesToAnalyze.length);
		console.log("clearFilesChangedTB buildsforfiles"+analyzechanges.associatedbuildsforfiles.length);		
	},

	generateTestCaseBuildMapping:function() {
	
		console.log(analyzechanges.selectedFilesToAnalyze); 
		console.log(analyzechanges.associatedbuildsforfiles);
		var finalarry=[];
		var tcUnqArray=[];
		var fileArry=analyzechanges.selectedFilesToAnalyze;
		//var fileArry=["image/src/DiscardTracker.cpp"];
		var fileSearchString="";
		for(var j=0;j<fileArry.length;j++){
			console.log("filesNames----------"+fileArry[j]);
			var count = j+1;
			if(count < fileArry.length )         
				fileSearchString += "_id:\""+fileArry[j]+"\"" + " OR ";
			else
				fileSearchString += "_id:\""+fileArry[j]+"\"";
				
		}
		//alert("fileSearchString==>"+fileSearchString);	
		var esurl=elasticsearchHostUrl+"/file_testcase_collection/"+localStorage.projectName+"/_search/";
		//var esurl="http://localhost:9200/file_testcase_collection/MDemo/_search/";
		var query={
					"query": {
						"query_string": {
							"query":fileSearchString
 	
								}
							}
					};
		//alert("query===>"+JSON.stringify(query));
		var respString={};
		 $.ajax({
            type: "POST",
            url: esurl,
            async: false,
            data: JSON.stringify(query),
            contentType: "application/json; charset=utf-8",
            success: function(msg) {
			respString=msg;
			//alert("==res=="+JSON.stringify(respString));
			console.log("==res=="+JSON.stringify(respString));
			}
		});
	//alert(typeof(respString))		
	var temp = respString.hits;
	var tempAry = temp.hits;
	var masterBucket = [];
	var dataBucket = [];
	var testCases = []
	
	var fileSearchStringTC="";
	for(var i = 0;i< tempAry.length;i++){
		var tc = tempAry[i]._source.testcases;
		for(var j = 0;j< tc.length;j++){
			//alert(tc[j].testcaseid);
			if(tcUnqArray.indexOf(tc[j].testcaseid) == -1)
				tcUnqArray.push(tc[j].testcaseid)
				fileSearchStringTC += "_id:\""+tc[j].testcaseid+"\"" + " OR ";
			
		}
	}
	if (fileSearchStringTC != "")
		fileSearchStringTC = fileSearchStringTC.substr(0, fileSearchStringTC.length-4) 
		var esurl2=elasticsearchHostUrl+"/testcase_collection/"+localStorage.projectName+"/_search/";
		//var esurl2="http://localhost:9200/testcase_collection/MDemo/_search/";
		//var tcsearch="_id:"+dataBucket[j].testcaseid;
		var query2={
					"query": {
						"query_string": {
							"query":fileSearchStringTC
 	
								}
							}
					};
		$.ajax({
            type: "POST",
            url: esurl2,
            async: false,
            data: JSON.stringify(query2),
            contentType: "application/json; charset=utf-8",
            success: function(msg) {
			var resobj=msg;
			
		var temp1 = resobj.hits;
		var tempAry1 = temp1.hits;
		var masterBucket1 = [];
		var dataBucket1 = [];
		var testCases1 = []
		for(var i = 0;i< tempAry1.length;i++){
		masterBucket1 = tempAry1[i]._source;
		//dataBucket1 = masterBucket1[i].testcases
		//for(var j = 0;j< masterBucket1.length;j++){
		var jsondata = {};
			jsondata.TestCase =masterBucket1._id;
			jsondata.Environment = masterBucket1.environment;
			if(masterBucket1.primary_feature)
				jsondata.FeatureName = masterBucket1.primary_feature;
			else
				jsondata.FeatureName = "NA";
			jsondata.TITLE = masterBucket1.title;
			jsondata.Passed = "NA"; 
			jsondata.Failed = "NA";
			finalarry.push(jsondata);
			//}
			}
			analyzechanges.viewAll(finalarry); 
		}});
			
	/* for(var i = 0;i< tempAry.length;i++){
		masterBucket[i] = tempAry[i]._source;
		dataBucket = masterBucket[i].testcases
		for(var j = 0;j< dataBucket.length;j++){
		alert("id==>"+JSON.stringify(dataBucket[j].testcaseid));
		var esurl2="http://localhost:9200/testcase_collection/MDemo/_search/";
		var tcsearch="_id:"+dataBucket[j].testcaseid;
		var query2={
					"query": {
						"query_string": {
							"query":tcsearch
 	
								}
							}
					};
		$.ajax({
            type: "POST",
            url: esurl2,
            async: false,
            data: JSON.stringify(query2),
            contentType: "application/json; charset=utf-8",
            success: function(msg) {
			var resobj=msg;
			
	var temp1 = resobj.hits;
	var tempAry1 = temp1.hits;
	var masterBucket1 = [];
	var dataBucket1 = [];
	var testCases1 = []
	for(var i = 0;i< tempAry1.length;i++){
		masterBucket1 = tempAry1[i]._source;
		//dataBucket1 = masterBucket1[i].testcases
		for(var j = 0;j< masterBucket1.length;j++){
		var jsondata = {};
			jsondata.TestCase =masterBucket1[j].testcaseid;
			jsondata.Environment = masterBucket1[j].environment;
			jsondata.FeatureName = "NA";
			jsondata.TITLE = masterBucket1[j].title;
			jsondata.Passed = "NA"; 
			jsondata.Failed = "NA";
			finalarry.push(jsondata);
		
		
		}
		}
			
			
			
			
			
			//alert("==res=="+JSON.stringify(respString));
			console.log("==res=="+finalarry.length);
			}
			});
		
			//testCases.push(JSON.stringify(dataBucket[j].testcaseid))
			
		}
	} */
	
	
	
	//console.log("testCases size"+testCases.length)
			//console.log(finalarry);	
	//analyzechanges.analyzeData = tcUnqArray;//finalarry;
	//analyzechanges.viewAll(finalarry); 
	//analyzechanges.viewAll(tcUnqArray); 
	},



	
	
	generateTestCaseBuildMappingBK:function() {
	
		console.log(analyzechanges.selectedFilesToAnalyze); 
		console.log(analyzechanges.associatedbuildsforfiles);
		var finalarry=[];
		//var fileArry=analyzechanges.selectedFilesToAnalyze;
		var fileArry=["image/src/DiscardTracker.cpp"];
		var fileSearchString="";
		for(var j=0;j<fileArry.length;j++){
		console.log("filesNames----------"+fileArry[j]);
		var count = j+1;
		if(count < fileArry.length )         
			fileSearchString += "_id:\""+fileArry[j]+"\"" + " OR ";
		else
			fileSearchString += "_id:\""+fileArry[j]+"\"";
			
	}
		//alert("fileSearchString==>"+fileSearchString);	
		var esurl=elasticsearchHostUrl+"/file_testcase_collection/"+localStorage.projectName+"/_search/";
		//var esurl="http://localhost:9200/file_testcase_collection/MDemo/_search/";
		var query={
					"query": {
						"query_string": {
							"query":fileSearchString
 	
								}
							}
					};
					

		//alert("query===>"+JSON.stringify(query));
		var respString={};
		 $.ajax({
            type: "POST",
            url: esurl,
            async: false,
            data: JSON.stringify(query),
            contentType: "application/json; charset=utf-8",
            success: function(msg) {
			respString=msg;
			//alert("==res=="+JSON.stringify(respString));
			console.log("==res=="+JSON.stringify(respString));
			}
			});
	//alert(typeof(respString))		
	var temp = respString.hits;
	var tempAry = temp.hits;
	var masterBucket = [];
	var dataBucket = [];
	var testCases = []
	for(var i = 0;i< tempAry.length;i++){
		masterBucket[i] = tempAry[i]._source;
		dataBucket = masterBucket[i].testcases
		for(var j = 0;j< dataBucket.length;j++){
		//alert("id==>"+JSON.stringify(dataBucket[j].testcaseid));
		var esurl2=elasticsearchHostUrl+"/testcase_collection/"+localStorage.projectName+"/_search/";
		//var esurl2="http://localhost:9200/testcase_collection/MDemo/_search/";
		var tcsearch="_id:"+dataBucket[j].testcaseid;
		var query2={
					"query": {
						"query_string": {
							"query":tcsearch
 	
								}
							}
					};
		$.ajax({
            type: "POST",
            url: esurl2,
            async: false,
            data: JSON.stringify(query2),
            contentType: "application/json; charset=utf-8",
            success: function(msg) {
			var resobj=msg;
			
	var temp1 = resobj.hits;
	var tempAry1 = temp1.hits;
	var masterBucket1 = [];
	var dataBucket1 = [];
	var testCases1 = []
	for(var i = 0;i< tempAry1.length;i++){
		masterBucket1 = tempAry1[i]._source;
		//dataBucket1 = masterBucket1[i].testcases
		for(var j = 0;j< masterBucket1.length;j++){
		var jsondata = {};
			jsondata.TestCase =masterBucket1[j].testcaseid;
			jsondata.Environment = masterBucket1[j].environment;
			jsondata.FeatureName = "NA";
			jsondata.TITLE = masterBucket1[j].title;
			jsondata.Passed = "NA"; 
			jsondata.Failed = "NA";
			finalarry.push(jsondata);
		
		
		}
		}
			
			
			
			
			
			//alert("==res=="+JSON.stringify(respString));
			console.log("==res=="+finalarry.length);
			}
			});
		
			//testCases.push(JSON.stringify(dataBucket[j].testcaseid))
			
		}
	}
	
	
	
	//console.log("testCases size"+testCases.length)
			console.log(finalarry);	
	analyzechanges.analyzeData = finalarry;
	analyzechanges.viewAll(finalarry); 
	},
	
	
	
	callBackGenerateTestCaseBuildMapping: function(data){
		ISEUtils.portletUnblocking("pageContainer");
		console.log("data inside callBackGenerateTestCaseBuildMapping");
		console.log(data);
		analyzechanges.job_id = data;
		ISEUtils.portletBlocking("pageContainer");
		//console.log(sessionStorage.getItem('testplanning_predictexecutionId'));
		ISE_Ajax_Service.ajaxPostReq1('PredictionStatusResultsService', 'json', localStorage.authtoken,data,analyzechanges.callBackPredictionResults1);
	},

	callBackPredictionResults1: function(data){
		ISEUtils.portletUnblocking("pageContainer");
		console.log("data inside callBackPredictionResults1");
		console.log(data);
		var res = JSON.stringify(data);
		if((res.indexOf('Disconnecting from Data Base') != -1) || (res.indexOf("Prediction initiated") != -1)) {	
			var jobId = analyzechanges.job_id;
			console.log("jobId"+jobId)
			ISEUtils.portletBlocking("pageContainer");
			ISE_Ajax_Service.ajaxPostReq1('PredictionStatusResultsService', 'json', localStorage.authtoken,jobId,analyzechanges.callBackPredictionResults2);
		}				
	},	
	
	callBackPredictionResults2: function(data){
	ISEUtils.portletUnblocking("pageContainer");
	console.log("data inside callBackPredictionResults2");
	console.log(data);	
	analyzechanges.analyzeData = data;
	analyzechanges.viewAll(data);
	},
	
	viewAll:function(data) {
		
	var data2 = data;//JSON.parse(analyzechanges.analyzeData);	
		$('#pivot_tbl2').DataTable().clear().destroy();
		var html = "";
		html +='<table class="table table-striped table-bordered table-hover" id="pivot_tbl2"><thead><tr><th>TestCase : Environmnet</th><th>FeatureName</th><th>Title</th><th>Passed</th><th>Failed</th></tr></thead><tbody>';			
			for(var i=0;i<data2.length;i++) {				
html += '<tr class="odd gradeX"><td>'+data2[i].TestCase+' : '+data2[i].Environment+'</td><td>'+data2[i].FeatureName+'</td><td>'+data2[i].TITLE+'</td><td>'+data2[i].Passed+'</td><td>'+data2[i].Failed+'</td></tr>';						
//html += '<tr class="odd gradeX"><td>'+data2[i]+' : NA</td><td><a>Upload</a></td><td>data2[i]</td><td>1</td><td>1</td></tr>';						
			}
			html +='</tbody></table>';
		//$('#analyzeDefectsResultsTable').hide();
		$('#analyzeResultsTable').show();
			$('#filterbody').empty();
			$('#filterbody').append(html);
			
			var table = $('#pivot_tbl2');		
		 $.extend(true, $.fn.DataTable.TableTools.classes, {
            "container": "btn-group tabletools-btn-group pull-right",
            "buttons": {
                "normal": "btn btn-sm default",
                "disabled": "btn btn-sm default disabled"
            }
        });

        // begin: third table
        table.dataTable({
				"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
				"tableTools": {
                "sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
                "aButtons": [{
                    "sExtends": "csv",
                    "sButtonText": "CSV"
                }, {
                    "sExtends": "xls",
                    "sButtonText": "Excel"
                }, {
                    "sExtends": "print",
                    "sButtonText": "Print",
                    "sInfo": 'Please press "CTR+P" to print or "ESC" to quit',
                    "sMessage": "Generated by DataTables"
                }, {
                    "sExtends": "copy",
                    "sButtonText": "Copy"
                }]
            },
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
             "language": {
                            "aria": {
                                "sortAscending": ": activate to sort column ascending",
                                "sortDescending": ": activate to sort column descending"
                            },
                            "emptyTable": "No data available in table",
                            "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                            "infoEmpty": "No entries found",
                            "infoFiltered": "(filtered1 from _MAX_ total entries)",
                            "lengthMenu": "Show _MENU_ entries",
                            "search": "Search with in results:",
                            "zeroRecords": "No matching records found"
                        },
            
            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
            // So when dropdowns used the scrollable div should be removed. 
            //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

            "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.
             "columnDefs": [{
                            "orderable": false,
                            "targets": [0]
                        }],
                        "order": [
                            [0, 'desc']
                        ],
            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 5,
            /*"language": {
                "lengthMenu": " _MENU_ records"
            },
            "columnDefs": [{  // set default column settings
                'orderable': false,
                'targets': [0]
            }, {
                "searchable": false,
                "targets": [0]
            }],
            "order": [
                [0, "asc"]
            ] */// set first column as a default sort by asc
        });		
 	
		$("#pivot_div2").removeClass("hide");		
	},
	
	viewExecutions:function() {
	//$('#exec_tbl').DataTable().clear().destroy();
	var data2 = JSON.parse(analyzechanges.analyzeData);	
	
		var html = "";
		html +='<table class="table table-striped table-bordered table-hover"id="exec_tbl1"><thead><tr><th>Environment</th><th>High</th></tr></thead><tbody>';
		for(var i=0;i<data2.length;i++) {				
        html += '<tr class="odd gradeX"><td>'+data2[i].Environment+'</a></td><td>'+data2[i].FLAG+'</td></tr>';						
		}
		html +='</tbody></table>';	
		//$('#analyzeDefectsResultsTable').show();
		$('#analyzeResultsTable').show();
			//$('#defectsFilterbody').empty();
			//$('#defectsFilterbody').append(html);
			$('#filterbody').empty();
			$('#filterbody').append(html);
		
		var table = $('#exec_tbl1');
		 
		 $.extend(true, $.fn.DataTable.TableTools.classes, {
            "container": "btn-group tabletools-btn-group pull-right",
            "buttons": {
                "normal": "btn btn-sm default",
                "disabled": "btn btn-sm default disabled"
            }
        });

        // begin: third table
        table.dataTable({
				"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
				"tableTools": {
                "sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
                "aButtons": [{
                    "sExtends": "csv",
                    "sButtonText": "CSV"
                }, {
                    "sExtends": "xls",
                    "sButtonText": "Excel"
                }, {
                    "sExtends": "print",
                    "sButtonText": "Print",
                    "sInfo": 'Please press "CTR+P" to print or "ESC" to quit',
                    "sMessage": "Generated by DataTables"
                }, {
                    "sExtends": "copy",
                    "sButtonText": "Copy"
                }]
            },
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "Show _MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },
            
            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
            // So when dropdowns used the scrollable div should be removed. 
            //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

            "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.
            
            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 5,
            "language": {
                "lengthMenu": " _MENU_ records"
            },
            /*"columnDefs": [{  // set default column settings
                'orderable': false,
                'targets': [0]
            }, {
                "searchable": false,
                "targets": [0]
            }],*/
            "order": [
                [1, "asc"]
            ] // set first column as a default sort by asc
        });
		
			
		
	},	
	viewFeature:function() {
	//$('#feature_tbl').DataTable().clear().destroy();
	var data2 = JSON.parse(analyzechanges.analyzeData);		
		
		var html = "";
		html +='<table class="table table-striped table-bordered table-hover"id="feature_tbl2"><thead><tr><th>FeatureName</th><th>High</th></tr></thead><tbody>';
		for(var i=0;i<data2.length;i++) {				
        html += '<tr class="odd gradeX"><td>'+data2[i].FeatureName+'</a></td><td>'+data2[i].FLAG+'</td></tr>';						
		}
		html +='</tbody></table>';	
		$('#analyzeResultsTable').show();
		//$('#analyzeDefectsResultsTable').hide();
			$('#filterbody').empty();
			$('#filterbody').append(html);
			
		var table = $('#feature_tbl2');
		 
		 $.extend(true, $.fn.DataTable.TableTools.classes, {
            "container": "btn-group tabletools-btn-group pull-right",
            "buttons": {
                "normal": "btn btn-sm default",
                "disabled": "btn btn-sm default disabled"
            }
        });

        // begin: third table
        table.dataTable({
				"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
				"tableTools": {
                "sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
                "aButtons": [{
                    "sExtends": "csv",
                    "sButtonText": "CSV"
                }, {
                    "sExtends": "xls",
                    "sButtonText": "Excel"
                }, {
                    "sExtends": "print",
                    "sButtonText": "Print",
                    "sInfo": 'Please press "CTR+P" to print or "ESC" to quit',
                    "sMessage": "Generated by DataTables"
                }, {
                    "sExtends": "copy",
                    "sButtonText": "Copy"
                }]
            },
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "Show _MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },
            
            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
            // So when dropdowns used the scrollable div should be removed. 
            //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

            "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.
            
            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 5,
            "language": {
                "lengthMenu": " _MENU_ records"
            },
            /*"columnDefs": [{  // set default column settings
                'orderable': false,
                'targets': [0]
            }, {
                "searchable": false,
                "targets": [0]
            }],*/
            "order": [
                [1, "asc"]
            ] // set first column as a default sort by asc
        });				
	},

	_defectSearchKeyUpFunc: function() {
			var searchDefId = $('#analyzechanges_defectsearchInput').val();
			//var searchDefId = "";
			if(searchDefId == "" || searchDefId == null || searchDefId =='undefined') {
				$("#analyzechanges_defectlistmodalheader").empty();
				$("#analyzechanges_defectlistmodaldata").empty();
				$("#analyzechanges_defectmodalPopupbody").removeClass("hide");				
				document.getElementById("analyzechanges_defectlistmodalheader").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;Please Enter DefectId...";
					
			} else {			
			analyzechanges._onDefectSearchAll(searchDefId);
			}
		},
		
		_onDefectSearchAll: function(searchDefId) {
		analyzechanges.defectId = searchDefId;
		ISEUtils.portletBlocking("pageContainer");
		var requestObject = new Object();
		requestObject.collectionName = "defect_collection"
		requestObject.title ="";
		requestObject.searchString = "_id:" + searchDefId
		requestObject.projectName = localStorage.getItem('projectName');
		requestObject.maxResults = 25;
		requestObject.serachType = "similar"; 
		ISE.getSearchResults(requestObject, analyzechanges._receivedDefectSearchResults);			
		},
			
		_receivedDefectSearchResults : function(data){
	
		console.log(data)
		ISEUtils.portletUnblocking("pageContainer");
	    var requestObject = new Object();
		ISEUtils.portletBlocking("pageContainer");
		requestObject.title = data[0].title;
		requestObject.searchString = data[0].description
		requestObject.projectName = localStorage.getItem('projectName');
		requestObject.maxResults = 25;
		requestObject.serachType = "conextsearch"; 
		requestObject.collectionName = "defect_collection";
		ISE.getSearchResults(requestObject, analyzechanges._receivedResults);	
	    },
			
		_receivedResults:function(data) {
			console.log("_receivedResults data"+data);
			
			var fileNamesArr = new Array();
			var chkBxDefDiv = "";
			for(var i=0;i<data.length;i++) {
				var eachObj = new Object();
				//eachObj.fileslist = data[i].file;
				//var a = new Array();
				//if(data[i].file != undefined){
				//a = (data[i].file).split(",");
				//for(var j=0;j<a.length;j++) {						
					eachObj.build = data[i].build;
					eachObj.id = data[i]._id;
					eachObj.status = data[i].status;
					eachObj.title = data[i].title;
					fileNamesArr.push(eachObj);		
				//}	
				//}
			}			
			//defectsearch.fileDiffCollection = _.uniq(defectsearch.fileDiffCollection.cRsArr);
			//fileNamesArr = _.uniq(fileNamesArr, function (object) { return object.fileslist; })
			console.log("after unique of fileNamesArr");
			 
			console.log("_receivedResults fileNamesArr"+fileNamesArr);
			var defectsArray = new Array();
			
				$("#analyzechanges_defectlistmodalheader").empty();
				$("#analyzechanges_defectlistmodaldata").empty();
				//$("#analyzechanges_filelistmodalLabel").empty();
				
				if(fileNamesArr.length == 0){
					$("#analyzechanges_defectlistmodalheader").empty();
					$("#analyzechanges_defectlistmodaldata").empty();
					$("#analyzechanges_defectmodalPopupbody").removeClass("hide");
					document.getElementById("analyzechanges_defectlistmodalheader").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;No data Available for Searched Defect";
				} else {				
					//checkbox code
					//$("#analyzechanges_filelistmodalLabel").empty();
					$("#analyzechanges_defectlistmodalheader").empty();
					$("#analyzechanges_defectlistmodaldata").empty();
					$("#analyzechanges_defectmodalPopupbody").removeClass("hide");
					$("#analyzechanges_defectmodalPopupFooter").removeClass("hide");					
					chkBxDefDiv += "<div class='portlet box yellow'>"
					chkBxDefDiv += "<div style='padding-top:10px;padding-bottom:10px;padding-left:10px;' class='caption'>Files Found for the Search String - "+"<span style='background-color:yellow'>"+ analyzechanges.defectId +"</span>. <span style='color:blue'>Please Select defects from below...</span></div>"					
					chkBxDefDiv += '<div class="portlet-body" style="height:250px; overflow-y:scroll;"><div class="icheck-list">'
					
					for(var i=0;i<fileNamesArr.length;i++) {
						if(defectsArray.indexOf(fileNamesArr[i].id) == -1){
						
							String.prototype.replaceAll = function(target, replacement) {
							return this.split(target).join(replacement);
							};
							var title_text = (fileNamesArr[i].title).replaceAll('<' , ' ').replaceAll('>',' ');
								if(fileNamesArr[i].build == undefined){
									fileNamesArr[i].build = "";
								}
							chkBxDefDiv += '<label><input type="checkbox" name="defect" id="defId" value="'+fileNamesArr[i].id+'#'
							+title_text+'#'+fileNamesArr[i].status+'#'+fileNamesArr[i].build+'#'+'">'+fileNamesArr[i].id+'</label>'
						}						
					}
					chkBxDefDiv += '</div></div>';					
					$("#analyzechanges_defectlistmodaldata").append(chkBxDefDiv);
					ISEUtils.portletUnblocking("pageContainer");
				}		
		},
		
		_selectedDefectsToAnalyze:function() {	
			 //fileSelected = $('input[name="fileName"]:checked', '#fileNameId').val();
			 //fileSelected = $('input[name="fileName"]:checked').val();
			   var checkboxes = document.querySelectorAll('input[name="defect"]:checked'); 
			   values = [];
				Array.prototype.forEach.call(checkboxes, function(el) {
				values.push(el.value.replaceAll("em class='iseH'","").replaceAll("/em",""));
				});
			 console.log("fileSelected-----------------");
			 console.log(values);
			 
			 //Metronic.unblockUI('analyzechanges_filelistmodal');
			 //alert("Selection Done");  
				filesArr = new Array();
				buildArr = new Array();
			 //var table = $('#analyzechanges_filesChangedTable');
			 $('#defectsTableBody').empty();
			 var tabledata = "";
			for(var i=0;i<values.length;i++) {
				var a = new Array();
				a= values[i].split("#");				
				tabledata +='<tr id="tr_'+a[0].trim()+'">';
			tabledata +='<td><input type="checkbox"  name="defectSrchCheckbox" id="'+a[0].trim()+'"></td>';
				tabledata +='<td>'+a[0].trim()+'</td>';
				tabledata +='<td>'+a[1]+'</td>';
				tabledata +='<td>'+a[2]+'</td>';
				tabledata +='<td>'+a[3]+'</td>';
				tabledata +='<td valign="middle" align="center"><img src="images/wrong.png" width="12px" value="'+a[0].trim()+'#'+a[1].trim()+'" onclick=analyzechanges.fn_clearDefectsChangedTB("'+a[0].trim()+'")></td>';
				tabledata +='</tr>';
							
			 }
			 $('#defectsTableBody').append(tabledata);
			 $('.modal-backdrop').remove();
			//table.append(tabledata);			 
	},
	
	fn_clearDefectsChangedTB:function(defId) {		
		var node =  document.getElementById('tr_'+defId);
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}			
	},
	
	callBackGetDefect:function(data){
		//ISEUtils.portletUnblocking("pageContainer");
		if($('#defectsTableBody >tr >td >input[type=checkbox]:checked').length>0){
		 $("#analyzechanges_defectsDetails .defect-select-error").hide();
		var defArry = [];			
		$('#defectsTableBody >tr >td >input[type=checkbox]:checked').each(function () {			
			var value = this.id;
			//console.log("--247--"+value);			
				if(value !=undefined && value !=null){
					value='"'+value+'"';
					if(defArry.indexOf(value) == -1){
						defArry.push(value);
					}	
				}
			
		});
		if(defArry.length != 0){
       ISEUtils.portletBlocking("pageContainer");
		var defString="";
		for(var i=0;i<defArry.length;i++){
			defString += "_id:"+defArry[i]+" OR ";				
		}
			defString="("+defString.slice(0,-3)+")"			
			
		var requestObject = new Object();
		requestObject.collectionName = "defect_collection";
		requestObject.projectName = localStorage.getItem('projectName');
		requestObject.searchString = defString;
		ISE.getFilteredDefectsSearchResults(requestObject, analyzechanges._receivedFilteredDefectsSearchResults);
		}		
		}else{
		  $("#analyzechanges_defectsDetails .defect-select-error").show();
		}
	},
	
	_receivedFilteredDefectsSearchResults:function(data) {
			console.log(data);
			
			var fileNamesArr = new Array();
			for(var i=0;i<data.length;i++) {
					
					//eachObj.fileslist = data[i].file;
					var a = new Array();
					if(data[i].file != undefined){
					a = (data[i].file).split(",");
					for(var j=0;j<a.length;j++) {
					    var eachObj = new Object();
						eachObj.fileslist = a[j].replace("]","");
						eachObj.fileslist = eachObj.fileslist.replace("[","");
						eachObj.fileslist = eachObj.fileslist.replace(" ","");						
						eachObj.build = data[i].build;
						eachObj.id = data[i]._id;
						eachObj.status = data[i].status;
						//searchfile = data[i].searchFile;
						fileNamesArr.push(eachObj);		
					}	
					}
			}			
			fileNamesArr = _.uniq(fileNamesArr, function (object) { return object.fileslist; })
			console.log("after unique of fileNamesArr");
			 
			console.log("fileNamesArr---->"+fileNamesArr);
			console.log("fileNamesArr.length---->"+fileNamesArr.length);
			var fileNames = new Array();				
			var tabledata = "";		
			for(var i=0;i<fileNamesArr.length;i++) {
				if(fileNames.indexOf(fileNamesArr[i].fileslist) == -1){
				if(analyzechanges.selectedFilesToAnalyze.indexOf(fileNamesArr[i].fileslist) == -1){
				    fileNames.push(fileNamesArr[i].fileslist);
					analyzechanges.selectedFilesToAnalyze.push(fileNamesArr[i].fileslist);
					analyzechanges.associatedbuildsforfiles.push(fileNamesArr[i].build);
					//chkBxFileDiv += '<label><input type="checkbox" name="fileName" id="fileNameId" value="'+fileNamesArr[i].fileslist+'#'
					//+fileNamesArr[i].build+'#'+fileNamesArr[i].id+'#'+fileNamesArr[i].status+'#'+'">'+fileNamesArr[i].fileslist+'</label>'
					tabledata +='<tr id="tr_'+fileNamesArr[i].fileslist+'">';
					tabledata +='<td>'+fileNamesArr[i].fileslist+'</td>';
					tabledata +='<td>'+fileNamesArr[i].id+'</td>';
					tabledata +='<td>'+fileNamesArr[i].status+'</td>';
					tabledata +='<td valign="middle" align="center" style="width:100px;text-align:center" title="This element is not considered for the Analysis">'+fileNamesArr[i].build+'</td>';
					tabledata +='<td valign="middle" align="center"><img src="images/wrong.png" width="12px" value="'+fileNamesArr[i].fileslist+'#'+fileNamesArr[i].build+'" onclick=analyzechanges.fn_clearFilesChangedTB("'+fileNamesArr[i].fileslist+'#'+fileNamesArr[i].build+'")></td>';
					tabledata +='</tr>';
				}
				}				
			}
			console.log("_receivedFilteredDefectsSearchResults FilesToAnalyze"+analyzechanges.selectedFilesToAnalyze.length);
		    console.log("_receivedFilteredDefectsSearchResults buildsforfiles"+analyzechanges.associatedbuildsforfiles.length);
			$('.nav-tabs a[href="#filesTab"]').tab('show')
			$('#filesTableBody').append(tabledata);
			$('#pivot_tbl2').DataTable().clear().destroy();
			$('#analyzeResultsTable').hide();
			ISEUtils.portletUnblocking("pageContainer");
			},
	_fileDetails:function(file,fid) {
		window.open("../DevTest/services/CasaResultsEx.html?filename="+file, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=63,left=300,width=590,height=350");
	}
			
};

