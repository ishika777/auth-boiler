import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Mail, Moon, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from 'react'
import { forgotPassword } from '@/actions/user-actions'
import ThemeButton from "@/components/shared/ThemeButton";
import { useDispatch, useSelector } from 'react-redux'



const ForgotPassword = () => {

    const [email, setEmail] = useState("")
    const {loading} = useSelector((state) => state.user);

    const dispatch = useDispatch();
    
    // const {forgotPassword} = useUserStore()

    const submitHnadler = async(e) => {
        e.preventDefault();
        if(!email){
            toast.error("Enter email-id")
            return;
        }
        try {
            await forgotPassword(dispatch, email);
            setEmail("");
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='flex items-center justify-center   w-full h-full'>
            <ThemeButton />
        <form onSubmit={submitHnadler} className='flex flex-col gap-5 border border-gray-300 p-8 min-w-[400px] rounded-lg mx-4'>
            <div className='text-center'>
                <h1 className='font-extrabold text-2xl mb-2'>Forgot Password</h1>
                <p className='text-sm text-gray-600'>Enter your email address to reset your password</p>

            </div>
            <div className="relative">
                <Input 
                required
                type='text'
                value={email}
                name='email'
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter you email'
                  className="pl-11 focus-visible:ring-1"
                />
                 <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
            </div>

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
              Send Reset Link
            </Button>
          )}
          <div className="mt-3 text-center">
            Back to{" "}
          <Link to="/login" className='text-blue-500 hover:underline'>Login</Link>
          </div>
        </div>
        </form>
    </div>
  )
}

export default ForgotPassword