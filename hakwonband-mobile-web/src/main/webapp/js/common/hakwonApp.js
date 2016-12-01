var hakwonApp = angular.module('hakwonApp', ['ngRoute', 'ngTouch']);
hakwonApp.config(['$routeProvider', function($routeProvider) {
	console.log('hakwonApp.config');
	$routeProvider
		.when('/index', {
			template: hakwonTmpl.init
			, controller: 'indexController'
		})
		.when('/login', {
			template: hakwonTmpl.login
			, controller: 'loginController'
		})
		.when('/userMain', {
			templateUrl: '/assets/partials/userMain.html'
			, controller: 'userMainController'
		})
		.when('/signUp', {
			templateUrl: '/assets/partials/signUp.html'
			, controller: 'signUpController'
		})
		.when('/findId', {
			templateUrl: '/assets/partials/findId.html'
			, controller: 'findIdController'
		})
		.when('/findPw', {
			templateUrl: '/assets/partials/findPw.html'
			, controller: 'findPwController'
		})
		.when('/memberModify', {
			templateUrl: '/assets/partials/memberModify.html'
			, controller: 'memberModifyController'
		})
		.when('/myInfo', {
			templateUrl: '/assets/partials/myInfo.html'
			, controller: 'myInfoController'
		})
		.when('/sendMessageList', {
			templateUrl: '/assets/partials/sendMessageList.html'
			, controller: 'sendMessageListController'
		})
		.when('/attendanceList', {
			templateUrl: '/assets/partials/attendanceList.html'
			, controller: 'attendanceListController'
		})
		.when('/receiveMessageList', {
			templateUrl: '/assets/partials/receiveMessageList.html'
			, controller: 'receiveMessageListController'
		})
		.when('/messageDetail', {
			templateUrl: '/assets/partials/messageDetail.html'
			, controller: 'messageDetailController'
		})
		.when('/messageWrite', {
			templateUrl: '/assets/partials/messageWrite.html'
			, controller: 'messageWriteController'
		})
		.when('/hakwon/intro', {
			templateUrl: '/assets/partials/hakwonIntro.html'
			, controller: 'hakwonIntroController'
		})
		.when('/hakwon/detail', {
			templateUrl: '/assets/partials/hakwonDetail.html'
			, controller: 'hakwonDetailController'
		})
		.when('/hakwon/search', {
			templateUrl: '/assets/partials/hakwonSearch.html'
			, controller: 'hakwonSearchController'
		})
		.when('/hakwon/class', {
			templateUrl: '/assets/partials/hakwonClass.html'
			, controller: 'hakwonClassController'
		})
		.when('/hakwon/teacherList', {
			templateUrl: '/assets/partials/teacherList.html'
			, controller: 'teacherListController'
		})
		.when('/hakwon/noticeList', {
			templateUrl: '/assets/partials/noticeList.html'
			, controller: 'noticeListController'
		})
		.when('/hakwon/noticeDetail', {
			templateUrl: '/assets/partials/noticeDetail.html'
			, controller: 'noticeDetailController'
			, service: 'commonService'
		})
		.when('/hakwon/eventList', {
			templateUrl: '/assets/partials/eventList.html'
			, controller: 'eventListController'
		})
		.when('/hakwon/eventDetail', {
			templateUrl: '/assets/partials/eventDetail.html'
			, controller: 'eventDetailController'
		})
		.when('/hakwon/eventJoin', {
			templateUrl: '/assets/partials/eventJoin.html'
			, controller: 'eventJoinController'
		})
		.when('/edvertiseList', {
			template: hakwonTmpl.advertList
			, controller: 'edvertiseListController'
		})
		.when('/edvertiseUcc', {
			templateUrl: '/assets/partials/edvertiseUcc.html'
			, controller: 'edvertiseUccController'
		})
		.otherwise({
			redirectTo: '/index'
		});

}]);

/**
 * 헤더 App
 */
