/**
 * 공지 공유
 */
hakwonMainApp.service('noticeShareService', function(CommUtil) {
	console.log('hakwonMainApp noticeShareService call');

	var noticeShareService = {};

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