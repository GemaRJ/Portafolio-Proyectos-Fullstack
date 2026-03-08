
export interface Movimiento {
  id: number;
  concepto: string;
  cantidad: number;
  tipo: 'ingreso' | 'gasto';
  fecha: string;
  categoria: string;
}

const movimientos: Movimiento[] = [
  { id: 1, concepto: "Nómina Marzo", cantidad: 2100, tipo: 'ingreso', fecha: "01-03-2026", categoria: "Salario" },
  { id: 2, concepto: "Alquiler Piso", cantidad: 850, tipo: 'gasto', fecha: "02-03-2026", categoria: "Vivienda" },
  { id: 3, concepto: "Supermercado", cantidad: 125.40, tipo: 'gasto', fecha: "03-03-2026", categoria: "Alimentación" },
  { id: 4, concepto: "Recibo Luz", cantidad: 65.20, tipo: 'gasto', fecha: "04-03-2026", categoria: "Vivienda" },
  { id: 5, concepto: "Bizum", cantidad: 30, tipo: 'ingreso', fecha: "05-03-2026", categoria: "Transferencia" },
  { id: 6, concepto: "Bonificación Trae tu Nómina", cantidad: 500, tipo: 'ingreso', fecha: "07-03-2026", categoria: "Transferencia" }

];

export const calcularBalance = (): number => {
  return movimientos.reduce((acc, m) => 
    m.tipo === 'ingreso' ? acc + m.cantidad : acc - m.cantidad, 0
  );
};

export const obtenerDatosSaldo = () => {
  const contable = calcularBalance(); 
  const retenciones = 150.00;
  const disponible = contable - retenciones;

  return {
    contable,
    retenciones,
    disponible
  };
};

export const obtenerMovimientosConSaldo = () => {
  let saldoAcumulado = 0;
  return movimientos.map(m => {
    if (m.tipo === 'ingreso') saldoAcumulado += m.cantidad;
    else saldoAcumulado -= m.cantidad;
    return { ...m, saldoResultante: saldoAcumulado };
  });
};

export const registrarTransferencia = (beneficiario: string, importe: number, categoria: string) => {
  //  formato con ceros a la izquierda (07/03/2026) 
  const fechaHoy = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const nuevoGasto: Movimiento = {
    id: movimientos.length + 1,
    concepto: `Transf. a ${beneficiario.toUpperCase()}`,
    cantidad: importe,
    tipo: 'gasto',
    fecha: fechaHoy, 
    categoria: categoria 
  };
  
  movimientos.push(nuevoGasto);
};