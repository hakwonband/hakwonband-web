/**
 * 로그인 서비스
 */
hakwonCommonApp.service('loginService', function() {
	console.log('loginService call');

	this.login = function ($location, $loginSec) {
		$('button[data-act=login]').attr('disabled', true);

		var userId		= $loginSec.find('input[name=userId]').val();
		var userPass	= $loginSec.find('input[name=userPass]').val();
		var loginSave	= $loginSec.find('input[name=loginSave]').val();
		var idSave		= $loginSec.find('input[name=idSave]').val();

		if( isNull(userId) ) {
			alert('아이디를 입력해 주세요.');
			$('button[data-act=login]').attr('disabled',false);
			return ;
		}
		if( isNull(userPass) ) {
			alert('비밀번호를 입력해 주세요.');
			$('button[data-act=login]').attr('disabled',false);
			return ;
		}

		var param = {userId:userId, userPass:userPass, loginSave:loginSave, idSave:idSave};

		if( window.PLATFORM ) {
			param.deviceToken = window.PLATFORM.getGcmKey();
			param.deviceType = CommonConstant.DeviceType.android;
		} else if( deviceToken ) {
			param.deviceToken = deviceToken.key;
			//param.deviceType = deviceToken.deviceType;
			param.deviceType = 'ios';
			if( deviceToken.isProduction ) {
				param.isProduction = deviceToken.isProduction;
			}
		}

		$.ajax({
			url: contextPath+"/login.do",
			type: "post",
			async : false,
			complete : function(){ $('button[data-act=login]').attr('disabled',false); },
			data: $.param(param, true),
			dataType: "json",
			success: function(data) {

				if( data.error ) {
					alert('로그인을 실패 했습니다.');
					return ;
				}

				var colData = data.colData;
				if( colData && colData.flag == CommonConstant.Flag.success ) {

					userAuth.userName = colData.authUserInfo.user_name;
					userAuth.userEmail = colData.authUserInfo.user_email;
					userAuth.userType = colData.authUserInfo.user_type;
					userAuth.userId = colData.authUserInfo.user_id;
					userAuth.userNo = colData.authUserInfo.user_no;
					userAuth.off_date = colData.authUserInfo.off_date;

					/*	디바이스 인증 정보	*/
					if( param.deviceToken && param.deviceType ) {
						userAuth.deviceAuth = {
							deviceToken : param.deviceToken
							, deviceType : param.deviceType
						};
					}

					window.location = "/main.do";
				} else {
					alert('계정 정보를 확인 해 주세요.');
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('로그인을 실패 했습니다.');
			}
		});
	}
});

/**
 * 로그인 컨트롤러
 */
hakwonCommonApp.controller('loginController', function($rootScope, $scope, $location, loginService) {
	console.log('loginController call', $rootScope, $scope, $location, loginService);

	try {
		$(document.body).removeClass().addClass('gray-bg');

		/**
		 * 앱일때 로그인은 모바일 로그인 페이지로 이동시킨다.
		 */
		if( window.PLATFORM ) {
			window.location = HakwonConstant.Site.MOBILE;
			return ;
		}

		var $loginSec = $('div.loginscreen');

		/*	로그인 시도	*/
		$scope.login = function() {
			loginService.login($location, $loginSec);
		};

		/*	회원 가입으로 이동	*/
		$scope.goSignUp = function () {
			$location.path('/signUp');
		}

		$scope.$on('$viewContentLoaded', function() {
			$('.i-checks').iCheck({
				checkboxClass: 'icheckbox_square-green',
			});

			if( HakwonConstant.ServerType == 'local' || HakwonConstant.ServerType == 'dev' ) {
				$('input[name=userId]').val('AdminUser');
				$('input[name=userPass]').val('1111');
			}
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});