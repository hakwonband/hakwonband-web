/**
 * 설정 서비스
 */
hakwonMainApp.service('settingService', function($http, CommUtil) {
	console.log('hakwonMainApp settingService call', CommUtil);

	var settingService = {};

	/**
	 * 베너 기본 가격 리스트
	 */
	settingService.bannerDefaultPriceList = function() {
		$.ajax({
			url: contextPath+"/admin/setting/bannerDefaultPriceList.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('베너 가격 조회를 실패 했습니다.');
						return false;
					}

					var colData = data.colData;

					var dataList = [];
					for(var i=1; i<=4; i++) {
						var tempData = {};
						tempData.size = i;
						tempData.price = colData[i];
						dataList.push(tempData);
					}
					colData.dataList = dataList;
					$('div[data-view=defaultPriceView]').html($.tmpl(hakwonTmpl.setting.bannerDefaultPrice.listRow, colData));
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/**
	 * 베너 기본 가격 저장
	 */
	settingService.bannerDefaultPriceSave = function() {
		var $priceView = $('div[data-view=defaultPriceView]');
		var sizeArray = $priceView.find('input[name=size]');
		var priceArray = $priceView.find('input[name=price]');
		var param = {size:[], price:[]};
		for(var i=0; i<sizeArray.length; i++) {
			var size = sizeArray[i].value;
			var price = priceArray[i].value;

			param.size.push(size);
			param.price.push(price);
		}

		$.ajax({
			url: contextPath+"/admin/setting/bannerDefaultPriceSave.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			data : $.param(param, true),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('베너 가격 수정을 실패 했습니다.');
						return false;
					}

					var colData = data.colData;

					if( colData.flag == CommonConstant.Flag.success ) {
						alert('수정 완료');
					} else {
						alert('베너 가격 수정을 실패 했습니다.');
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/*	광고 입금 계좌 정보	*/
	settingService.advertiseBankInfo = function() {
		$.ajax({
			url: contextPath+"/admin/setting/advertiseBankInfo.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('입금 계좌 정보 조회를 실패 했습니다.');
						return false;
					}

					$('input[name=bankInfo]').val(data.colData.bankInfo);
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/*	광고 입금 계좌 정보 저장	*/
	settingService.advertiseBankInfoSave = function() {
		var bankInfo = $('input[name=bankInfo]').val();
		if( isNull(bankInfo) ) {
			alert('계좌 정보를 입력해 주세요.');
			return false;
		}
		$.ajax({
			url: contextPath+"/admin/setting/advertiseBankInfoSave.do",
			type: "post",
			data : $.param({bankInfo:bankInfo}),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('입금 계좌 저장을 실패 했습니다.');
						return false;
					}

					if( data.colData.flag == CommonConstant.Flag.success ) {
						alert('입금 계좌 저장 완료.');
					} else {
						alert('입금 계좌 저장을 실패 했습니다.');
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/**
	 * 알림 off
	 */
	settingService.alarmOff = function(offTime, callback) {
		$.ajax({
			url: contextPath+"/admin/user/alarmOff.do",
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

	/**
	 * 알림 저장
	 */
	settingService.alarmSave = function(param, callback) {
		$.ajax({
			url: contextPath+"/admin/user/alarmSave.do",
			type: "post",
			async : false,
			dataType: "json",
			data : param,
			success: function(data) {
				if( data.error ) {
					alert('알림 일시 정지를 실패 했습니다.');
					return false;
				}
				var colData = data.colData;
				if( colData && colData.flag == CommonConstant.Flag.success ) {
					if( callback ) {
						callback(colData);
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

	return settingService;
});

/**
 * 베너 기본 가격
 */
hakwonMainApp.controller('settingBannerDefaultPriceController', function($scope, $location, $routeParams, settingService, CommUtil) {
	console.log('hakwonMainApp settingBannerDefaultPriceController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 저장
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=save]', settingService.bannerDefaultPriceSave);


		$("#wrapper").show();
		$scope.$on('$viewContentLoaded', function() {
			settingService.bannerDefaultPriceList();
		});
		$scope.$$postDigest(function(){
			console.log('$$postDigest');
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 광고 입금 계좌 정보
 */
hakwonMainApp.controller('settingAdvertiseBankInfoController', function($scope, $location, $routeParams, settingService, CommUtil) {
	console.log('hakwonMainApp settingAdvertiseBankInfoController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 저장
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=save]', settingService.advertiseBankInfoSave);


		$("#wrapper").show();
		$scope.$on('$viewContentLoaded', function() {
			settingService.advertiseBankInfo();
		});
		$scope.$$postDigest(function(){
			console.log('$$postDigest');
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 알림 off 설정
 */
hakwonMainApp.controller('settingAlarmOffController', function($scope, $location, $routeParams, settingService, CommUtil) {
	console.log('hakwonMainApp settingAlarmOffController call');

	/*	페이지 초기화 호출	*/
	hakwonCommon.pageInit();

	/*	공통 유틸	*/
	$scope.CommUtil = CommUtil;

	/**
	 * 알림 설정
	 */
	$scope.start_h = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09' ,'10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
	$scope.end_h = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09' ,'10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
	$scope.start_m = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45' ,'50', '55'];
	$scope.end_m = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45' ,'50', '55'];

	/*	알림 off 타임	*/
	$scope.alarm_modify = false;
	$scope.alarm_off_isset = false;
	$scope.start_time_h = null;
	$scope.start_time_m = null;
	$scope.end_time_h = null;
	$scope.end_time_m = null;
	if( userAuth.start_time && userAuth.end_time ) {
		$scope.alarm_off_isset = true;
		$scope.alarm_type = true;

		var start_time_array = userAuth.start_time.split(':');
		var end_time_array = userAuth.end_time.split(':');

		$scope.start_time_h = start_time_array[0];
		$scope.start_time_m = start_time_array[1];
		$scope.end_time_h = end_time_array[0];
		$scope.end_time_m = end_time_array[1];
	} else {
		$scope.alarm_type = false;

		$scope.start_time_h = '00';
		$scope.start_time_m = '00';
		$scope.end_time_h = '00';
		$scope.end_time_m = '00';
	}

	$scope.alarm_modify_fun = function(flag) {
		if( flag == true ) {
			$scope.alarm_modify = true;
		} else {
			/*	취소	*/
			$scope.alarm_modify = false;
			$scope.alarm_type = $scope.alarm_off_isset;
		}
	}

	/**
	 * 알림 저장
	 */
	$scope.alarm_save_fun = function() {
		var param = {
			alarm_type : '',
			start_time : '',
			end_time : ''
		};
		if( $scope.alarm_type ) {
			if( isNull($scope.start_time_h) || isNull($scope.start_time_m) || isNull($scope.end_time_h) || isNull($scope.end_time_m) ) {
				alert('시간을 빠짐없이 입력해 주세요.');
				return ;
			}
			param.alarm_type = 'Y';
			param.start_time = $scope.start_time_h+':'+$scope.start_time_m;
			param.end_time = $scope.end_time_h+':'+$scope.end_time_m;

			if( param.start_time == param.end_time ) {
				alert('시작시간과 종료 시간을 다르게 설정해 주세요.');
				return ;
			}
		} else {
			param.alarm_type = 'N';
			param.start_time = null;
			param.end_time = null;
		}
		settingService.alarmSave(param, function(colData) {
			if( colData.flag == 'success' ) {
				$scope.alarm_modify = false;

				if( $scope.alarm_type ) {
					$scope.alarm_off_isset = true;
					userAuth.start_time = param.start_time;
					userAuth.end_time = param.end_time;
				} else {
					$scope.alarm_off_isset = false;
					$scope.start_time_h = '';
					$scope.start_time_m = '';
					$scope.end_time_h = '';
					$scope.end_time_m = '';
				}
			} else {
				alert('알림 저장을 실패 했습니다.');
			}
		});
	}


	$("#wrapper").show();
	$scope.$$postDigest(function(){
		console.log('$$postDigest');
	});
});