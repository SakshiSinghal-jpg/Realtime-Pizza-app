import { placeOrder } from './apiService'
import { loadStripe } from '@stripe/stripe-js'
// import { CardWidget } from './CardWidget'

export async function initStripe() {
    const stripe = await loadStripe('pk_test_51IDZvXAA2CmJxauhNbv8VeZLsdtpNwX5pMs7a3ClLT4lU7XHYcVQGbbGwF4Vwv3kbF2sskqYc0uKXr6xIfTUrfK900SBeqodGX');
    let card = null;
    function mountWidget() {
        const elements = stripe.elements();

        let style = {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        }

        card = elements.create('card', { style: style, hidePostalCode: true });
        card.mount('#card-element');
    }
    const paymentType = document.querySelector('#paymentType');
    if (!paymentType) {
        return;
    }
    paymentType.addEventListener('change', (e) => {
        // console.log(e.target.value)
        if (e.target.value === 'card') {
            //Display widget
            // new CardWidget(stripe)
            mountWidget();
        } else {
            card.destroy(stripe);
        }
    })

    //Ajax call
    const paymentForm = document.querySelector('#payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let formData = new FormData(paymentForm);
            let formObject = {}
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
                // console.log(key, value);
            }

            if (!card) {
                //Ajax
                placeOrder(formObject);
                // console.log(formObject);
                return;
            }

            //Verify Card
            stripe.createToken(card).then((result) => {
                // console.log(result);
                formObject.stripeToken = result.token.id;
                placeOrder(formObject);
            }).catch((err) => {
                console.log(err);
            })


        })
    }

}