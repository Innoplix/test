/*-------------------------------------------------------------------------
 * ISE framework classes for the user login.
 *
 * DEPENDENCIES
 *  - ise-utils.js
 *  - metronic.js
 *  - iseConstants.js
 *-------------------------------------------------------------------------*/

var elementID_dropdown_organization = "organization";
var pwdViaMail = false;


/* ready function */
jQuery(document).ready(function() {
    // Load Metronics Plugins 
    MetronicUtils.loadPlugins(pluginsInitialized);
	var b = navigator.userAgent.toLowerCase() ;
	console.log( "Detected " + b);
	if(b.indexOf("chrome") > -1 ) {
		Extension_Detect('ISE','ceamnkabppogemcldjpljbdlaiahadpi');
	}
	loadLoginProperties();		
	var organizationList = localStorage.getItem('organizationList'); 
	if(organizationList)
		addOrganizations(elementID_dropdown_organization, organizationList);	
	
	var username = localStorage.getItem("username");
	$('#username').val(username);

	var password = localStorage.getItem("password");
	$('#password').val(password);
	
	$("#termsAndConditions").on("click", function(){
		$("#agreementInfoModal").modal("show");
	});
	//debugger;
	/* if( localStorage.getItem(username) == "exists"){
		//checkbox will be checked
		$("input[type=checkbox]#checkbox1").attr("checked" , true);//.attr("disabled", true);
	}else{
		$("input[type=checkbox]#checkbox1").attr("checked" , false);
	} */
	$(".login-form-conatiner .mt-checkbox-list #checkbox1").on("focus", function(){
		$(this).parents().find(".mt-checkbox").addClass('checkbox-label');
		console.log("KKKK Focus");
	});
	$(".login-form-conatiner .mt-checkbox-list #checkbox1").on("blur", function(){
		$(this).parents().find(".mt-checkbox").removeClass('checkbox-label');
	});
	
	$(".login-form-conatiner .mt-checkbox-list #checkbox1").on("focus", function(){
		$(this).parents().find(".mt-checkbox").addClass('checkbox-label');
		console.log("KKKK Focus");
	});
	$(".login-form-conatiner .mt-checkbox-list #checkbox1").on("blur", function(){
		$(this).parents().find(".mt-checkbox").removeClass('checkbox-label');
	});
	 
			$("#site-language-btn").click(function(){
				//alert("123"+iseConstants.languageName);
				if($('#site-language-modal').css('display') == 'block')
					$("#site-language-modal").fadeOut(300);
				else if($('#site-language-modal').css('display') == 'none')
					$("#site-language-modal").fadeIn(300);
			});
			
			$(document).click(function(e) {

			// check that your clicked
			// element has no id=info
			// and is not child of info
			if (e.target.id != 'site-language-btn' && !$('#site-language-btn').find(e.target).length) {
				$("#site-language-modal").fadeOut(300);
			}
		});
		$("#site-language-modal").on("click", ".ui-language-option", function(){
			$("#site-language-modal").fadeOut(300)
			iseConstants.languagename = $(this).attr("data-id");
			if(iseConstants.languagename=="en"){
			//localStorage.setItem("LanguageName",iseConstants.languagename);
			$(".current-language strong").text($(this).text());
			location.reload();
			}
			else{
			localStorage.setItem("LanguageName",iseConstants.languagename);
			$(".current-language strong").text($(this).text());
			initLocalization();
			}
			
			
			
			//language=$(this).attr("data-id");
		})
	
});
/* function initRejectBrowser(){
	 $.reject({  
		reject: { 
		all: false, 
		msie: 9
		}
		   
	}); 
	return false;
} */
function loadLoginProperties(){
	jQuery.get('../DevTest/config/license.json', function(data) {
 
    if(data.Deployment_type=="ike"){
		$(".login .login-form-conatiner").css('background-image', 'url(images/login_ike_bg.png)');
	}else if(data.Deployment_type=="ise"){
		$(".login .login-form-conatiner").css('background-image', 'url(images/login_ise_bg.png)');
	}else if(data.Deployment_type=="its"){
		$(".login .login-form-conatiner").css('background-image', 'url(images/login_its_bg.png)');
	}
	$(".login .logo .logo-container .dynamic-heading-title").text(data.Deployment_type_name);
});
}
function pluginsInitialized() {

    Metronic.init(); // init metronic core components   
    ISEUtils.init(false,isePluginsLoaded); // init ise components.    
    $('#username').focus(); // set focus to username


  var username = localStorage.getItem("username");
  $('#username').val(username);

  var password = localStorage.getItem("password");
  $('#password').val(password);
}

