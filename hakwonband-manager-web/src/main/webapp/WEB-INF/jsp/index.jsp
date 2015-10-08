<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
	String cacheManifest = "";
	if( request.getServerName().indexOf("teamoboki.com") >= 0 ) {
		/*	로컬은 캐시 적용 안한다.	*/
	} else {
		cacheManifest = "index.cache.manifest";
	}
%>

<!--
############################################################
# 2015-04-13 01
############################################################
############################################################
# 2015-08-31 04
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

	<link rel="shortcut icon" type="image/x-icon" href="/images/favicon/64x64.png">

	<link href="/assets/css/bootstrap.min.css" rel="stylesheet">
	<link href="/assets/font-awesome/css/font-awesome.css" rel="stylesheet">
	<link href="/assets/css/plugins/iCheck/custom.css" rel="stylesheet">
	<link href="/assets/css/animate.css" rel="stylesheet">
	<link href="/assets/css/style.css" rel="stylesheet">
	<link href="/assets/css/font_style.css" rel="stylesheet">
	<link href="/assets/css/hakwon_style.css" rel="stylesheet">

	<!-- 외부 lib js -->
	<script type="text/javascript" src="/js/lib/jquery-2.1.1/jquery-2.1.1.min.js"></script>
	<script type="text/javascript" src="/js/lib/tmpl/jquery.tmpl.min.js"></script>
	<script type="text/javascript" src="/js/lib/moment.js"></script>
	<script type="text/javascript" src="./js/lib/underscore-1.7.0/underscore-min.js"></script>

	<!-- Mainly scripts -->
	<script src="/assets/js/bootstrap.min.js"></script>
	<script src="/assets/js/plugins/metisMenu/jquery.metisMenu.js"></script>

	<!-- Custom and plugin javascript -->
	<script src="/assets/js/inspinia.js"></script>
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

<!-- iCheck -->
<script src="/assets/js/plugins/iCheck/icheck.min.js"></script>

<!-- angular js -->
<script type="text/javascript" src="/js/lib/angular-1.3.3/angular.js"></script>
<script type="text/javascript" src="/js/lib/angular-1.3.3/angular-route.js"></script>
<script type="text/javascript" src="/js/lib/angular-1.3.3/angular-touch.min.js"></script>

<!-- 공통 js -->
<script type="text/javascript" src="/js/constants/constant.jsp"></script>

<!-- 공통 js -->
<script type="text/javascript" src="/js/common/bumworld.html5.upload.js"></script>
<script type="text/javascript" src="/js/common/common.prototype.js"></script>
<script type="text/javascript" src="/js/common/common.js"></script>
<script type="text/javascript" src="/js/tmpl/hakwonTmpl.js"></script>


<!-- 서비스 모듈(배포시 하나의 파일로 머지할 계획) start -->
<script type="text/javascript" src="/js/module/index/hakwonCommonApp.js"></script>
<script type="text/javascript" src="/js/module/index/index.js"></script>
<script type="text/javascript" src="/js/module/index/login.js"></script>
<script type="text/javascript" src="/js/module/index/signUp.js"></script>
<script type="text/javascript" src="/js/module/index/findInfo.js"></script>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-66935015-1', 'auto');
  ga('send', 'pageview');

</script>
</body>
</html>