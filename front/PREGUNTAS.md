# Preguntas - Frontend

## Componentes y estructura

1. ¿Cómo decidiste qué separar en componentes y qué dejar en una página? ¿Qué criterio usaste?

**Respuesta:**
Aplico una separación en tres niveles:

- **Pages** (`src/pages/`): orquestación. Manejan estado, hooks (`useState`, `useEffect`), llamadas a la API y coordinan modales. Son "contenedores". Ejemplo: `BooksPage` decide cuándo abrir el modal, qué pasa al hacer submit y cómo refrescar la lista.
- **Componentes de dominio** (`src/components/`): conocen los tipos del negocio (`Book`, `Member`, `Loan`) pero no llaman a la API. Reciben datos y callbacks por props. Ejemplos: `BookList`, `MemberList`, `LoanList`, `BookForm`, `MemberForm`, `LoanForm`, `ActivityReport`, `Navbar`.
- **Primitivos UI** (`src/components/ui/`): genéricos, sin conocimiento del dominio. Reutilizables en cualquier proyecto. Ejemplos: `Button`, `Modal`, `Table`, `Card`, `FormField`, `Input`, `Select`, `Alert`, `PageContainer`, `PageHeader`.

**Criterios concretos para separar**:
- **Reuso**: si lo voy a usar en 2+ lugares, lo extraigo (ej. `Table` se usa en libros, socios y préstamos).
- **Responsabilidad única**: si una page tiene 200 líneas y mezcla lógica de fetch con render de tabla y formulario, la divido.
- **Testabilidad**: un componente que recibe props sin estado interno es fácil de testear, mientras que la page con `useEffect` requiere mocks.

2. ¿Tenés componentes que se reutilizan en más de una vista? ¿Cuáles y por qué?

**Respuesta:**
Sí, principalmente los primitivos de `components/ui/`:

| Componente | Usos |
|---|---|
| `PageContainer` | Las 4 pages (Books, Members, Loans, Reports) y la 404. Centra el contenido y aplica padding consistente. |
| `PageHeader` | Las 4 pages. Garantiza títulos + acciones a la derecha alineados igual en todas. |
| `Card` | Envuelve cada tabla y cada métrica del reporte. Da el "marco" visual unificado. |
| `Table<T>` | Se usa en `BookList`, `MemberList`, `LoanList`. Genérico sobre el tipo de fila — recibe `columns` y `data` y renderiza. Ahorra ~40 líneas duplicadas de `<th>`/`<td>` por componente. |
| `Modal` | `BooksPage`, `MembersPage`, `LoansPage` (nuevo libro / socio / préstamo). |
| `Button`, `Input`, `Select`, `FormField`, `Alert` | Todos los formularios. |

Los componentes de dominio (`BookList`, etc.) **no** se reutilizan porque son específicos a cada entidad — ahí no tendría sentido genéricar. La idea es que el primitivo `<Table>` sea reutilizable y los componentes de dominio configuren las columnas.

## Estado y hooks

3. ¿Dónde guardás el estado de las listas (libros, socios, préstamos)? ¿En cada página o en un nivel superior? ¿Por qué?

**Respuesta:**
**En cada página**, con `useState` local. Por ejemplo `BooksPage` tiene:

```typescript
const [books, setBooks] = useState<Book[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

**Por qué local y no en un nivel superior**:
- **Scope acotado**: cada lista solo se necesita en su página. Llevarla al `App` o a un `Context` global crearía acoplamiento sin beneficio.
- **Simplicidad**: el TP no requiere compartir estado entre páginas, ni invalidación cruzada (ej. crear un libro no afecta la lista de socios).
- **YAGNI**: no instalo Redux / Zustand / TanStack Query porque no hay un caso de uso real en este alcance.

Si el proyecto creciera y necesitara, por ejemplo, mostrar "préstamos pendientes" en el `Navbar` desde otras pages, ahí evaluaría subir el estado o usar un `Context`. Hoy sería over-engineering.

4. Si el usuario navega a otra página y vuelve, ¿se vuelve a hacer el fetch? ¿Por qué elegiste ese comportamiento?

**Respuesta:**
**Sí, se vuelve a hacer fetch** cada vez que se monta la página. Cuando el usuario navega de `/books` a `/loans`, React Router desmonta `BooksPage` y monta `LoansPage`. Al volver a `/books` se monta una nueva instancia con `useState` inicial vacío y el `useEffect(..., [])` dispara `listBooks()` de nuevo.

**Por qué elegí este comportamiento**:
- **Datos siempre frescos**: si otro usuario o un proceso del backend modifica los datos (ej. el seed corre, o alguien crea un libro desde otra pestaña), al volver veo el estado actual.
- **Simplicidad**: no hay caché que invalidar ni stale data que manejar.
- **Costo bajo**: las listas son chicas (decenas de items en este TP). Un GET adicional no es problema.

**Cuándo cambiaría**: si tuviera miles de items, navegación frecuente y necesitara optimizar, agregaría `TanStack Query` con caché y revalidación automática (`staleTime`, `refetchOnWindowFocus`). Para este TP no aplica.

5. ¿Cómo manejás el estado de carga (loading) y de error al hacer requests a la API?

**Respuesta:**
Patrón consistente en cada page con tres `useState`:

```typescript
const [data, setData] = useState<T[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

const fetchData = async () => {
  setLoading(true)
  setError(null)
  try {
    setData(await listX())
  } catch (err) {
    setError(extractApiError(err))
  } finally {
    setLoading(false)
  }
}
```

**Render condicional** dentro del `<Card>`:
- Si `loading` → mensaje "Cargando libros…" centrado.
- Si `error` → componente `<Alert variant="error">` con el mensaje extraído.
- Si OK → la tabla con los datos.

**Para acciones** (crear, devolver, cambiar status) uso flags adicionales: `submitting` (botón del modal) y `busyId` (fila de la tabla cuyo botón está en proceso). Esto permite deshabilitar solo el botón afectado, no toda la página.

`extractApiError` (`src/services/errors.ts`) centraliza la lógica de extraer el mensaje del response — busca `data.error`, `data.message`, o cae al `statusText`.

## Formularios

6. ¿Cómo manejás el estado del formulario de nuevo préstamo? ¿Controlado o no controlado? ¿Por qué?

**Respuesta:**
**Controlados**. En `LoanForm`:

```typescript
const [bookId, setBookId] = useState<string>('')
const [memberId, setMemberId] = useState<string>('')

<Select value={bookId} onChange={(e) => setBookId(e.target.value)} ... />
```

Cada `<input>`/`<select>` tiene `value` ligado a estado y `onChange` que lo actualiza. React es la fuente única de verdad.

**Por qué controlados y no `useRef` (no controlados)**:
- **Validación reactiva**: puedo deshabilitar el botón submit con `disabled={!bookId || !memberId}`. Con uncontrolled tendría que leer el DOM en cada render.
- **Estados derivados**: la lista de libros disponibles se filtra reactivamente (`books.filter(b => b.availableCopies > 0)`) y se re-renderiza cuando cambia el estado padre.
- **Limpieza**: para resetear el form al cerrar el modal alcanza con desmontar el componente o llamar a un setter.
- **Idiomático en React**: forms controlados son el patrón standard cuando los datos viven en estado React.

Para forms simples como este, controlados son **más legibles y menos error-prone** que `useRef`.

7. En el formulario de nuevo préstamo, los selects de libro y socio necesitan datos de la API. ¿Cuándo y cómo hacés ese fetch? ¿Qué mostrás mientras carga?

**Respuesta:**
**Lazy loading**: los datos se cargan **al abrir el modal**, no al montar `LoansPage`. Esto evita 3 fetches innecesarios para usuarios que solo entran a ver la lista de préstamos.

En `LoansPage.tsx`:
```typescript
async function openModal() {
  setFormError(null)
  setModalLoadError(null)
  setModalOpen(true)
  setModalLoading(true)
  try {
    const [b, m] = await Promise.all([listBooks(), listMembers()])
    setBooks(b)
    setMembers(m)
  } catch (err) {
    setModalLoadError(extractApiError(err))
  } finally {
    setModalLoading(false)
  }
}
```

**Detalles**:
- **`Promise.all`**: dispara los dos GET en paralelo (no serializado), ahorra latencia.
- **Estados separados** del modal (`modalLoading`, `modalLoadError`) — independientes del estado de la lista de préstamos.
- **Mientras carga** muestro `"Cargando libros y socios…"` dentro del modal.
- **Si falla**, muestro un `<Alert>` con el error en lugar del formulario.
- **Si OK**, renderizo `<LoanForm books={books} members={members} ... />`.

`LoanForm` además **filtra client-side**: muestra solo libros con `status === AVAILABLE && availableCopies > 0` y socios con `status === ACTIVE`. Si no hay ninguno disponible, muestra un `hint` debajo del campo ("No hay libros disponibles para prestar").

8. ¿Qué feedback le das al usuario si la creación del préstamo falla (por ejemplo, socio suspendido o sin ejemplares)? ¿Cómo mostrás el error que devuelve la API?

**Respuesta:**
**1. Captura del error en la page** (`LoansPage.handleCreate`):
```typescript
try {
  await createLoan(input)
  setModalOpen(false)
  await fetchLoans()
} catch (err) {
  setFormError(extractApiError(err))
}
```

**2. Extracción del mensaje** en `services/errors.ts`. La función `extractApiError` busca:
- `response.data.error` (formato del backend, ej. `{"error":"Member is suspended"}`)
- `response.data.message` (formato alternativo)
- Fallback a `Error N: statusText`.

**3. Render del error** dentro del modal: el `LoanForm` recibe `error: string | null` por props y, si está presente, muestra un `<Alert variant="error">` arriba de los botones. **El modal no se cierra**, así el usuario ve el error en contexto y puede corregir o cancelar.

**4. Mensajes posibles** que llegan del backend (todos `409 Conflict`):
- `"Book is withdrawn and cannot be loaned"`
- `"No available copies for this book"`
- `"Member is suspended"`
- `"Member has reached the limit of 3 active loans"`
- `"Member has overdue loans and cannot borrow until resolved"`

Como ya están en lenguaje claro desde el back, los muestro tal cual sin transformación.

9. ¿Qué pasa si el usuario hace doble click en el botón de submit? ¿Lo prevenís de alguna forma?

**Respuesta:**
**Sí, lo prevengo con tres barreras**:

1. **Flag `submitting` en estado**: al apretar submit se setea en `true` y vuelve a `false` solo en el `finally`.
   ```typescript
   if (submitting) return
   setSubmitting(true)
   try { await createBook(input) } finally { setSubmitting(false) }
   ```
2. **`disabled={submitting}` en el botón**: visualmente queda greyed-out y el navegador ignora clicks. El texto cambia a `"Creando…"` para feedback visual.
3. **Guard al inicio del handler**: `if (submitting) return` — defensa en profundidad por si el `disabled` no llega a aplicarse (ej. doble click muy rápido entre el click y el render).

**Adicional en el modal**: mientras `submitting === true`, deshabilito el botón "Cancelar", el botón "✕" del modal y el cierre por backdrop click (paso `closeOnBackdrop={!submitting}`). Así el usuario no puede cerrar el modal a mitad de un POST.

## Comunicación con la API

10. ¿Cómo manejás los errores HTTP en el frontend? ¿Diferenciás entre un 400 (validación) y un 500 (error interno)?

**Respuesta:**
Hoy **no diferencio explícitamente** entre 400/409/500 — uso un manejo unificado: extraer el mensaje del backend y mostrarlo. La razón es que el backend ya devuelve mensajes claros y el status code es información útil para el desarrollador, no tanto para el usuario final.

`extractApiError` (`src/services/errors.ts`) hace lo siguiente:
```typescript
if (axios.isAxiosError(err)) {
  const data = err.response?.data
  if (data?.message) return Array.isArray(data.message) ? data.message.join(', ') : data.message
  if (data?.error)   return data.error
  if (err.response)  return `Error ${err.response.status}: ${err.response.statusText}`
  return err.message
}
```

**Diferenciación que sí hago en la práctica**:
- **400 (Validation failed)**: el backend devuelve `{ error: "Validation failed", details: [...] }`. Hoy muestro solo `error`. Para mejor UX podría parsear `details` y resaltar el campo específico (mejora pendiente).
- **409 (Conflict)**: mensaje claro del back ("Member is suspended") → se muestra tal cual en el modal.
- **500 (Internal server error)**: el back manda `{ error: "Internal server error" }` sin detalles → se muestra ese mensaje genérico (no expone stack ni infraestructura).
- **Network error / sin response**: cae al `err.message` de axios ("Network Error") → se muestra como alert.

Si quisiera diferenciar más, podría agregar un check `err.response?.status >= 500` y mostrar un mensaje distinto ("Error del servidor, intentá de nuevo más tarde"). Para el alcance del TP, el approach actual es suficiente.

11. Después de registrar una devolución desde LoansPage, ¿cómo actualizás la lista? ¿Volvés a hacer fetch o actualizás el estado local?

**Respuesta:**
**Vuelvo a hacer fetch** (`LoansPage.handleReturn`):
```typescript
async function handleReturn(id: number) {
  setBusyId(id)
  try {
    await returnLoan(id)
    await fetchLoans()   // GET /loans completo
  } catch (err) {
    setError(extractApiError(err))
  } finally {
    setBusyId(null)
  }
}
```

**Por qué refetch y no update local**:
- **Single source of truth**: el backend es la verdad. Si actualizo solo localmente con `setLoans(prev => prev.map(...))`, podría desincronizarme con cambios concurrentes (otro usuario, otra pestaña).
- **Datos derivados consistentes**: la devolución cambia el `status` del préstamo y también incrementa `availableCopies` del libro asociado. Si el endpoint devuelve el `Loan` actualizado pero no el `Book`, tendría que mergear a mano. Refetch del recurso completo evita ese problema.
- **Trade-off aceptable**: un GET adicional sobre una lista chica no impacta. Para listas grandes, un update optimista local sería más eficiente.

**Mismo patrón** en todas las acciones de mutación: crear libro/socio/préstamo, cambiar status, devolver → siempre `await mutate(...)` seguido de `await fetch...()`. Esto da consistencia visual y simplicidad.

## React Router

12. ¿Cómo decidiste la estructura de rutas? ¿Por qué esas URLs?

**Respuesta:**
Las rutas son (`src/App.tsx`):
```
/             → redirect a /books
/books        → BooksPage
/members      → MembersPage
/loans        → LoansPage
/loans/new    → redirect a /loans (legacy compat)
/reports      → ActivityReportPage
*             → NotFound
```

**Criterios**:
- **Recursos en plural**, alineado con el backend (`/books`, `/members`, `/loans`). Es la convención REST y mantiene paridad mental cliente↔server.
- **Sustantivos, no verbos**: `/books` y no `/list-books` o `/show-books`. La acción la determina el método HTTP en el back; en el front la determina la UI.
- **Ruta raíz redirige a `/books`**: el listado de libros es el "home" más útil para una biblioteca; abrir en un 404 sería peor UX.
- **`/loans/new` redirige a `/loans`**: durante el desarrollo tuve una página separada para crear préstamo, después la migré a un modal en `/loans`. Mantuve la ruta como redirect para no romper bookmarks o links viejos.
- **`*` catch-all**: cualquier ruta inválida cae en `NotFound` con un link de vuelta a `/books`.

13. ¿Qué pasa si el usuario accede a una ruta que no existe? ¿Lo manejaste?

**Respuesta:**
Sí. En `App.tsx` tengo una ruta catch-all como **última** del `<Routes>`:
```tsx
<Route path="*" element={<NotFound />} />
```

`NotFound` es un componente local definido en el mismo archivo:
```tsx
function NotFound() {
  return (
    <PageContainer>
      <div style={{ textAlign: 'center', padding: spacing[12] }}>
        <h2>404 — Página no encontrada</h2>
        <p>
          La ruta solicitada no existe.
          <Link to="/books">Volver al inicio</Link>
        </p>
      </div>
    </PageContainer>
  )
}
```

**Detalles**:
- Usa `<PageContainer>` para mantener el layout consistente con el resto de las pages.
- Incluye un `<Link>` a `/books` para que el usuario tenga un escape claro.
- El `Navbar` se sigue mostrando porque está fuera de `<Routes>` en `App.tsx`, así el usuario puede navegar a otras secciones desde una página 404.

**Diferencia con un 404 del servidor**: este es un 404 *del cliente* (React Router). El servidor de Vite siempre devuelve `index.html` y la SPA decide qué renderizar según la URL. En producción, hay que configurar el web server para que cualquier path no estático sirva `index.html` — pero eso es config de despliegue, no del front.
