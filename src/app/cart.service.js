(function() {
    'use strict';



    angular
        .module('app')
        .factory('Cart', function Auth(SERVERURL, Auth, APPNAME) {


            function ShoppingCart(cartName) {
                this.cartName = cartName;
                this.clearCart = false;
                this.checkoutParameters = {};
                this.items = [];
                this.skuArray = [];
                // load items from local storage when initializing
                this.loadItems();
            }



            //----------------------------------------------------------------
            // items in the cart
            //
            //function CartItem(sku, name, slug, mrp, price, quantity, image, category, packing) {
            function CartItem(cartItems) {
                // this.sku = sku;
                // this.name = name;
                // this.slug = slug;
                // this.image = image;
                // this.category = category;
                // this.packing = packing;
                // this.mrp = mrp;
                // this.price = price * 1;
                // this.quantity = quantity * 1;
                // this.status = 0;
                this.product_id = cartItems.product_id;
                this.name = cartItems.name;
                //this.slug = slug;
                this.image = cartItems.image;
                //this.category = category;
                this.packing = 0;
                //this.mrp = cartItems.mrp;
                this.price = cartItems.price * 1;
                this.quantity = cartItems.quantity * 1;
                this.status = 0;
            }

            //----------------------------------------------------------------
            // checkout parameters (one per supported payment service)
            // replaced this.serviceName with serviceName because of jshint complaint
            //
            function checkoutParameters(serviceName, merchantID, options) {
                this.serviceName = serviceName;
                this.merchantID = merchantID;
                this.options = options;
            }

            // load items from local storage
            /*    ShoppingCart.prototype.loadItems = function() {
                    var items = localStorage !== null ? localStorage[this.cartName + '_items'] : null;
                    if (items !== null && JSON !== null) {
                        try {
                            items = JSON.parse(items);
                            for (var i = 0; i < items.length; i++) {
                                var item = items[i];
                                if (item.sku !== null && item.name !== null && item.price !== null) {
                                    item = new CartItem(item.sku, item.name, item.slug, item.mrp, item.price, item.quantity, item.image, item.category, item.packing, item.status);
                                    this.items.push(item);
                                    this.skuArray.push(item.sku);
                                }
                            }

                        } catch (err) {
                            // ignore errors while loading...
                        }
                    }
                };*/

            ShoppingCart.prototype.loadItems = function() {
                console.log("loading items" + Auth.getCurrentUser().name);
                var items = localStorage !== null ? localStorage[this.cartName + Auth.getCurrentUser().name] : null;
                if (items !== null && JSON !== null) {
                    try {
                        items = JSON.parse(items);
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            if (item.product_id !== null && item.name !== null && item.price !== null) {
                                //item = new CartItem(item.sku, item.name, item.slug, item.mrp, item.price, item.quantity, item.image, item.category, item.packing, item.status);
                                this.items.push(item);
                                this.skuArray.push(item.product_id);
                            }
                        }

                    } catch (err) {
                        // ignore errors while loading...
                    }
                }
            };

            // save items to local storage
            ShoppingCart.prototype.saveItems = function() {
                if (localStorage !== null && JSON !== null) {
                    localStorage[this.cartName + Auth.getCurrentUser().name] = JSON.stringify(this.items);
                }
            };

            // adds an item to the cart
            //ShoppingCart.prototype.addItem = function(sku, name, slug, mrp, price, quantity, image, category, packing) {
            ShoppingCart.prototype.addItem = function(cartItem, quantity) {
                quantity = this.toNumber(quantity);
                if (quantity !== 0) {
                    // update quantity for existing item
                    var found = false;
                    for (var i = 0; i < this.items.length && !found; i++) {
                        var item = this.items[i];
                        if (item.product_id === cartItem.product_id) {
                            console.log("item  found " + JSON.stringify(item.name));
                            found = true;
                            item.quantity = this.toNumber(this.toNumber(item.quantity) + quantity);
                            if (item.quantity <= 0) {
                                this.items.splice(i, 1);
                                this.skuArray.splice(i, 1);
                            }
                        }
                    }
                    // new item, add now
                    if (!found) {
                        console.log("item not added earlier " + JSON.stringify(cartItem.name));
                        //var itm = new CartItem(sku, name, slug, mrp, price, quantity, image, category, packing, 0);
                        cartItem['quantity'] = 1;
                        var itm = new CartItem(cartItem);
                        this.items.push(itm);
                        this.skuArray.push(itm.product_id);
                    }
                    // save changes
                    this.saveItems();
                }
            };

            // get the total price for all items currently in the cart
            /*    ShoppingCart.prototype.getTotalPrice = function(sku) {
                    var total = 0;
                    for (var i = 0; i < this.items.length; i++) {
                        var item = this.items[i];
                        if (sku === undefined || item.sku === sku) {
                            total += this.toNumber(item.quantity * item.price);
                        }
                    }
                    return total;
                };*/

            ShoppingCart.prototype.getTotalPrice = function(product_id) {
                var total = 0;
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (product_id === undefined || item.product_id === product_id) {
                        total += this.toNumber(item.quantity * item.price);
                    }
                }
                return total;
            };


            // ShoppingCart.prototype.getCompletePrice = function() {
            //     var totalPrice = 0;
            //     if (this.items) {
            //         for (var i = 0; i < this.items.length; i++) {
            //             if ($rootScope.cart.items[i]) {
            //                 totalPrice = totalPrice + this.items[i].quantity * this.items[i].price;
            //             }
            //         }
            //     }
            //     return totalPrice;
            // };



            ShoppingCart.prototype.getTotalPriceAfterShipping = function() { //Total Price Including Shipping
                var total = 0;
                total = this.getTotalPrice();
                if (total < 500) {
                    total += 20;
                }
                return total;
            };

            // get the total price for all items currently in the cart
            /*    ShoppingCart.prototype.getTotalCount = function(sku) {
                    var count = 0;
                    for (var i = 0; i < this.items.length; i++) {
                        var item = this.items[i];
                        if (sku === undefined || item.sku === sku) {
                            count += this.toNumber(item.quantity);
                        }
                    }
                    return count;
                };*/
            ShoppingCart.prototype.getTotalCount = function(product_id) {
                var count = 0;
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (product_id === undefined || item.product_id === product_id) {
                        count += this.toNumber(item.quantity);
                    }
                }
                return count;
            };

            // clear the cart
            ShoppingCart.prototype.clearItems = function() {
                this.items = [];
                this.skuArray = [];
                this.saveItems();
            };

            ShoppingCart.prototype.toNumber = function(value) {
                value = value * 1;
                return isNaN(value) ? 0 : value;
            };

            // define checkout parameters
            ShoppingCart.prototype.addCheckoutParameters = function(serviceName, merchantID, options) {

                // check parameters
                if (serviceName != "PayPal" && serviceName != "Google" && serviceName != "Stripe" && serviceName != "COD") {
                    throw "serviceName must be 'PayPal' or 'Google' or 'Stripe' or 'Cash On Delivery'.";
                }
                if (merchantID == null) {
                    throw "A merchantID is required in order to checkout.";
                }

                // save parameters
                this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);
            }

            // check out
            ShoppingCart.prototype.checkout = function(serviceName, clearCart) {
                this.addCheckoutParameters(serviceName.name, serviceName.email, serviceName.options);

                // this.addCheckoutParameters("COD", "-");
                // // enable PayPal checkout
                // // note: the second parameter identifies the merchant; in order to use the
                // // shopping cart with PayPal, you have to create a merchant account with
                // // PayPal. You can do that here:
                // // https://www.paypal.com/webapps/mpp/merchant
                // this.addCheckoutParameters("PayPal", "2lessons@gmail.com");
                //
                // // enable Google Wallet checkout
                // // note: the second parameter identifies the merchant; in order to use the
                // // shopping cart with Google Wallet, you have to create a merchant account with
                // // Google. You can do that here:
                // // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
                // this.addCheckoutParameters("Google", "2lessons@gmail.com",
                //     {
                //         ship_method_name_1: "UPS Next Day Air",
                //         ship_method_price_1: "20.00",
                //         ship_method_currency_1: "USD",
                //         ship_method_name_2: "UPS Ground",
                //         ship_method_price_2: "15.00",
                //         ship_method_currency_2: "USD"
                //     }
                // );
                //
                // // enable Stripe checkout
                // // note: the second parameter identifies your publishable key; in order to use the
                // // shopping cart with Stripe, you have to create a merchant account with
                // // Stripe. You can do that here:
                // // https://manage.stripe.com/register
                // this.addCheckoutParameters("Stripe", "pk_test_srKHaSHynBIVLX03r33xLszb",
                //     {
                //         chargeurl: "http://biri.in/order"
                //     }
                // );

                // console.log(serviceName);
                // select serviceName if we have to
                if (serviceName.name == null) {
                    var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
                    serviceName = p.serviceName;
                }

                // sanity
                if (serviceName.name == null) {
                    throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";
                }

                // go to work
                var parms = this.checkoutParameters[serviceName.name];
                // console.log(parms);
                if (parms == null) {
                    throw "Cannot get checkout parameters for '" + serviceName.name + "'.";
                }
                switch (parms.serviceName) {
                    case "COD":
                        this.checkoutCOD(parms, clearCart);
                        break;
                    default:
                        throw "Unknown checkout service: " + parms.serviceName;
                }
            }



            // check out using COD
            ShoppingCart.prototype.checkoutCOD = function(parms, clearCart) {

                // global data
                var data = {};

                // item data
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    var ctr = i + 1;
                    // data["item_name_" + ctr] = item.sku;
                    data["item_description_" + ctr] = item.name;
                    // data["item_price_" + ctr] = item.price.toFixed(2);
                    // data["item_quantity_" + ctr] = item.quantity;
                    // data["item_merchant_id_" + ctr] = parms.merchantID;
                }

                // build form
                var form = $('<form/></form>');
                // NOTE: in production projects, use the checkout.google url below;
                // for debugging/testing, use the sandbox.google url instead.
                //form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);
                form.attr("action", "/order");
                form.attr("method", "GET");
                form.attr("style", "display:none;");
                this.addFormFields(form, data);
                if (!parms.options) { parms.options = {}; }
                this.addFormFields(form, parms.options);
                $("body").append(form);

                // submit form
                this.clearCart = clearCart == null || clearCart;
                form.submit();
                form.remove();
            }

            // check out using Stripe
            // for details see:
            // https://stripe.com/docs/checkout


            // utility methods
            ShoppingCart.prototype.addFormFields = function(form, data) {
                if (data !== null) {
                    $.each(data, function(name, value) {
                        if (value !== null) {
                            var input = $('<input></input>').attr('type', 'hidden').attr('name', name).val(value);
                            form.append(input);
                        }
                    });
                }
            };
            var myCart = new ShoppingCart(APPNAME.name);

            // var settings = Setting.query().$promise.then(function(res){
            //     myCart.addCheckoutParameters('PayPal', res[0].paypal);
            // }, function (err) {
            //     console.log("fail", err);
            // });
            // console.log(myCart);
            return { cart: myCart };

        });

})();