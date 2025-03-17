import React from 'react'
import { Button } from '../ui/button'
import { logout } from '@/actions/user-actions'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

const Navbar = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const clickHandler = async () => {
        const res = await logout(dispatch);
        if(res){
            navigate("/login")
        }
    }


  return (
    <div className='bg-red-400 w-full'>
        <Button onClick={clickHandler} >Logout</Button>
    </div>
  )
}

export default Navbar