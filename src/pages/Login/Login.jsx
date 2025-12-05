import { MdOutlineBakeryDining } from "react-icons/md";
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

const Login = () => {
    const [userLogin, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = e.target;
        const credentials = {
            UserName: form.UserName.value,
            Password: form.Password.value,
        };

        console.log("Submitting:", typeof credentials);

        if (!credentials.UserName || !credentials.Password) {
            toast.error("Please fill in all fields.");
            return;
        }

        userLogin(credentials)
            .unwrap()
            .then((response) => {
                if (!response.User || !response.Token) {
                    toast.error("Received invalid response from server.");
                    return;
                }

                console.log("Login response:", response);
                dispatch(
                    setUser({
                        user: response.User,
                        token: response.Token,
                        refreshToken: response.RefreshToken,
                    })
                );
                toast.success("Login successful!");
                navigate("/dashboard");
            })
            .catch((error) => {
                console.error("Login failed:", error);
                toast.error("Login failed!");
            });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Side */}
            <AnimationWrapper animationType="slideLeft">
                <div className="md:w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-700 text-gray-100 p-10">
                    <div className="flex justify-center items-center mb-6">
                        <MdOutlineBakeryDining size={40} className="mr-2" />
                        <span className="text-2xl font-bold">Bloom&Tech</span>
                    </div>
                    <AnimationWrapper animationType="fadeUp" delay={0.2}>
                        <h1 className="text-4xl font-bold mb-4 text-center">
                            Welcome Back
                        </h1>
                    </AnimationWrapper>
                    <AnimationWrapper animationType="fadeUp" delay={0.4}>
                        <p className="text-lg text-gray-300 text-center max-w-sm">
                            Log in to access your dashboard and manage your
                            account effortlessly. We are glad to see you again!
                        </p>
                    </AnimationWrapper>
                </div>
            </AnimationWrapper>

            {/* Right Side */}
            <div className="md:w-1/2 flex items-center justify-center bg-gray-100 p-8">
                <AnimationWrapper animationType="slideRight">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                            Login to Your Account
                        </h2>
                        <StaggeredAnimationWrapper selector="div, button, p">
                            <Form onSubmit={handleSubmit}>
                                <Input
                                    id="UserName"
                                    name="UserName"
                                    type="text"
                                    label="Username or Email"
                                    placeholder="Enter your username or email"
                                    defaultValue="react@test.com"
                                />
                                <Input
                                    id="Password"
                                    name="Password"
                                    type="password"
                                    label="Password"
                                    placeholder="Enter your password"
                                    defaultValue="playful009"
                                />
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full mt-4"
                                >
                                    {isLoading ? "Logging in..." : "Login"}
                                </Button>
                            </Form>
                            <p className="mt-5 text-sm text-center text-gray-600">
                                Do not have an account?{" "}
                                <a
                                    href="/signup"
                                    className="text-gray-800 font-semibold hover:underline"
                                >
                                    Sign up
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
