
/**
 * 이벤트 추천받은 서비스
 */
hakwonApp.service('eventRecommendService', function() {
	console.log('eventRecommendService call');

	var Service = {};

	return Service;
});

/* 이벤트 참여내역 컨트롤러 */
hakwonApp.controller('eventRecommendController', function($scope, $window, $location, $routeParams, CommUtil, eventRecommendService, $http){
	console.log('eventRecommendController call');

	try {
		/*  인증 정보 체크  */
		if( comm.authCheckFilter() === false ) {
			return ;
		}

		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({viewType:'user', headerTitle:'참여한 이벤트'});

		/*	초기화	*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('eventRecommendController $viewContentLoaded');

			/*	데이터 초기화	*/
			$scope.eventMyJoinList	= [];
			$scope.page				= 1;

			/*	이전 화면 페이지 정보		*/
			if (!isNull($routeParams.page)) {
				$scope.page = $routeParams.page;
			}

			/*	참여한 이벤트 리스트 호출 	*/
			$scope.getJoinList($scope.page);
		});

		/*	참여한 이벤트 리스트 호출 	*/
		$scope.getJoinList = function(pageNo) {
			var params = {page_no: !isNull(pageNo) ? pageNo : '1'};
//			CommUtil.ajax({url:contextPath+"/mobile/event/eventMyJoinList.do", param:params, successFun:function(data) {
			$http({
				withCredentials: false,
				method: 'post',
				url: contextPath + '/mobile/event/eventRecommendList.do',
				headers: angularHeaders,
				data: $.param(params, true)
			}).success(function(data, status) {
				var colData = data.colData;
				if (status === 200 && colData) {
					$scope.eventList = colData.eventList;
					$scope.pageInfo = CommUtil.getPagenationInfo(colData.eventListTotCount, colData.pageScale, 10, $scope.page);
				} else {
					commProto.logger({loginError:colData});
				}
			}).error(function(xhr, textStatus, errorThrown) {

			});
		};

		/*	이벤트 상세조회	*/
		$scope.goEventDetail = function(item) {
			/*	currentHakwon 정보가 없기에, hakwon_no를 item에서 셋팅함. */
			var params = {event_no : item.event_no, prev_page: 'join', page: $scope.page, hakwon_no: item.hakwon_no};

			CommUtil.locationHref(MENUS.sharpUrls.eventDetail, params);
			return false;
		};

		/*	페이지네이션 페이지 이동	*/
		$scope.movePage = function(page) {
			if ($scope.page === page) {
				return;
			}
			$scope.page = page;
			$scope.getJoinList($scope.page);
		};

		$scope.getFileFullPath = function(filePath, type, isThumb) {
			return CommUtil.createFileFullPath(filePath, type, isThumb);
		};

		$scope.$$postDigest(comm.screenInit);

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});
