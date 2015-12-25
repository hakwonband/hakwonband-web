package hakwonband.hakwon.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.dao.NoticeShareDAO;
import hakwonband.util.DataMap;

/**
 * 공지 공유 서비스
 * @author bumworld
 *
 */
@Service
public class NoticeShareService {

	public static final Logger logger = LoggerFactory.getLogger(NoticeShareService.class);

	@Autowired
	private NoticeShareDAO noticeShareDAO;

	/**
	 * 공유 등록
	 * @param param
	 */
	public void insertShare(DataMap param) {
		noticeShareDAO.shareInsert(param);
	}

	/**
	 * 공유 리스트
	 * @param param
	 * @return
	 */
	public DataMap sendList(DataMap param) {

		DataMap rtnMap = new DataMap();

		/**
		 * 공유 리스트
		 */
		List<DataMap> shareList = noticeShareDAO.sendList(param);

		/**
		 * 전체 리스트
		 */
		int totCount = noticeShareDAO.sendListTotCount(param);

		rtnMap.put("shareList",	shareList);
		rtnMap.put("totCount",	totCount);

		return rtnMap;
	}

	/**
	 * 공유 받은 리스트
	 * @param param
	 * @return
	 */
	public DataMap receiveList(DataMap param) {
		DataMap rtnMap = new DataMap();

		/**
		 * 공유 리스트
		 */
		List<DataMap> shareList = noticeShareDAO.receiveList(param);

		/**
		 * 전체 리스트
		 */
		int totCount = noticeShareDAO.receiveListTotCount(param);

		rtnMap.put("shareList",	shareList);
		rtnMap.put("totCount",	totCount);

		return rtnMap;
	}

	/**
	 * 공유 수정
	 * @param param
	 */
	public void updateShare(DataMap param) {
		int checkCnt = noticeShareDAO.updateShare(param);
		if( checkCnt != 1 ) {
			throw new HKBandException();
		}
	}

	/**
	 * 공유 삭제
	 * @param param
	 */
	public void deleteShare(DataMap param) {
		int checkCnt = noticeShareDAO.updateShare(param);
		if( checkCnt != 1 ) {
			throw new HKBandException();
		}
	}
}