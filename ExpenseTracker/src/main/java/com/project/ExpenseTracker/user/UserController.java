package com.project.ExpenseTracker.user;

import com.project.ExpenseTracker.expense.ExpenseCategory;
import com.project.ExpenseTracker.expense.ExpenseRepository;
import com.project.ExpenseTracker.expense.dto.ExpenseResponse;
import com.project.ExpenseTracker.user.dto.UserResponse;
import com.project.ExpenseTracker.user.dto.UserUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserRepository userRepo;
    private final ExpenseRepository expenseRepo;
    private final UserService userService;

    public UserController(UserRepository userRepository, ExpenseRepository expenseRepository, UserService userService) {
        this.userRepo = userRepository;
        this.expenseRepo = expenseRepository;
        this.userService = userService;
    }

    @GetMapping("/")
    public ResponseEntity<List<UserResponse>> getUsers() {
        List<UserResponse> users = userRepo.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole(),
                        user.getCreatedAt()
                ))
                .toList();

        return ResponseEntity.ok(users);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable("username") String username) {
        Optional<User> user = userRepo.findByUsername(username);
        if (user.isPresent()) {
            return ResponseEntity.ok(new UserResponse(
                    user.get().getId(),
                    user.get().getUsername(),
                    user.get().getEmail(),
                    user.get().getRole(),
                    user.get().getCreatedAt()
            ));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@RequestBody UserUpdateRequest request) {
        UserResponse currentUser = userService.getCurrentUser();
        UserResponse updated = userService.updateUser(currentUser.getId(), request);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @GetMapping("/profile/expenses")
    public ResponseEntity<List<ExpenseResponse>> getProfileExpenses() {
        UserResponse currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(userService.getExpensesOfUser(currentUser.getId()));
    }

    @GetMapping("/profile/expenses/category-summary")
    public ResponseEntity<Map<ExpenseCategory, Double>> getProfileCategorySummary() {
        UserResponse currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(userService.getCategorySummaryOfUser(currentUser.getId()));
    }

    @GetMapping("/{id}/expenses")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getExpensesOfUser(id));
    }

    @GetMapping("/{id}/expenses/category-summary")
    public ResponseEntity<Map<ExpenseCategory, Double>> getCategorySummaryByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getCategorySummaryOfUser(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long id) {
        Optional<User> userOpt = userRepo.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User userToDelete = userOpt.get();

        // Prevent admin from deleting themselves
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userToDelete.getUsername().equals(currentUsername)) {
            return ResponseEntity.badRequest().body(Map.of("error", "You cannot delete your own account."));
        }

        // Delete all expenses associated with this user first (FK constraint)
        expenseRepo.deleteAll(expenseRepo.findByUserId(id));

        // Delete the user
        userRepo.deleteById(id);

        return ResponseEntity.ok(Map.of("message", "User '" + userToDelete.getUsername() + "' deleted successfully."));
    }

    @GetMapping("/paginate")
    public Page<UserResponse> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return userService.getAllUsers(page, size);
    }
}
