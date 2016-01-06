package hakwonband.runtime.noticeShare.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.runtime.noticeShare.dao.NoticeShareDAO;

/**
 * 파일 관리
 *
 * @author bumworld
 */
@Service
public class NoticeShareService {

	public static final Logger logger = LoggerFactory.getLogger(NoticeShareService.class);

	@Autowired
	private NoticeShareDAO noticeShareDAO;

	/**
	 * 사용하지 않는 파일 삭제
	 */
	public void deleteNoticeShare() {
		logger.info("deleteNoticeShare start");

		int delCount = noticeShareDAO.deleteShareNotice();
		logger.info("delCount["+delCount+"]");

		logger.info("deleteNoticeShare END");
	}
}