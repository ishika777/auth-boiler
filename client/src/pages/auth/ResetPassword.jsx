import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Loader2, LockKeyhole, Moon, Sun } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { resetPassword } from '@/actions/user-actions'
import ThemeButton from "@/components/shared/ThemeButton";
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label'



const ResetPassword = () => {

    const params = useParams();
    const resetToken = params.resetToken;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    
    const [newPassword, setNewPassword] = useState("");
    const {loading} = useSelector((state) => state.user);
    const [error, setError] = useState("");

    const [seePassword, setSeePassword] = useState(false);


    const submitHandaler = async(e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
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

        <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="absolute top-4 right-4">
        <ThemeButton />
    </div>

    <Card className="w-full min-w-[400px] border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-800/20">
        <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
                <span className="text-red-500">Skill</span>Sort
            </CardTitle>
            <CardDescription className="text-center">
                Enter your new password to reset your account
            </CardDescription>
        </CardHeader>

        <CardContent>
            <form onSubmit={submitHandaler} className="space-y-5">
                <div className="relative">

                    <Input
                        id="password"
                        required
                        type={seePassword ? "text" : "password"}
                        placeholder="••••••••"
                        name="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`pl-10`}
                    />
                    <LockKeyhole className="absolute left-3 top-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <button
                        type="button"
                        onClick={() => setSeePassword(!seePassword)}
                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                        {seePassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {
                    error && (<p className="text-xs text-red-500 mt-1">{error}</p>)
                }

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resetting Password...
                        </>
                    ) : (
                        "Reset Password"
                    )}
                </Button>

                <div className="text-center text-sm">
                    Back to{" "}
                    <Link to="/login" className="text-red-500 hover:text-red-600 font-medium">
                        Login
                    </Link>
                </div>
            </form>
        </CardContent>
    </Card>
</div>


       
    )
}

export default ResetPassword