"use client";

import { useState, useEffect } from "react";
import { useQueryContext } from "../context/QueryContext";
import { useRouter } from "next/navigation";
import CustomData from "./custom-data/page";
import Header from "./header/page";
import { v4 } from "uuid";

export default function Home() {
  const { setQuery, query } = useQueryContext();
  const router = useRouter();
  const [text, setText] = useState("");
  const [isTextValid, setIsTextValid] = useState(false);

  useEffect(() => {
    validateText();
  }, [text]);

  useEffect(() => {
    if (query != null) {
      setText(query);
    }
  }, [query]);

  const validateText = () => {
    setIsTextValid(text != "");
  };

  const handleClick = () => {
    const uuid = v4();
    sessionStorage.setItem("uuid", uuid);
    setQuery(text);
    router.push("/related-questions");
  };

  const handleAgentCall = () => {
    const uuid = v4();
    sessionStorage.setItem("uuid", uuid);
    router.push("/editor");
  };

  return (
    <>
      <Header />
      <div className="items-center flex flex-col main-div">
        <h3 className="mt-4">Here are some tasks!</h3>
        <CustomData />
        <div className="mt-4 flex" style={{ minWidth: "80vw" }}>
          <textarea
            className="w-full p-3 border border-gray-400 rounded-lg bg-gray-50 resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here"
            required
          ></textarea>
          <button
            onClick={handleClick}
            className="text-white hover:bg-sky-700 m-auto p-3 rounded-lg ml-3 bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl disabled:cursor-not-allowed"
            disabled={!isTextValid}
          >
            Submit
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-2 items-center">
          <h1> OR</h1>
          <button
            onClick={handleAgentCall}
            className="text-white hover:bg-sky-700 m-auto p-3 rounded-lg ml-3 bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl"
          >
            Create you own agents
          </button>
        </div>
      </div>
    </>
  );
}
