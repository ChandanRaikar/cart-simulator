$(document).ready(function(){
    cart = [];
    if(!localStorage.getItem('cartItems')){
        localStorage.setItem("cartItems",'[]');
    }
    cart.push(localStorage.getItem('cartItems'));

    $('.searchbtn').on('click',function(){
        $('.searchbox').fadeToggle("slow");
    })

    renderItems = function(items){
        var price = items.price ;
        var discount = items.discount
        var discount_price = price*discount/100;
        const finalprice = price-discount_price;
        var item = '<div class="product-container" data-price='+finalprice+' data-discount='+items.discount+'><div class="product-img"><img src='+items.img_url+'></div><span class="product_name">'+items.name+'</span><span class="discount-price">&#8377;'+finalprice+'</span><span class="price">'+price+'</span><span class="dispsercentage">'+items.discount+'%off</span><div class="cart-button"><button class="cartbtn" data-item='+items.id+'>Add to cart</button></div></div>';
        $('.itemsList').append(item);
    }

    $.ajax({
        url:"https://api.myjson.com/bins/qzuzi",
        success:function(response){       
            response.forEach(function(i){
                renderItems(i);
            })
            localStorage.setItem("items",JSON.stringify(response));
        },
        error:function(){
            console.log('Coudnt conect to source')
        }
    });
    
    $(document).on('click','.cartbtn',function(){
        var itemId = $(this).attr('data-item');
        addToCart(itemId)
    })

    $(document).on('click','.product-inc',function(){
        var itemId = $(this).attr('data-itemid');
        var qty = parseInt($(this).parent().find('.product-qty').text()) + 1; 
        $(this).parent().find('.product-qty').text(qty);
        addToCart(itemId)
        calculateTotal();
    })

    $(document).on('click','.product-dec',function(){
        var itemidd = $(this).attr('data-itemid');
        var qty = parseInt($(this).parent().find('.product-qty').text()) - 1; 
        $(this).parent().find('.product-qty').text(qty);
        if(qty < 1){
            removeItemFromCart(itemidd);
        }
        var cartitems = JSON.parse(localStorage.getItem('cartItems'));
        for(var i=0;i<cartitems.length;i++){
            if(cartitems[i].itemId == itemidd){
                cartitems[i].count --;
            }
        }
        localStorage.setItem('cartItems',JSON.stringify(cartitems));
        calculateTotal();
    })


    $(document).on('click','.removeFromCart',function(){
        var productId = $(this).attr('data-itemid'); 
        removeItemFromCart(productId);       
    })

    removeItemFromCart = function(productId){
        var cartitems = JSON.parse(localStorage.getItem('cartItems'));
        var newitemlist;
        for(var i=0;i<cartitems.length;i++){
            if(cartitems[i].itemId == productId){
                cartitems.splice(i,1);
            }
        }
        localStorage.setItem('cartItems',JSON.stringify(cartitems));
        window.location.reload();
        calculateTotal();
    }

    addToCart = function(item){
        var addItem = {itemId:item,count:1}         
        if(!ifitemExist(item)){
            cart.push(addItem);
        }        
        localStorage.setItem('cartItems',JSON.stringify(cart));   
        updateCarticon();   
    }

    ifitemExist = function(item){
        var exists = false;
        if(cart == null){
            exists = false;
        } else {
            for(var i=0;i<cart.length;i++){
                if(cart[i].itemId === item){
                    cart[i].count = cart[i].count + 1;
                    exists = true;
                }
            }    
        }
        return exists;
    }
    
    showCartItems = function(){
        var cartitems = JSON.parse(localStorage.getItem('cartItems'));
        var items = JSON.parse(localStorage.getItem('items'));
        for(item in items){
            for(cartitem in cartitems){
                if(items[item].id == cartitems[cartitem].itemId){
                    var price = items[item].price;
                    var discount = items[item].discount;
                    var total_price =items[item].price * discount / 100;
                    var final_price =  price - total_price; 
                    $('.cartItems').append('<div class="itemcard"><img src='+items[item].img_url+'><span class="itemname">'+items[item].name+'</span><span class="pricespec"><span class="discountprice">&#8377;'+final_price+'</span><span class="price">&#8377;'+price+'</span><span class="discount">'+discount+'% off</span></span><div class="product-controls"><span class="product-dec" data-itemid='+cartitems[cartitem].itemId+'><i class="fa fa-minus-circle"></i></span><span class="product-qty">'+cartitems[cartitem].count+'</span><span class="product-inc" data-itemid='+cartitems[cartitem].itemId+'><i class="fa fa-plus-circle"></i></span></div><span class="removeFromCart" data-itemid='+items[item].id+'>Remove</span></div></div>')
                }
            }
        }
    }
    showCartItems();

    calculateTotal = function(){
        $('.billdata table').empty();
        $('.totalBill').empty();
        var cartitems = JSON.parse(localStorage.getItem('cartItems'));
        var items = JSON.parse(localStorage.getItem('items'));
        var totalprice = 0;
        for(item in items){
            for(cartitem in cartitems){
                if(items[item].id == cartitems[cartitem].itemId){
                    var price = items[item].price;
                    var discount = items[item].discount;
                    var total_price =items[item].price * discount / 100;
                    var final_price =  price - total_price; 
                    totalprice += final_price * cartitems[cartitem].count;
                    $('.billdata table').append('<tr><td>'+items[item].name+'(X'+cartitems[cartitem].count+' Qty)</td><td>&#8377;'+final_price+'</td></tr>');
                }
            }
        }
        $('.totalBill').append('<span>Total Payable</span><span class="payable">&#8377;'+totalprice+'</span>');
    }
    calculateTotal();

    updateCarticon = function(){
        var cartCount = 0;
        var items = JSON.parse(localStorage.getItem('cartItems'));
        if(items){
            for(var i=0;i<items.length;i++){
                cartCount += items[i].count;
            }
        }
        $('.cartcount').text(cartCount);
        cart = JSON.parse(localStorage.getItem('cartItems'));
    }

    $('.sort_option').click(function(){
        $(this).parent().find('.active').removeClass('active');
        $(this).addClass('active');
        var sortby = $(this).attr('data-sort');
        sortItems(sortby);
    })

    $('.mobile-sort').click(function(){
        $('.modal-overlay,.messagePop').fadeIn();
    })

    $('.cancelsort').click(function(){
        $('.modal-overlay,.messagePop').fadeOut();
    })

    $('.applysort').click(function(){
        var sortby = document.querySelector('input[name="filter"]:checked').value;
        $('.modal-overlay,.messagePop').fadeOut();
        sortItems(sortby);
    })

    updateCarticon();

    sortItems = function(param){
        if(param == 'highlow'){
            var itemlist = $(".product-container");
            itemlist.sort(function(a, b){ return $(b).data("price")-$(a).data("price")});
            $(".itemsList").append(itemlist);
        }

        if(param == 'lowhigh'){
            var itemlist = $(".product-container");
            itemlist.sort(function(a, b){ return $(a).data("price")-$(b).data("price")});
            $(".itemsList").append(itemlist);
        }

        if(param == 'discount'){
            var itemlist = $(".product-container");
            itemlist.sort(function(a, b){ return $(a).data("discount")-$(b).data("discount")});
            $(".itemsList").append(itemlist);
        }
    }
});