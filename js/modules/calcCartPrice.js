
function calcCartPrice () {

	const cartItems = document.querySelectorAll('.cart-item')
	const totalPrice = document.querySelector('.total-price')

	const deliveryCost = document.querySelector('.delivery-cost')
	const cartDelivery = document.querySelector('[data-cart-delivery]')


	let totalPriceEl = 0


	cartItems.forEach(function(item) {

		const amountEl = parseInt(item.querySelector('[data-counter]').innerText)
		const priceEl = parseInt(item.querySelector('.price__currency').innerText)

		const currentPrice = amountEl * priceEl

		totalPriceEl += currentPrice

		
	})

	totalPrice.innerText = totalPriceEl

	if (totalPriceEl > 0 ) {
		cartDelivery.classList.remove('none')
	} else {
		cartDelivery.classList.add('none')
	}

	if (totalPriceEl >= 300){
		deliveryCost.classList.add('free')
		deliveryCost.innerText = 'безкоштовно'
	} else {
		deliveryCost.classList.remove('free')
		deliveryCost.innerText = '200 UAH'

	}
}