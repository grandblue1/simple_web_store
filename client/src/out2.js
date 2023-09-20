function getRandomArbitrary(min, max) {
    return Math.round((Math.random() * (max - min) + min));
}
const image = document.getElementById('image')
const form = document.getElementById('cardForm')


image.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData);
    fetch('/user/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('imagePreview').src = data.url;
            document.getElementById('imagePreview').style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
})

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    let id = 0;
    const image = document.getElementById('imagePreview');
    const cost_ = document.getElementById('cost').value;
    const name_  = document.getElementById('name').value;
    const description_ = document.getElementById('description').value;

    if(image.src && cost_ && name_ && description_) {
            const formData = {
                 name: name_,
                 cost: cost_,
                 image_url: image.src,
                 description: description_
             }


             await fetch('/user/newProduct' , {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(formData)
             }).then(response => response.json()).then(data => id = data.id).then(err => console.log(err));
            createCard(id,image.src,cost_,name_,description_);
            form.reset();
            image.src = '';
            image.style.display = 'none';
        $('#btn-close').click()
    }
})
const createCard = (id, imageURL,  cost  ,name, description) => {
    const cardContainer = document.createElement('span')
    cardContainer.classList.add("row")

    cardContainer.innerHTML = `
    
        <img src=${imageURL} alt="imagePreview">
      <div class="product-text">
        
        <h5>#${id}</h5>
      </div>
      
      <div class="price">
        <h4 class="text-muted name">${name}</h4>
        
        <p>${cost} грн</p>
      </div>
        <div > 
            <button type="submit" class="btn btn-secondary addToCart" onclick="toCart(${id})" >Add to Cart</button>
        </div>
`;
    document.querySelector(".products").appendChild(cardContainer);
}

fetch('/user/storeCart', {
    method: 'GET'
}).then(response => response.json())
    .then(data => {
        data.forEach(p => createCard(p.id, p.image_url, p.cost, p.name , p.description))
    })


const fillCart = async () => {
    const userID = localStorage.getItem('userID')
    await fetch('/user/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            userID: userID
        })
    }).then(res => res.json())
        .then(data => {
            let total_cost = 0
            for (let i = 0; i < data.productInfo.length; i++) {
                const data_i = {}

                data_i.productInfo = data.productInfo[i]
                data_i.cartItem = data.cartItem[i];
                total_cost += Number(data_i.productInfo.cost)
                createCart(data_i);

            }
            localStorage.setItem('totalCost', total_cost)
            localStorage.setItem('countItems', data.cartItem.length)
            document.getElementById('cart-items-number').innerText = data.cartItem.length
            document.querySelector(".totalCost").innerText = `${total_cost} грн`
            document.querySelector(".totalCostWithShipping").innerText = `${total_cost - 200} грн`
            document.querySelector("#lblCartCount").innerText = data.cartItem.length
        })
}

fillCart()

const toCart = async (productID) => {
    const user_id = localStorage.getItem('userID')


    if(!user_id || !productID ) {
        console.error('Product not found')
    }
    await fetch('/user/cart', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userID: user_id,
            productID: productID
        })
    }).then(response => response.json())
        .then(data => {

            if(data.productInfo && data.cartItem){
                createCart(data);

                let coun = Number(localStorage.getItem('countItems'))
                let totalCost = Number(localStorage.getItem('totalCost'))
                coun += 1
                totalCost += Number(data.productInfo.cost)

                localStorage.setItem('countItems', coun)
                localStorage.setItem('totalCost', totalCost)

                document.getElementById("cart-items-number").innerText = coun
                document.querySelector(".totalCost").innerText = totalCost
                document.querySelector(".totalCostWithShipping").innerText = `${totalCost - 200} грн`
                if(totalCost === 0) {document.querySelector(".totalCostWithShipping").innerText = 0}

            }
            else if(!data.productInfo) {
                console.log(data)
                const quantity = data.cartItem.quantity
                console.log(quantity)

                document.getElementById(data.cartItem.product_id).innerText = quantity;
                document.querySelector(`.crt_${data.cartItem.product_id}`).innerText = quantity;
            }
            else {
                console.log("Bad Request Product")
            }

        })
    let lblCartCount = Number(document.querySelector("#lblCartCount").innerText);
    lblCartCount += 1
    document.getElementById('lblCartCount').innerText = lblCartCount;
}

