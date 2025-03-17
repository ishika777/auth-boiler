import { signup } from '@/actions/user-actions';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, Moon, PhoneCallIcon, Sun, User2 } from 'lucide-react';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import ThemeButton from "@/components/shared/ThemeButton";
import { useDispatch, useSelector } from 'react-redux';






const Signup = () => {

    const naviagte = useNavigate();
    const {loading} = useSelector((state) => state.user);

    const dispatch = useDispatch();

    
    const [errors, setErrors] = useState({})
    const [seePassword, setSeePassword] = useState(false);
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        password: "",
        contact: "",
        admin: "false"
    });

    const changEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const handleRadioChange = (value) => {
        setInput((prev) => ({ ...prev, admin: value }));
    };

    const signupSubmitHandler = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (input.fullname.length < 3) {
            newErrors.fullname = "Fullname must be at least 3 characters";
        }

        if (input.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (input.contact.length !== 10 || !/^\d+$/.test(input.contact)) {
            newErrors.contact = "Contact number must be exactly 10 digits";
        }

        if (!["true", "false"].includes(input.admin)) {
            newErrors.admin = "Please select a role";
        }

        // If errors exist, update state and stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const success = await signup(dispatch, input)
            if(success){
                naviagte("/verify-email")
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex items-center justify-center   w-full h-full">
            <ThemeButton />
            <form
                onSubmit={signupSubmitHandler}
                className="p-8 min-w-[400px]  rounded-lg border border-gray-300 mx-4"
            >
                <div className="mb-4">
                    <h1 className="font-bold text-2xl">TastyBites</h1>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <Input
                        required
                            type="text"
                            placeholder="Full name"
                            name="fullname"
                            value={input.fullname}
                            onChange={changEventHandler}
                            className="pl-11 focus-visible:ring-1"
                        />
                        <User2 className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {
                            errors && <span className="text-xs text-red-500">{errors.fullname}</span>
                        }
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <Input
                        required
                            type="email"
                            placeholder="email@example.com"
                            name="email"
                            value={input.email}
                            onChange={changEventHandler}
                            className="pl-11 focus-visible:ring-1"
                        />
                        <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
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

                <div className="mb-4">
                    <div className="relative">
                        <Input
                        required
                            type="text"
                            placeholder="Contact"
                            name="contact"
                            value={input.contact}
                            onChange={changEventHandler}
                            className="pl-11 focus-visible:ring-1"
                        />
                        <PhoneCallIcon className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {
                            errors && <span className="text-xs text-red-500">{errors.contact}</span>
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
                            className="w-full bg-red-500 hover:bg-red-600"
                        >
                            Signup
                        </Button>
                    )}
                </div>
                <p className="mt-3 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;