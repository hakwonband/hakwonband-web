/**
 * 회원정보 서비스
 */
hakwonApp.service('memberService', function($http) {
	console.log('memberService call');

	var memberService = {};

	/* 내정보 조회 */
	memberService.getMyInfo = function (callback) {
		$http(
		{
			withCredentials: false,
			method: 'post',
			url: contextPath+'/mobile/user/myInfoReqDetail.do',
			headers: angularHeaders
		}).
		success(function(data, status) {
			console.log(data, status);
			var colData = data.colData;
			if( colData ) {
				callback(colData);
			} else {
				commProto.logger({getMyInfoError:colData});
			}
		}).error(function(xhr, textStatus, errorThrown) {

		});
	};

	/*  영문, 숫자 검증  */
	memberService.checkEngNumComb = function(value) {
		var numberExp = new RegExp('^.*[0-9].*$');
		var strExp = new RegExp('^.*[A-Za-z].*$');
		return !numberExp.test(value) || !strExp.test(value);
	};

	/*  비밀번호 검증  */
	memberService.checkPwdValidation = function(pwd, message) {
		message = message || '비밀번호를';
		if (isNull(pwd)) {
			alert(message + ' 입력해 주세요.');
			if (message == '비밀번호를') {
				$('input[name=userPassword]').focus();
			} else {
				$('input[name=userCheckPassword]').focus();
			}
			return false;
		}

		if (pwd.length < 8 || memberService.checkEngNumComb(pwd)) {
			alert(message + '8자 이상의 영문/숫자 조합으로 입력해주세요.');
			if (message == '비밀번호를') {
				$('input[name=userPassword]').focus();
			} else {
				$('input[name=userCheckPassword]').focus();
			}
			return false;
		}

		return true;
	};

	/* 내정보 수정 */
	memberService.editUserInfo = function ($scope) {
		if (isNull($scope.authUserInfo.user_name)) {
			alert('사용자 이름을 입력해 주세요.');
			$('input[name=userName]').focus();
			return ;
		}

		if ($scope.authUserInfo.user_password || $scope.authUserInfo.chk_password) {
			if (!memberService.checkPwdValidation($scope.authUserInfo.user_password) || !memberService.checkPwdValidation($scope.authUserInfo.chk_password, '비밀번호 확인을 ')) {
				return;
			}
			if ($scope.authUserInfo.user_password !== $scope.authUserInfo.chk_password) {
				alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
				$('input[name=userCheckPassword]').focus();
				return;
			}
		}
/*
		if ( isNull($scope.authUserInfo.tel1_no) ) {
			alert('전화번호를 입력해 주세요.');
			$('input[name=userTelNo]').focus();
			return ;
		}
*/
		var birthdayYear	= $('input[name=birthdayYear]').val();
		var birthdayMonth	=$('select[name=birthdayMonth]').val();
		var birthdayDay		= $('select[name=birthdayDay]').val();
		if( birthdayYear || birthdayMonth || birthdayDay ) {
			if( birthdayYear && birthdayYear.length == 4 && birthdayMonth && birthdayDay ) {
				console.log('올바른 날짜');

				var currentDateStr = new Date().yyyymmdd('');
				if( currentDateStr <= birthdayYear+''+birthdayMonth+''+birthdayDay ) {
					alert('생년월일을 정확히 입력해 주세요.');
					return ;
				}

				$scope.authUserInfo.birthday = birthdayYear + '-' + birthdayMonth + '-' + birthdayDay;
			} else {
				alert('생년월일을 정확히 입력해 주세요.');
				return ;
			}
		} else {
			$scope.authUserInfo.birthday = '';
		}

		if( isNull($('input[name=userGender]:checked').val()) ) {
			alert('성별을 선택해 주세요.');
			return ;
		}
		$scope.authUserInfo.user_gender = $('input[name=userGender]:checked').val();

		if ( !isNull($scope.authUserInfo.user_email) ) {
			if( userAuth.userEmail != $scope.authUserInfo.user_email ) {
				if( $scope.emailCheckedValue != $scope.authUserInfo.user_email ) {
					alert('이메일 주소 중복 체크를 해주세요.');
					return ;
				} else if( $scope.emailChecked !== true ) {
					alert('이메일 주소 중복 체크를 해주세요.');
					return ;
				}
			}
		}

		$scope.authUserInfo.user_birthday_str = $scope.authUserInfo.user_birthday.yyyymmdd();

		var params = $scope.authUserInfo;
		var queryString = $.param(params, true);

		$http( {
			withCredentials: false,
			method: 'post',
			url: contextPath+'/mobile/user/editMyInfo.do',
			headers: angularHeaders,
			data: queryString
		}).success(function(data, status) {
			if( data.error ) {
				alert('사용자 정보 수정을 실패 했습니다.');
				return ;
			} else {
				var colData = data.colData;
				if( colData.result == CommonConstant.Flag.success ) {

					/*	사용자 정보 재조회	*/
					comm.getUserInfo(function() {
						window.location.href = MENUS.sharpUrls.myInfo;
					});
				} else {
					commProto.logger({editMyInfoError:colData});
				}
			}
		}).error(function(xhr, textStatus, errorThrown) {

		});
	};

	/* 사용자 타입 체크 */
	memberService.checkUserType = function () {
		if( userAuth.userType == HakwonConstant.UserType.STUDENT ) {
			return true;
		} else if( userAuth.userType == HakwonConstant.UserType.PARENT ) {
			return false;
		}
	};

	/**
	 * 날짜 select box 초기화
	 */
	memberService.daysSelectInit = function(year, month, $daysSelect) {
		console.log('daysSelectInit call~~~');
		if( !year || !month ) {
			return ;
		}
		var defaultDays = $daysSelect.val();

		var maxDays = getMoonDays(year, month);
		if( defaultDays && maxDays < parseInt(defaultDays) ) {
			defaultDays = 0;
		}
		var writeDaysHtml = '<option value="">일 선택</option>';
		for(var i=1; i<=maxDays; i++) {
			var viewDay = i;
			if( i < 10 ) viewDay = '0'+i;

			var selected = '';
			if( defaultDays == i ) selected = 'selected';

			writeDaysHtml += '<option value="'+viewDay+'" '+selected+'>'+viewDay+'</option>';
		}
		$daysSelect.html(writeDaysHtml);
	};

	return memberService;
});

