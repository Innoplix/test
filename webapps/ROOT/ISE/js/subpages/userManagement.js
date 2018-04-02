
 var userManagement = {
isNewRow:false,
resultsData:{},
orglist:{},
response:{},
roleList:{},
dropdownValue : '',
roledrpValue : '',
list : new Array(),
updatelist :new Array(),
arrProjects : [],
arrSelProjects : [],

      /* Init function  */
      init: function()
      {
		
		userManagement._getuserList();
		var json_Data = {username:localStorage.getItem('username'),operation:'list'};
		userManagement._genericServiceCall('organisationManagement',json_Data);
		if(userManagement.orglist != undefined && userManagement.orglist != null)
		{
			var data = userManagement.orglist.organizations;
			var json_Data = {username:localStorage.getItem('username'),operation:'orglist',OrgId : sessionStorage.getItem('organization')};
			userManagement._genericServiceCall('RoleManagement',json_Data);
			
		}
		
		userManagement._getProjectList();
		},
	
	_getProjectList:function()
	{
		var projects = ISE._getAllProjects();
		$.each(projects.projects, function(i, e) {
			if ($.inArray(e.PROJECT_NAME, userManagement.arrProjects) == -1)
				userManagement.arrProjects.push(e.PROJECT_NAME);
		});
	},
								
  _setOtableToTable:function(){

        	 var table = $('#sample_editable_user');

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

        $('#sample_editable_user_new').click(function (e) {
            e.preventDefault();
			
            if (nNew && nEditing) {
                if (confirm("Previous row not saved. Do you want to save it ?")) {
                    userManagement.saveRow(oTable, nEditing); // save
                    $(nEditing).find("td:first").html("Untitled");
                    nEditing = null;
                    nNew = false;

                } else {
                    oTable.fnDeleteRow(nEditing); // cancel
                    nEditing = null;
                    nNew = false;
					userManagement.isNewRow = false;
                    
                    return;
                }
            }
			else if (nEditing)
			{
				userManagement.restoreRow(oTable, nEditing);
			}

            var aiNew = oTable.fnAddData(['','', '', '', '', '','','','','','','']);
            var nRow = oTable.fnGetNodes(aiNew[0]);
            userManagement.editRow(oTable, nRow);
            nEditing = nRow;
            nNew = true;

            if(nNew){

            	userManagement.isNewRow = true;
            }
        });

        table.on('click', '.delete', function (e) {
            e.preventDefault();

            if (confirm("Are you sure to delete this row ?") == false) {
                return;
            }

            var nRow = $(this).parents('tr')[0];
            userManagement._deleteInformation(nRow);
            oTable.fnDeleteRow(nRow);           
           // alert("Deleted! Do not forget to do some ajax to sync with backend :)");
        });

        table.on('click', '.cancel', function (e) {
            e.preventDefault();
            if (nNew) {
                oTable.fnDeleteRow(nEditing);
                nEditing = null;
                nNew = false;
				userManagement.isNewRow = false;
            } else {
                userManagement.restoreRow(oTable, nEditing);
                nEditing = null;
            }
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();

			if (userManagement.isNewRow && this.innerHTML != "Save")
			{
				oTable.fnDeleteRow(nEditing); // cancel
				nEditing = null;
				userManagement.isNewRow = false;
				nNew = false;
			}
			
            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];

            if (nEditing !== null && nEditing != nRow) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                userManagement.restoreRow(oTable, nEditing);
                userManagement.editRow(oTable, nRow);
                nEditing = nRow;
            } else if (nEditing == nRow && this.innerHTML == "Save") {
                /* Editing this row and want to save it */
                userManagement.saveRow(oTable, nEditing);
                 // "Updating information to backend
                userManagement._updateInformation(nEditing);
                nEditing = null;           
            } else {
                /* No edit in progress - let's start one */
                userManagement.editRow(oTable, nRow);
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
            jqTds[1].innerHTML = "<input type='password' class='form-control input-small' value='" + aData[1] + "'>";
			jqTds[2].innerHTML = "<input type='text' class='form-control input-small' value='" + aData[2] + "'>";
			jqTds[3].innerHTML = "<input type='text' class='form-control input-small' value='" + aData[3] + "'>";
			
			//jqTds[8].innerHTML = "<input type='text' class='form-control input-small' value='" + aData[8] + "'>";
			
			if(!(aData[0] == '' && aData[1]== '' && aData[2]== ''))
			{
			 jqTds[1].innerHTML = "<input type='password' disabled  class='form-control input-small' value='" + aData[1] + "'>";
			 jqTds[4].innerHTML = "<input type='text' disabled  class='form-control input-small' value='" + aData[4] + "'>";
			 jqTds[5].innerHTML = "<input type='text' disabled  class='form-control input-small' value='" + aData[5] + "'>";
			 jqTds[6].innerHTML = "<input type='text' class='form-control input-small' value='" + aData[6] + "'>";
			jqTds[7].innerHTML = "<input type='text' class='form-control input-small' value='" + aData[7] + "'>";
				jqTds[8].innerHTML = userManagement._renderMultiSelect(aData[8]);
				jqTds[9].innerHTML = $(aData[9]).is(":checked")?"<input type='checkbox' checked>":"<input type='checkbox'unchecked>";
				jqTds[10].innerHTML = '<a class="edit" href="">Save</a>';
				jqTds[11].innerHTML = '<a class="cancel" href="">Cancel</a>';
			
			if((localStorage.getItem("loginusername") == aData[0]))
			  {
				jqTds[0].innerHTML = "<input type='text' disabled  class='form-control input-small' value='" + aData[0] + "'>";
			  }
			 }
			 else
			 {
			 jqTds[4].innerHTML = "<select class=select id = 'orglist' onchange=userManagement._click()></select>"
			 jqTds[5].innerHTML = "<select class=select id = 'rolelist' onchange=userManagement._roleclick() ></select>"
			 jqTds[6].innerHTML = "<input type='text' class='form-control input-small' value='" + aData[6] + "'>";
			jqTds[7].innerHTML = "<input type='text' class='form-control input-small' value='" + aData[7] + "'>";
				jqTds[8].innerHTML = userManagement._renderMultiSelect(aData[8]);
				jqTds[9].innerHTML = $(aData[9]).is(":checked")?"<input type='checkbox' checked>":"<input type='checkbox'unchecked>";
				jqTds[10].innerHTML = '<a class="edit" href="">Save</a>';
				jqTds[11].innerHTML = '<a class="cancel" href="">Cancel</a>';
			console.log(userManagement.orglist);
			
			 if(userManagement.orglist !=undefined && userManagement.orglist !=null && userManagement.orglist.organizations !=undefined )
			 {
				var selectid = document.getElementById('orglist');
				selectid.innerHTML += '<option value = '+localStorage.getItem('organizationName')+'>'+localStorage.getItem('organizationName')+'</option>';
				userManagement.dropdownValue = document.getElementById('orglist').value
			 }
				if(userManagement.roleList !=undefined && userManagement.roleList !=null && userManagement.roleList.roles !=undefined )
				 {
					var data = userManagement.roleList.roles
					for(var i=0; i<data.length;i++)
					{
						var selectid = document.getElementById('rolelist');
					selectid.innerHTML += '<option value = '+data[i].roleName+'>'+data[i].roleName+'</option>';
					}
					userManagement.roledrpValue = document.getElementById('rolelist').value
				}
			 }            
        },

		_renderMultiSelect:function(pSelected)
		{	
			userManagement.arrSelProjects = (pSelected && pSelected.includes("<br>")) ? pSelected.split("<br>"): [pSelected];
				
			var htmlData = '<select multiple="multiple" id="ddm_Project" class="multiple-select" size="2" onchange=userManagement._updateProject()>';
			for(var i=0; i < userManagement.arrProjects.length; i++)
			{
				var selected = ""
				if (userManagement.arrSelProjects)
				{
					if ($.inArray(userManagement.arrProjects[i], userManagement.arrSelProjects) != -1) 
					{				
						selected = "selected";									
					}
				}		
				htmlData += ' <option value="'+userManagement.arrProjects[i]+'"'+selected+'>'+userManagement.arrProjects[i]+'</option>';
			}
			htmlData += '</select>';
			
			$("#ddm_Project").select2();
									
			return htmlData;
		},
		
		_updateProject:function()
		{
			userManagement.arrSelProjects =  $('#ddm_Project').val();
		},

         saveRow:function(oTable, nRow) {
            var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
			//userManagement.username = jqInputs[0].value
			 oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
            oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
			oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
			if(userManagement.isNewRow)
			{
			oTable.fnUpdate(userManagement.dropdownValue , nRow, 4, false);
			oTable.fnUpdate(userManagement.roledrpValue , nRow, 5, false);
			 oTable.fnUpdate(jqInputs[4].value, nRow, 6, false);
			oTable.fnUpdate(jqInputs[5].value, nRow, 7, false);
				oTable.fnUpdate(userManagement._getDisplayProjectsStr(), nRow, 8, false);
				oTable.fnUpdate($(jqInputs[6]).is(":checked"), nRow, 9, false);
			 }
			 else
			 {
				oTable.fnUpdate(jqInputs[4].value, nRow, 4, false);
				oTable.fnUpdate(jqInputs[5].value, nRow, 5, false);
				 oTable.fnUpdate(jqInputs[6].value, nRow, 6, false);
			oTable.fnUpdate(jqInputs[7].value, nRow, 7, false);
				oTable.fnUpdate(userManagement._getDisplayProjectsStr(), nRow, 8, false);
				oTable.fnUpdate($(jqInputs[8]).is(":checked"), nRow, 9, false);
				localStorage.setItem("assignedProjects",(""+userManagement.arrSelProjects).replace(/\,/g, ';'));
			    getAllProjDetails();
			 }
			
			
            //oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
            //oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
            oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 10, false);
            oTable.fnUpdate('<a class="delete" href="">Delete</a>', nRow, 11, false);
            oTable.fnDraw();
        },

		_getDisplayProjectsStr:function()
		{
			var returnStr = "";
			if (userManagement.arrSelProjects) 
			{
				$.each(userManagement.arrSelProjects, function(i, val){
					returnStr = (returnStr != "") ? returnStr + '<br>' + val : val;
				});
			}
			return returnStr;
		},

         cancelEditRow:function(oTable, nRow) {
            var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
			 oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
            oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
			oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
			if(userManagement.isNewRow)
			{
			oTable.fnUpdate(userManagement.dropdownValue , nRow, 4, false);
			oTable.fnUpdate(userManagement.roledrpValue , nRow, 5, false);
			 oTable.fnUpdate(jqInputs[4].value, nRow, 6, false);
			oTable.fnUpdate(jqInputs[5].value, nRow, 7, false);
			 }
			 else
			 {
				oTable.fnUpdate(jqInputs[4].value, nRow, 4, false);
				oTable.fnUpdate(jqInputs[5].value, nRow, 5, false);
				 oTable.fnUpdate(jqInputs[6].value, nRow, 6, false);
			oTable.fnUpdate(jqInputs[7].value, nRow, 7, false);
				oTable.fnUpdate(jqInputs[8].value, nRow, 8, false);
			 }
            oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 9, false);
            oTable.fnDraw();
        },
		_updateInformation:function(editfeatureInformation){

        	if(userManagement.isNewRow){
        		
        	 var id = $(editfeatureInformation).attr("userID"); 
			 // var roleid = id.split('_')[0]
			  //var orgid = id.split('_')[1]
			  //console.log("select"+document.getElementById('orglist').value)
			  //console.log("select"+$(editfeatureInformation).find("td").eq(2).html())
			  //alert(id)
			  var userName =  $(editfeatureInformation).find("td").eq(0).html(); 
			  var password =  $(editfeatureInformation).find("td").eq(1).html();
			  var fullname =  $(editfeatureInformation).find("td").eq(2).html().trim();
			  var emailid =  $(editfeatureInformation).find("td").eq(3).html().trim();
			  var organization =  $(editfeatureInformation).find("td").eq(4).html();
			  var role =  $(editfeatureInformation).find("td").eq(5).html();
			  var designation =  $(editfeatureInformation).find("td").eq(6).html();
			  var department =  $(editfeatureInformation).find("td").eq(7).html();
				var assignedProjects = userManagement._getProjectNameForDB($(editfeatureInformation).find("td").eq(8).html());
				var activeProject = (assignedProjects.includes(";")) ? assignedProjects.split(";")[0] : assignedProjects
				var isActive = ($(editfeatureInformation).find("td").eq(9).text()=="true") ?1 :0;
			  
			if(userName == undefined || userName == null || userName =='') 
			{
				alert('userName Name is Mandatory')
				userManagement._getuserList();
			}
			else if((password == undefined || password == null || password ==''))
			{
				alert('password is Mandatory')
				userManagement._getuserList();
			}
			else if(userManagement.list.indexOf(userName+'&|&'+organization) > -1)
			{
				alert('user name exists')
				userManagement._getuserList();
			}
			
			else if( fullname != undefined && fullname != null && fullname !='' && !userManagement.validateFullName(fullname)){
				alert('Name contains only alphabets')
				userManagement._getuserList();
			}else if( emailid != undefined && emailid != null && emailid !='' && !userManagement.validateEmail(emailid)){
				alert('Invalid e-mail id.')
				userManagement._getuserList();
			}	
				else if (assignedProjects == "")
				{
					alert("Assign user to at-least one project.");
					userManagement._getuserList();
				}				
			else
			{
					var json_Data = {username:localStorage.getItem('username'),organizationName:organization,operation:'create',UserName:userName,UserPassWord:password,projectName:activeProject,RoleName:role,organizationName :organization,FullName:fullname,EmailId:emailid,Designation:designation,Department:department,assignedProjects:assignedProjects,isActive:isActive}			  
			userManagement._genericServiceCall('userManagement',json_Data,'add')
			userManagement.isNewRow = false;
			}
        	}
        	else
        	{
			   var id = $(editfeatureInformation).attr("userID"); 
			 // var roleid = id.split('_')[0]
			  //var orgid = id.split('_')[1]
			  //console.log("select"+document.getElementById('orglist').value)
			  //console.log("select"+$(editfeatureInformation).find("td").eq(2).html())
			  //alert(id)
			  var userName =  $(editfeatureInformation).find("td").eq(0).html(); 
			  var password =  $(editfeatureInformation).find("td").eq(1).html();
			  var fullname =  $(editfeatureInformation).find("td").eq(2).html();
			  var emailid =  $(editfeatureInformation).find("td").eq(3).html();
			  var organization =  $(editfeatureInformation).find("td").eq(4).html();
			  var role =  $(editfeatureInformation).find("td").eq(5).html();
			  var designation =  $(editfeatureInformation).find("td").eq(6).html();
			   var department =  $(editfeatureInformation).find("td").eq(7).html();
				var assignedProjects = userManagement._getProjectNameForDB($(editfeatureInformation).find("td").eq(8).html());
				var activeProject = (assignedProjects.includes(";")) ? assignedProjects.split(";")[0] : assignedProjects
				var isActive = ($(editfeatureInformation).find("td").eq(9).text()=="true") ?1 :0;
				
			   if(userName == undefined || userName == null || userName =='' )
				{
					alert('userName Name is Mandatory')
					userManagement._getuserList();
				}
				else if(userManagement.updatelist.indexOf(userName+'&|&'+organization+'&|&'+id) == -1)
				{
					alert('user name exists')
					userManagement._getuserList();
				}
				else if (assignedProjects == "")
				{
					alert("Assign user to at-least one project.");
					userManagement._getuserList();
				}					
				else
				{
					var json_Data = {username:localStorage.getItem('username'),uidpk:id,organizationName:organization,operation:'update',userName:userName,projectName:activeProject,fullName:fullname,EmailId:emailid,designation:designation,department:department,assignedProjects:assignedProjects,isActive:isActive}
			  userManagement._genericServiceCall('userManagement',json_Data,'update')
			  }
        	}       	        	
        },
			  
		_getProjectNameForDB:function(pAssignedProjects)
		{
			var returnStr = "";			
			var arrProjects = (pAssignedProjects.includes("<br>")) ?  pAssignedProjects.split("<br>") : [pAssignedProjects];
			
			$.each(arrProjects, function(i, val){
				returnStr = (returnStr != "") ? returnStr + ";" + val : val; 
			});
        	
			return returnStr;	
        },
		
		_deleteInformation:function(deleterow)
		{
			 var userName =  $(deleterow).find("td").eq(0).html(); 
			  var id = $(deleterow).attr("userID");  
			  var organization =  $(deleterow).find("td").eq(4).html();
			  var role =  $(deleterow).find("td").eq(5).html();
			  if(!(localStorage.getItem("loginusername") == userName))
			  {
			  var json_Data = {username:localStorage.getItem('username'),operation:'delete',organizationName:organization,RoleName:role,USERNAME:userName}
			  userManagement._genericServiceCall('userManagement',json_Data,'delete')
			  }
			  else
			  {
				alert('Can not delete logged in user');
				userManagement._getuserList();
			  }
			 //userManagement._getRoleList();
			 
		},
	_genericServiceCall:function(methodname,json_Data,operation)
	{	
	
	userManagement.response = {};
	//userManagement.roleList = {};
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
	userManagement.orglist = JSON.parse(msg);
	}
			
	if(methodname == 'RoleManagement')
	{
		userManagement.roleList = JSON.parse(msg);
		if(operation == 'click' )
		{
			document.getElementById("rolelist").options.length = 0; 
			if(userManagement.roleList !=undefined && userManagement.roleList !=null && userManagement.roleList.roles !=undefined )
			{
				var data = userManagement.roleList.roles
				for(var i=0; i<data.length;i++)
				{
					var selectid = document.getElementById('rolelist');
				selectid.innerHTML += '<option value = '+data[i].roleName+'>'+data[i].roleName+'</option>';
				
				}
				userManagement.roledrpValue = document.getElementById('rolelist').value
			}
		}
	}
	else
	{
		userManagement.response = JSON.parse(msg);
		userManagement._getuserList();
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
	
	_getuserList:function()
	{
		userManagement.list = new Array();
		$("usertablebody").empty();
		var jsondata = {username:localStorage.getItem('username'), operation:'orglist', OrgId:parseInt(localStorage.getItem('organization'))}
		 var serviceName='JscriptWS'; 
		var hostUrl = '/DevTest/rest/';
		var methodname = 'userManagement'
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
			if(resultsData!=undefined && resultsData != '' && resultsData.users !=undefined && resultsData.users.length > 0)
			{
				$('#usertablebody').empty();
				
				var data = resultsData.users
				for(var i=0; i<data.length; i++)
				{
				userManagement.list.push(data[i].username+'&|&'+data[i].ORGANIZATIONNAME)	
				userManagement.updatelist.push(data[i].username+'&|&'+data[i].ORGANIZATIONNAME+'&|&'+data[i].uidpk)
				var desc = data[i].description;
				var fullName = data[i].fullName;
				var email = data[i].email;
				var designation = data[i].designation;
				var department = data[i].department
				
				if(desc == null || desc == undefined)
				{
					desc = ''
				}
				if(fullName == null || fullName == undefined)
				{
					fullName = ''
				}
				if(email == null || email == undefined)
				{
					email = ''
				}
				if(designation == null || designation == undefined)
				{
					designation = ''
				}
				if(department == null || department == undefined)
				{
					department = ''
				}
				
						var projectHTML = userManagement._getValidProjectName(data[i].projectAssigned);
						
						var isActive = (data[i].isActive == null || data[i].isActive == undefined || data[i].isActive == 0)? "unchecked":"checked"
						
						html = html+'<tr userID='+data[i].uidpk+'><td >'+data[i].username+'</td><td ><input type=password disabled style=border:none;background-color:white; value = '+data[i].userpassword+' ></input></td><td>'+fullName+'</td><td>'+email+'</td><td>'+data[i].ORGANIZATIONNAME+'</td><td>'+data[i].ROLENAME+'</td><td>'+designation+'</td><td>'+department+'</td><td>'+projectHTML+'</td><td><input type=checkbox '+isActive+' disabled></td>'
				html += "<td><a class='edit' href='javascript:;''>Edit </a></td>";
				html += "<td><a class='delete' href='javascript:;''>Delete </a></td>";
				
				}
				} 
				
				var oTable = $('#sample_editable_user').dataTable();
					oTable.off();
				$("#sample_editable_user_new").unbind("click")
                                                                oTable.fnClearTable();
                                                                oTable.fnDestroy();
                                                               $('#usertablebody').append(html);
					userManagement._setOtableToTable();
			},
			error: function(msg) {
				 //test=JSON.parse(msg);
				 $("#sp").css("color", "red");
				 $("#sp").text("\t File not modified.");
				 console.log("failure");
			}
			
		});
	},
	
	_getValidProjectName:function(pAssignedProjects)
	{	
		var resultHTML = "";
		if (pAssignedProjects)
		{
			var arrAssignedProjects = new Array();
			if (pAssignedProjects.includes(";"))
				arrAssignedProjects = pAssignedProjects.split(";");
			else
				arrAssignedProjects.push(pAssignedProjects);
			
			$.each(arrAssignedProjects, function(i, PROJECT_NAME) {
				if ($.inArray(PROJECT_NAME, userManagement.arrProjects) != -1) 
				{
					resultHTML = (resultHTML != "")? resultHTML + '<br>' + PROJECT_NAME : resultHTML + PROJECT_NAME;				
				}			
			});
		}
		
		return resultHTML;
	},
	
	_click:function()
	{
	userManagement.dropdownValue = document.getElementById('orglist').value
	var json_Data = {username:localStorage.getItem('username'),operation:'orglist',organizationName : userManagement.dropdownValue};
	userManagement._genericServiceCall('RoleManagement',json_Data,'click');
	},
	
  
_roleclick:function()
{
	userManagement.roledrpValue = document.getElementById('rolelist').value
},

	validateEmail : function(email) {
		var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return regExp.test(email);
	},
	
	validateFullName : function(fullName) {
		var regExp = /^[A-Za-z]+[A-Za-z\s]*$/;
		return regExp.test(fullName);
	}

};
