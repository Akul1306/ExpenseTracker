package com.project.ExpenseTracker.auth.dto;

import com.project.ExpenseTracker.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RegisterRequest {


        @NotBlank(message = "Username is required")
        private String username;

        @NotBlank(message = "Password is required")
        private String password;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotNull(message = "Role is required")
        private Role role;

        // required for Jackson deserialization
        public RegisterRequest() {}

        public @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String getEmail() {
                return email;
        }

        public void setEmail(@NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email) {
                this.email = email;
        }

        public @NotNull(message = "Role is required") Role getRole() {
                return role;
        }

        public void setRole(@NotNull(message = "Role is required") Role role) {
                this.role = role;
        }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
