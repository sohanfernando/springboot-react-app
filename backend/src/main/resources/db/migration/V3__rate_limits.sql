-- Counters for login and signup throttling. limit_key is a SHA-256 hash.
-- "if not exists" for the same reason as V2.
create table if not exists rate_limits (
    limit_key varchar(64) not null,
    hits integer not null,
    expires_at datetime(6) not null,
    primary key (limit_key),
    key idx_rate_limits_expires_at (expires_at)
) engine=InnoDB;
