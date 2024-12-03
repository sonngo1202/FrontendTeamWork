import React from "react";
import { Helmet } from "react-helmet";
import "../assets/css/IntroducePage.css";
import logo from '../assets/image/logo.png';
import { useNavigate } from "react-router-dom";

const features = [
    {
        title: "Tạo nhóm làm việc",
        description: "Cho phép người dùng tạo các nhóm làm việc một cách dễ dàng.",
    },
    {
        title: "Quản lý nhóm",
        description: "Chỉnh sửa và xóa các nhóm làm việc một cách linh hoạt.",
    },
    {
        title: "Quản lý thành viên",
        description:
            "Thêm hoặc loại bỏ thành viên, thiết lập vai trò và quyền hạn.",
    },
    {
        title: "Quản lý công việc",
        description:
            "Tạo và phân công công việc với thông tin chi tiết như mô tả, thời hạn, và mức độ ưu tiên.",
    },
    {
        title: "Báo cáo công việc",
        description: "Cập nhật tình trạng và tải lên tài liệu báo cáo khi hoàn thành.",
    },
    {
        title: "Theo dõi tiến độ",
        description:
            "Hiển thị biểu đồ và thông tin chi tiết về tình trạng công việc.",
    },
    {
        title: "Quản lý tài nguyên",
        description: "Quản lý ảnh, video, và các tài liệu cần thiết cho công việc.",
    },
    {
        title: "Bình luận",
        description: "Trao đổi thông tin trực tiếp trên từng nhiệm vụ.",
    },
    {
        title: "Xem thông báo",
        description: "Thông báo các sự kiện quan trọng cho các thành viên liên quan.",
    },
];

const IntroducePage = () => {
    const navigate = useNavigate();

    const handleToSignin = () => {
        navigate('/sign-in');
    }

    const handleToSignup = () =>{
        navigate('/sign-up')
    }
    return (
        <>
            <Helmet>
                <style>
                    {`
            body {
              background: linear-gradient(to right, #1a2a6c, #000000);
              margin: 0;
              font-family: 'Arial', sans-serif;
              color: white;
            }
          `}
                </style>
            </Helmet>
            <div className="container">
                <header className="header">
                    <div className="logo">
                        <img src={logo} alt="Logo" />
                    </div>
                    <div className="auth-buttons">
                        <button className="btn-signin" onClick={handleToSignin}>Sign In</button>
                        <button className="btn-signup" onClick={handleToSignup}>Sign Up</button>
                    </div>
                </header>
                <h1 className="title">Pandoras Team Work Management System</h1>
                <section className="features">
                    {features.map((feature, index) => (
                        <div className="feature-card" key={index}>
                            <h2>{feature.title}</h2>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </section>
                <footer className="footer">
                    <p>&copy; 2024 Pandoras. Tất cả các quyền được bảo lưu.</p>
                </footer>
            </div>
        </>
    );
};

export default IntroducePage;
