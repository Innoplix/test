
 var featurekeys = {

 	 isNewRow:false,		 	  
		tableData:[],		
		seletedFeatureKey:[],
		featureKeysData:'',
		singleFeatureKeyData:{},
		deleteSingleFeatureKeyData:{},
	
      /* Init function  */
      init: function()
      {

      	  if (!jQuery().dataTable) {
                return;
            }

        var data = '{"fileName":"get_featuremapping","params":"","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('QueryReportingRestService', 'json', localStorage.authtoken,data,featurekeys.callBackGetFeatureMapping);
		$("#FeatureKeysMappingModel").live("click", function(){		
			if(featurekeys.seletedFeatureKey.length>0){	
                for (var i = 0; i < featurekeys.seletedFeatureKey.length; i++) {
						 if(featurekeys.seletedFeatureKey[i]['keywords']=="")
						  featurekeys.seletedFeatureKey[i]['keywords']="No Keys";	
                   }			
				var jsonString ="{FEATURES:"+JSON.stringify(featurekeys.seletedFeatureKey)+"}";		
				console.log(jsonString)		
				var jsonData = {};		
				
				
				jsonData.FEATURES = featurekeys.seletedFeatureKey;		
					
				jsonData.requesttype = "model";		
				jsonData.modeltype = "18";		
						
				console.log("==837=="+JSON.stringify(jsonData));		
				ISE_Ajax_Service.ajaxPostReq('IndexingRestService', 'json', localStorage.authtoken,JSON.stringify(jsonData),featurekeys.callBackFeaturesMappingModel);		
			}
           else{
			   
			  // alert("plesae select atleast one feature");
			   var defaultjson = '{"requesttype":"model","modeltype": "18","default":"all"}';
            ISE_Ajax_Service.ajaxPostReq('IndexingRestService', 'json', localStorage.authtoken,defaultjson ,featurekeys.callBackInvokeModel);
		   }				
			 		
		});
		
    },
     callBackFeaturesMappingModel : function(data){		
				
	},

     restoreRow:function(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);

            for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                oTable.fnUpdate(aData[i], nRow, i, false);
            }

            oTable.fnDraw();
        },

         editRow:function(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);
          
			jqTds[0].innerHTML = "<input class='checkboxContent' type='checkbox' name='column' style='margin-left:3px;' value=''>";
			jqTds[1].innerHTML = "<input type='text' class='form-control input-small' value='" + featurekeys.extractDataFromHTMLElement(aData[1])+ "'>";
			jqTds[2].innerHTML = "<input type='text' class='form-control input-small' value='" + featurekeys.extractDataFromHTMLElement(aData[2]) + "'>";
			jqTds[3].innerHTML = "<input type='text' class='form-control input-small' value='" + featurekeys.extractDataFromHTMLElement(aData[3]) + "'>";
			jqTds[4].innerHTML = '<a class="edit" href="">Save</a>';
			jqTds[5].innerHTML = '<a class="cancel" href="">Cancel</a>';
        },

         saveRow:function(oTable, nRow) {
            var jqInputs = $('input', nRow);
		    oTable.fnUpdate("<input class='checkboxContent' type='checkbox' name='column' style='margin-left:3px;' value=''>", nRow, 0, false);
			if((jqInputs[1].value).length > 0)
				oTable.fnUpdate("<span>"+jqInputs[1].value+"</span>", nRow, 1, false); else oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
			if((jqInputs[2].value).length > 0)
				oTable.fnUpdate("<span>"+jqInputs[2].value+"</span>", nRow, 2, false); else oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
			if((jqInputs[3].value).length > 0)
				oTable.fnUpdate("<span>"+jqInputs[3].value+"</span>", nRow, 3, false); else oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
			 oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 4, false);
			 oTable.fnUpdate('<a class="delete" href="">Delete</a>', nRow, 5, false);
            oTable.fnDraw();
        },

         cancelEditRow:function(oTable, nRow) {
            var jqInputs = $('input', nRow);
            //oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
           // oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
			// oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
            //oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
           // oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
            //oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 3, false);
			
			oTable.fnUpdate("<input class='checkboxContent' type='checkbox' name='column' style='margin-left:3px;' value=''>", nRow, 0, false);
			 oTable.fnUpdate("<span>"+jqInputs[1].value+"</span>", nRow, 1, false);
			 oTable.fnUpdate("<span>"+jqInputs[2].value+"</span>", nRow, 2, false);
			 oTable.fnUpdate("<span>"+jqInputs[3].value+"</span>", nRow, 3, false);
			 oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 4, false);
            oTable.fnDraw();
        },
		
		extractDataFromHTMLElement: function(html_string){		
			if(html_string.length>0){		
			var element = $(html_string); //convert string to JQuery element		
			element.find("span").each(function(index) {		
				var text = $(this).text(); //get span content		
				$(this).replaceWith(text); //replace all span with just content		
			});		
			var newString = element.html(); //get back new string		
			}else		
				var newString = "";		
					
			return newString;		
		},

        callBackGetFeatureMapping:function(data){

        	console.log(data)


        	 if (ISEUtils.validateObject(data)) {
       
        	 	for(var index in data){
                  featurekeys.featureKeysData=data;
                var newRowContent = "<tr featureID="+data[index]._id+"><td><input class='checkboxContent' type='checkbox' name='column' style='margin-left:3px;' value=''></td>"
                newRowContent += "<td><span>"+data[index].feature+"</span></td>";			   
				 
					var parentFeature="";
				 _.each(data[index], function (inVal, inKey) {               
					if(inKey == 'parent feature')
					  parentFeature=inVal;
					});
					
			     if(parentFeature != null)
				  newRowContent += "<td><span>"+parentFeature+"</span></td>";
				   else
				   newRowContent += "<td></td>";

                 if(data[index].keywords)
                   newRowContent += "<td><span>"+data[index].keywords+"</span></td>";
                 else
                 newRowContent += "<td><span> No Keys</span> </td>";

                 newRowContent += "<td><a class='edit' href='javascript:;''>Edit </a></td>";
                 newRowContent += "<td><a class='delete' href='javascript:;''>Delete </a></td></tr>";

                 $('#featureMappingTableBody').append(newRowContent);

        	 	}


        	 	featurekeys._setOtableToTable();

        	 }

        },

        _setOtableToTable:function(){

        var table = $('#sample_editable_1');

        var oTable = table.dataTable({
		
		//"dom": 'frtTip',
		"tableTools": {
		"sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
		"aButtons": [{
			'sExtends': "csv"
								}],
		},

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
            // So when dropdowns used the scrollable div should be removed. 
            //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // set the initial value
            "pageLength": 5,

            "language": {
                "lengthMenu": " _MENU_ records",
                 "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",              
                "search": "Search with in results:",
                "zeroRecords": "No matching records found"
            },
            "columnDefs": [{ // set default column settings
                'orderable': true,
                'targets': [0]
            }, {
                "searchable": true,
                "targets": [0]
            }],
            "order": [
                [0, "asc"]
            ] // set first column as a default sort by asc
        });

        var tableWrapper = $("#sample_editable_1_wrapper");

        tableWrapper.find(".dataTables_length select").select2({
            showSearchInput: true //hide search box with special css class
        }); // initialize select2 dropdown

        var nEditing = null;
        var nNew = false;

        $('#sample_editable_1_new').click(function (e) {
            e.preventDefault();
			var searchTextVal = $('#page_featurekeys .dataTables_filter input').val().trim();
			if(searchTextVal.length > 0){
				alert("Please clear the search filter and try again to add new Feature key");
				return;
			}

            if (nNew && nEditing) {
				
				 var jqInputs = $('input', nEditing);
				    console.log(jqInputs)
					if(jqInputs[1].value=="" ||(jqInputs[1].value=="" && jqInputs[2].value=="")){
				   alert("feature name is mandatory");
				    return;
			    }	
                if (confirm("Previose row not saved. Do you want to save it ?")) {
                    featurekeys.saveRow(oTable, nEditing); // save
                    $(nEditing).find("td:first").html("Untitled");
                    nEditing = null;
                    nNew = false;

                } else {
                    oTable.fnDeleteRow(nEditing); // cancel
                    nEditing = null;
                    nNew = false;
                    
                    return;
                }
            }

            var aiNew = oTable.fnAddData(['', '', '', '', '', '']);
            var nRow = oTable.fnGetNodes(aiNew[0]);
            featurekeys.editRow(oTable, nRow);
            nEditing = nRow;
            nNew = true;

            if(nNew){

            	featurekeys.isNewRow = true;
            }
        });

        table.on('click', '.delete', function (e) {
            e.preventDefault();

            if (confirm("Are you sure to delete this row ?") == false) {
                return;
            }

            var nRow = $(this).parents('tr')[0];
            featurekeys._deleteFeatureInformation(nRow);
            oTable.fnDeleteRow(nRow);
			oTable.fnDraw();
					
           // alert("Deleted! Do not forget to do some ajax to sync with backend :)");
        });

        table.on('click', '.cancel', function (e) {
            e.preventDefault();
            if (nNew) {
                oTable.fnDeleteRow(nEditing);
                nEditing = null;
                nNew = false;
            } else {
                featurekeys.restoreRow(oTable, nEditing);
                nEditing = null;
            }
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();

            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];
            var jqInputs = $('input', nEditing);
			if(jqInputs[1].value=="" ||(jqInputs[1].value=="" && jqInputs[2].value=="")){
				alert("feature name is mandatory");
				return;
			}
            if (nEditing !== null && nEditing != nRow) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                featurekeys.restoreRow(oTable, nEditing);
                featurekeys.editRow(oTable, nRow);
                nEditing = nRow;
            } else if (nEditing == nRow && this.innerHTML == "Save") {
                
                 // "Updating information to backend
               if( featurekeys._updateFeatureInformation(nEditing)){
                /* Editing this row and want to save it */
				   featurekeys.saveRow(oTable, nEditing);
					nEditing = null;  
					nNew = false					
			   }else{
					//featurekeys._deleteFeatureInformation(nRow);
					if(nNew){
						oTable.fnDeleteRow(nRow); 
						oTable.fnDraw();
						nEditing = null;
						nNew = false; 
					}
			   }

            } else {
                /* No edit in progress - let's start one */
                featurekeys.editRow(oTable, nRow);
                nEditing = nRow;
            }
        });

		
		table.on('click', ' tbody td .checkboxContent', function(event){		
			var nTr = $(this).parents('tr')[0];		
			var tID = $(this).closest('table').attr('id');		
			var colcName = $(this).closest('table').attr('colcName');		
			//ISEUtils.colectionName = colcName;		
					
			var cols = [];		
			cols = ["Feature", "ParentFeature", "Keys","Edit","Delete"];//ISEUtils.getColumnNamesList(tID,sourceNS);		
					
			 if ($(this).is(':checked')) {		
				// the checkbox was checked 		
				 featurekeys.getTableCheckBoxClickHandler(oTable, nTr,cols);		
			}else{		
				var aData = oTable.fnGetData(nTr);		
				var displaytype = $(aData[1]).text();                        		
				featurekeys.tableData.splice(_.indexOf(featurekeys.tableData, _.findWhere(featurekeys.tableData, { Feature : displaytype})), 1);		
			} 		
			featurekeys.seletedFeatureKey = [];		
					
			 for(index in featurekeys.tableData)		
                {		
					var obj = {}		
					for(var index_1 in featurekeys.tableData[index]){		
								
						if(index_1=="Feature")		
							obj['featurename'] = featurekeys.tableData[index]['Feature'];		
						else if(index_1=="Keys")		
							obj['keywords'] = featurekeys.tableData[index]['Keys'];		
					}		
					featurekeys.seletedFeatureKey.push(obj);		
				}		
						
		   });		
		    		
					
		  		
        },		       
		getTableCheckBoxClickHandler:function(oTable, nTr,cols){		
           var aData = oTable.fnGetData(nTr);		
           var obj=[];		
         		
             for (var i = 0; i < cols.length; i++) {		
               // var requiredFilter = $(aData[i + 2]).attr('requiredFilter');		
                var displaytype = $(aData[i + 1]).text();		
                obj[cols[i]] = displaytype;		
			 }		
               featurekeys.tableData.push(obj);		
               console.log(featurekeys.tableData);		
        },

        _updateFeatureInformation:function(editfeatureInformation){

        	

        	if(featurekeys.isNewRow){
        		

        	//var featureName =  $(editfeatureInformation).find("td").eq(1).text(); 
        	var featureName =  $(editfeatureInformation).find("td").eq(1).find("input").val().trim();
			var parentFeature =  $(editfeatureInformation).find("td").eq(2).find("input").val().trim();
        	var keys =  $(editfeatureInformation).find("td").eq(3).find("input").val().trim();
			
			for(var i=0;i<featurekeys.featureKeysData.length;i++){
					
					if(featureName == featurekeys.featureKeysData[i].feature){
						alert("enter feature is already exists");

						return false;
					}
				}
        	//bugid 2442
			if(keys.trim() =='No Keys'.trim()) 
				keys="";
			var createddate = new Date();
        	var last_updated_date = new Date();
        	var updated_by = localStorage.getItem('username');        	
			
			var idVal = featurekeys.hashCode(featureName+parentFeature+keys)
				console.log("==273==idval=="+idVal)
	        
			var param =[];
			param[0]="PARAM0="+idVal;
        	param[1]="PARAM1="+featureName;
			param[2]="PARAM2="+parentFeature;
        	param[3]="PARAM3="+keys;	
        	param[4]="PARAM4="+createddate.toISOString();
        	param[5]="PARAM5="+last_updated_date.toISOString();
        	param[6]="PARAM6="+updated_by;	
			var jsonStrObj ={ "feature" :featureName ,"parent feature" :parentFeature, "keywords" : keys };
			featurekeys.singleFeatureKeyData = jsonStrObj;
             
        	var data = '{"fileName":"add_featuremapping","params":"'+param+'","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
			ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,featurekeys.addNewFeatureInformationStatus);
			return true;
        	}
        	else
        	{

        	var featureID = $(editfeatureInformation).attr("featureID");
        	//var featureName =  $(editfeatureInformation).find("td").eq(1).text(); 
			//var parentFeature =  $(editfeatureInformation).find("td").eq(2).text();
        	//var keys =  $(editfeatureInformation).find("td").eq(3).text();  
			var featureName =  $(editfeatureInformation).find("td").eq(1).find("input").val().trim();
			var parentFeature =  $(editfeatureInformation).find("td").eq(2).find("input").val().trim();
        	var keys =  $(editfeatureInformation).find("td").eq(3).find("input").val().trim();
			for(var i=0;i<featurekeys.featureKeysData.length;i++){
					
					if(featureName == featurekeys.featureKeysData[i].feature){
						alert("enter feature is already exists");

						return false;
					}
				}
        	//bugid 2442
			if(keys.trim() =='No Keys'.trim()) 
				keys="";
			var last_updated_date = new Date();
               last_updated_date = last_updated_date.toISOString();
        	var updated_by = localStorage.getItem('username');     	

            var jsonStrObj ={ "feature" :featureName ,"parent feature" :parentFeature, "keywords" : keys };
            var jsonString='{"requesttype":"updateObjectModel","collection":"features_mapping","columnname":"_id","columnvalue":"'+featureID+'","object":'+JSON.stringify(jsonStrObj)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}';
             console.log(jsonString)
             ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString,featurekeys.updatedFeatureInformationStatus);
			return true;
        	}       	
        	
        },
		//bugId:2449, Common fucntion to convert string to hashcode 
		hashCode :function(str){
			var hash = 0;
			if (str.length == 0) return hash;
				for (i = 0; i < str.length; i++) {
					char = str.charCodeAt(i);
					hash = ((hash<<5)-hash)+char;
					hash = hash & hash; // Convert to 32bit integer
				}
			return hash;
		},

        updatedFeatureInformationStatus:function(statusObject){

        	console.log(JSON.stringify(statusObject))


        },

        addNewFeatureInformationStatus:function(statusObject){

        	console.log(JSON.stringify(statusObject))
        	featurekeys.isNewRow = false;
			if(featurekeys.singleFeatureKeyData["parent feature"]=="")
			 featurekeys.singleFeatureKeyData["parent feature"]="N.A";
			featurekeys.featureKeysData.push(featurekeys.singleFeatureKeyData);

        },

        _deleteFeatureInformation:function(deletefeatureInformation){

         
         var featureID = $(deletefeatureInformation).attr("featureID");          	
		 featurekeys.deleteSingleFeatureKeyData = deletefeatureInformation
        	var param =[];
        	param[0]="PARAM1="+featureID;
        	

        var data = '{"fileName":"delete_featuremapping","params":"'+param+'","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"fase"}';
		ISE_Ajax_Service.ajaxPostReq('MapReduceQueryParserService', 'json', localStorage.authtoken,data,featurekeys.deletedFeatureInformationStatus);
		

        },

        deletedFeatureInformationStatus:function(statusObject){

        	console.log(JSON.stringify(statusObject))
			var displaytype = $(featurekeys.deleteSingleFeatureKeyData).children().eq(1).text()
			featurekeys.featureKeysData.splice(_.indexOf(featurekeys.featureKeysData, _.findWhere(featurekeys.featureKeysData, { feature : displaytype})), 1);		
        },
		featureKeysHelp:function(){
			
           $('#featureKeysHelpPortlet').modal('show');
            
		}
		
      


  };
