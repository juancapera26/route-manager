Guia de estandares del codigo 
*STACK LAPP*

##REGLAS DE NOMBRES
###Nombres de variables
✅ Las variables deben tener camelCase por ejemplo:
let nombreUsuario;
cons valorBonyurt;

❌ No vamos a usar mayúsculas completas ni guiones por ejemplo:
let NOMBRE;
Let valor-bonyurt;

###Clases
✅ Para las clases usaremos PascalCase por ejemplo:
class UsuarioController {}

###Funciones y metodos
✅ Para las funciones y metodos usaremos camelCase por ejemplo:
function obtenerUsuario() {}
const calcularTotal = () => {};

##COMENTARIOS Y DOCUMENTACION INTERNA
###Comentarios
✅ Tienen que ser breves pero descriptivos y entendibles por ejemplo:
// Este método calcula el total de un pago

###INDENTACION Y ESTILO DE CODIGO
✅ Se usará indentación de dos espacios para el código.
✅ Las llaves de cierre se escriben en la siguiente linea por ejemplo:
if (activo) {
  console.log('Activo');
}
❌ No recomendado:
if (activo){
console.log('Activo');}

###EJEMPLOS ACEPTADOS ✅ Y NO ACEPTADOS ❌
✅ Ejemplo aceptado:

class UsuarioService {
  obtenerUsuarioPorId(id) {
    // Lógica para buscar usuario
    return usuario;
  }
}
❌ No aceptado:

class usuario_service{
obtener_usuario(id){
return usuario;}
}
