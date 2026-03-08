/* EJECUTA EL DOM DE LA PÁGINA */
document.addEventListener("DOMContentLoaded", () => {
  /* SELECTORES */
  const contenedorProductos = document.querySelector("#contenedorProductos");
  const listaCarrito = document.querySelector("#listaCarrito");
  const totalCarrito = document.querySelector("#totalCarrito");
  const filtroCategoria = document.querySelector("#filtroCategoria");
  const botonAplicarFiltro = document.querySelector("#aplicarFiltro");
  const botonComprar = document.querySelector("#btnComprar");

  /* VARIABLES GLOBALES */
  const URL_API = "https://dummyjson.com/products";
  let productos = [];
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  /* FUNCIONES */

  // CARGAR PRODUCTOS DESDE LA API
  async function cargarProductos() {
    if (!contenedorProductos) return;

    // Mostrar mensaje mientras carga
    contenedorProductos.innerHTML = "<p>Cargando productos...</p>";

    try {
      const respuesta = await fetch(URL_API);
      const datos = await respuesta.json();
      productos = datos.products;
      mostrarProductos(productos);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
      console.error(error);
    }
  }

  // MOSTRAR PRODUCTOS EN PANTALLA
  function mostrarProductos(lista) {
    contenedorProductos.innerHTML = "";

    if (lista.length === 0) {
      contenedorProductos.innerHTML = "<p>No se encontraron productos</p>";
      return;
    }

    lista.forEach(function (producto) {
      const columna = document.createElement("div");
      columna.className = "col-md-4 mb-4";

      columna.innerHTML = `
        <div class="card h-100 animate__animated animate__fadeIn">
          <img src="${producto.thumbnail}" class="card-img-top" alt="${producto.title}">
          <div class="card-body">
            <h5>${producto.title}</h5>
            <p>Categoría: ${producto.category}</p>
            <p>Marca: ${producto.brand || "Sin marca"}</p>
            <p class="fw-bold">€${producto.price}</p>
            <button class="btn btn-primary w-100">Añadir al carrito</button>
          </div>
        </div>
      `;

      // AÑADIR PRODUCTO AL CARRITO
      columna.querySelector("button").onclick = function () {
        carrito.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carrito));

        Swal.fire({
          icon: "success",
          title: "Producto añadido",
          text: `${producto.title} se ha añadido al carrito`,
          timer: 1500,
          showConfirmButton: false,
        });

        mostrarCarrito();
      };

      contenedorProductos.appendChild(columna);
    });
  }

  // APLICAR FILTROS
  if (botonAplicarFiltro) {
    botonAplicarFiltro.onclick = function () {
      const tipoFiltro = filtroCategoria.value;
      let productosFiltrados = productos;

      if (tipoFiltro === "todas") {
        mostrarProductos(productos);
        return;
      }

      if (tipoFiltro === "Precio mínimo") {
        Swal.fire({
          title: "Introduce el precio mínimo",
          input: "number",
          inputPlaceholder: "Ej: 100",
          showCancelButton: true,
        }).then((resultado) => {
          if (!resultado.value) {
            mostrarProductos(productos);
            return;
          }
          const precioMinimo = Number(resultado.value);
          productosFiltrados = productos.filter((p) => p.price >= precioMinimo);
          mostrarProductos(productosFiltrados);
        });
        return;
      }

      if (tipoFiltro === "Categoría") {
        Swal.fire({
          title: "Introduce la categoría",
          input: "text",
          inputPlaceholder: "Ej: beauty, fragances, furniture, groceries",
          showCancelButton: true,
        }).then((resultado) => {
          if (!resultado.value) {
            mostrarProductos(productos);
            return;
          }
          const categoria = resultado.value.toLowerCase();
          productosFiltrados = productos.filter((p) =>
            p.category.toLowerCase().includes(categoria),
          );
          mostrarProductos(productosFiltrados);
        });
        return;
      }

      if (tipoFiltro === "Marca") {
        Swal.fire({
          title: "Introduce la marca",
          input: "text",
          inputPlaceholder:
            "Ej: Essence, Chic Cosmetics, Calvin Klein, Dior, Nail Couture, Chanel...  ",
          showCancelButton: true,
        }).then((resultado) => {
          if (!resultado.value) {
            mostrarProductos(productos);
            return;
          }
          const marca = resultado.value.toLowerCase();
          productosFiltrados = productos.filter(
            (p) => p.brand && p.brand.toLowerCase().includes(marca),
          );
          mostrarProductos(productosFiltrados);
        });
        return;
      }
    };
  }

  // MOSTRAR CARRITO
  function mostrarCarrito() {
    if (!listaCarrito) return;

    listaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach(function (producto, indice) {
      total += producto.price;

      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex align-items-center justify-content-between";

      const imagen = document.createElement("img");
      imagen.src = producto.thumbnail;
      imagen.alt = producto.title;
      imagen.style.height = "50px";
      imagen.style.marginRight = "10px";

      const contenedorTexto = document.createElement("div");
      contenedorTexto.style.flex = "1";
      contenedorTexto.innerHTML = `<strong>${producto.title}</strong><br>€${producto.price}`;

      const botonEliminar = document.createElement("button");
      botonEliminar.className = "btn btn-sm btn-danger ms-2";
      botonEliminar.textContent = "Eliminar";
      botonEliminar.onclick = function () {
        carrito.splice(indice, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
      };

      li.appendChild(imagen);
      li.appendChild(contenedorTexto);
      li.appendChild(botonEliminar);

      listaCarrito.appendChild(li);
    });

    totalCarrito.textContent = total.toFixed(2);
  }

  // COMPRAR
  if (botonComprar) {
    mostrarCarrito();

    botonComprar.onclick = function () {
      if (carrito.length === 0) {
        Swal.fire("Carrito vacío", "No tienes productos en el carrito", "info");
        return;
      }

      Swal.fire({
        title: "Confirmar compra",
        text:
          "Vas a realizar una compra por valor de €" +
          totalCarrito.textContent +
          ". ¿Estás seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      }).then(function (resultado) {
        if (resultado.isConfirmed) {
          carrito = [];
          localStorage.removeItem("carrito");
          mostrarCarrito();
          Swal.fire("Compra realizada", "Gracias por tu compra", "success");
        }
      });
    };
  }

  /* INICIO */
  mostrarCarrito();
  cargarProductos();
});
