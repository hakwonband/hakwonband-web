package hakwonband.runtime.pushFeedback.dao;

import org.springframework.stereotype.Repository;

import hakwonband.util.DataMap;

@Repository
public interface PushFeedbackDAO {

	/**
	 * loginHist에서 feedback 받은 type의 deviceToken을 삭제한다.
	 * @param param
	 * @return
	 */
	public int deleteLoginHist(DataMap param);
}