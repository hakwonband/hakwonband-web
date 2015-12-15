<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
	boolean isLive = false;
	String cacheManifest = "";
	if( request.getServerName().indexOf("teamoboki.com") >= 0 ) {
		/*	로컬은 캐시 적용 안한다.	*/
		isLive = false;
	} else {
		cacheManifest = "main.cache.manifest";
		isLive = true;
	}
	boolean isMobile = false;
	String userAgent = request.getHeader("User-Agent");
	if( userAgent.indexOf("Mobile") >= 0 || userAgent.indexOf("Android") >= 0 || userAgent.indexOf("PlayBook") >= 0 || userAgent.indexOf("KFAPWI") >= 0 ) {
		isMobile = true;
	}
%>


<!--
############################################################
############################################################
# 2015-12-05 01
############################################################
############################################################
############################################################
############################################################
# 2015-12-06 02
############################################################
############################################################
############################################################
############################################################
# 2015-12-09 01
############################################################
############################################################
############################################################
############################################################
# 2015-12-16 01
############################################################
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

	<link rel="shortcut icon" type="image/x-icon" href="/assets/img/favicon/64x64.png">

	<!--
	<link href="/assets/css/main.lib.min.css" rel="stylesheet">
	-->
	<link href="/assets/font-awesome/css/font-awesome.min.css" rel="stylesheet">
<%
	if( isMobile == false ) {
%>
	<link href="/assets/css/font_style.css" rel="stylesheet">
<%
	}
%>
	<link href="/assets/css/bootstrap.min.css" rel="stylesheet">
	<link href="/assets/css/plugins/iCheck/custom.css" rel="stylesheet">
	<link href="/assets/css/animate.css" rel="stylesheet">
	<link href="/assets/css/style.css" rel="stylesheet">
	<link href="/assets/css/hakwon_style.css" rel="stylesheet">
	<link href="/assets/css/plugins/switchery/switchery.css" rel="stylesheet">
	<link href="/assets/css/plugins/fullcalendar/fullcalendar.css" rel="stylesheet">
	<link href="/assets/css/plugins/fullcalendar/fullcalendar.print.css" rel="stylesheet" media="print">

	<!-- 공통 js -->
	<script type="text/javascript" src="/js/constants/constant.jsp"></script>

	<!-- 외부 lib js -->
	<script type="text/javascript" src="/assets/js/common.lib.min.js"></script>

<style type="text/css">
	#calendar {
		max-width: 900px;
		margin: 0 auto;
	}
</style>
</head>
<body class="gray-bg">

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
			</ul>
		</div>
	</nav>

	<div id="page-wrapper" class="gray-bg">
		<div class="row border-bottom">
			<nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
				<div class="navbar-header">
					<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#" onclick="return false;"><i class="fa fa-bars"></i> </a>
					<h1></h1>
				</div>
				<ul class="nav navbar-top-links navbar-right">
					<li data-view="hakwon_list_li" style="display:none;">
						<select class="form-control select_hakwon" name="hakwon_list"></select>
					</li>
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
	<script type="text/javascript" src="/assets/js/main.module.min.js"></script>
<%
	} else {
%>
	<script type="text/javascript" src="/js/common/common.prototype.js"></script>
	<script type="text/javascript" src="/js/common/common.js"></script>
	<script type="text/javascript" src="/js/common/bumworld.html5.upload.js"></script>
	<script type="text/javascript" src="/js/tmpl/hakwonTmpl.js"></script>

	<!-- angularJS hakwonApp 모듈선언 -->
	<script type="text/javascript" src="/js/module/main/hakwonMainApp.js"></script>

	<!-- 팩토리 공통기능 start -->
	<script type="text/javascript" src="/js/module/factories/CommUtil.js"></script>

	<script type="text/javascript" src="/js/module/main/base.js"></script>
	<script type="text/javascript" src="/js/module/main/index.js"></script>
	<script type="text/javascript" src="/js/module/main/main.js"></script>
	<script type="text/javascript" src="/js/module/main/edBanner.js"></script>
	<script type="text/javascript" src="/js/module/main/event.js"></script>
	<script type="text/javascript" src="/js/module/main/member.js"></script>
	<script type="text/javascript" src="/js/module/main/master.js"></script>
	<script type="text/javascript" src="/js/module/main/hakwon.js"></script>
	<script type="text/javascript" src="/js/module/main/messageSend.js"></script>
	<script type="text/javascript" src="/js/module/main/messageView.js"></script>
	<script type="text/javascript" src="/js/module/main/class.js"></script>
	<script type="text/javascript" src="/js/module/main/notice.js"></script>
	<script type="text/javascript" src="/js/module/main/parent.js"></script>
	<script type="text/javascript" src="/js/module/main/student.js"></script>
	<script type="text/javascript" src="/js/module/main/teacher.js"></script>
	<script type="text/javascript" src="/js/module/main/setting.js"></script>
	<script type="text/javascript" src="/js/module/main/adminQuestion.js"></script>
	<script type="text/javascript" src="/js/module/main/attendance.js"></script>
	<script type="text/javascript" src="/js/module/main/receipt.js"></script>
	<script type="text/javascript" src="/js/module/main/counsel.js"></script>
<%
	}
%>
<script>

$(document).ready(function () {
	console.log('document ready');

	if( commProto.isResponsiveCheck() ) {
		if( $('body').hasClass('body-small') == false ) {
			$('body').addClass('body-small');
		}
	}

	try {
		$.getScript("https://developers.kakao.com/sdk/js/kakao.min.js", function(data, textStatus, jqxhr) {
			Kakao.init(HakwonConstant.Sns.KAKAO);
		});

		$.getScript("/js/lib/tinymce-4.1.7/tinymce.min.js", function(data, textStatus, jqxhr) {
			console.info('[Load] /js/lib/tinymce-4.1.7/tinymce.min.js');
			window.tinymce.dom.Event.domLoaded = true;
			tinymce.baseURL = "/js/lib/tinymce-4.1.7";
			tinymce.suffix = ".min";
		});

	} catch(ex) {
	}
});

</script>
</body>
</html>