//Application logic

var watchID;
var geoLoc;
var TotalDistance = 0.0;
var TotalCalories = 0.0;
var LastPosition = '';
 var stopwatch;
    var runningstate = 0; // 1 means the timecounter is running 0 means counter stopped
    var stoptime = 0;
    var lapcounter = 0;
    var currenttime;
    var lapdate = '';
    var lapdetails;
    var mFormattedDuration = "";
	var TestCount = 0;
	var LocationCount = 0;
	var LocationCount_Total = 0;
	var LocationCount_background = 0;
	var LocationTimeStamp = 0;
	//var bgGeo = null;
	var nextToken = 0;
	var TotalRunCount = 0;
	
	var nextToken_GroupMember = 0;
	var Total_GroupMemberCount = 0;
	
	var StaticAPI = "AIzaSyAFirO39qok7sQjlQ9leVAcDqdFGQNt8Yc";
var opts = {
	  lines: 12, // The number of lines to draw
	  length: 10, // The length of each line
	  width: 4, // The line thickness
	  radius: 10, // The radius of the inner circle
	  corners: 1, // Corner roundness (0..1)
	  rotate: 0, // The rotation offset
	  color: '#222', // #rgb or #rrggbb
	  speed: 1, // Rounds per second
	  trail: 60, // Afterglow percentage
	  shadow: false, // Whether to render a shadow
	  hwaccel: false, // Whether to use hardware acceleration
	  className: 'spinner', // The CSS class to assign to the spinner
	  zIndex: 2e9, // The z-index (defaults to 2000000000)
	  top: '200px', // Top position relative to parent in px
	  left: 'auto', // Left position relative to parent in px
	  position: 'relative'
	};	 
	
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

var spinner = null;	 

//document ready
$(document).ready(function(){
	localStorage.setItem("run_fresh", "true");
	
	var AccessToken = window.localStorage.getItem('AccessToken');
	if(AccessToken == null)
	{
		localStorage.setItem("run_fresh", "true");
		location.hash = "#LoginPage";
		
	}
	else
	if(AccessToken == "")
	{
		localStorage.setItem("run_fresh", "true");
		location.hash = "#LoginPage";
	}
	else
	{
		//SyncToServer();
		async(function() {
			UserSummary();
		}, null);
		
		//$("button").click(function(){
			//$("p").slideToggle();
			
		//});
		
		$(function() {
			/*$(".evtHistory").live('click', function(){
				var a = this;
				var id = a.id.replace("Historyinfo-", "");
				location.hash = "#runMap";
			});*/
		});
	}
});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
		document.addEventListener("resume", onResume, false);
		try{
			//bgGeo = window.plugins.backgroundGeoLocation;
			//alert("a:" + window.plugins.backgroundGeoLocation);
			//alert("b:" + window.backgroundGeolocation);
			//alert("c:" + window.BackgroundGeolocation);
		}
		catch(err)
		{
			alert(err);
		}
		cordova.plugins.notification.local.on("click", function (notification) {
			if (notification.id == 1) {
				//joinMeeting(notification.data.meetingId);
				//alert("Clicked!");
				
			}
		});


		// Notification has reached its trigger time (Tomorrow at 8:45 AM)
		cordova.plugins.notification.local.on("trigger", function (notification) {
			try
			{
				if (notification.id != 1)
					return;

				/*cordova.plugins.notification.local.update({
					id: 10,
					text: 'You started RUN. Duration: ' + mFormattedDuration,
					every: 'second'
				});*/
				// After 10 minutes update notification's title 
				/*setTimeout(function () {
					cordova.plugins.notification.local.update({
						id: 10,
						title: "You started RUN. Duration: " + mFormattedDuration
					});
				}, 1000);*/
			}
			catch(err)
			{
				alert(err);
			}
		});	
		
		//================= configure geolocation background ==========================
	}

function onResume()
{
	
	var isStartRun = localStorage.getItem("IsStartRun");
	//alert(isStartRun);
	if(isStartRun == "true")
	{
		UpdateNotification();
	}
}
	
function async(your_function, callback) {
    setTimeout(function() {
        your_function();
        if (callback) {callback();}
    }, 500);
}

//evtStopRun
$(document).on('click', '.evtStopRun', function (event, data) {
	StopRun();
});
//evtBack
$(document).on('click', '.evtBack', function (event, data) {

	window.history.back();

});

$(document).on('click', '.evtRegister', function (event, data) {
	
	//check 
	if($("#signup_displayname").val() == "")
	{
		document.getElementById('lblRegister').innerHTML = "Please fill up your particular, email address and password";
		$("#lblRegister").css({"color":"#F4141C"});
		return;
	}
	if($("#signup_username").val() == "")
	{
		document.getElementById('lblRegister').innerHTML = "Please fill up your particular, email address and password";
		$("#lblRegister").css({"color":"#F4141C"});
		return;
	}
	if($("#signup_password").val() == "")
	{
		document.getElementById('lblRegister').innerHTML = "Please fill up your particular, email address and password";
		$("#lblRegister").css({"color":"#F4141C"});
		return;
	}
	if($("#signup_confirmpassword").val() == "")
	{
		document.getElementById('lblRegister').innerHTML = "Please fill up your particular, email address and password";
		$("#lblRegister").css({"color":"#F4141C"});
		return;
	}
	if($("#signup_password").val() != $("#signup_confirmpassword").val())
	{
		document.getElementById('lblRegister').innerHTML = "Password not match";
		$("#lblRegister").css({"color":"#F4141C"});
		return;
	}
	//var win = window.open("index.html", '_self');
	//return;
	$.mobile.loading("show", {
		text: "Please Wait..",
		textVisible: true,
		theme: "b"
	});
	 $.post("http://www.aktifpenang.com/api/_api_register.php", 
		{
			displayname: $("#signup_displayname").val(),
			username: $("#signup_username").val(),
			password: $("#signup_password").val() 
		}, 
		function(result){
			$.mobile.loading("hide");
			var obj = JSON.parse(result);
			if(obj.status == true)
			{
				if(navigator.notification)
				{
					navigator.notification.alert(
						'Register Successfully. Please login with your credential now.',
						function() {},
						'Join Group',
						'OK'
					);
					var win = window.open("index.html", '_self');
				}
				else
				{
					alert("Register Successfully. Please login with your credential now.");
					var win = window.open("index.html", '_self');
				}
				
			}
			else
			{
				document.getElementById('lblRegister').innerHTML = "Error signing up. Please try again.";
				$("#lblRegister").css({"color":"#F4141C"});
				return;
			}
		}
	);
});

$(document).on('click', '.evtHistory', function (event, data) {
	var a = this;
	var id = a.id.replace("Historyinfo-", "");
	//var result = window.localStorage.getItem("aktif_runHistory");
	var result = window.localStorage.getItem("aktif_runHistory_Individual")
	var objGroup = JSON.parse(result);
	for(var i = 0; i < objGroup.length; i++) {
		var obj = objGroup[i];
		if(obj.activityid == id)
		{
			
			localStorage.setItem("CurrentRun_id", id);
			localStorage.setItem("CurrentRun_Duration", obj.duration);
			localStorage.setItem("CurrentRun_Distance", obj.distance);		
			localStorage.setItem("CurrentRun_Map", obj.map);
			localStorage.setItem("CurrentRun_Date", obj.rundate);
			location.hash = "#runMap";
			break;
		}
	}
	/*for(var i = 0; i < objGroup.runs.length; i++) {
		var obj = objGroup.runs[i];
		if(obj.activityid == id)
		{
			
			localStorage.setItem("CurrentRun_id", id);
			localStorage.setItem("CurrentRun_Duration", obj.duration);
			localStorage.setItem("CurrentRun_Distance", obj.distance);		
			localStorage.setItem("CurrentRun_Map", obj.map);
			localStorage.setItem("CurrentRun_Date", obj.rundate);
			location.hash = "#runMap";
			break;
		}
	}*/
});

$(document).on('click', '.evtGroup', function (event, data) {
	var a = this;
	var id = a.id.replace("groupinfo-", "");
	var result = window.localStorage.getItem("aktif_Groups");
	var objGroup = JSON.parse(result);
	for(var i = 0; i < objGroup.group.length; i++) {
		var obj = objGroup.group[i];
		if(obj.id == id)
		{
			localStorage.setItem("CurrentGroup_id", id);
			localStorage.setItem("CurrentGroup_Name", obj.name);
			localStorage.setItem("CurrentGroup_Distance", obj.totaldistance);		
			localStorage.setItem("CurrentGroup_Icon", obj.group_icon);
			localStorage.setItem("CurrentGroup_Image", obj.group_image);	
			localStorage.setItem("CurrentGroup_Tagline", obj.tagline);
			localStorage.setItem("CurrentGroup_Member", obj.membercount);
			
			
			location.hash = "#individualGroupPage";
			break;
		}
	}
	
});

 $(document).on('click', '.evtJoin', function (event, data) {
	var a = this;
	var id = $('#btnJoinGroup' + '').val();
	 var mToken = window.localStorage.getItem("AccessToken");
	 $.post("http://www.aktifpenang.com/api/_api_group_join.php", 
	{
		token: mToken,
		groupname: id,
		action: 'join'
	}, 
	function(result){
		var obj = JSON.parse(result);
		if(obj.status == true)
		{
			localStorage.setItem("group_fresh", "true");
			window.history.back();
			//location.hash = "#individualGroupPage";
		}
		else
		{
			if(navigator.notification)
			{
				navigator.notification.alert(
					'Error joining this group, please try again later.',
					function() {},
					'Join Group',
					'OK'
				);
			}
			else
			{
				alert("Error joining this group, please try again later");
			}
		}
	});
});

 $(document).on('click', '.evtLeave', function (event, data) {
	var a = this;
	var id = $('#btnLeaveGroup' + '').val();
	 var mToken = window.localStorage.getItem("AccessToken");
	 $.post("http://www.aktifpenang.com/api/_api_group_join.php", 
	{
		token: mToken,
		groupname: id,
		action: 'leave'
	}, 
	function(result){
		var obj = JSON.parse(result);
		if(obj.status == true)
		{
			localStorage.setItem("group_fresh", "true");
			window.history.back();
			//location.hash = "#individualGroupPage";
		}
		else
		{
			if(navigator.notification)
			{
				navigator.notification.alert(
					'Error Leaving Group. Please try again later.',
					function() {},
					'Leave Group',
					'OK'
				);
			}
			else
			{
				alert("Error leaving this group, please try again later");
			}
		}
	});
	
});


