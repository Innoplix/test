    var defectsearch = {  

        table: '',
        defectResultsCollection: null,
        defectIndexName: null,
        desktopViewTableColumnCollection: new Array(),
        mobileViewTableColumnCollection: new Array(),
        jsonDataCollection: null,
        jsonRatingCollection: null,
		tabDetailsCollection:null,
        hideTableColumns: new Array(),
        listTableId: new Array(),
        listShownTableId: new Array(),
        listCurrentTableId: new Array(),
        showAdvancedSearchhelp: false,
        searchObj: new Object(),
        projectName: '',
        crIdFileds:new Array(),
        crIDData:new Array(),
        defectIDMapforCRId:'',
        grandChildCrDefectId:'',
         fileDiffCollection: new Array(),
		releaseCollection: new Array(),
		fileDataArray: new Array(),
        searchResultsReceived:false,
        CRIDTitle:'CR_ID',
        CSIDTitle:'CS_ID',
        sourceCollectionResults:[],
         defectFilesCollectionResults:[],
        similarSearchDefectIDInformation:[],
        defLocFileScore:[],
		defectIdSearVal:'',
		columnListDetailsArray:[],
		currentSelectedTabID:'',
		currentSelectedTabIndexName:'',
		noOfEntries:'',
		serachTerm:'',
		isNewSearchTerm:'',
		mainSearchCurrentTab:'0',
		clickedTableRowID:'',
		starRatingNumber:0,
		mainSerachResults:[],
		requestSearchCount:100,
		ratingTargetElement:'',
		currentSubSelectedTabIndexs:'',
		ratingFeedbackmaxLength: 150,
		selectedRatingButton:null,
		defLocFileScore:[],
		defectIdSearVal:'',
		tabname:'similarsearch',
		contextSearchForm:'<div class="form-horizontal" ><div class="form-body"><div class="form-group " id="titleFormGroup"><label class="col-md-3 control-label" id="contextSearchTitle">Title</label><div class="col-md-9"><input type="text" class="form-control "id="contextSearch_searchTitle" title="Enter search string in title,will perform Wildcard Search. E.g:. Test"></div></div><div class="form-group" id="descriptionFormGroup"><label class="col-md-3 control-label" id="contextSearchdescription">Description</label><div class="col-md-9"><textarea id="contextSearch_searchDescription" class="form-control" style="height:95px" title="Enter search string in Description,will perform Wildcard Search. E.g:. Test"></textarea></div></div></div></div>',
		similiarSearchForm:'<form class="form-horizontal"><div class="form-body"><div class="form-group"><label class="col-md-3 control-label" id="similarSearchID"></label><div class="col-md-9"><input type="text" class="form-control " id="searchID" title="Enter DefectID E.g:MN00406852"></div></div><div class="form-group hide" id="titleFormGroup"><label class="col-md-3 control-label" id="similarSearchTitle">Title</label><div class="col-md-9"><input type="text" class="form-control "id="similarSearch_searchTitle" readonly></div></div><div class="form-group hide" id="descriptionFormGroup"><label class="col-md-3 control-label" id="similarSearchDescription">Description</label><div class="col-md-9"><textarea id="similarSearch_searchDescription" class="form-control" readonly></textarea></div></div></div></form>',
		advancedSearchForm:'<div class="form-horizontal"><div class="form-body"> <div class="form-group " id="titleFormGroup"><label class="col-md-3 control-label" id="advancesearch">Search Here</label><div class="col-md-9"><input type="text" class="form-control "id="advancedSearch_searchInput" title="Enter any Wildcard search string contains in DefectID, title (or) description. E.g: *"></div></div><div class="form-group " id="titleFormGroup"><label class="col-md-3 control-label"></label><div class="col-md-2"><a href="javascript:;" onClick="defectsearch.advancedSearchKeyUpFunc()" class="btn btn-xs blue"><i class="icon-magnifier-add" ></i><span id="advancesearchbtn"><label data-localize="language.Search">Search</label></span> </a></div></div></div></div>',
		fileSearchForm:'<div class="form-horizontal"><div class="form-body"> <div class="form-group " id="titleFormGroup"><label class="col-md-3 control-label" data-localize="language.File Name">File Name:</label><div class="col-md-9"><input type="text" id="defectsearch_filesearchInput" class="form-control " size="100" title="Enter partial file name (or) full filename as search string in fileslist. E.g: vobs"></input>&nbsp;&nbsp;&nbsp;<a style="float: left;margin-top: 10px;" data-target="#defectsearch_filediffmodal" data-toggle="modal" onClick="defectsearch._fileSearchKeyUpFunc()" class="btn btn-xs blue"><i class="icon-magnifier-add"></i> <label data-localize="language.Search">Search</label> </a></div></div></div></div>',
		deploymenttype:'',
		graphsQueryStr:'',
		testExcefileReleaseArr: new Array(),
    reinit: function() {
        defectsearch._onBackForwardButton();
    },

        /* Init function  */
        init: function() {

            if (!jQuery().dataTable) {
                return;
            }
            
            
            defectsearch.projectName = localStorage.getItem('projectName');

            //console.log(defectsearch.projectName);

            defectsearch.searchObj = new Object();
            defectsearch.searchObj.type = "similar";
            defectsearch.searchObj.input = "";
            defectsearch.searchObj.input2 = "";
            defectsearch.searchObj.filter = [];
            defectsearch.searchObj.indexes = [];
			defectsearch.initSearchTabs();
            defectsearch._filterSearchPortletHeaderDropDown();
            defectsearch.initLocalization();
      
            //$('#advancedSearch_searchInput').on('keyup', defectsearch._advancedSearchKeyUpFunc);          

            window.onpopstate = defectsearch._onBackForwardButton;
            setTimeout(defectsearch._onBackForwardButton, 500);
            //SURESH
                window.addEventListener("message", function(event) {
              // We only accept messages from ourselves
                    if (event.source != window)
                        return;

                    if (event.data.type && (event.data.type == "FROM_PLUGIN")) {
                        console.log("Content script received: " + event.data.text.title);
                        ISEUtils.portletBlocking("pageContainer");

                        var searchIndexTypes = defectsearch._getSearchIndexTypes();
                        
                        defectsearch.searchObj.type = "context";
                        defectsearch.searchObj.input = event.data.text.title;
                        defectsearch.searchObj.input2 = event.data.text.desc;
                        defectsearch.searchObj.indexes = searchIndexTypes;
                        window.location.hash="#defectsearch";
                        defectsearch._processSearchRequest(false, true);
                    }
                }, false);
            //SURESH


            defectsearch.onLoadAdvancedFilter();


             /* $('#mainSearchTypeTabs  li a').click(function dropdown(event) {

               var tabIndex = $(this).parent('li').index();

               if(tabIndex<=2 && defectsearch.searchResultsReceived == true)
                 $('#searchResultsTable').removeClass("hide");
                else
                 $('#searchResultsTable').addClass("hide");   


               
            }); */
			$('.mobile-more-opt-conatainer .mobile-more-opt-btn').click(function(e) {
					if($('.serach-result-filters-container').hasClass('hidden-xs'))
						$('.serach-result-filters-container').removeClass('hidden-xs hidden-sm')
					else
						$('.serach-result-filters-container').addClass('hidden-xs hidden-sm')
			 });
			 
             $("#similarSearch_searchDescription").on("change keyup paste blur", function() {
					console.log(this.value);
					 
					$('.hiddendiv.common').remove();
					var txt = $('#similarSearch_searchDescription'),
					hiddenDiv = $(document.createElement('div')),
					content = null;

					txt.addClass('txtstuff');
					hiddenDiv.addClass('hiddendiv common');

					$('body').append(hiddenDiv);
					
					content = $(this).val();

					content = content.replace(/\n/g, '<br>');
					hiddenDiv.html(content + '<br class="lbr">');
					if(hiddenDiv.outerHeight(true) > 90){
						$(this).css('height', 90);
						$('#similarSearch_searchDescription').attr('title' , $(this).val());
					}else{
						$(this).css('height', hiddenDiv.outerHeight(true));
					}
				});
              if(iseConstants.graphName==""){
			         $("#btnShowDashboard").hide();
		          }

        },
		initSearchTabs: function(){
			    var currentJsonFiles;
		if(iseConstants.languagename==""|| iseConstants.languagename.indexOf("en")>-1)
			 currentJsonFiles="json/defectsearchtabsdetails.json?"
		else
			currentJsonFiles="json/localization/"+iseConstants.languagename+"/defectsearchtabsdetails.json?";
			
            $.getJSON(currentJsonFiles +Date.now(), function(data)  {
				defectsearch.tabDetailsCollection = data;
				defectsearch.createSearchTabs();
			});
		},
		createSearchTabs: function() {
			var tabDetails = defectsearch.tabDetailsCollection[0].defectsearchtabs.tabdetails
			var tabList = "";
			var tabContainer = "";
			if(tabDetails){
				$("#page_defectsearch #mainSearchTypeTabs").empty();
				$("#page_defectsearch #searchTabContainer").empty();
				
				for(var i=0; i<tabDetails.length; i++)
				{
					
					if(tabDetails[i].active == "yes")
					{
						tabList +='<li class="active"><a href="#'+tabDetails[i].tabid+'" data-toggle="tab" tabid="'+i+'" >'+tabDetails[i].labelname+' </a></li>';
						tabContainer += '<div class="tab-pane fade active in" id="'+tabDetails[i].tabid+'">'+defectsearch.createSearchContent(tabDetails[i].label)+'</div>'
						
					}else{
						tabList +='<li><a href="#'+tabDetails[i].tabid+'" data-toggle="tab" tabid="'+i+'" >'+tabDetails[i].labelname+' </a></li>';
						tabContainer += '<div class="tab-pane fade" id="'+tabDetails[i].tabid+'">'+defectsearch.createSearchContent(tabDetails[i].label)+'</div>'
					}
					
					if(tabDetails[i].label == "Similar Search" || tabDetails[i].label == "Context Search" )
						$('#btnLocalizeDefect').removeClass('hide');
					//else
						//$('#btnLocalizeDefect').addClass('hide');
						
				}
				
				$("#page_defectsearch #mainSearchTypeTabs").append(tabList);
				 
				
				$("#page_defectsearch #searchTabContainer").append(tabContainer);
				 
				
				$('#searchID').on('change', defectsearch._similarSearchIdKeyUpFunc);
				$('#contextSearch_searchTitle').on('change', defectsearch._contextSearchKeyUpFunc);
				$('#contextSearch_searchDescription').on('change', defectsearch._contextSearchKeyUpFunc);
				
				$('#mainSearchTypeTabs li a').click(function(e){ 
					var tabIndex = $(this).parent('li').index();
					var tabID = $(this).attr('tabid');
                    $('#searchResultsTable').addClass("hide"); 
					defectsearch.mainSearchCurrentTab = tabID;	
					defectsearch.isNewSearchTerm = false;
					//$('#dataTablePageChange select').prop('selectedIndex',0);
					$('#filter_global input.global_filter').val('');
                  if(tabID == 0){
				  defectsearch.tabname = 'similarsearch';
				  $('#btnLocalizeDefect').removeClass('hide'); 
					defectsearch._getDataStoredDSearchedData(tabID);
					$('#searchResultsTable .portlet-title .caption').html('Search Results of Similar Search'); 
                  }else if(tabID == 1){
				   defectsearch.tabname = 'contextsearch';
					$('#btnLocalizeDefect').removeClass('hide'); 
			
					$('#searchResultsTable .portlet-title .caption').html('<label data-localize="language.Search Results of Context Search">Search Results of Context Search</label>'); 
					defectsearch._getDataStoredDSearchedData(tabID);
					
					
                  }else if(tabID == 2){
					$('#btnLocalizeDefect').addClass('hide');
					
					$('#searchResultsTable .portlet-title .caption').html('<label data-localize="language.Search Results of Advanced Search">Search Results of Advanced Search</label>'); 
					defectsearch._getDataStoredDSearchedData(tabID);
                  }
                  else {
					$('#btnLocalizeDefect').addClass('hide');  
					$('#searchResultsTable .portlet-title .caption').html('<label data-localize="language.Search Results of File Search">Search Results of File Search</label>');                   
				   defectsearch._fileSearchKeyUpFunc();
					
                  }

                
               });
			}
			
		},
		createSearchContent: function(tab_name){
			switch(tab_name) {
				case 'Similar Search':
					 return defectsearch.similiarSearchForm;
					break;
				case 'File Search':
					 return defectsearch.fileSearchForm;
					break;
				case 'Advanced Search':
					 return defectsearch.advancedSearchForm;
					break;
				case 'Context Search':
					 return defectsearch.contextSearchForm;
					break;	
			}
		},
		
		_getDataStoredDSearchedData:function(tab_id){
			 var currentSerachResultID = defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID).indexes
					 var dataFound = false;
					for(i=0; i<defectsearch.mainSerachResults.length; i++){
						if( defectsearch.mainSerachResults[i].currentMainTabID == defectsearch.mainSearchCurrentTab ){
							for(var j in defectsearch.mainSerachResults[i].data)
								if(defectsearch.mainSerachResults[i].data[j] ==  currentSerachResultID){
									 dataFound = true;
									defectsearch._receivedSearchResults(defectsearch.mainSerachResults[i].data.dataObj, true);
									break;
								}
							
						}	
					}
					if(dataFound == false){
						if(tab_id == 0)
							defectsearch._similarSearchIdKeyUpFunc();
						else if(tab_id == 1)
							defectsearch._contextSearchKeyUpFunc();
						else if(tab_id == 2)
							defectsearch.advancedSearchKeyUpFunc();
					}
		 },

        onDisplayHeaderElements: function() {

            //   ISEUtils.showReleaseHeaderDropdown();
			console.log("onDisplayHeaderElements-s");
			defectsearch._getfiledata();
			console.log(defectsearch.fileDataArray);
			console.log("onDisplayHeaderElements-e");
			        },
		_getfiledata: function() {
				console.log("_getfiledata-s")
				var searchString = "*";

				var requestObject = new Object();

                requestObject.searchString = searchString;
                //requestObject.projectName = defectsearch.projectName;
				requestObject.projectName = localStorage.getItem('multiProjectName');
                requestObject.maxResults = 50;
                requestObject.collectionName = "defect_files_collection";
                ISE.getFileDiffSearchResults(requestObject, defectsearch._receivedfiledata);
				
				
        },
		
		 _receivedfiledata: function(data) {
			console.log("***************************************************************8");
            console.log(data);
			
			defectsearch.fileDataArray.length =0;
			
			for(i=0;i<data.length;i++) {
				var eachObj = new Object();
				eachObj.fileslist = data[i].fileslist;
				defectsearch.fileDataArray.push(eachObj);
			}
	
			defectsearch.fileDataArray = _.uniq(defectsearch.fileDataArray, function (object) { return object.fileslist; })
			
			console.log("inside receivedfiledata");
			console.log(defectsearch.fileDataArray);
			
			var numbers = new Bloodhound({
			datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.fileslist); },
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			local: defectsearch.fileDataArray
			});
         //defectsearch.fileDataArray
			// initialize the bloodhound suggestion engine
			numbers.initialize();
         
			// instantiate the typeahead UI
			if (Metronic.isRTL()) {
			$('#defectsearch_filesearchInput').attr("dir", "rtl");  
			}
			$('#defectsearch_filesearchInput').typeahead(null, {
			displayKey: 'fileslist',
			hint: (Metronic.isRTL() ? false : true),
			source: numbers.ttAdapter()
			});
		},
        onLoadAdvancedFilter:function(){

            $.ajax({
            url: "searchcomponent.html",
            type: 'HEAD',
            error: function() {
               console.log("Error")
            },
            success: function() {
                // Loading Menu based on Organization and role

                $('#modalBodyElement').load("searchcomponent.html", function() {

                     var jsfilename = "js/subpages/searchcomponent.js";
                    $.getScript(jsfilename,function(){

                        searchcomponent.init();


                     });

                    $("#searchComponentClose").on("click", function (e) {
                           
                           $('#large').modal('hide');

                          console.log(searchcomponent.searchObj)
                        });
                    $("#modalBodyElement").keydown(function(e) {        
                            if (e.keyCode == 27) {
                                window.close();
                                $(".dropdown-menu").hide()
                                //alert(e.keyCode)
                                
                            }
                        });

                    });

                  

                
            }
        });

        },


        _filterSearchPortletHeaderDropDown: function() {

            var roleName = localStorage.getItem('rolename');


            $('#searchFilterDropdown').empty();
            $('#searchResultsTabs').empty();
            $('#resultTabContent').empty();
			 var currentJsonFile;
		if(iseConstants.languagename==""|| iseConstants.languagename.indexOf("en")>-1)
			 currentJsonFile="json/rating.json?"
		else
		   currentJsonFile="json/localization/"+iseConstants.languagename+"/rating.json?";
			$.getJSON(currentJsonFile+Date.now(), function(data) {

                defectsearch.jsonRatingCollection = data;
			});
		
		    var currentJsonFiles;
		if(iseConstants.languagename==""|| iseConstants.languagename.indexOf("en")>-1)
			 currentJsonFiles="json/DynamicTabArray.json?"
		else
		 
			currentJsonFiles="json/localization/"+iseConstants.languagename+"/DynamicTabArray.json?";
			
            $.getJSON(currentJsonFiles +Date.now(), function(data)  {

                defectsearch.jsonDataCollection = data;
                defectsearch.deploymenttype = data.deployment;
                
                
                if(data.commonSearches) {
                    
                    if($('#commonSearch').length == 0) {
                        console.log("Adding one more menu item");
                        $('#searchFilterDropdown').append('<label><input type="checkbox" id="commonSearch" onchange="defectsearch.searchObj.common = this.checked ? this.value : null" value="' + data.commonSearches + '"/><span id="searchincommonlocationtoo">Search in comon location too</span> </label><hr/>');  
                    }
                }
				defectsearch.columnListDetailsArray = [];
                $.each(data.TabArray, function(key, item) {
					$('#similarSearchID').text(item.similarsearchdisplayName);
					$('#similarSearchTitle').text(item.similarSearchTitle);
					$('#similarSearchDescription').text(item.similarSearchDescription);
					$('#contextSearchTitle').text(item.contextsearchtitledisplayName);
					$('#contextSearchdescription').text(item.contextsearchdescriptiondisplayName);
					$('#advancesearch').text(item.advancesearchdisplayName);
					$('#advancesearchbutton').text(item.advancesearchbuttonName);
					$('#filesearch').text(item.filesearchdisplayName);
					$('#filesearchbutton').text(item.filesearchbutton);
					$('#searchincommonlocationtoo').text(item.searchincommonlocationtoo);
					$('#searchincommonlocationtoo').text(item.searchincommonlocationtoo);
                    //  Filter Search List will be added based on role.
                    if (item.enable == "yes") {

                        for (var i = 0; i < item.allowedroles.length; i++) {

                            if (item.allowedroles[i] == roleName) {

                                var sourceName = item.sourceLabel;
                                var displayName = item.displayName;


                                $('#searchFilterDropdown').append('<label><input type="checkbox" onchange = "defectsearch._filterTypeChange(this)" indexCollection=' + item.indexName + ' resultTabInnerContainerID=resultsTab_InnerContainer_' + displayName + ' resultTabID=resultTab_' + displayName + ' checked="true" >' + sourceName + '</label>');
                                $('#searchResultsTabs').append($("<li id=resultTab_" + displayName + " displayName="+ displayName + "><a href=#resultsTab_InnerContainer_" + displayName + " data-toggle='tab'>" + sourceName + "</a></li>"))
                                $('#resultTabContent').append("<div class=tab-pane fade  id=resultsTab_InnerContainer_" + displayName + "></div>");

								defectsearch.currentSelectedTabID = $("#searchResultsTabs li").first().attr("displayName");
                                var columnToggler = "<div class='btn-group pull-right hidden-sm hidden-xs'  ><a class=btn default href=javascript:; data-toggle=dropdown>Columns <i class=fa fa-angle-down></i></a>";
                                columnToggler += "<div id=columnToggler_" + displayName + " class=dropdown-menu hold-on-click dropdown-checkboxes pull-right></div></div>";
                               // $('#resultsTab_InnerContainer_' + displayName).append(columnToggler);





                                $('#resultsTab_InnerContainer_' + displayName).append("<div class=table-scrollable><table class='table table-striped table-bordered table-hover dataTable ' id=sample_4_" + displayName + "></table></div>")
                                $('#sample_4_' + displayName).append("<thead><tr id=tableheader_" + displayName + "></tr></thead><tbody id=tablebody_" + displayName + "></tbody>");

                                defectsearch.listTableId.push('sample_4_' + displayName);

                                // Set Table Heading for all columns

                                // Empty column name for first column
                                $('#tableheader_' + displayName).append("<th></th>");

                                for (var j = 0; j < item.Details.fields.length; j++) {                                

                                    if(item.Details.fields[j].displayType != "expansion")
                                    $('#tableheader_' + displayName).append("<th class='sorting ISEcompactAuto'>" + item.Details.fields[j].displayName + "</th>");
                                }
								//Star Rating Column at last
								//$('#tableheader_' + displayName).append("<th class='rating-heading'>Rate</th>");
                               // console.log($('#tableheader_' + displayName))
								
                                var dropDownBoxId = "columnToggler_" + displayName;
                                var tableID = 'sample_4_' + displayName;
								var _obj = new Object();
								_obj.dropDownBoxId = 'columnTogglerDropdown';//dropDownBoxId;
								_obj.tableID = tableID;
								_obj.defaultView = item.defaultView;
								_obj.itemDetailsfields = item.Details.fields;
								_obj.indexes = item.indexName;
								_obj.displayName = displayName;
								
								defectsearch.columnListDetailsArray.push(_obj);
							    //defectsearch._fillColumnListinDropdown(dropDownBoxId, tableID, item.defaultView, item.Details.fields);

                                defectsearch.mobileViewTableColumnCollection.push({
                                    "tableID": 'sample_4_' + displayName,
                                    "columnsList": item.mobileView,
                                    "dropdownID": 'columnToggler_' + displayName
                                });
                            }
                        }
						  
                    }
						
						 
                });
				
				$('#dataTablePageChange select').prop('selectedIndex',0);
				$('#page_defectsearch #searchResultsTabs li').on ('click', defectsearch._resultTabClickEventHandler);
				$('#filter_global input.global_filter').on ('keyup', defectsearch._filterGlobal);
				//$("#starRatingTable a.dropdown-toggle").on('click', defectsearch._renderRatingPopupData);
				var getCurrentSelectedTabData = defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID)
				 defectsearch._fillColumnListinDropdown(getCurrentSelectedTabData.dropDownBoxId, getCurrentSelectedTabData.tableID, getCurrentSelectedTabData.defaultView, getCurrentSelectedTabData.itemDetailsfields);
				var elements = document.querySelectorAll('#searchFilterDropdown label input:checked');
               Array.prototype.map.call(elements, function(el, i) {
                if(i>0)
                {
                 //$(el).removeAttr("checked");
                 var resultsTabId = $(el).attr("resultTabID");
                 var resultsTabInnerContainerID = $(el).attr("resultTabInnerContainerID");
                // $("#" + resultsTabId).addClass("hide");
                 //$("#" + resultsTabInnerContainerID).removeClass("active in");
                }               
            }); 

                // Set Intial Active Tab
                defectsearch._setInitialActiveTab();

            });
        },
		
		_resultTabClickEventHandler:function() { 
			//alert($(this).find("span.t").text());
			//$('#dataTablePageChange select').prop('selectedIndex',0);
			$('#filter_global input.global_filter').val('');
			defectsearch.currentSelectedTabID = $(this).attr('displayName');
			var getCurrentSelectedTabData = defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID);
			defectsearch.currentSubSelectedTabIndexs = getCurrentSelectedTabData.indexes;
			var tableBodyContent = $('#'+getCurrentSelectedTabData.tableID+ ' tbody').children().length;
			//if(  ){
				
				//defectsearch.isNewSearchTerm = false;
				//defectsearch.advancedSearchKeyUpFunc();
				if((defectsearch.mainSearchCurrentTab == 0) && (defectsearch.isNewSearchTerm  || (tableBodyContent <= 0) || ( tableBodyContent == 1))){
                     defectsearch._similarSearchIdKeyUpFunc('from _resultTabClickEventHandler');
					  //$('#btnLocalizeDefect').removeClass('hide');    
					
                  }else if((defectsearch.mainSearchCurrentTab == 1) && (defectsearch.isNewSearchTerm  || (tableBodyContent <= 0) || ( tableBodyContent == 1))){

                     defectsearch._contextSearchKeyUpFunc();

                  }else if((defectsearch.mainSearchCurrentTab == 2) && (defectsearch.isNewSearchTerm  || (tableBodyContent <= 0) || ( tableBodyContent == 1))){
					defectsearch.advancedSearchKeyUpFunc();

                  }
                  else if( (tableBodyContent <= 0) || ( tableBodyContent == 1)) {
                     defectsearch._fileSearchKeyUpFunc();
                  }
				
			//}
			defectsearch._fillColumnListinDropdown(getCurrentSelectedTabData.dropDownBoxId, getCurrentSelectedTabData.tableID, getCurrentSelectedTabData.defaultView, getCurrentSelectedTabData.itemDetailsfields);
		},
		
	initLocalization:function(){
		var languageName = iseConstants.languagename;
		var pathName = 'json/localization/'+languageName;
		var opts = { language: languageName, pathPrefix: pathName, skipLanguage: "en-US"};
		 opts.callback = function(data, defaultCallback) {
			 
          data.message = "Optional call back works."
          defaultCallback(data);
          defectsearch.localizationCallback(data);
        }
		
		$("[data-localize]").localize("defectsearch", opts);
	
	},
	localizationCallback:function(data){
		console.log("DATA : "+data);
		defectsearch.dataTableLocalizationData = data.defectmanagementdata;
	},
	getLocalizationName:function(name){
		 for(var ss in defectsearch.dataTableLocalizationData){
			if(ss == name)
				return defectsearch.dataTableLocalizationData[ss]
		}
		
	},		
		
		
		_filterGlobal: function () {
			var getCurrentSelectedTabData = defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID);
			
			var oTable = $('#' + getCurrentSelectedTabData.tableID).dataTable();
			var currectSelectedTabel = oTable.DataTable();
			currectSelectedTabel.search(
				$('#filter_global input.global_filter').val(),
				false,
				true
			).draw();
		},
        _setInitialActiveTab: function() {

            var elements = document.querySelectorAll('#searchFilterDropdown label input:checked');
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
		_renderRatingPopupData: function(eve){
			defectsearch.selectedRatingButton = eve.currentTarget;
			defectsearch.starRatingNumber = 0;
			$('#starRatingTable .rate-it-msg').hide();
			var $row = $(this).closest("tr");    // Find the row
			var selectedTableData = $($row).children("td").map(function() {
				return $(this).text();
			}).get();
			// Let's test it out
			defectsearch.clickedTableRowID = $.trim(selectedTableData[1]);
			defectsearch.ratingTargetElement = $(this);
			var targetEle = defectsearch.ratingTargetElement;
			if($(targetEle).attr('aria-expanded') == false || $(targetEle).attr('aria-expanded') == 'false'  || $(targetEle).attr('aria-expanded') == undefined || $(targetEle).attr('aria-expanded') == 'undefined'){
				var ratingformDetails = defectsearch._getRatingFormDetails(defectsearch.projectName);
				var ratingPopupContainer = $(targetEle).next('#starRatingDropdown').find('#starRatingContent');
				$(ratingPopupContainer).empty();
				if(ratingformDetails && ratingPopupContainer){
					if(ratingformDetails.formelements.questionselements){
						var finalFormHTMLData = '<form class="rating-form" action="javascript:;"><div class="form-body">';
						for(var f in ratingformDetails.formelements.questionselements){
							
							 switch(f) {
								case 'singleselect':
									 finalFormHTMLData += defectsearch._createRadiobuttonGroup(ratingformDetails.formelements.questionselements[f]);
									break;
								case 'multiselect':
									 finalFormHTMLData += defectsearch._createCheckBoxbuttonGroup(ratingformDetails.formelements.questionselements[f]);
									break;
								 case 'commentelement':
									 finalFormHTMLData += defectsearch._createCommentGroup(ratingformDetails.formelements.questionselements[f]);
									break;
							}
						}
						
						//Final HTML Data assign
						
						finalFormHTMLData +='</div></form>';
						$(ratingPopupContainer).append(finalFormHTMLData)
					}
				}
			}
			
		},
		//$.notific8('My notification is on the left.', {verticalEdge: 'left'});
		_submitRatingHandler: function(eve){
			var submitTarget = eve.currentTarget;
			var ratingformData = new Object();
			ratingformData.formdetails = $(submitTarget).parent().prev().find('.rating-form').serializeArray();
			ratingformData.starrating = defectsearch.starRatingNumber;
			
			if(ratingformData.formdetails.length > 1 || defectsearch.starRatingNumber > 0 ){
				$('#starRatingTable .rate-it-msg').hide();
				var getCurrentSelectedTabData = defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID)
				var projDetails = new Object();
				projDetails.DisplayName = defectsearch.currentSelectedTabID;
				projDetails.collectionName = getCurrentSelectedTabData.indexes;
				projDetails.defectID = defectsearch.clickedTableRowID;
				var ratingCollectObject = $.extend( true, ratingformData, projDetails );
				//var JSONformData = JSON.stringify(ratingCollectObject);
				var eventName = 'rating';
				ISEUtils.logUsageMetrics(eventName, ratingCollectObject, eventName,defectsearch._logUsageMetricsResultHandler);
				$(defectsearch.ratingTargetElement).attr("aria-expanded","false");
				$(defectsearch.ratingTargetElement).parent().removeClass('open')
			}else{
				$('#starRatingTable .rate-it-msg').show();
				$('#starRatingTable .rate-it-msg').text('Please provide your valuable feedback');
			}
		},
		_cancelRatingHandler: function(eve){
			$(defectsearch.ratingTargetElement).attr("aria-expanded","false");
			$(defectsearch.ratingTargetElement).parent().removeClass('open')
		},
		_countRatingCommentCharHandler: function(e){
			var length = $(this).val().length;
			var length = defectsearch.ratingFeedbackmaxLength-length;
			$('.maxlength-feedback').text(length +' characters remaining (150 max)');
		},
		
		_logUsageMetricsResultHandler: function(data_obj){
			if(data_obj.created == true){
			$.notific8('Feedback has been submitted successfully', {
				 life: 2000,
				 theme: 'lime',
				 sticky: false,
				 zindex: 11500
			});
			$(defectsearch.selectedRatingButton).addClass('disabled');
			$(defectsearch.selectedRatingButton).attr("title", "You already rated");
			}else{
			$.notific8('Sorry, facing some network issue, please try after some time', {
				 life: 2000,
				 theme: 'ruby',
				 sticky: false,
				 zindex: 11500
			});
			}
			
		},
		_getRatingFormDetails: function(project_name){
			var dataFound = false;
			for(var i=0; i<defectsearch.jsonRatingCollection.length; i++){
				if((defectsearch.jsonRatingCollection[i].project).toLowerCase() == (project_name).toLowerCase()){
					dataFound = true;
					return defectsearch.jsonRatingCollection[i]
				}
			}
			if(dataFound == false){
				for(var j=0; j<defectsearch.jsonRatingCollection.length; j++){
					if((defectsearch.jsonRatingCollection[j].project).toLowerCase() == 'default'){
						dataFound = true
						return defectsearch.jsonRatingCollection[j];
					}
				}
			}
			
		},
		_createRadiobuttonGroup: function(form_ele_array){
			if(form_ele_array.length > 0){
				var htmlData = '<div class="form-group"> <div class="radio-list">';
				for(var i=0; i<form_ele_array.length; i++){
					htmlData += '<label><input type="radio" name="ratingRadioOption" id="radio_'+form_ele_array[i].label+'" value="'+form_ele_array[i].label+'">'+ form_ele_array[i].label +'</label>'
				}
				htmlData += '</div></div>';
				return htmlData;
			}							
		},
		
		_createCheckBoxbuttonGroup: function(form_ele_array){
			if(form_ele_array.length > 0){
				var htmlData = '<div class="form-group"> <div class="checkbox-list">';
				for(var i=0; i<form_ele_array.length; i++){
					htmlData += '<label><input type="checkbox" name="ratingCheckOption" id="radio_'+form_ele_array[i].label+'" value="'+form_ele_array[i].label+'">'+ form_ele_array[i].label +'</label>'
				}
				htmlData += '</div></div>';
				return htmlData;
			}	                                             		
		},
		
		_createCommentGroup: function(form_ele_array){
			if(form_ele_array){
				
				var htmlData = '<div id="ratingComment" class="form-group"><label>'+form_ele_array.label+'</label><textarea id="textarearatingChars" maxlength="150" name="comment" class="form-control" rows="3"></textarea><span class="maxlength-feedback maxlength-full">'+defectsearch.getLocalizationName("0 characters remaining (15 max)")+'</span></div>'
				return htmlData;
				
			}	 
				
		}, 

        _fillColumnListinDropdown: function(dropDownBoxId, tableID, defaultColumnView, ColumnsList) {


            $('#' + dropDownBoxId).empty();

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
                       defectsearch.crIdFileds.push(crIdArr[0][j]); 
                  } 
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

            defectsearch.hideTableColumns.push({
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
				var chkVal = $(this).parent().text();
				/* if(bVis)
					defectsearch._insertOrDeleteDefaultTableColValue(chkVal, 'remove');
				else
					defectsearch._insertOrDeleteDefaultTableColValue(chkVal, 'insert'); */
				if(bVis){
                        defectsearch._insertOrDeleteDefaultTableColValue(chkVal, 'remove');
                        defectsearch.hideTableColumns[0]['hideColumnsList'].push((iCol+1));
                       }else{
                 defectsearch._insertOrDeleteDefaultTableColValue(chkVal, 'insert');
                     var index = defectsearch.hideTableColumns[0]['hideColumnsList'].indexOf((iCol+1));

                      if (index > -1) {
                        defectsearch.hideTableColumns[0]['hideColumnsList'].splice(index, 1);
                           }                                                  
				}
				
				var table_wrapper = $('#' + tableID+'_wrapper')
				if( table_wrapper.width() > oTable.width() )
				{
					table_wrapper.css('overflow-x', 'visible')
				}else{
					table_wrapper.css('overflow-x', 'none')
				}
				
				defectsearch._resizeRateitColumnHeading();
            });
			$( "#dataTablePageChange select" ).on('change', function() {
				var getCurrentSelectedTabData = defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID);
				$('#' + getCurrentSelectedTabData.tableID).dataTable().DataTable().page.len(parseInt($( this ).val())).draw();  
			});

        },
		
		_insertOrDeleteDefaultTableColValue:function(chkVal, action){
			for(var i=0; i<defectsearch.columnListDetailsArray.length; i++){
				if(defectsearch.currentSelectedTabID == defectsearch.columnListDetailsArray[i].displayName){
				 if(action=='insert'){
					defectsearch.columnListDetailsArray[i].defaultView.push(chkVal);
				 }else if(action=='remove'){
					var k = defectsearch.columnListDetailsArray[i].defaultView.indexOf(chkVal);
					if(k != -1) {
						defectsearch.columnListDetailsArray[i].defaultView.splice(k, 1);
					}
				 }
				 defectsearch.columnListDetailsArray[i].defaultView = defectsearch._uniqueArray(defectsearch.columnListDetailsArray[i].defaultView);
				}
			}
			
			 
		},
		_resizeRateitColumnHeading:function(){
			$.fn.textWidth = function(text, font) {
				if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
				$.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
				return $.fn.textWidth.fakeEl.width();
			};
			$('.rating-heading').first().css('width',$('.rating-heading').first().textWidth());	
		},

        _filterTypeChange: function(event) {

            var resultsTabId = $(event).attr("resultTabID");
            var resultsTabInnerContainerID = $(event).attr("resultTabInnerContainerID");

            if (!$(event).is(':checked')) {

                $("#" + resultsTabId).addClass("hide");
                $("#" + resultsTabId).removeClass("active");
				if(resultsTabId == "resultTab_Defects"){
					//$("#" + sample_4_Defects_wrapper).addClass("hide");
					$('#resultsTab_InnerContainer_Defects').removeClass('active');
				}
				else if(resultsTabId == "resultTab_TestCase"){
					$('#resultsTab_InnerContainer_TestCase').removeClass("active");
				}
				else if(resultsTabId == "resultTab_SourceCode"){
					$('#resultsTab_InnerContainer_SourceCode').removeClass("active");
				}
				else if(resultsTabId == "resultTab_ComcastSupport"){
					$('#resultsTab_InnerContainer_ComcastSupport').removeClass("active");
				}
				
               // $("#" + resultsTabInnerContainerID).removeClass("active in");

            } else {
                $("#" + resultsTabId).removeClass("hide");
               //$("#" + resultsTabInnerContainerID).addClass("active in");
            }
			//$('#searchResultsTabs li').first().addClass('active');
			//$('#resultTabContent .tab-pane').first().addClass('active');
			var getCurrentSelectedTabData = defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID)
			defectsearch._fillColumnListinDropdown(getCurrentSelectedTabData.dropDownBoxId, getCurrentSelectedTabData.tableID, getCurrentSelectedTabData.defaultView, getCurrentSelectedTabData.itemDetailsfields);

        },


        /**
         * Send Defect search id to service
         * @_similarSearchIdKeyUpFunc function
         */
       _similarSearchIdKeyUpFunc: function(fromid) {
            if ($('#searchID').val().length >= 1) {

                Pace.start();
				
				$('#searchResultsTable .portlet-title .caption').html('<label data-localize="language.Search Results of Similar Search" >Search Results of Similar Search </label>');
				defectsearch.initLocalization();
				if(defectsearch.serachTerm != $('#searchID').val() && typeof(fromid) == 'object'){
					defectsearch.serachTerm = $('#searchID').val();
					defectsearch.isNewSearchTerm = true;
				}else{
					defectsearch.isNewSearchTerm = false;
				}

                ISEUtils.portletBlocking("pageContainer");
                var defectId = escape($('#searchID').val().trim());
                var searchIndexTypes = defectsearch._getSearchIndexTypes();

				//fix for bug Id : 2364 - CR search doesn't show results -- START
               	var defectidVal ="";
                console.log("***********************length" + defectId.length);
				/* if (defectId.length < 6) { 
					defectidVal ="000"+defectId; 
				} else if (defectId.length < 7) { 
					defectidVal ="00"+defectId; 
				} else if (defectId.length < 8) { 
					defectidVal ="0"+defectId; 
				}   else 
				{
					defectidVal = defectId; 
				} */
               	//fix for bug Id : 2364 - CR search doesn't show results -- END
               	
                defectsearch.searchObj.type = "similar";
                // defectsearch.searchObj.input = defectidVal;
				defectsearch.searchObj.input = defectId;
                defectsearch.searchObj.input2 = "";
                defectsearch.searchObj.indexes =  defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID).indexes;
                defectsearch._processSearchRequest(true, false);

            }
        },


        /**
         * Received Title and Description from service
         * @_receivedDefectDetailsByID function
         * @param {data} Response Object    
         */
        _receivedTitleDesDetailsByID: function(data) {



            //SURESH - Usage
            var usageData = new Object();
            usageData.searchIdInput = escape($('#searchID').val().trim());
            usageData.resultId = "";
            usageData.resultsCount = 0;
            if (data && data.length > 0) {
                usageData.resultId = data[0]._id;
                usageData.resultsCount = data.length;
                usageData.source = data[0]._index;
            }
            var serachType = "similarSearch";
            if ($('#mainSearchTypeTabs').find('.active a').attr('tabid') == "1")
                serachType = "conextsearch";
            if ($('#mainSearchTypeTabs').find('.active a').attr('tabid') == "2")
                serachType = "advancedsearch";

            ISEUtils.logUsageMetrics(serachType, usageData);
            //SURESH - Usage
			for (var i = 0; i < data.length; i++) {
                var title = data[i].title;
				var description = "";
				if(data[i].description != null)
					description = data[i].description.replace(/.\t/g,". ");
                $('#similarSearch_searchTitle').val(title);
				$('#similarSearch_searchDescription').val(description);
				//var offset = $('#similarSearch_searchDescription').offsetHeight - $('#similarSearch_searchDescription').clientHeight;
				//$('#similarSearch_searchDescription').autoResize();
			//$( "#similarSearch_searchDescription" ).trigger( "change" );
			}
			
			$( "#similarSearch_searchDescription" ).trigger( "change" );
			if(title)
            $('#titleFormGroup').removeClass('hide');
			if(description)
            $('#descriptionFormGroup').removeClass('hide');


            var searchIndexTypes = defectsearch._getSearchIndexTypes();




            var requestObject = new Object();

            requestObject.title = $('#similarSearch_searchTitle').val().replace(/\//g, " ");
            //requestObject.searchString = requestObject.title + ' ' + $('#similarSearch_searchDescription').val().replace(/\//g, " ");
			requestObject.searchString = $('#similarSearch_searchDescription').val().replace(/\//g, " ");
            //requestObject.projectName = defectsearch.projectName;
			requestObject.projectName = localStorage.getItem('multiProjectName');
            requestObject.maxResults = defectsearch.requestSearchCount;
            requestObject.filterString = defectsearch._getFiltersAsString();
            requestObject.serachType = "conextsearch";



           // for (var i = 0; i < searchIndexTypes.length; i++) {
			    var collectionName = defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID).indexes
                requestObject.collectionName = collectionName;
                requestObject.filterString = defectsearch._getAdditionalFilters(collectionName,requestObject);
                ISE.getSearchResults(requestObject, defectsearch._receivedSearchResults);

           // }
			if(collectionName == 'defect_collection')
			{
            defectsearch.similarSearchDefectIDInformation = new Array();
            defectsearch.similarSearchDefectIDInformation = data;
			}
        },

        _contextSearchKeyUpFunc: function(fromid) {


            if ($('#contextSearch_searchTitle').val().length >= 1 || $('#contextSearch_searchDescription').val().length >=1) {

                 Pace.start();
				 $('#searchResultsTable .portlet-title .caption').html('<label data-localize="language.Search Results of Context Search">Search Results of Context Search</label>'); 
				 defectsearch.initLocalization();
				if(defectsearch.serachTerm != $('#contextSearch_searchTitle').val() && typeof(fromid) == 'object'){
					defectsearch.serachTerm = $('#contextSearch_searchTitle').val();
					defectsearch.isNewSearchTerm = true;
				}else{
					defectsearch.isNewSearchTerm = false;
				}
				
                ISEUtils.portletBlocking("pageContainer");

                  // $('#btnLocalizeDefect').addClass('hide');     


                var searchIndexTypes = defectsearch._getSearchIndexTypes();

                defectsearch.searchObj.type = "context";
                defectsearch.searchObj.input = $('#contextSearch_searchTitle').val();
                defectsearch.searchObj.input2 = $('#contextSearch_searchDescription').val();
                defectsearch.searchObj.indexes = searchIndexTypes;
                defectsearch._processSearchRequest(true, false);



            }

        },

        advancedSearchKeyUpFunc: function(fromid) {
	
			
			var flag = defectsearch.showAdvancedSearchhelp;
			console.log("IN advancedSearchKeyUpFunc function with flagg as - "+flag);
            if (flag) {
                $('#helpPortlet').addClass('hide');
                defectsearch.showAdvancedSearchhelp = false;
            }
			if(defectsearch.serachTerm != $('#advancedSearch_searchInput').val() && typeof(fromid) == 'object'){
				defectsearch.serachTerm = $('#advancedSearch_searchInput').val();
				defectsearch.isNewSearchTerm = true;
			}else{
				defectsearch.isNewSearchTerm = false;
			}
			//$('#page_defectsearch #searchResultsTabs li').on ('click', defectsearch._resultTabClickEventHandler);
			//$('#filter_global input.global_filter').on ('keyup', defectsearch._filterGlobal);
			
            if ($('#advancedSearch_searchInput').val().length >= 1) {
				 
				
                  Pace.start();
				$('#searchResultsTable .portlet-title .caption').html('<label data-localize="language.Search Results of Advanced Search">Search Results of Advanced Search</label>'); 
				defectsearch.initLocalization();
                ISEUtils.portletBlocking("pageContainer");
                  $('#btnLocalizeDefect').addClass('hide');      

                var searchIndexTypes = defectsearch._getSearchIndexTypes();

                defectsearch.searchObj.type = "advanced";
                defectsearch.searchObj.input = '';
                defectsearch.searchObj.input2 = $('#advancedSearch_searchInput').val();
                defectsearch.searchObj.indexes = defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID).indexes;
                defectsearch._processSearchRequest(true, false);
            }
			defectsearch.initLocalization();
        },

        _getParams: function _getParams(url) {
            var regex = /[?&]([^=#]+)=([^&#]*)/g,
                params = {},
                match;
            while (match = regex.exec(url)) {
                params[match[1]] = match[2];
            }
            return params;
        },

        _onBackForwardButton: function onBackForwardButton(event) {

            if (window.location.hash == '#defectsearch') {
                var p = defectsearch._getParams(window.location.search);
                if(p.gQuery != null) {
                    ISEUtils.portletBlocking("pageContainer");

                    var searchIndexTypes = defectsearch._getSearchIndexTypes();

                    defectsearch.searchObj.type = "context";
                    defectsearch.searchObj.input = decodeURIComponent(p.gQuery);
                    defectsearch.searchObj.input2 = "";
					//Start: Suresh bugid-2804
					if(p.gQueryD != null)
						defectsearch.searchObj.input2 = decodeURIComponent(p.gQueryD);
					//End: Suresh
					
                    defectsearch.searchObj.indexes = searchIndexTypes;
                    defectsearch._processSearchRequest(false, true);
                }
                else if (p.SearchObj != null) {
                    defectsearch.searchObj = JSON.parse(decodeURIComponent(p.SearchObj));
                    defectsearch._processSearchRequest(false, true);
                }
            }
        },

        _encodeSpecialText: function(key, value) {
            if (typeof value === "string") {
                return encodeURIComponent(value);
            }
            return value;
        },
        _updateURL: function() {
            var s = JSON.stringify(defectsearch.searchObj, defectsearch._encodeSpecialText);
            var newURL = window.location.protocol + "//" + window.location.host;
            newURL = newURL + window.location.pathname + "?SearchObj=" + s + "#defectsearch";
            history.pushState("test", "test", newURL);
        },

        _processSearchRequest: function(updateURL, updateDisplay) {
		    String.prototype.replaceAll = function(target, replacement) {
				return this.split(target).join(replacement);
			};
            console.log('~~~~~ _processSearchRequest  ~~~~~ ');
            //SIMY - added on 15-OCT-2015
            if( defectsearch.searchObj.lastSearch) {
                if ( (Date.now() - defectsearch.searchObj.lastSearch) < 1500) {
                    console.log("Trying to search within 1.5 seconds again, there is some bug in your code !! performing no search");
                    return;
                }
            }
            defectsearch.searchObj.lastSearch = Date.now();
            
            //SIMY:local
            var projectName = localStorage.getItem('projectName');
            if( defectsearch.searchObj.common != null) {
                projectName += ","+defectsearch.searchObj.common;
            }
            
			$('#page_defectsearch #searchResultsTabs li').each(function (index, value) { 
			  console.log('#page_defectsearch #searchResultsTabs ' + index + ':' + $(this).attr('displayname')); 
			  if(!$(this).hasClass('hide') ){
					defectsearch.listShownTableId.push(defectsearch._getSelectedIndexName($(this).attr('displayname')).tableID);
			  }
			 /* if($(this).hasClass('active') ){
					defectsearch.listCurrentTableId.push(defectsearch._getSelectedIndexName($(this).attr('displayname')).tableID);
			  }*/
			  defectsearch.listShownTableId = defectsearch._uniqueArray(defectsearch.listShownTableId);
			  
			});
			defectsearch.listCurrentTableId = [];
			defectsearch.listCurrentTableId.push(defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID).tableID );
			defectsearch.listCurrentTableId = defectsearch._uniqueArray(defectsearch.listCurrentTableId);
			if(defectsearch.isNewSearchTerm){
				for (var i = 0; i < defectsearch.listShownTableId.length; i++) {

					var oTable = $('#' + defectsearch.listShownTableId[i]).dataTable();
					oTable.fnClearTable();

				}
			}

            if (updateURL) {
                defectsearch._updateURL();
            }

            if (updateDisplay) {
                defectsearch._refreshFilterDisplay();
            }

            if (defectsearch.searchObj.type == 'similar') {
                if (updateDisplay) {

                    // populate input boxes with filter,input, input2, indexes

                    $('#mainSearchTypeTabs').find('.active').removeClass('active');
                    $('#tab_1_2').removeClass(" active in");
                    $('#tab_1_3').removeClass(" active in");

                    $('#mainSearchTypeTabs').find('li').eq(0).addClass('active');
                    $('#tab_1_1').addClass(" active in");
                    $('#searchID').val(defectsearch.searchObj.input);


                }

                var requestObject = new Object();
                requestObject.collectionName = defectsearch.searchObj.indexes;
                requestObject.title = defectsearch.searchObj.input2.replace(/\//g, " ");
                //requestObject.searchString = "_id:" + defectsearch.searchObj.input.replace(/\//g, " ");
               // var convUper = defectsearch.searchObj.input.toUpperCase();
				var convUper = defectsearch.searchObj.input;
                requestObject.searchString = "_id:" + convUper.replace(/\//g, " ");
                //requestObject.projectName = projectName;
				requestObject.projectName = localStorage.getItem('multiProjectName');
                requestObject.maxResults = defectsearch.requestSearchCount;

                console.log(defectsearch._getFiltersAsString())

                requestObject.filterString = "";
                if (requestObject.title != "")
                    requestObject.serachType = "conextsearch";
                ISE.getSearchResults(requestObject, defectsearch._receivedTitleDesDetailsByID);

            }
            if (defectsearch.searchObj.type == 'context') {
                if (updateDisplay) {
                    // populate input boxes with filter,input, input2, indexes
                    $('#mainSearchTypeTabs').find('.active').removeClass('active');
                    $('#tab_1_1').removeClass(" active in");
                    $('#tab_1_3').removeClass(" active in");

                    $('#mainSearchTypeTabs').find('li').eq(1).addClass('active');
                    $('#tab_1_2').addClass(" active in");


                    $('#contextSearch_searchTitle').val(defectsearch.searchObj.input);
                    $('#contextSearch_searchDescription').val(defectsearch.searchObj.input2);
                }

                var requestObject = new Object();

                requestObject.title = defectsearch.searchObj.input.replace(/\//g, " ");
                //requestObject.searchString = requestObject.title + ' ' + defectsearch.searchObj.input2.replace(/\//g, " ");
				requestObject.searchString = defectsearch.searchObj.input2.replace(/\//g, " ");
                requestObject.filterString = defectsearch._getFiltersAsString();
                //requestObject.projectName = projectName;
				requestObject.projectName = localStorage.getItem('multiProjectName');
                requestObject.maxResults = defectsearch.requestSearchCount;
                requestObject.serachType = "conextsearch";

                 console.log(defectsearch._getFiltersAsString())
               // for (var i = 0; i < defectsearch.searchObj.indexes.length; i++) {
					var collectionName = defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID).indexes
                    requestObject.collectionName = collectionName;
                    requestObject.filterString = defectsearch._getAdditionalFilters(collectionName,requestObject);
                    ISE.getSearchResults(requestObject, defectsearch._receivedSearchResults);
                //}
            }

            
            if (defectsearch.searchObj.type == 'advanced') {
                if (updateDisplay) {
                    // populate input boxes with filter,input, input2, indexes
                    $('#mainSearchTypeTabs').find('.active').removeClass('active');
                    $('#tab_1_1').removeClass(" active in");
                    $('#tab_1_2').removeClass(" active in");

                    $('#mainSearchTypeTabs').find('li').eq(2).addClass('active');
                    $('#tab_1_3').addClass(" active in");

                    $('#advancedSearch_searchInput').val(defectsearch.searchObj.input2);
                }              

				var requestObject1 = new Object();
				requestObject1.searchString = "";								
				requestObject1.filterString = defectsearch._getFiltersAsString();					
				requestObject1.projectName = projectName;
				requestObject1.maxResults = 100;				
				var collectionName = defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID).indexes
				requestObject1.collectionName =  collectionName; //defectsearch.searchObj.indexes[i];
				requestObject1.filterString = defectsearch._getAdditionalFilters(collectionName,requestObject1);
				var qryString = defectsearch.searchObj.input2.replace(/\//g, " ").trim();
				qryString=qryString.trim();
				
				if(qryString.indexOf(" AND ") != -1){	
					
					var andSplitWord = "";
					var orSplitWord = "";
					var orWord = "";
					var andWord = "";
					var andSplit = "";
					andSplit = qryString.split(" AND ");
					if(andSplit.length > 0){
						
						for(var i=0;i<andSplit.length;i++){
								var orSplit = "";
								if(andSplit[i].indexOf(" OR ") != -1){
								orSplit = andSplit[i].split(" OR ");								
									for(var k=0;k<orSplit.length;k++){	
										var tempOrWord = "";									
										tempOrWord = orSplit[k].trim();										
										tempOrWord = tempOrWord.replaceAll(" ", '\\ ');	
										tempOrWord = tempOrWord.replaceAll('\"', '\"');										
										orWord+= tempOrWord+" OR ";									
									}
									orWord=orWord.slice(0,-4).trim();								
								}else{
									var tempAndWord = "";
									tempAndWord = andSplit[i].trim();									
									tempAndWord = tempAndWord.replaceAll(" ", '\\ ');
									tempAndWord = tempAndWord.replaceAll('\"', '\"');									
									andWord+= tempAndWord+" AND ";
								}								
						}
						if(orWord == ""){
							andWord=andWord.slice(0,-5).trim();
							andSplitWord = andWord;
						}
						else{
							andWord=andWord.slice(0,-5).trim();
							andSplitWord = orWord+" AND "+andWord;
						}					
					requestObject1.searchString = andSplitWord;
					ISE.getSearchResults(requestObject1, defectsearch._receivedSearchResults);	
					}							
				}
				else if(qryString.indexOf(" OR ") != -1){
					var orSplitWord = "";
					var tempOrWord = "";
					orWord="";
						orSplitWord = qryString.split(" OR ");						
							for(var i=0;i<orSplitWord.length;i++){	
								tempOrWord = "";
								tempOrWord = orSplitWord[i].trim();
								tempOrWord = tempOrWord.replaceAll(" ", '\\ ');
								orWord+= tempOrWord+" OR ";										
							}
					orWord=orWord.slice(0,-4).trim();
					requestObject1.searchString = orWord;
					ISE.getSearchResults(requestObject1, defectsearch._receivedSearchResults);						
				}		
				else{
						var inputString = defectsearch.searchObj.input2.trim();
						inputString = inputString.replaceAll(" ", '\\ ');
						requestObject1.searchString = inputString;										
						ISE.getSearchResults(requestObject1, defectsearch._receivedSearchResults);					
					}
            }

        },
        
        _AdvancedSearchResults: function(data){
			console.log("data********"+data);
			var crArry = [];
			for(var q = 0; q<data.length;q++){
				var id = data[q]._id.split('.');
				if(id.length == 1){ 
				crArry.push(data[q]);
				}
			}
			defectsearch._receivedSearchResults(crArry);
		},


        _getSearchIndexTypes: function() {

            var elements = document.querySelectorAll('#searchFilterDropdown label input:checked');
            var selectedFilterTypeArray = Array.prototype.map.call(elements, function(el, i) {
                return $(el).attr("indexCollection")
            });


            var searchIndexes = {};

            for (var i = 0; i < selectedFilterTypeArray.length; i++) {
                if( selectedFilterTypeArray[i] != null ) { searchIndexes[selectedFilterTypeArray[i]]=1 ;}
            }

            return Object.keys(searchIndexes); //SIMY: Sending unique list
        },

        _applyFilterSearchRequest: function(searchIndexes, seacrhTitle, searchString, filters) {


            var requestObject = new Object();
            requestObject.collectionName = searchIndexes
            requestObject.title = seacrhTitle.replace(/\//g, " ");
            requestObject.searchString = searchString.replace(/\//g, " ");
            requestObject.filterString = filters;
            //requestObject.projectName = defectsearch.projectName;
			requestObject.projectName = localStorage.getItem('multiProjectName');
            requestObject.maxResults = 25;
            if ($('#mainSearchTypeTabs').find('.active a').attr('tabid') != "2")
                requestObject.serachType = "conextsearch";
            ISE.getSearchResults(requestObject, defectsearch._receivedSearchResults);
        },
		_storeResultMainTabData: function (dataObj){
			
			var _obj = new Object();
			_obj.currentMainTabID = defectsearch.mainSearchCurrentTab;
			
			var __obj = new Object()
			if(dataObj && dataObj[0])
				__obj.searchIndexName = dataObj[0]._index 
			else
				__obj.searchIndexName = defectsearch.currentSubSelectedTabIndexs;
			__obj.currentMainTabID = defectsearch.mainSearchCurrentTab;
			__obj.dataObj = dataObj;
			_obj.data = __obj;
			
			var dataFound = false;
			var currentSerachResultID = defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID).indexes
			for(i=0; i<defectsearch.mainSerachResults.length; i++){
				if( defectsearch.mainSerachResults[i].currentMainTabID == defectsearch.mainSearchCurrentTab ){
					for(var j in defectsearch.mainSerachResults[i].data)
						if(defectsearch.mainSerachResults[i].data[j] ==  currentSerachResultID){
							dataFound = true;
							defectsearch.mainSerachResults[i] = _obj;
							break;
						}
					
				}
				
			}
			if(dataFound == false){
				defectsearch.mainSerachResults.push(_obj);
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

        /**
         * Received Defect Search Table data from server
         * @_receivedSearchResults function
         * @param {dataObj} Response Object    
         */
          _receivedSearchResults: function(dataObj, is_old_data) {
		    //dataObj = JSON.parse(JSON.stringify(dataObj).replaceAll("<","")replaceAll(">",""))
			defectsearch._storeResultMainTabData(dataObj);
			defectsearch.graphsQueryStr='';
		   for(var i=0;i<dataObj.length;i++){
		    
			 queryStrId ="\"" + dataObj[i]['_id'] + "\"";
			 if(i != dataObj.length-1) {
					 defectsearch.graphsQueryStr += "defect_id:"+queryStrId+" OR "
				} else {
					 defectsearch.graphsQueryStr += "defect_id:"+queryStrId;
				}
		     }
			 console.log(defectsearch.graphsQueryStr)
			var defectId = escape($('#searchID').val().trim());
            if (ISEUtils.validateObject(dataObj)) {
                //SURESH - Usage
                $('#searchResultsTable').show();  
                $('#noDataDisplay').removeClass("show"); 
                $('#noDataDisplay').addClass("hide");
                var usageData = new Object();
                usageData.searchIdInput = escape($('#searchID').val().trim()); //needs to be modified for context and advanced
                usageData.resultsCount = 0;
                usageData.filters = defectsearch._getFiltersAsString();
                if (dataObj && dataObj.length > 0) {
                    usageData.resultId = dataObj[0]._id;
                    usageData.resultsCount = dataObj.length;
                    usageData.source = dataObj[0]._index;
                } else {
                    return; // SIMY 
                }
                if(defectsearch.deploymenttype == 'ALU'){
                var sliceVal = "";
				var testExcInfo = "testcaseid:";
				for(var m=0;m<dataObj.length;m++){
					testExcInfo = testExcInfo +'"'+dataObj[m]._id.trim();
					sliceVal = testExcInfo.slice(0,-11).trim();
				}
				var finaQry = sliceVal.trim();
				console.log("testcase--Qry"+finaQry);
				var requestObject = new Object();
				requestObject.searchString = finaQry;
                requestObject.projectName = defectsearch.projectName;
                requestObject.maxResults = 2500;
                requestObject.collectionName = "test_executions_collection";
				ISE.getTestExceResults(requestObject, defectsearch._receivedTestExceResultsForRelease);
                }
                var eventName = "similarSearchResults"; //this can be taken from active tabid.
                ISEUtils.logUsageMetrics(eventName, usageData);
                //console.log(dataObj);
                //SURESH - Usage

                var FieldsMap = {};
                var DisplayNameMap = {};
                var displayColumns = {};
                var tC = {};

             
                for (var K in defectsearch.jsonDataCollection.TabArray) {

                      
                     var temp = new Array();
                     for(var l=0;l<defectsearch.jsonDataCollection.TabArray[K].Details.fields.length;l++){

                       var obj =defectsearch.jsonDataCollection.TabArray[K].Details.fields[l];
                          if(obj.displayType != "expansion")                          
                             temp.push(obj);                         

                     }

                    FieldsMap[defectsearch.jsonDataCollection.TabArray[K].indexName] = temp;
                    DisplayNameMap[defectsearch.jsonDataCollection.TabArray[K].indexName] = defectsearch.jsonDataCollection.TabArray[K].displayName;
                    displayColumns[defectsearch.jsonDataCollection.TabArray[K].indexName] = defectsearch.jsonDataCollection.TabArray[K].defaultView;
                }


                var sortField = 1;
                var fields = FieldsMap[dataObj[0]._index];
                for (var ii = 0; ii < fields.length; ii++) {
                    if (fields[ii].SourceName == 'similarity') sortField = ii + 1;
                }

				var diffValue = 0;
                for (var i = 0; i < dataObj.length; i++) {
                
                var issimilarDefectId = false;

                     if(dataObj[i]._index == "sourcecode_collection")
                     {
						if(i==0)
						{
							 defectsearch.sourceCollectionResults = [];
						}
                        defectsearch.sourceCollectionResults.push(dataObj[i]);
                     }
					  if(dataObj[i]._index == "defect_collection")
                     {
						if(i==0)
						{
							 defectsearch.defectFilesCollectionResults = [];
						}
                        defectsearch.defectFilesCollectionResults.push(dataObj[i]);
						
                     }

                    var fields = FieldsMap[dataObj[i]._index];
                    var dName = DisplayNameMap[dataObj[i]._index];
                    var tableID = '#sample_4_' + dName;
                    if (!tC[tableID]) {

                        var oTable = $(tableID).dataTable();
                        oTable.fnClearTable();
                        oTable.fnDestroy();
                    }
                    tC[tableID] = 1;

					var  documentIdColumnName = '';					
					if (dataObj[i]._index === "kb_docs_collection")
						documentIdColumnName = "_id";
					else
						documentIdColumnName = "documentId";
						
                    var indexCollectionname = "_index";
					  var documenttype = "type";
                    var documenttype = escape(dataObj[i][documenttype]); 
					if(!documenttype || documenttype == 'undefined'){
						documenttype = 'file'
					}
					  var sourceLineURL="sourceline";
                    var newRowContent = '<tr><td id="addExpand"><span class="row-details row-details-close"></span></td>';
                    for (var ii = 0; ii < fields.length; ii++) {

                       var documentID = escape(dataObj[i][documentIdColumnName]);
					   var simplifyURL = (dataObj[i]["simplifyURL"]);
                       var indexCollection = escape(dataObj[i][indexCollectionname]);
                       
                       if(dataObj[i][fields[ii].SourceName] != null && dataObj[i][fields[ii].SourceName] != undefined && dataObj[i][fields[ii].SourceName] != "null" && dataObj[i][fields[ii].SourceName] !=""){ 
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
								   }else if(fields[ii].displayName.toLowerCase() == "description" || fields[ii].displayName.toLowerCase() == "file" || fields[ii].displayName.toLowerCase() == "files"){
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
											if(fields[ii].displayName.toLowerCase() == "file")
												var subTextContent = textContent.substring(0,20);
											else
											{
												if (dataObj[i]._index == "kb_docs_collection" && fields[ii].displayName.toLowerCase() == "description")
												{
													textContent = defectsearch.remove_tags(textContent);
												}
												var subTextContent = textContent.substring(0,100);
											}
											
											 if(fields[ii].displayName.toLowerCase() == "description" ){
												subTextContent = subTextContent.replaceAll('<br>','&nbsp;');
												subTextContent = subTextContent.replaceAll('##','<em class="iseH">');
												subTextContent = subTextContent.replaceAll("#","</em>");
											} 
											//console.log(subTextContent);
											var escapeContent = escape(textContent);
											if(indexCollection != 'defect_files_collection' ){
											if(textContent.length > 0 && textContent.length < 100){
												newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' desc-data='+escapeContent+'>' + subTextContent + '</span></td>';
											}else{
												newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' desc-data='+escapeContent+'>' +subTextContent+'<a modalTitle='+fields[ii].displayName+'  moreTextContent=' + escapeContent + ' class="name" onClick="defectsearch._onExpandRowMoreContentModal(this)">  more... </a></span></td>';
											}
											}
											if(indexCollection == 'defect_files_collection' && defectsearch.deploymenttype == 'CISCO')
											{
												if(textContent.length > 0 && textContent.length < 50){
												newRowContent += '<td  class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType +' desc-data='+escapeContent+'>' + subTextContent + '</span></td>';
											}else{
												subTextContent = textContent.substring(0,50);
												newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType +' desc-data='+escapeContent+'>' +subTextContent+'<a modalTitle='+fields[ii].displayName+'  moreTextContent=' + escapeContent + ' class="name" onClick="defectsearch._onExpandRowMoreContentModal(this)">  more... </a></span></td>';
											}
											}
										}											
								   }else{ 
									//console.log("values-----"+dataObj[i][fields[ii].SourceName])
									if(dataObj[i][fields[ii].SourceName] === defectId){
										issimilarDefectId = true;
									}
									if(i == 0 && ii == 3 && issimilarDefectId == true)
									{
										var value = '100';
										diffValue = 100-parseInt(dataObj[i][fields[ii].SourceName]);
										newRowContent += '<td class="ISEcompactAuto" id = '+dataObj[i][fields[ii].SourceName]+'><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + value + '</span></td>';
										issimilarDefectId = false;
								}
									else if (ii == 3){
										var newVal = parseInt(parseInt(dataObj[i][fields[ii].SourceName]))+diffValue;
										newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + newVal + '</span></td>';
									}
									else{
										if (fields[ii].displayType.toLowerCase() == "url")
											newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '><a href="javascript:;" doc-id="'+documentID+'" id="kdTitleRow">' +dataObj[i][fields[ii].SourceName]+'</a></span></td>';
										else
									newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType.replaceAll("<","").replaceAll(">","") + '>' + dataObj[i][fields[ii].SourceName]+ '</span></td>';
									
									}
									//newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';
	                              }
						 	  }
                             // newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';
                                      
						}
						else if(fields[ii].SourceName.toLowerCase() == "rate"){
									   newRowContent += '<td id="starRatingTable"> <div class="btn-group"><a data-toggle="dropdown" class="dropdown-toggle btn btn-circle btn-icon-only btn-default bg-green" href="javascript:;" style="padding-top: 2px;"><i class="glyphicon  glyphicon-thumbs-up" style="color: white;"></i></a><div id="starRatingDropdown" class="dropdown-menu hold-on-click dropdown-checkboxes"> <div class="arrow"></div><div class="rating-title"><span class="bold" data-localize="language.Rate It">Rate It</span></div><div><div class="col-md-12" id="starRating"><input type="text" class="kv-gly-star rating-loading" data-show-clear="false" data-show-caption="false" value="0" data-size="xxs" data-min="0" data-max="5" data-step="1"></div><div class="col-md-12"><span class="rate-it-msg font-red-sunglo" style="display: none;"></span><div class="form-group" id="starRatingContent"> </div><div class="btn-group"><a class="btn btn-xs btn-success" id="submitRatingBtn" data-apply="confirmation" data-localize="language.Submit">Submit</a><a class="btn btn-xs default" id="cancelRatingBtn" data-apply="confirmation" data-localize="language.Cancel"> Cancel</a></div></div></div></div></div></td>';
								   }
								 
						else{
						 newRowContent += '<td class="ISEcompactAuto"><span documentID="null" indexCollection="null" requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>No Data</span></td>';
						}
						defectsearch.initLocalization();
                    }
					
                    newRowContent += '</tr>';
                    $('#tablebody_' + dName).append(newRowContent);
                    //console.log("SIMY ...10");

                }
				
				$('.kv-gly-star').rating({
					containerClass: 'is-star'
				});
				
				$('.rating,.kv-gly-star').on('change', function () {
					defectsearch.starRatingNumber = parseInt($(this).val());
				});

                //SIMY: Creating tables only for result
                //console.log("SIMY ...2");
                for (var tab in tC) {
                
                //  Bug 2388 - start
                
                var tableColumnsCount = $(tab).find('tr')[0].cells.length;
                    var tempArr = new Array();
                     for(var i=1;i<tableColumnsCount;i++){
                        tempArr.push(i);                    
                }
                
                //  Bug 2388 - end

                    var oTable = $(tab).dataTable({
                        "dom": 'rtTip',
                        					
						"tableTools": {
							"sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
							"aButtons": [{
								"sExtends": "csv",
								"sButtonText": "CSV",
								"mColumns": tempArr
							}, {
								"sExtends": "xls",
								"sButtonText": "Excel"
							}, {
								"sExtends": "print",
								"sButtonText": defectsearch.getLocalizationName("Print"),
								"sInfo": 'Please press "CTR+P" to print or "ESC" to quit',
								"sMessage": "Generated by DataTables"
							}, {
								"sExtends": "copy",
								"sButtonText": "Copy"
							}]
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
					"oLanguage": defectsearch.dataTableLocalizationData,
                        "columnDefs": [{
                            "orderable": false,
                            "targets": [0]
                        }],
                        "order": [
                            [sortField, 'desc']
                        ],
						
                        // set the initial value
                        "pageLength": 15,
						"autoWidth": true

                    });

                    $(tab+"_wrapper").css('overflow-x', 'hidden');
                    //SIMY : scrolling down ..
                    if( $(window).width() < 500 ) {
                        $(document).scrollTop($('#searchResultsTable').offset().top);
						$(tab+"_wrapper").css('overflow-x', 'auto');
                    }
                    
                    $(tab).unbind('click'); // SIMY: removing all events in case if there was some event set here ..
                    $(tab).on('click', ' tbody td .row-details', function(event) {
                        var nTr = $(this).parents('tr')[0];
                        var tID = $(this).closest('table').attr('id');

                        var cols = [];
                        cols = defectsearch._getColumnNamesList(tID);


                        var oTable = $('#' + tID).dataTable();

                        if (oTable.fnIsOpen(nTr)) {
                            /* This row is already open - close it */
                            $(this).addClass("row-details-close").removeClass("row-details-open");
                            oTable.fnClose(nTr);
                        } else {
                            // Open this row 
                            $(this).addClass("row-details-open").removeClass("row-details-close");
                            oTable.fnOpen(nTr, defectsearch._fnDefectSearchRowFormatDetails(oTable, nTr, cols), 'details');
                       
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

					$(tab).on('click', ' tbody #kdTitleRow', function(event) {
					
						var nTr = $(this).parents('tr')[0];
						var tID = $(this).closest('table').attr('id');						
						
						var oTable = $('#' + tID).dataTable();
						
						var aData = oTable.fnGetData(nTr);
						
						var simplifyURL = $(aData[i + 1]).attr('documentid');
						
						defectsearch._onSimplifyURL(simplifyURL);
					});

                }

				defectsearch._resizeRateitColumnHeading();

                for (var i = 0; i < defectsearch.hideTableColumns.length; i++) {
                    var iTD = '#' + defectsearch.hideTableColumns[i].tableID;
                    if (!tC[iTD]) continue; // SIMY: do not proceed if the table is in current list


                    var tempstr = iTD.split("_");
                    console.log(tempstr[2])

                    var table = $(iTD).DataTable();
                    for (var j = 0; j < defectsearch.hideTableColumns[i].hideColumnsList.length; j++) {

                        var columnID = defectsearch.hideTableColumns[i].hideColumnsList[j] - 1;                      
                        table.column(columnID).visible(false, false);
                        $('#columnToggler_'+tempstr[2]+' input[columnid='+columnID+']').attr('checked', false)
                    }



                }

                         

                $('#searchResultsTable').removeClass("hide");

                defectsearch.searchResultsReceived = true;


                //  Hide Table rows dropdown and Table Search
                $("div").find(".dataTables_length").addClass('hidden-sm hidden-xs');
                $("div").find(".dataTables_filter").addClass('hidden-sm hidden-xs');

                var windowWidth = $(window).width();
                if (windowWidth <= 400) {
                    defectsearch.onResizeWindow();
                    $("html, body").animate({
                        scrollTop: $(document).height()
                    }, 100);
                }
				
				$("#starRatingTable a.dropdown-toggle").on('click', defectsearch._renderRatingPopupData);
				$("#starRatingTable #starRatingDropdown #submitRatingBtn").on('click', defectsearch._submitRatingHandler);
				$("#starRatingTable #starRatingDropdown #cancelRatingBtn").on('click', defectsearch._cancelRatingHandler);
				$("#starRatingTable #starRatingDropdown #ratingComment #textarearatingChars").live('keyup', defectsearch._countRatingCommentCharHandler);
				
            }else if($('#page_defectsearch #searchResultsTable').hasClass('hide') || $('#page_defectsearch #searchResultsTable').css('display') == 'block'){
                                         
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

              $("#addExpand").css("width", "3.40%");
            

             var sourceCodeTableRowCount = $('#sample_4_SourceCode tbody').children().length;      

             //if(sourceCodeTableRowCount  ==  1)                
                //$('#btnLocalizeDefect').addClass('hide');               
           // else
                //$('#btnLocalizeDefect').removeClass('hide');
                
                 ISEUtils.portletUnblocking("pageContainer");

             Pace.stop();
			 if(!is_old_data)
				$(document).scrollTop($('#searchResultsTable').offset().top);
        },



        _getColumnNamesList: function(tableID) {

            for (var i = 0; i < defectsearch.hideTableColumns.length; i++) {

                if(defectsearch.hideTableColumns[i].tableID == tableID)
                    return defectsearch.hideTableColumns[i].allColumnsNames; // Returns Array

            }

        },
        _hideTableColumns: function(tableID, dropDownboxID) {

            var elements = document.querySelectorAll('#' + dropDownboxID + 'label input:checked');
            var selectedColumnsList = new Array();
            Array.prototype.map.call(elements, function(el, i) {

                var iCol = parseInt($(el).attr("data-column"));
                iCol = iCol + 1;
                selectedColumnsList.push(iCol)

            });


            for (var i = 0; i < selectedColumnsList.length; i++) {
                $('#' + tableID + 'td:nth-child(' + selectedColumnsList[i] + '),th:nth-child(' + selectedColumnsList[i] + ')').show();

            }

        },

        /* Formatting function for defect search results row expanded details */
        _fnDefectSearchRowFormatDetails: function(oTable, nTr, cols) {

            var aData = oTable.fnGetData(nTr);

             var defectID = $(aData[1]).text();
			 
			 String.prototype.replaceAll = function(target, replacement) {
                            return this.split(target).join(replacement);
                        };
                        
                        var defTitle = $(aData[2]).text();
						console.log("defTitle"+defTitle);
              
			  
			  
			  
                var projectName = localStorage.getItem('projectName');
                defectsearch.defectIDMapforCRId = defectID;

                var requestObject = new Object();
                //requestObject.collectionName = defectsearch.searchObj.indexes.join(',');
				var collectionName = defectsearch._getSelectedIndexName(defectsearch.currentSelectedTabID).indexes;
				requestObject.collectionName = collectionName;
                requestObject.title = ""
                requestObject.searchString = "cr_id:" + defectID; 
                //requestObject.projectName = projectName;
				requestObject.projectName = localStorage.getItem('multiProjectName');
                requestObject.maxResults = 25;
                requestObject.serachType = "similarSearch";
                requestObject.filterString = "";


             var crIDData=ISE.getSearchResults(requestObject, defectsearch._receivedCR_IDList);

                
            var sOut = '<table>';

           
            for (var i = 0; i < cols.length; i++) {


                var requiredFilter = $(aData[i + 1]).attr('requiredFilter');
                var displaytype = $(aData[i + 1]).attr('displayType');
                var selDef = $(aData[1]).text();
if(requiredFilter){
                 if (requiredFilter.toLowerCase() == "yes") {

                        if (displaytype.toLowerCase() == "date") {

                            var fieldValue = $(aData[i + 1]).text();
                                var tempDate = new Date(fieldValue);
                            sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td><a btnType=minus fieldName=' + cols[i] + '  fieldValue=' + fieldValue + ' onClick=defectsearch._onExpandRowDateTypeSearch(this) class="btn btn-xs blue" title="less than or equal to date specified"> <span><=</span></a></td><td><a  btnType=plus  fieldName=' + cols[i] + ' fieldValue=' + fieldValue + ' onClick=defectsearch._onExpandRowDateTypeSearch(this) class="btn btn-xs blue" title="greater than or equal to date specified"><span>>=</span></a></td><td class="ISEcompactAuto"><span fieldName=' + cols[i] + ' class=name>' + tempDate + ' </span></td></tr>';

                        } else if (displaytype.toLowerCase() == "boolean") {
                            var fieldValue = $(aData[i + 1]).text();
                             console.log(fieldValue)
                            sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td><a btnType=open fieldName=' + cols[i] + '  fieldValue=' + fieldValue + ' onClick=defectsearch._onExpandRowStatusTypeSearch(this) class="btn btn-xs blue" title="exclude status specified in search results"> <i class="fa fa-minus"></i></a></td><td><a  btnType=closed  fieldName=' + cols[i] + ' fieldValue=' + fieldValue + ' onClick=defectsearch._onExpandRowStatusTypeSearch(this) class="btn btn-xs blue" title="include status specified in search results"><i class="fa fa-plus"></i></a></td><td class="ISEcompactAuto"><span fieldName=' + cols[i] + ' class=name>' + fieldValue + ' </span></td></tr>';

                        } else if (displaytype.toLowerCase() == "download") {

                          var fieldValue = unescape($(aData[i + 1]).text());
                          var documentID = $(aData[i + 1]).attr('documentID');
                          var indexCollection = $(aData[i + 1]).attr('indexCollection') 
                          var documenttype =  unescape($(aData[i + 1]).attr('documenttype'));           
                     
                         if(documenttype.toLowerCase() == "file")
                          { 
                          sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td></td><td></td><td class="ISEcompactAuto">' + fieldValue + '<span style="cursor:pointer;"  href="javascript:;" indexCollection='+indexCollection+' documentID='+documentID+' onClick="defectsearch._downloadDocumentLink(this)" > ';
                          sOut += ' <i class="glyphicon glyphicon-download"></i></span></td></tr>';
                           }
                       } else if(displaytype.toLowerCase() == "link"){                

                         var fieldValue = escape($(aData[i + 1]).text());
                         if ($(aData[i + 1]).text() != "undefined") {
                             sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td><a btnType=link fieldName=' + cols[i] + '  fieldValue=' + fieldValue + ' onClick=defectsearch._onExpandRowOpenLink(this) class="btn btn-xs blue" > click here</a></td><td class="ISEcompactAuto"></td><td></td></tr>';
                         }
                       } else if(displaytype.toLowerCase() == "popup"){

                           if ($(aData[i + 1]).text() != "undefined") {

                              var indexCollection = $(aData[i + 1]).attr('indexCollection');
                              var sourceLine = $(aData[i + 1]).attr('sourceLine');              
                              var sourceURL = $(aData[i + 1]).text();
                             sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td><a style="display:none" btnType=link fieldName=' + cols[i] +  ' fieldValue=' + escape(sourceURL) +' onClick=defectsearch._onExpandRowOpenPopup(this) class="btn btn-xs blue"  indexCollection='+indexCollection+' ><i class="icon-graph"></i></a></td><td class="ISEcompactAuto"><a btnType=link fieldName=' + cols[i] +  ' fieldValue=' + escape(sourceURL) +' sourceLine='+sourceLine+'  indexCollection='+indexCollection+' onClick=defectsearch._onExpandRowOpenLink(this) class="btn btn-xs blue" ><i class="icon-doc"></i></a></td><td>'+sourceURL+'</td></tr>';
                         }
                       } else if (displaytype.toLowerCase() == "array") {

                            if ($(aData[i + 1]).text() != "undefined") {
                               if($(aData[i + 1]).attr('desc-data') && $(aData[i + 1]).attr('desc-data').length > 0)
									var tempStr = unescape($(aData[i + 1]).attr('desc-data'));
								else
									var tempStr = $(aData[i + 1]).text();
                                var tempArray = tempStr.substring(1, tempStr.length - 1);
                                tempArray = tempArray.split(',');
                                var tempRow = '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td></td><td></td><td><div>'

                                for (var j = 0; j < tempArray.length; j++) {
                                      console.log("defId @ 1037"+defId);
                                                    //tempRow += '<span class="glyphicon glyphicon-picture" onClick="defectsearch._onExpandRowfileLoadCallGraphFilter()"></span><input type="checkbox" name="column" style="margin-left:3px;" value=' + tempArray[j] + ' ><a fieldname=' + cols[i] + '  class="name" onclick="defectsearch._onExpandRowSearchFilter(this)"><span requiredfilter="yes" displaytype="string">' + tempArray[j] + '</span> </a><br>'
                                    var defId = defectID ; // SIMY : what variable is this ? Initializing just for fixing the current issue;
                                    var defTitle = defectID;
                                    tempRow += '<span data-target="#defectsearch_filediffmodal" data-toggle="modal" class="glyphicon glyphicon-picture" data-DefectId=' + defId + ' data-defTitle=' + defTitle +' data-FileId=' + tempArray[j] + ' onClick="defectsearch._onExpandRowfileLoadCallGraphFilter(this)" title="filediff"></span><input type="checkbox" name="column" style="margin-left:3px;" value=' + tempArray[j] + ' ><a fieldname=' + cols[i] + '  class="name" onclick="defectsearch._onExpandRowSearchFilter(this)"><span requiredfilter="yes" displaytype="string">' + tempArray[j] + '</span> </a><br>'
                                }

                                tempRow += '<p></p>';
                               //tempRow += '<a onClick="defectsearch._analyseBtnClick(this)" id='+selDef+' class="btn btn-circle btn-xs blue"><i class="glyphicon glyphicon-search"></i> Analyse </a>'
                               tempRow += '</div></td></tr>';
                                sOut += tempRow;
                          } else {
                            sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td></td><td></td><td class="ISEcompactAuto">No data </td></tr>'
                          }
                       } 
                       else{

                          var textContent = escape($(aData[i + 1]).text());
                               console.log(textContent)

                             if(textContent != "undefined") 
                                sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td></td><td></td><td class="ISEcompactAuto"><a fieldName=' + cols[i] + ' class="name" onClick=defectsearch._onExpandRowSearchFilter(this)>'+unescape(textContent)+' </a></td></tr>';
                                else
                                 sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td></td><td></td><td class="ISEcompactAuto"><a fieldName=' + cols[i] + ' class="name" onClick=defectsearch._onExpandRowSearchFilter(this)>No data </a></td></tr>';
                  

                       }
                  }
                 else{

                    if (displaytype.toLowerCase() == "date") {

          var fieldValue = $(aData[i + 1]).text();
            var tempDate1 = new Date(fieldValue);
            sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td></td><td></td><td class="ISEcompactAuto">' + tempDate1 + ' </td></tr>';
            
            }
			else if (displaytype.toLowerCase() == "url") {
				var fieldValue = $(aData[i + 1]).text();				
		  var simplifyURL = $(aData[i + 1]).attr('documentid');
            sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td></td><td></td><td class="ISEcompactAuto"><a btnType=link onClick=defectsearch._onSimplifyURL("'+simplifyURL+'") class="btn btn-xs blue" >' + fieldValue + ' </a></td></tr>';
            
            }
            else
            {
            
                        String.prototype.replaceAll = function(target, replacement) {
                          return this.split(target).join(replacement);
                                  };
                                if($(aData[i + 1]).attr('desc-data') && $(aData[i + 1]).attr('desc-data').length > 0)
									var textContent = unescape($(aData[i + 1]).attr('desc-data'));
								else
									var textContent = $(aData[i + 1]).html();
                      textContent = textContent.replaceAll('<em class="iseH">',"##");
                      textContent = textContent.replaceAll("</em>","#");

                                console.log(textContent.length)

                                        if(textContent.length >0 && textContent.length < 200)
                                         {
                           textContent = textContent.replaceAll('##','<em class="iseH">');
                            textContent = textContent.replaceAll("#","</em>");
                                          if($(aData[i + 1]).text() != "undefined" )      
                                            sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td></td><td></td><td class="ISEcompactAuto">' + textContent + ' </td></tr>';
                                          else if($(aData[i + 1]).text() == null || $(aData[i + 1]).text() == "" )                         
                                            sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td></td><td></td><td class="ISEcompactAuto">No data </td></tr>';
                                          }
                                          else if(textContent.length == 0){
                                             sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td></td><td></td><td class="ISEcompactAuto">No data </td></tr>';
                                          }
                                           else
                                          {
                                            var subTextContent = textContent.substring(0,200);
                                            subTextContent = subTextContent.replaceAll('<br>','&nbsp;');
                            subTextContent = subTextContent.replaceAll('##','<em class="iseH">');
                            subTextContent = subTextContent.replaceAll("#","</em>");
                            
                                                console.log(subTextContent);
                                            var escapeContent = escape(textContent);
                                           
                                           sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td></td><td></td><td class="ISEcompactAuto">'+subTextContent+'<a modalTitle='+cols[i]+'  moreTextContent=' + escapeContent + ' class="name" onClick=defectsearch._onExpandRowMoreContentModal(this)>  more... </a></td></tr>';  
                                          }
                 }




                 }
			}

      

            }
            if(defectsearch.deploymenttype == 'ALU'){
            var releaseValue = "";
            for (var kk = 0; kk < defectsearch.testExcefileReleaseArr.length; kk++) {
					if(selDef == defectsearch.testExcefileReleaseArr[kk].testcaseid){
						releaseValue = defectsearch.testExcefileReleaseArr[kk].release;
					}
			}
			if(collectionName == "testcase_collection"){
				 sOut += '<td class="ISEcompactAuto">' +"TestExecutionDetails"+ ':</td><td></td><td></td><td class="ISEcompactAuto"><img data-DefectId=' + selDef + '  src="images/info_small.png" style="height:21px;width:25px;cursor:pointer;" onClick="defectsearch._onExpandRowTestcaseDetails(this);" title="TestExecutionDetails"/></span></td></tr>';
				 sOut += '<tr><td class="ISEcompactAuto">' +"Release"+ ':</td><td></td><td></td><td class="ISEcompactAuto">'+releaseValue+' </td></tr>';
			 }
			 }
			 
             //var str = '<table id=table_'+defectID+'><tbody><tr><td><span class="row-details row-details-close"></span></td><td>venkat</td></tr></tbody></table>';
            // var str= '<table id="report"> <tr style="display:none"><th></th><th></th> </tr><tr><td><span id="span_'+defectID+ ' onclick=defectsearch._onExpand(this) class="row-details row-details-close"></span></td><td>English</td></tr><tr><td colspan="5"><h4>Additional information</h4></td></tr></table>'
            sOut += '<tr><td class="ISEcompactAuto" id=CRIDElement_'+defectsearch.defectIDMapforCRId+' style="padding-left: 36px;display:none"><b><u>'+defectsearch.CRIDTitle+'</u></b></td><td></td><td></td><td></td></tr>';
            sOut += '<tr><table  id=crdExpansion_'+defectsearch.defectIDMapforCRId+' style="width:100%;margin-left:55px;display:none"></table></tr>';
            //sOut +='<tr><td class="ISEcompactAuto" ><div id="CRD_Report"></div></td></tr>'
            sOut += '</table>';
                   
            return sOut;
        },

        _receivedCR_IDList:function(dataObj){

            console.log(dataObj);

              var defId ="";
			var defTitle ="";  
			if(ISEUtils.validateObject(dataObj))
            {
          
            var FieldsMap={};
                for (var K in defectsearch.jsonDataCollection.TabArray) {
                            FieldsMap[defectsearch.jsonDataCollection.TabArray[K].indexName] = defectsearch.crIdFileds;
                           }

                
               var tableData ;
               var grandChildDefectID = '';

                for (var i = 0; i < dataObj.length; i++) {
//if(i == 0) {				
						defId = dataObj[i]._id//replace('<span requiredfilter="no" displaytype="string">',"");
						//defId = defId.replace('</span>',"");
				
						console.log("defId"+defId);
						
						String.prototype.replaceAll = function(target, replacement) {
							return this.split(target).join(replacement);
						};
						
						defTitle = dataObj[i].title//.replace('<span requiredfilter="no" displaytype="string">',"");
						console.log("defTitle-1"+defTitle);
						/*defTitle = defTitle.replaceAll('<em class="iseH">',"");
						console.log("defTitle-2"+defTitle);
						defTitle = defTitle.replaceAll("</em>","");
						console.log("defTitle-3"+defTitle);
						defTitle = defTitle.replace('</span>',"");
						defTitle = defTitle.replaceAll(" ","_");*/
				
						console.log("defTitle"+defTitle);
				
				//}                   
				var fields = FieldsMap[dataObj[i]._index];

                     var fieldsNameCollection = fields;
                     
                     
                    
                    for (var j = 0; j < fieldsNameCollection.length; j++) {



                    if(j==0) {

                          grandChildDefectID=dataObj[i][fieldsNameCollection[j].SourceName];
                        


                     tableData += '<tr  class="pending_users'+grandChildDefectID+'" id="crd_'+dataObj[i][fieldsNameCollection[j].SourceName]+'">';
                     tableData += '<td class="admin" style="background-color:#d4dfd9 !important">'
                     tableData += '<span id=cr_'+dataObj[i][fieldsNameCollection[j].SourceName]+' innerExapansionDefectId='+dataObj[i][fieldsNameCollection[j].SourceName]+'  class="row-details-CRD row-details-close" onClick=defectsearch._onExpand(this) style="cursor:pointer;"></span>&nbsp;&nbsp;'+dataObj[i][fieldsNameCollection[j].SourceName]+'';
                     //tableData += '<td>'+dataObj[i][fieldsNameCollection[j].SourceName]+'</td>';
                     //tableData += '</tr>'  
                     tableData += '<table style="display:none;margin-left:27px;">'  
                     }
                     else {

                            if(fieldsNameCollection[j].enable == "yes")
							{


                                tableData +='<tr>'
                                tableData += '<td style ="background-color:#d4dfd9 !important">'+fieldsNameCollection[j].displayName+': </td>'
                               if(fieldsNameCollection[j].filter == "yes")
                               {
                                if(fieldsNameCollection[j].displayType == "array") {
                                     console.log(dataObj[i][fieldsNameCollection[j].SourceName])
                                     if( typeof dataObj[i][fieldsNameCollection[j].SourceName] === "undefined")
                                    {
                                        tableData +=  '<td style="background-color:#d4dfd9">No Data</td>'
                                    } 
                                    else
                                    {
                                    var tempStr = dataObj[i][fieldsNameCollection[j].SourceName];
                                    var tempArray = tempStr.substring(1, tempStr.length - 1);
                                    tempArray = tempArray.split(',');
                                    tableData +=  '<td style ="background-color:#d4dfd9 !important"><div>';
                                    for (var k = 0; k < tempArray.length; k++) {
                                        //tableData += '<span class="glyphicon glyphicon-picture" onClick="defectsearch._onExpandRowfileLoadCallGraphFilter()"></span><input type="checkbox" name="column" style="margin-left:3px;" value=' + tempArray[k] + ' ><a fieldname=' + fieldsNameCollection[j].displayName + '  class="name" onclick="defectsearch._onExpandRowSearchFilter(this)"><span requiredfilter="yes" displaytype="string">' + tempArray[k] + '</span> </a><br>'
                                   tableData +='<span data-target="#defectsearch_filediffmodal" data-toggle="modal" class="glyphicon glyphicon-picture" data-DefectId=' + defId + ' data-defTitle=' + defTitle +' data-FileId=' + tempArray[k] + ' onClick="defectsearch._onExpandRowfileLoadCallGraphFilter(this)" title="filediff"></span><input type="checkbox" name="column" style="margin-left:3px;" value=' + tempArray[k] + ' ><a fieldname=' + fieldsNameCollection[j].displayName + '  class="name" onclick="defectsearch._onExpandRowSearchFilter(this)"><span requiredfilter="yes" displaytype="string">' + tempArray[k] + '</span> </a><br>'                                    }
                                    tableData +=  '</div></td>';
                                }
                            }
                                else
                                {
                                    tableData +=  '<td style="background-color:#d4dfd9">'+dataObj[i][fieldsNameCollection[j].SourceName]+'</td>'

                                }
                            }

                            else
                               {
                                   if(fieldsNameCollection[j].displayType == "array")
                                   {
                                    console.log(dataObj[i][fieldsNameCollection[j].SourceName])

                                    if( typeof dataObj[i][fieldsNameCollection[j].SourceName] === "undefined")
                                    {
                                        tableData +=  '<td style="background-color:#d4dfd9">No Data</td>'
                                    } 
                                    else
                                    {
                                        var tempStr = dataObj[i][fieldsNameCollection[j].SourceName];
                                        var tempArray = tempStr.substring(1, tempStr.length - 1);
                                        tempArray = tempArray.split(',');
										if(dataObj[i].functionalarea.indexOf("9153 OMC-R")!=-1)
												defId = dataObj[i]._id;
                                        tableData +=  '<td style ="background-color:#d4dfd9 !important;"><div>';
					
                                         for (var k = 0; k < tempArray.length; k++) { 
                                            tableData +='<span data-target="#defectsearch_filediffmodal" data-toggle="modal" class="glyphicon glyphicon-picture" data-DefectId=' + defId + ' data-defTitle=' + defTitle +' data-FileId=' + tempArray[k] + ' onClick="defectsearch._onExpandRowfileLoadCallGraphFilter(this)" title="filediff"></span><input type="checkbox" name="column" style="margin-left:3px;" value=' + tempArray[k] + ' ><span fieldname=' + fieldsNameCollection[j].displayName + ' ><span requiredfilter="yes" displaytype="string">' + tempArray[k] + '</span> </span><br>'                  
                                           }

                                           tableData +=  '</div></td>';
                                    }

                                   

                                   }
                                   else
                                   { 
                                    if( typeof dataObj[i][fieldsNameCollection[j].SourceName] === "undefined" || dataObj[i][fieldsNameCollection[j].SourceName] == "" )
                                    {
                                        tableData +=  '<td style="background-color:#d4dfd9">No Data</td>'
                                    }
                                    else { 
                                      tableData +=  '<td style="background-color:#d4dfd9">'+dataObj[i][fieldsNameCollection[j].SourceName]+'</td>'
                                      }
                                    }
                               }                               
                               
                               tableData += '</tr>';

                             }
                             
                        //tableData +='<tr style="display:none"><td><table></table></td></tr>';                            
                        if(j == fieldsNameCollection.length-1) {
                           
                           //  tableData +='<div><table id=grandChild_'+grandChildDefectID+'></table></div>';
                            tableData +='<tr id="showhide'+grandChildDefectID+'" ><td class="ISEcompactAuto" id=CSIDElement_'+grandChildDefectID+  ' style="background-color:#d3d3d3;display:none;" ><b><u>'+defectsearch.CSIDTitle+'</u></b></td><td style="background-color:#d3d3d3;vertical-align:top"><table id=grandChild_'+grandChildDefectID+' style="display:none;"></table></td></tr>';
                              tableData += '</table></td></tr>'
                        }

                    }
                    

                    }                 
                  
             

                }

               
                   $('#crdExpansion_'+defectsearch.defectIDMapforCRId).html("");
                $('#crdExpansion_'+defectsearch.defectIDMapforCRId).append(tableData);
                 document.getElementById('CRIDElement_'+defectsearch.defectIDMapforCRId).style.display = "block";       
                document.getElementById('crdExpansion_'+defectsearch.defectIDMapforCRId).style.display = "block";  
               // console.log(grandChildDefectID);
                

            }
            else{

                $('#crdExpansion_'+defectsearch.defectIDMapforCRId).html("");

                
                 var tableData = '<tr><td>No Data</td></tr>' 

                $('#crdExpansion_'+defectsearch.defectIDMapforCRId).append(tableData);

            }


        },

       _onExpand :function(event) {
            
           //console.log(event);

           //var ID = $(event).attr("id");

           if(event.classList[1] == "row-details-close") {
            $(event).addClass("row-details-open").removeClass("row-details-close");
            event.nextSibling.nextSibling.style.display="block";
           }
           else
           {
             $(event).addClass("row-details-close").removeClass("row-details-open");
             event.nextSibling.nextSibling.style.display="none";

           }


               var projectName = localStorage.getItem('projectName');
               var childLevelDefectId = $(event).attr("innerExapansionDefectId");
                defectsearch.grandChildDefectID = childLevelDefectId; 
                //defectsearch.defectIDMapforCRId = defectID;

               var requestObject = new Object();
                requestObject.collectionName = defectsearch.searchObj.indexes.join(',');
                requestObject.title = ""
                requestObject.searchString = "cr_id:" + childLevelDefectId; 
                //requestObject.projectName = projectName;
				requestObject.projectName = localStorage.getItem('multiProjectName');
                requestObject.maxResults = 25;
                requestObject.serachType = "similarSearch";
                requestObject.filterString = "";


             ISE.getSearchResults(requestObject, defectsearch._receivedGrandChildCR_IDList);


        
        },

        _receivedGrandChildCR_IDList:function(dataObj){

            console.log("grand child");
            console.log(dataObj);

             var defId ="";
            var defTitle ="";

            if(ISEUtils.validateObject(dataObj))
            {

                console.log(defectsearch.crIdFileds)

                var csIDArr = new Array();

                for(var i=0;i<defectsearch.crIdFileds.length;i++){
                   if(defectsearch.crIdFileds[i].SourceName == "title")
                   {
                     csIDArr.push(defectsearch.crIdFileds[i].fields)
                   }
                }
                 var FieldsMap={};
                for (var K in defectsearch.jsonDataCollection.TabArray) {
                            FieldsMap[defectsearch.jsonDataCollection.TabArray[K].indexName] = csIDArr[0];
                           }

                     var grandChildtableData ;
                     for (var i = 0; i < dataObj.length; i++) {

                            if(i == 0) {   
						console.log("defID @ 1275"+defId);
                        defId = dataObj[i]._id//replace('<span requiredfilter="no" displaytype="string">',"");
                        //defId = defId.replace('</span>',"");
                
                        console.log("defId"+defId);
                        
                        String.prototype.replaceAll = function(target, replacement) {
                            return this.split(target).join(replacement);
                        };
                        
                        defTitle = dataObj[i].title//.replace('<span requiredfilter="no" displaytype="string">',"");
                        console.log("defTitle-1"+defTitle);
                        /*defTitle = defTitle.replaceAll('<em class="iseH">',"");
                        console.log("defTitle-2"+defTitle);
                        defTitle = defTitle.replaceAll("</em>","");
                        console.log("defTitle-3"+defTitle);
                        defTitle = defTitle.replace('</span>',"");
                        defTitle = defTitle.replaceAll(" ","_");*/
                
                        console.log("defTitle"+defTitle);
                
                }
                            var fields = FieldsMap[dataObj[i]._index];

                             var fieldsNameCollection = fields;

                       for (var j = 0; j < fieldsNameCollection.length; j++) {

                       if(j==0) {
                  
                     grandChildtableData += '<tr  class="pending_users'+dataObj[i][fieldsNameCollection[j].SourceName]+'" id="crd_'+dataObj[i][fieldsNameCollection[j].SourceName]+'">';
                     grandChildtableData += '<td class="admin" style="background-color:#d3d3d3;">'
                     grandChildtableData += '<span id=cr_'+dataObj[i][fieldsNameCollection[j].SourceName]+' innerExapansionDefectId='+dataObj[i][fieldsNameCollection[j].SourceName]+'  class="row-details-CRD row-details-close" onClick=defectsearch._onExpandGrandChild(this) style="cursor:pointer;"></span>&nbsp;&nbsp;'+dataObj[i][fieldsNameCollection[j].SourceName]+'';
                     //tableData += '<td>'+dataObj[i][fieldsNameCollection[j].SourceName]+'</td>';
                     //tableData += '</tr>'  
                     grandChildtableData += '<table style="display:none">'  
                     }
                     else {
                          if(fieldsNameCollection[j].enable == "yes")
                             {
                              grandChildtableData +='<tr>'
                              grandChildtableData += '<td style="background-color:#d3d3d3;">'+fieldsNameCollection[j].displayName+': </td>'
                          
                                if(fieldsNameCollection[j].filter == "yes")
                               {

                                if(fieldsNameCollection[j].displayType == "array") {
                                    console.log(dataObj[i][fieldsNameCollection[j].SourceName])
                                   
                                   
                                     
                                    if( typeof dataObj[i][fieldsNameCollection[j].SourceName] === "undefined")
                                    {
                                        grandChildtableData +=  '<td style="background-color:#d4dfd9">No Data</td>'
                                    } 
                                    else
                                    {
                                          var tempStr = dataObj[i][fieldsNameCollection[j].SourceName];
                                        var tempArray = tempStr.substring(1, tempStr.length - 1);
                                        tempArray = tempArray.split(',');
                                        grandChildtableData +=  '<td style="background-color:#d3d3d3;"><div>';
                                        for (var k = 0; k < tempArray.length; k++) {
                                           //grandChildtableData += '<span class="glyphicon glyphicon-picture" onClick="defectsearch._onExpandRowfileLoadCallGraphFilter()"></span><input type="checkbox" name="column" style="margin-left:3px;" value=' + tempArray[k] + ' ><a fieldname=' + fieldsNameCollection[j].displayName + '  class="name" onclick="defectsearch._onExpandRowSearchFilter(this)"><span requiredfilter="yes" displaytype="string">' + tempArray[k] + '</span> </a><br>'
                                           grandChildtableData +='<span data-target="#defectsearch_filediffmodal" data-toggle="modal" class="glyphicon glyphicon-picture" data-DefectId=' + defId + ' data-defTitle=' + defTitle +' data-FileId=' + tempArray[k] + ' onClick="defectsearch._onExpandRowfileLoadCallGraphFilter(this)" title="filediff"></span><input type="checkbox" name="column" style="margin-left:3px;" value=' + tempArray[k] + ' ><a fieldname=' + fieldsNameCollection[j].displayName + '  class="name" onclick="defectsearch._onExpandRowSearchFilter(this)"><span requiredfilter="yes" displaytype="string">' + tempArray[k] + '</span> </a><br>'
                                        }
                                        grandChildtableData +=  '</div></td>';
                                     
                                    }
                                }
                                else
                                {
                                    grandChildtableData +=  '<td style="background-color:#d3d3d3;">'+dataObj[i][fieldsNameCollection[j].SourceName]+'</td>'

                                }
                            }
                            else 
                                {
                                   if(fieldsNameCollection[j].displayType == "array")
                                   {
                                    console.log(dataObj[i][fieldsNameCollection[j].SourceName])

                                    if( typeof dataObj[i][fieldsNameCollection[j].SourceName] === "undefined")
                                    {
                                        grandChildtableData +=  '<td style="background-color:#d3d3d3">No Data</td>'
                                    } 
                                    else
                                    {
                                        var tempStr = dataObj[i][fieldsNameCollection[j].SourceName];
                                        var tempArray = tempStr.substring(1, tempStr.length - 1);
                                        tempArray = tempArray.split(',');

                                        grandChildtableData +=  '<td style ="background-color:#d3d3d3 !important"><div>';

                                         for (var k = 0; k < tempArray.length; k++) { 
                                            //grandChildtableData +='<span data-target="#defectsearch_filediffmodal" data-toggle="modal" class="glyphicon glyphicon-new-window" style="color:green;background-color:#ffd11a;" data-DefectId=' + defId + ' data-defTitle=' + defTitle +' data-FileId=' + tempArray[k] + ' onClick="defectsearch._onExpandRowfileLoadCallGraphFilter(this)" title="filediff"></span><input type="checkbox" name="column" style="margin-left:3px;" value=' + tempArray[k] + ' ><span fieldname=' + fieldsNameCollection[j].displayName + ' ><span requiredfilter="yes" displaytype="string">' + tempArray[k] + '</span> </span><br>' 
											grandChildtableData +='<img data-target="#defectsearch_filediffmodal" data-toggle="modal" src="images/download.png"; style="height:16px;" data-DefectId=' + defId + ' data-defTitle=' + defTitle +' data-FileId=' + tempArray[k] + ' onClick="defectsearch._onExpandRowfileLoadCallGraphFilter(this)" title="filediff" /><input type="checkbox" name="column" style="margin-left:3px;" value=' + tempArray[k] + ' ><span fieldname=' + fieldsNameCollection[j].displayName + ' ><span requiredfilter="yes" displaytype="string">' + tempArray[k] + '</span> </span><br>'
											
                                           }

                                           grandChildtableData +=  '</div></td>';
                                    }

                                   

                                   }
                                   else
                                   { 
                                      if( typeof dataObj[i][fieldsNameCollection[j].SourceName] === "undefined" || dataObj[i][fieldsNameCollection[j].SourceName] == "" )
                                    {
                                        grandChildtableData +=  '<td style="background-color:#d4dfd9">No Data</td>'
                                    }
                                    else { 
                                     grandChildtableData +=  '<td style="background-color:#d4dfd9">'+dataObj[i][fieldsNameCollection[j].SourceName]+'</td>'
                                       }
                                    }
                               }   

                            grandChildtableData += '</tr>'

                        //tableData +='<tr style="display:none"><td><table></table></td></tr>';                            
                        if(j == fieldsNameCollection.length-1) {
                           // tableData +='<tr class="showhide'+grandChildDefectID+'" style="display:none"><td><table id=grandChild_'+grandChildDefectID+'></table></td></tr>';
                            grandChildtableData += '</table></td></tr>' 
                        }

                    }
                    
                        
                     
                     } 

                      $('#grandChild_'+defectsearch.grandChildDefectID).html("");  
                      $('#grandChild_'+defectsearch.grandChildDefectID).append(grandChildtableData);
					  //document.getElementById('showhide'+defectsearch.grandChildDefectID).removeClass("hide");       
					  $('#showhide'+defectsearch.grandChildDefectID).removeClass("hide");
						document.getElementById('CSIDElement_'+defectsearch.grandChildDefectID).style.display = "block";       
                        document.getElementById('grandChild_'+defectsearch.grandChildDefectID).style.display = "block";      
            }
        }
    }
            else{


                 var grandChildtableData = '<tr><td>No Data</td></tr>' 

                 $('#grandChild_'+defectsearch.grandChildDefectID).html("");  


                $('#grandChild_'+defectsearch.grandChildDefectID).append(grandChildtableData);




            }

        },

      
        _onExpandGrandChild:function(event){

            

            if(event.className == "row-details-CRD row-details-close") {
                event.className = "row-details-CRD row-details-open"
                event.nextSibling.nextSibling.style.display="block";
           }
           else
           {
             event.className = "row-details-CRD row-details-close";
             event.nextSibling.nextSibling.style.display="none";

           }
           
        

        },

          _refreshFilterDisplay: function(event) {

            $("#divFilterTags").empty();
            var selectedValue1="";
    
            for (var i = 0; i < defectsearch.searchObj.filter.length; i++) {
                var attributeName = defectsearch.searchObj.filter[i].filterType;
                var selectedValue = defectsearch.searchObj.filter[i].filterValue;
                console.log("selectedValue---->>"+selectedValue);
                


                if(selectedValue == "[*]"){
                    selectedValue1 = "[All]";
                }else if(selectedValue.indexOf("*") > 0){
                        var re = /\*/gi
                        var selectedValue1 = selectedValue.replace(re, "All");
                }else{
                    selectedValue1 = defectsearch.searchObj.filter[i].filterValue;
                }
                console.log("selectedValue1---->>"+selectedValue1);
                $("#divFilterTags").append('<span class="tag" fieldName=' + attributeName + '  fieldValue="' + selectedValue.trim() + '" id=tag_' + i + ' style="margin:1px 5px 1px 1px;"><span>' + attributeName + ' : ' + selectedValue1 + '&nbsp;&nbsp;</span><a  parentID=tag_' + i + ' fieldName=' + escape(attributeName) + ' fieldValue='+escape(selectedValue)+' onClick=defectsearch._headerSearchTagFilter(this) title="Removing tag">x</a></span>');
            }

        },

        _onExpandRowSearchFilter: function(event) {

            ISEUtils.portletBlocking("pageContainer");
            var attributeName = $(event).attr("fieldName");
            var selectedValue = event.textContent;

            if (defectsearch.searchObj.filter.length == 0)
                defectsearch.searchObj.filter.push({
                    'filterType': attributeName,
                    'filterValue': selectedValue
                });


            if (defectsearch.searchObj.filter.length >= 1) {

                var flag = defectsearch.key_exists(attributeName, selectedValue, defectsearch.searchObj.filter);

                if (!flag)
                    defectsearch.searchObj.filter.push({
                        'filterType': attributeName,
                        'filterValue': selectedValue
                    });

            }


            defectsearch._refreshFilterDisplay();
            defectsearch._processSearchRequest(true, false);
        },

        _onExpandRowfileLoadCallGraphFilter: function(event) {

            //alert("This feature will be available in next release");
			var defectID = $(event).attr("data-DefectId");
			var fileName = $(event).attr("data-FileId");
			var defTitle = $(event).attr("data-defTitle");
			
			//console.log(defectID+"-->"+fileName+"-->"+defTitle);	
			
			
			
			//$('#defectsearch_txt_FileName').val("");
			
			//"link:\"ih_evc_54290_4\" AND fileslist:\"/vobs/evc_V1/ap/cp/ohm/src/DSCommonTPViewCallback.cpp\""
			var searchString = "link:\""+defectID+"\""+ " AND fileslist:\""+fileName+"\"";
			console.log("searchString --> "+searchString);
			
			
			var requestObject = new Object();

                requestObject.searchString = searchString;
                //requestObject.projectName = defectsearch.projectName;
				requestObject.projectName = localStorage.getItem('multiProjectName');
                requestObject.maxResults = 25;
                requestObject.collectionName = "defect_files_collection";
                requestObject.defTitle = defTitle;
                ISE.getFileDiffSearchResults(requestObject, defectsearch._receivedFileDiffSearchResults);
			
        },
		
		_onExpandRowfileLoadCallGraphFilter1: function(defectID,fileName,defTitle) {

            //alert("This feature will be available in next release");
			//var defectID = $(event).attr("data-DefectId");
			//var fileName = $(event).attr("data-FileId");
			//var defTitle = $(event).attr("data-defTitle");
			
			//console.log(defectID+"-->"+fileName+"-->"+defTitle);	
			
			
			
			//$('#defectsearch_txt_FileName').val("");
			
			//"link:\"ih_evc_54290_4\" AND fileslist:\"/vobs/evc_V1/ap/cp/ohm/src/DSCommonTPViewCallback.cpp\""
			var searchString = "cri:\""+defectID+"\""+ " AND fileslist:\""+fileName+"\"";
			console.log("searchString --> "+searchString);
			
			
			var requestObject = new Object();

                requestObject.searchString = searchString;
                //requestObject.projectName = defectsearch.projectName;
				requestObject.projectName = localStorage.getItem('multiProjectName');
                requestObject.maxResults = 25;
                requestObject.collectionName = "defect_files_collection";
                requestObject.defTitle = defTitle;
                ISE.getFileDiffSearchResults(requestObject, defectsearch._receivedFileDiffSearchResults);
			
        },
		
		
		_receivedFileDiffSearchResults: function(data) {

				console.log(data);
				
				$("#defectsearch_filediffmodalheader").empty();
				$("#defectsearch_filediffmodaldata").empty();  
				$("#defectsearch_filediffmodalfilter").empty();  
				
				var projname="";

			for(var i=0;i<data.length;i++){
				projName = data[i].projName;
				
			}
			var WCNPFlag = false;
			var OMCFlag = false;
			
			if(projName.indexOf("WCNP") != -1) {
				WCNPFlag = true;
				
			}
			
			if(projName.indexOf("OMC") != -1) {
				OMCFlag = true;
				
			}
			//var htmlhead = '<div  style="display:table-row;width:100%;background-color:#404c57;color:white">';
			
			var htmlhead ='<table style="width:100%">';
			
				htmlhead +='<tr style="background-color:#404c57;color:white">';
				if(!OMCFlag)
					htmlhead +='<td style="display:table-cell;width:15%;text-align:left;padding-left:25px;padding-right:5px;font-weight:bold;">CS</td>';
				else 
					htmlhead +='<td style="display:table-cell;width:15%;text-align:left;padding-left:25px;padding-right:5px;font-weight:bold;">CR</td>';
				if(!WCNPFlag && !OMCFlag) {
					htmlhead +='<td style="display:table-cell;width:15%;text-align:left;padding-left:50px;padding-right:5px;font-weight:bold;">CI</td>';
				}
				htmlhead +='<td style="display:table-cell;width:44%;text-align:left;padding-left:90px;padding-right:5px;font-weight:bold;">BranchName</td>';
				htmlhead +='<td style="display:table-cell;width:15%;text-align:left;padding-left:60px;padding-right:5px;font-weight:bold;">Date</td>';
				htmlhead +='</tr></table>';
				//htmlhead +='<span></span></div>'; 	
			
				$("#defectsearch_filediffmodalheader").append(htmlhead);
		
		String.prototype.replaceAll = function(target, replacement) {
							return this.split(target).join(replacement);
						};
						
						
		if (data && data.length > 0) {
      
			var html;
			var html1;

        for (var i = 0; i < data.length; i++) {
		 if(data[i].ModifiedOn == "" || data[i].ModifiedOn == undefined || data[i].ModifiedOn == null){
			data[i].ModifiedOn = "NA"
		  }
		  
		  var eData = data[i].date;
			var time=new Date(eData).toLocaleString();
			time = time.split(",");
		
			var dataArr = "";
			
            if(data[i].filediff!= null) {
				var totalCharactersInEachFileDiff = data[i].filediff.toString().length;
				dataArr = data[i].filediff.toString().split("\n");
			}
			 //document.getElementById("defectsearch_filediffmodalLabel").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;File differences for the file - <span style='font-weight:bold;'>"+data[i].fileslist+"</span>";
			 document.getElementById("defectsearch_filediffmodalLabel").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;File Change History - <span style='font-weight:bold;'>"+data[i].fileslist+"</span>&nbsp;&nbsp;&nbsp;&nbsp;<input type='checkbox' id='defectsearch_txt_FileName' value='"+data[i].fileslist.trim()+"' data-DefectId='"+data[i].cri+"' data-FileId='"+data[i].fileslist.trim()+"' data-defTitle='"+data[i].defTitle+"' onchange=defectsearch._onFileSearchNew()>select all defects</input>";
			 var defTit = data[i].defTitle.replaceAll("_"," ");
			 
			 /*html1 = '<div style="display:table-row;width:100%;height:5px;"></div><div class="page_collapsible" style="display:table-row;width:100%;background:#cccccc;" id="defectsearch_divFileDiff_' + data[i].link + "_" + data[i].branchname + '">' +
             '<div style="display:table-cell;width:25%;text-align:left;padding-left:2px;padding-right:5px;padding-bottom:5px;">&nbsp;&nbsp;  ' + data[i].link + '&nbsp;&nbsp;</div>' +
             //'<div style="display:table-cell;width:25%;text-align:left;padding-left:2px;padding-right:5px;padding-bottom:5px;">' + defTit + '&nbsp;&nbsp;</div>' +
             '<div style="display:table-cell;width:40%;cursor:auto;text-align:left;padding-left:2px;padding-right:5px;padding-bottom:5px;"><label style="cursor:auto;">&nbsp;&nbsp;  ' + data[i].cri + '&nbsp;&nbsp;</label></div>' +
             '<div style="display:table-cell;width:20%;text-align:left;word-break:break-all;padding-bottom:5px;">&nbsp;&nbsp;  ' + data[i].branchname + '&nbsp;&nbsp;</div>' +
             '<div style="display:table-cell;width:10%;padding-left:2px;padding-bottom:5px;">&nbsp;&nbsp;  ' + time[0] + '&nbsp;&nbsp;</div>' +
			 "<p class='FillDiffPopCollpasibleLbls'>" +
             '<span></span></p></div>';*/
			 
			 var html1 ="<table class='table table-striped table-bordered table-hover no-footer dataTable' id='defectsearch_multifilesearch_datatable'>"
				  //for (var i = 0; i < dataCollection.length; i++) {
					
							html1 += '<tr id="defectsearch_filediff_'+data[i].link+'" style="background-color:#cccccc">';
							html1 += '<td>'+data[i].link+'</td>';
							if(!WCNPFlag  && !OMCFlag) {
								if(data[i].cri == undefined)
									html1 += '<td>NA</td>';
                            	 else
								 html1 += '<td>'+data[i].cri+'</td>';

							}
							if(data[i].branchname == undefined)
                              html1 += '<td style="word-break:break-all;">NA</td>';
                            else
								html1 += '<td style="word-break:break-all;">'+data[i].branchname+'</td>';
							html1 += '<td>'+time[0]+'</td>';
							html1 += '</tr>';
					
					//} 
				html1 += '</table>';

			      $("#defectsearch_filediffmodalheader").html('');
			 	  $("#defectsearch_filediffmodalheader").append(html1);
			 
			html = "<div style='width:850px;height:400px;overflow:auto'><div style='width:100%;height:400px;' ><table style='table-layout:fixed;height:431px;'>";

			console.log(dataArr.length);
			console.log(dataArr);
            if (dataArr && dataArr.length > 0) {

                for (var j = 0; j < dataArr.length; j++) {                    

                    var rowData = dataArr[j];
                    var clsName = "filediff";
                    var symb = "";

					/*if ( j < 4) {
						html += "<tr class='" + clsName + "' style='height: 5px;'>";
						html += "<td colspan='2' style='text-align:left;font-family:Courier New;font-size:15px;'>" + rowData + "</td>";
						html += "</tr>";
					}
					else { */
						//var lf = rowData.split("|"); 
					    var leftStr = rowData; 
					    //var rightStr = ""; 
					/*if (lf[0]) 
                        leftStr = lf[0]; 
                    if (lf[1]) 
                        rightStr = lf[1];*/
					var leftStr1 = leftStr.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />');
					if(leftStr[1] == '<' || leftStr[0] == '<'){ 
						html += "<tr class='" + clsName + "' style='height: 5px;'>"; 
						
						//html += "<td style='font-family:Courier New;font-size:15px;'><span style='text-align:left;padding:2px;background-color:rgb(231, 123, 104);'>" + leftStr + "</span></td><td><span style='text-align:left;padding:5px;'>" + rightStr + "</span></td>";
						html += "<td style='font-family:Courier;font-size:15px;'><div style='text-align:left;padding:2px;width:875px;background-color:rgb(122, 232, 122)'><pre>" + leftStr1 + "</pre></div></td>";

						html += "</tr>"; 
						}

						else if(leftStr[1] == '>'|| leftStr[0] == '>'){ 
						html += "<tr class='" + clsName + "' style='height: 5px;'>"; 
						//html += "<td style='font-family:Courier New;font-size:15px;'><span style='text-align:left;padding:2px;background-color:rgb(122, 232, 122)'>" + leftStr + "</span></td><td><span style='text-align:left;padding:5px;'>" + rightStr + "</span></td>";
						html += "<td style='font-family:Courier;font-size:15px;'><div style='text-align:left;padding:2px;width:875px;background-color:rgb(231, 123, 104);'><pre>" + leftStr1 + "</pre></div></td>";
						html += "</tr>"; 
						} 
						else{                                                           

						 html += "<tr class='" + clsName + "' style='height: 5px;'>"; 
						html += "<td style='text-align:left;padding:5px;font-family:Courier;font-size:15px;'>" + leftStr1 + "</td>";

						html += "</tr>"; 
						} 
				//}

					
                }
				
				if ( totalCharactersInEachFileDiff > 32000) {
				html +="<tr><td style='text-align:left;padding:5px;font-family:Courier New;font-size:15px;'>...More</td></tr>";
				}
            }
			 else if (dataArr ==" " ||  dataArr.length == 0) {
			 html +="<tr><td style='padding-bottom:56px;padding-left:304px;'>No data for file difference</td></tr>";
			 }

            html += "</table></div></div>";

            $("#defectsearch_filediffmodaldata").html('');
            $("#defectsearch_filediffmodaldata").append(html);
    }
	 }
				
        },
		
		
		_onFileSearchNew: function() {
			
			var chk = $('#defectsearch_txt_FileName').is(':checked');;
			console.log(chk);
			
			if(chk) {
				var fileName = $('#defectsearch_txt_FileName').val();
				console.log($('#defectsearch_txt_FileName').attr('data-defectid'));
				var searchDefId = $('#defectsearch_txt_FileName').attr('data-defectid');
				defectsearch._onFileSearchAll(fileName,true,searchDefId,false);
			
			}
			else {
				var defectID = $('#defectsearch_txt_FileName').attr("data-DefectId");
				var fileName = $('#defectsearch_txt_FileName').attr("data-FileId");
				var defTitle = $('#defectsearch_txt_FileName').attr("data-defTitle");
				defectsearch._onExpandRowfileLoadCallGraphFilter1(defectID,fileName,defTitle);
			}
		},
		
		_fileSearchKeyUpFunc: function() {
		
			
			var fileName = $('#defectsearch_filesearchInput').val();
			var searchDefId = "";
			if(fileName == "" || fileName == null || fileName =='undefined') {
				document.getElementById("defectsearch_filediffmodalLabel").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;<label data-localize='language.Please Enter File Name'>Please Enter File Name...</label>";
				$("#defectsearch_filediffmodalfilter").empty();
				$("#defectsearch_filediffmodalheader").empty();
				$("#defectsearch_filediffmodaldata").empty();  
				defectsearch.initLocalization();
			}
				
			else {
				
				if(defectsearch.serachTerm != fileName){
					defectsearch.serachTerm = fileName;
					defectsearch.isNewSearchTerm = true;
				}else{
					defectsearch.isNewSearchTerm = false;
				}
				defectsearch._onFileSearchAll(fileName,false,searchDefId,true);
				$('#searchResultsTable .portlet-title .caption').html('Search Results of File Search');
				/* $('#searchResultsTable .portlet-title .caption').text('<label data-localize="language.Search Results of File Search">Search Results of File Search</label>'); */
			//	defectsearch.initLocalization();
			}
		},
		
			_onFileSearchAll: function(fileName,chkbxflag,searchDefId,onlyFileSearch) {
			
            //var fileName = $('#defectsearch_txt_FileName').val();
			
			console.log("File Name -->"+fileName);
			
			if(onlyFileSearch) {
			
			var searchString = "*"+fileName.trim()+"*";
			//var searchString = "fileslist:*"+fileName+"*";
			console.log("searchString --> "+searchString);
			if(!chkbxflag) {
				document.getElementById("defectsearch_filediffmodalLabel").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;<label data-localize='language.File Change History'>File Change History  - </label><span style='font-weight:bold;'>"+fileName+"</span>";
				//document.getElementById("defectsearch_filediffmodalLabel").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;<b>Select File :</b> <select onchange='defectsearch._onCmbFilterChangeWithFile()' id='defectsearch_cmb_FileSearch_Files' tabindex='4'></select>";
				defectsearch.initLocalization();
			} 
			 
				var requestObject = new Object();

                requestObject.searchString = searchString;
                requestObject.searchDefId = searchDefId;
                requestObject.searchFile = fileName.trim();
                requestObject.searchFileFlag = true;
                //requestObject.projectName = defectsearch.projectName;
				requestObject.projectName = localStorage.getItem('multiProjectName');
                requestObject.maxResults = 25;
                requestObject.collectionName = "defect_files_collection";
                ISE.getFileSearchDiffResults(requestObject, defectsearch._receivedOnlyFileDiffSearchResults1);
			
			} else {
			
			var searchString = "fileslist:\""+fileName.trim()+"\"";
			//var searchString = "fileslist:*"+fileName+"*";
			console.log("searchString --> "+searchString);
			if(!chkbxflag) {
				document.getElementById("defectsearch_filediffmodalLabel").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;File Change History  - <span style='font-weight:bold;'>"+fileName+"</span>";
			} 
			 
				var requestObject = new Object();

                requestObject.searchString = searchString;
                requestObject.searchDefId = searchDefId;
                requestObject.searchFile = fileName.trim();
				requestObject.searchFileFlag = false;
                //requestObject.projectName = defectsearch.projectName;
				requestObject.projectName = localStorage.getItem('multiProjectName');
                requestObject.maxResults = 25;
                requestObject.collectionName = "defect_files_collection";
                ISE.getFileDiffSearchResults(requestObject, defectsearch._receivedOnlyFileDiffSearchResults);
			}
						
        },
		
		_receivedOnlyFileDiffSearchResults1:function(data) {
			console.log(data);
			
			var fileNamesArr = new Array();
			var searchfile = "";
			var searchDefId = "";
			var radioFileDiv = "";
			
			for(var i=0;i<data.length;i++) {
					var eachObj = new Object();
					eachObj.fileslist = data[i].fileslist;
					searchfile = data[i].searchFile;
					fileNamesArr.push(eachObj);			
			}
			
			
			//defectsearch.fileDiffCollection = _.uniq(defectsearch.fileDiffCollection.cRsArr);
			fileNamesArr = _.uniq(fileNamesArr, function (object) { return object.fileslist; })
			console.log("after unique of fileNamesArr");
			 
			console.log(fileNamesArr);
			
				$("#defectsearch_filediffmodalheader").empty();
				$("#defectsearch_filediffmodaldata").empty();
				$("#defectsearch_filediffmodalLabel").empty();
				$("#defectsearch_filediffmodalfilter").empty();
				
				if(fileNamesArr.length == 1) {
						//console.log(fileNamesArr[0].fileslist);
						//console.log(searchfile);
						defectsearch._onFileSearchAll(fileNamesArr[0].fileslist,false,searchDefId,false);
				} else if(fileNamesArr.length == 0){
					document.getElementById("defectsearch_filediffmodalLabel").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;<label data-localize='language.No data Available for Searched File'>No data Available for Searched File";
					defectsearch.initLocalization();
				} else {
				
					//radio button code
					$("#defectsearch_filediffmodalLabel").empty();
					
					radioFileDiv += "<div style='padding:10px;'>"
					radioFileDiv += "<div style='padding-5px;background-color:#cccccc;'><label>Multiple Files Found for the Search String- </label>"+"<span style='background-color:yellow'>"+ searchfile +"</span>. <span style='color:blue'>Please Select A file from below...</span></div></br>"
					radioFileDiv += "<p></p>"
					radioFileDiv += "<table class='table table-hover'>"
					
					for(var i=0;i<fileNamesArr.length;i++) {
						radioFileDiv += '<tr><td><input type="radio" name="fileNameId" id="fileNameId" value="'+fileNamesArr[i].fileslist+'" onclick="defectsearch._onfileNameChange(this);">'+fileNamesArr[i].fileslist +'</td></tr>'
					}
					$("#defectsearch_filediffmodalLabel").append(radioFileDiv); 
					
				}
				
		
		},
		
		_onfileNameChange:function(data) {
			
			console.log("data.value @ _onfileNameChange");		
			console.log(data.value);	
			var searchDefId = "";
			
			defectsearch._onFileSearchAll(data.value,false,searchDefId,false);
		
		},
		
		_receivedOnlyFileDiffSearchResultsRelease:function(data) {
			
			defectsearch.releaseCollection.length = 0;
			
			for(var i=0;i<data.length;i++) {
				var fileArr = data[i].file;
				var seachFile = data[i].searchFile;
				console.log(fileArr.indexOf(seachFile));
				if(fileArr.indexOf(seachFile) > -1) {
				
							defectsearch.releaseCollection.push(data[i].release);
							console.log(defectsearch.releaseCollection);
				}
			
			}
			
			var releaseCollection1 = _.unique(defectsearch.releaseCollection);
			console.log(defectsearch.releaseCollection);
			
			defectsearch.fillReleasesCombo(releaseCollection1);		
		
		},
		
		_receivedOnlyFileDiffSearchResults: function(data) {
		
			console.log(data);
			
			if(data.length > 0) {
			
			var cRsArr = new Array();
			var cRIsArr = new Array();
			var branchesArr = new Array();
			var createdOnArr = new Array();
			var fileDiffArr = new Array();
			var filelistArr = new Array();
			
			
			 defectsearch.fileDiffCollection.length = 0;
			 
			 //data = _.uniq(data.link);
			 //console.log("after unique");
			 //console.log(data);
			 
			
			for(var i=0;i<data.length;i++) {
				//if(data[i].filediff != null) {
					var eachObj = new Object();
					eachObj.cRsArr = data[i].link;
					eachObj.cRIsArr = data[i].cri;
					eachObj.branchesArr = data[i].branchname;
					eachObj.createdOnArr = data[i].date;
					eachObj.fileDiffArr = data[i].filediff;
					eachObj.fileslist = data[i].fileslist;
					eachObj.searchFile = data[i].searchFile;
					eachObj.searchDefId = data[i].searchDefId;
					eachObj.projName = data[i].projName;
					eachObj.searchcri = data[i].cri;
					eachObj.searchFileFlag = data[i].searchFileFlag;
					defectsearch.fileDiffCollection.push(eachObj);
				//}
			
			}
			
			
			//defectsearch.fileDiffCollection = _.uniq(defectsearch.fileDiffCollection.cRsArr);
			defectsearch.fileDiffCollection = _.uniq(defectsearch.fileDiffCollection, function (object) { return object.cRsArr; })
			console.log("after unique");
			 
			console.log(defectsearch.fileDiffCollection);
			
			for(var j=0;j<defectsearch.fileDiffCollection.length;j++) {
				cRsArr.push(defectsearch.fileDiffCollection[j].cRsArr);
				cRIsArr.push(defectsearch.fileDiffCollection[j].cRIsArr);
				branchesArr.push(defectsearch.fileDiffCollection[j].branchesArr);
				createdOnArr.push(defectsearch.fileDiffCollection[j].createdOnArr);
				fileDiffArr.push(defectsearch.fileDiffCollection[j].fileDiffArr);
				filelistArr.push(defectsearch.fileDiffCollection[j].fileslist);
				
			
			}
			
			console.log(cRsArr);
			console.log(cRIsArr);
			console.log(branchesArr);
			console.log(createdOnArr);
			console.log(fileDiffArr);
			
			var searchFileFlag = false;
			
			for(var i=0;i<defectsearch.fileDiffCollection.length;i++) {
				searchFileFlag = defectsearch.fileDiffCollection[i].searchFileFlag;
			
			}
			
			$("#defectsearch_filediffmodalfilter").empty();
			
			var htmlhead =""
				
				htmlhead +='<table>';
				
				htmlhead +='<tr>';
				/*if(searchFileFlag) {
				
					htmlhead +='<td>';
					htmlhead +='<div style="display:table-cell;width:50%;padding-right:20px;"><b>Select Branch :</b> <select onchange="defectsearch._onCmbFilterChangeWithFile()" id="defectsearch_cmb_FileSearch_Branches" tabindex="4"></select></div>';
					htmlhead +='</td>';
					
					htmlhead +='<td>';
					htmlhead +='<div style="display:table-cell;width:50%;padding-right:20px;"><b>Select Release :</b> <select onchange="defectsearch._onCmbFilterChangeWithFile()" id="defectsearch_cmb_FileSearch_Release" tabindex="4"></select></div>';
					htmlhead +='</td>';
				
				} else {*/
					htmlhead +='<td>';
					htmlhead +='<div style="display:table-cell;width:50%;padding-right:20px;"><b>Select Branch :</b> <select onchange="defectsearch._onCmbFilterChange()" id="defectsearch_cmb_FileSearch_Branches" tabindex="4"></select></div>';
					htmlhead +='</td>';
					
					htmlhead +='<td>';
					htmlhead +='<div style="display:table-cell;width:50%;padding-right:20px;"><b>Select Release :</b> <select onchange="defectsearch._onCmbFilterChange()" id="defectsearch_cmb_FileSearch_Release" tabindex="4"></select></div>';
					htmlhead +='</td>';
				//}
				htmlhead+='</tr>';
				htmlhead +='</table>';
				
				 $("#defectsearch_filediffmodalfilter").append(htmlhead); 
				 
				defectsearch.fillBrachesCombo(branchesArr);	

				if(searchFileFlag) {				
				
					defectsearch.fillFilesCombo(filelistArr);	
					
				}
				//defectsearch.fillData(cRsArr,cRIsArr,branchesArr,createdOnArr,fileDiffArr,filelistArr);
				defectsearch.fillData(defectsearch.fileDiffCollection);
				
				//to fill release
				var searchStringfile = "";
				var fileName ="";
				
				var releaseQueryStr = "";
				if(data.length>0)
					releaseQueryStr = "(";
				for(var kk=0; kk<data.length; kk++){
					if(kk<data.length-1){
						releaseQueryStr +='_id:"'+data[kk].link+'" OR ';
					}
					else{
						releaseQueryStr +='_id:"'+data[kk].link+'")';
						fileName = data[kk].searchFile
					}
						
				 }
				 searchStringfile = releaseQueryStr;
				 console.log("searchStringfile 3257--->"+searchStringfile);
				 console.log("fileName 3261--->"+fileName);
			
				 var requestObject = new Object();

					requestObject.searchString = searchStringfile;
					requestObject.searchFile = fileName;
					//requestObject.projectName = defectsearch.projectName;
					requestObject.projectName = localStorage.getItem('multiProjectName');
					requestObject.maxResults = 25;
					requestObject.collectionName = "defect_collection";
					ISE.getFileDiffSearchResults(requestObject, defectsearch._receivedOnlyFileDiffSearchResultsRelease);
			
			
			} else {
				var emptyBody = '<span>No data Available for the searched file</span>'
				$("#defectsearch_filediffmodalfilter").empty();
				$("#defectsearch_filediffmodalheader").empty();; 
				 $("#defectsearch_filediffmodaldata").empty();; 
				$("#defectsearch_filediffmodalfilter").append(emptyBody); 
				 
			}
		},
			//fillData :function(cRsArr,cRIsArr,branchesArr,createdOnArr,fileDiffArr,fileListArr) {
			fillData :function(dataCollection) {
			
			console.log("In fill data");
			console.log(dataCollection);
			
			var projname="";
			
			for(var i=0;i<defectsearch.fileDiffCollection.length;i++){
				projName = defectsearch.fileDiffCollection[i].projName;
				
			}
			var WCNPFlag = false;
			var OMCFlag = false;
			
			if(projName.indexOf("WCNP") != -1) {
				WCNPFlag = true;
				
			}
			
			if(projName.indexOf("OMC") != -1) {
				OMCFlag = true;
				
			}
			
			$("#defectsearch_filediffmodalheader").empty();
			$("#defectsearch_filediffmodaldata").empty(); 
			var searchFileFlag = false;
			
			for(var i=0;i<defectsearch.fileDiffCollection.length;i++) {
				searchFileFlag = defectsearch.fileDiffCollection[i].searchFileFlag;
			
			}
				
			if (dataCollection && dataCollection.length > 0) {
				
				var htmlhead =""
				
				htmlhead +='<table>';
				htmlhead +='<tr style="background-color:#404c57;color:white">';
				// Bug 2803 - UI fixes - START
				htmlhead +='<td style="display:table-cell;width:1%;text-align:left;padding-left:40px;padding-right:5px;font-weight:bold;"></td>';
				if(!OMCFlag)
					htmlhead +='<td style="display:table-cell;width:15%;text-align:left;padding-left:23px;padding-right:5px;font-weight:bold;">DefectID</td>';
				else
					htmlhead +='<td style="display:table-cell;width:15%;text-align:left;padding-left:25px;padding-right:5px;font-weight:bold;">CR</td>';
				if(!WCNPFlag && !OMCFlag)
				htmlhead +='<td style="display:table-cell;width:44%;text-align:left;padding-left:1px;padding-right:5px;font-weight:bold;">BranchName</td>';
				if(searchFileFlag) {
					htmlhead +='<td style="display:table-cell;width:44%;text-align:left;padding-left:131px;padding-right:5px;font-weight:bold;">FileName</td>';
				}
				htmlhead +='<td style="display:table-cell;width:15%;text-align:left;padding-left:1px;padding-right:5px;font-weight:bold;">Date</td>';
				htmlhead +='</tr></table>';
				// Bug 2803 - UI fixes - END
				
				 $("#defectsearch_filediffmodalheader").append(htmlhead); 
				 
				 var html ="<table class='table table-striped table-bordered table-hover no-footer dataTable' id='defectsearch_multifilesearch_datatable'>"
				  for (var i = 0; i < dataCollection.length; i++) {
					
						
						 
						 var eData = dataCollection[i].createdOnArr;
						 var time=new Date(eData).toLocaleString();
						 time = time.split(",");
					if(searchFileFlag) {
							var querystr = defectsearch.fileDiffCollection[i].searchFile;
							//var result = defectsearch.fileDiffCollection[i].fileslist;
							var result = dataCollection[i].fileslist;
							var reg = new RegExp(querystr, 'gi');
							var final_str = result.replace(reg, function(str) {return '<b>'+str+'</b>'});
							
							html += '<tr id="defectsearch_filediff_'+dataCollection[i].cRsArr+'" style="background-color:#cccccc">';
							html += '<td><a id='+dataCollection[i].cRsArr+' class="row-details row-details-close" onClick=defectsearch._onExpand1(this)></a></td>';
							html += '<td>'+dataCollection[i].cRsArr+'</td>';
							if(!WCNPFlag  && !OMCFlag) {
								if(dataCollection[i].cRIsArr != undefined)
									html += '<td>'+dataCollection[i].cRIsArr+'</td>';
								else
									html += '<td>No Data</td>';
							}
							if(dataCollection[i].branchesArr != undefined)
								html += '<td style="word-break:break-all;">'+dataCollection[i].branchesArr+'</td>';
							else
								html += '<td>No Data</td>';
							html += '<td style="word-break:break-all;">'+final_str+'</td>';
							if(time[0] != "Invalid Date")
								html += '<td>'+time[0]+'</td>';
							else
								html +='<td>No Data</td>';
							html += '</tr>';
					
					} else {
						if(defectsearch.fileDiffCollection[i].searchDefId == dataCollection[i].cRIsArr) {
						
							html += '<tr id="defectsearch_filediff_'+dataCollection[i].cRsArr+'" style="background-color:#cccccc;font-weight:bold">';
							html += '<td><a id='+dataCollection[i].cRsArr+' class="row-details row-details-close" onClick=defectsearch._onExpand1(this)></a></td>';
							html += '<td>'+dataCollection[i].cRsArr+'</td>';
							if(!WCNPFlag  && !OMCFlag) {
								if(dataCollection[i].cRIsArr != undefined)
									html += '<td>'+dataCollection[i].cRIsArr+'</td>';
								else
									html += '<td>No Data</td>';
							}
							if(dataCollection[i].branchesArr != undefined)
								html += '<td style="word-break:break-all;">'+dataCollection[i].branchesArr+'</td>';
							else
								html +='<td>No Data</td>';
							if(time[0] != "Invalid Date")
								html += '<td>'+time[0]+'</td>';
							else
								html +='<td>No Data</td>';
							html += '</tr>';
							
						} else {
						
							html += '<tr id="defectsearch_filediff_'+dataCollection[i].cRsArr+'" style="background-color:#cccccc">';
							html += '<td><a id='+dataCollection[i].cRsArr+' class="row-details row-details-close" onClick=defectsearch._onExpand1(this)></a></td>';
							html += '<td>'+dataCollection[i].cRsArr+'</td>';
							/* if(!WCNPFlag  && !OMCFlag) {
								if(dataCollection[i].cRIsArr != undefined)
								 html += '<td>'+dataCollection[i].cRIsArr+'</td>';
								else
									html += '<td>No Data</td>';
							} */
							if(dataCollection[i].branchesArr != undefined)	
								html += '<td style="word-break:break-all;">'+dataCollection[i].branchesArr+'</td>';
							else
								html += '<td>No Data</td>';
							if(time[0] != "Invalid Date")
								html += '<td>'+time[0]+'</td>';
							else
								html += '<td>No Data</td>';
							html += '</tr>';
						}
					}
						html +='<tr id="extra_'+ dataCollection[i].cRsArr +'" style="display:none"><td colspan="5">';
						
						
						html +="<div style='width:850px;;height:400px;overflow:auto'><div style='width:100%;height:400px;' ><table style='table-layout:fixed;height:431px;'>";
						
						if(dataCollection[i].fileDiffArr != null) {
							var totalCharactersInEachFileDiff = dataCollection[i].fileDiffArr.toString().length;
							var dataArr = dataCollection[i].fileDiffArr.toString().split("\n");
						if (dataArr && dataArr.length > 0) {
						
						for (var j = 0; j < dataArr.length; j++) {
						
						var rowData = dataArr[j];
                            var clsName = "fileDiffData";
                            var symb = "";
							
							/*if ( j < 4) {
								html += "<tr class='" + clsName + "' style='height: 5px;'>";
								html += "<td colspan='5' style='text-align:left;padding:5px;font-family:Courier New;font-size:15px;'>" + rowData + "</td>";
								html += "</tr>";
							}
							else {*/
								//var lf = rowData.split("|");
								var leftStr = rowData;
								//var rightStr = "";
								
								/*if (lf[0])
									leftStr = lf[0];
								if (lf[1])
									rightStr = lf[1];*/
								var leftStr1 = leftStr.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />');
					
									if(leftStr[1] == '<' || leftStr[0] == '<'){
								html += "<tr class='" + clsName + "' style='height: 5px;'>";
								//html += "<td style='font-family:Courier New;font-size:15px;'><span style='text-align:left;padding:5px;background-color:rgb(231, 123, 104);'>" + leftStr + "</span></td><td><span style='text-align:left;padding:5px;'>" + rightStr + "</span></td>";
								html += "<td style='font-family:Courier;font-size:15px;'><div style='text-align:left;padding:5px;background-color:rgb(122, 232, 122);width:875px'><pre>" + leftStr1 + "</pre></div></td>";
								html += "</tr>";
								}
								else if(leftStr[1] == '>' || leftStr[0] == '>'){
								html += "<tr class='" + clsName + "' style='height: 5px;'>";
								//html += "<td style='font-family:Courier New;font-size:15px;'><span style='text-align:left;padding:5px;background-color:rgb(122, 232, 122)'>" + leftStr + "</span></td><td><span style='text-align:left;padding:5px;'>" + rightStr + "</span></td>";
								html += "<td style='font-family:Courier;font-size:15px;'><div style='text-align:left;padding:5px;background-color:rgb(231, 123, 104);width:875px'><pre>" + leftStr1 + "</pre></div></td>";
								html += "</tr>";
								}
								else{								
								 html += "<tr class='" + clsName + "' style='height: 5px;'>";
								html += "<td style='text-align:left;padding:5px;font-family:Courier;font-size:15px;'>" + leftStr1 + "</td>";
								html += "</tr>"; 
								}
							//}
							
                        }
						
                    }
					if ( totalCharactersInEachFileDiff > 32000) {
						html +="<tr><td style='text-align:left;padding:5px;font-family:Courier New;font-size:15px;'>...more</td></tr>";
						}					
					
				} else {
				
				html += '<tr><td>No Data to Display </td></tr>';
				
				}
				
				html += "</table>";	
				
				}
				 html += "</table>";

                $("#defectsearch_filediffmodaldata").append(html);
		}
			
        },
		
		_onExpand1 :function(event) {
			
				/*var ID = $(event).attr("id");
			if($('#'+ID).hasClass("row-details-close")) {
				$('#'+ID).addClass("row-details-open").removeClass("row-details-close");
				event.parentElement.parentElement.nextSibling.style.display="table-row";
			} else {
				$('#'+ID).addClass("row-details-close").removeClass("row-details-open");
				event.parentElement.parentElement.nextSibling.style.display="none";
			
			}	*/
			if(event.classList[1] == "row-details-close") {
            $(event).addClass("row-details-open").removeClass("row-details-close");
            event.parentElement.parentElement.nextSibling.style.display="table-row";
           }
           else
           {
             $(event).addClass("row-details-close").removeClass("row-details-open");
             event.parentElement.parentElement.nextSibling.style.display="none";

           }
		
		},
		
		
		_onCmbFilterChange :function(event) {
			var selectedbranch = $('#defectsearch_cmb_FileSearch_Branches').val();
			var selectedrel = $('#defectsearch_cmb_FileSearch_Release').val();
			
			console.log("selectedbranch --> "+selectedbranch);
			console.log("selectedrel --> "+selectedrel);
			
			var cRsArr = new Array();
			var cRIsArr = new Array();
			var branchesArr = new Array();
			var createdOnArr = new Array();
			var fileDiffArr = new Array();
			var fileListArr = new Array();
			
			var fileDiffFilterCollection = new Array();
			
			//suresh
			for(var i=0; i<defectsearch.fileDiffCollection.length; i++) {
					var reAry = new Array();
					reAry.push(defectsearch.releaseCollection[i]);
					console.log(reAry.indexOf(selectedrel));
					
					if(defectsearch.deploymenttype != "ALU"){
					if((selectedbranch == "-1" || selectedbranch == defectsearch.fileDiffCollection[i].branchesArr)
							&& (selectedrel == "-1" || reAry.indexOf(selectedrel)>=0)) {
					}
					}
					else
						if((selectedbranch == "-1" || selectedbranch == defectsearch.fileDiffCollection[i].branchesArr)
							&& (selectedrel == "-1" || defectsearch.fileDiffCollection[i].branchesArr.indexOf(selectedrel.substr(1))>=0)) {
							}
					{
			
					var reAry = new Array();
					reAry.push(defectsearch.releaseCollection[i]);
					console.log(reAry.indexOf(selectedrel));
					console.log(selectedbranch == defectsearch.fileDiffCollection[i].branchesArr);
						/*cRsArr.push(defectsearch.fileDiffCollection[i].cRsArr);
						cRIsArr.push(defectsearch.fileDiffCollection[i].cRIsArr);
						branchesArr.push(defectsearch.fileDiffCollection[i].branchesArr);
						createdOnArr.push(defectsearch.fileDiffCollection[i].createdOnArr);
						fileDiffArr.push(defectsearch.fileDiffCollection[i].fileDiffArr);*/
						
						var eachObj = new Object();
					eachObj.cRsArr = defectsearch.fileDiffCollection[i].cRsArr;
					eachObj.cRIsArr = defectsearch.fileDiffCollection[i].cRIsArr;
					eachObj.branchesArr = defectsearch.fileDiffCollection[i].branchesArr;
					eachObj.createdOnArr = defectsearch.fileDiffCollection[i].createdOnArr;
					eachObj.fileDiffArr = defectsearch.fileDiffCollection[i].fileDiffArr;
					eachObj.fileslist = defectsearch.fileDiffCollection[i].fileslist;
					fileDiffFilterCollection.push(eachObj);
					}
			}
			//suresh
			
			/*console.log(cRsArr);
			console.log(cRIsArr);
			console.log(branchesArr);
			console.log(createdOnArr);
			console.log(fileDiffArr);
			console.log(fileListArr);*/
			
			//defectsearch.fillData(cRsArr,cRIsArr,branchesArr,createdOnArr,fileDiffArr,fileListArr);
			defectsearch.fillData(fileDiffFilterCollection);
		
		},
		
		_onCmbFilterChangeWithFile :function(event) {
			var selectedbranch = $('#defectsearch_cmb_FileSearch_Branches').val();
			var selectedrel = $('#defectsearch_cmb_FileSearch_Release').val();
			var selectedFile = $('#defectsearch_cmb_FileSearch_Files').val();
			
			console.log("selectedbranch --> "+selectedbranch);
			console.log("selectedrel --> "+selectedrel);
			console.log("selectedFile --> "+selectedFile);
			
			var cRsArr = new Array();
			var cRIsArr = new Array();
			var branchesArr = new Array();
			var createdOnArr = new Array();
			var fileDiffArr = new Array();
			var fileListArr = new Array();
			
			var fileDiffFilterCollection = new Array();
			
			//suresh
			for(var i=0; i<defectsearch.fileDiffCollection.length; i++) {
					var reAry = new Array();
					reAry.push(defectsearch.releaseCollection[i]);
					console.log(reAry.indexOf(selectedrel));
					
					if((selectedbranch == "-1" || selectedbranch == defectsearch.fileDiffCollection[i].branchesArr)
							&& (selectedrel == "-1" || reAry.indexOf(selectedrel)>=0) 
							&& (selectedFile == "-1" || selectedFile == defectsearch.fileDiffCollection[i].fileslist)
					  )  {
			
					var reAry = new Array();
					reAry.push(defectsearch.releaseCollection[i]);
					console.log(reAry.indexOf(selectedrel));
					console.log(selectedbranch == defectsearch.fileDiffCollection[i].branchesArr);
						/*cRsArr.push(defectsearch.fileDiffCollection[i].cRsArr);
						cRIsArr.push(defectsearch.fileDiffCollection[i].cRIsArr);
						branchesArr.push(defectsearch.fileDiffCollection[i].branchesArr);
						createdOnArr.push(defectsearch.fileDiffCollection[i].createdOnArr);
						fileDiffArr.push(defectsearch.fileDiffCollection[i].fileDiffArr);
						fileListArr.push(defectsearch.fileDiffCollection[i].fileslist);*/
						var eachObj = new Object();
					eachObj.cRsArr = defectsearch.fileDiffCollection[i].cRsArr;
					eachObj.cRIsArr = defectsearch.fileDiffCollection[i].cRIsArr;
					eachObj.branchesArr = defectsearch.fileDiffCollection[i].branchesArr;
					eachObj.createdOnArr = defectsearch.fileDiffCollection[i].createdOnArr;
					eachObj.fileDiffArr = defectsearch.fileDiffCollection[i].fileDiffArr;
					eachObj.fileslist = defectsearch.fileDiffCollection[i].fileslist;
					fileDiffFilterCollection.push(eachObj);
					}
			}
			//suresh
			/*console.log(cRsArr);
			console.log(cRIsArr);
			console.log(branchesArr);
			console.log(createdOnArr);
			console.log(fileDiffArr);
			console.log(fileListArr);
			*/
			//defectsearch.fillData(cRsArr,cRIsArr,branchesArr,createdOnArr,fileDiffArr,fileListArr);
			defectsearch.fillData(fileDiffFilterCollection);
		
		},
		
		fillBrachesCombo :function(arr) {
		if (arr && arr.length > 0) {
		var selCmb = $("#defectsearch_cmb_FileSearch_Branches");
		 $("#defectsearch_cmb_FileSearch_Branches").empty();
		if (selCmb) {
			var newOptionContentAll ='<option value="-1"> All </option>';
			selCmb.append(newOptionContentAll);
			for (var i = 0; i < arr.length; i++) { 
					var fData = arr[i];
						newOptionContent = '<option value="' 
						newOptionContent += fData + '">'+fData + '</option>';
						selCmb.last().append(newOptionContent);
				}
			}
		}
	},
	
	fillFilesCombo :function(arr) {
		if (arr && arr.length > 0) {
		var selCmb = $("#defectsearch_cmb_FileSearch_Files");
		 $("#defectsearch_cmb_FileSearch_Files").empty();
		if (selCmb) {
			var newOptionContentAll ='<option value="-1"> All </option>';
			selCmb.append(newOptionContentAll);
			for (var i = 0; i < arr.length; i++) { 
					var fData = arr[i];
						newOptionContent = '<option value="' 
						newOptionContent += fData + '">'+fData + '</option>';
						selCmb.last().append(newOptionContent);
				}
			}
		}
	},
	
	fillReleasesCombo :function(arr) {
		if (arr && arr.length > 0) {
		var selCmb = $("#defectsearch_cmb_FileSearch_Release");
		 $("#defectsearch_cmb_FileSearch_Release").empty();
		if (selCmb) {
			var newOptionContentAll ='<option value="-1"> All </option>';
			selCmb.append(newOptionContentAll);
			for (var i = 0; i < arr.length; i++) { 
					var fData = arr[i];
						newOptionContent = '<option value="' 
						newOptionContent += fData + '">'+fData + '</option>';
						selCmb.last().append(newOptionContent);
				}
			}
		}
	},//alert("This feature will be available in next release");

       // },


        /**
         * Check if an array key or object property exists
         * @key - what value to check for
         * @search - an array or object to check in
         */
        key_exists: function(key, value, search) {

            if (!search || (search.constructor !== Array && search.constructor !== Object)) {
                return false;
            }
            for (var i = 0; i < search.length; i++) {
                if (search[i].filterType === key && search[i].filterType === key) {
                    return true;
                }
            }
            return key in search;
        },

        _onExpandRowDateTypeSearch: function(event) {



            ISEUtils.portletBlocking("pageContainer");
            var selectedbtnType = $(event).attr("btnType");
            var fieldName = $(event).attr("fieldName");
            var fieldValue = $(event).attr("fieldValue");
            var newDateFormat = ISEUtils.getDateFormat(fieldValue)
            var dateSearchString;

            if (selectedbtnType == "minus") {

                dateSearchString = "[* TO " + newDateFormat + "]";
            } else {

                dateSearchString = "[" + newDateFormat + " TO *] ";
            }

            if (defectsearch.searchObj.filter.length == 0)
                defectsearch.searchObj.filter.push({
                    'filterType': fieldName,
                    'filterValue': dateSearchString,
                      'splitRequired': "false"

                });

            if (defectsearch.searchObj.filter.length >= 1) {

                var flag = defectsearch.key_exists(fieldName, dateSearchString, defectsearch.searchObj.filter);

                if (!flag)
                    defectsearch.searchObj.filter.push({
                        'filterType': fieldName,
                        'filterValue': dateSearchString,
                         'splitRequired': "false"

                    });

            }

            defectsearch._refreshFilterDisplay();
            defectsearch._processSearchRequest(true, false);


        },

        _onExpandRowStatusTypeSearch: function(event) {

            ISEUtils.portletBlocking("pageContainer");
            var selectedbtnType = $(event).attr("btnType");
            var fieldName = $(event).attr("fieldName");
            var fieldValue = $(event).attr("fieldValue");
            var dateSearchString;


            if (selectedbtnType == "open") {

                fieldName = "-" + $(event).attr("fieldName")
                dateSearchString = fieldValue;

            } else {

                dateSearchString = fieldValue;
            }

            if (defectsearch.searchObj.filter.length == 0)
                defectsearch.searchObj.filter.push({
                    'filterType': fieldName,
                    'filterValue': dateSearchString,
                     'splitRequired': "false"
                });

            if (defectsearch.searchObj.filter.length >= 1) {
                var flag = defectsearch.key_exists(fieldName, dateSearchString, defectsearch.searchObj.filter);

                if (!flag)
                    defectsearch.searchObj.filter.push({
                        'filterType': fieldName,
                        'filterValue': dateSearchString,
                         'splitRequired': "false"
                    });

            }

            defectsearch._refreshFilterDisplay();
            defectsearch._processSearchRequest(true, false);


        },


        _getFiltersAsString: function() {


            var filters = '';
            var filtersArr = new Array();

            if (defectsearch.searchObj && defectsearch.searchObj.filter && defectsearch.searchObj.filter.length != 0) {

                for (var i = 0; i < defectsearch.searchObj.filter.length; i++) {
                    if (defectsearch.searchObj.filter[i].filterValue.indexOf("[") == 0)
                    {
                       
                        var filterVlaue = defectsearch.searchObj.filter[i].filterValue.trim();
                         filterVlaue = filterVlaue.substring(1, filterVlaue.length-1);                        
                         var tempArray = filterVlaue.split(',');

                         for(var j=0;j<tempArray.length;j++){
                           /*filters += defectsearch.searchObj.filter[i].filterType.toLowerCase() + ':' + tempArray[j] + ' ';  

                           if(tempArray.length>1 && j != tempArray.length-1 )
                           {
                              filters += "OR "
                           }*/
						   filtersArr.push(defectsearch.searchObj.filter[i].filterType.toLowerCase() + ':' + tempArray[j] + ' ')
                         }                      
                        
                       //filters += defectsearch.searchObj.filter[i].filterType.toLowerCase() + ':' + defectsearch.searchObj.filter[i].filterValue.trim() + ' '; 
                    }                        
                    else
                    {
                        if(defectsearch.searchObj.filter[i].splitRequired == "true")
                        {
                            if(defectsearch.searchObj.filter[i].isDateField =="yes")
                            {
                               
                                var tempDate = defectsearch.searchObj.filter[i].filterValue.split(" ");

                               
                               var searchDate;
                                if(tempDate[0]!="*"){

                                                                   
                                  
                                 var respDate = ISEUtils.getDateTime(tempDate[0]);  

                                   searchDate= '';
                                   searchDate = respDate +"  TO * "
                                   //console.log(myDate);

                                }
                                else if(tempDate[0]=="*")
                                {
                                       
                                   var respDate = ISEUtils.getDateTime(tempDate[2]);                                  
                                   searchDate= '';
                                   searchDate = "* TO "+respDate

                                        
                                }
                               
                                
                                //filters += "date : [ "+ searchDate + "] "
								filtersArr.push("date : [ "+ searchDate + "] ");
                            }
                            else{

                                //filters += defectsearch.searchObj.filter[i].filterValue.trim() +" "
								filtersArr.push(defectsearch.searchObj.filter[i].filterValue.trim() +" ");

                            }
                         
                           
                        }
                        else
                        {
                             //filters += defectsearch.searchObj.filter[i].filterType.toLowerCase() + ':"' + defectsearch.searchObj.filter[i].filterValue.trim() + '" ';
							 filtersArr.push(defectsearch.searchObj.filter[i].filterType.toLowerCase() + ':"' + defectsearch.searchObj.filter[i].filterValue.trim() + '" ');
                        }
                       
                       
                    }
                }
            }
			
			for(var i=0;i<filtersArr.length;i++) {
				if(i != filtersArr.length-1) {
					filters += filtersArr[i] + "AND ";
				} else {
					filters += filtersArr[i];
				}
			
			}

            return filters;
        },


        _headerSearchTagFilter: function(event) {

           
            ISEUtils.portletBlocking("pageContainer");

            var parentID = $(event).attr("parentID");
            $("#" + parentID).remove();

            var fieldName = unescape($(event).attr("fieldName"));
            var fieldValue = unescape($(event).attr("fieldValue")); 
           

            for (var i = 0; i < defectsearch.searchObj.filter.length; i++) {              

                if (defectsearch.searchObj.filter[i].filterType == fieldName && defectsearch.searchObj.filter[i].filterValue == fieldValue)                  
                    defectsearch.searchObj.filter.splice(_.indexOf(defectsearch.searchObj.filter, _.find(defectsearch.searchObj.filter, function (item) { return item.filterValue === fieldValue; })), 1)
            }
            

            defectsearch._processSearchRequest(true, false);

        },

        _analyseBtnClick: function(event) {

            var tempArr = [];
			var defArr = [];
            var parentElement = $(event).parent().get(0);
var selectedDefectid = event.id;
			//console.log("parentElement------"+parentElement);
			//console.log("selectedDefectid------"+selectedDefectid);

            $(parentElement).find("input").each(function() {

                if (this.checked) {
                    tempArr.push(this.value);
defArr.push(selectedDefectid);                }

            });

            sessionStorage.files = tempArr.toString();
sessionStorage.defs = defArr.toString();
            //SIMY CHANGED
            window.location.hash = "#analyzechanges";

        },

        onResizeWindow: function() {

            var windowWidth = $(window).width();
			
            for (var i = 0; i < defectsearch.listCurrentTableId.length; i++) {


                for (var j = 0; j < defectsearch.mobileViewTableColumnCollection.length; j++) {

                    if (defectsearch.listCurrentTableId[i] == defectsearch.mobileViewTableColumnCollection[j].tableID) {
                        var iTD = '#' + defectsearch.mobileViewTableColumnCollection[j].tableID;
                        var table = $(iTD).DataTable();


                        if (windowWidth <= 400) {

                            var matchedCols = [];

                            var cols = [];
                            cols = defectsearch._getColumnNamesList(defectsearch.listCurrentTableId[i]);




                            for (var k = 0; k < defectsearch.mobileViewTableColumnCollection[j].columnsList.length; k++) {
                                var columnName = defectsearch.mobileViewTableColumnCollection[j].columnsList[k];
                                var colIndex = jQuery.inArray(columnName, cols);
                                colIndex += 1;
                                matchedCols.push(colIndex);
                            }



                            for (var l = 1; l < cols.length; l++) {
                                table.column(l).visible(false, false);
                            }

                            for (var k = 0; k < matchedCols.length; k++) {

                                table.column(matchedCols[k]).visible(true, false);
                            }
							 
                            break;

                        } else {

                            var dropdownID = 'columnTogglerDropdown';//defectsearch.mobileViewTableColumnCollection[j].dropdownID;

                            var elements = document.querySelectorAll('#' + dropdownID + ' label input:checked');
                            var selectedColumnsList = new Array();
                            Array.prototype.map.call(elements, function(el, i) {

                                var iCol = parseInt($(el).attr("data-column"));
                                iCol = iCol + 1;
                                selectedColumnsList.push(iCol)

                            });

                            var cols = [];
                            cols = defectsearch._getColumnNamesList(defectsearch.listCurrentTableId[i]);



                            for (var l = 1; l < cols.length; l++) {
                                table.column(l).visible(false, false);
                            }

                            for (var k = 0; k < selectedColumnsList.length; k++) {

                                table.column(selectedColumnsList[k] - 1).visible(true, false);
                            }
							
                            break;

                        }
                    }
                }
            }

        },

        displayAdvacnedSearchHelp: function() {

            var flag = defectsearch.showAdvancedSearchhelp;

            if (!flag) {
                $('#helpPortlet').removeClass('hide');
                defectsearch.showAdvancedSearchhelp = true;
            } else {

                $('#helpPortlet').addClass('hide');
                defectsearch.showAdvancedSearchhelp = false;
            }

        },

        _onBackButtonClick: function() {

            window.history.back();
        },
        _onForwardButtonClick: function() {

            window.history.forward();
        },

        getAdvancedFilterTag:function(advancedSelectedFilterOptions){

              $('#large').modal('hide');          



          for(var i=0;i<advancedSelectedFilterOptions.length;i++)
          {

      
            var result = $.grep(defectsearch.searchObj.filter, function(e){ return e.filterType == advancedSelectedFilterOptions[i].filterType });
         

           if(result.length == 0){
             defectsearch.searchObj.filter.push({
                        'filterType': advancedSelectedFilterOptions[i].filterType,
                        'filterValue':advancedSelectedFilterOptions[i].filterValue,
                        'splitRequired':advancedSelectedFilterOptions[i].splitRequired,
                        'isDateField':advancedSelectedFilterOptions[i].isDateField
                    });
             }
             else if (result.length == 1) {
                 
                if(advancedSelectedFilterOptions[i].requiredToAdd == "true")
                {
                    defectsearch.searchObj.filter.splice(_.indexOf(defectsearch.searchObj.filter, _.find(defectsearch.searchObj.filter, function (item) { return item.filterType === advancedSelectedFilterOptions[i].filterType; })), 1)
                
                   
                     defectsearch.searchObj.filter.push({
                        'filterType': advancedSelectedFilterOptions[i].filterType,
                        'filterValue':advancedSelectedFilterOptions[i].filterValue,
                        'splitRequired':advancedSelectedFilterOptions[i].splitRequired,
                        'isDateField':advancedSelectedFilterOptions[i].isDateField
                    });
                 
                }
                 
             }
          }

           defectsearch._refreshFilterDisplay();  
           var projectName = localStorage.getItem('projectName');


            if ($('#mainSearchTypeTabs').find('.active a').attr('tabid') == "0" || "1" || "2" || "3")
            {
               
              var searchId = $('#searchID').val();

              if(searchId=="")
              {
                
                ISEUtils.portletBlocking("pageContainer");

                defectsearch._getFiltersAsString()


                var requestObject = new Object();



                requestObject.title = "";
                requestObject.searchString = "*";
                requestObject.filterString = defectsearch._getFiltersAsString();
                console.log(requestObject.filterString)
                //requestObject.projectName = projectName;
				requestObject.projectName = localStorage.getItem('multiProjectName');
                requestObject.maxResults = 25;              


                var searchIndexTypes = defectsearch._getSearchIndexTypes();
                defectsearch.searchObj.type = "advanced";              
                defectsearch.searchObj.indexes = searchIndexTypes;


                 console.log(defectsearch._getFiltersAsString())
                for (var i = 0; i < defectsearch.searchObj.indexes.length; i++) {
                    requestObject.collectionName = defectsearch.searchObj.indexes[i];
                    requestObject.filterString = defectsearch._getAdditionalFilters(defectsearch.searchObj.indexes[i],requestObject);
                    ISE.getSearchResults(requestObject, defectsearch._receivedSearchResults);
                }

                  defectsearch._updateURL();
              }
              else
              {
                defectsearch._processSearchRequest(true,false);
              }           


            }
            else if($('#mainSearchTypeTabs').find('.active a').attr('tabid') == "1")
            {
               //serachType = "conextsearch";
            }
            else
            { 
             
           
              //  serachType = "advancedsearch";

            }



         
          //defectsearch._processSearchRequest(true,false);
         

        },
        _getAdditionalFilters: function(collectionName,requestObject) {
            var addlFilter = "";
            $.each(defectsearch.jsonDataCollection.TabArray, function(key, item) {
                if(item.indexName==collectionName) {
                    if(requestObject.filterString && requestObject.filterString != '') 
                        addlFilter= requestObject.filterString +" "+item.additionalFilters;
                    else
                        addlFilter= item.additionalFilters;
                    }
            });
            return addlFilter;
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
			$('#modelInfo').empty();
           //var bodyContent = "<textarea id='similarSearch_moreDescription' class='form-control' style='height:280px' readonly=''>"+moreTextContent+"</textarea>"
           //var bodyContent = "<textarea id='similarSearch_moreDescription' class='form-control' style='height:280px' readonly=''></textarea>"
           //var bodyContent = "<pre>"+moreTextContent+"</pre>"
		   $('#modelInfo').append("<div id='similarSearch_moreDescription' class='form-control' style='height:450px;font-family:Courier' readonly=''></div>");
			
			String.prototype.replaceAll = function(target, replacement) {
							return this.split(target).join(replacement);
					};
					
					moreTextContent = moreTextContent.replaceAll('##','<em class="iseH">');
					moreTextContent = moreTextContent.replaceAll("#","</em>");
					moreTextContent = moreTextContent.replace(/.\t/g,". ");
			document.getElementById("similarSearch_moreDescription").innerHTML = moreTextContent;
           $('#moreInfoModalTitle').text(modalTitle);
          // $('#moreInfoModalTitle').
           
           //$('#modelInfo').append(bodyContent);
           $("#showMoreTextInfoModal").modal("show");         
         
          
   
      },
	  
	  _onRefreshButtonClick:function(){

        //var lastAccessedPage = localStorage.getItem("page");
		$('#searchID').val('')
        $('#contextSearch_searchTitle').val('')
        $('#contextSearch_searchDescription').val('')
        $('#advancedSearch_searchInput').val('')
        $('#similarSearch_searchTitle').val('');
        $('#similarSearch_searchDescription').val('');
        $("#divFilterTags").empty();
        $('#searchResultsTable').addClass("hide");  
        $('#noDataDisplay').removeClass("show"); 
        $('#noDataDisplay').addClass("hide"); 
         defectsearch.searchResultsReceived = false;
         defectsearch.searchObj.input = "";
         defectsearch.searchObj.input2 = "";
         defectsearch.searchObj.filter = [];
		defectsearch._updateURL();
		defectsearch.mainSerachResults = [];
		defectsearch.mainSearchCurrentTab = '0';
		defectsearch.requestSearchCount = 100;
		defectsearch.currentSubSelectedTabIndexs = '';
        // var pageURL = null;

        // if (lastAccessedPage != null) {

            // pageURL = iseConstants.url + "/#" + lastAccessedPage;
            // $(location).attr('href', pageURL);

        // }
      },      

      _onFileWindowDefectClick:function(event){

       
        var defectID = $(event).attr('id');        
         $('#defectsearch_filediffmodal').modal("hide");
          

 /*defectsearch.searchObj.filter.push({
                        'filterType': "_id",
                        'filterValue':defectID,
                        'splitRequired':false,
                        'isDateField':false
                    });*/
          


           $('#mainSearchTypeTabs').find('.active').removeClass('active');
           $('#tab_1_2').removeClass(" active in");
                    $('#tab_1_3').removeClass(" active in");

                    $('#mainSearchTypeTabs').find('li').eq(0).addClass('active');
                    $('#tab_1_1').addClass(" active in");
                    $('#searchID').val(defectID);


                     var searchIndexTypes = defectsearch._getSearchIndexTypes();
                defectsearch.searchObj.type = "similar";
                defectsearch.searchObj.input = defectID;
                defectsearch.searchObj.input2 = "";
                defectsearch.searchObj.indexes = searchIndexTypes;
                defectsearch._processSearchRequest(true, false);



      },

       _downloadDocumentLink:function(event){

        var documentID = unescape($(event).attr('documentID'));
        var indexCollection = unescape($(event).attr('indexCollection'));   
       
        var requestObject = new Object();
        requestObject.collectionName = indexCollection;
        requestObject.searchString = "documentId:" + documentID;
        //requestObject.projectName = defectsearch.projectName;
		requestObject.projectName = localStorage.getItem('multiProjectName');
        requestObject.maxResults = 100;

        ISE.getFileContentsforDownloadFile(requestObject, defectsearch._receivedDownloadFileContents);


        },
		
		 _onSimplifyURL:function(link){

        //window.open("https://simplify.hcl.com/Pages/AddEditKnowledgeUpload.aspx?KnowledgeId="+link,"Simplify")

			var __knowledgeDocData = new Object();
			__knowledgeDocData.doc_id = link;
			__knowledgeDocData.doc_type = 'knowledgeView';
			__knowledgeDocData.current_page_name = "#defectsearch";

			//For Changing URL and providing in Mails Starts.	
			var newURL = window.location.protocol + "//" + window.location.host;
			newURL = newURL + window.location.pathname + "?doc_id=" + __knowledgeDocData.doc_id + "#defectsearch";
			history.pushState("test", "test", newURL);
			//Change URL Ends
			
			localStorage.setItem('selectedKnowledgeViewDoc', JSON.stringify(__knowledgeDocData));
			$(location).attr('hash','#knowledgereadandedit');
        },

        _receivedDownloadFileContents:function(data){

              if (ISEUtils.validateObject(data)) {

                var tempArray = data;
                var fileName = tempArray[0].fileName;
                var fileContents = tempArray[0].documentcontent;

                var documentlink = document.createElement('a');
                documentlink.download = fileName;
                documentlink.href = 'data:application/octet-stream;base64,' + fileContents;
                documentlink.click();
          }
        },
		
		_onExpandRowOpenLink:function(event){

             var sourceLine =  unescape($(event).attr('sourceLine'));          

            var sourceCodeURL = window.location.protocol + "//" + window.location.host;
           // sourceCodeURL = sourceCodeURL + window.location.pathname  + defectsearch.projectName + "/html/"+values[1]; 
             sourceCodeURL = sourceCodeURL + "/DevTest/"  + defectsearch.projectName + "/html/"+sourceLine; 

            var newTab = window.open(sourceCodeURL, '_blank');
            newTab.focus();
        },
		
		_getSelectedIndexName:function(selected_tab_id){
			for(var i=0; i<defectsearch.columnListDetailsArray.length; i++){
				if(selected_tab_id == defectsearch.columnListDetailsArray[i].displayName)
				return defectsearch.columnListDetailsArray[i];
			}
			 
		},
		_uniqueArray:function(list) {
			var result = [];
			$.each(list, function(i, e) {
				if ($.inArray(e, result) == -1) result.push(e);
			});
			return result;
		},

     /**************************************************************
      *** Below function is  related to Developer Work Flow ********* 
     ****************************************************************/

        displayLocalizeDefectWindow:function(){
        

         $.ajax({
            url: "developerworkflow.html",
            type: 'HEAD',
            error: function() {
               console.log("Error")
			   
            },
            success: function() {
              

                $('#developerWorkFlowBodyElement').load("developerworkflow.html", function() {

                     var jsfilename = "js/subpages/developerworkflow.js";
                    $.getScript(jsfilename,function(){
					ISEUtils.portletBlocking("pageContainer");
						var requestObject = new Object();
						if(defectsearch.tabname == 'similarsearch')
						{
                requestObject.title = $('#similarSearch_searchTitle').val().replace(/\//g, " ");
				//requestObject.searchString = requestObject.title + ' ' + $('#similarSearch_searchDescription').val().replace(/\//g, " ");
				requestObject.searchString =  $('#similarSearch_searchDescription').val().replace(/\//g, " ");
			}
			else if(defectsearch.tabname == 'contextsearch')
			{
				 requestObject.title = defectsearch.searchObj.input.replace(/\//g, " ");
				 requestObject.searchString = defectsearch.searchObj.input2.replace(/\//g, " ");
                //requestObject.searchString = requestObject.title + ' ' + defectsearch.searchObj.input2.replace(/\//g, " ");
               // requestObject.filterString = defectsearch._getFiltersAsString();
			}
            //requestObject.projectName = defectsearch.projectName;
			requestObject.projectName = localStorage.getItem('multiProjectName');
            requestObject.maxResults = defectsearch.requestSearchCount;
            requestObject.filterString = defectsearch._getFiltersAsString();
            requestObject.serachType = "conextsearch";

                var collectionName ;
				if(defectsearch.deploymenttype != "CISCO")
				{
						collectionName = defectsearch._getSelectedIndexName('SourceCode').indexes
				}
				else
				{
					collectionName = defectsearch._getSelectedIndexName('FileDiff').indexes
				}
                requestObject.collectionName = collectionName;
				requestObject.deploymenttype = defectsearch.deploymenttype;
                requestObject.filterString = defectsearch._getAdditionalFilters(collectionName,requestObject);
                ISE.getSearchResults(requestObject, defectsearch._calldefectlocalization);
				
				//developerworkflow.init();             //developerworkflow.getInitializeData(defectsearch.similarSearchDefectIDInformation,defectsearch.sourceCollectionResults,defe           ctsearch.defectFilesCollectionResults);
                       

                     });

                   $('#developerWorkFlowWindow').modal('show');

                    $("#developerWorkFlowComponentClose").on("click", function (e) {
                    
                          
                        //   defectsearch.sourceCollectionResults = new Array();
                         // defectsearch.defectCollectionObject = new Array();
                           
                           $('#developerWorkFlowWindow').modal('hide');
						   document.getElementById("developerWorkFlowWindow").style.display = "none";
						   document.getElementById("developerWorkFlowWindow").className = "modal fade"
						  $('.modal-backdrop.fade.in').remove();
						  ISEUtils.portletUnblocking("pageContainer");
                        
                        });

                    });

                  

                
            }
			
        });


      },
	  
	  
	  
	  
	  displayDefectLocalizationWindow:function(){
			defectsearch. defectIdSearVal = $('#searchID').val();
			console.log("*********finding Defect Localization for Defect *********"+defectsearch. defectIdSearVal);
				
			$.ajax({
				url: "defectLocalizationWorkflow.html",
				type: 'HEAD',
				error: function() {
				   console.log("Error")
				},
				success: function() {
				
					$('#developerWorkFlowBodyElement').load("defectLocalizationWorkflow.html", function() {

						 var jsfilename = "js/subpages/defectLocalizationWorkflow.js";
						$.getScript(jsfilename,function(){
							 ISEUtils.portletBlocking("pageContainer");
						   // defectLocalizationWorkflow.init();
							defectLocalizationWorkflow.getInitializeData("","",defectsearch.defectIdSearVal);
						 });

					   $('#developerWorkFlowWindow').modal('show');

						$("#developerWorkFlowComponentClose").on("click", function (e) {
							  $('#developerWorkFlowWindow').modal('hide');
							
							});
						});
				}
			}); 
      },
	  _calldefectlocalization :function(data)
	  {
		defectsearch.sourceCollectionResults = [];
		if(data !=undefined && data !=null )
		{
			for (var i = 0; i < data.length; i++) 
			{
                
              defectsearch.sourceCollectionResults.push(data[i]);
			}
		}
		 developerworkflow.init();
		 if(defectsearch.tabname == 'similarsearch')
		 {
         developerworkflow.getInitializeData(defectsearch.similarSearchDefectIDInformation,defectsearch.sourceCollectionResults,defectsearch.defectFilesCollectionResults,defectsearch.deploymenttype);
		 }
		else if(defectsearch.tabname = 'contextsearch')
		{
			//defectsearch.similarSearchDefectIDInformation =[];
			var eachobj = new Object();
			eachobj.date = new Date();
			var defectData = new Array();
			defectData.push(eachobj);
		 developerworkflow.getInitializeData(defectData,defectsearch.sourceCollectionResults,defectsearch.defectFilesCollectionResults,defectsearch.deploymenttype);
		
		}
	  },
	  
	  _receivedTestExceResultsForRelease: function(data) {

				//console.log("_receivedTestExceResultsForRelease----"+data);
				defectsearch.testExcefileReleaseArr = [];
				//var releaseValue = '';
				
				for(var i=0;i<data.length;i++) {
					var eachObj = new Object();
					eachObj.environment = data[i].environment;
					//eachObj.executed by = data[i].executed by;
					eachObj.executionid = data[i].executionid;
					eachObj.last_updated_date = data[i].last_updated_date;
					eachObj.release = data[i].release;
					//releaseValue = data[0].release;
					eachObj.status = data[i].status;
					eachObj.title = data[i].title;
					eachObj.updated_by = data[i].updated_by;
					eachObj.testcaseid = data[i].testcaseid;
					defectsearch.testExcefileReleaseArr.push(eachObj);
			}
			//console.log("defectsearch.testExcefileReleaseArr-----"+defectsearch.testExcefileReleaseArr)
		},
		_onExpandRowTestcaseDetails: function(event) {

				var testcaseID = $(event).attr("data-DefectId");
				var searchString = "testcaseid:\""+testcaseID+"\"";
				console.log("searchString *** testcaseID --> "+searchString);
				var requestObject = new Object();
                requestObject.searchString = searchString;
                requestObject.projectName = defectsearch.projectName;
                requestObject.maxResults = 2500;
                requestObject.collectionName = "test_executions_collection";
                ISE.getTestExceResults(requestObject, defectsearch._receivedTestExceResultsForPopup);
				//ISE.getTestExceResults(requestObject, defectsearch._receivedTestExceResults);
			
        },
		_receivedTestExceResultsForPopup: function(data) {

				$('#modelInfo').empty();
				console.log(data);
				var testExcefileNamesArr = new Array();
				testExcefileNamesArr = [];
				
				for(var i=0;i<data.length;i++) {
						var eachObj = new Object();
						eachObj.environment = data[i].environment;
						//eachObj.executed by = data[i].executed_by;
						eachObj.executionid = data[i].executionid;
						eachObj.last_updated_date = data[i].last_updated_date;
						eachObj.release = data[i].release;
						eachObj.status = data[i].status;
						eachObj.title = data[i].title;
						eachObj.updated_by = data[i].updated_by;
						eachObj.testcaseid = data[i].testcaseid;
						testExcefileNamesArr.push(eachObj);
				}
				console.log("testExcefileNamesArr---data--"+testExcefileNamesArr)
				
				var htmlhead1 = '<div  style="display:table-row;width:100%;background-color:#404c57;color:white">';
				var htmlhead1 ='<table style="width:100%">';
				htmlhead1 +='<tr style="background-color:#404c57;color:white">';
				htmlhead1 +='<td style="display:table-cell;width:15%;text-align:left;padding-left:25px;padding-right:5px;font-weight:bold;">Date Of Execution</td>';
				htmlhead1 +='<td style="display:table-cell;width:15%;text-align:left;padding-left:84px;padding-right:5px;font-weight:bold;">Assigne</td>';
				htmlhead1 +='<td style="display:table-cell;width:43%;text-align:left;padding-left:151px;padding-right:5px;font-weight:bold;">Status</td>';
				htmlhead1 +='<td style="display:table-cell;width:27%;text-align:left;padding-left:1px;padding-right:5px;font-weight:bold;">Environment</td>';
				htmlhead1 +='</tr></table>';
				var html1 = '<div  style="display:table-row;width:100%;background-color:#404c57;color:white">';
				var html1 ='<table class="table table-striped table-bordered table-hover no-footer dataTable" style="width:100%">';
				for (var ii = 0; ii < testExcefileNamesArr.length; ii++) {
				
					html1 +='<tr style="background-color:#80898d;color:white">';
					html1 += '<td style="width:193px">'+testExcefileNamesArr[ii].last_updated_date+'</td>';
					html1 += '<td style="width:196px">'+testExcefileNamesArr[ii].updated_by+'</td>';
					html1 += '<td style="width:216px">'+testExcefileNamesArr[ii].status+'</td>';
					html1 += '<td style="word-break:break-all;width:258px">'+testExcefileNamesArr[ii].environment+'</td>';
					html1 += '</tr>';
					
				}
				html1 +='</tr></table>';

				
				//htmlhead +='<span></span></div>';
				var htmlhead = '<table style="color: #333;"><tr><td style="width:50%"><b>Test Case ID :</b>&nbsp;&nbsp;&nbsp; '+testExcefileNamesArr[0].testcaseid +'</td></tr><tr><td><b>Test Case Name : </b>&nbsp;&nbsp;&nbsp; '+testExcefileNamesArr[0].title +'</td></tr><tr><td style="width:50%"><b>Release : </b>&nbsp;&nbsp;&nbsp;'+testExcefileNamesArr[0].release +'</td></tr><tr><td style="width:50%"><b>Execution ID :</b>&nbsp;&nbsp;&nbsp; '+testExcefileNamesArr[0].executionid +'</td></tr><tr><td style="width:50%"><b>Updated By :</b>&nbsp;&nbsp;&nbsp; '+testExcefileNamesArr[0].updated_by +'</td></tr><tr><td style="width:50%"><b>Last Updated Date :</b>&nbsp;&nbsp;&nbsp; '+testExcefileNamesArr[0].last_updated_date +'</td></tr></table>';
				
				$('#moreInfoModalTitle').text("TestExecution Details....");
				$('#modelInfo').append(htmlhead);
				$('#modelInfo').append('<br>');
				$('#modelInfo').append(htmlhead1);
				$('#modelInfo').append(html1);
				$("#showMoreTextInfoModal").modal("show");
        },
		btnShowDashboard:function(){ 
		    window.frames['dashboardUrlName'].location.reload();
		    $('#dashboardUrl').attr('src',"../DevTest/dashboard/index.html#/dashboard/"+iseConstants.graphName+"?embed&title:Defect Insights&_g=(time:(from:now-5y,mode:quick,to:now))&_a=(filters:!(),query:(query_string:(analyze_wildcard:!t,query:'"+defectsearch.graphsQueryStr+"')))&amp;hidebar=1" );
			$("#showDashboard").modal("show");
		}
    };
