 var regressionOptimization = {
	//SURESH
	tcList : [],
	uniqList: [],
	recSet : {},
	configData1 : {},
	testBedDist : [],
	optResults : {},
	settings:{},	
	//optSettings : {},
	//totalExe : 150,
	//SURESH
	featureArr: [],
	relaseArr:[],
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
    /* Init function  */
    init: function() {		
        console.log("regression_optimization init()");   
		var projectName = localStorage.getItem('projectName');
		regressionOptimization.getBuilds();
		regressionOptimization.calculateMaxNoTestcase();
		
		//regressionOptimization.getTestExecutionData();
		//regressionOptimization.codeElementsData();		
		//$('#jstree').on('loaded.jstree', regressionOptimization.treeLoaded){
		
		//},
		//$("#jstree").jstree(true).load_node('#');
		regressionOptimization.getAllFeatureHelper();	
		//console.log("data -- "+JSON.stringify(regressionOptimization.featureArr));			
		regressionOptimization.getEnvironmentHelper();
		/* if(!regressionOptimization.isFromJson)
			regressionOptimization.getEnvBrowerMarketByTestExe();
		else			
			regressionOptimization.StartMethods(); */
		//regressionOptimization.loadRegOptPlan();
		regressionOptimization.loadRegressionResults();
		
     },
	 
	 treeLoaded:function(event, data){	
		data.instance.select_node(regressionOptimization.rbArry); //node ids that you want to check
	 },
	 getEnvBrowerMarketByTestExe:function(){
		var data = '{"fileName":"get_unq_environments","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,regressionOptimization.callBackGetEnvBrowseMarketByTestExec);
	 },
	 
	 callBackGetEnvBrowseMarketByTestExec:function(data){
		regressionOptimization.envsArry	= data;
		//console.log("---50---"+JSON.stringify(data))
		regressionOptimization.getBrowersData();
	 },
	 
	 getBrowersData:function(){
		var data = '{"fileName":"get_unq_browsers","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,regressionOptimization.callBackGetBrowsesData);
	 },
	 
	 callBackGetBrowsesData:function(data){
		regressionOptimization.browseArry	= data;
		//console.log("---61---"+JSON.stringify(data))
		regressionOptimization.getMarketsData();
	 },
	 
	 getMarketsData:function(){
		var data = '{"fileName":"get_unq_makets","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,regressionOptimization.callBackGetMarketsData);
	 },
	 
	 callBackGetMarketsData:function(data){
		regressionOptimization.marketArry	= data;
		//console.log("---marktet---"+JSON.stringify(regressionOptimization.marketArry))
		//console.log("---browser---"+JSON.stringify(regressionOptimization.browseArry))
		//console.log("---env---"+JSON.stringify(regressionOptimization.envsArry))
		var envBrowers = {"OS":regressionOptimization.envsArry,"Browser":regressionOptimization.browseArry,"Market":regressionOptimization.marketArry};
		//console.log("---envBrowers---"+JSON.stringify(envBrowers))
		regressionOptimization.configData1 = envBrowers;
		$.each(envBrowers, function(key, item) {
			regressionOptimization.addConfigs(key, item);
		});
	 },	
	 
	loadRegOptPlan:function(){
		var param=[]
		var planName = "svdplan";	
		var fileName = "RegressionPlanReloadQuery";	
		var fromCache="false"		
		param[0]="PARAM1="+planName;		
		var data = "{fileName:'"+fileName+"',params:'"+param+"',projectName:'"+localStorage.getItem('projectName')+"',fromCache:'"+fromCache+"'}";	
		ISE_Ajax_Service.ajaxPostReq('QueryReportingRestService', 'json', localStorage.authtoken,data,regressionOptimization.callBackloadRegOptPlan);
	},	
	
	callBackloadRegOptPlan:function(options){
		//console.log("loadRegressionPlanData ---> "+JSON.stringify(options));
		var options_key =[];
		var options_type =[];
		var options_val =[];		
		var defectPkArr=[];
		var defectDisplayArr=[];
		if(undefined != options && options.length>0){
			for(var i=0;i<options.length;i++){					
				options_key.push(options[i].option_key);
				options_type.push(options[i].option_type);
				options_val.push(options[i].option_value);
			}
			
			if( null != options_type && undefined != options_type){
				for (var i = 0; i < options_key.length; i++) {	
					if(options_type[i]=='BUILDS'){
						var key = options_key[i].trim();
						var val = options_val[i].trim();
						//regressionOptimization.rbArry.push(key);
						//console.log("key - "+key+": val - "+val);
					}if(options_type[i]=='FEATURES'){
						var key = options_key[i].trim(); 
						var val = options_val[i].trim();						
						//console.log("key - "+key+": val - "+val);
						var fetures = _.where(regressionOptimization.featureKeys, {fetval: key});
						$('#'+fetures[0].id).attr('checked',true);
						$('#'+fetures[0].ddid).val(val)
					}
				}
			
			}
		}
	}, 
	 
	getBuilds:function(){		
		var data = '{"fileName":"get_builds","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('QueryReportingRestService', 'json', localStorage.authtoken,data,regressionOptimization.callBackGetBuilds);
		
	},
	
	callBackGetBuilds:function(data){
		regressionOptimization.buildsArry=data;
		regressionOptimization.getTestExecutionData();
		//console.log("buildsdata ---> "+JSON.stringify(data))
		//console.log("buildsdata ---> "+JSON.stringify(regressionOptimization.buildsArry))
		
	},
	getTestExecutionData:function(){
		var data = '{"fileName":"release_test_exec","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,regressionOptimization.callBackGetTestExecutionsData);
	},
	callBackGetTestExecutionsData:function(data){
		regressionOptimization.testExecutionArry = data;
		//console.log("testExectionsdata ---> "+JSON.stringify(regressionOptimization.testExecutionArry));		
		regressionOptimization.codeElementsData();
	  
	},
	codeElementsData:function(){
		var data = '{"fileName":"unq_builds_from_code_elements_by_date","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,regressionOptimization.callBackcodeElementsData);
	},
	callBackcodeElementsData:function(data){
		regressionOptimization.codeElmentsArry = data;
		//console.log("codeElementData ---> "+JSON.stringify(regressionOptimization.codeElmentsArry));
		var releaseArry = regressionOptimization.getReleaseBuilds("L");
		//console.log(""+JSON.stringify(releaseArry));

		$('#jstree').jstree({			
			"core" : {
			"themes" : {
			"variant" : "large"
			},
			'data' : releaseArry
			},	  

			"plugins" : [ "wholerow", "checkbox" ]
		});
		
		$('#jstree').on("changed.jstree", function (e, releaseArry) {
			//console.log("----------"+releaseArry.selected);
			regressionOptimization.relaseArr=[];
			regressionOptimization.relaseArr.push(releaseArry.selected);
		});
		$("#jstree").attr('disabled','disabled');
	},	  
	 
	loadRegressionResults:function(){	
		var param =[];
		var fromCache ="false";
		var planName ="svdplan";		
		param[0]="PARAM1="+planName;
		var fileName = "get_jobid_by_plan";		
		var data = "{fileName:'"+fileName+"',params:'"+param+"',projectName:'"+localStorage.getItem('projectName')+"',fromCache:'"+fromCache+"'}";		
		ISE_Ajax_Service.ajaxPostReq('QueryReportingRestService', 'json', localStorage.authtoken,data,regressionOptimization.callBackplanData);
		
		
	},
	  
	callBackplanData:function(data){
		if(null !=data && undefined != data && data.length>0){
			console.log("recommandationId -- "+data[0].recommendation_executionid+" *****optimizationId*******"+data[0].optimization_executionid);
			regressionOptimization.loadRegressionTCresults(data[0].recommendation_executionid);
			//regressionOptimization.loadOptimizeTCresults(data[0].optimization_executionid);	
			regressionOptimization.optimizeId = data[0].optimization_executionid;
		}
	},
	  
	loadRegressionTCresults:function(recId){
		var param =[];
		var fromCache ="false";
		param[0]="PARAM1="+recId;		
		var fileName = "get_regression_testcase_results";
		var data = "{fileName:'"+fileName+"',params:'"+param+"',projectName:'"+localStorage.getItem('projectName')+"',fromCache:'"+fromCache+"'}";		
		ISE_Ajax_Service.ajaxPostReq('QueryReportingRestService', 'json', localStorage.authtoken,data,regressionOptimization.callBackGetRegressionResults);
	},	  
	  callBackGetRegressionResults:function(data){
		//console.log("load RegressionResults *************"+JSON.stringify(data));
		regressionOptimization.recommendTCsArr = data;	
		regressionOptimization.callBackRegressionResults(data);					
				
	},
	  
	loadOptimizeTCresults:function(optimizeId){
		var param =[];
		var fromCache ="false";
		param[0]="PARAM1="+optimizeId;		
		var fileName = "get_regression_testcase_results";
		var data = "{fileName:'"+fileName+"',params:'"+param+"',projectName:'"+localStorage.getItem('projectName')+"',fromCache:'"+fromCache+"'}";		
		ISE_Ajax_Service.ajaxPostReq('QueryReportingRestService', 'json', localStorage.authtoken,data,regressionOptimization.callBackOptimizeTCresults);
	},	
	  
	callBackOptimizeTCresults:function(data){
		//console.log("load optimize results *************"+JSON.stringify(data));
		regressionOptimization.callBackOptimizationResults(data);
		regressionOptimization.optimizeTCsArr = data;
		//regressionOptimization.geenerateOptimizationOrder();		
				
	},	  
    	
	getAllFeatureHelper:function(){
		var data = '{"newfeaturedate":"30"}';		
		ISE_Ajax_Service.ajaxPostReq('MongoInputFeaturesDAOService', 'json', localStorage.authtoken,data,regressionOptimization.callBackgetFeatureData);
	},
	callBackgetFeatureData:function(data){
		//console.log("getAllFeatures --- "+JSON.stringify(data));		
		for(var i=0;i<data.length;i++){
			var obj={};
			obj.id =data[i].id;
			obj.text =data[i].title;
			obj.higher =data[i].parent;			
			obj.isNew =data[i].isNew;
			obj.flag =data[i].flag;
			regressionOptimization.featureArr.push(obj);
			if(data[i].children && data[i].children != null && data[i].children != undefined) {
			for(var x=0;x<data[i].children.length;x++) {
				var obj={};
				obj.id =data[i].children[x].id;
				obj.text =data[i].children[x].title;
				obj.higher =data[i].children[x].parent;			
				//obj.isNew =data[i].isNew;
				obj.flag =data[i].children[x].flag;
				regressionOptimization.featureArr.push(obj);
			}
			}
		}
		$('#feature_jstree').jstree({
			"core" : {
			"themes" : {
			"variant" : "large"
			},
			'data' : ""
			},	  

			"plugins" : [ "wholerow", "checkbox" ]
		});		
		
		regressionOptimization.constructingTable(regressionOptimization.featureArr);		
		regressionOptimization.loadRegOptPlan();
	},
	
	constructingTable:function (featureDisplayArr){		
		$('#feature_div').empty(); 	
		var rs="";		
		
		var b = true;
		rs += '<table  width="100%" border="0" cellspacing="1" cellpadding="1" class="table table-bordered table-hover" style="color: #333;"><tr  style="background-color:#D4D8D9"><td style="border-bottom:1px #E8E8E8 solid;padding:2px;width:50px;"><b>Select</b></td><td style="border-bottom:1px #E8E8E8 solid;padding:2px;width:50px;"><b>Feature</b></td><td style="border-bottom:1px #E8E8E8 solid;padding:2px;width:50px;"><b>Priority</b></td></tr>';
		var fet=0;
		for(var i=0; i<featureDisplayArr.length;i++){
			var fetKeyObj = {};
			fet++;
			fetKeyObj.id = "FET"+fet.toString();
			fetKeyObj.fetval = featureDisplayArr[i].id;
			fetKeyObj.ddid = "FETDD"+fet.toString();
			
			regressionOptimization.featureKeys.push(fetKeyObj);		
			
			if(featureDisplayArr[i].higher == "true"){
				if(b){						
				b = false;
				//rs += '<tr style="background-color:white;"><td><input type="checkbox" name="regOptFeatureCheckbox"  onClick=""  id="'+ featureDisplayArr[i].id +'" ></td><td>' + featureDisplayArr[i].id + '</td><td><select id="feature_' + featureDisplayArr[i].id + '" onchange=""><option value="HIGH">HIGH</option>  <option value="LOW">LOW</option> </select></td></tr>';
				rs += '<tr style="background-color:white;"><td><input type="checkbox" name="regOptFeatureCheckbox"  onClick=""  id="'+ fetKeyObj.id +'" ></td><td>' + featureDisplayArr[i].id + '</td><td><select id="'+ fetKeyObj.ddid + '" onchange=""><option value="HIGH">HIGH</option>  <option value="LOW">LOW</option> </select></td></tr>';
				} else{						
					b = true;
					//rs += '<tr style="background-color:#F0F2F2;"><td><input type="checkbox" name="regOptFeatureCheckbox"  onClick=""  id="'+ featureDisplayArr[i].id +'" ></td><td>' + featureDisplayArr[i].id + '</td><td><select id="feature_' + featureDisplayArr[i].id + '"  onchange="" ><option value="HIGH">HIGH</option>  <option value="LOW">LOW</option> </select></td></tr>';
					rs += '<tr style="background-color:#F0F2F2;"><td><input type="checkbox" name="regOptFeatureCheckbox"  onClick=""  id="'+ fetKeyObj.id +'" ></td><td>' + featureDisplayArr[i].id + '</td><td><select id="'+ fetKeyObj.ddid + '" onchange="" ><option value="HIGH">HIGH</option>  <option value="LOW">LOW</option> </select></td></tr>';
				}	
			}	
			else{
				if(b){						
				b = false;
				//rs += '<tr style="background-color:white;"><td><input type="checkbox" name="regOptFeatureCheckbox" style="paddingLeft:100px" onClick=""  id="'+ featureDisplayArr[i].id +'" ></td><td>' + featureDisplayArr[i].id + '</td><td><select id="feature_' + featureDisplayArr[i].id +'" onchange=""><option value="HIGH">HIGH</option>  <option value="LOW">LOW</option> </select></td></tr>';
				rs += '<tr style="background-color:white;"><td><input type="checkbox" name="regOptFeatureCheckbox" style="paddingLeft:100px" onClick=""  id="'+ fetKeyObj.id +'" ></td><td>' + featureDisplayArr[i].id + '</td><td><select id="'+ fetKeyObj.ddid + '" onchange=""><option value="HIGH">HIGH</option>  <option value="LOW">LOW</option> </select></td></tr>';
				} else{						
					b = true;
					//rs += '<tr style="background-color:#F0F2F2;"><td><input type="checkbox" name="regOptFeatureCheckbox" style="paddingLeft:100px" onClick=""  id="'+ featureDisplayArr[i].id +'" ></td><td>' + featureDisplayArr[i].id + '</td><td><select id="feature_' + featureDisplayArr[i].id +'" onchange=""><option value="HIGH">HIGH</option>  <option value="LOW">LOW</option> </select></td></tr>';
					rs += '<tr style="background-color:#F0F2F2;"><td><input type="checkbox" name="regOptFeatureCheckbox" style="paddingLeft:100px" onClick=""  id="'+ fetKeyObj.id +'" ></td><td>' + featureDisplayArr[i].id + '</td><td><select id="'+ fetKeyObj.ddid + '" onchange=""><option value="HIGH">HIGH</option>  <option value="LOW">LOW</option> </select></td></tr>';
				}	
			}
			
		}						
															   
		$('#feature_div').append(rs + '</table>'); 			
		
	},
	
	
	getReleaseBuilds:function(buildType){	
		console.log("------------releaseTree-------------- ");				
		var resultsArry=[];
		if(buildType =='L') { 
			//var testExecReleaseData = ISEUtils.getDynamicDataByParams("release_test_exec", "", "mongoMapReduce", false);	
			var testExecBuilds=[];
			if(undefined != regressionOptimization.testExecutionArry && null != regressionOptimization.testExecutionArry && regressionOptimization.testExecutionArry.length>0 && regressionOptimization.buildsArry.length>0){
				for(var i=0;i<regressionOptimization.buildsArry.length;i++){
					for(var j=0;j<regressionOptimization.testExecutionArry.length;j++){
						if(regressionOptimization.testExecutionArry[j].build == regressionOptimization.buildsArry[i].build && regressionOptimization.testExecutionArry[j].release == regressionOptimization.buildsArry[i].release){
							var obj = new Object();							
							obj.build = regressionOptimization.buildsArry[i].build;
							obj.release=regressionOptimization.buildsArry[i].release;
							obj.build_type=regressionOptimization.buildsArry[i].build_type;
							obj.wt_distribution=regressionOptimization.buildsArry[i].wt_distribution;
							obj.created_date=regressionOptimization.buildsArry[i].created_date;
							
							testExecBuilds.push(obj);
							break;
						}
					}
				}
				//console.log("testExecBuilds *** "+JSON.stringify(testExecBuilds))
				resultsArry = regressionOptimization.formatParentChildReleationArry(testExecBuilds);
			}
		} else if(buildType =='T'){
			
			var codeElementBuilds=[];
			var counter=0;
			if(undefined != regressionOptimization.codeElmentsArry && null != regressionOptimization.codeElmentsArry && regressionOptimization.codeElmentsArry.length>0 && regressionOptimization.buildsArry.length>0){	
				for(var i=0;i<regressionOptimization.buildsArry.length;i++){
					for(var j=0;j<regressionOptimization.codeElmentsArry.length;j++){
						if(regressionOptimization.codeElmentsArry[j].build == regressionOptimization.buildsArry[i].build && regressionOptimization.codeElmentsArry[j].release == regressionOptimization.buildsArry[i].release){
							var obj = new Object();							
							obj.build = regressionOptimization.buildsArry[i].build;
							obj.release=regressionOptimization.buildsArry[i].release;
							obj.build_type=regressionOptimization.buildsArry[i].release;
							obj.wt_distribution=regressionOptimization.buildsArry[i].wt_distribution;
							obj.created_date=regressionOptimization.buildsArry[i].created_date;
							
							codeElementBuilds.push(obj);
							break;
						}
					}
				}
				//console.log("codeElementBuilds === "+JSON.stringify(codeElementBuilds))
			
				resultsArry = regressionOptimization.formatParentChildReleationArry(codeElementBuilds);
			}			
		} else{		
			//var builds = ISEUtils.getDynamicDataByParams("get_builds", "", "mongo", false);				
			if(undefined != regressionOptimization.buildsArry && null != regressionOptimization.buildsArry && regressionOptimization.buildsArry.length>0){				
				resultsArry = regressionOptimization.formatParentChildReleationArry(regressionOptimization.buildsArry);
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
						relObj.higher = "true";								
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
	  
	generateFetchTestcases: function() {
		ISEUtils.portletBlocking("buckets")
		$('#tabUL a[href="#recomondationsTab"]').trigger('click');
		var featureVals = [];
		var releaseBuildVals=[];
		$('#feature_div input[type=checkbox]:checked').each(function () {			
			//var value = this.id;
			var fetures = _.where(regressionOptimization.featureKeys, {id: this.id});
			var featurePriorDD = this.parentElement.nextSibling.nextSibling.childNodes[0].value;			
			featureVals.push(fetures[0].fetval+"|"+featurePriorDD);			
			
		});
		
		//need to uncomment for release tree
		/*
		for(var i=0;i<regressionOptimization.relaseArr[0].length;i++){			
			releaseBuildVals.push(regressionOptimization.relaseArr[0][i]);
		}*/
		releaseBuildVals=[]
		//console.log("relaseArr -------"+regressionOptimization.relaseArr);
		console.log("releaseBuildVals -------"+JSON.stringify(releaseBuildVals));
		console.log("featureVals -------"+JSON.stringify(featureVals));
		
		var defectIds=[];
		var planName="svdplan"		
		//console.log("releaseBuildVals---------"+JSON.stringify(releaseBuildVals));
		//buildIds -----> 15.2 :true:L,16.100000000000001 :true:L,17.100000000000001 :true:L,18.2 :true:L,19.100000000000001 :true:L,20.100000000000001 :true:L,21.1 :true:L,21.1 :true:T,21.2 :true:T,20.2 :true:T,19.100000000000001 :true:T,18.2 :true:T,18.100000000000001 :true:T,17.2 :true:T 
		//DefectIds -----> 786744,781293,749505,761897,773706 
		//FeaturesExtra -----> browser|LOW,browsing|LOW,button|HIGH,cache|LOW,chat|HIGH,click-to-play|HIGH,collapse|LOW,context menu|HIGH,bookmark|LOW,breakpad|HIGH 
		//planName -----> svdplan
		//getRecommandTestcases(buildIds,defectIds,featuresExtra,planName);
		var data = '{"requesttype":"recommendTCs","buildIds":"'+releaseBuildVals+'","defectIds": "'+defectIds+'","features": "'+featureVals+'","planId": "'+planName+'"}';
		ISE_Ajax_Service.ajaxPostReq('RegressionOptimizationRestFulService', 'json', sessionStorage.authtoken,data,regressionOptimization.callBackRegressionResults);	
		
		
	},	
	callBackRegressionResults:function(data){
		console.log("--- callBackRegressionResults is calling .........")
		//console.log("REGRESSION RESULTS -- "+JSON.stringify(data))
		$('#buckets').empty();
		regressionOptimization.recSet = data[0];
		regressionOptimization.tcList = [];
		var len=0;
		$.each(data[0].buckets, function(key, item) {
			console.log("r");
			if(item && null!=item)
				len=item.length;
			regressionOptimization.addBucket(key,len,false);
			if(item && null!=item){
				$.each(item, function(keyTC, itemTC) {
					var TC = _.where(regressionOptimization.tcList, {testcase: itemTC.testcase});
					if(TC.length <= 0){
						itemTC.rag_value = itemTC.rag_value/100;
						itemTC.testbed="NA";
						regressionOptimization.tcList.push(itemTC);
					}
				});	
			}			
		});
		console.log("len----470--"+regressionOptimization.tcList.length)
		//$('#regressionUnqTCs').val(regressionOptimization.tcList.length)
		
		$.each(regressionOptimization.tcList, function(keyTC, itemTC) {	
			//adding type columns and initilizing with flase
			$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
				itemTC[keyBTC]=false;
			});
			
			$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
				var bTC = _.where(itemBTC, {testcase: itemTC.testcase});
				if(bTC.length > 0)
					itemTC[keyBTC]=true;
			});
		});
		console.log("------488---optimizeId--"+regressionOptimization.optimizeId)
		ISEUtils.portletUnblocking("buckets");
		regressionOptimization.loadOptimizeTCresults(regressionOptimization.optimizeId);	
	},
	

	getEnvironmentHelper:function(){
		var data = '{"fileName":"get_environments","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('QueryReportingRestService', 'json', localStorage.authtoken,data,regressionOptimization.callBackgetEnvironmentsHelper);
	},
	callBackgetEnvironmentsHelper:function(data){
		//console.log("environments -- "+JSON.stringify(data))
		
		regressionOptimization.addTestBeds(data);
		if(!regressionOptimization.isFromJson)
			regressionOptimization.getEnvBrowerMarketByTestExe();
		else			
			regressionOptimization.StartMethods();
		if(null != data && data.length>0){
			regressionOptimization.totalEnvCount = data.length;
		}
	},
	//SURESH
	
