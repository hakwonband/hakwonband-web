import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.google.android.gcm.server.Message;
import com.google.android.gcm.server.MulticastResult;
import com.google.android.gcm.server.Sender;


public class TestSendGCM {

	public static void main(String [] args) {

		PushMessage pushMessage = new PushMessage();
		pushMessage.setTicker("학원밴드 입니다.");
		pushMessage.setTitle("테스트 님께서 메세지를 보냈습니다.");
		pushMessage.setContent("테스트 메세지 입니다.");
		pushMessage.setLink_url("https://m.hakwonband.com/message.do");


		int timeToLive = 60;
		String collapseKey = String.valueOf(Math.random() % 100 + 1);
		boolean delayWhileIdle = true;

		UserDevice userDevice = new UserDevice();
		userDevice.setDevice_token("APA91bGfL9nLVhfTsPg2ap-QA8FhWRTv8HvtAO-f06gJNhdxPrCXy0YuRJfFrQefLG83qs11a7QsWvslupvELwK6AWPBOpTMrm4PZg-duM8c7P5UjRhDzT51_QYaKU0SA-N_Qao4epaZNX6YPK6ZqmpUFXr8vUMPxw");
		userDevice.setDevice_type("android");
		userDevice.setUser_no("4");
		List<UserDevice> deviceList = new ArrayList<UserDevice>();
		deviceList.add(userDevice);

		send(deviceList, pushMessage, timeToLive, collapseKey, delayWhileIdle);
	}

	/**
	 * 푸시 전송
	 * @param param
	 * 	List<UserDevice> deviceList
	 * 	String message
	 * 	String redirectUrl
	 */
	public static void send(List<UserDevice> deviceList, PushMessage pushMessage, int timeToLive, String collapseKey, boolean delayWhileIdle) {
		System.out.println("PushSend send\n"+deviceList + "\npushMessage"+pushMessage);

		if( deviceList == null || deviceList.size() == 0 ) {
			System.out.println("deviceList is null");
			return ;
		}
		System.out.println("push deviceList total["+deviceList.size()+"]");

		/**
		 * ios, android 분리 작업
		 */
		List<String> androidDeviceList = new ArrayList<String>();
		List<String> iosDeviceList = new ArrayList<String>();
		for(int i=0; i<deviceList.size(); i++) {
			UserDevice userDevice = deviceList.get(i);
			if( CommonConstant.DeviceType.android.equals(userDevice.getDevice_type()) ) {
				androidDeviceList.add(userDevice.getDevice_token());
			} else if( CommonConstant.DeviceType.ios.equals(userDevice.getDevice_type()) ) {
				iosDeviceList.add(userDevice.getDevice_token());
			} else {
				throw new HKBandException("Invalid DeviceType["+userDevice+"]");
			}
		}

		System.out.println("androidDeviceList["+androidDeviceList.size()+"]");
		System.out.println("iosDeviceList["+iosDeviceList.size()+"]");

		String [] listArray = androidDeviceList.toArray(new String[androidDeviceList.size()]);
		int loopCount = androidDeviceList.size()/CommonConstant.Push.SEND_MAX_COUNT + (androidDeviceList.size()%CommonConstant.Push.SEND_MAX_COUNT==0?0:1);
		for(int i=1; i<=loopCount; i++) {
			int startNum = (i-1)*CommonConstant.Push.SEND_MAX_COUNT;
			int endNum = i*CommonConstant.Push.SEND_MAX_COUNT-1;
			if( endNum > androidDeviceList.size()-1 ) {
				endNum = androidDeviceList.size();
			}

			System.out.println("android sned["+startNum+"~"+endNum+"]");
			String [] newArray = Arrays.copyOfRange(listArray, startNum, endNum);

			List<String> newDeviceList = new ArrayList<String>(Arrays.asList(newArray));

			send2(pushMessage, newDeviceList, timeToLive, collapseKey, delayWhileIdle);
		}
	}

	/**
	 * 메시지 전송
	 * @param param
	 *
	 * 	message
	 * 	deviceList
	 */
	public static void send2(PushMessage pushMessage, List<String> devicesList, int timeToLive, String collapseKey, boolean delayWhileIdle) {
		try {
			Sender sender = new Sender("AIzaSyDnpzHMxJa2hTTDZcve4zqrPW9z9hSte_w");

			System.out.println("pushMessage\n" + pushMessage);
			System.out.println("devicesList size : " + devicesList.size());
			System.out.println("timeToLive : " + timeToLive);
			System.out.println("collapseKey : " + collapseKey);
			System.out.println("delayWhileIdle : " + delayWhileIdle);


//			String collapseKey = String.valueOf(Math.random() % 100 + 1);
			Message message = new Message.Builder()
				.collapseKey(collapseKey)
				.timeToLive(timeToLive)
				.delayWhileIdle(delayWhileIdle)
				.addData("message", pushMessage.toString()).build();

			MulticastResult result = sender.send(message, devicesList, 5);

			System.out.println("result.toString : " + result.toString());
			System.out.println("result.getResults : " + result.getResults());
			if (result.getResults() != null) {
				int canonicalRegId = result.getCanonicalIds();
				System.out.println("canonicalRegId : " + canonicalRegId);
			} else {
				int error = result.getFailure();
				System.out.println("error " + error);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}