# 🧩 Trabajo Práctico Final

# Sistema de Gestión de una Biblioteca

------------------------------------------------------------------------

## 📌 Objetivo

Desarrollar una aplicación fullstack que permita gestionar el catálogo
y los préstamos de una biblioteca.

El sistema deberá permitir:

-   Registrar libros y su cantidad de ejemplares disponibles
-   Registrar socios con su estado de membresía
-   Crear y gestionar préstamos de libros a socios
-   Registrar devoluciones
-   Consultar el estado general de la biblioteca (reporte de actividad)

------------------------------------------------------------------------

## 🛠 Tecnologías sugeridas

### Backend

-   Node.js
-   Express
-   TypeORM
-   Base de datos relacional (MySQL o PostgreSQL)
-   Arquitectura en capas:
    -   Controllers
    -   Services
    -   Repositories
-   Migraciones de base de datos con TypeORM:
    -   Las tablas deben crearse mediante migraciones, no con `synchronize: true`
    -   Scripts en package.json para generar y ejecutar migraciones:
        -   `npm run migration:generate -- src/migrations/<Nombre>` — genera una migración a partir de cambios en las entidades
        -   `npm run migration:run` — ejecuta las migraciones pendientes
        -   `npm run migration:revert` — revierte la última migración ejecutada
    -   Las migraciones deben almacenarse en `src/migrations/`
-   Script de datos de prueba (seed):
    -   `npm run seed` — ejecuta un script que inicializa la base de datos con datos de prueba
    -   Datos mínimos del seed:
        -   5 libros (géneros variados, al menos uno con status WITHDRAWN, al menos uno con `availableCopies` < `totalCopies`)
        -   4 socios (al menos uno con status SUSPENDED)
        -   3 préstamos de ejemplo (al menos uno ACTIVE, uno RETURNED y uno con fecha vencida)
    -   El script debe ser idempotente: si se ejecuta más de una vez, no debe duplicar datos

### Frontend

-   React
-   React Router
-   useState
-   useEffect
-   Fetch o Axios para consumir la API

------------------------------------------------------------------------

# 📚 Dominio del Problema

Una biblioteca necesita un sistema para administrar:

-   Su catálogo de libros y la disponibilidad de ejemplares
-   Los socios habilitados para pedir prestado
-   Los préstamos activos, devueltos y vencidos
-   El estado general de actividad de la biblioteca

No se requiere autenticación de usuarios.

El sistema representa únicamente la gestión interna de la biblioteca.

------------------------------------------------------------------------

# 🗂 Modelo de Datos

## 1️⃣ Book (Libro)

### Atributos

-   id
-   isbn (único)
-   title
-   author
-   genre (FICTION \| NON_FICTION \| SCIENCE \| HISTORY \| TECHNOLOGY \| CHILDREN)
-   totalCopies (total de ejemplares físicos)
-   availableCopies (ejemplares actualmente disponibles para préstamo)
-   status (AVAILABLE \| WITHDRAWN)

### Reglas

-   isbn debe ser único.
-   totalCopies debe ser mayor a 0.
-   availableCopies no puede ser negativo ni superar totalCopies.
-   Un libro con status WITHDRAWN no puede recibir nuevos préstamos.

------------------------------------------------------------------------

## 2️⃣ Member (Socio)

### Atributos

-   id
-   memberNumber (único)
-   name
-   email (único)
-   status (ACTIVE \| SUSPENDED)

### Reglas

-   memberNumber y email deben ser únicos.
-   Un socio con status SUSPENDED no puede solicitar préstamos.

------------------------------------------------------------------------

## 3️⃣ Loan (Préstamo)

### Atributos

-   id
-   loanDate (fecha en que se realiza el préstamo, se asigna automáticamente)
-   dueDate (fecha límite de devolución: loanDate + 14 días, calculado automáticamente)
-   returnDate (fecha real de devolución, null hasta que se devuelva)
-   status (ACTIVE \| RETURNED \| OVERDUE)

