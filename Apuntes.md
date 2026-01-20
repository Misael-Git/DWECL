function isPalindrome(word) {
  // Remove non-alphanumeric characters and convert to lowercase
  const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Reverse the string and compare it to the original
  const reversedWord = cleanWord.split('').reverse().join('');
  
  return cleanWord === reversedWord;
}

// Example usage:
console.log(isPalindrome("radar")); // true
console.log(isPalindrome("hello")); // false


Nombre,Acción
split(),Divide un string en un array basándose en un separador.
slice(),Extrae una parte de un string y devuelve uno nuevo.
substring(),"Similar a slice, pero no acepta índices negativos."
replace(),Reemplaza un valor por otro en un string.
replaceAll(),Reemplaza todas las coincidencias de un valor.
toLowerCase(),Convierte todo el texto a minúsculas.
toUpperCase(),Convierte todo el texto a mayúsculas.
trim(),Elimina espacios en blanco al inicio y al final.
includes(),Devuelve true si el string contiene una subcadena.
startsWith(),Verifica si el string empieza con ciertos caracteres.
endsWith(),Verifica si el string termina con ciertos caracteres.
indexOf(),Devuelve el primer índice donde se encuentra un carácter.
lastIndexOf(),Devuelve el último índice donde se encuentra un carácter.
charAt(),Devuelve el carácter en una posición específica.
repeat(),Devuelve el string repetido N veces.

Nombre,Acción
push(),Añade un elemento al final.
pop(),Elimina el último elemento.
shift(),Elimina el primer elemento.
unshift(),Añade un elemento al principio.
map(),Crea un nuevo array transformando cada elemento.
filter(),Crea un nuevo array solo con elementos que cumplen una condición.
reduce(),Acumula el array en un solo valor (ej. suma total).
forEach(),Ejecuta una función por cada elemento (no devuelve nada).
find(),Devuelve el primer elemento que cumple una condición.
findIndex(),Devuelve el índice del primer elemento que cumple condición.
some(),Devuelve true si al menos un elemento cumple la condición.
every(),Devuelve true si TODOS los elementos cumplen la condición.
sort(),Ordena el array (cuidado: ordena como strings por defecto).
reverse(),Invierte el orden de los elementos.
concat(),Une dos o más arrays.
join(),Une todos los elementos de un array en un string.
flat(),Aplana arrays anidados (matrices a listas).
includes(),Verifica si un elemento existe en el array.
splice(),Cambia el contenido eliminando o reemplazando elementos.
slice(),Devuelve una copia de una parte del array.

Nombre,Acción
Object.keys(),Devuelve un array con los nombres de las propiedades.
Object.values(),Devuelve un array con los valores de las propiedades.
Object.entries(),"Devuelve un array de pares [clave, valor]."
Object.assign(),Copia propiedades de un objeto a otro.
Object.freeze(),Congela un objeto (no se puede modificar).
Object.seal(),"Previene agregar propiedades, pero permite modificar existentes."
JSON.stringify(),Convierte un objeto/array a string JSON.
JSON.parse(),Convierte un string JSON a objeto/array.
Set,Colección de valores únicos (no duplicados).
Map,Colección de pares clave-valor (permite claves de cualquier tipo).

Nombre,Acción
Promise,Objeto que representa la terminación o falla de una operación asíncrona.
then(),Se ejecuta cuando la promesa se resuelve con éxito.
catch(),Se ejecuta cuando la promesa falla.
finally(),"Se ejecuta siempre, falle o no la promesa."
async,Define una función que devuelve una promesa implícitamente.
await,Pausa la ejecución hasta que una promesa se resuelva.
Promise.all(),Espera a que todas las promesas se resuelvan.
Promise.race(),Se resuelve cuando la PRIMERA promesa termina.
fetch(),API para realizar peticiones HTTP.
setTimeout(),Ejecuta código después de un retraso.
setInterval(),Ejecuta código repetidamente cada cierto tiempo.

Nombre,Acción
getElementById(),Busca un elemento por su ID.
querySelector(),Busca el primer elemento que coincida con un selector CSS.
querySelectorAll(),Busca todos los elementos que coincidan con un selector.
addEventListener(),"Escucha un evento (click, submit, etc.)."
createElement(),Crea un nuevo nodo de elemento HTML.
appendChild(),Inserta un elemento hijo al final.
remove(),Elimina el elemento del DOM.
classList.add(),Añade una clase CSS a un elemento.
classList.toggle(),Quita/pone una clase dependiendo de si existe.
setAttribute(),"Define el valor de un atributo (ej. src, href)."
innerHTML,Obtiene o define el contenido HTML interno.
textContent,Obtiene o define solo el texto interno.
preventDefault(),Detiene la acción por defecto de un evento (ej. recargar página).
stopPropagation(),Detiene la propagación del evento hacia los padres.
localStorage,Almacena datos de forma persistente en el navegador.



MAPS:


// Ejemplo 1
// Función recursiva para calcular el factorial
const factorial = (n) => {
  if (n <= 1) return 1; 
  return n * factorial(n - 1);
};

const numeros = [1, 2, 3, 4, 5];

// Aplicamos la función recursiva a cada elemento del array
const resultados = numeros.map(factorial);

console.log(resultados); // [1, 2, 6, 24, 120]



// Ejemplo 2
const usuarios = [
  { id: 1, nombre: 'Ana' },
  { id: 2, nombre: 'Luis' }
];

// Extraemos solo los nombres a un nuevo array de strings
const nombres = usuarios.map(u => u.nombre); 

console.log(nombres); // ["Ana", "Luis"]