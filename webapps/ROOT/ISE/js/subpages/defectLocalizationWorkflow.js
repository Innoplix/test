
 var defectLocalizationWorkflow = {

     projectName:'',
     
      /* Init function  */
      init: function()
      {
       if (!jQuery().datetimepicker) {
            return;
        }

        defectLocalizationWorkflow.projectName = localStorage.getItem('projectName');
    },

     
    getInitializeData:function(defectdataObj,sourceCodeCollectionObject,dlData){
		var fromCache="false";
		var projectName = localStorage.getItem('projectName');
		var data = '{"requesttype":"amalgamlocalization","PARAM1":"'+dlData+'","projectName":"'+projectName+'","fromCache":"'+fromCache+'"}';
		ISE_Ajax_Service.ajaxPostReq('DefectLocalizationRestService', 'json', localStorage.authtoken,data,defectLocalizationWorkflow._dlresultsFileScores);
	},
		
	 _dlresultsFileScores:function(dataValue){
		 var dlData = dataValue.organizations;
		 $('#developerWorkFlowTableBody').html('')
		var newRowContent = "";
		for(var dl=0;dl<dlData.length;dl++){
			var dlFileScore = JSON.stringify(dlData[dl]).split(":")
			 newRowContent = newRowContent+'<tr>';                
			newRowContent += '<td>' +dlFileScore[0].substring(2).substring(0, dlFileScore[0].substring(3).length - 0) +'</td>'
			newRowContent += '<td>' + dlFileScore[1].substring(1).substring(0, dlFileScore[1].substring(1).length - 2) +'</td>'
			newRowContent += '</tr>';
			
		 } 
		$('#developerWorkFlowTable12').append(newRowContent);
		//$('#developerWorkFlowTable12').dataTable();
		$('#developerWorkFlowTable12').DataTable( {
			"ordering": false
		} );
		ISEUtils.portletUnblocking("developerWorkFlowPortlet");
	 }

  };
