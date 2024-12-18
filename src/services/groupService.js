import axios from "axios";

export const detail = async (id, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/datn/groups/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Không tìm thấy nhóm liên quan.');
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

export const add = async (name, des, accessToken) => {
    try {
        const response = await axios.post('http://localhost:8080/api/datn/groups',
            { name, des },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        if (response.status === 201) {
            return true;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Đã có lỗi xảy ra, vui lòng thử lại.');
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const edit = async (id, name, des, accessToken) => {
    try {
        const response = await axios.put(`http://localhost:8080/api/datn/groups/${id}`,
            { name, des },
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
                throw new Error('Không tìm thấy nhóm liên quan.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const deleteG = async (id, accessToken) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/datn/groups/${id}`,
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
                throw new Error('Không tìm thấy nhóm liên quan.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};