package com.project.ExpenseTracker.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class ResetRequest {


        @NotBlank
        private String token;
        @NotBlank
        private String newPassword;

        public ResetRequest(){};

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
