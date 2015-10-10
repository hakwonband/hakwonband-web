package hakwonband.runtime.rms.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.runtime.rms.dao.ReservationMessageSendDAO;
import hakwonband.util.DataMap;

/**
 * 예약 메세지 발송
 * @author bumworld
 */
@Service
public class ReservationMessageSendService {

	public static final Logger logger = LoggerFactory.getLogger(ReservationMessageSendService.class);

	@Autowired
	private ReservationMessageSendDAO reservationMessageSendDAO;

	/**
	 * 예약 메세지 발송
	 * @param param
	 */
	public void send(DataMap param) {
		try {
			System.out.println("System.out.println send call~~~");
			logger.debug("logger send call~~~");
		} catch (Exception e) {
			logger.error("", e);
		}
	}
}