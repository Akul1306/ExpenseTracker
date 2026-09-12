package com.project.ExpenseTracker.expense;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense,Long>, JpaSpecificationExecutor<Expense> {
Optional<Expense> findById(long id);
    List<Expense> findByUserIdAndCategory(Long userId, ExpenseCategory category);
    List<Expense> findByUserId(Long userId);
    Page<Expense> findByUserId(Long userId, Pageable pageable);
}
