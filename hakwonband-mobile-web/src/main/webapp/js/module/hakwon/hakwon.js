/**
 * 학원 서비스
 */
hakwonApp.service('hakwonService', function($http) {
	console.log('hakwonService call');

	var hakwonService = {};

	hakwonService.getHakwonDetail = function(hakwon_no, callback) {
		var queryString = $.param({hakwon_no:hakwon_no}, true);
		$http({
			withCredentials: false,
			method: 'post',
			url: contextPath + '/mobile/main/hakwonDetail.do',
			headers: angularHeaders,
			data: queryString
		}).success(function(data, status) {
			var colData = data.colData;
			if (status === 200 && colData) {
				callback(colData);
			} else {
				commProto.logger({loginError:colData});
			}
		}).error(function(xhr, textStatus, errorThrown) {

		});
	};

	hakwonService.joinHakwon = function(hakwon_no, callback) {
		var queryString = $.param({hakwon_no:hakwon_no}, true);
		$http({
			withCredentials: false,
			method: 'post',
			url: contextPath + '/mobile/main/insertHakwonMember.do',
			headers: angularHeaders,
			data: queryString
		}).success(function(data, status) {
			var colData = data.colData;
			if (status === 200 && colData) {
				callback(colData);
			} else {
				commProto.logger({loginError:colData});
			}
		}).error(function(xhr, textStatus, errorThrown) {

		});
	};

	hakwonService.getHakwonIntro = function(hakwon_no, callback) {
		var queryString = $.param({hakwon_no:hakwon_no}, true);
		$http({
			withCredentials: false,
			method: 'post',
			url: contextPath + '/mobile/main/hakwonIntroduction.do',
			headers: angularHeaders,
			data: queryString
		}).success(function(data, status) {
			var colData = data.colData;
			if (status === 200 && colData) {
				callback(colData);
			} else {
				commProto.logger({loginError:colData});
			}
		}).error(function(xhr, textStatus, errorThrown) {

		});
	};

	hakwonService.getClassInfo = function(params, callback) {
		var queryString = $.param(params, true);
		$http({
			withCredentials: false,
			method: 'post',
			url: contextPath + '/mobile/main/classDetail.do',
			headers: angularHeaders,
			data: queryString
		}).success(function(data, status) {
			var colData = data.colData;
			if (status === 200 && colData) {
				callback(colData);
			} else {
				commProto.logger({loginError:colData});
			}
		}).error(function(xhr, textStatus, errorThrown) {

		});
	};

	hakwonService.getHakwonCates = function(callback) {
		$http({
			withCredentials: false,
			method: 'post',
			url: contextPath + '/mobile/main/getHakwon_cate.do',
			headers: angularHeaders
		}).success(function(data, status) {
			var colData = data.colData;
			if (status === 200 && colData) {
				callback(colData);
			} else {
				commProto.logger({loginError:colData});
			}
		}).error(function(xhr, textStatus, errorThrown) {

		});
	};

	hakwonService.getSidos = function(callback) {
		$http({
			withCredentials: false,
			method: 'post',
			url: contextPath + '/hakwon/address/sidoList.do',
			headers: angularHeaders
		}).success(function(data, status) {
			var colData = data.colData;
			if (status === 200 && colData) {
				callback(colData);
			} else {
				commProto.logger({loginError:colData});
			}
		}).error(function(xhr, textStatus, errorThrown) {

		});
	};

	hakwonService.getGugun = function(sido, callback) {
		var queryString = $.param({sido:sido}, true);
		$http({
			withCredentials: false,
			method: 'post',
			url: contextPath + '/hakwon/address/gugunList.do',
			headers: angularHeaders,
			data: queryString
		}).success(function(data, status) {
			var colData = data.colData;
			if (status === 200 && colData) {
				callback(colData);
			} else {
				commProto.logger({loginError:colData});
			}
		}).error(function(xhr, textStatus, errorThrown) {

		});
	};

	hakwonService.searchHakwon = function(params, callback) {
		var queryString = $.param(params, true);
		$http({
			withCredentials: false,
			method: 'post',
			url: contextPath + '/mobile/hakwon/searchHakwonList.do',
			headers: angularHeaders,
			data: queryString
		}).success(function(data, status) {
			var colData = data.colData;
			if (status === 200 && colData) {
				callback(colData);
			} else {
				commProto.logger({loginError:colData});
			}
		}).error(function(xhr, textStatus, errorThrown) {

		});

	};

	return hakwonService;
});


