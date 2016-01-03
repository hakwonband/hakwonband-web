hakwonMainApp.service('attendanceService', function(CommUtil) {
	console.log('hakwonMainApp attendanceService call');

	var attendanceService = {};

	/*	출결 코드 생성	*/
	attendanceService.makeCode = function() {
		var $attendanceParam = $('div.makeAttendanceCode');

		var hakwonNo = hakwonInfo.hakwon_no;
		var userId = $attendanceParam.find('input[name=studentId]').val();
		var userPass = $attendanceParam.find('input[name=studentPass]').val();

		if( isNull(userId) ) {
			alert('id를 입력해 주세요.');
			$attendanceParam.find('input[name=studentId]').focus();
			return;
		}
		if( isNull(userPass) ) {
			alert('비밀번호를 입력해 주세요.');
			$attendanceParam.find('input[name=studentPass]').focus();
			return;
		}

		var params = {studentId:userId, studentPass:userPass};

		/*	아이디 / 비번으로 user 확인	*/
		call_ajax(params, '/hakwon/student/get.do', function(data){
			if( data.error ) {
				alert('조회에 실패했습니다.');
				return false;
			}
			if(data.colData) {
				if(confirm(data.colData.user_email + "의 코드를 생성 하시겠습니까?")) {
					var userNo = data.colData.user_no;
					params = {hakwonNo:hakwonNo, userNo:userNo};

					/*	출결 코드 생성	*/
					call_ajax(params, '/hakwon/attendance/attcode/create.do', function(data){
						if(data.error) {
							alert("코드 생성 실패");
							return;
						}
						if(data.colData) {
							var flag = data.colData.flag;
							if('need_to_join' == flag) {
								alert("학원 멤버가 아닙니다.");
							} else if('not_a_student' == flag) {
								alert("학생이 아닙니다.");
							} else if('already_has_one' == flag) {
								alert("학생 코드가 존재합니다. [code : " + data.colData.code + "]");
							} else if('success' == flag) {
								alert("학생 코드를 생성했습니다. [code : " + data.colData.code + "]");
							}
						}
					})
				}
			} else {
				alert("아이디 / 비밀번호를 확인해 주세요.");
			}
		});
	};


	/*	등원	*/
	attendanceService.start = function() {
		var $attendanceParam = $('div.attendanceStart');
		var hakwonNo = hakwonInfo.hakwon_no;
		var attendanceCode = $attendanceParam.find('input[name=attendanceCode]').val();

		if(isNull(attendanceCode)) {
			alert('출결코드를 입력해 주세요.');
			$attendanceParam.find('input[name=attendanceCode]').focus();
			return;
		}

		var params = {hakwonNo:hakwonNo, attendanceCode:attendanceCode};

		/*	코드로 학생 정보 조회	*/
		call_ajax(params, '/hakwon/student/get/withCode.do', function(data){
			if( data.error ) {
				alert('실패했습니다.');
				return false;
			}
			if(data.colData) {
				if(confirm(data.colData.user_email + "입니다. 등원 하시겠습니까?")) {
					params = {hakwonNo:hakwonNo, userNo:data.colData.user_no, attendanceType:"start"};

					call_ajax(params, '/hakwon/attendance/attendance.do', function(data){
						if( data.error ) {
							alert('실패했습니다.');
							return false;
						}
						if(data.colData) {
							if("success" == data.colData.flag) {
								alert("등원 처리 되었습니다.");
							} else if("already" == data.colData.flag) {
								alert("이미 등원 하셨습니다.");
							} else {
								alert("실패 했습니다.");
							}
						}
					});
				}
			} else {
				alert("존재하지 않는 코드 입니다.");
			}
		});
	}

	/*	하원	*/
	attendanceService.end = function() {
		var $attendanceParam = $('div.attendanceEnd');
		var hakwonNo = hakwonInfo.hakwon_no;
		var attendanceCode = $attendanceParam.find('input[name=attendanceCode]').val();

		if(isNull(attendanceCode)) {
			alert('출결코드를 입력해 주세요.');
			$attendanceParam.find('input[name=attendanceCode]').focus();
			return;
		}

		var params = {hakwonNo:hakwonNo, attendanceCode:attendanceCode};

		/*	코드로 학생 정보 조회	*/
		call_ajax(params, '/hakwon/attendance/get/withCode.do', function(data){
			if( data.error ) {
				alert('실패했습니다.');
				return false;
			}
			if(data.colData) {
				if(confirm(data.colData.user_email + "입니다. 하원 하시겠습니까?")) {
					params = {hakwonNo:hakwonNo, userNo:data.colData.user_no, attendanceType:"end"};

					call_ajax(params, '/hakwon/attendance/attendance.do', function(data){
						if( data.error ) {
							alert('실패했습니다.');
							return false;
						}
						if(data.colData) {
							if("success" == data.colData.flag) {
								alert("하원 처리 되었습니다.");
							} else if("already" == data.colData.flag) {
								alert("이미 하원 하셨습니다.");
							} else if("unavailable" == data.colData.flag) {
								alert("등원 먼저 해주십시오.");
							} else {
								alert("실패 했습니다.");
							}
						}
					});
				}
			} else {
				alert("존재하지 않는 코드 입니다.");
			}
		});
	};


	/*	출결 조회	*/
	attendanceService.getAttendance = function($scope, calEvents) {
		alert("출결 조회");
		//alert("year : " + year + ", month : " + month);
		var $attendanceParam = $('div.attendanceStart');
		var hakwonNo = hakwonInfo.hakwon_no;
		var studentNo = $attendanceParam.find('input[name=studentNo]').val();

		if(isNull(studentNo)) {
			alert('학생 번호를 입력해 주세요.');
			$attendanceParam.find('input[name=studentNo]').focus();
			return;
		}

		var params = {hakwonNo:hakwonNo, studentNo:studentNo, year:$scope.currentYear};		// 연도별로 조회한다.

		/*	코드로 학생 정보 조회	*/
		call_ajax(params, '/hakwon/attendance/getAttendance.do', function(data){
			if( data.error ) {
				alert('출결 조회에 실패했습니다.');
				return false;
			}
			if(data.colData) {
				calEvents = [];
				var attendanceList = data.colData.attendanceList;
				for(var i=0,max=attendanceList.length; i<max; i++) {
					//attendanceList[i].

					var attStart = {
							title : "등원"
							, start: attendanceList[i].start_date
					}
					//$scope.calEvents.push(attStart);
					calEvents.push(attStart);

					if(!isNull(attendanceList[i].end_date)) {
						var attEnd = {
								title: "하원"
								, start: attendanceList[i].end_date
						}
						//$scope.calEvents.push(attEnd);
						calEvents.push(attEnd);
					}
				}
				attendanceService.calendar(calEvents);
			}
		});
	}



	/*	출결 달력 설정	*/
	attendanceService.calendar = function(calEvent) {

		alert("달력 : " + calEvent);

		$('#calendar').fullCalendar({
			//defaultDate : '2015-02-12',
			header : {
				left : 'prev,next today',
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

			// editable: true,
			// eventLimit: true, // allow "more" link when too many
			// events

			events : calEvent

		});
	}


	/*	반 리스트 조회	*/
	attendanceService.getClassList = function($scope) {

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

	/*	엑셀 다운로드	*/
	attendanceService.excelDownload = function($scope) {
		var $receiptParam	= $('div.attendanceList');
		var hakwonNo		= hakwonInfo.hakwon_no;
		var classNo			= $receiptParam.find('select[name=classNo]').val();
		var searchType		= $receiptParam.find('select[name=searchType]').val();
		var searchText		= $receiptParam.find('input[name=searchText]').val();
		var excelYear		= $scope.excelYear;
		var excelMonth		= $scope.excelMonth;


		var form = $("<form id='excelframe' style='width:0;height:0;border:none;display:none;' />").attr({
			method: "post"
			, action: contextPath+"/hakwon/attendance/attendanceWeek/excel.do"
			, target: "_blank"
		});

		form.append($("<input/>").attr({name:"hakwonNo",	value:hakwonNo}));
		if( classNo )		form.append($("<input/>").attr({name : "classNo",		value : classNo}));
		if( searchType )	form.append($("<input/>").attr({name : "searchType",	value : searchType}));
		if( searchText )	form.append($("<input/>").attr({name : "searchText",	value : searchText}));
		if( excelYear )		form.append($("<input/>").attr({name : "excelYear",		value : excelYear}));
		if( excelMonth )	form.append($("<input/>").attr({name : "excelMonth",	value : excelMonth}));

		$("body").append(form);
		form.submit();
	}

	/*	출결 리스트 조회	*/
	attendanceService.getAttendanceList = function($scope) {
		var $receiptParam	= $('div.attendanceList');
		var hakwonNo		= hakwonInfo.hakwon_no;
		var classNo			= $receiptParam.find('select[name=classNo]').val();
		var searchType		= $receiptParam.find('select[name=searchType]').val();
		var searchText		= $receiptParam.find('input[name=searchText]').val();


		var params = {
			hakwonNo:hakwonNo, classNo:classNo, pageNo:$scope.pageNo
			, searchType:searchType, searchText:searchText
		};
		CommUtil.ajax({url:contextPath+"/hakwon/attendance/attendanceWeek/list.do", param: params, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData ) {
					$scope.studentList = colData.studentList;

					var pageHtml = generatePage($scope.pageNo, colData.totalCount, colData.pageScale, 5);
					$("#eg-custom-paging").html(pageHtml);

					$scope.$$postDigest(function(){
						var today = new Date().getDay();
						if(today == 0) {		// 일
							$('span.sun_span').css('color', 'blue').css('font-weight', 'bolder');
						} else if(today == 1) {	// 월
							$('span.mon_span').css('color', 'blue').css('font-weight', 'bolder');
						} else if(today == 2) {	// 화
							$('span.tue_span').css('color', 'blue').css('font-weight', 'bolder');
						} else if(today == 3) {	// 수
							$('span.wed_span').css('color', 'blue').css('font-weight', 'bolder');
						} else if(today == 4) {	// 목
							$('span.thu_span').css('color', 'blue').css('font-weight', 'bolder');
						} else if(today == 5) {	// 금
							$('span.fri_span').css('color', 'blue').css('font-weight', 'bolder');
						} else if(today == 6) {	// 토
							$('span.sat_span').css('color', 'blue').css('font-weight', 'bolder');
						}
					});
				} else {
					commProto.logger({hakwonNoticeListError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/*	일괄 등/하원	*/
	attendanceService.allAttendance = function($scope, params) {
		/*	코드로 학생 정보 조회	*/
		call_ajax(params, '/hakwon/attendance/allAttendance.do', function(data){
			if( data.error ) {
				alert('일괄 등/하원을 실패했습니다.');
				return false;
			}
			var attType = params.attType;
			var failList = data.colData.data_list;

			var msg = '';
			msg += '전체 ' + params.studentArray.length + '명중, ' + (params.studentArray.length - failList.length) + '명에 대하여 ';
			if( attType == 'start' ) {
				msg += '일괄 등원을 했습니다. \n\n\n';
			} else if( attType == 'end' ) {
				msg += '일괄 하원을 했습니다. \n\n\n';
			}

			if(failList != null && failList.length > 0) {
				msg += '** 실패한 학생들.. \n\n';
				var reason = ('start' == attType) ? '하원을 먼저 해주십시오.' : '등원을 먼저 해주십시오.';


				var student;
				for(var i=0,imax=failList.length; i<imax; i++) {
					student = failList[i];
					msg += '* ' + student.user_name + '(' + student.user_id + ') - ' + reason + '\n';
				}

			}
			alert(msg);
			attendanceService.getAttendanceList($scope);
		});
	}

	return attendanceService;
});


/**
 * 출결 컨트롤러
 */
hakwonMainApp.controller('attendanceMakeController', function($scope, $location, $routeParams, attendanceService, CommUtil) {
	console.log('hakwonMainApp attendanceMakeController call');

	try {
		var currentDate = new Date();
		$scope.currentYear = currentDate.getFullYear();
		$scope.currentMonth = currentDate.getMonth() + 1;

		var calEvents = [];		// 출결 리스트

		$scope.attendanceCode = "";

		/*	코드 생성	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=makeAttendanceCode]', function() {

			attendanceService.makeCode();
			// 화면 랜더링 이후에 동작
			$scope.$$postDigest(function(){
				console.log('성공???');
			});
		});

		/*	등원	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=attendanceStart]', function() {
			attendanceService.start();
		});

		/*	하원	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=attendanceEnd]', function() {
			attendanceService.end();
		});



		/*	출결 조회	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=getAttendance]', function() {
			attendanceService.getAttendance($scope, calEvents);
		});

		/*	이전달 출결 조회	*/
		$('#mainNgView').on(clickEvent, 'button.fc-prev-button', function() {
			if($scope.currentMonth == 1) {
				$scope.currentMonth = 12;
				$scope.currentYear--;
				attendanceService.getAttendance($scope, calEvents);		// 연도가 바뀌었으므로..조회
			} else {
				$scope.currentMonth--;
			}
		});

		/*	다음달 출결 조회	*/
		$('#mainNgView').on(clickEvent, 'button.fc-next-button', function() {
			if($scope.currentMonth == 12) {
				$scope.currentMonth = 1;
				$scope.currentYear++;
				attendanceService.getAttendance($scope, calEvents);		// 연도가 바뀌었으므로..조회
			} else {
				$scope.currentMonth++;
			}
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 주간 출결 리스트 컨트롤러
 */
hakwonMainApp.controller('attendanceWeekListController', function($scope, $location, $routeParams, $window, attendanceService, CommUtil) {
	console.log('hakwonMainApp attendanceWeekListController call');

	try {
		$scope.classList 			= [];		// 반 리스트
		$scope.studentList 			= [];		// 출결 학생 리스트
		$scope.attendanceTotalCount	= 0;		// 출결리스트 전체 카운트
		$scope.pageNo = 1;						// 현재 페이지 번호

		$scope.excelYear = new Date().getFullYear();
		$scope.excelMonth = '01';

		/*	학윈 리스트 조회	*/
		attendanceService.getClassList($scope);

		/*	출결 리스트 조회	*/
		attendanceService.getAttendanceList($scope);

		$scope.getPhotoFileFullPath = function(photo_file_path) {
			return CommUtil.createFileFullPath(photo_file_path, 'photo');
		};

		/**
		 * 출결 검색
		 */
		$scope.attendanceSearch = function() {
			attendanceService.getAttendanceList($scope);
		}
		/**
		 * 엑셀 다운로드
		 */
		$scope.excelDownload = function() {
			attendanceService.excelDownload($scope);
		}


		/*	출결 검색 키처리	*/
		$scope.searchAttendanceEnter = function(e) {
			if (e && e.type === 'keydown' && e.keyCode !== 13) {
				return;
			}
			var searchText = $('div.attendanceList input[name=searchText]').val();
			if(isNull(searchText)) {
				alert("검색 할 내용이 없습니다.");
				return;
			}
			attendanceService.getAttendanceList($scope);
		};

		/**
		 * 일괄 등/하원
		 */
		$scope.allAttendance = function(attType) {
			var classNo = $('select[name=classNo]').val();
			if( classNo ) {

				var student_array = [];
				$('input[name=student_no]:checked').each(function() {
					student_array.push($(this).val());
				});
				if( student_array.length == 0 ) {
					alert('학생을 선택해 주세요.');
					return ;
				}

				var alram_flag = $('input[name=alram_flag]:checked').val();

				var className = $( "select[name=classNo] > option:selected" ).text();
				className = className.trim();

				var param = {
					hakwonNo : hakwonInfo.hakwon_no
					, classNo : classNo
					, attType : attType
					, studentArray : student_array
					, alramFlag : alram_flag
				};

				/*	전체 등/하원 처리	*/
				attendanceService.allAttendance($scope, param);
			} else {
				alert('반을 선택해 주세요.');
			}
		};

		/**
		 * 전체 학생 체크
		 */
		/*	학생 전체 체크	*/
		$('#mainNgView').on('click', 'input[data-act=studentAllCheck]', function() {
			var allChecked = $(this).is(":checked");

			if( allChecked == true ) {
				$('input[name=student_no]').prop('checked', true);
			} else {
				$('input[name=student_no]').prop('checked', false);
			}
		});

		/*	기간 검색 버튼	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=attendanceSearchTerm]', function() {
			$scope.dateTerm = $(this).attr("data-value");
			attendanceService.getAttendanceList($scope);
		});


		/*	페이지 선택	*/
		$("#eg-custom-paging").off("click", "button").on("click", "button", function(e) {
			$scope.pageNo = $(this).attr("current-page");
			attendanceService.getAttendanceList($scope);
		});


		/*	학생 상세보기	*/
		$('#mainNgView').on(clickEvent, 'tbody tr td a', function() {
			$window.location.href = PageUrl.common.studentView + '?hakwon_no=' + hakwonInfo.hakwon_no + '&studentUserNo=' + $(this).attr("student-no");
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}

});