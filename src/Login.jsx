import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./App.css";
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  async function onSubmit(data) {
    if (!data.email || !data.password) {
      console.log("empty");
      return;
    }

    const url = "https://to-do-app-backend-production-8720.up.railway.app/login";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    };
    try {
      const response = await fetch(url, options);
      const res = await response.json();
      console.log(res);
      if (res.success) {
        localStorage.setItem("token", res.token);
        navigate("/Todo");
      } else {
        alert(res.error);
      }
    } catch (error) {
      console.error(error);
    }
    
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div class="login">
          <h2>LOGIN</h2>

          <label>Email: </label>
          <input
            class="login-textbox"
            type="email"
            placeholder="Username"
            {...register("email", { required: "Required" })}
          />
          <p>{errors.email ? errors.email.message : ""}</p>
          <label>Password: </label>
          <input
            class="login-textbox"
            type="password"
            placeholder="Password"
            {...register("password", { required: "password is Required" })}
          />
          <p>{errors.password ? errors.password.message : ""}</p>

          <button type="submit">Login</button>
        </div>
      </form>
    </>
  );
}
