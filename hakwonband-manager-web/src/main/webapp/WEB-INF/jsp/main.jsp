<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String cacheManifest = "";
	if( request.getServerName().indexOf("teamoboki.com") >= 0 ) {
		/*	로컬은 캐시 적용 안한다.	*/
	} else {
		cacheManifest = "main.cache.manifest";
	}
%>

<!--
############################################################
# 2015-04-13 01
############################################################
############################################################
# 2015-04-20 01
############################################################
############################################################
# 2015-04-24 01
############################################################
############################################################
# 2015-08-31 04
############################################################
-->

<!DOCTYPE html>
<html lang="ko" manifest="<%=cacheManifest%>" ng-app="hakwonMainApp" ng-controller="baseController">

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
	<link href="/assets/css/plugins/switchery/switchery.css" rel="stylesheet">

	<!-- 외부 lib js -->
	<script type="text/javascript" src="/js/lib/jquery-2.1.1/jquery-2.1.1.min.js"></script>
	<script type="text/javascript" src="/js/lib/tmpl/jquery.tmpl.min.js"></script>
	<script type="text/javascript" src="/js/lib/bootpag/jquery.bootpag.min.js"></script>
	<script type="text/javascript" src="/js/lib/date.js"></script>
	<script type="text/javascript" src="/js/lib/moment.js"></script>
	<script type="text/javascript" src="/js/lib/underscore-1.7.0/underscore-min.js"></script>

	<!-- Mainly scripts -->
	<script src="/assets/js/bootstrap.min.js"></script>
</head>
<body class="gray-bg skin-1">

<div class="progress progress-bar-default top_progress" style="display:none;">
	<div style="width:0%" aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" role="progressbar" class="progress-bar">
		<span class="sr-only">0% Complete (success)</span>
	</div>
</div>

<div id="wrapper" style="display:none;">
	<nav class="navbar-default navbar-static-side" role="navigation">
		<div class="sidebar-collapse">
			<ul class="nav" id="side-menu">
				<li class="nav-header">
					<div class="dropdown profile-element"></div>
					<div class="logo-element">
						HAKWON<br>BAND
					</div>
					<button class="btn btn-default btn-circle btn_nav_edit" data-act="move_member_profile" type="button" title="프로필수정"><i class="fa fa-cog"></i> </button>
				</li>
				<li>
					<a href="#"><i class="fa fa-building"></i> <span class="nav-label">학원</span> <span class="fa arrow"></span></a>
					<ul class="nav nav-second-level">
						<li><a href="#/hakwon/list" data-type="leftMenu">학원 리스트</a></li>
						<li><a href="#/edBanner/list" data-type="leftMenu">광고 리스트</a></li>
					</ul>
				</li>
				<li>
					<a href="#"><i class="fa fa-building"></i> <span class="nav-label">메세지</span> <span class="fa arrow"></span></a>
					<ul class="nav nav-second-level">
						<li><a href="#/message/receiveMessageList" data-type="leftMenu">받은 메세지</a></li>
						<li><a href="#/message/send" data-type="leftMenu">메세지 보내기</a></li>
						<li><a href="#/message/sendMessageGroupList" data-type="leftMenu">보낸 그룹 메세지</a></li>
						<li><a href="#/message/sendMessageSingleList" data-type="leftMenu">보낸 개별 메세지</a></li>
						<li><a href="#/adminQuestion/list" data-type="leftMenu">관리자에게 문의</a></li>
					</ul>
				</li>
			</ul>
		</div>
	</nav>

	<div id="page-wrapper" class="gray-bg">
		<div class="row border-bottom">
			<nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
				<div class="navbar-header" style="">
					<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#" onclick="return false;"><i class="fa fa-bars"></i> </a>
				</div>

				<ul class="nav navbar-top-links navbar-right">
					<li data-view="hakwon_list_li" style="display:none;">
						<select class="form-control select_hakwon" name="hakwon_list"></select>
					</li>
