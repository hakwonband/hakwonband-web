import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class JavaMail {

	private static final String SMTP_HOST_NAME = "smtp.works.naver.com";
	private static final String SMTP_PORT = "465";

	private static final String emailMsgTxt = "Windows 2003 SMTP 서버를 사용한 JavaMail 테스트";
	private static final String emailSubjectTxt = "JavaMail SMTP 테스트";
	private static final String emailFromAddress = "mail@bcome.co.kr";
	private static final String[] sendTo = { "bumworld@paran.com" };

	public static void main(String args[]) throws Exception {

		new JavaMail().sendMessage(sendTo, emailSubjectTxt, emailMsgTxt, emailFromAddress);
		System.out.println("Sucessfully Sent mail to All Users");
	}

	public void sendMessage(String recipients[], String subject, String message, String from) throws MessagingException {

		Properties props = new Properties();
		props.put("mail.smtp.host", SMTP_HOST_NAME);
		props.put("mail.smtp.port", SMTP_PORT);
		props.put("mail.smtp.auth", "true");

		MyAuthenticator auth = new MyAuthenticator("mail@bcome.co.kr", "dudqja12#$");

		Session session = Session.getDefaultInstance(props, auth);

		Message msg = new MimeMessage(session);
		InternetAddress addressFrom = new InternetAddress(from);
		msg.setFrom(addressFrom);

		InternetAddress[] addressTo = new InternetAddress[recipients.length];
		for (int i = 0; i < recipients.length; i++) {
			addressTo[i] = new InternetAddress(recipients[i]);
		}
		msg.setRecipients(Message.RecipientType.TO, addressTo);

		// Setting the Subject and Content Type
		msg.setSubject(subject);
		msg.setContent(message, "text/plain;charset=UTF-8");
		Transport.send(msg);
	}
}

class MyAuthenticator extends javax.mail.Authenticator {

    private String id;
    private String pw;

    public MyAuthenticator(String id, String pw) {
        this.id = id;
        this.pw = pw;
    }

    protected javax.mail.PasswordAuthentication getPasswordAuthentication() {
        return new javax.mail.PasswordAuthentication(id, pw);
    }

}
