import axios from "axios";

export const add = async (idT, idWG, idG, content, listTag, accessToken) => {

    try {
        const response = await axios.post(`http://localhost:8080/api/datn/groups/${idG}/work-group/${idWG}/tasks/${idT}/comments`,
            {content, listTag},
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