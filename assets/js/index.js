//querySelector
const contenedorRemedios = document.querySelector("#containerRemedios");
const liquidacion = document.querySelector('#destacados');
const contenedorCarrito = document.querySelector('#contenedorCarrito');
const cart = document.querySelector('.offcanvas-body')
const btnVaciar = document.querySelector('#vaciarCarrito');
const comprar = document.querySelector('#comprar')
let carrito = [];
let cantidadTotaAPagar = 0;


const getData = async () => {
    await fetch("https://apipetshop.herokuapp.com/api/articulos")
        .then((res) => res.json())
        .then((json) => (data = json))
        .catch((error) => console.log(error));
    pintarLiquidacion(filtrarStock(data.response), liquidacion)
};

getData();


function filtrarStock(array) {
    let stockBajo = array.filter(item => item.stock <= 3);
    return stockBajo;
}

function pintarLiquidacion(array, contenedor) {
    array.forEach((item) => {
        let card = document.createElement("div");
        card.className = "card m-3";
        card.style.width = "20rem";
        card.style.height = "auto";
        card.innerHTML = `
            <img class="card-img" src="${item.imagen}" style="width: auto; height: 18rem" alt="Vans">
            <div class="card-img d-flex justify-content-end">
                <a href="#" class="card-link text-danger like">
                    <i class="fas fa-heart"></i>
                </a>
            </div>
            <div class="card-body d-flex flex-column justify-content-between" style="width: auto; height: auto">
                <h4 class="card-title">${item.nombre}</h4>
                <h6 class="card-subtitle mb-2 text-muted">Stock: ${item.stock}</h6>
            <div class="buy d-flex justify-content-between flex-column align-items-start">
            <div class="d-flex align-items-center justify-content-evenly w-100">
                <div class="price text-success d-flex"><h5 class="mt-4">$${item.precio}</h5></div>
                <button id="producto-${item._id}" class="btn mt-3 btnColor"> Agregar al carrito</button>
            </div>
            </div>
            </div>`;
        contenedor.appendChild(card);

        const btnComprar = document.querySelector(`#producto-${item._id}`);
        btnComprar.addEventListener('click', () => {
            agregarCompras(item._id, array);
        })
    });
}

function agregarCompras(nroId, array) {
    let nuevoObj;

    array.forEach((personaje) => {
        const { _id, nombre, precio, stock, imagen, tipo } = personaje;
        if (personaje._id === nroId) {
            nuevoObj = {
                id: _id,
                nombre: nombre,
                precio: precio,
                stock: stock,
                imagen: imagen,
                tipo: tipo,
                cantidad: 1
            };
        }
    });

    if (carrito.some(producto => producto.id === nuevoObj.id)) {
        const cantidadProducto = carrito.map(producto => {
            if (producto.id === nuevoObj.id) {
                let cantidad = producto.cantidad;
                let precio = producto.precio;
                if (!(producto.stock === producto.cantidad)) {
                    // precio += producto.precio
                    // cantidad++
                    // producto.cantidad = cantidad;
                    // producto.precio = precio;
                    return producto;
                } else {
                    return producto
                }
            } else {
                return producto;
            }
        })

        carrito = [...cantidadProducto];
    } else {
        carrito = [...carrito, nuevoObj];
    }

    pintarCarrito(carrito, contenedorCarrito)
    let carritoString = JSON.stringify(carrito)
    localStorage.setItem('carrito', carritoString);
}



function pintarCarrito(array, contenedor) {

    contenedor.innerHTML = "";
    array.forEach(ele => {
        let total = ele.cantidad * ele.precio;
        ele.total = total;
        let div = document.createElement('div');
        div.style.width = "20rem";
        div.style.height = "auto";
        div.classList.add('d-flex', 'justify-content-center')
        div.innerHTML = `
        <div class="card mb-3" style="max-width: 90%;">
            <div class="row g-0">
            <div class="col-md-4 d-flex justify-content-center align-items-center">
                <img src="${ele.imagen}" class="img-fluid rounded-start" style="width: auto; height: 10rem" alt="...">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <p class="card-title"><b>${ele.nombre}</b></p>
                    <p class="card-text"><small class="text-muted">Stock: </small><strong>${ele.stock}</strong></p>
                    <p class="card-text">Cantidad: ${ele.cantidad}</p>
                    <p class="card-text"><small class="text-muted">Precio: $${total}</small></p>

                <div class="d-flex justify-content-evenly">
                    <button id="mas-${ele.id}" type="button" style="width:2.5rem" class="btn btn-light">+</button>
                    <button id="menos-${ele.id}" style="width:2.5rem" class="btn btn-light">-</button>
                </div>
                </div>
                </div>
            </div>
        </div>
        `
        contenedor.appendChild(div);
        const btnSumar = document.querySelectorAll(`#mas-${ele.id}`);
        const btnResta = document.querySelectorAll(`#menos-${ele.id}`);
        btnSumar.forEach(boton => boton.addEventListener('click', () => {
            sumarCantidad(ele.id, ele.stock)
        }))

        btnResta.forEach( boton => boton.addEventListener('click', () => {
            restarCantidad(ele.id, ele.stock)
        }))
    })
}

btnVaciar.addEventListener('click', ()=>{
    contenedorCarrito.innerHTML = ''
    carrito = [];
    localStorage.clear()
})

document.addEventListener("DOMContentLoaded", ()=>{
    let carritoJSON = JSON.parse(localStorage.getItem("carrito")) || [];
    pintarCarrito(carritoJSON, contenedorCarrito)
})

function filtrarStock(array) {
    let stockBajo = array.filter(item => item.stock <= 3);
    return stockBajo;
}

function sumarCantidad(idProducto, stock){
    let carrito = JSON.parse(localStorage.getItem('carrito'));

    carrito = carrito.map( ele => {
            if(ele.id === idProducto && ele.cantidad < stock){
                ele.cantidad +=1;
                cantidadTotaAPagar += ele.total;
            }else{
                console.log('ya se agoto no hay mas!!!!');
            }
            return ele;
    })
    console.log(cantidadTotaAPagar)
    localStorage.setItem('carrito', JSON.stringify(carrito));
    pintarCarrito(carrito, contenedorCarrito);
}

function restarCantidad(idProducto, stock){
    let carrito = JSON.parse(localStorage.getItem('carrito'));

    carrito = carrito.map( ele => {
            if(ele.id === idProducto && ele.cantidad > 1){
                ele.cantidad -=1;
                cantidadTotaAPagar -= ele.total;

            }
            return ele;
    })
    localStorage.setItem('carrito', JSON.stringify(carrito));
    pintarCarrito(carrito, contenedorCarrito);
}

comprar.addEventListener('click', () => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn m-1',
            cancelButton: 'btn m-1'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: '??Quieres realizar la compra?',
        text: "Estas por comprar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Comprar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire(
            'Comprado!',
            'Su compra ha sido exitosa :)',
            'success',
            contenedorCarrito.innerHTML = ''
        )
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
            'Cancelado',
            'Su compra ha sido cancelada',
            'error'
            )
        }

    })
})




function cantidadTotal(){
    cantidadTotaAPagar = 0;
    carrito.forEach( producto => {
        cantidadTotaAPagar += producto.total
    })
}