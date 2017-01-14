/**
 * 메세지 서비스
 */
angular.module('hakwonApp').service('attendanceListService', function($window, CommUtil) {
	console.log('attendanceListService call');

	var attendanceListService = {};

	/**
	 * 출결 리스트 조회
	 */
	attendanceListService.getAttendanceList = function($scope, changeType) {
		var studentNo	= null;
		if( $scope.userAuth.userType == '006' ) {
			studentNo	= $scope.userAuth.userNo;
		} else {
			studentNo	= $scope.student.user_no;
		}
		var dataType	= $scope.dataType;
		var pageNo		= !isNull($scope.page_no)?$scope.page_no:'1';

		var params = {pageNo:pageNo, studentNo:studentNo, dataType:dataType};
		CommUtil.ajax({url:contextPath+'/hakwon/attendance/list/get.do', param:params, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData ) {
					if( changeType == 'student' ) {
						$scope.attendanceList = null;
					}
					if( !colData.dataList || colData.dataList.length == 0 ) {
						if( $scope.page_no == 1 ) {
						} else {
							$scope.page_no--;
							alert('마지막 출결 결과 입니다.');
						}
					} else {
						$scope.attendanceList = colData.dataList;
					}
				} else {
					commProto.logger({sendMessageListError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	return attendanceListService;

});


/* 출결 리스트 컨트롤러 */
angular.module('hakwonApp').controller('attendanceListController', function($scope, $location, $routeParams, CommUtil, attendanceListService) {
	console.log('attendanceListController call');

	try {
		/*  인증 정보 체크  */
		comm.authCheckFilter();

		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({viewType:'user',  headerTitle:'출결'});

		/*	초기화	*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('attendanceListController $viewContentLoaded');
		});

		/*	변수 초기화	*/
		$scope.userAuth	= userAuth;
		$scope.DefaultInfo = DefaultInfo;
		$scope.page_no = 1;
		$scope.dataType = '';
		if( userAuth.familyList && userAuth.familyList.length > 0 ) {
			$scope.student = userAuth.familyList[0];
		}

		if (!isNull($routeParams.page_no)) {
			$scope.page_no = $routeParams.page_no;
		}

		/*	이전 페이지	*/
		$scope.prevPage = function() {
			if( $scope.page_no == 1 ) {
				alert('첫 페이지 입니다.');
				return ;
			} else {
				$scope.page_no--;
			}
			attendanceListService.getAttendanceList($scope);
		};

		/*	다음 페이지	*/
		$scope.nextPage = function() {
			$scope.page_no++;
			attendanceListService.getAttendanceList($scope);
		};

		/*	조회 변경	*/
		$scope.dataChange = function() {
			/*	출결 리스트 조회	*/
			$scope.page_no = 1;
			attendanceListService.getAttendanceList($scope);
		}

		/*	학생 변경	*/
		$scope.studentChange = function() {
			$scope.page_no = 1;
			attendanceListService.getAttendanceList($scope, 'student');
		}

		$scope.$$postDigest(function() {

			if( userAuth.familyList && userAuth.familyList.length > 0 ) {
				if (!isNull($routeParams.student_no)) {
					$scope.student = _.findWhere(userAuth.familyList, {user_no:parseInt($routeParams.student_no)});
				}
			}

			/*	출결 리스트 조회	*/
			attendanceListService.getAttendanceList($scope);

			comm.screenInit();
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});