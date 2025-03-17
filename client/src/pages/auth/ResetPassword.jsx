import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Loader2, LockKeyhole, Moon, Sun } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { resetPassword } from '@/actions/user-actions'
import ThemeButton from "@/components/shared/ThemeButton";
import { useDispatch, useSelector } from 'react-redux'


const ResetPassword = () => {

    const params = useParams();
    const resetToken = params.resetToken;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    
    const [newPassword, setNewPassword] = useState("");
    const {loading} = useSelector((state) => state.user);

    const [seePassword, setSeePassword] = useState(false);


    const submitHandaler = async(e) => {
        e.preventDefault();
        try {
            const res = await resetPassword(dispatch, resetToken, newPassword);
            if(res){
                navigate("/login")
            }
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center   w-full h-full'>
            <ThemeButton />
            <form onSubmit={submitHandaler} className='flex flex-col gap-5 border border-gray-300 p-8 min-w-[400px]  rounded-lg mx-4'>
                <div className='text-center'>
                    <h1 className='font-extrabold text-center text-2xl mb-2'>Reset Password</h1>
                    <p className='text-sm text-gray-600'>Enter your new password</p>

                </div>
                <div className="relative">
                <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />

                    <Input
                        required
                        type={seePassword ? "text" : "password"}
                        value={newPassword}
                        name='email'
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder='Enter you new password'
                        className="pl-11 focus-visible:ring-1 pr-11"
                    />
                    {
                        seePassword ? (
                                <Eye size={18} onClick={() => setSeePassword(!seePassword)} className="absolute inset-y-2 right-2 top-3 text-gray-500" />
                        ) : (
                            
                                <EyeOff size={18} onClick={() => setSeePassword(!seePassword)} className="absolute inset-y-2 right-2 top-3 text-gray-500" />
                        )
                    }
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
                            Reset
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

export default ResetPassword