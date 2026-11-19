
// Product Management

const productForm = document.getElementById("productForm");

async function loadProducts() {
    try {
        const products = await getProducts();
        renderProductsTable(products);
    } catch (error) {
        showToast(error.message, true);
    }
}

function renderProductsTable(products) {
    const tbody = document.querySelector("#productsTable tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    products.forEach(product => {
        const row = tbody.insertRow();

        row.innerHTML = `
            <td>${escapeHtml(product.id)}</td>
            <td>${escapeHtml(product.productName)}</td>
            <td>${escapeHtml(product.category)}</td>
            <td>${escapeHtml(product.shelfLifeDays)} days</td>
            <td>${escapeHtml(
                product.createdAt
                    ? new Date(product.createdAt).toLocaleDateString()
                    : "N/A"
            )}</td>
            <td>
                <button class="edit"
                    onclick="editProduct('${escapeHtml(product.id)}')">
                    Edit
                </button>
                <button class="delete"
                    onclick="deleteProduct('${escapeHtml(product.id)}')">
                    Delete
                </button>
            </td>
        `;
    });
}

// Create / Update Product

if (productForm) {
    productForm.addEventListener("submit", async event => {
        event.preventDefault();

        const id = document.getElementById("productId").value;

        const data = {
            productName: document.getElementById("productName").value.trim(),
            category: document.getElementById("category").value.trim(),
            shelfLifeDays: Number(
                document.getElementById("shelfLifeDays").value
            )
        };

        try {
            if (id) {
                await updateProduct(id, data);
                showToast("Product updated successfully!");
            } else {
                await createProduct(data);
                showToast("Product added successfully!");
            }

            clearProductForm();
            await loadProducts();

        } catch (error) {
            showToast(error.message, true);
        }
    });
}

async function editProduct(id) {
    try {
        const product = await getProduct(id);

        document.getElementById("productId").value = product.id;
        document.getElementById("productName").value =
            product.productName || "";

        document.getElementById("category").value =
            product.category || "";

        document.getElementById("shelfLifeDays").value =
            product.shelfLifeDays ?? "";

    } catch (error) {
        showToast(error.message, true);
    }
}

async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    try {
        await deleteProductAPI(id);

        showToast("Product deleted successfully!");

        await loadProducts();

    } catch (error) {
        showToast(error.message, true);
    }
}

// Separate API function to avoid naming conflict
async function deleteProductAPI(id) {
    return deleteProductRequest(id);
}

function clearProductForm() {
    productForm?.reset();

    const idField = document.getElementById("productId");

    if (idField) idField.value = "";
}

// Initial Load

document.addEventListener("DOMContentLoaded", loadProducts);
