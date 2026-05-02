# Preguntas - Backend

## Arquitectura y capas

1. ¿Qué responsabilidad tiene cada capa (Controller, Service, Repository)? ¿Qué ocurre si ponés lógica de negocio en el Controller?
2. Si necesitaras agregar una entidad `Fine` (multa por devolución tardía), ¿qué archivos crearías y en qué carpetas?

## Códigos HTTP y manejo de errores

3. ¿Qué código HTTP devolvés cuando se intenta crear un préstamo para un socio con status SUSPENDED? ¿Por qué ese y no un 404?
4. ¿Qué diferencia hay entre un 400 (Bad Request) y un 409 (Conflict)? Dá un ejemplo concreto de cada uno en esta aplicación.
5. Si el cliente envía un body sin `bookId` o `memberId`, ¿qué código devolvés y qué mensaje?
6. ¿Cómo manejás los errores inesperados (por ejemplo, la base de datos se cae)? ¿Exponés el stack trace al cliente?

## Validaciones y reglas de negocio

7. ¿Dónde validás que el socio no supere los 3 préstamos activos simultáneos? ¿En el Controller, en el Service o en la entidad? ¿Por qué ahí?
8. ¿Cómo verificás si un socio tiene préstamos vencidos al momento de crear un nuevo préstamo? Explicá la query o la lógica que usás.
9. ¿Qué pasa si dos requests intentan pedir prestado el último ejemplar disponible al mismo tiempo? ¿Cómo prevenís esa condición de carrera?

## ORM y base de datos

10. ¿Qué tipo de relaciones definiste entre Loan y Book, y entre Loan y Member? ¿Por qué ManyToOne y no OneToOne?
11. ¿Qué es `synchronize: true` en TypeORM y por qué no se recomienda en producción?
12. ¿Qué pasa si ejecutás `migration:run` dos veces seguidas?

## Seed

13. ¿Cómo lograste que el seed sea idempotente? ¿Usaste `upsert`, verificación previa u otra estrategia?
