import { useEffect, useState } from "react";
import { getAll } from "../services/fileService";
import Cookies from 'js-cookie';
import { useParams } from "react-router-dom";
import '../assets/css/File.css';
import empty from '../assets/image/attachment.svg';

const File = () => {
    const [files, setFiles] = useState([]);
    const { id } = useParams();

    const fetchData = async () => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            try {
                const data = await getAll(id, accessToken);
                setFiles(data);
                console.log(data)
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    }

    const handleDocumentClick = (url, fileType) => {
        if (fileType === 'pdf') {
            const pdfWindow = window.open(url, '_blank');
            if (pdfWindow) {
                pdfWindow.focus();
            }
        } else if (fileType === 'txt') {
            const txtWindow = window.open(url, '_blank');
            if (txtWindow) {
                txtWindow.focus();
            }
        }
    };

    return (
        <div>
            {files.length > 0 &&
                (<div className="container-file">
                    {files.map((item) =>
                        <div key={item?.id} className='content-item-file' onClick={() => handleDocumentClick(item?.url, getFileExtension(item?.name))}>
                            <div className={`item-file-icon ${getFileExtension(item?.name) === 'pdf' ? 'pdf' : 'txt'}`}>
                                {getFileExtension(item?.name) === 'pdf' ? (<i className='fas fa-file-pdf'></i>) : (<i className='fas fa-file-alt'></i>)}
                            </div>
                            <div className='item-file-info'>
                                <span>{item?.name}</span>
                                <div className="item-file-bottom">
                                    <span className='item-file-type'>{getFileExtension(item?.name) === 'pdf' ? 'PDF' : 'Word Document'}</span>
                                    <span className="item-file-space">●</span>
                                    <span className="item-file-upload">{formatDate(item?.uploadAt)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>)}
            {files.length < 0 && (<div className="container-file-empty">
                <img src={empty}></img>
                <span>Tất cả các tệp đính kèm nhiệm vụ sẽ được</span>
                <span>lưu trữ ở đây.</span>
            </div>)}
        </div>

    );
};
export default File;