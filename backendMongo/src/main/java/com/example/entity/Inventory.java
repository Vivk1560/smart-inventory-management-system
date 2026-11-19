package com.example.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.Min;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "inventory")
public class Inventory {
    @Id
    private String id;
    @Field("productId")
    private String productId;  // References Product.id
    @Field("batchNo")
    private String batchNo;
    @Field("manufactureDate")
    private LocalDate manufactureDate;
    private LocalDate expiryDate;
    @jakarta.validation.constraints.Min(0)
    private Integer quantity;
    @Field("warehouseLocation")
    private String warehouseLocation;
    @Field("lastUpdated")
    private LocalDateTime lastUpdated = LocalDateTime.now();

    
    public Inventory() {}
   

	public Inventory(String id, String productId, String batchNo, LocalDate manufactureDate, LocalDate expiryDate,
			@Min(0) Integer quantity, String warehouseLocation, LocalDateTime lastUpdated) {
		super();
		this.id = id;
		this.productId = productId;
		this.batchNo = batchNo;
		this.manufactureDate = manufactureDate;
		this.expiryDate = expiryDate;
		this.quantity = quantity;
		this.warehouseLocation = warehouseLocation;
		this.lastUpdated = lastUpdated;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getProductId() {
		return productId;
	}

	public void setProductId(String productId) {
		this.productId = productId;
	}

	public String getBatchNo() {
		return batchNo;
	}

	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}

	public LocalDate getManufactureDate() {
		return manufactureDate;
	}

	public void setManufactureDate(LocalDate manufactureDate) {
		this.manufactureDate = manufactureDate;
	}

	public LocalDate getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(LocalDate expiryDate) {
		this.expiryDate = expiryDate;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public String getWarehouseLocation() {
		return warehouseLocation;
	}

	public void setWarehouseLocation(String warehouseLocation) {
		this.warehouseLocation = warehouseLocation;
	}

	public LocalDateTime getLastUpdated() {
		return lastUpdated;
	}

	public void setLastUpdated(LocalDateTime lastUpdated) {
		this.lastUpdated = lastUpdated;
	}
    
}