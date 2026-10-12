package com.example.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/** Checkout rules an administrator can change. There is only ever one row. */
@Entity
@Table(name = "store_settings")
@Data
@NoArgsConstructor
public class StoreSettings {
    public static final long SINGLETON_ID = 1L;

    @Id
    private Long id = SINGLETON_ID;

    /** Delivery charge added to a bag that does not qualify for free delivery. */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal shippingFee;

    /** Bags whose subtotal is above this are delivered free. */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal freeShippingThreshold;

    /** Largest order total that may be paid cash on delivery. Zero turns it off. */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal codLimit;

    public StoreSettings(BigDecimal shippingFee, BigDecimal freeShippingThreshold, BigDecimal codLimit) {
        this.shippingFee = shippingFee;
        this.freeShippingThreshold = freeShippingThreshold;
        this.codLimit = codLimit;
    }
}
