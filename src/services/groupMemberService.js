import axios from "axios";

export const addMember = async (idG, idU, accessToken) => {
    try {
        const response = await axios.post(`http://localhost:8080/api/datn/groups/${idG}/member/${idU}`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 409) {
                throw new Error('Người đang phụ trách nhiệm vụ.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const deleteMember = async (idG, idU, accessToken) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/datn/groups/${idG}/member/${idU}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 409) {
                throw new Error('Người dùng vẫn còn nhiệm vụ.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const addRoleMember = async (idG, idU, position, accessToken) => {
    try {
        const response = await axios.put(`http://localhost:8080/api/datn/groups/${idG}/member/${idU}`,
            {position},
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 409) {
                throw new Error('Không tìm thấy nhóm hoặc người dùng liên quan.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};