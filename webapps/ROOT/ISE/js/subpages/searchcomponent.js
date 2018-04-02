
 var searchcomponent = {

      searchObj: new Object(),
      selTimeFilterdropDownValue:'',     
      advancedFilterTags:[],   

      /* Init function  */
      init: function()
      {

             
         searchcomponent.getSearchJsonInfo();
		 searchcomponent.initLocalization();
       
       if (!jQuery().datetimepicker) {
            return;
        }

        $(".form_datetime").datetimepicker({
            autoclose: true,
            isRTL: Metronic.isRTL(),
            format: "dd MM yyyy - hh:ii",
            pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left"),
            endDate: '+0d',
        });
           

           $('#buildsDropdown').select2({
            placeholder: "Build",
            allowClear: true
        });

      $('#releaseDropdown').select2({
                  placeholder: "Release",
                  allowClear: true
              });

      $('#featuresDropdown').select2({
            placeholder: "Feature",
            allowClear: true
        });
      $('#statusDropdown').select2({
            placeholder: "Status",
            allowClear: true
        });


          searchcomponent._setBuildsData();
          searchcomponent._setReleasesData();
          searchcomponent._setFeaturesData();
          searchcomponent._setStatusData();


           searchcomponent.searchObj.defectId = "";
           searchcomponent.searchObj.defectSearchText = "";
           searchcomponent.searchObj.builds   = [];
           searchcomponent.searchObj.releases = [];
           searchcomponent.searchObj.features = [];
           searchcomponent.searchObj.statuses = [];
           searchcomponent.searchObj.quickfilter = [];
           searchcomponent.searchObj.timefilter = [];

           searchcomponent.advancedFilterTags = [];

          // alert(searchcomponent.advancedFilterTags.length);


       $("#submitForm").click(function(event) {

          console.log(searchcomponent.searchObj)
      
       });

        
    },


    filterClickHandler:function(filterValue){

         searchcomponent.advancedFilterTags = [];

         //if(searchcomponent.selTimeFilterdropDownValue == create_date)
        if(searchcomponent.selTimeFilterdropDownValue == "Create Date")
        {

         searchcomponent.advancedFilterTags.push({
                    'filterType': searchcomponent.selTimeFilterdropDownValue,
                    'filterValue': filterValue + " to *",
                    'dateValue': searchcomponent.selTimeFilterdropDownValue,
                    'requiredToAdd':"true",
                    'splitRequired': "true",
                    'isDateField' : "yes"

                });
        }
        else if(searchcomponent.selTimeFilterdropDownValue == "Closed Date")
        {

           searchcomponent.advancedFilterTags.push({
                    'filterType': searchcomponent.selTimeFilterdropDownValue,
                    'filterValue': "* to "+ filterValue,
                    'dateValue': searchcomponent.selTimeFilterdropDownValue,
                    'requiredToAdd':"true",
                    'splitRequired': "true",
                    'isDateField' : "yes"

                });

        }
        else
        {
           searchcomponent.advancedFilterTags.push({
                    'filterType': searchcomponent.selTimeFilterdropDownValue,
                    'filterValue': filterValue,
                    'dateValue': searchcomponent.selTimeFilterdropDownValue,
                    'requiredToAdd':"true",
                    'splitRequired': "true",
                    'isDateField' : "yes"

                });

        }   

        console.log(searchcomponent.advancedFilterTags)    
       

        defectsearch.getAdvancedFilterTag(searchcomponent.advancedFilterTags);
    },

     


    


    getSearchJsonInfo:function(){

		  var currentJsonFiles;
		if(iseConstants.languagename=="" || iseConstants.languagename=="en-US")
			 currentJsonFiles="json/searchFilter.json?"
		else
		 
			currentJsonFiles="json/localization/"+iseConstants.languagename+"/searchFilter.json?";
      $.getJSON(currentJsonFiles +Date.now(), function(data) {
             

               $.each(data, function(key, item) {

                 for(var i=0;i<item.options.length;i++)
                 {

                   if(item.options[i].enable == "yes")
                   {
                            for(var j=0;j<item.options[i].displayPage.length;j++){                         
                             
                                    if(item.options[i].displayPage[j] == localStorage.getItem("page"))
                                    {

                                       var filterValue=escape(item.options[i].filter);  



                                      
                                             if(item.title == "Quick Filter"){                        
                                                 $('#quickView').append("<div class=fa-item col-md-3 col-sm-4><a filterValue="+filterValue.toString()+" isDateFilter="+item.options[i].isDateFilter+"  onclick=searchcomponent._quickfilterClickHandler(this)   class=name >"+item.options[i].displayName+'</a></div>');  
                                               }                       
                                              else if(item.title == "datatimefields") 
                                              {

                                                searchcomponent.selTimeFilterdropDownValue = item.options[0].displayName;
                                                 $('#dateTimefields').append('<option value='+item.options[i].displayName+'>'+item.options[i].displayName+'</option>')
                                                 
                                                 searchcomponent.searchObj.timefilter.push({
                                                    'filterType': '',
                                                    'filterValue': '',
                                                    'dateValue': item.options[i].displayName
                                                   });
                                              }
                                              else if(item.title == "Basic Filter")
                                              {
                                                $("#basicfilterRows > div").each(function () {

                                                    var jsonVal = $(this).attr("jsonstring");

                                                    if(item.options[i].displayId.toLowerCase() == jsonVal.toLowerCase())
                                                    {
                                                      $(this).removeClass("hide");
                                                    }
                                                  });
                                              }
                                        
                                    }
                                   else
                                    {
                                      if(item.title == "Basic Filter"){
                                     

                                    $("#basicfilterRows > div").each(function () {

                                            var jsonVal = $(this).attr("jsonstring");

                                            if(item.options[i].displayId.toLowerCase() == jsonVal.toLowerCase())
                                            {
                                              $(this).addClass("hide");
                                            }
                                          });
                                  }

                                      //if(item.title == "Basic Filter"){

                                       // console.log(item.options[i].elementId)

                                        //$('#'+item.options[i].elementId).addClass("hide");

                                   // }
                               }             

                          }
                   }
                   else{

                        if(item.title == "Basic Filter"){

                            $("#basicfilterRows > div").each(function () {

                              var jsonVal = $(this).attr("jsonstring");

                              if(item.options[i].displayId.toLowerCase() == jsonVal.toLowerCase())
                              {
                                $(this).addClass("hide");
                              }
                            });
                          }

                   }

                 }
             
                     
                  })

          });

    },

    _setBuildsData: function() {
           var projectName = localStorage.getItem('projectName');
           ISE.builds("buildsData", "", projectName, false, searchcomponent._receivedBuilds);
      },

      _receivedBuilds: function(data) {
      var selectbuildsData = $('#buildsDropdown');
      $("#buildsDropdown").empty();
      var newOptionContent = '';
      var newOptionContentAll ='<option value="All"> All </option>'
      selectbuildsData.append(newOptionContentAll);
      for(var i=0; i<data.length; i++) {
     
        var fData = data[i].build;
        newOptionContent = '<option value="' 
        newOptionContent += fData + '">'+fData + '</option>';
        selectbuildsData.last().append(newOptionContent);
      }

       $('#buildsDropdown').select2().on("select2-selecting", function(e) {         

           if ($.inArray(e.val,  searchcomponent.searchObj.builds) < 0) {
            searchcomponent.searchObj.builds.push(e.val);
               
           }         
          
        })

        $('#buildsDropdown').select2().on("select2-removed", function(e) {

           for(var i=0;i<searchcomponent.searchObj.builds.length;i++){
             if(searchcomponent.searchObj.builds[i] == e.val )
              searchcomponent.searchObj.builds.splice(i,1);

           }

           
           
          
        })
      
      },

      _setReleasesData: function() {
            var projectName = localStorage.getItem('projectName');
      ISE.listTotalReleases("getReleases", "", projectName, false, searchcomponent._receivedReleases);
    },
                
        _receivedReleases: function(data) {
          var selectreleasesData = $('#releaseDropdown');
      $("#releaseDropdown").empty();
      
      var newOptionContent = '';
      var newOptionContentAll ='<option value="All"> All </option>'
      selectreleasesData.append(newOptionContentAll);
      for(var i=0; i<data.length; i++) {
        var fData = data[i].release;
        newOptionContent = '<option value="' 
        newOptionContent += fData + '">'+fData + '</option>';
        selectreleasesData.last().append(newOptionContent);
      }

       $('#releaseDropdown').select2().on("select2-selecting", function(e) {

         if ($.inArray(e.val,  searchcomponent.searchObj.releases) < 0) {
          
          if(e.val === "All")
          {
            searchcomponent.searchObj.releases.push("*");
            
          }
          else{
          searchcomponent.searchObj.releases.push(e.val);
         }
         
         }   
          
        })

        $('#releaseDropdown').select2().on("select2-removed", function(e) {
          
          for(var i=0;i<searchcomponent.searchObj.releases.length;i++){

            var deleteStr = e.val;
            if( e.val == 'All')
              deleteStr = '*';
            
            if(searchcomponent.searchObj.releases[i] == deleteStr)
              searchcomponent.searchObj.releases.splice(i,1);
           }

           
        })
    },

    _setFeaturesData: function() {
            var projectName = localStorage.getItem('projectName');
      ISE.features("getDefectprimaryFeatures", "", projectName, false, searchcomponent._receivedFeatures);
    },
                
        
        _receivedFeatures: function(data) {
		
		  if (ISEUtils.validateObject(data)) {
           var selectfeaturesData = $('#featuresDropdown');
       $('#featuresDropdown').empty();
      var newOptionContent = '';
      var newOptionContentAll ='<option value="All"> All </option>'
      selectfeaturesData.append(newOptionContentAll);
      for(var i=0; i<data.length; i++) {
        var fData = data[i].primary_feature;
		if(fData != undefined )
		{
        newOptionContent = '<option value="' 
        newOptionContent += fData + '">'+fData + '</option>';
        selectfeaturesData.last().append(newOptionContent);
		}
      }

       $('#featuresDropdown').select2().on("select2-selecting", function(e) {

        
          if ($.inArray(e.val,  searchcomponent.searchObj.features) < 0) {
            //searchcomponent.searchObj.features = [];
          if(e.val === "All")
          {
            searchcomponent.searchObj.features.push("*");
          }
          else{
          searchcomponent.searchObj.features.push(e.val);
         }
          
         } 
         
        })

        $('#featuresDropdown').select2().on("select2-removed", function(e) {
            //searchcomponent.searchObj.features=[];
          for(var i=0;i<searchcomponent.searchObj.features.length;i++){
            var deleteStr = e.val;
            if( e.val == 'All')
              deleteStr = '*';

             if(searchcomponent.searchObj.features[i] == deleteStr )
              searchcomponent.searchObj.features.splice(i,1);
           }

           
        })
		
		}
    },



    _setStatusData: function() {
        console.log("_setStatusData-s")
        var searchString = "*";

        var requestObject = new Object();

                requestObject.searchString = searchString;
                requestObject.projectName = defectsearch.projectName;
                requestObject.maxResults = 5000;
                requestObject.collectionName = "defect_collection";
                ISE.getProjectsSearchResults(requestObject, searchcomponent._receivedStatus);
                
           
        },

        _receivedStatus: function(tmpdata) {

        if (tmpdata.length>0) {
         var tempData1 = [];
        for(k = 0; k<tmpdata.length; k++){
          if(tmpdata[k] == "NoProject")
          {
            $('#statusControls').hide();
          }
          else if(tempData1.toString().indexOf(tmpdata[k]) == -1){
            tempData1.push(tmpdata[k]);

          }

        }
  
  
    var selectstatusData = $('#statusDropdown');
       $('#statusDropdown').empty();
       if(selectstatusData[0].length == 0){
      var newOptionContent = '';
      var newOptionContentAll ='<option value="All"> All </option>'
      selectstatusData.append(newOptionContentAll);
      for(var i=0; i<tempData1.length; i++) {
        
        newOptionContent = '<option value="' 
        newOptionContent += tempData1[i] + '">'+tempData1[i] + '</option>';
        selectstatusData.last().append(newOptionContent);
      }
      

   }
            
          
       $('#statusDropdown').select2().on("select2-selecting", function(e) {

         
          if ($.inArray(e.val,  searchcomponent.searchObj.statuses) < 0) {
            
                 
           if(e.val === "All")
          {
           
            searchcomponent.searchObj.statuses.push("*");
          }
         else{
          searchcomponent.searchObj.statuses.push(e.val);
         }
       
           
          
         } 
         
        })

       
         $('#statusDropdown').select2().on("select2-removed", function(e) {
             
          for(var i=0;i<searchcomponent.searchObj.statuses.length;i++){
            var deleteStr = e.val;
            if( e.val == 'All')
              deleteStr = '*';
            
            if(searchcomponent.searchObj.statuses[i] == deleteStr)
              searchcomponent.searchObj.statuses.splice(i,1);
           }

           
        })
    
    }
    },
       

    getDefectId:function(){

      var defId = $('#searchComponent_DefectID').val();
      searchcomponent.searchObj.defectId = defId; 
      searchcomponent._addFilterTags(defId,"DefectID");   
     
    },

    getDefectsearchText:function(){

      var defSearchText = $('#searchComponent_defectSearchText').val();
      searchcomponent.searchObj.defectSearchText = defSearchText;  
      searchcomponent._addFilterTags(defSearchText,"DefectSearchText");       
    },

    _addFilterTags:function(filterValue,displayName){

             
      var advancedFilterTags = [];      
          


      if(searchcomponent.searchObj.defectId!="")
      {
         advancedFilterTags.push({
                    'filterType': displayName,
                    'filterValue': filterValue
                });
      }

       
      
       if(searchcomponent.searchObj.defectSearchText!="")
      {
         advancedFilterTags.push({
                    'filterType': displayName,
                    'filterValue': filterValue
                });
      }

     
      
      /*if(searchcomponent.searchObj.timefilter.length>0){


        for(var i=0;i<searchcomponent.searchObj.timefilter.length;i++){
          
          if(searchcomponent.searchObj.timefilter[i].filterValue !='')
           $("#divFilterTags").append('<span id=searchComptag_TimeFilterTag_'+i+' class="tag"  style="margin:1px 5px 1px 1px;"><span>'+ searchcomponent.searchObj.timefilter[i].dateValue +': ' + searchcomponent.searchObj.timefilter[i].filterValue + '&nbsp;&nbsp;</span><a    parentID=searchComptag_TimeFilterTag_'+i+'  title="Removing tag">x</a></span>'); 
    
        }
      }*/

         

     /* if(searchcomponent.searchObj.quickfilter.length>0){
        
        for(var i=0;i<searchcomponent.searchObj.quickfilter.length;i++){

           $("#divFilterTags").append('<span id=searchComptag_quickFilterTag_'+i+' class="tag"  style="margin:1px 5px 1px 1px;"><span>'+ searchcomponent.searchObj.quickfilter[i].displayName + '&nbsp;&nbsp;</span><a    parentID=searchComptag_quickFilterTag_'+i+'  title="Removing tag">x</a></span>'); 
    

        }

      } */



    },

    _removeDefectIDFilterTag:function(event){

      searchcomponent.searchObj.defectId="";     

        var parentID = $(event).attr("parentID");
            $("#" + parentID).remove();
            $('#searchComponent_DefectID').val('');


    },

    _removeDefectSearchFilterTag:function(event){

      searchcomponent.searchObj.defectSearchText = "";

      var parentID = $(event).attr("parentID");
        $("#" + parentID).remove();
        $('#searchComponent_defectSearchText').val('');

            if(parentID == "tag_buildsFilterTag" )
                $( '#buildsDropdown' ).select2( 'val', "" );


              if(parentID == "tag_releasesFilterTag")
             $( '#releaseDropdown' ).select2( 'val', "" );

          if(parentID == "tag_featureFilterTag")
              $( '#featuresDropdown' ).select2( 'val', "" );
            if(parentID == "tag_statusFilterTag")
              $( '#statusDropdown' ).select2( 'val', "" );

    },

    getSelectedDropdownValue:function(){

     var selectBox = document.getElementById("dateTimefields");
     var selectedValue = selectBox.options[selectBox.selectedIndex].text;
     searchcomponent.selTimeFilterdropDownValue=selectedValue;

    },

    _quickfilterClickHandler:function(event){

      


     searchcomponent.advancedFilterTags=[];

      var displayName = event.textContent;
      var fieldValue = unescape($(event).attr('filterValue'));
      console.log(fieldValue)
      var isDateField = $(event).attr('isDateFilter');


       searchcomponent.advancedFilterTags.push({
                    'filterType': displayName,
                    'filterValue': fieldValue,
                    'requiredToAdd':"false",
                    'splitRequired': "true",
                    'isDateField' : isDateField
                });

       // alert(searchcomponent.advancedFilterTags.length);

       defectsearch.getAdvancedFilterTag(searchcomponent.advancedFilterTags);


      
      /* var tempArr = [];
       var arr=[]

      if(searchcomponent.searchObj.quickfilter.length>0)
      {

        tempArr = searchcomponent.searchObj.quickfilter;

        arr=[];
        
        searchcomponent.searchObj.quickfilter =  [];
       
          
          for(var i=0;i<tempArr.length;i++){

            if(tempArr[i].displayName == displayName){
              break;

            }
            else
            {
              

               arr.push({

                 "displayName":displayName,
                 "filterValue":fieldValue

               });
              break;
            }        
            
          }


         
          
      }
      else
      {

         searchcomponent.searchObj.quickfilter.push({

           "displayName":displayName,
           "filterValue":fieldValue

         });

      }

       
       

       if(tempArr.length>0 && arr.length>0){

     

          tempArr.push({

              "displayName":arr[0].displayName,
           "filterValue":arr[0].fieldValue


          })

        console.log(tempArr)

        console.log(arr);
      

          searchcomponent.searchObj.quickfilter=  [];
         searchcomponent.searchObj.quickfilter=tempArr;

       }


      searchcomponent._addFilterTags();

   
  */

    },

    setAbsoluteFilter:function(){

      var startDate = $('#fromDate').val();
      var endDate = $('#toDate').val(); 


        var isDatesValid =   searchcomponent.validateEndDate(startDate,endDate);


       searchcomponent.advancedFilterTags.push({
                    'filterType': "Date",
                    'filterValue': startDate + " to " + endDate,
                    'requiredToAdd':"true",
                    'splitRequired': "false",
                    'isDateField':"yes"
                });

      /* searchcomponent.advancedFilterTags.push({
                    'filterType': "To Date",
                    'filterValue': endDate,
                    'requiredToAdd':"true",
                    'splitRequired': "false"
                });   
                */  


       defectsearch.getAdvancedFilterTag(searchcomponent.advancedFilterTags);
    },


   validateEndDate:function (startDate,endDate) {
      
       if (startDate != '' && endDate !='') {
           if (Date.parse(startDate) > Date.parse(endDate)) {
               $("#toDate").val('');
               alert("Start date should not be greater than end date");
           }
       }
       return false;
   },

    setBasicFilter:function(){

      
    searchcomponent.advancedFilterTags = [];


       if(searchcomponent.searchObj.builds.length>0){

        var displayName="Builds";
        var filterValue="["

        for(var i=0;i<searchcomponent.searchObj.builds.length;i++){         
           filterValue +=searchcomponent.searchObj.builds[i]+",";
        }

         var n=filterValue.lastIndexOf(",");
         filterValue=filterValue.substring(0,n); 
        filterValue+="]";         
         searchcomponent.advancedFilterTags.push({
                    'filterType': displayName,
                    'filterValue': filterValue,
                    'requiredToAdd':"true",
                    'splitRequired': "false"
                });
      }


      if(searchcomponent.searchObj.releases.length>0){

        
        var displayName="Release";
        var filterValue="["

        for(var i=0;i<searchcomponent.searchObj.releases.length;i++){         
           filterValue +=searchcomponent.searchObj.releases[i]+",";
        }

        var n=filterValue.lastIndexOf(",");
         filterValue=filterValue.substring(0,n); 

        filterValue+="]";

         searchcomponent.advancedFilterTags.push({
                    'filterType': displayName,
                    'filterValue': filterValue,
                    'requiredToAdd':"true",
                    'splitRequired': "false"
                });        

      }

      if(searchcomponent.searchObj.features.length>0){

        

        var displayName="primary_feature";
        var featureFilterTag="["

        for(var i=0;i<searchcomponent.searchObj.features.length;i++){
         
           featureFilterTag +=searchcomponent.searchObj.features[i]+",";
        }

        var n=featureFilterTag.lastIndexOf(",");
         featureFilterTag=featureFilterTag.substring(0,n); 
        featureFilterTag+="]";

          searchcomponent.advancedFilterTags.push({
                    'filterType': displayName,
                    'filterValue': featureFilterTag,
                    'requiredToAdd':"true",
                    'splitRequired': "false"
                });
      } 
      if(searchcomponent.searchObj.statuses.length>0){

       //searchcomponent.advancedFilterTags=[];
        var displayName="status";
        var statusFilterTag="["

        for(var i=0;i<searchcomponent.searchObj.statuses.length;i++){
         
           statusFilterTag +=searchcomponent.searchObj.statuses[i]+",";
        }
          
        var n=statusFilterTag.lastIndexOf(",");
         statusFilterTag=statusFilterTag.substring(0,n); 
        statusFilterTag+="]";
                  console.log(statusFilterTag)
          searchcomponent.advancedFilterTags.push({
                    'filterType': displayName,
                    'filterValue': statusFilterTag,
                    'requiredToAdd':"true",
                    'splitRequired': "false"
                });
      }     
    
     
     defectsearch.getAdvancedFilterTag(searchcomponent.advancedFilterTags);

 
    },

	initLocalization:function(){
		var languageName = iseConstants.languagename;
		var pathName = 'json/localization/'+languageName;
		var opts = { language: languageName, pathPrefix: pathName, skipLanguage: "en-US"};
		 opts.callback = function(data, defaultCallback) {
		 defaultCallback(data);
          searchcomponent.localizationCallback(data);
        }
		
		$("[data-localize]").localize("searchcomponent", opts);
	
	},
	localizationCallback:function(data){
		console.log("DATA : "+data);
		searchcomponent.dataTableLocalizationData = data.fileuploadtabledata;
	},
	getLocalizationName:function(name){
		 for(var ss in searchcomponent.dataTableLocalizationData){
			if(ss == name)
				return searchcomponent.dataTableLocalizationData[ss]
		}
		
	}	
    


  };
