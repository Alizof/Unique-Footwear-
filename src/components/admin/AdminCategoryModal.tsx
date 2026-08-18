import React from 'react';
import { Category } from '../../types';
import { SingleImageUploader } from '../MultiImageUploader';
import { X, Save, FolderPlus, Edit2 } from 'lucide-react';

interface AdminCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryForm: Partial<Category>;
  setCategoryForm: React.Dispatch<React.SetStateAction<Partial<Category>>>;
  onSave: (e: React.FormEvent) => void;
}

export const AdminCategoryModal: React.FC<AdminCategoryModalProps> = ({
  isOpen,
  onClose,
  categoryForm,
  setCategoryForm,
  onSave
}) => {
  if (!isOpen) return null;

  const isEditing = !!categoryForm.id;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
              {isEditing ? <Edit2 className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                Category Manager
              </span>
              <h2 className="text-lg font-black text-slate-900">
                {isEditing ? 'Edit Category (कैटेगरी में बदलाव)' : 'Add New Category (नई कैटेगरी जोड़ें)'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          {/* Category Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category Title / Name (कैटेगरी का नाम) *
            </label>
            <input
              type="text"
              required
              value={categoryForm.name || ''}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              placeholder="e.g. Sports & Running Shoes / Leather Formals / Women Flats"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Gender Audience */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Audience / Group (किसके लिए)
            </label>
            <select
              value={categoryForm.gender || 'All'}
              onChange={(e) => setCategoryForm({ ...categoryForm, gender: e.target.value as any })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
            >
              <option value="All">All Audiences (सभी के लिए)</option>
              <option value="Men">Men (पुरुष)</option>
              <option value="Women">Women (महिलाएं)</option>
              <option value="Kids">Kids (बच्चे)</option>
            </select>
          </div>

          {/* Category Photo */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <SingleImageUploader
              value={categoryForm.image || ''}
              onChange={(url) => setCategoryForm({ ...categoryForm, image: url })}
              label="📸 Category Banner Photo (फोटो अपलोड करें या लिंक डालें)"
              helperText="कैटेगरी का हाई क्वालिटी बैनर फोटो फोन या कंप्यूटर से अपलोड करें।"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category Description (विवरण)
            </label>
            <textarea
              rows={2}
              value={categoryForm.description || ''}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              placeholder="इस कैटेगरी के फुटवियर का संक्षिप्त विवरण..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs resize-none text-slate-900"
            />
          </div>

          {/* Active / Deactivate switch */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Category Status:</span>
              <span className="text-[11px] text-slate-500">
                {categoryForm.isActive !== false ? '🟢 Active - वेबसाइट और मेनू में दिखेगा' : '⚪ Deactivated - छुपा हुआ है'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCategoryForm({ ...categoryForm, isActive: categoryForm.isActive === false })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                categoryForm.isActive !== false
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              {categoryForm.isActive !== false ? '● Active (चालू)' : '○ Deactivated (बंद)'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel (रद्द करें)
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
