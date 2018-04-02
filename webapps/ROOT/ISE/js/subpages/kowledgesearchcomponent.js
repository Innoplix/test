var kowledgesearchcomponent = {

//Variable Decleration
modalRefContainer:"",
filterJsonFile:"",
moreFilterObj:{}   ,
parentIDContainer:"",
	
    /* Init function  */
    init: function() {
		$('.has-clear input[type="text"]').on('input propertychange', function() {
		  var $this = $(this);
		  var visible = Boolean($this.val());
		  $this.siblings('.form-control-clear').toggleClass('hidden', !visible);
		  if(visible)
		  $("#"+kowledgesearchcomponent.parentIDContainer+" #searchComponent #compSearchKDoc").removeClass('disabled')
		else
		  $("#"+kowledgesearchcomponent.parentIDContainer+" #searchComponent #compSearchKDoc").addClass('disabled')
		}).trigger('propertychange');

		$('.form-control-clear').click(function() {
		  $(this).siblings('input[type="text"]').val('')
			.trigger('propertychange').focus();
		}); 
		$('.has-clear input[type="text"]').keyup(function (e) {
			if (e.keyCode == 13) {				
			}
		});
		
		$("#"+kowledgesearchcomponent.parentIDContainer+" #searchComponent #compSearchDoc").keyup(function(e){
			if (e.keyCode == 13) 
			{				
				$( "#"+kowledgesearchcomponent.parentIDContainer ).trigger( ikeEventsConstants.START_SEARCH,  $('#'+kowledgesearchcomponent.parentIDContainer+' #searchComponent #compSearchDoc').val()	 );
			}		
		});
		$("#"+kowledgesearchcomponent.parentIDContainer+" #searchComponent #compSearchKDoc").on('click', function(){		
			$( "#"+kowledgesearchcomponent.parentIDContainer ).trigger( ikeEventsConstants.START_SEARCH,  $('#'+kowledgesearchcomponent.parentIDContainer+' #searchComponent #compSearchDoc').val()	 ); 
		});
		
		 
		$("#"+kowledgesearchcomponent.parentIDContainer+" #searchComponent #compMoreFilterBtn").on('click', function(){
			$('#'+kowledgesearchcomponent.modalRefContainer+'').modal('show');
			kowledgesearchcomponent.onLoadMoreFilter();
		  
		});
		
		$( document ).on( ikeEventsConstants.SAVE_MORE_FILTER, {
			 
		}, function( event, filterData ) {
			console.log( filterData );
			kowledgesearchcomponent.moreFilterObj = JSON.parse(filterData);
			$('#'+kowledgesearchcomponent.modalRefContainer+'').modal('hide');
			kowledgesearchcomponent._addSearchTextTag();
		}); 
		
    },
	_setModalRefContainer: function(container_ref){
		kowledgesearchcomponent.modalRefContainer = container_ref;
	},
_HideShowMoreFilter: function () {
    $("#compMoreFilterBtn").toggle();
},
	_setfilterJsonFile: function(file_name){
		kowledgesearchcomponent.filterJsonFile = file_name;
	},
	_setParentIDContainer: function(val){
		kowledgesearchcomponent.parentIDContainer = val;
	},
	_getSearchTextValue: function(){
		return $('#'+kowledgesearchcomponent.parentIDContainer+' #searchComponent #compSearchDoc').val();
	},
	
	_addSearchTextTag: function(){
		//var clearAllTag = '<a href="javascript:;" class="btn btn-circle btn-xs default"><i class="fa fa-close"></i> ClEAR ALL </a>'
		$("#"+kowledgesearchcomponent.parentIDContainer+" #searchComponent #filterTagsHolder").empty();
		var clearAllTag = '<button type="button" class="clear-all-filter-tags btn btn-circle btn-sm btn-default"><i class="fa fa-close"></i>  CLEAR ALL </button>'
		 var i = 1;
		for( var gg in kowledgesearchcomponent.moreFilterObj)
		{
			if(kowledgesearchcomponent.moreFilterObj[gg].data)
			{     
				for(var ff in kowledgesearchcomponent.moreFilterObj[gg].data)
				{
					console.log( ff + " :  "+kowledgesearchcomponent.moreFilterObj[gg].data[ff])
					var attr_name = kowledgesearchcomponent.moreFilterObj[gg].data[ff].filterName;
					var selected_val = kowledgesearchcomponent.moreFilterObj[gg].data[ff].data ? JSON.stringify(kowledgesearchcomponent.moreFilterObj[gg].data[ff].data) : null;
					kowledgesearchcomponent._addFilterTags(i, attr_name, selected_val);
					i++
				}			
			}
			else
			{
				var attr_name = kowledgesearchcomponent.moreFilterObj[gg].filterName;
				var selected_val = kowledgesearchcomponent.moreFilterObj[gg].filterVal ? JSON.stringify(kowledgesearchcomponent.moreFilterObj[gg].filterVal) : null;
				kowledgesearchcomponent._addFilterTags(i, attr_name, selected_val);
				i++
			}			
		} 
		var numbOfTags = $("#"+kowledgesearchcomponent.parentIDContainer+" #searchComponent #filterTagsHolder").children().length
		if(numbOfTags > 0)
			$("#"+kowledgesearchcomponent.parentIDContainer+" #searchComponent #filterTagsHolder").prepend(clearAllTag);
		
		
		 $("#"+kowledgesearchcomponent.parentIDContainer+" #searchComponent .clear-all-filter-tags").on('click', function(){
			$("#"+kowledgesearchcomponent.parentIDContainer+" #searchComponent #filterTagsHolder").empty();
			kowledgesearchcomponent.moreFilterObj = {};
			$( "#"+kowledgesearchcomponent.parentIDContainer ).trigger( ikeEventsConstants.CLEARED_ALL_MORE_FILTER,  kowledgesearchcomponent.moreFilterObj );
		});
	},
	_addFilterTags:function(i, attrname, selectedval){
		var tab_id_val = i;
		if(selectedval){
			$("#searchComponent #filterTagsHolder").append('<span class="tag" fieldName=' + attrname + '  fieldValue="' + selectedval.trim() + '" id=tag_' + tab_id_val + ' style="margin:1px 5px 1px 1px; display: inline-block;"><span>' + attrname + ' : ' + selectedval.trim() + '&nbsp;&nbsp;</span><a  parentID=tag_' + tab_id_val + ' fieldName=' + escape(attrname) + ' fieldValue='+escape(selectedval)+' onClick=kowledgesearchcomponent._removeSearchTagFilter(this) title="Removing tag">x</a></span>');
		}
	},
	_removeSearchTagFilter: function(event) {
		//ISEUtils.portletBlocking("pageContainer");
		var numbOfTags = $("#"+kowledgesearchcomponent.parentIDContainer+" #searchComponent #filterTagsHolder").children().length
		if(numbOfTags > 2){
			var parentID = $(event).attr("parentID");
			var parentfieldName = $(event).attr("fieldname").toString();
			parentfieldName = parentfieldName.replace("%20", " ");
			$("#" + parentID).remove();
			for( var gg in kowledgesearchcomponent.moreFilterObj)
			{
				if(kowledgesearchcomponent.moreFilterObj[gg].data)
				{
					for(var ff in kowledgesearchcomponent.moreFilterObj[gg].data)
					{
						if(parentfieldName == kowledgesearchcomponent.moreFilterObj[gg].data[ff].filterName)
						{
							delete kowledgesearchcomponent.moreFilterObj[gg].data[ff];
							break;
						}
					}
				}
				else
				{					
					for(var gh in kowledgesearchcomponent.moreFilterObj[gg])
					{
						if(parentfieldName == kowledgesearchcomponent.moreFilterObj[gg].filterName)
						{
							delete kowledgesearchcomponent.moreFilterObj[gg];
							break;
						}
					}
				}				
			}
		}else{
			$("#searchComponent #filterTagsHolder").empty();
			kowledgesearchcomponent.moreFilterObj = {};
		}
		$( "#"+kowledgesearchcomponent.parentIDContainer ).trigger( ikeEventsConstants.REMOVED_ONE_MORE_FILTER,  JSON.stringify(kowledgesearchcomponent.moreFilterObj) );
	},
	_getFiltersAsString: function()
	{	
		var filters = '';
        var filtersArr = new Array();

		if (kowledgesearchcomponent.moreFilterObj) 
		{	
			if (kowledgesearchcomponent.moreFilterObj.general)
			{
				for( var filter in kowledgesearchcomponent.moreFilterObj.general.data)
				{
					if (kowledgesearchcomponent.moreFilterObj.general.data[filter].data)
					{
						var filterString = '';
						if (typeof kowledgesearchcomponent.moreFilterObj.general.data[filter].data == "object")
						{
							for (var index in kowledgesearchcomponent.moreFilterObj.general.data[filter].data)
							{
								filterString = (filterString == '') 
												? kowledgesearchcomponent.moreFilterObj.general.data[filter].fieldName + ":" + kowledgesearchcomponent.moreFilterObj.general.data[filter].data[index]
												: filterString + " OR " + kowledgesearchcomponent.moreFilterObj.general.data[filter].fieldName + ":" + kowledgesearchcomponent.moreFilterObj.general.data[filter].data[index];													
							}
						}
						else if (typeof kowledgesearchcomponent.moreFilterObj.general.data[filter].data == "string")
						{
							if (kowledgesearchcomponent.moreFilterObj.general.data[filter].data.includes(" "))
							{
								var value =  kowledgesearchcomponent.moreFilterObj.general.data[filter].data.split(" ") 
								filterString = kowledgesearchcomponent.moreFilterObj.general.data[filter].fieldName + " : >=" + value[0].trim();
							}
							else
								filterString = kowledgesearchcomponent.moreFilterObj.general.data[filter].fieldName + ":" + kowledgesearchcomponent.moreFilterObj.general.data[filter].data;
						}
						
						filtersArr.push(filterString);
					}
				}				
			}						
			if (kowledgesearchcomponent.moreFilterObj.content)
			{
			
			}			
			if (kowledgesearchcomponent.moreFilterObj.time)			
			{
				switch(kowledgesearchcomponent.moreFilterObj.time.filterName)
				{	
					case "Quick Time":					
						var filterValue = "";
						if (kowledgesearchcomponent.moreFilterObj.time.filterVal.includes(" "))
						{
							var tempDate = kowledgesearchcomponent.moreFilterObj.time.filterVal.toLowerCase().split(" ") 
							for (var i = 0; i < tempDate.length; i++)
							{
								filterValue = (filterValue !== "") ? filterValue + "_" + tempDate[i] : tempDate[i];									
							}								
						}
						else
						{
							filterValue = kowledgesearchcomponent.moreFilterObj.time.filterVal.toLowerCase();
						}
						
						var respDate = ISEUtils.getDateTime(filterValue);  
						searchDate= '';
						searchDate = respDate +"  TO * "           
						
						filtersArr.push(kowledgesearchcomponent.moreFilterObj.time.fieldName.trim() + " : [ "+ searchDate + "]");
						
						break;
					case "Date Range":
						
						var startDate = new Date(kowledgesearchcomponent.fromDate);
						startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset()); 
						var endDate = new Date(kowledgesearchcomponent.toDate);
						endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset()); 
						
						var startDateString = startDate.getUTCFullYear() 
												+ "-" + kowledgesearchcomponent._pad(startDate.getUTCMonth() + 1) 
												+ "-" + kowledgesearchcomponent._pad(startDate.getUTCDate()) 
												+ "T" + kowledgesearchcomponent._pad(startDate.getUTCHours()) 
												+ ":" + kowledgesearchcomponent._pad(startDate.getUTCMinutes());
												
						var endDateString = endDate.getUTCFullYear() 
												+ "-" + kowledgesearchcomponent._pad(endDate.getUTCMonth() + 1) 
												+ "-" + kowledgesearchcomponent._pad(endDate.getUTCDate()) 
												+ "T" + kowledgesearchcomponent._pad(endDate.getUTCHours()) 
												+ ":" + kowledgesearchcomponent._pad(endDate.getUTCMinutes());
						
						var searchDate = startDateString + " TO " + endDateString;
						
						filtersArr.push(kowledgesearchcomponent.moreFilterObj.time.fieldName.trim() + " :[ " + searchDate + "]");
											
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
 onLoadMoreFilter:function(){
debugger;
		$.ajax({
		url: "morefilter.html",
		type: 'HEAD',
		error: function() {
		   console.log("Error")
		},
		success: function() {
			// Loading Menu based on Organization and role

			$('#'+kowledgesearchcomponent.modalRefContainer+' .modal-body').load("morefilter.html", function() {

				 var jsfilename = "js/subpages/morefilter.js";
				 
				 $.getScript("js/subpages/morefilter.js")
	.done(function() {
		debugger;
		kowledgesearchcomponent.moreFilterRef = morefilter;
		morefilter._setfilterJSONFileName(kowledgesearchcomponent.filterJsonFile);
		morefilter._setParentRefContainer(kowledgesearchcomponent.modalRefContainer);
		morefilter.init();
	})
	.fail(function() {
		console.log("Some problem in morefilter scripts")
});
				});
				}
	});

	}	
	
};

