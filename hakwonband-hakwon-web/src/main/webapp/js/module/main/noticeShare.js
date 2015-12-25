/**
 * 공지 공유
 */
hakwonMainApp.service('noticeShareService', function(CommUtil) {
	console.log('hakwonMainApp noticeShareService call');

	var noticeShareService = {};

	/**
	 * 공유한 리스트
	 */
	noticeShareService.sendList = function(param, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/noticeShare/sendList.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}

	/**
	 * 공유 받은 리스트
	 */
	noticeShareService.receiveList = function(param, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/noticeShare/receiveList.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}

	/**
	 * 공유 하기
	 */
	noticeShareService.send = function(param, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/noticeShare/send.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}

	/**
	 * 공유 수정하기
	 */
	noticeShareService.updateShare = function(param, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/noticeShare/update.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}

	/**
	 * 공유 삭제
	 */
	noticeShareService.deleteShare = function(param, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/noticeShare/delete.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}


	return noticeShareService;
});


/**
 * 공지 공유
 */
hakwonMainApp.controller('noticeShareSendController', function($scope, $location, $window, $routeParams, noticeShareService, CommUtil) {
	console.log('hakwonMainApp noticeShareSendController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'공유'}]);

		/*	is Mobile	*/
		$scope.isMobile = isMobile.any();

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 공지 공유 리스트
 */
hakwonMainApp.controller('noticeShareSendListController', function($scope, $location, $window, $routeParams, noticeShareService, CommUtil) {
	console.log('hakwonMainApp noticeShareSendListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'공유'}]);

		/*	is Mobile	*/
		$scope.isMobile = isMobile.any();

		/**
		 * 페이지 번호
		 */
		$scope.page_no = 1;

		/**
		 * 보낸 리스트
		 */
		var sendList = function(page_no) {
			var param = {
				start_no		: 'start_no'
				, hakwon_no		: 'hakwon_no'
				, start_date	: 'start_date'
				, end_date		: 'end_date'
			};

			/*	조회	*/
			noticeShareService.sendList(param, function(data) {

			});
		}

		/*	페이지네이션 페이지 이동	*/
		$scope.movePage = function(page_no) {
			if ($scope.page_no === page_no) {
				return;
			}
			$scope.page_no = page_no;
			sendList(page_no);
		};

		sendList($scope.page_no);
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 받은 공지 리스트
 */
hakwonMainApp.controller('noticeShareReceiveListController', function($scope, $location, $window, $routeParams, noticeShareService, CommUtil) {
	console.log('hakwonMainApp noticeShareReceiveListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'공유'}]);

		/*	is Mobile	*/
		$scope.isMobile = isMobile.any();

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});