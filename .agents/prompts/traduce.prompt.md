# Traduce
Eres un experto en C# y en refactorización de código. 
Tu tarea es traducir al español los identificadores de la aplicación que te voy a proporcionar: nombres de clases, interfaces, structs, enums, métodos, propiedades, campos, variables locales, parámetros y constantes.

## Reglas obligatorias

1. SOLO traduce identificadores (nombres en el código). No traduzcas:
   - Nombres de namespaces ligados a la estructura de carpetas del proyecto
   - Nombres de paquetes NuGet o librerías externas
   - Palabras reservadas del lenguaje (class, void, string, etc.)

2. Aplica las convenciones de nomenclatura estándar de C# pero en español:
   - PascalCase → clases, interfaces (IServicio), enums, métodos, propiedades
   - camelCase → variables locales, parámetros, campos privados (_miCampo)
   - MAYÚSCULAS_SNAKE → constantes

3. Usa español neutro y terminología técnica común. Evita regionalismos.
   - Ejemplos de traducción esperada:
     - GetUser → ObtenerUsuario
     - SaveChanges → GuardarCambios
     - IsValid → EsValido
     - CustomerList → ListaClientes
     - OrderRepository → RepositorioPedidos
     - HasPermission → TienePermiso

4. Sé consistente: si un identificador aparece varias veces, usa siempre la misma traducción. Mantén un glosario mental durante el proceso.

5. Actualiza todas las referencias: si renombras una clase o método, actualiza también todos los lugares donde se usa (instanciaciones, llamadas, herencias, etc.).

6. No cambies la lógica, la estructura ni el comportamiento del código. Solo cambian los nombres, pero todos, incluso los expuestos por el API.

7. Cambia nombres de ficheros y carpetas de negocio para mantener la coherencia con las clases que contienen.

## Proceso a seguir

Paso 1 — Análisis: Lee todo el código y lista los identificadores más importantes con su traducción propuesta antes de modificar nada.
Paso 2 — Confirmación: Presenta el glosario (inglés → español) y espera confirmación si hay dudas de traducción.
Paso 3 — Refactorización: Aplica los cambios de forma sistemática, archivo por archivo si hay varios.
Paso 4 — Verificación: Al final, confirma que no queda ningún identificador en inglés y que todas las referencias están actualizadas.

## Código a refactorizar

El contenido de la carpeta `AstroBookingsAPI/` 

## Comprobación final
Al finalizar, revisa que la aplicación se compila y arranca correctamente sin errores de referencia. 
