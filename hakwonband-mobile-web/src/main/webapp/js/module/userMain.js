/**
 * 사용자 메인 서비스
 */
angular.module('hakwonApp').service('userMainService', function($http, $window) {
	console.log('userMainService call');

	var userMainService = {};

	userMainService.getUserMainInfo = function (params, callback) {

		var queryString = $.param(params, true);

		$http({
			withCredentials: false,
			method: 'post',
			url: contextPath + '/mobile/main/firstView.do',
			headers: angularHeaders,
			data: queryString
		}).then(function(res) {
			var colData = res.data.colData;
			if( colData ) {
				callback(colData);
			} else {
				commProto.logger({loginError:colData});
			}
		}, function(res) {
			console.error('fail', res);
		});
	};

	userMainService.editApproved = function(params, callback) {
		var queryString = $.param(params, true);
		$http({
			withCredentials: false,
			method: 'post',
			url: contextPath + '/mobile/main/editApproved.do',
			headers: angularHeaders,
			data: queryString
		}).then(function(res) {
			var colData = res.data.colData;
			if (res.status === 200 && colData) {
				callback(colData);
			} else {
				commProto.logger({loginError:colData});
			}
		}, function(res) {
			console.error('fail', res);
		});
	};

	userMainService.searchStudentById = function(id, callback) {
		var queryString = $.param({user_id:id}, true);
		$http({
			withCredentials: false,
			method: 'post',
			url: contextPath + '/mobile/main/searchStudent.do',
			headers: angularHeaders,
			data: queryString
		}).then(function(res) {
			if (res.status === 200) {
				var colData = res.data && res.data.colData;
				callback(colData);
			} else {
				commProto.logger({loginError:colData});
			}

			callback(colData);
		}, function(res) {
			console.error('fail', res);
		});
	};

	userMainService.putApproved = function(studentNo, callback) {
		var queryString = $.param({student_user_no:studentNo}, true);
		$http({
			withCredentials: false,
			method: 'post',
			url: contextPath + '/mobile/main/putApproved.do',
			headers: angularHeaders,
			data: queryString
		}).then(function(res) {
			var colData = res.data.colData;
			if (res.status === 200 && colData) {
				callback(colData);
			} else {
				commProto.logger({loginError:colData});
			}
		}, function(res) {
			console.error('fail', res);
		});
	};

	return userMainService;
});