$(document).on("scrollstop", function (e) {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
        screenHeight = $.mobile.getScreenHeight(),
        contentHeight = $(".ui-content", activePage).outerHeight(),
        header = $(".ui-header", activePage).outerHeight() - 1,
        scrolled = $(window).scrollTop(),
        footer = $(".ui-footer", activePage).outerHeight() - 1,
        scrollEnd = contentHeight - screenHeight + header + footer;
    $(".ui-btn-left", activePage).text("Scrolled: " + scrolled);
    $(".ui-btn-right", activePage).text("ScrollEnd: " + scrollEnd);
    if (activePage[0].id == "historyPage" && scrolled >= scrollEnd) {
        //console.log("adding...");
        addMoreRun(activePage);
    }
	else  if (activePage[0].id == "individualGroupPage" && scrolled >= scrollEnd) {
		 addMoreGroupMember(activePage);
	}
	
});

//display alert box when submit button clicked(testing)
function disp_alert(email) {
        alert(email + ", login successfulled.");
     }
     
function reset_alert(email) {
        alert(email + ", reset password.");
    }
    
function ResetPassword()
{
	var email = $("#reset_email").val();
	if(email == "")
	{
		if(navigator.notification)
			{
				navigator.notification.alert(
					'Please enter your email address.',
					function() {},
					'Reset Password',
					'OK'
				);
			}
			else
			{
				alert("Please enter your email address.");
			}
		return;
	}
	 var toAdd = document.getElementById('forgotPasswordPage');
	var left = window.innerWidth/2 - 20;
	opts.left = left + 'px';
	spinner = new Spinner(opts).spin(toAdd);
	
	$.post("http://www.aktifpenang.com/api/_api_resetpassword.php", 
	{
		token: email
	}, 
	function(result){
		spinner.stop();
		var obj = JSON.parse(result);
		if(obj.status == true)
		{
			if(navigator.notification)
			{
				navigator.notification.alert(
					'Password reset successful. Please chheck your registered email account for termporally password.',
					function() {},
					'Reset Password',
					'OK'
				);
			}
			else
			{
				alert("Password Reset Successful, Please check your registered email account for temporally password.");
			}
			Logout();
		}
		else
		{
			if(navigator.notification)
			{
				navigator.notification.alert(
					'Password reset error: ' + obj.extra,
					function() {},
					'Reset Password',
					'OK'
				);
			}
			else
			{
				alert("Password Reset Error: " + obj.extra);
			}
		}
	});
}

function ChangePassword()
{
	var mToken = window.localStorage.getItem("AccessToken");
	var old_password = $("#oldpassword").val();
	var newpassword = $("#newpassword").val();
	var newpassword_confirm = $("#newpassword_confirm").val();
	
	if(newpassword == newpassword_confirm)
	{
		 var toAdd = document.getElementById('changePasswordPage');
		var left = window.innerWidth/2 - 20;
		opts.left = left + 'px';
		spinner = new Spinner(opts).spin(toAdd);
		 $.post("http://www.aktifpenang.com/api/_api_changepassword.php", 
		{
			token: mToken,
			oldpassword: old_password,
			newpassword: newpassword_confirm
		}, 
		function(result){
			spinner.stop();
			var obj = JSON.parse(result);
			if(obj.status == true)
			{
				if(navigator.notification)
				{
					navigator.notification.alert(
						'Change Password Successful. Please Login with new password.',
						function() {},
						'Change Password',
						'OK'
					);
				}
				else
				{
					alert("Change Password Successful. Please Login with new password.");
				}
				Logout();
			}
			else
			{
				if(navigator.notification)
				{
					navigator.notification.alert(
						'Change Password Failed. Please try again later',
						function() {},
						'Change Password',
						'OK'
					);
				}
				else
				{
					alert("Change Password Failed. Please try again later.");
				}
			}
		});
	}
	else
	{
		if(navigator.notification)
		{
			navigator.notification.alert(
				'Please ensure new password and confirm password is same',
				function() {},
				'Change Password',
				'OK'
			);
		}
		else
		{
			alert("Please ensure new password and confirm password is same.");
		}
	}
	
}

function LoginEmail()
{
	if($("#username").val() == "")
	{
		document.getElementById('lblLogin').innerHTML = "Please fill up your email address and password";
		$("#lblLogin").css({"color":"#F4141C"});
		return;
	}
	if($("#password").val() == "")
	{
		document.getElementById('lblLogin').innerHTML = "Please fill up your email address and password";
		$("#lblLogin").css({"color":"#F4141C"});
		return;
	}
	 var name = document.getElementById("username").value;
     var pass = document.getElementById("password").value;
	 
	 var toAdd = document.getElementById('EmailLoginPage');
	var left = window.innerWidth/2 - 20;
	opts.left = left + 'px';
	spinner = new Spinner(opts).spin(toAdd);
	
	 $.post("http://www.aktifpenang.com/api/_api_login.php", {username: name, password:pass}, function(result){
        //$("span").html(result);
		spinner.stop();
		var obj = JSON.parse(result);
		//window.localStorage.getItem('AccessToken')
		if(obj.status == true)
		{
			if(obj.token != "")
			{
				window.localStorage.setItem("AccessToken", obj.token);
				window.localStorage.setItem("LoginType", "email");
				window.localStorage.setItem("UserID", name);
				//var url = "main1.html";
				//var win = window.open(url, '_self');
				location.hash = "#";
				UserSummary();
			}
		}
		else
		{
			document.getElementById('lblLogin').innerHTML = "Invalid email and password.";
			$("#lblLogin").css({"color":"#F4141C"});
			return;
		}
		//alert(obj.token);
    });
}

function LoginFacebook()
{
	//alert("Start FB Login");
	try {
		//facebookConnectPlugin.browserInit("1575196586053265");
		 facebookConnectPlugin.logout( 
                    function (response) { 
						//alert("logout DONE");
						facebookConnectPlugin.login( ["email"], 
							function (response) 
							{	
								try {
									//alert(JSON.stringify(response));
									//var obj = JSON.parse(response);
									//alert("status:" + response.authResponse.email);
									if(response.status == "connected")
									{	
										var t = response.authResponse.accessToken;
										//alert("token:" + t);
										//alert("user:" + response.authResponse.userID);
										window.localStorage.setItem("AccessToken", t);
										window.localStorage.setItem("LoginType", "facebook");
										window.localStorage.setItem("UserID", response.authResponse.userID);
										
										var mUserID = response.authResponse.userID;
										
										facebookConnectPlugin.api( "/me", null,
											function (response) 
											{ 
												//alert(JSON.stringify(response)) 
												window.localStorage.setItem("UserName", response.name);
												$.mobile.loading("show", {
													text: "Please Wait..",
													textVisible: true,
													theme: "b"
												});
												try
												{
													$.post("http://www.aktifpenang.com/api/_api_loginFb.php", 
													{
														fbuserid: mUserID,
														fbusername: response.name,
														fbemail: '',
														token: t
													}, 
													function(result){
														$.mobile.loading("hide");
														//var url = "main1.html";
														//var win = window.open(url, '_self');
														location.hash = "#";
														UserSummary();
													});
												}
												catch(err)
												{
													$.mobile.loading("hide");
													alert(err);
												}
											},
											function (response) { 
												//alert(JSON.stringify(response)) 
											}); 
										/*
										*/
										
									}
									else
									{
										if(navigator.notification)
										{
											navigator.notification.alert(
												'Error logging in',
												function() {},
												'Facebook Login',
												'OK'
											);
										}
										else
										{
											alert("Error Logging in.");
										}
									}
									//alert(JSON.stringify(response)) 
								}
								
								catch(err) {
									alert(err.message);
								}
							},
							function (response) { alert(JSON.stringify(response)) });
					},
                    function (response) { alert(JSON.stringify(response)) });
		
	}
	catch(err) {
		alert(err.message);
	}
	
}

function UserSummary()
{
	 var mToken = window.localStorage.getItem("AccessToken");
	 if(mToken != null)
	 {
	 $.get("http://www.aktifpenang.com/api/_api_usersummary.php", 
		{
			token: mToken
		}, 
		function(result){
			//$("span").html(result);
			var obj = JSON.parse(result);
			window.localStorage.setItem("CampaignUser", obj.summary[0].CampaignUser);
			window.localStorage.setItem("CampaignDistance", obj.summary[0].CampaignDistance);
			window.localStorage.setItem("shortname", obj.summary[0].shortname);
			window.localStorage.setItem("firstname", obj.summary[0].firstname);
			window.localStorage.setItem("lastname", obj.summary[0].lastname);
			window.localStorage.setItem("userimage", obj.summary[0].userimage);
			window.localStorage.setItem("TotalRuns", obj.summary[0].TotalRuns);
			window.localStorage.setItem("TotalDistance", obj.summary[0].TotalDistance);
			window.localStorage.setItem("TotalEvents", obj.summary[0].TotalEvents);

			displayUserSummary("Index");
			/*var distance = obj.summary[0].CampaignDistance;
			distance = distance / 1000.0;
			distance = Math.round(distance * 100) / 100;
			$("#CampaignSummary").html("" + obj.summary[0].CampaignUser + " members | Distance: " + distance + "km" );
			$("#username").html("" + obj.summary[0].firstname + " " + obj.summary[0].lastname + "" );
			$("#userSummary").html("" + obj.summary[0].TotalRuns + " runs | Distance: " + distance + "km | Groups: " + obj.summary[0].TotalEvents );
			
			if(window.localStorage.getItem("LoginType") == "facebook")
			{
				imageURL = "https://graph.facebook.com/" + window.localStorage.getItem("UserID") + "/picture?type=large";
				$("#userImage").css({'background-image':'url('+imageURL+')'});
			}*/
			
			
			UserProfile();
			//alert(obj.token);
		});
	}
}

function displayUserSummary(divId)
{
	var CampaignUser = window.localStorage.getItem("CampaignUser");
	var CampaignDistance = window.localStorage.getItem("CampaignDistance");
	var firstname = window.localStorage.getItem("firstname");
	var lastname = window.localStorage.getItem("lastname");
	var userimage = window.localStorage.getItem("userimage");
	var TotalRuns = window.localStorage.getItem("TotalRuns");
	var TotalDistance = window.localStorage.getItem("TotalDistance");
	var TotalEvents = window.localStorage.getItem("TotalEvents");
    var shortName = window.localStorage.getItem("shortname");
	
	var distance = CampaignDistance;
	distance = distance / 1000.0;
	distance = Math.round(distance * 100) / 100;
	
	var userTotalDistance = TotalDistance;
	userTotalDistance = userTotalDistance / 1000.0;
	userTotalDistance = Math.round(userTotalDistance * 100) / 100;
	
	//$("#CampaignSummary"+ divId).html("" + CampaignUser + " members | Distance: " + distance + "km" );
	$("#CampaignSummary").html("" + CampaignUser + " members | Distance: " + distance + "km" );
	if(firstname == "" && lastname == "")
	{
		$("#username"+ divId).html("" + shortName + "" );
	}
	else
	{
		$("#username"+ divId).html("" + firstname + " " + lastname + "" );
	}
	$("#userSummary"+ divId).html("" + TotalRuns + " runs | Distance: " + userTotalDistance + "km | Groups: " + TotalEvents );
	
	if(window.localStorage.getItem("LoginType") == "facebook")
	{
		imageURL = "https://graph.facebook.com/" + window.localStorage.getItem("UserID") + "/picture?type=large";
		$("#userImage"+ divId).css({'background-image':'url('+imageURL+')'});
	}
}

