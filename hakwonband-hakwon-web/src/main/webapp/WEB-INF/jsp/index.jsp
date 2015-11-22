<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	boolean isLive = false;
	String cacheManifest = "";
	if( request.getServerName().indexOf("teamoboki.com") >= 0 ) {
		/*	로컬은 캐시 적용 안한다.	*/
		isLive = false;
	} else {
		cacheManifest = "index.cache.manifest";
		isLive = true;
	}

	boolean isMobile = false;
	String userAgent = request.getHeader("User-Agent");
	if( userAgent.indexOf("Mobile") >= 0 || userAgent.indexOf("PlayBook") >= 0 || userAgent.indexOf("KFAPWI") >= 0 ) {
		isMobile = true;
	}
%>
<!--
############################################################
############################################################
# 2015-11-19 01
############################################################
############################################################

############################################################
############################################################
# 2015-11-20 01
############################################################
############################################################

############################################################
############################################################
# 2015-11-23 01
############################################################
############################################################
-->
<!DOCTYPE html>
<html lang="ko" manifest="<%=cacheManifest%>" ng-app="hakwonCommonApp">

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
	<link href="/assets/font-awesome/css/font-awesome.min.css" rel="stylesheet">
	<link href="/assets/css/hakwon_style.css" rel="stylesheet">

<%
	if( isMobile == false ) {
%>
	<link href="/assets/css/font_style.css" rel="stylesheet">
<%
	}
%>

	<!-- 공통 js -->
	<script type="text/javascript" src="/js/constants/constant.jsp"></script>

	<!-- 외부 lib js -->
	<script type="text/javascript" src="/assets/js/common.lib.min.js"></script>

</head>

<body class="gray-bg">

<div id="wrapper" ng-view>
	<div class="sk-spinner sk-spinner-wave">
		<div class="sk-rect1"></div>
		<div class="sk-rect2"></div>
		<div class="sk-rect3"></div>
		<div class="sk-rect4"></div>
		<div class="sk-rect5"></div>
	</div>
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