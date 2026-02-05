// 1. Initialize the "Brain"
let products = JSON.parse(localStorage.getItem("mySareeStore")) || [];

function saveData() {
    localStorage.setItem("mySareeStore", JSON.stringify(products));
}

// 2. The MERGED Add Product Function
async function addProduct() {
    // Grab elements (Make sure these match your HTML IDs exactly!)
    const nameEl = document.getElementById("name") || document.getElementById("pName");
    const oPriceEl = document.getElementById("originalPrice");
    const sPriceEl = document.getElementById("salePrice") || document.getElementById("pPrice");
    const catEl = document.getElementById("category") || document.getElementById("pCategory");
    const statusEl = document.getElementById("status");
    const imageEl = document.getElementById("pImages");

    // Extract values
    const name = nameEl.value;
    const oPrice = oPriceEl ? oPriceEl.value : 0;
    const sPrice = sPriceEl.value;
    const category = catEl.value;
    const status = statusEl ? statusEl.value : "In Stock";
    const files = imageEl.files;

    // Validation
    if (!name || !sPrice || files.length === 0) {
        alert("Wait! Please enter a name, price, and select at least one image.");
        return;
    }

    // Convert ALL selected images to data strings
    const imagePromises = Array.from(files).map(file => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    });

    const finalImages = await Promise.all(imagePromises);

    // Create the product object
    const newProduct = {
        id: Date.now(),
        name: name,
        price: Number(sPrice),
        originalPrice: Number(oPrice),
        category: category,
        status: status, 
        images: finalImages // This saves ALL images you selected
    };

    // Save to memory
    products.push(newProduct);
    saveData();
    
    alert("Saree Uploaded Successfully!");
    location.reload(); // This refreshes the page to show the new item
}

// 3. Inventory & Management Functions
function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this saree?")) {
        products = products.filter(item => item.id !== id);
        saveData();
        window.location.reload();
    }
}

function clearAllProducts() {
    if (confirm("WARNING: This will delete EVERY product. Are you sure?")) {
        localStorage.removeItem("mySareeStore");
        products = [];
        window.location.reload();
    }
}

function displayInventory() {
    const inventoryContainer = document.getElementById("inventoryContainer");
    if (!inventoryContainer) return;

    inventoryContainer.innerHTML = products.map(p => `
        <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px; background: white;">
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="display: flex; gap: 8px; flex-wrap: wrap; max-width: 250px;">
                    ${p.images.map(img => `
                        <img src="${img}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #eee;">
                    `).join('')}
                </div>
                
                <div style="flex-grow: 1;">
                    <h4 style="margin: 0;">${p.name}</h4>
                    <p style="margin: 5px 0; color: #666;">
                        <span style="color: green; font-weight: bold;">₹${p.price}</span> 
                        <span style="text-decoration: line-through; font-size: 0.9em; margin-left: 5px;">₹${p.originalPrice}</span>
                    </p>
                    <span style="font-size: 12px; padding: 2px 6px; border-radius: 10px; background: ${p.status === 'Sold Out' ? '#ffebee' : '#e8f5e9'}; color: ${p.status === 'Sold Out' ? 'red' : 'green'};">
                        ${p.status}
                    </span>
                </div>

                <button onclick="deleteProduct(${p.id})" style="background: #ff4d4d; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 5px;">Delete</button>
            </div>
        </div>
    `).join('');
}

// Run this when the page loads
window.onload = displayInventory;

// This function must be in the global scope to be "seen" by the button
function toggleStatus(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        // Toggles the stock status
        product.status = (product.status === "In Stock") ? "Sold Out" : "In Stock";
        saveData(); // Essential to update localStorage!
        location.reload(); 
    }
}