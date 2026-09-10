package com.project.ExpenseTracker.auth;

import com.project.ExpenseTracker.auth.dto.ResetRequest;
import com.project.ExpenseTracker.security.JwtService;
import com.project.ExpenseTracker.user.Role;
import com.project.ExpenseTracker.user.User;
import com.project.ExpenseTracker.user.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthService {

    private final UserRepository userRepo;
//    private final ResetRequest resetReq;

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepo, PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;

    }

    public void register(String username, String rawPassword,String email,Role role) {
        if (userRepo.findByUsername(username).isPresent()) {
            throw new IllegalStateException("Username already taken");
        }
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setEmail(email);
        user.setRole(role);
        user.setCreatedAt(new Date());
        userRepo.save(user);
    }

    public String login(String username, String rawPassword) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("invalid"));

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new BadCredentialsException("invalid");
        }

        return jwtService.generateToken(user,user.getRole());
    }

//    public void resetPassword(ResetRequest req) {
//
//        PasswordResetToken resetToken = tokenRepo.findByToken(req.getToken())
//                .orElseThrow(() ->
//                        new RuntimeException("Invalid reset token"));
//
//        User user = resetToken.getUser();
//
//        String encodedPassword =
//                passwordEncoder.encode(req.getNewPassword());
//
//        user.setPassword(encodedPassword);
//
//        userRepo.save(user);
//
//        tokenRepo.delete(resetToken);
//    }
}