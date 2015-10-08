package hakwonband.runtime.eventPush.service;

import hakwonband.api.PushSend;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.runtime.eventPush.dao.EventPushDAO;
import hakwonband.util.CommonConfig;
import hakwonband.util.DataMap;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 이벤트 푸시 발송
 * @author bumworld
 */
@Service
public class EventPushService {

	public static final Logger logger = LoggerFactory.getLogger(EventPushService.class);

	@Autowired
	private EventPushDAO eventPushDAO;

	/**
	 * 금일 이벤트 푸시 발송
	 */
	public void todayEventPush() {

		String authKey = CommonConfig.getString("push/key/gcm");
		System.out.println("authKey : " + authKey);

		/**
		 * 이벤트 발송 대상 리스트
		 */
		List<DataMap> eventList = eventPushDAO.eventPushTargetList();

		if( eventList != null && eventList.size() > 0 ) {
			for(int i=0; i<eventList.size(); i++) {
				DataMap eventData = eventList.get(i);

				List<UserDevice> deviceList = eventPushDAO.hakwonMemberDeviceList(eventData);
				if( deviceList != null && deviceList.size() > 0 ) {
					PushMessage pushMessage = new PushMessage();
					pushMessage.setTicker("학원밴드 입니다.");
					pushMessage.setTitle(eventData.getString("hakwon_name")+" 입니다.");
					pushMessage.setContent("["+eventData.getString("event_title") + "] 이벤트를 시작 했습니다.");
					pushMessage.setLink_url("https://m.hakwonband.com/index.do#/hakwon/eventDetail?hakwon_no="+eventData.getString("hakwon_no")+"&event_no="+eventData.getString("event_no")+"&prev_page=list");

					PushSend.send(deviceList, pushMessage);
				}

				/*	이벤트 발송 업데이트	*/
				eventPushDAO.eventPushSendUpdate(eventData);
			}
		} else {
			logger.info("조회된 이벤트가 없습니다.");
		}
	}
}