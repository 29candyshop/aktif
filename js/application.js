/**
*	In this file all the application logic is put.
*/

// JSLint, include this before tests
// var window, navigator, $, device, cordova, document, jQuery, share, toast, togglePanel, initServiceSettings, resetPanelState, panelMenu, panelMenuRight, panelHandling, pressEffectHeader, pressEffectFooter, isDeviceReady, setTimeout, toggleImmersive;

// clear to first boot state
function clearFirstBoot() {
	//window.localStorage.clear();
	//navigator.app.exitApp();
}

// get the systemspecs
function getSystemSpecs() {
	var $content = $('#systemSpecs'),
		tag;
	if (window.phonegapExcluded === false) {
		tag =	'<p id="systemSpecs">' +
				'Device model: ' + device.model + '<br />' +
				'Device platform: ' + device.platform + ' ' + device.version + '<br />' +
				'PhoneGap version: ' + cordova.version + '<br />' +
				'jQuery version: ' + jQuery.fn.jquery + '<br />' +
				'jQuery Mobile version: ' + $.mobile.version + '<br />' +
				'</p>';
	} else {
		tag =	'<p id="systemSpecs">' +
				'Operating System: ' + navigator.platform + '<br />' +
				'Browser: ' + navigator.appName + ' ' + navigator.appVersion + '<br />' +
				'jQuery version: ' + jQuery.fn.jquery + '<br />' +
				'jQuery Mobile version: ' + $.mobile.version + '<br />' +
				'</p>';
	}
	$content.replaceWith(tag);
}

// show Uri Message in app
function showUriMessage() {
	$('#uriMessage').empty().append(window.localStorage.getItem("uriMessage"));
}

// assign click events to elements
function htmlClickEventHandlers(id, action) {
	/** use action "menu" when using app icon as side panel (#panelMenu...)
	*	use action "back" when using app icon as back
	*/
	// every page
	$('#headerTitle' + id).off("click").on("click",
		function () {
			if (action !== "back") {
				togglePanel('#panelMenu' + id);
			} else {
				window.history.back();
			}
		});
	$('#headerShare' + id).off("click").on("click",
		function () {
			share(window.localStorage.getItem('shareTagSubject'), window.localStorage.getItem('shareTagText'));
		});
	$('#headerShare' + id).on("taphold",
		function () {
			toast("Share", "short");
		});
	$('#headerOverflow' + id).off("click").on("click",
		function () {
			togglePanel('#panelMenuRight' + id);
		});
	// specific page...
	if (id === "Index") {
		
		$('#clearFirstBoot').off("click").on("click",
			function () {
				//clearFirstBoot();
			});
	} else if (id === "Second") {
		// do nothing
	} else if (id === "LeaderBoard") {
		//LeaderBoard();
		// do nothing
	}else if (id === "History") {
		
		// do nothing
	} else if (id === "Groups") {
		//Groups();
		//initServiceSettings();
	}
	else if(id == "Profile")
	{
		displayUserProfile();
	}
	else if(id == "editProfile")
	{
		displayeditProfile();
	}
	else if(id == "runMap")
	{
		
	}
	else if (id === "GroupInfo") {
		
	}
	// every page but...
	if (id !== "History") {
		$('#footerShare' + id).off("click").on("click",
			function () {
				share(window.localStorage.getItem('shareTagSubject'), window.localStorage.getItem('shareTagText'));
			});
		$('#footerShare' + id).on("taphold", function () {
			toast("Share", "short");
		});
		$('#footerToast' + id).off("click").on("click", function () {
			toast('This is a toast message', 'short');
		});
		$('#footerToast' + id).on("taphold", function () {
			toast("Toast", "short");
		});
	}
}

