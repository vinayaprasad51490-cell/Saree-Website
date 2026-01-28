function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name, price, image });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added to cart!");
}

function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartDiv = document.getElementById("cart-items");
    let emptyText = document.getElementById("empty-cart");

    cartDiv.innerHTML = "";

    if (cart.length === 0) {
        emptyText.style.display = "block";
        return;
    }

    emptyText.style.display = "none";

    cart.forEach(item => {
        let div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <img src="${item.image}" style="width:100%; border-radius:10px;">
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
        `;
        cartDiv.appendChild(div);
    });
}

if (window.location.pathname.includes("cart.html")) {
    loadCart();
}
localStorage.clear();
