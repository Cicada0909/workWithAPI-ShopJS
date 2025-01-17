const SERVER_URL = "https://dummyjson.com";

const PRODUCTS_LIMIT = 9;

const categoriesList = document.querySelector(".categories");

const itemList = document.querySelector(".items");

const productPage = document.querySelector(".product-page");

const cartBtn = document.querySelector(".cart-btn");

const cartPage = document.querySelector(".cart-page");

const cartPageItems = document.querySelector(".cart-page__items");

const cartPageHeader = document.querySelector(".cart-page__header");

const modalWindow = document.querySelector(".modal-window");

const btnSearch = document.querySelector(".btn-search");

const searchInp = document.querySelector("#search-inp");

const headerForm = document.querySelector(".header__form");

const foundProducts = document.querySelector(".found-products");

const pagination = document.querySelector(".pagination");

const modalWindowBuy = document.querySelector(".modal-window-buy");

const modalWindowBuyBackBtn = document.querySelector(".modal-window-buy__back-btn");

const modalWindowBuyBtnPackage = document.querySelector(".modal-window-buy__btn-package");

// event.preventDefault();

const getItem = async (product) => {
    try {
        const res = await fetch(`${SERVER_URL}/products/search?q=${product}`);
        const data = await res.json();
        return data
    } catch (e) {

    }
}

const searchItem = async (event) => {
    event.preventDefault()
    const inputValue = searchInp.value;
    const product = await getItem(inputValue);
    console.log(product.products);
    insertSearchCards(product.products)
}

headerForm.addEventListener("submit", searchItem);



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

const goBackToCart = () => {
    modalWindowBuy.classList.add("hide");
}

const getAllproducts = async (limit = PRODUCTS_LIMIT, skip = 0) => {
    try {
        const res = await fetch(`${SERVER_URL}/products?limit=${limit}&skip=${skip}`)

        const data = await res.json();

        return data;
    } catch (e) {
        console.log(e);
    }
}

const getProductsByCategoryName = async (categoryName, limit = PRODUCTS_LIMIT, skip = 0) => {
    try {
        const res = await fetch(`${SERVER_URL}/products/category/${categoryName}?limit=${limit}&skip=${skip}`);

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

const insertProductsCards = (products) => {
    itemList.innerHTML = "";

    itemList.classList.remove("hide");
    productPage.classList.add("hide");
    cartPage.classList.add("hide");
    foundProducts.classList.add("hide");
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
    foundProducts.classList.add("hide");
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

const insertSearchCards = async (products) => {
    foundProducts.innerHTML = "";

    cartPage.classList.add("hide");
    productPage.classList.add("hide");
    itemList.classList.add("hide");
    foundProducts.classList.remove("hide");
    products.forEach((product) => {
        foundProducts.insertAdjacentHTML("beforeend", `
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
    foundProducts.classList.add("hide");

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

const createPagination = (totalProducts, categories) => {
    pagination.innerHTML = "";

    const totalPages = Math.ceil(totalProducts / PRODUCTS_LIMIT);
    
    for (let i = 1; i <= totalPages; i++) {
        pagination.insertAdjacentHTML("beforeend", `
            <span class="pagination-btn" data-page-number="${i}" data-category="${categories}">${i}</span>`
        );
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
        createPagination(products.total, categoryName);
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

const handlePageChange = async (e) => {
    const target = e.target;

    if (target.closest(".pagination-btn")) {
        const pageNumber = Number(target.dataset.pageNumber);
        console.log(pageNumber);
        const categoryName = target.dataset.category;
        const skip = (pageNumber - 1) * PRODUCTS_LIMIT;
        const products = await getProductsByCategoryName(categoryName, PRODUCTS_LIMIT, skip);

        insertProductsCards(products.products);
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

        pagination.innerHTML = " ";

        const clearCartBtn = document.querySelector(".clear-cart-btn");

        if (!clearCartBtn) {
            cartPageHeader.insertAdjacentHTML("afterbegin", `<button class="clear-cart-btn">Clear Cart</button>`);
            cartPageHeader.insertAdjacentHTML("afterbegin", `<button class="buy-cart-btn">buy</button>`);
            cartPageHeader.insertAdjacentHTML("afterbegin", `<button class="back-cart-btn">Back</button>`);

            const clearCartBtn = document.querySelector(".clear-cart-btn");
            const buyCartBtn = document.querySelector(".buy-cart-btn");
            const backCartBtn = document.querySelector(".back-cart-btn");

            clearCartBtn.addEventListener("click", () => {
                cartPageItems.innerHTML = `<p class="cart-page__message">Корзина пуста</p>`
                localStorage.removeItem("cart");
            })

            buyCartBtn.addEventListener("click", () => {
                modalWindowBuy.classList.remove("hide");

                const handleOutsideClickCart = (e) => {
                    if (e.target === buyCartBtn) {
                        return;
                    }
                
                    if (!modalWindowBuy.contains(e.target)) {
                        goBackToCart();
                        document.removeEventListener("click", handleOutsideClickCart);
                    }
                };
                document.addEventListener("click", handleOutsideClickCart);

                
            })

            modalWindowBuyBtnPackage.addEventListener("click", (event) => {
                event.preventDefault()
                const cartAllItems = Array.from(cartPageItems.children);
                const itemsObj = {};

                cartAllItems.forEach((item) => {
                    const id = parseInt(item.dataset.productId);

                    if (isNaN(id)) return;
                    
                    if (itemsObj[id]) {
                        itemsObj[id].quantity +=1;
                    } else {
                        itemsObj[id] = {id, quantity: 1};
                    }
                    
                })
                
                const itemsArray = Object.values(itemsObj);
                console.log("products:", itemsArray);
                
                sendCart(itemsArray);
            })
            
            modalWindowBuyBackBtn.addEventListener("click", (event) => {
                event.preventDefault()
                goBackToCart();
            })
        }
    }
});

const sendCart = async (cartItems) => {
    const response = await fetch(`${SERVER_URL}/carts/add`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: 1,
            products: cartItems,
        }),
    });

    cartPageItems.innerHTML = `<p class="cart-page__message">Корзина пуста</p>`

    if (response.status === 400) {
        alert("Не удалось отправить корзину.");
    } else {
        const data = await response.json();
        alert(`Ваша корзина сформирована для оплаты, сумма к оплате составит: ${data.total}$`);
        console.log(data);
    }
}

pagination.addEventListener("click", handlePageChange);

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


