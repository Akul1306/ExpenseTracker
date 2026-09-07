package com.project.ExpenseTracker.user;

import com.project.ExpenseTracker.expense.Expense;
import com.project.ExpenseTracker.expense.dto.ExpenseResponse;
import com.project.ExpenseTracker.user.dto.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.project.ExpenseTracker.user.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepo;

    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public Page<UserResponse> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );

        Page<User> userPage = userRepo.findAll(pageable);

        return userPage.map(this::mapToResponse);
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
    }

