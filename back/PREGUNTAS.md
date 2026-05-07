# Preguntas - Backend

## Arquitectura y capas

1. ¿Qué responsabilidad tiene cada capa (Controller, Service, Repository)? ¿Qué ocurre si ponés lógica de negocio en el Controller?

**Respuesta:**
- **Controller** (`src/controllers/`): traduce HTTP a llamadas de dominio. Recibe la request con el body **ya validado** por el middleware `validateDto` (que se aplica antes en las rutas, no dentro del controller), llama al Service y arma la respuesta con el status code correcto. No conoce la base de datos ni las reglas de negocio. Ejemplo: `BookController.create` solo hace `await BookService.create(req.body)` y responde `201`.
- **Service** (`src/services/`): contiene **toda la lógica de negocio** (reglas, validaciones de dominio, transacciones). Ejemplo: `LoanService.create` valida que el libro no esté retirado, que haya copias disponibles, que el socio no esté suspendido, que no supere los 3 préstamos activos y que no tenga vencidos.
- **Repository** (`src/repositories/`): acceso a datos. Hoy son wrappers finos sobre `AppDataSource.getRepository(Entity)`. Si más adelante hacen falta queries complejas (joins custom, filtros), viven acá y no en el service.

**Si pongo lógica de negocio en el Controller**: pierdo testabilidad (tendría que simular `req`/`res` para testear reglas), duplico la lógica si esa misma operación se invoca desde otro lado (un cron, otro endpoint), el controller queda atado a Express, y se mezclan responsabilidades (violación de SRP). Por eso el controller queda fino y la lógica vive en el service.

2. Si necesitaras agregar una entidad `Fine` (multa por devolución tardía), ¿qué archivos crearías y en qué carpetas?

**Respuesta:**
```
src/entities/Fine.ts                  — Entidad con @Entity, @ManyToOne a Loan/Member,
                                        amount, status (PAID | UNPAID), createdAt
src/dtos/fine.dto.ts                  — CreateFineDto, UpdateFineDto con class-validator
src/repositories/fine.repository.ts   — getRepository(Fine), queries custom si hace falta
src/services/fine.service.ts          — Lógica: cálculo del monto por días vencidos,
                                        marcar pagada, etc.
src/controllers/fine.controller.ts    — Endpoints REST (POST/GET/PATCH)
src/routes/fines.ts                   — Router con validateDto y asyncHandler
src/migrations/<timestamp>-CreateFine.ts — Migración generada con migration:generate
```

Además:
- Registrar el nuevo router en `src/routes/index.ts` (`router.use("/fines", finesRouter)`).
- Agregar `Fine` al array `entities` de `src/config/data-source.ts`.
- Hook en `LoanService.returnLoan` para generar la multa cuando `loan.dueDate < returnDate`.

## Códigos HTTP y manejo de errores

3. ¿Qué código HTTP devolvés cuando se intenta crear un préstamo para un socio con status SUSPENDED? ¿Por qué ese y no un 404?

**Respuesta:**
Devuelvo **`409 Conflict`** desde `LoanService.create` (`src/services/loan.service.ts:31`):
```typescript
if (member.status === MemberStatus.SUSPENDED) {
  throw new HttpError(409, "Member is suspended");
}
```

**Por qué 409 y no 404**:
- `404 Not Found` significa "el recurso no existe". El socio **sí existe** — la búsqueda por id fue exitosa. Devolver 404 sería técnicamente falso y confundiría al cliente (creería que se equivocó de id).
- `409 Conflict` es exactamente la semántica que aplica: el request es válido (el socio existe, el body es correcto), pero **el estado actual del recurso** (`SUSPENDED`) entra en conflicto con la operación que se intenta hacer.

4. ¿Qué diferencia hay entre un 400 (Bad Request) y un 409 (Conflict)? Dá un ejemplo concreto de cada uno en esta aplicación.

**Respuesta:**
- **`400 Bad Request`**: el request está mal formado. El cliente puede arreglarlo solo cambiando lo que mandó. Lo dispara el middleware `validateDto` (`src/middlewares/validateDto.ts`) cuando `class-validator` falla.
  - Ejemplo: `POST /loans` con body `{}` → `400` con `{ error: "Validation failed", details: [...] }` indicando que faltan `bookId` y `memberId`.

