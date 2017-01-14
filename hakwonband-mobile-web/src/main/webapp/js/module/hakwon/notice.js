/**
 * 공지사항 리스트 서비스
 */
angular.module('hakwonApp').service('noticeService', function($http, CommUtil) {

	/*  학원 or 반 공지사항 리스트 조회  */

	var NoticeService = {};

	NoticeService.getCreateNoticeList = function (params, $scope) {
		var apiUrl = '';

		if (params.type_name == 'class') {
			apiUrl = '/mobile/notice/classNoticeReqList.do';
		} else if (params.type_name == 'hakwon') {
			apiUrl = '/mobile/notice/hakwonNoticeReqList.do';
		} else {
			alert('notice.type Error' + JSON.stringify(params));
			commProto.logger({getNoticeListError:params});
			return;
		}

		CommUtil.ajax({url:contextPath+apiUrl, param:params, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData ) {
					$scope.listObj = colData;
					// 썸네일 파일 경로 문자열을 리스트로 변경 처리
					$scope.listObj.noticeReqList = CommUtil.initThumbPathArray($scope.listObj.noticeReqList);
					if ($scope.listObj.noticeReqListTotCount > 0) $scope.isNoticeList = true;
					$scope.pageInfo = CommUtil.getPagenationInfo(colData.noticeReqListTotCount, colData.pageScale, 10, $scope.page);
				} else {
					commProto.logger({noticeListError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	return NoticeService;

});

/* 공지사항 리스트 컨트롤러 */
angular.module('hakwonApp').controller('noticeListController', function($scope, $window, $location, $routeParams, CommUtil, noticeService){
	console.log('noticeListController call');

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
			console.log('noticeListController $viewContentLoaded');

			/*	광고 블럭 요청	*/
			comm.advertBlock();

			$scope.isNoticeList = false;
			$scope.listObj		= {};
			$scope.urlParams	= $routeParams;
			$scope.page 		= 1;

			/*	등록일 기준 신규 컨텐츠 체크	*/
			$scope.isNewItem	= comm.isNewItem;

			if (!isNull($routeParams.page)) {
				$scope.page = $routeParams.page;
			}

			if (!isNull($scope.urlParams.class_no)) {
				$scope.urlParams.type_name = 'class';
				$scope.urlParams.type_code = 'list';
				$scope.urlParams.han_name  = '반공지';
			} else if (!isNull($scope.urlParams.hakwon_no)) {
				$scope.urlParams.type_name = 'hakwon';
				$scope.urlParams.type_code = 'list';
				$scope.urlParams.han_name  = '학원공지';
			}

			/*	공지사항 리스트 호출	*/
			$scope.getNoticeList($scope.page);
		});

		/*	공지사항 리스트 호출	*/
		$scope.getNoticeList = function(pageNo) {
			var params = $scope.urlParams;
			params.page_no = !isNull(pageNo) ? pageNo : '1';
			noticeService.getCreateNoticeList(params, $scope);
		};

		/* 공지사항 상세조회 */
		$scope.goNoticeDetail = function(e) {
			var idx = parseInt($(e.currentTarget).data('idx'));
			var params = {};

			params.notice_no	= idx;
			params.type_code	= $scope.urlParams.type_code;
			params.type_name	= $scope.urlParams.type_name;
			params.page			= $scope.page;

			if (params.type_name == 'class') {
				params.class_no = $scope.urlParams.class_no;
			}
			CommUtil.locationHref(MENUS.sharpUrls.noticeDetail, params, 'hakwon');
			return false;
		};

		/*	페이지네이션 페이지 이동	*/
		$scope.movePage = function(page) {
			if ($scope.page === page) {
				return;
			}
			$scope.page = page;
			$scope.getNoticeList($scope.page);
		};

		$scope.$$postDigest(comm.screenInit);

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/*	공지사항 상세보기  */
angular.module('hakwonApp').controller('noticeDetailController', function($scope, $window, $location, $routeParams, CommUtil, noticeService){
	console.log('noticeDetailController call');

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
			console.log('noticeDetailController $viewContentLoaded');

			/*	광고 블럭 요청	*/
			comm.advertBlock();

			if (isNull($routeParams.notice_no)) {
				$window.history.back();
				return false;
			}

			if (!isNull($routeParams.page)) {
				$scope.page = $routeParams.page;
			}

			/*	데이터 초기화	*/
			$scope.urlParams			= $routeParams;
			$scope.authUserNo			= '';

			$scope.noticeDetail			= {};
			$scope.replyList			= [];
			$scope.fileList 			= [];

			$scope.imageFileArray		= [];
			$scope.normalFileArray		= [];

			$scope.replyInfo = {
				reg_user_no			: '',
				content_type		: '001',
				content_parent_no 	: '',
				reply_content		: '',
				title				: ''
			};

			$scope.replyInfo.content_parent_no	= $routeParams.notice_no;
			$scope.replyInfo.reg_user_no		= userAuth.userNo;
			$scope.authUserNo					= userAuth.userNo;

			/*	공지사항 상세 호출	*/
			$scope.getDetail();
		});

		/*	공지사항 상세조회 호출 	*/
		$scope.getDetail = function() {

			console.log($routeParams);

			CommUtil.ajax({url:contextPath + '/mobile/notice/noticeDetail.do', param:$routeParams, successFun:function(data) {
				try {
					var colData = data.colData;
					if( colData ) {
						$('body').append('<div style="display:none;" id="newTempDiv"></div>');
						$('#newTempDiv').html(colData.noticeDetail.content);
						$('#newTempDiv').find('a').addClass('a_link');
						colData.noticeDetail.content = $('#newTempDiv').html();
						$('#newTempDiv').remove();

						$scope.noticeDetail			= colData.noticeDetail;
						$scope.replyList			= colData.replyList;
						$scope.fileList				= colData.fileList;

						CommUtil.initFileTypeArray($scope);

						/*	video html replace	*/
						$scope.$$postDigest(comm.videoTagReplace);
					} else {
						commProto.logger({noticeDetailError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/**
		 * 신규 댓글 조회, replyNo : 해당 댓글번호 이후것을 조회
		 * @param replyNo
		 */
		$scope.getNewReplyList = function(replyNo) {
			if (isNull($routeParams.notice_no)) {
				alert('공지사항 정보가 올바르지 않습니다.');
				return ;
			}
			var params = {};
			params.content_type = '001';
			params.content_parent_no = $routeParams.notice_no;
			params.reply_no = replyNo;
			CommUtil.ajax({url:contextPath+'/mobile/reply/newReplyList.do', param:params, successFun:function(data) {
				try {
					if( data.colData.result = 'success' ) {
						$scope.replyList = _.uniq($scope.replyList.concat(data.colData.replyList));
						$scope.$$postDigest(function() {
							$('body').scrollTop($('ul.ul_type_01 > li:last').position().top);
						});
					} else {
						alert('댓글 등록에 실패하였습니다. 잠시 후 다시 시도해주시기 바랍니다.');
						commProto.logger({removeReplyError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/*	댓글 등록 호출	*/
		$scope.insertReply = function() {
			if (_.isEmpty($scope.replyInfo.reply_content)) {
				alert('댓글을 입력해 주세요.');
				return ;
			}
			CommUtil.ajax({url:contextPath+'/mobile/reply/registReply.do', param:$scope.replyInfo, successFun:function(data) {
				try {
					if( data.colData.result = 'success' ) {
						$scope.replyInfo.reply_content = '';
						var lastReply = {reply_no:''};
						if ($scope.replyList.length > 0) {
							lastReply = _.last($scope.replyList);
						}
						$scope.getNewReplyList(lastReply.reply_no);
					} else {
						alert('댓글 등록에 실패하였습니다. 잠시 후 다시 시도해주시기 바랍니다.');
						commProto.logger({removeReplyError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/*	댓글 삭제 호출	*/
		$scope.deleteReply = function(replyNo) {
			var params = {reply_no: replyNo};
			CommUtil.ajax({url:contextPath+'/mobile/reply/removeReply.do', param:params, successFun:function(data) {
				try {
					if( data.colData.result = 'success' ) {
						$scope.getDetail();
					} else {
						alert('댓글 삭제에 실패하였습니다. 잠시 후 다시 시도해주시기 바랍니다.');
						commProto.logger({removeReplyError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		$scope.getFileFullPath = function(filePath, type, isThumb) {
			return CommUtil.createFileFullPath(filePath, type, isThumb);
		};

		/* historyBack */
		$scope.historyBack = function() {
			if( !$routeParams.type_code || $routeParams.type_code == 'list' ) {
				var params = {page: $scope.page};

				var class_no = $routeParams.class_no;
				if( class_no ) {
					params.class_no = class_no;
					CommUtil.locationHref(MENUS.sharpUrls.hakwonClass, params ,'hakwon');
				} else {
					CommUtil.locationHref(MENUS.sharpUrls.noticeList, params ,'hakwon');
				}
			} else {
				$window.history.back();
			}
		};

		$scope.$$postDigest(comm.screenInit);

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});