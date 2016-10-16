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
			templateUrl: function() {
				if( hakwonInfo.hakwonList.length == 0 ) {
					if( userAuth.userType == HakwonConstant.UserType.WONJANG ) {
						return '/assets/partials/main/dashBoardEmptyMaster.html';
					} else {
						return '/assets/partials/main/dashBoardEmptyTeacher.html';
					}
				} else {
					return '/assets/partials/main/dashBoardMain.html';
				}
			}
			, controller: 'mainController'
		})
		/*	임시 베너	*/
		.when('/ban_list', {
			templateUrl: '/assets/partials/main/ban_list.html'
		})
		/*	회원정보	*/
		.when('/memberProfile', {
			templateUrl: '/assets/partials/memberProfile.html'
			, controller: 'memberProfileController'
		})
		/*	회원정보수정	*/
		.when('/memberEdit', {
			templateUrl: '/assets/partials/memberEdit.html'
			, controller: 'memberEditController'
		})
		/*	학원정보 수정	*/
		.when('/hakwonModify', {
			templateUrl: '/assets/partials/hakwonModify.html'
			, controller: 'hakwonModifyController'
		})
		/*	학원소개	*/
		.when('/hakwonIntro', {
			templateUrl: '/assets/partials/hakwonIntro.html'
			, controller: 'hakwonIntroController'
		})
		/*	학원소개 작성-수정	*/
		.when('/hakwonIntroEdit', {
			templateUrl: '/assets/partials/hakwonIntroEdit.html'
			, controller: 'hakwonIntroEditController'
		})
		/*	학원 전체 리스트	*/
		.when('/hakwonAllList', {
			templateUrl: '/assets/partials/hakwonAllList.html'
			, controller: 'hakwonAllListController'
		})
		/*	선생님 학원 전체 리스트	*/
		.when('/teacherHakwonAllList', {
			templateUrl: '/assets/partials/teacherHakwonAllList.html'
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
			templateUrl: '/assets/partials/sentMessage.html'
			, controller: 'sentMessageController'
		})
		/*	선생님 메시지 보내기	*/
		.when('/message/teacherSend', {
			template: hakwonTmpl.message.teacherSendForm
			, controller: 'messageTeacherSendController'
		})
		/*	원장님 메시지 보내기	*/
		.when('/message/masterSend', {
			templateUrl: '/assets/partials/message/messageSendMaster.html'
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
			//template: hakwonTmpl.messageView.viewForm
			templateUrl: '/assets/partials/message/messageGroupSendDetail.html'
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
			templateUrl: '/assets/partials/class/class_list.html'
			, controller: 'classInfoListController'
		})
		/*	반 - 메인, 공지사항 리스트	*/
		.when('/class/noticeList', {
			templateUrl: '/assets/partials/class/class_notice_list.html'
			, controller: 'classNoticeListController'
		})
		/*	반 - 공지사항 상세보기	*/
		.when('/class/noticeDetail', {
			templateUrl: '/assets/partials/class/class_notice_detail.html'
			, controller: 'classNoticeDetailController'
		})
		/*	반 - 공지사항 작성	*/
		.when('/class/noticeEdit', {
			templateUrl: '/assets/partials/class/class_notice_edit.html'
			, controller: 'classNoticeEditController'
		})
		/*	반 - 학생 리스트 	*/
		.when('/class/studentList', {
			templateUrl: '/assets/partials/class/class_student_list.html'
			, controller: 'classStudentListController'
		})
		/*	반 - 학부모 리스트	*/
		.when('/class/parentList', {
			templateUrl: '/assets/partials/class/class_parent_list.html'
			, controller: 'classParentListController'
		})
		/*	반 - 선생님 리스트	*/
		.when('/class/teacherList', {
			templateUrl: '/assets/partials/class/class_teacher_list.html'
			, controller: 'classTeacherListController'
		})


		/*	공지사항(학원) ############################################################		*/
		/*	학원 공지사항 리스트	*/
		.when('/notice/list', {
			templateUrl: '/assets/partials/hakwonNoticeList.html'
			, controller: 'noticeListController'
		})

		/*	학원 공지사항 상세보기	*/
		.when('/notice/detail', {
			templateUrl: '/assets/partials/hakwonNoticeDetail.html'
			, controller: 'noticeDetailController'
		})

		/*	학원 공지사항 등록	*/
		.when('/notice/edit', {
			templateUrl: '/assets/partials/hakwonNoticeEdit.html'
			, controller: 'noticeEditController'
		})

		/*	공지 공유 리스트	*/
		.when('/notice/share/sendList', {
			templateUrl: '/assets/partials/notice_share/noticeShareSendList.html'
			, controller: 'noticeShareSendListController'
		})

		/*	공지 공유	*/
		.when('/notice/share/send', {
			templateUrl: '/assets/partials/notice_share/noticeShareSend.html'
			, controller: 'noticeShareSendController'
		})

		/*	받은 공지 리스트	*/
		.when('/notice/share/receiveList', {
			templateUrl: '/assets/partials/notice_share/noticeShareReceiveList.html'
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
			templateUrl: './assets/partials/hakwonTeacherList.html'
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
			templateUrl:'/assets/partials/student/student_list.html'
			, controller: 'studentListController'
		})
		.when('/student/view', {
			templateUrl: '/assets/partials/student/student_view.html'
			, controller: 'studentViewController'
		})
		.when('/student/modify', {
			templateUrl: '/assets/partials/student/student_modify.html'
			, controller: 'studentModifyController'
		})

		/*	학부모	##############################################	*/
		/*	학부모 리스트	*/
		.when('/parent/list', {
			templateUrl: '/assets/partials/parent/parent_list.html'
			, controller: 'parentListController'
		})
		.when('/parent/view', {
			templateUrl: '/assets/partials/parent/parent_view.html'
			, controller: 'parentViewController'
		})
		.when('/parent/modify', {
			templateUrl: '/assets/partials/parent/parent_modify.html'
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
			templateUrl: '/assets/partials/admin_question/admin_question_write.html'
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
			templateUrl: '/assets/partials/setting/manager.html'
			, controller: 'settingManagerController'
		})
		.when('/setting/excelRegist', {
			templateUrl: '/assets//partials/setting/excel_regist.html'
			, controller: 'settingExcelRegistController'
		})


		/*	학생별 주간 출결 리스트	*/
		.when('/attendance/attendanceWeekList', {
			templateUrl: '/assets/partials/attendanceWeekList.html'
			, controller : 'attendanceWeekListController'
		})

		/*	가이드	##############################################	*/
		/*	지도 가이드	*/
		.when('/guide/map', {
			templateUrl: '/assets/partials/guideMap.html'
		})
		.when('/guide/daumMap', {
			templateUrl: '/assets/partials/guide_03.html'
		})
		/*	youtube 가이드	*/
		.when('/guide/youtube', {
			templateUrl: '/assets/partials/guideYoutube.html'
		})

		/*	수납 등록	*/
		.when('/receipt/insert', {
			templateUrl: '/assets/partials/receipt/receipt_insert.html'
			, controller : 'receiptController'
		})
		/*	수납 리스트	*/
		.when('/receipt/list', {
			templateUrl: '/assets/partials/receipt/receipt_list.html'
			, controller : 'receiptListController'
		})
		/*	수납 일년간 리스트	*/
		.when('/receipt/listYear', {
			templateUrl: '/assets/partials/receipt/receipt_year_list.html'
			, controller : 'receiptYearListController'
		})
		/*	수납 상세	*/
		.when('/receipt/detail', {
			templateUrl: '/assets/partials/receipt/receipt_detail.html'
			, controller : 'receiptDetailController'
		})

		/*	상담 등록 */
		.when('/counsel/insert', {
			templateUrl: '/assets/partials/counsel/counsel_insert.html'
			, controller : 'counselInsertController'
		})
		/*	상담 리스트 */
		.when('/counsel/list', {
			templateUrl: '/assets/partials/counsel/counsel_list.html'
			, controller : 'counselListController'
		})
		/*	상담 상세	*/
		.when('/counsel/detail', {
			templateUrl: '/assets/partials/counsel/counsel_detail.html'
			, controller : 'counselDetailController'
		})
		/*	상담 수정	*/
		.when('/counsel/update', {
			templateUrl: '/assets/partials/counsel/counsel_update.html'
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
			console.debug('leftMenu dataAct['+dataAct+']');

			var moveLeftLocation = undefined;
			if (dataAct == 'classList') {
				/*	반 리스트	*/
				moveLeftLocation = PageUrl.common.classList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'noticeList' ) {
				/*	공지 리스트	*/
				moveLeftLocation = PageUrl.common.noticeList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'edBannerList' ) {
				/*	광고 리스트	*/
				moveLeftLocation = PageUrl.common.edBannerList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'hakwonCreate' ) {
				/*	학원 생성	*/
				moveLeftLocation = PageUrl.master.hakwonCreate;
			} else if( dataAct == 'hakwonAllList' ) {
				/*	학원 리스트	*/
				moveLeftLocation = PageUrl.master.hakwonAllList;
			} else if( dataAct == 'teacherHakwonAllList' ) {
				/*	선생님 학원 리스트	*/
				moveLeftLocation = PageUrl.teacher.teacherHakwonAllList;
			} else if( dataAct == 'studentList' ) {
				/*	학생 리스트	*/
				moveLeftLocation = PageUrl.common.studentList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'parentList' ) {
				/*	학부모 리스트	*/
				moveLeftLocation = PageUrl.common.parentList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'joinReqTeacherList' ) {
				/*	가입 요청 선생님	*/
				moveLeftLocation = PageUrl.master.joinReqTeacherList;
			} else if( dataAct == 'hakwonTeacherList' ) {
				/*	가입 요청 선생님	*/
				moveLeftLocation = PageUrl.master.teacherList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'eventLsit' ) {
				/*	이벤트 리스트	*/
				moveLeftLocation = PageUrl.common.eventList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'sendMessageGroupList' ) {
				/*	보낸 그룹 메세지	*/
				moveLeftLocation = PageUrl.message.sendMessageGroupList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'sendMessageSingleList' ) {
				/*	보낸 싱글 메세지	*/
				moveLeftLocation = PageUrl.message.sendMessageSingleList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'receiveMessageList' ) {
				/*	받은 메세지 리스트	*/
				var receiveMessageListQuery = '';
				if( hakwonInfo.hakwon_no ) {
					receiveMessageListQuery = '?hakwon_no='+hakwonInfo.hakwon_no;
				}
				moveLeftLocation = PageUrl.message.receiveMessageList+receiveMessageListQuery;
			} else if( dataAct == 'sendQuestion' ) {
				/*	관리자에게 문의	*/
				moveLeftLocation = PageUrl.message.sendQuestion+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'teacherSendMessage' ) {
				/*	선생님 메세지 보내기	*/
				moveLeftLocation = PageUrl.message.teacherSend+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'masterSendMessage' ) {
				/*	원장님 메세지 보내기	*/
				moveLeftLocation = PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'teacherHakwonRegist' ) {
				/*	원장님 메세지 보내기	*/
				moveLeftLocation = PageUrl.teacher.hakwonRegist+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'settingNoticeCate' ) {
				/*	원장님 셋팅 공지 카테고리	*/
				moveLeftLocation = PageUrl.setting.noticeCategory+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'settingManager' ) {
				/*	원장님 셋팅 매니저	*/
				moveLeftLocation = PageUrl.setting.manager+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'settingExcelRegist' ) {
				/*	원장님 셋팅 엑셀 회원 등록	*/
				moveLeftLocation = PageUrl.setting.excelRegist+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'adminQuestion' ) {
				/*	관리자에게 문의 하기	*/
				moveLeftLocation = PageUrl.common.adminQuestionList+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'guideMap' ) {
				/*	가이드 지도	*/
				moveLeftLocation = PageUrl.guide.daumMap+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'guideYoutube' ) {
				/*	가이드 유튜브	*/
				moveLeftLocation = PageUrl.guide.youtube+'?hakwon_no='+hakwonInfo.hakwon_no;
			} else if( dataAct == 'attendanceMake' ) {
				/*	출결 코드 생성	*/
				moveLeftLocation = PageUrl.attendance.make + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'attendanceWeekList' ) {
				/*	주간 출결 리스트	*/
				moveLeftLocation = PageUrl.attendance.weekList + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'attendanceStart' ) {
				/*	등원	*/
				moveLeftLocation = PageUrl.attendance.start + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'attendancePop' ) {
				/*	등원,하원 팝업	*/
				if( window.PLATFORM && comm.getAppVersion() >= 1321 ) {
					window.location = '/hakwon/attendance/popup.do?popupType=attend&hakwonNo=' + hakwonInfo.hakwon_no;
				} else {
					window.open('/hakwon/attendance/popup.do?popupType=attend&hakwonNo=' + hakwonInfo.hakwon_no, 'window', 'toolbar=no,location=no,status=no,menubar=no');					
				}
			} else if( dataAct == 'attendanceBusPop' ) {
				/*	승차,하차 팝업	*/
				if( window.PLATFORM && comm.getAppVersion() >= 1321 ) {
					window.location = '/hakwon/attendance/popup.do?popupType=bus&hakwonNo=' + hakwonInfo.hakwon_no;
				} else {
					window.open('/hakwon/attendance/popup.do?popupType=bus&hakwonNo=' + hakwonInfo.hakwon_no, 'window', 'toolbar=no,location=no,status=no,menubar=no');					
				}
			} else if( dataAct == 'attendanceEnd' ) {
				/*	하원	*/
				moveLeftLocation = PageUrl.attendance.end + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'receiptInsert' ) {
				/*	수납 등록	*/
				moveLeftLocation = PageUrl.receipt.insert + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'receiptList' ) {
				/*	기간별 수납 리스트	*/
				moveLeftLocation = PageUrl.receipt.list + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'receiptYearList' ) {
				/*	학생별 수납 리스트	*/
				moveLeftLocation = PageUrl.receipt.listYear + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'counselInsert' ) {
				/*	상담 등록	*/
				moveLeftLocation = PageUrl.counsel.insert + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'counselListSt' ) {
				/*	학생 상담 리스트	*/
				moveLeftLocation = PageUrl.counsel.list + '?hakwonNo=' + hakwonInfo.hakwon_no + '&type=006';
			} else if( dataAct == 'counselListPa' ) {
				/*	학부모 상담 리스트	*/
				moveLeftLocation = PageUrl.counsel.list + '?hakwonNo=' + hakwonInfo.hakwon_no + '&type=005';

			} else if( dataAct == 'send_notice_share_list' ) {
				/*	공지 공유 리스트	*/
				moveLeftLocation = PageUrl.notice_share.sendList + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'receive_notice_share_list' ) {
				/*	받은 공유 공지 리스트	*/
				moveLeftLocation = PageUrl.notice_share.receiveList + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else if( dataAct == 'send_notice_share' ) {
				/*	공지 공유	*/
				moveLeftLocation = PageUrl.notice_share.send + '?hakwonNo=' + hakwonInfo.hakwon_no;
			}

			console.debug('left move moveLeftLocation : ' + moveLeftLocation);
			if( moveLeftLocation ) {
				window.location.href = moveLeftLocation;
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
		}

		if( userAuth.userType == HakwonConstant.UserType.WONJANG || userAuth.userType == HakwonConstant.UserType.TEACHER ) {
		} else if( userAuth.userType == HakwonConstant.UserType.STUDENT || userAuth.userType == HakwonConstant.UserType.PARENT ) {
			window.location = "https://m.hakwonband.com/index.do#/userMain";
			return ;
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
			$("li.test_li").css("display","");
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