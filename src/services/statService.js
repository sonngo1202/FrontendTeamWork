export const statByStatus = async (idG, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/datn/groups/${idG}/stat/by-status`, {
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

export const statByMember = async (idG, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/datn/groups/${idG}/stat/by-member`, {
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

export const statByMemberDetail = async (idG, idU, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/datn/groups/${idG}/stat/by-member/${idU}`, {
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

export const statByStatusDetail = async (idG, idS, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/datn/groups/${idG}/stat/by-status/${idS}`, {
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