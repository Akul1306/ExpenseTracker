package com.project.ExpenseTracker.expense;

import com.project.ExpenseTracker.expense.dto.ExpenseRequest;
import com.project.ExpenseTracker.expense.dto.ExpenseResponse;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/expense")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping("/")
    public ResponseEntity<?> addExpense(@Valid @RequestBody ExpenseRequest req) {
        try {
            Expense expense = expenseService.addExpense(req);
            return ResponseEntity.ok(Map.of("id", expense.getId()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ExpenseResponse>> getExpenseByCategory(@PathVariable ExpenseCategory category) {
        List<ExpenseResponse> expenses = expenseService.getExpensesByCategory(category);
        return ResponseEntity.ok(expenses);
    }

    @PostMapping("/{id}/receipt")
    public ResponseEntity<?> uploadReceipt(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws AccessDeniedException {
        String url = expenseService.uploadReceipt(id, file);
        return ResponseEntity.ok(Map.of("receiptUrl", url));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable Long id) throws AccessDeniedException {
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpenseById(@PathVariable Long id) throws AccessDeniedException{
        return ResponseEntity.ok(expenseService.deleteExpenseById(id));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<ExpenseResponse>> getAllExpensesForAdmin() {
        return ResponseEntity.ok(expenseService.getAllExpensesForAdmin());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ExpenseResponse> updateExpenseStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        ExpenseStatus status = ExpenseStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(expenseService.updateExpenseStatus(id, status));
    }
}
