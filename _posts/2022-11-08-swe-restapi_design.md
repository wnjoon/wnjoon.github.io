---
layout: post
title:  "How to make better REST API" 
description: Introduce 15 steps to make better REST API
date:   2022-11-08 15:00:00 +0900
categories: dev
keywords: restapi, web
comments: true
---

## Table of Contents

- [Summary](#summary)
- [What is a REST API?](#what-is-a-rest-api)
  - [Key Features of REST API](#key-features-of-rest-api)
  - [Why Use REST APIs?](#why-use-rest-apis)
- [REST API Design Best Practices](#rest-api-design-best-practices)
  - [1. Naming Conventions for Endpoints](#1-naming-conventions-for-endpoints)
  - [2. Use JSON as the Standard Format](#2-use-json-as-the-standard-format)
  - [3. Use HTTP Status Codes Properly](#3-use-http-status-codes-properly)
  - [4. Use Consistent Response Formats](#4-use-consistent-response-formats)
  - [5. Implement Pagination for Large Data](#5-implement-pagination-for-large-data)
  - [6. Use PATCH Instead of PUT for Partial Updates](#6-use-patch-instead-of-put-for-partial-updates)
  - [7. Provide an Extended Response Option](#7-provide-an-extended-response-option)
  - [8. Keep Endpoints Focused](#8-keep-endpoints-focused)
  - [9. Document Your API](#9-document-your-api)
  - [10. Implement Security Best Practices](#10-implement-security-best-practices)
  - [11. Version Your API](#11-version-your-api)
  - [12. Cache Frequently Used Data](#12-cache-frequently-used-data)
  - [13. Use UTC Time Format](#13-use-utc-time-format)
  - [14. Health Check Endpoint](#14-health-check-endpoint)
  - [15. API Rate Limits & Throttling](#15-api-rate-limits--throttling)

## Summary

A well-designed REST API follows best practices such as:

- Clear naming conventions
- Proper HTTP status codes
- Consistent JSON response formats
- Security & authentication
- API versioning & caching

## What is a REST API?

REST (Representational State Transfer) is an architectural style that defines a standardized way of communication between web services. RESTful APIs follow a set of constraints that make them simple, scalable, and efficient for web-based applications.

![rest-api](https://res.cloudinary.com/practicaldev/image/fetch/s--YTDTEgpk--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/ekawmj3rafdtn06hzj79.png)
@ picture: from cloudinary

### Key Features of REST API

- Uses HTTP Web Standards
  - Data is represented in URLs making it platform-independent.
  - Takes advantage of HTTP caching to improve performance.
- Stateless Communication
  - REST APIs do not store client session data on the server.
  - The client and server are loosely coupled, reducing dependencies.
- Self-Descriptive Messages
  - API requests are easy to understand based on their structure.
- Layered System Architecture
  - Different layers (e.g., security, load balancing, encryption) can be introduced to enhance functionality.
  - Uses proxies and gateways as intermediate components.

### Why Use REST APIs?

REST APIs allow scalable and maintainable communication between servers and clients.
They are easy to understand, follow web standards, and enable modular development.

## REST API Design Best Practices

How do we design a good REST API?
Like writing clean code, there are established best practices for creating RESTful APIs.

### 1. Naming Conventions for Endpoints

#### Use Nouns Instead of Verbs

HTTP methods already indicate actions, so RESTful endpoints should focus on resources (nouns).

| HTTP Method | Purpose |
| --- | --- |
| GET | Retrieve data |
| POST | Send new data |
| PUT/PATCH | Update existing data |
| DELETE | Remove data |

If you are building an API for managing books, consider these two variations:

- GET /books (Recommended)
- GET /get-books (Redundant verb usage)

When reading the API out loud:

- GET /books → “Get books” (Sounds natural)
- GET /get-books → “Get get-books” (Unnecessary repetition)

Singular vs. Plural:

- Use plural nouns for resource names (/books instead of /book).
- A single book is accessed via GET /books/{id}.
- Maintain consistency—if you use plural (/books), always stick to it.

#### Use Hyphens (-) Instead of Underscores (_)

If an endpoint name contains multiple words, use hyphens (-) instead of underscores (_).

- GET /books/fantasycategory (Bad Example)
- GET /books/fantasy-category (Good Example)

#### Use Lowercase Letters

URLs should always be lowercase to avoid case sensitivity issues across different operating systems.

- GET /Books (Bad Example)
- GET /books (Good Example)

### 2. Use JSON as the Standard Format

JSON (JavaScript Object Notation) is the preferred format for REST APIs because:

- It is human-readable and easy to parse.
- It is lightweight compared to XML.
- It is language-independent and widely supported.

Ensure your API specifies Content-Type: `application/json` in the request headers.

### 3. Use HTTP Status Codes Properly

HTTP provides standardized status codes that indicate the result of API requests.

| Status | Code | Meaning |
| --- | --- | --- |
| 200 | OK | Request was successful |
| 201 | Created | Resource was successfully created (POST) |
| 301 | Moved Permanently | Resource has a new URL |
| 400 | Bad Request | Client error (e.g., invalid input) |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Requested resource does not exist |
| 405 | Method Not Allowed | The requested HTTP method is not supported |
| 500 | Internal Server Error | Server encountered an issue |

**Tip:** Avoid using too many different status codes—stick to a minimal, meaningful set.

### 4. Use Consistent Response Formats

Ensure that API responses follow a structured format to maintain predictability. Instead, rely on HTTP status codes to indicate success.

Example 1. Fetching Books:

```sh
{
   "data": [
     {
       "bookId": 1,
       "name": "Harry Potter"
     },
     {
       "bookId": 2,
       "name": "Avatar"
     }
   ],
   "totalDocs": 200,
   "nextPageId": 3
}
```

Example 2. Error Response:

```sh
{
  "code": "book/not_found",
  "message": "Book with ID 4 not found."
}
```

Example 3. Avoid redundant success messages like:

```sh
{
  "message": "Book successfully added!"
}
```

### 5. Implement Pagination for Large Data

When retrieving large datasets, avoid returning all results at once.
Instead, use pagination with `limit`, `offset`, or `cursor-based` approaches.

```sh
# Retrieve 20 fantasy books
GET /books?limit=20&category=fantasy
```

### 6. Use PATCH Instead of PUT for Partial Updates

- `PUT`: Updates the entire resource.
- `PATCH`: Updates specific fields only.

```sh
PATCH /books/1
{
   "name": "Updated Book Title"
}
```

Most use cases require updating only a few fields, so prefer `PATCH`.

### 7. Provide an Extended Response Option

If an API has large amounts of data, provide a way to retrieve `extended` details when needed.

```sh
GET /books/{id}            # Returns basic details
GET /books/{id}?extended=true  # Returns detailed information
```

### 8. Keep Endpoints Focused

Each API endpoint should serve a single purpose.

#### Bad Example

- GET /books-and-authors

#### Good Examples

- GET /books
- GET /authors

### 9. Document Your API

A well-documented API helps developers understand and integrate it efficiently.

Good API Documentation Should Include:

- API purpose
- Required authentication
- Request/Response examples
- Error codes and messages
- Version changes

Recommended tools:

- Swagger (OpenAPI) for API documentation
- Postman for testing and documenting requests

### 10. Implement Security Best Practices

Ensure secure communication by enforcing SSL (HTTPS).
Use CORS (Cross-Origin Resource Sharing) policies to control API access.

Common Security Measures

- API Key authentication (X-Api-Key)
- JWT (JSON Web Token) authentication
- OAuth for user-based access control

### 11. Version Your API

If an API undergoes major changes, versioning prevents breaking existing clients.

```sh
# Version 1
GET /v1/books

# Version 2
GET /v2/books
```

### 12. Cache Frequently Used Data

If a resource does not change often, enable caching to reduce load.

```yaml
Cache-Control: public, max-age=3600
```

### 13. Use UTC Time Format

Always return timestamps in UTC to avoid timezone inconsistencies.

```sh
{
    "createdAt": "2025-03-17T15:00:00Z"
}
```

### 14. Health Check Endpoint

Provide a dedicated health check API to monitor service status.

```sh
GET /health
```

### 15. API Rate Limits & Throttling

To prevent abuse, apply rate limits to API requests.

Example:

- Allow 100 requests per minute per user.
- Return 429 Too Many Requests when exceeded.
