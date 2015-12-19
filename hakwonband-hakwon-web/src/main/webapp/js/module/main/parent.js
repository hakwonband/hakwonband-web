/**
 * 학부모 서비스
 */
hakwonMainApp.service('parentService', function($rootScope, CommUtil) {
	console.log('hakwonMainApp parentService call', CommUtil);

	var parentService = {};

	/**
	 * 학부모 리스트
	 */
	parentService.parentList = function(pageNo, callback) {
		var searchText = $('#mainNgView input[name=searchText]').val();
		if( !pageNo ) pageNo = 1;

		var param = {
			pageNo : pageNo
			, searchText : searchText
			, hakwonNo : hakwonInfo.hakwon_no
		};
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/parent/list.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	};


	/**
	 * 학부모 상세
	 */
	parentService.parentView = function(parentUserNo, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/parent/view.do"
			, header	: hakwonInfo.getHeader()
			, param		: {
				parentUserNo:parentUserNo
				, hakwonNo : hakwonInfo.hakwon_no
			}
			, callback	: callback
		});
	};

	return parentService;
});

/**
 * 학부모 리스트
 */
hakwonMainApp.controller('parentListController', function($scope, $location, $routeParams, parentService, CommUtil, $timeout) {
	console.log('hakwonMainApp parentListController call', $scope, $location, $routeParams, parentService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'학부모 리스트'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;
		$scope.PageUrl = PageUrl;
		$scope.comm = comm;

		$("#wrapper").show();

		/*	현재 학원 정보	*/
		$scope.hakwonInfo = hakwonInfo;

		/**
		 * 페이지 번호
		 */
		var pageNo = $routeParams.pageNo;
		if( !pageNo ) {
			pageNo = 1;
		}

		/*	검색	*/
		$scope.search = function() {
			parentService.parentList();
		}

		/*	메세지 보내기	*/
		$scope.userMessage = function(user_no) {
			window.location.href = PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+user_no;
		}

		var parentListCallback = function(data) {
			try {
				if( data.error ) {
					alert('학부모 조회를 실패 했습니다.');
					return false;
				}
				var colData = data.colData;
				var pageNo = data._param.pageNo;

				$scope.dataList = colData.dataList;
				if( colData.dataCount == 0 ) {
					$('#mainNgView div[data-view=pagination]').html('');
				} else {
					var totalPages = comm.pageCalc(colData.dataCount, colData.pageScale);
					$('#mainNgView div[data-view=pagination]').bootpag({
						total: totalPages,
						page: pageNo,
						maxVisible: DefaultInfo.pageScale,
						leaps: true
					}).unbind("page").bind("page", function(event, page){
						parentService.parentList(page, parentListCallback);
					});
				}

				$timeout(function() {
					var $dataDiv = $('#mainNgView div[data-view=data-div]');
					$dataDiv.find('.i-checks').iCheck({
						checkboxClass: 'icheckbox_square-green'
					});
				},50);
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}

		$scope.$$postDigest(function(){
			/**
			 * 학부모 검색
			 */
			parentService.parentList(pageNo, parentListCallback);
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
		$scope.hakwonCommon = hakwonCommon;
		$scope.hakwonInfo = hakwonInfo;

		/**
		 * 학부모 번호
		 */
		var parentUserNo = $routeParams.parentUserNo;
		if( !parentUserNo ) {
			alert('학부모를 선택해 주세요.');
			return ;
		}

		/*	목록으로	*/
		$scope.list = function() {
			if (history.length > 1) {
				window.history.back();
			} else {
				$location.path('/parent/list');
			}
		}
		$scope.userMessage = function(user_no) {
			window.location.href = PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+user_no;
		}

		$("#wrapper").show();
		parentService.parentView(parentUserNo, function(data) {
			try {
				if( data.error ) {
					alert('학부모 조회를 실패 했습니다.');
					window.history.back();
					return false;
				}
				var colData = data.colData;

				$scope.childList = colData.childList;
				$scope.parentInfo = colData.userInfo;
				if( !colData.userInfo ) {
					alert('학원에 가입 하지 않은 학부모 입니다.');
					window.history.back();
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});