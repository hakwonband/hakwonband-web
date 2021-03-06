<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String cacheManifest = "";
	if( isLive == true ) cacheManifest = "index.cache.manifest";
%>
<!--
############################################################
############################################################
# 2016-12-05 01
############################################################
############################################################
-->
<!DOCTYPE html>
<html lang="ko" ng-app="hakwonCommonApp">

<head>
	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">

	<title>학원밴드 - 학원관리자</title>

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
	<meta property="og:description" content=" 학원밴드는 학원네트워크를 기반으로한 소셜 도구로 학원원장님, 선생님, 학부모, 학생 모두가 간단한 절차를 통해 가입하여 여러 학원간 공지나 알림을 실시간으로 받고 원활한 소통을 하게 합니다. 지역기반 주요 학원정보도 받아볼수 있으며 학원밴드를 통해 학원홍보를 할수도 있습니다.">
	<meta property="og:image" content="/images/facebook_screen.png">


	<link rel="shortcut icon" type="image/x-icon" href="/assets/img/favicon/64x64.png">
	<link href="/assets/css/index.lib.min.css" rel="stylesheet">
	<link href="/assets/css/hakwon_style.css" rel="stylesheet">
	<link href="/assets/font-awesome/css/font-awesome.min.css" rel="stylesheet">

<%
	if( isMobile == false ) {
%>
	<link href="/assets/css/font_style.css" rel="stylesheet">
<%
	}
%>

<script>if (typeof module === 'object') {window.module = module; module = undefined;}</script>

	<!-- 공통 js -->
	<script type="text/javascript" src="/js/constants/constant.jsp"></script>

	<!-- 외부 lib js -->
	<script type="text/javascript" src="/assets/js/common.lib.min.js"></script>

<script>if (window.module) module = window.module;</script>

</head>

<body class="gray-bg">

<!-- ng-view -->
<div id="wrapper" ng-view>
	<img id="loadingImg" src='/assets/img/new/loading.gif' style="display: none"/>
</div>
<div class="modal inmodal" id="ieModal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content animated bounceInRight">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
				<h4 class="modal-title">학원 밴드 알림</h4>
			</div>
			<div class="modal-body">
				<p>학원 밴드는 HTML5를 지원하는 브라우저에 최적화 되어 있습니다.<br/>크롬, 파이어폭스, 사파리 등 html5를 지원하는 브라우저를 이용해 주세요.</p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-white" data-dismiss="modal">닫기</button>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
window.addEventListener('load', function(e) {
	window.applicationCache.addEventListener('updateready', function(e) {
		if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
			window.applicationCache.swapCache();
			window.location.reload();
		}
	},false);
},false);

$('#wrapper').css('height', $( document ).height());
var loadingImg = $('#loadingImg');
loadingImg.load(function() {
	loadingImg.css('width', '200px');

	var screenHeight = $( document ).height();
	var screenWidth = $( document ).width();
	console.log('screenHeight : ' +screenHeight);
	console.log('screenWidth : ' +screenWidth);
	var imgHeight = ((screenHeight-42)/2)-loadingImg.height()/2;
	var imgWidth = (screenWidth/2)-loadingImg.width()/2;

	loadingImg.css('margin-left',	imgWidth);
	loadingImg.css('margin-top',	imgHeight);
	loadingImg.show();
});

</script>
<%
	if( isLive ) {
%>
	<script type="text/javascript" src="/assets/js/index.module.min.js"></script>
<%
	} else {
%>
	<!-- 공통 js -->
	<script type="text/javascript" src="/assets/js/index_module/bumworld.html5.upload.js"></script>
	<script type="text/javascript" src="/assets/js/index_module/common.prototype.js"></script>
	<script type="text/javascript" src="/assets/js/index_module/common.js"></script>
	<script type="text/javascript" src="/assets/js/index_module/hakwonTmpl.js"></script>

	<script type="text/javascript" src="/assets/js/index_module/hakwonCommonApp.js"></script>
	<script type="text/javascript" src="/assets/js/index_module/index.js"></script>
	<script type="text/javascript" src="/assets/js/index_module/login.js"></script>
	<script type="text/javascript" src="/assets/js/index_module/signUp.js"></script>
	<script type="text/javascript" src="/assets/js/index_module/findInfo.js"></script>
<%
	}
%>
</body>
</html>