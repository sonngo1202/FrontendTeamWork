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