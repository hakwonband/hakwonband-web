package hakwonband.admin.controller;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.service.ParentService;
import hakwonband.common.BaseAction;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 학부모 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/admin/parent")
@Controller
public class ParentController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(ParentController.class);

	@Autowired
	private ParentService parentService;

	/**
	 * 학부모 리스트
	 * @return
	 */
	@RequestMapping("/list")
	public void parentList(HttpServletRequest request, HttpServletResponse response) {

		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale	= HakwonConstant.PageScale.PARENT_LIST;

		String searchText = request.getParameter("searchText");

		DataMap param = new DataMap();
		param.put("startNo",	(pageNo-1)*pageScale);
		param.put("pageScale",	pageScale);
		param.put("searchText",	searchText);
		param.put("hakwonNo",	request.getParameter("hakwonNo"));


		DataMap colData = parentService.parentList(param);
		colData.put("pageScale",	pageScale);

		sendColData(colData, request, response);
	}

	/**
	 * 학부모 상세
	 * @return
	 */
	@RequestMapping("/view")
	public void parentView(HttpServletRequest request, HttpServletResponse response) {

		String parentUserNo = request.getParameter("parentUserNo");

		DataMap param = new DataMap();
		param.put("parent_user_no",	parentUserNo);
		param.put("user_no",		parentUserNo);


		DataMap colData = parentService.parentView(param);

		sendColData(colData, request, response);
	}
}