function LeaderBoard()
{
	var toAdd = document.getElementById('leaderBoardPage');
	var left = window.innerWidth/2 - 20;
	opts.left = left + 'px';
	spinner = new Spinner(opts).spin(toAdd);	
						
	 var mToken = window.localStorage.getItem("AccessToken");
		$.get("http://www.aktifpenang.com/api/_api_leader_get.php", 
		{
			token: mToken
		}, 
		function(result){
			
			spinner.stop();
			//$("span").html(result);
			var objLeader = JSON.parse(result);
			var panelMain = $('#LeaderBoardMain' + '');
			panelMain.empty();
			var html = '<div id="" class="" style="float:left;width:100%;margin-top:0px;background-color:#222;color:#fff;height:40px;line-Height:40px;padding-Left:10px;">Top Runners</div>';
			panelMain.append(html);
			
			for(var i = 0; i < objLeader.individual_leader.length; i++) {
				var obj = objLeader.individual_leader[i];	
				var mdistance = parseFloat(obj.totaldistance);
				var munit = "meter";
				if(mdistance > 1000.0)
				{
					mdistance = mdistance / 1000.0;
					munit = "km";
				}
				mdistance = Math.round(mdistance * 100) / 100;
				var imageURL = "";
				if(obj.logintype == "email")
				{
					imageURL = "images/icons/login.png";
				}
				else
				{
					imageURL = "https://graph.facebook.com/" + obj.username + "/picture?type=large";
				}
				var html = '<div id="Historyinfo-' + obj.id + '" class="" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(' + imageURL + ');border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
				'<div style="float:left;width:60%;"><span id="">' + obj.name + '</span></br><span id="" style="font-size:14px;color:#888;">'  + mdistance + munit +  '</span></div></div>';
				panelMain.append(html);
				panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
				
			}
			var html = '<div id="" class="" style="float:left;width:100%;margin-top:0px;background-color:#222;color:#fff;height:40px;line-Height:40px;padding-Left:10px;">Top Cycler</div>';
			panelMain.append(html);
			
			for(var i = 0; i < objLeader.cycling_leader.length; i++) {
				var obj = objLeader.cycling_leader[i];	
				var mdistance = parseFloat(obj.totaldistance);
				var munit = "meter";
				if(mdistance > 1000.0)
				{
					mdistance = mdistance / 1000.0;
					munit = "km";
				}
				mdistance = Math.round(mdistance * 100) / 100;
				var imageURL = "";
				if(obj.logintype == "email")
				{
					imageURL = "images/icons/login.png";
				}
				else
				{
					imageURL = "https://graph.facebook.com/" + obj.username + "/picture?type=large";
				}
				var html = '<div id="Historyinfo-' + obj.id + '" class="" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(' + imageURL + ');border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
				'<div style="float:left;width:60%;"><span id="">' + obj.name + '</span></br><span id="" style="font-size:14px;color:#888;">'  + mdistance + munit +  '</span></div></div>';
				panelMain.append(html);
				panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
				
			}
			var html = '<div id="" class="" style="float:left;width:100%;margin-top:0px;background-color:#222;color:#fff;height:40px;line-Height:40px;padding-Left:10px;">Top Groups</div>';
			panelMain.append(html);
			for(var i = 0; i < objLeader.group_leader.length; i++) {
				var obj = objLeader.group_leader[i];
				var distance = obj.group_distance;
				distance = distance / 1000.0;
				distance = Math.round(distance * 100) / 100;
				var html = '<div id="groupinfo" class="evtGroup" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(\'http://www.aktifpenang.com/group_images/' + obj.group_icon + '\');border-radius: 30px;width: 60px;height: 60px;float:left;background-size:contain;"></div>'+
							'<div style="float:left;width:60%;"><span id="">' + obj.group_name + '</span></br><span id="" style="font-size:14px;color:#555;">' + obj.tagline + '</span></br><span id="" style="font-size:14px;color:#888;">' +  distance + 'km</span></div>';
							

				html = html + '</div>';		
				panelMain.append(html);
				panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');				
			}
		}
	);
}

function Groups()
{
	var toAdd = document.getElementById('groupsPage');
	var left = window.innerWidth/2 - 20;
	opts.left = left + 'px';
	spinner = new Spinner(opts).spin(toAdd);	
	
		 var mToken = window.localStorage.getItem("AccessToken");
		 $.get("http://www.aktifpenang.com/api/_api_group_get.php", 
			{
				token: mToken,
				groupid: ''
			}, 
			function(result){
				//$("span").html(result);
				spinner.stop();
				var obj = JSON.parse(result);
				
					/*'id' => $id,
							'name' => $name,
							'tagline' => $tagline,
							'group_image' => $group_image,
							'group_icon' => $group_icon,
							'membercount' => $member,
							'totaldistance' => $totaldistance,
							'isGroup' => $isGroup,*/
							
							
				window.localStorage.setItem("aktif_Groups", result);
				objGroup = obj;
				var panelMain = $('#GroupMain' + '');
				panelMain.empty();
				for(var i = 0; i < objGroup.group.length; i++) {
					var obj = objGroup.group[i];
					var distance = obj.totaldistance;
					distance = distance / 1000.0;
					distance = Math.round(distance * 100) / 100;
					var html = '<div id="groupinfo-'+ obj.id + '" class="evtGroup" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(\'http://www.aktifpenang.com/group_images/' + obj.group_icon + '\');border-radius: 30px;width: 60px;height: 60px;float:left;background-size:contain;"></div>'+
								'<div style="float:left;width:60%;"><span id="">' + obj.name + '</span></br><span id="" style="font-size:14px;color:#555;">' + obj.tagline + '</span></br><span id="" style="font-size:14px;color:#888;">' + obj.membercount + 'members | ' +  distance + 'km</span></div>';
								
					if(obj.isGroup != "0")
					{
						html = html + '<div style="margin-left:0px;margin-bottom:0px;margin-right:0px;background-image:url(images/icons/tick.png);border-radius: 15px;width: 30px;height: 30px;float:right;background-size:contain;"></div>';
					}
					html = html + '</div>';
					
					
					panelMain.append(html);
					panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
					console.log(obj.name);
					console.log(obj.tagline);
					console.log(obj.membercount);
					
					console.log(distance + "km");
					console.log(obj.isGroup);
				}
				localStorage.setItem("group_fresh", "false");
				//alert(obj.token);
			});

}



function Runs(mRunid)
{
	var RefreshRun = localStorage.getItem("run_fresh");
	if(RefreshRun == "true")
	{
		nextToken = 0;
		var toAdd = document.getElementById('historyPage');
		var left = window.innerWidth/2 - 20;
		opts.left = left + 'px';
		spinner = new Spinner(opts).spin(toAdd);	
		 var mToken = window.localStorage.getItem("AccessToken");
		 $.get("http://www.aktifpenang.com/api/_api_usercheckin.php", 
			{
				token: mToken,
				runid: 'all'
			}, 
			function(result){
				//$("span").html(result);
				var obj = JSON.parse(result);
				spinner.stop();
				nextToken = obj.nexttoken;
				TotalRunCount = obj.total;
					/*'activityid' => $id,
						'distance' => $distance,
						'activity_type' => $activity_type,
						'duration' => $duration,
						'avepace' => $avepace,
						'workout_type' => $workout_type,
						'eventid' => $eventid,
						'rundate' => $rundate,
						'checkin_type' => $checkin_type,
						'map' => $_map,
						*/
							
							
				window.localStorage.setItem("aktif_runHistory", result);
				objGroup = obj;
				var panelMain = $('#HistoryMain' + '');
				panelMain.empty();
				window.localStorage.setItem("aktif_runHistory_Individual", "");
				for(var i = 0; i < objGroup.runs.length; i++) {
					var obj = objGroup.runs[i];
					
					var current_id = obj.activityid;
					var int_current_id = parseInt(current_id)  + 1;
					window.localStorage.setItem("aktif_nextt_activity_id", int_current_id);	
					
					var strObj = JSON.stringify(obj);
					strObj = strObj.replace("}","");
					strObj = strObj + ',"sync":"yes"}';
					var objStorage = "" + window.localStorage.getItem("aktif_runHistory_Individual");
					if(objStorage == "")
					{
						window.localStorage.setItem("aktif_runHistory_Individual", "[" + strObj);	
					}
					else
					{
						objStorage = objStorage.replace("]", "");
						window.localStorage.setItem("aktif_runHistory_Individual", objStorage + "," +  strObj);
					}
					
					
					var mdistance = parseFloat(obj.distance);
					var munit = "meter";
					if(mdistance > 1000.0)
					{
						mdistance = mdistance / 1000.0;
						munit = "km";
					}
					mdistance = Math.round(mdistance * 100) / 100;
					
					var image = "";
					if(obj.activity_type.toLowerCase() == "running")
					{
						image = "icon_run.png";
					}
					else
					{
						image = "cycling.png";
					}
					
					//var strDate = new Date(obj.rundate.replace(' ', 'T'));
					var strDate = new Date(obj.rundate.replace(/-/g, '/'));
					
					//if(strDate == "Invalid Date")
					//{
					//	strDate = new Date(obj.rundate);
					//}
	
					//var strDate = new Date(obj.rundate);
					var dd = strDate.getDate(); var mm = strDate.getMonth(); //January is 0! 
					var yyyy = strDate.getFullYear(); 
					
					var ampm = '';
					var hh = strDate.getHours();
					if(hh > 12)
					{
						hh = hh - 12;
						ampm = 'pm';
					}
					else
					{
						ampm = 'am';
					}
					var min = strDate.getMinutes();
					
					
					if(min < 10) min = '0' + min;
					
					
					var html = '<div id="Historyinfo-' + obj.activityid + '" class="evtHistory" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(images/icons/' + image + ');border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
					'<div style="float:left;width:60%;"><span id="">' + mdistance + munit + '</span></br><span id="" style="font-size:14px;color:#888;">Duration: ' + obj.duration + '</span></br><span id="" style="font-size:14px;color:#888;">' + dd + ' ' + monthNames[mm] + ' ' + yyyy + ' '+ hh + ':' + min + ampm + '</span></div></div>';
					panelMain.append(html);
					panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
					
					//console.log(obj.name);
					//console.log(obj.tagline);
					//console.log(obj.membercount);
					
					//console.log(distance + "km");
					//console.log(obj.isGroup);
				}
				var objStorageFinal = "" + window.localStorage.getItem("aktif_runHistory_Individual");
				window.localStorage.setItem("aktif_runHistory_Individual", objStorageFinal + "]");
				
				//alert(obj.token);
			});
	}
	localStorage.setItem("run_fresh", "false");
}

