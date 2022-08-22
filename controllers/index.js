var productList = [];
var cartProductList = [];

function getEle(id) {
  return document.getElementById(id);
}

function getListProduct() {
  //pending
  getEle("loading").style.display = "block";

  axios({
    url: "https://62bc4dcbeff39ad5ee223a09.mockapi.io/api/Products",
    method: "GET",
  })
    .then((res) => {
      productList = res.data;
      renderProducts(productList);
      getEle("loading").style.display = "none";
    })
    .catch((err) => console.log(err));
}

getListProduct();

function renderProducts(data) {
  var contentHTML = "";

  for (var i = 0; i < data.length; i++) {
    contentHTML += `
          <tr>
              <td>${i + 1}</td>
              <td>${data[i].name}</td>
              <td>${data[i].price}</td>
              <td>${data[i].screen}</td>
              <td>${data[i].backCamera}</td>
              <td>${data[i].frontCamera}</td>
              <td>
                  <img width="50px" src="${data[i].img}" alt="${
      data[i].name
    }" />
              </td>
              <td>${data[i].desc}</td>
              <td>${data[i].type}</td>
              <td>
                  <button onclick="addCart(${
                    data[i].id
                  })" class="btn btn-info">Thêm vào giỏ</button>
              </td>
          </tr>
      `;
  }

  getEle("tblDanhSachSP").innerHTML = contentHTML;
}

function searchPhone() {
  var keyword = document
    .getElementById("inputSearch")
    .value.toLowerCase()
    .trim();
  const result = productList.filter((item) => {
    return item.name.toLowerCase().trim().includes(keyword);
  });
  renderProducts(result);
}

function filterPhone() {
  var keyword = document.getElementById("filter").value.toLowerCase();
  if (keyword === "all") return renderProducts(productList);
  const result = productList.filter((item) => {
    return item.type.toLowerCase() === keyword;
  });
  renderProducts(result);
  // console.log(result);
}

function findById(id) {
  const index = productList.findIndex((cartItem) => {
    return cartItem.id == id;
  });
  return index;
}


function findByIdCart(id) {
  const index = cartProductList.findIndex((cartItem) => {
    return cartItem.product.id == id;
  });
  return index
}

function renderCartProductList() {
  getLocal();
  let renderHTML = "";

  for (var i = 0; i < cartProductList.length; i++) {
    renderHTML += `
    <tr>
    <td>${i+1}</td>
    <td>${cartProductList[i].product.name}</td>
    <td style="width:15%">
      <img style='width:100%' src="${cartProductList[i].product.img}"/>
    </td>
    <td>${cartProductList[i].product.price}</td>
    <td>
      <input type='number' id='inputQuantity' onchange="handleChangeQuantity(${cartProductList[i].product.id})" value='${cartProductList[i].quantity}'/>
    </td>
    <td>
      <button class="btn btn-danger" onclick="deleteProductCart()">Xoá</button>
    </td>   
  </tr>
    `;
  }
  document.getElementById("cartItem").innerHTML = renderHTML;
  calcTotal();
  // document.getElementById("totalPrice").innerHTML = cartListProduct.reduce(
  //   (ac, cr) => {
  //     return (ac += cr.price * cr.quantity);
  //   },
  //   0
  // );
}

function getLocal() {
  let JSONCartLocal = localStorage.getItem("cartProductList");

  if (JSONCartLocal == null) return;

  cartProductList = JSON.parse(JSONCartLocal);
}

function saveLocal() {
  let JSONcart = JSON.stringify(cartProductList);

  localStorage.setItem("cartProductList", JSONcart);
}

function addCart(cartPr) {
  let index = findById(cartPr);
  let indexCart = findByIdCart(cartPr);

  console.log(indexCart)
  if (index == -1) {
    alert("ID invalid!!!");
  } else {
    if (cartProductList.length > 0) {
      if(indexCart == -1) {
        let newCartItem = new CartItem(productList[index], 1);
        cartProductList.push(newCartItem);
      }
      else {
        cartProductList[indexCart].quantity += 1;
      }
    } else {
      let newCartItem = new CartItem(productList[index], 1);
      cartProductList.push(newCartItem);
    }
  }

  if (index !== -1) {
    cartProductList[index].quantity = ++cartProductList[index].quantity;
  } else {
    cartProductList.push({ ...cartPr, quantity: 1 });
  }
  saveLocal();
  renderCartProductList();
  console.log(cartProductList);
}

function handleChangeQuantity(id) {
  let index = findByIdCart(id);
  if(index == -1) {
    alert('ID invalid!!')
  } else {
    cartProductList[index].quantity = document.getElementById('inputQuantity').value;
  }
  calcTotal();
}

function calcTotal() {
  let total = 0;
  for(let i = 0; i < cartProductList.length; i++) {
    total += cartProductList[i].product.price * cartProductList[i].quantity;
  }
  document.getElementById('totalCart').innerHTML = `$${total}`;
  console.log(total);
}

function deleteProductCart(id) {
  let index = findById(id);
  cartProductList.splice(index, 1)
  saveLocal();
  renderCartProductList();
}