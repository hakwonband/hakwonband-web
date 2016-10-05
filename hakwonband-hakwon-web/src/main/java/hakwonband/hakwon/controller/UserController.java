package hakwonband.hakwon.controller;

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
import hakwonband.hakwon.model.DevicePushData;
import hakwonband.hakwon.service.AsyncService;
import hakwonband.hakwon.service.UserService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 회원 컨트롤러
 * @author jrlim
 *
 */
@RequestMapping("/hakwon")
@Controller
public class UserController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(HakwonController.class);

	@Autowired
	private UserService userService;

	@Autowired
	private AsyncService asyncService;

	/**
	 * 사용자 학원 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/userHakwonList")
	public void userHakwonList(HttpServletRequest request, HttpServletResponse response) {

		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap colData = userService.userHakwonList(authUserInfo);

		sendColData(colData, request, response);
	}

	/**
	 * 회원 상세정보 요청
	 * @param request
	 * @param response
	 */
	@RequestMapping("/userDetail")
	public void userDetail(HttpServletRequest request, HttpServletResponse response) {

		String user_no = request.getParameter("user_no");
		DataMap param = new DataMap();
		param.put("user_no", user_no);

		/* 회원 상세정보 요청 */
		DataMap userDetail = userService.userDetail(param);

		sendColData(userDetail, request, response);
	}

	/**
	 * 회원 탈퇴
	 * @param request
	 * @param response
	 */
	@RequestMapping("/memberOut")
	public void memberOut(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String comment = StringUtil.replaceNull(request.getParameter("comment"), "");
		authUserInfo.put("comment",	comment);

		DevicePushData devicePushData = userService.memberOut(authUserInfo);
		asyncService.pushMobileDevice(devicePushData);

		sendFlag(CommonConstant.Flag.success, request, response);
	}
}