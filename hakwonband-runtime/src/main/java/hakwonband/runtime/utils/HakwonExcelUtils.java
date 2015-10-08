package hakwonband.runtime.utils;

public class HakwonExcelUtils {

	public static boolean regexParam(String regex, String param) {
		return param.matches(regex);
	}
}
