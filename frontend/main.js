
// Common UI functionality

function showToast(message, isError = false) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `toast ${isError ? "error" : ""}`;
    toast.style.display = "block";

    clearTimeout(toast._timeout);

    toast._timeout = setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

function highlightNav(activePage) {
    document.querySelectorAll(".navbar a").forEach(link => {
        const href = link.getAttribute("href") || "";

        link.classList.toggle(
            "active",
            href.toLowerCase().includes(activePage.toLowerCase())
        );
    });
}

async function requestNotificationPermission() {
    if (!("Notification" in window)) return false;

    if (Notification.permission === "granted") return true;

    if (Notification.permission === "denied") return false;

    return (await Notification.requestPermission()) === "granted";
}

function sendBrowserNotification(title, message, tag = "") {
    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {
        new Notification(title, {
            body: message,
            tag: tag || undefined
        });
    }
}

// Dashboard statistics
async function loadDashboardStats() {
    if (!document.getElementById("productCount")) return;

    try {
        const [products, inventory, alerts] = await Promise.all([
            getProducts(),
            getInventory(),
            getUnresolvedAlerts()
        ]);

        document.getElementById("productCount").textContent =
            products.length;

        document.getElementById("inventoryCount").textContent =
            inventory.length;

        document.getElementById("alertCount").textContent =
            alerts.length;

    } catch (error) {
        console.error("Dashboard loading error:", error);
        showToast(error.message, true);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadDashboardStats();
});
