import { useState, useEffect } from "react";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  // 初回読み込み
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // ★ 初回をスキップする
  useEffect(() => {
    if (todos.length === 0) return; // ←これ追加

    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (task.trim() === "") return;
    setTodos([...todos, { text: task, done: false }]);
    setTask("");
  };

  const toggleTodo = (index) => {
    const newTodos = todos.map((todo, i) =>
      i === index ? { ...todo, done: !todo.done } : todo
    );
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>To-Do</h1>

      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="タスクを入力"
      />

      <button onClick={addTodo}>追加</button>

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            <span
              onClick={() => toggleTodo(index)}
              style={{
                cursor: "pointer",
                textDecoration: todo.done ? "line-through" : "none"
              }}
            >
              {todo.text}
            </span>

            <button onClick={() => deleteTodo(index)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;