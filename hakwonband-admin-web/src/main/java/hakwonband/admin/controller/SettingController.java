package hakwonband.admin.controller;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.service.ConfigService;
import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.util.DataMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 설정 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/admin")
@Controller
public class SettingController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(SettingController.class);

	@Resource(name = "messageSourceAccessor")
	protected MessageSourceAccessor messageSource;

	@Autowired
	private ConfigService configService;

	/**
	 * 베너 기본 가격 리스트
	 * @return
	 */
	@RequestMapping("/setting/bannerDefaultPriceList")
	public void bannerDefaultPriceList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		DataMap param = new DataMap();
		param.put("configKey", "advertise_default_price");

		/**
		 * 기본 가격 조회
		 */
		String configVal = configService.selectConfig(param);

		ObjectMapper mapper = new ObjectMapper();
		DataMap defaultPrice = mapper.readValue(configVal, DataMap.class);

		sendColData(defaultPrice, request, response);
	}

	/**
	 * 베너 기본 가격 저장
	 * @return
	 */
	@RequestMapping("/setting/bannerDefaultPriceSave")
	public void bannerDefaultPriceSave(HttpServletRequest request, HttpServletResponse response) throws Exception {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String [] sizeArray = request.getParameterValues("size");
		String [] priceArray = request.getParameterValues("price");

		DataMap priceMap = new DataMap();
		for(int i=0; i<sizeArray.length; i++) {
			String size		= sizeArray[i];
			String price	= priceArray[i];
			priceMap.put(size, price);
		}
		DataMap param = new DataMap();
		param.put("configKey", "advertise_default_price");
		param.put("configVal", (new ObjectMapper()).writeValueAsString(priceMap));
		param.put("userNo",		authUserInfo.getString("user_no"));

		/*	설정 저장	*/
		configService.updateConfig(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 광고 입금 계좌 정보
	 * @return
	 */
	@RequestMapping("/setting/advertiseBankInfo")
	public void advertiseBankInfo(HttpServletRequest request, HttpServletResponse response) throws Exception {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("configKey", "advertise_bank_info");

		String bankInfo = configService.selectConfig(param);

		DataMap colData = new DataMap();
		colData.put("bankInfo", bankInfo);

		sendColData(colData, request, response);
	}

	/**
	 * 광고 입금 계좌 정보 저장
	 * @return
	 */
	@RequestMapping("/setting/advertiseBankInfoSave")
	public void advertiseBankInfoSave(HttpServletRequest request, HttpServletResponse response) throws Exception {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("configKey", "advertise_bank_info");
		param.put("configVal", request.getParameter("bankInfo"));

		if( param.isNull("configVal") ) {
			sendFlag(CommonConstant.Flag.param_error, request, response);
		} else {
			/*	설정 업데이트	*/
			configService.updateConfig(param);
			sendFlag(CommonConstant.Flag.success, request, response);
		}
	}
}