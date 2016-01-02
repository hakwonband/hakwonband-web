var hakwonMainApp = angular.module('hakwonMainApp', ['ngRoute', 'ui.bootstrap', 'ngTouch']);

hakwonMainApp.config(function($httpProvider, $routeProvider) {
	console.log('hakwonMainApp.config');

	$httpProvider.defaults.headers.post  = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};

	$routeProvider
		.when('/index', {
			template: hakwonTmpl.common.init
			, controller: 'indexController'
		})
		.when('/main', {
			template: function() {
				if( hakwonInfo.hakwonList.length == 0 ) {
					if( userAuth.userType == HakwonConstant.UserType.WONJANG ) {
						return hakwonTmpl.dashBoard.emptyMaster;
					} else {
						return hakwonTmpl.dashBoard.emptyTeacher;
					}
				} else {
					return hakwonTmpl.dashBoard.main;
				}
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
		/*	학원정보 수정	*/
		.when('/hakwonModify', {
			templateUrl: '/js/partials/hakwonModify.html'
			, controller: 'hakwonModifyController'
		})
		/*	학원소개	*/
		.when('/hakwonIntro', {
			templateUrl: '/js/partials/hakwonIntro.html'
			, controller: 'hakwonIntroController'
		})
		/*	학원소개 작성-수정	*/
		.when('/hakwonIntroEdit', {
			templateUrl: '/js/partials/hakwonIntroEdit.html'
			, controller: 'hakwonIntroEditController'
		})
		/*	학원 전체 리스트	*/
		.when('/hakwonAllList', {
			templateUrl: '/js/partials/hakwonAllList.html'
			, controller: 'hakwonAllListController'
		})
		/*	선생님 학원 전체 리스트	*/
		.when('/teacherHakwonAllList', {
			templateUrl: '/js/partials/teacherHakwonAllList.html'
			, controller: 'teacherHakwonAllListController'
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
		/*	선생님 메시지 보내기	*/
		.when('/message/teacherSend', {
			template: hakwonTmpl.message.teacherSendForm
			, controller: 'messageTeacherSendController'
		})
		/*	원장님 메시지 보내기	*/
		.when('/message/masterSend', {
			template: hakwonTmpl.message.masterSendForm
			, controller: 'messageMasterSendController'
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



		/*	반 관련 뷰 ############################################################		*/
		/*	반 전체리스트	*/
		.when('/class/classList', {
			templateUrl: '/js/partials/classList.html'
			, controller: 'classInfoListController'
		})
		/*	반 - 메인, 공지사항 리스트	*/
		.when('/class/noticeList', {
			templateUrl: '/js/partials/classNoticeList.html'
			, controller: 'classNoticeListController'
		})
		/*	반 - 공지사항 상세보기	*/
		.when('/class/noticeDetail', {
			templateUrl: '/js/partials/classNoticeDetail.html'
			, controller: 'classNoticeDetailController'
		})
		/*	반 - 공지사항 작성	*/
		.when('/class/noticeEdit', {
			templateUrl: '/js/partials/classNoticeEdit.html'
			, controller: 'classNoticeEditController'
		})
		/*	반 - 학생 리스트 	*/
		.when('/class/studentList', {
			templateUrl: '/js/partials/classStudentList.html'
			, controller: 'classStudentListController'
		})
		/*	반 - 학부모 리스트	*/
		.when('/class/parentList', {
			templateUrl: '/js/partials/classParentList.html'
			, controller: 'classParentListController'
		})
		/*	반 - 선생님 리스트	*/
		.when('/class/teacherList', {
			templateUrl: '/js/partials/classTeacherList.html'
			, controller: 'classTeacherListController'
		})


		/*	공지사항(학원) ############################################################		*/
		/*	학원 공지사항 리스트	*/
		.when('/notice/list', {
			templateUrl: '/js/partials/hakwonNoticeList.html'
			, controller: 'noticeListController'
		})

		/*	학원 공지사항 상세보기	*/
		.when('/notice/detail', {
			templateUrl: '/js/partials/hakwonNoticeDetail.html'
			, controller: 'noticeDetailController'
		})

		/*	학원 공지사항 등록	*/
		.when('/notice/edit', {
			templateUrl: '/js/partials/hakwonNoticeEdit.html'
			, controller: 'noticeEditController'
		})

		/*	공지 공유 리스트	*/
		.when('/notice/share/sendList', {
			templateUrl: '/js/partials/main/noticeShareSendList.html'
			, controller: 'noticeShareSendListController'
		})

		/*	공지 공유	*/
		.when('/notice/share/send', {
			templateUrl: '/js/partials/main/noticeShareSend.html'
			, controller: 'noticeShareSendController'
		})

		/*	받은 공지 리스트	*/
		.when('/notice/share/receiveList', {
			templateUrl: '/js/partials/main/noticeShareReceiveList.html'
			, controller: 'noticeShareReceiveListController'
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
		/*	학원 배너 광고 등록	*/
		.when('/edBanner/write', {
			template: hakwonTmpl.adBanner.write
			, controller: 'adBannerWriteController'
		})
		/*	학원 배너 광고 수정	*/
		.when('/edBanner/edit', {
			template: hakwonTmpl.adBanner.edit
			, controller: 'adBannerEditController'
		})

		/*	이벤트 ############################################################	*/
		/*	이벤트 리스트	*/
		.when('/event/list', {
			template: hakwonTmpl.event.list
			, controller: 'eventListController'
		})

		/*	이벤트 등록	*/
		.when('/event/write', {
			template: hakwonTmpl.event.write
			, controller: 'eventWriteController'
		})

		/*	이벤트 수정	*/
		.when('/event/edit', {
			template: hakwonTmpl.event.editForm
			, controller: 'eventEditController'
		})

		/*	이벤트 뷰	*/
		.when('/event/view', {
			template: hakwonTmpl.event.viewForm
			, controller: 'eventViewController'
		})

		/*	원장 메뉴############################################################	*/
		/*	학원 생성	*/
		.when('/master/hakwonCreate', {
			template: hakwonTmpl.hakwon.create
			, controller: 'hakwonCreateController'
		})
		/*	학원내 선생님 리스트	*/
		.when('/master/hakwonTeacherList', {
			templateUrl: './js/partials/hakwonTeacherList.html'
			, controller: 'masterTeacherListController'
		})
		/*	가입 요청 선생님	*/
		.when('/master/joinReqTeacherList', {
			template: hakwonTmpl.master.joinReqTeacherList
			, controller: 'masterJoinReqTeacherController'
		})


		/*	선생님 메뉴############################################################	*/
		/*	학원 추가 등록	*/
		.when('/teacher/hakwonRegist', {
			template: hakwonTmpl.teacher.hakwonRegist
			, controller: 'teacherHakwonRegistController'
		})


		/*	학생	##############################################	*/
		/*	학생 리스트	*/
		.when('/student/list', {
			templateUrl:'/js/partials/main/studentList.html'
			, controller: 'studentListController'
		})
		.when('/student/view', {
			templateUrl: '/js/partials/main/studentView.html'
			, controller: 'studentViewController'
		})
		.when('/student/modify', {
			templateUrl: '/js/partials/main/studentModify.html'
			, controller: 'studentModifyController'
		})

		/*	학부모	##############################################	*/
		/*	학부모 리스트	*/
		.when('/parent/list', {
			templateUrl: '/js/partials/parent_list.html'
			, controller: 'parentListController'
		})
		.when('/parent/view', {
			templateUrl: '/js/partials/parent_view.html'
			, controller: 'parentViewController'
		})
		.when('/parent/modify', {
			templateUrl: '/js/partials/main/parentModify.html'
			, controller: 'parentModifyController'
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


		/*	설정	##############################################	*/
		/*	카테고리 리스트	*/
		.when('/setting/noticeCategory', {
			template: hakwonTmpl.setting.noticeCategory.form
			, controller: 'settingNoticeCategoryController'
		})
		/*	매니저 설정	*/
		.when('/setting/manager', {
			templateUrl: '/js/partials/settingManager.html'
			, controller: 'settingManagerController'
		})


		/*	가이드	##############################################	*/
		/*	지도 가이드	*/
		.when('/guide/map', {
			templateUrl: '/js/partials/guideMap.html'
		})
		.when('/guide/daumMap', {
			templateUrl: '/js/partials/guide_03.html'
		})
		/*	youtube 가이드	*/
		.when('/guide/youtube', {
			templateUrl: '/js/partials/guideYoutube.html'
		})


		/*	테스트 ##########################################	*/
		/*	출결 코드 생성	*/
		.when('/attendance/make', {
			templateUrl: '/js/partials/test/attendanceMakeCode.html'
			, controller : 'attendanceMakeController'
		})
		/*	학생별 주간 출결 리스트	*/
		.when('/attendance/attendanceWeekList', {
			templateUrl: '/js/partials/attendanceWeekList.html'
			, controller : 'attendanceWeekListController'
		})
		/*	등원	*/
		.when('/attendance/start', {
			templateUrl: '/js/partials/test/attendanceStart.html'
			, controller : 'attendanceMakeController'
		})
		/*	하원	*/
		.when('/attendance/end', {
			templateUrl: '/js/partials/test/attendanceEnd.html'
			, controller : 'attendanceMakeController'
		})
		/*	수납 등록	*/
		.when('/receipt/insert', {
			templateUrl: '/js/partials/receiptInsert.html'
			, controller : 'receiptController'
		})
		/*	수납 리스트	*/
		.when('/receipt/list', {
			templateUrl: '/js/partials/receiptList.html'
			, controller : 'receiptListController'
		})
		/*	수납 일년간 리스트	*/
		.when('/receipt/listYear', {
			templateUrl: '/js/partials/receiptYearList.html'
			, controller : 'receiptYearListController'
		})
		/*	수납 상세	*/
		.when('/receipt/detail', {
			templateUrl: '/js/partials/receiptDetail.html'
			, controller : 'receiptDetailController'
		})
		/*	상담 등록 */
		.when('/counsel/insert', {
			templateUrl: '/js/partials/counselInsert.html'
			, controller : 'counselInsertController'
		})
		/*	상담 리스트 */
		.when('/counsel/list', {
			templateUrl: '/js/partials/counselList.html'
			, controller : 'counselListController'
		})
		/*	상담 상세	*/
		.when('/counsel/detail', {
			templateUrl: '/js/partials/counselDetail.html'
			, controller : 'counselDetailController'
		})
		/*	상담 수정	*/
		.when('/counsel/update', {
			templateUrl: '/js/partials/counselUpdate.html'
			, controller : 'counselUpdateController'
		})

		.otherwise({
			redirectTo: '/index'
		});
});


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

		/*	학원 변경시	*/
		$('select[name=hakwon_list]').change(function() {
			var hakwon_no = this.value;
			self.hakwonChange(hakwon_no, 'already');
		});
		/*
		$leftMenuNav.on(clickEvent, 'a[data-act=hakwon_change]', function() {
			var hakwon_no = $(this).attr('data-hakwon-no');
			$leftMenuNav.find('div.profile-element').removeClass('open');
			self.hakwonChange(hakwon_no, 'already');
			return false;
		});
		*/

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
			window.location.href = PageUrl.message.receiveMessageList+'?hakwon_no='+hakwonInfo.hakwon_no;
			if( commProto.isResponsiveCheck() ) {
				$('body').removeClass('mini-navbar');
			}
			return false;
		});

		/*	사이드 메뉴 클릭시 이동	*/
		$('#side-menu').on('click', 'li a[data-type=leftMenu]', function() {
			var dataAct = $(this).attr('data-act');
			if (dataAct == 'classList') {
				/*	반 리스트	*/
				window.location.href = PageUrl.common.classList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'noticeList' ) {
				/*	공지 리스트	*/
				window.location.href = PageUrl.common.noticeList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'edBannerList' ) {
				/*	광고 리스트	*/
				window.location.href = PageUrl.common.edBannerList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'hakwonCreate' ) {
				/*	학원 생성	*/
				window.location.href = PageUrl.master.hakwonCreate;
			} else if( dataAct == 'hakwonAllList' ) {
				/*	학원 리스트	*/
				window.location.href = PageUrl.master.hakwonAllList;
			} else if( dataAct == 'teacherHakwonAllList' ) {
				/*	선생님 학원 리스트	*/
				window.location.href = PageUrl.teacher.teacherHakwonAllList;
			} else if( dataAct == 'studentList' ) {
				/*	학생 리스트	*/
				window.location.href = PageUrl.common.studentList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'parentList' ) {
				/*	학부모 리스트	*/
				window.location.href = PageUrl.common.parentList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'joinReqTeacherList' ) {
				/*	가입 요청 선생님	*/
				window.location.href = PageUrl.master.joinReqTeacherList;
			} else if( dataAct == 'hakwonTeacherList' ) {
				/*	가입 요청 선생님	*/
				window.location.href = PageUrl.master.teacherList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'eventLsit' ) {
				/*	이벤트 리스트	*/
				window.location.href = PageUrl.common.eventList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'sendMessageGroupList' ) {
				/*	보낸 그룹 메세지	*/
				window.location.href = PageUrl.message.sendMessageGroupList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'sendMessageSingleList' ) {
				/*	보낸 싱글 메세지	*/
				window.location.href = PageUrl.message.sendMessageSingleList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'receiveMessageList' ) {
				/*	받은 메세지 리스트	*/
				var receiveMessageListQuery = '';
				if( hakwonInfo.hakwon_no ) {
					receiveMessageListQuery = '?hakwon_no='+hakwonInfo.hakwon_no;
				}
				window.location.href = PageUrl.message.receiveMessageList+receiveMessageListQuery;
			} else if( dataAct == 'sendQuestion' ) {
				/*	관리자에게 문의	*/
				window.location.href = PageUrl.message.sendQuestion+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'teacherSendMessage' ) {
				/*	선생님 메세지 보내기	*/
				window.location.href = PageUrl.message.teacherSend+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'masterSendMessage' ) {
				/*	원장님 메세지 보내기	*/
				window.location.href = PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'teacherHakwonRegist' ) {
				/*	원장님 메세지 보내기	*/
				window.location.href = PageUrl.teacher.hakwonRegist+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'settingNoticeCate' ) {
				/*	원장님 셋팅 공지 카테고리	*/
				window.location.href = PageUrl.setting.noticeCategory+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'settingManager' ) {
				/*	원장님 셋팅 매니저	*/
				window.location.href = PageUrl.setting.manager+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'adminQuestion' ) {
				/*	관리자에게 문의 하기	*/
				window.location.href = PageUrl.common.adminQuestionList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'guideMap' ) {
				/*	가이드 지도	*/
//				window.location.href = PageUrl.guide.map+'?hakwon_no='+hakwonInfo.hakwon_no;
				window.location.href = PageUrl.guide.daumMap+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'guideYoutube' ) {
				/*	가이드 유튜브	*/
				window.location.href = PageUrl.guide.youtube+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'attendanceMake' ) {
				/*	출결 코드 생성	*/
				window.location.href = PageUrl.attendance.make + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'attendanceWeekList' ) {
				/*	주간 출결 리스트	*/
				window.location.href = PageUrl.attendance.weekList + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'attendanceStart' ) {
				/*	등원	*/
				window.location.href = PageUrl.attendance.start + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'attendancePop' ) {
				/*	등원,하원 팝업	*/
				window.open('/hakwon/attendance/popup.do?popupType=attend&hakwonNo=' + hakwonInfo.hakwon_no, 'window', 'toolbar=no,location=no,status=no,menubar=no');
			} else if( dataAct == 'attendanceBusPop' ) {
				/*	승차,하차 팝업	*/
				window.open('/hakwon/attendance/popup.do?popupType=bus&hakwonNo=' + hakwonInfo.hakwon_no, 'window', 'toolbar=no,location=no,status=no,menubar=no');
			} else if( dataAct == 'attendanceEnd' ) {
				/*	하원	*/
				window.location.href = PageUrl.attendance.end + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'receiptInsert' ) {
				/*	수납 등록	*/
				window.location.href = PageUrl.receipt.insert + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'receiptList' ) {
				/*	기간별 수납 리스트	*/
				window.location.href = PageUrl.receipt.list + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'receiptYearList' ) {
				/*	학생별 수납 리스트	*/
				window.location.href = PageUrl.receipt.listYear + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'counselInsert' ) {
				/*	상담 등록	*/
				window.location.href = PageUrl.counsel.insert + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'counselListSt' ) {
				/*	학생 상담 리스트	*/
				window.location.href = PageUrl.counsel.list + '?hakwonNo=' + hakwonInfo.hakwon_no + '&type=006';
			} else if( dataAct == 'counselListPa' ) {
				/*	학부모 상담 리스트	*/
				window.location.href = PageUrl.counsel.list + '?hakwonNo=' + hakwonInfo.hakwon_no + '&type=005';

			} else if( dataAct == 'send_notice_share_list' ) {
				/*	공지 공유 리스트	*/
				window.location.href = PageUrl.notice_share.sendList + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'receive_notice_share_list' ) {
				/*	받은 공유 공지 리스트	*/
				window.location.href = PageUrl.notice_share.receiveList + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'send_notice_share' ) {
				/*	공지 공유	*/
				window.location.href = PageUrl.notice_share.send + '?hakwonNo=' + hakwonInfo.hakwon_no;
			}




			if( dataAct && commProto.isResponsiveCheck() ) {
				$('body').removeClass('mini-navbar');
			}

			return false;
		});
	};

	/**
	 * 학원 변경시
	 * hakwonCommon.hakwonChange(hakwon_no);
	 */
	this.hakwonChange = function(hakwon_no, loadType) {

		if( hakwonInfo.hakwonList && hakwonInfo.hakwonList.length > 0 ) {
			hakwonInfo.hakwon_no = hakwon_no;
			for(var i=0; i<hakwonInfo.hakwonList.length; i++) {
				var loopHakwonInfo = hakwonInfo.hakwonList[i];
				if( loopHakwonInfo.hakwon_no == hakwon_no ) {
					hakwonInfo.hakwon_name 		= loopHakwonInfo.hakwon_name;
					hakwonInfo.master_user_no 	= loopHakwonInfo.master_user_no;
					hakwonInfo.logo_path 		= loopHakwonInfo.logo_path;
				}
			}
			if( hakwonInfo.hakwonList.length > 1 ) {
				/*	2개 이상일때	*/
				console.log('hakwonInfo.hakwon_no', hakwonInfo.hakwon_no);

				$('li[data-view=hakwon_list_li] > select').html($.tmpl(hakwonTmpl.leftMenu.hakwonList, hakwonInfo));
				$('li[data-view=hakwon_list_li]').show();
			}
			$topMenuNav.find('div.navbar-header > h1').html('<a href="#main?hakwon_no='+hakwonInfo.hakwon_no+'">'+hakwonInfo.hakwon_name+'</a>');

			if( loadType == 'already' ) {
				window.location.href = PageUrl.main+'?hakwon_no=' + hakwonInfo.hakwon_no;
			} else if( loadType == 'init' ) {
				/**/
				console.log('hakwon_no', hakwon_no);
			} else {
				window.location.href = PageUrl.main+'?hakwon_no=' + hakwonInfo.hakwon_no;
			}
		} else {
			/*	학원 없음	*/
		}
		return false;
	}

	/**
	 * 페이지 로드시 호출
	 * hakwonCommon.pageInit();
	 */
	this.pageInit = function(opts) {
		console.log('hakwonCommon.pageInit', opts);
		if( !opts ) {
			opts = {
				isScrollTop:true
			};
		}

		/*	스크롤 탑	*/
		if( opts.isScrollTop == true ) {
			//$("html, body").animate({ scrollTop : 0 });
			$("html, body").scrollTop(0);
		}

		if( HakwonConstant.ServerType != 'live' ) {
			//console.log("caller is " + arguments.callee.caller.toString());
		}

		if( userAuth.userType == HakwonConstant.UserType.WONJANG || userAuth.userType == HakwonConstant.UserType.TEACHER ) {
		} else {
			/*	사용자 타입이 다르다	*/
			console.error('Error UserType', userAuth);
			commProto.logger({'pageInitFail':'ErrorUserType'});
			window.location = "/logout.do";
			return ;
		}

		var urlHakwonNo = comm.getHashParam('hakwon_no');
		if( $('body').hasClass('skin-1') || $('body').hasClass('skin-3') ) {
			/*	이미 셋팅 되어 있다.	*/
			console.log('already pageInit!');
		} else {
			try {
				console.log('hakwonCommon.pageInit userAuth.userType', userAuth.userType);
				if( userAuth.userType == HakwonConstant.UserType.WONJANG ) {
					$('body').addClass('skin-1');
				} else {
					$('body').addClass('skin-3');
				}

				/*	프로필 셋팅	*/
				$.tmpl(hakwonTmpl.leftMenu.userProfile).appendTo($leftMenuNav.find('div.profile-element'));

				/*	메뉴 셋팅	*/
				if( hakwonInfo.hakwonList.length == 0 ) {
					/*	0번째 학원으로 셋팅	*/
					if( userAuth.userType == HakwonConstant.UserType.WONJANG ) {
						$.tmpl(hakwonTmpl.leftMenu.emptyHakwon).appendTo($leftMenuNav.find('ul#side-menu'));
					} else {
						$.tmpl(hakwonTmpl.leftMenu.emptyHakwonTeacher).appendTo($leftMenuNav.find('ul#side-menu'));
					}
				} else {
					if( userAuth.userType == HakwonConstant.UserType.WONJANG ) {
						$.tmpl(hakwonTmpl.leftMenu.wonjang, {hakwon_no:hakwonInfo.hakwon_no}).appendTo($leftMenuNav.find('ul#side-menu'));
					} else {
						$.tmpl(hakwonTmpl.leftMenu.teacher).appendTo($leftMenuNav.find('ul#side-menu'));
					}

					var sameHakwonNo = undefined;
					for(var i=0; i<hakwonInfo.hakwonList.length; i++) {
						if( hakwonInfo.hakwonList[i].hakwon_no == urlHakwonNo ) {
							sameHakwonNo = urlHakwonNo;
						}
					}
					if( sameHakwonNo ) {
						self.hakwonChange(sameHakwonNo, 'init');
					} else {
						self.hakwonChange(hakwonInfo.hakwonList[0].hakwon_no);
					}
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex, customData:{'location':$location}});
			}
		}

		var userTmpTestAlba = userAuth.userId;
		if( "bumwonjang" == userTmpTestAlba || "icheoneduk" == userTmpTestAlba || location.href.indexOf("teamoboki") > 0) {
			$("#test_li").css("display","");
		}

		$("#wrapper").show();
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

	/**
	 * 사용자 상세 링크
	 */
	this.userDetailLink = function(userType, userNo) {
		var link = '';
		if( HakwonConstant.UserType.WONJANG == userType ) {
		} else if( HakwonConstant.UserType.STUDENT == userType ) {
			link = '#/student/view?hakwon_no='+hakwonInfo.hakwon_no+'&studentUserNo='+userNo;
		} else if( HakwonConstant.UserType.PARENT == userType ) {
			link = '#/parent/view?hakwon_no='+hakwonInfo.hakwon_no+'&parentUserNo='+userNo;
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
 * 헤더 App
 */
var HakwonHeader = function() {
	console.log('HakwonHeader create');

	var $header = $('nav.navbar-static-top');

	var self = this;
	this.onload = function() {
	}


	/**
	 * set header
	 * @viewType user, hakwon
	 */
	this.setHeader = function(viewType) {
		console.log('setHeader call viewType['+viewType+']');
		$header.removeClass();
		if( viewType == 'user' ) {
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
			}
			$header.empty();
			$.tmpl(hakwonTmpl.header.user).appendTo($header);
		} else if( viewType == 'hakwon' ) {
			$header.addClass('type_01');
			$header.empty();
			$.tmpl(hakwonTmpl.header.hakwon).appendTo($header);
		} else {
			$header.addClass('type_02');
			viewType = '';
			$header.empty();
			$.tmpl(hakwonTmpl.header.comm).appendTo($header);
		}
		$header.attr('data-view-type', viewType);
	}
	this.onload();
};
var hakwonHeader = new HakwonHeader();