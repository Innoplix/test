  /*--------------------------------------------------------------------------------------------------
   * ise-utils.js - Handle the common functions like load scripts,screen resize,updateparameters list.
   *
   * DEPENDENCIES
   *  - ise.js
   *  - ISE_Ajax_Service.js
   *------------------------------------------------------------------------------------------------------*/
  var ISEUtils = {


      graphInitialWidth: null,
      graphInitialHeight: null,
      parentInitalHeight: null,
      portletfullscreenEnabled:false,
      multiSelectReleaseArray:null,
      releasevsTestcaseArray:null,
	  tableData:[],
      defectIdcount:[],
	  currTabaleData:null,



      script_arr: ['ISE-API/its.js','ISE-API/ise.js', 'ISE-API/ise-constants.js', 'ISE-API/ike-pageconstants.js','ISE-API/ike-eventsconstants.js','js/plugins/websocket.js',
          'ISE-API/ISE_Ajax_Service.js','js/plugins/jquery.base64.js',
          'js/plugins/jquery.base64.min.js','js/plugins/elasticsearch.js',           
	  'metronics/global/plugins/jstree/dist/jstree.min.js',        
          'metronics/global/plugins/select2/select2.min.js',
        'metronics/global/plugins/datatables/media/js/jquery.dataTables.min.js',
        'metronics/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
		'metronics/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
		'metronics/global/plugins/clockface/js/clockface.js',
		'metronics/global/plugins/bootstrap-daterangepicker/moment.min.js',
		'metronics/global/plugins/bootstrap-daterangepicker/daterangepicker.js',
		'metronics/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
		'metronics/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
		'metronics/global/plugins/bootstrap-select/bootstrap-select.min.js',
		'metronics/global/plugins/jquery-multi-select/js/jquery.multi-select.js',
		'metronics/global/plugins/typeahead/handlebars.min.js',
		'metronics/global/plugins/typeahead/typeahead.bundle.min.js',
		//'metronics/global/plugins/util-functions.js',
		//'metronics/global/plugins/clear-default-text.js'
		//'metronics/global/plugins/plupload/js/plupload.full.min.js'//this was for plupload
		  'js/plugins/table-managed.js',
		  'js/plugins/xlsx/jszip.js',
		  'js/plugins/xlsx/jszip-deflate.js',
		  'js/plugins/xlsx/jszip-inflate.js',
		  'js/plugins/xlsx/jszip-load.js',
		  'js/plugins/xlsx/xlsx.js','js/plugins/angular.min.js','js/plugins/lodash.min.js','js/plugins/xlsx-reader.js','metronics/global/plugins/jqueryfileupload/jquery.uploadfile.min.js',
		  'js/plugins/xlsx.js','js/plugins/jszip.js','js/plugins/chrome.min.js','js/plugins/autotrack.js','js/plugins/jquery.easyui.min.js',
      'metronics/global/plugins/split-pane.js','metronics/global/plugins/tempo.js','metronics/global/plugins/star-rating/star-rating.min.js','metronics/global/plugins/ui-confirmations.js','metronics/global/plugins/bootstrap-confirmation.min.js','metronics/global/plugins/jquery-notific8/ui-notific8.js','metronics/global/plugins/noUiSlider/jquery.nouislider.all.js','metronics/global/plugins/foamtree/carrotsearch.foamtree.js', 'metronics/global/plugins/foamtree/hammer.min.js', 'metronics/global/plugins/uniform/jquery.uniform.min.js','metronics/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js','metronics/global/plugins/jquery.textcomplete.js','metronics/global/plugins/foamtree/carrotsearch.circles.js',
      'metronics/global/plugins/bootstrap-toastr/toastr.min.js', 'metronics/global/plugins/fSelect/fSelect.js', 'metronics/global/plugins/bootstrap-summernote/summernote.min.js',
	  'js/plugins/jquery.qtip.min.js','js/setToolTip.js', 'metronics/global/plugins/jquery-treetable/jquery.treetable.js','metronics/global/plugins/jquery-localize/jquery.localize.js',
	  'metronics/global/plugins/jstree/dist/jstreegrid.js',	  
	  'js/plugins/underscore.js',
		  'js/plugins/arbor.js',
		  'js/plugins/arbor-tween.js',
		  'js/plugins/graphics.js',
		   'js/plugins/renderer.js'
      ],

       arr_RgraphScripts: ['metronics/global/plugins/datatables/extensions/TableTools/js/dataTables.tableTools.min.js',
        'metronics/global/plugins/datatables/extensions/ColReorder/js/dataTables.colReorder.min.js',
        'metronics/global/plugins/datatables/extensions/Scroller/js/dataTables.scroller.min.js',
        'metronics/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js','js/plugins/R-graph-libraries/RGraph.common.core.js',
        'js/plugins/R-graph-libraries/RGraph.common.dynamic.js',
        'js/plugins/R-graph-libraries/RGraph.common.effects.js',
        'js/plugins/R-graph-libraries/RGraph.cornergauge.js',
        'js/plugins/R-graph-libraries/RGraph.line.js',
        'js/plugins/R-graph-libraries/RGraph.gantt.js',
        'js/plugins/R-graph-libraries/RGraph.gauge.js',
        'js/plugins/R-graph-libraries/RGraph.bar.js',
        'js/plugins/R-graph-libraries/RGraph.meter.js',
		'js/plugins/R-graph-libraries/RGraph.common.tooltips.js',
		'js/plugins/R-graph-libraries/RGraph.rose.js',
		'js/plugins/R-graph-libraries/RGraph.scatter.js',
		'js/plugins/R-graph-libraries/RGraph.hbar.js'

    ],
	
    /* arr_DataTableScripts:[        
        'metronics/global/plugins/bootstrap-editable/inputs-ext/address/address.js',
        'metronics/global/plugins/bootstrap-editable/inputs-ext/wysihtml5/wysihtml5.js'
        ],
	
	arr_DataTableScripts:[
        'metronics/global/plugins/datatables/extensions/TableTools/js/dataTables.tableTools.min.js',
        'metronics/global/plugins/datatables/extensions/ColReorder/js/dataTables.colReorder.min.js',
        'metronics/global/plugins/datatables/extensions/Scroller/js/dataTables.scroller.min.js',
        'metronics/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js',
        'metronics/global/plugins/bootstrap-editable/inputs-ext/address/address.js',
        'metronics/global/plugins/bootstrap-editable/inputs-ext/wysihtml5/wysihtml5.js'
        ],

    */

      /**
       * @initilize function
       */
      init: function(isSubpagePluginRequired,callbackFunction) {

          ISEUtils.loadScripts(ISEUtils.script_arr, function() {

            
          
                    if (isSubpagePluginRequired) {
                      // Load R-Graph plugins
                      ISEUtils.loadScripts(ISEUtils.arr_RgraphScripts, function() {

                         //  ISEUtils.loadScripts(ISEUtils.arr_DataTableScripts, function() {



                             callbackFunction();
                         //});
                      });
                  }
                   else {
                     callbackFunction();
                     
                  }               
               
          });

      },

      /**
       * To Load the all the scripts file
       * @loadScripts function
       * @param {string} scripts - path.
       * @param {function} callback - callback function.
       */
      loadScripts: function(scripts, callback) {

          var scripts = scripts || new Array();
          var callback = callback || function() {};


          var deferreds = [];
            $.each(scripts, function(index){
                deferreds.push(
                 
                    $.ajax({
                       url: scripts[index] + "?v=" + localStorage.iSEAPIVersion,
					   cache: true, 
                      dataType: "script",
                      async: true
                    })
                );
            });
         
            $.when.apply($, deferreds).then(function(){                
                  callback();
                
            }).fail(function(e){
                console.log("failure"+e);
				callback();
            })       
      },

     /**
       * Store values to localstorage once user has successfully logged-in.
       * @processAuthResponse function
       * @param {obj} objAuthResp.     
       */
      processAuthResponse: function(objAuthResp) {

                  
			  if (objAuthResp.result == 'Success') {
			  var tokens = objAuthResp.authToken.split("||");
					
			  console.log('token', tokens[0]);
              localStorage.setItem('token', tokens[0]);
              localStorage.setItem('authtoken', tokens[0]);
              //sessionStorage.setItem('token', objAuthResp.token);
              //sessionStorage.setItem('authtoken', objAuthResp.token);
              //sessionStorage.setItem('username', objAuthResp.username);
              //sessionStorage.setItem('projname', objAuthResp.projectname);
              //sessionStorage.setItem('userId', objAuthResp.userid);
              localStorage.setItem('username', tokens[1]);
			  console.log('token', tokens[1]);
              localStorage.setItem('userId', tokens[2]);
			   console.log('token', tokens[2]);
              localStorage.setItem('rolename', tokens[3]);
			  //sessionStorage.setItem('rolename', objAuthResp.rolename);
              localStorage.setItem('projname', tokens[4]);
			  console.log("Proj name : "+ tokens[4]);
              localStorage.setItem('newfeaturedate', tokens[5]);
              localStorage.setItem('projType', tokens[6]); // added for CBT
              localStorage.setItem('loginusername', tokens[7]); // added for Active Directory feature purpose
              localStorage.setItem('isnewuser', tokens[8]);// added for project selection
			  localStorage.setItem('authSuccess', objAuthResp.result);
			  localStorage.setItem('assignedProjects', tokens[9]);
              ISEUtils.createCookie('authtoken', tokens[0]);
              ISE_Ajax_Service.authToken = tokens[0]; 
			  
          }


      },
	  
	  _fillSessionStorageValues:function(){

        for (var i = 0; i < localStorage.length; i++){
        var key = localStorage.key(i);
        sessionStorage.setItem(key,localStorage.getItem(key));
      }

      },



      /**
       * Update Browser Url with Params List    
       */
      updateURLParamsList: function(urlParamsArray) {


          var queryParameters = {},
              queryString = location.search.substring(1),
              re = /([^&=]+)=([^&]*)/g,
              m;

          // Creates a map with the query string parameters
          while (m = re.exec(queryString)) {
              queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
          }
          // Add new parameters or update existing ones

          $.each(urlParamsArray, function(key, val) {
              queryParameters[val.id] = val.value;
          });

          var updatedParams = $.param(queryParameters);



          var newURL = window.location.protocol + "//" + window.location.host;
          newURL = newURL + window.location.pathname + "?" + updatedParams + "#" + localStorage.getItem("page");

          if (typeof(history.pushState) != "undefined") {
              var obj = {
                  Page: "page",
                  Url: newURL
              };
              history.pushState(obj, obj.Page, obj.Url);
          } else {
              console.log("Browser does not support HTML5.");
          }
          console.log("URL Updated");
      },

      /**
       * Adjust the Graph width and height  when browser resizes   
       * @param {obj} rGraphObj - GrpahObj.
       */
      resizeGraphs: function(rGraphObj) {
          if (rGraphObj != null) {
              var c = $('#' + rGraphObj.id);
              var ct = c.get(0).getContext('2d');
              var container = $(c).parent();

              c.attr('width', $(container).width()); //max width
              c.attr('height', $(container).height()); //max height

              rGraphObj.draw();
          }
      },

      /**
       * Adjust the Graph width and height when fullscreen mode activated   
       * @param {obj} rGraphObj - GrpahObj.
       */
      fullscreenResizeGraphs: function(rGraphObj) {
       
        var urlParamsArray = [];
        urlParamsArray.push({
            id: "_t",
            value: new Date().getTime()

        });
        ISEUtils.updateURLParamsList(urlParamsArray);

            


          var c = $('#' + rGraphObj.id);
          var ct = c.get(0).getContext('2d');
          var container = $(c).parent();


          if ($('body').hasClass('page-portlet-fullscreen')) {

              ISEUtils.graphInitialWidth = c.width();
              ISEUtils.graphInitialHeight = c.height();
              ISEUtils.parentInitalHeight = $(c).parent().height();

               $("#fullscreenBtnDiv").hide();

              ISEUtils.portletfullscreenEnabled=true;



              $(container).css('height', "90%");
              c.attr('width', $(container).width());
              c.attr('height', $(container).height());
          } else {
             $("#fullscreenBtnDiv").show();
              $(container).css('height', ISEUtils.parentInitalHeight);
              c.attr('width', ISEUtils.graphInitialWidth);
              c.attr('height', ISEUtils.graphInitialHeight);
              ISEUtils.portletfullscreenEnabled=false;

          }

      
          rGraphObj.draw();
      },

      /**
       * Validate the inputObj
       *  @param {obj} inpObj - inpObj.
       */
      validateObject: function(inpObj) {

          if (inpObj != undefined && inpObj != null && inpObj != "") {
              return true;
          } else
              false;
      },

      /**
       * create Array from Json 
       *  @param {JsonData} rawJsonData - rawJsonData.
       *  @param {key} key - key.
       */
      getArrayFromJsonByKey: function(rawJsonData, key) {
          var respArray;
          var parsedJsonData = JSON.parse(rawJsonData);
          var keyArr = Object.keys(parsedJsonData);
          for (var i = 0; i < keyArr.length; i++) {
              if (key == keyArr[i]) {
                  respArray = parsedJsonData[keyArr[i]];
              }
          }
          return respArray;
      },

      /**
       * Create Cookie      
       */
      createCookie: function(name, value, days) {
          //alert("name : "+name+" :value "+value)
          if (days) {
              var date = new Date();
              date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
              var expires = "; expires=" + date.toGMTString();
          } else var expires = "";
          document.cookie = name + "=" + value + expires + "; path=/";
      },

      /**
       * Get Current Date & Time   
       */
      getDateTime: function() {
          var now = new Date();
          var year = now.getFullYear();
          var month = now.getMonth() + 1;
          var day = now.getDate();
          var hour = now.getHours();
          var minute = now.getMinutes();
          var second = now.getSeconds();
          if (month.toString().length == 1) {
              var month = '0' + month;
          }
          if (day.toString().length == 1) {
              var day = '0' + day;
          }
          if (hour.toString().length == 1) {
              var hour = '0' + hour;
          }
          if (minute.toString().length == 1) {
              var minute = '0' + minute;
          }
          if (second.toString().length == 1) {
              var second = '0' + second;
          }
          var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
          return dateTime;
      },

      /**
       * Check Login Credentials     
       */

      checkLoginCredentials: function() {

          var sPageURL = decodeURIComponent(window.location.search.substring(1)),
              sURLVariables = sPageURL.split('&'),
              sParameterName,
              i,
              username = "",
              password = "",
              oraganization = "";
          var arrLoginInfo = new Array();


          for (i = 0; i < sURLVariables.length; i++) {
              sParameterName = sURLVariables[i].split('=');


              if (sParameterName[0] == "username") {
                  username = sParameterName[1];
                  arrLoginInfo[0] = username;
              }

              if (sParameterName[0] == "password") {
                  password = sParameterName[1];
                  arrLoginInfo[1] = password;
              }

              if (sParameterName[0] == "organization") {
                  oraganization = sParameterName[1];
                  arrLoginInfo[2] = oraganization;
              }

          }



          return arrLoginInfo;


      },
      /* Block the page or add the busy cursor  */
      pageblocking:function() {
          $('body').block({
                message: '<img src="images/loading-spinner-blue.gif" align="" />',
                centerY: true,
                css: {
                    border: 'none',
                    padding: '2px',
                    backgroundColor: 'none',
                    zindex: '10056'                    
                },
                overlayCSS: {
                    backgroundColor: '#000',
                    opacity: 0.05,
                    cursor: 'wait',
                    zindex: '10055'
                }
            });
          $('#headerPart').block({
              message: null
          });
      },

      /* UnBlock the page or remove the busy cursor  */
      pageunblocking: function() {
          $.unblockUI();
          $('#headerPart').unblock();
      },

       /* portletBlocking  */
      portletBlocking:function(portletID){

         $('#'+portletID).block({
			message : '<div class="page-loader">  <h4>Just a moment....</h4>  <span></span><span></span><span></span><span></span></div>	'
			});
        },

      /* portletUnblocking  */
      portletUnblocking:function(portletID){
                $('#'+portletID).unblock();
      },
     /* Show MultiRelease Header Dropdown */
      showMultiReleaseHeaderDropdown:function(){       
        
        $('#header_release').addClass("hide");
        $('#header_multirelease').removeClass("hide");
      },
     
      /* Show Release Header Dropdown */
      showReleaseHeaderDropdown:function(){

         $('#header_multirelease').addClass("hide");
         $('#header_release').removeClass("hide");

      },
      /* Usage metrics logging 
        params:
                      eventName: event name
                      projectName: project name
                      use, role: ****can be accessed from here
                      usageData: usage data, which can be varied for event to event
        */
      logUsageMetrics:function(eventName,  usageData, typeOfdata, callback) {
              var inputDate = new Date().toISOString();
              var dataObj = new Object();
			  var projectName = ""+localStorage.getItem('projname');
              dataObj.eventName=eventName;
			   
				dataObj.projectName = projectName; 
			  
              dataObj.published_at = inputDate;
              dataObj.user=localStorage.getItem('username');
              dataObj.role=localStorage.getItem('rolename');
			  dataObj.urlPath=window.location.pathname  + window.location.hash;
              jQuery.extend(usageData, dataObj);
              var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
				client.create({
					index: 'usagemetrics',
					type: typeOfdata == 'rating' ? eventName : projectName,

					body: usageData
								  }).then(function (resp) {

							if (typeof callback === "function") callback(resp);
						}
						,function (error)
						{
							if( error != null ) {
								console.log("error posting usage details ..");
								console.log(error);
							}
				});
      },

      getDateFormat:function(dateString){

 
        var date = new Date(dateString);
           var yyyy = date.getFullYear().toString();
           var mm = (date.getMonth()+1).toString();
           var dd  = date.getDate().toString();
                 
            // CONVERT mm AND dd INTO chars
            var mmChars = mm.split('');
            var ddChars = dd.split('');
 
        // CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
        var datestring = yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);

         return datestring;

      },
	  
	  //For Cluster page portlet blocking 
	  portletBlockingCluster:function(portletID){

       $('#'+portletID).block({message : '<img src="/DevTest/dashboard/images/initial_load.gif" height="95%" width="95%"/></br> Preparing Clusters... This may take few minutes to complete. Please Wait!'});

      },

      portletUnblockingCluster:function(portletID){
                $('#'+portletID).unblock();

     },
	 //SURESH Generic table
	 initCollectionTables: function(source,tableItem, sourceNS) {

            var roleName = localStorage.getItem('rolename');
            $('#searchResultsTabs_'+source).empty();
            $('#resultTabContent_'+source).empty();


            $.getJSON("json/DynamicTabArrayOrphan.json?"+Date.now(), function(data) {

                sourceNS.jsonDataCollection = data;
				var displayName;
				console.log(data);
				
                $.each(data.TabArray, function(key, item) {
                    //  Filter Search List will be added based on role.
                    if (item.enable == "yes" && key == tableItem) {

                        for (var i = 0; i < item.allowedroles.length; i++) {

                            if (item.allowedroles[i] == roleName) {

                                displayName = item.displayName;


                                $('#searchResultsTabs_'+source).append($("<li id=resultTab_" + source+displayName + "><a href=#resultsTab_InnerContainer_" + source+displayName + " data-toggle='tab'>" + displayName + "</a></li>"))
                                $('#resultTabContent_'+source).append("<div class=tab-pane fade  id=resultsTab_InnerContainer_" + source+displayName + "></div>");


                                var columnToggler = "<div class='btn-group pull-right hidden-sm hidden-xs'  ><a class='btn pull-right' default href=javascript:; data-toggle=dropdown>Columns <i class=fa fa-angle-down></i></a>";
                                columnToggler += "<div id=columnToggler_" + source+displayName + " class=dropdown-menu hold-on-click dropdown-checkboxes pull-right></div></div>";
                                $('#resultsTab_InnerContainer_' + source+displayName).append(columnToggler);



                                $('#resultsTab_InnerContainer_' + source+displayName).append("<div class='table-scrollable' style='clear: both; padding: 10px;'><table class='table table-striped table-bordered table-hover dataTable ' colcName="+displayName+" id=sample_4_" + source+displayName + "></table></div>")
                                $('#sample_4_' + source+displayName).append("<thead><tr id=tableheader_" + source+displayName + "></tr></thead><tbody id=tablebody_" + source+displayName + "></tbody>");

                                //defectsearch.listTableId.push('sample_4_' + source+displayName);

                                // Set Table Heading for all columns

                                // Empty column name for first column
                                $('#tableheader_' + source+displayName).append("<th></th>");
								$('#tableheader_' + source+displayName).append("<th></th>");
                                for (var j = 0; j < item.Details.fields.length; j++) {
                                    $('#tableheader_' + source+displayName).append("<th class='sorting ISEcompactAuto'>" + item.Details.fields[j].displayName + "</th>");
                                }

                                var dropDownBoxId = "columnToggler_" + source+displayName;
                                var tableID = 'sample_4_' + source+displayName;
                               // ISEUtils.fillColumnListinDropdown(dropDownBoxId, tableID, item[sourceNS.viewName], item.Details.fields,sourceNS);
							   ISEUtils.fillColumnListinDropdown(dropDownBoxId, tableID, item.defaultView, item.Details.fields,sourceNS);

                                /*defectsearch.mobileViewTableColumnCollection.push({
                                    "tableID": 'sample_4_' + displayName,
                                    "columnsList": item.mobileView,
                                    "dropdownID": 'columnToggler_' + displayName
                                });*/
                            }
                        }
                    }
                });

                // Set Intial Active Tab
                //defectsearch._setInitialActiveTab();
				$("#resultTab_" + source+displayName).addClass("active");
				$("#resultsTab_InnerContainer_" + source+displayName).addClass("active");
            });
        },
		
		fillColumnListinDropdown: function(dropDownBoxId, tableID, defaultColumnView, ColumnsList,sourceNS) {


            $('#' + dropDownBoxId).empty();

            var tempArr = new Array();

            for (var i = 0; i < ColumnsList.length; i++) {
                tempArr.push(ColumnsList[i].displayName);
            }
            var colunmnID = 0;
            var tableColumnID = 0;
            var tableHideColumns = new Array();
            $.grep(tempArr, function(element) {

                colunmnID = colunmnID + 1;


                if ($.inArray(element, defaultColumnView) !== -1) {

                    $('#' + dropDownBoxId).append('<label><input type="checkbox" name="column" checked="true" columnID=' + colunmnID + '  data-column=' + colunmnID + '>' + element + '</label>');
                } else {

                    tableColumnID = colunmnID + 1;
                    tableHideColumns.push(parseInt(tableColumnID));
                    $('#' + dropDownBoxId).append('<label><input type="checkbox" name="column"  columnID=' + colunmnID + ' data-column=' + colunmnID + '>' + element + '</label>');

                }

            });

            sourceNS.hideTableColumns.push({
                "tableID": tableID,
                "hideColumnsList": tableHideColumns,
                "allColumnsNames": tempArr
            });


            $('input[type="checkbox"]', '#' + dropDownBoxId).change(function() {

                var iCol = parseInt($(this).attr("data-column"));
                iCol = iCol+1;
                var oTable = $('#' + tableID).dataTable();

                var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
                oTable.fnSetColumnVis(iCol, bVis ? false : true);

            });

        },
