const formulario = document.getElementById("formPedido");

const mensaje = document.getElementById("mensaje");


//   envia el pedido al servidor sin recargar la pagina
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const datos = Object.fromEntries(new FormData(formulario));

  try {
    const respuesta = await fetch("/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });


    const resultado = await respuesta.json();





    // muestra el mensaje o el  error que devuelve el server
    mensaje.textContent = respuesta.ok ? resultado.mensaje : resultado.error;
    if (respuesta.ok) formulario.reset();
  } catch (error) {
    
    mensaje.textContent = "No fue posible conectar con el servidor";
  }
});
