"use client";

import { useQueryContext } from "@/context/QueryContext";
import { useRelatedQAContext } from "@/context/RelatedQAContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "./loading";
import { fetchQuestions } from "@/services/related-questions";
import { getMemory } from "@/services/get-memory";

export default function OutputPage() {
  const { query, setQuery } = useQueryContext();
  const { setRelatedQA } = useRelatedQAContext();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const handleAnswerChange = (id, question, value) => {
    setAnswers((prevResponses) => {
      const index = prevResponses.findIndex((response) => response.id === id);
      if (index !== -1) {
        return prevResponses.map((response) =>
          response.id === id
            ? { ...response, question, answer: value }
            : response
        );
      } else {
        return [
          ...prevResponses,
          {
            id,
            question,
            answer: value,
          },
        ];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRelatedQA(answers);
    router.push("/editor");
  };

  useEffect(() => {
    const uuid = sessionStorage.getItem("uuid");
    if (query) {
      const data = {
        uuid: uuid,
        requirement: query,
      };
      fetchQuestions(data)
        .then((response) => {
          setQuestions(response.questions);
        })
        .catch((res) => {
          console.log(res);
        });
    } else if (uuid) {
      getMemory(uuid)
        .then((response) => {
          setQuery(response.requirement);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [query]);

  return (
    <>
      {questions.length > 0 ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-3 m-auto"
          style={{ maxWidth: "70vw", minHeight: "100vh" }}
        >
          <h3
            className="p-6 mb-8 bg-white shadow-lg rounded-lg text-white font-medium"
            style={{ background: "#f5646d" }}
          >
            {query}
          </h3>
          <p
            className="animate-typing flex overflow-hidden whitespace-nowrap border-r-4 m-auto font-bold"
            style={{ maxWidth: "fit-content" }}
          >
            Let's get some queries answered...
          </p>
          {questions.map((question) => (
            <ul
              key={question.id}
              className={
                "m-auto p-3 " +
                (question.id % 2 == 0
                  ? "animate-slideinleft"
                  : "animate-slideinright")
              }
              style={{ minWidth: "67vw" }}
            >
              <li className="m-auto">{question.question}</li>
              <textarea
                className="w-full p-3 border border-gray-400 rounded-lg bg-gray-50 "
                onChange={(e) =>
                  handleAnswerChange(
                    question.id,
                    question.question,
                    e.target.value
                  )
                }
                placeholder="Enter your text here"
                required
              ></textarea>
            </ul>
          ))}

          <button
            type="submit"
            className="text-white hover:bg-sky-700 p-3 rounded-lg m-auto mb-3 bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl"
          >
            Submit
          </button>
        </form>
      ) : (
        <Loading />
      )}
    </>
  );
}
