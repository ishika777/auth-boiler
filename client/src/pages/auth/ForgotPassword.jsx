import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from "sonner"
import { useState } from 'react'
import { forgotPassword } from '@/actions/user-actions'
import ThemeButton from "@/components/shared/ThemeButton"
import { useDispatch, useSelector } from 'react-redux'

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const { loading } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    
    const submitHandler = async(e) => {
        e.preventDefault()
        if(!email){
            toast.error("Enter email-id")
            return
        }
        try {
            await forgotPassword(dispatch, email)
            setEmail("")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="absolute top-4 right-4">
                <ThemeButton />
            </div>
            
            <Card className="w-full min-w-[400px] border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-800/20">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Forgot Password
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your email address to reset your password
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <form onSubmit={submitHandler} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Input 
                                    id="email"
                                    required
                                    type="email"
                                    value={email}
                                    name="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    className="pl-10"
                                />
                                <Mail className="absolute left-3 top-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending reset link...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                        
                        <div className="text-center text-sm mt-4">
                            Remember your password?{" "}
                            <Link to="/login" className="text-red-500 hover:text-red-600 font-medium">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default ForgotPassword