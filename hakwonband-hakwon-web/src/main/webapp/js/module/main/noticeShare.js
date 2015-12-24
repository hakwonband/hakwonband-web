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
 * 받은 공지
 */
hakwonMainApp.controller('noticeShareReceiveController', function($scope, $location, $window, $routeParams, noticeShareService, CommUtil) {
	console.log('hakwonMainApp noticeShareReceiveController call');

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