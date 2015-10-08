package hakwonband.manager.service;

import org.springframework.scheduling.annotation.Async;

import hakwonband.api.PushSend;
import hakwonband.manager.model.DevicePushData;

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
}