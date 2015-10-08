
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
			templateUrl: '/js/partials/signUp.html'
			, controller: 'SignUpController'
		})
		.when('/findInfo', {
			templateUrl: '/js/partials/findInfo.html'
			, controller: 'FindInfoController'
		})
		.otherwise({
			redirectTo: '/index'
		});
}]);


/**
 * 학원 공통 앵귤러 모듈
 */
hakwonCommonApp.factory('CommUtil', function($http) {
	return {
		/**
		 * 년월 - 포멧터
		 */
		yearMonthFormatter: function(dateStr) {
			if( dateStr ) {
				return dateStr.substring(0, 4)+'-'+dateStr.substring(4, 6);
			} else {
				return '';
			}
		}

		/**
		 * 데이타 통신을 도와주는 util
		 * @param httpObj
		 * errorFun : 실패 함수(기본:commProto.commonError)
		 * successFun : 성공 함수
		 * method : 통신 메소드(기본:post)
		 * queryString : 쿼리 스트링
		 * param : 쿼리스트링으로 변환되는 파라미터 object
		 * url : 호출 url
		 */
		, ajax : function(httpObj) {
			if( !httpObj.errorFun ) {
				httpObj.errorFun = commProto.commonError;
			}

			if( !httpObj.method ) {
				httpObj.method = 'post';
			}

			if( !httpObj.queryString && httpObj.param ) {
				httpObj.queryString = $.param(httpObj.param, true);
			}

			$http({
				withCredentials: false,
				method: httpObj.method,
				url: httpObj.url,
				headers: {'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With':'XMLHttpRequest', hakwonNo:hakwonInfo.hakwon_no},
				data: httpObj.queryString
			}).
				success(httpObj.successFun).error(httpObj.errorFun);
		}
	}
});
