
 var developerworkflow = {

	defectdataObj:[],
     sourceCodeCollectionObject:[],
	   defectCollectionObject:[],
     primaryFeature_defectID:'',
     reqDeveloper_WorkFlow: new Array(),
     filesStartDate:'',
     projectName:'',
	 defectArrayList :[],
	 sourceArrayList:[],
	 lastArray:[],
	 projectName:localStorage.getItem('projectName'),
	 date:'',
	 resultForDisplay:[],
	 fileArray:[],
	BugIntroducedDays:'',
	Daystocalculatebugginessofafile:'',
	Weightageforsimilardefectscore:'',
	Weightageforfilematchscore:'',
	Weightageforbuggyscore:'',
	Cutoffforsimilarity:'',
	
     /************  Below Uncomment the Line Numbers to set the end date : 157,373,378,386,393  ******************/
     
      /* Init function  */
      init: function()
      {
	  //alert('hi');
           	
      /* $.getJSON("json/defectLocalizationConfiguration.json?"+Date.now(), function(data) {
			
		console.log("data"+data)
		developerworkflow.BugIntroducedDays  = data.BugIntroducedDays 
		developerworkflow.Daystocalculatebugginessofafile  = data.Daystocalculatebugginessofafile 
		developerworkflow.Weightageforsimilardefectscore  = data.Weightageforsimilardefectscore 
		developerworkflow.Weightageforfilematchscore  = data.Weightageforfilematchscore 
		developerworkflow.Weightageforbuggyscore  = data.Weightageforbuggyscore 
		developerworkflow.Cutoffforsimilarity   = data.Cutoffforsimilarity 
		getInitializeData(defectdataObj,sourceCodeCollectionObject,defectFilesCollectionObject)
		}); */
        
    },
	getInitializeData:function(defectdataObj,sourceCodeCollectionObject,defectFilesCollectionObject,deploymenttype){
	/* $.getJSON("json/DynamicTabArray.json?"+Date.now(), function(data) {
	console.log(data.Days when the bugs would have probable introduced before the reported date)
	
	}); */
	
       
                          
                        //   defectsearch.sourceCollectionResults = new Array();
                         // defectsearch.defectCollectionObject = new Array();
                         
	 $.getJSON("json/defectLocalizationConfiguration.json?"+Date.now(), function(data) {
			
		//console.log("data"+data)
		developerworkflow.BugIntroducedDays  = data.BugIntroducedDays 
		developerworkflow.Daystocalculatebugginessofafile  = data.Daystocalculatebugginessofafile 
		developerworkflow.Weightageforsimilardefectscore  = data.Weightageforsimilardefectscore 
		developerworkflow.Weightageforfilematchscore  = data.Weightageforfilematchscore 
		developerworkflow.Weightageforbuggyscore  = data.Weightageforbuggyscore 
		developerworkflow.Cutoffforsimilarity   = data.Cutoffforsimilarity 
		developerworkflow.featureMappingScore   = data.featureMappingScore 
		developerworkflow.deploymenttype = deploymenttype;
		
            developerworkflow.defectArrayList =[];
			developerworkflow.sourceArrayList =[];
			developerworkflow.lastArray =[];
			developerworkflow.fileArray =[];
			developerworkflow.defectdataObj = new Object();
          if(ISEUtils.validateObject(defectdataObj)){
			$('#developerWorkFlowTableBody').html('')	
            developerworkflow.sourceCodeCollectionObject = []; 
			developerworkflow.defectCollectionObject = [];
			developerworkflow.defectdataObj = [];
			
			 developerworkflow.sourceCodeCollectionObject = sourceCodeCollectionObject; 
			developerworkflow.defectCollectionObject = defectFilesCollectionObject;
			developerworkflow.defectdataObj = defectdataObj;
			
				developerworkflow.date = defectdataObj[0].date;
			
			developerworkflow._modifyCollectionData();
			
			}
			
        
	});	
	},
	 _closeme:function()
   {
   $('#developerWorkFlowWindow').modal('hide');
   },
	_modifyCollectionData()
	{
	$('#developerWorkFlowTableBody').html('')
	document.getElementById("textforcheckbox").innerHTML = "<label data-localize='language.Display the results from'>Display the results from</label><a style='text-decoration:underline;' title='Click to change the value' onclick= developerworkflow._changeConfigurations(true) >"+ISEUtils.formatDate(developerworkflow.date) +"</a> <label data-localize='language.to'>to &nbsp;</label><a style='text-decoration:underline;' title='Click to change the value' onclick= developerworkflow._changeConfigurations(true) >"+developerworkflow.BugIntroducedDays +"</a><label data-localize='language.days past'>days past</label>"
	developerworkflow.lastArray =[];
		var sourceArray = new Array();
			var defectsArray = new Array();
			developerworkflow.defectArrayList =[];
			developerworkflow.sourceArrayList =[];
			developerworkflow.lastArray =[];
			developerworkflow.fileArray =[];
			for(var src=0;src<developerworkflow.sourceCodeCollectionObject.length;src++)
			{
				if(developerworkflow.sourceCodeCollectionObject[src].similarity>developerworkflow.Cutoffforsimilarity)
				{
					var eachobj = new Object();
					// cisco condition to be added
					if(developerworkflow.deploymenttype  == "CISCO")
					{
					eachobj.file = developerworkflow.sourceCodeCollectionObject[src].fileslist.trim();;
					eachobj.title = developerworkflow.sourceCodeCollectionObject[src].filediff;
					//eachobj.description =  developerworkflow.sourceCodeCollectionObject[src].description;
					eachobj.similarity =  developerworkflow.sourceCodeCollectionObject[src].similarity;
					}
				
					else
					{
					eachobj.file = developerworkflow.sourceCodeCollectionObject[src].files.trim();
					eachobj.title = developerworkflow.sourceCodeCollectionObject[src].title;
					eachobj.description =  developerworkflow.sourceCodeCollectionObject[src].description;
					eachobj.similarity =  developerworkflow.sourceCodeCollectionObject[src].similarity;
					}
					sourceArray.push(eachobj);
				}
			}
			developerworkflow.sourceArrayList = developerworkflow._calculatefileSummation(sourceArray,"srccollection"); 
			
			var diffval =0;
			for(var dft=0;dft<developerworkflow.defectCollectionObject.length;dft++)
			{
				diffval = 100-developerworkflow.defectCollectionObject[0].similarity
				var diffsim = developerworkflow.defectCollectionObject[dft].similarity+diffval
				if(diffsim>developerworkflow.Cutoffforsimilarity && developerworkflow.defectCollectionObject[dft].file != undefined)
				{
						
					var fileArray = developerworkflow.defectCollectionObject[dft].file.replace("]","").replace("[","").split(",");
					
					for(var f=0;f<fileArray.length;f++)
					{
						var eachobj = new Object();
						eachobj.file = fileArray[f].trim();
						eachobj.title = developerworkflow.defectCollectionObject[dft].title;
						eachobj.id = developerworkflow.defectCollectionObject[dft]._id;
						eachobj.description =  developerworkflow.defectCollectionObject[dft].description;
						
						if(developerworkflow.defectCollectionObject[dft]._id == developerworkflow.defectdataObj[0]._id )
						{
							eachobj.similarity =  100;
							
							
						}
						else
						{
							eachobj.similarity =  developerworkflow.defectCollectionObject[dft].similarity + diffval;
						}
						defectsArray.push(eachobj);
					}
				}
			}
			developerworkflow.defectArrayList = developerworkflow._calculatefileSummation(defectsArray,"defectcollection"); 
               
			      	
			if(null != developerworkflow.defectdataObj && undefined != developerworkflow.defectdataObj && developerworkflow.defectdataObj[0] !=undefined && null != developerworkflow.defectdataObj[0])
			{
            developerworkflow.primaryFeature_defectID = developerworkflow.defectdataObj[0].primary_feature;

			
            var defectID = developerworkflow.defectdataObj[0]._id;
			//developerworkflow.date = developerworkflow.defectdataObj[0].date;
            var endDate   = ISEUtils.formatDate(developerworkflow.date);
            var tempdate = ISEUtils.getOldPriorityDate(endDate,parseInt(developerworkflow.BugIntroducedDays));
            var startDate = ISEUtils.formatDate(tempdate); 
			//var startDate = ISEUtils.formatDate(tempdate); 
          
            /* $("#startDateInputElement").datepicker("setDate", startDate);
            $("#endDateInputElement").datepicker("setDate", endDate); */
             

            developerworkflow.filesStartDate = startDate;

			if(document.getElementById('checbox1').checked == true )
			{
				var searchDate = startDate +"  TO  "+ endDate
				if(developerworkflow.sourceArrayList != undefined || developerworkflow.defectArrayList !=undefined)
				{
					var requestObject = new Object();
					requestObject.searchString = "date : [ "+ searchDate + "] ";
					requestObject.projectName = developerworkflow.projectName;
					requestObject.maxResults = 1000;
					requestObject.collectionName = "defect_files_collection";               
				  ISE.getFileListForDefectId(requestObject, developerworkflow._receivedFileListforSelectedDefect); 
			  }
			  }
			  else
			  {
				
				developerworkflow._getbugCountForFiles()
			  }
          }
		  else
		  {
			console.log(developerworkflow.defectdataObj[0]);
			$('#developerWorkFlowTableBody').append('<tr><td></td><td style="color:red" data-localize=language.Data is not available for existing  configuration Please change configuration and check again">Data is not available for existing  configuration. Please change configuration and check again</td><td></td> </tr>')
		  }
		developerworkflow.initLocalization();   
	},
		_calculatefileSummation(dataArray,collectionName)
		{
			var resultArray = new Array();
			
			var filegroup = _.groupBy(dataArray, function (object) { return object.file; })
					//console.log(filegroup.length);
					 _.each(filegroup, function (fVal, fKey) {
					 var eachobj = new Object();
						eachobj.file = fKey;
						var similarity = 0;
						var obj;
						
						var highestValue = 0;
						for(var s=0; s<fVal.length;s++)		
						{
							//similarity = similarity+Math.round(fVal[s].similarity) 
							if(highestValue < fVal[s].similarity)
							{
								highestValue = fVal[s].similarity;
							}
							
						}
						var summation =0;
						for(var s=0; s<fVal.length;s++)		
						{
							//similarity = similarity+Math.round(fVal[s].similarity) 
							if(highestValue !=fVal[s].similarity)
							{
								//similarity =similarity +highestValue;
								summation = summation+fVal[s].similarity;
								
							}
							
						}
						
						if(summation !=0)
						{
						//console.log(fVal[s].length)
						summation = summation/(fVal.length-1);
						var remPercentage = 100-highestValue;
						similarity = highestValue+((summation/100)*remPercentage)
						}
						else
						{
							similarity = highestValue;
						}
						eachobj.similarity = similarity;
						
						if(collectionName == "defectcollection")
						{
							eachobj.dftsimilarity = similarity;
							eachobj.type = "defects";
							eachobj.defectsData = fVal;
						}
						if(collectionName == "srccollection")
						{
							eachobj.srcsimilarity = similarity;
							eachobj.type = "source";
							eachobj.srcData = fVal;
						}
						resultArray.push(eachobj);
						});
						if(collectionName == "defectcollection" || collectionName == "srccollection")
						{
							developerworkflow._calculateFileScore(resultArray,0,collectionName)
							
						}
						if(collectionName == "srccollection")
						{
							//eachobj.srcsimilarity = similarity;
						}
					return 	resultArray;
						
		},
		_calculateFileScore(resultArray,highestValue,collectionName)
		{
			
			if(collectionName == "defectcollection" || collectionName == "srccollection")
			{
				for(var s=0; s<resultArray.length;s++)	
				{
				//resultArray[s].similarity = (resultArray[s].similarity/highestValue)*100;
				developerworkflow.fileArray.push(resultArray[s].file)
				developerworkflow.lastArray.push(resultArray[s]);
				}
			}
			else
			{
				
				for(var s=0; s<resultArray.length;s++)	
				{
					resultArray[s].similarity = (resultArray[s].similarity/highestValue)*100;
					developerworkflow.fileArray.push(resultArray[s].file)
					developerworkflow.lastArray.push(resultArray[s]);
				}
			}
			
			
		return resultArray;
		},
		 _receivedFileListforSelectedDefect:function(data){

           developerworkflow.reqDeveloper_WorkFlow = new Array();        

            if(ISEUtils.validateObject(data)){
            
            var fileList = [];
			var modifiedArray = new Array();
				//fileList[0]="/ISE-MongoDbImplementation/Source/WebContent/js/FeatureMappingSearch.js";
             for(var i=0;i<data.length;i++){
				if(developerworkflow.fileArray.indexOf(data[i].fileslist) > -1 && developerworkflow.lastArray.length >0 )
				{
				
				for(var fl=0;fl<developerworkflow.lastArray.length;fl++)
					{
						if(developerworkflow.lastArray[fl].file == data[i].fileslist)
						{	
							if(fileList.indexOf(data[i].fileslist) )
							{
								fileList.push(data[i].fileslist); 
							}
							var eachobj =  new Object();
							eachobj.file = developerworkflow.lastArray[fl].file;
							eachobj.similarity = developerworkflow.lastArray[fl].similarity;
							eachobj.dftsimilarity = developerworkflow.lastArray[fl].dftsimilarity;
							eachobj.srcsimilarity = developerworkflow.lastArray[fl].srcsimilarity;
							eachobj.type = developerworkflow.lastArray[fl].type
							modifiedArray.push(developerworkflow.lastArray[fl]);								
							
							
						}
					}
									 
				}	
				
				
             }
			 developerworkflow.lastArray = new Array();
			 developerworkflow.lastArray = modifiedArray;


               //fileList = fileList.filter(function(a){if (!this[a]) {this[a] = 1; return a;}},{});

               var fileSearchString = '' ; 
			  if(fileList != null && fileList!=undefined)
			  {

             for(var i=0;i<fileList.length;i++)         
             {

                 var count = i+1;

               if(count < fileList.length )         
                 fileSearchString += " fileslist:\""+fileList[i]+"\"" + " OR "
                 else
                 fileSearchString += " fileslist:\""+fileList[i]+"\"";
             
             }           
			var endDate   = ISEUtils.formatDate(developerworkflow.date);
            var tempdate = ISEUtils.getOldPriorityDate(endDate,parseInt(developerworkflow.Daystocalculatebugginessofafile));
            var startDate = ISEUtils.formatDate(tempdate); 
			//var startDate = ISEUtils.formatDate(tempdate); 
          
            /* $("#startDateInputElement").datepicker("setDate", startDate);
            $("#endDateInputElement").datepicker("setDate", endDate); */
             

            developerworkflow.filesStartDate = startDate;


            var searchDate = startDate +"  TO  "+ endDate
              var requestObject = new Object();
                    requestObject.searchString = "("+fileSearchString+")"+ " AND date : [ "+ searchDate + "] ";
                    requestObject.projectName = developerworkflow.projectName;
                    requestObject.maxResults = 1000;
                    requestObject.collectionName = "defect_files_collection";               
					

             
             ISE.getBugCountForDevWorkFlow(requestObject, developerworkflow._BugCountforFileList); 
			 }
			 else
			 {
			 developerworkflow.lastArray = new Array();
			 developerworkflow._BugCountforFileList(new Array());
			 }
			 }
			 else
			 {
			developerworkflow.lastArray = new Array();
			 developerworkflow._BugCountforFileList(new Array());
			 }

       },
	  _getbugCountForFiles:function()
	  {
	  
		 var fileSearchString = '' ; 
		if(developerworkflow.fileArray != null && developerworkflow.fileArray != '' && developerworkflow.fileArray!=undefined)
		{

             for(var i=0;i<developerworkflow.fileArray.length;i++)         
             {

                 var count = i+1;

               if(count < developerworkflow.fileArray.length )         
                 fileSearchString += " fileslist:\""+developerworkflow.fileArray[i]+"\"" + " OR "
                 else
                 fileSearchString += " fileslist:\""+developerworkflow.fileArray[i]+"\"";
             
             }           
			var endDate   = ISEUtils.formatDate(developerworkflow.date);
            var tempdate = ISEUtils.getOldPriorityDate(endDate,parseInt(developerworkflow.Daystocalculatebugginessofafile));
            var startDate = ISEUtils.formatDate(tempdate); 
			//var startDate = ISEUtils.formatDate(tempdate); 
          
            /* $("#startDateInputElement").datepicker("setDate", startDate);
            $("#endDateInputElement").datepicker("setDate", endDate); */
             

            developerworkflow.filesStartDate = startDate;


            var searchDate = startDate +"  TO  "+ endDate
              var requestObject = new Object();
                    requestObject.searchString = "("+fileSearchString+")" + " AND date : [ "+ searchDate + "] ";
                    requestObject.projectName = developerworkflow.projectName;
                    requestObject.maxResults = 1000;
                    requestObject.collectionName = "defect_files_collection";               
					

             
             ISE.getBugCountForDevWorkFlow(requestObject, developerworkflow._BugCountforFileList); 
			 }
			 else
			 {
			 developerworkflow._BugCountforFileList(new Array());
			 }
			 
	  },
		 _BugCountforFileList:function(data){
		  var bugCountArray = new Array();
		  var highestValue = 0;
          $.each(data, function( index, value ) {
         
					var eachobj = new Object();
					eachobj.file = data[index].key;
					eachobj.similarity = data[index].defects.buckets.length;
					eachobj.bugcount = data[index].defects.buckets.length;
					eachobj.type = "bugcount";
					  bugTitle = ' '
                
				   for(var j=0;j<data[index].defects.buckets.length;j++)
				   {

						var count = j+1;
					   if(count < data[index].defects.buckets.length )  
						  bugTitle += data[index].defects.buckets[j].key + ','
						 else
						  bugTitle += data[index].defects.buckets[j].key

					} 

                if(bugTitle != null)
                 {
                  if(data[index].defects.buckets.length > 0)
                    eachobj.bugtitle = bugTitle;
                   else
                    newRowContent += 'No data';

                }
					//eachobj.bugcount = data[index].defects.buckets.length;
					//eachobj.bugcount = 
					if(highestValue < eachobj.bugcount)
						{
							highestValue = eachobj.bugcount;
						}
					bugCountArray.push(eachobj);
					
                    
          }); 
				
				developerworkflow._calculateFileScore(bugCountArray,highestValue,'bugcount')
				developerworkflow._getFeatureforFiles();
				//developerworkflow._getFinalSimilarityScore();
				
		  
       },
	    _getFinalSimilarityScore()
	   {
	   developerworkflow.resultForDisplay = [];
		//var finalArray = developerworkflow._calculatefileSummation(lastArray,"");
		var resultArray = new Array();
			var highestValue = 0;
			var filegroup = _.groupBy(developerworkflow.lastArray, function (object) { return object.file; })
					//console.log(filegroup.length);
					 _.each(filegroup, function (fVal, fKey) {
					 if(fKey !="undefined")
					 {
						var eachobj = new Object();
						eachobj.file = fKey;
						eachobj.feature = fVal[0].feature
						console.log(eachobj.feature)
						if(developerworkflow.defectdataObj[0].primary_feature != undefined && eachobj.feature  == developerworkflow.defectdataObj[0].primary_feature)
						{
							eachobj.featureScore = 100;
							
						}
						else
						{
							eachobj.featureScore = 0;
							
						}
						var similarity = 0;
						
						var highestScore =0;
						var type;
						for(var s=0; s<fVal.length;s++)		
						{
							 if(fVal[s].type == "defects" || fVal[s].type == "source" )
							{
							
								if(fVal[s].type == "source")
								{
									eachobj.sourcesimilarity = fVal[s].similarity;
									eachobj.srcData = fVal[s].srcData
								}
								else
								{
									eachobj.defectsimilarity = fVal[s].similarity;
									eachobj.defectsData = fVal[s].defectsData
									eachobj.defid = fVal[s].id;
									
								}
								if(highestScore < fVal[s].similarity)
								{
									highestScore = fVal[s].similarity;
									type = fVal[s].type
									
								}
								
								
								//similarity = similarity+(developerworkflow.Weightageforsimilardefectscore*fVal[s].similarity)
								//console.log("defects"+fVal[s].similarity)
								
								//eachobj.defectsData = fVal[s].defectsData
							}
							
						}
						var similarity = 0;
						if(type == "defects")
						{
							similarity = highestScore;
							var remainingVal = 100 - highestScore
							var score =0;
							for(var s=0; s<fVal.length;s++)		
							{
								if(fVal[s].type == "source")
								{
									score = (developerworkflow.Weightageforfilematchscore*fVal[s].similarity);
									
								//eachobj.defectsData = fVal[s].defectsData
								}
								if(fVal[s].type == "bugcount")
								{
									score = score+(developerworkflow.Weightageforbuggyscore*fVal[s].similarity)
									eachobj.bugcountsimilarity = fVal[s].similarity;
									eachobj.bugcount = fVal[s].bugcount;
									eachobj.bugtitle =fVal[s].bugtitle;
									
								}
							
							}
							if(remainingVal !=0)
							{
								if(eachobj.featureScore == 100)
								{
								
									//var similarity = eachobj.similarity;
									score = score +(developerworkflow.featureMappingScore*100);
									console.log("feature"+similarity);
									//eachobj.similarity = similarity;
								}
							score = (score/100)*remainingVal;
							eachobj.similarity = similarity+score;
							}
							else
							{
								eachobj.similarity = similarity
							}
						}
						
						
						if(type == "source")
						{
							similarity = highestScore;
							var remainingVal = 100 - highestScore
							var score =0;
							for(var s=0; s<fVal.length;s++)		
							{
								if(fVal[s].type == "defects")
								{
									score = (developerworkflow.Weightageforsimilardefectscore*fVal[s].similarity);
									
								}
								if(fVal[s].type == "bugcount")
								{
									score = score+(developerworkflow.Weightageforbuggyscore*fVal[s].similarity)
									eachobj.bugcountsimilarity = fVal[s].similarity;
								eachobj.bugcount = fVal[s].bugcount;
								 eachobj.bugtitle =fVal[s].bugtitle;
									
								}
							
							}
							
							if(remainingVal !=0)
							{
								if(eachobj.featureScore == 100)
								{
								
									//var similarity = eachobj.similarity;
									score = score +(developerworkflow.featureMappingScore*100);
									console.log("feature"+similarity);
									//eachobj.similarity = similarity;
								}	
							score = (score/100)*remainingVal;
							eachobj.similarity = similarity+score;
							}
							else
							{
								eachobj.similarity = similarity
							}
						}
							/* if(fVal[s].type == "source")
							{
								similarity = similarity+(developerworkflow.Weightageforfilematchscore*fVal[s].similarity)
								//console.log("source"+fVal[s].similarity)
								eachobj.sourcesimilarity = fVal[s].similarity;
								eachobj.srcData = fVal[s].srcData
								//eachobj.defectsData = fVal[s].defectsData
							}
							if(fVal[s].type == "bugcount")
							{
								similarity = similarity+(developerworkflow.Weightageforbuggyscore*fVal[s].similarity)
								//console.log("bugcount"+fVal[s].similarity)
								eachobj.bugcountsimilarity = fVal[s].similarity;
								eachobj.bugcount = fVal[s].bugcount;
								 eachobj.bugtitle =fVal[s].bugtitle;
							}  */
						
							
							resultArray.push(eachobj);
							developerworkflow.resultForDisplay.push(eachobj);
						}
						
						});
		developerworkflow._assignDataToDeveloperworkFlowTable(resultArray)
	   
	   },
      _getFeatureforFiles:function()
		{
			var fileSearchString = '' ; 
			if(developerworkflow.lastArray != null && developerworkflow.lastArray!=undefined)
			{
				 for(var i=0;i<developerworkflow.lastArray.length;i++)         
				 {
					var count = i+1;

				   if(count < developerworkflow.lastArray.length )         
					 fileSearchString += " files:\""+developerworkflow.lastArray[i].file+"\"" + " OR "
					 else
					 fileSearchString += " files:\""+developerworkflow.lastArray[i].file+"\"";
				 
				 }
				 
					var requestObject = new Object();
                    requestObject.searchString = fileSearchString
                    requestObject.projectName = developerworkflow.projectName;
                    requestObject.maxResults = developerworkflow.lastArray.length;
                    requestObject.collectionName = "sourcecode_collection";               
					

             
             ISE.getFileListForDefectId(requestObject, developerworkflow._mapFeaturesForFiles); 
			}  
			 
		},
		 _mapFeaturesForFiles:function(data)
		{
			
			if(ISEUtils.validateObject(data)){
			
				for(var i=0;i<data.length;i++)         
				{
					for(var f=0;f<developerworkflow.lastArray.length;f++) 
					{
						if(developerworkflow.lastArray[f].file == data[i].files)
						{
							console.log("lastArray[f].file")
							developerworkflow.lastArray[f].feature = data[i].primary_feature
							console.log("lastArray[f].file"+ data[i].primary_feature)
						}
					}
				}
				 
			}
			developerworkflow._getFinalSimilarityScore();
			 
		},
		 _receivedBugCountforFileList:function(data){

          $.each(data, function( index, value ) {
         
                for(var i=0;i<developerworkflow.reqDeveloper_WorkFlow.length;i++){

                    if(developerworkflow.reqDeveloper_WorkFlow[i].files == data[index].key )
                    {
                        developerworkflow.reqDeveloper_WorkFlow[i].bugcount = data[index].defects.buckets;
                    }
                }

          });  
       },
	  _assignDataToDeveloperworkFlowTable:function(sortByHighLightColorcodeInArray){


        //console.log(sortByHighLightColorcodeInArray)
	var newRowContent;

         //$('#').html('')

            $('#developerWorkFlowTableBody').html('')
            if(sortByHighLightColorcodeInArray !=undefined && sortByHighLightColorcodeInArray .length > 0){
				
                var bugTitle = ' ';
                 var personsCount = ' ';
            
               for (var i = 0; i < sortByHighLightColorcodeInArray.length; i++) {
			   
					var similarity = Math.round(sortByHighLightColorcodeInArray[i].similarity);
												
					if(sortByHighLightColorcodeInArray[i].defid !=undefined && (sortByHighLightColorcodeInArray[i].defid == developerworkflow.defectdataObj[0]._id ))
					{
						similarity =  100;
						
					}
					else
					{
						if(similarity > 95)
						{ 
							similarity = 95
						}
					}
                 newRowContent += '<tr id=row_'+i+'><td  title= "click to see how the similarity is acheived" width="10%" id=expand_'+i+' onclick=developerworkflow._showDetails(this,"'+sortByHighLightColorcodeInArray[i].file.trim()+'")><span id=closeid_'+i+' class = "row-details row-details-close"></span></td>'                
                 newRowContent += '<td width="70%">' + sortByHighLightColorcodeInArray[i].file +'</td>'
                 
                   newRowContent += '<td width="20%" title="Similarity is acheived through similar bug report,file structure and bugginess of a file">' + Math.round(sortByHighLightColorcodeInArray[i].similarity) +'</td>'

                   

                  // Bug Title Format String

                              
                 newRowContent += '</tr>';
				/*  newRowContent+="<tr style=display:none id=hiddenid_"+i+">"
				 newRowContent += '<td>' + sortByHighLightColorcodeInArray[i].defectsimilarity +'</td>'
                 
                   newRowContent += '<td>' + sortByHighLightColorcodeInArray[i].sourcesimilarity +'</td>'
				    newRowContent += '<td>' + sortByHighLightColorcodeInArray[i].bugcountsimilarity +'</td>'
				   newRowContent += '</tr>';
 */
                 

                }
				var oTable = $('#developerWorkFlowTable').dataTable();
                                                                oTable.fnClearTable();
                                                                oTable.fnDestroy();
                                                                 $('#developerWorkFlowTableBody').append(newRowContent);

             setTimeout(developerworkflow.setDataTable(),100)
             

       }
		else
		{
				 $('#developerWorkFlowTableBody').append('<tr><td></td><td style="color:red">Data is not available for existing  configuration. Please change configuration and check again</td><td></td> </tr>')
		}
               
           ISEUtils.portletUnblocking("developerWorkFlowPortlet");           
			
      			/*if(developerworkflow.sourceCodeCollectionObject == null  )
      			{
      			 
      			   $('#developerWorkFlowTable td:nth-child(7),th:nth-child(7)').hide();
      			}
            */
               
			   // developerworkflow.sourceCodeCollectionObject = [];
           

       },
	   _showDetails:function(elementid,file)
	   {
			var id = elementid.id;
			var spanid = id.replace("expand_","closeid_")
			var rowid =id.replace("expand_","row_")
			var newRowContent;
			
			for(var i=0; i<developerworkflow.resultForDisplay.length;i++)
			{
				
				if(developerworkflow.resultForDisplay[i].file == file)
				{
					$("#hiddenid_"+id).remove();
					var classstyle = document.getElementById(spanid).className;
			
				if(classstyle == 'row-details row-details-close')
				{
					document.getElementById(spanid).className = "row-details row-details-open"
					var dfsimilarity = developerworkflow.resultForDisplay[i].defectsimilarity; 
					var srsimilarity = developerworkflow.resultForDisplay[i].sourcesimilarity;
					var bugcountsimilarity = developerworkflow.resultForDisplay[i].bugcountsimilarity;
					var bugcount = developerworkflow.resultForDisplay[i].bugcount;
					var featureScore = developerworkflow.resultForDisplay[i].featureScore;
					var feature = developerworkflow.resultForDisplay[i].feature;
					if(dfsimilarity == undefined)
					{
						dfsimilarity = 0
					}
					if(srsimilarity ==undefined)
					{
						srsimilarity = 0
					}
					if(bugcountsimilarity == undefined)
					{
						bugcountsimilarity = 0
						bugcount = 0;
					}
					if(developerworkflow.resultForDisplay[i].defid !=undefined && (developerworkflow.resultForDisplay[i].defid == developerworkflow.defectdataObj[0]._id ))
					{
						dfsimilarity =  100;
						
					}
					else
					{
						if(srsimilarity > 95)
						{ 
							srsimilarity = 95
						}
						if(bugcountsimilarity > 95)
						{ 
							bugcountsimilarity = 95
						}
					}
				 newRowContent+="<tr id=hiddenid_"+id+" clss=details><td class =details colspan =4><table width=100%>"
				 newRowContent += "<tr> <td width=50%><canvas id=cvs"+i+">[No canvas support]</canvas></td><td width=50%><table>"
				 newRowContent += '<tr><td title="This is the similarity of a file acheived from the similar bug report">Similar Defect Score</td><td id = defectscore'+i+' title="This Score is acheived by comparing the similarity between the reported bug and the current bug" onclick=developerworkflow.test(this,"'+developerworkflow.resultForDisplay[i].file.trim()+'")>' + Math.round(dfsimilarity) +'</td></tr>'
                 
                   newRowContent += '<tr><td title="This is the similarity of a file acheived from the file structure" >File Structure Score</td><td title="This Score indicates that how similar the file structure with the reported bug " onclick=developerworkflow.fileStrdrilldown(this,"'+developerworkflow.resultForDisplay[i].file.trim()+'")  >' + Math.round(srsimilarity) +'</td></tr>'
				    newRowContent += '<tr><td title="This score is achieved by forecasting the defects for this file" >BugForecastForFile Similarity</td><td onclick = developerworkflow._getDefectsList(this,"'+developerworkflow.resultForDisplay[i].file.trim()+'") title="Number of bugs associated to this file are '+bugcount+ '" >' + Math.round(bugcountsimilarity) +'</td></tr>'
					 newRowContent += '<tr><td title="By comparing reported defect feature and file feature this score is achieved" >Feature Similarity</td><td onclick = developerworkflow._getFeatureData(this,"'+feature+'","'+developerworkflow.resultForDisplay[i].file.trim()+'") title="By comparing reported defect feature and file feature this score is achieved" >' + Math.round(featureScore) +'</td></tr></td></tr></table>'  
					
				   newRowContent += '</table></td></tr>'
				  
				   
				   $("#"+rowid).after(newRowContent);
				   RGraph.Reset(document.getElementById('cvs'+i))
				   //RGraph.Reset(document.getElementById('cvs')+i)
				   
				   var rose = new RGraph.Rose({
					id: "cvs"+i,
					data: [Math.round(dfsimilarity),Math.round(srsimilarity),Math.round(bugcountsimilarity)],
					options: {
						axesVisible: true,
						labels: ['defect','source','filebugs'],
						labelsAxes: '',
						backgroundGridSpokes: 8,
						backgroundAxes: false,
						colors: ['red', 'green', 'blue'],
						colorsSequential: true,
						margin: 5,
						textAccessible: true,
						textSize: 10,
						 tooltips: [
                    'Bill','Bill','Bill',
					'Bill','Bill','Bill',
					'Bill','Bill','Bill'
                    
                ], 

					}
				}).draw(); 
				//RGraph.Redraw();
				//rose.Set('labels' , ['sdnmnjdsn','dsdds','dddd']);
				//rose.Set('tooltips' , ['sdnmnjdsn','dsdds','dddd']);
				//rose.Set('chart.tooltips', ['sdnmnjdsn','dsdds','dddd']);
				//rose.Set('chart.tooltips.event', 'onmousemove'); 
				
				//rose.onclick = function (e, shape)
				//{
					//debugger;
					//alert('A bar has been clicked!'+shape[5]);
				//}
				  /*var radar = new RGraph.Radar({
						id: 'cvs'+i,
						data: [Math.round(dfsimilarity),Math.round(srsimilarity),Math.round(bugcountsimilarity),0,0],
						options: {
							strokestyle: 'black',
							colors: ['Gradient(white:red:red:red)', 'Gradient(white:green:green)', 'Gradient(white:yellow)'],
							colorsAlpha: 0.3,
							labels: ['DefectScore','FileStructureScore','BugginessScore',"file","gkkk"],
							gutterTop: 35,
							fillTooltips: ['0','0','0','0','0'],
							axesColor: 'rgba(0,0,0,0)',
							backgroundCirclesPoly: true,
							backgroundCirclesSpacing: 25
						}
					}).draw()*/

				 
				}
				if(classstyle == 'row-details row-details-open')
				{
					document.getElementById(spanid).className = "row-details row-details-close"
					$("hiddenid_"+id).empty();
					//document.getElementById("hiddenid_"+id).style.display = "none"
				}
				}
			}
			
	   },
	  _getFeatureData :function(this1,feature,file)
	  {
		 $('#modelInfo').empty();
			$('#moreInfoModalTitle12').empty();
			$('#moreInfoModalTitle12').append("FileName - "+file);
			$('.modal-footer').hide();
			//document.getElementById('#moreInfoModalTitle12').Style.fontFamily = 'sans-serif';
			//$('#moreInfoModalTitle12').Style.fontsize = '13px';

			var html ="<table><th>Features</th>"

			html += '<tr><td>File Feature  &nbsp;</td><td>'+feature+'</td></tr>'
			html += '<tr><td>Reported Defect Feature  &nbsp;</td><td>'+developerworkflow.defectdataObj[0].primary_feature+'</td></tr>'
		
					
			 $("#modelInfo").append(html); 
			 $('#moreInfoModalTitle12').css("font-family", "serif") 
			  $('#showMoreTextInfoModal12').modal('show');
	  },
		
       setDataTable:function(){

        var oTable = $('#developerWorkFlowTable').dataTable({
              
              
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
                    "search": "Search with in results:",
                    "zeroRecords": "No matching records found"
                },
			"oLanguage": developerworkflow.dataTableLocalizationData,
                "columnDefs": [{
                    "orderable": false,
                     "targets": 'no-sort'
                }

                 // { "width": "5%", "targets":2 }

                ],
                 "order": [2, 'desc'
                          
                      ],
              
                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "pageLength": 5,
                 "retrieve": true
             
            });
       },

       _filterResults:function()
	   {
			var oTable = $('#developerWorkFlowTable').dataTable();
                                                                oTable.fnClearTable();
                                                                oTable.fnDestroy();
			 $('#developerWorkFlowTableBody').html('');
			developerworkflow._modifyCollectionData()
	   },
	   _changeConfigurations:function(bool)
	   {
		 $('#modelInfo').empty();
		 $('.modal-footer').show();
		 $('#moreInfoModalTitle12').empty();
		var html = "<table><tr><td width:65%; title='Filter the files based on the given number of days before the bug reported date'><label data-localize='language.Days to display the files'>Days to display the files &nbsp;</label></td><td title='Filter the files based on the given number of days before the bug reported date'><i class='glyphicon glyphicon-info-sign'></i>&nbsp;</td><td width:25%><input type=text id=filedays value="+developerworkflow.BugIntroducedDays+">&nbsp;<button id=up >+</button>&nbsp;<button id=down >-</button></td></tr><tr><td>&nbsp;&nbsp;</td></tr>"
		html += "<tr><td title='Bug Reported date' ; width:75%><label data-localize='language.Bug Reported Date'>Bug Reported Date &nbsp;</label></td><td><i title='Bug Reported date'class='glyphicon glyphicon-info-sign'></i>&nbsp;</td><td width:25%><input type=text id=BugReportedDate class=datepicker  style = 'width: 158px; height: 24px;'data-date-format=yyyy-mm-dd value="+ISEUtils.formatDate(developerworkflow.date)+"></td></tr><tr><td>&nbsp;&nbsp;</td>"
		html += "<tr><td title='calculate the bug count of a file based on the given days before the bug reported date'; width:75%><label data-localize='language.Days to consider associated'>Days to consider associated bugs&nbsp;</label></td><td title='calculate the bug count of a file based on the given days before the bug reported date ' ;><i class='glyphicon glyphicon-info-sign'></i>&nbsp;</td> <td width:25%><input id=bugdays type=text value="+developerworkflow.Daystocalculatebugginessofafile+"></td></tr><tr><td>&nbsp;&nbsp;</td></tr>"
		html += "<tr ><td title='weightage to be considered to calculate the  score of a file from similar bug report'; width:75%><label data-localize='language.Weightage for similar defect score'>Weightage for similar defect score &nbsp;</label></td><td title='weightage to be considered to calculate the  score of a file from similar bug report'; ><i class='glyphicon glyphicon-info-sign'></i>&nbsp;</td><td width:25% style=padding-top:10px><div id='range-slider1' style='width:160px'></div> &nbsp; <span  style='display:none;float: right;margin-top: -18px;margin-right: 18px;' id=example-val1 ></span></td></td><tr><td>&nbsp;&nbsp;</td></tr>"
		html += "<tr><td title='weightage to be considered to calculate the score of a file from matching file structure '; width:75%><label data-localize='language.Weightage for file match score'>Weightage for file match score &nbsp;</label></td><td title='weightage to be considered to calculate the score of a file from matching file structure '; ><i class='glyphicon glyphicon-info-sign'></i>&nbsp;</td><td width:25% style=padding-top:10px><div id='range-slider2' style='width:160px' ></div>&nbsp;<span style='display:none;float: right;margin-top: -18px;margin-right: 18px;' id=example-val2 ></span></td></tr><tr><td>&nbsp;&nbsp;</td></tr>"
		html += "<tr><td title='weightage to be considered to calculate the score of a file using bugs associated to that file'; width:75%><label data-localize='language.Weightage for buggy score'>Weightage for buggy score &nbsp;</label></td><td title='weightage to be considered to calculate the score of a file using bugs associated to that file'; ><i class='glyphicon glyphicon-info-sign'></i>&nbsp;</td><td width:25% style=padding-top:10px><div id='range-slider3' style='width:160px' ></div>&nbsp;<span  id=example-val3 style='display:none;float: right;margin-top: -18px;margin-right: 18px;'></span></td></td></tr><tr><td>&nbsp;&nbsp;</td></tr>"
		html += "<tr><td title='maximum similarity limit above which files are considered' ; width:75%><label data-localize='language.Cut off % for similarity'>Cut off % for similarity &nbsp;</label></td><td title='maximum similarity limit above which files are considered'><i class='glyphicon glyphicon-info-sign'></i>&nbsp;</td><td width:25%><input type=text id=Cutoffforsimilarity value="+developerworkflow.Cutoffforsimilarity+">&nbsp;<button id=up1 >+</button>&nbsp;<button id=down1 >-</button></td></tr><tr><td>&nbsp;&nbsp;</td></tr><table>"
		$('#moreInfoModalTitle12').append("<label data-localize='language.Configuration Values'>Configuration Values</label>");
		$('#modelInfo').append(html);
		$('.datepicker').datepicker();
		developerworkflow.initLocalization(); 

		$("#up").on('click',function(){
		var value = (parseInt($("#filedays").val())+1);
		var val = (value+1) > 100 ? 100 :value ;
        $("#filedays").val(val);
		});

		$("#down").on('click',function(){
			var value = (parseInt($("#filedays").val())-1);
			var val = (value-1) < 0 ? 0 :value ;
			
			$("#filedays").val(val);
		});	

		$("#up1").on('click',function(){
		var value = (parseInt($("#Cutoffforsimilarity").val())+1);
		var val = (value+1) > 100 ? 100 :value ;
		$("#Cutoffforsimilarity").val(val);
		});

		$("#down1").on('click',function(){
			var value = (parseInt($("#Cutoffforsimilarity").val())-1);
			var val = (value-1) < 0 ? 0 :value ;
			
			$("#Cutoffforsimilarity").val(val);
		});	


		
		$('#range-slider1').noUiSlider({
		 step: 0.1,
		start: developerworkflow.Weightageforsimilardefectscore,
		connect: "lower",
		range: {
			'min': 0.1,
			'max': 1.0
			},
			pips: 
			{ // Show a scale with the slider
			mode: 'steps',
			density: 2
			}
        });
	
	 $("#range-slider1").Link('lower').to(($('#example-val1')));
	 $('#range-slider2').noUiSlider({
		 step: 0.1,
		start: developerworkflow.Weightageforfilematchscore,
		connect: "lower",
		range: {
			'min': 0.1,
			'max': 1.0
			},
			pips: 
			{ // Show a scale with the slider
			mode: 'steps',
			density: 2
			}
        });
	
	 $("#range-slider2").Link('lower').to(($('#example-val2')));
	 $('#range-slider3').noUiSlider({
		 step: 0.1,
		start: developerworkflow.Weightageforbuggyscore,  
		connect: "lower",
		range: {
			'min': 0.1,
			'max': 1.0
			},
			pips: 
			{ // Show a scale with the slider
			mode: 'steps',
			density: 2
			}
        });
	//alert($("#range-slider3").Link('lower'))
	 $("#range-slider3").Link('lower').to(($('#example-val3')));
	 //$("#range-slider3").Link('lower').to(document.getElementById("range-slider3").title);
	 //debugger
	//document.getElementById("range-slider1").title = document.getElementById("example-val1").innerHTML
	//document.getElementById("range-slider2").title = document.getElementById("example-val2").innerHTML
	//document.getElementById("range-slider3").title = document.getElementById("example-val3").innerHTML
		if(bool == true)
		{
			setTimeout(function(){$("#filedays").focus();},1);
		}
		 $('#showMoreTextInfoModal12').modal('show');

		
	   },
	   _submitClick:function()
	   {
		 
		 developerworkflow.BugIntroducedDays  = Number(document.getElementById("filedays").value);
		developerworkflow.Daystocalculatebugginessofafile  = Number(document.getElementById("bugdays").value);
		developerworkflow.Weightageforsimilardefectscore  = Number(document.getElementById("example-val1").innerHTML);
		developerworkflow.Weightageforfilematchscore  = Number(document.getElementById("example-val2").innerHTML);
		developerworkflow.Weightageforbuggyscore  = Number(document.getElementById("example-val3").innerHTML);
		developerworkflow.Cutoffforsimilarity   = Number(document.getElementById("Cutoffforsimilarity").value);
		
		developerworkflow.date = document.getElementById("BugReportedDate").value;

		var oTable = $('#developerWorkFlowTable').dataTable();
                                                                oTable.fnClearTable();
                                                                oTable.fnDestroy();
			 $('#developerWorkFlowTableBody').html('');
			developerworkflow._modifyCollectionData();
			$('#showMoreTextInfoModal12').modal('hide');
			 //$('#developerWorkFlowWindow').modal('show');

						
	   },
	   _closeClick:function()
	   {
	   $('#showMoreTextInfoModal12').modal('hide');
	   },
	   
	_SaveToFile:function()
	{
		alert("Files saving needs to be implemented");
	},
	test:function(elemid,file)
	{
		document.getElementById("similardefectdrilldown_filediffmodalLabel").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;File Name - <span style='font-weight:bold;'>"+file+"</span>";
					
		$("#similardefectdrilldown_filediffmodalheader").empty(); 
		$("#similardefectdrilldown_filediffmodaldata").empty(); 
		var id = elemid.id;
		var htmlhead =""
				
		htmlhead +='<table>';
		htmlhead +='<tr style="background-color:#404c57;color:white">';
		
			htmlhead +='<td style="display:table-cell;width:15%;text-align:left;padding-left:25px;padding-right:5px;font-weight:bold;">Defect ID</td>';
		
			htmlhead +='<td style="display:table-cell;width:15%;text-align:left;padding-left:50px;padding-right:5px;font-weight:bold;">Title</td>';
		htmlhead +='<td style="display:table-cell;width:44%;text-align:left;padding-left:146px;padding-right:5px;font-weight:bold;">Description</td>';
		htmlhead +='<td style="display:table-cell;width:44%;text-align:left;padding-left:180px;padding-right:5px;font-weight:bold;">Similarity</td>';
		
		htmlhead +='</tr></table>';
		
		 $("#similardefectdrilldown_filediffmodalheader").append(htmlhead); 
		 var html= "<table class='table table-striped table-bordered table-hover no-footer dataTable' >"
		for(var i=0; i<developerworkflow.resultForDisplay.length;i++)
		{
			if(developerworkflow.resultForDisplay[i].file == file && developerworkflow.resultForDisplay[i].defectsData !=undefined )
			{
				
				for(var d=0; d<developerworkflow.resultForDisplay[i].defectsData.length;d++)
				{
					html += '<tr><td style="width: 15%;">'+developerworkflow.resultForDisplay[i].defectsData[d].id+'</td><td style="    width: 25%;">'+developerworkflow.resultForDisplay[i].defectsData[d].title+'</td><td style="width: 54%;">'+developerworkflow.resultForDisplay[i].defectsData[d].description+'</td><td>'+developerworkflow.resultForDisplay[i].defectsData[d].similarity+'</td></tr>'
				
				}
				
				
			}
		}
		 $("#similardefectdrilldown_filediffmodaldata").append(html); 
		 //$("#similardefectdrilldown_filediffmodaldata").append(html); 
		 //sans-serif
		  $('#similardefectdrilldown').modal('show');

	},

	fileStrdrilldown:function(elemid,file)
	{
		document.getElementById("similardefectdrilldown_filediffmodalLabel").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;File Name - <span style='font-weight:bold;'>"+file+"</span>";
					
		$("#similardefectdrilldown_filediffmodalheader").empty(); 
		$("#similardefectdrilldown_filediffmodaldata").empty(); 
		var id = elemid.id;
		var htmlhead =""
				
		htmlhead +='<table>';
		htmlhead +='<tr style="background-color:#404c57;color:white">';
		htmlhead +='<td style="display:table-cell;width:1%;text-align:left;padding-left:20px;padding-right:5px;font-weight:bold;"></td>';
			htmlhead +='<td  style="display:table-cell;width:24%;text-align:left;padding-left:69px;padding-right:5px;font-weight:bold;">file Name</td>';
			if(developerworkflow.deploymenttype != "CISCO")
					{
			htmlhead +='<td  style="display:table-cell;width:38%;text-align:left;padding-left:297px;padding-right:5px;font-weight:bold;">Title</td>';
					}
					else
					{
						htmlhead +='<td  style="display:table-cell;width:38%;text-align:left;padding-left:297px;padding-right:5px;font-weight:bold;">FileDiff</td>';
					}
		htmlhead +='<td   style="display:table-cell;width:44%;text-align:left;padding-left:177px;padding-right:5px;font-weight:bold;">Similarity</td>';
		
		htmlhead +='</tr></table>';
		
		 $("#similardefectdrilldown_filediffmodalheader").append(htmlhead); 
		 var html= "<table class='table table-striped table-bordered table-hover no-footer dataTable' >"
		for(var i=0; i<developerworkflow.resultForDisplay.length;i++)
		{
			if(developerworkflow.resultForDisplay[i].file == file && developerworkflow.resultForDisplay[i].srcData !=undefined )
			{
				
				for(var d=0; d<developerworkflow.resultForDisplay[i].srcData.length;d++)
				{
					
					if(developerworkflow.deploymenttype != "CISCO")
					{
						html += '<tr><td style=width:45%>'+developerworkflow.resultForDisplay[i].srcData[d].file+'</td>'
					html += '<td style=width:35%>'+developerworkflow.resultForDisplay[i].srcData[d].title+'</td>'
					}
					else
					{
						var subcontent = 	developerworkflow.resultForDisplay[i].srcData[d].title;
						var file =  developerworkflow.resultForDisplay[i].srcData[d].file;
					
						if(file.length  >50)
						{
							var dpc = escape(file.substring(0,50));	
							html += '<td style=width:35%>'+dpc+'<a modalTitle='+developerworkflow.resultForDisplay[i].file+'  moreTextContent=' + escape(developerworkflow.resultForDisplay[i].srcData[d].file) + ' class="name" onClick="developerworkflow._onExpandRowMoreContentModal(this)">  more... </a></td>'
						}
						else
						{
							var file =  developerworkflow.resultForDisplay[i].srcData[d].file;
						}
						if(subcontent.length > 50)
						{
							var dpc = escape(subcontent.substring(0,50));	
							html += '<td style=width:35%>'+dpc+'<a modalTitle='+developerworkflow.resultForDisplay[i].file+'  moreTextContent=' + escape(developerworkflow.resultForDisplay[i].srcData[d].title) + ' class="name" onClick="developerworkflow._onExpandRowMoreContentModal(this)">  more... </a></td>'
							
						}
						else{
							html += '<td style=width:35%>'+developerworkflow.resultForDisplay[i].srcData[d].title+'</td>'
						}
						
					
						
					}
					html += '<td >'+developerworkflow.resultForDisplay[i].srcData[d].similarity+'</td></tr>'
				}
				
				
			}
		}
		 $("#similardefectdrilldown_filediffmodaldata").append(html); 
		// $("#similardefectdrilldown_filediffmodaldata").append(html); 
		 //sans-serif
		  $('#similardefectdrilldown').modal('show');

	},
   _defectcloseClick:function()
	   {
	   $('#similardefectdrilldown').modal('hide');
	   },
	   _getDefectsList:function(elemid,file)
		{
			$('#modelInfo').empty();
			$('#moreInfoModalTitle12').empty();
			$('#moreInfoModalTitle12').append("FileName - "+file);
			$('.modal-footer').hide();
			//document.getElementById('#moreInfoModalTitle12').Style.fontFamily = 'sans-serif';
			//$('#moreInfoModalTitle12').Style.fontsize = '13px';

			var html ="<table><th>Defects Id's</th>"
			for(var i=0; i<developerworkflow.resultForDisplay.length;i++)
			{
				if(developerworkflow.resultForDisplay[i].file == file && developerworkflow.resultForDisplay[i].bugtitle != undefined )
				{
					
					var buglistArray = new Array();
					buglistArray = developerworkflow.resultForDisplay[i].bugtitle.split(",");
					
					for(var d=0; d<buglistArray.length;d++)
					{
						html += '<tr><td>'+buglistArray[d]+'</td></tr>'
					
					}
					
				}
			}
			 $("#modelInfo").append(html); 
			 $('#moreInfoModalTitle12').css("font-family", "serif") 
			  $('#showMoreTextInfoModal12').modal('show');

	},
	 _onExpandRowMoreContentModal:function(event){
		
         /* var moreTextContent = unescape($(event).attr('moreTextContent'));
          var modalTitle = $(event).attr('modalTitle');
    
           var bodyContent = "<pre>"+moreTextContent+"</pre>"

           $('#moreInfoModalTitle').text(modalTitle);
          // $('#moreInfoModalTitle').
           $('#modelInfo').empty();
           $('#modelInfo').append(bodyContent);
           $("#showMoreTextInfoModal").modal("show"); */
		   $('#similardefectdrilldown').modal('hide');
		   	$('#modelInfo').empty();
			$('#moreInfoModalTitle12').empty();
			$('#moreInfoModalTitle12').css({"word-break":"break-all"});
			$('.modal-footer').hide();
		   
		   var moreTextContent = unescape($(event).attr('moreTextContent'));
		  console.log(moreTextContent);
          var modalTitle = $(event).attr('modalTitle');
			$('#modelInfo').empty();
			$('#modelInfo').css({"height":"400px","overflow-y":"auto","overflow-x":"auto"});
           //var bodyContent = "<textarea id='similarSearch_moreDescription' class='form-control' style='height:280px' readonly=''>"+moreTextContent+"</textarea>"
           //var bodyContent = "<textarea id='similarSearch_moreDescription' class='form-control' style='height:280px' readonly=''></textarea>"
           //var bodyContent = "<pre>"+moreTextContent+"</pre>"
		   $('#modelInfo').append("<div id='similarSearch_moreDescription12' class='form-control' style='height:400px;font-family:Courier' readonly=''></div>");
			
			String.prototype.replaceAll = function(target, replacement) {
							return this.split(target).join(replacement);
					};
					
					moreTextContent = moreTextContent.replaceAll('##','<em class="iseH">');
					moreTextContent = moreTextContent.replaceAll("#","</em>");
					moreTextContent = moreTextContent.replace(/.\t/g,". ");
			document.getElementById("similarSearch_moreDescription12").innerHTML = moreTextContent;
           $('#moreInfoModalTitle12').text(modalTitle);
          // $('#moreInfoModalTitle').
           
           //$('#modelInfo').append(bodyContent);
           $("#showMoreTextInfoModal12").modal("show");         
         
          
   
      },
	  	  initLocalization:function(){
		var languageName = iseConstants.languagename;
		var pathName = 'json/localization/'+languageName;
		var opts = { language: languageName, pathPrefix: pathName, skipLanguage: "en-US"};
		 opts.callback = function(data, defaultCallback) {
		 defaultCallback(data);
          developerworkflow.localizationCallback(data);
		  }
		$("[data-localize]").localize("developerworkflow", opts);

	},
	localizationCallback:function(data){
		console.log("DATA : "+data);
		developerworkflow.dataTableLocalizationData = data.developerworkflowdata;
	},
	getLocalizationName:function(name){
		 for(var ss in defectsearch.dataTableLocalizationData){
			if(ss == name)
				return defectsearch.dataTableLocalizationData[ss]
		}
		
	}	

  };
