# Student Information Management System - System Design Document

## 1. Overview

### 1.1 Purpose
This document outlines the system design for a Student Information Management System (SIMS) built with Next.js. The system allows users to perform CRUD operations on student records with a clean, responsive interface.

### 1.2 Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Chakra UI
- **Data Storage**: In-memory database (JSON file-based for persistence)
- **Testing**: Jest + React Testing Library
- **Package Manager**: Yarn

## 2. Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Student    │  │   Student    │  │   Add/Edit   │     │
│  │  List Page   │  │  Detail Page │  │    Forms     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Next.js API Routes                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ GET /api/    │  │ POST /api/   │  │ PUT /api/    │     │
│  │  students    │  │  students    │  │  students/[id]│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ GET /api/    │  │ DELETE /api/ │                        │
│  │  students/[id]│ │  students/[id]│                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Access Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         StudentService (Business Logic)              │   │
│  │  - CRUD operations                                    │   │
│  │  - Data validation                                    │   │
│  │  - Search/Filter logic                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         StudentRepository (Data Persistence)         │   │
│  │  - File-based storage (students.json)                │   │
│  │  - In-memory cache                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Design Patterns

#### 2.2.1 Repository Pattern
- **Purpose**: Abstract data access logic from business logic
- **Implementation**: `StudentRepository` handles all file I/O operations
- **Benefits**: Easy to swap storage mechanisms (file → database) without changing business logic

#### 2.2.2 Service Layer Pattern
- **Purpose**: Encapsulate business logic and validation
- **Implementation**: `StudentService` contains all business rules
- **Benefits**: Separation of concerns, testability, reusability

#### 2.2.3 Component Composition
- **Purpose**: Build reusable UI components
- **Implementation**: Shared components (FormInput, StudentCard, etc.)
- **Benefits**: DRY principle, consistent UI, easier maintenance

## 3. Data Model

### 3.1 Student Entity

```typescript
interface Student {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Full name (required, 2-100 chars)
  registrationNumber: string;    // Unique reg number (required, format: YYYY######)
  major: string;                 // Field of study (required, 2-100 chars)
  dob: string;                   // Date of birth (ISO 8601 format: YYYY-MM-DD)
  gpa: number;                   // Grade Point Average (0.0 - 4.0)
}
```

### 3.2 Validation Rules

- **Name**: Required, 2-100 characters, alphanumeric + spaces
- **Registration Number**: Required, unique, format: YYYY###### (e.g., 202401234)
- **Major**: Required, 2-100 characters
- **Date of Birth**: Required, valid date, must be in the past, age >= 16
- **GPA**: Required, number between 0.0 and 4.0, max 2 decimal places

## 4. API Design

### 4.1 Endpoints

#### GET /api/students
- **Purpose**: Retrieve all students (with optional filtering)
- **Query Parameters**: 
  - `search` (optional): Filter by name, registration number, or major
  - `minGpa` (optional): Minimum GPA filter
  - `maxGpa` (optional): Maximum GPA filter
- **Response**: `{ students: Student[] }`
- **Status Codes**: 200 (success), 500 (server error)

#### GET /api/students/[id]
- **Purpose**: Retrieve a single student by ID
- **Response**: `{ student: Student }`
- **Status Codes**: 200 (success), 404 (not found), 500 (server error)

#### POST /api/students
- **Purpose**: Create a new student
- **Request Body**: `Student` (without id)
- **Response**: `{ student: Student }`
- **Status Codes**: 201 (created), 400 (validation error), 409 (duplicate registration number), 500 (server error)

#### PUT /api/students/[id]
- **Purpose**: Update an existing student
- **Request Body**: `Partial<Student>` (without id)
- **Response**: `{ student: Student }`
- **Status Codes**: 200 (success), 400 (validation error), 404 (not found), 409 (duplicate registration number), 500 (server error)

#### DELETE /api/students/[id]
- **Purpose**: Delete a student
- **Response**: `{ message: string }`
- **Status Codes**: 200 (success), 404 (not found), 500 (server error)

### 4.2 Error Response Format

```typescript
interface ApiError {
  error: string;
  details?: Record<string, string[]>; // Field-level validation errors
}
```

## 5. Page Structure

### 5.1 Student List Page (`/students`)

**Rendering Strategy**: Server-Side Rendering (SSR) using `getServerSideProps`
- **Rationale**: Data changes frequently, needs real-time updates
- **Features**:
  - Display all students in a responsive grid/list
  - Search bar (name, registration number, major)
  - GPA range filter
  - Link to detail page for each student
  - Link to add new student

**Component Structure**:
```
StudentListPage
├── SearchBar
├── FilterControls
└── StudentCard[] (or StudentTable)
```

### 5.2 Student Detail Page (`/students/[id]`)

**Rendering Strategy**: Server-Side Rendering (SSR) using `getServerSideProps`
- **Rationale**: Dynamic content, needs real-time data
- **Features**:
  - Display all student information
  - Edit button (links to edit page)
  - Delete button (with confirmation)
  - Back to list link

**Component Structure**:
```
StudentDetailPage
├── StudentProfile
└── ActionButtons (Edit, Delete)
```

### 5.3 Add Student Page (`/students/new`)

**Rendering Strategy**: Client-Side Rendering (CSR)
- **Rationale**: Form interaction, no initial data needed
- **Features**:
  - Form with all required fields
  - Client-side validation
  - Submit to POST /api/students
  - Success redirect to detail page
  - Error handling and display

