package io.spring.image.demo.application.users;

import io.spring.image.demo.application.jwt.JwtService;
import io.spring.image.demo.domain.AccessToken;
import io.spring.image.demo.domain.entity.User;
import io.spring.image.demo.domain.exception.DuplicatedTupleException;
import io.spring.image.demo.domain.service.UserService;
import io.spring.image.demo.infra.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; //inserir no pacote config
    private final JwtService jwtService;

     @Override
    public User getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public User save(User user) {
         var possibleUser = getByEmail(user.getEmail());
         if(possibleUser != null ){
             throw new DuplicatedTupleException("User already exists!");
        } // alteração na senha...
        encodePassword(user);
        return userRepository.save(user);
    }
//+++++++Até aqui+++++
    @Override
    public AccessToken autenticate(String email, String password) {
        var user = getByEmail(email);
        if(user == null){
            return null;
        }
         boolean matches = passwordEncoder.matches(password, user.getPassword());
        if(matches){
            //return new AccessToken("xxx");
            return jwtService.generateToken(user);
        }
        return null;
    }

    private void encodePassword (User user){
         String rawPassword = user.getPassword();
         String encodePassword = passwordEncoder.encode(rawPassword);
         user.setPassword(encodePassword);
    }
}