geenerateOptimizationOrder:function() {
	//ISEUtils.portletBlocking("opt_buckets")
	var isMinGreater = false;
	//testBedDist = new Array(); 
		var vals = new Array();
		var totalDistribution = 0
		regressionOptimization.testBedDist = new Array();
	/* $('#testbed input[type=checkbox]:checked').each(function () {
		var tb=new Object();
		tb.name = this.value;
		//tb.dist=this.parentElement.parentElement.parentElement.parentElement.childNodes[2].childNodes[0].value; //this needs to be modified with jquery
		tb.dist=this.parentElement.parentElement.childNodes[2].childNodes[0].value;
		totalDistribution = totalDistribution+parseInt(tb.dist);
		regressionOptimization.testBedDist.push(tb);
      }); */
		
	  var oTable = $('#testbeds').dataTable();
	  var ckdData = $('input[type=checkbox]:checked', oTable.fnGetNodes() );
	  for(var z=0;z<ckdData.length;z++) {
		var tb=new Object();
		tb.name = ckdData[z].value;
		tb.dist = ckdData[z].parentElement.parentElement.childNodes[2].childNodes[0].value;
		totalDistribution = totalDistribution+parseInt(tb.dist);
		regressionOptimization.testBedDist.push(tb);
	  }	
	  if(totalDistribution != 100) {
		alert("Testbeds not selected or Total distribution should match to 100%");
		return;
	  }
	  $('#tabUL a[href="#optimizationsTab"]').trigger('click');
	  
	var reqCountSplt = 0;	
	regressionOptimization.recSet.settings = new Object();
	$.each(regressionOptimization.recSet.buckets, function(key, item) {
		var vals = new Array();
		$('#SptRpt_'+key+' input[type=radio]:checked').each(function () {
			if(this.value=="Repeat")
				regressionOptimization.recSet.settings[key+"isRpt"]=true;
			else
				regressionOptimization.recSet.settings[key+"isRpt"]=false;
		});
		var itemlen=0;
		if(null != item && item)
		 itemlen =item.length;
		var minVal = parseInt($('#Min_'+key).text())
		if(minVal>itemlen){
			isMinGreater = true;
			console.log(" 565 min value "+minVal+"  must not be greater than "+itemlen+" size of "+key)
			alert("min value "+minVal+"  must not be greater than "+itemlen+" size of "+key)
		} 
		console.log(" 566- "+$('#Min_'+key).text())
		regressionOptimization.recSet.settings[key+"Min"]=$('#Min_'+key).text();
		regressionOptimization.recSet.settings[key+"Pref"]=$('#Pref_'+key).text();
		regressionOptimization.recSet.settings[key+"Pic"]=0;
		regressionOptimization.recSet.settings[key+"Wt"]=$('#Wt_'+key).text();	
		if(!regressionOptimization.recSet.settings[key+"isRpt"])
			reqCountSplt=reqCountSplt+regressionOptimization.recSet.settings[key+"Pref"];
	});
	
	//getting the each testbed required counts and
	$.each(regressionOptimization.testBedDist, function(keyTB, itemTB) {
		//itemTB.tcCount = (regressionOptimization.totalExe-reqCountSplt)*itemTB.dist/100 ;
		itemTB.tcCount = ($('#maxNoOfTestCases').val()-reqCountSplt)*itemTB.dist/100 ;
	});

	//apply lower test bed distribution test cases all required testbeds and so on
	var tbDistSort = _.sortBy(regressionOptimization.testBedDist, function (object) { return (object.tcCount); });
	
	//get required count by distribution
	var reqCount = 0;
	//var reqCountSplt = 60;
	$.each(tbDistSort, function(keyTB, itemTB) {
		reqCount = itemTB.tcCount;
	});
	//adding min,pref vaues to each bucket it should be getting from UI or config
	//regressionOptimization.recSet.settings = new Object();
	$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
		//regressionOptimization.recSet.settings[keyBTC+"Min"]=itemBTC.length*30/100;
		//regressionOptimization.recSet.settings[keyBTC+"Pref"]=regressionOptimization.recSet.settings[keyBTC+"Min"]*3;
		//regressionOptimization.recSet.settings[keyBTC+"Pic"]=0;
		//regressionOptimization.recSet.settings[keyBTC+"isRpt"]=true;
		//regressionOptimization.recSet.settings[keyBTC+"Wt"]=1;
		regressionOptimization.recSet.settings[keyBTC+"Prb"]="standard_prob";
		
		if(keyBTC == "UST") {
			//regressionOptimization.recSet.settings[keyBTC+"isRpt"]=false;
			//regressionOptimization.recSet.settings[keyBTC+"Pref"] = 60;
			regressionOptimization.recSet.settings[keyBTC+"Prb"]="rag_value";
		}
		if(keyBTC == "GT") {
			regressionOptimization.recSet.settings[keyBTC+"Prb"]="thresold_prob";
			//regressionOptimization.recSet.settings[keyBTC+"isRpt"]=false;
			//regressionOptimization.recSet.settings[keyBTC+"Pref"] = 20;
		}
		if(keyBTC == "ST") {
			regressionOptimization.recSet.settings[keyBTC+"Prb"]="thresold_prob";
		}
		regressionOptimization.recSet.settings[keyBTC+"PrefU"]=0;
		$.each(tbDistSort, function(keyTB, itemTB) {
			if(regressionOptimization.recSet.settings[keyBTC+"isRpt"])
				regressionOptimization.recSet.settings[keyBTC+"PrefU"] = regressionOptimization.recSet.settings[keyBTC+"Pref"]*itemTB.dist/100 ;
			else {
				regressionOptimization.recSet.settings[keyBTC+"PrefU"] = regressionOptimization.recSet.settings[keyBTC+"Pref"];
				reqCountSplt = reqCountSplt+regressionOptimization.recSet.settings[keyBTC+"Pref"];
				}
		});
	});
	//regressionOptimization.recSet.settings["USTisRpt"]=false;
	
	//Traversing each tc and applying probablity adding types also in each bucket
	$.each(regressionOptimization.tcList, function(keyTC, itemTC) {
		itemTC.pobability = 0;
		itemTC.standard_prob = 1;
		itemTC.type = new Array();
		
		//adding type columns and initilizing with flase
		$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
			itemTC[keyBTC]=false;
		});
		
		$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
			var bTC = _.where(itemBTC, {testcase: itemTC.testcase});
			if(bTC.length > 0)
			{
				itemTC[keyBTC]=true;
				itemTC.pobability = itemTC.pobability+(parseFloat(itemTC[regressionOptimization.recSet.settings[keyBTC+"Prb"]])*regressionOptimization.recSet.settings[keyBTC+"Wt"]);
			}
		});
	});
	
	//Ordering by probability
	var allSort = _.sortBy(regressionOptimization.tcList, function (object) { return -(object.pobability); });
	
	//Min validation
	$.each(allSort, function(key, item) {
		item.picked = false;
		var pick=false;
		$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
			if(item[keyBTC]) {
				if(regressionOptimization.recSet.settings[keyBTC+"isRpt"]) {
					if(regressionOptimization.recSet.settings[keyBTC+"Pic"]<regressionOptimization.recSet.settings[keyBTC+"Min"])
						pick = true;
				}
			}
		});
		
		if(pick) {
			$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
				if(item[keyBTC])
					regressionOptimization.recSet.settings[keyBTC+"Pic"]++;
			});
			item.picked=true;
		}
	});
	var xxxx = _.where(allSort, {picked: true});
	//Preferred validation
	$.each(allSort, function(key, item) {
		if(!item.picked) {
			var pick=false;
			$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
				if(item[keyBTC]) {
					if(regressionOptimization.recSet.settings[keyBTC+"isRpt"]) {
						if(regressionOptimization.recSet.settings[keyBTC+"Pic"]<regressionOptimization.recSet.settings[keyBTC+"PrefU"])
							pick = true;
					}
				}
			});
			
			if(pick) {
				$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
					if(item[keyBTC])
						regressionOptimization.recSet.settings[keyBTC+"Pic"]++;
				});
				item.picked=true;
			}
		}
	});
	var yyyy = _.where(allSort, {picked: true});
	
	//If all preferred counts less than required counts
	if(yyyy.length < reqCount) {
		var availCount = yyyy.length;
		$.each(allSort, function(key, item) {
			if(!item.picked && availCount < reqCount) {
				item.picked=true;
				availCount++
			}
		});
	}
	var oo_allSort = allSort;
	var allSort = _.where(allSort, {picked: true});
	var o_allSort = _.where(allSort, {picked: true});
	
	//repeat
	
	//initilizaing optimization results array with required buckets
	regressionOptimization.optResults = new Object();
	$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
		regressionOptimization.optResults[keyBTC] = new Array();
	});
	//ordering testbeds, to fill from least distribution
	//apply lower test bed distribution test cases all required testbeds and so on
	//var tbDistSort = _.sortBy(testBedDist, function (object) { return (object.tcCount); });
	var i=0;
	for (x=0;x<tbDistSort.length;x++) {
		var ctr=0;
		if(x>0)
			ctr=tbDistSort[x-1].tcCount;
		var topList = _.first(allSort,tbDistSort[x].tcCount-ctr);
		$.each(topList, function(keyTC, itemTC) {
			for (y=i;y<tbDistSort.length;y++) {
				//var optTC = new Object();
				var optTC = jQuery.extend(true, {}, itemTC);
				//optTC.testcase = itemTC.testcase;
				//optTC.feature = itemTC.feature;
				//optTC.title = itemTC.title;
				optTC.testbed = tbDistSort[y].name;
				//itemTC.testbed = tbDistSort[y].name;
				$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
					if(itemTC[keyBTC])
						regressionOptimization.optResults[keyBTC].push(optTC);
						//regressionOptimization.optResults[keyBTC].push(itemTC);
				});
			}
		});
		var restList = _.rest(o_allSort,tbDistSort[x].tcCount);
		allSort = restList;
		i++;
	}
	
	var spltOptList = new Object();
	var n=0;

	var notPicked = _.where(oo_allSort, {picked: false});
	$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
		spltOptList[keyBTC] = new Array();
		if(!regressionOptimization.recSet.settings[keyBTC+"isRpt"] && n<reqCountSplt && regressionOptimization.recSet.settings[keyBTC+"Pic"]<regressionOptimization.recSet.settings[keyBTC+"Min"]) {
			$.each(notPicked, function(keyTC, itemTC) {
				if(itemTC[keyBTC] && !itemTC.picked) {
					itemTC.picked=true;
					spltOptList[keyBTC].push(itemTC);
					n++
				}
			});
		}
	});
	
	notPicked = _.where(oo_allSort, {picked: false});
	$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
		if(!regressionOptimization.recSet.settings[keyBTC+"isRpt"] && n<reqCountSplt && regressionOptimization.recSet.settings[keyBTC+"Pic"]<regressionOptimization.recSet.settings[keyBTC+"PrefU"]) {
			$.each(notPicked, function(keyTC, itemTC) {
				if(itemTC[keyBTC] && !itemTC.picked) {
					itemTC.picked=true;
					spltOptList[keyBTC].push(itemTC);
					n++
				}
			});
		}
	});
	
	$.each(spltOptList, function(keyOBTC, itemOBTC) {
		var len = spltOptList[keyOBTC].length;
		var start = 0;
		for (y=0;y<tbDistSort.length;y++) {
			var end = parseInt((len/100*tbDistSort[y].dist)+start);
			for(z=start;z<end;z++) {
				var optTC = new Object();
				var optTC = jQuery.extend(true, {}, itemOBTC[z]);
				//optTC.feature = itemOBTC[z].feature;
				//optTC.title = itemOBTC[z].title;
				optTC.testbed = tbDistSort[y].name;
				//itemOBTC.testbed=tbDistSort[y].name;
				$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
					if(itemOBTC[z][keyBTC])
						regressionOptimization.optResults[keyBTC].push(optTC);
						//regressionOptimization.optResults[keyBTC].push(itemOBTC)
				});
			}
			start = end;
		}	
	});
	
	
	/*var notPicked = _.where(oo_allSort, {picked: false});
	$.each(notPicked, function(keyTC, itemTC) {
		$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
			if(itemTC[keyBTC]) {
				if(!regressionOptimization.recSet.settings[keyBTC+"isRpt"] && n<reqCountSplt) {
					spltOptList.push(itemTC);
					n++
					return false;
				}
			}
		});
	});*/
	
	/*$('#opt_buckets').empty();
	var uniqList = new Array();
	$.each(regressionOptimization.optResults, function(key, item) {
				regressionOptimization.addBucket(key,item.length,true)
				$.each(item, function(keyTC, itemTC) {
					var TC = _.where(uniqList, {testcase: itemTC.testcase,testbed:itemTC.testbed});
					if(TC.length <= 0)
						uniqList.push(itemTC);
				});
			});*/
			
		
	var _startDate = regressionOptimization.st_date
	var _endDate = regressionOptimization.end_date
	var no_of_resources = $('#no_of_resources').val();
	var env_setup_days = $('#setup_env').val();
	var testcase_exec_rate_per_each_person = $('#testcase_exec_rate_per_each').val();		
	var maxNoOfTestCases =  document.getElementById("maxNoOfTestCases").value;
	//console.log("_startDate"+_startDate+": _endDate - "+_endDate+": no_of_resources - "+no_of_resources)
	//console.log("env_setup_days"+env_setup_days+": testcase_exec_rate_per_each_person - "+testcase_exec_rate_per_each_person+": maxNoOfTestCases - "+maxNoOfTestCases)	
	
	regressionOptimization.recSet.settings.testBedDist = new Object();
	regressionOptimization.recSet.settings.testBedDist  = regressionOptimization.testBedDist;
	
	regressionOptimization.recSet.settings.capacityPlanning = {};
	if(!regressionOptimization.capacityPlanning)
		regressionOptimization.capacityPlanning = {};
	regressionOptimization.capacityPlanning.start_date = _startDate;
	regressionOptimization.capacityPlanning.end_date = _endDate;
	regressionOptimization.capacityPlanning.no_of_resources = no_of_resources;
	regressionOptimization.capacityPlanning.env_setup_days = env_setup_days;
	regressionOptimization.capacityPlanning.testcase_exec_rate_per_each_person = testcase_exec_rate_per_each_person;
	regressionOptimization.capacityPlanning.maxNoOfTestCases = maxNoOfTestCases;
	console.log("capacityPlanning--812---"+JSON.stringify(regressionOptimization.capacityPlanning))
	console.log("--846--"+JSON.stringify(regressionOptimization.recSet.settings))
	regressionOptimization.recSet.settings.capacityPlanning  = regressionOptimization.capacityPlanning;
	var optTCs = {"buckets":regressionOptimization.optResults, "settings":regressionOptimization.recSet.settings};
	//callBackOptimizationResults(optTCs);
	//console.log("optimization res ====="+JSON.stringify(optTCs))
	var planName="svdplan"
	var opt_data = '{"requesttype":"optimizedTCs","buckets": '+JSON.stringify(optTCs)+',"planId": "'+planName+'"}';
	if(!isMinGreater){
		ISEUtils.portletBlocking("opt_buckets")
		console.log("conditons satisfied ************** "+isMinGreater)
		ISE_Ajax_Service.ajaxPostReq('RegressionOptimizationRestFulService', 'json', sessionStorage.authtoken,opt_data,regressionOptimization.callBackOptimizationResults);	
	}else{
		//alert("some min values are greater than size of the bucket")
	}
	
},

