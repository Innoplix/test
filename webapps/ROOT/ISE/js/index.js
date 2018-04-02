/*-------------------------------------------------------------------------
 * ISE framework classes for the Home page.
 *
 * DEPENDENCIES
 *  - header.html
 *  - menubar.html
 *  - footer.html
 *  - ise-utils.js
 *  - metronic.js
 *  - index.js
 *-------------------------------------------------------------------------*/
var gLandingPage="#general";
// salim: userDefaultConfigData holds the default json data for the user 
var userDefaultConfigData = { username : localStorage.getItem('username') ,  projectName : localStorage.getItem('projname') }; 
var serviceName="JscriptWS"; 
var methodname = "loadOrSaveJsonData";
var hostUrl = '/DevTest/rest/';
var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&sname='+methodname ;
var userConfigData;
var previousSubPageMenuItem='';
/* ready function */
jQuery(document).ready(function() {
       
    // Send True if Subpage Plug-ins are required to load otherwise false
    MetronicUtils.loadPlugins(pluginsInitialized);

    handleHeaderClickEvents();

    $(window).bind('popstate', function(e) {
        var currentElement = $("div.portlet-fullscreen");
        var fullscreenElement = currentElement.find("a.fullscreen");
        fullscreenElement.click();
    });
	$("#menuList").on("click", ".sub-menu li a",function(){
		var type = $(this).attr("type");
		var type_name = $(this).attr("type_name");
		var __obj = new Object();
		__obj.type = type;
		__obj.type_name = type_name;
		createHeadingLogo(__obj);
		var currentSubPageMenuItem = window.location.hash.slice(1);
		if(previousSubPageMenuItem != currentSubPageMenuItem ){
			previousSubPageMenuItem = currentSubPageMenuItem
		}
		if((currentSubPageMenuItem == ikePageConstants.KNOWLEDGE_READ_AND_EDIT.replace("#",'')) || (currentSubPageMenuItem == ikePageConstants.KNOWLEDGE_ADD_PACKAGE.replace("#",''))){
			localStorage.removeItem('selectedKnowledgeEditDoc');
			localStorage.removeItem('selectedKnowledgeViewDoc');
			var newURL = window.location.href.split('?')[0]+'#'+window.location.href.split('?')[1].split('#')[1];
			history.pushState("test", "test", newURL);
			onHashChange();
		} 
			
	});
	if(!window.HashChangeEvent)(function(){
	var lastURL=document.URL;
		window.addEventListener("hashchange",function(event){
			Object.defineProperty(event,"oldURL",{enumerable:true,configurable:true,value:lastURL});
			Object.defineProperty(event,"newURL",{enumerable:true,configurable:true,value:document.URL});
			lastURL=document.URL;
		});
	}());
	
});

function querySearchFunc() {

	if ($('#gQuery').val().length > 2 || $('#gQuery').val().length > 2) {

        var newURL = window.location.protocol + "//" + window.location.host;
        newURL = newURL + window.location.pathname + "?gQuery=" + $('#gQuery').val() + "#defectsearch";
        history.pushState("test", "test", newURL);
		onHashChange();
    }
	//return false;
}
function createHeadingLogo(data){
	if(data.type=="ike"){
		$(".page-header.navbar .page-top").css('background-image', 'url(images/ike_headericon.png)');
	}else if(data.type=="ise"){
		$(".page-header.navbar .page-top").css('background-image', 'url(images/ise_headericon.png)');
	}else if(data.type=="its"){
		$(".page-header.navbar .page-top").css('background-image', 'url(images/its_headericon.png)');
		$(".page-actions .logo .logo-container .common-heading-title").last().text("Support")
	}
	$(".page-actions .logo .logo-container .dynamic-heading-title, .page-logo .logo .logo-container .dynamic-heading-title").text(data.type_name);
}
//SIMY Added
function createMenu( menuArray , role, organization, user , project, p_type, p_type_name) {
                if(role == null) role = "";
                if(organization == null) organization = "";
                if(user == null) user = "";
                if(project == null) project = "";

	var menu = "";
	for(var i = 0; i < menuArray.length ; i ++ ) {
		
		var m = menuArray[i];
		var l = ''; // landing page for a given role
		
		if(m.roles) {
			if( role.search(m.roles) == -1) continue;
		}
		
		if(m.organizations) {
			if( organization.search(m.organizations) == -1) continue;
		}
		
		if(m.users) {
			if( user.search(m.users) == -1) continue;
		}
		
		if(m.projects) {
			if( m.projects.search(project) == -1) continue;
		} 	
		if(m.landingpage) {
			if( role.search(m.landingpage) >= 0 ) {l = "landingpage='yes' ";gLandingPage=m.href;};
		} 
		if(m.tooltip) {
			menu += "<li title='"+ m.tooltip + "'>";
		} else menu += "<li>"
		
		if(m.icon) {
			menu +="<a><i class='"+m.icon+"'></i>\n";
		}
		if(m.title) {
			menu +="<span class='title'>"+m.title+"</span></a>\n";
		}
		
		
		
		
		if(m.href) {
		  //IsNotActice =true means, we need to hide the menu item. Need to set the property value at menu.json
		    if(m.IsNotActice)
			menu += "<a style='display:none;' href='"+m.href+ "' "+l+" type='"+p_type+"' type_name='"+p_type_name+"'> "+ m.display + "</a>";
			else
			menu += "<a href='"+m.href+ "' "+l+" type='"+p_type+"' type_name='"+p_type_name+"'> "+ m.display + "</a>";
		} else {
			if( m.display ) {
			    if(m.IsNotActice)
				menu += "<a style='display:none;'>"+m.display+"</a>\n";
				else
				menu += "<a>"+m.display+"</a>\n";
			}
		}
			
		
		if(m.submenu) {
			menu += "<ul class='sub-menu'>\n" + createMenu( m.submenu , role, organization, user , project, m.type, m.type_name) + "</ul>\n";
		} 
		
		
		
		
		menu += "</li>\n";
	
	}

	return menu;
}

