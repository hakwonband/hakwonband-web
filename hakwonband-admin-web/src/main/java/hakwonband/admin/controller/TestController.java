package hakwonband.admin.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.model.DevicePushData;
import hakwonband.admin.service.AsyncService;
import hakwonband.admin.service.TestService;
import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 테스트 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/test")
@Controller
public class TestController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(TestController.class);

	@Autowired
	private TestService testService;

	@Autowired
	private AsyncService asyncService;

	/**
	 * 선생님 리스트
	 * @return
	 */
	@RequestMapping("/mailSend")
	public void mailSend(HttpServletRequest request, HttpServletResponse response) {

		String emailAddr = request.getParameter("emailAddr");

		DataMap param = new DataMap();
		param.put("emailAddr",	emailAddr);

		testService.mailSend(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 테스트 메시지 전송
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/msgSend")
	public void testMsgSend(HttpServletRequest request, HttpServletResponse response) {
		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String userNo	= request.getParameter("userNo");
		String message	= request.getParameter("message");


		int timeToLive = StringUtil.parseInt(request.getParameter("timeToLive"), 60);
		String collapseKey = request.getParameter("collapseKey");
		boolean delayWhileIdle = "true".equalsIgnoreCase(request.getParameter("delayWhileIdle"))?true:false;

		DataMap param = new DataMap();
		param.put("reciveUserNo",	userNo);
		param.put("message",		message);
		param.put("user_name",		authUserInfo.getString("user_name"));

		param.put("timeToLive",		timeToLive);
		param.put("collapseKey",	collapseKey);
		param.put("delayWhileIdle",	delayWhileIdle);


		DevicePushData devicePushData = testService.testMsgSend(param);
		asyncService.pushMobileDevice(devicePushData);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 테스트 멤버 처리
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/member")
	public void testMember(HttpServletRequest request, HttpServletResponse response) {

		testService.executeMember();

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 테스트 학부모 학원 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/parentHakwonRegist")
	public void parentHakwonRegist(HttpServletRequest request, HttpServletResponse response) {

		testService.executeParentHakwonRegist();

		sendFlag(CommonConstant.Flag.success, request, response);
	}
}