callBackOptimizationResults:function(data){
	// console.log("optimization data ************"+JSON.stringify(data));
	$('#opt_buckets').empty();
	regressionOptimization.optResults = data[0].buckets;
	regressionOptimization.settings = data[0].settings;
	regressionOptimization.testBedDist = data[0].settings.testBedDist;
	regressionOptimization.capacityPlanning = data[0].settings.capacityPlanning;
	console.log("capacity planning 832 ************"+JSON.stringify(regressionOptimization.capacityPlanning))	
	//console.log("testbedlist -- "+JSON.stringify(regressionOptimization.testBedDist))	
/* 	if(undefined !=regressionOptimization.testBedDist && regressionOptimization.testBedDist.length>0){
		for(var tb=0;tb<regressionOptimization.testBedDist.length;tb++){
			var tbKey = regressionOptimization.testBedDist[tb].name
			var tbDist = regressionOptimization.testBedDist[tb].dist			
			console.log("tbKey"+tbKey+" :tbDist - "+tbDist)					
			var testbed = _.where(regressionOptimization.testBedKeys, {tbName: tbKey});
			$('#'+testbed[0].tbId).attr('checked',true);
			$('#'+testbed[0].tbDistrib).val(tbDist)
			$('#'+testbed[0].tbDistrib).attr('disabled',false);		
			
		}	
	} */
	
	var oTable = $('#testbeds').dataTable();
	var ckdData = $('input[type=checkbox]', oTable.fnGetNodes() );
	for(var z=0;z<ckdData.length;z++) {
		var testbed = _.where(regressionOptimization.testBedDist, {name: ckdData[z].value});
		if(testbed.length > 0) {
						ckdData[z].checked=true;
						ckdData[z].parentElement.parentElement.childNodes[2].childNodes[0].value=testbed[0].dist;
						ckdData[z].parentElement.parentElement.childNodes[2].childNodes[0].disabled=false;
		}
	} 	
	console.log("---851 -- "+regressionOptimization.capacityPlanning["start_date"])	
	//if(null != regressionOptimization.capacityPlanning && regressionOptimization.capacityPlanning.length>0){
		console.log("stdate ******** 854--"+regressionOptimization.capacityPlanning["start_date"])
		var stDate = new Date(regressionOptimization.capacityPlanning["start_date"]);		
		console.log("stdate ******** 856--"+(stDate.getMonth()+1)+"/"+stDate.getDate()+"/"+stDate.getFullYear());		
		document.getElementById("startDate").value=(stDate.getMonth()+1)+"/"+stDate.getDate()+"/"+stDate.getFullYear();
		st_date=stDate;
		console.log("stdate ******** 859--"+regressionOptimization.st_date)		
		var end_Date = new Date(regressionOptimization.capacityPlanning["end_date"]);				
		document.getElementById("endDate").value=(end_Date.getMonth()+1)+"/"+end_Date.getDate()+"/"+end_Date.getFullYear();
		end_date=end_Date;
		noOfDays = (end_date-st_date)/(1000*60*60*24)+1;
		console.log("---863----"+regressionOptimization.capacityPlanning["no_of_resources"])
		console.log("---863----"+regressionOptimization.capacityPlanning["env_setup_days"])
		console.log("---863----"+regressionOptimization.capacityPlanning["testcase_exec_rate_per_each_person"])
		/* document.getElementById('no_of_resources').value=regressionOptimization.capacityPlanning["no_of_resources"]
		document.getElementById('env_setup_days').value=regressionOptimization.capacityPlanning["testcase_exec_rate_per_each_person"]
		document.getElementById('testcase_exec_rate_per_each_person').value=regressionOptimization.capacityPlanning["no_of_resources"]
		document.getElementById('maxNoOfTestCases').value=regressionOptimization.capacityPlanning["maxNoOfTestCases"] */
		 $('#no_of_resources').val(regressionOptimization.capacityPlanning["no_of_resources"])
		$('#setup_env').val(regressionOptimization.capacityPlanning["env_setup_days"])
		$('#testcase_exec_rate_per_each').val(regressionOptimization.capacityPlanning["testcase_exec_rate_per_each_person"])
		$('#maxNoOfTestCases').val(regressionOptimization.capacityPlanning["maxNoOfTestCases"]) 
		
	//}
	
	regressionOptimization.uniqList = new Array();
	$.each(data[0].buckets, function(key, item) {
				regressionOptimization.addBucket(key,item.length,true)
				$.each(item, function(keyTC, itemTC) {
					var TC = _.where(regressionOptimization.uniqList, {testcase: itemTC.testcase,testbed:itemTC.testbed});
					if(TC.length <= 0)
						regressionOptimization.uniqList.push(itemTC);
				});
			});
	
	$.each(regressionOptimization.uniqList, function(keyTC, itemTC) {	
			//adding type columns and initilizing with flase
			$.each(data[0].buckets, function(keyBTC, itemBTC) {
				itemTC[keyBTC]=false;
			});
			
			$.each(data[0].buckets, function(keyBTC, itemBTC) {
				var bTC = _.where(itemBTC, {testcase: itemTC.testcase});
				if(bTC.length > 0)
					itemTC[keyBTC]=true;
			});
	});
	$('#regressionUnqTCs').text(regressionOptimization.tcList.length)
	var maxTestExecutions = parseInt(regressionOptimization.tcList.length)*parseInt(regressionOptimization.totalEnvCount)
	$('#maxTestExecs').text(maxTestExecutions)
	$('#UnqTestExecs').text(regressionOptimization.uniqList.length)
	console.log("Unique Regression Testcases -- "+regressionOptimization.tcList.length)
	console.log("Unique TestExecutions -- "+regressionOptimization.uniqList.length)
	console.log("maxTestExecutions -- "+maxTestExecutions)
	regressionOptimization.displayCalculations();
	ISEUtils.portletUnblocking("opt_buckets");
},

