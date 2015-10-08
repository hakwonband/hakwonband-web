

import hakwonband.push.PushMessage;
import hakwonband.util.CommonConfig;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.android.gcm.server.Message;
import com.google.android.gcm.server.MulticastResult;
import com.google.android.gcm.server.Sender;



/**
 * google 메시지 전송
 * @author bumworld
 *
 */
public class GCMSender {

	private static final Logger logger = LoggerFactory.getLogger(GCMSender.class);

	/*	인증 키	*/
	private static final String authKey = CommonConfig.getString("push/key/gcm");
	private static final int gcmRetry = CommonConfig.getInt("push/gcm/retry", 5);

	/**
	 * 메시지 전송
	 * @param param
	 *
	 * 	message
	 * 	deviceList
	 */
	public static void send(PushMessage pushMessage, List<String> devicesList, int timeToLive, String collapseKey, boolean delayWhileIdle) {
		try {
			Sender sender = new Sender(authKey);

			logger.info("pushMessage\n" + pushMessage);
			logger.info("devicesList size : " + devicesList.size());
			logger.info("timeToLive : " + timeToLive);
			logger.info("collapseKey : " + collapseKey);
			logger.info("delayWhileIdle : " + delayWhileIdle);


//			String collapseKey = String.valueOf(Math.random() % 100 + 1);
			Message message = new Message.Builder()
				.collapseKey(collapseKey)
				.timeToLive(timeToLive)
				.delayWhileIdle(delayWhileIdle)
				.addData("message", pushMessage.toString()).build();

			MulticastResult result = sender.send(message, devicesList, gcmRetry);

			logger.debug("result.toString : " + result.toString());
			logger.debug("result.getResults : " + result.getResults());
			if (result.getResults() != null) {
				int canonicalRegId = result.getCanonicalIds();
				logger.debug("canonicalRegId : " + canonicalRegId);
			} else {
				int error = result.getFailure();
				logger.debug("error {}", error);
			}
		} catch (Exception e) {
			logger.error("{}", e);
		}
	}
}