/* Get and Populate Data to Elements */
function isePluginsLoaded() {
	//var lang =localStorage.getItem("LanguageName")
	 // lang="";
	  localStorage.setItem("LanguageName", window.navigator.language); 
	      iseConstants.browserLanguage=window.navigator.language;
          
 
	//initRejectBrowser();
  /*   var resp = ISE.getAllOrganizations(); // To get list of organizations
	localStorage.setItem('organizationList', resp);
    addOrganizations(elementID_dropdown_organization, resp); // Add Organizations - ElementID = "organization", Response Object */
	var json_Data = {operation:'list'};
	var serviceName='JscriptWS'; 
	var methodname = "organisationManagement";
	var hostUrl = '/DevTest/rest/';
	var Url = hostUrl + serviceName + '?type=JSON&authtoken=' + localStorage.authtoken + '&projectname=' + localStorage.projectName+'&isAuthReq=true&sname='+methodname;

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
			localStorage.setItem('organizationList', data);
			addOrganizations(elementID_dropdown_organization, data);
		} 
		 loadToolTipConfig("/help/ise-Login.json")
		 _handleUniform();	
	},
	error: function(msg) {
		test=JSON.parse(msg);
		 //test=JSON.parse(msg);
		 $("#sp").css("color", "red");
		 $("#sp").text("\t File not modified.");
		 console.log("failure");
	}

	});
   

}

/* Add Organizations to Dropdown box */
function addOrganizations(eleMentId, responseObj) {

    var select = document.getElementById(eleMentId); // Set dropdown box reference 

    //select[0] = new Option(iseConstants.str_login_Dropdown_Initialvalue, iseConstants.int_login_Dropdown_SetIndex);
	select[0] = new Option("Select Organization ", 0);
    //var organizations = ISEUtils.getArrayFromJsonByKey(responseObj, 'organizations');
	var organizations  = responseObj
    if (organizations != undefined) {
        for (t = 0; t < responseObj.length; t++) {
            select[t + 1] = new Option(organizations[t].organizationname, organizations[t].uidpk);
        }
    }

    var organization1 =localStorage.getItem('organization');    
	
    $('#organization option')
    .filter(function() {  return $.trim( $(this).val() ) == organization1; })
    .attr('selected',true);

    // venkanna 	
    if(organizations.length == 1){			
    	 $('#organization option')
	    .filter(function() {  return $.trim( $(this).text() ) == organizations[0].organizationname })
	    .attr('selected',true);
		 $("#organization").prop("disabled", true);

    }

    // Venkanna

    
     if(organizations.length == 1){

    	  $('#singleOrganizationTextInput').val(organizations[0].organizationname);
	      $('#singleOrganizationTextInput').removeClass("hide");
	      $('#organization').addClass("hide");
    }
    else
    {
    	 $('#singleOrganizationTextInput').addClass("hide");
	      $('#organization').removeClass("hide");
    } 
}

/* Add projects to Dropdown box */
function addProjects(eleMentId, responseObj) {

    var select = document.getElementById(eleMentId); // Set dropdown box reference 

    select[0] = new Option("Select project ", 0);
   
    var projects = new Array();
	var projectList = responseObj;
	
	for (var i = 0; i < projectList.projects.length; i++) {

       projects[i] =  projectList.projects[i].PROJECT_NAME;
       
    }
	
    if (projects != undefined) {
        for (t = 0; t < projects.length; t++) {
            select[t + 1] = new Option(projects[t]);
        }
    }

    var projects1 =localStorage.getItem('project');    

    $('#projects option')
    .filter(function() {  return $.trim( $(this).text() ) == projects1; })
    .attr('selected',true);

    
     $("#projects").change(function() {

        var selectedText = $(this).find("option:selected").text();
        var selectedVal = $(this).find("option:selected").text();
        var selectedValue = $(this).val();
        localStorage.setItem('project', selectedText);
		sessionStorage.setItem('projects', selectedVal);

    });
}

