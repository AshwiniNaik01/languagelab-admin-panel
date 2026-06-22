"use client";

import { useState } from "react";
import InputField from "./InputField";
import Button from "../ui/Button";

export default function MediaModulesForm({ topic_id, sub_topic_id, onSubmit, onCancel }) {
  const [moduleType, setModuleType] = useState("audio");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Structure words & questions lists mock based on type
    data.topic_id = topic_id || "topic1";
    data.sub_topic_id = sub_topic_id || "sub1";
    data.module_type = moduleType;

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 border-b border-orange-50 pb-2">
        Add Interactive Lesson Module
      </h3>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold text-gray-700">Module Type</label>
        <div className="flex gap-2">
          {["audio", "video", "text", "exercise", "vocabulary"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setModuleType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                moduleType === t 
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm" 
                  : "bg-white text-gray-600 border-orange-100 hover:bg-orange-50"
              }`}
            >
              {t} Module
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <InputField label="Module Title" name="title" placeholder="e.g. Dialogue Speaking Practice" required />
        </div>
        <InputField label="Order" name="order" type="number" defaultValue="1" required />
      </div>

      <div className="w-full">
        <label className="block mb-2 text-sm font-semibold text-gray-700">Module Description</label>
        <textarea name="description" rows={2} className="w-full px-4 py-3 text-sm rounded-xl border border-orange-300 focus:outline-none" placeholder="Provide instructions for students..." />
      </div>

      {/* AUDIO SPECIFIC */}
      {moduleType === "audio" && (
        <div className="border-t border-orange-100 pt-4 space-y-3">
          <h4 className="font-semibold text-sm text-orange-600">Audio Settings</h4>
          <div className="grid grid-cols-3 gap-3">
            <InputField label="Audio CDN URL" name="audio_url" placeholder="S3 audio URL" required />
            <InputField label="Duration (sec)" name="duration_sec" type="number" placeholder="180" required />
            <div>
              <label className="block mb-2 text-xs font-semibold text-gray-700">Audio Format</label>
              <select name="audio_type" className="w-full rounded-xl border border-orange-300 px-3 py-2 text-xs">
                <option value="mp3">MP3</option>
                <option value="wav">WAV</option>
                <option value="ogg">OGG</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Speaker Name" name="speaker_name" placeholder="Native English (Female)" />
            <div>
              <label className="block mb-2 text-xs font-semibold text-gray-700">Speech Speed</label>
              <select name="audio_speed" className="w-full rounded-xl border border-orange-300 px-3 py-2 text-xs">
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
              </select>
            </div>
          </div>
          <textarea name="transcript" rows={2} className="w-full px-4 py-3 text-xs rounded-xl border border-orange-300 focus:outline-none" placeholder="Optional audio transcript text..." />
        </div>
      )}

      {/* VIDEO SPECIFIC */}
      {moduleType === "video" && (
        <div className="border-t border-orange-100 pt-4 space-y-3">
          <h4 className="font-semibold text-sm text-orange-600">Video Settings</h4>
          <div className="grid grid-cols-3 gap-3">
            <InputField label="Video S3 / CDN URL" name="video_url" placeholder="S3 video URL" required />
            <InputField label="Duration (sec)" name="duration_sec" type="number" placeholder="300" required />
            <InputField label="Thumbnail Image URL" name="thumbnail_url" placeholder="Thumbnail path" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-2 text-xs font-semibold text-gray-700">Format</label>
              <select name="video_format" className="w-full rounded-xl border border-orange-300 px-3 py-2 text-xs">
                <option value="mp4">MP4</option>
                <option value="webm">WEBM</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-xs font-semibold text-gray-700">Speed</label>
              <select name="video_speed" className="w-full rounded-xl border border-orange-300 px-3 py-2 text-xs">
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
              </select>
            </div>
          </div>
          <InputField label="Subtitles Subtitle JSON Array" name="subtitle" placeholder="[{start_time: '0.5s', text: 'Hello'}]" />
        </div>
      )}

      {/* TEXT SPECIFIC */}
      {moduleType === "text" && (
        <div className="border-t border-orange-100 pt-4 space-y-3">
          <h4 className="font-semibold text-sm text-orange-600">Reading Passage Settings</h4>
          <div className="grid grid-cols-3 gap-3">
            <InputField label="Reading CEFR Level (e.g. B2)" name="content_level" placeholder="B2 Intermediate" />
            <InputField label="Estimated Read Time (min)" name="read_time_min" type="number" placeholder="5" />
            <InputField label="Source Attribution" name="content_source" placeholder="BBC Learning English" />
          </div>
          <div>
            <label className="block mb-2 text-xs font-semibold text-gray-700">
              Reading Passage Body Text (HTML supported) <span className="ml-1 text-orange-500">*</span>
            </label>
            <textarea name="content_body" rows={4} className="w-full px-4 py-3 text-sm rounded-xl border border-orange-300 focus:outline-none" placeholder="Paste full article reading text here..." required />
          </div>
        </div>
      )}

      {/* EXERCISE SPECIFIC */}
      {moduleType === "exercise" && (
        <div className="border-t border-orange-100 pt-4 space-y-3">
          <h4 className="font-semibold text-sm text-orange-600">Exercise Quiz Settings</h4>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block mb-2 text-xs font-semibold text-gray-700">
                Exercise Type <span className="ml-1 text-orange-500">*</span>
              </label>
              <select name="exercise_type" className="w-full rounded-xl border border-orange-300 px-3 py-2 text-xs" required>
                <option value="mcq">Multiple Choice Questions (MCQ)</option>
                <option value="fill_blank">Fill in the Blanks</option>
                <option value="true_false">True or False</option>
                <option value="match">Match Meanings</option>
                <option value="reorder">Sentence Reordering</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-xs font-semibold text-gray-700">Difficulty</label>
              <select name="difficulty" className="w-full rounded-xl border border-orange-300 px-3 py-2 text-xs">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <InputField label="Max Attempts Limit" name="max_attempts" type="number" defaultValue="5" />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
              <input type="checkbox" name="shuffle_questions" defaultChecked className="accent-orange-500" /> Shuffle Questions
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
              <input type="checkbox" name="shuffle_options" defaultChecked className="accent-orange-500" /> Shuffle Options
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
              <input type="checkbox" name="show_explanation" defaultChecked className="accent-orange-500" /> Show Explanation After Submit
            </label>
          </div>
        </div>
      )}

      {/* VOCABULARY SPECIFIC */}
      {moduleType === "vocabulary" && (
        <div className="border-t border-orange-100 pt-4 space-y-3">
          <h4 className="font-semibold text-sm text-orange-600">Vocabulary Words Practice List</h4>
          <p className="text-xs text-gray-500">Define key words that students must master in this lesson topic.</p>
          <div className="grid grid-cols-3 gap-2">
            <InputField label="Word" name="word" placeholder="e.g. Eloquent" />
            <InputField label="Pronunciation Key" name="pronunciation" placeholder="EL-oh-kwent" />
            <div>
              <label className="block mb-2 text-xs font-semibold text-gray-700">Part of Speech</label>
              <select name="part_of_speech" className="w-full rounded-xl border border-orange-300 px-3 py-2 text-xs">
                <option value="noun">Noun</option>
                <option value="verb">Verb</option>
                <option value="adjective">Adjective</option>
                <option value="adverb">Adverb</option>
                <option value="phrase">Phrase</option>
              </select>
            </div>
          </div>
          <InputField label="Meaning/Definition" name="meaning" placeholder="Fluent or persuasive in speaking or writing" />
          <InputField label="Example Sentence" name="example" placeholder="His eloquent speech moved the audience." />
        </div>
      )}

      {/* SHARED QUESTIONS WRAPPER FOR GRADING */}
      <div className="border-t border-orange-100 pt-4 space-y-3">
        <h4 className="font-semibold text-sm text-gray-700">Grades & Limits Settings</h4>
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Total Module Marks" name="total_marks" type="number" defaultValue="10" />
          <InputField label="Time Limit (seconds)" name="time_limit_sec" type="number" placeholder="e.g. 600" />
          <InputField label="Passing score" name="passing_score" type="number" defaultValue="5" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-orange-50">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Module
        </Button>
      </div>
    </form>
  );
}
