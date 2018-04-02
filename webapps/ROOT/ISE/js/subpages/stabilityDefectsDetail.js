var stabilityDefectsDetail = {
selFeatureReleaseIds : "",
selFeatureDefectsReleaseIds : "",
featureMappingDataObject : {},
featureDefectMappingDataObject : {},
featureMappingDataArray : [],
featureDefectMappingDataArray : [],
totalFeatureReleasesArray : [],
fixedSev1 : "1",
fixedSev2 : "2",
fixedSev3 : "3",
fixedSev4 : "4",
fixedSev5 : "5",
selectAllObj : { label: "Select all", val: "-1" },
deSelectAllObj : { label: "Unselect all", val: "-2" },
timeoutVal:300,
  init: function() {		
  stabilityDefectsDetail.PopulateFeaturesHeatMap();
  rows : [];
  },

PopulateFeaturesHeatMap: function() {
	
		try {
			document.getElementById("lbl_IntSev1").innerHTML = stabilityDefectsDetail.fixedSev1;
			document.getElementById("lbl_IntSev2").innerHTML = stabilityDefectsDetail.fixedSev2;
			document.getElementById("lbl_IntSev3").innerHTML = stabilityDefectsDetail.fixedSev3;
			document.getElementById("lbl_IntSev4").innerHTML = stabilityDefectsDetail.fixedSev4;
			document.getElementById("lbl_IntSev5").innerHTML = stabilityDefectsDetail.fixedSev5;

			document.getElementById("lbl_ExtSev1").innerHTML = stabilityDefectsDetail.fixedSev1;
			document.getElementById("lbl_ExtSev2").innerHTML = stabilityDefectsDetail.fixedSev2;
			document.getElementById("lbl_ExtSev3").innerHTML = stabilityDefectsDetail.fixedSev3;
			document.getElementById("lbl_ExtSev4").innerHTML = stabilityDefectsDetail.fixedSev4;
			document.getElementById("lbl_ExtSev5").innerHTML = stabilityDefectsDetail.fixedSev5;

			$("#tblHead_FeatureReleaseDefectsMapping").empty();
			$("#tblBody_FeatureReleaseDefectsMapping").empty();

		   // var defectsHMData = stabilityDefectsDetail.GetDefectsHMData("featuremapping");
		   stabilityDefectsDetail.tempDefectsHMData = [];
		 var requestObject = new Object();
	requestObject.projectName = localStorage.getItem('projectName')
	requestObject.collectionName = "defectsfeaturesheatmap_collection";
					ISE.getDefectsHeatMapResults(requestObject, stabilityDefectsDetail.callBackFeaturesHEatMapData);   	 
		}
		catch (e) {
			console.log("PopulateFeaturesHeatMap : "+e);
			alert("Failed to get graph data");
		ISEUtils.portletUnblocking("pageContainer");
		}
		//pending
		//stabilityDefectsDetail.unblockElementFunction("");
		ISEUtils.portletUnblocking("pageContainer");
	},
	callBackFeaturesHEatMapData: function(data){
		var defectsHMData = [];
	    defectsHMData = data;
		   console.log("features heatmap defectsHMData"+defectsHMData);
			if (ISEUtils.validateObject(defectsHMData)) {

				var retDataObj = stabilityDefectsDetail.processFeatureMappingData(defectsHMData);

				if (ISEUtils.validateObject(retDataObj)) {
					
					var date  = new Date(defectsHMData[0].last_updateddate);
					var newDate = date.getFullYear()+'/' + (date.getMonth()+1) + '/'+date.getDate()+"  "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds() ;
					document.getElementById("lbl_UpdatedOnFeatureMapping").innerHTML =  newDate

					stabilityDefectsDetail.featureMappingDataArray = jQuery.extend(true, [], retDataObj.FinalArray);
					stabilityDefectsDetail.featureMappingDataObject = jQuery.extend(true, {}, retDataObj);
					stabilityDefectsDetail.totalFeatureReleasesArray = jQuery.extend(true, [], retDataObj.totalReleasesArray);
                                        stabilityDefectsDetail.totalFeatureReleasesArray.sort();
					stabilityDefectsDetail.totalFeatureReleasesArray.reverse();
					stabilityDefectsDetail.populateReleasesCombo("cmb_FeatureReleases");
					stabilityDefectsDetail.onFilterFeatureReleasesClick();
				}
			}
			else {

			alert("Failed to get graph data");
			ISEUtils.portletUnblocking("pageContainer");
			}
	
	},
	processFeatureMappingData: function(defectsHMData) {

		var retObject = new Object();		
		try {			
			
			var maxCountF = 0;
			var rows = [];
				
				var releseGrp = _.groupBy(defectsHMData, function (object) { return object.release; })
				if (releseGrp) {

					var totalReleasesArray = [];
					_.each(releseGrp, function (rVal, rKey) {
						totalReleasesArray.push(rKey);
					});
					

					var pfeatureGrp = _.groupBy(defectsHMData, function (object) { return object.parentfeature; })
					//var featureGrp = _.groupBy(defectsHMData, function (object) { return object.feature; })
					var finalFeaturesArray = [];

					_.each(pfeatureGrp, function (pVal, pKey) {
					
					var featureGrp = _.groupBy(pVal, function (object) { return object.feature; })
					_.each(featureGrp, function (fVal, fKey) {
					

						var finalObj = new Object();
						if(pKey != 'N.A')
						{
							finalObj.Feature = pKey+"--"+fKey;
						}
						else
						{
							finalObj.Feature = fKey;
						}
						
						finalObj.ReleasesData = [];

						var fReleaseGrp = _.groupBy(fVal, function (object) { return object.release; })
						
						_.each(fReleaseGrp, function (rVal, rKey) {

							var releaseDataObj = new Object();
							releaseDataObj.Release = rKey;
							releaseDataObj.SeverityData = [];
							var featureSpecificCnt = 0;

							for (var j = 0; j < rVal.length; j++) {

								var severityObj = new Object();

								severityObj.Severity = rVal[j].severity;
								severityObj.Count = rVal[j].count;
								severityObj.Type = rVal[j].internaldefect;
								releaseDataObj.SeverityData.push(severityObj);
							}

							finalObj.ReleasesData.push(releaseDataObj);
						});
							finalFeaturesArray.push(finalObj);
						
						});
						
					});

					for (var i = 0; i < finalFeaturesArray.length; i++) {

						for (var j = 0; j < finalFeaturesArray[i].ReleasesData.length; j++) {

							for (k = 0; k < totalReleasesArray.length; k++) {

								var releaseIndx = stabilityDefectsDetail.getReleaseIndx(finalFeaturesArray[i].ReleasesData, totalReleasesArray[k]);

								if (finalFeaturesArray[i].ReleasesData[j].Release != totalReleasesArray[k] && releaseIndx == -1) {

									var releaseDataObj = new Object();
									releaseDataObj.Release = totalReleasesArray[k];
									releaseDataObj.SeverityData = [];
									finalFeaturesArray[i].ReleasesData.splice(k, 0, releaseDataObj);
								}
							}
						}
					}


					retObject.maxCountF = stabilityDefectsDetail.getFeaturesMaxCount(finalFeaturesArray);
					retObject.totalReleasesArray = totalReleasesArray;
					retObject.FinalArray = finalFeaturesArray;
				   //retObject.UpdatedOn = stabilityDefectsDetail.getArrayFromJsonByKey(defectsHMData, 'CACHED_DATE');
				}
			}
		
		catch (e) {
			console.log("processFeatureMappingData exception - " + e);
			alert("Failed to get graph data");
			ISEUtils.portletUnblocking("pageContainer");
		}
		return retObject;
	},
getFeaturesMaxCount: function(finalFeaturesArray) {

		if (ISEUtils.validateObject(finalFeaturesArray)) {

			var maxCountF = 0;

			for (var i = 0; i < finalFeaturesArray.length; i++) {

				for (var j = 0; j < finalFeaturesArray[i].ReleasesData.length; j++) {

					var intCount = 0;
					var extCount = 0;

					for (var l = 0; l < finalFeaturesArray[i].ReleasesData[j].SeverityData.length; l++) {

						if (parseInt(finalFeaturesArray[i].ReleasesData[j].SeverityData[l].Type) == 0) {

							extCount += parseInt(finalFeaturesArray[i].ReleasesData[j].SeverityData[l].Count);
						}
						else {
							intCount += parseInt(finalFeaturesArray[i].ReleasesData[j].SeverityData[l].Count);
						}
					}

					if (intCount > extCount && maxCountF < intCount) {
						maxCountF = intCount;
					}
					else if (extCount > intCount && maxCountF < extCount) {
						maxCountF = extCount;
					}
				}
			}
			return maxCountF;
		}
	},
	populateReleasesCombo: function(elementId) {
		try {
			var selCmb = document.getElementById(elementId);
			if (ISEUtils.validateObject(selCmb)) {
				selCmb.options.length = 0;
				selCmb.options.add(new Option(stabilityDefectsDetail.selectAllObj.label, stabilityDefectsDetail.selectAllObj.val));

						if (ISEUtils.validateObject(stabilityDefectsDetail.totalFeatureReleasesArray)) {
							for (var i = 0; i < stabilityDefectsDetail.totalFeatureReleasesArray.length; i++) {
								selCmb.options.add(new Option(stabilityDefectsDetail.totalFeatureReleasesArray[i], stabilityDefectsDetail.totalFeatureReleasesArray[i]));
							}
						}
							
				
			}
			stabilityDefectsDetail.intializeReleasesCmbBox(elementId);
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
				stabilityDefectsDetail.onReleasesComboSelect(evt, params);
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
				selObj.options[0] = new Option(stabilitysample.deSelectAllObj.label, stabilitysample.deSelectAllObj.val);
				$("#" + elementId).trigger("chosen:updated");
				var totalIds = "";
				
					
						$("#cmb_FeatureReleases").val(stabilitysample.totalFeatureReleasesArray);
						for (var i = 0; i < stabilitysample.totalFeatureReleasesArray.length; i++) {

							totalIds = totalIds + "~" + stabilitysample.totalFeatureReleasesArray[i];
						}
						
				
				if (totalIds.length > 0) {
					totalIds = totalIds.substr(1, totalIds.length);
				}
				stabilitysample.checkSelectedValuesForReleaseComobo(totalIds, elementId);
			}
			else if (params.selected == "-2") {

				selObj.options[0] = new Option(stabilitysample.selectAllObj.label, stabilitysample.selectAllObj.val);
				$("#" + elementId).trigger("chosen:updated");

				$("#" + elementId).val("");
				stabilitysample.checkSelectedValuesForReleaseComobo("", elementId);
			}
		}
	},

	onSetDefaultFeatureReleases: function() {

		$("#cmb_FeatureReleases").val("");
		document.getElementById("cmb_FeatureReleases").options[0] = new Option(stabilityDefectsDetail.selectAllObj.label, stabilityDefectsDetail.selectAllObj.val);
		$("#cmb_FeatureReleases").trigger("chosen:updated");
		stabilityDefectsDetail.onFilterFeatureReleasesClick();
	},
	

	onFilterFeatureReleasesClick: function() {
		//pending
		//setTimeout(stabilityDefectsDetail.blockElementFunction, 0);
		try
		{
		ISEUtils.portletBlocking("pageContainer");		
		setTimeout(stabilityDefectsDetail.onFeatureMappingFilterReleases, stabilityDefectsDetail.timeoutVal);
		}
		catch(e)
		{
		alert("Failed to get graph data");
		ISEUtils.portletUnblocking("pageContainer");
		}
	},
	onFeatureMappingFilterReleases: function() {

		stabilityDefectsDetail.selFeatureReleaseIds = "";
		var selReleaseIds = $("#cmb_FeatureReleases").val();

		if (!ISEUtils.validateObject(selReleaseIds)) {

			selReleaseIds = "";
			stabilityDefectsDetail.totalFeatureReleasesArray.sort();
			stabilityDefectsDetail.totalFeatureReleasesArray.reverse();
			for (var i = 0; i < 4; i++) {
				selReleaseIds += stabilityDefectsDetail.totalFeatureReleasesArray[i] + "~";
			}

			if (selReleaseIds && selReleaseIds.length > 0) {
				selReleaseIds = selReleaseIds.substr(0, selReleaseIds.length - 1);
				stabilityDefectsDetail.checkSelectedValuesForReleaseComobo(selReleaseIds, "cmb_FeatureReleases");
			}

			stabilityDefectsDetail.selFeatureReleaseIds = selReleaseIds;
		}
		else {
			for (var i = 0; i < selReleaseIds.length; i++) {
				stabilityDefectsDetail.selFeatureReleaseIds += selReleaseIds[i] + "~";
			}

			if (stabilityDefectsDetail.selFeatureReleaseIds && stabilityDefectsDetail.selFeatureReleaseIds.length > 0) {
				stabilityDefectsDetail.selFeatureReleaseIds = stabilityDefectsDetail.selFeatureReleaseIds.substr(0, stabilityDefectsDetail.selFeatureReleaseIds.length - 1);
			}
		}

		stabilityDefectsDetail.populateSelectedReleasesForFeatures(true);
		//pending
		//stabilityDefectsDetail.unblockElementFunction("");
		ISEUtils.portletUnblocking("pageContainer");
	},
	populateSelectedReleasesForFeatures(isMainFeatures) {

		try {
			var idsArray = stabilityDefectsDetail.selFeatureReleaseIds.split("~");

			if (idsArray && idsArray.length > 0) {

				if (isMainFeatures) {

					if (ISEUtils.validateObject(stabilityDefectsDetail.featureMappingDataObject) && ISEUtils.validateObject(stabilityDefectsDetail.selFeatureReleaseIds)) {
						var graphDataObj = new Object();

						graphDataObj.maxCountF = stabilityDefectsDetail.featureMappingDataObject.maxCountF;


						var finalArray = [];
						finalArray = jQuery.extend(true, [], stabilityDefectsDetail.featureMappingDataObject.FinalArray);

						var totalReleases = [];
						// Deep copy
						var totalReleases = jQuery.extend(true, [], stabilityDefectsDetail.featureMappingDataObject.totalReleasesArray);
						// Shallow copy
						//var shallowObj = jQuery.extend({}, stabilityDefectsDetail.featureMappingDataObject.totalReleasesArray);

						if (totalReleases) {

							for (var i = 0; i < totalReleases.length; i++) {

								var indx = idsArray.indexOf(totalReleases[i]);

								if (indx == -1) {
									totalReleases.splice(i, 1);
									i--;
								}
							}

							graphDataObj.totalReleasesArray = totalReleases;
						}

						if (finalArray) {
							for (var i = 0; i < finalArray.length; i++) {

								for (var j = 0; j < finalArray[i].ReleasesData.length; j++) {

									var checkIndx = idsArray.indexOf(finalArray[i].ReleasesData[j].Release);

									if (checkIndx == -1) {

										finalArray[i].ReleasesData.splice(j, 1);
										j--;
									}
								}
							}

							graphDataObj.FinalArray = finalArray;
						}

						if (graphDataObj && graphDataObj.totalReleasesArray && graphDataObj.FinalArray) {

							$("#tblHead_FeatureReleaseDefectsMapping").empty();
							$("#tblBody_FeatureReleaseDefectsMapping").empty();

							stabilityDefectsDetail.fillTableAndPlotFeatureMapping(graphDataObj, "tblHead_FeatureReleaseDefectsMapping", "tblBody_FeatureReleaseDefectsMapping", false, 300);
						}
					}

				}
				else {

					if (ISEUtils.validateObject(stabilityDefectsDetail.featureMappingDrilldownDataObject) && ISEUtils.validateObject(stabilityDefectsDetail.selFeatureReleaseIds)) {
						var drilldownDataObj = new Object();

						drilldownDataObj.maxCountF = stabilityDefectsDetail.featureMappingDrilldownDataObject.maxCountF;

						var finalArrayDrilDown = [];
						finalArrayDrilDown = jQuery.extend(true, [], stabilityDefectsDetail.featureMappingDrilldownDataObject.FinalArray);

						var totalReleasesDrlDown = [];
						// Deep copy
						var totalReleasesDrlDown = jQuery.extend(true, [], stabilityDefectsDetail.featureMappingDrilldownDataObject.totalReleasesArray);
						// Shallow copy
						//var shallowObj = jQuery.extend({}, stabilityDefectsDetail.featureMappingDataObject.totalReleasesArray);

						if (totalReleasesDrlDown) {

							for (var i = 0; i < totalReleasesDrlDown.length; i++) {

								var indx = idsArray.indexOf(totalReleasesDrlDown[i]);

								if (indx == -1) {
									totalReleasesDrlDown.splice(i, 1);
									i--;
								}
							}

							drilldownDataObj.totalReleasesArray = totalReleasesDrlDown;
						}

						if (finalArrayDrilDown) {
							for (var i = 0; i < finalArrayDrilDown.length; i++) {

								for (var j = 0; j < finalArrayDrilDown[i].ReleasesData.length; j++) {

									var checkIndx = idsArray.indexOf(finalArrayDrilDown[i].ReleasesData[j].Release);

									if (checkIndx == -1) {

										finalArrayDrilDown[i].ReleasesData.splice(j, 1);
										j--;
									}
								}
							}

							drilldownDataObj.FinalArray = finalArrayDrilDown;
						}

						if (drilldownDataObj && drilldownDataObj.totalReleasesArray && drilldownDataObj.FinalArray) {

							$("#tblHead_FeatureMappingDrilldown").empty();
							$("#tblBody_FeatureMappingDrilldown").empty();

							stabilityDefectsDetail.fillTableAndPlotFeatureMapping(drilldownDataObj, "tblHead_FeatureMappingDrilldown", "tblBody_FeatureMappingDrilldown", true, 150);
						}
					}
				}
			}
		}
		catch (e) {

			console.log("populateSelectedReleasesForFeatures exception - " + e);
			alert("Failed to get graph data");
			ISEUtils.portletUnblocking("pageContainer");
		}
	},
	fillTableAndPlotFeatureMapping: function(dataObj, tblHeadId, tblBodyId, isSubFeature, cvsWidth) {

		try {
			var totalReleasesArray = dataObj.totalReleasesArray;
			//var maxCountF = parseInt(dataObj.maxCountF);
			var maxCountF = stabilityDefectsDetail.getFeaturesMaxCount(dataObj.FinalArray);
			if (maxCountF < 100) {
				maxCountF = maxCountF + 5;
			}
			else if (maxCountF < 1000) {
				maxCountF = maxCountF + 50;
			}
			else if (maxCountF < 10000) {
				maxCountF = maxCountF + 500;
			}

			//maxCountF = maxCountF + 100;
			//maxCountF = maxCountF + 1200;
			var finalArray = dataObj.FinalArray;
			var elementIdx = 0;

			var headerString = '<tr class="trHeader"><th class="tblFeatureLabel" rowspan="2" valign="middle" align="left">Feature</th>';
			var releaseIdsStr = "";

			for (var i = 0; i < totalReleasesArray.length; i++) {
				releaseIdsStr += '<th>' + totalReleasesArray[i].toString() + '</th>';
			}

			headerString += '<th colspan="' + totalReleasesArray.length.toString() + '" align="center">Releases</th></tr><tr class="trHeader">';
			headerString += releaseIdsStr;
			headerString += "</tr>";

			$('#' + tblHeadId).append(headerString);

			for (var i = 0; i < finalArray.length; i++) {

				var barClrs_internal = ['#349BFF', '#62B1FF', '#8EC8FF', '#BCDEFF', '#E8F4FF'];
				var barClrs_external = ['#FF5819', '#FF6A33', '#FF8F66', '#FFB599', '#FFC7B2'];

				var featureName = finalArray[i].Feature.toString();

				featureName = featureName.replace(/\s/g, "");

				var trowString = '<tr id="ftureRow_' + i + '"><td style="min-width:130px;" valign="middle"  rowspan="2"><label id="ftureMapImg' +
				featureName + '_' + i + '" title="Click to see Sub Features"';

				if (!isSubFeature) {
					trowString += 'onclick="javascript:onFeatureMappingDrilldown(this)"  class="LblMainFeature"';
				}

				trowString += '>' + finalArray[i].Feature + '</label></td>';


				//            $('#' + tblBodyId).append('<tr id="ftureRow_' + i + '"><td valign="middle"  rowspan="2"><label id="ftureMapImg' + 
				//            featureName + '_' + i + '" onclick="javascript:onFeatureMappingDrilldown(this)"  class="LblMainFeature">'
				//            + finalArray[i].Feature + '</label></td>');

				$("#" + tblBodyId).append(trowString);

				for (var j = 0; j < finalArray[i].ReleasesData.length; j++) {
					elementIdx++;

					var cvs_int = 'cvs_int' + featureName + elementIdx;
					var cvs_Ext = 'cvs_ext' + featureName + elementIdx;

					$('#' + tblBodyId).append('<td class="tdHStackedBar">' +
							'<canvas  id="' + cvs_int + '" width="' + cvsWidth + '" height="20"></canvas>' +
							'<br />' +
							'<canvas  id="' + cvs_Ext + '" width="' + cvsWidth + '" height="20"></canvas><br/><br/></td>');

					if (finalArray[i].ReleasesData[j].SeverityData.length && finalArray[i].ReleasesData[j].SeverityData.length == 0) {
						finalArray[i].ReleasesData[j].SeverityData = stabilityDefectsDetail.sortSeverityArray(finalArray[i].ReleasesData[j].SeverityData);
					}

					var typeGrp = _.groupBy(finalArray[i].ReleasesData[j].SeverityData, function (object) { return object.Type; })

					var int_grpArray = [];
					var ext_grpArray = [];

					_.each(typeGrp, function (tVal, tKey) {

						if (parseInt(tKey) == 0) {

							ext_grpArray = tVal;
						}
						else
							int_grpArray = tVal;

					});

					int_grpArray = stabilityDefectsDetail.sortSeverityArray(int_grpArray);
					ext_grpArray = stabilityDefectsDetail.sortSeverityArray(ext_grpArray);

					var int_tooltipsData = [];

					var int_toolTipStr = "<span style='font-weight:bold;'>Internal Defects  </span><br/>";

					var int_FinalArray = [];
					var int_Bars = [];
					for (var k = 0; k < int_grpArray.length; k++) {
						int_Bars.push(parseInt(int_grpArray[k].Count));
						int_toolTipStr += int_grpArray[k].Severity + "  -  " + int_grpArray[k].Count + "<br/>";

					}
					int_FinalArray.push(int_Bars);
					int_tooltipsData.push(int_toolTipStr);
					int_tooltipsData.push(int_toolTipStr);
					int_tooltipsData.push(int_toolTipStr);
					int_tooltipsData.push(int_toolTipStr);
					int_tooltipsData.push(int_toolTipStr);

					var ext_tooltipsData = [];
					var ext_toolTipStr = "<span style='font-weight:bold;'>External Defects  </span><br/>";
					var ext_FinalArray = [];
					var ext_Bars = [];
					for (var l = 0; l < ext_grpArray.length; l++) {
						ext_Bars.push(parseInt(ext_grpArray[l].Count));
						ext_toolTipStr += ext_grpArray[l].Severity + "  -  " + ext_grpArray[l].Count + "<br/>";
					}
					ext_FinalArray.push(ext_Bars);
					ext_tooltipsData.push(ext_toolTipStr);
					ext_tooltipsData.push(ext_toolTipStr);
					ext_tooltipsData.push(ext_toolTipStr);
					ext_tooltipsData.push(ext_toolTipStr);
					ext_tooltipsData.push(ext_toolTipStr);

					stabilityDefectsDetail.CreateHBarStacked(cvs_int, int_FinalArray, barClrs_internal, int_tooltipsData, maxCountF);
					stabilityDefectsDetail.CreateHBarStacked(cvs_Ext, ext_FinalArray, barClrs_external, ext_tooltipsData, maxCountF);
				}

			}
			$('#' + tblBodyId).append('</tr>');
		}
		catch (e) {
			console.log("fillTableAndPlotFeatureMapping exception - " + e);
			alert("Failed to get graph data");
			ISEUtils.portletUnblocking("pageContainer");
		}
	},
	CreateHBarStacked:function(elementId, barsData, barColors, tooltipsData, xMaxCnt) {
		var hbar = new RGraph.HBar(elementId, barsData)
               .Set('grouping', 'stacked')
			   .Set('numyticks', 0)
			   .Set('numxticks', 0)
			   .Set('background.color', 'white')
			   .Set('background.grid.hlines', false)
			   .Set('background.grid.vlines', false)
			   .Set('xlabels.specific', [])
               .Set('key.colors', ['#3366CC', '#DC3912', '#FF9900', '#109618'])
               .Set('colors', barColors)
			   .Set('xmax', xMaxCnt)
			   .Set('chart.gutter.left', 0)
			   .Set('chart.gutter.right', 0)
               .Set('chart.gutter.top', -5)
               .Set('chart.gutter.bottom', 0)
               .Set('tooltips.event', "mousemove")
               .Set('tooltips', tooltipsData)
               .Set('labels.above', true)
               .Set('text.size', 6)
               .Set('chart.tooltips.hotspot.xonly', true)
               .Draw();

//		hbar.ontooltip = function (obj) {
//		    var canvasXY = RGraph.getCanvasXY(obj.canvas);
//		    $('.RGraph_tooltip').css('center', (canvasXY[1] - $('.RGraph_tooltip').height() + 20) + 'px');
//		}
		hbar.canvas.onmouseout = function (e) {
		    // Hide the tooltip
			//pending
		    //RGraph.HideTooltip();

		    // Redraw the canvas so that any highlighting is gone
		    //RGraph.Redraw();
			//pending
		    RGraph.RedrawCanvas(e.target);
		}
	},
	getReleaseIndx: function(array, releaseId) {

		var indx = -1;
		if (array && array.length > 0) {

			for (var i = 0; i < array.length; i++) {

				if (array[i].Release == releaseId) {
					indx = i;
				}
			}
		}
		return indx;
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
	sortSeverityArray: function(arr) {

		var retArray = [];
		try {
			if (arr && arr.length > 0) {

				var sev1;
				var sev2;
				var sev3;
				var sev4;
				var sev5;

				for (var i = 0; i < arr.length; i++) {

					switch (arr[i].Severity) {

						case stabilityDefectsDetail.fixedSev1:
							sev1 = arr[i];
							break;

						case stabilityDefectsDetail.fixedSev2:
							sev2 = arr[i];
							break;

						case stabilityDefectsDetail.fixedSev3:
							sev3 = arr[i];
							break;

						case stabilityDefectsDetail.fixedSev4:
							sev4 = arr[i];
							break;

						case stabilityDefectsDetail.fixedSev5:
							sev5 = arr[i];
							break;
					}
				}

				if (!sev1) {
					sev1 = new Object();
					sev1.Type = arr[0].Type;
					sev1.Severity = stabilityDefectsDetail.fixedSev1;
					sev1.Count = 0;
				}
				retArray.push(sev1);

				if (!sev2) {
					sev2 = new Object();
					sev2.Type = arr[0].Type;
					sev2.Severity = stabilityDefectsDetail.fixedSev2;
					sev2.Count = 0;
				}
				retArray.push(sev2);

				if (!sev3) {
					sev3 = new Object();
					sev3.Type = arr[0].Type;
					sev3.Severity = stabilityDefectsDetail.fixedSev3;
					sev3.Count = 0;
				}
				retArray.push(sev3);

				if (!sev4) {
					sev4 = new Object();
					sev4.Type = arr[0].Type;
					sev4.Severity = stabilityDefectsDetail.fixedSev4;
					sev4.Count = 0;
				}
				retArray.push(sev4);

				if (!sev5) {
					sev5 = new Object();
					sev5.Type = arr[0].Type;
					sev5.Severity = stabilityDefectsDetail.fixedSev5;
					sev5.Count = 0;
				}
				retArray.push(sev5);
			}
			else {

				var emptsev1;
				var emptsev2;
				var emptsev3;
				var emptsev4;
				var emptsev5;

				emptsev1 = new Object();
				emptsev1.Type = "0";
				emptsev1.Severity = stabilityDefectsDetail.fixedSev1;
				emptsev1.Count = 0;
				retArray.push(emptsev1);
				emptsev1.Type = "1";
				retArray.push(emptsev1);

				emptsev2 = new Object();
				emptsev2.Type = "0";
				emptsev2.Severity = stabilityDefectsDetail.fixedSev2;
				emptsev2.Count = 0;
				retArray.push(emptsev2);
				emptsev2.Type = "1";
				retArray.push(emptsev2);

				emptsev3 = new Object();
				emptsev3.Type = "0";
				emptsev3.Severity = stabilityDefectsDetail.fixedSev3;
				emptsev3.Count = 0;
				retArray.push(emptsev3);
				emptsev3.Type = "1";
				retArray.push(emptsev3);

				emptsev4 = new Object();
				emptsev4.Type = "0";
				emptsev4.Severity = stabilityDefectsDetail.fixedSev4;
				emptsev4.Count = 0;
				retArray.push(emptsev4);
				emptsev4.Type = "1";
				retArray.push(emptsev4);

				emptsev5 = new Object();
				emptsev5.Type = "0";
				emptsev5.Severity = stabilityDefectsDetail.fixedSev5;
				emptsev5.Count = 0;
				retArray.push(emptsev5);
				emptsev5.Type = "1";
				retArray.push(emptsev5);
			}
		}
		catch (e) {

			console.log("sortSeverityArray exception - " + e);
			alert("Failed to get graph data");
			ISEUtils.portletUnblocking("pageContainer");
		}
		return retArray;
	},
	onRefreshFeatureMapping: function(cached) {

		//stabilitysample.isCached = cached;
		//pending
		//setTimeout(stabilitysample.blockElementFunction, 0);
		try
		{
		ISEUtils.portletBlocking("pageContainer");
		setTimeout(stabilityDefectsDetail.onRefreshData, stabilityDefectsDetail.timeOutVal);
		}
		catch(e)
		{
		alert("Failed to get graph data");
		ISEUtils.portletUnblocking("pageContainer");
		}

		//    stabilitysample.blockElementFunction("", "");
		//    PopulateFeaturesHeatMap();
		//    stabilitysample.unblockElementFunction("");
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
	onRefreshData:function()
	{
		//requestObject.username = localStorage.getItem('username');
	var jsondata = {username:localStorage.getItem('username'),project:localStorage.getItem('projectName'),type:"mongo",operation:"stabilityDefectsDetail"}
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
		stabilityDefectsDetail.PopulateFeaturesHeatMap();
		},
		error: function(msg) {
		console.log(error);callBackFunction([])
		}
		});
	},

}