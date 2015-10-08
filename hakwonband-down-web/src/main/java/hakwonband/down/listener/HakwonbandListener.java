package hakwonband.down.listener;

import hakwonband.util.HKBandUtil;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.lang.StringUtils;

public class HakwonbandListener implements ServletContextListener {

	@Override
	public void contextInitialized(ServletContextEvent sce) {

		/**
		 * SYSTEM 정보
		 */
		System.out.println("SysInfo------------------------------------------------------");
		System.out.println(HKBandUtil.getSysInfo());
	    System.out.println("SysInfo End------------------------------------------------------");

		/**
		 * server.type 설정
		 */
		String serverType	= HKBandUtil.getSysEnv("server.type");
		System.out.println("default serverType["+serverType+"]");
		if( StringUtils.isBlank(serverType) ) {
			System.setProperty("server.type", "local");
			serverType = "local";
		}
		System.out.println("serverType : " + serverType);


		/**
		 * server.name 설정
		 */
		String serverName	= HKBandUtil.getSysEnv("server.name");
		if( StringUtils.isBlank(serverName) ) {
			System.setProperty("server.name", "localhost");
			serverName = "localhost";
		}
		System.out.println("serverName : " + serverName);


	    ServletContext servletContext = sce.getServletContext();
	    System.out.println("ServletContext ServerInfo["+servletContext.getServerInfo()+"]");
	    System.out.println("ServletContext ServletContextName["+servletContext.getServletContextName()+"]");
	    System.out.println("ServletContext ContextPath["+servletContext.getContextPath()+"]");
	    System.out.println("ServletContext MajorVersion["+servletContext.getMajorVersion()+"]");
	    System.out.println("ServletContext getInitParameterNames["+servletContext.getInitParameterNames()+"]");
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
	}
}