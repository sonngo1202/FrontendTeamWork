import axios from "axios";

export const getByIsNotDeleted = async (idU, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/datn/auth/${idU}/notifications`, {
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

export const getByIsDeleted = async (idU, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/datn/auth/${idU}/notifications/storage`, {
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

export const maskNotifiAsRead = async (id , idU, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/datn/auth/${idU}/notifications/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
        }
        const data = await response.text();
        return data;
    } catch (error) {
        throw new Error(error.message || 'Không thể kết nối với server');
    }
};

export const deleteNoti = async (idU, id, accessToken) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/datn/auth/${idU}/notifications/${id}`,
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
                throw new Error('Không tìm thấy thông báo liên quan.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};