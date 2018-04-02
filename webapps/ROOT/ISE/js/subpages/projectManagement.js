
 var projectManagement = {
isNewRow:false,
resultsData:{},
orglist:{},
response:{},
dropdownValue:'',
list : new Array(),

      /* Init function  */
      init: function()
      {
		projectManagement._getprojectsList();
		
		var json_Data = {operation:'list',username:localStorage.getItem('username')};
		projectManagement._genericServiceCall('organisationManagement',json_Data);
		},
	
								
  _setOtableToTable:function(){

        	 var table = $('#sample_editable_project');

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

        $('#sample_editable_project_new').click(function (e) {
		e.preventDefault();
			e.stopPropagation();
            e.preventDefault();
			
            if (nNew && nEditing) {
                if (confirm("Previose row not saved. Do you want to save it ?")) {
                    projectManagement.saveRow(oTable, nEditing); // save
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
            projectManagement.editRow(oTable, nRow);
            nEditing = nRow;
            nNew = true;

            if(nNew){

            	projectManagement.isNewRow = true;
            }
        });

        table.on('click', '.delete', function (e) {
            e.preventDefault();

            if (confirm("Are you sure to delete this row ?") == false) {
                return;
            }

            var nRow = $(this).parents('tr')[0];
            projectManagement._deleteInformation(nRow);
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
                projectManagement.restoreRow(oTable, nEditing);
                nEditing = null;
            }
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();

            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];

            if (nEditing !== null && nEditing != nRow) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                projectManagement.restoreRow(oTable, nEditing);
                projectManagement.editRow(oTable, nRow);
                nEditing = nRow;
            } else if (nEditing == nRow && this.innerHTML == "Save") {
                /* Editing this row and want to save it */
                projectManagement.saveRow(oTable, nEditing);
                 // "Updating information to backend
                projectManagement._updateInformation(nEditing);
                nEditing = null;           
              

            } else {
                /* No edit in progress - let's start one */
                projectManagement.editRow(oTable, nRow);
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
            jqTds[0].innerHTML = "<input type='text' class='form-control input-small'  value='" + aData[0] + "'>";
            jqTds[1].innerHTML = "<input type='text' class='form-control input-small' value='" + aData[1] + "'>";
			 if(!(aData[0] == '' && aData[1]== '' && aData[2]== ''))
			{
			 
			 jqTds[2].innerHTML = "<input type='text' disabled class='form-control input-small' value='" + aData[2] + "'>";
			 }
			 else
			 {
			 jqTds[2].innerHTML = "<select class=select id = 'orglist' onclick=projectManagement._click()></select>"
				jqTds[3].innerHTML = '<a class="edit" href="">Save</a>';
            jqTds[4].innerHTML = '<a class="cancel" href="">Cancel</a>';
			
			console.log(projectManagement.orglist);
			
			  if(projectManagement.orglist !=undefined && projectManagement.orglist !=null && projectManagement.orglist.organizations !=undefined )
				{
				var data = projectManagement.orglist.organizations
				for(var i=0; i<data.length;i++)
				{
					var selectid = document.getElementById('orglist');
				selectid.innerHTML += '<option value = '+data[i].organizationname+'>'+data[i].organizationname+'</option>';
				
				}
				projectManagement.dropdownValue = document.getElementById('orglist').value
			 }
				
			 }
			
			jqTds[3].innerHTML = '<a class="edit" href="">Save</a>';
            jqTds[4].innerHTML = '<a class="cancel" href="">Cancel</a>';
			
			
			
			
            //jqTds[2].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[2] + '">';
            //jqTds[3].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[3] + '">';
            
        },

         saveRow:function(oTable, nRow) {
            var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
			if(projectManagement.isNewRow)
			{
			
			oTable.fnUpdate(projectManagement.dropdownValue , nRow, 2, false);
			
			 }
			 else
			 {
				oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
			 }
            
			 oTable.fnUpdate("<a  onclick= projectManagement._updateprjDetailsToUser('this,"+jqInputs[0].value+",event') id='"+jqInputs[0].value+"' >Set as Current </a>", nRow, 3, false);
            oTable.fnUpdate('<a class="delete">Delete</a>', nRow, 4, false);
            oTable.fnDraw();
        },

         cancelEditRow:function(oTable, nRow) {
           var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
			if(projectManagement.isNewRow)
			{
			
			oTable.fnUpdate(projectManagement.dropdownValue , nRow, 2, false);
			
			 }
			 else
			 {
				oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
			 }
            
			 oTable.fnUpdate("<a  onclick= projectManagement._updateprjDetailsToUser('this,"+jqInputs[0].value+",event') id='"+jqInputs[0].value+"' >Set as Current </a>", nRow, 3, false);
            oTable.fnDraw();
        },
		_updateInformation:function(editfeatureInformation){

        	if(projectManagement.isNewRow){
        		
        	var projectName =  $(editfeatureInformation).find("td").eq(0).html(); 
			  var Description =  $(editfeatureInformation).find("td").eq(1).html();
			  var orgname =  $(editfeatureInformation).find("td").eq(2).html();
			   //var excType =  $(editfeatureInformation).find("td").eq(3).html();
			  
			if((projectName == undefined || projectName == null || projectName ==''))
			{
				alert('project name is Mandatory')
				projectManagement._getprojectsList();
			}
			else if((orgname == undefined || orgname == null || orgname =='') )
			{
				alert('organization names is Mandatory')
				projectManagement._getprojectsList();
			}
			else if(projectManagement.list.indexOf(projectName+'&|&'+orgname) > -1)
			{
				alert('Project name exists')
				projectManagement._getprojectsList();
			}
			else
			{
			  var json_Data = {username: localStorage.getItem('username'),operation:'create',organizationName:orgname,projectName:projectName,projectDesc:Description}
			  projectManagement._genericServiceCall('projectManagement',json_Data,'create') 
			//projectManagement._getRoleList();
			}
        	}
        	       	
        	//projectManagement._getprojectsList();
        },
		_deleteInformation:function(deleterow)
		{
			var orgname =  $(deleterow).find("td").eq(2).html();
			var projectName =  $(deleterow).find("td").eq(0).html();
			  var json_Data = {username:localStorage.getItem('username'),operation:'delete',organizationName:orgname,projectName:projectName}
			  projectManagement._genericServiceCall('projectManagement',json_Data,'delete')
			 //projectManagement._getRoleList();
			//projectManagement._getprojectsList(); 
		},
		
	_genericServiceCall:function(methodname,json_Data,operation,prjname)
	{	
	projectManagement.response = {};
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
	projectManagement.orglist = JSON.parse(msg);
	}
	else
	{	
		projectManagement.response = JSON.parse(msg);
		projectManagement._getprojectsList();
		
	}
	if(operation == 'update')
	{
		localStorage.setItem('projectName', prjname);
		localStorage.setItem('projname', prjname);
		sessionStorage.setItem('projname', prjname);
		localStorage.setItem('currentMultiProject', prjname);
		localStorage.setItem('multiProjectName',prjname);
		setUserPrefernce("projectName", prjname);
				//alert("updateCurrentProjectForUser --"+sessionStorage.projname)
				//sessionStorage.setItem('projType', projectType)
				sessionStorage.setItem('isnewuser', 'false');
				projectManagement._getprojectsList();
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

_getprojectsList:function()
	{
		projectManagement.list = new Array();
		var jsondata = {username:localStorage.getItem('username'),operation:'list'}
		 var serviceName='JscriptWS'; 
		var hostUrl = '/DevTest/rest/';
		var methodname = 'projectManagement'
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
			if(resultsData!=undefined && resultsData != '' && resultsData.projects !=undefined && resultsData.projects.length > 0)
			{
				$('#projectListElement').empty();
				$('#prjtablebody').empty();

				var data = resultsData.projects
				
				
				//To refresh the project list data in local storage
				var userID = localStorage.getItem('userId');
				localStorage.setItem('projList'+'_'+userID, resultsData);
				var count=0;
				for(var i=0; i<data.length; i++)
				{
				projectManagement.list.push(data[i].PROJECT_NAME+"&|&"+data[i].ORGANIZATIONNAME);
				
				var desc = data[i].description;
				if(desc == null || desc == undefined)
				{
					desc = ''
				}
				html = html+'<tr projid='+data[i].PROJECT_ID+'><td>'+data[i].PROJECT_NAME+'</td><td>'+desc+'</td><td>'+data[i].ORGANIZATIONNAME+'</td>'
				html += "<td id="+data[i].PROJECT_ID+">";
				if(data[i].ORGANIZATION_ID == localStorage.getItem('organization') &&  localStorage.getItem('projectName') != undefined && localStorage.getItem('projectName') == data[i].PROJECT_NAME)
					{
						html += "<font style = 'color:red;'>Current project</font></td>"
						
						//To refresh the project list data in the header
						var LI = $("<li><input type='checkbox' id='selectedProjectLists' value='"+data[i].PROJECT_NAME+"' checked disabled/><a style='padding: 0 5px 5px 5px; display: inline-block;'>" + data[i].PROJECT_NAME + "</a></li>");
						count++
						
					}
					else{
						if(data[i].ORGANIZATION_ID == localStorage.getItem('organization') )
						{
							html +="<a  id="+data[i].PROJECT_ID+" onclick = projectManagement._updateprjDetailsToUser(this,'"+data[i].PROJECT_NAME+"',event) >Set as Current </a></td>";
							
							//To refresh the project list data in the header
							var LI = $("<li><input type='checkbox' id='selectedProjectLists' value='"+data[i].PROJECT_NAME+"'/><a style='padding: 0 5px 5px 5px; display: inline-block;'>" + data[i].PROJECT_NAME + "</a></li>");	
							count++
							
							//document.getElementById('headerProjNameElement').innerHTML = data[i].PROJECT_NAME;
							//document.getElementById('selectedProjNameElement').innerHTML = data[i].PROJECT_NAME;
						}
						else
						{
							html +="<a id="+data[i].PROJECT_ID+";>Set as Current </a></td>";
							
						}
					}
				html += "<td><a class='delete'>Delete </a></td></tr>";
				document.getElementById('totalProjectsCount').innerHTML = count;
					
					var assignedProjects = new Array();
					if (localStorage.getItem("assignedProjects") != '' && localStorage.getItem("assignedProjects") != undefined && localStorage.getItem("assignedProjects") != null)
					assignedProjects = (localStorage.getItem("assignedProjects").toString().includes(";"))
											? localStorage.getItem("assignedProjects").toString().split(";")
											: [localStorage.getItem("assignedProjects")];
			
					if (assignedProjects.length)					
					{
						if ($.inArray(data[i].PROJECT_NAME, assignedProjects) != -1)
							$('#projectListElement').append(LI);
					}
					else
					{
				$('#projectListElement').append(LI);
				}
				}
				
				console.log(projectManagement.orglist)
				//$('#prjtablebody').append(html);
		$("#projectListElement #selectedProjectLists").click(function(event) {
		setMultiProjectName( this.checked,  $(this).val());
		event.stopPropagation();		
		});		
				
		$("#projectListElement li ").click(function() {
        localStorage["projectName"] = $(this).find("a").text();       
        //getAllReleaseVersions($(this).find("a").text());
        document.getElementById('selectedProjNameElement').innerHTML = $(this).find("a").text();
        document.getElementById('headerProjNameElement').innerHTML = $(this).find("a").text();
         //$("#pageContainer").empty();
		 // added for project selection
		 var userID = localStorage.getItem('userId');
		 projectName = document.getElementById('selectedProjNameElement').innerHTML = $(this).find("a").text();
		 var params = new Array();
		 params.push(userID);
		 params.push(projectName);
		 ISE.updateProject(projectName);
		 localStorage.setItem('projectName', projectName);
		 localStorage.setItem('projname', projectName);
		 localStorage.setItem('currentMultiProject', projectName);
		 localStorage.setItem('multiProjectName',projectName);
		 $('#projectListElement #selectedProjectLists').attr('checked', false);
		 $('#projectListElement #selectedProjectLists').prop('disabled', false);
		 $(this).find('input').attr('checked',true);
		 $(this).find('input').prop('disabled', true);
		 setUserPrefernce( "projectName", projectName);//salim: To update user config data on change of project name.
		// onHashChange();
		projectManagement._getprojectsList();

        
   });

   
					
				
				} 
				//$('#prjtablebody').append(html);
				var oTable = $('#sample_editable_project').dataTable();
					oTable.off();
				$("#sample_editable_project_new").unbind("click")
                                                                oTable.fnClearTable();
                                                                oTable.fnDestroy();
                                                                $('#prjtablebody').append(html);
																
				projectManagement._setOtableToTable();
			},
			error: function(msg) {
				 //test=JSON.parse(msg);
				 $("#sp").css("color", "red");
				 $("#sp").text("\t File not modified.");
				 console.log("failure");
			}
			
	});
	},
	
	

 _updateprjDetailsToUser:function(this1,id1,event)
{
    if(localStorage.getItem("assignedProjects").indexOf(id1)<0){
    	alert("You must be assigned to the selected project.");
		event.stopPropagation();
		event.preventDefault();
        return false;
    }
	//var splitid = id.split("-");
	 var username =   localStorage.getItem('loginusername')
	var json_Data = {organizationName:localStorage.getItem('organization'), projectID:this1.id, username:username, operation:'update'}
	projectManagement._genericServiceCall('projectManagement',json_Data,'update',id1) 
	//window.location.reload();
	if(document.getElementById(this1.id).innerText  == 'Set as Current')
	{
		document.getElementById(this1.id).innerHTML  = "<font style = 'color:red;'>Current project</font>"
		document.getElementById('headerProjNameElement').innerHTML = id1
		document.getElementById('selectedProjNameElement').innerHTML = id1;		
	}
	else
	{
		document.getElementById(this1.id).innerHTML = "<a id="+this1.id +" onclick = projectManagement._updateprjDetailsToUser('this,"+id1+",event') >Set as Current </a>"
	}
	//projectManagement._getprojectsList();
},
_click:function()
	{
	projectManagement.dropdownValue = document.getElementById('orglist').value
            
	}
  };
  