/* Load Menu - To display menu based on role and organization */
function loadMenu(strRoleName) {

		
		iseConstants.languagename = localStorage.getItem("LanguageName");
		
		
        var organization = localStorage.getItem("organizations");	
        var roleName     = strRoleName;
		var user	     = localStorage.getItem('username');
		var project 	 = localStorage.getItem('projname');
		if(roleName == null) roleName = localStorage.getItem('rolename');
		
		//salim:
		//debugger;
		var result = "";
		if (localStorage.getItem('username')!= null ){
			result = loadUserDefaultConfigData();
		}
		
		
		/* if ( result == "yes" ){    //It means user  config file exists
		
			project  = userConfigData.projectName ;			
		}else{
		
			project  = userDefaultConfigData.projectName ;
		} */
		
		localStorage.setItem('multiProjectName',localStorage.getItem('projname'));
		localStorage.setItem('currentMultiProject',localStorage.getItem('projname'));
	
		//SIMY added
		  var currentJsonFile;
		if(iseConstants.languagename==""|| iseConstants.languagename.indexOf("en")>-1)
			 currentJsonFile="json/menu.json?"
		else
		   //currentJsonFile="json/menu_"+iseConstants.languagename+".json?";
	    currentJsonFile="json/localization/"+iseConstants.languagename+"/menu.json?";
		$.getJSON(currentJsonFile +Date.now(), function(menu) {
			var m = createMenu(menu,roleName,organization,user,project);
			$('#menuList').html(m);
			createHeadingLogo(menu[0]);
		}).error(function(event, jqxhr, settings, thrownError ){
			console.log(event);
			console.log(jqxhr);
			console.log(settings);
			console.log(thrownError);
			console.log(event.responseText);
			
		});
			setTimeout(bindHelptoControls, 500,"index");
		return;


    }
    /* To handle logout and subpage fullscreen events */
function handleHeaderClickEvents() {


    var userName = localStorage.getItem('username');

    document.getElementById('usernameElement').innerHTML = userName;

    $("#logoutUser").click(function(event) {

        localStorage["login"] = "false";
        logoutUser();
    });

    $("#pageFullScreenBtn").click(function(event) {

        onWindowFullScreen();

    });


}

/* To handle Window FullScreen */
function onWindowFullScreen() {

    var elem = document.body;
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        var el = document.documentElement,
            rfs = // for newer Webkit and Firefox
            el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (typeof rfs != "undefined" && rfs) {
            rfs.call(el);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }


}

/* pluginsInitialized() - This method will be called once Metronics & Javscripts plugins loaded  */
function pluginsInitialized() {


    Metronic.init();
    Layout.init(); // init metronic core componets 
    ISEUtils.init(true, isePluginsLoaded);

}

/* isePluginsLoaded() - This method will be called once ISE plugins loaded  */
function isePluginsLoaded() {
initLocalization();
	loadMenu(); // To Load Menu  

    // Redirect the url to login page if user has not logged-in. 
    var localStorageValue = localStorage.getItem("login");

    if (localStorageValue == "false" && localStorageValue != null) {

        var arr = ISEUtils.checkLoginCredentials();


        // ISEUtils.pageblocking();
        if (arr.length > 0) {
            if (arr.length < 2) {
                alert("Please enter Correct login credentials");
            } else {
                var username = arr[0];
                var password = arr[1];
                var organization = arr[2];

                password = atob(password); // Decode the Password
				
		if(organization !=undefined)
		{
			modifiedorg = parseInt(organization)
		}
   	 	var objAuthenticateUser = ISE.authenticateUser(username, password, modifiedorg);
		
	    if (objAuthenticateUser.result == 'Success') {

                    ISEUtils.processAuthResponse(objAuthenticateUser);
                    setTimeout(initilaizeData, 500);
                } else {
                    alert("Please Enter Valid credentials");
                }

            }

        } else {
            localStorage.setItem("redirectURL", window.location.href);
            window.location.href = "login.html";
        }
    } else {
        //ISEUtils.pageblocking();
        setTimeout(initilaizeData, 500);
    }
}

