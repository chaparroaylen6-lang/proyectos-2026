
   document.addEventListener("DOMContentLoaded", () => {
    const botonesAgregarAlCarrito = document.querySelectorAll(".add-to-cart, .agregar-carrito");
    const listaCarrito = document.getElementById("cart-list") || document.getElementById("lista-carrito") || document.getElementById("cartList") || document.getElementById("listaCarrito");
    const totalCarrito = document.getElementById("total") || document.getElementById("total-carrito") || document.getElementById("cart-total");
    
    const botonFinalizarCompra = document.getElementById("finalizar-compra") || document.getElementById("checkout");

    let productosAgregadosAlCarrito = [];

    const actualizarCarrito = () => {
        if (!listaCarrito || !totalCarrito) return;

        listaCarrito.innerHTML = "";
        let total = 0;

        productosAgregadosAlCarrito.forEach((producto, index) => {
            const item = document.createElement("li");
            item.textContent = `${producto.nombre} x${producto.cantidad} - $${(producto.precio * producto.cantidad).toFixed(2)} `;
            
            
            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.style.marginLeft = "10px"; 
            
            
            botonEliminar.addEventListener("click", () => {
                
                productosAgregadosAlCarrito.splice(index, 1);
                
                actualizarCarrito();
            });

            item.appendChild(botonEliminar);
            listaCarrito.appendChild(item);
            total += producto.precio * producto.cantidad;
        });

        totalCarrito.textContent = `${total.toFixed(2)}`;
    };

    botonesAgregarAlCarrito.forEach(boton => {
        boton.addEventListener("click", () => {
            const nombreDelProducto = boton.dataset.name || boton.dataset.nombre;
            const precioDelProducto = parseFloat(boton.dataset.price || boton.dataset.precio);

            if (!nombreDelProducto || Number.isNaN(precioDelProducto)) return;

            const productoExistente = productosAgregadosAlCarrito.find(producto => producto.nombre === nombreDelProducto);

            if (productoExistente) {
                productoExistente.cantidad++;
            } else {
                productosAgregadosAlCarrito.push({
                    nombre: nombreDelProducto,
                    precio: precioDelProducto,
                    cantidad: 1
                });
            }

            actualizarCarrito();
        });
    });

    if (botonFinalizarCompra) {
        botonFinalizarCompra.addEventListener("click", () => {
            if (productosAgregadosAlCarrito.length === 0) {
                alert("El carrito está vacío. Agrega productos antes de comprar.");
                return;
            }
            
            alert("¡Compra finalizada con éxito!");
            window.location.reload(); 
        });
    }
});