var general = {


    gauge: null,
    internalDefectmeter: null,
    externalDefectMeter: null,
    timeOutVal: 0,
    kibanaGraphFullscreenMode: false,
    kibanaGraphParentHeight: 0,
    loadGraph: '',



    /* Init function  */
    init: function() {

       

        general._setInitialDimensions();

        var releaseId = localStorage.getItem('releaseId');
        var projectName = localStorage.getItem('projectName');
        general._populateCharts(projectName, releaseId); 
       

        $("#reloadDefIntGraph").click(function(event) {
            general.loadGraph = "IntGraph";
            general._getIntDefectDataGraphInfo(projectName, releaseId, false);
        });

        $("#reloadDefExtGraph").click(function(event) {
            general.loadGraph = "ExtGraph";
            general._getExtDefectDataGraphInfo(projectName, releaseId, false);
        });

        $("#reloadTestExeGraph").click(function(event) {
            general._getTestExecutionGraphInfo(projectName, releaseId, false);
        });
    },




    /* To Set Initial Dimensions to all the graphs  */
    _setInitialDimensions: function() {

        general._setGraphDimensions('general_guage');
        general._setGraphDimensions('general_meterExternal');
        general._setGraphDimensions('general_meterInternal');

    },

 /**
     * To Resize the graph when window resizes
     * @onResizeWindow function   
     */
   onResizeWindow:function(){

            ISEUtils.resizeGraphs(general.gauge);
            ISEUtils.resizeGraphs(general.internalDefectmeter);
            ISEUtils.resizeGraphs(general.externalDefectMeter);
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
     * Show Fullscreen for particular graph
     * @onFullscreen function
     * @param {Obj} graphObj - Graph Obj.     
     */
    onFullscreen: function(graphObj) {
        window.setTimeout(function() {
            ISEUtils.fullscreenResizeGraphs(graphObj);
        }, 10);
    },

     onDisplayHeaderElements:function(){

      ISEUtils.showReleaseHeaderDropdown();
    },
    

    /**
     * Display Charts
     * @populateCharts function
     * @param {string} projectName
     * @param {string} releaseId    
     */
    _populateCharts: function(projectName, releaseId) {


        if (ISEUtils.validateObject(releaseId)) {

            // All the graphs load from cache
            general._getTestExecutionGraphInfo(projectName, releaseId, true);
            general._getIntDefectDataGraphInfo(projectName, releaseId, true);
            general._getExtDefectDataGraphInfo(projectName, releaseId, true);
        }

    },

    /**
     * Send Service call for Test Execution Graph
     * @getTestExecutionGraph function
     * @param {string} projectName
     * @param {string} releaseId   
     * @param {boolean} fromCache     
     */
    _getTestExecutionGraphInfo: function(projectName, releaseId, fromCache) {

          // Draw TestExecution Graph
        general._getTestExecutionEnvironmentGraphInfo("TestCaseExe", projectName, releaseId, fromCache); // Need To check with suresh - This function is required or not.
    },


    /**
     * Send Service call for Test Execution failures and return array with max and actual value.
     * @getTestExecutionEnvironmentGraphInfo function
     * @param {string} fileName
     * @param {string} projectName   
     * @param {string} releaseId   
     * @param {boolean} fromCache  
     */
    _getTestExecutionEnvironmentGraphInfo: function(fileName, projectName, releaseId, fromCache) {

       ISEUtils.portletBlocking("testExecutionGraph");
        // Added Callback function 
        ISE.getTestExecutionFailures(fileName, projectName, releaseId, fromCache, general._receivedTestExecutionRes);

    },

    /**
     * Received TestExecution Graph Information
     * @receivedTestExecutionRes function
     * @param {Json} data   
     */
    _receivedTestExecutionRes: function(data) {

        try {

            var envNames = new Array();
            var counts = new Array();
            var status = new Array();
            var maxVal = 0;
            var actVal = 0;

            if (ISEUtils.validateObject(data)) {

                for (var i = 0; i < data.length; i++) {

                    counts[i] = data[i].count;
                    envNames[i] = data[i].env_name;

                    if (data[i].status != null) {
                        status[i] = data[i].status;
                    } else {
                        status[i] = ' ';
                    }
                }

                var testExecDataArray = new Array();

                if (envNames && counts && status && envNames.length > 0) {

                    for (var i = 0; i < envNames.length; i++) {
                        var dataObj = new Object();
                        if (i < counts.length && i < status.length) {

                            dataObj.EnvName = envNames[i];
                            dataObj.Count = counts[i];
                            dataObj.Status = status[i];
                            testExecDataArray.push(dataObj);
                        }
                    }


                    for (var i = 0; i < testExecDataArray.length; i++) {

                        maxVal = maxVal + parseInt(testExecDataArray[i].Count);

                        if (testExecDataArray[i].Status.toString().toUpperCase() != "PASSED") {
                            actVal = actVal + testExecDataArray[i].Count;
                        }
                    }

                }
            }


            general._drawTestExecutionsGraph(maxVal, actVal);


        } catch (e) {

            console.log("getTestExecutionEnvironmentGraphInfo - " + e);
        }

    },

    /**
     * Draw Test Exection Graph
     * @drawTestExecutionGraph function
     * @param {string} maxVal
     * @param {string} actVal    
     */
    _drawTestExecutionsGraph: function(maxVal, actVal) {

        //document.getElementById("Lbl_TestExecTotal").innerHTML = maxVal.toString() + " - total";
        document.getElementById("Lbl_TestExecPassed").innerHTML = (maxVal - actVal).toString() + " - passed";
        document.getElementById("Lbl_TestExecNotPassed").innerHTML = actVal.toString() + " - not passed";
		var colorRanges = [[0, parseInt(maxVal) - parseInt(actVal), '#C8E1F9'], [parseInt(maxVal) - parseInt(actVal), parseInt(maxVal), '#FBC5C5']];
       /* general.gauge = new RGraph.Gauge({
            id: 'general_guage',
            min: 0,
            max: parseInt(maxVal),
            value: parseInt(maxVal) - parseInt(actVal),
			redStart:50
        }).draw();*/
		
		 general.gauge = new RGraph.Gauge('general_guage',0,parseInt(maxVal),parseInt(maxVal) - parseInt(actVal))
		 .Set('colors.ranges', colorRanges)
		 general.gauge.Draw();

        document.getElementById("defTestExeGraphTimeStamp").innerHTML = ISEUtils.getDateTime();

        ISEUtils.portletUnblocking("testExecutionGraph");

    },

    /**
     * Send Service call for Internal & External Defect Graph
     * @getIntExtDefectData function
     * @param {string} projectName
     * @param {string} releaseId   
     * @param {boolean} fromCache     
     */
    _getIntDefectDataGraphInfo: function(projectName, releaseId, fromCache) {

        // portlet blocking for Internal & External defect graphs
        ISEUtils.portletBlocking("internalDefectGraph");
        //ISEUtils.portletBlocking("externalDefectGraph");

        ISE.getIntExtDefects("IntDefects", projectName, releaseId, fromCache, general._receivedIntExtResponse);

    },

    _getExtDefectDataGraphInfo: function(projectName, releaseId, fromCache) {

        // portlet blocking for Internal & External defect graphs
        //ISEUtils.portletBlocking("internalDefectGraph");
        ISEUtils.portletBlocking("externalDefectGraph");

        ISE.getIntExtDefects("IntDefects", projectName, releaseId, fromCache, general._receivedIntExtResponse);

    },

    /**
     * Received data for Internal & External Defect graphs
     * @receivedIntExtResponse function
     * @param {data} data   
     */
    _receivedIntExtResponse: function(data) {

        try {

            var intClosedCount = 0;
            var intOtherCount = 0;
            var extClosedCount = 0;
            var extOtherCount = 0;


            if (ISEUtils.validateObject(data)) {

                var defTypes = new Array();
                var cnts = new Array();
                var statusArray = new Array();

                for (var i = 0; i < data.length; i++) {

                    defTypes[i] = data[i].defect_status;
                    cnts[i] = data[i].count;
                    if(typeof data[i].status == "undefined")
						statusArray[i] = " ";
					else
                      statusArray[i] = data[i].status;
                }

                if (defTypes && cnts && statusArray) {

                    var dataArray = new Array();

                    for (var i = 0; i < defTypes.length; i++) {

                        var dataobj = new Object();

                        if (i < cnts.length && i < statusArray.length) {

                            dataobj.Type = defTypes[i];
                            dataobj.Count = cnts[i];
                            dataobj.DefStatus = statusArray[i];

                            dataArray.push(dataobj);
                        }
                    }

                    var grpdArray = _.groupBy(dataArray, function(object) {
                        return object.Type;
                    });

                    var intGrpArray;
                    var extGrpArray;

                    _.each(grpdArray, function(val, key) {

                        if (ISEUtils.validateObject(val) && val.length > 0) {

                            if (parseInt(val[0].Type) == 0) {

                                extGrpArray = val;
                            } else {

                                intGrpArray = val;
                            }
                        }
                    });

                    if (intGrpArray && intGrpArray.length > 0) {

                        var intStatusGrp = _.groupBy(intGrpArray, function(object) {
                            return object.DefStatus;
                        });
                        var closedCount = 0;
                        var otherCount = 0;

                        _.each(intStatusGrp, function(val, key) {

                            var dataobj = new Object();

                            if (ISEUtils.validateObject(val) && val.length > 0) {

                                for (var i = 0; i < val.length; i++) {

                                    if (val[i].DefStatus.toString().toUpperCase() == "CLOSED") {

                                        intClosedCount = intClosedCount + parseInt(val[i].Count);
                                    } else {

                                        intOtherCount = intOtherCount + parseInt(val[i].Count);
                                    }
                                }
                            }
                        });

                    }

                    if (extGrpArray && extGrpArray.length > 0) {

                        var extStatusGrp = _.groupBy(extGrpArray, function(object) {
                            return object.DefStatus;
                        });
                        var closedCount = 0;
                        var otherCount = 0;

                        _.each(extStatusGrp, function(val, key) {

                            var dataobj = new Object();

                            if (ISEUtils.validateObject(val) && val.length > 0) {

                                for (var i = 0; i < val.length; i++) {

                                    if (val[i].DefStatus.toString().toUpperCase() == "CLOSED") {

                                        extClosedCount = extClosedCount + parseInt(val[i].Count);
                                    } else {

                                        extOtherCount = extOtherCount + parseInt(val[i].Count);
                                    }
                                }
                            }
                        });

                    }

                }
            }



            var respDefectArray = new Array();
            var respDefectdataObj = new Object();
            respDefectdataObj.intClosedCount = intClosedCount;
            respDefectdataObj.intOtherCount = intOtherCount;
            respDefectdataObj.extClosedCount = extClosedCount;
            respDefectdataObj.extOtherCount = extOtherCount;
            respDefectArray.push(respDefectdataObj);
            general._sendDataToIntExtGraph(respDefectArray)

        } catch (e) {

            console.log("getIntExtDefectData - " + e);
        }


    },

    /**
     * Send data to  Internal & External Defect Graph
     * @sendDataToIntExtGraph function
     * @param {array} respIntExtDefectData   
     */
    _sendDataToIntExtGraph: function(respIntExtDefectData) {

        if (general.loadGraph == "IntGraph") {
            general._drawInternalDefectGraph(respIntExtDefectData[0].intClosedCount, respIntExtDefectData[0].intOtherCount);

        } else if (general.loadGraph == "ExtGraph") {
            general._drawExternalDefectGraph(respIntExtDefectData[0].extClosedCount, respIntExtDefectData[0].extOtherCount);

        } else {
            general._drawInternalDefectGraph(respIntExtDefectData[0].intClosedCount, respIntExtDefectData[0].intOtherCount);
            general._drawExternalDefectGraph(respIntExtDefectData[0].extClosedCount, respIntExtDefectData[0].extOtherCount);
        }
    },

    /**
     * Draw Internal Defect Graph
     * @drawInternalDefectData function
     * @param {string} intClosedCount
     * @param {string} intClosedCount    
     */
    _drawInternalDefectGraph: function(intClosedCount, intOtherCount) {


        // internal defects       
        var intTotalCnt = parseInt(intOtherCount) + parseInt(intClosedCount);


        document.getElementById("lbl_IntCls").innerHTML = intClosedCount.toString() + " - closed";
        document.getElementById("lbl_IntOthr").innerHTML = intOtherCount.toString() + " - others";


        /*general.internalDefectmeter = new RGraph.Gauge({
            id: 'general_meterInternal',
            min: 0,
            max: parseInt(intTotalCnt),
            value: parseInt(intClosedCount)
        }).draw();*/
		
		var colorRanges = [[0, parseInt(intTotalCnt) - parseInt(intOtherCount), '#C8E1F9'], [parseInt(intTotalCnt) - parseInt(intOtherCount), parseInt(intTotalCnt), '#FBC5C5']];
		general.internalDefectmeter = new RGraph.Gauge('general_meterInternal',0,parseInt(intTotalCnt),parseInt(intTotalCnt) - parseInt(intOtherCount))
		 .Set('colors.ranges', colorRanges)
		 general.internalDefectmeter.Draw();
        document.getElementById("defIntGraphTimeStamp").innerHTML = ISEUtils.getDateTime();

        ISEUtils.portletUnblocking("internalDefectGraph");

    },


    /**
     * Draw External Defect Graph
     * @drawExternalDefectData function
     * @param {string} extClosedCount
     * @param {string} extClosedCount    
     */
    _drawExternalDefectGraph: function(extClosedCount, extOtherCount) {


        // External Defects
        var extTotalCnt = parseInt(extOtherCount) + parseInt(extClosedCount);

        document.getElementById("lbl_ExtCls").innerHTML = extClosedCount.toString() + " - closed";
        document.getElementById("lbl_ExtOthr").innerHTML = extOtherCount.toString() + " - others";


        /*general.externalDefectMeter = new RGraph.Gauge({
            id: 'general_meterExternal',
            min: 0,
            max: parseInt(extTotalCnt),
            value: parseInt(extClosedCount)
        }).draw();*/
		var colorRanges = [[0, parseInt(extTotalCnt) - parseInt(extOtherCount), '#C8E1F9'], [parseInt(extTotalCnt) - parseInt(extOtherCount), parseInt(extTotalCnt), '#FBC5C5']];
		general.externalDefectMeter = new RGraph.Gauge('general_meterExternal',0,parseInt(extTotalCnt),parseInt(extTotalCnt) - parseInt(extOtherCount))
		 .Set('colors.ranges', colorRanges)
		 general.externalDefectMeter.Draw();

        document.getElementById("defExtGraphTimeStamp").innerHTML = ISEUtils.getDateTime();

        ISEUtils.portletUnblocking("externalDefectGraph");

    },

    onFullscreenKibanaGraph: function(kibanaGraphObj) {

      var container = $('#' + kibanaGraphObj.id).parent();



        if (!general.kibanaGraphFullscreenMode) {
            general.kibanaGraphParentHeight = container.height();
            $('#' + kibanaGraphObj.id).height("95%");
            $(container).css('height', "95%");
             $("#fullscreenBtnDiv").hide();
            general.kibanaGraphFullscreenMode = true;

        } else {
            $(container).css('height', general.kibanaGraphParentHeight);
             $('#' + kibanaGraphObj.id).height("350px");
          
             $("#fullscreenBtnDiv").show();
            general.kibanaGraphFullscreenMode = false;

        }

    }

};
