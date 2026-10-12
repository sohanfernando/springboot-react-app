-- Units left to sell. Null means stock is not tracked for that product, so
-- every product that existed before this keeps selling as it did.
--
-- Written to do nothing if the column is already there: a development database
-- that ran under ddl-auto=update after the field was added will have it.
set @stock_exists := (
    select count(*) from information_schema.columns
    where table_schema = database() and table_name = 'products' and column_name = 'stock'
);
set @ddl := if(@stock_exists = 0, 'alter table products add column stock integer', 'select 1');
prepare add_stock from @ddl;
execute add_stock;
deallocate prepare add_stock;
