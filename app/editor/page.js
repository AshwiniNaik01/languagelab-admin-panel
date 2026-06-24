"use client";

import EditorLayout from "../layouts/EditorLayout";
import {
  FaBookReader,
  FaVideo,
  FaGamepad,
  FaFileSignature,
} from "react-icons/fa";
import Link from "next/link";

export default function EditorDashboard() {
  return (
    <EditorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, Instructor Panel 👋
          </h1>
          <p className="text-sm text-gray-500">
            Design phonetics content, review media modules usage, and build
            vocabulary exercises for students.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-semibold text-gray-400 uppercase">
              Total Curated Topics
            </h4>
            <div className="text-2xl font-bold text-gray-800 mt-2">
              12 Topics
            </div>
            <div className="text-xs text-orange-500 font-semibold mt-1">
              36 Subtopics total
            </div>
          </div>
          <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-semibold text-gray-400 uppercase">
              Speech Audio Modules
            </h4>
            <div className="text-2xl font-bold text-gray-800 mt-2">
              18 Files
            </div>
            <div className="text-xs text-green-600 font-semibold mt-1">
              100% active playback
            </div>
          </div>
          <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-semibold text-gray-400 uppercase">
              Vocabulary Games Active
            </h4>
            <div className="text-2xl font-bold text-gray-800 mt-2">8 Games</div>
            <div className="text-xs text-orange-500 font-semibold mt-1">
              Spell check & Matches
            </div>
          </div>
          <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-semibold text-gray-400 uppercase">
              Assessments Conducted
            </h4>
            <div className="text-2xl font-bold text-gray-800 mt-2">
              450 Taken
            </div>
            <div className="text-xs text-green-600 font-semibold mt-1">
              84% Average passing grade
            </div>
          </div>
        </div>

        {/* Content Curations Actions Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b border-orange-50 pb-2">
              Quick Course Actions
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/editor/curriculum"
                className="flex flex-col items-center justify-center p-4 border border-orange-100 rounded-xl hover:bg-orange-50/50 transition"
              >
                <FaVideo className="text-orange-500 text-lg mb-2" />
                <span className="text-xs font-semibold">
                  Upload Audio/Video
                </span>
              </Link>
              <Link
                href="/editor/games"
                className="flex flex-col items-center justify-center p-4 border border-orange-100 rounded-xl hover:bg-orange-50/50 transition"
              >
                <FaGamepad className="text-orange-500 text-lg mb-2" />
                <span className="text-xs font-semibold">Setup Vocab Games</span>
              </Link>
              <Link
                href="/editor/assessments"
                className="flex flex-col items-center justify-center p-4 border border-orange-100 rounded-xl hover:bg-orange-50/50 transition"
              >
                <FaFileSignature className="text-orange-500 text-lg mb-2" />
                <span className="text-xs font-semibold">
                  Create Assessments
                </span>
              </Link>
              <Link
                href="/editor/curriculum"
                className="flex flex-col items-center justify-center p-4 border border-orange-100 rounded-xl hover:bg-orange-50/50 transition"
              >
                <FaBookReader className="text-orange-500 text-lg mb-2" />
                <span className="text-xs font-semibold">Add Text Passage</span>
              </Link>
            </div>
          </div>

          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b border-orange-50 pb-2">
              Recent Student Practice Actions
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <div>
                  <div className="font-semibold text-gray-700">
                    Alice Cooper (ABC Institute)
                  </div>
                  <div className="text-gray-400">
                    Completed Video module (95% watched)
                  </div>
                </div>
                <span className="text-gray-400">10 mins ago</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <div>
                  <div className="font-semibold text-gray-700">
                    Bob Dylan (ABC Institute)
                  </div>
                  <div className="text-gray-400">
                    Submitted Vocabulary Quiz Spelling test
                  </div>
                </div>
                <span className="text-gray-400">24 mins ago</span>
              </div>
              <div className="flex justify-between py-2">
                <div>
                  <div className="font-semibold text-gray-700">
                    Charlie Parker (XYZ Tech)
                  </div>
                  <div className="text-gray-400">
                    Replayed Audio practice pronunciation track
                  </div>
                </div>
                <span className="text-gray-400">1 hr ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EditorLayout>
  );
}
