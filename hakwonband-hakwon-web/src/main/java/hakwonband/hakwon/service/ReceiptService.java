package hakwonband.hakwon.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.hakwon.dao.ReceiptDAO;
import hakwonband.util.DataMap;
import hakwonband.util.DateUtil;
import hakwonband.util.StringUtil;

@Service
public class ReceiptService {

	@Autowired
	private ReceiptDAO receiptDAO;

	private static final Logger logger = LoggerFactory.getLogger(ReceiptService.class);

	public void insertReceipt(DataMap param) {
		/*	수납등록	*/
		receiptDAO.insertReceipt(param);

		/*	수납월 등록	*/
		if( param.get("receiptMonth") != null ) {
			String[] receiptMonth = (String[])param.get("receiptMonth");
			for(String month : receiptMonth) {
				param.put("receiptMonth", month);
				receiptDAO.insertReceiptMonth(param);
			}
		}
	}

	public List<DataMap> selectStudent(DataMap param) {
		return receiptDAO.selectStudent(param);
	}

	public List<DataMap> selectReceiptList(DataMap param) {
		List<DataMap> resultList = receiptDAO.selectReceiptList(param);
		return resultList;
	}

	public List<DataMap> selectReceiptListAll(DataMap param) {
		List<DataMap> resultList = receiptDAO.selectReceiptListAll(param);
		return resultList;
	}

	public int selectReceiptCount(DataMap param) {
		return receiptDAO.selectReceiptCount(param);
	}

	public List<DataMap> selectClassList(DataMap param) {
		return receiptDAO.selectClassList(param);
	}

	/**
	 * 상세 조회
	 * @param param
	 * @return
	 */
	public DataMap selectReceiptDetail(DataMap param) {
		DataMap result = receiptDAO.selectReceiptDetail(param);

		/*	조회된 정보의 수납일로부터 3개월 전부터 1년까지의 수납리스트를 조회
		 *  boolean 값이 없으면 수납이 안된월
		 *  boolean == true 면, 현재 수납외의 다른 수납에서 등록한 월
		 *  boolean == false 면, 현재 조회한 수납에서 등록한 월
		 */
		if(result != null) {

			/*	등록월 -3 월부터 ~ 12개월 구하기	*/
			String startDate = result.getString("reg_date");
			startDate = startDate.substring(0, 4) + startDate.substring(5, 7);
			startDate = DateUtil.addMonth(startDate, -3, "yyyyMM");

			param.put("hakwonNo", result.getString("hakwon_no"));
			param.put("studentNo", result.getString("student_no"));
			param.put("startDate", startDate);
			List<DataMap> resultList = selectReceiptYear(param);

			List<String> receiptMonthList = receiptDAO.selectReceiptMonth(param);

			for(int i=0,imax=resultList.size(); i<imax; i++) {
				if(receiptMonthList.contains(resultList.get(i).getString("receipt_month"))) {
					resultList.get(i).put("boolean", "false");		// 상세 조회를 하는 수납에 포함된 수납일이면 boolean을 false로 셋팅.
				}
			}
			result.put("receiptList", resultList);
		}
		return result;
	}

	/**
	 * 수납 수정
	 * @param param
	 */
	public void updateReceipt(DataMap param) {
		receiptDAO.updateReceipt(param);


		if("true".equals(param.getString("receiptMonthHashChanged"))) {
			/*	기존의 수납월 데이터 삭제	*/
			receiptDAO.deleteReceiptMonth(param);

			/*	새로운 수납월 등록	*/
			if(param.get("receiptMonth") != null) {
				String[] receiptMonth = (String[])param.get("receiptMonth");
				for(String month : receiptMonth) {
					param.put("receiptMonth", month);
					receiptDAO.insertReceiptMonth(param);
				}
			}
		}

	}

	/**
	 * 수납 데이타 삭제
	 * @param param
	 */
	public void deleteReceipt(DataMap param) {


		receiptDAO.deleteReceipt(param);

		/*	기존의 수납월 데이터 삭제	*/
		receiptDAO.deleteReceiptMonth(param);
	}

