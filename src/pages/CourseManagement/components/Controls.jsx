import React from 'react';
import { Search, X, Plus, Tag } from 'lucide-react';

const Controls = ({ search, setSearch, minPrice, setMinPrice, maxPrice, setMaxPrice, categories, selectedCategory, setSelectedCategory, selectedStatus, setSelectedStatus, allTags, selectedTags, handleTagFilterToggle, onCreate }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input value={search} onChange={(e)=>setSearch(e.target.value)} type="text" placeholder="Search courses..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min Price" className="w-24 px-3 py-2 border border-gray-300 rounded-lg" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} />
            <span className="text-gray-400">-</span>
            <input type="number" placeholder="Max Price" className="w-24 px-3 py-2 border border-gray-300 rounded-lg" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} />
          </div>

          <select className="border border-gray-300 rounded-lg px-3 py-2" value={selectedCategory} onChange={(e)=>setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className="border border-gray-300 rounded-lg px-3 py-2" value={selectedStatus} onChange={(e)=>setSelectedStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <button onClick={()=>{ setSelectedCategory(''); setSelectedStatus(''); setMinPrice(''); setMaxPrice(''); setSearch(''); }} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4" /> Clear Filters
          </button>

          <button onClick={onCreate} className="create-button flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            <span>New Course</span>
          </button>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0,10).map(tag => (
              <button key={tag} data-filter-tag={tag} onClick={()=>handleTagFilterToggle(tag)} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${selectedTags.includes(tag) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <Tag className="w-3 h-3" /> {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Controls;
