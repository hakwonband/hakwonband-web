import java.util.ArrayList;
import java.util.List;

import hakwonband.admin.test.push.TestIosSender;
import hakwonband.push.PushMessage;


public class TestIOS {

	public static void main(String[] args) {
		System.setProperty("server.type", "local");

		PushMessage pushMessage = new PushMessage();
		pushMessage.setTicker("학원밴드 입니다.");
		pushMessage.setTitle("테스트 메세지 입니다.");
		pushMessage.setContent("테스트 메세지 입니다.");
		pushMessage.setLink_url("https://m.hakwonband.com/");


		List<String> devicesList = new ArrayList<String>();
		devicesList.add("7cb6f543a601d1d8e396ff766e17af44f9e1659c3ccbeeaba7c8687b3a2a2260");
//		devicesList.add("5bbe665938882bc333dcd11434b8ecb63710cb7029915cc7c1d9efd76abe6e9d");

		TestIosSender.send(pushMessage, devicesList, "Y");
	}
}