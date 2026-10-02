package com.healthcopilot.dto;

public class UserDTO {
    private Long id;
    private String email;
    private String fullName;
    private String role;

    public UserDTO() {}

    public UserDTO(Long id, String email, String fullName, String role) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public static UserDTOBuilder builder() { return new UserDTOBuilder(); }

    public static class UserDTOBuilder {
        private Long id;
        private String email;
        private String fullName;
        private String role;

        public UserDTOBuilder id(Long id) { this.id = id; return this; }
        public UserDTOBuilder email(String email) { this.email = email; return this; }
        public UserDTOBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public UserDTOBuilder role(String role) { this.role = role; return this; }

        public UserDTO build() {
            return new UserDTO(id, email, fullName, role);
        }
    }
}
