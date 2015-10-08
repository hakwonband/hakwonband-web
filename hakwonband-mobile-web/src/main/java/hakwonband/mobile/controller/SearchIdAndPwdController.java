package hakwonband.mobile.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.common.BaseAction;
import hakwonband.common.exception.HKBandException;
import hakwonband.mobile.service.AsyncService;
import hakwonband.mobile.service.SearchIdAndPwdService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 로그인 예외 처리 컨트롤러
 * @author jszzang9
 *
 */
@Controller
public class SearchIdAndPwdController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(SearchIdAndPwdController.class);

	@Autowired
	private SearchIdAndPwdService searchIdAndPwdService;

	@Autowired
	private AsyncService asyncService;

	@RequestMapping("/findIdSearch")
	public void findIdSearch(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("user_name", request.getParameter("user_name"));
		param.put("tel1_no", request.getParameter("tel1_no"));

		DataMap resultFindId = searchIdAndPwdService.getUserFindId(param);

		sendColData(resultFindId, request, response);
	}

	@RequestMapping("/passwordReplacement")
	public void passwordReplacement(HttpServletRequest request, HttpServletResponse response) {

		String tel1No = request.getParameter("tel1_no");
		tel1No = StringUtil.replace(tel1No, "-", "");

		String user_email	= request.getParameter("user_email");
		String user_name	= request.getParameter("user_name");
		String receive_type	= request.getParameter("receive_type");

		if( "sms".equals(receive_type) || "email".equals(receive_type) ) {
		} else {
			throw new HKBandException();
		}

		DataMap param = new DataMap();
		param.put("user_id",		request.getParameter("user_id"));
		param.put("tel1_no",		tel1No);
		param.put("user_email",		user_email);
		param.put("user_name",		user_name);
		param.put("receive_type",	receive_type);

		DataMap result = searchIdAndPwdService.getPwdUserInfoCheck(param);

		if( result.equals("result", "success") ) {
			if( "sms".equals(receive_type) ) {
				DataMap smsInfo = (DataMap)result.get("smsInfo");

				asyncService.smsSend(smsInfo.getString("message"), smsInfo.getString("tel1_no"));
				result.remove("smsInfo");
			} else if( "email".equals(receive_type) ) {
				DataMap mailInfo = (DataMap)result.get("mailInfo");
				asyncService.mailSend(mailInfo);
				result.remove("mailInfo");
			}
		}

		sendColData(result, request, response);
	}
}