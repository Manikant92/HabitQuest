
import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const Index = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme} 
          className="rounded-full shadow-md"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default Index;
