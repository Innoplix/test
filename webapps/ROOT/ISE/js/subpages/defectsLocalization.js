    var defectsLocalization = {
		
		methodDefectCnt:[],
		methodTestcaseCnt:[],
		selectBuilds:[],
		selectRelase:[],
		selectFeatures:[],
		table: '',
		defectResultsCollection: null,
		defectIndexName: null,
		desktopViewTableColumnCollection: new Array(),
		mobileViewTableColumnCollection: new Array(),
		jsonDataCollection: null,
		hideTableColumns: new Array(),
		listTableId: new Array(),
		showAdvancedSearchhelp: false,
		searchObj: new Object(),
		projectName: '',
		searchDefId:"",
		searchFeaId:"",
		searchTCId:"",
		searchTCFeaId:"",
		testStartDate:"",
		testEndDate:"",
		tcRaisedDate:"",
		defectRaisedDate:"",
		gblDefectId:"",
		gblDefectFeaId:"",
		gblTcId:"",
		gblTcFeaId:"",
		gblTcDate:"",
		gblSpcficFea:"",
		gblColNameAvail:false,
		allIndices:"",
		gblDLCollection:true,
		
        
        init: function() {
			 console.log("----38-----"+defectsLocalization._getIndicesNames());
			defectsLocalization._filterSearchPortletHeaderDropDown();
			//$("#dl_Methods").tablesorter();
			var isChkMyBugs = "true"; 
			isChkMyBugs = true; 
			//defectsLocalization._searchDefectByuser(isChkMyBugs);
			defectsLocalization._searchDefaultDtls();
			 //ISE.builds("buildsData", "", projectName, false, defectsLocalization._receivedBuilds);
			
			 
                     
			if (jQuery().datepicker) {
				$('.date-picker').datepicker({
					rtl: Metronic.isRTL(),
					orientation: "left",
					autoclose: true
				}); 
			}

			$('#buildsDropdown').select2({
				placeholder: "Build",
				allowClear: true
			});
		
			$('#releaseDropdown').select2({
				placeholder: "Release",
				allowClear: true
			});
		
			$('#featuresDropdown').select2({
				placeholder: "Feature",
				allowClear: true
			});
			
			defectsLocalization._setBuildsData();
			defectsLocalization._setReleasesData();
			defectsLocalization._setFeaturesData();
			//$('#defect_searchDefectID').on('keyup', defectsLocalization._defectIdSearchKeyUpFunc);
			//$('#defect_searchDesc').on('keyup', defectsLocalization._defectDescSearchKeyUpFunc);
            
			$("#resetForm").click(function(event) {
				console.log("reset hit");
				defectsLocalization.selectBuilds=[];
				defectsLocalization.selectRelase=[];
				defectsLocalization.selectFeatures=[];
				
				$('#buildsDropdown').select2({
				placeholder: "Build",
				allowClear: true
			});
		
			$('#releaseDropdown').select2({
				placeholder: "Release",
				allowClear: true
			});
		
			$('#featuresDropdown').select2({
				placeholder: "Feature",
				allowClear: true
			});
			
				$('#defect_searchDefectID').val('');
				$('#defect_searchDesc').val('');
				$('#startDate').val('');
				$('#endDate').val('');
				document.getElementById("myDefectsId").checked = false;
				//$('#s2id_buildsDropdown').empty();
			});
		
			
			
			$("#submitForm").click(function(event) {
			
				console.log("-----submit form invoked");
				$('#dl_searchResultsTable1').addClass('hide');
				$('#dl_searchResultsTableMethod').addClass('hide');
				$('#methodPathTable').addClass("hide");
				defectsLocalization.selectBuilds=[];
				defectsLocalization.selectRelase=[];
				defectsLocalization.selectFeatures=[];
				
				$("#buildsDropdown option:selected").each(function() {
					defectsLocalization.selectBuilds.push($(this).val());
				});
				
				$("#releaseDropdown option:selected").each(function() {
					defectsLocalization.selectRelase.push($(this).val());
				});
				
				$("#featuresDropdown option:selected").each(function() {
					defectsLocalization.selectFeatures.push($(this).val());
				});
			
			
				var defId = $('#defect_searchDefectID').val();
				var defDesc = $('#defect_searchDesc').val();
				var startDate = $('#startDate').val();
				var endDate = $('#endDate').val();
				
				console.log("-----submit form invoked defectid---"+defId);
				console.log("-----submit form invoked defectdesc---"+defDesc);
				var mydefctchk = document.getElementById("myDefectsId").checked
				console.log("--------52---------"+mydefctchk);
				
				if(startDate && endDate){
					console.log("datess startDate submit"+startDate);
					console.log("datess endDate submit"+endDate);
					var startDateSelect = new Date(startDate);
					var endDateSelect = new Date(endDate);
					if(startDateSelect>endDateSelect){
						alert("End Date not less than Start Date");
					}else{
					console.log("else condition");
						defectsLocalization._searchDefectByDates(startDate,endDate);
					}
				}else if((defectsLocalization.selectBuilds.length>0) || (defectsLocalization.selectRelase.length>0) || (defectsLocalization.selectFeatures.length>0)){
					console.log("entered into buildsfeamethod");
					console.log("--------51---------"+mydefctchk);
					defectsLocalization._searchDefectByBuilRelaseFeature(mydefctchk);
				}else if(defId != null && 0 != defId.length) {
					console.log("entered into defectid");
					defectsLocalization._setDefectDetails();
				}else if(defDesc != null && 0 != defDesc.length) {
					console.log("entered into defdesc");
					defectsLocalization._setDefectDetailsByDesc();
				}else if (mydefctchk){
					console.log("entered into mydefchk");
					defectsLocalization._searchDefectByuser(mydefctchk);
				}
		
		   });
		
		
			$("#submitFormDefects").click(function(event) {
				var specificFea = document.getElementById("selectFeaturesChk").checked;
				console.log("specificFea---------"+specificFea);
				gblSpcficFea = specificFea;
				var defStartDate = $('#defStartDate').val();
				var defEndDate = $('#defEndDate').val();
				var selectedDays="";
				$("#selectDays option:selected").each(function() {
						selectedDays = $(this).val();
				});
				
				if(defStartDate && defEndDate){
					console.log("dates function---"+defStartDate);
					defectsLocalization._setDefectDetailsByDates(defStartDate,defEndDate);
				}else{
					console.log("selectedDays---"+selectedDays);
					defectsLocalization._setDefectDetailsByDays(selectedDays);
				}
				
			});
			
						
			$("#submitFormTestcases").click(function(event) {
				var tcStartDate = $('#tcStartDate').val();
				var tcEndDate = $('#tcEndDate').val();
				var selectedTestCaseDays="";
				$("#selectTCDays option:selected").each(function() {
						selectedTestCaseDays = $(this).val();
				});
				if(tcStartDate && tcEndDate){
					console.log("dates function---"+tcStartDate);
					defectsLocalization._setTestCaseDetailsByDates(tcStartDate,tcEndDate);
				}else{
					console.log("selectedDays---"+selectedTestCaseDays);
					defectsLocalization._setTestcaseDetailsByDays(selectedTestCaseDays);
				}
			});
			
			$("#selectFeaturesForm").click(function(event) {
			 console.log("------selectFeaturesForm--------------");
			 
			
			});
			
		},
		
		//End Init
		
		_filterSearchPortletHeaderDropDown: function() {

            var roleName = localStorage.getItem('rolename');
			$('#searchFilterDropdown_dl').empty();
            $('#dl_searchResultsTabs').empty();
            $('#dl_resultTabContent').empty();
			
			$.getJSON("json/DynamicTabArrayLoc.json", function(data) {

				defectsLocalization.jsonDataCollection = data;
				$.each(data.TabArray, function(key, item) {
					
                    //  Filter Search List will be added based on role.
                    if (item.enable == "yes") {

                        for (var i = 0; i < item.allowedroles.length; i++) {
							if (item.allowedroles[i] == roleName) {
								
								var displayName = item.displayName;
								$('#searchFilterDropdown_dl').append('<label><input type="checkbox" onchange = "defectsLocalization._filterTypeChange(this)" indexCollection=' + item.indexName + ' resultTabInnerContainerID=resultsTab_InnerContainer_dl' + displayName + ' resultTabID=resultTab_' + displayName + ' checked="true" >' + displayName + '</label>');
								
								if(displayName == "TestCase") {
									$('#dl_searchResultsTabs').append($("<li id=resultTab_" + displayName + "><a href=#resultsTab_InnerContainer_dl" + displayName + " onclick =defectsLocalization._onDivHide() data-toggle='tab'>" + displayName + "</a></li>"))
								} else {
									$('#dl_searchResultsTabs').append($("<li id=resultTab_" + displayName + "><a href=#resultsTab_InnerContainer_dl" + displayName + " onclick =defectsLocalization._onDivTestHide() data-toggle='tab'>" + displayName + "</a></li>"))
								}
                                $('#dl_resultTabContent').append("<div class=tab-pane fade  id=resultsTab_InnerContainer_dl" + displayName + "></div>");
								var columnToggler = "<div class='btn-group pull-right hidden-sm hidden-xs'  ><a class=btn default href=javascript:; data-toggle=dropdown>Columns <i class=fa fa-angle-down></i></a>";
                                columnToggler += "<div id=columnToggler_" + displayName + " class=dropdown-menu hold-on-click dropdown-checkboxes pull-right></div></div>";
                                $('#resultsTab_InnerContainer_dl' + displayName).append(columnToggler);
								$('#resultsTab_InnerContainer_dl' + displayName).append("<div class=table-scrollable><table class='table table-striped table-bordered table-hover dataTable ' id=sample_4__dl" + displayName + "></table></div>")
                                $('#sample_4__dl' + displayName).append("<thead><tr id=tableheader_dl" + displayName + "></tr></thead><tbody id=tablebody_dl" + displayName + "></tbody>");

                                defectsLocalization.listTableId.push('sample_4__dl' + displayName);

                                // Set Table Heading for all columns

                                // Empty column name for first column
                                $('#tableheader_dl' + displayName).append("<th></th>");

                                for (var j = 0; j < item.Details.fields.length; j++) {
                                    $('#tableheader_dl' + displayName).append("<th class='sorting ISEcompactAuto'>" + item.Details.fields[j].displayName + "</th>");
                                }
								//Empty column for end column
								$('#tableheader_dl' + displayName).append("<th></th>");

                                var dropDownBoxId = "columnToggler_" + displayName;
                                var tableID = 'sample_4__dl' + displayName;
                                defectsLocalization._fillColumnListinDropdown(dropDownBoxId, tableID, item.defaultView, item.Details.fields);

                                defectsLocalization.mobileViewTableColumnCollection.push({
                                    "tableID": 'sample_4__dl' + displayName,
                                    "columnsList": item.mobileView,
                                    "dropdownID": 'columnToggler_' + displayName
                                });
                            }
                        }
                    }

                });

                // Set Intial Active Tab
                defectsLocalization._setInitialActiveTab();

            });
        },
		
		_onDivHide() {
			console.log("Inside _onDivHide");
			console.log($("#dl_searchResultsTable1").hasClass( "hide" ));
			if($("#dl_searchResultsTable1").hasClass( "hide" ) ){
				//do nothing
			 } else {
				$("#dl_searchResultsTable1").addClass("hide");
			 
			 }
            
        },
		
		_onDivTestHide() {
			console.log("Inside _onDivHide");
			console.log($("#searchResultsTableTest").hasClass( "hide" ));
			if($("#searchResultsTableTest").hasClass( "hide" ) ){
				//do nothing
			 } else {
				$("#searchResultsTableTest").addClass("hide");
			 
			 }
            
        },
		
		_setInitialActiveTab() {

            var elements = document.querySelectorAll('#searchFilterDropdown_dl label input:checked');
            var selectedFilterTypeArray = new Array();
            Array.prototype.map.call(elements, function(el, i) {
                var tempObj = new Object();
                tempObj.tabId = $(el).attr("resultTabID");
                tempObj.tabInnerContainerID = $(el).attr("resultTabInnerContainerID");
                selectedFilterTypeArray.push(tempObj);
            });

            if (selectedFilterTypeArray.length > 0) {
                $("#" + selectedFilterTypeArray[0].tabId).addClass("active");
                $("#" + selectedFilterTypeArray[0].tabInnerContainerID).addClass("active");
            }
        },
		
		
		_fillColumnListinDropdown: function(dropDownBoxId, tableID, defaultColumnView, ColumnsList) {


            $('#' + dropDownBoxId).empty();

            var tempArr = new Array();

            for (var i = 0; i < ColumnsList.length; i++) {
                tempArr.push(ColumnsList[i].displayName);
            }
            var colunmnID = 0;
            var tableColumnID = 0;
            var tableHideColumns = new Array();
            $.grep(tempArr, function(element) {

                colunmnID = colunmnID + 1;


                if ($.inArray(element, defaultColumnView) !== -1) {

                    $('#' + dropDownBoxId).append('<label><input type="checkbox" name="column" checked="true" columnID=' + colunmnID + '  data-column=' + colunmnID + '>' + element + '</label>');
                } else {

                    tableColumnID = colunmnID + 1;
                    tableHideColumns.push(parseInt(tableColumnID));
                    $('#' + dropDownBoxId).append('<label><input type="checkbox" name="column"  columnID=' + colunmnID + ' data-column=' + colunmnID + '>' + element + '</label>');

                }

            });

            defectsLocalization.hideTableColumns.push({
                "tableID": tableID,
                "hideColumnsList": tableHideColumns,
                "allColumnsNames": tempArr
            });


            $('input[type="checkbox"]', '#' + dropDownBoxId).change(function() {

                var iCol = parseInt($(this).attr("data-column"));
                iCol = iCol;
                var oTable = $('#' + tableID).dataTable();

                var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
                oTable.fnSetColumnVis(iCol, bVis ? false : true);

            });

        },
		
		_filterTypeChange: function(event) {

            var resultsTabId = $(event).attr("resultTabID");
            var resultsTabInnerContainerID = $(event).attr("resultTabInnerContainerID");

            if (!$(event).is(':checked')) {

                $("#" + resultsTabId).addClass("hide");
                $("#" + resultsTabInnerContainerID).removeClass("active in");

            } else {
                $("#" + resultsTabId).removeClass("hide");
                $("#" + resultsTabInnerContainerID).addClass("active in");
            }

        },
		
		//siri-end
		
		
		_setBuildsData: function() {
           var projectName = localStorage.getItem('projectName');
           ISE.builds("buildsData", "", projectName, false, defectsLocalization._receivedBuilds);
		   ISE.methodDefectCount("defect_localization_method_def_count", "", projectName, false, defectsLocalization._receivedMethodDefTestCount);
      },
                
        _receivedBuilds: function(data) {
			var selectbuildsData = $('#buildsDropdown');
			$('#buildsDropdown').empty();
			var newOptionContent = '';
			var newOptionContentAll ='<option value="All"> All </option>'
			selectbuildsData.append(newOptionContentAll);
			for(var i=0; i<data.length; i++) {
				var fData = data[i].build;
				newOptionContent = '<option value="' 
				newOptionContent += fData + '">'+fData + '</option>';
				selectbuildsData.last().append(newOptionContent);
			}
		},
		
		
		
		
		_setReleasesData: function() {
            var projectName = localStorage.getItem('projectName');
			ISE.releases("releaseData", "", projectName, false, defectsLocalization._receivedReleases);
		},
                
        _receivedReleases: function(data) {
          var selectreleasesData = $('#releaseDropdown');
			$('#releaseDropdown').empty();
			var newOptionContent = '';
			var newOptionContentAll ='<option value="All"> All </option>'
			selectreleasesData.append(newOptionContentAll);
			for(var i=0; i<data.length; i++) {
				var fData = data[i].release;
				newOptionContent = '<option value="' 
				newOptionContent += fData + '">'+fData + '</option>';
				selectreleasesData.last().append(newOptionContent);
			}
		},


		_setFeaturesData: function() {
            var projectName = localStorage.getItem('projectName');
			ISE.features("featuresData", "", projectName, false, defectsLocalization._receivedFeatures);
		},
                
				
        _receivedFeatures: function(data) {
           var selectfeaturesData = $('#featuresDropdown');
		   $('#featuresDropdown').empty();
			var newOptionContent = '';
			var newOptionContentAll ='<option value="All"> All </option>'
			selectfeaturesData.append(newOptionContentAll);
			for(var i=0; i<data.length; i++) {
				var fData = data[i].feature;
				newOptionContent = '<option value="' 
				newOptionContent += fData + '">'+fData + '</option>';
				selectfeaturesData.last().append(newOptionContent);
			}
		},
		
		
		
		_setDefectDetails: function() {

            if ($('#defect_searchDefectID').val().length > 2) {
                ISEUtils.portletBlocking("pageContainer");
				var defectId = escape($('#defect_searchDefectID').val().trim());
				var projectName = localStorage.getItem('projectName');
                var params = ['PARAM1=' + defectId];
				console.log("defectId----**--"+defectId);
                ISE.getDefectdetailsByID("getDefectDetailsById", params, projectName, false, defectsLocalization._receivedDefectDetailsByID);
			   }
        },
		
		
		
		_setDefectDetailsByDesc: function() {

            if ($('#defect_searchDesc').val().length > 2) {
				ISEUtils.portletBlocking("pageContainer");
				var defDescription = escape($('#defect_searchDesc').val().trim());
				console.log("desc---------->"+defDescription);
				$('#defect_searchDefectDes').val(defDescription);
				var requestObject1 = new Object();
				requestObject1.collectionName = "defect_collection";
				requestObject1.searchString = $('#defect_searchDefectDes').val().replace(/\//g, " ");
				requestObject1.maxResults = 15;
				ISE.getDefLocalizationSearch(requestObject1, defectsLocalization._receivedSearchResults);
			}
        },

		
		
		_searchDefectByBuilRelaseFeature: function(mydefctchk) {
			
			
			
			console.log("inside function chk---"+mydefctchk);
			var builString="";
			var relaseString="";
			var featureString="";
			var finalString;
			
			if(defectsLocalization.selectBuilds.length>0){
			if(defectsLocalization.selectBuilds[0] =='All'){
				builString = "(*)";
				}else{
					for(var i=0;i<defectsLocalization.selectBuilds.length;i++){
						builString += 'build:"'+defectsLocalization.selectBuilds[i].trim()+'" OR ';
					}
					builString="("+builString.slice(0,-3)+")"
				}
			}
			
			if(defectsLocalization.selectRelase.length>0){
			if(defectsLocalization.selectRelase[0] =='All'){
				relaseString = "(*)";
				}else{
					for(var i=0;i<defectsLocalization.selectRelase.length;i++){
						relaseString += 'release:"'+defectsLocalization.selectRelase[i].trim()+'" OR ';
					}
						relaseString="("+relaseString.slice(0,-3)+")"
				}
			}
			
			if(defectsLocalization.selectFeatures.length>0){
				if(defectsLocalization.selectFeatures[0] =='All'){
				featureString = "(*)";
				}else{
					for(var i=0;i<defectsLocalization.selectFeatures.length;i++){
					featureString += 'primary_feature:"'+defectsLocalization.selectFeatures[i].trim()+'" OR ';
					}
				
					featureString="("+featureString.slice(0,-3)+")"
				}
			}
			
			if(builString != "" && relaseString != "" && featureString != ""){
				finalString= builString+" AND "+relaseString+" AND "+featureString;
			}else if (builString != ""  && relaseString != ""){
				finalString= builString+" AND "+relaseString;
			}else if (builString != "" && featureString != "" ){
				finalString= builString+" AND "+featureString;
			}else if (relaseString != "" && featureString != "" ){
				finalString= featureString+" AND "+relaseString;
			}else if (builString != "" ){
				finalString= builString;
			}else if (relaseString != "" ){
				finalString= relaseString;
			}else if (featureString != "" ){
				finalString= featureString;
			}
			
			if(mydefctchk){
			var defOwner = localStorage.getItem('username');
			//var defOwner='adminaa@hcl.com';
			finalString =finalString+' AND (updated_by:'+defOwner+')';
			}
			
			console.log("finalString-----"+finalString);
			var requestObject1 = new Object();
			//requestObject1.collectionName = "ise_mongo_demo1_defect_collection";
			requestObject1.collectionName = "defect_collection";
			requestObject1.type = localStorage.getItem('projname');
			requestObject1.searchString =	finalString;
			requestObject1.maxResults = 15;
			ISE.getDefLocalizationSearch(requestObject1, defectsLocalization._receivedSearchResults);
		
        },
		
		
		
		_searchDefectByuser: function(mydefctchk) {
			
			console.log("inside function for mybug chk--->"+mydefctchk);
			var finalString;
			var updateUser = localStorage.getItem('username')
			
			if(updateUser){
				finalString = "(updatedby:"+updateUser+")";
			}
			var requestObject1 = new Object();
			requestObject1.type = localStorage.getItem('projname');
			requestObject1.maxResults = 15;
			var searchIndexTypes = ["defect_collection","test_executions_collection"]
			console.log("searchIndexTypes--------------"+searchIndexTypes);
			for (var i = 0; i < searchIndexTypes.length; i++) {
				requestObject1.collectionName = searchIndexTypes[i];
				console.log("searchIndexTypes in loop--------------"+searchIndexTypes[i]);
				if(searchIndexTypes[i] == "test_executions_collection"){
					ISE.getDefLocalizationTestSearch(requestObject1, defectsLocalization._receivedSearchResults);
				}else{
					console.log("defect finalstring -----"+finalString);
					requestObject1.searchString =	finalString;
					ISE.getDefLocalizationSearch(requestObject1, defectsLocalization._receivedSearchResults);
				}
			}
		 },
		
		
_searchDefaultDtls: function() {
			
			console.log("inside function for mybug chk default--->");
			var finalString;
			var updateUser = localStorage.getItem('username')
			
			if(updateUser){
			var noCondition = "(*)";
				finalString = "(updatedby:"+noCondition+")";
				
			}
			var requestObject1 = new Object();
			requestObject1.type = localStorage.getItem('projname');
			requestObject1.maxResults = 15;
			var searchIndexTypes = ["defect_collection","testcase_collection"]
			console.log("searchIndexTypes--------------"+searchIndexTypes);
			for (var i = 0; i < searchIndexTypes.length; i++) {
				requestObject1.collectionName = searchIndexTypes[i];
				console.log("searchIndexTypes in loop--------------"+searchIndexTypes[i]);
				if(searchIndexTypes[i] == "testcase_collection"){
					ISE.getDefLocalizationTestSearch(requestObject1, defectsLocalization._receivedSearchResults);
				}else{
					console.log("defect finalstring -----"+finalString);
					requestObject1.searchString =	finalString;
					ISE.getDefLocalizationSearch(requestObject1, defectsLocalization._receivedSearchResults);
				}
			}
		 },
		
		_getIndicesNames: function(){
			//var requestObject = new Object();
			//requestObject.type = localStorage.getItem('projname');
			//ISE.getIndices(requestObject, defectsLocalization._receivedIndicesResults);
			var data = '{"requesttype":"indicesresults"}';			
			ISE_Ajax_Service.ajaxPostReq('IndexingRestService', 'json', localStorage.authtoken,data,defectsLocalization._receivedIndicesResults);
		},
		
		 _receivedIndicesResults: function(data) {
		 console.log("_receivedIndicesResults-------"+JSON.stringify(data));
			defectsLocalization.allIndices="";			
			defectsLocalization.allIndices = data.indices;
			//var collectionAvailFlag=true;
			if(data.indices.indexOf("feature_defect_method_collection") == -1)
				defectsLocalization.gblDLCollection=false;
			console.log("feature_defect_method_collection name avail-------"+defectsLocalization.gblDLCollection);
		},
		
		_getSearchIndexTypes: function() {

            var elements = document.querySelectorAll('#searchFilterDropdown_dl label input:checked');
            var selectedFilterTypeArray = Array.prototype.map.call(elements, function(el, i) {
                return $(el).attr("indexCollection")
            });
			var searchIndexes = {};

            for (var i = 0; i < selectedFilterTypeArray.length; i++) {
				if( selectedFilterTypeArray[i] != null ) { searchIndexes[selectedFilterTypeArray[i]]=1 ;}
            }
			return Object.keys(searchIndexes); //SIMY: Sending unique list
        },
		
		
		
		_searchDefectByDates: function(startDate, endDate) {
		
			console.log("Date functin invoked startDate--->"+startDate);
			console.log("Date functin invoked endDate--->"+endDate);
			var requestObject = new Object();
			requestObject.collectionName = "defect_collection";
			requestObject.fromInputDate = startDate;
			requestObject.fromOutputDate = endDate;
			requestObject.maxResults = 15;
            ISE.getSearchResultsByDateRange(requestObject, defectsLocalization._receivedSearchResults);
		},
		
		
		_receivedDefectDetailsByID: function(data) {

			for (var i = 0; i < data.length; i++) {
                var title = data[i].title;
                var description = data[i].description;
				var descriptionData = "";
				console.log("defect title ---"+title);
				console.log("defect description---"+description);
                $('#defect_searchDefectTitle').val(title);
                $('#defect_searchDefectDes').val(description);
            }

			var requestObject = new Object();
            requestObject.collectionName = "defect_collection";
			descriptionData = "(description:"+$('#defect_searchDefectDes').val().replace(/\//g, " ")+")";
			//var datavalsss = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:15.0) Gecko/20100101 Firefox/15.0.1Build ID: 20120905151427Steps to reproduce:I set Firefox Preferences";
			//descriptionData = datavalsss.replace(/\//g, " ");
			console.log("descriptionData input----"+descriptionData);
			requestObject.searchString = descriptionData;
			requestObject.maxResults = 15;
            ISE.getDefLocalizationSearch(requestObject, defectsLocalization._receivedSearchResults);

        },

        
		_receivedSearchResults: function(dataObj) {
		//console.log("--------705-------"+JSON.stringify(dataObj));
		$("#tablebody_dl").empty();
		  if(dataObj.length > 0){
			}else{
			  $("#tablebody_dlDefects").empty();
			 } 
		
            if (ISEUtils.validateObject(dataObj)) {
                var FieldsMap = {};
                var DisplayNameMap = {};
                var displayColumns = {};
                var tC = {};


                for (var K in defectsLocalization.jsonDataCollection.TabArray) {
                    FieldsMap[defectsLocalization.jsonDataCollection.TabArray[K].indexName] = defectsLocalization.jsonDataCollection.TabArray[K].Details.fields;
                    DisplayNameMap[defectsLocalization.jsonDataCollection.TabArray[K].indexName] = defectsLocalization.jsonDataCollection.TabArray[K].displayName;
                    displayColumns[defectsLocalization.jsonDataCollection.TabArray[K].indexName] = defectsLocalization.jsonDataCollection.TabArray[K].defaultView;
                }
				
				console.log(FieldsMap);
				console.log(DisplayNameMap);
				console.log(displayColumns);


                var sortField = 1;
                var fields = FieldsMap[dataObj[1]._index];
				
				//console.log(fields);
				
                for (var ii = 0; ii < fields.length; ii++) {
                    if (fields[ii].SourceName == 'similarity') sortField = ii + 1;
                }


                for (var i = 0; i < dataObj.length; i++) {
					
                    var fields = FieldsMap[dataObj[i]._index];
                    var dName = DisplayNameMap[dataObj[i]._index];
					var id = dataObj[i]._id;
					var tcid = dataObj[i].testcaseid;
					var pf = dataObj[i].primary_feature;
					var defRaisedDate =  dataObj[i].date;
					
                    var tableID = '#sample_4__dl' + dName;
                    if (!tC[tableID]) {

                        var oTable = $(tableID).dataTable();
                        oTable.fnClearTable();
                        oTable.fnDestroy();
						//console.log(oTable);
                    }
                    tC[tableID] = 1;


                    var newRowContent = '<tr><td><span class="row-details row-details-close"></span></td>';
                    for (var ii = 0; ii < fields.length; ii++) {
						if(fields[ii].SourceName == "date") {
							var dt=new Date(dataObj[i][fields[ii].SourceName]).toLocaleString();	
							newRowContent += '<td class="ISEcompactAuto"><span requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dt + '</span></td>';
						}
						else
							newRowContent += '<td class="ISEcompactAuto"><span requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';

                    }
					var viewClick ="";
					if(dName == "TestCase") {
					tcRaisedDate="";
						viewClick = '<td><a class="scrolling"  id="'+tcid+'&#&'+pf+'&#&'+defRaisedDate+'" name="FeatureDefectCB123" type="button" value="'+id+'" onclick="defectsLocalization._onViewTest(this);">' + "view Insight" + '</a></td>';	
					} else {
						viewClick='<td><a class="scrolling"  id="'+id+'&#&'+pf+'&#&'+defRaisedDate+'" name="FeatureDefectCB123" type="button" value="'+id+'" onclick="defectsLocalization._onView(this);">' + "view Insight" + '</a></td>';	

					}
					newRowContent += viewClick;
                    newRowContent += '</tr>';
					//console.log("--------780-----------"+newRowContent);
					$('#tablebody_dl' + dName).append(newRowContent);
					var projectName = localStorage.getItem('projectName');
					ISE.methodDefectCount("defect_localization_method_def_count", "", projectName, false, defectsLocalization._receivedMethodDefCount);
			 }
				
				


                //SIMY: Creating tables only for result
                for (var tab in tC) {
					console.log(tab);
                    var oTable = $(tab).dataTable({
                        "dom": 'frtTip',
                        "tableTools": {
                            "sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
                        },
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
                        }],
                        "order": [
                            [sortField, 'desc']
                        ],
                        "lengthMenu": [
                            [5, 15, 20, -1],
                            [5, 15, 20, "All"] // change per page values here
                        ],
                        // set the initial value
                        "pageLength": 10,

                    });


					
                    $(tab).unbind('click'); // SIMY: removing all events in case if there was some event set here ..
                    $(tab).on('click', ' tbody td .row-details', function(event) {
                        var nTr = $(this).parents('tr')[0];
                        var tID = $(this).closest('table').attr('id');

                        var cols = [];
                        cols = defectsLocalization._getColumnNamesList(tID);
						
                        var oTable = $('#' + tID).dataTable();
						
                        if (oTable.fnIsOpen(nTr)) {
                            $(this).addClass("row-details-close").removeClass("row-details-open");
                            oTable.fnClose(nTr);
                        } else {
                            // Open this row 
                            $(this).addClass("row-details-open").removeClass("row-details-close");
                            oTable.fnOpen(nTr, defectsLocalization._fnDefectSearchRowFormatDetails(oTable, nTr, cols), 'details');
                        }

                    });

                }



                for (var i = 0; i < defectsLocalization.hideTableColumns.length; i++) {
                    var iTD = '#' + defectsLocalization.hideTableColumns[i].tableID;
                    if (!tC[iTD]) continue; // SIMY: do not proceed if the table is in current list

                    var table = $(iTD).DataTable();
                    for (var j = 0; j < defectsLocalization.hideTableColumns[i].hideColumnsList.length; j++) {


                        var columnID = defectsLocalization.hideTableColumns[i].hideColumnsList[j] - 1;
                        table.column(columnID).visible(false, false);
                    }

                }

                $('#searchResultsTable_dl').removeClass("hide");


                //  Hide Table rows dropdown and Table Search
                $("div").find(".dataTables_length").addClass('hidden-sm hidden-xs');
                $("div").find(".dataTables_filter").addClass('hidden-sm hidden-xs');

                var windowWidth = $(window).width();
                if (windowWidth <= 400) {
                    defectsLocalization.onResizeWindow();
                    $("html, body").animate({
                        scrollTop: $(document).height()
                    }, 1000);
                }
            }

            ISEUtils.portletUnblocking("pageContainer");
        },
		
		_getColumnNamesList: function(tableID) {

            for (var i = 0; i < defectsLocalization.hideTableColumns.length; i++) {

                if (defectsLocalization.hideTableColumns[i].tableID == tableID)
                    return defectsLocalization.hideTableColumns[i].allColumnsNames; // Returns Array

            }

        },
		
		_fnDefectSearchRowFormatDetails: function(oTable, nTr, cols) {

            var aData = oTable.fnGetData(nTr);
			
			console.log(aData);
			var sOut = '<table>';


			 for (var i = 0; i < cols.length; i++) {
			 
			  var fieldValue = $(aData[i + 1]).text();
			 
			 sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td></td><td></td><td class="ISEcompactAuto">' + fieldValue + ' </td></tr>';
			 
			 }
            
			sOut += '</table>';
			return sOut;
        },
		
		
		_onView: function(node) {
		
			$('#defStartDate').val('');
			$('#defEndDate').val('');
			ISEUtils.portletBlocking("pageContainer");
			var defFeatureVal = node.id;
			var defFeaArray = defFeatureVal.split("&#&");
			var inputDefect = defFeaArray[0];
			var inputfeature = defFeaArray[1];
			defectRaisedDate = defFeaArray[2];
			var defRaiseDate = new Date(defectRaisedDate);
			var myDate = new Date(defectRaisedDate);
			var dayOfMonth = myDate.getDate();
			myDate.setDate(dayOfMonth - 30);
			var isodateConver = new Date(myDate.toString());
			console.log("defraiseddate ----"+defRaiseDate.getFullYear()+'-' + (defRaiseDate.getMonth()+1) + '-'+defRaiseDate.getDate())
			console.log("deferaisedate minus 30 days ----"+isodateConver.getFullYear()+'-' + (isodateConver.getMonth()+1) + '-'+isodateConver.getDate())
			
			var isodateformat = isodateConver.toISOString()
			searchDefId = inputDefect;
			gblDefectId = searchDefId;
			searchFeaId = inputfeature;
			gblDefectFeaId = searchFeaId;
			var projectName = localStorage.getItem('projectName');
			var requestObject = new Object();
			requestObject.collectionName = "feature_defect_method_collection";
			//requestObject.collectionName = "defect_collection";
			requestObject.fromDate = isodateConver.getFullYear()+'-' + (isodateConver.getMonth()+1) + '-'+isodateConver.getDate();
			requestObject.toDate = defRaiseDate.getFullYear()+'-' + (defRaiseDate.getMonth()+1) + '-'+defRaiseDate.getDate();
			//requestObject.fromDate = "2015-10-8";
			//requestObject.toDate ="2015-10-13";
			requestObject.maxResults = 15;
			console.log("--------953--"+defectsLocalization.gblDLCollection);
			if(defectsLocalization.gblDLCollection){
				ISE.getDefLocalizationBetweenDatesSearch(requestObject, defectsLocalization._callBackDefectLocalization);
			}else{
				defectsLocalization._noMethodsShowFilesData();
			}
			
			//ISE.getDefLocalizationBetweenDatesSearch(requestObject, defectsLocalization._callBackDefectLocalization);
			
			//console.log("--931--"+defectsLocalization.checking(requestObject));
			/*console.log("no data----------896-------"+defectsLocalization.gblColNameAvail);
			if(!defectsLocalization.gblColNameAvail)		{
			defectsLocalization.gblColNameAvail = false;
			
			var inputDefectValue = "(link:"+inputDefect+")";
			var requestObjectFile = new Object();
			requestObjectFile.collectionName = "defect_collection";
			requestObjectFile.searchString= inputDefectValue;
			requestObjectFile.projectName= projectName;
			console.log("searching defectid for nodata----"+inputDefectValue);
			requestObjectFile.maxResults = 15;
			
			ISE.getDefLocalizationFiles(requestObjectFile, defectsLocalization._callBackNoDataDefectLocalization);
			}
			*/
				
			//	ISEUtils.portletUnblocking("pageContainer");
				//alert("No data")
				//$('#defectLocallizationModal1').modal('show');
			//}
		
		},
		  
		 _onViewTest: function(node) {
				ISEUtils.portletBlocking("pageContainer");
				var defFeatureVal = node.id;
				var defFeaArray = defFeatureVal.split("&#&");
				var inputDefect = defFeaArray[0];
				var inputfeature = defFeaArray[1];
				tcRaisedDate = defFeaArray[2];
				
				gblTcId = inputDefect;
				gblTcFeaId = inputfeature;
				gblTcDate = tcRaisedDate
				
				searchTCId = inputDefect;
				searchTCFeaId = inputfeature;
				var projectName = localStorage.getItem('projectName');
				var finalString;
				var updateUser = localStorage.getItem('username')
				finalString = searchTCId;
				var requestObject1 = new Object();
				requestObject1.collectionName = "test_executions";
				requestObject1.searchString =	finalString;
				requestObject1.maxResults = 1;
				ISE.getDefLocalizationTestDateSearch(requestObject1, defectsLocalization._receivedTestSearchResults);	
				
		},
		 
		_receivedTestSearchResults:function(data){
		
			console.log("_receivedTestSearchResults------_receivedTestSearchResults-----"+JSON.stringify(data));
		  
			$("#tableBodyTestSearch").empty();
			$("#tableBodyTest").empty();
			
			var newRowContentSearch = "<tr>";
			newRowContentSearch +='<td>Test Case ID - <b>'+gblTcId+'</b>&nbsp;&nbsp;|&nbsp;&nbsp;'+'Feature - <b>'+gblTcFeaId+'</b></td>';
			newRowContentSearch += "</tr>";
			$('#tableBodyTestSearch').last().append(newRowContentSearch);
			
			var newRowContent = '<tr style="color:#0084c9">';
			if(data.length>0) {
				for(var i=0;i<data.length;i++) {
					if(data[i].status != "N.A") {
						if (data[i].last_updated_date != undefined) {
							newRowContent += '<td id="date'+i+'" value="'+ data[i].last_updated_date+ '">'+data[i].last_updated_date + '</td>';
						}
						else {
							newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						}
						 
						 if (data[i].status != undefined) {
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].status+ '">'+data[i].status + '</td>';
						}
						else {
							newRowContent += '<td id="featureIdVal'+i+'" value="N.A">No Status</td>';
						}
						
						if (data[i].build != undefined) {
							newRowContent += '<td id="defcount'+i+'" value="'+ data[i].build+ '">'+data[i].build + '</td>';
						}
						else {
							newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						}
						
						if (data[i].release != undefined) {
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].release+ '">'+data[i].release + '</td>';
						}
						else {
							newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						}
						
						if (data[i].primary_feature != undefined) {
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].primary_feature+ '">'+data[i].primary_feature + '</td>';
						}
						else {
							newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						}
						newRowContent+='</tr>';
						
					}
				}
			}else{
				newRowContent += '<td colspan="7"><center><span style="color:red">Associated Test Case not available</span><center></td>';
				newRowContent+='</tr>';
			}
			
			$('#tableBodyTest').last().append(newRowContent);
			//koteswar start
			  
				var param2 = data[0].date;
				var defectDate = new Date(gblTcDate);
				var myDate = new Date(gblTcDate);
				var dayOfMonth = myDate.getDate();
				myDate.setDate(dayOfMonth - 30);
			
				var requestObject = new Object();
				requestObject.collectionName = "feature_defect_method_collection";
				requestObject.fromDate = defectDate.getFullYear()+'-' + (defectDate.getMonth()+1) + '-'+defectDate.getDate();
				requestObject.toDate = myDate.getFullYear()+'-' + (myDate.getMonth()+1) + '-'+myDate.getDate();
				requestObject.maxResults = 15;
				ISE.getDefLocalizationBetweenDatesSearch(requestObject, defectsLocalization._callBackDefectLocalizationTest);
				$('#searchResultsTableTest').removeClass("hide");
			
		},
		  
			_receivedMethodDefCount: function(data) {
				for(var i=0; i<data.length; i++) {
					var obj ={};
					obj.method = data[i].methodname;
					obj.defectCnt = data[i].cnt;
					defectsLocalization.methodDefectCnt.push(obj)
					
				}
			},
			_receivedMethodDefTestCount: function(data) {
				for(var i=0; i<data.length; i++) {
					var obj ={};
					obj.method = data[i].methodname;
					obj.defectCnt = data[i].cnt;
					defectsLocalization.methodTestcaseCnt.push(obj)
					
				}
			},
		  
		  
		  _callBackDefectLocalizationTest:function(data){
		  
			console.log("_callBackDefectLocalizationTest---"+JSON.stringify(data));
			var tempTcData = 0;
			$("#tableBodyTest2").empty();
			var newRowContent = '<tr>';
			var newRowContentMethods = '<tr>';
			console.log("----data.length----"+data.length);
			if(data.length>0)
			{
				for(var i=0;i<data.length;i++) {
					 if (data[i].methodname != undefined) {
						if(searchTCFeaId == data[i].primary_feature){
						tempTcData++;
							newRowContent += '<td style="background-color:#00CC99;color:white; border-left:5px solid #0084c9" id="methodName'+i+'" value="'+ data[i].methodname+ '">'+data[i].methodname + '</td>';
							newRowContentMethods += '<td style="background-color:#00CC99;color:white; border-left:5px solid #0084c9" id="methodName'+i+'" value="'+ data[i].methodname+ '">'+data[i].methodname + '</td>';
						}else
						newRowContent += '<td id="methodName'+i+'" value="'+ data[i].methodname+ '">'+data[i].methodname + '</td>';
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContentMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					if (data[i].updated_by != undefined) {
					if(searchTCFeaId == data[i].primary_feature){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].updated_by+ '">'+data[i].updated_by + '</td>';
							newRowContentMethods += '<td id="featureval'+i+'" value="'+ data[i].updated_by+ '">'+data[i].updated_by + '</td>';
						}else
						newRowContent += '<td id="featureval'+i+'" value="'+ data[i].updated_by+ '">'+data[i].updated_by + '</td>';
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContentMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						
					}
					
					
					var methodsDefects = _.where(defectsLocalization.methodDefectCnt, {method: data[i].methodname});					
					
					if (methodsDefects[0].defectCnt != undefined) {
					if(searchTCFeaId == data[i].primary_feature){
							newRowContent += '<td id="defcount'+i+'" value="'+ methodsDefects[0].defectCnt+ '">'+methodsDefects[0].defectCnt + '</td>';
							newRowContentMethods += '<td id="defcount'+i+'" value="'+ methodsDefects[0].defectCnt+ '">'+methodsDefects[0].defectCnt + '</td>';
							
						}else
						newRowContent += '<td id="defcount'+i+'" value="'+ methodsDefects[0].defectCnt+ '">'+methodsDefects[0].defectCnt + '</td>';
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContentMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					
					if (data[i].last_updated_date != undefined) {
						if(searchTCFeaId == data[i].primary_feature){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].last_updated_date+ '">'+data[i].last_updated_date + '</td>';
							newRowContentMethods += '<td id="featureval'+i+'" value="'+ data[i].last_updated_date+ '">'+data[i].last_updated_date + '</td>';
						}else
						newRowContent += '<td id="featureval'+i+'" value="'+ data[i].last_updated_date+ '">'+data[i].last_updated_date + '</td>';
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContentMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						
					}
					
					if (data[i].build != undefined) {
						if(searchTCFeaId == data[i].primary_feature){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].build+ '">'+data[i].build + '</td>';
							newRowContentMethods += '<td id="featureval'+i+'" value="'+ data[i].build+ '">'+data[i].build + '</td>';
						}else
						newRowContent += '<td id="featureval'+i+'" value="'+ data[i].build+ '">'+data[i].build + '</td>';
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContentMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					if (data[i].primary_feature != undefined) {
						
						if(searchTCFeaId == data[i].primary_feature){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].primary_feature+ '">'+data[i].primary_feature + '</td>';
							newRowContentMethods += '<td id="featureval'+i+'" value="'+ data[i].primary_feature+ '">'+data[i].primary_feature + '</td>';
						}else
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].primary_feature+ '">'+data[i].primary_feature + '</td>';
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContentMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					newRowContent += '<td ><a id="'+data[i].methodname+'" type ="button" value="'+data[i].methodname+'" onclick="defectsLocalization._onViewTestPath(this);">' + "Show Path" + '</a></td>';
					newRowContent+='</tr>';
					if(searchTCFeaId == data[i].primary_feature){
						newRowContentMethods += '<td ><a id="'+data[i].methodname+'" type ="button" value="'+data[i].methodname+'" onclick="defectsLocalization._onViewTestPath(this);">' + "Show Path" + '</a></td>';
						newRowContentMethods+='</tr>';
					}
					
				
				}
			
			}else{
				console.log("first else");
				newRowContent += '<td colspan="7"><center><span style="color:red">Data not available</span><center></td>';
				newRowContent+='</tr>';
				newRowContentMethods += '<td colspan="7"><center><span style="color:red">Data not available</span><center></td>';
				newRowContentMethods+='</tr>';
			}
			if(tempTcData>0)
			console.log("Data Available");
			else{
				newRowContentMethods += '<td colspan="7"><center><span style="color:red">Selected Features data not available</span><center></td>';
				newRowContentMethods+='</tr>';
			
			}
			if(document.getElementById("selectFeaturestestChk").checked){
				$('#tableBodyTest2').last().append(newRowContent);
				
			}else{
				$('#tableBodyTest2').last().append(newRowContentMethods);
			}
			 ISEUtils.portletUnblocking("pageContainer");
			$('#methodTableTest').removeClass("hide");
			//added to sort by feature
			defectsLocalization._sortData('methodTableTest',searchTCFeaId);
			 //for scroll bar
			//$('html,body').animate({scrollTop: $(document).height()}, 600);
			 $('html,body').scrollTop(1100);
			  ISEUtils.portletUnblocking("pageContainer");
			
		},
		
		_onViewTestPath: function(node) {
			var projectName = localStorage.getItem('projectName');
			var methodName = node.id;
			var fromCache="false";
			var data = '{"requesttype":"methodpath","PARAM1":"'+methodName+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
			ISE_Ajax_Service.ajaxPostReq('DefectLocalizationRestService', 'json', localStorage.authtoken,data,defectsLocalization._methodTestPathData);
			$('#searchResultsTableTest').removeClass("hide");
		 },
		
		
		
		_methodTestPathData:function(data){
		$("#tableBodyPathTable").empty();
			console.log("^^^^^^^^^path^^^^^^"+JSON.stringify(data));
			
			
			var newRowContent	='<tr>	<th id="defectIDHeader"> Method Path</th>	<th id="dateHeader"> Defects Count	</th>	</tr>';
								
			 newRowContent += '<tr>';
			if(data.methodPaths.length>0)
			{
				for(var i=0;i<data.methodPaths.length;i++) {
					
					if (data.methodPathsDefCnt[i] != undefined) {
					var arrowMark = ' '+'<label class="glyphicon glyphicon-arrow-right" style="color:blue"></label>'+' ';
						newRowContent += '<td id="methodName'+i+'" value="'+ data.methodPaths[i]+ '">'+data.methodPaths[i].replace(/--->/gi,arrowMark) + '</td>';
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					 if (data.methodPathsDefCnt[i] != undefined) {
						newRowContent += '<td id="methodName'+i+'" value="'+ data.methodPathsDefCnt[i]+ '">'+data.methodPathsDefCnt[i] + '</td>';
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					newRowContent+='</tr>';
				}
			}else{
			
					newRowContent += '<td colspan="2"><center><span style="color:red">Associated Method paths not available</span><center></td>';
					newRowContent+='</tr>';
			}
			$('#tableBodyPathTable').last().append(newRowContent);
			$('#methodPathTableTest').removeClass("hide");
			
			$('html,body').animate({scrollTop: $(document).height()}, 600);
			//$('html,body').scrollTop(1100);
			
		},	

	_sortData: function(elementid, stringvalue){
        var tableData = document.getElementById(elementid).getElementsByTagName('tbody').item(0);
		var rowData = tableData.getElementsByTagName('tr'); 
		 for(var i = 0; i < rowData.length - 1; i++){
            for(var j = 0; j < rowData.length - (i + 1); j++){
				console.log(rowData.item(j).getElementsByTagName('td').item(1).innerHTML);
                if((rowData.item(j).getElementsByTagName('td').item(5).innerHTML != stringvalue) && (rowData.item(j+1).getElementsByTagName('td').item(5).innerHTML == stringvalue)) {
                    tableData.insertBefore(rowData.item(j+1),rowData.item(j));                
                }
            }
        }
    },
		
		//If no methods data have to display files w.r.t Files.
		_noMethodsShowFilesData: function(){
			var projectName = localStorage.getItem('projectName');
			//var inputDefectValue = "(link:"+"inputDefect"+")";
			var requestObjectFile = new Object();
			requestObjectFile.collectionName = "defect_collection";
			//requestObjectFile.searchString= inputDefectValue;
			requestObjectFile.projectName= projectName;
			//console.log("searching defectid for nodata----"+inputDefectValue);
			requestObjectFile.maxResults = 15;
			ISE.getDefLocalizationFiles(requestObjectFile, defectsLocalization._callBackNoDataDefectLocalization);
			
		},

		
		_callBackDefectLocalization:function(data){
		
			var tempTcData = 0;
			$("#tableBodySearch").empty();
			$("#tableBody1").empty();
			$("#methodTablebody").empty();
			$("#tableBody2").empty();
			
			
			
			if(data.length == 0){
				defectsLocalization._noMethodsShowFilesData();
			}else{
			
			
			
			var newRowContentSearch = "<tr>";
			newRowContentSearch +='<td>Defect - <b>'+gblDefectId+'</b>&nbsp;&nbsp;|&nbsp;&nbsp;'+'Feature - <b>'+gblDefectFeaId+'</b></td>';
			newRowContentSearch += "</tr>";
			$('#tableBodySearch').last().append(newRowContentSearch);
			var newRowContent = '<tr>';
			var newRowContenteMethods = '<tr>';
			console.log("data defects length------"+data.length);
			if(data.length>0)
			{
				for(var i=0;i<data.length;i++) {
					if (data[i].methodname != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
						tempTcData++;
							newRowContent += '<td style="background-color:#00CC99;color:white; border-left:5px solid #0084c9" id="methodName'+i+'" value="'+ data[i].methodname+ '">'+data[i].methodname + '</td>';
							newRowContenteMethods += '<td style="background-color:#00CC99;color:white; border-left:5px solid #0084c9" id="methodName'+i+'" value="'+ data[i].methodname+ '">'+data[i].methodname + '</td>';
						}else{
							newRowContent += '<td id="methodName'+i+'" value="'+ data[i].methodname+ '">'+data[i].methodname + '</td>';
						}
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					 
					 if (data[i].updated_by != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].updated_by+ '">'+data[i].updated_by + '</td>';
							newRowContenteMethods += '<td id="featureval'+i+'" value="'+ data[i].updated_by+ '">'+data[i].updated_by + '</td>';
						}
						else{
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].updated_by+ '">'+data[i].updated_by + '</td>';
						}
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					var methodsTestcase = _.where(defectsLocalization.methodTestcaseCnt, {method: data[i].methodname});					
					
					if (methodsTestcase[0].defectCnt != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
								newRowContent += '<td id="defcount'+i+'" value="'+ methodsTestcase[0].defectCnt+ '">'+methodsTestcase[0].defectCnt + '</td>';
								newRowContenteMethods += '<td id="defcount'+i+'" value="'+ methodsTestcase[0].defectCnt+ '">'+methodsTestcase[0].defectCnt + '</td>';
						}else{
							newRowContent += '<td id="defcount'+i+'" value="'+ methodsTestcase[0].defectCnt+ '">'+methodsTestcase[0].defectCnt + '</td>';
						}
					}else {
						newRowContent += '<td id="defcount'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="defcount'+i+'" value="N.A">N.A</td>';
					}
					
					if (data[i].last_updated_date != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].last_updated_date+ '">'+data[i].last_updated_date + '</td>';
							newRowContenteMethods += '<td id="featureval'+i+'" value="'+ data[i].last_updated_date+ '">'+data[i].last_updated_date + '</td>';
						}else{
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].last_updated_date+ '">'+data[i].last_updated_date + '</td>';
						}
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					
					if (data[i].build != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].build+ '">'+data[i].build + '</td>';
							newRowContenteMethods += '<td id="featureval'+i+'" value="'+ data[i].build+ '">'+data[i].build + '</td>';
						}else{
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].build+ '">'+data[i].build + '</td>';
						}
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					
					
					if (data[i].primary_feature != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].primary_feature+ '">'+data[i].primary_feature + '</td>';
							newRowContenteMethods += '<td id="featureval'+i+'" value="'+ data[i].primary_feature+ '">'+data[i].primary_feature + '</td>';
						}else{
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].primary_feature+ '">'+data[i].primary_feature + '</td>';
						}
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					newRowContent += '<td ><a id="'+data[i].methodname+'" type ="button" value="'+data[i].methodname+'" onclick="defectsLocalization._onView1(this);">' + "Show Path" + '</a></td>';
					newRowContent+='</tr>';
					if(data[i].primary_feature == gblDefectFeaId){
						newRowContenteMethods += '<td ><a id="'+data[i].methodname+'" type ="button" value="'+data[i].methodname+'" onclick="defectsLocalization._onView1(this);">' + "Show Path" + '</a></td>';
						newRowContenteMethods+='</tr>';
					}
				}
			
			}else{
				newRowContent += '<td colspan="7"><center><span style="color:red">Data not available</span><center></td>';
				newRowContent+='</tr>';
				newRowContenteMethods += '<td colspan="7"><center><span style="color:red">Data not available</span><center></td>';
				newRowContenteMethods+='</tr>';
				//$('#tableBody1').last().append("<div>Data not available</div>");
			}
			searchDefId="";
			searchFeaId="";
			
			if(tempTcData>0)
				console.log("Data Available");
			else{
				newRowContenteMethods += '<td colspan="7"><center><span style="color:red">Selected Features data not available</span><center></td>';
				newRowContenteMethods+='</tr>';
			}
			
			if(document.getElementById("selectFeaturesChk").checked){
				$('#methodTablebody').last().append(newRowContent);
			}else{
				$('#methodTablebody').last().append(newRowContenteMethods);
				
			}
			ISEUtils.portletUnblocking("pageContainer");
			
			$('#dl_searchResultsTableMethod').removeClass("hide");
			}			
			ISEUtils.portletUnblocking("pageContainer");
			 //added to sort the data
			 defectsLocalization._sortData('dl_Methods',gblDefectFeaId);
			$('html,body').scrollTop(1100);
			
		},
		
	/*	_callBackDefectLocalization:function(data){
		
			var tempTcData = 0;
			$("#tableBodySearch").empty();
			$("#tableBody1").empty();
			
			var newRowContentSearch = "<tr>";
			newRowContentSearch +='<td>Defect - <b>'+gblDefectId+'</b>&nbsp;&nbsp;|&nbsp;&nbsp;'+'Feature - <b>'+gblDefectFeaId+'</b></td>';
			newRowContentSearch += "</tr>";
			$('#tableBodySearch').last().append(newRowContentSearch);
			var newRowContent = '<tr>';
			var newRowContenteMethods = '<tr>';
			console.log("data defects length------"+data.length);
			if(data.length>0)
			{
				for(var i=0;i<data.length;i++) {
					if (data[i].methodname != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
						tempTcData++;
							newRowContent += '<td style="background-color:#00CC99;color:white; border-left:5px solid #0084c9" id="methodName'+i+'" value="'+ data[i].methodname+ '">'+data[i].methodname + '</td>';
							newRowContenteMethods += '<td style="background-color:#00CC99;color:white; border-left:5px solid #0084c9" id="methodName'+i+'" value="'+ data[i].methodname+ '">'+data[i].methodname + '</td>';
						}else{
							newRowContent += '<td id="methodName'+i+'" value="'+ data[i].methodname+ '">'+data[i].methodname + '</td>';
						}
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					 
					 if (data[i].updated_by != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].updated_by+ '">'+data[i].updated_by + '</td>';
							newRowContenteMethods += '<td id="featureval'+i+'" value="'+ data[i].updated_by+ '">'+data[i].updated_by + '</td>';
						}
						else{
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].updated_by+ '">'+data[i].updated_by + '</td>';
						}
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					var methodsTestcase = _.where(defectsLocalization.methodTestcaseCnt, {method: data[i].methodname});					
					
					if (methodsTestcase[0].defectCnt != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
								newRowContent += '<td id="defcount'+i+'" value="'+ methodsTestcase[0].defectCnt+ '">'+methodsTestcase[0].defectCnt + '</td>';
								newRowContenteMethods += '<td id="defcount'+i+'" value="'+ methodsTestcase[0].defectCnt+ '">'+methodsTestcase[0].defectCnt + '</td>';
						}else{
							newRowContent += '<td id="defcount'+i+'" value="'+ methodsTestcase[0].defectCnt+ '">'+methodsTestcase[0].defectCnt + '</td>';
						}
					}else {
						newRowContent += '<td id="defcount'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="defcount'+i+'" value="N.A">N.A</td>';
					}
					
					if (data[i].last_updated_date != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].last_updated_date+ '">'+data[i].last_updated_date + '</td>';
							newRowContenteMethods += '<td id="featureval'+i+'" value="'+ data[i].last_updated_date+ '">'+data[i].last_updated_date + '</td>';
						}else{
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].last_updated_date+ '">'+data[i].last_updated_date + '</td>';
						}
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					
					if (data[i].build != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].build+ '">'+data[i].build + '</td>';
							newRowContenteMethods += '<td id="featureval'+i+'" value="'+ data[i].build+ '">'+data[i].build + '</td>';
						}else{
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].build+ '">'+data[i].build + '</td>';
						}
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					
					
					if (data[i].primary_feature != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].primary_feature+ '">'+data[i].primary_feature + '</td>';
							newRowContenteMethods += '<td id="featureval'+i+'" value="'+ data[i].primary_feature+ '">'+data[i].primary_feature + '</td>';
						}else{
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].primary_feature+ '">'+data[i].primary_feature + '</td>';
						}
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					newRowContent += '<td ><a id="'+data[i].methodname+'" type ="button" value="'+data[i].methodname+'" onclick="defectsLocalization._onView1(this);">' + "Show Path" + '</a></td>';
					newRowContent+='</tr>';
					if(data[i].primary_feature == gblDefectFeaId){
						newRowContenteMethods += '<td ><a id="'+data[i].methodname+'" type ="button" value="'+data[i].methodname+'" onclick="defectsLocalization._onView1(this);">' + "Show Path" + '</a></td>';
						newRowContenteMethods+='</tr>';
					}
				}
			
			}else{
				newRowContent += '<td colspan="7"><center><span style="color:red">Data not available</span><center></td>';
				newRowContent+='</tr>';
				newRowContenteMethods += '<td colspan="7"><center><span style="color:red">Data not available</span><center></td>';
				newRowContenteMethods+='</tr>';
				//$('#tableBody1').last().append("<div>Data not available</div>");
			}
			searchDefId="";
			searchFeaId="";
			
			if(tempTcData>0)
				console.log("Data Available");
			else{
				newRowContenteMethods += '<td colspan="7"><center><span style="color:red">Selected Features data not available</span><center></td>';
				newRowContenteMethods+='</tr>';
			}
			
			if(document.getElementById("selectFeaturesChk").checked){
				$('#methodTablebody').last().append(newRowContent);
			}else{
				$('#methodTablebody').last().append(newRowContenteMethods);
				
			}
			ISEUtils.portletUnblocking("pageContainer");
			
			$('#dl_searchResultsTableMethod').removeClass("hide");
			 ISEUtils.portletUnblocking("pageContainer");
			 //added to sort the data
			 defectsLocalization._sortData('dl_Methods',gblDefectFeaId);
			$('html,body').scrollTop(1100);
		},*/
