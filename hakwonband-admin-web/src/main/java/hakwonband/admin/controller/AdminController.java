package hakwonband.admin.controller;

import hakwonband.admin.service.UserService;
import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.util.DataMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * admin 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/admin")
@Controller
public class AdminController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(AdminController.class);

	@Autowired
	private UserService userService;

	/**
	 * 사용자 일시 정지 상태
	 * @param request
	 * @param response
	 * @url /admin/userStopChange.do
	 */
	@RequestMapping("/userStopChange")
	public void userStopChange(HttpServletRequest request, HttpServletResponse response) {
		String use_yn = request.getParameter("use_yn");
		String user_no = request.getParameter("user_no");

		if( "Y".equalsIgnoreCase(use_yn) ) {
			use_yn = "Y";
		} else if( "N".equalsIgnoreCase(use_yn) ) {
			use_yn = "N";
		} else {
			sendFlag(CommonConstant.Flag.param_error, request, response);
			return ;
		}

		DataMap param = new DataMap();
		param.put("use_yn",		use_yn);
		param.put("user_no",	user_no);

		/*	업데이트 처리	*/
		userService.updateUserStopChange(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}
}