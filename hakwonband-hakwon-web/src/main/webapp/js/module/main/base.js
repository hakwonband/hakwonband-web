/**
 * 기본 서비스
 */
hakwonMainApp.service('baseService', function() {
	console.log('hakwonMainApp baseService call');

});

/**
 * 기본 컨트롤러
 */
hakwonMainApp.controller('baseController', function($rootScope, $scope, $location, baseService, $http) {
	console.log('hakwonMainApp baseController call');

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

		$rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
			if( typeof tinymce != 'undefined' && tinymce.activeEditor ) {
				tinymce.activeEditor.destroy();
			}
		});

		/**
		 * 통신
		 */
		$rootScope.ajaxReq = [];
		$rootScope.colHttp = function(reqObj) {
			if( reqObj.double_req_msg === null ) {
				/*	토스트 안보여줌	*/
			} else if( isNull(reqObj.double_req_msg) ) {
				reqObj.double_req_msg = '요청 중 입니다.';
			}
			if( isNull(reqObj.method) ) {
				reqObj.method = 'post';
			}

			if( _.contains($rootScope.ajaxReq, reqObj.url) ) {
				if( reqObj.double_req_msg !== null ) {
					alert(reqObj.double_req_msg);
				}
			} else {
				$rootScope.ajaxReq.push(reqObj.url);

				var queryData = undefined;
				if( reqObj.param ) {
					queryData = $.param(reqObj.param, true);
				}
				$http({
					method		: reqObj.method
					, url		: reqObj.url
					, headers	: reqObj.header
					, data		: queryData
				}).then(function(response) {
					console.debug('response', response);
					$rootScope.ajaxReq = _.without($rootScope.ajaxReq, reqObj.url);
					if( reqObj.callback ) {
						response.data._param = reqObj.param;
						reqObj.callback(response.data);
					}
				}, function(response) {
					$rootScope.ajaxReq = _.without($rootScope.ajaxReq, reqObj.url);
					if( reqObj.callback ) {
						response.data._param = reqObj.param;
						reqObj.callback(response.data);
					}
				});
			}
		}

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});