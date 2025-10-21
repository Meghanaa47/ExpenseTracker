import React, { useState, useEffect, useRef } from "react";
import "../styles/Explore.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Explore() {
  const categories = ["Food", "Travel", "Entertainment", "Shopping", "Others"];
  const months = ["Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const pieColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({income:0, expense:0, balance:0});
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  const [formData, setFormData] = useState({
    type: "income",
    description: "",
    amount: "",
    category: "",
    month: "",
  });

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Refs for scrolling
  const overviewRef = useRef(null);
  const formRef = useRef(null);
  const listRef = useRef(null);
  const chartsRef = useRef(null);

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(saved);
  }, []);

  // Update localStorage, summary, charts
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));

    let totalIncome = 0,
      totalExpense = 0;
    transactions.forEach((t) => {
      if (t.type === "income") totalIncome += t.amount;
      else totalExpense += t.amount;
    });
    setSummary({ income: totalIncome, expense: totalExpense, balance: totalIncome - totalExpense });

    const pieValues = categories.map((cat) =>
      transactions.filter((t) => t.type === "expense" && t.category === cat).reduce((sum, t) => sum + t.amount, 0)
    );
    setPieData(categories.map((cat, idx) => ({ name: cat, value: pieValues[idx] })));

    const barChartData = months.map((m) => {
      const incomeMonth = transactions
        .filter((t) => t.type === "income" && t.month === m)
        .reduce((sum, t) => sum + t.amount, 0);
      const expenseMonth = transactions
        .filter((t) => t.type === "expense" && t.month === m)
        .reduce((sum, t) => sum + t.amount, 0);
      return { month: m, income: incomeMonth, expense: expenseMonth };
    });
    setBarData(barChartData);
  }, [transactions]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.month || (formData.type === "expense" && !formData.category)) {
      alert("Please fill all required fields");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
    };
    setTransactions([newTransaction, ...transactions]);
    setFormData({ type: "income", description: "", amount: "", category: "", month: "" });
  };

  const handleDelete = (id) => setTransactions(transactions.filter((t) => t.id !== id));

  const displayedTransactions = transactions.filter(
    (t) =>
      (filterCategory ? t.category === filterCategory : true) &&
      (search ? t.description.toLowerCase().includes(search.toLowerCase()) : true)
  );

  // Scroll function
  const scrollToRef = (ref) => window.scrollTo({ top: ref.current.offsetTop - 70, behavior: "smooth" });

  return (
    <div className="exploreContainer">
      {/* Navbar */}
      <nav className="navBar">
        <div className="logo">💰 FinTrack</div>
        <div className="navLinks">
          <span onClick={() => scrollToRef(overviewRef)}>Overview</span>
          <span onClick={() => scrollToRef(formRef)}>Add Transaction</span>
          <span onClick={() => scrollToRef(listRef)}>Transaction List</span>
          <span onClick={() => scrollToRef(chartsRef)}>Charts</span>
        </div>
      </nav>

      {/* Financial Overview */}
      <section ref={overviewRef} className="section overviewSection">
        <h1 className="mainHeading">Financial Overview</h1>
        <div className="summaryCards">
          <div className="summaryCard incomeCard">
            <h3>Total Income</h3>
            <p className="value">₹{summary.income}</p>
          </div>
          <div className="summaryCard expenseCard">
            <h3>Total Expense</h3>
            <p className="value">₹{summary.expense}</p>
          </div>
          <div className="summaryCard balanceCard">
            <h3>Net Balance</h3>
            <p className="value">₹{summary.balance}</p>
          </div>
        </div>
      </section>

      {/* Add Transaction Form */}
      <section ref={formRef} className="section formSection">
        <h2>Add Transaction</h2>
        <form className="transactionForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="formGroup">
            <label>Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Enter description" />
          </div>
          <div className="formGroup">
            <label>Amount (₹)</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Enter amount" />
          </div>
          <div className="formGroup">
            <label>Month</label>
            <select name="month" value={formData.month} onChange={handleChange}>
              <option value="">--Select Month--</option>
              {months.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          {formData.type === "expense" && (
            <div className="formGroup">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">--Select--</option>
                {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
              </select>
            </div>
          )}
          <button type="submit" className="submitButton">Add Transaction</button>
        </form>
      </section>

      {/* Transaction List */}
      <section ref={listRef} className="section listSection">
        <h2>Transaction List</h2>
        <div className="filterSection">
          <input type="text" placeholder="Search description..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
          </select>
        </div>
        {displayedTransactions.length === 0 ? (
          <p className="noTransactions">No transactions found</p>
        ) : (
          <table className="transactionTable">
            <thead>
              <tr>
                <th>Description</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount (₹)</th>
                <th>Month</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.description}</td>
                  <td>{t.type}</td>
                  <td>{t.type === "expense" ? t.category : "-"}</td>
                  <td>{t.amount}</td>
                  <td>{t.month}</td>
                  <td><button className="deleteButton" onClick={() => handleDelete(t.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Charts */}
      <section ref={chartsRef} className="section chartsSection">
        <h2>Charts</h2>
        <div className="chartsWrapper">
          <div className="chartBox pieChartBox">
            <h3>Expense by Category</h3>
            <PieChart width={300} height={300}>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={pieColors[index]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
            <div className="pieLegend">
              {categories.map((cat, idx) => (
                <div className="legendItem" key={idx}>
                  <span className="colorBox" style={{ backgroundColor: pieColors[idx] }}></span>
                  <span>{cat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chartBox barChartBox">
            <h3>Monthly Income vs Expense</h3>
            <BarChart width={500} height={300} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#5720f0ff" />
              <Bar dataKey="expense" fill="#227edaee" />
            </BarChart>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 FinTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}
