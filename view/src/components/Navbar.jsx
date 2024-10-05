import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg">
        <Link to='/'>
            <h1 className="text-2xl font-bold text-white">Inicio</h1>
        </Link>

        <ul className="flex gap-x-2">
            <li>
                <Link className="text-white" to='/showTasks'>Tareas</Link>
            </li>
        

            <li>
            <Link className="text-white " to='/ShowAnnouncements'>Anuncios</Link>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar
