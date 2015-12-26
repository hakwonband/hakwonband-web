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
		String [] target_hakwon = (String [])param.get("target_hakwon");
		for(int i=0; i<target_hakwon.length; i++) {
			DataMap shareParam = new DataMap();
			shareParam.put("send_hakwon_no", param.getString("share_hakwon"));
			if( param.equals("share_class", "-1") ) {
				/*	학원공지	*/
				shareParam.put("notice_type", "002");
			} else {
				/*	반공공지	*/
				shareParam.put("notice_type", "003");
			}
			shareParam.put("parent_no",			param.getString("share_class"));
			shareParam.put("receive_hakwon_no",	target_hakwon[i]);
			shareParam.put("user_no",			param.getString("user_no"));
			shareParam.put("start_date",		param.getString("start_date"));
			shareParam.put("end_date",			param.getString("end_date"));


			int checkCount = noticeShareDAO.checkShareCount(shareParam);
			if( checkCount == 0 ) {
				noticeShareDAO.shareInsert(shareParam);
			} else {
				noticeShareDAO.updateShare(shareParam);
			}
		}
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
	 * 받은 공유 삭제
	 * @param param
	 */
	public void deleteReceiveShare(DataMap param) {
		int checkCnt = noticeShareDAO.deleteReceiveShare(param);
		if( checkCnt != 1 ) {
			throw new HKBandException();
		}
	}

	/**
	 * 보낸 공유 삭제
	 * @param param
	 */
	public void deleteSendShare(DataMap param) {
		int checkCnt = noticeShareDAO.deleteSendShare(param);
		if( checkCnt != 1 ) {
			throw new HKBandException();
		}
	}
}