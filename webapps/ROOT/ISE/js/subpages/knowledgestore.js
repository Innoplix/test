var knowledgestore = {

//Variable Decleration
	knowledgestore_table:'',
	rows_selected:[],
	fromDate:'',
	toDate:'',
	checkedValAry: [],
	releaseAry: [],
	featureAry: [],
	technologyAry: [],
	selectedTime : {},
	moreFilterObj : {},
	timeSelecteValue :"daysContainer",
	allDeleteDocs:[],
	jsonTableDetails:[],
	columnListDetailsArray:{},
	mobileViewTableColumnCollection:[],
	hideTableColumns:[],
	crIdFileds:[],
	requestSearchCount:500,
	json_doc_data: {},
	docDetails:{},
	userRole:'',
	allowEditKnowledge:false,
	filterStarRatingNumber:0,
	searchTerm:'',
	isNewSearchTerm:'',
	searchObj: new Object(),
	storedGeneralTabFilterData:{},
	storedMoreFilterSelection:{},
	featureFieldName:'',
	releaseFieldName:'',
	streamFieldName:'',
	activitiesFieldName:'',
	ratingFieldName:'',
	StatusFieldName:'',
	technologyFieldName:'',
	selectedPackage:'0',
	packageInfo:[],	
	newpackagename:'',
    serviceName:"JscriptWS",
    methodname:"loadOrSaveJsonData",
    hostUrl:'/DevTest/rest/',
    userConfigData :{}, 
	actionsRef:'',
	morefilterActiveTab:'General',
	
	reinit:function(){
		knowledgestore.actionsRef._setCurrentPage(ikePageConstants.KNOWLEDGE_STORE);
		knowledgestore.actionsRef._setTargetPage(ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
		knowledgestore._advanceSearch();
	},
    /* Init function  */
    init: function() {
		 //date picker
		if (jQuery().datetimepicker) {
            $('.date-picker').datetimepicker({
				autoclose: true,
                rtl: Metronic.isRTL(),
                orientation: "left",
                format: "yyyy-mm-ddThh:ii",
				endDate: '+0d',
            }); 
		}	
		
		knowledgestore._filterSearchPortletHeaderDropDown();

        

		knowledgestore.userRole = localStorage.getItem('rolename');
		
		$('#page_knowledgestore #searchDoc').on('focus',function()
        {
			//$(this).val('');
        });
		
		
		
		$('#page_knowledgestore #knowledgePackageInfoModal #existingPackageList').on('change', function() {
				
				knowledgestore.selectedPackage = $( this ).val();								
		});
		
		$('#page_knowledgestore #knowledgePackageInfoModal #packageName').on('change', function() {
				
				knowledgestore.newpackagename = $( this ).val();								
		});
		
			
		$("#page_knowledgestore #moreFiltersBtn").on('click', function(){
			knowledgestore.getMoreFilterJsonInfo();			
		});
		$("#page_knowledgestore #fromDate").change(function() {
			knowledgestore.fromDate =  $(this).val();
		});
		$("#page_knowledgestore #toDate").change(function() {
			knowledgestore.toDate = $(this).val();			
		});
		$('.has-clear input[type="text"]').on('input propertychange', function() {
		  var $this = $(this);
		  var visible = Boolean($this.val());
		  $this.siblings('.form-control-clear').toggleClass('hidden', !visible);
		  if(visible)
		  $("#page_knowledgestore #searchKDoc").removeClass('disabled')
		else
		  $("#page_knowledgestore #searchKDoc").addClass('disabled')
		}).trigger('propertychange');

		$('.form-control-clear').click(function() {
		  $(this).siblings('input[type="text"]').val('')
			.trigger('propertychange').focus();
		}); 
		$('.has-clear input[type="text"]').keyup(function (e) {
			if (e.keyCode == 13) {				
            				
			}
		});

        $('#page_knowledgestore #searchDoc').keyup(function (e) {
			if (e.keyCode == 13) 
			{
            knowledgestore._advanceSearchFunc();				
				knowledgestore._setUserPrefernce("SearchText");	
			}
		});

		$("#page_knowledgestore #searchKDoc").on('click', function(){			
			knowledgestore._advanceSearchFunc();
			knowledgestore._setUserPrefernce("SearchText");            
		});
	   	
		$("#page_knowledgestore #chksmartfaq").on('click', function(){			
			knowledgestore._advanceSearchFunc();
			knowledgestore._setUserPrefernce("SearchText");            
		});

		$('#page_knowledgestore #sortDropdown').on('change', function() {
		  var sort_val =$(this).val() ;
		  console.log(" Sort value : "+sort_val);
		  console.log("This function for sort the table TODO");
		  
		});
	 
		$('.nav-tabs a').on('shown.bs.tab', function(event){
			knowledgestore.morefilterActiveTab = $(event.target).text();
		})
	 
		$("#page_knowledgestore #addNewContentDoc").on('click', function (e) {
			console.log("This is function is for  Add New Content Document. TODO");
		});
		$("#page_knowledgestore #docPrint").on('click', function (e) {
			console.log("This is function is for Print Document. TODO");
		});
		$("#page_knowledgestore #exportToPDF").on('click', function (e) {
			console.log("This is function is for Export to PDF. TODO");
		});
		$("#page_knowledgestore #exportToExcel").on('click', function (e) {
			console.log("This is function is for Export to Excel. TODO");
		});

     		$("#page_knowledgestore #docEleAddPackage").on('click', function (e) {
			if(knowledgestore.rows_selected.length <=0)  
			{  
				alert("Please select at-least one document to Package.");  
			}else{
				
				var c = confirm('Are you sure you want to package these knowledge(s)?');
				if(c){
                      // Binding existing package
					  knowledgestore._fillPackageList();
					  
					  $('#page_knowledgestore #docEleAddPackage').addClass('disabled');
					  $('#page_knowledgestore #docEleDelete').addClass('disabled');
					  $("#page_knowledgestore #knowledgePackageInfoModal").modal('show');
					  console.log("Selected Knowledge values are : "+JSON.stringify(knowledgestore.rows_selected));
				}
			}
			
		});
		
		$("#daysContainerRadios").change(function () {
			$("#daysContainer").show();
			$("#dateContainer").hide();	
			knowledgestore.timeSelecteValue = "daysContainer";
		});
		
		$("#dateContainerRadios").change(function () {
		   $("#dateContainer").show();
		   $("#daysContainer").hide();
		   knowledgestore.timeSelecteValue = "dateContainer";
		});
		
		$("#page_knowledgestore #knowledgePackageInfoModal #newContainerRadios").change(function () {
			$("#nameContainer").show();
			$("#selectPackageContainer").hide();	
		
		});
		
		$("#page_knowledgestore #knowledgePackageInfoModal #addContainerRadios").change(function () {
		   $("#selectPackageContainer").show();
		   $("#nameContainer").hide();
		   
		});

		//Defining role to enable Delete and Add to knoledge package.
		
		knowledgestore._allowPermission(knowledgestore.userRole.toLowerCase());
		knowledgestore.onLoadActionComponent();
		
		if(iseConstants.EnableSmartFAQ)
			{
				
				
				$('#FAQContainer').show();
					
			
			}
		else
			{
				$('#FAQContainer').hide();
				
			}	
		
		
		//SHAILCODE
		if (window.location.hash == '#knowledgestore') 
		{
                var p = knowledgestore._getParams(window.location.search);
                if(p.gQuery != null) {
                    ISEUtils.portletBlocking("pageContainer");

                    var searchIndexTypes = knowledgestore._getTableIndexName();
                    knowledgestore.searchObj.type = "advanced";
                    knowledgestore.searchObj.input = decodeURIComponent(p.gQuery);
                    knowledgestore.searchObj.input2 = "";
					$('#page_knowledgestore #searchDoc').val(knowledgestore.searchObj.input);
					
					
					if(p.gQueryD != null)
						knowledgestore.searchObj.input2 = decodeURIComponent(p.gQueryD);
					
					var requestObject = new Object();

					requestObject.title = knowledgestore.searchObj.input;
					requestObject.searchString = requestObject.title;
					requestObject.projectName = localStorage.getItem('multiProjectName');
					requestObject.maxResults = knowledgestore.requestSearchCount;
					requestObject.serachType = "";			
					requestObject.collectionName = "kb_docs_collection";
					ISE.getSearchResults(requestObject, knowledgestore._receivedSearchResults);	
	            }
        }
		
		knowledgestore._InitAutocompleteText();
		
		
    },
    //end of init
	
	_InitAutocompleteText:function(){
		$('#page_knowledgestore #searchDoc').textcomplete(
			[{			 
				match: /(\w*)$/,
				index: 1, // default = 2
				search: function (term, callback, match) {
					console.log("match.input : "+match.input);
					if(match.input.length > 1){
						var trimmedQuery = (match.input).replace(/\n/g, '').replace(/\s+/g, ' ').toLowerCase();					
						var _query = trimmedQuery;
						
						var serviceName='JscriptWS'; 
						var hostUrl = '/DevTest/rest/';
						var methodname = 'contextSearch'
						var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&sname='+methodname;
						var requestObject = new Object();
						requestObject.searchString = _query;
						requestObject.username = localStorage.getItem('username');
						requestObject.collectionName =  iseConstants.str_docs_collection;
						requestObject.maxResults = 10;
						requestObject.isAutoSuggestQuery = true;
																
						$.ajax({
							type: 'POST',
							url: Url,
							data: JSON.stringify(requestObject),
							crossDomain: true,
							async: false,
							success: function (data) {
							//Do stuff with the JSON data
								results = JSON.parse(data);								
								callback($.map(results.data.autocomplete.buckets, function (word) {
									return word.key ;
								}))
						  },
						  error: function (data) {
							 callback([]);
						  }
						})										
					}
					else
					{
						callback([]);
					}
				},
				replace: function (item) {
					return item;
				} 
			}]
		).on({
				'textComplete:select': function (e, value, strategy) {
				   // alert(value);
				   $('#page_knowledgestore #searchDoc').val(value);
				   $("#page_knowledgestore #searchKDoc").trigger( "click" );
				   $(this).data('autocompleting', false);
				},
				'textComplete:show': function (e) {
					$(this).data('autocompleting', true);					
				},
				'textComplete:hide': function (e) {
					$(this).data('autocompleting', false);
				}
			});
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

//SHAILCODE
    // filter data saved into json

    _PerformSavedSearch : function()
    {
     var response = knowledgestore._loadUserDefaultConfigData();
     if(response=="yes")
     {
			if(knowledgestore.userConfigData.SearchText)
       {
				$("#page_knowledgestore #searchDoc").val(knowledgestore.userConfigData.SearchText);

				if(knowledgestore.userConfigData.knowledgeFilters)
       {     
					knowledgestore.moreFilterObj = JSON.parse(knowledgestore.userConfigData.knowledgeFilters);        
       }
         knowledgestore._addSearchTextTag();
         knowledgestore._advanceSearchFunc();
       }
			else
			{
				$("#page_knowledgestore #searchDoc").val("*");
				knowledgestore._advanceSearchFunc();	
			}		
		}
		else
		{
			$("#page_knowledgestore #searchDoc").val("*");
			knowledgestore._advanceSearchFunc();			
     }
    },

    SearchByTag :function(sourceObject)
    {
     $('#page_knowledgestore #searchDoc').val("tags:"+$(sourceObject).text());
       knowledgestore._advanceSearchFunc();
    },

    _loadUserDefaultConfigData:function(){ //salim
		
		//var  save = knowledgestore._saveJSON( hostUrl, serviceName, methodname, false, userDefaultConfigData, "no");
		var url = hostUrl + knowledgestore.serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&sname='+knowledgestore.methodname;
		var jsonData =  { username : localStorage.getItem('username') ,  operation : 'loadJsonData' }; 
		
		var  result = knowledgestore._loadJSON( 'POST', 'json', false, url, jsonData );
		
		if ( result.fileExists == "true"){
			try{					
				knowledgestore.userConfigData = JSON.parse(result.data);
			}catch(e){		
				console.log(''+e);
				return "no";
			}
			return "yes";
		}
	 return "no" ;
    },
    _setUserPrefernce:function( key, value){  //Gourik: To set user filter
		
		
		var url = hostUrl + knowledgestore.serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&sname='+knowledgestore.methodname;
		var jsonData =  { username : localStorage.getItem('username') ,  operation : 'loadJsonData' }; 
		var  result = knowledgestore._loadJSON( 'POST', 'json', false, url, jsonData );
		if ( result.fileExists == "false"){
			jsonData.data = {};
		}else if ( result.fileExists == "true"){
			try{					
				jsonData.data = JSON.parse(result.data);
			}catch(e){		
				console.log(''+e);
				return;
			}
		}
        if(key=="knowledgeFilters")
        {
         jsonData.data.knowledgeFilters = value ;          
        }
		
		jsonData.data.SearchText = $("#page_knowledgestore #searchDoc").val();
		jsonData.operation='saveJsonData';
		var s =knowledgestore._saveJSON( hostUrl, serviceName, methodname, false, jsonData);
			
	},
    _loadJSON:function( type, dataType, async, url, jsonData ){ 
			
			var result = "";
			$.ajax({ type : type, dataType : dataType, async: async, url : url,data: JSON.stringify(jsonData),
					success : function(msg) {	
						try{
							
							result =JSON.parse(JSON.stringify(msg));
						}catch(e){
							console.log("Parsing Error:  ");
							console.log(''+e);
						}
						console.log("success : Data loaded ");	
					},
					error: function(msg) {						
					 console.log("failure : Data not loaded");
					  console.log(msg);
					}
				} );	
			
		return result;
	},

    _saveJSON: function( hostUrl, serviceName, methodname, async, jsonData ){
			
		var result = "";
		var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&sname='+methodname;
		
		$.ajax({
				type: "POST",
				url: Url,
				async: async,
				data: JSON.stringify(jsonData),
				success: function(msg) {					
					try{
							
							result =JSON.parse(JSON.stringify(msg));
						}catch(e){
							console.log("Parsing Error:  ");
							console.log(''+e);
						}
				},
				error: function(msg) {					
					 console.log("failure :");
					 console.log(msg);
				}
				
				});
				   
	   return result;
	},

    /* End of functions for filter data saved*/
	
	_AddPackageInfoToArray:function(packageID, dataObj)
	{
		knowledgestore.packageInfo[packageID] = dataObj;
	},
	
	_GetPackageInfoToArray:function(packageID)
	{
		return knowledgestore.packageInfo[packageID];
	},
				
	_fillPackageList: function(){
		
			var requestObject = new Object();

			requestObject.title = "*";
			requestObject.searchString = requestObject.title;
			requestObject.projectName = localStorage.getItem('multiProjectName');
			requestObject.maxResults = knowledgestore.requestSearchCount;
			requestObject.serachType = "";			
			requestObject.collectionName = "package_collection";
			ISE.getSearchResults(requestObject, knowledgestore._receivedPackageSearchResults);			
		},
	
	_receivedPackageSearchResults:function(dataObj, is_old_data){
		
		if (ISEUtils.validateObject(dataObj)) 
		{
			$('#page_knowledgestore #knowledgePackageInfoModal #existingPackageList').empty(); 					
			var newOptionContentSelect = '<option value=0>--select package--</option>';
			$('#page_knowledgestore #knowledgePackageInfoModal #existingPackageList').append(newOptionContentSelect); 					
				
			for (var i = 0; i < dataObj.length; i++) 
			{                                  
				var packageIdColumnName = "_id";
				var packageNameColoumnName = "package_title";

				var newOptionContent = '<option ';
			   
				var packageID = escape(dataObj[i][packageIdColumnName]);
				var packageName = escape(dataObj[i][packageNameColoumnName]);
				
				knowledgestore._AddPackageInfoToArray(packageID, dataObj[i]);
				
				newOptionContent += ' value=' + packageID + '>' + decodeURI(packageName) + '</option>';
								
				$('#page_knowledgestore #knowledgePackageInfoModal #existingPackageList').append(newOptionContent); 
				
			}					
			$("#page_knowledgestore #knowledgePackageInfoModal").modal('show');
		}
	},
		
	_AddKnowledgeToPackage:function()
	{
		
		var radioValue = $("input[name='newPackageContainerRadios']:checked"). val();
		var selectedPackageVal = $("#page_knowledgestore #knowledgePackageInfoModal input[name='newPackageContainerRadios'][type='radio']:checked").attr("value")
		var proceed = true;

		if(radioValue =='Addtoexisting' &&  knowledgestore.selectedPackage == 0)
		{
			alert("Select package to add selected knowledge !!");
			proceed = false;
			return;
		}
		
		if(proceed && radioValue =='New' &&  knowledgestore.newpackagename.length == 0)
		{	
			alert("Select package name to create!!");
			proceed = false;
			return;
		}
		
		if(proceed && knowledgestore.rows_selected.length == 0)
		{	alert("No knowledge records selected !! Select knowledge to add first.");
			proceed = false;
			return;
		}
		
		if (proceed)
		{
			if (knowledgestore.rows_selected.length > 0)
			{
				var tableID = '#page_knowledgestore #kwdgStoreTable';
				var oTable =  $(tableID).dataTable();
				var Insertflag =false;
				
				var objPackage;
				if(radioValue =='Addtoexisting')
					objPackage = knowledgestore._GetPackageInfoToArray(knowledgestore.selectedPackage);					
				else
				{
					Insertflag =true;
					objPackage = new Object;
					var uniqueID = Math.floor( Math.random() * 1000 ) + Date.now();
					objPackage.package_title = knowledgestore.newpackagename;
					
				}
				
				var arrKnowledge = objPackage.Documents;
				
				if (arrKnowledge === undefined)
				{
					arrKnowledge = new Array();
				}
										
				for(var i=0; i<knowledgestore.rows_selected.length; i++)
				{
					var nTr = knowledgestore.rows_selected[i];
					
					var aData = oTable.fnGetData(nTr);

					var knowledgeID = $(aData[1]).text();
					
					var KnowledgeTitle = $(aData[2]).text();

					var objKnowledge = new Object();
					
					//objKnowledge.knowledgeID = knowledgeID;
                    objKnowledge._id = knowledgeID;
					
					objKnowledge.title = KnowledgeTitle;
					
					//var index = arrKnowledge.map(function(x) {return x.knowledgeID; }).indexOf(objKnowledge.knowledgeID);
                    var index = arrKnowledge.map(function(x) {return x._id; }).indexOf(objKnowledge._id);

					if(index === -1)
					{
						arrKnowledge.push(objKnowledge);
					} 												
				}
				objPackage.package_descriptions = objPackage.description;
				objPackage.Documents = arrKnowledge;
				objPackage.addType = selectedPackageVal;
				//objPackage.packageName = objPackage.name;
            
				
				localStorage.removeItem('selectedKnowledgePackage'); 
				localStorage.setItem('selectedKnowledgePackage', JSON.stringify(objPackage));
				knowledgestore.rows_selected=[];
				// Removing selection of the rows after added to the package
				$("#"+knowledgestore.tableID+" .checkboxes:checked").each(function() {  
                  $(this).attr('checked', false);
                  $(this).closest("span").removeAttr("class");
                 });

                 $(".group-checkable").attr('checked', false);
                 $(".group-checkable").closest("span").removeAttr("class");

				 
				 localStorage.removeItem('PreviousScreen'); 
                 localStorage.setItem('PreviousScreen', ikePageConstants.KNOWLEDGE_STORE);

				
				$(location).attr('hash','#knowledgeaddpackage');
				
				/* if(Insertflag)
				{
					ISE.InsertPackageEntryMongo(objPackage, knowledgestore._UpdatePackageResultHandler);
				}
				else 
				{
					ISE.UpdatePackageEntryMongo(objPackage, knowledgestore._UpdatePackageResultHandler);
				} */
				

			 }
			 else
			 {
				
				alert("No knowledge records selected !! Select knowledge to add first.");
			 }
		}
		
		
		$("#page_knowledgestore #knowledgePackageInfoModal").modal('hide');
        knowledgestore.rows_selected=[];
        // Removing selection of the rows after added to the package
        $("#page_knowledgestore #kwdgStoreTable .checkboxes:checked").each(function() {  
							$(this).attr('checked', false);
                            $(this).closest("span").removeAttr("class");
						});

		
	},
	_UpdatePackageResultHandler: function(data_obj){
		$.notific8('Knowledge has been added successfully.', {
			 life: 2000,
			 theme: 'lime',
			 sticky: false,
			 zindex: 11500
		});			
	},

    // Begin of advance search
    
	_advanceSearchFunc: function() 
	{
       if ($('#page_knowledgestore #searchDoc').val().length >= 1) 
		{
			if($('#page_knowledgestore #searchDoc').val()!='*')
			{
				localStorage.setItem('LastSearchedtext',$('#page_knowledgestore #searchDoc').val());
			}
			else 
			{
				localStorage.removeItem('LastSearchedtext');
			}
			

              var searchText = $('#page_knowledgestore #searchDoc').val();
              if (searchText.includes("#")) {
                  var tag = searchText.match(/#\w+/g);

                  if (tag) {
                      if (tag.length > 0) {
                          for (var i = 0; i < tag.length; i++) {
                              var strTemp = tag[i].replace("#","");
                              searchText = "tags:" + strTemp;
                              $('#page_knowledgestore #searchDoc').val(searchText)
                              break;
                          }
                      }
                  }
              }

			//Pace.start();				 
			if(knowledgestore.searchTerm != $('#page_knowledgestore #searchDoc').val())
			{
				knowledgestore.searchTerm = $('#page_knowledgestore #searchDoc').val();
				knowledgestore.isNewSearchTerm = true;
			}
			else
			{
				knowledgestore.isNewSearchTerm = false;
			}
			
			ISEUtils.portletBlocking("pageContainer");
			
//			knowledgestore.searchObj.type = "context";
//			knowledgestore.searchObj.input = $('#page_knowledgestore #searchDoc').val();
//			knowledgestore.searchObj.input2 = $('#page_knowledgestore #searchDoc').val();
//			knowledgestore._processSearchRequest(true);


            knowledgestore.searchObj.type = "advanced";
            knowledgestore.searchObj.input = '';
            knowledgestore.searchObj.input2 =searchText;// $('#page_knowledgestore #searchDoc').val();
            knowledgestore.searchObj.indexes = iseConstants.str_docs_collection;
            knowledgestore._processSearchRequest(true);
                

		}

	},
	
	_processSearchRequest: function(updateURL)//, updateDisplay) 
	{
		console.log('~~~~~ _processSearchRequest  ~~~~~ ');
		if( knowledgestore.searchObj.lastSearch) {
			if ( (Date.now() - knowledgestore.searchObj.lastSearch) < 1500) {
				console.log("Trying to search within 1.5 seconds again, there is some bug in your code !! performing no search");
				return;
			}
		}
		knowledgestore.searchObj.lastSearch = Date.now();
				
		if (updateURL) {
			knowledgestore._updateURL();
		}
		
		if (knowledgestore.searchObj.type == 'context') {
			
			var requestObject = new Object();

			requestObject.title = knowledgestore.searchObj.input.replace(/\//g, " ");
			requestObject.searchString = requestObject.title + ' ' + knowledgestore.searchObj.input2.replace(/\//g, " ");
			requestObject.filterString = knowledgestore._getFiltersAsString();
			requestObject.projectName = localStorage.getItem('multiProjectName');
			requestObject.maxResults = knowledgestore.requestSearchCount;
			requestObject.isAnalyzerRequired = true;
			requestObject.serachType = "conextsearch";
			
		   	var collectionName = knowledgestore._getTableIndexName();
			requestObject.collectionName = collectionName;
			requestObject.filterString = knowledgestore._getSecurityFilters(collectionName,requestObject);
			requestObject.filterString = knowledgestore._getAdditionalFilters(requestObject);
			requestObject.filterString = knowledgestore._getFAQFilter(requestObject);
			ISE.getSearchResults(requestObject, knowledgestore._receivedSearchResults);		
		}
        
		if (knowledgestore.searchObj.type == 'advanced') 
		{

                var requestObject = new Object();
                requestObject.title = knowledgestore.searchObj.input.replace(/\//g, " ");
                requestObject.searchString = knowledgestore.searchObj.input2.replace(/\//g, " ");
                requestObject.filterString = knowledgestore._getFiltersAsString();
                requestObject.maxResults = knowledgestore.requestSearchCount;
			    requestObject.isAnalyzerRequired = true;
                // for sorting
                requestObject.sortByField = "published_at";
                requestObject.sortOrder = "desc";
                requestObject.serachType = "";
                requestObject.collectionName =  iseConstants.str_docs_collection; 
			requestObject.filterString = knowledgestore._getAdditionalFilters(requestObject);
				requestObject.filterString = knowledgestore._getFAQFilter(requestObject);
				
                ISE.getSearchResults(requestObject, knowledgestore._receivedSearchResults);
               
            }           
	},
	
	_getAdditionalFilters: function(requestObject) 
	{
		var addlFilter = "";
		$.each(knowledgestore.jsonTableDetails.TableDetails, function(key, item) {
			if(requestObject.filterString && requestObject.filterString != '') 
				addlFilter = requestObject.filterString + " " + item.additionalFilters;
			else
				addlFilter = item.additionalFilters;
		});
		return addlFilter;
    },
	
	_getSecurityFilters: function(collectionName,requestObject) 
	{
			var addlFilter = "";
			var securityfilter  ="(Security_LevelValue:true";
			securityfilter  = securityfilter + " OR Security_LevelValue:" + localStorage.getItem('projectName');
			securityfilter  = securityfilter + " OR Security_LevelValue:" + localStorage.getItem('organization') +")";
			
			if(requestObject.filterString && requestObject.filterString != '') 
				addlFilter = requestObject.filterString + " AND " + securityfilter;
			else
				addlFilter = securityfilter;
			
		
		return addlFilter;
    },
	
	_getFAQFilter: function(requestObject) 
	{		var FAQFilter = requestObject.filterString;
			var FAQFilterstring = "isFaq:true";
			if(!document.getElementById('chksmartfaq').checked)
			{
				return FAQFilter
			}
			else 
			{
				if(requestObject.filterString && requestObject.filterString != '') 
					FAQFilter = requestObject.filterString + " AND " + FAQFilterstring;
				else
					FAQFilter = FAQFilterstring;
			}
			
		
		return FAQFilter;
    },
	
	
	_encodeSpecialText: function(key, value) {
            if (typeof value === "string") {
                return encodeURIComponent(value);
            }
            return value;
        },
		
	_updateURL: function() {
		var s = JSON.stringify(knowledgestore.searchObj, knowledgestore._encodeSpecialText);
		var newURL = window.location.protocol + "//" + window.location.host;
		newURL = newURL + window.location.pathname + "?SearchObj=" + s + "#knowledgestore";
		history.pushState("test", "test", newURL);
	},
	
	_getFiltersAsString: function()
	{	
		var filters = '';
        var filtersArr = new Array();

		if (knowledgestore.moreFilterObj) 
		{	
			if (knowledgestore.moreFilterObj.general)
			{
				for( var filter in knowledgestore.moreFilterObj.general.data)
				{
					if (knowledgestore.moreFilterObj.general.data[filter].data)
					{
						var filterString = '';
						if (typeof knowledgestore.moreFilterObj.general.data[filter].data == "object")
						{
							for (var index in knowledgestore.moreFilterObj.general.data[filter].data)
							{
								filterString = (filterString == '') 
												? knowledgestore.moreFilterObj.general.data[filter].fieldName + ":" + knowledgestore.moreFilterObj.general.data[filter].data[index]
												: filterString + " OR " + knowledgestore.moreFilterObj.general.data[filter].fieldName + ":" + knowledgestore.moreFilterObj.general.data[filter].data[index];													
							}
						}
						else if (typeof knowledgestore.moreFilterObj.general.data[filter].data == "string")
						{
							if (knowledgestore.moreFilterObj.general.data[filter].data.includes(" "))
							{
								var value =  knowledgestore.moreFilterObj.general.data[filter].data.split(" ") 
								filterString = knowledgestore.moreFilterObj.general.data[filter].fieldName + " : >=" + value[0].trim();
							}
							else
								filterString = knowledgestore.moreFilterObj.general.data[filter].fieldName + ":" + knowledgestore.moreFilterObj.general.data[filter].data;
						}
						
						filtersArr.push(filterString);
					}
				}				
			}						
			if (knowledgestore.moreFilterObj.contents)
			{
				var filterString = '';
				for (var i = 0; i < knowledgestore.moreFilterObj.contents.filterVal.length; i++)
				{
					switch(knowledgestore.moreFilterObj.contents.filterVal[i])
					{
						case "Dashboard":
						case "Visualization":
							filterString = (filterString == '') 
											? "graphType:" +  knowledgestore.moreFilterObj.contents.filterVal[i]
											: filterString + " OR " + "graphType:" +  knowledgestore.moreFilterObj.contents.filterVal[i];
			
						break;
						case "Documents":
							filterString = (filterString == '')
											? "assetType:File"
											: filterString + " OR " + "assetType:File";
						break;										
						case "Url":							
							filterString = (filterString == '') 
											? "assetType:" +  knowledgestore.moreFilterObj.contents.filterVal[i]
											: filterString + " OR " + "assetType:" +  knowledgestore.moreFilterObj.contents.filterVal[i];		
						break;
					}
				}
				filtersArr.push(filterString);	
			}			
			if (knowledgestore.moreFilterObj.time)			
			{
				switch(knowledgestore.moreFilterObj.time.filterName)
				{	
					case "Quick Time":					
						var filterValue = "";
						if (knowledgestore.moreFilterObj.time.filterVal.includes(" "))
						{
							var tempDate = knowledgestore.moreFilterObj.time.filterVal.toLowerCase().split(" ") 
							for (var i = 0; i < tempDate.length; i++)
							{
								filterValue = (filterValue !== "") ? filterValue + "_" + tempDate[i] : tempDate[i];									
							}								
						}
						else
						{
							filterValue = knowledgestore.moreFilterObj.time.filterVal.toLowerCase();
						}
						
						var respDate = ISEUtils.getDateTime(filterValue);  
						searchDate= '';
						searchDate = respDate +"  TO * "           
						
						filtersArr.push(knowledgestore.moreFilterObj.time.fieldName.trim() + " : [ "+ searchDate + "]");
						
						break;
					case "Date Range":
						
						var startDate = new Date(knowledgestore.fromDate);
						startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset()); 
						var endDate = new Date(knowledgestore.toDate);
						endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset()); 
						
						var startDateString = startDate.getUTCFullYear() 
												+ "-" + knowledgestore._pad(startDate.getUTCMonth() + 1) 
												+ "-" + knowledgestore._pad(startDate.getUTCDate()) 
												+ "T" + knowledgestore._pad(startDate.getUTCHours()) 
												+ ":" + knowledgestore._pad(startDate.getUTCMinutes());
												
						var endDateString = endDate.getUTCFullYear() 
												+ "-" + knowledgestore._pad(endDate.getUTCMonth() + 1) 
												+ "-" + knowledgestore._pad(endDate.getUTCDate()) 
												+ "T" + knowledgestore._pad(endDate.getUTCHours()) 
												+ ":" + knowledgestore._pad(endDate.getUTCMinutes());
						
						var searchDate = startDateString + " TO " + endDateString;
						
						filtersArr.push(knowledgestore.moreFilterObj.time.fieldName.trim() + " :[ " + searchDate + "]");
											
						break;
				}
			}
		}
		
		for(var i=0;i<filtersArr.length;i++) 
		{
			if(i != filtersArr.length-1) 
			{
				filters += filtersArr[i] + " AND ";
			} 
			else 
			{
				filters += filtersArr[i];
			}			
		}

		if (filters.length > 0)
		{
			filters = filters 	+ " AND (projectName:" 
								+ localStorage.getItem('multiProjectName') 
								+ " OR projectName:" + localStorage.getItem('organizationName')
								+ " OR projectName:iPublicDocs)"; 
		}
		else
		{		
			filters = "(projectName:" + localStorage.getItem('multiProjectName') 
								+ " OR projectName:" + localStorage.getItem('organizationName')
								+ " OR projectName:iPublicDocs)"; 
		}
		
		return filters;		
	},
	
	_pad: function(number) 
	{
		if (number < 10) 
		{
			return '0' + number;
		}
		return number;
	},
		
	_initStarEvents: function(){
		$('.kv-gly-star').rating({
			containerClass: 'is-star'
		});
		
		$('#moreFiltersPopup .rating,.kv-gly-star').on('change', function () {
			knowledgestore.filterStarRatingNumber = parseInt($(this).val());
		});
	},
	_allowPermission: function(user_role){
		
		switch(user_role){
			case 'admin':
				knowledgestore.allowEditKnowledge = true;
			break;
			default:
				knowledgestore.allowEditKnowledge = false;
				$("#page_knowledgestore #docEleAddPackage").hide();
				$("#page_knowledgestore #docEleDelete").hide();;			
			break;
		}
	},
	 _filterSearchPortletHeaderDropDown: function() {

		var roleName = localStorage.getItem('rolename');


		$('#page_knowledgestore #searchKDFilterDropdown').empty();
		 
		
		$.getJSON("json/tableDetails.json?"+Date.now(), function(data) {

			knowledgestore.jsonTableDetails = data;
			
			knowledgestore.columnListDetailsArray = {};
			$.each(data.TableDetails, function(key, item) {
			 
				//  Filter Search List will be added based on role.
				if (item.enable == "yes") {

					for (var i = 0; i < item.allowedroles.length; i++) {

						if (item.allowedroles[i] == roleName) {

							var displayName = item.displayName;

							$('#page_knowledgestore .kd-table-conatainer').append('<div class="col-sm-12 table-scrollable1 table-responsive"><table class="table table-striped table-bordered table-hover dataTable" id="kwdgStoreTable"></table></div>')
							$('#page_knowledgestore #kwdgStoreTable').append("<thead><tr id=tableheader_" + displayName + "></tr></thead><tbody id=tablebody_" + displayName + "></tbody>");

							// Set Table Heading for all columns
							 //if(knowledgestore.allowEditKnowledge)
                                                             // Empty column name for first column                                        
								$('#page_knowledgestore #tableheader_' + displayName).append('<th class="table-checkbox"><input type="checkbox" name="group-checkable" class="group-checkable" data-set="#page_knowledgestore #kwdgStoreTable .checkboxes"/></th>');
							//else
							//	$('#page_knowledgestore #tableheader_' + displayName).append('<th class="table-checkbox"><input type="checkbox" name="group-checkable" class="group-checkable disabled" disabled="disabled" data-set="#page_knowledgestore #kwdgStoreTable .checkboxes" readonly/></th>');

							for (var j = 0; j < item.Details.fields.length; j++) {                                

								if(item.Details.fields[j].displayType != "expansion")
								$('#page_knowledgestore #tableheader_' + displayName).append("<th class='sorting ISEcompactAuto'>" + item.Details.fields[j].displayName + "</th>");
							}
							
							var dropDownBoxId = "columnToggler_" + displayName;
							var tableID = 'page_knowledgestore #kwdgStoreTable' ;
							var _obj = new Object();
							_obj.dropDownBoxId = 'KDColumnTogglerDropdown';
							_obj.tableID = tableID;
							_obj.defaultView = item.defaultView;
							_obj.itemDetailsfields = item.Details.fields;
							_obj.indexes = item.indexName;
							_obj.displayName = displayName;
							
							knowledgestore.columnListDetailsArray = _obj;

							knowledgestore.mobileViewTableColumnCollection.push({
								"tableID": 'page_knowledgestore #kwdgStoreTable',
								"columnsList": item.mobileView,
								"dropdownID": 'columnToggler_' + displayName
							});
						}
					}
					  
				}
					 
			});
			
			var getCurrentSelectedTabData = knowledgestore.columnListDetailsArray;
			knowledgestore._fillColumnListinDropdown(getCurrentSelectedTabData.dropDownBoxId, getCurrentSelectedTabData.tableID, getCurrentSelectedTabData.defaultView, getCurrentSelectedTabData.itemDetailsfields);
			var elements = document.querySelectorAll('#page_knowledgestore #searchKDFilterDropdown label input:checked');
			Array.prototype.map.call(elements, function(el, i) {
				if(i>0)
				{
					$(el).removeAttr("checked");
					var resultsTabId = $(el).attr("resultTabID");
					var resultsTabInnerContainerID = $(el).attr("resultTabInnerContainerID");
					$("#page_knowledgestore #" + resultsTabId).addClass("hide");
					$("#page_knowledgestore #" + resultsTabInnerContainerID).removeClass("active in");
				}               
			});
            // if not requested from browser plugin
            var p = knowledgestore._getParams(window.location.search);
            if(!p.gQuery) 
            {
            if(localStorage.getItem('TagName'))
              {
               $('#page_knowledgestore #searchDoc').val(localStorage.getItem('TagName'));
               knowledgestore._advanceSearchFunc();
               localStorage.removeItem('TagName')
              }
              else
              {
              knowledgestore._PerformSavedSearch(); 
             }
            }
           
		});
	},

    _advanceSearch: function()
    {
     if(localStorage.getItem('TagName'))
     {
      $('#page_knowledgestore #searchDoc').val(localStorage.getItem('TagName'));
      knowledgestore._advanceSearchFunc();
      localStorage.removeItem('TagName')
     }
    },
	
	_fillColumnListinDropdown: function(dropDownBoxId, tableID, defaultColumnView, ColumnsList) {

		$('#page_knowledgestore #' + dropDownBoxId).empty();

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
				   knowledgestore.crIdFileds.push(crIdArr[0][j]); 
			  } 
			  }

	   
		var colunmnID = 0;
		var tableColumnID = 0;
		var tableHideColumns = new Array();
		$.grep(tempArr, function(element) {

			colunmnID = colunmnID + 1;


			if ($.inArray(element, defaultColumnView) !== -1) {

				$('#page_knowledgestore #' + dropDownBoxId).append('<label><input type="checkbox" name="column" checked="true" columnID=' + colunmnID + '  data-column=' + colunmnID + '>' + element + '</label>');
			} else {

				tableColumnID = colunmnID + 1;
				tableHideColumns.push(parseInt(tableColumnID));
				$('#page_knowledgestore #' + dropDownBoxId).append('<label><input type="checkbox" name="column"  columnID=' + colunmnID + ' data-column=' + colunmnID + '>' + element + '</label>');

			}

		});

		knowledgestore.hideTableColumns.push({
			"tableID": tableID,
			"hideColumnsList": tableHideColumns,
			"allColumnsNames": tempArr
		});


		$('input[type="checkbox"]', '#' + dropDownBoxId).change(function(e) {

		   var iCol = parseInt($(this).attr("data-column"));
			var oTable = $('#' + tableID).dataTable();
			var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
			oTable.fnSetColumnVis(iCol, bVis ? false : true);
			var chkVal = $(this).parent().text();
			if(bVis)
				knowledgestore._insertOrDeleteDefaultTableColValue(chkVal, 'remove');
			else
				knowledgestore._insertOrDeleteDefaultTableColValue(chkVal, 'insert');
			
			var table_wrapper = $('#page_knowledgestore #' + tableID+'_wrapper')
			if( table_wrapper.width() > oTable.width() )
			{
				table_wrapper.css('overflow-x', 'visible')
			}else{
				table_wrapper.css('overflow-x', 'none')
			}
             e.stopImmediatePropagation();
		});

        $('input[type="checkbox"]', '#page_knowledgestore #' + dropDownBoxId).click(function(e) {
        
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
			knowledgestore.requestSearchCount = $( this ).val();
		});

	},
	_insertOrDeleteDefaultTableColValue:function(chkVal, action)
	{
		if( knowledgestore.columnListDetailsArray.displayName)
		{
			if(action=='insert')
			{
				knowledgestore.columnListDetailsArray.defaultView.push(chkVal);
			}
			else if(action=='remove')
			{
				var k = knowledgestore.columnListDetailsArray.defaultView.indexOf(chkVal);
				if(k != -1) 
				{
					knowledgestore.columnListDetailsArray.defaultView.splice(k, 1);
				}
			 }
			 knowledgestore.columnListDetailsArray.defaultView = knowledgestore._uniqueArray(knowledgestore.columnListDetailsArray.defaultView);
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
		
	_receivedSearchResults: function(dataObj) 
	{		

		$('#page_knowledgestore #docActionContainer .kwdg-store-doc-count').text("0"+' Results')		
		if (ISEUtils.validateObject(dataObj)) 
		{		
			var FieldsMap = {};
			var DisplayNameMap = {};
			var displayColumns = {};
			var tC = {};

			knowledgestore.json_doc_data = dataObj
		 
			for (var K in knowledgestore.jsonTableDetails.TableDetails) 
			{
				var temp = new Array();
				for(var l=0;l<knowledgestore.jsonTableDetails.TableDetails[K].Details.fields.length;l++)
				{
					var obj =knowledgestore.jsonTableDetails.TableDetails[K].Details.fields[l];
					if(obj.displayType != "expansion")                          
						temp.push(obj);                         

				}

				FieldsMap[knowledgestore.jsonTableDetails.TableDetails[K].indexName] = temp;
				DisplayNameMap[knowledgestore.jsonTableDetails.TableDetails[K].indexName] = knowledgestore.jsonTableDetails.TableDetails[K].displayName;
				displayColumns[knowledgestore.jsonTableDetails.TableDetails[K].indexName] = knowledgestore.jsonTableDetails.TableDetails[K].defaultView;
			}


			var sortField = 1;
			var fields = FieldsMap[dataObj[0]._index];
			for (var ii = 0; ii < fields.length; ii++) 
			{
				if (fields[ii].SourceName == 'similarity') sortField = ii + 1;
			}

//            if(sortField == 9)
//             sortField =6;
             
            
			for (var i = 0; i < dataObj.length; i++) 
			{
			
				var issimilarDefectId = false;
				var fields = FieldsMap[dataObj[i]._index];
				var dName = DisplayNameMap[dataObj[i]._index];
				var tableID = '#page_knowledgestore #kwdgStoreTable';
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
				//if(knowledgestore.allowEditKnowledge)
					var newRowContent = '<tr class="odd gradeX" data-row-id="'+row_inc+'"><td><input document-id="'+documentID+'"  type="checkbox" class="checkboxes" value="'+row_inc+'"/></td>';
				//else
				//	var newRowContent = '<tr class="odd gradeX" data-row-id="'+row_inc+'"><td><input document-id="'+documentID+'"  type="checkbox" class="checkboxes disabled" disabled="disabled" value="'+row_inc+'"/></td>';	
				
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
							updatedSince = knowledgestore._getLastUpdatedDateTime(newDateObj);	
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
									subTextContent = knowledgestore.remove_tags(subTextContent);
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
									//newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype='+ fields[ii].displayType +' >' +subTextContent+'<a modalTitle='+fields[ii].displayName+'  moreTextContent="' + escapeContent + '" class="name" onClick="knowledgestore._onExpandRowMoreContentModal(this)">  more... </a></span></td>';
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
											textVal = "<div style='cursor:pointer;' onclick='knowledgestore.SearchByTag(this);'>" + textVal + "</div>";									
									if (typeof arrContent[j] == "object")
									{									
										textVal = textVal + "<div style='cursor:pointer;' onclick='knowledgestore.SearchByTag(this);'>" + arrContent[j][fields[ii].propertyName] + "</div>";
									}
									else
										{
										textVal = textVal + "<div style='cursor:pointer;' onclick='knowledgestore.SearchByTag(this);'>" + arrContent[j] +"</div>";
									}								
								}
											}
							else
											{
								textVal ="<div style='cursor:pointer;' onclick='knowledgestore.SearchByTag(this);'>" + arrContent +"</div>";
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
						else
						{								
							newRowContent += '<td class="ISEcompactAuto"><span sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';
						}
					}								  					
				}
				 
				newRowContent += '</tr>';
				$('#page_knowledgestore #tablebody_' + dName).append(newRowContent);				
			}
			
			for (var tab in tC) 
			{
				var tableColumnsCount = $(tab).find('tr')[0].cells.length;
				var tempArr = new Array();
				for(var i=1;i<tableColumnsCount;i++)
				{
					tempArr.push(i);                    
				}
				knowledgestore._handleUniform();
				knowledgestore.knowledgestore_table =  $('#page_knowledgestore #kwdgStoreTable').DataTable({
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
				
				var total_rec_count = $("#page_knowledgestore #kwdgStoreTable").DataTable().page.info().recordsTotal;
				$('#page_knowledgestore #docActionContainer .kwdg-store-doc-count').text(total_rec_count+' Results')
				
				$("#page_knowledgestore tbody #kdTitleRow").live('click', function(e){
					var doc_id = $(this).attr("doc-id");
					console.log("Selected Knowledge: "+doc_id)
					
					var __knowledgeDocData = new Object();
					__knowledgeDocData.doc_id = $(this).attr("doc-id");
					__knowledgeDocData.doc_title = $(this).text();
					__knowledgeDocData.doc_type = 'knowledgeEdit';
					__knowledgeDocData.current_page_name = ikePageConstants.KNOWLEDGE_STORE;
				
					//For Usage Metrics
					var usageData = new Object();
					var eventName = "similarSearch";
					
					usageData.KnowledgeID = __knowledgeDocData.doc_id;
					usageData.UserId = localStorage.getItem('username');
					
					ISEUtils.logUsageMetrics(eventName, usageData); //uncomment this line to start logging knowledge usage
					//For Usage Metrics
								
					//For Changing URL and providing in Mails Starts.	
					var newURL = window.location.protocol + "//" + window.location.host;
					newURL = newURL + window.location.pathname + "?doc_id=" + __knowledgeDocData.doc_id + "#knowledgestore";
					history.pushState("test", "test", newURL);
					//Change URL Ends
					localStorage.removeItem('selectedKnowledgeEditDoc');
					localStorage.removeItem('selectedKnowledgeViewDoc');						
					localStorage.setItem('selectedKnowledgeEditDoc', JSON.stringify(__knowledgeDocData));
					$(location).attr('hash','#knowledgereadandedit');
				});
				
				$("#page_knowledgestore tbody #kdMoreInfoBtn").live('click', function(e){
					console.log("e: ~~~ "+e);
					console.log($(this).attr("doc-id"));
					
					var docID = $(this).attr("doc-id");
					knowledgestore.docDetails = knowledgestore._getDocDetails(docID);
					
					var title = knowledgestore.docDetails.title;
					title = title.replaceAll("&nbsp;", " ");
					title = title.replaceAll("<em class='iseH'>", " ");
					title = title.replaceAll("</em>", " ");
					
					$("#popover_container .popover-heading").text((title));
										 
					$("[data-toggle=popover]").popover({
						html : true,
						container: '#popover_container',
						title:function() {
						  var title = $(this).attr("data-popover-content");
						  return $(title).children(".popover-heading").html();
						},
						content: knowledgestore._getPopoverBodyContent(knowledgestore.docDetails)
					});
				});
				
				$('#page_knowledgestore #kwdgStoreTable tbody').on('click', 'input[type="checkbox"]', function(e)
				{
					var $row = $(this).closest('tr');

					// Get row data
					var data = knowledgestore.knowledgestore_table.row($row).data();
					// Get row ID
					var rowId = data[0];					
					// Determine whether row ID is in the list of selected row IDs 
					var index = $.inArray($row[0], knowledgestore.rows_selected);

					// If checkbox is checked and row ID is not in list of selected row IDs
					if(this.checked && index === -1){
						knowledgestore.rows_selected.push($row[0]);
						
					// Otherwise, if checkbox is not checked and row ID is in list of selected row IDs
					} 
					else if (!this.checked && index !== -1)
					{
						knowledgestore.rows_selected.splice(index, 1);
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
					knowledgestore._updateDataTableSelectAllCtrl(knowledgestore.knowledgestore_table);
					if(knowledgestore.rows_selected.length > 0)
					{
                        // allowed for admin only
                        //if(knowledgestore.allowEditKnowledge)
                        //{
							$('#page_knowledgestore #docEleAddPackage').removeClass('disabled');
							$('#page_knowledgestore #docEleDelete').removeClass('disabled');
						//}

					}
					else
					{
						$('#page_knowledgestore #docEleAddPackage').addClass('disabled');
						$('#page_knowledgestore #docEleDelete').addClass('disabled');
					}
					
					// Prevent click event from propagating to parent
					e.stopPropagation();
				});

				// Handle click on table cells with checkboxes
				$('#page_knowledgestore #kwdgStoreTable').on('click', 'tbody td, thead th:first-child', function(e){
					  //$(this).parent().find('input[type="checkbox"]').trigger('click');
				});

				// Handle click on "Select all" control
				$('thead input[name="group-checkable"]', knowledgestore.knowledgestore_table.table().container()).on('click', function(e){
					if(this.checked){
						$('#page_knowledgestore #kwdgStoreTable tbody input[type="checkbox"]:not(:checked)').trigger('click');
					} 
					else 
					{
						$('#page_knowledgestore #kwdgStoreTable tbody input[type="checkbox"]:checked').trigger('click');
					}

					// Prevent click event from propagating to parent
					e.stopPropagation();
				});

				   // Handle table draw event
				knowledgestore.knowledgestore_table.on('draw', function(){
					// Update state of "Select all" control
					knowledgestore._updateDataTableSelectAllCtrl(knowledgestore.knowledgestore_table);
				});
					  
                //   Delete knowledge from Mongo functionality
                $('#page_knowledgestore #docEleDelete').click( function (e) {                  
					if(knowledgestore.rows_selected.length > 0)
					{
						var response = confirm("Are you sure you want to delete selected document(s)?");
						if(response)
						{
							var tableID = '#page_knowledgestore #kwdgStoreTable';
							var oTable =  $(tableID).dataTable();				       
									
							for(var i=0; i<knowledgestore.rows_selected.length; i++)
							{  
								var nTr = knowledgestore.rows_selected[i];
				
								var aData = oTable.fnGetData(nTr);

								var knowledgeID = $(aData[1]).text();

								knowledgestore._deleteKnowledgemapping(knowledgeID);
																	
								knowledgestore.allDeleteDocs.push(nTr._DT_RowIndex);								
							}
												
							 $.each(knowledgestore.allDeleteDocs, function( index, value ) {
								  knowledgestore.knowledgestore_table.row(value).remove().draw( false );
							  });
							  $('#page_knowledgestore #docEleAddPackage').addClass('disabled');
							  $('#page_knowledgestore #docEleDelete').addClass('disabled');
							  console.log("Deleted values are : "+JSON.stringify(knowledgestore.rows_selected));
			
							   knowledgestore.allDeleteDocs=[];
							  
							  }
						}
						 else
						 {
						   alert("Please select atleast one document to delete.");  
					}
					
					knowledgestore.rows_selected=[];
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
				
				$(".popover #openDocBtn").live('click', function (e) {
					console.log("This is function is for Open Doc. TODO");
				});
				
				$(".popover #shareDocBtn").live('click', function (e) {
					console.log("This is function is for Share Doc. TODO");
				});
			

				$(tab+"_wrapper").css('overflow-x', 'hidden');
				if( $(window).width() < 500 ) {
					$(document).scrollTop($('#searchResultsTable').offset().top);
					$(tab+"_wrapper").css('overflow-x', 'auto');
				}
				
				$(tab).unbind('click'); // SIMY: removing all events in case if there was some event set here ..
				$(tab).on('click', ' tbody td .row-details', function(event) {
					var nTr = $(this).parents('tr')[0];
					var tID = $(this).closest('table').attr('id');

					var cols = [];
					cols = knowledgestore._getColumnNamesList(tID);//todo
					
					var oTable = $('#' + tID).dataTable();

					if (oTable.fnIsOpen(nTr)) {
						/* This row is already open - close it */
						$(this).addClass("row-details-close").removeClass("row-details-open");
						oTable.fnClose(nTr);
					} else {
						// Open this row 
						$(this).addClass("row-details-open").removeClass("row-details-close");
						oTable.fnOpen(nTr, knowledgestore._fnDefectSearchRowFormatDetails(oTable, nTr, cols), 'details');//todo
					}
				});
			}

			for (var i = 0; i < knowledgestore.hideTableColumns.length; i++) {
				var iTD = '#' + knowledgestore.hideTableColumns[i].tableID;
				if (!tC[iTD]) continue; 

				var tempstr = knowledgestore.columnListDetailsArray.dropDownBoxId;
				console.log(tempstr)

				var table = $(iTD).DataTable();
				
				for (var j = 0; j < knowledgestore.hideTableColumns[i].hideColumnsList.length; j++) {

					var columnID = knowledgestore.hideTableColumns[i].hideColumnsList[j] - 1;                      
					table.column(columnID).visible(false, false);
					$('#page_knowledgestore #'+tempstr+' input[columnID='+columnID+']').closest( "span" ).removeAttr("class");					
				}
			}

			$('#searchResultsTable').removeClass("hide");

			knowledgestore.searchResultsReceived = true;
			//  Hide Table rows dropdown and Table Search
			$("div").find(".dataTables_length").addClass('hidden-sm hidden-xs');
			$("div").find(".dataTables_filter").addClass('hidden-sm hidden-xs');

			var windowWidth = $(window).width();
			if (windowWidth <= 400) {
				knowledgestore.onResizeWindow();//todo
				$("html, body").animate({
					scrollTop: $(document).height()
				}, 1000);
			}
		}
		else 
		{									 						
			var oTable = $('#page_knowledgestore #kwdgStoreTable').dataTable();
			oTable.fnClearTable();
			oTable.fnDestroy();	
		}
 		
		$("#addExpand").css("width", "3.40%");
		

		var sourceCodeTableRowCount = $('#sample_4_SourceCode tbody').children().length;      
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
    
    _deleteKnowledgemapping:function(KnowledgeMappingID){

		var param =[];
		param[0]="PARAM1="+KnowledgeMappingID;
		var data = '{"fileName":"delete_knowledgemapping","params":"'+param+'","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,knowledgestore.deletedKnowledgeInformationStatus);

    },
	deletedKnowledgeInformationStatus:function(statusObject){

		console.log(JSON.stringify(statusObject))
	},

	_addSearchTextTag: function(){
		$("#page_knowledgestore #filterTagsContainer").empty();
		var clearAllTag = '<button type="button" class="clear-all-filter-tags btn btn-circle btn-sm btn-default"><i class="fa fa-close"></i>  CLEAR ALL </button>'
		var i = 1;
		for( var gg in knowledgestore.moreFilterObj)
		{
			if(knowledgestore.moreFilterObj[gg].data)
			{     
				for(var ff in knowledgestore.moreFilterObj[gg].data)
				{
					console.log( ff + " :  "+knowledgestore.moreFilterObj[gg].data[ff])
					var attr_name = knowledgestore.moreFilterObj[gg].data[ff].filterName;
					var selected_val = knowledgestore.moreFilterObj[gg].data[ff].data ? JSON.stringify(knowledgestore.moreFilterObj[gg].data[ff].data) : null;
					knowledgestore._addFilterTags(i, attr_name, selected_val);
					i++
				}			
			}
			else
			{
				var attr_name = knowledgestore.moreFilterObj[gg].filterName;
				var selected_val = knowledgestore.moreFilterObj[gg].filterVal ? JSON.stringify(knowledgestore.moreFilterObj[gg].filterVal) : null;
				knowledgestore._addFilterTags(i, attr_name, selected_val);
				i++
			}			
		}
		
		var numbOfTags = $("#page_knowledgestore #filterTagsContainer").children().length
		if(numbOfTags > 0)
			$("#page_knowledgestore #filterTagsContainer").prepend(clearAllTag);
				
		$("#page_knowledgestore .clear-all-filter-tags").on('click', function(){			
			$("#page_knowledgestore #filterTagsContainer").empty();
			knowledgestore.moreFilterObj = {};
			 
			knowledgestore.searchObj.type = "advanced";
			knowledgestore.searchObj.input = $('#page_knowledgestore #searchDoc').val();
			knowledgestore.searchObj.input2 = $('#page_knowledgestore #searchDoc').val();
			knowledgestore._processSearchRequest(true);
		});
	},
	_addFilterTags:function(i, attrname, selectedval){
		var tab_id_val = i;
		if(selectedval){
			$("#page_knowledgestore #filterTagsContainer").append('<span class="tag" fieldName=' + attrname + '  fieldValue="' + selectedval.trim() + '" id=tag_' + tab_id_val + ' style="margin:1px 5px 1px 1px; display: inline-block;"><span>' + attrname + ' : ' + selectedval.trim() + '&nbsp;&nbsp;</span><a  parentID=tag_' + tab_id_val + ' fieldName=' + escape(attrname) + ' fieldValue='+escape(selectedval)+' onClick=knowledgestore._removeSearchTagFilter(this) title="Removing tag">x</a></span>');
		}
	},
	_removeSearchTagFilter: function(event) {
		var numbOfTags = $("#page_knowledgestore #filterTagsContainer").children().length
		if(numbOfTags > 2)
		{
			var parentID = $(event).attr("parentID");
			var parentfieldName = $(event).attr("fieldname").toString();
			parentfieldName = parentfieldName.replace("%20", " ");
			$("#" + parentID).remove();
			for( var gg in knowledgestore.moreFilterObj)
			{
				if(knowledgestore.moreFilterObj[gg].data)
				{
					for(var ff in knowledgestore.moreFilterObj[gg].data)
					{
						if(parentfieldName == knowledgestore.moreFilterObj[gg].data[ff].filterName)
						{
							delete knowledgestore.moreFilterObj[gg].data[ff];
							break;
						}
					}
				}
				else
				{					
					for(var gh in knowledgestore.moreFilterObj[gg])
					{
						if(parentfieldName == knowledgestore.moreFilterObj[gg].filterName)
						{
							delete knowledgestore.moreFilterObj[gg];
							break;
						}
					}
				}				
			}
		}
		else
		{
			$("#page_knowledgestore #filterTagsContainer").empty();
			knowledgestore.moreFilterObj = {};
		}
		
		knowledgestore.searchObj.type = "advanced";
		knowledgestore.searchObj.input = $('#page_knowledgestore #searchDoc').val();
		knowledgestore.searchObj.input2 = $('#page_knowledgestore #searchDoc').val();
		knowledgestore._processSearchRequest(true);
		
	},
	_ShowErrorMsg: function(msg_txt, visible){
		$('#page_knowledgestore #moreFiltersPopup .modal-footer .alert.alert-danger .error-msg').empty();
		$('#page_knowledgestore #moreFiltersPopup .modal-footer .alert.alert-danger .error-msg').last().append(msg_txt);
		if(visible)
			$('#page_knowledgestore #moreFiltersPopup .modal-footer .alert.alert-danger').show();
		else
			$('#page_knowledgestore #moreFiltersPopup .modal-footer .alert.alert-danger').hide();
	},
	
	_validateDateRange: function(){
		
		var fromDate = knowledgestore.fromDate;
		var toDate = knowledgestore.toDate;
		
		if (fromDate=="" && toDate=="")
			return false;
		
		if(fromDate=="" && toDate!=""){				
				var errorContent = ' Please enter start date';
				knowledgestore._ShowErrorMsg(errorContent, true);
				return false;
		}else if(toDate=="" && fromDate!=""){
				var errorContent = ' Please enter end date';
				knowledgestore._ShowErrorMsg(errorContent, true);
				return false;
		}else if(fromDate>toDate){
				var errorContent = ' Filter Start Date should not Greater than End Date';
				knowledgestore._ShowErrorMsg(errorContent, true);
				return false;
		}else{
			return true;
		}
		
	},
	
	saveChanges:function()
	{				
    
        knowledgestore.rows_selected =[];
        			
		$('#page_knowledgestore #moreFiltersPopup').modal('toggle');
				//This is for read values from GeneraL Conatiner
				//selected release filter values
		var generalTabObj = {};
		var generalTabSubContentObj = {};
							
						
		$('#page_knowledgestore #filters_quicktags_tab').children().each(function(){
			$(this).children().each(function(){
				var objFilter={};
				var sFilter;
				objFilter.filterName = $(this).children().children('label').text();
				objFilter.fieldName = $(this).children(0).attr('fieldName');
				switch ($(this).children().attr('type'))
		{
					case "checkBox":
						sFilter = new Array();
						$(this).children().children().find("input:checkbox[name=type]:checked").each(function(){
							console.log($(this).val());
							sFilter.push($(this).val());
		}); 
					break;
					case "starSel":
						$(this).children().children().find(".kv-gly-star").each(function(){
							console.log($(this).val());
							var val = parseInt($(this).val());
							if (val)
								sFilter = val + ' & above';
		}); 
					break;
					case "multiSelect":
						sFilter = new Array();
						$(this).children().children().find(":selected").each(function(){
							console.log($(this).val());
							sFilter.push($(this).val());
		}); 
					break;						
		}
				objFilter.data = sFilter;
				if (objFilter.data && objFilter.data.length > 0)
		{
					generalTabSubContentObj[objFilter.filterName] = objFilter;
		}
				else if (generalTabSubContentObj[objFilter.filterName])
		{
					delete generalTabSubContentObj[objFilter.filterName];
		}
			});
		});				

		if(generalTabSubContentObj)
		{
			generalTabObj.data = generalTabSubContentObj;
			knowledgestore.moreFilterObj.general = generalTabObj;			
		}
		else
		{
			delete knowledgestore.moreFilterObj.general
		}
					
							
		//This is for read values from Content Conatiner	
		var contentObj = {}
		var contentsData=[];
		
		$(".content-tab input:checkbox[name=type]:checked").each(function(){
			contentsData.push($(this).val());
		}); 
		
		if(contentsData.length > 0)
		{
			contentObj.filterVal = contentsData;
			contentObj.filterName = 'Contents';
			contentObj.fieldName = "KnowledgeAssets";
			knowledgestore.moreFilterObj.contents = contentObj; 
		}
		else
		{
			delete knowledgestore.moreFilterObj.contents;
		}
		
			
		//This is for read values from Time Conatiner
		if( knowledgestore.timeSelecteValue == "daysContainer")
		{
			var selectedTimeObj = {}
			var selFilter = {};
			$(".radio-list input[type=radio]:checked").each(function(){
				selFilter.Value = $(this).val();
				console.log("--->knowledgestore.selectedTime.quickTimeSpan-->"+selFilter);
			});
			if(selFilter.Value)
			{
				selectedTimeObj.filterVal = selFilter.Value;
				selectedTimeObj.fieldName = "published_at";
				selectedTimeObj.filterName = "Quick Time";
				knowledgestore.moreFilterObj.time = selectedTimeObj;
			}
			else if(knowledgestore.moreFilterObj.time)
			{
				delete knowledgestore.moreFilterObj.time;
			}			
		} 
		else if( knowledgestore.timeSelecteValue == "dateContainer")
		{
			if(knowledgestore._validateDateRange())
			{
				var selectedTimeObj = {}
				var time_obj = {};
				time_obj.fromDate = knowledgestore.fromDate;
				time_obj.toDate = knowledgestore.toDate;
				selectedTimeObj.fieldName = "published_at";
				selectedTimeObj.filterName = "Date Range";				
				selectedTimeObj.filterVal = time_obj;
				knowledgestore.moreFilterObj.time = selectedTimeObj;
			}
			else if(knowledgestore.moreFilterObj.time)
			{
				delete knowledgestore.moreFilterObj.time;
			}	
		}
 			
		if(knowledgestore.moreFilterObj)
		{
			knowledgestore._addSearchTextTag();			
			
			knowledgestore.searchObj.type = "advanced";
			knowledgestore.searchObj.input = $('#page_knowledgestore #searchDoc').val();
			//knowledgestore.searchObj.input2 = $('#page_knowledgestore #searchDoc').val();
			knowledgestore._processSearchRequest(true);
			localStorage.setItem('moreFilterObj', JSON.stringify(knowledgestore.moreFilterObj));
            // Saving more filters data to user specific json
            knowledgestore._setUserPrefernce("knowledgeFilters",JSON.stringify(knowledgestore.moreFilterObj));
		}
	},
	
    _getMoreFilterJsondata: function()
    {
      if(JSON.parse(localStorage.getItem('moreFilterObj'))==null)
      {
       knowledgestore._loadUserDefaultConfigData();
       var tempArr= new Array();
       
       if(knowledgestore.userConfigData.knowledgeFilters)
       {     
        tempArr= JSON.parse(knowledgestore.userConfigData.knowledgeFilters);
        localStorage.setItem('moreFilterObj', JSON.stringify(tempArr));
       }
      }
    }, 

	getMoreFilterJsonInfo:function(){

        knowledgestore._getMoreFilterJsondata();
		knowledgestore.storedGeneralTabFilterData = {};
		
		$("#page_knowledgestore #filters_quicktags_tab").empty();
		
		$.getJSON("json/moreFilter.json?"+Date.now(), function(data) 
		{
			console.log("indide..........");
			knowledgestore.storedMoreFilterSelection = JSON.parse(localStorage.getItem('moreFilterObj'));
			$.each(data, function(key, item) 
			{
                if(knowledgestore.storedMoreFilterSelection)
                {
				if(knowledgestore.storedMoreFilterSelection.general){
					knowledgestore.storedGeneralTabFilterData = knowledgestore.storedMoreFilterSelection['general']['data'];
				}
                }
				
				var actFilterCounter = 0;
				var rowId = "";
				var rowCnt = 0;
				
				for(var i=0;i<item.options.length;i++)
				{
					if(item.options[i].enable == "yes")
					{
						if (actFilterCounter % 4 == 0 || actFilterCounter == 0)
								{
							rowCnt++;
							rowId = "row-id-"+rowCnt;
							$("#page_knowledgestore #filters_quicktags_tab").append('<div class="row" id="'+rowId+'"></div>');
								}								
						actFilterCounter++;
							
						switch(item.options[i].displayType) 
						{
							case 'multiSelect':
								var checkMultiSelOptions = knowledgestore.storedGeneralTabFilterData[item.options[i].displayName];
								$("#page_knowledgestore #filters_quicktags_tab #"+rowId).append('<div class="col-md-3" id="multi-select-'+item.options[i].displayName+'">' + knowledgestore._createDropdownSelectTwo(item.options[i].displayName, item.options[i].subOpts, item.options[i].fieldName) +'</div>');
								$(".multi-select-"+item.options[i].displayName).select2();
								knowledgestore.releaseFieldName = item.options[i].fieldName;
								if (checkMultiSelOptions)
								{
									$(".multi-select-"+item.options[i].displayName).select2("val", checkMultiSelOptions.data)
								}	
								break;
							case 'checkBox':
								var chkboxSelOptions = knowledgestore.storedGeneralTabFilterData[item.options[i].displayName];
								if (chkboxSelOptions)
									$("#page_knowledgestore #filters_quicktags_tab #"+rowId).append('<div class="col-md-3" id="chkbox-'+item.options[i].displayName+'">' + knowledgestore._createCheckBoxbuttonGroup(item.options[i].displayName, item.options[i].subOpts, item.options[i].fieldName, chkboxSelOptions.data) + '</div>');								
								else
									$("#page_knowledgestore #filters_quicktags_tab #"+rowId).append('<div class="col-md-3" id="chkbox-'+item.options[i].displayName+'">' +  knowledgestore._createCheckBoxbuttonGroup(item.options[i].displayName, item.options[i].subOpts, item.options[i].fieldName) + '</div>');								
								break;
								
							case 'starSel':
								var starSelOptions = knowledgestore.storedGeneralTabFilterData[item.options[i].displayName];
								if (starSelOptions)
								{
									selVal = parseInt(starSelOptions.data[0].substring(0, 1));
									$("#page_knowledgestore #filters_quicktags_tab #"+rowId).append('<div class="col-md-3" id="starsel-'+item.options[i].displayName+'">' + knowledgestore._createStarRatingComp(item.options[i].displayName, item.options[i].fieldName, selVal) + '</div>');
								}
								else
								{
									$("#page_knowledgestore #filters_quicktags_tab #"+rowId).append('<div class="col-md-3" id="starsel-'+item.options[i].displayName+'">' + knowledgestore._createStarRatingComp(item.options[i].displayName, item.options[i].fieldName) + '</div>');								
								}		
								knowledgestore._initStarEvents();
								break;
						}
						knowledgestore._handleUniform();
					}

				}   
			})
			if(knowledgestore.storedMoreFilterSelection)
			{
				knowledgestore._setDefaultTimeValues();
				knowledgestore._setDefaultcontentValues();
			}			   
		});
    },
	
	_createDropdownSelectTwo: function(displayName, optionsArray, pFieldName){
		  var htmlData = '<div class="form-group" fieldName="'+pFieldName+'" type="multiSelect"><label>'+displayName+'</label><select multiple="multiple" id="Options-'+displayName+'" class="multi-select-'+displayName+'" style="width: 180px;">'
		 for(var i=0; i<optionsArray.length; i++){
				htmlData += ' <option value="'+optionsArray[i]+'">'+optionsArray[i]+'</option>';
		 }
		 htmlData += '</select>'
		 return htmlData;					
	},
		
	_createCheckBoxbuttonGroup: function(displayName, subOptions, pFieldName, storedOpts){
		if(subOptions.length > 0){
			var htmlData = '<div class="form-group" fieldName="'+pFieldName+'" type="checkBox"><label>'+displayName+'</label><div class="checkbox-list">';
			for(var i=0; i<subOptions.length; i++){
				var _checkedVal = knowledgestore._setCheckedValue(subOptions[i], storedOpts)
				htmlData += '<label><span><input '+_checkedVal+' type="checkbox" name="type" value="'+subOptions[i]+'"></span>'+ subOptions[i]+'</label>';
			}
			htmlData += '</div></div>';
			return htmlData;
		}	                                             		
	},
	_createStarRatingComp: function(displayName, pFieldName, start_val){
		var htmlData = '<div class="form-group" fieldName="'+pFieldName+'" type="starSel"> <label>'+displayName+'</label>'
		var startVal = start_val ? start_val : 0;
		htmlData += '<div class="col-md-12" id="'+displayName+'"><input type="text" class="kv-gly-star rating-loading" data-show-clear="false" data-show-caption="false" value="'+startVal+'" data-size="xxs" data-min="0" data-max="5" data-step="1"><label>& above</label></div>';
		//htmlData += '<label>& above</label>'
		htmlData += '</div>';
		return htmlData;
		 	                                             		
	},
	_setCheckedValue:function(cur_value,data){
		if(data){
			for(var i=0; i<data.length; i++){
				if(cur_value == data[i]){
					return 'checked';
				}
			}
			return 'unchecked';
		}else{
			return '';
		}
	},
	_setDefaultTimeValues:function(){
		
		var storedTimeData = knowledgestore.storedMoreFilterSelection['time'] ? knowledgestore.storedMoreFilterSelection['time']['filterVal'] : null;
		if (storedTimeData)
		{
		if(typeof storedTimeData == "string"){
			$("#daysContainer input[name='dateFilteroptionsRadios'][value='"+ storedTimeData +"']").parent().addClass('checked');
			$("#timeFilters input[name='daysContainerRadios'][value='QuickTimeSpan']").trigger("click");
		    $("#timeFilters input[name='daysContainerRadios'][value='QuickTimeSpan']").parent().addClass('checked');			
			$("#timeFilters input[name='daysContainerRadios'][value='DateRange']").parent().removeClass('checked');						
		}else if(typeof storedTimeData == "object"){
			$("#timeFilters input[name='daysContainerRadios'][value='DateRange']").trigger("click");
		    $("#timeFilters input[name='daysContainerRadios'][value='DateRange']").parent().addClass('checked');			
			$("#timeFilters input[name='daysContainerRadios'][value='QuickTimeSpan']").parent().removeClass('checked');			
			$('#dateContainer #fromDate').val(storedTimeData['fromDate'])
			$('#dateContainer #toDate').val(storedTimeData['toDate'])
		}
		}
	},
	
	clearFilter: function(object)
	{
		switch(knowledgestore.morefilterActiveTab)
		{
			case "General" :
			{
				$('#page_knowledgestore #filters_quicktags_tab').children().each(function(){
					$(this).children().each(function(){
						switch ($(this).children().attr('type'))
						{
							case "checkBox":
								$(this).children().children().find("input:checkbox[name=type]:checked").each(function(){
									console.log($(this).val());
					$(this).attr('checked', false);
					$(this).closest("span").removeAttr("class");
				});
							break;
							case "starSel":
								$(this).children().children().find(".kv-gly-star").each(function(){
									console.log($(this).val());
									$(this).rating('clear');
								});				
							break;
							case "multiSelect":
								$(this).children().children().find(":selected").each(function(){
									console.log($(this).val());
									$(this).prop("selected", false).trigger('change');
								});
							break;						
						}							
				});
				});														
			}
			break;
			case "Time":
			{
				if( knowledgestore.timeSelecteValue == "daysContainer")
				{
					$(".radio-list input[type=radio]:checked").each(function(){
						$(this).attr('checked', false);
						$(this).closest("span").removeAttr("class");
					});
				}
				else if( knowledgestore.timeSelecteValue == "dateContainer")
				{
					$("#page_knowledgestore #fromDate").val("").trigger("change");
					$("#page_knowledgestore #toDate").val("").trigger("change");					
				}
			}
			break;
			case "Content":
			{
				$(".content-tab input:checkbox[name=type]:checked").each(function(){			
					$(this).attr('checked', false);
					$(this).closest("span").removeAttr("class");
				});
			}
			break;
		}
	},
	
	_setDefaultcontentValues:function(){
		var storedContentData = knowledgestore.storedMoreFilterSelection['contents'] ? knowledgestore.storedMoreFilterSelection['contents']['filterVal']: null;
		if(storedContentData){
			for(var i=0; i<storedContentData.length; i++){
				var _chkval = $("#filters_contenttype_tab :checkbox[value='"+storedContentData[i]+"']");
				$(_chkval).prop('checked', true)
				$.uniform.update(_chkval);
			}
		}
	},
	//
	// Updates "Select all" control in a data table
	//
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
		var modalTitle = $(event).attr('modalTitle');
		$('#page_knowledgestore #modelInfo').empty();
		$('#page_knowledgestore #modelInfo').append("<div id='similarSearch_moreDescription' class='form-control' style='height:450px;font-family:Courier' readonly=''></div>");
		
		String.prototype.replaceAll = function(target, replacement) {
						return this.split(target).join(replacement);
				};
				
		moreTextContent = moreTextContent.replaceAll('##','<em class="iseH">');
		moreTextContent = moreTextContent.replaceAll("#","</em>");
		moreTextContent = moreTextContent.replace(/.\t/g,". ");
		document.getElementById("similarSearch_moreDescription").innerHTML = moreTextContent;
		$('#moreInfoModalTitle').text(modalTitle);
		$("#page_knowledgestore #showMoreTextInfoModal").modal("show");         	 
	},
	
	_getDocDetails:function(doc_id){
		for(var i=0; i<knowledgestore.json_doc_data.length; i++)
		{
			if(doc_id == knowledgestore.json_doc_data[i]._id)
			{
				return knowledgestore.json_doc_data[i];
			}
		}	  
	},
	
	_getPopoverBodyContent:function(data){
		var popoverBody = '<div class="row"> <div class="col-md-12"><div class="form-group" id="docMoreInfoContent"> <p> Modified on <span> '+data.published_at+' </span><br> User:  <span>'+data.user+'</span> </p></div><div class="btn-group"><a class="btn btn-xs btn-success" id="openDocBtn" data-apply="confirmation">Open</a><a class="btn btn-xs default" id="shareDocBtn" data-apply="confirmation"> Share</a></div></div></div>';
		return popoverBody;
	},
	
	_getTableIndexName:function()
	{
		return knowledgestore.columnListDetailsArray.indexes;			 
	}, 
	onLoadActionComponent: function() {
		$.ajax({
			url: "actions.html",
			type: 'HEAD',
			error: function() {
				console.log("Error")
			},
			success: function() {
				$('#page_knowledgestore .page-toolbar').load("actions.html", function() {

					$.getScript("js/subpages/actions.js")
						.done(function() {
							knowledgestore.actionsRef = actions;
							actions._setCurrentPage(ikePageConstants.KNOWLEDGE_STORE);
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