/* This method will be populate the data to elements  */
function initilaizeData() {
	sessionStorage.getItem('organization');
	ISEUtils._fillSessionStorageValues();

     var isSessionValid = sessionStorage.getItem('authtoken');

     console.log(isSessionValid);

    if(isSessionValid == '' || isSessionValid == "undefined" || isSessionValid == null){
        
        localStorage.setItem("redirectURL", window.location.href);
        window.location.href = "login.html";
    }

		//SURESH - Usage

        $(document).ajaxSend(function(event, xhr, settings) {  
                xhr.ISEstartTime = Date.now();
           });


		$(document).ajaxSuccess(function(event, xhr, settings) {  
			var url = settings.url;
			if( url.indexOf('js/') == 0 ) return;
			if( url.indexOf('metronics/') ==0) return;
			var usageData = new Object();
			usageData.outputLength =xhr.responseText.length;
			usageData.ajaxURL=url;
			usageData.ajaxType=settings.type;
            usageData.timeTaken= Date.now() - xhr.ISEstartTime;
			ISEUtils.logUsageMetrics("ajaxSuccess",  usageData);
		});

		$(document).ajaxError(function( event, jqxhr, settings, thrownError ) {  
			var usageData = new Object();
			usageData.ajaxURL=settings.url;
			usageData.status = jqxhr;
			usageData.error  = thrownError;
			ISEUtils.logUsageMetrics("ajaxError", usageData);
		});

		window.onerror = function (errorMsg, url, lineNumber) {
		
		  if(errorMsg != undefined){
			console.log("JAVASCRIPT ERROR :" + errorMsg + ":" + url + ":" +lineNumber);
			var usageData = new Object();
			usageData.url=url;
			usageData.error=errorMsg;
			usageData.lineno=lineNumber;
			ISEUtils.logUsageMetrics("scriptError",  usageData);
			}
			
		}
		//SURESH - Usage

    getAllProjDetails();

}
function reloadProjects(data) {
console.log(data);
	var userID = localStorage.getItem('userId');
	var projList = localStorage.getItem('projList'+'_'+userID); 
	if (data != projList) {
			console.log(data);
		var projectList = JSON.parse(data);
		var projectListCahe = JSON.parse(projList);
		$('#projectListElement').empty();
		for (var i = 0; i < projectList.projects.length; i++) {
			var found = false;
			for (var j = 0; j < projectListCahe.projects.length; j++) {
				if(projectList.projects[i].PROJECT_NAME == projectListCahe.projects[j].PROJECT_NAME) {
					found = true;
					break
				}
			}
			
			if(!found) {
				var assignedProjects = new Array();
				if (localStorage.getItem("assignedProjects") != '' && localStorage.getItem("assignedProjects") != undefined && localStorage.getItem("assignedProjects") != null)
					assignedProjects = (localStorage.getItem("assignedProjects").toString().includes(";"))
											? localStorage.getItem("assignedProjects").toString().split(";")
											: [localStorage.getItem("assignedProjects")];
			
				if (assignedProjects.length)
				{
					if ($.inArray(projectList.projects[i].PROJECT_NAME, assignedProjects) != -1)
					{
						var LI = $("<li><input type='checkbox'  id='selectedProjectLists' value='"+projectList.projects[i].PROJECT_NAME+"'/><a style='padding: 0 5px 5px 5px; display: inline-block;'>" + projectList.projects[i].PROJECT_NAME + "</a></li>");
						$('#projectListElement').append(LI);
						document.getElementById('totalProjectsCount').innerHTML = projectList.projects.length;
					}
				}
				else
				{
				var LI = $("<li><input type='checkbox'  id='selectedProjectLists' value='"+projectList.projects[i].PROJECT_NAME+"'/><a style='padding: 0 5px 5px 5px; display: inline-block;'>" + projectList.projects[i].PROJECT_NAME + "</a></li>");
				$('#projectListElement').append(LI);
				document.getElementById('totalProjectsCount').innerHTML = projectList.projects.length;
			}
		}
	}
	}
	localStorage.setItem('projList'+'_'+userID, data);
}

