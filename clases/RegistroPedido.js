const Registro = require("./Registro");

class RegistroPedido extends Registro {
  static ENCABEZADO_CSV = "id,nombre_cliente,producto,cantidad,correo,fecha_registro\n";

  #nombreCliente;
  #producto;
  #cantidad;
  #correo;

  constructor(nombreCliente, producto, cantidad, correo) {
    super();
    //   textos sin espacios - 0normalización
    this.#nombreCliente = String(nombreCliente ?? "").trim();
    this.#producto = String(producto ?? "").trim();
    this.#cantidad = Number(cantidad);
    this.#correo = String(correo ?? "").trim();
  }

  get nombreCliente() {
    return this.#nombreCliente;
  }

  get producto() {
    return this.#producto;
  }

  get cantidad() {
    return this.#cantidad;
  }

  get correo() {
    return this.#correo;
  }

  // Devuelve la lista de errores,  vacia si el pedido ok
  validar() {
    const errores = [];
    const obligatorios = {
      "nombre del cliente": this.#nombreCliente,
      "producto": this.#producto,
      "correo": this.#correo
    };


    for (const [campo, valor] of Object.entries(obligatorios)) {
      if (valor === "") errores.push(`El campo ${campo} es obligatorio`);
    }

    if (!Number.isInteger(this.#cantidad) || this.#cantidad <= 0) {
      errores.push("La cantidad debe ser un numero entero mayor que cero");
    }

    return errores;
  }

  //  , linea CSV con los valores escapados


  toCSV() {
    const valores = [this.id, this.#nombreCliente, this.#producto, this.#cantidad, this.#correo, this.fechaFormateada()];
    return valores.map(Registro.escaparCSV).join(",") + "\n";
  }
}

module.exports = RegistroPedido;
