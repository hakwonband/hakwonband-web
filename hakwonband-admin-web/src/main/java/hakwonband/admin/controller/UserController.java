package hakwonband.admin.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StopWatch;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.component.ColumnModel;
import hakwonband.admin.component.ExcelXlsComponent;
import hakwonband.admin.component.SheetModel;
import hakwonband.admin.service.UserService;
import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
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
	private ExcelXlsComponent excelXlsComponent;

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

//		List<DataMap> dataList = userService.excelUserList();
		StopWatch stopWatch = new StopWatch();
		stopWatch.start("db 조회");
		DataMap userDataList = userService.excelUserData();
		stopWatch.stop();

		List<ColumnModel> headerList = new ArrayList<ColumnModel>();
		headerList.add(new ColumnModel("번호",	"user_no"));
		headerList.add(new ColumnModel("구분",	"user_type_name"));
		headerList.add(new ColumnModel("이름",	"user_name"));
		headerList.add(new ColumnModel("성별",	"user_gender"));
		headerList.add(new ColumnModel("아이디",	"user_id"));
		headerList.add(new ColumnModel("나이",	"user_age"));
		headerList.add(new ColumnModel("이메일",	"user_email"));
		headerList.add(new ColumnModel("학원명",	"hakwon_name"));

		List<ColumnModel> studentHeaderList = new ArrayList<ColumnModel>();
		studentHeaderList.add(new ColumnModel("번호",	"user_no"));
		studentHeaderList.add(new ColumnModel("구분",	"user_type_name"));
		studentHeaderList.add(new ColumnModel("이름",	"user_name"));
		studentHeaderList.add(new ColumnModel("성별",	"user_gender"));
		studentHeaderList.add(new ColumnModel("아이디",	"user_id"));
		studentHeaderList.add(new ColumnModel("나이",	"user_age"));
		studentHeaderList.add(new ColumnModel("이메일",	"user_email"));
		//studentHeaderList.add(new ColumnModel("학원명",	"hakwon_name"));

		String fileName = excelXlsComponent.convertFileName(request.getHeader("User-Agent"), "학원밴드 사용자 리스트");

		List<DataMap> studentParentList	= (List<DataMap>)userDataList.get("studentParentList");
		List<DataMap> wonjangList		= (List<DataMap>)userDataList.get("wonjangList");
		List<DataMap> managerList		= (List<DataMap>)userDataList.get("managerList");


		SheetModel studentParentSheetModel = new SheetModel(studentParentList, studentHeaderList);
		studentParentSheetModel.setSheetName("학생_학부모");
		SheetModel wonjangSheetModel = new SheetModel(wonjangList, headerList);
		wonjangSheetModel.setSheetName("원장님_선생님");
		SheetModel managerSheetModel = new SheetModel(managerList, headerList);
		managerSheetModel.setSheetName("매니저");

		List<SheetModel> sheetModelList = new ArrayList<SheetModel>();
		sheetModelList.add(studentParentSheetModel);
		sheetModelList.add(wonjangSheetModel);
		sheetModelList.add(managerSheetModel);

		stopWatch.start("엑셀 생성");
		excelXlsComponent.write(response, sheetModelList,fileName);
		stopWatch.stop();

		System.out.println("stopWatch\n" + stopWatch.prettyPrint());
	}

	/**
	 * 알림 off
	 * @param request
	 * @param response
	 */
	@RequestMapping("/alarmOff")
	public void alarmOff(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String start_date	= request.getParameter("start_date");
		String end_date	= request.getParameter("end_date");

		userService.updateUserAlarmOff(authUserInfo.getLong("user_no"), start_date, end_date);

		DataMap rtnMap = new DataMap();
		rtnMap.put("flag",	CommonConstant.Flag.success);

		sendColData(rtnMap, request, response);
	}
}