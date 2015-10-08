/**
 * 매니저 서비스
 */
hakwonMainApp.service('managerService', function() {
	console.log('hakwonMainApp managerService call');

	var managerService = {};

	/*	매니저 상태 변경	*/
	managerService.userStop = function(manager_no) {
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
						alert('매니저 상태 변경을 실패 했습니다.');
						return false;
					}
					var colData = data.colData;
					if( colData.flag == 'success' ) {
						$("button[data-act=stop]").attr('data-val', use_yn);
						$("button[data-act=stop]").html('계정 ' + (use_yn=='Y'?'일시 정지':'활성화'));
					} else {
						alert('매니저 상태 변경을 실패 했습니다.');
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
	 * 매니저 리스트
	 */
	managerService.managerList = function(pageNo) {
		var searchText = $('#mainNgView input[name=searchText]').val();
		if( !pageNo ) pageNo = 1;

		var param = {
			pageNo : pageNo
			, searchText : searchText
		};

		$.ajax({
			url: contextPath+"/admin/manager/list.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('매니저 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;

					var $dataDiv = $('#mainNgView div[data-view=data-div]');
					var $dataTableBody = $dataDiv.find('table > tbody');

					if( colData.dataCount == 0 ) {
						$dataTableBody.html($.tmpl(hakwonTmpl.manager.listNoData, colData));

						$dataDiv.find('thead').hide();
						$('#mainNgView div[data-view=pagination]').html('');
					} else {
						$dataTableBody.html($.tmpl(hakwonTmpl.manager.listRow, colData));

						$dataDiv.find('thead').show();
						var totalPages = comm.pageCalc(colData.dataCount, colData.pageScale);
						$('#mainNgView div[data-view=pagination]').bootpag({
							total: totalPages,
							page: pageNo,
							maxVisible: DefaultInfo.pageScale,
							leaps: true
						}).unbind("page").bind("page", function(event, page){
							param.pageNo = page;
							window.location = PageUrl.manager.list+"?"+$.param(param);
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
	 * 매니저 가입 요청 리스트
	 */
	managerService.requestList = function(pageNo) {
		var searchText = $('#mainNgView input[name=searchText]').val();
		if( !pageNo ) pageNo = 1;

		var param = {
			pageNo : pageNo
			, searchText : searchText
		};

		$.ajax({
			url: contextPath+"/admin/manager/unauthorizedUserList.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('매니저 승인 요청 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;

					var $dataDiv = $('#mainNgView div[data-view=data-div]');
					var $dataTableBody = $dataDiv.find('table > tbody');

					if( colData.userCount == 0 ) {
						$dataTableBody.html($.tmpl(hakwonTmpl.manager.join_request_list_nodata, colData));

						$dataDiv.find('thead').hide();
						$('#mainNgView div[data-view=pagination]').html('');
					} else {
						$dataTableBody.html($.tmpl(hakwonTmpl.manager.join_request_list_row, colData));

						$dataDiv.find('thead').show();
						var totalPages = comm.pageCalc(colData.userCount, colData.pageScale);
						$('#mainNgView div[data-view=pagination]').bootpag({
							total: totalPages,
							page: pageNo,
							maxVisible: DefaultInfo.pageScale,
							leaps: true
						}).unbind("page").bind("page", function(event, page){
							param.pageNo = page;
							window.location = PageUrl.manager.requestList+"?"+$.param(param);
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
	managerService.approvedUpdate = function(param) {
		$.ajax({
			url: contextPath+"/admin/manager/updateApproved.do",
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
							managerService.requestList(1);
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
	 * 매니저 상세
	 */
	managerService.managerView = function(managerUserNo) {
		var param = {managerUserNo:managerUserNo};
		$.ajax({
			url: contextPath+"/admin/manager/view.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('매니저 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;
					$('#mainNgView > div[data-view=data-view]').html($.tmpl(hakwonTmpl.manager.viewData, colData));
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	return managerService;
});


/**
 * 매니저 리스트
 */
hakwonMainApp.controller('managerListController', function($scope, $location, $routeParams, managerService, CommUtil) {
	console.log('hakwonMainApp managerListController call', $scope, $location, $routeParams, managerService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'매니저'}, {url:'#', title:'매니저 리스트'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 검색
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=search]', function() {

			window.location.href = PageUrl.manager.list+'?'+$.param({pageNo:1, searchText:$('#mainNgView input[name=searchText]').val()});
		});
		$('#mainNgView').on('keypress', 'input[name=searchText]', function( event ) {
			if ( event.which == 13 ) {
				window.location.href = PageUrl.manager.list+'?'+$.param({pageNo:1, searchText:$('#mainNgView input[name=searchText]').val()});
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

			managerService.managerList(pageNo);
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 매니저 가입 요청 컨트롤러
 */
hakwonMainApp.controller('managerRequestListController', function($scope, $location, $routeParams, managerService, CommUtil) {
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

		/*	매니저 검색	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=search]', function () {
			window.location.href = PageUrl.manager.requestList+'?pageNo=1&searchText='+$('#mainNgView input[name=searchText]').val();
		});
		$('#mainNgView').on('keypress', 'input[name=searchText]', function( event ) {
			if ( event.which == 13 ) {
				window.location.href = PageUrl.manager.requestList+'?pageNo=1&searchText='+$('#mainNgView input[name=searchText]').val();
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
				alert('선택된 매니저가 없습니다.');
				return false;
			}
			var param = {approvedYn:approved, approvedUserNo:approvedUserNoArray};

			managerService.approvedUpdate(param);
		});


		/**
		 * 요청 리스트
		 */
		managerService.requestList(pageNo);

		$("#wrapper").show();

		$scope.$on('$viewContentLoaded', function() {
			console.log('managerRequestListController $viewContentLoaded call');

		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 매니저 상세
 */
hakwonMainApp.controller('managerViewController', function($scope, $location, $routeParams, managerService, CommUtil) {
	console.log('hakwonMainApp managerViewController call', $scope, $location, $routeParams, managerService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:PageUrl.manager.list, title:'매니저'}, {url:'#', title:'매니저 상세'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 학생 번호
		 */
		var managerUserNo = $routeParams.managerUserNo;
		if( !managerUserNo ) {
			alert('매니저를 선택해 주세요.');
			window.history.back();
			return ;
		}

		/*	목록으로	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=list]', function() {
			if (history.length > 1) {
				window.history.back();
			} else {
				window.location.href = PageUrl.manager.list;
			}
		});

		/*	계정 일시 정지	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=stop]', function() {
			managerService.userStop(managerUserNo);
		});


		$("#wrapper").show();
		$scope.$on('$viewContentLoaded', function() {
			managerService.managerView(managerUserNo);
		});
		$scope.$$postDigest(function(){
			console.log('$$postDigest');
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});