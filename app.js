// This gets our list of products from the browser's memory
// This should be the ONLY place this line exists!
let products = JSON.parse(localStorage.getItem("mySareeStore")) || [];

function saveData() {
    localStorage.setItem("mySareeStore", JSON.stringify(products));
}

// Function to handle adding a product with multiple images
async function addProduct() {
    // 1. Grab the elements
    const nameEl = document.getElementById("pName");
    const priceEl = document.getElementById("pPrice");
    const catEl = document.getElementById("pCategory");
    const imageEl = document.getElementById("pImages");

    // 2. Extract values
    const name = nameEl.value;
    const price = priceEl.value;
    const category = catEl.value;
    const files = imageEl.files;

    // 3. Simple Check: Did you fill it out?
    if (!name || !price || files.length === 0) {
        alert("Wait! Please enter a name, price, and select at least one image.");
        return;
    }

    // 4. Convert images to a format the browser can remember
    const imagePromises = Array.from(files).map(file => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    });

    const images = await Promise.all(imagePromises);

    // 5. Create the product
    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        category: category,
        images: images,
        status: "In Stock"
    };

    // 6. Push to the list and SAVE to the brain
    products.push(newProduct);
    localStorage.setItem("mySareeStore", JSON.stringify(products));

    // 7. Success Message
    alert("✅ Success! " + name + " has been added to your shop.");
    
    // 8. Refresh the inventory list on the screen
    if (typeof displayInventory === "function") {
        displayInventory();
    }

    // 9. Clear the form for the next item
    nameEl.value = "";
    priceEl.value = "";
}

// Function to delete a product
function deleteProduct(id) {
    // Ask the user if they are sure
    if (confirm("Are you sure you want to delete this saree?")) {
        // Keep everything EXCEPT the product that matches this ID
        products = products.filter(item => item.id !== id);
        
        // Save the new list and refresh the screen
        saveData();
        window.location.reload();
    }
}

function clearAllProducts() {
    if (confirm("WARNING: This will delete EVERY product in your store. Are you sure?")) {
        localStorage.removeItem("mySareeStore"); // Wipes the specific storage
        products = []; // Clears the list in the current window
        window.location.reload(); // Refreshes the page
    }
}

function toggleStatus(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.status = (product.status === "In Stock") ? "Sold Out" : "In Stock";
        saveData();
        window.location.reload();
    }
}