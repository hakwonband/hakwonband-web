package hakwonband.manager.dao;

import hakwonband.util.DataMap;

import java.util.List;

/**
 * 댓글 DAO
 * @author jrlim
 *
 */
public interface ReplyDAO {

	/**
	 * 댓글 목록 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> replyList(DataMap param);

	/**
	 * 신규 댓글 목록 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> newReplyList(DataMap param);

	/**
	 * 댓글 등록
	 * @param param
	 * @return
	 */
	public int replyInsert(DataMap param);

	/**
	 * 댓글 삭제
	 * @param param
	 * @return
	 */
	public int replyDelete(DataMap param);
}