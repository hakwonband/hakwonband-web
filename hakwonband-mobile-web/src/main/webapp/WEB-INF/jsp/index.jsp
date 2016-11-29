<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	boolean isLive = false;
	if( request.getServerName().indexOf("teamoboki.com") >= 0 ) {
		/*	로컬은 캐시 적용 안한다.	*/
		isLive = false;
	} else {
		isLive = true;
	}
	String cacheManifest = "cache.manifest";

	boolean isMobile = false;
	String userAgent = request.getHeader("User-Agent");
	if( userAgent.indexOf("Mobile") >= 0 || userAgent.indexOf("Android") >= 0 || userAgent.indexOf("PlayBook") >= 0 || userAgent.indexOf("KFAPWI") >= 0 ) {
		isMobile = true;
	}
%>

<!DOCTYPE html>
<html ng-app="hakwonApp">
<head>
	<title>학원밴드</title>

	<meta charset="utf-8" />
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0, target-densitydpi=medium-dpi" />
	<meta name="format-detection" content="telephone=no">

	<meta name="author" content="hakwonband">
	<meta name="title" content="소셜 학원네트워크 학원밴드" />
	<meta name="url" content="https://www.hakwonband.com" />
	<meta name="subject" content="소셜 학원네트워크 학원밴드">
	<meta name="keywords" content="소셜 학원네트워크 학원 학원밴드 학원앱 원장님 학부모 선생님 학생관리 학원홍보 학원광고 학원공지알림">
	<meta name="description" content="학원밴드는 학원네트워크를 기반으로한 소셜 도구로 학원원장님, 선생님, 학부모, 학생 모두가 간단한 절차를 통해 가입하여 여러 학원간 공지나 알림을 실시간으로 받고 원활한 소통을 하게 합니다. 지역기반 주요 학원정보도 받아볼수 있으며 학원밴드를 통해 학원홍보를 할수도 있습니다.">
	<meta name="copyright" content="hakwonband">
	<meta name="robots" content="ALL">

	<meta property="og:url" content="https://www.hakwonband.com/">
	<meta property="og:site_name" content="HAKWONBAND">
	<meta property="og:title" content=" 소셜 학원네트워크 학원밴드">
	<meta property="og:description" content="학원밴드는 학원네트워크를 기반으로한 소셜 도구로 학원원장님, 선생님, 학부모, 학생 모두가 간단한 절차를 통해 가입하여 여러 학원간 공지나 알림을 실시간으로 받고 원활한 소통을 하게 합니다. 지역기반 주요 학원정보도 받아볼수 있으며 학원밴드를 통해 학원홍보를 할수도 있습니다.">
	<meta property="og:image" content="/assets/images/facebook_screen.png">


	<meta name="apple-mobile-web-app-capable" content="yes" />
	<link rel="apple-touch-startup-image" href="/assets/images/appintro.png" />

	<link rel="shortcut icon" href="/assets/images/logo/114x114.png" />
	<link rel="apple-touch-icon" href="/assets/images/logo/144x144.png" />


	<link rel="stylesheet" type="text/css" media="screen" href="/assets/css/common.css" />
<%
	if( isMobile == false ) {
%>
	<style type="text/css">
		.txt_cont img, .view_cont img{display:inline !important;}
	</style>
<%
	}
%>
</head>

<body>
<div class="progress top_progress" style="display:none;">
    <div style="width:0%" aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" role="progressbar" class="progress-bar">
        <span class="sr-only">0% Complete (success)</span>
    </div>
</div>

<!--header area-->
<header class="type_02">
	<h1>학원밴드</h1>
</header>
<!--//header area-->

<!--contents area-->
<div id="wrap_cont" ng-view>
	<div style="auto;">
		<img id="loadingImg" src='/assets/images/new/loading.gif' style="display: none" width="40%"/>
	</div>
</div>
<!--//contents area-->

<!--footer area-->
<footer>
	COPYRIGHT &copy; HAKWONBAND. ALL RIGHT RESERVED.
</footer>
<!--//footer area-->

<div class="popup_box" style="display:none;">
	<p>학원밴드 앱이 업데이트 됐습니다. 더 원활한 학원밴드 이용을 위해 앱을 업데이트 해주세요.</p>
	<button type="button" class="btn btn_style_submit" data-act="install">앱 업데이트</button>
	<button type="button" class="btn btn_style_cancel" data-act="close">닫기</button>
</div>

<div class="bg_dim" style="opacity:0.6;" style="display:none;"></div>
<!-- class="student, parent" -->
<div id="mypage" style="display:none;"></div>
<div id="mypage_academy" style="display:none;"></div>


<!-- 공통 js -->
<script type="text/javascript" src="/js/constants/constant.jsp"></script>

