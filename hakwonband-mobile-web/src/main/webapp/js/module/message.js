/**
 * 메세지 서비스
 */
hakwonApp.service('messageService', function($window, CommUtil) {
	console.log('messageService call');

	var messageService = {};

	/**
	 * 첨부파일 업로드 옵션 생성
	 */
	messageService.getFileUploadOptions = function($scope) {
		var uploadTypeObj = {uploadType:CommonConstant.File.TYPE_MESSAGE};
		var msg = '첨부파일 업로드를 실패 했습니다.';

		// 파일 업로드 객체 생성
		var fileUploadOptions = new UploadOptions();
		fileUploadOptions.customExtraFields = uploadTypeObj;
		fileUploadOptions.setProgress = function(val) {
			comm.progress(Math.ceil(val * 100));
		};
		fileUploadOptions.onFinish = function(event, total) {
			if (this.errorFileArray.length + this.errorCount > 0) {
				alert(msg);
			} else {
				console.log(this.uploadFileArray);
				/********************
				 * fileNo
				 * filePath
				 * thumbFilePath
				 * fileName
				 * imageYn
				 ********************/

				for (var i = 0; i < this.uploadFileArray.length; i++) {
					var fileInfo = this.uploadFileArray[i];

					// 임시 파일 object
					var tempObj = {
						file_no 			: '',
						file_parent_type	: '',
						file_name			: '',
						save_file_name		: '',
						file_size			: '',
						file_ext_type		: '',
						file_ext			: '',
						file_path_prefix	: '',
						file_path			: '',
						image_yn			: '',
						thumb_file_path		: '',
						reg_date			: ''
					};

					tempObj.file_no		= fileInfo.fileNo;
					tempObj.file_name	= fileInfo.fileName;
					tempObj.file_path	= fileInfo.filePath;
					tempObj.image_yn	= fileInfo.imageYn;

					$scope.fileList.push(tempObj);
				}
				$scope.$digest();
			}
		};
		return fileUploadOptions;
	};

	/* 메세지 상세조회 호출 */
	messageService.getMessageDetail = function (params, $scope) {
		var	sendUrl 	= '/mobile/message/sendMessageDetail.do',
			receiveUrl 	= '/mobile/message/receiveMessageDetail.do',
			finalUrl  	= '';

		if (params.type == 'send') {
			finalUrl = sendUrl;
		} else if (params.type == 'receive') {
			finalUrl = receiveUrl;
		} else {
			alert('$routeParams.type Error' + JSON.stringify(params));
			commProto.logger({messageError:params});
			$window.history.back();
			return false;
		}

		if (isNull(params.receive_no) && isNull(params.message_no)) {
			alert('메세지 정보가 올바르지 않습니다.');
			$window.history.back();
			return false;
		}

		delete params.type;

		CommUtil.ajax({url:contextPath + finalUrl, param:params, successFun:function(data) {
			try {
				console.log(data, status);
				var colData = data.colData;
				if( colData ) {
					colData.messageDetail.content = commProto.replaceURLWithHTMLLinks(colData.messageDetail.content);
					$scope.messageDetail		= colData.messageDetail;
					$scope.messageDetail.send_user_info = comm.userInfoParse(colData.messageDetail.send_user_info);
					$scope.messageDetail.receive_user_info = comm.userInfoParse(colData.messageDetail.receive_user_info);
					$scope.replyList			= colData.replyList;
					$scope.fileList				= colData.fileList;

					CommUtil.initFileTypeArray($scope);
				} else {
					commProto.logger({messageDetailError:colData});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/* 메세지 보내기 */
	messageService.registMessage = function (messageTarget, callback) {
		var params = {};
		if (!messageTarget.user_type || !messageTarget.hakwon_no || messageTarget.user_no_list.length <= 0) {
			alert('메세지 보낼 사람을 정확히 선택해주세요.');
			return ;
		} else if (!messageTarget.content) {
			alert('메세지를 입력해 주세요.');
			return ;
		} else {
			params.hakwon_no		= messageTarget.hakwon_no;
			params.user_no_list 	= messageTarget.user_no_list;
			params.file_no_list 	= messageTarget.file_no_list;
			params.content			= messageTarget.content;
			params.title			= messageTarget.content.substr(0, 20) + '...';
			params.preview_content	= messageTarget.content.substr(0, 50) + '...';
		}

		CommUtil.ajax({url:contextPath + '/mobile/message/registMultiMessage.do', param:params, successFun:function(data) {
			try {
				if( data.error ) {
					alert('메세지 발송에 실패하였습니다. 잠시 후 다시 시도해 주세요.');
				} else {
					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						alert('메세지를 발송했습니다.');
						callback();
					} else {
						alert('메세지 발송에 실패하였습니다. 잠시 후 다시 시도해 주세요.');
						commProto.logger({registMultiMessageError:data});
					}
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/*  대상 변경시 메세지 받을 대상값 변경처리  */
	messageService.setMessageTarget = function ($scope) {

		/*	메세지 받을 대상 정보 userNo : [0], hakwonNo: [1], classNo : [2] */
		if (isNull($scope.receiveUserInfo)) {
			return ;
		}
		var splitArray = $scope.receiveUserInfo.split('|');

		if (isNull(splitArray[0])) {
			alert('사용자 정보가 잘못되었습니다.');
			return ;
		} else {
			$scope.messageTarget.user_no_list= [];
			$scope.messageTarget.user_no_list.push(splitArray[0]);
		}

		if (isNull(splitArray[1])) {
			alert('학원 정보가 잘못되었습니다.');
			return ;
		} else {
			$scope.messageTarget.hakwon_no = splitArray[1];
		}

		console.log(splitArray, $scope.messageTarget);
	};

	/*  원장 select options용 모델 생성  */
	messageService.createMasterOptions = function (masterList) {
		var tempList = [];
		if (masterList.length != 0) {
			angular.forEach(masterList, function(item){
				var options = {};
				options.user_data	= item.master_user_no + '|' + item.hakwon_no;
				options.user_info	= item.master_user_name + ' - ' + item.hakwon_name;
				tempList.push(options);
			});
		}
		return tempList;
	};

	/*  선생님 select options용 모델 생성  */
	messageService.createTeacherOptions = function (allClassTeacherList) {
		var tempList = [];
		if (allClassTeacherList.length != 0) {
			angular.forEach(allClassTeacherList, function(item){
				var options = {};
				options.user_data	= item.user_no + '|' + item.hakwon_no + '|' + item.class_no;
				options.user_info	= item.user_info;
				tempList.push(options);
			});
		}
		return tempList;
	};

	return messageService;

});


/* 보낸 메세지 리스트 컨트롤러 */
hakwonApp.controller('sendMessageListController', function($scope, $location, $routeParams, CommUtil, messageService) {
	console.log('sendMessageListController call', $scope, $location, $routeParams, CommUtil, messageService);

	try {
		/*  인증 정보 체크  */
		comm.authCheckFilter();

		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({viewType:'user',  headerTitle:'보낸 메세지'});

		/*	초기화	*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('sendMessageListController $viewContentLoaded');

			/*	변수 초기화	*/
			$scope.sendMessageObj	= {};
			$scope.isMessage 		= false;
			$scope.page 			= 1;

			if (!isNull($routeParams.page)) {
				$scope.page = $routeParams.page;
			}

			/*	보낸 메세지 리스트 호출 	*/
			$scope.getSendMessageList($scope.page);
		});

		/*	보낸 메세지 리스트 호출 	*/
		$scope.getSendMessageList = function(pageNo) {
			var params = {page_no: !isNull(pageNo) ? pageNo : '1'};
			CommUtil.ajax({url:contextPath+'/mobile/message/sendMessageList.do', param:params, successFun:function(data) {
				try {
					var colData = data.colData;
					if( colData ) {
						$scope.sendMessageObj = colData;
						if (!$scope.sendMessageObj.sendMessageList.length == 0) $scope.isMessage = true;
						$scope.pageInfo = CommUtil.getPagenationInfo(colData.sendMessageListTotCount, colData.pageScale, 10, $scope.page);
					} else {
						commProto.logger({sendMessageListError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/* 메세지 디테일 */
		$scope.goMessageDetail = function(item) {
			var params = {receive_no: item.receive_no, message_no: item.message_no, type: 'send', page: $scope.page};
			console.log(params);

			CommUtil.locationHref(MENUS.sharpUrls.messageDetail, params);
		};

		/*	페이지네이션 페이지 이동	*/
		$scope.movePage = function(page) {
			if ($scope.page === page) {
				return;
			}
			$scope.page = page;
			$scope.getSendMessageList($scope.page);
		};

		$scope.getFileFullPath = function(filePath, type, isThumb) {
			return CommUtil.createFileFullPath(filePath, type, isThumb);
		};

		$scope.$$postDigest(comm.screenInit);

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/* 받은 메세지 리스트 컨트롤러 */
hakwonApp.controller('receiveMessageListController', function($scope, $location, $routeParams, CommUtil, messageService) {
	console.log('receiveMessageListController call', $scope, $location, CommUtil, $routeParams, messageService);

	try {
		/*  인증 정보 체크  */
		comm.authCheckFilter();

		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({viewType:'user', headerTitle:'받은 메세지'});

		/*	초기화	*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('receiveMessageListController $viewContentLoaded');

			/*	변수 초기화	*/
			$scope.receiveMessageObj	= {};
			$scope.isMessage 			= false;
			$scope.page 				= 1;

			if (!isNull($routeParams.page)) {
				$scope.page = $routeParams.page;
			}

			/*	받은메세지 리스트 호출 	*/
			$scope.getReceiveMessageList($scope.page);
		});

		/*	받은메세지 리스트 호출 	*/
		$scope.getReceiveMessageList = function(pageNo) {
			var params = {page_no: !isNull(pageNo) ? pageNo : '1'};
			CommUtil.ajax({url:contextPath+'/mobile/message/receiveMessageList.do', param:params, successFun:function(data) {
				try {
					var colData = data.colData;
					if( colData ) {
						$scope.receiveMessageObj = colData;
						if (0 < parseInt(colData.receiveMessageListTotCount)) $scope.isMessage = true;
						$scope.pageInfo = CommUtil.getPagenationInfo(colData.receiveMessageListTotCount, colData.pageScale, 10, $scope.page);
					} else {
						commProto.logger({receiveMessageListError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/* 메세지 디테일 */
		$scope.goMessageDetail = function(item) {
			var params = {receive_no: item.receive_no, type: 'receive', page: $scope.page};
			console.log(params);

			CommUtil.locationHref(MENUS.sharpUrls.messageDetail, params);
		};

		/*	페이지네이션 페이지 이동	*/
		$scope.movePage = function(page) {
			if ($scope.page === page) {
				return;
			}
			$scope.page = page;
			$scope.getReceiveMessageList($scope.page);
		};

		$scope.checkNewItem = function(checkDate) {
			return CommUtil.isNewItem(checkDate);
		};

		$scope.getFileFullPath = function(filePath, type, isThumb) {
			return CommUtil.createFileFullPath(filePath, type, isThumb);
		};

		$scope.$$postDigest(comm.screenInit);

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/* 메세지 상세보기 컨트롤러  */
hakwonApp.controller('messageDetailController', function($scope, $window, $location, $routeParams, CommUtil, messageService) {
	console.log('messageDetailController call', $scope, $window, $routeParams, CommUtil, messageService);

	try {
		/*  인증 정보 체크  */
		comm.authCheckFilter();

		/*	헤더 정보 셋팅	*/
		var headerInfo = {viewType:'user'};
		if ($routeParams.type == 'send') {
			headerInfo.headerTitle = '보낸 메세지';
		} else if ($routeParams.type == 'receive') {
			headerInfo.headerTitle = '받은 메세지';
		} else {
			headerInfo.headerTitle = '메세지';
		}
		hakwonHeader.setHeader(headerInfo);

		/*	초기화	*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('messageDetailController $viewContentLoaded');

			if (isNull($routeParams)) {
				$window.history.back();
				return false;
			}

			/*	댓글 정보 초기화	*/
			$scope.replyInfo = {
				reg_user_no			: '',
				content_type		: '002',
				content_parent_no 	: '',
				reply_content		: '',
				title				: ''
			};
			$scope.replyInfo.reg_user_no		= userAuth.userNo;
			$scope.replyInfo.content_parent_no	= $routeParams.receive_no;

			/*	변수 초기화	*/
			$scope.messageType			= $routeParams.type;
			$scope.currentUserNo		= userAuth.userNo;

			$scope.messageDetail		= {};
			$scope.replyList			= [];
			$scope.fileList 			= [];

			$scope.imageFileArray		= [];
			$scope.normalFileArray		= [];
			$scope.page					= 1;

			if (!isNull($routeParams.page)) {
				$scope.page = $routeParams.page;
			}

			/*	메세지 상세조회 호출 	*/
			$scope.getMessage();
		});

		/*	메세지 상세조회 호출 	*/
		$scope.getMessage = function() {
			var params = {receive_no: $routeParams.receive_no, message_no: $routeParams.message_no, type: $routeParams.type};
			messageService.getMessageDetail(params, $scope);
		};

		/**
		 * 신규 댓글 조회, replyNo : 해당 댓글번호 이후것을 조회
		 * @param replyNo
		 */
		$scope.getNewReplyList = function(replyNo) {
			if (isNull($routeParams.receive_no)) {
				alert('메세지 정보가 올바르지 않습니다.');
				return ;
			}
			var params = {};
			params.content_type = '002';
			params.content_parent_no = $routeParams.receive_no;
			params.reply_no = replyNo;
			CommUtil.ajax({url:contextPath+'/mobile/reply/newReplyList.do', param:params, successFun:function(data) {
				try {
					if( data.colData.result = 'success' ) {
						$scope.replyList = _.uniq($scope.replyList.concat(data.colData.replyList));
						$scope.$$postDigest(function() {
							$('body').scrollTop($('ul.ul_type_04 > li:last').position().top);
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

		/**
		 * 댓글 등록
		 */
		$scope.registReply = function() {
			if (_.isEmpty($scope.replyInfo.content_parent_no)) {
				alert('메세지 정보가 올바르지 않습니다.');
				return ;
			}
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

		/* historyBack */
		$scope.historyBack = function() {
			if ($scope.messageType == 'send') {
				var params = {page: $scope.page};
				CommUtil.locationHref(MENUS.sharpUrls.sendMessageList, params);
				return false;
			} else if ($scope.messageType == 'receive') {
				var params = {page: $scope.page};
				CommUtil.locationHref(MENUS.sharpUrls.receiveMessageList, params);
				return false;
			} else {
				$window.history.back();
				return false;
			}
		};

		$scope.getFileFullPath = function(filePath, type, isThumb) {
			return CommUtil.createFileFullPath(filePath, type, isThumb);
		};

		$scope.$$postDigest(comm.screenInit);

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/* 메세지 보내기 컨트롤러  */
hakwonApp.controller('messageWriteController', function($scope, $location, $window, $routeParams, $timeout, CommUtil, messageService) {

	try {
		/*  인증 정보 체크  */
		comm.authCheckFilter();

		/*	헤더 정보 셋팅	*/
		hakwonHeader.setHeader({viewType:'user', headerTitle:'메세지 보내기'});

		if (isNull(hakwonInfo.hakwonList)) {
			alert('학원정보가 올바르지 않습니다.');
			comm.authCheckFilter();
			return false;
		}

		/* 전체 소속 반 선생님 데이터 */
		$scope.teacherListObj = {};

		/*	셀렉트 - 옵션즈에서 선택된 유저 정보	*/
		$scope.receiveUserInfo = '';

		/*	선생님 페이지에서 직접 접근한 경우	*/
		$scope.externalAccess = false;

		/*  메세지 받을 대상자의 정보  */
		$scope.messageTarget = {
			hakwon_no		: '',
			user_no			: '',
			user_name		: '',
			user_type		: '003',
			content			: '',
			user_no_list	: [],
			file_no_list	: []
		};

		/*	파일 첨부 리스트*/
		$scope.fileList	= [];

		if (!isNull($routeParams.hakwon_no)) {
			$scope.hakwonNo = $routeParams.hakwon_no;
		}

		if (!isNull($routeParams.class_no)) {
			$scope.classNo = $routeParams.class_no;
			$scope.externalAccess = true;
		}

		if (!isNull($routeParams.user_no)) {
			$scope.userNo = $routeParams.user_no;
		}

		/* userType select - options */
		$scope.userTypeOptions = [
			{user_type : '003', type_name : '원장님'},
			{user_type : '004', type_name : '선생님'}
		];

		/* 원장 select - options */
		$scope.masterOptions = messageService.createMasterOptions(hakwonInfo.hakwonList);

		/* 선생님 select - options */
		$scope.teacherOptions = [];

		/* 현재 선택된 유저타입의 select - options */
		$scope.currentOptions = $scope.masterOptions;

		/*  유저타입 구분 변경  */
		$scope.changeUserType = function() {
			if ($scope.messageTarget.user_type == '003') {
				$scope.currentOptions = $scope.masterOptions;
			} else if ($scope.messageTarget.user_type == '004') {
				$scope.currentOptions = $scope.teacherOptions;
			}
		};

		/* 선택된 유저 변경시 $scope.messageTarget 변경 */
		$scope.changeUserName = function() {
			messageService.setMessageTarget($scope);
		};

		/*	선생님 리스트에서 페이지 이동으로 진입한 경우 초기화	*/
		$scope.initFromTeacherPage = function() {
			if ($scope.hakwonNo && $scope.classNo && $scope.userNo) {
				$scope.messageTarget.user_type = '004';
				$scope.currentOptions = $scope.teacherOptions;
				$timeout(function() {
					$scope.receiveUserInfo = $scope.userNo + '|' + $scope.hakwonNo + '|' + $scope.classNo;
					messageService.setMessageTarget($scope);
				}, 100);
			}
		};

		/*	전체 소속 반 선생님 리스트 호출 	*/
		$scope.getHakwonTeacherList = function() {
			CommUtil.ajax({url:contextPath+"/mobile/hakwon/allClassTeacherList.do", param:'', successFun:function(data) {
				try {
					if( data.colData ) {
						$scope.teacherListObj = data.colData;
						$scope.teacherOptions = messageService.createTeacherOptions($scope.teacherListObj.allClassTeacherList);

						/*	선생님 페이지에서 직접 접근시, $routeParams 값으로 선생님 자동선택	*/
						if ($scope.externalAccess == true) {
							$scope.initFromTeacherPage();
						}

					} else {
						commProto.logger({hakwonTeacherListError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/*	첨부 파일 이미지 썸네일 처리	*/
		$scope.getFileFullPath = CommUtil.createFileFullPath;

		/*	첨부 파일 삭제 처리	*/
		$scope.removeAttachFile = function(fileNo) {
			$scope.fileList = _.filter($scope.fileList, function(item) {
				return item.file_no != fileNo;
			});
		};

		/*	메세지 발송	*/
		$('#wrap_cont').on(clickEvent, 'button[data-act=sendMessage]', function() {
			var fileNoList	= _.pluck($scope.fileList, 'file_no');
			$scope.messageTarget.file_no_list = fileNoList.toString();
			messageService.registMessage($scope.messageTarget, function(){
				// 메세지 전송 후, 메세지 값 초기화
				$scope.messageTarget.content = '';
				$scope.messageTarget.file_no_list = [];
				$scope.fileList = [];
			});
		});

		/*	전체 소속 반 선생님 리스트 호출 	*/
		$scope.getHakwonTeacherList();

		$scope.$$postDigest(function() {
			/*	파일 업로드 객체 생성		*/
			if( comm.isAndroidUploader() ) {
				angular.element("input[data-act=file_upload]").click(function() {
					delete window.uploadCallBack;
					window.uploadCallBack = function(uploadJsonStr) {
						try {
							var resultObj = JSON.parse(uploadJsonStr);
							if( resultObj.error ) {
								alert('파일 업로드를 실패 했습니다.');
							} else {
								var fileInfo = resultObj.colData;
								var tempObj = {};
								tempObj.file_no		= fileInfo.fileNo;
								tempObj.file_name	= fileInfo.fileName;
								tempObj.file_path	= fileInfo.filePath;
								tempObj.image_yn	= fileInfo.imageYn;

								$scope.fileList.push(tempObj);
								$scope.$digest();
							}
						} catch(e) {
							alert('파일 업로드를 실패 했습니다.');
						}
					};
					var param = {
						fileType : 'all'
						, multipleYn : 'N'
						, callBack : 'uploadCallBack'
						, upload : {
							url : window.location.protocol+'//'+window.location.host+uploadUrl
							, param : {uploadType:CommonConstant.File.TYPE_MESSAGE}
							, cookie : document.cookie
						}
					};
					window.PLATFORM.fileChooser(JSON.stringify(param));

					return false;
				});
			} else {
				$scope.fileUploadObj = angular.element("input[data-act=file_upload]").html5_upload(messageService.getFileUploadOptions($scope, CommonConstant.File.TYPE_MESSAGE));
			}

			comm.screenInit();
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}

});