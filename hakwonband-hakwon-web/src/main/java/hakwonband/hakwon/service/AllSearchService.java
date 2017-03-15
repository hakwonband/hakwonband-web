package hakwonband.hakwon.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.hakwon.dao.AllSearchDAO;
import hakwonband.hakwon.model.AllSearchResultModel;
import lombok.extern.slf4j.Slf4j;

/**
 * 주소 서비스
 * @author bumworld
 *
 */
@Slf4j
@Service
public class AllSearchService {

	@Autowired
	private AllSearchDAO allSearchDAO;

	/**
	 * 전체 검색
	 * @param user_no
	 * @param hakwon_no
	 * @param user_type
	 * @return
	 */
	public List<AllSearchResultModel> allSearch(long user_no, long hakwon_no, String user_type, String search_text) {
		return allSearchDAO.allSearch(user_no, hakwon_no, user_type, search_text);
	}
}