var HakwonHeader = function() {
	console.log('HakwonHeader create');

	var $header = $('body > header');
	var $bgDim = $('div.bg_dim');
	var $leftMenu = $('#mypage');
	var $rightMenu = $('#mypage_academy');

	var self = this;
	this.onload = function() {

		/*	배경 클릭시 메뉴 닫기	*/
		$bgDim.click(self.menuClose);

		/*	닫기 버튼 클릭	*/
		$leftMenu.on(clickEvent, 'a.btn_close', self.menuClose);
		$rightMenu.on(clickEvent, 'a.btn_close', self.menuClose);

		/*	왼쪽 메뉴 클릭	*/
		$header.on('click', 'button[data-act=leftMenu]', self.leftMenu);

		/*	오른쪽 메뉴 클릭	*/
		$header.on('click', 'button[data-act=rightMenu]', self.rightMenu);

		/* 왼쪽 메뉴 페이지 링크 */
		$leftMenu.on('click', 'a[data-act=changeUrlBtn]', self.changeLeftUrlBtn);
		$leftMenu.on('click', 'a[data-act=selectHakwonBtn]', self.selectHakwonBtn);

		/* 오른쪽 메뉴 페이지 링크 */
		$rightMenu.on('click', 'a[data-act=changeUrlBtn]', self.changeUrlRightBtn);
		$rightMenu.on('click', 'a[data-act=selectClassBtn]', self.selectClassBtn);

		$leftMenu.on('click', 'button[data-act=searchContent]', self.searchContent);

		$leftMenu.on('keypress', 'input[name=g_search_text]', self.searchContent);
	};

	/**
	 * 메뉴 닫기
	 */
	this.menuClose = function() {
		$bgDim.hide();
		$leftMenu.hide();
		$rightMenu.hide();
		$("html, body").removeAttr("style");
		try { window.PLATFORM.menuStatus('close'); } catch(e) {}
		return false;
	}

	/**
	 * 메뉴 열기
	 */
	this.menuOpen = function(menuType) {
		$("html, body").attr("style","height:"+$(window).height()+"px; overflow:hidden");
		$bgDim.show();

		if( menuType == 'right' ) {
			$rightMenu.show();
		} else if( menuType == 'left' ) {
			$leftMenu.show();
		} else {
			alert('잘못된 메뉴 입니다.');
		}
		try { window.PLATFORM.menuStatus('open'); } catch(e) {}
	}

	/**
	 * 왼쪽 메뉴 클릭
	 */
	this.leftMenu = function() {
		console.log('왼쪽 메뉴 클릭');

		if( !userAuth.userNo ) {
			alert('학원밴드 이용을 위해 로그인을 해주세요.');
			window.location.href = MENUS.sharpUrls.login;
		} else {
			if( userAuth.userType == HakwonConstant.UserType.STUDENT || userAuth.userType == HakwonConstant.UserType.PARENT ) {
				$leftMenu.html($.tmpl(hakwonTmpl.header.leftMenu));

				if( userAuth.userType == HakwonConstant.UserType.STUDENT ) {
					$leftMenu.removeClass().addClass('student');
				} else if( userAuth.userType == HakwonConstant.UserType.PARENT ) {
					$leftMenu.removeClass().addClass('parent');
				} else {
					//alert('잘못된 사용자 타입으로 다른데로 보낸다.');
					comm.moveSite();
					return false;
				}

				/**
				 * 메뉴 오픈
				 */
				self.menuOpen('left');
			} else {
				alert('학생 및 학부모님만 이용할수 있는 메뉴 입니다.');
			}
		}
		return false;
	};

	/**
	 * 오른쪽 메뉴 클릭
	 */
	this.rightMenu = function() {
		if( userAuth && (
				userAuth.userType == HakwonConstant.UserType.ADMIN
				|| userAuth.userType == HakwonConstant.UserType.MANAGER
				|| userAuth.userType == HakwonConstant.UserType.TEACHER
				|| userAuth.userType == HakwonConstant.UserType.WONJANG
			)
		) {
			alert('학생 및 학부모님만 이용할수 있는 메뉴 입니다.');
		} else {
			$rightMenu.empty();
			$.tmpl(hakwonTmpl.header.rightMenu).appendTo($rightMenu);

			/**
			 * 메뉴 오픈
			 */
			self.menuOpen('right');

			/*	학원 리스트 갱신 후 메뉴 조정	*/
			comm.userHakwonList(function() {
				$rightMenu.empty();
				$.tmpl(hakwonTmpl.header.rightMenu).appendTo($rightMenu);
			});
		}
		return false;
	};

	/**
	 * 왼쪽 메뉴
	 */
	this.changeLeftUrlBtn = function(e) {
		self.menuClose();
		var urlKey = $(e.currentTarget).data('url');

		if( urlKey == "messageWrite" ) {
			/*	메시지 작성	*/
			if( !hakwonInfo.hakwonList || hakwonInfo.hakwonList.length == 0 ) {
				alert('가입된 학원이 없어 메세지를 보낼수 없습니다.');
				return false;
			}
		} else if( urlKey == "logout" ) {
			if( window.confirm("정말로그아웃하시겠습니까?") ) {
				window.location = '/logout.do';
			}
			return false;
		}

		window.location.href = MENUS.sharpUrls[urlKey];
		return false;
	};

	this.selectHakwonBtn = function(e) {
		self.menuClose();
		var hakwonNo = $(e.currentTarget).data('id');
		window.location.href =  MENUS.sharpUrls.hakwonDetail + '?hakwon_no=' + hakwonNo;
		return false;
	};

	/**
	 * 컨텐츠 검색
	 */
	this.searchContent = function(e) {
		if( e && e.currentTarget ) {
			if( e.currentTarget.nodeName == 'INPUT' ) {
				if( e.which == 13 ) {
					var search_text = $('input[name=g_search_text]').val();
					comm.searchContent(search_text);
				}
			} else if( e.currentTarget.nodeName == 'BUTTON' ) {
				var search_text = $('input[name=g_search_text]').val();
				comm.searchContent(search_text);
			}
		}
	}

	/**
	 * 오른쪽 메뉴
	 */
	this.changeUrlRightBtn = function(e) {
		self.menuClose();
		var urlKey = $(e.currentTarget).data('url');

		if( urlKey == 'hakwonMemberOut' ) {
			/*	학원멤터 탈퇴	*/
			if( window.confirm(hakwonInfo.currentHakwon.hakwon_name + ' 학원을 탈퇴 하시겠습니까?') ) {
				comm.hakwonMemberOut(hakwonInfo.currentHakwon.hakwon_no);
			}
			return false;
		}

		window.location.href = MENUS.sharpUrls[urlKey] + '?hakwon_no=' + hakwonInfo.currentHakwon.hakwon_no;
		return false;
	};

	this.selectClassBtn = function(e) {
		self.menuClose();
		var classNo = $(e.currentTarget).data('id');
		window.location.href =  MENUS.sharpUrls.hakwonClass + '?hakwon_no=' + hakwonInfo.currentHakwon.hakwon_no + '&class_no=' + classNo;
		return false;
	};

	/**
	 * set header
	 * @viewType user, hakwon, join
	 */
	this.setHeader = function(headerObj) {
		console.log('setHeader');
		var viewType = headerObj.viewType;
		var headerTitle = headerObj.headerTitle;
		if( !viewType ) {
			viewType = 'common';
		}

		/*	url 인증 체크	*/
		comm.urlLoginCheck();

		console.log('setHeader call viewType['+viewType+'] headerTitle['+headerTitle+']');
		$header.removeClass();
		if( viewType == 'user' ) {
			if( isNull(headerTitle) ) {
				if( userAuth.userName ) {
					headerTitle = userAuth.userName+'의 학원밴드';
				} else {
					headerTitle = '학원밴드';
				}
			}

			/**
			 * 사용자 레벨에 따라 학생 학부모 클래스 분리
			 * 학생 : type_01
			 * 학부모 : type_03
			 */
			if( userAuth.userType == HakwonConstant.UserType.STUDENT ) {
				$header.addClass('type_01');
			} else if( userAuth.userType == HakwonConstant.UserType.PARENT ) {
				$header.addClass('type_03');
			} else {
				console.log('잘못된 사용자 타입으로 다른데로 보낸다.');
				comm.moveSite();
				return false;
			}
			$header.empty();
			$header.html($.tmpl(hakwonTmpl.header.user, {headerTitle:headerTitle}));
		} else if( viewType == 'hakwon' ) {
			if( isNull(headerTitle) ) {
				headerTitle = hakwonInfo.currentHakwon.hakwon_name;
			}

			$header.addClass('type_02');
			$header.empty();

			$header.html($.tmpl(hakwonTmpl.header.hakwon, {headerTitle:headerTitle}));
		} else {
			if( isNull(headerTitle) ) {
				headerTitle = '학원밴드';
			}

			$header.addClass('type_02');
			$header.empty();
			$header.html($.tmpl(hakwonTmpl.header.comm, {headerTitle:headerTitle}));
		}
		$header.attr('data-view-type', viewType);
	};

	this.onload();
};
var hakwonHeader = new HakwonHeader();