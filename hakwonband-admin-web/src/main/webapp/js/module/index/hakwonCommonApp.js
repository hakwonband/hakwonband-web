
/**
 * 학원 공통 앱
 * 로그인/회원 가입 등.
 */
var hakwonCommonApp = angular.module('hakwonCommonApp', ['ngRoute', 'ngTouch']);
hakwonCommonApp.config(['$routeProvider', function($routeProvider) {
	console.log('hakwonCommonApp.config');
	$routeProvider
		.when('/index', {
			template: hakwonTmpl.common.init
			, controller: 'indexController'
		})
		.when('/login', {
			template: hakwonTmpl.common.login
			, controller: 'loginController'
		})
		.when('/signUp', {
			template: hakwonTmpl.signUp
			, controller: 'signUpController'
		})
		.otherwise({
			redirectTo: '/index'
		});
}]);
