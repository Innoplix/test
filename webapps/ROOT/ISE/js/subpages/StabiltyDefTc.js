var StabiltyDefTc = {
featureTCDefectCountArr : [],
TestcaseDefectMarkedRows : [],
timeoutVal:300,
  init: function() {		
  StabiltyDefTc.populateTCDefectReleases();//generic change
		StabiltyDefTc.OnFeatureTCDefectReleaseChange()
  rows : [];
  },
OnFeatureTCDefectReleaseChange:function(){
		//setTimeout(StabiltyDefTc.blockElementFunction, 0);
		//ISEUtils.portletBlocking("pageContainer");
		setTimeout(StabiltyDefTc.OnFeatureTCDefectReleaseChangewithDelay, StabiltyDefTc.timeoutVal);
			
	  },
	  OnFeatureTCDefectReleaseChangewithDelay: function(){
		var  testcaseData = [];
		var defectData = [];
		StabiltyDefTc.TestcaseDefectMarkedRows = [];
			var selectedRelease = $("#cmb_TCDefectReleases").val();
			
			if(selectedRelease == "All Releases"){
			var requestObject = new Object();
			requestObject.projectName = localStorage.getItem('projectName');
			
			requestObject.collectionName = "defectsheatmap_collection,testcasesheatmap_collection";
			ISE.getDefectsHeatMapResults(requestObject, StabiltyDefTc.callBackGetAllFeatureTCDefectMappingData);  
				//StabiltyDefTc.loadAllFeatureTCDefectMapping();
			
			} else{
				 //var testcaseData = getDynamicDataByParams("ReleasedBasedTestcaseCountQuery",['PARAM1=' + selectedRelease],"Local", false);
				 //var testcaseData = getDynamicDataByParams("FeatureTCCount1",['PARAM1=' + selectedRelease],"mongoMapReduce", false);
					if(selectedRelease != null && selectedRelease != "null" && selectedRelease != undefined && selectedRelease != "undefined"){
						var requestObject = new Object();
			requestObject.projectName = localStorage.getItem('projectName');
			requestObject.maxResults = 300;
			requestObject.searchString = "release:"+selectedRelease
			requestObject.collectionName = "defectsheatmap_collection,testcasesheatmap_collection";
			ISE.getSearchResults(requestObject, StabiltyDefTc.callBackGetAllFeatureTCDefectMappingData);  
					}				 
				}
				//StabiltyDefTc.unblockElementFunction("");
	},
	
	callBackGetAllFeatureTCDefectMappingData: function(data){
	StabiltyDefTc.featureTCDefectCountArr = [];
		var testcaseData = data;			 
		if(testcaseData != null && testcaseData != "" && testcaseData != undefined){
		var groupByparentFeature = _.groupBy(data, function (object) { return object.parentfeature; })
			_.each(groupByparentFeature, function (pval, pkey) {
							
				var groupByFeature = _.groupBy(pval, function (object) { return object.feature; })
				_.each(groupByFeature, function (fval, fkey) {
				var eachobj = new Object();
				if(pkey != "N.A")
				{
					eachobj.featureName = pkey+"--"+fkey;
				 }
				 else
				 {
					eachobj.featureName = fkey;
				 }
				 eachobj.defectCount = 0;
				 eachobj.tcCount = 0;
				 for(var p=0; p<fval.length; p++)
				 {
					if(fval[p]._index == "defectsheatmap_collection")
					{
					 var cnt =  fval[p].Open+fval[p].QA+fval[p].Closed	
					 eachobj.defectCount =  eachobj.defectCount + cnt
					
					 }
					 else
					 {
						 eachobj.tcCount =  eachobj.tcCount + fval[p].count
					 }
				}
				StabiltyDefTc.featureTCDefectCountArr.push(eachobj);
				});
				
		   });
					//features.sort(); 
		
		}
		if (StabiltyDefTc.featureTCDefectCountArr != null && StabiltyDefTc.featureTCDefectCountArr != undefined && StabiltyDefTc.featureTCDefectCountArr.length > 0) {

				StabiltyDefTc.TestcaseDefectMarkedRows = StabiltyDefTc.featureTCDefectCountArr;
				StabiltyDefTc.AddTestcaseMarkedData(StabiltyDefTc.featureTCDefectCountArr);
						}
			   //StabiltyDefTc.unblockElementFunction("");
			  // ISEUtils.portletUnblocking("pageContainer");	
			 
			
	},
		AddTestcaseMarkedData: function(featureTCDefectCountArr){
		var barDataLabels = [];
		var barDataValues = [];
		var legendData = [];
		var chartColors = [];
		var toolTipData = [];
		var textAngle = 50;
		var color = 'rgba(255,0,0,0.5)';
		var scatterData = [];
		var maxDefectCountArr = [];
		var maxTestcaseCountArr = [];
		GlobalTestcaseMarkedData = [];
		StabiltyDefTc.featureTCDefectCountArr = featureTCDefectCountArr;
		   try {

			if (StabiltyDefTc.featureTCDefectCountArr != null && StabiltyDefTc.featureTCDefectCountArr != undefined && StabiltyDefTc.featureTCDefectCountArr.length > 0) {
			//logic to get highest count for testcases and defects strts
		   
				for (var i=0;i<StabiltyDefTc.featureTCDefectCountArr.length; i++) {
				   console.log("fname=====>"+StabiltyDefTc.featureTCDefectCountArr[i].featureName+"DefectCount======>"+StabiltyDefTc.featureTCDefectCountArr[i].defectCount+"testcaseCount======>"+StabiltyDefTc.featureTCDefectCountArr[i].tcCount);
				  
					maxDefectCountArr.push(StabiltyDefTc.featureTCDefectCountArr[i].defectCount);
					maxTestcaseCountArr.push(StabiltyDefTc.featureTCDefectCountArr[i].tcCount);
				}
					console.log("maxDefectCountArr=====>"+maxDefectCountArr);
					console.log("maxTestcaseCountArr====>"+maxTestcaseCountArr);
					//logic to get highest count for testcases and defects ends
					
					var maxDefects = Math.max.apply(Math, maxDefectCountArr);
					var maxTestcases = Math.max.apply(Math, maxTestcaseCountArr);

					for (var l = 0; l < StabiltyDefTc.featureTCDefectCountArr.length; l++) {

							var eachData = [];

							eachData.push(parseInt(StabiltyDefTc.featureTCDefectCountArr[l].tcCount));
							eachData.push(parseInt(StabiltyDefTc.featureTCDefectCountArr[l].defectCount)); 
							//eachData.push(parseInt(featureTCDefectCountArr[l].tcCount));
							//eachData.push(color); 
							eachData.push(StabiltyDefTc.GetColorTCDefect(StabiltyDefTc.featureTCDefectCountArr[l].tcCount,StabiltyDefTc.featureTCDefectCountArr[l].defectCount,maxTestcases,maxDefects));
							if(StabiltyDefTc.featureTCDefectCountArr[l].featureName != null){
							eachData.push('<span><b>'+StabiltyDefTc.featureTCDefectCountArr[l].featureName.toString()+'</b><br>&nbsp;&nbsp;&nbsp;defects&nbsp;&nbsp;&nbsp;:'+StabiltyDefTc.featureTCDefectCountArr[l].defectCount+'<br>&nbsp;&nbsp;&nbsp;testcases:'+StabiltyDefTc.featureTCDefectCountArr[l].tcCount+'</span>'); //tool tip with feature, defects, testcase;
							scatterData.push(eachData);
							}

					 }
						 
						var maxDefects = Math.max.apply(Math, maxDefectCountArr);
						var maxTestcases = Math.max.apply(Math, maxTestcaseCountArr);
								
					if (scatterData != null && scatterData.length > 0) {

					  //  ClearLabels();
						RGraph.Clear(document.getElementById("canvas_DefectTCGraphs"));
						RGraph.ObjectRegistry.Clear(document.getElementById("canvas_DefectTCGraphs"));
						//CreateQuadrantGraph('canvas_DefectTCGraphs', scatterData,maxDefects,maxTestcases,"Test Cases", "Defects", "Feature Stability"); 
						StabiltyDefTc.CreateQuadrantGraph('canvas_DefectTCGraphs', scatterData,maxTestcases,maxDefects,"Test Cases", "Defects", "Feature Stability");
						//document.getElementById("currentTimeStamp").innerHTML =  StabiltyDefTc.getDateTime();
						 $('#scatterLegend').show();
						//CreateQuadrantGraph1('canvas_DefectTCGraphs', scatterData,maxTestcaseCountArr,maxTestcases,maxDefectCountArr,maxDefects,"Test Cases", "Defects", "Feature Stability");//method to test
					}
			}

		} catch (e) {
			console.log(e);
		}

		//StabiltyDefTc.unblockElementFunction("");
		//ISEUtils.portletUnblocking("pageContainer");
	},	
	GetColorTCDefect: function(val1,val2,xmaxx,ymaxx) {

		if ((val1 <= xmaxx/2) && (val2 <= ymaxx/2))
			return 'green';
		else if ((val1 <= xmaxx/2) && (val2 >= ymaxx/2))
			return '#9400D3';
		else if ((val1 >= xmaxx/2) && (val2 <= ymaxx/2))
			return 'blue';
		else
			return 'red';
	},
	
	AddTestcaseMarkedData: function(featureTCDefectCountArr){
		var barDataLabels = [];
		var barDataValues = [];
		var legendData = [];
		var chartColors = [];
		var toolTipData = [];
		var textAngle = 50;
		var color = 'rgba(255,0,0,0.5)';
		var scatterData = [];
		var maxDefectCountArr = [];
		var maxTestcaseCountArr = [];
		GlobalTestcaseMarkedData = [];
		StabiltyDefTc.featureTCDefectCountArr = featureTCDefectCountArr;
		   try {

			if (StabiltyDefTc.featureTCDefectCountArr != null && StabiltyDefTc.featureTCDefectCountArr != undefined && StabiltyDefTc.featureTCDefectCountArr.length > 0) {
			//logic to get highest count for testcases and defects strts
		   
				for (var i=0;i<StabiltyDefTc.featureTCDefectCountArr.length; i++) {
				   console.log("fname=====>"+StabiltyDefTc.featureTCDefectCountArr[i].featureName+"DefectCount======>"+StabiltyDefTc.featureTCDefectCountArr[i].defectCount+"testcaseCount======>"+StabiltyDefTc.featureTCDefectCountArr[i].tcCount);
				  
					maxDefectCountArr.push(StabiltyDefTc.featureTCDefectCountArr[i].defectCount);
					maxTestcaseCountArr.push(StabiltyDefTc.featureTCDefectCountArr[i].tcCount);
				}
					console.log("maxDefectCountArr=====>"+maxDefectCountArr);
					console.log("maxTestcaseCountArr====>"+maxTestcaseCountArr);
					//logic to get highest count for testcases and defects ends
					
					var maxDefects = Math.max.apply(Math, maxDefectCountArr);
					var maxTestcases = Math.max.apply(Math, maxTestcaseCountArr);

					for (var l = 0; l < StabiltyDefTc.featureTCDefectCountArr.length; l++) {

							var eachData = [];

							eachData.push(parseInt(StabiltyDefTc.featureTCDefectCountArr[l].tcCount));
							eachData.push(parseInt(StabiltyDefTc.featureTCDefectCountArr[l].defectCount)); 
							//eachData.push(parseInt(featureTCDefectCountArr[l].tcCount));
							//eachData.push(color); 
							eachData.push(StabiltyDefTc.GetColorTCDefect(StabiltyDefTc.featureTCDefectCountArr[l].tcCount,StabiltyDefTc.featureTCDefectCountArr[l].defectCount,maxTestcases,maxDefects));
							if(StabiltyDefTc.featureTCDefectCountArr[l].featureName != null){
							eachData.push('<span><b>'+StabiltyDefTc.featureTCDefectCountArr[l].featureName.toString()+'</b><br>&nbsp;&nbsp;&nbsp;defects&nbsp;&nbsp;&nbsp;:'+StabiltyDefTc.featureTCDefectCountArr[l].defectCount+'<br>&nbsp;&nbsp;&nbsp;testcases:'+StabiltyDefTc.featureTCDefectCountArr[l].tcCount+'</span>'); //tool tip with feature, defects, testcase;
							scatterData.push(eachData);
							}

					 }
						 
						var maxDefects = Math.max.apply(Math, maxDefectCountArr);
						var maxTestcases = Math.max.apply(Math, maxTestcaseCountArr);
						if(maxTestcases == 0)
						{
							maxTestcases = 10;
						}
						if(maxDefects == 0)
						{
							maxDefects = 10;
						}
								
					if (scatterData != null && scatterData.length > 0) {

					  //  ClearLabels();		
						RGraph.Clear(document.getElementById("canvas_DefectTCGraphs"));					  
						RGraph.ObjectRegistry.Clear(document.getElementById("canvas_DefectGraphs"));
						//CreateQuadrantGraph('canvas_DefectTCGraphs', scatterData,maxDefects,maxTestcases,"Test Cases", "Defects", "Feature Stability"); 
						StabiltyDefTc.CreateQuadrantGraph('canvas_DefectTCGraphs', scatterData,maxTestcases,maxDefects,"Test Cases", "Defects", "Feature Stability");
						//document.getElementById("currentTimeStamp").innerHTML =  StabiltyDefTc.getDateTime();
						 $('#scatterLegend').show();
						//CreateQuadrantGraph1('canvas_DefectTCGraphs', scatterData,maxTestcaseCountArr,maxTestcases,maxDefectCountArr,maxDefects,"Test Cases", "Defects", "Feature Stability");//method to test
					}
			}

		} catch (e) {
			console.log(e);
		}

		//StabiltyDefTc.unblockElementFunction("");
		//ISEUtils.portletUnblocking("pageContainer");
	},	
	CreateQuadrantGraph: function(elementId,scatterData,xMax,yMax,xAxisTitle,yAxisTitle,graphTitle) {
		
		var canvas = document.getElementById(elementId);
		RGraph.Clear(canvas);
			var scatter = new RGraph.Scatter(elementId, scatterData);
            scatter.Set('chart.xmax', xMax);
            scatter.Set('chart.ymax', yMax);
           // scatter.Set('chart.gutter', 30);
			scatter.Set('chart.gutter.left', 200)
			scatter.Set('chart.gutter.top', 40)
			scatter.Set('chart.gutter.bottom', 40)
            //scatter4.Set('chart.labels', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
            scatter.Set('chart.title', graphTitle);
			//scatter.Set('chart.background.hbars', [[0,yMax/2,'rgba(0,0,0,0.1)']]);
			//scatter.Set('chart.background.vbars', [[0,xMax/2,'rgba(0,0,0,0.1)']]);
            scatter.Set('chart.background.barcolor1', 'white');
            scatter.Set('chart.background.barcolor2', 'white');
		    scatter.Set('chart.background.hbars', [[0,yMax/2,'rgba(128,0,0,0.2)']]);
			scatter.Set('chart.background.vbars', [[0,xMax/2,'rgba(0,128,0,0.2)']]);
            scatter.Set('chart.tickmarks', 'circle');
            scatter.Set('chart.ticksize', 16);
            scatter.Set('chart.text.angle', 90);
            //scatter.Set('chart.defaultcolor', 'blue');
			scatter.Set('title.xaxis', xAxisTitle);
			scatter.Set('title.yaxis', yAxisTitle);
			scatter.Set('chart.textAccessible', true);
			scatter.Set('chart.ylabelsOffsetx', -150);
			//scatter.Set('chart.shadow',true);
			// shadow: true,
			//hmargin 
			

            /*if (!document.all) {
                scatter.Set('chart.annotatable', true);
                scatter.Set('chart.zoom.mode', 'thumbnail');
                scatter.Set('chart.contextmenu', [['Clear', function () {RGraph.Clear(scatter.canvas); scatter.Draw();}]]);
            }*/

           // scatter.Draw();
		    scatter.Draw();
		},
		populateTCDefectReleases: function(){
	
	 try {
			$('#cmb_TCDefectReleases').empty();
			//ISEUtils.portletBlocking("pageContainer");
			var requestObject = new Object();
			requestObject.projectName = localStorage.getItem('projectName');
			requestObject.collectionName = "defectsheatmap_collection,testcasesheatmap_collection";
			ISE.getDistinctReleasesInfo(requestObject, StabiltyDefTc.callBackGetreleases);  
		}
		catch (e) {
			console.log(e);
		}
	},
	callBackGetreleases: function(data){		
			//ISEUtils.portletUnblocking("pageContainer");
			StabiltyDefTc.defectReleaseData = data;
			console.log("****StabiltyDefTc.defectReleaseData****"+StabiltyDefTc.defectReleaseData);
			if (ISEUtils.validateObject(StabiltyDefTc.defectReleaseData)) {

				//var releaseArray = StabiltyDefTc.getArrayFromJsonByKey(data, 'RELEASE_NAME');
			   // var releaseIds = StabiltyDefTc.getArrayFromJsonByKey(data, 'RELEASE_ID_PK');
				
				// added for mongo 
				var releaseArray = [];
				//var releaseIds = [];
				
				for(var i = 0 ; i < data.length ; i++){						
						releaseArray[i] = data[i].release;
						//releaseIds[i] = (data[i].__tmp0)._id;							
					}
				
				var qualitySelect = document.getElementById('cmb_TCDefectReleases');
					
				if (releaseArray != null && releaseArray != undefined && releaseArray.length > 0) {
				//tmp fix
				//qualitySelect.options.add(new Option("6.0 SP1"));
				//qualitySelect.options.add(new Option("20"));
				releaseArray.sort();
				releaseArray.reverse();
					for (var i = 0; i < releaseArray.length; i++) {
						qualitySelect.options.add(new Option(releaseArray[i]));
					}
				 var opt2=document.createElement('option'); 
				 //opt2.setAttribute('value','0'); 
				 opt2.appendChild(document.createTextNode("All Releases")); 
				 qualitySelect.appendChild(opt2);
				}
				//sortSelect(qualitySelect);
			}
			else
			{
				alert("Failed to load graph")
			}
	}
	
	

}