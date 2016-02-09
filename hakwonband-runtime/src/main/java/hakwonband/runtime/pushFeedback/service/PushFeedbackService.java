package hakwonband.runtime.pushFeedback.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;

import com.notnoop.apns.APNS;
import com.notnoop.apns.ApnsService;

import hakwonband.runtime.pushFeedback.dao.PushFeedbackDAO;
import hakwonband.util.CommonConfig;
import hakwonband.util.DataMap;

@Service
public class PushFeedbackService {

	private static final Logger logger = LoggerFactory.getLogger(PushFeedbackService.class);

	private static final String apnsDevCert = CommonConfig.getString("mobilePush/ios/devCertPath");
	private static final String apnsProductCert= CommonConfig.getString("mobilePush/ios/productionCertPath");
	private static final String apnsPasswd = CommonConfig.getString("mobilePush/ios/passwd");

	@Autowired
	private PushFeedbackDAO pushFeedbackDAO;

	public void executeFeedback(DataMap param) {
		String serverType = param.getString("serverType");

		String startingLogger = String.format("start feed back!!! -- serverType [%s]", serverType);
		logger.debug(startingLogger);

		String apnsDevCertPath = getClass().getResource(apnsDevCert).getPath();
		String apnsProductCertPath = getClass().getResource(apnsProductCert).getPath();

		StopWatch stopWatch = new StopWatch();
		stopWatch.start();

		ApnsService sandboxService = APNS.newService().withCert(apnsDevCertPath, apnsPasswd).withSandboxDestination().build();
		ApnsService productionService = APNS.newService().withCert(apnsProductCertPath, apnsPasswd).withProductionDestination().build();

		Map<String, Date> inactiveDevices = null;
		if("local".equals(serverType)) {
			inactiveDevices = sandboxService.getInactiveDevices();
		} else {
			inactiveDevices = productionService.getInactiveDevices();
		}

		List<String> deviceKeyList = new ArrayList<String>(inactiveDevices.keySet());
		logger.info("------------------------------------------------");
		logger.info("inactive devices :" + inactiveDevices.size());
		for (String deviceKey : deviceKeyList) {
			logger.info(deviceKey);
		}
		logger.info("------------------------------------------------");

		if(deviceKeyList.size() > 0) {
			DataMap daoParam = new DataMap();
			daoParam.put("list", deviceKeyList);
			pushFeedbackDAO.deleteLoginHist(daoParam);
		}
	}
}
