import java.text.SimpleDateFormat;
import java.util.Calendar;


public class MonthTest {

	public static void main(String[] args) {
		try {
			String dt = "200801";  // Start date
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");
			Calendar c = Calendar.getInstance();
			c.setTime(sdf.parse(dt));
			c.add(Calendar.MONTH, 2);  // number of days to add
			dt = sdf.format(c.getTime());  // dt is now the new date
			System.out.println(dt);
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
}