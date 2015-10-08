package hakwonband.runtime.main;

import hakwonband.runtime.core.HakwonRuntime;
import hakwonband.runtime.eventPush.service.EventPushService;
import hakwonband.util.HKBandUtil;

import org.apache.commons.lang.StringUtils;

/**
 * 금일 이벤트 푸시
 * @author bumworld
 *
 */
public class EventPushMain extends HakwonRuntime {

	public EventPushMain() {
		super();

		/**
		 * 이벤트 푸시
		 */
		run(EventPushService.class, "todayEventPush");
	}

    /**
     * 파일 관리
     * 1. 사용하지 않는 파일 삭제
     * 2. 모바일 파일이 생성되지 않은 파일 생성
     * @param args
     */
    public static void main(String[] args) {
    	/**
		 * 로컬 실행일 경우에만 실행
		 */
		if( StringUtils.isBlank(HKBandUtil.getSysEnv("server.type")) ) {
			System.setProperty("server.type", "local");
		}
		System.setProperty("runtime.service.name", "eventPush");
		new EventPushMain();
    }
}