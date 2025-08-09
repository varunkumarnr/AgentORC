const Loading = () => {
  return (
    <div className="flex space-x-2 justify-center items-center bg-white h-screen dark:invert">
      <div
        className="h-8 w-8 rounded-full animate-bounce [animation-delay:-0.25s]"
        style={{ background: "#FF4000" }}
      ></div>
      <div
        className="h-8 w-8 rounded-full animate-bounce [animation-delay:-0.5s]"
        style={{ background: "#FF8200" }}
      ></div>
      <div
        className="h-8 w-8 rounded-full animate-bounce [animation-delay:-0.75s]"
        style={{ background: "#FFC100" }}
      ></div>
      <div
        className="h-8 w-8 rounded-full animate-bounce [animation-delay:-1s]"
        style={{ background: "#FFEAAE" }}
      ></div>
    </div>
  );
};

export default Loading;