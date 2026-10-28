package io.spring.image.demo.application.jwt;

import io.spring.image.demo.domain.AccessToken;
import io.spring.image.demo.domain.entity.User;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    public AccessToken generateToken(User user){
        return new AccessToken("");
    }
}