/*	사용자 메인  */
angular.module('hakwonApp').controller('userMainController', function($scope, $location, $window, $routeParams, userMainService, CommUtil){
	console.log('userMainController call', $location);
	try {
		/*  인증 정보 체크  */
		comm.authCheckFilter();
		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({viewType:'user'});

		/*	인증 정보	*/
		$scope.userAuth = userAuth;

		$scope.siteUrls = MENUS.sharpUrls;
		$scope.userType = userAuth.userType;
		$scope.isSearch = false;
		$scope.createFileFullPath = CommUtil.createFileFullPath;

		$scope.openPopup = function() {
			$('#first_popup').fadeIn(500);
		};

		$scope.closePopup = function() {
			$('#first_popup').fadeOut(500, function() {
				$('#first_popup_movie').remove();
			});
		};

		$scope.receiveMessageObj = {};

		$scope.isMessage = false;

		$scope.isNewItem = comm.isNewItem;

		if( $routeParams.isFirst == 'true' ) {
			$scope.openPopup();
		}

		/*	받은메세지 리스트 호출 	*/
		$scope.userMain = function() {
			var params = {hakwon_no:'9', page_no:'1'};

			userMainService.getUserMainInfo(params, function(colData) {
				$scope.hakwonList	= colData.hakwonList;
				var lmsObj = {
					type:'custom'
					, img_src : '/assets/images/lms.jpg'
					, hakwon_name : '학습 스토어'
					, link : 'https://lms.hakwonband.com'
				};
				$scope.hakwonList.unshift(lmsObj);

				$scope.messageList	= colData.messageList;
				$scope.noticeList	= colData.notisList;
				$scope.eventList	= colData.eventList;
				if( colData.approvedYnList ) {
					$scope.approvedYn	= colData.approvedYnList;
				}

				if( window.location.hash == '#/userMain/notice' ) {
					setTimeout(function() {
						$('html, body').animate({
							scrollTop: $("section[name=main_notice]").offset().top
						}, 100);
					}, 200);
				}
			});
		};

		/*	학원 검색	*/
		$scope.hakwonSearch = function() {
			window.location.href = MENUS.sharpUrls.hakwonSearch;
		}

		$scope.acceptParent = function(parentNo, parentName) {
			var params = {parent_user_no:parentNo, approved:'y'};
			if(!confirm('"'+parentName+'"님의 학부모 신청을 수락 하시겠습니까?')) {
				return;
			}

			userMainService.editApproved(params, function(colData) {
				if (colData.approved === 'ok' && colData.resultInt > 0) {
					alert('학부모 신청을 수락했습니다.');
					comm.familyList();//	학부모 리스트 갱신
					$scope.approvedYn = _.reject($scope.approvedYn, function(item) {
						return item.parent_user_no === parentNo;
					});
				} else {
					alert('수락처리 중 문제가 발생했습니다.\n다시 시도해 주세요.');
				}
			});
		};

		$scope.refuseParent = function(parentNo, parentName) {
			var params = {parent_user_no:parentNo, approved:'n'};
			if(!confirm('"'+parentName+'"님의 학부모 신청을 거절 하시겠습니까?')) {
				return;
			}

			userMainService.editApproved(params, function(colData) {
				if (colData.approved === 'no' && colData.resultInt > 0) {
					alert('학부모 신청을 거절했습니다.');
					$scope.approvedYn = _.reject($scope.approvedYn, function(item) {
						return item.parent_user_no === parentNo;
					});
				} else {
					alert('거철처리 중 문제가 발생했습니다.\n다시 시도해 주세요.');
				}
			});
		};

		$scope.searchStudent = function(e) {
			if (e && e.type === 'keydown' && e.keyCode !== 13) {
				return;
			}

			var studentId = $('.sec_search [name=student_id]').val().trim();
			if (studentId === '') {
				alert('학생 아이디를 입력하세요.');
				return;
			}
			userMainService.searchStudentById(studentId, function(colData) {
				$scope.isSearch = true;
				$scope.searchResult = colData.studentData;
				$scope.regStatus = colData.status;
			});
		};

		$scope.checkEmpty = function() {
			var studentId = $('.sec_search [name=student_id]').val().trim();
			if (!studentId) {
				$scope.searchResult = [];
				$scope.isSearch = false;
			}
		};

		$scope.imYourFather = function(studentNo, studentName) {
			if(!confirm('"'+studentName+'님의 학부모로 신청하시겠습니까?')) {
				return;
			}

			userMainService.putApproved(studentNo, function(colData) {
				if (colData.resultInt > 0) {
					alert('학부모 신청이 완료되었습니다.');
					$('.sec_search [name=student_id]').val('');
					$scope.isSearch = false;
					delete $scope.searchResult;
				} else {
					alert('신청 처리 중 문제가 발생했습니다.\n다시 시도해 주세요.');
				}
			});
		};

		$scope.$$postDigest(function() {
			comm.screenInit();

			if( !userAuth.userName ) {
				if( window.confirm('사용자 이름을 등록하시겠습니까?') ) {
					window.location.href = MENUS.sharpUrls.memberModify;
				}
			}

			$scope.userMain();
		});

		if( window.PLATFORM && !userAuth.deviceAuth ) {
			/*	android 이면서 디바이스 인증정보 없을시	*/
			var newKey = window.PLATFORM.getGcmKey();
			setPushNotiKey(newKey, CommonConstant.DeviceType.android, '', function(data) {
				if( data.flag == 'success' ) {
					userAuth.deviceAuth = {
						device_type : colData.authUserInfo.device_type
						, device_token : colData.authUserInfo.device_token
					};
				}
			});
		} else if( getBrowser() == 'iosApp' && !userAuth.deviceAuth ) {
			/*	ios 푸시키 요청	*/
			//window.location = 'hakwonband://notification/getToken';
		}

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});