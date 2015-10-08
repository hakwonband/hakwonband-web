package hakwonband.test.util;

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
}