/* Add degignations to Dropdown box */
/* function addRoles(eleMentId) {

    var select = document.getElementById(eleMentId); // Set dropdown box reference 

    select[0] = new Option("Select role", 0);
   
    var roles = new Array();
	
	 roles[0] = "Developer";
	 roles[1] ="Tester";
	 roles[2] ="Test_Manager";
	
    if (roles != undefined) {
        for (t = 0; t < roles.length; t++) {
            select[t + 1] = new Option(roles[t]);
        }
    }
    var projects1 =localStorage.getItem('role');    

    $('#roles option')
    .filter(function() {  return $.trim( $(this).text() ) == projects1; })
    .attr('selected',true);

    
     $("#roles").change(function() {

        var selectedText = $(this).find("option:selected").text();
        var selectedVal = $(this).find("option:selected").text();
        var selectedValue = $(this).val();
        localStorage.setItem('role', selectedText);
		sessionStorage.setItem('roles', selectedVal);

    });
} */

//Changed role based on organization
function addRoles(eleMentId,responseObj) {
	
    var select = document.getElementById(eleMentId);
	document.getElementById(eleMentId).options.length=0;
	// Set dropdown box reference 
	select[0] = new Option("Select role", 0);
    
	  var roles = new Array();
	var rolesList = responseObj;
	var cnt = 0;
	for (var i = 0; i < rolesList.roles.length; i++) {
		if(rolesList.roles[i].roleName.toLowerCase().indexOf("admin") == -1)
		{
			roles[cnt] =  rolesList.roles[i].roleName;
			cnt++;
		}
       
    }
	
    if (roles != undefined) {
        for (t = 0; t < roles.length; t++) {
            select[t + 1] = new Option(roles[t]);
        }
    }
    var projects1 =localStorage.getItem('role');    

    $('#roles option')
    .filter(function() {  return $.trim( $(this).text() ) == projects1; })
    .attr('selected',true);

    
     $("#roles").change(function() {

        var selectedText = $(this).find("option:selected").text();
        var selectedVal = $(this).find("option:selected").text();
        var selectedValue = $(this).val();
        localStorage.setItem('role', selectedText);
		sessionStorage.setItem('roles', selectedVal);

    });
}


/* Redirect the page to last accessed url based on local storage value */
function getLocalstorage() {



    var lastAccessedPage = null; //localStorage.getItem("page");
	var redirectURL = localStorage.getItem("redirectURL");

    var pageURL = null;

    if (lastAccessedPage != null) {

        pageURL = iseConstants.url + "/#" + lastAccessedPage;
        $(location).attr('href', pageURL);

    } else {

		if(redirectURL != null) {
			localStorage.removeItem("redirectURL");
			$(location).attr('href', redirectURL);
		}
		else {
        //pageURL = iseConstants.url + "/#general";
			
			var isNewUser = localStorage.getItem('isnewuser');
			
			if(isNewUser == 'true'){
				pageURL = iseConstants.url + "/#IF_projects";
			}else{
				pageURL = iseConstants.url; //+ "/#general";
			}
		
			$(location).attr('href', pageURL);
		}
    }

}