/* To get the list of all the projects and populate in elements */
function getAllProjDetails() 
{
	console.log(" 348 === inside getAllProjDetails");
   var selectedProject = localStorage.getItem('projname');
   localStorage.setItem('projectName', selectedProject);

    var projectName;

     if(selectedProject != null && selectedProject != undefined && selectedProject != "undefined")
   {
        projectName = selectedProject;
        document.getElementById('selectedProjNameElement').innerHTML = projectName;
        document.getElementById('headerProjNameElement').innerHTML = projectName;
    } /*else {
        projectName = localStorage.getItem('projname');
        localStorage.setItem('projectName', projectName);
        document.getElementById('selectedProjNameElement').innerHTML = projectName;
        document.getElementById('headerProjNameElement').innerHTML = projectName;
    }*/



    var userID = localStorage.getItem('userId');
    var params = ['PARAM1=' + userID];
	var projectList;
	var projList = localStorage.getItem('projList'+'_'+userID); 
		var data = ISE._getAllProjects();
		localStorage.setItem('projList'+'_'+userID, data);
		projectList = data

	var assignedProjects = new Array();
	if (localStorage.getItem("assignedProjects") != '' && localStorage.getItem("assignedProjects") != undefined && localStorage.getItem("assignedProjects") != null)
		assignedProjects = (localStorage.getItem("assignedProjects").toString().includes(";"))
								? localStorage.getItem("assignedProjects").toString().split(";")
								: [localStorage.getItem("assignedProjects")];
	
	
    $('#projectListElement').empty();
    for (var i = 0; i < projectList.projects.length; i++) 
	{
		if (assignedProjects.length)
		{
			if ($.inArray(projectList.projects[i].PROJECT_NAME, assignedProjects) != -1)
			{
				if( localStorage.getItem('projname') != undefined && localStorage.getItem('projname') != null && localStorage.getItem('projname') != 'undefined')
				{
        	projectName = localStorage.getItem('projname');
			}
		if( localStorage.getItem('currentMultiProject') == projectList.projects[i].PROJECT_NAME ){
        var LI = $("<li><input type='checkbox' id='selectedProjectLists' value='"+projectList.projects[i].PROJECT_NAME+"' checked disabled/><a style='padding: 0 5px 5px 5px; display: inline-block;'>" + projectList.projects[i].PROJECT_NAME + "</a></li>");
				}else{
					var LI = $("<li><input type='checkbox' id='selectedProjectLists' value='"+projectList.projects[i].PROJECT_NAME+"'/><a style='padding: 0 5px 5px 5px; display: inline-block;'>" + projectList.projects[i].PROJECT_NAME + "</a></li>");	
				}
        
				$('#projectListElement').append(LI);
			}
		}
		else
		{
			if( localStorage.getItem('projname') != undefined && localStorage.getItem('projname') != null && localStorage.getItem('projname') != 'undefined')
			{
				projectName = localStorage.getItem('projname');
			}
			if( localStorage.getItem('currentMultiProject') == projectList.projects[i].PROJECT_NAME ){
				var LI = $("<li><input type='checkbox' id='selectedProjectLists' value='"+projectList.projects[i].PROJECT_NAME+"' checked disabled/><a style='padding: 0 5px 5px 5px; display: inline-block;'>" + projectList.projects[i].PROJECT_NAME + "</a></li>");        
        }else{
			var LI = $("<li><input type='checkbox' id='selectedProjectLists' value='"+projectList.projects[i].PROJECT_NAME+"'/><a style='padding: 0 5px 5px 5px; display: inline-block;'>" + projectList.projects[i].PROJECT_NAME + "</a></li>");	
		}
		
		$('#projectListElement').append(LI);
    }
    }

    document.getElementById('totalProjectsCount').innerHTML = projectList.projects.length;
	
	 if(selectedProject == null || selectedProject == undefined || selectedProject == "undefined")
   {
    
       // projectName = projectList.projects[0].PROJECT_NAME;
        localStorage.setItem('projectName', projectName);
        document.getElementById('headerProjNameElement').innerHTML = projectName;
        document.getElementById('selectedProjNameElement').innerHTML = projectName;
   }
   
   var releaseList = localStorage.getItem('releaseList'+'_'+userID);
   
   if(releaseList) {
		populateReleaseVersions(JSON.parse(releaseList));
        populateMultiReleaseVerions(JSON.parse(releaseList));
        //onHashChange() //Change for IKE, un-comment for IKE Deployment.
   }
   else {
		getAllReleaseVersions(projectName);
	}
	
	$("#projectListElement #selectedProjectLists").click(function(event) {
		
		setMultiProjectName( this.checked,  $(this).val());
		event.stopPropagation();
		
	});
	
    $("#headerPart").on("click","#projectListElement li",function() {
        localStorage["projectName"] = $(this).find("a").text();
        getAllReleaseVersions($(this).find("a").text());
        document.getElementById('selectedProjNameElement').innerHTML = $(this).find("a").text();
        document.getElementById('headerProjNameElement').innerHTML = $(this).find("a").text();
         $("#pageContainer").empty();
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
		 loadMenu();
		 //onHashChange();
		 return false;
   });
	
	
	
	/* detect hash change after one seconds   */
	setTimeout( function() { $(window).bind('hashchange', onHashChange); },1000);
}

/* To get the list of all release versions based on project  */
function getAllReleaseVersions(projectName) {

    $('#versionListElement').empty();
    document.getElementById('versionID').innerHTML = "";
    document.getElementById('headerVersionID').innerHTML = "";
    document.getElementById('totalVersions').innerHTML = "";
    ISE.listTotalReleases("getReleases", "", projectName, false, receivedAllReleaseVersions);
}

