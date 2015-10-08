
/**
 * 회원가입 서비스
 */
hakwonCommonApp.service('SignUpService', function() {
	console.log('hakwonCommonApp SignUpService call');

	var self = this;

	/*	생년원일 입력후, 포멧 변경		*/
	this.dateFormatBirthDay = function(date) {
		var birthDay = moment(date).format('YYYY-MM-DD');
		return birthDay;
	};

	/*	아이디 정규식	*/
	this.checkEngNumComb = function(value) {
		var exp = new RegExp(/^[a-zA-Z]1?[a-zA-Z0-9]*$/);
		return !exp.test(value);
	};

	/*  비밀번호 정규식  */
	this.checkPasswordComb = function(value) {
		var numberExp = new RegExp('^.*[0-9].*$');
		var strExp = new RegExp('^.*[A-Za-z].*$');
		return !numberExp.test(value) || !strExp.test(value);
	};

	/*  아이디 검증  */
	this.checkIdValidation = function(userId) {

		if (isNull(userId)) {
			alert('아이디를 입력해 주세요.');
			$('input[name=userId]').focus();
			return false;
		}

		if (userId.length < 4 || userId.length > 15 || self.checkEngNumComb(userId)) {
			alert('아이디를 4~15자 사이의 영문/숫자 조합으로 입력해주세요.');
			$('input[name=userId]').focus();
			return false;
		}

		return true;
	};

	/*  이메일 검증  */
	this.checkEmailValidation = function(email) {
		if (isNull(email)) {
			alert('이메일을 입력해 주세요.');
			$('input[name=email]').focus();
			return false;
		}

		var emailExp = new RegExp('^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$');
		if (!emailExp.test(email)) {
			alert('이메일을 형식에 맞게 입력해주세요.');
			$('input[name=email]').focus();
			return false;
		}

		return true;
	};

	/*  비밀번호 검증  */
	this.checkPwdValidation = function(pwd, message) {
		message = message || '비밀번호를 ';
		if (isNull(pwd)) {
			alert(message + '입력해 주세요.');
			if (message == '비밀번호를 ') {
				$('input[name=password]').focus();
			} else {
				$('input[name=confirm]').focus();
			}
			return false;
		}

		if (pwd.length < 8 || self.checkPasswordComb(pwd)) {
			alert(message + '8자 이상의 영문/숫자 조합으로 입력해주세요.');
			if (message == '비밀번호를 ') {
				$('input[name=password]').focus();
			} else {
				$('input[name=confirm]').focus();
			}
			return false;
		}

		return true;
	};

	/*  완료버튼시 가입자 전체정보 검증처리  */
	this.validateUserInfo = function($scope) {

		if (!self.checkIdValidation($scope.regUserInfo.user_id)) {
			return;
		}

		if (isNull($scope.checkUserId) || $scope.checkUserId == 'exist') {
			$('input[name=userId]').focus();
			alert('아이디 중복확인을 해주세요.');
			return;
		}

		if (!self.checkPwdValidation($scope.regUserInfo.user_password)) {
			$scope.checkUserPwd	= 'false';
			return;
		}

		$scope.checkUserPwd	= 'true';

		if (!self.checkPwdValidation($scope.regUserInfo.chk_password, '비밀번호 확인을 ')) {
			$scope.checkPwdConfirm	= 'false';
			return;
		}

		if ($scope.regUserInfo.user_password !== $scope.regUserInfo.chk_password) {
			alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
			$('input[name=confirm]').focus();
			$scope.checkPwdConfirm	= 'false';
			return;
		}

		$scope.checkPwdConfirm	= 'true';

		if (isNull($scope.regUserInfo.user_name)) {
			alert('이름을 입력해 주세요.');
			$('input[name=userName]').focus();
			$scope.checkUserName = 'false';
			return;
		}

		$scope.checkUserName = 'true';

		if (isNull($scope.regUserInfo.user_birthday)) {
			alert('생년월일을 입력해 주세요.');
			$('input[name=birthday]').focus();
			$scope.checkBirthday = 'false';
			return;
		} else {
			$scope.regUserInfo.user_birthday = self.dateFormatBirthDay($scope.regUserInfo.user_birthday);
			$scope.checkBirthday = 'true';
		}

		if (isNull($scope.regUserInfo.user_gender)) {
			alert('성별을 선택해 주세요.');
			$('input[name=userGender]').focus();
			$scope.checkUserGender	= 'false';
			return;
		}

		$scope.checkUserGender	= 'true';

		if (isNull($scope.regUserInfo.tel1_no)) {
			alert('전화번호를 입력해 주세요.');
			$('input[name=phone]').focus();
			$scope.checkUserPhone = 'false';
			return;
		}

		$scope.checkUserPhone = 'true';

		if (!self.checkEmailValidation($scope.regUserInfo.user_email)) {
			$scope.checkEmail = 'exist';
			return;
		}

		if (isNull($scope.checkEmail) || $scope.checkEmail == 'exist') {
			alert('이메일 중복확인을 해주세요.');
			$('input[name=email]').focus();
			$scope.checkEmail = 'exist';
			return;
		}

		$scope.checkEmail = 'notexist';

		return true;
	};

});

