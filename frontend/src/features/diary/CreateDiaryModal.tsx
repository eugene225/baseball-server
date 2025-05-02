import React, { useState } from 'react';
import './CreateDiaryModal.css';
import { createDiary } from '../../api/diary';
import { FaTimes, FaBook, FaGlobe, FaLock } from 'react-icons/fa';

// CreateDiaryModal의 props 타입 정의
interface CreateDiaryModalProps {
  closeModal: () => void;
  accessToken: string;
}

// 상태와 함수의 타입 정의
const CreateDiaryModal = ({ closeModal, accessToken }: CreateDiaryModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createDiary(
        {
          title,
          description,
          isPublic,
        },
        accessToken
      );
      closeModal();
      window.location.reload();
    } catch (error) {
      setError('일기장 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <FaBook className="modal-icon" />
            <h2>새 일기장 만들기</h2>
          </div>
          <button className="close-button" onClick={closeModal}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="diary-form">
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="일기장의 제목을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">설명</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="일기장에 대한 간단한 설명을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label className="visibility-label">
              <span>공개 설정</span>
              <div className="visibility-toggle">
                <button
                  type="button"
                  className={`toggle-button ${isPublic ? 'active' : ''}`}
                  onClick={() => setIsPublic(true)}
                >
                  <FaGlobe />
                  <span>공개</span>
                </button>
                <button
                  type="button"
                  className={`toggle-button ${!isPublic ? 'active' : ''}`}
                  onClick={() => setIsPublic(false)}
                >
                  <FaLock />
                  <span>비공개</span>
                </button>
              </div>
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? '생성 중...' : '일기장 만들기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDiaryModal;
