var itssupportinsight={
	 messobject:{},
	 init: function(){
	 console.log('Support Insight');
	 itssupportinsight.check('simple');
	 document.getElementById('simple').checked="checked";
	 
	 itssupportinsight.messobject=new Array();
	 
	
	 
		$('#txtIssue').keyup(function () {             
				
              if(document.getElementById('txtIssue').value!="")
			  {
				 var requestObject = new Object();
				 requestObject.collectionName ="its-issuedetails";
				 requestObject.searchString =document.getElementById('txtIssue').value;
				 ITS._GetIssueList(requestObject,itssupportinsight._Issuelist);
				  $("#suggesstion-box").show();
			  }
			  else
			  {
			   $("#suggesstion-box").hide();
			  }
             
         });
	 
	 },
	  _Issuelist:function(dataObj){
		var data=dataObj.hits.hits;		
		var drpOption="";	
		
		for (var i = 0; i < data.length; i++) {
		
			if(data[i]._source!=undefined)
			{			
			drpOption +="<span style='margin-down:5px;' id='id_"+data[i]._source.issueno+"' onclick='itssupportinsight.selectissue("+data[i]._source.issueno+")'>"+data[i]._source.issueno+'</span><br/>';			
			}
			else
			{			
			
			}			
		 }
		 $("#suggesstion-box").show();
		 $("#suggesstion-box").html("<span>"+drpOption+"<span>"); 

		  
	},
	
	selectissue:function(val)	{
		$("#txtIssue").val(val);
		$("#suggesstion-box").hide();
	},
	 
	 
	 check:function(id) {
		if(id=='simple')
		{
		document.getElementById('txtContext').style.display='none';
		document.getElementById('txtSimple').style.display='block';
		}
		else
		{
		document.getElementById('txtSimple').style.display='none';
		document.getElementById('txtContext').style.display='block';
		}
	 },
	 GetDetails:function(Issue){
	 document.getElementById('dvTabs').style.display="none";
			 var a=new Array();
			 a.push('its-issuedetails');
			 a.push('its-customerhistory');
			 
			for (var i = 0; i <= a.length; i++) {		
					var requestObject = new Object();
					requestObject.collectionName = a[i];
					requestObject.searchString = Issue;					
					requestObject.maxResults = "10";
					requestObject.analyzer="cess_analyzer";
					ITS._GetResultSearch(requestObject,itssupportinsight._SearchResponse);
			}
			
	 },
	 _SearchResponse:function(dataObj){	
		itssupportinsight.messobject.push(dataObj);
		if(dataObj[0]._index.indexOf('issue')>-1)
		 {
		 for (var i = 0; i < dataObj.length; i++) 
			{
			_.each(dataObj[i], function (val, key) {				
				document.getElementById('txtProduct').value=(key.indexOf('product')>-1)?val:document.getElementById('txtProduct').value;
				document.getElementById('txtVersion').value=(key.indexOf('version')>-1)?val:document.getElementById('txtVersion').value;
				document.getElementById('txtBuild').value=(key.indexOf('build')>-1)?val:document.getElementById('txtBuild').value;
				document.getElementById('txtOS').value=(key.indexOf('os')>-1)?val:document.getElementById('txtOS').value;
				document.getElementById('txtServicePack').value=(key.indexOf('sp')>-1)?val:document.getElementById('txtServicePack').value;
				document.getElementById('txtSV').value=(key.indexOf('sigver')>-1)?val:document.getElementById('txtSV').value;
				document.getElementById('txtDesc').value=(key.indexOf('issue')>-1)?val:document.getElementById('txtDesc').value;
				});
			}
			itssupportinsight._GetTabs1(dataObj);
			
		}
		else
		{
		 for (var i = 0; i < dataObj.length; i++) 
			{
			_.each(dataObj[i], function (val, key) {				
				document.getElementById('txtCust').value=(key.indexOf('product')>-1)?val:document.getElementById('txtCust').value;
				document.getElementById('txtEmail').value=(key.indexOf('cemail')>-1)?val:document.getElementById('txtEmail').value;				
				
				});
			}
		}
		
	},
		 
	_SearchTabsResult:function(){
		document.getElementById('btnSummarize').style.display="block";
		itssupportinsight.GetDetails(document.getElementById('txtIssue').value);
		
		var requestObject = new Object();
		requestObject.collectionName ="its-customerhistory";
		requestObject.searchString =document.getElementById('txtEmail').value;					
		requestObject.maxResults = "10";
		requestObject.analyzer="cess_analyzer";
		ITS._GetResultSearch(requestObject,itssupportinsight._GetTabs2);
		
		var requestObject = new Object();
		requestObject.collectionName ="its-knownissue";
		requestObject.searchString ="";					
		requestObject.maxResults = "10";
		requestObject.analyzer="cess_analyzer";	
		
		ITS._GetResultSearch(requestObject,itssupportinsight._GetTabs3);
		
		var requestObject = new Object();
		requestObject.collectionName ="its-bugs";
		requestObject.searchString = "";					
		requestObject.maxResults = "10";
		requestObject.analyzer="cess_analyzer";
		ITS._GetResultSearch(requestObject,itssupportinsight._GetTabs4);
		
		var requestObject = new Object();
		requestObject.collectionName ="its-patches";
		requestObject.searchString = "";					
		requestObject.maxResults = "10";
		requestObject.analyzer="cess_analyzer";
		
		ITS._GetResultSearch(requestObject,itssupportinsight._GetTabs5);
		
		var requestObject = new Object();
		requestObject.collectionName ="its-kb-securitysupport";
		requestObject.searchString = document.getElementById('txtDesc').value;					
		requestObject.maxResults = "10";
		requestObject.analyzer="cess_analyzer";
		
		ITS._GetResultSearch(requestObject,itssupportinsight._GetTabs6);
		
		document.getElementById('dvTabs').style.display="block";
		//itssupportinsight._GetTabs6();
		
		
	},
	_GetTabs1:function(dataObj){
		 var restable="";
		 var dvres="";		
		 restable="<table  class='table table-striped table-bordered table-hover'>";
		 dvres="Product Usage Pattern for the selected customer: ";
		
		 restable+="<tr><th>Product</th><th>Version</th><th>Build</th><th>OS</th><th>SP</th><th>AV</th><th>Real-Time</th><th>Email-Scan</th><th>Sig-Ver</th><th>FW</th><th>PC</th><th>ASPM</th><th>Mem</th></tr>";
		
			for (var i = 0; i < dataObj.length; i++) 
				{
					 restable+='<tr>';					
					 var l=0;
					_.each(dataObj[i], function (val, key) {
							if(key=="product")
							{
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}
							else if(key=="version")
							{
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}
							else if(key=="build")
							{
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}
							else if(key=="os")
							{
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}
							else if(key=="sp")
							{
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}
							else if(key=="av")
							{
							restable +=(val.indexOf('1')>-1)?'<td><img src="images/greentick.jpg"></td>':'<td><img src="images/wrong.png"></td>';
							}
							else if(key=="realtime")
							{
							restable +=(val.indexOf('1')>-1)?'<td><img src="images/greentick.jpg"></td>':'<td><img src="images/wrong.png"></td>';
							}
							else if(key=="emailscan")
							{
							restable +=(val.indexOf('1')>-1)?'<td><img src="images/greentick.jpg"></td>':'<td><img src="images/wrong.png"></td>';
							}
							else if(key=="sigver")
							{
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}
							else if(key=="fw")
							{
							restable += (val.indexOf('1')>-1)?'<td><img src="images/greentick.jpg"></td>':'<td><img src="images/wrong.png"></td>';
							}
							else if(key=="pc")
							{
							restable +=(val.indexOf('1')>-1)?'<td><img src="images/greentick.jpg"></td>':'<td><img src="images/wrong.png"></td>';
							}
							else if(key=="aspm")
							{
							restable +=(val.indexOf('1')>-1)?'<td><img src="images/greentick.jpg"></td>':'<td><img src="images/wrong.png"></td>';
							}
							else if(key=="mem")
							{
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}							
								
						
							
					});
					
					restable+='</tr>';
					
				}
				restable+='</table>';
				$("#tab_1_1").html(dvres+"<br/><br/>"+restable);
				var searchstring=document.getElementById('txtProduct').value+' '+document.getElementById('txtVersion').value+' '+document.getElementById('txtBuild').value;//+' '+document.getElementById('txtOS').value+' '+document.getElementById('txtSV').value+' '+document.getElementById('txtServicePack').value;
				var requestObject = new Object();
				requestObject.collectionName ="its-issuedetails";
				requestObject.searchString =searchstring;					
				requestObject.maxResults = "20";
				requestObject.analyzer="cess_analyzer";
				ITS._GetResultSearch(requestObject,itssupportinsight._GetTabsHalf1);
				
			
	},
	
	_GetTabsHalf1:function(dataObj){
		var dvissue="";
		var issuelist="";
		dvissue="<b>Issues Faced by other customers with similar Product Usage Pattern/State</b>";
		dvissue+="<br/><br/><table class='table table-striped table-bordered table-hover'><tr><th>Issue</th><th>Confidence Level</th></tr>";
		var list=1;
		for (var i = 0; i < dataObj.length; i++) 
				{
				if(list<=5)
					{
					dvissue+='<tr>';	
					var issue="";					
					_.each(dataObj[i], function (val, key) {
						
						  if(key=="issue")
							{
								if(dvissue.indexOf(val.trim())<0)
								{
								issue=val.trim();
								dvissue+=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
								issuelist+='<option value='+i+'>'+val+'</option>';
								list++;	
								}								
							}
							else if(key=="similarity")
							{
							   if(dvissue.indexOf(issue)>0)
								{
								dvissue+=(val!="")?'<td><img src="images/uparrow.jpg">&nbsp;'+val+'%</td>':"<td>-</td>";
								}
							}	
						
					 });
					
					 dvissue+='</tr>';
					 }
					
					
				}
				dvissue+='</table>';
				$('#issuelist').html(issuelist);
				
			$("#tab_1_1").append("<br/>"+dvissue);
	},
	
	_GetTabs2:function(dataObj){
		var restable="";		
		restable="Customer Incident/CSAT History: <br/><br/><table  class='table table-striped table-bordered table-hover'>";
		restable+="<tr><th>Ticket</th><th>IssueType</th><th>IssueSubType</th><th>Title</th><th>CSat</th></tr>";
		for (var i = 0; i < dataObj.length; i++) 
				{
					 restable+='<tr>';
					 
					_.each(dataObj[i], function (val, key) {
							if(key=="issueno")
							{
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}
							//else if(key=="reporteddatetime")
							//{
							//restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							//}
							else if(key=="issuetype")
							{
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}
							else if(key=="issuesubtype")
							{
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}
							else if(key=="title")
							{
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}
							else if(key=="csat")
							{
								if(val>6)
								{
								restable +=(val!="NULL")?'<td><img src="images/up.jpg" alt="">&nbsp;'+val+'</td>':"<td>-</td>";
								}
								else
								{
								restable +=(val!="NULL")?'<td><img src="images/down.jpg" alt="">&nbsp;'+val+'</td>':"<td>-</td>";
								}
							}
					});
					restable+='</tr>';
				}
				restable+='</table>';
				$("#tab_1_2").html(restable);
	},
	_GetTabs3:function(dataObj){
	 var restable="";
	 var title="";
	 var hits="";
	 var kdid=""
	 restable="Known issues for the selected Product/Build and environment<br/><br/><table  class='table table-striped table-bordered table-hover'>";
	
	 for (var i = 0; i < dataObj.length; i++) 
				{					
					_.each(dataObj[i], function (val, key) {
							if(key=="title")
							{
							title =(val!="NULL")?'<tr><td>'+val+'<br/>':"<td>-</td>";
							}
							else if(key=="hits")
							{
							hits =(val!="NULL")?'<b>Hits: </b>'+val:"<td>-</td>";
							}
							else if(key=="kdid")
							{
							kdid =(val!="NULL")?'&nbsp;&nbsp;<b>KDId: </b>'+val+'</td></tr>':"<td>-</td>";
							}
				     
					});
					restable+=title+hits+kdid;
					
				}
				restable+="</table>";
			    $("#tab_1_3").html(restable);
	},
	_GetTabs4:function(dataObj){
		var restable="";		
		 restable="Bug Details for the selected Product/Build and environment: <br/><br/><table  class='table table-striped table-bordered table-hover'>";
		  restable+="<tr><th>Bug</th><th>Reported Incidents</th><th>Affected Customers</th><th>Priority</th><th>Severity</th><th>Suggested Prioritization</th></tr>";
		 for (var i = 0; i < dataObj.length; i++) 
				{			
					var severity="";
					 restable+='<tr>';
					 var l=0;
					_.each(dataObj[i], function (val, key) {
							if(key=="description")
							{
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}
							else if(key=="incidents")
							{
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}
							else if(key=="affects")
							{
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}
							else if(key=="priority")
							{
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}
							else if(key=="severity")
							{
							severity=val.trim();
							restable +=(val!="")?'<td>'+val+'</td>':"<td>-</td>";
							}
							l++;
							if(l>16)
							{
							restable +=(severity.toLowerCase()!="high")?'<td><img src="images/exclamation.png" alt=""></td>':'<td><img src="images/green_arrow_up.png" alt=""></td>';
							}
							
					});
					restable+='</tr>';
				}
				restable+='</table>';
				$("#tab_1_4").html(restable);
	},
	_GetTabs5:function(dataObj){
	var restable="";
	 var title="";
	 var hits="";
	 var kdid=""
	
	 var title="";
	 var version="";
	 var action="";
	 var reason="";
	 
	 restable="Patches/Suggestions available for the selected Product/Build and environment <br/><br/><br/>You are running with the older build. Please run the product update or download the latest build from the below link Latest Build <br/><br/><b>Installed Applications</b><table  class='table table-striped table-bordered table-hover'>";
	  restable+="<tr><th>Software</th><th>Version</th><th>Action</th><th>Reason</th></tr>";
	 for (var i = 0; i < dataObj.length; i++) 
				{
				 var t=0;
				 var v=0;
				 var a=0;
				 var r=0;
				
				_.each(dataObj[i], function (val, key) {
					if(key=="software")
					{	
					t++;
					title=(val!="NULL")?'<td>'+val+'</td>':"<td>-</td>";
					}
					else if(key=="version")
					{	
					v++	;			
					version=(val!="NULL")?'<td>'+val+'</td>':"<td>-</td>";
					}
					else if(key=="action")
					{	
					a++;
					action=(val!="NULL")?'<td>'+val+'</td>':"<td>-</td>";
					}
					else if(key=="reason")
					{
					r++;
					reason=(val!="NULL")?'<td>'+val+'</td>':"<td>-</td>";
					}
					
				    
				});
				if(t>0||v>0||a>0||r>0)
				{
				restable+='<tr>';
				restable+=(t>0)?title:'<td>-</td>';
				restable+=(v>0)?version:'<td>-</td>';
				restable+=(a>0)?action:'<td>-</td>';
				restable+=(r>0)?reason:'<td>-</td>';
				restable+='</tr>';
				}
					
		}
				restable+="</table>";
			    $("#tab_1_5").html(restable);
	
	},
	
	_GetTabs6:function(dataObj){
	
		var restable="";		
		restable="Knowledge Article for the selected Product/Build based on the top most reported issues.: <br/><br/><table  class='table table-striped table-bordered table-hover'>";
		  
		 for (var i = 0; i < dataObj.length; i++) 
				{			
					var severity="";
					 restable+='<tr>';
					 var l=0;
					_.each(dataObj[i], function (val, key) {
							if(key=="summary")
							{
							restable +=(val!="")?'<td><img src="images/greenarrow.png">&nbsp;'+val+'</td>':"<td>-</td>";
							}
					});
					restable+='</tr>';
				}
				restable+='</table>';
				$("#tab_1_6").html(restable);
	
	},

	ContextSearchResult:function(searchstring){
		var requestObject = new Object();
		requestObject.collectionName ="its-kb-securitysupport";
		requestObject.searchString =searchstring;					
		requestObject.maxResults = "10";
		requestObject.analyzer="cess_analyzer";
		ITS._GetResultSearch(requestObject,itssupportinsight._GetTabs6);
		document.getElementById('dvTabs').style.display="block";
		
		//var $tabs = $('.nav nav-tabs'),
        //$tabsA = $tabs.find('a'),
       // $tabsC = $('.tab_content'),
		//$tabsA.filter('[href="#tab_1_6"]').addClass('active');
		//$tabsA.filter('[href="#tab_1_1"]').removeClass('active');
	}
}