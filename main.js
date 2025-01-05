const SERVER_URL = "https://dummyjson.com";

const categoriesList = document.querySelector(".categories");

const itemList = document.querySelector(".items");

const productPage = document.querySelector(".product-page");

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

const insertProductsCards = (products) => {
    itemList.classList.remove("hide");
    productPage.classList.add("hide");
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

const showProductPage = (product) => {
    itemList.classList.add("hide");
    productPage.classList.remove("hide");
    console.log(product);
    

    productPage.insertAdjacentHTML("beforeend", `
            <img 
                src="${product.images[0]}"
                alt="${product.title}"
                class="item-img"
            >
            <div class="wrapper-items">
                <h3 class="item-title">${product.title}</h3>
                <div class=item__block">
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
                <button class="item-buy-btn">Buy</button>
            </div>
            <button class="item-back-btn">Back</button>
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

    productPage.innerHTML = "";

    if (itemElement) {
        const productId = itemElement.dataset.productId;
        const product = await getProductById(productId);
        showProductPage(product);
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


document.addEventListener("DOMContentLoaded", () => {
    init();
})
