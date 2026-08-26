package com.project.ExpenseTracker.user;

import com.project.ExpenseTracker.user.dto.UserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserRepository userRepo;
    public UserController(UserRepository userRepository) {
        this.userRepo = userRepository;
    }
    @GetMapping("/")
    public ResponseEntity<List<UserResponse>> getUsers(){
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
    @GetMapping("/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable("username") String username){
        Optional<User> user = userRepo.findByUsername(username);
        if(user.isPresent()){
            return ResponseEntity.ok(new UserResponse(user.get().getId(), user.get().getUsername(), user.get().getEmail(), user.get().getRole(), user.get().getCreatedAt()));
        }
        return ResponseEntity.notFound().build();
    }

}
