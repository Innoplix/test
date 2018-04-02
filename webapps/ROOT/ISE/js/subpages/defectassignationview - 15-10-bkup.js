 var defectassignationview = {		
	  /* Init function  */
      init: function()
      {
		console.log("in defectassignationview");
		
		//global variables
		var duplicate;
		var defectTitle;
		var duplicatePercent;
		var executionIDVal;
		var ClusterIDArray;
		var UserIDArray;
		var defectIds;
		
		//date picker
		if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                orientation: "left",
                autoclose: true
            }); 
		}

		//get Feature drop down data
		defectassignationview._setFeaturesData();
		
		
		//get Priority drop down data
		defectassignationview._setPriorityData();
		
		//get required cluster value
		var clusterNumber = $('#clusterNumber').val();
			
		//on Submit
        $("#submitForm").click(function(event) {
            defectassignationview._QueryFormation();
			console.log("end callback");
		});
		
		//on reset
        $("#resetForm").click(function(event) {
             location.reload();
			//$("#searchPortletBody").load("#defectassignationview");
			//$("#searchPortletBody").load(location.href+" #searchPortletBody>*","");
			//$("#searchPortletBody").toggle().toggle();
		});
		
		//on Assign
		$("#AssignForm").click(function(event) {
           var clusterSelected = [];		
		   executionIDSelected = $('input[name="execID"]:checked', '#executionIDList').val();
		   $('#clusterResultsTableBody input:checkbox:checked').each(function(index) {
				clusterSelected.push($(this).val());
		   });
		   var userSelected = $('#UsersData').val();
			if(executionIDSelected.length <= 0) {
				//alert("Select atleast one execution ID");
				$('#errorTable1').empty();
				var errorContent = '<table><tr><td>Select atleast one execution ID</td></tr></table>';
				$('#errorTable1').last().append(errorContent);
			} else  if (clusterSelected.length <= 0) {
				//alert("Select atleast one cluster ID");
				$('#errorTable1').empty();
				var errorContent = '<table><tr><td>Select atleast one cluster ID</td></tr></table>';
				$('#errorTable1').last().append(errorContent);
			} else  if (userSelected.length <= 0) {
				//alert("Select atleast one User");
				$('#errorTable1').empty();
				var errorContent = '<table><tr><td>Select atleast one User</td></tr></table>';
				$('#errorTable1').last().append(errorContent);
			} else {
				$('#AssignForm').removeAttr("href");
				for(var i=0;i<clusterSelected.length;i++) {
					var projectName = localStorage.getItem('projectName');
					var params = "#&#PARAM1="+executionIDSelected+"#&#PARAM2="+clusterSelected[i]+"#&#PARAM3="+userSelected;
					ISE.clusterUserAssignation("clusterUserAssignation", params, projectName, false, defectassignationview._receivedUserAssignation);
				}				
			}
        });
		
      },
	
	  _receivedUserAssignation: function(data) {
			console.log("@_receivedUserAssignation");
      },
	  	  
	  _setClustersDetails: function() {
			defectassignationview._setDistinctExecutionID();
			var projectName = localStorage.getItem('projectName');
		   	var executionID = defectassignationview.executionIDVal;
			var params=[];
			params[0]='PARAM1='+executionID;
           ISE.clustersDetail("duplicateBugReport", params, projectName, false, defectassignationview._receivedClustersDetails);
	 },
	
	 _setDistinctExecutionID: function() {
		  var projectName = localStorage.getItem('projectName');
		  ISE.executionID("distinctExecutionID", "", projectName, false, defectassignationview._receivedExecutionID);
	 },
	
	_receivedExecutionID: function(data) {
			console.log(data);
			var selectExecutionID = $('#executionIDList');
			selectExecutionID.empty();
			var newOptionContent = '';
			var eData1 = defectassignationview.executionIDVal;
			var eDatadate1 = new Date(eData1);
			console.log(eDatadate1);
			var eDatamonth1 = eDatadate1.toString().split(" ")[1]
				//alert(d1+" "+d.getDate()+" "+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
				var eDatadisplay1 = eDatamonth1 +" "+eDatadate1.getDate()+" "+eDatadate1.getFullYear()+" "+eDatadate1.getHours()+":"+eDatadate1.getMinutes()+":"+eDatadate1.getSeconds();
				
			var newOptionContentAll ='<label><input type="radio" name="execID" id="execID" checked value="'+defectassignationview.executionIDVal+'" onclick="defectassignationview._onexecutionidchange(this);">'+eDatadisplay1 +'</label>'
			selectExecutionID.append(newOptionContentAll);
			executionIDLen = 10;
			if(data.length < 10) {
				executionIDLen = data.length;
			}
			for(var i=1; i<executionIDLen; i++) {
				var eData = data[i].ExecutionID;
				var eDatadate = new Date(Number(eData));
				var eDatamonth = eDatadate.toString().split(" ")[1]
				//alert(d1+" "+d.getDate()+" "+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
				var eDatadisplay = eDatamonth +" "+eDatadate.getDate()+" "+eDatadate.getFullYear()+" "+eDatadate.getHours()+":"+eDatadate.getMinutes()+":"+eDatadate.getSeconds();
				if(Number(eData) != eData1) {
					newOptionContent = '<label><input type="radio" name="execID" id="execID" value="' 
					newOptionContent += eData + '" onclick="defectassignationview._onexecutionidchange(this);">'+eDatadisplay + '</label>';
					selectExecutionID.last().append(newOptionContent);
				}
			}

     },
	 
	 _onexecutionidchange: function(data) {
			console.log(data);
			console.log(data.value);
			var projectName = localStorage.getItem('projectName');
			var executionID = data.value;
			var params=[];
			params[0]='PARAM1='+executionID;
			ISE.clustersDetail("duplicateBugReport", params, projectName, false, defectassignationview._receivedClustersDetails);
	},
  
	
	_receivedClustersDetails: function(data) {
		if(data.length > 0) {
		var ExecutionIDArray = new Array();
		var ClusterIDArray = new Array();
		var DefectIDArray = new Array();
		var duplicateIDArray = new Array();
		var UserIDArray = new Array();
		var defectTitleArray = new Array();
		for(var i=0; i<data.length; i++){
			ExecutionIDArray.push(data[i].ExecutionID);
			ClusterIDArray.push(data[i].clusterID);
			DefectIDArray.push(data[i].DefectID);
			duplicateIDArray.push(data[i].duplicate);
			UserIDArray.push(data[i].User);
		}
		var str = "";
		var defectIds = new Array();
		for(var i=0; i<DefectIDArray.length;i++){
			str = DefectIDArray[i].toString();
			var outString = str.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '');
			var projectName = localStorage.getItem('projectName');
			defectIds[i] = outString.split(',');
		}
		
		
		var searchStrDef = "";
		for(var i=0;i<ClusterIDArray.length;i++) {
		
			for(var j=0;j<defectIds[i].length;j++) {
			
				console.log(defectIds[i][j].toString());
				searchStrDef += "_id:"+defectIds[i][j].toString()+" ";
				
			}
		
			
		
		}
		defectassignationview.defectIds = defectIds;
		console.log(searchStrDef);
		var requestObject = new Object();  
            requestObject.collectionName = "defect_collection";
            requestObject.projectName = projectName;
            requestObject.searchString = searchStrDef;
            requestObject.maxResults = 25;                    
            defectTitleArray[i] = ISE.getSearchResults(requestObject, defectassignationview._receivedDefectTitleResults);  
		
		
		var str1 = "";
		var duplicates = new Array();
		for(var i=0; i<DefectIDArray.length;i++){
			str1 = duplicateIDArray[i].toString();
			var outString = str1.replace(/[`~!@#$%^&*()_|+\-=?;'"<>\{\}\[\]\\\/]/gi, '');
			duplicates[i] = outString.split(',');
		}
		var str2 = "";
		var duplicatesPercent = new Array();
		for(var i=0; i<duplicates.length;i++) {
			for(j=0,k=0;j<duplicates[i].length;j++,k++) {
				var tempVar = duplicates[i][j].toString();
					if (/^[a-zA-Z0-9- ]*$/.test(tempVar) == false) {
						duplicates[i][j] = tempVar.substring(0, tempVar.indexOf(':'));
					}
					/*var percent = tempVar.split(':');
					var colon = '';
					if(percent.length > 1)
							colon = percent[1];
					duplicatesPercent.push(colon);*/
			}
		}
			
		defectassignationview.duplicate = duplicates;
			
		defectassignationview.ClusterIDArray = ClusterIDArray;
		defectassignationview.duplicatePercent = duplicatesPercent;
		defectassignationview.UserIDArray = UserIDArray;
		} else {

			$('#clusterResultsTableBody').empty();
			var newRowContentEmpty = '<tr><td>';
			newRowContentEmpty += '<table><tr><td>Some Error Occurred at backend. Please try with less number of Required Clusters.</td></tr></table>';
			newRowContentEmpty += '</td></tr>';
			$('#clusterResultsTableBody').last().append(newRowContentEmpty);
		}
	
	
	},
  
	
	_receivedDefectTitleResults: function(data) {
		/*if(data.length > 0) {
		var ExecutionIDArray = new Array();
		var ClusterIDArray = new Array();
		var DefectIDArray = new Array();
		var duplicateIDArray = new Array();
		var UserIDArray = new Array();
		var defectTitleArray = new Array();
		for(var i=0; i<data.length; i++){
			ExecutionIDArray.push(data[i].ExecutionID);
			ClusterIDArray.push(data[i].clusterID);
			DefectIDArray.push(data[i].DefectID);
			duplicateIDArray.push(data[i].duplicate);
			UserIDArray.push(data[i].User);
		}
		var str = "";
		var defectIds = new Array();
		for(var i=0; i<DefectIDArray.length;i++){
			str = DefectIDArray[i].toString();
			var outString = str.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '');
			var projectName = localStorage.getItem('projectName');
			defectIds[i] = outString.split(',');
		}
		
		
		var searchStrDef = "";
		for(var i=0;i<ClusterIDArray.length;i++) {
		
			for(var j=0;j<defectIds[i].length;j++) {
			
				console.log(defectIds[i][j].toString());
				searchStrDef += "_id:"+defectIds[i][j].toString()+" ";
				
			}
		
			
		
		}
		console.log(searchStrDef);
		var requestObject = new Object();  
            requestObject.collectionName = "ise_mongo_demo1_defect_collection";
            requestObject.projectName = projectName;
            requestObject.searchString = searchStrDef;
            requestObject.maxResults = 25;                    
            defectTitleArray[i] = ISE.getSearchResults(requestObject, defectassignationview._receivedDefectTitleResults);  
		
		
		var str1 = "";
		var duplicates = new Array();
		for(var i=0; i<DefectIDArray.length;i++){
			str1 = duplicateIDArray[i].toString();
			var outString = str1.replace(/[`~!@#$%^&*()_|+\-=?;'"<>\{\}\[\]\\\/]/gi, '');
			duplicates[i] = outString.split(',');
		}
		var str2 = "";
		var duplicatesPercent = new Array();
		for(var i=0; i<duplicates.length;i++) {
			for(j=0,k=0;j<duplicates[i].length;j++,k++) {
				var tempVar = duplicates[i][j].toString();
					if (/^[a-zA-Z0-9- ]*$/.test(tempVar) == false) {
						duplicates[i][j] = tempVar.substring(0, tempVar.indexOf(':'));
					}
			}
		}
			
		defectassignationview.duplicate = duplicates;
			
		defectassignationview.duplicatePercent = duplicatesPercent;*/
		
		console.log("********************************************");
		 console.log(data);
		var defTitle = new Array();
		for(var i=0;i<data.length;i++) {
		
			defTitle[i] = data[i].title;
			//defTitle[i][1] = data[i]._id;
		
		}
		defectassignationview.defectTitle = defTitle;
		console.log(defectassignationview.defectTitle);
		
		var table = $('#clusterResultsTable');
			
		$('#clusterResultsTableBody').empty();
		var newRowContent = '<tr>';
		var titleLen = 20;
		if(defectassignationview.ClusterIDArray.length >=2 && defectassignationview.ClusterIDArray.length <= 5) {
			titleLen = 15;
		} else if(defectassignationview.ClusterIDArray.length >5) {
			titleLen = 6;
		}
		console.log(defectassignationview.ClusterIDArray.length);
		for(var i=0;i<defectassignationview.ClusterIDArray.length;i++) {
			var titleContent='';
			if(defectassignationview.duplicate[i].length>1){
				titleContent += (defectassignationview.duplicate[i].length)/2 +'duplicates found, ';
			} else {
				titleContent += '0 duplicates found, ';
			}
			if(defectassignationview.UserIDArray[i]!="" && defectassignationview.UserIDArray[i]!= undefined){
				titleContent +='Assigned to - '+defectassignationview.UserIDArray[i]+'.';
			} else {
				titleContent +="Cluster Not Assigned.";
			}
			
			newRowContent += '<td><table class="table table-hover"><thead id="clusters"><tr><th style="background-color:#C8C8C8;color:white;height:30px;width:100%;text-align:left;" class="icon-btn"data-original-title="" title="'+titleContent+'" >' +						    
							'<input type="checkbox" value='+defectassignationview.ClusterIDArray[i].toString()+'>&nbsp;&nbsp;'+ 
							'<a data-target="#stack1" data-toggle="modal" onclick="defectassignationview._onDuplicateViewModal('+i+');">' +'Cluster '
							+defectassignationview.ClusterIDArray[i].toString()
							+'</a>';
								
							if(defectassignationview.duplicate[i].length>1){
								newRowContent +='<a class="badge badge-danger" data-target="#stack1" data-toggle="modal" onclick="defectassignationview._onDuplicateViewModal('+i+');">' +(defectassignationview.duplicate[i].length)/2+'</a>';
							} else {
								newRowContent +='<a class="badge badge-danger" data-target="#stack1" data-toggle="modal" onclick="defectassignationview._onDuplicateViewModal('+i+');">'+ 0 +'</a>';
							}
							newRowContent += '</th></tr></thead><tbody>';
					
				var title = '';
				for(var j=0;j<defectassignationview.defectIds[i].length;j++) {
					//defectassignationview.defectId = defectIds[i][j].toString();
					/*for(var k=0;k<defectassignationview.defectTitle.length;k++) {
						if(defectassignationview.defectTitle[k][1] == defectassignationview.defectIds[i][j]) {
							
							title = defectassignationview.defectTitle[k][0];
						}
					
					}*/
					for(var k=0;k<data.length;k++) {
		
							//defTitle[i][0] = data[i].title;
							//defTitle[i][1] = data[i]._id;
							if(data[k]._id == defectassignationview.defectIds[i][j]) {
								title = data[k].title;
							
							}
		
					}
					newRowContent += '<tr><td>'
									+'<label value="'
									+defectassignationview.defectIds[i][j]
									+'"><a data-target="#stack2" data-toggle="modal" id="'
									+defectassignationview.defectIds[i][j]
									+'" onclick="defectassignationview._onDefectViewModal(this);">'
									+defectassignationview.defectIds[i][j]+'</a>'
									+'&nbsp;&nbsp;&nbsp;'
									+'<span data-original-title="" title="'
									//+defectassignationview.defectTitle[i]
									+title
									+'">'
									//+defectassignationview.defectTitle[i].substring(0, titleLen)
									+title.substring(0, titleLen)
									+'...</span></label></td></tr>';
				}
				
				if(defectassignationview.UserIDArray[i]!="" && defectassignationview.UserIDArray[i]!= undefined){
					newRowContent +='<tr><td><i class="fa fa-user" style="color:green"></i>&nbsp;Assigned to - '+defectassignationview.UserIDArray[i]+'</td></tr>';
			   }
				
				newRowContent += '</tbody></table></td>'
		}
		$('#clusterResultsTableBody').last().append(newRowContent);
			
		$('#clusterResultsTableBody').last().append('</tr>');
		/*} else {

			$('#clusterResultsTableBody').empty();
			var newRowContentEmpty = '<tr><td>';
			newRowContentEmpty += '<table><tr><td>Some Error Occurred at backend. Please try with less number of Required Clusters.</td></tr></table>';
			newRowContentEmpty += '</td></tr>';
			$('#clusterResultsTableBody').last().append(newRowContentEmpty);
		}*/
		$('#searchClusterTable').removeClass("hide");
        ISEUtils.portletUnblockingCluster("pageContainer");
	 
	},
	
	_onDuplicateViewModal: function(data) {
			$('#duplicateTable').empty();
			if(defectassignationview.duplicate[data].length >1) {
				var newDupRowContent = '<table class="table table-bordered table-hover"><thead><tr><th>Defect</th><th>Duplicate</th><tr></thead><tbody>';
					for(l=0;l<defectassignationview.duplicate[data].length;l+=2) {
						newDupRowContent+='<tr>';
						newDupRowContent+='<td>'+defectassignationview.duplicate[data][l]+'</td>'
						newDupRowContent+='<td>'+defectassignationview.duplicate[data][l+1]+'</td>'
						newDupRowContent+='</tr>';
					}
					newDupRowContent+='</tbody></table>';
					$('#duplicateTable').last().append(newDupRowContent);
			} else {
				var newDupRowContentEmpty = '<table><tr><td>No Duplicates for this Cluster</td></tr></table>';
				$('#duplicateTable').last().append(newDupRowContentEmpty);
			}
		},	
		
	_onDefectViewModal: function(data) {
			var searchStr = data.id;
			/*var projectName = localStorage.getItem('projectName');
            /*var params = ['PARAM1=' + searchStr];

            ISE.getDefectdetailsByID("getDefectDetailsById", params, projectName, false, defectassignationview._receivedDefectIdResults);*/
			console.log(searchStr);
			var projectName = localStorage.getItem('projectName');
			var requestObject = new Object();  
                requestObject.collectionName = "defect_collection";
                requestObject.projectName = projectName;
                requestObject.searchString = "_id:"+searchStr;
                requestObject.maxResults = 25;                    
                ISE.getSearchResults(requestObject, defectassignationview._receivedDefectIdResults);  

			
		},
		
	_receivedDefectIdResults: function(data) {
		 console.log(data);
		 $('#defectTableHeader').empty();
		 $('#defectTable').empty();
		 for(var i=0;i<data.length;i++){
			console.log(data[i]._id);
			var defectTableHeaderContent="Defect Details of     <b>" + data[i]._id+'</b>';
			$('#defectTableHeader').last().append(defectTableHeaderContent);
			var newDefRowContent = '<table><tbody>';
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'description'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+data[i].description+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'title'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+data[i].title+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'feature'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+data[i].feature+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'internaldefect'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+data[i].internaldefect+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'last_updated_date'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+data[i].last_updated_date+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'primary_feature'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+data[i].primary_feature+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'primary_feature_parent'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+data[i].primary_feature_parent+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'priority'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+data[i].priority+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'severity'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+data[i].severity+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'status'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+data[i].status+'</td></tr>'
				newDefRowContent+='</tbody></table>';
				$('#defectTable').last().append(newDefRowContent);
			}
		
	 },
	  
	 _setFeaturesData: function() {
		  var projectName = localStorage.getItem('projectName');
		  ISE.features("DefectsFeatureQry", "", projectName, false, defectassignationview._receivedFeatures);
	 },
	 
	_receivedFeatures: function(data) {
		
		var selectFeatureData = $('#featureData');
		$('#featureData').empty();
		var newOptionContent = '';
		var newOptionContentAll ='<option value="All"> Select feature.. </option>'
		selectFeatureData.append(newOptionContentAll);
		for(var i=0; i<data.length; i++) {
			var fData = data[i].primary_feature;
			newOptionContent = '<option value="' 
			newOptionContent += fData + '">'+fData + '</option>';
			selectFeatureData.last().append(newOptionContent);
		
		}

     },
  
	_setPriorityData: function() {
		var projectName = localStorage.getItem('projectName');
		ISE.prioritiesListQuery("DefectsStatusQry", "", projectName, false, defectassignationview._receivedPrioritiesListQuery);
    },
	
	_receivedPrioritiesListQuery: function(data) {
		var selectPriorityData = $('#priorityData');
		$('#priorityData').empty();
		var newOptionContent = '';
		var newOptionContentAll ='<option value="All"> All </option>'
		selectPriorityData.append(newOptionContentAll);
		for(var i=0; i<data.length; i++) {
			var pData = data[i].status;
			newOptionContent = '<option value="' 
			newOptionContent += pData + '">'+ pData + '</option>';
			selectPriorityData.last().append(newOptionContent);
		
		}

    },
	
	_QueryFormation: function(){
		var projectName = localStorage.getItem('projectName');
		var qryStringForRelease = "*" ;
		var qryStringForyears = "*";
		var priority =$('#priorityData').val();
		var feature =$('#featureData').val();
		dataArr = new Array(); 
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();
		if(startDate=="" && endDate!=""){
				//alert("Please enter start date");
				$('#errorTable').empty();
				var errorContent = '<table><tr><td>Please enter start date</td></tr></table>';
				$('#errorTable').last().append(errorContent);
		}else if(endDate=="" && startDate!=""){
				//alert("Please enter end date");
				$('#errorTable').empty();
				var errorContent = '<table><tr><td>Please enter end date</td></tr></table>';
				$('#errorTable').last().append(errorContent);
		}else if(startDate>endDate){
			//alert("Filter Start Date should not Greater than End Date");
				$('#errorTable').empty();
				var errorContent = '<table><tr><td>Filter Start Date should not Greater than End Date</td></tr></table>';
				$('#errorTable').last().append(errorContent);
		}else if(endDate=="" && startDate=="") {
				/*if(priority == 'All' && feature == 'All')
				{
					qryString= "*"
				}
				else*/ if(priority != 'All' && feature == 'All')
				{
					qryString = '(status:\\"'+priority+'\\")';
				}
				else if(priority == 'All' && feature != 'All')
				{
					qryString = '(primary_feature:\\"'+feature+'\\")';
				}
				else if(priority != 'All' && feature != 'All')
				{
					qryString = '(status:\\"'+priority+'\\") AND (primary_feature:\\"'+feature+'\\")';
				}
		}
		else
		{
			/*if(priority == 'All' && feature == 'All')
			{
				qryString = "*"
			}
			else*/ if(priority != 'All' && feature == 'All')
			{
				qryString = '(status:\\"'+priority+'\\")';
			}
			else if(priority == 'All' && feature != 'All')
			{
				qryString = '(primary_feature:\\"'+feature+'\\")';
			}
			else if(priority != 'All' && feature != 'All')
			{
				qryString = '(status:\\"'+priority+'\\") AND (primary_feature:\\"'+feature+'\\")';
			}
		}
		
			//defectassignationview.executionIDVal = Math.floor((Math.random() * 100000) + 1);
			defectassignationview.executionIDVal = new Date();
			console.log("*******Date*************"+defectassignationview.executionIDVal);
		    var groupCount = $("#clusterNumber").val();
			var duplicatePercent = $("#duplicatePercent").val();
			var executionIDValueTime = defectassignationview.executionIDVal;
			var executionIDValueTime1 = executionIDValueTime.getTime();
			var executionIDValue = executionIDValueTime1.toString();
			defectassignationview.executionIDVal = executionIDValueTime1;
			console.log("*******defectassignationview.executionIDVal*************"+defectassignationview.executionIDVal);
		    
			var duplicatePercentInt = parseInt($("#duplicatePercent").val(), 10);
			var groupCountInt = parseInt($("#clusterNumber").val(), 10);
			if(priority == 'All' && feature == 'All')
			{
				//alert("Please select atleast one feature to proceed further")
				$('#errorTable').empty();
				var errorContent = '<table><tr><td>Please select atleast one feature to proceed further</td></tr></table>';
				$('#errorTable').last().append(errorContent);
				
			} else if(duplicatePercentInt >100 || duplicatePercentInt<=0) {
				//alert("Please enter Duplicate Percent within 1-100 range.")
				$('#errorTable').empty();
				var errorContent = '<table><tr><td>Please enter Duplicate Percent within 1-100 range.</td></tr></table>';
				$('#errorTable').last().append(errorContent);
			} else if(groupCountInt<=0) {
				//alert("Please enter group count > 0")
				$('#errorTable').empty();
				var errorContent = '<table><tr><td>Please enter group count > 0</td></tr></table>';
				$('#errorTable').last().append(errorContent);
			}else {
			$('#submitForm').removeAttr("href");
			ISEUtils.portletBlockingCluster("pageContainer");
			if(endDate=="" && startDate=="") {
				//var requestObject = new Object();
				//requestObject.collectionName = "ise_mongo_demo1_defect_collection";
				//requestObject.qryString = qryString;
				//requestObject.maxResults = 1000;
				ISE.clustersDetailQuery("defect_collection",qryString,projectName,groupCount,duplicatePercent,executionIDValue,defectassignationview._receivedSearchResultsByCluster);
			
			} else {
				//var requestObject = new Object();
				//requestObject.collectionName = "ise_mongo_demo1_defect_collection";
				//requestObject.qryString = qryString;
				//var startDateISO = new Date(Date.parse(startDate)).toISOString();
				//var endDateISO = new Date(Date.parse(endDate)).toISOString();
				//requestObject.fromdate = startDateISO;
				//requestObject.todate = endDateISO;
				//requestObject.maxResults = 1000;
				ISE.clustersDetailQuery("defect_collection",qryString,projectName,groupCount,duplicatePercent,executionIDValue,defectassignationview._receivedSearchResultsByCluster);
			
			
			}
		}	
		console.log("end");
   },

	_receivedSearchResultsByCluster: function(dataObj) {
		
			console.log("Done with cluster formation****************************************");
			defectassignationview._setClustersDetails();
			console.log("table created");
			//defectassignationview._initTable2();
			
	},
	
	_initTable2: function() {
		console.log("inside _initTable2");
		//console.log($().dataTables());
        var table = $('#clusterResultsTable');

        /* Table tools samples: https://www.datatables.net/release-datatables/extras/TableTools/ */

        /* Set tabletools buttons and button container */

        $.extend(true, $.fn.DataTable.TableTools.classes, {
            "container": "btn-group tabletools-btn-group pull-right",
            "buttons": {
                "normal": "btn btn-sm default",
                "disabled": "btn btn-sm default disabled"
            }
        });

        var oTable = table.dataTable({

            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
           /* "language": {
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

            "order": [
                [0, 'asc']
            ],
            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],*/

            // set the initial value
            "pageLength": 10,
            "dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
            // So when dropdowns used the scrollable div should be removed. 
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

            "tableTools": {
                "sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
                "aButtons": [{
                    "sExtends": "pdf",
                    "sButtonText": "PDF"
                }, {
                    "sExtends": "csv",
                    "sButtonText": "CSV"
                }, {
                    "sExtends": "xls",
                    "sButtonText": "Excel"
                }, {
                    "sExtends": "print",
                    "sButtonText": "Print",
                    "sInfo": 'Please press "CTRL+P" to print or "ESC" to quit',
                    "sMessage": "Generated by DataTables"
                }, {
                    "sExtends": "copy",
                    "sButtonText": "Copy"
                }]
            }
        });

        //var tableWrapper = $('#sample_2_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
    }
		
};