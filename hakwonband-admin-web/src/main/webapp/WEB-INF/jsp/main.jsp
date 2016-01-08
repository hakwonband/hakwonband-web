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
############################################################
# 2015-11-19 01
############################################################
############################################################
-->
<!DOCTYPE html>
<html lang="ko" manifest="<%=cacheManifest%>" ng-app="hakwonMainApp">

<head>
	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">

	<title>학원밴드 - 관리자</title>

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

	<link href="/inspinia/css/bootstrap.min.css" rel="stylesheet">
	<link href="/inspinia/font-awesome/css/font-awesome.css" rel="stylesheet">
	<link href="/inspinia/css/plugins/iCheck/custom.css" rel="stylesheet">
	<link href="/inspinia/css/animate.css" rel="stylesheet">
	<link href="/inspinia/css/style.css" rel="stylesheet">
	<link href="/inspinia/css/font_style.css" rel="stylesheet">
	<link href="/inspinia/css/hakwon_style.css" rel="stylesheet">


	<!-- 외부 lib js -->
	<script type="text/javascript" src="/js/lib/jquery-2.1.1/jquery-2.1.1.min.js"></script>
	<script type="text/javascript" src="/js/lib/tmpl/jquery.tmpl.min.js"></script>
	<script type="text/javascript" src="/js/lib/bootpag/jquery.bootpag.min.js"></script>
	<script type="text/javascript" src="/js/lib/date.js"></script>
	<script type="text/javascript" src="/js/lib/underscore-1.7.0/underscore-min.js"></script>

	<!-- Mainly scripts -->
	<script src="/inspinia/js/bootstrap.min.js"></script>
</head>
<body class="">
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
					<!--<button class="btn btn-default btn-circle btn_nav_edit" type="button" title="프로필수정"><i class="fa fa-cog"></i> </button>-->
				</li>
				<li>
					<a href="#"><i class="fa fa-building"></i> <span class="nav-label">학원</span> <span class="fa arrow"></span></a>
					<ul class="nav nav-second-level">
						<li><a href="#/hakwon/list" data-type="leftMenu">학원 리스트</a></li>
						<li><a href="#/hakwon/regist" data-type="leftMenu">관리자 학원등록</a></li>
						<li><a href="#/adminQuestion/list" data-type="leftMenu">관리자 문의</a></li>
						<li><a href="#/hakwon/excelUpload" data-type="leftMenu">엑셀 업로드</a></li>
					</ul>
				</li>
				<li>
					<a href="#"><i class="fa fa-university"></i> <span class="nav-label">광고</span> <span class="fa arrow"></span></a>
					<ul class="nav nav-second-level">
						<li><a href="#/edvertise/bankDeposit/list" data-type="leftMenu">입금 리스트</a></li>
						<li><a href="#/advertise/banner/list" data-type="leftMenu">광고 리스트</a></li>
					</ul>
				</li>
				<li>
					<a href="#"><i class="fa fa-university"></i> <span class="nav-label">메세지</span> <span class="fa arrow"></span></a>
					<ul class="nav nav-second-level">
						<li><a href="#/message/send" data-type="leftMenu">메세지 보내기</a></li>
						<li><a href="#/message/sendMessageGroupList" data-type="leftMenu">보낸 그룹 메세지</a></li>
						<li><a href="#/message/sendMessageSingleList" data-type="leftMenu">보낸 개별 메세지</a></li>
					</ul>
				</li>
				<li>
					<a href="#"><i class="fa fa-university"></i> <span class="nav-label">원장님</span> <span class="fa arrow"></span></a>
					<ul class="nav nav-second-level">
						<li><a href="#/master/list" data-type="leftMenu">원장님 리스트</a></li>
						<li><a href="#/master/requestList" data-type="leftMenu">가입요청 원장님 리스트</a></li>
					</ul>
				</li>
				<li>
					<a href="#/teacher/list" data-type="leftMenu"><i class="fa fa-graduation-cap"></i> <span class="nav-label">선생님</span></a>
				</li>
				<li>
					<a href="#/student/list" data-type="leftMenu"><i class="fa fa-child"></i> <span class="nav-label">학생</span></a>
				</li>
				<li>
					<a href="#/parent/list" data-type="leftMenu"><i class="fa fa-male"></i> <span class="nav-label">학부모</span></a>
				</li>
				<li>
					<a href="#"><i class="fa fa-university"></i> <span class="nav-label">매니저</span> <span class="fa arrow"></span></a>
					<ul class="nav nav-second-level">
						<li><a href="#/manager/list" data-type="leftMenu">매니저 리스트</a></li>
						<li><a href="#/manager/requestList" data-type="leftMenu">가입요청 매니저 리스트</a></li>
					</ul>
				</li>
				<li>
					<a href="#/questionsMail/list" data-type="leftMenu"><i class="fa fa-graduation-cap"></i> <span class="nav-label">문의 메일</span></a>
				</li>
				<li>
					<a href="#"><i class="fa fa-cog"></i> <span class="nav-label">설정</span> <span class="fa arrow"></span></a>
					<ul class="nav nav-second-level">
						<li><a href="#/setting/hakwonCategory" data-type="leftMenu">학원업종관리</a></li>
						<li><a href="#/setting/bannerDefaultPrice" data-type="leftMenu">베너 기본 가격</a></li>
						<li><a href="#/advertise/monthPrice" data-type="leftMenu">베너 월별 가격 설정</a></li>
						<li><a href="#/setting/advertiseBankInfo" data-type="leftMenu">베너 입금 계좌 정보</a></li>
					</ul>
				</li>
				<li>
					<a href="/logout.do"><i class="fa fa-graduation-cap"></i> <span class="nav-label">로그아웃</span></a>
				</li>
			</ul>
		</div>
	</nav>

	<div id="page-wrapper" class="gray-bg">
		<div class="row border-bottom">
			<nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
				<div class="navbar-header">
					<a class="navbar-minimalize minimalize-styl-2 btn btn-primary" href="#" onclick="return false;"><i class="fa fa-bars"></i> </a>
					<h1><a href="#/main">Home</a></h1>
				</div>
