package hakwonband.admin.service;

import org.springframework.scheduling.annotation.Async;

import hakwonband.admin.model.DevicePushData;
import hakwonband.admin.test.push.TestPushSend;
import hakwonband.api.PushSend;

public class AsyncService {

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
	 * 모바일 푸시
	 * @param devicePushData
	 */
	@Async
	public void pushMobileDevice2(DevicePushData devicePushData) {
		if( devicePushData == null ) {
			return ;
		}
		if( devicePushData.getDeviceList() == null ) {
			TestPushSend.send(devicePushData.getPushMessage());
		} else {
			TestPushSend.send(devicePushData.getDeviceList(), devicePushData.getPushMessage());
		}
	}

}