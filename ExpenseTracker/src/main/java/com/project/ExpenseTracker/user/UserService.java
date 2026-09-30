package com.project.ExpenseTracker.user;

import com.project.ExpenseTracker.exception.DuplicateResourceException;
import com.project.ExpenseTracker.exception.ResourceNotFoundException;
import com.project.ExpenseTracker.expense.Expense;
import com.project.ExpenseTracker.expense.ExpenseCategory;
import com.project.ExpenseTracker.expense.ExpenseRepository;
import com.project.ExpenseTracker.expense.dto.ExpenseResponse;
import com.project.ExpenseTracker.user.dto.UserResponse;
import com.project.ExpenseTracker.user.dto.UserUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final ExpenseRepository expenseRepo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepo, ExpenseRepository expenseRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.expenseRepo = expenseRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<UserResponse> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("username").ascending()
        );

        Page<User> userPage = userRepo.findAll(pageable);

        return userPage.map(this::mapToResponse);
    }

    public UserResponse getUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return mapToResponse(user);
    }

    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("User not authenticated");
        }
        String username = authentication.getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return mapToResponse(user);
    }

    public UserResponse updateUser(Long userId, UserUpdateRequest request) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Security check: ensure user is updating their own account or is an ADMIN
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String currentUsername = authentication.getName();
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!user.getUsername().equals(currentUsername) && !isAdmin) {
                throw new AccessDeniedException("You are not authorized to update this profile");
            }
        }

        if (request.getUsername() != null && !request.getUsername().isBlank()
                && !request.getUsername().equalsIgnoreCase(user.getUsername())) {
            if (userRepo.findByUsername(request.getUsername()).isPresent()) {
                throw new DuplicateResourceException("Username '" + request.getUsername() + "' is already taken.");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()
                && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
            if (userRepo.findByEmail(request.getEmail()).isPresent()) {
                throw new DuplicateResourceException("Email '" + request.getEmail() + "' is already taken.");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepo.save(user);
        return mapToResponse(updatedUser);
    }

    public List<ExpenseResponse> getExpensesOfUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Security check: ensure user is viewing their own expenses or is an ADMIN
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String currentUsername = authentication.getName();
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!user.getUsername().equals(currentUsername) && !isAdmin) {
                throw new AccessDeniedException("You are not authorized to view these expenses");
            }
        }

        List<Expense> expenses = expenseRepo.findByUserId(userId);
        return expenses.stream()
                .map(this::mapExpenseToResponse)
                .toList();
    }

    public Map<ExpenseCategory, Double> getCategorySummaryOfUser(Long userId) {
        List<ExpenseResponse> expenses = getExpensesOfUser(userId);
        return expenses.stream()
                .filter(e -> e.getCategory() != null)
                .collect(Collectors.groupingBy(
                        ExpenseResponse::getCategory,
                        Collectors.summingDouble(ExpenseResponse::getAmount)
                ));
    }

    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    private ExpenseResponse mapExpenseToResponse(Expense expense) {
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
        res.setRemarks(expense.getRemarks());
        return res;
    }
}
