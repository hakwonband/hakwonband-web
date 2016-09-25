package hakwonband.mobile.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.mobile.dao.NoticeDAO;
import hakwonband.util.DataMap;

/**
 * 공지 Service
 * @author jszzang9
 */
@Service
public class NoticeService {

	public static final Logger logger = LoggerFactory.getLogger(NoticeService.class);

	@Autowired
	private NoticeDAO noticeDAO;

	/**
	 * 공지사항 목록조회
	 * @param param
	 * @return
	 */
	public List<DataMap> getNoticeSelectList(DataMap param) {
		return noticeDAO.noticeReqList(param);
	}

	/**
	 * 공지사항 카운트 확인
	 * @param param
	 * @return
	 */
	public int getNoticeTotCount(DataMap param) {
		return noticeDAO.noticeReqListTotCount(param);
	}

	/**
	 * 공지사항 상세조회
	 * @param param
	 * @return
	 */
	public DataMap getNoticeSelectOne(DataMap param) {
		return noticeDAO.noticeDetail(param);
	}

	/**
	 * 공지 상세 찾기
	 * 권한체크도 같이 한다.
	 * @param param
	 * @return
	 */
	public DataMap findNoticeDetail(DataMap param) {
		return null;
	}
}