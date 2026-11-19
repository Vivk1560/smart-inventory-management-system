package com.example.smartinventorymongo.controller;


import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.entity.Product;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    @Autowired
    private com.example.service.ProductService service;

    // Create a new product
    @PostMapping
    public ResponseEntity<com.example.entity.Product> create(@Valid @RequestBody Product product) {
        com.example.entity.Product saved = service.create(product);
        return ResponseEntity.ok(saved);
    }

    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<com.example.entity.Product> getById(@PathVariable String id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get all products
    @GetMapping
    public ResponseEntity<List<com.example.entity.Product>> getAll() {
        List<com.example.entity.Product> products = service.getAll();
        return ResponseEntity.ok(products);
    }

    // Update product by ID
    @PutMapping("/{id}")
    public ResponseEntity<com.example.entity.Product> update(@PathVariable String id, @Valid @RequestBody Product product) {
        com.example.entity.Product updated = service.update(id, product);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete product by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.getById(id).isPresent()) {
            service.delete(id);
            return ResponseEntity.noContent().build();  // 204 No Content
        }
        return ResponseEntity.notFound().build();
    }
}