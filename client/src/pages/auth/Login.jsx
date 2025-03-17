import { login } from "@/actions/user-actions";
import ThemeButton from "@/components/shared/ThemeButton";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";



const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {loading} = useSelector((state) => state.user);


    const [errors, setErrors] = useState({})
    const [seePassword, setSeePassword] = useState(false);
    const [input, setInput] = useState({
        email: "",
        password: "",
        admin: "false"
    });

    const handleRadioChange = (value) => {
        setInput((prev) => ({ ...prev, admin: value }));
    };

    const changEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const loginSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const success = await login(dispatch, input);
            if(success){
                navigate("/")
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-full">
            <ThemeButton />
            <form
                onSubmit={loginSubmitHandler}
                className="p-8  min-w-[400px] rounded-lg border border-gray-300 mx-4"
            >
                <div className="mb-4">
                    <h1 className="font-bold text-2xl">HackHeist</h1>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        <Input
                        required
                            type="email"
                            placeholder="email@example.com"
                            name="email"
                            value={input.email}
                            onChange={changEventHandler}
                            className="pl-11 focus-visible:ring-1"
                        />
                        {
                            errors && <span className="text-xs text-red-500">{errors.email}</span>
                        }
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        <Input
                        required
                            type={seePassword ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            value={input.password}
                            onChange={changEventHandler}
                            className="pl-11 focus-visible:ring-1 pr-11"
                        />
                        {
                            seePassword ? (
                                <Eye size={18} onClick={() => setSeePassword(!seePassword)} className="absolute inset-y-2 right-2 top-3 text-gray-500" />
                            ) : (

                                <EyeOff size={18} onClick={() => setSeePassword(!seePassword)} className="absolute inset-y-2 right-2 top-3 text-gray-500" />
                            )
                        }
                        {
                            errors && <span className="text-xs text-red-500">{errors.password}</span>
                        }
                    </div>
                </div>

                <RadioGroup defaultValue={input.admin} name="admin" onValueChange={handleRadioChange}>
                    <div className="flex items-center mb-6 gap-6">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="r1"  />
                            <Label htmlFor="r1">User</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="r2" />
                            <Label htmlFor="r2">Admin</Label>
                        </div>
                    </div>
                </RadioGroup>

                <div>
                    {loading ? (
                        <Button disabled className="w-full bg-red-500 hover:bg-red-600">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="w-full bg-red-500  hover:bg-red-600"
                        >
                            Login
                        </Button>
                    )}
                </div>

                <div className="mt-4 text-center">
                    <Link to="/forgot-password" className="text-blue-500 hover:underline">
                        Forgot Password
                    </Link>
                </div>
                <Separator className="my-4" />
                <p className="mt-2 text-center">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Signup
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
