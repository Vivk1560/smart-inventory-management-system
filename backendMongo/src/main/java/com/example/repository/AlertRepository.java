package com.example.repository;

import com.example.entity.Alert;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AlertRepository extends MongoRepository<Alert, String> {
    List<Alert> findByProductId(String productId);
    List<Alert> findByResolved(Boolean resolved);
}