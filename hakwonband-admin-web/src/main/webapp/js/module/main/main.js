/**
 * 메인 서비스
 */
hakwonMainApp.service('mainService', function() {
	console.log('hakwonMainApp mainService call');
});

/**
 * 메인 컨트롤러
 */
hakwonMainApp.controller('mainController', function($scope, $location, mainService) {
	console.log('hakwonMainApp mainController call', $scope, $location, mainService);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader({title:'학원밴드 관리자'});


		$("#wrapper").show();

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
			window.location = 'hakwonband://notification/getToken';
		}

		$scope.debugOn = function() {
			alert('디버그 모드를 활성화 합니다.');
			isDebug = true;

			$scope.isDebug = isDebug;
			$scope.browserVal = getBrowser();
			$scope.userAuthVal = JSON.stringify(userAuth);
		};

		$scope.isDebug = isDebug;
		$scope.browserVal = getBrowser();
		$scope.userAuthVal = JSON.stringify(userAuth);

		$scope.getMobileAuthKey = function() {
			var browserVal = getBrowser();
			if( browserVal == 'iosApp' ) {
				alert('아이폰 앱에서 푸시키를 다시 요청 합니다.');
				window.location = 'hakwonband://notification/getToken';
			} else if( browserVal == 'androidApp' ) {
				alert('안드로이드 앱에서 푸시키를 다시 요청 합니다.');
				var newKey = window.PLATFORM.getGcmKey();
				setPushNotiKey(newKey, CommonConstant.DeviceType.android, '', function(data) {
					if( data.flag == 'success' ) {
						userAuth.deviceAuth = {
							device_type : colData.authUserInfo.device_type
							, device_token : colData.authUserInfo.device_token
						};
					}
				});
			} else {
				alert('앱이 아닙니다.');
			}
		};

		$scope.getTestMessage = function() {
			$.ajax({
				url: contextPath+"/testMsg.do",
				type: "post",
				data: '',
				dataType: "json",
				success: function(data) {
					if( data.colData.flag == 'success' ) {
						alert('테스트 메세지를 요청 했습니다.');
					} else {
						alert('테스트 메세지 요청을 실패 했습니다.');
					}
				},
				error: function(xhr, textStatus, errorThrown) {
				}
			});
		};


	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});