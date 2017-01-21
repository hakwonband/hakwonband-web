var hakwonMainApp = angular.module('hakwonMainApp', ['ngRoute', 'ui.bootstrap', 'ngTouch']);

hakwonMainApp.config(function($httpProvider, $routeProvider) {
	console.log('hakwonMainApp.config');

	$httpProvider.defaults.headers.post  = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};

	$routeProvider
		.when('/noticeWrite/hakwon', {
			templateUrl: '/assets/js/popup/hakwonNoticeWriteMobile.html'
			, controller: 'hakwonNoticeWriteController'
		})
		.when('/noticeWrite/hakwonClass', {
			templateUrl: '/assets/js/popup/hakwonClassNoticeWriteMobile.html'
			, controller: 'hakwonClassNoticeWriteController'
		});
});

angular.module('hakwonMainApp').config(['$locationProvider', function($locationProvider) {
	$locationProvider.hashPrefix('');
}]);