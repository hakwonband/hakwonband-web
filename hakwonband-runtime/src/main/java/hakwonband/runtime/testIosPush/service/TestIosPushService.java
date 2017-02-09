package hakwonband.runtime.testIosPush.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.api.PushSend;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.runtime.testIosPush.dao.TestIosPushDAO;
import hakwonband.util.DataMap;

/**
 * ios 푸시 테스트
 * @author bumworld
 */
@Service
public class TestIosPushService {

	public static final Logger logger = LoggerFactory.getLogger(TestIosPushService.class);

	@Autowired
	private TestIosPushDAO testIosPushDAO;

	public void send(DataMap param) {
		logger.debug("param\n"+param);
		//List<UserDevice> iosDeviceList = testIosPushDAO.getIosDevice(param);
		List<UserDevice> iosDeviceList = new ArrayList<UserDevice>();
		UserDevice userDevice = new UserDevice();
		userDevice.setDevice_token("7776051f038103465b22ff1958f36cd3f5f85794493d83ba31984f2219665107");
		userDevice.setDevice_type("ios");
		userDevice.setIs_production("false");
		userDevice.setUser_no("4");
		iosDeviceList.add(userDevice);

		if( iosDeviceList == null || iosDeviceList.size() == 0 ) {
			logger.info("iosDeviceList is null");
		} else {
			logger.info("iosDeviceList is not null["+iosDeviceList.size()+"]");

			PushMessage pushMessage = new PushMessage();
			pushMessage.setTicker("학원밴드 입니다.");
			pushMessage.setTitle("학원밴드에서 메세지를 보냈습니다.");
			pushMessage.setContent("테스트 입니다.");
			pushMessage.addCustomParam("hakwonNo", "-1");
			pushMessage.setImage_url("");
			pushMessage.setLink_url("https://m.hakwonband.com/message.do?hakwonNo=-1");

			PushSend.send(iosDeviceList, pushMessage);
		}
	}

}