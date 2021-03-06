/**
 * 공지 공유
 */
hakwonMainApp.service('noticeShareService', function(CommUtil) {
	console.log('hakwonMainApp noticeShareService call');

	var noticeShareService = {};

	/**
	 * 학원 반 리스트
	 */
	noticeShareService.classListAll = function(param, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/classListAll.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}

	/**
	 * 학원 검색
	 */
	noticeShareService.hakwonSearch = function(param, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/search.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}

	/**
	 * 공유한 리스트
	 */
	noticeShareService.sendList = function(param, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/noticeShare/sendList.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}

	/**
	 * 공유 받은 리스트
	 */
	noticeShareService.receiveList = function(param, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/noticeShare/receiveList.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}

	/**
	 * 공유 하기
	 */
	noticeShareService.send = function(param, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/noticeShare/send.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}

	/**
	 * 공유 수정하기
	 */
	noticeShareService.updateShare = function(param, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/noticeShare/update.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}

	/**
	 * 공유 삭제
	 */
	noticeShareService.deleteShare = function(param, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/noticeShare/delete.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}

	/**
	 * 공지 적용
	 */
	noticeShareService.noticeApply = function(param, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/noticeShare/apply.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}

	return noticeShareService;
});


/**
 * 공지 공유
 */
hakwonMainApp.controller('noticeShareSendController', function($scope, $location, $window, $routeParams, noticeShareService, CommUtil) {
	console.log('hakwonMainApp noticeShareSendController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$scope.CommUtil = CommUtil;

		$("#wrapper").show();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'공유'}]);

		/*	is Mobile	*/
		$scope.isMobile = isMobile.any();

		/*	학원 번호	*/
		$scope.hakwon_no = $routeParams.hakwon_no;

		/*	학원 검색어	*/
		$scope.search_text = '';

		/*	대상 반	*/
		$scope.share_class = '';

		/*	반 리스트 조회	*/
		noticeShareService.classListAll({hakwon_no:$scope.hakwon_no}, function(data) {
			$scope.class_list = [];
			$scope.class_list.push({class_no:-1, class_title:'학원공지'});
			if( data.colData && data.colData.dataList && data.colData.dataList.length > 0 ) {
				$scope.class_list = $scope.class_list.concat(data.colData.dataList);
			}
		});

		/*	학원 검색	*/
		$scope.hakwonSearch = function() {
			if( isNull($scope.search_text) ) {
				alert('검색어를 입력해 주세요.');
				return ;
			}
			noticeShareService.hakwonSearch({search_text:$scope.search_text, hakwon_no:$scope.hakwon_no}, function(data) {
				$scope.hakwon_list = [];
				if( data.colData && data.colData.dataList && data.colData.dataList.length > 0 ) {
					$scope.hakwon_list = data.colData.dataList;
				}
			});
		}

		/**
		 * 학원 선택
		 */
		$scope.target_hakwon_list = [];
		$scope.targetHakwon = function(hakwon) {
			if( !_.findWhere($scope.target_hakwon_list, hakwon) ) {
				$scope.target_hakwon_list.push(hakwon);
			}
		}

		/**
		 * 대상 학원삭제
		 */
		$scope.targetRemove = function(hakwon) {
			$scope.target_hakwon_list = _.without($scope.target_hakwon_list, hakwon);
		}

		/**
		 * 공유하기
		 */
		$scope.shareSend = function() {
			if( isNull($scope.share_class) ) {
				alert('공유할 반을 선택해 주세요.');
				return ;
			}

			if( $scope.target_hakwon_list.length == 0 ) {
				alert('공유할 학원을 선택해 주세요.');
				return ;
			}
			var target_hakwon = [];
			for(var i=0; i<$scope.target_hakwon_list.length; i++) {
				var hakwon = $scope.target_hakwon_list[i];
				target_hakwon.push(hakwon.hakwon_no);
			}

			var start_date	= $('input[name=start_date]').val();
			var end_date	= $('input[name=end_date]').val();
			if( isNull(start_date) || isNull(end_date) ) {
				alert('공유 기간을 선택해 주세요.');
				return ;
			}

			var param = {
				share_class : $scope.share_class
				, share_hakwon	: $scope.hakwon_no
				, target_hakwon : target_hakwon
				, start_date : start_date
				, end_date : end_date
			};

			/*	공유	*/
			noticeShareService.send(param, function(data) {
				if( data.colData && data.colData.flag == 'success' ) {
					//window.location = '#/notice/share/sendList?hakwonNo='+$scope.hakwon_no;
					alert('선택한 게시판을 공유 했습니다.');
				} else {
					alert('게시판 공유를 실패 했습니다.');
				}
			});
		}

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 공지 공유 리스트
 */
