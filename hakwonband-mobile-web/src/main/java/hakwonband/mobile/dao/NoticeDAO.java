package hakwonband.mobile.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 공지사항 DAO
 * @author jrlim
 *
 */
public interface NoticeDAO {

	/**
	 * 공지사항 대시 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> studentNoticeDashList(DataMap param);

	/**
	 * 공지사항 대시 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> parentNoticeDashList(DataMap param);

	/**
	 * 공지사항 목록 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> noticeReqList(DataMap param);

	/**
	 * 공지사항 카운트 확인
	 * @param param
	 * @return
	 */
	public int noticeReqListTotCount(DataMap param);

	/**
	 * 공지사항 상세
	 * @param param
	 * @return
	 */
	public DataMap noticeDetail(DataMap param);
}