/**
*	In this file all the core logic is put.
*	This includes panel menus, headers, footers and generic buttons and functions.
*/

// JSLint, include this before tests
// var window, $, document, jQuery, navigator, screen, onDeviceReady, startPreLoadImages, onResume, onPause, pressBackButton, onMenuKeyDown, onSearchKeyDown, setTimeout, togglePanel, checkConnection, toast, handleAndroidPreferences, cleanUriVars, emptyCallback, checkOpenPanels, Connection, getPackageVersion, hideNonContextButtons, panelMenuLeftOpened, showNonContextButtons, panelMenuLeftClosed, adjustStyle, handlePreferredScreenSize;

// global settings
window.androidPrefsLib = "jpHoloSharedPreferences";
window.loadingAnimation = '<div class="loading"><div class="outer"></div><div class="inner"></div></div>';

// device ready
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	// let the function "isDeviceReady" know that the event "deviceready" has been fired
	window.deviceReady = true;
	// prelude app images for faster GUI
	//startPreLoadImages();
	// inject device type specific stylesheet
	//adjustStyle();
	
	/*
	// execute when app resumes from pause
	document.addEventListener("resume", onResume, false);
	// execute when app goes to pause (home button or opening other app)
	document.addEventListener("pause", onPause, false);
	// override default backbutton behavior with own
	document.addEventListener("backbutton", pressBackButton, false);
	// override default menubutton behavior with own
	document.addEventListener("menubutton", onMenuKeyDown, false);
	// override default searchbutton behavior with own
	document.addEventListener("searchbutton", onSearchKeyDown, false);	*/
	
	
	// demonstrate panel menu on first boot
	/*if (window.localStorage.getItem('firstBoot') !== 'done') {
		var headerTitle = $("#headerTitle" + window.localStorage.getItem("divIdGlobal"));
		headerTitle.addClass("holoPressEffect");
		setTimeout(function () {
			togglePanel('#panelMenuIndex');
		}, 500);
		setTimeout(function () {
			headerTitle.removeClass("holoPressEffect");
			togglePanel('#panelMenuIndex');
		}, 1500);
		window.localStorage.setItem('firstBoot', 'done');
	}*/
	window.localStorage.setItem('firstBoot', 'done');
}

// image preloader
jQuery.preloadImages = function () {
	var i;
	for (i = 0; i < arguments.length; i = i + 1) {
		jQuery("<img>").attr("src", arguments[i]);
	}
};

// actually preload images
function startPreLoadImages() {
	$.preloadImages(
		"./images/icons/ic_action_home.png",
		"./images/icons/ic_action_info.png",
		"./images/icons/ic_action_list_header.png",
		"./images/icons/ic_action_overflow_header.png",
		"./images/icons/ic_action_share_header.png",
		"./images/icons/ic_launcher_full_arrow.png",
		"./images/icons/ic_launcher_full_menu.png",
		"./images/icons/ic_launcher_full_menu_opened.png",
		"./images/icons/ic_launcher_full_noarrow.png",
		"./images/icons/ic_launcher_menu_full.png",
		"./images/icons/ic_run_launcher.png",
		"./images/icons/ic_run_menu_launcher2.png",
		"./images/icons/ic_profile_launcher.png",
		"./images/icons/ic_profile_menu_launcher.png",
		"./images/icons/ic_history_launcher.png",
		"./images/icons/ic_history_menu_launcher.png",
		"./images/icons/ic_groups_launcher.png",
		"./images/icons/ic_groups_menu_launcher.png",
		"./images/icons/ic_event_launcher.png",
		"./images/icons/ic_event_menu_launcher.png",
		"./images/icons/ic_about_launcher.png",
		"./images/icons/ic_about_menu_launcher.png"
	);
}

// callback function to check if device is ready
/*function isDeviceReady(value, action) {
	if (window.deviceReady === true) {
		var connection = checkConnection();
		switch (action) {
		case "InitApp":
			startPreLoadImages();
			toast("Holo Light with Dark action bar example\nDevice is ready according to PhoneGap.\nConnection type: " + connection, "short");
			break;
		case "InitUri":
			var message;
			handleAndroidPreferences("get", window.androidPrefsLib, "UriMessage", "", function (prefValue) {
				message = prefValue;
				if (message !== "") {
					cleanUriVars();
					window.localStorage.setItem("uriView", "true");
					window.localStorage.setItem("uriMessage", message);
					$("body").pagecontainer("change", "#uriPage");
				} else {
					window.localStorage.setItem("uriView", "false");
					window.localStorage.setItem("uriMessage", "");
					$("body").pagecontainer("change", "#indexPage");
				}
			});
			break;
		}
	} else {
		window.setTimeout("isDeviceReady(\"" + value + "\", \"" + action + "\");", 100);
	}
}*/

