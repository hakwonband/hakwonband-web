
/**
 * 학원 선생님 서비스
 */
hakwonApp.service('teahcerListService', function() {
	console.log('teahcerListService call');
});

/* 학원 선생님 리스트  */
hakwonApp.controller('teacherListController', function($scope, $location, $routeParams, CommUtil, teahcerListService){
	console.log('teacherListController call', $scope);

	try {
		/*  인증 정보 체크  */
		comm.authCheckFilter();

		/*  학원 번호 체크  */
		var checkFlag = comm.hakwonNoCheckFilter($routeParams.hakwon_no, $location);
		if( checkFlag === false ) {
			return ;
		}

		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({viewType:'hakwon'});

		/*	초기화	*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('eventJoinController $viewContentLoaded');

			/*	데이터 초기화	*/
			$scope.hakwonTeacherList			= [];

			/*	선생님 리스트 호출 	*/
			$scope.getHakwonTeacherList();
		});

		/*	선생님 리스트 호출 	*/
		$scope.getHakwonTeacherList = function() {
			var params = $routeParams;
			if(isNull(params.hakwon_no)) {
				alert('학원 번호가 올바르지 않습니다.');
				return;
			}
			CommUtil.ajax({url:contextPath+"/mobile/hakwon/hakwonTeacherList.do", param:params, successFun:function(data) {
				try {
					var colData = data.colData;
					if (colData) {
						$scope.hakwonTeacherList			= colData.hakwonTeacherList;
					} else {
						commProto.logger({hakwonTeacherListError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		$scope.getFileFullPath = function(filePath, type, isThumb) {
			return CommUtil.createFileFullPath(filePath, type, isThumb);
		};

		$scope.getUserGender = function(gender) {
			return CommUtil.createGenderName(gender);
		};

		$scope.$$postDigest(comm.screenInit);

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});