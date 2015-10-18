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

		$scope.hakwonList = [];
		$scope.currentHakwonInfo = {};

		$rootScope.userAuth = userAuth;

		$rootScope.HakwonConstant = HakwonConstant;

		var originalLocationUrl = $location.url;
		$location.urlChange = function (url, reload) {
			console.log('urlChange['+url+']');
			if (reload === false) {
				var lastRoute = $route.current;
				var un = $rootScope.$on('$locationChangeSuccess', function () {
					$route.current = lastRoute;
					un();
				});
			}
			return originalLocationUrl.apply($location, [url]);
		}

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});