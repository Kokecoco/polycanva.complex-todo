
import React, { useState, useEffect } from 'react';
import { Todo, Priority, Subtask } from '../types';
import { PRIORITY_OPTIONS } from '../constants';
import { generateSubtasks, suggestPriority } from '../services/geminiService';
import { AIPowerBadge } from './AIPowerBadge';
import { Spinner } from './Spinner';
import { X, Sparkles, BrainCircuit, Trash2 } from 'lucide-react';

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: any) => void;
  existingTodo: Todo | null;
}

export const AddTodoModal: React.FC<AddTodoModalProps> = ({ isOpen, onClose, onSave, existingTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    if (existingTodo) {
      setTitle(existingTodo.title);
      setDescription(existingTodo.description || '');
      setPriority(existingTodo.priority);
      setDueDate(existingTodo.dueDate || '');
      setTags(existingTodo.tags || []);
      setSubtasks(existingTodo.subtasks || []);
    } else {
      // Reset form for new todo
      setTitle('');
      setDescription('');
      setPriority(Priority.MEDIUM);
      setDueDate('');
      setTags([]);
      setSubtasks([]);
    }
    setAiError('');
  }, [existingTodo, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const todoData = {
      id: existingTodo?.id || undefined,
      title,
      description,
      priority,
      dueDate,
      tags,
      subtasks,
      completed: existingTodo?.completed || false,
      createdAt: existingTodo?.createdAt || new Date().toISOString()
    };
    onSave(todoData);
    onClose();
  };

  const handleSuggestPriority = async () => {
    if (!title.trim()) {
        setAiError("優先度を提案するには、まずタイトルを入力してください。");
        return;
    }
    setIsLoadingAI(true);
    setAiError('');
    try {
      const suggested = await suggestPriority(title, description);
      setPriority(suggested);
    } catch (error) {
      setAiError("AIによる優先度提案に失敗しました。");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleGenerateSubtasks = async () => {
    if (!title.trim()) {
        setAiError("サブタスクを生成するには、まずタイトルを入力してください。");
        return;
    }
    setIsLoadingAI(true);
    setAiError('');
    try {
      const generated = await generateSubtasks(title);
      const newSubtasks: Subtask[] = generated.map(text => ({ id: crypto.randomUUID(), text, completed: false }));
      setSubtasks(prev => [...prev, ...newSubtasks]);
    } catch (error) {
      setAiError("AIによるサブタスク生成に失敗しました。");
    } finally {
      setIsLoadingAI(false);
    }
  };
  
  const handleAddSubtask = () => {
    if(subtaskInput.trim()) {
        setSubtasks([...subtasks, {id: crypto.randomUUID(), text: subtaskInput.trim(), completed: false}]);
        setSubtaskInput('');
    }
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold">{existingTodo ? 'ToDoの編集' : '新しいToDoの作成'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">タイトル <span className="text-red-500">*</span></label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full input-style" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">詳細</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full input-style"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium mb-1">優先度</label>
              <div className="flex items-center gap-2">
                <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full input-style">
                  {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <button type="button" onClick={handleSuggestPriority} disabled={isLoadingAI} className="btn-ai-subtle"><BrainCircuit size={18}/><AIPowerBadge /></button>
              </div>
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium mb-1">期日</label>
              <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full input-style" />
            </div>
          </div>
           <div>
              <label className="block text-sm font-medium mb-1">サブタスク</label>
              <div className="space-y-2">
                {subtasks.map((subtask) => (
                   <div key={subtask.id} className="flex items-center gap-2">
                     <span className="flex-grow p-2 bg-gray-100 dark:bg-gray-700 rounded">{subtask.text}</span>
                     <button type="button" onClick={() => handleRemoveSubtask(subtask.id)} className="p-1 text-gray-500 hover:text-red-500"><Trash2 size={16}/></button>
                   </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="text" value={subtaskInput} onChange={(e) => setSubtaskInput(e.target.value)} placeholder="新しいサブタスク..." className="w-full input-style" />
                <button type="button" onClick={handleAddSubtask} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500">追加</button>
                <button type="button" onClick={handleGenerateSubtasks} disabled={isLoadingAI} className="btn-ai-subtle"><Sparkles size={18}/><AIPowerBadge /></button>
              </div>
           </div>
           {isLoadingAI && <div className="flex justify-center items-center gap-2 text-sm text-blue-600 dark:text-blue-400"><Spinner />AIが思考中...</div>}
           {aiError && <p className="text-sm text-red-500">{aiError}</p>}
        </form>
        <div className="flex justify-end gap-3 p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button type="button" onClick={onClose} className="btn-secondary">キャンセル</button>
          <button type="submit" onClick={handleSubmit} className="btn-primary">保存</button>
        </div>
      </div>
       <style>{`
        .input-style {
            padding: 0.5rem 0.75rem;
            border-width: 1px;
            border-color: #d1d5db; /* gray-300 */
            border-radius: 0.375rem; /* rounded-md */
            background-color: #f9fafb; /* gray-50 */
            width: 100%;
        }
        .dark .input-style {
            border-color: #4b5563; /* gray-600 */
            background-color: #374151; /* gray-700 */
            color: #f3f4f6; /* gray-100 */
        }
        .input-style:focus {
            outline: 2px solid transparent;
            outline-offset: 2px;
            --tw-ring-color: #3b82f6; /* blue-500 */
            box-shadow: 0 0 0 2px var(--tw-ring-color);
        }
        .btn-primary {
            padding: 0.5rem 1rem;
            background-color: #2563eb; /* blue-600 */
            color: white;
            border-radius: 0.375rem; /* rounded-lg */
            font-weight: 500;
        }
        .btn-primary:hover {
            background-color: #1d4ed8; /* blue-700 */
        }
        .btn-secondary {
            padding: 0.5rem 1rem;
            background-color: #e5e7eb; /* gray-200 */
            color: #1f2937; /* gray-800 */
            border-radius: 0.375rem; /* rounded-lg */
            font-weight: 500;
        }
        .dark .btn-secondary {
            background-color: #4b5563; /* gray-600 */
            color: #f9fafb; /* gray-50 */
        }
        .btn-secondary:hover {
            background-color: #d1d5db; /* gray-300 */
        }
        .dark .btn-secondary:hover {
            background-color: #6b7280; /* gray-500 */
        }
        .btn-ai-subtle {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            border-radius: 0.375rem;
            border: 1px solid #d1d5db; /* gray-300 */
            background-color: white;
        }
        .dark .btn-ai-subtle {
            border-color: #4b5563; /* gray-600 */
            background-color: #374151; /* gray-700 */
        }
        .btn-ai-subtle:hover {
            background-color: #f3f4f6; /* gray-100 */
        }
        .dark .btn-ai-subtle:hover {
            background-color: #4b5563; /* gray-600 */
        }
        .btn-ai-subtle:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        @keyframes fade-in-out {
            0%, 100% { opacity: 0; transform: translateY(-20px); }
            10%, 90% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-out {
            animation: fade-in-out 5s ease-in-out forwards;
        }
       `}</style>
    </div>
  );
};
