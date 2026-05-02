// TODO: Implementar el script de seed
// Debe ser idempotente (ejecutarlo varias veces no duplica datos).
//
// Datos mínimos a insertar:
//
// Libros (mínimo 5):
//   - Géneros variados
//   - Al menos uno con status WITHDRAWN
//   - Al menos uno con availableCopies < totalCopies
//
// Socios (mínimo 4):
//   - Al menos uno con status SUSPENDED
//
// Préstamos (mínimo 3):
//   - Al menos uno ACTIVE (dueDate en el futuro)
//   - Al menos uno RETURNED (returnDate asignado)
//   - Al menos uno vencido (dueDate en el pasado, status ACTIVE)
//
// Estrategia de idempotencia sugerida:
//   - Buscar cada registro por su clave única (isbn, memberNumber) antes de insertarlo
//   - Si ya existe, saltearlo; si no, crearlo
//
// Inicializar AppDataSource antes de operar y cerrar la conexión al terminar.
