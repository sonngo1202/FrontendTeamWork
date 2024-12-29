import axios from "axios";

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

export const add = async (name, startDate, endDate, des, priorityLevel, assignee, parentTask, idG, idWG, accessToken) => {
    try {
        const response = await axios.post(`http://localhost:8080/api/datn/groups/${idG}/work-group/${idWG}/tasks`,
            { name, startDate, endDate, des, priorityLevel, assignee, parentTask },
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
            throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const deleteT = async (id, idG, idWG, accessToken) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/datn/groups/${idG}/work-group/${idWG}/tasks/${id}`,
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
                throw new Error('Không tìm thấy nhiệm vụ liên quan.');
            } else {
                throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
            }
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const edit = async (name, startDate, endDate, des, priorityLevel, assignee, id, idG, idWG, accessToken) => {
    try {
        const response = await axios.put(`http://localhost:8080/api/datn/groups/${idG}/work-group/${idWG}/tasks/${id}`,
            { name, startDate, endDate, des, priorityLevel, assignee },
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
            throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};

export const updateStatus = async (id, idG, idWG, idS, accessToken) => {
    try {
        const response = await axios.put(`http://localhost:8080/api/datn/groups/${idG}/work-group/${idWG}/tasks/${id}/status/${idS}`,
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
            throw new Error('Đã có lỗi xảy ra, vui lòng thử lại');
        } else {
            throw new Error('Không thể kết nối với server');
        }
    }
};