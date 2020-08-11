const cors      = require('cors');
const stripe    = require('stripe')('pk_test_zGuHgH409O09pyq7VeIYvcbg');
const uuid      = require('uuid')
const express   = require('express');
const app       = express();

//middlepart implementation
app.use(express.json());
app.use(cors());


//routes

app.get("/",(req,res)=>{
    res.send('<h1>Hello</h1>')
})

app.post('/payment', (req,res) => {
    const {product, token} = req.body;
    console.log(product)
    console.log(product.price);
    const idempotencyKey = uuid();

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer=>{
        customer.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: product.name,
            shipping:{
                name: token.card.name,
                address:{
                    country: token.card.address_country
                }
            }
        }, {idempotencyKey});
    })
        .then(result=>res.status(200).json(result))
        .catch(error => console.log(error))

})



//listen to server
app.listen(3000,()=>console.log('localhost is up and running'))
