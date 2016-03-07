/**
 * 로그인 서비스
 */
hakwonApp.service('loginService', function() {
	console.log('loginService call');

	var loginService = {};

	loginService.login = function ($location, $loginSec) {
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
		} else if(getBrowser() == 'iosApp') {
			param.deviceType = 'ios';
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
					return false;
				}
				var colData = data.colData;
				if( colData && colData.flag == CommonConstant.Flag.success ) {
					if( window.PLATFORM || getBrowser() == 'iosApp' ) {
					//if( window.PLATFORM || (userId == 'bumstudent' || userId == 'bumwonjang' || userId == 'bumteacher') ) {
						window.location = 'hakwonband://auth/login/'+colData.authUserInfo.authKey;
					}

					// 위에서 location을 설정한게 씹히는 경우가 있어서 딜래이를 둠
					setTimeout(function() {
						if( colData.authUserInfo.user_type == '001' ) {
							/*	관리자로 이동	*/
							alert('관리자 싸이트로 이동 합니다.');
							window.location = HakwonConstant.Site.ADMIN+'/main.do';
						} else if( colData.authUserInfo.user_type == '002' ) {
							alert('매니저 싸이트로 이동 합니다.');
							window.location = HakwonConstant.Site.MANAGER;
						} else if( colData.authUserInfo.user_type == '003' || colData.authUserInfo.user_type == '004' ) {
							alert('학원 싸이트로 이동 합니다.');
							window.location = HakwonConstant.Site.HAKWON+'/main.do';
						} else if( colData.authUserInfo.user_type == '005' || colData.authUserInfo.user_type == '006' ) {

							userAuth.userName 	= colData.authUserInfo.user_name;
							userAuth.userEmail 	= colData.authUserInfo.user_email;
							userAuth.tel1No 	= colData.authUserInfo.tel1_no;
							userAuth.userType 	= colData.authUserInfo.user_type;
							userAuth.userId 	= colData.authUserInfo.user_id;
							userAuth.userNo 	= colData.authUserInfo.user_no;
							userAuth.userGender = colData.authUserInfo.user_gender;
							userAuth.userAge 	= colData.authUserInfo.user_age;
							userAuth.userPhotoPath 	= colData.authUserInfo.user_photo_path;
							userAuth.attendanceCode	= colData.authUserInfo.attendance_code;

							userAuth.familyList		= colData.familyList;
							userAuth.schoolInfo 	= colData.schoolInfo;

							/*	디바이스 인증 정보	*/
							if( param.deviceToken && param.deviceType ) {
								userAuth.deviceAuth = {
									deviceToken : param.deviceToken
									, deviceType : param.deviceType
								};
							}

							window.location.href = MENUS.sharpUrls.userMain;
						} else {
							commProto.logger({loginError:colData});
						}
					}, 30);
				} else if( colData.flag == 'approvedWait' ) {
					alert('승인 대기 중 입니다.');
				} else if( colData.flag == 'stop' ) {
					alert('일시 정지된 사용자입니다.\n학원밴드에 문의하세요.');
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
hakwonApp.controller('loginController', function($scope, $location, loginService) {
	console.log('loginController call', $scope, $location, loginService);

	try {
		$('.chk input[type="checkbox"]').ezMark({checkboxCls: 'ez-chkbox', checkedCls: 'ez-checked'});


		/*	인증 시에 사용자 메인으로 이동	*/
		if( userAuth.userNo ) {
			$location.path('/userMain');
			return ;
		}

		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({headerTitle:'학원밴드'});

		var $loginSec = $('div.sec_login');

		$scope.object = {
		};

		/*	로그인 시도	*/
		$('#wrap_cont').on(clickEvent, 'button[data-act=login]', function() {
			loginService.login($location, $loginSec);
		});
		$('#wrap_cont').on('keypress', 'input[name=userPass]', function( event ) {
			if ( event.which == 13 ) {
				loginService.login($location, $loginSec);
				event.preventDefault();
			}
		});

		/*	회원 가입으로 이동	*/
		$('#wrap_cont').on(clickEvent, 'button[data-act=signUp]', function() {
			window.location.href = MENUS.sharpUrls.signUp;
		});

		$scope.$on('$viewContentLoaded', function() {
			if( window.PLATFORM ) {
				console.log('안드로이드는 아이디 저장 및 로그인 유지는 보여주지 않는다.');
			} else if( getBrowser() == 'iosApp' ) {
				console.log('아이폰은 아이디 저장 및 로그인 유지는 보여주지 않는다.');
			} else {
				$('div.sec_login > div.chk').show();
			}
			if( HakwonConstant.ServerType == 'dev' || HakwonConstant.ServerType == 'local' ) {
				$('input[name=userId]').val('student01');
				$('input[name=userPass]').val('0000');
			}
		});
		$scope.$$postDigest(comm.screenInit);

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});