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
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || 'Không thể kết nối với server');
    }
};