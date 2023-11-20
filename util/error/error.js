class ErrorResult {
    static errorPasswordLength() {
        return {
            success: false,
            message: '비밀번호 길이가 6자리 미만입니다.',
        };
    }

    static errorNotEqualPassword() {
        return {
            success: false,
            message: '비밀번호가 일치하지 않습니다.',
        };
    }

    static errorDuplicatingEmail() {
        return {
            success: false,
            message: '이미 가입 된 이메일입니다.',
        };
    }

    static errorBadPatternEmail() {
        return {
            success: false,
            message: '이메일 형식이 정상적이지 않습니다.',
        };
    }

    static errorServer() {
        return {
            success: false,
            message: '서버에 예기치 못한 문제가 생겼습니다.',
        };
    }

    static errorEmptyEmail() {
        return {
            success: false,
            message: '이메일 정보가 존재하지 않습니다.',
        };
    }

    static errorAuthToken() {
        return {
            success: false,
            message: '사용자 인증에 실패하였습니다.',
        };
    }

    static errorEmptyProduct() {
        return {
            success: false,
            message: '상품이 존재하지 않습니다.',
        };
    }

    static errorNotEqualUser() {
        return {
            success: false,
            message: '유저 정보가 일치하지 않습니다.',
        };
    }
}

// 모듈 내보내기
module.exports = ErrorResult;
