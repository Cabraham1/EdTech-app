# Student Information Management System

A modern, full-stack Student Information Management System built with Next.js 14, TypeScript, Tailwind CSS, and Chakra UI. This application allows users to perform CRUD operations on student records with a clean, responsive interface.

## Features

### Core Functionality
- ✅ **Authentication** - Login page with protected routes
- ✅ **Student List Page** - View all students with statistics dashboard
- ✅ **Student Detail Page** - View complete student profile information
- ✅ **Add Student** - Create new student records with form validation
- ✅ **Edit Student** - Update existing student information
- ✅ **Delete Student** - Remove students from the system with confirmation
- ✅ **Search & Filter** - Search by name, registration number, or major; filter by GPA range
- ✅ **Navigation** - Header, Footer, and Sidebar for easy navigation

### Technical Features
- ✅ **Server-Side Rendering (SSR)** - Student list and detail pages use SSR for optimal performance
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Form Validation** - Client-side and server-side validation with detailed error messages
- ✅ **Responsive Design** - Mobile-first design using Tailwind CSS and Chakra UI
- ✅ **API Routes** - RESTful API endpoints for all CRUD operations
- ✅ **Client-Side Storage** - localStorage for data persistence across page reloads
- ✅ **Unit Tests** - Test coverage for validation and service layers

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Chakra UI
- **Form Handling**: React Hook Form
- **Data Storage**: localStorage (client-side) + in-memory (server-side)
- **Testing**: Jest + React Testing Library
- **Package Manager**: Yarn

## Project Structure

```
edtech-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   └── students/       # Student CRUD endpoints
│   │   ├── students/           # Student pages
│   │   │   ├── page.tsx        # List page (SSR)
│   │   │   ├── new/            # Add student page
│   │   │   └── [id]/           # Dynamic routes
│   │   │       ├── page.tsx    # Detail page (SSR)
│   │   │       └── edit/       # Edit student page
│   │   ├── layout.tsx          # Root layout with AppLayout
│   │   ├── providers.tsx       # ChakraProvider + AuthProvider
│   │   ├── login/              # Login page
│   │   │   └── page.tsx
│   │   └── page.tsx            # Home page (redirects to /login)
│   ├── components/             # React components
│   │   ├── AppLayout.tsx       # Main layout wrapper
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Footer component
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── ProtectedRoute.tsx  # Authentication guard
│   │   ├── StudentCard.tsx     # Student card component
│   │   ├── StudentForm.tsx     # Reusable form component
│   │   ├── SearchBar.tsx       # Search functionality
│   │   ├── FilterControls.tsx  # GPA filter controls
│   │   └── DeleteButton.tsx    # Delete confirmation dialog
│   ├── lib/
│   │   ├── data/               # Data layer
│   │   │   ├── repository.ts   # Repository pattern implementation
│   │   │   └── types.ts        # TypeScript interfaces
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.tsx # Authentication context
│   │   ├── services/           # Business logic layer
│   │   │   └── studentService.ts
│   │   ├── utils/              # Utility functions
│   │   │   ├── validation.ts   # Validation logic
│   │   │   └── constants.ts    # Constants and config
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useDebouncedCallback.ts
│   │   │   └── useStudentStorage.ts
│   │   └── storage/            # Storage utilities
│   │       └── localStorage.ts # localStorage helpers
│   └── __tests__/              # Unit tests
│       ├── utils/
│       └── services/
└── README.md                   # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EdTech-app
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Run the development server**
   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

The application will automatically redirect to `/login`. Use any email and password to login (demo mode), then you'll be redirected to `/students` where you can view the student list.

### Building for Production

```bash
yarn build
yarn start
```

## API Endpoints

### GET /api/students
Fetch all students with optional filtering.

**Query Parameters:**
- `search` (optional): Filter by name, registration number, or major
- `minGpa` (optional): Minimum GPA filter
- `maxGpa` (optional): Maximum GPA filter

**Example:**
```bash
GET /api/students?search=John&minGpa=3.0&maxGpa=4.0
```

**Response:**
```json
{
  "students": [
    {
      "id": "1",
      "name": "John Doe",
      "registrationNumber": "202401234",
      "major": "Computer Science",
      "dob": "2001-05-05",
      "gpa": 3.8
    }
  ]
}
```

### GET /api/students/[id]
Fetch a single student by ID.

**Response:**
```json
{
  "student": {
    "id": "1",
    "name": "John Doe",
    "registrationNumber": "202401234",
    "major": "Computer Science",
    "dob": "2001-05-05",
    "gpa": 3.8
  }
}
```

### POST /api/students
Create a new student.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "registrationNumber": "202401245",
  "major": "Mechanical Engineering",
  "dob": "2002-05-21",
  "gpa": 3.6
}
```

**Response:** `201 Created`
```json
{
  "student": {
    "id": "2",
    "name": "Jane Smith",
    ...
  }
}
```

### PUT /api/students/[id]
Update an existing student.

**Request Body:** (all fields optional)
```json
{
  "name": "Jane Doe",
  "gpa": 3.7
}
```

**Response:** `200 OK`

### DELETE /api/students/[id]
Delete a student.

**Response:** `200 OK`
```json
{
  "message": "Student deleted successfully"
}
```

## Validation Rules

### Name
- Required
- 2-100 characters
- Alphanumeric and spaces only

### Registration Number
- Required
- Exactly 9 digits (e.g., 202401234)
- Must be unique

### Major
- Required
- 2-100 characters

### Date of Birth
- Required
- Valid date format (YYYY-MM-DD)
- Cannot be in the future
- Student must be at least 16 years old

### GPA
- Required
- Number between 0.0 and 4.0
- Maximum 2 decimal places

## Testing

Run the test suite:

```bash
yarn test
```

Run tests in watch mode:

```bash
yarn test:watch
```

Generate coverage report:

```bash
yarn test:coverage
```

## Design Patterns & Architecture

This project follows several important design patterns:

### 1. **Repository Pattern**
The `StudentRepository` class abstracts data access logic, making it easy to swap storage mechanisms (file → database) without changing business logic.

### 2. **Service Layer Pattern**
The `StudentService` class encapsulates all business logic and validation, ensuring separation of concerns.

### 3. **Component Composition**
Reusable UI components (StudentCard, StudentForm, etc.) follow DRY principles and ensure consistent UI.

### 4. **Server-Side Rendering (SSR)**
Student list and detail pages use Next.js SSR for optimal performance and SEO.

## Development Approach

### Code Quality Standards
- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Next.js recommended configuration
- **Code Organization**: Clear separation between data, services, and UI layers
- **Error Handling**: Comprehensive error handling at all levels
- **Validation**: Both client-side and server-side validation

### Performance Considerations
- In-memory caching with TTL for frequently accessed data
- Debounced search to reduce API calls
- Server-side rendering for initial page loads
- Code splitting via Next.js automatic optimization

## Future Enhancements

Potential improvements for production:

1. **Database Integration**: Migrate from localStorage to PostgreSQL/MongoDB for multi-user support
2. **Enhanced Authentication**: Upgrade to JWT-based authentication with role-based access
3. **Pagination**: Add pagination for large student lists
4. **Export Functionality**: CSV/PDF export of student data
5. **Audit Logging**: Track all changes to student records
6. **Bulk Operations**: Import/export multiple students
7. **Advanced Search**: Full-text search with multiple filters

## License

ISC

## Author

Built as part of a frontend engineering assessment.

---

**Note**: This application uses localStorage for client-side persistence, which works great for single-user scenarios and serverless deployments. For multi-user support, consider migrating to a proper database system.
