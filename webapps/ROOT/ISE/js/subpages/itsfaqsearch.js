var itsfaqsearch = {	
		 
	/* Global Variable decleartion */
		listOfCurrentCollections:[],
		listOfCurrentCollectionsAndLabels:[],
		listOfCollectionsAndDetails:[],
		selectedViewName : 'faq-view',
		resultsSize: 10,
		faqMultiSearchResultData:[],
		faqSingleSearchResultData:[],
		faqFaqSectionSearchResultData:[],
		clusterData:'',
		starRatingNumber:0,
		selectedRatingButton:null,
		clickedTableRowID:'',
		ratingTargetElement:'',
		jsonRatingCollection:null,
		projectName:'',
		currentSelectedTabID:'',
		ratingFeedbackmaxLength: 150,
		clickedCollectionName: '',
		currentSelectedMainTabID:'Consolidated',
		noDataDiv:'<div> No Data </div>',
     /* Init function  */
      init: function(){
	
		   if (!jQuery().dataTable) {
                return;
            }
		itsfaqsearch.projectName = localStorage.getItem('projectName');	
		
		$('.query-textfield-conatiner').on('click', '#searchfaq', function(event) {
			 //var _searchtxt = ($('#questionText').val());
			 var _searchtxt = $('#questionText').val().replace(/([\!\*\+\-\=\<\>\&\|\(\)\[\]\{\}\^\~\?\:\\/"\n])/g, " ");
			 if (_searchtxt != "") {
				 $('.query-textfield-conatiner .did-you-mean-conatiner').empty();
				 itsfaqsearch._SearchMultiIndicesForText(_searchtxt, itsfaqsearch.listOfCurrentCollections, itsfaqsearch.resultsSize);
				 ISEUtils.portletBlocking("pageContainer");
			 }else{
				 $('.query-textfield-conatiner .did-you-mean-conatiner').empty();
				 $('.query-textfield-conatiner .did-you-mean-conatiner').html('<div class="font-red"><i class="fa-lg fa fa-warning"></i> Please enter your query...</div>');
			 }
		});
		 $('.query-textfield-conatiner').live("keypress", '#questionText',function(e) {
          var enteredText = $("#questionText").val();
		  var numberOfLineBreaks = (enteredText.match(/\n/g)||[]).length;
			if (e.keyCode == 13 && numberOfLineBreaks <= 0) {
               // alert("Enter pressed");
			   $("#searchfaq").trigger( "click" );
            }
		 });
		//to get the view details
		ITS._GetConfViewDetails('configuration','configuration', '_id:'+itsfaqsearch.selectedViewName, itsfaqsearch._GetConfViewDetailsResponse)	
		
		$.getJSON("json/rating.json?"+Date.now(), function(data) {

                itsfaqsearch.jsonRatingCollection = data;
		});
		$('.query-result-conatiner .portlet-title').on('click', '.nav-tabs li', function(event) {
			//if($(this).hasClass('active')){
				itsfaqsearch.currentSelectedMainTabID = event.target.text;
			//}
		});
		$('.query-result-conatiner').on('click', '.row-details', function(event) {
			if($(this).hasClass('row-details-close')){
				$(this).removeClass('row-details-close').addClass('row-details-open');
				$(this).parent().find('.data-row-container').show();
			}else{
				$(this).removeClass('row-details-open').addClass('row-details-close');
				$(this).parent().find('.data-row-container').hide();
			}	
		});
		
		$('.query-result-conatiner').on('click', '.short-desc-val', function(event) {
			 event.preventDefault();
				var id_number = $.trim($(this).parent().attr('link-id'));
				var type_collection = $.trim($(this).parent().attr('collection-name'));
				//var type_collection = $.trim($(this).parents('.dataTable').attr('type-of-collection'));
				if(itsfaqsearch.currentSelectedMainTabID == 'Consolidated')
					var popupData = itsfaqsearch._searchLongDescForSinglePopup(id_number, type_collection, itsfaqsearch.faqSingleSearchResultData.mainData);
				else if(itsfaqsearch.currentSelectedMainTabID == 'Split')
					var popupData = itsfaqsearch._searchLongDescForMultiSearchPopup(id_number, type_collection, itsfaqsearch.faqMultiSearchResultData)
				$("#its-faq-search #moreInfoModalTitle").html('<b>'+id_number+'</b> &nbsp;-&nbsp;'+$(this).text());
				$("#its-faq-search #faqsearchchmodalbody").html(popupData.longDesc);
				if(popupData.resolutiondescription.length > 2){
					$("#its-faq-search #faqsearchmodalsubbody").show();
					$("#its-faq-search #faqsearchmodalsubbody #container").html(popupData.resolutiondescription);
				}else{
					$("#its-faq-search #faqsearchmodalsubbody #container").empty();
					$("#its-faq-search #faqsearchmodalsubbody").hide();
				}
				$("#its-faq-search #documentinfoModal").modal("show");
			 return false; 
		});
		
		//  changes mouse cursor when highlighting loawer right of box
		 $("#questionText").mousemove(function(e) {
			var myPos = $(this).offset();
			myPos.bottom = $(this).offset().top + $(this).outerHeight();
			myPos.right = $(this).offset().left + $(this).outerWidth();
			
			if (myPos.bottom > e.pageY && e.pageY > myPos.bottom - 16 && myPos.right > e.pageX && e.pageX > myPos.right - 16) {
				$(this).css({ cursor: "nw-resize" });
			}
			else {
				$(this).css({ cursor: "" });
			}
		})
		//  the following simple make the textbox "Auto-Expand" as it is typed in
		.keyup(function(e) {
			//  this if statement checks to see if backspace or delete was pressed, if so, it resets the height of the box so it can be resized properly
			if (e.which == 8 || e.which == 46) {
				$(this).height(parseFloat($(this).css("min-height")) != 0 ? parseFloat($(this).css("min-height")) : parseFloat($(this).css("font-size")));
			}
			//  the following will help the text expand as typing takes place
			while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
				$(this).height($(this).height()+1);
			};
		}); 
		
	  },

	  _searchLongDescForMultiSearchPopup:function(id_number, type_of_collection, collections){
		for(var i=0; i<collections.length; i++){
			for (var j=0; j<collections[i].length; j++){
				if((collections[i][j]['link'] == id_number || collections[i][j]['product'] == id_number) && collections[i][j]['_collection'] == type_of_collection){
					var _obj = new Object();
					_obj.longDesc = collections[i][j]['description'] ? collections[i][j]['description'] : collections[i][j]['text'];
					_obj.resolutiondescription = collections[i][j]['resolutiondescription'] ? collections[i][j]['resolutiondescription'] : '';
					 return _obj;
				}
			}
		}
	  },
	  _searchLongDescForSinglePopup:function(id_number, type_of_collection, collections){
		for(var i=0; i<collections.length; i++){
			//for (var j=0; j<collections[i].length; j++){
				if((collections[i]['link'] == id_number || collections[i]['product'] == id_number) && collections[i]['_collection'] == type_of_collection){
					var _obj = new Object();
					_obj.longDesc = collections[i]['description'] ? collections[i]['description'] : collections[i]['text'];
					_obj.resolutiondescription = collections[i]['resolutiondescription'] ? collections[i]['resolutiondescription'] : '';
					 return _obj;
				}
			//}
		}
		
	},
	  
	  _GetConfViewDetailsResponse: function (data){
		  console.log("DATA : "+data);
		  itsfaqsearch.listOfCurrentCollections = data.hits.hits[0]._source.query.Collection;
		  itsfaqsearch.listOfCurrentCollectionsAndLabels = data.hits.hits[0]._source.query;
		  itsfaqsearch._InitAutocompleteText();
		  ITS._GetConfViewDetails('configuration',itsfaqsearch.selectedViewName, '', itsfaqsearch._GetViewDataResponse); 
	  },
	  
	  _GetViewDataResponse: function (data){
		  //debugger;
		 console.log("DATA : "+data);
		 itsfaqsearch.listOfCollectionsAndDetails = data.hits.hits;
		 itsfaqsearch._InitSearchResultsFaqTabsCreate();
	  },
	  _InitAutocompleteText:function(){
		$('#its-faq-search #questionText').textcomplete(
		[{
			 
			match: /(\w*)$/,
			index: 1, // default = 2
			search: function (term, callback, match) {
			console.log("match.input : "+match.input);
			if(match.input.length > 1){
			var trimmedQuery = (match.input).replace(/\n/g, '').replace(/\s+/g, ' ').toLowerCase();
			
			var _query = '{"size":0,"aggs":{"autocomplete":{"terms":{"field":"autocomplete","order":{"_count":"desc"},"include":{"pattern":"'+trimmedQuery+'.*"}}}},"query":{"prefix":{"autocomplete":{"value":"'+trimmedQuery+'"}}}}';
			 var listofCollections = (itsfaqsearch.listOfCurrentCollections).toString();
				$.ajax({
				  type: 'POST',
				 url: 'http://10.98.11.18:9200/'+listofCollections+'/_search',
				  data: _query,
				  crossDomain: true,
				  async: false,
				  success: function (data) {
					//Do stuff with the JSON data
							callback($.map(data.aggregations.autocomplete.buckets, function (word) {
								return word.key ;
							}))
				  },
				  error: function (data) {
					 callback([]);
				  }
				})
				}else
				{
					callback([]);
				}
		},
			replace: function (item) {
				return item;
			} 
		}
		]
		).on({
				'textComplete:select': function (e, value, strategy) {
				   // alert(value);
				   $('#its-faq-search #questionText').val(value);
				   $("#searchfaq").trigger( "click" );
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
	  _InitSearchResultsFaqTabsCreate: function(){
		 var common_tabListContentHTML = '<div class="common-result-tab-container" style="display:none">'
		 var splitted_tabsListHtml = '<ul class="nav nav-tabs">';
		 var splitted_tabsListContentHtml = '<div class="tab-container" style="display:none"><div class="tab-content">';
		for(var i=0; i<itsfaqsearch.listOfCurrentCollectionsAndLabels['Collection'].length; i++){
			var displayID = itsfaqsearch.listOfCurrentCollectionsAndLabels['Collection'][i];
			var template_data = itsfaqsearch._getViewStoredTemplate(itsfaqsearch.selectedViewName, displayID);
			
			//common_tabListContentHTML +='<div class="tab-pane" id="common-faqtabs-'+itsfaqsearch.listOfCurrentCollectionsAndLabels['Collection'][i]+'"></div>';
			
			splitted_tabsListHtml += '<li><a href="#splitted-faqtabs-'+itsfaqsearch.listOfCurrentCollectionsAndLabels['Collection'][i]+'" data-toggle="tab">'+itsfaqsearch.listOfCurrentCollectionsAndLabels['Label'][i]+' </a></li>';
			splitted_tabsListContentHtml += '<div class="tab-pane" id="splitted-faqtabs-'+itsfaqsearch.listOfCurrentCollectionsAndLabels['Collection'][i]+'"></div>';
		}
		
		splitted_tabsListHtml += '</ul>';
		splitted_tabsListContentHtml += '</div> </div>';
		common_tabListContentHTML += '</div>';
		$('#its-faq-search .query-result-conatiner #splitted_tab').empty();
		$('#its-faq-search .query-result-conatiner #common_tab').empty();
		
		$('#its-faq-search .query-result-conatiner #splitted_tab').append(splitted_tabsListHtml);
		$('#its-faq-search #splitted_tab .nav-tabs>li').first().addClass('active');
		$('#its-faq-search #splitted_tab .nav-tabs>li>a').first().addClass('active');
		
		$('#its-faq-search .query-result-conatiner #splitted_tab').append(splitted_tabsListContentHtml);
		$('#its-faq-search #splitted_tab .tab-content .tab-pane').first().addClass('active');
		
		$('#its-faq-search .query-result-conatiner #common_tab').append(common_tabListContentHTML);
	  },
	  
	_getViewStoredTemplate:function (type_of_view, type_filed) {
		for (var f=0; f<itsfaqsearch.listOfCollectionsAndDetails.length; f++){
			if( itsfaqsearch.listOfCollectionsAndDetails[f]['_type'] == type_of_view && itsfaqsearch.listOfCollectionsAndDetails[f]['_id'] == type_filed  )
				return itsfaqsearch.listOfCollectionsAndDetails[f]['_source']['query']['template'];
		}
	},
	_sendSingleSearchQueryRequest: function(search_str){
		var _searchtxt = search_str;//$('#questionText').val();
		var requestSingleObject = {};
		requestSingleObject.index = 'its-faq_collection';//itsfaqsearch.listOfCurrentCollections.toString();//todo
		requestSingleObject.search_type = "dfs_query_then_fetch";
		requestSingleObject.formatdata = '1';
		requestSingleObject.getSuggestion = '1';
		requestSingleObject.body = (itsfaqsearch._getCunstructedSingleObject( _searchtxt, 'cess_analyzer', itsfaqsearch.resultsSize));
		ITS._AnalyzeSearch(requestSingleObject, itsfaqsearch._searchResultResponse);
	},
	_sendCommonSingleSearchQueryRequest: function(search_str){
		var _searchtxt = search_str;//$('#questionText').val();
		var requestSingleObject = {};
		requestSingleObject.index = itsfaqsearch.listOfCurrentCollections.toString();
		requestSingleObject.search_type = "dfs_query_then_fetch";
		requestSingleObject.formatdata = '1';
		requestSingleObject.body = (itsfaqsearch._getCunstructedSingleObject( _searchtxt, 'cess_analyzer', itsfaqsearch.resultsSize));
		ITS._AnalyzeSearch(requestSingleObject, itsfaqsearch._searchResultResponse);
	},
	_sendMultiSearchQueryRequest: function(search_str){
		var _searchtxt = search_str;//$('#questionText').val();
		var multiReqSearchArray = "";
		for (var i = 0; i < itsfaqsearch.listOfCurrentCollections.length; i++) {		
			multiReqSearchArray += (itsfaqsearch._getCunstructedMultiObject(itsfaqsearch.listOfCurrentCollections[i], itsfaqsearch.listOfCurrentCollections[i], _searchtxt, 'cess_analyzer', itsfaqsearch.resultsSize))+'\n'					
		}
		
		var requestObject = {};
		requestObject.body = [multiReqSearchArray];
		ITS._MultiAnalyzeSearch(requestObject, itsfaqsearch._multiSearchResultResponse);
	},
	_sendMultiClusterSearchQueryRequest: function(serach_txt){
		var _searchtxt = serach_txt;//$('#questionText').val();
		for (var j = 0; j < itsfaqsearch.listOfCurrentCollections.length; j++) {
			//console.log("J : "+j+" : "+collectioname[j])
			var requestClusterObject = {};
			var displayID = itsfaqsearch.listOfCurrentCollections[j];
			var temp_mappedItems = itsfaqsearch._getMappedItemData(itsfaqsearch.selectedViewName, displayID);//['"title":"title"', '"description":"description"'];
			if(temp_mappedItems ) {                                                                 // [""Description":"description"", ""Id":"number"", ""Title":"short_description""]
				var strTemp = '{'+temp_mappedItems.toString().toLowerCase()+'}';
				var strPar = JSON.parse(strTemp)
				var fieldArray =[];
				var fieldmappingObj = new Object();
				for(var gg in strPar){
					fieldArray.push(strPar[gg]);
				 fieldmappingObj[gg] = ['fields.'+strPar[gg]]
				}
				String.prototype.replaceAll = function(target, replacement) {
								return this.split(target).join(replacement);
				};
				var collectionName = 'its-faq_collection';//itsfaqsearch.listOfCurrentCollections[j];//toDo
				var fieldmappingObjStr =  JSON.stringify(fieldmappingObj).replaceAll('{', '').replaceAll('}', '');
				requestClusterObject = itsfaqsearch._getCunstructedClusterSearchObject(fieldArray, _searchtxt, fieldmappingObjStr);
				ITS._AnalyzeClusterSearch(requestClusterObject, collectionName, '', itsfaqsearch._SearchClusterResponse);
			}
		}
	},
	_sendFaqSectionSearchQueryRequest: function(search_txt){
		var _searchtxt = search_txt;//$('#questionText').val();
		var requestSingleObject = {};
		requestSingleObject.index = 'its-faq_collection';//itsfaqsearch.listOfCurrentCollections.toString();//ToDo
		requestSingleObject.formatdata = '1';
		requestSingleObject.body = (itsfaqsearch._getCunstructedFaqSectionObject( _searchtxt));
		ITS._AnalyzeSearch(requestSingleObject, itsfaqsearch._searchFaqSectionResultResponse);
	},
	_SearchMultiIndicesForText:function(Searchtxt, collectioname,resSize) {
		//var _searchtxt = $('#questionText').val();
		itsfaqsearch._sendSingleSearchQueryRequest(Searchtxt);
		itsfaqsearch._sendMultiClusterSearchQueryRequest(Searchtxt);
		itsfaqsearch._sendFaqSectionSearchQueryRequest(Searchtxt);
	},
	/* _SearchMultiIndicesForClick:function(Searchtxt, collectioname,resSize) {
		//var _searchtxt = $('#questionText').val();
		itsfaqsearch._sendSingleSearchQueryRequest(Searchtxt);
		itsfaqsearch._sendMultiClusterSearchQueryRequest(Searchtxt);
		itsfaqsearch._sendFaqSectionSearchQueryRequest(Searchtxt); 
	}, */
	_getCunstructedMultiObject:function(index, type, query_str,  analyzer, req_count) {
		var requestObject = '';
		return requestObject = 
		'{"index":"' +index+'", "type":"'+type+'"},\n{ "query": { "query_string": {"query": "'+ query_str + '", "analyzer":"' +analyzer+'"} }, "size":'+req_count+' },'
	},
	_getCunstructedSingleObject:function( query_str,  analyzer, req_count) {
		var requestObject = '';
		return requestObject = '{"suggest":{"didyoumean":{"text":"'+ query_str + '","phrase":{"field":"did_you_mean"}}},"query":{"multi_match":{"query":"'+ query_str + '","fields":["_all"],"analyzer": "cess_analyzer"}}}'
	},
	_getCunstructedFaqSectionObject:function(query_str) {
		var requestObject = '';
		return requestObject = '{"query":{"more_like_this":{"fields":["title","description"],"like_text":"'+ query_str+'","min_term_freq":1,"max_query_terms":12}}}'
	},
	_getCunstructedClusterSearchObject:function(fields_data, query_str, field_mapping_obj) {
		var requestObject = '';
		return requestObject = '{"search_request":{"fields":'+ JSON.stringify(fields_data) +',"query":{"match":{"_all":"'+ query_str +'"}},"size":50},"include_hits":"true","query_hint":"","field_mapping":{'+field_mapping_obj+'}}'
	},
	 
	_getViewStoredTypeOfDataView:function (type_of_view, type_filed) {
		for (var f=0; f<itsfaqsearch.listOfCollectionsAndDetails.length; f++){
			if( itsfaqsearch.listOfCollectionsAndDetails[f]['_type'] == type_of_view && itsfaqsearch.listOfCollectionsAndDetails[f]['_id'] == type_filed  )
				return itsfaqsearch.listOfCollectionsAndDetails[f]['_source']['query']['typeofdataview'];
		}
	
	},
	_getMappedItemData:function(type_of_view, type_filed){
		for(var i=0; i< itsfaqsearch.listOfCollectionsAndDetails.length; i++){
			if( itsfaqsearch.listOfCollectionsAndDetails[i]['_type'] == type_of_view && itsfaqsearch.listOfCollectionsAndDetails[i]['_id'] == type_filed  )
				return itsfaqsearch.listOfCollectionsAndDetails[i]['_source']['query']['items_mapped'];
			
		}
	},
	_searchResultResponse: function(dataObj){
		//debugger;
		 console.log("DATA11 : "+dataObj);
		 
		itsfaqsearch.faqSingleSearchResultData = [];
		itsfaqsearch.faqSingleSearchResultData = dataObj;
		 if(dataObj.mainData.length > 0){
			//itsfaqsearch._clearCommonTabs();
			var template_data = itsfaqsearch._getViewStoredTemplate(itsfaqsearch.selectedViewName, dataObj.mainData[0]['_collection']);
			var tableName = '#its-faq-search .common-result-tab-container';
			$(tableName).empty();
			$(tableName).html(template_data);			
			Tempo.prepare($(tableName)).render(dataObj.mainData);
		 }else{
			var tableName = '#its-faq-search .common-result-tab-container';
			$(tableName).empty();
		 }
		 
		if(dataObj.didyoumeanArray.length > 0 && dataObj.didyoumeanArray){
			$('.query-textfield-conatiner .did-you-mean-conatiner').empty();
			var didyoumeanStr = '';
			for(var j=0; j<dataObj.didyoumeanArray.length; j++){
				didyoumeanStr +='<a onclick="itsfaqsearch._setDidyoumeanvaluetoTextField(this)">'+dataObj.didyoumeanArray[j].text+'</a>&nbsp &nbsp';
			}
			//$('.query-textfield-conatiner .did-you-mean-conatiner').append('<span class="did-you-mean-label font-red">Searching results for:</span><span class="bold did-you-mean-data">'+dataObj.didyoumeanArray[0].text+'</span>');
			$('.query-textfield-conatiner .did-you-mean-conatiner').append('<span class="did-you-mean-label font-red">Suggestion:</span> <span class="did-you-mean-data">'+didyoumeanStr+'</span>')
			//var _searchtxt = dataObj.didyoumeanArray[0].text;
			//itsfaqsearch._SearchMultiIndicesForText(_searchtxt, itsfaqsearch.listOfCurrentCollections, itsfaqsearch.resultsSize);
			//itsfaqsearch._sendMultiSearchQueryRequest(_searchtxt);
			/*itsfaqsearch._sendCommonSingleSearchQueryRequest(_searchtxt);
			itsfaqsearch._sendMultiClusterSearchQueryRequest(_searchtxt);
			itsfaqsearch._sendFaqSectionSearchQueryRequest(_searchtxt);*/
		}else{
			$('.query-textfield-conatiner .did-you-mean-conatiner').empty();
		}
		
			//var _searchtxt = $('#questionText').val()
			
			var _searchtxt = $('#questionText').val().replace(/([\!\*\+\-\=\<\>\&\|\(\)\[\]\{\}\^\~\?\:\\/"\n])/g, " ");
			itsfaqsearch._sendMultiSearchQueryRequest(_searchtxt);
		
	},
	_setDidyoumeanvaluetoTextField: function(eve){		
		console.log($(eve).text())
		var __txt = $(eve).text();
		$("#questionText").val(__txt);
		$("#searchfaq").trigger( "click" );
	},
	_multiSearchResultResponse: function(dataObj){
		// debugger;
		 console.log("DATA11 : "+dataObj);
		itsfaqsearch.faqMultiSearchResultData = [];
		itsfaqsearch.faqMultiSearchResultData = dataObj;
		if(dataObj.length > 0){
			itsfaqsearch._clearSplittedTabs();
			for(var i=0; i<dataObj.length; i++){
				//$('#its-analyze-search #analyze_search_resultsTab_InnerContainer_' + dataObj[i][0]['_collection']).empty();
				if(dataObj[i].length > 0){
					//var noDataContainerName  = '#its-analyze-search #analyze_search_resultsTab_InnerContainer_' + dataObj[i][0]['_collection']+' .no-data-conatiner';
					//$(noDataContainerName).hide();
					//faqtabs_its-faq_iseview
					var template_data = itsfaqsearch._getViewStoredTemplate(itsfaqsearch.selectedViewName, dataObj[i][0]['_collection']);
					var tableName = '#its-faq-search #splitted-faqtabs-'+dataObj[i][0]['_collection'];
					$(tableName).html(template_data);
					//var common_tableName = '#its-faq-search #common-faqtabs-'+dataObj[i][0]['_collection'];
					//$(common_tableName).html(template_data);
					
					Tempo.prepare($(tableName)).render(dataObj[i]);
					//Tempo.prepare($(common_tableName)).render(dataObj[i]);
					//$(tableName).show();
					
					
					if(itsfaqsearch._getViewStoredTypeOfDataView(itsfaqsearch.selectedViewName, dataObj[i][0]['_collection']) == 'table_view'){
					//if(dataObj[i][0]['_collection'] != "its-knownissue"){
						
						var oTable = $(tableName).dataTable({
													
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
											"targets": []
										}],
										"order": [
											[0, 'desc']
										],
										"lengthMenu": [
											[5, 15, 20, -1],
											[5, 15, 20, "All"] // change per page values here
										],
										// set the initial value
										"pageLength": 5,

									});
						
						 
						$(tableName+"_wrapper").css('overflow-x', 'hidden');
						 
					}
					
					//}
				}
			}
		}
		$("#splitted_tab .tab-container").show();
			$("#common_tab .common-result-tab-container").show();
			$('#splitted_tab .tab-container .dataTable').slimscroll({
					  color: 'rgb(165, 165, 165)',
					  size: '8px',
					  distance: '0px',
					  height: '307px'                     
			});
			$('#common_tab .common-result-tab-container').slimscroll({
				  color: 'rgb(165, 165, 165)',
				  size: '8px',
				  distance: '0px',
				  height: '359px'                     
			});
			
			$('.kv-gly-star').rating({
			containerClass: 'is-star'
			});
			
			$('.rating,.kv-gly-star').on('change', function () {
				itsfaqsearch.starRatingNumber = parseInt($(this).val());
			});
			
			$("#its-faq-search #starRatingTable a.dropdown-toggle").on('click', itsfaqsearch._renderRatingPopupData);
			$("#its-faq-search #starRatingTable #starRatingDropdown #submitRatingBtn").on('click', itsfaqsearch._submitRatingHandler);
			$("#its-faq-search #starRatingTable #starRatingDropdown #cancelRatingBtn").on('click', itsfaqsearch._cancelRatingHandler);
			$("#its-faq-search #starRatingTable #starRatingDropdown #ratingComment #textarearatingChars").live('keyup', itsfaqsearch._countRatingCommentCharHandler);
		ISEUtils.portletUnblocking("pageContainer");
	},
	_searchFaqSectionResultResponse: function(dataObj){
		//debugger;
		 console.log("DATA11 : "+dataObj);
		 
		itsfaqsearch.faqFaqSectionSearchResultData = [];
		itsfaqsearch.faqFaqSectionSearchResultData = dataObj;
		 if(dataObj.length > 0){
			 var faq_content = '';
			 $(".faq-conatiner .faq-body-conatiner .faq-list-conatiner").empty();
			 for(var i=0; i<dataObj.length; i++){
				 faq_content += '<h4 class="panel-title"><i class="fa fa-circle"></i><a class="faq-heading-title"> '+ dataObj[i].description+'</a></h4>'
			 }
			 $(".faq-conatiner .faq-body-conatiner .faq-list-conatiner").html(faq_content);
			 $('#its-faq-search .faq-conatiner .faq-title').text("Related Questions");
			 $('#its-faq-search .faq-conatiner .faq-body-conatiner').slimscroll({
					  color: 'rgb(165, 165, 165)',
					  size: '8px',
					  distance: '0px',
					  height: '432px'                     
				  });
		 }
	},
	_renderRatingPopupData: function(eve){
		itsfaqsearch.selectedRatingButton = eve.currentTarget;
		itsfaqsearch.starRatingNumber = 0;
		$('#its-faq-search #starRatingTable .rate-it-msg').hide();
		//var $row = $(this).closest("li");    // Find the row
		/* var selectedTableData = $($row).children("td").map(function() {
			return $(this).text();
		}).get();
		// Let's test it out
		itsfaqsearch.clickedTableRowID = $.trim(selectedTableData[1]); */
		itsfaqsearch.clickedTableRowID = $(this).closest("li").find(".id-number").text();
		itsfaqsearch.clickedCollectionName = $(this).closest("ul").attr('type-of-collection')
		itsfaqsearch.ratingTargetElement = $(this);
		var targetEle = itsfaqsearch.ratingTargetElement;
		if($(targetEle).attr('aria-expanded') == false || $(targetEle).attr('aria-expanded') == 'false'  || $(targetEle).attr('aria-expanded') == undefined || $(targetEle).attr('aria-expanded') == 'undefined'){
			var ratingformDetails = itsfaqsearch._getRatingFormDetails(itsfaqsearch.projectName);
			var ratingPopupContainer = $(targetEle).next('#starRatingDropdown').find('#starRatingContent');
			$(ratingPopupContainer).empty();
			if(ratingformDetails && ratingPopupContainer){
				if(ratingformDetails.formelements.questionselements){
					var finalFormHTMLData = '<form class="rating-form" action="javascript:;"><div class="form-body">';
					for(var f in ratingformDetails.formelements.questionselements){
						
						 switch(f) {
							case 'singleselect':
								 finalFormHTMLData += itsfaqsearch._createRadiobuttonGroup(ratingformDetails.formelements.questionselements[f]);
								break;
							case 'multiselect':
								 finalFormHTMLData += itsfaqsearch._createCheckBoxbuttonGroup(ratingformDetails.formelements.questionselements[f]);
								break;
							 case 'commentelement':
								 finalFormHTMLData += itsfaqsearch._createCommentGroup(ratingformDetails.formelements.questionselements[f]);
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
	_submitRatingHandler: function(eve){
		var submitTarget = eve.currentTarget;
		var ratingformData = new Object();
		ratingformData.formdetails = $(submitTarget).parent().prev().find('.rating-form').serializeArray();
		ratingformData.starrating = itsfaqsearch.starRatingNumber;
		
		if(ratingformData.formdetails.length > 1 || itsfaqsearch.starRatingNumber > 0 ){
			$('#starRatingTable .rate-it-msg').hide();
			//var getCurrentSelectedTabData = itsfaqsearch._getSelectedIndexName(itsfaqsearch.currentSelectedTabID)
			var projDetails = new Object();
			projDetails.DisplayName = itsfaqsearch.currentSelectedTabID;
			projDetails.collectionName = itsfaqsearch.clickedCollectionName //getCurrentSelectedTabData.indexes;
			projDetails.defectID = itsfaqsearch.clickedTableRowID;
			var ratingCollectObject = $.extend( true, ratingformData, projDetails );
			//var JSONformData = JSON.stringify(ratingCollectObject);
			var eventName = 'rating';
			ISEUtils.logUsageMetrics(eventName, ratingCollectObject, eventName,itsfaqsearch._logUsageMetricsResultHandler);
			$(itsfaqsearch.ratingTargetElement).attr("aria-expanded","false");
			$(itsfaqsearch.ratingTargetElement).parent().removeClass('open')
		}else{
			$('#starRatingTable .rate-it-msg').show();
			$('#starRatingTable .rate-it-msg').text('Please provide your valuable feedback');
		}
	},
	_cancelRatingHandler: function(eve){
		$(itsfaqsearch.ratingTargetElement).attr("aria-expanded","false");
		$(itsfaqsearch.ratingTargetElement).parent().removeClass('open')
	},
	_countRatingCommentCharHandler: function(e){
		var length = $(this).val().length;
		var length = itsfaqsearch.ratingFeedbackmaxLength-length;
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
		$(itsfaqsearch.selectedRatingButton).addClass('disabled');
		$(itsfaqsearch.selectedRatingButton).attr("title", "You already rated");
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
		for(var i=0; i<itsfaqsearch.jsonRatingCollection.length; i++){
			if((itsfaqsearch.jsonRatingCollection[i].project).toLowerCase() == (project_name).toLowerCase()){
				dataFound = true;
				return itsfaqsearch.jsonRatingCollection[i]
			}
		}
		if(dataFound == false){
			for(var j=0; j<itsfaqsearch.jsonRatingCollection.length; j++){
				if((itsfaqsearch.jsonRatingCollection[j].project).toLowerCase() == 'default'){
					dataFound = true
					return itsfaqsearch.jsonRatingCollection[j];
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
			
			var htmlData = '<div id="ratingComment" class="form-group"><label>'+form_ele_array.label+'</label><textarea id="textarearatingChars" maxlength="150" name="comment" class="form-control" rows="3"></textarea><span class="maxlength-feedback maxlength-full">0 characters remaining (150 max)</span></div>'
			 
			return htmlData;
		}	                                             		
	}, 
	
	_clearSplittedTabs:function(){
		for(var i=0; i<itsfaqsearch.listOfCurrentCollections.length; i++){
			var splitted_tableName = '#its-faq-search #splitted-faqtabs-'+itsfaqsearch.listOfCurrentCollections[i];
			$(splitted_tableName).empty();
		}
	},
	_clearCommonTabs:function(){
		/*for(var i=0; i<itsfaqsearch.listOfCurrentCollections.length; i++){
			var common_tableName = '#its-faq-search #common-faqtabs-'+itsfaqsearch.listOfCurrentCollections[i];
			$(common_tableName).empty();
		}*/
		
	},
	_SearchClusterResponse: function(dataObj){
		//debugger;
		console.log("HHHH : "+dataObj);
		if(dataObj.clusters && dataObj.clusters.length > 0){
			itsfaqsearch.clusterData = dataObj;
			 
			var clusterConatinersHolder = itsfaqsearch._initClusterRendere();
			
			var currentTabRef = '#its-faq-search .cluster-main-conatiner .cluster-list-container';
			//var currentTabTemplateContainerRef = '#analyze_search_resultsTab_InnerContainer_'+dataObj.hits.hits[0]._type+' .temp-content';
			//$(currentTabTemplateContainerRef).removeClass('col-md-12').addClass('col-md-7');
			$(currentTabRef).empty();
			//$(currentTabRef).append('<h4>Cluster Info</h4>'); 
			$(currentTabRef).append(clusterConatinersHolder); 
			//var clusterheadingContainerName  = '#its-analyze-search #analyze_search_resultsTab_InnerContainer_' +dataObj.hits.hits[0]._type+' .cluster-heading-conatiner';
			//$(clusterheadingContainerName).show();
			if(dataObj.clusters.length > 1){
				$('#its-faq-search .cluster-main-conatiner .cluster-list-container').slimscroll({
					  color: 'rgb(165, 165, 165)',
					  size: '8px',
					  distance: '0px',
					  height: '432px'                     
				  });
			}
			$(".show-more a").on("click", function() {
				var $link = $(this);
				var $content = $link.parent().prev("div.tab-content");
				var linkText = $link.text();

				$content.toggleClass("short-text, full-text");
				//$content.switchClass("short-text", "full-text", 400);
				$link.text(getShowLinkText(linkText));

				return false;
			});

			function getShowLinkText(currentText) {
				var newText = '';

				if (currentText.toUpperCase() === "SHOW MORE") {
					newText = "Show less";
				} else {
					newText = "Show more";
				}

				return newText;
			}
		}else{
			var currentTabRef = '#its-faq-search .cluster-main-conatiner .cluster-list-container';
			$(currentTabRef).empty();
		}
	},
	_initClusterRendere: function(){
		 
			var clu_col = '';
			var c_clu_col='';
			var titleLen = 210;
			var headingTitleLen = 150;
			for(var i=0; i< itsfaqsearch.clusterData.clusters.length; i++){
					var heading_text = itsfaqsearch.clusterData.clusters[i].label;
					/* var subStrHeadingTitle = '';
						if(heading_text.length > headingTitleLen) 
							subStrHeadingTitle = heading_text.substring(0, headingTitleLen)+'...';
						else 
							subStrHeadingTitle = heading_text; */
					subStrHeadingTitle = ISEUtils.trunc(headingTitleLen,heading_text, "string" );
					//c_clu_col += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="portlet box blue" style="box-shadow: -1px 1px 7px rgba(0,0,0,.4);"> <div class="portlet-title"> <div class="caption" title="'+heading_text+'"> <i class="glyphicon glyphicon-th"></i><span>'+ subStrHeadingTitle +'</span></div><div class="tools"> <a href="javascript:;" class="collapse" data-original-title="" title=""> </a> </div></div><div class="portlet-body tabs-below" style=""> <div class="tab-content short-text"> <div class="cluster-tab-content" id=cluster_tab_'+itsfaqsearch.clusterData.clusters[i].id+'>[cluster__Data]</div></div><div class="show-more"><a href="javascript:;">Show more</a></div></div></div></div>';
					
					c_clu_col += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="portlet box blue style="box-shadow: -1px 1px 7px rgba(0,0,0,.4);"> <div class="portlet-title"> <div class="caption" title="'+heading_text+'"> <i class="glyphicon glyphicon-th"></i>'+ subStrHeadingTitle +'</div><div class="tools"><a href="javascript:;" class="collapse" data-original-title="" title=""> </a> </div></div><div class="portlet-body tabs-below" style=""> <div class="tab-content short-text"><div id=cluster_tab_'+itsfaqsearch.clusterData.clusters[i].id+'>[cluster__Data]</div></div>[show_more_include]</div></div></div>';
					
					var clus_list_data="";
					var collectionName = itsfaqsearch.clusterData.hits.hits[0]._type
					for(var j=0; j<itsfaqsearch.clusterData.clusters[i].documents.length; j++){
						var title_txt = itsfaqsearch._getClusterTitle(itsfaqsearch.clusterData.clusters[i].documents[j]);
						var subStrTitle = ISEUtils.trunc(titleLen,title_txt, "string" );
						var crNumbtitleLen = 80;
						var crNumberTxt = itsfaqsearch.clusterData.clusters[i].documents[j];
						var subcrNumberTxt = ISEUtils.trunc(crNumbtitleLen,crNumberTxt, "string" );
						
						clus_list_data += '<label value='+itsfaqsearch.clusterData.clusters[i].documents[j]+' ><a data-target="#stack2" data-toggle="modal" collection-name="'+collectionName+'" id="'+itsfaqsearch.clusterData.clusters[i].documents[j]+'" onclick="itsfaqsearch._onDefectViewModal(this);"><span style="padding-left: 5px;" title="'+title_txt+'">'+subStrTitle+'</span></a></label>';
					}
					if(itsfaqsearch._visualHeight(clus_list_data) )
						c_clu_col = c_clu_col.replace('[show_more_include]', '<div class="show-more"><a href="javascript:;">Show more</a></div>');
					else
						c_clu_col = c_clu_col.replace('[show_more_include]', '<div class="show-more" style="visibility: hidden;"><a href="javascript:;">Show more</a></div>');
						
					c_clu_col = c_clu_col.replace('[cluster__Data]', clus_list_data);
			}
			
			return clu_col = '<div class="row clusters-list">'+c_clu_col+'</div>';
		},
		_onDefectViewModal: function(data) {
			
		var searchStr = data.id;
		 
		var collection_name = $(data).attr('collection-name')//$('#collectionsData').find('option:selected').attr('collection-name');
		 
		/*var projectName = localStorage.getItem('projectName');
		/*var params = ['PARAM1=' + searchStr];

		ISE.getDefectdetailsByID("getDefectDetailsById", params, projectName, false, itsfaqsearch._receivedDefectIdResults);*/
		console.log(searchStr);
		var projectName = '';//localStorage.getItem('projectName');
		var requestObject = new Object();  
			requestObject.collectionName = collection_name;
			requestObject.projectName = projectName;
			requestObject.searchString = '_id:\"'+searchStr+'\"';
			requestObject.maxResults = 25;                    
			ISE.getSearchResults(requestObject, itsfaqsearch._receivedDefectIdResults);  

			
	},
		
	_receivedDefectIdResults: function(data) {
		 console.log(data);
		 $('#defectTableHeader').empty();
		 $('#defectTable').empty();
		 for(var i=0;i<data.length;i++){
			console.log(data[i]._id);
			var __id = data[i]._id ?  data[i]._id : data[i].id
			var defectTableHeaderContent="Defect Details of     <b>" + ISEUtils.trunc(250,__id, "string" )+'</b>';
			$('#defectTableHeader').last().append(defectTableHeaderContent);
			var newDefRowContent = '<table><tbody>';
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'Description'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+itsfaqsearch._getStatusLabel(data[i].description)+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'Title'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td title="'+itsfaqsearch._getStatusLabel(data[i].title)+'" style="padding-left:10px;padding-bottom:.2em;">'+ISEUtils.trunc(400,itsfaqsearch._getStatusLabel(data[i].title), "string" )+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'Internaldefect'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+itsfaqsearch._getStatusLabel(data[i].internaldefect)+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'Last_updated_date'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+itsfaqsearch._getStatusLabel(data[i].last_updated_date)+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'Primary_feature'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+itsfaqsearch._getStatusLabel(data[i].primary_feature)+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'Primary_feature_parent'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+itsfaqsearch._getStatusLabel(data[i].primary_feature_parent)+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'Priority'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+itsfaqsearch._getStatusLabel(data[i].priority)+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'Severity'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+itsfaqsearch._getStatusLabel(data[i].severity)+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'Status'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+itsfaqsearch._getStatusLabel(data[i].status)+'</td></tr>'
				newDefRowContent+='</tbody></table>';
				$('#defectTable').last().append(newDefRowContent);
			}
		
	 },
	 _getStatusLabel: function(label_data){
		 if(label_data == 'undefined' || !label_data || label_data == 'null')
			 return "- NA -";
		 else
			 return label_data
		 
	 },
		
		_visualHeight:function(str){
			
			var pruler = document.createElement('div');
			pruler.className = 'short-text';
			var ruler = document.createElement('div');
			ruler.style.visibility = 'hidden';
			//ruler.style.lineHeight = '1';
			//ruler.style['white-space'] = 'nowrap';
			//ruler.className = 'well';
			pruler.appendChild(ruler);
			document.body.appendChild(pruler);
			
			ruler.innerHTML = str;
			var c = ruler.children;
		
			for (i = 0; i < c.length; i++) {
				c[i].style.display = "block";
				c[i].style.lineHeight = '1'
			}
			var l = ruler.offsetHeight;
			var p = pruler.offsetHeight;
			document.body.removeChild(pruler);
			if(l>p)
				return true;
			else
				return false;        
		},
		
		_visualWidth:function(str){
			
			var pruler = document.createElement('div');
			//pruler.className = 'short-text';
			//var ruler = document.createElement('div');
			pruler.style.visibility = 'hidden';
			//ruler.style.lineHeight = '1';
			//ruler.style['white-space'] = 'nowrap';
			//ruler.className = 'well';
			//pruler.appendChild(str);
			document.body.appendChild(pruler);
			
			pruler.innerHTML = str;
			 
			var l = pruler.offsetWidth;
			 
			document.body.removeChild(pruler);
			 
			return l;        
		},
	
	  _getClusterTitle: function(cluster_id) {
		  if(itsfaqsearch.clusterData.hits.hits && itsfaqsearch.clusterData.hits.hits.length > 0){
			for(var i=0; i<itsfaqsearch.clusterData.hits.hits.length; i++){
				if(cluster_id == itsfaqsearch.clusterData.hits.hits[i]._id){
					if(itsfaqsearch.clusterData.hits.hits[i].fields){
						if(itsfaqsearch.clusterData.hits.hits[i].fields.title)
							return itsfaqsearch.clusterData.hits.hits[i].fields.title[0]
						else if (itsfaqsearch.clusterData.hits.hits[i].fields.short_description )
							return itsfaqsearch.clusterData.hits.hits[i].fields.short_description[0]
						else if(itsfaqsearch.clusterData.hits.hits[i].fields['short'] )
							return itsfaqsearch.clusterData.hits.hits[i].fields['short'][0]
						else if(itsfaqsearch.clusterData.hits.hits[i].fields['configurationitem'] )
							return itsfaqsearch.clusterData.hits.hits[i].fields['configurationitem'][0]
						else if(itsfaqsearch.clusterData.hits.hits[i].fields['logs_info'] )
							return itsfaqsearch.clusterData.hits.hits[i].fields['logs_info'][0]
						
					}else{
						return 'No Title';
					}
				}
			}
		 }else{
			return 'No Title';
		 }
      },
};