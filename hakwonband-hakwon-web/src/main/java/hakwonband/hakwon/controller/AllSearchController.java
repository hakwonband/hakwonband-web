package hakwonband.hakwon.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.common.BaseAction;
import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.model.AllSearchModel;
import hakwonband.hakwon.service.AllSearchService;
import hakwonband.util.DataMap;

/**
 * 전체 검색 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/hakwon/search")
@Controller
public class AllSearchController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(AllSearchController.class);

	@Autowired
	private AllSearchService allSearchService;

	/**
	 * 전체 검색
	 * @return
	 */
	@RequestMapping("/all")
	public void all(HttpServletRequest request, HttpServletResponse response) {

		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwonNo		= request.getParameter("hakwon_no");
		String searchText	= request.getParameter("search_text");
		String pageNoStr	= request.getParameter("page_no");

		if( StringUtils.isBlank(searchText) ) {
			throw new HKBandException();
		}

		int pageNo = 0;
		if( StringUtils.isBlank(pageNoStr) ) {
			pageNo = 1;
		} else {
			pageNo = Integer.parseInt(pageNoStr);
		}
		int page_scale = 50;

		AllSearchModel allSearchModel = new AllSearchModel();
		allSearchModel.setUser_no(authUserInfo.getLong("user_no"));
		allSearchModel.setHakwon_no(Long.valueOf(hakwonNo));
		allSearchModel.setUser_type(authUserInfo.getString("user_type"));
		allSearchModel.setSearch_text(searchText);
		allSearchModel.setPage_scale(page_scale);
		allSearchModel.setStart_no((pageNo-1)*page_scale);

		/**
		 * 전체 검색
		 */
		DataMap rtnMap = allSearchService.allSearch(allSearchModel);
		rtnMap.put("page_scale", page_scale);
		rtnMap.put("page_po", pageNo);

		sendColData(rtnMap, request, response);
	}

}