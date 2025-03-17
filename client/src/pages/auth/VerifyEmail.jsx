import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Moon, Sun } from "lucide-react"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { verifyEmail } from "@/actions/user-actions"
import ThemeButton from "@/components/shared/ThemeButton";
import { useDispatch, useSelector } from "react-redux"



const VerifyEmail = () => {

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const inputRef = useRef([])
    const navigate = useNavigate()
    const {loading} = useSelector((state) => state.user);

    const dispatch = useDispatch();


    const handleChange = (index, value) => {
        if(/^[a-zA-Z0-9]$/.test(value) || value === ""){
            const newOtp = [...otp]
            newOtp[index] = value;
            setOtp(newOtp);
        }
        if(value !== "" && index < 5){
            inputRef.current[index+1].focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if(e.key === "Backspace" && !otp[index] && index>0){
            inputRef.current[index-1].focus()
        }
    }

    const submitHandler = async(e) => {
        e.preventDefault()
        const verificationCode = otp.join("");
        try {
            const success = await verifyEmail(dispatch, verificationCode)
            if(success){
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className="flex items-center justify-center   w-full h-full">
            <ThemeButton />
        <div className="p-8 rounded-md min-w-[400px] flex flex-col gap-10 border border-gray-300">
            <div className="">
                <h1 className="font-extrabold text-2xl">Verify your email</h1>
                <p className="text-sm text-gray-600">Enter the 6 digit code sent to your email address</p>
            </div>
            <form onSubmit={submitHandler}>
                <div className="flex justify-between gap-3">
                    {
                        otp.map((letter, idx) => (
                            <Input 
                            required
                                key={idx}
                                type="text"
                                value={letter}
                                maxLength={1}
                                onChange={(e) => handleChange(idx, e.target.value)}
                                ref={(element) => inputRef.current[idx] = element}
                                onKeyDown={(e) => handleKeyDown(idx, e)}
                                className="md:w-12 md:h-12 w-8 h-8 text-center text-sm md:text-2xl font-normal md:font-bold rounded-lg focus-visible:ring-1 focus-visible:ring-indigo-500"
                            />
                        ))
                    }
                </div>
                {
                    loading ? (
                        <Button disabled className="w-full bg-red-500 hover:bg-red-600 mt-6">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
                    ) : (

                        <Button  type="submit" className="bg-red-500 hover:hoverOrange mt-6 w-full">Verify</Button>
                    )
                }
            </form>
        </div>
    </div>
  )
}

export default VerifyEmail