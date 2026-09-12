package com.project.ExpenseTracker.user;

import com.project.ExpenseTracker.expense.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<Expense> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Page<User> findAll( Pageable pageable);

}
