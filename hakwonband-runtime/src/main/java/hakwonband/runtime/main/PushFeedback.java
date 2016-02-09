package hakwonband.runtime.main;

import org.apache.commons.lang.StringUtils;

import hakwonband.runtime.core.HakwonRuntime;
import hakwonband.runtime.pushFeedback.service.PushFeedbackService;
import hakwonband.util.DataMap;
import hakwonband.util.HKBandUtil;

/**
 * APNS feedback service 구현. device token이 만료된 login_hist를 삭제한다.
 * @author MinYoung
 *
 */
public class PushFeedback extends HakwonRuntime {

	public PushFeedback(String serverType) {
		super();
		DataMap param = new DataMap();
		param.put("serverType", serverType);
		run(PushFeedbackService.class, "executeFeedback", param);
	}

    /**
     * 파일 관리
     * 1. 사용하지 않는 파일 삭제
     * 2. 모바일 파일이 생성되지 않은 파일 생성
     * @param args
     */
    public static void main(String[] args) {

    	String serverType = HKBandUtil.getSysEnv("server.type");
    	/**
		 * 로컬 실행일 경우에만 실행
		 */
		if( StringUtils.isBlank(serverType) ) {
			serverType = "local";
			System.setProperty("server.type", serverType);
		}

		String confServerType = serverType;
		if( serverType.startsWith("live") ) {
			confServerType = "live";
		}
		System.setProperty("conf.server.type", confServerType);

		System.setProperty("runtime.service.name", "apnsFeedback");
		new PushFeedback(serverType);
    }

}
