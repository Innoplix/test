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
	treeBuildArr: [],
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
	noOfDays:5,
	capacityPlanning: {},
	isFromJson: true,
	defectsArry:[],
	minBuckets:[],
	isPrefferdValZero:false,
	selectedDefArry:[],
	testdata:[],
	feature_table:'',
	mainTabsArray:['inputsSettingsTab','recomondationsTab','testBedsTab','testSettingsTab','optimizationsTab'],
	nextTabCount:0,
	buildAndReleaseArray:[],
	plan_recommandId:"",
	plan_optimizeID:"",
	regressionBucket:{},
	optBucket:[],
	ST:'ST',
	GT:'GT',
	CT:'CT',
	UST:'UST',
	NT:'NT',
	ET:'ET',
	LFT:'LFT',
	HFT:'HFT',
	BT:'BT',
	testTypeArray:[],
	featureOriginal:[],
	//Added for highlighting max def features
	 maxcount:0,
	 searchstring : '',
	 featureData : [],
	featureESData :[],
	releasesOpts:[],
	createplansRef:'',
	currentPlan:"",
	//need to be replaced with latest releases dynamically
	 releaseArraysorted :[20,21],
	 maxResults:20000,
	 
	 
    /* Init function  */
    init: function() {
		if (jQuery().datepicker) {
			$('.date-picker').datepicker({
				rtl: Metronic.isRTL(),
				orientation: "left",
				autoclose: true
			}); 
		}	 
        console.log("regression_optimization init()");   
        $( "#defsearch_div" ).hide( );
		var projectName = localStorage.getItem('projectName');
		regressionOptimization.onLoadCreatePlan();
		regressionOptimization.getCurrentPlan();
		regressionOptimization.getBuilds();				
		//regressionOptimization.calculateMaxNoTestcase();				
		//regressionOptimization.getAllFeatureHelper();	
		regressionOptimization.getEnvironmentHelper();
		regressionOptimization.loadRegressionResults();
		
		$('#page_regressionOptimization .release-builds-container #applyBtn').on("click", function (e) {
			regressionOptimization.buildQueryForBuildAndReleases();
		});
		
		$('.ro-defects-container .has-clear input[type="text"]').on('input propertychange', function() {
		  var $this = $(this);
		  var visible = Boolean($this.val());
		  $this.siblings('.form-control-clear').toggleClass('hidden', !visible);
		  if(visible)
			$("#page_regressionOptimization #searchDefects").removeClass('disabled')
		else
			$("#page_regressionOptimization #searchDefects").addClass('disabled')
		}).trigger('propertychange');

		$('.ro-defects-container .form-control-clear').click(function() {
		  $(this).siblings('input[type="text"]').val('')
			.trigger('propertychange').focus();
		}); 
		$('.ro-defects-container .has-clear input[type="text"]').keyup(function (e) {
			if (e.keyCode == 13) {				
			}
		});
		$('#page_regressionOptimization .ro-features-container .search-conatainer #featuresearchID').on ('keyup', regressionOptimization._filterInternal);
		
		 $("#page_regressionOptimization .start-date-conatainer").datepicker().on('changeDate', function(e) {
			//var startDate = $(this).datepicker("getDate").toISOString();
			e.preventDefault();
			regressionOptimization.st_date =  e.date;//$(this).datepicker("getDate");
			if(regressionOptimization.st_date>regressionOptimization.end_date){
				//alert("Regression Start Date should not Greater than End Date")
				$('#st_date').val("");
			}else{
				//console.log("---st_date***** "+st_date+"---end_date****** "+end_date)
				regressionOptimization.noOfDays = (regressionOptimization.end_date-regressionOptimization.st_date)/(1000*60*60*24)+1;
				regressionOptimization.noOfDays = Math.round(regressionOptimization.noOfDays)
				regressionOptimization.calMaxNoOfTestExecutions();
			}
			$(this).datepicker('hide');
		}); 
		
		//$("#page_regressionOptimization #endDate").change(function(e) {
		 $("#page_regressionOptimization .end-date-conatainer").datepicker().on('changeDate', function(e) {
			e.preventDefault();
			//var endDate = $(this).datepicker("getDate").toISOString();
			regressionOptimization.end_date =  e.date;//$(this).datepicker("getDate");			
			if(regressionOptimization.end_date<regressionOptimization.st_date){
				alert("Regression End Date should not less than Start Date")
				$('#endDate').val("");
			}else{
				//console.log("---st_date***** "+st_date+"---end_date****** "+end_date)
				regressionOptimization.noOfDays = (regressionOptimization.end_date-regressionOptimization.st_date)/(1000*60*60*24)+1;
				regressionOptimization.noOfDays = Math.round(regressionOptimization.noOfDays)
				regressionOptimization.calMaxNoOfTestExecutions();
			}
			$(this).datepicker('hide');
		});
		$('#feature_div .reg-opt-chkbox, #feature_div input[type=radio]').live('change', function(){
			 if($(this)[0].type == 'checkbox'){
				//if($(this).prop('checked') == true)
					regressionOptimization.updateFeatureCount();	
			 }else if($(this)[0].type == 'radio'){
				if($(this).closest("tr").find("td").children('.reg-opt-chkbox').prop('checked'))
					regressionOptimization.updateFeatureCount();
			 }
		});
		$("#page_regressionOptimization #planPopupCloseBtn, #page_regressionOptimization #planPopupCloseCrossBtn ").live("click", function(){
			//regressionOptimization.createplansRef.updatePlanData(false)
			//regressionOptimization.createplansRef.updatePlanData(true)
		});
		$("#jstree").live("check_node.jstree", function(eve){
			debugger;
			console.log("HELLLLLo!!! :"+eve)
			regressionOptimization.buildQueryForBuildAndReleases();
		});
		
		$('#testBedsTab').on('click','#testbeds > thead > tr > th.table-checkbox.sorting_disabled > input', function() {
			if($(this).prop("checked")){
                 $('input[type=checkbox]', $('#testbeds').dataTable().fnGetNodes() ).each(function(){
				    $(this).attr("checked",true);					
			    });
			}else{
				  $('input[type=checkbox]', $('#testbeds').dataTable().fnGetNodes() ).each(function(){
				    $(this).attr("checked",false);
					$(this).closest("tr").find("td:nth-child(3) input").val(0).attr("disabled",true);
			    });
			}            		
			regressionOptimization.showDistribution();
		});
     },
	 clear:function(){
		regressionOptimization.buildAndReleaseArray=[];
		$('#defects_div').empty(); 	
		regressionOptimization.featureKeys=[]
		regressionOptimization.constructFeatureTable(regressionOptimization.featureOriginal);
		$('#page_regressionOptimization .ro-defects-container .badge-info').text('0')	
		//$('#buckets').empty();
		//$('#opt_buckets').empty();		
		
		/* var data = '{"fileName":"del_reg_opt_intermediate","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,regressionOptimization.callBackClearResults); */
	 },
	/*  callBackClearResults:function(data){
	 console.log("--58--"+JSON.stringify(data))
	 
	 }, */
	 
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
		console.log("---envBrowers---"+JSON.stringify(envBrowers))
		regressionOptimization.configData1={};
		regressionOptimization.configData1 = envBrowers;
		$.each(envBrowers, function(key, item) {
			regressionOptimization.addConfigs(key, item);
		});
	 },		 
	 
	 loadRegOptPlan:function(){
		//regressionOptimization.currentPlan = regressionOptimization.createplansRef.currentSelectedPlanName;
		//regressionOptimization.displayplan(regressionOptimization.currentPlan);
		ISEUtils.portletBlocking("pageContainer");
		var requestObject = new Object();
		//var planName =regressionOptimization.currentPlan;
		requestObject.collectionName = "regopts_collection";
        requestObject.projectName = localStorage.getItem('projectName');
		requestObject.searchString = regressionOptimization.currentPlan;
		ISE.getRegPlanOptsMapSearchResults(requestObject, regressionOptimization.callBackloadRegOptPlan);
	    //alert("currentplan == "+regressionOptimization.currentPlan);
	 },		
	
	callBackloadRegOptPlan:function(options){
		//console.log("loadRegressionPlanData ---> "+JSON.stringify(options));
		var options_key =[];
		var options_type =[];
		var options_val =[];		
		var defectPkArr=[];
		var defectDisplayArr=[];
		var high_count = 0;
		var low_count = 0;
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
						console.log("regressionOptimizationtestdata"+regressionOptimization.testdata.length);
						//debugger;
						var builds = _.where(regressionOptimization.testdata, {data: val});		
						regressionOptimization.releasesOpts = _.where(builds[0].children, {text: key});
						if(builds.length>0){
							//$("#jstree").jstree("check_node", '#'+releases[0].id +' >a'); 
							$("#jstree").jstree("open_node", $('#'+builds[0].id)).bind("after_open.jstree",function(event, data, releases) {
								debugger;
								//console.log(data);
								if(regressionOptimization.releasesOpts.length>0)
									$("#jstree").jstree("check_node", '#'+regressionOptimization.releasesOpts[0].id +' >a').trigger("check_node.jstree");
								});
							//$("#jstree").jstree("select_node", '#'+builds[0].id).trigger("select_node.jstree");
						}
						//if(releases.length>0)
							//$("#jstree").jstree("check_node", '#'+releases[0].id +' >a').trigger("check_node.jstree");
						
					}if(options_type[i]=='FEATURES'){
						var key = options_key[i].trim(); 
						var val = options_val[i].trim();						
						//console.log("key - "+key+": val - "+val);
						if(val=="HIGH")
							high_count++;
						else if(val=="LOW")
							low_count++
						 var fetures = _.where(regressionOptimization.featureKeys, {fetval: key});
						$('#'+fetures[0].id).attr('checked',true);
						$('#'+fetures[0].ddid).find('input[type=radio]').each(function(){
							if($(this).val() == val)
							   $(this).attr('checked',true);
						})
					
					}if(options_type[i]=='DEFECTS'){
						var key = options_key[i].trim(); 
						var val = options_val[i].trim();
						if(regressionOptimization.defectsArry.indexOf(key) == -1){
							regressionOptimization.defectsArry.push(key);
						}
						
					}
				}
				$('#page_regressionOptimization .high-data-conatiner .badge-default').text(high_count);	
				$('#page_regressionOptimization .low-data-conatiner .badge-default').text(low_count);
				regressionOptimization.bugDisplays();
			
			}
			
		}else{			
			ISEUtils.portletUnblocking("pageContainer");
		}
	}, 
	_callBack_after_open:function(eve){
		debugger;
		console.log(eve);
	},
	bugDisplays:function(){
		var bugsArry=[];
		for(var bug=0;bug<regressionOptimization.defectsArry.length;bug++){
			bugsArry.push('"'+regressionOptimization.defectsArry[bug]+'"')
		}
		if(bugsArry.length>0){
			var fileName = "get_defect_by_id";
			var val="";
			var params = 'PARAM1='+bugsArry.toString()+'#&#'+'PARAM2='+val;		
			var fromCache ="false";		
			var data = "{fileName:'"+fileName+"',params:'"+params+"',projectName:'"+localStorage.getItem('projectName')+"',fromCache:'"+fromCache+"'}";		
			ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,regressionOptimization.callBackBugDetails);
		}else{			
			ISEUtils.portletUnblocking("pageContainer");
		}
	},
	callBackBugDetails:function(data){
	//console.log("--158--"+JSON.stringify(data))
		if(undefined != data && data.length>0){
			var defectsArray=[];
			for(var i=0;i<data.length;i++){
				var o ={};
				o.defect = data[i].defectid;
				o.title = data[i].title;
				defectsArray.push(o) 
			}
			regressionOptimization.displayDefects(defectsArray,true);
		}
	},
	 
	getBuilds:function(){		
		/* var data = '{"fileName":"get_builds","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('QueryReportingRestService', 'json', localStorage.authtoken,data,regressionOptimization.callBackGetBuilds); */
		//Mongo query to Elastic--->2
	    ISEUtils.portletBlocking("pageContainer");
	    var requestObject = new Object();
        requestObject.projectName = localStorage.getItem('projectName');
        requestObject.collectionName = "builds_collection";
        ISE.getBuildsInfo(requestObject, regressionOptimization.callBackGetBuilds); 
		
	},
	
	callBackGetBuilds:function(data){
	
		regressionOptimization.buildsArry=data;
		
		 var requestObject = new Object();
        requestObject.projectName = localStorage.getItem('projectName');
		requestObject.searchstring = '';
		
		//regressionOptimization.releaseArraysorted = [20,21]
		regressionOptimization.searchstring = '';
		for(var i=0;i<regressionOptimization.releaseArraysorted.length;i++)
		{
			if(i == 0)
			{
				regressionOptimization.searchstring = "(release:" +regressionOptimization.releaseArraysorted[i]+" OR "
			}
			else if(regressionOptimization.releaseArraysorted.length == 1 )
			{
				regressionOptimization.searchstring = "(release:" +regressionOptimization.releaseArraysorted[i]+")"
			}
			else if(i+1 == regressionOptimization.releaseArraysorted.length)
			{
				regressionOptimization.searchstring = regressionOptimization.searchstring+"(release:" +regressionOptimization.releaseArraysorted[i]+"))"
			}
			else
			{
				regressionOptimization.searchstring = regressionOptimization.searchstring+"release:" +"(release:" +regressionOptimization.releaseArraysorted[i]+") OR "
			}
		}
		requestObject.searchstring = regressionOptimization.searchstring
		
		if(regressionOptimization.searchstring != null && regressionOptimization.searchstring != '' && regressionOptimization.searchstring != undefined && regressionOptimization.searchstring != "null" && regressionOptimization.searchstring != "undefined")
		{
			requestObject.collectionName = "defectsheatmap_collection";
			ISE.getMaxCountForReleasesInfo(requestObject, regressionOptimization.callBackreleases);
			
		}
		else
		{
			regressionOptimization.getAllFeatureHelper();
		}
		
		ISEUtils.portletUnblocking("pageContainer");
		regressionOptimization.getTestExecutionData();		
	},
	callBackreleases:function(data)
	{
		if(data != null && data != '' && data != undefined && data != "null" && data != "undefined" && data.length > 0 && data[0].value != null)
		{
		var maxcount = data[0].value;
	
		 var requestObject = new Object();
		requestObject.serachType = 'similarserach'
		requestObject.projectName = localStorage.getItem('projectName');
		requestObject.maxResults = regressionOptimization.maxResults;
		requestObject.collectionName = "defectsheatmap_collection"
		var searchRange = (maxcount/2)-1 +"  TO  "+ maxcount+1
		//releaseArraysorted = [15,16];
		requestObject.searchString = regressionOptimization.searchstring+" AND (count :["+searchRange+"])";
		console.log("requestObject.searchstringrequestObject.searchstring"+requestObject.searchString);
		ISE.getMaxFeaturesofDefects(requestObject, regressionOptimization.callBackresults);
		}
		else
		{
			regressionOptimization.getAllFeatureHelper();
		}
	},
	callBackresults:function(data)
	{
		//console.log("datadata"+data);
		regressionOptimization.featureData = [];
		regressionOptimization.featureESData = []; 
		regressionOptimization.featureESData = data;
		if(data != null && data != '' && data != undefined && data != "null" && data != "undefined" && data.length > 0 )
		{
			for(var i=0; i<data.length;i++)
			{
				regressionOptimization.featureData.push(data[i].feature);
				
			}
		}
		regressionOptimization.getAllFeatureHelper();
	},
	getTestExecutionData:function(){
		/* var data = '{"fileName":"release_test_exec","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,regressionOptimization.callBackGetTestExecutionsData); */
		//Mongo query to Elastic--->3
		ISEUtils.portletBlocking("pageContainer");
		var requestObject = new Object();
        requestObject.projectName = localStorage.getItem('projectName');
		 requestObject.collectionName = "test_executions_collection";
        ISE.getTestExecsInfo(requestObject, regressionOptimization.callBackGetTestExecutionsData);
	},
	callBackGetTestExecutionsData:function(data){
		regressionOptimization.testExecutionArry = data;
		//console.log("testExectionsdata ---> "+JSON.stringify(regressionOptimization.testExecutionArry));	
		ISEUtils.portletUnblocking("pageContainer");		
		regressionOptimization.codeElementsData();
	  
	},
	codeElementsData:function(){
		ISEUtils.portletBlocking("pageContainer");
		var data = '{"fileName":"unq_builds_from_code_elements_by_date","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,regressionOptimization.callBackcodeElementsData);
	},
	callBackcodeElementsData:function(data){
		regressionOptimization.codeElmentsArry = data;
		//console.log("codeElementData ---> "+JSON.stringify(regressionOptimization.codeElmentsArry));
		//var releaseArry = regressionOptimization.getReleaseBuilds("L");
		var releaseArry = regressionOptimization.getReleaseBuilds("U");
		//console.log(""+JSON.stringify(releaseArry));

		/* $('#jstree').jstree({			
			"core" : {
			"themes" : {
			"variant" : "large"
			},
			'data' : releaseArry
			},	  

			"plugins" : [ "wholerow", "checkbox" ]
		}); */
		
		var fet=0;
		regressionOptimization.testdata=[];
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
					
					//regressionOptimization.testdata.push(fetKeyObj);	
					//console.log(regressionOptimization.testdata)
					//console.log(fetKeyObj);			                 
			        var parentNode=new Array();            
					 if(releaseArry[index].children != undefined)
						 {

							 for(var i=0;i<releaseArry[index].children.length;i++){
							  var fetKeyObj1 = {};   
							fet++;
							fetKeyObj1.id = "FET"+fet.toString();
							fetKeyObj1.fetval = releaseArry[index].children[i].id;
							fetKeyObj1.ddid = "FETDD"+fet.toString();
							//regressionOptimization.testdata.push(fetKeyObj1);	
							
							var childNode=new Object();
							childNode.id=fetKeyObj1.id+"_child";
							childNode.text=fetKeyObj1.fetval;          
							parentNode.push(childNode);							
							}
						 }
						 
						// var parentPriorityData=new Object();
			                  //	 parentPriorityData.Priority='<select id="'+ fetKeyObj.fetval + '" onchange=""></select>';
						 
						 if(parentNode.length > 0){                               

					                  	 regressionOptimization.testdata.push({
                                            "id":fetKeyObj.id+"_parent_"+parentNode.length,
					                    	"text":fetKeyObj.fetval, 
					                    	"data": fetKeyObj.fetval,                    	       	
					                    	"children":parentNode,					                    	
					                    	//state: { opened : true} 
					                    })					                  	
			                  	 }
			                  	 else
			                  	 {            
			                  	 	 regressionOptimization.testdata.push({
			                  	 	 		"id":fetKeyObj.id+"_parent_0",
					                    	"text":releaseArry[index].text, 
					                    	"data": "",
					                    	//state: { opened : true} 					                    	 
					                    })
								}
                }

    console.log(regressionOptimization.testdata)
           
        $("#jstree").jstree({
          "core": {
            "data":regressionOptimization.testdata,
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
		
        //$('#tree_25').jstree(true).refresh();
        	var tree = $("div#jstree").jstree();
        	//tree.refresh();	
			$("div#jstree").bind("ready.jstree", function () {
				console.log("Tree Comp LOADED ");
				//$(this).jstree("close_all");
				regressionOptimization.loadRegOptPlan();	
				ISEUtils.portletUnblocking("pageContainer");				
			}).jstree();
			if(regressionOptimization.selectedDefArry.length >0){
			//$("div#jstree").jstree("close_all");
				regressionOptimization.loadRegOptPlan();
			}
			
		ISEUtils.portletUnblocking("pageContainer");		
		$('#jstree').on("select_node.jstree", function (e, releaseArry) {
			 
			var loMainSelected = releaseArry;
			$("#jstree").jstree("open_node", "#" + releaseArry.node.id);
			regressionOptimization.storeBuildAndReleases (regressionOptimization.uiGetParents(releaseArry));
			if(regressionOptimization.buildAndReleaseArray.length>0){
				if($('#page_regressionOptimization .release-builds-container #applyBtn').hasClass('disabled')) 
					$('#page_regressionOptimization .release-builds-container #applyBtn').removeClass('disabled')
			}else if(regressionOptimization.buildAndReleaseArray.length <=0){
				if(!$('#page_regressionOptimization .release-builds-container #applyBtn').hasClass('disabled')) 
					$('#page_regressionOptimization .release-builds-container #applyBtn').addClass('disabled')
			}			
			
		});
		//$("#jstree").attr('disabled','disabled');
		$('#jstree').on("deselect_node.jstree", function (e, data) {
	
			//ISEUtils.portletBlocking("pageContainer");
			regressionOptimization.storeBuildAndReleases (regressionOptimization.uiGetParents(data));
			if(regressionOptimization.buildAndReleaseArray.length>0){
				if($('#page_regressionOptimization .release-builds-container #applyBtn').hasClass('disabled')) 
					$('#page_regressionOptimization .release-builds-container #applyBtn').removeClass('disabled')
			}else if(regressionOptimization.buildAndReleaseArray.length <=0){
				if(!$('#page_regressionOptimization .release-builds-container #applyBtn').hasClass('disabled')) 
					$('#page_regressionOptimization .release-builds-container #applyBtn').addClass('disabled')
				regressionOptimization.clear();
			}
			});
	},
	storeBuildAndReleases: function(selectedData){
		if(selectedData.build.length > 0){
			var buildDataFound = false;
				if(regressionOptimization.buildAndReleaseArray.length > 0){
					for(var k=0; k<regressionOptimization.buildAndReleaseArray.length; k++){
						if(regressionOptimization.buildAndReleaseArray[k].releases == selectedData.releases){
							regressionOptimization.buildAndReleaseArray[k] = selectedData;
							buildDataFound = true;
							break;
						}
					}
					
				}
				if(!buildDataFound){
					regressionOptimization.buildAndReleaseArray.push(selectedData);
				}
		}else{
			//var buildDataFoundForDelete = false;
			if(regressionOptimization.buildAndReleaseArray.length > 0){
				for(var m=0; m<regressionOptimization.buildAndReleaseArray.length; m++){
					if(regressionOptimization.buildAndReleaseArray[m].releases == selectedData.releases){
						//regressionOptimization.buildAndReleaseArray[m] = selectedData;
						regressionOptimization.buildAndReleaseArray.splice(m,1);
						//buildDataFoundForDelete = true;
						break;
					}
				}
				
			}
		}
		
			console.log("buildAndReleaseArray:~~> "+regressionOptimization.buildAndReleaseArray);
	},
	buildQueryForBuildAndReleases: function (){
		ISEUtils.portletBlocking("pageContainer");
		var queryStr = "";
		var tempqueryStr = "";
		for(var i=0; i<regressionOptimization.buildAndReleaseArray.length; i++){			
			if(i<regressionOptimization.buildAndReleaseArray.length-1)
				tempqueryStr += regressionOptimization.prepareIndBuildAndRelease(regressionOptimization.buildAndReleaseArray[i])+' OR ';
			else
				tempqueryStr +=regressionOptimization.prepareIndBuildAndRelease(regressionOptimization.buildAndReleaseArray[i]);	
		 }
		 queryStr +="("+tempqueryStr+")"
		 console.log("queryStr : " +queryStr);
		 var requestObject = new Object();
		requestObject.collectionName = "defect_collection";
        requestObject.projectName = localStorage.getItem('projectName');
		requestObject.searchString =	queryStr;
		ISE.getRegressionReleaseBuildDefectsSearchResults(requestObject, regressionOptimization.callBackConstructDefectsByBuilds);
	},
	prepareIndBuildAndRelease: function(data){
		var indQStr = '(release:"'+data['releases']+'" AND ([build_data])'
		var releaseQueryStr = "";
		for(var kk=0; kk<data['build'].length; kk++){
			if(kk<data['build'].length-1)
				releaseQueryStr +='build:"'+data['build'][kk]+'" OR ';
			else
				releaseQueryStr +='build:"'+data['build'][kk]+'")';
		 }
		 indQStr = indQStr.replace('[build_data]', releaseQueryStr)
		 return indQStr;
	},
	uiGetParents: function(loSelectedNode) {
        try {
            var lnLevel = loSelectedNode.node.parents.length;
            var lsSelectedID = loSelectedNode.node.id;
            var loParent = $("#" + lsSelectedID);
			var lsParents = "";
			for (var ln = 0; ln <= lnLevel -1 ; ln++) {
				var loParent = loParent.parent().parent();
				if (loParent.children()[1] != undefined) {
					lsParents += loParent.children()[1].text;
				}
			}
			if(lsParents.length <= 0){
				lsParents = loSelectedNode.node.text
			}
			var selectedReleases = [];
            if(loSelectedNode.node.children.length > 0){
				var totalSelectedChildren = loSelectedNode.node.children;
				for(var j=0; j<totalSelectedChildren.length; j++){
					var chkID = totalSelectedChildren[j];
					var is_clicked = $("#"+chkID+" a").hasClass('jstree-clicked') ? true : false;
					if(is_clicked){
						selectedReleases.push($("#"+chkID+" .jstree-clicked").text()); 
					}
				}
			}else if(loSelectedNode.selected.length>0){
				var totalSelectedChildren = $("#"+loSelectedNode.node.parent+ " ul li");
				//var totalSelectedChildren = parentInfo //loSelectedNode.selected;
				for(var j=0; j<totalSelectedChildren.length; j++){
					var chkID = $(totalSelectedChildren[j]).attr("id");
					var is_clicked = $("#"+chkID+" a").hasClass('jstree-clicked') ? true : false;
					if(is_clicked){
						selectedReleases.push($("#"+chkID+" .jstree-clicked").text()); 
					}
				}
			}
			
			var __obj = new Object()
			__obj.releases = lsParents;
			__obj.build = selectedReleases;
			return __obj;
            //alert(JSON.stringify(__obj));
        }
        catch (err) {
            alert('Error in uiGetParents');
        }
    },
	callBackUncheckDefectsByBuilds:function(data){
		//console.log(""+data.count)
		ISEUtils.portletUnblocking("pageContainer");
		var unCheckDefectsArray=[];
		// console.log("data --197--"+JSON.stringify(data))
		if(undefined != data && data.length>0){
			for(var i=0;i<data.length;i++){
				var id = data[i].defect;				
				console.log(id);				
				//unCheckDefectsArray.push(o)
				if(id != undefined){
				$('#'+id).attr('checked', false);
				}
				
				if(data[i].feature != undefined){
				var fetures = _.where(regressionOptimization.featureKeys, {fetval: data[i].feature});
				if(fetures != '')
				$('#'+fetures[0].id).attr('checked',false);
				}
			}
		}	
	},
	
	callBackConstructDefectsByBuilds:function(data){
		//debugger;
		//console.log(""+data.count)
		ISEUtils.portletUnblocking("pageContainer");
		regressionOptimization.defectsArry = [];
		var defectsArray=[];
		// console.log("data --197--"+JSON.stringify(data))
		if(undefined != data && data.length>0){
			for(var i=0;i<data.length;i++){
				var o ={};
				o.defect = data[i].defect;
				o.title = data[i].title;
				o.feature = data[i].feature;
				defectsArray.push(o) 
			}
			console.log("callBackConstructDefectsByBuilds defects array length"+defectsArray.length);
			regressionOptimization.defectsArry = defectsArray;
			regressionOptimization.displayDefects(regressionOptimization.defectsArry,false);
			//regressionOptimization.getFeatureByDefect();
			regressionOptimization.callBackGetFeatureByDefect();
		}		
	
	},	
	
	displayDefects:function(defectsArray,isDefaultChecked){
		
		if(undefined != regressionOptimization.selectedDefArry && regressionOptimization.selectedDefArry.length>0){
			
			for(var i=0;i<regressionOptimization.selectedDefArry.length;i++){
				var o ={};
				o.defect = regressionOptimization.selectedDefArry[i].defect;
				o.title = regressionOptimization.selectedDefArry[i].title;
				o.feature = regressionOptimization.selectedDefArry[i].feature;
				defectsArray.push(o) 
			}
		}
		$('#page_regressionOptimization .ro-defects-container .badge-info').text(defectsArray.length)	
		$('#defects_div').empty(); 	
		var rs="";		
		if(defectsArray.length > 0){
		console.log("displayDefects defects array length"+defectsArray.length);
		var b = true;
		rs += '<table  width="100%" border="0" cellspacing="1" cellpadding="1" class="table table-bordered table-hover" style="color: #333;"><tr><td style="width:50px;">Select</td><td style="width:50px;">Defect</td><td style="width:50px;">Title</td></tr>';
		
		for(var i=0; i<defectsArray.length;i++){
			
			String.prototype.replaceAll = function(target, replacement) {
						return this.split(target).join(replacement);
					};
					var title_text = (defectsArray[i].title).replaceAll('<' , ' ').replaceAll('>',' ');
					
			if(isDefaultChecked){
				if(b){						
					b = false;
				rs += '<tr style="background-color:white;"><td><input type="checkbox" checked name="regOptDefectCheckbox" title="'+defectsArray[i].defect+'#&#$'+title_text+'#&#$'+defectsArray[i].feature+'" onClick="regressionOptimization.callBackGetFeatureByDefect(id)" id="'+defectsArray[i].defect+'"></td><td>' + defectsArray[i].defect + '</td><td>' + defectsArray[i].title + '</td></tr>'; 
				} else{						
					b = true;
					rs += '<tr style="background-color:#F0F2F2;"><td><input type="checkbox" checked name="regOptDefectCheckbox"  title="'+defectsArray[i].defect+'#&#$'+title_text+'#&#$'+defectsArray[i].feature+'" onClick="regressionOptimization.callBackGetFeatureByDefect(id)" id="'+defectsArray[i].defect+'"></td><td>' + defectsArray[i].defect+ '</td><td>' + defectsArray[i].title + '</td></tr>';
				}	
			}else{
				if(null != regressionOptimization.defectsArry && regressionOptimization.defectsArry !=undefined){
					// if(regressionOptimization.defectsArry.indexOf(defectsArray[i].defect) !=-1){						 
						if(b){						
							b = false;
						rs += '<tr style="background-color:white;"><td><input type="checkbox" checked name="regOptDefectCheckbox"  title="'+defectsArray[i].defect+'#&#$'+title_text+'#&#$'+defectsArray[i].feature+'" onClick="regressionOptimization.callBackGetFeatureByDefect(id)" id="'+defectsArray[i].defect+'"></td><td>' + defectsArray[i].defect + '</td><td>' + defectsArray[i].title + '</td></tr>';
						} else{						
							b = true;
							rs += '<tr style="background-color:#F0F2F2;"><td><input type="checkbox" checked name="regOptDefectCheckbox"  title="'+defectsArray[i].defect+'#&#$'+title_text+'#&#$'+defectsArray[i].feature+'" onClick="regressionOptimization.callBackGetFeatureByDefect(id)" id="'+defectsArray[i].defect+'"></td><td>' + defectsArray[i].defect+ '</td><td>' + defectsArray[i].title + '</td></tr>';
						}
					// }
				/* else{
					if(b){						
						b = false;
					rs += '<tr style="background-color:white;"><td><input type="checkbox" name="regOptDefectCheckbox"  onClick="regressionOptimization.getFeatureByDefect(id)"  id="'+ defectsArray[i].defect +'" ></td><td>' + defectsArray[i].defect + '</td><td>' + defectsArray[i].title + '</td></tr>';
					} else{						
						b = true;
						rs += '<tr style="background-color:#F0F2F2;"><td><input type="checkbox" name="regOptDefectCheckbox"  onClick="regressionOptimization.getFeatureByDefect(id)"  id="'+ defectsArray[i].defect +'" ></td><td>' + defectsArray[i].defect+ '</td><td>' + defectsArray[i].title + '</td></tr>';
					}
					} */
				
				}
			}
			
		}
		}		
															   
		$('#defects_div').append(rs + '</table>'); 	
		//regressionOptimization._handleUniform();
		ISEUtils.portletUnblocking("pageContainer");	
	},
	
	//getFeatureByDefect:function(id){
	getFeatureByDefect:function(){
		// console.log("--243--"+id);
		var defArry=[];
		$('#defects_div input[type=checkbox]:checked').each(function () {			
			var value = this.id;
			//console.log("--247--"+value);			
				if(value !=undefined && value !=null){
					value='"'+value+'"';
					if(defArry.indexOf(value) == -1){
						defArry.push(value);
					}	
				}
			
		});
		
		// console.log("--254--"+JSON.stringify(defArry))
		var fileName = "find_feature_by_defectid";
		var val="";
		var params = 'PARAM1='+defArry.toString()+'#&#'+'PARAM2='+val;
		// console.log("--261----"+params)
		var fromCache ="false";
		var data = "{fileName:'"+fileName+"',params:'"+params+"',projectName:'"+localStorage.getItem('projectName')+"',fromCache:'"+fromCache+"'}";		
		ISE_Ajax_Service.ajaxPostReq('QueryReportingRestService', 'json', localStorage.authtoken,data,regressionOptimization.callBackGetFeatureByDefect);
		
		
	},
	
	callBackGetFeatureByDefect:function(data){
		$("#feature_div table input[name='regOptFeatureCheckbox']").attr("checked",false);
		 //console.log("--264--"+JSON.stringify(data))
		$('#defects_div input[type=checkbox]:checked').each(function () {			
			var id = $('#'+this.id).attr("title");
			var value = id.split('#&#$');	
			if(value[0] != null & value[0] !='undefined'){
			var o ={};
				o.defect = value[0];
				o.title = value[1];
				o.feature = value[2];
			regressionOptimization.defectsArry.push(o);			
			}			
		});	
		if(null !=regressionOptimization.defectsArry && undefined != regressionOptimization.defectsArry && regressionOptimization.defectsArry.length>0){		
			for(var fea=0;fea<regressionOptimization.defectsArry.length;fea++){
			// console.log("--274--"+data[fea].feature)
				if((regressionOptimization.defectsArry[fea].hasOwnProperty('feature')) && (regressionOptimization.defectsArry[fea].feature != undefined)){
				//loopCount++;
					var key = regressionOptimization.defectsArry[fea].feature.trim();
					var fetures = _.where(regressionOptimization.featureKeys, {fetval: key});
					//console.log("--277--"+JSON.stringify(fetures))
					if(fetures[0] != undefined && fetures[0].hasOwnProperty("id") == true){
					$('#'+fetures[0].id).attr('checked',true);
					}
				}
			}			
		
		}
		regressionOptimization.updateFeatureCount();
		//regressionOptimization._handleUniform();
	},
	loadRegressionResults:function(){		
		ISEUtils.portletBlocking("pageContainer");
		var requestObject = new Object();
		//var planName =regressionOptimization.currentPlan;
		requestObject.collectionName = "regressionplan_collection";
        requestObject.projectName = localStorage.getItem('projectName');
		requestObject.searchString = regressionOptimization.currentPlan;
		ISE.getRegressionPlanSearchResults(requestObject, regressionOptimization.callBackplanData);	
		
		
	},
	  
	callBackplanData:function(data){
		//alert("==953=="+JSON.stringify(data));
		ISEUtils.portletUnblocking("pageContainer");
		if(null !=data && undefined != data && data.length>0){
			console.log("recommandationId -- "+data[0].recommendation_executionid+" *****optimizationId*******"+data[0].optimization_executionid);
			regressionOptimization.plan_recommandId = data[0].recommendation_executionid;
			regressionOptimization.plan_optimizeID = data[0].optimization_executionid;
			
			regressionOptimization.loadRegressionTCresults(data[0].recommendation_executionid);
		}
	},
	  
	loadRegressionTCresults:function(recId){
		ISEUtils.portletBlocking("pageContainer");
		var requestObject = new Object();
		//var searchString =recId;
		requestObject.collectionName = "regression_tc_collection";
        requestObject.projectName = localStorage.getItem('projectName');
		requestObject.searchString = recId;
		ISE.getRegressionTestCaseSearchResults(requestObject, regressionOptimization.callBackGetRegressionResults);
	},
	
	 callBackGetRegressionResults:function(data){				
		console.log("load RegressionResults *********977****"+JSON.stringify(data));
		ISEUtils.portletUnblocking("pageContainer");
		regressionOptimization.recommendTCsArr = data;	
		regressionOptimization.callBackRegressionResults(data);						
				
	},
	  
	loadOptimizeTCresults:function(optimizeId){
		ISEUtils.portletBlocking("pageContainer");
		var requestObject = new Object();
		requestObject.collectionName = "regression_tc_collection";
        requestObject.projectName = localStorage.getItem('projectName');
		requestObject.searchString = optimizeId;
		ISE.getRegressionTestCaseSearchResults(requestObject, regressionOptimization.callBackOptimizeTCresults);
	},	
	  
	callBackOptimizeTCresults:function(data){
		//console.log("load optimize results *************"+JSON.stringify(data));
		ISEUtils.portletUnblocking("pageContainer");
		regressionOptimization.callBackOptimizationResults(data);
		regressionOptimization.optimizeTCsArr = data;
		//regressionOptimization.geenerateOptimizationOrder();		
				
	},	  
    	
	getAllFeatureHelper:function(){
		var data = '{"newfeaturedate":"30"}';		
		ISE_Ajax_Service.ajaxPostReq('MongoInputFeaturesDAOService', 'json', localStorage.authtoken,data,regressionOptimization.callBackgetFeatureData);
	},
	callBackgetFeatureData:function(data){
		regressionOptimization.featureOriginal=[]
		regressionOptimization.featureOriginal = data;
		for(var i=0;i<data.length;i++){
			var obj={};
			obj.id =data[i].id.trim();
			obj.text =data[i].title.trim();
			obj.higher =data[i].parent;			
			obj.isNew =data[i].isNew;
			obj.flag =data[i].flag;
			regressionOptimization.featureArr.push(obj);
			if(data[i].children && data[i].children != null && data[i].children != undefined) {
			for(var x=0;x<data[i].children.length;x++) {
				var obj={};
				obj.id =data[i].children[x].id.trim();
				obj.text =data[i].children[x].title.trim();
				obj.higher =data[i].children[x].parent;			
				//obj.isNew =data[i].isNew;
				obj.flag =data[i].children[x].flag;
				regressionOptimization.featureArr.push(obj);
			}
			}
		}
		
		regressionOptimization.constructFeatureTable(data);		
		regressionOptimization.loadRegOptPlan();
	},
	constructFeatureTable: function(featureDisplayArr){
		$('#feature_div').empty();
		$('#page_regressionOptimization .ro-features-container .badge-info').text(regressionOptimization.featureArr.length);
		var highCount = 0;
		var lowCount = 0;
		var fet=0;
		
		var tableTemp = '<table class="table tree table-inverse"><thead> <tr class="sm-text"> <th data-type="select">Select</th><th class="text-align-center" data-type="defect-feature">Feature</th><th data-type="defect-priority">Priority</th></tr></thead>  <tbody>';
		for(var i=0; i < featureDisplayArr.length; i++){
			var fetKeyObj = {};
			fet++;
			fetKeyObj.id = "FET"+fet.toString();
			fetKeyObj.fetval = featureDisplayArr[i]['id'];
			fetKeyObj.ddid = "FETDD"+fet.toString();
			
			regressionOptimization.featureKeys.push(fetKeyObj);
			
			var __id = (featureDisplayArr[i]['id']).replace(/\s/g,'');
			var __title = (featureDisplayArr[i]['title'])
			if(regressionOptimization.featureData.indexOf(__title) > -1)
			{
				 var featureList = _.where(regressionOptimization.featureESData, {feature: __title});
				var tooltip = '';
				for(var f=0; f<featureList.length;f++)
				{
					if(featureList.length == 1)
					{
						tooltip = tooltip + " release "+featureList[f].release +" defectcount is "+featureList[f].count 
					}
					else if(tooltip != '')
					{
						tooltip = tooltip + ", release "+featureList[f].release +" defectcount is "+featureList[f].count 
					}
					else
					{
						tooltip = tooltip + ", release "+featureList[f].release +" defectcount is "+featureList[f].count 
					}
					 
				} 
				
				tableTemp += '<tr title="'+tooltip+'" bgcolor="#ff6666" data-node="treetable-650__'+i+'" data-pnode="" name="'+__title+'"><td><input type="checkbox" class="reg-opt-chkbox" title="'+__title+'" name="regOptFeatureCheckbox" id="'+ fetKeyObj.id +'"></td><td class="feature-data sm-text" data-code="A" data-featureid="650-'+i+'"><span href="javascript:;">'+__title+'</span></td><td class="priority-row sm-text text-align-center"> <div id="'+ fetKeyObj.ddid + '" class="radio-list"><label class="radio-inline"><input type="radio" name="options-priority_'+ fetKeyObj.ddid + '" value="HIGH"> HIGH </label><label class="radio-inline"><input type="radio" name="options-priority_'+ fetKeyObj.ddid + '" value="LOW" checked="true"> LOW </label></div></td></tr>';
			}
			else
			{
				tableTemp += '<tr data-node="treetable-650__'+i+'" data-pnode="" name="'+__title+'"><td><input type="checkbox" class="reg-opt-chkbox" title="'+__title+'" name="regOptFeatureCheckbox" id="'+ fetKeyObj.id +'"></td><td class="feature-data sm-text" data-code="A" data-featureid="650-'+i+'"><span href="javascript:;">'+__title+'</span></td><td class="priority-row sm-text text-align-center"> <div id="'+ fetKeyObj.ddid + '" class="radio-list"><label class="radio-inline"><input type="radio" name="options-priority_'+ fetKeyObj.ddid + '" value="HIGH"> HIGH </label><label class="radio-inline"><input type="radio" name="options-priority_'+ fetKeyObj.ddid + '" value="LOW" checked="true"> LOW </label></div></td></tr>';
			}
			
			
			if(featureDisplayArr[i]['children'] && featureDisplayArr[i]['children'].length>0){
				for(var j=0; j < featureDisplayArr[i]['children'].length; j++){
					var fetKeyObj = {};
					fet++;
					fetKeyObj.id = "FET"+fet.toString();
					fetKeyObj.fetval = featureDisplayArr[i]['children'][j]['id'];
					fetKeyObj.ddid = "FETDD"+fet.toString();
					
					regressionOptimization.featureKeys.push(fetKeyObj);
					var ___id = (featureDisplayArr[i]['children'][j]['id']).replace(/\s/g,'');
					var ___title = featureDisplayArr[i]['children'][j]['title'];
					var featureid = '650-'+i+'-'+j;
					var parentfeatureid = 'treetable-650__'+i+'_'+j;
					//var tooltip = "";
					if(regressionOptimization.featureData.indexOf(___title) > -1)
					{
						 var featureList = _.where(regressionOptimization.featureESData, {feature: ___title});
						var tooltip = '';
						for(var f=0; f<featureList.length;f++)
						{
							tooltip = tooltip + "release"+featureList[f].release+" defectcount is"+featureList[f].count 
						} 
						tableTemp += '<tr title="'+tooltip+'" bgcolor="#ff6666"  data-node="'+parentfeatureid+'" data-pnode="treetable-650__'+i+'" name="'+___title+'"><td><input type="checkbox" title="'+___title+'" class="reg-opt-chkbox reg-opt-chkbox-child" name="regOptFeatureCheckbox" id="'+ fetKeyObj.id +'"></td><td class="feature-data sm-text" data-code="A" data-featureid="'+featureid+'"><span href="javascript:;">'+___title+'</span></td><td class="priority-row sm-text text-align-center"> <div id="'+ fetKeyObj.ddid + '" class="radio-list"><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="HIGH"> HIGH </label><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="LOW" checked="true"> LOW </label></div></td></tr>';
					}
					else
					{
						tableTemp += '<tr data-node="'+parentfeatureid+'" data-pnode="treetable-650__'+i+'" name="'+___title+'"><td><input type="checkbox" title="'+___title+'" class="reg-opt-chkbox reg-opt-chkbox-child" name="regOptFeatureCheckbox" id="'+ fetKeyObj.id +'"></td><td class="feature-data sm-text" data-code="A" data-featureid="'+featureid+'"><span href="javascript:;">'+___title+'</span></td><td class="priority-row sm-text text-align-center"> <div id="'+ fetKeyObj.ddid + '" class="radio-list"><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="HIGH"> HIGH </label><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="LOW" checked="true"> LOW </label></div></td></tr>';
					}
					
				}
			}
		}
		tableTemp +='</tbody></table>';
		$("#feature_div").append(tableTemp);
		/* $('#page_regressionOptimization .high-data-conatiner .badge-default').text(highCount);
		$('#page_regressionOptimization .low-data-conatiner .badge-default').text(lowCount); */
		$('#feature_div .table').treeTable({"treeColumn":0,"startCollapsed":true});
		 
	},		
	constructingTable:function (featureDisplayArr){		
		$('#feature_div').empty(); 
		$('#page_regressionOptimization .ro-features-container .badge-info').text(featureDisplayArr.length);
		var highCount = 0;
		var lowCount = 0;
		var rs="";		
		
		var b = true;
		rs += '<table  width="100%" border="0" cellspacing="1" cellpadding="1" class="table table-bordered table-hover" style="color: #333;"><thead><tr> <th style="width:50px;">Select</th><th style="width:50px;">Feature Name</th><th style="width:50px;">Priority</th></tr> </thead><tbody>';
		var fet=0;
		for(var i=0; i<featureDisplayArr.length;i++){
			var fetKeyObj = {};
			fet++;
			fetKeyObj.id = "FET"+fet.toString();
			fetKeyObj.fetval = featureDisplayArr[i].id;
			fetKeyObj.ddid = "FETDD"+fet.toString();
			
			regressionOptimization.featureKeys.push(fetKeyObj);		
			
			if(featureDisplayArr[i].higher == "true"){
				/* if(b){						
				b = false;
				rs += '<tr style="background-color:white;" class="danger"><td><input type="checkbox" name="regOptFeatureCheckbox"  onClick=""  id="'+ fetKeyObj.id +'" ></td><td>' + featureDisplayArr[i].id + '</td><td><div id="'+ fetKeyObj.ddid + '" class="radio-list"><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="HIGH" checked> HIGH </label><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="LOW"> LOW </label></div></td></tr>';
				} else{						
					b = true;
					rs += '<tr style="background-color:#F0F2F2;" class="danger"><td><input type="checkbox" name="regOptFeatureCheckbox"  onClick=""  id="'+ fetKeyObj.id +'" ></td><td>' + featureDisplayArr[i].id + '</td><td><div id="'+ fetKeyObj.ddid + '" class="radio-list"><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="HIGH"> HIGH </label><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="LOW" checked> LOW </label></div></td></tr>';
				} */
				rs += '<tr class="danger"><td class="ISEcompactAuto"><input type="checkbox" name="regOptFeatureCheckbox"  onClick=""  id="'+ fetKeyObj.id +'" ></td><td class="ISEcompactAuto">' + featureDisplayArr[i].id + '</td><td class="ISEcompactAuto"><div id="'+ fetKeyObj.ddid + '" class="radio-list"><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="HIGH" checked> HIGH </label><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="LOW"> LOW </label></div></td></tr>';
				highCount++;
			}	
			else{
				/* if(b){						
				b = false;
				rs += '<tr style="background-color:white;"><td><input type="checkbox" name="regOptFeatureCheckbox" style="paddingLeft:100px" onClick=""  id="'+ fetKeyObj.id +'" ></td><td>' + featureDisplayArr[i].id + '</td><td><div id="'+ fetKeyObj.ddid + '" class="radio-list"><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="HIGH"> HIGH </label><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="LOW" checked> LOW </label></div></td></tr>';
				} else{						
					b = true;
					rs += '<tr style="background-color:#F0F2F2;"><td><input type="checkbox" name="regOptFeatureCheckbox" style="paddingLeft:100px" onClick=""  id="'+ fetKeyObj.id +'" ></td><td>' + featureDisplayArr[i].id + '</td><td><div id="'+ fetKeyObj.ddid + '" class="radio-list"><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="HIGH"> HIGH </label><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="LOW" checked> LOW </label></div></td></tr>';
				} */
				rs += '<tr><td class="ISEcompactAuto"><input type="checkbox" name="regOptFeatureCheckbox" style="paddingLeft:100px" onClick=""  id="'+ fetKeyObj.id +'" ></td><td class="ISEcompactAuto">' + featureDisplayArr[i].id + '</td><td class="ISEcompactAuto"><div id="'+ fetKeyObj.ddid + '" class="radio-list"><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="HIGH"> HIGH </label><label class="radio-inline"><input type="radio" name="optionsPriority_'+ fetKeyObj.ddid + '" value="LOW" checked> LOW </label></div></td></tr>';
				lowCount++;
			}
			
		}						
															   
		$('#feature_div').append(rs + '</tbody></table>'); 			
		$('#page_regressionOptimization .high-data-conatiner .badge-default').text(highCount);
		$('#page_regressionOptimization .low-data-conatiner .badge-default').text(lowCount);
		 
		regressionOptimization.feature_table =  $('#page_regressionOptimization #feature_div .table').DataTable({
					"paging":   false,
					"ordering": false,
					"info":     false,
					"searching": false,
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
					// So when dropdowns used the scrollable div should be removed. 
					//"dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>r>t<'row'<'col-md-12 col-sm-12'p><'col-md-7 col-sm-12'>>",
					"bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

					"columnDefs": [{
						"orderable": false,
						"targets": [0]
					}],
					"lengthMenu": [
						[5, 15, 20, -1],
						[5, 15, 20, "All"] // change per page values here
					] ,
					
					// set the initial value
					 
					"language": {
						"emptyTable": "No data available in table",
						"infoEmpty": "No entries found",
						"info": "Showing _START_ to _END_ of _TOTAL_ Rows",
						"lengthMenu": " _MENU_ Rows per page",
						
					},
					"autoWidth": true
				});
		//regressionOptimization._handleUniform();
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
						if(regressionOptimization.testExecutionArry[j].build == null){regressionOptimization.testExecutionArry[j].build="null"}
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
		regressionOptimization.testTypeArray=[];
		regressionOptimization.regressionBucket={};
		regressionOptimization.getCurrentPlan();
		if(regressionOptimization.plan_recommandId ==""){
			alert("Mandatory plan creation before recommended Testcases !!!!!");
		}else{
			ISEUtils.portletBlocking("pageContainer")
			$('#tabUL a[href="#recomondationsTab"]').trigger('click');
			var featureVals = [];
			var releaseBuildVals=[];
			
			$('#feature_div > table > tbody > tr > td > input:checkbox[name=regOptFeatureCheckbox]:checked').each(function(e) {
				var selectedRowTitle = tilte = $(this).attr("title");
				var selectedRowPriority  = $(this).parent().parent().find('.priority-row').find('input[type="radio"]:checked').val();
				featureVals.push(selectedRowTitle+"|"+selectedRowPriority);		
			});
			regressionOptimization.defectsArry=[];
			
			$('#defects_div input[type=checkbox]:checked').each(function () {			
				var value = this.id;
				//var defects = _.where(regressionOptimization.featureKeys, {id: this.id});
				//console.log("--532--"+value)
				if(this.id != null & this.id !='undefined')
				regressionOptimization.defectsArry.push(this.id)
				
			});
			
			console.log("releaseBuildVals -------"+JSON.stringify(releaseBuildVals));
			console.log("featureVals -------"+JSON.stringify(featureVals));
			console.log("defects -------"+JSON.stringify(regressionOptimization.defectsArry));
			//regressionOptimization.buildAndReleaseArray=[];
			var planName=regressionOptimization.currentPlan;		
			//console.log("releaseBuildVals---------"+JSON.stringify(releaseBuildVals));
			//buildIds -----> 15.2 :true:L,16.100000000000001 :true:L,17.100000000000001 :true:L,18.2 :true:L,19.100000000000001 :true:L,20.100000000000001 :true:L,21.1 :true:L,21.1 :true:T,21.2 :true:T,20.2 :true:T,19.100000000000001 :true:T,18.2 :true:T,18.100000000000001 :true:T,17.2 :true:T 
			//DefectIds -----> 786744,781293,749505,761897,773706 
			//FeaturesExtra -----> browser|LOW,browsing|LOW,button|HIGH,cache|LOW,chat|HIGH,click-to-play|HIGH,collapse|LOW,context menu|HIGH,bookmark|LOW,breakpad|HIGH 
			//planName -----> svdplan
			//getRecommandTestcases(buildIds,defectIds,featuresExtra,planName);
			
			
			// var buildAndRelease_array = [];
			// for(var k=0; k<regressionOptimization.buildAndReleaseArray.length; k++){
				// buildAndRelease_array.push(regressionOptimization.buildAndReleaseArray[k]['releases'])
				
				// for(var m=0; m< regressionOptimization.buildAndReleaseArray[k]['build'].length; m++){
					// buildAndRelease_array.push(regressionOptimization.buildAndReleaseArray[k]['build'][m])
				// }
				
			// }
			
			var releaseBuilds ="" ;
			var releaseBuildArry=[];
			for(var k=0; k<regressionOptimization.buildAndReleaseArray.length; k++){
				//buildAndRelease_array.push(regressionOptimization.buildAndReleaseArray[k]['releases'])
				
				for(var m=0; m< regressionOptimization.buildAndReleaseArray[k]['build'].length; m++){
					releaseBuilds += "OR ( release:"+regressionOptimization.buildAndReleaseArray[k]['releases']+" AND build:"+regressionOptimization.buildAndReleaseArray[k]['build'][m]+" ) ";
					releaseBuildArry.push(regressionOptimization.buildAndReleaseArray[k]['releases']+"|"+regressionOptimization.buildAndReleaseArray[k]['build'][m]);
				}
				
			}
			
			releaseBuilds = releaseBuilds.trim();			
			var text2 = "OR";
			releaseBuilds = releaseBuilds.substring(releaseBuilds.indexOf(text2) + text2.length),releaseBuilds.length;
			console.log("1106=== "+releaseBuilds);
			//alert(releaseBuilds);
			 
			 
			var requestObject = {};
			requestObject.title = "";
			requestObject.searchString = releaseBuilds;
			requestObject.projectName = localStorage.getItem('projectName');
			requestObject.maxResults = regressionOptimization.maxResults;
			requestObject.serachType = "search"; 
			requestObject.collectionName = "codeelements_collection";
			ISE.getSearchResults(requestObject, regressionOptimization._callBackCodeelements); 
			 
			console.log(releaseBuilds);
			
			var cleanROP = {"requesttype":"cleanROP","projectName":localStorage.getItem('projectName'),"username":localStorage.getItem('username'),"planId": planName};
			try{
				var resp1 = ISE_Ajax_Service._genericServiceCall("saveRegressionOptimization",cleanROP);
			}catch(err){}
			//save regression plan options mapping
			var regOptionsMappingJson = {"requesttype":"regressionplan_options_mapping","projectName":localStorage.getItem('projectName'),"username":localStorage.getItem('username'),"buildIds":releaseBuildArry,"defectIds": regressionOptimization.defectsArry,"features": featureVals,"planId": planName};
			try{
			var resp2 = ISE_Ajax_Service._genericServiceCall("saveRegressionOptimization",regOptionsMappingJson);
			}catch(err){}
			//console.log("regPlanJson == "+regPlanJson);
			console.log("cleanROP == "+cleanROP);
			console.log("regOptionsMappingJson == "+regOptionsMappingJson);
		}
	},

	_callBackCodeelements : function(data){
		//console.log(JSON.stringify(data));
		var fileArry=[];
		if(null != data && undefined != data && data.length>0){
			var len= Math.min(data.length, 1000)
			for(var i=0;i<len;i++){
				fileArry.push(data[i].codecomponent);
			}
			
		}
		var requestObject = {};
		var query =  {"query" : { "constant_score" : {"filter" : {"terms" : { "_id" : fileArry}}}}};
		console.log(query);
		requestObject.projectName = localStorage.getItem('projectName');
		requestObject.collectionName = "file_testcase_collection";
		requestObject.query = query;
		ISE.multipleExactValuesESQuery(requestObject, regressionOptimization._callBackSVD); 
	
	},
	
	_callBackSVD : function (data){
		//console.log("==1168=="+JSON.stringify(data));
		var testcaseArry = [];		
		for(var i=0;i<data.length;i++){
			if(data[i]._source.testcases.length>0)
				testcaseArry.push(data[i]._source.testcases[0].testcaseid);
		}
		
		//if(testcaseArry.length>0){
			regressionOptimization.getTC(testcaseArry,regressionOptimization.CT);
		//}
	},
	
	getTC : function (testcaseArry,tcType){
		var requestObject = {};
		var query =  { "query" : {  "constant_score" : { "filter" : { "terms" : { "_id" : testcaseArry } } } }}
		requestObject.projectName = localStorage.getItem('projectName');
		requestObject.collectionName = "testcase_collection";
		requestObject.maxResults = regressionOptimization.maxResults;				
		requestObject.query = query;
		ISE.multipleExactValuesESQuerySpl(requestObject, regressionOptimization._callBackTC,tcType);
	},
	
	_callBackTC : function(dataobj){
		var CTarry=[];
		//console.log("==1187=="+JSON.stringify(dataobj));
		var data = dataobj.data;
		var tcType = dataobj.tcType;		
		//alert("==1187=="+JSON.stringify(data))
		if(null !=data && data.length>0){
			for(var i=0;i<data.length;i++){
				var obj={};
				obj.testcase = data[i]._source._id;
				if(data[i]._source.hasOwnProperty('primary_feature'))
					obj.feature = data[i]._source.primary_feature;
				obj.rag_status = data[i]._source.rag_status;
				obj.title = data[i]._source.title;
				obj.rag_value = data[i]._source.rag_value;
				obj.thresold_prob = data[i]._source.thresold_prob;
				obj.defect_prob = data[i]._source.defect_prob;
				CTarry.push(obj);
			}
			}
			regressionOptimization.regressionBucket[tcType]= CTarry;
			
			//preparing a query
			var requestObject = {};
			var query="";
			var collectionName="";
			var callbackfunction="";
			if(regressionOptimization.testTypeArray.indexOf(regressionOptimization.ST) ==-1){	
				regressionOptimization.testTypeArray.push(regressionOptimization.ST);
				var query =  { "query": { "bool": { "must": [ {"term": { "testtype": { "value": "sanity" }}}]}}};
				requestObject.projectName = localStorage.getItem('projectName');
				requestObject.collectionName = "testcase_collection";
				requestObject.query = query;
				requestObject.maxResults = regressionOptimization.maxResults;				
				ISE.multipleExactValuesESQuery(requestObject, regressionOptimization._callbackST);
			
			}else if(regressionOptimization.testTypeArray.indexOf(regressionOptimization.GT) ==-1){	
				regressionOptimization.testTypeArray.push(regressionOptimization.GT);
				//var query =  { "query": { "bool": { "must": [ {"term": { "testtype": { "value": "regression" }}}]}}};
				var query = { "query": {"constant_score" : { "filter" : {"bool" : {"must" : [{ "term" : { "testcasetype" : "G" } } ]}} }  }};
				requestObject.projectName = localStorage.getItem('projectName');
				requestObject.collectionName = "testcase_collection";
				requestObject.query = query;
				requestObject.maxResults = regressionOptimization.maxResults;								
				ISE.multipleExactValuesESQuery(requestObject, regressionOptimization._callbackGT);
			
			}else if(regressionOptimization.testTypeArray.indexOf(regressionOptimization.HFT) ==-1){	
				regressionOptimization.testTypeArray.push(regressionOptimization.HFT);
				var query =  {  "query": {"query_string": {  "query": "option_value:\"HIGH\" AND option_type:\"FEATURES\" "   }}};
				requestObject.projectName = localStorage.getItem('projectName');
				requestObject.collectionName = "regopts_collection";
				requestObject.query = query;
				requestObject.maxResults = regressionOptimization.maxResults;				
				ISE.multipleExactValuesESQuery(requestObject, regressionOptimization._callbackHFT);
			
			}else if(regressionOptimization.testTypeArray.indexOf(regressionOptimization.LFT) ==-1){	
				regressionOptimization.testTypeArray.push(regressionOptimization.LFT);
				var query =  {  "query": {"query_string": {  "query": "option_value:\"LOW\" AND option_type:\"FEATURES\" "   }}};
				requestObject.projectName = localStorage.getItem('projectName');
				requestObject.collectionName = "regopts_collection";
				requestObject.query = query;
				requestObject.maxResults = regressionOptimization.maxResults;
				ISE.multipleExactValuesESQuery(requestObject, regressionOptimization._callbackLFT);
			}
			else if(regressionOptimization.testTypeArray.indexOf(regressionOptimization.BT) ==-1){	
				regressionOptimization.testTypeArray.push(regressionOptimization.BT);
				//var query =  { "query" : { "constant_score" : "filter" : {   "terms": { "_id": regressionOptimization.defectsArry  }  } }};
				var query =  { "query" : {  "constant_score" : { "filter" : { "terms" : { "_id" : regressionOptimization.defectsArry } } } }}
				requestObject.projectName = localStorage.getItem('projectName');
				requestObject.collectionName = "defect_collection";
				requestObject.query = query;			
				requestObject.maxResults = regressionOptimization.maxResults;
				ISE.multipleExactValuesESQuery(requestObject, regressionOptimization._callbackBT);
			}
			else if(regressionOptimization.testTypeArray.indexOf(regressionOptimization.UST) ==-1){	
				regressionOptimization.testTypeArray.push(regressionOptimization.UST);
				var query =  { "query": {"query_string": {  "query": "rag_status:\"R\"  "  }}};
				requestObject.projectName = localStorage.getItem('projectName');
				requestObject.collectionName = "testcase_collection";
				requestObject.query = query;
				requestObject.maxResults = regressionOptimization.maxResults;				
				ISE.multipleExactValuesESQuery(requestObject, regressionOptimization._callbackUST);
			}else if(regressionOptimization.testTypeArray.indexOf(regressionOptimization.ET) ==-1){	
				regressionOptimization.testTypeArray.push(regressionOptimization.ET);
				var query = { "query": {"constant_score" : { "filter" : {"bool" : {"must" : [{ "term" : { "testcasetype" : "ET" } } ]}} }  }};
				requestObject.projectName = localStorage.getItem('projectName');
				requestObject.collectionName = "testcase_collection";
				requestObject.query = query;
				requestObject.maxResults = regressionOptimization.maxResults;
				ISE.multipleExactValuesESQuery(requestObject, regressionOptimization._callbackET);
			}else if(regressionOptimization.testTypeArray.indexOf(regressionOptimization.NT) ==-1){	
				regressionOptimization.testTypeArray.push(regressionOptimization.NT);
				var query = { "query": {"constant_score" : { "filter" : {"bool" : {"must" : [{ "term" : { "testcasetype" : "NT" } } ]}} }  }};
				requestObject.projectName = localStorage.getItem('projectName');
				requestObject.collectionName = "testcase_collection";
				requestObject.query = query;
				requestObject.maxResults = regressionOptimization.maxResults;				
				ISE.multipleExactValuesESQuery(requestObject, regressionOptimization._callbackNT);
			}else{
				var regressionBucket={"_id":regressionOptimization.plan_recommandId,"job_id":regressionOptimization.plan_recommandId,"created_date":new Date().toISOString(),"buckets":regressionOptimization.regressionBucket};
				var regJson = {"requesttype":"regressionBucket","username":localStorage.getItem('username'),"projectName":localStorage.getItem('projectName'),"regBucket":regressionBucket};
				console.log("==1341=="+JSON.stringify(regJson));
				try{
					var respRegJson = ISE_Ajax_Service._genericServiceCall("saveRegressionOptimization",regJson);
				}catch(err){
				}
				
				setTimeout(function(){regressionOptimization.fetchRegressionResults()},5000);
			}		
			
	},
		  
	fetchRegressionResults:function(){ 		
		var requestObject1 = {};
		requestObject1.collectionName = "regression_tc_collection";
		requestObject1.projectName = localStorage.getItem('projectName');
		requestObject1.searchString = regressionOptimization.plan_recommandId;
		ISE.getRegressionTestCaseSearchResults(requestObject1, regressionOptimization.callBackGetRegressionResults);
				
	},
	
	_callbackUST : function(data){
		var tcArray=[];
		if(null !=data && data.length>0){
			for(var i=0;i<data.length;i++){
				tcArray.push(data[i]._id);
			}
		}
		regressionOptimization.getTC(tcArray,regressionOptimization.UST);
	},
	
	 _callbackBT : function(data){
		var tcArray=[];
		if(null !=data && data.length>0){
			for(var i=0;i<data.length;i++){
				if(data[i]._source.hasOwnProperty('testcases') && data[i]._source.testcases[0])
					tcArray.push(data[i]._source.testcases[0].test_case_id);
			}
		}
		regressionOptimization.getTC(tcArray,regressionOptimization.BT);
	}, 
	
	/*_callbackBT : function(data){
	  var tcArray=[];
	  if(null !=data && data.length>0){
		 for(var i=0;i<data.length;i++){
			//tcArray.push(data[i]._source.testcases.test_case_id);
			if(data[i]._source.testcases) {
			   for(var j=0;j<data[i]._source.testcases.length;j++) {
							  tcArray.push(data[i]._source.testcases[j].test_case_id);
			   }
			}
		 }
	  }
	  regressionOptimization.getTC(tcArray,regressionOptimization.BT);
	},*/

	
	_callbackST : function(data){
		var tcArray=[];
		if(null !=data && data.length>0){
			for(var i=0;i<data.length;i++){
				tcArray.push(data[i]._id);
			}
		}
		regressionOptimization.getTC(tcArray,regressionOptimization.ST);
	},
	
	_callbackGT : function(data){
		var tcArray=[];
		if(null !=data && data.length>0){
			for(var i=0;i<data.length;i++){
				tcArray.push(data[i]._id);
			}
		}
		regressionOptimization.getTC(tcArray,regressionOptimization.GT);
	},
	
	_callbackLFT : function(data){
		var features=[];
		if(null !=data && data.length>0){
			for(var i=0;i<data.length;i++){
				features.push(data[i]._source.option_key);
			}
		}
		var requestObject = {};
		var query =  { "query" : {  "constant_score" : { "filter" : { "terms" : { "primary_feature" : features } } } }};
		requestObject.projectName = localStorage.getItem('projectName');
		requestObject.collectionName = "testcase_collection";
		requestObject.query = query;
		requestObject.maxResults = regressionOptimization.maxResults;
		ISE.multipleExactValuesESQuery(requestObject, regressionOptimization._callBackLFTC);
		
	},
	
	_callBackLFTC : function(data){
		var tcArray=[];
		if(null !=data && data.length>0){
			for(var i=0;i<data.length;i++){
				tcArray.push(data[i]._id);
			}
		}
		regressionOptimization.getTC(tcArray,regressionOptimization.LFT);
	},
	
	_callbackHFT : function(data){
		var features=[];
		if(null !=data && data.length>0){
			for(var i=0;i<data.length;i++){
				features.push(data[i]._source.option_key);
			}
		}
		var requestObject = {};
		var query =  { "query" : {  "constant_score" : { "filter" : { "terms" : { "primary_feature" : features } } } }}
		requestObject.projectName = localStorage.getItem('projectName');
		requestObject.collectionName = "testcase_collection";
		requestObject.query = query;
		requestObject.maxResults = regressionOptimization.maxResults;
		ISE.multipleExactValuesESQuery(requestObject, regressionOptimization._callBackFTC);
		
	},
	
	_callBackFTC : function(data){
		var tcArray=[];
		if(null !=data && data.length>0){
			for(var i=0;i<data.length;i++){
				tcArray.push(data[i]._id);
			}
		}
		regressionOptimization.getTC(tcArray,regressionOptimization.HFT);
	},
	_callbackET : function(data){
		var tcArray=[];
		if(null !=data && data.length>0){
			for(var i=0;i<data.length;i++){
				tcArray.push(data[i]._id);
			}
		}
		regressionOptimization.getTC(tcArray,regressionOptimization.ET);
	},
	_callbackNT : function(data){
		var tcArray=[];
		if(null !=data && data.length>0){
			for(var i=0;i<data.length;i++){
				tcArray.push(data[i]._id);
			}
		}
		regressionOptimization.getTC(tcArray,regressionOptimization.NT);
	},
	
	
		
	callBackRegressionResults:function(data){
		console.log("--- callBackRegressionResults is calling .........")
		//console.log("REGRESSION RESULTS -- "+JSON.stringify(data))
		$('#buckets').empty();
		regressionOptimization.recSet = data[0];
		regressionOptimization.tcList = [];
		var len=0;
		regressionOptimization.settings={};
		regressionOptimization.recSet.settings = new Object();
		$.each(data[0].buckets, function(key, item) {
			console.log("r");
			if(item && null!=item){
				len=item.length;
			}else{
				len=0;
			}
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
		$('span#regressionUnqTCs').text(regressionOptimization.tcList.length)
		
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
		console.log("------488---optimizeId--"+regressionOptimization.plan_optimizeID)
		ISEUtils.portletUnblocking("pageContainer");
		regressionOptimization.loadOptimizeTCresults(regressionOptimization.plan_optimizeID);	
	},
	

	getEnvironmentHelper:function(){
		/* var data = '{"fileName":"get_environments","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('QueryReportingRestService', 'json', localStorage.authtoken,data,regressionOptimization.callBackgetEnvironmentsHelper); */
		//Mongo query to Elastic--->8
		//ISEUtils.portletBlocking("pageContainer");
		var requestObject = new Object();
		requestObject.collectionName = "testbeds_collection";
        requestObject.projectName = localStorage.getItem('projectName');
		ISE.getEnvironments(requestObject, regressionOptimization.callBackgetEnvironmentsHelper);
	},
	callBackgetEnvironmentsHelper:function(data){
		//console.log("environments -- "+JSON.stringify(data))		
		regressionOptimization.addTestBeds(data);
		regressionOptimization.loadTestbedConfig(data);
		
	},	
	
	readConfig:function(){
		$.getJSON("json/data.json", function(data) {
			//console.log("--529-----"+data.istestbedsJSON)
			var envFields = data.environement_fields;
			console.log("==envFields=="+envFields.length)
			if(data.istestbedsJSON){
				console.log("--536-----"+data.istestbedsJSON)
				regressionOptimization.StartMethods();
			}else{	
				console.log("--539-----"+data.istestbedsJSON)				
				//regressionOptimization.getEnvBrowerMarketByTestExe();				
				regressionOptimization.getTestBedData(envFields);
				
			}
		});
		
	},
	getTestBedData:function(envFields){
		var data = '{"requesttype":"unqTestbeds","testbeds":"'+envFields+'","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('RegressionOptimizationRestFulService', 'json', localStorage.authtoken,data,regressionOptimization.callBackTestBedData);
	},
	callBackTestBedData:function(data){
		console.log("==736=="+JSON.stringify(data))
		regressionOptimization.configData1={};
		regressionOptimization.configData1 = data;
		$.each(data, function(key, item) {
			regressionOptimization.addConfigs(key, item);
		});	
		
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
			//alert("min value "+minVal+"  must not be greater than "+itemlen+" size of "+key)
		} 
		console.log(" 566- "+$('#Min_'+key).text())
		regressionOptimization.recSet.settings[key+"Min"]=parseInt($('#Min_'+key).text());
		regressionOptimization.recSet.settings[key+"Pref"]=parseInt($('#Pref_'+key).text());
		regressionOptimization.recSet.settings[key+"Pic"]=0;
		regressionOptimization.recSet.settings[key+"Wt"]=parseInt($('#Wt_val_'+key).text());	
		if(!regressionOptimization.recSet.settings[key+"isRpt"])
			reqCountSplt=reqCountSplt+parseInt(regressionOptimization.recSet.settings[key+"Pref"]);
	});
	
	//getting the each testbed required counts and
	$.each(regressionOptimization.testBedDist, function(keyTB, itemTB) {
		//itemTB.tcCount = (regressionOptimization.totalExe-reqCountSplt)*itemTB.dist/100 ;
		itemTB.tcCount = parseInt(($('#maxNoOfTestCases').val()-reqCountSplt)*itemTB.dist/100) ;
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
				//reqCountSplt = reqCountSplt+regressionOptimization.recSet.settings[keyBTC+"Pref"];
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
				itemTC.pobability = itemTC.pobability+(parseInt(itemTC[regressionOptimization.recSet.settings[keyBTC+"Prb"]])*regressionOptimization.recSet.settings[keyBTC+"Wt"]);
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
		//if(!regressionOptimization.recSet.settings[keyBTC+"isRpt"] && n<reqCountSplt && regressionOptimization.recSet.settings[keyBTC+"Pic"]<regressionOptimization.recSet.settings[keyBTC+"Min"]) {
			$.each(notPicked, function(keyTC, itemTC) {
			if(!regressionOptimization.recSet.settings[keyBTC+"isRpt"] && n<reqCountSplt && regressionOptimization.recSet.settings[keyBTC+"Pic"]<regressionOptimization.recSet.settings[keyBTC+"Min"]) {
				if(itemTC[keyBTC] && !itemTC.picked) {
					itemTC.picked=true;
					spltOptList[keyBTC].push(itemTC);
					n++
				}
				}
			});
		//}
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
	//console.log("--846--"+JSON.stringify(regressionOptimization.recSet.settings))
	regressionOptimization.recSet.settings.capacityPlanning  = regressionOptimization.capacityPlanning;
	
	var optTCs = {"_id":regressionOptimization.plan_optimizeID,"job_id":regressionOptimization.plan_optimizeID,"created_date":new Date().toISOString(),"buckets":regressionOptimization.optResults, "settings":regressionOptimization.recSet.settings};
	//callBackOptimizationResults(optTCs);
	//console.log("optimization res ====="+JSON.stringify(optTCs))
	//var planName="svdplan";
	//var opt_data = '{"requesttype":"optimizedTCs","buckets": '+JSON.stringify(optTCs)+',"planId": "'+planName+'"}';
	var optJson = {"requesttype":"optBucket","username":localStorage.getItem('username'),"projectName":localStorage.getItem('projectName'),"optBucket":optTCs};
	//console.log("==1716=="+JSON.stringify(optJson));
	
	
	if(!isMinGreater){
		ISEUtils.portletBlocking("pageContainer")
		console.log("conditons satisfied ************** "+isMinGreater)
		//ISE_Ajax_Service.ajaxPostReq('RegressionOptimizationRestFulService', 'json', sessionStorage.authtoken,opt_data,regressionOptimization.callBackOptimizationResults);	
		try{
		var respRegJson = ISE_Ajax_Service._genericServiceCall("saveRegressionOptimization",optJson);
		}catch(err){
		}
		
		setTimeout(function(){regressionOptimization.delayoptimizationResults(regressionOptimization.plan_optimizeID)},3000);
		
	}else{
		//alert("some min values are greater than size of the bucket")
	}
	
},	

delayoptimizationResults :function(){
	var requestObject1 = {};
	requestObject1.collectionName = "regression_tc_collection";
	requestObject1.projectName = localStorage.getItem('projectName');
	requestObject1.searchString = regressionOptimization.plan_optimizeID;
	ISE.getRegressionTestCaseSearchResults(requestObject1, regressionOptimization.callBackOptimizationResults);

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
		
	//onsole.log("---851 -- "+regressionOptimization.capacityPlanning["start_date"])	
	//if(null != regressionOptimization.capacityPlanning && regressionOptimization.capacityPlanning.length>0){
		console.log("stdate ******** 854--"+regressionOptimization.capacityPlanning["start_date"])
		var stDate = new Date(regressionOptimization.capacityPlanning["start_date"]);		
		console.log("stdate ******** 856--"+(stDate.getMonth()+1)+"/"+stDate.getDate()+"/"+stDate.getFullYear());		
		document.getElementById("startDate").value=(stDate.getMonth()+1)+"/"+stDate.getDate()+"/"+stDate.getFullYear();
		regressionOptimization.st_date=(stDate.getMonth()+1)+"/"+stDate.getDate()+"/"+stDate.getFullYear();
		console.log("stdate ******** 859--"+regressionOptimization.st_date)		
		var end_Date = new Date(regressionOptimization.capacityPlanning["end_date"]);				
		document.getElementById("endDate").value=(end_Date.getMonth()+1)+"/"+end_Date.getDate()+"/"+end_Date.getFullYear();
		regressionOptimization.end_date=end_Date;
		regressionOptimization.noOfDays = (regressionOptimization.end_date-regressionOptimization.st_date)/(1000*60*60*24)+1;
		console.log("---no_of_resources----"+regressionOptimization.capacityPlanning["no_of_resources"])
		console.log("---env_setup_days----"+regressionOptimization.capacityPlanning["env_setup_days"])
		console.log("---testcase_exec_rate_per_each_person----"+regressionOptimization.capacityPlanning["testcase_exec_rate_per_each_person"])
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
	$('span#regressionUnqTCs').text(regressionOptimization.tcList.length)
	var maxTestExecutions = parseInt(regressionOptimization.tcList.length)*parseInt(regressionOptimization.totalEnvCount)
	$('span#maxTestExecs').text(maxTestExecutions)
	$('span#UnqTestExecs').text(regressionOptimization.uniqList.length)
	console.log("Unique Regression Testcases -- "+regressionOptimization.tcList.length)
	console.log("Unique TestExecutions -- "+regressionOptimization.uniqList.length)
	console.log("maxTestExecutions -- "+maxTestExecutions)
	regressionOptimization.displayCalculations();
	ISEUtils.portletUnblocking("pageContainer");
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
				if(data)
					$("#page_regressionOptimization #addTestBedsModel #configs").empty();
				regressionOptimization.configData1 = data.configs;
                $.each(data.configs, function(key, item) {
				regressionOptimization.addConfigs(key, item);
				//addBucket(key,item.length);
				
				});
});



},
addConfigs: function(configName, configData) {
 
$('#div_'+configName).empty();
var config = {
	//prtltCol : $("<div>", {class: "col-md-4"}),
   // prtltConatiner : $("<div>", {class: "portlet green-meadow box",id:"div_"+configName}),
	//prtltTitle : $("<div>", {class: "portlet-title"}),
	//prtltCaption : $("<div>", {class: "caption", text:configName}),
	//prtltBody : $("<div>", {class: "portlet-body"}),
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
	//config.tbl.appendTo(config.prtltBody);
	//config.prtltTitle.appendTo(config.prtltConatiner);
	//config.prtltCaption.appendTo(config.prtltTitle);
	//config.prtltBody.appendTo(config.prtltConatiner);
	//config.prtltConatiner.appendTo(config.prtltCol);
	//$("#page_regressionOptimization #addTestBedsModel #configs").empty();
	config.tbl.appendTo("#page_regressionOptimization #addTestBedsModel #configs");
	//debugger;
	TableManaged.init(configName);
	//regressionOptimization.ShowConfig();
	$('#configDiv').hide();
	//regressionOptimization._handleUniform();
},

getBucketName:function(name) {
if(name == "ST")
	name = "Sanity Testcases(ST)";
else if(name == "GT")
	name = "Golden Testcases(GT)";
else if(name == "UST")
	name = "Unstable Testcases(UST)";
else if(name == "BT")
	name = "Bug Testcases(BT)";
else if(name == "NT")
	name = "New Testcases(NT)";
else if(name == "CT")
	name = "ChangeBased Testcases(CT)";
else if(name == "HFT")
	name = "HighFeature Testcases(HFT)";
else if(name == "LFT")
	name = "LowFeature Testcases(LFT)";
else if(name == "ET")
	name = "Environment Testcases(ET)";

return name;
},

addBucket:function(bucketName, total, isOptimize) {
	var min_val=0,pref=0;
	if(!isOptimize) {	
		if(total > 0) {
			min_val=parseInt(total*30/100);
			pref=min_val*3;
		}
	}
	var bName = regressionOptimization.getBucketName(bucketName);
	var bucket = {
		prtltCol : $("<div>", {class: "col-md-3"}),
		prtltConatiner : $("<div>", {class: "portlet light testcases-bucket-container"}),
		prtltTitle : $("<div>", {class: "portlet-title"}),
		prtltCaption : $("<div>", {class: "caption", text:bName}),
		//prtltIcon : $("<i>", {class: "fa fa-gift"}),
		prtltTools : $("<div>", {class: "tools"}),
		//prtltCollapse : $("<a>", {class: "fa fa-info-circle", href:"javascript:;"}),
		prtltBody : $("<div>", {class: "portlet-body"}),
		
		prtltTotal : $("<div>", {class: "pricing-head margin-bottom-5"}),
		prtltTotalH : $("<span>", {class: "bold", text:total}),
		prtltTotalH1 : $("<span>", { class: "margin-left-10", text: "Testcase(s)"}),
		prtltPopup : $("<a>", {"data-toggle":"modal", onclick:"javascript:regressionOptimization.renderTC('"+bucketName+"',"+isOptimize+");", href:"#large"}),
		prtltTable : $("<div>", {class: "row static-info"}),
		prtltPreN : $("<div>", {class: "col-md-7 name margin-bottom-5", title:"Preferred Test Executions",text:"Preferred"}),
		prtltPreV : $("<div>", {class: "col-md-5 value margin-bottom-5", text:pref, id:"Pref_"+bucketName}),
		prtltMinN : $("<div>", {class: "col-md-7 name margin-bottom-5", text:"Min"}),
		prtltMinV : $("<input>", {class: "col-md-2 value margin-bottom-5", style:" padding-left: 3px;padding-right: 0px; margin-left: 10px;",type:"number",  min:"0",  value:min_val, id:"Min_"+bucketName}),
		prtltWeiN : $("<div>", {class: "col-md-5 name margin-bottom-5", text:"Weightage"}),
		prtltWeiV : $("<span>", {class: "col-md-2 wt-val margin-bottom-5",id:"Wt_val_"+bucketName, text:"0"}),
		prtltWeiSC : $("<div>", {class: "col-md-5 value margin-bottom-5", id:"Wt_"+bucketName}),
		prtltWeiV1 : $("<div>", {class: "noUi-control noUi-success wt_ctrl"}),

		//prtltMinEd : $("<a>", {"data-toggle":"modal", onclick:"javascript:regressionOptimization.editSettings('"+bucketName+"','Min_');", href:"#small"}),
		//prtltMinEdI : $("<i>", {class:"fa fa-pencil"}),
		//prtltWeiEd : $("<a>", {"data-toggle":"modal", onclick:"javascript:regressionOptimization.editSettings('"+bucketName+"','Wt_');", href:"#small"}),
		//prtltWeiEdI : $("<i>", {class:"fa fa-pencil"}),
		prtltFooter : $("<div>", {class: "row pricing-footer"}),
		prtltRadList : $("<div>", {class: "col-md-12 radio-list", id:"SptRpt_"+bucketName}),
		prtltLabRep : $("<label>", {class: "col-md-5 radio-inline",text:"Repeat"}),
		prtltLabSpl : $("<label>", {class: "col-md-5 radio-inline",text:"Split"}),
		prtltRadRep : $("<input>", {type:"radio", name:bucketName,style:"margin-left:7px", value:"Repeat", checked:"true"}),
		prtltRadSpl : $("<input>", {type:"radio", name:bucketName, style:"margin-left:4px", value:"Split",text:"Split" }),
	};

	bucket.prtltTitle.appendTo(bucket.prtltConatiner);
	bucket.prtltCaption.appendTo(bucket.prtltTitle);
	//bucket.prtltIcon.appendTo(bucket.prtltCaption);
	bucket.prtltTools.appendTo(bucket.prtltTitle);
	//bucket.prtltCollapse.appendTo(bucket.prtltTools);

	//bucket.prtltTotalH.appendTo(bucket.prtltTotal);
	//bucket.prtltPopup.appendTo(bucket.prtltTotal);
	//bucket.prtltTotal.appendTo(bucket.prtltBody);
	bucket.prtltPopup.appendTo(bucket.prtltTotal);
	bucket.prtltTotalH.appendTo(bucket.prtltPopup);
	bucket.prtltTotal.appendTo(bucket.prtltBody);
	bucket.prtltTotalH1.appendTo(bucket.prtltTotal);
	
	if(!isOptimize) {
		bucket.prtltPreN.appendTo(bucket.prtltTable);
		bucket.prtltPreV.appendTo(bucket.prtltTable);
		
		bucket.prtltMinN.appendTo(bucket.prtltTable);		
		bucket.prtltMinV.appendTo(bucket.prtltTable);		
		//bucket.prtltMinEdI.appendTo(bucket.prtltMinEd);
		//bucket.prtltMinEd.appendTo(bucket.prtltMinN);
		// bucket.prtltMinEd.appendTo(bucket.prtltMinV);
		//bucket.prtltMinV.appendTo(bucket.prtltTable);
		
		bucket.prtltWeiN.appendTo(bucket.prtltTable);
		bucket.prtltWeiV.appendTo(bucket.prtltTable);
		bucket.prtltWeiSC.appendTo(bucket.prtltTable);		
		bucket.prtltWeiV1.appendTo(bucket.prtltWeiSC);		
		//bucket.prtltWeiEdI.appendTo(bucket.prtltWeiEd);
		//bucket.prtltWeiEd.appendTo(bucket.prtltWeiN);		
		// bucket.prtltWeiEd.appendTo(bucket.prtltWeiV);
		//bucket.prtltWeiV.appendTo(bucket.prtltTable);

		bucket.prtltTable.appendTo(bucket.prtltBody);

		bucket.prtltRadRep.appendTo(bucket.prtltLabRep);
		bucket.prtltRadSpl.appendTo(bucket.prtltLabSpl);
		bucket.prtltLabRep.prependTo(bucket.prtltRadList);
		bucket.prtltLabSpl.prependTo(bucket.prtltRadList);
		bucket.prtltRadList.appendTo(bucket.prtltFooter);
		bucket.prtltFooter.appendTo(bucket.prtltBody);
	}
	
	bucket.prtltBody.appendTo(bucket.prtltConatiner);
	bucket.prtltConatiner.appendTo(bucket.prtltCol);
	if(!isOptimize) {
		bucket.prtltCol.appendTo("#buckets");
		$('#Min_'+bucketName).text(regressionOptimization.settings[bucketName+"Min"])
		$('#Pref_'+bucketName).text(regressionOptimization.settings[bucketName+"Pref"])
		//$('#Wt_'+bucketName).text(regressionOptimization.settings[bucketName+"Wt"])
		var ___id="#Wt_"+bucketName+" .wt_ctrl";
		$(___id).val(regressionOptimization.settings[bucketName+"Wt"]);	
		if(total <= 0) {
			regressionOptimization.minBuckets=[]
			regressionOptimization.minBuckets.push(bucketName);
			regressionOptimization.isPrefferdValZero=true;
			
		}		
		
	}else {
		bucket.prtltCol.appendTo("#opt_buckets");
		if($('#Pref_'+bucketName).text() == 0){
			if(regressionOptimization.isPrefferdValZero && regressionOptimization.minBuckets.indexOf != -1){
				$('#Min_'+bucketName).text(0);
				//$('#Wt_'+bucketName).text(0);	
				var ___id="#Wt_"+bucketName+" .wt_ctrl";
				$(___id).val(0);	
			}else{
				$('#Min_'+bucketName).text(regressionOptimization.settings[bucketName+"Min"])
				$('#Pref_'+bucketName).text(regressionOptimization.settings[bucketName+"Pref"])
				//$('#Wt_'+bucketName).text(regressionOptimization.settings[bucketName+"Wt"])
				var ___id="#Wt_"+bucketName+" .wt_ctrl";
				$(___id).val(regressionOptimization.settings[bucketName+"Wt"]);
			}
		}
		
		var checkVal = $("input[type='radio'][name='"+bucketName+"']:checked").val();
		console.log("checkVal - "+checkVal)
		if(checkVal =='Repeat' && regressionOptimization.settings[bucketName+"isRpt"]){
			$("input[name='"+bucketName+"'][value=Repeat]").prop('checked', true);
		}else{
			$("input[name='"+bucketName+"'][value=Split]").prop('checked', true);
		}
		
		
		}
		var ___id="#Wt_"+bucketName+" .wt_ctrl";
		var isnoUiSlider = $(___id).hasClass("noUi-connect");
		if (!isnoUiSlider) {
			regressionOptimization.initUiSlider(bucketName);
		}	
		
	//}
},

addTestBeds:function(testBeds) {
	$('#testbed').empty();
	console.log("---testbed creation ---")
	var testbed = {
	prtltCol : $("<div>", {class: "col-md-12"}),
    prtltConatiner : $("<div>", {class: "portlet light teast-beds-conatiner"}),
	prtltAction : $("<div>", {class: "actions"}),
	prtltActionIcon : $("<i>", {class: "fa fa-plus"}),
	prtltActionCall : $("<button>", {class: "btn blue", id:"addTestBeds", onclick:"javascript:regressionOptimization.ShowConfig();", text:" ADD TESTBEDS"}),
	prtltActionIcon1 : $("<i>", {class: "fa fa-remove"}),
	prtltActionCall1 : $("<button>", {class: "btn blue", id:"removeTestBeds", onclick:"javascript:regressionOptimization.clearTestBeds();", text:" CLEAR TESTBEDS"}),
    prtltTitle : $("<div>", {class: "portlet-title"}),
	//prtltCaption : $("<div>", {class: "caption", text:"Testbed distribution"}),
	//prtltIcon : $("<i>", {class: "fa fa-gift"}),
	 
	prtltBody : $("<div>", {class: "portlet-body"}),
	
	//prtltConfigDiv : $("<div>", {id: "configDiv"}),
	//prtltConfig : $("<div>", {id: "configs"}),
	//prtltConfigSubmit : $("<input>", {class:"btn blue-hoki", id: "configs",type:"button",value:"Generate //Testbeds",onclick:"javascript:regressionOptimization.generateTestBeds();"}),
	//prtltConfigClear : $("<input>", {class:"btn blue-hoki pull-left", id: "clsconfigs",type:"button",value:"Clear Testbeds",onclick:"javascript:regressionOptimization.clearTestBeds();"}),
	//prtltConfigNext : $("<input>", {class:"btn blue-hoki pull-right",type:"button",value:"Next",onclick:"javascript:regressionOptimization.onButtonChangeTab('testSettingsTab');"}),
	
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
	//testbed.prtltCaption.appendTo(testbed.prtltTitle);
	//testbed.prtltIcon.appendTo(testbed.prtltCaption);
	
	testbed.prtltAction.appendTo(testbed.prtltTitle);
	testbed.prtltActionCall.appendTo(testbed.prtltAction);
	testbed.prtltActionCall1.appendTo(testbed.prtltAction);
	testbed.prtltActionIcon.prependTo(testbed.prtltActionCall);
	testbed.prtltActionIcon1.prependTo(testbed.prtltActionCall1);
	 
	
	
	var tbb=0;
	regressionOptimization.testBedKeys=[];
	for(var i=0;i<testBeds.length;i++) {
		//excluding environment have "_" by Jwise
		//if(testBeds[i].env_name.indexOf("_") == -1){
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
		//}
	}	
	testbed.tblBody.appendTo(testbed.tbl);
	
	 
	
	testbed.tbl.appendTo(testbed.prtltBody);
	testbed.prtltBody.appendTo(testbed.prtltConatiner);
	testbed.prtltConatiner.appendTo(testbed.prtltCol);
 
	 
	testbed.prtltCol.appendTo("#testbed");
	TableManaged.init("testbeds");
	//regressionOptimization._handleUniform();
},
renderTC : function(tcType,isOptimize) {
$('#tblTCList').empty();
title_text = regressionOptimization.getBucketName(tcType);
$('#large .modal-header .modal-title').text(title_text)
var config = {
	tbl : $("<table>", {class: "table table-striped table-bordered table-hover", id:"tcs"}),	
	tblTHd : $("<thead>"),	
	tblTRh : $("<tr>"),	
	tblTHTC : $("<th>", {text:"Testcase"}),	
	tblTHTitle : $("<th>", {text:"Title"}),	
	tblTHEnv : $("<th>", {text:"Env"}),	
	tblBody : $("<tbody>"),
	};
	config.tblTHTC.appendTo(config.tblTRh);
	config.tblTHTitle.appendTo(config.tblTRh);
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
					tblTDTitle : $("<td>",{text:itemTC.title}),	
					tblTDEnv : $("<td>",{text:"NA"}),		
					}
					row.tblTDTC.appendTo(row.tblTR);
					row.tblTDTitle.appendTo(row.tblTR);
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
					tblTDTitle : $("<td>",{text:itemTC.title}),
					tblTDEnv : $("<td>",{text:itemTC.testbed}),		
					}
					row.tblTDTC.appendTo(row.tblTR);
					row.tblTDTitle.appendTo(row.tblTR);
					row.tblTDEnv.appendTo(row.tblTR);
					row.tblTR.appendTo(config.tblBody);
				});
			}
		});
	}
	config.tblBody.appendTo(config.tbl);
	config.tbl.appendTo("#tblTCList");
	TableManaged.init("tcs");
	//regressionOptimization._handleUniform();
},
	clearTestBeds:function(){
		var param=[]			
		var fileName = "del_testbeds_qry";	
		var fromCache="false"			
		var data = "{fileName:'"+fileName+"',params:'"+param+"',projectName:'"+localStorage.getItem('projectName')+"',fromCache:'"+fromCache+"'}";	
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,regressionOptimization.callBackClearTestbeds);
	},
	callBackClearTestbeds:function(data){	
		regressionOptimization.cleargenerateTestBeds()
	
	},
	ShowConfig:function() {
	/* if($('#configDiv').is(":visible"))
		$('#configDiv').hide();
	else
		$('#configDiv').show(); */
	$("#page_regressionOptimization #addTestBedsModel").modal('show');
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
			allWt = allWt + (len*parseInt($('#Wt_val_'+keyBTC).text()))
		});
		
		var envSelected = 0;
		var oTable = $('#testbeds').dataTable();
		var ckdData = $('input[type=checkbox]:checked', oTable.fnGetNodes() );
		envSelected = ckdData.length;
		
		$('span#selectedTestBeds').text(envSelected);
		$('span#posbleTestExecs').text(parseInt($('#regressionUnqTCs').text())*envSelected);
		if($('#maxNoOfTestCases').val() > parseInt($('#posbleTestExecs').text())) {
			$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
				var len=0;
				if(itemBTC && null!=itemBTC)
					len=itemBTC.length;				
				var prefValue = parseInt(($('#Wt_val_'+keyBTC).text()*len)/allWt*parseInt($('#posbleTestExecs').text())).toFixed(2); 
				isNaN(prefValue) ? $('#Pref_'+keyBTC).text(0) : $('#Pref_'+keyBTC).text(prefValue)
			});
			$('#displayMessage').text("Bandwidth configured more than possible executions, so results would come less...!");
		}
		else {
			$.each(regressionOptimization.recSet.buckets, function(keyBTC, itemBTC) {
				var len=0;
				if(itemBTC && null!=itemBTC)
					len=itemBTC.length;
					
					var minval = parseInt($('#Min_'+keyBTC).text());
					//console.log("minval-1338 - "+minval)
					if(parseInt(minval)>len)						
					//alert("min value "+minval+"  must not be greater than "+len+" size of "+keyBTC) 
				$('#Pref_'+keyBTC).text(parseInt(($('#Wt_val_'+keyBTC).text()*len)/allWt*$('#maxNoOfTestCases').val()));
			});
			$('#displayMessage').text("");
		}
	},
	
	showDistribution: function(obj) {
		var oTable = $('#testbeds').dataTable();
		var ckdData = $('input[type=checkbox]:checked', oTable.fnGetNodes() );
		
		if(obj){		
		var $row = $(obj).closest('tr');
		var aData = oTable.fnGetData($row);
		var sel_id = $(aData[2]).attr('id')
        if(obj.checked)
           $('#'+sel_id).attr('disabled', true);
         else
			$('#'+sel_id).attr('disabled', true).val(0);
		 $('#testbeds > thead > tr > th.table-checkbox.sorting_disabled > input').attr('checked', false);
	    }
		if(ckdData.length>0){
		var distribution = parseInt(100/ckdData.length);
		var reminder = 100-(distribution*ckdData.length);
		for(var z=0;z<ckdData.length;z++) {
			ckdData[z].parentElement.parentElement.childNodes[2].childNodes[0].value = distribution;
			if(z == (ckdData.length-1))
				ckdData[z].parentElement.parentElement.childNodes[2].childNodes[0].value = distribution+reminder;
		}
		regressionOptimization.displayCalculations();
		}
    },

	
	cleargenerateTestBeds:function() {
		$("#page_regressionOptimization #addTestBedsModel").modal('hide');
		var configs = {};
		$.each(regressionOptimization.configData1, function(key, item) {
			var vals = new Array();
			$('#'+key+' input[type=checkbox]:checked').each(function () {
				if("on" != this.value)
				vals.push(this.value);
			});
			if(vals.length>0)
			configs[key] = vals;
		});
		console.log("testbeds -- "+JSON.stringify(configs));	
		var envData = '{"requesttype":"generateEnvs","environment": '+JSON.stringify(configs)+'}';
		ISE_Ajax_Service.ajaxPostReq('RegressionOptimizationRestFulService', 'json', localStorage.authtoken,envData,regressionOptimization.callBackEnvList);	
				 

	},
	
	generateTestBeds:function() {
		$("#page_regressionOptimization #addTestBedsModel").modal('hide');
		var configs = {};
		$.each(regressionOptimization.configData1, function(key, item) {
			var vals = new Array();
			$('#'+key+' input[type=checkbox]:checked').each(function () {
				if("on" != this.value)
				vals.push(this.value);
			});
			if(vals.length>0)
			configs[key] = vals;
		});
		if (Object.keys(configs).length >1){
		console.log("testbeds -- "+JSON.stringify(configs));	
		var envData = '{"requesttype":"generateEnvs","environment": '+JSON.stringify(configs)+'}';
		ISE_Ajax_Service.ajaxPostReq('RegressionOptimizationRestFulService', 'json', localStorage.authtoken,envData,regressionOptimization.callBackEnvList);
		}
			else{
				alert("Please select any two combination of OS or Browser or Market.");
				return false;
			}
	},
	//SURESH
	callBackEnvList:function(data){
		console.log("--------1206------------")
		console.log("env data---"+JSON.stringify(data))
		//regressionOptimization.getAllFeatureHelper()		
		regressionOptimization.addTestBeds(data)
		regressionOptimization.loadTestbedConfig(data)
		
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
	
	loadTestbedConfig:function(data){
		 regressionOptimization.readConfig();
		 regressionOptimization.totalEnvCount=0;
		if(null != data && data.length>0){
			regressionOptimization.totalEnvCount = data.length;
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
		var selectedTabName = $("#tabUL").find('.active a').prop("href").split("#")[1]
		switch(selectedTabName) {
		case 'recomondationsTab':
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
			break;
		case 'optimizationsTab':
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
			break;
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
	
	/* onSelectStartDate: function(){					
			regressionOptimization.st_date = $('#startDate').datepicker('getDate');
			if(regressionOptimization.st_date>regressionOptimization.end_date){
				alert("Regression Start Date should not Greater than End Date")
				$('#st_date').val("");
			}else{
				//console.log("---st_date***** "+st_date+"---end_date****** "+end_date)
				regressionOptimization.noOfDays = (regressionOptimization.end_date-regressionOptimization.st_date)/(1000*60*60*24)+1;
				regressionOptimization.noOfDays = Math.round(regressionOptimization.noOfDays)
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
					regressionOptimization.noOfDays = Math.round(regressionOptimization.noOfDays)
					regressionOptimization.calMaxNoOfTestExecutions();
				}
			}, */
	
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
		regressionOptimization.noOfDays = Math.round(regressionOptimization.noOfDays);
		
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
		var max_no_testcases=0 ;
		regressionOptimization.noOfDays = Math.round(regressionOptimization.noOfDays);
		if($("#include_weekdays").is(':checked')){	
			//console.log("st_date - "+st_date+" : end_date -"+end_date+" : noOfDays- "+noOfDays +" include weekends");
			regressionOptimization.noOfDays = Math.round(regressionOptimization.noOfDays);
			max_no_testcases = (regressionOptimization.noOfDays-parseInt(env_setup_days))*parseInt(testcase_exec_rate_per_each_person)*parseInt(no_of_resources);
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
			max_no_testcases = (days-env_setup_days)*testcase_exec_rate_per_each_person*no_of_resources;
			max_no_testcases = Math.round(max_no_testcases);
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
	onNextButtonClick: function(){
			if( regressionOptimization.nextTabCount < regressionOptimization.mainTabsArray.length-1){
				regressionOptimization.nextTabCount=regressionOptimization.nextTabCount + 1;
				regressionOptimization.onButtonChangeTab(regressionOptimization.mainTabsArray[regressionOptimization.nextTabCount]);
			}
	},
	onButtonChangeTab:function(nextTab){
		
		if(nextTab == 'inputsSettingsTab'){
			$("#page_regressionOptimization #fetchTestCases").show();
		}else if(nextTab == 'recomondationsTab'){
			if($('#page_regressionOptimization .ro-next-btn').hasClass('disabled'))
				$('#page_regressionOptimization .ro-next-btn').removeClass('disabled');	
			$("#page_regressionOptimization .tabbable-line .ro-export-btn").show();
			$('#tabUL a[href="#recomondationsTab"]').trigger('click');
			$("#page_regressionOptimization #fetchTestCases").hide();
		}else if(nextTab == 'testBedsTab'){
			if($('#page_regressionOptimization .ro-next-btn').hasClass('disabled'))
				$('#page_regressionOptimization .ro-next-btn').removeClass('disabled');
			$("#page_regressionOptimization .tabbable-line .ro-export-btn").hide();			
			$('#tabUL a[href="#testBedsTab"]').trigger('click');
			$("#page_regressionOptimization #fetchTestCases").hide();	
		}else if(nextTab == 'testSettingsTab'){
			if($('#page_regressionOptimization .ro-next-btn').hasClass('disabled'))
				$('#page_regressionOptimization .ro-next-btn').removeClass('disabled');	
			$("#page_regressionOptimization .tabbable-line .ro-export-btn").hide();
			$('#tabUL a[href="#testSettingsTab"]').trigger('click');
			$("#page_regressionOptimization #fetchTestCases").hide();
			regressionOptimization.setDefaultValues();
		}else if(nextTab == 'optimizationsTab'){
			$('#page_regressionOptimization .ro-next-btn').addClass('disabled');
			$("#page_regressionOptimization .tabbable-line .ro-export-btn").show();
			$('#tabUL a[href="#optimizationsTab"]').trigger('click');
			$("#page_regressionOptimization #fetchTestCases").hide();
		}	 
	},
	tabChangeEvent:function(currentTab){
		if(currentTab == 'inputsSettingsTab'){
			regressionOptimization.nextTabCount = 0;
			if($('#page_regressionOptimization .ro-next-btn').hasClass('disabled'))
				$('#page_regressionOptimization .ro-next-btn').removeClass('disabled');	
			$("#page_regressionOptimization .tabbable-line .ro-export-btn").hide();
			$("#page_regressionOptimization #fetchTestCases").show();
		}else if(currentTab == 'testBedsTab'){
			regressionOptimization.nextTabCount = 2;
			if($('#page_regressionOptimization .ro-next-btn').hasClass('disabled'))
				$('#page_regressionOptimization .ro-next-btn').removeClass('disabled');	
			$("#page_regressionOptimization .tabbable-line .ro-export-btn").hide();
			$("#page_regressionOptimization #fetchTestCases").hide();
		}else if(currentTab == 'recomondationsTab'){
			regressionOptimization.nextTabCount = 1;
			if($('#page_regressionOptimization .ro-next-btn').hasClass('disabled'))
				$('#page_regressionOptimization .ro-next-btn').removeClass('disabled');	
			$("#page_regressionOptimization .tabbable-line .ro-export-btn").show();
			$("#page_regressionOptimization #fetchTestCases").hide();
		}else if(currentTab == 'testSettingsTab'){
			regressionOptimization.nextTabCount = 3;
			if($('#page_regressionOptimization .ro-next-btn').hasClass('disabled'))
				$('#page_regressionOptimization .ro-next-btn').removeClass('disabled');	
			$("#page_regressionOptimization .tabbable-line .ro-export-btn").hide();
			$("#page_regressionOptimization #fetchTestCases").hide();
			regressionOptimization.setDefaultValues();
		}else if(currentTab == 'optimizationsTab'){
			$('#page_regressionOptimization .ro-next-btn').addClass('disabled');
			$("#page_regressionOptimization .tabbable-line .ro-export-btn").show();
			$("#page_regressionOptimization #fetchTestCases").hide();
			regressionOptimization.nextTabCount = 4;
		}
	},
	setDefaultValues:function(){	
	
		var stDate = new Date();		
		//console.log("stdate ******** 1876--"+(stDate.getMonth()+1)+"/"+stDate.getDate()+"/"+stDate.getFullYear());		
		if(null == document.getElementById("startDate").value || document.getElementById("startDate").value =="")
		document.getElementById("startDate").value=(stDate.getMonth()+1)+"/"+stDate.getDate()+"/"+stDate.getFullYear();
		regressionOptimization.st_date=stDate;
		console.log("st_date ******** 1879--"+regressionOptimization.st_date)		
		var end_Date = new Date();						
		end_Date.setDate(end_Date.getDate() + 5);		
		if(null == document.getElementById("endDate").value || document.getElementById("endDate").value =="");
		document.getElementById("endDate").value=(end_Date.getMonth()+1)+"/"+(end_Date.getDate())+"/"+end_Date.getFullYear();				
		regressionOptimization.end_date=end_Date;
		console.log("end_date ******** 1880--"+regressionOptimization.end_date);	
		regressionOptimization.noOfDays = (regressionOptimization.end_date-regressionOptimization.st_date)/(1000*60*60*24)+1;
	},
	 defectSearchFunc: function(){
		$( "#defsearch_div" ).show( );		
		var defectId = escape($('#regsearchDefID').val().trim());
		ISEUtils.portletBlocking("pageContainer");
		var requestObject = new Object();
		requestObject.collectionName = "defect_collection"
		requestObject.title = defectId;
		requestObject.searchString = "_id:" + defectId
		requestObject.projectName = localStorage.getItem('projectName');
		requestObject.maxResults = regressionOptimization.maxResults;
		requestObject.serachType = "conextsearch"; 
		ISE.getSearchResults(requestObject, regressionOptimization._receivedTitleDesDetailsByID);

	},
	_receivedTitleDesDetailsByID : function(data){
	
		console.log(data)
		ISEUtils.portletUnblocking("pageContainer");
		var requestObject = new Object();

		requestObject.title = data[0].title;
		requestObject.searchString = data[0].description
		requestObject.projectName = localStorage.getItem('projectName');
		requestObject.maxResults = regressionOptimization.maxResults;
		requestObject.serachType = "conextsearch"; 
		requestObject.collectionName = "defect_collection";
		ISE.getSearchResults(requestObject, regressionOptimization._receivedSearchResults);
	},
	_receivedSearchResults: function(data){
		console.log(data);
		ISEUtils.portletUnblocking("pageContainer");
		regressionOptimization.displayDefectsResults(data,false);
	},	
	
	displayDefectsResults:function(defectsArray,isDefaultChecked){
			
		$('#defsearch_div').empty(); 	
		var rs="";		
		
		var b = true;
		rs += '<table  width="100%" border="0" cellspacing="1" cellpadding="1" class="table table-bordered table-hover" style="color: #333;"><tr  style=""><td style="border-bottom:1px #E8E8E8 solid;width:50px;">Select</td><td style="border-bottom:1px #E8E8E8 solid;width:70px;">Defect ID</td><td style="border-bottom:1px #E8E8E8 solid;width:70px;">Title</td></tr>';
		rs += '<button type="button" class="btn btn-sm blue select-defect-btn" onclick="regressionOptimization.getselectedDefects();">Add Defects</button>';	
		
		for(var i=0; i<defectsArray.length;i++){
			if(isDefaultChecked){
				if(b){						
					b = false;
				rs += '<tr style="background-color:white;"><td><input type="checkbox"  name="regOptDefectSrchCheckbox"  id="'+ defectsArray[i]._id +'" value="'+ defectsArray[i].title +'"></td><td>' + defectsArray[i]._id + '</td><td>' + defectsArray[i].title + '</td></tr>';
				} else{						
					b = true;
					rs += '<tr style="background-color:#F0F2F2;"><td><input type="checkbox"  name="regOptDefectSrchCheckbox"   id="'+ defectsArray[i]._id +'" value="'+ defectsArray[i].title +'"></td><td>' + defectsArray[i]._id+ '</td><td>' + defectsArray[i].title + '</td></tr>';
				}	
			}else{
				// if(null != defectsArry && defectsArry !=undefined){
									 
						if(b){						
							b = false;
						rs += '<tr style="background-color:white;"><td><input type="checkbox"  name="regOptDefectSrchCheckbox"   id="'+ defectsArray[i]._id +'" value="'+ defectsArray[i].title +'"></td><td>' + defectsArray[i]._id + '</td><td>' + defectsArray[i].title + '</td></tr>';
						} else{						
							b = true;
							rs += '<tr style="background-color:#F0F2F2;"><td><input type="checkbox" name="regOptDefectSrchCheckbox"   id="'+ defectsArray[i]._id +'" value="'+ defectsArray[i].title +'"></td><td>' + defectsArray[i]._id+ '</td><td>' + defectsArray[i].title + '</td></tr>';
						}
				//}
			}
			
		}						
													   
		$('#defsearch_div').append(rs + '</table>'); 			
		//regressionOptimization._handleUniform();
	
	},
	getselectedDefects : function(){
		
		regressionOptimization.selectedDefArry=[];
		$('input[name="regOptDefectSrchCheckbox"]:checked').each(function() {
		if(this.id != null & this.id !='undefined')
		var o ={};
		o.defect = this.id;
		o.title = this.value;
		regressionOptimization.selectedDefArry.push(o);
		});

		console.log(regressionOptimization.selectedDefArry);
		regressionOptimization.init();
		$( "#defsearch_div" ).hide( );
	},
	initUiSlider: function(bucket_Name){
		var __id = "#Wt_"+bucket_Name+" .wt_ctrl";
		console.log("bucket_Name :  "+__id);
		
		$(__id).noUiSlider({
			step: 1,
			start: 1,
			connect: "lower",
			range: {
				'min': 0,
				'max': 10
			},format: wNumb({
			decimals: 0
			})
        });
		 $(__id).Link('lower').to(($('#page_regressionOptimization .recommended-testcases-body-container .testcases-bucket-container'+' #Wt_val_'+bucket_Name)));
	},
	_filterInternal: function () {			
			var oTable = $('#page_regressionOptimization #feature_div .table').dataTable();			
			var currectSelectedTabel = oTable.DataTable();
			currectSelectedTabel.search(
				$('#page_regressionOptimization #featuresearchID').val(),
				false,
				true
			).draw();
	},
	clearTreeSelection: function(){
		$('#jstree').jstree("deselect_all");
		if(!$('#page_regressionOptimization .release-builds-container #applyBtn').hasClass('disabled')) 
			$('#page_regressionOptimization .release-builds-container #applyBtn').addClass('disabled');
		regressionOptimization.clear();
	},
	_handleUniform: function() {
		if (!$().uniform) {
			return;
		}
		var test = $("input[type=checkbox]:not(.toggle, .md-check, .md-radiobtn, .make-switch, .icheck), input[type=radio]:not(.toggle, .md-check, .md-radiobtn, .star, .make-switch, .icheck)");
		if (test.size() > 0) {
			test.each(function() {
				if ($(this).parents(".checker").size() === 0) {
					$(this).show();
					$(this).uniform();
				}
			});
		}
    },
	updateFeatureCount: function(){
		 
		   console.log($(this).parent().parent().attr('name'));
		   var high_count = 0;
		   var low_count = 0;
		   $('#feature_div > table > tbody > tr > td > input:checkbox[name=regOptFeatureCheckbox]:checked').each(function(e) {
				//var selectedRowTitle = tilte = $(this).attr("title");
				var selectedRowPriority  = $(this).parent().parent().find('.priority-row').find('input[type="radio"]:checked').val();
				if(selectedRowPriority=='HIGH')
					high_count++;
				else if(selectedRowPriority=='LOW')
					low_count++;
					
			});
			$('#page_regressionOptimization .high-data-conatiner .badge-default').text(high_count);	
			$('#page_regressionOptimization .low-data-conatiner .badge-default').text(low_count);
		 
	},
	//create plan pop up
	
	
	onLoadCreatePlan:function(){

            $.ajax({
            url: "createplan.html",
            type: 'HEAD',
            error: function() {
               console.log("Error")
            },
            success: function() {
                // Loading Menu based on Organization and role

                $('#createPlanList').load("createplan.html", function() {

					$.getScript("js/subpages/createplan.js")
						.done(function() {
							regressionOptimization.createplansRef = createplan;
							 
							createplan.init();
							
						})
						.fail(function() {
							console.log("Some problem in scripts")
						});
                                     

                    });
            }
        });

        },
		
		myCurrentPlan:function(){
			
			var id1= "RegressionPlan|"+regressionOptimization.currentPlan;
			if(	regressionOptimization.currentPlan != ""){
				document.getElementById(id1).checked=true;
			}
			regressionOptimization.displayplan(regressionOptimization.currentPlan);
		},
		
		displayplan:function(planName){
			//alert("display plan***"+planName);
			if(	planName == "" || planName == 'undefined' || planName == null){
				planName = "Create Plan";
			}
			
			var root = document.getElementById('dynamicplan');		
			root.innerHTML='<a class="btn pull-right" id="createPlan" data-toggle="modal" href="#largePlan" onclick="regressionOptimization.myCurrentPlan()" >'+planName+'</a>';
		},
		getCurrentPlan :function(){
			var regPlanJson = {"requesttype":"currentPlan","projectName":localStorage.getItem('projectName'),"username":localStorage.getItem('username')};
			try{
				var resp = ISE_Ajax_Service._genericServiceCall("saveRegressionOptimization",regPlanJson);
				//alert("3437=="+JSON.stringify(resp));
				//resp = JSON.parse(resp);
				if(null != resp){
					//alert("==3440=="+resp.plan_name);
					regressionOptimization.currentPlan= resp.plan_name;
					regressionOptimization.plan_recommandId = resp.recommendation_executionid;
					regressionOptimization.plan_optimizeID = resp.optimization_executionid;
				}
				
			}catch(err){} 
			regressionOptimization.displayplan(regressionOptimization.currentPlan);
		}
	
};

