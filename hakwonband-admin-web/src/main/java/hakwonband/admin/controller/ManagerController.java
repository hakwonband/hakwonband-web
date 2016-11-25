package hakwonband.admin.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.service.ManagerService;
import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 매니저 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/admin/manager")
@Controller
public class ManagerController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(ManagerController.class);

	@Autowired
	private ManagerService managerService;

	/**
	 * 매니저 리스트
	 * @return
	 */
	@RequestMapping("/list")
	public void managerList(HttpServletRequest request, HttpServletResponse response) {

		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale	= HakwonConstant.PageScale.MANAGER_LIST;

		String searchText = request.getParameter("searchText");

		DataMap param = new DataMap();
		param.put("startNo",	(pageNo-1)*pageScale);
		param.put("pageScale",	pageScale);
		param.put("searchText",	searchText);


		DataMap colData = managerService.managerList(param);
		colData.put("pageScale",	pageScale);

		sendColData(colData, request, response);
	}
	/**
	 * 매니저 미승인 리스트
	 * @return
	 */
	@RequestMapping("/unauthorizedUserList")
	public void unauthorizedUserList(HttpServletRequest request, HttpServletResponse response) {

		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale	= HakwonConstant.PageScale.PARENT_LIST;

		String searchText = request.getParameter("searchText");

		DataMap param = new DataMap();
		param.put("startNo",	(pageNo-1)*pageScale);
		param.put("pageScale",	pageScale);
		param.put("searchText",	searchText);

		/**
		 * 미승인 매니저 리스트 및 카운트
		 */
		DataMap colData = managerService.unauthorizedUserList(param);
		colData.put("pageScale",	pageScale);

		sendColData(colData, request, response);
	}

	/**
	 * 가입 요청 승인/거절 처리
	 * @param request
	 * @param response
	 */
	@RequestMapping("/updateApproved")
	public void updateApproved(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String approvedYn	= request.getParameter("approvedYn");
		String [] userNoArray	= request.getParameterValues("approvedUserNo");

		DataMap param = new DataMap();
		param.put("approvedYn", approvedYn);
		param.put("userNoArray", userNoArray);
		param.put("userNo",		authUserInfo.getString("user_no"));

		/*	승인 처리	*/
		managerService.updateApproved(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 매니저 상세
	 * @return
	 */
	@RequestMapping("/view")
	public void managerView(HttpServletRequest request, HttpServletResponse response) {

		String managerUserNo = request.getParameter("managerUserNo");

		DataMap param = new DataMap();
		param.put("user_no",	managerUserNo);

		DataMap colData = managerService.managerView(param);

		sendColData(colData, request, response);
	}
}