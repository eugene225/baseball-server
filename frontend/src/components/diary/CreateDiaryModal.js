import React, { useState } from 'react';
import './CreateDiaryModal.css';

const CreateDiaryModal = ({ closeModal }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here
        closeModal();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>일기장 만들기</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <label htmlFor="title">제목:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label htmlFor="description">일기장 소개:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <label className="toggle-label">
                        공개 설정:
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                id="privacy-toggle"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </div>
                        <span className="toggle-text">{isPublic ? '공개' : '비공개'}</span>
                    </label>
                </form>
                <div className="modal-buttons">
                    <button type="button" className="submit-button" onClick={handleSubmit}>
                        확인
                    </button>
                    <button type="button" className="cancel-button" onClick={closeModal}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateDiaryModal;
