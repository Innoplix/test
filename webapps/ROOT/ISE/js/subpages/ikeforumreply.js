var ikeforumreply={
SelectedikeforumItem:'',
jsonTableDetails:[],
columnListDetailsArray:{},
requestSearchCount:500,
json_doc_data: {},
allowMark:true,
EditQuestion:false,
searchObj: new Object(),
isNewSearchTerm:'',
hideTableColumns:[],
currentReplyid:'',
tag_id_val:0,
tagedit_id_val:0,
arrTags:[],
temparr:[],
userRole:'',
allowEditKnowledge:false,
questsearchObj: new Object(),
reinit:function(){
		
		
		//ikeforumreply._advanceSearch();
		$('#page_ikeforumreply #answer_description').summernote('code','');
		$('#page_ikeforumreply #comments_description').summernote('code','');
		$('#page_ikeforumreply #forum_qdescription').summernote('code','');
		
		ikeforumreply.getForumData();
		ikeforumreply._processSearchRequestforViewupdate();
		
	},
	
		
		
	handleSummernote: function () {
        $('#page_ikeforumreply #answer_description').summernote({height: 100});
		$('#page_ikeforumreply #comments_description').summernote({height:100});
		$('#page_ikeforumreply #forum_qdescription').summernote({height: 100});
		
    },
	
	Post: function () {
       // $('#page_ikeforumreply #answer_description').summernote({height: 50});
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
	
	/* Init function  */
    init: function() {
		ikeforumreply.handleSummernote();
		//ikeforumreply.onLoadActionComponent();
		ikeforumreply._filterSearchPortletHeaderDropDown();
		
		ikeforumreply.userRole = localStorage.getItem('rolename');
		
		ikeforumreply._allowPermission(ikeforumreply.userRole.toLowerCase());
		
		ikeforumreply.getForumData();
		ikeforumreply._processSearchRequestforViewupdate();
		
		
		$("#page_ikeforumreply #replyBtn").on('click', function(){
			ikeforumreply.SetReply();			
		});
		
		$("#page_ikeforumreply #editquesBtn").on('click', function(){
			ikeforumreply.setQuestionpop();			
		});
		
		$("#page_ikeforumreply #forum_qtitle" ).keydown(function( event ) {
          if ( event.which == 13 ) {
           event.preventDefault();
          }
			if ( event.which == 32 ) 
			{
				ikeforumreply.xTriggered++;
				ikeforumreply._advanceSearchforquestion($("#page_ikeforumreply #forum_qtitle").val());
			}
			event.stopImmediatePropagation();
        });
		
          $("#page_ikeforumreply #forum_qtitle" ).keyup(function( event ) {
          if ( event.which == 13 ) {
           event.preventDefault();
          }
          if ( event.which == 32 ) {
				ikeforumreply.xTriggered++;
				ikeforumreply._advanceSearchforquestion($("#page_ikeforumreply #forum_qtitle").val());
			}
			event.stopImmediatePropagation();
        });
		
		$("#page_ikeforumreply #addTagBtn").on('click', function(){
		
			var selected_val = $("#page_ikeforumreply #addTagInput").val().trim();
			selected_val = selected_val.replace(/ /g, "");
			if (selected_val && selected_val !== "" && selected_val.length !== 0)				
			ikeforumreply._addTextTags(selected_val, 'inline-block');				
	    });
		$("#page_ikeforumreply #addTagInput").on({
			keydown: function(e) {
				if (e.which === 32)
					return false;
			},
			change: function() {
				this.value = this.value.replace(/\s/g, "");
			}
		});
	
    },
	
	UpdateViewCount:function(quesValues){
	  		
			ISEUtils.portletBlocking("pageContainer");
			// var quesValues = ikeforumreply.SelectedikeforumItem;
				if(!quesValues.viewcount)
					quesValues.viewcount = 1;
				else
					quesValues.viewcount = quesValues.viewcount + 1;
			
									
			ISE.UpdateForumViewcountMongo(quesValues,ikeforumreply._UpdateViewcountHandler);
						
		
		//Bug 3469 ends
    },
	
	UpdatePin:function(quesValues){
	  		
			ISEUtils.portletBlocking("pageContainer");
			// var quesValues = ikeforumreply.SelectedikeforumItem;
			
			
			quesValues.Ispinned = (!quesValues.Ispinned); 
				
			ISE.UpdateForumMongo(quesValues,ikeforumreply._UpdatePinHandler);
						
		
		//Bug 3469 ends
    },
	
	_addTextTags:function(val, type){
		var selected_val = val;
		

        // check if exists -Gourik
      
        if ($.inArray(selected_val, ikeforumreply.arrTags) == -1) {

		 ikeforumreply.tagedit_id_val++;
		 
		 ikeforumreply.arrTags.push(val);
		 
		 $("#page_ikeforumreply #ReplyfilterTagsHolder").append('<span class="tag" fieldValue="' + selected_val.trim() + '" id=tag_' + ikeforumreply.arrTags.length + ' style="margin:1px 5px 1px 1px;background: #aaa;color: #fff;border: 0; padding: 3px 6px;display: inline-block;"><span>'+ selected_val.trim() + '&nbsp;&nbsp;</span><a style="display:inline-block;background: #aaa;color: #fff;" parentID=tag_' + ikeforumreply.arrTags.length + ' fieldValue='+escape(selected_val)+' onClick=ikeforumreply._removeTagsFilter(this,event) title="Removing tag">x</a></span>');
       }
		//ikeforumreply._RenderTags (ikeforumreply.arrTags,'ReplyfilterTagsHolder');
		
		$("#page_ikeforumreply #ReplyfilterTagsHolder").show();
		
		$("#page_ikeforumreply #addTagInput").val('');
		
	},
	_removeTagsFilter: function(event,e) {
		var tagToRemove = $(event).attr("fieldValue");
		
		var tagIndex = $.inArray(tagToRemove, ikeforumreply.arrTags);	
		
		ikeforumreply.arrTags.splice(tagIndex, 1);
		
		var parentID = $(event).attr("parentID");
		$("#" + parentID).remove();
		
		var numbOfTags = $("#page_ikeforumreply #ReplyfilterTagsHolder").children().length;
		
		if(numbOfTags == 0)
		{
			$("#page_ikeforumreply #ReplyfilterTagsHolder").hide();
		}
       e.stopImmediatePropagation();
	},
	
	_advanceSearchforquestion: function(searchText) 
	{
       		ikeforumreply.isNewSearchTerm = false;
			ikeforumreply.questsearchObj.type = "advanced";
			ikeforumreply.questsearchObj.input = searchText;
			ikeforumreply.questsearchObj.input2 = searchText;
			ikeforumreply._processQuestionSearchRequest();
	},
	
	_processQuestionSearchRequest: function()
	{
		ikeforumreply.questsearchObj.lastSearch = Date.now();
		
		if (ikeforumreply.questsearchObj.type == 'advanced') 
		{
                var requestObject = new Object();
                requestObject.title = ikeforumreply.questsearchObj.input.replace(/\//g, " ");
                requestObject.searchString ="title:"+ikeforumreply.questsearchObj.input2.replace(/\//g, " ");
                requestObject.filterString = '';
				requestObject.projectName = localStorage.getItem('multiProjectName');
                requestObject.maxResults = 10;
			    requestObject.isAnalyzerRequired = true;
                requestObject.serachType = "";
                requestObject.collectionName = iseConstants.str_ikeforum_collection; 
                requestObject.filterString = '';
                ISE.getSearchResults(requestObject, ikeforumreply._receivedSearchResultsKeydown);
               
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
	
	setQuestionpop:function(){

		
		$('#page_ikeforumreply #forum_qdescription').summernote('code','');
		$("#page_ikeforumreply #ReplyfilterTagsHolder").empty();
		$("#page_ikeforumreply #forum_qtitle").val('');
		$('#results').empty();
		
		$('#page_ikeforumreply #forum_qtitle').val(ikeforumreply.SelectedikeforumItem.title);
		$('#page_ikeforumreply #forum_qdescription').summernote('code',ikeforumreply.SelectedikeforumItem.description);
		
		
		ikeforumreply.arrTags =[];
		
		if(ikeforumreply.SelectedikeforumItem.tags)
		{
			for(var j=0;j< ikeforumreply.SelectedikeforumItem.tags.length;j++)
			{
				ikeforumreply.arrTags.push(ikeforumreply.SelectedikeforumItem.tags[j]); 
			}
		}		
		
		ikeforumreply._RenderEditableTags (ikeforumreply.arrTags,'ReplyfilterTagsHolder');
						
    },
	
	SetReply:function(){
		
		$('#moreInfoModalTitle').text("Answer");
		$('#page_ikeforumreply #answer_description').summernote('code','');
	},
	
	SetComments:function(){
		
		$('#moreInfoModalTitle').text("Comments");
		$('#page_ikeforumreply #comments_description').summernote('code','');
		$('#page_ikeforumreply #commentsPopup').modal('show');
		
    },
	savecomments:function()
	{
	if( ikeforumreply._isValidComment())
	{
			//CommentDesc = $('#page_ikeforumreply #comments_description').summernote('code').replace(/<\/?[^>]+(>|$)/g, "").trim();
			var CommentDesc = $('#page_ikeforumreply #comments_description').summernote('code').trim();
						
			var _id = (Math.floor( Math.random() * 1000 ) + Date.now()).toString();
			
			var quesValues = new Object();
			quesValues = ikeforumreply.SelectedikeforumItem;
			var inputDate = new Date().toISOString();
			
			if(CommentDesc && CommentDesc.trim().length > 0)
			{
				var comment = new Object();
				comment.commentdesc = CommentDesc;
				comment.commentedby = localStorage.getItem('username');
				comment.commentedon = inputDate;
				comment._id = _id;
							
				if(quesValues.replies)
				{
					var matches = $.grep(quesValues.replies, function(e){ return e._id == ikeforumreply.currentReplyid; });
						
						if(!matches[0].Comments)
							matches[0].Comments=[];
						
						//matches[0].Comments.splice(0, 0, comment);
						matches[0].Comments.push(comment);  
				}
								
				
				ikeforumreply._UpdateMongo(quesValues);
				$('#page_ikeforumreply #commentsPopup').modal('hide');
				
			
			}
	
	}
	
	
	
	},
	
	savereply:function(){
	  				
		if (ikeforumreply._isValidRecord() )
		{
			var AnswerDesc = $('#page_ikeforumreply #answer_description').summernote('code').trim();
								
			var quesValues = new Object();
			quesValues = ikeforumreply.SelectedikeforumItem;
			
			var _id = (Math.floor( Math.random() * 1000 ) + Date.now()).toString();
			var inputDate = new Date().toISOString();
			
			
			if(AnswerDesc && AnswerDesc.trim().length > 0)
			{
				var reply = new Object();
				reply.answerDesc = AnswerDesc;
				reply.repliedby = localStorage.getItem('username');
				reply.replied = inputDate;
				reply.IsCorrect = false;
				reply._id = _id;
						
				if(!quesValues.replies)
					quesValues.replies=[];
			
				quesValues.replies.push(reply);
				
				quesValues.updated = inputDate;
				
				quesValues.status =  "Answered";
				
				
			
				ikeforumreply._UpdateMongo(quesValues);
				
				$('#page_ikeforumreply #replyPopup').modal('hide');
				
				
			}
			
		}
		//Bug 3469 ends
    },
	
	_UpdateMongo:function(quesValues)
	{
		ISE.UpdateForumMongo(quesValues,ikeforumreply._forumResultHandler);
	},
	_forumResultHandler: function()
	{
		toastr.success('Data Added/updated successful !!', 'Success'); 
		ikeforumreply.sleep(1000);
		ikeforumreply.getForumData();
	},
	_UpdateViewcountHandler: function()
	{
		ikeforumreply.sleep(1000);
		ikeforumreply.getForumData();
	},
	
	_UpdatePinHandler: function()
	{
		ikeforumreply.sleep(1000);
		ikeforumreply.getForumData();
	},
		
	_isValidRecord: function()
	{
		var QuestionDesc = $('#page_ikeforumreply #answer_description').summernote('code').trim();
		
		if (!QuestionDesc || QuestionDesc.trim() === "" || undefined === QuestionDesc || 'undefined' === QuestionDesc)
		{
			alert("Answer description can not be left blank.");
			return false;
		}

		return true;
	},
	_isValidComment: function()
	{
		
		var CommentsDesc = $('#page_ikeforumreply #comments_description').summernote('code').trim();
					
		if (!CommentsDesc || CommentsDesc.trim() === "" || undefined === CommentsDesc || 'undefined' === CommentsDesc)
		{
			alert("Comments description can not be left blank.");
			return false;
		}

		return true;
	},
		
	getForumData:function() {
	
		$('#page_ikeforumreply #divTags').empty();
		
		
		ikeforumreply.SelectedikeforumItem = JSON.parse(localStorage.getItem('SelectedikeforumItem'));
		
		if(ikeforumreply.SelectedikeforumItem)
		{
			$('#page_ikeforumreply #title').text(ikeforumreply.SelectedikeforumItem.doc_title);
			ikeforumreply._SearchForumItem(ikeforumreply.SelectedikeforumItem.doc_id);
		}
	
	},
	_SearchForumItem: function(searchText) 
	{
			if(!ikeforumreply.SelectedikeforumItem.doc_id)
			{
				searchText = ikeforumreply.SelectedikeforumItem._id;
			}
	
       		ikeforumreply.isNewSearchTerm = false;
			ikeforumreply.searchObj.type = "advanced";
			ikeforumreply.searchObj.input2 = searchText;
			ikeforumreply._processSearchRequest(true);
			//ikeforumreply._updateURL();
	},
	
	_encodeSpecialText: function(key, value) {
            if (typeof value === "string") {
                return encodeURIComponent(value);
            }
            return value;
        },
	
	_updateURL: function() {
	 //alert('inside update url');
		var s = JSON.stringify(ikeforumreply.searchObj, ikeforumreply._encodeSpecialText);
		var newURL = window.location.protocol + "//" + window.location.host;
		newURL = newURL + window.location.pathname + "?SearchObj=" + s + "#ikeforumreply";
		history.pushState("test", "test", newURL);
	},
	
	_processSearchRequest: function(updateURL)
	{
	
		
		ikeforumreply.searchObj.lastSearch = Date.now();
		
		if (updateURL) {
		 //alert('update url');
			//ikeforumreply._updateURL();
		}
		
		if (ikeforumreply.searchObj.type == 'advanced') 
		{
                var requestObject = new Object();
                
                requestObject.searchString ="_id:"+ikeforumreply.searchObj.input2.replace(/\//g, " ");
                requestObject.filterString = '';
				requestObject.projectName = localStorage.getItem('multiProjectName');
                requestObject.maxResults = 999;
			    requestObject.isAnalyzerRequired = true;
                requestObject.serachType = "";
                requestObject.collectionName = iseConstants.str_ikeforum_collection; 
                requestObject.filterString = '';
                ISE.getSearchResults(requestObject, ikeforumreply._receivedSearchResults);
               
            }           
	},
	_processSearchRequestforViewupdate: function()
	{
		var recid = ikeforumreply.SelectedikeforumItem.doc_id;
		
		if(!recid)
		recid=ikeforumreply.SelectedikeforumItem._id;
		
		ikeforumreply.searchObj.lastSearch = Date.now();
		if (ikeforumreply.searchObj.type == 'advanced') 
		{
                var requestObject = new Object();
                
                requestObject.searchString ="_id:"+recid;
                requestObject.filterString = '';
				requestObject.projectName = localStorage.getItem('multiProjectName');
                requestObject.maxResults = 999;
			    requestObject.isAnalyzerRequired = true;
                requestObject.serachType = "";
                requestObject.collectionName = iseConstants.str_ikeforum_collection; 
                requestObject.filterString = '';
                ISE.getSearchResults(requestObject, ikeforumreply._receivedSearchResultsforviewupdate);
               
            }           
	},
	
	_processSearchRequestforPinupdate: function()
	{
		var recid = ikeforumreply.SelectedikeforumItem.doc_id;
		
		if(!recid)
		recid=ikeforumreply.SelectedikeforumItem._id;
		
		ikeforumreply.searchObj.lastSearch = Date.now();
		if (ikeforumreply.searchObj.type == 'advanced') 
		{
                var requestObject = new Object();
                
                requestObject.searchString ="_id:"+recid;
                requestObject.filterString = '';
				requestObject.projectName = localStorage.getItem('multiProjectName');
                requestObject.maxResults = 999;
			    requestObject.isAnalyzerRequired = true;
                requestObject.serachType = "";
                requestObject.collectionName = iseConstants.str_ikeforum_collection; 
                requestObject.filterString = '';
                ISE.getSearchResults(requestObject, ikeforumreply._receivedSearchResultsforPinupdate);
               
            }           
	},
	
	_filterSearchPortletHeaderDropDown: function() {

		var roleName = localStorage.getItem('rolename');
		$('#page_ikeforumreply #searchKDFilterDropdown').empty();
		
		var data={
  "TableDetails": {
    "ForumDocs": {
      "displayName": "ForumDocs",
      "enable": "yes",
      "indexName": "ikeforum_collection",
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

			ikeforumreply.jsonTableDetails = data;
			
			ikeforumreply.columnListDetailsArray = {};
			$.each(data.TableDetails, function(key, item) {
			 
				//  Filter Search List will be added based on role.
				if (item.enable == "yes") {

					for (var i = 0; i < item.allowedroles.length; i++) {

						if (item.allowedroles[i] == roleName) {

							var displayName = item.displayName;

							$('#page_ikeforumreply .kd-table-conatainer').append('<div class="col-sm-12 table-scrollable1 table-responsive"><table class="table table-striped table-hover dataTable" id="ikeforumreplyTable1"></table></div>')
							$('#page_ikeforumreply #ikeforumreplyTable1').append("<thead><tr style='display:none;' id=tableheader_" + displayName + "></tr></thead><tbody id=tablebody_" + displayName + "></tbody>");

						

							for (var j = 0; j < item.Details.fields.length; j++) {                                

								if(item.Details.fields[j].displayType != "expansion")
								$('#page_ikeforumreply #tableheader_' + displayName).append("<th >" + "" + "</th>");
							}
							
						}
					}
					  
				}
					 
			});
			
			var getCurrentSelectedTabData = ikeforumreply.columnListDetailsArray;
			//knowledgestore._fillColumnListinDropdown(getCurrentSelectedTabData.dropDownBoxId, getCurrentSelectedTabData.tableID, getCurrentSelectedTabData.defaultView, getCurrentSelectedTabData.itemDetailsfields);
			var elements = document.querySelectorAll('#page_ikeforumreply #searchKDFilterDropdown label input:checked');
			Array.prototype.map.call(elements, function(el, i) {
				if(i>0)
				{
					$(el).removeAttr("checked");
					var resultsTabId = $(el).attr("resultTabID");
					var resultsTabInnerContainerID = $(el).attr("resultTabInnerContainerID");
					$("#page_ikeforumreply #" + resultsTabId).addClass("hide");
					$("#page_ikeforumreply #" + resultsTabInnerContainerID).removeClass("active in");
				}               
			});
            // if not requested from browser plugin
            var p = ikeforumreply._getParams(window.location.search);
            if(!p.gQuery) 
            {
            if(localStorage.getItem('TagName'))
              {
               $('#page_ikeforumreply #searchDoc').val(localStorage.getItem('TagName'));
               ikeforumreply.getForumData();
               localStorage.removeItem('TagName')
              }
              else
              {
              ikeforumreply.getForumData(); 
             }
            }
           
		
		String.prototype.replaceAll = function(target, replacement) {
						return this.split(target).join(replacement);
				};
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
		
	_RenderTags : function(arrTags,ContainerName)
	{
	  $('#page_ikeforumreply' + '#'+ContainerName).html('');
	   if(arrTags.length > 0)
	   {
	    var content ="";
	    for(var counter=0; counter <arrTags.length; counter++)
		 {
		  content = content +'<span style="margin:1px 5px 1px 1px;background: #aaa;color: #fff;border: 0; padding: 3px 6px;" class="tag">' + arrTags[counter] + "</span>";
		 }
		
		 $('#'+ContainerName).html(content);
	   }
	},
	
	_RenderEditableTags : function(arrTags,ContainerName)
	{
	  $('#page_ikeforumreply' + '#'+ContainerName).html('');
	  
	  ikeforumreply.tagedit_id_val++;
	  
	   if(arrTags.length > 0)
	   {
		var content ="";
	    for(var counter=0; counter <arrTags.length; counter++)
		 {
			var selected_val=arrTags[counter];
		   content = content +'<span class="tag" fieldValue="' + selected_val.trim() + '" id=tag_' + counter + ' style="margin:1px 5px 1px 1px;background: #aaa;color: #fff;border: 0; padding: 3px 6px;display: inline-block;"><span>'+ selected_val.trim() + '&nbsp;&nbsp;</span><a style="display:inline-block;background: #aaa;color: #fff;" parentID=tag_' + counter + ' fieldValue='+escape(selected_val)+' onClick=ikeforumreply._removeTagsFilter(this,event) title="Removing tag">x</a></span>';
		 }
		
		 $('#'+ContainerName).html(content);
		 
		  $('#'+ContainerName).show();
	   }
	   
	  
	},
	
	_allowPermission: function(user_role){
		
		switch(user_role){
			case 'admin':
				ikeforumreply.allowEditKnowledge = true;
			break;
			default:
				ikeforumreply.allowEditKnowledge = false;
						
			break;
		}
	},
	
	_receivedSearchResultsforviewupdate: function(dataObj) 
	{	
		if(dataObj.length > 0)
		{
			ikeforumreply.UpdateViewCount(dataObj[0]);
		}	
		
	},
	
	_receivedSearchResultsforPinupdate: function(dataObj) 
	{	
		if(dataObj.length > 0)
		{
			ikeforumreply.UpdatePin(dataObj[0]);
		}	
		
	},
	
	_receivedSearchResults: function(dataObj) 
	{	

		$('#page_ikeforumreply #docActionContainer .kwdg-store-doc-count').text("0"+' Reply(s) '+ '0 Views')		
		
		if(dataObj.length==0)
		{
			var oTable = $(tableID).dataTable();
			oTable.fnClearTable();
			oTable.fnDestroy();
			return;
		}	
			
		var oTable = $(tableID).dataTable();
		oTable.fnClearTable();
		oTable.fnDestroy();
		$('#page_ikeforumreply #QuesDescription').empty();
		
		if (ISEUtils.validateObject(dataObj)) 
		{	
			ikeforumreply.SelectedikeforumItem = dataObj[0];

			$('#page_ikeforumreply #QuesDescription').html(dataObj[0].description);
			
			$('#page_ikeforumreply #title').html(dataObj[0].title);
			
			
			$("#kdUnPinnedRow").attr("src","");
			if(dataObj[0].Ispinned)
				{
					$("#kdUnPinnedRow").attr("src", "images/pin1.png?v=" + new Date().getTime());
					$("#spnImagetitle").text('click image to unpin the title');
					
				}
			else
				{
					$("#kdUnPinnedRow").attr("src", "images/pin2.png?v=" + new Date().getTime());
					$("#spnImagetitle").text('click image to pin the title');
				}
			
			if(ikeforumreply.allowEditKnowledge)
			{
				$("#kdUnPinnedRow").show();
				$("#spnImagetitle").show();
				
			}
			else 
			{
				$("#kdUnPinnedRow").hide();
				$("#spnImagetitle").hide();
			}

			
			if(dataObj[0].askedby == localStorage.getItem('username') || localStorage.getItem('rolename')=="Admin")
			{
				ikeforumreply.allowMark =true;
				ikeforumreply.EditQuestion=true;
			}	
			else 
			{
				ikeforumreply.allowMark =false;
				ikeforumreply.EditQuestion=false;
			}
					
			
			if(ikeforumreply.EditQuestion==true)
				$("#page_ikeforumreply #editquesBtn").show()
			else
				$("#page_ikeforumreply #editquesBtn").hide()
			
			
			ikeforumreply._RenderTags (dataObj[0].tags,'divTags');
			
			var FieldsMap = {};
			var DisplayNameMap = {};
			var displayColumns = {};
			var tC = {};

			ikeforumreply.json_doc_data = dataObj
		 
			for (var K in ikeforumreply.jsonTableDetails.TableDetails) 
			{
				var temp = new Array();
				for(var l=0;l<ikeforumreply.jsonTableDetails.TableDetails[K].Details.fields.length;l++)
				{
					var obj =ikeforumreply.jsonTableDetails.TableDetails[K].Details.fields[l];
					if(obj.displayType != "expansion")                          
						temp.push(obj);                         

				}

				FieldsMap[ikeforumreply.jsonTableDetails.TableDetails[K].indexName] = temp;
				DisplayNameMap[ikeforumreply.jsonTableDetails.TableDetails[K].indexName] = ikeforumreply.jsonTableDetails.TableDetails[K].displayName;
				displayColumns[ikeforumreply.jsonTableDetails.TableDetails[K].indexName] = ikeforumreply.jsonTableDetails.TableDetails[K].defaultView;
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
				var tableID = '#page_ikeforumreply #ikeforumreplyTable1';
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
				var ForumitemdocumentID = escape(dataObj[i][documentIdColumnName]);
				var sourceLineURL="sourceline";
				var row_inc = (i+1);
				
				
				
				if(dataObj[i].replies && dataObj[i].replies.length > 0)
				{
				for (var m=0; m < dataObj[i].replies.length; m++) {
					if (dataObj[i].replies[m].IsCorrect!= undefined && dataObj[i].replies[m].IsCorrect) {
						var a = dataObj[i].replies.splice(m,1);   // removes the item
						dataObj[i].replies.unshift(a[0]);         // adds it back to the beginning
						break;
					}
				}
				
				
				for (var k = 0; k < dataObj[i].replies.length; k++) 
				{
				var newRowContent = '<tr class="odd gradeX" data-row-id="'+row_inc+'">';	
				
				var documentID = escape(dataObj[i].replies[k]._id);
				var simplifyURL = (dataObj[i]["simplifyURL"]);
				var indexCollection = escape(dataObj[i][indexCollectionname]); 
				var sourceLine = escape(dataObj[i][sourceLineURL]);		
				if(documentID === undefined)
					{
						newRowContent += '<td class="ISEcompactAuto"><span sourceLine="null" documentID="null" indexCollection="null" requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';
					}
					else
					{		
							var fieldname = "answerDesc";
							documenttype="string";
							filter="no";
							var textContent = dataObj[i].replies[k].answerDesc;
							var completeText = dataObj[i].replies[k].answerDesc;
							var askedby = dataObj[i].replies[k].repliedby;
							var published_at = dataObj[i].replies[k].replied;
							var newDateObj = new Date(published_at);	
									
							if(undefined !=textContent && 'undefined' != textContent && typeof textContent !== "number")
							{
								//title field//
								/*
								textContent = textContent.replaceAll('&nbsp;','<br>');
								textContent = textContent.replaceAll("<em class='iseH'>",'##');
								textContent = textContent.replaceAll("</em>","#");
								
								
								completeText = completeText.replaceAll('&nbsp;','');
								completeText = completeText.replaceAll("<em class='iseH'>",'');
								completeText = completeText.replaceAll("</em>","");
								*/
								
								
							}
							
							
							if(textContent && textContent.length > 0 )
							{
								var subTextContent = textContent;
						
								
								if(typeof subTextContent !== "number")
								{
									/*
									subTextContent = subTextContent.replaceAll('<br>','&nbsp;');
									subTextContent = subTextContent.replaceAll('##','<em class="iseH">');
									subTextContent = subTextContent.replaceAll("#","</em>");
									*/
								}
								
								var arrContent=[];
								if(dataObj[i].replies[k].Comments)
									arrContent = dataObj[i].replies[k].Comments;
									
									
								
								var textVal = "";
								if (arrContent)
								{
									textVal= "<div  style='overflow-y: auto;height:50px;background-color:white;padding:5px;display:table;'><div font-size: 150px>"+ arrContent.length + " Comment(s).</div><table style='margin-left: 3cm'>"
									for(var j = 0; j < arrContent.length; j++)
									{
										var dateObj = arrContent[j].commentedon;
										var newDateObj = new Date(dateObj);		
										textVal = textVal + "<tr  bgcolor='white'><td class='pull-left' style='float:left;width:800px;padding-right: 0px;padding-left:0px;'><div>"  +  arrContent[j].commentdesc   +  "<div></td><td  style='vertical-align: bottom;float:right;padding-left: 50px'>" +  ikeforumreply._getLastUpdatedDateTime(newDateObj) + " by " +  arrContent[j].commentedby + "</td>&nbsp;&nbsp;</tr><tr style='height: 10px;'></tr>" ;
										
									}
									
									textVal = textVal +  '</table></div>'; 
								}
								else
								{
										textVal ="<div style='background:grey;margin-right:10px;display: inline;border: thin solid black;cursor:pointer;' onclick='forums.SearchByTag(this);'>" + arrContent +"</div>";
								}	
						
								
								var escapeContent = escape(textContent);
																
								if(textContent.length >= 0)
								{
									
								newRowContent += '<td class="ISEcompactAuto"><span style="float:right">'+ "Replied "  +  ikeforumreply._getLastUpdatedDateTime(newDateObj)  + ' by '+ askedby +'</span><br><div>' + completeText+'</div><br><div style="text-align:center;float:right"> <a class="btn blue" href="javascript:;"forum-id="'+ForumitemdocumentID+'" doc-id="'+documentID+'" id="kdTitleRow" >' + "Click here to comment" + '</a></div><br><br><br><span >'+ textVal + '</span></span></td>';
										
								}
								
							}
							
					
					}
				
				newRowContent += '</tr>';
				$('#page_ikeforumreply #tablebody_' + dName).append(newRowContent);				
				}
				}
			}
			
			
			
			for (var tab in tC) 
			{
				var tableColumnsCount = $(tab).find('tr')[0].cells.length;
				var tempArr = new Array();
				for(var i=1;i<tableColumnsCount;i++)
				{
					tempArr.push(i);                    
				}
				ikeforumreply._handleUniform();
				ikeforumreply.forums_table =  $('#page_ikeforumreply #ikeforumreplyTable1').DataTable({
				"bPaginate":false,
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
						"emptyTable": "No Replies",
						"infoEmpty": "",
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
				
				$("#ikeforumreplyTable1_info").hide();
				var viewcount = 0;
				if(dataObj && dataObj[0] && dataObj[0].viewcount)
				{
					viewcount =dataObj[0].viewcount;
				}
				var total_rec_count = $("#page_ikeforumreply #ikeforumreplyTable1").DataTable().page.info().recordsTotal;
				$('#page_ikeforumreply #docActionContainer .kwdg-store-doc-count').text(total_rec_count+' Reply(s) ' + viewcount  + ' Views')
				
				$("#page_ikeforumreply tbody #kdTitleRow").live('click', function(e){
				
					var doc_id = $(this).attr("doc-id");
					ikeforumreply.currentReplyid=doc_id;
					ikeforumreply.SetComments();
					console.log("Selected Knowledge: "+doc_id)
				});
				
				$("#page_ikeforumreply tbody #kdMarkRow").live('click', function(e){
				
					var doc_id = $(this).attr("doc-id");
					ikeforumreply.currentReplyid=doc_id;
					
					if(ikeforumreply.SelectedikeforumItem && ikeforumreply.SelectedikeforumItem.replies)
					{
					
						var matches = $.grep(ikeforumreply.SelectedikeforumItem.replies, function(e){ return e.IsCorrect == true;});
					
						if(matches.length > 0)
						{
							matches[0].IsCorrect = false;

						}
							
						matches = $.grep(ikeforumreply.SelectedikeforumItem.replies, function(e){ return e._id == ikeforumreply.currentReplyid; });
		
						if(matches.length > 0)
						{
								matches[0].IsCorrect = true;		
			
								ikeforumreply._UpdateMongo(ikeforumreply.SelectedikeforumItem);
			
						}
							
							
					}
					
					console.log("Selected Knowledge: "+doc_id)
					e.stopImmediatePropagation();
					
					
				});
				
				
				$(tab).unbind('click'); // SIMY: removing all events in case if there was some event set here ..
				$(tab).on('click', ' tbody td .row-details', function(event) {
					var nTr = $(this).parents('tr')[0];
					var tID = $(this).closest('table').attr('id');

					var cols = [];
					cols = ikeforumreply._getColumnNamesList(tID);//todo
					
					var oTable = $('#' + tID).dataTable();

					if (oTable.fnIsOpen(nTr)) {
						/* This row is already open - close it */
						$(this).addClass("row-details-close").removeClass("row-details-open");
						oTable.fnClose(nTr);
					} else {
						// Open this row 
						$(this).addClass("row-details-open").removeClass("row-details-close");
						//oTable.fnOpen(nTr, ikeforumreply._fnDefectSearchRowFormatDetails(oTable, nTr, cols), 'details');//todo
					}
				});
			}

			

			$('#searchResultsTable').removeClass("hide");

			ikeforumreply.searchResultsReceived = true;
			//  Hide Table rows dropdown and Table Search
			$("div").find(".dataTables_length").addClass('hidden-sm hidden-xs');
			$("div").find(".dataTables_filter").addClass('hidden-sm hidden-xs');

			var windowWidth = $(window).width();
			if (windowWidth <= 400) {
				ikeforumreply.onResizeWindow();//todo
				$("html, body").animate({
					scrollTop: $(document).height()
				}, 1000);
			}
		}
		else 
		{									 						
			var oTable = $('#page_ikeforumreply #ikeforumreplyTable1').dataTable();
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
sleep:function (milliseconds) {

	
	
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
,

savequestion:function(){
	  				
		if (ikeforumreply._isValidQuestion())
		{
			ISEUtils.portletBlocking("pageContainer");
			
			var quesValues = ikeforumreply.SelectedikeforumItem;		
			var QuestionTitle = $("#page_ikeforumreply #forum_qtitle").val().trim();
			var QuestionDesc = $('#page_ikeforumreply #forum_qdescription').summernote('code').trim();
			var updateDate = new Date().toISOString();
			
			quesValues.title = QuestionTitle;
			quesValues.description = QuestionDesc;
			quesValues.tags = ikeforumreply.arrTags;
			quesValues.status = "Modified";
			ikeforumreply.arrTags = [];
			
			quesValues.asked = updateDate;
			quesValues.updated = updateDate;
			
									
			ISE.UpdateForumMongo(quesValues,ikeforumreply._forumResultHandler);
			$('#page_ikeforumreply #ikeforumreplyaskQuestionPopup').modal('hide');
						
		}
		//Bug 3469 ends
    },
	
	
	
	
	_isValidQuestion: function()
	{
		var QuestionTitle = $("#page_ikeforumreply #forum_qtitle").val().trim();
		var QuestionDesc = $('#page_ikeforumreply #forum_qdescription').summernote('code').trim();
		
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