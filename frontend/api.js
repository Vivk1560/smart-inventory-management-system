
/*
 * Smart Inventory Management System
 * Shared API adapter for MySQL and MongoDB backends.
 *
 * Run only one backend at a time.
 */

// Change to "sql" when using MySQL backend.
const DATABASE_MODE = "sql";

const API_BASE = "http://127.0.0.1:8082/api";

// Database-specific API routes
const API_CONFIG = {
    mongo: {
        inventory: "/inventory",
        unresolvedAlerts: "/alerts/unresolved"
    },

    sql: {
        inventory: "/inventories",
        unresolvedAlerts: "/alerts"
    }
};


// ---------------- COMMON UTILITIES ----------------

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}


async function apiRequest(path, options = {}) {
    let response;

    try {
        response = await fetch(`${API_BASE}${path}`, {
            ...options,

            headers: {
                ...(options.body ? {
                    "Content-Type": "application/json"
                } : {}),

                ...options.headers
            }
        });

    } catch (error) {
        throw new Error(
            "Cannot connect to backend. Check that the selected backend is running."
        );
    }

    const responseText = await response.text();

    let data = null;

    if (responseText) {
        try {
            data = JSON.parse(responseText);
        } catch {
            data = responseText;
        }
    }

    if (!response.ok) {
        const message =
            data?.message ||
            data?.error ||
            (typeof data === "string" ? data : null) ||
            `Request failed with status ${response.status}`;

        throw new Error(message);
    }

    return data;
}


// ---------------- DATA NORMALIZATION ----------------

function normalizeProduct(product) {
    return {
        ...product,

        id: String(
            product.id ??
            product.product_id ??
            product.productId ??
            ""
        )
    };
}


function normalizeInventory(item) {
    return {
        ...item,

        id: String(
            item.id ??
            item.inventoryId ??
            ""
        ),

        productId: String(item.productId ?? "")
    };
}


function normalizeAlert(alert) {
    return {
        ...alert,

        id: String(
            alert.id ??
            alert.alertId ??
            ""
        ),

        inventoryId: String(alert.inventoryId ?? ""),
        productId: String(alert.productId ?? "")
    };
}


// ---------------- PRODUCTS ----------------

async function getProducts() {
    const data = await apiRequest("/products");

    return data.map(normalizeProduct);
}


async function getProduct(id) {
    const data = await apiRequest(
        `/products/${encodeURIComponent(id)}`
    );

    return normalizeProduct(data);
}


async function createProduct(product) {
    const data = await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify(product)
    });

    return normalizeProduct(data);
}


async function updateProduct(id, product) {
    let payload = { ...product };

    // Preserve the existing SQL brand field.
    if (DATABASE_MODE === "sql") {
        const existing = await getProduct(id);

        payload.brand = existing.brand ?? null;
    }

    const data = await apiRequest(
        `/products/${encodeURIComponent(id)}`,
        {
            method: "PUT",
            body: JSON.stringify(payload)
        }
    );

    return normalizeProduct(data);
}


async function deleteProductRequest(id) {
    return apiRequest(
        `/products/${encodeURIComponent(id)}`,
        { method: "DELETE" }
    );
}


// ---------------- INVENTORY ----------------

function getInventoryPath() {
    return API_CONFIG[DATABASE_MODE].inventory;
}


async function getInventory() {
    const data = await apiRequest(getInventoryPath());

    return data.map(normalizeInventory);
}


async function getInventoryItem(id) {
    const data = await apiRequest(
        `${getInventoryPath()}/${encodeURIComponent(id)}`
    );

    return normalizeInventory(data);
}


async function createInventory(item) {
    const data = await apiRequest(getInventoryPath(), {
        method: "POST",
        body: JSON.stringify(item)
    });

    return normalizeInventory(data);
}


async function updateInventory(id, item) {
    const data = await apiRequest(
        `${getInventoryPath()}/${encodeURIComponent(id)}`,
        {
            method: "PUT",
            body: JSON.stringify(item)
        }
    );

    return normalizeInventory(data);
}


async function deleteInventoryRequest(id) {
    return apiRequest(
        `${getInventoryPath()}/${encodeURIComponent(id)}`,
        { method: "DELETE" }
    );
}


// ---------------- ALERTS ----------------

async function getUnresolvedAlerts() {
    const path = API_CONFIG[DATABASE_MODE].unresolvedAlerts;

    const data = await apiRequest(path);

    const alerts = data.map(normalizeAlert);

    // SQL returns all alerts, so filter resolved ones.
    return DATABASE_MODE === "sql"
        ? alerts.filter(alert => alert.resolved !== true)
        : alerts;
}


// Resolve Alert
async function resolveAlertRequest(id) {

    // MongoDB has a dedicated resolve endpoint.
    if (DATABASE_MODE === "mongo") {
        return apiRequest(
            `/alerts/${encodeURIComponent(id)}/resolve`,
            { method: "PUT" }
        );
    }

    // SQL uses PUT /alerts/{id}.
    // Preserve the existing alert fields while marking it resolved.

    const alert = await apiRequest(
        `/alerts/${encodeURIComponent(id)}`
    );

    return apiRequest(
        `/alerts/${encodeURIComponent(id)}`,
        {
            method: "PUT",

            body: JSON.stringify({
                alertType: alert.alertType,
                alertMessage: alert.alertMessage,
                resolved: true
            })
        }
    );
}


// ---------------- INITIALIZATION ----------------

console.info(
    `Smart Inventory API initialized in ${DATABASE_MODE.toUpperCase()} mode`
);
