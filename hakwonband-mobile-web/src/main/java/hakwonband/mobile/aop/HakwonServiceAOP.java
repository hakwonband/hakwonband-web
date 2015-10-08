package hakwonband.mobile.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StopWatch;

@Aspect
public class HakwonServiceAOP {

	private static final Logger logger = LoggerFactory.getLogger(HakwonServiceAOP.class);

	@Around("execution(* hakwonband.mobile.service.*Service.*(..))")
	public Object serviceTimeCheck(ProceedingJoinPoint joinPoint) throws Throwable {

		StopWatch stopWatch = new StopWatch();

		stopWatch.start();
		Object returnObj = joinPoint.proceed();
		stopWatch.stop();

		logger.debug("["+joinPoint.getTarget().getClass()+"]["+joinPoint.getSignature().getName()+"]["+stopWatch.getTotalTimeSeconds()+"]");
		if( stopWatch.getTotalTimeSeconds() > 1 ) {
			logger.warn("\n***************************************\n확인 해야 할 서비스~~~너무 오래 걸린다.\n***************************************");
		}


		return returnObj;
	}
}