- **`409 Conflict`**: el request es válido sintácticamente, pero choca con el estado actual del sistema. El cliente no puede arreglarlo solo cambiando el body — primero hay que cambiar algo en el servidor.
  - Ejemplos en esta app: ISBN duplicado al crear libro (`book.service.ts:10`), libro `WITHDRAWN`, socio `SUSPENDED`, sin copias disponibles, máximo de 3 préstamos activos, socio con préstamos vencidos (`loan.service.ts:44`), devolver un préstamo ya `RETURNED` (`loan.service.ts:86`).

5. Si el cliente envía un body sin `bookId` o `memberId`, ¿qué código devolvés y qué mensaje?

**Respuesta:**
Devuelvo **`400 Bad Request`** desde el middleware `validateDto` (`src/middlewares/validateDto.ts`). El body se transforma a `CreateLoanDto` con `class-transformer` y luego se valida con `class-validator`:

```typescript
export class CreateLoanDto {
  @IsInt()
  @Min(1)
  bookId: number;     // requerido (sin @IsOptional)

  @IsInt()
  @Min(1)
  memberId: number;   // requerido
}
```

Como ambos campos tienen `@IsInt()` y `@Min(1)`, falla la validación y respondo:
```json
{
  "error": "Validation failed",
  "details": [
    { "field": "bookId",   "constraints": { "isInt": "...", "min": "..." } },
    { "field": "memberId", "constraints": { "isInt": "...", "min": "..." } }
  ]
}
```

El uso de `forbidNonWhitelisted: true` también garantiza que un body con campos extra (`{bookId, memberId, dueDate}`) sea rechazado con 400 — el cliente no puede inyectar `dueDate`, que se calcula server-side.

6. ¿Cómo manejás los errores inesperados (por ejemplo, la base de datos se cae)? ¿Exponés el stack trace al cliente?

**Respuesta:**
Hay un middleware global `errorHandler` (`src/middlewares/errorHandler.ts`) montado al final del pipeline en `index.ts`:

```typescript
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);  // Log completo en el servidor
  res.status(500).json({ error: "Internal server error" });
};
```

Distingue dos casos:
- Si es un `HttpError` (lanzado adrede por un service), respondo con su status y mensaje.
- Si es cualquier otra cosa (DB caída, bug, excepción nativa), logueo el error completo en el servidor con `console.error` para diagnóstico, y al cliente solo le mando `500` con `{ error: "Internal server error" }`.

**Nunca expongo el stack trace al cliente**, porque podría filtrar credenciales, paths del filesystem, queries SQL o detalles de la infraestructura. Las funciones async del controller están envueltas con `asyncHandler` (`src/middlewares/asyncHandler.ts`) que rutea cualquier rejection al `errorHandler`.

## Validaciones y reglas de negocio

7. ¿Dónde validás que el socio no supere los 3 préstamos activos simultáneos? ¿En el Controller, en el Service o en la entidad? ¿Por qué ahí?

**Respuesta:**
En el **Service**, en `LoanService.create` (`src/services/loan.service.ts:34-39`), dentro de la transacción:

```typescript
const activeLoans = await loanRepo.find({
  where: { member: { id: member.id }, status: LoanStatus.ACTIVE },
});
if (activeLoans.length >= MAX_ACTIVE_LOANS_PER_MEMBER) {
  throw new HttpError(409, `Member has reached the limit of ${MAX_ACTIVE_LOANS_PER_MEMBER} active loans`);
}
```

**Por qué en Service y no en Controller/Entity**:
- **No en el Controller**: no es validación de forma (eso lo hace el DTO con `class-validator`), sino una **regla de negocio** que requiere ir a la base a contar préstamos activos. Esa lógica no pertenece al controller.
- **No en la Entity**: la regla involucra a *múltiples* registros (varios `Loan`), no al estado interno de uno solo. Las entidades sólo conocen sus propias columnas; cruzar tablas es responsabilidad del service.
- **Sí en el Service**: estando ahí, la regla aplica sin importar quién invoque la creación de préstamos (un endpoint REST, un job, un test).

