var forums = {
//Variable Decleration
	forums_table:'',
	rows_selected:[],
	arrTags :[],
	tag_id_val:0,
	fromDate:'',
	toDate:'',
	xTriggered:0,
	jsonTableDetails:[],
	columnListDetailsArray:{},
	requestSearchCount:500,
	json_doc_data: {},
	docDetails:{},
	userRole:'',
	allowEditKnowledge:false,
	searchTerm:'',
	isNewSearchTerm:'',
	searchObj: new Object(),
	serviceName:"JscriptWS",
    methodname:"loadOrSaveJsonData",
    hostUrl:'/DevTest/rest/',
    userConfigData :{}, 
	questsearchObj: new Object(),
	
	
	reinit:function(){
		forums.handleSummernote();
		
		forums._advanceSearchFunc();
	},
	
	handleSummernote: function () {
        $('#page_forums #forum_description').summernote({height: 50});
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

	
		forums._filterSearchPortletHeaderDropDown();
		//forums._filterSearchPortletHeaderDropDown();

		forums.userRole = localStorage.getItem('rolename');
			
				
		$('.has-clear input[type="text"]').on('input propertychange', function() {
		  var $this = $(this);
		  var visible = Boolean($this.val());
		  $this.siblings('.form-control-clear').toggleClass('hidden', !visible);
		  if(visible)
		  $("#page_forums #searchKDoc").removeClass('disabled')
		else
		  $("#page_forums #searchKDoc").addClass('disabled')
		}).trigger('propertychange');

		$('.form-control-clear').click(function() {
		  $(this).siblings('input[type="text"]').val('')
			.trigger('propertychange').focus();
		}); 
		$('.has-clear input[type="text"]').keyup(function (e) {
			if (e.keyCode == 13) {				
            				
			}
		});
		
		$("#page_forums #forum_title" ).keydown(function( event ) {
          if ( event.which == 13 ) {
           event.preventDefault();
          }
			if ( event.which == 32 ) 
			{
				forums.xTriggered++;
				forums._advanceSearchforquestion($("#page_forums #forum_title").val());
			}
			event.stopImmediatePropagation();
        });
		
          $("#page_forums #forum_title" ).keyup(function( event ) {
          if ( event.which == 13 ) {
           event.preventDefault();
          }
          if ( event.which == 32 ) {
				forums.xTriggered++;
				forums._advanceSearchforquestion($("#page_forums #forum_title").val());
			}
			event.stopImmediatePropagation();
        });
		
        $('#page_forums #searchDoc').keyup(function (e) {
			if (e.keyCode == 13) 
			{
            forums._advanceSearchFunc();				
			forums._setUserPrefernce("SearchText");	
			}
		});
		
		$('#addTagsContainer .has-clear input[type="text"]').on('input propertychange', function() {
		  var $this = $(this);
		  var visible = Boolean($this.val());
		  $this.siblings('.form-control-clear').toggleClass('hidden', !visible);
		  if(visible)
		  $("#page_forums #addTagBtn").removeClass('disabled')
		else
		  $("#page_forums #addTagBtn").addClass('disabled')
		}).trigger('propertychange');
		
		$('#addTagsContainer .form-control-clear').click(function() {
		  $(this).siblings('input[type="text"]').val('')
			.trigger('propertychange').focus();
		}); 
		
		$("#page_forums #addTagBtn").on('click', function(){
		
			var selected_val = $("#page_forums #addTagInput").val().trim();
			selected_val = selected_val.replace(/ /g, "");
			if (selected_val && selected_val !== "" && selected_val.length !== 0)				
			forums._addTextTags(selected_val, 'inline-block');				
	    });
		
		 $("#page_forums #addTagInput").on({
			keydown: function(e) {
				if (e.which === 32)
					return false;
			},
			change: function() {
				this.value = this.value.replace(/\s/g, "");
			}
		});
		
		$("#page_forums #searchKDoc").on('click', function(){			
				forums._advanceSearchFunc();
				forums._setUserPrefernce("SearchText");            
				
		});
		
		$("#page_forums #aksquestionBtn").on('click', function(){
			forums.getAskQuestionJsonInfo();			
		});
		
		$("#page_forums #aksquestionBtn").on('click', function(){
			forums.getAskQuestionJsonInfo();			
		});
		
		$("#page_forums #Closeform").on('click', function(){
			forums.arrTags=[];
		});
		
		
		$("#page_forums #Closeformx").on('click', function(){
			forums.arrTags=[];
		});
		
		
		
		
		
	    $("#page_forums #forumsTable1 tbody #kdTitleRow").live('click', function(e){
						
			var __forumDocData = new Object();
			__forumDocData.doc_id = $(this).attr("doc-id");
			__forumDocData.doc_title = $(this).text();
			__forumDocData.doc_type = 'Forums';
			__forumDocData.current_page_name = ikePageConstants.FORUMS;
			
		
			//For Usage Metrics
			var usageData = new Object();
			var eventName = "similarSearch";
			usageData.KnowledgeID = __forumDocData.doc_id;
			usageData.UserId = localStorage.getItem('username');
			
			ISEUtils.logUsageMetrics(eventName, usageData); //uncomment this line to start logging knowledge usage
			//For Usage Metrics
			localStorage.setItem('SelectedforumItem', JSON.stringify(__forumDocData));
			$(location).attr('hash','#forumreply');
						
		});

		//Defining role to enable Delete and Add to knoledge package.
		
		forums._allowPermission(forums.userRole.toLowerCase());
		
		
		
    },
    //end of init
    _getParams: function _getParams(url) {
            var regex = /[?&]([^=#]+)=([^&#]*)/g,
                params = {},
                match;
            while (match = regex.exec(url)) {
                params[match[1]] = match[2];
            }
            return params;
        },
	_addTextTags:function(val, type){
	
		var selected_val = val;

        // check if exists -Gourik
      
        if ($.inArray(selected_val, forums.arrTags) == -1) {

		 forums.tag_id_val++;
		 
		 forums.arrTags.push(val);
		 
		 $("#page_forums #filterTagsHolder").append('<span class="tag" fieldValue="' + selected_val.trim() + '" onClick="forums.Searchwithtag(this)" id=tag_' + forums.tag_id_val + ' style="margin:1px 5px 1px 1px; display: inline-block;"><span>'+ selected_val.trim() + '&nbsp;&nbsp;</span><a style="display:'+type+'" parentID=tag_' + forums.tag_id_val + ' fieldValue='+escape(selected_val)+' onClick=forums._removeTagsFilter(this,event) title="Removing tag">x</a></span>');
       }
          
			 
		$("#page_forums #filterTagsHolder").show();
		
		$("#page_forums #addTagInput").val('');
		
	},
	Searchwithtag : function(spanObject)
    {
     var TagName = $("#" + spanObject.id).attr("fieldvalue");
     localStorage.removeItem('TagName'); 
     localStorage.setItem('TagName', "tags:"+TagName);
     $(location).attr('hash','#forums');
    },
	
	 _removeTagsFilter: function(event,e) {
		var tagToRemove = $(event).attr("fieldValue");
		
		var tagIndex = $.inArray(tagToRemove, forums.arrTags);	
		
		forums.arrTags.splice(tagIndex, 1);
		
		var parentID = $(event).attr("parentID");
		
		$("#" + parentID).remove();
		
		var numbOfTags = $("#page_forums #filterTagsHolder").children().length;
		if(numbOfTags == 0)
		{
			$("#page_forums #filterTagsHolder").hide();
		}
       e.stopImmediatePropagation();
	},
	
	
	getAskQuestionJsonInfo:function(){

		
		$('#page_forums #forum_description').summernote('code','');
		$("#page_forums #filterTagsHolder").empty();
		$("#page_forums #forum_title").val('');
		$('#results').empty();
		$("#page_forums #askQuestionPopup").show();			
		
		//$('#page_forums #askQuestionPopup').modal('show');
		
    },
	savequestion:function(){
	  				
		if (forums._isValidRecord())
		{
			ISEUtils.portletBlocking("pageContainer");
			
			var quesValues = new Object();		
			var QuestionTitle = $("#page_forums #forum_title").val().trim();
			var QuestionDesc = $('#page_forums #forum_description').summernote('code').trim();
			
			quesValues.title = QuestionTitle;
			quesValues.description = QuestionDesc;
			quesValues.tags = forums.arrTags;
			quesValues.status = "Asked";
			
			forums.arrTags = [];
			
			var currentdate = new Date(); 
				var datetime =  + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
			
			quesValues.asked = datetime;
			quesValues.askedby = localStorage.getItem('username');
			
			quesValues.updated = datetime;
			
			var _id = (Math.floor( Math.random() * 1000 ) + Date.now()).toString();
			
			quesValues._id = _id;
			
									
			ISE.UpdateQuestionMongo(quesValues,forums._forumResultHandler);
			
			$('#page_forums #askQuestionPopup').modal('hide');
			
			
						
		}
		//Bug 3469 ends
    },
	
	_forumResultHandler: function()
	{
		toastr.success('New question has been added successfully !!', 'Success');                    
		ISEUtils.portletUnblocking("pageContainer");
		forums.sleep(1000);		
		forums._advanceSearchFunc();
	},
	
	
	_isValidRecord: function()
	{
		var QuestionTitle = $("#page_forums #forum_title").val().trim();
		var QuestionDesc = $('#page_forums #forum_description').summernote('code').trim();
		
		if (!QuestionTitle || QuestionTitle.trim() === "" || undefined === QuestionTitle || 'undefined' === QuestionTitle)
		{
			alert("Question title can not be left blank.");
			return false;
		}
		
		if (!QuestionDesc || QuestionDesc.trim() === "" || undefined === QuestionDesc || 'undefined' === QuestionDesc)
		{
			alert("Question description can not be left blank.");
			return false;
		}
		
		return true;
	},
	
//SHAILCODE
    // filter data saved into json

    _PerformSavedSearch : function()
    {
		$("#page_forums #searchDoc").val("*");
		forums._advanceSearchFunc();			
     
    },

    SearchByTag :function(sourceObject)
    {
     $('#page_forums #searchDoc').val("tags:"+$(sourceObject).text());
       forums._advanceSearchFunc();
    },

    _loadUserDefaultConfigData:function(){ //salim
		
		//var  save = forums._saveJSON( hostUrl, serviceName, methodname, false, userDefaultConfigData, "no");
		var url = hostUrl + forums.serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&sname='+forums.methodname;
		var jsonData =  { username : localStorage.getItem('username') ,  operation : 'loadJsonData' }; 
		
		var  result = forums._loadJSON( 'POST', 'json', false, url, jsonData );
		
		if ( result.fileExists == "true"){
			try{					
				forums.userConfigData = JSON.parse(result.data);
			}catch(e){		
				console.log(''+e);
				return "no";
			}
			return "yes";
		}
	 return "no" ;
    },
    _setUserPrefernce:function( key, value){  //Gourik: To set user filter
		
		
		var url = hostUrl + forums.serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&sname='+forums.methodname;
		var jsonData =  { username : localStorage.getItem('username') ,  operation : 'loadJsonData' }; 
		var  result = forums._loadJSON( 'POST', 'json', false, url, jsonData );
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
		
		jsonData.data.SearchText = $("#page_forums #searchDoc").val();
		jsonData.operation='saveJsonData';
		var s =forums._saveJSON( hostUrl, serviceName, methodname, false, jsonData);
			
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
		var isOktoproceed=false;
		var searchtext = $('#page_forums #searchDoc').val();;
		forums.isNewSearchTerm = true;	
		//Pace.start();				 
		ISEUtils.portletBlocking("pageContainer");
		forums.searchObj.type = "advanced";
		forums.searchObj.input = '';
		forums.searchObj.input2 =searchtext.toString();
		forums.searchObj.indexes = iseConstants.str_forum_collection;
		forums._processSearchRequest(true);
    },
	
	_processSearchRequest: function(updateURL)//, updateDisplay) 
	{
		console.log('~~~~~ _processSearchRequest  ~~~~~ ');
		if( forums.searchObj.lastSearch) {
			if ( (Date.now() - forums.searchObj.lastSearch) < 1500) {
				console.log("Trying to search within 1.5 seconds again, there is some bug in your code !! performing no search");
				return;
			}
		}
		forums.searchObj.lastSearch = Date.now();
				
		if (updateURL) {
			forums._updateURL();
		}
			
		var searchtext =forums.searchObj.input2.replace(/\//g, " ");	
			
			//Process Search single and search Pattern
			if(searchtext.trim().length > 0)
			{
				var requestObject = new Object();
				requestObject.title = forums.searchObj.input.replace(/\//g, " ");
				requestObject.searchString = forums.searchObj.input2.replace(/\//g, " ");;
				
				requestObject.projectName = localStorage.getItem('multiProjectName');
				requestObject.maxResults = forums.requestSearchCount;
				requestObject.isAnalyzerRequired = true;
				// for sorting
				requestObject.sortByField = "published_at";
				requestObject.sortOrder = "desc";
				requestObject.serachType = forums.searchObj.type;
				requestObject.collectionName =  forums.searchObj.indexes; 
				
					var searchTag = searchtext;
              
					var tag = searchTag.split(':');

					/*
					if (tag) {
                      if (tag.length > 0) {
                          for (var i = 0; i < tag.length; i++) {
                              var strTemp = tag[i];
							  if(strTemp=="*")
							  {
								searchTag = strTemp;
							  }
							  else 
							  {
								searchTag = "tags:" + strTemp;
							  }
                              //$('#page_forums #searchDoc').val(searchText)
                              break;
                          }
                      }
                  }*/
					
					requestObject.searchString = searchTag;
					ISE.getSearchResults(requestObject, forums._receivedSearchResults);	
				
			}		
	},
	
	sleep:function (milliseconds) {

	
	
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
,
	
	_getAdditionalFilters: function(requestObject) 
	{
		var addlFilter = "";
		$.each(forums.jsonTableDetails.TableDetails, function(key, item) {
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
	
	
	_encodeSpecialText: function(key, value) {
            if (typeof value === "string") {
                return encodeURIComponent(value);
            }
            return value;
        },
		
	_updateURL: function() {
		var s = JSON.stringify(forums.searchObj, forums._encodeSpecialText);
		var newURL = window.location.protocol + "//" + window.location.host;
		newURL = newURL + window.location.pathname + "?SearchObj=" + s + "#forums";
		history.pushState("test", "test", newURL);
	},
	
	_pad: function(number) 
	{
		if (number < 10) 
		{
			return '0' + number;
		}
		return number;
	},
		
	
	_allowPermission: function(user_role){
		
		switch(user_role){
			case 'admin':
				forums.allowEditKnowledge = true;
			break;
			default:
				forums.allowEditKnowledge = false;
				$("#page_forums #docEleDelete").hide();;			
			break;
		}
	},
	 _filterSearchPortletHeaderDropDown: function() {

		var roleName = localStorage.getItem('rolename');
		$('#page_forums #searchKDFilterDropdown').empty();
		
		 
			
			var data={
  "TableDetails": {
    "ForumDocs": {
      "displayName": "ForumDocs",
      "enable": "yes",
      "indexName": "forum_collection",
      "additionalFilters": "",
      "allowedroles": [
        "Admin",
        "Test_Manager",
        "Tester",
        "Developer"
      ],
      "defaultView": [
        "Title",
		"Tags",
		"user",
        "published_at"
      ],
      "mobileView": [
         "Title",
		"Tags",
		"user",
        "published_at"
      ],
      "Details": {
        "fields": [
				
          {
            "displayName": "Title",
            "SourceName": "title",
            "dervied": "",
            "enable": "yes",
            "type": "string",
            "allowedroles": [
              "Admin",
              "Test_Manager",
              "Tester",
              "Developer"
            ],
            "displayType": "url",
            "filter": "no"
          }
          
        ]
      }
    }
  }
};
			forums.jsonTableDetails = data;
			
			
			
			forums.columnListDetailsArray = {};
			$.each(data.TableDetails, function(key, item) {
			 
				//  Filter Search List will be added based on role.
				if (item.enable == "yes") {

					for (var i = 0; i < item.allowedroles.length; i++) {

						if (item.allowedroles[i] == roleName) {

							var displayName = item.displayName;

							$('#page_forums .kd-table-conatainer').append('<div class="col-sm-12 table-scrollable1 table-responsive"><table class="table table-striped table-bordered table-hover dataTable" id="forumsTable1"></table></div>')
							$('#page_forums #forumsTable1').append("<thead><tr id=tableheader_" + displayName + "></tr></thead><tbody id=tablebody_" + displayName + "></tbody>");

							

							for (var j = 0; j < item.Details.fields.length; j++) {                                

								if(item.Details.fields[j].displayType != "expansion")
								$('#page_forums #tableheader_' + displayName).append("<th class='sorting ISEcompactAuto'>" + item.Details.fields[j].displayName + "</th>");
							}
							
						}
					}
					  
				}
					 
			});
			
			var getCurrentSelectedTabData = forums.columnListDetailsArray;
			//knowledgestore._fillColumnListinDropdown(getCurrentSelectedTabData.dropDownBoxId, getCurrentSelectedTabData.tableID, getCurrentSelectedTabData.defaultView, getCurrentSelectedTabData.itemDetailsfields);
			var elements = document.querySelectorAll('#page_forums #searchKDFilterDropdown label input:checked');
			Array.prototype.map.call(elements, function(el, i) {
				if(i>0)
				{
					$(el).removeAttr("checked");
					var resultsTabId = $(el).attr("resultTabID");
					var resultsTabInnerContainerID = $(el).attr("resultTabInnerContainerID");
					$("#page_forums #" + resultsTabId).addClass("hide");
					$("#page_forums #" + resultsTabInnerContainerID).removeClass("active in");
				}               
			});
            // if not requested from browser plugin
            var p = forums._getParams(window.location.search);
            if(!p.gQuery) 
            {
            if(localStorage.getItem('TagName'))
              {
               $('#page_forums #searchDoc').val(localStorage.getItem('TagName'));
               forums._advanceSearchFunc();
               localStorage.removeItem('TagName')
              }
              else
              {
				forums._PerformSavedSearch(); 
             }
            }
           
		
	},
	
	 _advanceSearch: function()
    {
     if(localStorage.getItem('TagName'))
     {
      $('#page_forums #searchDoc').val(localStorage.getItem('TagName'));
      forums._advanceSearchFunc();
      localStorage.removeItem('TagName')
     }
    },
	
	_insertOrDeleteDefaultTableColValue:function(chkVal, action)
	{
		if( forums.columnListDetailsArray.displayName)
		{
			if(action=='insert')
			{
				forums.columnListDetailsArray.defaultView.push(chkVal);
			}
			else if(action=='remove')
			{
				var k = forums.columnListDetailsArray.defaultView.indexOf(chkVal);
				if(k != -1) 
				{
					forums.columnListDetailsArray.defaultView.splice(k, 1);
				}
			 }
			 forums.columnListDetailsArray.defaultView = forums._uniqueArray(forums.columnListDetailsArray.defaultView);
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
		
	findindexes:function(source,find)
	{
	
		var regexp = find;
		var foo = source;
		var match, matches = [];

		while ((match = regexp.exec(foo)) != null) {
		matches.push(match[0]);
		}
		
		return matches;
},
_receivedSearchResults: function(dataObj) 
	{		
		$('#page_forums #docActionContainer .kwdg-store-doc-count').text("0"+' Results')		
		if (ISEUtils.validateObject(dataObj)) 
		{		
			var FieldsMap = {};
			var DisplayNameMap = {};
			var displayColumns = {};
			var tC = {};

			forums.json_doc_data = dataObj
		 
			for (var K in forums.jsonTableDetails.TableDetails) 
			{
				var temp = new Array();
				for(var l=0;l<forums.jsonTableDetails.TableDetails[K].Details.fields.length;l++)
				{
					var obj =forums.jsonTableDetails.TableDetails[K].Details.fields[l];
					if(obj.displayType != "expansion")                          
						temp.push(obj);                         

				}

				FieldsMap[forums.jsonTableDetails.TableDetails[K].indexName] = temp;
				DisplayNameMap[forums.jsonTableDetails.TableDetails[K].indexName] = forums.jsonTableDetails.TableDetails[K].displayName;
				displayColumns[forums.jsonTableDetails.TableDetails[K].indexName] = forums.jsonTableDetails.TableDetails[K].defaultView;
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
				var tableID = '#page_forums #forumsTable1';
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
				//if(forums.allowEditKnowledge)
					var newRowContent ='<tr class="odd gradeX" data-row-id="'+row_inc+'">';
				//else
				//	var newRowContent = '<tr class="odd gradeX" data-row-id="'+row_inc+'"><td><input document-id="'+documentID+'"  type="checkbox" class="checkboxes disabled" disabled="disabled" value="'+row_inc+'"/></td>';	
				
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
							
							var fieldname = "title";
							documenttype="url";
							filter="no";
							var textContent = dataObj[i][fieldname];
							var completeText = dataObj[i][fieldname];
							var description = dataObj[i]["description"];
							var completedescription = dataObj[i]["description"];
							var askedby = dataObj[i]["askedby"];
							var published_at = dataObj[i]["asked"];
							
							var QuesStatus = dataObj[i]["status"];
							
							String.prototype.replaceAll = function(target, replacement) {
									return this.split(target).join(replacement);
								};
				
							if(undefined !=textContent && 'undefined' != textContent && typeof textContent !== "number")
							{
								//title field//
								textContent = textContent.replaceAll('&nbsp;','<br>');
								textContent = textContent.replaceAll("<em class='iseH'>",'##');
								textContent = textContent.replaceAll("</em>","#");
								
								completeText = completeText.replaceAll('&nbsp;','');
								completeText = completeText.replaceAll("<em class='iseH'>",'');
								completeText = completeText.replaceAll("</em>","");
								
								
							}
							
							if(undefined !=description && 'undefined' != description && typeof description !== "number")
							{
								description = description.replaceAll('&nbsp;','<br>');
								description = description.replaceAll("<em class='iseH'>",'##');
								description = description.replaceAll("</em>","#");
								
								completedescription  = completedescription .replaceAll('&nbsp;','');
								completedescription  = completedescription .replaceAll("<em class='iseH'>",'');
								completedescription  = completedescription .replaceAll("</em>","");
							}
							
							
							if(textContent && textContent.length > 0)
							{
								var subTextContent = textContent;
								var subdescription =  description;
								
								subTextContent = (textContent.length > 100) ? textContent.substring(0,100) + "...." : textContent;
								
								if(typeof subTextContent !== "number")
								{
									subTextContent = subTextContent.replaceAll('<br>','&nbsp;');
									subTextContent = subTextContent.replaceAll('##','<em class="iseH">');
									subTextContent = subTextContent.replaceAll("#","</em>");
								}
								
								subdescription = forums.remove_tags(subdescription);
									if (subdescription.length > 100)
										subdescription = subdescription.substring(0,100) + "....";
								
								
								var escapeContent = escape(textContent);
								var escapeDesc = escape(description);
								
								var arrContent = dataObj[i]["tags"];
								var textVal = "";
								if (arrContent)
								{
									for(var j = 0; j < arrContent.length; j++)
									{
										//if (textVal !== "")
											//textVal = "<span style='margin:1px 5px 1px 1px; display: inline-block;cursor:pointer;    background: #aaa;color: #fff;border: 0; padding: 3px 6px;' class='tag' onclick='forums.SearchByTag(this);'>" + textVal + "</span>";									
										if (typeof arrContent[j] == "object")
										{									
											textVal = textVal + "<span style='margin:1px 5px 1px 1px; display: inline-block;cursor:pointer;    background: #aaa;color: #fff;border: 0; padding: 3px 6px;' class='tag' onclick='forums.SearchByTag(this);'>" + arrContent[j][fields[ii].propertyName] + "</span>";
										}
										else
										{
											textVal = textVal + "<span style='margin:1px 5px 1px 1px; display: inline-block;cursor:pointer;    background: #aaa;color: #fff;border: 0; padding: 3px 6px;' class='tag' onclick='forums.SearchByTag(this);'>" + arrContent[j] +"</span>";
										}	

									}
								}
								else
								{
										textVal ="<span class='tag' style='margin:1px 5px 1px 1px; display: inline-block;cursor:pointer;    background: #aaa;color: #fff;border: 0; padding: 3px 6px;' onclick='forums.SearchByTag(this);'>" + arrContent +"</span>";
								}	
															
								if(textContent.length >= 0  && fieldname == "title")
								{
									var dateObj = dataObj[i]["published_at"];
									var newDateObj = new Date(dateObj);				
									newRowContent += '<td class="ISEcompactAuto"><span title="'+completeText+'" sourceLine='+sourceLine+' documenttype='+documenttype+' indexCollection='+indexCollection+' documentID='+documentID+' requiredfilter=' + filter + ' displaytype='+ "url" +' ><a href="javascript:;" doc-id="'+documentID+'" id="kdTitleRow">' +subTextContent+'</a><BR><span>'+ subdescription +'</span><br><br> ' + textVal + '<span style="float:right">'+ " &nbsp; " + "  " + askedby + ' </span><span style="float:right">'+ QuesStatus + " " + forums._getLastUpdatedDateTime(newDateObj) + '</span></span></td>';
								}
								
							}
							
					
					}
				
				newRowContent += '</tr>';
				$('#page_forums #tablebody_' + dName).append(newRowContent);				
			}
			
			
			for (var tab in tC) 
			{
				var tableColumnsCount = $(tab).find('tr')[0].cells.length;
				var tempArr = new Array();
				for(var i=1;i<tableColumnsCount;i++)
				{
					tempArr.push(i);                    
				}
				forums._handleUniform();
				forums.forums_table =  $('#page_forums #forumsTable1').DataTable({
				"bSort":false,
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
				
				var total_rec_count = $("#page_forums #forumsTable1").DataTable().page.info().recordsTotal;
				$('#page_forums #docActionContainer .kwdg-store-doc-count').text(total_rec_count+' Results')
				
				$("#page_forums tbody #kdTitleRow").live('click', function(e){
					var doc_id = $(this).attr("doc-id");
					console.log("Selected Knowledge: "+doc_id)
				});
				
			
				
			}
			$('#searchResultsTable').removeClass("hide");

			forums.searchResultsReceived = true;
			//  Hide Table rows dropdown and Table Search
			$("div").find(".dataTables_length").addClass('hidden-sm hidden-xs');
			$("div").find(".dataTables_filter").addClass('hidden-sm hidden-xs');

			var windowWidth = $(window).width();
			if (windowWidth <= 400) {
				forums.onResizeWindow();//todo
				$("html, body").animate({
					scrollTop: $(document).height()
				}, 1000);
			}
		}
		else 
		{									 						
			var oTable = $('#page_forums #forumsTable1').dataTable();
			oTable.fnClearTable();
			oTable.fnDestroy();	
		}
 		
		$("#addExpand").css("width", "3.40%");
		

		var sourceCodeTableRowCount = $('#sample_4_SourceCode tbody').children().length;      
		ISEUtils.portletUnblocking("pageContainer");

		Pace.stop();
	}
,

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
    
	
    
    _deleteKnowledgemapping:function(KnowledgeMappingID){

		var param =[];
		param[0]="PARAM1="+KnowledgeMappingID;
		var data = '{"fileName":"delete_knowledgemapping","params":"'+param+'","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,forums.deletedKnowledgeInformationStatus);

    },
	deletedKnowledgeInformationStatus:function(statusObject){

		console.log(JSON.stringify(statusObject))
	},

	
	_ShowErrorMsg: function(msg_txt, visible){
		$('#page_forums #moreFiltersPopup .modal-footer .alert.alert-danger .error-msg').empty();
		$('#page_forums #moreFiltersPopup .modal-footer .alert.alert-danger .error-msg').last().append(msg_txt);
		if(visible)
			$('#page_forums #moreFiltersPopup .modal-footer .alert.alert-danger').show();
		else
			$('#page_forums #moreFiltersPopup .modal-footer .alert.alert-danger').hide();
	},
	
	_validateDateRange: function(){
		
		var fromDate = forums.fromDate;
		var toDate = forums.toDate;
		
		if (fromDate=="" && toDate=="")
			return false;
		
		if(fromDate=="" && toDate!=""){				
				var errorContent = ' Please enter start date';
				forums._ShowErrorMsg(errorContent, true);
				return false;
		}else if(toDate=="" && fromDate!=""){
				var errorContent = ' Please enter end date';
				forums._ShowErrorMsg(errorContent, true);
				return false;
		}else if(fromDate>toDate){
				var errorContent = ' Filter Start Date should not Greater than End Date';
				forums._ShowErrorMsg(errorContent, true);
				return false;
		}else{
			return true;
		}
		
	},
	
	_createDropdownSelectTwo: function(displayName, optionsArray){
		  var htmlData = '<div class="form-group"><label>'+displayName+'</label><select multiple="multiple" id="Options" class="multi-select-'+displayName+'">'
		 for(var i=0; i<optionsArray.length; i++){
				htmlData += ' <option value="'+optionsArray[i]+'">'+optionsArray[i]+'</option>';
		 }
		 htmlData += '</select>'
		 return htmlData;					
	},
		
	_createCheckBoxbuttonGroup: function(displayName, subOptions, storedOpts){
		if(subOptions.length > 0){
			var htmlData = '<div class="form-group"> <label>'+displayName+'</label><div class="checkbox-list">';
			for(var i=0; i<subOptions.length; i++){
				var _checkedVal = forums._setCheckedValue(subOptions[i], storedOpts)
				htmlData += '<label><span><input '+_checkedVal+' type="checkbox" name="type" value="'+subOptions[i]+'"></span>'+ subOptions[i]+'</label>';
			}
			htmlData += '</div></div>';
			return htmlData;
		}	                                             		
	},
	_createStarRatingComp: function(displayName, start_val){
		var htmlData = '<div class="form-group"> <label>'+displayName+'</label>'
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
	
	
	_getDocDetails:function(doc_id){
		for(var i=0; i<forums.json_doc_data.length; i++)
		{
			if(doc_id == forums.json_doc_data[i]._id)
			{
				return forums.json_doc_data[i];
			}
		}	  
	},
	
	_getPopoverBodyContent:function(data){
		var popoverBody = '<div class="row"> <div class="col-md-12"><div class="form-group" id="docMoreInfoContent"> <p> Modified on <span> '+data.published_at+' </span><br> User:  <span>'+data.user+'</span> </p></div><div class="btn-group"><a class="btn btn-xs btn-success" id="openDocBtn" data-apply="confirmation">Open</a><a class="btn btn-xs default" id="shareDocBtn" data-apply="confirmation"> Share</a></div></div></div>';
		return popoverBody;
	},
	
	_getTableIndexName:function()
	{
		return forums.columnListDetailsArray.indexes;			 
	}, 
	_advanceSearchforquestion: function(searchText) 
	{
       		forums.isNewSearchTerm = false;
			forums.questsearchObj.type = "advanced";
			forums.questsearchObj.input = searchText;
			forums.questsearchObj.input2 = searchText;
			forums._processQuestionSearchRequest();
	},
	
	_processQuestionSearchRequest: function()
	{
		forums.questsearchObj.lastSearch = Date.now();
		
		if (forums.questsearchObj.type == 'advanced') 
		{
                var requestObject = new Object();
                requestObject.title = forums.questsearchObj.input.replace(/\//g, " ");
                requestObject.searchString ="title:"+forums.questsearchObj.input2.replace(/\//g, " ");
                requestObject.filterString = '';
				requestObject.projectName = localStorage.getItem('multiProjectName');
                requestObject.maxResults = 10;
			    requestObject.isAnalyzerRequired = true;
                requestObject.serachType = "";
                requestObject.collectionName = iseConstants.str_forum_collection; 
                requestObject.filterString = '';
                ISE.getSearchResults(requestObject, forums._receivedSearchResultsKeydown);
               
            }           
	},

    _receivedSearchResultsKeydown: function(data)
    {
     $('#results').show();
     $('#results').empty();
     var newRowContent=''

     for(var i=0; i<data.length;i++)
     {

        var faq_content = '';
		for(var i=0; i<data.length; i++){
             if(i==0)
             {
              faq_content = '<h2 class="panel-title">'+ "Question found with same title :" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a onClick="knowledgereadandedit.HideSuggestions()"  class="faq-heading-title"> '+ "Hide"+'</a></h2>';
              //faq_content += '<h4 class="panel-title"><a class="faq-heading-title"> '+ "Hide"+'</a></h4>'
             }
			//faq_content += '<h4 class="panel-title"><i class="fa fa-circle"></i><a class="faq-heading-title"> '+ data[i]["title"]+'</a></h4>'
            faq_content += '<h3 class="panel-title"><i class="fa fa-circle"></i>'+ data[i]["title"]+'</h3>'
		}
            

     }
    
     $('#results').append(faq_content);	
    },
};

