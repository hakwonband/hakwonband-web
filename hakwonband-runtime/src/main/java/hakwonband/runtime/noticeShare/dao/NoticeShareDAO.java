package hakwonband.runtime.noticeShare.dao;

import org.springframework.stereotype.Repository;

/**
 * 공지 공유 DAO
 * @author bumworld
 *
 */
@Repository
public interface NoticeShareDAO {

	/*	공유 공지 삭제	*/
	public int deleteShareNotice();
}