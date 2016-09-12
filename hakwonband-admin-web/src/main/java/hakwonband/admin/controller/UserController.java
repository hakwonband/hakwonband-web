package hakwonband.admin.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.admin.component.ColumnModel;
import hakwonband.admin.component.ExcelComponent;
import hakwonband.admin.component.SheetModel;
import hakwonband.admin.service.UserService;
import hakwonband.common.BaseAction;
import hakwonband.util.DataMap;

/**
 * 사용자 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/admin/user")
@Controller
public class UserController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(UserController.class);

	@Autowired
	private UserService userService;

	@Autowired
	private ExcelComponent excelComponent;

	/**
	 * 사용자 정보
	 * @url /admin/user/info.do
	 * @return
	 */
	@RequestMapping("/info")
	public void userInfo(HttpServletRequest request, HttpServletResponse response) {

		String userNo = request.getParameter("userNo");

		DataMap param = new DataMap();
		param.put("user_no",	userNo);

		DataMap userInfo = userService.getUserInfo(param);

		sendColData(userInfo, request, response);
	}

	/**
	 * 사용자 리스트 엑셀 저장
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list/excel")
	public void listExcel(HttpServletRequest request, HttpServletResponse response) {

		List<DataMap> dataList = userService.excelUserList();

		List<ColumnModel> headerList = new ArrayList<ColumnModel>();
		headerList.add(new ColumnModel("번호",	"user_no"));
		headerList.add(new ColumnModel("구분",	"user_type_name"));
		headerList.add(new ColumnModel("이름",	"user_name"));
		headerList.add(new ColumnModel("성별",	"user_gender"));
		headerList.add(new ColumnModel("아이디",	"user_id"));
		headerList.add(new ColumnModel("나이",	"user_age"));

		String fileName = excelComponent.convertFileName(request.getHeader("User-Agent"), "학원밴드 사용자 리스트");

		SheetModel sheetModel = new SheetModel(dataList, headerList);
		excelComponent.writeExcel(response, sheetModel, fileName);
	}

}