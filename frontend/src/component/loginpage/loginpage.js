import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";
import Navbar from "../navbar/navbarindex";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

export default function Loginpage() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlelogin = async () => {
    if ((user === "admin") & (password === "@Passw0rdmtts")) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("loggedUser", "admin");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "ยินดีต้อนรับเข้าสู่ระบบ",
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
      navigate("/selectionpage");
    } else if ((user === "mtts") & (password === "@Passw0rd")) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("loggedUser", "user123");
      navigate("/selectionpage");
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "รหัสผ่านไม่ถูกต้อง",
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
      //alert("Invalid username or password!!");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handlelogin();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="login-body">
        <div className="login-fill">
          <h1>Sign in</h1>

          <div className="input-zone">
            <TextField
              label="Username"
              variant="outlined"
              id="username"
              size="small"
              sx={{
                width: "90%",
                textAlign: "center",
                margin: "0 auto",
                marginBottom: "20px",
              }}
              value={user}
              autoComplete="on"
              onChange={(e) => setUser(e.target.value)}
              InputProps={{
                sx: {
                  fontSize: "18px", // 👈 font ของตัว input
                  height: "6vh", // 👈 ปรับสูงของ input box
                },
              }}
              InputLabelProps={{
                sx: {
                  fontSize: "18px", // 👈 font ของ label (เช่น "Username")
                },
              }}
            />
            <TextField
              label="Password"
              variant="outlined"
              size="small"
              sx={{ width: "90%", textAlign: "center", margin: "0 auto" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                sx: {
                  fontSize: "18px", // 👈 font ของตัว input
                  height: "6vh", // 👈 ปรับสูงของ input box
                },
              }}
              InputLabelProps={{
                sx: {
                  fontSize: "18px", // 👈 font ของ label (เช่น "Username")
                },
              }}
            />
          </div>
          <Button variant="text" onClick={handlelogin}>
            Sign in
          </Button>
          {/* <button onClick={handlelogin}></button> */}
        </div>
      </div>
    </div>
  );
}