/*	내정보 변경 컨트롤러  */
hakwonApp.controller('memberModifyController', function($scope, $window, $location, $routeParams, memberService, CommUtil) {
	console.log('memberModifyController call');

	try {
		/*  인증 정보 체크  */
		comm.authCheckFilter();

		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({viewType:'user', headerTitle:'내정보 변경'});

		$scope.reloadRoute = function() {
			$window.location.reload();
		};


		$scope.userAuth = userAuth;
		$scope.authUserInfo = {};
		$scope.photoFile 	= '';
		$scope.isStudent 	= false;

		$scope.schoolLevel = [
			{LEVEL : '001', NAME: '초'},
			{LEVEL : '002', NAME: '중'},
			{LEVEL : '003', NAME: '고'}
		];

		$scope.gradeLevel = [];

		$scope.lowGrade = [
			{LEVEL : 1, NAME: '1학년'},
			{LEVEL : 2, NAME: '2학년'},
			{LEVEL : 3, NAME: '3학년'},
			{LEVEL : 4, NAME: '4학년'},
			{LEVEL : 5, NAME: '5학년'},
			{LEVEL : 6, NAME: '6학년'}
		];

		$scope.highGrade = [
			{LEVEL : 1, NAME: '1학년'},
			{LEVEL : 2, NAME: '2학년'},
			{LEVEL : 3, NAME: '3학년'}
		];

		/*	교과과정 변경	*/
		$scope.changeSchoolLevel = function () {
			if ($scope.authUserInfo.school_level == '001') {
				$scope.gradeLevel = $scope.lowGrade;
			} else {
				$scope.gradeLevel = $scope.highGrade;
			}
		};

		$scope.isStudent = memberService.checkUserType();

		/*	연도 변경시	*/
		$('#wrap_cont').on('keyup', 'input[name=birthdayYear]', function() {
			if( this.value.length == 4 ) {
				memberService.daysSelectInit($('input[name=birthdayYear]').val(), $('select[name=birthdayMonth]').val(), $('select[name=birthdayDay]'));
			}
		});
		$('#wrap_cont').on('change', 'select[name=birthdayMonth]', function() {
			if( $(this).val() ) {
				memberService.daysSelectInit($('input[name=birthdayYear]').val(), $('select[name=birthdayMonth]').val(), $('select[name=birthdayDay]'));
			}
		});

		/*	이메일 체크 */
		$scope.checkEmail = function() {
			var email = $scope.authUserInfo.user_email;
			if (!commProto.checkEmailValidation(email)) {
				return;
			}

			if( userAuth.userEmail == email ) {
				$scope.emailChecked = true;
				alert('사용 가능한 이메일 주소 입니다.');
				return ;
			}

			var params = {user_email: email};
			CommUtil.ajax({url:contextPath+"/duplicateCheckEmail.do", param:params, successFun:function(data) {
				try {
					if (data.colData.result === 'notexist') {
						alert('사용 가능한 이메일 입니다.');
						$scope.emailChecked = true;
						$scope.emailCheckedValue = email;
					} else {
						alert('등록되어있는 이메일 입니다.');
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/*	취소	*/
		$('#wrap_cont').on(clickEvent, 'button[data-act=cancel]', function() {
			commProto.hrefMove(MENUS.sharpUrls.myInfo);
		});

		$scope.getFileFullPath = function(photoFile, isThumb) {
			return CommUtil.createFileFullPath(photoFile, 'photo', isThumb);
		};

		/*	내정보 상세조회 호출 	*/
		CommUtil.ajax({url:contextPath+"/mobile/user/myInfoReqDetail.do", successFun:function(data) {
			try {
				var colData = data.colData;
				colData.user_birthday = new Date(colData.user_birthday);
				$scope.authUserInfo = colData;
				$scope.changeSchoolLevel();

				if (!_.isEmpty(colData.photo_file_path)) {
					$scope.photoFile = HakwonConstant.FileServer.ATTATCH_DOMAIN+colData.photo_file_path+'_thumb';
				}

				if( $scope.authUserInfo.user_gender == 'M' ) {
					$('#gender_m').click();
				} else if( $scope.authUserInfo.user_gender == 'F' ) {
					$('#gender_f').click();
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});

		/* 내정보 수정 */
		$scope.editUserInfo = function() {
			memberService.editUserInfo($scope);
		};

		$scope.$on('$viewContentLoaded', function() {
			console.log('$viewContentLoaded call');
		});
		$scope.$$postDigest(function() {
			console.log('$$postDigest call');

			$('.chk input[type="radio"]').ezMark({radioCls: 'ez-chkbox', selectedCls: 'ez-checked'});

			comm.screenInit();

			if( userAuth.userBirthday ) {
				var birthDayArray = userAuth.userBirthday.split('-');
				$('input[name=birthdayYear]').val(birthDayArray[0]);
				$('select[name=birthdayMonth]').val(birthDayArray[1]);
				var birthDayVal = parseInt(birthDayArray[2]);
				var days = getMoonDays(birthDayArray[0], birthDayArray[1]);
				var writeDaysHtml = '<option value="">일 선택</option>';
				for(var i=1; i<=days; i++) {
					var viewDay = i;
					if( i < 10 ) viewDay = '0'+i;

					var selected = '';
					if( birthDayVal == i ) selected = 'selected';

					writeDaysHtml += '<option value="'+viewDay+'" '+selected+'>'+viewDay+'</option>';
				}
				$('select[name=birthdayDay]').html(writeDaysHtml);
				$('input[name=birthdayDay]').val(birthDayArray[2]);
			}

			// 파일 업로드 객체 생성
			if( comm.isAndroidUploader() ) {
				angular.element("input[data-act=photo_upload]").click(function(event) {
					delete window.uploadCallBack;
					window.uploadCallBack = function(uploadJsonStr) {
						try {
							var resultObj = JSON.parse(uploadJsonStr);
							if( resultObj.error ) {
								alert('사진 업로드를 실패 했습니다.');
							} else {
								var fileInfo = resultObj.colData;
								if (fileInfo.imageYn == 'Y') {
									$('img[data-view=photo_preview]').attr('src', HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.thumbFilePath).attr('data-file-no', fileInfo.fileNo);
									userAuth.userPhotoPath = fileInfo.filePath;
								} else {
									alert('이미지 파일이 아닙니다.');
								}
							}
						} catch(e) {
							alert('파일 업로드를 실패 했습니다.');
						}
						return false;
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

					return false;
				});
			} else {
				var photoUploadOptions = new UploadOptions();
				photoUploadOptions.customExtraFields = {'uploadType' : CommonConstant.File.TYPE_PROFILE};
				photoUploadOptions.setProgress = function(val) {
					comm.progress(Math.ceil(val * 100));
				};
				photoUploadOptions.onFinish = function(event, total) {
					if (this.errorFileArray.length + this.errorCount > 0) {
						alert('사진 업로드를 실패 했습니다.');
					} else {
						console.log(this.uploadFileArray);
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
								$('img[data-view=photo_preview]').attr('src', HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.thumbFilePath).attr('data-file-no', fileInfo.fileNo);
								userAuth.userPhotoPath = fileInfo.filePath;
							} else {
								alert('이미지 파일이 아닙니다.');
							}
						}
					}
				};

				$("input[data-act=photo_upload]").html5_upload(photoUploadOptions);
			}
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});