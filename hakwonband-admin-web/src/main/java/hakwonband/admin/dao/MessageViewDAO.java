package hakwonband.admin.dao;

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
	 * 메세지 사용자 정보
	 * @param param
	 * @return
	 */
	public DataMap messageUserInfo(DataMap param);
}