// initialize page variables and elements on create
function initPageVarsOnCreate(id) {
	// every page
	// every page but...
	if (id !== "LandingPage") {
		// nothing needed atm
	}
	if (id === "Index") {
		htmlClickEventHandlers(id, "menu");
	}else if (id === "LeaderBoard") {
		htmlClickEventHandlers(id, "menu");
	}else if (id === "History") {
		htmlClickEventHandlers(id, "menu");
	}else if (id === "Groups") {
		htmlClickEventHandlers(id, "menu");
	}else if (id === "Events") {
		htmlClickEventHandlers(id, "menu");
	}else if (id === "Profile") {
		htmlClickEventHandlers(id, "menu");
	}else if (id === "About") {
		htmlClickEventHandlers(id, "menu");
	}else if (id === "editProfile") {
		htmlClickEventHandlers(id, "menu");
	}else if (id === "runMap") {
		htmlClickEventHandlers(id, "menu");
	}else if (id === "GroupInfo") {
		htmlClickEventHandlers(id, "menu");
	}else if (id === "Sponsors") {
		htmlClickEventHandlers(id, "menu");
	}
	
	/*else if (id !== "LandingPage") {
		htmlClickEventHandlers(id, "back");
	}*/
	// specific page...
	if (id === "LandingPage") {
		// do nothing
	} else if (id === "Index") {
		// do nothing
	} else if (id === "LeaderBoard") {
		// do nothing
	} else if (id === "History") {
		// do nothing
	} else if (id === "UriMessage") {
		// do nothing
	} else if (id === "Groups") {
		// do nothing
	} else if (id === "Events") {
		// do nothing
	}else if (id === "Profile") {
		//do nothing
	}else if (id === "About") {
		//do nothing
	}
}

// initialize page variables on beforeshow
function initPageVarsOnShow(id) {
	// every page...
	window.localStorage.setItem("divIdGlobal", id);
	// every page but...
	if (id !== "LandingsPage") {
		resetPanelState();
		window.localStorage.setItem("shareTagSubject", 'jpHolo');
		window.localStorage.setItem("shareTagText", '#jpHolo, an application template based on PhoneGap, by Joram #Teusink https://github.com/teusink/jpHolo');
		panelMenu(id);
		panelMenuRight(id);
		panelHandling();
	}
	if (id === "Index") {
		pressEffectHeader(true, "menu");
	}else if (id === "LeaderBoard") {
		pressEffectHeader(true, "menu");
		
	}else if (id === "History") {
		//Runs();
	}else if (id === "Groups") {
		//Groups();
		/*if(localStorage.getItem("group_fresh") == "true")
		{
			Groups();
		}*/
		//pressEffectFooter(true, "menu");
	}else if (id === "Events") {
		pressEffectFooter(true, "menu");
	}else if (id === "Profile") {
		pressEffectFooter(true, "menu");
	}else if (id === "About") {
		pressEffectFooter(true, "menu");
	}else if (id === "editProfile") {
		pressEffectFooter(true, "menu");
	}else if (id === "runMap") {
		displayMyRun();
	}
	else if (id === "GroupInfo") {
		
	}
	else if(id == "Setting")
	{
		showSettings();
	}
	/*else if (id !== "LandingsPage") {
		pressEffectHeader(true, "back");
	}*/	
	// specific page...
	if (id === "LandingPage") {
		isDeviceReady("", "InitApp"); // TODO
		isDeviceReady("", "InitUri"); // TODO
	} else if (id === "Index") {
		pressEffectFooter(true, true);
	} else if(id == "LeaderBoard"){
		pressEffectFooter(true, true);
	} else if (id === "History") {
		pressEffectFooter(true, true);
		//getSystemSpecs();
		//loadHistoryPageContent(); //can delete
	} else if (id === "UriMessage") {
		//showUriMessage();
		pressEffectFooter(true, true);
	} else if (id === "Groups") {
		pressEffectFooter(true, true);	
	} else if (id === "Events") {
		pressEffectFooter(true, true);
		//initiateImmersive();
	}else if (id=== "Profile") {
		pressEffectFooter(true, true);
	}else if (id=== "About") {
		pressEffectFooter(true, true);
	}else if (id=== "Sponsors") {
		pressEffectFooter(true, true);
	}
}

// below is to tie page events to pages so that the 2 functions above (initPageVarsOn...) will execute

