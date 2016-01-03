
/**
 * 원장 서비스
 */
hakwonMainApp.service('masterService', function(CommUtil) {
	console.log('hakwonMainApp masterService call');

	var masterService = {};

	/**
	 * 학원 선생님 리스트
	 */
	masterService.getHakwonTeacherList = function($scope, pageNo) {
		if (isNull($scope.hakwonNo)) {
			alert('학원 번호가 올바르지 않습니다.');
			return ;
		}
		var params = {};
		params.page_no = !isNull(pageNo) ? pageNo : '1';
		params.hakwon_no = $scope.hakwonNo;

		CommUtil.ajax({url:contextPath+"/hakwon/master/masterTeacherListAll.do", param:params, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData ) {
					$scope.teacherList = colData.content;
					if (0 < parseInt(colData.count)) $scope.isTeachers = true;
					$scope.pageInfo = CommUtil.getPagenationInfo(colData.count, colData.pageScale, DefaultInfo.pageScale, $scope.page);
				} else {
					commProto.logger({masterTeacherListAllError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/**
	 * 담당 과목 수정
	 */
	masterService.editSubject = function($scope, item) {
		var params = {};
		params.hakwon_no		= item.hakwon_no;
		params.teacher_user_no	= item.user_no;
		params.subject			= item.tempSubject;

		if (isNull(params.hakwon_no) || isNull(params.teacher_user_no)) {
			alert('선생님 정보가 올바르지 않습니다.');
			return;
		}

		CommUtil.ajax({url:contextPath+"/hakwon/master/updateTeacherSubject.do", param:params, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData.result == CommonConstant.Flag.success ) {
					alert('담당과목이 수정되었습니다.');
					masterService.getHakwonTeacherList($scope, $scope.page);
				} else {
					commProto.logger({masterTeacherListAllError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	}

	/**
	 * 가입 요청 선생님 리스트
	 */
	masterService.joinReqTeacherList = function() {
		$.ajax({
			url: contextPath+"/hakwon/master/unauthorizedTeacherList.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;

					if( colData && colData.dataList && colData.dataList.length > 0 ) {
						$('div[data-view=data-view]').removeClass('text-center').css('padding', '');
						$('div[data-view=data-view]').html($.tmpl(hakwonTmpl.master.joinReqTeacherRow, colData));
					} else {
						$('div[data-view=data-view]').addClass('text-center').css('padding', '200px 0;');
						$('div[data-view=data-view]').html("가입 요청한 선생님이 없습니다.");
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/**
	 * 선생님 가입 요청 승인 처리
	 */
	masterService.approvedTeacher = function(teacherUserNo, hakwonNo) {
		var param = {teacherUserNo:teacherUserNo, hakwonNo:hakwonNo};
		$.ajax({
			url: contextPath+"/hakwon/master/approvedTeacher.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('선생님 가입 요청을 실패 했습니다.');
						return ;
					}
					var colData = data.colData;

					if( colData.flag == CommonConstant.Flag.success ) {
						$('div[data-target=teacher_'+teacherUserNo+'_'+hakwonNo+']').remove();
					} else {
						alert('선생님 가입 요청을 실패 했습니다.');
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/**
	 * 선생님 학원 탈퇴
	 */
	masterService.hakwonTeacherOut = function(teacherUserNo, hakwonNo) {
		var param = {teacherUserNo:teacherUserNo, hakwonNo:hakwonNo};

		var message = $('textarea[name=teacherOutMessage]').val();
		if( isNull(message) ) {
			alert('선생님께 보낼 메세지를 입력해 주세요.');
			return ;
		}
		param.message = message;

		$.ajax({
			url: contextPath+"/hakwon/master/teacherOut.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('선생님 탈퇴를 실패 했습니다.');
						return ;
					}
					var colData = data.colData;

					if( colData.flag == CommonConstant.Flag.success ) {
						$('#teacher_out_layer').modal('hide');
						window.location.href = PageUrl.master.teacherList+'?hakwon_no='+hakwonNo+"&"+new Date().toString();
					} else {
						alert('선생님 탈퇴를 실패 했습니다.');
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	return masterService;
});

/**
 * 가입 요청 선생님 리스트
 */
hakwonMainApp.controller('masterJoinReqTeacherController', function($scope, $location, $routeParams, masterService, CommUtil) {
	console.log('hakwonMainApp masterJoinReqTeacherController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'선생님'}, {url:'#', title:'가입 요청 선생님 리스트'}]);

		/**
		 * 승인 처리
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=approved]', function() {
			var teacherUserNo	= $(this).attr('data-user-no');
			var hakwonNo		= $(this).attr('data-hakwon-no');
			var hakwonName	= $(this).attr('data-hakwon-name');
			var userName	= $(this).attr('data-user-name');

			if( window.confirm(userName+'님의 '+hakwonName+'가입을 승인 하시겠습니까?') ) {
				masterService.approvedTeacher(teacherUserNo, hakwonNo);
			}
		});

		$("#wrapper").show();
		$scope.$on('$viewContentLoaded', function() {
			masterService.joinReqTeacherList();
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 학원내 선생님 리스트 컨트롤러
 */
hakwonMainApp.controller('masterTeacherListController', function($scope, $location, $routeParams, masterService, CommUtil) {
	console.log('hakwonMainApp masterTeacherListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'선생님'}, {url:'#', title:'선생님 리스트'}]);

		$("#wrapper").show();

		$scope.page = 1;

		var hakwonNo = $routeParams.hakwon_no;
		$scope.hakwonNo = hakwonNo;

		/*	학원 선생님 리스트 조회	*/
		masterService.getHakwonTeacherList($scope, $scope.page);

		$scope.teacherList = [];
		$scope.isTeachers = false;

		$scope.getFileFullPath = function(photoFile) {
			return CommUtil.createFileFullPath(photoFile, 'photo');
		};

		$scope.getUserGender = function(gender) {
			return CommUtil.createGenderName(gender);
		};

		/*	담당과목 수정	*/
		$scope.editSubject = function(item) {
			masterService.editSubject($scope, item);
		};

		/*	메세지 보내기	*/
		$scope.sendMessage = function(item) {
			if (isNull(item)) {
				alert('선택된 선생님 정보가 올바르지 않습니다.');
				return false;
			} else {
				window.location.href = PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+item.user_no;
			}
		};

		/*	선택완료 : 선택된 선생님들에게 메세지 보내기	*/
		$scope.sendMessageSelectedTeacher = function() {
			// 선택된 선생님 리스트만 필터링
			var selectedTeacherList = _.filter(_.clone($scope.teacherList), function(item){
				return item.isSelected == true;
			});

			if (selectedTeacherList.length <= 0) {
				alert('선택된 선생님이 없습니다.');
				return false;
			} else {

				/*	todo : 메세지 발송 페이지로 선생님 리스트 전송	*/

			}
		};

		/*	학원내 모든 선생님에게 단체 메세지 보내기	*/
		$scope.sendMessageAllTeacher = function() {
			alert('단체 메세지 발송은 준비중입니다.');

			if (isNull($scope.hakwonNo)) {
				alert('학원 정보가 올바르지 않습니다');
				return false;
			} else {
				/*	todo : 메세지 발송 페이지로 학원번호 전송	*/
			}
		};

		/*	선생님 탈퇴 레이어	*/
		$scope.hakwonTeacherOut = function(teacher_user_no) {
			$('#teacher_out_layer').modal('show');
			$('button[data-act=teacherOutAct]').attr('teacher_user_no', teacher_user_no);
		}
		/*	탈퇴 실행	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=teacherOutAct]', function() {
			var teacher_user_no = $(this).attr('teacher_user_no');
			masterService.hakwonTeacherOut(teacher_user_no, hakwonNo);
		});

		/*	페이지네이션 페이지 이동	*/
		$scope.movePage = function(page) {
			if ($scope.page === page) {
				return;
			}
			$scope.page = page;
			masterService.getHakwonTeacherList($scope, $scope.page);
		};

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});