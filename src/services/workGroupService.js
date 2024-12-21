import axios from "axios";

export const add = async (idG, name, accessToken) => {
    try {
        const response = await axios.post(`http://localhost:8080/api/datn/groups/${idG}/work-group`,
            { name },
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
            if (error.response.status === 404) {
                throw new Error('Không tìm thấy nhóm chứa nhóm công việc liên quan.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const edit = async (idG, idWG, name, accessToken) => {
    try {
        const response = await axios.put(`http://localhost:8080/api/datn/groups/${idG}/work-group/${idWG}`,
            { name },
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
            if (error.response.status === 404) {
                throw new Error('Không tìm thấy nhóm công việc liên quan.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const deleteWG = async (idG, idWG, accessToken) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/datn/groups/${idG}/work-group/${idWG}`,
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
            if (error.response.status === 404) {
                throw new Error('Không tìm thấy nhóm công việc liên quan.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};