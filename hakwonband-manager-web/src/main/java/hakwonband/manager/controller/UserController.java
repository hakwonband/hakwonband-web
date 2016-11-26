package hakwonband.manager.controller;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.manager.common.constant.HakwonConstant;
import hakwonband.manager.service.UserService;
import hakwonband.util.DataMap;
import hakwonband.util.SecuUtil;
import hakwonband.util.StringUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 멤버 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/manager")
@Controller
public class UserController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(UserController.class);

	@Autowired
	private UserService userService;

	/**
	 * 개인정보 상세조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/userDetail")
	public void masterReqDetail(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no", authUserInfo.getString("user_no"));

		/* 상세정보 조회 */
		DataMap userInfo = userService.userDetail(param);

		DataMap colData = new DataMap();
		colData.put("userInfo", userInfo);

		sendColData(colData, request, response);
	}

	/**
	 * 원장 개인정보 수정
	 * @param request
	 * @param response
	 */
	@RequestMapping("/editUserInfo")
	public void editUserInfo(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo	= (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String user_email		= request.getParameter("user_email");
		String user_password	= request.getParameter("user_password");
		String user_name		= request.getParameter("user_name");
		String user_gender		= request.getParameter("user_gender");
		String user_birthday 	= request.getParameter("user_birthday");
		String tel1_no 			= request.getParameter("tel1_no");
		String tel2_no 			= request.getParameter("tel2_no");

		DataMap param = new DataMap();
		param.put("user_email",		user_email);
		if (StringUtil.isNotNull(user_password)) {
			param.put("user_password",	SecuUtil.sha256(user_password));
		}
		param.put("user_name", 		user_name);
		param.put("user_gender", 	user_gender);
		param.put("user_birthday", 	user_birthday);
		param.put("tel1_no", 		tel1_no);
		param.put("tel2_no", 		tel2_no);
		param.put("user_no", 		authUserInfo.get("user_no"));

		/* 원장 기본정보 및 부가정보 수정 */
		userService.updateUserInfo(param);

		sendFlag(CommonConstant.Flag.success, request, response);
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

		userService.memberOut(authUserInfo);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 알림 off
	 * @param request
	 * @param response
	 */
	@RequestMapping("/alarmSave")
	public void alarmSave(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String alarm_type	= request.getParameter("alarm_type");
		String start_time	= request.getParameter("start_time");
		String end_time		= request.getParameter("end_time");

		if( "Y".equals(alarm_type) == false ) {
			start_time = null;
			end_time = null;
		}

		userService.updateUserAlarmOff(authUserInfo.getLong("user_no"), start_time, end_time);

		DataMap rtnMap = new DataMap();
		rtnMap.put("flag",	CommonConstant.Flag.success);

		sendColData(rtnMap, request, response);
	}
}