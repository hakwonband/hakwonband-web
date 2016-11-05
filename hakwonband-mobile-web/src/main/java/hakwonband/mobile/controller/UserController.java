package hakwonband.mobile.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.mobile.common.constant.HakwonConstant;
import hakwonband.mobile.service.UserService;
import hakwonband.util.DataMap;
import hakwonband.util.SecuUtil;
import hakwonband.util.StringUtil;

/**
 * 회원 컨트롤러
 * @author jrlim
 *
 */
@RequestMapping("/mobile/user")
@Controller
public class UserController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(UserController.class);

	@Autowired
	private UserService userService;

	/**
	 * 내정보 요청
	 * @param request
	 * @param response
	 */
	@RequestMapping("/myInfoReqDetail")
	public void myInfoReqDetail(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no", 	authUserInfo.get("user_no"));
		param.put("user_type",	authUserInfo.get("user_type"));

		/* 내정보 요청 */
		DataMap userDetail = userService.userDetail(param);

		sendColData(userDetail, request, response);
	}

	/**
	 * 내정보 수정
	 * @param request
	 * @param response
	 */
	@RequestMapping("/editMyInfo")
	public void editMyInfo(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String user_name 		= request.getParameter("user_name");
		String user_password	= request.getParameter("user_password");
		String tel1_no 			= request.getParameter("tel1_no");
		String user_email		= StringUtil.replaceNull(request.getParameter("user_email"), null);
		String school_name 		= request.getParameter("school_name");
		String school_level 	= request.getParameter("school_level");
		String level 			= request.getParameter("level");
		String user_birthday 	= StringUtil.replaceNull(request.getParameter("birthday"), null);
		String user_gender	 	= StringUtil.replaceNull(request.getParameter("user_gender"), null);

		DataMap param = new DataMap();
		param.put("user_no", 		authUserInfo.get("user_no"));
		param.put("user_type",		authUserInfo.get("user_type"));
		param.put("user_name",		user_name);
		if (StringUtil.isNotNull(user_password)) {
			param.put("user_password",	SecuUtil.sha256(user_password));
		}
		param.put("tel1_no",		tel1_no);
		param.put("user_email",		user_email);
		param.put("school_name",	school_name);
		param.put("school_level",	school_level);
		param.put("level",			level);
		param.put("user_birthday",	user_birthday);
		param.put("user_gender",	user_gender);

		/* 내정보 수정 요청 */
		DataMap editUser = userService.editUser(param);

		sendColData(editUser, request, response);
	}

	/**
	 * 가족 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/familyList")
	public void familyList(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		List<DataMap> familyList = null;
		if( authUserInfo.equals("user_type", HakwonConstant.UserType.STUDENT) ) {
			familyList = userService.parentList(authUserInfo);
		} else if( authUserInfo.equals("user_type", HakwonConstant.UserType.PARENT) ) {
			familyList = userService.childList(authUserInfo);
		}

		sendList(familyList, request, response);
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
	@RequestMapping("/alarmOff")
	public void alarmOFf(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		int alarm_off_time = NumberUtils.toInt(request.getParameter("alarm_off_time"));
		if( alarm_off_time == 0 || alarm_off_time == 1 || alarm_off_time == 2 || alarm_off_time == 4 || alarm_off_time == 8 || alarm_off_time == 24 || alarm_off_time == 72 ) {
		} else {
			sendFlag(CommonConstant.Flag.fail, request, response);
			return ;
		}

		String offTime = userService.updateUserAlarmOff(authUserInfo.getLong("user_no"), alarm_off_time);

		DataMap rtnMap = new DataMap();
		rtnMap.put("offTime",	offTime);
		rtnMap.put("flag",	CommonConstant.Flag.success);

		sendColData(rtnMap, request, response);
	}
}