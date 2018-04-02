var reportknowledgeassignation = {

	 reportknowledgeassignation_table:'',
	jsonTableDetails:[],
	columnListDetailsArray:{},
	mobileViewTableColumnCollection:[],
	hideTableColumns:[],
	crIdFileds:[],
	requestSearchCount:9999,
	json_doc_data: {},
	docDetails:{},
	tableJSON:'reportknowledgeassignationTable',
	statusOptionsArray: ['Not-Started','In-Progress','Completed'],
	completenessOptionsArray: ['0%','10%','25%','50%','75%','100%'],
	storeAllSelecvtOptions:[],
	GetAllKnowledgeStoreData:[],
	KnowledgeStatusCompletenessChanged:[],
	packageID:'',
	packageDataRowID:'',
	searchObj: new Object(),
	actionsRef:'',
    selectedUser:'',
    selectedStatus:'',
    /* Init function  */
    init: function() {
		
		reportknowledgeassignation._fillDropDownAndCreateDataTableHeading();
        reportknowledgeassignation._initReviewerData();
		
		$('#searchContainer #searchLocalDoc').on ('keyup', reportknowledgeassignation._filterInternal);

	    $("#page_reportknowledgeassignation #addNewContentDoc").on('click', function (e) {
			console.log("This is function is for  Add New Content Document. TODO");
		});
		$("#page_reportknowledgeassignation #docPrint").on('click', function (e) {
			console.log("This is function is for Print Document. TODO");
		});
		$("#page_reportknowledgeassignation #exportToPDF").on('click', function (e) {
			console.log("This is function is for Export to PDF. TODO");
		});
		$("#page_reportknowledgeassignation #exportToExcel").on('click', function (e) {
			console.log("This is function is for Export to Excel. TODO");
		});

        $( "#page_reportknowledgeassignation #selectUsers" ).change(function() {
          reportknowledgeassignation.selectedUser = $(this).val();
          reportknowledgeassignation.refreshdata();
          
        });
         $( "#page_reportknowledgeassignation #sortDropdown" ).change(function() {
           reportknowledgeassignation.selectedStatus= $(this).val();
           reportknowledgeassignation.refreshdata();
        });
		
		Array.prototype.allValuesSame = function() {
			for(var i = 1; i < this.length; i++)
			{
				if(this[i] !== this[0])
					return false;
			}
				return true;
		};
		//Defining role to enable Delete and Add to knoledge package.
		
		reportknowledgeassignation._allowPermission(reportknowledgeassignation.userRole); 
		reportknowledgeassignation.onLoadActionComponent();
    },
	
	reinit:function()
	{
		
		reportknowledgeassignation.actionsRef._setCurrentPage(ikePageConstants.MY_ACCOMPLISHMENTS);
		reportknowledgeassignation.actionsRef._setTargetPage(ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
		reportknowledgeassignation._initMyAccomplishmentPage();
	},
		
	refreshdata: function(){
		
		reportknowledgeassignation._initMyAccomplishmentPage();
		
	},
    _initReviewerData: function()
	{
		reportknowledgeassignation._getuserList(reportknowledgeassignation._receivedUsers);				
	},

    _getuserList: function (callBackFunction) {
        var respJson;
        var jsondata = { username: localStorage.getItem('username'), operation: 'list' };
        var serviceName = 'JscriptWS';
        var hostUrl = '/DevTest/rest/';
        var methodname = 'userManagement';
        var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' +
                                localStorage.projectName + '&sname=' + methodname;
        $.ajax({
            type: "POST",
            url: Url,
            async: true,
            data: JSON.stringify(jsondata),
            success: function (msg) {
                respJson = msg;
                resultsData = JSON.parse(msg);
                console.log(resultsData)
                callBackFunction(resultsData);
            },
            error: function (msg) {      
                console.log("failure");
            }
        });
    },
	
	_receivedUsers: function(data)
	{


       $("#page_reportknowledgeassignation #selectUsers").empty();
	   var listData='<option value="">Select...</option>';
		for(var i=0; i<data.users.length; i++){
			var fData = data.users[i].email;
			if (fData != '')
				listData += ' <option value="'+fData+'">'+fData+'</option>';
		 }
		 
		$("#page_reportknowledgeassignation #selectUsers").append(listData);
			
		
	},

	
	 _initMyAccomplishmentPage: function(){

		var username = localStorage.getItem('username');
		var getCurrentSelectedTabData = reportknowledgeassignation.columnListDetailsArray;
		reportknowledgeassignation._fillColumnListinDropdown(getCurrentSelectedTabData.dropDownBoxId, getCurrentSelectedTabData.tableID, getCurrentSelectedTabData.defaultView, getCurrentSelectedTabData.itemDetailsfields);
					
		reportknowledgeassignation.searchObj.type = "similar";
			
		//var objTemp=document.getElementById("sortDropdown");
		var selectedvalue = reportknowledgeassignation.selectedStatus;

        //var objuser =document.getElementById("selectUsers");
        var selectedUser = reportknowledgeassignation.selectedUser;

        if(!selectedUser)
           selectedUser ="";
         

		if(selectedvalue=="" && selectedUser=="" )
        {
			reportknowledgeassignation.searchObj.input ="*";
        }
        else if (selectedvalue!="" && selectedUser=="" )
        {
          reportknowledgeassignation.searchObj.input = "status:" + selectedvalue;
        }
         else if (selectedvalue=="" && selectedUser!="" )
        {
          reportknowledgeassignation.searchObj.input = "assignedto : " + selectedUser;
        }
		else if (selectedvalue!="" && selectedUser!="" ) 
	     {
           
          reportknowledgeassignation.searchObj.input = "assignedto : " + selectedUser  + " && status:" + selectedvalue;
             

        }
		
		reportknowledgeassignation.searchObj.indexes = "assignation_collection";
		reportknowledgeassignation._processSearchRequest(true); 
		
	},
	_updateURL: function() {
		var s = JSON.stringify(reportknowledgeassignation.searchObj, reportknowledgeassignation._encodeSpecialText);
		var newURL = window.location.protocol + "//" + window.location.host;
		newURL = newURL + window.location.pathname + "?SearchObj=" + s + "#reportknowledgeassignation";
		history.pushState("test", "test", newURL);
	},
	
	_processSearchRequest: function(updateURL) {
		console.log('~~~~~ _processSearchRequest  ~~~~~ ');
		
		if( reportknowledgeassignation.searchObj.lastSearch) {
			if ( (Date.now() - reportknowledgeassignation.searchObj.lastSearch) < 1500) {
				console.log("Trying to search within 1.5 seconds again, there is some bug in your code !! performing no search");
				return;
			}
		}
		reportknowledgeassignation.searchObj.lastSearch = Date.now();
		
		if (updateURL) {
			reportknowledgeassignation._updateURL();
		}

		if(localStorage.getItem('rolename') != 'Admin')
		{
			var username = localStorage.getItem('username');
			reportknowledgeassignation.searchObj.input = "user : " + username ;
		}
		
		if (reportknowledgeassignation.searchObj.type == 'context') {

			var requestObject = new Object();

			requestObject.title = reportknowledgeassignation.searchObj.input.replace(/\//g, " ");
			requestObject.searchString = requestObject.title;
			requestObject.filterString = requestObject.searchString;
			requestObject.projectName = localStorage.getItem('multiProjectName');
			requestObject.maxResults = reportknowledgeassignation.requestSearchCount;
			requestObject.serachType = "conextsearch";
			
			

			var collectionName = reportknowledgeassignation.searchObj.indexes;
			requestObject.collectionName = collectionName;
			ISE.getSearchResults(requestObject, reportknowledgeassignation._receivedSearchResults);
		
			
		}
		else
		{
			var requestObject = new Object();
			requestObject.title = reportknowledgeassignation.searchObj.input.replace(/\//g, " ");
			requestObject.searchString = requestObject.title;
			requestObject.filterString = requestObject.searchString;
			requestObject.projectName = localStorage.getItem('multiProjectName');
			requestObject.maxResults = reportknowledgeassignation.requestSearchCount;
			requestObject.serachType = "similar";

			var collectionName = reportknowledgeassignation.searchObj.indexes;
			requestObject.collectionName = collectionName;
			ISE.getSearchResults(requestObject, reportknowledgeassignation._receivedSearchResults);               
		}
		
		//reportknowledgeassignation._processDetailsSearchRequest(true);
	},
	
	_allowPermission: function(user_role){
		
		switch(user_role){
			case 'manager':
				 
				 
			break;
			case 'admin':
				 
				 
			break;
		}
	},
	 
	_fillDropDownAndCreateDataTableHeading: function() {

		var roleName = localStorage.getItem('rolename');
		
		
		$.getJSON("json/"+reportknowledgeassignation.tableJSON+".json?"+Date.now(), function(data) {
 
			reportknowledgeassignation.jsonTableDetails = data;
			reportknowledgeassignation.columnListDetailsArray = {};
			$.each(data.TableDetails, function(key, item) {
			 
				//  Filter Search List will be added based on role.
				if (item.enable == "yes") {

					for (var i = 0; i < item.allowedroles.length; i++) {

						if (item.allowedroles[i] == roleName) {

							var displayName = item.displayName;
							
							$('#page_reportknowledgeassignation .map-table-conatainer').append('<div class="col-sm-12 table-scrollable1 table-responsive"><table class="table table-striped table-bordered table-hover dataTable" id="reportknowledgeassignation"></table></div>')
							$('#page_reportknowledgeassignation #reportknowledgeassignation').append('<thead><tr id="tableheader_'+ displayName +'"></tr></thead><tbody id="tablebody_' + displayName + '"></tbody>');

							//reportknowledgeassignation.listTableId.push('reportknowledgeassignation' + displayName);

							// Set Table Heading for all columns
						 
							$('#page_reportknowledgeassignation .map-table-conatainer #tableheader_' + displayName).append('<th class="table-checkbox"></th>');
							 

							for (var j = 0; j < item.Details.fields.length; j++) {                                

								if(item.Details.fields[j].displayType != "expansion")
								$('#page_reportknowledgeassignation .map-table-conatainer #tableheader_' + displayName).append("<th class='sorting ISEcompactAuto'>" + item.Details.fields[j].displayName + "</th>");
							}
							//Star Rating Column at last
							//$('#tableheader_' + displayName).append("<th class='rating-heading'>Rate</th>");
						   // console.log($('#tableheader_' + displayName))
							
							var dropDownBoxId = "columnToggler_" + displayName;
							var tableID = 'reportknowledgeassignation' ;
							var _obj = new Object();
							_obj.dropDownBoxId = 'MAPColumnTogglerDropdown';//dropDownBoxId;
							_obj.tableID = tableID;
							_obj.defaultView = item.defaultView;
							_obj.itemDetailsfields = item.Details.fields;
							_obj.indexes = item.indexName;
							_obj.displayName = displayName;
							
							reportknowledgeassignation.columnListDetailsArray = _obj;
							//defectsearch._fillColumnListinDropdown(dropDownBoxId, tableID, item.defaultView, item.Details.fields);

							reportknowledgeassignation.mobileViewTableColumnCollection.push({
								"tableID": 'reportknowledgeassignation',
								"columnsList": item.mobileView,
								"dropdownID": 'columnToggler_' + displayName
							});
							
							
						}
					}
					  
				}
					
					 
			});
			
			var getCurrentSelectedTabData = reportknowledgeassignation.columnListDetailsArray;
			reportknowledgeassignation._fillColumnListinDropdown(getCurrentSelectedTabData.dropDownBoxId, getCurrentSelectedTabData.tableID, getCurrentSelectedTabData.defaultView, getCurrentSelectedTabData.itemDetailsfields);
			var elements = document.querySelectorAll('#page_reportknowledgeassignation .map-table-conatainer #searchKDFilterDropdown label input:checked');
		   Array.prototype.map.call(elements, function(el, i) {
			if(i>0)
			{
			 $(el).removeAttr("checked");
			 var resultsTabId = $(el).attr("resultTabID");
			 var resultsTabInnerContainerID = $(el).attr("resultTabInnerContainerID");
			 $("#page_reportknowledgeassignation .map-table-conatainer #" + resultsTabId).addClass("hide");
			 $("#page_reportknowledgeassignation .map-table-conatainer #" + resultsTabInnerContainerID).removeClass("active in");
			}               
		}); 

					
		reportknowledgeassignation._initMyAccomplishmentPage();
		});
	},
	
	_fillColumnListinDropdown: function(dropDownBoxId, tableID, defaultColumnView, ColumnsList) {

		$('#page_reportknowledgeassignation #' + dropDownBoxId).empty();

		var tempArr = new Array();
		var crIdArr = new Array();

		for (var i = 0; i < ColumnsList.length; i++) {
			if(ColumnsList[i].type!="expansion")
			  tempArr.push(ColumnsList[i].displayName);
			else
			{
				crIdArr.push(ColumnsList[i].fields);                 
			}
		}
	   
		 if(crIdArr[0] != undefined){
		 for(var j=0;j<crIdArr[0].length;j++)
			  {                    
				if(crIdArr[0][j].enable == "yes")
				   reportknowledgeassignation.crIdFileds.push(crIdArr[0][j]); 
			  } 
			  }

	   
		var colunmnID = 0;
		var tableColumnID = 0;
		var tableHideColumns = new Array();
		$.grep(tempArr, function(element) {

			colunmnID = colunmnID + 1;


			if ($.inArray(element, defaultColumnView) !== -1) {

				$('#page_reportknowledgeassignation #' + dropDownBoxId).append('<label><input type="checkbox" name="column" checked="true" columnID=' + colunmnID + '  data-column=' + colunmnID + '>' + element + '</label>');
			} else {

				tableColumnID = colunmnID + 1;
				tableHideColumns.push(parseInt(tableColumnID));
				$('#page_reportknowledgeassignation #' + dropDownBoxId).append('<label><input type="checkbox" name="column"  columnID=' + colunmnID + ' data-column=' + colunmnID + '>' + element + '</label>');

			}

		});

		reportknowledgeassignation.hideTableColumns.push({
			"tableID": tableID,
			"hideColumnsList": tableHideColumns,
			"allColumnsNames": tempArr
		});


		$('#page_reportknowledgeassignation input[type="checkbox"]').change(function() {

		   var iCol = parseInt($(this).attr("data-column"));
			iCol = iCol;
			var oTable = $('#page_reportknowledgeassignation .map-table-conatainer #' + tableID).dataTable();

			var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
			oTable.fnSetColumnVis(iCol, bVis ? false : true);
			var chkVal = $(this).parent().text();
			if(bVis)
				reportknowledgeassignation._insertOrDeleteDefaultTableColValue(chkVal, 'remove');
			else
				reportknowledgeassignation._insertOrDeleteDefaultTableColValue(chkVal, 'insert');
			
			var table_wrapper = $('#page_reportknowledgeassignation .map-table-conatainer #' + tableID+'_wrapper')
			if( table_wrapper.width() > oTable.width() )
			{
				table_wrapper.css('overflow-x', 'visible')
			}else{
				table_wrapper.css('overflow-x', 'none')
			}
			
			////reportknowledgeassignation._resizeRateitColumnHeading();
		});
		$( "#page_reportknowledgeassignation .map-table-conatainer #dataTablePageChange select" ).on('change', function() {
			console.log($( this ).val());
			reportknowledgeassignation.requestSearchCount = $( this ).val();
		});

	},
	
	_insertOrDeleteDefaultTableColValue:function(chkVal, action){
		//for(var i=0; i<reportknowledgeassignation.columnListDetailsArray.length; i++){
			if( reportknowledgeassignation.columnListDetailsArray.displayName){
			 if(action=='insert'){
				reportknowledgeassignation.columnListDetailsArray.defaultView.push(chkVal);
			 }else if(action=='remove'){
				var k = reportknowledgeassignation.columnListDetailsArray.defaultView.indexOf(chkVal);
				if(k != -1) {
					reportknowledgeassignation.columnListDetailsArray.defaultView.splice(k, 1);
				}
			 }
			 reportknowledgeassignation.columnListDetailsArray.defaultView = reportknowledgeassignation._uniqueArray(reportknowledgeassignation.columnListDetailsArray.defaultView);
			}
		//}
		
		 
	},
	
	_receivedSearchResults: function(dataObj) {
		
        if(dataObj.length==0)
        {
                var tableID = '#page_reportknowledgeassignation .map-table-conatainer #reportknowledgeassignation';
				if (tableID) {

					var oTable = $(tableID).dataTable();
					oTable.fnClearTable();
					oTable.fnDestroy();
				}
				
        }

		if (ISEUtils.validateObject(dataObj)) 
		{
			var FieldsMap = {};
			var DisplayNameMap = {};
			var displayColumns = {};
			var tC = {};
			var username = localStorage.getItem('username');
					
						
			
		   reportknowledgeassignation.GetAllKnowledgeStoreData=[];
		   
			for (var i = 0; i < dataObj.length; i++) 
			{
				//if(dataObj[i].assignedto == username)
				//{
					var objKnowledge = new Object();
					objKnowledge.packagename =  dataObj[i].packagename;
					var index = -1 ;
					
					var result = $.grep(reportknowledgeassignation.GetAllKnowledgeStoreData, 
					function(e){ return e.packagename == objKnowledge.packagename; });
					
					if(result.length === 0)
					{	
						if(dataObj[i].Documents === undefined)
						{
							dataObj[i].Documents = new Array();
						}
						dataObj[i].Documents.push(dataObj[i]);
						reportknowledgeassignation.GetAllKnowledgeStoreData.push(dataObj[i]);
					} 												
					else 
					{
						result[0].Documents.push(dataObj[i]);
					}
				//}
				  
			}
			
			dataObj = reportknowledgeassignation.GetAllKnowledgeStoreData;
			
			
			reportknowledgeassignation.json_doc_data = dataObj;
			
			
			
 
			for (var K in reportknowledgeassignation.jsonTableDetails.TableDetails) {
				 var temp = new Array();
				 for(var l=0;l<reportknowledgeassignation.jsonTableDetails.TableDetails[K].Details.fields.length;l++){

				   var obj =reportknowledgeassignation.jsonTableDetails.TableDetails[K].Details.fields[l];
					  if(obj.displayType != "expansion")                          
						 temp.push(obj);                         
				 }

				FieldsMap[reportknowledgeassignation.jsonTableDetails.TableDetails[K].indexName] = temp;
				DisplayNameMap[reportknowledgeassignation.jsonTableDetails.TableDetails[K].indexName] = reportknowledgeassignation.jsonTableDetails.TableDetails[K].displayName;
				displayColumns[reportknowledgeassignation.jsonTableDetails.TableDetails[K].indexName] = reportknowledgeassignation.jsonTableDetails.TableDetails[K].defaultView;
			}

			var sortField = 1;
			var fields = FieldsMap[dataObj[0]._index];


			for (var i = 0; i < dataObj.length; i++) {
			
				var issimilarDefectId = false;

				var fields = FieldsMap[dataObj[i]._index];
				var dName = DisplayNameMap[dataObj[i]._index];
				var tableID = '#page_reportknowledgeassignation .map-table-conatainer #reportknowledgeassignation';
				if (!tC[tableID]) {

					var oTable = $(tableID).dataTable();
					oTable.fnClearTable();
					oTable.fnDestroy();
				}
				tC[tableID] = 1;

				var documentIdColumnName = "_id";
				var indexCollectionname = "_index";				  
				var sourceLineURL="sourceline";
				var row_inc = (i+1);
				   
				var newRowContent = '<tr><td id="addExpand"><span class="row-details row-details-close"></span></td>';
					 
				for (var ii = 0; ii < fields.length; ii++) {

					var documentID = escape(dataObj[i][documentIdColumnName]);
					var simplifyURL = (dataObj[i]["simplifyURL"]);
					var indexCollection = escape(dataObj[i][indexCollectionname]); 
					var sourceLine = escape(dataObj[i][sourceLineURL]);						  

					if(documentID === undefined)
					{
						newRowContent += '<td class="ISEcompactAuto"><span sourceLine="null" packageId="null" indexCollection="null" requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';
					}
					else
					{
						if(fields[ii].displayType.toLowerCase() == "date")                           
						{
							var dateObj = dataObj[i][fields[ii].SourceName];
							var newDateObj = new Date(dateObj);									 
							newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' indexCollection='+indexCollection+' packageId='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + newDateObj + '</span></td>';
						} 
						else if(fields[ii].displayType.toLowerCase() == "string" || fields[ii].displayType.toLowerCase() == "url" || fields[ii].displayType.toLowerCase() == "download")
						{
							String.prototype.replaceAll = function(target, replacement) {
								return this.split(target).join(replacement);
							};
							var textContent = dataObj[i][fields[ii].SourceName];
								
							if(undefined !=textContent && 'undefined' != textContent && typeof subTextContent !== "number")
							{
								textContent = textContent.replaceAll('&nbsp;','<br>');
								textContent = textContent.replaceAll("<em class='iseH'>",'##');
								textContent = textContent.replaceAll("</em>","#");
							}
							if(textContent == '' || textContent == 'undefined' || textContent == undefined || textContent.length == 0)
							{
								newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' indexCollection='+indexCollection+' packageId='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '> No data </span></td>';
							}
							else if(textContent.length > 0 && textContent)
							{
								if(fields[ii].displayType.toLowerCase() == "url")
									var subTextContent = textContent.substring(0,18);
								else
									var subTextContent = textContent.substring(0,100);
																
								if(typeof subTextContent !== "number")
								{
									subTextContent = subTextContent.replaceAll('<br>','&nbsp;');
									subTextContent = subTextContent.replaceAll('##','<em class="iseH">');
									subTextContent = subTextContent.replaceAll("#","</em>");
								}
								
								var escapeContent = escape(textContent);
								
								if(textContent.length >= 0 && fields[ii].displayType.toLowerCase() == "url")
								{
									newRowContent += '<td class="ISEcompactAuto"><span class="glyphicon glyphicon-folder-open"> <span title="'+escapeContent+'" packageId="'+documentID+'" sourceLine="'+sourceLine+'" indexCollection="'+indexCollection+'" requiredfilter="' + fields[ii].filter + '" displaytype="'+ fields[ii].displayType +'" desc-data="'+escapeContent+'"><a href="javascript:;" packageId="'+documentID+'" id="mkpTitleRow"> ' +subTextContent+ ' </a></span></td>';
								}
								else if(textContent.length > 0 && textContent.length < 100)
								{
									newRowContent += '<td class="ISEcompactAuto"><span sourceLine="'+sourceLine+'" indexCollection="'+indexCollection+'" packageId="'+documentID+'" requiredfilter="' + fields[ii].filter + '" displaytype="'+ fields[ii].displayType +'" desc-data="'+escapeContent+'"> ' + subTextContent + ' </span></td>';
								}
								else
								{
									newRowContent += '<td class="ISEcompactAuto"><span sourceLine="'+sourceLine+'" indexCollection="'+indexCollection+'" packageId="'+documentID+'" requiredfilter="' + fields[ii].filter + '" displaytype="'+ fields[ii].displayType +'" desc-data="'+escapeContent+'"> ' +subTextContent+' <a modalTitle="'+fields[ii].displayName+'"  moreTextContent="' + escapeContent + '" class="name" onClick="reportknowledgeassignation._onExpandRowMoreContentModal(this)">  more... </a></span></td>';
								}
							}											
						}
						else
						{
							newRowContent += '<td class="ISEcompactAuto"><span sourceLine="'+sourceLine+'" indexCollection="'+indexCollection+'" packageId="'+documentID+'" requiredfilter="' + fields[ii].filter + '" displaytype="' + fields[ii].displayType + '">' + dataObj[i][fields[ii].SourceName] + '</span></td>';
						}
					}
				}
				 
				newRowContent += '</tr>';				
				$('#page_reportknowledgeassignation .map-table-conatainer #tablebody_' + dName).append(newRowContent);				
			}

			for (var tab in tC) 
			{
					
				var tableColumnsCount = $(tab).find('tr')[0].cells.length;
				var tempArr = new Array();
				for(var i=1;i<tableColumnsCount;i++){
					tempArr.push(i);                    
				}
				reportknowledgeassignation._handleUniform();
				reportknowledgeassignation.knowledgeaddpackage_table =  $('#page_reportknowledgeassignation .map-table-conatainer #reportknowledgeassignation').DataTable({
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
					"dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>r>t<'row'<'col-md-12 col-sm-12'p><'col-md-7 col-sm-12'>>",
					"bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

					"columnDefs": [{
						"orderable": false,
						"targets": [0]
					}],
					"lengthMenu": [
						[5, 15, 20, -1],
						[5, 15, 20, "All"] // change per page values here
					],
					"order": [
						[sortField, 'desc']
					],
					
					// set the initial value
					"pageLength": 5,
					"language": {
						"emptyTable": "No data available in table",
						"infoEmpty": "No entries found",
						"info": "Showing _START_ to _END_ of _TOTAL_ Rows",
						"lengthMenu": " _MENU_ Rows per page",
						"paging": {
							"previous": "Prev",
							"next": "Next",
							"last": "Last",
							"first": "First"
						}
					},
					"autoWidth": true
				});
				
				var total_rec_count = $("#page_reportknowledgeassignation .map-table-conatainer #reportknowledgeassignation").DataTable().page.info().recordsTotal;
				$('#page_reportknowledgeassignation #docActionContainer .kwdg-store-doc-count').text(total_rec_count+' Results')
				 
				$("#page_reportknowledgeassignation .map-table-conatainer tbody #mkpTitleRow").live('click', function(e){					 
					var __knowledgePackageData = new Object();
					__knowledgePackageData.package_id = $(this).attr("packageId");
					__knowledgePackageData.package_title = $(this).text();
					__knowledgePackageData.Documents = reportknowledgeassignation._getSelectedSubTableDetails(__knowledgePackageData.package_id);
					__knowledgePackageData.addType = "existing";
					localStorage.removeItem('selectedKnowledgePackage');
					localStorage.setItem('selectedKnowledgePackage', JSON.stringify(__knowledgePackageData));
					$(location).attr('hash','#knowledgeaddpackage');
				});
				
				$("#page_reportknowledgeassignation .map-table-conatainer tbody #kdMoreInfoBtn").live('click', function(e){
					console.log("e: ~~~ "+e);
					console.log($(this).attr("doc-id"));
					 
					var docID = $(this).attr("doc-id");
					reportknowledgeassignation.docDetails = reportknowledgeassignation._getDocDetails(docID)
					$("#page_reportknowledgeassignation .map-table-conatainer #popover_container .popover-heading").text(reportknowledgeassignation.docDetails.title);
					 
					$("[data-toggle=popover]").popover({
						html : true,
						container: '#page_reportknowledgeassignation .map-table-conatainer #popover_container',
						title:function() {
						  var title = $(this).attr("data-popover-content");
						  return $(title).children(".popover-heading").html();
						},
						content: reportknowledgeassignation._getPopoverBodyContent(reportknowledgeassignation.docDetails)
					});					
				}); 			

				$(tab+"_wrapper").css('overflow-x', 'hidden');
				if( $(window).width() < 500 ) {
					$(document).scrollTop($('#searchResultsTable').offset().top);
					$(tab+"_wrapper").css('overflow-x', 'auto');
				}
				
				$(tab).unbind('click');
				$(tab).on('click', ' tbody td .row-details', function(event) {
					var nTr = $(this).parents('tr')[0];
					var tID = $(this).closest('table').attr('id');

					var cols = [];
					cols = reportknowledgeassignation._getColumnNamesList(tID);//todo
					
					var oTable = $('#page_reportknowledgeassignation .map-table-conatainer #' + tID).dataTable();

					if (oTable.fnIsOpen(nTr)) {
						/* This row is already open - close it */
						$(this).addClass("row-details-close").removeClass("row-details-open");
						oTable.fnClose(nTr);
					} else {
						// Open this row 
						$(this).addClass("row-details-open").removeClass("row-details-close");
						oTable.fnOpen(nTr, reportknowledgeassignation._fnDefectSearchRowFormatDetails(oTable, nTr, cols), 'details');//todo						
					}

				});

			}

			for (var i = 0; i < reportknowledgeassignation.hideTableColumns.length; i++) {
				var iTD = '#page_reportknowledgeassignation .map-table-conatainer #' + reportknowledgeassignation.hideTableColumns[i].tableID;
				if (!tC[iTD]) continue;
				
				var table = $(iTD).DataTable();
				
				var tempstr = reportknowledgeassignation.columnListDetailsArray.dropDownBoxId;
				console.log(tempstr)
				
				for (var j = 0; j < reportknowledgeassignation.hideTableColumns[i].hideColumnsList.length; j++) {

					var columnID = reportknowledgeassignation.hideTableColumns[i].hideColumnsList[j] - 1;                      
					table.column(columnID).visible(false, false);
					$('#page_reportknowledgeassignation .map-table-conatainer #columnToggler_'+tempstr+' input[columnid='+columnID+']').attr('checked', false)
				}
			}
			
			$('#page_reportknowledgeassignation .map-table-conatainer #searchResultsTable').removeClass("hide");

			reportknowledgeassignation.searchResultsReceived = true;


			//  Hide Table rows dropdown and Table Search
			$("div").find("#page_reportknowledgeassignation .map-table-conatainer .dataTables_length").addClass('hidden-sm hidden-xs');
			$("div").find("#page_reportknowledgeassignation .map-table-conatainer .dataTables_filter").addClass('hidden-sm hidden-xs');

			var windowWidth = $(window).width();
			if (windowWidth <= 400) {
				reportknowledgeassignation.onResizeWindow();//todo
				$("html, body").animate({
					scrollTop: $(document).height()
				}, 1000);
			}			
		}
		
		$("#page_reportknowledgeassignation .map-table-conatainer #addExpand").css("width", "3.40%");
		var sourceCodeTableRowCount = $('#page_reportknowledgeassignation .modal-body .table-containerr #sample_4_SourceCode tbody').children().length;      
		ISEUtils.portletUnblocking("pageContainer");

		Pace.stop();		 
	},
	
	/* Formatting function for defect search results row expanded details */
	_fnDefectSearchRowFormatDetails: function(oTable, nTr, cols) {
		var roleName = localStorage.getItem('rolename');
		var aData = oTable.fnGetData(nTr);
		var selectedID = $(aData[1]).text().trim();
		var columnNames = [];
		var subTableDetails = reportknowledgeassignation._getSelectedSubTableDetails(selectedID);
		var sOut='';
		$.each(reportknowledgeassignation.jsonTableDetails.SubTableDetails, function(key, item) {			 
			//  Filter Search List will be added based on role.
			if (item.enable == "yes") {
				for (var i = 0; i < item.allowedroles.length; i++) {
					if (item.allowedroles[i] == roleName) {
						var displayName = item.displayName;
						sOut = '<div class="col-sm-12 table-scrollable1 table-responsive"><table class="table table-striped table-bordered table-hover dataTable" id="mkpSubTableData"> <thead><tr id=tableheader_"' + displayName + '">'							
						sOut += "<th class='sorting ISEcompactAuto'></th>";
						for (var j = 0; j < item.Details.fields.length; j++) {                                
							
							if(item.Details.fields[j].displayType != "expansion"){
								sOut += "<th class='sorting ISEcompactAuto'>" + item.Details.fields[j].displayName + "</th>";
								var colDetails = new Object();
								colDetails.name = item.Details.fields[j].SourceName;
								colDetails.type = item.Details.fields[j].displayType;
								columnNames.push(colDetails);
							}
						}							
						sOut +='</tr></thead><tbody id=tablebody_"' + displayName +' ">'+reportknowledgeassignation._renderSubTable(subTableDetails, columnNames)+'</tbody></table></div>'							
					}
				}					  
			}
		});
		return sOut;
	},
	
	_getColumnNamesList: function(tableID) {
		for (var i = 0; i < reportknowledgeassignation.hideTableColumns.length; i++) {
			if(reportknowledgeassignation.hideTableColumns[i].tableID == tableID)
				return reportknowledgeassignation.hideTableColumns[i].allColumnsNames; // Returns Array

		}
    },
	/* Formatting function for row expanded details */
	_fnMyAccomRowFormatDetails: function(oTable, nTr, cols) {
		var roleName = localStorage.getItem('rolename');
		 var aData = oTable.fnGetData(nTr);
		var selectedID = $(aData[1]).text();
		reportknowledgeassignation.packageID = $(aData[1]).text();
		reportknowledgeassignation.packageDataRowID = $(nTr).attr('data-row-id');
		var columnNames = [];
		var subTableDetails = reportknowledgeassignation._getSelectedSubTableDetails(selectedID);
		var sOut='';
		$.each(reportknowledgeassignation.jsonTableDetails.SubTableDetails, function(key, item) {
			 
				//  Filter Search List will be added based on role.
				if (item.enable == "yes") {

					for (var i = 0; i < item.allowedroles.length; i++) {

						if (item.allowedroles[i] == roleName) {

							var displayName = item.displayName;
							
							
							sOut = '<div class="col-sm-12 table-scrollable1 table-responsive"><table class="table table-striped table-bordered table-hover dataTable" id="mapSubTableData"> <thead><tr id=tableheader_"' + displayName + '">'
							//
							//reportknowledgeassignation.listTableId.push('reportknowledgeassignation' + displayName);

							// Set Table Heading for all columns
						 
							$('#page_reportknowledgeassignation .map-table-conatainer #tableheader_' + displayName).append('<th class="table-checkbox"><input type="checkbox" name="group-checkable" class="group-checkable" data-set="#page_reportknowledgeassignation .map-table-conatainer #reportknowledgeassignation .checkboxes"/></th>');
							 
							sOut += "<th class='sorting ISEcompactAuto'></th>";
							for (var j = 0; j < item.Details.fields.length; j++) {                                
								
								if(item.Details.fields[j].displayType != "expansion"){
									sOut += "<th class='sorting ISEcompactAuto'>" + item.Details.fields[j].displayName + "</th>";
									columnNames.push(item.Details.fields[j].SourceName)
								}
							}
							
							sOut +='</tr></thead><tbody id=tablebody_' + displayName +' ">'+reportknowledgeassignation._renderSubTable(subTableDetails, columnNames)+'</tbody></table></div>'
							
						}
					}
					  
				}
					
					 
			});
		 
		 
			   
		return sOut;
	},
	_getSelectedSubTableDetails: function(packagename){
		for(var i=0; i<reportknowledgeassignation.json_doc_data.length; i++){
			if(packagename == reportknowledgeassignation.json_doc_data[i].packagename)
				return reportknowledgeassignation.json_doc_data[i].Documents;
		}
	},


	
	_renderSubTable: function(table_details, column_details){
		
		var sTR = '<tr>'
		
		for(var i=0; i<table_details.length; i++){
			
			
			var sTD = '<td class="ISEcompactAuto"><span class="glyphicon glyphicon-folder-close"> </span></td>'
			
			
			for(var j=0; j<column_details.length; j++){	
			
				var display_id = table_details[i]['_id'];
				var display_id = table_details[i]['_id'];
				if(column_details[j].type.toLowerCase() == 'url')
				{ 
					var temp=table_details[i]["_id"];
					sTD +='<td class="ISEcompactAuto"><span title="'+table_details[i][column_details[j].name]+'"  displaytype="string"><a href="javascript:;"   doc-id="'+table_details[i]['_id']+'" onclick="reportknowledgeassignation.documentClickHandler(this)" id="kdTitleRow_'+ temp + '">'+table_details[i][column_details[j].name]+'</a></span></td>'
                					
				}
				else if(column_details[j].name == 'status')
				{
				 	sTD +='<td class="ISEcompactAuto" >'+reportknowledgeassignation.renderCombobox( table_details[i]['_id'],column_details[j].name,display_id, table_details[i][column_details[j].name], reportknowledgeassignation.statusOptionsArray)+'</td>'
                    //sTD +='<td class="ISEcompactAuto" >'+ table_details[i][column_details[j].name +'</td>'
                    
				}
				else if(column_details[j].name == 'completeness')
					sTD +='<td class="ISEcompactAuto">'+reportknowledgeassignation.renderCombobox(table_details[i]['_id'],column_details[j].name,display_id, table_details[i][column_details[j].name], reportknowledgeassignation.completenessOptionsArray)+'</td>'

                else //if(column_details[j].name == 'assignedto')
					sTD +='<td class="ISEcompactAuto">'+ table_details[i][column_details[j].name] +'</td>'

				
			}			
			sTR += sTD+"</tr>";
		}
		sTR +="</tr>"
		return sTR;
	},
	renderCombobox: function(docid,display_name,display_id, selected_val, options_array){

   return selected_val;

//		var class_name = 'single-select-'+display_name+'-'+display_id;
//		var htmlData = '<select doc-id="'+docid+'" display-name="'+display_name+'" display-id="'+display_id+'" id="'+display_name+'" class="form-control '+class_name+'">';
//		htmlData += '<option value="None">Select</option>';
//		for(var i=0; i<options_array.length; i++){
//			var selected = "";
//			(options_array[i] == selected_val)? selected="selected":"";
//			htmlData += ' <option value="'+options_array[i]+'"'+selected+'>'+options_array[i]+'</option>';
//		}
//		htmlData += '</select>';
//		reportknowledgeassignation.onChangeSingleSelect(class_name);
//		return htmlData;
	},
	onChangeSingleSelect:function (class_name){
		$("."+class_name).live('change', function(e){
			var DisplayName = $(this).attr('display-name');
			var DisplayID = $(this).attr('display-id');
			var DocId = $(this).attr('doc-id');
			var selectedVal = $(this).val();
			var class_nameStatus='';
			var class_nameCompleteness='';
			var selectedStatusvalue='';
			var selectedCompletenessvalue='';
			
			
			class_nameCompleteness = 'single-select-completeness-'+DisplayID;
			class_nameStatus= 'single-select-status-'+DisplayID;
			
			if(DisplayName == "status"){
				
				console.log("DisplayName ----> "+DisplayName+" DisplayID--> " +DisplayID);
				
				switch(selectedVal)
				{
					case 'Completed':
						 $('.'+class_nameCompleteness).val("100%");
					break;
					case 'Not-Started':case 'Assigned':case 'None':
						$('.'+class_nameCompleteness).val("0%"); 
					break;
					case 'In-Progress':
						$('.'+class_nameCompleteness).val("10%"); 
					break;
				}
				
			}
			else if(DisplayName == "completeness"){
				
				switch(selectedVal){
					case '100%':
						 $('.'+class_nameStatus).val("Completed");
					break;
					case '10%':case '25%':case '50%':case '75%':
						$('.'+class_nameStatus).val("In Progress"); 
					break;
					case '0%':
						$('.'+class_nameStatus).val("Not Started"); 
					break;
				}
			}
			
			
			if (reportknowledgeassignation.KnowledgeStatusCompletenessChanged === undefined)
			{
				reportknowledgeassignation.KnowledgeStatusCompletenessChanged = new Array();
			}
		
			var selectedobj = new Object();
	
			selectedStatusvalue = $('.'+class_nameStatus).val(); 
			selectedCompletenessvalue = $('.'+class_nameCompleteness).val(); 
			
			selectedobj.Docid = DocId;
			selectedobj.selectedstatusvalue = selectedStatusvalue;
			selectedobj.selectedCompletenessvalue = selectedCompletenessvalue;
		
		
			var result = $.grep(reportknowledgeassignation.KnowledgeStatusCompletenessChanged, 
					function(e){ return e.Docid == selectedobj.Docid; });
				
			if(result.length === 0)
			{
				reportknowledgeassignation.KnowledgeStatusCompletenessChanged.push(selectedobj);
			}
			else 
			{
				reportknowledgeassignation.removeArrayValue(DocId,reportknowledgeassignation.KnowledgeStatusCompletenessChanged)
				reportknowledgeassignation.KnowledgeStatusCompletenessChanged.push(selectedobj);
			}
			
		});
	},
	removeArrayValue: function(docID, _array){
		for(var i=0; i<_array.length; i++){
		  if(docID == _array[i].Docid){
			  _array.splice(i, 1);
			  break;
		  }
	  }
	},
	removeSelectedRecordFromArray: function(docID, _array){
		for(var i=0; i<_array.length; i++){
		  if(docID == _array[i].documentId){
			  reportknowledgeassignation.json_doc_data.splice(i, 1);
			  break;
		  }
	  }
	},
	documentClickHandler:function(val){
	debugger;
		console.log(val);
		var id=val.id;
		
		
		var __knowledgeDocData = new Object();
		    var objTemp=document.getElementById(id);
			__knowledgeDocData.doc_id = objTemp.getAttribute("doc-id");
			__knowledgeDocData.doc_title = objTemp.innerHTML;
			
			__knowledgeDocData.doc_type = 'knowledgeView';
			__knowledgeDocData.current_page_name = ikePageConstants.KNOWLEDGE_ASSIGNATION_HISTORY;
			
			localStorage.removeItem('selectedKnowledgeEditDoc');
			localStorage.removeItem('selectedKnowledgeViewDoc');					
			localStorage.setItem('selectedKnowledgeViewDoc', JSON.stringify(__knowledgeDocData));
			$(location).attr('hash',ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
			
	},
	documentSaveClickHandler:function(val){
		
	debugger;
		console.log(val);
			
		var _id = $(val).attr("doc-id");
		var result = $.grep(reportknowledgeassignation.KnowledgeStatusCompletenessChanged, 
					function(e){ return e.Docid == _id; });
					
		if(result.length > 0)
		{		
			if(result[0].selectedstatusvalue =='None')
			{
				alert("Please select status to update.")
				return;
			}	
			
			if(result[0].selectedstatusvalue =='None')
			{
				alert("Please select completeness to update.")
				return;
			}
		}
		else
		{
				alert("Please select status and completeness to update.")
				return;
		}
		
		reportknowledgeassignation.GetAssignationEntrybyID(_id);
		//ISE.UpdatePackageAssignationEntryMongo()
		
		//console.log("Selected Knowladge: "+package_id);
		//localStorage.setItem('selectedKnowledgeViewDoc', JSON.stringify(__knowledgeDocData));
		//$(location).attr('hash',ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
	},
	
	GetAssignationEntrybyID:function(docid)
	{
			var requestObject = new Object();
			requestObject.title = reportknowledgeassignation.searchObj.input.replace(/\//g, " ");
			requestObject.searchString = "_id:" + docid ;
			requestObject.projectName = localStorage.getItem('multiProjectName');
			requestObject.maxResults = reportknowledgeassignation.requestSearchCount;
			requestObject.serachType = "similar";

			var collectionName = reportknowledgeassignation.searchObj.indexes;
			requestObject.collectionName = collectionName;
			ISE.getSearchResults(requestObject, reportknowledgeassignation._updateHandler);               
	},
	_updateHandler:function(dataObj) 
	{
		if(dataObj != undefined)
		{
			var result = $.grep(reportknowledgeassignation.KnowledgeStatusCompletenessChanged, 
					function(e){ return e.Docid == dataObj[0]._id; });
		
			if(result.length > 0)
			{
				dataObj[0].status =  result[0].selectedstatusvalue;
				dataObj[0].completeness =  result[0].selectedCompletenessvalue;
				ISE.UpdatePackageAssignationEntryMongo(dataObj[0],reportknowledgeassignation._UpdatePackageAssignationResultHandler);
			}
		}
	},
	_UpdatePackageAssignationResultHandler: function(data_obj){
		$.notific8('Assignation has been updated successfully.', {
			 life: 2000,
			 theme: 'lime',
			 sticky: false,
			 zindex: 11500
		});			
	},
	documentCancelClickHandler:function(val,selectId){
		alert(selectId)
	debugger;
		console.log(val);
			 var __knowledgeDocData = new Object();
		__knowledgeDocData.doc_id = $(val).attr("doc-id");
		__knowledgeDocData.doc_title = $(val).text();
		__knowledgeDocData.doc_type = 'knowledgeView';
		__knowledgeDocData.current_page_name = ikePageConstants.MY_ACCOMPLISHMENTS;
		
		//console.log("Selected Knowladge: "+package_id);
		//localStorage.setItem('selectedKnowledgeViewDoc', JSON.stringify(__knowledgeDocData));
		//$(location).attr('hash',ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
	},
	_filterInternal: function () {
			//var getCurrentSelectedTabData = defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID);
			var oTable = $('#page_reportknowledgeassignation .map-table-conatainer #reportknowledgeassignation').dataTable();
			//var oTable = $('#' + getCurrentSelectedTabData.tableID).dataTable();
			var currectSelectedTabel = oTable.DataTable();
			currectSelectedTabel.search(
				$('#page_reportknowledgeassignation #searchLocalDoc').val(),
				false,
				true
			).draw();
	},
	_uniqueArray:function(list) {
		var result = [];
		$.each(list, function(i, e) {
			if ($.inArray(e, result) == -1) result.push(e);
		});
		return result;
	},
	_updateDataTableSelectAllCtrl: function(table){
	   var $table             = table.table().node();
	   var $chkbox_all        = $('tbody input[type="checkbox"]', $table);
	   var $chkbox_checked    = $('tbody input[type="checkbox"]:checked', $table);
	   var chkbox_select_all  = $('thead input[name="group-checkable"]', $table).get(0);

	   // If none of the checkboxes are checked
	   if($chkbox_checked.length === 0){
		  chkbox_select_all.checked = false;
		  if('indeterminate' in chkbox_select_all){
			 chkbox_select_all.indeterminate = false;
		  }

	   // If all of the checkboxes are checked
	   } else if ($chkbox_checked.length === $chkbox_all.length){
		  chkbox_select_all.checked = true;
		  if('indeterminate' in chkbox_select_all){
			 chkbox_select_all.indeterminate = false;
		  }

	   // If some of the checkboxes are checked
	   } else {
		  chkbox_select_all.checked = true;
		  if('indeterminate' in chkbox_select_all){
			 chkbox_select_all.indeterminate = true;
		  }
	   }
	},
	
	_onExpandRowMoreContentModal:function(event){

	 /* var moreTextContent = unescape($(event).attr('moreTextContent'));
	  var modalTitle = $(event).attr('modalTitle');

	   var bodyContent = "<pre>"+moreTextContent+"</pre>"

	   $('#moreInfoModalTitle').text(modalTitle);
	  // $('#moreInfoModalTitle').
	   $('#modelInfo').empty();
	   $('#modelInfo').append(bodyContent);
	   $("#showMoreTextInfoModal").modal("show"); */
	   
	   
	   var moreTextContent = unescape($(event).attr('moreTextContent'));
	  console.log(moreTextContent);
	  var modalTitle = $(event).attr('modalTitle');
		$('#showMoreTextInfoCompModal #modelInfo').empty();
	   $('#showMoreTextInfoCompModal #modelInfo').append("<div id='similarSearch_more_description' class='form-control' style='height:450px;font-family:Courier' readonly=''></div>");
		
		String.prototype.replaceAll = function(target, replacement) {
						return this.split(target).join(replacement);
				};
				
				moreTextContent = moreTextContent.replaceAll('##','<em class="iseH">');
				moreTextContent = moreTextContent.replaceAll("#","</em>");
				moreTextContent = moreTextContent.replace(/.\t/g,". ");
		$("#showMoreTextInfoCompModal #similarSearch_more_description").html(moreTextContent);
	    $('#showMoreTextInfoCompModal #moreInfoModalTitle').text(modalTitle);
	  // $('#moreInfoModalTitle').
	   
	   //$('#modelInfo').append(bodyContent);
	   //$("#showMoreTextInfoCompModal").modal("show");         
	 
	  

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
	
	onLoadActionComponent: function() {
		$.ajax({
			url: "actions.html",
			type: 'HEAD',
			error: function() {
				console.log("Error")
			},
			success: function() {


				$('#page_reportknowledgeassignation .page-toolbar').load("actions.html", function() {

					$.getScript("js/subpages/actions.js")
						.done(function() {
							reportknowledgeassignation.actionsRef = actions;
							actions._setCurrentPage(ikePageConstants.MY_ACCOMPLISHMENTS);
							actions._setTargetPage(ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
							actions.init();
						})
						.fail(function() {
							console.log("Some problem in scripts")
						});


				});




			}
		});

	},
	
	
	
	 
	 
	 
};