function receivedAllReleaseVersions(respListReleases) {
	var userID = localStorage.getItem('userId');
	localStorage.setItem('releaseList'+'_'+userID, JSON.stringify(respListReleases));
    if (ISEUtils.validateObject(respListReleases)) {
        populateReleaseVersions(respListReleases);
        populateMultiReleaseVerions(respListReleases);
    }
	else {
		onHashChange();
	}
}

/* Display list of release versions in element */
function populateReleaseVersions(data) {
var userID = localStorage.getItem('userId');
    var params = ['PARAM1=' + userID];
	
ISE.listAllProjects("getProjectsForUser", params, false,reloadProjects);

    try {

        if (ISEUtils.validateObject(data)) {

            var cmbReleasesArray = [];

            for (var i = 0; i < data.length; i++) {

                //cmbReleasesArray[i] = (data[i].__tmp0).release;
				cmbReleasesArray[i] = data[i].release;
            }
			
			cmbReleasesArray = cmbReleasesArray.reverse();

            if (cmbReleasesArray && cmbReleasesArray.length > 0) {

                for (var i = 0; i < cmbReleasesArray.length; i++) {

                    var LI = $("<li><a>" + cmbReleasesArray[i] + "</a></li>");
                    $('#versionListElement').append(LI);
                }

                //var selectedVerionID = localStorage.getItem('releaseId');
                var selectedVerionID = cmbReleasesArray[0];

                if (selectedVerionID != null) {
                    document.getElementById('headerVersionID').innerHTML = selectedVerionID;
                    document.getElementById('versionID').innerHTML = selectedVerionID;
                    localStorage.setItem('releaseId', selectedVerionID);
                } else {
                    var releaseId = cmbReleasesArray[cmbReleasesArray.length - 1];
                    localStorage.setItem('releaseId', releaseId);
                    document.getElementById('headerVersionID').innerHTML = releaseId;
                    document.getElementById('versionID').innerHTML = releaseId;
                }

                document.getElementById('totalVersions').innerHTML = cmbReleasesArray.length;
                $("#pageContainer").empty();
                onHashChange();
            }


            $("#versionListElement li ").click(function() {

                $("#pageContainer").empty();
                localStorage["releaseId"] = $(this).find("a").text();
                document.getElementById('versionID').innerHTML = $(this).find("a").text();
                document.getElementById('headerVersionID').innerHTML = $(this).find("a").text();
                onHashChange();
				setUserPrefernce("releaseId", $(this).find("a").text() );//salim: when release is changed by user, it will be updated in config file of the user
            });
        }

    } catch (e) {
        console.log("populateReleasesCombo exception -  " + e);
    }
}




/* To Adjust the sidebar toggle alignment and set the localstorage vale if user cliked on logout   */
function menucallBack() {
    if ($('#menuList').length)
        $('#menuList').addClass('page-sidebar-menu-closed');
}

