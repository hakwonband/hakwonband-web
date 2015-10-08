package hakwonband.runtime.hakwonExcel.model;

import java.util.ArrayList;
import java.util.List;

import hakwonband.runtime.utils.HakwonExcelUtils;
import hakwonband.util.StringUtil;

public class HakwonExcel {
	
	public HakwonExcel() {
		
	}
	
	public HakwonExcel(String name, String zipCode, String sido, String gungu, String dong, String cate, String lineNo) {
		this.hakwonName = name;
		this.hakwonZipCode = zipCode;
		this.hakwonSido = sido;
		this.hakwonGungu = gungu;
		this.hakwonDong = dong;
		this.hakwonCate = cate;
		this.lineNo = lineNo;
	}

	private List<String> wrongDatas = new ArrayList<String>(); 
	
	private String hakwonNo;
	private String hakwonCode;
	private String hakwonCate;
	private String hakwonName;
	private String hakwonZipCode;
	private String hakwonSido;
	private String hakwonGungu;
	private String hakwonDong;
	private String lineNo;
	
	public String getHakwonNo() {
		return hakwonNo;
	}
	public void setHakwonNo(String hakwonNo) {
		this.hakwonNo = hakwonNo;
	}
	public String getHakwonCode() {
		return hakwonCode;
	}
	public void setHakwonCode(String hakwonCode) {
		this.hakwonCode = hakwonCode;
	}
	public String getHakwonCate() {
		return hakwonCate;
	}
	public void setHakwonCate(String hakwonCate) {
		this.hakwonCate = hakwonCate;
	}
	public String getHakwonName() {
		return hakwonName;
	}
	public void setHakwonName(String hakwonName) {
		this.hakwonName = hakwonName;
	}
	public String getHakwonZipCode() {
		return hakwonZipCode;
	}
	public void setHakwonZipCode(String hakwonZipCode) {
		this.hakwonZipCode = hakwonZipCode;
	}
	public String getHakwonSido() {
		return hakwonSido;
	}
	public void setHakwonSido(String hakwonSido) {
		this.hakwonSido = hakwonSido;
	}
	public String getHakwonGungu() {
		return hakwonGungu;
	}
	public void setHakwonGungu(String hakwonGungu) {
		this.hakwonGungu = hakwonGungu;
	}
	public String getHakwonDong() {
		return hakwonDong;
	}
	public void setHakwonDong(String hakwonDong) {
		this.hakwonDong = hakwonDong;
	}
	
	
	public String getLineNo() {
		return lineNo;
	}

	public void setLineNo(String lineNo) {
		this.lineNo = lineNo;
	}

	public boolean isValidData() {
		boolean result = true;
		
		if(StringUtil.isNull(hakwonName) || hakwonName.length() > 100) {
			wrongDatas.add("name");
			result = false;
		}
		if(StringUtil.isNull(hakwonZipCode) || !HakwonExcelUtils.regexParam("\\d{3}-\\d{3}", hakwonZipCode)) {
			wrongDatas.add("zipCode");
			result = false;
		}
		if(StringUtil.isNull(hakwonSido) || hakwonSido.length() > 4) {
			wrongDatas.add("sido");
			result = false;
		}
		if(StringUtil.isNull(hakwonGungu) || hakwonGungu.length() > 17) {
			wrongDatas.add("gungu");
			result = false;
		}
		if(StringUtil.isNull(hakwonDong) || hakwonDong.length() > 40) {
			wrongDatas.add("dong");
			result = false;
		}
		if(StringUtil.isNull(hakwonCate) ||  !HakwonExcelUtils.regexParam("^[0-9]*$", hakwonCate) || Integer.parseInt(hakwonCate) > 23) {
			wrongDatas.add("cate");
			result = false;
		}
		
		return result;
	}
	
	public String dataLog() {
		String result = "";
		result += "data[" + lineNo + "] : " + hakwonName +" | " + hakwonZipCode + " | " + hakwonSido + " | " + hakwonGungu + " | " + hakwonDong + " | " + hakwonCate;
		result += "wrong data : " + wrongDatas.toString() + "\n";
		return result;
	}
	
	public static void main(String[] args) {
		System.out.println(HakwonExcelUtils.regexParam("^[0-9]*$", "3082"));
	}
	
}
