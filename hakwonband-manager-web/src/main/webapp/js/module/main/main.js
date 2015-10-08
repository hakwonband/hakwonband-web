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
		comm.setHeader({title:'학원밴드 매니저'});


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

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});