function addMoreRun(page) {
	if(nextToken < TotalRunCount)
	{
		$.mobile.loading("show", {
			text: "loading more..",
			textVisible: true,
			theme: "b"
		});
		 var mToken = window.localStorage.getItem("AccessToken");
			 $.get("http://www.aktifpenang.com/api/_api_usercheckin.php", 
			{
				token: mToken,
				nexttoken: nextToken,
				runid: 'all'
			}, 
			function(result){
				//$("span").html(result);
				var obj = JSON.parse(result);
				nextToken = obj.nexttoken;
				TotalRunCount = obj.total;
				spinner.stop();
					/*'activityid' => $id,
						'distance' => $distance,
						'activity_type' => $activity_type,
						'duration' => $duration,
						'avepace' => $avepace,
						'workout_type' => $workout_type,
						'eventid' => $eventid,
						'rundate' => $rundate,
						'checkin_type' => $checkin_type,
						'map' => $_map,
						*/
							
							
				window.localStorage.setItem("aktif_runHistory", result);
				objGroup = obj;
				var panelMain = $('#HistoryMain' + '');
				//panelMain.empty();
				for(var i = 0; i < objGroup.runs.length; i++) {
					var obj = objGroup.runs[i];
					
					
					var strObj = JSON.stringify(obj);
					strObj = strObj.replace("}","");
					strObj = strObj + ',"sync":"yes"}';
					var objStorage = "" + window.localStorage.getItem("aktif_runHistory_Individual");
					if(objStorage == "")
					{
						window.localStorage.setItem("aktif_runHistory_Individual", "[" + strObj);	
					}
					else
					{
						objStorage = objStorage.replace("]", "");
						window.localStorage.setItem("aktif_runHistory_Individual", objStorage + "," +  strObj);
					}
					
					
					
					var mdistance = parseFloat(obj.distance);
					var munit = "meter";
					if(mdistance > 1000.0)
					{
						mdistance = mdistance / 1000.0;
						munit = "km";
					}
					mdistance = Math.round(mdistance * 100) / 100;
					
					var image = "";
					if(obj.activity_type.toLowerCase() == "running")
					{
						image = "icon_run.png";
					}
					else
					{
						image = "cycling.png";
					}
					
					//var strDate = new Date(obj.rundate.replace(' ', 'T'));
					var strDate = new Date(obj.rundate.replace(/-/g, '/'));
					
					//if(strDate == "Invalid Date")
					//{
					//	strDate = new Date(obj.rundate);
					//}
	
					//var strDate = new Date(obj.rundate);
					var dd = strDate.getDate(); var mm = strDate.getMonth(); //January is 0! 
					var yyyy = strDate.getFullYear(); 
					
					var ampm = '';
					var hh = strDate.getHours();
					if(hh > 12)
					{
						hh = hh - 12;
						ampm = 'pm';
					}
					else
					{
						ampm = 'am';
					}
					var min = strDate.getMinutes();
					
					
					if(min < 10) min = '0' + min;
					
					
					var html = '<div id="Historyinfo-' + obj.activityid + '" class="evtHistory" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(images/icons/' + image + ');border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
					'<div style="float:left;width:60%;"><span id="">' + mdistance + munit + '</span></br><span id="" style="font-size:14px;color:#888;">Duration: ' + obj.duration + '</span></br><span id="" style="font-size:14px;color:#888;">' + dd + ' ' + monthNames[mm] + ' ' + yyyy + ' '+ hh + ':' + min + ampm + '</span></div></div>';
					panelMain.append(html);
					panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
					
					
				}
				var objStorageFinal = "" + window.localStorage.getItem("aktif_runHistory_Individual");
				window.localStorage.setItem("aktif_runHistory_Individual", objStorageFinal + "]");
				$.mobile.loading("hide");
				//alert(obj.token);
			});
	}
}


function sharemyrun()
{
	try{
		//window.plugins.socialsharing.share('Message and subject', 'The subject');
		//alert(localStorage.getItem("CurrentRun_Map"));
		//window.plugins.socialsharing.share('I have completed ' + localStorage.getItem("CurrentRun_Distance") + ' via AktifPenang! Come join me!', null, localStorage.getItem("CurrentRun_Map"), 'http://www.aktifpenang.com');
		//data:image/png;base64,R0lGODlhDAAMALMBAP8AAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAUKAAEALAAAAAAMAAwAQAQZMMhJK7iY4p3nlZ8XgmNlnibXdVqolmhcRQA7
	

		//var base64 = getBase64Image(document.getElementById("divMap"));
		convertImgToBase64URL(localStorage.getItem("CurrentRun_Map"), function(base64Img){
			//alert(base64Img);
			window.plugins.socialsharing.share("I have completed " + localStorage.getItem("CurrentRun_Distance") + " via AktifPenang! Come join me!", "", base64Img, "http://www.aktifpenang.com");

		});
		
	}
	catch(err)
	{
		alert(err);
	}
	//navigator.share("My Run","Join me on Aktif Penang and raise fund!","");
}

function convertImgToBase64URL(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
}

function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function Logout()
{
	window.localStorage.clear();
	var url = "index.html";
	var win = window.open(url, '_self');
}

function UserProfile()
{
	 var mToken = window.localStorage.getItem("AccessToken");
	 $.get("http://www.aktifpenang.com/api/_api_userprofile.php", 
		{
			token: mToken
		}, 
		function(result){
			//$("span").html(result);
			var obj = JSON.parse(result);
			
				/*
				'lastname' => $lastname,
				'firstname' => $firstname,
				'shortname' => $shortname,
				'userimage' => $userimage,
				'dob' => $dob,
				'height' => $height,
				'weight' => $weight,
				'contact' => $contact,
				'email' => $email,
				'notification' => $notification,
				'gender' => $gender,
*/		
			window.localStorage.setItem("userprofie_lastname", obj.userprofile[0].lastname);
			window.localStorage.setItem("userprofie_firstname", obj.userprofile[0].firstname);
			window.localStorage.setItem("userprofie_shortname", obj.userprofile[0].shortname);
			window.localStorage.setItem("userprofie_userimage", obj.userprofile[0].userimage);
			window.localStorage.setItem("userprofie_dob", obj.userprofile[0].dob);
			window.localStorage.setItem("userprofie_height", obj.userprofile[0].height);
			window.localStorage.setItem("userprofie_weight", obj.userprofile[0].weight);
			window.localStorage.setItem("userprofie_gender", obj.userprofile[0].gender);
			
			//alert(obj.token);
			displayUserProfile();
		});
	
}

function displayUserProfile()
{
	var lastname = window.localStorage.getItem("userprofie_lastname");
	var firstname = window.localStorage.getItem("userprofie_firstname");
	var shortname = window.localStorage.getItem("userprofie_shortname");
	var dob = window.localStorage.getItem("userprofie_dob");
	var height = window.localStorage.getItem("userprofie_height");
	var weight = window.localStorage.getItem("userprofie_weight");
	var gender = window.localStorage.getItem("userprofie_gender");

	$("#userprofie_displayname").html("" + shortname + "" );
	$("#userprofie_height").html("Height: " + height + " cm" + "" );
	$("#userprofie_weight").html("Weight: " + weight + " kg" + "" );
	$("#userprofie_gender").html("Gender: " + gender + " " + "" );
	$("#userprofie_dob").html("DOB: " + dob + " " + "" );

}

function openFB()
{
	window.open("https://www.facebook.com/AktifPenang", '_system');
}

function showSettings()
{
	var Accuracy = window.localStorage.getItem("setting_accuracy");
	var Notification = window.localStorage.getItem("setting_notification");
	
	$("#trackAccuracy").val(Accuracy);
	$("#notification").val(Notification);
}


function saveSettigs()
{
	var Accuracy = $("#trackAccuracy").val();
	var Notification = $("#notification").val();
	
	window.localStorage.setItem("setting_accuracy", Accuracy);
	window.localStorage.setItem("setting_notification", Notification);
	
	window.history.back();
}

function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

function displayeditProfile()
{
	var lastname = window.localStorage.getItem("userprofie_lastname");
	var firstname = window.localStorage.getItem("userprofie_firstname");
	var shortname = window.localStorage.getItem("userprofie_shortname");
	var dob = window.localStorage.getItem("userprofie_dob");
	var height = window.localStorage.getItem("userprofie_height");
	var weight = window.localStorage.getItem("userprofie_weight");
	var gender = window.localStorage.getItem("userprofie_gender");

	var res = dob.split("-");
	//var dt = new Date(res[2]+"-"+res[1]+"-"+res[0]);
	var dt_new = pad(parseInt(res[2]))+"-"+pad(parseInt(res[1]))+"-"+pad(parseInt(res[0]));
	var dt = new Date();
	$("#fname").val("" + firstname + "" );
	$("#lname").val("" + lastname + "" );
	$("#displayname").val("" + shortname + "" );
	$("#height").val("" + height + "" + "" );
	$("#weight").val("" + weight + "" + "" );
	$("#gender").val(gender);
	//var element = document.getElementById('gender');
	//element.value = gender;
	var v;
	if(gender == "M")
	{
		v = "Male";
	}
	else
	{
		v = "Female";
	}
	//$("#gender option[value='" + gender + "']").attr("selected",true);
	
	 /*for(var i=0; i < element.options.length; i++)
	  {
		//var v = element.options[i].value;
		if(element.options[i].value === gender) {
		  element.selectedIndex = i;
		  break;
		}
	  }*/
	//document.getElementById("myGender").innerHTML = v;  
   
	//document.getElementById('DOB').value = dt_new;
	//var a = document.getElementById('DOB').value;
	$("#DOB").val(dt_new);//'1988-8-15');//'2013-12-31');
	//var s = $("#DOB").val();
}

