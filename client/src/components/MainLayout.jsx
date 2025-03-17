import { Outlet } from "react-router-dom"
import Navbar from "./shared/Navbar"
import Footer from "./shared/Footer"

const MainLayout = () => {
    return (

        <div className="flex flex-col h-screen w-screen overflow-hidden">
            <header className="w-full">
                <Navbar />
            </header>
            <main className="flex-1 flex w-full overflow-auto">
                <Outlet />
            </main>
            <footer className="w-full">
                <Footer />
            </footer>
        </div>
    )
}

export default MainLayout