import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.SecureRandom;

import org.apache.commons.lang.RandomStringUtils;

import com.sun.mail.util.BASE64EncoderStream;


public class TestRandom {

	public static void main(String [] args) {
		try {
			System.out.println(RandomStringUtils.randomAlphanumeric(10));

			String str = "0000000001";

			MessageDigest md5 = MessageDigest.getInstance("MD5");
		    md5.update(str.getBytes());
		    byte[] md5encrypt = md5.digest();
		    System.out.println(new String(BASE64EncoderStream.encode(md5encrypt)));

		    System.out.println(nextSessionId());

		} catch(Exception e) {
			e.printStackTrace();
		}
	}

	public static String nextSessionId() {
		SecureRandom random = new SecureRandom();
		return new BigInteger(130, random).toString(32);
	}
}