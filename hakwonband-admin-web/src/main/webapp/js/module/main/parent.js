/**
 * 학부모 서비스
 */
hakwonMainApp.service('parentService', function($http, CommUtil) {
	console.log('hakwonMainApp parentService call', CommUtil);

	var parentService = {};

	/**
	 * 학부모 리스트
	 */
	parentService.parentList = function(pageNo) {
		var searchText = $('#mainNgView input[name=searchText]').val();
		if( !pageNo ) pageNo = 1;

		var param = {
			pageNo : pageNo
			, searchText : searchText
		};

		$.ajax({
			url: contextPath+"/admin/parent/list.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('학부모 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;

					var $dataDiv = $('#mainNgView div[data-view=data-div]');
					var $dataTableBody = $dataDiv.find('table > tbody');

					if( colData.dataCount == 0 ) {
						$dataTableBody.html($.tmpl(hakwonTmpl.parent.listNoData, colData));

						$dataDiv.find('thead').hide();
						$('#mainNgView div[data-view=pagination]').html('');
					} else {
						$dataTableBody.html($.tmpl(hakwonTmpl.parent.listRow, colData));

						$dataDiv.find('thead').show();
						var totalPages = comm.pageCalc(colData.dataCount, colData.pageScale);
						$('#mainNgView div[data-view=pagination]').bootpag({
							total: totalPages,
							page: pageNo,
							maxVisible: DefaultInfo.pageScale,
							leaps: true
						}).unbind("page").bind("page", function(event, page){
							param.pageNo = page;
							window.location.href = PageUrl.parent.list+"?"+$.param(param);
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
	 * 학부모 상세
	 */
	parentService.parentView = function(parentUserNo) {
		var param = {parentUserNo:parentUserNo};
		$.ajax({
			url: contextPath+"/admin/parent/view.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('학부모 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;
					$('#mainNgView > div[data-view=data-view]').html($.tmpl(hakwonTmpl.parent.viewData, colData));
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	return parentService;
});

/**
 * 학부모 리스트
 */
hakwonMainApp.controller('parentListController', function($scope, $location, $routeParams, parentService, CommUtil) {
	console.log('hakwonMainApp parentListController call', $scope, $location, $routeParams, parentService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학부모'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	검색	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=search]', function() {
			window.location.href = PageUrl.parent.list+"?"+$.param({pageNo:1, searchText:$('#mainNgView input[name=searchText]').val()});
		});
		$('#mainNgView').on('keypress', 'input[name=searchText]', function( event ) {
			if ( event.which == 13 ) {
				window.location.href = PageUrl.parent.list+"?"+$.param({pageNo:1, searchText:$('#mainNgView input[name=searchText]').val()});
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

			parentService.parentList(pageNo);
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 학부모 상세
 */
hakwonMainApp.controller('parentViewController', function($scope, $location, $routeParams, parentService, CommUtil) {
	console.log('hakwonMainApp parentViewController call', $scope, $location, $routeParams, parentService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학부모'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 학생 번호
		 */
		var parentUserNo = $routeParams.parentUserNo;
		if( !parentUserNo ) {
			alert('학부모를 선택해 주세요.');
			window.history.back();
			return ;
		}

		/*	목록으로	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=list]', function() {
			if (history.length > 1) {
				window.history.back();
			} else {
				$location.path('/parent/list');
			}
		});


		$("#wrapper").show();
		$scope.$on('$viewContentLoaded', function() {
			parentService.parentView(parentUserNo);
		});
		$scope.$$postDigest(function(){
			console.log('$$postDigest');
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});