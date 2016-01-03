
/**
 * 반 팩토리
 */
hakwonMainApp.factory('classFactory', function() {
	console.log('hakwonMainApp classFactory call');
	return {
		currentClass : {}
	}
});


/**
 * 반 서비스
 */
hakwonMainApp.service('classService', function(classFactory, CommUtil) {
	console.log('hakwonMainApp classService call');

	var classService = {};

	/**
	 * 첨부파일 업로드 옵션 생성
	 */
	classService.getFileUploadOptions = function($scope, type) {
		var uploadTypeObj = {
			uploadType	: type
			, hakwonNo	: $scope.hakwonNo
			, classNo	: $scope.classNo
		};

		var msg = '첨부 파일 업로드를 실패 했습니다.';
		if (type == CommonConstant.File.TYPE_CLASS_LOGO) {
			msg = '반 로고 업로드를 실패 했습니다.';
		}

		// 파일 업로드 객체 생성
		var fileUploadOptions = new UploadOptions();
		fileUploadOptions.customExtraFields = uploadTypeObj;
		fileUploadOptions.onFinish = function(event, total) {
			if (this.errorFileArray.length + this.errorCount > 0) {
				alert(msg);
			} else {
				/********************
				 * fileNo
				 * filePath
				 * thumbFilePath
				 * fileName
				 * imageYn
				 ********************/

				/*	반 로고 파일 업로드	*/
				if (type == CommonConstant.File.TYPE_CLASS_LOGO ) {
					for (var i = 0; i < this.uploadFileArray.length; i++) {
						var fileInfo = this.uploadFileArray[i];
						if (fileInfo.imageYn == 'Y') {
							$('img[data-view=class_logo_preview]').attr('src', HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.filePath).attr('data-file-no', fileInfo.fileNo);
						} else {
							alert('이미지 파일이 아닙니다.');
						}
					}
				/*	첨부 파일 업로드	*/
				} else {
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
						tempObj.mime_type	= fileInfo.mimeType;

						$scope.fileList.push(tempObj);
					}
					$scope.$digest();
				}
			}
		};
		return fileUploadOptions;
	};

	/* 반 상세조회 서비스 */
	classService.hakwonClassDetail = function($scope) {
		if (isNull($scope.classNo)) {
			alert('반 정보가 올바르지 않습니다.');
			return ;
		}
		CommUtil.ajax({url:contextPath+"/hakwon/hakwonClassDetail.do", param:{class_no: $scope.classNo}, successFun:function(data) {
			try {
				if( data.error ) {
					alert('반 정보 조회를 실패 했습니다.');
					return ;
				}
				var colData = data.colData;
				if( colData.result == CommonConstant.Flag.success ) {
					$scope.classDetail				= colData.classDetail;
					$scope.classTeacherList			= colData.classTeacherList;
					$scope.classTeacherListTotCount = colData.classTeacherListTotCount;

					/*	팩토리에 조회데이터 입력	*/
					classFactory.currentClass 		= colData;
				} else {
					commProto.logger({hakwonclassdetailerror:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/* 반 리스트 조회 서비스 */
	classService.hakwonClassList = function(params, callback) {
		CommUtil.ajax({url: contextPath + "/hakwon/hakwonClassList.do", param: params, successFun: callback});
	};


	/*	반 등록 서비스	*/
	classService.masterHakwonClassInsert = function($scope) {
		if (parseInt(userAuth.userNo) != parseInt(hakwonInfo.master_user_no)) {
			alert('학원 원장님만 등록이 가능합니다');
			return;
		}
		if (isNull($scope.regClassInfo.class_title) || isNull($scope.regClassInfo.class_intro) || isNull($scope.regClassInfo.class_order)) {
			alert('반 정보를 입력해 주세요.');
			return;
		}

		var params = {
			hakwon_no: $scope.hakwonNo,
			class_title: $scope.regClassInfo.class_title,
			class_intro: $scope.regClassInfo.class_intro,
			class_order: $scope.regClassInfo.class_order
		};

		CommUtil.ajax({url: contextPath + "/hakwon/master/masterHakwonClassInsert.do", param: params, successFun: function (data) {
			try {
				if( data.error ) {
					alert('반 등록을 실패 했습니다.');
					return ;
				}

				var colData = data.colData;
				if (colData.result == '1') {
					alert('새로운 반을 등록하였습니다.');
					$scope.regClassInfo.class_title = '';
					$scope.regClassInfo.class_intro = '';
					$scope.regClassInfo.class_order = '';
					$scope.getClassList(1);
				} else {
					commProto.logger({masterHakwonClassInsertError: data});
				}
			} catch (ex) {
				commProto.errorDump({errorObj: ex});
			}
		}});
	};

	/**
	 * 원장 반 삭제 기능
	 * @param params
	 */
	classService.masterHakwonClassDelete = function(params) {
		if (isNull(params.hakwon_no) || isNull(params.class_no)) {
			alert('반 정보가 올바르지 않습니다.');
			return ;
		}
		CommUtil.ajax({url: contextPath + "/hakwon/master/removeClass.do", param: params, successFun: function (data) {
			try {
				if( data.error ) {
					alert('반 삭제를 실패 했습니다.');
					return ;
				}
				var colData = data.colData;
				if (colData.result == CommonConstant.Flag.fail) {
					alert(params.class_title + '에 등록된 선생님과 학생을 모두 삭제 후 가능합니다.');
				} else if (colData.result == CommonConstant.Flag.success) {
					alert('반을 삭제 하였습니다.');
					CommUtil.locationHref(PageUrl.common.classList, {}, 'hakwon');
				} else {
					commProto.logger({removeClassError: data});
				}
			} catch (ex) {
				commProto.errorDump({errorObj: ex});
			}
		}});
	};

	/**
	 * 원장 반 정보 수정 기능
	 * @param $scope
	 */
	classService.masterHakwonClassUpdate = function($scope) {
		var params = {};
		params.class_no		= $scope.classDetail.class_no;
		params.class_title	= $scope.classDetail.class_title;
		params.class_intro	= $scope.classDetail.class_intro;

		if (isNull(params.class_no)) {
			alert('반 정보가 올바르지 않습니다.');
			return ;
		}

		CommUtil.ajax({url:contextPath+"/hakwon/master/classInfoUpdate.do", param:params, successFun:function(data) {
			try {
				if( data.error ) {
					alert('반 정보 수정을 실패 했습니다.');
					return ;
				}

				var colData = data.colData;
				if( colData.result == CommonConstant.Flag.success ) {
					alert('반정보가 수정되었습니다.');
					$scope.getClassDetail();
				} else {
					alert('반정보 수정을 실패하였습니다. 다시 시도해 주시기 바랍니다.');
					commProto.logger({classInfoUpdateError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/*	반 공지사항 리스트 조회	*/
	classService.classNoticeList = function($scope) {
		if (isNull($scope.classNo)) {
			alert('반 정보가 올바르지 않습니다.');
			return;
		}
		var params = {class_no: $scope.classNo, page_no: $scope.page};
		CommUtil.ajax({url: contextPath + "/hakwon/classNoticeList.do", param: params, successFun: function (data) {
			try {
				if( data.error ) {
					alert('공지사항 조회를 실패 했습니다.');
					return ;
				}

				var colData = data.colData;
				if (colData) {
					$scope.classNoticeList = colData.classNoticeList;
					$scope.classNoticeListTotCount = colData.classNoticeListTotCount;

					$scope.pageInfo = CommUtil.getPagenationInfo(colData.classNoticeListTotCount, colData.pageScale, DefaultInfo.pageScale, $scope.page);
				} else {
					commProto.logger({classNoticeListError: data});
				}
			} catch (ex) {
				commProto.errorDump({errorObj: ex});
			}
		}});
	};

	/**
	 * 반 공지사항 상세조회
	 * @param $scope
	 */
	classService.classNoticeDetail = function($scope) {
		if (isNull($scope.noticeNo)) {
			alert('학원 번호가 올바르지 않습니다.');
			return ;
		}
		CommUtil.ajax({url:contextPath+"/hakwon/noticeDetail.do", param:{notice_no: $scope.noticeNo}, successFun:function(data) {
			try {
				if( data.error ) {
					alert('공지 조회를 실패 했습니다.');
					return ;
				}
				var colData = data.colData;
				if( colData ) {
					$scope.noticeDetail			= colData.noticeDetail;
					$scope.replyList			= colData.replyList;
					$scope.fileList				= colData.fileList;
					$scope.classNoticeReaderList= colData.classNoticeReaderList;

					setTimeout(function(){
						comm.contentImageReset();
					}, 50);
				} else {
					commProto.logger({hakwonDetailError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/**
	 * 반 공지사항 삭제 기능
	 * @param $scope
	 */
	classService.deleteClassNotice = function($scope) {
		var apiUrl = '/hakwon/master/removeNotice.do';

		if (isNull($scope.noticeNo)) {
			alert('공지사항 정보가 올바르지 않습니다.');
			return ;
		}

		if (userAuth.userType == '004') {
			apiUrl = '/hakwon/teacher/removeClassNotice.do';
		}

		if(confirm('공지사항을 삭제하시겠습니까?')) {
			CommUtil.ajax({url:contextPath + apiUrl, param:{notice_no:$scope.noticeNo}, successFun:function(data) {
				try {
					if( data.error ) {
						alert('공지 삭제를 실패 했습니다.');
						return ;
					}

					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						alert('공지사항을 삭제하였습니다.');
						$scope.goClassNoticeList();
					} else {
						commProto.logger({  Error:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		}
	};

	/**
	 * 신규 댓글 조회, replyNo : 해당 댓글번호 이후것을 조회
	 * @param replyNo
	 * @param $scope
	 */
	classService.getNewReplyList = function(replyNo, $scope) {
		if (isNull($scope.noticeNo)) {
			alert('공지사항 정보가 올바르지 않습니다.');
			return ;
		}
		var params = {};
		params.content_type = '001';
		params.content_parent_no = $scope.noticeNo;
		params.reply_no = replyNo;
		CommUtil.ajax({url:contextPath+'/hakwon/reply/newReplyList.do', param:params, successFun:function(data) {
			try {
				if( data.error ) {
					alert('댓글 조회를 실패 했습니다.');
					return ;
				}
				var colData = data.colData;
				if( colData.result = 'success' ) {
					$scope.replyList = _.uniq($scope.replyList.concat(colData.replyList));
				} else {
					alert('댓글 조회를 실패하였습니다. 잠시 후 다시 시도해주시기 바랍니다.');
					commProto.logger({removeReplyError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/**
	 * 반 공지사항 댓글 등록
	 * @param $scope
	 */
	classService.registReplyClassNotice = function($scope) {
		if (_.isEmpty($scope.replyInfo.content_parent_no)) {
			alert('공지사항 정보가 올바르지 않습니다.');
			return ;
		}
		if (_.isEmpty($scope.replyInfo.reply_content)) {
			alert('댓글을 입력해 주세요.');
			return ;
		}
		CommUtil.ajax({url:contextPath+'/hakwon/reply/registReply.do', param:$scope.replyInfo, successFun:function(data) {
			try {
				if( data.error ) {
					alert('댓글 등록을 실패 했습니다.');
					return ;
				}
				if( data.colData.result = 'success' ) {
					$scope.replyInfo.reply_content = '';
					var lastReply = {reply_no:''};
					if ($scope.replyList.length > 0) {
						lastReply = _.last($scope.replyList);
					}
					classService.getNewReplyList(lastReply.reply_no, $scope);
				} else {
					alert('댓글 등록에 실패하였습니다. 잠시 후 다시 시도해주시기 바랍니다.');
					commProto.logger({removeReplyError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/*	학원 학생 검색 리스트 조회		*/
	classService.hakwonStudentList = function (searchText, $scope) {
		if (isNull($scope.hakwonNo)) {
			alert('학원 정보가 올바르지 않습니다.');
			return;
		}
		var params = {
			hakwonNo: $scope.hakwonNo
			, classNo : $scope.classNo
			, searchText: searchText
		};
		CommUtil.ajax({url: contextPath + "/hakwon/student/notClass.do", param: params, successFun: function (data) {
			try {
				if( data.error ) {
					alert('학생 리스트 조회를 실패 했습니다.');
					return ;
				}

				var colData = data.colData;
				if (colData) {
					$scope.studentList = colData.dataList;
					if (colData.dataList.length <= 0) {
						alert('검색결과가 없습니다.');
					}

				} else {
					commProto.logger({studentListError: data});
				}
			} catch (ex) {
				commProto.errorDump({errorObj: ex});
			}
		}});
	};

	/**
	 * 반에 학생 추가
	 * @param item
	 * @param $scope
	 */
	classService.addStudentToClass = function(item, $scope) {
		var params = {};
		params.hakwon_no		= $scope.hakwonNo;
		params.class_no			= $scope.classNo;
		params.student_user_no	= item.user_no;

		if (isNull(params.student_user_no) || isNull(params.hakwon_no) || isNull(params.class_no) ) {
			alert('학생 정보가 올바르지 않습니다.');
			return ;
		}
		CommUtil.ajax({url:contextPath+"/hakwon/registClassStudent.do", param:params, successFun:function(data) {
			try {
				if( data.error ) {
					alert('학생 등록을 실패 했습니다.');
					return ;
				}
				var colData = data.colData;
				if( colData.flag == CommonConstant.Flag.success ) {

					$scope.studentList = _.without($scope.studentList, _.findWhere($scope.studentList, {user_no: item.user_no}));

					alert('학생이 추가 되었습니다.');
					$scope.getClassStudentList($scope.page);
				} else {
					commProto.logger({registClassStudentError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/**
	 * 반에서 학생 삭제
	 * @param item
	 * @param $scope
	 */
	classService.removeStudentFromClass = function(item, $scope) {
		var params = {};
		params.hakwon_no		= $scope.hakwonNo;
		params.class_no			= $scope.classNo;
		params.student_user_no	= item.user_no;

		if (isNull(params.student_user_no) || isNull(params.hakwon_no) || isNull(params.class_no) ) {
			alert('학생 정보가 올바르지 않습니다.');
			return ;
		}
		CommUtil.ajax({url:contextPath+"/hakwon/removeClassStudent.do", param:params, successFun:function(data) {
			try {
				if( data.error ) {
					alert('학생 삭제를 실패 했습니다.');
					return ;
				}

				var colData = data.colData;
				if( colData.flag == CommonConstant.Flag.success ) {
					alert('반에서 학생을 삭제하였습니다.');
					$scope.getClassStudentList($scope.page);
				} else {
					commProto.logger({removeClassStudentError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/*	반 소속 학생 리스트 조회	*/
	classService.classStudentList = function (pageNo, pageScale, $scope, searchText) {
		if (isNull($scope.hakwonNo)) {
			alert('학원 정보가 올바르지 않습니다.');
			return;
		}
		if (isNull($scope.classNo)) {
			alert('반 정보가 올바르지 않습니다.');
			return;
		}
		var params = {
			hakwonNo: $scope.hakwonNo
			, classNo: $scope.classNo
			, pageNo: isNull(pageNo) ? 1 : pageNo
			, searchText : searchText
			, pageScale : pageScale
		};
		CommUtil.ajax({url: contextPath + "/hakwon/student/classStudentList.do", param: params, successFun: function (data) {
			try {
				if( data.error ) {
					alert('학생 리스트 조회를 실패 했습니다.');
					return ;
				}

				var colData = data.colData;
				if (colData) {
					$scope.classStudentList = colData.dataList;
					$scope.classStudentListTotCount = colData.dataCount;
					$scope.pageInfo = CommUtil.getPagenationInfo(colData.dataCount, colData.pageScale, DefaultInfo.pageScale, $scope.page);

					/*	학생 리스트의 학부모 정보 문자열을 object array로 변환	*/
					$scope.classStudentList = comm.initRelationList($scope.classStudentList);
				} else {
					commProto.logger({studentListError: data});
				}
			} catch (ex) {
				commProto.errorDump({errorObj: ex});
			}
		}});
	};

	/*	학원내 학부모 리스트 조회	*/
	classService.hakwonParentList = function (pageNo, $scope) {
		if (isNull($scope.hakwonNo)) {
			alert('학원 정보가 올바르지 않습니다.');
			return;
		}
		var params = {hakwonNo: $scope.hakwonNo, searchText: $scope.searchText, pageNo: !isNull(pageNo) ? pageNo : 1};
		CommUtil.ajax({url: contextPath + "/hakwon/parent/list.do", param: params, successFun: function (data) {
			try {
				if( data.error ) {
					alert('학부모 조회를 실패 했습니다.');
					return ;
				}
				var colData = data.colData;
				if (colData) {
					$scope.parentList = colData.dataList;
					$scope.parentListTotCount = colData.dataCount;
				} else {
					commProto.logger({studentListError: data});
				}
			} catch (ex) {
				commProto.errorDump({errorObj: ex});
			}
		}});
	};

	/*	반소속 학부모 리스트 조회	*/
	classService.classParentList = function (pageNo, $scope) {
		if (isNull($scope.hakwonNo) || isNull($scope.classNo)) {
			alert('조회 정보가 올바르지 않습니다.');
			return;
		}
		var params = {hakwonNo: $scope.hakwonNo, classNo: $scope.classNo, pageNo: !isNull(pageNo) ? pageNo : 1};
		CommUtil.ajax({url: contextPath + "/hakwon/parent/classParentList.do", param: params, successFun: function (data) {
			try {
				if( data.error ) {
					alert('학부모 조회를 실패 했습니다.');
					return ;
				}
				var colData = data.colData;
				if (colData) {
					$scope.classParentList			= colData.dataList;
					$scope.classParentListTotCount	= colData.dataCount;
					$scope.pageInfo					= CommUtil.getPagenationInfo(colData.dataCount, colData.pageScale, DefaultInfo.pageScale, $scope.page);

					/*	학부모 리스트의 학생정보 문자열을 object array로 변환	*/
					$scope.classParentList = comm.initRelationList($scope.classParentList);
				} else {
					commProto.logger({studentListError: data});
				}
			} catch (ex) {
				commProto.errorDump({errorObj: ex});
			}
		}});
	};

	/*	반 선생님 리스트 조회	*/
	classService.classTeacherList = function(pageNo, $scope) {
		if (isNull($scope.classNo)) {
			alert('반 번호가 올바르지 않습니다.');
			return ;
		}
		var params = {};
		params.page_no = isNull(pageNo) ? 1 : pageNo;
		params.class_no = $scope.classNo;

		CommUtil.ajax({url:contextPath+"/hakwon/classTeacherList.do", param:params, successFun:function(data) {
			try {
				if( data.error ) {
					alert('선생님 조회를 실패 했습니다.');
					return ;
				}

				var colData = data.colData;
				if( colData ) {
					$scope.teacherList 			= colData.classTeacherList;
					$scope.teacherListTotCount	= colData.classTeacherListTotCount;
					if (0 < parseInt(colData.classTeacherListTotCount)) $scope.isTeachers = true;
					$scope.pageInfo = CommUtil.getPagenationInfo(colData.classTeacherListTotCount, colData.pageScale, DefaultInfo.pageScale, $scope.page);

				} else {
					commProto.logger({classTeacherListError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/*	학원내 선생님 검색 조회	*/
	classService.searchHakwonTeacher = function(params, $scope) {
		if (isNull(params.hakwon_no)) {
			alert('학원정보가 올바르지 않습니다.');
			return ;
		}
		CommUtil.ajax({url:contextPath+"/hakwon/master/searchHakwonTeacherList.do", param:params, successFun:function(data) {
			try {
				if( data.error ) {
					alert('선생님 조회를 실패 했습니다.');
					return ;
				}

				var colData = data.colData;
				if( colData ) {
					$scope.hakwonTeacherList			= colData.content;
					$scope.hakwonTeacherListTotCount	= colData.count;

					if (colData.count <= 0) {
						alert('검색결과가 없습니다.');
					}

				} else {
					commProto.logger({masterTeacherListAllError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/**
	 * 공지사항 작성시, 카테고리 리스트 조회
	 * @param $scope
	 */
	classService.noticeCateList = function($scope) {
		if (isNull($scope.hakwonNo)) {
			alert('학원 정보가 올바르지 않습니다.');
			return ;
		}
		CommUtil.ajax({url:contextPath+"/hakwon/noticeCateList.do", param:{hakwon_no: $scope.hakwonNo}, successFun:function(data) {
			try {
				if( data.error ) {
					alert('공지사항 카테고리 정보 조회를 실패 했습니다.');
					return ;
				}
				var colData = data.colData;
				if( colData.result == CommonConstant.Flag.success ) {
					$scope.noticeCateList = colData.noticeCateList;
				} else {
					alert('Server Response Error : ' + data.status);
					commProto.logger({noticeCateListError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/**
	 * 리플 삭제
	 */
	classService.replyDelete = function(reply_no, $scope) {
		if( window.confirm('리플을 삭제 하시겠습니까?') ) {
			CommUtil.ajax({url:contextPath+"/hakwon/reply/removeReply.do", param:{reply_no:reply_no}, successFun:function(data) {
				try {
					if( data.error ) {
						alert('리플 삭제를 실패 했습니다.');
						return false;
					}

					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						$scope.replyList = _.reject($scope.replyList, {reply_no : reply_no});
					} else {
						alert('리플 삭제를 실패 했습니다.');
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		}
	};

	/*	반의 알림발송 조회	*/
	classService.getUseAttPush = function($scope) {
		var hakwonNo = hakwonInfo.hakwon_no;
		var params = {hakwonNo:hakwonNo, classNo:$scope.classNo};

		CommUtil.ajax({url:contextPath+"/hakwon/attendance/class/push/get.do", param: params, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData ) {

					if(colData.useAttPush == 'Y') {
						$("input[name=useYnAttPush]").prop('checked', true);
					} else {
						$("input[name=useYnAttPush]").prop('checked', false);
					}

				} else {
					commProto.logger({hakwonNoticeListError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/*	반의 알림발송 상태값 변경	*/
	classService.pushStatusChangeFun = function($scope) {
		var hakwonNo = hakwonInfo.hakwon_no;
		var useAttPush = $("input[name=useYnAttPush]").is(':checked');

		var params = {hakwonNo:hakwonNo, classNo:$scope.classNo, useYnAttPush:useAttPush};

		CommUtil.ajax({url:contextPath+"/hakwon/attendance/class/push/active.do", param: params, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData ) {
					if(colData.flag != "success") {
						commProto.logger("알림발송 상태값 변경작업이 실패하였습니다.");
					}
				} else {
					commProto.logger({hakwonNoticeListError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	return classService;
});


/**
 * 반 상세정보 공통 컨트롤러
 */
hakwonMainApp.controller('classInfoDetailController', function($scope, $window, $location, $routeParams, classService, classFactory, CommUtil) {
	console.log('hakwonMainApp classInfoDetailController call');

	try {
		$("#wrapper").show();

		/*	$routeParams의 학원번호, 반번호 초기화		*/
		if (!isNull($routeParams.hakwon_no)) {
			$scope.hakwonNo = $routeParams.hakwon_no;
		} else if (!isNull(hakwonInfo.hakwon_no)) {
			$scope.hakwonNo = hakwonInfo.hakwon_no;
		}

		if (!isNull($routeParams.class_no)) {
			$scope.classNo = $routeParams.class_no;
		}

		/*	현재 페이지 url에 따라서 menuType 초기화	*/
		var location = window.location.hash;
		if (location.indexOf('notice') > 0) {
			$scope.menuType = 'notice';
		} else if (location.indexOf('student') > 0) {
			$scope.menuType = 'student';
		} else if (location.indexOf('parent') > 0) {
			$scope.menuType = 'parent';
		}

		$scope.classDetail				= {};
		$scope.classTeacherList			= [];
		$scope.classTeacherListTotCount = '';



		/*	출결알림 발송 여부 조회	*/
		classService.getUseAttPush($scope);

		$scope.pushStatusChangeFun = function() {
			classService.pushStatusChangeFun($scope);
		}

		/*	권한 체크 기능	*/
		$scope.checkAuthType = comm.checkAuthType;

		/*	반 상세정보 조회	*/
		$scope.getClassDetail = function() {
			classService.hakwonClassDetail($scope, $routeParams);
		};

		/*	반 삭제 기능	*/
		$scope.removeClass = function() {
			if (confirm($scope.classDetail.class_title + '을 정말로 삭제 하시겠습니까?')) {
				var params = {hakwon_no: $scope.hakwonNo, class_no: $scope.classDetail.class_no, class_title: $scope.classDetail.class_title};
				classService.masterHakwonClassDelete(params);
			}
		};

		/*	반 정보 변경	*/
		$scope.confirmEdit = function() {
			classService.masterHakwonClassUpdate($scope);
		};

		/*	선생님에게 메세지 보내기	*/
		$scope.sendMessageTeacher = function(item) {
			alert('준비중입니다.');
		};

		$scope.getFileFullPath = function() {
			return CommUtil.createFileFullPath($scope.classDetail.logo_file_path, 'class');
		};

		$scope.getPhotoFileFullPath = function(photo_file_path) {
			return CommUtil.createFileFullPath(photo_file_path, 'photo');
		};

		$scope.getUserGender = function(gender) {
			return CommUtil.createGenderName(gender);
		};

		/*	menuType에 따라서 페이지 이동처리	*/
		$scope.changeViewForType = function(menuType) {
			var sharpUrl = '';

			if (menuType == 'notice') {
				sharpUrl = PageUrl.common.classNoticeList;
			} else if (menuType == 'student') {
				sharpUrl = PageUrl.common.classStudentList;
			} else if (menuType == 'parent') {
				sharpUrl = PageUrl.common.classParentList;
			} else if (menuType == 'teacher') {
				sharpUrl = PageUrl.class.teacherList;
			}

			CommUtil.locationHref(sharpUrl, {class_no:$scope.classNo}, 'hakwon');
			return false
		};

		/*	반 상세정보 조회	*/
		$scope.getClassDetail();

		/*	출결 팝업 오픈	*/
		$scope.openAttendancePop = function(type){
			window.open('/hakwon/attendance/popup.do?popupType=' + type + '&hakwonNo=' + hakwonInfo.hakwon_no + '&classNo=' + $scope.classNo, 'window', 'toolbar=no,location=no,status=no,menubar=no');
		};


		/* 초기화 */
		$scope.$$postDigest(function(){
			console.log('classInfoDetailController $$postDigest call');

			/*	파일 업로드 객체 생성		*/
			if( comm.isAndroidUploader() ) {
				angular.element("input[data-act=class_logo_upload]").click(function() {
					delete window.uploadCallBack;
					window.uploadCallBack = function(uploadJsonStr) {
						try {
							var resultObj = JSON.parse(uploadJsonStr);
							if( resultObj.error ) {
								alert('파일 업로드를 실패 했습니다.');
							} else {
								var fileInfo = resultObj.colData;
								if (fileInfo.imageYn == 'Y') {
									$('img[data-view=class_logo_preview]').attr('src', HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.filePath).attr('data-file-no', fileInfo.fileNo);
								} else {
									alert('이미지 파일이 아닙니다.');
								}
							}
						} catch(e) {
							alert('파일 업로드를 실패 했습니다.');
						}
					};
					var param = {
						fileType : 'img'
						, multipleYn : 'N'
						, callBack : 'uploadCallBack'
						, upload : {
							url : window.location.protocol+'//'+window.location.host+uploadUrl
							, param : {
								uploadType : CommonConstant.File.TYPE_CLASS_LOGO
								, hakwonNo : $scope.hakwonNo
								, classNo : $scope.classNo
							}
							, cookie : document.cookie
						}
					};
					window.PLATFORM.fileChooser(JSON.stringify(param));

					return false;
				});
			} else {
				$scope.fileUploadObj = $("input[data-act=class_logo_upload]").html5_upload(classService.getFileUploadOptions($scope, CommonConstant.File.TYPE_CLASS_LOGO));
			}

			if( commProto.isResponsiveCheck() ) {
				$('div[data-view=classInfo]').hide();

				$('#mainNgView').on('click', 'div[data-toggle=classInfo]', function() {
					$('div[data-view=classInfo]').toggle();
				});
			}
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 반 리스트 컨트롤러
 */
hakwonMainApp.controller('classInfoListController', function($rootScope, $scope, $location, $routeParams, classService, CommUtil, $timeout) {
	console.log('hakwonMainApp classInfoListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.common.classList+'?hakwon_no='+hakwonInfo.hakwon_no, title:'반'}]);

		if (!isNull($routeParams.hakwon_no)) {
			$scope.hakwonNo = $routeParams.hakwon_no;
		} else if (!isNull(hakwonInfo.hakwon_no)) {
			$scope.hakwonNo = hakwonInfo.hakwon_no;
		}

		$scope.page					= 1;
		$scope.urlParams			= $routeParams;
		$scope.checkAuthType		= comm.checkAuthType;
		$scope.classList			= [];
		$scope.classListTotCount	= '';

		/*	반 등록 데이터	*/
		$scope.regClassInfo = {class_title:'', class_intro:'', class_order:''};

		/*	반 이름 검색 데이터	*/
		$scope.search_text = '';

		/*	반 리스트 조회	*/
		$scope.getClassList = function(pageNo) {
			if( !pageNo ) {
				pageNo = 1;
			}
			$scope.page = pageNo;
			var params = {
				hakwon_no		: $routeParams.hakwon_no
				, search_text	: $scope.search_text
				, page_no		: pageNo
			};
			classService.hakwonClassList(params, function(data) {
				try {
					if( data.error ) {
						alert('반 리스트 조회를 실패 했습니다.');
						return ;
					}

					var colData = data.colData;
					if (colData) {
						$scope.classList = colData.classList;
						$scope.classListTotCount = colData.classListTotCount;
						$scope.pageInfo = CommUtil.getPagenationInfo(colData.classListTotCount, colData.pageScale, DefaultInfo.pageScale, pageNo);
					} else {
						commProto.logger({hakwonClassListError: data});
					}

					$timeout(function() {
						$(document).scrollTop($('input[ng-model=search_text]').offset().top);
					},50);
				} catch (ex) {
					commProto.errorDump({errorObj: ex});
				}
			});
		};

		/*	페이지네이션 페이지 이동	*/
		$scope.movePage = function(page) {
			if ($scope.page === page) {
				return;
			}
			$scope.getClassList(page);
		};

		/*	반 등록	*/
		$scope.registClass = function() {
			classService.masterHakwonClassInsert($scope);
		};

		/*	반 상세정보로 이동	*/
		$scope.goClassNotice = function(classNo) {
			CommUtil.locationHref(PageUrl.common.classNoticeList, {class_no:classNo}, 'hakwon');
			return false;
		};

		$scope.getFileFullPath = function(logo_file_path) {
			return CommUtil.createFileFullPath(logo_file_path, 'class');
		};

		/*	반 공지사항 리스트 정보조회	*/
		$scope.getClassList();

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 반 공지사항 리스트
 */
hakwonMainApp.controller('classNoticeListController', function($scope, $location, $window, $routeParams, classService, classFactory, CommUtil) {
	console.log('hakwonMainApp classNoticeListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.common.classList+'?hakwon_no='+hakwonInfo.hakwon_no, title:'반'}, {url:'#', title:'공지'}]);

		$("#wrapper").show();

		/*	is Mobile	*/
		$scope.isMobile = isMobile.any();

		/*	데이터 초기화	*/
		$scope.page						= $routeParams.page;
		if( isNull($scope.page) ) {
			$scope.page = 1;
		}
		$scope.hakwonNo 				= '';
		$scope.classNo					= '';
		$scope.classDetail 				= {};
		$scope.classTeacherList 		= [];
		$scope.classTeacherListTotCount = '0';

		$scope.classNoticeList 			= [];
		$scope.classNoticeListTotCount	= '';

		/*	등록일 기준 신규 컨텐츠 체크 함수	*/
		$scope.isNewItem				= comm.isNewItem;

		/*	페이지네이션 페이지 이동	*/
		$scope.movePage = function(page) {
			$scope.page = page;
			$location.search('page', page);
			classService.classNoticeList($scope);
		};

		if (!isNull($routeParams.hakwon_no)) {
			$scope.hakwonNo = $routeParams.hakwon_no;
		} else if (!isNull(hakwonInfo.hakwon_no)) {
			$scope.hakwonNo = hakwonInfo.hakwon_no;
		}

		if (!isNull($routeParams.class_no)) {
			$scope.classNo = $routeParams.class_no;
		}

		/*	반 공지사항 리스트 조회	*/
		$scope.getClassNoticeList = function() {
			classService.classNoticeList($scope);
		};

		/*	반 공지사항 등록 이동		*/
		$scope.goClassNoticeEdit = function() {
			CommUtil.locationHref(PageUrl.class.noticeEdit, {class_no: $scope.classNo}, 'hakwon');
			return false;
		};

		/*	반 공지사항 상세보기로 이동	*/
		$scope.goClassNoticeDetail = function(noticeNo) {
			CommUtil.locationHref(PageUrl.common.classNoticeDetail, {notice_no:noticeNo, class_no:$routeParams.class_no, page:$scope.page}, 'hakwon');
			return false;
		};

		/*	반 공지사항 리스트 조회	*/
		$scope.movePage($scope.page);
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 반 공지사항 상세보기
 */
hakwonMainApp.controller('classNoticeDetailController', function($scope, $window, $location, $routeParams, classService, classFactory, CommUtil) {
	console.log('hakwonMainApp classNoticeDetailController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.common.classList+'?hakwon_no='+hakwonInfo.hakwon_no, title:'반'}, {url:'#', title:'공지'}, {url:'#', title:'상세'}]);

		/*	데이터 초기화	*/
		$scope.hakwonNo 			= '';
		$scope.classNo				= '';
		$scope.noticeNo 			= '';
		$scope.noticeDetail			= {};
		$scope.replyList			= [];
		$scope.fileList				= [];

		if (!isNull($routeParams.hakwon_no)) {
			$scope.hakwonNo = $routeParams.hakwon_no;
		} else if (!isNull(hakwonInfo.hakwon_no)) {
			$scope.hakwonNo = hakwonInfo.hakwon_no;
		}

		if (!isNull($routeParams.class_no)) {
			$scope.classNo = $routeParams.class_no;
		}

		if (!isNull($routeParams.notice_no)) {
			$scope.noticeNo = $routeParams.notice_no;
		}

		$scope.page = $routeParams.page;
		if( isNull($scope.page) ) {
			$scope.page = 1;
		}

		/*	댓글 입력 정보	*/
		$scope.replyInfo = {
			content_type		: '001',
			content_parent_no 	: $scope.noticeNo,
			reply_content		: '',
			title				: ''
		};

		$scope.userAuth = userAuth;

		/*	권한 체크 기능 원장일 경우 true	*/
		$scope.checkAuthType = comm.checkAuthType;

		/*	권한 체크 : 원장님 true, 선생님은 작성자일 경우 true */
		$scope.checkAuthTypeRegistUser = comm.checkAuthTypeRegistUser;

		/*	반 공지사항 상세정보 조회	*/
		$scope.getClassNoticeDetail = function() {
			classService.classNoticeDetail($scope);
		};

		/*	공지사항 삭제하기	*/
		$scope.removeNotice = function() {
			classService.deleteClassNotice($scope);
		};

		/*	댓글 등록	*/
		$scope.registReply = function() {
			classService.registReplyClassNotice($scope);
		};

		/*	첨부파일 이미지 경로 처리	*/
		$scope.getAttachFileFullPath = function(filePath, fileType) {
			if( !fileType ) fileType = 'attachment';
			return CommUtil.createFileFullPath(filePath, fileType);
		};

		/*	프로필 사진 경로 처리		*/
		$scope.getPhotoFileFullPath = function(filePath) {
			return CommUtil.createFileFullPath(filePath, 'photo');
		};

		/*	댓글 사용자 성별 처리	*/
		$scope.getUserGender = function(gender) {
			return CommUtil.createGenderName(gender);
		};

		/*	공지사항 수정으로 이동	*/
		$scope.goClassNoticeEdit = function() {
			CommUtil.locationHref(PageUrl.class.noticeEdit, {notice_no: $routeParams.notice_no, class_no:$routeParams.class_no}, 'hakwon');
			return false;
		};

		/*	공지사항 목록으로 이동	*/
		$scope.goClassNoticeList = function() {
			CommUtil.locationHref(PageUrl.common.classNoticeList, {class_no:$routeParams.class_no, page:$scope.page}, 'hakwon');
			return false;
		};

		/*	공지사항 상세보기로 다시 이동	*/
		$scope.goClassNoticeDetail = function() {
			CommUtil.locationHref(PageUrl.common.classNoticeDetail, {notice_no:$routeParams.notice_no, class_no:$routeParams.class_no}, 'hakwon');
			return false;
		};

		/*	리플 삭제	*/
		$scope.replyDelete = function(replyNo) {
			classService.replyDelete(replyNo, $scope);
		};

		/*	반 공지사항 상세정보조회	*/
		$scope.getClassNoticeDetail();

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 반 공지사항 작성 - 수정
 */
hakwonMainApp.controller('classNoticeEditController', function($scope, $location, $window, $routeParams, $timeout, classService, classFactory, CommUtil, $timeout) {
	console.log('hakwonMainApp classNoticeEditController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit({isScrollTop:false});

		$("#wrapper").show();

		$scope.CommUtil = CommUtil;

		/*	데이터 초기화	*/
		$scope.isNewNotice			= false;
		$scope.hakwonNo 			= '';
		$scope.classNo	 			= '';
		$scope.noticeNo 			= '';
		$scope.noticeDetail			= {};
		$scope.replyList			= [];
		$scope.fileList				= [];

		/*	공지사항 작성시, 카테고리 리스트	*/
		$scope.noticeCateList 		= [];
		$scope.noticeCateItem 		= '';

		/*	is Mobile	*/
		$scope.isMobile = isMobile.any();

		if (!isNull($routeParams.hakwon_no)) {
			$scope.hakwonNo = $routeParams.hakwon_no;
		} else if (!isNull(hakwonInfo.hakwon_no)) {
			$scope.hakwonNo = hakwonInfo.hakwon_no;
		}

		if (!isNull($routeParams.class_no)) {
			$scope.classNo = $routeParams.class_no;
		}

		/*	공지사항 번호가 존재하면, 공지사항 수정. or 공지사항 등록 처리		*/
		if (!isNull($routeParams.notice_no)) {
			$scope.noticeNo = $routeParams.notice_no;
		} else {
			$scope.isNewNotice = true;
		}

		/*	youtube 삽입	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=youtubeInsert]', function() {
			var youtubeID = $('#mainNgView').find('input[name=youtubeID]').val();

			var youtubeHtml = '<a href="http://www.youtube.com/watch?v='+youtubeID+'"><img src="http://img.youtube.com/vi/'+youtubeID+'/0.jpg" class="img-responsive" alt="" data-video="youtube" data-id="'+youtubeID+'" /></a>';
			tinymce.activeEditor.insertContent(youtubeHtml);
		});

		/*	파일 객체 초기화 및 데이터 호출		*/
		$scope.$$postDigest(function() {
			console.log('noticeEditController $$postDigest');

			/*	댓글 가능여부 switchery.js를 $scope로 바인딩 및 초기화	*/
			$scope.elem = document.querySelector('.js-switch');

			/*	반 공지사항 상세정보조회	*/
			$scope.getClassNoticeDetail();

			/*	공지사항 작성시, 카테고리 조회*/
			$scope.getNoticeCateList();

			$timeout(function() {
				/*	데이트 피커	*/
				$('#mainNgView input[name=reservationDate]').datepicker({
					keyboardNavigation: false,
					forceParse: false,
					autoclose: true,
					format: "yyyy-mm-dd"
				});

				if( isMobile.any() && $(window).width()< 1024 ) {
					$(document).scrollTop($('input[data-view=title]').offset().top);
				}
			},50);

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
								tempObj.mime_type	= fileInfo.mimeType;

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
							, param : {
								uploadType : CommonConstant.File.TYPE_NOTICE
								, hakwonNo : $scope.hakwonNo
								, classNo : $scope.classNo
							}
							, cookie : document.cookie
						}
					};
					window.PLATFORM.fileChooser(JSON.stringify(param));

					return false;
				});
			} else {
				$scope.fileUploadObj = angular.element("input[data-act=file_upload]").html5_upload(classService.getFileUploadOptions($scope, CommonConstant.File.TYPE_NOTICE));
			}
		});

		/*	공지사항 상세정보 조회	*/
		$scope.getClassNoticeDetail = function() {
			if ($scope.isNewNotice) {
				/*	신규 작성시 에디터 초기화 완료 후 공백 셋팅	*/
				var editOptions = comm.getEditorOptions();
				editOptions.setup = function (ed) {
					ed.on("init", function (ed) {
						tinymce.activeEditor.setContent(' ');
					}).on('KeyDown', function(e) {
						var thisEditor = this;
						var keyCode = undefined;
						if (e.keyCode) keyCode = e.keyCode;
						else if (e.which) keyCode = e.which;

						if(keyCode == 9 && !e.altKey && !e.ctrlKey) {
							if (e.shiftKey) {
								thisEditor.execCommand('Outdent');
							} else {
								thisEditor.execCommand('Indent');
							}

							return tinymce.dom.Event.cancel(e);
						}

					});
				};
				tinymce.init(editOptions);

				$scope.switchery = new Switchery($scope.elem, { color: '#1AB394' });
				return;
			}
			if (!$scope.isNewNotice && isNull($scope.noticeNo)) {
				alert('공지사항 정보가 올바르지 않습니다.');
				return ;
			}
			CommUtil.ajax({url:contextPath+"/hakwon/noticeDetail.do", param:{notice_no:$scope.noticeNo}, successFun:function(data) {
				try {
					if( data.error ) {
						alert('공지 조회를 실패 했습니다.');
						return ;
					}

					if ($scope.isNewNotice) {
						$scope.noticeDetail.content = ' ';
						tinymce.activeEditor.setContent($scope.noticeDetail.content);
						return;
					}
					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						if( colData.noticeDetail.reservation_date_2 ) {
							colData.noticeDetail.reservation_date_2 = new Date(colData.noticeDetail.reservation_date);
						}
						$scope.noticeDetail			= colData.noticeDetail;
						$scope.replyList			= colData.replyList;
						$scope.fileList				= colData.fileList;

						/*	신규 작성시 에디터 초기화 완료 후 공백 셋팅	*/
						var editOptions = comm.getEditorOptions();
						editOptions.setup = function(ed) {
							ed.on("init", function(ed) {
								if (!_.isUndefined(colData.noticeDetail.content) && colData.noticeDetail.content) {
									tinymce.activeEditor.setContent(colData.noticeDetail.content);
								} else {
									tinymce.activeEditor.setContent(' ');
								}
							}).on('KeyDown', function(e) {
								var thisEditor = this;
								var keyCode = undefined;
								if (e.keyCode) keyCode = e.keyCode;
								else if (e.which) keyCode = e.which;

								if(keyCode == 9 && !e.altKey && !e.ctrlKey) {
									if (e.shiftKey) {
										thisEditor.execCommand('Outdent');
									} else {
										thisEditor.execCommand('Indent');
									}

									return tinymce.dom.Event.cancel(e);
								}

							});
						};
						tinymce.init(editOptions);

						/*	댓글 가능여부 switchery.js를 $scope로 바인딩 및 초기화	*/
						if( $scope.elem ) {
							if ($scope.noticeDetail.reply_yn == 'N') {
								$scope.elem.checked = false;
							}
							$scope.switchery = new Switchery($scope.elem, { color: '#1AB394' });
						}
					} else {
						commProto.logger({noticeDetailError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/*	공지사항 카테고리 리스트 조회	*/
		$scope.getNoticeCateList = function() {
			classService.noticeCateList($scope);
		};

		/*	공지사항 카테고리 변경시 현재 제목 변경	*/
		$scope.changeNoticeCate = function() {
			var beforeTitle = !isNull($scope.noticeDetail.title) ? $scope.noticeDetail.title : '';
			$scope.noticeDetail.title = '[' + $scope.noticeCateItem.cate_name + '] ' + beforeTitle;
		};

		/*	공지사항 수정 및 등록 처리		*/
		$scope.editConfirm = function() {
			var apiUrl		= '',
				fileNoList	= _.pluck($scope.fileList, 'file_no'),
				params		= {};

			if (isNull($scope.classNo)) {
				alert('반 정보가 올바르지 않습니다.');
				return ;
			}
			if( isNull($scope.noticeDetail.title) ) {
				alert('제목을 입력해 주세요.');
				return ;
			}

			var reservationDate	= $('input[name=reservationDate]').val();
			var reservationTime	= $('input[name=reservationTime]').val();

			if( !isNull(reservationDate) || !isNull(reservationTime) ) {
				if( isNull(reservationDate) || isNull(reservationTime) ) {
					alert('예약 날짜와 시간이 정확하지 않습니다.');
					return ;
				}
			}

			if ($scope.isNewNotice) {
				if (userAuth.userType == '003') {
					apiUrl = '/hakwon/master/registClassNotice.do';
				} else if (userAuth.userType == '004') {
					apiUrl = '/hakwon/teacher/registClassNotice.do';
				}
			} else {
				if (userAuth.userType == '003') {
					apiUrl = '/hakwon/master/editNotice.do';
				} else if (userAuth.userType == '004') {
					apiUrl = '/hakwon/teacher/editClassNotice.do';
				}
			}

			var editContent = tinymce.activeEditor.getContent();
			editContent = editContent.replace(/><\/p>/g, ">&nbsp;</p>");

			params.class_no 		= $scope.classNo;
			params.notice_no 		= $scope.noticeNo;
			params.title 			= $scope.noticeDetail.title;
			params.content 			= editContent;
			params.file_no_list 	= fileNoList.toString();
			params.preview_content 	= params.content.substr(0, 50) + '...';
			params.reply_yn			= $scope.elem.checked ? 'Y' : 'N' ;

			params.reservationDate = reservationDate;
			params.reservationTime = reservationTime;

			CommUtil.ajax({url:contextPath+apiUrl, param:params, successFun:function(data) {
				try {
					if( data.error ) {
						alert('공지사항 저장을 실패 했습니다.');
						return ;
					}

					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						alert('공지사항이 저장되었습니다.');
						$scope.editCancel();
					} else {
						commProto.logger({noticeDetailError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/*	첨부파일 이미지 경로 처리	*/
		$scope.getAttachFileFullPath = function(filePath, fileType) {
			if( !fileType ) fileType = 'attachment';
			return CommUtil.createFileFullPath(filePath, fileType);
		};

		/*	첨부파일 10개 제한 처리	*/
		$scope.checkMaxFileCnt = function(e) {
			if ($scope.fileList.length >= 10) {
				alert('첨부파일은 10개까지만 등록이 가능합니다.');
				e.preventDefault();
				return false;
			}
		};

		/*	이미지 클릭시 에디터에 이미지 첨부	*/
		$scope.insertImageToEditor = function(filePath, fileNo) {
			var fullFilePath = $scope.getAttachFileFullPath(filePath);
			var strImage = '<a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" data-img-no="'+fileNo+'" class="img-responsive"></a>';
			tinymce.activeEditor.insertContent(strImage);
		};

		/*	비디오 삽입	*/
		$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div[data-file-type=video]', function() {
			var fileUrl = $(this).attr('data-file-url');
			var videoHtml = hakwonTmpl.common.videoHtml.replace('{{=videoUrl}}', fileUrl);
			tinymce.activeEditor.insertContent(videoHtml);
		});
		/*	오디오 삽입	*/
		$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div[data-file-type=audio]', function() {
			var fileUrl = $(this).attr('data-file-url');
			var audioHtml = '<p><audio src="'+fileUrl+'" preload="false" controls="true"></audio></p>';
			tinymce.activeEditor.insertContent(audioHtml);
		});

		/*	취소	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=reservationCancel]', function() {
			$('input[name=reservationDate]').val('');
			$('input[name=reservationTime]').val('');
		});

		/*	첨부 파일 삭제 처리	*/
		$scope.removeAttachFile = function(fileNo) {
			$scope.fileList = _.filter($scope.fileList, function(item) {
				return item.file_no != fileNo;
			});
		};

		/*	공지사항 등록 - 수정 취소	*/
		$scope.editCancel = function() {
			if ($scope.isNewNotice) {
				$window.location.href = PageUrl.common.classNoticeList+'?hakwon_no=' + $scope.hakwonNo + '&class_no=' + $scope.classNo;
				return false;
			} else {
				$window.location.href = PageUrl.common.classNoticeDetail+'?hakwon_no=' + $scope.hakwonNo + '&class_no=' + $scope.classNo + '&notice_no=' + $scope.noticeNo;
				return false;
			}
		};

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 반 학생 리스트
 */
hakwonMainApp.controller('classStudentListController', function($scope, $location, $window, $routeParams, classService, classFactory, CommUtil) {
	console.log('hakwonMainApp classStudentListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.common.classList+'?hakwon_no='+hakwonInfo.hakwon_no, title:'반'}, {url:'#', title:'학생'}]);

		/*	데이터 초기화	*/
		$scope.hakwonNo 				= '';
		$scope.classNo					= '';
		$scope.studentList 				= [];
		$scope.studentListTotCount 		= '0';
		$scope.classStudentList 		= [];
		$scope.classStudentListTotCount = '0';
		$scope.page						= 1;
		$scope.searchText				= '';
		$scope.classSearchText			= '';

		$scope.pageScale				= 10;
		$scope.pageScaleArray			= [10, 100, 200];

		if (!isNull($routeParams.hakwon_no)) {
			$scope.hakwonNo = $routeParams.hakwon_no;
		} else if (!isNull(hakwonInfo.hakwon_no)) {
			$scope.hakwonNo = hakwonInfo.hakwon_no;
		}

		if (!isNull($routeParams.class_no)) {
			$scope.classNo = $routeParams.class_no;
		}

		/*	반 소속 학생 리스트 조회		*/
		$scope.getClassStudentList = function(pageNo, searchText) {
			classService.classStudentList(pageNo, $scope.pageScale, $scope, searchText);
		};

		/*	학원내 학생 검색처리	*/
		$scope.searchStudent = function(studentName) {
			classService.hakwonStudentList(studentName, $scope);
		};

		/*	학생 검색 키처리	*/
		$scope.searchStudentEnter = function(e) {
			if (e && e.type === 'keydown' && e.keyCode !== 13) {
				return;
			}
			var studentName = ($scope.searchText||'').trim();
			$scope.searchStudent(studentName);
		};

		/*	학생이 이미 반에 소속되었는지 체크	*/
		$scope.checkClassStudent = function(item) {
			var studentObj = _.findWhere($scope.classStudentList, {user_no: item.user_no});
			return _.isUndefined(studentObj)
		};

		/*	학생 검색	*/
		$scope.searchStudentClick = function() {
			var studentName = ($scope.searchText||'').trim();
			$scope.searchStudent(studentName);
		};

		/*	등록 : 학생을 현재 반에 등록하기	*/
		$scope.addToClass = function(item) {
			classService.addStudentToClass(item, $scope);
		};

		/*	삭제! : 학생을 현재 반에서 삭제하기	*/
		$scope.removeToClass = function(item) {
			if( window.confirm('학생을 정말 삭제 하시겠습니까?') ) {
				classService.removeStudentFromClass(item, $scope);
			}
		};

		/*	전체 선택 boolean 값	*/
		$scope.isBoolean = false;

		/*	todo : 리스트 전체 체크	*/
		$scope.checkAllStudent = function() {
			$scope.isBoolean = $scope.isBoolean ? false : true;
			_.each($scope.classStudentList, function(item) {
				item.isSelected = $scope.isBoolean;
			});
		};

		/*	메세지 다건 발송	*/
		$scope.sendMessageList = function() {
			// 선택된 학생 리스트만 필터링
			var selectedStudentList = _.filter(_.clone($scope.classStudentList), function(item){
				return item.isSelected == true;
			});

			if (selectedStudentList.length <= 0) {
				alert('선택된 학생이 없습니다.');
				return false;
			} else {
				var targetUserArray = [];
				for(var i=0; i<selectedStudentList.length; i++) {
					targetUserArray.push(selectedStudentList[i].user_no);
				}

				if (userAuth.userType == '004') {
					window.location.href = PageUrl.message.teacherSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+targetUserArray.toString();
				} else {
					window.location.href = PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+targetUserArray.toString();
				}
			}
		};

		/*	단건 메세지 발송	*/
		$scope.sendMessage = function(item) {
			if (userAuth.userType == '004') {
				window.location.href = PageUrl.message.teacherSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+item.user_no;
			} else {
				window.location.href = PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+item.user_no;
			}
		};

		/*	페이지네이션 페이지 이동	*/
		$scope.movePage = function(page) {
			if ($scope.page === page) {
				return;
			}
			$scope.page = page;
			$scope.getClassStudentList($scope.page);
		};

		$scope.getFileFullPath = function(photoFile) {
			return CommUtil.createFileFullPath(photoFile, 'photo');
		};

		$scope.getUserGender = function(gender) {
			return CommUtil.createGenderName(gender);
		};

		/**
		 * 반 학생 검색
		 */
		$scope.classStudentSearch = function(e) {
			if( e ) {
				if (e && e.type === 'keydown' && e.keyCode !== 13) {
					return;
				}
			}

			$scope.page = 1;
			$scope.getClassStudentList($scope.page, $scope.classSearchText);
		}

		/*	반 소속 학생 리스트 조회		*/
		$scope.getClassStudentList($scope.page);

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 반 학부모 리스트
 */
hakwonMainApp.controller('classParentListController', function($scope, $location, $window, $routeParams, classService, classFactory, CommUtil) {
	console.log('hakwonMainApp classParentListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.common.classList+'?hakwon_no='+hakwonInfo.hakwon_no, title:'반'}, {url:'#', title:'학부모'}]);

		/*	초기화	*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('classParentListController $viewContentLoaded');

			/*	데이터 초기화	*/
			$scope.hakwonNo 				= '';
			$scope.classNo					= '';
			$scope.parentList 				= [];
			$scope.parentListTotCount 		= '0';
			$scope.classParentList 			= [];
			$scope.classParentListTotCount 	= '0';
			$scope.page						= 1;

			if (!isNull($routeParams.hakwon_no)) {
				$scope.hakwonNo = $routeParams.hakwon_no;
			} else if (!isNull(hakwonInfo.hakwon_no)) {
				$scope.hakwonNo = hakwonInfo.hakwon_no;
			}

			if (!isNull($routeParams.class_no)) {
				$scope.classNo = $routeParams.class_no;
			}

			/*	반 소속 학부모 리스트 조회		*/
			$scope.getParentList($scope.page);
		});

		/*	반 소속 학부모 리스트 조회		*/
		$scope.getParentList = function(pageNo) {
			//classService.hakwonParentList(pageNo, $scope);
			classService.classParentList(pageNo, $scope);
		};

		/*	전체 선택 boolean 값	*/
		$scope.isBoolean = false;

		/*	todo : 리스트 전체 체크	*/
		$scope.checkAllParent = function() {
			$scope.isBoolean = $scope.isBoolean ? false : true;
			_.each($scope.classParentList, function(item) {
				if( item.is_hakwon_member > 0 ) {
					item.isSelected = $scope.isBoolean;
				}
			});
		};

		/*	todo : 메세지 다건 발송	*/
		$scope.sendMessageList = function() {
			// 선택된 학부모만 리스트만 필터링
			var selectedParentList = _.filter(_.clone($scope.classParentList), function(item){
				return item.isSelected == true;
			});

			if (selectedParentList.length <= 0) {
				alert('선택된 학부모가 없습니다.');
				return false;
			} else {
				var targetUserArray = [];
				for(var i=0; i<selectedParentList.length; i++) {
					targetUserArray.push(selectedParentList[i].parent_user_no);
				}
				if (userAuth.userType == '004') {
					window.location.href = PageUrl.message.teacherSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+targetUserArray.toString();
				} else {
					window.location.href = PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+targetUserArray.toString();
				}
			}
		};

		// todo : 단건 메세지 발송
		$scope.sendMessage = function(item) {

			if( item.is_hakwon_member == 0 ) {
				alert('학원에 가입되지 않은 학부모 입니다.\n가입 요청 부탁드립니다.');
				return ;
			}

			if (userAuth.userType == '004') {
				window.location.href = PageUrl.message.teacherSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+item.parent_user_no;
			} else {
				window.location.href = PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+item.parent_user_no;
			}
		};

		/**
		 * 학부모 클릭시
		 */
		$scope.parentSelect = function(item) {
			if( item.is_hakwon_member == 0 ) {
				alert('학원에 가입되지 않은 학부모 입니다.\n가입 요청 부탁드립니다.');
				return ;
			}
			item.isSelected = !item.isSelected;
		}

		/*	페이지네이션 페이지 이동	*/
		$scope.movePage = function(page) {
			if ($scope.page === page) {
				return;
			}
			$scope.page = page;
			$scope.getParentList($scope.page);
		};

		$scope.getFileFullPath = function(photoFile) {
			return CommUtil.createFileFullPath(photoFile, 'photo');
		};

		$scope.getUserGender = function(gender) {
			return CommUtil.createGenderName(gender);
		};

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 반 선생님 리스트
 */
hakwonMainApp.controller('classTeacherListController', function($scope, $location, $window, $routeParams, classService, classFactory, CommUtil) {
	console.log('hakwonMainApp classTeacherListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		/*	데이터 초기화	*/
		$scope.hakwonNo 					= '';
		$scope.classNo						= '';
		$scope.page							= 1;
		$scope.searchText					= '';

		/*	반 선생님 리스트	*/
		$scope.teacherList 					= [];
		$scope.teacherListTotCount 			= '0';
		$scope.isTeachers					= false;

		/*	학원 선생님 검색 리스트	*/
		$scope.hakwonTeacherList 			= [];
		$scope.hakwonTeacherListTotCount 	= '0';

		if (!isNull($routeParams.hakwon_no)) {
			$scope.hakwonNo = $routeParams.hakwon_no;
		} else if (!isNull(hakwonInfo.hakwon_no)) {
			$scope.hakwonNo = hakwonInfo.hakwon_no;
		}

		if (!isNull($routeParams.class_no)) {
			$scope.classNo = $routeParams.class_no;
		}

		/*	반 소속 선생님 리스트		*/
		$scope.getClassTeacherList = function(pageNo) {
			classService.classTeacherList(pageNo, $scope);
		};

		/*	학원내 선생님 검색처리	*/
		$scope.searchTeacher = function(teacherName) {
			var params = {hakwon_no:$scope.hakwonNo, searchText: teacherName};
			$scope.prevParams = params;
			classService.searchHakwonTeacher(params, $scope);
		};

		/*	반 검색 키처리	*/
		$scope.searchTeacherEnter = function(e) {
			if (e && e.type === 'keydown' && e.keyCode !== 13) {
				return;
			}
			var teacherName = ($scope.searchText||'').trim();
			$scope.page = 1;
			$scope.searchTeacher(teacherName);
		};

		/*	학원 선생님 검색	*/
		$scope.searchTeacherClick = function() {
			var teacherName = ($scope.searchText||'').trim();
			$scope.page = 1;
			$scope.searchTeacher(teacherName);
		};

		/*	등록 : 반에 해당 선생님 추가	*/
		$scope.addTeacherClass = function(item) {
			var params = {};
			params.hakwon_no		= $scope.hakwonNo;
			params.class_no			= $scope.classNo;
			params.teacher_user_no	= item.user_no;

			if (isNull(params.teacher_user_no) || isNull(params.hakwon_no) || isNull(params.class_no) ) {
				alert('선생님 정보가 올바르지 않습니다.');
				return ;
			}
			CommUtil.ajax({url:contextPath+"/hakwon/master/insertClassTeacher.do", param:params, successFun:function(data) {
				try {
					if( data.error ) {
						alert('선생님 추가를 실패 했습니다.');
						return ;
					}
					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						alert('선생님이 추가 되었습니다.');
						$scope.getClassTeacherList($scope.page);
					} else {
						commProto.logger({insertClassTeacherError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/*	삭제 : 반에 해당 선생님 삭제		*/
		$scope.removeTeacherClass = function(item) {
			var params = {};
			params.hakwon_no		= $scope.hakwonNo;
			params.class_no			= $scope.classNo;
			params.teacher_user_no	= item.teacher_user_no;

			if (isNull(params.teacher_user_no) || isNull(params.hakwon_no) || isNull(params.class_no) ) {
				alert('선생님 정보가 올바르지 않습니다.');
				return ;
			}
			CommUtil.ajax({url:contextPath+"/hakwon/master/deleteClassTeacher.do", param:params, successFun:function(data) {
				try {
					if( data.error ) {
						alert('선생님 삭제를 실패 했습니다.');
						return ;
					}
					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						alert('반에서 선생님이 삭제 되었습니다.');
						$scope.getClassTeacherList($scope.page);
					} else {
						commProto.logger({deleteClassTeacherError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/*	선생님 담당과목 수정	*/
		$scope.editSubject = function(item) {
			var params = {};
			params.hakwon_no		= item.hakwon_no;
			params.teacher_user_no	= item.teacher_user_no;
			params.subject			= item.tempSubject;

			if (isNull(params.hakwon_no) || isNull(params.teacher_user_no)) {
				alert('선생님 정보가 올바르지 않습니다.');
				return;
			}
			CommUtil.ajax({url:contextPath+"/hakwon/master/updateTeacherSubject.do", param:params, successFun:function(data) {
				try {
					if( data.error ) {
						alert('담당과목 수정을 실패 했습니다.');
						return ;
					}
					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						alert('담당과목이 수정되었습니다.');
						$scope.getClassTeacherList($scope.page);
					} else {
						commProto.logger({updateTeacherSubjectError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/*	전체 선택 boolean 값	*/
		$scope.isBoolean = false;

		/*	todo : 리스트 전체 체크	*/
		$scope.checkAllTeacher = function() {
			$scope.isBoolean = $scope.isBoolean ? false : true;
			_.each($scope.teacherList, function(item) {
				item.isSelected = $scope.isBoolean;
			});
		};

		/*	todo : 메세지 다건 발송	*/
		$scope.sendMessageList = function() {
			alert('준비중');

			// 선택된 선생님만 리스트 필터링
			var selectedTeacherList = _.filter(_.clone($scope.teacherList), function(item){
				return item.isSelected == true;
			});

			if (selectedTeacherList.length <= 0) {
				alert('선택된 선생님이 없습니다.');
				return false;
			} else {

				/*	todo : 메세지 발송 페이지로 선생님 리스트 전송	*/

			}
		};

		// todo : 단건 메세지 발송
		$scope.sendMessage = function(item) {
			alert('메세지 보내기 준비중');
		};

		/*	페이지네이션 페이지 이동	*/
		$scope.movePage = function(page) {
			if ($scope.page === page) {
				return;
			}
			$scope.page = page;
			$scope.getClassTeacherList($scope.page);
		};

		/*	반에 등록된 선생님인지 체크	*/
		$scope.checkClassTeacher = function(item) {
			var teacherObj = _.findWhere($scope.teacherList, {teacher_user_no: item.user_no});
			return _.isUndefined(teacherObj)
		};

		$scope.getFileFullPath = function(photoFile) {
			return CommUtil.createFileFullPath(photoFile, 'photo');
		};

		$scope.getUserGender = function(gender) {
			return CommUtil.createGenderName(gender);
		};


		/*	반 소속 선생님 리스트		*/
		$scope.getClassTeacherList($scope.page);

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});