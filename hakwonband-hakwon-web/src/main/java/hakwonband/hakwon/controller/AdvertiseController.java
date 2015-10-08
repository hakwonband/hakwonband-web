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
import hakwonband.hakwon.service.AdvertiseService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 광고 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/hakwon/edvertise")
@Controller
public class AdvertiseController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(AdvertiseController.class);

	@Autowired
	private AdvertiseService advertiseService;

	/**
	 * 광고 요청 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/advertiseReqList")
	public void advertiseReqList(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwonNo	= request.getParameter("hakwonNo");
		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale	= HakwonConstant.PageScale.ADVERTISE_REQ;

		DataMap param = new DataMap();
		param.put("hakwonNo",	hakwonNo);
		param.put("userNo",		authUserInfo.getString("user_no"));
		param.put("startNo",	(pageNo-1)*pageScale);
		param.put("pageScale",	pageScale);

		logger.debug("param["+param+"]");

		/*	광고 요청 리스트	*/
		List<DataMap> advertiseReqList = advertiseService.advertiseReqList(param);

		/*	광고 요청 카운트	*/
		int advertiseReqTotCount = advertiseService.advertiseReqTotCount(param);

		DataMap colData = new DataMap();
		colData.put("pageScale",		pageScale);
		colData.put("advertiseReqList",	advertiseReqList);
		colData.put("advertiseReqTotCount",	advertiseReqTotCount);

		sendColData(colData, request, response);
	}

	/**
	 * 광고 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/registAdvertise")
	public void registAdvertise(HttpServletRequest request, HttpServletResponse response) {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		/**
		 * 요청 학원 정보
		 */
		String hakwonNo		= request.getParameter("hakwonNo");
		String title		= request.getParameter("title");
		String bannerFileNo	= request.getParameter("bannerFileNo");

		/**
		 * 지역 파라미터
		 */
		String sido			= request.getParameter("sido");
		String gugun		= request.getParameter("gugun");

		/*	베너 크기	*/
		String bannerSize	= request.getParameter("bannerSize");
		String [] selectAdDataArray = request.getParameterValues("selectAdData");


		DataMap param = new DataMap();
		param.put("hakwonNo",		hakwonNo);
		param.put("title",			title);
		param.put("userNo",			authUserInfo.getString("user_no"));
		param.put("bannerFileNo",	bannerFileNo);
		param.put("bannerSize",		bannerSize);
		param.put("regUserNo",		authUserInfo.getString("user_no"));

		param.put("sido",			sido);
		param.put("gugun",			gugun);

		param.put("selectAdDataArray",	selectAdDataArray);

		/*	광고 등록	*/
		long advertiseReqNo = advertiseService.registAdvertise(param);
		DataMap colData = new DataMap();
		colData.put("advertiseReqNo",	advertiseReqNo);
		sendColData(colData, request, response);
	}

	/**
	 * 광고 수정
	 * 타이틀과 베너만 추가 할 수 있다.
	 * @param request
	 * @param response
	 */
	@RequestMapping("/modifyAdvertise")
	public void modifyAdvertise(HttpServletRequest request, HttpServletResponse response) {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		/**
		 * 요청 학원 정보
		 */
		String advertiseReqNo	= request.getParameter("advertiseReqNo");
		String hakwonNo			= request.getParameter("hakwonNo");
		String title			= request.getParameter("title");
		String bannerFileNo		= request.getParameter("bannerFileNo");

		DataMap param = new DataMap();
		param.put("hakwonNo",		hakwonNo);
		param.put("title",			title);
		param.put("userNo",			authUserInfo.getString("user_no"));
		param.put("advertiseReqNo",	advertiseReqNo);
		param.put("bannerFileNo",	bannerFileNo);
		param.put("regUserNo",		authUserInfo.getString("user_no"));

		/*	광고 등록	*/
		advertiseService.updateAdvertise(param);
		sendFlag(CommonConstant.Flag.success, request, response);
	}


	/**
	 * 요청 정보
	 * @param request
	 * @param response
	 */
	@RequestMapping("/detail")
	public void detail(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String reqNo = request.getParameter("reqNo");
		DataMap param = new DataMap();
		param.put("reqNo",		reqNo);
		param.put("userNo",		authUserInfo.getString("user_no"));

		/**
		 * 요청 정보 상세
		 */
		DataMap reqDetailData = advertiseService.reqDetailData(param);

		sendColData(reqDetailData, request, response);
	}

	/**
	 * 구군 리스트
	 * @param param
	 * @return
	 */
	@RequestMapping("/regDongBannerList")
	public void regDongBannerList(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();

		String sido		= request.getParameter("sido");
		String gugun	= request.getParameter("gugun");
		String hakwonNo	= request.getParameter("hakwonNo");
		param.put("sido",		sido);
		param.put("gugun",		gugun);
		param.put("hakwonNo",	hakwonNo);

		DataMap localRegBanner = advertiseService.localRegBannerList(param);

		sendColData(localRegBanner, request, response);
	}

	/**
	 * 광고 취소
	 * @param param
	 * @return
	 */
	@RequestMapping("/advertiseCancel")
	public void advertiseCancel(HttpServletRequest request, HttpServletResponse response) {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String reqNo = request.getParameter("reqNo");
		DataMap param = new DataMap();
		param.put("reqNo",		reqNo);
		param.put("userNo",		authUserInfo.getString("user_no"));

		advertiseService.executeAdvertiseCancel(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}


	/**
	 * 광고 월별, 베너 크기별 가격 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/advertiseMonthPrice")
	public void advertiseMonthPrice(HttpServletRequest request, HttpServletResponse response) {

		/**
		 * 월별, 베너별 가격 리스트
		 */
		DataMap monthBannerPrice = advertiseService.advertiseMonthPrice();
		DataMap colData = new DataMap();
		colData.put("monthBannerPrice",	monthBannerPrice);

		sendColData(colData, request, response);
	}
}