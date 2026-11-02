import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Download,
  Filter,
  Search,
  CheckSquare,
  Square,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { PatientRecord } from '../types';
import { parseCSVToRecords, exportRecordsToCSV } from '../data/defaultData';

interface DataTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: PatientRecord[];
  onUpdateRecords: (records: PatientRecord[]) => void;
  selectedRecordIds: Set<string>;
  onToggleRecordSelection: (id: string) => void;
  onSelectAll: (select: boolean) => void;
}

export const DataTableModal: React.FC<DataTableModalProps> = ({
  isOpen,
  onClose,
  records,
  onUpdateRecords,
  selectedRecordIds,
  onToggleRecordSelection,
  onSelectAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchesService = serviceFilter === 'All' || r.Service_Line === serviceFilter;
    const matchesSearch =
      r.Record_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.Patient_Persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.Comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.AI_Risk_Flag.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesService && matchesSearch;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSVToRecords(text);
        if (parsed.length === 0) {
          setUploadError('CSV file appeared empty or invalid format.');
          return;
        }
        onUpdateRecords(parsed);
        onSelectAll(true);
      } catch (err: any) {
        setUploadError(`Failed to parse CSV: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadCSV = () => {
    const csvContent = exportRecordsToCSV(records);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hospital_patient_experience_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uniqueServices = Array.from(new Set(records.map((r) => r.Service_Line)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-950/70">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Patient Experience Dataset Management
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                {selectedRecordIds.size} of {records.length} Selected
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Upload custom CSV or inspect the synthetic hospital encounters cohort.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload CSV
            </button>
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Filter bar */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectAll(selectedRecordIds.size < records.length)}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-600 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800"
            >
              {selectedRecordIds.size === records.length ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                  Deselect All
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5" />
                  Select All
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Service Lines</option>
                {uniqueServices.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID, comment, flag..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Records Table */}
        <div className="overflow-y-auto flex-1 max-h-[calc(90vh-180px)]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur z-10 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">Sel</th>
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Persona</th>
                <th className="py-2.5 px-3">Age</th>
                <th className="py-2.5 px-3">Service Line</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3">Sat</th>
                <th className="py-2.5 px-3">Comm</th>
                <th className="py-2.5 px-3">Risk Flag</th>
                <th className="py-2.5 px-3 max-w-xs">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.map((r) => {
                const isSelected = selectedRecordIds.has(r.Record_ID);
                return (
                  <tr
                    key={r.Record_ID}
                    onClick={() => onToggleRecordSelection(r.Record_ID)}
                    className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors ${
                      isSelected ? 'bg-teal-50/20 dark:bg-teal-950/10' : 'opacity-40'
                    }`}
                  >
                    <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleRecordSelection(r.Record_ID)}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {r.Record_ID}
                    </td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300">
                      {r.Patient_Persona}
                    </td>
                    <td className="py-2 px-3 text-slate-500 dark:text-slate-400">
                      {r.Age_Group}
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {r.Service_Line}
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                      {r.Visit_Type}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-500 dark:text-slate-400">
                      {r.Year}
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {r.Patient_Satisfaction}
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                      {r.Communication_Rating}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          r.AI_Risk_Flag === 'Human Review Required'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                            : r.AI_Risk_Flag === 'Bias Review'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {r.AI_Risk_Flag}
                      </span>
                    </td>
                    <td className="py-2 px-3 max-w-sm truncate text-slate-600 dark:text-slate-400" title={r.Comment}>
                      "{r.Comment}"
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