StartMethods:function() {
	console.log("StartMethods is calling................")
	//regressionOptimization.testBedDist : [],

	/*$.getJSON("json/sample.json", function(data) {
				regressionOptimization.regressionOptimization.recSet = data;
                $.each(data.buckets, function(key, item) {
				console.log("r");
				regressionOptimization.addBucket(key,item.length,false);
				$.each(item, function(keyTC, itemTC) {
					var TC = _.where(regressionOptimization.tcList, {testcase: itemTC.testcase});
					if(TC.length <= 0)
						regressionOptimization.tcList.push(itemTC);
				});
				
});
});
*/
/*
$.getJSON("json/envlist.json", function(data) {
                //$.each(data.testbeds, function(key, item) {
				regressionOptimization.addTestBeds(data);
				//addBucket(key,item.length);
				
//});
}); 
*/
//TableManaged.init();
//alert(all.length);
//var allSort = _.sortBy(all, function (object) { return -(object.defect_prob); })
//}); 

$.getJSON("json/config.json", function(data) {
				regressionOptimization.configData1 = data.configs;
                $.each(data.configs, function(key, item) {
				regressionOptimization.addConfigs(key, item);
				//addBucket(key,item.length);
				
});
});



},
addConfigs: function(configName, configData) {
var config = {
	prtltCol : $("<div>", {class: "col-md-4"}),
    prtltConatiner : $("<div>", {class: "portlet green-meadow box"}),
	prtltTitle : $("<div>", {class: "portlet-title"}),
	prtltCaption : $("<div>", {class: "caption", text:configName}),
	prtltBody : $("<div>", {class: "portlet-body"}),
	tbl : $("<table>", {class: "table table-striped table-bordered table-hover", id:configName}),	
	tblTHd : $("<thead>"),	
	tblTRh : $("<tr>"),	
	tblTHChk : $("<th>", {class: "table-checkbox"}),	
	tblTHChkBox : $("<input>", {type:"checkbox", class: "group-checkable", "data-set":"#"+configName+" .checkboxes"}),	
	tblTHNm : $("<th>", {text:configName}),	
	tblBody : $("<tbody>"),
	};
	config.tblTHChkBox.appendTo(config.tblTHChk);
	config.tblTHChk.appendTo(config.tblTRh);
	config.tblTHNm.appendTo(config.tblTRh);
	config.tblTRh.appendTo(config.tblTHd);
	config.tblTHd.appendTo(config.tbl);
	
	for(var i=0;i<configData.length;i++) {
		var row = {
		tblTR : $("<tr>"),	
		tblTDChk : $("<td>"),	
		tblChk : $("<input>",{type:"checkbox", class: "checkboxes", value:configData[i].id}),	
		tblTD : $("<td>",{text:configData[i].name}),		
		}
		row.tblChk.appendTo(row.tblTDChk);
		row.tblTDChk.appendTo(row.tblTR);
		row.tblTD.appendTo(row.tblTR);
		row.tblTR.appendTo(config.tblBody);
	}
	
	config.tblBody.appendTo(config.tbl);
	//config.tbl.appendTo("#configs");
	config.tbl.appendTo(config.prtltBody);
	config.prtltTitle.appendTo(config.prtltConatiner);
	config.prtltCaption.appendTo(config.prtltTitle);
	config.prtltBody.appendTo(config.prtltConatiner);
	config.prtltConatiner.appendTo(config.prtltCol);
	config.prtltCol.appendTo("#configs");
	TableManaged.init(configName);
	//regressionOptimization.ShowConfig();
	$('#configDiv').hide();
	
},

