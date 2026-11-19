package com.example.smartinventorymongo.controller;

import com.example.entity.Alert;
import com.example.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {
    @Autowired
    private AlertService service;

    // Get all alerts
    @GetMapping
    public ResponseEntity<List<Alert>> getAll() {
        List<Alert> alerts = service.getAll();
        return ResponseEntity.ok(alerts);
    }

    // Get unresolved alerts (for display)
    @GetMapping("/unresolved")
    public ResponseEntity<List<Alert>> getUnresolved() {
        List<Alert> alerts = service.getUnresolved();
        return ResponseEntity.ok(alerts);
    }

    // Get alerts by product ID
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Alert>> getByProductId(@PathVariable String productId) {
        List<Alert> alerts = service.getByProductId(productId);
        return ResponseEntity.ok(alerts);
    }

    // Resolve an alert (mark as resolved)
    @PutMapping("/{id}/resolve")
    public ResponseEntity<Alert> resolve(@PathVariable String id) {
        Alert resolved = service.resolve(id);
        if (resolved != null) {
            return ResponseEntity.ok(resolved);
        }
        return ResponseEntity.notFound().build();
    }
}