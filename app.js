// This gets our list of products from the browser's memory
let products = JSON.parse(localStorage.getItem("mySareeStore")) || [];

// Function to save and refresh the page
function saveData() {
    localStorage.setItem("mySareeStore", JSON.stringify(products));
}

// Function to handle adding a product with multiple images
async function addProduct() {
    // 1. Get values from the screen
    const name = document.getElementById("pName").value;
    const price = document.getElementById("pPrice").value;
    const category = document.getElementById("pCategory").value; // Make sure this exists!
    const imageInput = document.getElementById("pImages");
    const files = imageInput.files;

    // 2. Validation
    if (!name || !price || files.length === 0) {
        alert("Please fill all fields and select at least one image.");
        return;
    }

    // 3. Process Images
    const imagePromises = Array.from(files).map(file => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    });

    try {
        const images = await Promise.all(imagePromises);

        // 4. Create the product object
        const newProduct = {
            id: Date.now(),
            name: name,
            price: price,
            category: category,
            images: images
        };

        // 5. Add to our list and save
        products.push(newProduct);
        localStorage.setItem("mySareeStore", JSON.stringify(products));
        
        alert("Product Uploaded Successfully!");
        window.location.href = "index.html"; // Go to shop automatically after upload
    } catch (error) {
        console.error("Upload failed:", error);
        alert("Something went wrong with the images.");
    }
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