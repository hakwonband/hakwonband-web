hakwonMainApp.service('receiptService', function(CommUtil) {
	console.log('hakwonMainApp receiptService call');

	var receiptService = {};

	/*	학생 검색	*/
	receiptService.searchStudent = function($scope) {
		var $receiptParam = $('div.receiptInsert');

		var hakwonNo = hakwonInfo.hakwon_no;
		var studentName = $receiptParam.find('input[name=studentName]').val();

		if(isNull($scope.studentIdFromList) && isNull(studentName) ) {
			alert('이름을 입력해 주세요.');
			$receiptParam.find('input[name=studentName]').focus();
			return;
		}

		var params = {hakwonNo:hakwonNo, studentName:studentName, studentId:$scope.studentIdFromList};
		$scope.studentList = [];
		CommUtil.ajax({url:contextPath+"/hakwon/receipt/student/select.do", param:params, successFun:function(data) {
			if( data.error ) {
				alert('조회에 실패했습니다.');
				return false;
			}
			var students = data.colData.students;
			if(students && students.length > 0) {
				$scope.studentList = students;

				/*	학생별 리스트에서 요청받아서 등록페이지로 넘어온 경우..	*/
				if(!isNull($scope.studentIdFromList)) {
					$scope.st_no = students[0].user_no;
					$scope.st_name = students[0].user_name;
					$scope.st_id = students[0].user_id;

					receiptService.getReceiptMonth($scope);

					$('input[name=studentName]').val(students[0].user_name);

					$scope.$apply();
				}
			} else {
				alert("검색 결과가 없습니다.");
			}
		}});

	};


	/*	수납 등록	*/
	receiptService.insertReceipt = function($scope, $window) {
		var $receiptParam = $('div.receiptInsert');

		var hakwonNo		= hakwonInfo.hakwon_no;
		var studentNo		= $receiptParam.find('input[name=studentNo]').val();
		//var receiptDate		= $receiptParam.find('input[name=receiptDate]').val();
		var receiptDate		= $scope.receiptDate.yyyymmdd('-');
		var receiptType		= $receiptParam.find('select[name=receiptType]').val();
		var receiptAmount	= $receiptParam.find('input[name=receiptAmount]').val();
		var receiptMethod	= $receiptParam.find('select[name=receiptMethod]').val();
		var receiptDesc		= $receiptParam.find('textarea[name=receiptDesc]').val();
		var receiptMonth	= [];

		var checkedLength	= $("div.receipt-month input:checkbox:checked").length;

		var filter;
		for(var i=0,imax=checkedLength; i<imax; i++) {
			filter = $("div.receipt-month input:checkbox:checked")[i].value;
			if(!isNaN(filter)) {
				receiptMonth.push(filter);
			}
		}

		if( isNull(studentNo) ) {
			alert('학생을 검색해주세요.');
			$receiptParam.find('input[name=studentName]').focus();
			return;
		}
		if( isNull(receiptDate) ) {
			alert('수납 날짜를 입력해 주세요.');
			$receiptParam.find('input[name=receiptDate]').focus();
			return;
		}
		if( isNull(receiptAmount) || isNaN(receiptAmount)) {
			alert('수납금액은 숫자만 입력 가능합니다.');
			$receiptParam.find('input[name=receiptAmount]').focus();
			return;
		}
/*
		if(receiptMonth.length < 1) {
			alert('수납월은 하나 이상 체크해야합니다.');
			return;
		}
*/
		var params = {
			hakwonNo:hakwonNo, studentNo:studentNo, receiptAmount:receiptAmount, receiptType:receiptType
			, receiptMethod:receiptMethod, receiptDesc:receiptDesc, receiptDate:receiptDate, receiptMonth:receiptMonth
		};

		CommUtil.ajax({url:contextPath+"/hakwon/receipt/insert.do", param:params, successFun:function(data) {
			if( data.error ) {
				alert('실패하였습니다.');
				return false;
			}
			var flag = data.colData.flag;
			if("success" == flag) {
//				if(confirm("등록되었습니다. 이어서 등록 하시겠습니까?")) {
//					//$("div.receiptInsert input").reset();
//
//					$window.location.href = PageUrl.receipt.insert + '?hakwonNo=' + hakwonInfo.hakwon_no;
//				} else {
//					$window.location.href = PageUrl.receipt.list+'?hakwon_no=' + hakwonInfo.hakwon_no;
//				}
				/*	리스트로 이동	*/
				$window.location.href = PageUrl.receipt.list+'?hakwon_no=' + hakwonInfo.hakwon_no;
			} else {
				alert("실패하였습니다.");
			}
		}});

	};


	/*	수납 리스트 조회	*/
	receiptService.getReceiptList = function($scope, $location) {

		var $receiptParam	= $('div.receiptList');
		var hakwonNo		= hakwonInfo.hakwon_no;
		var classNo			= $receiptParam.find('select[name=classNo]').val();
		var searchType		= $receiptParam.find('select[name=searchType]').val();
		var searchText		= $receiptParam.find('input[name=searchText]').val();
		var startDate		= $receiptParam.find('input[name=startDate]').val();
		var endDate			= $receiptParam.find('input[name=endDate]').val();
		var receiptType		= $receiptParam.find('select[name=receiptType]').val();
		var receiptMethod	= $receiptParam.find('select[name=receiptMethod]').val();
		var dateTerm		= $scope.dateTerm;

		var params = {
			hakwonNo:hakwonNo, pageNo:$scope.pageNo, searchType:searchType, searchText:searchText
			, startDate:startDate, endDate:endDate, classNo:classNo
			, dateTerm:dateTerm, receiptType:receiptType
			, receiptMethod:receiptMethod
		};
		CommUtil.ajax({url:contextPath+"/hakwon/receipt/list.do", param: params, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData ) {
					if( colData.receiptList && colData.receiptList.length > 0 ) {
						for(var i=0; i<colData.receiptList.length; i++) {
							var loopData = colData.receiptList[i];
							loopData.receipt_desc = loopData.receipt_desc.replace(/(?:\r\n|\r|\n)/g, '<br />');

							colData.receiptList[i] = loopData;
						}
						$scope.receiptList			= colData.receiptList;
					} else {
						$scope.receiptList			= [];
					}
					$scope.receiptListTotCount	= colData.receiptCount;
					$scope.startDate			= colData.startDate;
					$scope.endDate				= colData.endDate;
					$scope.receiptCount			= colData.receiptCount;

					$scope.inAndOutMoneySumList	= colData.inAndOutMoneySumList;

					var pageHtml = generatePage(colData.pageNo, colData.receiptCount, colData.pageScale, 5);
					$("#eg-custom-paging").html(pageHtml);
				} else {
					commProto.logger({hakwonNoticeListError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	receiptService.receiptExcelSave = function($scope) {

		var $receiptParam	= $('div.receiptList');
		var hakwonNo		= hakwonInfo.hakwon_no;
		var classNo			= $receiptParam.find('select[name=classNo]').val();
		var searchType		= $receiptParam.find('select[name=searchType]').val();
		var searchText		= $receiptParam.find('input[name=searchText]').val();
		var startDate		= $receiptParam.find('input[name=startDate]').val();
		var endDate			= $receiptParam.find('input[name=endDate]').val();
		var receiptType		= $receiptParam.find('select[name=receiptType]').val();
		var receiptMethod	= $receiptParam.find('select[name=receiptMethod]').val();
		var dateTerm		= $scope.dateTerm;

		var form = $("<form id='excelframe' style='width:0;height:0;border:none;display:none;' />").attr({
			method: "post"
			, action: contextPath+"/hakwon/receipt/listExcel.do"
			, target: "_blank"
		});

		form.append($("<input/>").attr({name:"hakwonNo",	value:hakwonNo}));
		if( $scope.pageNo )	form.append($("<input/>").attr({name : "pageNo",		value : $scope.pageNo}));
		if( searchType )	form.append($("<input/>").attr({name : "searchType",	value : searchType}));
		if( searchText )	form.append($("<input/>").attr({name : "searchText",	value : searchText}));
		if( startDate )		form.append($("<input/>").attr({name : "startDate",		value : startDate}));
		if( endDate )		form.append($("<input/>").attr({name : "endDate",		value : endDate}));
		if( classNo )		form.append($("<input/>").attr({name : "classNo",		value : classNo}));
		if( dateTerm )		form.append($("<input/>").attr({name : "dateTerm",		value : dateTerm}));
		if( receiptType )	form.append($("<input/>").attr({name : "receiptType",	value : receiptType}));
		if( receiptMethod )	form.append($("<input/>").attr({name : "receiptMethod",	value : receiptMethod}));

		$("body").append(form);
		form.submit();
	};

	/*	일년간의 수납 리스트 조회	*/
	receiptService.getReceiptYearList = function($scope) {
		var $receiptParam	= $('div.receiptYearList');
		var hakwonNo		= hakwonInfo.hakwon_no;
		var classNo			= $receiptParam.find('select[name=classNo]').val();
		var searchType		= $receiptParam.find('select[name=searchType]').val();
		var searchText		= $receiptParam.find('input[name=searchText]').val();
		var startDate		= $receiptParam.find('input[name=startDate]').val();
		var endDate			= $receiptParam.find('input[name=endDate]').val();
		var registDay		= $receiptParam.find('select[name=registDay]').val();
		var dateTerm		= $scope.dateTerm;
		var searchYear		= $scope.searchYear;

		var params = {
			hakwonNo:hakwonNo, pageNo:$scope.pageNo, searchType:searchType, searchText:searchText
			, startDate:startDate, endDate:endDate, classNo:classNo, dateTerm:dateTerm, registDay:registDay
			, searchYear:searchYear
		};
		CommUtil.ajax({url:contextPath+"/hakwon/receipt/list/year.do", param: params, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData ) {
					$scope.receiptList			= colData.receiptList;
					$scope.receiptListTotCount	= colData.studentCount;
					$scope.startDate			= colData.startDate;
					$scope.endDate				= colData.endDate;
					$scope.studentCount			= colData.studentCount;

					var pageHtml = generatePage(colData.pageNo, colData.studentCount, colData.pageScale, 5);
					$("#eg-custom-paging").html(pageHtml);
				} else {
					commProto.logger({hakwonNoticeListError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/*	일년간의 수납 리스트 엑셀 저장	*/
	receiptService.receiptYearExcelSave = function($scope) {
		var $receiptParam	= $('div.receiptYearList');
		var hakwonNo		= hakwonInfo.hakwon_no;
		var classNo			= $receiptParam.find('select[name=classNo]').val();
		var searchType		= $receiptParam.find('select[name=searchType]').val();
		var searchText		= $receiptParam.find('input[name=searchText]').val();
		var startDate		= $receiptParam.find('input[name=startDate]').val();
		var endDate			= $receiptParam.find('input[name=endDate]').val();
		var registDay		= $receiptParam.find('select[name=registDay]').val();
		var dateTerm		= $scope.dateTerm;
		var searchYear		= $scope.searchYear;

		var form = $("<form id='excelframe' style='width:0;height:0;border:none;display:none;' />").attr({
			method: "post"
			, action: contextPath+"/hakwon/receipt/list/yearExcel.do"
			, target: "_blank"
		});

		form.append($("<input/>").attr({name:"hakwonNo",	value:hakwonNo}));
		if( $scope.pageNo )	form.append($("<input/>").attr({name : "pageNo",	value : $scope.pageNo}));
		if( searchType )	form.append($("<input/>").attr({name : "searchType",value : searchType}));
		if( searchText )	form.append($("<input/>").attr({name : "searchText",value : searchText}));
		if( startDate )		form.append($("<input/>").attr({name : "startDate",	value : startDate}));
		if( endDate )		form.append($("<input/>").attr({name : "endDate",	value : endDate}));
		if( classNo )		form.append($("<input/>").attr({name : "classNo",	value : classNo}));
		if( dateTerm )		form.append($("<input/>").attr({name : "dateTerm",	value : dateTerm}));
		if( registDay )		form.append($("<input/>").attr({name : "registDay",	value : registDay}));
		if( searchYear )	form.append($("<input/>").attr({name : "searchYear",value : searchYear}));

		$("body").append(form);
		form.submit();
	}


	/*	반 리스트 조회	*/
	receiptService.getClassList = function($scope) {

		var hakwonNo = hakwonInfo.hakwon_no;

		var params = {hakwonNo:hakwonNo};
		CommUtil.ajax({url:contextPath+"/hakwon/receipt/class/list.do", param: params, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData ) {
					$scope.classList = colData.classList;
				} else {
					commProto.logger({hakwonNoticeListError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/*	수납 상세조회	*/
	receiptService.getReceiptDetail = function($scope) {
		var params = {receiptNo : $scope.receiptNo};

		CommUtil.ajax({url:contextPath+"/hakwon/receipt/detail.do", param: params, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData ) {
					$scope.receiptNo		= colData.receipt_no;
					$scope.studentNo		= colData.student_no;
					$scope.st_name			= colData.user_name;
					$scope.st_id			= colData.user_id;
//					$scope.receiptDate		= colData.receipt_date;
					$scope.receiptDate		= Date.parse(colData.receipt_date);
					$scope.receiptAmount	= colData.receipt_amount;
					$scope.receiptDesc		= colData.receipt_desc;
					$scope.regDate			= colData.reg_date;
					$scope.regUserNo		= colData.reg_user_no;
					$scope.photoPath		= colData.user_photo_path;
					$scope.isWonjang		= colData.isWonjang;


					$('select[name=receiptType] option[value='+colData.receipt_type+']').attr("selected", "true");
					$('select[name=receiptMethod] option[value='+colData.receipt_method+']').attr("selected", "true");


					var html = '';
					var dataList = colData.receiptList;
					for(var i=0,imax=dataList.length; i<imax; i++) {
						if(i != 0 && i != 6) html += ' , ';

						if(i == 6) html += '<br>';

						if(isNull(dataList[i].boolean)) {
							$scope.enableList.push(i);		// 수정 버튼을 눌렀을때, enable시킬 checkBox list
							html += '&nbsp; ' + dataList[i].receipt_month + ' <input type="checkbox" class="receipt_class_'+i+'" value="'+dataList[i].receipt_month+'">';
						} else {	// 이미 수납완료한 날짜
							if(dataList[i].boolean == 'true') {		// 다른 수납에서 등록한 월
								html += '&nbsp; ' + dataList[i].receipt_month + ' <input type="checkbox" class="receipt_class_'+i+'" checked="checked" disabled>';
							} else if(dataList[i].boolean == 'false') {	// 현재의 수납에서 등록한 월
								$scope.enableList.push(i);		// 수정 버튼을 눌렀을때, enable시킬 checkBox list
								$scope.oldReceiptMonth.push(dataList[i].receipt_month);
								html += '&nbsp; <span style="color:blue;">' + dataList[i].receipt_month + '</span>&nbsp;<input type="checkbox" class="receipt_class_'+i+'" checked="checked" value="'+dataList[i].receipt_month+'">';
							}
						}
					}
					$("#mainNgView div[name=receiptList]").append(html);
				} else {
					alert("수납내용 조회에 실패 했습니다.");
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});

	};


	/*	수납 내용 수정	*/
	receiptService.updateReceipt = function($scope, $window) {
		var $receiptParam = $('div.receiptDetail');

		var receiptNo		= $scope.receiptNo;
		var studentNo		= $scope.studentNo;
		var receiptDate		= $receiptParam.find('input[name=receiptDate]').val();
		var receiptType		= $receiptParam.find('select[name=receiptType]').val();
		var receiptAmount	= $receiptParam.find('input[name=receiptAmount]').val();
		var receiptMethod	= $receiptParam.find('select[name=receiptMethod]').val();
		var receiptDesc		= $receiptParam.find('textarea[name=receiptDesc]').val();
		var receiptMonthHashChanged = true;

		var checkedLength = $("div[name=receiptList] input:checkbox:checked").length;
		$scope.newReceiptMonth.length = 0;		// 초기화
		var filter;
		for(var i=0,imax=checkedLength; i<imax; i++) {
			filter = $("div[name=receiptList] input:checkbox:checked")[i].value;
			if(!isNaN(filter)) {	// 숫자일때
				if(!$("div[name=receiptList] input:checkbox:checked")[i].disabled) {		// 디스에이블이 아닐때
					$scope.newReceiptMonth.push(filter);
				}
			}
		}

		/*	receipt month 값이 변경되었는지 확인	*/
		if($scope.oldReceiptMonth.length == $scope.newReceiptMonth.length) {
			receiptMonthHashChanged = false;
			for(var i=0,imax=$scope.oldReceiptMonth.length; i<imax; i++) {
				if($scope.oldReceiptMonth[i] != $scope.newReceiptMonth[i]) {
					receiptMonthHashChanged = true;		// receipt month 값이 변경되었음. update 할때 receipt month 데이터도 같이 변경해야함.
				}
			}
		}

		if( isNull(receiptDate) ) {
			alert('수납 날짜를 입력해 주세요.');
			$receiptParam.find('input[name=receiptDate]').focus();
			return;
		}
		if( isNull(receiptAmount) || isNaN(receiptAmount)) {
			alert('수납금액은 숫자만 입력 가능합니다.');
			$receiptParam.find('input[name=receiptAmount]').focus();
			return;
		}

		var params = {
			receiptNo:receiptNo, studentNo:studentNo, receiptAmount:receiptAmount, receiptType:receiptType, receiptMonthHashChanged:receiptMonthHashChanged
			, receiptMethod:receiptMethod, receiptDesc:receiptDesc, receiptDate:receiptDate, receiptMonth:$scope.newReceiptMonth, hakwonNo:hakwonInfo.hakwon_no
		};
		CommUtil.ajax({url:contextPath+"/hakwon/receipt/update.do", param:params, successFun:function(data) {
			if( data.error ) {
				alert('실패하였습니다.');
				return false;
			}
			var flag = data.colData.flag;
			if("success" == flag) {
				window.location.href = PageUrl.receipt.list + '?hakwonNo=' + hakwonInfo.hakwon_no;
			} else {
				alert("실패하였습니다.");
			}
		}});

	};


	/*	수납 삭제	*/
	receiptService.deleteReceipt = function($scope, $window) {
		if(confirm("해당 수납을 삭제 하겠습니까?")) {

			var $receiptParam = $('div.receiptDetail');

			var receiptNo = $scope.receiptNo;
			var studentNo = $scope.studentNo;
			var receiptDate = $receiptParam.find('input[name=receiptDate]').val();
			var receiptType = $receiptParam.find('select[name=receiptType]').val();
			var receiptAmount = $receiptParam.find('input[name=receiptAmount]').val();
			var receiptMethod = $receiptParam.find('select[name=receiptMethod]').val();
			var receiptDesc = $receiptParam.find('textarea[name=receiptDesc]').val();

			var params = {
					receiptNo:receiptNo, studentNo:studentNo, receiptAmount:receiptAmount, receiptType:receiptType
					, receiptMethod:receiptMethod, receiptDesc:receiptDesc, receiptDate:receiptDate
			};

			CommUtil.ajax({url:contextPath+"/hakwon/receipt/delete.do", param:params, successFun:function(data) {
				if( data.error ) {
					alert('실패하였습니다.');
					return false;
				}
				var flag = data.colData.flag;
				if("success" == flag) {
					$window.location.href = PageUrl.receipt.list+'?hakwon_no=' + hakwonInfo.hakwon_no;
				} else {
					alert("실패하였습니다.");
				}
			}});
		}

	};

	/*	학생의 월별 수납 현황 조회	*/
	receiptService.getReceiptMonth = function($scope) {

		var hakwonNo = hakwonInfo.hakwon_no;

		var params = {hakwonNo:hakwonNo, studentNo:$scope.st_no};
		CommUtil.ajax({url:contextPath+"/hakwon/receipt/student/month/get.do", param: params, successFun:function(data) {
			try {
				var dataList = data.colData.dataList;
				if(dataList) {
					var html = ' ';
					for(var i=0,imax=dataList.length; i<imax; i++) {
						if(i != 0 && i != 6) html += ' , ';
						if(i == 6) html += '<br>';
						if(isNull(dataList[i].boolean)) {
							html += '&nbsp; ' + dataList[i].receipt_month + ' <input type="checkbox" value="'+dataList[i].receipt_month+'">';
						} else {	// 이미 수납완료한 날짜
							html += '&nbsp; <span style="color:blue;">' + dataList[i].receipt_month + '</span> <input type="checkbox" checked="checked" disabled>';
						}
					}

					$("div.receipt-month").children().remove();
					$("div.receipt-month").html('');
					$("div.receipt-month").append(html);
				} else {
					commProto.logger({hakwonNoticeListError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};



	return receiptService;
});


/**
 * 수납 등록 컨트롤러
 */
hakwonMainApp.controller('receiptController', function($scope, $location, $routeParams, $filter, $window, receiptService, CommUtil) {
	console.log('hakwonMainApp receiptController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.receipt.insert+'?hakwon_no='+hakwonInfo.hakwon_no, title:'수납'}, {url:'#', title:'수납 등록'}]);

		/*	데이터 초기화	*/
		$scope.studentList = [];
		$scope.st_name = "";
		$scope.st_id = "";
		$scope.st_no = "";
		//$scope.receiptDate = $filter('date')(new Date(), 'yyyy-MM-dd');
		$scope.receiptDate = new Date();
		$scope.studentIdFromList = "";

		/*	학생별 리스트로부터 studentId를 달고 호출되었을때	*/
		$scope.studentIdFromList = $routeParams.studentId;
		if(!isNull($scope.studentIdFromList)) {
			receiptService.searchStudent($scope);
		}



		/*	학생 이름 검색 데이터	*/
		$scope.searchOptions = {student_name: ""};

		/*	학생 검색	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=studentSearch]', function() {
			receiptService.searchStudent($scope);
		});

		/*	학생 검색 키처리	*/
		$scope.searchStudentEnter = function(e) {
			if (e && e.type === 'keydown' && e.keyCode !== 13) {
				return;
			}
			//var hakwonNo = hakwonInfo.hakwon_no;
			//var studentNo = $receiptParam.find('input[name=studentNo]').val();

			receiptService.searchStudent($scope);
		};

		$scope.getPhotoFileFullPath = function(photo_file_path) {
			return CommUtil.createFileFullPath(photo_file_path, 'photo');
		};

		$scope.getUserGender = function(gender) {
			return CommUtil.createGenderName(gender);
		};

		/*	학생 선택	*/
		$('#mainNgView').on(clickEvent, 'div.receiptInsert ul.find_student_result li', function() {
			$scope.st_no = $(this).attr("st-no");
			$scope.st_name = $(this).attr("st-name");
			$scope.st_id = $(this).attr("st-id");

			receiptService.getReceiptMonth($scope);
			$scope.$apply();
		});


		/*	수납 등록	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=receiptInsert]', function() {
			receiptService.insertReceipt($scope, $window);
		});


		/*	수납 취소	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=receiptInsertCancel]', function() {
			window.history.go(-1);
		});


	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 수납 리스트 컨트롤러
 */
hakwonMainApp.controller('receiptListController', function($scope, $location, $window, $routeParams, receiptService, CommUtil) {
	console.log('hakwonMainApp receiptListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.receipt.list+'?hakwon_no='+hakwonInfo.hakwon_no, title:'수납'}, {url:'#', title:'기간별 수납 리스트'}]);

		$scope.classList			= [];		// 반 리스트
		$scope.receiptList			= [];		// 수납 리스트
		$scope.receiptListTotCount	= 0;		// 수납리스트 전체 카운트
		$scope.pageNo				= 1;		// 현재 페이지 번호
		$scope.startDate			= "";
		$scope.endDate				= "";
		$scope.dateTerm				= "";
		$scope.receiptCount			= 0;
		$scope.inputMoney			= 0;		// 기간내 입금 총액
		$scope.outputMoney			= 0;		// 기간내 출금 총액


		/*	반 리스트 조회	*/
		receiptService.getClassList($scope);

		/*	수납 리스트 조회	*/
		receiptService.getReceiptList($scope, $location);

		$scope.getPhotoFileFullPath = function(photo_file_path) {
			return CommUtil.createFileFullPath(photo_file_path, 'photo');
		};

		/*	수납 검색	*/
		$scope.receiptSearch = function() {
			$scope.dateTerm = '';
			receiptService.getReceiptList($scope, $location);
		}

		/**
		 * 엑셀 저장
		 */
		$scope.excelSave = function() {
			receiptService.receiptExcelSave($scope);
		}

		/*	수납 검색 키처리	*/
		$scope.searchReceiptEnter = function(e) {
			if (e && e.type === 'keydown' && e.keyCode !== 13) {
				return;
			}
			var searchText = $('div.receiptList input[name=searchText]').val();
			if(isNull(searchText)) {
				alert("검색 할 내용이 없습니다.");
				return;
			}
			$scope.dateTerm = '';
			receiptService.getReceiptList($scope, $location);
		};

		/*	기간 검색 버튼	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=searchTerm]', function() {
			$scope.dateTerm = $(this).attr("data-value");
			receiptService.getReceiptList($scope, $location);
		});


		/*	페이지 선택	*/
		$("#eg-custom-paging").off("click", "button").on("click", "button", function(e) {
			$scope.pageNo = $(this).attr("current-page");
			receiptService.getReceiptList($scope, $location);
		});


		$scope.content_view = function(receipt_no) {
			$('div[data-view=receipt_desc]').each(function(idx) {
				var item = this;
				if( $(item).data('id') == receipt_no ) {
					$(item).css('height', 'auto');
				} else {
					$(item).css('height', '1em');
				}
			});
		}

		/*	수정으로 이동	*/
		$scope.modifyView = function(receipt_no) {
			$window.location.href = PageUrl.receipt.detail + '?hakwon_no=' + hakwonInfo.hakwon_no + '&receipt_no=' + receipt_no;
		};

		/*	학생 상세보기	*/
		$('#mainNgView').on(clickEvent, 'tbody tr td a', function() {
			$window.location.href = PageUrl.common.studentView + '?hakwon_no=' + hakwonInfo.hakwon_no + '&studentUserNo=' + $(this).attr("student-no");
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 학생별 일년간의 수납리스트 컨트롤러
 */
hakwonMainApp.controller('receiptYearListController', function($scope, $location, $window, $routeParams, receiptService, CommUtil) {
	console.log('hakwonMainApp receiptYearListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.receipt.listYear+'?hakwon_no='+hakwonInfo.hakwon_no, title:'수납'}, {url:'#', title:'학생별 수납 리스트'}]);

		$scope.classList 			= [];		// 반 리스트
		$scope.receiptList 			= [];		// 수납 리스트
		$scope.receiptListTotCount	= 0;		// 수납리스트 전체 카운트
		$scope.pageNo = 1;						// 현재 페이지 번호
		$scope.startDate = "";
		$scope.endDate = "";
		$scope.dateTerm = "";
		$scope.studentCount = 0;

		$scope.searchYear = new Date().getFullYear();


		$scope.dayList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];		// 학생 등록일 리스트 (1 ~ 31 일까지)

		/*	학윈 리스트 조회	*/
		receiptService.getClassList($scope);

		/*	수납 리스트 조회	*/
		receiptService.getReceiptYearList($scope);

		$scope.getPhotoFileFullPath = function(photo_file_path) {
			return CommUtil.createFileFullPath(photo_file_path, 'photo');
		};

		/*	수납 검색	*/
		$scope.receiptSearch = function() {
			receiptService.getReceiptYearList($scope, $location);
		}

		/**
		 * 엑셀 저장
		 */
		$scope.excelSave = function() {
			receiptService.receiptYearExcelSave($scope);
		}

		/*	수납 검색 키처리	*/
		$scope.searchReceiptEnter = function(e) {
			if (e && e.type === 'keydown' && e.keyCode !== 13) {
				return;
			}
			var searchText = $('div.receiptYearList input[name=searchText]').val();
			if(isNull(searchText)) {
				alert("검색 할 내용이 없습니다.");
				return;
			}
			receiptService.getReceiptYearList($scope, $location);
		};


		/*	학생 선택후, 수납 등록 페이지이동	*/
		$('#mainNgView').on(clickEvent, 'tbody tr td[name=registDay]', function() {
			$window.location.href = PageUrl.receipt.insert + '?hakwonNo=' + hakwonInfo.hakwon_no + '&studentId=' + $(this).attr("st-id");
		});



		/*	기간 검색 버튼	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=searchTerm]', function() {
			$scope.dateTerm = $(this).attr("data-value");
			receiptService.getReceiptYearList($scope, $location);
		});


		/*	페이지 선택	*/
		$("#eg-custom-paging").off("click", "button").on("click", "button", function(e) {
			$scope.pageNo = $(this).attr("current-page");
			receiptService.getReceiptYearList($scope, $location);
		});


		/*	학생 상세보기	*/
		$('#mainNgView').on(clickEvent, 'tbody tr td a', function() {
			$window.location.href = PageUrl.common.studentView + '?hakwon_no=' + hakwonInfo.hakwon_no + '&studentUserNo=' + $(this).attr("student-no");
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/*	수납 상세보기	*/
hakwonMainApp.controller('receiptDetailController', function($scope, $location, $window, $routeParams, receiptService, CommUtil) {
	console.log('hakwonMainApp receiptDetailController call');

	try {

		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.receipt.detail+'?hakwon_no='+hakwonInfo.hakwon_no, title:'수납'}, {url:'#', title:'수납 수정'}]);

		$scope.receiptNo = $routeParams.receipt_no;
		$scope.studentNo = "";
		$scope.st_name = "";
		$scope.st_id = "";
		$scope.receiptDate = "";
		$scope.receiptAmount = "";
		$scope.receiptDesc = "";
		$scope.regDate = "";
		$scope.photoPath = "";
		$scope.oldReceiptMonth = [];
		$scope.newReceiptMonth = [];
		$scope.enableList = [];

		$scope.userAuth = userAuth;


		/*	수납 상세 조회	*/
		receiptService.getReceiptDetail($scope);

		$scope.getPhotoFileFullPath = function(photo_file_path) {
			return CommUtil.createFileFullPath(photo_file_path, 'photo');
		};

		$("div.receiptDetail input").removeAttr("readonly");
		$("div.receiptDetail textarea").removeAttr("readonly");
		$("div.receiptDetail select").removeAttr("disabled");

		$("button[data-act=receiptUpdate]").css("display", "");
		$("button[data-act=receiptUpdateCancel]").css("display", "");
		$("button[data-act=receiptUpdateView]").css("display", "none");

		for(var i=0,imax=$scope.enableList.length; i<imax; i++) {
			$("div[name=receiptList] input.receipt_class_" + $scope.enableList[i]).removeAttr("disabled");
		}

		/*	학생 상세보기	*/
		$('#mainNgView').on(clickEvent, 'div[name=studentDetail] a', function() {
			$window.location.href = PageUrl.common.studentView + '?hakwon_no=' + hakwonInfo.hakwon_no + '&studentUserNo=' + $(this).attr("student-no");
		});


		/*	수납 수정	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=receiptUpdate]', function() {
			receiptService.updateReceipt($scope, $window);
		});

		/*	수납 수정 취소	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=receiptUpdateCancel]', function() {
			window.history.back();
		});

		/*	수납 삭제	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=receiptDelete]', function() {
			receiptService.deleteReceipt($scope, $window);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});