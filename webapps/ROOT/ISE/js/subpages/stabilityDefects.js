var stabilityDefects = {
selectAllObj : { label: "Select all", val: "-1" },
deSelectAllObj : { label: "Unselect all", val: "-2" },
selDefectsReleaseIds : "",
totalDefectsReleasesArray : [],
totalDefectsDataObject : {},
maxCountDefects:0 ,
HMFeatureStatusDDHeight : 0,
HMFeatureStatusDDWidth : 0,
  init: function() {		
  stabilityDefects.PopulateDefectsHeatMap();
  rows : [];
  },

PopulateDefectsHeatMap: function() {
	try	
	{	
	ISEUtils.portletBlocking("pageContainer");
	var requestObject = new Object();
	requestObject.projectName = localStorage.getItem('projectName')
	requestObject.collectionName = "defectsheatmap_collection";
	ISE.getDefectsHeatMapResults(requestObject, stabilityDefects.callBackGetDefectsData);   
	}	
	catch(e)
	{
	alert("Failed to get graph data");
	ISEUtils.portletUnblocking("pageContainer");
	}
	},
	callBackGetDefectsData:function(data)
	{
		
		
		var requestObject = new Object();
		requestObject.projectName = localStorage.getItem('projectName')
		requestObject.collectionName = "defectsheatmap_collection";
		ISE.getMaxCountofDefectsHeatmap(requestObject, stabilityDefects.getmaxcount); 
		if (ISEUtils.validateObject(data)) 
		{
			var date  = new Date(data[0].last_updateddate);
		var newDate = date.getFullYear()+'/' + (date.getMonth()+1) + '/'+date.getDate()+"  "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds() ;
		 document.getElementById("lbl_UpdatedOnDataDefects").innerHTML = newDate
			stabilityDefects.totalDefectsDataObject = {}
			stabilityDefects.totalDefectsDataObject = data;
			 var rows = jQuery.extend(true, [],data);
			var groupByRelease = _.groupBy(rows, function (object) { return object.release; })
			stabilityDefects.totalDefectsReleasesArray = [];

			_.each(groupByRelease, function (val, key) {
				stabilityDefects.totalDefectsReleasesArray.push(key);
			});
			stabilityDefects.totalDefectsReleasesArray.sort();
			stabilityDefects.totalDefectsReleasesArray.reverse();
			
			stabilityDefects.populateReleasesCombo("cmb_DefectsReleases",groupByRelease);
			stabilityDefects.onFilterDefectsReleasesClick();
		}
		else
		{
			alert("Failed to get graph data");
			ISEUtils.portletUnblocking("pageContainer");
		}
	},
	getmaxcount:function(data)
	{
		stabilityDefects.maxCountDefects = data[0].value;
		
	},
	populateReleasesCombo: function(elementId,groupByRelease){
		try {
			var selCmb = document.getElementById(elementId);
			if (ISEUtils.validateObject(selCmb)) {
				selCmb.options.length = 0;
				selCmb.options.add(new Option(stabilityDefects.selectAllObj.label, stabilityDefects.selectAllObj.val));
				}
				if (ISEUtils.validateObject(stabilityDefects.totalDefectsReleasesArray)) {
							for (var i = 0; i < stabilityDefects.totalDefectsReleasesArray.length; i++) {
								selCmb.options.add(new Option(stabilityDefects.totalDefectsReleasesArray[i], stabilityDefects.totalDefectsReleasesArray[i]));
							}
					}				
						stabilityDefects.intializeReleasesCmbBox(elementId);
				}
				catch (e) {
				alert("Failed to get graph");
				console.log("populateReleasesCombo exception " + e);
				ISEUtils.portletUnblocking("pageContainer");
		}
				},
				intializeReleasesCmbBox: function(elementId) {
		try {
		    /* $("#" + elementId).chosen({
				no_results_text: "No Results found for ",
				width: "30%"
			});  */
			$('#' + elementId).on('change', function (evt, params) {
				var params = new Object();				
				params.selected = $(this).val();
				stabilityDefects.onReleasesComboSelect(evt, params);
			});
		}
		catch (e) {
			console.log("intializeDefectsReleasesCmbBox exception - " + e);
			alert("Failed to get graph");
			ISEUtils.portletUnblocking("pageContainer");
		}
	},
	onReleasesComboSelect: function(evt, params) {
		var selObj = evt.currentTarget;
		
		if (ISEUtils.validateObject(selObj)) {
			var elementId = selObj.id;
			if (params.selected == "-1") {
				selObj.options[0] = new Option(stabilityDefects.deSelectAllObj.label, stabilityDefects.deSelectAllObj.val);
				$("#" + elementId).trigger("chosen:updated");
				var totalIds = "";
				
						$("#cmb_DefectsReleases").val(stabilityDefects.totalDefectsReleasesArray);
						//$("#cmb_DefectsReleases").select2();						
						for (var i = 0; i < stabilityDefects.totalDefectsReleasesArray.length; i++) {

							totalIds = totalIds + "~" + stabilityDefects.totalDefectsReleasesArray[i];
						}
						
				if (totalIds.length > 0) {
					totalIds = totalIds.substr(1, totalIds.length);
				}
				stabilityDefects.checkSelectedValuesForReleaseComobo(totalIds, elementId);
			}
			else if (params.selected == "-2") {

				selObj.options[0] = new Option(stabilityDefects.selectAllObj.label, stabilityDefects.selectAllObj.val);
				$("#" + elementId).trigger("chosen:updated");

				$("#" + elementId).val("");
				stabilityDefects.checkSelectedValuesForReleaseComobo("", elementId);
			}
		}
	},
	checkSelectedValuesForReleaseComobo: function(selReleaseIds, elementId) {

		if (ISEUtils.validateObject(selReleaseIds)) {

			var idsArray = selReleaseIds.split("~");

			if (idsArray && idsArray.length > 0) {

				var selCmb = document.getElementById(elementId);

				if (ISEUtils.validateObject(selCmb)) {
					for (var i = 0; i < selCmb.options.length; i++) {
						for (var count = 0; count < idsArray.length; count++) {
							if (selCmb.options[i].value == idsArray[count]) {
								selCmb.options[i].selected = true;
								break;
							}
						}
					}
				}

				$("#" + elementId).trigger("chosen:updated");
				$("#" + elementId).select2();
				//$("#cmb_FeatureReleases").select2();
				//$("#cmb_TestCaseReleases").select2();
			}
		}
		else {

			var selCmb = document.getElementById(elementId);

			if (ISEUtils.validateObject(selCmb)) {
				for (var i = 0; i < selCmb.options.length; i++) {
					selCmb.options[i].selected = false;
				}
			}

			$("#" + elementId).trigger("chosen:updated");
		}
	},
	onFilterDefectsReleasesClick: function() {
		//pending
		//setTimeout(stabilityDefects.blockElementFunction, 0);
		try{
		ISEUtils.portletBlocking("pageContainer");		
		setTimeout(stabilityDefects.onDefectsFilterReleases, 300);
		}
		catch(e)
		{
		alert("Failed to get graph");
		ISEUtils.portletUnblocking("pageContainer");
		}
	},

	onDefectsFilterReleases: function() {

		stabilityDefects.selDefectsReleaseIds = "";
		var selReleaseIds = $("#cmb_DefectsReleases").val();

		if (!ISEUtils.validateObject(selReleaseIds)) {

			selReleaseIds = "";

			for (var i = 0; i < 4; i++) {
				selReleaseIds += stabilityDefects.totalDefectsReleasesArray[i] + "~";
			}
			if (selReleaseIds && selReleaseIds.length > 0) {
				selReleaseIds = selReleaseIds.substr(0, selReleaseIds.length - 1);
				stabilityDefects.checkSelectedValuesForReleaseComobo(selReleaseIds, "cmb_DefectsReleases");
			}

			stabilityDefects.selDefectsReleaseIds = selReleaseIds;
		}
		else {

			for (var i = 0; i < selReleaseIds.length; i++) {
				stabilityDefects.selDefectsReleaseIds += selReleaseIds[i] + "~";
			}
			if (stabilityDefects.selDefectsReleaseIds && stabilityDefects.selDefectsReleaseIds.length > 0) {
				stabilityDefects.selDefectsReleaseIds = stabilityDefects.selDefectsReleaseIds.substr(0, stabilityDefects.selDefectsReleaseIds.length - 1);
			}
		}

		stabilityDefects.processAndPlotDefectsHeatmapsData();
		//pending
		//stabilityDefects.unblockElementFunction("");
		ISEUtils.portletUnblocking("pageContainer");
	},
	processAndPlotDefectsHeatmapsData: function() {
		try {
			if (stabilityDefects.totalDefectsDataObject && ISEUtils.validateObject(stabilityDefects.selDefectsReleaseIds)) {

				var idsArray = stabilityDefects.selDefectsReleaseIds.split("~");

				if (ISEUtils.validateObject(idsArray) && idsArray.length > 0) {

					//  var rows = stabilityDefects.totalDefectsDataObject;

					var rows = jQuery.extend(true, [], stabilityDefects.totalDefectsDataObject);

					var releases = [];
					var features = [];
					var scatterData = [];
					var bubbleData = [];

					var groupByRelease = _.groupBy(rows, function (object) { return object.release; })
					//var groupByFeature = _.groupBy(rows, function (object) { return object.feature; })
					var groupByparentFeature = _.groupBy(rows, function (object) { return object.parentfeature; })


					
							_.each(groupByparentFeature, function (pval, pkey) {
							
							var groupByFeature = _.groupBy(pval, function (object) { return object.feature; })
							_.each(groupByFeature, function (fval, fkey) {
							for(var v=0; v<fval.length;v++)
							{
								var relIndx = idsArray.indexOf(fval[v].release);
								var featureIndx ;
								if (relIndx != -1) {
								if(pkey != 'N.A')
								{
								featureIndx	= features.indexOf(pkey+"--"+fkey);
								}
								else
								{	
									featureIndx	= features.indexOf(fkey);
								}
								if (featureIndx < 0) {
									if(pkey != 'N.A')
									{
										features.push(pkey+"--"+fkey);
									}
									else
									{
										features.push(fkey);
									}
									}
								}
							}
								});
								});
								features.sort(); 
					var xNo = 0;
					var index = 0;

					//stabilityDefects.groupByFeature_defects = groupByFeature;
					stabilityDefects.eventData = [];
					_.each(groupByRelease, function (val, key) {
						var orphanfeatures = [];
						var relIndx = idsArray.indexOf(key);

						if (relIndx != -1) {

							releases.push(key);
							xNo++;
							for(var v=0; v<val.length;v++)
							{
								
								if(val[v].parentfeature != 'N.A')
									{
										orphanfeatures.push(val[v].parentfeature+"--"+val[v].feature);
									}
									else
									{
										orphanfeatures.push(val[v].feature);
									}
							}
							for(var f=0; f<features.length;f++)
							{
								if(orphanfeatures.indexOf(features[f]) == -1 )
								{
									
									var eachEvtData = [];
									eachEvtData.push(index);
									eachEvtData.push(key);
									eachEvtData.push(features[f]);
									//eachEvtData.push(dVal.featureId);
									stabilityDefects.eventData.push(eachEvtData);
									var thisCnt = 0;
									//var thisCntW = (dVal.Open * stabilityDefects.Waitage1) + (dVal.QA * stabilityDefects.Waitage2) + (dVal.Closed * stabilityDefects.Waitage3);
									if(stabilityDefects.maxCountDefects != 0){									
										var normalizedData =  0
									}else{								
										var normalizedData = 0;
									}								
									var eachData = [];
									//eachData.push(parseFloat(xNo-randomNumber(2,8)));
									eachData.push(parseFloat(xNo - stabilityDefects.getPosition(normalizedData)));
									eachData.push(parseFloat(stabilityDefects.GetFeatureIndex(features[f], features) - 0.5));
									//eachData.push(GetColor(dVal.count));
									eachData.push(stabilityDefects.GetColor(normalizedData));
									eachData.push("<span><b>" +features[f] + "</b><br>&nbsp;&nbsp;&nbsp;defects:" + (thisCnt).toString() + "<br><b>Release:" + key + "</span>");
									scatterData.push(eachData);
									//bubbleData.push(dVal.count);
									bubbleData.push(normalizedData);
								}
								
							}
							var groupByparentFeature = _.groupBy(val, function (object) { return object.parentfeature; })
						
							_.each(groupByparentFeature, function (pval, pkey) {
							
							var groupByFeature = _.groupBy(pval, function (object) { return object.feature; })
							_.each(groupByFeature, function (fval, fkey) {
							
								
								var eachEvtData = [];
								eachEvtData.push(index);
								eachEvtData.push(key);
								var featurename;
								if(pkey != 'N.A')
								{
									featurename	= fval[0].parentfeature+"--"+fval[0].feature
								eachEvtData.push(fval[0].parentfeature+"--"+fval[0].feature);
								}
								else
								{
									featurename = fval[0].feature
									eachEvtData.push(fval[0].feature);
								}
								//eachEvtData.push(dVal.featureId);
								stabilityDefects.eventData.push(eachEvtData);
								var thisCnt = fval[0].Open + fval[0].QA + fval[0].Closed;
								//var thisCntW = (dVal.Open * stabilityDefects.Waitage1) + (dVal.QA * stabilityDefects.Waitage2) + (dVal.Closed * stabilityDefects.Waitage3);
								if(stabilityDefects.maxCountDefects != 0){									
									var normalizedData = parseInt((100 / stabilityDefects.maxCountDefects) * fval[0].count);
								}else{								
									var normalizedData = 0;
								}								
								var eachData = [];
								//eachData.push(parseFloat(xNo-randomNumber(2,8)));
								eachData.push(parseFloat(xNo - stabilityDefects.getPosition(normalizedData)));
								eachData.push(parseFloat(stabilityDefects.GetFeatureIndex(featurename, features) - 0.5));
								//eachData.push(GetColor(dVal.count));
								eachData.push(stabilityDefects.GetColor(normalizedData));
								eachData.push("<span><b>" + featurename + "</b><br>&nbsp;&nbsp;&nbsp;defects:" + (thisCnt).toString() + "<br><b>Release:" + key + "</span>");
								scatterData.push(eachData);
								//bubbleData.push(dVal.count);
								bubbleData.push(normalizedData);
								});
							});
						}
							
						
					});

					var featuresRev = [];
					featuresRev.push('');
					for (var i = features.length - 1; i >= 0; i--) {
						featuresRev.push(features[i].length>20?features[i].substring(0,25)+"...":features[i]);
                		featuresRev.push('');
					}

					var elementid;
					var graphTitle;
					elementid = 'cvsDefects';
					graphTitle = 'Feature level defects heat by release';
					
					//featuresRev.sort();				
				RGraph.ObjectRegistry.Clear(document.getElementById(elementid));
				stabilityDefects.CreateBubbleGraph(elementid, scatterData, releases, bubbleData, releases, featuresRev, "Releases", "Features", graphTitle, stabilityDefects.BubbleClickEventDefects);
				$("#cvsDefects_rgraph_domtext_wrapper").height($("canvas#cvsDefects").height());
				}
			}
		}
		catch (e) {
			console.log("processAndPlotDefectsHeatmapsData exception - " + e);
			alert("Failed to get graph");
			ISEUtils.portletUnblocking("pageContainer");
		}
	},
	BubbleClickEventDefects:function()
	{
	
	},
	GetColor: function(count) {
		if (count < 10)
			return 'orange';
		else if (count < 50)
			return 'blue';
		else
			return 'red';
	},

	getPosition: function(count) {
		if (count < 10)
			return 0.8
		else if (count < 50)
			return 0.5
		else
			return 0.3
	},
GetFeatureIndex: function(feature, features) {
		var retVal = 0;
		for (var i = 0; i < features.length; i++) {
			if (feature == features[i]) {
				retVal = i + 1;
				return retVal
			}
		}
	},
	CreateBubbleGraph: function(elementId,scatterData,xAxisData, bubbleData, xAxisLables, yAxisLables, xAxisTitle, yAxisTitle, graphTitle, BubbleClickEvent) {
	
    var canvas = document.getElementById(elementId);
	RGraph.Reset(canvas);
    canvas.setAttribute('width', '900');
    canvas.setAttribute('height', '500');
	stabilityDefects.SetDynamicHeight(elementId, yAxisLables.length,400);
	stabilityDefects.SetDynamicWidth(elementId, xAxisData.length,400);
	var yLenth = (yAxisLables.length-1)/2;
	console.log(yLenth);
	var scatter = new RGraph.Scatter(elementId, scatterData)
		.Set('xmax', xAxisData.length)
		.Set('ylabels.specific',yAxisLables)
		.Set('ymax',yLenth)
		.Set('chart.gutter.left', 200)
		.Set('chart.gutter.top', 40)
		.Set('chart.gutter.bottom', 40)
		.Set('title.xaxis.pos', 0.3)
		.Set('title.yaxis.pos', 0.1)   
		.Set('labels', xAxisLables)
		.Set('xlabels.offset',100)
		.Set('tooltips.hotspot', 10)
		.Set('title', graphTitle)
		.Set('chart.scale.invert', true)
		.Set('background.grid.color','rgb(25,25,25)')
		.Set('background.grid.dashed', true)
		//.Set('background.grid.dotted', true)
		.Set('background.color','black')
		.Set('background.grid.autofit.numhlines',yLenth)
		.Set('background.grid.autofit.numvlines',xAxisData.length)
		.Set('numyticks', 0)
		.Set('numxticks', 0)
		.Set('title.xaxis', xAxisTitle)
		.Set('title.yaxis', yAxisTitle)
		var bubble = new RGraph.Scatter.Bubble(scatter, -10,   // Minimum
												100, // Maximum
												40,  // Max width
												bubbleData // Bubble data
											   );
		bubble.Set('events.click', BubbleClickEvent)
		bubble.Draw();
	},
	SetDynamicHeight: function(elementId, height, initialHeight) {

		var dynamicHeight = height
		//var initialHeight = 500;
		var canvas = document.getElementById(elementId);
		
		for (var len=5;len <= dynamicHeight; len+=5) {
			if(dynamicHeight > len) {
				if(dynamicHeight % len > 0) {
					initialHeight += 100;
					canvas.setAttribute('height',initialHeight);
				}
			}
		}
	},

	SetDynamicWidth: function(elementId, width, initialWidth) {

		var dynamicWidth = width
		//var initialWidth = 900;
		var canvas = document.getElementById(elementId);
		
		for (var len=5;len <= dynamicWidth; len+=5) {
			if(dynamicWidth > len) {
				if(dynamicWidth % len > 0) {
					initialWidth += 600;
					canvas.setAttribute('width',initialWidth);
				}
			}
		}
	},
	onSetDefaultDefectsReleases: function() {

		$("#cmb_DefectsReleases").val("");
		document.getElementById("cmb_DefectsReleases").options[0] = new Option(stabilityDefects.selectAllObj.label, stabilityDefects.selectAllObj.val);
		$("#cmb_DefectsReleases").trigger("chosen:updated");
		stabilityDefects.onFilterDefectsReleasesClick();
	},
	onRefreshDefects: function(cached) {
	//pending
	//stabilityDefects.LoadHMCanvasSize();
		//stabilityDefects.isCached = cached;
		//pending
		//setTimeout(stabilityDefects.blockElementFunction, 0);
		try
		{
		ISEUtils.portletBlocking("pageContainer");
		
		setTimeout(stabilityDefects.onRefreshData, 300);
		}
		catch(e)
		{
		alert("Failed to get graph");
		ISEUtils.portletUnblocking("pageContainer");
		}

		// PopulateDefectsHeatMap('defects');
	},
	onRefreshData:function()
	{
		//requestObject.username = localStorage.getItem('username');
	var jsondata = {username:localStorage.getItem('username'),project:localStorage.getItem('projectName'),type:"mongo",operation:"stabilityDefects"}//{username:localStorage.getItem('username'),operation:'list'}
	 var serviceName='JscriptWS'; 
	var hostUrl = '/DevTest/rest/';
	var methodname = 'commandService'
	var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + 
	localStorage.projectName+'&sname='+methodname;
		var html;					
		$.ajax({
		type: "POST",
		url: Url,
		async: true,
		data: JSON.stringify(jsondata),
		success: function(msg) {
		stabilityDefects.PopulateDefectsHeatMap();
		},
		error: function(msg) {
		console.log(error);callBackFunction([])
		}
		});
	},
	LoadHMCanvasSize: function() {
		/* var HMCanvasFeatureTrend = document.getElementById("cvsFeatureTrend");
		stabilityDefects.HMFeatureTrendDDHeight = HMCanvasFeatureTrend.height;
		stabilityDefects.HMFeatureTrendDDWidth = HMCanvasFeatureTrend.width; */

		var HMCanvasFeatureStatus = document.getElementById("CanvasHMChart");
		stabilityDefects.HMFeatureStatusDDHeight = HMCanvasFeatureStatus.height;
		stabilityDefects.HMFeatureStatusDDWidth = HMCanvasFeatureStatus.width;
	},
	onRefreshImgHover: function(event) {
		if (event) {
			var targetButton = event.currentTarget;
			if (targetButton != null) {
				$("#" + targetButton.id).attr("class", "shadowfilter");
			}
		}
	},

	onRefreshImgout: function(event) {
		if (event) {
			var targetButton = event.currentTarget;
			if (targetButton != null) {
				$("#" + targetButton.id).attr("class", "");
			}
		}
	},

}