<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
	String hakwonNo = request.getParameter("hakwonNo");
	DataMap hakwonDetail = (DataMap)request.getAttribute("hakwonDetail");

	String logoPath = "";
	if( hakwonDetail.isNotNull("logo_file_path") ) {
		logoPath = "https://attatch.hakwonband.com"+hakwonDetail.getString("logo_file_path");
	} else {
		logoPath = "https://m.hakwonband.com/images/facebook_screen.png";
	}
%>

<!DOCTYPE html>
<html>
<head>
	<title><%= hakwonDetail.getString("hakwon_name")%>::학원밴드</title>

	<meta charset="utf-8" />
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0, target-densitydpi=medium-dpi" />
	<meta name="format-detection" content="telephone=no">

	<meta name="author" content="hakwonband">
	<meta name="title" content="<%= hakwonDetail.getString("hakwon_name")%>::소셜 학원네트워크 학원밴드" />
	<meta name="url" content="https://m.hakwonband.com/hakwonInfo.do?hakwonNo=<%= hakwonDetail.getString("hakwon_no")%>" />
	<meta name="subject" content="소셜 학원네트워크 학원밴드">
	<meta name="keywords" content="소셜 학원네트워크 학원 학원밴드 학원앱 원장님 학부모 선생님 학생관리 학원홍보 학원광고 학원공지알림">
	<meta name="description" content="학원밴드는 학원네트워크를 기반으로한 소셜 도구로 학원원장님, 선생님, 학부모, 학생 모두가 간단한 절차를 통해 가입하여 여러 학원간 공지나 알림을 실시간으로 받고 원활한 소통을 하게 합니다. 지역기반 주요 학원정보도 받아볼수 있으며 학원밴드를 통해 학원홍보를 할수도 있습니다.">
	<meta name="copyright" content="hakwonband">
	<meta name="robots" content="ALL">

	<meta property="og:url" content="https://m.hakwonband.com/hakwonInfo.do?hakwonNo=<%= hakwonDetail.getString("hakwon_no")%>">
	<meta property="og:site_name" content="<%= hakwonDetail.getString("hakwon_name")%>::소셜 학원네트워크 학원밴드">
	<meta property="og:title" content="<%= hakwonDetail.getString("hakwon_name")%>::소셜 학원네트워크 학원밴드">
	<meta property="og:description" content="학원밴드는 학원네트워크를 기반으로한 소셜 도구로 학원원장님, 선생님, 학부모, 학생 모두가 간단한 절차를 통해 가입하여 여러 학원간 공지나 알림을 실시간으로 받고 원활한 소통을 하게 합니다. 지역기반 주요 학원정보도 받아볼수 있으며 학원밴드를 통해 학원홍보를 할수도 있습니다.">
	<meta property="og:image" content="<%= logoPath%>">


	<meta name="apple-mobile-web-app-capable" content="yes" />
	<link rel="apple-touch-startup-image" href="/images/appintro.png" />

	<link rel="shortcut icon" href="/images/logo/114x114.png" />
	<link rel="apple-touch-icon" href="/images/logo/144x144.png" />


	<link rel="stylesheet" type="text/css" media="screen" href="/css/common2.css" />
</head>

<body>
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

<!-- 외부 lib js -->
<script type="text/javascript" src="/js/lib/jquery-2.1.1/jquery-2.1.1.min.js"></script>



<script type="text/javascript">

$(window).load(function() {
	window.location = '/index.do#/hakwon/detail?hakwon_no=<%=hakwonNo%>';
});
</script>

</body>
</html>