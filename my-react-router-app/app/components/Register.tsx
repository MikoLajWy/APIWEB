import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import axios from "axios";
import type { AxiosInstance } from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

interface FormData {
  name: string;
  email: string;
  password: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axiosClient.post("/auth/register", formData);
      console.log("✅ Odpowiedź API:", response.data);
      alert("Użytkownik zarejestrowany!");
    } catch (error: any) {
      console.error("❌ Błąd:", error.response?.data || error.message);
      alert("Wystąpił błąd przy rejestracji.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Rejestracja</h2>

      <label>
        Imię:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Hasło:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit">Zarejestruj</button>
    </form>
  );
};

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "250px",
    margin: "50px auto",
  },
};

export default RegisterForm;
