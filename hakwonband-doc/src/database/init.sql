
-- 관리자
--	pass 1111
insert into tb_user (user_type, user_id, user_email, user_password, approved_yn, use_yn, reg_date)
values('001', 'AdminUser', 'bumworld@gmail.com', '0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c', 'Y', 'Y', now());

insert into tb_user_info (user_no, user_id, user_name, approved_date, approved_user_no, photo_file_no, tel1_no, tel2_no, user_url, last_login_date, last_login_ip, agree01, agree02)
values(1, 'AdminUser', '관리자', now(), 1, 0, '', '', '', now(), '127.0.0.1', 'Y', 'Y');
--------------------------------------------------------------------------------------------------

-- 학원장
--	pass 1111
insert into tb_user (user_type, user_id, user_email, user_password, approved_yn, use_yn, reg_date)
values('003', 'wonjang', 'wonjang@gmail.com', '0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c', 'Y', 'Y', now());

insert into tb_user_info (user_no, user_id, user_name, approved_date, approved_user_no, photo_file_no, tel1_no, tel2_no, user_url, last_login_date, last_login_ip, agree01, agree02)
values(2, 'wonjang', '원장님', now(), 1, 0, '', '', '', now(), '127.0.0.1', 'Y', 'Y');
--------------------------------------------------------------------------------------------------


insert into tb_hakwon (master_user_no, hakwon_code, reg_date) values(2, 'zRVvAP22J7', now());
insert into tb_hakwon_info (hakwon_no, hakwon_name, tel_no_1, tel_no_2, introduction, udp_date)
values(1, '수학제일', 0, 0, '학원 소개 입니다. 수학 제일 학원', now());

insert into tb_hakwon (master_user_no, hakwon_code, reg_date) values(2, 'zRVvAP22J8', now());
insert into tb_hakwon_info (hakwon_no, hakwon_name, tel_no_1, tel_no_2, introduction, udp_date)
values(2, '영어제일', 0, 0, '학원 소개 입니다. 영어 제일 학원', now());


-- 광고 기본 가격
insert into tb_config(config_key, config_val, reg_user_no, reg_date) value ('advertise_default_price', '{"1":"5000", "2":"9000", "3":"13000", "4":"17000"}', 1, now());

--	입금 계좌번호
insert into tb_config(config_key, config_val, reg_user_no, reg_date) value ('advertise_bank_info', '국민은행 123456-01-3456789 학원밴드', 1, now());

-- 광고 기간 가격
insert into tb_advertise_price ( start_year_month, end_year_month, banner_size, price, reg_user_no, reg_date) values('201412', '201501', 1, 1800, 1, now());


delete from tb_code where code_group = '000';

insert into tb_code (code_group, code, code_name, code_group_name) values ( '001', '000', '회원 타입', '회원 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '001', '001', '관리자', '회원 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '001', '002', '매니저', '회원 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '001', '003', '원장님', '회원 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '001', '004', '선생님', '회원 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '001', '005', '학부모', '회원 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '001', '006', '학생', '회원 타입');

insert into tb_code (code_group, code, code_name, code_group_name) values ( '003', '000', '공지 타입', '공지 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '003', '001', '시스템 공지', '공지 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '003', '002', '학원 공지', '공지 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '003', '003', '클래스 공지', '공지 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '003', '004', '관리자에게 문의하기', '공지 타입');

insert into tb_code (code_group, code, code_name, code_group_name) values ( '004', '000', '학원 멤버 타입', '학원 멤버 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '004', '001', '학생', '학원 멤버 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '004', '002', '학부모', '학원 멤버 타입');


insert into tb_code (code_group, code, code_name, code_group_name) values ( '005', '000', '공지 상태', '공지 상태');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '005', '001', '정상', '공지 상태');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '005', '002', '삭제', '공지 상태');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '005', '003', '숨김', '공지 상태');


insert into tb_code (code_group, code, code_name, code_group_name) values ( '006', '000', '노티 서비스 타입', '노티 서비스 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '006', '001', 'ios', '노티 서비스 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '006', '002', 'android', '노티 서비스 타입');