/*   To Activate FullScreen  */
function activateFullscreen(reqFullScreen) {

    if (reqFullScreen == "true") {

        $('#headerPart').hide();
        $('#menuBar').hide();
        $('#pagebreadcrumbs').hide();
        $('#footerPart').hide();
        $('body').addClass('page-full-width');
    }
}
/*   To Detect Hash Change  */
function onHashChange(event) {
    /* SIMY: removing the code used for debugging
	console.log("onHashChange ..");
	var err = new Error();
    console.log( err.stack);
	*/
	
    //var subpage = window.location.hash.slice(1);
    var subpage = window.location.hash.slice(1);
	var temp = new Array();
	// this will return an array with strings "1", "2", etc.
	temp = window.location.hash.split("#");
	subpage = temp[temp.length -1];
    localStorage.setItem("page", subpage);
	previousSubPageMenuItem = event ? event.originalEvent.newURL.split('#')[1] : "";
	//SURESH - Usage
		var usageData = new Object();
		usageData.page=subpage;
		ISEUtils.logUsageMetrics("urlchange",  usageData);
	//SURESH - Usage
	
    if (subpage == '') {



        //subpage = $("a[landingpage='yes']").attr("href").slice(1) || 'general';
		subpage = gLandingPage.slice(1) || 'general';
        var newURL = window.location.href + "#" + subpage
        var obj = {
            Page: "page",
            Url: newURL
        };
        history.pushState(obj, obj.Page, obj.Url);

    }
	if(subpage=="regressionOptimization" || subpage=="orphans" || subpage=="projectManagement" || subpage=="userManagement"){
	   $('#pageContainer').empty();
	}
    var childdiv = $('#pageContainer').find('#page_' + subpage);

    // Existing page. 
    if (childdiv.length) {

        console.log("Already Page content loaded");
        showSelectedPageContent(subpage);
        highLightSelectMenu(subpage);
        updateSubPageInfo();
        setLocalStorage(subpage);
        //
        var currentPage = eval(subpage.split('_')[0]);

      if (typeof currentPage.onDisplayHeaderElements === 'function'){

             currentPage.onDisplayHeaderElements();
        }
          
        //rename fuction to onResizeWindow
        //check whether function existing or not
        if (typeof currentPage.onResizeWindow === 'function') {
            $(window).bind('resize', currentPage.onResizeWindow);
            currentPage.onResizeWindow();
        }
		
		 if (typeof currentPage.reinit === 'function'){
              currentPage.reinit();
         }

        return;
    }


    var isSubMenuItem = highLightSelectMenu(subpage);
    if (!isSubMenuItem) {

        $("#pageContainer").empty();
        $('#page_' + subpage).empty();
        $("#pageContainer").append("<div id=page_" + subpage + "></div>");
        //$('#page_' + subpage).load('notauthorised.html');
		window.location.hash = '';
        return;
    }


    var page = subpage.split('_')[0] + ".html";


    $.ajax({
        url: page,
        type: 'HEAD',
        error: function() {
            //file not exists

            $("#pageContainer").empty();
            $('#page_' + subpage).empty();
            $("#pageContainer").append("<div id=page_" + subpage + "></div>");
            $('#page_' + subpage).load('pagenotfound.html');

        },
        success: function() {


            // New page loading 
            $("#pageContainer").append("<div id=page_" + subpage + "></div>");
            $('#page_' + subpage).load(page, function() {

                // After loading HTML ..
                var jsfilename = "js/subpages/" + subpage.split('_')[0] + ".js"+ "?v=" + localStorage.iSEAPIVersion;
				var s1 = document.createElement('script');
				s1.setAttribute('src',jsfilename);
				
					
                s1.onload =function() {
                    // Only after loading JS
                    var currentPage = eval(subpage.split('_')[0]);
                  if (typeof currentPage.onDisplayHeaderElements === 'function'){
                             currentPage.onDisplayHeaderElements();
                        }
                    currentPage.init();
                    if (typeof currentPage.onResizeWindow === 'function') {
                        $(window).bind('resize', currentPage.onResizeWindow);
                    }
                    updateSubPageInfo();
					setTimeout(bindHelptoControls, 500,subpage.split('_')[0]);
                };
				s1.onerror = function(){console.log("Error while loading .. "+jsfilename);};
				document.head.appendChild(s1);

            });

            setLocalStorage(subpage);
            showSelectedPageContent(subpage);
        }
    });

   return false;

}


/*   Update the controls based on url params */
function updateSubPageInfo() {

    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i,
        username,
        password,
        oraganization;


    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        var input = $('#pageContainer').find(sParameterName[0]);

        if (input != null) {

            $('#' + sParameterName[0]).val(sParameterName[1]);

     
             /* if(!document.getElementById(sParameterName[0]))
              {

                if(sParameterName[0] != "undefined" &&  sParameterName[0] != '')
                {
                    var filterTagName = sParameterName[0];
                    var filterTagValue = sParameterName[1];
                    var tagDivChildren = $("#divFilterTags").children('.tag').size();           

                 $("#divFilterTags").append('<span class="tag" fieldName='+filterTagName+'  fieldValue='+filterTagValue+' id=tag_'+tagDivChildren+' style="margin:1px 5px 1px 1px;"><span>'+filterTagName+' : '+filterTagValue+'&nbsp;&nbsp;</span><a  parentID=tag_'+tagDivChildren+' onClick=defectsearch._headerSearchTagFilter(this) title="Removing tag">x</a></span>');
                }                 
              }*/
          

            
        }

        if (sParameterName[0] == "fullscreen") {
            activateFullscreen(sParameterName[1]);
        }


        if (sParameterName[0] == "click") {
            var btn = $('#pageContainer').find(sParameterName[1]);

            if (btn != null) {
                $("[id=" + sParameterName[1] + "]").click();
            }
        }

         if (sParameterName[0] == "searchID") {

             var elementID = $('#pageContainer').find(sParameterName[0]);

             if (elementID != null) {
                 $('#'+sParameterName[0]).change();
               // $("[id=" + sParameterName[0] + "]").change();
            }

         }

    }


}

/*   Hide/UnHide the page Contents  */
function showSelectedPageContent(filename) {

    $('#pageContainer').children().hide();
    $('#page_' + filename).show();
}

/*   Identify the menu selected item and change the menu selection based and post header  */
function highLightSelectMenu(page) {

    page = '#' + page;

    var menu = $("#menuList").find("a[href='" + page + "']");
    if (menu.length == 0) {


        return false; // Multiple entry or no entry !

    }

    var subMenuText = menu.text().trim();
    var parentLI = menu.parent().parent().parent();
    var mainMenuText = parentLI.find(".title").text().trim();
    var mainMenuiCon = parentLI.find("i:first").attr('class');
	
	$("#dynamicMenu").html(menu.parent().parent().html());

    setPagebreadcrumbs(mainMenuiCon, mainMenuText, subMenuText);
    parentLI.addClass("active");
    parentLI.siblings().removeClass("active");
    return true;
}


