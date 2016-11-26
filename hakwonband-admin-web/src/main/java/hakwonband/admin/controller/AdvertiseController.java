package hakwonband.admin.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.common.exception.AlreadyAdvertiseDepositException;
import hakwonband.admin.service.AdvertisePriceService;
import hakwonband.admin.service.AdvertiseService;
import hakwonband.admin.service.CommonService;
import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 광고 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/admin/edvertise")
@Controller
public class AdvertiseController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(AdvertiseController.class);

	@Autowired
	private AdvertiseService advertiseService;

	@Autowired
	private AdvertisePriceService advertisePriceService;

	@Autowired
	private CommonService commonService;


	/**
	 * 광고 입금 리스트
	 * @return
	 */
	@RequestMapping("/bankDeposit/list")
	public void bankDepositList(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale	= HakwonConstant.PageScale.ADVERTISE_REQ;

		String mappingFlag	=	request.getParameter("mappingFlag");
		String searchType	=	request.getParameter("searchType");
		String searchText	=	request.getParameter("searchText");

		DataMap param = new DataMap();
		param.put("userNo",		authUserInfo.getString("user_no"));
		param.put("startNo",	(pageNo-1)*pageScale);
		param.put("pageScale",	pageScale);

		param.put("mappingFlag",mappingFlag);
		param.put("searchType",	searchType);
		param.put("searchText",	searchText);

		logger.debug("param["+param+"]");

		/*	입금 리스트	*/
		DataMap colData = advertiseService.getAdvertiseBankDepositList(param);
		colData.put("pageScale",		pageScale);

		sendColData(colData, request, response);
	}

	/**
	 * 광고 입금 정보
	 * @return
	 */
	@RequestMapping("/bankDeposit/view")
	public void bankDepositView(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("userNo",		authUserInfo.getString("user_no"));
		param.put("depositNo",	request.getParameter("depositNo"));

		logger.debug("param["+param+"]");

		/*	입금 정보	*/
		DataMap bankDepositInfo = advertiseService.getAdvertiseBankDepositInfo(param);

		DataMap colData = new DataMap();
		colData.put("bankDepositInfo",	bankDepositInfo);

		if( "Y".equals(request.getParameter("edit")) ) {
			param.put("codeGroup", "010");
			List<DataMap> bankList = commonService.getCodeList(param);
			colData.put("bankList", bankList);
		}

		sendColData(colData, request, response);
	}

	/**
	 * 입금 맵핑 광고 검색
	 * @return
	 */
	@RequestMapping("/bankDeposit/advertiseSearch")
	public void advertiseSearch(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("advertiseSearchText",	request.getParameter("advertiseSearchText"));

		logger.debug("param["+param+"]");

		/*	입금 정보	*/
		List<DataMap> advertiseList = advertiseService.advertiseSearch(param);

		sendList(advertiseList, request, response);
	}

	/**
	 * 광고 입금 등록
	 * @return
	 */
	@RequestMapping("/bankDeposit/write")
	public void bankDepositWrite(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("userNo",			authUserInfo.getString("user_no"));
		param.put("amount",			request.getParameter("amount"));
		param.put("bankCode",		request.getParameter("bankCode"));
		param.put("depositDate",	request.getParameter("depositDate"));
		param.put("depositName",	request.getParameter("depositName"));
		param.put("comment",		request.getParameter("comment"));
		param.put("advertiseReqNo",	request.getParameter("advertiseReqNo"));

		String flag = CommonConstant.Flag.fail;
		long depositNo = -1;
		try {
			depositNo = advertiseService.insertAdvertiseBankDeposit(param);
			flag = CommonConstant.Flag.success;
		} catch(AlreadyAdvertiseDepositException e) {
			flag = CommonConstant.Flag.already;
		}

		DataMap colData = new DataMap();
		colData.put("flag",			flag);
		colData.put("depositNo",	depositNo);

		sendColData(colData, request, response);
	}

	/**
	 * 광고 입금 수정
	 * @return
	 */
	@RequestMapping("/bankDeposit/edit")
	public void bankDepositEdit(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("userNo",			authUserInfo.getString("user_no"));
		param.put("depositNo",		request.getParameter("depositNo"));
		param.put("amount",			request.getParameter("amount"));
		param.put("bankCode",		request.getParameter("bankCode"));
		param.put("depositDate",	request.getParameter("depositDate"));
		param.put("depositName",	request.getParameter("depositName"));
		param.put("comment",		request.getParameter("comment"));

		advertiseService.updateAdvertiseBankDeposit(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 광고 입금 삭제
	 * @return
	 */
	@RequestMapping("/bankDeposit/delete")
	public void bankDepositDelete(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("userNo",			authUserInfo.getString("user_no"));
		param.put("depositNo",		request.getParameter("depositNo"));

		String flag = CommonConstant.Flag.fail;
		try {
			advertiseService.deleteAdvertiseBankDeposit(param);
			flag = CommonConstant.Flag.success;
		} catch(AlreadyAdvertiseDepositException e) {
			flag = CommonConstant.Flag.already;
		}

		sendFlag(flag, request, response);
	}

	/**
	 * 광고 입금 맵핑
	 * @return
	 */
	@RequestMapping("/bankDeposit/mapping")
	public void bankDepositMappging(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("userNo",			authUserInfo.getString("user_no"));
		param.put("depositYn",		"Y");
		/*	입금 번호	*/
		param.put("depositNo",		request.getParameter("depositNo"));
		/*	광고 번호	*/
		param.put("advertiseReqNo",	request.getParameter("advertiseReqNo"));

		/*	입금 맵핑	*/
		String flag = CommonConstant.Flag.fail;
		try {
			advertiseService.updateAdvertiseDepositMappging(param);
			flag = CommonConstant.Flag.success;
		} catch(AlreadyAdvertiseDepositException e) {
			flag = CommonConstant.Flag.already;
		}

		sendFlag(flag, request, response);
	}

	/**
	 * 광고 입금 취소 처리
	 * @param request
	 * @param response
	 */
	@RequestMapping("/bankDeposit/mappingCancel")
	public void mappingCancel(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("userNo",			authUserInfo.getString("user_no"));
		param.put("depositYn",		"N");
		/*	입금 번호	*/
		param.put("depositNo",		request.getParameter("depositNo"));
		/*	광고 번호	*/
		param.put("advertiseReqNo",	request.getParameter("advertiseReqNo"));

		/**
		 * 광고 입금처리 취소
		 */
		advertiseService.updateAdvertiseDepositMappgingCancel(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

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
		param.put("userNo",		authUserInfo.getString("user_no"));

		/**
		 * 요청 정보 상세
		 */
		DataMap reqDetailData = advertiseService.reqDetailData(param);

		sendColData(reqDetailData, request, response);
	}

	/**
	 * 베너 요청 중지
	 * @param request
	 * @param response
	 */
	@RequestMapping("/bannerStop")
	public void bannerStop(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String reqNo = request.getParameter("reqNo");
		DataMap param = new DataMap();
		param.put("reqNo",		reqNo);
		param.put("userNo",		authUserInfo.getString("user_no"));

		/**
		 * 요청 정보 중지
		 */
		DataMap colData = advertiseService.bannerStop(param);

		sendColData(colData, request, response);
	}

	/**
	 * 월별 가격 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/searchMonthPrice")
	public void searchMonthPrice(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("year", request.getParameter("year"));

		/*	월별 가격 리스트	*/
		List<DataMap> priceList = advertisePriceService.yearMonthPriceList(param);

		sendList(priceList, request, response);
	}

	/**
	 * 월별 가격 저장
	 * @param request
	 * @param response
	 */
	@RequestMapping("/saveMonthPrice")
	public void saveMonthPrice(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();

		String year = request.getParameter("year");
		param.put("year",	year);

		/**
		 * 월별 베너별 가격 정보
		 */
		List<DataMap> priceList = new ArrayList<DataMap>();
		for(int i=1; i<=4; i++) {
			for(int j=1; j<=12; j++) {
				String viewMonth = "";
				if( j < 10 ) {
					viewMonth = "0"+j;
				} else {
					viewMonth = String.valueOf(j);
				}
				DataMap priceInfo = new DataMap();

				String price = request.getParameter("price_"+i+"_"+viewMonth);
				priceInfo.put("price", price);
				priceInfo.put("user_no", authUserInfo.getString("user_no"));
				priceInfo.put("bannerSize", i);
				priceInfo.put("yearMonth", year+viewMonth);

				priceList.add(priceInfo);
			}
		}

		param.put("priceList",	priceList);

		/*	저장	*/
		advertisePriceService.insertMonthPrice(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}
}