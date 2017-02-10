package hakwonband.runtime.main;

import java.util.List;
import java.util.UUID;

import org.apache.commons.lang.StringUtils;
import org.springframework.context.ApplicationContext;

import hakwonband.runtime.core.HakwonRuntime;
import hakwonband.runtime.youtube.model.TargetFileInfo;
import hakwonband.runtime.youtube.service.YoutubeService;
import hakwonband.util.HKBandUtil;
import lombok.extern.slf4j.Slf4j;

/**
 * youtube 업로드
 * @author bumworld
 *
 */
@Slf4j
public class YoutubeMain extends HakwonRuntime {

	public YoutubeMain() {
		super();

		ApplicationContext context = getApplicationContext();
		YoutubeService youtubeService = context.getBean("youtubeService", YoutubeService.class);

		/**
		 * 대상 리스트 조회
		 */
		String runtime_id = UUID.randomUUID().toString();
		List<TargetFileInfo> targetList = youtubeService.targetInit(runtime_id);

		/**
		 * 업로드
		 */
		if( targetList != null && targetList.isEmpty() == false ) {
			log.info("target size : {}", targetList.size());
			for(int i=0; i<targetList.size(); i++) {
				TargetFileInfo targetFileInfo = targetList.get(i);
				log.info("target [{}] [{}]", i, targetFileInfo);

				youtubeService.executeUpload(targetFileInfo);
			}
		} else {
			log.info("targetList is null");
		}
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