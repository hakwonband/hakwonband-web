/**
 * 관리자에게 문의 서비스
 */
hakwonMainApp.service('adminQuestionService', function($http, CommUtil) {
	console.log('hakwonMainApp adminQuestionService call', CommUtil);

	var adminQuestionService = {};

	/**
	 * 관리자 문의 검색
	 */
	adminQuestionService.adminQuestionList = function(pageNo) {
		if( !pageNo ) {
			pageNo = 1;
		}
		var param = {pageNo:pageNo};

		$.ajax({
			url: contextPath+"/adminQuestion/list.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('관리자 문의 조회를 실패 했습니다.');
						return false;
					}

					var $mainEle = $('#mainNgView');

					var colData = data.colData;
					var $tableBody = $mainEle.find('div[data-view=data-div] table > tbody');
					if( colData.noticeList.length > 0 ) {
						$tableBody.html($.tmpl(hakwonTmpl.adminQuestion.listRow, colData));
					} else {
						$tableBody.html($.tmpl(hakwonTmpl.adminQuestion.listNoData));
					}

					console.log('colData', colData);
					var totalPages = comm.pageCalc(colData.noticeCount, colData.page_scale);
					$('#mainNgView div[data-view=pagination]').bootpag({
						total: totalPages,
						page: pageNo,
						maxVisible: DefaultInfo.pageScale,
						leaps: true
					}).unbind("page").bind("page", function(event, page){
						window.location = PageUrl.adminQuestion.list+'?pageNo='+page;
					});
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/**
	 * 문의 하기 상세
	 */
	adminQuestionService.adminQuestionView = function(noticeNo) {
		var params = {notice_no:noticeNo};
		$.ajax({
			url: contextPath+"/adminQuestion/view.do",
			type: "post",
			data: $.param(params, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('관리자 문의 조회를 실패 했습니다.');
						return false;
					}

					var colData = data.colData;
					$('#mainNgView div[data-view=data-view]').html($.tmpl(hakwonTmpl.adminQuestion.viewData, colData));
					$('#mainNgView div.comment_list').html($.tmpl(hakwonTmpl.adminQuestion.replyRow, colData));
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/**
	 * 리플 등록
	 */
	adminQuestionService.replyWrite = function(noticeNo) {
		var replyContent = $('textarea[name=replyContent]').val();

		if( isNull(replyContent) ) {
			alert('리플을 입력해 주세요.');
			return false;
		}

		var params = {
			notice_no:noticeNo
			, reply_content:replyContent
			, content_type : '001'
			, content_parent_no : noticeNo
		};
		$.ajax({
			url: contextPath+"/admin/reply/registReply.do",
			type: "post",
			data: $.param(params, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('리플 등록을 실패 했습니다.');
						return false;
					}

					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						$('textarea[name=replyContent]').val('');
						adminQuestionService.replyList(noticeNo);
					} else {
						alert('리플 등록을 실패 했습니다.');
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/**
	 * 신규 리플 조회
	 */
	adminQuestionService.replyList = function(noticeNo) {
		var reply_no =$('div.comment_list > div.feed-element:last').attr('data-reply-no');
		var params = {
			notice_no:noticeNo
			, content_type : '001'
			, content_parent_no : noticeNo
			, reply_no : reply_no
		};
		$.ajax({
			url: contextPath+"/admin/reply/newReplyList.do",
			type: "post",
			data: $.param(params, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('리플 조회를 실패 했습니다.');
						return false;
					}

					var colData = data.colData;
					$('#mainNgView div[data-view=comment_div]').append($.tmpl(hakwonTmpl.adminQuestion.replyRow, colData));
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	return adminQuestionService;
});

/**
 * 관리자 문의 리스트
 */
hakwonMainApp.controller('adminQuestionListController', function($scope, $location, $routeParams, adminQuestionService, CommUtil) {
	console.log('hakwonMainApp adminQuestionListController call', $scope, $location, $routeParams, adminQuestionService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'관리자 문의'}]);

		$("#wrapper").show();

		$scope.$$postDigest(function(){
			console.log('$$postDigest');

			var pageNo = $routeParams.pageNo;
			if( !pageNo ) pageNo = 1;

			adminQuestionService.adminQuestionList(pageNo);
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 관리자에게 문의하기 보기
 */
hakwonMainApp.controller('adminQuestionViewController', function($scope, $location, $routeParams, adminQuestionService, CommUtil) {
	console.log('hakwonMainApp adminQuestionViewController call', $scope, $location, $routeParams, adminQuestionService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'관리자 문의'}]);

		$("#wrapper").show();

		var notice_no = $routeParams.notice_no;
		if( !notice_no ) {
			alert('올바르지 않은 접근 입니다.');
			window.history.back();
		}

		/*	리플 등록	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=replyWrite]', function() {
			adminQuestionService.replyWrite(notice_no);
		});

		/*	문의 삭제	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=noticeDel]', function() {
			if( window.confirm('삭제 하시겠습니까?') ) {
				adminQuestionService.adminQuestionDelete(notice_no);
			}
		});

		/*	문의 수정	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=noticeEdit]', function() {
			alert('준비 중 입니다.');
		});
		/*	문의 목록	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=list]', function() {
			commProto.hrefMove('#/adminQuestion/list');
		});


		$scope.$$postDigest(function(){
			console.log('$$postDigest');

			adminQuestionService.adminQuestionView(notice_no);
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});