function editProfile()
{
	var element = document.getElementById('gender');
	var vgender = element.value;
	if(vgender == "")
	{
		vgender = "M";
	}
	
	var element = document.getElementById('fname');
	var vfname = element.value;
	
	var element = document.getElementById('lname');
	var vlname = element.value;
	
	var element = document.getElementById('displayname');
	var vdisplayname = element.value;
	
	var element = document.getElementById('height');
	var vheight = element.value;
	
	var element = document.getElementById('weight');
	var vweight = element.value;
	
	var element = document.getElementById('DOB');
	var vDOB = element.value;
	var res = vDOB.split("-");
	//var dt = new Date(res[2]+"-"+res[1]+"-"+res[0]);
	
	var dt_new = pad(parseInt(res[2]))+"-"+pad(parseInt(res[1]))+"-"+pad(parseInt(res[0]));
	
	/*  nameValuePairs.add(new BasicNameValuePair("token",  params[0]));
	              nameValuePairs.add(new BasicNameValuePair("lastname",  params[1]));
	              nameValuePairs.add(new BasicNameValuePair("firstname",  params[2]));
	              nameValuePairs.add(new BasicNameValuePair("shortname",  params[3]));
	              nameValuePairs.add(new BasicNameValuePair("dob",  params[4]));
	              nameValuePairs.add(new BasicNameValuePair("height",  params[5]));
	              nameValuePairs.add(new BasicNameValuePair("weight",  params[6]));
	              nameValuePairs.add(new BasicNameValuePair("contact",  params[7]));
	              nameValuePairs.add(new BasicNameValuePair("email",  params[8]));
	              nameValuePairs.add(new BasicNameValuePair("notification",  params[9]));
	              nameValuePairs.add(new BasicNameValuePair("gender",  params[10]));
	              nameValuePairs.add(new BasicNameValuePair("userimage",  params[11]));
		*/
	$.mobile.loading("show", {
			text: "Please Wait..",
			textVisible: true,
			theme: "b"
		});
	var mToken = window.localStorage.getItem("AccessToken");
	 $.post("http://www.aktifpenang.com/api/_api_userprofile.php", 
	 {
		token: mToken,
		lastname: vlname, 
		firstname:vfname,
		shortname:vdisplayname,
		dob:dt_new,
		height:vheight,
		weight:vweight,
		contact:'',
		email:'',
		notification:'',
		gender:vgender,
		userimage:''
		
	}, function(result){
        //$("span").html(result);
		 $.mobile.loading("hide");
		var obj = JSON.parse(result);
		//window.localStorage.getItem('AccessToken')
		if(obj.status == true)
		{
			window.localStorage.setItem("userprofie_lastname", vlname);
			window.localStorage.setItem("userprofie_firstname", vfname);
			window.localStorage.setItem("userprofie_shortname", vdisplayname);
			window.localStorage.setItem("userprofie_userimage", '');
			window.localStorage.setItem("userprofie_dob", dt_new);
			window.localStorage.setItem("userprofie_height", vheight);
			window.localStorage.setItem("userprofie_weight", vweight);
			window.localStorage.setItem("userprofie_gender", vgender);
			pressBackButton();
			//history.go(-1);
			//window.localStorage.setItem("AccessToken", obj.token);
			//var url = "main1.html";
			//var win = window.open(url, '_self');
			
		}
		else
		{
			if(navigator.notification)
			{
				navigator.notification.alert(
					'Error updating your profile. Please try again.',
					function() {},
					'Edit Profile',
					'OK'
				);
			}
			else
			{
				alert("Error Updating Your Profile. Please Try Again.");
			}
		}
		//alert(obj.token);
    });
	
}

/*function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
		
        //x.innerHTML = "Geolocation is not supported by this browser.";
    }
}*/

function StartRun()
{

	try
	{
		/*cordova.plugins.notification.local.hasPermission(function (granted) {
			//alert(granted);
			if(granted == false)
			{
				cordova.plugins.notification.local.registerPermission(function (granted) {
                   // alert(granted ? 'Yes' : 'No');
                });
			}
		});*/
		
		/*cordova.plugins.notification.local.schedule({
			id: 1,
			text: "You started RUN. Click here to return to AktifPenang App" 
		});*/
		window.plugins.localNotification.add({
			fireDate        : Math.round(new Date().getTime()/1000 + 1),
			alertBody       : "This is a local notification.",
			action          : "View",
			soundName       : "beep.caf",
			badge           : 0,
			notificationId  : 1,
			foreground      : function(notificationId){ 
				alert("Hello World! This alert was triggered by notification " + notificationId); 
			},
			background  : function(notificationId){
				alert("Hello World! This alert was triggered by notification " + notificationId);
			}           
		});
		
	}
	catch(err)
	{
		alert(err);
	}
	return;
	//callbackFn("a", 200);
	TotalCalories = 0.0;
	TotalDistance = 0.0;
	LocationCount = 0;
	LocationCount_Total = 0;
	LocationCount_background = 0;
	LastPosition = "";
	LocationTimeStamp = 0;
	localStorage.setItem("CurrentRun_LastPosition", LastPosition);
	
	$("#distance").val(TotalDistance);
	$("#calories").val("- -");
	//$("#calories").val("" + LocationCount + "(" + LocationCount_background + ")");
	
	//Store activity type
	var mActivity = $("#activity").val();
	localStorage.setItem("CurrentRun_Activity", mActivity);
	localStorage.setItem("CurrentRun_Date", new Date());
	

	//set button color to red 
	$("#btnStart").css({'display':'none'});
	$("#btnStop").css({'display':'block'});
	
	//disable selection 
	document.getElementById('activity').disabled = true;
	
	//set mcurrent run to emty
	localStorage.setItem("CurrentRun", "");
	localStorage.setItem("IsStartRun", "true");
	
	//start timer
	startDuration();
	
	//start location updates
	getLocationUpdate();
	try
	{
		window.plugins.backgroundGeoLocation.stop();
	}
	catch(err)
	{
	
	}
	try
	{
		configureBackgroundGeoLocation();
	}
	catch(err)
	{
		//alert(err);
	}
	
	
	try
	{
		cordova.plugins.notification.local.hasPermission(function (granted) {
			//alert(granted);
			if(granted == false)
			{
				cordova.plugins.notification.local.registerPermission(function (granted) {
                   // alert(granted ? 'Yes' : 'No');
                });
			}
		});
		
		cordova.plugins.notification.local.schedule({
			id: 1,
			text: "You started RUN. Click here to return to AktifPenang App" 
		});
		
	}
	catch(err)
	{
		//alert(err);
	}
	
}

function StopRun()
{
	//$("#startandstopbutton").val("Start My Run");
	//document.getElementById('btnStartStop').innerHTML = "Start My Run";
	try
	{
		cordova.plugins.notification.local.clear(1, function () {
                    cordova.plugins.notification.local.getIds(function (ids) {
						//alert('IDs: ' + ids.join(' ,'));
					});
                });
	}
	catch(err)
	{
		//alert(err);
	}
	//set button color to red 
	$("#btnStart").css({'display':'block'});
	$("#btnStop").css({'display':'none'});
	
	document.getElementById('activity').disabled = false;
	//sttop timer
	stopDuration();
	
	//store duration 
	var mDuration = $("#stopwatch").val();
	localStorage.setItem("CurrentRun_Duration", mDuration);
	
	//store distance
	localStorage.setItem("CurrentRun_Distance", TotalDistance);
	
	//store colaries 
	localStorage.setItem("CurrentRun_Calories", TotalCalories);
	
	//stop location updates
	stopLocationWatch();
	try
	{
		window.plugins.backgroundGeoLocation.stop();
	}
	catch(err)
	{
	
	}

	
	var today = new Date();
	var dd = today.getDate(); if(dd < 10) dd = '0' + dd;
	var mm = today.getMonth()+1; if(mm < 10) mm = '0' + mm;
	var yyyy = today.getFullYear();
	
	var min = today.getMinutes(); if(min < 10) min = '0' + min;
	var hour = today.getHours(); if(hour < 10) hour = '0' + hour;
	var sec = today.getSeconds(); if(sec < 10) sec = '0' + sec;
	
	var runDate = yyyy + "-" + mm + "-" + dd + " " + hour + ":" + hour + ":" + sec;
	localStorage.setItem("CurrentRun_Date", runDate);
	
	//convert coordinates to static image url
	var mMapURL = getMapURL();
	//alert(mMapURL);
	localStorage.setItem("CurrentRun_Map", mMapURL);
	
	if(TotalDistance > 0.0)
	{
		//encode path 
		
		/*var mActivity = localStorage.getItem("CurrentRun_Activity");
		
		var current_id = window.localStorage.getItem("aktif_nextt_activity_id");
		var int_current_id = parseInt(current_id)  + 1;
		window.localStorage.setItem("aktif_nextt_activity_id", int_current_id);	
					
		var strNewRun = '{"activityid":"' + current_id + '","distance":"' + TotalDistance + '","activity_type":"' + mActivity + '","duration":"' + mDuration + '","avepace":"","workout_type":"Free Run","eventid":"","rundate":"' + runDate + '","checkin_type":"live","map":"' + mMapURL + '","sync":"no"}';
		var objStorage = "" + window.localStorage.getItem("aktif_runHistory_Individual");
		if(objStorage == "")
		{
			window.localStorage.setItem("aktif_runHistory_Individual", "[" + strNewRun + "]");	
		}
		else
		{
			objStorage = objStorage.replace("[", "");
			window.localStorage.setItem("aktif_runHistory_Individual", "[" + strNewRun + "," + objStorage);
		}*/
		
		
		SynctoDB();
		
		//set mcurrent run to emty
		localStorage.setItem("run_fresh", "true");
		location.hash = "#runMap";
	}
	else
	{
		//SynctoDB();
		//location.hash = "#runMap";
		if(navigator.notification)
		{
			navigator.notification.alert(
				'Distance need to be more than 0.0 meter as valid run.',
				function() {},
				'Run',
				'OK'
			);
		}
		else
		{
			alert("Distance need to be more than 0.0 meter as valid run.");
		}
	}
	
	localStorage.setItem("IsStartRun", "false");
			
}

function UpdateNotification()
{
	//TestCount = TestCount + 1;
	try{
		/*cordova.plugins.notification.local.update({
			id: 1,
			text: 'You started RUN. Click here to return to AktifPenang App'
		});*/
		cordova.plugins.notification.local.schedule({
			id: 1,
			text: "You started RUN. Click here to return to AktifPenang App" 
		});
	}
	catch(err)
	{
	
	}
}
			
