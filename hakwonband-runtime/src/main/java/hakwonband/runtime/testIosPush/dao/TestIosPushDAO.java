package hakwonband.runtime.testIosPush.dao;

import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

import java.util.List;

public interface TestIosPushDAO {

	/**
	 * ios 디바이스 사용자 리스트 조회
	 * @param param
	 * @return
	 */
	public List<UserDevice> getIosDevice(DataMap param);
}