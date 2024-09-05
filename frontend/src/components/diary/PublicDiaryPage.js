import React, { useState } from 'react';
import CreateDiaryModal from './CreateDiaryModal';
import './PublicDiaryPage.css';

const PublicDiaryPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="public-diary-page">
            <h1 className="page-title">공개 일기장</h1>
            <button className="create-diary-button" onClick={openModal}>
                일기장 만들기
            </button>

            {isModalOpen && <CreateDiaryModal closeModal={closeModal} />}
        </div>
    );
};

export default PublicDiaryPage;
