// 1. Initialize the "Brain"
let products = JSON.parse(localStorage.getItem("mySareeStore")) || [];

function saveData() {
    localStorage.setItem("mySareeStore", JSON.stringify(products));
}

// 2. The Add Product Function (Now includes default stock)
async function addProduct() {
    const nameEl = document.getElementById("name") || document.getElementById("pName");
    const oPriceEl = document.getElementById("originalPrice");
    const sPriceEl = document.getElementById("salePrice") || document.getElementById("pPrice");
    const catEl = document.getElementById("category") || document.getElementById("pCategory");
    const statusEl = document.getElementById("status");
    const imageEl = document.getElementById("pImages");

    const name = nameEl.value;
    const oPrice = oPriceEl ? oPriceEl.value : 0;
    const sPrice = sPriceEl.value;
    const category = catEl.value;
    const status = statusEl ? statusEl.value : "In Stock";
    const files = imageEl.files;

    if (!name || !sPrice || files.length === 0) {
        alert("Please fill name, price and select images.");
        return;
    }

    const imagePromises = Array.from(files).map(file => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    });

    const finalImages = await Promise.all(imagePromises);

    const newProduct = {
        id: Date.now(),
        name: name,
        price: Number(sPrice),
        originalPrice: Number(oPrice),
        category: category,
        status: status, 
        stock: 5, // Default stock set to 5
        images: finalImages 
    };

    products.push(newProduct);
    saveData();
    alert("Saree Uploaded!");
    location.reload();
}

// 3. Updated Inventory Display (This adds the Stock Input options)
function displayInventory() {
    const inventoryContainer = document.getElementById("inventoryContainer");
    if (!inventoryContainer) return;

    inventoryContainer.innerHTML = products.map(p => `
        <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                <div style="display: flex; gap: 8px; flex-wrap: wrap; max-width: 150px;">
                    ${p.images.map(img => `<img src="${img}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">`).join('')}
                </div>
                
                <div style="flex-grow: 1; min-width: 200px;">
                    <h4 style="margin: 0;">${p.name}</h4>
                    <p style="margin: 5px 0; font-size: 14px; color: ${p.status === 'Sold Out' ? 'red' : 'green'};">Status: ${p.status}</p>
                    
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 10px; background: #f0f0f0; padding: 8px; border-radius: 5px; width: fit-content;">
                        <span style="font-size: 12px; font-weight: bold;"> STOCK:</span>
                        <input type="number" id="stock-${p.id}" value="${p.stock || 0}" style="width: 50px; padding: 3px; border: 1px solid #999; border-radius: 3px;">
                        <button onclick="updateStock(${p.id})" style="background: #2e7d32; color: white; border: none; padding: 4px 10px; border-radius: 3px; cursor: pointer; font-size: 12px;">Update</button>
                    </div>
                </div>

                <div style="display: flex; gap: 8px;">
                    <button onclick="toggleStatus(${p.id})" style="background: #800000; color: white; border: none; padding: 8px; cursor: pointer; border-radius: 5px; font-size: 12px;">Change Status</button>
                    <button onclick="deleteProduct(${p.id})" style="background: #ff4d4d; color: white; border: none; padding: 8px; cursor: pointer; border-radius: 5px; font-size: 12px;">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 4. Update Stock Function
function updateStock(id) {
    const newStockValue = document.getElementById(`stock-${id}`).value;
    const product = products.find(p => p.id === id);
    if (product) {
        product.stock = Number(newStockValue);
        saveData();
        alert("Stock updated successfully!");
        displayInventory(); // Refresh the list without reloading the whole page
    }
}

// 5. Toggle Status (In Stock vs Sold Out)
function toggleStatus(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.status = (product.status === "In Stock" || product.status === "Available") ? "Sold Out" : "In Stock";
        saveData();
        displayInventory();
    }
}

// 6. Delete Functions
function deleteProduct(id) {
    if (confirm("Delete this saree?")) {
        products = products.filter(item => item.id !== id);
        saveData();
        displayInventory();
    }
}

// Get the button
let mybutton = document.getElementById("backToTop");

// When the user scrolls down 200px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // This makes the scroll nice and smooth
    });
}

// Initialize
window.onload = function() {
    displayInventory();
};