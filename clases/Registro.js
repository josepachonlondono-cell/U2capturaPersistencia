//   Clase padre
class Registro {
  #id = null;
  #fecha = new Date();

  get id() {
    return this.#id;
  }

  get fecha() {
    return this.#fecha;
  }

  // el ID se recupera de la bd  despues del INSERT
  asignarId(id) {
    if (!Number.isInteger(id) || id <= 0) throw new Error("Id de registro invalido");
    this.#id = id;
  }
  
  fechaFormateada() {
    const f = this.#fecha;
    const dos = (n) => String(n).padStart(2, "0");
    return `${f.getFullYear()}-${dos(f.getMonth() + 1)}-${dos(f.getDate())} ${dos(f.getHours())}:${dos(f.getMinutes())}:${dos(f.getSeconds())}`;
  }

  // escapa un valor - comillas  si trae coma, comillas o salto d linea
  static escaparCSV(valor) {
    const texto = String(valor ?? "");
    return /[",\r\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
  }

  //   cada clase hija define su propia linea
  toCSV() {
    throw new Error("toCSV() debe implementarse en la clase hija");
  }
}

module.exports = Registro;
