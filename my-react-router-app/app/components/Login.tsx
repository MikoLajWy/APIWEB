import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import axiosClient from "./axiosClient";
import { Md5 } from "@smithy/md5-js";

interface LoginData {
  email: string;
  password: string;
}

interface DigestAuthInfo {
  realm?: string;
  nonce?: string;
  algorithm?: string;
  qop?: string;
  opaque?: string;
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

  const md5Hex = async (input: string): Promise<string> => {
    const hasher = new Md5();
    hasher.update(new TextEncoder().encode(input));
    const digest = await hasher.digest();
    return Array.from(digest)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const generateCnonce = (length = 16): string => {
    const bytes = new Uint8Array(length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const buildAuthHeader = (opts: {
    username: string;
    realm?: string;
    nonce?: string;
    uri: string;
    response: string;
    algorithm?: string;
    qop?: string;
    nc?: string;
    cnonce?: string;
    opaque?: string;
  }): string => {
    const parts: string[] = [];
    parts.push(`Digest username="${opts.username}"`);
    if (opts.realm) parts.push(`realm="${opts.realm}"`);
    if (opts.nonce) parts.push(`nonce="${opts.nonce}"`);
    parts.push(`uri="${opts.uri}"`);
    parts.push(`response="${opts.response}"`);
    if (opts.algorithm) parts.push(`algorithm=${opts.algorithm}`);
    if (opts.opaque) parts.push(`opaque="${opts.opaque}"`);
    if (opts.qop && opts.nc && opts.cnonce) {
      parts.push(`qop=${opts.qop}`);
      parts.push(`nc=${opts.nc}`);
      parts.push(`cnonce="${opts.cnonce}"`);
    }
    return parts.join(", ");
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const initial = await axiosClient.get("/user/me", {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json",
        },
        validateStatus: () => true,
      });

      axiosClient.interceptors.response.use((response) => {
        return response;
      });

      console.log("Initial status:", initial.status);
      console.log(
        "Initial WWW-Authenticate:",
        initial.headers["www-authenticate"]
      );

      const authHeader = initial.headers["www-authenticate"];
      if (authHeader) {
        const parseWwwAuthenticate = (h: string) => {
          const parsed: DigestAuthInfo = {};
          const regex = /(\w+)=("(.*?)"|([^,\s]+))/g;
          let m: RegExpExecArray | null;
          while ((m = regex.exec(h)) !== null) {
            const key = m[1];
            const value = m[3] ?? m[4];
            parsed[key as keyof DigestAuthInfo] = value;
          }
          return parsed;
        };

        const parsed = parseWwwAuthenticate(String(authHeader));
        let { realm, nonce, algorithm, opaque, qop } = parsed;

        if (qop && qop.includes(",")) {
          const parts = qop.split(",").map((s) => s.trim());
          qop = parts.includes("auth") ? "auth" : parts[0];
        }

        const method =
          (initial.config?.method?.toString().toUpperCase() as string) || "GET";
        const uri = (initial.config?.url as string) || "/user/me";

        const cnonce = generateCnonce(16);
        const nc = "00000001";

        const ha1 = await md5Hex(
          `${loginData.email}:${realm ?? ""}:${loginData.password}`
        );
        const ha2 = await md5Hex(`${method}:${uri}`);

        const responseDigest = qop
          ? await md5Hex(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`)
          : await md5Hex(`${ha1}:${nonce}:${ha2}`);

        const authorization = buildAuthHeader({
          username: loginData.email,
          realm,
          nonce,
          uri,
          response: responseDigest,
          algorithm: algorithm ?? "MD5",
          qop,
          nc,
          cnonce,
          opaque,
        });

        axiosClient.defaults.headers.common["Authorization"] = authorization;
        console.log("Generated Authorization header:", authorization);

        const authed = await axiosClient.get("/user/me", {
          validateStatus: () => true,
        });

        console.log("Auth response status:", authed.status);
        console.log("Auth response data:", authed.data);
        console.log("Response digest:", responseDigest);

        if (authed.status === 200) {
          try {
            localStorage.setItem("user", JSON.stringify(authed.data));
          } catch {
            /* ignore */
          }
        } else {
          console.warn(
            "Authenticated request did not return 200:",
            authed.status
          );
        }
      } else {
        if (initial.status === 200) {
          try {
            localStorage.setItem("user", JSON.stringify(initial.data));
          } catch {
            /* ignore */
          }
        } else {
          console.warn(
            "Initial request responded without WWW-Authenticate:",
            initial.status
          );
        }
      }
    } catch (error) {
      console.error("Digest auth error:", error);
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
