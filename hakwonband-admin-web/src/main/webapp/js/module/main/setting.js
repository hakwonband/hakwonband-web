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

	/*	알림 off 타임	*/
	$scope.alarm_off_time = '';
	if( userAuth.off_date ) {
		$scope.view_alarm_off_time = userAuth.off_date;
	}
	/*	알림 off 선택	*/
	$scope.alarmOffChange = function() {
		if( $scope.alarm_off_time == '' ) {
			/*	동작 안함	*/
		} else {
			settingService.alarmOff($scope.alarm_off_time, function(offTime) {
				userAuth.off_date = offTime;
				$scope.view_alarm_off_time = offTime;
				$scope.alarm_off_time = '';
			});
		}
	}

	$("#wrapper").show();
	$scope.$$postDigest(function(){
		console.log('$$postDigest');
	});
});