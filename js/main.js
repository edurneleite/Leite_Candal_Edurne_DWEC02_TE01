"use strict";
import nuevoGasto from "./gastoCombustible.js";

// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = './json/tarifasCombustible.json';
let gastosJSONpath = './json/gastosCombustible.json';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});
// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}
// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
//CALCULAR GASTO TOTAL por año al iniciar la aplicación
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }
    //Sumar gasto total por años
    for (let anio in aniosArray){
        let sumaTotal = 0; 
        gastosJSON.forEach(gasto => {
            let fecha = new Date(gasto.date);
            let anioGasto = fecha.getFullYear();
            if (anio == anioGasto){
                sumaTotal += gasto.precioViaje;
            }
        });
        aniosArray[anio] = sumaTotal;
        let anioId = 'gasto'+ anio
        document.getElementById(anioId).textContent = sumaTotal.toFixed(2);
    }
}

// GUARDAR GASTO NUEVO y actualizar datos
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('guardarGasto').addEventListener('click', guardarGasto);
});
function guardarGasto(event) {
    event.preventDefault(); 
    // Obtener los datos del formulario
    let tipoVehiculo = document.getElementById('vehicle-type').value;
    let fecha = new Date(document.getElementById('date').value);
    let kilometros = parseFloat(document.getElementById('kilometers').value);
    //Encontrar tarifa
    for (let tarifa of tarifasJSON.tarifas){
        if (tarifa.anio == fecha.getFullYear()){
            if (tipoVehiculo in tarifa.vehiculos){
                var tarifaNueva = tarifa.vehiculos[tipoVehiculo];
            }   
        }
    }
    // Hacer un objeto
    const GastoCombustible = new nuevoGasto (tipoVehiculo, fecha, kilometros);
    GastoCombustible.calcularPrecioViaje(tarifaNueva);
    // Añadir el nuevo gasto al array de gastos
    gastosJSON.push(GastoCombustible);
    console.log(GastoCombustible);
    //Actualizar la lista de gastos recientes
    actualizarListaGastos(GastoCombustible);
    // Recalcular gasto total y resetear formulario
    calcularGastoTotal();
    document.getElementById('fuel-form').reset();
}
// ACTUALIZAR LISTA RECIENTE
function actualizarListaGastos(listaGastos) {
    //Crear lista
    const lista = document.getElementById('expense-list');
    const listItem = document.createElement('li');
    listItem.textContent += listaGastos.convertToJSON();
    lista.appendChild(listItem);
    

}
