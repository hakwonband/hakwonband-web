package hakwonband.hakwon.controller;

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
import hakwonband.hakwon.service.CounselService;
import hakwonband.hakwon.util.HakwonUtilSupportBox;
import hakwonband.util.DataMap;
import hakwonband.util.DateUtil;
import hakwonband.util.StringUtil;

@RequestMapping("/hakwon/counsel")
@Controller
public class CounselController extends BaseAction {

	private static final Logger logger = LoggerFactory.getLogger(CounselController.class);

	@Autowired
	private CounselService counselService;

	/**
	 * 상담 내용 입력
	 * @param request
	 * @param response
	 */
	@RequestMapping(value="/insert", method=RequestMethod.POST)
	public void insertCounsel(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwonNo		= request.getParameter("hakwonNo");
		String counseleeNo	= request.getParameter("counseleeNo");
//		String title		= request.getParameter("title");
		String content		= request.getParameter("content");
		String couselDate	= request.getParameter("counselDate");
		String fileNoArr[]	= request.getParameterValues("fileNoArr");
		String fileList		= "";
		if(fileNoArr != null && fileNoArr.length > 0) {
			for(int i=0,imax=fileNoArr.length; i<imax; i++) {
				if(i != 0) fileList += ",";
				fileList += fileNoArr[i];
			}
		}

		String title = "";
		if( content.length() > 50 ) {
			title = content.substring(0, 50);
		} else {
			title = content;
		}

		DataMap param = new DataMap();
		param.put("hakwonNo", hakwonNo);
		param.put("counseleeNo", counseleeNo);
		param.put("counsellorNo", authUserInfo.get("user_no"));
		param.put("title", title);
		param.put("content", content);
		param.put("couselDate", couselDate);
		param.put("fileList", fileList);

		/*	상담 입력	*/
		counselService.insertCounsel(param);

		sendFlag(CommonConstant.Flag.success, request, response);

	}

	/**
	 * 상담 내용 수정
	 * @param request
	 * @param response
	 */
	@RequestMapping(value="/update", method=RequestMethod.POST)
	public void updateCounsel(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String counselNo	= request.getParameter("counselNo");
		String counseleeNo	= request.getParameter("counseleeNo");
		String content		= request.getParameter("content");
		String couselDate	= request.getParameter("counselDate");

		String title = "";
		if( content.length() > 50 ) {
			title = content.substring(0, 50);
		} else {
			title = content;
		}

		DataMap param = new DataMap();
		param.put("counselNo",		counselNo);
		param.put("counseleeNo",	counseleeNo);
		param.put("counsellorNo",	authUserInfo.get("user_no"));
		param.put("userNo",			authUserInfo.get("user_no"));
		param.put("title",			title);
		param.put("content",		content);
		param.put("couselDate",		couselDate);

		if( authUserInfo.equals("user_type", "003") ) {
			param.put("isWonjang",	"true");
		}

		/*	상담 수정	*/
		counselService.updateCounsel(param);

		sendFlag(CommonConstant.Flag.success, request, response);

	}

	/**
	 * 이름으로 상담자 검색
	 * @param request
	 * @param response
	 */
	@RequestMapping("/counselee/select")
	public void selectCounselee(HttpServletRequest request, HttpServletResponse response) {
		String hakwonNo = request.getParameter("hakwonNo");
		String counseleeName = request.getParameter("counseleeName");

		DataMap param = new DataMap();
		param.put("hakwonNo", hakwonNo);
		param.put("counseleeName", counseleeName);

		List<DataMap> counseleeList = counselService.selcetCounselee(param);

		DataMap colData = new DataMap();
		colData.put("counseleeList", counseleeList);
		sendColData(colData, request, response);
	}

