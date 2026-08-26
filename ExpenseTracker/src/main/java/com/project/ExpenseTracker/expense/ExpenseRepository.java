package com.project.ExpenseTracker.expense;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense,Long> {
Optional<Expense> findById(long id);
    List<Expense> findByUserIdAndCategory(Long userId, ExpenseCategory category);
    List<Expense> findByUserId(Long userId);
}
