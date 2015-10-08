/**
 * 메인 서비스
 */
hakwonMainApp.service('mainService', function() {
	console.log('hakwonMainApp mainService call');

	var mainService = {};

	mainService.createAllAddrText = function(hakwonObj) {
		if (!isNull(hakwonObj.street_addr1) && !isNull(hakwonObj.street_addr2)) {
			return hakwonObj.street_addr1 + hakwonObj.street_addr2;
		} else if (!isNull(hakwonObj.old_addr1) && !isNull(hakwonObj.old_addr2)) {
			return hakwonObj.all_addr_text = hakwonObj.old_addr1 + hakwonObj.old_addr2;
		} else {
			return '';
		}
	};

	/**
	 * 업로드 옵션 생성
	 */
	mainService.getLogoUploadOptions = function($scope) {
		// 파일 업로드 객체 생성
		var logoUploadOptions = new UploadOptions();
		logoUploadOptions.customExtraFields = {uploadType: CommonConstant.File.TYPE_HAKWON_LOGO, hakwonNo: $scope.hakwonNo};
		logoUploadOptions.onFinish = function(event, total) {
			if (this.errorFileArray.length + this.errorCount > 0) {
				alert('학원로고 업로드를 실패 했습니다.');
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
						$scope.hakwonObj.logo_file_path = fileInfo.filePath;
						$scope.$digest();
					} else {
						alert('이미지 파일이 아닙니다.');
					}
				}
			}
		};

		return logoUploadOptions;
	};

	return mainService;
});

/**
 * 메인 컨트롤러
 */
hakwonMainApp.controller('mainController', function($scope, $window, $location, $routeParams, mainService, CommUtil) {
	console.log('hakwonMainApp mainController call', $scope, $window, $location, $routeParams, mainService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		comm.setHeader({title:'학원 밴드 입니다.'});

		$scope.hakwonObj = {};
		$scope.userCount = {};

		$scope.getHakwonDetail = function() {

			if (isNull($routeParams.hakwon_no)) {
				//alert('학원 번호가 올바르지 않습니다.');
				return ;
			}

			CommUtil.ajax({url:contextPath+"/hakwon/hakwonDetail.do", param:{hakwon_no:$routeParams.hakwon_no}, successFun:function(data) {
				try {
					var colData = data.colData;
					if( colData ) {
						$scope.hakwonObj = colData.content;
						$scope.userCount = colData.count;
					} else {
						commProto.logger({hakwonDetailError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		$scope.getFileFullPath = function() {
			return CommUtil.createFileFullPath($scope.hakwonObj.logo_file_path, 'hakwon');
		};

		$scope.getAllAddrText = function() {
			return mainService.createAllAddrText($scope.hakwonObj);
		};

		$('#wrapper').on(clickEvent, 'button[data-act=hakwonModify]', function() {
			CommUtil.locationHref(PageUrl.master.hakwonModify, {}, 'hakwon');
			return false;
		});

		$('#wrapper').on(clickEvent, 'button[data-act=hakwonIntro]', function() {
			CommUtil.locationHref(PageUrl.common.hakwonIntro, {}, 'hakwon');
			return false;
		});

		if (!isNull($routeParams.hakwon_no)) {
			$scope.hakwonNo = $routeParams.hakwon_no;
		}
		$scope.checkAuthType = comm.checkAuthType;
		$scope.getHakwonDetail();

		/* 초기화 */
		$scope.$$postDigest(function() {
			// 파일 업로드 객체 생성
			if( comm.isAndroidUploader() ) {
				angular.element("input[data-act=logo_upload]").click(function() {
					delete window.uploadCallBack;
					window.uploadCallBack = function(uploadJsonStr) {
						try {
							var resultObj = JSON.parse(uploadJsonStr);
							if( resultObj.error ) {
								alert('파일 업로드를 실패 했습니다.');
							} else {
								var fileInfo = resultObj.colData;
								if (fileInfo.imageYn == 'Y') {
									$scope.hakwonObj.logo_file_path = fileInfo.filePath;
									$scope.$digest();
								} else {
									alert('이미지 파일이 아닙니다.');
								}
							}
						} catch(e) {
							alert('파일 업로드를 실패 했습니다.');
						}
					};
					var param = {
						fileType : 'img'
						, multipleYn : 'N'
						, callBack : 'uploadCallBack'
						, upload : {
							url : window.location.protocol+'//'+window.location.host+uploadUrl
							, param : {
								uploadType : CommonConstant.File.TYPE_HAKWON_LOGO
								, hakwonNo : $scope.hakwonNo
							}
							, cookie : document.cookie
						}
					};
					window.PLATFORM.fileChooser(JSON.stringify(param));

					return false;
				});
			} else {
				$scope.fileUploadObj = $("input[data-act=logo_upload]").html5_upload(mainService.getLogoUploadOptions($scope));
			}

			/*	sns 공유 초기화	*/
			setTimeout(function(){
				comm.snsShareInit(function() {
					if( window.PLATFORM ) {
						$('div.sns_area').show();
					}
				});
			}, 1000);
		});

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