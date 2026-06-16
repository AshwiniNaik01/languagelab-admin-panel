"use client";

import { useState } from "react";
import Checkbox from "./components/form/Checkbox";

export default function Home() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="p-10 space-y-4">

      <Checkbox
        label="Accept Terms & Conditions"
        name="terms"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      />

      <p className="text-sm text-gray-600">
        Status: {isChecked ? "Checked ✅" : "Not Checked ❌"}
      </p>

    </div>
  );
}