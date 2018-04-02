
 var devdashboard = {
 
testCasesInfo:[],
filteredTestCasesInfo:[],
priorityInfo:[],
automationInfo:[],
filterPriorityInfo:[],
filterAutomationInfo:[],
testExecutionsInfo:[],
      /* Init function  */
	  
      init: function()
      {		
      	  if (!jQuery().dataTable) {
                return;
            }             
 
		devdashboard.selectedFilterValues();
        ISEUtils.portletBlocking("pageContainer");     
        var requestObject = new Object();
        requestObject.collectionName = "testcase_collection";
        requestObject.projectName = localStorage.getItem('projectName');
        ISE.getTestCasesInfoForDevDashboard(requestObject, devdashboard.receivedTestCaseResults);		
		
		$("#resetForm").click(function(event) {
			console.log("reset hit");
            var $priorityDropdownMulti = $("#priorityDropdown").select2();
			$priorityDropdownMulti.val(null).trigger("change");			
			var $automationDropdownMulti = $("#automationDropdown").select2();			
			$automationDropdownMulti.val(null).trigger("change");
			//$('#s2id_priorityDropdown ul li').first().remove();	
			$('#automationDropdown').select2({
				placeholder: "Automation",
				allowClear: true
			});		
			
			$('#priorityDropdown').select2({
				placeholder: "Priority",
				allowClear: true
			});	
        ISEUtils.portletBlocking("pageContainer");     
        var selectedVerionID = localStorage.getItem('releaseId');
	    var requestObject = new Object();
        requestObject.collectionName = "test_executions_collection";
        requestObject.searchString = "release:\""+selectedVerionID+"\"";
        requestObject.projectName = localStorage.getItem('projectName');       
        ISE.getTestCaseFeaturesForDevDashboard(requestObject, devdashboard.receivedDevDashboardResults);
		localStorage.setItem("collectionName", "testcase_collection");
        localStorage.setItem("type", "testcase");  			
			});
			
		
		$("#submitForm").click(function(event) {
				console.log("-----submit form invoked");
				
				devdashboard.filterPriorityInfo=[];
				devdashboard.filterAutomationInfo=[];				
			
				$("#priorityDropdown option:selected").each(function() {				
					devdashboard.filterPriorityInfo.push($(this).val());					
				});
				
				$("#automationDropdown option:selected").each(function() {				
					devdashboard.filterAutomationInfo.push($(this).val());				
				});		
				
				devdashboard.resultsBasedonPriorityAutomation();					
		   });			
    },
	selectedFilterValues:function(){
	$('#automationDropdown').select2({
				placeholder: "Automation",
				allowClear: true
			});		
			
			$('#priorityDropdown').select2({
				placeholder: "Priority",
				allowClear: true
			});	
	},
	resultsBasedonPriorityAutomation:function(){
			ISEUtils.portletBlocking("pageContainer");
			var automationString="";
			var priorityString="";
			var finalString;
			
			if(devdashboard.filterAutomationInfo.length>0){
			if(devdashboard.filterAutomationInfo[0] == "All"){
				automationString = "(*)";
				}else{
					for(var i=0;i<devdashboard.filterAutomationInfo.length;i++){
					if(devdashboard.filterAutomationInfo[i] == "unspecified"){
					automationString = "unspecified";
					}else{
						automationString += 'automation:"'+devdashboard.filterAutomationInfo[i].trim()+'" OR ';
						}
					}
					if(automationString != "unspecified"){
					automationString="("+automationString.slice(0,-3)+")"
					}
					
				}
			}
			
			if(devdashboard.filterPriorityInfo.length>0){
			if(devdashboard.filterPriorityInfo[0] == "All"){
				priorityString = "(*)";
				}else{
					for(var i=0;i<devdashboard.filterPriorityInfo.length;i++){					
					if(devdashboard.filterPriorityInfo[i] == "null"){
					priorityString = "null";
					}else if(devdashboard.filterPriorityInfo[i] == "No Priority"){
					priorityString = "No Priority";
					}else{
						priorityString += 'priority:"'+devdashboard.filterPriorityInfo[i].trim()+'" OR ';
						}
					}
					if(!(priorityString == "null"  || priorityString == "No Priority")){
						priorityString="("+priorityString.slice(0,-3)+")"
						}
				}
			}
			
			
			if(automationString == "unspecified"){
			var requestObject2 = new Object();
			requestObject2.collectionName = "testcase_collection";
            requestObject2.projectName = localStorage.getItem('projectName');
			//requestObject2.searchString =	finalString;
			requestObject2.maxResults = 15;	
			ISE.getAutomationUDPriorityEmptySearchResults(requestObject2, devdashboard.receivedSearchResults2);
			}
			else if(priorityString == "null"){
			finalString= automationString;
			
			var requestObject3 = new Object();
			requestObject3.collectionName = "testcase_collection";
            requestObject3.projectName = localStorage.getItem('projectName');
			requestObject3.searchString =	finalString;
			requestObject3.maxResults = 15;	
			ISE.getPriorityUDResults(requestObject3, devdashboard.receivedSearchResults);			
			}
			else if(priorityString == "No Priority"){
			finalString= automationString;
			
			var requestObject3 = new Object();
			requestObject3.collectionName = "testcase_collection";
            requestObject3.projectName = localStorage.getItem('projectName');
			requestObject3.searchString =	finalString;
			requestObject3.maxResults = 15;	
			ISE.getNoPrioritySearchResults(requestObject3, devdashboard.receivedSearchResults);			
			}else if (automationString == ""  && priorityString == ""){
				var selectedVerionID = localStorage.getItem('releaseId');
				var requestObject = new Object();
				requestObject.collectionName = "test_executions_collection";
				requestObject.searchString = "release:\""+selectedVerionID+"\"";
				requestObject.projectName = localStorage.getItem('projectName');       
				ISE.getTestCaseFeaturesForDevDashboard(requestObject, devdashboard.receivedDevDashboardResults);
				localStorage.setItem("collectionName", "testcase_collection");
				localStorage.setItem("type", "testcase");  						
			}				
			else{			
			if(automationString != "" && automationString != "unspecified" && priorityString != "No Priority" && priorityString != "null" && priorityString != ""){
				finalString= automationString+" AND "+priorityString;
			}else if (automationString != ""  && priorityString == ""){
				finalString= automationString;				
			}else if (automationString == ""  && priorityString != ""){
				finalString= priorityString;				
			}
			console.log("finalString-----"+finalString);
			var requestObject1 = new Object();
			requestObject1.collectionName = "testcase_collection";
            requestObject1.projectName = localStorage.getItem('projectName');
			requestObject1.searchString =	finalString;
			requestObject1.maxResults = 15;	
			ISE.getDevDashBoardSearch(requestObject1, devdashboard.receivedSearchResults);	
            }			
	},
	
	receivedSearchResults2:function(data){
	console.log("testCasesInfo"+testCasesInfo.length);
	var automationExistedArray = [];
	for(var b = 0; b< data.length; b++){
	automationExistedArray.push(data[b].id);
	}
	devdashboard.filteredTestCasesInfo = [];
	for( var a = 0; a< testCasesInfo.length; a++){
	if(automationExistedArray.indexOf(testCasesInfo[a].id) == -1){	
	devdashboard.filteredTestCasesInfo.push(testCasesInfo[a]);
	}
	}
	console.log("testExecutionsInfo"+devdashboard.testExecutionsInfo);
	   var selectedVerionID = localStorage.getItem('releaseId');
       var requestObject = new Object();
        requestObject.collectionName = "test_executions_collection";
        requestObject.projectName = localStorage.getItem('projectName'); 
		requestObject.searchString = "release:\""+selectedVerionID+"\"";		
        ISE.getTestCaseFeaturesForDevDashboard(requestObject, devdashboard.receivedFilteredDevDashboardResults);
		localStorage.setItem("collectionName", "testcase_collection");
        localStorage.setItem("type", "testcase");
		},	
	
    receivedSearchResults:function(data){
	devdashboard.filteredTestCasesInfo = [];
	
	devdashboard.filteredTestCasesInfo = data;
	console.log("testExecutionsInfo"+devdashboard.testExecutionsInfo);
	var selectedVerionID = localStorage.getItem('releaseId');
       var requestObject = new Object();
        requestObject.collectionName = "test_executions_collection";
        requestObject.projectName = localStorage.getItem('projectName');
		requestObject.searchString = "release:\""+selectedVerionID+"\"";		
        ISE.getTestCaseFeaturesForDevDashboard(requestObject, devdashboard.receivedFilteredDevDashboardResults);
		localStorage.setItem("collectionName", "testcase_collection");
        localStorage.setItem("type", "testcase");
		},	
receivedFilteredDevDashboardResults:function(dataObj){
	console.log("filtered test exec dataobj length"+dataObj.length);
	console.log("filteredTestCasesInfo length"+devdashboard.filteredTestCasesInfo.length);   
    if (ISEUtils.validateObject(dataObj)) {	
	$('#devDashBoardTableId').DataTable().clear().destroy();
		var statusArray = [];
        var maxNumberArray = [];
		var loopCount = 0;
		
		for (var i = 0; i < devdashboard.filteredTestCasesInfo.length; i++) {
		
		var newRowContent = "<tr>";                
                 newRowContent += '<td style="width: 60px;"><a href="javascript:;" testCaseid='+devdashboard.filteredTestCasesInfo[i].id+' title="Details" class="btn btn-xs blue" onclick="devdashboard._openDetailedViewForSelectedTestCaseID(this)"><i class="glyphicon glyphicon-info-sign"></i></a>';
                 newRowContent += '<a href="javascript:;" testCaseid='+devdashboard.filteredTestCasesInfo[i].id+' title="Execution history" onclick="devdashboard._openKibanaGraph(this)" class="btn btn-xs blue"><i class="icon-graph"></i></a></td>'; 
                
                   var testCaseId = devdashboard.filteredTestCasesInfo[i].id;                 
                     
                  if(testCaseId.length > 50)
                  {
                    var lastCharacters = testCaseId.slice(-50);
                    var label = "...."+lastCharacters;                   
                    newRowContent += '<td title="'+testCaseId+'">'+label +'</td>';
                  }
                  else
                  {
                       newRowContent += '<td>'+devdashboard.filteredTestCasesInfo[i].id +'</td>';
                  }
              statusArray=[];
              maxNumberArray=[];
			  
			  var testExecObj = _.where(dataObj, {key: testCaseId});		
               if(testExecObj.length >0){
				  for(var j=0; j < testExecObj[0].status.buckets.length;j++){
                   statusArray.push(testExecObj[0].status.buckets[j]);
                   maxNumberArray.push(testExecObj[0].status.buckets[j].maxdate.value);
                  }				  
				if(maxNumberArray.length == 1 && statusArray.length == 1)
				  {  
					  if(maxNumberArray[0] == null || maxNumberArray[0] == undefined){
						maxNumberArray[0] = "NA";
					  }
					  newRowContent += "<td>"+statusArray[0].key+"</td>";

					  if(statusArray[0].key.toLowerCase() == "passed")
						  newRowContent += "<td>"+maxNumberArray[0]+"</td>";
					  else
						  newRowContent += "<td>NA</td>";

					 if(statusArray[0].key.toLowerCase() == "failed")
						newRowContent += "<td>"+maxNumberArray[0]+"</td>";
					 else 
						newRowContent += "<td>NA</td>";
					  
					  newRowContent += "<td>"+testExecObj[0].doc_count+"</td>";

					if(statusArray[0].key.toLowerCase() == "passed")
						  newRowContent += "<td>"+statusArray[0].doc_count+"</td>";
					else
						newRowContent += "<td>0</td>";

					 if(statusArray[0].key.toLowerCase() == "failed")
						newRowContent += "<td>"+statusArray[0].doc_count+"</td>";
					 else 
						newRowContent += "<td>0</td>";
						
					if((statusArray[0].key.toLowerCase() != "failed") && (statusArray[0].key.toLowerCase() != "passed"))
						newRowContent += "<td>"+statusArray[0].doc_count+"</td>";
					 else 
						newRowContent += "<td>0</td>";  
				   }
				else{                    
                      Array.prototype.max = function() {
                          return Math.max.apply(null, this);
                        };
						var maxNumber = maxNumberArray.max();

						var filteredObject = $(statusArray).filter(function( idx ) {
						return statusArray[idx].maxdate.value === maxNumber ;
						});				
						if(filteredObject[0] != null && filteredObject[0] !=  undefined && filteredObject[0].key != null && filteredObject[0].key != undefined){
							newRowContent += "<td>"+filteredObject[0].key+"</td>";
						}else{
							newRowContent += "<td>NA</td>";
						  }
				 
					    var lastPassed = "NA";
						var lastFailed = "NA";
						var passedCount = 0;
						var failedCount = 0;
						var otherStatusCount = 0;
					
						for(x=0;x<statusArray.length;x++) {
							if(statusArray[x].key.toLowerCase() == "passed") {
								//newRowContent += "<td>"+statusArray[x].maxdate.value+"</td>";
								if(statusArray[x].maxdate.value != null && statusArray[x].maxdate.value != undefined){
									lastPassed = statusArray[x].maxdate.value;
								}
								else{
									lastPassed = "NA";
								}
								if(statusArray[x].doc_count != null && statusArray[x].doc_count != undefined){
									passedCount = statusArray[x].doc_count;
								}
								else{
									passedCount = 0;
								}
								//lastPassed = statusArray[x].maxdate.value;
								//passedCount = statusArray[x].doc_count;
							}
							if(statusArray[x].key.toLowerCase() == "failed"){
								if(statusArray[x].maxdate.value != null && statusArray[x].maxdate.value != undefined){
									lastFailed = statusArray[x].maxdate.value;
								}else{
									lastFailed = "NA";
								}
								if(statusArray[x].doc_count != null && statusArray[x].doc_count != undefined){
									failedCount = statusArray[x].doc_count;
								}
								else{
									failedCount = 0;
								}
								//failedCount = statusArray[x].doc_count;
							}
							if((statusArray[x].key.toLowerCase() != "failed") && (statusArray[x].key.toLowerCase() != "passed")){
								otherStatusCount = statusArray[x].doc_count;
							}
						  }				 
						 newRowContent += "<td>"+lastPassed+"</td>";
						 newRowContent += "<td>"+lastFailed+"</td>";
						 newRowContent += "<td>"+testExecObj[0].doc_count+"</td>";
						 newRowContent += "<td>"+passedCount+"</td>";
						 newRowContent += "<td>"+failedCount+"</td>"; 
						 newRowContent += "<td>"+otherStatusCount+"</td>";  				 
                    }
				}
				else{
				  newRowContent += "<td>NA</td>";
				  newRowContent += "<td>NA</td>";
				  newRowContent += "<td>NA</td>";
				  newRowContent += "<td>NA</td>";
				  newRowContent += "<td>0</td>";
				  newRowContent += "<td>0</td>";
				  newRowContent += "<td>0</td>";
				}
				if(devdashboard.filteredTestCasesInfo[i].priority == null || devdashboard.filteredTestCasesInfo[i].priority == undefined || devdashboard.filteredTestCasesInfo[i].priority == "unspecified"){
						newRowContent += "<td>NA</td>";
				}else if(devdashboard.filteredTestCasesInfo[i].priority == ""){
						newRowContent += "<td>No Priority</td>";
				}else{
						newRowContent += "<td>"+devdashboard.filteredTestCasesInfo[i].priority+"</td>";						
				}				
                newRowContent +="</tr>";
				loopCount++;
                $('#devDashBoardTableBody').append(newRowContent);		  
			  }
			  console.log("loopCount"+loopCount);
		}
		else{
			$('#devDashBoardTableId').DataTable().clear().destroy();
			}
			var oTable = $('#devDashBoardTableId').dataTable({
                //"dom": 'frtTip',
              
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

                "columnDefs": [{
                    "orderable": false,
                    "targets": [0]
                },

                 { "width": "7%", "targets":0 }, 
                 { "width": "5%", "targets":2 },
                 { "width": "5%", "targets":3 },
                 { "width": "5%", "targets":4 },
                 { "width": "5%", "targets":5 },
                 { "width": "5%", "targets":6 },
                 { "width": "5%", "targets":7 }

                ],
               "order": [
                          [2, 'asc']
                        ],
                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "pageLength": 20,             
            });

        ISEUtils.portletUnblocking("pageContainer");
	},  

receivedDevDashboardResults:function(dataObj){
    console.log("test exec dataobj length"+dataObj.length);
	console.log("TestCasesInfo length"+testCasesInfo.length);	
		var loopCount = 0;		
        if (ISEUtils.validateObject(dataObj)) {
		 $('#devDashBoardTableId').DataTable().clear().destroy();
              
			  for(var i = 0; i < testCasesInfo.length; i++){			  
			  var newRowContent = "<tr>";                
                 newRowContent += '<td><a href="javascript:;" testCaseid='+testCasesInfo[i].id+' title="Details" class="btn btn-xs blue" onclick="devdashboard._openDetailedViewForSelectedTestCaseID(this)"><i class="glyphicon glyphicon-info-sign"></i></a>';
                 newRowContent += '<a href="javascript:;" testCaseid='+testCasesInfo[i].id+' title="Execution history" onclick="devdashboard._openKibanaGraph(this)" class="btn btn-xs blue"><i class="icon-graph"></i></a></td>';

				var testCaseId = testCasesInfo[i].id;      
                     
                  if(testCaseId.length > 50)
                  {
                    var lastCharacters = testCaseId.slice(-50);
                    var label = "...."+lastCharacters;                   
                    newRowContent += '<td title="'+testCaseId+'">'+label +'</td>';
                  }
                  else
                  {
                       newRowContent += '<td>'+testCasesInfo[i].id +'</td>';
                  }	
				  
				  var statusArray = [];
                  var maxNumberArray = [];

				  var testExecObj = _.where(dataObj, {key: testCaseId});
               if(testExecObj.length >0){
				  for(var j=0; j < testExecObj[0].status.buckets.length;j++){
                   statusArray.push(testExecObj[0].status.buckets[j]);
                   maxNumberArray.push(testExecObj[0].status.buckets[j].maxdate.value);
                  }
				  
				if(maxNumberArray.length == 1 && statusArray.length == 1)
				  {              
					  if(maxNumberArray[0] == null || maxNumberArray[0] == undefined){
					  maxNumberArray[0] = "NA";
					  }
					  newRowContent += "<td>"+statusArray[0].key+"</td>";

					  if(statusArray[0].key.toLowerCase() == "passed")
						  newRowContent += "<td>"+maxNumberArray[0]+"</td>";
					  else
						  newRowContent += "<td>NA</td>";

					 if(statusArray[0].key.toLowerCase() == "failed")
						newRowContent += "<td>"+maxNumberArray[0]+"</td>";
					 else 
						newRowContent += "<td>NA</td>";
					  
					  newRowContent += "<td>"+testExecObj[0].doc_count+"</td>";

					if(statusArray[0].key.toLowerCase() == "passed")
						  newRowContent += "<td>"+statusArray[0].doc_count+"</td>";
					else
						newRowContent += "<td>0</td>";

					 if(statusArray[0].key.toLowerCase() == "failed")
						newRowContent += "<td>"+statusArray[0].doc_count+"</td>";
					 else 
						newRowContent += "<td>0</td>";
						
					if((statusArray[0].key.toLowerCase() != "failed") && (statusArray[0].key.toLowerCase() != "passed"))
						newRowContent += "<td>"+statusArray[0].doc_count+"</td>";
					 else 
						newRowContent += "<td>0</td>";  
				   }
				else{                    
                      Array.prototype.max = function() {
                          return Math.max.apply(null, this);
                        };
						var maxNumber = maxNumberArray.max();

						var filteredObject = $(statusArray).filter(function( idx ) {
						return statusArray[idx].maxdate.value === maxNumber ;
						});				
                 
				      //newRowContent += "<td>"+filteredObject[0].key+"</td>";
					  if(filteredObject[0] != null && filteredObject[0] !=  undefined && filteredObject[0].key != null && filteredObject[0].key != undefined){
							newRowContent += "<td>"+filteredObject[0].key+"</td>";
						}else{
							newRowContent += "<td>NA</td>";
						  }
				 
					    var lastPassed = "NA";
						var lastFailed = "NA";
						var passedCount = 0;
						var failedCount = 0;
						var otherStatusCount = 0;					
							
						for(x=0;x<statusArray.length;x++) {
							if(statusArray[x].key.toLowerCase() == "passed") {
								//newRowContent += "<td>"+statusArray[x].maxdate.value+"</td>";
								if(statusArray[x].maxdate.value != null && statusArray[x].maxdate.value != undefined){
									lastPassed = statusArray[x].maxdate.value;
								}
								else{
									lastPassed = "NA";
								}if(statusArray[x].doc_count != null && statusArray[x].doc_count != undefined){
									passedCount = statusArray[x].doc_count;
								}
								else{
									passedCount = 0;
								}
								//lastPassed = statusArray[x].maxdate.value;
								//passedCount = statusArray[x].doc_count;
							}
							if(statusArray[x].key.toLowerCase() == "failed"){
								if(statusArray[x].maxdate.value != null && statusArray[x].maxdate.value != undefined){
									lastFailed = statusArray[x].maxdate.value;
								}else{
									lastFailed = "NA";
								}
								if(statusArray[x].doc_count != null && statusArray[x].doc_count != undefined){
									failedCount = statusArray[x].doc_count;
								}else{
									failedCount = 0;
								}
								//failedCount = statusArray[x].doc_count;
							}
							if((statusArray[x].key.toLowerCase() != "failed") && (statusArray[x].key.toLowerCase() != "passed")){
								otherStatusCount = statusArray[x].doc_count;
							}
						  }								  
						 newRowContent += "<td>"+lastPassed+"</td>";
						 newRowContent += "<td>"+lastFailed+"</td>";
						 newRowContent += "<td>"+testExecObj[0].doc_count+"</td>";
						 newRowContent += "<td>"+passedCount+"</td>";
						 newRowContent += "<td>"+failedCount+"</td>"; 
						 newRowContent += "<td>"+otherStatusCount+"</td>";  				 
                    }
				}
				else{
				  newRowContent += "<td>NA</td>";
				  newRowContent += "<td>NA</td>";
				  newRowContent += "<td>NA</td>";
				  newRowContent += "<td>NA</td>";
				  newRowContent += "<td>0</td>";
				  newRowContent += "<td>0</td>";
				  newRowContent += "<td>0</td>";
				}
				if(testCasesInfo[i].priority == null || testCasesInfo[i].priority == undefined || testCasesInfo[i].priority == "unspecified"){
						newRowContent += "<td>NA</td>";
				}else if(testCasesInfo[i].priority == ""){
						newRowContent += "<td>No Priority</td>";
				}else{
						newRowContent += "<td>"+testCasesInfo[i].priority+"</td>";						
				}				
                newRowContent +="</tr>";
				loopCount++;
                $('#devDashBoardTableBody').append(newRowContent);		  
			  }
			  console.log("loopCount"+loopCount);
		}
		else{
			$('#devDashBoardTableId').DataTable().clear().destroy();
			}
			var oTable = $('#devDashBoardTableId').dataTable({
                //"dom": 'frtTip',
              
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

                "columnDefs": [{
                    "orderable": false,
                    "targets": [0]
                },

                 { "width": "7%", "targets":0 }, 
                 { "width": "5%", "targets":2 },
                 { "width": "5%", "targets":3 },
                 { "width": "5%", "targets":4 },
                 { "width": "5%", "targets":5 },
                 { "width": "5%", "targets":6 },
                 { "width": "5%", "targets":7 }

                ],
               "order": [
                          [2, 'asc']
                        ],
                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "pageLength": 20,
             
            });

        devdashboard.loadPriorityInfo();
		devdashboard.loadAutomationInfo();
        ISEUtils.portletUnblocking("pageContainer");
	},      

    _openDetailedViewForSelectedTestCaseID:function(event){       

         var defectID = $(event).attr('testCaseid');

          localStorage.setItem("IdVal", defectID);                         
         localStorage.setItem("collectionName", "testcase_collection");
        localStorage.setItem("type", "testcase");  
         
         var sourceURL = '/DevTest/services/DetailTabs.html';            

         $('#detailedViewIFrame').attr('src', sourceURL);     

        $('#detailedViewWindow').modal("show");

    },
   
   _openKibanaGraph:function(event){
   
		var defectID = $(event).attr('testCaseid');
	
    var sourceURL = "/DevTest/dashboard/index.html#/dashboard/TestExecutionsHistory/?embed&title:TestExecutionsHistory&_g=(time:(from:now-10y,mode:quick,to:now))&_a=(filters:!(),query:(query_string:(analyze_wildcard:!t,query:'testcaseid:\""+defectID+"\"')))&hidebar=1";       

     $('#showKibanaViewIframe').attr('src', sourceURL);  
     $('#kibanaViewWindow').modal("show");
   },
   receivedTestCaseResults:function(data){
	testCasesInfo = data;
	for(var m = 0; m < testCasesInfo.length; m++){
	if(devdashboard.automationInfo.indexOf(testCasesInfo[m].automation) == -1){			
			devdashboard.automationInfo.push(testCasesInfo[m].automation);
			}
	if(devdashboard.priorityInfo.indexOf(testCasesInfo[m].priority) == -1){	       
			devdashboard.priorityInfo.push(testCasesInfo[m].priority);
			}			
	}	
	 var selectedVerionID = localStorage.getItem('releaseId');
	 var requestObject = new Object();
        requestObject.collectionName = "test_executions_collection";
        requestObject.searchString = "release:\""+selectedVerionID+"\"";
        requestObject.projectName = localStorage.getItem('projectName');       
        ISE.getTestCaseFeaturesForDevDashboard(requestObject, devdashboard.receivedDevDashboardResults);
		localStorage.setItem("collectionName", "testcase_collection");
        localStorage.setItem("type", "testcase");  
		},		
		
	loadPriorityInfo:function(){
	console.log(devdashboard.priorityInfo);	
	$('#priorityDropdown').empty();
	var selectPriorityData = $('#priorityDropdown');			
			var newOptionContent = '';
			var newOptionContentAll ='<option value="All"> All </option>'
			selectPriorityData.append(newOptionContentAll);
			for(var k=0; k<devdashboard.priorityInfo.length; k++) {
				var fData = devdashboard.priorityInfo[k];
				newOptionContent = '<option value="' 
				newOptionContent += fData + '">'+fData + '</option>';
				selectPriorityData.last().append(newOptionContent);
			}
	},
	
	loadAutomationInfo:function(){
	console.log(devdashboard.automationInfo);	
	$('#automationDropdown').empty();
	var selectAutomationData = $('#automationDropdown');			
			var newOptionContent = '';
			var newOptionContentAll ='<option value="All"> All </option>'
			selectAutomationData.append(newOptionContentAll);
			for(var n=0; n<devdashboard.automationInfo.length; n++) {
				var fData = devdashboard.automationInfo[n];
				newOptionContent = '<option value="' 
				newOptionContent += fData + '">'+fData + '</option>';
				selectAutomationData.last().append(newOptionContent);
			}
	}
		
  };
