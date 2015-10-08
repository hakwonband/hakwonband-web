package hakwonband.mobile.util;

import hakwonband.mobile.common.constant.HakwonConstant;
import hakwonband.util.StringUtil;


public class Test {
	public static void main(String...args) {
		int page_no			= StringUtil.parseInt("3", 1);
		int page_scale		= HakwonConstant.PageScale.HAKWON_REQ;
		System.out.println("start_no  :  " + (page_no-1) * page_scale);
		System.out.println("page_scale : " + page_scale * Integer.parseInt("3"));
		
	}
}