function displayMyRun()
{
	
	var mActivity = localStorage.getItem("CurrentRun_Activity");
	var mD = localStorage.getItem("CurrentRun_Distance");
	var mDuration = localStorage.getItem("CurrentRun_Duration");
	var mMap = localStorage.getItem("CurrentRun_Map");
	var runDate = localStorage.getItem("CurrentRun_Date");
	var Calories = localStorage.getItem("CurrentRun_Calories");
	
	//alert(runDate);
	$("#divMap").css({'background-image':'none'});
	document.getElementById("imgMap").src = "";
	
	//var strDate = new Date(runDate.replace(' ', 'T'));
	var strDate = new Date(runDate.replace(/-/g, '/'));
	/*if(strDate == "Invalid Date")
	{
		strDate = new Date(runDate);
	}*/
	//alert(strDate);
	var dd = strDate.getDate(); 
	
	var mm = strDate.getMonth(); //January is 0! 
	var yyyy = strDate.getFullYear(); 
	
	var ampm = '';
	var hh = strDate.getHours();
	if(hh > 12)
	{
		hh = hh - 12;
		ampm = 'pm';
	}
	else
	{
		ampm = 'am';
	}
	
	var min = strDate.getMinutes();
	if(min < 10) min = '0' + min;

	
	if(mMap == "")
	{
		 var id = localStorage.getItem("CurrentRun_id");
		 var mToken = window.localStorage.getItem("AccessToken");
		 $.get("http://www.aktifpenang.com/api/_api_usercheckin.php", 
			{
				token: mToken,
				runid: id
			}, 
			function(result){
				var obj = JSON.parse(result);
				var strMap = "url('" + obj.runs[0].map + "')";
				//alert(strMap);
				localStorage.setItem("CurrentRun_Map", obj.runs[0].map);
				var w = window.innerWidth - 40;
				$("#imgMap").css({"width":w});
				$("#imgMap").css({"height":w});
				//$("#imgMap").src = obj.runs[0].map;
				var myMap = obj.runs[0].map + "&API=" + StaticAPI;
				document.getElementById("imgMap").src = myMap;
			}
		);
	}
	else
	{
		//$("#divMap").css({'background-image':'url('+ mMap +')'});
		var w = window.innerWidth - 40;
		$("#imgMap").css({"width":w});
		$("#imgMap").css({"height":w});
		//$("#imgMap").src = obj.runs[0].map;'
		mMap = mMap + "&API=" + StaticAPI;
		document.getElementById("imgMap").src = mMap;
	}
	
	if(mD > 1000.0)
	{
		var d = mD / 1000.0;
		mdistance = Math.round(d * 100) / 100;
		document.getElementById('lblMyRunDistance').innerHTML = "Distance (km):";
		document.getElementById('mapDistance').innerHTML = mdistance;
	}
	else
	{
		mdistance = Math.round(mD * 100) / 100;
		document.getElementById('lblMyRunDistance').innerHTML = "Distance (meter):";
		document.getElementById('mapDistance').innerHTML = mdistance;
	}
			
	
	
	
	//document.getElementById('lblMapDistance').innerHTML = document.getElementById('lbldistance').innerHTML;
	//document.getElementById('mapDistance').innerHTML = mdistance;
	document.getElementById('mapDuration').innerHTML = mDuration;
	document.getElementById('mapRunDate').innerHTML = '' + dd + ' ' + monthNames[mm] + ' ' + yyyy + ' '+ hh + ':' + min + '' + ampm;//runDate;
	document.getElementById('mapCalories').innerHTML = '' + Calories;
	//$("#mapDistance").val(mdistance + "");
	//$("#mapDuration").val(mDuration + "");
	//$("#mapRunDate").val(runDate + "");
}

function displayGroup()
{
	//individualGroupPage
	
	var CurrentGroup_id = localStorage.getItem("CurrentGroup_id");
	var CurrentGroup_Name = localStorage.getItem("CurrentGroup_Name");
	var CurrentGroup_Distance = localStorage.getItem("CurrentGroup_Distance");	
	var CurrentGroup_Image = localStorage.getItem("CurrentGroup_Image");	
	var CurrentGroup_Tagline = localStorage.getItem("CurrentGroup_Tagline");
	var CurrentGroup_Member = localStorage.getItem("CurrentGroup_Member");
			
	$("#groupImage").css({'background-image':'url(http://www.aktifpenang.com/group_images/'+ CurrentGroup_Image +')'});
	
	
	if(CurrentGroup_Distance > 1000.0)
	{
		var d = CurrentGroup_Distance / 1000.0;
		mdistance = Math.round(d * 100) / 100;
		document.getElementById('groupInfo').innerHTML = "Members: " + CurrentGroup_Member + " | " +  mdistance + "km";
	}
	else
	{
		mdistance = Math.round(CurrentGroup_Distance * 100) / 100;
		document.getElementById('groupInfo').innerHTML = "Members: " + CurrentGroup_Member + " | " +  mdistance + "member";
	}

	document.getElementById('groupName').innerHTML = CurrentGroup_Name;
	document.getElementById('groupTagline').innerHTML = CurrentGroup_Tagline;

	//======================================================
	 var mToken = window.localStorage.getItem("AccessToken");
	 $.get("http://www.aktifpenang.com/api/_api_group_get.php", 
			{
				token: mToken,
				groupid: CurrentGroup_id
			}, 
			function(result){
				var obj = JSON.parse(result);
				
				nextToken_GroupMember = obj.nexttoken;
				Total_GroupMemberCount = obj.total;
				
				var objUserlist = obj.userlist;
				var objIsJoined = obj.isGroup;
				if(objIsJoined == "0")
				{
					$('#btnJoinGroup' + '').css({'display':'block'});
					$('#btnLeaveGroup' + '').css({'display':'none'});
					$('#btnJoinGroup' + '').val(CurrentGroup_id);
				}
				else
				{
					$('#btnJoinGroup' + '').css({'display':'none'});
					$('#btnLeaveGroup' + '').css({'display':'block'});
					$('#btnLeaveGroup' + '').val(CurrentGroup_id);
				}
				var panelMain = $('#groupMembers' + '');
				panelMain.empty();
				for(var i = 0; i < objUserlist.length; i++) {
					var objUser = objUserlist[i];	
					var mdistance = parseFloat(objUser.userdistance);
					var munit = "meter";
					if(mdistance > 1000.0)
					{
						mdistance = mdistance / 1000.0;
						munit = "km";
					}
					mdistance = Math.round(mdistance * 100) / 100;
					var imageURL = "";
					if(objUser.username_type == "email")
					{
						imageURL = "images/icons/login.png";
					}
					else
					{
						imageURL = "https://graph.facebook.com/" + objUser.username_id + "/picture?type=large";
					}
					var html = '<div id="Historyinfo-' + objUser.username_id + '" class="" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(' + imageURL + ');border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
					'<div style="float:left;width:60%;"><span id="">' + objUser.username + '</span></br><span id="" style="font-size:14px;color:#888;">'  + mdistance + munit +  '</span></div></div>';
					panelMain.append(html);
					panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
					
				}
			}
		);
}

function addMoreGroupMember(page)
{
	if(nextToken_GroupMember < Total_GroupMemberCount)
	{
		$.mobile.loading("show", {
			text: "loading more..",
			textVisible: true,
			theme: "b"
		});
		var CurrentGroup_id = localStorage.getItem("CurrentGroup_id");
		var mToken = window.localStorage.getItem("AccessToken");
		$.get("http://www.aktifpenang.com/api/_api_group_get.php", 
			{
				token: mToken,
				nexttoken: nextToken_GroupMember,
				groupid: CurrentGroup_id
			}, 
			function(result){
				var obj = JSON.parse(result);
				
				nextToken_GroupMember = obj.nexttoken;
				Total_GroupMemberCount = obj.total;
				
				var objUserlist = obj.userlist;
				var objIsJoined = obj.isGroup;
				if(objIsJoined == "0")
				{
					$('#btnJoinGroup' + '').css({'display':'block'});
					$('#btnLeaveGroup' + '').css({'display':'none'});
					$('#btnJoinGroup' + '').val(CurrentGroup_id);
				}
				else
				{
					$('#btnJoinGroup' + '').css({'display':'none'});
					$('#btnLeaveGroup' + '').css({'display':'block'});
					$('#btnLeaveGroup' + '').val(CurrentGroup_id);
				}
				var panelMain = $('#groupMembers' + '');
				//panelMain.empty();
				for(var i = 0; i < objUserlist.length; i++) {
					var objUser = objUserlist[i];	
					var mdistance = parseFloat(objUser.userdistance);
					var munit = "meter";
					if(mdistance > 1000.0)
					{
						mdistance = mdistance / 1000.0;
						munit = "km";
					}
					mdistance = Math.round(mdistance * 100) / 100;
					var imageURL = "";
					if(objUser.username_type == "email")
					{
						imageURL = "images/icons/login.png";
					}
					else
					{
						imageURL = "https://graph.facebook.com/" + objUser.username_id + "/picture?type=large";
					}
					var html = '<div id="Historyinfo-' + objUser.username_id + '" class="" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(' + imageURL + ');border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
					'<div style="float:left;width:60%;"><span id="">' + objUser.username + '</span></br><span id="" style="font-size:14px;color:#888;">'  + mdistance + munit +  '</span></div></div>';
					panelMain.append(html);
					panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
					
				}
				$.mobile.loading("hide");
			}
		);

	}
}

