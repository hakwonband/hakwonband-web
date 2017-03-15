package hakwonband.hakwon.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.common.BaseAction;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.model.AllSearchResultModel;
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

		String hakwonNo		= request.getParameter("hakwonNo");
		String searchText	= request.getParameter("searchText");

		/**
		 * 전체 검색
		 */
		List<AllSearchResultModel> dataList = allSearchService.allSearch(authUserInfo.getLong("user_no"), Long.valueOf(hakwonNo), authUserInfo.getString("user_type"), searchText);

		sendList(dataList, request, response);
	}

}