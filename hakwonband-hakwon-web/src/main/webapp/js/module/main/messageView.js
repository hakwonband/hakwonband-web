/**
 * 메세지 서비스
 */
hakwonMainApp.service('messageViewService', function($http, CommUtil) {
	console.log('hakwonMainApp messageViewService call');

	var messageViewService = {};

	/*	받은 메세지 리스트	*/
	messageViewService.receiveMessageList = function(pageNo, hakwon_no, searchType) {
		var searchText = $('#mainNgView input[name=searchText]').val();
		if( !pageNo ) pageNo = 1;

		var param = {
			pageNo : pageNo
			, searchText : searchText
			, searchType : searchType
		};
		if( hakwon_no ) {
			param.hakwon_no = hakwon_no;
		}

		$.ajax({
			url: contextPath+"/hakwon/message/receiveList.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('받은 메세지 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;
					colData.pageNo = pageNo;


					if( colData.newReceiveMessageCount == 0 ) {
						/*	리스트	*/
						$('div[data-view=receiveMessageListTitle]').hide();
					} else {
						$('div[data-view=receiveMessageListTitle]').html('<h2><span class="text-warning">'+colData.newReceiveMessageCount+'개의 새로운 메세지</span>가 있습니다</h2>').show();
					}

					if( colData.dataCount == 0 ) {
						/*	리스트	*/
						$('div[data-view=data-view]').html('<div class="feed-element message_box box_nodata">받은 메세지가 없습니다.</div>');
						$('#mainNgView div[data-view=pagination]').hide();
					} else {
						for(var i=0; i<colData.dataList.length; i++) {
							var tempUserInfo = colData.dataList[i];
							tempUserInfo.send_user_info = comm.userInfoParse(tempUserInfo.send_user_info);
							colData.dataList[i] = tempUserInfo;
						}

						/*	리스트	*/
						$('div[data-view=data-view]').html($.tmpl(hakwonTmpl.messageView.receiveMessageListRow, colData));

						/*	페이징	*/
						var totalPages = comm.pageCalc(colData.dataCount, colData.pageScale);
						$('#mainNgView div[data-view=pagination]').bootpag({
							total: totalPages,
							page: pageNo,
							maxVisible: DefaultInfo.pageScale,
							leaps: true
						}).unbind("page").bind("page", function(event, page){
							param.pageNo = page;
							window.location.href = PageUrl.message.receiveMessageList+'?'+$.param(param);
						});
						$('#mainNgView div[data-view=pagination]').show();
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

	/*	보낸 그룹 메세지 리스트	*/
	messageViewService.sendMessageGroupList = function(pageNo, hakwon_no) {
		var searchText = $('#mainNgView input[name=searchText]').val();
		if( !pageNo ) pageNo = 1;

		var param = {
			pageNo : pageNo
			, searchText : searchText
			, groupYn : 'Y'
			, hakwon_no : hakwon_no
		};

		$.ajax({
			url: contextPath+"/hakwon/message/sendList.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('보낸 메세지 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;
					if( colData.dataCount == 0 ) {
						/*	리스트	*/
						$('div[data-view=data-view]').html('<div class="feed-element message_box box_nodata">보낸 메세지가 없습니다.</div>');
						$('#mainNgView div[data-view=pagination]').hide();
					} else {
						/*	리스트	*/
						$('div[data-view=data-view]').html($.tmpl(hakwonTmpl.messageView.sendMessageGroupListRow, colData));

						/*	페이징	*/
						var totalPages = comm.pageCalc(colData.dataCount, colData.pageScale);
						$('#mainNgView div[data-view=pagination]').bootpag({
							total: totalPages,
							page: pageNo,
							maxVisible: DefaultInfo.pageScale,
							leaps: true
						}).unbind("page").bind("page", function(event, page){
							param.pageNo = page;
							window.location.href = PageUrl.message.sendMessageGroupList+'?'+$.param(param);
						});
						$('#mainNgView div[data-view=pagination]').show();
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

	/*	보낸 싱글 메세지 리스트	*/
	messageViewService.sendMessageSingleList = function(pageNo, hakwon_no) {
		var searchText = $('#mainNgView input[name=searchText]').val();
		if( !pageNo ) pageNo = 1;

		var param = {
			pageNo : pageNo
			, searchText : searchText
			, groupYn : 'N'
			, hakwon_no : hakwon_no
		};

		$.ajax({
			url: contextPath+"/hakwon/message/sendList.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('보낸 메세지 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;
					if( colData.dataCount == 0 ) {
						/*	리스트	*/
						$('div[data-view=data-view]').html('<div class="feed-element message_box box_nodata">보낸 메세지가 없습니다.</div>');
						$('#mainNgView div[data-view=pagination]').hide();
					} else {
						for(var i=0; i<colData.dataList.length; i++) {
							var tempUserInfo = colData.dataList[i];
							tempUserInfo.receive_user_info = comm.userInfoParse(tempUserInfo.receive_user_info);
							colData.dataList[i] = tempUserInfo;
						}
						/*	리스트	*/
						$('div[data-view=data-view]').html($.tmpl(hakwonTmpl.messageView.sendMessageSingleListRow, colData));

						/*	페이징	*/
						var totalPages = comm.pageCalc(colData.dataCount, colData.pageScale);
						$('#mainNgView div[data-view=pagination]').bootpag({
							total: totalPages,
							page: pageNo,
							maxVisible: DefaultInfo.pageScale,
							leaps: true
						}).unbind("page").bind("page", function(event, page){
							param.pageNo = page;
							window.location.href = PageUrl.message.sendMessageSingleList+'?'+$.param(param);
						});
						$('#mainNgView div[data-view=pagination]').show();
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

	/*	메세지 그룹 상세	*/
	messageViewService.sendMessageGroupDetail = function(messageNo, callback) {
		var param = {messageNo : messageNo};
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/message/groupMessageDetail.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	};

	/*	메세지 싱글 상세	*/
	messageViewService.sendMessageSingleDetail = function(receiveNo) {
		var param = {receiveNo : receiveNo};
		$.ajax({
			url: contextPath+"/hakwon/message/singleMessageDetail.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('메세지 상세 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;
					colData.messageDetail.receive_user_info = comm.userInfoParse(colData.messageDetail.receive_user_info);
					$('div[data-view=data-view]').html($.tmpl(hakwonTmpl.messageView.sendMessageSingleView, colData));

					/*	리플 리스트 조회	*/
					messageViewService.replyList(receiveNo);
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/*	받은 메세지 상세	*/
	messageViewService.receiveMessageDetail = function(receiveNo, messageNo) {
		var param = {receiveNo : receiveNo, messageNo:messageNo};
		$.ajax({
			url: contextPath+"/hakwon/message/receiveMessageDetail.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('메세지 상세 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;

					colData.messageDetail.send_user_info = comm.userInfoParse(colData.messageDetail.send_user_info);
					$('div[data-view=data-view]').html($.tmpl(hakwonTmpl.messageView.receiveMessageView, colData));

					/*	리플 리스트 조회	*/
					messageViewService.replyList(receiveNo);
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
	messageViewService.replyWrite = function(receiveNo) {
		$('button[data-act=replyWrite]').attr('disabled', true);

		var replyContent = $('textarea[name=replyContent]').val();
		if( isNull(replyContent) ) {
			alert('리플을 등록해 주세요.');
			$('button[data-act=replyWrite]').attr('disabled', false);
			return ;
		}

		var params = {
			reply_content:replyContent
			, content_type : '002'
			, content_parent_no : receiveNo
		};
		$.ajax({
			url: contextPath+"/hakwon/reply/registReply.do",
			type: "post",
			data: $.param(params, true),
			complete : function(){ $('button[data-act=replyWrite]').attr('disabled', false); },
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
						messageViewService.replyList(receiveNo);
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
	 * 리플 리스트 로드
	 */
	messageViewService.replyList = function(receiveNo) {
		var lastReplyNo = $('#mainNgView div[data-view=comment_list] > div[data-type=reply]:last').attr('data-reply-no');
		if( !lastReplyNo ) {
			lastReplyNo = '';
		}
		var params = {
			content_type : '002'
			, content_parent_no : receiveNo
			, reply_no : lastReplyNo
		};
		$.ajax({
			url: contextPath+"/hakwon/reply/newReplyList.do",
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
					$('#mainNgView div[data-view=comment_list]').append($.tmpl(hakwonTmpl.messageView.replyRow, colData));
					$('strong[data-view=comment_count]').html($('div[data-type=reply]').length);
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	}

	/**
	 * 리플 삭제
	 */
	messageViewService.replyDelete = function(reply_no) {
		var params = {
			reply_no:reply_no
		};
		$.ajax({
			url: contextPath+"/hakwon/reply/removeReply.do",
			type: "post",
			data: $.param(params, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('리플 삭제를 실패 했습니다.');
						return false;
					}

					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						var commentCount = $('strong[data-view=comment_count]').text();
						commentCount = commentCount - 1;
						$('strong[data-view=comment_count]').text(commentCount);

						$('div.comment_box[data-type=reply][data-reply-no='+reply_no+']').remove();
					} else {
						alert('리플 삭제를 실패 했습니다.');
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
	 * 예약 메세지 삭제
	 */
	messageViewService.reservationMsgDelete = function(message_no, moveLocation) {

		if( window.confirm('예약 메세지를 삭제하시겠습니까?') == false ) {
			return ;
		}

		var params = {message_no:message_no};
		$.ajax({
			url: contextPath+"/hakwon/message/reservationMsgDelete.do",
			type: "post",
			data: $.param(params, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('예약 메세지 삭제를 실패 했습니다.');
						return false;
					}

					var colData = data.colData;
					if( colData.flag == CommonConstant.Flag.success ) {
						commProto.hrefMove(moveLocation);
					} else {
						alert('예약 메세지 삭제를 실패 했습니다.');
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
	 * 메세지 삭제
	 */
	messageViewService.msgDelete = function(message_no, moveLocation) {
		var params = {message_no:message_no};
		$.ajax({
			url: contextPath+"/hakwon/message/msgDelete.do",
			type: "post",
			data: $.param(params, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('메세지 삭제를 실패 했습니다.');
						return false;
					}

					var colData = data.colData;
					if( colData.flag == CommonConstant.Flag.success ) {
						commProto.hrefMove(moveLocation);
					} else {
						alert('메세지 삭제를 실패 했습니다.');
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

	return messageViewService;
});


/**
 * 보낸 싱글 메세지
 */
hakwonMainApp.controller('messageSendSingleListController', function($scope, $location, $routeParams, messageViewService, CommUtil) {
	console.log('hakwonMainApp messageSendSingleListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'메세지'}, {url:'#/message/sendMessageSingleList?hakwon_no='+hakwonInfo.hakwon_no, title:'보낸 개별 메세지'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		$("#wrapper").show();

		$scope.$$postDigest(function() {

			var pageNo = $routeParams.pageNo;
			if( !pageNo ) pageNo = 1;

			var hakwon_no = $routeParams.hakwon_no;

			var searchText = $routeParams.searchText;
			if( !searchText ) searchText = '';
			$('#mainNgView input[name=searchText]').val(searchText);

			messageViewService.sendMessageSingleList(pageNo, hakwon_no);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 보낸 그룹 메세지 리스트
 */
hakwonMainApp.controller('messageSendGroupListController', function($scope, $location, $routeParams, messageViewService, CommUtil) {
	console.log('hakwonMainApp messageSendGroupListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'메세지'}, {url:'#', title:'보낸 그룹 메세지'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		$("#wrapper").show();

		$scope.$$postDigest(function() {

			var pageNo = $routeParams.pageNo;
			if( !pageNo ) pageNo = 1;

			var hakwon_no = $routeParams.hakwon_no;

			var searchText = $routeParams.searchText;
			if( !searchText ) searchText = '';
			$('#mainNgView input[name=searchText]').val(searchText);

			messageViewService.sendMessageGroupList(pageNo, hakwon_no);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 보낸 그룹 메세지 상세
 */
hakwonMainApp.controller('messageGroupSendDetailController', function($scope, $location, $routeParams, messageViewService, CommUtil) {
	console.log('hakwonMainApp messageGroupSendDetailController call');

	/*	페이지 초기화 호출	*/
	hakwonCommon.pageInit();

	/*	헤더 셋팅	*/
	comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'메세지'}, {url:'#', title:'보낸 그룹 메세지'}]);

	/*	공통 유틸	*/
	$scope.CommUtil = CommUtil;

	$("#wrapper").show();

	var messageNo = $routeParams.messageNo;

	/*	목록으로	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=goList]', function() {
		commProto.hrefMove(PageUrl.message.sendMessageGroupList);
		return false;
	});

	/*	예약 메세지 삭제	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=reservationMsgDelete]', function() {
		messageViewService.reservationMsgDelete(messageNo, PageUrl.message.sendMessageGroupList);
	});

	/*	메세지 삭제	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=delMsg]', function() {
		if( window.confirm('보낸 메세지를 정말 삭제 하시겠습니까?') ) {
			messageViewService.msgDelete(messageNo, PageUrl.message.sendMessageGroupList);
		}
	});

	$scope.hakwonCommon = hakwonCommon;
	$scope.result_view = false;

	/*	보낸 그룹 메세지 상세 정보 조회	*/
	messageViewService.sendMessageGroupDetail(messageNo, function(data) {
		if( data.error ) {
			alert('메세지 상세 조회를 실패 했습니다.');
			return false;
		}
		$scope.msgData = data.colData;

		/*	읽음/안읽음 카운트 체크	*/
		$scope.read_count = 0;
		$scope.unread_count = 0;
		for(var i=0; i<$scope.msgData.receiveUserList.length; i++) {
			var user = $scope.msgData.receiveUserList[i];

			if( user.receive_date ) {
				$scope.read_count++;
			} else {
				$scope.unread_count++;
			}
		}


//
	});
});

/**
 * 보낸 싱글 메세지 상세
 */
hakwonMainApp.controller('messageSingleSendDetailController', function($scope, $location, $routeParams, messageViewService, CommUtil) {
	console.log('hakwonMainApp messageSingleSendDetailController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'메세지'}, {url:'#', title:'보낸 개별 메세지'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		$("#wrapper").show();

		var receiveNo = $routeParams.receiveNo;
		/*	리플 작성	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=replyWrite]', function() {
			messageViewService.replyWrite(receiveNo);
		});

		$('#mainNgView').on(clickEvent, 'button[data-act=goList]', function() {
			commProto.hrefMove(PageUrl.message.sendMessageSingleList);
			return false;
		});

		/*	메세지 삭제	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=delMsg]', function() {
			if( window.confirm('보낸 메세지를 정말 삭제 하시겠습니까?') ) {
				var messageNo = $(this).attr('data-message-no');
				messageViewService.msgDelete(messageNo, PageUrl.message.sendMessageSingleList);
			}
		});

		/*	예약 메세지 삭제	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=reservationMsgDelete]', function() {
			var messageNo = $(this).attr('data-message-no');
			messageViewService.reservationMsgDelete(messageNo, PageUrl.message.sendMessageSingleList);
		});

		/*	본인 메세지 삭제	*/
		$('#mainNgView').on(clickEvent, 'p.message_body_text > button.btn_x', function() {
			if( window.confirm('리플을 삭제하시겠습니까?') ) {
				var replyNo = $(this).attr('data-reply-no');
				messageViewService.replyDelete(replyNo);
			}
		});

		$scope.$$postDigest(function() {
			/*	개별메세지 상세	*/
			messageViewService.sendMessageSingleDetail(receiveNo);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 받은 메시지 리스트
 */
hakwonMainApp.controller('receiveMessageListController', function($scope, $location, $routeParams, messageViewService, CommUtil) {
	console.log('hakwonMainApp receiveMessageListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'메세지'}, {url:'#', title:'받은 메세지'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		var pageNo = $routeParams.pageNo;
		if( !pageNo ) pageNo = 1;

		var hakwon_no = $routeParams.hakwon_no;

		var searchText = $routeParams.searchText;
		if( !searchText ) searchText = '';

		var searchType = $routeParams.searchType;
		if( !searchType ) searchType = 'all';


		$("#wrapper").show();
		$('#mainNgView').on(clickEvent, 'button[data-act=typeSelect]', function() {
			var dataType = $(this).attr('data-type');
			window.location.href = PageUrl.message.receiveMessageList+'?hakwon_no='+hakwon_no+'&searchType='+dataType;
		});



		$scope.$$postDigest(function() {
			$('#mainNgView input[name=searchText]').val(searchText);
			$('#mainNgView div[data-view=receiveMessageType] > button[data-type='+searchType+']').addClass('btn-primary');

			messageViewService.receiveMessageList(pageNo, hakwon_no, searchType);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 받은 메세지 상세
 */
hakwonMainApp.controller('receiveMessageDetailController', function($scope, $location, $routeParams, messageViewService, CommUtil) {
	console.log('hakwonMainApp receiveMessageDetailController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'메세지'}, {url:'#', title:'받은 메세지'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		$("#wrapper").show();

		var receiveNo	= $routeParams.receiveNo;
		var messageNo	= $routeParams.messageNo;
		var pageNo		= $routeParams.pageNo;

		/*	리플 작성	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=replyWrite]', function() {
			messageViewService.replyWrite(receiveNo);
		});

		$('#mainNgView').on(clickEvent, 'button[data-act=goList]', function() {
			if( pageNo ) {
				window.history.back();
			} else {
				window.location.href = PageUrl.message.receiveMessageList;
			}

			return false;
		});

		/*	본인 메세지 삭제	*/
		$('#mainNgView').on(clickEvent, 'p.message_body_text > button.btn_x', function() {
			if( window.confirm('리플을 삭제하시겠습니까?') ) {
				var replyNo = $(this).attr('data-reply-no');
				messageViewService.replyDelete(replyNo);
			}
			return false;
		});



		$scope.$$postDigest(function() {
			/*	개별메세지 상세	*/
			messageViewService.receiveMessageDetail(receiveNo, messageNo);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});