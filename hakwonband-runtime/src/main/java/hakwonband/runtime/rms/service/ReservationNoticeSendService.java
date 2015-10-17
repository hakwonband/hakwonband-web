package hakwonband.runtime.rms.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.api.PushSend;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.runtime.rms.dao.ReservationNoticeSendDAO;
import hakwonband.util.DataMap;

/**
 * 예약 공지 발송
 * @author bumworld
 */
@Service
public class ReservationNoticeSendService {

	public static final Logger logger = LoggerFactory.getLogger(ReservationNoticeSendService.class);

	@Autowired
	private ReservationNoticeSendDAO reservationNoticeSendDAO;

	/**
	 * 예약 공지 발송
	 * @param param
	 */
	public void executeSend() {
		try {
			logger.debug("logger send call~~~");

			List<DataMap> noticeList = reservationNoticeSendDAO.reservationNoticeList();

			if( noticeList != null && noticeList.size() > 0 ) {
				String noticeNos = "";
				for(int i=0, max=noticeList.size(); i<max; i++) {
					DataMap notice = noticeList.get(i);

					logger.debug("notice\n"+notice);

					String hakwonNo		= notice.getString("hakwon_no");
					String classNo		= notice.getString("class_no");
					String hakwonName	= notice.getString("hakwon_name");
					String className	= notice.getString("class_name");
					String noticeNo		= notice.getString("notice_no");

					if( i > 0 && i <= max-1 ) {
						noticeNos += ",";
					}
					noticeNos += noticeNo;

					List<UserDevice> deviceList = null;
					PushMessage pushMessage = new PushMessage();
					if( notice.equals("notice_type", "002") ) {
						DataMap tempMap = new DataMap();
						tempMap.put("hakwon_no", hakwonNo);

						deviceList = reservationNoticeSendDAO.hakwonMemberDeviceList(tempMap);

						String title = hakwonName+" 학원 공지사항이 등록되었습니다.";

						pushMessage.setTicker(title);
						pushMessage.setTitle(title);
						pushMessage.addCustomParam("hakwonNo", hakwonNo);
						pushMessage.setLink_url("https://m.hakwonband.com/index.do#/hakwon/noticeDetail?hakwon_no="+hakwonNo+"&notice_no="+noticeNo);
					} else if( notice.equals("notice_type", "003") ) {
						DataMap tempMap = new DataMap();
						tempMap.put("class_no", classNo);

						deviceList = reservationNoticeSendDAO.classStudentDeviceList(tempMap);

						/**
						 * 학부모 디바이스 리스트
						 */
						List<UserDevice> parentDeviceList = reservationNoticeSendDAO.classParentDeviceList(tempMap);
						if( parentDeviceList != null && parentDeviceList.size() > 0 ) {
							deviceList.addAll(parentDeviceList);
						}

						String title = hakwonName+" 학원"+ className +"반에 공지사항이 등록되었습니다.";

						pushMessage.setTicker(title);
						pushMessage.setTitle(title);
						pushMessage.addCustomParam("hakwonNo", hakwonNo);
						pushMessage.addCustomParam("classNo", classNo);
						pushMessage.setLink_url("https://m.hakwonband.com/index.do#/hakwon/noticeDetail?hakwon_no="+hakwonNo+"&class_no="+classNo+"&notice_no="+noticeNo);
					}

					if( deviceList != null && deviceList.size() > 0 ) {
						pushMessage.setContent(notice.getString("title"));
						pushMessage.setImage_url("");

						PushSend.send(deviceList, pushMessage);
					}
				}

				logger.debug("noticeNos : " + noticeNos);

				/**
				 * 공지 발송 완료 처리
				 */
				DataMap param = new DataMap();
				param.put("noticeNos",	noticeNos);
				int messageDone = reservationNoticeSendDAO.noticeSendDone(param);
				logger.debug("messageDone["+messageDone+"]");

			} else {
				logger.info("reservationMessageList is null");
			}
		} catch (Exception e) {
			logger.error("", e);
		}
	}
}