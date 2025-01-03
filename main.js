const SERVER_URL = "https://dummyjson.com";

const categoriesList = document.querySelector(".categories");

const itemList = document.querySelector(".items");

const getCategories = async () => {
    try {
    const res = await fetch(`${SERVER_URL}/products/categories`);
    
    const data = await res.json();

    return data;
    } catch (error) {
        console.log(error);
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

const insertProductsCards = (products) => {
    products.products.forEach((product) => {
        itemList.insertAdjacentHTML("beforeend", `
            <div class="item">
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
        insertProductsCards(products);
    }
}

const init = async () => {
    const categories = await getCategories();

    categories.forEach((category) => {
        categoriesList.insertAdjacentHTML("beforeend", `<li class="categories-item" data-category=${category.slug}>${category.name}</li>`)
    })

    if (categories.length > 0) {
        const firstCategory = categories[0].slug;
        const products = await getProductsByCategoryName(firstCategory);
        insertProductsCards(products);
    }
}

categoriesList.addEventListener("click", handleSelectCategory)


document.addEventListener("DOMContentLoaded", () => {
    init();
})
