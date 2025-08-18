import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  async function onSubmit(data) {
    if (!data.email || !data.password || !data.name) {
      console.log("empty");
      return;
    }

    const url = "http://localhost:5000/signup";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
      if (data.success) {
        localStorage.setItem("token", data.token);
        navigate("/Todo");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-[580px] bg-gradient-to-r from-[#090926] via-[#0a3e0a] via-[#1a721a] to-[#090926] text-gray-100 rounded-2xl p-8 space-y-6">
          <h2>SIGN UP</h2>
          <div className="flex items-center gap-4">
            <label className="w-24 font-semibold">Email: </label>
            <input
              className="flex-1 bg-[antiquewhite] text-black px-4 py-2 rounded-lg border-none focus:outline-black"
              type="email"
              placeholder="email"
              {...register("email", { required: "Required" })}
            />
            <p>{errors.email ? errors.email.message : ""}</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 font-semibold">Password: </label>
            <input
            className="flex-1 bg-[antiquewhite] text-black px-4 py-2 rounded-lg border-none focus:outline-none"
              
              type="password"
              placeholder="Password"
              {...register("password", { required: "password is Required" })}
            />
            <p>{errors.password ? errors.password.message : ""}</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 font-semibold">Name: </label>
            <input
              className="flex-1 bg-[antiquewhite] text-black px-4 py-2 rounded-lg border-none focus:outline-none"
              type="text"
              placeholder="Name"
              {...register("name", { required: "Required" })}
            />
            <p>{errors.name ? errors.name.message : ""}</p>
          </div>

          <button type="submit">Sign Up</button>
          <button onClick={() => navigate("Login")}>Login</button>
        </div>
      </form>
    </>
  );
}
