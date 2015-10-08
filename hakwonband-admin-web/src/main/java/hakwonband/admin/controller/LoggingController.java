package hakwonband.admin.controller;

import hakwonband.common.BaseAction;
import hakwonband.util.DataMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.logstash.logback.marker.Markers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 로깅 컨트롤러
 *
 * @author bumworld
 *
 */
@Controller
public class LoggingController extends BaseAction {

	private static final Logger clientLogger = LoggerFactory.getLogger("client.log");
	private static final Logger logger = LoggerFactory.getLogger(LoggingController.class);

	/**
	 * 로깅
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping("/logging")
	public void logging(@RequestBody String body, HttpServletRequest request, HttpServletResponse response) {

		try {
			DataMap logData = (new ObjectMapper()).readValue(body, DataMap.class);
			clientLogger.info(Markers.appendEntries(logData), "clientLog");
		} catch(Exception e) {
			logger.error("logging", e);
		}

		sendResponse("success", request, response);
	}
}