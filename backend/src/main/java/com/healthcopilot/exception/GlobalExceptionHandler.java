// package com.healthcopilot.exception;

// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.BadCredentialsException;
// import org.springframework.validation.FieldError;
// import org.springframework.web.bind.MethodArgumentNotValidException;
// import org.springframework.web.bind.annotation.ExceptionHandler;
// import org.springframework.web.bind.annotation.RestControllerAdvice;

// import java.time.LocalDateTime;
// import java.util.HashMap;
// import java.util.Map;

// @RestControllerAdvice
// public class GlobalExceptionHandler {

//     @ExceptionHandler(MethodArgumentNotValidException.class)
//     public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
//         Map<String, Object> body = new HashMap<>();
//         body.put("timestamp", LocalDateTime.now());
//         body.put("status", HttpStatus.BAD_REQUEST.value());
//         body.put("error", "Validation Error");

//         StringBuilder sb = new StringBuilder();
//         for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
//             if (sb.length() > 0) sb.append(", ");
//             sb.append(fieldError.getDefaultMessage());
//         }
//         body.put("message", sb.toString());
//         return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
//     }

//     @ExceptionHandler(BadCredentialsException.class)
//     public ResponseEntity<Map<String, Object>> handleBadCredentialsException(BadCredentialsException ex) {
//         Map<String, Object> body = new HashMap<>();
//         body.put("timestamp", LocalDateTime.now());
//         body.put("status", HttpStatus.UNAUTHORIZED.value());
//         body.put("error", "Unauthorized");
//         body.put("message", "Invalid email or password. Please try again.");
//         return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
//     }

//     @ExceptionHandler(RuntimeException.class)
//     public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
//         Map<String, Object> body = new HashMap<>();
//         body.put("timestamp", LocalDateTime.now());

//         String msg = ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred.";
//         HttpStatus status = HttpStatus.BAD_REQUEST;

//         if (msg.toLowerCase().contains("already in use") || msg.toLowerCase().contains("duplicate")) {
//             status = HttpStatus.CONFLICT;
//         }

//         body.put("status", status.value());
//         body.put("error", status.getReasonPhrase());
//         body.put("message", msg);
//         return new ResponseEntity<>(body, status);
//     }

//     @ExceptionHandler(Exception.class)
//     public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
//         Map<String, Object> body = new HashMap<>();
//         body.put("timestamp", LocalDateTime.now());
//         body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
//         body.put("error", "Server Error");
//         body.put("message", "Something went wrong on the server. Please try again later.");
//         return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
// }
package com.healthcopilot.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private ResponseEntity<Map<String, Object>> build(HttpStatus status, String error, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        return new ResponseEntity<>(body, status);
    }

    // 404 - unknown URL (e.g. opening the bare Render URL, /favicon.ico)
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NoResourceFoundException ex) {
        return build(HttpStatus.NOT_FOUND, "Not Found", "Resource not found");
    }

    // 405 - wrong HTTP method
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        return build(HttpStatus.METHOD_NOT_ALLOWED, "Method Not Allowed", ex.getMessage());
    }

    // 400 - malformed JSON body
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleUnreadable(HttpMessageNotReadableException ex) {
        return build(HttpStatus.BAD_REQUEST, "Bad Request", "Malformed or missing request body");
    }

    // 400 - @Valid failures
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        StringBuilder sb = new StringBuilder();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            if (sb.length() > 0)
                sb.append(", ");
            sb.append(fieldError.getDefaultMessage());
        }
        return build(HttpStatus.BAD_REQUEST, "Validation Error", sb.toString());
    }

    // 401 - wrong email/password
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentialsException(BadCredentialsException ex) {
        return build(HttpStatus.UNAUTHORIZED, "Unauthorized", "Invalid email or password. Please try again.");
    }

    // 403 - @PreAuthorize / role checks (without this they fall into the
    // RuntimeException handler)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        return build(HttpStatus.FORBIDDEN, "Forbidden", "You do not have permission to access this resource.");
    }

    // 400 / 409 - business-logic errors thrown as RuntimeException
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        String msg = ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred.";
        HttpStatus status = HttpStatus.BAD_REQUEST;

        if (msg.toLowerCase().contains("already in use") || msg.toLowerCase().contains("duplicate")) {
            status = HttpStatus.CONFLICT;
        }

        log.warn("RuntimeException handled as {}: {}", status.value(), msg);
        return build(status, status.getReasonPhrase(), msg);
    }

    // 500 - anything else. The stack trace is logged so you can see the real cause
    // in Render logs.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        log.error("Unhandled exception", ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Server Error",
                "Something went wrong on the server. Please try again later.");
    }
}