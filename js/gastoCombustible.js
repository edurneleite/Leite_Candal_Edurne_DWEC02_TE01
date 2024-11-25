"use strict";

//Clase nuevo gasto
export default class nuevoGasto {
    // Constructor
    constructor(tipoVehiculo, fecha, kilometros) {
        this.vehicleType = tipoVehiculo;
        this.date = fecha;
        this.kilometers = kilometros;
        this.precioViaje = this.calcularPrecioViaje();
    }
    // Convierte a JSON 
    convertToJSON() {
        return JSON.stringify(this);
    }
    // Metodo calcula precio
    calcularPrecioViaje(tarifa) {
        this.precioViaje = this.kilometers * tarifa; 
        return this.precioViaje;
    }
}