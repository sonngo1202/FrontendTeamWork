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