package hakwonband.hakwon.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 공지사항 공유 DAO
 * @author jrlim
 *
 */
public interface NoticeShareDAO {

	/**
	 * 공유 등록
	 * @param param
	 */
	public void shareInsert(DataMap param);

	/**
	 * 공유 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> sendList(DataMap param);

	/**
	 * 공유 리스트 카운트
	 * @param param
	 * @return
	 */
	public int sendListTotCount(DataMap param);

	/**
	 * 공유 받은 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> receiveList(DataMap param);

	/**
	 * 공유 받은 리스트 카운트
	 * @param param
	 * @return
	 */
	public int receiveListTotCount(DataMap param);

	/**
	 * 공유 수정
	 * @param param
	 */
	public int updateShare(DataMap param);

	/**
	 * 공유 날짜 수정
	 * @param param
	 */
	public int updateShareDate(DataMap param);

	/**
	 * 공유 체크
	 * @param param
	 * @return
	 */
	public int checkShareCount(DataMap param);

	/**
	 * 받은 공유 삭제
	 * @param param
	 */
	public int deleteReceiveShare(DataMap param);

	/**
	 * 보낸 공유 삭제
	 * @param param
	 */
	public int deleteSendShare(DataMap param);

	/**
	 * 공유 정보
	 * @param param
	 * @return
	 */
	public DataMap sendInfo(DataMap param);

	/**
	 * 공유 받은 공지 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> shareNoticeList(DataMap param);

	/**
	 * 공지 등록
	 * @param param
	 */
	public void noticeInsert(DataMap param);

	/**
	 * 공지 수정
	 * @param param
	 */
	public int noticeUpdate(DataMap param);
}