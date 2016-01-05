package hakwonband.runtime.main;

import org.apache.commons.lang.StringUtils;

import hakwonband.runtime.core.HakwonRuntime;
import hakwonband.runtime.noticeShare.service.NoticeShareService;
import hakwonband.util.HKBandUtil;

public class NoticeShareDeleteMain extends HakwonRuntime {

	public NoticeShareDeleteMain() {
		super();

		/**
		 * 공유기간 끝난 공지 삭제
		 */
		run(NoticeShareService.class, "deleteNoticeShare");
	}

    /**
     * 공유기간 끝난 공지 삭제
     * @param args
     */
    public static void main(String[] args) {
    	/**
		 * 로컬 실행일 경우에만 실행
		 */
		if( StringUtils.isBlank(HKBandUtil.getSysEnv("server.type")) ) {
			System.setProperty("server.type", "local");
		}
		System.setProperty("runtime.service.name", "noticeShare");
		new NoticeShareDeleteMain();
    }
}