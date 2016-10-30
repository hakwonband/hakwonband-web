/**
 * 광고 서비스
 */
hakwonMainApp.service('adBannerService', function($http, CommUtil) {
	console.log('hakwonMainApp adBannerService call');

	var adBannerService = {};

	/**
	 * 광고 리스트 조회
	 */
	adBannerService.adList = function($scope, pageNo) {
		var queryString = 'pageNo='+pageNo+'&hakwonNo='+hakwonInfo.hakwon_no;

		/**
		 * 학원 번호 파라미터로 들어갈수 있음
		 */
		$.ajax({
			url: contextPath+"/hakwon/edvertise/advertiseReqList.do",
			type: "post",
			data: queryString,
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('광고 리스트 조회를 실패 했습니다.');
						return false;
					}

					var colData = data.colData;
					if( colData.advertiseReqList ) {
						var $listDiv = $scope.$mainEle.find('div[data-view=list-div]');
						if( colData.advertiseReqList.length > 0 ) {
							$listDiv.removeClass().addClass('ibox-content').css('padding', '');
							$.tmpl(hakwonTmpl.adBanner.listRow, colData).appendTo($listDiv);
						} else {
							$listDiv.removeClass().addClass('ibox-content text-center').css('padding', '200px 0');
							$.tmpl(hakwonTmpl.adBanner.listRowNoData).appendTo($listDiv);
						}

						/*	페이징 처리	*/
						hakwonCommon.genPageNav({target:$scope.$mainEle.find('div[data-view=page-nav]'), currentPageNo:1, totalCount:1, pageScale:1});
					} else {
						alert('다시 시도해 주세요.');
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	}

	/*	상세 정보 조회	*/
	adBannerService.viewDetailInfo = function($scope, reqNo) {
		CommUtil.ajax({url:contextPath+"/hakwon/edvertise/detail.do", param:{reqNo:reqNo}, successFun:function(data) {
			try {
				var reqDetailInfo = data.colData;
				var banner_web_path = HakwonConstant.FileServer.ATTATCH_DOMAIN+reqDetailInfo.banner_file_path;
				reqDetailInfo.banner_web_path = banner_web_path;

				/*	동이름 배열	*/
				var localDongNameArray = [];
				/*	월 배열	*/
				var viewMonthArray = [];

				/**
				 * 배열 데이타 셋팅 start
				 */
				var localDongNameArrayTemp = [];
				var viewMonthArrayTemp = [];
				for(var i=0; i<reqDetailInfo.advertiseReqLocalList.length; i++) {
					var reqLocalInfo = reqDetailInfo.advertiseReqLocalList[i];
					localDongNameArrayTemp.push(reqLocalInfo.dong);
					viewMonthArrayTemp.push(reqLocalInfo.view_month);

					if( i == 0 ) {
						reqDetailInfo.sido = reqLocalInfo.sido;
						reqDetailInfo.gugun = reqLocalInfo.gugun;
					}
				}
				$.each(localDongNameArrayTemp, function(i, el){
					if($.inArray(el, localDongNameArray) === -1) localDongNameArray.push(el);
				});
				$.each(viewMonthArrayTemp, function(i, el){
					if($.inArray(el, viewMonthArray) === -1) viewMonthArray.push(el);
				});

				/**
				 * 배열 데이타 셋팅 end
				 */

				$scope.localDongNameArray = localDongNameArray;
				$scope.viewMonthArray = viewMonthArray;
				$scope.reqDetailInfo = reqDetailInfo;
				$scope.monthPriceList = reqDetailInfo.monthPriceList;

				$scope.$$postDigest(function(){
					/*	등롣된 배너 정보 보여준다.	*/
					for(var i=0; i<reqDetailInfo.advertiseReqLocalList.length; i++) {
						var reqLocalInfo = reqDetailInfo.advertiseReqLocalList[i];
						$('td[data-dong='+reqLocalInfo.dong+'][data-month='+reqLocalInfo.view_month+'] > i').show();

						if( reqDetailInfo.deposit_yn == 'Y' && reqLocalInfo.current_view == 'Y' ) {
							$('td[data-dong='+reqLocalInfo.dong+'][data-month='+reqLocalInfo.view_month+']').addClass('ad_open');
						}
					}
				});
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/**
	 * 작성 페이지 월 배열
	 */
	adBannerService.tableHeaderCreate = function() {
		var startMonthObj = new Date();
		var tableHtml = '';
		for(var i=1; i<=12; i++) {
			var viewDateStr = startMonthObj.toString('yyyy-MM');

			tableHtml += '	<th class="i-checks" data-type="all_check_month" data-month="'+viewDateStr+'">';
			tableHtml += '		<label for="check_all_'+viewDateStr+'">';
			tableHtml += '			<input type="checkbox" value="'+viewDateStr+'" id="check_all_'+viewDateStr+'"> '+viewDateStr;
			tableHtml += '		</label>';
			tableHtml += '	</th>';

			startMonthObj.add({ months: 1 });
		}
		$('table[data-type=calendar_table] > thead > tr').append(tableHtml);
		$('table[data-type=calendar_table] > thead > tr > th.i-checks').iCheck({
			checkboxClass: 'icheckbox_square-green'
		});

		/**
		 * 해당 월 전체 체크
		 */
		$('table[data-type=calendar_table] > thead > tr > th[data-type=all_check_month]').on('ifChecked', function(event){
			var clickMonth = $(this).attr('data-month');
			$('td[data-month='+clickMonth+']').iCheck('check');
			$('td[data-month='+clickMonth+'] div.disabled').each(function(i, thisObj) {
				$(this.parentNode.parentNode).iCheck('uncheck');
			});

			/*	베너 가격 계산	*/
			adBannerService.advertisePriceCalc();
		}).on('ifUnchecked', function(event){
			var clickMonth = $(this).attr('data-month');
			$('td[data-month='+clickMonth+']').iCheck('uncheck');

			/*	베너 가격 계산	*/
			adBannerService.advertisePriceCalc();
		});

	};

	/**
	 * 작성 페이지 구군 선택시
	 */
	adBannerService.writeGugunChange = function() {
		var sidoValue = $('select[name=sido] > option:selected').text();
		var gugunValue = $('select[name=gugun] > option:selected').text();
		if( isNull(gugunValue) ) {
			return ;
		}
		var param = {sido:sidoValue, gugun:gugunValue};
		CommUtil.ajax({url:contextPath+"/hakwon/address/dongList.do", param:param, successFun:function(data) {
			try {
				var colData = data.colData;

				if( colData.dataList && colData.dataList.length > 0 ) {
					var tableHtml = '';
					for(var i=0; i<colData.dataList.length; i++) {
						var dongName = colData.dataList[i];
						tableHtml += '<tr>';
						tableHtml += '	<td>'+dongName+'</td>';
						for(var j=1; j<=12; j++) {
							var columnMonth = $('table[data-type=calendar_table] > thead > tr > th:eq('+j+')').attr('data-month');
							tableHtml += '	<td class="i-checks" data-month="'+columnMonth+'" data-dong="'+dongName+'">';
							tableHtml += '		<label data-type="'+columnMonth+'" for="check_'+i+'_'+columnMonth+'">'
							tableHtml += '			<input type="checkbox" data-month="'+columnMonth+'" data-dong="'+dongName+'" name="adMonthCheck" id="check_'+i+'_'+columnMonth+'">';
							tableHtml += '		</label>';
							tableHtml += '		<span>11</span>';
							tableHtml += '	</td>';
						}
						tableHtml += '</tr>';
					}
					$('table[data-type=calendar_table] > tbody').html(tableHtml);

					$('table[data-type=calendar_table] > tbody > tr > td.i-checks').iCheck({
						checkboxClass: 'icheckbox_square-green'
					});

					/*	월 클릭시	*/
					$('table[data-type=calendar_table] > tbody > tr > td').on('ifChecked', function(event){
						/*	베너 가격 계산	*/
						adBannerService.advertisePriceCalc();
					}).on('ifUnchecked', function(event){
						/*	베너 가격 계산	*/
						adBannerService.advertisePriceCalc();
					});

					/*	가격 계산	*/
					adBannerService.advertisePriceCalc();
					$('table[data-type=calendar_table] > thead > tr > th.i-checks').iCheck('uncheck');

					/*	전체 동을 로드 했으면 등록된 베너 정보들을 로드한다.	*/
					adBannerService.regDongBannerList();
				} else {
					alert('다시 시도해 주세요.');
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/**
	 * 등록된 베너 리스트
	 */
	adBannerService.regDongBannerList = function() {
		var sidoValue = $('select[name=sido] > option:selected').text();
		var gugunValue = $('select[name=gugun] > option:selected').text();
		var param = {sido:sidoValue, gugun:gugunValue, hakwonNo:hakwonInfo.hakwon_no};
		CommUtil.ajax({url:contextPath+"/hakwon/edvertise/regDongBannerList.do", param:param, successFun:function(data) {
			try {
				$('table[data-type=calendar_table] > tbody > tr > td').iCheck('enable');

				var colData = data.colData;
				if( colData ) {
					/*	지역에 등록된 광고 리스트	*/
					if( colData.regDongBannerList && colData.regDongBannerList.length > 0 ) {
						for(var i=0; i<colData.regDongBannerList.length; i++) {
							var adDataInfo = colData.regDongBannerList[i];
							var viewMonthStr = adDataInfo.view_month.substring(0, 4)+'-'+adDataInfo.view_month.substring(4, 6);

							$('td[data-month='+viewMonthStr+'][data-dong='+adDataInfo.dong+'] > span').text(11-adDataInfo.banner_total_count);
							if( 11-adDataInfo.banner_total_count == 0 ) {
								$('td[data-month='+viewMonthStr+'][data-dong='+adDataInfo.dong+']').addClass('td_disabled_01');
							}
						}
					}
					/*	현재 학원이 등록한 광고 리스트	*/
					if( colData.hakwonRegDongBannerList && colData.hakwonRegDongBannerList.length > 0 ) {
						for(var i=0; i<colData.hakwonRegDongBannerList.length; i++) {
							var adDataInfo = colData.hakwonRegDongBannerList[i];
							var viewMonthStr = adDataInfo.view_month.substring(0, 4)+'-'+adDataInfo.view_month.substring(4, 6);

							$('td[data-month='+viewMonthStr+'][data-dong='+adDataInfo.dong+']').iCheck('disable');

							$('td[data-month='+viewMonthStr+'][data-dong='+adDataInfo.dong+']').removeClass('td_disabled_01').addClass('td_disabled_02');
						}
					}
				} else {
					alert('시스템 오류가 발생 했습니다.', data.error);
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/**
	 * 광고 요청 가격 계산
	 */
	adBannerService.advertisePriceCalc = function() {
		var bannerSize = $('select[name=banner_size]').val();

		var adMonthArray = {};
		$('input[type=checkbox][name=adMonthCheck]:checked').each(function(idx, thisObj) {
			var monthVal= $(thisObj).attr('data-month');

			if( adMonthArray[monthVal] ) {
				adMonthArray[monthVal]++;
			} else {
				adMonthArray[monthVal] = 1;
			}
		});

		var adMonthKeyArray = Object.keys(adMonthArray);
		if( adMonthKeyArray.length == 0 ) {
			$('div[data-view=price_preview]').html('');
		} else {
			var viewPriceHtml = '';
			var viewTotalPrice = 0;

			for(var i=0; i<adMonthKeyArray.length; i++) {
				var viewMonth = adMonthKeyArray[i];
				var adCount = adMonthArray[viewMonth];

				var price = adBannerService.monthBannerPrice[viewMonth.replace("-", "")+'_'+bannerSize];

				viewPriceHtml += viewMonth+' : ' + price + ' * ' + adCount + '(지역 카운트) = ' + (price*adCount) + '<br />';

				viewTotalPrice += price*adCount;
			}
			viewPriceHtml += '--------------------------------<br />';
			viewPriceHtml += '총액 : ' + viewTotalPrice;

			$('div[data-view=price_preview]').html(viewPriceHtml);
		}
	}

	/**
	 * 광고 등록
	 */
	adBannerService.adBannerRegist = function() {
		var $mainNgView = $('#mainNgView');

		var regParam = {};
		var title = $mainNgView.find('input[name=title]').val();
		if( isNull(title) ) {
			alert('제목을 입력해 주세요.');
			return false;
		}
		regParam.title = title;

		var redirect_url = $mainNgView.find('input[name=redirect_url]').val();
		regParam.redirectUrl = redirect_url;

		var sido = $mainNgView.find('select[name=sido] > option:selected').text();
		if( isNull(sido) ) {
			alert('시도 지역을 선택해 주세요.');
			return false;
		}
		regParam.sido = sido;

		var gugun = $mainNgView.find('select[name=gugun] > option:selected').text();
		if( isNull(gugun) ) {
			alert('시군구 지역을 선택해 주세요.');
			return false;
		}
		regParam.gugun = gugun;

		/*	베너 싸이즈	*/
		regParam.bannerSize = $mainNgView.find('select[name=banner_size]').val();;


		var selectAdData = [];
		$('input[type=checkbox][name=adMonthCheck]:checked').each(function(idx, thisObj) {
			var monthVal= $(thisObj).attr('data-month');
			var dongVal	= $(thisObj).attr('data-dong');

			selectAdData.push(dongVal+CommonConstant.ChDiv.CH_DEL+monthVal);
		});
		regParam.selectAdData = selectAdData;

		var bannerFileNo = $('div[data-view=banner_preview] > img').attr('data-file-no');
		if( isNull(bannerFileNo) ) {
			alert('광고 베너를 업로드해 주세요.');
			return false;
		}
		regParam.bannerFileNo = bannerFileNo;
		regParam.hakwonNo = hakwonInfo.hakwon_no;

		var queryString = $.param(regParam, true);
		$.ajax({
			url: contextPath+"/hakwon/edvertise/registAdvertise.do",
			type: "post",
			data: queryString,
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				var colData = data.colData;
				if( colData ) {
					if( colData.advertiseReqNo ) {
						window.location.href = PageUrl.common.edBannerView+'?reqNo='+colData.advertiseReqNo;
					} else {
						alert('광고 등록을 실패 했습니다.');
					}
				} else {
					alert('시스템 오류가 발생 했습니다.', data.error);
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/**
	 * 광고 취소
	 */
	adBannerService.adBannerCancel = function(reqNo, callBack) {
		var queryString = $.param({reqNo:reqNo}, true);
		$.ajax({
			url: contextPath+"/hakwon/edvertise/advertiseCancel.do",
			type: "post",
			data: queryString,
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				if( data.error ) {
					alert('통신을 실패 했습니다.');
					return ;
				}
				var colData = data.colData;
				if( colData.flag == CommonConstant.Flag.success ) {
					callBack();
				} else {
					alert('광고 취소를 실패 했습니다.');
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/*	테이블 초기화	*/
	adBannerService.teableClear = function() {
		$('table[data-type=calendar_table] > thead > tr > th.i-checks').iCheck('uncheck');
		$('table[data-type=calendar_table] > tbody > tr').remove();
	};

	return adBannerService;
});

/**
 * 리스트
 */
hakwonMainApp.controller('adBannerListController', function($scope, $location, $routeParams, adBannerService, CommUtil) {
	console.log('hakwonMainApp adBannerListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'광고 리스트'}]);

		/**
		 * 페이지 번호 선택
		 */
		$scope.selectPageNo = function() {
			var pageNo = $(this).attr('data-page-no');
			$location.path('/edBanner/list?hakwon_no='+hakwonInfo.hakwon_no+'&pageNo='+pageNo);
		};

		var pageNo = $routeParams.pageNo;
		if( !pageNo ) {
			pageNo = 1;
		}

		$scope.$on('$viewContentLoaded', function() {
			console.log('adBannerListController $viewContentLoaded');

			$scope.$mainEle = $('#mainNgView');

			/*	광고 리스트 조회	*/
			adBannerService.adList($scope, pageNo);
		});

		/*	작성 페이지로 이동	*/
		$scope.write = function() {
			$location.path('/edBanner/write');
		}


		$("#wrapper").show();

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 뷰
 */
hakwonMainApp.controller('adBannerViewController', function($scope, $location, $route, $routeParams, adBannerService, CommUtil) {
	console.log('hakwonMainApp adBannerViewController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.common.edBannerList+'?hakwon_no='+hakwonInfo.hakwon_no, title:'광고'}, {url:'#', title:'상세'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	요청 번호	*/
		var reqNo = $routeParams.reqNo;

		/*	목록 이동	*/
		$scope.goList = function () {
			if (history.length > 1) {
				window.history.back();
			} else {
				$location.path('/edBanner/list?hakwon_no='+hakwonInfo.hakwon_no);
			}
		}

		/**
		 * 취소 여부
		 */
		$scope.isCancel = function(cancelYn) {
			if( cancelYn == 'Y' ) {
				return true;
			} else {
				return false;
			}
		}
		/*	취소 하기	*/
		$scope.cancel = function() {
			if( window.confirm('광고를 정말 취소 하시겠습니까?\n취소한 광고는 다시 복구 할 수 없습니다.') ) {
				adBannerService.adBannerCancel(reqNo, function() {
					alert('광고 취소를 성공 했습니다.');
					$route.reload();
				});
			}
		};

		/*	수정 이동	*/
		$scope.goEdit = function () {
			window.location.href = PageUrl.edBanner.edit+'?hakwon_no='+hakwonInfo.hakwon_no+'&reqNo='+reqNo;
		}


		/*	광고 상세 조회	*/
		adBannerService.viewDetailInfo($scope, reqNo);

		$scope.$on('$viewContentLoaded', function() {
			console.log('adBannerViewController $viewContentLoaded call');
		});

		$("#wrapper").show();

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 작성
 */
hakwonMainApp.controller('adBannerWriteController', function($scope, $location, adBannerService, CommUtil) {
	console.log('hakwonMainApp adBannerWriteController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.common.edBannerList+'?hakwon_no='+hakwonInfo.hakwon_no, title:'광고'}, {url:'#', title:'작성'}]);

		/**
		 * 시도 리스트
		 */
		CommUtil.ajax({url:contextPath+"/hakwon/address/sidoList.do", successFun:function(data) {
			try {
				$scope.sidoArray = data.colData.dataList;
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});

		/**
		 * 월별 베너별 가격 조회
		 */
		CommUtil.ajax({url:contextPath+"/hakwon/edvertise/advertiseMonthPrice.do", successFun:function(data) {
			try {
				adBannerService.monthBannerPrice = data.colData.monthBannerPrice;
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});

		/**
		 * 시도 선택시
		 */
		$scope.sido_change = function() {
			var sidoValue = this.sidoName;
			if( !isNull(sidoValue) ) {
				CommUtil.ajax({param:{sido:sidoValue}, url:contextPath+"/hakwon/address/gugunList.do", successFun:function(data) {
					try {
						$scope.gugunArray = data.colData.dataList;
						adBannerService.teableClear();
					} catch(ex) {
						commProto.errorDump({errorObj:ex});
					}
				}});
			}
		};

		/**
		 * 구군 선택시
		 */
		$scope.gugun_change = function() {
			adBannerService.writeGugunChange();
		};

		/*	취소 하기	*/
		$scope.cancel = function() {
			if (history.length > 1) {
				window.history.back();
			} else {
				$location.path('/edBanner/list?hakwonNo='+hakwonInfo.hakwon_no);
			}
		};

		/**
		 * 광고 등록
		 */
		$scope.regist = function() {
			adBannerService.adBannerRegist();
		};

		/**
		 * onload
		 */
		$scope.$on('$viewContentLoaded', function() {
			console.log('adBannerWriteController $viewContentLoaded call');

			/*	베너 싸이즈 변경시	*/
			$('select[name=banner_size]').change(function() {
				if( this.value == 1 ) {
					$('div[data-view=banner_sample_view]').html('<div class="ad_size_sample ad_size_01">148px x 148px</div>');
				} else if( this.value == 2 ) {
					$('div[data-view=banner_sample_view]').html('<div class="ad_size_sample ad_size_02">296px x 148px</div>');
				} else if( this.value == 3 ) {
					$('div[data-view=banner_sample_view]').html('<div class="ad_size_sample ad_size_03">444px x 148px</div>');
				} else if( this.value == 4 ) {
					$('div[data-view=banner_sample_view]').html('<div class="ad_size_sample ad_size_04">592px x 148px</div>');
				}

				/*	베너 가격 계산	*/
				adBannerService.advertisePriceCalc();
			});

			/*	테이블 헤더 생성	*/
			adBannerService.tableHeaderCreate();
		});

		$scope.$$postDigest(function() {
			/*	업로드 객체 생성	*/
			/*	파일 업로드 객체 생성		*/
			if( comm.isAndroidUploader() ) {
				angular.element("input[data-act=banner_upload]").click(function() {
					delete window.uploadCallBack;
					window.uploadCallBack = function(uploadJsonStr) {
						try {
							var resultObj = JSON.parse(uploadJsonStr);
							if( resultObj.error ) {
								alert('파일 업로드를 실패 했습니다.');
							} else {
								var fileInfo = resultObj.colData;
								if (fileInfo.imageYn == 'Y') {
									$('div[data-view=banner_preview]').html('<img alt="image" src="'+HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.filePath+'" data-file-no="'+fileInfo.fileNo+'">');
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
							, param : {uploadType:CommonConstant.File.TYPE_AD_BANNER}
							, cookie : document.cookie
						}
					};
					window.PLATFORM.fileChooser(JSON.stringify(param));

					return false;
				});
			} else {
				var adBannerUploadOptions = new UploadOptions();
				adBannerUploadOptions.customExtraFields = {'uploadType' : CommonConstant.File.TYPE_AD_BANNER};
				adBannerUploadOptions.onFinish = function(event, total) {
					if (this.errorFileArray.length + this.errorCount > 0) {
						alert('광고 베너 업로드를 실패 했습니다.');
					} else {
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
								$('div[data-view=banner_preview]').html('<img alt="image" src="'+HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.filePath+'" data-file-no="'+fileInfo.fileNo+'">');
							} else {
								alert('이미지 파일이 아닙니다.');
							}
						}
					}
				};

				$("input[data-act=banner_upload]").html5_upload(adBannerUploadOptions);
			}
		});

		$("#wrapper").show();

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 수정
 */
hakwonMainApp.controller('adBannerEditController', function($window, $scope, $location, $routeParams, adBannerService, CommUtil) {
	console.log('hakwonMainApp adBannerEditController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.common.edBannerList+'?hakwon_no='+hakwonInfo.hakwon_no, title:'광고'}, {url:'#', title:'수정'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	요청 번호	*/
		var reqNo = $routeParams.reqNo;
		console.log('adBannerViewController reqNo', reqNo);

		/*	광고 상세 조회	*/
		CommUtil.ajax({url:contextPath+"/hakwon/edvertise/detail.do", param:{reqNo:reqNo}, successFun:function(data) {
			var reqDetailInfo = data.colData;
			reqDetailInfo.banner_web_path = CommUtil.createFileFullPath(reqDetailInfo.banner_file_path);

			$scope.reqDetailInfo = reqDetailInfo;
		}});

		/*	취소	*/
		$scope.cancel = function() {
			if (history.length > 1) {
				window.history.back();
			} else {
				$location.path('/edBanner/list?hakwon_no='+hakwonInfo.hakwon_no);
			}
		};

		/*	수정	*/
		$scope.modify = function() {
			var $mainNgView = $('#mainNgView');
			var frm = $('#modifyForm')[0];
			if( isNull($mainNgView.find('input[name=title]').val()) ) {
				alert('제목을 입력해 주세요.');
				return false;
			}
			var bannerFileNo = $('img[data-view=banner_preview]').attr('data-file-no');
			if( isNull(bannerFileNo) ) {
				alert('광고 베너를 업로드해 주세요.');
				return false;
			}

			var redirect_url = $mainNgView.find('input[name=redirect_url]').val();

			var params = {advertiseReqNo:reqNo, title:$mainNgView.find('input[name=title]').val(), redirectUrl:redirect_url, bannerFileNo:bannerFileNo};

			var queryString = $.param(params, true);
			$.ajax({
				url: contextPath+"/hakwon/edvertise/modifyAdvertise.do",
				type: "post",
				data: queryString,
				headers : hakwonInfo.getHeader(),
				dataType: "json",
				success: function(data) {
					var colData = data.colData;
					if( colData ) {
						if( colData.flag == CommonConstant.Flag.success ) {
							//$location.path('/edBanner/list?hakwonNo='+hakwonInfo.hakwon_no);
							window.history.back();
						} else {
							alert('광고 수정을 실패 했습니다.');
						}
					} else {
						alert('시스템 오류가 발생 했습니다.', data.error);
					}
				},
				error: function(xhr, textStatus, errorThrown) {
					alert('통신을 실패 했습니다.');
				}
			});
		};


		$scope.$$postDigest(function(){
			//$window.scrollTo(0,0);

			// 파일 업로드 객체 생성
			/*	파일 업로드 객체 생성		*/
			if( comm.isAndroidUploader() ) {
				angular.element("input[data-act=banner_upload]").click(function() {
					delete window.uploadCallBack;
					window.uploadCallBack = function(uploadJsonStr) {
						try {
							var resultObj = JSON.parse(uploadJsonStr);
							if( resultObj.error ) {
								alert('파일 업로드를 실패 했습니다.');
							} else {
								var fileInfo = resultObj.colData;
								if (fileInfo.imageYn == 'Y') {
									$('img[data-view=banner_preview]').attr('src', HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.filePath).attr('data-file-no', fileInfo.fileNo);
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
							, param : {uploadType:CommonConstant.File.TYPE_AD_BANNER}
							, cookie : document.cookie
						}
					};
					window.PLATFORM.fileChooser(JSON.stringify(param));

					return false;
				});
			} else {
				var adBannerUploadOptions = new UploadOptions();
				adBannerUploadOptions.customExtraFields = {'uploadType' : CommonConstant.File.TYPE_AD_BANNER};
				adBannerUploadOptions.setProgress = function(val) {
					comm.progress(Math.ceil(val * 100));
				};
				adBannerUploadOptions.onFinish = function(event, total) {
					if (this.errorFileArray.length + this.errorCount > 0) {
						alert('광고 베너 업로드를 실패 했습니다.');
					} else {
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
								$('img[data-view=banner_preview]').attr('src', HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.filePath).attr('data-file-no', fileInfo.fileNo);
							} else {
								alert('이미지 파일이 아닙니다.');
							}
						}
					}
				};
				$("input[data-act=banner_upload]").html5_upload(adBannerUploadOptions);
			}
		});

		$("#wrapper").show();
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});