package hakwonband.admin.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.service.TeacherService;
import hakwonband.common.BaseAction;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 선생님 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/admin/teacher")
@Controller
public class TeacherController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(TeacherController.class);

	@Autowired
	private TeacherService teacherService;

	/**
	 * 선생님 리스트
	 * @return
	 */
	@RequestMapping("/list")
	public void teacherList(HttpServletRequest request, HttpServletResponse response) {

		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale	= HakwonConstant.PageScale.ADVERTISE_REQ;

		String searchText = request.getParameter("searchText");

		DataMap param = new DataMap();
		param.put("startNo",	(pageNo-1)*pageScale);
		param.put("pageScale",	pageScale);
		param.put("searchText",	searchText);
		param.put("hakwonNo",	request.getParameter("hakwonNo"));


		DataMap colData = teacherService.teacherList(param);
		colData.put("pageScale",	pageScale);

		sendColData(colData, request, response);
	}

	/**
	 * 학생 상세
	 * @return
	 */
	@RequestMapping("/view")
	public void studentView(HttpServletRequest request, HttpServletResponse response) {

		String teacherUserNo = request.getParameter("teacherUserNo");

		DataMap param = new DataMap();
		param.put("teacherUserNo",	teacherUserNo);
		param.put("user_no",	teacherUserNo);


		DataMap colData = teacherService.teacherView(param);

		sendColData(colData, request, response);
	}
}