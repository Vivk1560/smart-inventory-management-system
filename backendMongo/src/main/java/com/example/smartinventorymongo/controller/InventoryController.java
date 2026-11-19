package com.example.smartinventorymongo.controller;

import com.example.entity.Inventory;
import com.example.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {
    @Autowired
    private InventoryService service;

    // Create a new inventory entry (triggers near expiry/expired alerts)
    @PostMapping
    public ResponseEntity<Inventory> create(@Valid @RequestBody Inventory inventory) {
        Inventory saved = service.create(inventory);
        return ResponseEntity.ok(saved);
    }

    // Get inventory by ID
    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getById(@PathVariable String id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get all inventory entries
    @GetMapping
    public ResponseEntity<List<Inventory>> getAll() {
        List<Inventory> inventory = service.getAll();
        return ResponseEntity.ok(inventory);
    }

    // Get inventory by product ID
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Inventory>> getByProductId(@PathVariable String productId) {
        List<Inventory> inventory = service.getByProductId(productId);
        return ResponseEntity.ok(inventory);
    }

    // Update inventory by ID (triggers out-of-stock alert if quantity == 0)
    @PutMapping("/{id}")
    public ResponseEntity<Inventory> update(@PathVariable String id, @Valid @RequestBody Inventory inventory) {
        Inventory updated = service.update(id, inventory);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete inventory by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.getById(id).isPresent()) {
            service.delete(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}