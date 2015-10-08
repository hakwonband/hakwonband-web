package hakwonband.hakwon.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import hakwonband.util.DataMap;

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

	/**
	 * obj가 널이 아니면, List<DataMap>으로 변환해서 반환
	 * @param obj
	 * @return
	 */
	public static List<DataMap> getReqList(Object obj) {
		if(obj == null) return null;

		return (List<DataMap>)obj;
	}

	/**
	 * obj가 널이 아니면, DataMap으로 변환해서 반환
	 * @param obj
	 * @return
	 */
	public static DataMap getDataMap(Object obj) {
		if(obj == null) return null;

		return (DataMap)obj;
	}

	/**
	 * 기준되는 문자열 날짜의 +/- day 의 결과값 리턴
	 * @param startDay
	 * @param addDay
	 * @param dateFormatType
	 * @return
	 */
	public static String addDate(String startDay, int addDay, String dateFormatType) {
		String date = "";
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(dateFormatType);
			Date sDate = sdf.parse(startDay);
			Calendar cal = Calendar.getInstance();
			cal.setTime(sDate);
			cal.add(Calendar.DATE, addDay);
			date = sdf.format(cal.getTime());
			cal = null;
		} catch(Exception e) {
			e.printStackTrace();
		}
		return date;
	}

	/**
	 * 시작 ~ 끝의 기간내의 날짜들을 리스트에 담아서 리턴
	 * @param start
	 * @param end
	 * @param dateFormat
	 * @return
	 */
	public static List<String> getDates(String start, String end, String dateFormat) {
		List<String> dateList = new ArrayList<String>();

		if(!start.equals(end)) {
			SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
			Date date;
			try {
				date = sdf.parse(start);
				Calendar cal = Calendar.getInstance();
				cal.setTime(date);
				String dateTmp;
				while(true) {
					cal.add(Calendar.DATE, 1);
					dateTmp = sdf.format(cal.getTime()).toString();
					if(  (dateTmp).equals(end)) {
						break;
					}
					dateList.add(dateTmp);
				}

			} catch (ParseException e) {
				e.printStackTrace();
			}
		}

		return dateList;
	}

	/**
	 * 유요한 날짜 타입의 문자열인지 확인
	 * @param date
	 * @param dateFormat
	 * @return
	 */
	public static boolean isValidDate(String date, String dateFormat) {
		SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
		boolean isDate = false;

		sdf.setLenient(false); //정확한 해석을 위해
		Calendar cal = Calendar.getInstance();
		try{
			cal.setTime(sdf.parse(date));
			isDate = true;
		} catch(ParseException e){
			// 날짜 변환 에러. 잘못된 날짜 데이타가 들어왔음.
		} catch(Exception e){
			e.printStackTrace();
		} finally {
			sdf = null;
			cal = null;
		}
		return isDate;
	}
}
