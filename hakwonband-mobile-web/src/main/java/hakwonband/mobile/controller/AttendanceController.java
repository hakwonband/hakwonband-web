package hakwonband.mobile.controller;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.common.BaseAction;
import hakwonband.mobile.service.AttendanceService;
import hakwonband.util.DataMap;
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

	/**
	 * 출결 결과 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list/get")
	public void attendanceList(HttpServletRequest request, HttpServletResponse response) {
		String studentNo = request.getParameter("studentNo");		// 학생번호
		String dataType = request.getParameter("dataType");			// 출결타입 ( 001 : 등/하원, 002 : 승/하차)
		String startDate = request.getParameter("startDate");		// 기간 검색 시작
		String endDate = request.getParameter("endDate");			// 기간 검색 끝
		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);	// 현재 페이지 번호
		int pageScale	= 20;		// 페이지 스케일

		if(StringUtil.isBlank(startDate, endDate)) {
			startDate = "";
			endDate = "";
		} else {
			endDate = addDate(endDate, 1, "yyyy-MM-dd");
		}

		if( StringUtils.isBlank(dataType) ) {
			dataType = null;
		}

		DataMap param = new DataMap();
		param.put("studentNo", studentNo);
		param.put("dataType", dataType);
		param.put("startDate", startDate);
		param.put("endDate", endDate);
		param.put("startNo", (pageNo-1)*pageScale);
		param.put("pageScale", pageScale);

		List<DataMap> attendanceList = attendanceService.selectAttendanceList(param);

		sendList(attendanceList, request, response);
	}

	/**
	 * 기준되는 문자열 날짜의 +/- day 의 결과값 리턴
	 * @param startDay
	 * @param addDay
	 * @param dateFormatType
	 * @return
	 */
	public String addDate(String startDay, int addDay, String dateFormatType) {
		String date = "";
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(dateFormatType);
			Date sDate = sdf.parse(startDay);
			Calendar cal = Calendar.getInstance();
			cal.setTime(sDate);
			cal.add(Calendar.DATE, addDay);
			date = sdf.format(cal.getTime());
			cal = null;
		} catch(Exception e) {
			e.printStackTrace();
		}
		return date;
	}
}