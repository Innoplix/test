var knowledgereadandedit = {

	//Variable Declaration
	Security : 
	{
            levels: [{
                "SecurityLevel": "Project",
                "SecurityValue": localStorage.getItem('projectName')
            }, {
                "SecurityLevel": "Organisation",
				"SecurityValue": localStorage.getItem('organizationName')
            }, {
                "SecurityLevel": "Public",
                "SecurityValue": true
            }]
        },
      
	userStarRatingNumber:0,
	enableEdit:false,
    searchObj: new Object(),
	tag_id_val:0,
	iconeType:'',
    xTriggered:0,
	objRatings : {},					
	arrComments:[],
	arrKnowledgeAssets : [],
	arrPreviousAssets: [],
	arrSmartFaqs: [],
	moreFilterCompModalID:'knowledgeReadEditMoreFilterCompModal',
	addVisualizationPreviewCompModalID:'addVisualizationPreviewModalContainer',
	addVisualizationFilterCompModalID:'addVisualizationFilterModalContainer',
	moreFilterJsonFileName:'moreFilter',
	tableJsonVisualizationFileName:'visualizationTable',
	tableJsonDashboardFileName:'dashboardTable',	
	knwldgAddCompTable:'knwdgAddEditCompTable',
	knwldgAddCompRightTable:'knwdgAddEditCompRightTable',	 
	arrTags :[],
	arrStreams :[],
	arrActivities :[],
	arrTechnology:[],	 
	valProject :"",
	valOrganization :"",
	valPublic :"",
	valReviewer:"",
	valStatus:"Not-Reviewed",
	sKnowledge:{},
	arrTotalVisualizations:[],	
	arrSelectedVisualization:[],
	arrTotalDashboard:[],
	arrSelectedDashboard:[],
	selectedDocList:[],
    requestSearchCount:999,
	currentUser : '',
	objDBData:{},
	strKnowledgeDesc:'',
	strReviewComments:'',
	fileUploader:{},
	arrUrls:[],
	dataFromRemoteFile : '',
	documentId:'',
	NewdocumentId:'',
	NewdocumentTitle:'',
	leftTableTableComponentRef:'',
	containsAttachments:false,
	popupInvoker:'',
	readyToLoadData:false,
	isCreatedVisualizationAndDashboardConatainer:false,
	isCreatedImageAndVideoConatainer:false,
	visualizationAndDashboardInnerConatainerCount:0,
	imageAndVideoConatainerCount:0,
	lastsearchedtext:'',
	actionsRef:'',		
    defaultURLStability:'',		
    defaultURLHotspot:'',		
	htmldoccontent:'',
    fileNames : new Array(),
		othersDataObj:{},
	strDocText : '',
	searchIndex:0,
	blnchagedoccolor:false,
	translatedTitle:"",
	translatedDesc :"",
	projectName:"",
	isContentLoaded:false,
	
    /* Init function  */
	reinit:function(){
		knowledgereadandedit.currentUser = localStorage.getItem('username');
		knowledgereadandedit.userRole = localStorage.getItem('rolename');		
		knowledgereadandedit.actionsRef._setCurrentPage(ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
		knowledgereadandedit.actionsRef._setTargetPage(ikePageConstants.KNOWLEDGE_READ_AND_EDIT);

         //stability
        knowledgereadandedit._ReadStabilityHotSpot();

		knowledgereadandedit.readKnowledgeStoredData();
	},
    init: function() {
		knowledgereadandedit.currentUser = localStorage.getItem('username');
		knowledgereadandedit.userRole = localStorage.getItem('rolename');
    
        //stability
        knowledgereadandedit._ReadStabilityHotSpot();
    
		$("#ViewHtmlContainer").on('shown.bs.modal', function (e) {
            $("#page_knowledgereadandedit #searchhtmlDoc").val(knowledgereadandedit.lastsearchedtext).trigger('input');
			e.stopImmediatePropagation();
		});
		
		$("#page_knowledgereadandedit #searchhtmlDoc").on('keyup',function(e){
			if(e.which == 13) 
			{		
				var selector = document.getElementById("InContain").contentWindow.document.getElementsByClassName("HighlightText");
				$(document.getElementById("InContain").contentWindow.document).scrollTop(selector[knowledgereadandedit.searchIndex].offsetTop);
				knowledgereadandedit.searchIndex++;				
				if (!selector[knowledgereadandedit.searchIndex])
					knowledgereadandedit.searchIndex = 0;								
			}
		});

		if (iseConstants.ConvertDocstoHTML)
		{
		$("#page_knowledgereadandedit #searchhtmlDoc").on('input propertychange paste',function(e){
			var inputTerm = $("#page_knowledgereadandedit #searchhtmlDoc").val();
			knowledgereadandedit.searchIndex = 0;
			if (knowledgereadandedit.strDocText == "" && document.getElementById("InContain") && document.getElementById("InContain").contentWindow)				
				knowledgereadandedit.strDocText = document.getElementById("InContain").contentWindow.document.body.innerHTML; 				
 				
			if(inputTerm.trim().length > 0 && document.getElementById("InContain").contentWindow)
			{
				var searchTerms = knowledgereadandedit._getSearchString(inputTerm);
				var regex = new RegExp(">([^<]*)?("+searchTerms+")([^>]*)?<","ig");
				document.getElementById("InContain").contentWindow.document.body.innerHTML = knowledgereadandedit._highlightTextNodes(regex);								
				$(document.getElementById("InContain").contentWindow.document).scrollTop(document.getElementById("InContain").contentWindow.document.getElementsByClassName("HighlightText")[0].offsetTop);				
				knowledgereadandedit.searchIndex++;
			}
			else
			{
			if(document.getElementById("InContain") && document.getElementById("InContain").contentWindow)
			{	
				document.getElementById("InContain").contentWindow.document.body.innerHTML = knowledgereadandedit.strDocText;		 
			}			
			}			
		});
		}
							    
        $("#page_knowledgereadandedit #knowledge_title" ).keydown(function( event ) {
          if ( event.which == 13 ) {
           event.preventDefault();
          }
			if ( event.which == 32 ) 
			{
          knowledgereadandedit.xTriggered++;
				knowledgereadandedit._advanceSearchFunc($("#page_knowledgereadandedit #knowledge_title").val());
			}
			event.stopImmediatePropagation();
        });
		
          $("#page_knowledgereadandedit #knowledge_title" ).keyup(function( event ) {
          if ( event.which == 13 ) {
           event.preventDefault();
          }
          if ( event.which == 32 ) {
          knowledgereadandedit.xTriggered++;
				knowledgereadandedit._advanceSearchFunc($("#page_knowledgereadandedit #knowledge_title").val());
			}
			event.stopImmediatePropagation();
        });
           
		$(document).bind("keyup keydown", function(e){
			if(e.ctrlKey && e.keyCode == 80){
				alert("You are not authorized to take print of document.")
				return false;
			}
		});

		$('#addTagsContainer .has-clear input[type="text"]').on('input propertychange', function() {
		  var $this = $(this);
		  var visible = Boolean($this.val());
		  $this.siblings('.form-control-clear').toggleClass('hidden', !visible);
		  if(visible)
		  $("#page_knowledgereadandedit #addTagBtn").removeClass('disabled')
		else
		  $("#page_knowledgereadandedit #addTagBtn").addClass('disabled')
		}).trigger('propertychange');
		
		$('#addTagsContainer .form-control-clear').click(function() {
		  $(this).siblings('input[type="text"]').val('')
			.trigger('propertychange').focus();
		}); 

		$('#page_knowledgereadandedit #chksmartfaq').click(function() {
        if (!$(this).is(':checked')) {
            $('#page_knowledgereadandedit #btnAddMoreFaq').hide();
        }
		else 
		{
			$('#page_knowledgereadandedit #btnAddMoreFaq').show();
		}
		});

		$("#page_knowledgereadandedit #addTagBtn").on('click', function(){
			var selected_val = $("#page_knowledgereadandedit #addTagInput").val().trim();
			if (selected_val && selected_val !== "" && selected_val.length !== 0)				
			knowledgereadandedit._addTextTags(selected_val, 'inline-block');				
	    });
	    $("#page_knowledgereadandedit #addTagInput").on({
			keydown: function(e) {
				if (e.which === 32)
					return false;
			},
			change: function() {
				this.value = this.value.replace(/\s/g, "");
			}
		});
		
		
		
		$("#page_knowledgereadandedit #btnAddMoreFaq").on('click', function(){
		
			$("#page_knowledgereadandedit #knowledgeReadEditAddMoreFAQModal #url-search-container").empty();
			$("#page_knowledgereadandedit #knowledgeReadEditAddMoreFAQModal .url-search-container input").val('');
			
				//knowledgereadandedit.arrSmartFaqs = [];
				
				
			$("#knowledgeReadEditAddMoreFAQModal").modal('show');
			
			
	    });
		
		
	    $("#page_knowledgereadandedit #addUrlsFileBtn").on('click', function(){
			$("#page_knowledgereadandedit #addURLsModalContainer #urlResultListContainer").empty();
			$("#page_knowledgereadandedit #addURLsModalContainer .url-search-container input").val('');
			knowledgereadandedit.arrUrls = [];
			$("#addURLsModalContainer").modal('show');
	    });
		
	    $("#page_knowledgereadandedit #addFAQBtn").on('click', function(){
		   
           var txt_val = $("#page_knowledgereadandedit #knowledgeReadEditAddMoreFAQModal .faq-search-container #txtDisplayquestion").val();
           if(txt_val!="")
           {
		   if(txt_val.length > 0){
				
				var FAQObject = {};
				FAQObject.question = txt_val;
                
				if(txt_val.length > 100 )
				 FAQObject.question = txt_val.substr(0, 99)+".....";
                else
                 FAQObject.question = txt_val;
				
				knowledgereadandedit.arrSmartFaqs.push(FAQObject);
		   }
		   $("#page_knowledgereadandedit #knowledgeReadEditAddMoreFAQModal .faq-search-container input").val('');
		   
		   var conatiner = '#page_knowledgereadandedit #knowledgeReadEditAddMoreFAQModal #FAQResultListContainer'
			knowledgereadandedit.renderNormalView("", "", "", FAQObject.question, 0, conatiner, (knowledgereadandedit.arrSmartFaqs.length - 1));					
				
		   
          }
          else
          {
           alert('Please enter question text.');
           return false;
          }
	    });
		
	    $("#page_knowledgereadandedit #addURLBtn").on('click', function(){
		   var txt_val = $("#page_knowledgereadandedit #addURLsModalContainer .url-search-container input").val();
           var txt_display = $("#page_knowledgereadandedit #addURLsModalContainer .url-search-container #txtDisplay").val();
           if(txt_display!="")
           {
		   if(txt_val.length > 0){
				knowledgereadandedit.urlInc += knowledgereadandedit.urlInc
				var urlObject = {};
				urlObject.assetType = "Url";
				urlObject.assetName = txt_val;
                urlObject.heading = txt_display;

                if(txt_val.length > 100 )
				 urlObject.content = txt_val.substr(0, 99)+".....";
                else
                 urlObject.content = txt_val;

				urlObject.fileSize = 0;
				
				knowledgereadandedit.arrUrls.push(urlObject);
		
				var conatiner = '#page_knowledgereadandedit #addURLsModalContainer #urlResultListContainer'
				knowledgereadandedit.renderNormalView(urlObject.assetType, urlObject.assetName, urlObject.heading, urlObject.content, urlObject.fileSize, conatiner, (knowledgereadandedit.arrUrls.length - 1));					
		   }
		   $("#page_knowledgereadandedit #addURLsModalContainer .url-search-container input").val('');
          }
          else
          {
           alert('Please enter display text.');
           return false;
          }
	    });
	   
	    $("#page_knowledgereadandedit #knowledgeAssetsContainer .glyphicon-remove").live("click", function(e){
			if($(e.target).attr("element-type") == "File")
			{
				eleIndex = $(e.target).attr("index");
				$(e.target).parent().parent().remove();
				knowledgereadandedit.arrKnowledgeAssets.splice(eleIndex, 1);

				if (knowledgereadandedit.arrPreviousAssets[eleIndex] !== undefined)
					knowledgereadandedit.arrPreviousAssets.splice(eleIndex, 1);				
			}
			else
			{
				eleIndex = $(e.target).attr("index");
				$(e.target).parent().remove();
				
				objAsset = knowledgereadandedit.arrKnowledgeAssets[eleIndex];
				
				if (objAsset.assetType === "Graph")
				{
				var objGraph = new Object();
					objGraph._id = objAsset.heading;
					objGraph.title = objAsset.heading;
					objGraph.defaultURL = objAsset.assetName;
					objGraph.graphType = objAsset.graphType;
				objGraph.filter = "";
				objGraph._index = ".kibana-4"
				
					if (objAsset.graphType === "Visualization")
				{
					knowledgereadandedit.arrTotalVisualizations.push(objGraph);
					knowledgereadandedit.removeSelectedRecordFromArray(objGraph._id, knowledgereadandedit.arrSelectedVisualization)
				}
				else
				{
					knowledgereadandedit.arrTotalDashboard.push(objGraph);
					knowledgereadandedit.removeSelectedRecordFromArray(objGraph._id, knowledgereadandedit.arrSelectedDashboard)
				}
				}
				
				knowledgereadandedit.arrKnowledgeAssets.splice(eleIndex, 1);				

				if (knowledgereadandedit.arrPreviousAssets[eleIndex] !== undefined)
					knowledgereadandedit.arrPreviousAssets.splice(eleIndex, 1);	
            }
			console.log(knowledgereadandedit.arrKnowledgeAssets);			
			knowledgereadandedit.initRenderKnowledgeAssetsList(false);
        });
				
	$("#page_knowledgereadandedit #knowledgeReadEditAddMoreFAQModal #FAQResultListContainer .list-element .glyphicon-remove").live("click", function(e){
               eleIndex = $(e.target).parent().index();
               $(e.target).parent().remove();
               knowledgereadandedit.arrSmartFaqs.splice(eleIndex, 1);
               console.log(knowledgereadandedit.arrSmartFaqs);
        
        });

        $("#page_knowledgereadandedit #addURLsModalContainer #urlResultListContainer .list-element .glyphicon-remove").live("click", function(e){
            if($(e.target).attr("element-type") == "Url"){
               eleIndex = $(e.target).parent().index();
               $(e.target).parent().remove();
               knowledgereadandedit.arrUrls.splice(eleIndex, 1);
               console.log(knowledgereadandedit.arrUrls);
            }
        });
					
		$("#page_knowledgereadandedit #addVisualizationBtn").live('click', function(e){
			knowledgereadandedit.readyToLoadData = false;
			knowledgereadandedit._RemoveCustomEventsForTable();
			knowledgereadandedit.showMediaListToSelect('Visualization');			
			knowledgereadandedit._AddCustomEventsForTable();
             // display div for stability & Hot Spot
            knowledgereadandedit.ShowHideStability('Visualization');
			setTimeout(knowledgereadandedit._loadDataToTable, 500);	
		});
		
		$("#page_knowledgereadandedit #addDashboardBtn").live('click', function(e){
			knowledgereadandedit.readyToLoadData = false;
			knowledgereadandedit._RemoveCustomEventsForTable();
			knowledgereadandedit.showMediaListToSelect('Dashboard');						
			knowledgereadandedit._AddCustomEventsForTable();
            // display div for stability & Hot Spot
            knowledgereadandedit.ShowHideStability('Dashboard');

			setTimeout(knowledgereadandedit._loadDataToTable, 500);	
		});
		 
		$(".submit-button").on('click',function(e){			
			if (parseInt(knowledgereadandedit.userStarRatingNumber) > 0)
			{
			$("#comment_wrapper>div,.current-user-comment-wrapper>div").empty();	
			var commentsObject = new Object();
			commentsObject.userName = knowledgereadandedit.currentUser;
			commentsObject.dataAndTime = new Date().getDate()+" "+knowledgereadandedit._getCurrentMonth()+" "+new Date().getFullYear()+" "+ new Date().toLocaleTimeString(); 
			commentsObject.userRating = knowledgereadandedit.userStarRatingNumber;
			commentsObject.description = $("textarea.description-container").val();
			
			var index = knowledgereadandedit._getUserIndex(commentsObject.userName);
			if (index === -1)
				knowledgereadandedit.arrComments.push(commentsObject);
			else
				knowledgereadandedit.arrComments[index] = commentsObject;
						
			knowledgereadandedit._populateCommentsData(false);
			knowledgereadandedit._generateRatingData(false);
			knowledgereadandedit._plotRating();
			
			$("#knowledgeReadandEditModal").modal('hide');
			
			if (!knowledgereadandedit.enableEdit)
				knowledgereadandedit._saveKnowledgeDetails();
			}						
		});
		$(".close-button").click(function(){
			$("#knowledgeReadandEditModal").modal('hide');
		});
		
		$('#page_knowledgereadandedit #addVisualizationModalContainer .visualization-search-container .add-docs-btn').click( function () {
			
			$('#page_knowledgereadandedit #addVisualizationModalContainer #'+knowledgereadandedit.knwldgAddCompTable+' .checkboxes:checked').each(function() {  
				var selId = $(this).attr('document-id');
				var defaultURL = $(this).attr('default-URL');
								
				 var __obj = new Object();
				__obj.details = knowledgereadandedit.leftTableTableComponentRef._getDocDetails(selId);				
				
				if (knowledgereadandedit.popupInvoker === "Visualization")
				{	
					defaultURL = defaultURL.replace("<Visualization-Name>", __obj.details._id);	
					__obj.details.defaultURL = defaultURL;
				knowledgereadandedit.removeSelectedRecordFromArray(selId, knowledgereadandedit.arrTotalVisualizations);
				knowledgereadandedit.arrSelectedVisualization.push(__obj.details);
				}
				else
				{
					defaultURL = defaultURL.replace("<Dashboard-Name>", __obj.details._id);	
					__obj.details.defaultURL = defaultURL;					
					knowledgereadandedit.removeSelectedRecordFromArray(selId, knowledgereadandedit.arrTotalDashboard);
					knowledgereadandedit.arrSelectedDashboard.push(__obj.details);
				}
									
			});
			if(knowledgereadandedit.popupInvoker === "Visualization" && knowledgereadandedit.arrSelectedVisualization.length <=0)  
			{  
				alert("Please select at least one visualization to add.");  
			}
			else if (knowledgereadandedit.popupInvoker === "Dashboard" && knowledgereadandedit.arrSelectedDashboard.length <=0)
			{
				alert("Please select at least one dashboard to add.");  
			}
			else
			{				
				if (knowledgereadandedit.popupInvoker === "Visualization")
				{
				tablerigtcomponent._receivedSearchResults(knowledgereadandedit.arrSelectedVisualization);
					console.log("stored values are : "+JSON.stringify(knowledgereadandedit.arrSelectedVisualization));				
				}				
				else
				{
					tablerigtcomponent._receivedSearchResults(knowledgereadandedit.arrSelectedDashboard);
					console.log("stored values are : "+JSON.stringify(knowledgereadandedit.arrSelectedDashboard));				
				}
				
				// Removing selection of the rows after added to the package				
				 $('#page_knowledgereadandedit #addVisualizationModalContainer #'+knowledgereadandedit.knwldgAddCompTable+' .checkboxes:checked').each(function() { 
					var $row = $(this).closest('tr');
					 
					var oTable = $('#page_knowledgereadandedit #addVisualizationModalContainer #'+knowledgereadandedit.knwldgAddCompTable).dataTable();						
					var currectSelectedTabel = oTable.DataTable();	
					currectSelectedTabel.row($row[0]._DT_RowIndex).remove().draw( false );
					
					$(this).attr('checked', false);
					$(this).closest("span").removeAttr("class");
				});
				
			}
		} );


           // Adding tag from title and descriptions

          $("#page_knowledgereadandedit .action-edit-view-container #knowledge_title").on("change paste blur", function() {
			 console.log(this.value);
			 var tag ="";
             tag = this.value.match(/#\w+/g);	
             if(tag)
             {
             if(tag.length>0)
             {
              for(var i=0; i<tag.length;i++)
              {
               var str = tag[i].replace("#","");
               knowledgereadandedit._addTextTags(str, 'inline-block');
              }
             }
             }
			  knowledgereadandedit.HideSuggestions();
		  });

            $('#page_knowledgereadandedit #knowledge_new_edit_description').on('summernote.blur', function(we, e) {
              console.log('Key is released:', e.keyCode);               
                var tag ="";
                 tag = $('#page_knowledgereadandedit #knowledge_new_edit_description').summernote('code').trim().match(/#\w+/g);	
                 if(tag)
                 {
                 if(tag.length>0)
                 {
                  for(var i=0; i<tag.length;i++)
                  {
                   var tagstr= tag[i];
                   if(tagstr.includes("#"))
                   {
                     var str = tag[i].replace("#","");
                     knowledgereadandedit._addTextTags(str, 'inline-block');
                   }
                  }
                 }
                }
            });

         // End of 


		$('#page_knowledgereadandedit #addVisualizationModalContainer .visualization-seleted-container .remove-docs-btn').click( function () {
			
			var allDeleteDocs = [];
			$('#page_knowledgereadandedit #addVisualizationModalContainer #'+knowledgereadandedit.knwldgAddCompRightTable+' .checkboxes:checked').each(function() {  
				 var __obj = new Object();
				 __obj.value = $(this).attr('value');
				 __obj.selId = $(this).attr('document-id');
				 __obj.details = tablerigtcomponent._getDocDetails(__obj.selId);
				allDeleteDocs.push(__obj);
			});
			if(allDeleteDocs.length <=0)  
			{  
				alert("Please select at least one visualization to delete.");  
			}
			else if (knowledgereadandedit.popupInvoker === "Dashboard" && allDeleteDocs.length <=0)
			{
				alert("Please select at least one dashboard to delete.");  
			}
			else
				{
					//for client side
					  $.each(allDeleteDocs, function( index, value ) {
						  var $rowData = $('#page_knowledgereadandedit #addVisualizationModalContainer #'+knowledgereadandedit.knwldgAddCompRightTable+' tr').filter("[data-row-id='" + value.value + "']")
						  tablerigtcomponent.tablecomponents_table.row($rowData).remove().draw( false );
					if (value.details.filter)
					{
						value.details.filter = "";
					}
					if (knowledgereadandedit.popupInvoker === "Visualization")
					{						
						knowledgereadandedit.arrTotalVisualizations.push(value.details);
						knowledgereadandedit.removeSelectedRecordFromArray(value.selId, knowledgereadandedit.arrSelectedVisualization);
						knowledgereadandedit.removeSelectedRecordFromArray(value.selId, knowledgereadandedit.arrKnowledgeAssets, 'heading');
					}
					else
					{
						knowledgereadandedit.arrTotalDashboard.push(value.details);
						knowledgereadandedit.removeSelectedRecordFromArray(value.selId, knowledgereadandedit.arrSelectedDashboard);												
					}										
					  });
					 
				if (knowledgereadandedit.popupInvoker === "Visualization")
				{					
					knowledgereadandedit.leftTableTableComponentRef._receivedSearchResults(knowledgereadandedit.arrTotalVisualizations);  
					console.log("deleted values are : "+JSON.stringify(knowledgereadandedit.arrSelectedVisualization));
				}
				else
				{
					knowledgereadandedit.leftTableTableComponentRef._receivedSearchResults(knowledgereadandedit.arrTotalDashboard);  
					console.log("deleted values are : "+JSON.stringify(knowledgereadandedit.arrSelectedDashboard));
				}								
			}
		} );
		
		$("#page_knowledgereadandedit .top-save-cancel-btn-grp .close-doc-view, #page_knowledgereadandedit .bottom-ctrl-container .close-doc-view").live("click", function(e){
			if(knowledgereadandedit.sKnowledge)
				$(location).attr('hash',knowledgereadandedit.sKnowledge.current_page_name);
			else
				 window.history.back();
		});
		$("#page_knowledgereadandedit .save-knowledge-doc, #page_knowledgereadandedit .bottom-ctrl-container .save-knowledge-doc").live("click", function(e){
			knowledgereadandedit._saveKnowledgeDetails();
		});
		
		$("#page_knowledgereadandedit .cancel-knowledge-doc, #page_knowledgereadandedit .bottom-ctrl-container .cancel-knowledge-doc").live("click", function(e){
			
			$("#page_knowledgereadandedit #confirmationSaveChanges").modal('show');
		});
		
	 	$("#page_knowledgereadandedit #confirmationSaveChanges .save-doc-popup-btn, #page_knowledgereadandedit #confirmationSaveChanges .donot-save-doc-popup-btn").live("click", function(e){
			if(knowledgereadandedit.sKnowledge)
				$(location).attr('hash',knowledgereadandedit.sKnowledge.current_page_name);
			else
				 window.history.back();
			 
			if($(this).hasClass('save-doc-popup-btn'))
				$("#page_knowledgereadandedit .save-knowledge-doc").trigger('click');
		});
		
		 $("#page_knowledgereadandedit #contentFullScreenBtn").click(function(event) {
			knowledgereadandedit.onWindowFullScreen();
		});

		
		$('#addVisualizationModalContainer #searchContainer #searchLocalDoc').on ('keyup', knowledgereadandedit._filterInternal);		 
		 knowledgereadandedit.onLoadActionComponent();		
		knowledgereadandedit.readKnowledgeStoredData();		
    },
	
	_getSearchString:function(pSearchTerm) {
		var rawSearchString = pSearchTerm.replace(/[a-zA-Z0-9\?\&\=\%\#]+s\=(\w+)(\&.*)?/,"$1");
		return rawSearchString;
	},
	
	_highlightTextNodes:function(regex) {
		var tempinnerHTML = knowledgereadandedit.strDocText;
		return tempinnerHTML.replace(regex,'>$1<span style="background-color: Yellow;font-weight: bold;" class="HighlightText" id="HighlightText">$2</span>$3<');
	},
	
      ShowHideStability : function(lightboxname)
        {
         if(lightboxname == "Dashboard")
         {
           var result =  $.grep(knowledgereadandedit.arrKnowledgeAssets, function(e){ return e.graphType == "stability"});

            if(result.length > 0)                                                	
	        {
             $("#Stability").prop("checked", true);
            }
            else
            {
             $("#Stability").prop("checked", false);
            }
 
           var result1 =  $.grep(knowledgereadandedit.arrKnowledgeAssets, function(e){ return e.graphType == "hotspot"});
             if(result1.length>0)                                                	
	        {
             $("#HotSpot").prop("checked", true);
            }
            else
            {
             $("#HotSpot").prop("checked", false);
            }	                     
            $("#divStability").show();          
         }
         else
         {
               $("#divStability").hide();
         }
        },

        _ReadStabilityHotSpot : function()
        {
        $('#dvStabilitycontent').empty();
        $('#dvHostspotcontent').empty();

          $.getJSON("json/stabilityHotspotData.json?"+Date.now(), function(data)
          {
             if(data.TableDetails.Stability)
             {
                $('#dvStabilitycontent').append('<input type="checkbox" id=' + data.TableDetails.Stability.displayName + ' class="checkboxes"  title =' + data.TableDetails.Stability.description + '/>' + data.TableDetails.Stability.displayName);
                knowledgereadandedit.defaultURLStability = "http://"+iseConstants.serverHost+":"+window.location.port + data.TableDetails.Stability.defaultURL;
             }
             if(data.TableDetails.HotSpot)
             {
               $('#dvHostspotcontent').append('<input type="checkbox" id=' + data.TableDetails.HotSpot.displayName + ' class="checkboxes"  title =' + data.TableDetails.HotSpot.description + '/>' + data.TableDetails.HotSpot.displayName);
               knowledgereadandedit.defaultURLHotspot = "http://"+iseConstants.serverHost+":"+window.location.port + data.TableDetails.HotSpot.defaultURL;
             }               
          });
        }, 
	
	_getKnowledgeAccessLevel: function()
	{
		if (knowledgereadandedit.sKnowledge)
		{
			if (knowledgereadandedit.sKnowledge.doc_type == "knowledgeEdit" && (knowledgereadandedit.sKnowledge.doc_details.user === knowledgereadandedit.currentUser
					|| knowledgereadandedit.sKnowledge.doc_details.Reviewer_Name === knowledgereadandedit.currentUser
					|| knowledgereadandedit.userRole.toLowerCase() === "admin"))
			{
				$('#page_knowledgereadandedit').unbind('cut copy');
				$("#page_knowledgereadandedit").off("contextmenu");
				return true;
			}			
			else 
			{
				$(document).ready(function () {
                       //Disable contl+A
                        var isCtrl=false;
                        document.onkeydown=function(e)
                        {
                        if(e.which == 17)
                        isCtrl=true;
                        if(((e.which == 65)) && isCtrl == true)
                        {
                         return false;
                        }
                        }

					//Disable cut copy paste
					$('#page_knowledgereadandedit').bind('cut copy', function (e) {
						alert("Copying of content is not available.");
						e.preventDefault();
						e.stopImmediatePropagation();		
					});
				   
					//Disable mouse right click
					$("#page_knowledgereadandedit").on("contextmenu",function(e){
						alert("Right click is disabled.");
						e.stopImmediatePropagation();
						return false;										
					});
				});
				return false;
			}			
		}
		else
		{
			$('#page_knowledgereadandedit').unbind('cut copy paste');
			$("#page_knowledgereadandedit").off("contextmenu");
		}
	},

    _advanceSearchFunc: function(searchText) 
	{
       			knowledgereadandedit.isNewSearchTerm = false;
			knowledgereadandedit.searchObj.type = "advanced";
			knowledgereadandedit.searchObj.input = searchText;
			knowledgereadandedit.searchObj.input2 = searchText;
			knowledgereadandedit._processSearchRequest();
	},
	
	_processSearchRequest: function()
	{
		knowledgereadandedit.searchObj.lastSearch = Date.now();
		
		if (knowledgereadandedit.searchObj.type == 'advanced') 
		{
                var requestObject = new Object();
                requestObject.title = knowledgereadandedit.searchObj.input.replace(/\//g, " ");
                requestObject.searchString ="title:"+knowledgereadandedit.searchObj.input2.replace(/\//g, " ");
                requestObject.filterString = '';
                requestObject.maxResults = 10;
			    requestObject.isAnalyzerRequired = true;
                requestObject.serachType = "";
                requestObject.collectionName = iseConstants.str_docs_collection; 
                requestObject.filterString = '';
                ISE.getSearchResults(requestObject, knowledgereadandedit._receivedSearchResultsKeydown);
               
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
              faq_content = '<h2 class="panel-title">'+ "Knowledge found with same title :" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a onClick="knowledgereadandedit.HideSuggestions()"  class="faq-heading-title"> '+ "Hide"+'</a></h2>';
              //faq_content += '<h4 class="panel-title"><a class="faq-heading-title"> '+ "Hide"+'</a></h4>'
             }
			//faq_content += '<h4 class="panel-title"><i class="fa fa-circle"></i><a class="faq-heading-title"> '+ data[i]["title"]+'</a></h4>'
            faq_content += '<h3 class="panel-title"><i class="fa fa-circle"></i>'+ data[i]["title"]+'</h3>'
		}
            

     }
    
     $('#results').append(faq_content);	
    },
    HideSuggestions : function()
    {
       $('#results').empty();
       $('#results').hide();
    },

	_AddCustomEventsForActions: function(){
		$( '#page_knowledgereadandedit' ).on( ikeEventsConstants.ADD_NEW_KNOWLEDGE_DOCUMENT, {
			 
		}, function( event,curr_page ) {
			if(curr_page == ikePageConstants.KNOWLEDGE_READ_AND_EDIT ){
				console.log( "Called New Doc event" );
				knowledgereadandedit.readKnowledgeStoredData("From Custom Event");
			}
			//$( '#page_knowledgereadandedit' ).off(ikeEventsConstants.ADD_NEW_KNOWLEDGE_DOCUMENT);
			});
	},
	

	_setURLvalues:function(showMessage)
	{
	//debugger;
	var temp = new Array();
	// this will return an array with strings "1", "2", etc.
	temp = window.location.hash.split("#");
	
	var subpage = temp[temp.length -1];
	
		if (subpage == 'knowledgereadandedit') 
			{
                var p = knowledgereadandedit._getParams(window.location.search);
                if(p.gQuery != null) {                    
                    var title = decodeURIComponent(p.gQuery);
                    
					$("#page_knowledgereadandedit .action-edit-view-container #knowledge_title").val(title);
					
					if(p.description!= undefined && p.description != null)
					{
						var descp = p.description;
						for (var i = 1; i < temp.length - 1; i++)
							descp = descp + temp[i];
						var desc = decodeURIComponent(descp);
						$('#page_knowledgereadandedit #knowledge_new_edit_description').summernote('code',desc);
					}
					
					if(p.urlname != null)
					{
						var urlname = decodeURIComponent(p.urlname);
						
						var urlObject = {};
						urlObject.assetType = "Url";
						urlObject.assetName = urlname;
						urlObject.heading = title;				
						urlObject.content = urlname;
						urlObject.fileSize = 0;
				
						knowledgereadandedit.arrKnowledgeAssets.push(urlObject);
						
						knowledgereadandedit.initRenderKnowledgeAssetsList(false);
					}
				
					if(p.docpath!=undefined && p.docpath!= null)
					{
						if(showMessage)
						{
							alert("Your attachment files have been copied at the location : " + decodeURIComponent(p.docpath));
						}
						
					}
					return "newMode";
					}
				else //For accessing URL directly with ID
				{
					if (p.doc_id)
					{
						knowledgereadandedit.sKnowledge = new Object();
						knowledgereadandedit.sKnowledge.doc_id = decodeURIComponent(p.doc_id);					
					if (p.source && p.source === "mailbox")
					{
						knowledgereadandedit.sKnowledge.doc_type = 'knowledgeEdit';
					}
					else
					{
						knowledgereadandedit.sKnowledge.doc_type = 'knowledgeView';
					}	
					}
					else
					{
						return "newMode";
					}
					return "viewMode";
			    }
			}		
	},

	  _getParams: function _getParams(url) {
                         
            
            url = url.replace("&amp;", "")
            url = url.replace("&quot;","")
            url = url.replace("&nbsp;","")
            url = url.replace("&#39;","")
            url = url.replace("&lt;","")
            url = url.replace("&gt;","");

           // var str = url;
           // var div = document.createElement('div');
           // div.innerHTML = str
           // url = div.firstChild.nodeValue;




            var regex = /[?&]([^=#]+)=([^&#]*)/g,
                params = {},
                match;
            while (match = regex.exec(url)) {
                params[match[1]] = match[2];
            }
            return params;
        },
	_AddCustomEventsForTable: function(){
		//Custom Event Handlers
		$( '#addVisualizationModalContainer' ).on( ikeEventsConstants.ROW_SELECTED,{
		}, function( event, selectedRows ) {
		});
		$( '#addVisualizationModalContainer' ).on( ikeEventsConstants.COMPLETED_FILL_TABLE_AND_COLUMN_FILTER,{
			 
			}, function( event ) {
			 
			knowledgereadandedit.readyToLoadData = true;			
		}); 
	},
	   
	_loadDataToTable:function()
	{
		if (knowledgereadandedit.readyToLoadData)
		{
			if (knowledgereadandedit.popupInvoker === "Visualization")
			{
			knowledgereadandedit.leftTableTableComponentRef._receivedSearchResults(knowledgereadandedit.arrTotalVisualizations);			
				tablerigtcomponent._receivedSearchResults(knowledgereadandedit.arrSelectedVisualization);
			}
			else
			{
				knowledgereadandedit.leftTableTableComponentRef._receivedSearchResults(knowledgereadandedit.arrTotalDashboard);
				tablerigtcomponent._receivedSearchResults(knowledgereadandedit.arrSelectedDashboard);
			}
		}
		else
		{
			setTimeout(knowledgereadandedit._loadDataToTable, 500);
		}
	},
	
	_RemoveCustomEventsForTable: function(){
		//Custom Event Handlers
	    $( '#addVisualizationModalContainer' ).off( ikeEventsConstants.ROW_SELECTED );
		$( '#addVisualizationModalContainer' ).off( ikeEventsConstants.COMPLETED_FILL_TABLE_AND_COLUMN_FILTER );		 
	},
	
	removeSelectedRecordFromArray: function(docID, _array, _array_id_name){
		for(var i=0; i<_array.length; i++){
		var id_name = _array_id_name ? _array_id_name : '_id';
		  if(docID == _array[i][id_name]){
			  _array.splice(i, 1);
			  break;
		  }
	  }
	},
	removeTagFromStoredArray:function(removed_val, _array){
		for(var i=0; i<_array.length; i++){
		  if(removed_val == _array[i]){
			  _array.splice(i, 1);
			  break;
		  }
	  }
	},
	
	showMediaListToSelect: function(name_val){
				
		knowledgereadandedit.popupInvoker = name_val;
		knowledgereadandedit.onLoadLeftTableComponent(name_val);
		knowledgereadandedit.onLoadRightTableComponent(name_val);		
		
		$("#page_knowledgereadandedit #addVisualizationModalContainer .modal-header .modal-title").text('Add '+name_val);
		$("#page_knowledgereadandedit #addVisualizationModalContainer .modal-footer .add-visulation-dashboard-btn").text('ADD '+name_val);
		$("#page_knowledgereadandedit #addVisualizationPreviewModalContainer .modal-header .modal-title").text(name_val+' Preview');
		$("#page_knowledgereadandedit #addVisualizationModalContainer").modal('show');
		
		
	},
	
	_filterInternal: function () {
			var oTable = $('#page_knowledgereadandedit #addVisualizationModalContainer #'+knowledgereadandedit.knwldgAddCompTable).dataTable();
			var currectSelectedTabel = oTable.DataTable();
			currectSelectedTabel.search(
				$('#addVisualizationModalContainer #searchContainer #searchLocalDoc').val(),
				false,
				true
			).draw();
	},
	
	_addLiveKnowledgeFilterHandler: function()
	{	
		$("#addVisualizationFilterModalContainer").modal('hide');
	
		var _id = $('#page_knowledgereadandedit #addVisualizationFilterModalContainer .visualization-name').text().trim();
		
		var filter = $('#page_knowledgereadandedit #addVisualizationFilterModalContainer #txtVisualizationFilter').val().toString().trim();
						
		if (filter && filter.length > 0)
		{
			if (filter !== "*")
			{	
				filter = filter.startsWith("(") ? filter : "(" + filter;
				filter = filter.endsWith(")") ? filter : filter + ")";
			}	
			
			if (knowledgereadandedit.popupInvoker === "Visualization")
			{
				var index = knowledgereadandedit._getIndex(knowledgereadandedit.arrSelectedVisualization, _id)

			var selectedVis = knowledgereadandedit.arrSelectedVisualization[index];
			
			selectedVis.filter = filter;
        
			knowledgereadandedit.arrSelectedVisualization[index] = selectedVis;
			
			tablerigtcomponent._receivedSearchResults(knowledgereadandedit.arrSelectedVisualization);
		}		
			else
			{
				var index = knowledgereadandedit._getIndex(knowledgereadandedit.arrSelectedDashboard, _id)

				var selectedVis = knowledgereadandedit.arrSelectedDashboard[index];
				
				selectedVis.filter = filter;
			
				knowledgereadandedit.arrSelectedDashboard[index] = selectedVis;
				
				tablerigtcomponent._receivedSearchResults(knowledgereadandedit.arrSelectedDashboard);
			}
		}		
	},

	readKnowledgeStoredData: function(){
		knowledgereadandedit.sKnowledge = {};
		knowledgereadandedit.sKnowledge = JSON.parse(localStorage.getItem('selectedKnowledgeEditDoc'));
		if(knowledgereadandedit.sKnowledge && knowledgereadandedit.sKnowledge.doc_type == 'knowledgeEdit'){
			knowledgereadandedit._getDocDetails(knowledgereadandedit.sKnowledge.doc_id);
			return;
		}
		knowledgereadandedit.sKnowledge = JSON.parse(localStorage.getItem('selectedKnowledgeViewDoc'));
		if(knowledgereadandedit.sKnowledge && knowledgereadandedit.sKnowledge.doc_type == 'knowledgeView'){
			knowledgereadandedit._getDocDetails(knowledgereadandedit.sKnowledge.doc_id);
			return;
		}
		
		if(knowledgereadandedit.sKnowledge == null){
			knowledgereadandedit._getKnowledgeAccessLevel();
			var retVal = knowledgereadandedit._setURLvalues(false);
			if (retVal === "newMode")
			        knowledgereadandedit.editFormControlers(false, 'new');
			else if (retVal === "viewMode" && knowledgereadandedit.sKnowledge.doc_id && knowledgereadandedit.sKnowledge.doc_id !== "")
				knowledgereadandedit._getDocDetails(knowledgereadandedit.sKnowledge.doc_id);				
			retVal = knowledgereadandedit._setURLvalues(true);
			return;
		}
	},
	
	editFormControlers: function(val, type, data){
		$("#page_knowledgereadandedit #knowledgeDescription").empty();		
		$("#page_knowledgereadandedit .action-edit-view-container .streamsContainer").empty();
		$("#page_knowledgereadandedit #filterTagsHolder").empty();
		$("#page_knowledgereadandedit #reviewerComments").empty();
		$("#comment_wrapper>div,.current-user-comment-wrapper>div").empty();		
		$("#page_knowledgereadandedit .current-user-comment-wrapper>div").hide();
		
		$('#page_knowledgereadandedit #chksmartfaq').prop('checked', false);
		$('#page_knowledgereadandedit #btnAddMoreFaq').hide();
		knowledgereadandedit.resetFileURLMediaConatainer();
		knowledgereadandedit._resetDocDetails();
		knowledgereadandedit._createKnowledgeId(false);
		
		if(knowledgereadandedit.sKnowledge && knowledgereadandedit.sKnowledge.doc_details["OCRTEXT"]==undefined) 
		{
			$("#metadatacontainer4").hide();			
		}
		else 
		{
			$("#metadatacontainer4").show();
		}
						
		if(val && type =='edit'){			
			$("#page_knowledgereadandedit .action-edit-view-container #knowledge_title").val(knowledgereadandedit.sKnowledge.doc_details["title"]).prop("readonly", true);
			$("#page_knowledgereadandedit .page-title").text(knowledgereadandedit.sKnowledge.doc_details["title"]);
			$("#page_knowledgereadandedit .action-edit-view-container #OCRContainer").text(knowledgereadandedit.sKnowledge.doc_details["OCRTEXT"]);
			$("#page_knowledgereadandedit #divTitle").hide();
			$("#page_knowledgereadandedit #labelDescription").hide();
			knowledgereadandedit.initRenderDefaultValues();
			knowledgereadandedit.disableSummernote();
			knowledgereadandedit.handleImages();
			knowledgereadandedit.getKibanaData("visualization");
			knowledgereadandedit.getKibanaData("dashboard");
			$("#page_knowledgereadandedit .edit-knowledge-btn").show();
			$("#page_knowledgereadandedit .action-edit-view-container #addAssetsCoantainer, #page_knowledgereadandedit .action-edit-view-container #addTagsContainer, #page_knowledgereadandedit .bottom-ctrl-container .bottom-save-cancel-btn-grp, #page_knowledgereadandedit .save-cancel-btn-grp, #page_knowledgereadandedit #knowledgeAssetsContainer .glyphicon.glyphicon-remove").hide();
			$("#page_knowledgereadandedit .portlet-title").show();
			$("#page_knowledgereadandedit .bottom-ctrl-container .close-doc-view").show();
			$("#page_knowledgereadandedit .accordion-history-comments").show();
			$('#page_knowledgereadandedit #reviewerCommentsHeading').show();			
			$("#page_knowledgereadandedit .action-edit-view-container #ReviewerChkbox").show();									
			$('#page_knowledgereadandedit #chksmartfaq').prop('checked', knowledgereadandedit.sKnowledge.doc_details["isFaq"]);	
			
			knowledgereadandedit.renderFAQList();					
                        if (iseConstants.multilingual)
			{
				$('#page_knowledgereadandedit .action-edit-view-container #HMultilingual').show();
				$('#page_knowledgereadandedit .action-edit-view-container #chkMultiLingual').show();
				$('#page_knowledgereadandedit .action-edit-view-container #chkMultiLingual').prop('checked', false);				
			}
			else
			{
				$('#page_knowledgereadandedit .action-edit-view-container #HMultilingual').hide();
				$('#page_knowledgereadandedit .action-edit-view-container #chkMultiLingual').hide();
				$('#page_knowledgereadandedit .action-edit-view-container #uniform-chkMultiLingual').hide();
			}
		}
		else if(val && type =='view'){
			$("#page_knowledgereadandedit .action-edit-view-container #knowledge_title").val(knowledgereadandedit.sKnowledge.doc_details["title"]).prop("readonly", true);
			$("#page_knowledgereadandedit .action-edit-view-container #OCRContainer").text(knowledgereadandedit.sKnowledge.doc_details["OCRTEXT"]);
			$("#page_knowledgereadandedit .page-title").text(knowledgereadandedit.sKnowledge.doc_details["title"]);
			$("#page_knowledgereadandedit #divTitle").hide();
			$("#page_knowledgereadandedit #labelDescription").hide();
			knowledgereadandedit.initRenderDefaultValues();
			knowledgereadandedit.disableSummernote();
			$("#page_knowledgereadandedit .edit-knowledge-btn").hide();
			$("#page_knowledgereadandedit .portlet-title").show();
			$("#page_knowledgereadandedit .bottom-ctrl-container .close-doc-view").show();
			$("#page_knowledgereadandedit .action-edit-view-container #addAssetsCoantainer, #page_knowledgereadandedit .action-edit-view-container #addTagsContainer, #page_knowledgereadandedit .bottom-ctrl-container .bottom-save-cancel-btn-grp, #page_knowledgereadandedit .save-cancel-btn-grp, #page_knowledgereadandedit #knowledgeAssetsContainer .glyphicon.glyphicon-remove").hide();
			$("#page_knowledgereadandedit .accordion-history-comments").show();
			$('#page_knowledgereadandedit #reviewerCommentsHeading').show();
			$("#page_knowledgereadandedit .edit-knowledge-btn").hide();			
			$("#page_knowledgereadandedit .action-edit-view-container #ReviewerChkbox").show();						
			$('#page_knowledgereadandedit #chksmartfaq').prop('checked', knowledgereadandedit.sKnowledge.doc_details["isFaq"]);			
			knowledgereadandedit.renderFAQList();
           	}
                else if(!val && type =='new'){
			$("#metadatacontainer4").hide();
			$("#page_knowledgereadandedit .action-edit-view-container #knowledge_title").val('').prop("readonly", false);
			$("#page_knowledgereadandedit .action-edit-view-container #knowledgeDescription").hide();
			$("#page_knowledgereadandedit .action-edit-view-container #OCRContainer").text('');
			$("#page_knowledgereadandedit .page-title").text('New Knowledge');
			$("#page_knowledgereadandedit #divTitle").show();
			$("#page_knowledgereadandedit #labelDescription").show();									
			knowledgereadandedit.renderFAQList();			
			knowledgereadandedit.initSummernote();			
			knowledgereadandedit._initReviewerData();			
			knowledgereadandedit._plotControls();	
			$("#page_knowledgereadandedit .action-edit-view-container #ReviewerChkbox").hide();
			knowledgereadandedit._initSecurityData();
			knowledgereadandedit.handleImages();
			knowledgereadandedit.getKibanaData("visualization");
			knowledgereadandedit.getKibanaData("dashboard");			
			$("#page_knowledgereadandedit .edit-knowledge-btn").hide();
			$("#page_knowledgereadandedit .portlet-title").show();
			$("#page_knowledgereadandedit .accordion-history-comments").hide();
			$("#page_knowledgereadandedit .action-edit-view-container #addAssetsCoantainer, #page_knowledgereadandedit .action-edit-view-container #addTagsContainer,#page_knowledgereadandedit .save-cancel-btn-grp, #page_knowledgereadandedit .bottom-ctrl-container .bottom-save-cancel-btn-grp").show();			
			$("#page_knowledgereadandedit .bottom-ctrl-container .close-doc-view").hide();
			$('#page_knowledgereadandedit #knowledge_reviewer_comments').summernote('destroy');
			$('#page_knowledgereadandedit .action-edit-view-container #reviewerCommentsHeading').hide();			
			if (iseConstants.multilingual)
			{
				$('#page_knowledgereadandedit .action-edit-view-container #HMultilingual').show();
				$('#page_knowledgereadandedit .action-edit-view-container #chkMultiLingual').show();
				$('#page_knowledgereadandedit .action-edit-view-container #chkMultiLingual').prop('checked', false);
			}
			else
			{
				$('#page_knowledgereadandedit .action-edit-view-container #HMultilingual').hide();
				$('#page_knowledgereadandedit .action-edit-view-container #chkMultiLingual').hide();
				$('#page_knowledgereadandedit .action-edit-view-container #uniform-chkMultiLingual').hide();
			}	
		}
		
		$('#page_knowledgereadandedit #knowledgeDescription a').on("click",function(){
                                                window.open(this.href);
                                                return false;
                        }) ;
	},
	
	_createKnowledgeId:function(pCreateNew)
	{
		if (!pCreateNew)
		{
			if (knowledgereadandedit.sKnowledge)
			{
				if (knowledgereadandedit.sKnowledge.doc_id)
				{
					knowledgereadandedit.documentId = knowledgereadandedit.sKnowledge.doc_id;
					return;
				}			
			}
		}
		
		knowledgereadandedit.documentId = (Math.floor( Math.random() * 1000 ) + Date.now()).toString();
		return;
	},
	
	initRenderDefaultValues: function(){
		knowledgereadandedit._initReviewerData();
		knowledgereadandedit._plotControls();
		knowledgereadandedit._initSecurityData();
		knowledgereadandedit.renderAddTags();
		knowledgereadandedit.initSummernote();
		knowledgereadandedit.initRenderKnowledgeAssetsList();		
		knowledgereadandedit._generateRatingData();
		knowledgereadandedit._plotRating();
		knowledgereadandedit._populateCommentsData();
	},
	
	_renderLiveKnowledge: function(knowledgeType, readFromStorage = true)
	{
		if (readFromStorage)
			var arrKnowledgeAssets = knowledgereadandedit.sKnowledge.doc_details["knowledgeAssets"];
			
		if (arrKnowledgeAssets && arrKnowledgeAssets.length > 0)				
		{
			for (var i = 0; i < arrKnowledgeAssets.length; i++)
			{
				if (arrKnowledgeAssets[i].assetType === "Graph" && arrKnowledgeAssets[i].graphType === knowledgeType)
				{
					var objGraph = new Object();
					objGraph._id = arrKnowledgeAssets[i].heading;
					objGraph.title = arrKnowledgeAssets[i].heading;
					objGraph.defaultURL = arrKnowledgeAssets[i].assetName;
					objGraph.graphType = arrKnowledgeAssets[i].graphType;
					objGraph.filter = arrKnowledgeAssets[i].content;
					objGraph._index = ".kibana-4"

					if (arrKnowledgeAssets[i].graphType === "Visualization")
						knowledgereadandedit.arrSelectedVisualization.push(objGraph);
					else
						knowledgereadandedit.arrSelectedDashboard.push(objGraph);
				}
			}						
		}
		
		if (knowledgeType === "Visualization")
		{
		if (knowledgereadandedit.arrSelectedVisualization && knowledgereadandedit.arrSelectedVisualization.length > 0)
		{
			for (var i = 0; i < knowledgereadandedit.arrSelectedVisualization.length; i++)
			{
					var index = knowledgereadandedit._getIndex(knowledgereadandedit.arrTotalVisualizations, knowledgereadandedit.arrSelectedVisualization[i]._id);
				
				if (index !== -1)
					knowledgereadandedit.arrTotalVisualizations.splice(index, 1);
			}
		}
		}
		else
		{
			if (knowledgereadandedit.arrSelectedDashboard && knowledgereadandedit.arrSelectedDashboard.length > 0)
			{
				for (var i = 0; i < knowledgereadandedit.arrSelectedDashboard.length; i++)
				{
					var index = knowledgereadandedit._getIndex(knowledgereadandedit.arrTotalDashboard, knowledgereadandedit.arrSelectedDashboard[i]._id);
		
					if (index !== -1)
						knowledgereadandedit.arrTotalDashboard.splice(index, 1);
				}
			}
		}		
	},
	
	_addLiveKnowledgeHandler:function()
	{
		$("#page_knowledgereadandedit #addVisualizationModalContainer").modal('hide');
		
		if (knowledgereadandedit.popupInvoker === "Visualization")
		{
			knowledgereadandedit._removeLiveKnowledgeAsset("Visualization");
			
		if (knowledgereadandedit.arrSelectedVisualization && knowledgereadandedit.arrSelectedVisualization.length > 0)
		{		
			for (var i = 0; i < knowledgereadandedit.arrSelectedVisualization.length; i++)
			{
				var objVisualization = {};
				objVisualization.assetType = "Graph";
				objVisualization.assetName = knowledgereadandedit.arrSelectedVisualization[i].defaultURL;
				objVisualization.graphType = "Visualization";
				objVisualization.heading = knowledgereadandedit.arrSelectedVisualization[i]._id;				
				objVisualization.content = knowledgereadandedit.arrSelectedVisualization[i].filter;
				objVisualization.fileSize = 0;
				
				var index = knowledgereadandedit._getAssetIndex(objVisualization);
				if(index != -1)                                                	
					knowledgereadandedit.arrKnowledgeAssets[index] = objVisualization;							
				else
					knowledgereadandedit.arrKnowledgeAssets.push(objVisualization); 
			}
			}
		}
		else
		{
			knowledgereadandedit._removeLiveKnowledgeAsset("Dashboard");
			
			if (knowledgereadandedit.arrSelectedDashboard && knowledgereadandedit.arrSelectedDashboard.length > 0)
			{		
				for (var i = 0; i < knowledgereadandedit.arrSelectedDashboard.length; i++)
				{
					var objDashboard = {};
					objDashboard.assetType = "Graph";
					objDashboard.assetName = knowledgereadandedit.arrSelectedDashboard[i].defaultURL;
					objDashboard.graphType = "Dashboard";
					objDashboard.heading = knowledgereadandedit.arrSelectedDashboard[i]._id;				
					objDashboard.content = knowledgereadandedit.arrSelectedDashboard[i].filter;
					objDashboard.fileSize = 0;
					
					var index = knowledgereadandedit._getAssetIndex(objDashboard);
					if(index != -1)                                                	
						knowledgereadandedit.arrKnowledgeAssets[index] = objDashboard;							
					else
						knowledgereadandedit.arrKnowledgeAssets.push(objDashboard); 
				}

               
			}

             // if stability & hot spot selected
                        


            if($('#page_knowledgereadandedit #Stability').is(":checked"))
            {

                 if(knowledgereadandedit.defaultURLStability!='')
                 {
                        var objDashboard = {};
					    objDashboard.assetType = "Graph";
					    objDashboard.assetName = knowledgereadandedit.defaultURLStability;
					    objDashboard.graphType = "stability";
					    objDashboard.heading = "stability";				
					    objDashboard.content = "*";
					    objDashboard.fileSize = 0;
					
					    var index = knowledgereadandedit._getAssetIndex(objDashboard);
					    if(index != -1)                                                	
						    knowledgereadandedit.arrKnowledgeAssets[index] = objDashboard;							
					    else
						    knowledgereadandedit.arrKnowledgeAssets.push(objDashboard); 
              
                 }
			}
             else
             {

              knowledgereadandedit._removeLiveKnowledgeAsset('stability');

             }

             var HotSpot = $("#HotSpot");

             if (HotSpot.is(':checked')) 
             {

             if(knowledgereadandedit.defaultURLHotspot!='')
             {
                    var objDashboard = {};
					objDashboard.assetType = "Graph";
					objDashboard.assetName = knowledgereadandedit.defaultURLHotspot;
					objDashboard.graphType = "hotspot";
					objDashboard.heading = "hotspot";				
					objDashboard.content = "*";
					objDashboard.fileSize = 0;
					
					var index = knowledgereadandedit._getAssetIndex(objDashboard);
					if(index != -1)                                                	
						knowledgereadandedit.arrKnowledgeAssets[index] = objDashboard;							
					else
						knowledgereadandedit.arrKnowledgeAssets.push(objDashboard); 
              
             }
            }
            else
            {
              knowledgereadandedit._removeLiveKnowledgeAsset('hotspot');
            }


		}
			
			knowledgereadandedit.initRenderKnowledgeAssetsList(false);
	},
	
	_removeLiveKnowledgeAsset:function(knowledgeType)
	{
		for (var i = 0; i < knowledgereadandedit.arrKnowledgeAssets.length; i++)
		{
			if (knowledgereadandedit.arrKnowledgeAssets[i].graphType === knowledgeType)
				knowledgereadandedit.arrKnowledgeAssets.splice(i, 1);
		}		
	},
		
	enableEditKnowledge: function(){
		$("#page_knowledgereadandedit #divTitle").show();
		$("#page_knowledgereadandedit .action-edit-view-container #knowledge_title").prop("readonly", false);
		$("#page_knowledgereadandedit #labelDescription").show();
		$("#page_knowledgereadandedit .portlet-title").show();
		$("#page_knowledgereadandedit .save-cancel-btn-grp").show();
		$("#page_knowledgereadandedit .bottom-ctrl-container .close-doc-view").hide();
		$("#page_knowledgereadandedit #filterTagsHolder span a").show()
		knowledgereadandedit.enableSummernote();
		$("#page_knowledgereadandedit .action-edit-view-container #addTagsContainer").show();
		$("#page_knowledgereadandedit .action-edit-view-container .streamsContainer").find("input[type='checkbox']").attr("disabled", false);
		$("#page_knowledgereadandedit .action-edit-view-container .streamsContainer").find(".checker.disabled").removeClass('disabled');
		$("#page_knowledgereadandedit .action-edit-view-container .streamsContainer .js-basic-multiple").prop("disabled", false);
		$("#page_knowledgereadandedit .action-edit-view-container .streamsContainer select").prop("disabled", false);
		
		$("#page_knowledgereadandedit .action-edit-view-container .securityContainer select").prop("disabled", false);
		$("#page_knowledgereadandedit .action-edit-view-container .ReviewContainer select").prop("disabled", false);					
		
	    $("#page_knowledgereadandedit #chksmartfaq").prop("disabled", false);	
		
		if( knowledgereadandedit.sKnowledge.doc_details["isFaq"] && iseConstants.EnableSmartFAQ)
			$('#page_knowledgereadandedit #btnAddMoreFaq').show();
		else 
			$('#page_knowledgereadandedit #btnAddMoreFaq').hide();
		
		if(knowledgereadandedit.sKnowledge!=null && knowledgereadandedit.sKnowledge.doc_details.Reviewer_Name!='undefined' 
		&& knowledgereadandedit.sKnowledge.doc_details.Reviewer_Name!='' && knowledgereadandedit.sKnowledge.doc_details.Reviewer_Name==knowledgereadandedit.currentUser)
		{
			$("#page_knowledgereadandedit .action-edit-view-container .ReviewContainer").find("input[type='checkbox']").attr("disabled", false);					
		}
		
		$("#page_knowledgereadandedit .action-edit-view-container #addAssetsCoantainer").show();
		$("#page_knowledgereadandedit #knowledgeAssetsContainer .glyphicon.glyphicon-remove").show();
		$("#page_knowledgereadandedit .bottom-ctrl-container .bottom-save-cancel-btn-grp").show();
		$("#page_knowledgereadandedit .action-edit-view-container #knowledgeDescription").hide();
		$("#page_knowledgereadandedit .action-edit-view-container #reviewerComments").hide();		
		if (iseConstants.multilingual)
		{
			$('#page_knowledgereadandedit .action-edit-view-container #HMultilingual').show();
			$('#page_knowledgereadandedit .action-edit-view-container #chkMultiLingual').show();
			if(knowledgereadandedit.sKnowledge!=null && knowledgereadandedit.sKnowledge.doc_details.isNonEnglish != undefined 
				&& knowledgereadandedit.sKnowledge.doc_details.isNonEnglish != 'undefined' && knowledgereadandedit.sKnowledge.doc_details.isNonEnglish != false)
			{
				$('#page_knowledgereadandedit .action-edit-view-container #chkMultiLingual').prop('checked', true);
			}
			else
			{
				$('#page_knowledgereadandedit .action-edit-view-container #chkMultiLingual').prop('checked', false);
			}
		}
		else
		{
			$('#page_knowledgereadandedit .action-edit-view-container #HMultilingual').hide();
			$('#page_knowledgereadandedit .action-edit-view-container #chkMultiLingual').hide();
			$('#page_knowledgereadandedit .action-edit-view-container #uniform-chkMultiLingual').hide();
		}				   	
	},
	
	_resetDocDetails: function(){
                $('#results').empty();
		knowledgereadandedit.enableEdit = false;
		knowledgereadandedit.arrTags = [];
		knowledgereadandedit.valReviewer = "";
		knowledgereadandedit.valStatus = "Not-Reviewed";
		knowledgereadandedit.othersDataObj={};
		knowledgereadandedit.objDBData = {};
		knowledgereadandedit.arrKnowledgeAssets =[];
		knowledgereadandedit.arrComments = [];
		knowledgereadandedit.objRatings = {};
		knowledgereadandedit.strKnowledgeDesc = "";
		
		knowledgereadandedit.htmldoccontent="";
		
		
		knowledgereadandedit.strReviewComments ="";
		knowledgereadandedit.dataFromRemoteFile = ""
		knowledgereadandedit.documentId = "";
		knowledgereadandedit.containsAttachments = false;
		knowledgereadandedit.arrTotalVisualizations = [];
		knowledgereadandedit.arrSelectedVisualization = [];
		knowledgereadandedit.arrTotalDashboard = [];
		knowledgereadandedit.arrSelectedDashboard = [];
		knowledgereadandedit.popupInvoker = "";
		knowledgereadandedit.arrPreviousAssets = [];
		knowledgereadandedit.translatedTitle = "";
		knowledgereadandedit.translatedDesc = "";
		knowledgereadandedit.projectName = "";
	},
		
	_editKnowledge: function(){
		$("#page_knowledgereadandedit .edit-knowledge-btn").hide();		
		$("#page_knowledgereadandedit #btnAddMoreFaq").hide();		
		knowledgereadandedit.enableEdit = true;
		knowledgereadandedit.enableEditKnowledge();		
	},
	
	addUrlsHandler: function(){

		for (var i = 0; i < knowledgereadandedit.arrUrls.length; i++ )
		{	
			var index = knowledgereadandedit._getAssetIndex(knowledgereadandedit.arrUrls[i]);
			if(index != -1)                                                	
				knowledgereadandedit.arrKnowledgeAssets[index] = knowledgereadandedit.arrUrls[i];							
			else		
				knowledgereadandedit.arrKnowledgeAssets.push(knowledgereadandedit.arrUrls[i]); 
		}

		knowledgereadandedit.initRenderKnowledgeAssetsList(false);
		$("#page_knowledgereadandedit #addURLsModalContainer").modal('hide');
	},
	
	_plotControls: function(){
		$("#page_knowledgereadandedit .action-edit-view-container .streamsContainer").empty();		
		$.getJSON("json/streamsDetails.json?"+Date.now(), function(data) {
		   $.each(data, function(key, item) {
				for(var i=0;i<item.options.length;i++){
				   var elementChecked, container;
				   if(item.options[i].enable == "yes" ){
						switch(item.options[i].type) {
							case 'checkBox':
								 knowledgereadandedit.plotCheckboxes(item.options[i].displayName, item.options[i].subOptions, item.options[i].field_name);
								break;
							case 'multiSelect':
								knowledgereadandedit.createDropdownSelectTwo(item.options[i].displayName, item.options[i].subOptions, item.options[i].field_name);
								break;
							case 'selectOne':
								if (typeof item.options[i].subOptions === "object" && item.options[i].subOptions !== "FROMDB")							
									knowledgereadandedit.createDropdownSelectOne(item.options[i].displayName, item.options[i].subOptions, item.options[i].field_name);
								else
									knowledgereadandedit.createDropdownSelectOne(
																					item.options[i].displayName, 
																					knowledgereadandedit.objDBData[item.options[i].displayName], 
																					item.options[i].field_name
																				);										
								break;
						}	
					}
				}   
			})
			if (knowledgereadandedit.sKnowledge !== null)
			{
				$("#page_knowledgereadandedit #chksmartfaq").prop("disabled", true);
				if(knowledgereadandedit.sKnowledge && knowledgereadandedit.sKnowledge.doc_type == 'knowledgeEdit')
				{
					$("#page_knowledgereadandedit .action-edit-view-container .streamsContainer select").prop("disabled", true);
					$("#page_knowledgereadandedit .action-edit-view-container .streamsContainer").find("input[type='checkbox']").attr("disabled", true);
					$("#page_knowledgereadandedit .action-edit-view-container .streamsContainer").find(".checker.disabled").addClass('disabled')
					$("#page_knowledgereadandedit .action-edit-view-container .streamsContainer .js-basic-multiple").prop("disabled", true);
					$("#page_knowledgereadandedit .action-edit-view-container .securityContainer select").prop("disabled", true);					
					$("#page_knowledgereadandedit .action-edit-view-container .ReviewContainer select").prop("disabled", true);	
					$("#page_knowledgereadandedit .action-edit-view-container .ReviewContainer").find("input[type='checkbox']").attr("disabled", true);					
				}
			}
			else
			{
				$("#page_knowledgereadandedit .action-edit-view-container .streamsContainer").find("input[type='checkbox']").attr("disabled", false);
				$("#page_knowledgereadandedit .action-edit-view-container .streamsContainer").find(".checker.disabled").removeClass('disabled')
				$("#page_knowledgereadandedit .action-edit-view-container .streamsContainer .js-basic-multiple").prop("disabled", false);
				$("#page_knowledgereadandedit .action-edit-view-container .streamsContainer select").prop("disabled", false);
				$("#page_knowledgereadandedit .action-edit-view-container .securityContainer select").prop("disabled", false);
				$("#page_knowledgereadandedit .action-edit-view-container .ReviewContainer select").prop("disabled", false);					
				$("#page_knowledgereadandedit #chksmartfaq").prop("disabled", false);		
				$("#page_knowledgereadandedit .action-edit-view-container .ReviewContainer").find("input[type='checkbox']").attr("disabled", false);
					
			}
			
			if(iseConstants.EnableSmartFAQ)
			{
				$("#page_knowledgereadandedit #chksmartfaq").show();
				$("#page_knowledgereadandedit #lblsmartfaq").show();	
			}
			else
			{
				$("#page_knowledgereadandedit #chksmartfaq").hide();		
				$("#page_knowledgereadandedit #lblsmartfaq").hide();	
				$("#page_knowledgereadandedit #uniform-chksmartfaq").hide();
			}
				
        });
		$.uniform.update();	
	},
	initSummernote: function () {
		//Bug 3466 starts
		$('#page_knowledgereadandedit #knowledge_new_edit_description').summernote('destroy');
		$('#page_knowledgereadandedit #knowledge_reviewer_comments').summernote('destroy');
		$('#page_knowledgereadandedit #knowledge_new_know_description').summernote('destroy');
		
				
		//Bug 3466 ends		
        $('#page_knowledgereadandedit #knowledge_new_edit_description').summernote({height: 100});
		$('#page_knowledgereadandedit #knowledge_new_edit_description').summernote('code', "");
        $('#page_knowledgereadandedit #knowledge_reviewer_comments').summernote({height: 100});
		$('#page_knowledgereadandedit #knowledge_reviewer_comments').summernote('code', "");
		
		$('#page_knowledgereadandedit #knowledge_new_know_description').summernote({height: 328.25});
		$('#page_knowledgereadandedit #knowledge_new_know_description').summernote('code', "");
		
    },
	disableSummernote: function () {		
		$('#page_knowledgereadandedit #knowledge_new_edit_description').summernote('destroy');
		$('#page_knowledgereadandedit #knowledge_reviewer_comments').summernote('destroy');
		if (knowledgereadandedit.sKnowledge.doc_details["description"] && knowledgereadandedit.sKnowledge.doc_details["description"] !== "")
			knowledgereadandedit.strKnowledgeDesc = knowledgereadandedit.sKnowledge.doc_details["description"];
			
		$("#knowledgeDescription").append(knowledgereadandedit.strKnowledgeDesc);        
		
		if (knowledgereadandedit.sKnowledge.doc_details["Review_Comments"] && knowledgereadandedit.sKnowledge.doc_details["Review_Comments"] !== "")
			knowledgereadandedit.strReviewComments = knowledgereadandedit.sKnowledge.doc_details["Review_Comments"];
			
		$("#reviewerComments").append(knowledgereadandedit.strReviewComments);
		
		$("#page_knowledgereadandedit .action-edit-view-container #knowledgeDescription").show();
		$("#page_knowledgereadandedit .action-edit-view-container #reviewerComments").show();		
    },
	enableSummernote: function () {	
		$('#page_knowledgereadandedit #knowledge_new_edit_description').summernote('code', knowledgereadandedit.strKnowledgeDesc);
		$('#page_knowledgereadandedit #knowledge_reviewer_comments').summernote('code', knowledgereadandedit.strReviewComments);
		$('#page_knowledgereadandedit #knowledge_new_know_description').summernote('code', knowledgereadandedit.htmldoccontent);
		
    },
	renderAddTags: function(){
		var storedTags = knowledgereadandedit.sKnowledge.doc_details["tags"];
		if (storedTags)
		{
			for(var i=0; i < storedTags.length; i++)
			{
				knowledgereadandedit._addTextTags(storedTags[i], 'none');
			}
		}
	},
	_addTextTags:function(val, type){
		var selected_val = val;

        // check if exists -Gourik
      
        if ($.inArray(selected_val, knowledgereadandedit.arrTags) == -1) {

		 knowledgereadandedit.tag_id_val++;
		 knowledgereadandedit.arrTags.push(val);
		 $("#page_knowledgereadandedit #filterTagsHolder").append('<span class="tag" fieldValue="' + selected_val.trim() + '" onClick="knowledgereadandedit.Searchwithtag(this)" id=tag_' + knowledgereadandedit.tag_id_val + ' style="margin:1px 5px 1px 1px; display: inline-block;"><span>'+ selected_val.trim() + '&nbsp;&nbsp;</span><a style="display:'+type+'" parentID=tag_' + knowledgereadandedit.tag_id_val + ' fieldValue='+escape(selected_val)+' onClick=knowledgereadandedit._removeTagsFilter(this,event) title="Removing tag">x</a></span>');
       }
          
			 
		$("#page_knowledgereadandedit #filterTagsHolder").show();
		
		$("#page_knowledgereadandedit #addTagInput").val('');
		
	},
    Searchwithtag : function(spanObject)
    {
     var TagName = $("#" + spanObject.id).attr("fieldvalue");
     localStorage.removeItem('TagName'); 
     localStorage.setItem('TagName', "tags:"+TagName);
     $(location).attr('hash','#knowledgestore');
    },
	 _removeTagsFilter: function(event,e) {
		var tagToRemove = $(event).attr("fieldValue");
		var tagIndex = $.inArray(tagToRemove, knowledgereadandedit.arrTags);	
		knowledgereadandedit.arrTags.splice(tagIndex, 1);
		
		var parentID = $(event).attr("parentID");
		$("#" + parentID).remove();
		
		var numbOfTags = $("#page_knowledgereadandedit #filterTagsHolder").children().length;
		if(numbOfTags == 0)
		{
			$("#page_knowledgereadandedit #filterTagsHolder").hide();
		}
       e.stopImmediatePropagation();
	},
	
	plotCheckboxes: function (display_name, sub_options, field_name){	
		var elementChecked, htmlData;
		knowledgereadandedit.othersDataObj[field_name] = [];
					
		if (knowledgereadandedit.sKnowledge !== null && knowledgereadandedit.sKnowledge.doc_details[field_name]!='undefined')
			{
			if (knowledgereadandedit.sKnowledge.doc_details[field_name] && knowledgereadandedit.sKnowledge.doc_details[field_name] !== "")
				knowledgereadandedit.othersDataObj[field_name] = (typeof knowledgereadandedit.sKnowledge.doc_details[field_name] !== "object") 
																	?[knowledgereadandedit.sKnowledge.doc_details[field_name]]
																	: knowledgereadandedit.sKnowledge.doc_details[field_name];
			}	
				
			htmlData = '<div class="col-md-5 '+display_name+'"><label class="control-label display-block">'+display_name+'</label>';
			for(var i=0; i<sub_options.length; i++)
			{
				elementChecked = ((knowledgereadandedit.othersDataObj[field_name]) && (knowledgereadandedit.othersDataObj[field_name].indexOf(sub_options[i]) > -1)) 
									? "checked"
									: "unchecked";
				htmlData += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="strChkBox checkbox-inline" name="' + sub_options[i] + '" '+elementChecked+' disabled>' +sub_options[i]+ '</label></div></div>'
			}
		
		if (display_name !== "Status")
			$(".streamsContainer").append(htmlData);
		else
			$(".reviewerContainer").append(htmlData);
			
		knowledgereadandedit.onChangeCheckbox(display_name,field_name);
		knowledgereadandedit._handleUniform();
	},
		
	createDropdownSelectOne:function (display_name, options_array, field_name){
		var htmlData = '<div class="col-md-4 '+display_name+'"><label class="control-label display-block">'+display_name+'</label>';
		htmlData += '<div class="form-group col-md-12"><select id="dds_' + display_name + '" class="form-control single-select-'+display_name+'" disabled>'
		htmlData += ' <option value="Select">Select</option>';
		for(var i=0; i<options_array.length; i++){
			var selected = "";
			knowledgereadandedit.othersDataObj[field_name] = [];
			if (knowledgereadandedit.sKnowledge !== null && knowledgereadandedit.sKnowledge.doc_details[field_name])
			{	
				knowledgereadandedit.othersDataObj[field_name] = knowledgereadandedit.sKnowledge.doc_details[field_name];
				selected = ((knowledgereadandedit.othersDataObj[field_name]) && (options_array[i] == knowledgereadandedit.othersDataObj[field_name]))
									?"selected"
									:"";
				
			}
			htmlData += ' <option value="'+options_array[i]+'"'+selected+'>'+options_array[i]+'</option>';
		} 
		htmlData += '</select>';
		
		if (display_name !== "Reviewer")
			$(".streamsContainer").append(htmlData);
		else
			$(".reviewerContainer").append(htmlData);
			
		knowledgereadandedit.onChangeSingleSelect(display_name,field_name);
	},	
		
	createDropdownSelectTwo: function (display_name, options_array, field_name){
		knowledgereadandedit.othersDataObj[field_name] = [];
		if (knowledgereadandedit.sKnowledge !== null)
		{	
			if(knowledgereadandedit.sKnowledge.doc_details[field_name])
				knowledgereadandedit.othersDataObj[field_name] = (typeof knowledgereadandedit.sKnowledge.doc_details[field_name] !== "object")
																	? [knowledgereadandedit.sKnowledge.doc_details[field_name]]
																	: knowledgereadandedit.sKnowledge.doc_details[field_name];
		}													
	
		//var htmlData = '<div class="col-md-10 '+display_name+'"><label class="control-label display-block">'+display_name+'</label>';
        var htmlData = '<div class="col-md-4 '+display_name+'"><label class="control-label display-block">'+display_name+'</label>';
        
		htmlData += '<div class="form-group col-md-4" id="technology_edit"><select multiple="multiple" id="ddm_' + display_name + '" class="js-basic-multiple multiple-select-'+display_name+'" disabled>'
		for(var i=0; i<options_array.length; i++)
		{
			htmlData += ' <option value="'+options_array[i]+'">'+options_array[i]+'</option>';
		}
		htmlData += '</select>';		
        
		$(".streamsContainer").append(htmlData);	
        $("#ddm_"+display_name).select2();
		//$(".js-basic-multiple").select2();
		if (knowledgereadandedit.othersDataObj[field_name])
			$(".multiple-select-"+display_name).select2("val", knowledgereadandedit.othersDataObj[field_name])		
		knowledgereadandedit.onChangeMultiSelect(display_name,field_name);
	},
	
	_initSecurityData: function()
	{
		$("#dds_securitylevel").empty();
		$.each(knowledgereadandedit.Security.levels, function (key, value) {
            $("#dds_securitylevel").append($('<option></option>').val(value.SecurityValue).html(value.SecurityLevel));
        });
		
		
		if( knowledgereadandedit.sKnowledge!=null && knowledgereadandedit.sKnowledge.doc_details.Security_LevelValue!='undefined' 
		&& knowledgereadandedit.sKnowledge.doc_details.Security_LevelValue!='')
		{
			 $("#dds_securitylevel").val(knowledgereadandedit.sKnowledge.doc_details.Security_LevelValue);
		}
		else 
		{
			 $("#dds_securitylevel").val('');
		}
		
	},
	
	_initReviewerData: function()
	{
		knowledgereadandedit._getuserList(knowledgereadandedit._receivedUsers);	
		
	},
	
	_getuserList: function (callBackFunction) {
        var respJson;
        var jsondata = { username: localStorage.getItem('username'), operation: 'list' };
        var serviceName = 'JscriptWS';
        var hostUrl = '/DevTest/rest/';
        var methodname = 'userManagement';
        var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' +
                                localStorage.projectName + '&sname=' + methodname;
        $.ajax({
            type: "POST",
            url: Url,
            async: true,
            data: JSON.stringify(jsondata),
            success: function (msg) {
                respJson = msg;
                resultsData = JSON.parse(msg);
                console.log(resultsData)
                callBackFunction(resultsData);
            },
            error: function (msg) {      
                console.log("failure");
            }
        });
    },
	
	_receivedUsers: function(data)
	{
		
		var arrReviewers = [];
		var projectName = localStorage.getItem("multiProjectName");
		
		for (var i = 0; i < data.users.length; i++) 
		{
			if (data.users[i].projectAssigned.includes(projectName))
            arrReviewers.push(data.users[i].username);
		}
		
		knowledgereadandedit.objDBData.Reviewer = arrReviewers;
		
		$("#dds_Reviewer").empty();
		listData='';
		for(var i=0; i<arrReviewers.length; i++){
			var fData = arrReviewers[i];
			if (fData != '')
				listData += ' <option value="'+fData+'">'+fData+'</option>';
		 }
		 
		$("#dds_Reviewer").append(listData);
		
		if(knowledgereadandedit.sKnowledge!=null && knowledgereadandedit.sKnowledge.doc_details.Reviewer_Name!='undefined' 
		&& knowledgereadandedit.sKnowledge.doc_details.Reviewer_Name!='')
		{
			 $("#dds_Reviewer").val(knowledgereadandedit.sKnowledge.doc_details.Reviewer_Name);
		}
		else
		{
			$("#dds_Reviewer").val('');
			
		}
	
		if(knowledgereadandedit.sKnowledge!=null && knowledgereadandedit.sKnowledge.doc_details.Status_Name!='undefined' 
		&& knowledgereadandedit.sKnowledge.doc_details.Status_Name!='')
		{
			if(knowledgereadandedit.sKnowledge.doc_details.Status_Name!='Not-Reviewed')
			 $('#chkstatus').prop('checked', true);
		}
		else
		{
			$('#chkstatus').prop('checked', false);
			
		}
		
		$('.myCheckbox').prop('checked', true);
						
	},
	
	
	onChangeCheckbox:function (display_name,field_name) {
		$("."+display_name+" input[type=checkbox]").click(function() {
			var $this = $(this); 
				if ($this.is(':checked')) {
					knowledgereadandedit.othersDataObj[field_name].push($(this).attr('name'));
				} else {
					var index = knowledgereadandedit.othersDataObj[field_name].indexOf($(this).attr('name'));
					if (index > -1) {
						knowledgereadandedit.othersDataObj[field_name].splice(index, 1);
					}
				}
			   console.log("knowledgereadandedit.arrActivities---"+knowledgereadandedit.othersDataObj[field_name]);
			$.uniform.update();
		});
	},
		
	onChangeSingleSelect:function (display_name,field_name){
		$("."+display_name+" select").change(function() {
			
			knowledgereadandedit.othersDataObj[field_name] = $(".single-select-"+display_name).val();
			console.log("knowledgereadandedit.valReviewer----"+knowledgereadandedit.othersDataObj[field_name]);
		});
	},
		
	onChangeMultiSelect:function (display_name,field_name) {
		$("."+display_name+" select").change(function() {			
            knowledgereadandedit.othersDataObj[field_name] = ($("#ddm_"+display_name).val());				
			console.log("knowledgereadandedit.arrTechnology----"+knowledgereadandedit.othersDataObj[field_name]);
            			
		});
	},
	resetFileURLMediaConatainer:function(){
		$("#page_knowledgereadandedit #knowledgeAssetsContainer #filesAssetContainer").empty();
		$("#page_knowledgereadandedit #knowledgeAssetsContainer #urlAssetContainer").empty();
		$("#page_knowledgereadandedit #knowledgeAssetsContainer #mediaAssetContainer").empty();
	},
	
	initRenderKnowledgeAssetsList: function(readFromStorage = true){
		
		knowledgereadandedit.resetFileURLMediaConatainer();
		if (readFromStorage)
		{
			knowledgereadandedit.arrKnowledgeAssets = knowledgereadandedit.sKnowledge.doc_details["knowledgeAssets"];
			
			/*Commented because this tag is not coming from ES API for particular record even, if it is there with record */
			/*if (knowledgereadandedit.sKnowledge.doc_details["documentcontent"])
				knowledgereadandedit.documentcontent = knowledgereadandedit.sKnowledge.doc_details["documentcontent"];*/
			
			if (knowledgereadandedit.arrKnowledgeAssets && knowledgereadandedit.arrKnowledgeAssets.length > 0)
				knowledgereadandedit.arrPreviousAssets = knowledgereadandedit.arrKnowledgeAssets.slice();
			
		}

		if (knowledgereadandedit.arrKnowledgeAssets)	 
		{
			var arrData = knowledgereadandedit.arrKnowledgeAssets;			
			for (var i=0; i < arrData.length ; i++)
			{			
				var conatiner = '#page_knowledgereadandedit #knowledgeAssetsContainer #'
				if(arrData[i].assetType == "Url")
				{
					var subContainer = conatiner+"urlAssetContainer";
					knowledgereadandedit.renderNormalView(arrData[i].assetType, arrData[i].assetName, arrData[i].heading, arrData[i].content, arrData[i].fileSize, subContainer, i);
				}
				else if(arrData[i].assetType == "File" && (arrData[i].fileType.toLowerCase().includes("image") || arrData[i].fileType.toLowerCase().includes("jpg") || arrData[i].fileType.toLowerCase().includes("png") || arrData[i].fileType.toLowerCase().includes("bmp")))
				{
					var subContainer = conatiner+"mediaAssetContainer";
					if (knowledgereadandedit.sKnowledge !== null && $.grep(knowledgereadandedit.arrPreviousAssets, function(e){ return e.assetName == arrData[i].assetName; }).length > 0)
					knowledgereadandedit.renderVisualizationAndDashBoardView("Image", arrData[i].assetName, arrData[i].heading, arrData[i].content, arrData[i].fileSize, subContainer, i);
					else
						knowledgereadandedit.renderFileView(arrData[i].assetType, arrData[i].assetName, arrData[i].modifiedDate, arrData[i].fileSize, i);
				}
				else if(arrData[i].assetType == "File" && arrData[i].fileType.indexOf("video") >= 0)
				{
					var subContainer = conatiner+"mediaAssetContainer";
					if (knowledgereadandedit.sKnowledge !== null && $.grep(knowledgereadandedit.arrPreviousAssets, function(e){ return e.assetName == arrData[i].assetName; }).length > 0)
					knowledgereadandedit.renderVisualizationAndDashBoardView("Video", arrData[i].assetName, arrData[i].heading, arrData[i].content, arrData[i].fileSize, subContainer, i);
					else
						knowledgereadandedit.renderFileView(arrData[i].assetType, arrData[i].assetName, arrData[i].modifiedDate, arrData[i].fileSize, i);		
				}
				else if(arrData[i].assetType == "Graph")
				{
					var subContainer = conatiner+"mediaAssetContainer";
					knowledgereadandedit.renderVisualizationAndDashBoardView(arrData[i].assetType, arrData[i].assetName, arrData[i].heading, arrData[i].content, arrData[i].fileSize, subContainer, i);
				}else if(arrData[i].assetType == "File")
				{
					knowledgereadandedit.blnchagedoccolor = false;
					if(knowledgereadandedit.sKnowledge && knowledgereadandedit.sKnowledge.doc_details.documents && knowledgereadandedit.sKnowledge.doc_details.documents[i] !== undefined)
					  {
						if(knowledgereadandedit.sKnowledge.doc_details.documents[i].document.documentcontent !== undefined)
						  {
							//Read the item to be searched from the local storage.
							if(localStorage.getItem('LastSearchedtext'))
							{
								var itemtosearch = localStorage.getItem('LastSearchedtext');
								knowledgereadandedit.lastsearchedtext = itemtosearch;

								itemtosearch = itemtosearch.replace(/\//g, " ");
								var re = new RegExp(itemtosearch, "ig");
							
								for (var d=0; d < knowledgereadandedit.sKnowledge.doc_details.documents.length ; d++)
								{	
									if(knowledgereadandedit.sKnowledge.doc_details.documents[d].document.documentname == arrData[i].assetName)
									{
										$("#page_knowledgereadandedit #documentcontent").
										text(knowledgereadandedit.sKnowledge.doc_details.documents[d].document.documentcontent);
									
									}
								}
						
								var result = [];
				
								var match, matches = [];
								$("#page_knowledgereadandedit #documentcontent").hide();
							
								var found = false;
								while ((match = re.exec($("#page_knowledgereadandedit #documentcontent").text())) != null) {
									matches.push(match[0]);
									found = true;
									break;
								}
				
								result = matches;
							
								
							
							}
							
						  }
					   }


				   knowledgereadandedit.renderFileView(arrData[i].assetType, arrData[i].assetName, arrData[i].modifiedDate, arrData[i].fileSize, i,found);
				}
			}
			knowledgereadandedit.isCreatedVisualizationAndDashboardConatainer = false;
			knowledgereadandedit.isCreatedImageAndVideoConatainer = false;
			knowledgereadandedit.visualizationAndDashboardInnerConatainerCount = 0;
			knowledgereadandedit.imageAndVideoConatainerCount = 0;
		}
		 if((knowledgereadandedit.sKnowledge === null) || knowledgereadandedit.enableEdit){
			$("#page_knowledgereadandedit #knowledgeAssetsContainer .glyphicon.glyphicon-remove").show();
		 }else{
			$("#page_knowledgereadandedit #knowledgeAssetsContainer .glyphicon.glyphicon-remove").hide(); 
		 }
	},
	
	renderFAQList:function()
	{
			knowledgereadandedit.arrSmartFaqs = [];
			$("#page_knowledgereadandedit #knowledgeReadEditAddMoreFAQModal #FAQResultListContainer").empty();
			$("#page_knowledgereadandedit #knowledgeReadEditAddMoreFAQModal #txtDisplayquestion").val('');
			
			
			if(knowledgereadandedit.sKnowledge && knowledgereadandedit.sKnowledge.doc_details["arrSmartFaqs"])
			{
				knowledgereadandedit.arrSmartFaqs = knowledgereadandedit.sKnowledge.doc_details["arrSmartFaqs"];
				
				for (var i=0; i < knowledgereadandedit.arrSmartFaqs.length ; i++)
				{				
					var conatiner = '#page_knowledgereadandedit #knowledgeReadEditAddMoreFAQModal #FAQResultListContainer'
					knowledgereadandedit.renderNormalView("", "", "", knowledgereadandedit.arrSmartFaqs[i].question, 0, conatiner, i);		
				}
			}
	}	,
	
	renderFileView: function(type, fileName, modifiedDate, fileSize, assetIndex,changecolor = false){
	
		if(iseConstants.ConvertDocstoHTML)
		{
			if (iseConstants.isDownloadAllowed || localStorage.getItem('rolename').toLowerCase() === "admin")
			{
		if(changecolor)
		{
			var mDate = new Date(modifiedDate);		 
			var dateInFormat = mDate.getDate() + "-" + knowledgereadandedit._getCurrentMonth(mDate.getMonth()) + "-" + mDate.getFullYear() + " " + mDate.getHours() + ":" + mDate.getMinutes(); 
			var htmlContent = '<div class="col-md-12 list-element file-holder alert alert-warning added-files"><div class="col-md-6"><a href="javascript:;" onclick="knowledgereadandedit._downloadAttachment(this)">'+fileName+'</a><div class="col-md-6"><a style="color:red" href="javascript:;" onclick="knowledgereadandedit._showdownloadAttachment(this)">'+fileName+'</a></div></div><div class="col-md-4">'+dateInFormat+'</div><div class="col-md-2">'+(parseFloat(fileSize)).toFixed(2)+' MB<span class="glyphicon glyphicon-remove pull-right" element-type="'+type+'" index="'+assetIndex+'"></span></div></div>';
			$("#page_knowledgereadandedit #knowledgeAssetsContainer #filesAssetContainer").append(htmlContent);
		
		}
		
		else 
		{
		 var mDate = new Date(modifiedDate)		 
		 var dateInFormat = mDate.getDate() + "-" + knowledgereadandedit._getCurrentMonth(mDate.getMonth()) + "-" + mDate.getFullYear() + " " + mDate.getHours() + ":" + mDate.getMinutes(); 
         var htmlContent = '<div class="col-md-12 list-element file-holder alert alert-warning added-files"><div class="col-md-6"><a href="javascript:;" onclick="knowledgereadandedit._downloadAttachment(this)">'+fileName+'</a><div class="col-md-6"><a href="javascript:;" onclick="knowledgereadandedit._showdownloadAttachment(this)">'+fileName+'</a></div></div><div class="col-md-4">'+dateInFormat+'</div><div class="col-md-2">'+(parseFloat(fileSize)).toFixed(2)+' MB<span class="glyphicon glyphicon-remove pull-right" element-type="'+type+'" index="'+assetIndex+'"></span></div></div>';
         $("#page_knowledgereadandedit #knowledgeAssetsContainer #filesAssetContainer").append(htmlContent);
		}
		}
		else 
		{
				if(changecolor)
				{
					var mDate = new Date(modifiedDate);		 
					var dateInFormat = mDate.getDate() + "-" + knowledgereadandedit._getCurrentMonth(mDate.getMonth()) + "-" + mDate.getFullYear() + " " + mDate.getHours() + ":" + mDate.getMinutes(); 
					var htmlContent = '<div class="col-md-12 list-element file-holder alert alert-warning added-files"><div class="col-md-6"><a style="color:red" href="javascript:;" onclick="knowledgereadandedit._showdownloadAttachment(this)">'+fileName+'</a></div><div class="col-md-4">'+dateInFormat+'</div><div class="col-md-2">'+(parseFloat(fileSize)).toFixed(2)+' MB<span class="glyphicon glyphicon-remove pull-right" element-type="'+type+'" index="'+assetIndex+'"></span></div></div>';
					$("#page_knowledgereadandedit #knowledgeAssetsContainer #filesAssetContainer").append(htmlContent);
				
				}
				
				else 
				{
					var mDate = new Date(modifiedDate)		 
					var dateInFormat = mDate.getDate() + "-" + knowledgereadandedit._getCurrentMonth(mDate.getMonth()) + "-" + mDate.getFullYear() + " " + mDate.getHours() + ":" + mDate.getMinutes(); 
					var htmlContent = '<div class="col-md-12 list-element file-holder alert alert-warning added-files"><div class="col-md-6"><a href="javascript:;" onclick="knowledgereadandedit._showdownloadAttachment(this)">'+fileName+'</a></div><div class="col-md-4">'+dateInFormat+'</div><div class="col-md-2">'+(parseFloat(fileSize)).toFixed(2)+' MB<span class="glyphicon glyphicon-remove pull-right" element-type="'+type+'" index="'+assetIndex+'"></span></div></div>';
					$("#page_knowledgereadandedit #knowledgeAssetsContainer #filesAssetContainer").append(htmlContent);
				}
			}
		}
		else 
		{
		 var mDate = new Date(modifiedDate)		 
		 var dateInFormat = mDate.getDate() + "-" + knowledgereadandedit._getCurrentMonth(mDate.getMonth()) + "-" + mDate.getFullYear() + " " + mDate.getHours() + ":" + mDate.getMinutes(); 
         var htmlContent = '<div class="col-md-12 list-element file-holder alert alert-warning added-files"><div class="col-md-6"><a href="javascript:;" onclick="knowledgereadandedit._downloadAttachment(this)">'+fileName+'</a></div><div class="col-md-4">'+dateInFormat+'</div><div class="col-md-2">'+(parseFloat(fileSize)).toFixed(2)+' MB<span class="glyphicon glyphicon-remove pull-right" element-type="'+type+'" index="'+assetIndex+'"></span></div></div>';
         $("#page_knowledgereadandedit #knowledgeAssetsContainer #filesAssetContainer").append(htmlContent);
		}
    },

	renderNormalView: function(type, URL, heading, content, fileSize, parentcontainer, assetIndex){
		knowledgereadandedit.setIconType(type);
        
		var htmlContent = '<div class="col-md-12 list-element video-holder"><div class="row col-md-1 video-container"><span class="glyphicon '+knowledgereadandedit.iconeType+'" aria-hidden="true"></span></div><div class="col-md-10 content-conatiner"><a href="'+URL+'" target="_blank" class="display-block margin-bottom-5 margin-top-10">'+heading+'</a><span>'+content+'</span></div><span class="col-md-1 glyphicon glyphicon-remove" element-type="'+type+'" index="'+assetIndex+'"></span></div></div>';
        
		$(''+parentcontainer+'').append(htmlContent);
		knowledgereadandedit.iconeType ="";
	},
	
	renderVisualizationAndDashBoardView: function(type, name, heading, content, fileSize, parentcontainer, assetIndex){
		if(type == "Graph")
			var url = name.replace("<Filter-String>", content);
		else if(type=="Image" || type=="Video")
			var url = "http://"+iseConstants.serverHost+":"+window.location.port+"/DevTest/FileServer/download/" + knowledgereadandedit.documentId + "_" + name.replace("<Filter-String>", content)+"?view=download&authToken="+ localStorage.authtoken;
		
		if(!knowledgereadandedit.isCreatedVisualizationAndDashboardConatainer){
			var htmlContent = '<div class="col-md-12 list-element media-asset-holder"></div>';
			$(''+parentcontainer+'').append(htmlContent);
			knowledgereadandedit.isCreatedVisualizationAndDashboardConatainer = true;
		}
		
		if(knowledgereadandedit.isCreatedVisualizationAndDashboardConatainer){
			if(knowledgereadandedit.visualizationAndDashboardInnerConatainerCount%2 == 0){
				if(type == "Graph")
					$(parentcontainer+' .list-element').append(knowledgereadandedit.renderVisualizationAndDashboardInnerConatainer(url, 'even', assetIndex))
				else if(type=="Image")
					$(parentcontainer+' .list-element').append(knowledgereadandedit.renderImageViewInnerConatainer(url, 'even', assetIndex))
				else if(type=="Video")
					$(parentcontainer+' .list-element').append(knowledgereadandedit.renderVideoViewInnerConatainer(url, 'even', assetIndex))
					
			}else{
				if(type == "Graph")
					$(parentcontainer+' .list-element').append(knowledgereadandedit.renderVisualizationAndDashboardInnerConatainer(url, 'odd', assetIndex));
				else if(type=="Image")
					$(parentcontainer+' .list-element').append(knowledgereadandedit.renderImageViewInnerConatainer(url, 'odd', assetIndex));
				else if(type=="Video")
					$(parentcontainer+' .list-element').append(knowledgereadandedit.renderVideoViewInnerConatainer(url, 'odd', assetIndex));
			}
			knowledgereadandedit.visualizationAndDashboardInnerConatainerCount += 1;			
		}				
	},
	renderVisualizationAndDashboardInnerConatainer: function(_url, class_name, index){		
		var htmlInnerContent = '<div class="row col-md-6 graph-container '+class_name+'"><iframe src="'+_url+'" height="400" width="100%"></iframe> <span class="glyphicon glyphicon-remove" element-type="Graph" index="'+index+'"></span></div>'
		
		return htmlInnerContent;
	},

	renderImageViewInnerConatainer: function(_url, class_name, index){		
		var htmlInnerContent = '<div class="row col-md-6 image-container '+class_name+'"><img src="'+_url+'"> <span class="glyphicon glyphicon-remove" element-type="image" index="'+index+'"></span></div>'
		
		return htmlInnerContent;
	},
	renderVideoViewInnerConatainer: function(_url, class_name, index){		
		var htmlInnerContent = '<div class="row col-md-6 image-container '+class_name+'"><video controls style="width:100%; poster="poster.png"> <source src="'+_url+'" type="video/webm;codecs="vp8, vorbis"" />  </video> <span class="glyphicon glyphicon-remove" element-type="video" index="'+index+'"></span></div>'
		
		return htmlInnerContent;
	},
	
    setIconType: function(type){
        type == "Url" ? knowledgereadandedit.iconeType = "glyphicon-play-circle":(type == "Graph"?  knowledgereadandedit.iconeType = "glyphicon-stats":'');
    },
	
	_downloadAttachment: function(fileName){
		var url = "http://"+iseConstants.serverHost+":"+window.location.port+"/DevTest/FileServer/download/" + knowledgereadandedit.documentId + "_" + $(fileName).text() + "?view=download&authToken="+ localStorage.authtoken;		
		
		window.location.href = url;
	},
	
	_showdownloadAttachment: function(fileName){
			
		var tempfilename =  $(fileName).text();
		var temp = tempfilename.toString().split(".")
		var strExtension = "htm";
		knowledgereadandedit.strDocText = "";
		$("#page_knowledgereadandedit #searchhtmlDoc").val('');
		
		if(temp[1].toLowerCase() == "pdf" || temp[1].toLowerCase() == "png" || temp[1].toLowerCase() == "jpg")
		{
			strExtension = temp[1];
		}
				
		var HtmlfileName = temp[0].replace(/ /g,"%20") + "." + strExtension;
				
		var url = "http://"+iseConstants.serverHost+":"+window.location.port+"/DevTest/FileServer/download/" + knowledgereadandedit.documentId + "_" + HtmlfileName + "?view=inline&authToken="+ localStorage.authtoken;
	
	
		$("#page_knowledgereadandedit #ViewHtmlContainer #divfileview1").empty();
		
		if (!iseConstants.NewDocsCreator)
		{
			$("#page_knowledgereadandedit #ViewHtmlContainer #divNewKnowledgeCreator").hide();			
			$("#page_knowledgereadandedit #ViewHtmlContainer #divDocumentViewer").removeClass('col-md-6').addClass('col-md-12');
			$("#page_knowledgereadandedit #ViewHtmlContainer #btnSave").hide();
			$("#page_knowledgereadandedit #ViewHtmlContainer #btnClear").hide();
			$("#page_knowledgereadandedit #ViewHtmlContainer #btnCreate").hide();						
		}
		
		var finalURL = url.trim();
		
		if (iseConstants.NewDocsCreator)
		{
		if(localStorage.getItem('rolename').toLowerCase() === "admin")
			$("#divfileview1").html('<object id="InContain" style="color:red" width="420px" height="428.25px" data='+ finalURL +'/>');
		else 
		$("#divfileview1").html('<object onload="knowledgereadandedit.disableContextMenu();" onMyLoad="knowledgereadandedit.disableContextMenu();"  id="InContain" style="color:red" width="420px" height="428.25px" data='+ finalURL +'/>');
		}
		else
		{
			if(localStorage.getItem('rolename').toLowerCase() === "admin")
				$("#divfileview1").html('<object id="InContain" style="color:red" width="850px" height="428.25px" data='+ finalURL +'/>');
			else 
				$("#divfileview1").html('<object onload="knowledgereadandedit.disableContextMenu();" onMyLoad="knowledgereadandedit.disableContextMenu();"  id="InContain" style="color:red" width="850px" height="428.25px" data='+ finalURL +'/>');	
		}
	
	        $("#ViewHtmlContainer").modal('show');
	
		$(".table-right-container .note-editor .note-insert").hide()
		
		
		if(localStorage.getItem('SaveTextObject'))
		{
			var tempsavedobject = JSON.parse(localStorage.getItem('SaveTextObject'));
			$('#page_knowledgereadandedit #knowledge_new_know_description').summernote('code',tempsavedobject.Newknowdescription);
		}
		
		if(localStorage.getItem('SaveTitleObject'))
		{
			var tempsavedtitleobject = JSON.parse(localStorage.getItem('SaveTitleObject'));
			$("#page_knowledgereadandedit #Newknowledgetitle").val(tempsavedtitleobject.Newtitle);
		}
				
		$("#page_knowledgereadandedit #ViewHtmlContainer #divfileview1").attr("disabled","disabled");
		//knowledgereadandedit._ReadHTMLData($(fileName).text());		
		
	},
	
	cleartexteditor:function()
	{	
		$('#page_knowledgereadandedit #knowledge_new_know_description').summernote('code', "");
		
		$("#page_knowledgereadandedit #Newknowledgetitle").val('');
		
		
		localStorage.removeItem('SaveTextObject');
		localStorage.removeItem('SaveTitleObject');
		
		
		$("#ViewHtmlContainer").modal('hide');
		
	},
	
	savetexteditor:function()
	{	
		//Saving the content in the main editor window.
		var savetextobject = new Object();
		savetextobject.Newknowdescription = $('#page_knowledgereadandedit #knowledge_new_know_description').summernote('code').trim();		
		localStorage.setItem('SaveTextObject',JSON.stringify(savetextobject));
		
		//Saving the content in the main title box.
		var savetitleobject = new Object();
		savetitleobject.Newtitle = $("#page_knowledgereadandedit #Newknowledgetitle").val().trim();		
		localStorage.setItem('SaveTitleObject',JSON.stringify(savetitleobject));
		
		$("#ViewHtmlContainer").modal('hide');
		
	},
	
	validatetexteditor:function()
	{
		var title = $("#Newknowledgetitle").val().trim();
	
		if (!title || title.trim() === "" || undefined === title || 'undefined' === title)
		{
			alert("Knowledge title can not be left blank.");
			return false;
		}
		else 
		{
			return true;
		}	
	},
	
	createnewknowledge:function()
	{
		if(knowledgereadandedit.validatetexteditor())
		{
			
			var savedValues = new Object();		
			savedValues.title = $("#Newknowledgetitle").val().trim();
			savedValues.description = $('#page_knowledgereadandedit #knowledge_new_know_description').summernote('code').trim();
			savedValues.knowledgeAssets = [];
			savedValues.othersDataObj = {};
			savedValues.arrSmartFaqs=[];
			savedValues.documents=[];
			savedValues.isindexed=[];
			savedValues.OCRTEXT=[];
			
			
			savedValues.Security_Level='Public';
			savedValues.Status_Name = "Not-Reviewed";
			savedValues.Review_Comments = "";
			
			savedValues.usersReview = [];
			savedValues.tags = [];
			savedValues.avgRating = "";
						
			savedValues._id = (Math.floor( Math.random() * 1000 ) + Date.now()).toString();
			
			knowledgereadandedit.NewdocumentId = savedValues._id;
			knowledgereadandedit.NewdocumentTitle = savedValues.title;
			
			ISE.UpdateDocEntryMongo(savedValues, knowledgereadandedit._createDocEntryMongofortextEditor);				
			
			
			
		
			//History Saving code..
			var today = new Date();
			var dd = today.getDate(); 
			var mm = today.getMonth()+1; 
			var yyyy = today.getFullYear(); 
			if(dd<10)
			{
				dd='0'+dd 
            } 
			if(mm<10)
			{ 
				mm='0'+mm 
            } 
            today = dd+'/'+mm+'/'+yyyy; 
			var historyobject = new Object();
			
			var _id = (Math.floor( Math.random() * 1000 ) + Date.now()).toString();
			
			historyobject._id = _id;
			historyobject.documentid = savedValues._id;
			historyobject.modified = today;
			historyobject.modifiedby = localStorage.getItem('username');
			historyobject.noofattachments = 0;
			historyobject.comments = "";
			historyobject.status =  savedValues.Status_Name;
			
			ISE.UpdateKnowledgeHistoryMongo(historyobject,knowledgereadandedit._HistoryResultHandler);
			//History Saving code..
			//http://localhost:8080/ISE/?doc_id=1496043463525#knowledgereadandedit
			
			
			
			console.log("New Knowledge Created with ID"+ savedValues._id);			
			
			
		}
	
	},
	
	disableContextMenu:function()
  {
		document.getElementById("InContain").contentWindow.document.oncontextmenu = function(){alert("Right click is disabled !!"); return false;};;
		document.getElementById("InContain").contentWindow.document.onkeydown = function(){alert("Copying of content is not available !!"); return false;};;
		document.getElementById("InContain").contentWindow.document.onkeyup = function(){alert("Copying of content is not available !!"); return false;};;	
		
			

  },
	
	createworddocument:function()
	{
		
		var oApplication=new ActiveXObject("Word.Application");
		oApplication.Visible=true; // "Visible" is in the Word Object Model

		

		

	oApplication.Quit();
	
	},

	_plotRating: function () {			
		if (parseInt(knowledgereadandedit.objRatings.numOfRatings) > 0)
		{
			for (var i = 0; i <= 5; i++) 
			{
				if (knowledgereadandedit.objRatings.ratings[i])
				{
					$("#"+(i + 1)+"stardata").html(knowledgereadandedit.objRatings.ratings[i].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
					ratingpercentage = (parseInt(knowledgereadandedit.objRatings.ratings[i]) * 100 / parseInt(knowledgereadandedit.objRatings.numOfRatings)).toFixed(2);
					$("#"+(i + 1)+"stardata").css("width", ratingpercentage+"%");
				}
				else
				{
					knowledgereadandedit.objRatings.ratings[i] = "";
					$("#"+(i + 1)+"stardata").html(knowledgereadandedit.objRatings.ratings[i].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
					ratingpercentage = (parseInt(knowledgereadandedit.objRatings.ratings[i]) * 100 / parseInt(knowledgereadandedit.objRatings.numOfRatings)).toFixed(2);
					$("#"+(i + 1)+"stardata").css("width", ratingpercentage+"%");
				}	
			}
		 
			$(".avgrating-total").html('<span class="glyphicon glyphicon-user"></span> '+knowledgereadandedit.objRatings.numOfRatings.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+" total");
			 
			$(".avgrating").html(knowledgereadandedit.objRatings.avgRating);		    
		}
		else
		{
			$(".avgrating").html("Not Rated.");
			for (var i = 1; i <= 5; i++) 
			{
				$("#"+i+"stardata").html("");
			}		
			$(".avgrating-total").html("");
		}		   
	},
	_generateRatingData: function(readFromStorage = true) 
	{
		knowledgereadandedit.objRatings.ratings = [];
		knowledgereadandedit.objRatings.numOfRatings = "";
		knowledgereadandedit.objRatings.avgRating = "";
		
		var ratingData = knowledgereadandedit.arrComments;
		
		if (readFromStorage)
			ratingData = knowledgereadandedit.sKnowledge.doc_details["usersReview"];
		
		var total = 0;
		if (ratingData)
		{
			for(var i = 0; i < ratingData.length; i++)
			{				
				var lastVal = ((knowledgereadandedit.objRatings.ratings[(ratingData[i].userRating) - 1]))  
								? knowledgereadandedit.objRatings.ratings[(ratingData[i].userRating - 1)] 
								: 0;
				lastVal++;
				knowledgereadandedit.objRatings.ratings[(ratingData[i].userRating) - 1] = 	lastVal.toString();
				total = total + parseInt(ratingData[i].userRating);
			}
			knowledgereadandedit.objRatings.numOfRatings = ratingData.length.toString();
			knowledgereadandedit.objRatings.avgRating = (total / ratingData.length).toFixed(2).toString();
		}		
	},
	_populateCommentsData:function(readFromStorage = true){
		if (readFromStorage)
			knowledgereadandedit.arrComments = knowledgereadandedit.sKnowledge.doc_details["usersReview"];
		
		if (knowledgereadandedit.arrComments)
		{	
			if (knowledgereadandedit.arrComments.length > 0)
			{
				var isCurrentUser = false;
				for(i = (knowledgereadandedit.arrComments.length - 1); i >= 0; i--)
				{
					var comment = $("<div><div class='user-icon-container'><i class='glyphicon glyphicon-user'></i></div><div style='float:left;min-height:70px;max-width: 85%; word-wrap:break-word;'><div style='min-height:35px; padding-top:10px;'><span>"+knowledgereadandedit.arrComments[i].userName+"</span> <span class='dot'></span> <span>"+knowledgereadandedit.arrComments[i].dataAndTime+"</span>  <div class='dynamic-rating' style='display:inline-block'><div class='' id='defaultcustomerStarRating'><input type='text' class='kv-gly-star rating-loading' data-show-clear='false' data-show-caption='false' value="+knowledgereadandedit.arrComments[i].userRating+" data-size='xxs' data-min='0' data-max='5' data-step='1'></div></div></div>     <div style='min-height:35px;max-width:98%;'><span>"+knowledgereadandedit.arrComments[i].description+"</span></div></div></div>");
					if(knowledgereadandedit.arrComments[i].userName === knowledgereadandedit.currentUser)
					{	
						isCurrentUser = true;
						$("#ratingCommentsContainer .current-user-comment-wrapper").show();
						$("#ratingCommentsContainer .rating-comments-holder .edit-comment.btn.blue").remove();
						$("label.comment-heading").show().empty().text("My Ratings and Comments").append("<button class='edit-comment btn btn-circle btn-icon-only btn-default pull-right' value='edit' onclick='knowledgereadandedit._updateComment(this)'><i class='fa fa-edit'></i></button>");	
						$("#page_knowledgereadandedit .current-user-comment-wrapper").css("border-bottom","1px solid #eeeeee").append(comment);
						knowledgereadandedit.userStarRatingNumber = knowledgereadandedit.arrComments[i].userRating;
					}
					else 
					{						
						$("#page_knowledgereadandedit #comment_wrapper>div").append(comment);						
					}			
				}
				if (!isCurrentUser)
					$("#ratingCommentsContainer .rating-comments-holder").prepend("<button class='edit-comment btn blue' value='newreview' style='position:absolute; right:25px;' onclick='knowledgereadandedit._updateComment(this)'>Write a review</button>");	
			}
			else
			{
				$("#page_knowledgereadandedit .current-user-comment-wrapper").hide();
				$("#ratingCommentsContainer .rating-comments-holder").prepend("<button class='edit-comment btn blue' value='newreview' style='position:absolute; right:25px;' onclick='knowledgereadandedit._updateComment(this)'>Write a review</button>");
			}
			knowledgereadandedit._initStarEvents();
		}
		else
		{
			knowledgereadandedit.arrComments = [];
			$("#comment_wrapper>div,.current-user-comment-wrapper>div").empty();
			$("#page_knowledgereadandedit .current-user-comment-wrapper").hide();
			$("label.comment-heading").empty();
			$("#ratingCommentsContainer .rating-comments-holder").prepend("<button class='edit-comment btn blue' value='newreview' style='position:absolute; right:25px;' onclick='knowledgereadandedit._updateComment(this)'>Write a review</button>");						
		}
	},
	_updateComment:function(){
	
		$("#knowledgeReadandEditModal .rating-container").empty();
		$("#knowledgeReadandEditModal").modal('show');
		$("#knowledgeReadandEditModal div.popup-wrapper textarea.description-container").val('');
		userRating = 0;	 
		if($(".edit-comment").val() == "newreview"){	
			$('.popup-title').html("New Review");		
			var dynamicRatingcomp = '<div id="customerStarRating"><input type="text" class="kv-gly-star rating-loading" data-show-clear="false" data-show-caption="false" value="0" data-size="xs" data-min="0" data-max="5" data-step="1"></div>';
		}
		else
		{
			$('.popup-title').html("Edit Review");
			currentUserIndex = knowledgereadandedit._getUserIndex(knowledgereadandedit.currentUser);
			$("div.popup-wrapper textarea.description-container").val(knowledgereadandedit.arrComments[currentUserIndex].description);
			userRating = knowledgereadandedit.arrComments[currentUserIndex].userRating;
			var dynamicRatingcomp = '<div id="customerStarRating"><input type="text" class="kv-gly-star rating-loading" data-show-clear="false" data-show-caption="false" value="'+knowledgereadandedit.userStarRatingNumber+'" data-size="xs" data-min="0" data-max="5" data-step="1"></div>';					
		}
		$("#knowledgeReadandEditModal .rating-container").append(dynamicRatingcomp);		
		knowledgereadandedit._initStarEvents();
	},
	
	_initStarEvents: function(){
		$('.kv-gly-star').rating({
			containerClass: 'is-star'
		});		
		$('#knowledgeReadandEditModal .rating-container .kv-gly-star').on('change', function () {
			knowledgereadandedit.userStarRatingNumber = parseInt($(this).val());
			
		});
	
	},
	_getCurrentMonth: function(pMonth = -1){
		var mmm = "";
		var month = new Array();
		
	    month[0] = "Jan";
	    month[1] = "Feb";
	    month[2] = "Mar";
	    month[3] = "Apr";
	    month[4] = "May";
	    month[5] = "Jun";
	    month[6] = "Jul";
	    month[7] = "Aug ";
	    month[8] = "Sep";
	    month[9] = "Oct";
	    month[10] = "Nov";
	    month[11] = "Dec";
	    var d = new Date();
		if (pMonth == -1)
			mmm = month[d.getMonth()];
		else
			mmm = month[pMonth];
	    return mmm;
	},

		
	// JQuery File Uploader configuration
handleImages: function() {
	
   $('#knowledgeAssetsContainer #filesAssetContainer').on('click', '.added-files .remove', function(e){
		var eleIndex = $(e.target).parent().parent().index();
		knowledgereadandedit.arrKnowledgeAssets.splice(eleIndex, 1);						
		$(this).parent().parent('.added-files').remove();        
	});		
		
			
		$("#page_knowledgereadandedit .action-edit-view-container #addAssetsCoantainer").show();
			
		
         var  url1 = "http://"+iseConstants.serverHost+":"+window.location.port+"/DevTest/FileServer/upload?documentId="+knowledgereadandedit.documentId+"&authToken="+localStorage.authtoken;//To Do
         
           var count = 0;
          knowledgereadandedit.fileUploader =  $("#addFilesBtn").uploadFile({
                url: url1,
                dragDrop: false,
                showDelete: false,
                fileName: "myfile",
                maxFileSize: (iseConstants.maxFileSize * 1048576),
                showFileCounter: false,
				showFileSize :true,
				showError:false,
				showWarnings:false,
				uploadStr :"<i class='fa fa-plus' style='cursor:pointer;'></i> ADD FILES",
				multiple:true,
				allowedTypes: "jpg,gif,png,bmp,doc,xls,pdf,csv, ppt,docx,xlsx,pptx,txt,msg,webm,ogv,mp4",
				autoSubmit:false,
				
				onSelect:function(files)
				{
				 
				  	knowledgereadandedit._checkFileDuplication(files);	
                    var _validFileExtensions = [".jpg",".gif",".png",".bmp",".doc",".xls",".pdf",".csv", ".ppt",".docx",".xlsx",".pptx",".txt",".msg",".webm",".ogv",".mp4"];  					
				    for(var i= 0; i<files.length; i++)
					{
					    var fileExtension = files[i].name.substr(files[i].name.lastIndexOf('.'));
					    if(knowledgereadandedit._validateExtensions(_validFileExtensions,fileExtension))
						{
						
							$('#filesAssetContainer').append('<div class="col-md-12 list-element file-holder alert alert-warning added-files" id="uploaded_file_' + files[i].name  + '"><div class="col-md-6"><span>' + files[i].name + '(' + (parseFloat(files[i].size)/(1024*1024)).toFixed(2) + 'MB'+')</span> <span class="status label label-info"></span></div>&nbsp;<div class="col-md-4 pull-right"><a href="javascript:;" class="remove pull-right btn btn-sm red"><i class="fa fa-times"></i> remove </a></div></div>');
							knowledgereadandedit.containsAttachments = true;
							
							var objFile = new Object();
							objFile.assetType = "File";
							objFile.assetName = files[i].name;
							objFile.fileType = 	files[i].type;
							objFile.modifiedDate = files[i].lastModifiedDate;
							objFile.fileSize = (parseFloat(files[i].size)/(1024*1024)).toFixed(2);
							
							var index = knowledgereadandedit._getAssetIndex(objFile);
							if(index != -1)                                                	
								knowledgereadandedit.arrKnowledgeAssets[index] = objFile;							
							else
								knowledgereadandedit.arrKnowledgeAssets.push(objFile); 
								
							
							
							if (knowledgereadandedit.enableEdit)
							knowledgereadandedit.initRenderKnowledgeAssetsList(false);
								

                       }
						else
						{
							$('#uploaded_file_' + files[i].name + ' > .status').removeClass("label-info").addClass("label-danger").html('<i class="fa fa-warning"></i> Failed'); // set failed upload
							 Metronic.alert({type: 'danger', message: 'Not a valid extension.', closeInSeconds: 10, icon: 'warning'});
							 ISEUtils.portletUnblocking("pageContainer");
						}					   
						 
					}
				  //Hide inbuilt container	
				  $(".ajax-file-upload-container").hide();
				  return true; //to allow file submission.
				},
				
				onSuccess: function (files, data, xhr, pd) {
				  
                     pd.statusbar.hide(); // hide auto progress bar
					    if (data.trim() == "File uploaded successfully !!!")  {
							$('#uploaded_file_' + files[0] + ' > .status').removeClass("label-info").addClass("label-success").html('<i class="fa fa-check"></i> Done'); // set successfull upload
							//Bug 3469 starts
							knowledgereadandedit._createIndexInElasticSearch(files[0], "");
							//Bug 3469 ends
						} else {
							$('#uploaded_file_' + files[0] + ' > .status').removeClass("label-info").addClass("label-danger").html('<i class="fa fa-warning"></i> Failed'); // set failed upload
							Metronic.alert({type: 'danger', message: 'One of uploads failed. Please retry.', closeInSeconds: 10, icon: 'warning'});
							ISEUtils.portletUnblocking("pageContainer");
						}		
					
					 
                },
                afterUploadAll: function (obj) {
                   
                },
				onError: function(files,status,errMsg,pd)
				{
				
		
				  Metronic.alert({type: 'danger', message: errMsg, closeInSeconds: 10, icon: 'warning'});
				  ISEUtils.portletUnblocking("pageContainer");
				}
						   
            });// finish
         
              
       
    },
	_validateExtensions: function(_arrvalidFileExtensions,fileName)
	{
	var result = false;
		for(var i=0; i<_arrvalidFileExtensions.length; i++){
		  if(fileName.toLowerCase() == _arrvalidFileExtensions[i]){
			  result = true;
			  break;
			  
		  }
		  else
		    result = false;
	  }
	 return result;
	},
    _checkFileDuplication : function(files)
    {
        fileNames = files;           
        var filterstring ='';
        for(var i = 0; i< files.length;i++)
        {
        
			filterstring = (filterstring == '') 
			? "assetName" + " : \"" + files[i].name + "\"" 
			: filterstring + " OR " + "assetName" + " : \"" + files[i].name + "\"" ;  												

        }
        knowledgereadandedit.searchObj.type = "context";
        knowledgereadandedit.searchObj.input = filterstring; 
        knowledgereadandedit.searchObj.lastSearch = Date.now();

        var requestObject = new Object();
        requestObject.title =knowledgereadandedit.searchObj.input.replace(/\//g, " ");
        requestObject.searchString = requestObject.title;
        requestObject.filterString =requestObject.searchString;
        requestObject.maxResults = knowledgereadandedit.requestSearchCount;
        requestObject.serachType = "similar";
        requestObject.collectionName = iseConstants.str_docs_collection;

        ISE.getSearchResults(requestObject, knowledgereadandedit._receivedSearchResultsForFileDuplication);   
                 
    },
    _receivedSearchResultsForFileDuplication: function(data)
    {
        var message = '';
        if(data)
        {
          
            for(var count=0; count< fileNames.length;count++)

            {
               var name = fileNames[count].name ;
               
                for(var i=0; i< data.length;i++)
                {
                  var  arr = jQuery.grep(data[i].knowledgeAssets, function( a ) {
                    return a.assetName == name;
                    });
                    
                    if(arr && arr.length>0)
                    {
                      message = message + "\t. File " + name + " already exists with - " + data[i].title + "\n";
                    }
          
                }
            }
                 
        }
        if(message.length>0)
         {
         //alert(message);
          alert("File(s) is/are already available with knowledge store!!");
         }
    },

		
	_getAssetIndex: function(assetObject)
	{
		if (knowledgereadandedit.arrKnowledgeAssets)
		{
			for (var i = 0; i < knowledgereadandedit.arrKnowledgeAssets.length; i++)
			{
				if (knowledgereadandedit.arrKnowledgeAssets[i].assetType === assetObject.assetType)
				{
					if (knowledgereadandedit.arrKnowledgeAssets[i].assetName === assetObject.assetName)
					{
						if (knowledgereadandedit.arrKnowledgeAssets[i].assetType === "File")
						{
							if (knowledgereadandedit.arrKnowledgeAssets[i].fileType === assetObject.fileType)
							{
								return i;
							}								
						}
						else if (knowledgereadandedit.arrKnowledgeAssets[i].assetType === "Graph")
						{
							if (knowledgereadandedit.arrKnowledgeAssets[i].graphType === assetObject.graphType)
							{
								return i;
							}								
						}
						else
						{							
							return i;
						}
					}					                        
				}				
			}
		}
		else
			knowledgereadandedit.arrKnowledgeAssets = [];
			
		return -1;
	},
	
	//Shail code :History Data 
	getHistoryData:function(_id)
	{
		var requestObject = new Object();
			
			requestObject.searchString = "documentid:" +  _id;
			requestObject.maxResults = 1000;
			requestObject.serachType = "similar";

			var collectionName = "knowledge_history_collection";
			requestObject.collectionName = collectionName;
			ISE.getSearchResults(requestObject, knowledgereadandedit._renderHistoryDataTable); 
		
	},
	
		_renderHistoryDataTable: function(dataObj) {
	
		var tableID = '#page_knowledgereadandedit #historyRatingCommentsContainer #changehistoryDataTable';
		
		if(dataObj.length==0)
		{
			var oTable = $(tableID).dataTable();
			oTable.fnClearTable();
			oTable.fnDestroy();
			return;
		}	
		
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
            {data: "modified"},
			{data: "modifiedby"},
			{data: "noofattachments"},
            {data: "status"},
			{data: "comments"}
            ]
			});
		}
		
	},
	
	onLoadLeftTableComponent:function(eventCaller){
		$.ajax({
			url: "tablecomponent.html",
			type: 'HEAD',
			error: function() {
			   console.log("Error");
			},
			success: function() {
			
				$('#addVisualizationModalContainer .modal-body .table-container').load("tablecomponent.html", function() {
					var jsfilename = "js/subpages/tablecomponent.js";
						 

					$.getScript("js/subpages/tablecomponent.js").done(function() {
						knowledgereadandedit.leftTableTableComponentRef	= tablecomponent;
						tablecomponent._setTabelIDParentConatiner("addVisualizationModalContainer");
						tablecomponent._setModalRefContainer(knowledgereadandedit.addVisualizationPreviewCompModalID);
						tablecomponent._setIsAddPreviewButtonToTable(true);
						tablecomponent._setAllowEditKnowledge(true);
						if (eventCaller === "Visualization")
							tablecomponent._setTableJSON(knowledgereadandedit.tableJsonVisualizationFileName);
						else
							tablecomponent._setTableJSON(knowledgereadandedit.tableJsonDashboardFileName);													
						tablecomponent._setIsAddEllipsis(true);
						tablecomponent._setdataTableID(knowledgereadandedit.knwldgAddCompTable);
						tablecomponent.init();						
					}).fail(function() {
						console.log("Some problem in scripts");
					});
				});
			}
		});
	},
	
	onLoadRightTableComponent:function(eventCaller){
		$.ajax({
			url: "tablerigtcomponent.html",
			type: 'HEAD',
			error: function() {
			   console.log("Error");
			},
			success: function() {
			
				$('#addVisualizationModalContainer .modal-body .visualization-seleted-container .table-right-container').load("tablerigtcomponent.html", function() {
					var jsfilename = "js/subpages/tablerigtcomponent.js";
						 

					$.getScript("js/subpages/tablerigtcomponent.js").done(function() {
                        tablerigtcomponent._setisAddFilterButtonToTable(true);
						tablerigtcomponent._setTabelIDParentConatiner("addVisualizationModalContainer");	
						if (eventCaller === "Visualization")
							tablerigtcomponent._setTableJSON(knowledgereadandedit.tableJsonVisualizationFileName);
						else
							tablerigtcomponent._setTableJSON(knowledgereadandedit.tableJsonDashboardFileName);
                                                tablerigtcomponent._setModalRefContainer(knowledgereadandedit.addVisualizationFilterCompModalID);
						tablerigtcomponent._setisColumnsShow(false);
						tablerigtcomponent._setdataTableID(knowledgereadandedit.knwldgAddCompRightTable);
						tablerigtcomponent.init();
					}).fail(function() {
						console.log("Some problem in scripts");
					});
				});
			}
		});
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


				$('#page_knowledgereadandedit .page-toolbar').load("actions.html", function() {

					$.getScript("js/subpages/actions.js")
						.done(function() {
							knowledgereadandedit.actionsRef = actions;
							actions._setCurrentPage(ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
							actions._setTargetPage(ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
							actions.init();
							knowledgereadandedit._AddCustomEventsForActions();
						})
						.fail(function() {
							console.log("Some problem in scripts")
						});


				});
			}
		});

	},
	
	_getDocDetails: function(docId)
	{		
		var requestObject = new Object();
		requestObject.title = "";
		requestObject.searchString = "_id:" + docId;
		requestObject.maxResults = 1;
		requestObject.serachType = "similar";				
		requestObject.collectionName = "kb_docs_collection";
		knowledgereadandedit.isContentLoaded = false;
		ISE.getSearchResults(requestObject, knowledgereadandedit._receivedSearchResults);		
	},
	
	_receivedSearchResults: function(dataObj) 
	{
		if (ISEUtils.validateObject(dataObj)) 
		{
			if (!knowledgereadandedit.isContentLoaded)		//API getting called multiple time, disturbing the UI
			{
			knowledgereadandedit.sKnowledge.doc_details = dataObj[0];
				
			if(!knowledgereadandedit._getKnowledgeAccessLevel() || knowledgereadandedit.sKnowledge.doc_type == 'knowledgeView')
				knowledgereadandedit.editFormControlers(true, 'view', knowledgereadandedit.sKnowledge.doc_details);
			else 
				knowledgereadandedit.editFormControlers(true, 'edit', knowledgereadandedit.sKnowledge.doc_details);
					
				knowledgereadandedit.getHistoryData(knowledgereadandedit.sKnowledge.doc_details._id);
				knowledgereadandedit.isContentLoaded = true;
			}
		}
		else
		{
			knowledgereadandedit.sKnowledge = null;
			knowledgereadandedit.editFormControlers(false, 'new');
		}
	},
	
	_getUserIndex: function(userName)
	{
		if (knowledgereadandedit.arrComments)
		{
			for (var i = 0; i < knowledgereadandedit.arrComments.length; i++)
			{
				if (knowledgereadandedit.arrComments[i].userName === userName)
					return i;					
			}
		}
		return -1;
	},
	
	_getIndex: function(_array, id)
	{
		if (_array)
		{
			for (var i = 0; i < _array.length; i++)
			{
				if (_array[i]._id === id)
					return i;					
			}
		}
		return -1;
	},
		
	_saveKnowledgeDetails:function(){
	 	//Bug 3469 starts	 				
		if (knowledgereadandedit._isValidRecord())
		{
			ISEUtils.portletBlocking("pageContainer");
			if($('#chkMultiLingual').is(":checked"))
			{
				var nonEnTitle = $("#page_knowledgereadandedit .action-edit-view-container #knowledge_title").val().trim();
				knowledgereadandedit.translatedTitle = knowledgereadandedit._convertTextToEnglish(nonEnTitle);
				var nonEnDesc = $('#page_knowledgereadandedit #knowledge_new_edit_description').summernote('code').replace(/<\/?[^>]+(>|$)/g, "").trim();
				knowledgereadandedit.translatedDesc = knowledgereadandedit._convertTextToEnglish(nonEnDesc);
				knowledgereadandedit._saveRecord();	
			}
			else
			knowledgereadandedit._saveRecord();							
		}
		//Bug 3469 ends
    },
	 		 
	_convertTextToEnglish:function(pTextToConvert)
	{
		var textToConvert = pTextToConvert.replace(/ /g, "+").replace(/\n/g, "");
		var retVal = "";
		$.ajax({
                 url: 'https://translate.googleapis.com/translate_a/single?',
                 dataType: 'json',
				 async : false,
                 data: {
                     q: textToConvert,
                     oe :'UTF-8',
                     tl: 'en',
                     client: 'gtx',
                     sl:'auto',
                     dt:'t'
                   },
                 success: function (result) {
                     //debugger;
                     retVal = result[0][0][0].toString().replace(/\+/g, "").trim();
                 },
                 error: function (XMLHttpRequest, errorMsg, errorThrown) {
                     retVal = errorMsg;
                 }
             });
		
		return retVal;
	},
	 		 
	//Bug 3469 starts
	_isValidRecord: function()
	{
		var title = $("#page_knowledgereadandedit .action-edit-view-container #knowledge_title").val().trim();
		var description = $('#page_knowledgereadandedit #knowledge_new_edit_description').summernote('code').trim();
		
		if (!title || title.trim() === "" || undefined === title || 'undefined' === title)
		{
			alert("Knowledge title can not be left blank.");
			return false;
		}
		
		if (!description || description.trim() === "" || undefined === description || 'undefined' === description)
		{
			alert("Knowledge description can not be left blank.");
			return false;
		}
		
		return true;
	},

	_getKnowledgeMetaData:function(pObjSave)
	{
		for (var data in knowledgereadandedit.othersDataObj)
		{
			pObjSave[data] = knowledgereadandedit.othersDataObj[data];
		}
	},

	_saveRecord: function()
		{
				var savedValues = new Object();		
			savedValues.title = $("#page_knowledgereadandedit .action-edit-view-container #knowledge_title").val().trim();
			if (!knowledgereadandedit.enableEdit && knowledgereadandedit.sKnowledge)
				savedValues.description = knowledgereadandedit.strKnowledgeDesc.trim();
			else
			savedValues.description = $('#page_knowledgereadandedit #knowledge_new_edit_description').summernote('code').trim();		
			savedValues.knowledgeAssets = knowledgereadandedit.arrKnowledgeAssets;
			//new object for dynamic UI.
			knowledgereadandedit._getKnowledgeMetaData(savedValues);
			savedValues.Reviewer_Name  = $("#dds_Reviewer").val();
			savedValues.Security_Level = $("#dds_securitylevel option:selected").text();
			savedValues.Security_LevelValue = $("#dds_securitylevel").val();
						
		switch (savedValues.Security_Level)
		{
			case "Public":
				savedValues.projectName = "iPublicDocs";
			break;
			case "Organisation":
			case "Project":
			default :
				savedValues.projectName = (savedValues.Security_LevelValue == null) 												
												? localStorage.getItem('multiProjectName')
												: savedValues.Security_LevelValue;
			break;			
		}
		
		knowledgereadandedit.projectName = savedValues.projectName;
		
					
			if($('#page_knowledgereadandedit #chksmartfaq').is(":checked"))
			{
				savedValues.isFaq = true;
			}
			else 
			{
				savedValues.isFaq = false;
			}
			
			if(savedValues.isFaq)
			{
				savedValues.arrSmartFaqs=knowledgereadandedit.arrSmartFaqs;
			}
			else 
			{
			savedValues.arrSmartFaqs=[];
			}
						
			savedValues.documents=[];
			savedValues.isindexed=[];
			savedValues.OCRTEXT=[];
			
			if(savedValues.Security_Level.length==0)
		{
			savedValues.Security_Level='Project';
			savedValues.Security_LevelValue = localStorage.getItem('multiProjectName');
		}
						
			if($('#chkstatus').is(":checked"))
			{
				knowledgereadandedit.valStatus = "Reviewed";
			}
		
			savedValues.Status_Name = knowledgereadandedit.valStatus;
			if (!knowledgereadandedit.enableEdit && knowledgereadandedit.sKnowledge)
				savedValues.Review_Comments = knowledgereadandedit.strReviewComments.trim();
			else
			savedValues.Review_Comments = $('#page_knowledgereadandedit #knowledge_reviewer_comments').summernote('code').trim();
			savedValues.usersReview = knowledgereadandedit.arrComments;
			savedValues.tags = knowledgereadandedit.arrTags;
			savedValues.avgRating = (knowledgereadandedit.objRatings.avgRating == undefined 
										|| knowledgereadandedit.objRatings.avgRating == "undefined" 
										|| knowledgereadandedit.objRatings.avgRating == "NaN") 
									? "0" 
									: knowledgereadandedit.objRatings.avgRating;
						
		        if($('#chkMultiLingual').is(":checked"))
		        {
			      savedValues.isNonEnglish = true;
			      savedValues.translatedTitle = knowledgereadandedit.translatedTitle;
			      savedValues.translatedDesc = knowledgereadandedit.translatedDesc;
		        }
		        else
		        {
			      savedValues.isNonEnglish = false;
		        }
		
			if (knowledgereadandedit.sKnowledge !== null)
			{
			if (knowledgereadandedit.sKnowledge.doc_details.Security_Level == savedValues.Security_Level)
			{		
				if (knowledgereadandedit.sKnowledge.doc_id && knowledgereadandedit.sKnowledge.doc_id !== "")
				{
				        savedValues._id = knowledgereadandedit.documentId;
					savedValues.user = knowledgereadandedit.sKnowledge.doc_details.user;
					ISE.UpdateDocEntryMongo(savedValues, knowledgereadandedit._updateDocEntryMongoCallback);				
				}	
			}
			else
			{
				knowledgereadandedit._updateKnowledgeSecurity(knowledgereadandedit.sKnowledge.doc_id, 
																knowledgereadandedit.sKnowledge.doc_details.Security_Level,
																knowledgereadandedit.sKnowledge.doc_details.Security_LevelValue);
				savedValues._id = knowledgereadandedit.documentId;
				ISE.UpdateDocEntryMongo(savedValues, knowledgereadandedit._createDocEntryMongoCallback);
			}	
		}
		else
		{
			        savedValues._id = knowledgereadandedit.documentId;
				ISE.UpdateDocEntryMongo(savedValues, knowledgereadandedit._createDocEntryMongoCallback);				
			}
			
			knowledgereadandedit._createIndexForPreviousAssets();

			knowledgereadandedit._createIndexForUrls();	
		
			//History Saving code..
			var today = new Date();
			var dd = today.getDate(); 
			var mm = today.getMonth()+1; 
			var yyyy = today.getFullYear(); 
			if(dd<10)
			{
				dd='0'+dd 
            } 
			if(mm<10)
			{ 
				mm='0'+mm 
            } 
            today = dd+'/'+mm+'/'+yyyy; 
			var historyobject = new Object();
			
			var _id = (Math.floor( Math.random() * 1000 ) + Date.now()).toString();
			
			historyobject._id = _id;
			historyobject.documentid = savedValues._id;
			historyobject.modified = today;
			historyobject.modifiedby = localStorage.getItem('username');
			historyobject.noofattachments = knowledgereadandedit.arrKnowledgeAssets.length;
			historyobject.comments = savedValues.Review_Comments;
			historyobject.status =  savedValues.Status_Name;
			
			ISE.UpdateKnowledgeHistoryMongo(historyobject,knowledgereadandedit._HistoryResultHandler);
			//History Saving code..
		
		if(knowledgereadandedit.containsAttachments) 
			//knowledgereadandedit.fileUploader.start();
			knowledgereadandedit.fileUploader.startUpload();
			
			console.log(" knowledgereadandedit._createOrRenameDocument uniqueID =================  "+ savedValues._id);				
    },
	
	_updateKnowledgeSecurity: function(pKnowledgeId, pPreviousSecurityLevel, pPrvSecuityValue)
	{
		var projectName;
		var knowledgeId = pKnowledgeId;
		switch (pPreviousSecurityLevel)
		{
			case "Public":
				projectName = "iPublicDocs";
			break;
			case "Organisation":				
			case "Project":
			default :
				projectName = pPrvSecuityValue;
			break;			
		}
		
		knowledgereadandedit._deleteKnowledgeDoc(knowledgeId, projectName);
	},
	
	_deleteKnowledgeDoc: function(pKnowledgeId, pProjectName)
	{
		var knowledgeID = pKnowledgeId;          	
	 	var param =[];
		param[0]="PARAM1="+knowledgeID;
		var prjName = new Object();
		prjName.projectName = pProjectName;
		
		var data = '{"fileName":"delete_knowledgedocs","params":"'+param+'","projectName":"' + pProjectName + '", "object":' + JSON.stringify(prjName) + ',"fromCache":"false"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken, data, knowledgereadandedit._HistoryResultHandler);	
	},
		
	_HistoryResultHandler: function(data_obj){
		
	},
	
	_createIndexForUrls: function()
	{
		for(var i=0;i < knowledgereadandedit.arrKnowledgeAssets.length;i++)
		{
			var indexFlag = false;
			if (knowledgereadandedit.arrKnowledgeAssets[i].assetType === "Url")
			{
				for (var j = 0; j < knowledgereadandedit.arrPreviousAssets.length; j++)
				{
					if (knowledgereadandedit.arrPreviousAssets[j].assetType === "Url")
					{
						if (knowledgereadandedit.arrKnowledgeAssets[i].content === knowledgereadandedit.arrPreviousAssets[j].content)
						{
							indexFlag = true;
							break;
						}	
					}
				}
				
				if (!indexFlag)
					knowledgereadandedit._createIndexInElasticSearch(knowledgereadandedit.arrKnowledgeAssets[i].content, 
																		knowledgereadandedit.arrKnowledgeAssets[i].assetType);
			}					
		}
	},
	
	_createIndexForPreviousAssets:function()
	{
		if (knowledgereadandedit.arrPreviousAssets)
		{
			for (var i = 0; i < knowledgereadandedit.arrPreviousAssets.length; i++)
			{
				if (knowledgereadandedit.arrPreviousAssets[i].assetType === "File")
				{						
					knowledgereadandedit._createIndexInElasticSearch(knowledgereadandedit.arrPreviousAssets[i].assetName, 
																		knowledgereadandedit.arrPreviousAssets[i].fileType);
				}				
				if (knowledgereadandedit.arrPreviousAssets[i].assetType === "Url")
				{
					knowledgereadandedit._createIndexInElasticSearch(knowledgereadandedit.arrPreviousAssets[i].content, 
																		knowledgereadandedit.arrPreviousAssets[i].assetType);
				}
			}
		}
	},
	
	//Bug 3469 ends
		
	_updateDocEntryMongoCallback: function() 
	{								
		toastr.success('Knowledge has been updated successfully !!', 'Success');                  
		ISEUtils.portletUnblocking("pageContainer");
		if(knowledgereadandedit.sKnowledge)
			$(location).attr('hash',knowledgereadandedit.sKnowledge.current_page_name);
		else
			window.history.back();						
	},
	
	_createDocEntryMongoCallback: function()
	{
		toastr.success('New knowledge has been added successfully !!', 'Success');                    
		ISEUtils.portletUnblocking("pageContainer");	
		if(knowledgereadandedit.sKnowledge)
			$(location).attr('hash',knowledgereadandedit.sKnowledge.current_page_name);
		else if (window.history.state !== null)
			window.history.back();
		else
			$(location).attr('hash','#knowledgestore');	
	},
				
	_createDocEntryMongofortextEditor: function()
	{
	
			var newURL = window.location.protocol + "//" + window.location.host;
			
			newURL = newURL + window.location.pathname + "?doc_id=" + knowledgereadandedit.NewdocumentId + "#knowledgereadandedit";
			
			var __knowledgeDocData = new Object();
			__knowledgeDocData.doc_id = knowledgereadandedit.NewdocumentId;
			__knowledgeDocData.doc_title = knowledgereadandedit.NewdocumentTitle;
			__knowledgeDocData.doc_type = 'knowledgeEdit';
			__knowledgeDocData.current_page_name = ikePageConstants.KNOWLEDGE_READ_AND_EDIT;
			
			localStorage.setItem('selectedKnowledgeEditDoc', JSON.stringify(__knowledgeDocData));
			
			//$(location).attr('hash','#knowledgereadandedit');
			
			//history.pushState("test", "test", newURL);
			window.open(newURL);
		
	},
			
	_createIndexInElasticSearch:function(pFileName, pFileType){
	
		console.log("Inside knowledgereadandedit._createIndexInElasticSearch ");
		
		var temp = pFileName.toString().split(".")
		var fileName = pFileName;
		var fileExtension = temp[1];
		var documentId =""+knowledgereadandedit.documentId;
		var doOCR = "false"; if(fileExtension.toString().toLowerCase() == "pdf" || fileExtension.toString().toLowerCase() == "png" || fileExtension.toString().toLowerCase() == "jpg" || fileExtension.toString().toLowerCase() == "bmp") doOCR = "true";
		var parent = ""//knowledgereadandedit.selectedNodePath; //We do not have value for this, Suresh suggested to remove this.
		var published_at = new Date().toISOString();
		var elasticearchHost = iseConstants.elasticsearchHost;
		console.log("elasticearchHost =============== "+ elasticearchHost);
		var collection = iseConstants.str_docs_collection;
		var role = localStorage.getItem('rolename');
		var urlPath = window.location.pathname  + window.location.hash;
		var type = "";
		var url = "";
		var title = ""
		var description = "";
		var documentcontent="";
		 
		var downloadURL = "http://localhost:"+window.location.port+"/DevTest/FileServer/download/" + knowledgereadandedit.documentId + "_" + fileName; //this should not be hard coded get from href path or constants
		if(pFileType=="Url")
		{
			downloadURL = pFileName;
		}
		
		var isNonEnglish = "false"; if($('#chkMultiLingual').is(":checked")) isNonEnglish = "true";
		
		var isAbbyyEnabled = "false"; if(iseConstants.useAbbyy) isAbbyyEnabled = "true"; 
		
		var isConvertDoctoHTMLEnabled = "false"; if(iseConstants.ConvertDocstoHTML) isConvertDoctoHTMLEnabled = "true"; 
				
		var json_Data = { username : localStorage.getItem('username'), documentName: pFileName, fileName : fileName, downloadURL : downloadURL, projectName : knowledgereadandedit.projectName, doOCR : doOCR, documentId : documentId, parent: parent, published_at : published_at, role : role, urlPath : urlPath, collection: collection, elasticearchHost : elasticearchHost, type : type, url : url, title : title, description: description, isNonEnglish: isNonEnglish, isAbbyyEnabled: isAbbyyEnabled,isConvertDoctoHTMLEnabled:isConvertDoctoHTMLEnabled, fileExt: fileExtension};
		var serviceName='JscriptWS'; 
		var methodname = "urlindexing";
		var hostUrl = '/DevTest/rest/';
		var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + knowledgereadandedit.projectName+'&sname='+methodname;
				
		$.ajax({
				type: "POST",
				url: Url,
				async: true,
				data: JSON.stringify(json_Data),
				success: function(msg) {															
					console.log(msg);					
				},
				error: function(msg) {
					 console.log("Failure in knowledgereadandedit.indexUrl().");
				}			
		});					
	},	 	
        
	getKibanaData:function(projectName){
			
		var requestObject = new Object();
		requestObject.projectName = projectName;
		requestObject.collectionName = ".kibana-4";
		
		if (projectName === "visualization")
			ISE.getKibanaData(requestObject, knowledgereadandedit._callBackGetVisualizationData);  
		else	
			ISE.getKibanaData(requestObject, knowledgereadandedit._callBackGetDashboardData);  
	},
	
	_callBackGetVisualizationData: function(data){
	 
		console.log("_callBackGetVisualizationData");
	 
		knowledgereadandedit.arrTotalVisualizations = data;
		
		if (knowledgereadandedit.sKnowledge !== null && knowledgereadandedit.sKnowledge.doc_type === 'knowledgeEdit')
			knowledgereadandedit._renderLiveKnowledge("Visualization");
		else
			knowledgereadandedit._renderLiveKnowledge("Visualization", false);
    },
	
	_callBackGetDashboardData: function(data){
		console.log("_callBackGetDashboardData");
		
		knowledgereadandedit.arrTotalDashboard = data;
		
		if (knowledgereadandedit.sKnowledge !== null && knowledgereadandedit.sKnowledge.doc_type === 'knowledgeEdit')
			knowledgereadandedit._renderLiveKnowledge("Dashboard");
		else
			knowledgereadandedit._renderLiveKnowledge("Dashboard", false);
    },
	/* To handle Window FullScreen */
	onWindowFullScreen:function() {

		var elem = document.body;
		// ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
		if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
			var el = document.documentElement,
				rfs = // for newer Webkit and Firefox
				el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
			if (typeof rfs != "undefined" && rfs) {
				rfs.call(el);
			}
		} else {
			if (document.cancelFullScreen) {
				document.cancelFullScreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		}


}	
};