//no data file starts
		
		_callBackNoDataDefectLocalization:function(data){
		
			var tempTcData = 0;
			$("#tableBodySearch").empty();
			$("#tableBody1").empty();
			
			var newRowContentSearch = "<tr>";
			newRowContentSearch +='<td>Defect - <b>'+gblDefectId+'</b>&nbsp;&nbsp;|&nbsp;&nbsp;'+'Feature - <b>'+gblDefectFeaId+'</b></td>';
			newRowContentSearch += "</tr>";
			$('#tableBodySearch').last().append(newRowContentSearch);
			var newRowContent = '<tr>';
			var newRowContenteMethods = '<tr>';
			console.log("data defects length------"+data.length);
			if(data.length>0)
			{
				for(var i=0;i<data.length;i++) {
					if (data[i].file != undefined) {
						var fl = data[i].file.substring(1, data[i].file.length - 1)
						if(data[i].primary_feature == gblDefectFeaId){
						tempTcData++;
							newRowContent += '<td style="background-color:#00CC99;color:white; border-left:5px solid #0084c9" id="methodName'+i+'" value="'+ fl+ '">'+fl + '</td>';
							newRowContenteMethods += '<td style="background-color:#00CC99;color:white; border-left:5px solid #0084c9" id="methodName'+i+'" value="'+ fl+ '">'+fl + '</td>';
						}else{
							newRowContent += '<td id="methodName'+i+'" value="'+ fl+ '">'+fl + '</td>';
						}
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					 
					 if (data[i].assignedto != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].assignedto+ '">'+data[i].assignedto + '</td>';
							newRowContenteMethods += '<td id="featureval'+i+'" value="'+ data[i].assignedto+ '">'+data[i].assignedto + '</td>';
						}
						else{
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].assignedto+ '">'+data[i].assignedto + '</td>';
						}
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					var methodsTestcase = _.where(defectsLocalization.methodTestcaseCnt, {method: data[i].methodname});					
					
					/*if (methodsTestcase[0].defectCnt != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
								newRowContent += '<td id="defcount'+i+'" value="'+ methodsTestcase[0].defectCnt+ '">'+methodsTestcase[0].defectCnt + '</td>';
								newRowContenteMethods += '<td id="defcount'+i+'" value="'+ methodsTestcase[0].defectCnt+ '">'+methodsTestcase[0].defectCnt + '</td>';
						}else{
							newRowContent += '<td id="defcount'+i+'" value="'+ methodsTestcase[0].defectCnt+ '">'+methodsTestcase[0].defectCnt + '</td>';
						}
					}else {*/
						newRowContent += '<td id="defcount'+i+'" value="N.A">1</td>';
						newRowContenteMethods += '<td id="defcount'+i+'" value="N.A">1</td>';
					//}
					
					if (data[i].last_updated_date != undefined) {
					var dt=new Date(data[i].last_updated_date).toLocaleString();
						if(data[i].primary_feature == gblDefectFeaId){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].last_updated_date+ '">'+dt + '</td>';
							newRowContenteMethods += '<td id="featureval'+i+'" value="'+ dt+ '">'+dt + '</td>';
						}else{
							newRowContent += '<td id="featureval'+i+'" value="'+ dt+ '">'+dt + '</td>';
						}
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					
					if (data[i].release != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].release+ '">'+data[i].release + '</td>';
							newRowContenteMethods += '<td id="featureval'+i+'" value="'+ data[i].release+ '">'+data[i].release + '</td>';
						}else{
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].release+ '">'+data[i].release + '</td>';
						}
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					
					
					if (data[i].primary_feature != undefined) {
						if(data[i].primary_feature == gblDefectFeaId){
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].primary_feature+ '">'+data[i].primary_feature + '</td>';
							newRowContenteMethods += '<td id="featureval'+i+'" value="'+ data[i].primary_feature+ '">'+data[i].primary_feature + '</td>';
						}else{
							newRowContent += '<td id="featureval'+i+'" value="'+ data[i].primary_feature+ '">'+data[i].primary_feature + '</td>';
						}
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
						newRowContenteMethods += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					newRowContent += '<td ><a id="'+data[i].methodname+'" type ="button" value="'+data[i].methodname+'" onclick="defectsLocalization._onView1(this);">' + "Show Path" + '</a></td>';
					newRowContent+='</tr>';
					if(data[i].primary_feature == gblDefectFeaId){
						newRowContenteMethods += '<td ><a id="'+data[i].methodname+'" type ="button" value="'+data[i].methodname+'" onclick="defectsLocalization._onView1(this);">' + "Show Path" + '</a></td>';
						newRowContenteMethods+='</tr>';
					}
				}
			
			}else{
				newRowContent += '<td colspan="7"><center><span style="color:red">Data not available</span><center></td>';
				newRowContent+='</tr>';
				newRowContenteMethods += '<td colspan="7"><center><span style="color:red">Data not available</span><center></td>';
				newRowContenteMethods+='</tr>';
				//$('#tableBody1').last().append("<div>Data not available</div>");
			}
			searchDefId="";
			searchFeaId="";
			
			if(tempTcData>0)
				console.log("Data Available");
			else{
				newRowContenteMethods += '<td colspan="7"><center><span style="color:red">Selected Features data not available</span><center></td>';
				newRowContenteMethods+='</tr>';
			}
			
			//if(document.getElementById("selectFeaturesChk").checked){
				$('#tableBody1').last().append(newRowContent);
			//}else{
				//$('#tableBody1').last().append(newRowContenteMethods);
				
			//}
			ISEUtils.portletUnblocking("pageContainer");
			
			$('#dl_searchResultsTable1').removeClass("hide");
			 ISEUtils.portletUnblocking("pageContainer");
			 //added to sort the data
			 defectsLocalization._sortData('dl_Methods',gblDefectFeaId);
			$('html,body').scrollTop(1100);
		},
		
		//no data file ends
		
		_onView1: function(node) {
			var projectName = localStorage.getItem('projectName');
			var methodName = node.id;
			var fromCache="false";
			var data = '{"requesttype":"methodpath","PARAM1":"'+methodName+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
			ISE_Ajax_Service.ajaxPostReq('DefectLocalizationRestService', 'json', localStorage.authtoken,data,defectsLocalization._methodPathData);
			$('#searchResultsTable2').removeClass("hide");
		 },
		
		
		_methodPathData:function(data){
			$("#tableBody2").empty();
			var newRowContent	='<tr>	<th id="defectIDHeader"> Method Path</th>	<th id="dateHeader"> Defects Count	</th>	</tr>';
			newRowContent += '<tr>';
			if(data.methodPaths.length>0)
			{
				for(var i=0;i<data.methodPaths.length;i++) {
					
					if (data.methodPathsDefCnt[i] != undefined) {
					var arrowMark = ' '+'<label class="glyphicon glyphicon-arrow-right" style="color:blue"></label>'+' ';
						newRowContent += '<td id="methodName'+i+'" value="'+ data.methodPaths[i]+ '">'+data.methodPaths[i].replace(/--->/gi,arrowMark) + '</td>';
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					
					 if (data.methodPathsDefCnt[i] != undefined) {
						newRowContent += '<td id="methodName'+i+'" value="'+ data.methodPathsDefCnt[i]+ '">'+data.methodPathsDefCnt[i] + '</td>';
					}
					else {
						newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
					}
					newRowContent+='</tr>';
				}
			}else{
			
					newRowContent += '<td colspan="2"><center><span style="color:red">Associated Method paths not available</span><center></td>';
					newRowContent+='</tr>';
			}
			$('#tableBody2').last().append(newRowContent);
			$('#methodPathTable').removeClass("hide");
			$('html,body').animate({scrollTop: $(document).height()}, 600);
		},
		

        _getTableHeaderLables: function(headerObj) {

              $('#sample_4_column_toggler_dl').empty();
          for(var i=0;i<headerObj.length;i++){

            var colunmnID = i+1;

            if(i<5)
            {
            $('#sample_4_column_toggler_dl').append('<label><input type="checkbox" name="column" checked="true" data-column='+colunmnID+'>'+ headerObj[i].displayName + '</label>');
              }     
           else
          {
             $('#sample_4_column_toggler_dl').append('<label><input type="checkbox" name="column"  data-column='+colunmnID+'>'+ headerObj[i].displayName + '</label>');
               break;

          }
          }

      

            $('#defectIDHeader').text(headerObj[0].displayName);                     
			$('#featureHeader').text(headerObj[1].displayName);
            $('#dateHeader').text(headerObj[2].displayName);
			$('#severityHeader').text(headerObj[3].displayName);
			$('#priorityHeader').text(headerObj[4].displayName);
			$('#defectyypeHeader').text(headerObj[5].displayName);
			$('#statusHeader').text(headerObj[6].displayName);
			$('#titleHeader').text(headerObj[7].displayName);
			$('#viewHeader').text(headerObj[8].displayName);
			//$('#defectIdMethodHeader').text(headerObj[9].displayName);
			
          },
		  
		  
		  _setDefectDetailsByDays: function(numOfDays) {
				ISEUtils.portletBlocking("pageContainer");
			   console.log("number of days duriation ---"+numOfDays);
			    console.log("number of days defectRaisedDatess ---"+defectRaisedDate);
			   var defectRaiseDate = new Date(defectRaisedDate);
			   var myDate = new Date(defectRaisedDate);
				var dayOfMonth = myDate.getDate();
				myDate.setDate(dayOfMonth - numOfDays);
				var isodateformatConv = new Date(myDate.toString());
				var requestObject = new Object();
				requestObject.collectionName = "feature_defect_method_collection";
				requestObject.fromDate = defectRaiseDate.getFullYear()+'-' + (defectRaiseDate.getMonth()+1) + '-'+defectRaiseDate.getDate();
				requestObject.toDate = myDate.getFullYear()+'-' + (myDate.getMonth()+1) + '-'+myDate.getDate();
				requestObject.maxResults = 15;
				ISE.getDefLocalizationBetweenDatesSearch(requestObject, defectsLocalization._callBackDefectLocalization);
		 },
		
		
		_setDefectDetailsByDates: function(defFromdate, deftodate) {
			console.log("defFromdatesss-------"+defFromdate);
			console.log("tcTodateaaa-------"+deftodate);
			var requestObject = new Object();
			requestObject.collectionName = "feature_defect_method_collection";
			requestObject.fromDate = defFromdate;
			requestObject.toDate = deftodate;
			requestObject.maxResults = 15;
			ISE.getDefLocalizationBetweenDatesSearch(requestObject, defectsLocalization._callBackDefectLocalization);
		},
		
		
		
		
		
		_setTestcaseDetailsByDays: function(numOfDays) {
			ISEUtils.portletBlocking("pageContainer");
			console.log("number of days duriation ---"+numOfDays);
			console.log("number of days defectRaisedDatess tcRaisedDate---"+tcRaisedDate);
			var defectDate = new Date(tcRaisedDate);
			var myDate = new Date(tcRaisedDate);
			var dayOfMonth = myDate.getDate();
			myDate.setDate(dayOfMonth - numOfDays);
			var requestObject = new Object();
			requestObject.collectionName = "feature_defect_method_collection";
			requestObject.fromDate = defectDate.getFullYear()+'-' + (defectDate.getMonth()+1) + '-'+defectDate.getDate();
			requestObject.toDate = myDate.getFullYear()+'-' + (myDate.getMonth()+1) + '-'+myDate.getDate();
			requestObject.maxResults = 15;
			ISE.getDefLocalizationBetweenDatesSearch(requestObject, defectsLocalization._callBackDefectLocalizationTest);
				
		},
		
		
		
		_setTestCaseDetailsByDates: function(tcFromdate, tcTodate) {
			console.log("tcFromdate-------"+tcFromdate);
			console.log("tcTodate-------"+tcTodate);
			var requestObject = new Object();
			requestObject.collectionName = "feature_defect_method_collection";
			requestObject.fromDate = tcFromdate;
			requestObject.toDate = tcTodate;
			requestObject.maxResults = 15;
			ISE.getDefLocalizationBetweenDatesSearch(requestObject, defectsLocalization._callBackDefectLocalizationTest);
		}


    };