function SynctoDB()
{
	/*  $distance = isset($_POST['distance']) ? $_POST['distance'] : '';
	$activity_type = isset($_POST['activity_type']) ? $_POST['activity_type'] : '';
	$route = isset($_POST['route']) ? $_POST['route'] : '';
	$duration = isset($_POST['duration']) ? $_POST['duration'] : '';
	$avepace = isset($_POST['avepace']) ? $_POST['avepace'] : '';
	$workout_type = isset($_POST['workout_type']) ? $_POST['workout_type'] : '';
	$eventid = isset($_POST['eventid']) ? $_POST['eventid'] : '';
	$rundate = isset($_POST['rundate']) ? $_POST['rundate'] : '';
	$checkin_type = isset($_POST['checkin_type']) ? $_POST['checkin_type'] : '';
	*/
	try{
		var mToken = window.localStorage.getItem("AccessToken");
		var mActivity = localStorage.getItem("CurrentRun_Activity");
		var mdistance = localStorage.getItem("CurrentRun_Distance");
		var mDuration = localStorage.getItem("CurrentRun_Duration");
		var mTotalCalories = localStorage.getItem("CurrentRun_Calories");
		/*var mCoor = localStorage.getItem("CurrentRun");
		var arrCoor = mCoor.split("|");

		var text = '{ "employees" : [' +
			'{ "firstName":"John" , "lastName":"Doe" },' +
			'{ "firstName":"Anna" , "lastName":"Smith" },' +
			'{ "firstName":"Peter" , "lastName":"Jones" } ]}';
		var coor_json = "";
		
		for(var i = 0; i < arrCoor.length; i++) {
			var co = arrCoor[i];
			var lat = co.split(",")[0];
			var lo = co.split(",")[1];
			if(coor_json == "")
			{
				coor_json = '{"time":"","lat":"'+ lat + '","long":"' + lo + '"}';
			}
			else
			{
				coor_json = coor_json + ',{"time":"","lat":"'+ lat + '","long":"' + lo + '"}';
			}
		}
		coor_json = "[" + coor_json + "]";*/
		var mRoute = getPathEncoded();
		
		var runDate = localStorage.getItem("CurrentRun_Date");
		
		 $.post("http://www.aktifpenang.com/api/_api_usercheckin.php", 
		 {
			token: mToken,
			distance: mdistance, 
			activity_type:mActivity,
			route:mRoute,
			duration: mDuration,
			avepace:'',
			workout_type:'Free Run',
			eventid:'',
			rundate:runDate,
			checkin_type:'live',
			calories: mTotalCalories
			
		}, function(result){
			//$("span").html(result);
			var obj = JSON.parse(result);
			//window.localStorage.getItem('AccessToken')
			//alert(obj.status);
			if(obj.status == true)
			{
				//alert("error");
				//insert to run history json and store to localStorage
			}
		});
	}
	catch(err)
	{
		alert("error:" + err);
	}
}

function asyncLoop(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);

            } else {
                done = true;
                callback();
            }
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}

function someFunction(a, b, callback) {
    console.log('Hey doing some stuff!');
    callback();
}


