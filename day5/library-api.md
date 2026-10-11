# Library API Design: Books

A REST API for managing the books in a library. All paths start with `/books`, all request and response bodies use JSON, and every book looks like this:

```json
{
  "id": 7,
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "isbn": "9780385474542",
  "publishedYear": 1958,
  "available": true
}
```

## Endpoints

### 1. List all books
- **Method:** `GET`
- **Path:** `/books`
- **Description:** Returns every book in the library.
- **Request body:** none
- **Success status:** `200 OK`

### 2. Get one book
- **Method:** `GET`
- **Path:** `/books/{id}`
- **Description:** Returns the single book with the given id.
- **Request body:** none
- **Success status:** `200 OK`

### 3. Create a book
- **Method:** `POST`
- **Path:** `/books`
- **Description:** Adds a new book to the library; the server assigns the id.
- **Example request body:**
  ```json
  {
    "title": "Weep Not, Child",
    "author": "Ngugi wa Thiong'o",
    "isbn": "9780435908300",
    "publishedYear": 1964
  }
  ```
- **Success status:** `201 Created`

### 4. Update a book
- **Method:** `PUT`
- **Path:** `/books/{id}`
- **Description:** Replaces all the details of an existing book.
- **Example request body:**
  ```json
  {
    "title": "Weep Not, Child",
    "author": "Ngugi wa Thiong'o",
    "isbn": "9780435908300",
    "publishedYear": 1964,
    "available": false
  }
  ```
- **Success status:** `200 OK`

### 5. Delete a book
- **Method:** `DELETE`
- **Path:** `/books/{id}`
- **Description:** Permanently removes the book from the library.
- **Request body:** none
- **Success status:** `204 No Content`

### 6. List books by an author
- **Method:** `GET`
- **Path:** `/books?author={name}`
- **Example:** `/books?author=Chinua%20Achebe`
- **Description:** Returns only the books written by the given author.
- **Request body:** none
- **Success status:** `200 OK` (an empty list `[]` if the author has no books)

## Error codes

### 400 Bad Request
The request is wrong or incomplete, so the server cannot process it.
- **Example 1:** `POST /books` with a body that has no `title`.
- **Example 2:** `PUT /books/7` where `publishedYear` is the text `"nineteen fifty"` instead of a number.

Example response:
```json
{ "error": "Bad Request", "message": "The field 'title' is required." }
```

### 404 Not Found
The book (or path) being asked for does not exist.
- **Example 1:** `GET /books/9999` when no book has the id 9999.
- **Example 2:** `DELETE /books/9999` when that book was already deleted.

Example response:
```json
{ "error": "Not Found", "message": "No book exists with id 9999." }
```