addBucket:function(bucketName, total, isOptimize) {
	var min=0,pref=0;
	if(total > 0) {
		min=parseInt(total*30/100);
		pref=min*3;
	}
	var bucket = {
		prtltCol : $("<div>", {class: "col-md-3"}),
		prtltConatiner : $("<div>", {class: "portlet green-meadow box"}),
		prtltTitle : $("<div>", {class: "portlet-title"}),
		prtltCaption : $("<div>", {class: "caption", text:bucketName}),
		prtltIcon : $("<i>", {class: "fa fa-gift"}),
		prtltTools : $("<div>", {class: "tools"}),
		prtltCollapse : $("<a>", {class: "collapse", href:"javascript:;"}),
		prtltBody : $("<div>", {class: "portlet-body"}),
		
		prtltTotal : $("<div>", {class: "pricing-head"}),
		prtltTotalH : $("<h3>", {text: "#"+total}),
		prtltPopup : $("<a>", {"data-toggle":"modal", onclick:"javascript:regressionOptimization.renderTC('"+bucketName+"',"+isOptimize+");", href:"#large"}),
		prtltTable : $("<div>", {class: "row static-info"}),
		prtltPreN : $("<div>", {class: "col-md-7 name", title:"Preferred Test Executions",text:"Preferred"}),
		prtltPreV : $("<div>", {class: "col-md-5 value", text:pref, id:"Pref_"+bucketName}),
		prtltMinN : $("<div>", {class: "col-md-7 name", text:"Min"}),
		prtltMinV : $("<div>", {class: "col-md-5 value", text:min, id:"Min_"+bucketName}),
		prtltWeiN : $("<div>", {class: "col-md-7 name", text:"Weightage"}),
		prtltWeiV : $("<div>", {class: "col-md-5 value", text:"1", id:"Wt_"+bucketName}),

		prtltMinEd : $("<a>", {"data-toggle":"modal", onclick:"javascript:regressionOptimization.editSettings('"+bucketName+"','Min_');", href:"#small"}),
		prtltMinEdI : $("<i>", {class:"fa fa-pencil"}),
		prtltWeiEd : $("<a>", {"data-toggle":"modal", onclick:"javascript:regressionOptimization.editSettings('"+bucketName+"','Wt_');", href:"#small"}),
		prtltWeiEdI : $("<i>", {class:"fa fa-pencil"}),
		prtltFooter : $("<div>", {class: "pricing-footer"}),
		prtltRadList : $("<div>", {class: "radio-list", id:"SptRpt_"+bucketName}),
		prtltLabRep : $("<label>", {class: "radio-inline",text:"Repeat"}),
		prtltLabSpl : $("<label>", {class: "radio-inline",style:" margin-left: 72px",text:"Split"}),
		prtltRadRep : $("<input>", {type:"radio", name:bucketName,style:"margin-left:7px", value:"Repeat", checked:"true"}),
		prtltRadSpl : $("<input>", {type:"radio", name:bucketName, style:"margin-left:4px", value:"Split",text:"Split" }),
	};

	bucket.prtltTitle.appendTo(bucket.prtltConatiner);
	bucket.prtltCaption.appendTo(bucket.prtltTitle);
	bucket.prtltIcon.appendTo(bucket.prtltCaption);
	bucket.prtltTools.appendTo(bucket.prtltTitle);
	bucket.prtltCollapse.appendTo(bucket.prtltTools);

	//bucket.prtltTotalH.appendTo(bucket.prtltTotal);
	//bucket.prtltPopup.appendTo(bucket.prtltTotal);
	//bucket.prtltTotal.appendTo(bucket.prtltBody);
	bucket.prtltPopup.appendTo(bucket.prtltTotal);
	bucket.prtltTotalH.appendTo(bucket.prtltPopup);
	bucket.prtltTotal.appendTo(bucket.prtltBody);
	
	if(!isOptimize) {
		bucket.prtltPreN.appendTo(bucket.prtltTable);
		bucket.prtltPreV.appendTo(bucket.prtltTable);
		
		bucket.prtltMinN.appendTo(bucket.prtltTable);		
		bucket.prtltMinV.appendTo(bucket.prtltTable);		
		bucket.prtltMinEdI.appendTo(bucket.prtltMinEd);
		bucket.prtltMinEd.appendTo(bucket.prtltMinN);
		// bucket.prtltMinEd.appendTo(bucket.prtltMinV);
		//bucket.prtltMinV.appendTo(bucket.prtltTable);
		
		bucket.prtltWeiN.appendTo(bucket.prtltTable);
		bucket.prtltWeiV.appendTo(bucket.prtltTable);		
		bucket.prtltWeiEdI.appendTo(bucket.prtltWeiEd);
		bucket.prtltWeiEd.appendTo(bucket.prtltWeiN);		
		// bucket.prtltWeiEd.appendTo(bucket.prtltWeiV);
		//bucket.prtltWeiV.appendTo(bucket.prtltTable);

		bucket.prtltTable.appendTo(bucket.prtltBody);

		bucket.prtltRadRep.appendTo(bucket.prtltLabRep);
		bucket.prtltRadSpl.appendTo(bucket.prtltLabSpl);
		bucket.prtltLabRep.appendTo(bucket.prtltRadList);
		bucket.prtltLabSpl.appendTo(bucket.prtltRadList);
		bucket.prtltRadList.appendTo(bucket.prtltFooter);
		bucket.prtltFooter.appendTo(bucket.prtltBody);
	}
	
	bucket.prtltBody.appendTo(bucket.prtltConatiner);
	bucket.prtltConatiner.appendTo(bucket.prtltCol);
	if(!isOptimize) 
		bucket.prtltCol.appendTo("#buckets");
	else {
		bucket.prtltCol.appendTo("#opt_buckets");
		
		$('#Min_'+bucketName).text(regressionOptimization.settings[bucketName+"Min"].trim())
		$('#Pref_'+bucketName).text(regressionOptimization.settings[bucketName+"Pref"])
		$('#Wt_'+bucketName).text(regressionOptimization.settings[bucketName+"Wt"])
						
		var checkVal = $("input[type='radio'][name='"+bucketName+"']:checked").val();
		console.log("checkVal - "+checkVal)
		if(checkVal =='Repeat' && regressionOptimization.settings[bucketName+"isRpt"]){
			$("input[name='"+bucketName+"'][value=Repeat]").prop('checked', true);
		}else{
			$("input[name='"+bucketName+"'][value=Split]").prop('checked', true);
		}	
		
		
	}
},

