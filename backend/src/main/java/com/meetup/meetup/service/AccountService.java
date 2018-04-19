package com.meetup.meetup.service;

import com.meetup.meetup.dao.UserDao;
import com.meetup.meetup.entity.User;
import com.meetup.meetup.rest.controller.errors.*;
import com.meetup.meetup.security.utils.HashMD5;
import com.meetup.meetup.service.vm.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.json.Json;
import javax.mail.MessagingException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.security.NoSuchAlgorithmException;

@Component
public class AccountService {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    UserDao userDao;

    @Autowired
    private MailService mailService;

    public Profile login(Profile credentials) throws Exception {

        String md5Pass = HashMD5.hash(credentials.getPassword());

        if (md5Pass == null) {
            throw new FailedToLoginException(credentials.getLogin());
        }

        credentials.setPassword(md5Pass);

        User user = profileService.get(credentials.getLogin());
        Profile minimalProfile;
        if (user != null && user.getPassword().equals(credentials.getPassword())) {
            minimalProfile = new Profile(user.getLogin(), user.getName(), user.getLastname(), user.getPassword());
        } else {
            throw new FailedToLoginException(credentials.getLogin());
        }
        String token = null;
        token = jwtService.tokenFor(minimalProfile);

        if (token == null) {
            throw new Exception("SendCustomErrorEnable to login. Server Error");
        }
        minimalProfile.setToken(token);

        return minimalProfile;
    }

    public String register(User user) throws Exception {
        if (null != userDao.findByLogin(user.getLogin())) {  //checking if user exist in system
            throw new LoginAlreadyUsedException();
        }
        if (null != userDao.findByEmail(user.getEmail())) { //checking if email exist in system
            throw new EmailAlreadyUsedException();
        }
        String md5Pass = HashMD5.hash(user.getPassword());
        user.setPassword(md5Pass);

        if (null == md5Pass) {
            throw new MD5EncodingException();
        }
        if (userDao.insert(user) == -1) { //checking adding to DB
            throw new DatabaseWorkException();
        }
        try {
            mailService.sendMail(user.getEmail(), "Registration successfully", String.format(MailService.templateRegister, user.getName(), user.getLogin(), user.getPassword()));
        } catch (MessagingException e) {
            userDao.delete(user);
            throw new Exception("SendCustomErrorSend mail exception");
        }

        return Json.createObjectBuilder().add("success", "Success").build().toString();
    }
}