// clean URI preferences variables
function cleanUriVars() {
	handleAndroidPreferences("set", window.androidPrefsLib, "UriMessage", "", emptyCallback);
}

// override default back button handling
function pressBackButton() {
	// exit app if you are viewing URI content
	if (window.localStorage.getItem("uriView") === "true") {
		window.localStorage.setItem("uriView", "false");
		navigator.app.exitApp();
	// if panel is not open, then go on
	} else if (checkOpenPanels() === false) {
		if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === "indexPage") {
			navigator.app.exitApp(); // This will exit the app.
		} else {
			window.history.back();
		}
	// else close panels first, and stop further action
	} else {
		var divLeftId, divRightId;
		if (window.localStorage.getItem('panelLeft') === 'open') {
			divLeftId = '#panelMenu' + window.localStorage.getItem("divIdGlobal");
			$(divLeftId).panel("close");
		} else if (window.localStorage.getItem('panelRight') === 'open') {
			divRightId = '#panelMenuRight' + window.localStorage.getItem("divIdGlobal");
			$(divRightId).panel("close");
		}
	}
}

// menu button
function onMenuKeyDown() {
    togglePanel('#panelMenuRight' + window.localStorage.getItem("divIdGlobal"));
}

// search button
function onSearchKeyDown() {
    toast('You want to search?', 'short');
}

// pause app
function onPause() {
	toast('App paused', 'short');
}

// resume app
function onResume() {
	toast('App resumed', 'short');
}

// get current date as string
function currentDate() {
	var today = new Date(), dd = today.getDate(), mm = today.getMonth() + 1, yyyy = today.getFullYear(), date = yyyy + "-" + mm + "-" + dd;
	return date;
}

// get current connection type
function checkConnection() {
	var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
	if(app){
		var networkState = navigator.connection.type, states = {};
		states[Connection.UNKNOWN] = 'Unknown';
		states[Connection.ETHERNET] = 'Ethernet';
		states[Connection.WIFI] = 'WiFi';
		states[Connection.CELL_2G] = '2G';
		states[Connection.CELL_3G] = '3G';
		states[Connection.CELL_4G] = '4G';
		states[Connection.NONE] = 'None';
		return states[networkState];
	}
	else
	{
		return "";
	}
}

// adjust specific style to tablet or smartphone view
function adjustStyle() {
	handlePreferredScreenSize(function (screenValue) {
		if (screenValue === "xlarge" || screenValue === "large") {
			$("#sizeStylesheet").attr("href", "./themes/jpholo.tablet.css");
		} else {
			$("#sizeStylesheet").attr("href", "./themes/jpholo.smartphone.css");
		}
	});
}

// Open any anchor with http/https through javascript
$(document).on('click', 'a[href^=http], a[href^=https]', function (event) {
	event.preventDefault();
	var url = $(this);
	window.open(url.attr('href'), '_system');
});

// default left panelmenu (define menu for all pages)
function panelMenu(divId) {
	var mScreenHeight = $(window).height(); 
	var addon = "";
	var addon2 = "";
	if(mScreenHeight < 500)
	{
		addon = 'style="width:50%;float:left;height:80px;"';
		addon2 = 'style="height:80px;"';
	}
	var panelMain = $('#panelMenu' + divId + '');
	panelMain.children().remove('#userinfo'+ divId);
	panelMain.prepend('<div id="userinfo'+ divId + '" style="float:left;width:100%;margin-top:60px;"><div id="userImage'+ divId + '" style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(images/icons/login.png);border-radius: 30px;width: 60px;height: 60px;float:left;background-size:contain;"></div><div style="float:left;width:60%;"><span id="username'+ divId + '"></span></br><span id="userSummary'+ divId + '" style="font-size:14px;color:#555;"></span></div></div>');
	
	var panel = $('#panelMenu' + divId + 'UL');
	panel.children().remove('li');
	//panel.append('<li data-icon="false" class="headerSpace"><p>&nbsp;</p></li>'); // empty space, needed for header
	panel.append('<li data-icon="false" ' + addon +'><a class="panelText" ' + addon2 +' href="#indexPage"><img src="./images/icons/icon_aktifpenang.png" class="ui-li-icon largerIcon">New Activity</a></li>');
	panel.append('<li data-icon="false" ' + addon +'><a class="panelText" ' + addon2 +' href="#leaderBoardPage"><img src="./images/icons/leaderboard.png" class="ui-li-icon largerIcon">Leader Board</a></li>');
	panel.append('<li data-icon="false" ' + addon +'><a class="panelText" ' + addon2 +' href="#historyPage"><img src="./images/icons/history.png" class="ui-li-icon largerIcon">My History</a></li>');
	panel.append('<li data-icon="false" ' + addon +'><a class="panelText" ' + addon2 +' href="#groupsPage"><img src="./images/icons/groups.png" class="ui-li-icon largerIcon">Groups</a></li>');
	panel.append('<li data-icon="false" ' + addon +'><a class="panelText" ' + addon2 +' href="#eventsPage"><img src="./images/icons/event_bw.png" class="ui-li-icon largerIcon">Events</a></li>');
	panel.append('<li data-icon="false" ' + addon +'><a class="panelText" ' + addon2 +' href="#sponsorsPage"><img src="./images/icons/sponsor.png" class="ui-li-icon largerIcon">Sponsors & Organizers</a></li>');
	panel.append('<li data-icon="false" ' + addon +'><a class="panelText" ' + addon2 +' href="#profilePage"><img src="./images/icons/login.png" class="ui-li-icon largerIcon">My Profile</a></li>');
	panel.append('<li data-icon="false" ' + addon +'><a class="panelText" ' + addon2 +' href="#aboutPage"><img src="./images/icons/ic_action_info_bw.png" class="ui-li-icon largerIcon">About</a></li>');
	panel.listview('refresh');
	
	displayUserSummary(divId);
}