### Relaciones

-   Pertenece a un libro (Book)
-   Pertenece a un socio (Member)

------------------------------------------------------------------------

# 📏 Reglas de Negocio (Obligatorias en Services)

## 1️⃣ Libro retirado

No se puede crear un préstamo para un libro con status WITHDRAWN.

## 2️⃣ Sin ejemplares disponibles

Si `availableCopies == 0` → el préstamo debe rechazarse.

Al crear un préstamo, `availableCopies` del libro se decrementa en 1.

## 3️⃣ Socio suspendido

No se puede crear un préstamo para un socio con status SUSPENDED.

## 4️⃣ Límite de préstamos activos

Un socio no puede tener más de **3 préstamos con status ACTIVE**
simultáneamente.

## 5️⃣ Préstamos vencidos

Un socio que tenga al menos un préstamo ACTIVE con `dueDate` anterior a
la fecha actual no puede solicitar nuevos préstamos hasta regularizar su
situación.

## 6️⃣ Devolución

Registrar una devolución debe:

-   Cambiar el status del préstamo a RETURNED.
-   Asignar la fecha actual a `returnDate`.
-   Incrementar en 1 el `availableCopies` del libro correspondiente.

No se elimina el registro del préstamo.

## 7️⃣ Fecha de vencimiento automática

`dueDate` se calcula automáticamente como `loanDate + 14 días` al
momento de crear el préstamo. El cliente no debe poder enviarlo.

## 8️⃣ ISBN único

No puede repetirse el campo `isbn`.

## 9️⃣ Copias válidas

No se pueden crear libros con `totalCopies` igual a 0 o negativo.

## 🔟 Número de socio y email únicos

`memberNumber` y `email` no pueden repetirse entre socios.

------------------------------------------------------------------------

# 🔌 API mínima requerida

## Libros (/books) endpoints

-   Creación
-   Listado
-   Actualización (status, ejemplares)

## Socios (/members) endpoints

-   Creación
-   Listado
-   Actualización (status)

## Préstamos (/loans) endpoints

-   Creación (recibe `bookId` y `memberId`)
-   Listado
-   Devolución (PATCH /loans/:id → cambia status a RETURNED)

## Reporte

-   `GET /reports/activity`

Debe devolver:

-   totalBooks
-   totalMembers
-   activeLoans
-   overdueLoans

Cálculo de `overdueLoans`: préstamos con status ACTIVE y `dueDate`
anterior a la fecha actual.

------------------------------------------------------------------------

# 🎨 Frontend

## Vistas mínimas

1.  Listado de libros
2.  Listado de socios
3.  Nuevo préstamo (formulario)
4.  Listado de préstamos (con acción de devolución)
5.  Reporte de actividad

## Componentes mínimos

-   Navbar
-   BookList
-   MemberList
-   LoanForm
-   LoanList
-   ActivityReport

Debe existir separación clara entre componentes.

------------------------------------------------------------------------

# 📂 Entregables

Repositorio con: - /back - /front - README con instrucciones de
ejecución

------------------------------------------------------------------------

# ❓ Preguntas de defensa

Cada proyecto incluye un archivo `PREGUNTAS.md` con preguntas sobre las
decisiones técnicas tomadas durante la implementación:

-   [`/back/PREGUNTAS.md`](back/PREGUNTAS.md) — Preguntas sobre arquitectura, manejo de
    errores HTTP, validaciones, TypeORM y migraciones.
-   [`/front/PREGUNTAS.md`](front/PREGUNTAS.md) — Preguntas sobre componentes, estado,
    formularios, comunicación con la API y ruteo.

**El alumno debe responder todas las preguntas en el mismo archivo**,
debajo de cada pregunta. Las respuestas deben ser breves, concretas y
hacer referencia al código propio cuando corresponda.