	/**
	 * 상담 리스트 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list")
	public void selectCounselList(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		// TODO : 상담 리스트 조회의 권한은 어떻게?? 학원 선생님이면 아무나 조회가 가능? 아니면 본인이 등록한 상담만 조회 가능? 원장 선생님은 학원의 모든 상담 조회 가능?
		// 상담 전용 아이디?가 있다면 해당 계정에만 모든 상담에 대한 조회 가능?

		String hakwonNo			= request.getParameter("hakwonNo");
		String startDate		= request.getParameter("startDate");
		String endDate			= request.getParameter("endDate");
		String classNo			= request.getParameter("classNo");
		String counseleeType	= request.getParameter("counseleeType");
		String searchType		= request.getParameter("searchType");
		String searchText		= request.getParameter("searchText");
		String dateTerm			= request.getParameter("dateTerm");			// 기간 타입 (001:오늘, 002:일주일, 003:1개월, 004:3개월, 005:6개월 , 006:12개월)
		String pageNo			= hakwonband.util.StringUtil.replaceNull( request.getParameter("pageNo"), "1");		// 현재 페이지 번호
		int pageScale			= StringUtil.parseInt(request.getParameter("pageScale"), PageScale.STUDENT_LIST);

		int startNo		= (Integer.parseInt(pageNo) -1) * pageScale;

		String standardDate = DateUtil.getDate("yyyy-MM-dd");
		/*	기간타입으로 시간,종료 시간 설정	*/
		if(StringUtil.isNotBlank(dateTerm)) {
			switch(dateTerm) {
			case "001" :
				startDate = standardDate;
				endDate = standardDate;
				break;
			case "002" :
				endDate = standardDate;
				startDate = HakwonUtilSupportBox.addDate(standardDate, -6, "yyyy-MM-dd");
				break;
			case "003" :
				endDate = standardDate;
				startDate = DateUtil.addMonth(standardDate, -1, "yyyy-MM-dd");
				break;
			case "004" :
				endDate = standardDate;
				startDate = DateUtil.addMonth(standardDate, -3, "yyyy-MM-dd");
				break;
			case "005" :
				endDate = standardDate;
				startDate = DateUtil.addMonth(standardDate, -6, "yyyy-MM-dd");
				break;
			case "006" :
				endDate = standardDate;
				startDate = DateUtil.addMonth(standardDate, -12, "yyyy-MM-dd");
				break;
			}

		}

		/*	시작, 종료 날짜 모두 공백일때, 디폴트 기간으로 현재달의 시작과 끝 날짜를 셋팅한다.	*/
		if(StringUtil.isBlank(startDate) && StringUtil.isBlank(endDate)) {
			startDate = standardDate.substring(0,7);
			String[] startArr = startDate.split("-");
			endDate = startDate + "-" + DateUtil.getLastDay(Integer.parseInt(startArr[0]), Integer.parseInt(startArr[1]));
			startDate += "-01";
		}


		DataMap param = new DataMap();
		param.put("hakwonNo",		hakwonNo);
		param.put("counseleeType",	counseleeType);
		param.put("userNo",			authUserInfo.get("user_no"));
		param.put("userType",		authUserInfo.get("user_type"));	// user type으로 상담 조회 권한이 구분됨. 원장님 : 전체 조회 가능, 선생님 : 본인이 등록한 상담만 조회 가능
		param.put("startDate",		startDate);
		param.put("endDate",		endDate);
		param.put("classNo",		classNo);
		param.put("searchType",		searchType);
		param.put("searchText",		searchText);
		param.put("startNo",		startNo);
		param.put("pageScale",		pageScale);

		if( authUserInfo.equals("user_type", "003") ) {
			param.put("isWonjang",	"true");
		}


		int counselCount = counselService.selectCounselCount(param);

		/*	상담 리스트 조회	*/
		List<DataMap> counselList = null;
		if(counselCount > 0) {
			counselList = counselService.selectCounselList(param);
		}

		param.clear();
		param.put("hakwonNo",		hakwonNo);
		param.put("startDate",		startDate);
		param.put("endDate",		endDate);
		param.put("classNo",		classNo);
		param.put("searchType",		searchType);
		param.put("searchText",		searchText);
		param.put("pageNo",			pageNo);
		param.put("pageScale",		pageScale);
		//param.put("classList",	classList);
		param.put("counselList",	counselList);
		param.put("counselCount",	String.valueOf(counselCount));

		sendColData(param, request, response);
	}

	@RequestMapping("/view")
	public void getCounselDetail(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		// TODO : 상담 리스트 조회의 권한은 어떻게?? 학원 선생님이면 아무나 조회가 가능? 아니면 본인이 등록한 상담만 조회 가능? 원장 선생님은 학원의 모든 상담 조회 가능?
		// 상담 전용 아이디?가 있다면 해당 계정에만 모든 상담에 대한 조회 가능?

		String hakwonNo = request.getParameter("hakwonNo");
		String counselNo = request.getParameter("counselNo");

		DataMap param = new DataMap();
		param.put("hakwonNo", hakwonNo);
		param.put("counselNo", counselNo);
		param.put("userNo", authUserInfo.get("user_no"));

		if( authUserInfo.equals("user_type", "003") ) {
			param.put("isWonjang",	"true");
		}

		/*	상담 리스트 조회	*/
		DataMap counsel = counselService.selectCounselDetail(param);

		sendColData(counsel, request, response);
	}

	@RequestMapping("/delete")
	public void deleteCounsel(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String counselNo = request.getParameter("counselNo");

		DataMap param = new DataMap();
		param.put("counselNo", counselNo);
		param.put("userNo", authUserInfo.get("user_no"));

		if( authUserInfo.equals("user_type", "003") ) {
			param.put("isWonjang",	"true");
		}

		/*	상담 삭제	*/
		counselService.deleteCounsel(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

}
