/**
 * 회원정보 서비스
 */
angular.module('hakwonApp').service('findService', function($http) {
	console.log('findService call');

	var findService = {};

	findService.findId = function(params, callback) {
		var queryString = $.param(params, true);
		$http({
			withCredentials: false,
			method: 'post',
			url: contextPath + '/findIdSearch.do',
			headers: angularHeaders,
			data: queryString
		}).then(function(res) {
			var colData = res.data.colData;
			if (res.status === 200 && colData) {
				callback(colData);
			} else {
				commProto.logger({loginError:colData});
			}
		}, function(res) {
			console.error('fail', res);
		});
	};

	findService.findPw = function(params, callback) {
		var queryString = $.param(params, true);
		$http({
			withCredentials: false,
			method: 'post',
			url: contextPath + '/passwordReplacement.do',
			headers: angularHeaders,
			data: queryString
		}).then(function(res) {
			var colData = res.data.colData;
			if (res.status === 200 && colData) {
				callback(colData);
			} else {
				alert('아이디 검색 문제가 발생했습니다.\n다시 시도해 주세요.');
				commProto.logger({loginError:colData});
			}
		}, function(res) {
			console.error('fail', res);
		});
	};

	return findService;
});


/*	아이디 찾기 */
angular.module('hakwonApp').controller('findIdController', function($scope, $location, $routeParams, findService, CommUtil){
	console.log('findIdController call');

	try {
		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({headerTitle:'아이디 찾기'});

		$scope.isFound = false;

		$scope.findId = function() {
			var formData = CommUtil.getFormValues($('.sec_findid'), $scope);
			if (isNull(formData.user_name)) {
				alert('이름을 입력해주세요.');
				return;
			}

			if (isNull(formData.tel1_no)) {
				alert('전화번호를 입력해주세요.');
				return;
			}

			findService.findId(formData, function(colData) {
				if (colData.result === 'not find id') {
					alert('정보에 해당하는 아이디가 없습니다.');
				} else if (colData.result) {
					$scope.isFound = true;
					$scope.foundId = colData.result;
				} else {
					alert('아이디 검색 문제가 발생했습니다.\n다시 시도해 주세요.');
				}
			});
		};

		$scope.goLogin = function() {
			window.location.href = MENUS.sharpUrls.login;
		};

		$scope.$$postDigest(comm.screenInit);

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/*	비밀번호 찾기 */
angular.module('hakwonApp').controller('findPwController', function($scope, $location, $routeParams, findService, CommUtil){
	console.log('findPwController call');

	try {
		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({headerTitle:'비밀번호 찾기'});

		$scope.isFound = false;

		$scope.find = {
			receive_type : "sms"
			, user_email : ""
			, tel1_no : ""
			, user_id : ''
		};

		$scope.findPw = function() {
			console.log('여기 타나?');

			var formData = $scope.find;
			console.log('formData', formData);

			if (isNull(formData.user_id)) {
				alert('아이디를 입력해주세요.');
				return;
			}
			if( formData.receive_type == 'sms' ) {
				if( isNull(formData.tel1_no) ) {
					alert('핸드폰 번호를 입력해 주세요.');
					return;
				}
			} else if( formData.receive_type == 'email' ) {
				if( isNull(formData.user_email) ) {
					alert('이메일 주소를 입력해 주세요.');
					return;
				}
			} else {
				alert('잘못된 선택 입니다.');
				return ;
			}

			findService.findPw(formData, function(colData) {
				if (colData.result === 'notexist') {
					alert('정보에 해당하는 비밀번호가 없습니다.');
				} else if (colData.result === CommonConstant.Flag.success && colData.resultInt === 1) {
					$scope.isFound = true;
				} else {
					alert('아이디 검색 문제가 발생했습니다.\n다시 시도해 주세요.');
				}
			});
		};

		$scope.$$postDigest(comm.screenInit);

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});