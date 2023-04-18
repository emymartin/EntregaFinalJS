/*Este programa simula un eshop que implementare en mi web de teclados Angry Keys (https://angrykeys.netlify.app/)
El proyecto utiliza bootstrap, sweetalert, toastify, API rapidapi para hacer el cambio de moneda actualizado.
ofresco una serie de teclados a la venta, el usuario puede agregar al carrito cada item, seleccionar cantidades, eliminar items del carrito
y saber en todo momento cual es el total, puede finalizar la compra y recibirá un mensaje dando las gracias por su compra.*/


// Array con los datos de las tarjetas
const productos = [
  {
    title: "Nuphy Air 75%",
    image: "../images/nuphy.png",
    price: "U$S 74.90"
  },
  {
    title: "ZSA Moonlander",
    image: "../images/zsa.png",
    price: "U$S 120"
  },
  {
    title: "MIIW BlackIO 83",
    image: "../images/black.png",
    price: "U$S 25.50"
  },
  {
    title: "Melgeek Mojo 84",
    image: "../images/melgeek.png",
    price: "U$S 100"
  },
  {
    title: "Tofu60 Sushi",
    image: "../images/tofu60sushi.png",
    price: "U$S 75.50"
  },
  {
    title: "Space65 Cyber",
    image: "../images/space65.png",
    price: "U$S 35.99"
  }
];

//Conexión a la API para la conversión de moneda
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'a807055ccbmsh37a4c617ca94225p1b0125jsn24f2c2ead79b',
		'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
	}
};

let conversion;

fetch('https://currency-exchange.p.rapidapi.com/exchange?from=USD&to=ARS&q=1.0', options)
	.then(response => response.json())
	.then(data => {
    conversion = data;
    actualizarTotalDelCarrito();
    console.log(conversion);
  })
	.catch(err => console.error(err));

// Dividir los datos del array en dos
const primerLinea = productos.slice(0, 3);
const segundaLinea = productos.slice(3, 6);

// Función para crear la estructura HTML de la tarjeta tomando la estructura de bootstrap
function crearTarjeta(item) {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("col-12", "col-md", "mb-4", "item-card");  
  const estructuraTarjeta = `
    <div class="item shadow">
      <h3 class="item-title">${item.title}</h3>
      <img class="item-image" src="${item.image}">
      <div class="item-details">
        <h4 class="item-price">${item.price}</h4>
        <button class="item-button btn btn-outline-warning addToCart">AÑADIR AL CARRITO</button>
      </div>
    </div>
  `;
  
  tarjeta.innerHTML = estructuraTarjeta;
  return tarjeta;
}

// Función para agregar las tarjetas al HTML
function pintarTarjeta() {
  const primerLineaItems = document.getElementById("primerLineaItems");
  const segundaLineaItems = document.getElementById("segundaLineaItems");
  
  primerLinea.forEach(item => {
    const tarjeta = crearTarjeta(item);
    primerLineaItems.appendChild(tarjeta);
  });
  
  segundaLinea.forEach(item => {
    const tarjeta = crearTarjeta(item);
    segundaLineaItems.appendChild(tarjeta);
  });
}

// Llamada a la función para pintar las tarjetas en el HTML
pintarTarjeta();

// Añadimos el event listener para los botones de Añadir al carrito del evento click
const botonAgregarAlCarrito = document.querySelectorAll('.addToCart');
botonAgregarAlCarrito.forEach((botonClickeado) => {
  botonClickeado.addEventListener('click', agregarAlCarritoClickeado);
});

//Añadimos el event listener para el boton de Comprar para el evento click
const comprarButton = document.querySelector('.comprarButton');
comprarButton.addEventListener('click', comprarButtonClicked);

const vaciarButton = document.querySelector('.vaciarButton');
vaciarButton.addEventListener('click', vaciarButtonClicked);

const contenedorItemsCarrito = document.querySelector('.contenedorItemsCarrito');

