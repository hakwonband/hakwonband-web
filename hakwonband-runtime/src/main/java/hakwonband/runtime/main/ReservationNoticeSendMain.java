package hakwonband.runtime.main;

import org.apache.commons.lang.StringUtils;

import hakwonband.runtime.core.HakwonRuntime;
import hakwonband.runtime.rms.service.ReservationNoticeSendService;
import hakwonband.util.HKBandUtil;

/**
 * 예약 공지 발송
 * @author bumworld
 *
 */
public class ReservationNoticeSendMain extends HakwonRuntime {

	public ReservationNoticeSendMain() {
		super();

		/**
		 * 예약 메세지 발송
		 */
		run(ReservationNoticeSendService.class, "executeSend");
	}

    /**
     * 예약 공지 발송
     * @param args
     */
    public static void main(String[] args) {
    	/**
		 * 로컬 실행일 경우에만 실행
		 */
		if( StringUtils.isBlank(HKBandUtil.getSysEnv("server.type")) ) {
			System.setProperty("server.type", "local");
		}
		System.setProperty("runtime.service.name", "rms");
		new ReservationNoticeSendMain();
    }
}