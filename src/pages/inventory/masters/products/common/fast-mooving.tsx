

import type React from "react"
import { useState } from "react"

interface ButtonData {
  id: number
  text: string
  productShortName: string
}

interface FormData {
  branchId: string
  keypadGroup: string
  displayOrder: string
  autoBarcode: boolean
  productShortName: string
  barcode: string
  name: string
  foreignLanguage: string
  price: string
}

const POSFastMovingItems: React.FC = () => {
  // State for the 12 buttons on the left
  const [buttons, setButtons] = useState<ButtonData[]>(
    Array(12)
      .fill(null)
      .map((_, index) => ({
        id: index + 1,
        text: index === 0 ? "TEST" : index === 5 ? "GILLETTE FOAM SENSITIVE" : "",
        productShortName: "",
      })),
  )

  // State for the form on the right
  const [formData, setFormData] = useState<FormData>({
    branchId: "",
    keypadGroup: "1",
    displayOrder: "",
    autoBarcode: false,
    productShortName: "",
    barcode: "",
    name: "",
    foreignLanguage: "",
    price: "",
  })

  // Currently selected button
  const [selectedButton, setSelectedButton] = useState<number | null>(3)

  // Handle button click
  const handleButtonClick = (buttonId: number) => {
    setSelectedButton(buttonId)

    // Find the button data
    const button = buttons.find((b) => b.id === buttonId)
    if (button) {
      // Update form with button data
      setFormData({
        ...formData,
        productShortName: button.productShortName,
      })
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  // Handle Show button click
  const handleShow = () => {
    // Implement show functionality
    console.log("Show button clicked", formData)
  }

  // Handle Reset button click
  const handleReset = () => {
    setFormData({
      ...formData,
      barcode: "",
      name: "",
      foreignLanguage: "",
      price: "",
      productShortName: "",
    })
  }

  // Handle Set button click
  const handleSet = () => {
    if (selectedButton !== null) {
      // Update the selected button with form data
      const updatedButtons = buttons.map((button) => {
        if (button.id === selectedButton) {
          return {
            ...button,
            text: formData.name,
            productShortName: formData.productShortName,
          }
        }
        return button
      })

      setButtons(updatedButtons)

      // Prepare data for API call
      const apiData = {
        "@BranchID": formData.branchId,
        "@KeypadGroup": formData.keypadGroup,
        "@DisplayOrder": formData.displayOrder,
        "@AutoBarcode": formData.autoBarcode,
        "@ProductShortName": formData.productShortName,
      }

      console.log("Data to send:", apiData)
    }
  }

  return (
    <div
      className="pos-container"
      style={{
        width: "740px",
        padding: "0",
        fontFamily: "Segoe UI, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0",
        borderRadius: "6px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #e0e0e0",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: 600,
            color: "#333",
          }}
        >
          POS - Fast Moving Items
        </h2>
        <button
          style={{
            background: "transparent",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            color: "#666",
          }}
        >
          ×
        </button>
      </div>

      {/* Content Area */}
      <div
        style={{
          display: "flex",
          padding: "20px",
          backgroundColor: "#f8f9fa",
        }}
      >
        {/* Left side - 12 buttons in 3x4 grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(4, 1fr)",
            gap: "10px",
            marginRight: "20px",
            width: "300px",
          }}
        >
          {buttons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleButtonClick(button.id)}
              style={{
                height: "60px",
                border: selectedButton === button.id ? "2px solid #0078d4" : "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: selectedButton === button.id ? "#f0f7ff" : "#ffffff",
                cursor: "pointer",
                fontSize: "12px",
                padding: "5px",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
                wordBreak: "break-word",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease-in-out",
              }}
            >
              {button.text}
            </button>
          ))}
        </div>

        {/* Right side - Form */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
            <label
              style={{
                marginRight: "10px",
                width: "120px",
                fontSize: "14px",
                color: "#333",
                fontWeight: 500,
              }}
            >
              Group
            </label>
            <select
              name="keypadGroup"
              value={formData.keypadGroup}
              onChange={handleInputChange}
              style={{
                width: "80px",
                padding: "6px 10px",
                marginRight: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                fontSize: "14px",
                color: "#333",
              }}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span
              style={{
                marginLeft: "10px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#333",
              }}
            >
              Button : {selectedButton}
            </span>
          </div>

          <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
            <label
              style={{
                marginRight: "10px",
                width: "120px",
                fontSize: "14px",
                color: "#333",
                fontWeight: 500,
              }}
            >
              Barcode
            </label>
            <input
              type="text"
              name="barcode"
              value={formData.barcode}
              onChange={handleInputChange}
              style={{
                flex: 1,
                padding: "6px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleShow}
              style={{
                marginLeft: "10px",
                padding: "6px 15px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                color: "#333",
                fontWeight: 500,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f0f0"
                e.currentTarget.style.borderColor = "#ccc"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa"
                e.currentTarget.style.borderColor = "#ddd"
              }}
            >
              Show
            </button>
          </div>

          <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
            <label
              style={{
                marginRight: "10px",
                width: "120px",
                fontSize: "14px",
                color: "#333",
                fontWeight: 500,
              }}
            >
              Auto barcode
            </label>
            <div
              style={{
                width: "18px",
                height: "18px",
                position: "relative",
                display: "inline-block",
              }}
            >
              <input
                type="checkbox"
                name="autoBarcode"
                checked={formData.autoBarcode}
                onChange={handleInputChange}
                style={{
                  width: "18px",
                  height: "18px",
                  margin: 0,
                  cursor: "pointer",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
            <label
              style={{
                marginRight: "10px",
                width: "120px",
                fontSize: "14px",
                color: "#333",
                fontWeight: 500,
              }}
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{
                flex: 1,
                padding: "6px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
            <label
              style={{
                marginRight: "10px",
                width: "120px",
                fontSize: "14px",
                color: "#333",
                fontWeight: 500,
              }}
            >
              Foreign Language
            </label>
            <input
              type="text"
              name="foreignLanguage"
              value={formData.foreignLanguage}
              onChange={handleInputChange}
              style={{
                flex: 1,
                padding: "6px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
            <label
              style={{
                marginRight: "10px",
                width: "120px",
                fontSize: "14px",
                color: "#333",
                fontWeight: 500,
              }}
            >
              Price
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              style={{
                width: "120px",
                padding: "6px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleReset}
              style={{
                marginLeft: "auto",
                padding: "6px 15px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                color: "#333",
                fontWeight: 500,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f0f0"
                e.currentTarget.style.borderColor = "#ccc"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa"
                e.currentTarget.style.borderColor = "#ddd"
              }}
            >
              Reset
            </button>
          </div>

          <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
            <label
              style={{
                marginRight: "10px",
                width: "120px",
                fontSize: "14px",
                color: "#333",
                fontWeight: 500,
              }}
            >
              Short Name
            </label>
            <input
              type="text"
              name="productShortName"
              value={formData.productShortName}
              onChange={handleInputChange}
              style={{
                flex: 1,
                padding: "6px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                fontSize: "14px",
                marginRight: "10px",
              }}
            />
            <button
              onClick={handleSet}
              style={{
                padding: "6px 15px",
                backgroundColor: "#0078d4",
                border: "1px solid #0067b8",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                color: "white",
                fontWeight: 500,
                width: "60px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#006bc0"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#0078d4"
              }}
            >
              Set
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default POSFastMovingItems

