import React, { useState, useEffect } from "react";
import "./styles.css";

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const addTransaction = (e) => {
    e.preventDefault();
    if (!text || !amount) return;
    const value = type === "income" ? parseFloat(amount) : -Math.abs(parseFloat(amount));
    setTransactions([
      ...transactions,
      { id: Date.now(), text, amount: value }
    ]);
    setText("");
    setAmount("");
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="container">
      <h2>Expense Tracker</h2>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle {theme === "light" ? "Dark" : "Light"} Mode
      </button>

      <div className="balance">
        <h3>Balance: ₹{income + expense}</h3>
        <p>Income: ₹{income}</p>
        <p>Expense: ₹{Math.abs(expense)}</p>
      </div>

      <form onSubmit={addTransaction}>
        <input
          type="text"
          value={text}
          placeholder="Enter description"
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="number"
          value={amount}
          placeholder="Enter amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit">Add Transaction</button>
      </form>

      <ul>
        {transactions.map((tx) => (
          <li key={tx.id} className={tx.amount > 0 ? "plus" : "minus"}>
            {tx.text} <span>₹{tx.amount}</span>
            <button onClick={() => deleteTransaction(tx.id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;