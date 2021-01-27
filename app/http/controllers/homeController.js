const Menu = require('../../models/menu')

function homeController() {
    return {
        // index: function(){

        // }
        async index(req, res) {
            const pizzas = await Menu.find()   //When we apply await , we need to make the function asynchronous
            console.log(pizzas);
            return res.render('home', { pizzas: pizzas });
            // Menu.find().then(function (pizzas) {
            //     console.log(pizzas);
            //     return res.render('home', { pizzas: pizzas });
            // })
        }
    }
}

module.exports = homeController