// detect swiperight to open left panel upon swiperight
$(document).on('swiperight').on('swiperight', function (event) {
	if($("#overlayGeneral").css('display') == 'none')
	{
		if(unlock == true)
		{
			if (window.localStorage.getItem("pageNaveType") === "menu") {
				var w = window,
					d = document,
					e = d.documentElement,
					g = d.getElementsByTagName('body')[0],
					x = w.innerWidth || e.clientWidth || g.clientWidth,
					y = w.innerHeight || e.clientHeight || g.clientHeight;
				// check if there are no open panels, otherwise ignore swipe
				if (checkOpenPanels() === false && event.swipestart.coords[0] < x / 5) {
					togglePanel('#panelMenu' + window.localStorage.getItem("divIdGlobal"));
				}
			}
		}
	}
	else
	{
		//event.stopPropagation();
		event.preventDefault();
	}
});
/*$(document).on('swiperight', function (event) {
	if($("#overlayGeneral").css('display') == 'none')
	{
		if (window.localStorage.getItem("pageNaveType") === "menu") {
			var w = window,
				d = document,
				e = d.documentElement,
				g = d.getElementsByTagName('body')[0],
				x = w.innerWidth || e.clientWidth || g.clientWidth,
				y = w.innerHeight || e.clientHeight || g.clientHeight;
			// check if there are no open panels, otherwise ignore swipe
			if (checkOpenPanels() === false && event.swipestart.coords[0] < x / 5) {
				togglePanel('#panelMenu' + window.localStorage.getItem("divIdGlobal"));
			}
		}
	}
	else
	{
		//event.stopPropagation();
		//event.preventDefault();
	}
});*/

// store important vars, like previous page id
function startBeforeShowVars(data) {
	window.localStorage.setItem("previousPageId", data.prevPage.attr("id"));
}

// #landingPage
$(document).on('pagebeforeshow', '#landingPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('LandingPage');
});
$(document).on('pagecreate', '#landingPage', function () {
	initPageVarsOnCreate('LandingPage');
});


// #indexPage
$(document).on('pagebeforeshow', '#indexPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('Index');
});
$(document).on('pagecreate', '#indexPage', function () {
	initPageVarsOnCreate('Index');
});

// #historyPage
$(document).on('pagebeforeshow', '#historyPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('History');
});
$(document).on('pagecreate', '#historyPage', function () {
	initPageVarsOnCreate('History');
});
$(document).on("pageshow","#historyPage",function(){
	Runs();
});
// #uriPage
$(document).on('pagebeforeshow', '#uriPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('UriMessage');
});
$(document).on('pagecreate', '#uriPage', function () {
	initPageVarsOnCreate('UriMessage');
});

// #groupsPage
$(document).on('pagebeforeshow', '#groupsPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('Groups');
});
$(document).on('pagecreate', '#groupsPage', function () {
	initPageVarsOnCreate('Groups');
});
$(document).on("pageshow","#groupsPage",function(){
	Groups();
});
// #eventsPage
$(document).on('pagebeforeshow', '#eventsPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('Events');
});
$(document).on('pagecreate', '#eventsPage', function () {
	initPageVarsOnCreate('Events');
});
$(document).on("pageshow","#eventsPage",function(){
	Events();
});
// #sponsor
$(document).on('pagebeforeshow', '#sponsorsPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('Sponsors');
});
$(document).on('pagecreate', '#sponsorsPage', function () {
	initPageVarsOnCreate('Sponsors');
});
$(document).on("pageshow","#sponsorsPage",function(){
	Sponsors();
});

//#profilePage
$(document).on('pagebeforeshow', '#profilePage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('Profile');
	displayUserProfile();
});
$(document).on('pagecreate', '#profilePage', function () {
	initPageVarsOnCreate('Profile');
});

//#aboutPage
$(document).on('pagebeforeshow', '#aboutPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('About');
});
$(document).on('pagecreate', '#aboutPage', function () {
	initPageVarsOnCreate('About');
});

//#editProfile
$(document).on('pagebeforeshow', '#EditProfilePage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('editProfile');
});
$(document).on('pagecreate', '#EditProfilePage', function () {
	initPageVarsOnCreate('editProfile');
});


//#myrun
$(document).on('pagebeforeshow', '#runMap', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('runMap');
});
$(document).on('pagecreate', '#runMap', function () {
	initPageVarsOnCreate('runMap');
});

//#myrun
$(document).on('pagebeforeshow', '#leaderBoardPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('LeaderBoard');
});
$(document).on('pagecreate', '#leaderBoardPage', function () {
	initPageVarsOnCreate('LeaderBoard');
});
$(document).on("pageshow","#leaderBoardPage",function(){
	LeaderBoard();
});
//#individualGroupPage
$(document).on('pagebeforeshow', '#individualGroupPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('GroupInfo');
});
$(document).on('pagecreate', '#individualGroupPage', function () {
	initPageVarsOnCreate('GroupInfo');
});
$(document).on('pageshow', '#individualGroupPage', function () {
	displayGroup();
});

//#SettingPage
$(document).on('pagebeforeshow', '#SettingPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('Setting');
});
$(document).on('pagecreate', '#SettingPage', function () {
	initPageVarsOnCreate('Setting');
});
