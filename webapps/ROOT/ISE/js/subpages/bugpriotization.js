     var bugpriotization= {

	 P1density:null,
	 P2density:null,
	 P3density:null,
	 P4density:null,
	 
	 Each_primary_feature_Priority:[],
	 Each_build_Priority:[],
	 Each_release_Priority:[],
	 Each_severity_Priority:[],
	 Each_internaldefect_Priority:[],	
	 
	 spriorityArr:[],
	 
	 selectBuilds:[],
	 selectRelase:[],
	 selectFeatures:[],
	 cnt:0,
	 cnt1:0,
	 ArrayField:[],
       
        /* Init function  */
        init: function() {
		
		    bugpriotization.ArrayField= new Array();
			bugpriotization.ArrayField[0] ="primary_feature";
			bugpriotization.ArrayField[1] ="priority";
			bugpriotization.ArrayField[2] ="build";
			bugpriotization.ArrayField[3] ="release";
			bugpriotization.ArrayField[4] ="severity";
			bugpriotization.ArrayField[5] ="internaldefect";
			 
			bugpriotization._setTotalResultsforthedefect(bugpriotization.ArrayField);
		
		var isChkMyBugs = "true"; 
		isChkMyBugs = true; 
		//bugpriotization._searchDefectByuser(isChkMyBugs);
		bugpriotization._searchDefaultDetails(isChkMyBugs);
                      
		if (jQuery().datepicker) {
		
             $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                orientation: "left",
                autoclose: true
            }); 
			}

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
			

			
			
			bugpriotization._setBuildsData();
			bugpriotization._setReleasesData();
			bugpriotization._setFeaturesData();	

			$("#resetForms").click(function(event) {
				$("#tableBody1").empty();
				$("headerPart").empty();
			console.log("reset hit");
			bugpriotization.selectBuilds=[];
			bugpriotization.selectRelase=[];
			bugpriotization.selectFeatures=[];
			
				$('#defect_bugsearchDefectID').val('');
				$('#defect_bugsearchDesc').val('');
				$('#startDate').val('');
				$('#endDate').val('');
				//document.getElementById("myDefectsIds").checked = false;
				$( '#buildsDropdown' ).select2( 'val', "" );
				$( '#releaseDropdown' ).select2( 'val', "" );
				$( '#featuresDropdown' ).select2( 'val', "" );
				
				
				
			$("#page_bugpriotization #startDate,#page_bugpriotization .btn.btn-sm.default,#page_bugpriotization #endDate,#page_bugpriotization #buildsDropdown,#page_bugpriotization #releaseDropdown,#page_bugpriotization #featuresDropdown,#page_bugpriotization #defect_bugsearchDesc,#page_bugpriotization #defect_bugsearchDefectID").attr("disabled",false);
          
			});
            
			

			$("#submitForm").click(function(event) {
			
			$('#searchResultsTablebug').addClass('hide');
			$('#methodPathTable1').addClass("hide");
			bugpriotization.selectBuilds=[];
			bugpriotization.selectRelase=[];
			bugpriotization.selectFeatures=[];
			
			
			
			
			$("#buildsDropdown option:selected").each(function() {
				bugpriotization.selectBuilds.push($(this).val());
			});
			
			$("#releaseDropdown option:selected").each(function() {
				bugpriotization.selectRelase.push($(this).val());
			});
			
			$("#featuresDropdown option:selected").each(function() {
				bugpriotization.selectFeatures.push($(this).val());
			});
			
			var defId = $('#defect_bugsearchDefectID').val();
			var defDesc = $('#defect_bugsearchDesc').val();
			var startDate = $('#startDate').val();
			var endDate = $('#endDate').val();
			
			//var mydefctchk = document.getElementById("myDefectsIds").checked
				//console.log("--------52---------"+mydefctchk);
			//bugpriotization._setDefectDetailsByDesc();
			
			if(startDate && endDate ){
				var startDateSelect = new Date(startDate);
				var endDateSelect = new Date(endDate);
				if(startDateSelect>endDateSelect){
					alert("End date should not be less than start date.");
				}else{
				
					bugpriotization._searchDefectByDates(startDate,endDate);
				}
			}
			else if((bugpriotization.selectBuilds.length>0) || (bugpriotization.selectRelase.length>0) || (bugpriotization.selectFeatures.length>0)){
					
					bugpriotization._searchDefectByBuilRelaseFeature();
				}else if(defId != null && defId.length>0) {
					
					bugpriotization._setDefectDetails();
				}else if(defDesc != null &&  defDesc.length>0) {
					
					bugpriotization._setDefectDetailsByDesc();
				} else{
					$("#tableBody1").empty();
					alert(" Please Select Any One Condition ");
					
				}
			
		
		   
        });

		  $("#page_bugpriotization #startDate,#page_bugpriotization #endDate").on("change",function(){
		     $("#page_bugpriotization #buildsDropdown").attr("disabled",true);
			 $("#page_bugpriotization #releaseDropdown").attr("disabled",true);
			 $("#page_bugpriotization #featuresDropdown").attr("disabled",true);
			 $("#page_bugpriotization #defect_bugsearchDefectID").attr("disabled",true);
			 $("#page_bugpriotization #defect_bugsearchDesc").attr("disabled",true);
		  });		  
		  $("#page_bugpriotization #buildsDropdown,#page_bugpriotization #releaseDropdown,#page_bugpriotization #featuresDropdown").on("change",function(){
		    $("#page_bugpriotization #startDate,#page_bugpriotization .btn.btn-sm.default,#page_bugpriotization #endDate,#page_bugpriotization #defect_bugsearchDesc,#page_bugpriotization #defect_bugsearchDefectID").attr("disabled",true);
		  });		 		  
          $("#page_bugpriotization #defect_bugsearchDesc").on("change",function(){
		    $("#page_bugpriotization #startDate,#page_bugpriotization #endDate,#page_bugpriotization .btn.btn-sm.default,#page_bugpriotization #buildsDropdown,#page_bugpriotization #releaseDropdown,#page_bugpriotization #featuresDropdown,#page_bugpriotization #defect_bugsearchDefectID").attr("disabled",true);
		  });
		  $("#page_bugpriotization #defect_bugsearchDefectID").on("change",function(){
		    $("#page_bugpriotization #startDate,#page_bugpriotization #endDate,#page_bugpriotization .btn.btn-sm.default,#page_bugpriotization #buildsDropdown,#page_bugpriotization #releaseDropdown,#page_bugpriotization #featuresDropdown,#page_bugpriotization #defect_bugsearchDesc").attr("disabled",true);
		  });		  

        },
		_searchDefectByuser: function(mydefctchk) {
			
			console.log("inside function for mybug chk--->"+mydefctchk);
			var myBugUser;
			var relaseString;
			var featureString;
			var finalString;
			
			var updateUser = localStorage.getItem('username')
			if(updateUser){
				finalString = "(updatedby:"+updateUser+")";
			}
			
			
			console.log("finalString----->"+finalString);
			var requestObject1 = new Object();
			requestObject1.collectionName = "defect_collection";
			//requestObject1.collectionName = "defect_collection";
			//requestObject1.type = localStorage.getItem('projname');
			requestObject1.searchString =	finalString;
			requestObject1.maxResults = 50;
			ISE.getDefLocalizationSearch(requestObject1, bugpriotization._receivedSearchResults);
		
        },
		
		
		_searchDefaultDetails: function(mydefctchk) {
			
			console.log("inside function for mybug chk--->"+mydefctchk);
			var myBugUser;
			var relaseString;
			var featureString;
			var finalString;
			
			var updateUser = localStorage.getItem('username')
			var defaultUser = "(*)";
			if(updateUser){
				finalString = "(updatedby:"+defaultUser+")";
			}
			
			
			console.log("finalString----->"+finalString);
			var requestObject1 = new Object();
			requestObject1.collectionName = "defect_collection";
			//requestObject1.collectionName = "defect_collection";
			//requestObject1.type = localStorage.getItem('projname');
			requestObject1.searchString =	finalString;
			requestObject1.maxResults = 50;
			ISE.getDefLocalizationSearch(requestObject1, bugpriotization._receivedSearchResults);
		
        },
		
		_setTotalResultsforthedefect:function(ArrayField)
		{
			var startDate="";
			var endDate="";
			bugpriotization.cnt = ArrayField.length;
			bugpriotization.cnt1=0;
			for(var i = 0;i< ArrayField.length;i++){
					var requestfield = new Object();
					requestfield.collectionName = "defect_collection";
					requestfield.field =ArrayField[i];
					requestfield.fromInputDate =startDate;
					requestfield.fromOutputDate =endDate;	
									
					ISE.getCountForThefield(requestfield, bugpriotization._receivedFieldCountOccurred);
			}
			
			
		},
		_receivedFieldCountOccurred:function(response,field)
		{		
				bugpriotization.cnt1++;				
				bugpriotization._getProbabiltyOfFieldByPrioritywise(response,field);	
				
			if(bugpriotization.cnt == bugpriotization.cnt1)
			{
				var terms=response[1];
				var totaldefect=response[0];
			
				for(var i=0;i<terms.length;i++){				
					var prioritykey=terms[i].key;
					var prioritycount=terms[i].doc_count;
					 if(prioritykey.indexOf('1')>-1)
					 {
					 P1density=(prioritycount/totaldefect);
					 }
					 else if(prioritykey.indexOf('2')>-1)
					 {
					 P2density=(prioritycount/totaldefect);
					 }
					 else if(prioritykey.indexOf('3')>-1)
					 {
					 P3density=(prioritycount/totaldefect);
					 }
					 else
					 {
					 P4density=(prioritycount/totaldefect);
					 }
				 
				 }		
				
			}
			
		},
		_getProbabiltyOfFieldByPrioritywise:function(data,field)
		{				
				
					var EachfeaturePerPriority=new Array();
					var EachBuildPerPriority=new Array();
					var EachReleasePerPriority=new Array();
					var EachSeverityPerPriority=new Array();
					var EachInternalDefectPerPriority=new Array();
				
					var terms=data[1];				
				
					for(var i = 0;i< terms.length;i++){		
						var Prioity="P4";
						if(terms[i].key != "---")
							Prioity=terms[i].key;
						var Prioitycount=terms[i].doc_count;
						var types=terms[i].featurebucket.buckets;
						var sampleArr=new Array();
						for(var j = 0;j< types.length;j++){	
							var key=types[j].key;
							var val=types[j].doc_count;
							var probabiltyofkey=(val/Prioitycount);
							var str=new Array();
							str[0]=probabiltyofkey;			//probability
							str[1]=key;						//nameofthefield
							str[2]=Prioity;					//priority										
							sampleArr[j]=str;
						}
						if(("Each_primary_feature_Priority").indexOf(field)>-1)
						{
						bugpriotization.Each_primary_feature_Priority[i]=sampleArr;
						}
						else if(("Each_build_Priority").indexOf(field)>-1)
						{
						bugpriotization.Each_build_Priority[i]=sampleArr;
						}
						else if(("Each_release_Priority").indexOf(field)>-1)
						{						
						 bugpriotization.Each_release_Priority[i]=sampleArr;
						}
						else if(("Each_severity_Priority").indexOf(field)>-1)
						{
						bugpriotization.Each_severity_Priority[i]=sampleArr;
						}
						else if(("Each_internaldefect_Priority").indexOf(field)>-1)
						{							
						bugpriotization.Each_internaldefect_Priority[i]=sampleArr;
						}
					
				}
		},
		
		
		_setBuildsData: function() {
           var projectName = localStorage.getItem('projectName');
           ISE.builds("buildsData", "", projectName, false, bugpriotization._receivedBuilds);
      },
                
        _receivedBuilds: function(data) {
			var selectbuildsData = $('#buildsDropdown');
			$("#buildsDropdown").empty();
			var newOptionContent = '';
			var newOptionContentAll ='<option value="All"> All </option>'
			selectbuildsData.append(newOptionContentAll);
			for(var i=0; i<data.length; i++) {
			console.log("-------------"+data[i].build);
				var fData = data[i].build;
				newOptionContent = '<option value="' 
				newOptionContent += fData + '">'+fData + '</option>';
				selectbuildsData.last().append(newOptionContent);
			}
			
			},
		
		
		
		
		_setReleasesData: function() {
            var projectName = localStorage.getItem('projectName');
			ISE.releases("releaseData", "", projectName, false, bugpriotization._receivedReleases);
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
		},


		_setFeaturesData: function() {
            var projectName = localStorage.getItem('projectName');
			ISE.bugpriorityfeatures("featuresData", "", projectName, false, bugpriotization._receivedFeatures);
		},
                
				
        _receivedFeatures: function(data) {
           var selectfeaturesData = $('#featuresDropdown');
		   $('#featuresDropdown').empty();
			var newOptionContent = '';
			var newOptionContentAll ='<option value="All"> All </option>'
			selectfeaturesData.append(newOptionContentAll);
			for(var i=0; i<data.length; i++) {
				var fData = data[i].feature;
				newOptionContent = '<option value="' 
				newOptionContent += fData + '">'+fData + '</option>';
				selectfeaturesData.last().append(newOptionContent);
			}
		},
		
		
		_setDefectDetails: function() {

           if ($('#defect_bugsearchDefectID').val().length > 2) 
		   {
                   ISEUtils.portletBlocking("pageContainer");

                var defectId = escape($('#defect_bugsearchDefectID').val().trim());

                var projectName = localStorage.getItem('projectName');
                var params = ['PARAM1=' + defectId];
				console.log("defectId"+defectId);
                ISE.getDefectdetailsByID("getDefectDetailsById", params, projectName, false, bugpriotization._receivedDefectDetailsByID);  
			   
            }
        },
		
		
		
		_setDefectDetailsByDesc: function() {

            if ($('#defect_bugsearchDesc').val().length > 2) {
			console.log("inside method");
					ISEUtils.portletBlocking("pageContainer");
					var defDescription = escape($('#defect_bugsearchDesc').val().trim());
					console.log("desc---------->"+defDescription);
					$('#defect_bugsearchDefectDes').val(defDescription);
					var requestObject1 = new Object();
					requestObject1.collectionName = "defect_collection";					
					requestObject1.searchString = $('#defect_bugsearchDefectDes').val();
					requestObject1.maxResults = 50;
					ISE.getDefLocalizationSearch(requestObject1, bugpriotization._receivedSearchResults);
			}
        },

		
		
		_searchDefectByBuilRelaseFeature: function(mydefctchk) {
			
			console.log("inside function chk--->"+mydefctchk);
			var builString="";
			var relaseString="";
			var featureString="";
			var finalString;
			
			if(bugpriotization.selectBuilds.length>0){
			if(bugpriotization.selectBuilds[0] =='All'){
				builString = "(*)";
				}else{
					for(var i=0;i<bugpriotization.selectBuilds.length;i++){
						builString += 'build:"'+bugpriotization.selectBuilds[i].trim()+'" OR ';
					}
					builString="("+builString.slice(0,-3)+")"
				}
			}
			
			//if(bugpriotization.selectBuilds.length>0){
				//builString = "(build:"+bugpriotization.selectBuilds[0]+")";
			//}
			
			
			if(bugpriotization.selectRelase.length>0){
			if(bugpriotization.selectRelase[0] =='All'){
				relaseString = "(*)";
				}else{
					for(var i=0;i<bugpriotization.selectRelase.length;i++){
						relaseString += 'release:"'+bugpriotization.selectRelase[i].trim()+'" OR ';
					}
						relaseString="("+relaseString.slice(0,-3)+")"
				}
			}
			
			//if(bugpriotization.selectRelase.length>0){
			//	relaseString = "(release:"+bugpriotization.selectRelase[0]+")";
			//}
			
			if(bugpriotization.selectFeatures.length>0){
				if(bugpriotization.selectFeatures[0] =='All'){
				featureString = "(*)";
				}else{
					for(var i=0;i<bugpriotization.selectFeatures.length;i++){
					featureString += 'primary_feature:"'+bugpriotization.selectFeatures[i].trim()+'" OR ';
					}
				
					featureString="("+featureString.slice(0,-3)+")"
				}
			}
			
			//if(bugpriotization.selectFeatures.length>0){
			//	featureString = "(primary_feature:"+bugpriotization.selectFeatures[0]+")";
			//}
			
			if(builString != "" && relaseString != "" && featureString != ""){
				finalString= builString+" AND "+relaseString+" AND "+featureString;
			}else if (builString != ""  && relaseString != ""){
				finalString= builString+" AND "+relaseString;
			}else if (builString != "" && featureString != "" ){
				finalString= builString+" AND "+featureString;
			}else if (relaseString != "" && featureString != "" ){
				finalString= featureString+" AND "+relaseString;
			}else if (builString != "" ){
				finalString= builString;
			}else if (relaseString != "" ){
				finalString= relaseString;
			}else if (featureString != "" ){
				finalString= featureString;
			}
			
			if(mydefctchk){
			var defOwner = localStorage.getItem('username');
			//var defOwner='adminaa@hcl.com';
			finalString =finalString+' AND (updated_by:'+defOwner+')';
			}
			
			console.log("finalString----->"+finalString);
			var requestObject1 = new Object();
			//requestObject1.collectionName = "ise_mongo_demo1_defect_collection";
			requestObject1.collectionName = "defect_collection";
			requestObject1.type = localStorage.getItem('projname');
			requestObject1.searchString =	finalString;
			requestObject1.maxResults = 50;
			ISE.getDefLocalizationSearch(requestObject1, bugpriotization._receivedSearchResults);
		
        },
		
		
		
		_searchDefectByDates: function(startDate, endDate) {
			
			var requestObject = new Object();
            requestObject.collectionName = "defect_collection";
			
			
			requestObject.fromInputDate = startDate;
			requestObject.fromOutputDate = endDate;
			
            requestObject.maxResults = 50;
            ISE.getSearchResultsByDateRange(requestObject, bugpriotization._receivedSearchResults);
			

        },
		
		
		
		
		
        _receivedDefectDetailsByID: function(data) {
			if(data.length>0){
			for (var i = 0; i < data.length; i++) {
                var title = data[i].title;
                var description = data[i].description;
				
				console.log("888888888description--->"+description);
                $('#defect_bugsearchDefectTitle').val(title);
                $('#defect_bugsearchDefectDes').val(description);
            }

        

            var requestObject = new Object();
            
			requestObject.collectionName = "defect_collection";
			
            requestObject.searchString = $('#defect_bugsearchDefectDes').val().replace(/[^a-z0-9\s]/gi, '');
            requestObject.maxResults = 1;
            ISE.getDefLocalizationSearch(requestObject, bugpriotization._receivedSearchResults);
			}else{
				alert("No data found.");
				ISEUtils.portletUnblocking("pageContainer");
			}
        },
		

         _receivedSearchResults: function(dataObj) {

			console.log(dataObj);
			$("#tableBody1").empty();      
			if(dataObj.length>0){
			bugpriotization._getSuggestedPriority(dataObj);

            var table = $('#bugpri');
            
                        

            $.getJSON("json/DynamicTabArrayBug.json", function(data) {
			
                $.each(data, function(key, item) {

                    bugpriotization._getTableHeaderLables(item[0].defects.Details.fields);
                    $('input[type="checkbox"]', '#sample_4_column_toggler1').change(function () {

                                  var iCol = parseInt($(this).attr("data-column"));



                        if (!$(this).is(':checked')) {
                             
                              $('td:nth-child('+iCol+'),th:nth-child('+iCol+')').hide() 
                            }
                            else
                            {
                               $('td:nth-child('+iCol+'),th:nth-child('+iCol+')').show() 
                            }    

                    });

                    var newRowContent = '';
					var newTitle='';
					var newFeature=''
					var newPrio=''
					
                    for (var i = 0; i < dataObj.length; i++) {
                        newRowContent = '<tr>';
						
                        for (var j = 0; j < item[0].defects.Details.fields.length; j++) {

                            switch (item[0].defects.Details.fields[j].SourceName) {

                                case "_id":

                                    newRowContent += '<td id="defectIdVal'+i+'" value="' + dataObj[i]._id +'">'+ dataObj[i]._id+ '</td>';

                                    break;
								
								 case "title":
                                    if (dataObj[i].highlight != undefined || dataObj[i].highlight != null) {
                                        if (undefined != dataObj[i].highlight['title'] && dataObj[i].highlight['title'] != null) {
                                            var title = ''
                                            for (var n = 0; n < dataObj[i].highlight['title'].length; n++) {
                                                title = title + " " + dataObj[i].highlight['title'][n];
                                            }

                                            newRowContent += '<td>' + title + '</td>';
                                        } else {
                                            newRowContent += '<td>' + dataObj[i].title + '</td>';

                                        }
                                    } else {
                                        newRowContent += '<td>' + dataObj[i].title + '</td>';
                                    }
                                    break;
					
		
									
								case "primary_feature":
									if (dataObj[i].primary_feature != undefined) {
										newRowContent += '<td id="featureIdVal'+i+'" value="'+ dataObj[i].primary_feature+ '">'+dataObj[i].primary_feature + '</td>';
									}
									 else {
                                        newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
                                    }
                                 break;     
								
								case "build":
									
									if(dataObj[i].build != undefined){
                                    newRowContent += '<td>' + dataObj[i].build + '</td>';
									}else {
                                        newRowContent += '<td>N.A</td>';
                                    }
								
								break;
								case "release":
									
									if(dataObj[i].release != undefined){
                                    newRowContent += '<td>' + dataObj[i].release + '</td>';
									}else {
                                        newRowContent += '<td>N.A</td>';
                                    }
								
								break;
								case "priority":
									
									if(dataObj[i].priority != undefined){
                                    newRowContent += '<td>' + dataObj[i].priority + '</td>';
									}else {
                                        newRowContent += '<td>N.A</td>';
                                    }
								
								break;
								
								case "priority":
									 newRowContent +='<td>priority</td>';
								break;
								case "suggested_priority":
									var sprio=spriorityArr[i];
									if(sprio[0]==dataObj[i]._id )
									{
									var pr = "P4";
									if(dataObj[i].priority != "---")
										pr = dataObj[i].priority
									var prio = parseInt((pr).match(/\d+/),10);									
									//var prio = parseInt((dataObj[i].priority).match(/\d+/),10);									
									var spriot = parseInt((sprio[2]).match(/\d+/),10);					
										if(sprio[1]==0)
										{
										spriot=prio;
										}
									
									 if(prio<spriot)
										{										
										newRowContent +='<td><span class="glyphicon glyphicon-circle-arrow-down" style="color:red"></span>&nbsp;<label id="spriority_'+dataObj[i]._id+'">'+spriot+'</label></td>';
										}
										else if(prio>spriot)
										{										
										newRowContent +='<td><span class="glyphicon glyphicon-circle-arrow-up" style="color:green"></span>&nbsp;<label id="spriority_'+dataObj[i]._id+'">'+spriot+'</label></td>';
										}
										else
										{
										newRowContent +='<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label id="spriority_'+dataObj[i]._id+'">'+spriot+'</label></td>';
										}
										
									}
									 
								break;
								case "calls":
									 newRowContent +='<td><input id="txt_calls_'+i+'" class="form-control input-square" value="1"/></td>';
								break;
								case "total_calls":
									 newRowContent +='<td><input id="txt_tocalls_'+i+'" class="form-control input-square" value="6848"/></td>';
								break;
								/**case "":									
								newRowContent += '<td ><button  id="btn_'+dataObj[i]._id+'" class="btn blue" type="button" onclick="bugpriotization._BugPriotizationByDefectID(this);">Submit</button></td>';								
								break;*/
								
                                default:
								
								
                                    break;
                            }
                        }

                        newRowContent = newRowContent +'</tr>';
					

                        $('#tableBody1').last().append(newRowContent);
                    }

                     }); 
			
            });
        


            $('#searchResultsTablebug').removeClass("hide");			
			
			
			
             

            }else{
				if($("#bugpri #defectIDHeader").text().trim()!="" || dataObj.length>1){
				
				alert("No data found.");
		
				
				}
			}
			
			ISEUtils.portletUnblocking("pageContainer");

        },
		 
			// New code added by Smriti
			// Formula to find suggested priority
			
			//P1density=P1total/Totaldefect;P2density=P2total/Totaldefect;P3density=P3total/Totaldefect;P4density=P4total/Totaldefect;
			
			//										|((f1/TotalOfP1)+(b1/TotalOfP1)+(r1/TotalOfP1)+(s1/TotalOfP1)+(Ind1/TotalOfP1)*P1density)|
			//SuggestedPrority of Defect1=Max of 	|((f1/TotalOfP2)+(b1/TotalOfP2)+(r1/TotalOfP2)+(s1/TotalOfP2)+(Ind1/TotalOfP2)*P2density)|
			//										|((f1/TotalOfP3)+(b1/TotalOfP3)+(r1/TotalOfP3)+(s1/TotalOfP3)+(Ind1/TotalOfP3)*P3density)|
			//										|((f1/TotalOfP4)+(b1/TotalOfP4)+(r1/TotalOfP4)+(s1/TotalOfP4)+(Ind1/TotalOfP4)*P4density)|
			
			
			
		_getSuggestedPriority: function(data) {
			var f="";	
			var b="";
			var r="";
			var s="";
			var ind="";
			var probtotalP1=1;
			var probtotalP2=1;
			var probtotalP3=1;
			var probtotalP4=1;
			var prioritywiseField=new Array();
			spriorityArr=new Array();
			var Priorityname=new Array;
			
			for (var i = 0; i < data.length; i++) {	
					id=data[i]._id;
				    f=data[i].primary_feature;	
				    b=data[i].build;  
				    r=data[i].release;		
				    s=data[i].severity;		
				   // ind=data[i].internaldefect;
				    var probabilty1=0;
					var probabilty2=0;
					var probabilty3=0;
					var probabilty4=0;
					var sm1=0;
					var sm2=0;
					var sm3=0;
					var sm4=0;
				   for(j=0;j<3;j++)
				   {
						var m="";
						 if(j==0)
						 {
						  prioritywiseField=bugpriotization.Each_primary_feature_Priority;
						  m=f;
						 }
						 else if(j==1)
						 {
						  prioritywiseField=bugpriotization.Each_build_Priority;
						  m=b;
						 }
						 else if(j==2)
						 {
						 prioritywiseField=bugpriotization.Each_release_Priority;
						 m=r;
						 }
						 else if(j==3)
						 {
						 prioritywiseField=bugpriotization.Each_severity_Priority;
						
						 m=s;
						 }
						// else if(j==4)
						// {
						// prioritywiseField=bugpriotization.Each_internaldefect_Priority;
						// m=ind;
						// }
						
						  
						   for(l=0;l<prioritywiseField.length;l++)
						   {
							
						    var FeaturePriorityProbailityArray=prioritywiseField[l];
							 
							for(t=0;t<FeaturePriorityProbailityArray.length;t++)
							{
								var FieldPriority=FeaturePriorityProbailityArray[t];
								Priorityname[l]=FieldPriority[2];
								if(FieldPriority[1]==m)
								{
									console.log(m);
									if(FieldPriority[2].indexOf('1')>-1)
									{
									
									probabilty1=FieldPriority[0];	
									console.log(probabilty1+"....Pr1");
									probtotalP1=(probtotalP1*probabilty1);	
									sm1++;
									}
									if(FieldPriority[2].indexOf('2')>-1)
									{
									probabilty2=FieldPriority[0];																		
									probtotalP2=(probtotalP2*probabilty2);	
									sm2++;
									}
									if(FieldPriority[2].indexOf('3')>-1)
									{
									probabilty3=FieldPriority[0];
									
									probtotalP3=(probtotalP3*probabilty3);
									sm3++;
									}
									if(FieldPriority[2].indexOf('4')>-1)
									{
									probabilty4=FieldPriority[0];
									
									probtotalP4=(probtotalP4*probabilty4);
									sm4++;
									}
								}
							}

							
						   }
				   
				   }
				   
					   var P1=(sm1==3)?(probtotalP1*P1density):0; 	
					   var P2=(sm2==3)?(probtotalP2*P2density):0; 	
					   var P3=(sm3==3)?(probtotalP3*P3density):0; 	
					   var P4=(sm4==3)?(probtotalP4*P4density):0; 
					   console.log(P1+"---------P1")
					   var sampleArr=new Array();
					   sampleArr[0]=id;
					   var max=Math.max(P1,P2,P3,P4);
					   sampleArr[1]=max;
					   for(var h=0;h<Priorityname.length;h++)
					   {
						   if(max==P1)		
						   {
							   if(Priorityname[h].indexOf('1')>-1)
							   {
							   sampleArr[2]=Priorityname[h]
							   }							   
						   }
						   else if(max==P2)
						   {
						    if(Priorityname[h].indexOf('2')>-1)
							   {
							   sampleArr[2]=Priorityname[h]
							   }
						   }
						   else if(max==P3)
						   {
						   if(Priorityname[h].indexOf('3')>-1)
							   {
							   sampleArr[2]=Priorityname[h]
							   }
							}
							else if(max==P4)
							{
							if(Priorityname[h].indexOf('4')>-1)
							   {
							   sampleArr[2]=Priorityname[h]
							   }
							}
					   }
					   
					   spriorityArr[i]=sampleArr;
						//console.log(sampleArr+ 'P1-:' + P1 + ' P2-' + P2 + ' P3-' + P3 + ' P4-' + P4);
				 }    
				  
			
			//console.log(spriorityArr );
			},
			
		
		_BugPriotizationByDefectID: function(data){
		// ISEUtils.portletBlocking("pageContainer");	
			var defect=(data.id).split('_');
			var requestId = new Object();
			requestId.collectionName = "defect_collection";
			requestId.Id =defect[1];		
					
			ISE.getResultsBasedOnID(requestId, bugpriotization._receivedSearchResultsBasedOnID);			
		},
		_receivedSearchResultsBasedOnID:function(response)
		{
			var uniquefeature; 			
			var resp=response[0];
			var Featurelist=ArrFeature[1];
			var totalfeatures=ArrFeature[1].length;	
			
			
			for(i=0;i<Featurelist.length;i++)
			{
				if(resp[0]._source.primary_feature==Featurelist[i].term)
				{
					uniquefeature=ArrFeature[i].count;
				}
			}			
		
		},
		
		_onView: function(node) {
		
		  ISEUtils.portletBlocking("pageContainer");
			
            var defFeatureVal = node.id;
			var defFeaArray = defFeatureVal.split("&#&");
			var inputDefect = defFeaArray[0];
			var inputfeature = defFeaArray[1];
			
			var projectName = localStorage.getItem('projectName');
                
			
			
			console.log("projectName----->"+projectName);
			params="projectName="+projectName+","+"PARAM1=803468"+","+"PARAM2=warning bar";
			var param1 = "803468";
			var param2 = "warning bar";
			
			var requestObject1 = new Object();
			requestObject1.collectionName = "defect_collection";
			requestObject1.params= params;
			requestObject1.maxResults = 50;
			var fromCache="false";
			
			
			var data = '{"requesttype":"deffeameth","PARAM1":"'+param1+'","PARAM2":"'+param2+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
			ISE_Ajax_Service.ajaxPostReq('DefectLocalizationRestService', 'json', localStorage.authtoken,data,bugpriotization._callBackDefectLocalization);
			
			
		  },
		
		_callBackDefectLocalization:function(data){
			$("#tableBody1").empty();	
			
			
			var newRowContent = '<tr>';
			for(var i=0;i<data.methodsList.length;i++) {
			if (data.methodsList[i] != undefined) {
				newRowContent += '<td id="methodName'+i+'" value="'+ data.methodsList[i]+ '">'+data.methodsList[i] + '</td>';
				}
				else {
					newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
				}
				 
				 if (data.updatedByList[i] != undefined) {
				newRowContent += '<td id="featureval'+i+'" value="'+ data.updatedByList[i]+ '">'+data.updatedByList[i] + '</td>';
				}
				else {
					newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
				}
				
				
				
				 if (data.defectcountList[i] != undefined) {
				newRowContent += '<td id="defcount'+i+'" value="'+ data.defectcountList[i]+ '">'+data.defectcountList[i] + '</td>';
				}
				else {
					newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
				}
				
				if (data.updatedList[i] != undefined) {
				newRowContent += '<td id="featureval'+i+'" value="'+ data.updatedList[i]+ '">'+data.updatedList[i] + '</td>';
				}
				else {
					newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
				}
				
				
				if (data.defectBuildList[i] != undefined) {
				newRowContent += '<td id="featureval'+i+'" value="'+ data.defectBuildList[i]+ '">'+data.defectBuildList[i] + '</td>';
				}
				else {
					newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
				}
				
				
				if (data.featureList[i] != undefined) {
					newRowContent += '<td id="featureval'+i+'" value="'+ data.featureList[i]+ '">'+data.featureList[i] + '</td>';
				}
				else {
					newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
				}
				 			 
				 
				 newRowContent += '<td ><a id="'+data.methodsList[i]+'" type ="button" value="'+data.methodsList[i]+'" onclick="bugpriotization._onView1(this);">' + "Path" + '</a></td>';
				 
				 
				newRowContent+='</tr>';
			}
			$('#tableBody1').last().append(newRowContent);
			
			$('#searchResultsTablebug').removeClass("hide");
			 ISEUtils.portletUnblocking("pageContainer");
			 //for scroll bar
			 $('html,body').animate({scrollTop: $(document).height()}, 600);
			
		},
		
		
		_receivedDefectDetailsByID1: function(data) {
			$("#tableBody1").empty();
			
			var newRowContent = '<tr>';
			   
			for(var i=0;i<data.length;i++) {
			       newRowContent += '<td id="data'+i+'" value="' + data +'">'+ data[i].id+ '</td>';
			     
			       newRowContent += '<td ><a onclick="bugpriotization._onView1(this);">' + data[i].title + '</a></td>';
				
			}
			newRowContent+='</tr>';
			$('#tableBody1').last().append(newRowContent);
			
			$('#searchResultsTablebug').removeClass("hide");

        },
		
		
		_onView1: function(node) {
			
			var projectName = localStorage.getItem('projectName');
			var methodName = node.id;
			var fromCache="false";
			var data = '{"requesttype":"methodpath","PARAM1":"'+methodName+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
			ISE_Ajax_Service.ajaxPostReq('DefectLocalizationRestService', 'json', localStorage.authtoken,data,bugpriotization._methodPathData);
			$('#searchResultsTable2').removeClass("hide");
		 },
		
		
		
		_methodPathData:function(data){
		$("#tableBodyBug").empty();
		
			
			
			var newRowContent	='<tr>	<th id="defectIDHeader"> Method Path</th>	<th id="dateHeader"> Defects Count	</th>	</tr>';
								
			 newRowContent += '<tr>';
			
			for(var i=0;i<data.methodPaths.length;i++) {
			   if (data.methodPaths[i] != undefined) {
				newRowContent += '<td id="methodName'+i+'" value="'+ data.methodPaths[i]+ '">'+data.methodPaths[i] + '</td>';
				}
				else {
					newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
				}
				
				 if (data.methodPathsDefCnt[i] != undefined) {
					newRowContent += '<td id="methodName'+i+'" value="'+ data.methodPathsDefCnt[i]+ '">'+data.methodPathsDefCnt[i] + '</td>';
				}
				else {
					newRowContent += '<td id="featureIdVal'+i+'" value="N.A">N.A</td>';
				}

				 
				 
				newRowContent+='</tr>';
			}
			$('#tableBodyBug').last().append(newRowContent);
			$('#searchResultsTablebug').removeClass("hide");
			
		},
		

        _getTableHeaderLables: function(headerObj) {
			
         $('#sample_4_column_toggler1').empty();
          for(var i=0;i<headerObj.length;i++){
				
            var colunmnID = i+1;
			if(i<9)
            {
            $('#sample_4_column_toggler1').append('<label><input type="checkbox" name="column" checked="true" data-column='+colunmnID+'>'+ headerObj[i].displayName + '</label>');
              }     
           else
          {
             $('#sample_4_column_toggler1').append('<label><input type="checkbox" name="column"  data-column='+colunmnID+'>'+ headerObj[i].displayName + '</label>');
               break;

          }
          
           }

      

            $('#defectIDHeader').text(headerObj[0].displayName);  
			$('#titleHeader').text(headerObj[1].displayName);			
			$('#featureHeader').text(headerObj[2].displayName);			
			$('#priorityHeader').text(headerObj[3].displayName);
			$('#sPriorityHeader').text(headerObj[4].displayName);
			$('#callheader').text(headerObj[5].displayName);            
			$('#ToCallheader').text(headerObj[6].displayName); 
            $('#buildheader').text(headerObj[7].displayName);
            $('#releaseheader').text(headerObj[8].displayName);			
  			
  

        }


    };
