
/**
 * 회원정보 서비스
 */
hakwonMainApp.service('memberService', function() {
	console.log('hakwonMainApp memberService call');

	var memberService = {};

	/*  영문, 숫자 검증  */
	memberService.checkEngNumComb = function(value) {
		var numberExp = new RegExp('^.*[0-9].*$');
		var strExp = new RegExp('^.*[A-Za-z].*$');
		return !numberExp.test(value) || !strExp.test(value);
	};

	/*  이메일 검증  */
	memberService.checkEmailValidation = function(email) {
		if (isNull(email)) {
			alert('이메일을 입력해 주세요.');
			return false;
		}

		var emailExp = new RegExp('^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$');
		if (!emailExp.test(email)) {
			alert('이메일을 형식에 맞게 입력해주세요.');
			return false;
		}

		return true;
	};

	/*  비밀번호 검증  */
	memberService.checkPwdValidation = function(pwd, message) {
		message = message || '비밀번호를';
		if (isNull(pwd)) {
			alert(message + ' 입력해 주세요.');
			return false;
		}

		if (pwd.length < 8 || memberService.checkEngNumComb(pwd)) {
			alert(message + '8자 이상의 영문/숫자 조합으로 입력해주세요.');
			return false;
		}

		return true;
	};

	/*  완료버튼시 가입자 전체정보 검증처리  */
	memberService.validateMemberEdit = function($scope) {

		if( $scope.is_pwd_change == true && (!isNull($scope.memberObj.user_password) || !isNull($scope.memberObj.chk_password)) ) {
			if (!memberService.checkPwdValidation($scope.memberObj.user_password)) {
				$scope.checkUserPwd1 = false;
				$('input[name=userPassword]').focus();
				return;
			} else {
				$scope.checkUserPwd1 = true;
			}

			if (!memberService.checkPwdValidation($scope.memberObj.chk_password, '비밀번호 확인을')) {
				$scope.checkUserPwd2 = false;
				$('input[name=pwdConfirm]').focus();
				return;
			} else {
				$scope.checkUserPwd2 = true;
			}

			if ($scope.memberObj.user_password !== $scope.memberObj.chk_password) {
				alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
				$('input[name=pwdConfirm]').focus();
				$scope.checkUserPwd2 = false;
				return;
			} else {
				$scope.checkUserPwd2 = true;
			}
		}

		if (isNull($scope.memberObj.user_name)) {
			alert('이름을 입력해 주세요.');
			$('input[name=userName]').focus();
			return;
		}

		if (isNull($scope.memberObj.user_birthday)) {
			alert('생년월일을 입력해 주세요.');
			$('input[name=userBirthday]').focus();
			return;
		} else {
			$scope.memberObj.update_user_birthday = moment($scope.memberObj.user_birthday).format('YYYY-MM-DD');
		}

		if (isNull($scope.memberObj.tel1_no)) {
			alert('전화번호를 입력해 주세요.');
			$('input[name=userPhone]').focus();
			return;
		}

		if (!memberService.checkEmailValidation($scope.memberObj.user_email)) {
			$scope.checkEmail = 'exist';
			return;
		} else {
			$scope.checkEmail = 'notexist';
		}

		/*	기존 이메일주소의 변경 체크	*/
		if ($scope.oldEmail != $scope.memberObj.user_email) {
			if ($scope.changeEmail) {
				alert('이메일 중복확인을 해주세요.');
				$scope.changeEmail = true;
				$('input[name=userEmail]').focus();
				return ;
			} else {
				$scope.changeEmail = false;
			}
		} else {
			$scope.checkEmail = true;
		}

		/*	이메일 중복체크	*/
		if (isNull($scope.checkEmail) || $scope.checkEmail == 'exist') {
			alert('이메일 중복확인을 해주세요.');
			$('input[name=userEmail]').focus();
			$scope.checkEmail = 'exist';
			return;
		} else {
			$scope.checkEmail = 'notexist';
		}

		return true;
	};


	memberService.getPhotoUploadOptions = function ($scope) {

		// 파일 업로드 객체 생성
		var memberPhotoUploadOptions = new UploadOptions();
		memberPhotoUploadOptions.customExtraFields = {'uploadType' : CommonConstant.File.TYPE_PROFILE};
		memberPhotoUploadOptions.onFinish = function(event, total) {
			if (this.errorFileArray.length + this.errorCount > 0) {
				alert('회원 프로필 사진 업로드를 실패 했습니다.');
			} else {
				/********************
				 * fileNo
				 * filePath
				 * thumbFilePath
				 * fileName
				 * imageYn
				 ********************/
				for (var i = 0; i < this.uploadFileArray.length; i++) {
					var fileInfo = this.uploadFileArray[i];
					if (fileInfo.imageYn == 'Y') {
						$scope.memberObj.photo_file_path = fileInfo.filePath;
						$('div.profile-element > img').attr('src', HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.filePath+"_thumb");
						$scope.$digest();
					} else {
						alert('이미지 파일이 아닙니다.');
					}
				}
			}
		};

		return memberPhotoUploadOptions;
	};

	/*	회원 탈퇴	*/
	memberService.memberOut = function () {
		$.ajax({
			url: contextPath+"/hakwon/memberOut.do",
			type: "post",
			async : false,
			dataType: "json",
			success: function(data) {
				if( data.error ) {
					alert('회원 탈퇴를 실패 했습니다.');
					return false;
				}
				var colData = data.colData;
				if( colData && colData.flag == CommonConstant.Flag.success ) {
					window.location = '/logout.do';
				} else {
					alert('회원 탈퇴를 실패 했습니다.');
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('회원 탈퇴를 실패 했습니다.');
			}
		});
	};


	/**
	 * 알림 off
	 */
	memberService.alarmOff = function(offTime, callback) {
		$.ajax({
			url: contextPath+"/hakwon/alarmOff.do",
			type: "post",
			async : false,
			dataType: "json",
			data : {alarm_off_time:offTime},
			success: function(data) {
				if( data.error ) {
					alert('알림 일시 정지를 실패 했습니다.');
					return false;
				}
				var colData = data.colData;
				if( colData && colData.flag == CommonConstant.Flag.success ) {
					if( callback ) {
						callback(colData.offTime);
					}
				} else {
					alert('알림 일시 정지를 실패 했습니다.');
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('알림 일시 정지를 실패 했습니다.');
			}
		});
	};

	return memberService;
});


/**
 * 회원 프로필 컨트롤러
 */
hakwonMainApp.controller('memberProfileController', function($scope, $location, $routeParams, memberService, CommUtil) {
	console.log('hakwonMainApp memberProfileController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		console.log($routeParams);

		$scope.userType 	= userAuth.userType;
		$scope.userNo 		= userAuth.userNo;
		$scope.urlParams 	= $routeParams;
		$scope.memberObj 	= {};

		$scope.is_app = false;
		var current_browser = getBrowser();
		if( current_browser.indexOf('App') > 0 ) {
			$scope.is_app = true;
		}

		$scope.getFileFullPath = function() {
			return CommUtil.createFileFullPath($scope.memberObj.photo_file_path, 'photo');
		};

		$scope.getGenderName = function() {
			return CommUtil.createGenderName($scope.memberObj.user_gender);
		};

		/*	회원 수정	*/
		$scope.goMemberEdit = function() {
			CommUtil.locationHref(PageUrl.user.memberEdit, {});
		};

		/*	회원 탈퇴	*/
		$scope.memberOut = function() {
			var promptVal = window.prompt("탈퇴 하시면 학원밴드 서비스를 더이상 이용할 수 없습니다.\n탈퇴 하시려면 '탈퇴 합니다.'를 입력해 주세요.");
			if( promptVal == '탈퇴 합니다.'  ) {
				memberService.memberOut();
			} else {
				alert('메세지를 정확히 입력해 주세요.');
			}
			return false;
		};

		/*	알림 off 타임	*/
		$scope.alarm_off_time = '';
		if( userAuth.off_date ) {
			$scope.view_alarm_off_time = userAuth.off_date;
		}
		/*	알림 off 선택	*/
		$scope.alarmOffChange = function() {
			if( $scope.alarm_off_time == '' ) {
				/*	동작 안함	*/
			} else {
				memberService.alarmOff($scope.alarm_off_time, function(offTime) {
					userAuth.off_date = offTime;
					$scope.view_alarm_off_time = offTime;
					$scope.alarm_off_time = '';
				});
			}
		}


		/*	로그아웃	*/
		$scope.logout = function() {
			var promptVal = window.prompt("로그아웃 하시려면'logout'를 입력해주세요.\ntype the phrase 'logout' to sign out");
			if( promptVal == 'logout'  ) {
				window.location = '/logout.do';
			} else if( promptVal == '' ) {
				return false;
			} else {
				alert('정확하게 입력해 주세요.');
			}
			return false;
		};

		$scope.androidUpload = function() {
			delete window.uploadCallBack;
			window.uploadCallBack = function(uploadJsonStr) {
				try {
					var resultObj = JSON.parse(uploadJsonStr);
					if( resultObj.error ) {
						alert('파일 업로드를 실패 했습니다.');
					} else {
						var fileInfo = resultObj.colData;
						if (fileInfo.imageYn == 'Y') {
							$scope.memberObj.photo_file_path = fileInfo.filePath;
							$('div.profile-element > img').attr('src', HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.filePath+"_thumb");
							$scope.$digest();
						} else {
							alert('이미지 파일이 아닙니다.');
						}
					}
				} catch(e) {
					alert('파일 업로드를 실패 했습니다.');
				}
			};
			var param = {
				fileType : 'img'
				, multipleYn : 'N'
				, callBack : 'uploadCallBack'
				, upload : {
					url : window.location.protocol+'//'+window.location.host+uploadUrl
					, param : {uploadType:CommonConstant.File.TYPE_PROFILE}
					, cookie : document.cookie
				}
			};
			window.PLATFORM.fileChooser(JSON.stringify(param));
		}

		/* 초기화 함수 */
		$scope.$$postDigest(function(){
			console.log('memberProfileController $$postDigest');

			/*	업로드 객체 생성	*/
			if( comm.isAndroidUploader() ) {
			} else {
				$scope.fileUploadObj = $("input[data-act=photo_upload]").html5_upload(memberService.getPhotoUploadOptions($scope));
			}

			/*	사용자 상세정보 조회	*/
			$scope.getMemberDetail();
		});

		/*	사용자 상세정보 조회	*/
		$scope.getMemberDetail = function() {
			if (isNull($scope.userNo)) {
				alert('사용자 정보가 올바르지 않습니다.');
				return ;
			}

			var masterUrl	= '/hakwon/master/masterReqDetail.do',
				teacherUrl	= '/hakwon/teacher/teacherReqDetail.do',
				finalUrl	= '';

			if (!isNull($scope.userType) && $scope.userType == '003') {
				finalUrl = masterUrl;
			} else if (!isNull($scope.userType) && $scope.userType == '004') {
				finalUrl = teacherUrl;
			} else {
				alert('사용자 타입이 올바르지 않습니다.');
				return ;
			}

			CommUtil.ajax({url:contextPath+finalUrl, param:{}, successFun:function(data) {
				try {
					var colData = data.colData;
					if( colData ) {
						$scope.memberObj = colData;
					} else {
						commProto.logger({hakwonDetailError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 사용자정보 수정 컨트롤러
 */
hakwonMainApp.controller('memberEditController', function($scope, $location, $routeParams, memberService, CommUtil) {
	console.log('hakwonMainApp memberEditController call');
	//console.log('hakwonMainApp memberEditController call', $scope, $location, $routeParams, memberService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		$scope.userType 		= userAuth.userType;
		$scope.userNo 			= userAuth.userNo;
		$scope.urlParams 		= $routeParams;
		$scope.memberObj		= {};
		$scope.oldEmail			= '';

		$scope.checkEmail		= '';
		$scope.changeEmail		= true;
		$scope.checkUserPwd1	= '';
		$scope.checkUserPwd2	= '';

		$scope.is_pwd_change = false;

		$scope.getFileFullPath = function() {
			return CommUtil.createFileFullPath($scope.memberObj.photo_file_path, 'photo');
		};

		$scope.getInitBirthDay = function(birthday) {
			return new Date(birthday);
		};

		$scope.getBirthDayFormat = function(birthday) {
			return moment(birthday).format('YYYY-MM-DD');
		};

		/*	초기화	*/
		$scope.$$postDigest(function(){
			console.log('memberEditController $viewContentLoaded');

			/*	사용자 상세정보 조회	*/
			$scope.getMemberDetail();
		});

		/*	사용자 상세정보 조회	*/
		$scope.getMemberDetail = function() {
			if (isNull($scope.userNo)) {
				alert('사용자 정보가 올바르지 않습니다.');
				return ;
			}

			var masterUrl	= '/hakwon/master/masterReqDetail.do',
				teacherUrl	= '/hakwon/teacher/teacherReqDetail.do',
				finalUrl	= '';

			if (!isNull($scope.userType) && $scope.userType == '003') {
				finalUrl = masterUrl;
			} else if (!isNull($scope.userType) && $scope.userType == '004') {
				finalUrl = teacherUrl;
			} else {
				alert('사용자 타입이 올바르지 않습니다.');
				return ;
			}

			CommUtil.ajax({url:contextPath+finalUrl, param:{}, successFun:function(data) {
				try {
					var colData = data.colData;
					if( colData ) {
						$scope.memberObj = colData;
						$scope.oldEmail = colData.user_email;
						$scope.memberObj.user_birthday = new Date(colData.user_birthday);
					} else {
						commProto.logger({hakwonDetailError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		var skipKeyCodes = [9, 13, 37, 38, 39, 40];
		/*	입력키에 따라 이메일 체크 초기화	*/
		$scope.resetEmailCheck = function(e) {
			if ($scope.checkEmail != 'notexist' && e.keyCode === 13) {
				$scope.checkDuplicateEmail();
				return;
			}

			if (_.indexOf(skipKeyCodes, e.keyCode) > -1) {
				return;
			}
			$scope.checkEmail = 'exist';
		};

		/*  이메일 중복 체크  */
		$scope.checkDuplicateEmail = function() {
			console.log($scope.memberObj);
			var userEmail = $scope.memberObj.user_email;

			if (!memberService.checkEmailValidation(userEmail)){
				return ;
			}

			CommUtil.ajax({param:{user_email : userEmail}, url:contextPath+"/duplicateCheckEmail.do", successFun:function(data) {
				try {
					if (data.colData) {
						if (data.colData.result == 'notexist') {
							$scope.checkEmail = 'notexist';
							$scope.changeEmail = false;
							alert('사용 가능한 이메일 입니다.');
						} else if (data.colData.result == 'exist') {
							alert('이미 존재하는 이메일 입니다. 다시 입력하여 주십시오.');
							$scope.checkEmail = 'exist';
							$scope.changeEmail = true;
						} else {
							commProto.logger({duplicateCheckIdError:data});
						}
					} else {
						commProto.logger({duplicateCheckIdError:data});
					}

				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/*	취소하기	*/
		$scope.cancelModify = function() {
			CommUtil.locationHref(PageUrl.user.memberProfile, {}, 'hakwon');
			return false;
		};

		/*	완료하기	*/
		$scope.confirmModify = function() {
			if (isNull($scope.userNo)) {
				alert('사용자 정보가 올바르지 않습니다.');
				return ;
			}

			if (!memberService.validateMemberEdit($scope)) {
				return ;
			}

			var masterUrl	= '/hakwon/master/editMasterInfo.do',
				teacherUrl	= '/hakwon/teacher/editTeacherInfo.do',
				finalUrl	= '';

			if (!isNull($scope.userType) && $scope.userType == '003') {
				finalUrl = masterUrl;
			} else if (!isNull($scope.userType) && $scope.userType == '004') {
				finalUrl = teacherUrl;
			} else {
				alert('사용자 타입이 올바르지 않습니다.');
				return ;
			}

			if( isNull($scope.memberObj.user_gender) ) {
				alert('성별을 선택해 주세요.');
				return ;
			}

			var params = {};
			params.user_password	= $scope.memberObj.user_password;
			params.user_name		= $scope.memberObj.user_name;
			params.tel1_no 			= $scope.memberObj.tel1_no;
			params.user_email 		= $scope.memberObj.user_email;
			params.user_gender 		= $scope.memberObj.user_gender;
			params.user_birthday 	= $scope.memberObj.update_user_birthday;

			CommUtil.ajax({url:contextPath+finalUrl, param:params, successFun:function(data) {
				try {
					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						alert('회원정보를 수정하였습니다.');
						$scope.cancelModify();
					} else {
						alert('회원정보 수정을 실패하였습니다. 다시 시도해 주시기 바랍니다.');
						commProto.logger({hakwonDetailError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});