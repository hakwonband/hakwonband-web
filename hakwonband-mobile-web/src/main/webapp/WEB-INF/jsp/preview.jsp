<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="hakwonband.util.DataMap" %>
<%
	DataMap previewData = (DataMap)request.getAttribute("previewData");
	if( previewData == null ) {
		previewData = new DataMap();
		previewData.put("introduction", "정보 조회를 실패 했습니다.");
	}
%>

<!DOCTYPE html>
<html>
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

<!--header area-->
<header class="type_02">
	<h1>학원밴드</h1>
</header>
<!--//header area-->

<!--contents area-->
<div id="wrap_cont" ng-view="" class="ng-scope">
	<section class="ng-scope">
		<h2 class="tit">학원소개</h2>
		<div class="sec_con txt_cont"><%=previewData.getString("introduction")%></div>
	</section>
</div>
<!--//contents area-->

<!--footer area-->
<footer>
	COPYRIGHT &copy; HAKWONBAND. ALL RIGHT RESERVED.
</footer>
<!--//footer area-->

<!-- 외부 lib js -->
<script type="text/javascript" src="/js/lib/jquery-2.1.1/jquery-2.1.1.min.js"></script>
<script type="text/javascript" src="/js/lib/tmpl/jquery.tmpl.min.js"></script>
<script type="text/javascript" src="/js/lib/ezmark-1.0/jquery.ezmark.min.js"></script>
<script type="text/javascript" src="/js/lib/merge.js"></script>
<script type="text/javascript" src="/js/lib/underscore-1.7.0/underscore-min.js"></script>
<script type="text/javascript" src="/js/lib/moment.js"></script>

<!-- angular js -->
<script type="text/javascript" src="/js/lib/angular-1.3.3/angular.js"></script>
<script type="text/javascript" src="/js/lib/angular-1.3.3/angular-route.js"></script>
<script type="text/javascript" src="/js/lib/angular-1.3.3/angular-touch.min.js"></script>

<!-- 공통 js -->
<script type="text/javascript" src="/js/constants/constant.jsp"></script>

<script type="text/javascript" src="/js/common/common.prototype.js"></script>

<script type="text/javascript">

$(window).load(function() {

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

</script>

</body>
</html>