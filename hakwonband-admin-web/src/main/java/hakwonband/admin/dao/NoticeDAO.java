package hakwonband.admin.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 공지사항 DAO
 * @author bumworld
 *
 */
public interface NoticeDAO {

	/**
	 * 공지사항 목록 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> noticeList(DataMap param);

	/**
	 * 공지사항 카운트 확인
	 * @param param
	 * @return
	 */
	public int noticeListTotCount(DataMap param);

	/**
	 * 공지사항 상세
	 * @param param
	 * @return
	 */
	public DataMap noticeDetail(DataMap param);

	/**
	 * 공지사항 등록
	 * @param param
	 * @return
	 */
	public int noticeInsert(DataMap param);

	/**
	 * 공지사항 수정
	 * @param param
	 * @return
	 */
	public int noticeUpdate(DataMap param);

	/**
	 * 공지사항 상태 삭제로 변경 (content_status = 002)
	 * @param param
	 * @return
	 */
	public int noticeDelete(DataMap param);

}