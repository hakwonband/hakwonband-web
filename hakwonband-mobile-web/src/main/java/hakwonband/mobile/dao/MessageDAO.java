package hakwonband.mobile.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 메세지 DAO
 * @author jrlim
 *
 */
public interface MessageDAO {

	/**
	 * 보낸 메세지 목록조회
	 * @param param
	 * @return
	 */
	public List<DataMap> sendMessageList(DataMap param);

	/**
	 * 보낸 메세지 카운트 확인
	 * @param param
	 * @return
	 */
	public int sendMessageListTotCount(DataMap param);

	/**
	 * 받은 메세지 목록조회
	 * @param param
	 * @return
	 */
	public List<DataMap> receiveMessageList(DataMap param);

	/**
	 * 받은 메세지 카운트 확인
	 * @param param
	 * @return
	 */
	public int receiveMessageListTotCount(DataMap param);

	/**
	 * 신규 메세지 리스트 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> newMessageList(DataMap param);

	/**
	 * 보낸 메세지 상세조회
	 * @param param
	 * @return
	 */
	public DataMap sendMessageDetail(DataMap param);

	/**
	 * 받은 메세지 상세조회
	 * @param param
	 * @return
	 */
	public DataMap receiveMessageDetail(DataMap param);

	/**
	 * 받은 메세지 상세조회시 receive_date 업데이트
	 * @param param
	 * @return
	 */
	public int updateMessageReceiveDate(DataMap param);

	/**
	 * 메세지 기본 등록
	 * @param param
	 * @return
	 */
	public int messageInsert(DataMap param);

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
	public int messageReceiverMultiInsert(List<DataMap> param);

	/**
	 * 메세지 사용자 정보
	 * @param param
	 * @return
	 */
	public DataMap messageUserInfo(DataMap param);
}