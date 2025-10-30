import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import axiosClient from "./axiosClient";

interface LoginData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axiosClient.get("/user/me", {
        params: loginData,
      });
      const token = response.data.Id;
      console.log("✅ Token:", token);

      alert("Zalogowano pomyślnie!");
    } catch (error: any) {
      console.error(
        "❌ Błąd logowania:",
        error.response?.data || error.message
      );
      alert("Wystąpił błąd przy logowaniu.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Logowanie</h2>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Hasło:
        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit">Zaloguj</button>
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

export default LoginForm;
