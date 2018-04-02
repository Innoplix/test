 /**------------------------------------------------------------------------------
 * fileupload.js - Uploads, input data into MongoDB by Servlet Multi-part request.
 *
 * DEPENDENCIES
 ** websocket.js -> upload logger
 ** ISE_Ajax_Service.js -> invoke rest service
 ** jquery.fileupload.css -> select file 
 ** ise.css -> added style sheets
 *--------------------------------------------------------------------------------*/
  
 
 var fileupload = {
	maxprogress1:100,  // total to reach
	actualprogress1:0, // current value
	itv1:0,
	timeLeft:0,
	maxprogress:100,   // total to reach
    actualprogress:0,  // current value
    itv:0,  // id to setinterval
    typeFlag:false,
	collectionFlag:false,	
	testExecArry:[],
	codeElementsArry:[],
	defectsArry:[],
	dataTableLocalizationData:{},
	
	
	/* Init function  */
	init: function()
	{	
		Chat.initialize();
		fileupload.hide("pwidget");
		console.log("fileupload init()"); 
	//	fileupload.displayCollectionsCount(localStorage.getItem('projectName'));	
		fileupload.displayCollectionsCount();	
		fileupload.initLocalization();

	},	
	
	enableUploadButton :function(){ //enable upload button only after file selection
	    $(".error-msg").hide();
		$(".success-msg").hide();
		var uploadBtnId=document.getElementById("uploadBtnId");
		uploadBtnId.disabled = false;
	},
	
	fileUpload :function(){ //capture form input data
	    $(".error-msg").hide();
		$(".success-msg").hide();
		fileupload.show("pwidget");
		fileupload.actualprogress=0;
		//fileupload.initialize();
		fileupload.itv=0;
		
		var sampleFile = document.getElementById("file").files[0];
		console.log("sampleFile" + sampleFile);
			if(sampleFile == undefined ){
				alert("Please select file to upload");
				uploadBtnId.disabled =true;
				return false;
			}
		var ftype=$('#filetype').val();	
		if(ftype ==17 && collectionFlag==false){
			alert("Please select collection type to upload");
			return false;
		}
		
		console.log("==453==projectName=="+localStorage.getItem('projectName'));				
	
		var projctName = localStorage.getItem('projectName')
				
		document.getElementById('project_name').value = projctName		
		//fileupload.hide('table-rows-count');
		//fileupload.itv1 = setInterval(fileupload.fileUploadStatus, 100);
		//fileupload.showHideDiv('pwidget');
		//fileupload.showHideDiv('pwidget1');
		//console.log("=63="+fileupload.itv)
		fileupload.itv = setInterval(fileupload.uploadStatus, 100);		
		
        var dryRun = document.getElementById("dryrun").checked;
		var file = document.getElementById("file").files[0];
		var isDelta = document.getElementById("isdelta").checked;		
       
	   var formdata = new FormData();
	   
        formdata.append("filetype", ftype);
        formdata.append("file", sampleFile);
		formdata.append("dryrun", dryRun);
		formdata.append("isdelta", isDelta);
		formdata.append("project_name", projctName);
		fileupload.performAjaxSubmit(formdata);
	
	},	
	
	performAjaxSubmit :function(formdata) { //send form input data to servlet      
		//console.log("formdata == "+JSON.stringify(formdata));
        var xhr = new XMLHttpRequest();       

        xhr.open("POST","../DevTest/services/UploadServlet", true);

        xhr.send(formdata);

        xhr.onload = function(e) {

            if (this.status == 200) {

               console.log(this.responseText);

            }

        };                    

    },
		
	hide :function(obj) {
		var el = document.getElementById(obj);
		el.style.display = 'none';
	},
	
	show :function(obj) {
		var el = document.getElementById(obj);
		el.style.display = 'block';
	},

	showHideDiv :function(id){
		var obj = document.getElementById(id);
		if (obj.style.display=="none"){
		  obj.style.display='block';
		} else if(obj.style.display=="block"){
		  obj.style.display='none';
		}
	},
	
	chooseFileTypeFunc :function(){
		fileupload.disablingButton();
		var ftype=$('#filetype').val();	
		var isDelta = document.getElementById("delta");
		var isFile = document.getElementById("file");
		var clearDbBtnId = document.getElementById("clearDbBtnId");
		var modBtnId = document.getElementById("modBtnId");
		var uploadBtnId=document.getElementById("uploadBtnId");	
		var collectionNames=document.getElementById("collectionNamesList");	
		var dryrun = document.getElementById("dryrun");
		
		if(ftype == 17){
			$("#Collection").show();
			flag = true;
		}
		if(ftype==6){	
			isFile.disabled = "disabled";
			isDelta.disabled = "disabled";
			clearDbBtnId.disabled = "disabled";
			modBtnId.disabled = "disabled";
			dryrun.disabled = "disabled";
			uploadBtnId.innerHTML="Import";
		}else{
			isFile.disabled = false;
			//isDelta.disabled = false;
			//clearDbBtnId.disabled = false;
			modBtnId.disabled = false;
			//dryrun.disabled = false;
			uploadBtnId.innerHTML="Upload";
		}
		
	},
	
	disablingButton :function (){
		var uploadBtnId=document.getElementById("uploadBtnId");
		uploadBtnId.disabled =true;	
		//$("#Collection").hide();
	
	},
	
	invokeModel : function (){ //model's invocation 
		console.log("invokeModel");
		fileupload.hide("pwidget");
		//var selectedValue = $('#page_fileupload #modeltype').val()
		if($('#page_fileupload #modeltype').val()== "--Select Model--"){
			var errorContent = 'Please select model';
			fileupload._ShowErrorMsg(errorContent, true);
			
		}
		
		 if(($('#page_fileupload #modeltype :selected').text().trim())!= "--Select Model--"){
			var errorContent = ($('#page_fileupload #modeltype :selected').text().trim())+"   Started";
			errorContent=errorContent.split('.')
			errorContent=errorContent[1];
			fileupload._ShowErrorMsg(errorContent, false);
			var errEndContent= ($('#page_fileupload #modeltype :selected').text().trim())=="5. Mapping Model"?"5. Mapping Model initiated,,,,refer below logger to know the status of completion.":($('#page_fileupload #modeltype :selected').text().trim())+"   Ended";
			errEndContent=errEndContent.split('.')
			errEndContent=errEndContent[1];
			setTimeout(function(){ fileupload._ShowErrorMsg(errEndContent, false) }, 3000);

		} 
		var modeltype = document.getElementById("modeltype").value;
		
							/* <option value="12"><b>2. Defect Indexing Model</b></value>
							<option value="3"><b>3. TestCase Indexing Model</b></value>
							<option value="7"><b>4. KnowledgeBase Indexing Model</b></value>
							<option value="22"><b>9. Source Indexing Model</b></value>	
							<option value="50"><b>15. Defects Files Indexing Model</b></value>//NEED clarification
							<option value="52"><b>16. TestExecutions Indexing Model</b></value> */
			console.log("modeltype:"+ typeof(modeltype));
			console.log("CONDN : "+ (modeltype == '12' || modeltype == '3' || modeltype == '7' || modeltype == '22' || modeltype == '50' || modeltype == '52'));				
		if( modeltype == '12' || modeltype == '3' || modeltype == '7' || modeltype == '22' || modeltype == '50' || modeltype == '52'|| modeltype == '53'|| modeltype == '54'|| modeltype == '55'
		|| modeltype == '56'|| modeltype == '57'|| modeltype == '58'|| modeltype == '59'|| modeltype == '60' || modeltype == '66'|| modeltype == '67'|| modeltype == '68'
		|| modeltype == '91'|| modeltype == '92'|| modeltype == '93' || modeltype == '94' || modeltype == '95')
		{
			console.log("invokeModel");
			/* {\"username\":\"admin@hcl.com\", \"elasticearc
				hHost\":\"http://10.98.11.17:9200\", \"mongo_collection\":\"SalimIndexTest.kb_doc\"
				, \"es_collection\":\"kb_docs_collection\", \"projectName\":\"SalimIndexTest
				\"} */
			var projectName = localStorage.projectName;
			//console.log("projectName ==== in fileupload : "+projectName);
			var elasticSearchHost = iseConstants.elasticsearchHost;
			var mongo_collection = "";
			var es_collection = "";
			var fileServer = "http://localhost";
			
			switch( modeltype ){
			
				case '12' :			// Defect Indexing Model
					mongo_collection = projectName+".defects";
					es_collection = "defect_collection";
					break;
				
				case '3' :		// TestCase Indexing Model
					mongo_collection = projectName+".testcases";
					es_collection = "testcase_collection";
					break;
				
				case '7' :		// KnowledgeBase Indexing Model
					mongo_collection = projectName+".kb_docs";
					es_collection = "kb_docs_collection" ;
					break;
				
				case '22' :		// Source Indexing Model
					mongo_collection = projectName+".source" ;
					es_collection = "sourcecode_collection";
					break;
				
				case '50' :		// Defects Files Indexing Model
					mongo_collection = projectName+".defects_codeelements_mapping";
					es_collection = "defect_files_collection";
					break;
				
				case '52' :		// TestExecutions Indexing Model
					mongo_collection = projectName+".test_executions";
					es_collection = "test_executions_collection";
					break;
				case '53' :		// FeaturesMapping Indexing Model
					mongo_collection = projectName+"."+"features_mapping";
					es_collection = "features_mapping_collection";
					break;
				case '54' :		// Files Testcase Indexing Model
					mongo_collection = projectName+"."+"file_testcase_mapping";
					es_collection = "file_testcase_collection";
					break;
				case '55' :		// Codeelements Indexing Model
					mongo_collection = projectName+"."+"code_elements";
					es_collection = "codeelements_collection";
					break;
					
				case '56' :		// Builds Indexing Model
					mongo_collection = projectName+"."+"builds";
					es_collection = "builds_collection";
					break;
				case '57' :		// Testbeds Indexing Model
					mongo_collection = projectName+"."+"testbeds";
					es_collection = "testbeds_collection";
					break;
				case '58' :		// Regression plan Indexing Model
					mongo_collection = projectName+"."+"regression_plan";
					es_collection = "regressionplan_collection";
					break;
				case '59' :		// Regression Options Mapping Indexing Model
					mongo_collection = projectName+"."+"regressionplan_options_mapping";
					es_collection = "regopts_collection";
					break;
				case '60' :		// Regression Testcases Indexing Model
					mongo_collection = projectName+"."+"regression_testcase_results";
					es_collection = "regression_tc_collection";
					break;
				case '66' :		//  defects heatmap Indexing Model
				mongo_collection = projectName+"."+"defectsheatmap";
				es_collection = "defectsheatmap_collection";
				break;
				case '67' :		// defect feature heatmap Indexing Model
				mongo_collection = projectName+"."+"defectsfeaturesheatmap";
				es_collection = "defectsfeaturesheatmap_collection";
				break;
				case '68' :		// testcase heatmap Indexing Model
				mongo_collection = projectName+"."+"testcasefeaturesheatmap";
				es_collection = "testcasesheatmap_collection";
				break;
				
				case '91' :		// testcase heatmap Indexing Model
				mongo_collection = projectName+"."+"package_collection";
				es_collection = "package_collection";
				break;
				
				case '92' :		// testcase heatmap Indexing Model
				mongo_collection = projectName+"."+"assignation_collection";
				es_collection = "assignation_collection";
				break;
				
				case '93' :		// testcase heatmap Indexing Model
				mongo_collection = projectName+"."+"knowledge_history_collection";
				es_collection = "knowledge_history_collection";
				break;
				
				case '94' :		// testcase heatmap Indexing Model
				mongo_collection = projectName+"."+"forum_collection";
				es_collection = "forum_collection";
				break;
				
				case '95' :		// testcase heatmap Indexing Model
				mongo_collection = projectName+"."+"ikeforum_collection";
				es_collection = "ikeforum_collection";
				break;
				
			}	 
		
			var json_Data = { username : sessionStorage.getItem('username'), projectName : localStorage.projectName, elasticSearchHost : elasticSearchHost, mongo_collection : mongo_collection, es_collection : es_collection};
			var serviceName='JscriptWS';
			var methodname = "es_indexing";
			var hostUrl = '/DevTest/rest/';
			var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&sname='+methodname;
					
			$.ajax({
					type: "POST",
					url: Url,
					async: true,
					data: JSON.stringify(json_Data),
					success: function(msg) {
						if(es_collection=='defect_collection'){
							
							getAllReleaseVersions(localStorage.getItem('projectName'));
						
						}
						 //test=JSON.parse(msg);					
						 console.log("ES-INDEXING SUCCESS RESPONSE : "); 	
						  console.log(msg); 	
						 console.log(JSON.parse(msg)); 							 
					},
					error: function(msg) {
						 console.log("Failure in fileupload.invokeModel().");
					}			
			});

		
		}else{
				console.log("---modeltype-- "+modeltype)
				var isReindexing = "false";
				/* if(document.getElementById("isReindex").checked){
					
					isReindexing = document.getElementById("isReindex").value;
				} */
				
				if(modeltype == '51'){
					fileupload.defectlocalization();
				}else if(modeltype == '100'){
					fileupload.generateImportCollections();
				}
				else if(modeltype == '72'){
					fileupload.ragAlgorithm("RagService");
				}
				else if(modeltype == '61'){
					fileupload.generateAlgorithm("GoldenTc");
				}
				else if(modeltype == '62'){
					fileupload.generateAlgorithm("EnvTc");
				}
				else if(modeltype == '63'){
					fileupload.generateAlgorithm("stabilityDefects");
				}
				else if(modeltype == '64'){
					fileupload.generateAlgorithm("stabilityDefectsDetail");
				}
				else if(modeltype == '65'){
					fileupload.generateAlgorithm("stabiltyTestcases");
				}
				else if(modeltype == '69'){
					fileupload.generateAlgorithm("SVD");
				}
				else if(modeltype == '70'){
					
				}
				else if(modeltype == '71'){
					
				}
				else if(modeltype == '18'){
						var data = '{"requesttype":"model","modeltype": "'+modeltype+'","default":"all"}';
						ISE_Ajax_Service.ajaxPostReq('IndexingRestService', 'json', localStorage.authtoken,data,fileupload.callBackInvokeModel);
				}
					else{
						var data = '{"requesttype":"model","modeltype": "'+modeltype+'"}';
						ISE_Ajax_Service.ajaxPostReq('IndexingRestService', 'json', localStorage.authtoken,data,fileupload.callBackInvokeModel);
				}
				
					
				
		}
	},
	generateAlgorithm:function(type)
	{
		
		//requestObject.username = localStorage.getItem('username');
	var jsondata = {username:localStorage.getItem('username'),project:localStorage.getItem('projectName'),type:"mongo",operation:type}//{username:localStorage.getItem('username'),operation:'list'}
	 var serviceName='JscriptWS'; 
	var hostUrl = '/DevTest/rest/';
	var methodname = 'commandService'
	var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + 
	localStorage.projectName+'&sname='+methodname;
		var html;					
		$.ajax({
		type: "POST",
		url: Url,
		async: true,
		data: JSON.stringify(jsondata),
		success: function(msg) {
		console.log("Success");
		},
		error: function(msg) {
		console.log(error);
		}
		});
	
	},
	
	ragAlgorithm:function(type)
	{
		
		//requestObject.username = localStorage.getItem('username');
	var jsondata = {username:localStorage.getItem('username'),project:localStorage.getItem('projectName'),type:"mongo",operation:type}//{username:localStorage.getItem('username'),operation:'list'}
	 var serviceName='JscriptWS'; 
	var hostUrl = '/DevTest/rest/';
	var methodname = 'RagService'
	var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + 
	localStorage.projectName+'&sname='+methodname;
		var html;					
		$.ajax({
		type: "POST",
		url: Url,
		async: true,
		data: JSON.stringify(jsondata),
		success: function(msg) {
		console.log("Success");
		},
		error: function(msg) {
		console.log(error);
		}
		});
	
	},
	callBackInvokeModel : function(data){
		console.log("==179=="+JSON.stringify(data));
	},
	
	fileUploadStatus:function (){		
		if(fileupload.actualprogress1 >= fileupload.maxprogress1)   {
		clearInterval(fileupload.itv1); 
		//console.log("=151="+fileupload.itv)
		return; 
		}	 
		var progressnum1 = document.getElementById("progressnum1"); 
		var indicator1 = document.getElementById("indicator1");
		fileupload.actualprogress1 = fileupload.actualprogress1 + 10;
		//console.log("actualprogress1 : "+fileupload.actualprogress1)
		if(fileupload.actualprogress1 > fileupload.maxprogress1){
		indicator1.style.width= fileupload.maxprogress1 + "px";
		progressnum1.innerHTML = fileupload.maxprogress1 + "% completed .";
		}else{	
			indicator1.style.width= fileupload.actualprogress1 + "px";				
		 progressnum1.innerHTML = fileupload.actualprogress1 + "% completed .";				
		}

		//if(fileupload.actualprogress1 == fileupload.maxprogress1)  clearInterval(fileupload.itv1); 
	},
	
	initialize :function(){
		var progressnum = document.getElementById("progressnum"); 
		var indicator = document.getElementById("indicator");
		indicator.style.width =  "0px";
		progressnum.innerHTML = "0% completed ..Time left :"+fileupload.timeLeft  ;
		console.log("==180==initialize=="+fileupload.actualprogress + "px"+"======"+fileupload.actualprogress + "% completed ..Time left :"+fileupload.timeLeft );
	},
	
	uploadStatus :function() //show upload file progress indicator with time and percentage completed
	{
		//console.log("=189= uploadStatus is calling......")
		if(fileupload.actualprogress >= fileupload.maxprogress)   {
			fileupload.itv=0;
			clearInterval(fileupload.itv); 
			//console.log("=192="+fileupload.itv)
		return; 
		}	 
		var progressnum = document.getElementById("progressnum"); 
		var indicator = document.getElementById("indicator");		
		//console.log("actualprogress : "+fileupload.actualprogress+" == "+fileupload.timeLeft)
		if( ((fileupload.timeLeft+"").trim()== "0" || (fileupload.timeLeft+"").trim() == "0 Hr 0 Min 0 Sec") && (fileupload.actualprogress !=0)){
			fileupload.actualprogress=100;		
			//fileupload.displayCollectionsCount(localStorage.getItem('projectName'));	
			fileupload.displayCollectionsCount();	
		}
		indicator.style.width = fileupload.actualprogress + "px";
		// console.log(indicator.style.width);
		progressnum.innerHTML = fileupload.actualprogress + "% completed ..Time left :"+fileupload.timeLeft  ;
		//console.log("==205==uploadstatus=="+fileupload.actualprogress + "px"+"======"+fileupload.actualprogress + "% completed ..Time left :"+fileupload.timeLeft );
		if(fileupload.actualprogress == fileupload.maxprogress)  clearInterval(fileupload.itv); 
	},
	
	 displayCollectionsCount :function (){
			var projectName=localStorage.getItem('projectName');
		 	console.log("==================="+projectName)			
			var fileName = "get_all_upload_collections_count";
			var fromCache = "false";
			var data = '{"fileName":"'+fileName+'","params":"","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
			ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,fileupload.callBackFunctionDisplayCollection);
			
	},
		
	callBackFunctionDisplayCollection :function(collData){
		//console.log("145=collData--"+JSON.stringify(collData));
		var uploadCollCountArry = [];
		for(var up=0;up<collData.length;up++){				
			var file = collData[up].file;
			file = file.substring(file.indexOf('_')+1,file.length)
			var obj = new Object();
			obj.file = file;
			obj.collection_name = collData[up].collection_name;
			obj.start_time = collData[up].start_time;
			obj.end_time = collData[up].end_time;
			obj.file_type = collData[up].file_type;	
			obj.user = collData[up].user;				
			obj.total_no_of_rows = collData[up].total_no_of_rows;
			obj.no_of_rows = collData[up].no_of_rows;
			
			uploadCollCountArry.push(obj);
		}
		
		fileupload.constructUploadCollection(uploadCollCountArry,"table-rows-count")
	},
	
	constructUploadCollection :function (uploadCollCountArry,divId){		
		$('#'+divId).empty();	
		var rs="";			
		var b = true;
		
		if(undefined != uploadCollCountArry && uploadCollCountArry.length>0){
			rs += '<table  class="table table-striped table-bordered table-hover" width="100%" border="0" cellspacing="2" cellpadding="1" style="color: #333;table-layout: fixed;"><tr  style="background-color:#D4D8D9;height:25px"><td style="border-bottom:1px #E8E8E8 solid;padding:2px;width:20%;padding-left:3px;"><b data-localize="language.File">File</b></td><td style="border-bottom:1px #E8E8E8 solid;padding:2px;width:20%;padding-left:0px;"><b data-localize="language.Collection">Collection </b></td><td style="border-bottom:1px #E8E8E8 solid;padding:2px;width:19%;padding-left:0px;"><b data-localize="language.Start Time">Start Time</b></td><td style="border-bottom:1px #E8E8E8 solid;padding:2px;width:19%;padding-left:0px;"><b data-localize="language.End Time">End Time</b></td><td style="border-bottom:1px #E8E8E8 solid;padding:2px;width:7%;padding-left:3px;"><b data-localize="language.FileType">FileType</b></td><td style="border-bottom:1px #E8E8E8 solid;padding:2px;width:5%;padding-left:0px;"><b data-localize="language.Total Rows">Total Rows</b></td><td style="border-bottom:1px #E8E8E8 solid;padding:2px;width:5%;padding-left:0px;"><b data-localize="language.Inserted Rows">Inserted Rows</b></td></tr>';
		
			for(var i=0; i<uploadCollCountArry.length;i++){			
				if(b){						
					b = false;
					rs += '<tr style="background-color:white;height:25px" ><td style="padding-left:10px;word-break:break-all">' + uploadCollCountArry[i].file+'</td><td style="padding-left:0px;word-break:break-all">'+ uploadCollCountArry[i].collection_name+'</td><td style="padding-left:0px;word-break:break-all">'+ uploadCollCountArry[i].start_time+'</td><td style="padding-left:0px;word-break:break-all">'+ uploadCollCountArry[i].end_time+'</td><td style="padding-left:0px;word-break:break-all">'+ uploadCollCountArry[i].file_type+'</td><td style="padding-left:0px;word-break:break-all">'+ uploadCollCountArry[i].total_no_of_rows+'</td><td style="padding-left:0px;word-break:break-all">'+ uploadCollCountArry[i].no_of_rows+'</td></tr>';
				} else{						
					b = true;
					rs += '<tr style="background-color:#F0F2F2;height:25px"><td style="padding-left:10px;word-break:break-all">' + uploadCollCountArry[i].file+'</td><td style="padding-left:0px;word-break:break-all">'+ uploadCollCountArry[i].collection_name+'</td><td style="padding-left:0px;word-break:break-all">'+ uploadCollCountArry[i].start_time+'</td><td style="padding-left:0px;word-break:break-all">'+ uploadCollCountArry[i].end_time+'</td><td style="padding-left:0px;word-break:break-all">'+ uploadCollCountArry[i].file_type+'</td><td style="padding-left:0px;word-break:break-all">'+ uploadCollCountArry[i].total_no_of_rows+'</td><td style="padding-left:0px;word-break:break-all">'+ uploadCollCountArry[i].no_of_rows+'</td></tr>';
				}		
				
			}	
		}		
															   
		$('#'+divId).append(rs + '</table>'); 		
		fileupload.initLocalization();
		
			

			
	},	
	
	generateImportCollections :function (){
		fileupload.triggerUniqueIndexing();
	},
	
	triggerUniqueIndexing : function(){
		var fileName = "DB_Constraints";
		var fromCache = "false";
		var data = '{"fileName":"'+fileName+'","params":"","projectName":"'+localStorage.getItem('projectName')+'","fromCache":"'+fromCache+'"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,fileupload.callBackUnqDbConstraints);
			
	},
	
	callBackUnqDbConstraints : function(data){
		console.log("==308=="+JSON.stringify(data));
		fileupload.generateBuilds();
		fileupload.getEnvironments();
	},
	
	generateBuilds : function(){
		fileupload.testexecutionBuilds();
	},	
	
	testexecutionBuilds : function(){
		var fileName = "release_test_exec";
		var fromCache = "false";
		var data = '{"fileName":"'+fileName+'","params":"","projectName":"'+localStorage.getItem('projectName')+'","fromCache":"'+fromCache+'"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,fileupload.callBackTestexecutionBuilds);
			
	},
	
	callBackTestexecutionBuilds : function(data){
		fileupload.testExecArry=[];
		fileupload.testExecArry = data;
		var fileName = "release_code_elements";
		var fromCache = "false";
		var data1 = '{"fileName":"'+fileName+'","params":"","projectName":"'+localStorage.getItem('projectName')+'","fromCache":"'+fromCache+'"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data1,fileupload.callBackCodeElementsBuilds);
			
	},
	
	callBackCodeElementsBuilds : function(data){
		fileupload.codeElementsArry=[];
		fileupload.codeElementsArry = data;		
		var fileName = "release_defects";
		var fromCache = "false";
		var data = '{"fileName":"'+fileName+'","params":"","projectName":"'+localStorage.getItem('projectName')+'","fromCache":"'+fromCache+'"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,fileupload.callBackDefectsBuilds);
			
	},
	
	callBackDefectsBuilds : function(data){
		fileupload.defectsArry=[];
		fileupload.defectsArry = data;
		fileupload.generateBuildsExtn();
	},
	
	generateBuildsExtn : function (){	//generate builds collections
		console.log("getBuilds is calling......")
		// text executions builds
		//var testExecReleaseData = getDynamicDataByParams("release_test_exec", "", "mongoMapReduce", false);	
		var testExecReleaseData = fileupload.testExecArry;	
			//console.log("testExecReleaseData -- "+JSON.stringify(testExecReleaseData))
		//var codeElementReleaseData = getDynamicDataByParams("release_code_elements", "", "mongoMapReduce", false);
		var codeElementReleaseData = fileupload.codeElementsArry;
			//console.log("codeElementReleaseData -- "+JSON.stringify(codeElementReleaseData))	
		//var defectsReleaseData = getDynamicDataByParams("release_defects", "", "mongoMapReduce", false);
		var defectsReleaseData = fileupload.defectsArry;
			//console.log("defectsReleaseData -- "+JSON.stringify(defectsReleaseData))	
		
		var finalObj;
		
		// TEST_EXECUTIONS,CODEELEMENTS & DEFECTs 
		if((null != testExecReleaseData && undefined != testExecReleaseData  && testExecReleaseData.length>0) && (null != codeElementReleaseData && undefined != codeElementReleaseData  && codeElementReleaseData.length>0) && (null != defectsReleaseData && undefined != defectsReleaseData && defectsReleaseData.length>0)){
			console.log("TEST_EXECUTIONS,CODEELEMENTS & DEFECTs ********")
			var obj = testExecReleaseData.concat(codeElementReleaseData);
			finalObj = defectsReleaseData.concat(obj);
		}
		
		// TEST_EXECUTIONS & DEFECTS
		else if((null != testExecReleaseData && undefined != testExecReleaseData  && testExecReleaseData.length>0) && (null == codeElementReleaseData || undefined == codeElementReleaseData  || codeElementReleaseData.length<=0) && (null != defectsReleaseData && undefined != defectsReleaseData && defectsReleaseData.length>0)){
			console.log("TEST_EXECUTIONS & DEFECTS ********")
			finalObj = testExecReleaseData.concat(defectsReleaseData);
			
		}
		// CODEELEMENTS & DEFECTS
		else if((null == testExecReleaseData || undefined == testExecReleaseData  || testExecReleaseData.length<=0) && (null != codeElementReleaseData && undefined != codeElementReleaseData  && codeElementReleaseData.length>0) && (null != defectsReleaseData && undefined != defectsReleaseData && defectsReleaseData.length>0)){
			console.log("CODEELEMENTS & DEFECTS ********")
			finalObj = codeElementReleaseData.concat(defectsReleaseData);
			
		}
		// TEST_EXECUTIONS & CODEELEMENTS
		else if((null != testExecReleaseData && undefined != testExecReleaseData  && testExecReleaseData.length>0) && (null != codeElementReleaseData && undefined != codeElementReleaseData  && codeElementReleaseData.length>0) && (null == defectsReleaseData || undefined == defectsReleaseData || defectsReleaseData.length<=0)){
			console.log("TEST_EXECUTIONS & CODEELEMENTS ********")
			finalObj = testExecReleaseData.concat(codeElementReleaseData);
			
		}
		// DEFECTS
		else if((null == testExecReleaseData || undefined == testExecReleaseData  || testExecReleaseData.length<=0) && (null == codeElementReleaseData || undefined == codeElementReleaseData  || codeElementReleaseData.length<=0) && (null != defectsReleaseData && undefined != defectsReleaseData && defectsReleaseData.length>0)){
			console.log("DEFECTS ********")
			finalObj = defectsReleaseData;
			
		}
		// CODEELEMENTS
		else if((null == testExecReleaseData || undefined == testExecReleaseData  || testExecReleaseData.length<=0) && (null != codeElementReleaseData && undefined != codeElementReleaseData  && codeElementReleaseData.length>0) && (null == defectsReleaseData || undefined == defectsReleaseData || defectsReleaseData.length<=0)){
			console.log("CODEELEMENTS ********")
			finalObj = codeElementReleaseData;
			
		}
		// TEST_EXECUTIONS
		else if((null != testExecReleaseData && undefined != testExecReleaseData  && testExecReleaseData.length>0) && (null == codeElementReleaseData || undefined == codeElementReleaseData  || codeElementReleaseData.length<=0) && (null == defectsReleaseData || undefined == defectsReleaseData || defectsReleaseData.length<=0)){
			console.log("TEST_EXECUTIONS ********")
			finalObj = testExecReleaseData;
			
		}		
			
		console.log("==410==--finalObj=="+JSON.stringify(finalObj))
		
		if( null == finalObj || undefined == finalObj || finalObj.length<=0)return;
		var releases = fileupload.jsonObjectUnique(finalObj);		
			//console.log("final releases ** "+JSON.stringify(releases))			
		var inputDate = new Date().toString();
		var projectType = sessionStorage.getItem('projType');
		var buildType;
		if (projectType == 'O') {
			  buildType='R';
		} else { // added for CBT
			   buildType='U';
		}
		if(null != releases && undefined != releases && releases.length>0){
			var insert;
			var fileName = "builds";
			var fromCache = "false";
			for(var i=0;i<releases.length;i++){
				var build="1.0";
				var release = "1.0";
				//console.log("103-"+releases[i].build)
				//console.log("104-"+releases[i].release)
				build = (null != releases[i].build && 'undefined' != releases[i].build && '' != releases[i].build)? releases[i].build : build;
				release = (null != releases[i].release && 'undefined' != releases[i].release && '' != releases[i].release)? releases[i].release : release;  
				var data = '{"fileName":"'+fileName+'","params":"'+['PARAM1=' + build,'PARAM2=' + release,'PARAM3=' + buildType,'PARAM4=' + "NA",'PARAM5= '+inputDate,'PARAM6=' + "",'PARAM7= '+ localStorage.getItem('username').trim()]+'","projectName":"'+localStorage.getItem('projectName')+'","fromCache":"'+fromCache+'"}';
				ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,fileupload.callbackBuilds);
		
			}
			console.log("build table created successfully!");
		}		
		
	},
	
	callbackBuilds : function(data){
		//console.log(JSON.stringify(data));
	},
	
	jsonObjectUnique : function (arr) {	//get unique results on json objects array
		var result = [];
		for (var i = 0; i < arr.length; i++) {
		  var found = false;
		  for (var j = 0; j < result.length; j++) {
			if (result[j].release == arr[i].release && result[j].build == arr[i].build) {
			  found = true;			 
			  break;
			}
		  }
		  if (!found) {
			result.push(arr[i]);
		  }
		}
		return result;
	},
	
	getEnvironments : function(){ //generate testbeds from test executions collection
		var documentPath = document.location.href.split('/');
		var jsonPath = documentPath[0]+"//"+documentPath[2]+"/ISE/json/data.json";
		console.log("jsonPath -- "+jsonPath)
		//var paths="http://localhost/ISE/json/data.json"	
		
		$.getJSON(jsonPath, function(data) {
			var envFields = data.environement_fields;
			var data = '{"requesttype":"testbeds","testbeds": "'+envFields+'"}';				
			ISE_Ajax_Service.ajaxPostReq('RegressionOptimizationRestFulService', 'json', localStorage.authtoken,data,fileupload.callBackGeyEnv);
			
		});
	},
	callBackGeyEnv : function(data){
		//console.log("==421==data=="+JSON.stringify(data));
	},
	_ShowErrorMsg: function(msg_txt, visible){
		if(msg_txt=='Please select model'){
		$('#page_fileupload #uploadform  .error-msg').empty();
		$('#page_fileupload #uploadform  .error-msg').last().append(msg_txt);
		}
		else{
		$('#page_fileupload #uploadform .success-msg').empty();
		$('#page_fileupload #uploadform .success-msg').last().append(msg_txt);
		}	
		
		
		if(visible){
			
			$('#page_fileupload #uploadform .error-msg').show();
		    $('#page_fileupload #uploadform .success-msg').hide();
		}
		else{
			
			$('#page_fileupload #uploadform .error-msg').hide();
		    $('#page_fileupload #uploadform .success-msg').show();
		}
	},
	initLocalization:function(){
		var languageName = iseConstants.languagename;
		var pathName = 'json/localization/'+languageName;
		var opts = { language: languageName, pathPrefix: pathName, skipLanguage: "en-US"};
		 opts.callback = function(data, defaultCallback) {
			 
          data.message = "Optional call back works."
          defaultCallback(data);
          fileupload.localizationCallback(data);
        }
		
		$("[data-localize]").localize("fileupload", opts);
	
	},
	localizationCallback:function(data){
		console.log("DATA : "+data);
		fileupload.dataTableLocalizationData = data.fileuploadtabledata;
	},
	getLocalizationName:function(name){
		 for(var ss in fileupload.dataTableLocalizationData){
			if(ss == name)
				return fileupload.dataTableLocalizationData[ss]
		}
		
	},
	

  };