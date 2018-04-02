    var itsassist = {
		
        /* Init function  */
        init: function() { 
			itsassist._CollectionList();
        }, 
		ChangeAnalyze:function(event) {
            if(event.keyCode == 13){			
				itsassist.OnAssist();
			}
        },
		
		// function called display results on enter
		OnAssist:function(){
					
					if ($('#txtAnalyzes').val().length > 2) {
					
					var textSearch =$('#txtAnalyzes').val().trim();
					var Collection = $('#CollectionDList').val();					
					var requestObject = new Object();
					requestObject.collectionName = Collection;
					requestObject.searchString = textSearch;					
					requestObject.maxResults = 10;
					requestObject.analyzer="cess_analyzer";
					//console.log(requestObject);   
					ITS._GetResultSearch(requestObject, itsassist._myCreateResultFunction);
					}
		},
		// function for display collectionlist in dropdown
		_CollectionList:function () {
            $("#CollectionDList").html('');
            var drpOption = '';
            ITS._Getcollection(function (list) {
                for (var cnt = 0; cnt <= list.length-1; cnt++) {
					if(list[cnt].indexOf("chatbot")>-1)
					{
					drpOption += '<option value="' + list[cnt] + '" selected>Default Topic</option>';
					}
					else
					{
					drpOption += '<option value="' + list[cnt] + '">' + list[cnt] + '</option>';
					}                 
                }

                $("#CollectionDList").html(drpOption);
            });

        },
		
		// function for clearing the controls once dropdown selection changed
		_ClearTab:function()
		{
			$('#txtAnalyzes').val('');
			$("#tableBodyAssist").empty(); 
			$('#divmsg').removeClass("hide");
			$('#Resbox').addClass("hide");
		
		},
		
		// function to display results of ITS Assist
		_myCreateResultFunction: function(dataObj) {
			var Collection = $('#CollectionDList').val();		
			var table = $('#ResTable');
			$("#tableBodyAssist").empty(); 
				 var newRowContent = '';
				 var relatedissues="<table class='table table-striped table-bordered table-hover'>";
				 if(dataObj.length>0)
				 {
				
                 for (var i = 0; i < dataObj.length; i++) {	
						if(Collection.indexOf('chatbot')>-1)
						{
							$('#lbhead').addClass("hide");
						
							if(i<1)	
							{
							newRowContent= '<tr><td style="font-size:12px;"><img src="images/up.jpg" alt="up" />&nbsp;' + dataObj[i].title + '</td></tr>';
							}
						}
						else
						{
							$('#lbhead').removeClass("hide");
							if(i<3)			
							{						
								newRowContent += '<tr><td style="font-size:12px;"><img src="images/up.jpg" alt="up" />&nbsp;' + dataObj[i].title + '</td></tr>';
							}
							else
							{
							relatedissues+='<tr><td style="font-size:12px;"><img src="images/greenarrow.png" alt="up" />&nbsp;' + dataObj[i].title + '</td></tr>';
							}
						}
					};
				}
				else
				{
				newRowContent="<tr><td>Result Not Found</td></tr>";
				}
				relatedissues+="</table>";
			$('#tableBodyAssist').last().append(newRowContent);
			$('#dvlatestRes').html(relatedissues);
			
			
			$('#divmsg').addClass("hide");
			$('#Resbox').removeClass("hide");
           
			// ISEUtils.portletUnblocking("pageContainer");

        }  


   };      
