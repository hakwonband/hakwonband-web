/**
 * 기본 컨트롤러
 */
hakwonMainApp.controller('baseController', function($rootScope, $scope, $location, $http) {
	console.log('hakwonMainApp baseController call');

	$rootScope.userAuth = userAuth;

	$rootScope.HakwonConstant = HakwonConstant;

	/*	안드로이드 업로드 여부	*/
	$rootScope.isAndroidUploader = window.PLATFORM?true:false;

	$rootScope.DefaultInfo = DefaultInfo;

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

	$rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
		if( typeof tinymce != 'undefined' && tinymce.activeEditor ) {
			tinymce.activeEditor.destroy();
		}
	});
});