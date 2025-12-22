import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../../../redux/features/auth/authSlice';

const CreateLessonModal = ({ open, onClose, courseId, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState(1);
  const [duration, setDuration] = useState(600);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const token = useSelector(selectCurrentToken);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const fd = new FormData();
      fd.append('body', JSON.stringify({ title, order: Number(order), duration: Number(duration) }));
      if (file) fd.append('videoURL', file);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/lessons/course/${courseId}`, {
        method: 'POST',
        body: fd,
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Upload failed');

      setMessage('Lesson created');
      setLoading(false);
      onClose && onClose();
      onSuccess && onSuccess(data);
    } catch (err) {
      setMessage(err.message || String(err));
      setLoading(false);
    }
  };

  const modal = (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Create Lesson</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={submit}>
            <label className="block text-sm text-gray-700">Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded mb-3" />

            <label className="block text-sm text-gray-700">Order</label>
            <input required type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="w-full p-2 border rounded mb-3" />

            <label className="block text-sm text-gray-700">Duration (seconds)</label>
            <input required type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-2 border rounded mb-3" />

            <label className="block text-sm text-gray-700">Video file</label>
            <input required type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full p-2 border rounded mb-4" />

            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={onClose} className="px-3 py-2 rounded bg-gray-100">Cancel</button>
              <button type="submit" disabled={loading} className="px-3 py-2 rounded bg-indigo-600 text-white">
                {loading ? 'Uploading...' : 'Create'}
              </button>
            </div>

            {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
            <p className="mt-3 text-xs text-gray-400">Pattern sent: {"{"}"title":"Lesson 1","order":1,"duration":600{"}"} and file field name: videoURL</p>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, typeof document !== 'undefined' ? document.body : null);
};

export default CreateLessonModal;
