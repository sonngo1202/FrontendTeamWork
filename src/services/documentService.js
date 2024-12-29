import axios from "axios";

export const upload = async (idT, idWG, idG, file, accessToken) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`http://localhost:8080/api/datn/groups/${idG}/work-group/${idWG}/tasks/${idT}/documents`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
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

export const getAll = async (idG, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/datn/groups/${idG}/documents`, {
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

export const deleteF = async (idT, idWG, idG, id, accessToken) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/datn/groups/${idG}/work-group/${idWG}/tasks/${idT}/documents/${id}`,
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