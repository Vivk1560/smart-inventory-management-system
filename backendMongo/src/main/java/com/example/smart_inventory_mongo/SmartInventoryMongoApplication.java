package com.example.smart_inventory_mongo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = {"com.example", "com.example.smartinventorymongo"})
@EnableMongoRepositories(basePackages = {"com.example.repository"}) 
public class SmartInventoryMongoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartInventoryMongoApplication.class, args);
    }
}
