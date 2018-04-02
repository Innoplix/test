var knowledgedocuments = {

    projectName: '',
    jsonDataCollection: '',
    mobileViewTableColumnCollection: new Array(),
    columnsList: new Array(),
    selectedNodeID: '',
    selectedNodePath: '',
    documentviewoptions: new Array(),
    encryptedFileptah: '',
    uploadDocFileName: '',
    tableID:'',
    selectedDocumentId:'',
    isRenameDcoument:false,
    documentIndexCollection:'',
    requiredForRenameDocumentID:'',
    isDeleteDocument:false,
    restoreDocumentIDCollection:[],
    documentTypeIcon:'',
	dataFromRemoteFile:'',
	docData:{},

    /* Init function  */
    init: function() {   


     knowledgedocuments.documentIndexCollection = iseConstants.str_docs_collection;    

      knowledgedocuments.tableID   = $('#knowledgedocuments_4');
     
    $('div.split-pane').splitPane();


     if (!jQuery().dataTable) {
            return;
        }
     if (!jQuery().wysihtml5) {
            return;
        }

          if (!jQuery().datetimepicker) {
            return;
        }


        if ($('.wysihtml5').size() > 0) {
            $('.wysihtml5').wysihtml5({
                "stylesheets": ["metronics/global/plugins/bootstrap-wysihtml5/wysiwyg-color.css"]
            });
        }


         knowledgedocuments.projectName = localStorage.getItem('projectName');
        knowledgedocuments.generateTableFromJsonData(); 
         $('#captionDiv').append("root");     
        ISEUtils.portletBlocking("pageContainer"); 

    $('#contextSearchInput').on('change', knowledgedocuments._contextSearchInputKeyUpFunc);     

    knowledgedocuments._getInitialData();  
    },

    

    generateTableFromJsonData: function() {


        knowledgedocuments.columnsList = new Array();

        $.getJSON("json/knowledgedocuments.json?" + Date.now(), function(data) {

            knowledgedocuments.jsonDataCollection = data;                    
           

            $.each(data.DocsData, function(key, item) {

                knowledgedocuments.mobileViewTableColumnCollection = item.mobileView;
                knowledgedocuments.documentviewoptions = item.documentviewoptions.fields;

                
                  $('#tableheaderRow').append("<th></th>");
                for (var i = 0; i < item.columns.fields.length; i++) {


                    // if (item.columns.fields[i].enable.toLowerCase() == "yes")
                    // {
                      $('#tableheaderRow').append("<th class='sorting ISEcompactAuto'>" + item.columns.fields[i].displayName + "</th>");
                     knowledgedocuments.columnsList.push(item.columns.fields[i].displayName);
                   //}

                    var columnIndex = i+1;
                    if (item.columns.fields[i].enable.toLowerCase() == "yes")
                        $('#treegrid_4_column_toggler').append('<label><input type="checkbox" checked data-column="' + columnIndex + '">' + item.columns.fields[i].displayName + '</label>')
                    else
                        $('#treegrid_4_column_toggler').append('<label><input type="checkbox"  data-column="' + columnIndex + '">' + item.columns.fields[i].displayName + '</label>')

                   
                }

            });


            $('input[type="checkbox"]', '#treegrid_4_column_toggler').change(function(event) {

                var columnIndex = parseInt($(this).attr("data-column"));
                columnIndex = columnIndex+1;
                console.log(columnIndex)

                if($(this).is(':checked'))
                {
                    
                   $('#knowledgedocuments_4 td:nth-child('+columnIndex+'),th:nth-child('+columnIndex+')').show();

                }
                else
                {
                    $('#knowledgedocuments_4 td:nth-child('+columnIndex+'),th:nth-child('+columnIndex+')').hide();
                }

            });

            if (ISEUtils.validateObject(knowledgedocuments.documentviewoptions)) {            

                $.each(knowledgedocuments.documentviewoptions, function(key, item) {

                    if (item.enable == "yes") {

                        var elementDom = '<div class="form-group"><label class="col-md-3 control-label">' + item.displayName + '</label><div class="col-md-8">';
							

                        if (item.control == "label") {
                            elementDom += '<label class="control-label" id=kt_modal_' + item.SourceName + '></label>';
                        } else if (item.control == "textinput") {
                            elementDom += '<input type="text" class="form-control input-circle" id=kt_modal_' + item.SourceName + '>';

                        } else if (item.control == "textarea") {
                            elementDom += ' <textarea  class="form-control" style="height:180px" id=kt_modal_' + item.SourceName + '></textarea>';
                        } else if (item.control == "multitags") {
                            elementDom += '<input type="text" class="form-control input-circle" id=kt_modal_' + item.SourceName + '>';
                        } else if (item.control == "attachment") {
							//elementDom += '<input type="file" id="uploadedFile" name = "uploadedFile" onchange="knowledgedocuments.readUploadedFileContents(event)" />';
                            // elementDom+='<input type="text" class="form-control input-circle" id=kt_modal_'+item.SourceName+'> <button type="submit" class="btn btn-circle blue" onClick="knowledgedocuments.uploadAttachments()">Add Attachment</button>';
                            elementDom += '<div class="input-group"><input type="file" id="file1" name = "file1" style="display:none" multiple><input type="text" class="form-control input-circle-left" readonly id=kt_modal_' + item.SourceName + '>';
                            elementDom += '<span style="cursor:pointer"  class="input-group-addon input-circle-right" onClick="knowledgedocuments.uploadAttachments(this)"><i class="glyphicon glyphicon-upload"></i></span></div>';
                        
							//elementDom += '<div class="input-group"><input type="file" id="file2" name = "file2" style="display:none" multiple><input type="text" class="form-control input-circle-left" readonly id=kt_modal_' + item.SourceName + '>';
                            //elementDom += '<span style="cursor:pointer" class="input-group-addon input-circle-right" onClick="knowledgedocuments.uploadAttachments(this)"><i class="glyphicon glyphicon-upload"></i></span></div>';
						
						
						}
                        else if (item.control == "date") {

                            elementDom +='<div class="input-group date date-picker"><input type="text" size="16" readonly="" class="form-control" id=kt_modal_'+ item.SourceName +'>';
                            elementDom +='<span class="input-group-btn"><button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button></div>';
                        } else {
                            console.log("control is not defined in json.")
                        }

                        elementDom += "</div></div>";
                        //console.log(elementDom)

                        $('#ktmodalbody').append(elementDom);
                    }

                     if (jQuery().datepicker) {
                        $('.date-picker').datepicker({
                            rtl: Metronic.isRTL(),
                            orientation: "top",
                            autoclose: true
                        }); 
            }
			
        });



                $('input[type=file]').change(function(event) {

                    if (window.File && window.FileReader && window.FileList && window.Blob)
                    {
                          
                            var fname = $(this)[0].files[0].name;
							var fileExtension = fname.split('.').pop();
							$(this).next().val(fname);
							//knowledgedocuments.loadFileContentsFromRemote();
							/*  var input = event.target;
								
							if( fileExtension == "pdf" || fileExtension == "png" || fileExtension == "jpg"){
									  if( knowledgedocuments.dataFromRemoteFile == "")
										knowledgedocuments.dataFromRemoteFile = reader.result;	
									else
										knowledgedocuments.dataFromRemoteFile = knowledgedocuments.dataFromRemoteFile + "     NEW FILE CONTENT    " +reader.result;	  
									knowledgedocuments.getOcrContent();
									knowledgedocuments.indexUrl();
							}else{
								var reader = new FileReader();
								reader.readAsBinaryString(input.files[0]);
								reader.onload = function(){
									if( knowledgedocuments.dataFromRemoteFile == "")
										knowledgedocuments.dataFromRemoteFile = reader.result;	
									else
										knowledgedocuments.dataFromRemoteFile = knowledgedocuments.dataFromRemoteFile + "     NEW FILE CONTENT    " +reader.result;	
									console.log( "readAsBinaryString ======" );
									console.log( knowledgedocuments.dataFromRemoteFile );
								};	
							}  */
                    }
                    else
                    {
                        alert("Please upgrade your browser, because your current browser lacks some new features we need!"); 
                    } 
                }); 
            }

        });
    },


     /**
     * Initial Elastic Search Call to get all Documents
     */
    _getInitialData:function(){
      
        var sString = "/root";
      
        var requestObject = new Object();
        requestObject.collectionName = iseConstants.str_docs_collection;
        requestObject.searchString = "parent:\"" + sString + "\"" + " AND _missing_:expiryDate";
        requestObject.projectName = knowledgedocuments.projectName;
        requestObject.maxResults = 100;
        ISE.getSearchDocsResults(requestObject, knowledgedocuments.receivedSearchDocResults);
    },

     /**
     * Received Search results for Inital Elastic search Call.
     * Initialize JSTree Data and Construct Table Data
     */
    receivedSearchDocResults: function(data) {

           var leftTreeData = [];
           console.log(data);

        if (ISEUtils.validateObject(data)) {
           
            var tableData = [];


            var childNodes = [];


            for (var index in data) {
                if (data[index].parent == '/root') {

                        childNodes.push({
                        text: data[index].name,
                        id :data[index].documentId,                        
                        "icon" : "fa fa-folder icon-state-success" ,
                          "type":"folder"                         
                    });
                      
                    tableData.push(data[index]);
                } else {
                    tableData.push(data[index]);
                }
            }

             var uniqueID = Math.floor( Math.random() * 1000 ) + Date.now();
             childNodes.push({
                        text: "RecyleBin",
                        id :uniqueID,                        
                        "icon" : "fa fa-folder glyphicon glyphicon-trash",
                        "type":"folder"                         
                    });          

            leftTreeData.push({
                text: "root",
                children: childNodes
            });

            knowledgedocuments.assignDataToTable(tableData);      

        } else {
         

         var addDeleteNode = [];
         var uniqueID = Math.floor( Math.random() * 1000 ) + Date.now();
          addDeleteNode.push({
                        text: "RecyleBin",
                        id :uniqueID,                        
                        "icon" : "fa fa-folder glyphicon glyphicon-trash",
                         "type":"folder"                   
                    });
         
            leftTreeData.push({
                text: "root" ,
                children: addDeleteNode            
            });

            $('#tableBody').html('');          
        }

         $('div#documentsjstree').jstree({
                "core": {
                    "check_callback": true,

                    "themes": {
                        "variant": "large"
                    },
                    'data': leftTreeData,
                    "load_open": true,
                    "animation": true

                },
               "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },

                "search": {

                    "case_insensitive": true,
                    "show_only_matches": true
                },               

                "plugins": ["wholerow", "button", "sort", "themes", "html_data", "ui", "crrm", "contextmenu", "types", "search"],
                "contextmenu": {
                    "items": knowledgedocuments.customMenu
                }
            });
           

            $("div#documentsjstree").bind("loaded.jstree", function(e,data) {            
                $(this).jstree("open_all");
            }).on("select_node.jstree", function(event, data) {


                knowledgedocuments.selectedNodeID = data.node.id;            
                 var loMainSelected = data;
                var selectedNodeInfo = knowledgedocuments.uiGetParents(loMainSelected);             
                knowledgedocuments.selectedDocumentId = loMainSelected.node.id;               

        
                var sString = '/'
                for (var i = 0; i < selectedNodeInfo.length; i++) {
                    sString += selectedNodeInfo[i] + "/";
                }

                var n = sString.lastIndexOf("/");
                sString = sString.substring(0, n);
                knowledgedocuments.selectedNodePath = sString;

                 $('#captionDiv').empty();

              if(data.node.type != "file"){
               
                $('#captionDiv').append(knowledgedocuments.selectedNodePath);
                $('#captionDiv').append('<button type="button" id="restoreBtn" class="btn default  pull-right hide" onClick="knowledgedocuments._restoreAllSelectedDocuments()">Restore</button>');
                knowledgedocuments._refreshTableInformation();                  
               
               }

            });

            ISEUtils.portletUnblocking("pageContainer");     
    },


    /**
     * assignDataToTable - Display Data in Table.
     * This Function will be triggered once get the data for selected jstree node.     
     */    
    assignDataToTable: function(tableData) {

        if (ISEUtils.validateObject(tableData)) {
           

            $('#tableBody').html('');

            var FieldsMap = {};
            var DisplayNameMap = {};
            var displayColumns = {};
            var tC = {};

            for (var K in knowledgedocuments.jsonDataCollection.DocsData) {
                FieldsMap[knowledgedocuments.jsonDataCollection.DocsData[K].indexName] = knowledgedocuments.jsonDataCollection.DocsData[K].columns.fields;
                displayColumns[knowledgedocuments.jsonDataCollection.DocsData[K].indexName] = knowledgedocuments.jsonDataCollection.DocsData[K].defaultView;
            }



            for (var i = 0; i < tableData.length; i++) {
                var fields = FieldsMap[tableData[i]._index];

                var newRowContent = "<tr>";
                 if(knowledgedocuments.selectedNodePath != "/root/RecyleBin")
                 {
                     var documentType = tableData[i]["type"];
					if(!documentType)
						documentType = "file";
                     if(documentType.toLowerCase() == "file")
                       newRowContent+='<td><a href="javascript:;" documentID='+tableData[i]._id+' title="Edit" class="btn btn-xs blue" onClick="knowledgedocuments._renameDocument1(this)"><i class="glyphicon glyphicon-edit" ></i></a> <a href="javascript:;" documentID='+tableData[i]._id+' title="Delete" onclick="knowledgedocuments._DeleteDocument1(this)" class="btn btn-xs blue"><i class="glyphicon glyphicon-remove-circle" ></i></a></td>';
                     else
                       newRowContent+='<td></td>';   
                 }  
                else{

                     newRowContent+='<td><input class="checkboxContent" id='+tableData[i]._id+' type="checkbox" name="column" onchange="knowledgedocuments._checkForRestoreDocument(this)"  style="margin-left:3px;" value=""></td>';
               
                }

                

                for (var ii = 0; ii < fields.length; ii++) {

                    if (fields[ii].SourceName != "name") {

                        if(fields[ii].SourceName != "published_at" && fields[ii].SourceName != "expiryDate"  )
                          newRowContent += '<td class="ISEcompactAuto">' + tableData[i][fields[ii].SourceName] + '</td>';
                        else
                        {
                            var date = new Date(tableData[i][fields[ii].SourceName]);                          
                            newRowContent += '<td class="ISEcompactAuto">' + date.toLocaleString() + '</td>';
                             
                        }
                    } 
                    else
                    {

                        var contentHighLight = tableData[i]["highlight"];

                       
                      
                       if(tableData[i]["type"] != "folder"){

                        var fileExtension = escape(tableData[i]["fileName"]).split('.').pop();
                        var iconPath = '"'+knowledgedocuments._getIconNameforFileExtension(fileExtension)+'"'; 
                         var documentID = tableData[i]["documentId"];

                        
                         newRowContent += '<td class="ISEcompactAuto"><image src='+iconPath+' >   File'//tableData[i][fields[ii].SourceName];   

						//alert(href="http://10.119.72.63:2020/DevTest/FileServer/download/"+tableData[i]["fileName"]+"?download");
                        newRowContent += '<a style="cursor:pointer;"  href="http://localhost/DevTest/FileServer/download/'+tableData[i]["fileName"]+'?download"  documentID=' + escape(documentID) + ' >'
                        newRowContent += ' <i class="glyphicon glyphicon-download"></i></a>';

                      

                         if(contentHighLight === undefined)
                             newRowContent+='</td>';                           
                      //  else
                          //   newRowContent+='<br><textarea class="knowledgeDocsTDTextarea" readonly>'+contentHighLight+'</textarea></td>';
                           

                      }
                      else
                      {
                         var parentInfo = tableData[i]["parent"] + "/" + tableData[i]["name"];
                         var documentID = tableData[i]["documentId"];
                         newRowContent += '<td class="ISEcompactAuto"><i class="icon-folder"></i>&nbsp;<a parentInfo='+escape(parentInfo)+' documentID='+escape(documentID)+' onclick="knowledgedocuments._onSelectedFolderInTable(this)">' + tableData[i][fields[ii].SourceName] + '</a></td>';
                      }              


                    }

                }
                newRowContent += "</tr>";
                $('#tableBody').append(newRowContent);


                 var newRowContent1=''


                  var contentHighLight = tableData[i]["highlight"];
                  console.log(contentHighLight)

                  if(contentHighLight === undefined)
                  {
                     console.log("contentHighLight undefined")
                  }
                  else{

                    newRowContent1+='<tr><th></th><th  rowspan="3" style="display:block"><span style="background-color:YELLOW">'+contentHighLight+'</span></th></tr>';

                  }

           $('#tableBody').append(newRowContent1);

            }

       
           if (!knowledgedocuments.tableID) {

               var oTable = $(knowledgedocuments.tableID).dataTable();
                oTable.fnClearTable();
                oTable.fnDestroy();
            }



            var oTable = knowledgedocuments.tableID.dataTable({
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
                          [2, 'desc']
                        ],
                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "pageLength": 10,
                "retrieve": true,
            });

            //document.getElementById('knowledgedocuments_4_paginate').style.marginTop = "-59px";
            document.getElementById('knowledgedocuments_4_info').style.display ="none";

            $('#knowledgedocuments_4_filter').addClass("hide");
            $('#knowledgedocuments_4_length').addClass("hide");

            knowledgedocuments.hideTableColumns();

        }
              
       if(knowledgedocuments.selectedNodePath != "/root/RecyleBin")
         {

           knowledgedocuments.restoreDocumentIDCollection = new Array();
           $("#restoreBtn").addClass('hide');               
         
        
         }
         else
         {
                         
            $("#restoreBtn").removeClass('hide');
            $("#restoreBtn").addClass('show');
         }


        if(knowledgedocuments.selectedNodePath == "/root")
         {
              $('#knowledgedocuments_4 td:nth-child(1),th:nth-child(1)').hide();
         }
         else if(knowledgedocuments.selectedNodePath == ""){

             $('#knowledgedocuments_4 td:nth-child(1),th:nth-child(1)').hide();
         }
         else
         {
              $('#knowledgedocuments_4 td:nth-child(1),th:nth-child(1)').show();
         }

    },

     /**
     * reqDataForChildNodes - Display Data in Table and Jstree child Nodes.   
     */  
    reqDataForChildNodes: function(data) {


        if (ISEUtils.validateObject(data)) {

           
            var childNodeInfo = [];

            console.log(data.length)


            for (var index in data) {


                childNodeInfo.push(data[index]);
             

                var documentType = data[index]["type"];
				if(!documentType)
					documentType = "file";
                if(documentType.toLowerCase() != "file"){

                  $('div#documentsjstree').jstree().delete_node(data[index].documentId);
                  $('div#documentsjstree').jstree().create_node(knowledgedocuments.selectedNodeID, {
                        "text": data[index].name,
                        "id" : data[index].documentId,
                        "icon": "fa fa-folder icon-state-success",
                        "type":"folder"
                        }, "last", false);
                }

               
          }
        
            knowledgedocuments.assignDataToTable(childNodeInfo);

        } else {

            $('#tableBody').html('No data available in table');
         
        }



        ISEUtils.portletUnblocking("pageContainer");
    },

    
     /**
     * onSubmitClickForDocument - Create or Rename Document when we click on submit button   
     */
    onSubmitClickForDocument: function() {
	
        var uniqueID = Math.floor( Math.random() * 1000 ) + Date.now();
		console.log(" knowledgedocuments.onSubmitClickForDocument() uniqueID =================  "+ uniqueID);
       if(knowledgedocuments.isRenameDcoument)
        knowledgedocuments._createOrRenameDocument(knowledgedocuments.requiredForRenameDocumentID); 
      else
        knowledgedocuments._createOrRenameDocument(uniqueID);       
		
    },

    /**
     * _createOrRenameDocument - Create or Rename Document Elastic Search Call
     */
    _createOrRenameDocument:function(documentId){
	
		console.log(" _createOrRenameDocument   documentId =================  "+ documentId);
		
        knowledgedocuments.docData = new Object();
		
        knowledgedocuments.docData.parent = knowledgedocuments.selectedNodePath;
		knowledgedocuments.docData.documentcontent = '';//knowledgedocuments.encryptedFileptah;
		knowledgedocuments.docData.fileName = escape(document.getElementById("file1").value.split('\\').pop());
        knowledgedocuments.docData.documentId = ""+documentId; 
		knowledgedocuments.documentId = ""+documentId; 
		
        $.each(knowledgedocuments.documentviewoptions, function(key, item) {       

            if (item.control == "label"){
                knowledgedocuments.docData[item.SourceName] = $('#kt_modal_' + item.SourceName).text();
				}
            else if (item.control == "textinput" || item.control == "textarea" || item.control == "attachment"){
                knowledgedocuments.docData[item.SourceName] = $('#kt_modal_' + item.SourceName).val();
				}
            else if(item.control == "date"){
                if($.trim($('#kt_modal_' + item.SourceName).val()) != '' || $('#kt_modal_' + item.SourceName).val() != undefined)
                  {
                     var  dateString = $('#kt_modal_' + item.SourceName).val();
                     if(dateString !=''){
                       var date = new Date(dateString);
                           date.toISOString();
                       knowledgedocuments.docData[item.SourceName] = date;
                   }
                  }                  
            }

        });
		 
		 $("#documentinfoModal").modal("hide");
		 console.log("knowledgedocuments.docData.type : " + knowledgedocuments.docData.type);
		 
		 
		 ISE.CreateDocEntryMongo(knowledgedocuments.docData, knowledgedocuments._createDocEntryMongoCallback);
		 if(knowledgedocuments.docData.type == "folder") {
			 ISE.CreateDocEntry(knowledgedocuments.docData, knowledgedocuments._CreateDocEntryForFolderCallback);	
		 }else if(knowledgedocuments.docData.type == "file"){
			 ISE.CreateDocEntry(knowledgedocuments.docData, knowledgedocuments._CreateDocEntryForFolderCallback);	
			 knowledgedocuments.uploadFile(true);//true: if u want to do indexing in elastic search else false 
			 
		 }
		
         knowledgedocuments.isRenameDcoument = false;
		$('#file1').next().val('');
		//$('#file2').next().val('');
		knowledgedocuments.documentId = ""; 
		knowledgedocuments.dataFromRemoteFile = "";
       
		
		
    },
	_CreateDocEntryForFolderCallback: function() {
		//console.log("Inside _UpdateDocEntryCallback :    ")
	},
	_createDocEntryMongoCallback: function() {
	//ISE.CreateDocEntryMongo does not return any response
	},
	
     /**
     * _contextSearchInputKeyUpFunc - Search Functionality in Table
     */
    _contextSearchInputKeyUpFunc: function() {  


     
        ISEUtils.portletBlocking("pageContainer");
        var requestObject = new Object();
        requestObject.collectionName = knowledgedocuments.documentIndexCollection;
        requestObject.searchString = $('#contextSearchInput').val();
        requestObject.projectName = knowledgedocuments.projectName;
        requestObject.maxResults = 100;
        ISE.getContextSearchDocsResults(requestObject, knowledgedocuments.receivedSearchDocResults)


    },

     /**
       * _onSelectedFolderInTable - Click Document folder in Table
     */
    _onSelectedFolderInTable:function(event){

      var parentInfo = $(event).attr("parentInfo"); 
      var parentId= unescape(parentInfo);      

        ISEUtils.portletBlocking("pageContainer");

        var requestObject = new Object();
        requestObject.collectionName = knowledgedocuments.documentIndexCollection
        requestObject.searchString = "parent:\"" + parentId + "\"";
        requestObject.projectName = knowledgedocuments.projectName;
        requestObject.maxResults = 100;
        ISE.getSearchDocsResults(requestObject, knowledgedocuments.reqDataForChildNodes);

    },

    /**
     * _editDocumentFolder :  Edit/Update Document Folder Functionality
     */  
    _editDocumentFolder:function(){

        var requestObject = new Object();
        requestObject.collectionName = knowledgedocuments.documentIndexCollection
        requestObject.searchString = "documentId:" + knowledgedocuments.selectedDocumentId;
        requestObject.projectName = knowledgedocuments.projectName;
        requestObject.maxResults = 1;
        ISE.getSearchDocsResults(requestObject, knowledgedocuments._receivedSelectedDocumentContent);

   },

    /**
     * _renameDocument1 :  Edit/Update Document File Functionality
     */      
      _renameDocument1:function(event){

        knowledgedocuments.encryptedFileptah = '';
        var documentID = $(event).attr('documentID');
        var requestObject = new Object();
        requestObject.collectionName = knowledgedocuments.documentIndexCollection
        requestObject.searchString = "_id:" + documentID;
        requestObject.projectName = knowledgedocuments.projectName;
        requestObject.maxResults = 1;
        ISE.getSearchDocsResults(requestObject, knowledgedocuments._receivedSelectedDocumentContent);  

   },

    /**
     * _receivedSelectedDocumentContent : Display Document information in popup window to update
     * This function will be triggered from _renameDocument1() and _editDocumentFolder()
     */ 
   _receivedSelectedDocumentContent:function(data){

      
       if(ISEUtils.validateObject(data))
       {

       $("#moreInfoModalTitle").text("Parent :" + knowledgedocuments.selectedNodePath);
        knowledgedocuments.isRenameDcoument = true;

        knowledgedocuments.requiredForRenameDocumentID =  data[0]._id;

              var documentType = data[0].type;

				if(!documentType)
					documentType = "file";
              $("#kt_modal_type").text(documentType);

                  if(documentType.toLowerCase() == "folder")
                  {
                     $('.input-group').closest( ".form-group" ).addClass("hide");
                  }
                  else{
                       $('.input-group').closest( ".form-group" ).removeClass("hide");
                  }


                    $.each(data[0], function(key, item) {                       

                       if(document.getElementById("kt_modal_"+key) !== null)
                        {
                             $('#kt_modal_'+key).val(item);
                             console.log(item);
                        } 
                      }) 

                    $("#documentinfoModal").modal("show");

                }               
 
    },

    /**
     * _DeleteDocument1 :  Delete Document File Functionality
     */  
   
   _DeleteDocument1:function(event){


      var documentID = $(event).attr('documentID');
       var requestObject = new Object();
        requestObject.collectionName = knowledgedocuments.documentIndexCollection
        requestObject.searchString = "_id:" + documentID;
        requestObject.projectName = knowledgedocuments.projectName;
        requestObject.maxResults = 1;
        ISE.getSearchDocsResults(requestObject, knowledgedocuments._receivedDocumentInfoForDelete);

   },

   /**
     * _receivedDocumentInfoForDelete :  Received Selected Document Information for delete
     */ 
   _receivedDocumentInfoForDelete:function(data){

     
        if(data[0].type == "file"){

         var docData = new Object(); 
          docData.documentId = data[0]._id;
         

          if(typeof data[0].expiryDate == "undefined"){

            var date=new Date();
            docData.expiryDate = date.toISOString();
           ISE.addExpiryDateForDeleteDocument(docData, knowledgedocuments._refreshTableInformation);
          }else{

            var date=new Date();
            docData.expiryDate = date.toISOString();
           ISE.editExpiryDateForDeleteDocument(docData, knowledgedocuments._refreshTableInformation);

          }
            
           
       }
      
   },

    
    /**
     * _restoreAllSelectedDocuments :  Restore All the documents
     */
     _restoreAllSelectedDocuments:function(){

     if(knowledgedocuments.restoreDocumentIDCollection.length > 0){

        var date=new Date();
        var day=date.getDate();
        var month = date.getMonth()+1;
        var year = date.getFullYear()+1;
          
        var str = year+'-'+month+"-"+day;
        var newDate =new Date(str); 

        var restoreCount = 0; 

        for(var i=0;i<knowledgedocuments.restoreDocumentIDCollection.length;i++){

            restoreCount = restoreCount+1;         
            var docData = new Object(); 
            docData.documentId = knowledgedocuments.restoreDocumentIDCollection[i];
            docData.expiryDate = newDate.toISOString();
            ISE.editExpiryDateForDeleteDocument(docData,knowledgedocuments._refreshTableInformation); 

        }

     }
   }, 

    /**
     * _EmptyRecyleBinDocuments : To Get All the Recylcebin documents from elastic search call.
     * (Only Admin have the Permissions to access this feature)
     */  
   _EmptyRecyleBinDocuments:function(){

        var dateObj = new Date();
        var crossedDate = "* TO "+ dateObj.toISOString();
        var requestObject = new Object();
        requestObject.collectionName = knowledgedocuments.documentIndexCollection
        requestObject.projectName = knowledgedocuments.projectName;
        requestObject.maxResults = 100;
         requestObject.searchString = " expiryDate : [ "+ crossedDate + "] ";
        ISE.getSearchDocsResults(requestObject, knowledgedocuments._reqforDeleteDocumentfromIndex);

   },

    /**
     * _reqforDeleteDocumentfromIndex : Delete the documents from Recylebin(Only Admin have the Permissions)
     */  
   _reqforDeleteDocumentfromIndex:function(data){


     if (ISEUtils.validateObject(data)) {
           
            for (var index in data){
                var docData = new Object(); 
                docData.documentId = data[index]._id;
                ISE.deleteDocumentFromIndex(docData,knowledgedocuments._refreshTableInformation);

           } 
      }        

   },

    /**
     * _refreshTableInformation : Refresh the Table Information when Jstree Node is selected.
     */   
   _refreshTableInformation:function(){

     ISEUtils.portletBlocking("pageContainer");   


    if(knowledgedocuments.selectedNodePath == "/root/RecyleBin")
   {
       var dateObj = new Date();
       var crossedDate = "* TO "+ dateObj.toISOString();
         

       var requestObject = new Object();
        requestObject.collectionName = knowledgedocuments.documentIndexCollection
        requestObject.projectName = knowledgedocuments.projectName;
        requestObject.maxResults = 100;
         requestObject.searchString = " expiryDate : [ "+ crossedDate + "] ";
        ISE.getSearchDocsResults(requestObject, knowledgedocuments.reqDataForChildNodes);
   }
   else{

        var date = new Date();
        var searchDate = date.toISOString() +"  TO  * ";

        var requestObject = new Object();
        requestObject.collectionName = knowledgedocuments.documentIndexCollection
        requestObject.projectName = knowledgedocuments.projectName;
        requestObject.maxResults = 100;       
       // requestObject.searchString = "parent:\"" + knowledgedocuments.selectedNodePath + "\"" + " AND (_missing_:expiryDate OR expiryDate : [ " + searchDate + "]) ";
         requestObject.searchString = "parent:\"" + knowledgedocuments.selectedNodePath + "\"";
		ISE.getSearchDocsResults(requestObject, knowledgedocuments.reqDataForChildNodes);
    }

   },

   


    /*****************************************************************************************************************
     ************************************ Below are the Utility functions to support above functionality *************    
     ******************************************************************************************************************/

 _checkForRestoreDocument:function(event){

       var documentId = $(event).attr("id").toString();

       if($(event).is(":checked"))
       {
          knowledgedocuments.restoreDocumentIDCollection.push(documentId);
       }
       else
       {
          knowledgedocuments.restoreDocumentIDCollection.splice(knowledgedocuments.restoreDocumentIDCollection.indexOf(documentId),1);
       }      

   },

     _getExpiryDate:function(){

    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear() + 1;
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();

    var expiryDate = month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":"+ seconds;
    return expiryDate;
   },

    uploadAttachments: function(event) {

       //document.getElementById("file1").click();
		$(event).parent().find('input[type=file]').click();
    },

    _ondownloadFileButtonClick:function(event) {   


       var requestObject = new Object();
        requestObject.collectionName = knowledgedocuments.documentIndexCollection
        requestObject.searchString = "documentId:" + unescape($(event).attr("documentID"));
        requestObject.projectName = knowledgedocuments.projectName;
        requestObject.maxResults = 100;

        ISE.getFileContentsforDownloadFile(requestObject, knowledgedocuments._receivedDwondloadFileContents);

    },

    _receivedDwondloadFileContents: function(data) {

        if (ISEUtils.validateObject(data)) {

            var tempArray = data;
            var fileName = tempArray[0].fileName;
            //console.log(fileName)
            var fileContents = tempArray[0].documentcontent;

            var documentlink = document.createElement('a');
            documentlink.download = fileName;
            documentlink.href = 'data:application/octet-stream;base64,' + fileContents;
            documentlink.click();

        }


    },
    

    uiGetParents: function(loSelectedNode) {
        try {
            var loData = [];
            var lnLevel = loSelectedNode.node.parents.length;
            var lsSelectedID = loSelectedNode.node.id;

            var loParent = $("#" + lsSelectedID);
            var lsParents = loSelectedNode.node.text + ' >';
            loData.push(loSelectedNode.node.text);
            for (var ln = 0; ln <= lnLevel - 1; ln++) {
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
        } catch (err) {
            console.log('Error in uiGetParents');
        }
    },

    _getIconNameforFileExtension:function(fileExtension){

     

      var iconName = 'images/';

      if(fileExtension.toLowerCase() == "pdf" )
         iconName += 'pdf.png';
       else if(fileExtension.toLowerCase() == "txt" )
        iconName += 'txt.png';
       else if(fileExtension.toLowerCase() == "xls"  || fileExtension.toLowerCase() == "xlsx")
        iconName += 'xls.png';
       else if(fileExtension.toLowerCase() == "doc" || fileExtension.toLowerCase() == "docx" )
        iconName += 'doc.png';
       else if(fileExtension.toLowerCase() == "html" )
        iconName += 'html.png';
        else if(fileExtension.toLowerCase() == "zip" )
        iconName += 'zip.png';
       else if(fileExtension.toLowerCase() == "log" )
        iconName += 'log.png';
        else if(fileExtension.toLowerCase() == "png" )
        iconName += 'png.png';
        else if(fileExtension.toLowerCase() == "jpg" )
        iconName += 'jpg.png';
        else //if(iconName.toLowerCase == "html")
        iconName += 'warningicon.png';

     return iconName;

    },

    customMenu: function(node) {

        var items = {
            "AddFolder": {
                "label": "Add Folder",
                "icon": "glyphicon glyphicon-plus",        
                "action": function() {

                    knowledgedocuments.isRenameDcoument = false;

                    $("#moreInfoModalTitle").text("Parent :" + knowledgedocuments.selectedNodePath);
                    $("#kt_modal_type").text("folder");
                    var div = document.getElementById("ktmodalbody");
                    $(div).find('input:text, input:password, input:file, select, textarea')
                            .each(function() {
                                $(this).val('');
                            }); 

                    $('.input-group').closest( ".form-group" ).addClass("hide");
                    $("#documentinfoModal").modal("show");
                }
            },
            "AddFile": {
                "label": "Add File",
                "icon": "icon-doc",        
                "action": function() {

                     knowledgedocuments.isRenameDcoument = false;

                    $("#moreInfoModalTitle").text("Parent :" + knowledgedocuments.selectedNodePath);
                    $("#kt_modal_type").text("file");
                     var div = document.getElementById("ktmodalbody");
                    $(div).find('input:text, input:password, input:file, select, textarea')
                            .each(function() {
                                $(this).val('');
                            }); 

                    $('.input-group').closest( ".form-group" ).removeClass("hide");
                    $("#documentinfoModal").modal("show");
                }
            },
            "Rename": {
                "label": "Rename",
                "icon": "glyphicon glyphicon-pencil",
                "action": function() {

                 knowledgedocuments._editDocumentFolder();

                }
            },
           
           
            "Empty": {
                "label": "Empty",
                "icon": "glyphicon glyphicon-trash",               
                "action": function() {

                    knowledgedocuments._EmptyRecyleBinDocuments();

                                      
                }
            }



        };

        if ($(node).attr('icon') == "fa fa-folder icon-state-success") {
            delete items.Delete; 
            delete items.Restore; 
            delete items.Empty;        
        }
        else if($(node).attr('icon') == "fa fa-folder glyphicon glyphicon-trash"){

               delete items.AddFolder;
               delete items.AddFile;
               delete items.Rename;
               delete items.Delete; 
               delete items.Restore; 

             var roleName = localStorage.getItem('rolename');
            if(roleName.toLowerCase() != "admin")
                 delete items.Empty; 
               

        }
        else{            

            var nodePath = knowledgedocuments.selectedNodePath.split('/')

             if(knowledgedocuments.selectedNodePath == "/root"){
                  
                             
               delete items.AddFile;
               delete items.Rename;
               delete items.Delete; 
               delete items.Empty; 
               delete items.Empty; 
               delete items.Restore;      

            }
           else if(nodePath[2].toLowerCase() == "recylebin"){

               delete items.AddFolder;
               delete items.AddFile;
               delete items.Rename;
               delete items.Delete; 
               delete items.Empty;            

            }
            else{

                delete items.AddFolder;
                delete items.AddFile;
                delete items.Empty; 
                delete items.Restore; 
                
            } 
         

        }        


        return items;
    },

     onResizeWindow: function() {

        var windowWidth = $(window).width();

        var iTD = '#knowledgedocuments_4';
        var table = $(iTD).DataTable();

        if (windowWidth <= 400) {

            var matchedCols = [];

            var cols = [];
            cols = knowledgedocuments.columnsList;

            for (var k = 0; k < knowledgedocuments.mobileViewTableColumnCollection.length; k++) {
                var columnName = knowledgedocuments.mobileViewTableColumnCollection[k];
                var colIndex = jQuery.inArray(columnName, cols);
                matchedCols.push(colIndex);
            }



            for (var l = 1; l < cols.length; l++) {
                table.column(l).visible(false, false);
            }

            for (var k = 0; k < matchedCols.length; k++) {

                table.column(matchedCols[k]).visible(true, false);
            }


        } else {


            knowledgedocuments.hideTableColumns();


        }


    },

    hideTableColumns: function() {

      
        var elements = document.querySelectorAll('#treegrid_4_column_toggler label input:checked');
        var selectedColumnsList = new Array();
        Array.prototype.map.call(elements, function(el, i) {

            var iCol = parseInt($(el).attr("data-column"));
            selectedColumnsList.push(iCol)

        });


        var cols = [];
        cols = knowledgedocuments.columnsList;       

       for (var i = 1; i <= cols.length; i++) {

            var columnIndex = i+1;          
         $('#knowledgedocuments_4 td:nth-child('+columnIndex+'),th:nth-child('+columnIndex+')').hide();
           
        }
       
        for (var k = 0; k < selectedColumnsList.length; k++) {
          
               var columnIndex = selectedColumnsList[k]+1; 
            $('#knowledgedocuments_4 td:nth-child('+columnIndex+'),th:nth-child('+columnIndex+')').show();
            
       }
    },
	
	readUploadedFileContents: function(event) {

		var input = event.target;	
        var reader = new FileReader();
		reader.readAsBinaryString(input.files[0]);
        reader.onload = function(){
        //var binaryString = reader.result;		  
        //knowledgedocuments.encryptedFileptah = btoa(binaryString);
		knowledgedocuments.encryptedFileptah = reader.result;	
		  
        };	
	},
	 uploadFile:function(isIndex) { 
	 
		console.log("Inside knowledgedocuments.uploadFile() ");
		
		var sampleFile = document.getElementById("file1").files[0];
		//var sampleFile2 = document.getElementById("file2").files[0];
		var formData = new FormData();
		
		
		 formData.append("file", sampleFile);
		 //formData.append("file", sampleFile2);
       
		$.ajax({
		   //url : '../DevTest/FileServer/upload',
		  url : 'http://localhost/DevTest/FileServer/upload',
		   type : 'POST',
		   data : formData,
		   async: false,
		   processData: false, 
		   contentType: false, 
		   success : function(data) {
			   if(isIndex) knowledgedocuments.createIndexInElasticSearch();
		   }
		});
		
    },
	createIndexInElasticSearch:function(){
	
		 console.log("Inside knowledgedocuments.createIndexInElasticSearch ");
		 
		 var fileName = $('#file1')[0].files[0].name ;
		 var fileExtension = fileName.split('.').pop();
		 var documentId =""+knowledgedocuments.documentId;
		 var doOCR = "false"; if(fileExtension == "pdf" || fileExtension == "png" || fileExtension == "jpg") doOCR = "true";
		 var parent = knowledgedocuments.selectedNodePath;
		 var published_at = new Date().toISOString();
		 var elasticearchHost = iseConstants.elasticsearchHost;
		 console.log("elasticearchHost =============== "+ elasticearchHost);
		 var collection = iseConstants.str_docs_collection;
         var role = localStorage.getItem('rolename');
		 var urlPath = window.location.pathname  + window.location.hash;
		 var type = "";
		 var url = "";
		 var title = ""
		 var description = "";
		 var documentcontent="";
		 
		//var json_Data = { username : sessionStorage.getItem('username'),fileName : fileName, projectName : localStorage.projectName, doOCR : doOCR, documentId : documentId, parent: parent, published_at : published_at, role : role, urlPath : urlPath, collection: collection, elasticearchHost : elasticearchHost, type : type, url : url, title : title, description: description};
		var downloadURL = "http://localhost/DevTest/FileServer/download/"+fileName; //this should not be hard coded get from href path or constants
		var json_Data = { username : sessionStorage.getItem('username'),fileName : fileName, downloadURL : downloadURL, projectName : localStorage.projectName, doOCR : doOCR, documentId : documentId, parent: parent, published_at : published_at, role : role, urlPath : urlPath, collection: collection, elasticearchHost : elasticearchHost, type : type, url : url, title : title, description: description};
		var serviceName='JscriptWS'; 
		var methodname = "urlindexing";
		var hostUrl = '/DevTest/rest/';
		var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&sname='+methodname;
				
		$.ajax({
				type: "POST",
				url: Url,
				async: true,
				data: JSON.stringify(json_Data),
				success: function(msg) {
					
					 //test=JSON.parse(msg);					
					 console.log(msg); 					 
				},
				error: function(msg) {
					 console.log("Failure in knowledgedocuments.indexUrl().");
				}			
		});
	
	 },
	
	 loadFileContentsFromRemote:function(url){
				console.log("Inside _loadFileContentsFromRemote ");
			$.ajax({ type : 'GET', dataType:'text', async: false, url : url,
				success : function(result) {
				console.log(result);
				knowledgedocuments.dataFromRemoteFile = result;
				},
				error: function(msg) {
				 console.log("failure: Ajax call in knowledgedocuments.loadFileContentsFromRemote() failed ");
			}
			} );
	 
	 }
	
		
	
	
	
  /******************************************************************************************************************************
  ************************************************End Utility Functions *********************************************************
  *******************************************************************************************************************************/

};
