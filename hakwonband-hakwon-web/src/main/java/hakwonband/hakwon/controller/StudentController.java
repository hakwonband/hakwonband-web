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
import hakwonband.common.constant.CommonConstant.Flag;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.service.StudentService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 학생 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/hakwon/student")
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
		int pageScale	= StringUtil.parseInt(request.getParameter("pageScale"), HakwonConstant.PageScale.STUDENT_LIST);

		String searchText	= request.getParameter("searchText");
		String hakwonNo		= request.getParameter("hakwonNo");

		DataMap param = new DataMap();
		param.put("start_no",		(pageNo-1)*pageScale);
		param.put("page_scale",		pageScale);
		param.put("search_text",	searchText);
		param.put("hakwon_no",		hakwonNo);


		DataMap colData = studentService.studentList(param);
		colData.put("pageScale",	pageScale);

		sendColData(colData, request, response);
	}

	/**
	 * 반 등록을 위한 학생 리스트 검색
	 * @return
	 */
	@RequestMapping("/notClass")
	public void notClass(HttpServletRequest request, HttpServletResponse response) {

		String searchText	= request.getParameter("searchText");
		String hakwonNo		= request.getParameter("hakwonNo");
		String class_no		= request.getParameter("classNo");

		DataMap param = new DataMap();
		param.put("search_text",	searchText);
		param.put("hakwon_no",		hakwonNo);
		param.put("class_no",		class_no);


		List<DataMap> studentList = studentService.notClass(param);

		sendList(studentList, request, response);
	}


	/**
	 * 학생 상세
	 * @return
	 */
	@RequestMapping("/view")
	public void studentView(HttpServletRequest request, HttpServletResponse response) {

		String studentUserNo = request.getParameter("studentUserNo");
		String hakwonNo		= request.getParameter("hakwonNo");

		DataMap param = new DataMap();
		param.put("student_user_no",	studentUserNo);
		param.put("user_no",	studentUserNo);
		param.put("hakwon_no",	hakwonNo);

		DataMap colData = studentService.studentView(param);

		sendColData(colData, request, response);
	}

	/**
	 * 반 소속 학생 리스트
	 * @return
	 */
	@RequestMapping("/classStudentList")
	public void classStudentList(HttpServletRequest request, HttpServletResponse response) {

		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale	= HakwonConstant.PageScale.STUDENT_LIST;

		String hakwonNo		= request.getParameter("hakwonNo");
		String classNo		= request.getParameter("classNo");
		String searchText	= request.getParameter("searchText");
		if( StringUtil.isBlank(searchText) ) {
			searchText = "";
		}

		DataMap param = new DataMap();
		param.put("start_no",		(pageNo-1)*pageScale);
		param.put("page_scale",		pageScale);
		param.put("class_no",		classNo);
		param.put("hakwon_no",		hakwonNo);
		param.put("search_text",	searchText);


		DataMap colData = studentService.classStudentList(param);
		colData.put("pageScale",	pageScale);

		sendColData(colData, request, response);
	}

	/**
	 * 학생의 학원 등록일 수정
	 * @param request
	 * @param response
	 */
	@RequestMapping("/receiptDate/update")
	public void updateReceiptDate(HttpServletRequest request, HttpServletResponse response) {
		String hakwonNo = request.getParameter("hakwonNo");
		String studentNo = request.getParameter("studentNo");
		String receiptDate = request.getParameter("receiptDate");

		DataMap map = new DataMap();
		if(StringUtil.isNotBlank(receiptDate) && receiptDate.length() <= 2) {
			map.put("hakwonNo", hakwonNo);
			map.put("studentNo", studentNo);
			map.put("receiptDate", receiptDate);

			studentService.updateReceiptDate(map);
			map.clear();
			map.put("flag", Flag.success);
		} else {
			map.put("flag", Flag.param_error);
		}

		sendColData(map, request, response);
	}

}