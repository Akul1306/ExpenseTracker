package com.project.ExpenseTracker.user.dto;

import com.project.ExpenseTracker.user.Role;

import java.util.Date;

public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private Role role;
    private Date date;

    public UserResponse(Long id, String username, String email, Role role, Date date) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Role getRole() {
        return role;
    }
}
