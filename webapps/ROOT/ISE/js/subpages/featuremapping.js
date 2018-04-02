 var featuremapping = {
	m_feature:"",
	m_hasChildrenFeature:true,
	hideTableColumns: new Array(),
	jsonDataCollection: null,
	viewName:"featuremappingView",
	m_srcEvent:"",
	jsonDataCollection:[],
     testdata:'',
     selectRadio:'',
     selectedPrimaryfeature:'',
     primaryFeaetureParent:'',
    secondaryFeatureParent:new Array(),
    primaryParentValue:'',
    primaryValue:'',
	defectIdcountArray:[],
    testcaseIdcountArray:[],
    sourceIdcountArray:[],


    /* Init function  */
    init: function() {		
		var projectName = localStorage.getItem('projectName');
		//ISE.getOrphanResults(projectName, "*", false, featuremapping._receivedFeaturemappingResults);

    ISE.getFeatureMappingResults(projectName, "*", false, featuremapping._receivedFeaturemappingResults);
    
		ISEUtils.initCollectionTables("featuremappingD","defects", featuremapping);
		ISEUtils.initCollectionTables("featuremappingT","testcase", featuremapping);
    ISEUtils.initCollectionTables("featuremappingS","Source", featuremapping);
		ISEUtils.initCollectionTables("featuremappingDP","defects", featuremapping);
		ISEUtils.initCollectionTables("featuremappingTP","testcase", featuremapping);
    ISEUtils.initCollectionTables("featuremappingSP","Source", featuremapping);
        ISE.getFeatures(projectName, featuremapping._receivedFeatures);
		$("#mappingModel").live("click", function(){
            if(ISEUtils.defectIdcount.length>0)
                {
                console.log("defectId>>><<<<<<---->"+ISEUtils.defectIdcount);
                var formedQuery = featuremapping.formQueryForSelectedData(ISEUtils.defectIdcount, featuremapping.m_srcEvent);
                console.log("formedQuery>>><<<<<<---->"+formedQuery);
                
                ISEUtils.defectIdcount = [];
                }
                else
                {
                    alert("please select atleast one checkbox");
                }
            
        });
        
        $("#addMapping").live("click", function(){
            
            if(ISEUtils.defectIdcount.length>0)
                {
                 featuremapping.storeMapedAllSelectedData(ISEUtils.defectIdcount,featuremapping.m_srcEvent);
                    ISEUtils.defectIdcount = [];
                }
                else
                {
                    alert("please select atleast one checkbox");
                }
            
            
        });
        $("#addModel").live("click", function(){
            //console.log("defectId>>><<<<<<---->"+ISEUtils.defectIdcount);
            var finalObj = featuremapping.formQueryForAllSelectedData(ISEUtils.defectIdcount,featuremapping.m_srcEvent);
            console.log("finalObj>>><<<<<<---->"+JSON.stringify(finalObj));
            ISEUtils.defectIdcount = [];
        });
     },
	 
	 _receivedFeatures:function(data) {
            
            featuremapping.testdata=[];
            featuremapping.selectRadio=[];

           
                for(var index in data)
                {

                	 var parentNode=new Array();        	
                 
                  

                   //console.log("111"+data[index].children);

                    for(var i=0;i<data[index].children.length;i++){

                    	var grandChildNode=new Object();
                    	var str= escape(data[index].children[i]);
                    	var primaryParent = escape(data[index].text);
                    	grandChildNode.price1="<input type=radio id=primaryparent name=primary onclick=featuremapping.radioBtnValue(this) primaryParent="+primaryParent+"  value="+str+">";

                        var childNode=new Object();
                    	childNode.text=data[index].children[i];
                    	childNode.data=grandChildNode;
						
                    	parentNode.push(childNode);                    	

                    	}
                        console.log(data[index].children);
                    	var parentData=new Object();
                    	var str= escape(data[index].text);
                    	var primaryParent = "null"

         
                    	parentData.price1="<input type=radio id=primaryparent name=primary onclick=featuremapping.radioBtnValue(this) primaryParent="+primaryParent+" value="+str+">";
                         
                    	featuremapping.testdata.push({

                    	"text":data[index].text,
                    	"data": parentData,                   	
                    	"children":parentNode

                    })

                }
             


     $("#tree_21").bind("loaded_grid.jstree",function(){
                $("span#xstatus").text("loaded");
        });
           
        $("#tree_21").jstree({
          plugins: ["themes","json","state","featuremapping","checkbox","button","grid","dnd"],
          core: {

            data: featuremapping.testdata
          },
          grid: {
            columns: [
              {width: 50, header: "",title:"_DATA_"},
              {cellClass: "col1", value: "price1", width: 60, header: "Primary Feature", title:""},
              
            ]
          },

          dnd: {
                    drop_finish : function () { 
                    }, 
                    drag_finish : function () { 
                    }, 
                    drag_check : function (data) { 
                        return { 
                            after : true, 
                            before : true, 
                            inside : true 
                        }; 
                    } 
          }
        });

 
	 },


      saveChanges:function(){

        var selectedElmsIds = [];
        var selectedElmsIdsParents = [];

        var selectedElms = $('#tree_21').jstree("get_selected", true);
        var arr =[];
               
        

               for(var index=0;index<selectedElms.length;index++){
                selectedElmsIds.push(selectedElms[index].text);
                var parentNode1 = document.getElementById(selectedElms[index].parent);
              
                if(parentNode1 != null){

                  var id = document.getElementById(selectedElms[index].parent).getAttribute("id");

                    arr.push($('#'+id).find('a').attr('title'));

                }

              
                
               }
               selectedElmsIds.splice(_.indexOf(selectedElmsIds, _.findWhere(selectedElmsIds,featuremapping.selectedPrimaryfeature )), 1);
              
                

                //console.log(selectedElmsIds);
                //console.log(arr);
             
               // To Fetch Secondary Features List

                var finalSecondaryFeaturesList = [];
                $.grep(selectedElmsIds, function (element) {

            if ($.inArray(element, arr) == -1)
              finalSecondaryFeaturesList.push(element)

           

               
           

        });

               console.log("primary feature: "+featuremapping.primaryValue);
               console.log("Primary feature parent: "+featuremapping.primaryParentValue);
              //console.log("Secondary features:  "+finalSecondaryFeaturesList);
              arr.splice(_.indexOf(arr, _.findWhere(arr,featuremapping.primaryParentValue )), 1);
              //console.log("Secondary feature Parent:" +arr);
       
              
     //starts fm
      var secondayFeatures = [];
              for(var i=0;i<finalSecondaryFeaturesList.length;i++){
              
                var parentfea = arr[i];
                if(arr[i] == undefined){
          parentfea = "N.A";
                }
        console.log(finalSecondaryFeaturesList[i]+  "-$-"+parentfea)
        secondayFeatures.push(finalSecondaryFeaturesList[i]+  "-$-"+parentfea);

              }
              
              //console.log("defectIdcount----"+ISEUtils.defectIdcount.length);
              //console.log("defectIdcount val----"+ISEUtils.defectIdcount[0]);


               //console.log("Primary feature parent: "+orphans.primaryParentValue);
			   console.log("--------collection Name ----"+ISEUtils.colectionName);
			   var collectionNameT;
			   if(ISEUtils.colectionName == "Defects"){
					collectionNameT = "defects";
				}
				else if(ISEUtils.colectionName == "TestCase"){
					collectionNameT = "testcases";
				}
				else {
					collectionNameT = "source";
				}

				console.log("collectionNameT---------"+collectionNameT);
				for (var i=0;i<ISEUtils.defectIdcount.length;i++)
				{
					var secondFeatFormation = [];
				
					for (var j=0;j<secondayFeatures.length;j++)
					{
					  var secondFeaSplit = secondayFeatures[j].split("-$-");
					  var secondFea = {};
					  secondFea = { "feature" : secondFeaSplit[0] , "featureParent" : secondFeaSplit[1] , "frequency" : "0.0"} ;
					  secondFeatFormation.push(secondFea);
					}
					
					
					console.log("mapping element ids----"+ISEUtils.defectIdcount[i]);
					
					
					var primaryParentData = (featuremapping.primaryParentValue == "null")?"N.A":featuremapping.primaryParentValue
					if(featuremapping.primaryValue == "") {
					console.log("parent feature not selected, Thus data not saved in database");
					return;
					}
					var jsonStrObj ={ "primary_feature" : featuremapping.primaryValue , "primary_feature_parent" : primaryParentData , "secondary_feature" : { "featureList" : secondFeatFormation} , "mapped" : "manuallymapped"};
					//var jsonString='{"requesttype":"updateObjectModel","collection":"defects","columnname":"_id","columnvalue":"'+ISEUtils.defectIdcount[i]+'","object":'+JSON.stringify(jsonStrObj)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}';
					var jsonString='{"requesttype":"updateObjectModel","collection":"'+collectionNameT+'","columnname":"_id","columnvalue":"'+ISEUtils.defectIdcount[i]+'","object":'+JSON.stringify(jsonStrObj)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}';
					 console.log("jsonstring data chanding defects---"+JSON.stringify(jsonStrObj))
					ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString,featuremapping._receivedFeaturemappingResultsFlag);
				
				
				
				}

     //starts end
                
		 $('#tree_21').jstree(true).deselect_all();
		   refresh=true;
		  $("#tree_21").jstree("refresh");
		  $("#tree_21").jstree("deselect_all");
		  $('input[name="primary"]').attr('checked', false);
		  
		  $('#largefeature').modal('hide');
           $('#large2').modal('hide');
		   
		window.location.reload(true)

             
      },

