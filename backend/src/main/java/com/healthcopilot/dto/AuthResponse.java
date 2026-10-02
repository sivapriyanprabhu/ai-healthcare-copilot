package com.healthcopilot.dto;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private UserDTO user;

    public AuthResponse() {}

    public AuthResponse(String token, String type, UserDTO user) {
        this.token = token;
        this.type = type != null ? type : "Bearer";
        this.user = user;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }

    public static AuthResponseBuilder builder() { return new AuthResponseBuilder(); }

    public static class AuthResponseBuilder {
        private String token;
        private String type = "Bearer";
        private UserDTO user;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder type(String type) { this.type = type; return this; }
        public AuthResponseBuilder user(UserDTO user) { this.user = user; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, type, user);
        }
    }
}
