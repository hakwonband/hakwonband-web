package hakwonband.manager.controller;

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
import hakwonband.manager.common.constant.HakwonConstant;
import hakwonband.manager.model.DevicePushData;
import hakwonband.manager.service.AsyncService;
import hakwonband.manager.service.HakwonService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 학원 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/manager/hakwon")
@Controller
public class HakwonController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(HakwonController.class);

	@Autowired
	private HakwonService hakwonService;

	@Autowired
	private AsyncService asyncService;

	/**
	 * 학원 카테고리 리스트
	 * @param request
	 * @param response
	 * @param reqParam
	 *
	 * /manager/hakwon/cateList.do
	 *
	 */
	@RequestMapping("/cateList")
	public void hakwonCateList(HttpServletRequest request, HttpServletResponse response) {
		List<DataMap> hakwonCateList = hakwonService.hakwonCateList();

		sendList(hakwonCateList, request, response);
	}

	/**
	 * 학원 리스트
	 * 검색 조건
	 * 관리자가 등록한 학원인지 / 원장이 등록한 학원 인지.
	 * 검색 타입 : 학원명/원장명
	 *
	 * /manager/hakwon/list.do
	 * @return
	 */
	@RequestMapping("/list")
	public void hakwonList(HttpServletRequest request, HttpServletResponse response) {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale	= StringUtil.parseInt(request.getParameter("pageScale"), HakwonConstant.PageScale.HAKWON_LIST);

		DataMap param = new DataMap();
		param.put("userNo",		authUserInfo.getString("user_no"));
		param.put("managerNo",	authUserInfo.getString("manager_no"));

		param.put("startNo",	(pageNo-1)*pageScale);
		param.put("pageScale",	pageScale);

		/*	검색 조건	*/
		String searchSido		= request.getParameter("searchSido");
		String searchGugun		= request.getParameter("searchGugun");
		String searchCateCode	= request.getParameter("searchCateCode");
		param.put("sido",			searchSido);
		param.put("gugun",			searchGugun);
		param.put("hakwonCateCode",	searchCateCode);
		param.put("hakwonStatus",	request.getParameter("searchStatus"));
		param.put("searchText",		request.getParameter("searchText"));

		DataMap hakwonListData = hakwonService.hakwonList(param);
		hakwonListData.put("pageScale",	pageScale);

		sendColData(hakwonListData, request, response);
	}

	/**
	 * 학원 상세
	 * @param request
	 * @param response
	 * @url /admin/hakwon/detail.do
	 */
	@RequestMapping("/detail")
	public void hakwonDetail(HttpServletRequest request, HttpServletResponse response) {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("hakwonNo",	request.getParameter("hakwonNo"));
		param.put("managerNo",	authUserInfo.getString("manager_no"));

		DataMap colData = hakwonService.hakwonDetail(param);

		sendColData(colData, request, response);
	}

	/**
	 * 학원 소개정보
	 * @param request
	 * @param response
	 * @url /admin/hakwon/introDetail.do
	 */
	@RequestMapping("/introDetail")
	public void introDetail(HttpServletRequest request, HttpServletResponse response) {
		String hakwonNo = request.getParameter("hakwonNo");

		DataMap param = new DataMap();
		param.put("hakwonNo",			hakwonNo);
		param.put("file_parent_type",	CommonConstant.File.TYPE_INTRODUCTION);			// 파일타입 : 005 학원소개
		param.put("file_parent_no",		hakwonNo);		// 파일부모번호 : 학원번호

		sendColData(hakwonService.hakwonIntroDetail(param), request, response);
	}

	/**
	 * 학원 소개 미리보기 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/previewIntro")
	public void previewIntro(HttpServletRequest request, HttpServletResponse response) {
		/*	인증정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no",				authUserInfo.get("user_no"));
		param.put("receiveUserNo",			authUserInfo.get("user_no"));
		param.put("introduction",			request.getParameter("introduction"));
		param.put("hakwon_no",				request.getParameter("hakwon_no"));

		DataMap rtnMap = hakwonService.insertPreviewIntro(param);
		long preivewNo = rtnMap.getLong("previewNo");
		DevicePushData devicePushData = (DevicePushData)rtnMap.get("devicePushData");
		asyncService.pushMobileDevice(devicePushData);


		DataMap colData = new DataMap();
		colData.put("preivewNo",	preivewNo);

		sendColData(colData, request, response);
	}

	/**
	 * 학원 소개 수정 및 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/editHakwonIntro")
	public void editHakwonIntro(HttpServletRequest request, HttpServletResponse response) {
		/*	인증정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no",				authUserInfo.get("user_no"));
		param.put("manager_no",				authUserInfo.get("manager_no"));
		param.put("introduction",			request.getParameter("introduction"));
		param.put("hakwon_no",				request.getParameter("hakwon_no"));
		param.put("file_no_list", 			request.getParameter("fileList"));				// 업로드 파일 번호들
		param.put("reg_user_no",			authUserInfo.get("user_no"));					// 파일 등록자

		sendColData(hakwonService.updateHakwonIntro(param), request, response);
	}

}