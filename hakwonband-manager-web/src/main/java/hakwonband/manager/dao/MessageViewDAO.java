package hakwonband.manager.dao;

import hakwonband.util.DataMap;

import java.util.List;


/**
 * 메세지 DAO
 * @author bumworld
 *
 */
public interface MessageViewDAO {

	/**
	 * 보낸 그룹 메세지 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> sendGroupMessageList(DataMap param);

	/**
	 * 보낸 그룹 메세지 카운트
	 * @param param
	 * @return
	 */
	public int sendGroupMessageCount(DataMap param);

	/**
	 * 보낸 싱글 메세지 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> sendSingleMessageList(DataMap param);

	/**
	 * 보낸 싱글 메세지 카운트
	 * @param param
	 * @return
	 */
	public int sendSingleMessageCount(DataMap param);

	/**
	 * 그룹 메세지 상세
	 * @param param
	 * @return
	 */
	public DataMap sendGroupMessageDetail(DataMap param);

	/**
	 * 싱글 메세지 상세
	 * @param param
	 * @return
	 */
	public DataMap sendSingleMessageDetail(DataMap param);

	/**
	 * 사용자 리스트 정보
	 * @param param
	 * @return
	 */
	public List<DataMap> userListInfo(DataMap param);


	/**
	 * 받은 메세지 목록조회
	 * @param param
	 * @return
	 */
	public List<DataMap> receiveMessageList(DataMap param);

	/**
	 * 받은 메세지 상세조회시 receive_date 업데이트
	 * @param param
	 * @return
	 */
	public int updateMessageReceiveDate(DataMap param);

	/**
	 * 받은 메세지 카운트 확인
	 * @param param
	 * @return
	 */
	public int receiveMessageListTotCount(DataMap param);

	/**
	 * 신규 받은 메세지 카운트 값
	 * @param param
	 * @return
	 */
	public int newReceiveMessageCount(DataMap param);

	/**
	 * 받은 메세지 상세
	 * @param param
	 * @return
	 */
	public DataMap receiveMessageDetail(DataMap param);

	/**
	 * 받은 사용자 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> receiveUserList(DataMap param);

	/**
	 * 메세지 사용자 정보
	 * @param param
	 * @return
	 */
	public DataMap messageUserInfo(DataMap param);
}