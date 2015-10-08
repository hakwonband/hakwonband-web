package hakwonband.mobile.service;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.api.MailSend;
import hakwonband.common.exception.HKBandException;
import hakwonband.mobile.dao.SearchIdAndPwdDAO;
import hakwonband.mobile.util.HakwonUtilSupportBox;
import hakwonband.util.CommonConfig;
import hakwonband.util.DataMap;
import hakwonband.util.SecuUtil;
/**
 * User Service
 * @author jszzang9
 *
 */
@Service
public class SearchIdAndPwdService {

	public static final Logger logger = LoggerFactory.getLogger(SearchIdAndPwdService.class);

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
	private SearchIdAndPwdDAO searchIdAndPwd;

//	@Autowired
//	private MailSend mailSend;

	/**
	 * User Id 찾기.
	 * @param param
	 * @return
	 */
	public DataMap getUserFindId(DataMap param) {
		DataMap result = new DataMap();
		DataMap resultId =  searchIdAndPwd.selectIdSearch(param);

		if (resultId != null)
			result.put("result", HakwonUtilSupportBox.getInstance().replaceString((String) resultId.get("user_id")));
		else
			result.put("result", "not find id");

		return result;
	}

	public DataMap getPwdUserInfoCheck(DataMap param) {
		DataMap result = new DataMap();

		DataMap resultPwd = searchIdAndPwd.pwdUserInfoCheck(param);
		if (resultPwd != null) {
			String makePasswd = HakwonUtilSupportBox.getInstance().makeRandomString().substring(0,7);

			DataMap updateParam = new DataMap();
			updateParam.put("user_id", resultPwd.get("user_id"));
			updateParam.put("user_password", SecuUtil.sha256(makePasswd));

			logger.debug("param["+updateParam+"]");

			int resultUpdate = searchIdAndPwd.updateForUserInfo(updateParam);
			if (resultUpdate != 1) {
				throw new HKBandException("SearchIdAndPwdDAO.getPwdUserInfoCheck error");
			}

			if( param.equals("receive_type", "sms") ) {
				DataMap smsInfo = new DataMap();
				smsInfo.put("user_name",	resultPwd.getString("user_name"));
				smsInfo.put("tel1_no",		resultPwd.getString("tel1_no"));
				smsInfo.put("message",		"학원밴드 입니다. 새로운 임시 비밀번호는 ["+makePasswd+"] 입니다.");

				result.put("smsInfo",	smsInfo);
			} else if( param.equals("receive_type", "email") ) {
				String mailContent = emailPwdResetReqContent;
				mailContent = StringUtils.replace(mailContent, "{=HOST}", mobileHost);
				mailContent = StringUtils.replace(mailContent, "{=userPassWord}", makePasswd);
				mailContent = StringUtils.replace(mailContent, "{=loginUrl}", mobileHost+"/#/login");

				DataMap mailInfo = new DataMap();
				mailInfo.put("title",	emailPwdResetReqTitle);
				mailInfo.put("content",	mailContent);
				mailInfo.put("toUser",	resultPwd.get("user_email"));

				result.put("mailInfo",	mailInfo);
			}

			result.put("result", "success");
			result.put("resultInt", resultUpdate);
		} else {
			result.put("result", "notexist");
		}

		return result;
	}
}
