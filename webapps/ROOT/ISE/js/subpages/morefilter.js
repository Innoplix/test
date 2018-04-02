var morefilter = {

//Variable Decleration

    fromDate:'',
	toDate:'',
	selectedTime : {},
	moreFilterObj : {},
	timeSelecteValue :"daysContainer",
	storedGeneralTabFilterData:{},
	storedMoreFilterSelection:{},
	filterStarRatingNumber:0,
	parentRefContainer:'',
	filterJSONFileName:'',
	releaseFieldName:'',
	featureFieldName:'',
	streamFieldName:'',
	activitiesFieldName:'',
	StatusFieldName:'',
	technologyFieldName:'',
	
	
    /* Init function  */
    init: function() {
		
		//date picker
		if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                orientation: "left",
                autoclose: true
            }); 
		}
		morefilter._renameAllTabNavLiIDs();
		morefilter._renameAllTabContentIDs();
		morefilter.getMoreFilterJsonInfo();
		$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #page_morefilter #fromDate').change(function() {
			morefilter.fromDate = $(this).val();
			
		});
		$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #page_morefilter #toDate').change(function() {
			morefilter.toDate = $(this).val();
			
		});
		
		$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #daysContainerRadios').change(function () {
			$('#'+morefilter.parentRefContainer+' #daysContainer').show();
			$('#'+morefilter.parentRefContainer+' #dateContainer').hide();	
			morefilter.timeSelecteValue = "daysContainer";
		});
		
		$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #dateContainerRadios').change(function () {
		   $("#moreFilterContainerData #dateContainer").show();
		   $("#moreFilterContainerData #daysContainer").hide();
		   morefilter.timeSelecteValue = "dateContainer";
		});
		
		$('#cart-goon-btn').click(function(e){
			e.preventDefault();
			if(!$(this).attr('disabled')){
				var current_tab = $('.tab-pane.active').attr('id');
				switch(current_tab){
					case 'cart-tab':
						$('#cartTabs li a').eq($('#cart-data-tab')).tab('show');
						alertify.alert('1')
					break;
					case 'cart-data-tab':
						//cart-pay-tab
						alertify.alert('2')
					break;
					case 'cart-pay-tab':
						//checkout
					break;
				}
			}
		});
		morefilter._handleUniform();
    },
	_setParentRefContainer: function(ref_con){
		morefilter.parentRefContainer = ref_con;
	},
	_setfilterJSONFileName: function(file_name){
		morefilter.filterJSONFileName = file_name;
	},
	_renameAllTabNavLiIDs:function(){
		$('#'+morefilter.parentRefContainer+' #moreFilterContainerData .nav-tabs').find('li a').each(function(){
			
			//IDs.push(this.id); 
			//console.log("~~~~~~" +$(this).attr('href'))
			var hrefVal = ($(this).attr('href')).replace('#', '')
			var modifiedHref = '#'+morefilter.parentRefContainer+'_'+ hrefVal;
			$(this).attr('href', modifiedHref);
		});
	},
	_renameAllTabContentIDs: function(){
		debugger;
		//var IDs = //$('#'+morefilter.parentRefContainer+' #moreFilterContainerData .tab-content').find('.tab-pane')
		$('#'+morefilter.parentRefContainer+' #moreFilterContainerData .tab-content').find('.tab-pane').each(function(){
			
			//IDs.push(this.id); 
			var modifiedId = morefilter.parentRefContainer+'_'+this.id;
			$(this).attr('id', modifiedId);
		});
		 
	},
	_initStarEvents: function(){
		$('#'+morefilter.parentRefContainer+' #moreFilterContainerData .kv-gly-star').rating({
			containerClass: 'is-star'
		});
		
		$('#'+morefilter.parentRefContainer+' #moreFilterContainerData .rating,.kv-gly-star').on('change', function () {
			morefilter.filterStarRatingNumber = parseInt($(this).val());
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
	
	getMoreFilterJsonInfo:function(){

      $.getJSON("json/"+morefilter.filterJSONFileName+".json?", function(data) {
		  morefilter.storedMoreFilterSelection = JSON.parse(localStorage.getItem('moreFilterObj'));
               $.each(data, function(key, item) {
				if(morefilter.storedMoreFilterSelection){
					morefilter.storedGeneralTabFilterData = morefilter.storedMoreFilterSelection['general']['data'];
				}
                 for(var i=0;i<item.options.length;i++)
                 {

                   if(item.options[i].enable == "yes")
                   {
						 switch(item.options[i].displayName) {
							case 'Release':
								releaseOptions = ['1.2','1.3','1.4','1.5','1.6'];
								var releaseSelectedOptions = morefilter.storedGeneralTabFilterData[(item.options[i].displayName).toLowerCase()];
								$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #releaseControl').empty();
								$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #releaseControl').append( morefilter._createDropdownSelectTwo(item.options[i].displayName, releaseOptions));
								$('#'+morefilter.parentRefContainer+' #moreFilterContainerData .multi-select-'+item.options[i].displayName).select2();
								morefilter.releaseFieldName = item.options[i].fieldName;
								$('#'+morefilter.parentRefContainer+' #moreFilterContainerData .multi-select-'+item.options[i].displayName).select2("val", releaseSelectedOptions)
								if (releaseSelectedOptions)
								{
									$(".multi-select-"+item.options[i].displayName).select2("val", releaseSelectedOptions.data)
								}
								 
								break;
							case 'Features':
								featureOptions = ['Feature1','Feature2','Feature3','Feature4','Feature5'];
								var featureSelectedOptions = morefilter.storedGeneralTabFilterData[(item.options[i].displayName).toLowerCase()];
								$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #featureControl').empty();
								$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #featureControl').append( morefilter._createDropdownSelectTwo(item.options[i].displayName, featureOptions));
								$('#'+morefilter.parentRefContainer+' #moreFilterContainerData .multi-select-'+item.options[i].displayName).select2();
								morefilter.featureFieldName = item.options[i].fieldName;
								if (featureSelectedOptions)
								{
									$(".multi-select-"+item.options[i].displayName).select2("val", featureSelectedOptions.data)
								}	
								break;
							 case 'Streams':
								 $('#'+morefilter.parentRefContainer+' #moreFilterContainerData #streamControl').empty();
								 var streamSelectedOptions = morefilter.storedGeneralTabFilterData[(item.options[i].displayName).toLowerCase()];
								 morefilter.streamFieldName = item.options[i].fieldName;
								 if (streamSelectedOptions)
									$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #streamControl').append( morefilter._createCheckBoxbuttonGroup(item.options[i].displayName, item.options[i].subOpts, streamSelectedOptions.data));								
								else
									$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #streamControl').append( morefilter._createCheckBoxbuttonGroup(item.options[i].displayName, item.options[i].subOpts));
								break;
							 case 'Activities':
								$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #activitieControl').empty();
								var ActivitiesSelectedOptions = morefilter.storedGeneralTabFilterData[(item.options[i].displayName).toLowerCase()];
								 morefilter.activitiesFieldName = item.options[i].fieldName;
								if (ActivitiesSelectedOptions)
									$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #activitieControl').append( morefilter._createCheckBoxbuttonGroup(item.options[i].displayName, item.options[i].subOpts, ActivitiesSelectedOptions.data));
								else
									$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #activitieControl').append( morefilter._createCheckBoxbuttonGroup(item.options[i].displayName, item.options[i].subOpts));
								 
								break;
							case 'Rating':
								$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #ratingControls').empty();
								 var RatingSelectedOptions = parseInt(morefilter.storedGeneralTabFilterData[(item.options[i].displayName).toLowerCase()]);
								 morefilter.ratingFieldName = item.options[i].fieldName;
								 if (RatingSelectedOptions)
								{
									selVal = parseInt(RatingSelectedOptions.data.substring(0, 1));
									$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #ratingControls').append(morefilter._createStarRatingComp(item.options[i].displayName, selVal));
								}
								else
								{
									$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #ratingControls').append(morefilter._createStarRatingComp(item.options[i].displayName));								
								}	
								  morefilter._initStarEvents();
								break;
							 case 'Status':
								$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #StatusControls').empty();
								var StatusSelectedOptions = morefilter.storedGeneralTabFilterData[(item.options[i].displayName).toLowerCase()];
								morefilter.StatusFieldName = item.options[i].fieldName;
								if (StatusSelectedOptions)
									$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #StatusControls').append( morefilter._createCheckBoxbuttonGroup(item.options[i].displayName, item.options[i].subOpts, StatusSelectedOptions.data));
								else
									$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #StatusControls').append( morefilter._createCheckBoxbuttonGroup(item.options[i].displayName, item.options[i].subOpts));
								break;
							 case 'Technology':
								technologyOptions = ['C#','C','C++','Cobal','CQ5'];
								var technologySelectedOptions = morefilter.storedGeneralTabFilterData[(item.options[i].displayName).toLowerCase()];
								morefilter.technologyFieldName = item.options[i].fieldName;
								$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #technologyControl').empty();
								$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #technologyControl').append( morefilter._createDropdownSelectTwo(item.options[i].displayName, technologyOptions));
								$('#'+morefilter.parentRefContainer+' #moreFilterContainerData .multi-select-'+item.options[i].displayName).select2();
								if (technologySelectedOptions)
								{
									$('#'+morefilter.parentRefContainer+' #moreFilterContainerData .multi-select-'+item.options[i].displayName).select2("val", technologySelectedOptions.data);
								}
								break;
						}
						morefilter._handleUniform();
                   }

                 }   
               })
			   if(morefilter.storedMoreFilterSelection){
					morefilter._setDefaultTimeValues();
					morefilter._setDefaultcontentValues();
			   }
			   
			   

          });
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
				var _checkedVal = morefilter._setCheckedValue(subOptions[i], storedOpts)
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
	_setDefaultTimeValues:function(){
		
		var storedTimeData = morefilter.storedMoreFilterSelection['time'] ? morefilter.storedMoreFilterSelection['time']['time'] : null;
		var storedDateData = morefilter.storedMoreFilterSelection['time'] ? morefilter.storedMoreFilterSelection['time']['date'] : null;
		if(storedTimeData){
			$('#'+morefilter.parentRefContainer+' #daysContainer input[name="dateFilteroptionsRadios"][value="' + storedTimeData[0] +'" ]').prop('checked', true);
		}else if(storedDateData){
			//$('#dateContainer #fromDate').()
			$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #dateContainer #fromDate input').val(morefilter.storedMoreFilterSelection['time']['date']['fromDate'])//morefilter.fromDate;
			$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #dateContainer #toDate input').val(morefilter.storedMoreFilterSelection['time']['date']['toDate'])
		}
		
	},
	_setDefaultcontentValues:function(){
		var storedContentData = morefilter.storedMoreFilterSelection['content'] ? morefilter.storedMoreFilterSelection['content']['content']: null;
		if(storedContentData){
			for(var i=0; i<storedContentData.length; i++){
				var _chkval = $('#'+morefilter.parentRefContainer+' #filters_contenttype_tab :checkbox[value='+storedContentData[i]+']');
				$(_chkval).prop('checked', true)
				$.uniform.update(_chkval);
			}
			//$.uniform.update('#checkbox');
		}
	},
	
	saveChanges:function(){				
		  //knowledgestore.rows_selected =[]; //Prabhu TODo
		  var generalTabObj = {};
		  var generalTabSubContentObj = {};
			
		
		  // selected release;
			var releaseData  = $('#'+morefilter.parentRefContainer+' #moreFilterContainerData #releaseControl #Options').val();
			if(releaseData){
				var selectedReleaseObj={};
				selectedReleaseObj.filterName = "Release";
				selectedReleaseObj.fieldName = morefilter.releaseFieldName;
				selectedReleaseObj.data = releaseData;
				generalTabSubContentObj.release = selectedReleaseObj;
			}else if(generalTabSubContentObj.release){
				delete generalTabSubContentObj.release;
			}
			
			// selected feature;
			var featureData  = $('#'+morefilter.parentRefContainer+' #moreFilterContainerData #featureControl #Options').val();
			if(featureData){
				var selectedFeatureObj={};
			selectedFeatureObj.filterName = "Features";
			selectedFeatureObj.fieldName = morefilter.featureFieldName;
			selectedFeatureObj.data = featureData;
			generalTabSubContentObj.features = selectedFeatureObj;
			}else if(generalTabSubContentObj.features){
				delete generalTabSubContentObj.features;
			}
			
			//selected Streams filter values
			var streamsData=[];
			var checkedstreamsObj={};
			$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #streamControl input:checkbox[name=type]:checked').each(function(){
				streamsData.push($(this).val());
			}); 
			 
			if(streamsData.length>0){
				checkedstreamsObj.data = streamsData;
				checkedstreamsObj.filterName = 'Streams';
				checkedstreamsObj.fieldName = morefilter.streamFieldName;
				generalTabSubContentObj.streams = checkedstreamsObj; 
			}else if(generalTabSubContentObj.streams){
				delete generalTabSubContentObj.streams;
			}
			
			
			//selected Activity filter values
			var activityData=[];
			var checkedactivityObj={};
			$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #activitieControl input:checkbox[name=type]:checked').each(function(){
				activityData.push($(this).val());
			}); 

			if(activityData.length > 0)
			{
				checkedactivityObj.data = activityData;
			checkedactivityObj.filterName = 'Activities';
			checkedactivityObj.fieldName = morefilter.activitiesFieldName;
			generalTabSubContentObj.activities = checkedactivityObj;
			}else if(generalTabSubContentObj.activities){
				delete generalTabSubContentObj.activities;
			}
		   
			//selected rating filter values
			var checkedratingObj={};
			
			morefilter.filterStarRatingNumber = parseInt($('#'+morefilter.parentRefContainer+' #moreFilterContainerData .kv-gly-star').val());

			if(morefilter.filterStarRatingNumber)
			{
				checkedratingObj.data = morefilter.filterStarRatingNumber+' & above';
				checkedratingObj.filterName = 'Star Rating';
				checkedratingObj.fieldName = morefilter.ratingFieldName;
				generalTabSubContentObj.rating = checkedratingObj;
			}else if(generalTabSubContentObj.rating){
				delete generalTabSubContentObj.rating;
			}
			
		   //selected Status  filter values
		   var StatusData=[];
			var checkedStatusData={};
			$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #StatusControls input:checkbox[name=type]:checked').each(function(){
				StatusData.push($(this).val());
			}); 

			if(StatusData.length > 0)
			{
				checkedStatusData.data = StatusData;
				checkedStatusData.filterName = 'Status';
				checkedStatusData.fieldName = morefilter.StatusFieldName;
				generalTabSubContentObj.status = checkedStatusData;
			}else if(generalTabSubContentObj.status){
				delete generalTabSubContentObj.status;
			}
			
		   //selected technology filter values
		   var technologyData  = $('#'+morefilter.parentRefContainer+' #moreFilterContainerData #technologyControl #Options').val();
			if(technologyData){
				var selectedtechnologyObj={};
				selectedtechnologyObj.filterName = "Technology";
				selectedtechnologyObj.data = technologyData;
				selectedtechnologyObj.fieldName = morefilter.technologyFieldName;
				generalTabSubContentObj.technology = selectedtechnologyObj;	
			 
			}else if(generalTabSubContentObj.technology){
				delete generalTabSubContentObj.technology;
			}

			if(releaseData || featureData || streamsData.length > 0 || activityData.length > 0 || morefilter.filterStarRatingNumber || StatusData.length > 0 || technologyData){
				generalTabObj.data = generalTabSubContentObj;
				morefilter.moreFilterObj.general = generalTabObj;
				
			}else{
				delete morefilter.moreFilterObj.general
			}
					
			
			//This is for read values from Content Conatiner	
			var contentObj = {}
			var data_arr=[];
			
			$('#'+morefilter.parentRefContainer+' #moreFilterContainerData .content-tab input:checkbox[name=type]:checked').each(function(){
				data_arr.push($(this).val());
			}); 
			
			if(data_arr.length > 0)
			{
				contentObj.filterVal = data_arr;
				contentObj.filterName = 'Content';
				contentObj.fieldName = 'content';
				morefilter.moreFilterObj.content = contentObj;
			}else{
				delete morefilter.moreFilterObj.content;
			}
	

			//This is for read values from Time Conatiner
			if( morefilter.timeSelecteValue == "daysContainer"){
				var selectedTimeObj = {}
				var selFilter = {};
				$('#'+morefilter.parentRefContainer+' #moreFilterContainerData .radio-list input[type=radio]:checked').each(function(){
					selFilter.Value = $(this).val();
				});
				if(selFilter.Value){
					selectedTimeObj.filterVal = selFilter.Value;
					selectedTimeObj.fieldName = "published_at";
					selectedTimeObj.filterName = "Quick Time";
					morefilter.moreFilterObj.time = selectedTimeObj;
				}else if(morefilter.moreFilterObj.time){
					delete morefilter.moreFilterObj.time;
				}
				  
			
			} 
			else if( morefilter.timeSelecteValue == "dateContainer"){
				if(morefilter._validateDateRange()){
					var selectedTimeObj = {}
					var time_obj = {};
					time_obj.fromDate = $('#'+morefilter.parentRefContainer+' #moreFilterContainerData #dateContainer #fromDate input').val()//morefilter.fromDate;
					time_obj.toDate = $('#'+morefilter.parentRefContainer+' #moreFilterContainerData #dateContainer #toDate input').val()//morefilter.toDate;
					selectedTimeObj.fieldName = "published_at";
					selectedTimeObj.filterName = "Date Range";				
					selectedTimeObj.filterVal = time_obj;
					morefilter.moreFilterObj.time = selectedTimeObj;
				}
			}
                 
				
		if(morefilter.moreFilterObj){
			 
			//morefilter._addSearchTextTag();
			//$("#moreFiltersPopup").hide();
			//$("#moreFiltersPopup").removeClass('in');
			//$("#moreFiltersPopup").attr('aria-hidden','true');
			//$('.modal-backdrop').remove();
			localStorage.setItem('moreFilterObj', JSON.stringify(morefilter.moreFilterObj));
			$( document ).trigger( ikeEventsConstants.SAVE_MORE_FILTER,  JSON.stringify(morefilter.moreFilterObj) );
			
		}
		//debugger;
	},
	
	_ShowErrorMsg: function(msg_txt, visible){
		$('#'+morefilter.parentRefContainer+' #moreFilterContainerData .modal-footer .alert.alert-danger .error-msg').empty();
		$('#'+morefilter.parentRefContainer+' #moreFilterContainerData .modal-footer .alert.alert-danger .error-msg').last().append(msg_txt);
		if(visible)
			$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #moreFiltersPopup .modal-footer .alert.alert-danger').show();
		else
			$('#'+morefilter.parentRefContainer+' #moreFilterContainerData #moreFiltersPopup .modal-footer .alert.alert-danger').hide();
	},
	
	_validateDateRange: function(){
		
		var fromDate = morefilter.fromDate;
		var toDate = morefilter.toDate;
		
		if(fromDate=="" && toDate!=""){
				//alert("Please enter start date");
				var errorContent = ' Please enter start date';
				morefilter._ShowErrorMsg(errorContent, true);
				return;
		}else if(toDate=="" && fromDate!=""){
				//alert("Please enter end date");
				var errorContent = ' Please enter end date';
				morefilter._ShowErrorMsg(errorContent, true);
				return;
		}else if(fromDate>toDate){
			//alert("Filter Start Date should not Greater than End Date");
				var errorContent = ' Filter Start Date should not Greater than End Date';
				morefilter._ShowErrorMsg(errorContent, true);
				return;
		}else{
			return true;
		}
		
	},
};

