package hakwonband.runtime.main;

import org.apache.commons.lang.StringUtils;

import hakwonband.runtime.core.HakwonRuntime;
import hakwonband.runtime.createUser.service.CreateUserService;
import hakwonband.util.HKBandUtil;

/**
 * 사용자 생성
 * @author bumworld
 *
 */
public class CreateUserBatch extends HakwonRuntime {

	public CreateUserBatch() {
		super();

		/**
		 * 사용자 생성
		 */
		run(CreateUserService.class, "createStudent");
	}

    /**
     * 사용자 생성
     * @param args
     */
    public static void main(String[] args) {
    	/**
		 * 로컬 실행일 경우에만 실행
		 */
		if( StringUtils.isBlank(HKBandUtil.getSysEnv("server.type")) ) {
			System.setProperty("server.type", "local");
		}
		System.setProperty("runtime.service.name", "createUser");
		new CreateUserBatch();
    }
}