/* Redirect the page to last accessed url or login page if user has not logged in. */
function validateAndSubmit() {

			pwdViaMail = false;
			$('#login-form .alert-success').hide();
			$('#login-form .alert-info').hide();
			$('#login-form .alert-danger').hide();
			

    var username = $('#username').val();
    var password = $('#password').val();
	var organization = $('#organization').val();
	
	if( username == 'undefined' || username == null || username == 'null'  || username == ""){
				$('#login-form .alert-danger #alertBtn').html( '<label data-localize="language.Please provide username">Please provide username.</label>' );
				$('#login-form #username').focus();
				$('#login-form .alert-danger').show();
				initLocalization();
				
	} else if( password == 'undefined' || password == null || password == 'null'  || password == ""){
				$('#login-form .alert-danger #alertBtn').html( '<label data-localize="language.Please provide password">Please provide password.</label>' );
				$('#login-form #password').focus();
				$('#login-form .alert-danger').show();
				initLocalization();
	} 
	else if( organization == 'undefined' || organization == null || organization == 'null'  || organization == "" || organization == 0 ) 
	{
		$('#login-form .alert-danger #alertBtn').html( '<label data-localize="language.Please select organization">Please select organization.</label>' );
		$('#login-form #organization').focus();
		$('#login-form .alert-danger').show();
		initLocalization();
	}
	else {				
			var organizationName = $('#organization option:selected').text();
			//alert($('#licenseAgreeChkBox').attr('checked'));
			if(!$("input[type=checkbox]:checked#checkbox1").length > 0){ //licenseAgreeChkBox
				
				$('#login-form .alert-danger #alertBtn ').html( '<label data-localize="language.You have to accept terms & conditions">You have to accept terms & conditions.</label>' );
				$('#login-form #checkbox1').focus();
				$('#login-form .alert-danger').show();
				initLocalization();
				return;
				initLocalization();
				
				/* 
				
				alert("You have to accept terms & conditions.");
				return; */
			}
			
			
			//while loading
			
			localStorage.setItem(username,"exists");
			//localStorage.setItem('organization',organization);
			//Added code for CISCO 
			if(iseConstants.organization != '' && iseConstants.organization != undefined && iseConstants.organization.toLowerCase() == 'cisco')
			{
				localStorage.setItem('organization',iseConstants.organization);
			}
			else
			{
				localStorage.setItem('organizationName', organizationName);
				localStorage.setItem('organization',organization);
			}
			//END
			localStorage.setItem('elasticsearchHost',iseConstants.elasticsearchHost);

			 localStorage.setItem('username', username);
			 localStorage.setItem('password', password);
			
				if(organization !=undefined)
				{
					modifiedorg = parseInt(organization)
				}
				var objAuthenticateUser = ISE.authenticateUser(username, password, modifiedorg);
				
			   if( objAuthenticateUser.result == "Invalid_License"){
				
				setErrorMessage(iseConstants.str_login_License_ErrorMsg);
				}else if (objAuthenticateUser.result == 'Success') {
			
					ISEUtils.processAuthResponse(objAuthenticateUser);
					
					ISEUtils._fillSessionStorageValues();
					
						//SURESH Usage
						var usageData = new Object();
			
						var cnt=0;
						jQuery.each( jQuery.browser, function( key, val ) {
							  if(cnt==0)
								usageData.browser=key;
							  if(cnt==1)
								usageData.version=val;
							  cnt++;
							});
							
						usageData.height=jQuery(window).height(); 
						usageData.width=jQuery(window).width();
						usageData.language=navigator.language || navigator.userLanguage;
						var d = new Date()
						var n = d.getTimezoneOffset();
						usageData.offset=n;	//this needs to be re-visit
						usageData.organization = localStorage.getItem('organization');
						usageData.redirectURL  = ""+localStorage.getItem("redirectURL");
						ISEUtils.logUsageMetrics("login", usageData);
						//SURESH Usage
					setTimeout(function() {	
			
								var localStorageValue = localStorage.getItem("login");
			
								if (localStorageValue == "false" && localStorageValue != null) {
			
									localStorage.setItem('login', 'true');
									var redirectURL = localStorage.getItem("redirectURL");
			
									if (redirectURL != null) {
										$(location).attr('href', redirectURL);
									} else {
			
										var pageURL = iseConstants.url + "/#" + lastAccessedPage;
										$(location).attr('href', pageURL);
									}
									return;
								}
								else
								{
								localStorage.removeItem("redirectURL");
								getLocalstorage();
								localStorage.setItem('login', 'true');
								}	
					},500); // Delay 500 milliseconds to log usage ..
					
				}
				else if (objAuthenticateUser.result  == 'InActiveUser')
				{
					setErrorMessage("In-active User !! Please contact Admin for activation.");
				}	
				else if(objAuthenticateUser.result  == 'userSignUp'){
					
					
					$('#emailMandatory').css('visibility', 'hidden');
					var projects = ISE._getAllProjects() // To get list of projects
					addProjects("project", projects);
					var Roles = ISE._getAllRoles()
					addRoles("role",Roles); // To get list of roles
					document.getElementById("signinusername").value = $('#username').val();
					document.getElementById("org").value = $('#organization option:selected').text();	
					$('#login-form .alert-info #alertBtn').html( 'You are the new user, <a href="javascript:;" onclick="$(&quot;#signupdivid&quot;).modal(&quot;show&quot;);"> click here </a> to signup.' );
					$('#login-form .alert-info').show();


	} else if (objAuthenticateUser.result == 'createUser') {

	    // when self sign-in is false and AD flag is true
        // special case for IKE    
	    var appName = window.location.pathname.split("/")[1];

	    if (appName.includes('IKE')) {

	        $('#login-form .alert-info #alertBtn').html('Sorry,You are not authorized to access');
	        $('#login-form .alert-info').show();
	        return;
	    }

				
					var username 	= $('#username').val();
					var password 	= localStorage.getItem('password');
					var project		=  getLastProjectByDate();
					var  orgId=  localStorage.getItem('organization');
					var role 		= "Developer" ;		
					var fullName 	= "";
					var emailId 	= "";
					var department 	= ""
					var organization	= "";
					if(project != null && project != 'undefined' && project!= 'Select project' && role != 'Select role' && role != null && role != 'undefined'){
				 
						 localStorage.setItem('username', username);
						 localStorage.setItem('password', password);
						
							var objAuthenticateUser = ISE.signUpUser("", username, password, fullName, organization, emailId, "", "", role, department, "", orgId, null,project);
							console.log(objAuthenticateUser);
							if(objAuthenticateUser.result == "Success"){
							
							$('#login-form .alert-success #alertBtn').html( 'Your credentials added successfully, please login now.' );
							$('#login-form .alert-success').show();
							$('#login-form .alert-info').hide();
							$('#login-form #password').val('')
							$('#login-form #password').focus();
							}
						}	
							
				}else if(objAuthenticateUser.result  == 'pwdSentViaMail'){ 
					pwdViaMail = true;
					var projects = ISE._getAllProjects() // To get list of projects
					addProjects("project", projects);
					var Roles = ISE._getAllRoles()
					addRoles("role",Roles); // To get list of roles
					document.getElementById("signinusername").value = $('#username').val();
					document.getElementById("org").value = $('#organization option:selected').text();			
					$('#emailMandatory').css('visibility', 'visible');
					$('#login-form .alert-info #alertBtn').html( '<label data-localize="language.You are the new user">You are the new user,</label> <a href="javascript:;" onclick="$(&quot;#signupdivid&quot;).modal(&quot;show&quot;);"> <label data-localize="language.click here">click here ..</label></a><label data-localize="language.to signup"> to signup.</label>' );
					$('#login-form .alert-info').show();
					initLocalization();

				}else{
					setErrorMessage(iseConstants.str_login_ErrorMsg);
				}
	} 
}

