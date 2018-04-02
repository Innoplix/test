var actions = {

//Variable Decleration
currentPage:'',
targetPage:'',

    /* Init function  */
    init: function() {
		//debugger;
		var rCurrentpage = (actions.currentPage).replace("#", "#page_")
		$(rCurrentpage+" #actionContainer #addNewContentDoc").live('click', function(){
			debugger;
			var __knowledgeDocData = new Object();
			__knowledgeDocData.doc_type = 'knowledgeCreateNew';
			__knowledgeDocData.current_page_name = actions.targetPage;
			localStorage.setItem('knowledgeCreateNew', JSON.stringify(__knowledgeDocData));
			$(location).attr('hash',ikePageConstants.KNOWLEDGE_READ_AND_EDIT);
			$('#page_knowledgereadandedit').trigger( ikeEventsConstants.ADD_NEW_KNOWLEDGE_DOCUMENT, actions.currentPage); 
		});
		
		$("#actionContainer #docPrint").live('click', function (e) {
			console.log("This is function is for Print Document. TODO");
		});
		$("#actionContainer #exportToPDF").live('click', function (e) {
			console.log("This is function is for Export to PDF. TODO");
		});
		$("#actionContainer #exportToExcel").live('click', function (e) {
			console.log("This is function is for Export to Excel. TODO");
		});
		 
		
    },
	
	_setCurrentPage:function(curr_page){
		actions.currentPage = curr_page;
	},
	_setTargetPage:function(target_page){
		actions.targetPage = target_page;
	},
	
};

