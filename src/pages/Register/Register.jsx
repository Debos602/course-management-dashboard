import { MdOutlineSchool } from "react-icons/md";
import { StaggeredAnimationWrapper } from "../../component/AnimationWrapper/StaggeredAnimationWrapper";
import { AnimationWrapper } from "../../component/AnimationWrapper/AnimationWrapper";
import { Form } from "../../component/form/Form";
import { Input } from "../../component/form/Input";
import { Button } from "../../component/form/Button";
import { useRegisterMutation } from "../../redux/features/auth/authApi";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ name: "", email: "", password: "", phone: "", general: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = {
      name: (form.get("name") || "").toString().trim(),
      email: (form.get("email") || "").toString().trim(),
      password: (form.get("password") || "").toString(),
      phone: (form.get("phone") || "").toString().trim(),
      role: (form.get("role") || "student").toString(),
    };

    // basic client-side check
    if (!payload.name || !payload.email || !payload.password) {
      toast.error("Please fill name, email and password.");
      return;
    }

    setErrors({ name: "", email: "", password: "", phone: "", general: "" });

    register(payload)
      .unwrap()
      .then((res) => {
        toast.success("Registration successful! Please login.");
        navigate("/");
      })
      .catch((err) => {
        console.error("Register failed:", err);
        // parse server validation errors if present
        if (err?.data?.errorMessages && Array.isArray(err.data.errorMessages)) {
          const fe = { name: "", email: "", password: "", phone: "", general: "" };
          err.data.errorMessages.forEach((e) => {
            const p = Array.isArray(e.path) ? e.path[0] : e.path;
            if (p === "name") fe.name = e.message;
            else if (p === "email") fe.email = e.message;
            else if (p === "password") fe.password = e.message;
            else if (p === "phone") fe.phone = e.message;
            else fe.general = e.message || fe.general;
          });
          setErrors(fe);
          return;
        }

        if (err?.data?.message) {
          setErrors((s) => ({ ...s, general: err.data.message }));
          toast.error(err.data.message);
          return;
        }

        toast.error("Registration failed.");
      });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Brand Panel */}
      <AnimationWrapper animationType="slideLeft">
        <div className="md:w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-brand-900 to-brand-700 text-brand-100 p-10">
          <div className="flex justify-center items-center mb-6">
            <MdOutlineSchool size={40} className="mr-2" />
            <span className="text-2xl font-bold">CourseManage</span>
          </div>
          <AnimationWrapper animationType="fadeUp" delay={0.2}>
            <h1 className="text-4xl font-bold mb-4 text-center">Join Us</h1>
          </AnimationWrapper>
          <AnimationWrapper animationType="fadeUp" delay={0.4}>
            <p className="text-lg text-brand-300 text-center max-w-sm">
              Create a student account to get started with course management — enroll, track progress, and collaborate with instructors.
            </p>
          </AnimationWrapper>
        </div>
      </AnimationWrapper>

      {/* Right Form Panel */}
      <div className="md:w-1/2 flex items-center justify-center bg-brand-50 p-8">
        <AnimationWrapper animationType="slideRight">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-6 text-brand-800">Create Student Account</h2>

            <StaggeredAnimationWrapper selector="div, button, p">
              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{errors.general}</div>
              )}

              <Form onSubmit={handleSubmit}>
                <Input id="name" name="name" label="Full Name" placeholder="John Doe" className={errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-brand-500"} />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}

                <Input id="email" name="email" type="email" label="Email" placeholder="student@example.com" className={errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-brand-500"} />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}

                <Input id="password" name="password" type="password" label="Password" placeholder="Password123!" className={errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-brand-500"} />
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}

                <Input id="phone" name="phone" label="Phone" placeholder="1234567890" className={errors.phone ? "border-red-500 focus:ring-red-500" : "focus:ring-brand-500"} />
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}

                <input type="hidden" name="role" value="student" />

                <Button type="submit" disabled={isLoading} className="w-full mt-4 bg-brand-600 hover:bg-brand-700 text-white">
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </Form>

              <p className="mt-5 text-sm text-center text-gray-600">
                Already have an account? {" "}
               <Link to="/" className="text-brand-600 hover:underline">Login here</Link>
              </p>
            </StaggeredAnimationWrapper>
          </div>
        </AnimationWrapper>
      </div>
    </div>
  );
};

export default Register;
