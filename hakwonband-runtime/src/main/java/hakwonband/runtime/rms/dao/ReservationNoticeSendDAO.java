package hakwonband.runtime.rms.dao;

import java.util.List;

import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

/**
 * 예약 공지 발송 DAO
 * @author bumworld
 *
 */
public interface ReservationNoticeSendDAO {

	/**
	 * 예약 발송 리스트
	 * @return
	 */
	public List<DataMap> reservationNoticeList();

	/**
	 * 공지 발송 완료
	 * @param param
	 */
	public int noticeSendDone(DataMap param);


	/**
	 * 학원 멤버 리스트
	 * @param param
	 * @return
	 */
	public List<UserDevice> hakwonMemberDeviceList(DataMap param);

	/**
	 * 반 멤버 리스트
	 * @param param
	 * @return
	 */
	public List<UserDevice> classStudentDeviceList(DataMap param);

	/**
	 * 반 학생들의 부모 디바이스 리스트
	 * @param param
	 * @return
	 */
	public List<UserDevice> classParentDeviceList(DataMap param);

	/**
	 * 반 선생님 리스트
	 * @param param
	 * @return
	 */
	public List<UserDevice> classTeacherDeviceList(DataMap param);
}