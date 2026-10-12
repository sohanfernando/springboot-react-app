package com.example.backend.repository;

import com.example.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByCategoryAndSubcategory(String category, String subcategory);

    /**
     * Takes units out of stock in a single statement, so two orders racing for
     * the last one cannot both succeed. Returns 1 if the stock was there and
     * has been taken, 0 if there was not enough.
     */
    @Modifying
    @Query("update Product p set p.stock = p.stock - :quantity "
            + "where p.id = :id and p.stock is not null and p.stock >= :quantity")
    int takeStock(@Param("id") Long id, @Param("quantity") int quantity);
}
