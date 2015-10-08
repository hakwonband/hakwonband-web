/**
 * 광고 서비스
 */
hakwonMainApp.service('adBannerService', function($http, CommUtil) {
	console.log('hakwonMainApp adBannerService call', CommUtil);

	var adBannerService = {};

	/**
	 * 광고 리스트 조회
	 */
	adBannerService.adList = function(pageNo) {
		var searchText	= $('#mainNgView input[name=searchText]').val();
		var depositYn	= $('#mainNgView select[name=depositYn]').val();
		if( !pageNo ) pageNo = 1;

		var param = {
			pageNo : pageNo
			, searchText : searchText
			, depositYn : depositYn
		};

		/**
		 * 학원 번호 파라미터로 들어갈수 있음
		 */
		$.ajax({
			url: contextPath+"/admin/edvertise/bannerReqList.do",
			type: "post",
			data: $.param(param, true),
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
						var $viewDiv = $('#mainNgView div[data-view=data-div]');
						if( colData.advertiseReqList.length > 0 ) {
							$viewDiv.find('table').show();
							$('#mainNgView div[data-view=pagination]').show();
							$viewDiv.find('div').hide();

							var $dataTableBody = $viewDiv.find('table > tbody');

							$dataTableBody.html($.tmpl(hakwonTmpl.adBanner.listRow, colData));

							var totalPages = comm.pageCalc(colData.advertiseReqCount, colData.pageScale);
							$('#mainNgView div[data-view=pagination]').bootpag({
								total: totalPages,
								page: pageNo,
								maxVisible: DefaultInfo.pageScale,
								leaps: true
							}).unbind("page").bind("page", function(event, page){
								param.pageNo = page;
								window.location = PageUrl.edvertise.bannerList+'?'+$.param(param);
							});
						} else {
							$viewDiv.find('table').hide();
							$('#mainNgView div[data-view=pagination]').hide();
							$viewDiv.find('div').show();
						}
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
		CommUtil.ajax({url:contextPath+"/admin/edvertise/bannerReqDetail.do", param:{reqNo:reqNo}, successFun:function(data) {
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
						console.log('dong['+reqLocalInfo.dong+'] month['+reqLocalInfo.view_month+'] size['+reqLocalInfo.banner_size+']');
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

	/*	광고 중지	*/
	adBannerService.advertiseStop = function(reqNo) {
		/**
		 * 학원 번호 파라미터로 들어갈수 있음
		 */
		$.ajax({
			url: contextPath+"/admin/edvertise/bannerStop.do",
			type: "post",
			data: $.param({reqNo:reqNo}, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {

					var currentAdminStop = $('table[data-view=table-view] > tbody > tr > td:last').text();
					var viewState = '';
					if( currentAdminStop == 'Y' ) {
						viewState = "활성화";
					} else {
						viewState = "중지";
					}

					if( data.error ) {
						alert('광고 '+viewState+'를 실패 했습니다.');
						return false;
					}

					if( data.colData.flag == CommonConstant.Flag.success ) {
						/*	실제 처리 데이타	*/
						$('table[data-view=table-view] > tbody > tr > td:last').text(currentAdminStop=='Y'?'N':'Y');
						$('button[data-type=stop]').html(currentAdminStop=='Y'?'중지':'활성화');
						alert('광고 '+viewState+' 성공.');
					} else {
						alert('광고 '+viewState+'를 실패 했습니다.');
						return false;
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


	/*	월별 가격 초기화	*/
	adBannerService.initMonthPrice = function() {

		try {
			var $mainNgView = $('#mainNgView');

			var currentYear = (new Date()).getFullYear();

			/*	연도 select	*/
			var yearHtml = '';
			for(var i=2014; i<2035; i++) {
				yearHtml += '<option value="'+i+'" '+(currentYear==i?'selected':'')+'>'+i+'년</option>';
			}
			$mainNgView.find('select[name=year]').html(yearHtml);

			/*	head	*/
			var theadHtml = '';
			for(var i=1; i<=12; i++) {
				var viewMonth = i;
				if( i < 10 ) {
					viewMonth = '0'+i;
				}
				theadHtml += '<th>'+viewMonth+' 월</th>';
			}
			$mainNgView.find('table[data-type=calendar_table] > thead > tr').append(theadHtml);

			/*	body	*/
			var tbodyHtml = '';
			for(var i=1; i<=4; i++) {
				tbodyHtml += '<tr>';
				tbodyHtml += '	<td>'+i+'칸</td>';
				for(var j=1; j<=12; j++) {
					var viewMonth = j;
					if( j < 10 ) {
						viewMonth = '0'+j;
					}
					tbodyHtml += '	<td><input type="number" name="price_'+i+'_'+viewMonth+'" value="0" onkeydown="commProto.onlyNumber(event)" onkeypress="commProto.onlyNumber(event)" class="form-control"> 원</td>';
				}
				tbodyHtml += '</tr>';
			}
			$mainNgView.find('table[data-type=calendar_table] > tbody').append(tbodyHtml);
			$mainNgView = null;

			adBannerService.loadMonthPrice(currentYear);
		} catch(ex) {
			commProto.errorDump({errorObj:ex});
		}
	};

	/**
	 * 월별 가격 조회
	 */
	adBannerService.loadMonthPrice = function(year) {
		if( !year ) {
			year = $('select[name=year]').val();
		}

		/**
		 * 월별 가격 조회
		 */
		$.ajax({
			url: contextPath+"/admin/edvertise/searchMonthPrice.do.do",
			type: "post",
			data: 'year='+year,
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {

					if( data.error ) {
						alert('월별 가격 조회를 실패 했습니다.');
						return false;
					}
					console.log('data', data);
					var $table = $('table[data-type=calendar_table]');
					$table.find('input').val(0);//	초기화

					var dataList = data.colData.dataList;
					for(var i=0; i<data.colData.dataList.length; i++) {
						var monthInfo = dataList[i];
						var month		= monthInfo.month;
						var bannerSize	= monthInfo.banner_size;
						var price		= monthInfo.price;
						if( !price ) {
							price = 0;
						}

						$table.find('input[name=price_'+bannerSize+'_'+month+']').val(price);
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
	 * 월별 가격 저장
	 */
	adBannerService.saveMonthPrice = function() {
		var queryString = $('#mainNgView form').serialize();
		$.ajax({
			url: contextPath+"/admin/edvertise/saveMonthPrice.do.do",
			type: "post",
			data: queryString,
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('월별 가격 저장을 실패 했습니다.');
						return false;
					}
					console.log('data', data);
					if( data.colData.flag == CommonConstant.Flag.success ) {
						alert('월별 가격을 저장 했습니다.');
						adBannerService.loadMonthPrice();
					} else {
						alert('월별 가격 저장을 실패 했습니다.');
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

	return adBannerService;
});

/**
 * 리스트
 */
hakwonMainApp.controller('adBannerListController', function($scope, $location, $routeParams, adBannerService, CommUtil) {
	console.log('hakwonMainApp adBannerListController call', $scope, $location, $routeParams, adBannerService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'광고'}, {url:'#', title:'광고 리스트'}]);

		var pageNo = $routeParams.pageNo;
		if( !pageNo ) pageNo = 1;

		var depositYn = $routeParams.depositYn;
		if( !depositYn ) depositYn = '';

		var searchText = $routeParams.searchText;
		if( !searchText ) searchText = '';

		/*	광고 검색	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=search]', function() {

			var searchText	= $('#mainNgView input[name=searchText]').val();
			var depositYn	= $('#mainNgView select[name=depositYn]').val();

			window.location = PageUrl.edvertise.bannerList+'?'+$.param({pageNo:1, searchText:searchText, depositYn:depositYn});
		});
		$('#mainNgView').on('keypress', 'input[name=searchText]', function( event ) {
			if ( event.which == 13 ) {

				var searchText	= $('#mainNgView input[name=searchText]').val();
				var depositYn	= $('#mainNgView select[name=depositYn]').val();

				window.location = PageUrl.edvertise.bannerList+'?'+$.param({pageNo:1, searchText:searchText, depositYn:depositYn});
				event.preventDefault();
			}
		});

		/*	상세 이동	*/
		$('#mainNgView').on(clickEvent, 'a[data-act=adBannerDetail]', function() {
			var reqNo = $(this).attr('data-req-no');

			window.location = PageUrl.edvertise.bannerView+'?reqNo='+reqNo;
			return false;
		});

		$scope.$on('$viewContentLoaded', function() {
			console.log('adBannerListController $viewContentLoaded');

			$('#mainNgView input[name=searchText]').val(searchText);
			$('#mainNgView select[name=depositYn]').val(depositYn);

			/*	광고 리스트 조회	*/
			adBannerService.adList(pageNo);
		});

		$("#wrapper").show();

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 뷰
 */
hakwonMainApp.controller('adBannerViewController', function($scope, $location, $routeParams, adBannerService, CommUtil) {
	console.log('hakwonMainApp adBannerViewController call', $scope, $location, $routeParams, adBannerService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'광고'}, {url:'#', title:'광고 상세'}]);

		/*	요청 번호	*/
		var reqNo = $routeParams.reqNo;
		console.log('adBannerViewController reqNo', reqNo);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	목록 이동	*/
		$scope.goList = function () {
			commProto.hrefMove(PageUrl.edvertise.bannerList);
		}

		/*	중지	*/
		$scope.stop = function () {
			if( window.confirm('현재 광고를 중지 하시겠습니까?') ) {
				adBannerService.advertiseStop(reqNo);
			}
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
 * 월별 가격 셋팅
 */
hakwonMainApp.controller('adBannerMonthPriceController', function($scope, $location, $routeParams, adBannerService, CommUtil) {
	console.log('hakwonMainApp adBannerMonthPriceController call', $scope, $location, $routeParams, adBannerService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	저장	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=save]', adBannerService.saveMonthPrice);

		$('#mainNgView').on('change', 'select[name=year]', function() {
			adBannerService.loadMonthPrice();
		});

		$("#wrapper").show();
		$scope.$on('$viewContentLoaded', function() {
			console.log('adBannerMonthPriceController $viewContentLoaded call');

			adBannerService.initMonthPrice();
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});