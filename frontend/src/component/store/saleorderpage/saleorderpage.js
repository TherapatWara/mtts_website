import React, { useState, useEffect } from "react";
import Navbar from "../../navbar/navbarstore";
import { FaSearch } from "react-icons/fa";
import "./saleorderpage.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Saleorderpage() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [countUnit, setCountUnit] = useState({});
  const [searchvalue, setSearchvalue] = useState("");
  const [rows, setRows] = useState([
    {
      iv: "",
      date: "",
      brand: "",
      model: "",
      description: "",
      unit: "",
      price: "",
    },
  ]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [unitSaleList, setUnitSaleList] = useState({});

  const fetchAllStoreData = async () => {
    try {
      const response = await fetch(`${apiUrl}/stock`);
      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }

      const data = await response.json();
      console.log("📦 ข้อมูลใน stock ทั้งหมด:", data);

      // ถ้าต้องการแสดงใน UI ก็สามารถ setState ได้ เช่น:
      setRows(data);
    } catch (error) {
      console.error("❌ ดึงข้อมูลไม่สำเร็จ:", error);
    }
  };

  // <useeffect ----------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    fetchAllStoreData();
  }, []);

  useEffect(() => {
    const chartData = JSON.parse(localStorage.getItem("yourChart")) || [];

    const counted = {};
    chartData.forEach((item) => {
      const model = item.model;
      counted[model] = (counted[model] || 0) + Number(item.unit || 0);
    });

    setCountUnit(counted);
  }, []);

  useEffect(() => {
    calculateUsedUnits();
  }, []);

  useEffect(() => {
    if (!searchvalue.trim()) {
      setFilteredRows(rows);
      return;
    }
    const searchLower = searchvalue.toLowerCase();
    const filtered = rows.filter(
      (item) =>
        item.brand.toLowerCase().includes(searchLower) ||
        item.model.toLowerCase().includes(searchLower)
    );
    setFilteredRows(filtered);
  }, [searchvalue, rows]);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const calculateUsedUnits = () => {
    const chartData = JSON.parse(localStorage.getItem("yourChart")) || [];

    const counted = {};
    chartData.forEach((item) => {
      const model = item.model;
      counted[model] = (counted[model] || 0) + Number(item.unit || 0);
    });

    setCountUnit(counted);
  };

  const handleAdd = (index) => {
    const unitSale = unitSaleList[index];

    if (isNaN(unitSale) || unitSale <= 0) {
      Swal.fire({
        icon: "error",
        title: "จำนวนสินค้าไม่ถูกต้อง",
        timer: 1500,
        didOpen: () => {
          const title = Swal.getTitle();
          if (title) {
            title.style.fontSize = "26px";
            title.style.fontWeight = "bold";
            title.style.fontFamily = "Poppins, sans-serif";
            title.style.textAlign = "center";
          }
        },
        showConfirmButton: false,
      });
      return;
    }

    const selectedRow = rows[index];

    const existing = JSON.parse(localStorage.getItem("yourChart")) || [];

    // ✅ ตรวจสอบว่า model นี้มีอยู่แล้วหรือยัง
    const existingIndex = existing.findIndex(
      (item) => item.model === selectedRow.model
    );

    if (existingIndex !== -1) {
      // ถ้ามีอยู่แล้ว → บวก unit เข้าไป
      existing[existingIndex].unit =
        Number(existing[existingIndex].unit) + Number(unitSale);
    } else {
      // ถ้ายังไม่มี → เพิ่มใหม่
      const orderItem = {
        iv: selectedRow.iv,
        brand: selectedRow.brand,
        model: selectedRow.model,
        description: selectedRow.description,
        unit: unitSale,
        price: selectedRow.price || 0,
      };
      existing.push(orderItem);
    }

    // ✅ อัปเดต localStorage
    localStorage.setItem("yourChart", JSON.stringify(existing));

    // ✅ อัปเดต countUnit ที่ใช้ลดแสดง unit
    calculateUsedUnits();

    // ✅ เคลียร์ input
    setUnitSaleList({
      ...unitSaleList,
      [index]: 0,
    });

    // ✅ แสดง Swal
    Swal.fire({
      position: "center",
      icon: "success",
      title: "คูณได้เพิ่มสินค้าลงในรถเข็นแล้ว",
      showConfirmButton: false,
      timer: 1500,
      didOpen: () => {
        const title = Swal.getTitle();
        if (title) {
          title.style.fontSize = "26px";
          title.style.fontWeight = "bold";
          title.style.fontFamily = "Poppins, sans-serif";
          title.style.textAlign = "center";
        }
      },
    });
  };

  // const handleAdd = (index) => {
  //   const unitSale = unitSaleList[index];

  //   if (isNaN(unitSale) || unitSale <= 0) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Please enter valid unit",
  //       timer: 1500,
  //       didOpen: () => {
  //         const titleEl = Swal.getTitle();
  //         if (titleEl) {
  //           titleEl.style.fontSize = "18px";
  //           titleEl.style.fontFamily = "sans-serif";
  //         }
  //       },
  //       showConfirmButton: false,
  //     });
  //     return;
  //   }

  //   const selectedRow = rows[index];

  //   const orderItem = {
  //     iv: selectedRow.iv,
  //     brand: selectedRow.brand,
  //     model: selectedRow.model,
  //     description: selectedRow.description,
  //     unit: unitSale,
  //     price: selectedRow.price || 0,
  //   };

  //   const existing = JSON.parse(localStorage.getItem("yourChart")) || [];
  //   const updated = [...existing, orderItem];

  //   localStorage.setItem("yourChart", JSON.stringify(updated));

  //   calculateUsedUnits();

  //   // ✅ Optional: รีเซ็ต input ที่กรอก unit
  //   setUnitSaleList({
  //     ...unitSaleList,
  //     [index]: 0,
  //   });

  //   Swal.fire({
  //     position: "center",
  //     icon: "success",
  //     title: "Your order has been added to chart",
  //     showConfirmButton: false,
  //     timer: 1000,
  //     didOpen: () => {
  //       const titleEl = Swal.getTitle();
  //       if (titleEl) {
  //         titleEl.style.fontSize = "18px";
  //         titleEl.style.fontFamily = "sans-serif";
  //       }
  //     },
  //   });
  // };

  return (
    <div className="body">
      <Navbar />
      <div className="header-saleorder">
        <h1>Sale Order</h1>
        <div className="search-zone-saleorder">
          <input
            type="text"
            value={searchvalue}
            onChange={(e) => setSearchvalue(e.target.value)}
            placeholder=" Search here...(Brand)(Model)"
          ></input>
          <button>
            {" "}
            <FaSearch />{" "}
          </button>
        </div>
        <button
          className=".cart-container"
          onClick={() => navigate("yourchartpage")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="28"
            viewBox="0 0 576 512"
            fill="white"
          >
            <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
          </svg>
        </button>
      </div>

      <div className="body-buyorder">
        <table>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Model</th>
              <th>Description</th>
              <th>Unit/Stock</th>
              <th>Unit/Sale</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => (
              <tr key={index}>
                <td>{row.brand}</td>
                <td>{row.model}</td>
                <td>{row.description}</td>
                <td>{row.unit - (countUnit[row.model] || 0)}</td>
                <td>
                  <input
                    className="unitsale-input"
                    style={{ width: "5vw" }}
                    type="number"
                    min={0}
                    max={row.unit}
                    value={unitSaleList[index] || 0}
                    onChange={(e) => {
                      let val = parseInt(e.target.value);
                      if (val < 0) val = 0;
                      if (val > row.unit) val = row.unit;
                      setUnitSaleList({
                        ...unitSaleList,
                        [index]: val,
                      });
                    }}
                  />
                </td>
                <td>
                  <button
                    className="add-button-saleorder"
                    onClick={() => handleAdd(index)}
                  >
                    ADD
                  </button>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  ไม่พบข้อมูลที่ค้นหา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