8. ¿Cómo verificás si un socio tiene préstamos vencidos al momento de crear un nuevo préstamo? Explicá la query o la lógica que usás.

**Respuesta:**
Reuso la misma búsqueda que ya hice para validar el límite de 3 activos. Como ya tengo `activeLoans` en memoria, evito un round-trip extra a la BD y filtro en JS (`src/services/loan.service.ts:41-45`):

```typescript
const now = new Date();
const hasOverdue = activeLoans.some((l) => l.dueDate < now);
if (hasOverdue) {
  throw new HttpError(409, "Member has overdue loans and cannot borrow until resolved");
}
```

**Lógica**:
1. Ya tengo todos los préstamos `ACTIVE` del socio (query de la pregunta 7).
2. Chequeo si alguno tiene `dueDate < now`.
3. Si hay al menos uno vencido, rechazo el nuevo préstamo con 409.

Un préstamo se considera vencido cuando `status === ACTIVE && dueDate < now`. El estado `OVERDUE` del enum **no se persiste** — se calcula en runtime. La misma definición se usa en `ReportService.getActivity`:

```typescript
LoanRepository.count({
  where: { status: LoanStatus.ACTIVE, dueDate: LessThan(now) }
});
```

Esto hace consistente la noción de "vencido" entre la creación de préstamos y el reporte.

9. ¿Qué pasa si dos requests intentan pedir prestado el último ejemplar disponible al mismo tiempo? ¿Cómo prevenís esa condición de carrera?

**Respuesta:**
**Hoy uso `AppDataSource.transaction()`** (`src/services/loan.service.ts:13-64`), que me da **atomicidad**: si alguna de las operaciones falla a mitad, se hace rollback de todo (decremento de `availableCopies` + insert del `Loan`).

```typescript
return AppDataSource.transaction(async (manager) => {
  // 1. Buscar libro y socio
  // 2. Validar reglas (WITHDRAWN, copies, suspendido, etc.)
  // 3. Decrementar availableCopies
  // 4. Crear el préstamo
});
```

**Limitación importante (a destacar en la defensa)**: la transacción sola **no previene** la race condition. En el nivel de aislamiento default de MySQL (`REPEATABLE READ`), dos transacciones pueden leer `availableCopies = 1` en paralelo, ambas validar OK, ambas decrementar, y dejar el contador en `-1` con dos préstamos creados. La transacción garantiza atomicidad (todo o nada por commit), no exclusividad de lectura entre transacciones concurrentes.

**Solución correcta — lock pesimista al leer el libro**:
```typescript
const book = await bookRepo.findOne({
  where: { id: dto.bookId },
  lock: { mode: "pessimistic_write" },
});
```

Esto traduce a `SELECT ... FOR UPDATE`, que bloquea la fila hasta que la transacción termina. La segunda request espera, vuelve a leer `availableCopies = 0` cuando le toca, y falla con `409 No available copies`.

**Alternativa**: lock optimista con una `@VersionColumn` en `Book`, que hace fallar el `UPDATE` si la versión cambió desde que la leíste y obliga al cliente a reintentar.

## ORM y base de datos

10. ¿Qué tipo de relaciones definiste entre Loan y Book, y entre Loan y Member? ¿Por qué ManyToOne y no OneToOne?

**Respuesta:**
Ambas son **`@ManyToOne`** desde `Loan` (`src/entities/Loan.ts`):

```typescript
@ManyToOne(() => Book,   (book)   => book.loans,   { nullable: false }) book: Book;
@ManyToOne(() => Member, (member) => member.loans, { nullable: false }) member: Member;
```

Y en el otro lado, `Book` y `Member` tienen `@OneToMany(() => Loan, ...)`.