/*  To set the Page BreadCrumbs or Post Header Information  */
function setPagebreadcrumbs(iconName, MenuItem, SubMenuItem) {
	$("#icon").removeAttr("class").attr("class");
    $("#icon").addClass(iconName);
    $("#currSelMenu").text(MenuItem);
    $("#currSelSubMenu").text(SubMenuItem);
}

/*   Store Subpage name  in LocalStorage  */
function setLocalStorage(filename) {

    if (typeof(Storage) !== "undefined") {
        // Store
        localStorage.setItem("page", filename);
    } else {
        console.log("No Web Storage support.");
    }

}

/* Remove the sessions for logout  */
function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('authtoken');
    localStorage.removeItem("elasticsearchHost");
    localStorage.removeItem("sizeValue");
    localStorage.removeItem("pre_tags");
    localStorage.removeItem("post_tags");
    localStorage.removeItem("min_term_freq");
    localStorage.removeItem("minboost");
    localStorage.removeItem("maxboost");
    localStorage.removeItem("min_doc_freq");
    localStorage.removeItem("min_word_len");
    localStorage.removeItem("analyzer");
    localStorage.removeItem("stopWords");
    localStorage.removeItem("max_query_terms");
    localStorage.removeItem("configurationType");
	window.location = "login.html";
}

/* Add Role List to ChangeRole menu */
function loadRolesList() {

    $('#changeRoleLI').empty();
    var roleName = localStorage.getItem('rolename');
		var currentJsonFiles;
		if(iseConstants.languagename==""|| iseConstants.languagename.indexOf("en")>-1)
			 currentJsonFiles="json/DynamicMenuRoleArray.json?"
		else
		   currentJsonFiles="json/localization/"+iseConstants.languagename+"/DynamicMenuRoleArray.json?";
    $.getJSON(currentJsonFiles +Date.now(), function(data) {
        $.each(data, function(key, item) {

            if (key == roleName.toLowerCase()) {

                for (var i = 0; i < item.length; i++) {
                    var LI = $("<li><a  onClick=roleListHandler(this) ><i class=" + item[i].dicplayIcon + "></i>" + item[i].displayName + "</a></li>");
                    $('#changeRoleLI').append(LI);
                }
            }
        });
        uniqueLi = {};
		$("#changeRoleLI li").each(function () {
		  var thisVal = $(this).text();

		  if ( !(thisVal in uniqueLi) ) {
			uniqueLi[thisVal] = "";
		  } else {
			$(this).remove();
		  }
		})
    });
}

/* RoleList click handler  */
function roleListHandler(event) {

        loadMenu(event.textContent);
        setTimeout(onHashUpdate, 2000);
    }
    /* update hash change when user clicked on role list  */
function onHashUpdate() {

    history.replaceState({}, document.title, window.location.pathname);
    onHashChange();
}
/* Populate MutiRelease selection in header */
function populateMultiReleaseVerions(data) {

    try {

        var cmbReleasesArray = [];

        for (var i = 0; i < data.length; i++) {
            //cmbReleasesArray[i] = (data[i].__tmp0).release;
			cmbReleasesArray[i] = data[i].release
        }


        var defaultSelectArray = new Array();
        if (cmbReleasesArray != null && cmbReleasesArray != undefined) {

            for (var i = 0; i < cmbReleasesArray.length; i++) {

                if (i < 5) {
                   
                    var liItem = $("<li><a><input type=checkbox checked=checked onchange = 'multiReleaseSelect()'   value=" + cmbReleasesArray[i] + ">" + cmbReleasesArray[i] + "</a></li>");
                    $('#multiReleaseVersionListElement').append(liItem);                  
                    defaultSelectArray.push(cmbReleasesArray[i]);                  

                } else if (i >= 5) {
                    var liItem = $("<li><a><input type=checkbox  onchange = 'multiReleaseSelect()' value=" + cmbReleasesArray[i] + ">" + cmbReleasesArray[i] + "</a></li>");
                    $('#multiReleaseVersionListElement').append(liItem);
                }
            }


            $("#multiReleasetotalVersions").text(cmbReleasesArray.length);
            ISEUtils.multiSelectReleaseArray = defaultSelectArray;
        }
    } catch (e) {
        console.log("Exception in InitializeComboBox :" + e);
    }
}

/* MultiRelease Click handler */
function multiReleaseSelect() {

    ISEUtils.multiSelectReleaseArray = null;
    var elements = document.querySelectorAll('#multiReleaseVersionListElement li input:checked');
    var selectedReleasesArray = Array.prototype.map.call(elements, function(el, i) {
        return el.value;
    });

    ISEUtils.multiSelectReleaseArray = selectedReleasesArray;

    var subpage = window.location.hash.slice(1);
    var currentPage = eval(subpage.split('_')[0]);

     if (typeof currentPage.reinit === 'function'){
              currentPage.reinit();
         }

}

function aboutUs(){


    console.log("about us");
    $('#large20').modal("show");
}
		

		
		
