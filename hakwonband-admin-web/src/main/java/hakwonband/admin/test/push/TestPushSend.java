package hakwonband.admin.test.push;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;

/**
 * push 서비스 전송
 * @author bumworld
 *
 */
public class TestPushSend {

	private static final Logger logger = LoggerFactory.getLogger(TestPushSend.class);

	/**
	 * 개별 전송
	 * @param userDevice
	 */
	public static void send(PushMessage pushMessage) {

		String isProductionFlag = "N";
		if( "Y".equals(pushMessage.getIs_production()) ) {
			isProductionFlag = "Y";
		}

		List<String> deviceList = new ArrayList<String>();
		deviceList.add(pushMessage.getToken_key());

		if( CommonConstant.DeviceType.android.equals(pushMessage.getDevice_type()) ) {
			TestGCMSender.send(pushMessage, deviceList, isProductionFlag);
		} else if( CommonConstant.DeviceType.ios.equals(pushMessage.getDevice_type()) ) {
			TestIosSender.send(pushMessage, deviceList, isProductionFlag);
		}
	}

	/**
	 * 푸시 전송
	 * @param param
	 * 	List<UserDevice> deviceList
	 * 	String message
	 * 	String redirectUrl
	 */
	public static void send(List<UserDevice> deviceList, PushMessage pushMessage) {
		logger.info("PushSend send\n"+deviceList + "\npushMessage"+pushMessage);

		if( deviceList == null || deviceList.size() == 0 ) {
			logger.error("deviceList is null");
			return ;
		}
		logger.info("push deviceList total["+deviceList.size()+"]");

		/**
		 * 1개 보낼때 디바이스 운영여부 따진다.
		 */
		String isProductionFlag = "N";
		if( deviceList != null && deviceList.size() == 1 && "Y".equals(deviceList.get(0).getIs_production()) ) {
			isProductionFlag = "Y";
		}
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

		logger.debug("androidDeviceList["+androidDeviceList.size()+"]");
		logger.debug("iosDeviceList["+iosDeviceList.size()+"]");

		/**
		 * android 전송
		 */
		{
			String [] listArray = androidDeviceList.toArray(new String[androidDeviceList.size()]);
			int loopCount = androidDeviceList.size()/CommonConstant.Push.SEND_MAX_COUNT + (androidDeviceList.size()%CommonConstant.Push.SEND_MAX_COUNT==0?0:1);
			for(int i=1; i<=loopCount; i++) {
				int startNum = (i-1)*CommonConstant.Push.SEND_MAX_COUNT;
				int endNum = i*CommonConstant.Push.SEND_MAX_COUNT-1;
				if( endNum > androidDeviceList.size()-1 ) {
					endNum = androidDeviceList.size();
				}

				logger.info("android sned["+startNum+"~"+endNum+"]");
				String [] newArray = Arrays.copyOfRange(listArray, startNum, endNum);

				List<String> newDeviceList = new ArrayList<String>(Arrays.asList(newArray));

				TestGCMSender.send(pushMessage, newDeviceList, isProductionFlag);
			}
		}

		/**
		 * ios 전송
		 */
		{
			String [] listArray = iosDeviceList.toArray(new String[iosDeviceList.size()]);
			int loopCount = iosDeviceList.size()/CommonConstant.Push.SEND_MAX_COUNT + (iosDeviceList.size()%CommonConstant.Push.SEND_MAX_COUNT==0?0:1);
			for(int i=1; i<=loopCount; i++) {
				int startNum = (i-1)*CommonConstant.Push.SEND_MAX_COUNT;
				int endNum = i*CommonConstant.Push.SEND_MAX_COUNT-1;
				if( endNum > iosDeviceList.size()-1 ) {
					endNum = iosDeviceList.size();
				}

				logger.info("ios sned["+startNum+"~"+endNum+"]");
				String [] newArray = Arrays.copyOfRange(listArray, startNum, endNum);

				List<String> newDeviceList = new ArrayList<String>(Arrays.asList(newArray));

				TestIosSender.send(pushMessage, newDeviceList, isProductionFlag);
			}
		}
	}
}