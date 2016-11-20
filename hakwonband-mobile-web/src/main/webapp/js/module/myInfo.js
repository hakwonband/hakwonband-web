/**
 * 회원정보 서비스
 */
hakwonApp.service('myInfoService', function($http) {
	console.log('myInfoService call');

	var myInfoService = {};

	/**
	 * 회원 탈퇴
	 */
	myInfoService.memberOut = function() {
		$.ajax({
			url: contextPath+"/mobile/user/memberOut.do",
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
	myInfoService.alarmOff = function(start_time, end_time, callback) {
		$.ajax({
			url: contextPath+"/mobile/user/alarmOff.do",
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

	myInfoService.getMobileAuthKey = function() {
		var browserVal = getBrowser();
		if( browserVal == 'iosApp' ) {
			alert('아이폰 앱에서 푸시키를 다시 요청 합니다.(작업중)');
			//window.location = 'hakwonband://notification/getToken';
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

	myInfoService.getTestMessage = function() {
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

	return myInfoService;
});


/*	내정보 */
hakwonApp.controller('myInfoController', function($scope, $location, $routeParams, myInfoService, CommUtil, $timeout){
	console.log('myInfoController call - myInfo.html');

	/*  인증 정보 체크  */
	comm.authCheckFilter();

	/*	헤더 정보 셋팅	*/
	hakwonHeader.setHeader({viewType:'user', headerTitle:'내정보'});

	$scope.reloadRoute = function() {
		$window.location.reload();
	};

	$scope.CommUtil = CommUtil;

	/*	사용자 정보	*/
	$scope.userInfo = userAuth;

	/*	사용자 정보 수정	*/
	$scope.modify = function() {
		window.location.href = MENUS.sharpUrls.memberModify;
	};

	/*	알림 off 타임	*/
	$scope.alarm_modify = false;
	$scope.alarm_off_isset = false;
	$scope.alarm_off_save = false;
	$scope.start_time = null;
	$scope.end_time = null;
	if( userAuth.start_time && userAuth.end_time ) {
		$scope.alarm_off_isset = true;
		$scope.start_time = new Date(userAuth.start_time);
		$scope.end_time = new Date(userAuth.end_time);
	}

	/**
	 * 알림 on/off
	 */
	$scope.alarmOff = function(type) {
		if( type == true ) {
			$scope.start_time = new Date();
			$scope.end_time = new Date();
			$scope.alarm_off_isset = true;
			$scope.alarm_off_save = true;
		} else {
			$scope.alarm_off_isset = false;
			$scope.alarm_off_save = false;
			$scope.start_time = null;
			$scope.end_time = null;
		}
	}

	$scope.alarm_modify_fun = function(flag) {
		if( flag == true ) {
			$scope.alarm_modify = true;
		} else {
			/*	취소	*/
			$scope.alarm_modify = false;
		}
	}

	/*	알림 off 설정	*/
	$scope.alarmOffSave = function() {

	}

	/*	알림 off 선택	*/
	$scope.alarmOffChange = function() {
		if( $scope.alarm_off_time == '' ) {
			/*	동작 안함	*/
		} else {
			myInfoService.alarmOff($scope.alarm_off_time, function(offTime) {
				userAuth.off_date = offTime;
				$scope.view_alarm_off_time = offTime;
				$scope.alarm_off_time = '';
			});
		}
	}



	/*	로그 아웃	*/
	$scope.logout = function() {
		if( $scope.is_app == true ) {
			var promptVal = window.prompt("로그아웃 하시려면'logout'를 입력해주세요.\ntype the phrase 'logout' to sign out");
			if( promptVal == 'logout'  ) {
				window.location = '/logout.do';
			}
		} else {
			window.location = '/logout.do';
		}
	};

	/*	탈퇴	*/
	$scope.memberOut = function() {
		var promptVal = window.prompt("탈퇴 하시면 학원밴드 서비스를 더이상 이용할 수 없습니다.\n탈퇴 하시려면 '탈퇴 합니다.'를 입력해 주세요.");

		if( promptVal == '탈퇴 합니다.'  ) {
			myInfoService.memberOut();
		} else {
			alert('메세지를 정확히 입력해 주세요.');
		}
	};

	/**
	 * 홈으로 이동
	 */
	$scope.goHome = function() {
		console.log('goHome');
		window.location = '#/userMain';
	}

	/**
	 * 학원 검색
	 */
	$scope.goHakwonSearch = function() {
		console.log('goHakwonSearch');
		window.location = '#/hakwon/search';
	}

	$scope.is_app = false;
	var current_browser = getBrowser();
	if( current_browser.indexOf('App') > 0 ) {
		$scope.is_app = true;
	}

	$scope.isDebug = false;
	$scope.debugOn = function() {
		alert('디버그 모드를 활성화 합니다.');
		isDebug = true;

		$scope.isDebug = isDebug;
		$scope.browserVal = getBrowser();
		$scope.clickEvent = clickEvent;
		$scope.userAuthVal = JSON.stringify(userAuth);
	};

	$scope.getMobileAuthKey = myInfoService.getMobileAuthKey;
	$scope.getTestMessage = myInfoService.getTestMessage;


	$scope.$$postDigest(function() {
		console.log('$$postDigest call');

		$timeout(function() {
			$('div.ez-chkbox input[type="checkbox"]').ezMark({checkboxCls: 'ez-chkbox', checkedCls: 'ez-checked'});
		}, 100);

		comm.screenInit();
		// 파일 업로드 객체 생성
		if( comm.isAndroidUploader() ) {
			angular.element("input[data-act=photo_upload]").click(function() {
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
});