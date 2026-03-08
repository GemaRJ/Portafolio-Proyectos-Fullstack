class Producto:
    def __init__(self, nombre, precio):
        self._nombre = nombre
        self._precio = precio

    def get_precio(self): return self._precio
    def get_nombre(self): return self._nombre

    def mostrar_info(self):
        print(f"- {self._nombre}: {self._precio:.2f}€")

class Bebida(Producto):
    def __init__(self, nombre, precio, tipo):
        super().__init__(nombre, precio)
        self._tipo = tipo
    def mostrar_info(self):
        print(f"- [Bebida] {self._nombre} ({self._tipo}): {self._precio:.2f}€")

class Comida(Producto):
    def __init__(self, nombre, precio, caliente):
        super().__init__(nombre, precio)
        self._caliente = caliente
    def mostrar_info(self):
        est = "Caliente" if self._caliente else "Frío"
        print(f"- [Comida] {self._nombre} ({est}): {self._precio:.2f}€")

class Pedido:
    def __init__(self):
        self._productos = []
        self._total = 0.0

    def agregar(self, p):
        self._productos.append(p)
        self._total += p.get_precio()
        print(f"Agregado: {p.get_nombre()}")

    def mostrar_ticket(self):
        print("\n--- TICKET FINAL ---")
        for p in self._productos: p.mostrar_info()
        print(f"TOTAL: {self._total:.2f}€\n")

def menu_interactivo():
    # Catálogo de productos disponibles
    catalogo = [
        Bebida("Café Solo", 1.20, "Caliente"),
        Bebida("Zumo Naranja", 2.50, "Frío"),
        Comida("Tostada", 2.00, True),
        Comida("Donut", 1.50, False)
    ]
    
    nuevo_pedido = Pedido()
    
    while True:
        print("\n--- SISTEMA CAFETERÍA ---")
        for i, p in enumerate(catalogo):
            print(f"{i+1}. {p.get_nombre()} ({p.get_precio()}€)")
        print(f"{len(catalogo)+1}. Ver Ticket y Salir")
        
        try:
            op = int(input("Seleccione producto: "))
            if op == len(catalogo) + 1:
                nuevo_pedido.mostrar_ticket()
                break
            elif 1 <= op <= len(catalogo):
                nuevo_pedido.agregar(catalogo[op-1])
            else:
                print("Opción no válida")
        except ValueError:
            print("Por favor, introduce un número")

if __name__ == "__main__":
    menu_interactivo()