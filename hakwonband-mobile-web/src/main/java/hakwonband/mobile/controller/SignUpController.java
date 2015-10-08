package hakwonband.mobile.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.mobile.service.UserService;
import hakwonband.util.DataMap;
import hakwonband.util.SecuUtil;
import hakwonband.util.StringUtil;

/**
 * 로그인 예외 처리 컨트롤러
 * @author jszzang9
 *
 */
@Controller
public class SignUpController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(SignUpController.class);

	@Autowired
	private UserService userService;

	/**
	 * 회원가입시, 아이디 중복 체크
	 * @param request
	 * @param response
	 */
	@RequestMapping("/duplicateCheckId")
	public void duplicateCheckId(HttpServletRequest request, HttpServletResponse response) {
		String user_id = request.getParameter("user_id");

		DataMap param = new DataMap();
		param.put("user_id", user_id);

		sendColData(userService.checkUserId(param), request, response);
	}

	/**
	 * 회원가입시, 이메일 중복 체크
	 * @param request
	 * @param response
	 */
	@RequestMapping("/duplicateCheckEmail")
	public void duplicateCheckEmail(HttpServletRequest request, HttpServletResponse response) {
		String user_email		= request.getParameter("user_email");

		DataMap param = new DataMap();
		param.put("user_email", user_email);

		sendColData(userService.checkEmail(param), request, response);
	}

	/**
	 * 학생 or 학부모 회원가입
	 * @return
	 */
	@RequestMapping("/registUser")
	public void registUser(HttpServletRequest request, HttpServletResponse response) {

		/**
		 * 사용자 등록 정보
		 */
		String user_type		= request.getParameter("user_type");
		String user_id			= request.getParameter("user_id");
		String user_email		= request.getParameter("user_email");
		String user_password	= request.getParameter("user_password");
		String user_name		= request.getParameter("user_name");
		String user_gender		= request.getParameter("user_gender");
		String user_birthday	= request.getParameter("user_birthday");
		if( StringUtil.isBlank(user_birthday) ) {
			user_birthday = null;
		}
		String photo_file_no	= request.getParameter("photo_file_no");
		String tel1_no			= request.getParameter("tel1_no");
		String tel2_no			= request.getParameter("tel2_no");
		String user_url			= request.getParameter("user_url");
		String agree01			= request.getParameter("agree01");
		String agree02			= request.getParameter("agree02");
		String school_name		= request.getParameter("school_name");
		String school_level		= request.getParameter("school_level");
		String level			= request.getParameter("level");

		if( StringUtils.isBlank(user_email) ) {
			user_email = null;
		}

		DataMap param = new DataMap();
		param.put("user_type",		user_type);
		param.put("user_id",		user_id);
		param.put("user_email",		user_email);
		param.put("user_password",	SecuUtil.sha256(user_password));
		param.put("user_name",	 	user_name);
		param.put("user_gender", 	user_gender);
		param.put("user_birthday", 	user_birthday);
		param.put("photo_file_no", 	photo_file_no);
		param.put("tel1_no",		tel1_no);
		param.put("tel2_no",		tel2_no);
		param.put("user_url",		user_url);
		param.put("agree01",		agree01);
		param.put("agree02",		agree02);
		param.put("school_name",	school_name);
		param.put("school_level",	school_level);
		param.put("level",			level);

		//가입한 학원 코드
		if (request.getParameter("hakwon_codes") != null)
			param.put("hakwon_codes", request.getParameter("hakwon_codes"));

		/* 사용자 등록 */
		userService.registUser(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}
}