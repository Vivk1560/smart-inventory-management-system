package com.example.entity;

import jakarta.validation.constraints.NotBlank; // For strings
import jakarta.validation.constraints.Min; // For numbers
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Document(collection = "products")
public class Product {
	@Id
	private String id;
	@Field("productName")
	@NotBlank(message = "Product name is required") // Enforces non-empty string
	private String productName;
	@Field("category")
	private String category; // Optional, no annotation needed
	@Field("shelfLifeDays")
	@Min(value = 0, message = "Shelf life must be >= 0") // If provided, >=0
	private Integer shelfLifeDays;
	@Field("createdAt")
	@NotNull
	private LocalDateTime createdAt = LocalDateTime.now();
	
	public Product() {
		super();
	}

	public Product(String id, @NotBlank(message = "Product name is required") String productName, String category,
			@Min(value = 0, message = "Shelf life must be >= 0") Integer shelfLifeDays,
			@NotNull LocalDateTime createdAt) {
		super();
		this.id = id;
		this.productName = productName;
		this.category = category;
		this.shelfLifeDays = shelfLifeDays;
		this.createdAt = createdAt;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public Integer getShelfLifeDays() {
		return shelfLifeDays;
	}

	public void setShelfLifeDays(Integer shelfLifeDays) {
		this.shelfLifeDays = shelfLifeDays;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
}
