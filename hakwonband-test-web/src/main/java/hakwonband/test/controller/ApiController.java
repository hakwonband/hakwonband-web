package hakwonband.test.controller;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.test.model.ApiForm;
import hakwonband.test.service.ApiService;
import hakwonband.util.DataMap;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * api 컨트롤러
 * @author bumworld
 *
 */
@Controller
public class ApiController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(ApiController.class);

	@Resource(name = "messageSourceAccessor")
	protected MessageSourceAccessor messageSource;

	@Autowired
	private ApiService apiService;

	/**
	 * api 저장
	 * @return
	 */
	@RequestMapping("/apiSave")
	public void apiSave(@RequestBody ApiForm apiForm, HttpServletRequest request, HttpServletResponse response) {
		logger.debug("apiForm {}", apiForm);

		if( apiForm.getApiNo() <= 0 ) {
			long apiNo = apiService.insertApi(apiForm);
			logger.debug("apiNo : " + apiNo);
		} else {
			apiService.modifyApi(apiForm);
		}

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * api 조회
	 * @return
	 */
	@RequestMapping("/getApi")
	public void getApi(HttpServletRequest request, HttpServletResponse response) {

		String apiNo = request.getParameter("apiNo");

		ApiForm apiForm = new ApiForm();
		apiForm.setApiNo(Long.parseLong(apiNo));

		apiForm = apiService.selectApi(apiForm);

		DataMap sendData = new DataMap();
		sendData.put("apiForm", apiForm);

		sendColData(sendData, request, response);
	}


	/**
	 * api 리스트 조회
	 * @return
	 */
	@RequestMapping("/getApiList")
	public void getApiList(HttpServletRequest request, HttpServletResponse response) {

		String serviceType = request.getParameter("serviceType");
		String searchRegUserName = request.getParameter("searchRegUserName");

		ApiForm apiForm = new ApiForm();
		apiForm.setServiceType(serviceType);
		if( StringUtils.isNotBlank(searchRegUserName) ) {
			apiForm.setRegUserName(searchRegUserName);
		}

		List<ApiForm> apiList = apiService.selectApiList(apiForm);

		DataMap sendData = new DataMap();
		sendData.put("apiList", apiList);

		sendColData(sendData, request, response);
	}

	/**
	 * api 등록자 리스트 조회
	 * @return
	 */
	@RequestMapping("/selectApiRegUserList")
	public void selectApiRegUserList(HttpServletRequest request, HttpServletResponse response) {
		List<String> apiRegUserList = apiService.selectApiRegUserList();

		DataMap sendData = new DataMap();
		sendData.put("apiRegUserList", apiRegUserList);

		sendColData(sendData, request, response);
	}
}