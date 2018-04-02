var folderstracture = "D:/Test/";	//Hard coded...need to edit the path
var editor;
var addEditFlag;
var ruleManagement = {
	isNewRow:false,
	resultsData:{},
	resultsRulesJsData:{},
	orglist:{},
	response:{},
	editorModifiedContent:'',
	savebotjsjson:'',
	list : new Array(),
	updatelist :new Array(),
	viwBtnEditor : '',

    init: function(){
		//ruleManagement._setOtableToTable();
		ruleManagement._getRulesList();
		
		
		
		$("#editBotModal #saveBotJS").on("click",function(){
			//alert("Saved.");
			ruleManagement.savebotjsjson = "";			
			var editorModifiedvalue = editor.getValue();
			ruleManagement.editorModifiedContent =editorModifiedvalue; 
			
			$(ruleManagement.viwBtnEditor).parent().attr("value",ruleManagement.editorModifiedContent);
			//editorModifiedContent = editorModifiedvalue;//koti---for sending editor getting value
			ruleManagement.savebotjsjson = '{\"path\":\"'+folderstracture+'\",\"data\":\"'+escape(editorModifiedvalue)+'\"}';
			//$("#editBotModal").modal('hide');
		});
		
		$("#editBotModal #closeBotJSModal").on("click", function(e){
			$("#editBotModal").modal('hide');
		});
	},
	
								
	_setOtableToTable:function(){

		var table = $('#sample_editable_user_rule');
        var oTable = table.dataTable({
            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
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

        $('#sample_editable_user_new_rule').click(function (e) {
		
		ruleManagement.editorModifiedContent="";//koti
		addEditFlag="add";
            e.preventDefault();
			
            if (nNew && nEditing) {
                if (confirm("Previose row not saved. Do you want to save it ?")) {
                    ruleManagement.saveRow(oTable, nEditing); // save
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

            var aiNew = oTable.fnAddData(['', '', '', '', '', '','',]);
            var nRow = oTable.fnGetNodes(aiNew[0]);
            ruleManagement.editRow(oTable, nRow);
            nEditing = nRow;
            nNew = true;

            if(nNew){

            	ruleManagement.isNewRow = true;
            }
        });

        table.on('click', '.delete', function (e) {
            e.preventDefault();

            if (confirm("Are you sure to delete this row ?") == false) {
                return;
            }

            var nRow = $(this).parents('tr')[0];
            ruleManagement._deleteInformation(nRow);
            oTable.fnDeleteRow(nRow);           
           // alert("Deleted! Do not forget to do some ajax to sync with backend :)");
        });

        table.on('click', '.cancel', function (e) {
            e.preventDefault();
            if (nNew) {
                oTable.fnDeleteRow(nEditing);
                nEditing = null;
                nNew = false;
            } else {
                ruleManagement.restoreRow(oTable, nEditing);
                nEditing = null;
            }
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();
			addEditFlag="edit";

            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];

            if (nEditing !== null && nEditing != nRow) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                ruleManagement.restoreRow(oTable, nEditing);
                ruleManagement.editRow(oTable, nRow);
                nEditing = nRow;
            } else if (nEditing == nRow && this.innerHTML == "Save") {
				// Start bhavani Added for view the data
				var newID = $(e.target).closest("tr").find("td:first-child input").val();
				var isIdExist = false;
				$(e.target).closest("tr").siblings().each(function(){
				if(newID.toLowerCase()==$(this).find("td:first-child").text().toLowerCase()){
				  isIdExist = true;
				}

				});


				if(isIdExist){
				alert("Data entered already exists");
				retrun;
				}
				else{
                    /* Editing this row and want to save it */
				if($(e.target).parent().prev().attr("value"))
				ruleManagement.editorModifiedContent=$(e.target).parent().prev().attr("value");
                ruleManagement.saveRow(oTable, nEditing);
                 // "Updating information to backend
                ruleManagement._updateInformation(nEditing);
                nEditing = null;  
				//added by Bhavani
				nNew=false;	
				
				}
				//End bhavani Added for view the data
                			              
            } else {
                /* No edit in progress - let's start one */
                ruleManagement.editRow(oTable, nRow);
				
				nEditing = nRow;
				
            }
        });


	},
		
	restoreRow:function(oTable, nRow) {
		var aData = oTable.fnGetData(nRow);
		var jqTds = $('>td', nRow);

		for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
			oTable.fnUpdate(aData[i], nRow, i, false);
		}

		oTable.fnDraw();
	},
		
	loadJSWorkSpace:function(element){
		//  javascript editor launch;
		editor = ace.edit("editJSBot");
		editor.setTheme("ace/theme/tomorrow_night_eighties");
		editor.session.setMode("ace/mode/javascript");
		editor.session.setOptions({ tabSize: 2, useSoftTabs: true });
			
		if(addEditFlag=="edit"){
			try{
				editor.setValue(unescape(JSON.parse(element.parentElement.getAttribute("value")).data));
			}catch(e){
				editor.setValue(unescape(element.parentElement.getAttribute("value")));			
			}			
		}
		else{
			//editor.setValue( "" );
			//editor.setValue( ruleManagement.editorModifiedContent);//koti
			var tmpValTab = element.parentElement.getAttribute("value");
			if(tmpValTab){
				  try{				
					editor.setValue(unescape(JSON.parse(tmpValTab).data));							
			    }catch(e){
				    editor.setValue(unescape(element.parentElement.getAttribute("value")));			
			     }
			}else{
				editor.setValue(ruleManagement.editorModifiedContent);
			}			
		}
		ruleManagement.viwBtnEditor = element;
		$("#saveBotJS").show();
		$("#editBotModal").modal("show");
		editor = ace.edit("editJSBot");
		editor.setTheme("ace/theme/tomorrow_night_eighties");
		editor.session.setMode("ace/mode/javascript");
		editor.session.setOptions({ tabSize: 2, useSoftTabs: true });		
		addEditFlag="";
	},
		
		
	loadJSWorkSpaceReadOnly:function(element){
		
	   //alert("--223---"+JSON.parse(element.parentElement.getAttribute("value")).data);
		editor = ace.edit("editJSBot");
		editor.setTheme("ace/theme/tomorrow_night_eighties");
		editor.session.setMode("ace/mode/javascript");
		editor.session.setOptions({ tabSize: 2, useSoftTabs: true });
		try{
			editor.setValue(unescape(JSON.parse(element.parentElement.getAttribute("value")).data));
		}catch(e){
			editor.setValue(unescape(element.parentElement.getAttribute("value")));
		}
		
		
		//#$("#editJSBot").attr('readonly', 'readonly');
		$("#editBotModal").modal("show");
		editor = ace.edit("editJSBot");
		editor.setTheme("ace/theme/tomorrow_night_eighties");
		editor.session.setMode("ace/mode/javascript");
		ruleManagement.viwBtnEditor = element;
		
		$("#saveBotJS").hide();
		$("#editBotModal #closeBotJSModal").on("click", function(e){
			$("#editBotModal").modal('hide');
		});
	
	
	},
		
		
	editRow:function(oTable, nRow) {
		var aData = oTable.fnGetData(nRow);
		var jqTds = $('>td', nRow);
		if($(nRow).find("td:first-child").text().length>0){
			jqTds[0].innerHTML = "<input disabled type='text' class='form-control input-small' value='" + aData[0] + "'>";
		}else{
			jqTds[0].innerHTML = "<input type='text' class='form-control input-small' value='" + aData[0] + "'>";
		}		
		jqTds[1].innerHTML = "<input type='text' class='form-control input-small' value='" + aData[1] + "'>";
		jqTds[2].innerHTML = "<input type='text' class='form-control input-small' value='" + aData[2] + "'>";
		jqTds[3].innerHTML = "<input type='text' class='form-control input-small' value='" + aData[3] + "'>";
		jqTds[4].innerHTML = "";
		jqTds[4].innerHTML = "<input id='ruleJavaScript' type='button' onclick='ruleManagement.loadJSWorkSpace(this)' style='background-color:#1c7d74;color:#fff;border-color: #1c7d74' value='View'>";
		jqTds[5].innerHTML = '<a class="edit" href="">Save</a>';
		jqTds[6].innerHTML = '<a class="cancel" href="">Cancel</a>';            
	},

	saveRow:function(oTable, nRow) {
		var jqInputs = $('input', nRow);
		oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
		oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
		oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
		oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
		oTable.fnUpdate(jqInputs[4].value, nRow, 4, false);
		$(nRow).find("td")[4].setAttribute("value",ruleManagement.editorModifiedContent);
		//add bhavani
		oTable.fnUpdate('<input type="button" title="Click on edit" style="width: 45px;height:22px" value="View" onclick="ruleManagement.loadJSWorkSpaceReadOnly(this)">', nRow, 4, false);
		oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 5, false);
		oTable.fnUpdate('<a class="delete" href="">Delete</a>', nRow, 6, false);
		oTable.fnDraw();
		
		
		
		
	},

	cancelEditRow:function(oTable, nRow) {
		var jqInputs = $('input', nRow);
		oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
		oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
		oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
		oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
		oTable.fnUpdate(jqInputs[4].value, nRow, 4, false);
		oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 5, false);
		oTable.fnDraw();
	},
		
	//For Save or Update Rule Data.
	_updateInformation:function(editfeatureInformation){
		if(ruleManagement.isNewRow){
			var id =  $(editfeatureInformation).find("td").eq(0).html(); 
			var tag =  $(editfeatureInformation).find("td").eq(1).html(); 
			var author =  localStorage.getItem('username');
			var ruleName =  $(editfeatureInformation).find("td").eq(2).html(); 
			var shortDesc =  $(editfeatureInformation).find("td").eq(3).html(); 
			var createDate =  new Date().toString();
			var updateDate =  new Date().toString();
			var projName =  localStorage.projectName;
			var orgName =  sessionStorage.getItem('organization');
			var rule = ruleManagement.savebotjsjson
			var ruleJSContent = ruleManagement.editorModifiedContent;
		
		
			if(id == undefined || id == null || id =='') 
			{
				alert('Id is Mandatory')
				ruleManagement._getRulesList();
			}
			else if(tag == undefined || tag == null || tag =='')
			{
				alert('Tag is Mandatory')
				ruleManagement._getRulesList();
			}
			else if(ruleName == undefined || ruleName == null || ruleName =='')
			{
				alert('RuleName is Mandatory')
				ruleManagement._getRulesList();
			}
			
			else{
				var json_Data = {username: localStorage.getItem('username'),"_id":id,"tag":tag,"author":author,"ruleName":ruleName,"shortDesc":shortDesc,"createDate":createDate,"updateDate":updateDate,"projName":projName,"orgName":orgName,"rule":rule,"ruleJSContent":ruleJSContent,"operation":"add"}
				//console.log("--input json Data--->"+json_Data.toString());
				//console.log("--input json Data-******-->"+JSON.stringify(json_Data));
				localStorage.setItem('isnewuser', 'false');
				ruleManagement._genericServiceCall('ruleManagement',json_Data,'add')
				ruleManagement.isNewRow = false;
			}
		}
		
		else
		{
			var id =  $(editfeatureInformation).find("td").eq(0).html(); 
			var tag =  $(editfeatureInformation).find("td").eq(1).html(); 
			var author =  localStorage.getItem('username');			
			var ruleName =  $(editfeatureInformation).find("td").eq(2).html(); 
			var shortDesc =  $(editfeatureInformation).find("td").eq(3).html(); 
			var createDate =  new Date().toString();
			var updateDate =  new Date().toString();
			var projName =  localStorage.projectName;
			var orgName =  sessionStorage.getItem('organization');
			var rule = ruleManagement.savebotjsjson;
			var ruleJSContent = ruleManagement.editorModifiedContent;
			
			if(tag == undefined || tag == null || tag =='')
			{
				alert('Tag is Mandatory')
				ruleManagement._getRulesList();
			}
			else if(ruleName == undefined || ruleName == null || ruleName =='')
			{
				alert('RuleName is Mandatory')
				ruleManagement._getRulesList();
			}
			
			else{
				var json_Data = {username: localStorage.getItem('username'),"_id":id,"tag":tag,"author":author,"ruleName":ruleName,"shortDesc":shortDesc,"createDate":createDate,"updateDate":updateDate,"projName":projName,"orgName":orgName,"rule":rule,"ruleJSContent":ruleJSContent,"operation":"update"}

				//console.log("--update json Data--->"+json_Data.toString());
				localStorage.setItem('isnewuser', 'false');
				ruleManagement._genericServiceCall('ruleManagement',json_Data,'update')
				ruleManagement.isNewRow = false;
			}
		}       	
	},
		
	//For Deleting a record
	_deleteInformation:function(deleterow)
	{
		var id =  $(deleterow).find("td").eq(0).html();  
		var tag =  $(deleterow).find("td").eq(1).html();
		var ruleName =  $(deleterow).find("td").eq(2).html();
		var json_Data = {username: localStorage.getItem('username'),"_id":id,"tag":tag,"ruleName":ruleName,"operation":"delete"}
		  
		ruleManagement._genericServiceCall('ruleManagement',json_Data,'delete');			 
	},
		
	//Rest service call for Add, Update, Delete operations.	
	_genericServiceCall:function(methodname,json_Data,operation)
	{	
		ruleManagement.response = {};
		var resultsData;
		var serviceName='JscriptWS'; 
		var hostUrl = '/DevTest/rest/';
		var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&sname='+methodname;
									
		$.ajax({
			type: "POST",
			url: Url,
			async: true,
			data: JSON.stringify(json_Data),
			success: function(msg) {
				if(methodname == 'ruleManagement') {
					ruleManagement.orglist = JSON.parse(msg);
				}
				console.log(JSON.parse(msg))
			},
			error: function(msg) {
				$("#sp").css("color", "red");
				$("#sp").text("\t File not modified.");
				console.log("failure");
			}
		
		});
								
	},

	//currently not using.
	_getRuleJsData:function(methodname,json_Data)
	{
		var serviceName='JscriptWS'; 
		var hostUrl = '/DevTest/rest/';
		var methodname = 'ruleManagement'
		var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + 
		localStorage.projectName+'&sname='+methodname;
		var html;						
		$.ajax({
			type: "POST",
			url: Url,
			async: true,
			data: JSON.stringify(json_Data),
			success: function(msg) {
				resultsRulesJsData = JSON.parse(msg);
				//console.log("---596****---"+resultsRulesJsData);
			},
			error: function(msg) {
				$("#sp").css("color", "red");
				$("#sp").text("\t File not modified.");
				console.log("failure");
			}
			
		});
	},
	
	
	//Fetching all records in table format.
	_getRulesList:function()
	{
	
		ruleManagement.list = new Array();
		$("usertablebody").empty();
		var jsondata = {username:localStorage.getItem('username'),projectName:localStorage.projectName,operation:'list'}
		var serviceName='JscriptWS'; 
		var hostUrl = '/DevTest/rest/';
		var methodname = 'ruleManagement'
		var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + 
		localStorage.projectName+'&sname='+methodname;
		var html;						
		$.ajax({
			type: "POST",
			url: Url,
			async: true,
			data: JSON.stringify(jsondata),
			success: function(msg) {
			resultsData = JSON.parse(msg);
			console.log("---510---"+resultsData);
			if(resultsData!=undefined && resultsData != '')
			{
				$('#usertablebody').empty();
				
				var data = resultsData.rulesData
				if(data!=undefined && data != ''){
				console.log("---516---"+data.length);
				for(var i=0; i<data.length; i++)
				{
					var id = data[i].id;
					var tag = data[i].tag;
					var ruleName = data[i].ruleName;
					var shortDesc = data[i].shortDesc;
					var createDate = data[i].createDate;
					var updateDate = data[i].updateDate;
					var rule = data[i].rule;
				
				
					if(id== null || id == undefined)	{
						id = ''
					}
					if(tag == null || tag == undefined)	{
						tag = ''
					}
					
					if(ruleName == null || ruleName == undefined)	{
						ruleName = ''
					}
					if(shortDesc == null || shortDesc == undefined)	{
						shortDesc = ''
					}
					if(createDate == null || createDate == undefined)	{
						createDate = ''
					}
					if(updateDate == null || updateDate == undefined)	{
						updateDate = ''
					}
					if(rule == null || rule == undefined)	{
						rule = ''
					}
					
					html = html+'<tr><td>'+id+'</td><td >'+data[i].tag+'</td><td >'+data[i].ruleName+'</td><td >'+data[i].shortDesc+"</td><td value='"+data[i].rule+"'><input type='button' title='Click on edit' style='width: 45px;height:22px' value='View' onclick='ruleManagement.loadJSWorkSpaceReadOnly(this)'/></td>"
					html += "<td><a class='edit' href='javascript:;''>Edit </a></td>";
					html += "<td><a class='delete' href='javascript:;''>Delete </a></td>";
				}
				}
				
				
			} 
				var oTable = $('#sample_editable_user').dataTable();
				oTable.off();
				$("#sample_editable_user_new_rule").unbind("click")
				oTable.fnClearTable();
				oTable.fnDestroy();
				$('#usertablebody').append(html);
				ruleManagement._setOtableToTable();
			},
			error: function(msg) {
				$("#sp").css("color", "red");
				$("#sp").text("\t File not modified.");
				console.log("failure");
			}
			
		});
	},

};
