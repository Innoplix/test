
 var organizationManagement = {
isNewRow:false,
results:'',
list: new Array(),
updatelist: new Array(),
      /* Init function  */
      init: function()
      {
			organizationManagement._getOrgList()
	  },
	
  _setOtableToTable:function(){
  

        	 var table = $('#sample_editable_org');		
				
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

        $('#sample_editable_org_new').click(function (e) {
            e.preventDefault();

            if (nNew && nEditing) {
                if (confirm("Previose row not saved. Do you want to save it ?")) {
                    organizationManagement.saveRow(oTable, nEditing); // save
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
            organizationManagement.editRow(oTable, nRow);
            nEditing = nRow;
            nNew = true;

            if(nNew){

            	organizationManagement.isNewRow = true;
            }
        });

        table.on('click', '.delete', function (e) {
            e.preventDefault();

            if (confirm("Are you sure to delete this row ?") == false) {
                return;
            }

            var nRow = $(this).parents('tr')[0];
            organizationManagement._deleteInformation(nRow);
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
                organizationManagement.restoreRow(oTable, nEditing);
                nEditing = null;
            }
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();

            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];

            if (nEditing !== null && nEditing != nRow) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                organizationManagement.restoreRow(oTable, nEditing);
                organizationManagement.editRow(oTable, nRow);
                nEditing = nRow;
            } else if (nEditing == nRow && this.innerHTML == "Save") {
                /* Editing this row and want to save it */
                organizationManagement.saveRow(oTable, nEditing);
                 // "Updating information to backend
                organizationManagement._updateInformation(nEditing);
                nEditing = null;           
              

            } else {
                /* No edit in progress - let's start one */
                organizationManagement.editRow(oTable, nRow);
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
            jqTds[0].innerHTML = "<input type='text'  class='form-control input-small' value='" + aData[0] + "'>";
			
			if(!(aData[0] == '' && aData[1]== ''))
			{
				jqTds[0].innerHTML = "<input type='text' disabled class='form-control input-small' value='" + aData[0] + "'>";			
			}
			
            jqTds[1].innerHTML = "<input type='text' class='form-control input-small' value='" + aData[1] + "'>";
			 jqTds[2].innerHTML = "<input type='text' disabled class='form-control input-small' value='" + organizationManagement._getCurrentDate() + "'>";
            jqTds[3].innerHTML = '<a class="edit" href="">Save</a>';
            jqTds[4].innerHTML = '<a class="cancel" href="">Cancel</a>';
        },

         saveRow:function(oTable, nRow) {
            var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
			 oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
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
			 oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
            //oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
           // oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
            oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 3, false);
            oTable.fnDraw();
        },
		_updateInformation:function(editfeatureInformation){

        	if(organizationManagement.isNewRow){
        		
        	var Title =  $(editfeatureInformation).find("td").eq(0).html(); 
			var Description =  $(editfeatureInformation).find("td").eq(1).html();
			if(Title == undefined || Title == null || Title =='')
			{
				alert('Organization Name is Mandatory')
				organizationManagement._getOrgList();
			}
			else if(organizationManagement.list.indexOf(Title) > -1)
			{
					alert('organization name exists');
					organizationManagement._getOrgList();
			}
			
			var orgJson = {organizationName:Title,organizationdesc:Description,operation:'create', username:localStorage.getItem('username')}
			organizationManagement._genericServiceCall('organisationManagement', orgJson)
			
			var projectName = Title;
			var elasticSearchHost = iseConstants.elasticsearchHost;
			var projJson = { username : sessionStorage.getItem('username'), projectName : projectName, elasticSearchHost : elasticSearchHost, mongo_collection : projectName+".kb_docs", es_collection : "kb_docs_collection"};
			organizationManagement._genericServiceCall('es_indexing', projJson);
			
			organizationManagement.isNewRow = false;
        	}
        	else
        	{
			  var id = $(editfeatureInformation).attr("orgID"); 
			  //alert(id)
			  var Title =  $(editfeatureInformation).find("td").eq(0).html(); 
			  var Description =  $(editfeatureInformation).find("td").eq(1).html();
			    if(Title == undefined || Title == null || Title =='')
				{
				  alert('Organization Name is Mandatory')
				  organizationManagement._getOrgList();
				 }
				else if(organizationManagement.updatelist.indexOf(Title+"&|&"+id) == -1)
				{
					alert('organization name exists')
					organizationManagement._getOrgList();
				}
				 else
				 {
					var json_Data = {organizationName:Title,organizationdesc:Description,operation:'update',organizationid:id, username:localStorage.getItem('username')}
					organizationManagement._genericServiceCall('organisationManagement',json_Data)
				 }
        	}  
        },
		_deleteInformation:function(deleterow)
		{
			var id = $(deleterow).attr("orgID"); 
			  //alert(id)
			  var Title =  $(deleterow).find("td").eq(0).html(); 
			  var Description =  $(deleterow).find("td").eq(1).html();
			  var json_Data = {operation:'delete',OrgId:id, username:localStorage.getItem('username')}
			  organizationManagement._genericServiceCall('organisationManagement',json_Data)
			
		},
	_genericServiceCall:function(methodname,json_Data)
	{
								var serviceName='JscriptWS'; 
								var hostUrl = '/DevTest/rest/';
								var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&sname='+methodname;
								
										$.ajax({
										type: "POST",
										url: Url,
			async: false,
										data: JSON.stringify(json_Data),
										success: function(msg) {
										organizationManagement.results = JSON.parse(msg);
										organizationManagement._getOrgList();
										console.log("results"+msg)
										},
										error: function(msg) {
											 //test=JSON.parse(msg);
											 $("#sp").css("color", "red");
											 $("#sp").text("\t File not modified.");
											 console.log("failure");
										}
									});

		var orgName = json_Data.organizationName;			
		if (methodname == 'organisationManagement')	
		{
			var roleJson = {username:localStorage.getItem('username'),organizationName:orgName,operation:'create',RoleName:'Admin',Description:'Administrator'}			  
			organizationManagement._genericServiceCall('RoleManagement', roleJson)			
		}
		else if (methodname == 'RoleManagement')
		{
			var userJson = {username:'admin@hcl.com',organizationName:orgName,operation:'create',UserName:'admin@hcl.com',UserPassWord:'admin',projectName:'MozillaFirefox',RoleName:'Admin',organizationName :orgName,FullName:'Administrator',EmailId:'',Designation:'',Department:'',assignedProjects:'MozillaFirefox',isActive:1}			  
			organizationManagement._genericServiceCall('userManagement',userJson);			
		}
	},
 _getOrgList :function(){
 $('#organizationtablebody').empty();
	organizationManagement.list = new Array();
	organizationManagement.updatelist = new Array();
	
	var json_Data = {username:localStorage.getItem('username'),operation:'list'};
	var serviceName='JscriptWS'; 
	var methodname = "organisationManagement";
	var hostUrl = '/DevTest/rest/';
	var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&sname='+methodname;
	var html;
	$.ajax({
	type: "POST",
	url: Url,
	async: true,
	data: JSON.stringify(json_Data),
	success: function(msg) {
		  test=JSON.parse(msg);

		if(test != undefined && test.organizations !=undefined && test.organizations.length >0)
		{
			var data = test.organizations;
			for(var i=0; i<test.organizations.length; i++)
			{
				organizationManagement.updatelist.push(data[i].organizationname+"&|&"+data[i].uidpk)
				organizationManagement.list.push(data[i].organizationname)
				var desc = data[i].description;
				if(desc == null || desc == undefined)
				{
					desc = ''
				}
				html = html+'<tr orgID='+data[i].uidpk+'><td >'+data[i].organizationname+'</td><td>'+desc+'</td><td>'+data[i].createddate+'</td>'
				 html += "<td><a class='edit' href='javascript:;''>Edit </a></td>";
			html += "<td><a class='delete' href='javascript:;''>Delete </a></td>";
			
			}
			
		}
		var oTable = $('#sample_editable_org').dataTable();
					oTable.off();
					$("#sample_editable_org_new").unbind("click")
					oTable.fnClearTable();
					oTable.fnDestroy();
					$('#organizationtablebody').append(html);
					
			 organizationManagement._setOtableToTable();		
		 
	},
	error: function(msg) {
		 //test=JSON.parse(msg);
		 $("#sp").css("color", "red");
		 $("#sp").text("\t File not modified.");
		 console.log("failure");
	}

	});
	},
 _getCurrentDate: function() 
{
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
		dd='0'+dd
	} 

	if(mm<10) {
		mm='0'+mm
	} 

	today = yyyy+'-'+mm+'-'+dd;
	return today;
}
  };
