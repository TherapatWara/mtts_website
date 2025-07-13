import React, { useEffect, useState } from "react";
import Navbar from "../../navbar/navbarstore";
import "./billspage.css";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Billsalepage() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [billsales, setBillsales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBills, setFilteredBills] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/billsale`)
      .then((res) => res.json())
      .then((data) => {
        setBillsales(data);
        setFilteredBills(data);
      })
      .catch((err) => console.error("Error fetching billsale:", err));
  }, [apiUrl]);

  const handleDelete = async (billId) => {
    Swal.fire({
      title: "คุณต้องการลบบิลขายใช่หรือไม่?",
      text: "บิลที่ถูกลบแล้วจะไม่สามารถกลับคืนมาได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบ!",
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
          const response = await fetch(`${apiUrl}/billsale/${billId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) throw new Error("Failed to delete billsale");

          setBillsales((prev) => prev.filter((bill) => bill._id !== billId));
          setFilteredBills((prev) =>
            prev.filter((bill) => bill._id !== billId)
          );

          Swal.fire({
            title: "การลบสำเร็จ!",
            text: "ข้อมูลบิลขายของคุณถูกลบแล้ว.",
            icon: "success",
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
          });
        } catch (error) {
          console.error("Error deleting billsale:", error);
          Swal.fire("Error", "ไม่สามารถลบบิลได้", "error");
          
        }
      }
    });
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredBills(billsales);
      return;
    }
    const searchLower = searchTerm.toLowerCase();
    const result = billsales.filter((bill) =>
      bill.projectname.toLowerCase().includes(searchLower)
    );
    setFilteredBills(result);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="body">
      <Navbar />
      <div className="header-saleorder">
        <h1>Bills (Sale)</h1>
        <div className="search-zone-saleorder">
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder=" Search here...(Project Name)"
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>
      </div>

      <div className="body-buyorder">
        <div className="tab">
          <button className="tabbuy" onClick={() => navigate("/billbuypage")}>
            Buy
          </button>
          <button className="tabsale" style={{ backgroundColor: "#df9938" }}>
            Sale
          </button>
        </div>

        <table style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Date</th>
              {/* <th>Brand</th>
              <th>Model</th>
              <th>Description</th>
              <th>Unit</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  ไม่มีบิลการขาย
                </td>
              </tr>
            )}

            {(() => {
              // สร้าง Set เพื่อเก็บ projectname ที่เจอแล้ว
              const seen = new Set();
              // กรองให้เหลือบิลแรกของแต่ละ projectname
              const uniqueBills = filteredBills.filter((bill) => {
                if (seen.has(bill.projectname)) {
                  return false;
                } else {
                  seen.add(bill.projectname);
                  return true;
                }
              });

              // แสดง uniqueBills แค่บิลละ 1 แถว
              return uniqueBills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill.projectname}</td>
                  <td>{new Date(bill.date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="delete-button-store"
                      onClick={() => handleDelete(bill._id)}
                    >
                      X
                    </button>
                    <button
                      className="add-button-saleorder"
                      onClick={() =>
                        navigate(
                          `/billsalepage/viewsalepage?projectname=${encodeURIComponent(
                            bill.projectname
                          )}`
                        )
                      }
                    >
                      VIEW
                    </button>
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
