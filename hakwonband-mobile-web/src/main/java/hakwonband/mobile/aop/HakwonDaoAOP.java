package hakwonband.mobile.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StopWatch;

/**
 * local 모드에서 dao 수행시간을 체크하기 위해 사용한다.
 *
 * @author bumworld
 *
 */
@Aspect
public class HakwonDaoAOP {

	private static final Logger logger = LoggerFactory.getLogger(HakwonDaoAOP.class);

	/**
	 * DAO 메소드의 걸린시간 체크
	 *
	 * @param joinPoint
	 * @param error
	 * @throws Throwable
	 */
	@Around("execution(* hakwonband.hakwon.dao.*DAO.*(..))")
	public Object daoTimeLogging(ProceedingJoinPoint pjp) throws Throwable {

		StopWatch stopWatch = new StopWatch();

		stopWatch.start();
		Object retVal = pjp.proceed();
		stopWatch.stop();

		if( stopWatch.getTotalTimeMillis() > 2000 ) {
			StringBuilder sb = new StringBuilder();
			sb.append(pjp.getTarget().getClass().getSimpleName());
			sb.append('.');
			sb.append(pjp.getSignature().getName());
			sb.append('(');
			sb.append(')');
			sb.append("'s execution time: ");
			sb.append(stopWatch.getTotalTimeMillis());
			sb.append(" ms, parameters: ");
			Object[] args = pjp.getArgs();
			for (Object arg : args) {
				sb.append(arg).append(',');
			}
			if (args.length > 0) {
				sb.deleteCharAt(sb.length() - 1);
			}
			logger.info("\n--------------------------------------\n"+sb.toString());
		}

		return retVal;
	}
}