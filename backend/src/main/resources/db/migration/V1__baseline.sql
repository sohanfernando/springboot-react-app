-- The schema as it stood when migrations were introduced.
--
-- A database that already has these tables (created earlier by Hibernate's
-- ddl-auto=update) is not touched by this file: Flyway marks it as applied
-- (spring.flyway.baseline-on-migrate) and continues from V2. On an empty
-- database this file runs and builds everything.

create table users (
    id bigint not null auto_increment,
    address varchar(255),
    city varchar(255),
    email varchar(255) not null,
    name varchar(255) not null,
    password varchar(255) not null,
    phone varchar(255),
    postal_code varchar(255),
    role varchar(255) not null,
    primary key (id),
    constraint uk_users_email unique (email)
) engine=InnoDB;

create table products (
    id bigint not null auto_increment,
    name varchar(255),
    description TEXT,
    price float(53),
    category varchar(255),
    subcategory varchar(255),
    created_at datetime(6),
    updated_at datetime(6),
    primary key (id)
) engine=InnoDB;

create table product_images (
    product_id bigint not null,
    images varchar(255),
    constraint fk_product_images_product foreign key (product_id) references products (id)
) engine=InnoDB;

create table product_colors (
    product_id bigint not null,
    colors varchar(255),
    constraint fk_product_colors_product foreign key (product_id) references products (id)
) engine=InnoDB;

create table product_sizes (
    product_id bigint not null,
    sizes varchar(255),
    constraint fk_product_sizes_product foreign key (product_id) references products (id)
) engine=InnoDB;

create table product_image_colors (
    product_id bigint not null,
    image_url varchar(255) not null,
    color_name varchar(255),
    primary key (product_id, image_url),
    constraint fk_product_image_colors_product foreign key (product_id) references products (id)
) engine=InnoDB;

create table carts (
    id bigint not null auto_increment,
    primary key (id)
) engine=InnoDB;

create table orders (
    id bigint not null auto_increment,
    user_id bigint,
    items longtext,
    total float(53),
    recipient_name varchar(255),
    address varchar(255),
    city varchar(255),
    postal_code varchar(255),
    status varchar(255),
    payment_id bigint,
    primary key (id)
) engine=InnoDB;

create table payments (
    id bigint not null auto_increment,
    user_id bigint,
    order_id bigint,
    recipient_name varchar(255),
    payment_method varchar(255),
    amount float(53),
    payment_status varchar(255),
    transaction_id varchar(255),
    stripe_payment_intent_id varchar(255),
    payment_date datetime(6),
    primary key (id)
) engine=InnoDB;

create table store_settings (
    id bigint not null,
    shipping_fee decimal(12,2) not null,
    free_shipping_threshold decimal(12,2) not null,
    cod_limit decimal(12,2) not null,
    primary key (id)
) engine=InnoDB;
