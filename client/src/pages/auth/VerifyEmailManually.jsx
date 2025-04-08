import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "sonner"
import { useState } from 'react'
import ThemeButton from "@/components/shared/ThemeButton"
import { useDispatch, useSelector } from 'react-redux'
import { sendCode } from '@/actions/user-actions'

const VerifyEmailManually = () => {

    const [email, setEmail] = useState("")
        const { loading } = useSelector((state) => state.user)
        const dispatch = useDispatch()
        const navigate = useNavigate()
        
        const submitHandler = async(e) => {
            e.preventDefault()
            if(!email){
                toast.error("Enter email-id")
                return
            }
            try {
                await sendCode(dispatch, email)
                setEmail("")
                navigate("/verify-email")
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
                        Send Verification Code
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your email address to send verification code
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
                                    Sending verification code...
                                </>
                            ) : (
                                "Send Verification Code"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
  )
}

export default VerifyEmailManually