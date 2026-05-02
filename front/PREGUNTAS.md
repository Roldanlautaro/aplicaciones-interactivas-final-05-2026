# Preguntas - Frontend

## Componentes y estructura

1. ¿Cómo decidiste qué separar en componentes y qué dejar en una página? ¿Qué criterio usaste?
2. ¿Tenés componentes que se reutilizan en más de una vista? ¿Cuáles y por qué?

## Estado y hooks

3. ¿Dónde guardás el estado de las listas (libros, socios, préstamos)? ¿En cada página o en un nivel superior? ¿Por qué?
4. Si el usuario navega a otra página y vuelve, ¿se vuelve a hacer el fetch? ¿Por qué elegiste ese comportamiento?
5. ¿Cómo manejás el estado de carga (loading) y de error al hacer requests a la API?

## Formularios

6. ¿Cómo manejás el estado del formulario de nuevo préstamo? ¿Controlado o no controlado? ¿Por qué?
7. En el formulario de nuevo préstamo, los selects de libro y socio necesitan datos de la API. ¿Cuándo y cómo hacés ese fetch? ¿Qué mostrás mientras carga?
8. ¿Qué feedback le das al usuario si la creación del préstamo falla (por ejemplo, socio suspendido o sin ejemplares)? ¿Cómo mostrás el error que devuelve la API?
9. ¿Qué pasa si el usuario hace doble click en el botón de submit? ¿Lo prevenís de alguna forma?

## Comunicación con la API

10. ¿Cómo manejás los errores HTTP en el frontend? ¿Diferenciás entre un 400 (validación) y un 500 (error interno)?
11. Después de registrar una devolución desde LoansPage, ¿cómo actualizás la lista? ¿Volvés a hacer fetch o actualizás el estado local?

## React Router

12. ¿Cómo decidiste la estructura de rutas? ¿Por qué esas URLs?
13. ¿Qué pasa si el usuario accede a una ruta que no existe? ¿Lo manejaste?
