import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verify } from "../api/auth.api";

export default function VerifyAccount() {
  const { username, token } = useParams();
  const [status, setStatus] = useState("Проверка...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const doVerify = async () => {
      try {
        await verify(username, token);
        setStatus("Вы успешно подтвердили аккаунт в системе!");
        setSuccess(true);
      } catch (err) {
        console.error(err);
        setStatus("Ошибка подтверждения аккаунта.");
      }
    };

    doVerify();
  }, [username, token]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{status}</h2>
      {success && <p>Вы можете закрыть данную страницу.</p>}
    </div>
  );
}
