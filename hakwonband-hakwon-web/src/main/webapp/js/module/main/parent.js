/**
 * 학부모 서비스
 */
hakwonMainApp.service('parentService', function($rootScope, CommUtil) {
	console.log('hakwonMainApp parentService call');

	var parentService = {};

	/**
	 * 학부모 정보
	 */
	parentService.parentInfo = function(parentUserNo, callback) {
		var param = {parentUserNo:parentUserNo, hakwonNo : hakwonInfo.hakwon_no};
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/parent/view.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}

	/**
	 * 학부모 정보 수정
	 */
	parentService.parentUpdate = function(parentInfo, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/parent/update.do"
			, header	: hakwonInfo.getHeader()
			, param		: parentInfo
			, callback	: callback
		});
	}

	/**
	 * 탈퇴
	 */
	parentService.without = function(delUserInfo, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/without.do"
			, header	: hakwonInfo.getHeader()
			, param		: delUserInfo
			, callback	: callback
		});
	}

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
	console.log('hakwonMainApp parentListController call');

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
			parentService.parentList(1, parentListCallback);
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
	console.log('hakwonMainApp parentViewController call');

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

		/*	수정으로	*/
		$scope.modify = function() {
			$location.path('/parent/modify');
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

		/**
		 * 탈퇴
		 */
		$scope.without = function() {
			if( window.confirm('회원님을 탈퇴 시키겠습니까?') ) {
				parentService.without({user_no:parentUserNo, hakwon_no:hakwonInfo.hakwon_no}, function(data) {
					if( data.colData && data.colData.flag == 'success' ) {
						window.history.back();
					} else {
						alert('탈퇴를 실패 했습니다.');
					}
				});
			}
		}
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 학부모 수정
 */
hakwonMainApp.controller('parentModifyController', function($scope, $location, $routeParams, parentService, CommUtil) {
	console.log('hakwonMainApp parentModifyController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.common.parentList+'?hakwon_no='+hakwonInfo.hakwon_no, title:'학부모 리스트'}, {url:'#', title:'수정'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 학부모 번호
		 */
		var parentUserNo = $routeParams.parentUserNo;
		if( !parentUserNo ) {
			alert('학부모를 선택해 주세요.');
			if (history.length > 1) {
				window.history.back();
			} else {
				$location.path('/parent/list');
			}
			return ;
		}


		/**
		 * 학부모 정보 조회
		 */
		parentService.parentInfo(parentUserNo, function(data) {
			data.colData.userInfo.user_birthday = new Date(data.colData.userInfo.user_birthday);
			$scope.user_info = data.colData.userInfo;
		});

		/**
		 * 저장
		 */
		$scope.save = function() {
			var param = {
				user_name				: $scope.user_info.user_name
				, user_email			: $scope.user_info.user_email
				, user_pwd				: $scope.user_info.user_pwd
				, user_birthday			: moment($scope.user_info.user_birthday).format('YYYY-MM-DD')
				, user_gender			: $scope.user_info.user_gender
				, tel1_no				: $scope.user_info.tel1_no
				, hakwonNo				: hakwonInfo.hakwon_no
				, parentUserNo			: parentUserNo
			};

			parentService.parentUpdate(param, function(data) {
				if( data && data.colData && data.colData.flag == 'success' ) {
					if (history.length > 1) {
						window.history.back();
					} else {
						$location.path('/parent/list');
					}
				} else {
					alert('수정을 실패 했습니다.');
				}
			});
		}

		/**
		 * 취소
		 */
		$scope.cancel = function() {
			if (history.length > 1) {
				window.history.back();
			} else {
				$location.path('/parent/list');
			}
		}

		$scope.$$postDigest(function(){
			console.log('$$postDigest');
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});