package hakwonband.admin.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

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

	/**
	 * 사용자 정보
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
}