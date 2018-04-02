var myaccomplishments = {

	//Variable Declaration
	 myaccomplishments_table:'',
	jsonTableDetails:[],
	columnListDetailsArray:{},
	mobileViewTableColumnCollection:[],
	hideTableColumns:[],
	crIdFileds:[],
	requestSearchCount:9999,
	json_doc_data: {},
	docDetails:{},
	tableJSON:'myaccomplishmentsTable',
	statusOptionsArray: ['Not-Started','In-Progress','Completed', 'Refer-Back', 'Sign-Off'],
	completenessOptionsArray: ['0%','10%','25%','50%','75%','100%'],
	storeAllSelecvtOptions:[],
	GetAllKnowledgeStoreData:[],
	KnowledgeStatusCompletenessChanged:[],
	packageDataRowID:'',
	searchObj: new Object(),
	actionsRef:'',
	currentUser:'',
	selFilter:'',
	fileUploader:{},
	arrTrainingAssets:[],
	containsAttachments:0,
	isUploadEnabled: false,
    /* Init function  */
    init: function() {
		
		myaccomplishments._fillDropDownAndCreateDataTableHeading();
		
		myaccomplishments.currentUser = localStorage.getItem('username');
		
		$('#searchContainer #searchLocalDoc').on ('keyup', myaccomplishments._filterInternal);

	    $("#page_myaccomplishments #addNewContentDoc").on('click', function (e) {
			console.log("This is function is for  Add New Content Document. TODO");
		});
		$("#page_myaccomplishments #docPrint").on('click', function (e) {
			console.log("This is function is for Print Document. TODO");
		});
		$("#page_myaccomplishments #exportToPDF").on('click', function (e) {
			console.log("This is function is for Export to PDF. TODO");
		});
		$("#page_myaccomplishments #exportToExcel").on('click', function (e) {
			console.log("This is function is for Export to Excel. TODO");
		});
		
		$(function() {
			var temp="In-Progress"; 
			$("#myAssignationDropdown").val(temp);
		});
		
		$("#page_myaccomplishments #attachmentListContainer .glyphicon-remove").live("click", function(e){
			eleIndex = $(e.target).attr("index");
			$(e.target).parent().parent().remove();
			myaccomplishments.arrTrainingAssets.splice(eleIndex, 1);
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
		
		myaccomplishments._allowPermission(myaccomplishments.userRole); 
		myaccomplishments.onLoadActionComponent();
    },
	
	reinit:function()
	{
		$(function() {
			var temp="In-Progress"; 
			$("#myAssignationDropdown").val(temp);
		});
		
		myaccomplishments.currentUser = localStorage.getItem('username');
		myaccomplishments.actionsRef._setCurrentPage(ikePageConstants.MY_ACCOMPLISHMENTS);
		myaccomplishments.actionsRef._setTargetPage(ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
		myaccomplishments._initMyAccomplishmentPage();
	},
		
	refreshdata: function(){
		debugger;
		myaccomplishments._initMyAccomplishmentPage();
	},
	
	 _initMyAccomplishmentPage: function(){

		var username = localStorage.getItem('username');
		var getCurrentSelectedTabData = myaccomplishments.columnListDetailsArray;
		myaccomplishments._fillColumnListinDropdown(getCurrentSelectedTabData.dropDownBoxId, getCurrentSelectedTabData.tableID, getCurrentSelectedTabData.defaultView, getCurrentSelectedTabData.itemDetailsfields);
					
		myaccomplishments.searchObj.type = "similar";
		
		var objTemp=document.getElementById("myAssignationDropdown");
		myaccomplishments.selFilter = $(objTemp).val();
		if(myaccomplishments.selFilter == "")
			myaccomplishments.searchObj.input = "assignedto : " + username ;
		else if (myaccomplishments.selFilter == "My-Approvals")
			myaccomplishments.searchObj.input = "reviewerName : " + username ;
		else 
			myaccomplishments.searchObj.input = "assignedto:" + username  + " AND status:" + myaccomplishments.selFilter;
		
		myaccomplishments.searchObj.indexes = "assignation_collection";
		myaccomplishments._processSearchRequest(true); 
	},
	
	_updateURL: function() {
		var s = JSON.stringify(myaccomplishments.searchObj, myaccomplishments._encodeSpecialText);
		var newURL = window.location.protocol + "//" + window.location.host;
		newURL = newURL + window.location.pathname + "?SearchObj=" + s + "#myaccomplishments";
		history.pushState("test", "test", newURL);
	},
	
	_processSearchRequest: function(updateURL) {
		console.log('~~~~~ _processSearchRequest  ~~~~~ ');
		
		/*Code Commented due to creating problem in refreshing data in case status of assigned knowledge changes earlier then 1.5 seconds*/
		/*if( myaccomplishments.searchObj.lastSearch) {
			if ( (Date.now() - myaccomplishments.searchObj.lastSearch) < 1500) {
				console.log("Trying to search within 1.5 seconds again, there is some bug in your code !! performing no search");
				return;
			}
		}
		myaccomplishments.searchObj.lastSearch = Date.now();*/
		
		if (updateURL) {
			myaccomplishments._updateURL();
		}

		if (myaccomplishments.searchObj.type == 'context') {

			var requestObject = new Object();

			requestObject.title = myaccomplishments.searchObj.input.replace(/\//g, " ");
			requestObject.searchString = requestObject.title;
			requestObject.filterString = requestObject.searchString;
			requestObject.projectName = localStorage.getItem('multiProjectName');
			requestObject.maxResults = myaccomplishments.requestSearchCount;
			requestObject.serachType = "conextsearch";
			var collectionName = myaccomplishments.searchObj.indexes;
			requestObject.collectionName = collectionName;
			ISE.getSearchResults(requestObject, myaccomplishments._receivedSearchResults);
		}
		else
		{
			var requestObject = new Object();
			requestObject.title = myaccomplishments.searchObj.input.replace(/\//g, " ");
			requestObject.searchString = requestObject.title;
			requestObject.filterString = requestObject.searchString;
			requestObject.projectName = localStorage.getItem('multiProjectName');
			requestObject.maxResults = myaccomplishments.requestSearchCount;
			requestObject.serachType = "similar";

			var collectionName = myaccomplishments.searchObj.indexes;
			requestObject.collectionName = collectionName;
			ISE.getSearchResults(requestObject, myaccomplishments._receivedSearchResults);               
		}
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
		
		
		$.getJSON("json/"+myaccomplishments.tableJSON+".json?"+Date.now(), function(data) {
 
			myaccomplishments.jsonTableDetails = data;
			myaccomplishments.columnListDetailsArray = {};
			$.each(data.TableDetails, function(key, item) {
			 
				//  Filter Search List will be added based on role.
				if (item.enable == "yes") {

					for (var i = 0; i < item.allowedroles.length; i++) {

						if (item.allowedroles[i] == roleName) {

							var displayName = item.displayName;
							
							$('#page_myaccomplishments .map-table-conatainer').append('<div class="col-sm-12 table-scrollable1 table-responsive"><table class="table table-striped table-bordered table-hover dataTable" id="mapTableData"></table></div>')
							$('#page_myaccomplishments #mapTableData').append('<thead><tr id="tableheader_'+ displayName +'"></tr></thead><tbody id="tablebody_' + displayName + '"></tbody>');
							
							for (var j = 0; j < item.Details.fields.length; j++) {                                

								if(item.Details.fields[j].displayType != "expansion")
								$('#page_myaccomplishments .map-table-conatainer #tableheader_' + displayName).append("<th class='sorting ISEcompactAuto'>" + item.Details.fields[j].displayName + "</th>");
							}
							
							var dropDownBoxId = "columnToggler_" + displayName;
							var tableID = 'mapTableData' ;
							var _obj = new Object();
							_obj.dropDownBoxId = 'MAPColumnTogglerDropdown';//dropDownBoxId;
							_obj.tableID = tableID;
							_obj.defaultView = item.defaultView;
							_obj.itemDetailsfields = item.Details.fields;
							_obj.indexes = item.indexName;
							_obj.displayName = displayName;
							
							myaccomplishments.columnListDetailsArray = _obj;

							myaccomplishments.mobileViewTableColumnCollection.push({
								"tableID": 'mapTableData',
								"columnsList": item.mobileView,
								"dropdownID": 'columnToggler_' + displayName
							});
							
							
						}
					}
					  
				}
					
					 
			});
						
			var getCurrentSelectedTabData = myaccomplishments.columnListDetailsArray;
			 myaccomplishments._fillColumnListinDropdown(getCurrentSelectedTabData.dropDownBoxId, getCurrentSelectedTabData.tableID, getCurrentSelectedTabData.defaultView, getCurrentSelectedTabData.itemDetailsfields);
			var elements = document.querySelectorAll('#page_myaccomplishments .map-table-conatainer #searchKDFilterDropdown label input:checked');
		   Array.prototype.map.call(elements, function(el, i) {
			if(i>0)
			{
			 $(el).removeAttr("checked");
			 var resultsTabId = $(el).attr("resultTabID");
			 var resultsTabInnerContainerID = $(el).attr("resultTabInnerContainerID");
			 $("#page_myaccomplishments .map-table-conatainer #" + resultsTabId).addClass("hide");
			 $("#page_myaccomplishments .map-table-conatainer #" + resultsTabInnerContainerID).removeClass("active in");
			}               
		}); 

			myaccomplishments._initMyAccomplishmentPage();
		});
	},

	_fillColumnListinDropdown: function(dropDownBoxId, tableID, defaultColumnView, ColumnsList) {

		$('#page_myaccomplishments #' + dropDownBoxId).empty();

		var tempArr = new Array();

		for (var i = 0; i < ColumnsList.length; i++) {
			if(ColumnsList[i].type!="expansion")
			  tempArr.push(ColumnsList[i].displayName);
	   
	        }

		var colunmnID = 0;
		var tableHideColumns = new Array();
		$.grep(tempArr, function(element) 
                {
	               if ($.inArray(element, defaultColumnView) !== -1) {

				$('#page_myaccomplishments #' + dropDownBoxId).append('<label><input type="checkbox" name="column" checked="true" columnID=' + colunmnID + '  data-column=' + colunmnID + '>' + element + '</label>');
			} else {
				tableHideColumns.push(parseInt(colunmnID));
				$('#page_myaccomplishments #' + dropDownBoxId).append('<label><input type="checkbox" name="column"  columnID=' + colunmnID + ' data-column=' + colunmnID + '>' + element + '</label>');

			}
			colunmnID = colunmnID + 1;
		});

		myaccomplishments.hideTableColumns.push({
			"tableID": tableID,
			"hideColumnsList": tableHideColumns,
			"allColumnsNames": tempArr
		});


		$('#page_myaccomplishments input[type="checkbox"]').change(function() {

		   var iCol = parseInt($(this).attr("data-column"));
			iCol = iCol;
			var oTable = $('#page_myaccomplishments .map-table-conatainer #' + tableID).dataTable();

			var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
			oTable.fnSetColumnVis(iCol, bVis ? false : true);
			var chkVal = $(this).parent().text();
			if(bVis)
				myaccomplishments._insertOrDeleteDefaultTableColValue(chkVal, 'remove');
			else
				myaccomplishments._insertOrDeleteDefaultTableColValue(chkVal, 'insert');
			
			var table_wrapper = $('#page_myaccomplishments .map-table-conatainer #' + tableID+'_wrapper')
			if( table_wrapper.width() > oTable.width() )
			{
				table_wrapper.css('overflow-x', 'visible')
			}else{
				table_wrapper.css('overflow-x', 'none')
			}
		});
		$( "#page_myaccomplishments .map-table-conatainer #dataTablePageChange select" ).on('change', function() {
			console.log($( this ).val());
			myaccomplishments.requestSearchCount = $( this ).val();
		});

	},
	
	_insertOrDeleteDefaultTableColValue:function(chkVal, action){
			if( myaccomplishments.columnListDetailsArray.displayName){
			 if(action=='insert'){
				myaccomplishments.columnListDetailsArray.defaultView.push(chkVal);
			 }else if(action=='remove'){
				var k = myaccomplishments.columnListDetailsArray.defaultView.indexOf(chkVal);
				if(k != -1) {
					myaccomplishments.columnListDetailsArray.defaultView.splice(k, 1);
				}
			 }
			 myaccomplishments.columnListDetailsArray.defaultView = myaccomplishments._uniqueArray(myaccomplishments.columnListDetailsArray.defaultView);
			}
	},
	
	_receivedSearchResults: function(dataObj) {
		
		if (ISEUtils.validateObject(dataObj)) 
		{
			var FieldsMap = {};
			var DisplayNameMap = {};
			var displayColumns = {};
			var tC = {};
						
			myaccomplishments.json_doc_data = dataObj;
			
			for (var K in myaccomplishments.jsonTableDetails.TableDetails) {
				 var temp = new Array();
				 for(var l=0;l<myaccomplishments.jsonTableDetails.TableDetails[K].Details.fields.length;l++){

				   var obj =myaccomplishments.jsonTableDetails.TableDetails[K].Details.fields[l];
					  if(obj.displayType != "expansion")                          
						 temp.push(obj);                         
				 }

				FieldsMap[myaccomplishments.jsonTableDetails.TableDetails[K].indexName] = temp;
				DisplayNameMap[myaccomplishments.jsonTableDetails.TableDetails[K].indexName] = myaccomplishments.jsonTableDetails.TableDetails[K].displayName;
				displayColumns[myaccomplishments.jsonTableDetails.TableDetails[K].indexName] = myaccomplishments.jsonTableDetails.TableDetails[K].defaultView;
			}

			var sortField = 1;
			var fields = FieldsMap[dataObj[0]._index];


			for (var i = 0; i < dataObj.length; i++) {
			
				var issimilarDefectId = false;

				var fields = FieldsMap[dataObj[i]._index];
				var dName = DisplayNameMap[dataObj[i]._index];
				var tableID = '#page_myaccomplishments .map-table-conatainer #mapTableData';
				if (!tC[tableID]) {

					var oTable = $(tableID).dataTable();
					oTable.fnClearTable();
					oTable.fnDestroy();
				}
				tC[tableID] = 1;

				var documentIdColumnName = "documentid";
				var indexCollectionname = "_index";				  
				var sourceLineURL="sourceline";
				var row_inc = (i+1);
				   
				var newRowContent = '<tr>';
					 
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
								
							var completeText = dataObj[i][fields[ii].SourceName];
								
							if(undefined !=textContent && 'undefined' != textContent && typeof subTextContent !== "number")
							{
								textContent = textContent.toString();
								textContent = textContent.replaceAll('&nbsp;','<br>');
								textContent = textContent.replaceAll("<em class='iseH'>",'##');
								textContent = textContent.replaceAll("</em>","#");
								
								completeText  = completeText.toString();
								completeText = completeText.replaceAll('&nbsp;','');
								completeText = completeText.replaceAll("<em class='iseH'>",'');
								completeText = completeText.replaceAll("</em>","");
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
									newRowContent += '<td class="ISEcompactAuto"><span title="'+completeText+'" documentId="'+documentID+'" sourceLine="'+sourceLine+'" indexCollection="'+indexCollection+'" requiredfilter="' + fields[ii].filter + '" displaytype="'+ fields[ii].displayType +'" desc-data="'+escapeContent+'"><a href="javascript:;" documentId="'+documentID+'" id="mkpTitleRow"> ' +subTextContent+ ' </a></span></td>';
								}
								else if(textContent.length > 0 && textContent.length < 100)
								{
									newRowContent += '<td class="ISEcompactAuto"><span sourceLine="'+sourceLine+'" indexCollection="'+indexCollection+'" documentId="'+documentID+'" requiredfilter="' + fields[ii].filter + '" displaytype="'+ fields[ii].displayType +'" desc-data="'+escapeContent+'"> ' + subTextContent + ' </span></td>';
								}
								else
								{
									newRowContent += '<td class="ISEcompactAuto"><span sourceLine="'+sourceLine+'" indexCollection="'+indexCollection+'" documentId="'+documentID+'" requiredfilter="' + fields[ii].filter + '" displaytype="'+ fields[ii].displayType +'" desc-data="'+escapeContent+'"> ' +subTextContent+' <a modalTitle="'+fields[ii].displayName+'"  moreTextContent="' + escapeContent + '" class="name" onClick="myaccomplishments._onExpandRowMoreContentModal(this)">  more... </a></span></td>';
								}
							}											
						}
                                                else if (fields[ii].displayType.toLowerCase() == "array")
						{
							var arrContent = dataObj[i][fields[ii].SourceName];
							var textVal = "";
							if (arrContent)
							{
								if (typeof arrContent == "object")
								{
								for(var j = 0; j < arrContent.length; j++)
								{
									if (textVal !== "" && textVal.endsWith(", <br>") !== true)
											textVal = textVal + ", <br>";									
									if (typeof arrContent[j] == "object")
									{
										if (arrContent[j]["assetType"])
										{
											if (arrContent[j]["assetType"] !== "Graph" && arrContent[j]["assetType"] !== "Url")
											{
												textVal = textVal + arrContent[j][fields[ii].propertyName];
											}
											else if (arrContent[j]["assetType"] === "Url")
											{
												if (arrContent[j][fields[ii].propertyName].toString().length > 100)
													textVal = textVal + arrContent[j][fields[ii].propertyName].toString().substring(0, 100);
												else
													textVal = textVal + arrContent[j][fields[ii].propertyName];
											}	
										}
										else
										{
											textVal = textVal + arrContent[j][fields[ii].propertyName];
										}											
									}
									else
									{
										textVal = textVal + arrContent[j];
									}								
								}
							}
							else
							{
								textVal = arrContent;
							}	
							}
							else
							{
								textVal = arrContent;
							}	
							newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' >' +textVal+ '</span></td>';
						}
						else if (fields[ii].displayType.toLowerCase() == "combo" || fields[ii].displayType.toLowerCase() == "button" || fields[ii].displayType.toLowerCase() == "richtextbox")
						{
							var table_details = [];
							var column_details = [];
							var colDetails = new Object();							
																					
							colDetails.name = fields[ii].SourceName;
							colDetails.type = fields[ii].displayType;
							
							table_details.push(dataObj[i]);							
							column_details.push(colDetails);
							
							newRowContent += myaccomplishments._renderSubTable(table_details, column_details);							
						}
						else
						{
							newRowContent += '<td class="ISEcompactAuto"><span sourceLine="'+sourceLine+'" indexCollection="'+indexCollection+'" documentId="'+documentID+'" requiredfilter="' + fields[ii].filter + '" displaytype="' + fields[ii].displayType + '">' + dataObj[i][fields[ii].SourceName] + '</span></td>';
						}
					}
				}
				 
				newRowContent += '</tr>';				
				$('#page_myaccomplishments .map-table-conatainer #tablebody_' + dName).append(newRowContent);				
			}

			for (var tab in tC) 
			{
					
				var tableColumnsCount = $(tab).find('tr')[0].cells.length;
				var tempArr = new Array();
				for(var i=1;i<tableColumnsCount;i++){
					tempArr.push(i);                    
				}
				myaccomplishments._handleUniform();
				myaccomplishments.knowledgeaddpackage_table =  $('#page_myaccomplishments .map-table-conatainer #mapTableData').DataTable({
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

					"columnDefs": [
						{"targets": [0], "width": "9%"},						
						{"targets": [1], "width": "9%"},
						{"targets": [2], "width": "9%"},
						{"targets": [3], "width": "12%"},
						{"targets": [4], "width": "13%"},
						{"targets": [5], "width": "9%", "visible": false},
						{"targets": [6], "width": "9%", "visible": false},
						{"targets": [7], "width": "15%"},
						{"targets": [8], "width": "9%"},
						{"targets": [9], "width": "9%"},
						{"targets": [10], "width": "6%"},
					],					
					"lengthMenu": [
						[5, 15, 20, -1],
						[5, 15, 20, "All"] // change per page values here
					],
					"order": [
						[sortField, 'desc']
					],
					// set the initial value
					"pageLength": 10,
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
					"autoWidth": false,					
				});
				
				var total_rec_count = $("#page_myaccomplishments .map-table-conatainer #mapTableData").DataTable().page.info().recordsTotal;
				$('#page_myaccomplishments #docActionContainer .kwdg-store-doc-count').text(total_rec_count+' Results')
				 
				$("#page_myaccomplishments .map-table-conatainer tbody #mkpTitleRow").live('click', function(e){					 
					var __knowledgeDocData = new Object();
					__knowledgeDocData.doc_id = $(this).attr("documentId");;
					
					__knowledgeDocData.doc_type = 'knowledgeView';
					__knowledgeDocData.current_page_name = ikePageConstants.MY_ACCOMPLISHMENTS;
					localStorage.removeItem('selectedKnowledgeEditDoc');
					localStorage.removeItem('selectedKnowledgeViewDoc');						
					localStorage.setItem('selectedKnowledgeViewDoc', JSON.stringify(__knowledgeDocData));
					$(location).attr('hash',ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
				});
				
				$("#page_myaccomplishments .map-table-conatainer tbody #maPrvRemarksRow").live('click', function(e){
					console.log("e: ~~~ "+e);
					console.log($(this).attr("doc-id"));
					 
					var docID = $(this).attr("doc-id");
					 
					myaccomplishments.GetAssignationEntrybyID(docID, "remarkInvoked");
					
					$("#page_myaccomplishments #prvRemarksModalContainer").modal('show');
					
										
				}); 			

				$(tab+"_wrapper").css('overflow-x', 'hidden');
				if( $(window).width() < 500 ) {
					$(document).scrollTop($('#searchResultsTable').offset().top);
					$(tab+"_wrapper").css('overflow-x', 'auto');
				}
			}

			for (var i = 0; i < myaccomplishments.hideTableColumns.length; i++) {
				var iTD = '#page_myaccomplishments .map-table-conatainer #' + myaccomplishments.hideTableColumns[i].tableID;
				if (!tC[iTD]) continue;
				
				var table = $(iTD).DataTable();
				
				var tempstr = myaccomplishments.columnListDetailsArray.dropDownBoxId;
				console.log(tempstr)
				
				for (var j = 0; j < myaccomplishments.hideTableColumns[i].hideColumnsList.length; j++) {

					var columnID = myaccomplishments.hideTableColumns[i].hideColumnsList[j];
					if (myaccomplishments.selFilter == "My-Approvals")
					{
						table.column(columnID - 1).visible(false);
						table.column(columnID).visible(true);
					}
					else
					{	
						table.column(columnID).visible(false);
						table.column(columnID - 1).visible(true);						
					}
					
					$('#page_myaccomplishments .map-table-conatainer #columnToggler_'+tempstr+' input[columnid='+columnID+']').attr('checked', false)
				}
			}
			
			$('#page_myaccomplishments .map-table-conatainer #searchResultsTable').removeClass("hide");

			myaccomplishments.searchResultsReceived = true;


			//  Hide Table rows dropdown and Table Search
			$("div").find("#page_myaccomplishments .map-table-conatainer .dataTables_length").addClass('hidden-sm hidden-xs');
			$("div").find("#page_myaccomplishments .map-table-conatainer .dataTables_filter").addClass('hidden-sm hidden-xs');

			var windowWidth = $(window).width();
			if (windowWidth <= 400) {
				myaccomplishments.onResizeWindow();//todo
				$("html, body").animate({
					scrollTop: $(document).height()
				}, 1000);
			}			
		}
		else
		{
			var oTable = $('#page_myaccomplishments .map-table-conatainer #mapTableData').dataTable();
			oTable.fnClearTable();
			oTable.fnDestroy();	
		}
		
		$("#page_myaccomplishments .map-table-conatainer #addExpand").css("width", "3.40%");
		var sourceCodeTableRowCount = $('#page_myaccomplishments .modal-body .table-containerr #sample_4_SourceCode tbody').children().length;      
		ISEUtils.portletUnblocking("pageContainer");

		Pace.stop();		 
	},
			
   _renderSubTable: function(table_details, column_details){
		
		var sTR = '';
			
		for(var i=0; i<table_details.length; i++)
		{					
			var sTD = '';
			
			for(var j=0; j<column_details.length; j++){	
			
				var display_id = table_details[i]['_id'];
				var display_id = table_details[i]['_id'];
				if(column_details[j].type.toLowerCase() == 'url')
				{ 
					var temp=table_details[i]["_id"];
					sTD +='<td class="ISEcompactAuto"><span title="'+table_details[i][column_details[j].name]+'"  displaytype="string"><a href="javascript:;"   doc-id="'+table_details[i]['documentid']+'" onclick="myaccomplishments.documentClickHandler(this)" id="kdTitleRow_'+ temp + '">'+table_details[i][column_details[j].name]+'</a></span></td>'
                					
				}
				else if(column_details[j].name == 'status')
				{
					var isDisabled = "disabled";
					var arrStatusOptions = myaccomplishments.statusOptionsArray;
					if (myaccomplishments.selFilter != "My-Approvals")
					{
						if (table_details[i][column_details[j].name] == "Not-Started" || table_details[i][column_details[j].name] == "Not-Applicable") 
						{
							isDisabled = (table_details[i][column_details[j].name] == "Not-Applicable") 
											? "disabled" 
											: "";
							arrStatusOptions = ['Not-Started','Not-Applicable'];
						}
						
						if (myaccomplishments.selFilter == "Refer-Back")
						{
							isDisabled = "";
							arrStatusOptions = ['Completed','Refer-Back'];
						}
					}
					else
					{
						if (table_details[i][column_details[j].name] == "Completed")
						{
							isDisabled = "";
							arrStatusOptions = ['Completed','Refer-Back','Sign-Off'];
						}
					}
					sTD +='<td class="ISEcompactAuto" >'+myaccomplishments.renderCombobox( table_details[i]['_id'],column_details[j].name,display_id, table_details[i][column_details[j].name], arrStatusOptions, isDisabled)+'</td>'					
				}
				else if(column_details[j].name == 'completeness')
				{
					var isDisabled = "disabled";
					if (table_details[i]['status'] == "In-Progress" && myaccomplishments.selFilter != "My-Approvals") 
					{
						isDisabled = "";						
					}
					sTD +='<td class="ISEcompactAuto">'+myaccomplishments.renderCombobox(table_details[i]['_id'],column_details[j].name,display_id, table_details[i][column_details[j].name], myaccomplishments.completenessOptionsArray, isDisabled)+'</td>'
				}
				else if (column_details[j].type.toLowerCase() == 'richtextbox')
				{
					var isDisabled = "disabled";
					if (myaccomplishments.selFilter == "My-Approvals" && table_details[i]['status'] == "Completed")
					{
						isDisabled = "";
					}
					else if (myaccomplishments.selFilter != "My-Approvals" && table_details[i]['status'] == "In-Progress") 
					{
						isDisabled = "";
					}										
					sTD +='<td class="ISEcompactAuto"><textarea name="txtArea" '+ isDisabled + ' id="txtArea-Remarks-'+display_id+'" cols="22" style="resize:none" rows="3"></textarea><a href="javascript:;" id="maPrvRemarksRow" doc-id="'+display_id+'">View Previous Remarks...</a></td>';					
				}
				else if(column_details[j].type.toLowerCase() == 'button')
				{
					var spanTitle = "Save";
					var buttonText = "Save";
					var buttonStyle = "";
					if (table_details[i]['status'] == "Not-Started") 
					{
						spanTitle = "Start-Training";
						buttonText = "Initiate";
						buttonStyle = "hidden";
					}
					
					if (table_details[i]['status'] == "Not-Applicable")
						buttonStyle = "hidden";
					
					if (myaccomplishments.selFilter != "My-Approvals")
					{
						if (table_details[i]['status'] == "Not-Started" || table_details[i]['status'] == "In-Progress") 	
							sTD +='<td class="ISEcompactAuto"><span title="' + spanTitle +'" id="span-btn-'+display_id+'" displaytype="string"><a href="javascript:;" class="btn btn-xs blue btn-icon-only btn-default margin-bottom-10 edit-knowledge-btn-save" data-toggle="modal" id="btn-save-initiate-'+display_id+'" doc-id="'+table_details[i]['_id']+'" onclick="myaccomplishments.documentSaveClickHandler(this)">'+buttonText+'</a><span title="Add Attachment" style="visibility:'+buttonStyle+'"><a href="javascript:;" id="btn-attchmentTDoc-'+display_id+'" doc-id="'+table_details[i]['_id']+'" onclick="myaccomplishments._attachmentPopupHandler(this)" class="btn btn-xs btn-icon-only btn-default margin-bottom-5 edit-knowledge-btn-save"><i class="fa fa-paperclip" aria-hidden="true"></i></a></span></span></td>'
						else
							sTD +='<td class="ISEcompactAuto"><span title="' + spanTitle +'" id="span-btn-'+display_id+'" displaytype="string"><a href="javascript:;" class="btn btn-xs blue btn-icon-only btn-default margin-bottom-10 edit-knowledge-btn-save disabled" data-toggle="modal" id="btn-save-initiate-'+display_id+'" doc-id="'+table_details[i]['_id']+'" onclick="myaccomplishments.documentSaveClickHandler(this)">'+buttonText+'</a><span title="Add Attachment" style="visibility:'+buttonStyle+'"><a href="javascript:;" id="btn-attchmentTDoc-'+display_id+'" doc-id="'+table_details[i]['_id']+'" onclick="myaccomplishments._attachmentPopupHandler(this)" class="btn btn-xs btn-icon-only btn-default margin-bottom-5 edit-knowledge-btn-save"><i class="fa fa-paperclip" aria-hidden="true"></i></a></span></span></td>';
					}
					else
					{
						if (table_details[i]['status'] == "Completed") 	
							sTD +='<td class="ISEcompactAuto"><span title="' + spanTitle +'" id="span-btn-'+display_id+'" displaytype="string"><a href="javascript:;" class="btn btn-xs blue btn-icon-only btn-default margin-bottom-10 edit-knowledge-btn-save" data-toggle="modal" id="btn-save-initiate-'+display_id+'" doc-id="'+table_details[i]['_id']+'" onclick="myaccomplishments.documentSaveClickHandler(this)">'+buttonText+'</a><span title="Add Attachment" style="visibility:'+buttonStyle+'"><a href="javascript:;" id="btn-attchmentTDoc-'+display_id+'" doc-id="'+table_details[i]['_id']+'" onclick="myaccomplishments._attachmentPopupHandler(this)" class="btn btn-xs btn-icon-only btn-default margin-bottom-5 edit-knowledge-btn-save"><i class="fa fa-paperclip" aria-hidden="true"></i></a></span></span></td>'
						else
							sTD +='<td class="ISEcompactAuto"><span title="' + spanTitle +'" id="span-btn-'+display_id+'" displaytype="string"><a href="javascript:;" class="btn btn-xs blue btn-icon-only btn-default margin-bottom-10 edit-knowledge-btn-save disabled" data-toggle="modal" id="btn-save-initiate-'+display_id+'" doc-id="'+table_details[i]['_id']+'" onclick="myaccomplishments.documentSaveClickHandler(this)">'+buttonText+'</a><span title="Add Attachment" style="visibility:'+buttonStyle+'"><a href="javascript:;" id="btn-attchmentTDoc-'+display_id+'" doc-id="'+table_details[i]['_id']+'" onclick="myaccomplishments._attachmentPopupHandler(this)" class="btn btn-xs btn-icon-only btn-default margin-bottom-5 edit-knowledge-btn-save"><i class="fa fa-paperclip" aria-hidden="true"></i></a></span></span></td>';	
					}
				}					
				else if(column_details[j].type.toLowerCase() == 'cancel')
					sTD +='<td class="ISEcompactAuto"><span title="Cancel"  displaytype="string"><a class="btn btn-xs blue btn-icon-only btn-default margin-bottom-10 edit-knowledge-btn-cancel" href="javascript:;" doc-id="'+table_details[i]['_id']+'" onclick="myaccomplishments.documentCancelClickHandler(this)">Cancel</a></span></td>'
				else
				{
					sTD +='<td class="ISEcompactAuto"><span title="'+table_details[i][column_details[j].name]+'"  displaytype="string">'+table_details[i][column_details[j].name]+'</span></td>'
				}				
			}			
			sTR += sTD;
		}		
		return sTR;
	},
	
	renderCombobox: function(docid,display_name,display_id, selected_val, options_array, isDisabled = ""){
		var class_name = 'single-select-'+display_name+'-'+display_id;
		var htmlData = '<select doc-id="'+docid+'" display-name="'+display_name+'" display-id="'+display_id+'" id="'+display_name+'" ' + isDisabled + ' class="form-control '+class_name+'">';		
		for(var i=0; i<options_array.length; i++)
		{
			if (isDisabled == "disabled" && selected_val)
			{
				if (options_array[i] == selected_val)
				{
					htmlData += ' <option value="'+options_array[i]+'" selected>'+options_array[i]+'</option>';	
				}
			}
			else
			{
				var selected = (options_array[i] == selected_val) ? "selected" : "";
			        htmlData += ' <option value="'+options_array[i]+'"'+selected+'>'+options_array[i]+'</option>';
		        }
		}
		htmlData += '</select>';
		myaccomplishments.onChangeSingleSelect(class_name);
		return htmlData;
	},
	onChangeSingleSelect:function (class_name){
		$("."+class_name).live('change', function(e){
			var DisplayName = $(this).attr('display-name');
			var DisplayID = $(this).attr('display-id');
			var DocId = $(this).attr('doc-id');
			var selectedVal = $(this).val();
			var class_nameStatus='';
			var class_nameCompleteness='';
			var class_nameStauts = '';
			var id_SaveInitiate = '';
			var id_SpanButton = '';
			var id_txtArea = '';
			
			
			class_nameCompleteness = 'single-select-completeness-'+DisplayID;
			class_nameStatus= 'single-select-status-'+DisplayID;
			id_SaveInitiate = 'btn-save-initiate-'+DisplayID;
			id_SpanButton = 'span-btn-'+DisplayID;
			id_txtArea = 'txtArea-Remarks-'+DisplayID;
			
			if(DisplayName == "status")
			{			
				console.log("DisplayName ----> "+DisplayName+" DisplayID--> " +DisplayID);
				
				switch(selectedVal)
				{
					case 'Completed':
						 $('.'+class_nameCompleteness).val("100%");
						if (myaccomplishments.selFilter == "Refer-Back")
						{
							$('#'+id_txtArea).prop('disabled', false);
							$('#'+id_SaveInitiate).removeClass('disabled');							
						}
					break;
					case 'Not-Started':case 'Assigned':case 'None':
						$('.'+class_nameCompleteness).val("0%"); 
						$('#'+id_SaveInitiate).text("Initiate");
						$('#'+id_SpanButton).prop('title', 'Start-Training');
						$('#'+id_txtArea).prop('disabled',true);	
					break;
					case 'In-Progress':
						$('.'+class_nameCompleteness).val("10%"); 
					break;
					case 'Not-Applicable':
						$('#'+id_SaveInitiate).text("Save");
						$('.'+class_nameCompleteness).val("0%");
						$('#'+id_txtArea).prop('disabled',false);
						$('#'+id_SpanButton).prop('title', 'Save Status');	
					break;
					case 'Refer-Back':
						if (myaccomplishments.selFilter == "Refer-Back")
						{
							$('#'+id_txtArea).prop('disabled', true);
							$('#'+id_SaveInitiate).addClass('disabled');							
						}	
					break;	
				}
			}
			else if(DisplayName == "completeness"){
				
				switch(selectedVal){
					case '100%':
						$("."+class_nameStatus+" option[value='Completed']").remove();
						$('<option>').val('Completed').text('Completed').appendTo('.'+class_nameStatus);
						 $('.'+class_nameStatus).val("Completed");
					break;
					case '10%':case '25%':case '50%':case '75%':
						$('.'+class_nameStatus).val("In-Progress"); 
						$("."+class_nameStatus+" option[value='Completed']").remove();
					break;
					/*case '0%':
						$('.'+class_nameStatus).val("Not-Started"); 
					break;*/
				}
			}
			
			
			if (myaccomplishments.KnowledgeStatusCompletenessChanged === undefined)
			{
				myaccomplishments.KnowledgeStatusCompletenessChanged = new Array();
			}
		
			var result = $.grep(myaccomplishments.KnowledgeStatusCompletenessChanged, 
					function(e){ return e.Docid == DocId; });
					
				if (result.length > 0)
			{			
				result[0].selectedstatusvalue = $('.'+class_nameStatus).val();
				result[0].selectedCompletenessvalue = $('.'+class_nameCompleteness).val();
				myaccomplishments._addElementToArray(result[0], myaccomplishments.KnowledgeStatusCompletenessChanged)	
			}
			else
			{
				var objToAdd = new Object();				
				objToAdd.Docid = DocId;
				objToAdd.selectedstatusvalue = $('.'+class_nameStatus).val();
				objToAdd.selectedCompletenessvalue = $('.'+class_nameCompleteness).val();
				objToAdd.trainingAssets = myaccomplishments._getTrainingAssets(DocId);
				
				myaccomplishments._addElementToArray(objToAdd, myaccomplishments.KnowledgeStatusCompletenessChanged)
			}				
		});
	},

	_attachmentPopupHandler:function(pObject)
	{
		$("#page_myaccomplishments #attachmentListContainer").empty();
		myaccomplishments.arrTrainingAssets = [];
		myaccomplishments.containsAttachments = 0;
		
		console.log(pObject);
			
		var _id = $(pObject).attr("doc-id");
		var trainingStatus = $('.single-select-status-'+_id).val()
		var completionStatus = $('.single-select-completeness-'+_id).val();;
		
		myaccomplishments.isUploadEnabled = false;
		switch (myaccomplishments.selFilter)
		{
			case "My-Approvals":			
				if (trainingStatus == "Refer-Back")
				{
					$('#page_myaccomplishments #addAttachmentBtn').removeClass('disabled');
					$('#page_myaccomplishments #uploadAttachmentBtn').removeClass('disabled');
					myaccomplishments.isUploadEnabled = true;
				}
				else
				{
					$('#page_myaccomplishments #addAttachmentBtn').addClass('disabled');
					$('#page_myaccomplishments #uploadAttachmentBtn').addClass('disabled');
				}			
			break;
			case "Refer-Back":
				if (trainingStatus == "Completed")
				{
					$('#page_myaccomplishments #addAttachmentBtn').removeClass('disabled');
					$('#page_myaccomplishments #uploadAttachmentBtn').removeClass('disabled');
					myaccomplishments.isUploadEnabled = true;
				}
				else
				{
					$('#page_myaccomplishments #addAttachmentBtn').addClass('disabled');
					$('#page_myaccomplishments #uploadAttachmentBtn').addClass('disabled');
				}
			break;
			case "In-Progress":
				$('#page_myaccomplishments #addAttachmentBtn').removeClass('disabled');
				$('#page_myaccomplishments #uploadAttachmentBtn').removeClass('disabled');
				myaccomplishments.isUploadEnabled = true;
			break;
			default:
			{
				$('#page_myaccomplishments #addAttachmentBtn').addClass('disabled');
				$('#page_myaccomplishments #uploadAttachmentBtn').addClass('disabled');
			}
			break;
		}
							
		myaccomplishments.GetAssignationEntrybyID(_id, "attachmentInvoked");
		
		myaccomplishments._handleUploader(trainingStatus, _id, completionStatus);
			
		$("#page_myaccomplishments #addAttachmentModalContainer").modal('show');			
	},
	
	


	
	_handleUploader: function(pStatus, pTrainingId, pCompletionStatus) {
				
			  $('#page_myaccomplishments #attachmentListContainer').on('click', '.remove', function(e){
                       var eleIndex = $(e.target).parent().parent().index();
						myaccomplishments.arrTrainingAssets.splice(eleIndex, 1);
						var fileId = $(this).attr("fileId");
						console.log(fileId);
						myaccomplishments.fileUploader.existingFileNames = myaccomplishments.fileUploader.existingFileNames.slice(myaccomplishments.fileUploader.existingFileNames.indexOf(fileId),1);
						//myaccomplishments.fileUploader.removeFile(myaccomplishments.fileUploader.getFile(fileId));	
                        $(this).parent().parent('.added-files').remove();						
						myaccomplishments.containsAttachments--;
						//myaccomplishments.fileUploader.refresh();
						e.stopImmediatePropagation();
               });		
					
			
		     //var  url1 = "http://"+iseConstants.serverHost+":"+window.location.port+"/DevTest/FileServer/upload?authToken="+localStorage.authtoken;//To Do
			 var  url1 = "http://"+iseConstants.serverHost+":"+window.location.port+"/DevTest/FileServer/upload?documentId="+pTrainingId+"&authToken="+localStorage.authtoken;//To Do
         
              var count = 0;
              myaccomplishments.fileUploader =  $("#addAttachmentBtn").uploadFile({
                url: url1,
                dragDrop: false,
                showDelete: false,
                fileName: "myfile",
                maxFileSize: (iseConstants.maxFileSize * 1048576),
                showFileCounter: false,
				showFileSize :true,
				showError:false,
				showWarnings:false,
				uploadStr :"<i class='fa fa-plus'></i> ADD FILE(s)",
				multiple:true,
				allowedTypes: "jpg,gif,png,doc,xls,pdf,csv,ppt,docx,xlsx,pptx,txt,msg,webm,ogv,mp4",
				autoSubmit:false,
				
				onSelect:function(files)
	{
				 	var _validFileExtensions = [".jpg",".gif",".png",".bmp",".doc",".xls",".pdf",".csv", ".ppt",".docx",".xlsx",".pptx",".txt",".msg",".webm",".ogv",".mp4"];  							  	
				    for(var i= 0; i<files.length; i++)
					{
					  var fileExtension = files[i].name.substr(files[i].name.lastIndexOf('.'));
					 if(myaccomplishments._validateExtensions(_validFileExtensions,fileExtension))
					 {
					  $('#page_myaccomplishments #attachmentListContainer').append('<div class="col-md-12 list-element file-holder alert alert-warning added-files" id="uploaded_file_' + files[i].name + '"><div class="col-md-6"><span>' + files[i].name + '(' + (parseFloat(files[i].size)/(1024*1024)).toFixed(2) + 'MB'+ ')</span> <span class="status label label-info"></span></div>&nbsp;<div class="col-md-4 pull-right"><a href="javascript:;" fileId="'+ files[i].name +'" class="remove pull-right btn btn-sm red"><i class="fa fa-times"></i> remove </a></div></div>'); 
						
						myaccomplishments.containsAttachments++;
						
						console.log("Attachment Count adding: " + myaccomplishments.containsAttachments);
						
						var objFile = new Object();
						objFile.assetType = "File";
						objFile.assetName = files[i].name;
						objFile.fileType = 	files[i].type;
						objFile.modifiedDate = files[i].lastModifiedDate;
						objFile.fileSize = (parseFloat(files[i].size)/(1024*1024)).toFixed(2);
						
						var index = myaccomplishments._getAssetIndex(objFile);
						if(index != -1)                                                	
							myaccomplishments.arrTrainingAssets[index] = objFile;							
						else
							myaccomplishments.arrTrainingAssets.push(objFile); 
													
						if (myaccomplishments.enableEdit)
							myaccomplishments.initRenderKnowledgeAssetsList(false);
							
						//myaccomplishments.fileUploader.refresh();	
                      }						
					  else
					  {
					    Metronic.alert({type: 'danger', message: 'Invalid Extension.', closeInSeconds: 10, icon: 'warning'});
						ISEUtils.portletUnblocking("pageContainer");
					   
					  }
								   
										
						 
					
					}
				  //Hide inbuilt container	
				  $(".ajax-file-upload-container").hide();
				  return true; //to allow file submission.
				},
				
				onSuccess: function (files, data, xhr, pd) {
				  
                     pd.statusbar.hide(); // hide auto progress bar
					if (data.trim() == "File uploaded successfully !!!") {
                        $('#uploaded_file_' + files[0] + ' > .status').removeClass("label-info").addClass("label-success").html('<i class="fa fa-check"></i> Done'); // set successfull upload
						myaccomplishments._fileUploaderAck(pStatus, pTrainingId, pCompletionStatus);						
					} else {
                        $('#uploaded_file_' + files[0] + ' > .status').removeClass("label-info").addClass("label-danger").html('<i class="fa fa-warning"></i> Failed'); // set failed upload
                        Metronic.alert({type: 'danger', message: 'One of uploads failed. Please retry.', closeInSeconds: 10, icon: 'warning'});
						ISEUtils.portletUnblocking("pageContainer");
                    }
					
					 
                },
				onCancel:function(files,pd)
					{
							alert('cancel');
					},
				afterUploadAll: function (obj) {
                   
                },
				onError: function(files,status,errMsg,pd)
				{
				
		
				  Metronic.alert({type: 'danger', message: err.message, closeInSeconds: 10, icon: 'warning'});
					ISEUtils.portletUnblocking("pageContainer");
				}
						   
            });// finish	
		
		
        myaccomplishments.fileUploader.init();
    },
	_validateExtensions: function(_arrvalidFileExtensions,fileName)
	{
	var result = false;
		for(var i=0; i<_arrvalidFileExtensions.length; i++){
		  if(fileName.toLowerCase() == _arrvalidFileExtensions[i]){
			  result = true;
			  break;
			  
		  }
		  else
		    result = false;
	  }
	 return result;
	},
	
	_fileUploaderAck:function(pStatus, pTrainingId, pCompletionStatus)
	{
		if (myaccomplishments.containsAttachments >= 0)
		{
			myaccomplishments.containsAttachments--;
		}
		
		if (myaccomplishments.containsAttachments == 0)
		{
			alert("File(s) uploaded successfully !!\n\nPlease submit training details to update record.")
			
			$("#page_myaccomplishments #attachmentListContainer").empty();
			
			for (var i = 0; i < myaccomplishments.arrTrainingAssets.length; i++)
			{
				myaccomplishments.renderFileView(myaccomplishments.arrTrainingAssets[i].assetType, myaccomplishments.arrTrainingAssets[i].assetName, myaccomplishments.arrTrainingAssets[i].modifiedDate, myaccomplishments.arrTrainingAssets[i].fileSize, i);
			}
			
			var selectedobj = new Object();
		
			selectedobj.Docid = pTrainingId;
			selectedobj.selectedstatusvalue = pStatus;
			selectedobj.selectedCompletenessvalue = pCompletionStatus;
			selectedobj.trainingAssets = myaccomplishments.arrTrainingAssets;
			
			myaccomplishments._addElementToArray(selectedobj, myaccomplishments.KnowledgeStatusCompletenessChanged)
		}
	},	
	
	_getAssetIndex: function(assetObject)
	{
		if (myaccomplishments.arrTrainingAssets)
		{
			for (var i = 0; i < myaccomplishments.arrTrainingAssets.length; i++)
			{
				if (myaccomplishments.arrTrainingAssets[i].assetName === assetObject.assetName)
				{
					if (myaccomplishments.arrTrainingAssets[i].fileType === assetObject.fileType)
					{
						return i;
					}													
				}					                        								
			}
		}
		else
			myaccomplishments.arrTrainingAssets = [];
			
		return -1;
	},
	
	removeArrayValue: function(docID, _array){
		for(var i=0; i<_array.length; i++){
		  if(docID == _array[i].Docid)
                  {
			  _array.splice(i, 1);
			  break;
		  }
	  }
	},
	
	_addElementToArray:function(pObjToStore, pArrTarget){
		var result = $.grep(pArrTarget, 
					function(e){ return e.Docid == pObjToStore.Docid });
				
		if(result.length === 0)
		{
			pArrTarget.push(pObjToStore);
		}
		else 
		{
			myaccomplishments.removeArrayValue(pObjToStore.Docid, pArrTarget)
			pArrTarget.push(pObjToStore);
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
		__knowledgeDocData.current_page_name = ikePageConstants.MY_ACCOMPLISHMENTS;
			
		localStorage.removeItem('selectedKnowledgeEditDoc');
		localStorage.removeItem('selectedKnowledgeViewDoc');			
		localStorage.setItem('selectedKnowledgeViewDoc', JSON.stringify(__knowledgeDocData));
		$(location).attr('hash',ikePageConstants.KNOWLEDGE_READ_AND_EDIT);			
	},

	documentSaveClickHandler:function(val){		
	debugger;
		console.log(val);
			
		var _id = $(val).attr("doc-id");
		
		var buttonText = $(val).text();
		console.log(buttonText);
		
		if (buttonText == "Initiate")
		{
			var response = confirm("Are you sure you want to start this training ?");
			if (response) {
				var selectedobj = new Object();
		
				selectedobj.Docid = _id;
				selectedobj.selectedstatusvalue = "In-Progress";
				selectedobj.selectedCompletenessvalue = "0%";
				selectedobj.trainingAssets = [];
				
				myaccomplishments._addElementToArray(selectedobj, myaccomplishments.KnowledgeStatusCompletenessChanged)
			}
			else
			{
				ISEUtils.portletUnblocking("pageContainer");
				return;
			}
		}
		
		myaccomplishments._updateRemarksById(_id);
		
		var result = $.grep(myaccomplishments.KnowledgeStatusCompletenessChanged, 
					function(e){ return e.Docid == _id; });
					
		if(result.length > 0)
		{		
			if(result[0].selectedstatusvalue =='None')
			{
				alert("Please select status to update.")
				return;
			}	
			
			if(result[0].selectedCompletenessvalue =='None')
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
		
		myaccomplishments.GetAssignationEntrybyID(_id);		
	},

        _updateRemarksById:function(pTrainingId)
	{
		var result = $.grep(myaccomplishments.KnowledgeStatusCompletenessChanged, 
					function(e){ return e.Docid == pTrainingId; });

		if(result.length > 0)
		{
			var uComment = $('#txtArea-Remarks-'+pTrainingId).val();
			if (uComment.toString().trim().length > 0)
			{
				var objRemarks = new Object();
				objRemarks.userName = myaccomplishments.currentUser;
				objRemarks.dateAndTime = new Date().getDate()+" "+myaccomplishments._getCurrentMonth()+" "+new Date().getFullYear()+" "+ new Date().toLocaleTimeString(); 
				objRemarks.description = $('#txtArea-Remarks-'+pTrainingId).val();
				
				result[0].remark = [objRemarks];
				
				myaccomplishments._addElementToArray(result[0], myaccomplishments.KnowledgeStatusCompletenessChanged)
			}
		}
		else
		{
			var uComment = $('#txtArea-Remarks-'+pTrainingId).val();
			if (uComment.toString().trim().length > 0)
			{
				valCompleteness = $('.single-select-completeness-'+pTrainingId).val(); 
				valStatus = $('.single-select-status-'+pTrainingId).val(); 
				
				var objToAdd = new Object();
				
				objToAdd.Docid = pTrainingId;
				objToAdd.selectedstatusvalue = valStatus;
				objToAdd.selectedCompletenessvalue = valCompleteness;
				objToAdd.trainingAssets = myaccomplishments._getTrainingAssets(pTrainingId);
				
				var objRemarks = new Object();
				objRemarks.userName = myaccomplishments.currentUser;
				objRemarks.dateAndTime = new Date().getDate()+" "+myaccomplishments._getCurrentMonth()+" "+new Date().getFullYear()+" "+ new Date().toLocaleTimeString(); 
				objRemarks.description = $('#txtArea-Remarks-'+pTrainingId).val();
				
				objToAdd.remark = [objRemarks];
				
				myaccomplishments._addElementToArray(objToAdd, myaccomplishments.KnowledgeStatusCompletenessChanged)
			}
		}		
	},
	
	_getTrainingAssets:function(pTrainingId)
	{
		var result = $.grep(myaccomplishments.KnowledgeStatusCompletenessChanged, 
					function(e){ return e.Docid == pTrainingId; });
		
		var retVal = [];	
		if(result.length > 0)
		{
			if (result[0].trainingAssets)
				retVal = result[0].trainingAssets;
		}
		
		return retVal;	
	},
	
	_getCurrentMonth: function(pMonth = -1){
		var mmm = "";
		var month = new Array();
		
	    month[0] = "Jan";
	    month[1] = "Feb";
	    month[2] = "Mar";
	    month[3] = "Apr";
	    month[4] = "May";
	    month[5] = "Jun";
	    month[6] = "Jul";
	    month[7] = "Aug ";
	    month[8] = "Sep";
	    month[9] = "Oct";
	    month[10] = "Nov";
	    month[11] = "Dec";
	    var d = new Date();
		if (pMonth == -1)
			mmm = month[d.getMonth()];
		else
			mmm = month[pMonth];
	    return mmm;
	},
		
	GetAssignationEntrybyID:function(docid, pFunctionInvoker = "")
	{
			var requestObject = new Object();
			requestObject.title = myaccomplishments.searchObj.input.replace(/\//g, " ");
			requestObject.searchString = "_id:" + docid ;
			requestObject.projectName = localStorage.getItem('multiProjectName');
			requestObject.maxResults = myaccomplishments.requestSearchCount;
			requestObject.serachType = "similar";

			var collectionName = myaccomplishments.searchObj.indexes;
			requestObject.collectionName = collectionName;
			
			if (pFunctionInvoker == "")
			ISE.getSearchResults(requestObject, myaccomplishments._updateHandler);               
			else if (pFunctionInvoker == "remarkInvoked")
				ISE.getSearchResults(requestObject, myaccomplishments._renderPrvRemarks);
			else if (pFunctionInvoker == "attachmentInvoked")
				ISE.getSearchResults(requestObject, myaccomplishments._renderPrvAttachments);
	},
	
	_updateHandler:function(dataObj) 
	{
		if(dataObj != undefined)
		{
			var result = $.grep(myaccomplishments.KnowledgeStatusCompletenessChanged, 
					function(e){ return e.Docid == dataObj[0]._id; });
		
			var tempArr = dataObj[0].userRemarks;			
			if (result[0].remark && tempArr)
			{
				tempArr = tempArr.concat(result[0].remark);
			}
			else
			{
				tempArr = result[0].remark;
			}
												
			if(result.length > 0)
			{
				dataObj[0].status =  result[0].selectedstatusvalue;
				dataObj[0].completeness =  result[0].selectedCompletenessvalue;
				dataObj[0].userRemarks = tempArr;
				dataObj[0].trainingAssets = (result[0].trainingAssets.length == 0 && dataObj[0].trainingAssets)
											? dataObj[0].trainingAssets 
											: result[0].trainingAssets;				
				ISE.UpdatePackageAssignationEntryMongo(dataObj[0],myaccomplishments._UpdatePackageAssignationResultHandler);
			}

			myaccomplishments.removeArrayValue(dataObj[0]._id, myaccomplishments.KnowledgeStatusCompletenessChanged);	
		}
	},
	
	_renderPrvRemarks:function(dataObj)
	{
		if(dataObj != undefined)
		{
			$("#page_myaccomplishments #prvRemarksModalContainer #prvRemarksListContainer").empty();
			
			if (dataObj[0].userRemarks)
			{
				var prvRemarks = dataObj[0].userRemarks;
				
				prvRemarks.sort(function(a, b) {
					return new Date(b.dateAndTime).getTime() - new Date(a.dateAndTime).getTime()
				})
				
				for (var i = 0; i < prvRemarks.length; i++)
				{
					myaccomplishments._plotRemarks(prvRemarks[i]);
				}
			}
		}
	},
	
	_renderPrvAttachments:function(dataObj)
	{
		if(dataObj != undefined)
		{
			myaccomplishments.arrTrainingAssets = myaccomplishments._getTrainingAssets(dataObj[0]._id);
			if (myaccomplishments.arrTrainingAssets)
			{
				if (dataObj[0].trainingAssets && myaccomplishments.arrTrainingAssets.length == 0)
				{				
					myaccomplishments.arrTrainingAssets = myaccomplishments.arrTrainingAssets.concat(dataObj[0].trainingAssets);
				}
				
				for (var i = 0; i < myaccomplishments.arrTrainingAssets.length; i++)
				{
					myaccomplishments.renderFileView(myaccomplishments.arrTrainingAssets[i].assetType, myaccomplishments.arrTrainingAssets[i].assetName, myaccomplishments.arrTrainingAssets[i].modifiedDate, myaccomplishments.arrTrainingAssets[i].fileSize, i);
				}
			}
		}
		
		if (myaccomplishments.isUploadEnabled)
			$("#page_myaccomplishments #attachmentListContainer .glyphicon.glyphicon-remove").show();
		else
			$("#page_myaccomplishments #attachmentListContainer .glyphicon.glyphicon-remove").hide();
	},
	
	renderFileView: function(type, fileName, modifiedDate, fileSize, assetIndex){
		 var mDate = new Date(modifiedDate)		 
		 var dateInFormat = mDate.getDate() + "-" + myaccomplishments._getCurrentMonth(mDate.getMonth()) + "-" + mDate.getFullYear() + " " + mDate.getHours() + ":" + mDate.getMinutes(); 
         var htmlContent = '<div class="col-md-12 list-element file-holder alert alert-warning added-files"><div class="col-md-4"><a href="javascript:;" onclick="myaccomplishments._downloadAttachment(this)">'+fileName+'</a></div><div class="col-md-4">'+dateInFormat+'</div><div class="col-md-2">'+(parseFloat(fileSize)).toFixed(2)+' MB</div><div class="col-md-2"><span class="glyphicon glyphicon-remove pull-right" element-type="'+type+'" index="'+assetIndex+'"></span></div></div>';
         $("#page_myaccomplishments #attachmentListContainer").append(htmlContent);
    },
	
	_downloadAttachment: function(fileName){
		var url = "http://"+iseConstants.serverHost+":"+window.location.port+"/DevTest/FileServer/download/" +$(fileName).text()+ "?view=download&authToken="+ localStorage.authtoken;		
		window.location.href = url;
	},
	
	_attachmentHandler:function(pObject)
	{
		if (myaccomplishments.containsAttachments > 0)
		{
			//myaccomplishments.fileUploader.start();
			myaccomplishments.fileUploader.startUpload();
		}
		else
		{
			alert("Please select a file to upload.");
			ISEUtils.portletUnblocking("pageContainer");
			return;
		}					
	},

	_plotRemarks:function(pObjRemark)
	{
		var htmlContent = '<div style="max-width:98%;margin-bottom:10px;" class="col-md-12 list-element video-holder"><div class="row col-md-1"><span class="glyphicon glyphicon-user" aria-hidden="true"></span></div><div class="col-md-11 content-conatiner"><div><span style="color:green;font-size:14px;font-weight:normal";>'+pObjRemark.description+'</span></div><span>'+pObjRemark.userName+'</span>  <span>'+pObjRemark.dateAndTime+'</span></div></div>';		
		$("#page_myaccomplishments #prvRemarksModalContainer #prvRemarksListContainer").append(htmlContent);
	},
			
	_UpdatePackageAssignationResultHandler: function(data_obj){
		$.notific8('Assignation has been updated successfully.', {
			 life: 2000,
			 theme: 'lime',
			 sticky: false,
			 zindex: 11500
		});			
		myaccomplishments.refreshdata();	
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
	},
	_filterInternal: function () {			
			var oTable = $('#page_myaccomplishments .map-table-conatainer #mapTableData').dataTable();			
			var currectSelectedTabel = oTable.DataTable();
			currectSelectedTabel.search(
				$('#page_myaccomplishments #searchLocalDoc').val(),
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


				$('#page_myaccomplishments .page-toolbar').load("actions.html", function() {

					$.getScript("js/subpages/actions.js")
						.done(function() {
							myaccomplishments.actionsRef = actions;
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

