package com.example.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Document(collection = "alerts")
public class Alert {
	@Id
	private String id;
	@Field("productId")
	private String productId;
	@Field("inventoryId")
	private String inventoryId;
	@Field("alertType")
	private String alertType;
	@Field("alertMessage")
	private String alertMessage;
	@Field("alertDate")
	private LocalDateTime alertDate = LocalDateTime.now();
	private Boolean resolved = false;

	
	public Alert() {
	}
	

	public Alert(String id, String productId, String inventoryId, String alertType, String alertMessage,
			LocalDateTime alertDate, Boolean resolved) {
		super();
		this.id = id;
		this.productId = productId;
		this.inventoryId = inventoryId;
		this.alertType = alertType;
		this.alertMessage = alertMessage;
		this.alertDate = alertDate;
		this.resolved = resolved;
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

	public String getInventoryId() {
		return inventoryId;
	}

	public void setInventoryId(String inventoryId) {
		this.inventoryId = inventoryId;
	}

	public String getAlertType() {
		return alertType;
	}

	public void setAlertType(String alertType) {
		this.alertType = alertType;
	}

	public String getAlertMessage() {
		return alertMessage;
	}

	public void setAlertMessage(String alertMessage) {
		this.alertMessage = alertMessage;
	}

	public LocalDateTime getAlertDate() {
		return alertDate;
	}

	public void setAlertDate(LocalDateTime alertDate) {
		this.alertDate = alertDate;
	}

	public Boolean getResolved() {
		return resolved;
	}

	public void setResolved(Boolean resolved) {
		this.resolved = resolved;
	}

}
