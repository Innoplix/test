 var releasevstestcases = {

     bargraph: null,


     /* Init function  */
     init: function() {

         ISEUtils.portletBlocking("leftGraph");
         releasevstestcases._setInitialDimensions();
         var projectName = localStorage.getItem('projectName');
         ISE.getTestingMetricsLeftGraph("tcf", "", projectName, false, releasevstestcases._receivedTestingMetricsGraphInfo);
        
     },


     /* reinit function  to display the graph based on multi selection releases */
     reinit:function(){

        releasevstestcases._drawleftReleasevsTestCaseGraph(ISEUtils.releasevsTestcaseArray);

     },

      /* Show MultiRelease Header function  */
     onDisplayHeaderElements: function() {
         ISEUtils.showMultiReleaseHeaderDropdown();
     },

     /* To Set Initial Dimensions to all the graphs  */
     _setInitialDimensions: function() {
         releasevstestcases._setGraphDimensions('releasevstestcases_bargraph');
     },

     /**
      * To set graph widtn and height
      * @setGraphDimenstions function
      * @param {string} canvasID - Graph ID.     
      */
     _setGraphDimensions: function(canvasID) {
         var c = $('#' + canvasID);
         var ct = c.get(0).getContext('2d');
         var container = $(c).parent();

         c.attr('width', $(container).width()); //max width
         c.attr('height', $(container).height()); //max height

     },

     /**
      * To Resize the graph when window resizes
      * @onResizeWindow function   
      */
     onResizeWindow: function() {

         ISEUtils.resizeGraphs(releasevstestcases.bargraph);
         ISEUtils.showMultiReleaseHeaderDropdown();
     },

     /**
      * Show Fullscreen for particular graph
      * @onFullscreen function
      * @param {Obj} graphObj - Graph Obj.     
      */
     onFullscreen: function(graphObj) {
         window.setTimeout(function() {
             ISEUtils.fullscreenResizeGraphs(graphObj);
         }, 10);
     },

     /**
      *  Received ReleasevsTestcase Graph Information
      * @_receivedTestingMetricsGraphInfo function
      * @param {respObj}  - Response Obj.     
      */
     _receivedTestingMetricsGraphInfo: function(respObj) {


         //var ReleaseList = new Array();

         if (ISEUtils.validateObject(respObj)) {

             var releaseArray = new Array();
             var pfArray = new Array();
             var countArray = new Array();

             for (var i = 0; i < respObj.length; i++) {

                 releaseArray[i] = respObj[i].release;
                 pfArray[i] = respObj[i].status;
                 countArray[i] = respObj[i].ss;
             }

             var rows = new Array();

             if (releaseArray != null && releaseArray != undefined && releaseArray.length > 0) {

                 for (var i = 0; i < releaseArray.length; i++) {
                     var eachObj = new Object();

                     eachObj.release = releaseArray[i];
                     //Handle null scenarios
                     if (pfArray[i] == "" || pfArray[i] == " " || pfArray[i] == null) {
                         eachObj.pf = "Others";
                     } else {
                         eachObj.pf = $.trim(pfArray[i]);
                     }
                     eachObj.count = countArray[i];

                     rows.push(eachObj);
                 }

                 var groupByRelease = _.groupBy(rows, function(object) {
                     return object.release;
                 });

             }

             ISEUtils.releasevsTestcaseArray = new Array();
             ISEUtils.releasevsTestcaseArray = groupByRelease;
             releasevstestcases._drawleftReleasevsTestCaseGraph(groupByRelease);
         }

     },

    /**
      * Received ReleasevsTestcase Graph Information
      * @_drawleftReleasevsTestCaseGraph function
      * @param {GraphInformation}  - groupByRelease Obj.     
      */
     _drawleftReleasevsTestCaseGraph: function(groupByRelease) {


         var dataArray;
         var toolTipData = new Array();
         var barDataLabels = new Array();
         var barDataValues = new Array();
         var barsData = new Array();
         var textAngle = 50;
         var xAxisLabel = "";
         var TestCaseStatusArray = new Array();
         var StatusAndColorsArray = new Array();

         try {

             //Retrieving the selected releases to show
             var releases = ISEUtils.multiSelectReleaseArray;           

             var availableStatus = new Array();

             if (releases != null && releases.length > 0) {
                 for (var r = 0; r < releases.length; r++) {

                     _.each(groupByRelease, function(val, key) {

                         if (releases[r] == key) {
                             var obj = new Object();
                             obj.ReleaseId = key;
                             obj.TotalCount = releasevstestcases._getTotalReleaseCount(val, key);

                             var subgroupByStatus = new Array();
                             subgroupByStatus = _.groupBy(val, function(object) {
                                 return object.pf;
                             });
                             obj.GroupByStatus = subgroupByStatus;

                             _.each(subgroupByStatus, function(dval, dkey) {
                                 if ($.inArray(dkey, availableStatus) < 0) {
                                     availableStatus.push(dkey);
                                 }
                             });

                             barsData.push(obj);
                         }
                     });
                 }
             }

             var indexCount = 0;

             for (var i = 0; i < barsData.length; i++) {

                 var data = barsData[i].GroupByStatus;

                 if (data != null && data != undefined) {

                     dataArray = new Array();
                     for (var j = 0; j < availableStatus.length; j++) {

                         var dataVal = 0;
                         var isFound = false;
                         var keyVal = "";
                         var obj = new Array();

                         _.each(data, function(val, key) {
                             xAxisLabel = val[0].release;
                             if ($.trim(key.toUpperCase()).toString() == $.trim(availableStatus[j].toUpperCase()).toString()) {
                                 dataVal = parseInt(val[0].count);
                                 keyVal = key;
                                 isFound = true;
                             }
                         }); // for each loop end

                         dataArray.push(dataVal);
                         if (isFound == true) {
                             toolTipData.push(dataVal.toString());
                         } else {
                             toolTipData.push("0");
                         }

                         obj.Index = indexCount;
                         obj.XAxis = xAxisLabel;
                         obj.Status = keyVal;
                         obj.Count = dataVal;

                         TestCaseStatusArray.push(obj);
                         indexCount++;

                     } // For Loop End
                 } // If end

                 barDataLabels.push(xAxisLabel);
                 barDataValues.push(dataArray);
             } // End Main for loop

             console.log("dd" + barsData.length)
             if (barDataLabels != null && barDataLabels.length > 0 && barDataValues != null && barDataValues.length > 0) {
                 releasevstestcases._drawLeftReleaseTestcaseBarGraph(barDataLabels, barDataValues);                
             }

         } catch (e) {
             console.log(e);
         }
       
     },
   
    /**
      * @_getTotalReleaseCount function
      * @param {val,key}  - key,value pair Obj.     
      */
     _getTotalReleaseCount: function(val, key) {
         var cnt = 0;
         _.each(val, function(dVal, dKey) {

             if (key == dVal.release) {
                 cnt = cnt + parseInt(dVal.count);
             }
         });

         return cnt;
     },

   /**
      * Display Bar Graph
      * @_drawLeftReleaseTestcaseBarGraph function
      * @param {dataLabels}  - dataLabels Obj. 
      * @param {dataValues}  - dataValues Obj.      
      */
     _drawLeftReleaseTestcaseBarGraph: function(dataLabels, dataValues) {


         RGraph.ObjectRegistry.Clear(document.getElementById("releasevstestcases_bargraph"));        

         releasevstestcases.bargraph = new RGraph.Bar({
             id: 'releasevstestcases_bargraph',
             data: dataValues,
             options: {
                 labels: dataLabels,
                 colors: ['#f1f8fd', '#ff9999'],
                 grouping: 'stacked',

                 hmargin: 20,
                 textAngle: 45,
                 strokestyle: 'rgba(0,0,0,0)'
             }
         }).draw();

         ISEUtils.portletUnblocking("leftGraph");
     }
 };
