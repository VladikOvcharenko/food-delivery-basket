const productsContainer = document.querySelector("#products-container");
const cartWrapper = document.querySelector(".cart-wrapper");

getProducts();

async function getProducts() {
  const response = await fetch("./js/products.json");
  const productArray = await response.json();
  renderProducts(productArray);
}
function renderProducts(productArray) {
  productArray.forEach(function (item) {
    const productHTML = `
														<div class="col-md-6">
															<div class="card mb-4" data-id="${item.id}">
															<img class="product-img" src="img/food/${item.imgSrc}" alt="">
															<div class="card-body text-center">
																<h4 class="item-title">${item.title}</h4>
																<p><small data-items-in-box class="text-muted">${item.itemsInBox} шт.</small></p>
													
																<div class="details-wrapper">
																	<div class="items counter-wrapper">
																		<div class="items__control" data-action="minus">-</div>
																		<div class="items__current" data-counter>1</div>
																		<div class="items__control" data-action="plus">+</div>
																	</div>
													
																	<div class="price">
																		<div class="price__weight">${item.weight}г.</div>
																		<div class="price__currency">${item.price} UAH</div>
																	</div>
																</div>	
																	<button data-cart type="button" class="btn btn-block btn-outline-warning">+ до кошика</button>	
																</div>
															</div>
													</div>
				`;
    productsContainer.insertAdjacentHTML("beforeend", productHTML);
  });
}

function calcCartPrice() {
  const cartItems = document.querySelectorAll(".cart-item");
  const totalPrice = document.querySelector(".total-price");

  const deliveryCost = document.querySelector(".delivery-cost");
  const cartDelivery = document.querySelector("[data-cart-delivery]");

  let totalPriceEl = 0;

  cartItems.forEach(function (item) {
    const amountEl = parseInt(item.querySelector("[data-counter]").innerText);
    const priceEl = parseInt(item.querySelector(".price__currency").innerText);

    const currentPrice = amountEl * priceEl;

    totalPriceEl += currentPrice;
  });

  totalPrice.innerText = totalPriceEl;

  if (totalPriceEl > 0) {
    cartDelivery.classList.remove("none");
  } else {
    cartDelivery.classList.add("none");
  }

  if (totalPriceEl >= 300) {
    deliveryCost.classList.add("free");
    deliveryCost.innerText = "безкоштовно";
  } else {
    deliveryCost.classList.remove("free");
    deliveryCost.innerText = "200 UAH";
  }
}

function toggleCartStatus() {
  const cartEmpty = document.querySelector("[data-cart-empty]");
  const orderForm = document.querySelector("#order-form");

  if (cartWrapper.children.length > 0) {
    cartEmpty.classList.add("none");
    orderForm.classList.remove("none");
  } else {
    cartEmpty.classList.remove("none");
    orderForm.classList.add("none");
  }
}

window.addEventListener("click", function (e) {
  let counter;
  if (
    e.target.dataset.action === "minus" ||
    e.target.dataset.action === "plus"
  ) {
    const counterWrapper = e.target.closest(".counter-wrapper");
    counter = counterWrapper.querySelector("[data-counter]");
  }
  if (e.target.dataset.action === "minus") {
    if (+counter.innerText > 1) {
      counter.innerText = --counter.innerText;
    } else if (e.target.closest(".cart-wrapper") && +counter.innerText === 1) {
      e.target.closest(".cart-item").remove();
      toggleCartStatus();
      calcCartPrice();
    }
  }
  if (e.target.dataset.action === "plus") {
    counter.innerText = ++counter.innerText;
  }
  if (
    e.target.hasAttribute("data-action") &&
    e.target.closest(".cart-wrapper")
  ) {
    calcCartPrice();
  }
});

window.addEventListener("click", function (e) {
  if (e.target.hasAttribute("data-cart")) {
    const card = e.target.closest(".card");
    const productInfo = {
      id: card.dataset.id,
      imgSrc: card.querySelector(".product-img").getAttribute("src"),
      title: card.querySelector(".item-title").innerText,
      itemsInBox: card.querySelector("[data-items-in-box]").innerText,
      weight: card.querySelector(".price__weight").innerText,
      price: card.querySelector(".price__currency").innerText,
      counter: card.querySelector("[data-counter]").innerText,
    };
    const itemInCart = cartWrapper.querySelector(
      `[data-id='${productInfo.id}']`
    );
    if (itemInCart) {
      const counterEl = itemInCart.querySelector("[data-counter]");
      counterEl.innerText = +counterEl.innerText + +productInfo.counter;
    } else {
      const cartItemHTML = `
				<div class="cart-item" data-id="${productInfo.id}">
					<div class="cart-item__top">
						<div class="cart-item__img">
							<img src="${productInfo.imgSrc}" alt="">
						</div>
						<div class="cart-item__desc">
							<div class="cart-item__title">${productInfo.title}</div>
							<div class="cart-item__weight">${productInfo.itemsInBox} / ${productInfo.weight}.</div>

							<div class="cart-item__details">

								<div class="items items--small counter-wrapper">
									<div class="items__control" data-action="minus">-</div>
									<div class="items__current" data-counter="">${productInfo.counter}</div>
									<div class="items__control" data-action="plus">+</div>
								</div>

								<div class="price">
									<div class="price__currency">${productInfo.price}</div>
								</div>

							</div>
						</div>
					</div>
				</div>
				`;
      cartWrapper.insertAdjacentHTML("beforeend", cartItemHTML);
    }
    card.querySelector("[data-counter]").innerText = 1;
    toggleCartStatus();
    calcCartPrice();
  }
});