// Función para capturar el evento mas cercano con la clase item y desglosamos titulo, precio e imagen, guardo en variables y creo nueva función
function agregarAlCarritoClickeado(event) {
    const boton = event.target;
    const item = boton.closest('.item');
  
    const itemTitle = item.querySelector('.item-title').textContent;
    const itemPrice = item.querySelector('.item-price').textContent;
    const itemImage = item.querySelector('.item-image').src;


  // Obtener el array de artículos del LocalStorage o crear uno nuevo si no existe.
  let items = JSON.parse(localStorage.getItem('items')) || [];

  // Buscar si el artículo ya existe en el array de artículos del LocalStorage.
  const index = items.findIndex(item => item.title === itemTitle);

  if (index === -1) {
    // Si el artículo no existe en el array, agregarlo.
    const datosProd = {
      title: itemTitle,
      price: itemPrice,
      image: itemImage,
      cantidad: 1
    };
    items.push(datosProd);
    agregarItemAlCarrito(itemTitle, itemPrice, itemImage);
  } else {
    // Si el artículo ya existe en el array, actualizar su cantidad.
    items[index].cantidad++;
  }

  // Guardar el array en el LocalStorage como una cadena JSON.
  localStorage.setItem('items', JSON.stringify(items));
  actualizarCantidadesDelCarrito();
  actualizarTotalDelCarrito();
}
    
  //Funcion para actualizar las cantidades del carrito tomandolas del localstorage
  function actualizarCantidadesDelCarrito() {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    const shoppingCartItems = contenedorItemsCarrito.getElementsByClassName('shoppingCartItem');
  
    for (let i = 0; i < shoppingCartItems.length; i++) {
      const shoppingCartItemTitle = shoppingCartItems[i].querySelector('.shoppingCartItemTitle');
      const title = shoppingCartItemTitle.textContent;
  
      const item = items.find(item => item.title === title);
  
      if (item) {
        const shoppingCartItemQuantity = shoppingCartItems[i].querySelector('.shoppingCartItemQuantity');
        shoppingCartItemQuantity.value = item.cantidad;
      }
    }
    actualizarTotalDelCarrito();
  }

  window.onload = function() {
    actualizarTotalDelCarrito(); // Llamamos a la función para actualizar el total de compra cada vez que se carga la pestaña
    actualizarCantidadesDelCarrito(); // Llamamos a la función para actualizar las cantidades cada vez que se carga la pestaña
  }


  // Función para que al darle añadir al carrito muestre en el carrito los datos que estrajimos anteriormente (itemTitle, itemPrice e ItemImage)
  function agregarItemAlCarrito(itemTitle, itemPrice, itemImage) {
    //Con el for y el if validamos para no duplicar los productos para que cuando seleccionemos varias veces el mismo item incremente la cantidad y no sume filas con el mismo producto
    const elementsTitle = contenedorItemsCarrito.getElementsByClassName('shoppingCartItemTitle');
    for (let i = 0; i < elementsTitle.length; i++){
      if (elementsTitle[i].innerText === itemTitle){
        let cantidadElementos = elementsTitle[i].parentElement.parentElement.parentElement.querySelector('.shoppingCartItemQuantity');
        cantidadElementos.value++;         
        actualizarTotalDelCarrito();
        return;
      }
      
    }
    // Se crea un nuevo elemento HTML div con el contenido del artículo del carrito de compras, lo agrega a la lista de elementos del carrito y lo muestra en la página.
    const FiladelItemCarrito = document.createElement('div')
    const contenidoDelCarrito = `
      <div class="row shoppingCartItem">
            <div class="col-6">
                <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                    <img src=${itemImage} class="shopping-cart-image">
                    <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${itemTitle}</h6>
                </div>
            </div>
            <div class="col-2">
                <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                    <p class="item-price mb-0 shoppingCartItemPrice">${itemPrice}</p>
                </div>
            </div>
            <div class="col-4">
                <div class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                    <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number" value="1">
                    <button class="btn btn-danger buttonDelete" type="button">X</button>
                </div>
            </div>
        </div>`;    
        FiladelItemCarrito.innerHTML = contenidoDelCarrito
        contenedorItemsCarrito.append(FiladelItemCarrito);

        //alerta que aparece arriba a la derecha cada vez que agregamos un item al carrito
        Toastify({
          text: "Item Agregado al carrito",
          className: "warning",            
          duration: 2000 
        }).showToast();

        //escuchamos el evento click para remover items del DOM
        FiladelItemCarrito
          .querySelector('.buttonDelete')
          .addEventListener('click', removerItemDelCarrito);
          
        //escuchamos el evento change para saber si incrementaron las cantidades.
        FiladelItemCarrito
          .querySelector('.shoppingCartItemQuantity')
          .addEventListener('change', cambioCantidad); 

        actualizarTotalDelCarrito();
      }

  //Función para actualizar el total, tomando el precio de cada item y la cantidad de veces que aparece en el carrito. Luego informa el total con 2 decimales.
  function actualizarTotalDelCarrito (){
    let total = 0;
    let totalArs = 0;

    const totalDelCarro = document.querySelector('.totalDelCarro'); //total en USD
    const totalPesos = document.querySelector('.totalPesos'); // total en ARS
    const totalConImpuestos = document.querySelector('.totalConImpuestos'); // total con impuestos


    // Recupera el carrito del usuario del localStorage
    const carritoUsuario = JSON.parse(localStorage.getItem('carritoUsuario')) || {};

    const itemsDelCarrito = document.querySelectorAll('.shoppingCartItem');
    
    itemsDelCarrito.forEach(itemsDelCarrito => {
      
      //Busca y selecciona el elemento que representa el precio del item en el carrito y lo almacena para usarlo mas abajo.
      const shoppingCartItemPriceElemento = itemsDelCarrito.querySelector('.shoppingCartItemPrice');
      
      //Se extrae el precio de un elemento, se elimina el signo de dólar y convierte el precio en un número para poder utilizarlo en operaciones matematicas.
      const shoppingCartItemPrice = Number(shoppingCartItemPriceElemento.textContent.replace('U$S', ''));
      
      //Busca y toma la cantidad de un articulo del carrito y lo almacena para calcular el total mas abajo.
      const shoppingCartItemQuantityElemento = itemsDelCarrito.querySelector('.shoppingCartItemQuantity');

      // Se toma la cantidad y se la guarda para utilizarla en el calculo total
      const shoppingCartItemQuantity = Number (shoppingCartItemQuantityElemento.value);

      // Actualiza el carrito del usuario en el localStorage
      const itemId = itemsDelCarrito.getAttribute('data-id');
      const itemQuantity = shoppingCartItemQuantityElemento.value;
      carritoUsuario[itemId] = itemQuantity;
      localStorage.setItem('carritoUsuario', JSON.stringify(carritoUsuario));
      
      //Calculo del costo total de los articulos seleccionados en el carrito sumando el costo de cada articulo multiplicado por la cantidad seleccionada
      //y lo guarda en la variable total
      total = total + shoppingCartItemPrice * shoppingCartItemQuantity;

    });

    // Realiza la conversión de dólares a pesos argentinos y guarda el resultado en la variable totalArs
    totalArs = (total * conversion).toFixed(2);

    // Calcula el total con impuestos
    const totalConImpuestosValor = (totalArs * 1.75).toFixed(2);

    // Muestra el total de la compra en dólares
    totalDelCarro.innerHTML = `U$S ${total.toFixed(2)}`;

    // Muestra el total de la compra en pesos argentinos
    totalPesos.innerHTML = `Conversión a $ ${totalArs}`;

    // Muestra el total de la compra con impuestos
    totalConImpuestos.innerHTML = `Total + Impuestos $ ${totalConImpuestosValor}`;
}


  //Funcion para eliminar items del carrito
  function removerItemDelCarrito (event){
    const buttonClicked = event.target;
    const itemRemoved = buttonClicked.closest('.shoppingCartItem');
    const itemRemovedTitle = itemRemoved.querySelector('.shoppingCartItemTitle').textContent;
    
    itemRemoved.remove();
    
    // Obtener el array de artículos del LocalStorage.
    let items = JSON.parse(localStorage.getItem('items'));

    // Buscar y eliminar el artículo del array de artículos del LocalStorage.
    items = items.filter(item => item.title !== itemRemovedTitle);

    // Guardar el nuevo array en el LocalStorage.
    localStorage.setItem('items', JSON.stringify(items));

    actualizarTotalDelCarrito();
}

  // Funcion para seleccionar la cantidad desde el carrito y que no pueda ser 0 o valor negativo.  
  function cambioCantidad(event){
    const input = event.target;
    //validacion con operador ternario
    input.value <= 0 ? (input.value = 1) : null;
    
    
    const item = input.closest('.shoppingCartItem');
    const itemTitle = item.querySelector('.shoppingCartItemTitle').textContent;

    let items = JSON.parse(localStorage.getItem('items'));

    const index = items.findIndex(item => item.title === itemTitle);

    if (index !== -1) {
      items[index].cantidad = parseInt(input.value);
      localStorage.setItem('items', JSON.stringify(items));
    }
    actualizarTotalDelCarrito();
  }

  //Función para que el boton comprar y valide si el carrito tiene algo
  function comprarButtonClicked() {
    const itemsDelCarrito = document.querySelectorAll('.shoppingCartItem');
    if (itemsDelCarrito.length === 0){
      Swal.fire(
        'Carrito Vacío',
        'Por favor seleccione que items desea comprar para continuar la compra',
        'error'
      )
      return;
    }
    Swal.fire(
      'Compra Realizada',
      'Su compra está siendo preparada para ser enviada.',
      'success'
    )
    contenedorItemsCarrito.innerHTML = '';
    actualizarTotalDelCarrito();
    localStorage.clear()
  }

  //Función para que el boton vaciar carrito limpie todo los items
  function vaciarButtonClicked() {
    const itemsDelCarrito = document.querySelectorAll('.shoppingCartItem');
    if (itemsDelCarrito.length === 0){
      Swal.fire(
        'Carrito Vacío',
        'No hay nada que eliminar',
        'error'
      )
      return;
    }
    Swal.fire(
      'Carrito Eliminado',
      'Todos los items del carrito se han eliminado.',
      'warning'
    )
    contenedorItemsCarrito.innerHTML = '';
    actualizarTotalDelCarrito();
    localStorage.clear()
  }

  // Obtener los datos del localStorage y agregarlos al carrito de compras
const items = JSON.parse(localStorage.getItem('items')) || [];
for (const item of items) {
  agregarItemAlCarrito(item.title, item.price, item.image);
}

// Actualizar el total del carrito de compras
actualizarTotalDelCarrito();



