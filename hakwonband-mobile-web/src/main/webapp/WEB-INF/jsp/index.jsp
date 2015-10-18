<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String cacheManifest = "";
	boolean isLive = false;
	if( request.getServerName().indexOf("teamoboki.com") >= 0 ) {
		/*	로컬은 캐시 적용 안한다.	*/
		isLive = false;
	} else {
		cacheManifest = "cache.manifest";
		isLive = true;
	}
	cacheManifest = "cache.manifest";
	isLive = true;
%>
<!--
############################################################
# 2015-09-29 01
############################################################
############################################################
# 2015-10-11 01
############################################################
############################################################
# 2015-10-15 01
############################################################
-->
<!DOCTYPE html>
<html manifest="<%=cacheManifest%>" ng-app="hakwonApp">
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
	<meta property="og:image" content="/images/facebook_screen.png">


	<meta name="apple-mobile-web-app-capable" content="yes" />
	<link rel="apple-touch-startup-image" href="/images/appintro.png" />

	<link rel="shortcut icon" href="/images/logo/114x114.png" />
	<link rel="apple-touch-icon" href="/images/logo/144x144.png" />


	<link rel="stylesheet" type="text/css" media="screen" href="/css/common.css" />
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
	<div class="sk-spinner sk-spinner-wave">
		<div class="sk-rect1"></div>
		<div class="sk-rect2"></div>
		<div class="sk-rect3"></div>
		<div class="sk-rect4"></div>
		<div class="sk-rect5"></div>
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
<script src="/js/module/message.js"></script>
<script src="/js/module/attendanceList.js"></script>
<script src="/js/module/hakwon/hakwon.js"></script>
<script src="/js/module/hakwon/teacher.js"></script>
<script src="/js/module/hakwon/notice.js"></script>
<script src="/js/module/hakwon/event.js"></script>
<script src="/js/module/advertise.js"></script>
<%
	}
%>


<!-- 외부 모듈 -->
<script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>

<script type="text/javascript">

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

/**
 * 위치 정보 콜백
 */
/*
function locationCallBack(gpsStr) {
	console.log('gpsStr['+gpsStr+']');
	if( gpsStr && gpsStr.indexOf(',') > 0 ) {
		var gpsStrArray = gpsStr.split(',');

		var latlng = new google.maps.LatLng(gpsStrArray[0], gpsStrArray[1]);
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'latLng' : latlng}, function(results, status) {
			if( results && results.length > 0 ) {
				var geoObj = results[0];
				comm.setAddress(geoObj.formatted_address);

				if( window.location.hash == '#/hakwon/search' ) {
					//	학원 검색 페이지면 새로 고침
					window.location.href = MENUS.sharpUrls.hakwonSearch+'?';
				}
			}
		});
	}
}
*/

comm.moveSite();

try {
	$.getScript("https://developers.kakao.com/sdk/js/kakao.min.js", function(data, textStatus, jqxhr) {
		Kakao.init(HakwonConstant.Sns.KAKAO);
	});
} catch(ex) {
}
</script>
<!-- 외부 lib js -->
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true"></script>
<script type="text/javascript">
/*	주소 초기화	*/
comm.initAddress();
</script>
</body>
</html>