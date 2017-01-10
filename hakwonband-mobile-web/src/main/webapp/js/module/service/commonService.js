/**
 * 공통 서비스
 */
angular.module('hakwonApp').service('commonService', function($http, $window) {
	console.log('commonService call');

	this.locationHref = function (href, params) {
		var resParams = _.map(params || {}, function (value, key) {
			return  key + '=' + (_.isUndefined(value) ? '' : value);
		}).join('&');

		//console.log(resParams);
		$window.location.href = href + '?' + resParams;
	};

});