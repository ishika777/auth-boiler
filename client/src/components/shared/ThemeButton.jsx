import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { Button } from '../ui/button';
import { useDispatch } from 'react-redux';
import { setTheme } from '@/store/themeSlice';


const ThemeButton = () => {

    const dispacth = useDispatch()

    return (
        <div className="absolute top-8 right-10">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => dispacth(setTheme("light"))}>Light</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => dispacth(setTheme("dark"))}>Dark</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default ThemeButton