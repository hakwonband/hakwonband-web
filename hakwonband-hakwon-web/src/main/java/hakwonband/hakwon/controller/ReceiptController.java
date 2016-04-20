package hakwonband.hakwon.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.common.constant.HakwonConstant.PageScale;
import hakwonband.hakwon.component.ColumnModel;
import hakwonband.hakwon.component.ExcelComponent;
import hakwonband.hakwon.component.SheetModel;
import hakwonband.hakwon.service.ReceiptService;
import hakwonband.hakwon.util.HakwonUtilSupportBox;
import hakwonband.util.DataMap;
import hakwonband.util.DateUtil;
import hakwonband.util.StringUtil;

@RequestMapping("/hakwon/receipt")

@Controller
public class ReceiptController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(ReceiptController.class);

	@Autowired
	private ReceiptService receiptService;

	@Autowired
	private ExcelComponent excelComponent;

	/**
	 * 수납 등록
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/insert", method = RequestMethod.POST)
	public void insertReceipt(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwonNo = request.getParameter("hakwonNo");
		String studentNo = request.getParameter("studentNo");
		String receiptAmount = request.getParameter("receiptAmount");
		String receiptType = request.getParameter("receiptType");
		String receiptMethod = request.getParameter("receiptMethod");
		String receiptDesc = request.getParameter("receiptDesc");
		String receiptDate = request.getParameter("receiptDate");
		String[] receiptMonth = request.getParameterValues("receiptMonth");

		/* 수납등록 월의 유효성 체크. yyyyMM */
		if (receiptMonth == null || receiptMonth.length == 0) {
			// sendFlag(CommonConstant.Flag.param_error, request, response);
			// return;
		} else {
			for (String month : receiptMonth) {
				if (!HakwonUtilSupportBox.isValidDate(month, "yyyyMM")) {
					sendFlag(CommonConstant.Flag.param_error, request, response);
					return;
				}
			}
		}

		DataMap param = new DataMap();
		param.put("userNo", authUserInfo.get("user_no"));
		param.put("hakwonNo", hakwonNo);
		param.put("studentNo", studentNo);
		param.put("receiptAmount", receiptAmount);
		param.put("receiptType", receiptType);
		param.put("receiptMethod", receiptMethod);
		param.put("receiptDesc", receiptDesc);
		param.put("receiptDate", receiptDate);
		param.put("receiptMonth", receiptMonth);

		receiptService.insertReceipt(param);

		sendFlag(CommonConstant.Flag.success, request, response);

	}

	/**
	 * 학생 조회
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping("/student/select")
	public void selectStudent(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String studentName = request.getParameter("studentName");
		String studentId = request.getParameter("studentId");
		String hakwonNo = request.getParameter("hakwonNo");

		DataMap param = new DataMap();

		param.put("hakwonNo", hakwonNo);
		param.put("userNo", authUserInfo.get("user_no"));
		if (StringUtil.isNotBlank(studentId)) {
			param.put("studentId", studentId);
		} else {
			param.put("studentName", studentName);
		}

		List<DataMap> result = receiptService.selectStudent(param);

		DataMap colData = new DataMap();
		colData.put("students", result);
		sendColData(colData, request, response);

	}

	/**
	 * 학생의 학원수납 리스트 조회 (현재날짜로부터 1년)
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping("/student/month/get")
	public void selectStudentReceipt(HttpServletRequest request, HttpServletResponse response) {
		String hakwonNo = request.getParameter("hakwonNo");
		String studentNo = request.getParameter("studentNo");

		DataMap param = new DataMap();
		param.put("hakwonNo", hakwonNo);
		param.put("studentNo", studentNo);
		param.put("startDate", DateUtil.addMonth(DateUtil.getDate("yyyyMM"), -3, "yyyyMM"));

		List<DataMap> receiptList = receiptService.selectReceiptYear(param);
		sendList(receiptList, request, response);
	}

	/**
	 * 학생별 수납정보 조회
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list/year")
	public void selectReceiptYearList(HttpServletRequest request, HttpServletResponse response) {
		String hakwonNo		= request.getParameter("hakwonNo");
		String classNo		= request.getParameter("classNo");
		String searchType	= request.getParameter("searchType");
		String searchText	= request.getParameter("searchText");
		String registDay	= request.getParameter("registDay"); // 학생 등록일
		String searchYear	= request.getParameter("searchYear");
		int pageScale		= StringUtil.parseInt(request.getParameter("pageScale"), PageScale.STUDENT_LIST);

		int pageNo = StringUtil.parseInt(request.getParameter("pageNo"), 1);

		DataMap param = new DataMap();
		param.put("hakwonNo",	hakwonNo);
		param.put("classNo",	classNo);
		param.put("searchType",	searchType);
		param.put("searchText",	searchText);
		param.put("thisYear",	searchYear);
		param.put("startNo",	(pageNo - 1) * pageScale);
		param.put("pageScale",	pageScale);
		param.put("registDay",	registDay);

		List<DataMap> receiptList = null;
		int totalStudentCount = receiptService.selectTotalStudentCount(param);
		if (totalStudentCount > 0) {
			receiptList = receiptService.selectReceiptYearList(param);
		}

		param.clear();
		param.put("studentCount",	totalStudentCount);
		param.put("receiptList",	receiptList);
		param.put("pageNo",			pageNo);
		param.put("pageScale",		pageScale);
		sendColData(param, request, response);
	}

	/**
	 * 학생별 수납정보 조회
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list/yearExcel")
	public void selectReceiptYearExcel(HttpServletRequest request, HttpServletResponse response) {
		String hakwonNo		= request.getParameter("hakwonNo");
		String classNo		= request.getParameter("classNo");
		String searchType	= request.getParameter("searchType");
		String searchText	= request.getParameter("searchText");
		String registDay	= request.getParameter("registDay"); // 학생 등록일
		String searchYear	= request.getParameter("searchYear");

		int pageNo = StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale = PageScale.STUDENT_LIST;

		DataMap param = new DataMap();
		param.put("hakwonNo",	hakwonNo);
		param.put("classNo",	classNo);
		param.put("searchType",	searchType);
		param.put("searchText",	searchText);
		param.put("thisYear",	searchYear);
		param.put("startNo",	(pageNo - 1) * pageScale);
		param.put("pageScale",	pageScale);
		param.put("registDay",	registDay);

		List<DataMap> receiptList = receiptService.selectReceiptYearListAll(param);

		List<ColumnModel> headerList = new ArrayList<ColumnModel>();
		headerList.add(new ColumnModel("이름", "user_name"));
		headerList.add(new ColumnModel("아이디", "user_id"));
		headerList.add(new ColumnModel("반이름", "class_title"));
		headerList.add(new ColumnModel("등록일", "receipt_date"));
		headerList.add(new ColumnModel(searchYear+"년 01월", searchYear+"01"));
		headerList.add(new ColumnModel(searchYear+"년 02월", searchYear+"02"));
		headerList.add(new ColumnModel(searchYear+"년 03월", searchYear+"03"));
		headerList.add(new ColumnModel(searchYear+"년 04월", searchYear+"04"));
		headerList.add(new ColumnModel(searchYear+"년 05월", searchYear+"05"));
		headerList.add(new ColumnModel(searchYear+"년 06월", searchYear+"06"));
		headerList.add(new ColumnModel(searchYear+"년 07월", searchYear+"07"));
		headerList.add(new ColumnModel(searchYear+"년 08월", searchYear+"08"));
		headerList.add(new ColumnModel(searchYear+"년 09월", searchYear+"09"));
		headerList.add(new ColumnModel(searchYear+"년 10월", searchYear+"10"));
		headerList.add(new ColumnModel(searchYear+"년 11월", searchYear+"11"));
		headerList.add(new ColumnModel(searchYear+"년 12월", searchYear+"12"));

		String fileName = excelComponent.convertFileName(request.getHeader("User-Agent"), "수납정보");

		SheetModel sheetModel = new SheetModel(receiptList, headerList);
		excelComponent.writeExcel(response, sheetModel, fileName);
	}

	/**
	 * 수납 리스트 조회
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list")
	public void selectReceiptList(HttpServletRequest request, HttpServletResponse response) {
		String receiptDate = request.getParameter("receiptDate");
		String hakwonNo = request.getParameter("hakwonNo");
		String classNo = request.getParameter("classNo");
		String searchType = request.getParameter("searchType"); // 학생 이름 , 학생
																// 아이디
		String searchText = request.getParameter("searchText");
		String startDate = request.getParameter("startDate"); // 기간검색의 시간날짜
		String endDate = request.getParameter("endDate"); // 기간검색의 종료날짜
		String dateTerm = request.getParameter("dateTerm"); // 기간 타입 (001:오늘,
															// 002:일주일, 003:1개월,
															// 004:3개월, 005:6개월
															// , 006:12개월)
		String receiptType = request.getParameter("receiptType"); // 수납타입
																	// (001:입금,
																	// 002:출금)
		String receiptMethod = request.getParameter("receiptMethod"); // 수납 방법
																		// (001:카드,
																		// 002:현금,
																		// 003:계좌이체,
																		// 004:기타)

		String standardDate = DateUtil.getDate("yyyy-MM-dd");
		/* 기간타입으로 시간,종료 시간 설정 */
		if (StringUtil.isNotBlank(dateTerm)) {
			switch (dateTerm) {
			case "001":
				startDate = standardDate;
				endDate = standardDate;
				break;
			case "002":
				endDate = standardDate;
				startDate = HakwonUtilSupportBox.addDate(standardDate, -6, "yyyy-MM-dd");
				break;
			case "003":
				endDate = standardDate;
				startDate = DateUtil.addMonth(standardDate, -1, "yyyy-MM-dd");
				break;
			case "004":
				endDate = standardDate;
				startDate = DateUtil.addMonth(standardDate, -3, "yyyy-MM-dd");
				break;
			case "005":
				endDate = standardDate;
				startDate = DateUtil.addMonth(standardDate, -6, "yyyy-MM-dd");
				break;
			case "006":
				endDate = standardDate;
				startDate = DateUtil.addMonth(standardDate, -12, "yyyy-MM-dd");
				break;
			}

		}

		/* 시작, 종료 날짜 모두 공백일때, 디폴트 기간으로 현재달의 시작과 끝 날짜를 셋팅한다. */
		if (StringUtil.isBlank(startDate) && StringUtil.isBlank(endDate)) {
			startDate = standardDate.substring(0, 7);
			String[] startArr = startDate.split("-");
			endDate = startDate + "-"
					+ DateUtil.getLastDay(Integer.parseInt(startArr[0]), Integer.parseInt(startArr[1]));
			startDate += "-01";
		}

		int pageNo = StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale = StringUtil.parseInt(request.getParameter("pageScale"), PageScale.STUDENT_LIST);

		DataMap param = new DataMap();
		param.put("hakwonNo", hakwonNo);
		param.put("startNo", (pageNo - 1) * pageScale);
		param.put("pageScale", pageScale);
		param.put("receiptDate", receiptDate);
		param.put("classNo", classNo);
		param.put("startDate", startDate);
		param.put("endDate", HakwonUtilSupportBox.addDate(endDate, 1, "yyyy-MM-dd")); // 기간
																						// 검색할때,
																						// 다음날보다
																						// 작은날짜를
																						// 검색한다.
		param.put("searchType", searchType);
		param.put("searchText", searchText);
		param.put("receiptType", receiptType);
		param.put("receiptMethod", receiptMethod);

		/* 수납 리스트 카운트 */
		int receiptCount = receiptService.selectReceiptCount(param);

		/* 수납 리스트 조회 */
		List<DataMap> receiptList = null;
		if (receiptCount > 0) {
			receiptList = receiptService.selectReceiptList(param);
		}

		/* start ~ end 기간내의 전체 입금액, 출금액 */
		List<DataMap> inAndOutMoneySumList = receiptService.selectInAndOutMoneySum(param);

		param.clear();
		param.put("hakwonNo", hakwonNo);
		param.put("classNo", classNo);
		param.put("searchText", searchText);
		param.put("searchType", searchType);
		param.put("startDate", startDate);
		param.put("endDate", endDate);
		param.put("dateTerm", dateTerm);
		param.put("pageNo", String.valueOf(pageNo));
		param.put("pageScale", pageScale);
		param.put("receiptList", receiptList);
		param.put("receiptCount", String.valueOf(receiptCount));
		param.put("inAndOutMoneySumList", inAndOutMoneySumList);

		// param.put("classList", classList);

		sendColData(param, request, response);
	}

	/**
	 * 수납 리스트 조회
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping("/listExcel")
	public void selectReceiptListExcel(HttpServletRequest request, HttpServletResponse response) {
		String receiptDate = request.getParameter("receiptDate");
		String hakwonNo = request.getParameter("hakwonNo");
		String classNo = request.getParameter("classNo");
		String searchType = request.getParameter("searchType"); // 학생 이름 , 학생
																// 아이디
		String searchText = request.getParameter("searchText");
		String startDate = request.getParameter("startDate"); // 기간검색의 시간날짜
		String endDate = request.getParameter("endDate"); // 기간검색의 종료날짜
		String dateTerm = request.getParameter("dateTerm"); // 기간 타입 (001:오늘,
															// 002:일주일, 003:1개월,
															// 004:3개월, 005:6개월
															// , 006:12개월)
		String receiptType = request.getParameter("receiptType"); // 수납타입
																	// (001:입금,
																	// 002:출금)
		String receiptMethod = request.getParameter("receiptMethod"); // 수납 방법
																		// (001:카드,
																		// 002:현금,
																		// 003:계좌이체,
																		// 004:기타)

		String standardDate = DateUtil.getDate("yyyy-MM-dd");
		/* 기간타입으로 시간,종료 시간 설정 */
		if (StringUtil.isNotBlank(dateTerm)) {
			switch (dateTerm) {
			case "001":
				startDate = standardDate;
				endDate = standardDate;
				break;
			case "002":
				endDate = standardDate;
				startDate = HakwonUtilSupportBox.addDate(standardDate, -6, "yyyy-MM-dd");
				break;
			case "003":
				endDate = standardDate;
				startDate = DateUtil.addMonth(standardDate, -1, "yyyy-MM-dd");
				break;
			case "004":
				endDate = standardDate;
				startDate = DateUtil.addMonth(standardDate, -3, "yyyy-MM-dd");
				break;
			case "005":
				endDate = standardDate;
				startDate = DateUtil.addMonth(standardDate, -6, "yyyy-MM-dd");
				break;
			case "006":
				endDate = standardDate;
				startDate = DateUtil.addMonth(standardDate, -12, "yyyy-MM-dd");
				break;
			}

		}

		/* 시작, 종료 날짜 모두 공백일때, 디폴트 기간으로 현재달의 시작과 끝 날짜를 셋팅한다. */
		if (StringUtil.isBlank(startDate) && StringUtil.isBlank(endDate)) {
			startDate = standardDate.substring(0, 7);
			String[] startArr = startDate.split("-");
			endDate = startDate + "-"
					+ DateUtil.getLastDay(Integer.parseInt(startArr[0]), Integer.parseInt(startArr[1]));
			startDate += "-01";
		}

		int pageNo = StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale = PageScale.STUDENT_LIST;

		DataMap param = new DataMap();
		param.put("hakwonNo", hakwonNo);
		param.put("startNo", (pageNo - 1) * pageScale);
		param.put("pageScale", pageScale);
		param.put("receiptDate", receiptDate);
		param.put("classNo", classNo);
		param.put("startDate", startDate);
		param.put("endDate", HakwonUtilSupportBox.addDate(endDate, 1, "yyyy-MM-dd")); // 기간
																						// 검색할때,
																						// 다음날보다
																						// 작은날짜를
																						// 검색한다.
		param.put("searchType", searchType);
		param.put("searchText", searchText);
		param.put("receiptType", receiptType);
		param.put("receiptMethod", receiptMethod);


		List<SheetModel> sheetModelList = new ArrayList<SheetModel>();
		{
			/* start ~ end 기간내의 전체 입금액, 출금액 */
			List<DataMap> inAndOutMoneySumList = receiptService.selectInAndOutMoneySum(param);

			List<ColumnModel> headerList = new ArrayList<ColumnModel>();
			headerList.add(new ColumnModel("수납 타임", "receipt_type_name"));
			headerList.add(new ColumnModel("금액", "money"));

			sheetModelList.add(new SheetModel(inAndOutMoneySumList, headerList, "금액 합계"));
		}

		{
			/* 수납 리스트 조회 */
			List<DataMap> receiptList = receiptService.selectReceiptListAll(param);

			List<ColumnModel> headerList = new ArrayList<ColumnModel>();
			headerList.add(new ColumnModel("이름", "user_name"));
			headerList.add(new ColumnModel("아이디", "user_id"));
			headerList.add(new ColumnModel("등록일", "receipt_date"));
			headerList.add(new ColumnModel("수납타입", "receipt_type_name"));
			headerList.add(new ColumnModel("수납방법", "receipt_method_name"));
			headerList.add(new ColumnModel("금액", "receipt_amount"));
			headerList.add(new ColumnModel("내용", "receipt_desc"));

			sheetModelList.add(new SheetModel(receiptList, headerList, "수납 리스트"));
		}


		String fileName = excelComponent.convertFileName(request.getHeader("User-Agent"), "기간별 수납 리스트");
		excelComponent.writeExcel(response, sheetModelList, fileName);
	}

	/**
	 * 반 조회
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping("/class/list")
	public void selectClassList(HttpServletRequest request, HttpServletResponse response) {

		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String hakwonNo = request.getParameter("hakwonNo");

		DataMap param = new DataMap();
		param.put("hakwonNo", hakwonNo);
		param.put("userType", authUserInfo.getString("user_type"));
		param.put("userNo", authUserInfo.getString("user_no"));

		/* 반 리스트 조회 */
		List<DataMap> classList = receiptService.selectClassList(param);

		DataMap colData = new DataMap();
		colData.put("classList", classList);

		sendColData(colData, request, response);
	}

	/**
	 * 상세 조회
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping("/detail")
	public void selectReceiptDetail(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String receiptNo = request.getParameter("receiptNo");

		DataMap param = new DataMap();
		param.put("receiptNo", receiptNo);

		/* 반 리스트 조회 */
		DataMap receipt = receiptService.selectReceiptDetail(param);
		if (authUserInfo.equals("user_type", "003")) {
			receipt.put("isWonjang", "true");
		}

		sendColData(receipt, request, response);
	}

	/**
	 * 수납 정보 수정
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping("/update")
	public void updateReceipt(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwonNo = request.getParameter("hakwonNo");
		String receiptNo = request.getParameter("receiptNo");
		String studentNo = request.getParameter("studentNo");
		String receiptAmount = request.getParameter("receiptAmount");
		String receiptType = request.getParameter("receiptType");
		String receiptMethod = request.getParameter("receiptMethod");
		String receiptDesc = request.getParameter("receiptDesc");
		String receiptDate = request.getParameter("receiptDate");
		String receiptMonthHashChanged = request.getParameter("receiptMonthHashChanged"); // receipt
																							// month
																							// 값이
																							// 변경되었는지
		String receiptMonth[] = request.getParameterValues("receiptMonth");

		DataMap param = new DataMap();
		param.put("userNo", authUserInfo.get("user_no"));
		param.put("hakwonNo", hakwonNo);
		param.put("receiptNo", receiptNo);
		param.put("idx", receiptNo);
		param.put("studentNo", studentNo);
		param.put("receiptAmount", receiptAmount);
		param.put("receiptType", receiptType);
		param.put("receiptMethod", receiptMethod);
		param.put("receiptDesc", receiptDesc);
		param.put("receiptDate", receiptDate);
		param.put("receiptMonthHashChanged", receiptMonthHashChanged);
		param.put("receiptMonth", receiptMonth);

		if (authUserInfo.equals("user_type", "003")) {
			param.put("isWonjang", "true");
		}

		receiptService.updateReceipt(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 수납 삭제
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping("/delete")
	public void deleteReceipt(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String receiptNo = request.getParameter("receiptNo");
		String studentNo = request.getParameter("studentNo");
		String receiptAmount = request.getParameter("receiptAmount");
		String receiptType = request.getParameter("receiptType");
		String receiptMethod = request.getParameter("receiptMethod");
		String receiptDesc = request.getParameter("receiptDesc");
		String receiptDate = request.getParameter("receiptDate");

		DataMap param = new DataMap();
		param.put("userNo", authUserInfo.get("user_no"));

		if (authUserInfo.equals("user_type", "003")) {
			param.put("isWonjang", "true");
		}

		param.put("receiptNo", receiptNo);
		param.put("studentNo", studentNo);
		param.put("receiptAmount", receiptAmount);
		param.put("receiptType", receiptType);
		param.put("receiptMethod", receiptMethod);
		param.put("receiptDesc", receiptDesc);
		param.put("receiptDate", receiptDate);

		receiptService.deleteReceipt(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}
}