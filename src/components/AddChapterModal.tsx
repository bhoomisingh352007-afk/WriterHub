import React, { useState } from "react";
import { Manuscript, Chapter } from "../types";
import { X, PlusCircle, BookOpen, FileText, CheckCircle2, Sparkles, Lock } from "lucide-react";

interface AddChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  manuscript: Manuscript | null;
  onAddChapter: (manuscriptId: string, newChapter: Chapter) => void;
}

export const AddChapterModal: React.FC<AddChapterModalProps> = ({
  isOpen,
  onClose,
  manuscript,
  onAddChapter,
}) => {
  if (!isOpen || !manuscript) return null;

  const nextChapterNum = (manuscript.chapters?.length || 0) + 1;
  const [chapterTitle, setChapterTitle] = useState<string>(`Chapter ${nextChapterNum}: `);
  const [content, setContent] = useState<string>("");
  const [isSample, setIsSample] = useState<boolean>(nextChapterNum <= 2);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const wordCount = content.split(/\s+/).filter(Boolean).length;

    const newChapter: Chapter = {
      id: `ch-${manuscript.id}-${Date.now()}`,
      number: nextChapterNum,
      title: chapterTitle || `Chapter ${nextChapterNum}`,
      wordCount,
      content,
      isSample,
    };

    setTimeout(() => {
      onAddChapter(manuscript.id, newChapter);
      setIsSubmitting(false);
      setContent("");
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-4 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-emerald-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="font-bold text-white text-base">Add New Chapter to "{manuscript.title}"</h2>
        </div>
        <p className="text-xs text-slate-400">
          नया चैप्टर जोड़ें — यह तुरंत आपके पाठकों एवं प्रकाशकों के सुरक्षित DRM रीडर में दिखाई देगा।
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Chapter Number & Title (चैप्टर शीर्षक) *
            </label>
            <input
              type="text"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              placeholder="e.g. Chapter 2: The Dark Discovery"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Chapter Text / Scene Content (चैप्टर का कंटेंट) *
            </label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write or paste your new chapter text here in Hindi or English..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-serif leading-relaxed"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Estimated Word Count: {content.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <div>
              <p className="font-semibold text-slate-200">Allow as Free Sample Chapter?</p>
              <p className="text-[11px] text-slate-400">
                If checked, publishers can preview this chapter before requesting full access.
              </p>
            </div>
            <input
              type="checkbox"
              checked={isSample}
              onChange={(e) => setIsSample(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg"
          >
            {isSubmitting ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <PlusCircle className="w-4 h-4" />
            )}
            <span>{isSubmitting ? "Encrypting & Adding Chapter..." : "Publish New Chapter (चैप्टर प्रकाशित करें)"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
