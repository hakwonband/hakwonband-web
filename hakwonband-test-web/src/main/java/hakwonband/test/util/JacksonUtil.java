package hakwonband.test.util;

import hakwonband.common.exception.HKBandException;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * object를 jackson을 이용해 json 문자열로 변환 한다.
 * @author bumworld
 *
 */
public class JacksonUtil {

	/**
	 * object 객체 json 문자열로 변환한다.
	 * @param obj
	 * @return
	 */
	public static String objToString(Object obj) {
		try {
			String jsonStr = (new ObjectMapper()).writerWithDefaultPrettyPrinter().writeValueAsString(obj);
			return jsonStr;
		} catch(Exception e) {
			throw new HKBandException(e);
		}
	}

	/**
	 * object 배열 객체 json 문자열로 변환한다.
	 * @param obj
	 * @return
	 */
	public static String arrayToString(Object [] objArray) {
		try {
			String jsonStr = (new ObjectMapper()).writerWithDefaultPrettyPrinter().writeValueAsString(objArray);
			return jsonStr;
		} catch(Exception e) {
			throw new HKBandException(e);
		}
	}
}