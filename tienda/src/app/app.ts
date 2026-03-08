import { Component, signal, computed, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  titulo = signal('Tienda Angular');

  productos: any[] = [];
  productosFiltrados: any[] = [];

  categorias: { etiqueta: string, valor: string }[] = [
    { etiqueta: 'Belleza', valor: 'beauty' },

    { etiqueta: 'Fragancias', valor: 'fragrances' },
    { etiqueta: 'Muebles', valor: 'furniture' },
    { etiqueta: 'Comestibles', valor: 'groceries' }
  ];

  categoriaSeleccionada: string = 'all';
  marcaSeleccionada: string = '';
  precioMinimo: number | null = null;

  carrito = signal<any[]>([]);
  cantidadCarrito = computed(() => this.carrito().length); 
  
  mostrarModalCarrito: boolean = false;

  ngOnInit() {
    fetch('https://dummyjson.com/products')
      .then(respuesta => respuesta.json())
      .then(datos => {
        this.productos = datos.products;
        this.productosFiltrados = [...this.productos];
      });
  }

  aplicarFiltro() {
    this.productosFiltrados = this.productos.filter(p => {
      const porCategoria = this.categoriaSeleccionada === 'all' || p.category === this.categoriaSeleccionada;
      const porMarca = !this.marcaSeleccionada || p.brand?.toLowerCase().includes(this.marcaSeleccionada.toLowerCase());
      const porPrecio = !this.precioMinimo || p.price >= this.precioMinimo;
      
      return porCategoria && porMarca && porPrecio;
    });
  }

  agregarAlCarrito(producto: any) {
    this.carrito.update(articulos => [...articulos, producto]);

    Swal.fire({
      icon: 'success',
      title: 'Producto añadido',
      text: `${producto.title} añadido al carrito`,
      timer: 1200,
      showConfirmButton: false
    });
  }

  eliminarDelCarrito(articulo: any) {
    this.carrito.update(articulos => {
      const indice = articulos.indexOf(articulo);
      if (indice > -1) {
        const nuevosArticulos = [...articulos];
        nuevosArticulos.splice(indice, 1);
        return nuevosArticulos;
      }
      return articulos;
    });
  }

  verCarrito() {
    this.mostrarModalCarrito = true;
  }

  cerrarCarrito() {
    this.mostrarModalCarrito = false;
  }

  procesarCompra() {
    const carritoActual = this.carrito();
    const totalBruto = carritoActual.reduce((suma, articulo) => suma + articulo.price, 0);
    const total = totalBruto.toFixed(2);

    this.mostrarModalCarrito = false;

    setTimeout(() => {
      Swal.fire({
        icon: 'question',
        title: 'Confirmar compra',
        text: `Vas a realizar una compra por $${total}. ¿Estás seguro?`,
        showCancelButton: true,
        confirmButtonText: 'Sí, comprar',
        cancelButtonText: 'Cancelar'
      }).then(resultado => {
        if (resultado.isConfirmed) {
          this.carrito.set([]);

          Swal.fire({
            icon: 'success',
            title: 'Gracias por tu compra',
            text: `Has pagado un total de $${total}`
          });
        }
      });
    }, 150);
  }
}