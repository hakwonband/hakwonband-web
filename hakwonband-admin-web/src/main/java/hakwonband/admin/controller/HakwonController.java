package hakwonband.admin.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.model.DevicePushData;
import hakwonband.admin.service.AsyncService;
import hakwonband.admin.service.HakwonService;
import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;
import net.logstash.logback.encoder.org.apache.commons.lang.RandomStringUtils;

/**
 * 학원 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/admin/hakwon")
@Controller
public class HakwonController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(HakwonController.class);

	@Autowired
	private HakwonService hakwonService;

	@Autowired
	private AsyncService asyncService;

	/**
	 * 학원 리스트
	 * 검색 조건
	 * 관리자가 등록한 학원인지 / 원장이 등록한 학원 인지.
	 * 검색 타입 : 학원명/원장명
	 *
	 * /admin/hakwon/list.do
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

		param.put("startNo",	(pageNo-1)*pageScale);
		param.put("pageScale",	pageScale);

		/*	시도 구군	*/
		param.put("sido", request.getParameter("sido"));
		param.put("gugun", request.getParameter("gugun"));

		/*	관리자 등록 여부	*/
		param.put("adminRegYn", request.getParameter("adminRegYn"));



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
	 * 학원 등록
	 * @param request
	 * @param response
	 * @param reqParam
	 */
	@RequestMapping("/regist")
	public void hakwonRegist(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("userNo",		authUserInfo.getString("user_no"));

		/*	관리자 등록 여부	*/
		param.put("adminRegYn", "Y");

		String oldAddr1		= StringUtil.replaceNull(request.getParameter("oldAddr1"), "");
		String oldAddr2		= StringUtil.replaceNull(request.getParameter("oldAddr2"), "");
		String streetAddr1	= StringUtil.replaceNull(request.getParameter("streetAddr1"), "");
		String streetAddr2	= StringUtil.replaceNull(request.getParameter("streetAddr2"), "");

		/**
		 * 학원 정보
		 */
		param.put("hakwonCode",	RandomStringUtils.randomAlphanumeric(10));
		param.put("hakwonCate",	request.getParameter("hakwonCate"));
		param.put("hakwonName",	request.getParameter("hakwonName"));
		param.put("telNo",		request.getParameter("telNo"));
		param.put("logoFileNo",	request.getParameter("logoFileNo"));

		param.put("addrNo",		request.getParameter("addrNo"));

		param.put("oldAddr1",	oldAddr1);
		param.put("oldAddr2",	oldAddr2);
		param.put("streetAddr1",	streetAddr1);
		param.put("streetAddr2",	streetAddr2);

		/*	모든 주소 텍스트 더한다.	*/
		param.put("allAddrText",	oldAddr1+oldAddr2+streetAddr1+streetAddr2);

		if( param.isNull("addrNo") || param.isNull("hakwonCate") || param.isNull("hakwonName") ) {
			throw new HKBandException("파라미터 오류");
		}

		/*	학원 등록	*/
		long hakwonNo = hakwonService.insertHakwon(param);

		DataMap colData = new DataMap();
		colData.put("hakwonNo",	hakwonNo);

		sendColData(colData, request, response);
	}

	/**
	 * 학원 수정 정보
	 * @param request
	 * @param response
	 */
	@RequestMapping("/modifyInfo")
	public void hakwonModifyInfo(HttpServletRequest request, HttpServletResponse response) {
		DataMap param = new DataMap();
		param.put("hakwonNo",	request.getParameter("hakwonNo"));
		param.put("adminRegYn",	"Y");		//	관리자 학원만 조회

		DataMap hakwonModifyInfo = hakwonService.hakwonModifyInfo(param);

		sendColData(hakwonModifyInfo, request, response);
	}

	/**
	 * 관리자 학원 수정
	 * @param request
	 * @param response
	 */
	@RequestMapping("/adminModify")
	public void adminModify(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("userNo",		authUserInfo.getString("user_no"));

		/*	관리자 등록 여부	*/
		param.put("adminRegYn", "Y");

		String hakwonNo		= request.getParameter("hakwonNo");

		String oldAddr1		= StringUtil.replaceNull(request.getParameter("oldAddr1"), "");
		String oldAddr2		= StringUtil.replaceNull(request.getParameter("oldAddr2"), "");
		String streetAddr1	= StringUtil.replaceNull(request.getParameter("streetAddr1"), "");
		String streetAddr2	= StringUtil.replaceNull(request.getParameter("streetAddr2"), "");

		/**
		 * 학원 정보
		 */
		param.put("hakwonNo",	hakwonNo);
		param.put("hakwonCode",	RandomStringUtils.randomAlphanumeric(10));
		param.put("hakwonCate",	request.getParameter("hakwonCate"));
		param.put("hakwonName",	request.getParameter("hakwonName"));
		param.put("telNo",		request.getParameter("telNo"));
		param.put("logoFileNo",	request.getParameter("logoFileNo"));

		param.put("addrNo",	request.getParameter("addrNo"));

		param.put("oldAddr1",	oldAddr1);
		param.put("oldAddr2",	oldAddr2);
		param.put("streetAddr1",	streetAddr1);
		param.put("streetAddr2",	streetAddr2);

		/*	모든 주소 텍스트 더한다.	*/
		param.put("allAddrText",	oldAddr1+oldAddr2+streetAddr1+streetAddr2);

		/*	학원 수정	*/
		hakwonService.modifyHakwon(param);

		DataMap colData = new DataMap();
		colData.put("hakwonNo",	hakwonNo);

		sendColData(colData, request, response);
	}

	/**
	 * 학원 삭제
	 * @param request
	 * @param response
	 */
	@RequestMapping("/adminDelete")
	public void adminDelete(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("userNo",		authUserInfo.getString("user_no"));

		/*	관리자 등록 여부	*/
		param.put("adminRegYn", "Y");

		String hakwonNo		= request.getParameter("hakwonNo");

		/**
		 * 학원 정보
		 */
		param.put("hakwonNo",	hakwonNo);

		/*	학원 수정	*/
		hakwonService.adminDelete(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 학원 상세
	 * @param request
	 * @param response
	 * @url /admin/hakwon/detail.do
	 */
	@RequestMapping("/detail")
	public void hakwonDetail(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("hakwonNo",		request.getParameter("hakwonNo"));

		DataMap colData = hakwonService.hakwonDetail(param);

		sendColData(colData, request, response);
	}

	/**
	 * 학원 상태 업데이트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/status")
	public void hakwonStatus(HttpServletRequest request, HttpServletResponse response) {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String message = request.getParameter("message");
		message = StringUtils.replace(message, CommonConstant.LINE_SEPARATOR, "<br />");

		DataMap param = new DataMap();
		param.put("hakwonNo",	request.getParameter("hakwonNo"));
		param.put("status",		request.getParameter("status"));
		param.put("message",	message);
		param.put("userNo",		authUserInfo.getString("user_no"));

		DevicePushData devicePushData = hakwonService.executeHakwonStatus(param);
		asyncService.pushMobileDevice(devicePushData);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 학원 반 리스트
	 * @param request
	 * @param response
	 * @url /admin/hakwon/classList.do
	 */
	@RequestMapping("/classList")
	public void classList(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("hakwonNo",		request.getParameter("hakwonNo"));

		List<DataMap> classList = hakwonService.hakwonClassList(param);

		sendList(classList, request, response);
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
		param.put("introduction",			request.getParameter("introduction"));
		param.put("hakwon_no",				request.getParameter("hakwon_no"));
		param.put("file_no_list", 			request.getParameter("fileList"));			// 업로드 파일 번호들
		param.put("reg_user_no",			authUserInfo.get("user_no"));					// 파일 등록자

		sendColData(hakwonService.updateHakwonIntro(param), request, response);
	}
}