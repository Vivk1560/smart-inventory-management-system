
/*
 * Smart Inventory Management System
 * Alert Management
 */

let pollInterval = null;

const POLLING_INTERVAL = 30000;

const ALERT_STORAGE_KEY =
    `smartInventoryPreviousAlerts_${DATABASE_MODE}`;


// ---------------- LOAD ALERTS ----------------

async function loadAlerts() {
    try {
        const alerts = await getUnresolvedAlerts();

        renderTable(alerts);

        updateAlertsVisibility(alerts.length);

        // Establish the initial baseline without notifying
        // the user about alerts that already existed.
        if (localStorage.getItem(ALERT_STORAGE_KEY) === null) {
            localStorage.setItem(
                ALERT_STORAGE_KEY,
                JSON.stringify(alerts)
            );
        }

        if (!pollInterval) {
            startPolling();
        }

    } catch (error) {
        showToast(
            "Error loading alerts: " + error.message,
            true
        );
    }
}


// ---------------- TABLE RENDERING ----------------

function renderTable(alerts) {
    const tbody = document.querySelector("#alertsTable tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    alerts.forEach(alert => {
        const row = tbody.insertRow();

        row.innerHTML = `
            <td>${escapeHtml(alert.id)}</td>
            <td>${escapeHtml(alert.productId)}</td>
            <td>${escapeHtml(alert.inventoryId)}</td>
            <td>${escapeHtml(alert.alertType)}</td>
            <td>${escapeHtml(alert.alertMessage)}</td>
            <td>${escapeHtml(
                alert.alertDate
                    ? new Date(alert.alertDate).toLocaleDateString()
                    : "N/A"
            )}</td>
            <td>
                <button
                    class="resolve"
                    onclick="resolveAlert('${escapeHtml(alert.id)}')">
                    Resolve
                </button>
            </td>
        `;
    });
}


// ---------------- VISIBILITY ----------------

function updateAlertsVisibility(count) {
    const noAlerts = document.getElementById("noAlerts");
    const table = document.getElementById("alertsTable");

    if (noAlerts) {
        noAlerts.style.display =
            count === 0 ? "block" : "none";
    }

    if (table) {
        table.style.display =
            count === 0 ? "none" : "table";
    }
}


// ---------------- RESOLVE ALERT ----------------

async function resolveAlert(id) {
    if (!confirm("Mark this alert as resolved?")) {
        return;
    }

    try {
        await resolveAlertRequest(id);

        showToast("Alert resolved successfully!");

        await loadAlerts();

        // Update stored baseline after resolution.
        const remainingAlerts = await getUnresolvedAlerts();

        localStorage.setItem(
            ALERT_STORAGE_KEY,
            JSON.stringify(remainingAlerts)
        );

    } catch (error) {
        showToast(
            "Error resolving alert: " + error.message,
            true
        );
    }
}


// ---------------- POLLING ----------------

function startPolling() {

    pollInterval = setInterval(async () => {

        try {
            const currentAlerts = await getUnresolvedAlerts();

            const previousAlerts = JSON.parse(
                localStorage.getItem(ALERT_STORAGE_KEY) || "[]"
            );

            const previousIds = new Set(
                previousAlerts.map(alert => alert.id)
            );

            // Identify newly generated alerts.
            const newAlerts = currentAlerts.filter(
                alert => !previousIds.has(alert.id)
            );

            newAlerts.forEach(alert => {

                showToast(
                    `New Alert: ${alert.alertType}`
                );

                sendBrowserNotification(
                    "New Inventory Alert",
                    `${alert.alertType}: ${alert.alertMessage}`,
                    alert.id
                );

            });

            // Save current state for the next polling cycle.
            localStorage.setItem(
                ALERT_STORAGE_KEY,
                JSON.stringify(currentAlerts)
            );

            renderTable(currentAlerts);

            updateAlertsVisibility(currentAlerts.length);

        } catch (error) {
            console.warn("Alert polling error:", error);
        }

    }, POLLING_INTERVAL);
}


// ---------------- CLEANUP ----------------

window.addEventListener("beforeunload", () => {

    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }

});


// ---------------- INITIALIZATION ----------------

document.addEventListener("DOMContentLoaded", () => {
    loadAlerts();
});