/**
 * 회원가입 컨트롤러
 */
hakwonCommonApp.controller('SignUpController', function($scope, $location, SignUpService, CommUtil) {
	console.log('hakwonCommonApp SignUpController call', $scope, $location, SignUpService, CommUtil);

	try {
		$scope.checkUserId			= '';
		$scope.checkUserPwd			= '';
		$scope.checkPwdConfirm		= '';
		$scope.checkUserName		= '';
		$scope.checkBirthday		= '';
		$scope.checkUserGender		= '';
		$scope.checkUserPhone		= '';
		$scope.checkEmail			= '';
		$scope.searchHakwon			= '';

		$scope.currentStep			= '01';

		/*  가입단계 이동 구현 */
		$scope.cancel = function() {
			window.location.href = '#/login';
		};

		$scope.moveCompleteStep = function() {
			console.log($scope.regUserInfo);

			if (SignUpService.validateUserInfo($scope)) {
				$scope.registUser();
			}
		};

		$scope.initRegUserInfo = function() {
			$scope.regUserInfo = _.each($scope.regUserInfo, function(item){
				console.log(item);
				return item = '';
			});
		};

		/*  가입자 데이터 모델  */
		$scope.regUserInfo = {
			user_id 			: '',
			user_password		: '',
			chk_password		: '',
			user_birthday		: '',
			user_gender			: 'M',
			tel1_no				: '',
			user_email 			: '',
			photo_file_no 		: '',
			user_url 			: '',
			agree01 			: 'Y',
			agree02 			: 'Y',
			hakwon_code 		: '',
			hakwon_no			: '',
			hakwon_name			: '',
			master_user_name	: ''
		};

		$scope.genderOptions = [
			{CODE : 'M', NAME: '남'},
			{CODE : 'F', NAME: '여'}
		];


		var skipKeyCodes = [9, 13, 37, 38, 39, 40];
		/*	입력키에 따라 아이디 체크 초기화	*/
		$scope.resetIdCheck = function(e) {
			if ($scope.checkUserId != 'notexist' && e.keyCode === 13) {
				$scope.checkDuplicateUserId();
				return;
			}

			if (_.indexOf(skipKeyCodes, e.keyCode) > -1) {
				return;
			}
			$scope.checkUserId = 'exist';
		};

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

		/*  아이디 중복 체크  */
		$scope.checkDuplicateUserId = function() {
			console.log($scope.regUserInfo);
			var userId = $scope.regUserInfo.user_id;

			if (!SignUpService.checkIdValidation(userId)){
				return ;
			}

			var params = {user_id : userId};
			CommUtil.ajax({param:params, url:contextPath+"/duplicateCheckId.do", successFun:function(data) {
				try {
					if (data.colData) {
						if (data.colData.result == 'notexist') {
							alert('사용 가능한 아이디 입니다.');
							$scope.checkUserId = 'notexist';
						} else if (data.colData.result == 'exist') {
							alert('이미 존재하는 아이디 입니다. 다시 입력하여 주십시오.');
							$scope.checkUserId = 'exist';
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

		/*  이메일 중복 체크  */
		$scope.checkDuplicateEmail = function() {
			console.log($scope.regUserInfo);
			var userEmail = $scope.regUserInfo.user_email;

			if (!SignUpService.checkEmailValidation(userEmail)){
				return ;
			}

			var params = {user_email : userEmail};
			CommUtil.ajax({param:params, url:contextPath+"/duplicateCheckEmail.do", successFun:function(data) {
				try {
					if (data.colData) {
						if (data.colData.result == 'notexist') {
							$scope.checkEmail = 'notexist';
							alert('사용 가능한 이메일 입니다.');
						} else if (data.colData.result == 'exist') {
							alert('이미 존재하는 이메일 입니다. 다시 입력하여 주십시오.');
							$scope.checkEmail = 'exist';
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

		/*  회원가입  */
		$scope.registUser = function() {
			CommUtil.ajax({param:$scope.regUserInfo, url:contextPath+"/registHakwonManager.do", successFun:function(data) {
				try {
					if (data.colData && data.colData.flag == CommonConstant.Flag.success) {
						$scope.currentStep = '04';
						setTimeout(function(){
							window.location.href = '#/login';
						}, 3000);
					} else {
						alert('회원 가입을 실패 했습니다.\n다시 시도해 주세요.');
						commProto.logger({registHakwonUserError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		$scope.signUpCancel = function() {
			window.location.href = PageUrl.login;
		};

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});