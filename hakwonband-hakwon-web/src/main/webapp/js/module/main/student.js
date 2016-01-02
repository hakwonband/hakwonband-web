/**
 * 학생 서비스
 */
hakwonMainApp.service('studentService', function($http, CommUtil) {
	console.log('hakwonMainApp studentService call', CommUtil);

	var studentService = {};

	/**
	 * 학생 정보
	 */
	studentService.studentInfo = function(studentUserNo, callback) {
		var param = {studentUserNo:studentUserNo, hakwonNo : hakwonInfo.hakwon_no};
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/student/view.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}

	/**
	 * 학생 정보 수정
	 */
	studentService.studentUpdate = function(studentInfo, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/student/update.do"
			, header	: hakwonInfo.getHeader()
			, param		: studentInfo
			, callback	: callback
		});
	}

	/**
	 * 탈퇴
	 */
	studentService.without = function(delUserInfo, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/without.do"
			, header	: hakwonInfo.getHeader()
			, param		: delUserInfo
			, callback	: callback
		});
	}

	/**
	 * 학생 리스트
	 */
	studentService.studentList = function(param, callback) {
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/student/list.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	};

	/**
	 * 학생 상세
	 */
	studentService.studentView = function(studentUserNo, callback) {
		var param = {studentUserNo:studentUserNo, hakwonNo : hakwonInfo.hakwon_no};
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/student/view.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	};

	/*	출결 조회	*/
	studentService.getAttendance = function($scope, studentUserNo) {
		/*	풀캘린더를 새로 고침 하기위해서 돔을 삭제하고 다시 만든다.	*/
		var pa = $("#attendanceCalendar").parent();
		$("#attendanceCalendar").remove();
		pa.append('<div id="attendanceCalendar"></div>');

		var calEvent = [];		// 출결 이벤트가 담길 배열

		var hakwonNo = hakwonInfo.hakwon_no;
		var params = {hakwonNo:hakwonNo, studentNo:studentUserNo, year:$scope.currentYear, dataType:'001'};		// 연도별로 조회한다.

		/*	출결 조회	*/
		CommUtil.ajax({url:contextPath+"/hakwon/attendance/getAttendance.do", param:params, successFun:function(data) {
			console.log("출결 : " + JSON.stringify(data));
			if( data.error ) {
				alert('출결 조회에 실패했습니다.');
				return false;
			}
			if(data.colData) {
				var attendanceList = data.colData.attendanceList;
				for(var i=0,max=attendanceList.length; i<max; i++) {
					var attendanceInfo = attendanceList[i];

					if( attendanceInfo.data_type == '001' ) {
						/*	등하원	*/
						var attStart = {
							title : "등원", start: attendanceList[i].start_date
						}
						calEvent.push(attStart);

						if(!isNull(attendanceList[i].end_date)) {
							var attEnd = {
								title: "하원", start: attendanceList[i].end_date
							}
							calEvent.push(attEnd);
						}
					} else if( attendanceInfo.data_type == '002' ) {
						/*	승하차	*/
						var attStart = {
							title : "승차", start: attendanceList[i].start_date
						}
						calEvent.push(attStart);

						if(!isNull(attendanceList[i].end_date)) {
							var attEnd = {
								title: "하차", start: attendanceList[i].end_date
							}
							calEvent.push(attEnd);
						}
					}
				}
				studentService.calendar($scope, calEvent);
			}
		}});
	}



	/*	출결 달력 설정	*/
	studentService.calendar = function($scope, calEvent) {

		var cuMonth = $scope.currentMonth;
		console.log("cu month : " + cuMonth);
		if(cuMonth < 10) {
			cuMonth = "0" + cuMonth;
		}
		var defaultDate = $scope.currentYear + "-" + cuMonth + "-01";
		console.log("기본 날짜 : " + defaultDate);
		//var calEvent = [];

		if(calEvent == null || "undefined" == calEvent) {
			calEvent = [];
		} else {
			console.log("달략에서 : " + JSON.stringify(calEvent));
		}

		$('#attendanceCalendar').fullCalendar({
			defaultDate : defaultDate,
			header : {
				left : 'prev,next',
				center : 'title',
				right : ''
			},

			// time formats
			titleFormat : {
				month : 'YYYY년 MMMM',
			},
			columnFormat : {
				month : 'ddd',
				week : 'M/d ddd ',
				day : 'M월d일 dddd '
			},
			timeFormat : { // for event elements
				'' : 'HH:mm', // 월간
				agenda : 'HH:mm{ - HH:mm}' // 주간,일간
			},

			monthNames : [ '1월', '2월', '3월', '4월', '5월', '6월', '7월',
					'8월', '9월', '10월', '11월', '12월' ],
			monthNamesShort : [ '1월', '2월', '3월', '4월', '5월', '6월',
					'7월', '8월', '9월', '10월', '11월', '12월' ],
			dayNames : [ '일요일', '월요일', '화요일', '수요일', '목요일', '금요일',
					'토요일' ],
			dayNamesShort : [ '일', '월', '화', '수', '목', '금', '토' ],
			buttonText : {
				today : '오늘',
			},

			events : calEvent

		});
	};


	/*	학원 수납일 업데이트	*/
	studentService.updateReceiptDate = function(studentNo, receiptDate) {
		var param = {studentNo:studentNo, hakwonNo : hakwonInfo.hakwon_no, receiptDate:receiptDate};
		$.ajax({
			url: contextPath+"/hakwon/student/receiptDate/update.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('수납일 수정이 실패하였습니다.');
						return false;
					}
					var flag = data.colData.flag;
					if('success' == flag) {
						alert("수정되었습니다.");
					} else {
						alert('수납일 수정이 실패하였습니다.');
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

	return studentService;
});

/**
 * 학생 리스트
 */
hakwonMainApp.controller('studentListController', function($scope, $location, $routeParams, studentService, CommUtil, $timeout) {
	console.log('hakwonMainApp studentListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'학생 리스트'}]);

		/*	공통 유틸	*/
		$scope.CommUtil	= CommUtil;
		$scope.PageUrl	= PageUrl;
		$scope.userAuth	= userAuth;

		/**
		 * 페이지 번호
		 */
		var pageNo = $routeParams.pageNo;
		if( !pageNo ) {
			pageNo = 1;
		}
		var searchTextParam = $routeParams.searchText;
		if( !searchTextParam ) searchTextParam = '';
		$scope.searchText = searchTextParam;

		var $bootpag = undefined;

		/*	검색	*/
		$scope.search = function() {
			window.location = PageUrl.common.studentList+'?hakwon_no='+hakwonInfo.hakwon_no+'&searchText='+$scope.searchText;
		};

		/*	메세지 보내기	*/
		$scope.userMessage = function(user_no) {
			window.location.href = PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+user_no;
		}

		$("#wrapper").show();

		/*	학생 리스트	*/
		var searchCallback = function(data) {
			if( data.error || !data.colData ) {
				alert('학생 조회를 실패 했습니다.');
				window.history.back();
				return false;
			}
			var colData = data.colData;

			$scope.studentList = colData.dataList;
			$timeout(function() {
				var totalPages = comm.pageCalc(colData.dataCount, colData.pageScale);
				$bootpag.bootpag({
					total	: totalPages
					, page	: data._param.pageNo
					, maxVisible: DefaultInfo.pageScale
					, leaps	: true
				});
			},50);
		}
		studentService.studentList({pageNo : pageNo, searchText : $scope.searchText, hakwonNo : hakwonInfo.hakwon_no}, searchCallback);


		$scope.$on('$viewContentLoaded', function() {
			console.log('$viewContentLoaded');
		});
		$scope.$$postDigest(function(){
			console.log('$$postDigest');

			$timeout(function() {
				$bootpag = $('#mainNgView div[data-view=pagination]').bootpag().bind("page", function(event, page){
					window.location = PageUrl.common.studentList+'?hakwon_no='+hakwonInfo.hakwon_no+'&searchText='+$scope.searchText+'&pageNo='+page;
				});
			}, 50);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 학생 상세
 */
hakwonMainApp.controller('studentViewController', function($scope, $location, $routeParams, studentService, CommUtil, $timeout) {
	console.log('hakwonMainApp studentViewController call');

	try {
		/*	출결용 변수	*/
		var currentDate = new Date();
		$scope.currentYear = currentDate.getFullYear();
		$scope.currentMonth = currentDate.getMonth() + 1;
		console.log("current date : " + $scope.currentYear + "-" + $scope.currentMonth);

		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.common.studentList+'?hakwon_no='+hakwonInfo.hakwon_no, title:'학생 리스트'}, {url:'#', title:'상세'}]);

		/*	공통 유틸	*/
		$scope.CommUtil	= CommUtil;
		$scope.PageUrl	= PageUrl;
		$scope.userAuth	= userAuth;

		/**
		 * 학생 번호
		 */
		var studentUserNo = $routeParams.studentUserNo;
		if( !studentUserNo ) {
			alert('학생을 선택해 주세요.');
			return ;
		}

		$("#wrapper").show();

		/*	목록으로	*/
		$scope.goList = function() {
			if (history.length > 1) {
				window.history.back();
			} else {
				$location.path('/student/list');
			}
		}

		/**
		 * 수정
		 */
		$scope.modify = function() {
			window.location = '#/student/modify?studentUserNo='+studentUserNo;
		}

		/**
		 * 탈퇴
		 */
		$scope.without = function() {
			if( window.confirm('회원님을 탈퇴 시키겠습니까?') ) {
				studentService.without({user_no:studentUserNo, hakwon_no:hakwonInfo.hakwon_no}, function(data) {
					if( data.colData && data.colData.flag == 'success' ) {
						window.history.back();
					} else {
						alert('탈퇴를 실패 했습니다.');
					}
				});
			}
		}

		/*	메세지 보내기	*/
		$scope.userMessage = function(user_no) {
			window.location.href = PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+user_no;
		}

		/*	등록날짜 수정준비 버튼	*/
		$scope.updateReady = function() {
			$('li[name=registDate] input[name=registDate]').prop('readonly', false);
			$('li[name=registDate] button[name=update]').css('display', '');
			$('li[name=registDate] button[name=update_ready]').css('display', 'none');
		}

		/*	등록일 수정	*/
		$scope.updateAct = function() {
			var receiptDate = $('li[name=registDate] input[name=registDate]').val();
			if(isNull(receiptDate)) {
				alert("등록일을 입력해주세요.");
				$('li[name=registDate] input[name=registDate]').focus();
				return;
			}

			if(isNaN(receiptDate) || !(receiptDate >= 1 && receiptDate <= 31 )) {
				alert("1~31까지의 숫자만 입력 가능합니다.");
				$('li[name=registDate] input[name=registDate]').focus();
				return;
			}

			studentService.updateReceiptDate(studentUserNo, receiptDate);

			$('li[name=registDate] input[name=registDate]').prop('readonly', true);
			$('li[name=registDate] button[name=update]').css('display', 'none');
			$('li[name=registDate] button[name=update_ready]').css('display', '');
		}

		/*	이전달 출결 조회	*/
		$('#mainNgView').on(clickEvent, 'button.fc-prev-button', function() {
			if($scope.currentMonth == 1) {
				$scope.currentMonth = 12;
				$scope.currentYear--;
				studentService.getAttendance($scope, studentUserNo);		// 연도가 바뀌었으므로..조회
			} else {
				$scope.currentMonth--;
			}
			console.log("prev date : " + $scope.currentYear + "-" + $scope.currentMonth);
		});

		/*	다음달 출결 조회	*/
		$('#mainNgView').on(clickEvent, 'button.fc-next-button', function() {
			if($scope.currentMonth == 12) {
				$scope.currentMonth = 1;
				$scope.currentYear++;
				studentService.getAttendance($scope, studentUserNo);		// 연도가 바뀌었으므로..조회
			} else {
				$scope.currentMonth++;
			}
			console.log("next date : " + $scope.currentYear + "-" + $scope.currentMonth);
		});


		/*	오늘 버튼	*/
		//TODO : 오늘 버튼 제거하였음.
		$('#mainNgView').on(clickEvent, 'button.fc-today-button', function() {
			var currentYear = currentDate.getFullYear();
			var currentMonth = currentDate.getMonth() + 1;

			/*	오늘날짜가 현재 보고있는 페이지와 연도가 바뀌면 출결정보 다시 조회	*/
			if($scope.currentYear != currentYear) {
				alert("연도가 틀리므로 다시 조회 하겠음. currn : " + $scope.currentYear + ", today : " + currentYear);
				$scope.currentYear = currentYear;		// 현재의 날짜로 다시 셋팅
				$scope.currentMonth = currentMonth;		// 현재의 날짜로 다시 셋팅
				studentService.getAttendance($scope, studentUserNo);		// 연도가 바뀌었으므로..조회
			} else {
				alert("같은 연도 입니다.");
				$sceop.currentMonth = currentMonth;
			}
			console.log("today date : " + $scope.currentYear + "-" + $scope.currentMonth);
		});


		$scope.$on('$viewContentLoaded', function() {
			console.log('$viewContentLoaded');
		});

		$scope.$$postDigest(function(){
			console.log('$$postDigest');
		});

		/**
		 * 상세 조회
		 */
		studentService.studentView(studentUserNo, function(data) {

			if( data.error ) {
				alert('학생 조회를 실패 했습니다.');
				window.history.back();
				return false;
			}

			var colData = data.colData;

			$scope.userInfo			= colData.userInfo;
			$scope.schoolInfo		= colData.schoolInfo;
			$scope.hakwonClassList	= colData.hakwonClassList;
			$scope.parentList		= colData.parentList;
			$scope.hakwonInfo		= hakwonInfo;

			$timeout(function() {
				console.log('studentView callback getAttendance~~');
				studentService.getAttendance($scope, studentUserNo);		// 학생 상세 페이지 바인딩후 출결 달력 생성
			},50);
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 학생 수정
 */
hakwonMainApp.controller('studentModifyController', function($scope, $location, $routeParams, studentService, CommUtil) {
	console.log('hakwonMainApp studentModifyController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.common.studentList+'?hakwon_no='+hakwonInfo.hakwon_no, title:'학생 리스트'}, {url:'#', title:'수정'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		$scope.school_info = {};
		$scope.school_info.level = '';

		/**
		 * 학생 번호
		 */
		var studentUserNo = $routeParams.studentUserNo;
		if( !studentUserNo ) {
			alert('학생을 선택해 주세요.');
			if (history.length > 1) {
				window.history.back();
			} else {
				$location.path('/student/list');
			}
			return ;
		}

		/**
		 * 학년 리스트
		 */
		$scope.school_level_array = [];
		$scope.school_level_array.push({level:1, level_title:'1 학년'});
		$scope.school_level_array.push({level:2, level_title:'2 학년'});
		$scope.school_level_array.push({level:3, level_title:'3 학년'});
		$scope.school_level_array.push({level:4, level_title:'4 학년'});
		$scope.school_level_array.push({level:5, level_title:'5 학년'});
		$scope.school_level_array.push({level:6, level_title:'6 학년'});


		/**
		 * 학생 정보 조회
		 */
		studentService.studentInfo(studentUserNo, function(data) {
			data.colData.userInfo.user_birthday = new Date(data.colData.userInfo.user_birthday);
			$scope.user_info = data.colData.userInfo;
			$scope.school_info = data.colData.schoolInfo;
		});

		/**
		 * 저장
		 */
		$scope.save = function() {
			var param = {
				user_name				: $scope.user_info.user_name
				, user_email			: $scope.user_info.user_email
				, user_pwd				: $scope.user_info.user_pwd
				, user_birthday			: moment($scope.user_info.user_birthday).format('YYYY-MM-DD')
				, user_gender			: $scope.user_info.user_gender
				, tel1_no				: $scope.user_info.tel1_no
				, school_name			: $scope.school_info.school_name
				, school_level			: $scope.school_info.school_level
				, school_level_level	: $scope.school_info.level
				, hakwonNo				: hakwonInfo.hakwon_no
				, studentUserNo			: studentUserNo
			};

			studentService.studentUpdate(param, function(data) {
				if( data && data.colData && data.colData.flag == 'success' ) {
					if (history.length > 1) {
						window.history.back();
					} else {
						$location.path('/student/list');
					}
				} else {
					alert('수정을 실패 했습니다.');
				}
			});
		}

		/**
		 * 취소
		 */
		$scope.cancel = function() {
			if (history.length > 1) {
				window.history.back();
			} else {
				$location.path('/student/list');
			}
		}

		$scope.$$postDigest(function(){
			console.log('$$postDigest');
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});