export const detail = async (id, idWG, idG, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/datn/groups/${idG}/work-group/${idWG}/tasks/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Không tìm thấy nhiệm vụ liên quan.');
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

export const getByUser = async (accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/datn/auth/tasks`, {
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

export const getDataSearch = async (accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/datn/auth/tasks/data-search`, {
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

export const getAllByGroupId = async (idG, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/datn/groups/${idG}/tasks`, {
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