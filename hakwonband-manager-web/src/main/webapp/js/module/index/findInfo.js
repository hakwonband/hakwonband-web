
/**
 * 회원가입 서비스
 */
hakwonCommonApp.service('FindInfoService', function() {
	console.log('hakwonCommonApp FindInfoService call');

});

/**
 * 회원가입 컨트롤러
 */
hakwonCommonApp.controller('FindInfoController', function($scope, $location, FindInfoService, CommUtil) {
	console.log('hakwonCommonApp FindInfoController call', $scope, $location, FindInfoService, CommUtil);

	try {
		$scope.initialize = function() {
			$scope.checkUserId			= false;
			$scope.checkUserPwd			= false;
			$scope.userInfo.user_id		= '';
			$scope.userInfo.tel1_no		= '';
			$scope.userInfo.user_name	= '';
			$scope.userInfo.user_email	= '';
		};

		$scope.userInfo = {
			user_id 	: '',
			tel1_no		: '',
			user_name 	: '',
			user_email 	: ''
		};

		$scope.goLogin = function() {
			window.location.href = PageUrl.login;
		};

		$scope.procCheckUserId = function() {
			console.log($scope.userInfo);
			if (!$scope.userInfo.user_name || !$scope.userInfo.tel1_no) {
				alert('이름과 전화번호를 입력해주세요.');
				return ;
			}
			var params = {
				user_name	: $scope.userInfo.user_name,
				tel1_no		: $scope.userInfo.tel1_no
			};
			CommUtil.ajax({param:params, url:contextPath+"/findIdSearch.do", successFun:function(data) {
				try {
					if (data.colData) {
						if (data.colData.result == 'notexist') {
							alert('일치하는 아이디가 존재하지 않습니다.');
						} else if (data.colData.result == 'exist') {
							$scope.checkUserId = true;
							$scope.userInfo.user_id = data.colData.user_id;
						} else {
							commProto.logger({duplicateCheckIdError:data});
						}
					} else {
						commProto.logger({duplicateCheckIdError:data});
					}

				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		$scope.procCheckUserPwd = function() {
			console.log($scope.userInfo);
			if (!$scope.userInfo.user_id || !$scope.userInfo.user_name || !$scope.userInfo.tel1_no) {
				alert('아이디, 이름, 전화번호를 입력해주세요.');
				return ;
			}

			var params = {
				user_id		: $scope.userInfo.user_id,
				user_name	: $scope.userInfo.user_name,
				tel1_no		: $scope.userInfo.tel1_no
			};

			CommUtil.ajax({param:params, url:contextPath+"/passwordReplacement.do", successFun:function(data) {
				try {
					if (data.colData) {
						if (data.colData.result == 'notexist') {
							alert('일치하는 사용자 정보가 존재하지 않습니다.');
						} else if (data.colData.result == CommonConstant.Flag.success) {
							$scope.checkUserPwd = true;
						} else {
							commProto.logger({passwordReplacementError:data});
						}
					} else {
						commProto.logger({passwordReplacementError:data});
					}

				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		$scope.initialize();

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});
