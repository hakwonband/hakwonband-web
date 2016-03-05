package hakwonband.mobile.service;

import java.util.HashMap;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;

import hakwonband.api.PushSend;
import hakwonband.common.exception.HKBandException;
import hakwonband.common.model.ErrorObj;
import hakwonband.mobile.dao.CommonDAO;
import hakwonband.mobile.model.DevicePushData;
import hakwonband.util.CommonConfig;
import hakwonband.util.DataMap;
import hakwonband.util.http.HttpService;
import hakwonband.util.http.HttpServiceInfo;

public class AsyncService {

	public static final Logger logger = LoggerFactory.getLogger(AsyncService.class);

	public static final String smtpHost		= CommonConfig.getString("email/smtp/host");
	public static final String smtpPort		= CommonConfig.getString("email/smtp/port");
	public static final String smtpEmailId	= CommonConfig.getString("email/smtp/id");
	public static final String smtpEmailPwd	= CommonConfig.getString("email/smtp/password");

	@Autowired
	private CommonDAO commonDAO;


	/**
	 * 모바일 푸시
	 * @param devicePushData
	 */
	@Async
	public void pushMobileDevice(DevicePushData devicePushData) {
		if( devicePushData == null ) {
			return ;
		}
		if( devicePushData.getDeviceList() == null ) {
			PushSend.send(devicePushData.getPushMessage());
		} else {
			PushSend.send(devicePushData.getDeviceList(), devicePushData.getPushMessage());
		}
	}

	/**
	 * 에러 로깅
	 * @param errorObj
	 */
	@Async
	public void insertErrorLog(ErrorObj errorObj) {
		try {
			commonDAO.insertErrorLog(errorObj.toString());
		} catch(Exception e) {
			logger.error("", e);
		}
	}

	/**
	 * 이메일 전송
	 * subject 제목
	 * text 내용
	 * fromUser 발신자
	 * toUser 수신자
	 * toCC 공동 수진자 메일 주소들
	 */
	@Async
	public void mailSend(DataMap mailInfo) {
		try {
			logger.debug("title["+mailInfo.getString("title")+"]");
			logger.debug("content["+mailInfo.getString("content")+"]");
			logger.debug("smtpEmailId["+smtpEmailId+"]");
			logger.debug("toUser["+mailInfo.getString("toUser")+"]");

			Properties props = System.getProperties();
			props.put("mail.smtp.host",			smtpHost);
			props.put("mail.smtp.port",			smtpPort);
			props.put("mail.smtp.auth",			"true");
			props.put("mail.smtp.ssl.enable",	"true");
			props.put("mail.smtp.ssl.trust",	smtpHost);

			Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
				protected PasswordAuthentication getPasswordAuthentication() {
					return new PasswordAuthentication(smtpEmailId, smtpEmailPwd);
				}
			});

			Message mimeMessage = new MimeMessage(session);
			mimeMessage.setFrom(new InternetAddress(smtpEmailId));
			mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(mailInfo.getString("toUser")));
			mimeMessage.setSubject(mailInfo.getString("title"));
			mimeMessage.setContent(mailInfo.getString("content"), "text/html; charset=utf-8");

			Transport.send(mimeMessage);
		} catch (MessagingException e) {
			throw new HKBandException(e);
		}
	}

	/**
	 * sms 발송
	 * @param message
	 * @param numbers
	 */
	@Async
	public void smsSend(String message, String numbers) {

		try {
			HashMap param = new HashMap();
			param.put("remote_id",			"eduklearning");
			param.put("remote_pass",		"k006611");
			param.put("remote_reserve",		"");	//	1:예약, blank:즉시
			param.put("remote_reservetime",	"");	//	2015-09-26 13:00:00
			param.put("remote_name",		"");
			param.put("remote_phone",		numbers);
			param.put("remote_callback",	"01094684743");
			param.put("remote_msg",			message);
			param.put("remote_etc1",		"");
			param.put("remote_etc2",		"");

			HttpServiceInfo httpServiceInfo = new HttpServiceInfo();
			httpServiceInfo.setUrl("http://www.mymunja.co.kr/Remote/RemoteSms.html");
			httpServiceInfo.setParametersMap(param);
			httpServiceInfo.setMethod("get");
			httpServiceInfo.setParamEncoding("utf-8");

			HttpService.execute(httpServiceInfo);
		} catch(Exception e) {
			logger.error("", e);
		}
	}
}