var hakwonMainApp = angular.module('hakwonMainApp', ['ngRoute', 'ui.bootstrap', 'ngTouch']);
hakwonMainApp.config(['$routeProvider', function($routeProvider) {
	console.log('hakwonMainApp.config');

	$routeProvider
		.when('/index', {
			template: hakwonTmpl.common.init
			, controller: 'indexController'
		})
		.when('/main', {
			template: function() {
				return hakwonTmpl.dashBoard.emptyDashBoard;
			}
			, controller: 'mainController'
		})
		/*	회원정보	*/
		.when('/memberProfile', {
			templateUrl: '/js/partials/memberProfile.html'
			, controller: 'memberProfileController'
		})
		/*	회원정보수정	*/
		.when('/memberEdit', {
			templateUrl: '/js/partials/memberEdit.html'
			, controller: 'memberEditController'
		})

		/*	원장 상세 ############################################################		*/
		.when('/master/view', {
			template: hakwonTmpl.master.viewForm
			, controller: 'masterViewController'
		})


		/*	학원 ############################################################		*/
		.when('/hakwon/list', {
			template: hakwonTmpl.hakwon.list
			, controller: 'hakwonListController'
		})
		.when('/hakwon/detail', {
			templateUrl: '/js/partials/hakwonDetail.html'
			, controller: 'hakwonDetailController'
		})
		.when('/hakwon/introUpdate', {
			template: hakwonTmpl.hakwon.hakwonDetailForm
			, controller: 'hakwonIntroUpdateController'
		})

		/*	광고 ############################################################		*/
		/*	베너 광고 컨트롤러	*/
		/*	학원 배너 광고 리스트	*/
		.when('/edBanner/list', {
			template: hakwonTmpl.adBanner.list
			, controller: 'adBannerListController'
		})
		/*	학원 배너 광고 상세	*/
		.when('/edBanner/view', {
			template: hakwonTmpl.adBanner.view
			, controller: 'adBannerViewController'
		})
		/*	관리자에게 문의하기	##############################################	*/
		/*	관리자에게 문의하기 리스트	*/
		.when('/adminQuestion/list', {
			template: hakwonTmpl.adminQuestion.listForm
			, controller: 'adminQuestionListController'
		})
		.when('/adminQuestion/view', {
			template: hakwonTmpl.adminQuestion.viewForm
			, controller: 'adminQuestionViewController'
		})
		/*	관리자에게 문의하기 등록	*/
		.when('/adminQuestion/regist', {
			templateUrl: '/js/partials/adminQuestionWrite.html'
			, controller: 'registQuestionController'
		})


		/*	메세지 ############################################################		*/
		/*	받은 메시지 리스트	*/
		.when('/message/receiveMessageList', {
			template: hakwonTmpl.messageView.receiveMessageListForm
			, controller: 'receiveMessageListController'
		})
		/*	받은 메시지 상세	*/
		.when('/message/receiveMessageDetail', {
			template: hakwonTmpl.messageView.viewForm
			, controller: 'receiveMessageDetailController'
		})

		/*	보낸 메시지	*/
		.when('/sentMessage', {
			templateUrl: '/js/partials/sentMessage.html'
			, controller: 'sentMessageController'
		})
		/*	메시지 보내기	*/
		.when('/message/send', {
			template: hakwonTmpl.message.sendForm
			, controller: 'messageSendController'
		})
		/*	보낸 그룹 메세지	*/
		.when('/message/sendMessageGroupList', {
			template: hakwonTmpl.messageView.sendMessageGroupListForm
			, controller: 'messageSendGroupListController'
		})
		/*	보낸 싱글 메세지	*/
		.when('/message/sendMessageSingleList', {
			template: hakwonTmpl.messageView.sendMessageSingleListForm
			, controller: 'messageSendSingleListController'
		})
		/*	보낸 그룹 메세지 상세	*/
		.when('/message/sendGroupMessageDetail', {
			template: hakwonTmpl.messageView.viewForm
			, controller: 'messageGroupSendDetailController'
		})
		/*	보낸 개별 메세지 상세	*/
		.when('/message/sendSingleMessageDetail', {
			template: hakwonTmpl.messageView.viewForm
			, controller: 'messageSingleSendDetailController'
		})

		.otherwise({
			redirectTo: '/index'
		});
}]);


