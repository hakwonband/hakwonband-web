import java.util.List;

import javapns.Push;
import javapns.notification.PushNotificationPayload;
import javapns.notification.PushedNotification;


public class IOSPushTest {

//	private static final String certificatePath_dev = "/Users/bumworld/develop/workspace/hakwonband-project/hakwonband-mobile-web/src/test/resources/hakwon-aps-for-sandbox.p12";
//	private static final String certificatePath_live = "/Users/bumworld/develop/workspace/hakwonband-project/hakwonband-mobile-web/src/test/resources/hakwon-aps-for-production.p12";

	private static final String certificatePath_dev = "D:/develop/workspace/LGE/hakwonband-project/hakwonband-runtime/src/main/resources/property/new-hakwon-aps-for-sandbox.p12";
	private static final String certificatePath_live = "D:/develop/workspace/LGE/hakwonband-project/hakwonband-runtime/src/main/resources/property/new-hakwon-aps-for-production.p12";

	private static final String certificatePassword = "qwer1234";

	public static void main(String[] args) {

		try {
			/* Build a blank payload to customize */
			PushNotificationPayload payload = PushNotificationPayload.complex();
			payload.addAlert("Test Java Send");    //  아이폰에 통지 보낼 메세지 내용
			payload.addBadge(1);
			payload.addSound("default");

			payload.addCustomDictionary("link_url", "https://m.hakwonband.com/index.do#/hakwon/detail?hakwon_no=520");

			String certificatePath = null;
			boolean isProduction = false;
			if( isProduction ) {
				certificatePath = certificatePath_live;
			} else {
				certificatePath = certificatePath_dev;
			}

			/*	테스트폰	*/
			String [] devicesList = {"7776051f038103465b22ff1958f36cd3f5f85794493d83ba31984f2219665107"};

			/* Push your custom payload */
			List<PushedNotification> notifications = Push.payload(payload, certificatePath, certificatePassword, isProduction, devicesList);
			if( notifications == null || notifications.size() == 0 ) {
				System.out.println("notifications is fail");
			} else {
				for(int i=0; i<notifications.size(); i++) {
					PushedNotification notificationResult = notifications.get(i);
					System.out.println(i + " : " + notificationResult.isSuccessful());
				}
			}
		} catch(Exception e) {
			e.printStackTrace();
		}

	}
}