import { MdOutlineSchool } from "react-icons/md";
import { StaggeredAnimationWrapper } from "../../component/AnimationWrapper/StaggeredAnimationWrapper";
import { AnimationWrapper } from "../../component/AnimationWrapper/AnimationWrapper";
import { Form } from "../../component/form/Form";
import { Input } from "../../component/form/Input";
import { Button } from "../../component/form/Button";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/features/hook";
import { setUser } from "../../redux/features/auth/authSlice";
import { useState } from "react";

const Login = () => {
  const [userLogin, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ ...errors, email: "Invalid email format." });
      toast.error("Invalid email format.");
      return;
    }

    const credentials = {
      email: email.trim(),
      password,
    };

    userLogin(credentials)
      .unwrap()
      .then((response) => {
        // Server response: { user, token, refreshToken }
        if (!response.user || !response.token) {
          toast.error("Received invalid response from server.");
          return;
        }

        dispatch(
          setUser({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
          })
        );

        toast.success("Login successful!");
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setErrors({ email: "", password: "", general: "" });

        // Field-level errors
        if (error?.data?.errorMessages && Array.isArray(error.data.errorMessages)) {
          const fieldErrors = { email: "", password: "", general: "" };
          error.data.errorMessages.forEach((err) => {
            const path = err.path || "general";
            if (path === "email") fieldErrors.email = err.message;
            else if (path === "password") fieldErrors.password = err.message;
            else fieldErrors.general += err.message + " ";
          });
          setErrors(fieldErrors);
          if (fieldErrors.general) toast.error(fieldErrors.general.trim());
          return;
        }

        // General error message
        if (error?.data?.message) {
          setErrors((s) => ({ ...s, general: error.data.message }));
          toast.error(error.data.message);
          return;
        }

        toast.error("Login failed! Please check your credentials.");
      });
  };

  const fillAdminCredentials = (e) => {
    e.preventDefault();
    setEmail("debos.das.02@gmail.com");
    setPassword("password123!");
  };

  const fillStudentCredentials = (e) => {
    e.preventDefault();
    setEmail("smith@gmail.com");
    setPassword("123456");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side */}
      <AnimationWrapper animationType="slideLeft">
        <div className="md:w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-brand-900 to-brand-700 text-brand-100 p-10">
          <div className="flex justify-center items-center mb-6">
            <MdOutlineSchool size={40} className="mr-2" />
            <span className="text-2xl font-bold">CourseManage</span>
          </div>
          <AnimationWrapper animationType="fadeUp" delay={0.2}>
            <h1 className="text-4xl font-bold mb-4 text-center">Welcome Back</h1>
          </AnimationWrapper>
          <AnimationWrapper animationType="fadeUp" delay={0.4}>
            <p className="text-lg text-brand-300 text-center max-w-sm">
              Log in to access your course management dashboard and handle your classes, students, and resources effortlessly. We are glad to see you again!
            </p>
          </AnimationWrapper>
        </div>
      </AnimationWrapper>

      {/* Right Side */}
      <div className="md:w-1/2 flex items-center justify-center bg-brand-50 p-8">
        <AnimationWrapper animationType="slideRight">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-6 text-brand-800">
              Login to Your Course Dashboard
            </h2>
            <StaggeredAnimationWrapper selector="div, button, p">
              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                  {errors.general}
                </div>
              )}
              <Form onSubmit={handleSubmit}>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-brand-500"}
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}

                <Input
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-brand-500"}
                />
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}

                <Button type="submit" disabled={isLoading} className="w-full mt-4 bg-brand-600 hover:bg-brand-700 text-white">
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </Form>

              <p className="mt-5 text-sm text-center text-gray-600">
                Do not have an account?{" "}
                <a href="/register" className="text-brand-800 font-semibold hover:underline">
                  Sign up
                </a>
              </p>

              <p className="mt-3 text-sm text-center text-gray-600">
                Quick login:{" "}
                <a href="#" onClick={fillAdminCredentials} className="text-brand-800 font-semibold hover:underline">
                  Admin credentials
                </a>{" "}
                |{" "}
                <a href="#" onClick={fillStudentCredentials} className="text-brand-800 font-semibold hover:underline">
                  Student credentials
                </a>
              </p>
            </StaggeredAnimationWrapper>
          </div>
        </AnimationWrapper>
      </div>
    </div>
  );
};

export default Login;