/* sign up */
function signupSubmit() {	
	var username 	= $('#signinusername').val();
    var password 	= localStorage.getItem('password');//$('#signinusername').val();
    var organization = $('#org').text();
	var fullName 	= $('#fullName').val();
	var emailId 	= $('#emailId').val();
	var department 	= $('#department').val();
	var orgId 		= $('#organization').val();
	var project		= $('#project option:selected').text();
	var role 		= $('#role option:selected').text();
	
	if(project != null && project != 'undefined' && project!= 'Select project' && role != 'Select role' && role != null && role != 'undefined'){
	
			if( pwdViaMail && (emailId == 'undefined' || emailId == null || emailId == 'null'  || emailId == "")){
				setErrorMessage("Please fill mandatory fields");
			} else{
					 localStorage.setItem('username', username);
					 localStorage.setItem('password', password);
					
					var objAuthenticateUser = ISE.signUpUser("", username, password, fullName, organization, emailId, "", "", role, department, "", orgId, null,project);
						
					
					if(objAuthenticateUser.result == "Success"){
					
						if( objAuthenticateUser.pwdViaMailFlag && objAuthenticateUser.pwdViaMailFlag == 'true' ){
								 ISE.sendMail( objAuthenticateUser.mailPwd, emailId, sendMailCallBackFunction);
						}		
						$("#signupdivid").modal("hide");
						if( objAuthenticateUser.pwdViaMailFlag && objAuthenticateUser.pwdViaMailFlag == 'true' ){
							$('#login-form .alert-success #alertBtn').html( 'Password sent to your email, please login with that' );
						}
						else if (objAuthenticateUser.AUTO_ACTIVATE == "false")
						{
							$('#login-form .alert-success #alertBtn').html( 'Sign Up successful, please contact Admin for activation.' );
						}						
						else
						{
							$('#login-form .alert-success #alertBtn').html( 'Sign Up successful, please login' );
						}
						
						
						$('#login-form .alert-danger').hide();
						$('#login-form .alert-success').show();
						$('#login-form .alert-info').hide();
						$('#login-form #password').val('')
						$('#login-form #password').focus();
						
						}
				}
    }else{
		setErrorMessage("Please fill mandatory fields")
	}
}

// added for signup user
function onsignUp(){

var resp = ISE.getAllOrganizations(); // To get list of organizations
    addOrganizations("org", resp);

}

function authenticationResponse(){
    
}

/* Display Error Message for Invalid Credentials  */
function setErrorMessage(errorMessage) {

        if (errorMessage == null || errorMessage == '') {
            $('.alert-danger', $('.login-form')).innerHTML = '<br>';
            $('.alert-danger', $('.login-form')).hide();
        } else {
            document.getElementById("alertBtn").innerText = errorMessage;
            $('.alert-danger', $('.login-form')).show();
        }
    }
    /* Remove Error Message when cursor points to username  */
