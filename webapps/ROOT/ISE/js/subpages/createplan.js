var createplan = {
	planTypeSelectedVal:'',
	planDetailsArr : [],
	planArry:[],
	currentSelectedPlanName:'',
	init: function() {
		createplan.getPlanNames();
		//regressionOptimization.displayplan();
		
	$('#page_regressionOptimization #createPlanTabs #plansNew').change(function () {
		$("#page_regressionOptimization #Reg-Opt-Plan-Exec-Data").slideUp( 'slow', function(){ 
		   $('#page_regressionOptimization .createplan-sub-container #plansNewContainer').slideDown( 'slow', function(){ 
				$('#page_regressionOptimization .createplan-sub-container #plansNewContainer').show();
				$('#page_regressionOptimization .createplan-sub-container #plansCopyExistingContainer').hide();
				createplan.planTypeSelectedVal = "plansNewContainer";
			});
	   });
	   
		
		
	});
	$('#page_regressionOptimization #createPlanTabs #plansCopyExisting').change(function () {
		$('#page_regressionOptimization .createplan-sub-container #plansCopyExistingContainer').show();
		$('#page_regressionOptimization .createplan-sub-container #plansNewContainer').hide();
		createplan.planTypeSelectedVal = "plansCopyExistingContainer";
	});
	
	$("#page_regressionOptimization #createPlanSubmitBtn").click(function(event) {
		
		//save regression plan
		var planName = $("#plansNewContainer .plannew-value").val();
		
		
		
		if(planName.length <= 0){
			var errorContent = ' Please enter plan name';
			createplan._ShowErrorMsg(errorContent, true);
			return;
		}
		if(createplan.hasWhiteSpace(planName)){
			var errorContent = ' white spaces are not allowed';
			createplan._ShowErrorMsg(errorContent, true);
			return;
		}
		createplan.updatePlanData(false);
		createplan._ShowErrorMsg('', false);
		var regPlanJson = {"requesttype":"regression_plan","projectName":localStorage.getItem('projectName'),"username":localStorage.getItem('username'),"planId": planName,"currentPlan":true};
		try{
			var resp = ISE_Ajax_Service._genericServiceCall("saveRegressionOptimization",regPlanJson);
			//alert(JSON.stringify(resp));
			console.log("====create plan=====57==="+JSON.stringify(resp));
			//resp = JSON.parse(resp);
			if(null != resp){				
				createplan.currentSelectedPlanName = resp.plan_name;
				if(createplan.planDetailsArr.length>0){
					for(var i=0;i<createplan.planDetailsArr.length;i++){
						createplan.planDetailsArr[i].currentPlan = false;
					}
				}
				var eachObj = new Object(); 
				eachObj.planName=resp.plan_name;
				eachObj.userId=localStorage.getItem('username');
				eachObj.createdDate='';
				eachObj.currentPlan=resp.currentPlan;
				createplan.planDetailsArr.push(eachObj);
				regressionOptimization.displayplan(resp.plan_name);
				createplan.constructingTableForRegPlan(createplan.planDetailsArr);
				var id1= "RegressionPlan|"+resp.currentPlan;
				
				$("#plansNewContainer .plannew-value").val('');
			}
		}catch(err){}
		
		$("#page_regressionOptimization #createPlanTabs #plansNew").attr("checked", false)
		$("#page_regressionOptimization #Reg-Opt-Plan-Exec-Data").slideDown( 'slow', function(){ 
		  
	   });
	   
	    $('#page_regressionOptimization .createplan-sub-container #plansNewContainer').slideUp( 'slow', function(){ 
		   $('#page_regressionOptimization .createplan-sub-container #plansNewContainer').hide();
	   });
	   if(	createplan.currentSelectedPlanName != ""){
			var id1= "RegressionPlan|"+createplan.currentSelectedPlanName;
			regressionOptimization.currentPlan=createplan.currentSelectedPlanName;
			document.getElementById(id1).checked=true;
		}
	});
	$("#page_regressionOptimization #createPlanCancelBtn").click(function(event) {
		$("#page_regressionOptimization #createPlanTabs #plansNew").attr("checked", false);
		createplan._ShowErrorMsg('', false);
		$("#page_regressionOptimization #plansNewContainer").slideUp( 'slow', function(){ 
			$("#page_regressionOptimization #Reg-Opt-Plan-Exec-Data").slideDown( 'slow', function(){ 
		
				$('#page_regressionOptimization .createplan-sub-container #plansNewContainer').hide();
				
			});
	    });
		
	});
		//alert("113="+createplan.currentSelectedPlanName);
	},
	hasWhiteSpace :function(s) {	
	  if(s.indexOf(' ') >= 0)
		return true;
	  else
	  return false;
	},
	getPlanNames:function(){
		var requestObject = {};
		var query =  {  "query": {"match_all": {}}};
		requestObject.projectName = localStorage.getItem('projectName');
		requestObject.collectionName = "regressionplan_collection";
		requestObject.query = query;		
		ISE.multipleExactValuesESQuery(requestObject, createplan._callbackPlanNames);
	},
	_callbackPlanNames: function(data){
		createplan.planDetailsArr = [];	 		
		
		if(null != data && data.length>0){
			for(var i=0;i<data.length;i++){
				var eachObj = new Object(); 
				eachObj.planName=data[i]['_source'].plan_name;
				eachObj.userId=data[i]['_source'].user_id;
				eachObj._id = data[i]['_source']['_id'];
				eachObj.createdDate=data[i]['_source'].created_date;
				eachObj.currentPlan=data[i]['_source'].currentPlan;
				createplan.planDetailsArr.push(eachObj);
			}	 	
			
			createplan.constructingTableForRegPlan(createplan.planDetailsArr);
		}
	},
	constructingTableForRegPlan:function(planArray){	
		$('#Reg-Opt-Plan-Exec-Data').empty(); 	
		var rs="";		
		//var planName = sessionStorage.getItem("planId");		
		//var regPlanId = getRegPlanIdPk(planName); 
		//var regPlanId = planName;
		var b = true;
		rs += '<table class="table table-striped table-hover table-bordered" id="plansTable" width="100%"><thead><tr><td><b>Select</b></td><td ><b>Plan Name</b></td><td><b>UserId</b></td></tr></thead>';
		var id1;
		var title;
		for(var i=0; i<planArray.length;i++){
			 
			id1= "RegressionPlan|"+planArray[i].planName;			
			if(planArray[i].currentPlan){
				createplan.currentSelectedPlanName = planArray[i].planName;
				if(b){						
				b = false;
				rs += '<tr style="background-color:white;"><td><input type="radio" id='+ id1 +' name="planCheckbox" checked onClick="createplan.getPlanId(this)" value='+ planArray[i].planName +'></td><td title='+ planArray[i].planName +'>' + planArray[i].planName + '</td><td title='+ planArray[i].userId +'>'+planArray[i].userId+'</td></tr>';
				} else{						
					b = true;
					rs += '<tr style="background-color:#F0F2F2;"><td><input type="radio" id='+ id1 +' name="planCheckbox" checked onClick="createplan.getPlanId(this)" value='+ planArray[i].planName +'></td><td title='+ planArray[i].planName +'>' + planArray[i].planName + '</td><td title='+ planArray[i].userId +'>'+planArray[i].userId+'</td></tr>';
				} 	
			}else{
				if(b){						
				b = false;
				rs += '<tr style="background-color:white;"><td><input type="radio" id='+ id1 +' name="planCheckbox" onClick="createplan.getPlanId(this)" value='+ planArray[i].planName +'></td><td title='+ planArray[i].planName +'>' + planArray[i].planName + '</td><td title='+ planArray[i].userId +'>'+planArray[i].userId+'</td></tr>';
				} else{						
					b = true;
					rs += '<tr style="background-color:#F0F2F2;"><td><input type="radio" id='+ id1 +' name="planCheckbox" onClick="createplan.getPlanId(this)" value='+ planArray[i].planName +'></td><td title='+ planArray[i].planName +'>' + planArray[i].planName + '</td><td title='+ planArray[i].userId +'>'+planArray[i].userId+'</td></tr>';
				} 
			
			}			
						
		}						
															   
		$('#Reg-Opt-Plan-Exec-Data').append(rs + '</table>'); 	
		createplan._setOtableToTable();
		
	}, //end of the constructingTableForRegPlan
	
	_setOtableToTable:function(){

        var table = $('#plansTable');

        var oTable = table.dataTable({
		
		//"dom": 'frtTip',
		"tableTools": {
		"sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
		"aButtons": [{
			'sExtends': "csv"
								}],
		},

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
            // So when dropdowns used the scrollable div should be removed. 
            //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // set the initial value
            "pageLength": 5,

            "language": {
                "lengthMenu": " _MENU_ records",
                 "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",              
                "search": "Search with in results:",
                "zeroRecords": "No matching records found"
            },
            "columnDefs": [{ // set default column settings
                'orderable': true,
                'targets': [0]
            }, {
                "searchable": true,
                "targets": [0]
            }],
            "order": [
                [0, "asc"]
            ] // set first column as a default sort by asc
        });
	},
	
	_ShowErrorMsg: function(msg_txt, visible){
		$('#page_regressionOptimization .createplan-sub-container .alert.alert-danger .error-msg').empty();
		$('#page_regressionOptimization .createplan-sub-container .alert.alert-danger .error-msg').last().append(msg_txt);
		if(visible)
			$('#page_regressionOptimization .createplan-sub-container .alert.alert-danger').show();
		else
			$('#page_regressionOptimization .createplan-sub-container .alert.alert-danger').hide();
	},
	
	updatePlanData:function(value){
		if(value == false)
			var pland_id = '';
		else
			var pland_id = createplan.currentSelectedPlanName;
			//alert(createplan.planDetailsArr.length)
		if(createplan.planDetailsArr.length>0){
			for(var i=0; i<createplan.planDetailsArr.length; i++){
				var jsonStrObj ={"currentPlan" : false };
				var jsonString='{"requesttype":"updateObjectModel","collection":"regression_plan","columnname":"_id","columnvalue":"'+createplan.planDetailsArr[i]._id+'","object":'+JSON.stringify(jsonStrObj)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}';
				console.log("jsonstring data chanding defects---"+JSON.stringify(jsonStrObj))
				ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString,createplan._receivedPlansResultsFlag);
			}
		}
	},
	
	_receivedPlansResultsFlag: function(data){
		console.log("DATA : "+JSON.stringify(data));
	},
	getPlanId:function(node){	
		//isClickedPlan = true;
		createplan.updatePlanData(false);
		var planId = createplan.getSelectedPlan();
		console.log("planId  :"+planId);
		createplan.currentSelectedPlanName = planId;
		//alert("getplan 252== "+planId);
		regressionOptimization.displayplan(planId);
		var id;
		if(createplan.planDetailsArr.length>0){
			for(var i=0; i<createplan.planDetailsArr.length; i++){
				if(createplan.planDetailsArr[i].planName == planId){
					id = createplan.planDetailsArr[i]._id;
					//alert("getId = "+createplan.planDetailsArr[i]._id)
				}
			}
			var jsonStrObj ={"currentPlan" : true };
				var jsonString='{"requesttype":"updateObjectModel","collection":"regression_plan","columnname":"_id","columnvalue":"'+id+'","object":'+JSON.stringify(jsonStrObj)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}';
				console.log("jsonstring data chanding defects---"+JSON.stringify(jsonStrObj))
				ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString,createplan._receivedPlansResultsFlag);
			
		}
				
	},
	getSelectedPlan:function(){
		var planNewCheck=document.getElementsByName('planCheckbox');
		//console.log("planNewCheck :"+planNewCheck.length);
		var planId = "";
		for(var i=0;i<planNewCheck.length;i++){	
			if(planNewCheck[i].checked){
				planId = planNewCheck[i].value;		
			}					
		}
		return planId;
	}
	
};