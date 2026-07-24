"use client";

import { useState } from "react";
import EditorLayout from "../../layouts/EditorLayout";
import ScrollableTable from "../../components/Table";
import Button from "../../components/ui/Button";
import InputField from "../../components/form/InputField";

export default function EditorGamesPage() {
  const [games, setGames] = useState([
    {
      _id: "game1",
      title: "Phonetic Spelling Spell-Bee",
      game_type: "spell_word",
      wordsCount: 15,
      level: "Intermediate",
      time_limit: 300
    },
    {
      _id: "game2",
      title: "Definitions Memory Card Matcher",
      game_type: "match_meaning",
      wordsCount: 8,
      level: "Beginner",
      time_limit: 180
    }
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const newGame = {
      _id: "game_" + Date.now(),
      title: data.title,
      game_type: data.game_type,
      wordsCount: Number(data.words_count || 10),
      level: data.level,
      time_limit: Number(data.time_limit || 300)
    };

    setGames(prev => [...prev, newGame]);
    setIsFormOpen(false);
  };

  const columns = [
    {
      header: "Game Title",
      accessor: (row) => <span className="font-semibold text-gray-800 text-sm">{row.title}</span>
    },
    {
      header: "Practice Engine Style",
      accessor: (row) => (
        <span className="px-2 py-0.5 text-xs font-bold uppercase rounded bg-orange-100 text-orange-600">
          {row.game_type}
        </span>
      )
    },
    {
      header: "Target Vocabulary Words Count",
      accessor: (row) => <span className="text-xs font-semibold">{row.wordsCount} words</span>
    },
    {
      header: "Difficulty Level Group",
      accessor: (row) => <span className="text-xs text-gray-600">{row.level}</span>
    },
    {
      header: "Duration Limit",
      accessor: (row) => <span className="text-xs font-mono">{row.time_limit} seconds</span>
    }
  ];

  return (
    <EditorLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Vocabulary Interactive Games</h2>
            <p className="text-sm text-gray-500">Configure spelling bees, pronunciation trials, and vocabulary card matcher engines for topics.</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            + Add Vocabulary Game
          </Button>
        </div>

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 border-b border-orange-50 pb-2">Setup Word Game</h3>
            <InputField label="Game Title" name="title" required />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Game Mode Type</label>
                <select name="game_type" className="w-full rounded-xl border border-orange-300 bg-white px-4 py-3 text-sm focus:border-orange-500 focus:outline-none" required>
                  <option value="spell_word">Spell Bee Pronunciation</option>
                  <option value="match_meaning">Meaning Match Card Game</option>
                  <option value="mcq_synonyms">Synonyms / Antonyms Speedrun</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Student Target Level</label>
                <select name="level" className="w-full rounded-xl border border-orange-300 bg-white px-4 py-3 text-sm focus:border-orange-500 focus:outline-none">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Number of Target Words" name="words_count" type="number" defaultValue="10" required />
              <InputField label="Timer Count (seconds)" name="time_limit" type="number" defaultValue="300" required />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-orange-50">
              <Button variant="secondary" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit">Activate Game</Button>
            </div>
          </form>
        )}

        <ScrollableTable columns={columns} data={games} />
      </div>
    </EditorLayout>
  );
}
