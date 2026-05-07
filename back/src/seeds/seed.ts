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

import "reflect-metadata";
import { AppDataSource } from "../config/data-source";
import { Book, BookStatus, Genre } from "../entities/Book";
import { Member, MemberStatus } from "../entities/Member";
import { Loan, LoanStatus } from "../entities/Loan";

const LOAN_DAYS = 14;

// Función auxiliar para sumar días a una fecha
const addDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

async function seed() {
  await AppDataSource.initialize();
  console.log("🌱 Iniciando seed.\n");

  const bookRepo = AppDataSource.getRepository(Book);
  const memberRepo = AppDataSource.getRepository(Member);
  const loanRepo = AppDataSource.getRepository(Loan);

  // ---------- Libros ----------
  // Géneros variados, al menos uno WITHDRAWN y uno con availableCopies < totalCopies.
  const booksData: Array<{
    isbn: string;
    title: string;
    author: string;
    genre: Genre;
    totalCopies: number;
    availableCopies: number;
    status: BookStatus;
  }> = [
    {
      isbn: "978-0307474728",
      title: "Cien años de soledad",
      author: "Gabriel García Márquez",
      genre: Genre.FICTION,
      totalCopies: 3,
      availableCopies: 3,
      status: BookStatus.AVAILABLE,
    },
    {
      isbn: "978-0345803481",
      title: "Sapiens: De animales a dioses",
      author: "Yuval Noah Harari",
      genre: Genre.HISTORY,
      totalCopies: 3,
      availableCopies: 2, // available < total (un ejemplar prestado fuera del seed)
      status: BookStatus.AVAILABLE,
    },
    {
      isbn: "978-0132350884",
      title: "Clean Code",
      author: "Robert C. Martin",
      genre: Genre.TECHNOLOGY,
      totalCopies: 4,
      availableCopies: 4,
      status: BookStatus.AVAILABLE,
    },
    {
      isbn: "978-0061120084",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: Genre.FICTION,
      totalCopies: 2,
      availableCopies: 2,
      status: BookStatus.WITHDRAWN, // retirado
    },
    {
      isbn: "978-0064404990",
      title: "Charlotte's Web",
      author: "E. B. White",
      genre: Genre.CHILDREN,
      totalCopies: 5,
      availableCopies: 5,
      status: BookStatus.AVAILABLE,
    },
    {
      isbn: "978-0140449136",
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      genre: Genre.SCIENCE,
      totalCopies: 2,
      availableCopies: 2,
      status: BookStatus.AVAILABLE,
    },
  ];

  // Para facilitar la creación de préstamos, guardamos los libros creados en un Map por su ISBN.
  const booksByIsbn = new Map<string, Book>();
  for (const data of booksData) {
    let book = await bookRepo.findOne({ where: { isbn: data.isbn } });
    if (!book) {
      book = await bookRepo.save(bookRepo.create(data));
      console.log(`+ Book  ${data.isbn}  ${data.title}`);
    } else {
      console.log(`= Book  ${data.isbn}  ya existe, skip`);
    }
    booksByIsbn.set(data.isbn, book);
  }

  // ---------- Socios ----------
  const membersData: Array<{
    memberNumber: string;
    name: string;
    email: string;
    status: MemberStatus;
  }> = [
    {
      memberNumber: "M-001",
      name: "Lautaro Ruiz",
      email: "lautaro@example.com",
      status: MemberStatus.ACTIVE,
    },
    {
      memberNumber: "M-002",
      name: "María Fernández",
      email: "maria@example.com",
      status: MemberStatus.ACTIVE,
    },
    {
      memberNumber: "M-003",
      name: "Carlos Pérez",
      email: "carlos@example.com",
      status: MemberStatus.SUSPENDED,
    },
    {
      memberNumber: "M-004",
      name: "Sofía Gómez",
      email: "sofia@example.com",
      status: MemberStatus.ACTIVE,
    },
  ];

  // Guardamos los miembros creados en un Map por su memberNumber para facilitar la creación de préstamos.
  const membersByNumber = new Map<string, Member>();
  for (const data of membersData) {
    let member = await memberRepo.findOne({
      where: { memberNumber: data.memberNumber },
    });
    if (!member) {
      member = await memberRepo.save(memberRepo.create(data));
      console.log(`+ Member ${data.memberNumber}  ${data.name}`);
    } else {
      console.log(`= Member ${data.memberNumber}  ya existe, skip`);
    }
    membersByNumber.set(data.memberNumber, member);
  }

  // ---------- Préstamos ----------
  // Idempotencia: para cada par (book, member) del plan, si ya existe un préstamo
  // entre ellos, se considera ya seedeado y se saltea (no se duplica ni se vuelve
  // a decrementar availableCopies).
  const now = new Date();
  const daysAgo = (n: number) =>
    new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

  const loansData: Array<{
    bookIsbn: string;
    memberNumber: string;
    loanDate: Date;
    status: LoanStatus;
    returnDate: Date | null;
  }> = [
    // ACTIVE en término (dueDate en el futuro)
    {
      bookIsbn: "978-0307474728",
      memberNumber: "M-001",
      loanDate: daysAgo(3),
      status: LoanStatus.ACTIVE,
      returnDate: null,
    },
    // RETURNED (ya devuelto)
    {
      bookIsbn: "978-0132350884",
      memberNumber: "M-002",
      loanDate: daysAgo(20),
      status: LoanStatus.RETURNED,
      returnDate: daysAgo(8),
    },
    // ACTIVE pero vencido (dueDate en el pasado)
    {
      bookIsbn: "978-0064404990",
      memberNumber: "M-004",
      loanDate: daysAgo(20),
      status: LoanStatus.ACTIVE,
      returnDate: null,
    },
  ];

  // Para cada préstamo del plan, buscamos el libro y miembro correspondientes. Si no existen, se saltea (no se crea el préstamo).
  for (const data of loansData) {
    const book = booksByIsbn.get(data.bookIsbn);
    const member = membersByNumber.get(data.memberNumber);
    if (!book || !member) continue;

    const existing = await loanRepo.findOne({
      where: { book: { id: book.id }, member: { id: member.id } },
    });
    if (existing) {
      console.log(
        `= Loan  ${book.isbn} → ${member.memberNumber}  ya existe, skip`,
      );
      continue;
    }

    // Sólo descontamos copias para préstamos que no fueron devueltos.
    if (data.status === LoanStatus.ACTIVE && data.returnDate === null) {
      if (book.availableCopies <= 0) {
        throw new Error(
          `No se puede crear préstamo activo del libro ${book.isbn}: sin copias disponibles`,
        );
      }
      book.availableCopies -= 1;
      await bookRepo.save(book);
    }

    const loan = loanRepo.create({
      book,
      member,
      loanDate: data.loanDate,
      dueDate: addDays(data.loanDate, LOAN_DAYS),
      returnDate: data.returnDate,
      status: data.status,
    });
    await loanRepo.save(loan);
    console.log(
      `+ Loan  ${book.isbn} → ${member.memberNumber}  [${data.status}${
        data.status === LoanStatus.ACTIVE &&
        addDays(data.loanDate, LOAN_DAYS) < now
          ? " · vencido"
          : ""
      }]`,
    );
  }

  console.log("Seed completo");
}

seed()
  .catch((err) => {
    console.error("Seed falló:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });
