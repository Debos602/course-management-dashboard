import React from 'react';
import { X, Save, Tag } from 'lucide-react';

const CourseModal = ({ editingCourse, data, handleInputChange, handleFileChange, handleTagToggle, allTags, onCancel, onSubmit, isCreating, isUpdating }) => {
  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                <input type="text" name="title" required value={data.title} onChange={handleInputChange} className="modal-input w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter course title" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea name="description" required rows="3" value={data.description} onChange={handleInputChange} className="modal-input w-full px-3 py-2 border border-gray-300 rounded-lg resize-none" placeholder="Describe the course" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instructor Name *</label>
                <input type="text" name="instructorName" required value={data.instructorName} onChange={handleInputChange} className="modal-input w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter instructor name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                <input type="number" name="price" required min="0" step="0.01" value={data.price} onChange={handleInputChange} className="modal-input w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 44.99" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <input type="text" name="category" required value={data.category} onChange={handleInputChange} className="modal-input w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., optimization" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {allTags.slice(0,10).map(tag => (
                    <button key={tag} type="button" data-tag={tag} onClick={()=>handleTagToggle(tag)} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${data.tags.includes(tag) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
                      <Tag className="w-3 h-3" /> {tag}
                    </button>
                  ))}
                </div>
                <input type="text" placeholder="Add custom tags (comma separated)" className="modal-input w-full px-3 py-2 border border-gray-300 rounded-lg" onKeyDown={(e)=>{ if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); const value = e.target.value.trim(); if (value && !data.tags.includes(value)) { const newTags = [...data.tags, value]; handleInputChange({ target: { name: 'tags', value: newTags } }); e.target.value = ''; } } }} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
                <input type="file" name="thumbnailURL" accept="image/*" onChange={handleFileChange} className="modal-input w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2"><input type="checkbox" name="isPublished" checked={data.isPublished} onChange={handleInputChange} className="rounded" /> <span className="text-sm font-medium text-gray-700">Publish this course</span></label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Cancel</button>
              <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg"> <Save className="w-4 h-4" /> {editingCourse ? (isUpdating ? 'Updating...' : 'Update Course') : (isCreating ? 'Creating...' : 'Create Course')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;