<!--
					<li style="display:none;">
						<a class="count-info" href="#" onclick="return false;" data-act="receiveMessage" title="받은메세지">
							<i class="fa fa-envelope"></i>  <span class="label label-warning"></span>
						</a>
					</li>
					<li style="display:none;">
						<a class="count-info" onclick="return false;" title="가입신청">
							<i class="fa fa-bell"></i>  <span class="label label-primary">8</span>
						</a>
					</li>
					<li>
						<a href="/logout.do">
							<i class="fa fa-sign-out"></i> 로그아웃
						</a>
					</li>
-->
				</ul>
			</nav>
		</div>

		<!-- commNaviMenu -->
		<div class="row wrapper border-bottom white-bg page-heading">
			<h1>학원 밴드 입니다.</h1>
		</div>


		<section id="mainNgView" class="wrapper wrapper-content row" ng-view></section>

		<footer class="footer">
			<strong>Copyright</strong> HAKWONBAND &copy; 2015
		</footer>
	</div>
</div>

<!-- 공통 js -->
<script type="text/javascript" src="/js/constants/constant.jsp"></script>

<script type="text/javascript" src="/js/common/common.prototype.js"></script>
<script type="text/javascript" src="/js/common/common.js"></script>
<script type="text/javascript" src="/js/common/bumworld.html5.upload.js"></script>
<script type="text/javascript" src="/js/tmpl/hakwonTmpl.js"></script>

<!-- 차트 -->
<script type="text/javascript" src="/js/lib/chartjs/Chart.min.js"></script>


<!-- angular js -->
<script type="text/javascript" src="/js/lib/angular-1.3.3/angular.js"></script>
<script type="text/javascript" src="/js/lib/angular-1.3.3/angular-route.js"></script>
<script type="text/javascript" src="/js/lib/angular-1.3.3/angular-touch.min.js"></script>
<script type="text/javascript" src="/js/lib/angular-1.3.3/ui-bootstrap-0.12.0.js"></script>

<!-- angularJS hakwonApp 모듈선언 -->
<script type="text/javascript" src="/js/module/main/hakwonMainApp.js"></script>

<!-- 팩토리 공통기능 start -->
<script type="text/javascript" src="/js/module/factories/CommUtil.js"></script>

<!-- 서비스 모듈(배포시 하나의 파일로 머지할 계획) start -->
<script type="text/javascript" src="/js/module/main/base.js"></script>
<script type="text/javascript" src="/js/module/main/adminQuestion.js"></script>
<script type="text/javascript" src="/js/module/main/edBanner.js"></script>
<script type="text/javascript" src="/js/module/main/hakwon.js"></script>
<script type="text/javascript" src="/js/module/main/index.js"></script>
<script type="text/javascript" src="/js/module/main/main.js"></script>
<script type="text/javascript" src="/js/module/main/master.js"></script>
<script type="text/javascript" src="/js/module/main/member.js"></script>
<script type="text/javascript" src="/js/module/main/messageSend.js"></script>
<script type="text/javascript" src="/js/module/main/messageView.js"></script>



<!-- Custom and plugin javascript -->
<script src="/assets/js/inspinia.js"></script>
<script src="/assets/js/plugins/metisMenu/jquery.metisMenu.js"></script>
<script src="/assets/js/plugins/iCheck/icheck.min.js"></script><!-- iCheck -->
<script src="/assets/js/plugins/datapicker/bootstrap-datepicker.js"></script><!-- Data picker -->
<script src="/assets/js/plugins/switchery/switchery.js"></script><!-- Switchery -->


<script type="text/javascript" src="/js/lib/tinymce-4.1.7/tinymce.min.js"></script>

<script>

$(document).ready(function () {
	console.log('document ready');

	if( commProto.isResponsiveCheck() ) {
		if( $('body').hasClass('body-small') == false ) {
			$('body').addClass('body-small');
		}
	}
});

</script>
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