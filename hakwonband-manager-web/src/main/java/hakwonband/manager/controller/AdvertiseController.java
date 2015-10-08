package hakwonband.manager.controller;

import hakwonband.common.BaseAction;
import hakwonband.manager.common.constant.HakwonConstant;
import hakwonband.manager.service.AdvertiseService;
import hakwonband.manager.service.CommonService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 광고 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/manager/edvertise")
@Controller
public class AdvertiseController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(AdvertiseController.class);

	@Autowired
	private AdvertiseService advertiseService;

	@Autowired
	private CommonService commonService;


	/**
	 * 베너 요청 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/bannerReqList")
	public void bannerReqList(HttpServletRequest request, HttpServletResponse response) {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale	= HakwonConstant.PageScale.ADVERTISE_REQ;

		/*	제목 및 학원명/원장	*/
		String searchText = StringUtil.replaceNull(request.getParameter("searchText"), "");

		/*	결제 여부	*/
		String depositYn = StringUtil.replaceNull(request.getParameter("depositYn"), "");


		DataMap param = new DataMap();
		param.put("userNo",			authUserInfo.getString("user_no"));
		param.put("managerNo",		authUserInfo.getString("manager_no"));
		param.put("searchText",		searchText);
		param.put("depositYn",		depositYn);
		param.put("startNo",		(pageNo-1)*pageScale);
		param.put("pageScale",		pageScale);
		param.put("hakwonNo",		request.getParameter("hakwonNo"));

		/**
		 * 광고 요청 리스트 및 카운트
		 */
		DataMap advertiseReqListData = advertiseService.advertiseReqList(param);
		advertiseReqListData.put("pageScale", pageScale);

		sendColData(advertiseReqListData, request, response);
	}

	/**
	 * 베너 요청 상세
	 * @param request
	 * @param response
	 */
	@RequestMapping("/bannerReqDetail")
	public void bannerReqDetail(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String reqNo = request.getParameter("reqNo");
		DataMap param = new DataMap();
		param.put("reqNo",		reqNo);
		param.put("managerNo",		authUserInfo.getString("manager_no"));

		/**
		 * 요청 정보 상세
		 */
		DataMap reqDetailData = advertiseService.reqDetailData(param);

		sendColData(reqDetailData, request, response);
	}

}