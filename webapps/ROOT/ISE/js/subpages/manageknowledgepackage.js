var manageknowledgepackage = {

	//Variable Declaration
	knowledgeaddpackage_table:'',
	rows_selected:[],	
    
	jsonTableDetails:[],
	columnListDetailsArray:{},
	mobileViewTableColumnCollection:[],
	hideTableColumns:[],	
	requestSearchCount:999,
	json_doc_data: {},
	docDetails:{},
	searchObj: new Object(),
	actionsRef:'',
	reinit: function(){
		manageknowledgepackage.actionsRef._setCurrentPage(ikePageConstants.MANAGE_KNOWLEDGE_PACKAGE);
		manageknowledgepackage.actionsRef._setTargetPage(ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
		manageknowledgepackage._initPackagePage();
	},
    /* Init function  */
    init: function() {
		
		manageknowledgepackage._filterSearchPortletHeaderDropDown();
		
		$('#searchContainer #searchLocalDoc').on ('keyup', manageknowledgepackage._filterInternal);

		$('.has-clear input[type="text"]').on('input propertychange', function() {
		  var $this = $(this);
		  var visible = Boolean($this.val());
		  $this.siblings('.form-control-clear').toggleClass('hidden', !visible);
		  
		}).trigger('propertychange');

		$('.form-control-clear').click(function() {
		  $(this).siblings('input[type="text"]').val('')
			.trigger('propertychange').focus();
		});
				
		$("#page_manageknowledgepackage #addNewContentDoc").on('click', function (e) {
			console.log("This is function is for  Add New Content Document. TODO");
		});
		
		$("#page_manageknowledgepackage #docPrint").on('click', function (e) {
			console.log("This is function is for Print Document. TODO");
		});
		
		$("#page_manageknowledgepackage #exportToPDF").on('click', function (e) {
			console.log("This is function is for Export to PDF. TODO");
		});
		
		$("#page_manageknowledgepackage #exportToExcel").on('click', function (e) {
			console.log("This is function is for Export to Excel. TODO");
		});
				
		//Defining role to enable Delete and Add to knoledge package.		
		manageknowledgepackage._allowPermission(manageknowledgepackage.userRole); 
		manageknowledgepackage.onLoadActionComponent(); 
    },
	 
	_allowPermission: function(user_role){
		
		switch(user_role){
			case 'manager':
				 
				 
			break;
			case 'admin':
				 
				 
			break;
		}
	},
	 
	_filterSearchPortletHeaderDropDown: function() {

		var roleName = localStorage.getItem('rolename');
		
		$.getJSON("json/manageKnowledgeTable.json?"+Date.now(), function(data) {

			manageknowledgepackage.jsonTableDetails = data;
			manageknowledgepackage.columnListDetailsArray = {};
			$.each(data.TableDetails, function(key, item) {
			 
				//  Filter Search List will be added based on role.
				if (item.enable == "yes") {

					for (var i = 0; i < item.allowedroles.length; i++) {

						if (item.allowedroles[i] == roleName) {

							var displayName = item.displayName;
							
							$('#page_manageknowledgepackage .mkp-table-conatainer').append('<div class="col-sm-12 table-scrollable1 table-responsive"><table class="table table-striped table-bordered table-hover dataTable" id="mkpTableData"></table></div>')
							$('#page_manageknowledgepackage #mkpTableData').append("<thead><tr id=tableheader_" + displayName + "></tr></thead><tbody id=tablebody_" + displayName + "></tbody>");
							
							// Set Table Heading for all columns
						 
							$('#page_manageknowledgepackage .mkp-table-conatainer #tableheader_' + displayName).append('<th class="table-checkbox"></th>');
							 

							for (var j = 0; j < item.Details.fields.length; j++) {                                

								if(item.Details.fields[j].displayType != "expansion")
								$('#page_manageknowledgepackage .mkp-table-conatainer #tableheader_' + displayName).append("<th class='sorting ISEcompactAuto'>" + item.Details.fields[j].displayName + "</th>");
							}
							
							var dropDownBoxId = "columnToggler_" + displayName;
							var tableID = 'mkpTableData' ;
							var _obj = new Object();
							_obj.dropDownBoxId = 'MKPColumnTogglerDropdown';
							_obj.tableID = tableID;
							_obj.defaultView = item.defaultView;
							_obj.itemDetailsfields = item.Details.fields;
							_obj.indexes = item.indexName;
							_obj.displayName = displayName;
							
							manageknowledgepackage.columnListDetailsArray = _obj;							
							manageknowledgepackage.mobileViewTableColumnCollection.push({
								"tableID": 'mkpTableData',
								"columnsList": item.mobileView,
								"dropdownID": 'columnToggler_' + displayName
							});
							
							manageknowledgepackage._initPackagePage();
						}
					}
					  
				}
					
					 
			});
			
			var elements = document.querySelectorAll('#page_manageknowledgepackage .mkp-table-conatainer #searchKDFilterDropdown label input:checked');
			Array.prototype.map.call(elements, function(el, i) {
				if(i>0)
				{
					 $(el).removeAttr("checked");
					 var resultsTabId = $(el).attr("resultTabID");
					 var resultsTabInnerContainerID = $(el).attr("resultTabInnerContainerID");
					 $("#page_manageknowledgepackage .mkp-table-conatainer #" + resultsTabId).addClass("hide");
					 $("#page_manageknowledgepackage .mkp-table-conatainer #" + resultsTabInnerContainerID).removeClass("active in");
				}               
			}); 
		});
	},
	
	_initPackagePage: function(){
					
		var getCurrentSelectedTabData = manageknowledgepackage.columnListDetailsArray;
		manageknowledgepackage._fillColumnListinDropdown(getCurrentSelectedTabData.dropDownBoxId, getCurrentSelectedTabData.tableID, getCurrentSelectedTabData.defaultView, getCurrentSelectedTabData.itemDetailsfields);
					
		manageknowledgepackage.searchObj.type = "";
		manageknowledgepackage.searchObj.input = "*";
		manageknowledgepackage.searchObj.indexes = "package_collection";
		manageknowledgepackage._processSearchRequest(true);   		
	},
	
	
	_processSearchRequest: function(updateURL) {
		console.log('~~~~~ _processSearchRequest  ~~~~~ ');
		
		if( manageknowledgepackage.searchObj.lastSearch) {
			if ( (Date.now() - manageknowledgepackage.searchObj.lastSearch) < 1500) {
				console.log("Trying to search within 1.5 seconds again, there is some bug in your code !! performing no search");
				return;
			}
		}
		manageknowledgepackage.searchObj.lastSearch = Date.now();
		
		if (updateURL) {
			manageknowledgepackage._updateURL();
		}

		if (manageknowledgepackage.searchObj.type == 'context') {

			var requestObject = new Object();

			requestObject.title = manageknowledgepackage.searchObj.input.replace(/\//g, " ");
			requestObject.searchString = requestObject.title;
			requestObject.projectName = localStorage.getItem('multiProjectName');
			requestObject.maxResults = manageknowledgepackage.requestSearchCount;
			requestObject.serachType = "conextsearch";

			var collectionName = manageknowledgepackage.searchObj.indexes;
			requestObject.collectionName = collectionName;
			ISE.getSearchResults(requestObject, manageknowledgepackage._receivedSearchResults);               
		}
		else
		{
			var requestObject = new Object();
			requestObject.title = manageknowledgepackage.searchObj.input.replace(/\//g, " ");
			requestObject.searchString = requestObject.title;
			requestObject.projectName = localStorage.getItem('multiProjectName');
			requestObject.maxResults = manageknowledgepackage.requestSearchCount;
			requestObject.serachType = "";

			var collectionName = manageknowledgepackage.searchObj.indexes;
			requestObject.collectionName = collectionName;
			ISE.getSearchResults(requestObject, manageknowledgepackage._receivedSearchResults);               
		}
	},
	
	_updateURL: function() {
		var s = JSON.stringify(manageknowledgepackage.searchObj, manageknowledgepackage._encodeSpecialText);
		var newURL = window.location.protocol + "//" + window.location.host;
		newURL = newURL + window.location.pathname + "?SearchObj=" + s + "#manageknowledgepackage";
		history.pushState("test", "test", newURL);
	},
	
	_fillColumnListinDropdown: function(dropDownBoxId, tableID, defaultColumnView, ColumnsList) {

		$('#page_manageknowledgepackage #' + dropDownBoxId).empty();

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

		
		var colunmnID = 0;
		var tableColumnID = 0;
		var tableHideColumns = new Array();
		$.grep(tempArr, function(element) {

			colunmnID = colunmnID + 1;


			if ($.inArray(element, defaultColumnView) !== -1) {

				$('#page_manageknowledgepackage #' + dropDownBoxId).append('<label><input type="checkbox" name="column" checked="true" columnID=' + colunmnID + '  data-column=' + colunmnID + '>' + element + '</label>');
			} else {

				tableColumnID = colunmnID + 1;
				tableHideColumns.push(parseInt(tableColumnID));
				$('#page_manageknowledgepackage #' + dropDownBoxId).append('<label><input type="checkbox" name="column"  columnID=' + colunmnID + ' data-column=' + colunmnID + '>' + element + '</label>');

			}

		});

		manageknowledgepackage.hideTableColumns.push({
			"tableID": tableID,
			"hideColumnsList": tableHideColumns,
			"allColumnsNames": tempArr
		});


		$('#page_manageknowledgepackage input[type="checkbox"]').change(function() {

		   var iCol = parseInt($(this).attr("data-column"));
			iCol = iCol;
			var oTable = $('#page_manageknowledgepackage .mkp-table-conatainer #' + tableID).dataTable();

			var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
			oTable.fnSetColumnVis(iCol, bVis ? false : true);
			var chkVal = $(this).parent().text();
			if(bVis)
				manageknowledgepackage._insertOrDeleteDefaultTableColValue(chkVal, 'remove');
			else
				manageknowledgepackage._insertOrDeleteDefaultTableColValue(chkVal, 'insert');
			
			var table_wrapper = $('#page_manageknowledgepackage .mkp-table-conatainer #' + tableID+'_wrapper')
			if( table_wrapper.width() > oTable.width() )
			{
				table_wrapper.css('overflow-x', 'visible')
			}else{
				table_wrapper.css('overflow-x', 'none')
			}					
		});
		$( "#page_manageknowledgepackage .mkp-table-conatainer #dataTablePageChange select" ).on('change', function() {
			console.log($( this ).val());
			manageknowledgepackage.requestSearchCount = $( this ).val();
		});

	},
	
	_insertOrDeleteDefaultTableColValue:function(chkVal, action){
		if( manageknowledgepackage.columnListDetailsArray.displayName){
			if(action=='insert'){
				manageknowledgepackage.columnListDetailsArray.defaultView.push(chkVal);
			}else if(action=='remove'){
				var k = manageknowledgepackage.columnListDetailsArray.defaultView.indexOf(chkVal);
				if(k != -1) {
					manageknowledgepackage.columnListDetailsArray.defaultView.splice(k, 1);
				}
			}
			manageknowledgepackage.columnListDetailsArray.defaultView = manageknowledgepackage._uniqueArray(manageknowledgepackage.columnListDetailsArray.defaultView);
		}		
	},
	
	_receivedSearchResults: function(dataObj) {
		
		if (ISEUtils.validateObject(dataObj)) 
		{
			var FieldsMap = {};
			var DisplayNameMap = {};
			var displayColumns = {};
			var tC = {};
			
			manageknowledgepackage.json_doc_data = dataObj;
 
			for (var K in manageknowledgepackage.jsonTableDetails.TableDetails) {
				 var temp = new Array();
				 for(var l=0;l<manageknowledgepackage.jsonTableDetails.TableDetails[K].Details.fields.length;l++){

				   var obj =manageknowledgepackage.jsonTableDetails.TableDetails[K].Details.fields[l];
					  if(obj.displayType != "expansion")                          
						 temp.push(obj);                         
				 }

				FieldsMap[manageknowledgepackage.jsonTableDetails.TableDetails[K].indexName] = temp;
				DisplayNameMap[manageknowledgepackage.jsonTableDetails.TableDetails[K].indexName] = manageknowledgepackage.jsonTableDetails.TableDetails[K].displayName;
				displayColumns[manageknowledgepackage.jsonTableDetails.TableDetails[K].indexName] = manageknowledgepackage.jsonTableDetails.TableDetails[K].defaultView;
			}

			var sortField = 1;
			var fields = FieldsMap[dataObj[0]._index];


			for (var i = 0; i < dataObj.length; i++) {
			
				var issimilarDefectId = false;

				var fields = FieldsMap[dataObj[i]._index];
				var dName = DisplayNameMap[dataObj[i]._index];
				var tableID = '#page_manageknowledgepackage .mkp-table-conatainer #mkpTableData';
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
									newRowContent += '<td class="ISEcompactAuto"><span class="glyphicon glyphicon-folder-open"></span> <span title="'+escapeContent+'" packageId="'+documentID+'" sourceLine="'+sourceLine+'" indexCollection="'+indexCollection+'" requiredfilter="' + fields[ii].filter + '" displaytype="'+ fields[ii].displayType +'" desc-data="'+escapeContent+'"><a href="javascript:;" packageId="'+documentID+'"  id="mkpTitleRow"> ' +subTextContent+ ' </a></span></td>';
								}
								else if(textContent.length > 0 && textContent.length < 100)
								{
									newRowContent += '<td class="ISEcompactAuto"><span sourceLine="'+sourceLine+'" indexCollection="'+indexCollection+'" packageId="'+documentID+'" requiredfilter="' + fields[ii].filter + '" displaytype="'+ fields[ii].displayType +'" desc-data="'+escapeContent+'"> ' + subTextContent + ' </span></td>';
								}
								else
								{
									newRowContent += '<td class="ISEcompactAuto"><span sourceLine="'+sourceLine+'" indexCollection="'+indexCollection+'" packageId="'+documentID+'" requiredfilter="' + fields[ii].filter + '" displaytype="'+ fields[ii].displayType +'" desc-data="'+escapeContent+'"> ' +subTextContent+' <a modalTitle="'+fields[ii].displayName+'"  moreTextContent="' + escapeContent + '" class="name" onClick="manageknowledgepackage._onExpandRowMoreContentModal(this)">  more... </a></span></td>';
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
				$('#page_manageknowledgepackage .mkp-table-conatainer #tablebody_' + dName).append(newRowContent);				
			}

			for (var tab in tC) 
			{
					
				var tableColumnsCount = $(tab).find('tr')[0].cells.length;
				var tempArr = new Array();
				for(var i=1;i<tableColumnsCount;i++){
					tempArr.push(i);                    
				}
				manageknowledgepackage._handleUniform();
				manageknowledgepackage.knowledgeaddpackage_table =  $('#page_manageknowledgepackage .mkp-table-conatainer #mkpTableData').DataTable({
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
				
				var total_rec_count = $("#page_manageknowledgepackage .mkp-table-conatainer #mkpTableData").DataTable().page.info().recordsTotal;
				$('#page_manageknowledgepackage #docActionContainer .kwdg-store-doc-count').text(total_rec_count+' Results')
				 
				$("#page_manageknowledgepackage .mkp-table-conatainer tbody #mkpTitleRow").live('click', function(e){					 
					var __knowledgePackageData = new Object();
					__knowledgePackageData._id = $(this).attr("packageId");
					__knowledgePackageData.package_title = $(this).text();

                   // var tableID = '#page_manageknowledgepackage #mkpTableData';
					//var oTable =  $(tableID).dataTable();
                    //var currentRow=$(this).closest("tr"); 
                   // var nTr = currentRow;
				
					//var aData = oTable.fnGetData(nTr);	

                   
         
                     //var col1=currentRow.find("td:eq(3)").text();
                    // if(currentRow.find("td:eq(3)"))
                     // __knowledgePackageData.package_descriptions =currentRow.find("td:eq(3)").text();
                      //__knowledgePackageData.package_descriptions = $(this).attr("pkgDes");

                     

                            




					__knowledgePackageData.Documents = manageknowledgepackage._getSelectedSubTableDetails(__knowledgePackageData._id);
					__knowledgePackageData.addType = "existing";
					localStorage.removeItem('selectedKnowledgePackage');
					localStorage.setItem('selectedKnowledgePackage', JSON.stringify(__knowledgePackageData));
					
					  localStorage.removeItem('PreviousScreen'); 
                     localStorage.setItem('PreviousScreen', ikePageConstants.MANAGE_KNOWLEDGE_PACKAGE);

					
					$(location).attr('hash','#knowledgeaddpackage');
				});
				
				$("#page_manageknowledgepackage .mkp-table-conatainer tbody #kdMoreInfoBtn").live('click', function(e){
					console.log("e: ~~~ "+e);
					console.log($(this).attr("doc-id"));
					 
					var docID = $(this).attr("doc-id");
					manageknowledgepackage.docDetails = manageknowledgepackage._getDocDetails(docID)
					$("#page_manageknowledgepackage .mkp-table-conatainer #popover_container .popover-heading").text(manageknowledgepackage.docDetails.title);
					 
					$("[data-toggle=popover]").popover({
						html : true,
						container: '#page_manageknowledgepackage .mkp-table-conatainer #popover_container',
						title:function() {
						  var title = $(this).attr("data-popover-content");
						  return $(title).children(".popover-heading").html();
						},
						content: manageknowledgepackage._getPopoverBodyContent(manageknowledgepackage.docDetails)
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
					cols = manageknowledgepackage._getColumnNamesList(tID);//todo
					
					var oTable = $('#page_manageknowledgepackage .mkp-table-conatainer #' + tID).dataTable();

					if (oTable.fnIsOpen(nTr)) {
						/* This row is already open - close it */
						$(this).addClass("row-details-close").removeClass("row-details-open");
						oTable.fnClose(nTr);
					} else {
						// Open this row 
						$(this).addClass("row-details-open").removeClass("row-details-close");
						oTable.fnOpen(nTr, manageknowledgepackage._fnDefectSearchRowFormatDetails(oTable, nTr, cols), 'details');//todo						
					}

				});

			}

			for (var i = 0; i < manageknowledgepackage.hideTableColumns.length; i++) {
				var iTD = '#page_manageknowledgepackage .mkp-table-conatainer #' + manageknowledgepackage.hideTableColumns[i].tableID;
				if (!tC[iTD]) continue;
				
				var table = $(iTD).DataTable();
				
				var tempstr = manageknowledgepackage.columnListDetailsArray.dropDownBoxId;
				console.log(tempstr)
				
				for (var j = 0; j < manageknowledgepackage.hideTableColumns[i].hideColumnsList.length; j++) {

					var columnID = manageknowledgepackage.hideTableColumns[i].hideColumnsList[j] - 1;                      
					table.column(columnID).visible(false, false);
					$('#page_manageknowledgepackage .mkp-table-conatainer #columnToggler_'+tempstr+' input[columnid='+columnID+']').attr('checked', false)
				}
			}
			
			$('#page_manageknowledgepackage .mkp-table-conatainer #searchResultsTable').removeClass("hide");

			manageknowledgepackage.searchResultsReceived = true;


			//  Hide Table rows dropdown and Table Search
			$("div").find("#page_manageknowledgepackage .mkp-table-conatainer .dataTables_length").addClass('hidden-sm hidden-xs');
			$("div").find("#page_manageknowledgepackage .mkp-table-conatainer .dataTables_filter").addClass('hidden-sm hidden-xs');

			var windowWidth = $(window).width();
			if (windowWidth <= 400) {
				manageknowledgepackage.onResizeWindow();//todo
				$("html, body").animate({
					scrollTop: $(document).height()
				}, 1000);
			}			
		}
		
		$("#page_manageknowledgepackage .mkp-table-conatainer #addExpand").css("width", "3.40%");
		var sourceCodeTableRowCount = $('#page_manageknowledgepackage .modal-body .table-containerr #sample_4_SourceCode tbody').children().length;      
		ISEUtils.portletUnblocking("pageContainer");

		Pace.stop();		 
	},
	
	_getColumnNamesList: function(tableID) {
		for (var i = 0; i < manageknowledgepackage.hideTableColumns.length; i++) {
			if(manageknowledgepackage.hideTableColumns[i].tableID == tableID)
				return manageknowledgepackage.hideTableColumns[i].allColumnsNames; // Returns Array
		}
    },
	
	/* Formatting function for defect search results row expanded details */
	_fnDefectSearchRowFormatDetails: function(oTable, nTr, cols) {
		var roleName = localStorage.getItem('rolename');
		var aData = oTable.fnGetData(nTr);
		var selectedID = $(aData[1]).text().trim();
		var columnNames = [];
		var subTableDetails = manageknowledgepackage._getSelectedSubTableDetails(selectedID);
		var sOut='';
		$.each(manageknowledgepackage.jsonTableDetails.SubTableDetails, function(key, item) {			 
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
						sOut +='</tr></thead><tbody id=tablebody_"' + displayName +' ">'+manageknowledgepackage._renderSubTable(subTableDetails, columnNames)+'</tbody></table></div>'							
					}
				}					  
			}
		});
		return sOut;
	},
	
	_getSelectedSubTableDetails: function(id){
		for(var i=0; i<manageknowledgepackage.json_doc_data.length; i++){
			if(id.trim() == manageknowledgepackage.json_doc_data[i]._id.trim())
				return manageknowledgepackage.json_doc_data[i].Documents;
		}
	},
	
	_renderSubTable: function(table_details, column_details){
		
		var sTR = '<tr>'
		for(var i=0; i<table_details.length; i++){
			var sTD = '<td class="ISEcompactAuto"><span class="glyphicon glyphicon-folder-close"> </span></td>'
			for(var j=0; j<column_details.length; j++){				
				if(column_details[j].type.toLowerCase() == 'url')
                {
                var temp = table_details[i]['_id'];
				 sTD +='<td class="ISEcompactAuto"><span title="'+table_details[i][column_details[j].name]+'"  displaytype="string"><a href="javascript:;" doc-id="'+table_details[i]['_id']+'" onclick="manageknowledgepackage.documentClickHandler(this)" id="kdTitleRow_'+ temp +'">'+table_details[i][column_details[j].name]+'</a></span></td>'
                }
			else
				sTD +='<td class="ISEcompactAuto"><span title="'+table_details[i][column_details[j].name]+'"  displaytype="string">'+table_details[i][column_details[j].name]+'</span></td>'
			}			
			sTR += sTD+"</tr>";
		}
		sTR +="</tr>"
		return sTR;
	},
	
	documentClickHandler:function(val){	
		console.log(val);
		var id=val.id;
		
		var __knowledgeDocData = new Object();
		var objTemp=document.getElementById(id);
		__knowledgeDocData.doc_id = objTemp.getAttribute("doc-id");			
		__knowledgeDocData.doc_type = 'knowledgeView';
		__knowledgeDocData.current_page_name = ikePageConstants.MANAGE_KNOWLEDGE_PACKAGE;
	
		localStorage.removeItem('selectedKnowledgeEditDoc');
		localStorage.removeItem('selectedKnowledgeViewDoc');									
		localStorage.setItem('selectedKnowledgeViewDoc', JSON.stringify(__knowledgeDocData));
		$(location).attr('hash','#knowledgereadandedit');
	},
	
	_filterInternal: function () {
			var oTable = $('#page_manageknowledgepackage .mkp-table-conatainer #mkpTableData').dataTable();
			var currectSelectedTabel = oTable.DataTable();
			currectSelectedTabel.search(
				$('#searchLocalDoc').val(),
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
	
	_onExpandRowMoreContentModal:function(event){
		var moreTextContent = unescape($(event).attr('moreTextContent'));
		console.log(moreTextContent);
		var modalTitle = $(event).attr('modalTitle');
		$('#showMoreTextInfoModal #modelInfo').empty();
		$('#showMoreTextInfoModal #modelInfo').append("<div id='similarSearch_more_description' class='form-control' style='height:450px;font-family:Courier' readonly=''></div>");
		
		String.prototype.replaceAll = function(target, replacement) {
						return this.split(target).join(replacement);
				};
				
				moreTextContent = moreTextContent.replaceAll('##','<em class="iseH">');
				moreTextContent = moreTextContent.replaceAll("#","</em>");
				moreTextContent = moreTextContent.replace(/.\t/g,". ");
		$("#showMoreTextInfoModal #similarSearch_more_description").html(moreTextContent);
	    $('#showMoreTextInfoModal #moreInfoModalTitle').text(modalTitle);
        //$('#showMoreTextInfoModal').show();	
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


				$('#page_manageknowledgepackage .page-toolbar').load("actions.html", function() {

					$.getScript("js/subpages/actions.js")
						.done(function() {
							manageknowledgepackage.actionsRef = actions;
							actions._setCurrentPage(ikePageConstants.MANAGE_KNOWLEDGE_PACKAGE);
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

