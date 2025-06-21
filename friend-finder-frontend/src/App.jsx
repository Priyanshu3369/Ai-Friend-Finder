import React from "react";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Tailwind + ShadCN UI Test
      </h1>
      <Button onClick={() => alert("ShadCN Button Clicked!")}>
        Click Me
      </Button>
    </div>
  );
}

export default App;
