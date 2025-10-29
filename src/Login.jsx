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

    const url = "https://to-do-app-backend-6vxg.onrender.com/login";
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
        <div className="w-full sm:w-[450px] lg:min-w-[580px] bg-white text-blue-950 rounded-2xl p-6 sm:p-8 space-y-6 border-4 border-red-200 mx-auto shadow-[0_0_25px_2px_#fbe9d1cc] ">
          <h2 className="text-[28px] sm:text-[35px] font-bold text-center pt-4">
            LOGIN
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="sm:w-24 text-[18px] sm:text-[20px] font-semibold">
              Email:{" "}
            </label>
            <div className="flex flex-col flex-1">
              <input
                className="bg-[#fbe9d1] text-black px-4 py-2 rounded-lg border-none focus:outline-black w-full"
                type="email"
                placeholder="Username"
                {...register("email", { required: "Required" })}
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.email ? errors.email.message : ""}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="sm:w-24 text-[18px] sm:text-[20px] font-semibold">
              Password:{" "}
            </label>
            <div className="flex flex-col flex-1">
              <input
                className="bg-[#fbe9d1] text-black px-4 py-2 rounded-lg border-none focus:outline-black w-full"
                type="password"
                placeholder="Password"
                {...register("password", { required: "password is Required" })}
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.password ? errors.password.message : ""}
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto rounded-lg border-none py-2 px-4 bg-[#090926] text-white font-semibold cursor-pointer hover:bg-[#111172] transition-all"
          >
            Login
          </button>
        </div>
      </form>
    </>
  );
}
