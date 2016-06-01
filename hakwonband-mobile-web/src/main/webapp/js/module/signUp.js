/*	회원가입	*/
hakwonApp.controller('signUpController', function($scope, $window, $location, $routeParams, memberService, CommUtil){
	try {
		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({headerTitle:'학원 밴드 가입'});

		$scope.isSearch = false;
		$scope.foundHakwons = [];

		/* 가입 유형 선택 */
		$scope.moveNextStep = function(userType) {
			console.log('moveNextStep call userType['+userType+']');

			if( userType == '003' || userType == '004' ) {
				/*	원장님 선생님	*/
				window.location = HakwonConstant.Site.HAKWON+'/index.do#/signUp';
				return ;
			}

			var agree01 = $('.chk input[type="checkbox"][name=agree01]:checked').val();
			var agree02 = $('.chk input[type="checkbox"][name=agree02]:checked').val();

			if( agree01 != 'Y' || agree02 != 'Y' ) {
				alert('이용 약관 및 개인정보취급방침에 동의해 주세요.');
				return false;
			}

			$scope.nextStep = true;
			$scope.userType = userType;
		};

		/* 유형 선택으로 이동 */
		$scope.returnStep = function() {
			$scope.nextStep = false;
			$scope.userType = null;
		};

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

		/*	아이디 체크 */
		$scope.checkId = function() {
			var userId = $('.sec_register [name=user_id]').val().trim();
			if (!checkIdValidation(userId)) {
				return;
			}

			var params = {user_id: userId};
			CommUtil.ajax({url:contextPath+"/duplicateCheckId.do", param:params, successFun:function(data) {
				try {
					if (data.colData.result === 'notexist') {
						alert('사용 가능한 아이디 입니다.');
						$scope.idChecked = true;
					} else {
						alert('등록되어있는 아이디 입니다.');
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		var skipKeyCodes = [9, 13, 37, 38, 39, 40];
		$scope.resetIdCheck = function(e) {
			if (!$scope.idChecked && e.keyCode === 13) {
				$scope.checkId();
				return;
			}

			if (_.indexOf(skipKeyCodes, e.keyCode) > -1) {
				return;
			}
			$scope.idChecked = false;
		};

		$scope.resetEmailCheck = function(e) {
			if (!$scope.emailChecked && e.keyCode === 13) {
				$scope.checkEmail();
				return;
			}

			if (_.indexOf(skipKeyCodes, e.keyCode) > -1) {
				return;
			}
			$scope.emailChecked = false;
		};

		/*	이메일 체크 */
		$scope.checkEmail = function() {
			var email = $('.sec_register [name=user_email]').val().trim();
			if (!commProto.checkEmailValidation(email)) {
				return;
			}

			var params = {user_email: email};
			CommUtil.ajax({url:contextPath+"/duplicateCheckEmail.do", param:params, successFun:function(data) {
				try {
					if (data.colData.result === 'notexist') {
						alert('사용 가능한 이메일 입니다.');
						$scope.emailChecked = true;
					} else {
						alert('등록되어있는 이메일 입니다.');
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/* 교육과정에 따른 학년 선택 */
		var levelsData = {
			empty:[],
			'001':[
				{text:'1학년', value:'1'},
				{text:'2학년', value:'2'},
				{text:'3학년', value:'3'},
				{text:'4학년', value:'4'},
				{text:'5학년', value:'5'},
				{text:'6학년', value:'6'}
			],
			'002':[
				{text:'1학년', value:'1'},
				{text:'2학년', value:'2'},
				{text:'3학년', value:'3'}
			],
			'003':[
				{text:'1학년', value:'1'},
				{text:'2학년', value:'2'},
				{text:'3학년', value:'3'}
			]
		};
//		$scope.levels = levelsData['002'];
		$scope.selectStep = function() {
			var school_level = $scope.school_level === "" ? 'empty' : $scope.school_level;
			$scope.levels = levelsData[school_level];
		}

		$scope.checkEmpty = function() {
			var hakwonName = ($scope.hakwon_name||'').trim();
			if (!hakwonName) {
				$scope.foundHakwons = [];
				$scope.isSearch = false;
			}
		};

		$scope.searchHakwon = function(e) {
			if (e && e.type === 'keydown' && e.keyCode !== 13) {
				return;
			}

			var hakwonName = ($scope.hakwon_name||'').trim();
			if (isNull(hakwonName)) {
				alert('검색어를 입력해 주세요.');
				return;
			}

			var params = {search_text: hakwonName};
			CommUtil.ajax({url:contextPath+"/mobile/hakwon/searchHakwon.do", param:params, successFun:function(data) {
				try {
					var foundHakwons = data.colData.result;
					$scope.isSearch = true;
					foundHakwons.length = _.min([3, foundHakwons.length]);
					$scope.foundHakwons = foundHakwons;
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};
		$scope.myHakwons = [];
		$scope.joinHakwon = function(hakwon_code) {
			if (!!_.findWhere($scope.myHakwons, {hakwon_code:hakwon_code})) {
				alert('이미 가입된 학원입니다.');
				return;
			}

			var hackwon = _.findWhere($scope.foundHakwons, {hakwon_code:hakwon_code});
			$scope.foundHakwons = _.reject($scope.foundHakwons, function(hakwon) {
				return hakwon.hakwon_code === hakwon_code;
			});
			if ($scope.foundHakwons.length === 0) {
				$scope.isSearch = false;
				$scope.hakwon_name = '';
			}
			$scope.myHakwons.push(hackwon);

		};

		$scope.secessionHakwon = function(hakwon_code) {
			$scope.myHakwons = _.reject($scope.myHakwons, function(hakwon) {
				return hakwon.hakwon_code === hakwon_code;
			});
		};

		/*	아이디 정규식	*/
		var checkEngNumComb = function(value) {
			var exp = new RegExp(/^[a-zA-Z]1?[a-zA-Z0-9]*$/);
			return !exp.test(value);
		};

		/*  비밀번호 정규식  */
		var checkPasswordComb = function(value) {
			var numberExp = new RegExp('^.*[0-9].*$');
			var strExp = new RegExp('^.*[A-Za-z].*$');
			return !numberExp.test(value) || !strExp.test(value);
		};

		var checkIdValidation = function(userId) {
			if (isNull(userId)) {
				alert('아이디를 입력해 주세요.');
				return false;
			}

			if (userId.length < 4 || userId.length > 15 || checkEngNumComb(userId)) {
				alert('아이디를 4~15자 사이의 영문/숫자 조합으로 입력해주세요.');
				return false;
			}

			return true;
		};

		var checkPwdValidation = function(pwd, message) {
			message = message || '비밀번호를';
			if (isNull(pwd)) {
				alert(message + ' 입력해 주세요.');
				return false;
			}

			if (pwd.length < 8 || checkPasswordComb(pwd)) {
				alert(message + '8자 이상의 영문/숫자 조합으로 입력해주세요.');
				return false;
			}

			return true;
		};

		$scope.complate = function() {
			var formData = CommUtil.getFormValues($('.sec_register'), $scope);
			if (!checkIdValidation(formData.user_id)) {
				return;
			}

			if (!$scope.idChecked) {
				alert('아이디 중복확인을 해주세요.');
				return;
			}

			if (!checkPwdValidation(formData.user_password) || !checkPwdValidation(formData.user_password_confirm, '비밀번호 확인을')) {
				return;
			}

			if (formData.user_password !== formData.user_password_confirm) {
				alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
				return;
			}
/*
			if (isNull(formData.user_name)) {
				alert('이름을 입력해 주세요.');
				return;
			}
*/
			var userBirthday = '';
/*
			var birthdayYear	= $('input[name=birthdayYear]').val();
			var birthdayMonth	=$('select[name=birthdayMonth]').val();
			var birthdayDay		= $('select[name=birthdayDay]').val();
			if( birthdayYear || birthdayMonth || birthdayDay ) {
				if( birthdayYear && birthdayYear.length == 4 && birthdayMonth && birthdayDay ) {
					var currentDateStr = new Date().yyyymmdd('');
					if( currentDateStr <= birthdayYear+''+birthdayMonth+''+birthdayDay ) {
						alert('생년월일을 정확히 입력해 주세요.');
						return ;
					}

					userBirthday = birthdayYear + '-' + birthdayMonth + '-' + birthdayDay;
				} else {
					alert('생년월일을 정확히 입력해 주세요.');
					return ;
				}
			} else {
				userBirthday = '';
			}
*/
			formData.user_birthday = userBirthday;
/*
			if (isNull(formData.user_gender)) {
				alert('성별을 선택해 주세요.');
				return;
			}

			if (isNull(formData.tel1_no)) {
				alert('전화번호를 입력해 주세요.');
				return;
			}

			if( !isNull(formData.user_email) ) {
				if (!commProto.checkEmailValidation(formData.user_email)) {
					return;
				}

				if (!$scope.emailChecked) {
					alert('이메일을 사용하시려면 중복확인을 해주세요.');
					return;
				}
			}
*/
/*
			if ($scope.userType === '006' && isNull(formData.school_name)) {
				alert('학교명을 입력해 주세요.');
				return;
			}
			if ($scope.userType === '006' && isNull(formData.school_level)) {
				alert('교육과정을 선택해 주세요.');
				return;
			}
			if ($scope.userType === '006' && isNull(formData.level)) {
				alert('학년을 선택해 주세요.');
				return;
			}
*/
			formData.user_type = $scope.userType;
			if ($scope.myHakwons.length > 0) {
				formData.hakwon_codes = _.pluck($scope.myHakwons, 'hakwon_code').join(',');
			}
			formData.agree01 = 'Y';
			formData.agree02 = 'Y';
			CommUtil.ajax({url:contextPath+"/registUser.do", param:formData, successFun:function(data) {
				try {
					if( data.error ) {
						alert('회원 가입을 실패 했습니다.\n다시 시도해 주세요.');
						return ;
					}

					if (data.colData.flag === "success") {
						alert('성공적으로 가입되었습니다.\n로그인 후 이용하시기 바랍니다.');
						window.location.href = MENUS.sharpUrls.login;
						return;
					} else {
						alert('가입에 실패했습니다.');
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});

		};

		$scope.getFileFullPath = function(filePath, type, isThumb) {
			return CommUtil.createFileFullPath(filePath, type, isThumb);
		};

		$scope.$$postDigest(function() {
			comm.screenInit();
			$('.chk input[type="radio"]').ezMark({radioCls: 'ez-chkbox', selectedCls: 'ez-checked'});
			$('.chk input[type="checkbox"]').ezMark({checkboxCls: 'ez-chkbox', checkedCls: 'ez-checked'})
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});