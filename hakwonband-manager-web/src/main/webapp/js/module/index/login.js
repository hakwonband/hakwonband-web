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
			$loginSec.find('input[name=userId]').focus();
			return ;
		}
		if( isNull(userPass) ) {
			alert('비밀번호를 입력해 주세요.');
			$('button[data-act=login]').attr('disabled',false);
			$loginSec.find('input[name=userPass]').focus();
			return ;
		}

		var param = {userId:userId, userPass:userPass, loginSave:loginSave, idSave:idSave};
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
			complete : function(){ $('button[data-act=login]').attr('disabled',false); },
			data: $.param(param, true),
			dataType: "json",
			success: function(data) {
				var colData = data.colData;
				if( colData && colData.flag == CommonConstant.Flag.success ) {

					userAuth.userName = colData.authUserInfo.user_name;
					userAuth.userEmail = colData.authUserInfo.user_email;
					userAuth.userType = colData.authUserInfo.user_type;
					userAuth.userId = colData.authUserInfo.user_id;
					userAuth.userNo = colData.authUserInfo.user_no;
					userAuth.off_date = colData.authUserInfo.off_date;

					if( window.PLATFORM ) {
						if( 1328 <= comm.getAppVersion() ) {
							window.location = 'hakwonband://auth/login/'+colData.authUserInfo.authKey;
						} else {
							if( param.deviceToken && param.deviceType ) {
								userAuth.deviceAuth = {
									deviceToken : param.deviceToken
									, deviceType : param.deviceType
								};
							}
						}
					} else {
						/*	디바이스 인증 정보	*/
						if( param.deviceToken && param.deviceType ) {
							userAuth.deviceAuth = {
								deviceToken : param.deviceToken
								, deviceType : param.deviceType
							};
						}
					}

					//window.location = "/main.do";
					window.location.replace("/main.do");
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
		$('#wrapper').on(clickEvent, 'button[data-act=login]', function() {
			loginService.login($location, $loginSec);
		});
		$('#wrapper').on('keypress', 'input[name=userId]', function( event ) {
			if ( event.which == 13 ) {
				loginService.login($location, $loginSec);
				event.preventDefault();
			}
		});
		$('#wrapper').on('keypress', 'input[name=userPass]', function( event ) {
			if ( event.which == 13 ) {
				loginService.login($location, $loginSec);
				event.preventDefault();
			}
		});

		/*	회원 가입으로 이동	*/
		$('#wrapper').on(clickEvent, 'button[data-act=signUp]', function() {
			window.location.href = PageUrl.signUp;
		});

		/*	아이디 비밀번호 찾기로 이동	*/
		$('#wrapper').on(clickEvent, 'button[data-act=findInfo]', function() {
			window.location.href = PageUrl.findInfo;
		});

		$scope.$on('$viewContentLoaded', function() {
			$loginSec.find('input[name=userId]').focus();
			$('.i-checks').iCheck({
				checkboxClass: 'icheckbox_square-green'
			});
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});
