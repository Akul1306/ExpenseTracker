package com.project.ExpenseTracker.expense.dto;

import com.project.ExpenseTracker.expense.ExpenseCategory;

import java.util.Date;

public class ExpensePatchDto {
    private String title;
    private String description;
    private ExpenseCategory category;
    private Date date;
    private Double amount;

    public ExpensePatchDto() {}

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public ExpenseCategory getCategory() {
        return category;
    }

    public void setCategory(ExpenseCategory category) {
        this.category = category;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
