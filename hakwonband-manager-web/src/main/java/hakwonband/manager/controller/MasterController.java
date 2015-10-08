package hakwonband.manager.controller;

import hakwonband.common.BaseAction;
import hakwonband.manager.service.MasterService;
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
@RequestMapping("/manager/master")
@Controller
public class MasterController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(MasterController.class);

	@Autowired
	private MasterService masterService;

	/**
	 * 원장 상세
	 * @return
	 */
	@RequestMapping("/view")
	public void masterView(HttpServletRequest request, HttpServletResponse response) {

		String masterUserNo = request.getParameter("masterUserNo");

		DataMap param = new DataMap();
		param.put("user_no",	masterUserNo);

		DataMap colData = masterService.masterView(param);

		sendColData(colData, request, response);
	}
}