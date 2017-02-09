package hakwonband.runtime.main;

import org.apache.commons.lang.StringUtils;

import hakwonband.runtime.core.HakwonRuntime;
import hakwonband.runtime.youtube.service.YoutubeService;
import hakwonband.util.HKBandUtil;

/**
 * youtube 업로드
 * @author bumworld
 *
 */
public class YoutubeMain extends HakwonRuntime {

	public YoutubeMain() {
		super();

		/**
		 * 인증 토큰 리프레시
		 */
		run(YoutubeService.class, "executeUpload");
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
		System.setProperty("runtime.service.name", "youtube");
		new YoutubeMain();
    }
}