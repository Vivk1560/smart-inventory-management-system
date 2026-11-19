package com.example.service;

import com.example.entity.Product;
import com.example.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository repository;

    public Product create(Product product) {
        return repository.save(product);
    }

    public Optional<Product> getById(String id) {
        return repository.findById(id);
    }

    public List<Product> getAll() {
        return repository.findAll();
    }

    public Product update(String id, Product product) {
        product.setId(id);
        return repository.save(product);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}