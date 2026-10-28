package io.spring.image.demo.infra.repository;

import io.spring.image.demo.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository  extends JpaRepository<User, String > {
    User findByEmail(String email);
}