function loadUserDefaultConfigData(){  //salim: To load default  or existing data for the specific user
		
		
		var url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken +'&sname='+methodname;//'&projectname=' + localStorage.projectName+
		var jsonData =  { username : localStorage.getItem('username') ,  operation : 'loadJsonData' }; 
		
		var  result = loadJSON( 'POST', 'json', false, url, jsonData);
		
		if ( result.fileExists == "true"){	
			try{					
				userConfigData = JSON.parse(result.data);
			}catch(e){		
				console.log(''+e);
				return "no";
			}
			return "yes";
		}else{
			jsonData =  { username : localStorage.getItem('username') ,  operation : 'saveJsonData', data: userDefaultConfigData}; 
			result = saveJSON( hostUrl, serviceName, methodname, false, jsonData);
			if( result.dataSaved == true ){
				userConfigData = userDefaultConfigData;
				return "yes";
			}else{
				 return "no" ;
			}
		}
}  
			
			

	function setUserPrefernce( key, value){  //salim: To set user preferences
		
		var url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&sname='+methodname;
		var jsonData =  { username : localStorage.getItem('username') ,  operation : 'loadJsonData' }; 
		var  result = loadJSON( 'POST', 'json', false, url, jsonData );
		
		if ( result.fileExists == "false"){
			jsonData.data = {};
		}else if ( result.fileExists == "true"){
			try{					
				jsonData.data = JSON.parse(result.data);
			}catch(e){		
				console.log(''+e);
				return;
			}
			
		}
		if( key == "projectName"){
			jsonData.data.projectName= value ; 
			var release = $(this).find("a").text() ;
			if( release == null || release =="" || release == undefined ) jsonData.releaseId = "";
		}
		if( key == "releaseId"){
			jsonData.data.releaseId = value ; 
		}
		if( key == "aliasName"){
			jsonData.data.aliasName = value ; 
		}
		jsonData.operation='saveJsonData';
		var s = saveJSON( hostUrl, serviceName, methodname, false, jsonData);
	}
	
	function loadJSON( type, dataType, async, url,jsonData ){  //salim: To load Json data
			
			var result = "";
			$.ajax({ type : type, dataType : dataType, async: async, url : url,data: JSON.stringify(jsonData),
					success : function(msg) {
						try{
							
							result =JSON.parse(JSON.stringify(msg));
						}catch(e){
							console.log("Parsing Error:  ");
							console.log(''+e);
						}
						console.log("success : Data loaded ");	
					},
					error: function(msg) {						
					 console.log("failure : Data not loaded");
					  console.log(msg);
					}
				} );	
		
		return result;
	}
			
	
	function saveJSON( hostUrl, serviceName, methodname, async, jsonData ){  //salim: To save json data 
			
		var result ="";
		var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&sname='+methodname;
		
		$.ajax({
				type: "POST",
				url: Url,
				async: async,
				data: JSON.stringify(jsonData),
				success: function(msg) {					
					try{
							
							result =JSON.parse(JSON.stringify(msg));
						}catch(e){
							console.log("Parsing Error:  ");
							console.log(''+e);
						}
				},
				error: function(msg) {					
					
					 console.log("failure :");
					 console.log(msg);
				}
				
				});
	   return result;
	}
	
	function displayAliasWindow(){ 	//salim: To display the window to get user alias name
		
	 
	  $('#setAliasNameWindow').modal('show');
	  
	}
	function setUserAlias(){ //salim: To capture the user's alias name and calling setUserPrefernce() to update in json file
	
	$('#setAliasNameWindow').modal('hide');
	
		var aliasName = $('#aliasNameInput').val();
		
		setUserPrefernce( "aliasName", aliasName);
	
	}
	
	function setMultiProjectName( checked, value ){
	
		var multiProjectName = localStorage.getItem('multiProjectName');
		
		var flag = "false";		
		var tt=multiProjectName.split(",");
		if(checked){
	
						
						for( var i=0; i<tt.length; i++){
							if( tt[i] == value )
									flag = "true";			
						}
						if( flag == "false"){
							tt.push(value)
							localStorage.setItem('multiProjectName',tt.toString());
						}	

			}else{					
				if( localStorage.getItem('currentMultiProject') !=  value ){
				tt.splice(tt.indexOf(value), 1);
				
				
				localStorage.setItem('multiProjectName',tt.toString());
			}
			}
	
	}
	function bindHelptoControls(currentSubPage) {
console.log(currentSubPage);
		//loadToolTipConfig("/help/"+currentSubPage+"_help.json");
} 
function initLocalization(){
	
	if( localStorage.getItem("LanguageName") && localStorage.getItem("LanguageName").length > 0 )
			var languageName =  localStorage.getItem("LanguageName") 
		else
			var languageName = iseConstants.languagename
	var pathName = 'json/localization/'+languageName;
	var opts = { language: languageName, pathPrefix: pathName, skipLanguage: "en-US" };
	$("[data-localize]").localize("index", opts);
}

	
	

