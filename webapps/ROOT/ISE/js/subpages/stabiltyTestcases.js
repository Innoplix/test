var stabiltyTestcases = {
selTestcaseReleaseIds : "",
totalTestcaseReleasesArray : [],
totalTestcasesDataObject : [],
maxCountTestcases : 0,
groupByRelease_testcases : [],
timeoutVal:300,
selectAllObj : { label: "Select all", val: "-1" },
deSelectAllObj : { label: "Unselect all", val: "-2" },
	init: function() {
	
 stabiltyTestcases.PopulateTCHeatMap();

 // rows : [];
  },

PopulateTCHeatMap: function() {
	try
	{	
	ISEUtils.portletBlocking("pageContainer");
	var requestObject = new Object();
	requestObject.projectName = localStorage.getItem('projectName')
	requestObject.collectionName = "testcasesheatmap_collection";
	ISE.getDefectsHeatMapResults(requestObject, stabiltyTestcases.callBackGettestcasessData); 
	}
	catch(e)
	{
	ISEUtils.portletUnblocking("pageContainer");
	}	
	},
	callBackGettestcasessData: function(rows){
	
		try {
		if (ISEUtils.validateObject(rows)) {		
		var groupByRelease = _.groupBy(rows, function (object) { return object.release; })
					stabiltyTestcases.groupByRelease_testcases = groupByRelease;

					stabiltyTestcases.totalTestcasesDataObject = rows;

					stabiltyTestcases.totalTestcaseReleasesArray = [];

					_.each(groupByRelease, function (val, key) {
						stabiltyTestcases.totalTestcaseReleasesArray.push(key);
					});

					stabiltyTestcases.totalTestcaseReleasesArray.sort();
					stabiltyTestcases.totalTestcaseReleasesArray.reverse();
					var date  = new Date(rows[0].last_updateddate);
					var newDate = date.getFullYear()+'/' + (date.getMonth()+1) + '/'+date.getDate()+"  "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds() ;
				    document.getElementById("lbl_UpdatedOnDataTestCases").innerHTML = newDate

					stabiltyTestcases.populateReleasesCombo('cmb_TestCaseReleases');

					stabiltyTestcases.onFilterTestCaseReleasesClick();
		}
		else {
					alert("Failed to get graph data");
					ISEUtils.portletUnblocking("pageContainer");
				}
		}
		catch (e) {
			console.log(e);
			alert("Failed to get graph data");
			ISEUtils.portletUnblocking("pageContainer");
		}
},
		
onRefreshTestCases: function(cached) {
	//pending
	//stabiltyTestcases.LoadHMCanvasSize();
		//stabiltyTestcases.isCached = cached;
		//pending
		//setTimeout(stabiltyTestcases.blockElementFunction, 0);
		try
		{
		ISEUtils.portletBlocking("pageContainer");
		setTimeout(stabiltyTestcases.onRefreshData, stabiltyTestcases.timeOutVal);
		}
		catch(e)
		{
			alert("Failed to get graph data");
			ISEUtils.portletUnblocking("pageContainer");
		}
		//PopulateDefectsHeatMap('testcases');
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
	onFilterTestCaseReleasesClick: function() {

		//setTimeout(stabiltyTestcases.blockElementFunction, 0);
		try
		{
		ISEUtils.portletBlocking("pageContainer");
		setTimeout(stabiltyTestcases.onTestCaseFilterReleases, stabiltyTestcases.timeoutVal);
		}
		catch(e)
		{
			alert("Failed to get graph data");
			ISEUtils.portletUnblocking("pageContainer");
		}	
	},

	onTestCaseFilterReleases: function() {

		stabiltyTestcases.selTestcaseReleaseIds = "";
		var selReleaseIds = $("#cmb_TestCaseReleases").val();

		if (!ISEUtils.validateObject(selReleaseIds)) {

			selReleaseIds = "";

			for (var i = 0; i < 4; i++) {
				selReleaseIds += stabiltyTestcases.totalTestcaseReleasesArray[i] + "~";
			}
			if (selReleaseIds && selReleaseIds.length > 0) {
				selReleaseIds = selReleaseIds.substr(0, selReleaseIds.length - 1);
				stabiltyTestcases.checkSelectedValuesForReleaseComobo(selReleaseIds, "cmb_TestCaseReleases"); //this method is existing
			}

			stabiltyTestcases.selTestcaseReleaseIds = selReleaseIds;
		}
		else {

			for (var i = 0; i < selReleaseIds.length; i++) {
				stabiltyTestcases.selTestcaseReleaseIds += selReleaseIds[i] + "~";
			}
			if (stabiltyTestcases.selTestcaseReleaseIds && stabiltyTestcases.selTestcaseReleaseIds.length > 0) {
				stabiltyTestcases.selTestcaseReleaseIds = stabiltyTestcases.selTestcaseReleaseIds.substr(0, stabiltyTestcases.selTestcaseReleaseIds.length - 1);
			}
		}

		stabiltyTestcases.ProcessAndPlotTestCaseHeatmapsData();

		//stabiltyTestcases.unblockElementFunction("");
		ISEUtils.portletUnblocking("pageContainer");
	},

	ProcessAndPlotTestCaseHeatmapsData: function() {

		try {
			if (stabiltyTestcases.totalTestcasesDataObject && ISEUtils.validateObject(stabiltyTestcases.selTestcaseReleaseIds)) {

				var idsArray = stabiltyTestcases.selTestcaseReleaseIds.split("~");

				if (ISEUtils.validateObject(idsArray) && idsArray.length > 0) {

					var rows = jQuery.extend(true, new Array(), stabiltyTestcases.totalTestcasesDataObject);
	//var features = [];
					//var groupByRelease = _.groupBy(rows, function (object) { return object.release; })
					//var groupByFeature = _.groupBy(rows, function (object) { return object.feature; })

						var groupByRelease = _.groupBy(rows, function (object) { return object.release; })
					//var groupByFeature = _.groupBy(rows, function (object) { return object.feature; })
					var groupByparentFeature = _.groupBy(rows, function (object) { return object.parentfeature; })

					stabiltyTestcases.eventDataTC = [];
					var releases = [];
					var features = [];
					var scatterData = [];
					var bubbleData = [];
					var xNo = 0;
					var index = 0;
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

					//stabilitysample.groupByFeature_defects = groupByFeature;
					//stabilitysample.eventData = [];
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

								stabiltyTestcases.eventDataTC.push(features[f]);

								var eachData = [];
								stabiltyTestcases.passed = 0;
								stabiltyTestcases.failed = 0;
								var bblData = 0
								//eachData.push(parseFloat(xNo - randomNumber(3, 7)));
								eachData.push(parseFloat(xNo - stabiltyTestcases.getPositionTC(bblData)));
								eachData.push(parseFloat(stabiltyTestcases.GetFeatureIndex(features[f], features) - 0.5));
								eachData.push(stabiltyTestcases.GetColorTC(bblData));
								eachData.push("<span><b>" + features[f] + "</b><br>&nbsp;&nbsp;&nbsp;Passed:" + stabiltyTestcases.passed.toString() + "<br>&nbsp;&nbsp;&nbsp;Failed:" + stabiltyTestcases.failed.toString() + "<br>&nbsp;&nbsp;&nbsp;Failure rate:" + stabiltyTestcases.TrimTo2Digits(bblData) + "<span>");
								scatterData.push(eachData);
								bubbleData.push(bblData);
								}
								
							}
							var groupByparentFeature = _.groupBy(val, function (object) { return object.parentfeature; })
						
							_.each(groupByparentFeature, function (pval, pkey) {
							
							var groupByFeature = _.groupBy(pval, function (object) { return object.feature; })
							_.each(groupByFeature, function (fval, fkey) {
							
								var featurename ;
								var eachEvtData = [];

								eachEvtData.push(index);
								eachEvtData.push(key);
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
								stabiltyTestcases.eventDataTC.push(eachEvtData);

								var eachData = [];
								stabiltyTestcases.passed = 0;
								stabiltyTestcases.failed = 0;
								var bblData = stabiltyTestcases.GetBblDataTC(fval);
								//eachData.push(parseFloat(xNo - randomNumber(3, 7)));
								eachData.push(parseFloat(xNo - stabiltyTestcases.getPositionTC(bblData)));
								eachData.push(parseFloat(stabiltyTestcases.GetFeatureIndex(featurename, features) - 0.5));
								eachData.push(stabiltyTestcases.GetColorTC(bblData));
								eachData.push("<span><b>" + featurename+ "</b><br>&nbsp;&nbsp;&nbsp;Passed:" + stabiltyTestcases.passed.toString() + "<br>&nbsp;&nbsp;&nbsp;Failed:" + stabiltyTestcases.failed.toString() + "<br>&nbsp;&nbsp;&nbsp;Failure rate:" + stabiltyTestcases.TrimTo2Digits(bblData) + "<span>");
								scatterData.push(eachData);
								bubbleData.push(bblData);
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
					RGraph.ObjectRegistry.Clear(document.getElementById('cvsTestcases'));
					stabiltyTestcases.CreateBubbleGraph('cvsTestcases', scatterData, releases, bubbleData, releases, featuresRev, "Releases", "Features", 'Release wise feature stability by test execution', stabiltyTestcases.BubbleClickEventTC);
					$("#cvsTestcases_rgraph_domtext_wrapper").height($("canvas#cvsTestcases").height());
				}
			}
		}
		catch (e) {
			console.log("ProcessAndPlotTestCaseHeatmapsData exception - " + e);
			alert("Failed to get graph data");
			ISEUtils.portletUnblocking("pageContainer");
		}
	},

	onSetDefaultTestCaseReleases: function() {

		$("#cmb_TestCaseReleases").val("");
		document.getElementById("cmb_TestCaseReleases").options[0] = new Option(stabiltyTestcases.selectAllObj.label, stabiltyTestcases.selectAllObj.val);
		$("#cmb_TestCaseReleases").trigger("chosen:updated");

		stabiltyTestcases.onFilterTestCaseReleasesClick();
	},
populateReleasesCombo: function(elementId) {
		try {
			var selCmb = document.getElementById(elementId);
			if (ISEUtils.validateObject(selCmb)) {
				selCmb.options.length = 0;
				selCmb.options.add(new Option(stabiltyTestcases.selectAllObj.label, stabiltyTestcases.selectAllObj.val));

						if (ISEUtils.validateObject(stabiltyTestcases.totalTestcaseReleasesArray)) {
							for (var i = 0; i < stabiltyTestcases.totalTestcaseReleasesArray.length; i++) {
								selCmb.options.add(new Option(stabiltyTestcases.totalTestcaseReleasesArray[i], stabiltyTestcases.totalTestcaseReleasesArray[i]));
							}
						}
							
				
			}
			stabiltyTestcases.intializeReleasesCmbBox(elementId);
		}
		catch (e) {

			console.log("populateReleasesCombo exception " + e);
			alert("Failed to get graph data");
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
				stabiltyTestcases.onReleasesComboSelect(evt, params);
			});
		}
		catch (e) {
			console.log("intializeDefectsReleasesCmbBox exception - " + e);
			alert("Failed to get graph data");
			ISEUtils.portletUnblocking("pageContainer");
		}
	},
	onReleasesComboSelect: function(evt, params) {
		var selObj = evt.currentTarget;
		
		if (ISEUtils.validateObject(selObj)) {
			var elementId = selObj.id;
			if (params.selected == "-1") {
				selObj.options[0] = new Option(stabiltyTestcases.deSelectAllObj.label, stabiltyTestcases.deSelectAllObj.val);
				$("#" + elementId).trigger("chosen:updated");
				var totalIds = "";
				
					
						$("#cmb_TestCaseReleases").val(stabiltyTestcases.totalTestcaseReleasesArray);
						for (var i = 0; i < stabiltyTestcases.totalTestcaseReleasesArray.length; i++) {

							totalIds = totalIds + "~" + stabiltyTestcases.totalTestcaseReleasesArray[i];
						}
					
			
				if (totalIds.length > 0) {
					totalIds = totalIds.substr(1, totalIds.length);
				}
				stabiltyTestcases.checkSelectedValuesForReleaseComobo(totalIds, elementId);
			}
			else if (params.selected == "-2") {

				selObj.options[0] = new Option(stabiltyTestcases.selectAllObj.label, stabiltyTestcases.selectAllObj.val);
				$("#" + elementId).trigger("chosen:updated");

				$("#" + elementId).val("");
				stabiltyTestcases.checkSelectedValuesForReleaseComobo("", elementId);
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

CreateBubbleGraph: function(elementId,scatterData,xAxisData, bubbleData, xAxisLables, yAxisLables, xAxisTitle, yAxisTitle, graphTitle, BubbleClickEvent) {
	
    var canvas = document.getElementById(elementId);
	RGraph.Reset(canvas);
    canvas.setAttribute('width', '900');
    canvas.setAttribute('height', '500');
	stabiltyTestcases.SetDynamicHeight(elementId, yAxisLables.length,400);
	stabiltyTestcases.SetDynamicWidth(elementId, xAxisData.length,400);
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
	GetBblDataTC:function(featureSet) {

		if (featureSet[0].passfail == 'passed')
			stabiltyTestcases.passed = parseFloat(featureSet[0].count);
		else if(featureSet[0].passfail == 'failed')
			stabiltyTestcases.failed = parseFloat(featureSet[0].count);

		if (featureSet.length > 1) {
		for(var f=0; f<featureSet.length; f++)
		{
		
			if (featureSet[f].passfail == 'passed')
				stabiltyTestcases.passed = parseFloat(featureSet[f].count);
			else if(featureSet[f].passfail == 'failed')
				stabiltyTestcases.failed = parseFloat(featureSet[f].count);
				}
		}
		if(stabiltyTestcases.failed  == 0 & stabiltyTestcases.passed == 0)
		{
			return 0;
		}
		//var val =  parseFloat((passed/(passed+failed)) * 100);
		var val = parseFloat((stabiltyTestcases.failed / (stabiltyTestcases.passed + stabiltyTestcases.failed)) * 100);
		return val;
	},
	GetColorTC: function(val) {
		if (val < 30)
			return 'green';
		else if (val < 50)
			return 'lime';
		else
			return 'red';
	},
	getPositionTC: function(count) {
		if (count < 30)
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
	TrimTo2Digits: function(val) {
		var index = val.toString().indexOf('.');
		if (index != -1) {
			val = val.toString().substring(0, index + 3).toString() + "%";
		}
		else {
			val = val.toString() + "%";
		}
		return val
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
	onRefreshData:function()
	{
		//requestObject.username = localStorage.getItem('username');
		var jsondata = {username:localStorage.getItem('username'),project:localStorage.getItem('projectName'),type:"mongo",operation:"stabiltyTestcases"}
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
		stabiltyTestcases.PopulateTCHeatMap();
		},
		error: function(msg) {
		console.log(error);callBackFunction([])
		}
		});
	},


}