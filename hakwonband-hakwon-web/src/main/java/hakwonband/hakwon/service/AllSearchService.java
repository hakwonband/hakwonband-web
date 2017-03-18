package hakwonband.hakwon.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.dao.AllSearchDAO;
import hakwonband.hakwon.dao.CommonDAO;
import hakwonband.hakwon.model.AllSearchModel;
import hakwonband.hakwon.model.AllSearchResultModel;
import hakwonband.util.DataMap;
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

	@Autowired
	private CommonDAO commonDAO;

	/**
	 * 전체 검색
	 * @param user_no
	 * @param hakwon_no
	 * @param user_type
	 * @return
	 */
	public List<AllSearchResultModel> allSearch2(AllSearchModel allSearchModel) {
		return allSearchDAO.allSearch(allSearchModel);
	}

	/**
	 * 공지사항 목록 조회
	 * @param param
	 * @return
	 */
	public DataMap allSearch(AllSearchModel allSearchModel) {

		if( commonDAO.memberRoleCheck(allSearchModel.getHakwon_no(), allSearchModel.getUser_no(), allSearchModel.getUser_type()) != 1 ) {
			throw new HKBandException("memberRoleCheck fail");
		}


		DataMap returnMap = new DataMap();

		List<AllSearchResultModel> list = allSearchDAO.allSearch(allSearchModel);

		int totalCount	= allSearchDAO.allSearchCount(allSearchModel);

		returnMap.put("search_list",	list);
		returnMap.put("search_count",	totalCount);
		returnMap.put("page_scale",		allSearchModel.getPage_scale());

		return returnMap;
	}
}