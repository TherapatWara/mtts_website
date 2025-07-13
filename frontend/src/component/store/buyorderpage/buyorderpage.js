import React, { useEffect, useState } from "react";
import Navbar from "../../navbar/navbarstore";
import Swal from "sweetalert2";
import "./buyorderpage.css";

//testpush
export default function Buyorderpage() {
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
  const [stockList, setStockList] = useState([]);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    // ✨ ถ้าเปลี่ยน model → ลองค้นหาใน stock แล้วเติม description อัตโนมัติ
    if (field === "model") {
      const matchedStock = stockList.find(
        (item) => item.model.toLowerCase() === value.toLowerCase()
      );
      if (matchedStock) {
        updatedRows[index].description = matchedStock.description || "";
        updatedRows[index].brand = matchedStock.brand || "";
      }
    }

    setRows(updatedRows);
  };

  const handleDateChange = (index, value) => {
    let v = value.replace(/\D/g, "");
    if (v.length > 6) v = v.slice(0, 6);
    if (v.length >= 5)
      v = v.slice(0, 2) + "/" + v.slice(2, 4) + "/" + v.slice(4);
    else if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
    handleChange(index, "date", v);
  };

  const formatNumber = (value) => {
    if (!value) return "";
    const num = value.replace(/,/g, "");
    return Number(num).toLocaleString();
  };

  const handleAddRow = () => {
    const fristRow = rows[0] || { iv: "", date: "" };
    setRows([
      ...rows,
      {
        iv: fristRow.iv,
        date: fristRow.date,
        brand: "",
        model: "",
        description: "",
        unit: "",
        price: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };
  const handleConfirm = () => {
    let inputcheck = 0;
    for (let i = 0; i < rows.length; i++) {
      if (
        rows[i].iv !== "" &&
        rows[i].date !== "" &&
        rows[i].brand !== "" &&
        rows[i].model !== "" &&
        rows[i].description !== "" &&
        rows[i].unit !== "" &&
        rows[i].price !== ""
      ) {
        inputcheck = 1;
      } else {
        inputcheck = 0;
        break; // ถ้าแถวไหนไม่ครบ ให้หยุดเช็คเลย
      }
    }

    if (inputcheck !== 1) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        confirmButtonText: "ตกลง",
        didOpen: () => {
          const title = Swal.getTitle();
          if (title) {
            title.style.fontSize = "22px";
            title.style.fontFamily = "Poppins, sans-serif";
            title.style.textAlign = "center";
          }
        },
      });
      return;
    }

    // ถ้าข้อมูลครบ
    Swal.fire({
      title: "คุณต้องการจะสร้างบิลซื้อใช่หรือไม่?",
      html: "โปรดตรวจสอบข้อมูลให้ถูกต้องก่อนกดยืนยัน",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ยืนยัน",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      didOpen: () => {
        const content = Swal.getHtmlContainer();
        if (content) {
          content.style.fontSize = "20px";
          content.style.fontFamily = "Poppins, sans-serif";
          content.style.textAlign = "center";
        }
        const title = Swal.getTitle();
        if (title) {
          title.style.fontSize = "26px";
          title.style.fontWeight = "bold";
          title.style.fontFamily = "Poppins, sans-serif";
          title.style.textAlign = "center";
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await handleAdd(); // เรียกฟังก์ชันเพิ่มข้อมูลจริง

          Swal.fire({
            position: "center",
            icon: "success",
            title: "คุณได้ทำใบสั่งซื้อสำเร็จแล้ว",
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
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาดในการบันทึก",
            text: "กรุณาลองใหม่อีกครั้ง",
            confirmButtonText: "ตกลง",
            didOpen: () => {
              const title = Swal.getTitle();
              if (title) {
                title.style.fontSize = "22px";
                title.style.fontFamily = "Poppins, sans-serif";
                title.style.textAlign = "center";
              }
            },
          });
        }
      }
    });
  };

  // const handleConfirm = () => {
  //   let inputcheck = 0;
  //   for (let i = 0; i < rows.length; i++) {
  //     if (
  //       rows[i].iv !== "" &&
  //       rows[i].date !== "" &&
  //       rows[i].brand !== "" &&
  //       rows[i].model !== "" &&
  //       rows[i].description !== "" &&
  //       rows[i].unit !== "" &&
  //       rows[i].price !== ""
  //     ) {
  //       inputcheck = 1;
  //     } else {
  //       inputcheck = 0;
  //     }
  //   }
  //   if (inputcheck === 1) {
  //     handleAdd();
  //     Swal.fire({
  //       position: "center",
  //       icon: "success",
  //       title: "คูณได้ทำใบสั่งซื้อสำเร็จแล้ว",
  //       showConfirmButton: false,
  //       timer: 1500,
  //       didOpen: () => {
  //         const title = Swal.getTitle();
  //         if (title) {
  //           title.style.fontSize = "26px";
  //           title.style.fontWeight = "bold";
  //           title.style.fontFamily = "Poppins, sans-serif";
  //           title.style.textAlign = "center";
  //         }
  //       },
  //     });

  //   }
  // };

  const handleClearRows = () => {
    setRows([
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
  };

  const fetchAllStoreData = async () => {
    try {
      const response = await fetch(`${apiUrl}/store`);
      if (!response.ok) {
        throw new Error("Failed to fetch store data");
      }

      const data = await response.json();
      console.log("📦 ข้อมูลใน store ทั้งหมด:", data);

      // ถ้าต้องการแสดงใน UI ก็สามารถ setState ได้ เช่น:
      // setStoreData(data);
    } catch (error) {
      console.error("❌ ดึงข้อมูลไม่สำเร็จ:", error);
    }
  };

  //useeffect ------------------------------------------------------------------
  useEffect(() => {
    fetchAllStoreData();
  }, []);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch(`${apiUrl}/stock`);
        const data = await res.json();
        setStockList(data);
      } catch (err) {
        console.error("Error fetching stock data:", err);
      }
    };
    fetchStock();
  }, [apiUrl]);
  //useeffect ------------------------------------------------------------------

  const checkAndUpdateStock = async (brand, model, description, addedUnit) => {
    try {
      const matchedStock = stockList.find(
        (item) => item.model.toLowerCase() === model.toLowerCase()
      );

      if (matchedStock) {
        // ✅ ถ้ามี → บวก unit
        const newUnit = matchedStock.unit + Number(addedUnit);

        const response = await fetch(`${apiUrl}/stock/${matchedStock._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brand,
            model,
            description,
            unit: newUnit,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update stock");
        }

        console.log("🔁 Updated stock unit to:", newUnit);

        // อัปเดต state
        const updatedItem = await response.json();
        setStockList((prev) =>
          prev.map((item) =>
            item._id === updatedItem._id ? updatedItem : item
          )
        );
      } else {
        // ❌ ถ้าไม่มี → สร้างใหม่
        const response = await fetch(`${apiUrl}/stock`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brand,
            model,
            description,
            unit: Number(addedUnit),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create new stock");
        }

        const newStock = await response.json();
        setStockList((prev) => [...prev, newStock]);

        console.log("✅ Created new stock:", newStock);
      }
    } catch (err) {
      console.error("❌ Stock update error:", err);
    }
  };

  const handleAdd = async () => {
    try {
      // 1. ตรวจสอบว่ามีข้อมูลสินค้าในฐานข้อมูลที่มีค่าเหมือนกับข้อมูลที่จะเพิ่มหรือไม่
      const response = await fetch(`${apiUrl}/store`);
      const existingProducts = await response.json();

      const isProductExists = existingProducts.some(
        (store) => store.iv === rows[0].iv
      );

      if (isProductExists) {
        alert("มีข้อมูล iv: " + rows[0].iv + " ในระบบแล้ว⚠️");
        console.log("Buyorder already exists in the database!");
        return; // ถ้ามีข้อมูลซ้ำไม่ทำการเพิ่ม
      }

      // 2. ถ้าไม่มีข้อมูลซ้ำ จึงทำการเพิ่มสินค้าใหม่
      for (const row of rows) {
        await checkAndUpdateStock(
          row.brand,
          row.model,
          row.description,
          row.unit
        );

        const response = await fetch(`${apiUrl}/store`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            iv: row.iv,
            date: row.date,
            brand: row.brand,
            model: row.model,
            description: row.description,
            unit: row.unit,
            price: parseFloat(row.price),
          }),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to add buyorder");
      }

      console.log("Product added successfully!");

      // 4. ล้างฟอร์ม
      handleClearRows();
    } catch (error) {
      alert("ผิดพลาดในการเพิ่มข้อมูล " + rows[0].iv + " ❌");
      console.error("Error:", error);
      console.log("Error adding product");
    }
  };

  return (
    <div className="body">
      <Navbar />
      <div className="header-buyorder">
        <h1>Buy Order</h1>
      </div>
      <div className="body-buyorder">
        <table>
          <thead>
            <tr>
              <th>Invoice no.</th>
              <th>Date</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Description</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={row.iv}
                    onChange={(e) => handleChange(index, "iv", e.target.value)}
                    style={{ width: "8vw" }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    placeholder="dd/mm/yy"
                    style={{ width: "7vw" }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.brand}
                    onChange={(e) =>
                      handleChange(index, "brand", e.target.value)
                    }
                    style={{ width: "12vw" }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.model}
                    onChange={(e) =>
                      handleChange(index, "model", e.target.value)
                    }
                    style={{ width: "12vw" }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.description}
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value)
                    }
                    style={{ width: "18vw" }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatNumber(row.unit)}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "unit",
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    style={{ width: "5vw" }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatNumber(row.price)}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "price",
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    style={{ width: "7vw" }}
                  />
                </td>
                <td>
                  <button
                    className="delete_button-buyorder"
                    onClick={() => handleDeleteRow(index)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="moretable-buyorder" onClick={handleAddRow}>
          +
        </button>
      </div>
      <div className="bottom-buyorder">
        <button className="clear-buyorder" onClick={handleClearRows}>
          CLEAR
        </button>
        <button className="confirm-buyorder" onClick={handleConfirm}>
          CONFIRM
        </button>
      </div>
    </div>
  );
}
