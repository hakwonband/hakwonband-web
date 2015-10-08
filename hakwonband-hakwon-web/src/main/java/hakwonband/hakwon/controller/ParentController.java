package hakwonband.hakwon.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.common.BaseAction;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.service.ParentService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 학부모 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/hakwon/parent")
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
		String hakwonNo		= request.getParameter("hakwonNo");

		DataMap param = new DataMap();
		param.put("start_no",		(pageNo-1)*pageScale);
		param.put("page_scale",		pageScale);
		param.put("search_text",	searchText);
		param.put("hakwon_no",		hakwonNo);


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
		String hakwonNo		= request.getParameter("hakwonNo");

		DataMap param = new DataMap();
		param.put("parent_user_no",	parentUserNo);
		param.put("user_no",		parentUserNo);
		param.put("hakwon_no",		hakwonNo);


		DataMap colData = parentService.parentView(param);

		sendColData(colData, request, response);
	}

	/**
	 * 반소속 학부모 리스트
	 * @return
	 */
	@RequestMapping("/classParentList")
	public void classParentList(HttpServletRequest request, HttpServletResponse response) {

		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale	= HakwonConstant.PageScale.PARENT_LIST;

		String hakwonNo	= request.getParameter("hakwonNo");
		String classNo	= request.getParameter("classNo");

		DataMap param = new DataMap();
		param.put("start_no",		(pageNo-1)*pageScale);
		param.put("page_scale",		pageScale);
		param.put("hakwon_no",		hakwonNo);
		param.put("class_no",		classNo);

		DataMap colData = parentService.classParentList(param);
		colData.put("pageScale",	pageScale);

		sendColData(colData, request, response);
	}
}