<!-- 공통 모듈 -->
<script src="/assets/js/common.lib.min.js"></script>
<%
	if( isLive ) {
%>
<script src="/assets/js/module.min.js"></script>
<%
	} else {
%>
<script src="/js/common/hakwonApp.js"></script>
<script src="/js/tmpl/hakwonTmpl.js"></script>
<script src="/js/module/factory/CommUtil.js"></script>
<script src="/js/module/index.js"></script>
<script src="/js/module/login.js"></script>
<script src="/js/module/signUp.js"></script>
<script src="/js/module/userMain.js"></script>
<script src="/js/module/member.js"></script>
<script src="/js/module/myInfo.js"></script>
<script src="/js/module/find.js"></script>
<script src="/js/module/message.js"></script>
<script src="/js/module/attendanceList.js"></script>
<script src="/js/module/hakwon/hakwon.js"></script>
<script src="/js/module/hakwon/teacher.js"></script>
<script src="/js/module/hakwon/notice.js"></script>
<script src="/js/module/hakwon/event.js"></script>
<script src="/js/module/edvertise.js"></script>
<%
	}
%>


<script type="text/javascript">

var loadingImg = $('#loadingImg');
var screenHeight = $( document ).height();
var screenWidth = $( document ).width();
var imgHeight = ((screenHeight-42)/2)-loadingImg.height()/2;
var imgWidth = (screenWidth/2)-loadingImg.width()/2;

loadingImg.css('margin-left',	imgWidth);
loadingImg.css('margin-top',	imgHeight);
loadingImg.show();


<%
	if( isLive == true ) {
%>
$('body').on("selectstart", function(event){ return false; });
$('body').on("dragstart", function(event){ return false; });
<%
	}
	if( isMobile == false && isLive == true ) {
%>
document.oncontextmenu = function (e) {
	return false;
}
<%
	}
%>

$(window).load(function() {
	console.log('window load');
	/*	스크린 초기화	*/
	comm.screenInit();

	try {
		if( window.PLATFORM ) {
			var deviceInfoStr = window.PLATFORM.getDeviceInfo();
			var deviceInfo = JSON.parse(deviceInfoStr);
			//commProto.logger({deviceInfo:deviceInfo});
		}
	} catch(e) {
		console.error(e);
	}

	$('div.popup_box > button[data-act=install]').click(function() {
		/*	설치	*/
		if( isMobile.Android() ) {
			if( window.PLATFORM ) {
				window.location = "market://details?id=com.hakwon.app";
			} else {
				//window.location = "https://play.google.com/store/apps/details?id=com.hakwon.app";
				window.location = "market://details?id=com.hakwon.app";
			}
		} else {
			alert('준비 중 입니다.');
		}
	});
	$('div.popup_box > button[data-act=close]').click(function() {
		/*	닫기	*/
		$('div.popup_box').hide();
	});

	if( getBrowser() == 'iosApp' ) {
		/*	아이폰 호출	*/
		window.location = 'hakwonBand://notification/getToken';
	}
});

var mql = window.matchMedia("(orientation: portrait)");
mql.addListener(function(m) {
	if(m.matches) {
		console.debug('orientation: portrait');
	} else {
		console.debug('orientation: landscape');
	}
});

window.addEventListener("orientationchange", function() {
	console.debug('orientationchange');
	comm.screenInit();
}, false);

window.addEventListener('load', function(e) {
	window.applicationCache.addEventListener('updateready', function(e) {
		if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
			window.applicationCache.swapCache();
			window.location.reload();
		}
	},false);
},false);

comm.moveSite();

try {
	$.getScript("https://developers.kakao.com/sdk/js/kakao.min.js", function(data, textStatus, jqxhr) {
		console.info('[loaded] https://developers.kakao.com/sdk/js/kakao.min.js');
		Kakao.init(HakwonConstant.Sns.KAKAO);
	});

	/*	app 에서만 실행	*/
	if( getBrowser().indexOf('App') > 0 ) {
		$.getScript("https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true", function(data, textStatus, jqxhr) {
			console.info('[loaded] https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true');
			comm.initAddress();
		});
	}
} catch(ex) {
}

var gpsLocation = {
	latitude : null
	, longitude : null
};
window.locationCallBack = function(latitude, longitude) {
	console.log('latitude['+latitude+'] longitude['+longitude+']');
	gpsLocation.latitude = latitude;
	gpsLocation.longitude = longitude;

	comm.initAddress();
}

if( window.PLATFORM && comm.getAppVersion() >= 601 ) {
	var gps_check = window.PLATFORM.gpsCheck();
	if( gps_check == "true" ) {
		window.PLATFORM.getLocation();
	}
}
</script>
</body>
</html>