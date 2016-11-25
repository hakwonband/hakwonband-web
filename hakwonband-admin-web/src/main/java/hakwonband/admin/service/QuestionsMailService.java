package hakwonband.admin.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.admin.dao.QuestionsMailDAO;
import hakwonband.util.DataMap;

/**
 * 문의 메일 서비스
 * @author bumworld
 *
 */
@Service
public class QuestionsMailService {

	public static final Logger logger = LoggerFactory.getLogger(QuestionsMailService.class);

	@Autowired
	private QuestionsMailDAO questionsMailDAO;


	/**
	 * 문의 메일 리스트
	 * @param param
	 * @return
	 */
	public DataMap questionsMailList(DataMap param) {
		DataMap colData = new DataMap();

		/*	문의 메일 리스트	*/
		List<DataMap> questionsMailList = questionsMailDAO.questionsMailList(param);
		colData.put("questionsMailList",	questionsMailList);

		/*	문의 메일 전체 카운트	*/
		int questionsMailCount = questionsMailDAO.questionsMailCount(param);
		colData.put("questionsMailCount",	questionsMailCount);

		return colData;
	}

	/**
	 * 문의 메일 상세
	 * @param param
	 * @return
	 */
	public DataMap questionsMailDetail(DataMap param) {
		return questionsMailDAO.questionsMailDetail(param);
	}
}