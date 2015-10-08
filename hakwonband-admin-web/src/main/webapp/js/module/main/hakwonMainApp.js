var hakwonMainApp = angular.module('hakwonMainApp', ['ngRoute', 'ngTouch']);
hakwonMainApp.config(['$routeProvider', function($routeProvider) {
	console.log('hakwonMainApp.config');

	$routeProvider
		.when('/index', {
			template: hakwonTmpl.common.init
			, controller: 'indexController'
		})
		.when('/main', {
			template: function() {
				if( hakwonInfo.hakwonList.length == 0 ) {
					return hakwonTmpl.common.emptyDashBoard;
				} else {
					return hakwonTmpl.common.dashBoard;
				}
			}
			, controller: 'mainController'
		})

		/*	광고 입금	##############################################	*/
		/*	광고 입금 리스트	*/
		.when('/edvertise/bankDeposit/list', {
			template: hakwonTmpl.advertise.bankDeposit.list
			, controller: 'advertiseBankDepositListController'
		})

		/*	광고 입금 정보	*/
		.when('/edvertise/bankDeposit/view', {
			template: hakwonTmpl.advertise.bankDeposit.viewForm
			, controller: 'advertiseBankDepositViewController'
		})

		/*	광고 입금 수정	*/
		.when('/edvertise/bankDeposit/edit', {
			template: hakwonTmpl.advertise.bankDeposit.editForm
			, controller: 'advertiseBankDepositEditController'
		})

		/*	광고 입금 등록	*/
		.when('/edvertise/bankDeposit/write', {
			template: hakwonTmpl.advertise.bankDeposit.write
			, controller: 'advertiseBankDepositWriteController'
		})


		/*	베너 광고	##############################################	*/
		/*	학원 배너 광고 리스트	*/
		.when('/advertise/banner/list', {
			template: hakwonTmpl.adBanner.list
			, controller: 'adBannerListController'
		})
		/*	학원 배너 광고 상세	*/
		.when('/advertise/banner/view', {
			template: hakwonTmpl.adBanner.view
			, controller: 'adBannerViewController'
		})

		/*	월별 가격 설정	*/
		.when('/advertise/monthPrice', {
			template: hakwonTmpl.adBanner.monthPrice
			, controller: 'adBannerMonthPriceController'
		})


		/*	학원	##############################################	*/
		/*	학원 리스트	*/
		.when('/hakwon/list', {
			template: hakwonTmpl.hakwon.list
			, controller: 'hakwonListController'
		})
		/*	학원 등록	*/
		.when('/hakwon/regist', {
			template: hakwonTmpl.hakwon.regist
			, controller: 'hakwonRegistController'
		})
		/*	관리자 학원 수정	*/
		.when('/hakwon/adminModify', {
			template: hakwonTmpl.hakwon.adminModifyForm
			, controller: 'hakwonAdminModifyController'
		})
		/*	엑셀 업로드	*/
		.when('/hakwon/excelUpload', {
			templateUrl: '/js/partials/excelUpload.html'
			, controller: 'hakwonExcelUploadController'
		})


		/*	학원 상세	##############################################	*/
		/*	학원 소개	*/
		.when('/hakwon/detail/introduce', {
			template: hakwonTmpl.hakwon.hakwonDetailForm
			, controller: 'hakwonDetailIntroduceController'
		})
		.when('/hakwon/detail/introUpdate', {
			template: hakwonTmpl.hakwon.hakwonDetailForm
			, controller: 'hakwonDetailIntroUpdateController'
		})

		/*	반 리스트	*/
		.when('/hakwon/detail/classList', {
			template: hakwonTmpl.hakwon.hakwonDetailForm
			, controller: 'hakwonDetailClassListController'
		})
		/*	선생님	*/
		.when('/hakwon/detail/teacherList', {
			template: hakwonTmpl.hakwon.hakwonDetailForm
			, controller: 'hakwonDetailTeacherListController'
		})
		/*	학생	*/
		.when('/hakwon/detail/studentList', {
			template: hakwonTmpl.hakwon.hakwonDetailForm
			, controller: 'hakwonDetailStudentListController'
		})
		/*	학부모	*/
		.when('/hakwon/detail/parentList', {
			template: hakwonTmpl.hakwon.hakwonDetailForm
			, controller: 'hakwonDetailParentListController'
		})


		/*	테스트	##############################################	*/
		/*	테스트 메시지	*/
		.when('/test/noti', {
			template: hakwonTmpl.test.noti
			, controller: 'testNotiController'
		})
		/*	테스트 메일	*/
		.when('/test/mail', {
			template: hakwonTmpl.test.mail
			, controller: 'testMailController'
		})
		/*	테스트 문의 메일	*/
		.when('/test/questionsMail', {
			template: hakwonTmpl.test.questionsMail
			, controller: 'testQuestionsMailController'
		})


		/*	셋팅	##############################################	*/
		/*	카테고리	*/
		.when('/setting/hakwonCategory', {
			template: hakwonTmpl.setting.category.form
			, controller: 'hakwonCateController'
		})

		/*	베너 기본 가격	*/
		.when('/setting/bannerDefaultPrice', {
			template: hakwonTmpl.setting.bannerDefaultPrice.form
			, controller: 'settingBannerDefaultPriceController'
		})

		/*	광고 입금 계좌 정보	*/
		.when('/setting/advertiseBankInfo', {
			template: hakwonTmpl.setting.advertiseBankInfo
			, controller: 'settingAdvertiseBankInfoController'
		})


		/*	원장	##############################################	*/
		/*	원장님 리스트	*/
		.when('/master/list', {
			template: hakwonTmpl.master.listForm
			, controller: 'masterListController'
		})
		.when('/master/view', {
			template: hakwonTmpl.master.viewForm
			, controller: 'masterViewController'
		})
		/*	가입 요청 원장 리스트	*/
		.when('/master/requestList', {
			template: hakwonTmpl.master.join_request_list
			, controller: 'masterRequestListController'
		})

		/*	선생님	##############################################	*/
		/*	선생님 리스트	*/
		.when('/teacher/list', {
			template: hakwonTmpl.teacher.listForm
			, controller: 'teacherListController'
		})
		.when('/teacher/view', {
			template: hakwonTmpl.teacher.viewForm
			, controller: 'teacherViewController'
		})

		/*	학생	##############################################	*/
		/*	학생 리스트	*/
		.when('/student/list', {
			template: hakwonTmpl.student.listForm
			, controller: 'studentListController'
		})
		.when('/student/view', {
			template: hakwonTmpl.student.viewForm
			, controller: 'studentViewController'
		})

		/*	학부모	##############################################	*/
		/*	학부모 리스트	*/
		.when('/parent/list', {
			template: hakwonTmpl.parent.listForm
			, controller: 'parentListController'
		})
		.when('/parent/view', {
			template: hakwonTmpl.parent.viewForm
			, controller: 'parentViewController'
		})

		/*	매니저	##############################################	*/
		/*	매니저 리스트	*/
		.when('/manager/list', {
			template: hakwonTmpl.manager.listForm
			, controller: 'managerListController'
		})
		.when('/manager/view', {
			template: hakwonTmpl.manager.viewForm
			, controller: 'managerViewController'
		})
		/*	가입 요청 매니저 리스트	*/
		.when('/manager/requestList', {
			template: hakwonTmpl.manager.join_request_list
			, controller: 'managerRequestListController'
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

		/*	문의 메일	##############################################	*/
		/*	문의 메일	 리스트	*/
		.when('/questionsMail/list', {
			template: hakwonTmpl.questionsMail.listForm
			, controller: 'questionsMailListController'
		})
		.when('/questionsMail/view', {
			template: hakwonTmpl.questionsMail.viewForm
			, controller: 'questionsMailViewController'
		})

		/*	메세지	##############################################	*/
		/*	메세지 보내기	*/
		.when('/message/send', {
			templateUrl: '/js/partials/messageSend.html'
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
		/*	보낸 메세지 상세	*/
		.when('/message/sendGroupMessageDetail', {
			template: hakwonTmpl.messageView.viewForm
			, controller: 'messageGroupSendDetailController'
		})
		/*	보낸 메세지 상세	*/
		.when('/message/sendSingleMessageDetail', {
			template: hakwonTmpl.messageView.viewForm
			, controller: 'messageSingleSendDetailController'
		})

		/*	default	##############################################	*/
		.otherwise({
			redirectTo: '/index'
		});
}]);


/**
 * 학원 공통 필터 : HTML 필터링
 * 예제 : <div ng-bind-html="hakwonObj.introduction | rawHtml"></div>
 */
hakwonMainApp.filter('rawHtml', ['$sce', function($sce){
	return function(val) {
		return $sce.trustAsHtml(val);
	};
}]);



/*	학원 공통	*/
var HakwonCommon = function() {

	var self = this;

	var $leftMenuNav = undefined;
	var $topMenuNav = undefined;

	this.onload = function() {
		$leftMenuNav	= $('nav.navbar-static-side');
		$topMenuNav		= $('nav.navbar-static-top');

		/*	사이드 메뉴 클릭시 이동	*/
		$('#side-menu li a[data-type=leftMenu]').click(function() {
			if( commProto.isResponsiveCheck() ) {
				$('body').removeClass('mini-navbar');
			}
		});
	}

	/**
	 * 파일 경로 생성
	 * hakwonCommon.createFilePullPath
	 */
	this.createFilePullPath = function(logoFilePath, fileType, isThumb) {
		if (!isNull(logoFilePath)) {
			if( isThumb === true ) {
				return  HakwonConstant.FileServer.ATTATCH_DOMAIN + logoFilePath + '_thumb';
			} else {
				return  HakwonConstant.FileServer.ATTATCH_DOMAIN + logoFilePath;
			}
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
	 * 페이지 로드시 호출
	 * hakwonCommon.pageInit();
	 */
	this.pageInit = function() {
		if( HakwonConstant.ServerType != 'live' ) {
			//console.log("caller is " + arguments.callee.caller.toString());
		}
		/*	스크롤 탑으로 이동	*/
		self.goScrollTop();

		if( userAuth.userType == HakwonConstant.UserType.ADMIN ) {
		} else {
			/*	사용자 타입이 다르다	*/
			console.error('Error UserType', userAuth);
			commProto.logger({'pageInitFail':'ErrorUserType'});
			window.location = "/logout.do";
			return ;
		}
		if( $('body').hasClass('pace-done') ) {
			/*	이미 셋팅 되어 있다.	*/
			console.log('already pageInit!');
		} else {
			try {
				console.log('hakwonCommon.pageInit userAuth.userType', userAuth.userType);
				$('body').addClass('pace-done');

				/*	프로필 셋팅	*/
				$.tmpl(hakwonTmpl.leftMenu.userProfile).appendTo($leftMenuNav.find('div.profile-element'));

				/*	메뉴 셋팅	*/
				if( hakwonInfo.hakwonList.length == 0 ) {
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex, customData:{'location':$location}});
			}
		}
	}

	/*	스크롤 탑 이동	*/
	this.goScrollTop = function() {
		/*	스크롤 탑	*/
		//$("html, body").animate({ scrollTop: 0 }, 600);
		$("html, body").scrollTop(0);
	};

	/**
	 * 사용자 상세 링크
	 */
	this.userDetailLink = function(userType, userNo) {
		var link = '';
		if( HakwonConstant.UserType.WONJANG == userType ) {

		} else if( HakwonConstant.UserType.STUDENT == userType ) {

		} else if( HakwonConstant.UserType.PARENT == userType ) {

		} else if( HakwonConstant.UserType.TEACHER == userType ) {

		}
		if( isNull(link) ) {
			link = '#';
		}
		return link;
	}

	this.onload();
}
var hakwonCommon = new HakwonCommon();


/**
 * 학원 공통 앵귤러 모듈
 */
hakwonMainApp.factory('CommUtil', function($http) {
	return {
		/**
		 * 년월 - 포멧터
		 */
		yearMonthFormatter: function(dateStr) {
			if( dateStr ) {
				return dateStr.substring(0, 4)+'-'+dateStr.substring(4, 6);
			} else {
				return '';
			}
		}

		/**
		 * 파일 경로 생성
		 * CommUtil.createFilePullPath
		 */
		, createFilePullPath : hakwonCommon.createFilePullPath

		/**
		 * 학원 로고 처리
		 */
		, hakwonLogoImg : function(imgSrc) {
			console.log('imgSrc', imgSrc);
			if( !imgSrc || isNull(imgSrc) ) {
				return DefaultInfo.hakwonLogoPath;
			} else {
				return HakwonConstant.FileServer.ATTATCH_DOMAIN+imgSrc;
			}
		}

		/*	숫자 콤바 추가	*/
		/*	CommUtil.numberWithCommas	*/
		, numberWithCommas : function(x) {
			if( !x ) return '0';
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		/**
		 * 데이타 통신을 도와주는 util
		 * @param httpObj
		 * errorFun : 실패 함수(기본:commProto.commonError)
		 * successFun : 성공 함수
		 * method : 통신 메소드(기본:post)
		 * queryString : 쿼리 스트링
		 * param : 쿼리스트링으로 변환되는 파라미터 object
		 * url : 호출 url
		 */
		, ajax : function(httpObj) {
			if( !httpObj.errorFun ) {
				httpObj.errorFun = commProto.commonError;
			}

			if( !httpObj.method ) {
				httpObj.method = 'post';
			}

			if( !httpObj.queryString && httpObj.param ) {
				httpObj.queryString = $.param(httpObj.param, true);
			}

			$http({
				withCredentials: false,
				method: httpObj.method,
				url: httpObj.url,
				headers: {'Content-Type': 'application/x-www-form-urlencoded', hakwonNo:hakwonInfo.hakwon_no},
				data: httpObj.queryString
			}).
			success(httpObj.successFun).error(httpObj.errorFun);
		}
	}
});
