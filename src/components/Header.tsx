import { Hospital, Moon, Sun } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
// import { useTheme } from './theme-provider'
import { Button } from '@/components/ui/button'
// import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,} from '@/components/ui/dropdown-menu'
// import { RegisterUser } from '@/api/auth'

export default function Header() {
  // const { setTheme } = useTheme()
  const router = useRouter()

  // Scroll to section if it exists
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="w-full bg-blue-600 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2 font-bold text-lg text-white">
          <Hospital className="h-6 w-6 text-white" />
          <button
            onClick={() => {
              router.navigate({ to: '/' })
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="hover:text-blue-200"
          >
            Healthcare Connect
          </button>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex space-x-6 font-medium text-white">
          <button
            onClick={() => {
              router.navigate({ to: '/' })
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="hover:text-blue-200"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('about-section')}
            className="hover:text-blue-200 transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('contact-section')}
            className="hover:text-blue-200 transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Right: Auth + Theme */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            className="text-sm text-white hover:text-blue-200"
            onClick={() => router.navigate({ to: '/login' })}
          >
            Login
          </Button>
          <Button
            className="bg-white hover:bg-blue-100 text-blue-700 text-sm font-medium"
            onClick={() => router.navigate({ to: '/register' })}
          >
            Register
          </Button>
          {/* 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Toggle theme" className="bg-blue-500 border-none text-white hover:bg-blue-700">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </header>
  )
}