insert into tb_code (code_group, code, code_name, code_group_name) values ( '007', '000', '컨텐츠 타입', '컨텐츠 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '007', '001', '공지', '컨텐츠 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '007', '002', '메시지', '컨텐츠 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '007', '003', '이벤트', '컨텐츠 타입');

insert into tb_code (code_group, code, code_name, code_group_name) values ( '008', '000', '학교 구분 레벨', '학교 구분 레벨');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '008', '001', '초등학교', '학교 구분 레벨');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '008', '002', '중학교', '학교 구분 레벨');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '008', '003', '고등학교', '학교 구분 레벨');

insert into tb_code (code_group, code, code_name, code_group_name) values ( '009', '000', '파일 타입', '파일 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '009', '001', '공지', '파일 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '009', '002', '메시지', '파일 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '009', '003', '이벤트', '파일 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '009', '004', '프로필', '파일 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '009', '005', '학원소개', '파일 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '009', '006', '광고 베너', '파일 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '009', '007', '학원 로고', '파일 타입');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '009', '008', '클래스 로고', '파일 타입');

insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '000', '은행 코드', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '020', '우리', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '039', '경남', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '045', '새마을금고', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '081', '하나', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '034', '광주', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '007', '수협', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '023', 'SC제일', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '004', '국민', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '088', '신한', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '055', '도이치', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '003', '기업', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '048', '신협', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '059', '미쓰비시', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '011', '농협', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '027', '씨티', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '058', '미즈호', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '031', '대구', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '005', '외환', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '060', '아메리카', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '032', '부산', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '071', '우체국', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '056', 'ABN암로', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '002', '산업', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '037', '전북', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '054', 'HSBC', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '050', '상호저축', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '035', '제주', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '057', 'JP모간', '은행 코드');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '010', '999', '기타', '은행 코드');

insert into tb_code (code_group, code, code_name, code_group_name) values ( '011', '000', '이벤트 상태', '이벤트 상태');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '011', '001', '정상', '이벤트 상태');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '011', '002', '중지', '이벤트 상태');

delete from tb_code where code_group = '012';
insert into tb_code (code_group, code, code_name, code_group_name) values ( '012', '000', '학원 상태', '학원 상태');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '012', '001', '인증', '학원상태');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '012', '002', '미인증', '학원상태');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '012', '003', '원장님&선생님 접근 금지', '학원상태');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '012', '004', '원장님 탈퇴', '학원상태');

insert into tb_code (code_group, code, code_name, code_group_name) values ( '013', '000', '입출금 카테고리', '입출금 카테고리');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '013', '001', '입금', '입출금 카테고리');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '013', '002', '출금', '입출금 카테고리');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '013', '003', '수강료입금', '입출금 카테고리');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '013', '004', '교재비입금', '입출금 카테고리');


insert into tb_code (code_group, code, code_name, code_group_name) values ( '014', '000', '결제 방법', '결제 방법');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '014', '001', '카드', '결제 방법');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '014', '002', '현금', '결제 방법');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '014', '003', '계좌이체', '결제 방법');
insert into tb_code (code_group, code, code_name, code_group_name) values ( '014', '004', '기타', '결제 방법');



insert into tb_hakwon_cate (cate_code, cate_name, cate_order) values ( '001', '영어', 0);
insert into tb_hakwon_cate (cate_code, cate_name, cate_order) values ( '002', '수학', 1);
insert into tb_hakwon_cate (cate_code, cate_name, cate_order) values ( '003', '국사', 2);
insert into tb_hakwon_cate (cate_code, cate_name, cate_order) values ( '004', '미술', 3);
insert into tb_hakwon_cate (cate_code, cate_name, cate_order) values ( '005', '체육', 4);


-- 공지사항
insert into tb_notice (notice_type, notice_parent_no, title, preview_content, content, content_status, reply_yn, reg_user_no, reg_date) values ('003', '1', '테스트 공지1', '테스트입니다....', '테스트입니다. 공지 공지 오바 오바 오바', '005', 'Y', '1', '');
insert into tb_notice (notice_type, notice_parent_no, title, preview_content, content, content_status, reply_yn, reg_user_no, reg_date) values ('003', '2', '테스트 공지2', '테스트입니다....', '테스트입니다. 2번 공지 음 음 음 음 음', '005', 'Y', '2', '');
