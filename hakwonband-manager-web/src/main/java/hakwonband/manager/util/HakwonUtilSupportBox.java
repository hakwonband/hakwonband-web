package hakwonband.manager.util;

import hakwonband.util.DataMap;

import java.util.UUID;

public class HakwonUtilSupportBox {
	private static HakwonUtilSupportBox box;
	public static HakwonUtilSupportBox getInstance() {
		if (box == null) {
			synchronized (HakwonUtilSupportBox.class) {
				if (box == null)
					box =  new HakwonUtilSupportBox();
			}
		}
		
		return box;
	}
	
	public  String makeRandomString() {
		return UUID.randomUUID().toString().replace("-", "");
	}
	
	public  void selectCheckParam(String name, String param, DataMap selectParams) {
		if (param != null)
			selectParams.put(name, param);
	}
	
	public void updateCheckParam(String name, String param, DataMap updateParams) {
		if (param != null)
			updateParams.put(name, param);
	}
	
	public  void deleteCheckParam(String name, String param, DataMap selectParams) {
		if (param != null)
			selectParams.put(name, param);
	}
	
	public String replaceString(String str) {
		String subStr = str.substring(0, 3);

		int subLength = str.length() - 3;

		String result = "";
		for (int i=0; i<subLength; i++)
			result += "*";

		return subStr + result;
	}
}
