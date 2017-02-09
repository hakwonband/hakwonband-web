/**
 *
 */
package hakwonband.runtime.core;

import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.logging.LogFactory;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.joran.JoranConfigurator;
import hakwonband.common.exception.HKBandException;
import hakwonband.util.DataMap;
import hakwonband.util.HKBandUtil;

/**
 * @author bumworld
 *
 */
public abstract class HakwonRuntime {

	/**
	 * 서비스 이름
	 */
	private String serviceName;

	private static final String defaultMethodName = "execute";

	/**
	 * 생성자
	 */
	public HakwonRuntime() {
		this.serviceName = HKBandUtil.getSysEnv("runtime.service.name");
		System.out.println("serviceName["+serviceName+"]");

		/**
		 * 서버 타입 설정
		 */
		String serverType = HKBandUtil.getSysEnv("server.type");
		if( StringUtils.isBlank(serverType) ) {
			serverType = "local";
			System.setProperty("server.type", serverType);
		}
		System.out.println("serverType["+serverType+"]");

		/**
		 * class path 경로 설정
		 */
		String classPath = this.getClass().getProtectionDomain().getCodeSource().getLocation().getPath();
		System.out.println("classPath["+classPath+"]");

		/**
		 * logback xml 경로 셋팅
		 */
		String logbackConfigLocation = "property/" + serverType + "/logback.xml";
		System.out.println("logbackConfigLocation[" + logbackConfigLocation + "]");
		System.out.println("logback Location[" + classPath + logbackConfigLocation+ "]");

		/**
		 * logback 로딩
		 */
		try {
			LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
			JoranConfigurator configurator = new JoranConfigurator();
			configurator.setContext(loggerContext);
			configurator.doConfigure(classPath + logbackConfigLocation);

			/*	mybatis slf4j use	*/
			LogFactory.useSlf4jLogging();
		} catch(Exception e) {
			e.printStackTrace();
			throw new HKBandException(e);
		}
	}

	/**
	 * spring ApplicationContext 생성
	 * @return
	 */
	protected ApplicationContext getApplicationContext() {
		String springConfigPath = "spring/"+serviceName+"/applicationContext-*.xml";
		System.out.println("springConfigPath["+springConfigPath+"]");
		return new ClassPathXmlApplicationContext(springConfigPath);
	}

	/**
	 * 메소드 실행
	 * @param callClass
	 */
	protected void run(Class callClass) {
		run(callClass, defaultMethodName, null);
	}

	/**
	 * 메소드 실행
	 * @param callClass
	 * @param methodName
	 */
	protected void run(Class callClass, String methodName) {
		run(callClass, methodName, null);
	}
	/**
	 * 메소드 실행
	 * @param callClass
	 * @param methodName
	 */
	protected void run(Class callClass, String methodName, DataMap param) {
		System.out.println("callClass["+callClass.getName()+"] methodName["+methodName+"] param["+param+"]");
		(new HakwonExecutor(this)).executor(callClass, methodName, param);
	}
}