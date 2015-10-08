package hakwonband.admin.test.push;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StopWatch;
import org.springframework.util.StopWatch.TaskInfo;

import hakwonband.push.PushMessage;
import hakwonband.util.CommonConfig;
import javapns.Push;
import javapns.notification.PushNotificationPayload;
import javapns.notification.PushedNotification;
import javapns.notification.ResponsePacket;



/**
 * ios 메시지 전송
 * @author bumworld
 *
 */
public class TestIosSender {

	private static final Logger logger = LoggerFactory.getLogger(TestIosSender.class);

	private static final String certificatePath_dev			= CommonConfig.getString("push/ios/dev/certificatePath");	// APNS 보안 통신시에 사용할 인증서 파일 경로
	private static final String certificatePassword_dev		= CommonConfig.getString("push/ios/dev/pass");				// 인증서 암호
	private static final String certificatePath_live		= CommonConfig.getString("push/ios/live/certificatePath");	// APNS 보안 통신시에 사용할 인증서 파일 경로
	private static final String certificatePassword_live	= CommonConfig.getString("push/ios/live/pass");				// 인증서 암호

	/**
	 * 개발/운영 타입
	 */
	private static boolean isProduction = true;

	/**
	 * 메시지 전송
	 * @param pushMessage
	 * @param devicesList
	 * @param isProductionFlag
	 */
	public static void send(PushMessage pushMessage, List<String> devicesList, String isProductionFlag) {
		try {
			logger.debug("pushMessage\n" + pushMessage);

			String ticker		= pushMessage.getTicker();
			String title		= pushMessage.getTitle();
			String content		= pushMessage.getContent();
			String image_url	= pushMessage.getImage_url();
			String link_url		= pushMessage.getLink_url();
			String user_no		= pushMessage.getUser_no();
			String device_type	= pushMessage.getDevice_type();
			String token_key	= pushMessage.getToken_key();

			/* Build a blank payload to customize */
			PushNotificationPayload payload = PushNotificationPayload.complex();
			payload.addAlert(content);    //  아이폰에 통지 보낼 메세지 내용
			payload.addBadge(-1);
			payload.addSound("default");

//			payload.addCustomDictionary("ticker",		ticker);
//			payload.addCustomDictionary("title",		title);
			payload.addCustomDictionary("link_url",		link_url);
//			payload.addCustomDictionary("content",		content);
//			payload.addCustomDictionary("user_no",		user_no);
//			payload.addCustomDictionary("image_url",	image_url);
//			payload.addCustomDictionary("device_type",	device_type);
//			payload.addCustomDictionary("token_key",	token_key);

			System.out.println("isProduction : " + isProduction);
			if( isProduction == false ) {
				isProduction = true;
			}

			System.out.println("isProductionFlag : " + isProductionFlag);


			String certificatePath = certificatePath_live;
			String certificatePassword = certificatePassword_live;
			if( "Y".equals(isProductionFlag) == false ) {
				certificatePath = certificatePath_dev;
				certificatePassword = certificatePassword_dev;
			}

			/* Push your custom payload */
			StopWatch stopWatch = new StopWatch();
			stopWatch.start("payload");
			List<PushedNotification> notifications = Push.payload(payload, certificatePath, certificatePassword, isProduction, devicesList);
			stopWatch.stop();
			if( notifications == null || notifications.size() == 0 ) {
				logger.error("notifications is fail");
			} else {
				stopWatch.start("result");
				for(int i=0; i<notifications.size(); i++) {
					PushedNotification notificationResult = notifications.get(i);
					logger.debug(i + " : " + notificationResult.isSuccessful());
					ResponsePacket theErrorResponse = notificationResult.getResponse();

					System.out.println(notificationResult.getPayload().getPayload().toString());

					Exception notiException = notificationResult.getException();
					if( notiException == null ) {
						System.out.println("notiException is null");
					} else {
						notiException.printStackTrace();
					}
					if (theErrorResponse != null) {
						System.out.println(theErrorResponse.getMessage());
					} else {
						System.out.println("theErrorResponse is null");
					}
				}
				stopWatch.stop();
			}


			StringBuffer buf = new StringBuffer();
			buf.append("\n[total]" + stopWatch.getTotalTimeSeconds());
			TaskInfo[] taskArray = stopWatch.getTaskInfo();
			for(int i=0; i<taskArray.length; i++) {
				buf.append("\n["+i+"]["+taskArray[i].getTaskName()+"]["+taskArray[i].getTimeSeconds()+"]");
			}

			if( stopWatch.getTotalTimeSeconds() > 1 ) {
				logger.error("bumworldIosTimeLate : " + buf.toString());
			} else {
				logger.debug("bumworldIosTime : " + buf.toString());
			}
		} catch (Exception e) {
			logger.error("{}", e);
		}
	}
}