addTestBeds:function(testBeds) {
	$('#testbed').empty();
	console.log("---testbed creation ---")
	var testbed = {
	prtltCol : $("<div>", {class: "col-md-12"}),
    prtltConatiner : $("<div>", {class: "portlet box blue-hoki"}),
	prtltAction : $("<div>", {class: "actions"}),
	prtltActionCall : $("<a>", {class: "btn btn-default btn-sm", href:"javascript:regressionOptimization.ShowConfig();", text:"configure"}),
	prtltActionIcon : $("<i>", {class: "fa fa-pencil"}),
    prtltTitle : $("<div>", {class: "portlet-title"}),
	prtltCaption : $("<div>", {class: "caption", text:"Testbed distribution"}),
	prtltIcon : $("<i>", {class: "fa fa-gift"}),
	prtltTools : $("<div>", {class: "tools"}),
	prtltCollapse : $("<a>", {class: "collapse", href:"javascript:;"}),
	prtltBody : $("<div>", {class: "portlet-body"}),
	
	prtltConfigDiv : $("<div>", {id: "configDiv"}),
	prtltConfig : $("<div>", {id: "configs"}),
	prtltConfigSubmit : $("<input>", {class:"btn blue-hoki", id: "configs",type:"button",value:"Generate Testbeds",onclick:"javascript:regressionOptimization.generateTestBeds();"}),
	prtltConfigNext : $("<input>", {class:"btn blue-hoki pull-right",type:"button",value:"Next",onclick:"javascript:regressionOptimization.onButtonChangeTab('testSettingsTab');"}),
	
	tbl : $("<table>", {class: "table table-striped table-bordered table-hover", id:"testbeds"}),	
	tblTHd : $("<thead>"),	
	tblTRh : $("<tr>"),	
	tblTHChk : $("<th>", {class: "table-checkbox"}),	
	tblTHChkBox : $("<input>", {type:"checkbox", class: "group-checkable", "data-set":"#testbeds .checkboxes"}),	
	tblTHNm : $("<th>", {text:"Testbeds"}),	
	tblTHDist : $("<th>", {text:"Distribution(%)"}),	
	tblBody : $("<tbody>"),
	};
	testbed.tblTHChkBox.appendTo(testbed.tblTHChk);
	testbed.tblTHChk.appendTo(testbed.tblTRh);
	testbed.tblTHNm.appendTo(testbed.tblTRh);
	testbed.tblTHDist.appendTo(testbed.tblTRh);
	testbed.tblTRh.appendTo(testbed.tblTHd);
	testbed.tblTHd.appendTo(testbed.tbl);
	
	testbed.prtltTitle.appendTo(testbed.prtltConatiner);
	testbed.prtltCaption.appendTo(testbed.prtltTitle);
	testbed.prtltIcon.appendTo(testbed.prtltCaption);
	testbed.prtltTools.appendTo(testbed.prtltTitle);
	testbed.prtltAction.appendTo(testbed.prtltTitle);
	testbed.prtltActionCall.appendTo(testbed.prtltAction);
	testbed.prtltActionIcon.appendTo(testbed.prtltActionCall);
	testbed.prtltCollapse.appendTo(testbed.prtltTools);
	
	
	var tbb=0;
	regressionOptimization.testBedKeys=[];
	for(var i=0;i<testBeds.length;i++) {
		tbb++;
		var tbobj={};
		tbobj.tbId = "tb"+tbb.toString();
		tbobj.tbName = testBeds[i].env_name;
		tbobj.tbDistrib = "tb_distrib"+tbb.toString();
		regressionOptimization.testBedKeys.push(tbobj);
		var row = {
		tblTR : $("<tr>"),	
		tblTDChk : $("<td>"),	
		tblChk : $("<input>",{type:"checkbox", class: "checkboxes", id:tbobj.tbId,value:testBeds[i].env_name, onclick:"javascript:regressionOptimization.showDistribution(this);"}),	
		tblTDNm : $("<td>",{id:tbobj.tbId,text:testBeds[i].env_name}),		
		tblTDDist : $("<td>"),		
		tblTDDistIn : $("<input>",{id:tbobj.tbDistrib,value:testBeds[i].distribution,disabled:true}),		
		}
		row.tblChk.appendTo(row.tblTDChk);
		row.tblTDChk.appendTo(row.tblTR);
		row.tblTDNm.appendTo(row.tblTR);
		row.tblTDDistIn.appendTo(row.tblTDDist);
		row.tblTDDist.appendTo(row.tblTR);
		row.tblTR.appendTo(testbed.tblBody);
	}
	
	testbed.tblBody.appendTo(testbed.tbl);
	
	testbed.prtltConfig.appendTo(testbed.prtltConfigDiv);
	testbed.prtltConfigSubmit.appendTo(testbed.prtltConfigDiv);
	testbed.prtltConfigDiv.appendTo(testbed.prtltBody);
	
	testbed.tbl.appendTo(testbed.prtltBody);
	testbed.prtltBody.appendTo(testbed.prtltConatiner);
	testbed.prtltConatiner.appendTo(testbed.prtltCol);
	testbed.prtltConfigNext.appendTo(testbed.prtltCol)
	testbed.prtltCol.appendTo("#testbed");
	TableManaged.init("testbeds");
},
renderTC : function(tcType,isOptimize) {
$('#tblTCList').empty();
var config = {
	tbl : $("<table>", {class: "table table-striped table-bordered table-hover", id:"tcs"}),	
	tblTHd : $("<thead>"),	
	tblTRh : $("<tr>"),	
	tblTHTC : $("<th>", {text:"Testcase"}),	
	tblTHEnv : $("<th>", {text:"Env"}),	
	tblBody : $("<tbody>"),
	};
	config.tblTHTC.appendTo(config.tblTRh);
	config.tblTHEnv.appendTo(config.tblTRh);
	config.tblTRh.appendTo(config.tblTHd);
	config.tblTHd.appendTo(config.tbl);
	
	if(!isOptimize) {
		$.each(regressionOptimization.recSet.buckets, function(key, item) {
			if(key == tcType) {
				$.each(item, function(keyTC, itemTC) {
					var row = {
					tblTR : $("<tr>"),	
					tblTDTC : $("<td>",{text:itemTC.testcase}),	
					tblTDEnv : $("<td>",{text:"NA"}),		
					}
					row.tblTDTC.appendTo(row.tblTR);
					row.tblTDEnv.appendTo(row.tblTR);
					row.tblTR.appendTo(config.tblBody);
				});
			}
		});
	}
	else {
		$.each(regressionOptimization.optResults, function(key, item) {
			if(key == tcType) {
				$.each(item, function(keyTC, itemTC) {
					var row = {
					tblTR : $("<tr>"),	
					tblTDTC : $("<td>",{text:itemTC.testcase}),	
					tblTDEnv : $("<td>",{text:itemTC.testbed}),		
					}
					row.tblTDTC.appendTo(row.tblTR);
					row.tblTDEnv.appendTo(row.tblTR);
					row.tblTR.appendTo(config.tblBody);
				});
			}
		});
	}
	config.tblBody.appendTo(config.tbl);
	config.tbl.appendTo("#tblTCList");
	TableManaged.init("tcs");
},
	ShowConfig:function() {
	if($('#configDiv').is(":visible"))
		$('#configDiv').hide();
	else
		$('#configDiv').show();
	},
	
	editSettings: function(key,set) {
		console.log("--1280---"+$('#'+set+key).text())
		$('#settingsEdit').val($('#'+set+key).text());
		
		$('#settingshdnEdit').val(set+key);
	},
	submitChanges: function() {
		$('#'+$('#settingshdnEdit').val()).text($('#settingsEdit').val());
		
		
		//alert($('#maxNoOfTestCases').val());
		regressionOptimization.displayCalculations();
	},
	
	displayCalculations: function() {
		var allWt = 0;
		$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
			var len=0;
			if(itemBTC && null!=itemBTC)
				len=itemBTC.length;
			allWt = allWt + (len*$('#Wt_'+keyBTC).text())
		});
		
		var envSelected = 0;
		var oTable = $('#testbeds').dataTable();
		var ckdData = $('input[type=checkbox]:checked', oTable.fnGetNodes() );
		envSelected = ckdData.length;
		
		$('#selectedTestBeds').text(envSelected);
		$('#posbleTestExecs').text(parseInt($('#regressionUnqTCs').text())*envSelected);
		if($('#maxNoOfTestCases').val() > parseInt($('#posbleTestExecs').text())) {
			$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
				var len=0;
				if(itemBTC && null!=itemBTC)
					len=itemBTC.length;				
					 
				$('#Pref_'+keyBTC).text(parseInt(($('#Wt_'+keyBTC).text()*len)/allWt*parseInt($('#posbleTestExecs').text())));
			});
			$('#displayMessage').text("Bandwidth configured more than possible executions, so results would come less...!");
		}
		else {
			$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
				var len=0;
				if(itemBTC && null!=itemBTC)
					len=itemBTC.length;
					
					var minval = $('#Min_'+keyBTC).text();
					console.log("minval-1338 - "+minval)
					if(parseInt(minval)>len)						
					alert("min value "+minval+"  must not be greater than "+len+" size of "+keyBTC) 
				$('#Pref_'+keyBTC).text(parseInt(($('#Wt_'+keyBTC).text()*len)/allWt*$('#maxNoOfTestCases').val()));
			});
			$('#displayMessage').text("");
		}
	},
	
	showDistribution: function(obj) {
         if(obj.checked)
             obj.parentElement.parentElement.childNodes[2].childNodes[0].disabled=false;
         else
             obj.parentElement.parentElement.childNodes[2].childNodes[0].disabled=true;
			 
		var oTable = $('#testbeds').dataTable();
		var ckdData = $('input[type=checkbox]:checked', oTable.fnGetNodes() );
		var distribution = parseInt(100/ckdData.length);
		var reminder = 100-(distribution*ckdData.length);
		for(var z=0;z<ckdData.length;z++) {
			ckdData[z].parentElement.parentElement.childNodes[2].childNodes[0].value = distribution;
			if(z == (ckdData.length-1))
				ckdData[z].parentElement.parentElement.childNodes[2].childNodes[0].value = distribution+reminder;
		}
		regressionOptimization.displayCalculations();
    },

	generateTestBeds:function() {
		var configs = {};
		$.each(regressionOptimization.configData1, function(key, item) {
			var vals = new Array();
			$('#'+key+' input[type=checkbox]:checked').each(function () {
				vals.push(this.value);
			});
			configs[key] = vals;
		});
		console.log("testbeds -- "+JSON.stringify(configs));	
		var envData = '{"requesttype":"generateEnvs","environment": '+JSON.stringify(configs)+'}';
		ISE_Ajax_Service.ajaxPostReq('RegressionOptimizationRestFulService', 'json', localStorage.authtoken,envData,regressionOptimization.callBackEnvList);	
				 

	},
	//SURESH
	callBackEnvList:function(data){
		console.log("--------1206------------")
		console.log("env data---"+JSON.stringify(data))
		//regressionOptimization.getAllFeatureHelper()		
		regressionOptimization.addTestBeds(data)
		regressionOptimization.totalEnvCount = data.length;
		
		if(!regressionOptimization.isFromJson)
			regressionOptimization.getEnvBrowerMarketByTestExe();
		else			
			regressionOptimization.StartMethods();
		
		
		
		/* for(var tb=0;tb<regressionOptimization.testBedDist.length;tb++){
			var tbKey = regressionOptimization.testBedDist[tb].name
			var tbDist = regressionOptimization.testBedDist[tb].dist			
			console.log("tbKey"+tbKey+" :tbDist - "+tbDist)					
			var testbed = _.where(regressionOptimization.testBedKeys, {tbName: tbKey});
			$('#'+testbed[0].tbId).attr('checked',true);
			$('#'+testbed[0].tbDistrib).val(tbDist)
			$('#'+testbed[0].tbDistrib).attr('disabled',false);		
		
		} */
		var oTable = $('#testbeds').dataTable();
		var ckdData = $('input[type=checkbox]', oTable.fnGetNodes() );
		for(var z=0;z<ckdData.length;z++) {
			var testbed = _.where(regressionOptimization.testBedDist, {name: ckdData[z].value});
			if(testbed.length > 0) {
				ckdData[z].checked=true;
				ckdData[z].parentElement.parentElement.childNodes[2].childNodes[0].value=testbed[0].dist;
				ckdData[z].parentElement.parentElement.childNodes[2].childNodes[0].disabled=false;
			}
		}
	},
	
	exportData:function(exportType){		
		var testcaseIds =[];
		var testcaseNames=[];
		var testcaseTypes=[];
		var featureNames =[];
		var environmants =[];
		var csvVal="Testcase Id#&#Title#&#Feature#&#Testcase Types#&#Environment\r\n";
		var exportingData;		
		
		if(exportType == 'regression'){
			//console.log("regression *****1101--"+JSON.stringify(regressionOptimization.recommendTCsArr))
			//exportingData = regressionOptimization.recommendTCsArr;
			exportingData = regressionOptimization.tcList;
			if(undefined != exportingData && exportingData.length>0){
				$.each(regressionOptimization.tcList, function(keyTC, itemTC) {
					var types="";
					$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
						if(itemTC[keyBTC])
							types = types+" "+keyBTC;
					});
					title = itemTC.title
					title = title.replace(/[_\W]+/g, " ")					
					
					csvVal = csvVal+itemTC.testcase+'#&#'+title+'#&#'+itemTC.feature+'#&#'+types+'#&#'+itemTC.testbed+'\r\n';
				});			
		
			}
		}else{			
			exportingData = regressionOptimization.uniqList;
			if(undefined != exportingData && exportingData.length>0){
				$.each(regressionOptimization.uniqList, function(keyTC, itemTC) {
					var types="";
					$.each(regressionOptimization.optResults, function(keyBTC, itemBTC) {
						if(itemTC[keyBTC])
							types = types+" "+keyBTC;
					});
					title = itemTC.title
					title = title.replace(/[_\W]+/g, " ")	
					csvVal = csvVal+itemTC.testcase+'#&#'+title+'#&#'+itemTC.feature+'#&#'+types+'#&#'+itemTC.testbed+'\r\n';
				});
			}
			
		}		
		 
		var file = {
			worksheets: [[]], // worksheets has one empty worksheet (array)
			creator: 'iSE', created: new Date('8/16/2012'),
			lastModifiedBy: 'iSE', modified: new Date(),
			activeWorksheet: 0
		}, w = file.worksheets[0]; // cache current worksheet
		w.name = "ExportData";
		
		//var str = "&#13;<br/>a&#44;with coma,b,c,d\nd,e,f,g\ni,j,k,asd &quot;test&quot;&#83;with quote"; // My CSV String !!! TODO .. replace with actual ..
		var str = csvVal;
		console.log("str=====>"+str);
		str = str.replace(/[~^\!{}\[\]\|\\]/g,'');
		var lines = str.split(/[\r\n|\n]+/);    // split data by line
		for(i=0;i<lines.length;i++) {			
			var cells = lines[i].split(/#&#/);
			var l = cells.length;
			
			var r = w.push([]) - 1; // index of current row
			for(j=0;j<l;j++) {
				//console.log(cells[j]); //parsing is working ..
				
				//Decoding and pushing ..
				//w[r].push($("<div/>").html(cells[j]).text());
				w[r].push($("<textarea/>").html(cells[j]).val());
			}
		
		}
		window.location = xlsx(file).href();
	
	},
	
	onSelectStartDate: function(){					
			regressionOptimization.st_date = $('#startDate').datepicker('getDate');
			if(regressionOptimization.st_date>regressionOptimization.end_date){
				alert("Regression Start Date should not Greater than End Date")
				$('#st_date').val("");
			}else{
				//console.log("---st_date***** "+st_date+"---end_date****** "+end_date)
				regressionOptimization.noOfDays = (regressionOptimization.end_date-regressionOptimization.st_date)/(1000*60*60*24)+1;
				regressionOptimization.calMaxNoOfTestExecutions();
			}
			
	},
	
	onSelectEndDate: function(){ 
				regressionOptimization.end_date = $('#endDate').datepicker('getDate');				
				if(regressionOptimization.end_date<regressionOptimization.st_date){
					alert("Regression End Date should not less than Start Date")
					$('#endDate').val("");
				}else{
					//console.log("---st_date***** "+st_date+"---end_date****** "+end_date)
					regressionOptimization.noOfDays = (regressionOptimization.end_date-regressionOptimization.st_date)/(1000*60*60*24)+1;
					regressionOptimization.calMaxNoOfTestExecutions();
				}
			},
	
	calculateMaxNoTestcase:function(){
		/*if (jQuery().datepicker) {
            $('#startDate').datepicker({
                orientation: "left",
                autoclose: true,
				onSelect: function(){
					alert(1);
				}
            });
            //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
        }*/
		$("#startDate").datepicker({
			minDate: 0,
			/*onSelect: function(){					
			alert(1);
				regressionOptimization.st_date = $(this).datepicker('getDate');
				if(regressionOptimization.st_date>regressionOptimization.end_date){
					alert("Regression Start Date should not Greater than End Date")
					$('#st_date').val("");
				}else{
					//console.log("---st_date***** "+st_date+"---end_date****** "+end_date)
					regressionOptimization.noOfDays = (regressionOptimization.end_date-regressionOptimization.st_date)/(1000*60*60*24)+1;
					regressionOptimization.calMaxNoOfTestExecutions();
				}
				
			}*/
		});
		$("#endDate").datepicker({			
			minDate: 0,
		/*	onSelect: function(){ 
			alert(1);
				regressionOptimization.end_date = $(this).datepicker('getDate');				
				if(regressionOptimization.end_date<regressionOptimization.st_date){
					alert("Regression End Date should not less than Start Date")
					$('#endDate').val("");
				}else{
					//console.log("---st_date***** "+st_date+"---end_date****** "+end_date)
					regressionOptimization.noOfDays = (regressionOptimization.end_date-regressionOptimization.st_date)/(1000*60*60*24)+1;
					regressionOptimization.calMaxNoOfTestExecutions();
				}
			}*/
		});	
		regressionOptimization.st_date = $('#startDate').datepicker('getDate');
		regressionOptimization.end_date = $('#endDate').datepicker('getDate');				
		regressionOptimization.noOfDays = (regressionOptimization.end_date-regressionOptimization.st_date)/(1000*60*60*24)+1;
		
		 var specialKeys = new Array();
		specialKeys.push(8); //Backspace
		$("#no_of_resources").bind("keypress", function (e) {
			var keyCode = e.which ? e.which : e.keyCode
			var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1);
			$(".error1").css("display", ret ? "none" : "inline").fadeOut("slow");
			return ret;
		});
		$("#no_of_resources").bind("paste", function (e) {
			return false;
		});
		$("#no_of_resources").bind("drop", function (e) {
			return false;
		});
			
		$("#testcase_exec_rate_per_each").bind("keypress", function (e) {
			var keyCode = e.which ? e.which : e.keyCode
			var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1);
			$(".error2").css("display", ret ? "none" : "inline").fadeOut("slow");;
			return ret;
		});
		$("#testcase_exec_rate_per_each").bind("paste", function (e) {
			return false;
		});
		$("#testcase_exec_rate_per_each").bind("drop", function (e) {
			return false;
		});
		
		$("#setup_env").bind("keypress", function (e) {
			var keyCode = e.which ? e.which : e.keyCode
			var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1);
			$(".error3").css("display", ret ? "none" : "inline").fadeOut("slow");
			return ret;
		});
		$("#setup_env").bind("paste", function (e) {
			return false;
		});
		$("#setup_env").bind("drop", function (e) {
			return false;
		});
	},
	
	calMaxNoOfTestExecutions:function() {		
				var no_of_resources = $('#no_of_resources').val();
				var env_setup_days = $('#setup_env').val();
				var testcase_exec_rate_per_each_person = $('#testcase_exec_rate_per_each').val();
				//console.log("Start Date - "+st_date+" : End Date - "+end_date+" : Test Engineers - "+no_of_resources+" : Environment setup Effort - "+env_setup_days+" : Execution rate - "+testcase_exec_rate_per_each_person)
				if(undefined != regressionOptimization.st_date && undefined != regressionOptimization.end_date && !regressionOptimization.isEmpty(no_of_resources) && !regressionOptimization.isEmpty(env_setup_days) && !regressionOptimization.isEmpty(testcase_exec_rate_per_each_person)){
					//alert(" calling....")
					regressionOptimization.maxNoOfTestExecutions();
				}
			},
			
	maxNoOfTestExecutions:function() {		
		var env_setup_days = $('#setup_env').val();		
		var testcase_exec_rate_per_each_person = $('#testcase_exec_rate_per_each').val();		
		var no_of_resources = $('#no_of_resources').val();	
		var max_no_testcases ;
		if($("#include_weekdays").is(':checked')){	
			//console.log("st_date - "+st_date+" : end_date -"+end_date+" : noOfDays- "+noOfDays +" include weekends");
			max_no_testcases = (regressionOptimization.noOfDays-env_setup_days)*testcase_exec_rate_per_each_person*no_of_resources
		}else{
			var days = regressionOptimization.noOfDays;
			var numDays=0;			
			var st_date_new = new Date(regressionOptimization.st_date.getTime());
			while(st_date_new.getDate() <= regressionOptimization.end_date.getDate()){
				if(st_date_new.getDay()>0 && st_date_new.getDay()<6){
					numDays++;
				}					
				st_date_new.setDate(st_date_new.getDate() + 1);
			}
			max_no_testcases = (numDays-env_setup_days)*testcase_exec_rate_per_each_person*no_of_resources
			//console.log("st_date_new - "+st_date_new)
			//console.log("st_date - "+st_date+" : end_date -"+end_date+" : numDays- "+numDays +" exclude weekends");		
		}
		console.log("max_no_testcases--"+max_no_testcases);
		if(max_no_testcases <0 && undefined != max_no_testcases){
			alert("Max No Test Executions can't less than or equal to zero")
			$('#maxNoOfTestCases').val('');
		}else{
			$('#maxNoOfTestCases').val(max_no_testcases);
			regressionOptimization.displayCalculations();
		}	
		
	},
	isEmpty:function(val){
		return (val === undefined || val == null || val.length <= 0) ? true : false;			
	},
	
	onButtonChangeTab:function(nextTab){
		if(nextTab == 'recomondationsTab'){
			$('#tabUL a[href="#recomondationsTab"]').trigger('click');
		}else if(nextTab == 'testBedsTab'){
			$('#tabUL a[href="#testBedsTab"]').trigger('click');
		}else if(nextTab == 'testSettingsTab'){
			$('#tabUL a[href="#testSettingsTab"]').trigger('click');
		}else if(nextTab == 'optimizationsTab'){
			$('#tabUL a[href="#optimizationsTab"]').trigger('click');
		}	 
	}
};

