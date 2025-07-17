package com.example.challengeapp.repository;

import com.example.challengeapp.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
public class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveAndFindUser() {
        User user = new User();
        user.setName("Repo User");
        user.setEmail("repo@example.com");
        user.setPassword("pass");
        user.setRole("USER");
        userRepository.save(user);

        var found = userRepository.findByEmail("repo@example.com");
        assertTrue(found.isPresent());
        assertEquals("Repo User", found.get().getName());
    }
} 