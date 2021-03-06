package hakwonband.runtime.main;

import org.apache.commons.lang.StringUtils;

import hakwonband.runtime.core.HakwonRuntime;
import hakwonband.runtime.googleOauth.service.GoogleOauthService;
import hakwonband.util.HKBandUtil;

/**
 * 구글 인증 리프레시
 * @author bumworld
 *
 */
public class GoogleOauthMain extends HakwonRuntime {

	public GoogleOauthMain() {
		super();

		/**
		 * 인증 토큰 리프레시
		 */
		run(GoogleOauthService.class, "updateGoogleOauth");
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
		System.setProperty("runtime.service.name", "googleOauth");
		new GoogleOauthMain();
    }
}