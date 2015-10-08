/**
 *
 */
package hakwonband.runtime.core;

import hakwonband.util.DataMap;

import java.lang.reflect.Method;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;

/**
 * @author bumworld
 *
 */
public class HakwonExecutor {

	/**
	 * 로거
	 */
	public static final Logger logger = LoggerFactory.getLogger(HakwonExecutor.class);

	private HakwonRuntime collabeeRuntime;
	public HakwonExecutor(HakwonRuntime collabeeRuntime) {
		this.collabeeRuntime = collabeeRuntime;
	}

	/**
	 * 실행 메소드
	 */
	public void executor(Class callClass, String methodName, DataMap param) {

		try {
			/**
			 * spring context 생성
			 */
			ApplicationContext context = collabeeRuntime.getApplicationContext();

			/**
			 * object 호출
			 */
			Object callObj = context.getBean(callClass);

			/**
			 * 메소드 생성 및 실행
			 */
			Method method = null;
			if( param == null ) {
				method = callClass.getMethod(methodName);
				method.invoke(callObj);
			} else {
				method = callClass.getMethod(methodName, DataMap.class);
				method.invoke(callObj, param);
			}
		} catch(Exception e) {
			logger.error("", e);
		}
	}
}