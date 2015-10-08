package hakwonband.admin.test.push;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StopWatch;

import com.google.android.gcm.server.Message;
import com.google.android.gcm.server.MulticastResult;
import com.google.android.gcm.server.Sender;

import hakwonband.push.PushMessage;
import hakwonband.util.CommonConfig;



/**
 * google 메시지 전송
 * @author bumworld
 *
 */
public class TestGCMSender {

	private static final Logger logger = LoggerFactory.getLogger(TestGCMSender.class);

	/*	인증 키	*/
	private static final String authKey = CommonConfig.getString("push/gcm/key");
	private static final int gcmRetry = CommonConfig.getInt("push/gcm/retry", 5);

	/**
	 * 메시지 전송
	 * @param param
	 *
	 * 	message
	 * 	deviceList
	 */
	public static void send(PushMessage pushMessage, List<String> devicesList, String isProductionFlag) {

		StopWatch stopWatch = new StopWatch();
		try {
			stopWatch.start();
			Sender sender = new Sender(authKey);

			logger.debug("pushMessage\n" + pushMessage);


//			String collapseKey = String.valueOf(Math.random() % 100 + 1);
			Message message = new Message.Builder()
//				.collapseKey(collapseKey)
//				.timeToLive(60)
				.delayWhileIdle(false)
				.addData("message", pushMessage.toString()).build();

			MulticastResult result = sender.send(message, devicesList, gcmRetry);

			logger.debug(result.toString());
			if (result.getResults() != null) {
				int canonicalRegId = result.getCanonicalIds();
				logger.debug("canonicalRegId : " + canonicalRegId);
			} else {
				int error = result.getFailure();
				logger.debug("error {}", error);
			}
			stopWatch.stop();
		} catch (Exception e) {
			logger.error("{}", e);
			stopWatch.stop();
		} finally {
			if( stopWatch.isRunning() ) {
				stopWatch.stop();
			}
			if( devicesList != null && devicesList.size() > 0 ) {
				if( stopWatch.getTotalTimeSeconds() > 1 ) {
					logger.error("TimeLate GCM send["+devicesList.size()+"]["+stopWatch.getTotalTimeSeconds()+"]");
				} else {
					logger.debug("GCM send["+devicesList.size()+"]["+stopWatch.getTotalTimeSeconds()+"]");
				}
			} else {
				logger.debug("GCM send Empty[list is null]");
			}
		}
	}
}