$("#username").focus(function() {
    /*Set focus to Username */
    setErrorMessage(null);
});
$("#project").focus(function() {
    /*Set focus to Username */
    setErrorMessage(null);
});
$("#role").focus(function() {
    /*Set focus to Username */
    setErrorMessage(null);
});

/* Login Button Functionality */
$("#loginBtn").click(function() {
    validateAndSubmit();
});

/* signup Button Functionality */
$("#signupBtn").click(function() {
    signupSubmit();
});
$("#termsAndConditions").click(function() {
	displayEULA();
   // $("#agreementInfoModal").modal("show");
});
	

function Ext_Detect_NotInstalled(ExtName,ExtID) {
     
     var m = "<div style='width:100%;text-align:center;color:yellow;background-color:black;border-radius:3px;font-weight: bold;font-family:Courier;'>" ;
     m += "You have not installed ISE chrome plugin, "
     //m += "<a href='https://chrome.google.com/webstore/detail/ise-popup-v3/'"+ExtID+">click here</a>to install</div>" 
	 //m += "<a href='https://chrome.google.com/webstore/detail/ise-popup-v3/ceamnkabppogemcldjpljbdlaiahadpi'>click here</a>to install</div>" 
	 m += "<a href='https://chrome.google.com/webstore/detail/ise-quickaccess/ebpdmghjadigagmbnnngaafmdkikaphb'>click here</a>to install</div>" 
     
     //$('body').prepend(m); Commented this line to not to show, if you want un-comment it.
}

function Extension_Detect(ExtName,ExtID) {
    // SIMY: read https://developer.chrome.com/extensions/manifest/web_accessible_resources before implementing
    var s = document.createElement('img');
    s.onerror = function(){Ext_Detect_NotInstalled(ExtName,ExtID);};
    s.src = 'chrome-extension://' + ExtID + '/Logo.png';
	s.setAttribute('style','display:none');
    document.body.appendChild(s);
}
function getLastProjectByDate(){
	
	var responseObj = ISE._getAllProjects();
	var projectList = JSON.parse(JSON.stringify(responseObj));
	if( projectList.projects[0].PROJECT_NAME != undefined){
	var lastProject =  projectList.projects[0].PROJECT_NAME;
	}
	var lastDate = new Date();
	if (projectList != undefined) {
			firstValue = (projectList.projects[0].UPDATED_ON).split('-');
			var lastDate=new Date();
			lastDate.setFullYear(firstValue[0],(firstValue[1] - 1 ),firstValue[2]);
	}
	for (var i = 1; i < projectList.projects.length; i++) {  
		var secondValue =  (projectList.projects[i].UPDATED_ON).split('-');
		var tempDate=new Date();
		tempDate.setFullYear(secondValue[0],(secondValue[1] - 1 ),secondValue[2]);   
		if (tempDate > lastDate){
				lastProject =  projectList.projects[i].PROJECT_NAME;
		}
    }
   return lastProject;

}

function sendMailCallBackFunction(sendMailCallBackFunction) {
	console.log("sendMailCallBackFunction : ");
	console.log(sendMailCallBackFunction);
}

function displayEULA() {
	//console.log("displayEULA : ");
	 $.ajax({ type : 'GET', 
			  dataType : 'text', 
			  async: true, 
			  url : '/DevTest/config/EULA.txt',		  
			 success : function(result) {
							//console.log(result);
							$("#agreementModalInfo").html(result);
							$("#agreementInfoModal").modal("show");
						},
			error: function(msg) {		
					console.log(msg);
					}
			} );

}
function _handleUniform() {
	if (!$().uniform) {
		return;
	}
	var test = $("input[type=checkbox]:not(.toggle, .md-check, .md-radiobtn, .make-switch, .icheck), input[type=radio]:not(.toggle, .md-check, .md-radiobtn, .star, .make-switch, .icheck)");
	if (test.size() > 0) {
		test.each(function() {
			if ($(this).parents(".checker").size() === 0) {
				$(this).show();
				$(this).uniform();
			}
		});
	}
}

function initLocalization(){
	if( localStorage.getItem("LanguageName") && localStorage.getItem("LanguageName").length > 0 )
			var languageName =  localStorage.getItem("LanguageName") 
		else
			var languageName = iseConstants.languagename
	 /* if(languageName=="")
		languageName="en";  */
	
	var pathName = 'json/localization/'+languageName;
	var opts = { language: languageName, pathPrefix: pathName, skipLanguage: "en-US" };
	$("[data-localize]").localize("login", opts);
}