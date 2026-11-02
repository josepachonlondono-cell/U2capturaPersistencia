# captura y persistencia — actividad Aula - Coquito Amarillo

Aplicacion web registra los pedidos de los clientes mediante un formulario y guarda cada pedido en el archivo Datos.csv y en una tabla de MySQL.

## Tecnologias

- Frontend: HTML5, CSS3 y JavaScript ('fetch').
- Backend: Node.js con Express.
- Persistencia: archivo Datos.csv y MySQL 8 (paqete mysql2).
- Configuración: variables de entorno con 'dotenv'.

## Instalación

1. Instalación dependencias desde la carpeta del proyecto:

   bash
   npm install
   '''.

2. Base de datos script 'coquito_amarillo.sql' DDL

3. Nuevo usuario para la aplicación, solo con permisos de consulta e inserción.

   '''DDL y DCL
   CREATE USER IF NOT EXISTS 'coquito_app'@'localhost' IDENTIFIED BY 'A0000000aa';
   GRANT SELECT, INSERT ON coquito_amarillo.* TO 'coquito_app'@'localhost';
   '''

## Ejecución

'''bash
npm start
'''

## Funcionamiento

1. public/app.js envía los datos del formulario a endpoint 'POST /registrar'.
2. El server crea un objeto 'RegistroPedido' y valida los datos. Si hay errores, responde 400 y no guarda nadita.
3. Dentro de una transacción, inserta el pedido en MySQL y agrega la misma línea, con el 'id' asignado, a 'Datos.csv'.
4. Si ambos pasos funcionan, confirma la transacción y responde 201. Si alguno falla, deshace el INSERT y responde 500, para que el CSV y la tabla nunca queden distintos.

Datos.csv--- se crea automáticamente con el primer pedido. Tiene header, está codificado en UTF-8 y escapa las comas y comillas de cada valor.


José Pachón - CC 96.601.467, Ingeniería de Software.
