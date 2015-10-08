/**
 * 기본 서비스
 */
hakwonMainApp.service('baseService', function() {
	console.log('hakwonMainApp baseService call');

});

/**
 * 기본 컨트롤러
 */
hakwonMainApp.controller('baseController', function($rootScope, $scope, $location, baseService) {
	console.log('hakwonMainApp baseController call', $rootScope, $scope, $location, baseService);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		$rootScope.HakwonConstant = HakwonConstant;

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});