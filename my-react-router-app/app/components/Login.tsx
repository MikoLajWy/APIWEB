import React, { useState } from "react";
import axios from "axios";

interface User {
  Id: string;
  Email: string;
  Name: string;
}

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const api = axios.create({
        baseURL: "",
        withCredentials: false,
      });

      const response = await api.get<User>("/api/user/me", {
        headers: {
          Authorization: `Digest username="${formData.username}", realm="testrealm@example.com"`,
        },
        auth: undefined,
      });

      console.log("Login successful:", response.data);
    } catch (err: any) {
      if (err.code === "ERR_NETWORK") {
        setError("Problem z połączeniem. Sprawdź konfigurację proxy.");
      } else if (err.response?.status === 401) {
        setError("Nieprawidłowa nazwa użytkownika lub hasło");
      } else {
        setError(err.response?.data?.message || "Logowanie nie powiodło się");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Logowanie</h2>

      {error && <div style={styles.error}>{error}</div>}

      <label>
        Nazwa użytkownika:
        <input
          type="text"
          name="username"
          value={formData.username}
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

export default Login;
