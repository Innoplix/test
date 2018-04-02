var myreviews = {

//Variable Decleration
	userRole:"admin",
	tableJson:'tableDetails',
	tableID:'knwldgMyReviewTable',
	tablecomponentRef:'',
	filterColumnID : 'MRColumnTogglerDropdown',
    allKnowledgeObjects:[],
	actionsRef:'',
	
	reinit:function(){
		myreviews.actionsRef._setCurrentPage(ikePageConstants.MY_REVIEWS);
		myreviews.actionsRef._setTargetPage(ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
		myreviews.loadKnowledgeData();
	},
    /* Init function  */
    init: function() {
		 
		//myreviews._fillDropDownAndCreateDataTableHeading();
		myreviews.onLoadActionComponent();
		myreviews.onLoadTableComponent();
		
		$("#page_myreviews #approveKnowledgeDoc").on('click', function(e){

		  var errorMsg = "Please select atleast one document to approve.";
		  var confirmMsg = "Are you sure you want to approve this Knowledge?";
		  var selectedDocsList = myreviews.tablecomponentRef.getSelectedDocList(confirmMsg, errorMsg,true);
		  $("#page_myreviews #approveKnowledgeDoc, #page_myreviews #rejectKnowledgeDoc").prop('disabled', true);
		  console.log("Seleted Rows : "+JSON.stringify(selectedDocsList))

            var deletedObjects = JSON.parse(selectedDocsList);

            for(var i=0; i< deletedObjects.length; i++)
            {
                var tempobject = deletedObjects[i];
                var documentid =  tempobject;
                var knowledgeItem = $.map(myreviews.allKnowledgeObjects, function(value1, key1) {
                if (value1._id == documentid)
                {
                    return value1;
                }
                });
                knowledgeItem[0].Status_Name ="Reviewed";
                ISE.UpdateDocEntryMongo(knowledgeItem[0],tablecomponent._UpdateKnowledgeBlankHandler);

                //************Knowledge History*************************//
               myreviews._AddKnowledgeHistory(knowledgeItem[0],"Reviewed");


            }
           
             myreviews._ApprovedKnowedgeResultHandler();   



	   });
	   $("#page_myreviews #rejectKnowledgeDoc").on('click', function(e){
		  var removedDocsList =  myreviews.tablecomponentRef.removeDocsFromList();
		  $("#page_myreviews #approveKnowledgeDoc, #page_myreviews #rejectKnowledgeDoc").prop('disabled', true);

           console.log("Seleted Rows : "+JSON.stringify(removedDocsList));

            var deletedObjects = JSON.parse(removedDocsList);

            for(var i=0; i< deletedObjects.length; i++)
            {
                var tempobject = deletedObjects[i];
                var documentid =  tempobject.knowledgeID;
                var knowledgeItem = $.map(myreviews.allKnowledgeObjects, function(value1, key1) {
                if (value1._id == documentid)
                {
                    return value1;
                }
                });
                knowledgeItem[0].Status_Name="Not-Reviewed";

                      
                ISE.UpdateDocEntryMongo(knowledgeItem[0],tablecomponent._UpdateKnowledgeBlankHandler);
                  //************Knowledge History*************************//
               myreviews._AddKnowledgeHistory(knowledgeItem[0],"Not-Reviewed");
            }
           
             myreviews.UpdateKnowedgeResultHandler();   

	   });

       
	    
	   $( '#page_myreviews' ).bind( ikeEventsConstants.ROW_SELECTED,{
		   
	   }, function( event, selectedRows ) {
		   var selected_rows = JSON.parse(selectedRows)
			if(selected_rows.length > 0)
				$("#page_myreviews #approveKnowledgeDoc, #page_myreviews #rejectKnowledgeDoc").prop('disabled', false);
			else
				$("#page_myreviews #approveKnowledgeDoc, #page_myreviews #rejectKnowledgeDoc").prop('disabled', true);
			
			//$('#'+searchcomponent.modalRefContainer+'').modal('hide');
			//searchcomponent._addSearchTextTag(filterData)
		});
		
		$( '#page_myreviews' ).on( ikeEventsConstants.COMPLETED_FILL_TABLE_AND_COLUMN_FILTER,{
	   
			}, function( event ) {
				
			//knowledgestore.columnListDetailsArray =  knowledgestore.tablecomponentRef._getColumnListDetailsArray();
			myreviews.loadKnowledgeData();
			 
		});
	},

      _UpdateKnowledgeBlankHandler: function(){
		  	
		},

      UpdateKnowedgeResultHandler: function(data_obj){
      
       toastr.success('Knowledge has been referred back successfully.', 'Success');			
	},

    _AddKnowledgeHistory : function(inputObject,status)
    {
        var historyobject = new Object();
        var _id = (Math.floor( Math.random() * 1000 ) + Date.now()).toString();
        historyobject._id = _id;
        historyobject.documentid = inputObject._id;
        historyobject.modified = myreviews._getCurrentDate();
        historyobject.modifiedby = localStorage.getItem('username');
        historyobject.noofattachments = inputObject.knowledgeAssets.length;
        historyobject.comments = "";
        historyobject.status =  status;
        ISE.UpdateKnowledgeHistoryMongo(historyobject,myreviews._UpdateKnowledgeBlankHandler);
    },

    _getCurrentDate : function()
    {
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
        
        return today;
    },

      _ApprovedKnowedgeResultHandler: function(data_obj){
//		$.notific8('Knowledge has been approved successfully.', {
//			 life: 2000,
//			 theme: 'lime',
//			 sticky: false,
//			 zindex: 11500
//		});	
       toastr.success('Knowledge has been approved successfully.', 'Success');			
	},
	
	_allowPermission: function(user_role){
		
		switch(user_role){
			case 'manager':
			 
			break;
			case 'admin':
				 
			break;
		}
	},
	
	loadKnowledgeData: function(){
        var currentuser =localStorage.getItem('username');   
        var requestObject = new Object();
        requestObject.collectionName = iseConstants.str_docs_collection;
        //requestObject.searchString = "reviewername : " + currentuser;
        //requestObject.searchString = "status :" + "UnReviewed" + " AND reviewername : " + currentuser;
        requestObject.searchString = "Status_Name :" + "Not-Reviewed" + " AND Reviewer_Name : " + currentuser;
        requestObject.projectName = localStorage.projectName;
        requestObject.maxResults = 999;
        ISE.getSearchResults(requestObject, myreviews._receivedMyReviewsSearchResults);

	},
 _receivedMyReviewsSearchResults: function(dataObj){
     for (var i = 0; i < dataObj.length; i++) {
       myreviews.allKnowledgeObjects.push(dataObj[i]);
       }
	myreviews.tablecomponentRef._receivedSearchResults(dataObj)
 },
 
		onLoadTableComponent:function(){
			$.ajax({
				url: "tablecomponent.html",
				type: 'HEAD',
				error: function() {
				   console.log("Error")
				},
				success: function() {

					$('#page_myreviews .myreview-table-conatainer').load("tablecomponent.html", function() {

						var jsfilename = "js/subpages/tablecomponent.js";
						$.getScript("js/subpages/tablecomponent.js")
						.done(function() {
							tablecomponent._ResetVariables();
                            tablecomponent._setCallingPageName(ikePageConstants.MY_REVIEWS);
							myreviews.tablecomponentRef = tablecomponent;
							tablecomponent._setTabelIDParentConatiner("page_myreviews");
							tablecomponent._setFilterColumnID( myreviews.filterColumnID );
							tablecomponent._setTableJSON(myreviews.tableJson);
							tablecomponent._setdataTableID(myreviews.tableID);
							tablecomponent._setIsAddEllipsis(true);
                            tablecomponent._setAllowEditKnowledge(true);
							tablecomponent.init();
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


				$('#page_myreviews .page-toolbar').load("actions.html", function() {

					$.getScript("js/subpages/actions.js")
						.done(function() {
							myreviews.actionsRef = actions;
							actions._setCurrentPage(ikePageConstants.MY_REVIEWS);
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

