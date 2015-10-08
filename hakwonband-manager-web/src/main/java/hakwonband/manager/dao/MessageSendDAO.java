package hakwonband.manager.dao;

import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

import java.util.List;


/**
 * 메세지 보내기 DAO
 * @author jrlim
 *
 */
public interface MessageSendDAO {

	/**
	 * 선생님 학생 검색
	 * @param param
	 * @return
	 */
	public List<DataMap> teacherSearchStudent(DataMap param);

	/**
	 * 원장님 검색
	 * @param param
	 * @return
	 */
	public List<DataMap> targetSearch(DataMap param);

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
	 * 메세지 수신자 tb_message_receiver 테이블에 다건 등록
	 * @param param
	 * @return
	 */
	public int messageReceiverMultiInsert(List<DataMap> paramList);

	/**
	 * 학원 원장님 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonMasterList(DataMap param);

	/**
	 * 검색 대상의 디바이스 정보
	 * @param param
	 * @return
	 */
	public List<UserDevice> searchHakwonDeviceToken(DataMap param);

	/**
	 * 학원 원장님 디바이스 검색
	 * @param param
	 * @return
	 */
	public List<UserDevice> hakwonMasterUserDeviceToken(DataMap param);

	/**
	 * 받은 사용자 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> targetUserList(DataMap param);
}