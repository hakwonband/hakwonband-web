package hakwonband.hakwon.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.service.HakwonService;
import hakwonband.hakwon.service.SettingService;
import hakwonband.util.DataMap;

/**
 * 셋팅 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/hakwon/setting")
@Controller
public class SettingController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(SettingController.class);

	@Autowired
	private SettingService settingService;

	@Autowired
	private HakwonService hakwonService;

	/**
	 * 공지 카테고리 리스트
	 * @return
	 */
	@RequestMapping("/noticeCateList")
	public void noticeCateList(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("hakwonNo",		request.getParameter("hakwonNo"));

		List<DataMap> noticeCateList = settingService.noticeCateList(param);

		sendList(noticeCateList, request, response);
	}

	/**
	 * 공지 카테고리 삭제
	 * @param request
	 * @param response
	 */
	@RequestMapping("/deleteNoticeCate")
	public void deleteNoticeCate(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("hakwonNo",	request.getParameter("hakwonNo"));
		param.put("cateNo", 	request.getParameter("cateNo"));

		String flag = settingService.deleteNoticeCate(param);

		sendFlag(flag, request, response);
	}

	/**
	 * 공지 카테고리 수정
	 * @param request
	 * @param response
	 */
	@RequestMapping("/modifyNoticeCate")
	public void modifyNoticeCate(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("hakwonNo",	request.getParameter("hakwonNo"));
		param.put("cateNo",		request.getParameter("cateNo"));
		param.put("cateName",	request.getParameter("cateName"));
		param.put("cateOrder",	request.getParameter("cateOrder"));

		settingService.modifyNoticeCate(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 공지 카테고리 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/insertNoticeCate")
	public void insertNoticeCate(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("hakwonNo",	request.getParameter("hakwonNo"));
		param.put("cateName",	request.getParameter("cateName"));
		param.put("cateOrder",	request.getParameter("cateOrder"));

		settingService.insertNoticeCate(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 학원 매니저 정보
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonManagerInfo")
	public void hakwonManagerInfo(HttpServletRequest request, HttpServletResponse response) {
		DataMap param = new DataMap();
		param.put("hakwonNo",	request.getParameter("hakwonNo"));

		DataMap managerInfo = hakwonService.managerInfo(param);

		DataMap colData = new DataMap();
		colData.put("managerInfo", managerInfo);

		sendColData(colData, request, response);
	}

	/**
	 * 학원 매니저 검색
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonManagerSearch")
	public void hakwonManagerSearch(HttpServletRequest request, HttpServletResponse response) {
		DataMap param = new DataMap();
		param.put("searchText",	request.getParameter("searchText"));

		/*	매니저 검색	*/
		List<DataMap> managerList = hakwonService.managerSearch(param);

		sendList(managerList, request, response);
	}

	/**
	 * 학원 매니저 셋팅
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonManagerSetting")
	public void hakwonManagerSetting(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String hakwonNo		= request.getParameter("hakwonNo");
		String managerNo	= request.getParameter("managerNo");

		DataMap param = new DataMap();
		param.put("hakwonNo",	hakwonNo);
		param.put("managerNo",	managerNo);
		param.put("userNo",		authUserInfo.getString("user_no"));

		/*	매니저 셋팅	*/
		hakwonService.updateHakwonManager(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}
}