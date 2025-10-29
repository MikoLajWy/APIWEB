import type { FC } from "react";
import React, { useState } from "react";
import { Button, FormControl, FormLabel } from "@mui/material";

interface FormData {
  email: string;
  password: string;
  name: string;
}

const Register: FC = () => {
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://api.burrows.org/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            name: form.name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      console.log("Zarejestrowano:", result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleRegister}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "300px",
          margin: "auto",
        }}
      >
        <FormLabel>EMAIL</FormLabel>
        <FormControl>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </FormControl>

        <FormLabel>PASSWORD</FormLabel>
        <FormControl>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </FormControl>

        <FormLabel>NAME</FormLabel>
        <FormControl>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </FormControl>

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Rejestrowanie..." : "Zarejestruj"}
        </Button>
      </form>

      {error && <p style={{ color: "red" }}>❌ {error}</p>}
      {data && (
        <p style={{ color: "green" }}>
          ✅ Rejestracja zakończona sukcesem! {JSON.stringify(data)}
        </p>
      )}
    </>
  );
};

export default Register;
