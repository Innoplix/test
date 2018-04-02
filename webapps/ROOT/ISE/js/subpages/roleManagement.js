
 var roleManagement = {
isNewRow:false,
resultsData:{},
orglist:{},
response:{},
dropdownValue : '',
list :new Array(),
updatelist :new Array(),

      /* Init function  */
      init: function()
      {
		roleManagement._getRoleList()
		var json_Data = {username:localStorage.getItem('username'),operation:'list'};
		roleManagement._genericServiceCall('organisationManagement',json_Data);
		},
	
								
  _setOtableToTable:function(){

        	 var table = $('#sample_editable');

        var oTable = table.dataTable({

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

        $('#sample_editable_new').click(function (e) {
            e.preventDefault();
			
            if (nNew && nEditing) {
                if (confirm("Previose row not saved. Do you want to save it ?")) {
                    roleManagement.saveRow(oTable, nEditing); // save
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

            var aiNew = oTable.fnAddData(['', '', '', '', '','']);
            var nRow = oTable.fnGetNodes(aiNew[0]);
            roleManagement.editRow(oTable, nRow);
            nEditing = nRow;
            nNew = true;

            if(nNew){

            	roleManagement.isNewRow = true;
            }
        });

        table.on('click', '.delete', function (e) {
            e.preventDefault();

            if (confirm("Are you sure to delete this row ?") == false) {
                return;
            }

            var nRow = $(this).parents('tr')[0];
            roleManagement._deleteInformation(nRow);
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
                roleManagement.restoreRow(oTable, nEditing);
                nEditing = null;
            }
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();

            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];

            if (nEditing !== null && nEditing != nRow) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                roleManagement.restoreRow(oTable, nEditing);
                roleManagement.editRow(oTable, nRow);
                nEditing = nRow;
            } else if (nEditing == nRow && this.innerHTML == "Save") {
                /* Editing this row and want to save it */
                roleManagement.saveRow(oTable, nEditing);
                 // "Updating information to backend
                roleManagement._updateInformation(nEditing);
                nEditing = null;           
              

            } else {
                /* No edit in progress - let's start one */
                roleManagement.editRow(oTable, nRow);
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

         editRow:function(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);
            jqTds[0].innerHTML = "<input type='text' class='form-control input-small' value='" + aData[0] + "'>";
            jqTds[1].innerHTML = "<input type='text' class='form-control input-small' value='" + aData[1] + "'>";
			if(!(aData[0] == '' && aData[1]== '' && aData[2]== ''))
			{
			 jqTds[2].innerHTML = "<input type='text' disabled  class='form-control input-small' value='" + aData[2] + "'>";
			 jqTds[3].innerHTML = '<a class="edit" href="">Save</a>';
            jqTds[4].innerHTML = '<a class="cancel" href="">Cancel</a>';
			 }
			 else
			 {
			 jqTds[2].innerHTML = "<select class=select id = 'orglist' onclick=roleManagement._click()></select>"
				jqTds[3].innerHTML = '<a class="edit" href="">Save</a>';
            jqTds[4].innerHTML = '<a class="cancel" href="">Cancel</a>';
			
			console.log(roleManagement.orglist);
			
			 if(roleManagement.orglist !=undefined && roleManagement.orglist !=null && roleManagement.orglist.organizations !=undefined )
			 {
				var data = roleManagement.orglist.organizations
				for(var i=0; i<data.length;i++)
				{
					var selectid = document.getElementById('orglist');
				selectid.innerHTML += '<option value = '+data[i].organizationname+'>'+data[i].organizationname+'</option>';
				
				}
				roleManagement.dropdownValue = document.getElementById('orglist').value
			 }
				
			 }
            //jqTds[2].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[2] + '">';
            //jqTds[3].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[3] + '">';
            
        },

         saveRow:function(oTable, nRow) {
            var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
			if(roleManagement.isNewRow)
			{
			
			oTable.fnUpdate(roleManagement.dropdownValue , nRow, 2, false);
			/* var jqTds = $('select', nRow);
						
				var value = document.getElementById("orglist").value;
			 oTable.fnUpdate(value, nRow, 2, false); */
			 }
			 else
			 {
				oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
			 }
			 
            //oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
            //oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
            oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 3, false);
            oTable.fnUpdate('<a class="delete" href="">Delete</a>', nRow, 4, false);
            oTable.fnDraw();
        },

         cancelEditRow:function(oTable, nRow) {
            var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
			if(roleManagement.isNewRow)
			{
			
			oTable.fnUpdate(roleManagement.dropdownValue , nRow, 2, false);
			/* var jqTds = $('select', nRow);
						
				var value = document.getElementById("orglist").value;
			 oTable.fnUpdate(value, nRow, 2, false); */
			 }
			 else
			 {
				oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
			 }
			 
            //oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
            //oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
            oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 3, false);
            oTable.fnDraw();
        },
		_updateInformation:function(editfeatureInformation){

        	if(roleManagement.isNewRow){
        		
        	 var id = $(editfeatureInformation).attr("roleID"); 
			 // var roleid = id.split('_')[0]
			  //var orgid = id.split('_')[1]
			  //console.log("select"+document.getElementById('orglist').value)
			  //console.log("select"+$(editfeatureInformation).find("td").eq(2).html())
			  //alert(id)
			  var roleName =  $(editfeatureInformation).find("td").eq(0).html(); 
			  var Description =  $(editfeatureInformation).find("td").eq(1).html();
			   var orgName =  roleManagement.dropdownValue;
			   console.log(orgName)
			  
			if((roleName == undefined || roleName == null || roleName ==''))
			{
				alert('Role name is Mandatory')
				roleManagement._getRoleList();
			}
			else if((orgName == undefined || orgName == null || roleName ==''))
			{
				alert('Organization name is Mandatory')
				roleManagement._getRoleList();
			}
			else if(roleManagement.list.indexOf(roleName+'&|&'+orgName) > -1)
			{
				alert('Role Exists')
				roleManagement._getRoleList();
			}
			else
			{
			var json_Data = {username:localStorage.getItem('username'),organizationName:orgName,operation:'create',RoleName:roleName,Description:Description}
			  
			roleManagement._genericServiceCall('RoleManagement',json_Data,'add')
			roleManagement.isNewRow = false;
			//roleManagement._getRoleList();
			}
        	}
        	else
        	{
			  var id = $(editfeatureInformation).attr("roleID"); 
			  var roleid = id
			  //var orgid = id
			  //alert(id)
			  var roleName =  $(editfeatureInformation).find("td").eq(0).html(); 
			  var Description =  $(editfeatureInformation).find("td").eq(1).html();
			   var orgName =  $(editfeatureInformation).find("td").eq(2).html();
			   if((roleName == undefined || roleName == null || roleName ==''))
			   {
					alert('Role name is Mandatory')
					roleManagement._getRoleList();

			   }
			   else if(roleManagement.updatelist.indexOf(roleName+'&|&'+orgName+'&|&'+id) == -1)
				{
					alert('Role Exists')
					roleManagement._getRoleList();
				}
			   else
			   {
				var json_Data = {username:localStorage.getItem('username'),UidPk:roleid,operation:'update',RoleName:roleName,Description:Description}
				roleManagement._genericServiceCall('RoleManagement',json_Data,'update')
			  }
			  //roleManagement._getRoleList();
        	}       	
        	//roleManagement._getRoleList()
        },
		_deleteInformation:function(deleterow)
		{
			var id = $(deleterow).attr("roleID"); 
			  var roleid = id
			 var orgid = $(deleterow).find("td").eq(2).html();
			  var role =  $(deleterow).find("td").eq(0).html(); 
			  var Description =  $(deleterow).find("td").eq(1).html();
			  var json_Data = {username:localStorage.getItem('username'),operation:'delete',organizationName:orgid,RoleName:role}
			  roleManagement._genericServiceCall('RoleManagement',json_Data,'delete')
			 
			 
		},
	_genericServiceCall:function(methodname,json_Data,operation)
	{	
	roleManagement.response = {};
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
	if(methodname == 'organisationManagement')
	{
	roleManagement.orglist = JSON.parse(msg);
	}
	else
	{
		roleManagement.response = JSON.parse(msg);
		if(operation == 'delete')
		{
			 if(roleManagement.response !=undefined && roleManagement.response.result !=undefined)
			  {
				if(roleManagement.response.result != 'Success' && roleManagement.response.result != 													'fail')
				{
					alert(roleManagement.response.result)
					
				}
			  }
		}
		roleManagement._getRoleList();
		
	}
	console.log(JSON.parse(msg))
	},
	error: function(msg) {
		 //test=JSON.parse(msg);
		 $("#sp").css("color", "red");
		 $("#sp").text("\t File not modified.");
		 console.log("failure");
	}
	
	});
								
},
	
	_getRoleList:function()
	{
		roleManagement.list = new Array();
		roleManagement.updatelist = new Array();
		var jsondata = {username:localStorage.getItem('username'),operation:'list'}
		 var serviceName='JscriptWS'; 
		var hostUrl = '/DevTest/rest/';
		var methodname = 'RoleManagement'
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
			console.log(resultsData)
			if(resultsData!=undefined && resultsData != '' && resultsData.roles !=undefined && resultsData.roles.length > 0)
			{
				$('#roletablebody').empty();
				
				var data = resultsData.roles
				for(var i=0; i<data.length; i++)
				{
				roleManagement.updatelist.push(data[i].roleName+'&|&'+data[i].orgName+'&|&'+data[i].uidpk)
				roleManagement.list.push(data[i].roleName+'&|&'+data[i].orgName)
				
				var desc = data[i].description;
				if(desc == null || desc == undefined)
				{
					desc = ''
				}
				html = html+'<tr roleID='+data[i].uidpk+'><td >'+data[i].roleName+
				'</td><td>'+desc+'</td><td>'+data[i].orgName+'</td>'
				html += "<td><a class='edit' href='javascript:;''>Edit </a></td>";
				html += "<td><a class='delete' href='javascript:;''>Delete </a></td>";
				
				}
				
				
				} 
				var oTable = $('#sample_editable').dataTable();
					oTable.off();
					$("#sample_editable_new").unbind("click")
					oTable.fnClearTable();
					oTable.fnDestroy();
					$('#roletablebody').append(html);
				
					roleManagement._setOtableToTable();
			},
			error: function(msg) {
				 //test=JSON.parse(msg);
				 $("#sp").css("color", "red");
				 $("#sp").text("\t File not modified.");
				 console.log("failure");
			}
			
	});
	},
	_click:function()
	{
	roleManagement.dropdownValue = document.getElementById('orglist').value
            
	}
	
  };
