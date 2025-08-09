"use client";

import { custom_queries } from "./queries";
import { useQueryContext } from "../../context/QueryContext";

export default function CustomData() {
  const { setQuery } = useQueryContext();
  const questions = custom_queries;

  const handleClick = (question) => {
    setQuery(question);
  };

  return (
    <div className="grid grid-cols-2 gap-6 mt-4" style={{ maxWidth: "80vw" }}>
      {questions.map((question) => (
        <div
          className="p-3 bg-gray-50 rounded-lg hover:border-gray-400 hover:border"
          key={question.id}
        >
          <a
            href="#"
            className="block"
            onClick={(e) => {
              e.preventDefault();
              handleClick(question.query);
            }}
          >
            <p className="font-normal dark:text-gray-400">{question.query}</p>
          </a>
        </div>
      ))}
    </div>
  );
}