//_receivedOrphanResultsFlag:function(data){
    //  console.log("result---"+JSON.stringify(data));
    
   // },
    



       



		_receivedFeaturemappingResultsFlag:function(data){
		console.log("result---"+JSON.stringify(data));
		
		},
	 	  
	_receivedFeaturemappingResults:function(data){

    //console.log("------featuremapping data $$$$$-----"+JSON.stringify(data));
    //console.log("-----------fmlength---"+JSON.stringify(data));
		if(null !=data && undefined != data && data.length>0){
			for (var i=0;i<data.length;i++)
			{
				
				if(data[i].subfeatures.length>0 && data[i].name==""){
					for(var j=0; j<data[i].subfeatures.length; j++){
						featuremapping._addTableRowFeaturemappingResults(data[i],j)
					}
				}else{
					featuremapping._addTableRowFeaturemappingResults(data[i]);
				}
			}

            

        /* Formatting function for row expanded details */
       

         var oTable = $('#sample_2').dataTable({


		"dom": 'frtTip',
		"tableTools": {
		"sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
		"aButtons": [{
			'sExtends': "csv"
								}],
	},
            
            
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
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
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            "order": [
                [0, 'asc']
            ],
            "lengthMenu": [
                [10, 20, 30, -1],
                [10, 20, 30, "All"] // change per page values here
            ],

            // set the initial value
            "pageLength": 10,
          

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
            // So when dropdowns used the scrollable div should be removed. 
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

           
        });



         // $('#sample_2_filter').addClass("hide");
          // $('#sample_2_wrapper').addClass("hide");
          





		}
	},
	  
	addFeaturemappingBucket:function(eachFeature,isPopup) {
		
		if(eachFeature.name !="n.a"){
  
			var tableRow ="<tr>"
         tableRow+="<td>"+eachFeature.name+"</td>";
        
        //console.log("----323----"+eachFeature.name);
         if(eachFeature.testcases!=0)
         tableRow+="<td><a data-toggle='modal' onclick=featuremapping.renderPopupP('"+escape(eachFeature.name)+"','TC'); href=#largefeatureP>"+eachFeature.testcases+"</a></td>";
         else
          tableRow+="<td style=color:#7dc1eb >"+eachFeature.testcases+"</td>";
        if(eachFeature.defects!=0)
         tableRow+="<td><a data-toggle='modal' onclick=featuremapping.renderPopupP('"+escape(eachFeature.name)+"','DEF'); href=#largefeatureP>"+eachFeature.defects+"</a></td>";
        else
          tableRow+="<td style=color:#7dc1eb >"+eachFeature.defects+"</td>";
         if(eachFeature.source!=0)
         tableRow+="<td><a data-toggle='modal' onclick=featuremapping.renderPopupP('"+escape(eachFeature.name)+"','SRC'); href=#largefeatureP>"+eachFeature.source+"</a></td>";
       else
	   tableRow+="<td style=color:#7dc1eb >"+eachFeature.source+"</a></td>";
         //tableRow+="<td><a data-toggle='modal' onclick=featuremapping.renderPopupP('"+eachFeature.name+"','ED'); href=#largefeatureP>"+eachFeature.extDefCount+"</a></td>";
        // tableRow+="<td><a data-toggle='modal' onclick=featuremapping.renderPopupP('"+eachFeature.name+"','EDO'); href=#largefeatureP>"+eachFeature.extOrphDefCount+"</a></td>";
			$('#featuremappingPopupTablebody').append(tableRow);
			$('#sample_21_wrapper1').removeClass("hide");

		}	
		
	},

    

	_addTableRowFeaturemappingResults:function(eachFeature, subFeatureDataInc=null){
    //console.log("------339-----"+JSON.stringify(eachFeature));
   
      //$('#featuremapping_TablePopup').("hide");
    if(eachFeature.name != undefined && eachFeature.name != 'n.a' && eachFeature.name != 'N.A'){
		
		var hasChildrenFeature = true;
		if(eachFeature.name=="" && subFeatureDataInc!=null){
			
			var feature_name = eachFeature.subfeatures[subFeatureDataInc].name;
			hasChildrenFeature = false;

		}else{
			var feature_name = eachFeature.name;
		}
    var tableRow ="<tr>"

         tableRow+="<td>"+feature_name+"</td>";

         var featureValue = escape(feature_name);
         //tableRow+="<td>"+eachFeature.tcCount+"</td>";
         
		if(featureValue != "Unmapped"){
		if(eachFeature.totaltestcases!=0)
           tableRow+="<td><a data-toggle='modal' onclick=featuremapping.renderPopup('"+featureValue+"','TC','"+hasChildrenFeature+"'); href=#largefeature >"+eachFeature.totaltestcases+"</a></td>";
         else
          tableRow+="<td style=color:#7dc1eb >"+eachFeature.totaltestcases+"</td>";
         
         if(eachFeature.totaldefects!=0)
         tableRow+="<td><a data-toggle='modal' onclick=featuremapping.renderPopup('"+featureValue+"','DEF','"+hasChildrenFeature+"'); href=#largefeature >"+eachFeature.totaldefects+"</a></td>";
         else
          tableRow+="<td style=color:#7dc1eb >"+eachFeature.totaldefects+"</td>";

        if(eachFeature.totalsource!=0)
         tableRow+="<td><a data-toggle='modal' onclick=featuremapping.renderPopup('"+featureValue+"','SRC','"+hasChildrenFeature+"'); href=#largefeature >"+eachFeature.totalsource+"</a></td>";
        else
          tableRow+="<td style=color:#7dc1eb >"+eachFeature.totalsource+"</td>";
         //tableRow+="<td><a data-toggle='modal' onclick=featuremapping.renderPopup('"+eachFeature.name+"','ED'); href=#largefeature >"+eachFeature.extDefCount+"</a></td>";
         //tableRow+="<td><a data-toggle='modal' onclick=featuremapping.renderPopup('"+eachFeature.name+"','EDO'); href=#largefeature >"+eachFeature.extOrphDefCount+"</a></td>";
         //tableRow+="<td>"+eachFeature.intDefCount+"</td>";
        // tableRow+="<td>"+eachFeature.intOrphDefCount+"</td>";
         //tableRow+="<td>"+eachFeature.extDefCount+"</td>";
         //tableRow+="<td>"+eachFeature.extOrphDefCount+"</td>";
		 }
		 else{
		if(eachFeature.totaltestcases!=0)
           tableRow+="<td><a data-toggle='modal' onclick=featuremapping.renderPopupP('"+featureValue+"','TC'); href=#largefeature >"+eachFeature.totaltestcases+"</a></td>";
         else
          tableRow+="<td style=color:#7dc1eb >"+eachFeature.totaltestcases+"</td>";
         
         if(eachFeature.totaldefects!=0)
         tableRow+="<td><a data-toggle='modal' onclick=featuremapping.renderPopupP('"+featureValue+"','DEF'); href=#largefeature >"+eachFeature.totaldefects+"</a></td>";
         else
          tableRow+="<td style=color:#7dc1eb >"+eachFeature.totaldefects+"</td>";

        if(eachFeature.totalsource!=0)
         tableRow+="<td><a data-toggle='modal' onclick=featuremapping.renderPopupP('"+featureValue+"','SRC'); href=#largefeature >"+eachFeature.totalsource+"</a></td>";
		else
          tableRow+="<td style=color:#7dc1eb >"+eachFeature.totalsource+"</td>";

		}
       $("#featuremappingTablebody").append(tableRow);
     }

  },




	trimText:function(text, len) {
		if(text.length < 25)
			return text;
		else
			return text.substring(0,len)+"...";
	},
	
	renderPopup:function(feature,srcEvent) {
    console.log("-----371-----")
		featuremapping.m_srcEvent=srcEvent;
		$('#featuremappingPopupTablebody').html('');
		$('#searchResultsTable_featuremappingD').hide();
		$('#searchResultsTable_featuremappingT').hide();
		$('#searchResultsTable_featuremappingS').hide();
		$('#btn_change').hide();
		$('#featuremapping_TablePopup').show();
			
		var projectName = localStorage.getItem('projectName');
		var filter = 'primary_feature_parent:"'+unescape(feature)+'" primary_feature:"'+unescape(feature)+'"';
		console.log("----379----"+filter);
    featuremapping.m_feature = unescape(feature);
    console.log("----381----"+unescape(feature));
		//ISE.getOrphanResults(projectName, filter, true, featuremapping._receivedFeaturemappingResultsPopup);
    ISE.getFeatureMappingResults(projectName, filter, true, featuremapping._receivedFeaturemappingResultsPopup);
  },
  

	_receivedFeaturemappingResultsPopup:function(data){

    console.log("----338 suresh--"+JSON.stringify(data));
		if(null !=data && undefined != data && data.length>0){
      //alert("hi")
			for (var i=0;i<data.length;i++)
        //sub features available
				featuremapping.addFeaturemappingBucket(data[i], true);
		}
		else {

		
			var filter = 'primary_feature_parent:"'+featuremapping.m_feature+'" primary_feature:"'+featuremapping.m_feature+'"';
			console.log("-----------346 filter-----"+filter);
      /*if(featuremapping.m_srcEvent == "ID")
				filter = filter +'  AND internaldefect: \"1\" AND _exists_:testcases';
			if(featuremapping.m_srcEvent == "IDO")
				filter = filter +'  AND internaldefect: \"1\" AND _missing_:testcases';
			if(featuremapping.m_srcEvent == "ED")
				filter = filter +'  AND internaldefect: \"0\" AND _exists_:testcases';
			if(featuremapping.m_srcEvent == "EDO")
				filter = filter +'  AND internaldefect: \"0\" AND _missing_:testcases';*/
				
			var requestObject = new Object();

                requestObject.title = "";
                requestObject.searchString = filter.replace(/\//g, " ");
                requestObject.filterString = "";
                requestObject.projectName = localStorage.getItem('projectName');;
                requestObject.maxResults = 10000; //need to see available results
                requestObject.serachType = "";
				if(featuremapping.m_srcEvent == "TC")
					requestObject.collectionName = "testcase_collection";
				else if(featuremapping.m_srcEvent == "DEF")
					requestObject.collectionName = "defect_collection";
				else if(featuremapping.m_srcEvent == "SRC")
				  requestObject.collectionName = "sourcecode_collection";
				  
				ISE.getSearchResults(requestObject, featuremapping._receivedSearchResults);

		}
	},
	_receivedSearchResults:function(dataObj) {


		if(featuremapping.m_srcEvent == "TC") {
			$('#searchResultsTable_featuremappingT').show();
			ISEUtils.populateResultsDefFM(dataObj,"featuremappingT","TestCase",featuremapping);
		}
		else if(featuremapping.m_srcEvent == "DEF") {
			$('#searchResultsTable_featuremappingD').show();
			ISEUtils.populateResultsDefFM(dataObj,"featuremappingD","Defects",featuremapping);
		}else if(featuremapping.m_srcEvent == "SRC") {
			$('#searchResultsTable_featuremappingS').show();
			ISEUtils.populateResultsDefFM(dataObj,"featuremappingS","Source",featuremapping);

    }

	},
	
	renderPopupP:function(feature,srcEvent, has_children="true") {
	
	if(feature == "Unmapped" || has_children=="false"){
	
				ISEUtils.portletBlocking("pageContainer");
				//$('#largefeature').modal('hide');
				featuremapping.m_feature =unescape(feature);
				featuremapping.m_hasChildrenFeature = false;
				console.log("----440----"+unescape(feature));
				featuremapping.m_srcEvent=srcEvent;
				//$('#orphan_BucketsPopup').empty();
				$('#featuremapping_TablePopup').hide();
				$('#btn_change').show();
				
				

				$('#searchResultsTable_featuremappingD').hide();
				$('#searchResultsTable_featuremappingT').hide();
				$('#searchResultsTable_featuremappingS').hide();
			
			
				
				$('#searchResultsTable_featuremappingDP').hide();
				$('#searchResultsTable_featuremappingTP').hide();
				$('#searchResultsTable_featuremappingSP').hide();
			   if(has_children=="false")
				var filter = 'primary_feature_parent:"'+featuremapping.m_feature+'" primary_feature:"'+featuremapping.m_feature+'"';
				//featuremapping.m_srcEvent=srcEvent;
				var requestObject = new Object();

                requestObject.title = "";
                requestObject.projectName = localStorage.getItem('projectName');;
                requestObject.maxResults = 10000; //need to see available results
                requestObject.serachType = "";
				if(has_children=="false")
					requestObject.searchString = filter.replace(/\//g, " ");
				if(featuremapping.m_srcEvent == "TC")
					requestObject.collectionName = "testcase_collection";
				else if(featuremapping.m_srcEvent == "DEF")
					requestObject.collectionName = "defect_collection";
				else if(featuremapping.m_srcEvent == "SRC") 
					requestObject.collectionName = "sourcecode_collection";
				if(has_children=="false")
				ISE.getSearchResults(requestObject, featuremapping._receivedSearchResultsP);
				else
				ISE.getNoFeatureSearchResults(requestObject, featuremapping._receivedSearchResultsP);
	
	//ISE.getNoFeatureSearchResults(requestObject, featuremapping._receivedSearchResultsP);
	}else{
		ISEUtils.portletBlocking("largefeature");
		featuremapping.m_feature =unescape(feature);
		featuremapping.m_hasChildrenFeature = true;
    console.log("----440----"+unescape(feature));
		featuremapping.m_srcEvent=srcEvent;
		//$('#orphan_BucketsPopup').empty();
		$('#searchResultsTable_featuremappingDP').hide();
		$('#searchResultsTable_featuremappingTP').hide();
		$('#searchResultsTable_featuremappingSP').hide();
			
		var filter = 'primary_feature_parent:"'+featuremapping.m_feature+'" primary_feature:"'+featuremapping.m_feature+'"';
			/*if(featuremapping.m_srcEvent == "ID")
				filter = filter +'  AND internaldefect: \"1\" AND _exists_:testcases';
			if(featuremapping.m_srcEvent == "IDO")
				filter = filter +'  AND internaldefect: \"1\" AND _missing_:testcases';
			if(featuremapping.m_srcEvent == "ED")
				filter = filter +'  AND internaldefect: \"0\" AND _exists_:testcases';
			if(featuremapping.m_srcEvent == "EDO")
				filter = filter +'  AND internaldefect: \"0\" AND _missing_:testcases';*/
				
			var requestObject = new Object();

                requestObject.title = "";
                requestObject.searchString = filter.replace(/\//g, " ");
                requestObject.filterString = "";
                requestObject.projectName = localStorage.getItem('projectName');;
                requestObject.maxResults = 10000; //need to see available results
                requestObject.serachType = "";
				if(featuremapping.m_srcEvent == "TC")
					requestObject.collectionName = "testcase_collection";
				else if(featuremapping.m_srcEvent == "DEF")
					requestObject.collectionName = "defect_collection";
				else if(featuremapping.m_srcEvent == "SRC") 
					requestObject.collectionName = "sourcecode_collection";
									
				ISE.getSearchResults(requestObject, featuremapping._receivedSearchResultsP);
				}
				
	},
	
	/*_receivedSearchResultsP:function(dataObj) {
		if(featuremapping.m_srcEvent == "TC") {
			$('#searchResultsTable_featuremappingTP').show();
			//$('#changeFeatureBtn').removeClass("hide");
			//$('#applyBtn').removeClass("hide");
			
			ISEUtils.populateResultsDefFM(dataObj,"featuremappingTP","TestCase",featuremapping);
		}
		else if(featuremapping.m_srcEvent == "DEF"){

      //console.log("-----428-----eswar--"+JSON.stringify(dataObj));
			$('#searchResultsTable_featuremappingDP').show();
			//$('#changeFeatureBtn').removeClass("hide");
			//$('#applyBtn').removeClass("hide");
			ISEUtils.populateResultsDefFM(dataObj,"featuremappingDP","Defects",featuremapping);
		}
    else if(featuremapping.m_srcEvent == "SRC"){
      //for source
     // console.log("-----428-----eswar--"+JSON.stringify(dataObj));
      $('#searchResultsTable_featuremappingSP').show();
      //$('#changeFeatureBtn').removeClass("hide");
      //$('#applyBtn').removeClass("hide");
      ISEUtils.populateResultsDefFM(dataObj,"featuremappingSP","Source",featuremapping);
    }
	
	},*/
	
	_receivedSearchResultsP:function(dataObj) {
	
		if(featuremapping.m_srcEvent == "TC") {
			//$('#searchResultsTable_featuremappingTP').show();
			
			//$('#changeFeatureBtn').removeClass("hide");
			//$('#applyBtn').removeClass("hide");
			
			//ISEUtils.populateResultsDefFM(dataObj,"featuremappingTP","TestCase",featuremapping);
			if(featuremapping.m_feature =="Unmapped"|| featuremapping.m_hasChildrenFeature ==false)
			{
			$('#searchResultsTable_featuremappingD').hide();
			$('#btn_change').show();
				$('#searchResultsTable_featuremappingT').show();
			  ISEUtils.populateResultsDefFM(dataObj,"featuremappingT","TestCase",featuremapping);
			  }
			else{
			
				$('#searchResultsTable_featuremappingTP').show();
			  ISEUtils.populateResultsDefFM(dataObj,"featuremappingTP","TestCase",featuremapping);
			  }
		}
		else if(featuremapping.m_srcEvent == "DEF" ){

			//console.log("-----428-----eswar--"+JSON.stringify(dataObj));
			
			//$('#changeFeatureBtn').removeClass("hide");
			//$('#applyBtn').removeClass("hide");
			if(featuremapping.m_feature =="Unmapped"|| featuremapping.m_hasChildrenFeature ==false)
			{
			$('#btn_change').show();
				$('#searchResultsTable_featuremappingD').show();
			  ISEUtils.populateResultsDefFM(dataObj,"featuremappingD","Defects",featuremapping);
			  }
			else{
			
				$('#searchResultsTable_featuremappingDP').show();
			  ISEUtils.populateResultsDefFM(dataObj,"featuremappingDP","Defects",featuremapping);
			  }
		}
    else if(featuremapping.m_srcEvent == "SRC"){
      //for source
     // console.log("-----428-----eswar--"+JSON.stringify(dataObj));
     // $('#searchResultsTable_featuremappingSP').show();
      //$('#changeFeatureBtn').removeClass("hide");
      //$('#applyBtn').removeClass("hide");
      //ISEUtils.populateResultsDefFM(dataObj,"featuremappingSP","Source",featuremapping);
	  if(featuremapping.m_feature =="Unmapped"|| featuremapping.m_hasChildrenFeature ==false)
			{
			$('#btn_change').show();
				$('#searchResultsTable_featuremappingD').hide();
				$('#searchResultsTable_featuremappingS').show();
			  ISEUtils.populateResultsDefFM(dataObj,"featuremappingS","Source",featuremapping);
			  }
			else{
			
				$('#searchResultsTable_featuremappingSP').show();
			  ISEUtils.populateResultsDefFM(dataObj,"featuremappingSP","Source",featuremapping);
			  }
    }
	
	},
	changeFeatureBtnHandler:function(){

		
       console.log("defectId>>><<<<<<---->"+ISEUtils.defectIdcount);

      featuremapping.secondaryFeatureParent = new Array();
		

		if(ISEUtils.defectIdcount.length>0)
		{
		  $('#large2').modal("show");
		}
		else
		{
			alert("please select atleast one checkbox");
		}
		
		
		

		
	},
	radioBtnValue:function(event){

	
		featuremapping.primaryValue = unescape($(event).attr("value"))
    
    featuremapping.primaryParentValue  = unescape($(event).attr("primaryParent"));

      featuremapping.selectedPrimaryfeature = featuremapping.primaryValue;

		//console.log("primary feature: "+primaryValue);
		//console.log("primary feature parent: "+primaryValue.getParent);


               	
               	
          },
		
	
	
	clearCheckboxes:function(){
		$('#tree_21').jstree(true).deselect_all();
		   refresh=true;
			$("#tree_21").jstree("refresh");
			$("#tree_21").jstree("deselect_all");
			$('input[name="primary"]').attr('checked', false);

	},

	

	uiGetParents:function(loSelectedNode) {
        try {
           var loData = [];
            var lnLevel = loSelectedNode.node.parents.length;
            var lsSelectedID = loSelectedNode.node.id;
            var loParent = $("#" + lsSelectedID);
            var lsParents =  loSelectedNode.node.text + ' >';
            loData.push(loSelectedNode.node.text);
            for (var ln = 0; ln <= lnLevel -1 ; ln++) {
                var loParent = loParent.parent().parent();
             
                if (loParent.children()[2] != undefined) {
                    lsParents += loParent.children()[2].text + " > ";
                    loData.push(loParent.children()[2].text);                    
                }
            }
            if (lsParents.length > 0) {
                lsParents = lsParents.substring(0, lsParents.length - 1);
            }
            loData.reverse();         
            return loData;
        }
        catch (err) {
            console.log('Error in uiGetParents');
        }
    },
	
	formQueryForSelectedData: function(data_ary, m_src_event){
        if(data_ary.length>0){
            /* if(m_src_event == "TC") {
                featuremapping.testcaseIdcountArray = data_ary;
                var jsonData = '{TESTCASES:'+JSON.stringify(featuremapping.testcaseIdcountArray)+'}';
            }
            else if(m_src_event == "DEF") {
                featuremapping.defectIdcountArray = data_ary;
                var jsonData = '{DEFECTS:'+JSON.stringify(featuremapping.defectIdcountArray)+'}';
            }
            else if(m_src_event== "SRC") {
                featuremapping.sourceIdcountArray = data_ary;
                var jsonData = '{SOURCE:'+JSON.stringify(featuremapping.sourceIdcountArray)+'}';
            }
        
        return jsonData; */
        
        var jsonData = {};
        
         if(m_src_event == "DEF") {
             featuremapping.defectIdcountArray = data_ary;
            jsonData.DEFECTS = featuremapping.defectIdcountArray;
        } else if(m_src_event == "TC") {
            featuremapping.testcaseIdcountArray = data_ary;
            jsonData.TESTCASES = featuremapping.testcaseIdcountArray;
        }
        else if(m_src_event== "SRC") {
            featuremapping.sourceIdcountArray = data_ary;
            jsonData.SOURCE = featuremapping.sourceIdcountArray;
        }
        
        jsonData.requesttype = "model";
        jsonData.modeltype = "18";
        
        console.log("==833=="+JSON.stringify(jsonData));
        ISE_Ajax_Service.ajaxPostReq('IndexingRestService', 'json', localStorage.authtoken,JSON.stringify(jsonData),featuremapping.callBackMappingModel);
        
        
        
        }
    },
    storeMapedAllSelectedData: function(data_ary, m_src_event){
                 
        if(data_ary.length>0){
            if(m_src_event == "TC") {
                featuremapping.testcaseIdcountArray = data_ary;
            }
            else if(m_src_event == "DEF") {
                featuremapping.defectIdcountArray = data_ary;
            }
            else if(m_src_event== "SRC") {
                featuremapping.sourceIdcountArray = data_ary;
            }
        }
    },
    formQueryForAllSelectedData: function(data_ary, m_src_event){
        
        var jsonData = {};
        
        if(featuremapping.defectIdcountArray.length>0){
            jsonData.DEFECTS = featuremapping.defectIdcountArray;
        }
        if(featuremapping.testcaseIdcountArray.length>0){
            jsonData.TESTCASES = featuremapping.testcaseIdcountArray;
        }
        if(featuremapping.sourceIdcountArray.length>0){
            jsonData.SOURCE = featuremapping.sourceIdcountArray;
        }
        
        jsonData.requesttype = "model";
        jsonData.modeltype = "18";
        
        console.log("==837=="+JSON.stringify(jsonData));
        ISE_Ajax_Service.ajaxPostReq('IndexingRestService', 'json', localStorage.authtoken,JSON.stringify(jsonData),featuremapping.callBackMappingModel);
        
        return jsonData;
    },
    callBackMappingModel : function(data){
        
        console.log(JSON.stringify(data));
    },


	
};

