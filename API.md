# API Documentation

Base URL: `/api/v1`

All admin endpoints require:

```http
Authorization: Bearer <jwt>
```

## Auth

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/login` | Public | Login with email and password |
| GET | `/auth/me` | Admin | Return the authenticated user |

## Projects

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/projects` | Public | List published projects |
| GET | `/projects/:slug` | Public | Get one published project |
| POST | `/projects` | Admin | Create a project |
| PATCH | `/projects/:id` | Admin | Update a project |
| DELETE | `/projects/:id` | Admin | Delete a project |

## Blog Posts

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/blog` | Public | List published posts |
| GET | `/blog/:slug` | Public | Get one published post |
| POST | `/blog` | Admin | Create a post |
| PATCH | `/blog/:id` | Admin | Update a post |
| DELETE | `/blog/:id` | Admin | Delete a post |

## Testimonials

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/testimonials` | Public | List featured testimonials |
| POST | `/testimonials` | Admin | Create a testimonial |
| PATCH | `/testimonials/:id` | Admin | Update a testimonial |
| DELETE | `/testimonials/:id` | Admin | Delete a testimonial |

## Contact Messages

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/contact` | Public | Submit a contact inquiry |
| GET | `/contact` | Admin | List inquiries |
| PATCH | `/contact/:id` | Admin | Update inquiry status |
| DELETE | `/contact/:id` | Admin | Delete an inquiry |

## Finance Entries

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/finance` | Admin | List finance rows |
| POST | `/finance` | Admin | Create a finance row |
| PATCH | `/finance/:id` | Admin | Update a finance row |
| DELETE | `/finance/:id` | Admin | Delete a finance row |

## Analytics

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/analytics/overview` | Admin | Counts, recent inquiries, and conversion indicators |

## Error Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": "email",
      "message": "Invalid email"
    }
  ]
}
```