function UploadToServer(obj, callback)
{
	if(obj.sync == "no")
	{
		var activity_id = obj.activityid;
		var EncodedMap = obj.map.replace("http://maps.googleapis.com/maps/api/staticmap?size=400x400&path=enc:" ,"");
		
		var mToken = window.localStorage.getItem("AccessToken");
		$.post("http://www.aktifpenang.com/api/_api_usercheckin.php", 
		 {
			token: mToken,
			distance: obj.distance, 
			activity_type:obj.activity_type,
			route:EncodedMap,
			duration: obj.duration,
			avepace:'',
			workout_type:'Free Run',
			eventid:'',
			rundate:obj.rundate,
			checkin_type:'live'
			
		}, function(result){
			//$("span").html(result);
			//$.mobile.loading("hide");
				
			var obj = JSON.parse(result);
			//window.localStorage.getItem('AccessToken')
			//alert(obj.status);
			if(obj.status == true)
			{
				obj.sync = "yes";
				var strObj = JSON.stringify(obj);
			
				var objStorage = "" + window.localStorage.getItem("aktif_runHistory_Individual_BUFFER");
				if(objStorage == "")
				{
					window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", "[" + strObj);	
				}
				else
				{
					objStorage = objStorage.replace("]", "");
					window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", objStorage + "," +  strObj);
				}
			}
			else
			{
				var strObj = JSON.stringify(obj);
				
				var objStorage = "" + window.localStorage.getItem("aktif_runHistory_Individual_BUFFER");
				if(objStorage == "")
				{
					window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", "[" + strObj);	
				}
				else
				{
					objStorage = objStorage.replace("]", "");
					window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", objStorage + "," +  strObj);
				}
			}
			callback();
		});
	}
	else
	{
		var strObj = JSON.stringify(obj);
		
		var objStorage = "" + window.localStorage.getItem("aktif_runHistory_Individual_BUFFER");
		if(objStorage == "")
		{
			window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", "[" + strObj);	
		}
		else
		{
			objStorage = objStorage.replace("]", "");
			window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", objStorage + "," +  strObj);
		}
		//throw 500;
		callback();
	}
}

function SyncToServer()
{
	$.mobile.loading("show", {
			text: "Syncing with server..",
			textVisible: true,
			theme: "b"
		});
		
	window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", "");
	var result = window.localStorage.getItem("aktif_runHistory_Individual")
	var objGroup = JSON.parse(result);
	try{
		asyncLoop(objGroup.length, function(loop) {
			var obj = objGroup[loop.iteration()];
			UploadToServer(obj, function(result) {

				// log the iteration
				//console.log(loop.iteration());

				// Okay, for cycle could continue
				loop.next();
			})},
			function(){
				var objStorageFinal = "" + window.localStorage.getItem("aktif_runHistory_Individual_BUFFER");
				window.localStorage.setItem("aktif_runHistory_Individual", objStorageFinal + "]");
				$.mobile.loading("hide");
				console.log('cycle ended')
			}
		);	
	}
	catch(err)
	{
		$.mobile.loading("hide");
		if(navigator.notification)
		{
			navigator.notification.alert(
				'Error Syncing with server: ' + err,
				function() {},
				'Run',
				'OK'
			);
		}
		else
		{
			alert('Error Syncing with server: ' + err);
		}
	}
}


function getPathEncoded()
{
	var arrCoordinates = [];
	//arrCoordinate = mCoordinate.split("|");
	var CurrentRunPath = localStorage.getItem("CurrentRun");//"38.5,-120.2|40.7,-120.95|43.252,-126.453";//localStorage.getItem("CurrentRun");
	var arrCurrentRun = CurrentRunPath.split("|");
	for (var Coor in arrCurrentRun)
	{
		var arrCoor = arrCurrentRun[Coor].split(",");
		var _Coor = [arrCoor[0], arrCoor[1]];
		arrCoordinates.push(_Coor);
	}
	var encoded = polyline.encode(arrCoordinates);//[[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]]);//
	//encoded = '{l}_@cmecR@Qb@wA~BSjFThFt@rEp@fEh@jF`@hI?`G_ClFgCvDgBzAo@pDqAf@QtCgAz@[rAe@lDqAbDu@lEk@tEwBbAeEj@uEQuGCqGlA{JdAsIbC}FhHdBjGlBhFxAtGfBlGzAtG`AlHRfII|IOnIi@pI{AfHmA`KdAlGbF|F`E~ElDxFhEfHrDbIxAzILzKjApJpCbIhBhI~AvJfBrIxA~IxAzHb@dIL~GrCnFnIzAhKo@bJaBhJyAxGxA~FfFnDzF~CzEtBxBv@hB~@o@zEu@`GOlECdCE~BMtFZtCzAj@YD_A\\';
	return encoded;
	
}

function getMapURL()
{
	//var mCoordinate = localStorage.getItem("CurrentRun");
	var encoded = getPathEncoded();
	
	//loop and append
	var mapURL = "http://maps.googleapis.com/maps/api/staticmap?size=400x400&path=enc:" + encoded;//localStorage.getItem("CurrentRun");
	
	return mapURL;
}

function showPosition(position) {
    //x.innerHTML = "Latitude: " + position.coords.latitude + 
    //"<br>Longitude: " + position.coords.longitude;
	//alert("Accuracy:" + position.coords.accuracy + "\nTimestamp:" + position.timestamp);
	LocationCount_Total = LocationCount_Total + 1;
	
	var diff = position.timestamp - LocationTimeStamp;
	//alert(diff);
	if(LocationTimeStamp == 0)
	{
		LocationTimeStamp =  position.timestamp;
	}
	if(diff > 10000)
	{
		
		$("#Accuracy").val("" + position.coords.accuracy);
		if(position.coords.accuracy <= 10.0)
		{
			//high accuracy 
			
			//var mLastPosition = localStorage.getItem("CurrentRun_LastPosition");
			//LastPosition = mLastPosition;
			if(LastPosition == "")
			{
				LastPosition = position;
				var mCoordinate = localStorage.getItem("CurrentRun");
				if(mCoordinate == "")
				{
					mCoordinate = "" + position.coords.latitude + "," + position.coords.longitude;
					
				}
				else
				{
					mCoordinate = mCoordinate + "|" + position.coords.latitude + "," + position.coords.longitude;
					
				}
				localStorage.setItem("CurrentRun", mCoordinate);
				
				LocationCount = LocationCount + 1;
				
			}
			else
			{
				var distance = calculateDistance(LastPosition.coords.latitude, LastPosition.coords.longitude,
							position.coords.latitude, position.coords.longitude);
				distance = distance * 1000.0;
				if(distance >= 10.0)
				{
					TotalDistance = TotalDistance + distance;
					
					//document.getElementById('distance').innerHTML = TotalDistance;
					
					if(TotalDistance > 1000.0)
					{
						var d = TotalDistance / 1000.0;
						mdistance = Math.round(d * 100) / 100;
						document.getElementById('lbldistance').innerHTML = "Distance (km):";
						//$("#lbldistance").val("Distance (km)");
						$("#distance").val(mdistance + "");				
					}
					else
					{
						mdistance = Math.round(TotalDistance * 100) / 100;
						//$("#lbldistance").val("Distance (meter)");
						document.getElementById('lbldistance').innerHTML = "Distance (meter):";
						$("#distance").val(mdistance + "");
					}
					
					var mCoordinate = localStorage.getItem("CurrentRun");
					if(mCoordinate == "")
					{
						mCoordinate = "" + position.coords.latitude + "," + position.coords.longitude;
					}
					else
					{
						mCoordinate = mCoordinate + "|" + position.coords.latitude + "," + position.coords.longitude;
					}
					localStorage.setItem("CurrentRun", mCoordinate);
					
					LocationCount = LocationCount + 1;
					LastPosition = position;	
					
					try{
						var weight = parseFloat("" + window.localStorage.getItem("userprofie_weight"));
						var dblTotalDistance = parseFloat("" + TotalDistance);
						var strCal = calculateCalories(dblTotalDistance, weight);
						TotalCalories = strCal;
						$("#calories").val(strCal);
					}
					catch(err)
					{
						//alert(err);
					}
				}
			}
			LocationTimeStamp =  position.timestamp;
			//localStorage.setItem("CurrentRun_LastPosition", LastPosition);
			
		}
	}
	//$("#calories").val("" + LocationCount + "(" + LocationCount_background + ")" + "[" + LocationCount_Total + "]");
	
}

function stopLocationWatch(){
	 geoLoc = navigator.geolocation;
	 // alert("ID: " + watchID);
     geoLoc.clearWatch(watchID);
}

function getLocationUpdate(){
	if(navigator.geolocation){
	   // timeout at 60000 milliseconds (60 seconds)
	   var options = {maximumAge: 0, timeout:20000, enableHighAccuracy: true };
	   geoLoc = navigator.geolocation;
	   watchID = geoLoc.watchPosition(showPosition, errorHandler, options);
	   //alert("ID: " + watchID);
	}
	else{
		if(navigator.notification)
		{
			navigator.notification.alert(
				'Sorry, your device does not support geolocation',
				function() {},
				'Geolocation',
				'OK'
			);
		}
		else
		{
			alert("Sorry, browser does not support geolocation!");
		}
	}
 }
 
 function errorHandler(error)
 {
	//alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
 }
 
 function calculateDistance(lat1, lon1, lat2, lon2) {
	  var R = 6371; // km
	  var dLat = (lat2 - lat1).toRad();
	  var dLon = (lon2 - lon1).toRad(); 
	  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			  Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
			  Math.sin(dLon / 2) * Math.sin(dLon / 2); 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
	  var d = R * c;
	  return d;
}
Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}

//===================== background geolocation ========================

function calculateCalories(dblDistance, Weight)
{
	 //convert km to miles 
	var dKmForCalories = dblDistance/1000.0;
	var dMile = dKmForCalories * 0.621371;
	
	//convert kg to pound 
	try
	{
			var dblWeight = parseFloat(Weight);
			var dblWeightPound = dblWeight * 2.20462;
			var CaloriesBurned = (dblWeightPound) * (0.63) * (dMile);
			
			return (Math.round(CaloriesBurned * 10) / 10);
		
	}
	catch(err)
	{
		return "- -";
	}
}

function configureBackgroundGeoLocation()
{
		/*window.navigator.geolocation.getCurrentPosition(function(location) {
            console.log('Location from Phonegap');
			alert("location from phonegap");
			
			 // BackgroundGeoLocation is highly configurable.
			
			//showPos(location);
        });*/
		try{
		    /*var bgGeo = window.plugins.backgroundGeoLocation;
	 
			var callbackFn = function(location, taskId){
				//runtap.util.gps.onBackgroundSuccess(location);
				//window.plugins.backgroundGeoLocation.finish();
			};
			 
			var failureFn = function(error){
				alert('Geolocation Error');
			};
			 
			bgGeo.configure(callbackFn, failureFn, {
				desiredAccuracy: 10,
				stationaryRadius: 10,
				distanceFilter: 30,
				debug: true
			});*/
			
			var options = {
					desiredAccuracy: 0,
					stationaryRadius: 10,
					distanceFilter: 10,
					activityType: "Fitness",//"Fitness",       // <-- iOS-only
					debug: false 
			};
			  
			try{
				window.plugins.backgroundGeoLocation.configure(callbackFn, failureFn, options);
			}
			catch(err)
			{
				//alert(err);
			}
			// Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
			window.plugins.backgroundGeoLocation.start();
		}
		catch(err)
		{
		
		}
        // If you wish to turn OFF background-tracking, call the #stop method.
        // window.plugins.backgroundGeoLocation.stop()

}


function failureFn(error) {
	console.log('BackgroundGeoLocation error');
	//alert("Error: " + error);
}

function callbackFn(location) {
	//console.log('[js] BackgroundGeoLocation callback:  ' + location.latitudue + ',' + location.longitude);
	// Do your HTTP request here to POST location to your server.
	//
	//
	//showPos(location);
	 var yourAjaxCallback = function(response) {
		// Very important to call #finish -- it signals to the native plugin that it can destroy the background thread, which your callbackFn is running in.
		// IF YOU DON'T, THE OS CAN KILL YOUR APP FOR RUNNING TOO LONG IN THE BACKGROUND
		window.plugins.backgroundGeoLocation.finish();
	};
	
	yourAjaxCallback.call(this, {status: 200});
	
	//alert("Call Back");
	//yourAjaxCallback.call(this);
	
	
};

function showPos(location)
{
	try{
		//alert(location.accuracy);
	}
	catch(err)
	{
	
	}
	LocationCount_Total = LocationCount_Total + 1;

	//$("#calories").val("" + LocationCount + "(" + LocationCount_background + ")");
	
	//document.getElementById('calories').innerHTML = "Location: " + LocationCount;
	
	//var mLastPosition = localStorage.getItem("CurrentRun_LastPosition");
	//LastPosition = mLastPosition;
	if(location.accuracy <= 10.0)
	{
		if(LastPosition == "")
		{
			LastPosition = location;
			var mCoordinate = localStorage.getItem("CurrentRun");
			if(mCoordinate == "")
			{
				mCoordinate = "" + location.latitude + "," + location.longitude;
			}
			else
			{
				mCoordinate = mCoordinate + "|" + location.latitude + "," + location.longitude;
			}
			localStorage.setItem("CurrentRun", mCoordinate);
				
			LocationCount_background = LocationCount_background + 1;
		}
		else
		{
			var distance = calculateDistance(LastPosition.latitude, LastPosition.longitude,
						location.latitude, location.longitude);
			distance = distance * 1000.0;
			if(distance >= 10.0)
			{
				TotalDistance = TotalDistance + distance;
				
				//document.getElementById('distance').innerHTML = TotalDistance;
				var mCoordinate = localStorage.getItem("CurrentRun");
				if(mCoordinate == "")
				{
					mCoordinate = "" + location.latitude + "," + location.longitude;
				}
				else
				{
					mCoordinate = mCoordinate + "|" + location.latitude + "," + location.longitude;
				}
				localStorage.setItem("CurrentRun", mCoordinate);
					
				LocationCount_background = LocationCount_background + 1;
				
				if(TotalDistance > 1000.0)
				{
					var d = TotalDistance / 1000.0;
					mdistance = Math.round(d * 100) / 100;
					document.getElementById('lbldistance').innerHTML = "Distance (km):";
					//$("#lbldistance").val("Distance (km)");
					$("#distance").val(mdistance + "");

				}
				else
				{
					mdistance = Math.round(TotalDistance * 100) / 100;
					//$("#lbldistance").val("Distance (meter)");
					document.getElementById('lbldistance').innerHTML = "Distance (meter):";
					$("#distance").val(mdistance + "");

				}
				
				LastPosition = location;	
				
				try{
						var weight = parseDouble("" + window.localStorage.getItem("userprofie_weight"));
						var dblTotalDistance = parseDouble("" + TotalDistance);
						var strCal = calculateCalories(dblTotalDistance, weight);
						$("#calories").val(strCal);
					}
					catch(err){}
			}
		}
	}
	//$("#calories").val("" + LocationCount + "(" + LocationCount_background + ")" + "[" + LocationCount_Total + "]");
	//localStorage.setItem("CurrentRun_LastPosition", LastPosition);
}
//======================== stop watch =================================

	
   function timecounter(starttime)
        {
        currentdate = new Date();
        lapdetails = document.getElementById('lapdetails');
        stopwatch = document.getElementById('stopwatch');
         
        var timediff = currentdate.getTime() - starttime;
        if(runningstate == 0)
            {
            timediff = timediff + stoptime //stoptime=0
            }
        if(runningstate == 1)
        {
			mFormattedDuration = formattedtime(timediff);
			
            stopwatch.value = mFormattedDuration;
            refresh = setTimeout('timecounter(' + starttime + ');',10);            
        }
        else
            {
            window.clearTimeout(refresh);
            stoptime = timediff;
            }
        }
 
function marklap()
             {
             if(runningstate == 1)
                   {
                   if(lapdate != '')
                       {
                        var lapold = lapdate.split(':');
                        var lapnow = stopwatch.value.split(':');
                        var lapcount = new Array();
                        var x = 0
        for(x; x < lapold.length; x++)
             {
         lapcount[x] = new Array();
         lapcount[x][0] = lapold[x]*1;
         lapcount[x][1] = lapnow[x]*1;
              }
         if(lapcount[1][1] < lapcount[1][0])
              {
            lapcount[1][1] += 60;
              lapcount[0][1] -= 1;
             }
          if(lapcount[2][1] < lapcount[2][0])
             {
             lapcount[2][1] += 10;
             lapcount[1][1] -= 1;
              }
       var mzeros = (lapcount[0][1] - lapcount[0][0]) < 10?'0':'';
       var szeros = (lapcount[1][1] - lapcount[1][0]) < 10?'0':'';
       lapdetails.value += '\t+' + mzeros + (lapcount[0][1] - lapcount[0][0]) + ':'
        + szeros + (lapcount[1][1] - lapcount[1][0]) + ':'
           + (lapcount[2][1] - lapcount[2][0]) + '\n';
         }
       lapdate = stopwatch.value;
       lapdetails.value += (++lapcounter) + '. ' + stopwatch.value;
        }
     }
/*function startandstop()
      {
      var startandstop = document.getElementById('startandstopbutton');
      var startdate = new Date();
      var starttime = startdate.getTime();

      if(runningstate == 0)
    {      
     startandstop.value = 'Stop running';
     runningstate = 1;      
     timecounter(starttime);
     }
 else
      {    
        startandstop.value = 'Start my run';
        runningstate = 0;     
        lapdate = '';
      }
   }*/
   
 function startDuration()
 {
	   var startdate = new Date();
      var starttime = startdate.getTime();
	   runningstate = 1;      
	 timecounter(starttime);
 }
 function stopDuration()
 {
	   var startdate = new Date();
      var starttime = startdate.getTime();
	   runningstate = 0;
	lapdate = '';
 }
 
function resetstopwatch()
        {
      lapdetails.value = '';
      lapcounter = 0;
       stoptime = 0;
      lapdate = '';
      window.clearTimeout(refresh);
     if(runningstate == 1)
   {
   var resetdate = new Date();
   var resettime = resetdate.getTime();
   timecounter(resettime);
  }
else
  {
stopwatch.value = "00:00:00"; //reset stopwatch value
  }
 }
 function formattedtime(unformattedtime)
  {    
    var sec = Math.floor(unformattedtime/1000) % 60;
    var min = Math.floor(unformattedtime/(1000 * 60)) % 60;
    var hour = Math.floor(unformattedtime/(1000 * 60 * 60)) % 24;
    
    if (sec < 10) {
        sec = '0' + sec;
    }
    else{
        sec= sec;
    }
    
    if (min < 10) {
        min = '0' + min;
    }
    else{
        min = min;
    }
    
    if (hour <10) {
        hour = '0' + hour;
    }
    else{
        hour = hour;
    }
    /*var min = sec / 60;
     var hour = min / 60;*/
   //var second = Math.floor(unformattedtime/1000);
    //var minute = Math.floor(unformattedtime/60000);
//decisec = decisec.charAt(decisec.length - 1);
//second = second - 60 * minute + '';
return hour + ':'  + min + ':' + sec;
}

function setInputButtonText(txt){
          $("#startandstopbutton").prev('a').find('span.ui-btn-text').text(txt);
}
