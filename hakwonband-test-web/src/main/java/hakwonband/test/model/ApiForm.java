package hakwonband.test.model;

import com.fasterxml.jackson.databind.ObjectMapper;

public class ApiForm {

	/**
	 * api 번호
	 */
	private long apiNo;

	/**
	 * 서비스 타입
	 */
	private String serviceType;

	/**
	 * api 이름
	 */
	private String apiName;

	/**
	 * api 설명
	 */
	private String apiDesc;

	/**
	 * api url
	 */
	private String apiUrl;

	/**
	 * method
	 */
	private String method;

	/**
	 * 헤더 정보
	 */
	private String headers;

	/**
	 * 폼 정보
	 */
	private String form;

	/**
	 * 등록자 이름
	 */
	private String regUserName;


	public String getServiceType() {
		return serviceType;
	}

	public void setServiceType(String serviceType) {
		this.serviceType = serviceType;
	}

	public String getApiName() {
		return apiName;
	}

	public void setApiName(String apiName) {
		this.apiName = apiName;
	}

	public String getApiDesc() {
		return apiDesc;
	}

	public void setApiDesc(String apiDesc) {
		this.apiDesc = apiDesc;
	}

	public String getApiUrl() {
		return apiUrl;
	}

	public void setApiUrl(String apiUrl) {
		this.apiUrl = apiUrl;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

	public String getHeaders() {
		return headers;
	}

	public void setHeaders(String headers) {
		this.headers = headers;
	}

	public String getForm() {
		return form;
	}

	public void setForm(String form) {
		this.form = form;
	}

	public long getApiNo() {
		return apiNo;
	}

	public void setApiNo(long apiNo) {
		this.apiNo = apiNo;
	}


	public String getRegUserName() {
		return regUserName;
	}

	public void setRegUserName(String regUserName) {
		this.regUserName = regUserName;
	}

	@Override
	public String toString() {
		String toStringStr = null;
		try {
			toStringStr = (new ObjectMapper()).writerWithDefaultPrettyPrinter().writeValueAsString(this);
		} catch(Exception e) {
			e.printStackTrace();
		}
		return toStringStr;
	}
}