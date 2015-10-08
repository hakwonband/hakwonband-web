package hakwonband.admin.service;

import hakwonband.admin.dao.CommonDAO;
import hakwonband.admin.dao.TestDAO;
import hakwonband.admin.model.DevicePushData;
import hakwonband.api.PushSend;
import hakwonband.common.exception.HKBandException;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.CommonConfig;
import hakwonband.util.DataMap;

import java.util.List;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * 테스트 서비스
 * @author bumworld
 *
 */
@Service
public class TestService {

	public static final Logger logger = LoggerFactory.getLogger(TestService.class);

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	private CommonDAO commonDAO;

	@Autowired
	private TestDAO testDAO;

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

	/**
	 * 테스트 메일 발송
	 * @param param
	 * @return
	 */
	public void mailSend(DataMap param) {

		String mailContent = emailPwdResetReqContent;
		mailContent = StringUtils.replace(mailContent, "{=HOST}", mobileHost);
		mailContent = StringUtils.replace(mailContent, "{=userPassWord}", "테스트");
		mailContent = StringUtils.replace(mailContent, "{=loginUrl}", mobileHost+"/#/login");

		/*	메일 발송	*/
//		param.put("title", emailPwdResetReqTitle);
//		param.put("toUser", param.getString("emailAddr"));
//		param.put("content", mailContent);

		try {

			logger.debug("emailPwdResetReqTitle : " + emailPwdResetReqTitle);
			logger.debug("TO EmailAddr : " + param.getString("emailAddr"));

			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper messageHelper = new MimeMessageHelper(message, true, "UTF-8");
			messageHelper.setSubject(emailPwdResetReqTitle);
			messageHelper.setTo(param.getString("emailAddr"));
			messageHelper.setFrom("info@hakwonband.com");
			messageHelper.setText(mailContent, true);

			mailSender.send(message);
		} catch (MessagingException e) {
			throw new HKBandException();
		}
	}

	/**
	 * 테스트 메시지 전송
	 * @param param
	 */
	public DevicePushData testMsgSend(DataMap param) {

		List<UserDevice> deviceList = null;
		if( param.isNotNull("reciveUserNo") ) {
			deviceList = commonDAO.getUserDeviceToken(param);
		} else {
			deviceList = commonDAO.getAllDeviceToken();
		}

		PushMessage pushMessage = new PushMessage();
		pushMessage.setTicker("학원밴드 입니다.");
		pushMessage.setTitle(param.getString("user_name")+"님께서 메세지를 보냈습니다.");
		pushMessage.setContent(param.getString("message"));
		pushMessage.setImage_url("");
		pushMessage.setLink_url("https://m.hakwonband.com/message.do");

		DevicePushData devicePushData = new DevicePushData(pushMessage, deviceList);

		return devicePushData;
	}

	/**
	 * 테스트 멤버 처리
	 */
	public void executeMember() {

		List<DataMap> memberList = testDAO.hakwonMemberList();

		for(int i=0; i<memberList.size(); i++) {
			DataMap member = memberList.get(i);

			DataMap param = new DataMap();
			param.put("hakwon_no", member.getString("hakwon_no"));
			param.put("student_user_no", member.getString("user_no"));

			String member_yn = testDAO.hakwonMemberCheck(param);
			param.put("member_yn",	member_yn);

			int updateCnt = testDAO.updateHakwonMember(param);
			if( updateCnt != 1 ) {
				throw new HKBandException();
			}
		}

	}

	/**
	 * 학부모들 학생 학원 가입 처리
	 */
	public void executeParentHakwonRegist() {
		List<DataMap> childHakwonList = testDAO.childHakwonList();
		for(int i=0; i<childHakwonList.size(); i++) {
			DataMap tempMap = childHakwonList.get(i);

			try {
				testDAO.parentHakwonInsert(tempMap);
			} catch(DuplicateKeyException e) {
				logger.error("", e);
			}
		}
	}
}