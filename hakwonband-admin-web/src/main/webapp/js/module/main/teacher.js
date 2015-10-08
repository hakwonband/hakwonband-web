/**
 * 선생님 서비스
 */
hakwonMainApp.service('teacherService', function($http, CommUtil) {
	console.log('hakwonMainApp teacherService call', CommUtil);

	var teacherService = {};

	/**
	 * 선생님 리스트
	 */
	teacherService.teacherList = function(pageNo) {
		var searchText = $('#mainNgView input[name=searchText]').val();
		if( !pageNo ) pageNo = 1;

		var param = {
			pageNo : pageNo
			, searchText : searchText
		};

		$.ajax({
			url: contextPath+"/admin/teacher/list.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('선생님 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;

					var $dataDiv = $('#mainNgView div[data-view=data-div]');
					var $dataTableBody = $dataDiv.find('table > tbody');

					if( colData.dataCount == 0 ) {
						$dataTableBody.html($.tmpl(hakwonTmpl.teacher.listNoData, colData));

						$dataDiv.find('thead').hide();
						$('#mainNgView div[data-view=pagination]').html('');
					} else {
						$dataTableBody.html($.tmpl(hakwonTmpl.teacher.listRow, colData));

						$dataDiv.find('thead').show();
						var totalPages = comm.pageCalc(colData.dataCount, colData.pageScale);
						$('#mainNgView div[data-view=pagination]').bootpag({
							total: totalPages,
							page: pageNo,
							maxVisible: DefaultInfo.pageScale,
							leaps: true
						}).unbind("page").bind("page", function(event, page){
							param.pageNo = page;
							window.location.href = PageUrl.teacher.list+"?"+$.param(param);
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
	 * 선생님 상세
	 */
	teacherService.teacherView = function(teacherUserNo) {
		var param = {teacherUserNo:teacherUserNo};
		$.ajax({
			url: contextPath+"/admin/teacher/view.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('선생님 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;
					$('#mainNgView > div[data-view=data-view]').html($.tmpl(hakwonTmpl.teacher.viewData, colData));
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	return teacherService;
});

/**
 * 선생님 리스트
 */
hakwonMainApp.controller('teacherListController', function($scope, $location, $routeParams, teacherService, CommUtil) {
	console.log('hakwonMainApp teacherListController call', $scope, $location, $routeParams, teacherService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'선생님'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	검색	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=search]', function() {
			window.location.href = PageUrl.teacher.list+"?"+$.param({pageNo:1, searchText:$('#mainNgView input[name=searchText]').val()});
		});
		$('#mainNgView').on('keypress', 'input[name=searchText]', function( event ) {
			if ( event.which == 13 ) {
				window.location.href = PageUrl.teacher.list+"?"+$.param({pageNo:1, searchText:$('#mainNgView input[name=searchText]').val()});
				event.preventDefault();
			}
		});


		$("#wrapper").show();
		$scope.$$postDigest(function(){
			/**
			 * 페이지 번호
			 */
			var pageNo = $routeParams.pageNo;
			if( !pageNo ) pageNo = 1;

			var searchText = $routeParams.searchText;
			if( !searchText ) searchText = '';
			$('#mainNgView input[name=searchText]').val(searchText);

			teacherService.teacherList(pageNo);
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 선생님 상세
 */
hakwonMainApp.controller('teacherViewController', function($scope, $location, $routeParams, teacherService, CommUtil) {
	console.log('hakwonMainApp teacherViewController call', $scope, $location, $routeParams, teacherService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'선생님'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 선생님 번호
		 */
		var teacherUserNo = $routeParams.teacherUserNo;
		if( !teacherUserNo ) {
			alert('선생님을 선택해 주세요.');
			window.history.back();
			return ;
		}

		/*	목록으로	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=list]', function() {
			commProto.hrefMove(PageUrl.teacher.list);
		});


		$("#wrapper").show();
		$scope.$$postDigest(function(){
			teacherService.teacherView(teacherUserNo);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});