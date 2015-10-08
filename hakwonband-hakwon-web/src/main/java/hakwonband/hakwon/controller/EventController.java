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
import hakwonband.hakwon.service.EventService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 이벤트 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/hakwon/event")
@Controller
public class EventController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(EventController.class);

	@Autowired
	private EventService eventService;

	/**
	 * 이벤트 리스트
	 * /admin/event/list.do
	 * @return
	 */
	@RequestMapping("/list")
	public void list(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		int pageNo		= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int pageScale	= HakwonConstant.PageScale.EVENT_REQ;
		String hakwonNo	= request.getParameter("hakwon_no");

		DataMap param = new DataMap();
		param.put("start_no",	(pageNo-1)*pageScale);
		param.put("page_no",	pageNo);
		param.put("page_scale",	pageScale);
		param.put("hakwon_no",	hakwonNo);
		param.put("user_no",	authUserInfo.getString("user_no"));

		DataMap colData = eventService.eventList(param);
		colData.put("pageScale", pageScale);

		sendColData(colData, request, response);
	}

	/**
	 * 이벤트 상세
	 * /hakwon/event/view.do
	 * @return
	 */
	@RequestMapping("/view")
	public void view(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		
		String event_no	= request.getParameter("event_no");

		DataMap param = new DataMap();
		param.put("event_no",			event_no);
		/*	읽은 컨텐츠 처리	*/
		param.put("content_type", 		"003");					// 이벤트 컨텐츠 타입 : 003 이벤트
		param.put("content_parent_no",	event_no);	
		param.put("user_no",	authUserInfo.get("user_no"));

		DataMap colData = eventService.eventInfo(param);

		sendColData(colData, request, response);
	}
}