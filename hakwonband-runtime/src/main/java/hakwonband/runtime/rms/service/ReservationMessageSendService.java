package hakwonband.runtime.rms.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.api.PushSend;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.runtime.rms.dao.ReservationMessageSendDAO;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 예약 메세지 발송
 * @author bumworld
 */
@Service
public class ReservationMessageSendService {

	public static final Logger logger = LoggerFactory.getLogger(ReservationMessageSendService.class);

	@Autowired
	private ReservationMessageSendDAO reservationMessageSendDAO;

	/**
	 * 예약 메세지 발송
	 * @param param
	 */
	public void executeSend() {
		try {
			logger.debug("logger send call~~~");

			List<DataMap> messageList = reservationMessageSendDAO.reservationMessageList();

			if( messageList != null && messageList.size() > 0 ) {
				String messageNos = "";
				for(int i=0, max=messageList.size(); i<max; i++) {
					DataMap message = messageList.get(i);

					logger.debug("message\n"+message);

					String hakwonNo		= message.getString("hakwon_no");
					String messageNo	= message.getString("message_no");

					if( i > 0 && i <= max-1 ) {
						messageNos += ",";
					}
					messageNos += messageNo;

					PushMessage pushMessage = new PushMessage();
					pushMessage.setTicker("학원밴드");
					pushMessage.setTitle("[메세지] " + message.getString("send_user_name")+"님께서 메세지를 보냈습니다.");
					pushMessage.setContent(message.getString("title"));
					pushMessage.addCustomParam("hakwonNo", hakwonNo);
					pushMessage.setImage_url("");
					pushMessage.setLink_url("https://m.hakwonband.com/message.do?hakwonNo="+hakwonNo);

					List<UserDevice> receiverUserDeviceList = reservationMessageSendDAO.receiverUserDeviceList(message);
					String sendUserDevice = message.getString("send_user_device");
					if( StringUtil.isNotBlank(sendUserDevice) ) {
						/*	발송자한테 알림해준다.(스펙아웃)	*/
						logger.debug("sendUserDevice["+sendUserDevice+"]");
					} else {
					}

					PushSend.send(receiverUserDeviceList, pushMessage);
				}

				logger.debug("messageNos : " + messageNos);

				/**
				 * 메세지 발송 완료 처리
				 */
				DataMap param = new DataMap();
				param.put("messageNos",	messageNos);
				int messageDone = reservationMessageSendDAO.messageSendDone(param);
				logger.debug("messageDone["+messageDone+"]");

			} else {
				logger.info("reservationMessageList is null");
			}
		} catch (Exception e) {
			logger.error("", e);
		}
	}
}