/**
 * 원장 서비스
 */
hakwonMainApp.service('masterService', function() {
	console.log('hakwonMainApp masterService call');

	var masterService = {};

	/*	원장님 상태 변경	*/
	masterService.userStop = function(manager_no) {
		var use_yn = $("button[data-act=stop]").attr('data-val');
		if( use_yn == 'Y' ) {
			use_yn = 'N';
		} else {
			use_yn = 'Y';
		}
		var param = {
			user_no : manager_no
			, use_yn : use_yn
		};
		$.ajax({
			url: contextPath+"/admin/userStopChange.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('원장님 상태 변경을 실패 했습니다.');
						return false;
					}
					var colData = data.colData;
					if( colData.flag == 'success' ) {
						$("button[data-act=stop]").attr('data-val', use_yn);
						$("button[data-act=stop]").html('계정 ' + (use_yn=='Y'?'일시 정지':'활성화'));
					} else {
						alert('원장님 상태 변경을 실패 했습니다.');
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

	/**
	 * 원장 리스트
	 */
	masterService.masterList = function(pageNo) {
		var searchText = $('#mainNgView input[name=searchText]').val();
		if( !pageNo ) pageNo = 1;

		var param = {
			pageNo : pageNo
			, searchText : searchText
		};

		$.ajax({
			url: contextPath+"/admin/master/list.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('원장님 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;

					var $dataDiv = $('#mainNgView div[data-view=data-div]');
					var $dataTableBody = $dataDiv.find('table > tbody');

					if( colData.dataCount == 0 ) {
						$dataTableBody.html($.tmpl(hakwonTmpl.master.listNoData, colData));

						$dataDiv.find('thead').hide();
						$('#mainNgView div[data-view=pagination]').html('');
					} else {
						$dataTableBody.html($.tmpl(hakwonTmpl.master.listRow, colData));

						$dataDiv.find('thead').show();
						var totalPages = comm.pageCalc(colData.dataCount, colData.pageScale);
						$('#mainNgView div[data-view=pagination]').bootpag({
							total: totalPages,
							page: pageNo,
							maxVisible: DefaultInfo.pageScale,
							leaps: true
						}).unbind("page").bind("page", function(event, page){
							param.pageNo = page;
							window.location = PageUrl.master.list+"?"+$.param(param);
						});
					}

					$dataDiv.find('.i-checks').iCheck({
						checkboxClass: 'icheckbox_square-green'
					});

				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	}

	/**
	 * 원장 가입 요청 리스트
	 */
	masterService.requestList = function(pageNo) {
		var searchText = $('#mainNgView input[name=searchText]').val();
		if( !pageNo ) pageNo = 1;

		var param = {
			pageNo : pageNo
			, searchText : searchText
		};

		$.ajax({
			url: contextPath+"/admin/master/unauthorizedUserList.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('원장님 승인 요청 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;

					var $dataDiv = $('#mainNgView div[data-view=data-div]');
					var $dataTableBody = $dataDiv.find('table > tbody');

					if( colData.userCount == 0 ) {
						$dataTableBody.html($.tmpl(hakwonTmpl.master.join_request_list_nodata, colData));

						$dataDiv.find('thead').hide();
						$('#mainNgView div[data-view=pagination]').html('');
					} else {
						$dataTableBody.html($.tmpl(hakwonTmpl.master.join_request_list_row, colData));

						$dataDiv.find('thead').show();
						var totalPages = comm.pageCalc(colData.userCount, colData.pageScale);
						$('#mainNgView div[data-view=pagination]').bootpag({
							total: totalPages,
							page: pageNo,
							maxVisible: DefaultInfo.pageScale,
							leaps: true
						}).unbind("page").bind("page", function(event, page){
							param.pageNo = page;
							window.location = PageUrl.master.requestList+"?"+$.param(param);
						});
					}

					$dataDiv.find('.i-checks').iCheck({
						checkboxClass: 'icheckbox_square-green'
					});

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
	 * 승인/거절 처리
	 */
	masterService.approvedUpdate = function(param) {
		$.ajax({
			url: contextPath+"/admin/master/updateApproved.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('승인/거절 요청 처리를 실패 했습니다.');
					} else {
						var colData = data.colData;
						if( colData.flag == CommonConstant.Flag.success ) {
							$('#mainNgView input[name=searchText]').val('');
							masterService.requestList(1);
						} else {
							alert('승인/거절 요청 처리를 실패 했습니다.');
						}
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
	 * 원장 상세
	 */
	masterService.masterView = function(masterUserNo) {
		var param = {masterUserNo:masterUserNo};
		$.ajax({
			url: contextPath+"/admin/master/view.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('원장님 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;
					$('#mainNgView > div[data-view=data-view]').html($.tmpl(hakwonTmpl.master.viewData, colData));
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	return masterService;
});


/**
 * 원장 리스트
 */
hakwonMainApp.controller('masterListController', function($scope, $location, $routeParams, masterService, CommUtil) {
	console.log('hakwonMainApp masterListController call', $scope, $location, $routeParams, masterService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'원장님'}, {url:'#', title:'원장님 리스트'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 검색
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=search]', function() {

			window.location.href = PageUrl.master.list+'?'+$.param({pageNo:1, searchText:$('#mainNgView input[name=searchText]').val()});
		});
		$('#mainNgView').on('keypress', 'input[name=searchText]', function( event ) {
			if ( event.which == 13 ) {
				window.location.href = PageUrl.master.list+'?'+$.param({pageNo:1, searchText:$('#mainNgView input[name=searchText]').val()});
				event.preventDefault();
			}
		});

		$("#wrapper").show();
		$scope.$$postDigest(function(){

			/**
			 * 페이지 번호
			 */
			var pageNo = $routeParams.pageNo;
			if( !pageNo ) {
				pageNo = 1;
			}
			/*	검색어	*/
			var searchText = $routeParams.searchText;
			if( !searchText ) searchText = '';
			$('#mainNgView input[name=searchText]').val(searchText);

			masterService.masterList(pageNo);
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 원장 가입 요청 컨트롤러
 */
hakwonMainApp.controller('masterRequestListController', function($scope, $location, $routeParams, masterService, CommUtil) {
	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 페이지 번호
		 */
		var pageNo = $routeParams.pageNo;
		if( !pageNo ) {
			pageNo = 1;
		}
		/*	검색어	*/
		var searchText = $routeParams.searchText;
		if( !searchText ) searchText = '';
		$('#mainNgView input[name=searchText]').val(searchText);


		/**
		 * 전체 체크
		 */
		$('#mainNgView div[data-view=data-div] > table > thead > tr > th:eq(0)').on('ifChecked', function(event){
			$('#mainNgView div[data-view=data-div] > table > tbody > tr > td input.i-checks').iCheck('check');
		}).on('ifUnchecked', function(event){
			$('#mainNgView div[data-view=data-div] > table > tbody > tr > td input.i-checks').iCheck('uncheck');
		});

		/*	원장 검색	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=search]', function () {
			window.location.href = PageUrl.master.requestList+'?pageNo=1&searchText='+$('#mainNgView input[name=searchText]').val();
		});
		$('#mainNgView').on('keypress', 'input[name=searchText]', function( event ) {
			if ( event.which == 13 ) {
				window.location.href = PageUrl.master.requestList+'?pageNo=1&searchText='+$('#mainNgView input[name=searchText]').val();
				event.preventDefault();
			}
		});

		/**
		 * 승인 / 거절
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=approved]', function() {
			var approved = $(this).val();
			var approvedUserNoArray = [];
			$('input[name=reqUSerNo]:checked').each(function(idx) {
				approvedUserNoArray.push($(this).val());
			});
			if( approvedUserNoArray.length == 0 ) {
				alert('선택된 원장님이 없습니다.');
				return false;
			}
			var param = {approvedYn:approved, approvedUserNo:approvedUserNoArray};

			masterService.approvedUpdate(param);
		});


		/**
		 * 요청 리스트
		 */
		masterService.requestList(pageNo);

		$("#wrapper").show();

		$scope.$on('$viewContentLoaded', function() {
			console.log('masterRequestListController $viewContentLoaded call');

		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 원장 상세
 */
hakwonMainApp.controller('masterViewController', function($scope, $location, $routeParams, masterService, CommUtil) {
	console.log('hakwonMainApp masterViewController call', $scope, $location, $routeParams, masterService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:PageUrl.master.list, title:'원장님'}, {url:'#', title:'원장님 상세'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 학생 번호
		 */
		var masterUserNo = $routeParams.masterUserNo;
		if( !masterUserNo ) {
			alert('원장님을 선택해 주세요.');
			window.history.back();
			return ;
		}

		/*	목록으로	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=list]', function() {
			if (history.length > 1) {
				window.history.back();
			} else {
				window.location.href = PageUrl.master.list;
			}
		});

		/*	계정 일시 정지	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=stop]', function() {
			masterService.userStop(masterUserNo);
		});



		$("#wrapper").show();
		$scope.$on('$viewContentLoaded', function() {
			masterService.masterView(masterUserNo);
		});
		$scope.$$postDigest(function(){
			console.log('$$postDigest');
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});