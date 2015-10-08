package hakwonband.runtime.eventPush.dao;

import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

import java.util.List;

import org.springframework.stereotype.Repository;

/**
 * 이벤트 푸시 DAO
 * @author bumworld
 *
 */
@Repository
public interface EventPushDAO {

	/**
	 * 알림 대상 이벤트들
	 */
	public List<DataMap> eventPushTargetList();

	/**
	 * 학원 멤버들의 디바이스 리스트
	 * @param param
	 * @return
	 */
	public List<UserDevice> hakwonMemberDeviceList(DataMap param);

	/**
	 * 이벤트 푸시 발송 업데이트 처리
	 * @param param
	 * @return
	 */
	public int eventPushSendUpdate(DataMap param);
}