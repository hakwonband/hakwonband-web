package hakwonband.admin.dao;

import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

import java.util.List;


/**
 * 메세지 보내기 DAO
 * @author bumworld
 *
 */
public interface MessageSendDAO {

	/**
	 * 메세지 기본 등록
	 * @param param
	 * @return
	 */
	public void messageInsert(DataMap param);


	/**
	 * 메세지 받은 사용자 카운트 업데이트
	 * @param param
	 */
	public int updateMessageReceiverCount(DataMap param);

	/**
	 * 메세지 수신자 tb_message_receiver 테이블에 등록
	 * @param param
	 * @return
	 */
	public int messageReceiverSingleInsert(DataMap param);

	/**
	 * 메세지 수신자 tb_message_receiver 테이블에 다건 등록
	 * @param param
	 * @return
	 */
	public int messageReceiverMultiInsert(List<DataMap> paramList);

	/**
	 * 지역 그룹 리시버 등록
	 * @param paramList
	 * @return
	 */
	public int messageReceiverAreaGroupInsert(DataMap param);

	/**
	 * 학원 그룹 리시버 등록
	 * @param param
	 * @return
	 */
	public int messageReceiverHakwonGroupInsert(DataMap param);

	/**
	 * 원장님 반 대상 검색
	 * @param param
	 * @return
	 */
	public List<String> masterTargetClassUser(DataMap param);

	/**
	 * 원장님 사용자 그룹 대상 검색
	 * @param param
	 * @return
	 */
	public List<String> masterTargetUserGroup(DataMap param);

	/**
	 * 임시 디바이스 토큰
	 * @param param
	 * @return
	 */
	public List<String> tempDeviceToken(DataMap param);

	/**
	 * 지역 그룹의 디바이스 정보
	 * @param param
	 * @return
	 */
	public List<UserDevice> areaGroupUserDeviceToken(DataMap param);

	/**
	 * 학원 그룹의 디바이스 정보
	 * @param param
	 * @return
	 */
	public List<UserDevice> hakwonGroupUserDeviceToken(DataMap param);

	/**
	 * 검색 대상의 디바이스 정보
	 * @param param
	 * @return
	 */
	public List<UserDevice> searchUserDeviceToken(DataMap param);

	/**
	 * 원장님 반 대상 디바이스 검색
	 * @param param
	 * @return
	 */
	public List<UserDevice> masterTargetClassUserDeviceToken(DataMap param);

	/**
	 * 원장님 사용자 그룹 대상 디바이스 리스트
	 * @param param
	 * @return
	 */
	public List<UserDevice> masterTargetUserGroupDeviceToken(DataMap param);


	/**
	 * 반 학생들의 디바이스 리스트
	 * @param param
	 * @return
	 */
	public List<UserDevice> teacherTargetClassStudent(DataMap param);

	/**
	 *  메세지 그룹별 다중 등록(반&학부모)
	 * @param param
	 * @return
	 */
	public List<UserDevice> teacherTargetClassParent(DataMap param);

}