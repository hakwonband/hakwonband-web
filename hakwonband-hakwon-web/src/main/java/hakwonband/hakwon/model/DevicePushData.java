package hakwonband.hakwon.model;

import java.util.List;

import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;

/**
 * 디바이스 푸시 데이타
 * @author bumworld
 *
 */
public class DevicePushData {

	/**
	 * 디바이스 리스트
	 */
	private List<UserDevice> deviceList;

	/**
	 * 푸시 메세지
	 */
	private PushMessage pushMessage;

	public DevicePushData() {
	}

	public DevicePushData(PushMessage pushMessage) {
		this.pushMessage = pushMessage;
	}
	public DevicePushData(PushMessage pushMessage, List<UserDevice> deviceList) {
		this.pushMessage = pushMessage;
		this.deviceList = deviceList;
	}

	public List<UserDevice> getDeviceList() {
		return deviceList;
	}

	public void setDeviceList(List<UserDevice> deviceList) {
		this.deviceList = deviceList;
	}

	public PushMessage getPushMessage() {
		return pushMessage;
	}

	public void setPushMessage(PushMessage pushMessage) {
		this.pushMessage = pushMessage;
	}
}