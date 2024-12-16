import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFilePdf, faFileWord, faFileExcel, faFileVideo, faFileAudio, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import './FileList.css';

function FileList() {
    const [files, setFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const filesPerPage = 20;

    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/files');
            setFiles(response.data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return faFilePdf;
            case 'doc':
            case 'docx':
                return faFileWord;
            case 'xls':
            case 'xlsx':
                return faFileExcel;
            case 'mp4':
            case 'avi':
            case 'mov':
                return faFileVideo;
            case 'mp3':
            case 'wav':
                return faFileAudio;
            default:
                return faFile;
        }
    };

    const isImageFile = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension);
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * filesPerPage;
    const currentFiles = files.slice(offset, offset + filesPerPage);
    const pageCount = Math.ceil(files.length / filesPerPage);

    return (
        <div>
            <h2>Uploaded Files</h2>
            <button className="refresh-button" onClick={fetchFiles}>
                <FontAwesomeIcon icon={faSyncAlt} /> Refresh
            </button>
            <ul className="file-list">
                {currentFiles.map((file, index) => (
                    <li key={index} className="file-item">
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="file-link">
                            <div className="file-content">
                                {isImageFile(file.name) ? (
                                    <img
                                        src={file.url}
                                        alt={file.name}
                                        className="file-thumbnail"
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={getFileIcon(file.name)} size="4x" />
                                )}
                                <p>{file.name}</p>
                                <p className="upload-date">{file.upload_date}</p>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
            {pageCount > 1 && (
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />
            )}
        </div>
    );
}

export default FileList;