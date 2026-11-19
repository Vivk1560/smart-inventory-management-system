package com.example.service;

import com.example.entity.Alert;
import com.example.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlertService {
    @Autowired
    private AlertRepository repository;

    // Get all alerts
    public List<Alert> getAll() {
        return repository.findAll();
    }

    // Get unresolved alerts (for display)
    public List<Alert> getUnresolved() {
        return repository.findByResolved(false);
    }

    // Get alerts by product ID
    public List<Alert> getByProductId(String productId) {
        return repository.findByProductId(productId);
    }

    // Resolve an alert (mark as resolved=true and save)
    public Alert resolve(String id) {
        Optional<Alert> opt = repository.findById(id);
        if (opt.isPresent()) {
            Alert alert = opt.get();
            alert.setResolved(true);
            return repository.save(alert);
        }
        return null;  
    }
}