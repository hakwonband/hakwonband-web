==========================================================
2015-10-03
==========================================================

alter table tb_message add reservation_yn			char(1)		not null	comment '예약 여부 YN' after receiver_count;
alter table tb_message add reservation_date			datetime				comment '예약 시간' after reservation_yn;
alter table tb_message add reservation_send_date	datetime				comment '예약 발송 시간' after reservation_yn;
