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
			, hakwonNo : hakwonInfo.hakwon_no
		};

		$.ajax({
			url: contextPath+"/hakwon/parent/list.do",
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
							parentService.parentList(page);
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
		var param = {parentUserNo:parentUserNo, hakwonNo : hakwonInfo.hakwon_no};
		$.ajax({
			url: contextPath+"/hakwon/parent/view.do",
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
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'학부모 리스트'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 페이지 번호
		 */
		var pageNo = $routeParams.pageNo;
		if( !pageNo ) {
			pageNo = 1;
		}

		/*	검색	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=search]', parentService.parentList);
		$('#mainNgView').on('keypress', 'input[name=searchText]', function( event ) {
			if ( event.which == 13 ) {
				parentService.parentList();
				event.preventDefault();
			}
		});

		/*	메세지 보내기	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=user_message]', function() {
			var user_no = $(this).attr('data-user-no');
			window.location.href = PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+user_no;
		});


		$("#wrapper").show();

		$scope.$on('$viewContentLoaded', function() {
			parentService.parentList(pageNo);
		});
		$scope.$$postDigest(function(){
			console.log('$$postDigest');
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
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.common.parentList+'?hakwon_no='+hakwonInfo.hakwon_no, title:'학부모 리스트'}, {url:'#', title:'상세'}]);
		/*	헤더 셋팅	*/

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 학생 번호
		 */
		var parentUserNo = $routeParams.parentUserNo;
		if( !parentUserNo ) {
			alert('학부모를 선택해 주세요.');
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

		/*	메세지 보내기	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=user_message]', function() {
			var user_no = $(this).attr('data-user-no');
			window.location.href = PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+user_no;
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