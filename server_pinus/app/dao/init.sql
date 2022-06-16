create table pinus_cc.account_info
(
    uid         int auto_increment,
    account     varchar(15) not null,
    password    varchar(15) not null,
    gender      int         null,
    avatar      text        null,
    nickname    varchar(20) null,
    register_at timestamp   null,
    login_at    datetime    null,
    constraint account_info_account_uindex
        unique (account),
    constraint account_info_uid_uindex
        unique (uid)
);