var tablerigtcomponent = {

//Variable Decleration

   tablecomponents_table:'',
	rows_selected:[],
	isAddFilterButtonToTable:false,
	moreFilterObj : {},
	allDeleteDocs:[],
	allDeletedDocArray:[],
	allPackagedDocArray:[],
	jsonTableDetails:[],
	columnListDetailsArray:{},
	mobileViewTableColumnCollection:[],
	hideTableColumns:[],
	crIdFileds:[],
	requestSearchCount:5,
	json_doc_data: {},
	docDetails:{},
	tableJSON:'',
	dataTableID:'',
	isAddPreviewButtonToTable:false,
	isColumnsShow:false,
	modalRefContainerForFilter:'',
	tabelIDParentConatiner:'',
    /* Init function  */
    init: function() {
		
		tablerigtcomponent._filterSearchPortletHeaderDropDown();
		//tablerigtcomponent.loadDummyData();
		 
		
    },
	_setTableJSON: function(json_filename){
		tablerigtcomponent.tableJSON = json_filename;
	},
	_setdataTableID: function(table_id){
		tablerigtcomponent.dataTableID = table_id;
	},
	_setisAddFilterButtonToTable: function(val){
		tablerigtcomponent.isAddFilterButtonToTable = val;
	},
	_setModalRefContainer: function(container_ref){
		tablerigtcomponent.modalRefContainerForFilter = container_ref;
	},
	_setisColumnsShow: function(val){
		tablerigtcomponent.isColumnsShow = val;
		if(tablerigtcomponent.isColumnsShow)
			$("#tableDataRightContainer .coloumn-toggler").show();
		else
			$("#tableDataRightContainer .coloumn-toggler").hide();
	},
	_setTabelIDParentConatiner: function(par_container){
		tablerigtcomponent.tabelIDParentConatiner = par_container;
	},
	_filterSearchPortletHeaderDropDown: function() {

		var roleName = localStorage.getItem('rolename');


		$('#tableDataRightContainer .kps-table-conatainer #searchKDFilterDropdown').empty();
		//$('#searchResultsTabs').empty();
		//$('#resultTabContent').empty();
		 
		
		$.getJSON("json/"+tablerigtcomponent.tableJSON+".json?", function(data) {

			tablerigtcomponent.jsonTableDetails = data;
			
			tablerigtcomponent.columnListDetailsArray = {};
			$.each(data.TableDetails, function(key, item) {
			 
				//  Filter Search List will be added based on role.
				if (item.enable == "yes") {

					for (var i = 0; i < item.allowedroles.length; i++) {

						if (item.allowedroles[i] == roleName) {

							var displayName = item.displayName; 
							 
							$('#tableDataRightContainer .kps-table-conatainer').append('<div class="col-sm-12 table-scrollable1 table-responsive"><table class="table table-striped table-bordered table-hover dataTable" id="'+tablerigtcomponent.dataTableID+'"></table></div>')
							$('#tableDataRightContainer #'+tablerigtcomponent.dataTableID+'').append("<thead><tr id=tableheader_" + displayName + "></tr></thead><tbody id=tablebody_" + displayName + "></tbody>");

							//knowledgestore.listTableId.push('kwdgPackageTableData' + displayName);

							// Set Table Heading for all columns
						 
							$('#tableDataRightContainer .kps-table-conatainer #tableheader_' + displayName).append('<th class="table-checkbox"><input type="checkbox" name="group-checkable" class="group-checkable" data-set="#tableDataRightContainer .kps-table-conatainer #'+tablerigtcomponent.dataTableID+' .checkboxes"/></th>');
							 

							for (var j = 0; j < item.Details.fields.length; j++) {                                

								if(item.Details.fields[j].displayType != "expansion")
								$('#tableDataRightContainer .kps-table-conatainer #tableheader_' + displayName).append("<th class='sorting ISEcompactAuto'>" + item.Details.fields[j].displayName + "</th>");
							}
							
							//Preview Column at last
							if(tablerigtcomponent.isAddFilterButtonToTable)
								$('#tableDataRightContainer .kps-table-conatainer #tableheader_' + displayName).append("<th class='preview-heading'>Action</th>");
						   // console.log($('#tableheader_' + displayName))
							
							var dropDownBoxId = "columnToggler_" + displayName;
							var tableID = tablerigtcomponent.dataTableID;
							var _obj = new Object();
							_obj.dropDownBoxId = 'KSPcolumnTogglerDropdown';//dropDownBoxId;
							_obj.tableID = tableID;
							_obj.defaultView = item.defaultView;
							_obj.itemDetailsfields = item.Details.fields;
							_obj.indexes = item.indexName;
							_obj.displayName = displayName;
							
							tablerigtcomponent.columnListDetailsArray = _obj;
							//defectsearch._fillColumnListinDropdown(dropDownBoxId, tableID, item.defaultView, item.Details.fields);

							tablerigtcomponent.mobileViewTableColumnCollection.push({
								"tableID": tablerigtcomponent.dataTableID ,
								"columnsList": item.mobileView,
								"dropdownID": 'columnToggler_' + displayName
							});
						}
					}
					  
				}
					
					 
			});
			
			////$('#dataTablePageChange select').prop('selectedIndex',0);
			//$('#page_defectsearch #searchResultsTabs li').on ('click', defectsearch._resultTabClickEventHandler);
			////$('#filter_global input.global_filter').on ('keyup', knowledgestore._filterGlobal);
			//$("#starRatingTable a.dropdown-toggle").on('click', defectsearch._renderRatingPopupData);
			var getCurrentSelectedTabData = tablerigtcomponent.columnListDetailsArray;
			 tablerigtcomponent._fillColumnListinDropdown(getCurrentSelectedTabData.dropDownBoxId, getCurrentSelectedTabData.tableID, getCurrentSelectedTabData.defaultView, getCurrentSelectedTabData.itemDetailsfields);
			var elements = document.querySelectorAll('#tableDataRightContainer .kps-table-conatainer #searchKDFilterDropdown label input:checked');
		   Array.prototype.map.call(elements, function(el, i) {
			if(i>0)
			{
			 $(el).removeAttr("checked");
			 var resultsTabId = $(el).attr("resultTabID");
			 var resultsTabInnerContainerID = $(el).attr("resultTabInnerContainerID");
			 $("#tableDataRightContainer .kps-table-conatainer #" + resultsTabId).addClass("hide");
			 $("#tableDataRightContainer .kps-table-conatainer #" + resultsTabInnerContainerID).removeClass("active in");
			}               
		}); 

		$( "#"+tablerigtcomponent.tabelIDParentConatiner ).trigger( ikeEventsConstants.COMPLETED_FILL_TABLE_AND_COLUMN_FILTER); 

		});
	},
	
	/*loadDummyData: function(){
		$.getJSON("json/dummyRightSearchData.json?", function(data) {
			
		tablerigtcomponent.json_doc_data = data;
		tablerigtcomponent._receivedSearchResults(tablerigtcomponent.json_doc_data);
		});
	},*/
	
	_fillColumnListinDropdown: function(dropDownBoxId, tableID, defaultColumnView, ColumnsList) {

		$('#tableDataRightContainer #' + dropDownBoxId).empty();

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
				   tablerigtcomponent.crIdFileds.push(crIdArr[0][j]); 
			  } 
			  }

	   
		var colunmnID = 0;
		var tableColumnID = 0;
		var tableHideColumns = new Array();
		$.grep(tempArr, function(element) {

			colunmnID = colunmnID + 1;


			if ($.inArray(element, defaultColumnView) !== -1) {

				$('#tableDataRightContainer #' + dropDownBoxId).append('<label><input type="checkbox" name="column" checked="true" columnID=' + colunmnID + '  data-column=' + colunmnID + '>' + element + '</label>');
			} else {

				tableColumnID = colunmnID + 1;
				tableHideColumns.push(parseInt(tableColumnID));
				$('#tableDataRightContainer #' + dropDownBoxId).append('<label><input type="checkbox" name="column"  columnID=' + colunmnID + ' data-column=' + colunmnID + '>' + element + '</label>');

			}

		});

		tablerigtcomponent.hideTableColumns.push({
			"tableID": tableID,
			"hideColumnsList": tableHideColumns,
			"allColumnsNames": tempArr
		});


		$('#tableDataRightContainer input[type="checkbox"]').change(function() {

		   var iCol = parseInt($(this).attr("data-column"));
			iCol = iCol;
			var oTable = $('#tableDataRightContainer .kps-table-conatainer #' + tableID).dataTable();

			var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
			oTable.fnSetColumnVis(iCol, bVis ? false : true);
			var chkVal = $(this).parent().text();
			if(bVis)
				tablerigtcomponent._insertOrDeleteDefaultTableColValue(chkVal, 'remove');
			else
				tablerigtcomponent._insertOrDeleteDefaultTableColValue(chkVal, 'insert');
			
			var table_wrapper = $('#tableDataRightContainer .kps-table-conatainer #' + tableID+'_wrapper')
			if( table_wrapper.width() > oTable.width() )
			{
				table_wrapper.css('overflow-x', 'visible')
			}else{
				table_wrapper.css('overflow-x', 'none')
			}
			
			////knowledgestore._resizeRateitColumnHeading();
		});
		$( "#tableDataRightContainer .kps-table-conatainer #dataTablePageChange select" ).on('change', function() {
			console.log($( this ).val());
			tablerigtcomponent.requestSearchCount = $( this ).val();
			
			 /* if(defectsearch.mainSearchCurrentTab == 0){
				defectsearch._similarSearchIdKeyUpFunc();
			 }else if(defectsearch.mainSearchCurrentTab == 1){
				defectsearch._contextSearchKeyUpFunc();
			 }else if(defectsearch.mainSearchCurrentTab == 2){
				 defectsearch.advancedSearchKeyUpFunc(); 
				 
			 }else if(defectsearch.mainSearchCurrentTab == 3){
				defectsearch._fileSearchKeyUpFunc();
			 } */
			 
			/* defectsearch.noOfEntries = $( this ).val();
			var oTable = $('#' + tableID).dataTable();
			var currectSelectedTabel = oTable.DataTable();
			currectSelectedTabel.page.len(defectsearch.noOfEntries).draw(); */
		});

	},
	
	_insertOrDeleteDefaultTableColValue:function(chkVal, action){
		//for(var i=0; i<knowledgestore.columnListDetailsArray.length; i++){
			if( tablerigtcomponent.columnListDetailsArray.displayName){
			 if(action=='insert'){
				tablerigtcomponent.columnListDetailsArray.defaultView.push(chkVal);
			 }else if(action=='remove'){
				var k = tablerigtcomponent.columnListDetailsArray.defaultView.indexOf(chkVal);
				if(k != -1) {
					tablerigtcomponent.columnListDetailsArray.defaultView.splice(k, 1);
				}
			 }
			 tablerigtcomponent.columnListDetailsArray.defaultView = tablerigtcomponent._uniqueArray(tablerigtcomponent.columnListDetailsArray.defaultView);
			}
		//}
		
		 
	},
	
	_receivedSearchResults: function(dataObj) {
		tablerigtcomponent.json_doc_data = dataObj;
		//var defectId = escape($('#searchID').val().trim());
		//debugger;
		if (ISEUtils.validateObject(dataObj)) {
			

			var FieldsMap = {};
			var DisplayNameMap = {};
			var displayColumns = {};
			var tC = {};

		 
			for (var K in tablerigtcomponent.jsonTableDetails.TableDetails) {

				  
				 var temp = new Array();
				 for(var l=0;l<tablerigtcomponent.jsonTableDetails.TableDetails[K].Details.fields.length;l++){

				   var obj =tablerigtcomponent.jsonTableDetails.TableDetails[K].Details.fields[l];
					  if(obj.displayType != "expansion")                          
						 temp.push(obj);                         

				 }

				FieldsMap[tablerigtcomponent.jsonTableDetails.TableDetails[K].indexName] = temp;
				DisplayNameMap[tablerigtcomponent.jsonTableDetails.TableDetails[K].indexName] = tablerigtcomponent.jsonTableDetails.TableDetails[K].displayName;
				displayColumns[tablerigtcomponent.jsonTableDetails.TableDetails[K].indexName] = tablerigtcomponent.jsonTableDetails.TableDetails[K].defaultView;
			}


			var sortField = 1;
			var fields = FieldsMap[dataObj[0]._index];
			for (var ii = 0; ii < fields.length; ii++) {
				if (fields[ii].SourceName == 'similarity') sortField = ii + 1;
			}


			for (var i = 0; i < dataObj.length; i++) {
			
			var issimilarDefectId = false;

				var fields = FieldsMap[dataObj[i]._index];
				var dName = DisplayNameMap[dataObj[i]._index];
				var tableID = '#tableDataRightContainer .kps-table-conatainer #'+tablerigtcomponent.dataTableID+'';
				if (!tC[tableID]) {

					var oTable = $(tableID).dataTable();
					oTable.fnClearTable();
					oTable.fnDestroy();
				}
				tC[tableID] = 1;

				var documentIdColumnName = "_id";
				var indexCollectionname = "_index";
				  var documenttype = "type";
				var documenttype = escape(dataObj[i][documenttype]); 
				if(!documenttype || documenttype == 'undefined'){
					documenttype = 'file'
				}
				var documentID = escape(dataObj[i][documentIdColumnName]);
				var filter = dataObj[i]["filter"];
				  var sourceLineURL="sourceline";
				  var row_inc = (i+1);
				   
						var newRowContent = '<tr class="odd gradeX" data-row-id="'+row_inc+'"><td><input document-id="'+documentID+'"  type="checkbox" class="checkboxes" value="'+row_inc+'"/></td>';
					 
				for (var ii = 0; ii < fields.length; ii++) {

				   var documentID = escape(dataObj[i][documentIdColumnName]);
				   var simplifyURL = (dataObj[i]["simplifyURL"]);
					  var indexCollection = escape(dataObj[i][indexCollectionname]); 
				   var sourceLine = escape(dataObj[i][sourceLineURL]);						  

					  if(documentID === undefined){
						  newRowContent += '<td class="ISEcompactAuto"><span sourceLine="null" documentID="null" indexCollection="null" requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';
					  }else{
							  if(fields[ii].displayType.toLowerCase() == "date")                           
							   {
								 var dateObj = dataObj[i][fields[ii].SourceName];
								 var newDateObj = new Date(dateObj);	
								 //console.log("DDDDDDDDD");								 
							   newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + newDateObj + '</span></td>';
							   } else if(fields[ii].displayName.toLowerCase() == "description" || fields[ii].displayName.toLowerCase() == "title"){
								   //console.log("HELLO");
									String.prototype.replaceAll = function(target, replacement) {
										return this.split(target).join(replacement);
									};
									var textContent = dataObj[i][fields[ii].SourceName];
									
										if(fields[ii].displayName.toLowerCase() == "description" &&  undefined !=textContent && 'undefined' != textContent){
											textContent = textContent.replaceAll('&nbsp;','<br>');
											textContent = textContent.replaceAll("<em class='iseH'>",'##');
											textContent = textContent.replaceAll("</em>","#");
										}
									if(textContent == '' || textContent == 'undefined' || textContent == undefined || textContent.length == 0){
										newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '> No data </span></td>';
									}else if(textContent.length > 0 && textContent){
										if(fields[ii].displayName.toLowerCase() == "title")
											var subTextContent = textContent.substring(0,18);
										else
											var subTextContent = textContent.substring(0,100);
										
										 if(fields[ii].displayName.toLowerCase() == "description" ){
											subTextContent = subTextContent.replaceAll('<br>','&nbsp;');
											subTextContent = subTextContent.replaceAll('##','<em class="iseH">');
											subTextContent = subTextContent.replaceAll("#","</em>");
										}
										//console.log(subTextContent);
										var escapeContent = escape(textContent);
										if(textContent.length >= 0 && fields[ii].displayName.toLowerCase() == "title" ){
											newRowContent += '<td class="ISEcompactAuto"><span title="'+escapeContent+'" sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' desc-data='+escapeContent+'><span href="javascript:;" doc-id="'+documentID+'" id="kdTitleRow">' +subTextContent+'</span></span></td>';
											
										}else if(textContent.length > 0 && textContent.length < 100){
											newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' desc-data='+escapeContent+'>' + subTextContent + '</span></td>';
										}else{
											 
											newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' desc-data='+escapeContent+'>' +subTextContent+'<a modalTitle='+fields[ii].displayName+'  moreTextContent=' + escapeContent + ' class="name" onClick="tablerigtcomponent._onExpandRowMoreContentModal(this)">  more... </a></span></td>';
											
										}
									}											
							   }else{
								
									newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';
								}
					   }
						 // newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';
								  
						

				}
				if(tablerigtcomponent.isAddFilterButtonToTable)
				 newRowContent += '<td id="actionTd"> <div class="btn-group"><button type="button" documentID='+documentID+' filter="'+filter+'" class="btn btn-circle grey-mint btn-outline btn-xs filter-btn">FILTER</button></div></td>';
				newRowContent += '</tr>';
				$('#tableDataRightContainer .kps-table-conatainer #tablebody_' + dName).append(newRowContent);
			

			}

			for (var tab in tC) {
					
			var tableColumnsCount = $(tab).find('tr')[0].cells.length;
				var tempArr = new Array();
				 for(var i=1;i<tableColumnsCount;i++){
					tempArr.push(i);                    
			}
			tablerigtcomponent._handleUniform();
			
				tablerigtcomponent.tablecomponents_table =  $('#tableDataRightContainer .kps-table-conatainer #'+tablerigtcomponent.dataTableID+'').DataTable({
				//var oTable = $(tab).dataTable({
				
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
				//Preview Click
				$('#tableDataRightContainer .kps-table-conatainer tbody .filter-btn').live('click', function(e){
					
					console.log("preview: ~~~ "+e);
					debugger;
					var docID = $(this).attr("documentID");
					var filter = $(this).attr("filter");
					var docDetails = tablerigtcomponent._getDocDetails(docID);
					
					$('#'+tablerigtcomponent.modalRefContainerForFilter+'').modal('show');
					
					$('#'+tablerigtcomponent.modalRefContainerForFilter+' .visualization-name').text(docID);
					if (filter !== undefined && filter !== "undefined")					
						$('#'+tablerigtcomponent.modalRefContainerForFilter+' #txtVisualizationFilter').val(filter);
					else
						$('#'+tablerigtcomponent.modalRefContainerForFilter+' #txtVisualizationFilter').val("");
				});
				//$('#kwdgPackageTableData').on( 'draw.dt', function () {
					//console.log( 'Redraw occurred at: '+new Date().getTime() );
					//console.log( 'jh : '+$("#kwdgPackageTableData").DataTable().page.info().recordsTotal);
					var total_rec_count = $('#tableDataRightContainer .kps-table-conatainer #'+tablerigtcomponent.dataTableID+'').DataTable().page.info().recordsTotal;
					$('#tableDataRightContainer .kps-table-conatainer #docActionContainer1 .kwdg-store-doc-count').text(total_rec_count+' Results')
				//} );
				$("#tableDataRightContainer .kps-table-conatainer tbody #kdTitleRow").live('click', function(e){
					var doc_id = $(this).attr("doc-id");
					console.log("Selected Knowladge: "+doc_id)
				});
				$("#tableDataRightContainer .kps-table-conatainer tbody #kdMoreInfoBtn").live('click', function(e){
					console.log("e: ~~~ "+e);
					 console.log($(this).attr("doc-id"));
					 
					 var docID = $(this).attr("doc-id");
					 tablerigtcomponent.docDetails = tablerigtcomponent._getDocDetails(docID)
					 $("#tableDataRightContainer .kps-table-conatainer #popover_container .popover-heading").text(tablerigtcomponent.docDetails.title);
					// var popoverBody = '<div class="row"> <div class="col-md-12"><div class="form-group" id="docMoreInfoContent"> <p> Published on <span> '+docDetails.published_at+' </span><br> User <span>'+docDetails.user+'</span> </p><p>File Name: '+docDetails.fileName+'</p></div><div class="btn-group"><a class="btn btn-xs btn-success" id="openDocBtn" data-apply="confirmation">Open</a><a class="btn btn-xs default" id="shareDocBtn" data-apply="confirmation"> Share</a></div></div></div>';
					// $("#popover_container .popover-body").html(popoverBody);
					 
					 $("[data-toggle=popover]").popover({
						html : true,
						container: '#tableDataRightContainer .kps-table-conatainer #popover_container',
						title:function() {
						  var title = $(this).attr("data-popover-content");
						  return $(title).children(".popover-heading").html();
						},
						content: tablerigtcomponent._getPopoverBodyContent(tablerigtcomponent.docDetails)
					});
					//debugger;
				});
				$('#tableDataRightContainer .kps-table-conatainer #'+tablerigtcomponent.dataTableID+' tbody').on('click', 'input[type="checkbox"]', function(e){
					  var $row = $(this).closest('tr');

					  // Get row data
					  var data = tablerigtcomponent.tablecomponents_table.row($row).data();

					  // Get row ID
					  var rowId = data[0];

					  // Determine whether row ID is in the list of selected row IDs 
					  var index = $.inArray(rowId, tablerigtcomponent.rows_selected);

					  // If checkbox is checked and row ID is not in list of selected row IDs
					  if(this.checked && index === -1){
						 tablerigtcomponent.rows_selected.push(rowId);
						
					  // Otherwise, if checkbox is not checked and row ID is in list of selected row IDs
					  } else if (!this.checked && index !== -1){
						 tablerigtcomponent.rows_selected.splice(index, 1);
					  }

					  if(this.checked){
						 $row.addClass('selected');
					  } else {
						 $row.removeClass('selected');
					  }

					  // Update state of "Select all" control
					  tablerigtcomponent._updateDataTableSelectAllCtrl(tablerigtcomponent.tablecomponents_table);
					 //
					 if(tablerigtcomponent.rows_selected.length > 0){
						$('#tableDataRightContainer .kps-table-conatainer #addKnowledgeDocument').removeClass('disabled');
						$('#tableDataRightContainer .kps-table-conatainer #removeKnowledgeDocument').removeClass('disabled');
					 }else{
						 $('#tableDataRightContainer .kps-table-conatainer #addKnowledgeDocument').addClass('disabled');
						 $('#tableDataRightContainer .kps-table-conatainer #removeKnowledgeDocument').addClass('disabled');
					 }
					  // Prevent click event from propagating to parent
					  e.stopPropagation();
				   });

				   // Handle click on table cells with checkboxes
				   $('#tableDataRightContainer .kps-table-conatainer #'+tablerigtcomponent.dataTableID+'').on('click', 'tbody td, thead th:first-child', function(e){
					  //$(this).parent().find('input[type="checkbox"]').trigger('click');
				   });

				   // Handle click on "Select all" control
				   $('thead input[name="group-checkable"]', tablerigtcomponent.tablecomponents_table.table().container()).on('click', function(e){
					  if(this.checked){
						 $('#tableDataRightContainer .kps-table-conatainer #'+tablerigtcomponent.dataTableID+' tbody input[type="checkbox"]:not(:checked)').trigger('click');
					  } else {
						 $('#tableDataRightContainer .kps-table-conatainer #'+tablerigtcomponent.dataTableID+' tbody input[type="checkbox"]:checked').trigger('click');
					  }

					  // Prevent click event from propagating to parent
					  e.stopPropagation();
				   });

				   // Handle table draw event
				   tablerigtcomponent.tablecomponents_table.on('draw', function(){
					  // Update state of "Select all" control
					 tablerigtcomponent._updateDataTableSelectAllCtrl(tablerigtcomponent.tablecomponents_table);
				   });
					  
					$('#tableDataRightContainer .kps-table-conatainer #removeKnowledgeDocument').click( function () {
						tablerigtcomponent.allDeleteDocs = [];
						tablerigtcomponent.allDeletedDocArray = [];
						$('#tableDataRightContainer .kps-table-conatainer #'+tablerigtcomponent.dataTableID+' .checkboxes:checked').each(function() {  
							 var __obj = new Object();
							 __obj.value = $(this).attr('value');
							 __obj.documentid = $(this).attr('document-id');
							tablerigtcomponent.allDeletedDocArray.push(__obj);
							tablerigtcomponent.allDeleteDocs.push($(this).attr('value'));
						});
						if(tablerigtcomponent.allDeleteDocs.length <=0)  
						{  
							alert("Please select atleast one document to delete.");  
						}else{
							
							var c = confirm('Are you sure you want to delete this document?');
							if(c){
								//for client side
								 $.each(tablerigtcomponent.allDeleteDocs, function( index, value ) {
									  //$('#page_knowledgestore #kwdgPackageTableData tr').filter("[data-row-id='" + value + "']").remove().draw( false );
									  var $rowData = $('#tableDataRightContainer .kps-table-conatainer #'+tablerigtcomponent.dataTableID+' tr').filter("[data-row-id='" + value + "']")
									  tablerigtcomponent.tablecomponents_table.row($rowData).remove().draw( false );
								  });
								  $('#tableDataRightContainer .kps-table-conatainer #addKnowledgeDocument').addClass('disabled');
								  $('#tableDataRightContainer .kps-table-conatainer #removeKnowledgeDocument').addClass('disabled');
								  console.log("Deleted values are : "+JSON.stringify(tablerigtcomponent.allDeletedDocArray));
							}
						}
					} );
					

					 

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
					cols = tablerigtcomponent._getColumnNamesList(tID);//todo
					
					var oTable = $('#tableDataRightContainer .kps-table-conatainer #' + tID).dataTable();

					if (oTable.fnIsOpen(nTr)) {
						/* This row is already open - close it */
						$(this).addClass("row-details-close").removeClass("row-details-open");
						oTable.fnClose(nTr);
					} else {
						// Open this row 
						$(this).addClass("row-details-open").removeClass("row-details-close");
						oTable.fnOpen(nTr, tablerigtcomponent._fnDefectSearchRowFormatDetails(oTable, nTr, cols), 'details');//todo
				   
					 /* $("#report tr:odd").addClass("odd");
					   $("#report tr:not(.odd)").hide();
					   $("#report tr:first-child").show();
						
							
					   $("#report tr.odd").click(function(event){

						  
							 $(this).next("tr").toggle();
								$(this).find(".arrow").toggleClass("up");
							 //$(this).closest("span").find(".row-details-close").toggleClass('row-details-open');
							   

							 // $(this).find(".row-details-close").toggleClass("row-details-open");
							  //$(this).find(".row-details-open").toggleClass("row-details-close");
						});*/


					}

				});

			}

			for (var i = 0; i < tablerigtcomponent.hideTableColumns.length; i++) {
				var iTD = '#tableDataRightContainer .kps-table-conatainer #' + tablerigtcomponent.hideTableColumns[i].tableID;
				if (!tC[iTD]) continue;


				var tempstr = iTD.split("_");
				

				var table = $(iTD).DataTable();
				for (var j = 0; j < tablerigtcomponent.hideTableColumns[i].hideColumnsList.length; j++) {

					var columnID = tablerigtcomponent.hideTableColumns[i].hideColumnsList[j] - 1;                      
					table.column(columnID).visible(false, false);
					$('#tableDataRightContainer .kps-table-conatainer #columnToggler_'+tempstr[2]+' input[columnid='+columnID+']').attr('checked', false)
				}
			}
			
			$('#tableDataRightContainer .kps-table-conatainer #searchResultsTable').removeClass("hide");

			tablerigtcomponent.searchResultsReceived = true;


			//  Hide Table rows dropdown and Table Search
			$("div").find("#tableDataRightContainer .kps-table-conatainer .dataTables_length").addClass('hidden-sm hidden-xs');
			$("div").find("#tableDataRightContainer .kps-table-conatainer .dataTables_filter").addClass('hidden-sm hidden-xs');

			var windowWidth = $(window).width();
			if (windowWidth <= 400) {
				tablerigtcomponent.onResizeWindow();//todo
				$("html, body").animate({
					scrollTop: $(document).height()
				}, 1000);
			}
			
			 
			
		}/* else if($('#page_defectsearch #searchResultsTable').hasClass('hide') || $('#page_defectsearch #searchResultsTable').css('display') == 'block'){
									 
			if($('#searchResultsTable #searchResultsTabs').find('.active').length > 0) {                 
					if(!ISEUtils.validateObject(dataObj)){
						var tableID = '#sample_4_' + defectsearch.currentSelectedTabID;
						var oTable = $(tableID).dataTable();
						oTable.fnClearTable();
						//oTable.fnDestroy();
						//$(tableID).dataTable({bFilter: false, bPaginate:false, bInfo: false});
						$('#searchResultsTable').removeClass('hide').addClass('show');
					}
				} else{
					 $('#noDataDisplay').addClass('show');
				}
			//// Prabhu $('#searchResultsTable').hide();                        
		 }
 */
		  $("#tableDataRightContainer .kps-table-conatainer #addExpand").css("width", "3.40%");
		

		 var sourceCodeTableRowCount = $('#tableDataRightContainer .modal-body .table-containerr #sample_4_SourceCode tbody').children().length;      

		ISEUtils.portletUnblocking("pageContainer");

		 Pace.stop();
		 
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
	   $('#showMoreTextInfoCompModal #modelInfo').append("<div id='similarSearch_moreDescription2' class='form-control' style='height:450px;font-family:Courier' readonly=''></div>");
		
		String.prototype.replaceAll = function(target, replacement) {
						return this.split(target).join(replacement);
				};
				
				moreTextContent = moreTextContent.replaceAll('##','<em class="iseH">');
				moreTextContent = moreTextContent.replaceAll("#","</em>");
				moreTextContent = moreTextContent.replace(/.\t/g,". ");
		//$("#showMoreTextInfoCompModal #similarSearch_more_description").html(moreTextContent);
		document.getElementById("similarSearch_moreDescription2").innerHTML = moreTextContent;
	    $('#showMoreTextInfoCompModal #moreInfoModalTitle').text(modalTitle);
	  // $('#moreInfoModalTitle').
	   
	   //$('#modelInfo').append(bodyContent);
	   $("#showMoreTextInfoCompModal").modal("show");         
	 
	  

  },
  _getDocDetails:function(doc_id){
	  for(var i=0; i<tablerigtcomponent.json_doc_data.length; i++){
		  if(doc_id == tablerigtcomponent.json_doc_data[i]._id){
			  return tablerigtcomponent.json_doc_data[i];
		  }
	  }
	  
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
	
	 
	
};

