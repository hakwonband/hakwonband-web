/**
 * 로그인 서비스
 */
hakwonCommonApp.service('loginService', function($rootScope, $location) {
	console.log('loginService call');

	var loginService = {};

	loginService.login = function ($scope) {
		$scope.is_login_ing = true;

		var user_id		= $scope.user_id;
		var user_pass	= $scope.user_pass;
		var login_save	= $scope.login_save;
		var id_save		= $scope.id_save;

		if( isNull(user_id) ) {
			alert('아이디를 입력해 주세요.');
			$scope.is_login_ing = false;
			//$loginSec.find('input[name=user_id]').focus();
			return ;
		}
		if( isNull(user_pass) ) {
			alert('비밀번호를 입력해 주세요.');
			$scope.is_login_ing = false;
			//$loginSec.find('input[name=userPass]').focus();
			return ;
		}

		var param = {userId:user_id, userPass:user_pass, loginSave:login_save, idSave:id_save};
		if( window.PLATFORM ) {
			param.deviceToken = window.PLATFORM.getGcmKey();
			param.deviceType = CommonConstant.DeviceType.android;
		} else if( deviceToken ) {
			param.deviceToken = deviceToken.key;
//			param.deviceType = deviceToken.deviceType;
			param.deviceType = 'ios';
			if( deviceToken.isProduction ) {
				param.isProduction = deviceToken.isProduction;
			}
		}

		$.ajax({
			url: contextPath+"/login.do",
			type: "post",
			async : false,
			complete : function(){ $scope.is_login_ing = false;},
			data: $.param(param, true),
			dataType: "json",
			success: function(data) {
				var colData = data.colData;
				if( colData && colData.flag == CommonConstant.Flag.success ) {

					if( window.PLATFORM || getBrowser() == 'iosApp' ) {
					//if( window.PLATFORM || (user_id == 'bumstudent' || user_id == 'bumwonjang' || user_id == 'bumteacher') ) {
						window.location = 'hakwonband://auth/login/'+colData.authUserInfo.authKey;
					}

					setTimeout(function() {
						userAuth.userName = colData.authUserInfo.user_name;
						userAuth.userEmail = colData.authUserInfo.user_email;
						userAuth.userType = colData.authUserInfo.user_type;
						userAuth.userId = colData.authUserInfo.user_id;
						userAuth.userNo = colData.authUserInfo.user_no;

						/*	디바이스 인증 정보	*/
						if( param.deviceToken && param.deviceType ) {
							userAuth.deviceAuth = {
								deviceToken : param.deviceToken
								, deviceType : param.deviceType
							};
						}

						window.location.replace("/main.do");
					}, 30);
				} else if( colData.flag == 'stop' ) {
					alert('일시 정지된 사용자입니다.\n학원밴드에 문의하세요.');
				} else if( colData.flag == 'approvedWait' ) {
					alert('승인 대기 중 입니다.');
				} else {
					alert('계정 정보를 확인 해 주세요.');
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('로그인을 실패 했습니다.');
			}
		});
	};

	return loginService;
});

/**
 * 로그인 컨트롤러
 */
hakwonCommonApp.controller('loginController', function($rootScope, $scope, $location, loginService, $timeout) {
	console.log('loginController call', $rootScope, $scope, $location, loginService);

	try {
		$(document.body).removeClass().addClass('gray-bg');

		$scope.PageUrl = PageUrl;

		/**
		 * 앱일때 로그인은 모바일 로그인 페이지로 이동시킨다.
		 */
		if( window.PLATFORM ) {
			window.location = HakwonConstant.Site.MOBILE;
			return ;
		}

		/**
		 * 로그인
		 */
		$scope.login = function() {
			loginService.login($scope);
		}

		/**
		 * 로그인
		 */
		$scope.signUp = function() {
			window.location.href = PageUrl.signUp;
		}

		$scope.$$postDigest(function() {
			console.debug('$$postDigest');

			$timeout(function() {
				$('.i-checks').iCheck({
					checkboxClass: 'icheckbox_square-green'
				});
			},50);
		});
		$scope.$on('$viewContentLoaded', function() {
			console.debug('$viewContentLoaded');
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});
