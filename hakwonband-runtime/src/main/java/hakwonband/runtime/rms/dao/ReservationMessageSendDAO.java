package hakwonband.runtime.rms.dao;

import java.util.List;

import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

/**
 * 예약 메세지 발송 DAO
 * @author bumworld
 *
 */
public interface ReservationMessageSendDAO {

	/**
	 * 예약 발송 리스트
	 * @return
	 */
	public List<DataMap> reservationMessageList();

	/**
	 * 받는 사용자 리스트
	 * @return
	 */
	public List<UserDevice> receiverUserDeviceList(DataMap param);

	/**
	 * 메세지 발송 완료
	 * @param param
	 */
	public int messageSendDone(DataMap param);
}