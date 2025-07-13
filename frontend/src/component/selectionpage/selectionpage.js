import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./selectionpage.css";
import Navbar from "../navbar/navbarindex";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";

export default function Selectionpage() {
  const navigate = useNavigate();
  const loginUser = localStorage.getItem("loggedUser");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      navigate("/");
    }
  }, []);

  const Logout = () => {
    Swal.fire({
      title: "คุณต้องการ ออกจากระบบ ใช่หรือไม่?",
      text: "เมื่อออกระบบแล้ว username และpassword จะไม่ถูกจำ!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ออกจากระบบ!",
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
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "ออกจากระบบ!",
          text: "คุณได้ออกจากระบบแล้ว",
          icon: "success",
        });
        localStorage.removeItem("loggedIn");
        navigate("/");
        localStorage.removeItem("loggedUser");
        navigate("/");
      }
    });
  };

  return (
    <div className="body">
      <Navbar />
      <div className="selection-fill">
        <h1>SELECT</h1>
        {loginUser === "admin" && (
          <div className="selection" onClick={() => navigate("/mainpage")}>
            <h2>Product Price</h2>
          </div>
        )}

        <div className="selection" onClick={() => navigate("/maintenancepage")}>
          <h2>Maintenance List</h2>
        </div>

        <div className="selection" onClick={() => navigate("/buyorderpage")}>
          <h2>Store Manage</h2>
        </div>

        <div className="selection-logout">
        <Button variant="contained" onClick={() => Logout()} >
          Logout
        </Button>
        {/* <h2>Logout</h2> */}
        </div>
      </div>
    </div>
  );
}
