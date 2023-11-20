class ValidatePassword {
    /**
     * 회원가입 비밀번호 길이 유효성 검사
     */
    static validatePasswordLength(pass) {
        return pass.length >= 6 ? true : false;
    }

    /**
     * 회원가입 확인 비밀번호 유효성 검사
     */
    static validateEqualPassword(pass, passConfirm) {
        return pass === passConfirm ? true : false;
    }
}

class ValidateEmail {
    /**
     * 회원가입 이메일 유효성 검사
     */
    static validateConfirmEmail(email) {
        const pattern = new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/);

        return pattern.test(email);
    }
}

module.exports = {
    ValidatePassword,
    ValidateEmail,
};