// default right panelmenu (define menu for all pages)
function panelMenuRight(divId) {
	var panel = $('#panelMenuRight' + divId + 'UL');
	panel.children().remove('li');
	
	panel.append('<li data-icon="false" class="headerSpace"><p>&nbsp;</p></li>'); // empty space, needed for header
	panel.append('<li data-icon="false"><a class="panelText" href="#SettingPage">App Settings</a></li>');
	panel.listview('refresh');
}

// panel open and closed handling
function panelHandling() {
	var currentId = window.localStorage.getItem("divIdGlobal");
	$("#panelMenu" + currentId).panel({
		open: function () {
			window.localStorage.setItem("panelLeft", 'open');
			hideNonContextButtons('panel');
			panelMenuLeftOpened();
		}
	});
	$("#panelMenu" + currentId).panel({
		close: function () {
			window.localStorage.setItem("panelLeft", 'closed');
			showNonContextButtons('panel');
			panelMenuLeftClosed();
		}
	});
	$("#panelMenu" + currentId + "UL").on("click", "li", function () {
		$('#panelMenu' + currentId).panel("close");
	});
	$("#panelMenuRight" + currentId).panel({
		open: function () {
			window.localStorage.setItem("panelRight", 'open');
			hideNonContextButtons('panel');
		}
	});
	$("#panelMenuRight" + currentId).panel({
		close: function () {
			window.localStorage.setItem("panelRight", 'closed');
			showNonContextButtons('panel');
		}
	});
	$("#panelMenuRight" + currentId + "UL").on("click", "li", function () {
		$('#panelMenuRight' + currentId).panel("close");
	});
}

// reset panel states
function resetPanelState() {
	window.localStorage.setItem('panelLeft', 'closed');
	window.localStorage.setItem('panelRight', 'closed');
}

// hide non-contextual buttons when panel opens
function hideNonContextButtons(type) {
	var currentId = window.localStorage.getItem("divIdGlobal");
	if ($('#headerShare' + currentId).length > 0) {
		$('#headerShare' + currentId).hide();
	}
	// use this part if you want to hide buttons in action bars of which the buttons do not apply to every page
	if ($('#headerOtherButton' + currentId).length > 0 && type !== "somethingOtherThenPanel") {
		$('#headerOtherButton' + currentId).hide();
	}
}

// show non-contextual buttons when panel closes
function showNonContextButtons(type) {
	var currentId = window.localStorage.getItem("divIdGlobal");
	if ($('#headerShare' + currentId).length > 0) {
		$('#headerShare' + currentId).show();
	}
	// use this part if you want to show buttons in action bars of which the buttons do not apply to every page
	if ($('#headerOtherButton' + currentId).length > 0 && type !== "somethingOtherThenPanel") {
		$('#headerOtherButton' + currentId).show();
	}
}

// show title icon with the dashes more to the left
function panelMenuLeftOpened() {
	var currentId = window.localStorage.getItem("divIdGlobal");
	if (window.localStorage.getItem("pageNaveType") === "menu") {
		//$("#headerTitle" + window.localStorage.getItem("divIdGlobal")).attr("src", "./images/icons/ic_launcher_full_menu_opened.png");
		//$("#headerTitle" + window.localStorage.getItem("divIdGlobal")).attr("src", "./images/icons/ic_launcher_menu_full.png");		
		if (currentId === "Index") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_run_menu_launcher2.png");
		}
		else if (currentId === "LeaderBoard") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_leaderboard_launcher.png");
		}
		else if (currentId === "History") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_history_menu_launcher.png");
		}
		else if (currentId === "Groups") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_groups_menu_launcher.png");
		}
		else if (currentId === "Events") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_event_menu_launcher.png");
		}
		else if (currentId === "Profile") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_profile_menu_launcher.png");
		}
		else if(currentId === "About"){
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_about_menu_launcher.png");
		}
		/*else{
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_launcher_menu_full.png");
		}*/
	}
}

