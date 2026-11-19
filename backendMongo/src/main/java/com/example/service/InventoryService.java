package com.example.service;

import com.example.entity.Alert;
import com.example.entity.Inventory;
import com.example.repository.AlertRepository;
import com.example.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository repository;

    @Autowired
    private AlertRepository alertRepository;

    public Inventory create(Inventory inventory) {
        Inventory saved = repository.save(inventory);
        checkAndCreateAlerts(saved);
        return saved;
    }

    public Optional<Inventory> getById(String id) {
        return repository.findById(id);
    }

    public List<Inventory> getAll() {
        return repository.findAll();
    }

    public List<Inventory> getByProductId(String productId) {
        return repository.findByProductId(productId);
    }

    public Inventory update(String id, Inventory inventory) {

        Optional<Inventory> oldOpt = repository.findById(id);

        if (oldOpt.isPresent()) {

            Inventory old = oldOpt.get();

            inventory.setId(id);

            Inventory saved = repository.save(inventory);

            // Check whether stock has become zero
            checkOutOfStockAlert(old, saved);

            // Check expiry conditions after updating inventory
            checkAndCreateAlerts(saved);

            return saved;
        }

        return null;
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    // Near Expiry and Expired alert generation
    private void checkAndCreateAlerts(Inventory inv) {

        LocalDate today = LocalDate.now();

        long daysToExpiry = ChronoUnit.DAYS.between(
                today,
                inv.getExpiryDate()
        );

        if (daysToExpiry <= 7 && daysToExpiry >= 0) {

            Alert alert = new Alert();

            alert.setProductId(inv.getProductId());
            alert.setInventoryId(inv.getId());
            alert.setAlertType("Near Expiry");

            alert.setAlertMessage(
                    "Batch " + inv.getBatchNo()
                    + " of product ID " + inv.getProductId()
                    + " will expire in less than 7 days."
            );

            alertRepository.save(alert);
        }

        if (inv.getExpiryDate().isBefore(today)) {

            Alert expiredAlert = new Alert();

            expiredAlert.setProductId(inv.getProductId());
            expiredAlert.setInventoryId(inv.getId());
            expiredAlert.setAlertType("Expired");

            expiredAlert.setAlertMessage(
                    "Batch " + inv.getBatchNo()
                    + " of product ID " + inv.getProductId()
                    + " is already expired."
            );

            alertRepository.save(expiredAlert);

            Alert adjustAlert = new Alert();

            adjustAlert.setProductId(inv.getProductId());
            adjustAlert.setInventoryId(inv.getId());
            adjustAlert.setAlertType("Stock Adjustment");

            adjustAlert.setAlertMessage(
                    "Expired batch " + inv.getBatchNo()
                    + " must be removed manually."
            );

            alertRepository.save(adjustAlert);
        }
    }

    // Out of Stock alert generation
    private void checkOutOfStockAlert(Inventory old, Inventory newInv) {

        if (newInv.getQuantity() == 0 && old.getQuantity() > 0) {

            Alert alert = new Alert();

            alert.setProductId(newInv.getProductId());
            alert.setInventoryId(newInv.getId());
            alert.setAlertType("Out of Stock");

            alert.setAlertMessage(
                    "Batch " + newInv.getBatchNo()
                    + " of product ID " + newInv.getProductId()
                    + " is now out of stock."
            );

            alertRepository.save(alert);
        }
    }
}