**Component Structure**:
```
AddStudentPage
└── StudentForm
    ├── FormInput (Name)
    ├── FormInput (Registration Number)
    ├── FormInput (Major)
    ├── FormInput (Date of Birth)
    ├── FormInput (GPA)
    └── SubmitButton
```

### 5.4 Edit Student Page (`/students/[id]/edit`)

**Rendering Strategy**: Server-Side Rendering (SSR) using `getServerSideProps`
- **Rationale**: Pre-populate form with existing data
- **Features**:
  - Pre-filled form with student data
  - Client-side validation
  - Submit to PUT /api/students/[id]
  - Success redirect to detail page
  - Error handling and display

**Component Structure**:
```
EditStudentPage
└── StudentForm (pre-filled)
```

## 6. Data Flow

### 6.1 Create Student Flow

```
User fills form → Client validation → POST /api/students 
→ Server validation → StudentService.create() 
→ StudentRepository.save() → Write to file 
→ Return created student → Redirect to detail page
```

### 6.2 Update Student Flow

```
User clicks edit → Load student data (SSR) → Pre-fill form 
→ User modifies → Client validation → PUT /api/students/[id] 
→ Server validation → StudentService.update() 
→ StudentRepository.update() → Write to file 
→ Return updated student → Redirect to detail page
```

### 6.3 Delete Student Flow

```
User clicks delete → Confirmation dialog → DELETE /api/students/[id] 
→ StudentService.delete() → StudentRepository.delete() 
→ Write to file → Return success → Redirect to list page
```

## 7. File Structure

```
edtech-app/
├── README.md
├── SYSTEM_DESIGN.md
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── jest.config.js
├── public/
│   └── (static assets)
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (home/redirect)
│   │   ├── students/
│   │   │   ├── page.tsx (list)
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx (detail)
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   └── api/
│   │       └── students/
│   │           ├── route.ts (GET all, POST)
│   │           └── [id]/
│   │               └── route.ts (GET, PUT, DELETE)
│   ├── components/
│   │   ├── ui/ (Chakra UI wrappers)
│   │   ├── StudentCard.tsx
│   │   ├── StudentForm.tsx
│   │   ├── SearchBar.tsx
│   │   └── FilterControls.tsx
│   ├── lib/
│   │   ├── data/
│   │   │   ├── repository.ts (StudentRepository)
│   │   │   └── types.ts (Student interface)
│   │   ├── services/
│   │   │   └── studentService.ts
│   │   └── utils/
│   │       ├── validation.ts
│   │       └── constants.ts
│   └── __tests__/
│       ├── components/
│       ├── services/
│       └── api/
└── data/
    └── students.json (persistent storage)
```

## 8. State Management

### 8.1 Server State
- Managed by Next.js SSR/SSG
- Data fetched on server, passed as props

### 8.2 Client State
- Form state: React `useState` hooks
- Search/Filter state: URL query parameters (for shareable links)
- UI state (modals, loading): React `useState` hooks

**Rationale**: No need for complex state management (Redux/Zustand) for this scope. React hooks + URL state sufficient.

## 9. Error Handling

### 9.1 Client-Side
- Form validation errors displayed inline
- API errors shown via toast notifications (Chakra UI)
- Loading states for async operations

### 9.2 Server-Side
- Validation errors return 400 with field details
- Not found errors return 404
- Server errors return 500 with generic message
- All errors logged for debugging

## 10. Testing Strategy

### 10.1 Unit Tests
- **Services**: Business logic, validation
- **Components**: Form validation, user interactions
- **Utils**: Helper functions

### 10.2 Integration Tests
- **API Routes**: End-to-end API testing
- **Pages**: SSR/SSG data fetching

### 10.3 Test Coverage Goals
- Critical paths: 80%+
- Business logic: 90%+
- UI components: 70%+

## 11. Performance Considerations

### 11.1 Optimization Strategies
- **Code Splitting**: Automatic via Next.js dynamic imports
- **Image Optimization**: Next.js Image component (if needed)
- **Caching**: 
  - API responses cached in-memory (short TTL)
  - Static assets cached by CDN
- **Bundle Size**: Tree-shaking, minimal dependencies

### 11.2 Scalability
- Current: File-based storage (suitable for < 10K records)
- Future: Can migrate to database (PostgreSQL/MongoDB) by swapping Repository implementation

## 12. Security Considerations

### 12.1 Input Validation
- Client-side: Immediate feedback
- Server-side: Always validate (never trust client)

### 12.2 Data Sanitization
- Sanitize all user inputs
- Prevent XSS attacks
- Validate file operations

### 12.3 API Security
- Rate limiting (future enhancement)
- CORS configuration
- Input size limits

## 13. Accessibility

### 13.1 WCAG Compliance
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Color contrast (Chakra UI defaults)

## 14. Future Enhancements

1. **Database Migration**: Replace file storage with PostgreSQL/MongoDB
2. **Authentication**: JWT-based auth with role-based access
3. **Pagination**: For large student lists
4. **Export**: CSV/PDF export functionality
5. **Audit Log**: Track all changes to student records
6. **Bulk Operations**: Import/export multiple students
7. **Advanced Search**: Full-text search with filters

## 15. Development Guidelines

### 15.1 Code Standards
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Consistent naming conventions (camelCase for variables, PascalCase for components)
- Component files: PascalCase (e.g., `StudentCard.tsx`)
- Utility files: camelCase (e.g., `validation.ts`)

### 15.2 Git Workflow
- Feature branches for new features
- Descriptive commit messages
- PR reviews before merge

### 15.3 Documentation
- JSDoc comments for public APIs
- README with setup instructions
- Inline comments for complex logic only

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Author**: Senior Frontend Engineer

