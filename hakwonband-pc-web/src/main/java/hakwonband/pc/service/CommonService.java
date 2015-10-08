package hakwonband.pc.service;

import hakwonband.api.PushSend;
import hakwonband.pc.dao.CommonDAO;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * 공통 서비스
 * @author bumworld
 *
 */
@Service
public class CommonService {

	public static final Logger logger = LoggerFactory.getLogger(CommonService.class);

	@Autowired
	private CommonDAO commonDAO;

	@Autowired
	private JavaMailSender naverWorksMailSender;

	/**
	 * 문의 메일
	 *
	 * @param param
	 */
	public void executeQuestionsMail(DataMap param) {

		/*	문의 메일 등록	*/
		commonDAO.insertQuestionsMail(param);

		/*	관리자 디바이스 리스트 조회	*/
		List<UserDevice> deviceList = commonDAO.adminDeviceList();
		logger.info("executeMasterMessageSend deviceList["+deviceList+"]");
		if( deviceList != null && deviceList.size() > 0 ) {
			PushMessage pushMessage = new PushMessage();
			pushMessage.setTicker("학원밴드 입니다.");
			//pushMessage.setTitle(param.getString("email")+"님께서 제휴 문의를 보냈습니다.");
			pushMessage.setTitle("제휴 문의를 받았습니다.");
			pushMessage.setContent(param.getString("title"));
			pushMessage.setLink_url("https://admin.hakwonband.com/main.html#/questionsMail/list");

			PushSend.send(deviceList, pushMessage);
		}

	}
}