const remove = async (userID, productID, event) => {
    await fetch('/user/cart', {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userID: userID,
            productID: productID
        })
    })
    event.closest('table').remove()
    document.getElementById(`#${productID}`).remove()
    let i = localStorage.setItem('countItems',Number(localStorage.getItem('countItems') - 1))
    document.getElementById('cart-items-number').innerText = Number(localStorage.getItem('countItems'))

    let lblCartCount = Number(document.querySelector("#lblCartCount").innerText);
    lblCartCount -= 1
    document.getElementById('lblCartCount').innerText = lblCartCount;
}
const removeCheckout = async (userID, productID, event) => {
    await fetch('/user/cart', {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userID: userID,
            productID: productID
        })
    })
    event.closest('span').remove()
    document.getElementById(`#${productID}`).remove()
    let i = localStorage.setItem('countItems',Number(localStorage.getItem('countItems') - 1))
    document.getElementById('cart-items-number').innerText = Number(localStorage.getItem('countItems'))

    let lblCartCount = Number(document.querySelector("#lblCartCount").innerText);
    lblCartCount -= 1
    document.getElementById('lblCartCount').innerText = lblCartCount;
}
const plus = async (productID_,event) => {
    await fetch('/user/plus', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            productID: productID_
        })
    }).then(response  => response.json())
        .then(data => {
            document.getElementById(productID_).innerText = data.quantity
            document.querySelector(`.crt_${productID_}`).innerText = data.quantity
        })

}
const minus = async (productID_,event) => {
    await fetch('/user/minus', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productID: productID_
        })
    }).then(response  => response.json())
        .then(data => {
            document.getElementById(productID_).innerText = data.quantity
            document.querySelector(`.crt_${productID_}`).innerText = data.quantity
        })
}

const createCart = (data) => {
    const cart = document.querySelector('.shopping_cart')
    const table = document.createElement('table');

    table.classList.add('cartTable', 'table')
    table.id = `#${data.cartItem.product_id}`;

    table.innerHTML = `<thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <!-- Sample Cart Items -->
                <tr>
                  <td id="${data.productInfo.id}"><span>${data.cartItem.quantity}</span></td>
                  <td>
                    <img src=${data.productInfo.image_url} alt="Product Image" class="img-thumbnail" style="max-width: 50px;">
                    ${data.productInfo.name}
                  </td>
                  <td>${data.productInfo.cost}</td>
                  <td>
                    <button class="btn btn-sm btn-primary" onclick="plus(${data.productInfo.id},this)">+</button>
    
                    <button class="btn btn-sm btn-danger" onclick="minus(${data.productInfo.id},this)">-</button>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-danger" onclick="remove(${data.cartItem.user_id},${data.productInfo.id},this)">Remove</button>
                  </td>
                </tr>
                <!-- Additional Cart Items Go Here -->
                </tbody>`
    cart.appendChild(table);

    const checkout = document.querySelector(".checkout_items")
    const checkout_div = document.createElement("div")
    checkout_div.id = `#${data.cartItem.product_id}`;
    checkout_div.innerHTML = `
                              <span class="card mb-3">
                              <div class="card-body">
                              <div class="d-flex justify-content-between">
                                <div class="d-flex flex-row align-items-center">
                                  <div>
                                    <img
                                            src="${data.productInfo.image_url}"
                                            class="img-fluid rounded-3" alt="Shopping item" style="width: 65px;">
                                  </div>
                                  <div class="ms-3">
                                    <h5>${data.productInfo.name} </h5>
                                    
                                  </div>
                                </div>
                                <div class="d-flex flex-row align-items-center">
                                  <div style="width: 50px;">
                                    <h5 class="fw-normal mb-0 crt_${data.productInfo.id}">${data.cartItem.quantity}</h5>
                                  </div>
                                  <div style="width: 80px;">
                                    <h5 class="mb-0">${data.productInfo.cost}грн</h5>
                                  </div>
                                  <a href="#!" style="color: #cecece;" onclick="removeCheckout(${data.cartItem.user_id},${data.productInfo.id},this)"><i class="fas fa-trash-alt"></i></a>
                                </div>
                              </div>
                            </div>
                            </span>
                            `
    checkout.appendChild(checkout_div)
}
