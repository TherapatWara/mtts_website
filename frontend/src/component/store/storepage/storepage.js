import React, { useState, useEffect } from "react";
import Navbar from "../../navbar/navbarstore";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function Storepage() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      navigate("/");
    }
  }, []);

  const apiUrl = process.env.REACT_APP_API_URL;

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");

  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // const [productOptions, setProductOptions] = useState([]);
  const [brandpricelistOptions, setBrandpricelistOptions] = useState([]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      return;
    }
    const searchLower = searchTerm.toLowerCase();
    const result = products.filter(
      (stock) =>
        stock.brand.toLowerCase().includes(searchLower) ||
        stock.model.toLowerCase().includes(searchLower)
    );
    setFilteredProducts(result);
  };

  const handleSearchUpdate = (data = products) => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      return;
    }
    const searchLower = searchTerm.toLowerCase();
    const result = data.filter(
      (stock) =>
        stock.brand.toLowerCase().includes(searchLower) ||
        stock.model.toLowerCase().includes(searchLower)
    );
    setFilteredProducts(result);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const fetchAllStoreData = async () => {
    try {
      const response = await fetch(`${apiUrl}/stock`);
      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }

      const data = await response.json();
      console.log("📦 ข้อมูลใน stock ทั้งหมด:", data);

      // ถ้าต้องการแสดงใน UI ก็สามารถ setState ได้ เช่น:
      setProducts(data);
    } catch (error) {
      console.error("❌ ดึงข้อมูลไม่สำเร็จ:", error);
    }
  };

  // <useeffect ----------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    fetchAllStoreData();
  }, []);

  // useEffect(() => {
  //   fetch(`${apiUrl}/stock`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setProducts(data);
  //       console.log(data);
  //       console.log(products);
  //     })
  //     .catch((err) => console.error("Error fetching stock:", err));
  // }, [apiUrl]);

  // useEffect(() => {
  //   fetch(`${apiUrl}/product-options`)
  //     .then((res) => res.json())
  //     .then((data) => setProductOptions(data))
  //     .catch((err) => console.error("Error fetching product options:", err));
  // }, [apiUrl]);

  useEffect(() => {
    fetch(`${apiUrl}/brand-options-pricelist`)
      .then((res) => res.json())
      .then((data) => setBrandpricelistOptions(data))
      .catch((err) => console.error("Error fetching product options:", err));
  }, [apiUrl]);

  // useeffect/>----------------------------------------------------------------------------------------------------------------------

  const formatPrice = (value) => {
    if (!value) return "";
    const num = value.replace(/,/g, "");
    return Number(num).toLocaleString();
  };

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(raw)) return; // ตรวจให้เป็นตัวเลขเท่านั้น
    setUnit(raw);
  };

  const handleAdd = async () => {
    try {
      // 1. ตรวจสอบว่ามีข้อมูลสินค้าในฐานข้อมูลที่มีค่าเหมือนกับข้อมูลที่จะเพิ่มหรือไม่
      const response = await fetch(`${apiUrl}/stock`);
      const existingProducts = await response.json();

      const isProductExists = existingProducts.some(
        (product) => product.model === model
      );

      if (isProductExists) {
        alert("มีข้อมูล " + model + " ในระบบแล้ว⚠️");
        console.log("Stock already exists in the database!");
        return; // ถ้ามีข้อมูลซ้ำไม่ทำการเพิ่ม
      }

      // 2. ถ้าไม่มีข้อมูลซ้ำ จึงทำการเพิ่มสินค้าใหม่
      const addResponse = await fetch(`${apiUrl}/stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand: brand,
          model: model,
          description: description,
          unit: parseFloat(unit),
        }),
      });

      if (!addResponse.ok) {
        throw new Error("Failed to add stock");
      }

      alert("คุณได้เพิ่ม " + model + " เรียบร้อย ✅");
      console.log("Stock added successfully!");

      // 3. รีเฟรชข้อมูลจากฐานข้อมูลใหม่
      const updatedProducts = await fetch(`${apiUrl}/stock`)
        .then((res) => res.json())
        .catch((err) => console.error("Error fetching stock:", err));
      setProducts(updatedProducts); // อัปเดต state ของ products

      // recent update
      // const updateProductOption = await fetch(`${apiUrl}/product-options`)
      //   .then((res) => res.json())
      //   .catch((err) => console.error("Error fetching product options:", err));
      // setProductOptions(updateProductOption);

      const updateBrandOptionPricelist = await fetch(
        `${apiUrl}/brand-options-pricelist`
      )
        .then((res) => res.json())
        .catch((err) => console.error("Error fetching product options:", err));
      setBrandpricelistOptions(updateBrandOptionPricelist);

      // 4. ล้างฟอร์ม
      setBrand("");
      setModel("");
      setDescription("");
      setUnit("");
    } catch (error) {
      alert("ผิดพลาดในการเพิ่มข้อมูล " + model + " ❌");
      console.error("Error:", error);
      console.log("Error adding product");
    }
  };

  const handleDelete = async (stockId) => {
    try {
      const response = await fetch(`${apiUrl}/stock/${stockId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete stock");
      }

      console.log("Stock deleted successfully!");
      setProducts(products.filter((product) => product._id !== stockId)); // Remove deleted product from state
    } catch (error) {
      console.error("Error:", error);
      console.log("Error deleting stock");
    }
  };

  // const handleEdit = (product) => {
  //   console.log("Editing product:", product);
  //   setValue1(product.product || "");
  //   setValue2(product.brand || "");
  //   setValue3(product.model || "");
  //   setValue4(product.description || "");
  //   setValue5(
  //     product.price !== undefined && product.price !== null
  //       ? product.price.toString()
  //       : ""
  //   );
  //   setEditProductId(product._id);
  // };

  // const handleUpdate = async () => {
  //   try {
  //     const response = await fetch(`${apiUrl}/products/${editProductId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         product: value1,
  //         brand: value2,
  //         model: value3,
  //         description: value4,
  //         price: parseFloat(value5),
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to update product");
  //     }
  //     alert("แก้ไข " + value3 + " เรียบร้อย✅");
  //     console.log("Product updated successfully!");

  //     // โหลดข้อมูลใหม่
  //     const updatedProducts = await fetch(`${apiUrl}/products`).then((res) =>
  //       res.json()
  //     );

  //     setFilteredProducts([]);
  //     if (searchTerm.trim() !== "") {
  //       handleSearchUpdate(updatedProducts);
  //     }

  //     setProducts(updatedProducts);

  //     // เคลียร์ฟอร์ม
  //     setValue1("");
  //     setValue2("");
  //     setValue3("");
  //     setValue4("");
  //     setValue5("");
  //     setEditProductId(null);
  //   } catch (error) {
  //     alert("ผิดพลาดในการแก้ไข❌");
  //     console.error("Error updating product:", error);
  //   }
  // };

  return (
    <div className="body">
      <Navbar />
      <div className="admin-search-fill">
        <h1>Add Product Store</h1>
        <div className="input-container">
          <div className="input-group">
            <h2>Brand</h2>
            {/*<input type="text" style={{width:'15vh'}} value={value2} onChange={(e) => setValue2(e.target.value)} />*/}
            <input
              type="text"
              list="brand-options-pricelist"
              style={{ width: "15vh" }}
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              onClick={(e) => e.target.showPicker && e.target.showPicker()} // สำหรับบาง browser ให้เปิด dropdown เมื่อคลิก
            />
            <datalist id="brand-options-pricelist">
              {brandpricelistOptions.map((option, index) => (
                <option key={index} value={option} />
              ))}
            </datalist>
          </div>
          <div className="input-group">
            <h2>Model</h2>
            <input
              type="text"
              style={{ width: "25vh" }}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div className="input-group">
            <h2>Description</h2>
            <input
              type="text"
              style={{ width: "70vh" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="input-group">
            <h2>Unit</h2>
            <input
              type="text"
              style={{ width: "15vh" }}
              value={formatPrice(unit)}
              onChange={handlePriceChange}
            />
          </div>
          <div className="input-group">
            {/* {editProductId ? (
              <button onClick={handleUpdate}>UPDATE</button>
            ) : (
              <button onClick={handleAdd}>ADD</button>
            )} */}
            <button onClick={handleAdd}>ADD</button>
          </div>
        </div>
      </div>
      <div className="admin-displayzone">
        <div className="admin-container">
          <input
            name="customer"
            autoComplete="on"
            placeholder=" search...(brand)(model)"
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          ></input>
          <button className="search-button" onClick={handleSearch}>
            {" "}
            <FaSearch />{" "}
          </button>
          <h1>All Store List</h1>
        </div>

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
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.brand}</td>
                <td>{product.model}</td>
                <td>{product.description}</td>
                <td>{product.unit}</td>
                <td>
                  <button
                    className="delete_button"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="edit_button"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      //handleEdit(product);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {products
              .filter(
                (product) =>
                  !filteredProducts.some((fp) => fp._id === product._id)
              )
              .map((product) => (
                <tr key={product._id}>
                  <td>{product.brand}</td>
                  <td>{product.model}</td>
                  <td>{product.description}</td>
                  <td>{product.unit}</td>
                  <td>
                    <button
                      className="delete_button"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="edit_button"
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        // handleEdit(product);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