/*
 angular.module('CommonFormatters', []).
 filter('yearMonthFormatter', function() {
 return function(dateStr) {
 if( dateStr ) {
 return dateStr.substring(0, 4)+'-'+dateStr.substring(4, 6);
 } else {
 return '';
 }
 }
 });
 */

/*	학원 공통	*/
var HakwonCommon = function() {

	var self = this;

	var $leftMenuNav = undefined;
	var $topMenuNav = undefined;
	this.onload = function() {

		$leftMenuNav	= $('nav.navbar-static-side');
		$topMenuNav		= $('nav.navbar-static-top');

		/*	회원정보 프로필 버튼	*/
		$leftMenuNav.on(clickEvent, 'button[data-act=move_member_profile]', function() {
			window.location.href = PageUrl.user.memberProfile;
			if( commProto.isResponsiveCheck() ) {
				$('body').removeClass('mini-navbar');
			}
			return false;
		});

		/*	메세지 메뉴	*/
		$('ul.navbar-top-links a[data-act=receiveMessage]').click(function() {
			window.location.href = PageUrl.message.receiveMessageList;
			if( commProto.isResponsiveCheck() ) {
				$('body').removeClass('mini-navbar');
			}
			return false;
		});

		/*	프로필 셋팅	*/
		$.tmpl(hakwonTmpl.leftMenu.userProfile).appendTo($leftMenuNav.find('div.profile-element'));
	};

	/**
	 * 페이지 로드시 호출
	 * hakwonCommon.pageInit();
	 */
	this.pageInit = function(opts) {
		console.log('opts1', opts);
		if( !opts ) {
			opts = {
				isScrollTop:true
			};
		}
		console.log('opts2', opts);

		/*	스크롤 탑	*/
		if( opts.isScrollTop == true ) {
			//$("html, body").animate({ scrollTop : 0 });
			$("html, body").scrollTop(0);
		}

		if( HakwonConstant.ServerType != 'live' ) {
			//console.log("caller is " + arguments.callee.caller.toString());
		}

		if( userAuth.userType == HakwonConstant.UserType.MANAGER ) {
		} else {
			/*	사용자 타입이 다르다	*/
			console.error('Error UserType', userAuth);
			commProto.logger({'pageInitFail':'ErrorUserType'});
			window.location = "/logout.do";
			return ;
		}
	}

	/**
	 * 파일 경로 생성
	 * hakwonCommon.createFilePullPath
	 */
	this.createFilePullPath = function(filePath, fileType) {
		if (!isNull(filePath)) {
			return  HakwonConstant.FileServer.ATTATCH_DOMAIN + filePath+'_thumb';
		} else {
			if( fileType == 'photo' ) {
				return DefaultInfo.photoUrl;
			} else if( fileType == 'hakwon' ) {
				return DefaultInfo.hakwonLogoPath;
			} else {
				return DefaultInfo.photoUrl;
			}
		}
	};


	/**
	 * 페이징 생성
	 * paramObj
	 * 	target, currentPageNo, totalCount, pageScale
	 *
	 * TODO 구현 예정
	 * @usage hakwonCommon.genPageNav();
	 */
	this.genPageNav = function(paramObj) {
		console.log('genPageNav', paramObj);
		/*
		 int totalPageCount = 0;
		 if( totalCount == 0 ) {
		 return totalPageCount;
		 } else if( totalCount % listScale == 0 ) {
		 totalPageCount = totalCount / listScale;
		 } else {
		 totalPageCount = totalCount / listScale + 1;
		 }
		 return totalPageCount;
		 */
		var pageList = [];

		paramObj.pageList = pageList;
		$.tmpl(hakwonTmpl.common.pageNav, paramObj).appendTo(paramObj.target);
	}

	this.onload();
}
var hakwonCommon = new HakwonCommon();