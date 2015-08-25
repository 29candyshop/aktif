//Application logic

var watchID;
var geoLoc;
var TotalDistance = 0.0;
var LastPosition = '';
	 
//document ready
$(document).ready(function(){
	var AccessToken = window.localStorage.getItem('AccessToken');
	if(AccessToken == null)
	{
	
		location.hash = "#LoginPage";
		
	}
	else
	if(AccessToken == "")
	{
		location.hash = "#LoginPage";
	}
	else
	{
		
		UserSummary();
		$("button").click(function(){
			$("p").slideToggle();
			
		});
		
		$(function() {
			/*$(".evtHistory").live('click', function(){
				var a = this;
				var id = a.id.replace("Historyinfo-", "");
				location.hash = "#runMap";
			});*/
		});
	}
});

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
	if($("#displayname").val() == "")
	{
		document.getElementById('lblRegister').innerHTML = "Please fill up your particular, email address and password";
		$("#lblRegister").css({"color":"#F4141C"});
		return;
	}
	if($("#username").val() == "")
	{
		document.getElementById('lblRegister').innerHTML = "Please fill up your particular, email address and password";
		$("#lblRegister").css({"color":"#F4141C"});
		return;
	}
	if($("#password").val() == "")
	{
		document.getElementById('lblRegister').innerHTML = "Please fill up your particular, email address and password";
		$("#lblRegister").css({"color":"#F4141C"});
		return;
	}
	if($("#confirmpassword").val() == "")
	{
		document.getElementById('lblRegister').innerHTML = "Please fill up your particular, email address and password";
		$("#lblRegister").css({"color":"#F4141C"});
		return;
	}
	if($("#password").val() != $("#confirmpassword").val())
	{
		document.getElementById('lblRegister').innerHTML = "Password not match";
		$("#lblRegister").css({"color":"#F4141C"});
		return;
	}
	//var win = window.open("index.html", '_self');
	//return;
	 $.post("http://www.aktifpenang.com/api/_api_register.php", 
		{
			displayname: $("#displayname").val(),
			username: $("#username").val(),
			password: $("#password").val() 
		}, 
		function(result){
			var obj = JSON.parse(result);
			if(obj.status == true)
			{
				var win = window.open("index.html", '_self');
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
	var result = window.localStorage.getItem("aktif_runHistory");
	var objGroup = JSON.parse(result);
	for(var i = 0; i < objGroup.runs.length; i++) {
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
	}
	
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
	
//display alert box when submit button clicked(testing)
function disp_alert(email) {
        alert(email + ", login successfulled.");
     }
     
function reset_alert(email) {
        alert(email + ", reset password.");
    }
    
//form login setting
function loadXMLDoc(){
    var xmlhttp;
    var name = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
        if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else{// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState===4 && xmlhttp.status===200) //place check status whether username&pass correct not. Partially done
            {
                //document.getElementById("myDiv").value=xmlhttp.responseText;
                alert(xmlhttp.responseText);
            }
            else{
                //document.getElementById("myDiv").value=xmlhttp.responseText;
            }
        } 
        xmlhttp.open("POST","http://www.aktifpenang.com/api/_api_login.php",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("username=" + name + "&password=" + pass);
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
	 $.post("http://www.aktifpenang.com/api/_api_login.php", {username: name, password:pass}, function(result){
        //$("span").html(result);
		var obj = JSON.parse(result);
		//window.localStorage.getItem('AccessToken')
		if(obj.status == true)
		{
			if(obj.token != "")
			{
				window.localStorage.setItem("AccessToken", obj.token);
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
		facebookConnectPlugin.login( ["email"], 
			function (response) { alert(JSON.stringify(response)) },
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
			window.localStorage.setItem("firstname", obj.summary[0].firstname);
			window.localStorage.setItem("lastname", obj.summary[0].lastname);
			window.localStorage.setItem("userimage", obj.summary[0].userimage);
			window.localStorage.setItem("TotalRuns", obj.summary[0].TotalRuns);
			window.localStorage.setItem("TotalDistance", obj.summary[0].TotalDistance);
			window.localStorage.setItem("TotalEvents", obj.summary[0].TotalEvents);

			var distance = obj.summary[0].CampaignDistance;
			distance = distance / 1000.0;
			distance = Math.round(distance * 100) / 100;
			$("#CampaignSummary").html("" + obj.summary[0].CampaignUser + " members | Distance: " + distance + "km" );
			$("#username").html("" + obj.summary[0].firstname + " " + obj.summary[0].lastname + "" );
			$("#userSummary").html("" + obj.summary[0].TotalRuns + " runs | Distance: " + distance + "km | Groups: " + obj.summary[0].TotalEvents );
			
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

	var distance = CampaignDistance;
	distance = distance / 1000.0;
	distance = Math.round(distance * 100) / 100;
	$("#CampaignSummary"+ divId).html("" + CampaignUser + " members | Distance: " + distance + "km" );
	$("#username"+ divId).html("" + firstname + " " + lastname + "" );
	$("#userSummary"+ divId).html("" + TotalRuns + " runs | Distance: " + distance + "km | Groups: " + TotalEvents );
}

function LeaderBoard()
{
	 var mToken = window.localStorage.getItem("AccessToken");
		$.get("http://www.aktifpenang.com/api/_api_leader_get.php", 
		{
			token: mToken
		}, 
		function(result){
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

function Groups(mgroupid)
{

		 var mToken = window.localStorage.getItem("AccessToken");
		 $.get("http://www.aktifpenang.com/api/_api_group_get.php", 
			{
				token: mToken,
				groupid: mgroupid
			}, 
			function(result){
				//$("span").html(result);
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
				
				//alert(obj.token);
			});

}

function Runs(mRunid)
{

		 var mToken = window.localStorage.getItem("AccessToken");
		 $.get("http://www.aktifpenang.com/api/_api_usercheckin.php", 
			{
				token: mToken,
				runid: 'all'
			}, 
			function(result){
				//$("span").html(result);
				var obj = JSON.parse(result);
				
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
				for(var i = 0; i < objGroup.runs.length; i++) {
					var obj = objGroup.runs[i];
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
					
					var html = '<div id="Historyinfo-' + obj.activityid + '" class="evtHistory" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(images/icons/' + image + ');border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
					'<div style="float:left;width:60%;"><span id="">' + mdistance + munit + '</span></br><span id="" style="font-size:14px;color:#888;">Duration: ' + obj.duration + '</span></br><span id="" style="font-size:14px;color:#888;">' + obj.rundate + '</span></div></div>';
					panelMain.append(html);
					panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
					
					//console.log(obj.name);
					//console.log(obj.tagline);
					//console.log(obj.membercount);
					
					//console.log(distance + "km");
					//console.log(obj.isGroup);
				}
				
				//alert(obj.token);
			});

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
			alert("Error Updating Your Profile. Please Try Again.");
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
	TotalDistance = 0.0;
	$("#distance").val(TotalDistance);
 
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
	
	//start timer
	startandstop();
	
	//start location updates
	getLocationUpdate();
}

function StopRun()
{
	//$("#startandstopbutton").val("Start My Run");
	//document.getElementById('btnStartStop').innerHTML = "Start My Run";
	
	//set button color to red 
	$("#btnStart").css({'display':'block'});
	$("#btnStop").css({'display':'none'});
	
	document.getElementById('activity').disabled = false;
	//sttop timer
	startandstop();
	
	//store duration 
	var mDuration = $("#stopwatch").val();
	localStorage.setItem("CurrentRun_Duration", mDuration);
	
	//store distance
	localStorage.setItem("CurrentRun_Distance", TotalDistance);
	
	//stop location updates
	stopLocationWatch();
	
	//convert coordinates to static image url
	var mMapURL = getMapURL();
	//alert(mMapURL);
	localStorage.setItem("CurrentRun_Map", mMapURL);
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	
	var min = today.getMinutes();
	var hour = today.getHours();
	var sec = today.getSeconds();
	
	var runDate = yyyy + "-" + mm + "-" + dd + " " + hour + ":" + hour + ":" + sec;
	localStorage.setItem("CurrentRun_Date", runDate);
	if(TotalDistance > 0.0)
	{
		//SynctoDB();
	}
	else
	{
		alert("Distance need to be more than 0.0 meter as valid run.");
	}
	
	SynctoDB();
	//set mcurrent run to emty
	localStorage.setItem("CurrentRun", "");
	
	//var href = "myrun.html";
	
	
	
	
	location.hash = "#runMap";
	//var win = window.open(href, '_self');
			
}

function displayMyRun()
{
	
	var mActivity = localStorage.getItem("CurrentRun_Activity");
	var mD = localStorage.getItem("CurrentRun_Distance");
	var mDuration = localStorage.getItem("CurrentRun_Duration");
	var mMap = localStorage.getItem("CurrentRun_Map");
	var runDate = localStorage.getItem("CurrentRun_Date");
	
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
				
				$("#divMap").css({'background-image':'url('+ obj.runs[0].map +')'});
			}
		);
	}
	else
	{
		$("#divMap").css({'background-image':'url('+ mMap +')'});
	}
	
	if(mD > 1000.0)
	{
		var d = mD / 1000.0;
		mdistance = Math.round(d * 100) / 100;
		document.getElementById('lblMapDistance').innerHTML = "Distance (km):";
		document.getElementById('mapDistance').innerHTML = mdistance;
	}
	else
	{
		mdistance = Math.round(mD * 100) / 100;
		document.getElementById('lblMapDistance').innerHTML = "Distance (meter):";
		document.getElementById('mapDistance').innerHTML = mdistance;
	}
			
	
	
	
	document.getElementById('lblMapDistance').innerHTML = document.getElementById('lbldistance').innerHTML;
	//document.getElementById('mapDistance').innerHTML = mdistance;
	document.getElementById('mapDuration').innerHTML = mDuration;
	document.getElementById('mapRunDate').innerHTML = runDate;
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
			
	$("#groupImage").css({'background-image':'url(http://aktif.29candyshop.com/group_images/'+ CurrentGroup_Image +')'});
	
	
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
				var objUserlist = obj.userlist;
				var objIsJoined = obj.isGroup;
				if(objIsJoined == "0")
				{
					$('#btnJoinGroup' + '').css({'display':'block'});
					$('#btnLeaveGroup' + '').css({'display':'none'});
				}
				else
				{
					$('#btnJoinGroup' + '').css({'display':'none'});
					$('#btnLeaveGroup' + '').css({'display':'block'});
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
	
	var mToken = window.localStorage.getItem("AccessToken");
	var mActivity = localStorage.getItem("CurrentRun_Activity");
	var mdistance = localStorage.getItem("CurrentRun_Distance");
	var mDuration = localStorage.getItem("CurrentRun_Duration");
	var mCoor = localStorage.getItem("CurrentRun");
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
	coor_json = "[" + coor_json + "]";
	var mRoute = '';
	
	var runDate = localStorage.getItem("CurrentRun_Date");
	
	 $.post("http://www.aktifpenang.com/api/_api_usercheckin.php", 
	 {
		token: mToken,
		distance: mdistance, 
		activity_type:mActivity,
		route:coor_json,
		duration: mDuration,
		avepace:'',
		workout_type:'Free Run',
		eventid:'',
		rundate:runDate,
		checkin_type:'live'
		
	}, function(result){
        //$("span").html(result);
		var obj = JSON.parse(result);
		//window.localStorage.getItem('AccessToken')
		if(obj.status == true)
		{
			//insert to run history json and store to localStorage
		}
	});
}

function getMapURL()
{
	//var mCoordinate = localStorage.getItem("CurrentRun");
	//var arrCoordinate[] = new Array();
	//arrCoordinate = mCoordinate.split("|");
	
	//loop and append
	var mapURL = "http://maps.googleapis.com/maps/api/staticmap?size=400x400&path=" + localStorage.getItem("CurrentRun");
	
	return mapURL;
}

function showPosition(position) {
    //x.innerHTML = "Latitude: " + position.coords.latitude + 
    //"<br>Longitude: " + position.coords.longitude;
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
		
		if(LastPosition == '')
		{
			LastPosition = position;
		}
		else
		{
			var distance = calculateDistance(LastPosition.coords.latitude, LastPosition.coords.longitude,
                        position.coords.latitude, position.coords.longitude);
			distance = distance * 1000.0;
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
			
			LastPosition = position;	
		}
}

function stopLocationWatch(){
	 geoLoc = navigator.geolocation;
     geoLoc.clearWatch(watchID);
}

function getLocationUpdate(){
	if(navigator.geolocation){
	   // timeout at 60000 milliseconds (60 seconds)
	   var options = {timeout:10000, enableHighAccuracy: true };
	   geoLoc = navigator.geolocation;
	   watchID = geoLoc.watchPosition(showPosition, errorHandler, options);
	}
	
	else{
	   alert("Sorry, browser does not support geolocation!");
	}
 }
 
 function errorHandler()
 {
 
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
