package com.project.ExpenseTracker.expense;

import com.project.ExpenseTracker.exception.ResourceNotFoundException;
import com.project.ExpenseTracker.expense.dto.ExpensePatchDto;
import com.project.ExpenseTracker.expense.dto.ExpenseRequest;
import com.project.ExpenseTracker.expense.dto.ExpenseResponse;
import com.project.ExpenseTracker.user.User;
import com.project.ExpenseTracker.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

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

        // Validation: filename must not contain spaces
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null && originalFilename.contains(" ")) {
            expenseRepo.delete(expense); // Rollback expense creation
            throw new IllegalArgumentException("File name should not contain spaces");
        }

        try {
            String uploadDir = "uploads/receipts/";
            Files.createDirectories(Paths.get(uploadDir));

            String filename = UUID.randomUUID() + "_" + originalFilename;
            Path filePath = Paths.get(uploadDir + filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/receipts/" + filename;
            expense.setReceiptUrl(fileUrl);
            expenseRepo.save(expense);

            return fileUrl;
        } catch (Exception e) {
            expenseRepo.delete(expense); // Rollback expense creation if storage fails
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

    public List<ExpenseResponse> getAllExpensesForAdmin() {
        List<Expense> expenses = expenseRepo.findAll();
        return expenses.stream().map(this::mapToResponse).toList();
    }

    public ExpenseResponse updateExpenseStatus(Long id, ExpenseStatus status) {
        Expense expense = expenseRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        expense.setStatus(status);
        expense.setUpdatedAt(new Date());
        return mapToResponse(expenseRepo.save(expense));
    }

    public Page<ExpenseResponse> getAllExpenses(int page, int size) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("expenseDate").descending()
        );

        Page<Expense> expensePage = expenseRepo.findAll(pageable);

        return expensePage.map(this::mapToResponse);
    }

    @Transactional
    public ExpenseResponse updateExpense(Long id, ExpensePatchDto patch) throws AccessDeniedException {
        Expense expense = expenseRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        Long userId = getCurrentUserId();
        if (!expense.getId().equals(userId)) {
            throw new AccessDeniedException("Not your expense");
        }

        if (patch.getTitle() != null) {
            expense.setTitle(patch.getTitle());
        }
        if (patch.getDescription() != null) {
            expense.setDescription(patch.getDescription());
        }
        if (patch.getCategory() != null) {
            expense.setCategory(patch.getCategory());
        }
        if (patch.getDate() != null) {
            expense.setUpdatedAt(patch.getDate());
        }
        if (patch.getAmount() != null) {
            expense.setAmount(patch.getAmount());
        }

        return mapToResponse(expenseRepo.save(expense));
    }
}
