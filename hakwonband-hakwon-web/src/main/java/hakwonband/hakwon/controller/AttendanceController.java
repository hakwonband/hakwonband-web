package hakwonband.hakwon.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.common.constant.HakwonConstant.Common;
import hakwonband.hakwon.common.exception.UnauthorizedUserException;
import hakwonband.hakwon.component.ColumnModel;
import hakwonband.hakwon.component.ExcelComponent;
import hakwonband.hakwon.component.SheetModel;
import hakwonband.hakwon.model.DevicePushData;
import hakwonband.hakwon.service.AsyncService;
import hakwonband.hakwon.service.AttendanceService;
import hakwonband.hakwon.service.HakwonService;
import hakwonband.hakwon.util.HakwonUtilSupportBox;
import hakwonband.util.DataMap;
import hakwonband.util.DateUtil;
import hakwonband.util.SecuUtil;
import hakwonband.util.StringUtil;

/**
 * 출결 컨트롤러
 * @author eggrok-home
 *
 */
@RequestMapping("/hakwon/attendance")
@Controller
public class AttendanceController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(AttendanceController.class);

	@Autowired
	private AttendanceService attendanceService;

	@Autowired
	private HakwonService hakwonService;

	@Autowired
	private AsyncService asyncService;

	@Autowired
	private ExcelComponent excelComponent;

	/**
	 * 등원 팝업 페이지 호출
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/popup")
	public ModelAndView popup(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		/*	학생 또는 학부모가 호출하면 에러 발생	*/
		if("005".equals(authUserInfo.getString("user_type")) || "006".equals(authUserInfo.getString("user_type"))) {
			throw new UnauthorizedUserException();
		}
		String hakwonNo = request.getParameter("hakwonNo");

		DataMap param = new DataMap();
		param.put("hakwon_no", hakwonNo);
		DataMap hakwonInfo = hakwonService.hakwonDetail(param);
		DataMap hakwonDetail = (DataMap)hakwonInfo.get("content");

		ModelAndView mv = new ModelAndView("/attendance_popup");
		mv.addObject("hakwonDetail", hakwonDetail);
		mv.addObject("hakwonNo", hakwonNo);
		return mv;
	}

	/**
	 * 학생 코드 생성전, id/pass로 학생 정보 조회해서 확인용.
	 * @param request
	 * @param response
	 */
	@RequestMapping("/get")
	public void getStudent(HttpServletRequest request, HttpServletResponse response) {

		String studentId = request.getParameter("studentId");
		String studentPass = request.getParameter("studentPass");
		String hakwonNo = request.getParameter("hakwonNo");

		DataMap param = new DataMap();
		param.put("hakwonNo", hakwonNo);
		param.put("studentId", studentId);
		param.put("studentPass", SecuUtil.sha256(studentPass));



		/* 학생이 학원에 등록되어있는지 확인. */
		param = attendanceService.selectStudent(param);

		sendColData(param, request, response);
	}



	/**
	 * 기존에 출결코드가 없는 학생에 대한 코드 생성 일괄 처리
	 * @param request
	 * @param response
	 * @throws InterruptedException
	 */
	//@RequestMapping(value="/attcode/createAll", method=RequestMethod.GET)
	public void createStCodeAll(HttpServletRequest request, HttpServletResponse response) throws InterruptedException {
		String pass = request.getParameter("pass");

		DataMap param = new DataMap();

		if(!"7406".equals(pass)) {
			param.put("flag", "fail");
		} else {
			attendanceService.createAttCodeAll();
			param.put("flag", "success");
		}
		sendColData(param, request, response);
	}

	/**
	 * 학생 코드로 학생 정보 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/get/withCode")
	public void getStudentByCode(HttpServletRequest request, HttpServletResponse response) {

		String attCode = request.getParameter("attendanceCode");
		String hakwonNo = request.getParameter("hakwonNo");

		DataMap param = new DataMap();
		param.put("hakwonNo", hakwonNo);
		param.put("attCode", attCode);

		/*	학생코드로 학생 정보 조회	*/
		DataMap studentInfo = attendanceService.selectStudentByAttCode(param);

		sendColData(studentInfo, request, response);
	}

	/**
	 * 출결 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/getAttendance")
	public void getAttendance(HttpServletRequest request, HttpServletResponse response) {

		String hakwonNo = request.getParameter("hakwonNo");		// 학생 번호
		String studentNo = request.getParameter("studentNo");	// 학생 번호
		String year = request.getParameter("year");				// 연
		String month = request.getParameter("month");			// 월
		String dataType = request.getParameter("dataType");		// 데이터 타입 (001: 등/하원, 002: 승/하차)

		DataMap param = new DataMap();

		if(StringUtil.isBlank(hakwonNo, studentNo, year)) {
			param.put("flag", "paramError");
 		} else {
 			param.put("hakwonNo", hakwonNo);
 			param.put("studentNo", studentNo);
 			param.put("dataType", dataType);

 			/*	월 단위로 조회	*/
 			if(!StringUtil.isBlank(month)) {
 				if(month.length() != 2) month = "0" + month;

 				String yearMonth = year + "-" + month;
 				param.put("startDate", yearMonth + "-01");
 	 			param.put("endDate", DateUtil.addMonth(yearMonth, 1, "yyyy-MM") + "-01");

 	 		/*	연 단위로 조회	*/
 			} else {
 				param.put("startDate", year + "-01-01");
 				param.put("endDate", (Integer.parseInt(year) + 1) + "-01-01");
 			}

 			/*	출결 리스트 조회	*/
 			List<DataMap> attendanceList = attendanceService.selectAttendanceList(param);

 			param.clear();
 			param.put("attendanceList", attendanceList);
 		}

		sendColData(param, request, response);
	}

	/**
	 * 등/하원, 승/하차 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/put")
	public void put(HttpServletRequest request, HttpServletResponse response) {

		String popupType		= request.getParameter("popupType");
		String studentNo		= request.getParameter("studentNo");
		String hakwonNo			= request.getParameter("hakwonNo");
		String attendanceType	= request.getParameter("attendanceType");	// start : 등원/승차 , end : 하원,하차
		String isSendingMsg		= request.getParameter("isSendingMsg");		// 부모계정에 푸시 메세지 전송할지 여부 (true , false)
		String classNo			= request.getParameter("classNo");			// 반 번호

		isSendingMsg = "true";			// checkbox와 상관없이 모든 출결에 대해 알림 발송 (임시코드)

		DataMap param = new DataMap();
		param.put("hakwonNo",		hakwonNo);
		param.put("studentNo",		studentNo);
		param.put("attendanceType",	attendanceType);
		param.put("isSendingMsg",	isSendingMsg);
		param.put("classNo",		classNo);

		/*	버스 승하차	*/
		if( "bus".equals(popupType) ) {
			param.put("busType",		request.getParameter("busType"));		// 타입 (001: 승차, 002:하차)
			param.put("dataType",		"002");

		/*	등하원	*/
		} else {
			param.put("dataType",		"001");
		}
		param = attendanceService.insertAttAndBusTime(param);

		/*	알림 전송	*/
		DevicePushData devicePushData = (DevicePushData)param.get("devicePushData");
		asyncService.pushMobileDevice(devicePushData);
		param.remove("devicePushData");

		sendColData(param, request, response);
	}

	/**
	 * 주간 출결 현황 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/attendanceWeek/list")
	public void getAttendanceWeekList(HttpServletRequest request, HttpServletResponse response) {
		String hakwonNo			= request.getParameter("hakwonNo");		// 학원 번호
		String classNo			= request.getParameter("classNo");		// 반 번호
		String pageNo			= hakwonband.util.StringUtil.replaceNull( request.getParameter("pageNo"), "1");		// 현재 페이지 번호
		String searchType		= request.getParameter("searchType");
		String searchText		= request.getParameter("searchText");
		DataMap authUserInfo	= (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		int pageScale = Common.SELECT_SCALE;	// 페이지당 리스트의 갯수
		int startNo = (Integer.parseInt(pageNo) -1) * pageScale;

		/*	이번주 월요일, 다음주 월요일 구하기	*/
		Calendar cal = Calendar.getInstance();

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String startDate;
		String endDate;

		/*	오늘이 일요일이면..	*/
		if(1 == cal.get(Calendar.DAY_OF_WEEK)) {
			startDate = sdf.format(cal.getTime());		// 오늘 날짜를 구하고, -6일을 하여 월요일을 구한다.
			startDate = HakwonUtilSupportBox.addDate(startDate, -6, "yyyy-MM-dd");		// 이번주 월요일
		} else {
			cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
			startDate = sdf.format(cal.getTime());		// 이번주 월요일
		}
		endDate = HakwonUtilSupportBox.addDate(startDate, 7, "yyyy-MM-dd");		// 다음주 월요일

		DataMap param = new DataMap();
		param.put("hakwonNo",	hakwonNo);
		param.put("classNo",	classNo);
		param.put("startDate",	startDate);
		param.put("endDate",	endDate);
		param.put("pageScale",	pageScale);
		param.put("startNo",	startNo);
		param.put("searchType",	searchType);
		param.put("searchText",	searchText);
		param.put("userType",	authUserInfo.getString("user_type"));
		param.put("userNo",		authUserInfo.getString("user_no"));

		DataMap result = attendanceService.getAttendanceWeekList(param);
		result.put("pageScale", pageScale);

		sendColData(result, request, response);
	}

	/**
	 * 출결 현황 엑셀 저장
	 * @param request
	 * @param response
	 */
	@RequestMapping("/attendanceWeek/excel")
	public void getAttendanceWeekExcel(HttpServletRequest request, HttpServletResponse response) {
		String hakwonNo			= request.getParameter("hakwonNo");		// 학원 번호
		String excelYear		= request.getParameter("excelYear");	// 년도
		String excelMonth		= request.getParameter("excelMonth");	// 월
		DataMap authUserInfo	= (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("hakwonNo",	hakwonNo);
		param.put("yearMonth",	excelYear+"-"+excelMonth);
		param.put("userType",	authUserInfo.getString("user_type"));
		param.put("userNo",		authUserInfo.getString("user_no"));

		/**
		 * 월별 출결 리스트
		 */
		List<DataMap> dataList = attendanceService.getAttendanceMonthList(param);


		List<ColumnModel> headerList = new ArrayList<ColumnModel>();
		headerList.add(new ColumnModel("이름",	"user_name"));
		headerList.add(new ColumnModel("아이디",	"user_id"));
		headerList.add(new ColumnModel("반이름",	"class_name"));
		for(int i=1; i<=31; i++) {
			String dayVal = (i<10)?"0"+i:String.valueOf(i);
			headerList.add(new ColumnModel(dayVal,	dayVal));
		}

		String fileName = excelComponent.convertFileName(request.getHeader("User-Agent"), excelYear+"-"+excelMonth+" 출결 리스트");

		SheetModel sheetModel = new SheetModel(dataList, headerList);
		excelComponent.writeExcel(response, sheetModel, fileName);
	}

	/**
	 * class의 알림발송여부 상태값 변경
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/class/push/active")
	public void pushActive(HttpServletRequest request, HttpServletResponse response) {
		String hakwonNo = request.getParameter("hakwonNo");
		String classNo = request.getParameter("classNo");
		String useYn = request.getParameter("useYnAttPush");

		if("true".equals(useYn)) {
			useYn = "Y";
		} else {
			useYn = "N";
		}

		DataMap param = new DataMap();
		param.put("hakwonNo", hakwonNo);
		param.put("classNo", classNo);
		param.put("useYn", useYn);

		attendanceService.pushActive(param);

		param.clear();
		param.put("flag", "success");
		sendColData(param, request, response);

	}

	/**
	 * 클래스의 출결알림 발송 여부 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping(value="/class/push/get")
	public void getPushActive(HttpServletRequest request, HttpServletResponse response) {
		String hakwonNo = request.getParameter("hakwonNo");
		String classNo = request.getParameter("classNo");

		DataMap param = new DataMap();
		param.put("hakwonNo", hakwonNo);
		param.put("classNo", classNo);

		String userAttPush = attendanceService.getPushActive(param);

		param.clear();
		param.put("useAttPush", userAttPush);
		sendColData(param, request, response);
	}

	/**
	 * 전체 등원/하원 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/allAttendance")
	public void allAttendance(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwonNo	= request.getParameter("hakwonNo");
		String classNo	= request.getParameter("classNo");
		String attType	= request.getParameter("attType");	//	start(등원) , end(하원)

		String alramFlag = request.getParameter("alramFlag");
		String [] studentArray = request.getParameterValues("studentArray");	// 학생번호 어레이

		DataMap rtnMap = new DataMap();

		if(studentArray == null || studentArray.length < 1) {
			rtnMap.put("flag",		"paramError");
		} else {
			DataMap param = new DataMap();
			param.put("hakwonNo",	hakwonNo);
			param.put("classNo",	classNo);
			param.put("attType",	attType);
			param.put("userNo",		authUserInfo.getString("user_no"));
			param.put("dataType",	("start".equals(attType) ? "001" : "002"));

			param.put("alramFlag",		alramFlag);
			param.put("studentArray",	studentArray);

			/**
			 * 전체 등하원
			 */
			DataMap resultMap = attendanceService.allAttendance(param);

			List<DevicePushData> deviceList = (List<DevicePushData>)resultMap.get("deviceList");
			asyncService.pushMobileDevice(deviceList);

			List<DataMap> unavailable = (List<DataMap>)resultMap.get("unavailableList");

			rtnMap.put("flag",		CommonConstant.Flag.success);
			rtnMap.put("data_list",	unavailable);
		}
		sendColData(rtnMap, request, response);
	}
}