// show title icon with the dashes more to the right
function panelMenuLeftClosed() {
	var currentId = window.localStorage.getItem("divIdGlobal");
	if (window.localStorage.getItem("pageNaveType") === "menu") {
		//$("#headerTitle" + window.localStorage.getItem("divIdGlobal")).attr("src", "./images/icons/ic_launcher_full_menu.png");		
		//$("#headerTitle" + window.localStorage.getItem("divIdGlobal")).attr("src", "./images/icons/ic_run_launcher.png");
		if (currentId === "Index") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_run_launcher.png");
		}
		else if (currentId === "LeaderBoard") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_leaderboard_launcher.png");
		}
		else if (currentId === "History") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_history_launcher.png");
		}
		else if (currentId === "Groups") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_groups_launcher.png");
		}
		else if (currentId === "Events"){
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_event_launcher.png");
		}
		else if (currentId === "Profile"){
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_profile_launcher.png");
		}
		else if (currentId === "About") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_about_launcher.png");
		}
		/*else{
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_launcher_menu_full.png");
		}*/
	}
}

// toggle panel menu (open/close)
function togglePanel(panel) {
	$(panel).panel("toggle");
}

// press effect in header bar
function pressEffectHeader(share, action) {
	/** use action "menu" when using app icon as side panel (#panelMenu...)
	*	use action "back" when using app icon as back
	*/
	window.localStorage.setItem("pageNaveType", action);
	var currentId = window.localStorage.getItem("divIdGlobal");
	// restore icons
	if (action === "menu") {
		//$("#headerTitle" + currentId).attr("src", "./images/icons/ic_launcher_full_menu.png");		
		//$("#headerTitle" + currentId).attr("src", "./images/icons/ic_launcher_menu_full.png");
		if (currentId === "Index") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_run_launcher.png");
		}
		else if (currentId === "LeaderBoard") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_leaderboard_launcher.png");
		}
		else if (currentId === "History") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_history_launcher.png");
		}
		else if (currentId === "Groups") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_groups_launcher.png");
		}
		else if (currentId === "Events") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_event_launcher.png");
		}
		else if (currentId === "Sponsors") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_sponsor_launcher.png");
		}
		else if (currentId === "Profile") {
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_profile_launcher.png");
		}
		else if (currentId === "About"){
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_about_launcher.png");
		}
		/*else{
			$("#headerTitle" + currentId).attr("src", "./images/icons/ic_launcher_menu_full.png");
		}*/
	}
	showNonContextButtons('panel');
	// header title press effect (left panel)
	$("#headerTitle" + currentId).off('touchstart').on('touchstart', function () {
		$(this).addClass("holoPressEffect");
	});
	$("#headerTitle" + currentId).off('touchend').on('touchend', function () {
		$(this).removeClass("holoPressEffect");
	});
	$("#headerTitle" + currentId).off('touchmove').on('touchmove', function () {
		$(this).removeClass("holoPressEffect");
	});
	// overflow title press effect (right panel)
	$("#headerOverflow" + currentId).off('touchstart').on('touchstart', function () {
		$(this).addClass("holoPressEffect");
	});
	$("#headerOverflow" + currentId).off('touchend').on('touchend', function () {
		$(this).removeClass("holoPressEffect");
	});
	$("#headerOverflow" + currentId).off('touchmove').on('touchmove', function () {
		$(this).removeClass("holoPressEffect");
	});
	// share press effect
	if (share === true) {
		$("#headerShare" + currentId).off('touchstart').on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#headerShare" + currentId).off('touchend').on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
		$("#headerShare" + currentId).off('touchmove').on('touchmove', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
}

// press effect in footer bar
function pressEffectFooter(button1, button2) {
	var currentId = window.localStorage.getItem("divIdGlobal");
	// button1 press effect
	if (button1 === true) {
		$("#footerShare" + currentId).off('touchstart').on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#footerShare" + currentId).off('touchend').on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
		$("#footerShare" + currentId).off('touchmove').on('touchmove', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
	// button2 press effect
	if (button2 === true) {
		$("#footerToast" + currentId).off('touchstart').on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#footerToast" + currentId).off('touchend').on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
		$("#footerToast" + currentId).off('touchmove').on('touchmove', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
}

// check if there is a panel open or not
function checkOpenPanels() {
	if (window.localStorage.getItem('panelLeft') === "closed" && window.localStorage.getItem('panelRight') === "closed") {
		return false;
	}
	return true;
}

// image preloader
jQuery.preloadImages = function () {
	var i;
	for (i = 0; i < arguments.length; i = i + 1) {
		jQuery("<img>").attr("src", arguments[i]);
	}
};