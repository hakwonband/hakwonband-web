/**
 * 사용자 서비스
 */
hakwonMainApp.service('userService', function($http, CommUtil) {
	console.log('hakwonMainApp userService call');

	var userService = {};

	/**
	 * 사용자 정보
	 */
	userService.userInfo = function(param, callback) {
		CommUtil.ajax({url:contextPath+"/admin/edvertise/bannerReqDetail.do", param:param, successFun:callback});
	};

	return userService;
});

/**
 * 사용자 수정
 */
hakwonMainApp.controller('userModifyController', function($scope, $location, $routeParams, userService, CommUtil) {
	console.log('hakwonMainApp userModifyController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'사용자'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;


		userService.userInfo({user_no:''}, function() {

		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});