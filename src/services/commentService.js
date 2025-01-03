import axios from "axios";

export const add = async (idT, idWG, idG, content, listTag, accessToken) => {

    try {
        const response = await axios.post(`http://localhost:8080/api/datn/groups/${idG}/work-group/${idWG}/tasks/${idT}/comments`,
            { content, listTag },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            }
        );

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const deleteC = async (idT, idWG, idG, id, accessToken) => {

    try {
        const response = await axios.delete(`http://localhost:8080/api/datn/groups/${idG}/work-group/${idWG}/tasks/${idT}/comments/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            }
        );

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const edit = async (idT, idWG, idG, id, content, listTag, accessToken) => {

    try {
        const response = await axios.put(`http://localhost:8080/api/datn/groups/${idG}/work-group/${idWG}/tasks/${idT}/comments/${id}`,
            { content, listTag },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            }
        );

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};