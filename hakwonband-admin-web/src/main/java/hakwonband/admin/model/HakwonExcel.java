package hakwonband.admin.model;

import hakwonband.admin.util.ExcelUploadUtil;
import hakwonband.util.StringUtil;

import java.util.ArrayList;
import java.util.List;

public class HakwonExcel {

	public HakwonExcel() {
		this.hakwonName = "";
		this.hakwonContact = "";
		this.hakwonAddress = "";
		this.hakwonCate = "";
	}

	private List<String> wrongDatas = new ArrayList<String>();		// 잘못된 데이터를 담을 리스트

	private String hakwonNo;		// 학원번호
	private String hakwonCode;		// 학원코드
	private String hakwonCate;		// 학원 카테고리
	private String hakwonName;		// 학원이름
	private String hakwonContact;	// 학원 전화번호
	private String hakwonAddress;	// 학원 주소
	private String hakwonZipCode;	// 학원 우편번호
	private String hakwonSido;		// 학원 시/도
	private String hakwonGungu;		// 학원 군/구
	private String hakwonDong;		// 학원 동
	private String addressNo;		// tb_address_zip 테이블의 주소번호
	private String lineNo;			// excel 줄번호

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
	public String getAddressNo() {
		return addressNo;
	}
	public void setAddressNo(String addressNo) {
		this.addressNo = addressNo;
	}
	public String getHakwonAddress() {
		return hakwonAddress;
	}
	public void setHakwonAddress(String hakwonAddress) {
		this.hakwonAddress = hakwonAddress;
	}
	public String getHakwonContact() {
		return hakwonContact;
	}
	public void setHakwonContact(String hakwonContact) {
		this.hakwonContact = hakwonContact;
	}
	/**
	 * 학원 데이터가 올바른지 검증
	 * @return
	 */
	public boolean isValidData() {
		boolean result = true;
		String[] addrArr = hakwonAddress.split(" ");		// 학원 주소 검증용

		/*	학원명 검증	*/
		if(StringUtil.isBlank(hakwonName) || hakwonName.length() > 100) {
			wrongDatas.add("학원명 오류 데이타 : "+hakwonName);
			result = false;
		}
		/*	연락처 검증	*/
		if( StringUtil.isBlank(hakwonContact) ) {
			/*	없으면 패스	*/
		} else {
			if(!hakwonContact.matches("^\\d{2,3}-\\d{3,4}-\\d{4}$") && !hakwonContact.matches("^[0-9]*$") ) {
				wrongDatas.add("연락처 오류 데이타 : "+hakwonContact);
				result = false;
			}
		}
		/*	주소 검증	*/
		if(StringUtil.isBlank(hakwonAddress) || addrArr == null ||addrArr.length != 3) {
			wrongDatas.add("주소 오류 데이타 : "+hakwonAddress);
			result = false;
		} else {
			hakwonSido = addrArr[0];
			hakwonGungu = addrArr[1].replace('^', ' ');
			hakwonDong = addrArr[2];
		}

		/*	카테고리 검증	*/
		if(!isValidCate(hakwonCate)) {
			wrongDatas.add("카테고리 오류 데이타 : "+hakwonCate);
			result = false;
		}

		return result;
	}

	public String getOriginData() {
		return "line[" + lineNo + "] : " + hakwonName +" | " + hakwonContact + " | " + hakwonAddress + " | " + hakwonCate + " | ";
	}

	/**
	 * 잘못된 데이터 로그
	 * @return
	 */
	public String dataLog() {
		String result = "";
		result += "line[" + lineNo + "] : " + hakwonName +" | " + hakwonContact + " | " + hakwonAddress + " | " + hakwonCate + " | ";
		result += "     "+ wrongDatas.toString();
		return result;
	}

	/**
	 * 학원 정보 setting
	 * @param columnindex
	 * @param value
	 */
	public void setHakwonData(int columnindex, String value) {
		//System.out.println("데이터["  + columnindex + "] : "+ value);
		
		value = StringUtil.replaceNull(value).trim();
		if (columnindex == 0) {			// 이름
			setHakwonName(value);
		} else if (columnindex == 1) {	// 연락처
			setHakwonContact(value);
		} else if (columnindex == 2) {	// 주소
			setHakwonAddress(value);
		} else if (columnindex == 3) {	// 카테고리
			setHakwonCate(value);
		}
	}
	
	/**
	 * 카테고리 검증 로직
	 * @param value
	 * @return
	 */
	public boolean isValidCate(String value) {
		
		boolean result = true;
		if(StringUtil.isBlank(value)) {
			result = false;
		} else {
			try {
				Double val = Double.parseDouble(value);
				int intVal = val.intValue();
				if(!ExcelUploadUtil.cateList.contains(intVal)) {
					result = false;
				} else {
					this.hakwonCate = String.format("%03d", intVal);
				}
			} catch(Exception e) {
				result = false;
			}
		}
		return result;
	}
	
	@Override
	public String toString() {
		return "HakwonExcel [hakwonNo=" + hakwonNo + ", hakwonCode="
				+ hakwonCode + ", hakwonCate=" + hakwonCate + ", hakwonName="
				+ hakwonName + ", hakwonContact=" + hakwonContact
				+ ", hakwonAddress=" + hakwonAddress + ", hakwonZipCode="
				+ hakwonZipCode + ", hakwonSido=" + hakwonSido
				+ ", hakwonGungu=" + hakwonGungu + ", hakwonDong=" + hakwonDong
				+ ", addressNo=" + addressNo + ", lineNo=" + lineNo + "]";
	}
}