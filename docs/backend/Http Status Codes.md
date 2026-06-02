# 🌐 HTTP Status Codes Reference

HTTP status codes are standardized responses returned by a server to indicate the result of a client's request.  
They are grouped into **five categories** based on the first digit.

---

## 1️⃣ Informational Responses (1XX)

| Status Range | Use Case    | Status Code | Meaning / Use Case                                                               |
| ------------ | ----------- | ----------- | -------------------------------------------------------------------------------- |
| 1XX          | Information | 100         | Continue — Request received, client should continue sending body                 |
| 1XX          | Information | 101         | Switching Protocols — Server switching to a different protocol (e.g., WebSocket) |
| 1XX          | Information | 102         | Processing — Server has received and is processing (WebDAV)                      |
| 1XX          | Information | 103         | Early Hints — Used for preloading resources                                      |

---

## 2️⃣ Successful Responses (2XX)

| Status Range | Use Case | Status Code | Meaning / Use Case                                                    |
| ------------ | -------- | ----------- | --------------------------------------------------------------------- |
| 2XX          | Success  | 200         | OK — Request successful                                               |
| 2XX          | Success  | 201         | Created — Resource successfully created (POST/PUT)                    |
| 2XX          | Success  | 202         | Accepted — Request accepted but processing not completed              |
| 2XX          | Success  | 204         | No Content — Successful but no response body                          |
| 2XX          | Success  | 206         | Partial Content — Used in range requests (video streaming, downloads) |

---

## 3️⃣ Redirection Messages (3XX)

| Status Range | Use Case    | Status Code | Meaning / Use Case                                        |
| ------------ | ----------- | ----------- | --------------------------------------------------------- |
| 3XX          | Redirection | 301         | Moved Permanently — Resource permanently moved to new URL |
| 3XX          | Redirection | 302         | Found / Temporary Redirect — Temporary redirection        |
| 3XX          | Redirection | 303         | See Other — Redirect to GET request                       |
| 3XX          | Redirection | 307         | Temporary Redirect — Same method retained                 |
| 3XX          | Redirection | 308         | Permanent Redirect — Same method retained permanently     |

---

## 4️⃣ Client Error Responses (4XX)

| Status Range | Use Case     | Status Code | Meaning / Use Case                          |
| ------------ | ------------ | ----------- | ------------------------------------------- |
| 4XX          | Client Error | 400         | Bad Request — Invalid request syntax        |
| 4XX          | Client Error | 401         | Unauthorized — Authentication required      |
| 4XX          | Client Error | 403         | Forbidden — Server understands but refuses  |
| 4XX          | Client Error | 404         | Not Found — Resource not found              |
| 4XX          | Client Error | 405         | Method Not Allowed — Wrong HTTP method      |
| 4XX          | Client Error | 408         | Request Timeout — Client took too long      |
| 4XX          | Client Error | 409         | Conflict — Duplicate or conflicting request |
| 4XX          | Client Error | 413         | Payload Too Large — File too big            |
| 4XX          | Client Error | 415         | Unsupported Media Type — Wrong content type |
| 4XX          | Client Error | 429         | Too Many Requests — Rate limiting           |

---

## 5️⃣ Server Error Responses (5XX)

| Status Range | Use Case     | Status Code | Meaning / Use Case                              |
| ------------ | ------------ | ----------- | ----------------------------------------------- |
| 5XX          | Server Error | 500         | Internal Server Error — Generic backend failure |
| 5XX          | Server Error | 501         | Not Implemented — Endpoint not supported        |
| 5XX          | Server Error | 502         | Bad Gateway — Invalid upstream response         |
| 5XX          | Server Error | 503         | Service Unavailable — Server down or overloaded |
| 5XX          | Server Error | 504         | Gateway Timeout — Upstream server timeout       |
| 5XX          | Server Error | 505         | HTTP Version Not Supported                      |

---

## 🧠 Quick Memory Trick

| Range | Meaning                      |
| ----- | ---------------------------- |
| 1XX   | Wait                         |
| 2XX   | Success                      |
| 3XX   | Go somewhere else            |
| 4XX   | You messed up (Client error) |
| 5XX   | Server messed up             |

---

## 💡 Common Real-World Examples

- **Login API wrong password → `401`**
- **Wrong API URL → `404`**
- **Form validation fail → `400`**
- **File uploaded successfully → `201`**
- **Backend crash → `500`**
- **Too many API calls → `429`**