hakwonMainApp.controller('noticeShareSendListController', function($scope, $location, $window, $routeParams, noticeShareService, CommUtil) {
	console.log('hakwonMainApp noticeShareSendListController call');

	/*	페이지 초기화 호출	*/
	hakwonCommon.pageInit();

	$("#wrapper").show();

	/*	헤더 셋팅	*/
	comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'공유'}]);

	/*	is Mobile	*/
	$scope.isMobile = isMobile.any();

	/**
	 * 페이지 번호
	 */
	$scope.page_no = 1;

	/*	학원 번호	*/
	$scope.hakwon_no = $routeParams.hakwon_no;

	$scope.searchText = '';

	/**
	 * 보낸 리스트
	 */
	var sendList = function(page_no) {
		var param = {page_no:page_no, hakwon_no : $scope.hakwon_no};

		var search_text = ($scope.searchText||'').trim();
		if( search_text ) {
			param.search_text = search_text;
		}

		/*	조회	*/
		noticeShareService.sendList(param, function(data) {
			var colData = data.colData;
			$scope.share_list = colData.shareList;
			$scope.page_info = CommUtil.getPagenationInfo(colData.totCount, colData.page_scale, DefaultInfo.pageScale, page_no);
		});
	}

	/**
	 * 검색
	 */
	$scope.searchList = function(e) {
		if (e && e.type === 'keydown' && e.keyCode !== 13) {
			return;
		}
		sendList(1);
	}

	/*	페이지네이션 페이지 이동	*/
	$scope.movePage = function(page_no) {
		if ($scope.page_no === page_no) {
			return;
		}
		$scope.page_no = page_no;
		sendList(page_no);
	};

	/*	수정	*/
	$scope.updateShare = function(shareInfo) {
		shareInfo.start_date_modify = new Date(shareInfo.start_date);
		shareInfo.end_date_modify = new Date(shareInfo.end_date);

		shareInfo.modify = true;
	};

	/*	수정	*/
	$scope.updateShareData = function(shareInfo) {
		var start_date = moment(shareInfo.start_date_modify).format('YYYY-MM-DD');
		var end_date = moment(shareInfo.end_date_modify).format('YYYY-MM-DD');

		noticeShareService.updateShare({share_no:shareInfo.share_no, start_date:start_date, end_date:end_date}, function() {
			shareInfo.start_date = start_date;
			shareInfo.end_date = end_date;
			shareInfo.modify = false;
		});
	};

	/*	삭제	*/
	$scope.deleteShare = function(shareInfo) {
		if( window.confirm('공유를 정말 삭제 하시겠습니까?') ) {
			noticeShareService.deleteShare({share_no:shareInfo.share_no, del_type:'send'}, function() {
				$scope.share_list = _.without($scope.share_list, shareInfo);
			});
		}
	};

	sendList($scope.page_no);
});

/**
 * 받은 공지 리스트
 */
hakwonMainApp.controller('noticeShareReceiveListController', function($scope, $location, $window, $routeParams, noticeShareService, CommUtil) {
	console.log('hakwonMainApp noticeShareReceiveListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'공유'}]);

		/*	is Mobile	*/
		$scope.isMobile = isMobile.any();

		/*	페이지 번호	*/
		$scope.page_no = 1;

		/*	학원 번호	*/
		$scope.hakwon_no = $routeParams.hakwon_no;

		/**
		 * 보낸 리스트
		 */
		var receiveList = function(page_no) {
			var param = {page_no:page_no, hakwon_no : $scope.hakwon_no};

			/*	조회	*/
			noticeShareService.receiveList(param, function(data) {
				var colData = data.colData;
				$scope.share_list = colData.shareList;
				$scope.page_info = CommUtil.getPagenationInfo(colData.totCount, colData.page_scale, DefaultInfo.pageScale, page_no);
			});
		}

		/*	페이지네이션 페이지 이동	*/
		$scope.movePage = function(page_no) {
			if ($scope.page_no === page_no) {
				return;
			}
			$scope.page_no = page_no;
			receiveList(page_no);
		};

		/*	삭제	*/
		$scope.deleteShare = function(shareInfo) {
			if( window.confirm('정말 삭제 하시겠습니까?') ) {
				noticeShareService.deleteShare({share_no:shareInfo.share_no, del_type:'receive', receive_hakwon_no:shareInfo.hakwon_no}, function() {
					$scope.share_list = _.without($scope.share_list, shareInfo);
				});
			}
		};

		/*	반 리스트 조회	*/
		noticeShareService.classListAll({hakwon_no:$scope.hakwon_no}, function(data) {
			$scope.class_list = [];
			if( data.colData && data.colData.dataList && data.colData.dataList.length > 0 ) {
				$scope.class_list = data.colData.dataList;
			}
		});

		/**
		 * 공지 적용
		 */
		$scope.applyNotice = function(shareInfo) {
			console.log('shareInfo', shareInfo);

			var startDate 	= parseInt(moment(shareInfo.start_date).format('YYYYMMDD'));
			var endDate 	= parseInt(moment(shareInfo.end_date).format('YYYYMMDD'));
			var nowDate 	= parseInt(moment().format("YYYYMMDD"));
			if( startDate <= nowDate && nowDate <= endDate ) {
				console.log('기간');
			} else {
				alert('공유 기간이 종료 되었습니다.');
				return ;
			}

			if( shareInfo.notice_type == '002' ) {
				if( window.confirm('공유 받은 공지는 학원 전체 공지 입니다.\n공유 받은 공지를 학원 전체 공지에 추가하시겠습니까?') ) {
					noticeShareService.noticeApply({share_no:shareInfo.share_no, hakwon_no:shareInfo.receive_hakwon_no, target_class:shareInfo.receive_hakwon_no}, function(data) {
						if( data.colData && data.colData.flag == 'success' ) {
							alert('받은 공지를 적용 했습니다.');
						} else {
							alert('요청을 실패 했습니다.');
						}
					});
				}
			} else {
				if( isNull($scope.select_class) ) {
					alert('반을 선택해 주세요.');
					return ;
				}
				if( window.confirm('공유 받은 공지는 반 공지 입니다.\n공유 받은 공지를 선택한 반 공지에 추가하시겠습니까?') ) {
					noticeShareService.noticeApply({share_no:shareInfo.share_no, hakwon_no:shareInfo.receive_hakwon_no, target_class:$scope.select_class}, function(data) {
						if( data.colData && data.colData.flag == 'success' ) {
							alert('받은 공지를 적용 했습니다.');
						} else {
							alert('요청을 실패 했습니다.');
						}
					});
				}
			}
		};

		receiveList($scope.page_no);
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});