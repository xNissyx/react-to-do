import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// 👇 Supabase接続
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  // 🔥 初回：DBから取得
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.log(error);
    } else {
      setTodos(data);
    }
  };

  // 🔥 追加（INSERT）
  const addTodo = async () => {
    if (task.trim() === "") return;

    const { error } = await supabase
      .from("todos")
      .insert([{ title: task, done: false }]);

    if (error) {
      console.log(error);
    } else {
      setTask("");
      fetchTodos(); // 再取得
    }
  };

  // 🔥 更新（done切り替え）
  const toggleTodo = async (todo) => {
    const { error } = await supabase
      .from("todos")
      .update({ done: !todo.done })
      .eq("id", todo.id);

    if (error) {
      console.log(error);
    } else {
      fetchTodos();
    }
  };

  // 🔥 削除（DELETE）
  const deleteTodo = async (id) => {
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
    } else {
      fetchTodos();
    }
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
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              onClick={() => toggleTodo(todo)}
              style={{
                cursor: "pointer",
                textDecoration: todo.done ? "line-through" : "none"
              }}
            >
              {todo.title}
            </span>

            <button onClick={() => deleteTodo(todo.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;