 var knowledgeaddpackage = {
	rows_selected:[],
	moreFilterObj : {},
        allPackagedDocArray:[],
	GetAllKnowledgeStoreData:[],
	selectedDocList:[],
	json_doc_data: {},
	userRole:"admin",
	allowEditKnowledge:false,
	knowledge_package_stored_details:{},
	selected_knowledge_package:{},
	moreFilterCompModalID:'knowledgeAddMoreFilterCompModal',
	moreFilterJsonFileName:'moreFilter',
	tableJson:'tableDetails',
	popupTableID:'knwldgAddCompTable',
	//Prabhu 2309
	popupTablecomponentRef:'',
        requestSearchCount:999,
        popupSearchStr:'',
	searchTerm:'',
	isNewSearchTerm:'',
	searchObj:{},
	popupSearchcomponentRef:'',
	popupFilterColumnID : 'KDAPColumnTogglerDropdown',
	tableID:'knwldgAddPackageTable',
	duplicatefound:false,
	allDeletedDocArray:[],
	columnListDetailsArray:{},
        package_knowledges:[], 
	savedKnowledgeAddPackageAllData:{},
	knowledgePackageDoscList:[],
	hideTableColumns:[],
	mobileViewTableColumnCollection:[],
	actionsRef:'',
        Assignations_collection:[],
	addPackage_table:'',
	allDeleteDocs:[],
        arrAssigneedocMapping: new Array(),
        packageid:'',
	objTrainingDetails:{},
	arrReviewers:[],
	
	 /* Init function  */
	reinit:function(){
		knowledgeaddpackage.actionsRef._setCurrentPage(ikePageConstants.KNOWLEDGE_ADD_PACKAGE);
		knowledgeaddpackage.actionsRef._setTargetPage(ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
		knowledgeaddpackage.knowledgePackageDoscList = [];
		knowledgeaddpackage.setKnowledgeformData();
		// Prabhu 2609
        if(knowledgeaddpackage.popupSearchcomponentRef!='')
		knowledgeaddpackage.popupSearchcomponentRef._setParentIDContainer('page_knowledgeaddpackage');
		knowledgeaddpackage._allowPermission(knowledgeaddpackage.userRole); 
	},
	init:function(){
		knowledgeaddpackage.handleSummernote();
		knowledgeaddpackage._allowPermission(knowledgeaddpackage.userRole);
		knowledgeaddpackage._filterSearchPortletHeaderDropDown();
		
		$('#page_knowledgeaddpackage .asignee-list-coantainer').fSelect();
		knowledgeaddpackage._setUsersData();
		knowledgeaddpackage._renderAddKnowledgeDocDataTable();
		
	$("#page_knowledgeaddpackage #addKnowledgeDocument").live('click', function(e){
		$("#page_knowledgeaddpackage #knowledgeAddDocTableModal").modal('show');
		knowledgeaddpackage.onLoadPopupSearchComponent();
		knowledgeaddpackage.onLoadPopupTableComponent();
	});
	
	$("#page_knowledgeaddpackage .fs-optgroup-label").on("click", function(event) {
      console.log("111")
       var nl = $( this ).attr("customattr");
      
       if($( this ).hasClass('expanded')){
          $( this ).removeClass('expanded');
          $( this ).addClass('closed');
          if(! $( this ).hasClass('selected') ){
              $('div.fs-option-sub').each(function () {
                if(nl == $( this ).attr('customattr')){
                  $( this ).removeClass('selected');
                }
             });
          }
          $('div.fs-option-sub').each(function () {
              if(nl == $( this ).attr('customattr')){
                console.log("SSSS  : "+$( this ).attr('customattr'))
                $( this ).css('display','none');
              }
           });
       }
       else{
           $( this ).addClass('expanded');
           $( this ).removeClass('closed');
           
           $('div.fs-option-sub').each(function () {
              if(nl == $( this ).attr('customattr')){
                $( this ).css('display','block');
              }
           });
       }
	  
    });
           knowledgeaddpackage.onLoadActionComponent();
	   knowledgeaddpackage.setKnowledgeformData();
	},

	
	
	_filterSearchPortletHeaderDropDown: function() {

		var roleName = localStorage.getItem('rolename');

		$('#page_knowledgeaddpackage #KPcolumnTogglerDropdown').empty();
		 		
		$.getJSON("json/tableDetailsAddPackage.json?"+Date.now(), function(data) {

			knowledgeaddpackage.jsonTableDetails = data;
			
			knowledgeaddpackage.columnListDetailsArray = {};
			$.each(data.TableDetails, function(key, item) {
			 
				//  Filter Search List will be added based on role.
				if (item.enable == "yes") {

					for (var i = 0; i < item.allowedroles.length; i++) {

						if (item.allowedroles[i] == roleName) {

							var displayName = item.displayName;

							$('#page_knowledgeaddpackage .kp-table-conatainer').append('<div class="col-sm-12 table-scrollable1 table-responsive"><table class="table table-striped table-bordered table-hover dataTable" id="' + knowledgeaddpackage.tableID + '"></table></div>')
							$('#page_knowledgeaddpackage #' + knowledgeaddpackage.tableID).append("<thead><tr id=tableheader_" + displayName + "></tr></thead><tbody id=tablebody_" + displayName + "></tbody>");

							// Set Table Heading for all columns
							// Empty column name for first column                                        
							$('#page_knowledgeaddpackage #tableheader_' + displayName).append('<th class="table-checkbox"><input type="checkbox" name="group-checkable" class="group-checkable" data-set="#page_knowledgeaddpackage #'+ knowledgeaddpackage.tableID +' .checkboxes"/></th>');
							
							for (var j = 0; j < item.Details.fields.length; j++) {                                

								if(item.Details.fields[j].displayType != "expansion")
								$('#page_knowledgeaddpackage #tableheader_' + displayName).append("<th class='sorting ISEcompactAuto'>" + item.Details.fields[j].displayName + "</th>");
							}
							
							var dropDownBoxId = "columnToggler_" + displayName;
							var tableID = '#page_knowledgeaddpackage #' + knowledgeaddpackage.tableID;
							var _obj = new Object();
							_obj.dropDownBoxId = 'KPcolumnTogglerDropdown';
							_obj.tableID = tableID;
							_obj.defaultView = item.defaultView;
							_obj.itemDetailsfields = item.Details.fields;
							_obj.indexes = item.indexName;
							_obj.displayName = displayName;
							
							knowledgeaddpackage.columnListDetailsArray = _obj;

							knowledgeaddpackage.mobileViewTableColumnCollection.push({
								"tableID": 'page_knowledgeaddpackage #' + knowledgeaddpackage.tableID,
								"columnsList": item.mobileView,
								"dropdownID": 'columnToggler_' + displayName
							});
						}
					}					  
				}					
			});
			
			var getCurrentSelectedTabData = knowledgeaddpackage.columnListDetailsArray;
			knowledgeaddpackage._fillColumnListinDropdown(getCurrentSelectedTabData.dropDownBoxId, getCurrentSelectedTabData.tableID, getCurrentSelectedTabData.defaultView, getCurrentSelectedTabData.itemDetailsfields);			             
		});
	},
	
	_fillColumnListinDropdown: function(dropDownBoxId, tableID, defaultColumnView, ColumnsList) {

		$('#page_knowledgeaddpackage #' + dropDownBoxId).empty();

		var tempArr = new Array();
		
		for (var i = 0; i < ColumnsList.length; i++) {
			if(ColumnsList[i].type!="expansion")
				tempArr.push(ColumnsList[i].displayName);		
		}
	   
		var colunmnID = 0;
		var tableColumnID = 0;
		var tableHideColumns = new Array();
		$.grep(tempArr, function(element) {

			colunmnID = colunmnID + 1;

			if ($.inArray(element, defaultColumnView) !== -1) 
			{
				$('#page_knowledgeaddpackage #' + dropDownBoxId).append('<label><input type="checkbox" name="column" checked="true" columnID=' + colunmnID + ' disabled  data-column=' + colunmnID + '>' + element + '</label>');
			} 
			else 
			{
				tableColumnID = colunmnID + 1;
				tableHideColumns.push(parseInt(tableColumnID));
				$('#page_knowledgeaddpackage #' + dropDownBoxId).append('<label><input type="checkbox" name="column"  columnID=' + colunmnID + ' data-column=' + colunmnID + '>' + element + '</label>');
			}
		});

		knowledgeaddpackage.hideTableColumns.push({
			"tableID": tableID,
			"hideColumnsList": tableHideColumns,
			"allColumnsNames": tempArr
		});


		$('input[type="checkbox"]', '#' + dropDownBoxId).change(function(e) {

		   var iCol = parseInt($(this).attr("data-column"));
			var oTable = $(tableID).dataTable();
			var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
			oTable.fnSetColumnVis(iCol, bVis ? false : true);
			var chkVal = $(this).parent().text();
			if(bVis)
				knowledgeaddpackage._insertOrDeleteDefaultTableColValue(chkVal, 'remove');
			else
				knowledgeaddpackage._insertOrDeleteDefaultTableColValue(chkVal, 'insert');
			
			var table_wrapper = $('#page_knowledgeaddpackage #' + tableID+'_wrapper')
			if( table_wrapper.width() > oTable.width() )
			{
				table_wrapper.css('overflow-x', 'visible')
			}else{
				table_wrapper.css('overflow-x', 'none')
			}
             e.stopImmediatePropagation();
		});

        $('input[type="checkbox"]', '#page_knowledgeaddpackage #' + dropDownBoxId).click(function(e) {
        
            var attr = $(this).closest("span").attr("class");

            if (typeof attr == typeof undefined || attr == false||attr == "") {                 
                $(this).closest("span").attr("class","checked");
            }
			else
				$(this).closest("span").removeAttr("class");
				
			// Prevent click event from propagating to parent
			e.stopImmediatePropagation();
		});

		$( "#page_knowledgestore #dataTablePageChange select" ).on('change', function() {
			console.log($( this ).val());
			knowledgeaddpackage.requestSearchCount = $( this ).val();
		});

	},
	
	_insertOrDeleteDefaultTableColValue:function(chkVal, action)
	{
		if( knowledgeaddpackage.columnListDetailsArray.displayName)
		{
			if(action=='insert')
			{
				knowledgeaddpackage.columnListDetailsArray.defaultView.push(chkVal);
			}
			else if(action=='remove')
			{
				var k = knowledgeaddpackage.columnListDetailsArray.defaultView.indexOf(chkVal);
				if(k != -1) 
				{
					knowledgeaddpackage.columnListDetailsArray.defaultView.splice(k, 1);
				}
			 }
			 knowledgeaddpackage.columnListDetailsArray.defaultView = knowledgeaddpackage._uniqueArray(knowledgeaddpackage.columnListDetailsArray.defaultView);
			}
	},
	
	_getLastUpdatedDateTime:function(pDateTime)
	{
		var today = new Date();		
		var diffMs = (today - pDateTime); 
		var diffMins =  Math.round(diffMs / 60000); 
		if (diffMins <= 60)
			return "" + diffMins + " minutes ago."
		else if (diffMins > 60 && diffMins <= 1440)
		{
			var hours = parseInt(diffMins / 60);
			var min = diffMins - (hours * 60);
			if (hours > 1)
				return "" + hours + " hours ago."
			else
				return "" + hours + " hour ago."			
		}
		else if (diffMins > 1440 && diffMins <= 43200)
		{
			var days = parseInt(diffMins / 1440);
			
			if (days > 1)
				return "" + days + " days ago."
			else
				return "" + days + " day ago."		
		}
		else if (diffMins > 43200 && diffMins <= 86400)
			return "Last Month.";
		else if (diffMins > 86400 && diffMins <= 129600)
			return "3 Months ago.";
		else if (diffMins > 129600 && diffMins <= 259200)
			return "4-6 Months ago.";
		else if (diffMins > 259200 && diffMins <= 388800)
			return "7-9 Months ago.";
		else if (diffMins > 388800 && diffMins <= 518400)
			return "10-12 Months ago."
		else
			return "More then 1 Year.";
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
	
	_receivedSearchResults: function(dataObj) 
	{		
		if (ISEUtils.validateObject(dataObj)) 
		{		
			var FieldsMap = {};
			var DisplayNameMap = {};
			var displayColumns = {};
			var tC = {};

			knowledgeaddpackage.json_doc_data = dataObj
		 
			for (var K in knowledgeaddpackage.jsonTableDetails.TableDetails) 
			{
				var temp = new Array();
				for(var l=0;l<knowledgeaddpackage.jsonTableDetails.TableDetails[K].Details.fields.length;l++)
				{
					var obj =knowledgeaddpackage.jsonTableDetails.TableDetails[K].Details.fields[l];
					if(obj.displayType != "expansion")                          
						temp.push(obj);                         

				}

				FieldsMap[knowledgeaddpackage.jsonTableDetails.TableDetails[K].indexName] = temp;
				DisplayNameMap[knowledgeaddpackage.jsonTableDetails.TableDetails[K].indexName] = knowledgeaddpackage.jsonTableDetails.TableDetails[K].displayName;
				displayColumns[knowledgeaddpackage.jsonTableDetails.TableDetails[K].indexName] = knowledgeaddpackage.jsonTableDetails.TableDetails[K].defaultView;
			}


			var sortField = 1;
			var fields = FieldsMap[dataObj[0]._index];
			for (var ii = 0; ii < fields.length; ii++) 
			{
				if (fields[ii].SourceName == 'similarity') sortField = ii + 1;
			}
            
			for (var i = 0; i < dataObj.length; i++) 
			{
			
				var issimilarDefectId = false;
				var fields = FieldsMap[dataObj[i]._index];
				var dName = DisplayNameMap[dataObj[i]._index];
				var tableID = '#page_knowledgeaddpackage #' + knowledgeaddpackage.tableID;
				if (!tC[tableID]) 
				{
					var oTable = $(tableID).dataTable();
					oTable.fnClearTable();
					oTable.fnDestroy();
				}
				tC[tableID] = 1;

				var documentIdColumnName = "_id";
				var indexCollectionname = "_index";
				var documenttype = "type";
				var documenttype = escape(dataObj[i][documenttype]); 
				if(!documenttype || documenttype == 'undefined')
				{
					documenttype = 'file'
				}
				var documentID = escape(dataObj[i][documentIdColumnName]);
				var sourceLineURL="sourceline";
				var row_inc = (i+1);
				var newRowContent = '<tr class="odd gradeX" data-row-id="'+row_inc+'"><td><input document-id="'+documentID+'"  type="checkbox" class="checkboxes" value="'+row_inc+'"/></td>';
				
				for (var ii = 0; ii < fields.length; ii++) 
				{
					var documentID = escape(dataObj[i][documentIdColumnName]);
					var simplifyURL = (dataObj[i]["simplifyURL"]);
					var indexCollection = escape(dataObj[i][indexCollectionname]); 
					var sourceLine = escape(dataObj[i][sourceLineURL]);						  

					if(documentID === undefined)
					{
						newRowContent += '<td class="ISEcompactAuto"><span sourceLine="null" documentID="null" indexCollection="null" requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';
					}
					else
					{
						if(fields[ii].displayType.toLowerCase() == "date")                           
						{
							var dateObj = dataObj[i][fields[ii].SourceName];
							var newDateObj = new Date(dateObj);									 
							updatedSince = knowledgeaddpackage._getLastUpdatedDateTime(newDateObj);	
							newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + updatedSince + '</span></td>';
						} 
						else if(fields[ii].displayType.toLowerCase() == "string" || fields[ii].displayType.toLowerCase() == "url" || fields[ii].displayType.toLowerCase() == "download")
						{
							String.prototype.replaceAll = function(target, replacement) {
								return this.split(target).join(replacement);
							};
							var textContent = dataObj[i][fields[ii].SourceName];
									
							var completeText = dataObj[i][fields[ii].SourceName];
									
							if(undefined !=textContent && 'undefined' != textContent && typeof textContent !== "number")
							{
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
									subTextContent = (textContent.length > 18) ? textContent.substring(0,18) + "...." : textContent;
                                else
								{
									subTextContent = knowledgeaddpackage.remove_tags(subTextContent);
									if (subTextContent.length > 100)
										subTextContent = subTextContent.substring(0,100) + "....";
								}
										
								if(typeof subTextContent !== "number")
								{
									subTextContent = subTextContent.replaceAll('<br>','&nbsp;');
									subTextContent = subTextContent.replaceAll('##','<em class="iseH">');
									subTextContent = subTextContent.replaceAll("#","</em>");
								}
									
								var escapeContent = escape(textContent);
															
								if(textContent.length >= 0  && fields[ii].displayType.toLowerCase() == "url")
								{
									newRowContent += '<td class="ISEcompactAuto"><span title="'+completeText+'" sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' ><a href="javascript:;" doc-id="'+documentID+'" id="kdTitleRow">' +subTextContent+'</a></span></td>';
								}
								else if(textContent.length > 0 && textContent.length < 100)
								{
									newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' >' + subTextContent + '</span></td>';
								}
								else
								{									
									newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' >' +subTextContent+'</span></td>';												
								}
							}											
						}
                        else if (fields[ii].displayType.toLowerCase() == "array" && fields[ii].SourceName.toLowerCase() == "tags")
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
						else if (fields[ii].displayType.toLowerCase() == "array")
						{
							var arrContent = dataObj[i][fields[ii].SourceName];
							var textVal = "";
							if (arrContent)
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
							newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' >' +textVal+ '</span></td>';
						}
						else if (fields[ii].displayType.toLowerCase() == "datepicker")
						{							
							newRowContent += '<td class="ISEcompactAuto" >'+knowledgeaddpackage._renderDatePicker(fields[ii].SourceName, fields[ii].displayName, documentID)+'</td>';
						}
						else if (fields[ii].displayType.toLowerCase() == "multiselect")
						{
							newRowContent += '<td class="ISEcompactAuto" >'+knowledgeaddpackage._renderMultiSelect(fields[ii].SourceName, fields[ii].displayName, documentID, fields[ii].subOptions)+'</td>';
						}
						else if (fields[ii].displayType.toLowerCase() == "combobox")
						{
							if (fields[ii].subOptions)
								newRowContent += '<td class="ISEcompactAuto" >'+knowledgeaddpackage._renderCombobox(fields[ii].SourceName, fields[ii].displayName, documentID, fields[ii].subOptions)+'</td>';
							else
								newRowContent += '<td class="ISEcompactAuto" >'+knowledgeaddpackage._renderCombobox(fields[ii].SourceName, fields[ii].displayName, documentID, knowledgeaddpackage.arrReviewers)+'</td>';
						}
						else
						{								
							newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';
						}
					}								  					
				}
				 
				newRowContent += '</tr>';
				$('#page_knowledgeaddpackage #tablebody_' + dName).append(newRowContent);				
			}
			
			for (var tab in tC) 
			{
				var tableColumnsCount = $(tab).find('tr')[0].cells.length;
				var tempArr = new Array();
				for(var i=1;i<tableColumnsCount;i++)
				{
					tempArr.push(i);                    
				}
				knowledgeaddpackage._handleUniform();
				knowledgeaddpackage.addPackage_table =  $('#page_knowledgeaddpackage #' + knowledgeaddpackage.tableID).DataTable({
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
					//"order": [
						//[sortField, 'desc']
					//],
					
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
								
				$('#page_knowledgeaddpackage #' + knowledgeaddpackage.tableID +' tbody #kdTitleRow').live('click', function(e){
					var __knowledgeDocData = new Object();
					__knowledgeDocData.doc_id = $(this).attr("doc-id");
					__knowledgeDocData.doc_title = $(this).text();
					__knowledgeDocData.doc_type = 'knowledgeView';
					__knowledgeDocData.current_page_name = ikePageConstants.KNOWLEDGE_ADD_PACKAGE;
										
					localStorage.removeItem('selectedKnowledgeEditDoc');
					localStorage.removeItem('selectedKnowledgeViewDoc');	
					localStorage.setItem('selectedKnowledgeViewDoc', JSON.stringify(__knowledgeDocData));
					$(location).attr('hash',ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
				});
				
				$('#page_knowledgeaddpackage #' + knowledgeaddpackage.tableID +' tbody .date-picker').on('click', function(e){
				
					var id = $(this).attr("id");
					var knowledgeId = $(this).attr("documentID");
					var fieldName = $(this).attr("fieldName");					
					
					$('#'+id).datepicker({
						startDate: '+0d',
						autoclose: true,
						rtl: Metronic.isRTL(),
						orientation: "left",
						format: "yyyy-mm-dd",						
					}).datepicker('show');
										
					$('#'+id).attr('readonly', 'readonly');
										
					$("#page_knowledgeaddpackage #"+id).live('change', function(e) {
						var date =  $(this).val();
						console.log(id + ":" + date);
						knowledgeaddpackage._updateTrainingDetails(knowledgeId, fieldName, date);						
					});
					
					if (knowledgeaddpackage.objTrainingDetails[knowledgeId])
					{
						var value = knowledgeaddpackage.objTrainingDetails[knowledgeId][fieldName];
						$('#'+id).datepicker('setDate', value);
					}
										
				});
																
				$('#page_knowledgeaddpackage #' + knowledgeaddpackage.tableID +' tbody').on('click', 'input[type="checkbox"]', function(e)
				{
					var $row = $(this).closest('tr');

					// Get row data
					var data = knowledgeaddpackage.addPackage_table.row($row).data();
					// Get row ID
					var rowId = data[0];					
					// Determine whether row ID is in the list of selected row IDs 
					var index = $.inArray($row[0], knowledgeaddpackage.rows_selected);

					// If checkbox is checked and row ID is not in list of selected row IDs
					if(this.checked && index === -1){
						knowledgeaddpackage.rows_selected.push($row[0]);
						
					// Otherwise, if checkbox is not checked and row ID is in list of selected row IDs
					} 
					else if (!this.checked && index !== -1)
					{
						knowledgeaddpackage.rows_selected.splice(index, 1);
					}

					if(this.checked)
					{
						$row.addClass('selected');
					} 
					else 
					{
						$row.removeClass('selected');
					}

					// Update state of "Select all" control
					knowledgeaddpackage._updateDataTableSelectAllCtrl(knowledgeaddpackage.addPackage_table);
					if(knowledgeaddpackage.rows_selected.length > 0)
					{						
						$("#page_knowledgeaddpackage #removeKnowledgeDocument").prop('disabled', false)
					}
					else
					{					
						$("#page_knowledgeaddpackage #removeKnowledgeDocument").prop('disabled', true)
					}
					
					// Prevent click event from propagating to parent
					e.stopImmediatePropagation();
				});

				// Handle click on table cells with checkboxes
				$('#page_knowledgeaddpackage #' + knowledgeaddpackage.tableID).on('click', 'tbody td, thead th:first-child', function(e){
					  //$(this).parent().find('input[type="checkbox"]').trigger('click');
				});

				// Handle click on "Select all" control
				$('thead input[name="group-checkable"]', knowledgeaddpackage.addPackage_table.table().container()).on('click', function(e){
					if(this.checked){
						$('#page_knowledgeaddpackage #' + knowledgeaddpackage.tableID +' tbody input[type="checkbox"]:not(:checked)').trigger('click');
					} 
					else 
					{
						$('#page_knowledgeaddpackage #' + knowledgeaddpackage.tableID +' tbody input[type="checkbox"]:checked').trigger('click');
					}

					// Prevent click event from propagating to parent
					e.stopImmediatePropagation();
				});

				   // Handle table draw event
				knowledgeaddpackage.addPackage_table.on('draw', function(){
					// Update state of "Select all" control
					knowledgeaddpackage._updateDataTableSelectAllCtrl(knowledgeaddpackage.addPackage_table);
				});
					  
                //   Delete knowledge from Mongo functionality
                $('#page_knowledgeaddpackage #removeKnowledgeDocument').click( function (e) {                  
					if(knowledgeaddpackage.rows_selected.length > 0)
					{
						var response = confirm("Are you sure you want to delete selected document(s)?");
						if(response)
						{
							var tableID = '#page_knowledgeaddpackage #' + knowledgeaddpackage.tableID;
							var oTable =  $(tableID).dataTable();				       
									
							for(var i=0; i<knowledgeaddpackage.rows_selected.length; i++)
							{  
								var nTr = knowledgeaddpackage.rows_selected[i];
				
								var aData = oTable.fnGetData(nTr);

								var knowledgeID = $(aData[1]).attr('documentid');
								var __obj = new Object();
								__obj.knowledgeID = knowledgeID;
								__obj.rowID = nTr._DT_RowIndex;
								
								//knowledgeaddpackage._deleteKnowledgemapping(knowledgeID);
																	
								knowledgeaddpackage.allDeleteDocs.push(__obj);								
							}
							
							if (knowledgeaddpackage.allDeleteDocs.length > 0)
								knowledgeaddpackage.allDeleteDocs.sort(function (a, b) {return b.rowID - a.rowID;});

												
							$.each(knowledgeaddpackage.allDeleteDocs, function( index, value ) {
								knowledgeaddpackage.addPackage_table.row(value.rowID).remove().draw( false );
							});
							
							knowledgeaddpackage.allDeletedDocArray = knowledgeaddpackage.allDeletedDocArray.concat(knowledgeaddpackage.allDeleteDocs)
							knowledgeaddpackage.removeDocsFromMainlist(knowledgeaddpackage.allDeleteDocs);
							$("#page_knowledgeaddpackage #removeKnowledgeDocument").prop('disabled', true);													
							console.log("Deleted values are : "+JSON.stringify(knowledgeaddpackage.allDeleteDocs));
			
							knowledgeaddpackage.allDeleteDocs=[];
							  
						}
					}
					else
					{
						alert("Please select atleast one document to delete.");  
					}
					
					knowledgeaddpackage.rows_selected=[];
					e.stopImmediatePropagation();
				});
					
				$('body').live('click', function (e) {
					$('[data-toggle="popover"]').each(function () {
						//the 'is' for buttons that trigger popups
						//the 'has' for icons within a button that triggers a popup
						if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
							$(this).popover('hide');
						}
					});
				});
				
				$(tab+"_wrapper").css('overflow-x', 'hidden');
				if( $(window).width() < 500 ) {
					$(document).scrollTop($('#searchResultsTable').offset().top);
					$(tab+"_wrapper").css('overflow-x', 'auto');
				}
			}

			for (var i = 0; i < knowledgeaddpackage.hideTableColumns.length; i++) {
				var iTD = knowledgeaddpackage.hideTableColumns[i].tableID;
				if (!tC[iTD]) continue; 

				var tempstr = knowledgeaddpackage.columnListDetailsArray.dropDownBoxId;
				console.log(tempstr)

				var table = $(iTD).DataTable();
				
				for (var j = 0; j < knowledgeaddpackage.hideTableColumns[i].hideColumnsList.length; j++) {

					var columnID = knowledgeaddpackage.hideTableColumns[i].hideColumnsList[j] - 1;                      
					table.column(columnID).visible(false, false);
					$('#page_knowledgeaddpackage #'+tempstr+' input[columnID='+columnID+']').closest( "span" ).removeAttr("class");					
				}
			}

			$('#searchResultsTable').removeClass("hide");

			knowledgeaddpackage.searchResultsReceived = true;
			//  Hide Table rows dropdown and Table Search
			$("div").find(".dataTables_length").addClass('hidden-sm hidden-xs');
			$("div").find(".dataTables_filter").addClass('hidden-sm hidden-xs');

			var windowWidth = $(window).width();
			if (windowWidth <= 400) {
				knowledgeaddpackage.onResizeWindow();//todo
				$("html, body").animate({
					scrollTop: $(document).height()
				}, 1000);
			}
		}
		else 
		{									 						
			var oTable = $('#page_knowledgeaddpackage #' + knowledgeaddpackage.tableID).dataTable();
			oTable.fnClearTable();
			oTable.fnDestroy();	
		}
 		
		$("#addExpand").css("width", "3.40%");
		

		var sourceCodeTableRowCount = $('#sample_4_SourceCode tbody').children().length;      
		ISEUtils.portletUnblocking("pageContainer");

		Pace.stop();
	},
	
	_renderCombobox:function(pFieldName, pDisplayName, pKnowledgeId, pOptions)
	{
		var id = pDisplayName.toLowerCase() + "-" + pKnowledgeId;
		var htmlData = '<select id="dds_' + id + '" fieldName="'+ pFieldName +'" documentID="'+pKnowledgeId+'" class="multiple-select">';
		htmlData += '<option value="None">Select</option>';
		for(var i=0; i < pOptions.length; i++)
		{			
			var selected = ""
			if (knowledgeaddpackage.objTrainingDetails[pKnowledgeId])
				selected = (pOptions[i] == knowledgeaddpackage.objTrainingDetails[pKnowledgeId][pFieldName])
								?"selected"
								:"";
			htmlData += ' <option value="'+pOptions[i]+'"'+selected+'>'+pOptions[i]+'</option>';
		}
		htmlData += '</select>';
		
		$("#dds_"+id).select2();
		
		knowledgeaddpackage._onChangeMultiSelect("dds_" + id);
		
		return htmlData;
	},
	
	_renderDatePicker:function(pFieldName, pDisplayName, pKnowledgeId)
	{
		var id = "dp_"+pDisplayName.toLowerCase() + "-" + pKnowledgeId;
		
		var value = ""
		if (knowledgeaddpackage.objTrainingDetails[pKnowledgeId])
			value = knowledgeaddpackage.objTrainingDetails[pKnowledgeId][pFieldName];
							
		var htmlData = '<input type="text" fieldName="'+pFieldName + '" id="'+id+'" documentID="'+pKnowledgeId+'" value="'+value+'" class="date-picker">'
		
		return htmlData;
	},
	
	_renderMultiSelect:function(pFieldName, pDisplayName, pKnowledgeId, pOptions)
	{
		var id = pDisplayName.toLowerCase() + "-" + pKnowledgeId;
		
		var htmlData = '<select multiple="multiple" id="ddm_' + id + '" fieldName="'+ pFieldName +'" documentID="'+pKnowledgeId+'" class="multiple-select">';
		for(var i=0; i<pOptions.length; i++)
		{
			var selected = ""
			if (knowledgeaddpackage.objTrainingDetails[pKnowledgeId])
				selected = (pOptions[i] == knowledgeaddpackage.objTrainingDetails[pKnowledgeId][pFieldName])
								?"selected"
								:"";
			htmlData += ' <option value="'+pOptions[i]+'"'+selected+'>'+pOptions[i]+'</option>';
		}
		htmlData += '</select>';
		
		$("#ddm_"+id).select2();
		
		knowledgeaddpackage._onChangeMultiSelect("ddm_" + id)
		
		return htmlData;
	},
	
	_onChangeMultiSelect:function(pId)
	{
		$('#page_knowledgeaddpackage #'+pId).live('change', function() {	
			var id = $(this).attr("id");
			var knowledgeId = $(this).attr("documentID");
			var fieldName = $(this).attr("fieldName");					
		
			var selOptions =  $(this).val();
			console.log(id + ":" + selOptions);
			
			knowledgeaddpackage._updateTrainingDetails(knowledgeId, fieldName, selOptions);	
		});
	},
	
	_updateTrainingDetails:function(pKnowledgeId, pFieldName, pValue){	
		
		var objDetails = new Object();
		
		if (knowledgeaddpackage.objTrainingDetails[pKnowledgeId] != undefined)
		{
			objDetails = knowledgeaddpackage.objTrainingDetails[pKnowledgeId];
		}
		
		objDetails[pFieldName] = pValue;

		knowledgeaddpackage.objTrainingDetails[pKnowledgeId] =  objDetails;
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
	
	 _previusscreen : function()
    {
     var pagename = localStorage.getItem('PreviousScreen');
     if(pagename)
      $(location).attr('hash',pagename);
      else
      window.history.back();
    },

	removeDocsFromMainlist:function(data_array){
		for(var i=0; i<data_array.length; i++){
			knowledgeaddpackage.removeObjectFromMainList(data_array[i].knowledgeID)
		}
	},
	_AddCustomEventsForAddKnowledgeSearchPopup: function(){
		//Custom Event Handlers
	   
		$( '#page_knowledgeaddpackage' ).on( ikeEventsConstants.START_SEARCH,{
		   
	    }, function( event, search_str ) {
		   knowledgeaddpackage.popupSearchStr =  search_str;
			if( knowledgeaddpackage.popupSearchStr.length > 0)
				knowledgeaddpackage._contextSearchFunc();
		});
	},
	_AddCustomEventsForAddKnowledgeTablePopup: function(){
		//Custom Event Handlers
	   
		$( '#knowledgeAddDocTableModal' ).on( ikeEventsConstants.ROW_SELECTED,{
		   
		}, function( event, selectedRows ) {
		   
		});
		$( '#knowledgeAddDocTableModal' ).on( ikeEventsConstants.SAVE_MORE_FILTER, {
			 
		}, function( event, filterData ) {
			console.log( filterData );
			knowledgeaddpackage.moreFilterObj = JSON.parse(filterData);
			knowledgeaddpackage.requestProcessRequest();
			 
		}); 
		
		$( '#knowledgeAddDocTableModal' ).on( ikeEventsConstants.CLEARED_ALL_MORE_FILTER, {
			 
		}, function( event, filterData ) {
			console.log( filterData );
			knowledgeaddpackage.moreFilterObj = {};
			knowledgeaddpackage.requestProcessRequest();
			 
		}); 
		
		$( '#knowledgeAddDocTableModal' ).on( ikeEventsConstants.REMOVED_ONE_MORE_FILTER, {
			 
		}, function( event, filterData ) {
			console.log( filterData );
			knowledgeaddpackage.moreFilterObj = JSON.parse(filterData);
			knowledgeaddpackage.requestProcessRequest();
			 
		}); 
	},
	
	addKnowledgeDocHandler: function(){
		console.log("This is function is for to create the package. TODO");
		var allSelectedDocs = [];
		knowledgeaddpackage.allPackagedDocArray = [];
		knowledgeaddpackage.selectedDocList = [];
		$('#page_knowledgeaddpackage #'+knowledgeaddpackage.popupTableID+' .checkboxes:checked').each(function() {  
			 var __obj = new Object();
			 __obj.value = $(this).attr('value');
			 __obj.documentid = $(this).attr('document-id');
			 __obj.documentdetails = knowledgeaddpackage.popupTablecomponentRef._getDocDetails(__obj.documentid);
			knowledgeaddpackage.allPackagedDocArray.push(__obj);
			knowledgeaddpackage.selectedDocList.push(__obj.documentdetails);
			allSelectedDocs.push($(this).attr('value'));
		});
		if(allSelectedDocs.length <=0)  
		{  
			alert("Please select atleast one document to Package.");  
		}
                else{			
			var c = confirm('Are you sure you want to Package this Knowledge?');
			if(c)
                        {				 
				  $("#page_knowledgeaddpackage #knowledgeAddDocTableModal").modal('hide');
				  var _addPackageDetails = new Object();
					_addPackageDetails.addType = 'existing';
					_addPackageDetails.Documents = knowledgeaddpackage.selectedDocList;
					                    
                    for(var i=0; i<_addPackageDetails.Documents.length; i++)
                    {                    
                      if(knowledgeaddpackage.selected_knowledge_package.Documents)
                      {
                        var index = knowledgeaddpackage.selected_knowledge_package.Documents.map(function(x) {return x._id; }).indexOf(_addPackageDetails.Documents[i]._id);

                        if(index === -1)
                        {
                            var tempobject = new Object();
                            tempobject._id= _addPackageDetails.Documents[i]._id;

                            
                              var  str = _addPackageDetails.Documents[i].title;
                              html = $.parseHTML( str );
                              var $log = $( "#log" );                
                              $log.append( html );
                              tempobject.title= $log.text() ;
                              $log.text('');

                            knowledgeaddpackage.selected_knowledge_package.Documents.push(tempobject);
                           // knowledgeaddpackage.package_knowledges.push(tempobject);;	
                            
                        }
                        knowledgeaddpackage.selected_knowledge_package.addType="existing";
                      }
		    }
                    // when landed from ad new package
                    if(!knowledgeaddpackage.selected_knowledge_package.Documents)
                    {
                        if(_addPackageDetails.Documents)
                        {
                          for(var counter=0; counter<_addPackageDetails.Documents.length;counter++)
                          {
                            var tempobject = new Object();
                            tempobject._id= _addPackageDetails.Documents[counter]._id;
                              var  str = _addPackageDetails.Documents[counter].title;
                               
                              html = $.parseHTML( str );
                              var $log = $( "#log" );                
                              $log.append( html );
                              tempobject.title= $log.text() ;
                              $log.text('');

                            if(!knowledgeaddpackage.selected_knowledge_package.Documents)
                            {
                            knowledgeaddpackage.selected_knowledge_package.Documents = new Array();
                            }
                             knowledgeaddpackage.selected_knowledge_package.Documents.push(tempobject);
                             //knowledgeaddpackage.selected_knowledge_package.addType="New";
                          }
                        }
		}

					
				knowledgeaddpackage._appendKnowledgeStoreList(knowledgeaddpackage.selectedDocList)
				knowledgeaddpackage.popupTablecomponentRef.rows_selected = [];
				toastr.success('You have successfully added the selected files to your package', 'Success');
				knowledgeaddpackage._receivedSearchResults(knowledgeaddpackage.knowledgePackageDoscList); 
				console.log("Selected Knowledge values are : "+JSON.stringify(knowledgeaddpackage.allPackagedDocArray));
			}
		}
	},

    	setKnowledgeformData: function(){
		
		knowledgeaddpackage.objTrainingDetails = {};
		
		knowledgeaddpackage.selected_knowledge_package = JSON.parse(localStorage.getItem('selectedKnowledgePackage'));
		//This is the case when we are coming from the kwowledeg store form .
		if(knowledgeaddpackage.selected_knowledge_package){
                   
			localStorage.removeItem('selectedKnowledgePackage'); 
          
           if(knowledgeaddpackage.selected_knowledge_package._id)
            {
             knowledgeaddpackage.loadPackageInformation(knowledgeaddpackage.selected_knowledge_package._id);
             $('#page_knowledgeaddpackage #knowledge_description').summernote('code','');
            }
            else
            {
		   
		    var packagetitle = decodeURI(knowledgeaddpackage.selected_knowledge_package.package_title).trim();
			knowledgeaddpackage.getAssignationHistoryData(packagetitle);
            // Commented below line to show already assigned users 
            knowledgeaddpackage.loadPackageData();
		    //knowledgeaddpackage._renderPackageAssignationHistoryDataTable(packagetitle)
			
            $("#page_knowledgeaddpackage #knowledge_title").val(packagetitle);
			$("#page_knowledgeaddpackage .page-title").text(knowledgeaddpackage.selected_knowledge_package.package_title);
			$('#page_knowledgeaddpackage #knowledge_description').summernote('code',knowledgeaddpackage.selected_knowledge_package.package_descriptions);
          }

			var array = $.map(knowledgeaddpackage.selected_knowledge_package.Documents, 
			function(value, index) {return [value];});
			
					
			knowledgeaddpackage.selected_knowledge_package.Documents=array;
			
			if(knowledgeaddpackage.selected_knowledge_package.Documents.length > 0)
			{
				{
					var searchstring='';
					
					for(var i=0;i<knowledgeaddpackage.selected_knowledge_package.Documents.length ; i++ )
					{
						searchstring = searchstring + "_id:" + knowledgeaddpackage.selected_knowledge_package.Documents[i]._id;	
                        
                        //collecting 
                        //knowledgeaddpackage.package_knowledges.push(knowledgeaddpackage.selected_knowledge_package.Documents[i]);				
						
						if(i < knowledgeaddpackage.selected_knowledge_package.Documents.length -1)
						{
							searchstring = searchstring +  " OR ";
						}
						
					}
					knowledgeaddpackage.searchObj.type = "similar";
					knowledgeaddpackage.searchObj.input = searchstring;
					knowledgeaddpackage._processSearchRequest(true);
					
				}	
				
			}
		}
		else 
		{
			knowledgeaddpackage.selected_knowledge_package = new Object();
            knowledgeaddpackage.selected_knowledge_package.addType="New";
			knowledgeaddpackage._ResetAllValues();
		}
		
	},
	
	_ResetAllValues: function(){
		$("#page_knowledgeaddpackage #knowledge_title").val('');
		$("#page_knowledgeaddpackage .page-title").text('New Knowledge Package');
		$('#page_knowledgeaddpackage #knowledge_description').summernote('reset');
		$("select.asignee-list-holder").val([]).trigger("change");

          //$("select.asignee-list-holder").val(arrAssignee).trigger("change");
        knowledgeaddpackage.arrAssigneedocMapping= new Array();
		knowledgeaddpackage.savedKnowledgeAddPackageAllData = {};
		knowledgeaddpackage.allDeletedDocArray = [];
		var oTable = $('#'+knowledgeaddpackage.tableID).dataTable();
		oTable.fnClearTable();
        var oTableHistory =$("#packageAssignationHistoryDataTable").dataTable();
        oTableHistory.fnClearTable();
		//oTable.fnDestroy();
	},
	
	_appendKnowledgeStoreList: function(data){
		 for(var i=0; i<data.length; i++){

                var index = knowledgeaddpackage.knowledgePackageDoscList.map(function(x) {return x._id; }).indexOf(data[i]._id);

                if(index === -1)
                {
                    knowledgeaddpackage.knowledgePackageDoscList.push(data[i]);
                }
		} 
	},
	
	handleSummernote: function () {
        $('#page_knowledgeaddpackage #knowledge_description').summernote({height: 50});
    },
	
	renderAsigneeCombo: function(item, index){
		var lspace = 5;
		if(item.value instanceof(Object)){
		   $(".fs-options").append("<div class='fs-option fs-optgroup-label expanded' customattr="+item.value.group+" data-group='0'><div class='fs-option-label'>"+item.value.node + "</div></div>")
		  /* $(".fs-options").append("<div class='fs-option fs-optgroup-label expanded' style='padding-left:"+lspace+"px' customattr="+item.value.group+" data-value="+item.value+" data-index="+index+"><div class='fs-option-label'>"+item.value.node+"</div></div>");*/
		   item.value.value.forEach(knowledgeaddpackage.renderAsigneeCombo);
		}
		else{
		  
		  if(item.group >= 1){
			lspace = 20;
		  }
		   $(".fs-options").append("<div class='fs-option fs-option-sub g' style='padding-left:"+lspace+"px' customattr="+item.group+" data-value="+item.value+" data-index="+index+"><div class='fs-option-label'>"+item.value+"</div></div>");
		 
		}
	},
	
	_renderHistoryDataTable: function(){
		$.getJSON("json/history.json?"+Date.now(), function(data) {
			var table = $('#historyDataTable').DataTable({
			"searching": false,
			"lengthChange": false,
			data:data.data,
			columns: [
            
            {data: "no"},
			{data: "modified"},
			{data: "modified_by"},
			{data: "no_of_attachments"},
            {data: "status"},   
            {data: "comments"}
			]
			});
		});
	},
	
	getAssignationHistoryData:function(packagename)
	{
		var requestObject = new Object();
			requestObject.searchString = "packagename:" + packagename;
			requestObject.projectName = localStorage.getItem('multiProjectName');
			requestObject.maxResults = 1000;
			requestObject.serachType = "similar";

			var collectionName = "assignation_collection";
			requestObject.collectionName = collectionName;
			ISE.getSearchResults(requestObject, knowledgeaddpackage._receivedAssignatinHistoryResults); 
	},
	
	removeArrayValue: function(docID, _array){
		for(var i=0; i<_array.length; i++){
		  if(docID == _array[i]._id){
			  _array.splice(i, 1);
			  break;
		  }
	  }
	},
	
	_receivedAssignatinHistoryResults: function(dataObj) {
		
		var tableID = '#page_knowledgeaddpackage #packageAssignationHistoryDataTable';
		
		if(dataObj.length==0)
		{
			var oTable = $(tableID).dataTable();
			oTable.fnClearTable();
			oTable.fnDestroy();
			return;
		}	
		
		
		var username = dataObj[0].assignedto;
		var InProgress = false;
		var NotStarted = false;
		
		knowledgeaddpackage.GetAllKnowledgeStoreData = new Array();
				
		for (var i = 0; i < dataObj.length; i++) 
		{
			if(username!=dataObj[i].assignedto)
			{
				username = dataObj[i].assignedto;
				InProgress = false;
				 NotStarted = false;
			}
			
			var result = $.grep(dataObj, 
			function(e){ return e.assignedto == username;});
			
			if(result.length > 0)
			{				
				var resultstatus = $.grep(result, 
					function(e){ return e.status == "In-Progress";});
				
				if(resultstatus.length > 0 )	
				{
					InProgress = true;
					
					var tempresult = $.grep(knowledgeaddpackage.GetAllKnowledgeStoreData, 
					function(e){ return e.assignedto == username;});
					if(tempresult.length ==0)
						knowledgeaddpackage.GetAllKnowledgeStoreData.push(resultstatus[0]);
					
				}
				
				if(!InProgress)
				{
					var resultstatus = $.grep(result, 
					function(e){ return e.status == "Not-Started";});
					
					if(resultstatus.length > 0)
					{
						NotStarted = true;
						if(resultstatus.length == result.length)
						{
							resultstatus[0].status = "Not-Started";
							var tempresult = $.grep(knowledgeaddpackage.GetAllKnowledgeStoreData, 
							function(e){ return e.assignedto == username;});
							if(tempresult.length ==0)
							knowledgeaddpackage.GetAllKnowledgeStoreData.push(resultstatus[0]);						
						}
						else 
						{
							resultstatus[0].status = "In-Progress";
							var tempresult = $.grep(knowledgeaddpackage.GetAllKnowledgeStoreData, 
							function(e){ return e.assignedto == username;});
							if(tempresult.length ==0)
							knowledgeaddpackage.GetAllKnowledgeStoreData.push(resultstatus[0]);						
						}
						
					}
					
				}
					
				if(!InProgress && !NotStarted)
				{
					resultstatus[0].status = "Completed";
					var tempresult = $.grep(knowledgeaddpackage.GetAllKnowledgeStoreData, 
					function(e){ return e.assignedto == username;});
					if(tempresult.length ==0)
					knowledgeaddpackage.GetAllKnowledgeStoreData.push(resultstatus[0]);					
				
				}
				var Index = i;
				for (var j = 0; j < dataObj.length; j++) 
				{
					if(dataObj[j].assignedto==username && j!=Index)
						dataObj.splice(j, 1);
				}
			} 
		}			
		
		dataObj = knowledgeaddpackage.GetAllKnowledgeStoreData;
		
		if (ISEUtils.validateObject(dataObj)) 
		{
			
			var oTable = $(tableID).dataTable();
			oTable.fnClearTable();
			oTable.fnDestroy();
			var table = $(tableID).DataTable({
			"searching": false,
			"lengthChange": false,
			data:dataObj,
			columns: [
			{data: "assignedto"},
			{data: "published_at"},
			{data: "user"},
			{data: "status"},   
			]
			});
		}
		
	}
	,
	_renderPackageAssignationHistoryDataTable: function(){
		
		$.getJSON("json/packageAssignationHistory.json?"+Date.now(), function(data) {
			var table = $('#packageAssignationHistoryDataTable').DataTable({
			"searching": false,
			"lengthChange": false,
			data:data.data,
			columns: [
            {data: "member_name"},
			{data: "assigned_date"},
			{data: "assigned_by"},
            {data: "status"},   
            ]
			});
		});
	},
	_renderAddKnowledgeDocDataTable: function(){
		$.getJSON("json/packageAssignationHistory.json?"+Date.now(), function(data) {
			var table = $('#addPackageDocDataTable').DataTable({
			"searching": false,
			"lengthChange": false,
			data:data.data,
			columns: [
            
            {data: "no"},
			{data: "member_name"},
			{data: "assigned_date"},
			{data: "assigned_by"},
            {data: "status"},   
            {data: "comments"}
			]
			});
		});
	},
	_allowPermission: function(user_role){
		
		switch(user_role){
			case 'manager':
				knowledgeaddpackage.allowEditKnowledge = false;
				$("#page_knowledgeaddpackage #addKnowledgeDocument").addClass('disabled');
				$("#page_knowledgeaddpackage #removeKnowledgeDocument").addClass('disabled');
			break;
			case 'admin':
				knowledgeaddpackage.allowEditKnowledge = true;
				$("#page_knowledgeaddpackage #removeKnowledgeDocument").prop('disabled', true)
			break;
		}
	},
		
	_uniqueArray:function(list) {
		var result = [];
		$.each(list, function(i, e) {
			if ($.inArray(e, result) == -1) result.push(e);
		});
		return result;
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
  
  _getDocDetails:function(doc_id){
	  for(var i=0; i<knowledgeaddpackage.knowledgePackageDoscList.length; i++){
		  if(doc_id == knowledgeaddpackage.knowledgePackageDoscList[i].documentId){
			  return knowledgeaddpackage.knowledgePackageDoscList[i];
		  }
	  }
	  
  },
  
  /* Prabhu STart 2309*/
  _contextSearchFunc: function() 
	{
		if (knowledgeaddpackage.popupSearchStr.length >= 1) 
		{
			//Pace.start();				 
			if(knowledgeaddpackage.searchTerm != knowledgeaddpackage.popupSearchStr)
			{
				knowledgeaddpackage.searchTerm = knowledgeaddpackage.popupSearchStr;
				knowledgeaddpackage.isNewSearchTerm = true;
			}
			else
			{
				knowledgeaddpackage.isNewSearchTerm = false;
			}
			
			ISEUtils.portletBlocking("pageContainer");
			
			knowledgeaddpackage.searchObj.type = "context";
			knowledgeaddpackage.searchObj.input = knowledgeaddpackage.popupSearchStr;
			knowledgeaddpackage.searchObj.input2 = knowledgeaddpackage.popupSearchStr;
			knowledgeaddpackage._processSearchRequest(true);
		}

	},
	
	_processSearchRequest: function(updateURL)//, updateDisplay) 
	{
		console.log('~~~~~ _processSearchRequest  ~~~~~ ');
		if( knowledgeaddpackage.searchObj.lastSearch) {
			if ( (Date.now() - knowledgeaddpackage.searchObj.lastSearch) < 1500) {
				console.log("Trying to search within 1.5 seconds again, there is some bug in your code !! performing no search");
				return;
			}
		}
		knowledgeaddpackage.searchObj.lastSearch = Date.now();
				
		if (updateURL) {
			knowledgeaddpackage._updateURL();
		}
		
		if (knowledgeaddpackage.searchObj.type == 'context') {
			
			var requestObject = new Object();

			requestObject.title = knowledgeaddpackage.searchObj.input.replace(/\//g, " ");
			requestObject.searchString = requestObject.title + ' ' + knowledgeaddpackage.searchObj.input2.replace(/\//g, " ");
			requestObject.filterString = knowledgeaddpackage.popupSearchcomponentRef._getFiltersAsString();
			requestObject.projectName = "";
			requestObject.maxResults = knowledgeaddpackage.requestSearchCount;
			requestObject.serachType = "conextsearch";
			
		   	var collectionName = iseConstants.str_docs_collection;
			requestObject.collectionName = collectionName;
			requestObject.filterString = knowledgeaddpackage.popupTablecomponentRef._getAdditionalFilters(collectionName, requestObject);
			ISE.getSearchResults(requestObject, knowledgeaddpackage._receivedPopupSearchResults);		
		}else if(knowledgeaddpackage.searchObj.type == 'similar') {
			var requestObject = new Object();
			
			requestObject.title = knowledgeaddpackage.searchObj.input.replace(/\//g, " ");
			requestObject.searchString = requestObject.title;
			requestObject.projectName = "";
			requestObject.maxResults = knowledgeaddpackage.selected_knowledge_package.Documents.length;
			requestObject.serachType = "similar";

			//console.log(knowledgestore._getFiltersAsString())
		   	var collectionName = iseConstants.str_docs_collection;
			requestObject.collectionName = collectionName;
			ISE.getSearchResults(requestObject, knowledgeaddpackage._receivedPackageTableSearchResults);
		}    
	},
	
	_receivedPopupSearchResults: function(dataObj) 
	{		
		knowledgeaddpackage.popupTablecomponentRef._receivedSearchResults(dataObj);
		
	},
	_receivedPackageTableSearchResults: function(dataObj) 
	{	
		if(knowledgeaddpackage.knowledgePackageDoscList.length > 0)
			knowledgeaddpackage._appendKnowledgeStoreList(dataObj)
		else
			knowledgeaddpackage.knowledgePackageDoscList = dataObj;
		
		knowledgeaddpackage._receivedSearchResults(dataObj);
	},
	
	_encodeSpecialText: function(key, value) {
            if (typeof value === "string") {
                return encodeURIComponent(value);
            }
            return value;
        },
		
	_updateURL: function() {
		var s = JSON.stringify(knowledgeaddpackage.searchObj, knowledgeaddpackage._encodeSpecialText);
		var newURL = window.location.protocol + "//" + window.location.host;
		newURL = newURL + window.location.pathname + "?SearchObj=" + s + "#knowledgeaddpackage";
		history.pushState("test", "test", newURL);
	},
	
	requestProcessRequest:function(){
		knowledgeaddpackage.searchObj.type = "context";
		knowledgeaddpackage.searchObj.input = knowledgestore.searchcomponentRef._getSearchTextValue();
		knowledgeaddpackage.searchObj.input2 = knowledgestore.searchcomponentRef._getSearchTextValue();
		knowledgeaddpackage._processSearchRequest(true);
	},

	GetPackagebyName:function(packagename)
	{
			var requestObject = new Object();
			requestObject.searchString = "package_title:" + packagename ;
			requestObject.projectName = localStorage.getItem('multiProjectName');
			requestObject.maxResults = 1;
			requestObject.serachType = "similar";

			requestObject.filterString=requestObject.searchString;
			requestObject.collectionName = iseConstants.str_package_collection;
			ISE.getSearchResults(requestObject, knowledgeaddpackage._handleduplicaterec);               
	},
	
	_handleduplicaterec:function(dataObj) 
	{
		if(dataObj != undefined)
		{
			if(dataObj.length > 0 && knowledgeaddpackage.selected_knowledge_package._id != dataObj[0]._id)
			{
				if(dataObj[0].package_title==knowledgeaddpackage.savedKnowledgeAddPackageAllData.title)
				{
				alert("Package title cannot be duplicate.");
				return false;
				}
				else
					knowledgeaddpackage.saveKnowledgeToPackage();
			}
			else 
			{
				knowledgeaddpackage.saveKnowledgeToPackage();
			}
		}
		
        // Here to navigate to previous page
		
		//setTimeout(callbackFunction,1000);
	},
	validatePackageData:function()
	{
    knowledgeaddpackage.savedKnowledgeAddPackageAllData.title =decodeURI($("#page_knowledgeaddpackage #knowledge_title").val().trim());
        if(knowledgeaddpackage.selected_knowledge_package.Documents)
        {
		if(knowledgeaddpackage.selected_knowledge_package.Documents.length<1) 
        {
         alert("No item to add into the package.");
         return false;
        }
        }
        if(knowledgeaddpackage.savedKnowledgeAddPackageAllData.title =="")
        {
          alert("Title can not be blank.");
          return false;
        }
		
		//check for the duplicate package name
		//Shail code
		knowledgeaddpackage.GetPackagebyName(knowledgeaddpackage.savedKnowledgeAddPackageAllData.title);
	},
	
    _getSelectedDocuments : function()
    {
     var SelectedDocs = new Array();
      $('#page_knowledgeaddpackage #'+knowledgeaddpackage.tableID+' .checkboxes:checked').each(function() {  
			 var __obj = new Object();
			 __obj.value = $(this).attr('value');
			 __obj.documentid = $(this).attr('document-id');
			SelectedDocs.push(__obj);
		});
     return SelectedDocs;
    },

  _checkifSelected: function(documentsarrary,documentid){

  var response=null;
  for(var i=0;i<documentsarrary.length;i++)
  {
   if(documentid==documentsarrary[i].documentid)
   {
    response=documentsarrary[i];
    break;
   }  
  }
    return response;
 },


 // Save command 

	saveKnowledgeToPackage: function() {
    ISEUtils.portletBlocking("pageContainer");

    var SelectedDocs = knowledgeaddpackage._getSelectedDocuments();

		var isValidRec = true;
				
    knowledgeaddpackage.savedKnowledgeAddPackageAllData = new Object();
    knowledgeaddpackage.savedKnowledgeAddPackageAllData.title = decodeURI($("#page_knowledgeaddpackage #knowledge_title").val().trim());
    knowledgeaddpackage.savedKnowledgeAddPackageAllData.description = $('#page_knowledgeaddpackage #knowledge_description').summernote('code');
    knowledgeaddpackage.savedKnowledgeAddPackageAllData.deleteddocslist = knowledgeaddpackage.allDeletedDocArray;
		knowledgeaddpackage.savedKnowledgeAddPackageAllData.docslist = knowledgeaddpackage._getTotalNumberOfRecodrsIdsInTable();
    knowledgeaddpackage.savedKnowledgeAddPackageAllData.asigneelist = $("select.asignee-list-holder").val();


    if(knowledgeaddpackage.savedKnowledgeAddPackageAllData.asigneelist && knowledgeaddpackage.savedKnowledgeAddPackageAllData.asigneelist.length > 0)
    {
	if(SelectedDocs.length == 0)
	{
	    isValidRec = confirm("Sorry, you need to select knowledge(s) from the table to assign. Do you want to continue without selecting?"); 
	}
	else
	{
	    isValidRec = knowledgeaddpackage._validateTrainingDetails(SelectedDocs);					
	}			
    }
		
    if(!isValidRec)
    {
        ISEUtils.portletUnblocking("pageContainer");
    }
    else
    {  

    knowledgeaddpackage._RemoveDeletedKnowledgeDocuments();
    knowledgeaddpackage._SetPackageID();

    //*********************Variables***********************
    var today = knowledgeaddpackage._CurrentDateddmmyyyy();
    var message = 'Following items are already assigned to selected user(s):\n';
    var IsAlreadyAssigned = false;
    knowledgeaddpackage.Assignations_collection = [];
    //*****************************************************


    if (knowledgeaddpackage.selected_knowledge_package && knowledgeaddpackage.selected_knowledge_package.Documents && knowledgeaddpackage.selected_knowledge_package.Documents.length > 0) {

        for (var i = 0; i < knowledgeaddpackage.selected_knowledge_package.Documents.length; i++) {

            var obj = knowledgeaddpackage.selected_knowledge_package.Documents[i];
            // check if this document is selected on the grid
            var IsknowledgeSelected = knowledgeaddpackage._checkifSelected(SelectedDocs, obj._id);

            if (IsknowledgeSelected) {

                if (knowledgeaddpackage.savedKnowledgeAddPackageAllData.asigneelist) {
                    if (knowledgeaddpackage.savedKnowledgeAddPackageAllData.asigneelist.length > 0) {

                        for (var counter = 0; counter < knowledgeaddpackage.savedKnowledgeAddPackageAllData.asigneelist.length; counter++) {

			knowledgeaddpackage.Assignations_collection.push(Object.assign({
                                packagename: knowledgeaddpackage.savedKnowledgeAddPackageAllData.title,
                                package_id: knowledgeaddpackage.packageid,
                                documentid: obj._id,
                                title: obj.title,
                                assignedto: knowledgeaddpackage.savedKnowledgeAddPackageAllData.asigneelist[counter],
                                assigneddate: today,
                                status: "Not-Started"
			}, knowledgeaddpackage.objTrainingDetails[obj._id]));

                            var response = knowledgeaddpackage._checkifexists(knowledgeaddpackage.savedKnowledgeAddPackageAllData.asigneelist[counter], obj._id);
                            if (response) {

                                IsAlreadyAssigned = true;
                                message = message + "\t. Knowledge" + obj.title + " already assigned to " + knowledgeaddpackage.savedKnowledgeAddPackageAllData.asigneelist[counter] + " and its status is -" + response.status; + "\n";

                            }
                        }

                    }
                }
            }
        }
    }

    if (IsAlreadyAssigned) {
        var response = confirm(message + "  Do you really want to assign those again?");
        if (response) {
            knowledgeaddpackage._AssignKnowledge();
            knowledgeaddpackage._PackageAddUpdate();
            knowledgeaddpackage._previusscreen();
        } 
        else {
            ISEUtils.portletUnblocking("pageContainer");
        }
    } 
    else {
        knowledgeaddpackage._AssignKnowledge();
        knowledgeaddpackage._PackageAddUpdate();
            knowledgeaddpackage._previusscreen();
    }
  }     
},

	_validateTrainingDetails:function(pSelectedDocs){
		var keys = Object.keys(knowledgeaddpackage.objTrainingDetails);
		if (keys.length > 0)
		{
			for (var i = 0; i < keys.length; i++)
			{
				var isSelected = knowledgeaddpackage._checkifSelected(pSelectedDocs, keys[0]);			
				if (isSelected)
				{
					var objTemp = knowledgeaddpackage.objTrainingDetails[keys[0]];
					
					if (Object.keys(objTemp).length < 5)
					{
						alert("Please select/fill-in training details for all selected trainings.");
						return false;
					}

					if (objTemp.startDate == "" || objTemp.endDate == "")
					{
						alert("Please select/fill-in training details for all selected trainings.");
						return false;
					}

					var startDate = new Date(objTemp.startDate);
					var endDate = new Date(objTemp.endDate);
					if (startDate > endDate)
					{
						alert("Start-Date should be less then or equal to End-Date.");
						return false;
					}

					if (objTemp.reviewerName == "None")	
					{
						alert("Please select reviewer for selected trainings.");
						return false;
					}
					
					if (objTemp.evaluationMode == "None")	
					{
						alert("Please select evaluation-mode for selected trainings.");
						return false;
					}
					
					if (objTemp.trainingMode == "None")	
					{
						alert("Please select training-mode for selected trainings.");
						return false;
					}
				}			
			}
			return true;
		}
		else
		{
			alert("Please select/fill-in training details for all selected trainings.");
			return false;
		}
	},
	
	_getTotalNumberOfRecodrsIdsInTable: function(){ 
			var totalIdRecords = []; 
			var table = $('#page_knowledgeaddpackage #'+knowledgeaddpackage.tableID).DataTable(); 
			var data = table.rows().data(); 
			data.each(function (value, index) { 
					totalIdRecords.push($(value[1]).text()); 
			 }); 
			
			return totalIdRecords; 
	}, 

_RemoveDeletedKnowledgeDocuments : function()
{
 if (knowledgeaddpackage.selected_knowledge_package) {
        for (var i = 0; i < knowledgeaddpackage.allDeletedDocArray.length; i++) {
            var obj = knowledgeaddpackage.allDeletedDocArray[i];

            var result = $.grep(knowledgeaddpackage.selected_knowledge_package.Documents,
                function(e) {
                    return e._id == obj.knowledgeID;
                });

            if (result.length == 1) {
                var index = $.inArray(result[0], knowledgeaddpackage.selected_knowledge_package.Documents);
                if (index != -1) {
                    knowledgeaddpackage.selected_knowledge_package.Documents.splice(index, 1);
                }
            }
        }
    }
},
_SetPackageID : function()
{
// packageid TO INSERT ON ASSIGNATION_COLLECTION
  if(knowledgeaddpackage.selected_knowledge_package)
  {
    if (knowledgeaddpackage.selected_knowledge_package.addType == 'existing' ||
        knowledgeaddpackage.selected_knowledge_package.addType == 'Addtoexisting') {
        if (knowledgeaddpackage.selected_knowledge_package) {
            knowledgeaddpackage.packageid = knowledgeaddpackage.selected_knowledge_package._id;
        }
   } 
    else {
        knowledgeaddpackage.packageid = (Math.floor(Math.random() * 1000) + Date.now()).toString();
                
    }
  }
},

_CurrentDateddmmyyyy : function ()
{
   var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var today = dd + '/' + mm + '/' + yyyy;
    return today;
},

_AssignKnowledge : function ()
{
     if(knowledgeaddpackage.Assignations_collection.length>0)
        {
            for (var counter = 0; counter < knowledgeaddpackage.Assignations_collection.length; counter++) {
                knowledgeaddpackage.Assignations_collection[counter]._id = (Math.floor(Math.random() * 1000) + Date.now()).toString();
                ISE.UpdatePackageAssignationEntryMongo(knowledgeaddpackage.Assignations_collection[counter], knowledgeaddpackage._BlankResultHandler);
            }

            knowledgeaddpackage._AssignPackageResultHandler();
        }

},

_PackageAddUpdate : function()
{
        if(knowledgeaddpackage.selected_knowledge_package)
        {
        knowledgeaddpackage.selected_knowledge_package.package_descriptions = knowledgeaddpackage.savedKnowledgeAddPackageAllData.description;
        knowledgeaddpackage.selected_knowledge_package.package_title = knowledgeaddpackage.savedKnowledgeAddPackageAllData.title;

        if (knowledgeaddpackage.selected_knowledge_package.addType == 'existing' ||
            knowledgeaddpackage.selected_knowledge_package.addType == 'Addtoexisting') {
            if (knowledgeaddpackage.selected_knowledge_package) {
                var packageobject = new Object();
                packageobject.package_title = knowledgeaddpackage.selected_knowledge_package.package_title;
                packageobject._id = knowledgeaddpackage.selected_knowledge_package._id;
                packageobject.description = knowledgeaddpackage.selected_knowledge_package.package_descriptions;
                packageobject.Documents = knowledgeaddpackage.selected_knowledge_package.Documents;

                ISE.UpdatePackageEntryMongo(packageobject, knowledgeaddpackage._UpdatePackageResultHandler);
            }

        } 
        else 
        {
            knowledgeaddpackage.selected_knowledge_package._id = knowledgeaddpackage.packageid;//(Math.floor(Math.random() * 1000) + Date.now()).toString();

            var packageobject = new Object();
            packageobject.package_title = knowledgeaddpackage.selected_knowledge_package.package_title;
            packageobject._id = knowledgeaddpackage.selected_knowledge_package._id;
            packageobject.description = knowledgeaddpackage.selected_knowledge_package.package_descriptions;
            packageobject.Documents = knowledgeaddpackage.selected_knowledge_package.Documents;

            ISE.UpdatePackageEntryMongo(packageobject,
                knowledgeaddpackage._UpdatePackageResultHandler);
        }
     }

},

	removeObjectFromMainList: function(id){
		for(var i = 0; i < knowledgeaddpackage.knowledgePackageDoscList.length; i++) {
			if(knowledgeaddpackage.knowledgePackageDoscList[i]._id == id) {
				knowledgeaddpackage.knowledgePackageDoscList.splice(i, 1);
				break;
			}
		}
	},

_setUsersData: function () {
        knowledgeaddpackage._getuserList(knowledgeaddpackage._receivedUsers);
    },

     loadPackageInformation: function(id){
        
        var requestObject = new Object();
        requestObject.collectionName = iseConstants.str_package_collection;
        requestObject.searchString = "_id :" + id;
        requestObject.projectName = localStorage.projectName;
        requestObject.maxResults = 1;
        ISE.getSearchResults(requestObject, knowledgeaddpackage._receivedPackageDetails);

	},

    loadPackageData: function(){
        
        var requestObject = new Object();
        requestObject.collectionName = iseConstants.str_assignation_collection;
        requestObject.searchString = "packagename :" + decodeURI(knowledgeaddpackage.selected_knowledge_package.package_title);
        requestObject.projectName = localStorage.projectName;
        requestObject.maxResults = 100;
        ISE.getSearchResults(requestObject, knowledgeaddpackage._receivedPackageSearchResults);
	},

    _receivedPackageSearchResults: function(dataObj){

    if(dataObj)
    {
     if(dataObj.length>0)
     {
      for(var i=0;i<dataObj.length;i++)
      {
       if(dataObj[i].packagename == decodeURI(knowledgeaddpackage.selected_knowledge_package.package_title))
         { 
     var response =knowledgeaddpackage._checkifexists(dataObj[i].assignedto,dataObj[i].documentid);
     if(!response)
          {
           var tempobject = new Object();
           tempobject.assignedto = dataObj[i].assignedto;
           tempobject.documentid = dataObj[i].documentid;
           tempobject.status = dataObj[i].status;
           tempobject.package_id =dataObj[i].package_id;

           knowledgeaddpackage.arrAssigneedocMapping.push(tempobject);
            
           }
         }
      }
     }
     $("select.asignee-list-holder").val([]).trigger("change"); 
    }     
 },

 _checkifexists: function(assignedto,documentid){
  var response=null;
  for(var i=0;i<knowledgeaddpackage.arrAssigneedocMapping.length;i++)
  {
   if(assignedto==knowledgeaddpackage.arrAssigneedocMapping[i].assignedto && documentid==knowledgeaddpackage.arrAssigneedocMapping[i].documentid)
   {
    response=knowledgeaddpackage.arrAssigneedocMapping[i];
    break;
   }
 }
    return response;
 },

  _receivedPackageDetails: function(dataObj){
    
   if(dataObj)
   {
       knowledgeaddpackage.selected_knowledge_package.package_title = dataObj[0].package_title;
       knowledgeaddpackage.selected_knowledge_package.package_descriptions = dataObj[0].description;
           var packagetitle = decodeURI(knowledgeaddpackage.selected_knowledge_package.package_title).trim();
			knowledgeaddpackage.getAssignationHistoryData(packagetitle);
            // Commented below line to show already assigned users 
            knowledgeaddpackage.loadPackageData();

		    //knowledgeaddpackage._renderPackageAssignationHistoryDataTable(packagetitle)
			
            $("#page_knowledgeaddpackage #knowledge_title").val(packagetitle);
			$("#page_knowledgeaddpackage .page-title").text(knowledgeaddpackage.selected_knowledge_package.package_title);
			$('#page_knowledgeaddpackage #knowledge_description').summernote('code',knowledgeaddpackage.selected_knowledge_package.package_descriptions);
   }
 },

	_getuserList: function (callBackFunction) {
        var respJson;
        
        var jsondata = { username: localStorage.getItem('username'), operation: 'list' }
        var serviceName = 'JscriptWS';
        var hostUrl = '/DevTest/rest/';
        var methodname = 'userManagement'
        var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' +
              localStorage.projectName + '&sname=' + methodname;
        var html;
        $.ajax({
            type: "POST",
            url: Url,
            async: true,
            data: JSON.stringify(jsondata),
            success: function (msg) {
                respJson = msg;
                resultsData = JSON.parse(msg);
                console.log(resultsData)
               // knowledgesearch.userslist = resultsData.users;
                callBackFunction(resultsData);

            },
            error: function (msg) {
                
                console.log("failure");
            }

        });
    },
	
     _receivedUsers: function (data) {
         	$("#page_knowledgeaddpackage .asignee-list-holder").empty();
		listData='';
		var projectName = localStorage.getItem("multiProjectName");
		for(var i=0; i<data.users.length; i++){
			if (data.users[i].projectAssigned.includes(projectName))
			{
			var fData = data.users[i].username;
			if (fData != '')
				listData += ' <option value="'+fData+'">'+fData+'</option>';
				
			knowledgeaddpackage.arrReviewers.push(fData);	
		 }
		 }
		 
		$("#page_knowledgeaddpackage .asignee-list-holder").append(listData).select2();
    },
	
	_UpdatePackageResultHandler: function(data_obj){
		toastr.success('Package has been added successfully.', 'Success');
		ISEUtils.portletUnblocking("pageContainer");	
	},
    _AssignPackageResultHandler: function(data_obj){
		toastr.success('Package has been assigned successfully.', 'Success');
		ISEUtils.portletUnblocking("pageContainer");		
	},
	 _BlankResultHandler: function(data_obj){
		ISEUtils.portletUnblocking("pageContainer");			
	},
	    
   	onLoadPopupSearchComponent: function() {
		$.ajax({
			url: "kowledgesearchcomponent.html",
			type: 'HEAD',
			error: function() {
				console.log("Error")
			},
			success: function() {
				// Loading Menu based on Organization and role

				$('#knowledgeAddDocTableModal .modal-body .search-comp-container').load("kowledgesearchcomponent.html", function() {

					var jsfilename = "js/subpages/kowledgesearchcomponent.js";


					$.getScript("js/subpages/kowledgesearchcomponent.js")
						.done(function() {
							knowledgeaddpackage.popupSearchcomponentRef = kowledgesearchcomponent;
                            kowledgesearchcomponent._HideShowMoreFilter();
							kowledgesearchcomponent._setParentIDContainer('page_knowledgeaddpackage');
							kowledgesearchcomponent._setModalRefContainer(knowledgeaddpackage.moreFilterCompModalID);
							kowledgesearchcomponent._setfilterJsonFile(knowledgeaddpackage.moreFilterJsonFileName)
							kowledgesearchcomponent.init();
							knowledgeaddpackage._AddCustomEventsForAddKnowledgeSearchPopup();
						})
						.fail(function() {
							/* boo, fall back to something else */
							console.log("Some problem in scripts")
						});
				});
			}
		});

	},
	
	onLoadPopupTableComponent: function() {
		$.ajax({
			url: "tablecomponent.html",
			type: 'HEAD',
			error: function() {
				console.log("Error")
			},
			success: function() {
				// Loading Menu based on Organization and role

				$('#knowledgeAddDocTableModal .modal-body .table-container').load("tablecomponent.html", function() {

					var jsfilename = "js/subpages/tablecomponent.js";


					$.getScript("js/subpages/tablecomponent.js")
						.done(function() {

							//table-container
							knowledgeaddpackage.popupTablecomponentRef = tablecomponent;
							tablecomponent._setTabelIDParentConatiner("knowledgeAddDocTableModal");
							tablecomponent._setFilterColumnID(knowledgeaddpackage.popupFilterColumnID);
							tablecomponent._setTableJSON(knowledgeaddpackage.tableJson);
							tablecomponent._setAllowEditKnowledge(true);
							tablecomponent._setIsAddEllipsis(false);
							tablecomponent._setdataTableID(knowledgeaddpackage.popupTableID);
							tablecomponent.init();
							knowledgeaddpackage._AddCustomEventsForAddKnowledgeTablePopup();
						})
						.fail(function() {
							console.log("Some problem in scripts")
						});
				});
			}
		});
	},
	
	onLoadActionComponent: function() {
		$.ajax({
			url: "actions.html",
			type: 'HEAD',
			error: function() {
				console.log("Error")
			},
			success: function() {


				$('#page_knowledgeaddpackage .page-toolbar').load("actions.html", function() {

					$.getScript("js/subpages/actions.js")
						.done(function() {
							knowledgeaddpackage.actionsRef = actions;
							actions._setCurrentPage(ikePageConstants.KNOWLEDGE_ADD_PACKAGE);
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