populateResultsDefFM: function(dataObj,source,tableItem,sourceNS) {
    

            if (ISEUtils.validateObject(dataObj)) {

              
                //SURESH - Usage
                ISEUtils.tableData = [];
                var usageData = new Object();
                usageData.searchIdInput = "";//escape($('#searchID').val().trim()); //needs to be modified for context and advanced
                usageData.resultsCount = 0;
                usageData.filters = "";//defectsearch._getFiltersAsString();
                if (dataObj && dataObj.length > 0) {
                    usageData.resultId = dataObj[0]._id;
                    usageData.resultsCount = dataObj.length;
                    usageData.source = dataObj[0]._index;
                } else {
                    return; // SIMY 
                }
                var eventName = "orphandefects"; //this can be taken from active tabid.
                ISEUtils.logUsageMetrics(eventName, usageData);
        //console.log(dataObj);
                //SURESH - Usage

                var FieldsMap = {};
                var DisplayNameMap = {};
                var displayColumns = {};
                var tC = {};


                for (var K in sourceNS.jsonDataCollection.TabArray) {
                    FieldsMap[sourceNS.jsonDataCollection.TabArray[K].indexName] = sourceNS.jsonDataCollection.TabArray[K].Details.fields;
                    DisplayNameMap[sourceNS.jsonDataCollection.TabArray[K].indexName] = sourceNS.jsonDataCollection.TabArray[K].displayName;
                    displayColumns[sourceNS.jsonDataCollection.TabArray[K].indexName] = sourceNS.jsonDataCollection.TabArray[K][sourceNS.viewName];
                }
console.log("------676----")
                console.log(FieldsMap);
                console.log("------678----")
                console.log(DisplayNameMap);
                console.log("------680----")
                console.log(displayColumns);


                var sortField = 1;
                var fields = FieldsMap[dataObj[0]._index];
                for (var ii = 0; ii < fields.length; ii++) {
                    if (fields[ii].SourceName == 'similarity') sortField = ii + 1;
                }


                for (var i = 0; i < dataObj.length; i++) {
        
                    var fields = FieldsMap[dataObj[i]._index];
                    var dName = DisplayNameMap[dataObj[i]._index];
        if(tableItem == dName) {
          console.log("fields----"+fields);
          console.log("dName---"+dName);
          
                    var tableID = '#sample_4_' + source+dName;
                    if (!tC[tableID]) {

                        var oTable = $(tableID).dataTable();
                        oTable.fnClearTable();
                        oTable.fnDestroy();
                    }
                    tC[tableID] = 1;


                    var newRowContent = '<tr><td><input class="checkboxContent" type="checkbox" name="column" style="margin-left:3px;" value=""></td><td><span class="row-details row-details-close"></span></td>';
        
           for (var ii = 0; ii < fields.length; ii++) {
		   if(tableItem == "Source"){
		   newRowContent += '<td class="ISEcompactAuto"><span requiredfilter=' + fields[ii].filter +  ' displaytype=' + escape(dataObj[i][fields[ii].SourceName]) + '>' + escape(dataObj[i][fields[ii].SourceName]) + '</span></td>';
		   }else{

        if(tableItem == "TestCase")
        {
        if((fields[ii].displayName)=="Description")
        {
          if(typeof(dataObj[i][fields[ii].SourceName])=="undefined")
            dataObj[i][fields[ii].SourceName]="No data";
        }
      }

                        //newRowContent += '<td class="ISEcompactAuto"><span requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';
                      
             newRowContent += '<td class="ISEcompactAuto"><span requiredfilter=' + fields[ii].filter +  ' displaytype=' + escape(dataObj[i][fields[ii].SourceName]) + '>' + (dataObj[i][fields[ii].SourceName]) + '</span></td>';
			 }
                   
           }
          
                    newRowContent += '</tr>';
                    $('#tablebody_' + source+dName).append(newRowContent);
          //console.log("SIMY ...10");

                }
      }

                //SIMY: Creating tables only for result
        //console.log("SIMY ...2");
                for (var tab in tC) {

                    var tableColumnsCount = $(tab).find('tr')[0].cells.length;
                    var tempArr = new Array();
	                     for(var i=2;i<tableColumnsCount;i++){
	                        tempArr.push(i);                    
	                     }
                   		 var oTable = $(tab).dataTable({
                        //"dom": 'frtTip',
                       // "tableTools": {
                         //   "sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
                       // },
					   "dom": 'frtTip',
                       	 "tableTools": {
                           	"sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
							"aButtons": [{
							'sExtends': "csv",
						"mColumns": tempArr				
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
                            "search": "Search with in results:",
                            "zeroRecords": "No matching records found"
                        },

                        "columnDefs": [{
                            "orderable": false,
                            "targets": [0]
                        }],
                        "order": [
                            [sortField, 'desc']
                        ],
                        "lengthMenu": [
                            [5, 15, 20, -1],
                            [5, 15, 20, "All"] // change per page values here
                        ],
                        // set the initial value
                        "pageLength": 10,

                    });

          //SIMY : scrolling down ..
          if( $(window).width() < 500 ) {
            $(document).scrollTop($('#searchResultsTable_'+source).offset().top);
          }
          

                    $(tab).unbind('click'); // SIMY: removing all events in case if there was some event set here ..
                    $(tab).on('click', ' tbody td .row-details', function(event) {
                        var nTr = $(this).parents('tr')[0];
                        var tID = $(this).closest('table').attr('id');

                        var cols = [];
                        cols = ISEUtils.getColumnNamesList(tID,sourceNS);


                        var oTable = $('#' + tID).dataTable();

                        if (oTable.fnIsOpen(nTr)) {
                            /* This row is already open - close it */
                            $(this).addClass("row-details-close").removeClass("row-details-open");
                            oTable.fnClose(nTr);
                        } else {
                            // Open this row 
                            $(this).addClass("row-details-open").removeClass("row-details-close");
                            oTable.fnOpen(nTr, ISEUtils.fnDefectSearchRowFormatDetails(oTable, nTr, cols), 'details');
                        }

                    });

                    $(tab).on('click', ' tbody td .checkboxContent', function(event){

                    

                        var nTr = $(this).parents('tr')[0];
                         var tID = $(this).closest('table').attr('id');
                          var colcName = $(this).closest('table').attr('colcName');
							ISEUtils.colectionName = colcName;
                        
						var cols = [];
                        cols = ISEUtils.getColumnNamesList(tID,sourceNS);
                        
                         if ($(this).is(':checked')) {
                            // the checkbox was checked 
                             ISEUtils.getTableCheckBoxClickHandler(oTable, nTr,cols);
                        } else {
                           

                            var aData = oTable.fnGetData(nTr);
                             var displaytype = $(aData[2]).attr('displaytype');                        

                            ISEUtils.tableData.splice(_.indexOf(ISEUtils.tableData, _.findWhere(ISEUtils.tableData, { DefectID : displaytype})), 1);
                           

                        }
                        ISEUtils.defectIdcount = [];
                        for(index in ISEUtils.tableData)
                {
                 // console.log("venky"+ISEUtils.tableData[index].DefectID);
                  
					if(colcName == "Defects"){
						ISEUtils.defectIdcount.push(ISEUtils.tableData[index].DefectID);
					} else if(colcName == "TestCase"){
						ISEUtils.defectIdcount.push(ISEUtils.tableData[index].TestcaseId);
					}else if(colcName == "Source"){
					ISEUtils.defectIdcount.push(ISEUtils.tableData[index].SourceId);
					}
				   
                   
                }

                  

                       });


                }



                for (var i = 0; i < sourceNS.hideTableColumns.length; i++) {
                    var iTD = '#' + sourceNS.hideTableColumns[i].tableID;
                    if (!tC[iTD]) continue; // SIMY: do not proceed if the table is in current list

                    var table = $(iTD).DataTable();
                    for (var j = 0; j < sourceNS.hideTableColumns[i].hideColumnsList.length; j++) {


                        //var columnID = sourceNS.hideTableColumns[i].hideColumnsList[j] - 1;
						var columnID = sourceNS.hideTableColumns[i].hideColumnsList[j];
                        table.column(columnID).visible(false, false);
                    }

                }

                $('#searchResultsTable_'+source).removeClass("hide");


                //  Hide Table rows dropdown and Table Search
                $("div").find(".dataTables_length").addClass('hidden-sm hidden-xs');
                $("div").find(".dataTables_filter").addClass('hidden-sm hidden-xs');

                /*var windowWidth = $(window).width();
                if (windowWidth <= 400) {
                    defectsearch.onResizeWindow();
                    $("html, body").animate({
                        scrollTop: $(document).height()
                    }, 1000);
                }*/
            }

		   ISEUtils.portletUnblocking("pageContainer");
           ISEUtils.portletUnblocking("largefeature");
		   
        },
		
		populateResults: function(dataObj,source,tableItem,sourceNS, isIncludeBtn) {
		

            if (ISEUtils.validateObject(dataObj)) {
				
				ISEUtils.tabaleData = dataObj;
				ISEUtils.currTabaleData = dataObj; 
                var usageData = new Object();
                usageData.searchIdInput = "";//escape($('#searchID').val().trim()); //needs to be modified for context and advanced
                usageData.resultsCount = 0;
                usageData.filters = "";//defectsearch._getFiltersAsString();
                if (dataObj && dataObj.length > 0) {
                    usageData.resultId = dataObj[0]._id;
                    usageData.resultsCount = dataObj.length;
                    usageData.source = dataObj[0]._index;
                } else {
                    return; // SIMY 
                }
                var eventName = "orphandefects"; //this can be taken from active tabid.
                ISEUtils.logUsageMetrics(eventName, usageData);
				//console.log(dataObj);
                //SURESH - Usage

                var FieldsMap = {};
                var DisplayNameMap = {};
                var displayColumns = {};
                var tC = {};


                for (var K in sourceNS.jsonDataCollection.TabArray) {
                    FieldsMap[sourceNS.jsonDataCollection.TabArray[K].indexName] = sourceNS.jsonDataCollection.TabArray[K].Details.fields;
                    DisplayNameMap[sourceNS.jsonDataCollection.TabArray[K].indexName] = sourceNS.jsonDataCollection.TabArray[K].displayName;
                    displayColumns[sourceNS.jsonDataCollection.TabArray[K].indexName] = sourceNS.jsonDataCollection.TabArray[K][sourceNS.viewName];
                }


                var sortField = 1;
                var fields = FieldsMap[dataObj[0]._index];
                for (var ii = 0; ii < fields.length; ii++) {
                    if (fields[ii].SourceName == 'similarity') sortField = ii + 1;
                }


                for (var i = 0; i < dataObj.length; i++) {
				
                    var fields = FieldsMap[dataObj[i]._index];
                    var dName = DisplayNameMap[dataObj[i]._index];
				if(tableItem == dName) {
					console.log(fields);
					console.log(dName);
					
                    var tableID = '#sample_4_' + source+dName;
                    if (!tC[tableID]) {

                        var oTable = $(tableID).dataTable();
                        oTable.fnClearTable();
                        oTable.fnDestroy();
                    }
                    tC[tableID] = 1;

					var newRowContent =''
					
					   newRowContent += '<tr><td><input class="checkboxContent" type="checkbox" name="column" style="margin-left:3px;" value=""></td><td><span class="row-details row-details-close"></span></td>';
					
                     for (var ii = 0; ii < fields.length; ii++) {

							String.prototype.replaceAll = function(target, replacement) {
												return this.split(target).join(replacement);
											};
										
											
						  if(fields[ii].SourceName == "description")
							  {
							 
							   var desText = dataObj[i][fields[ii].SourceName] ? dataObj[i][fields[ii].SourceName] : ""; 
							 
							  desText =desText.replaceAll('&nbsp;','<br>');
							  desText =desText.replaceAll("<em class='iseH'>",'##');
							  desText =desText.replaceAll("</em>","#");
							  newRowContent += '<td class="ISEcompactAuto"><span requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + desText + '</span></td>';
							  }
						   else

							//newRowContent += '<td class="ISEcompactAuto"><span requiredfilter=' + fields[ii].filter + ' displaytype=' + fields[ii].displayType + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';
						  
						   newRowContent += '<td class="ISEcompactAuto"><span requiredfilter=' + fields[ii].filter +  ' displaytype=' + dataObj[i][fields[ii].SourceName] + '>' + dataObj[i][fields[ii].SourceName] + '</span></td>';
					   
				   }
                    newRowContent += '</tr>';
                    $('#tablebody_' + source+dName).append(newRowContent);
					//console.log("SIMY ...10");

                }
			}

                //SIMY: Creating tables only for result
				//console.log("SIMY ...2");
                for (var tab in tC) {

                    var oTable = $(tab).dataTable({
                        "dom": 'frtTip',
                        "tableTools": {
                            "sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
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
                            "search": "Search with in results:",
                            "zeroRecords": "No matching records found"
                        },

                        "columnDefs": [{
                            "orderable": false,
                            "targets": [0]
                        }],
                        "order": [
                            [sortField, 'desc']
                        ],
                        "lengthMenu": [
                            [5, 15, 20, -1],
                            [5, 15, 20, "All"] // change per page values here
                        ],
                        // set the initial value
                        "pageLength": 10,

                    });

					//SIMY : scrolling down ..
					if( $(window).width() < 500 ) {
						$(document).scrollTop($('#searchResultsTable_'+source).offset().top);
					}
					

                    $(tab).unbind('click'); // SIMY: removing all events in case if there was some event set here ..
                    $(tab).on('click', ' tbody td .row-details', function(event) {
                        var nTr = $(this).parents('tr')[0];
                        var tID = $(this).closest('table').attr('id');

                        var cols = [];
                        cols = ISEUtils.getColumnNamesList(tID,sourceNS);


                        var oTable = $('#' + tID).dataTable();

						var aData = oTable.fnGetData(nTr);
                        var displayid = $(aData[2]).attr('displaytype');
						
                        if (oTable.fnIsOpen(nTr)) {
                            /* This row is already open - close it */
							var obj = new Object()
							obj.event = this;
							obj.displayid = displayid;
							obj.isTableOpen = 'open';
							//$(tab).trigger( iseEventsConstants.ROW_EXPANDED, obj ); 
                            $(this).addClass("row-details-close").removeClass("row-details-open");
                            oTable.fnClose(nTr);
                        } else {
                            // Open this row 
							var obj = new Object()
							obj.event = this;
							obj.displayid = displayid;
							obj.isTableOpen = 'open';
							
							//$(tab).trigger( iseEventsConstants.ROW_EXPANDED, obj );
                            $(this).addClass("row-details-open").removeClass("row-details-close");
							var defectIdValue=$(aData[2]).attr('displaytype');
							var testcasedata = ISEUtils.getTestcaseDataByID(displayid);
                            oTable.fnOpen(nTr, ISEUtils.fnDefectSearchRowFormatDetails(oTable, nTr, cols, isIncludeBtn, testcasedata,defectIdValue), 'details');
                        }

                    });

$(tab).on('click', ' tbody td .checkboxContent', function(event){

                    

                        var nTr = $(this).parents('tr')[0];
                         var tID = $(this).closest('table').attr('id');
                        var colcName = $(this).closest('table').attr('colcName');
							ISEUtils.colectionName = colcName;
                        
                        var cols = [];
                        cols = ISEUtils.getColumnNamesList(tID,sourceNS);
                        
                         if ($(this).is(':checked')) {
                            // the checkbox was checked 
                             ISEUtils.getTableCheckBoxClickHandler(oTable, nTr,cols);
                        } else {
                           

                            var aData = oTable.fnGetData(nTr);
                             var displaytype = $(aData[2]).attr('displaytype');                        

                            ISEUtils.tableData.splice(_.indexOf(ISEUtils.tableData, _.findWhere(ISEUtils.tableData, { DefectID : displaytype})), 1);
                           

                        }
                        ISEUtils.defectIdcount = [];
                        for(index in ISEUtils.tableData)
                {
                 
				   
				   if(colcName == "Defects"){
						ISEUtils.defectIdcount.push(ISEUtils.tableData[index].DefectID);
					} else if(colcName == "TestCase"){
						ISEUtils.defectIdcount.push(ISEUtils.tableData[index].TestcaseId);
					}else if(colcName == "Source"){
					ISEUtils.defectIdcount.push(ISEUtils.tableData[index].SourceId);
					}
				   
                   
                }

                  

                       });
                }



                for (var i = 0; i < sourceNS.hideTableColumns.length; i++) {
                    var iTD = '#' + sourceNS.hideTableColumns[i].tableID;
                    if (!tC[iTD]) continue; // SIMY: do not proceed if the table is in current list

                    var table = $(iTD).DataTable();
                    for (var j = 0; j < sourceNS.hideTableColumns[i].hideColumnsList.length; j++) {


                       // var columnID = sourceNS.hideTableColumns[i].hideColumnsList[j] - 1;
						var columnID = sourceNS.hideTableColumns[i].hideColumnsList[j]
                        table.column(columnID).visible(false, false);
                    }

                }

                $('#searchResultsTable_'+source).removeClass("hide");


                //  Hide Table rows dropdown and Table Search
                $("div").find(".dataTables_length").addClass('hidden-sm hidden-xs');
                $("div").find(".dataTables_filter").addClass('hidden-sm hidden-xs');

                
            }

            ISEUtils.portletUnblocking("pageContainer");
        },
		getTestcaseDataByID: function(id){
			for(var i=0; i<ISEUtils.currTabaleData.length; i++){
				if(id == ISEUtils.currTabaleData[i]['_id']){
					return ISEUtils.currTabaleData[i]['testcases']
				}
			}
		},
getTableCheckBoxClickHandler:function(oTable, nTr,cols){

           var aData = oTable.fnGetData(nTr);

          
           var obj=[];
         
             for (var i = 0; i < cols.length; i++) {

                var requiredFilter = $(aData[i + 2]).attr('requiredFilter');
                var displaytype = $(aData[i + 2]).attr('displaytype');
                obj[cols[i]] = displaytype;
            
              }

               ISEUtils.tableData.push(obj);
               console.log(ISEUtils.tableData);
              
             

        },
		
		getColumnNamesList: function(tableID,sourceNS) {

            for (var i = 0; i < sourceNS.hideTableColumns.length; i++) {

                if (sourceNS.hideTableColumns[i].tableID == tableID)
                    return sourceNS.hideTableColumns[i].allColumnsNames; // Returns Array

            }

        },

		fnDefectSearchRowFormatDetails: function(oTable, nTr, cols, isincludebtn,testcasedata,defectIdValue) {

            var aData = oTable.fnGetData(nTr);

             var orphanDefectId=$(aData[2]).text();
            var sOut = '<table>';
			if(isincludebtn){
				 
				 
				var valuesStr = "";
				for (var i = 0; i < cols.length; i++) {
				   var valueDiv = "<div class='dummy-div-container'>"+aData[i + 2]+"</div>";
				   $('body').append(valueDiv);
				   valuesStr +=" "+ cols[i]+"='"+$('.dummy-div-container span').text()+"'";
				   $(".dummy-div-container").remove();
				}
				//console.log(valuesStr)
				sOut += '<tr  '+valuesStr+'><td ><button class="btn btn blue"style="margin-left:3px;" id="assignTestcaseOrphan" value="assignTC" defID = "'+orphanDefectId+'" onclick="orphans.assignTestcaseOrphan(this)">Map Test Case</button></td><td><button class="btn btn blue"style="margin-right:3px;" id="markAsCreateBtn" onclick="orphans.markAsCreateBtn(this)">Mark As Create</button></td> </tr>';
				
			}

     else{

		if(!isincludebtn && testcasedata){
				var tescaseName = "TestCaseID: "
				if(typeof(testcasedata) == "object" && testcasedata){
					if(testcasedata.length>0){
						
						for(var i=0; i<testcasedata.length; i++){
							var testCaseIdValue = testcasedata[i]['test_case_id']
							sOut += '<tr><td class="ISEcompactAuto">' + tescaseName+ ':</td><td></td><td></td><td class="ISEcompactAuto">' + testCaseIdValue  + '</td><td><a href="javascript:;" title = "remove map" class="btn btn-icon-only blue" onclick="orphans.removeTestCase(' + testCaseIdValue  + ',' + defectIdValue  + ')"><i class="fa fa-times"></i></a></td> <td><a href="javascript:;" title = "Confirmed" class="btn btn-icon-only blue" onclick="orphans.confirmTestCase(' + testCaseIdValue  + ',' + defectIdValue  + ')"><i class="fa fa-edit"></i></a></td> <td><a href="javascript:;" title = "Mark for Update" class="btn btn-icon-only blue" onclick="orphans.updateTestCase(' + testCaseIdValue  + ',' + defectIdValue  + ')"><i class="fa fa-file-o"></i></a></td></tr>';
						}
					}else{
						var testCaseIdValue = testcasedata['test_case_id']
						sOut += '<tr><td class="ISEcompactAuto">' + tescaseName+ ':</td><td></td><td></td><td class="ISEcompactAuto">' + testCaseIdValue  + '</td><td><a href="javascript:;" title = "remove map" class="btn btn-icon-only blue" onclick="orphans.removeTestCase(' + testCaseIdValue  + ',' + defectIdValue  + ')"><i class="fa fa-times"></i></a></td> <td><a href="javascript:;" title = "Confirmed" class="btn btn-icon-only blue" onclick="orphans.confirmTestCase(' + testCaseIdValue  + ',' + defectIdValue  + ')"><i class="fa fa-edit"></i></a></td> <td><a href="javascript:;" title = "Mark for Update" class="btn btn-icon-only blue" onclick="orphans.updateTestCase(' + testCaseIdValue  + ',' + defectIdValue  + ')"><i class="fa fa-file-o"></i></a></td></tr>';
					} 
				}
			}
	 
	 
	 
            for (var i = 0; i < cols.length; i++) {


                var requiredFilter = $(aData[i + 2]).attr('requiredFilter');
                var displaytype = $(aData[i + 2]).attr('displayType');



              
                    sOut += '<tr><td class="ISEcompactAuto">' + cols[i] + ':</td><td></td><td></td><td class="ISEcompactAuto">' + aData[i + 2] + ' </td></tr>';
               
            }

            sOut += '</table>';


		}
            return sOut;
        },
        
          getDateTime:function(requestDate){

      var responseDate = '';
      console.log(requestDate)

    if(requestDate == "today"){
   
      var d = new Date();
           var dd=d.getDate();
         var mm=d.getMonth()+1;
        var yyyy=d.getFullYear();
         var hrs=d.getHours();
         var min=d.getMinutes();
         var sec=d.getSeconds();
         var millisec=d.getMilliseconds();
         var day=d.getDay();

         var date=yyyy+'-'+mm+'-'+dd; //+' '+hrs+':'+min+':'+sec+'.'+millisec; 
          responseDate=date;
     }
    else if(requestDate == "yesterday"){ 
   
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate()-1)
      var sdd = yesterday.getDate();
      var dd=yesterday.getDate();
      var mm=yesterday.getMonth()+1;
      var yyyy=yesterday.getFullYear();
      var hrs=yesterday.getHours();
      var min=yesterday.getMinutes();
      var sec=yesterday.getSeconds();
      var millisec=yesterday.getMilliseconds();
     // var date=mm+'/'+sdd+'/'+yyyy +' '+hrs+':'+min+':'+sec+'.'+millisec; 
      var date=yyyy+'-'+mm+'-'+sdd;

      responseDate=date;
  }

else if(requestDate == "last_15_mins"){  

  var d = new Date();
  d.setMinutes(d.getMinutes() - 15)
  var min_new=d.getMinutes();
  var dd=d.getDate();
     var mm=d.getMonth()+1;
     var yyyy=d.getFullYear();
     var hrs=d.getHours();
     //var min=d.getMinutes();
     var sec=d.getSeconds();
     var millisec=d.getMilliseconds();

  var date=mm+'/'+dd+'/'+yyyy +' '+hrs+':'+min_new+':'+sec+'.'+millisec; 
  responseDate=date;
}

else if(requestDate == "last_30_days"){  

  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate()-30)
  var sdd = yesterday.getDate();
    var dd=yesterday.getDate();
     var mm=yesterday.getMonth()+1;
     var yyyy=yesterday.getFullYear();
     var hrs=yesterday.getHours();
     var min=yesterday.getMinutes();
     var sec=yesterday.getSeconds();
     var millisec=yesterday.getMilliseconds();
 // var date=mm+'/'+sdd+'/'+yyyy +' '+hrs+':'+min+':'+sec+'.'+millisec;
    var date=yyyy+'-'+mm+'-'+sdd; 
  responseDate=date;
}
else if(requestDate == "day_before_yesterday"){   

var yesterday = new Date();
yesterday.setDate(yesterday.getDate()-2)
var sdd = yesterday.getDate();
  var dd=yesterday.getDate();
   var mm=yesterday.getMonth()+1;
   var yyyy=yesterday.getFullYear();
   var hrs=yesterday.getHours();
   var min=yesterday.getMinutes();
   var sec=yesterday.getSeconds();
   var millisec=yesterday.getMilliseconds();
//var date=mm+'/'+sdd+'/'+yyyy +' '+hrs+':'+min+':'+sec+'.'+millisec; 
 var date=yyyy+'-'+mm+'-'+sdd;
responseDate=date;

}
else if(requestDate == "last_30_mins"){    

var d = new Date();
d.setMinutes(d.getMinutes() - 30)
var min_new=d.getMinutes();
var dd=d.getDate();
   var mm=d.getMonth()+1;
   var yyyy=d.getFullYear();
   var hrs=d.getHours();
   //var min=d.getMinutes();
   var sec=d.getSeconds();
   var millisec=d.getMilliseconds();
var date=mm+'/'+dd+'/'+yyyy +' '+hrs+':'+min_new+':'+sec+'.'+millisec; 
responseDate=date;
}

else if(requestDate == "last_60_days"){    

var d = new Date();
d.setDate(d.getDate()-60)
var sdd = d.getDate();
  var dd=d.getDate();
   var mm=d.getMonth()+1;
   var yyyy=d.getFullYear();
   var hrs=d.getHours();
   var min=d.getMinutes();
   var sec=d.getSeconds();
   var millisec=d.getMilliseconds();
//var date=mm+'/'+sdd+'/'+yyyy +' '+hrs+':'+min+':'+sec+'.'+millisec; 
 var date=yyyy+'-'+mm+'-'+sdd;
responseDate=date;
}

else if(requestDate == "this_month"){    
 
  var d = new Date();
     var mm=d.getMonth()+1;
     var yyyy=d.getFullYear();
     var date=mm+'/'+01+'/'+yyyy +' '+00+':'+00+':'+00+'.'+00; 
     // var date=yyyy+'-'+mm+'-'+sdd;
      responseDate=date;
      }
else if(requestDate == "this_day_last_week"){    


var yesterday = new Date();
yesterday.setDate(yesterday.getDate()-7)
var sdd = yesterday.getDate();
  var dd=yesterday.getDate();
   var mm=yesterday.getMonth()+1;
   var yyyy=yesterday.getFullYear();
   var hrs=yesterday.getHours();
   var min=yesterday.getMinutes();
   var sec=yesterday.getSeconds();
   var millisec=yesterday.getMilliseconds();
//var date=mm+'/'+sdd+'/'+yyyy +' '+hrs+':'+min+':'+sec+'.'+millisec; 
  var date=yyyy+'-'+mm+'-'+sdd;
responseDate=date;


}

else if(requestDate == "last_1_hr"){    
 

var d = new Date();
d.setMinutes(d.getMinutes() - 60)
//var min_new=d.getMinutes();
var dd=d.getDate();
   var mm=d.getMonth()+1;
   var yyyy=d.getFullYear();
   var hrs=d.getHours();
   var min=d.getMinutes();
   var sec=d.getSeconds();
   var millisec=d.getMilliseconds();

var date=mm+'/'+dd+'/'+yyyy +' '+hrs+':'+min+':'+sec+'.'+millisec; 
responseDate=date;
}

else if(requestDate == "last_90_days"){    

var d = new Date();
d.setDate(d.getDate()-90)
var sdd = d.getDate();
  var dd=d.getDate();
   var mm=d.getMonth()+1;
   var yyyy=d.getFullYear();
   var hrs=d.getHours();
   var min=d.getMinutes();
   var sec=d.getSeconds();
   var millisec=d.getMilliseconds();
//var date=mm+'/'+sdd+'/'+yyyy +' '+hrs+':'+min+':'+sec+'.'+millisec; 
  var date=yyyy+'-'+mm+'-'+sdd;
responseDate=date;
}

else if(requestDate == "this_Year"){    

var d = new Date();
   var yyyy=d.getFullYear();
   //var date=01+'/'+01+'/'+yyyy +' '+00+':'+00+':'+00+'.'+0; 
     var date=yyyy+'-'+01+'-'+01;
    responseDate=date;

                }

else if(requestDate == "last_4_hr"){    

var d = new Date();
d.setHours(d.getHours() - 4)
responseDate=d;
}

else if(requestDate == "last_6_months"){    

var d = new Date();
d.setMonth(d.getMonth()-6)
responseDate=d;
}

else if(requestDate == "previous_month"){    

var d = new Date();
d.setMonth(d.getMonth()-1)
   var mm=d.getMonth()+1;
   var yyyy=d.getFullYear();
var date=mm+'/'+01+'/'+yyyy +' '+00+':'+00+':'+00+'.'+0; 
responseDate=date;
}

else if(requestDate == "last_12_hr"){    

var d = new Date();
d.setHours(d.getHours() - 12)
responseDate.innerHTML=d;
}

else if(requestDate == "last_1_year"){    

var d = new Date();
d.setFullYear(d.getFullYear()-1)
responseDate=d;
}

else if(requestDate == "previous_year"){    

var d = new Date();
var year=d.getFullYear();
var date=year-1; 
responseDate=date;

}

else if(requestDate == "last_24_hr"){    

var d = new Date();
d.setHours(d.getHours() - 24)
responseDate=d;
}

else if(requestDate == "last_2_year"){    

var d = new Date();
d.setFullYear(d.getFullYear()-2)
responseDate=d;
}

else if(requestDate == "last_7_days"){    

var d = new Date();
d.setDate(d.getDate()-7)
  var dd=d.getDate();
   var mm=d.getMonth()+1;
   var yyyy=d.getFullYear();
   var hrs=d.getHours();
   var min=d.getMinutes();
   var sec=d.getSeconds();
   var millisec=d.getMilliseconds();
//var date=mm+'/'+dd+'/'+yyyy +' '+hrs+':'+min+':'+sec+'.'+millisec; 
 var date=yyyy+'-'+mm+'-'+dd;
responseDate=date;
}

else if(requestDate == "last_5_years"){    

var d = new Date();
d.setFullYear(d.getFullYear() - 5)
var dd=d.getDate();
   var mm=d.getMonth()+1;
   var yyyy=d.getFullYear();
   var hrs=d.getHours();
   var min=d.getMinutes();
   var sec=d.getSeconds();
   var millisec=d.getMilliseconds();

//var date=mm+'/'+dd+'/'+yyyy +' '+hrs+':'+min_new+':'+sec+'.'+millisec;
var date=yyyy+'-'+mm+'-'+dd; 
responseDate=date;
} else if(requestDate == "this_week"){

var d = new Date();
d.setDate(d.getDay()-d.getDate())
  var dd=d.getDate();
   var mm=d.getMonth()+1;
   var yyyy=d.getFullYear();
   var hrs=d.getHours();
   var min=d.getMinutes();
   var sec=d.getSeconds();
   var millisec=d.getMilliseconds();

var date=yyyy+'-'+mm+'-'+dd; 
responseDate=date;
}

else if(requestDate == "previous_week"){

var d = new Date();
d.setDate((d.getDay()-d.getDate())-7)
  var dd=d.getDate();
   var mm=d.getMonth()+1;
   var yyyy=d.getFullYear();
   var hrs=d.getHours();
   var min=d.getMinutes();
   var sec=d.getSeconds();
   var millisec=d.getMilliseconds();
//var date=mm+'/'+dd+'/'+yyyy +' '+hrs+':'+min+':'+sec+'.'+millisec; 
//document.getElementById("demo").innerHTML=date;
var date=yyyy+'-'+mm+'-'+dd; 
responseDate=date;
}

else{
  responseDate="No Date";

}

return responseDate;
},

getOldPriorityDate:function(date,priorityDate){

  var date = new Date(date);   
  var newDate =  new Date(date.setDate(date.getDate() - priorityDate));
  return newDate;


 },

 formatDate:function(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
},
visualLength:function(str){
	var ruler = document.createElement('span');
	ruler.style.visibility = 'hidden';
	ruler.style['white-space'] = 'nowrap';
	document.body.appendChild(ruler);
	ruler.innerHTML = str;
	var l =ruler.offsetWidth;
	document.body.removeChild(ruler);
	return l;        
},
trunc :function(n, element, typeofText){
	String.prototype.trim=function(){return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');};
    if(typeofText == "string")
    	var str = element;
    else if(typeofText == "element")
      var str = element.innerHTML;
      
        if(ISEUtils.visualLength(str)>n){
            do{
                str = str.substr(0,str.length-1).trim();
            }while(ISEUtils.visualLength(str)>n);
            if(typeofText == "string"){
				return str + '...';
           	}else if(typeofText == "element"){
				element.title = element.innerHTML;
				element.innerHTML=str + '&hellip;';
			}
        }else{
			return str;
		}
},

  };