<!--
				<ul class="nav navbar-top-links navbar-right">
					<li style="display:none;">
						<a class="count-info" href="#/adminQuestion/list" title="받은메세지">
							<i class="fa fa-envelope"></i>  <span class="label label-warning"></span>
						</a>
					</li>
					<li style="display:none;">
						<a class="count-info" href="#/master/requestList" title="가입신청">
							<i class="fa fa-bell"></i>  <span class="label label-primary">8</span>
						</a>
					</li>
					<li>
						<a href="/logout.do">
							<i class="fa fa-sign-out"></i> 로그아웃
						</a>
					</li>
				</ul>
-->
			</nav>
		</div>

		<!-- commNaviMenu -->
		<div class="row wrapper border-bottom white-bg page-heading">
			<h1>학원 밴드 관리자 입니다.</h1>
		</div>

		<section id="mainNgView" class="wrapper wrapper-content row" ng-view></section>

		<footer class="footer">
			<strong>Copyright</strong> HAKWONBAND &copy; 2015
		</footer>
	</div>
</div>

<!-- Custom and plugin javascript -->
<script src="/inspinia/js/plugins/iCheck/icheck.min.js"></script>
<script src="/inspinia/js/plugins/metisMenu/jquery.metisMenu.js"></script>
<script src="/inspinia/js/inspinia.js"></script>

<!-- angular js -->
<script type="text/javascript" src="/js/lib/angular-1.4.7/angular.min.js"></script>
<script type="text/javascript" src="/js/lib/angular-1.4.7/angular-route.min.js"></script>
<script type="text/javascript" src="/js/lib/angular-1.4.7/angular-touch.min.js"></script>

<!-- 공통 js -->
<script type="text/javascript" src="/js/constants/constant.jsp"></script>
<script type="text/javascript" src="/js/common/common.prototype.js"></script>
<script type="text/javascript" src="/js/common/common.js"></script>
<script type="text/javascript" src="/js/common/bumworld.html5.upload.js"></script>
<script type="text/javascript" src="/js/tmpl/hakwonTmpl.js"></script>

<!-- 서비스 모듈(배포시 하나의 파일로 머지할 계획) start -->
<script type="text/javascript" src="/js/module/main/hakwonMainApp.js"></script>
<script type="text/javascript" src="/js/module/main/advertiseBankDeposit.js"></script>
<script type="text/javascript" src="/js/module/main/commNaviMenu.js"></script>
<script type="text/javascript" src="/js/module/main/edBanner.js"></script>
<script type="text/javascript" src="/js/module/main/hakwon.js"></script>
<script type="text/javascript" src="/js/module/main/hakwonDetail.js"></script>
<script type="text/javascript" src="/js/module/main/hakwonCate.js"></script>
<script type="text/javascript" src="/js/module/main/index.js"></script>
<script type="text/javascript" src="/js/module/main/main.js"></script>
<script type="text/javascript" src="/js/module/main/master.js"></script>
<script type="text/javascript" src="/js/module/main/manager.js"></script>
<script type="text/javascript" src="/js/module/main/messageSend.js"></script>
<script type="text/javascript" src="/js/module/main/messageView.js"></script>
<script type="text/javascript" src="/js/module/main/parent.js"></script>
<script type="text/javascript" src="/js/module/main/setting.js"></script>
<script type="text/javascript" src="/js/module/main/student.js"></script>
<script type="text/javascript" src="/js/module/main/teacher.js"></script>
<script type="text/javascript" src="/js/module/main/testModule.js"></script>
<script type="text/javascript" src="/js/module/main/adminQuestion.js"></script>
<script type="text/javascript" src="/js/module/main/questionsMail.js"></script>
<script type="text/javascript" src="/js/module/main/excelUpload.js"></script>

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
<!--
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-66935015-1', 'auto');
  ga('send', 'pageview');

</script>
-->
</body>
</html>