package hakwonband.manager.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.api.MailSend;
import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.manager.model.DevicePushData;
import hakwonband.manager.service.AsyncService;
import hakwonband.manager.service.SignUpService;
import hakwonband.manager.util.HakwonUtilSupportBox;
import hakwonband.util.CommonConfig;
import hakwonband.util.DataMap;
import hakwonband.util.SecuUtil;

/**
 * 로그인 예외 처리 컨트롤러
 * @author jszzang9
 *
 */
@Controller
public class SignUpController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(SignUpController.class);

	/**
	 * 비번 변경 요청 메일
	 */
	public static final String emailPwdResetReqTitle = CommonConfig.getString("email/pwdResetReq/title");
	public static final String emailPwdResetReqContent = CommonConfig.getString("email/pwdResetReq/content");
	/**
	 * 모바일 호스트
	 */
	public static final String mobileHost = CommonConfig.getString("mobileHost");

	/**
	 * 발송 주소
	 */
	public static final String sendEmail = CommonConfig.getString("email/sendEmail");

	@Autowired
	private SignUpService signupService;

	@Autowired
	private MailSend mailSend;

	@Autowired
	private AsyncService asyncService;

	/**
	 * 아이디 찾기
	 * @param request
	 * @param response
	 */
	@RequestMapping("/findIdSearch")
	public void findIdSearch(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("user_name", request.getParameter("user_name"));
		param.put("tel1_no", request.getParameter("tel1_no"));

		DataMap resultFindId = signupService.getUserFindId(param);

		sendColData(resultFindId, request, response);
	}

	/**
	 * 비밀번호 찾기(임시 비밀번호 발급)
	 * @param request
	 * @param response
	 */
	@RequestMapping("/passwordReplacement")
	public void passwordReplacement(HttpServletRequest request, HttpServletResponse response) {
		DataMap chekcParam = new DataMap();
		chekcParam.put("user_id", request.getParameter("user_id"));
		chekcParam.put("tel1_no", request.getParameter("tel1_no"));
		chekcParam.put("user_name", request.getParameter("user_name"));

		DataMap resultCheck = signupService.getPwdUserInfoCheck(chekcParam);
		if (resultCheck == null) {
			DataMap result = new DataMap();
			result.put("result", CommonConstant.Flag.notexist);
			sendColData(result, request, response);
		} else {

			String makePasswd = HakwonUtilSupportBox.getInstance().makeRandomString().substring(0,7);


			DataMap updateParam = new DataMap();
			updateParam.put("user_id", resultCheck.get("user_id"));
			updateParam.put("user_password", SecuUtil.sha256(makePasswd));

			logger.debug("param["+updateParam+"]");

			DataMap result = signupService.updateForUserPasswd(updateParam);

			/**
			 * 메일 발송
			 */
			String mailContent = emailPwdResetReqContent;
			mailContent = StringUtils.replace(mailContent, "{=HOST}", mobileHost);
			mailContent = StringUtils.replace(mailContent, "{=userPassWord}", makePasswd);
			mailContent = StringUtils.replace(mailContent, "{=loginUrl}", mobileHost+"/#/login");

			DataMap mailSendMap = new DataMap();
			mailSendMap.put("title", emailPwdResetReqTitle);
			mailSendMap.put("content", mailContent);
			mailSendMap.put("toUser", resultCheck.get("user_email"));
			mailSend.send(mailSendMap);

			sendColData(result, request, response);
		}
	}

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

		DataMap resultObj = signupService.checkUserId(param);
		sendColData(resultObj, request, response);
	}

	/**
	 * 회원가입시, 이메일 중복 체크
	 * @param request
	 * @param response
	 */
	@RequestMapping("/duplicateCheckEmail")
	public void duplicateCheckEmail(HttpServletRequest request, HttpServletResponse response) {
		String user_email = request.getParameter("user_email");

		DataMap param = new DataMap();
		param.put("user_email", user_email);

		DataMap resultObj = signupService.checkEmail(param);
		sendColData(resultObj, request, response);
	}

	/**
	 * 매니저 회원가입
	 * @param request
	 * @param response
	 */
	@RequestMapping("/registHakwonManager")
	public void registHakwonManager(HttpServletRequest request, HttpServletResponse response) {

		/* 사용자 정보 */
		String user_type		= request.getParameter("user_type");
		String user_id			= request.getParameter("user_id");
		String user_email		= request.getParameter("user_email");
		String user_password	= request.getParameter("user_password");
		String user_name		= request.getParameter("user_name");
		String user_gender		= request.getParameter("user_gender");
		String user_birthday	= request.getParameter("user_birthday");
		String photo_file_no	= request.getParameter("photo_file_no");
		String tel1_no			= request.getParameter("tel1_no");
		String tel2_no			= request.getParameter("tel2_no");
		String user_url			= request.getParameter("user_url");
		String agree01			= request.getParameter("agree01");
		String agree02			= request.getParameter("agree02");

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

		/* 매니저 등록 */
		DevicePushData devicePushData = signupService.registHakwonManager(param);
		asyncService.pushMobileDevice(devicePushData);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

}