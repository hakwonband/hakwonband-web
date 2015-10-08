package hakwonband.runtime.main;

import hakwonband.runtime.core.HakwonRuntime;
import hakwonband.runtime.testIosPush.service.TestIosPushService;
import hakwonband.util.DataMap;
import hakwonband.util.HKBandUtil;

import org.apache.commons.lang.StringUtils;

public class TestIosPushMain extends HakwonRuntime {

	public TestIosPushMain(String user_id) {
		super();

		DataMap param = new DataMap();
		param.put("user_id", user_id);

		/**
		 * 테스트 발송
		 */
		run(TestIosPushService.class, "send", param);
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
		System.setProperty("runtime.service.name", "testIosPush");
		String user_id = null;
		if( args.length > 0 ) {
			user_id = args[0];
		}
		new TestIosPushMain(user_id);
    }
}