	/**
	 * 현재 날짜로부터 일년치의 수납 데이터를 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> selectReceiptYear(DataMap param) {
		List<String> resultListTmp = receiptDAO.selectReceiptYear(param);

		List<DataMap> resultList = new ArrayList<DataMap>();
		String[] yearDate = getAnYearDatesFromSpecificDate(param.getString("startDate"));

		boolean isThisDateSuccess;
		for(String yearDateTmp : yearDate) {
			isThisDateSuccess = false;		// 초기화
			DataMap dataMap = new DataMap();
			for(String str : resultListTmp) {
				if(yearDateTmp.equals(str)) {
					dataMap.put("receipt_month", str);
					dataMap.put("boolean", "true");
					isThisDateSuccess = true;
					break;
				}
			}

			if(!isThisDateSuccess) {
				dataMap.put("receipt_month", yearDateTmp);
			}
			resultList.add(dataMap);
		}

		return resultList;
	}

	/**
	 * 기준월로부터 시작한 일년의 년월 데이터
	 * yyyyMM 포맷의 기준날짜를 입력하여 그로부터 일년뒤까지의 년월 데이터를 얻는다.
	 * @param standardDate
	 * @return
	 */
	private String[] getAnYearDatesFromSpecificDate(String standardDate) {
		int year = Integer.parseInt(standardDate.substring(0, 4));
		int month = Integer.parseInt(standardDate.substring(4, 6));
		String[] date = new String[12];
		date[0] = standardDate;
		String tmpMonth;
		for(int i=1; i<12; i++) {
			if(month < 12) {
				month++;
			} else {
				year++;
				month=1;
			}
			if(month < 10) {
				tmpMonth = "0" + month;
			} else {
				tmpMonth = String.valueOf(month);
			}
			date[i] = year + tmpMonth;
		}
		return date;
	}

	/**
	 * 학생의 일년간의 수납 결과 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> selectReceiptYearList(DataMap param) {

		List<DataMap> resultList = receiptDAO.selectReceiptYearList(param);

		if(resultList != null && !resultList.isEmpty()) {
			for(int i=0,imax=resultList.size(); i<imax; i++) {
				DataMap tmpMap = resultList.get(i);
				putGarbageAtt(tmpMap);

				String str = tmpMap.getString("month_n_date");
				if(str != null) {
					String [] str2 = str.split("\\|");
					for(String str3 : str2) {
						String [] monthTmp = str3.split(",");

						if( monthTmp.length == 1 ) {
							continue;
						}

						StringBuffer specificDate = new StringBuffer();
						specificDate.append(monthTmp[1].substring(5, 7));
						specificDate.append("/");
						specificDate.append(monthTmp[1].substring(8, 10));
						tmpMap.put(convertNumber(monthTmp[0].substring(4,  6)), specificDate.toString());
					}
				}
			}
		}
		return resultList;
	}

	/**
	 * 엑셀 저장을 위한 데이타
	 * @param param
	 * @return
	 */
	public List<DataMap> selectReceiptYearListAll(DataMap param) {

		List<DataMap> resultList = receiptDAO.selectReceiptYearListAll(param);

		if(resultList != null && !resultList.isEmpty()) {
			for(int i=0,imax=resultList.size(); i<imax; i++) {
				DataMap tmpMap = resultList.get(i);

				String str = tmpMap.getString("month_n_date");
				if(str != null) {
					String[] str2 = str.split("\\|");
					for(String str3 : str2) {
						String [] monthTmp = str3.split(",");

						if( monthTmp.length == 1 ) {
							tmpMap.put(monthTmp[0], "");
						} else {
							tmpMap.put(monthTmp[0], monthTmp[1]);
						}
 					}
				}
			}
		}
		return resultList;
	}

	/**
	 * 공백 데이터 채우기
	 * @param map
	 */
	private void putGarbageAtt(DataMap map) {
		map.put("one",		"X");
		map.put("two",		"X");
		map.put("three",	"X");
		map.put("four",		"X");
		map.put("five",		"X");
		map.put("six",		"X");
		map.put("seven",	"X");
		map.put("eight",	"X");
		map.put("nine",		"X");
		map.put("ten",		"X");
		map.put("eleven",	"X");
		map.put("twelve",	"X");
	}

	/**
	 * 숫자 문자열을 영문으로 변환
	 * @param no
	 * @return
	 */
	private String convertNumber(String no) {
		String result = "";
		if(StringUtil.isBlank(no)) return "";

		switch(no) {
		case "01" :
			result = "one";
			break;
		case "02" :
			result = "two";
			break;
		case "03" :
			result = "three";
			break;
		case "04" :
			result = "four";
			break;
		case "05" :
			result = "five";
			break;
		case "06" :
			result = "six";
			break;
		case "07" :
			result = "seven";
			break;
		case "08" :
			result = "eight";
			break;
		case "09" :
			result = "nine";
			break;
		case "10" :
			result = "ten";
			break;
		case "11" :
			result = "eleven";
			break;
		case "12" :
			result = "twelve";
			break;
		}
		return result;
	}

	/**
	 * 학원의 학생들 전체 카운트 조회 (학생별 수납리스트의 학생 목록)
	 * @param param
	 * @return
	 */
	public int selectTotalStudentCount(DataMap param) {
		return receiptDAO.selectTotalStudentCount(param);
	}


	/**
	 * 학원의 기간별 입금, 출금 총액 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> selectInAndOutMoneySum(DataMap param) {
		return receiptDAO.selectInAndOutMoneySum(param);
	}
}