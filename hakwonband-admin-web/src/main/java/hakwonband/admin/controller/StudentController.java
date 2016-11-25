package hakwonband.admin.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.service.StudentService;
import hakwonband.common.BaseAction;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 학생 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/admin/student")
@Controller
public class StudentController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(StudentController.class);

	@Autowired
	private StudentService studentService;

	/**
	 * 학생 리스트
	 * @return
	 */
	@RequestMapping("/list")
	public void studentList(HttpServletRequest request, HttpServletResponse response) {

		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale	= HakwonConstant.PageScale.STUDENT_LIST;

		String searchText = request.getParameter("searchText");

		DataMap param = new DataMap();
		param.put("startNo",	(pageNo-1)*pageScale);
		param.put("pageScale",	pageScale);
		param.put("searchText",	searchText);
		param.put("hakwonNo",	request.getParameter("hakwonNo"));

		DataMap colData = studentService.studentList(param);
		colData.put("pageScale",	pageScale);

		sendColData(colData, request, response);
	}

	/**
	 * 학생 상세
	 * @return
	 */
	@RequestMapping("/view")
	public void studentView(HttpServletRequest request, HttpServletResponse response) {

		String studentUserNo = request.getParameter("studentUserNo");

		DataMap param = new DataMap();
		param.put("student_user_no",	studentUserNo);
		param.put("user_no",	studentUserNo);


		DataMap colData = studentService.studentView(param);

		sendColData(colData, request, response);
	}
}