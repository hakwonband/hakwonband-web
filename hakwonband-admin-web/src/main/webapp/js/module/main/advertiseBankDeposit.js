/**
 * 광고 서비스
 */
hakwonMainApp.service('advertiseBankDepositService', function($http, CommUtil) {
	console.log('hakwonMainApp advertiseBankDepositService call', CommUtil);

	var advertiseBankDepositService = {};

	/**
	 * 입금 리스트 조회
	 */
	advertiseBankDepositService.list = function(pageNo) {
		var searchType = $('#mainNgView select[name=searchType]').val();
		var searchText = $('#mainNgView input[name=searchText]').val();
		var mappingFlag = $('#mainNgView select[name=mappingFlag]').val();

		if( !pageNo ) pageNo = 1;

		var param = {
			pageNo : pageNo
			, searchText : searchText
			, searchType : searchType
			, mappingFlag : mappingFlag
		};

		/**
		 * 학원 번호 파라미터로 들어갈수 있음
		 */
		$.ajax({
			url: contextPath+"/admin/edvertise/bankDeposit/list.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('입금 리스트 조회를 실패 했습니다.');
						return false;
					}

					var colData = data.colData;
					if( colData.bankDepositList ) {
						var $dataTable = $('div[data-view=data-div] > table > tbody');
						if( colData.bankDepositList.length > 0 ) {
							$dataTable.html($.tmpl(hakwonTmpl.advertise.bankDeposit.list_row, colData));
						} else {
							$dataTable.html($.tmpl(hakwonTmpl.advertise.bankDeposit.list_nodata, colData));
						}

						var totalPages = comm.pageCalc(colData.bankDepositCount, colData.pageScale);
						$('#mainNgView div[data-view=pagination]').bootpag({
							total: totalPages,
							page: pageNo,
							maxVisible: DefaultInfo.pageScale,
							leaps: true
						}).unbind("page").bind("page", function(event, page){
							param.pageNo = page;
							window.location.href = PageUrl.edvertise.bankDepositList+"?"+$.param(param);
						});
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
	 * 입금 등록
	 */
	advertiseBankDepositService.regist = function() {

		var deposit_name	= $('#mainNgView input[name=deposit_name]').val();
		var amount			= $('#mainNgView input[name=amount]').val();
		var bank_code		= $('#mainNgView select[name=bank_code]').val();
		var deposit_date	= $('#mainNgView input[name=deposit_date]').val();
		var comment			= $('#mainNgView textarea[name=comment]').val();

		if( isNull(deposit_name) ) {
			alert('입금자명을 입력해 주세요.');
			return ;
		}
		if( isNull(amount) ) {
			alert('금액을 입력해 주세요.');
			return ;
		}
		if( isNull(bank_code) ) {
			alert('입금 은행을 선택해 주세요.');
			return ;
		}
		if( isNull(deposit_date) ) {
			alert('입금 날짜를 입력해 주세요.');
			return ;
		}

		var param = {depositName:deposit_name, amount:amount, bankCode:bank_code, depositDate:deposit_date, comment:comment};

		$.ajax({
			url: contextPath+"/admin/edvertise/bankDeposit/write.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('입금 정보 등록을 실패 했습니다.');
						return false;
					}
					window.location.href = '#/edvertise/bankDeposit/list';
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
	 * 입금 수정
	 */
	advertiseBankDepositService.edit = function(depositNo) {

		var deposit_name	= $('#mainNgView input[name=deposit_name]').val();
		var amount			= $('#mainNgView input[name=amount]').val();
		var bank_code		= $('#mainNgView select[name=bank_code]').val();
		var deposit_date	= $('#mainNgView input[name=deposit_date]').val();
		var comment			= $('#mainNgView textarea[name=comment]').val();

		if( isNull(deposit_name) ) {
			alert('입금자명을 입력해 주세요.');
			return ;
		}
		if( isNull(amount) ) {
			alert('금액을 입력해 주세요.');
			return ;
		}
		if( isNull(bank_code) ) {
			alert('입금 은행을 선택해 주세요.');
			return ;
		}
		if( isNull(deposit_date) ) {
			alert('입금 날짜를 입력해 주세요.');
			return ;
		}
		var param = {depositNo:depositNo, depositName:deposit_name, amount:amount, bankCode:bank_code, depositDate:deposit_date, comment:comment};

		$.ajax({
			url: contextPath+"/admin/edvertise/bankDeposit/edit.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('입금 정보 수정을 실패 했습니다.');
						return false;
					}
					window.location.href = '#/edvertise/bankDeposit/list';
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
	 * 상세 정보
	 */
	advertiseBankDepositService.viewDetailInfo = function(depositNo) {
		/*	스크롤 탑으로 이동	*/
		hakwonCommon.goScrollTop();

		var param = {depositNo:depositNo};
		$.ajax({
			url: contextPath+"/admin/edvertise/bankDeposit/view.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error || !data.colData || !data.colData.bankDepositInfo ) {
						alert('입금 정보 조회를 실패 했습니다.');
						commProto.hrefMove('#/edvertise/bankDeposit/list');
						return false;
					}
					$('#mainNgView div[data-view=data-view]').html($.tmpl(hakwonTmpl.advertise.bankDeposit.viewData, data.colData));
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
	 * 수정 정보 로드
	 */
	advertiseBankDepositService.editDetailInfo = function(depositNo) {
		var param = {depositNo:depositNo, edit:'Y'};
		$.ajax({
			url: contextPath+"/admin/edvertise/bankDeposit/view.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error || !data.colData || !data.colData.bankDepositInfo ) {
						alert('입금 정보 조회를 실패 했습니다.');
						commProto.hrefMove('#/edvertise/bankDeposit/list');
						return false;
					}
					var deposit_date = data.colData.bankDepositInfo.deposit_date;
					deposit_date = deposit_date.split('.').join('-');
					data.colData.bankDepositInfo.deposit_date = deposit_date;

					$('#mainNgView div[data-view=data-view]').html($.tmpl(hakwonTmpl.advertise.bankDeposit.edit, data.colData));
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
	 * 입금 정보 삭제
	 */
	advertiseBankDepositService.deleteDeposit = function(depositNo) {
		var param = {depositNo:depositNo};
		$.ajax({
			url: contextPath+"/admin/edvertise/bankDeposit/delete.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('입금 정보 삭제를 실패 했습니다.');
						return false;
					}
					if( data.colData.flag == CommonConstant.Flag.already ) {
						alert('광고에 맵핑되어 있는 입금 정보는 삭제 할 수 없습니다.');
					} else if( data.colData.flag == CommonConstant.Flag.success ) {
						commProto.hrefMove('#/edvertise/bankDeposit/list');
					} else {
						alert('입금 정보 삭제를 실패 했습니다.');
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



	/*	광고 검색	*/
	advertiseBankDepositService.advertiseSearch = function(advertiseSearchText) {
		var param = {advertiseSearchText:advertiseSearchText};
		$.ajax({
			url: contextPath+"/admin/edvertise/bankDeposit/advertiseSearch.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('광고 검색을 실패 했습니다.');
						return false;
					}

					if( data.colData.dataList && data.colData.dataList.length > 0 ) {
						$('#mainNgView div[data-view=advertise_search_view]').html($.tmpl(hakwonTmpl.advertise.bankDeposit.search_row, data.colData));
					} else {
						$('#mainNgView div[data-view=advertise_search_view]').html($.tmpl(hakwonTmpl.advertise.bankDeposit.search_row_nodata));
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
	 * 광고 맵핑
	 */
	advertiseBankDepositService.advertiseMapping = function(depositNo, advertiseReqNo) {
		var param = {depositNo:depositNo, advertiseReqNo:advertiseReqNo};
		$.ajax({
			url: contextPath+"/admin/edvertise/bankDeposit/mapping.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error || !data.colData ) {
						alert('광고 맵핑을 실패 했습니다.');
						return false;
					}

					if( data.colData.flag == CommonConstant.Flag.already ) {
						alert('이미 맵핑되어 있는 입금 내역 입니다.');
					} else if( data.colData.flag == CommonConstant.Flag.success ) {
						advertiseBankDepositService.viewDetailInfo(depositNo);
					} else {
						alert('광고 맵핑을 실패 했습니다.');
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
	 * 광고 맵핑 취소 처리
	 */
	advertiseBankDepositService.mappingCancel = function(depositNo, advertiseReqNo) {
		var param = {depositNo:depositNo, advertiseReqNo:advertiseReqNo};
		$.ajax({
			url: contextPath+"/admin/edvertise/bankDeposit/mappingCancel.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error || !data.colData ) {
						alert('광고 맵핑 취소를 실패 했습니다.');
						window.history.back();
						return false;
					}

					if( data.colData.flag == CommonConstant.Flag.success ) {
						advertiseBankDepositService.viewDetailInfo(depositNo);
					} else {
						alert('광고 맵핑 취소를 실패 했습니다.');
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

	return advertiseBankDepositService;
});

/**
 * 리스트
 */
hakwonMainApp.controller('advertiseBankDepositListController', function($scope, $location, $routeParams, advertiseBankDepositService, CommUtil) {
	console.log('hakwonMainApp advertiseBankDepositListController call', $scope, $location, $routeParams, advertiseBankDepositService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'광고'}, {url:'#', title:'입금 리스트'}]);

		/*	검색	*/
		$scope.search = function() {
			var searchType = $('#mainNgView select[name=searchType]').val();
			var searchText = $('#mainNgView input[name=searchText]').val();
			var mappingFlag = $('#mainNgView select[name=mappingFlag]').val();

			var param = {
				pageNo : 1
				, searchText : searchText
				, searchType : searchType
				, mappingFlag : mappingFlag
			};
			window.location.href = PageUrl.edvertise.bankDepositList+"?"+$.param(param);
		};
		$('#mainNgView').on('keypress', 'input[name=searchText]', function( event ) {
			if ( event.which == 13 ) {
				var searchType = $('#mainNgView select[name=searchType]').val();
				var searchText = $('#mainNgView input[name=searchText]').val();
				var mappingFlag = $('#mainNgView select[name=mappingFlag]').val();

				var param = {
					pageNo : 1
					, searchText : searchText
					, searchType : searchType
					, mappingFlag : mappingFlag
				};
				window.location.href = PageUrl.edvertise.bankDepositList+"?"+$.param(param);
				event.preventDefault();
			}
		});


		/*	작성 페이지로 이동	*/
		$scope.write = function() {
			$location.path('/edBanner/write');
		}

		/*	상세 이동	*/
		$('#mainNgView').on(clickEvent, 'tr[data-act=view]', function() {
			var depositNo = $(this).attr('data-no');
			console.log('depositNo : ' + depositNo);
			window.location.href = '#/edvertise/bankDeposit/view?depositNo='+depositNo;
		});



		$("#wrapper").show();

		$scope.$on('$viewContentLoaded', function() {
			console.log('advertiseBankDepositListController $viewContentLoaded');

			var pageNo = $routeParams.pageNo;
			if( !pageNo ) pageNo = 1;

			var searchType = $routeParams.searchType;
			if( !searchType ) searchType = '';

			var searchText = $routeParams.searchText;
			if( !searchText ) searchText = '';

			var mappingFlag = $routeParams.mappingFlag;
			if( !mappingFlag ) mappingFlag = '';

			$('#mainNgView select[name=searchType]').val(searchType);
			$('#mainNgView input[name=searchText]').val(searchText);
			$('#mainNgView select[name=mappingFlag]').val(mappingFlag);

			$scope.$mainEle = $('#mainNgView');

			/*	입금 리스트 조회	*/
			advertiseBankDepositService.list(pageNo);
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 뷰
 */
hakwonMainApp.controller('advertiseBankDepositViewController', function($scope, $location, $routeParams, advertiseBankDepositService, CommUtil) {
	console.log('hakwonMainApp advertiseBankDepositViewController call', $scope, $location, $routeParams, advertiseBankDepositService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'광고'}, {url:'#', title:'입금 상세'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	요청 번호	*/
		var depositNo = $routeParams.depositNo;
		console.log('advertiseBankDepositViewController depositNo', depositNo);

		/*	맵핑 삭제	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=mappingDelete]', function() {
			if( window.confirm('광고 맵핑을 취소 하시겠습니까?') ) {
				var advertiseReqNo = $(this).val();
				advertiseBankDepositService.mappingCancel(depositNo, advertiseReqNo);
			}
		});

		/*	리스트 이동	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=list]', function() {
			commProto.hrefMove('#/edvertise/bankDeposit/list');
		});

		/*	삭제	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=delete]', function() {
			if( $('#mainNgView').find('table[data-mapping=Y]').length > 0 ) {
				alert('맵핑된 입금정보는 삭제 할수 없습니다.');
				return false;
			} else {
				if( window.confirm('입금 정보를 삭제 하시겠습니까?') ) {
					advertiseBankDepositService.deleteDeposit(depositNo);
				}
			}

		});

		/*	수정	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=modify]', function() {
			window.location.href = '#/edvertise/bankDeposit/edit?depositNo='+depositNo;
		});

		/*	광고 검색	*/
		$('#mainNgView').on('keypress', 'input[name=advertiseSearchText]', function( event ) {
			if ( event.which == 13 ) {
				var advertiseSearchText = $(this).val();
				if( isNull(advertiseSearchText) ) {
					alert('검색어를 입력해 주세요.');
					$('#mainNgView input[name=advertiseSearchText]').focus();
					return false;
				}
				advertiseBankDepositService.advertiseSearch(advertiseSearchText);
				event.preventDefault();
			}
		});
		$('#mainNgView').on(clickEvent, 'button[data-act=advertiseSearch]', function() {
			var advertiseSearchText = $('#mainNgView input[name=advertiseSearchText]').val();
			if( isNull(advertiseSearchText) ) {
				alert('검색어를 입력해 주세요.');
				$('#mainNgView input[name=advertiseSearchText]').focus();
				return false;
			}
			advertiseBankDepositService.advertiseSearch(advertiseSearchText);
		});

		/**
		 * 광고 선택 맵핑
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=advertiseMapping]', function() {
			var advertiseReqNo = $(this).val();

			var bankAmount = $('#mainNgView div.ibox-title').attr('data-money');
			var advertiseMoney = $(this).attr('data-money');
			if( advertiseMoney != bankAmount ) {
				if( window.confirm('광고의 금액과 입금 금액이 다릅니다.\n계속해서 맵핑을 진행 하시겠습니까?') == false ) {
					return false;
				}
			}


			advertiseBankDepositService.advertiseMapping(depositNo, advertiseReqNo);
		});

		/*	광고 상세 조회	*/
		advertiseBankDepositService.viewDetailInfo(depositNo);

		$scope.$on('$viewContentLoaded', function() {
			console.log('advertiseBankDepositViewController $viewContentLoaded call');
		});

		$("#wrapper").show();

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 작성
 */
hakwonMainApp.controller('advertiseBankDepositWriteController', function($scope, $location, advertiseBankDepositService, CommUtil) {
	console.log('hakwonMainApp advertiseBankDepositWriteController call', $scope, $location, advertiseBankDepositService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'광고'}, {url:'#', title:'입금 등록'}]);

		/**
		 * 취소
		 */
		$scope.cancel = function() {
			commProto.hrefMove('#/edvertise/bankDeposit/list');
		};

		/**
		 * 등록
		 */
		$scope.regist = function() {
			advertiseBankDepositService.regist();
		};


		/**
		 * onload
		 */
		$scope.$on('$viewContentLoaded', function() {
			console.log('advertiseBankDepositWriteController $viewContentLoaded');

			/*	은행 코드 조회	*/
			comm.getCodeList('010', function(codeList) {
				var codeHtml = '';
				for(var i=0; i<codeList.length; i++) {
					codeHtml += '<option value="'+codeList[i].code+'">'+codeList[i].code_name+'</option>';
				}
				$('#mainNgView select[name=bank_code]').append(codeHtml);
			});

		});

		$("#wrapper").show();

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 수정
 */
hakwonMainApp.controller('advertiseBankDepositEditController', function($window, $scope, $location, $routeParams, advertiseBankDepositService, CommUtil) {
	console.log('hakwonMainApp advertiseBankDepositEditController call', $scope, $location, advertiseBankDepositService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'광고'}, {url:'#', title:'입금 수정'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	요청 번호	*/
		var depositNo = $routeParams.depositNo;
		console.log('advertiseBankDepositViewController depositNo', depositNo);


		/*	취소	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=cancel]', function() {
			commProto.hrefMove('#/edvertise/bankDeposit/list');
		});

		/*	수정	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=edit]', function() {
			advertiseBankDepositService.edit(depositNo);
		});

		$scope.$on('$viewContentLoaded', function() {
			advertiseBankDepositService.editDetailInfo(depositNo);
		});

		$("#wrapper").show();
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});