/*	학원소개 컨트롤러  */
hakwonApp.controller('hakwonIntroController', function($scope, $location, $routeParams, hakwonService, CommUtil){
	console.log('hakwonIntroController call');

	try {
		/*  학원 번호 체크  */
		var checkFlag = comm.hakwonNoCheckFilter($routeParams.hakwon_no, $location);
		if( checkFlag === false ) {
			return ;
		}

		$scope.CommUtil = CommUtil;

		/*	스토어 버튼 뷰 여부	*/
		$scope.showStore = function() {
			/*	안드로이드 이면서 앱이 아니면 보여준다.	*/
			if( isMobile.Android() && !window.PLATFORM ) {
				return true;
			} else {
				return false;
			}
		}

		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({viewType:'hakwon'});

		hakwonService.getHakwonIntro($routeParams.hakwon_no, function(colData) {

			$('body').append('<div style="display:none;" id="newTempDiv"></div>');
			$('#newTempDiv').html(colData.introduction);
			$('#newTempDiv').find('a').addClass('a_link');
			colData.introduction = $('#newTempDiv').html();
			$('#newTempDiv').remove();

			$scope.intro = colData;

			/*	video html replace	*/
			$scope.$$postDigest(comm.videoTagReplace);

			setTimeout(function() {
				if( $('body').innerWidth() < 400 ) {
					var $mapFrame = $('iframe[data-type=frameMap]');
					$mapFrame.attr('width', 300).attr('height', 200);
					var mapSrc = $mapFrame.attr('src');
					$mapFrame.attr('src', mapSrc);
				}
			}, 500);
		});

		$scope.$$postDigest(function() {
			comm.screenInit();

			/*	sns 공유 초기화	*/
			comm.snsShareInit();
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/*	학원 상세정보  */
hakwonApp.controller('hakwonDetailController', function($scope, $location, $routeParams, hakwonService, CommUtil){
	console.log('hakwonDetailController call');

	try {
		/*  학원 번호 체크  */
		var checkFlag = comm.hakwonNoCheckFilter($routeParams.hakwon_no, $location);
		if( checkFlag === false ) {
			return ;
		}

		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({viewType:'hakwon'});

		$scope.CommUtil = CommUtil;

		/*	스토어 버튼 뷰 여부	*/
		$scope.showStore = function() {
			/*	안드로이드 이면서 앱이 아니면 보여준다.	*/
			if( isMobile.Android() && !window.PLATFORM ) {
				return true;
			} else {
				return false;
			}
		};

		$scope.siteUrls = MENUS.sharpUrls;
		$scope.isMember = false;
		$scope.createFileFullPath = CommUtil.createFileFullPath;

		/*	등록일 기준 신규 컨텐츠 체크	*/
		$scope.isNewItem = comm.isNewItem;

		/*	학원 상세정보 조회	*/
		$scope.getHakwonDetail = function() {
			hakwonService.getHakwonDetail($routeParams.hakwon_no, function(colData) {
				if( colData.resultHakwonDetail.admin_reg_yn == 'Y' ) {
					alert('인증되지 않은 학원 입니다.');
					window.history.back();
					return ;
				}
				$scope.detail = colData.resultHakwonDetail;
				$scope.noticeList = _.map(colData.resultNoticeList, function(item) {
					item.isNew = CommUtil.isNewItem(item.reg_date);
					return item;
				});

				$scope.eventList = _.map(colData.resultEventList, function(item) {
					item.isNew = CommUtil.isNewItem(item.reg_date);
					return item;
				});
				$scope.isMember = !!colData.resultNoticeList;
			});
		};

		$scope.moveToIntro = function(hakwonNo) {
			window.location.href = MENUS.sharpUrls.hakwonIntro + '?hakwon_no=' + hakwonNo;
		};

		/*	이벤트 더보기 : 학원 이벤트 리스트 이동	*/
		$scope.goHakwonEventList = function() {
			CommUtil.locationHref(MENUS.sharpUrls.eventList, {page: 1}, 'hakwon');
			return false;
		};

		$scope.joinHakwon = function(hakwonNo, hakwonName) {

			if( comm.isLogin() === false ) {
				window.location.href = '#/login';
			} else {
				if( userAuth.userType == HakwonConstant.UserType.STUDENT || userAuth.userType == HakwonConstant.UserType.PARENT ) {
					if(!confirm('"'+hakwonName+'"학원에 가입하시겠습니까?')) {
						return;
					}

					hakwonService.joinHakwon(hakwonNo, function(colData) {
						if (colData.insertHakwonMember > 0) {
							$scope.getHakwonDetail();
							comm.userHakwonList();
						} else {
							alert('가입 처리 중 문제가 발생했습니다.\n다시 시도해 주세요.');
						}
					});
				} else {
					alert('학생 및 학부모님만 이용할수 있는 메뉴 입니다.');
				}
			}
		};

		/*	학원 상세정보 조회	*/
		$scope.getHakwonDetail();

		$scope.$on('$viewContentLoaded', function() {
			/*	광고 초기화	*/
			comm.advertBlock();
		});
		$scope.$$postDigest(function() {

			comm.screenInit();

			/*	sns 공유 초기화	*/
			comm.snsShareInit();
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/*	학원 검색  */
hakwonApp.controller('hakwonSearchController', function($scope, $location, $routeParams, hakwonService, CommUtil){
	console.log('hakwonSearchController call');

	try {
		/*  인증 정보 체크  */
		if( comm.authCheckFilter() === false ) {
			return ;
		}

		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({viewType:'user', headerTitle:'학원 검색'});

		/* 초기화 수행 */
		$scope.detailUrl = MENUS.sharpUrls.hakwonDetail;
		$scope.page = 1;
		$scope.isSearch = false;
		$scope.createFileFullPath = CommUtil.createFileFullPath;

		$scope.sido	= '';
		$scope.gugun = '';

		/*	초기값 정보 조회	*/
		$scope.setInit = function() {
			/*	시도정보 조회	*/
			hakwonService.getSidos(function(colData) {
				$scope.sidos = colData.dataList;

				$scope.$$postDigest(function() {
					var address = comm.getAddress();
					if( address ) {
						for(var i=0; i<colData.dataList.length; i++) {
							var sido = colData.dataList[i];
							if( address.indexOf(sido) >= 0 ) {
								$scope.sido = sido;
								$scope.selectSido(true);
								break;
							}
						}
					}
				});
			});

			/*	학원 카테고리 조회	*/
			hakwonService.getHakwonCates(function(colData) {
				$scope.cates = _.sortBy(colData.resultCate, function(cate){
					return cate.cate_order;
				});
			});
		};

		$scope.selectSido = function(isAddressCall) {
			if ($scope.sido === '') {
				$scope.guguns = [];
				return;
			}
			hakwonService.getGugun($scope.sido, function(colData) {
				$scope.guguns = colData.dataList;
				$scope.gugun = '구/군 선택';	// 시도 변경시, 구/군 선택으로 기본값 초기화

				if( isAddressCall === true ) {
					$scope.$$postDigest(function() {
						var address = comm.getAddress();
						if( address ) {
							for(var i=0; i<colData.dataList.length; i++) {
								var gugun = colData.dataList[i];
								if( address.indexOf(gugun) >= 0 ) {
									$scope.gugun = gugun;		//	이걸로는 안바껴서 아래처럼 타임아웃으로다가...
									setTimeout(function() {
										$('select[name=gugun] > option[label='+gugun+']').prop('selected', true);
									}, 500);
									break;
								}
							}
						}
					});
				}
			});
		};

		var search = function(params) {
			if( params.sido && params.sido.indexOf('시/도') >= 0 ) {
				params.sido = '';
			}
			if( params.gugun && params.gugun.indexOf('구/군') >= 0 ) {
				params.gugun = '';
			}
			if( isNull(params.sido) ) {
				alert('시/도를 선택해 주세요.');
				return ;
			}
			if( isNull(params.gugun) ) {
				alert('구/군을 선택해 주세요.');
				return ;
			}
			$scope.prevSidos = $scope.sidos;
			$scope.prevGuguns = $scope.guguns;
			$scope.prevParams = params;
			hakwonService.searchHakwon(params, function(colData) {
				$scope.isSearch = true;
				$scope.foundHakwons = colData.resultData;
				$scope.pageInfo = CommUtil.getPagenationInfo(colData.totalCount, colData.pageScale, 10, $scope.page);
			});
		};

		$scope.searchHakwon = function(e) {
			if (e && e.type === 'keydown' && e.keyCode !== 13) {
				return;
			}

			var searchText = ($scope.hakwon_name||'').trim();
/*
			if (isNull(searchText)) {
				alert('검색어를 입력해 주세요.');
				return;
			}
*/
			$scope.page = 1;
			var params = {
				sido:$scope.sido
				, gugun:$scope.gugun
				, hakwon_cate:  $scope.hakwon_cate
				, search_text: searchText
				, page_no: $scope.page
			};
			search(params);
		};

		$scope.movePage = function(page) {
			if ($scope.page === page) {
				return;
			}

			$scope.page = page;
			$scope.sidos = $scope.prevSidos;
			$scope.guguns = $scope.prevGuguns;
			$scope.sido = $scope.prevParams.sido;
			$scope.gugun = $scope.prevParams.gugun;
			$scope.hakwon_cate = $scope.prevParams.hakwon_cate;
			$scope.hakwon_name = $scope.prevParams.search_text;

			var params = {
				sido:$scope.sido,
				gugun:$scope.gugun,
				hakwon_cate:  $scope.hakwon_cate,
				search_text: $scope.hakwon_name,
				page_no: $scope.page
			};
			search(params);
		};

		$scope.setInit();
		$scope.$$postDigest(function() {
			comm.screenInit();

			/*	버전 체크후 gps 체크	*/
			if( window.PLATFORM && comm.getAppVersion() >= 601 ) {
				if( window.PLATFORM.gpsCheck() == "false" ) {
					if( window.confirm('gps가 off되어 있습니다. 활성화 시키시겠습니까?') ) {
						window.PLATFORM.gpsSettingMove();
					}
				}
			}
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/*	학원 반정보  */
hakwonApp.controller('hakwonClassController', function($scope, $location, $routeParams, hakwonService, CommUtil, noticeService){
	try {
		/*  인증 정보 체크  */
		if( comm.authCheckFilter() === false ) {
			return ;
		}

		$scope.isNoticeList = false;

		/*  학원 번호 체크  */
		var checkFlag = comm.hakwonNoCheckFilter($routeParams.hakwon_no, $location);
		if( checkFlag === false ) {
			return ;
		}

		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({viewType:'hakwon'});

		$scope.page 		= 1;
		if (!isNull($routeParams.page)) {
			$scope.page = $routeParams.page;
		}

		$scope.siteUrls = MENUS.sharpUrls;
		$scope.createFileFullPath = CommUtil.createFileFullPath;

		/*	등록일 기준 신규 컨텐츠 체크	*/
		$scope.isNewItem = comm.isNewItem;

		/* 반 기본정보 조회 */
		$scope.getClassInfo = function() {
			var params = {hakwon_no:$routeParams.hakwon_no, class_no: $routeParams.class_no};
			hakwonService.getClassInfo(params, function(colData) {
				$scope.teacherList	= colData.classTeacherList;
				//$scope.noticeList	= colData.selectNotice;
				$scope.detail		= colData.selectClassDetail;

				/*	공지사항 리스트 호출	*/
				$scope.getNoticeList($scope.page);
			});
		};

		/*	공지사항 리스트 호출	*/
		$scope.getNoticeList = function(pageNo) {
			var params = {
				type_name : 'class'
				, page_no : !isNull(pageNo) ? pageNo : '1'
				, class_no: $routeParams.class_no
			};
			noticeService.getCreateNoticeList(params, $scope);
		};

		$scope.getClassInfo();

		$scope.getFileFullPath = function(filePath, type, isThumb) {
			return CommUtil.createFileFullPath(filePath, type, isThumb);
		};

		$scope.sendMessage = function(userNo) {
			CommUtil.locationHref(MENUS.sharpUrls.messageWrite, {
				hakwon_no:$routeParams.hakwon_no,
				class_no: $routeParams.class_no,
				user_no: userNo
			});
		};

		$scope.movePage = function(page) {
			if ($scope.page === page) {
				return;
			}
			$scope.page = page;
			$location.search('page', page);
		};

		$scope.$$postDigest(comm.screenInit);

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});