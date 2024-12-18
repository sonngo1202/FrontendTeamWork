import axios from 'axios';
import Cookies from 'js-cookie';

export const detail = async (id, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/datn/auth/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Không tìm thấy người dùng liên quan.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
            }
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || 'Không thể kết nối với server');
    }
};


export const signin = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:8080/api/datn/auth/login', { email, password });

        if (response.status === 200) {
            const { accessToken, refreshToken, ...userData } = response.data;

            Cookies.set('accessToken', accessToken, { expires: 1 / 24 });

            Cookies.set('refreshToken', refreshToken, { expires: 30 });

            Cookies.set('user', JSON.stringify(userData), { expires: 7 });
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 500) {
                throw new Error('Email hoặc mật khẩu không khớp.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const signup = async (email, password, fullName, job, location) => {
    try {
        const response = await axios.post('http://localhost:8080/api/datn/auth/register', {
            email,
            password,
            fullName,
            job,
            location
        });

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 409) {
                throw new Error('Email đang dùng đã tồn tại.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại.');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const resendCode = async (email) => {
    try {
        const response = await axios.post('http://localhost:8080/api/datn/auth/re-code', { email });
        return response.data;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('Email không khớp.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại.');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const verifyCode = async (email, code) => {
    try {
        const response = await axios.post('http://localhost:8080/api/datn/auth/verify', { email, code });
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('Email không khớp.');
            } else if (error.response.status === 400) {
                throw new Error('Mã không hợp lệ.')
            } else if (error.response.status === 410) {
                throw new Error('Mã đã hết hạn.')
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại.');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post('http://localhost:8080/api/datn/auth/forgot-password', { email });
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('Email chưa được xác minh hoặc chưa được liên kết.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại.');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const update = async (fullName, job, location, accessToken) => {
    try {
        const response = await axios.put('http://localhost:8080/api/datn/auth/update',
            { fullName, job, location },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('Người dùng không tồn tại.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại.');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const resetPassword = async (email, password, code) => {
    try {
        const response = await axios.post('http://localhost:8080/api/datn/auth/reset-password', { email, password, code });
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('Email không khớp.');
            } else if (error.response.status === 400) {
                throw new Error('Mã không hợp lệ.')
            } else if (error.response.status === 410) {
                throw new Error('Mã đã hết hạn.')
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại.');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const changePassword = async (currentPassword, newPassword, accessToken) => {
    try {
        const response = await axios.post('http://localhost:8080/api/datn/auth/change-password',
            { currentPassword, newPassword },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 500) {
                throw new Error('Mật khẩu hiện tại không đúng.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại.');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const searchAll = async (idG, key, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/datn/auth/${key}/group/${idG}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || 'Không thể kết nối với server');
    }
};