**Por qué ManyToOne y no OneToOne**:
- La cardinalidad real del dominio es: **un libro tiene muchos préstamos a lo largo del tiempo** (varios ejemplares, varias rotaciones), y **un socio también** (en serie y en paralelo, hasta 3 activos).
- `OneToOne` implicaría que cada libro tiene exactamente un préstamo en toda su historia, lo que rompe el modelo de una biblioteca.
- La FK queda en la tabla `loan` (lado "muchos"), que es lo correcto para minimizar nulls y respetar la 3FN.

11. ¿Qué es `synchronize: true` en TypeORM y por qué no se recomienda en producción?

**Respuesta:**
En `src/config/data-source.ts:20` tengo `synchronize: false` (correcto, uso migraciones).

**Qué es**: con `synchronize: true`, cada vez que arranca la aplicación TypeORM compara las entidades del código con el esquema real de la BD y aplica las diferencias automáticamente (crea tablas, columnas, índices, etc.). Es cómodo en desarrollo.

**Por qué NO en producción**:
- **Pérdida de datos**: si renombrás una columna, TypeORM la borra y crea una nueva — perdés todo lo que había.
- **Cambios no auditables**: el esquema queda determinado por "lo que se ejecutó la última vez", sin historia ni control de versiones.
- **No hay rollback**: si un cambio rompe algo, no podés volver atrás.
- **Riesgo en deploy**: arrancar la app con un bug en una entidad puede destruir tablas en caliente.

Por eso uso migraciones (`migration:generate` / `migration:run` / `migration:revert`), que son archivos versionados, reversibles y revisables en code review.

12. ¿Qué pasa si ejecutás `migration:run` dos veces seguidas?

**Respuesta:**
La segunda ejecución **no aplica nada**. TypeORM mantiene una tabla `migrations` en la base con el `timestamp` y el `name` de cada migración ejecutada:

1. La primera corrida ejecuta las migraciones pendientes y registra cada una en esa tabla.
2. La segunda corrida lee `migrations`, ve que todas las del filesystem ya están registradas, y no hace nada (loguea "No migrations are pending").

Esa es la garantía de **idempotencia** del sistema de migraciones — el mismo motivo por el que conviene este flujo antes que `synchronize`.

## Seed

13. ¿Cómo lograste que el seed sea idempotente? ¿Usaste `upsert`, verificación previa u otra estrategia?

**Respuesta:**
Usé **verificación previa** por la **clave única natural** de cada entidad (`src/seeds/seed.ts`). Antes de insertar, busco; si existe, lo skipeo.

**Para libros** (clave única: `isbn`):
```typescript
let book = await bookRepo.findOne({ where: { isbn: data.isbn } });
if (!book) {
  book = await bookRepo.save(bookRepo.create(data));
  console.log(`+ Book  ${data.isbn}  ${data.title}`);
} else {
  console.log(`= Book  ${data.isbn}  ya existe, skip`);
}
```

**Para socios** (clave única: `memberNumber`):
```typescript
let member = await memberRepo.findOne({ where: { memberNumber: data.memberNumber } });
if (!member) {
  member = await memberRepo.save(memberRepo.create(data));
} else {
  console.log(`= Member ${data.memberNumber} ya existe, skip`);
}
```

**Para préstamos** (no tienen clave natural propia → busco por la combinación `(book, member)` del plan):
```typescript
const existing = await loanRepo.findOne({
  where: { book: { id: book.id }, member: { id: member.id } },
});
if (existing) {
  console.log(`= Loan ${book.isbn} → ${member.memberNumber} ya existe, skip`);
  continue;
}
```

**Punto clave**: si el préstamo ya existía, **no vuelvo a decrementar `availableCopies`** del libro. Esto preserva la invariante de la regla 2 al re-ejecutar el seed.

**Por qué no usé `upsert`**:
- `Loan` no tiene índice único compuesto sobre el que apoyar el `ON DUPLICATE KEY UPDATE`.
- La verificación previa es más explícita y me deja loguear claramente qué se creó (`+`) vs qué ya existía (`=`).
- El comportamiento queda igual de idempotente: puedo correr `npm run seed` 10 veces y el resultado es el mismo, sin duplicados ni copias contadas dos veces.

Como bonus, el seed cierra la conexión al final con `AppDataSource.destroy()` en un `finally`, así no queda colgado el proceso.
