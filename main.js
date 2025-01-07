const SERVER_URL = "https://dummyjson.com";

const categoriesList = document.querySelector(".categories");

const itemList = document.querySelector(".items");

const productPage = document.querySelector(".product-page");

const cartBtn = document.querySelector(".cart-btn");

const cartPage = document.querySelector(".cart-page");

const cartPageItems = document.querySelector(".cart-page__items");

const cartPageHeader = document.querySelector(".cart-page__header");

const modalWindow = document.querySelector(".modal-window");





const getCategories = async () => {
    try {
    const res = await fetch(`${SERVER_URL}/products/categories`);
    
    const data = await res.json();

    return data;
    } catch (error) {
        console.log(error);
    }
}

const goBackToItemList = () => {
    itemList.classList.remove("hide");
    productPage.classList.add("hide");
    productPage.innerHTML = "";
};

const getAllproducts = async (limit = 9, skip = 0) => {
    try {
        const res = await fetch(`${SERVER_URL}/products?limit=${limit}&skip=${skip}`)

        const data = await res.json();

        return data;
    } catch (e) {
        console.log(e);
    }
}

const getProductsByCategoryName = async (categoryName) => {
    try {
        const res = await fetch(`${SERVER_URL}/products/category/${categoryName}`);

        const data = await res.json();
        return data;
        
    } catch (error) {
        console.log(error);
    }
}

const getProductById = async (productId) => {
    try {
        const res = await fetch(`${SERVER_URL}/products/${productId}`);

        const data = await res.json();
        

        return data;

    } catch (e) {

    }
}

const insertProductsCards = async (products) => {
    itemList.innerHTML = "";

    itemList.classList.remove("hide");
    productPage.classList.add("hide");
    cartPage.classList.add("hide");
    products.forEach((product) => {
        itemList.insertAdjacentHTML("beforeend", `
            <div class="item" data-product-id=${product.id}>
                <img src="${product.thumbnail}">
                <div class="item__info">
                    <span class="item-title">${product.title}</span>
                    <button class="btn-flip" 
                        data-front="${product.price}$" 
                        data-back="Buy">
                    </button>
                </div>
            </div>`)
    })
}

const insertCartCards = async (products) => {
    cartPageItems.innerHTML = "";

    cartPage.classList.remove("hide");
    productPage.classList.add("hide");
    itemList.classList.add("hide");
    products.forEach((product) => {
        cartPageItems.insertAdjacentHTML("beforeend", `
            <div class="item" data-product-id=${product.id}>
                <img src="${product.thumbnail}">
                <div class="item__info">
                    <span class="item-title">${product.title}</span>
                    <button class="btn-flip" 
                        data-front="${product.price}$" 
                        data-back="Buy">
                    </button>
                </div>
            </div>`)
    })
}

const showProductPage = (product) => {
    itemList.classList.add("hide");
    productPage.classList.remove("hide");
    cartPage.classList.add("hide");
    console.log(product);
    

    productPage.insertAdjacentHTML("beforeend", `
            <img 
                src="${product.images[0]}"
                alt="${product.title}"
                class="item-img"
            >
            <div class="wrapper-items">
                <h3 class="product-page__item-title">${product.title}</h3>
                <div class="item__block">
                    <h3 class="item__description-title">Description</h3>
                    <p>${product.description}</p>
                </div>
                <div class="item__block">
                    <h3 class="item__info-title">Other</h3>
                    <div class="item__block-info">
                        <span>rating: ${product.rating}</span>
                        <span>brand: ${product.brand}</span>
                        <span>price: ${product.price}$</span>
                        <span>${product.warrantyInformation}</span>
                    </div>
                </div>
                <button class="item-buy-btn right">Buy</button>
            </div>
            <button class="item-back-btn">X</button>
        `)


    const backButton = productPage.querySelector(".item-back-btn");
    backButton.addEventListener("click", () => {
        goBackToItemList();
    });
    const handleOutsideClick = (e) => {
        if (!productPage.contains(e.target)) {
            goBackToItemList();
            document.removeEventListener("click", handleOutsideClick);
        }
    };
    document.addEventListener("click", handleOutsideClick);

}

const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart"));

    if (cart) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log(cart);
    } else {
        localStorage.setItem("cart", JSON.stringify([product]));
    }
}


const handleSelectCategory = async (e) => {
    const target = e.target;
    if (target.closest(".categories-item")) {
        if (target.classList.contains("active")) {
            return;
        }

        const activeCategory = categoriesList.querySelector(".categories-item.active");
        if (activeCategory) {
            activeCategory.classList.remove("active");
        }

        target.classList.add("active");
        itemList.innerHTML = "";

        const categoryName = target.dataset.category;
        const products = await getProductsByCategoryName(categoryName);
        insertProductsCards(products.products);
    }
}

const handleSelectProductCard = async (e) => {
    const itemElement = e.target.closest(".item");
    const buyBtn = e.target.closest(".btn-flip");

    if (!itemElement) {
        return
    }

    const productId = itemElement.dataset.productId;
    const product = await getProductById(productId);

    if (!buyBtn) {
        showProductPage(product);
    } else {
        addToCart(product)
        modalWindow.style.opacity = "1";
        modalWindow.style.top = "95%"
        setTimeout(() => {
            modalWindow.style.opacity = "0";
            modalWindow.style.top = "103%"
        }, 1000)
        
        
    }
}

const init = async () => {
    const categories = await getCategories();

    const allproducts = await getAllproducts();
    

    categories.forEach((category) => {
        categoriesList.insertAdjacentHTML("beforeend", `<li class="categories-item" data-category=${category.slug}>${category.name}</li>`)
    })

    insertProductsCards(allproducts.products);

}

categoriesList.addEventListener("click", handleSelectCategory)

itemList.addEventListener("click", handleSelectProductCard)

cartBtn.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart"));

    if (cart) {
        insertCartCards(cart);

        const clearCartBtn = document.querySelector(".clear-cart-btn");

        if (!clearCartBtn) {
            cartPageHeader.insertAdjacentHTML("afterbegin", `<button class="clear-cart-btn">Clear Cart</button>`);
            cartPageHeader.insertAdjacentHTML("afterbegin", `<button class="back-cart-btn">Back</button>`);

            const clearCartBtn = document.querySelector(".clear-cart-btn");
            const backCartBtn = document.querySelector(".back-cart-btn");

            clearCartBtn.addEventListener("click", () => {
                cartPageItems.innerHTML = `<p class="cart-page__message">Корзина пуста</p>`
                localStorage.removeItem("cart");
            
            })
            backCartBtn.addEventListener("click", () => {
                cartPage.classList.add("hide");
                productPage.classList.add("hide");
                itemList.classList.remove("hide");
            })
        }
    }
})



document.addEventListener("DOMContentLoaded", () => {
    init();
})

// const arr = [1, 2, 3];

// const data = {
//     value: "Test",
//     items: ["q", "b", "a"],
// }

// localStorage.setItem("myKey", JSON.stringify(data));

// const localStorageData = localStorage.getItem("myKey");

// const localStorageData = localStorage.getItem("userData")

// JSON.parse(localStorageData);

// console.log(localStorageData);


