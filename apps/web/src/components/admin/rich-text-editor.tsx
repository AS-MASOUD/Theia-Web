"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignRight,
  AlignCenter,
  AlignLeft,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  Eye,
  FileCode,
  Plus,
  Trash2,
  Sparkles,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Check,
  X,
  Upload,
} from "lucide-react";
import { webApi } from "@/lib/api";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "متن خود را اینجا بنویسید...",
  minHeight = "400px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"visual" | "html" | "preview">("visual");
  const [rawHtml, setRawHtml] = useState(value);

  // Table Modal
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [hasHeader, setHasHeader] = useState(true);

  // Image Modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Link Modal
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  // Sync incoming value to editor content if changed externally
  useEffect(() => {
    if (editorRef.current && viewMode === "visual") {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
    setRawHtml(value || "");
  }, [value, viewMode]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setRawHtml(html);
      onChange(html);
    }
  }, [onChange]);

  const exec = (command: string, arg: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleHeading = (tag: string) => {
    exec("formatBlock", tag);
  };

  // --- Table Actions ---
  const insertTable = () => {
    let tableHtml = `<div class="overflow-x-auto my-5"><table class="w-full text-right border-collapse border border-white/20 rounded-xl overflow-hidden text-sm">`;

    if (hasHeader) {
      tableHtml += `<thead><tr class="bg-[#1C1E24] text-[#F0AE55] font-bold border-b border-white/20">`;
      for (let c = 0; c < tableCols; c++) {
        tableHtml += `<th class="p-3 border border-white/10">سرستون ${c + 1}</th>`;
      }
      tableHtml += `</tr></thead>`;
    }

    tableHtml += `<tbody>`;
    const bodyRows = hasHeader ? tableRows - 1 : tableRows;
    for (let r = 0; r < Math.max(1, bodyRows); r++) {
      const rowBg = r % 2 === 0 ? "bg-[#141518]" : "bg-[#18191E]";
      tableHtml += `<tr class="${rowBg} border-b border-white/5">`;
      for (let c = 0; c < tableCols; c++) {
        tableHtml += `<td class="p-3 border border-white/10 text-[#D1D3D9]">سلول ${r + 1}-${c + 1}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table></div><p><br/></p>`;

    exec("insertHTML", tableHtml);
    setShowTableModal(false);
  };

  // --- Image Upload / Insert ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        try {
          const res = await webApi.uploadImage(dataUrl, file.name);
          setImageUrl(res.url);
        } catch {
          // Fallback to local data URL if server storage fails
          setImageUrl(dataUrl);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
    }
  };

  const insertImage = () => {
    if (!imageUrl) return;
    const imgHtml = `
      <figure class="my-6 text-center">
        <img src="${imageUrl}" alt="${imageAlt || 'تصویر مقاله'}" class="rounded-2xl max-w-full mx-auto border border-white/10 shadow-lg object-cover" />
        ${imageAlt ? `<figcaption class="mt-2 text-xs text-[#8E929E]">${imageAlt}</figcaption>` : ""}
      </figure>
      <p><br/></p>
    `;
    exec("insertHTML", imgHtml);
    setImageUrl("");
    setImageAlt("");
    setShowImageModal(false);
  };

  // --- Link Insert ---
  const insertLink = () => {
    if (!linkUrl) return;
    const text = linkText || linkUrl;
    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-[#F0AE55] underline hover:text-[#F3BE76] font-semibold">${text}</a>`;
    exec("insertHTML", linkHtml);
    setLinkUrl("");
    setLinkText("");
    setShowLinkModal(false);
  };

  // --- Callout Box ---
  const insertCallout = () => {
    const calloutHtml = `
      <div class="my-6 p-5 rounded-2xl bg-gradient-to-l from-[#1B1D22] to-[#16171B] border-r-4 border-[#F0AE55] border-white/10 text-sm leading-relaxed text-[#E0E2E8]">
        <strong class="text-[#F0AE55] block mb-1">نکته تخصصی تحلیل‌گر:</strong>
        متن توضیح تکمیلی و راهبرد پیشنهادی خود را اینجا وارد کنید.
      </div>
      <p><br/></p>
    `;
    exec("insertHTML", calloutHtml);
  };

  return (
    <div className="rounded-2xl border border-white/[0.09] bg-[#121316] overflow-hidden shadow-2xl flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2.5 bg-[#17181D] border-b border-white/[0.08] select-none text-xs">
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <div className="flex items-center gap-0.5 bg-[#1F2026] p-1 rounded-xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => handleHeading("h2")}
              title="تیتر اصلی (H2)"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C7C9D1] hover:text-[#F0AE55] transition-colors"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleHeading("h3")}
              title="تیتر فرعی (H3)"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C7C9D1] hover:text-[#F0AE55] transition-colors"
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleHeading("p")}
              title="پاراگراف عادی"
              className="px-2 py-1 rounded-lg hover:bg-white/10 text-[#C7C9D1] font-semibold text-[11px]"
            >
              P
            </button>
          </div>

          {/* Inline Styles */}
          <div className="flex items-center gap-0.5 bg-[#1F2026] p-1 rounded-xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => exec("bold")}
              title="پررنگ (Bold)"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C7C9D1] hover:text-[#F0AE55] transition-colors"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => exec("italic")}
              title="مورب (Italic)"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C7C9D1] hover:text-[#F0AE55] transition-colors"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => exec("underline")}
              title="خط زیرین (Underline)"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C7C9D1] hover:text-[#F0AE55] transition-colors"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => exec("strikeThrough")}
              title="خط‌خورده (Strike)"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C7C9D1] hover:text-[#F0AE55] transition-colors"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-0.5 bg-[#1F2026] p-1 rounded-xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => exec("justifyRight")}
              title="راست‌چین (RTL)"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C7C9D1] hover:text-[#F0AE55] transition-colors"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => exec("justifyCenter")}
              title="وسط‌چین"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C7C9D1] hover:text-[#F0AE55] transition-colors"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => exec("justifyLeft")}
              title="چپ‌چین (LTR)"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C7C9D1] hover:text-[#F0AE55] transition-colors"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Lists & Quote */}
          <div className="flex items-center gap-0.5 bg-[#1F2026] p-1 rounded-xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => exec("insertUnorderedList")}
              title="لیست بالت‌دار"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C7C9D1] hover:text-[#F0AE55] transition-colors"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => exec("insertOrderedList")}
              title="لیست شماره‌دار"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C7C9D1] hover:text-[#F0AE55] transition-colors"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => exec("formatBlock", "blockquote")}
              title="نقل قول"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C7C9D1] hover:text-[#F0AE55] transition-colors"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => exec("insertHorizontalRule")}
              title="خط جداکننده"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C7C9D1] hover:text-[#F0AE55] transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Rich Elements: Table, Image, Link, Callout */}
          <div className="flex items-center gap-1 bg-[#1F2026] p-1 rounded-xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setShowTableModal(true)}
              title="درج جدول"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#F0AE55]/20 text-[#F0AE55] font-semibold transition-all"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>جدول</span>
            </button>
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              title="درج تصویر"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#F0AE55]/20 text-[#F0AE55] font-semibold transition-all"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>تصویر</span>
            </button>
            <button
              type="button"
              onClick={() => setShowLinkModal(true)}
              title="درج پیوند"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C7C9D1] hover:text-[#F0AE55] transition-colors"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={insertCallout}
              title="جعبه نکته برجسته"
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/10 text-[#8E929E] hover:text-[#F0AE55] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F0AE55]" />
              <span className="hidden sm:inline">نکته تحلیلی</span>
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#1F2026] p-1 rounded-xl border border-white/[0.06] mt-1 sm:mt-0">
          <button
            type="button"
            onClick={() => setViewMode("visual")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "visual"
                ? "bg-[#F0AE55] text-[#0D0E10] shadow-[0_0_10px_rgba(240,174,85,0.3)]"
                : "text-[#A0A3AD] hover:text-white"
            }`}
          >
            ویرایشگر تصویری
          </button>
          <button
            type="button"
            onClick={() => setViewMode("html")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "html"
                ? "bg-[#F0AE55] text-[#0D0E10] shadow-[0_0_10px_rgba(240,174,85,0.3)]"
                : "text-[#A0A3AD] hover:text-white"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>کد HTML</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "preview"
                ? "bg-[#F0AE55] text-[#0D0E10] shadow-[0_0_10px_rgba(240,174,85,0.3)]"
                : "text-[#A0A3AD] hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>پیش‌نمایش</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-6 flex-1 min-h-[350px]">
        {viewMode === "visual" && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            dir="rtl"
            style={{ minHeight }}
            className="outline-none text-[#F0F0F1] text-base leading-relaxed font-normal focus:ring-0 empty:before:content-[attr(data-placeholder)] empty:before:text-white/20 prose prose-invert max-w-none"
            data-placeholder={placeholder}
          />
        )}

        {viewMode === "html" && (
          <textarea
            value={rawHtml}
            onChange={(e) => {
              setRawHtml(e.target.value);
              onChange(e.target.value);
            }}
            dir="ltr"
            style={{ minHeight }}
            className="w-full bg-[#0D0E10] font-mono text-sm text-[#A0E0B0] p-4 rounded-xl border border-white/10 outline-none focus:border-[#F0AE55] transition-all resize-y"
            placeholder="<html>...</html>"
          />
        )}

        {viewMode === "preview" && (
          <div
            dir="rtl"
            style={{ minHeight }}
            className="prose prose-invert max-w-none text-[#D1D3D9] leading-loose"
            dangerouslySetInnerHTML={{ __html: rawHtml || "<p class='text-[#707581]'>محتوایی جهت پیش‌نمایش وجود ندارد.</p>" }}
          />
        )}
      </div>

      {/* Insert Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#17181D] border border-white/15 p-6 space-y-5 shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-[#F0F0F1] flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-[#F0AE55]" />
                <span>تنظیمات جدول جدید</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="p-1 rounded-lg text-[#8E929E] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-[#A0A3AD]">تعداد سطرها:</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={tableRows}
                  onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full bg-[#101114] border border-white/10 rounded-xl px-3 py-2 text-center font-bold text-[#F0F0F1]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[#A0A3AD]">تعداد ستون‌ها:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full bg-[#101114] border border-white/10 rounded-xl px-3 py-2 text-center font-bold text-[#F0F0F1]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-[#C7C9D1] cursor-pointer">
              <input
                type="checkbox"
                checked={hasHeader}
                onChange={(e) => setHasHeader(e.target.checked)}
                className="rounded accent-[#F0AE55]"
              />
              <span>شامل ردیف سرستون رنگی (Header Row)</span>
            </label>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#A0A3AD] hover:bg-white/5"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={insertTable}
                className="px-5 py-2 rounded-xl bg-[#F0AE55] text-[#0D0E10] text-xs font-bold hover:bg-[#F3BE76] transition-all shadow-[0_0_12px_rgba(240,174,85,0.3)]"
              >
                افزودن جدول به متن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#17181D] border border-white/15 p-6 space-y-5 shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-[#F0F0F1] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#F0AE55]" />
                <span>افزودن تصویر به محتوا</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="p-1 rounded-lg text-[#8E929E] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct File Upload */}
            <div className="p-4 rounded-xl border border-dashed border-white/20 bg-[#121316] text-center space-y-2">
              <Upload className="w-7 h-7 mx-auto text-[#F0AE55]" />
              <p className="text-xs text-[#A0A3AD]">آپلود تصویر از روی سیستم (JPG, PNG, WebP)</p>
              <label className="inline-block px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-[#F0F0F1] cursor-pointer font-semibold transition-all">
                {isUploading ? "در حال آپلود..." : "انتخاب فایل از حافظه"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#A0A3AD]">یا آدرس اینترنتی تصویر (Image URL):</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/chart.png"
                dir="ltr"
                className="w-full bg-[#101114] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#A0A3AD]">توضیح زیر تصویر (کپشن اختیاری):</label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="مثال: نمودار تحلیل فیبوناچی انس جهانی طلا"
                className="w-full bg-[#101114] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
              />
            </div>

            {imageUrl && (
              <div className="p-2 rounded-xl bg-[#101114] border border-white/10 text-center">
                <img
                  src={imageUrl}
                  alt="پیش‌نمایش"
                  className="max-h-36 mx-auto rounded-lg object-contain"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#A0A3AD] hover:bg-white/5"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={insertImage}
                disabled={!imageUrl || isUploading}
                className="px-5 py-2 rounded-xl bg-[#F0AE55] disabled:opacity-50 text-[#0D0E10] text-xs font-bold hover:bg-[#F3BE76] transition-all shadow-[0_0_12px_rgba(240,174,85,0.3)]"
              >
                درج تصویر
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#17181D] border border-white/15 p-6 space-y-5 shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-[#F0F0F1] flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-[#F0AE55]" />
                <span>افزودن لینک (Hyperlink)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1 rounded-lg text-[#8E929E] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#A0A3AD]">متن پیوند:</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="مثال: مطالعه گزارش تورم بانک مرکزی"
                className="w-full bg-[#101114] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#A0A3AD]">آدرس مقصد (URL):</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                dir="ltr"
                className="w-full bg-[#101114] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#A0A3AD] hover:bg-white/5"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={insertLink}
                disabled={!linkUrl}
                className="px-5 py-2 rounded-xl bg-[#F0AE55] disabled:opacity-50 text-[#0D0E10] text-xs font-bold hover:bg-[#F3BE76] transition-all shadow-[0_0_12px_rgba(240,174,85,0.3)]"
              >
                افزودن لینک
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
