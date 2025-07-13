import React, { useEffect, useState } from "react";
import Navbar from "../../navbar/navbarstore";
import "./saleorderpage.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Yourchartpage() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
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
  const [showPopup, setShowPopup] = useState(false);
  const [projectName, setProjectName] = useState("");

  const handleClearRows = () => {
    localStorage.removeItem("yourChart"); // ลบข้อมูลใน localStorage
    setRows([]); // ล้าง state ที่แสดงในตาราง
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    localStorage.setItem("yourChart", JSON.stringify(updatedRows));
    setRows(updatedRows);
  };

  const handleConfirm = async () => {
    Swal.fire({
      title: "คุณต้องการจะสร้างบิลขายใช่หรือไม่?",
      text: "โปรดตรวจสอบสินค้าในตะกร้าให้ถูกต้อง",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
      didOpen: () => {
        const content = Swal.getHtmlContainer();
        if (content) {
          content.style.fontSize = "24px";
          content.style.fontFamily = "Poppins, sans-serif";
        }
        const title = Swal.getTitle();
        if (title) {
          title.style.fontSize = "26px";
          title.style.fontWeight = "bold";
          title.style.fontFamily = "Poppins, sans-serif";
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const yourCartItems =
            JSON.parse(localStorage.getItem("yourChart")) || [];

          if (!projectName.trim()) {
            Swal.fire({
              title: "กรุณากรอกชื่อโปรเจค",
              icon: "warning",
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

            return;
          }

          for (const item of yourCartItems) {
            const response = await fetch(
              `${apiUrl}/stock?brand=${encodeURIComponent(
                item.brand
              )}&model=${encodeURIComponent(item.model)}`
            );
            if (!response.ok) throw new Error("Failed to fetch stock");

            const stocks = await response.json();
            if (stocks.length === 0) {
              Swal.fire(
                "Error",
                `ไม่พบสินค้าใน stock: ${item.brand} ${item.model}`,
                "error"
              );
              return;
            }

            const stock = stocks[0];
            const newUnit = stock.unit - Number(item.unit);

            if (newUnit < 0) {
              Swal.fire("Error", `จำนวน stock ไม่พอ: ${item.model}`, "error");
              return;
            }

            const updateResponse = await fetch(`${apiUrl}/stock/${stock._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ unit: newUnit }),
            });

            if (!updateResponse.ok) throw new Error("Failed to update stock");
          }

          // บันทึก billsale พร้อม projectname
          const saveBill = await fetch(`${apiUrl}/billsale`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              projectname: projectName,
              items: yourCartItems,
            }),
          });

          if (!saveBill.ok) throw new Error("Failed to save bill");

          Swal.fire({
            position: "center",
            icon: "success",
            title: "คุณได้ทำการขายสำเร็จ",
            showConfirmButton: false,
            didOpen: () => {
              const title = Swal.getTitle();
              if (title) {
                title.style.fontSize = "26px";
                title.style.fontWeight = "bold";
                title.style.fontFamily = "Poppins, sans-serif";
                title.style.textAlign = "center";
              }
            },
            timer: 1500,
          });

          localStorage.removeItem("yourChart");
          setRows([]);
          navigate(-1);
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "ไม่สามารถยืนยันการขายได้", "error");
        }
      }
    });
  };

  useEffect(() => {
    const chartData = JSON.parse(localStorage.getItem("yourChart")) || [];
    setRows(chartData);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="header-saleorder" style={{ gap: "10px" }}>
        <h1>Your Chart</h1>
        <button className=".cart-container">
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
              <th>Unit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{row.brand}</td>
                <td>{row.model}</td>
                <td>{row.description}</td>
                <td>
                  <input
                    className="unitsale-input"
                    type="number"
                    min={0}
                    defaultValue={row.unit}
                    disabled={true}
                  ></input>
                </td>
                <td>
                  <button
                    className="delete-button-saleorder"
                    onClick={() => handleDeleteRow(index)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className="projectname"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "15px",
        }}
      >
        <h6
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            fontFamily: "sans-serif",
            color: "rgb(100, 100, 100)",
          }}
        >
          Project Name :{" "}
        </h6>{" "}
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          style={{
            padding: "2px 6px",
            borderRadius: "5px",
            border: "1px solid gray",
            marginLeft: "10px",
          }}
        />
      </div>
      <div className="bottom-yourchart">
        <button
          className="back-yourchart"
          onClick={() => navigate("/saleorderpage")}
        >
          BACK
        </button>
        <div className="right-buttons">
          <button className="clear-buyorder" onClick={handleClearRows}>
            CLEAR
          </button>
          <button className="confirm-buyorder" onClick={handleConfirm}>
            CONFIRM
          </button>
        </div>
      </div>

      {/*Confirm Popup--------------------------------------------------------------------------------------------*/}
      {showPopup && (
        <div className="add-popup">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height={100}
            fill="lime"
            viewBox="0 0 512 512"
          >
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
          </svg>
          <h3>Your order has been successfully sold</h3>
        </div>
      )}
    </div>
  );
}
