
    document.addEventListener("DOMContentLoaded", () => {
        const botonesAgregarAlCarrito = document.querySelectorAll(".add-to-cart, .agregar-carrito");
        const listaCarrito = document.getElementById("cart-list") || document.getElementById("lista-carrito") || document.getElementById("cartList") || document.getElementById("listaCarrito");
        const totalCarrito = document.getElementById("total") || document.getElementById("total-carrito") || document.getElementById("cart-total");

        let productosAgregadosAlCarrito = [];

        const actualizarCarrito = () => {
            if (!listaCarrito || !totalCarrito) return;

            listaCarrito.innerHTML = "";
            let total = 0;

            productosAgregadosAlCarrito.forEach(producto => {
                const item = document.createElement("li");
                item.textContent = `${producto.nombre} x${producto.cantidad} - $${(producto.precio * producto.cantidad).toFixed(2)}`;
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
    });
