package com.project.ExpenseTracker.expense;

import com.project.ExpenseTracker.exception.ResourceNotFoundException;
import com.project.ExpenseTracker.expense.dto.ExpenseRequest;
import com.project.ExpenseTracker.expense.dto.ExpenseResponse;
import com.project.ExpenseTracker.user.User;
import com.project.ExpenseTracker.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepo;
    private final UserRepository userRepo;

    public ExpenseService(ExpenseRepository expenseRepo, UserRepository userRepo) {
        this.expenseRepo = expenseRepo;
        this.userRepo = userRepo;
    }

    public Expense addExpense(ExpenseRequest request){
        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setCategory(request.getCategory());
        expense.setCreatedAt(new Date());
        expense.setUpdatedAt(new Date());
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        expense.setUser(user);

        return expenseRepo.save(expense);
    }

    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    public List<ExpenseResponse> getExpensesByCategory(ExpenseCategory category) {
        Long userId = getCurrentUserId();

        List<Expense> expenses = expenseRepo.findByUserIdAndCategory(userId, category);

        return expenses.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        ExpenseResponse res = new ExpenseResponse();
        res.setId(expense.getId());
        res.setTitle(expense.getTitle());
        res.setDescription(expense.getDescription());
        res.setAmount(expense.getAmount());
        res.setExpenseDate(expense.getExpenseDate());
        res.setCategory(expense.getCategory());
        res.setStatus(expense.getStatus());
        res.setReceiptUrl(expense.getReceiptUrl());
        res.setCreatedAt(expense.getCreatedAt());
        res.setUpdatedAt(expense.getUpdatedAt());
        res.setUserId(expense.getUser().getId());
        res.setUsername(expense.getUser().getUsername());
        return res;
    }

    public String uploadReceipt(Long expenseId, MultipartFile file) throws AccessDeniedException {
        Expense expense = expenseRepo.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        // ownership check — don't skip this
        Long currentUserId = getCurrentUserId();
        if (!expense.getUser().getId().equals(currentUserId)) {
            throw new AccessDeniedException("Not your expense");
        }

        try {
            String uploadDir = "uploads/receipts/";
            Files.createDirectories(Paths.get(uploadDir));

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/receipts/" + filename;
            expense.setReceiptUrl(fileUrl);
            expenseRepo.save(expense);

            return fileUrl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public ExpenseResponse getExpenseById(Long id) throws AccessDeniedException {
        Expense expense = expenseRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        Long currentUserId = getCurrentUserId();
        if (!expense.getUser().getId().equals(currentUserId)) {
            throw new AccessDeniedException("Not your expense");
        }

        return mapToResponse(expense);
    }

    public List<ExpenseResponse> getAllExpenses() {
        Long userId = getCurrentUserId();
        List<Expense> expenses = expenseRepo.findByUserId(userId);
        return expenses.stream().map(this::mapToResponse).toList();
    }

    public long deleteExpenseById(Long id) throws AccessDeniedException {
        Long userId = getCurrentUserId();
        if (!expenseRepo.existsById(id)) {
            throw new ResourceNotFoundException("Expense not found");
                    }

        expenseRepo.deleteById(id);

        return id;
    }

}
