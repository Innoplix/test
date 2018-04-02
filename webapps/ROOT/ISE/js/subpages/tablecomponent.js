var tablecomponent = {

//Variable Decleration
   tablecomponent_table:'',
	rows_selected:[],
	allDeleteDocs:[],
	allDeletedDocArray:[],
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
	isAddEllipsis:false,
	modalRefContainerForPreview:'',
	tabelIDParentConatiner:'',
	total_rec_count:0,
	allPackagedDocArray:[],
	selectedDocList:[],
	allowEditKnowledge:false,
	FilterColumnID:'',
	tableSearchTextFiledID:'',
	callingPageName : '',
	defaultURL:'',
    /* Init function  */
    init: function() {
		
		tablecomponent._fillTableAndColumnFilterDropDown();
		
    },
	
	 _ResetVariables : function()
    {
    tablecomponent.tablecomponent_table='';
	tablecomponent.rows_selected=[];
	tablecomponent.allDeleteDocs=[];
	tablecomponent.allDeletedDocArray=[];
	tablecomponent.jsonTableDetails=[];
	tablecomponent.columnListDetailsArray={};
	tablecomponent.mobileViewTableColumnCollection=[];
	tablecomponent.hideTableColumns=[];
	tablecomponent.crIdFileds=[];
	tablecomponent.requestSearchCount=5;
	tablecomponent.json_doc_data= {};
	tablecomponent.docDetails={};
	tablecomponent.tableJSON='';
	tablecomponent.dataTableID='';
	tablecomponent.isAddPreviewButtonToTable=false;
	tablecomponent.isAddEllipsis=false;
	tablecomponent.modalRefContainerForPreview='';
	tablecomponent.tabelIDParentConatiner='';
	tablecomponent.total_rec_count=0;
	tablecomponent.allPackagedDocArray=[];
	tablecomponent.selectedDocList=[];
	tablecomponent.allowEditKnowledge=false;
	tablecomponent.FilterColumnID='';
	tablecomponent.tableSearchTextFiledID='';
	tablecomponent.callingPageName = '';

    }, 
	_setTableJSON: function(json_filename){
		tablecomponent.tableJSON = json_filename;
	},
	_setCallingPageName: function(pageName){
		tablecomponent.callingPageName = pageName;
	},
	_setdataTableID: function(table_id){
		tablecomponent.dataTableID = table_id;
	},
	_setIsAddPreviewButtonToTable: function(val){
		tablecomponent.isAddPreviewButtonToTable = val;
	},
	_setIsAddEllipsis: function(val){
		tablecomponent.isAddEllipsis = val;
	},
	_setModalRefContainer: function(container_ref){
		tablecomponent.modalRefContainerForPreview = container_ref;
	},
	_setTabelIDParentConatiner: function(par_container){
		tablecomponent.tabelIDParentConatiner = par_container;
	},
	_setFilterColumnID: function(val){
		tablecomponent.FilterColumnID = val;
	},		 
	_setAllowEditKnowledge: function(val){
		tablecomponent.allowEditKnowledge = val;
	},
	_setTableSearchTextFiledID: function(val){
		tablecomponent.tableSearchTextFiledID = val;
	},		
	_getJsonStoredData(){
		return tablecomponent.json_doc_data
	},
	_getColumnListDetailsArray(){
		return tablecomponent.columnListDetailsArray
	},
	_gettablecomponentJsonTableDetails(){
		return tablecomponent.jsonTableDetails;
	},
	_getRowsSelectedData(){
		return tablecomponent.rows_selected;
	},
	_getAllDeletedDocArray(){
		return tablecomponent.allDeleteDocs;
	},
	_setTabelRef(){
		tablecomponent.tablecomponent_table =  $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #'+tablecomponent.dataTableID+'').DataTable()
	},
	_fillTableAndColumnFilterDropDown: function() {

		var roleName = localStorage.getItem('rolename');

		$('#'+tablecomponent.tabelIDParentConatiner+' #tableDataContainer .kps-table-conatainer').empty();
		if(tablecomponent.FilterColumnID.length>0)
		$('#'+tablecomponent.tabelIDParentConatiner+' #'+tablecomponent.FilterColumnID).empty();
		
		$.getJSON("json/"+tablecomponent.tableJSON+".json?"+Date.now(), function(data) {

			tablecomponent.jsonTableDetails = data;
			
			tablecomponent.columnListDetailsArray = {};
			$.each(data.TableDetails, function(key, item) {
			 
				//  Filter Search List will be added based on role.
				if (item.enable == "yes") {

					for (var i = 0; i < item.allowedroles.length; i++) {

						if (item.allowedroles[i] == roleName) {

							var displayName = item.displayName; 
							 
							$('#'+tablecomponent.tabelIDParentConatiner+' #tableDataContainer .kps-table-conatainer').append('<div class="col-sm-12 table-scrollable1 table-responsive"><table class="table table-striped table-bordered table-hover dataTable" id="'+tablecomponent.dataTableID+'"></table></div>')
							$('#'+tablecomponent.tabelIDParentConatiner+' #tableDataContainer #'+tablecomponent.dataTableID+'').append("<thead><tr id=tableheader_" + displayName + "></tr></thead><tbody id=tablebody_" + displayName + "></tbody>");

							// Set Table Heading for all columns
						 // Set Table Heading for all columns
							 if(tablecomponent.allowEditKnowledge)
							// Empty column name for first column
								$('#'+tablecomponent.tabelIDParentConatiner+' #tableDataContainer .kps-table-conatainer #tableheader_' + displayName).append('<th class="table-checkbox"><input type="checkbox" name="group-checkable" class="group-checkable" data-set="#"+tablecomponent.tabelIDParentConatiner+ " #tableDataContainer .kps-table-conatainer #'+tablecomponent.dataTableID+' .checkboxes"/></th>');
							else
								$('#'+tablecomponent.tabelIDParentConatiner+' #tableDataContainer .kps-table-conatainer #tableheader_' + displayName).append('<th class="table-checkbox"><input type="checkbox" name="group-checkable" class="group-checkable disabled" disabled="disabled" data-set="#"+tablecomponent.tabelIDParentConatiner+ " #tableDataContainer .kps-table-conatainer #'+tablecomponent.dataTableID+' .checkboxes"/></th>');
							
							for (var j = 0; j < item.Details.fields.length; j++) {                                

								if(item.Details.fields[j].displayType != "expansion")
								$('#'+tablecomponent.tabelIDParentConatiner+' #tableDataContainer .kps-table-conatainer #tableheader_' + displayName).append("<th class='sorting ISEcompactAuto'>" + item.Details.fields[j].displayName + "</th>");
							}
							
							//Preview Column at last
							if(tablecomponent.isAddPreviewButtonToTable)
								$('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #tableheader_' + displayName).append("<th class='preview-heading'>Action</th>");
							
							var dropDownBoxId = "columnToggler_" + displayName;
							var tableID = tablecomponent.dataTableID;
							var _obj = new Object();
							_obj.dropDownBoxId = tablecomponent.FilterColumnID;//dropDownBoxId;
							_obj.tableID = tableID;
							_obj.defaultView = item.defaultView;
							_obj.itemDetailsfields = item.Details.fields;
							_obj.indexes = item.indexName;
							_obj.displayName = displayName;
							
                           if (item.defaultURL)
                            {
								debugger;
                                var host = iseConstants.elasticsearchHost;//window.location.host;
                                if (host.toString().includes("http://") || host.toString().includes("https://"))
                                {
                                                host = host.toString().includes("://") ? host.substr(host.indexOf("://") + 3) : host;
                                                host = host.toString().includes("/") ? host.substr(0, host.indexOf("/")) : host;
                                                host = host.toString().includes(":") ? host.substr(0, host.indexOf(":")) : host;
                                                host = (host.toString().includes("http://") || host.toString().includes("https://")) ? host : window.location.protocol + "//" + host;
                                }                                                                                                                                              
                                tablecomponent.defaultURL = host + item.defaultURL;
                            }

							tablecomponent.columnListDetailsArray = _obj;

							tablecomponent.mobileViewTableColumnCollection.push({
								"tableID": tablecomponent.dataTableID ,
								"columnsList": item.mobileView,
								"dropdownID": 'columnToggler_' + displayName
							});
						}
					}
					  
				}
					
					 
			});
			
			var getCurrentSelectedTabData = tablecomponent.columnListDetailsArray;
			if(tablecomponent.FilterColumnID.length>0)
			 tablecomponent._fillColumnListinDropdown(getCurrentSelectedTabData.dropDownBoxId, getCurrentSelectedTabData.tableID, getCurrentSelectedTabData.defaultView, getCurrentSelectedTabData.itemDetailsfields);
			var elements = document.querySelectorAll('#'+tablecomponent.tabelIDParentConatiner+' #tableDataContainer .kps-table-conatainer #searchKDFilterDropdown label input:checked');
		   Array.prototype.map.call(elements, function(el, i) {
			if(i>0)
			{
			 $(el).removeAttr("checked");
			 var resultsTabId = $(el).attr("resultTabID");
			 var resultsTabInnerContainerID = $(el).attr("resultTabInnerContainerID");
			 $("#"+tablecomponent.tabelIDParentConatiner+ " #tableDataContainer .kps-table-conatainer #" + resultsTabId).addClass("hide");
			 $("#"+tablecomponent.tabelIDParentConatiner+ " #tableDataContainer .kps-table-conatainer #" + resultsTabInnerContainerID).removeClass("active in");
			}               
		}); 

			 
			//tablecomponent.loadDummyData();
			$( "#"+tablecomponent.tabelIDParentConatiner ).trigger( ikeEventsConstants.COMPLETED_FILL_TABLE_AND_COLUMN_FILTER); 
			
		});
	},
	//This function is for testing with Dummy values
	loadDummyData: function(){
		$.getJSON("json/searchDataDummy.json?"+Date.now(), function(data) {
			
		tablecomponent.json_doc_data = data;
		tablecomponent._receivedSearchResults(tablecomponent.json_doc_data);
		});
	},
	
	_fillColumnListinDropdown: function(dropDownBoxId, tableID, defaultColumnView, ColumnsList) {

		$('#'+tablecomponent.tabelIDParentConatiner+ ' #' + dropDownBoxId).empty();

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
				   tablecomponent.crIdFileds.push(crIdArr[0][j]); 
			  } 
			  }

	   
		var colunmnID = 0;
		var tableColumnID = 0;
		var tableHideColumns = new Array();
		$.grep(tempArr, function(element) {

			colunmnID = colunmnID + 1;


			if ($.inArray(element, defaultColumnView) !== -1) {

				$('#'+tablecomponent.tabelIDParentConatiner+ ' #' + dropDownBoxId).append('<label><input type="checkbox" name="column" checked="true" columnID=' + colunmnID + '  data-column=' + colunmnID + '>' + element + '</label>');
			} else {

				tableColumnID = colunmnID + 1;
				tableHideColumns.push(parseInt(tableColumnID));
				$('#'+tablecomponent.tabelIDParentConatiner+ ' #' + dropDownBoxId).append('<label><input type="checkbox" name="column"  columnID=' + colunmnID + ' data-column=' + colunmnID + '>' + element + '</label>');

			}

		});

		tablecomponent.hideTableColumns.push({
			"tableID": tableID,
			"hideColumnsList": tableHideColumns,
			"allColumnsNames": tempArr
		});


		$('#'+tablecomponent.tabelIDParentConatiner+ ' input[type="checkbox"]').change(function(e) {

			var iCol = parseInt($(this).attr("data-column"));
			var oTable = $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #' + tableID).dataTable();
			var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
			oTable.fnSetColumnVis(iCol, bVis ? false : true);
			var chkVal = $(this).parent().text();
			
			if(bVis)
				tablecomponent._insertOrDeleteDefaultTableColValue(chkVal, 'remove');
			else
				tablecomponent._insertOrDeleteDefaultTableColValue(chkVal, 'insert');
			
			var table_wrapper = $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #' + tableID+'_wrapper')
			if( table_wrapper.width() > oTable.width() )
			{
				table_wrapper.css('overflow-x', 'visible')
			}else{
				table_wrapper.css('overflow-x', 'none')
			}
			e.stopImmediatePropagation();
		});
		$( "#"+tablecomponent.tabelIDParentConatiner+ " #tableDataContainer .kps-table-conatainer #dataTablePageChange select" ).on('change', function() {
			console.log($( this ).val());
			tablecomponent.requestSearchCount = $( this ).val();
		});
		$('input[type="checkbox"]', '#'+tablecomponent.tabelIDParentConatiner+ ' #' + dropDownBoxId).click(function(e) {
        
            var attr = $(this).closest("span").attr("class");

            if (typeof attr == typeof undefined || attr == false||attr == "") {                 
                $(this).closest("span").attr("class","checked");
            }
			else
				$(this).closest("span").removeAttr("class");
				
			// Prevent click event from propagating to parent
			e.stopImmediatePropagation();
		});

		 
	},
	
	_insertOrDeleteDefaultTableColValue:function(chkVal, action){
		 
			if( tablecomponent.columnListDetailsArray.displayName){
			 if(action=='insert'){
				tablecomponent.columnListDetailsArray.defaultView.push(chkVal);
			 }else if(action=='remove'){
				var k = tablecomponent.columnListDetailsArray.defaultView.indexOf(chkVal);
				if(k != -1) {
					tablecomponent.columnListDetailsArray.defaultView.splice(k, 1);
				}
			 }
			 tablecomponent.columnListDetailsArray.defaultView = tablecomponent._uniqueArray(tablecomponent.columnListDetailsArray.defaultView);
			}
		 
		
		 
	},
	
	remove_tags: function(html)
	{
		var tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		if (tmp.getElementsByTagName("style")[0])
			tmp.removeChild(tmp.getElementsByTagName("style")[0]);
		var tmpStr = "";	
		if (document.all)			
			tmpStr = tmp.innerText.replace(/(<([^>]+)>)/ig,"");
		else
			tmpStr = tmp.textContent.replace(/(<([^>]+)>)/ig,"");
		return tmpStr.toString(); 		
	},
	
	_receivedSearchResults: function(dataObj) {
		debugger;
		if (ISEUtils.validateObject(dataObj)) {
			

			var FieldsMap = {};
			var DisplayNameMap = {};
			var displayColumns = {};
			var tC = {};

			tablecomponent.json_doc_data = dataObj;
		 
			for (var K in tablecomponent.jsonTableDetails.TableDetails) {

				  
				 var temp = new Array();
				 for(var l=0;l<tablecomponent.jsonTableDetails.TableDetails[K].Details.fields.length;l++){

				   var obj =tablecomponent.jsonTableDetails.TableDetails[K].Details.fields[l];
					  if(obj.displayType != "expansion")                          
						 temp.push(obj);                         

				 }

				FieldsMap[tablecomponent.jsonTableDetails.TableDetails[K].indexName] = temp;
				DisplayNameMap[tablecomponent.jsonTableDetails.TableDetails[K].indexName] = tablecomponent.jsonTableDetails.TableDetails[K].displayName;
				displayColumns[tablecomponent.jsonTableDetails.TableDetails[K].indexName] = tablecomponent.jsonTableDetails.TableDetails[K].defaultView;
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
				var tableID = '#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #'+tablecomponent.dataTableID+'';
				if (!tC[tableID]) {

					var oTable = $(tableID).DataTable();
					oTable.clear();
					oTable.destroy();
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
				var defaultURL = tablecomponent.defaultURL;
				  var sourceLineURL="sourceline";
				  var row_inc = (i+1);
				   
					if(tablecomponent.allowEditKnowledge)
						var newRowContent = '<tr class="odd gradeX" data-row-id="'+row_inc+'"><td><input document-id="'+documentID+'" default-URL="'+defaultURL+'"  type="checkbox" class="checkboxes" value="'+row_inc+'"/></td>';
					else
						var newRowContent = '<tr class="odd gradeX" data-row-id="'+row_inc+'"><td><input document-id="'+documentID+'" default-URL="'+defaultURL+'"  type="checkbox" class="checkboxes disabled" disabled="disabled" value="'+row_inc+'"/></td>';	
					 
				for (var ii = 0; ii < fields.length; ii++) {

					var documentID = escape(dataObj[i][documentIdColumnName]);
					var simplifyURL = (dataObj[i]["simplifyURL"]);
					var indexCollection = escape(dataObj[i][indexCollectionname]); 
					var sourceLine = escape(dataObj[i][sourceLineURL]);//escape(fields[ii].SourceName);

					  if(documentID === undefined){
						  newRowContent += '<td class="ISEcompactAuto"><span sourceLine="null" documentID="null" indexCollection="null" requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';
					}
					else
					{
							  if(fields[ii].displayType.toLowerCase() == "date")                           
							   {
								 var dateObj = dataObj[i][fields[ii].SourceName];
								 var newDateObj = new Date(dateObj);	
							updatedSince = tablecomponent._getLastUpdatedDateTime(newDateObj);		
							newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + updatedSince + '</span></td>';						   
							   } 
							   else if(fields[ii].displayType.toLowerCase() == "string" || fields[ii].displayType.toLowerCase() == "url" || fields[ii].displayType.toLowerCase() == "download")
								{
									String.prototype.replaceAll = function(target, replacement) {
										return this.split(target).join(replacement);
									};
									var textContent = dataObj[i][fields[ii].SourceName];
									
							var completeText = dataObj[i][fields[ii].SourceName];
							
									if(undefined !=textContent && 'undefined' != textContent & typeof textContent !== "number"){
										textContent = textContent.replaceAll('&nbsp;','<br>');
										textContent = textContent.replaceAll("<em class='iseH'>",'##');
										textContent = textContent.replaceAll("</em>","#");
								
								completeText = completeText.replaceAll('&nbsp;','');
								completeText = completeText.replaceAll("<em class='iseH'>",'');
								completeText = completeText.replaceAll("</em>","");
									}
							if(textContent == '' || textContent == 'undefined' || textContent == undefined || textContent.length == 0)
							{
										newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '> No data </span></td>';
							}
							else if(textContent.length > 0 && textContent)
							{
								var subTextContent = textContent;
										if(fields[ii].displayType.toLowerCase() == "url")
									subTextContent = textContent.substring(0,18);
								else
								{
									subTextContent = tablecomponent.remove_tags(subTextContent);
									if (subTextContent.length > 100)
										subTextContent = subTextContent.substring(0,100) + "....";
								}
										
										 if(typeof subTextContent !== "number"){
											subTextContent = subTextContent.replaceAll('<br>','&nbsp;');
											subTextContent = subTextContent.replaceAll('##','<em class="iseH">');
											subTextContent = subTextContent.replaceAll("#","</em>");
										}
								
										var escapeContent = escape(textContent);
										//debugger;
										if(textContent.length >= 0  && fields[ii].displayType.toLowerCase() == "url")
										{	
											if(tablecomponent.isAddEllipsis)											
										newRowContent += '<td class="ISEcompactAuto"><span title="'+completeText+'" sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' desc-data='+escapeContent+'><a href="javascript:;" doc-id="'+documentID+'" id="kdTitleRow">' +subTextContent+'</a><div class="doc-more-info text-center"><div class="btn-group"><div data-toggle="popover" id="kdMoreInfoBtn" doc-id="'+documentID+'" data-popover-content="#a3" class="btn btn-icon-only" href="javascript:;"><i class="fa fa-ellipsis-h"></i></div></div></div></span></td>';
											else
										newRowContent += '<td class="ISEcompactAuto"><span title="'+completeText+'" sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' desc-data='+escapeContent+'><span href="javascript:;" doc-id="'+documentID+'" id="kdTitleRow">' +subTextContent+'</span></span></td>';
								}
								else if(textContent.length > 0 && textContent.length < 100)
								{
											newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' desc-data='+escapeContent+'>' + subTextContent + '</span></td>';
								}
								else
								{
									//newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' desc-data='+escapeContent+'>' +subTextContent+'<a modalTitle='+fields[ii].displayName+'  moreTextContent=' + escapeContent + ' class="name" onClick="tablecomponent._onExpandRowMoreContentModal(this)">  more... </a></span></td>';
									newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' desc-data='+escapeContent+'>' +subTextContent+'</span></td>';
										}
									}											
							   }
							   else if (fields[ii].displayType.toLowerCase() == "array")
								{
									var arrContent = dataObj[i][fields[ii].SourceName];
									var textVal = "";
									if (arrContent)
									{
										for(var j = 0; j < arrContent.length; j++)
										{
											if (textVal !== "")
													textVal = textVal + ", <br>";									
											if (typeof arrContent[j] == "object")
											{									
												textVal = textVal + arrContent[j][fields[ii].propertyName];
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
									newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' desc-data='+escapeContent+'>' +textVal+ '</span></td>';
								}
						else
						{								
									newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';
								}
					   }
				}
				if(tablecomponent.isAddPreviewButtonToTable)
					newRowContent += '<td id="actionTd"> <div class="btn-group"><button type="button" documentID='+documentID+' default-url="'+defaultURL+'" class="btn btn-circle grey-mint btn-outline btn-xs preview-btn">PREVIEW</button></div></td>';					
				
				newRowContent += '</tr>';
				$('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #tablebody_' + dName).append(newRowContent);
			

			}

			for (var tab in tC) {
					
			var tableColumnsCount = $(tab).find('tr')[0].cells.length;
				var tempArr = new Array();
				 for(var i=1;i<tableColumnsCount;i++){
					tempArr.push(i);                    
			}
			tablecomponent._handleUniform();
			
				tablecomponent.tablecomponent_table =  $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #'+tablecomponent.dataTableID+'').DataTable({
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
					"dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>r>t<'row'<'col-md-5 col-sm-12'p><'col-md-7 col-sm-12'li>>",
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
				 
					tablecomponent.total_rec_count = $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #'+tablecomponent.dataTableID+'').DataTable().page.info().recordsTotal;
					
					if(tablecomponent.tableSearchTextFiledID.length > 0)
						$('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer #'+tableSearchTextFiledID).on ('keyup', tablecomponent._filterInternal);
			 
				$('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer tbody #kdTitleRow').live('click', function(e){
					var __knowledgeDocData = new Object();
					__knowledgeDocData.doc_id = $(this).attr("doc-id");
					__knowledgeDocData.doc_title = $(this).text();
					__knowledgeDocData.doc_type = 'knowledgeEdit';
					__knowledgeDocData.current_page_name = tablecomponent.callingPageName;
					
					//console.log("Selected Knowladge: "+package_id);
					localStorage.removeItem('selectedKnowledgeEditDoc');
					localStorage.removeItem('selectedKnowledgeViewDoc');						
					localStorage.setItem('selectedKnowledgeEditDoc', JSON.stringify(__knowledgeDocData));
					$(location).attr('hash',ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
					//$("#previewKnowledgeCompModal").modal('show');
					//tablecomponent.onLoadKnowledgeEditAndReadComponent();
				});
				
				//PopoVer (3 Elipsis) Click
				$('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer tbody #kdMoreInfoBtn').live('click', function(e){
					console.log("e: ~~~ "+e);
					 console.log($(this).attr("doc-id"));
					 
					 var docID = $(this).attr("doc-id");
					 tablecomponent.docDetails = tablecomponent._getDocDetails(docID)
					 $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer #popoverEditContainer .popover-heading').text(tablecomponent.docDetails.title);
					 
					 $("[data-toggle=popover]").popover({
						html : true,
						container: '#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer #popoverEditContainer',
						title:function() {
						  var title = $(this).attr("data-popover-content");
						  return $(title).children(".popover-heading").html();
						},
						content: tablecomponent._getPopoverBodyContent(tablecomponent.docDetails)
					});
				});
				
				//Preview Click
				$('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer tbody .preview-btn').live('click', function(e){
					console.log("preview: ~~~ "+e);
					debugger;
					 var defaultURL = $(this).attr("default-url");
					 
					$('#'+tablecomponent.modalRefContainerForPreview+'').modal('show');
					  
					$('#'+tablecomponent.modalRefContainerForPreview+' .visualization-name').text(defaultURL);
				});
				
				//Table CheckBox
				$('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #'+tablecomponent.dataTableID+' tbody').on('click', 'input[type="checkbox"]', function(e){
					 
					  var $row = $(this).closest('tr');

					  // Get row data
					  var data = tablecomponent.tablecomponent_table.row($row).data();

					  // Get row ID
					  var rowId = data[0];

					  // Determine whether row ID is in the list of selected row IDs 
					  var index = $.inArray($row[0], tablecomponent.rows_selected);

					  // If checkbox is checked and row ID is not in list of selected row IDs
					  if(this.checked && index === -1){
						 tablecomponent.rows_selected.push($row[0]);
						
					  // Otherwise, if checkbox is not checked and row ID is in list of selected row IDs
					  } else if (!this.checked && index !== -1){
						 tablecomponent.rows_selected.splice(index, 1);
					  }

					  if(this.checked){
						 $row.addClass('selected');
					  } else {
						 $row.removeClass('selected');
					  }

					  // Update state of "Select all" control
					  tablecomponent._updateDataTableSelectAllCtrl(tablecomponent.tablecomponent_table);
					  //debugger;
					  $( "#"+tablecomponent.tabelIDParentConatiner ).trigger( ikeEventsConstants.ROW_SELECTED,  JSON.stringify(tablecomponent.rows_selected) ); 
					  
					  // Prevent click event from propagating to parent
					  e.stopPropagation();
				   });

				   // Handle click on table cells with checkboxes
				   $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #'+tablecomponent.dataTableID+'').on('click', 'tbody td, thead th:first-child', function(e){
					  //$(this).parent().find('input[type="checkbox"]').trigger('click');
				   });

				   // Handle click on "Select all" control
				   $('thead input[name="group-checkable"]', tablecomponent.tablecomponent_table.table().container()).on('click', function(e){
					  if(this.checked){
						 $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #'+tablecomponent.dataTableID+' tbody input[type="checkbox"]:not(:checked)').trigger('click');
					  } else {
						 $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #'+tablecomponent.dataTableID+' tbody input[type="checkbox"]:checked').trigger('click');
					  }

					  // Prevent click event from propagating to parent
					  e.stopPropagation();
				   });

				   // Handle table draw event
				   tablecomponent.tablecomponent_table.on('draw', function(){
					  // Update state of "Select all" control
					 tablecomponent._updateDataTableSelectAllCtrl(tablecomponent.tablecomponent_table);
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
					cols = tablecomponent._getColumnNamesList(tID);//todo
					
					var oTable = $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #' + tID).dataTable();

					if (oTable.fnIsOpen(nTr)) {
						/* This row is already open - close it */
						$(this).addClass("row-details-close").removeClass("row-details-open");
						oTable.fnClose(nTr);
					} else {
						// Open this row 
						$(this).addClass("row-details-open").removeClass("row-details-close");
						oTable.fnOpen(nTr, tablecomponent._fnDefectSearchRowFormatDetails(oTable, nTr, cols), 'details');//todo
				   
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

			for (var i = 0; i < tablecomponent.hideTableColumns.length; i++) {
				var iTD = '#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #' + tablecomponent.hideTableColumns[i].tableID;
				if (!tC[iTD]) continue;


				var tempstr = tablecomponent.columnListDetailsArray.dropDownBoxId;
				

				var table = $(iTD).DataTable();
				for (var j = 0; j < tablecomponent.hideTableColumns[i].hideColumnsList.length; j++) {

					var columnID = tablecomponent.hideTableColumns[i].hideColumnsList[j] - 1;                      
					table.column(columnID).visible(false, false);
					//$('#page_knowledgestore #'+tempstr+' input[columnID='+columnID+']').closest( "span" ).removeAttr("class");
					debugger;
					$('#'+tablecomponent.tabelIDParentConatiner+ ' #'+tempstr+' input[columnid='+columnID+']').closest( "span" ).removeAttr("class");
				}
			}
			
			$('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #searchResultsTable').removeClass("hide");

			tablecomponent.searchResultsReceived = true;


			//  Hide Table rows dropdown and Table Search
			$("div").find('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer .dataTables_length').addClass('hidden-sm hidden-xs');
			$("div").find('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer .dataTables_filter').addClass('hidden-sm hidden-xs');

			var windowWidth = $(window).width();
			if (windowWidth <= 400) {
				tablecomponent.onResizeWindow();//todo
				$("html, body").animate({
					scrollTop: $(document).height()
				}, 1000);
			}
			
			 
			
		} 
		else 
		{									 						
			var oTable = $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #' + tablecomponent.dataTableID).dataTable();
			oTable.fnClearTable();
			oTable.fnDestroy();	
		}
		  $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #addExpand').css("width", "3.40%");
		

		 var sourceCodeTableRowCount = $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .modal-body .table-containerr #sample_4_SourceCode tbody').children().length;      

		ISEUtils.portletUnblocking("pageContainer");
		
		 Pace.stop();
		 
		 $( "#"+tablecomponent.tabelIDParentConatiner ).trigger( ikeEventsConstants.COMPLETED_RENDER_TABLE_DATA, tablecomponent.total_rec_count ); 
	},
	
	_getLastUpdatedDateTime:function(pDateTime)
	{
		var today = new Date();		
		var diffMs = (today - pDateTime); 
		var diffMins =  Math.round(diffMs / 60000); 
		if (diffMins <= 60)
			return "Updated " + diffMins + " minutes ago."
		else if (diffMins > 60 && diffMins <= 1440)
		{
			var hours = parseInt(diffMins / 60);
			var min = diffMins - (hours * 60);
			if (hours > 1)
				return "Updated " + hours + " hours ago."
			else
				return "Updated " + hours + " hour ago."			
		}
		else if (diffMins > 1440 && diffMins <= 43200)
		{
			var days = parseInt(diffMins / 1440);
			
			if (days > 1)
				return "Updated " + days + " days ago."
			else
				return "Updated " + days + " day ago."		
		}
		else
			return pDateTime;
	},
	
	getSelectedDocList: function (confmsg, errormsg,isHidable) {
		/* var allSelectedDocs = [];
		tablecomponent.allPackagedDocArray = [];
		tablecomponent.selectedDocList = [];
		$('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #'+tablecomponent.dataTableID+' .checkboxes:checked').each(function() {  
			 var __obj = new Object();
			 __obj.value = $(this).attr('value');
			 __obj.documentid = $(this).attr('document-id');
			 __obj.documentdetails = tablecomponent._getDocDetails(__obj.documentid);
			tablecomponent.allPackagedDocArray.push(__obj);
			tablecomponent.selectedDocList.push(__obj.documentdetails);
			allSelectedDocs.push($(this).attr('value'));
		}); */
		if(tablecomponent.rows_selected.length <=0)  
		{  
			alert(errormsg); 
            
           

 
		}else{
			
			var c = confirm(confmsg);
			if(c){
				/* $.each(allSelectedDocs, function( index, value ) {
					  var $rowData = $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #'+tablecomponent.dataTableID+' tr').filter("[data-row-id='" + value + "']")
					  //tablecomponent.tablecomponent_table.row($rowData).remove().draw( false );
				 }); */
				 var selected_doc_list=[];
				console.log("Selected Knowledge values are : "+JSON.stringify(tablecomponent.rows_selected));
				// Removing selection of the rows after added to the package
				$('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #'+tablecomponent.dataTableID+' .checkboxes:checked').each(function() {  
                  $(this).attr('checked', false);
                   selected_doc_list.push($(this).attr('document-id'));

                   //Hide the row after approval-gourik
                   if(isHidable)
                   {
                    var temp= $(this).closest('tr').attr('data-row-id');
                    $(this).closest('tr').attr('style','display:none;');
                    //var $rowData = $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #'+tablecomponent.dataTableID+' tr').filter("[data-row-id='" + temp + "']")
                    //tablecomponent.tablecomponent_table.row($rowData).remove().draw( false )
                   }

                  $(this).closest("span").removeAttr("class");
                 });
				 //var selected_doc_list = tablecomponent.rows_selected;
				 tablecomponent.rows_selected = [];
				return JSON.stringify(selected_doc_list)
			}
		}
		
	},
	removeDocsFromList: function()
	{
		
		if(tablecomponent.rows_selected.length > 0)
		{
			var response = confirm("Are you sure you want to delete selected document(s)?");
			if(response)
			{
				tablecomponent.allDeleteDocs=[];
				var oTable =  $("#"+tablecomponent.dataTableID).DataTable();
						
				for(var i=0; i<tablecomponent.rows_selected.length; i++)
				{  
					var nTr = tablecomponent.rows_selected[i];
	
					var aData = oTable.row( nTr.rowIndex-1 ).data();

					//var knowledgeID = $(aData[1]).text();
                   var knowledgeID = $(aData[1]).attr('documentid');
					var __obj = new Object();
					__obj.knowledgeID = knowledgeID;
					__obj.rowID = nTr._DT_RowIndex;
					////tablecomponent._deleteKnowledgemapping(knowledgeID);

					tablecomponent.allDeleteDocs.push(__obj);								
				}
									
				$.each(tablecomponent.allDeleteDocs, function( index, value ) {
					debugger;
					tablecomponent.tablecomponent_table.row(value.rowID).remove().draw( false );
				});
				 //allDeletedDocArray
				console.log("Deleted values are : "+JSON.stringify(tablecomponent.rows_selected));
				// Removing selection of the rows after added to the package
				$('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #'+tablecomponent.dataTableID+' .checkboxes:checked').each(function() {  
                  $(this).attr('checked', false);
                  
                  $(this).closest("span").removeAttr("class");
                 });
			
				 var deleted_doc_list = tablecomponent.rows_selected;
				 tablecomponent.rows_selected = [];
				return JSON.stringify(tablecomponent.allDeleteDocs)
				  
			}
		}
		 else
		 {
		   alert("Please select atleast one document to delete.");  
		}
		
		tablecomponent.rows_selected=[];
		//e.stopImmediatePropagation();
	},
	/*_getTotalNumberOfRecodrsIdsInTable: function(){
		var totalIdRecords = [];
		var table = $("#"+tablecomponent.dataTableID).DataTable();
		table.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
			var aData= this.data();
			 totalIdRecords.push($(aData[1]).text());
		} );
		return totalIdRecords;
	},*/
	
	_getTotalNumberOfRecodrsIdsInTable: function(){ 
			var totalIdRecords = []; 
			var table = $("#"+tablecomponent.dataTableID).DataTable(); 
			var data = table.rows().data(); 
			data.each(function (value, index) { 
					totalIdRecords.push($(value[1]).text()); 
			 }); 
			
			return totalIdRecords; 
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
			 $(chkbox_select_all).parent().removeClass('checked');
		  }

	   // If all of the checkboxes are checked
	   } else if ($chkbox_checked.length === $chkbox_all.length){
		  chkbox_select_all.checked = true;
		  if('indeterminate' in chkbox_select_all){
			 chkbox_select_all.indeterminate = false;
			 $(chkbox_select_all).parent().addClass('checked');
		  }

	   // If some of the checkboxes are checked
	   } else {
		  chkbox_select_all.checked = true;
		  if('indeterminate' in chkbox_select_all){
			 chkbox_select_all.indeterminate = true;
			 $(chkbox_select_all).parent().removeClass('checked');
		  }
	   }
	},
	
	_onExpandRowMoreContentModal:function(event){

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

		document.getElementById("similarSearch_moreDescription2").innerHTML = moreTextContent;
	    $('#showMoreTextInfoCompModal #moreInfoModalTitle').text(modalTitle);
	   
		$("#showMoreTextInfoCompModal").modal("show");         	 

		$("#similarSearch_moreDescription2 a").on("click",function(){
			debugger;
			window.open(this.href);
			return false;
		}) ; 
  },
  _getDocDetails:function(doc_id){
	  for(var i=0; i<tablecomponent.json_doc_data.length; i++){
		  if(doc_id == tablecomponent.json_doc_data[i]._id){
			  return tablecomponent.json_doc_data[i];
		  }
	  }
	  
  },
  _filterInternal: function () {
			 
			var oTable = $('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer .kps-table-conatainer #' + tablecomponent.dataTableID).dataTable();
			var currectSelectedTabel = oTable.DataTable();
			currectSelectedTabel.search(
				$('#'+tablecomponent.tabelIDParentConatiner+ ' #tableDataContainer #'+tableSearchTextFiledID).val(),
				false,
				true
			).draw();
	},
  _getPopoverBodyContent:function(data){
	  var popoverBody = '<div class="row"> <div class="col-md-12"><div class="form-group" id="docMoreInfoContent"> <p> Published on <span> '+data.published_at+' </span><br> User:  <span>'+data.user+'</span> </p><p>File Name: '+data.fileName+'</p></div><div class="btn-group"><a class="btn btn-xs btn-success" id="openDocBtn" data-apply="confirmation">Open</a><a class="btn btn-xs default" id="shareDocBtn" data-apply="confirmation"> Share</a></div></div></div>';
	  return popoverBody;
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
	_deleteKnowledgemapping:function(KnowledgeMappingID){

		var param =[];
		param[0]="PARAM1="+KnowledgeMappingID;
		var data = '{"fileName":"delete_knowledgemapping","params":"'+param+'","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,tablecomponent.deletedKnowledgeInformationStatus);

    },
	deletedKnowledgeInformationStatus:function(statusObject){

		console.log(JSON.stringify(statusObject))
	},
	_getAdditionalFilters: function(collectionName,requestObject) 
	{
		var addlFilter = "";
		$.each(tablecomponent.jsonTableDetails.TableDetails, function(key, item) {
			if(item.indexName == collectionName) 
			{
				if(requestObject.filterString && requestObject.filterString != '') 
					addlFilter = requestObject.filterString + " " + item.additionalFilters;
				else
					addlFilter = item.additionalFilters;
			}
		});
		return addlFilter;
    },
	 _getTableIndexName:function()
	{
		return tablecomponent.columnListDetailsArray.indexes;			 
	},
	
};

