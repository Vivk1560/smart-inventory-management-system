
/*
 * Smart Inventory Management System
 * Inventory Management
 */

const inventoryForm = document.getElementById("inventoryForm");


// ---------------- PRODUCT DROPDOWN ----------------

async function loadProductsForSelect() {

    try {
        const products = await getProducts();

        const select = document.getElementById("productIdSelect");

        if (!select) return;

        select.innerHTML =
            '<option value="">Select Product</option>';

        products.forEach(product => {

            const option = document.createElement("option");

            option.value = product.id;

            option.textContent =
                `${product.productName} (${product.category || "Uncategorized"})`;

            select.appendChild(option);

        });

    } catch (error) {
        showToast(error.message, true);
    }
}


// ---------------- LOAD INVENTORY ----------------

async function loadInventory() {

    try {
        const inventory = await getInventory();

        renderInventoryTable(inventory);

    } catch (error) {
        showToast(error.message, true);
    }
}


// ---------------- RENDER INVENTORY ----------------

function renderInventoryTable(inventory) {

    const tbody = document.querySelector("#inventoryTable tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    inventory.forEach(item => {

        const row = tbody.insertRow();

        row.innerHTML = `
            <td>${escapeHtml(item.id)}</td>
            <td>${escapeHtml(item.productId)}</td>
            <td>${escapeHtml(item.batchNo)}</td>
            <td>${escapeHtml(item.manufactureDate)}</td>
            <td>${escapeHtml(item.expiryDate)}</td>
            <td>${escapeHtml(item.quantity)}</td>
            <td>${escapeHtml(item.warehouseLocation)}</td>
            <td>${escapeHtml(
                item.lastUpdated
                    ? new Date(item.lastUpdated).toLocaleDateString()
                    : "N/A"
            )}</td>
            <td>
                <button
                    class="edit"
                    onclick="editInventory('${escapeHtml(item.id)}')">
                    Edit
                </button>

                <button
                    class="delete"
                    onclick="deleteInventory('${escapeHtml(item.id)}')">
                    Delete
                </button>
            </td>
        `;

    });
}


// ---------------- CREATE / UPDATE INVENTORY ----------------

if (inventoryForm) {

    inventoryForm.addEventListener("submit", async event => {

        event.preventDefault();

        const id = document.getElementById("inventoryId").value;

        const productIdValue =
            document.getElementById("productIdSelect").value;

        if (!productIdValue) {
            showToast("Please select a product.", true);
            return;
        }

        const data = {

            productId: DATABASE_MODE === "sql"
                ? Number(productIdValue)
                : productIdValue,

            batchNo:
                document.getElementById("batchNo").value.trim(),

            manufactureDate:
                document.getElementById("manufactureDate").value,

            expiryDate:
                document.getElementById("expiryDate").value,

            quantity: Number(
                document.getElementById("quantity").value
            ),

            warehouseLocation:
                document.getElementById("warehouseLocation").value.trim()

        };

        try {

            // Capture existing alerts before MongoDB operation.
            const previousAlerts =
                DATABASE_MODE === "mongo"
                    ? await getUnresolvedAlerts()
                    : [];

            if (id) {

                await updateInventory(id, data);

                showToast("Inventory updated successfully!");

            } else {

                await createInventory(data);

                showToast("Inventory added successfully!");

            }

            clearInventoryForm();

            await loadInventory();

            // MongoDB automatically generates applicable alerts.
            if (DATABASE_MODE === "mongo") {
                await checkForNewAlerts(previousAlerts);
            }

        } catch (error) {

            showToast(error.message, true);

        }

    });

}


// ---------------- CHECK NEW ALERTS ----------------

async function checkForNewAlerts(previousAlerts) {

    try {

        const currentAlerts = await getUnresolvedAlerts();

        const previousIds = new Set(
            previousAlerts.map(alert => alert.id)
        );

        const newAlerts = currentAlerts.filter(
            alert => !previousIds.has(alert.id)
        );

        newAlerts.forEach(alert => {

            showToast(`New alert: ${alert.alertType}`);

            sendBrowserNotification(
                "Smart Inventory Alert",
                `${alert.alertType}: ${alert.alertMessage}`,
                alert.id
            );

        });

    } catch (error) {

        console.warn(
            "Could not check newly generated alerts:",
            error
        );

    }
}


// ---------------- EDIT INVENTORY ----------------

async function editInventory(id) {

    try {

        const item = await getInventoryItem(id);

        document.getElementById("inventoryId").value =
            item.id;

        document.getElementById("productIdSelect").value =
            item.productId;

        document.getElementById("batchNo").value =
            item.batchNo || "";

        document.getElementById("manufactureDate").value =
            item.manufactureDate || "";

        document.getElementById("expiryDate").value =
            item.expiryDate || "";

        document.getElementById("quantity").value =
            item.quantity ?? "";

        document.getElementById("warehouseLocation").value =
            item.warehouseLocation || "";

    } catch (error) {

        showToast(error.message, true);

    }
}


// ---------------- DELETE INVENTORY ----------------

async function deleteInventory(id) {

    if (!confirm("Delete this inventory record?")) {
        return;
    }

    try {

        // Call the API adapter, not this UI function.
        await deleteInventoryRequest(id);

        showToast("Inventory deleted successfully!");

        await loadInventory();

    } catch (error) {

        showToast(error.message, true);

    }
}


// ---------------- CLEAR FORM ----------------

function clearInventoryForm() {

    inventoryForm?.reset();

    const idField = document.getElementById("inventoryId");

    if (idField) {
        idField.value = "";
    }

}


// ---------------- INITIALIZATION ----------------

document.addEventListener("DOMContentLoaded", async () => {

    await loadProductsForSelect();

    await loadInventory();

});
