
/**
 * 이벤트 서비스
 */
hakwonApp.service('eventService', function() {
	console.log('eventService call');

	var EventService = {};

	/*	이벤트 종료일이 지났는지 체크	*/
	EventService.checkEndDateEvent = function ($scope) {
		console.log($scope.eventObj);
		var endDate		= parseInt(moment($scope.eventObj.eventDetail.end_date).format('YYYYMMDD'));
		var compareDate = parseInt(moment().format('YYYYMMDD'));

		$scope.eventObj.eventDetail.isExpireEvent = compareDate >= endDate;
	};

	return EventService;
});


/**
 * 이벤트 리스트 컨트롤러
 */
hakwonApp.controller('eventListController', function($scope, $location, $window, $routeParams, CommUtil, eventService){
	console.log('eventListController call');

	try {
		/*  학원 번호 체크  */
		var checkFlag = comm.hakwonNoCheckFilter($routeParams.hakwon_no, $location);
		if( checkFlag === false ) {
			return ;
		}

		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({viewType:'hakwon'});

		/*	초기화	*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('eventListController $viewContentLoaded');

			$scope.isEventList	= false;
			$scope.eventListObj = {};
			$scope.page			= 1;

			/*	등록일 기준 신규 컨텐츠 체크	*/
			$scope.isNewItem	= comm.isNewItem;

			if (!isNull($routeParams.page)) {
				$scope.page = $routeParams.page;
			}

			/*	이벤트 리스트 호출 	*/
			$scope.getEventList($scope.page);
		});

		/*	이벤트 리스트 호출 	*/
		$scope.getEventList = function(pageNo) {
			var params = {hakwon_no:$routeParams.hakwon_no, page_no: !isNull(pageNo) ? pageNo : '1'};
			CommUtil.ajax({url:contextPath+"/mobile/event/hakwonEventList.do", param:params, successFun:function(data) {
				try {
					if( data.error ) {
						alert('이벤트 조회를 실패 했습니다.');
						return ;
					}

					var colData = data.colData;
					if (colData) {
						$scope.eventListObj = colData;
						if ($scope.eventListObj.eventList.length > 0) $scope.isEventList = true;
						$scope.pageInfo = CommUtil.getPagenationInfo(colData.eventListTotCount, colData.pageScale, 10, $scope.page);
					} else {
						commProto.logger({hakwonEventListError:data});
					}

				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/* 이벤트 상세조회 */
		$scope.goEventDetail = function(item) {
			console.log(item);
			var params = {event_no: item.event_no, prev_page: 'list', page: $scope.page};
			CommUtil.locationHref(MENUS.sharpUrls.eventDetail, params, 'hakwon');
			return false;
		};

		/*	페이지네이션 페이지 이동	*/
		$scope.movePage = function(page) {
			if ($scope.page === page) {
				return;
			}
			$scope.page = page;
			$scope.getEventList($scope.page);
		};

		$scope.$$postDigest(comm.screenInit);

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/* 이벤트 상세보기  */
hakwonApp.controller('eventDetailController', function($scope, $window, $location, $routeParams, CommUtil, eventService){
	console.log('eventDetailController call');

	try {
		/*  학원 번호 체크  */
		var checkFlag = comm.hakwonNoCheckFilter($routeParams.hakwon_no, $location);
		if( checkFlag === false ) {
			return ;
		}

		/*	초기화	*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('eventDetailController $viewContentLoaded');

			/*	광고 블럭 요청	*/
			comm.advertBlock();

			if (isNull($routeParams.event_no)) {
				$window.history.back();
				return ;
			}

			if (!isNull($routeParams.prev_page) == 'join') {
				hakwonHeader.setHeader({viewType:'user'});
			} else {
				/*	헤더 정보 셋팅	*/
				hakwonHeader.setHeader({viewType:'hakwon'});
			}

			/*	데이터 초기화	*/
			$scope.eventObj 	= {};
			$scope.page			= 1;

			/*	이전 화면 페이지 정보		*/
			if (!isNull($routeParams.page)) {
				$scope.page = $routeParams.page;
			}

			/*	이전 화면 정보	*/
			if (!isNull($routeParams.prev_page)) {
				$scope.prevPage = $routeParams.prev_page;
			}

			/*	이벤트 상세조회 호출 	*/
			$scope.getEvent();
		});

		/*	이벤트 상세조회 호출 	*/
		$scope.getEvent = function() {
			CommUtil.ajax({url:contextPath+"/mobile/event/hakwonEventDetail.do", param:{event_no: $routeParams.event_no}, successFun:function(data) {
				try {
					if( data.error ) {
						alert('이벤트 정보 조회를 실패 했습니다.');
						return ;
					}

					$scope.eventObj = data.colData;

					$scope.eventObj.eventDetail.recommend_user_id = '';
					$scope.eventObj.eventDetail.add_info = '';

					/*	참여 여부	*/
					if( data.colData.eventDetail.event_join_count > 0 ) {
						$scope.eventObj.eventDetail.isJoinEvent = true;
					} else {
						$scope.eventObj.eventDetail.isJoinEvent = false;
					}

					if ( !isNull($scope.eventObj.eventDetail.add_info_title) ) {
						$scope.eventObj.eventDetail.add_info_yn = 'Y';
					} else {
						$scope.eventObj.eventDetail.add_info_yn = 'N';
					}

					eventService.checkEndDateEvent($scope);

					/*	video html replace	*/
					$scope.$$postDigest(comm.videoTagReplace);
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/* 이벤트 참여 */
		$scope.joinEvent = function(e) {
			if( comm.isLogin() === false ) {
				alert('가입 하고 이용해 주세요.');
				window.location.href = MENUS.sharpUrls.login;
				return false;
			}

			if( userAuth.userType == HakwonConstant.UserType.STUDENT || userAuth.userType == HakwonConstant.UserType.PARENT ) {
			} else {
				alert('학생 및 학부모님만 이용할수 있는 메뉴 입니다.');
				return false;
			}

			var idx = parseInt($(e.currentTarget).data('idx')),
				params = {
					event_no: idx
					, recommend_user_id : $scope.eventObj.eventDetail.recommend_user_id
					, add_info : $scope.eventObj.eventDetail.add_info
				};
			if ( !isNull($scope.eventObj.eventDetail.add_info_title) && isNull($scope.eventObj.eventDetail.add_info) ) {
				alert($scope.eventObj.eventDetail.add_info_title + ' 입력해 주세요.');
				return false;
			}

			CommUtil.ajax({url:contextPath+"/mobile/event/joinEvent.do", param:params, successFun:function(data) {
				try {
					if( data.error ) {
						alert('이벤트 참여를 실패 했습니다.');
						return ;
					}

					var colData = data.colData;
					if( colData.resultJoinEvent == CommonConstant.Flag.success ) {
						alert('이벤트에 참여되었습니다.');
						$scope.getEvent();
					} else if (colData.resultJoinEvent == 'exist') {
						alert('이미 참여하셨습니다.');
					} else {
						commProto.logger({eventDetailError:colData});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/* 목록이동 */
		$scope.goEventList = function() {
			if (!isNull($scope.prevPage) && $scope.prevPage == 'join') {
				CommUtil.locationHref(MENUS.sharpUrls.eventJoin, {page: $scope.page}, 'hakwon');
				return false;
			} else if(!isNull($scope.prevPage) && $scope.prevPage == 'list') {
				CommUtil.locationHref(MENUS.sharpUrls.eventList, {page: $scope.page}, 'hakwon');
				return false;
			} else {
				CommUtil.locationHref(MENUS.sharpUrls.eventList, {page: $scope.page}, 'hakwon');
				return false;
			}
		};

		$scope.$$postDigest(comm.screenInit);

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/* 이벤트 참여내역 컨트롤러 */
hakwonApp.controller('eventJoinController', function($scope, $window, $location, $routeParams, CommUtil, eventService){
	console.log('eventJoinController call');

	try {
		/*  인증 정보 체크  */
		if( comm.authCheckFilter() === false ) {
			return ;
		}

		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({viewType:'user', headerTitle:'참여한 이벤트'});

		/*	초기화	*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('eventJoinController $viewContentLoaded');

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
			CommUtil.ajax({url:contextPath+"/mobile/event/eventMyJoinList.do", param:params, successFun:function(data) {
				try {
					if( data.error ) {
						alert('참여한 이벤트 조회를 실패 했습니다.');
						return ;
					}

					var colData = data.colData;
					if (colData) {
						$scope.eventMyJoinList = colData.eventMyJoinList;
						$scope.pageInfo = CommUtil.getPagenationInfo(colData.eventMyJoinListTotCount, colData.pageScale, 10, $scope.page);
					} else {
						commProto.logger({eventMyJoinListError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
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
