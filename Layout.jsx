import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Vault, 
  TrendingUp, 
  Send, 
  ShoppingCart, 
  PieChart,
  Menu,
  X,
  User
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User as UserEntity } from "@/entities/User";

const navigationItems = [
  {
    title: "Holdings",
    url: createPageUrl("Holdings"),
    icon: PieChart,
    description: "View your portfolio"
  },
  {
    title: "Market",
    url: createPageUrl("Market"),
    icon: TrendingUp,
    description: "Live prices & charts"
  },
  {
    title: "Trade",
    url: createPageUrl("Trade"),
    icon: ShoppingCart,
    description: "Buy & sell metals"
  },
  {
    title: "Transfer",
    url: createPageUrl("Transfer"),
    icon: Send,
    description: "Gift to other users"
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await UserEntity.me();
      setUser(userData);
    } catch (error) {
      console.log("User not authenticated");
    }
  };

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --vault-gold: #D4AF37;
          --vault-gold-light: #E6C96B;
          --vault-silver: #C0C0C0;
          --vault-dark: #0F0F0F;
          --vault-dark-light: #1A1A1A;
          --vault-accent: #2A2A2A;
        }
        
        .vault-gradient {
          background: linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%);
        }
        
        .gold-glow {
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
        }
        
        .vault-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%);
          border: 1px solid #333;
        }
      `}</style>
      
      <div className="min-h-screen flex w-full vault-gradient text-white">
        <Sidebar className="border-r border-gray-800 bg-black/50">
          <SidebarHeader className="border-b border-gray-800 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center gold-glow">
                <Vault className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Vault</h2>
                <p className="text-xs text-gray-400">Precious Metals Portfolio</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-3">
                Portfolio
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 rounded-lg p-3 ${
                          location.pathname === item.url ? 'bg-gradient-to-r from-yellow-600/20 to-yellow-500/10 text-yellow-400 border-l-2 border-yellow-500' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <div>
                            <span className="font-medium">{item.title}</span>
                            <p className="text-xs text-gray-400">{item.description}</p>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-3">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent className="px-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Gold Spot</span>
                    <span className="font-semibold text-yellow-400">$2,034</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Silver Spot</span>
                    <span className="font-semibold text-gray-300">$24.18</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Market Status</span>
                    <span className="text-green-400 text-xs">● Open</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-800 p-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{user.full_name}</p>
                  <p className="text-xs text-gray-400 truncate">Premium Member</p>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => UserEntity.login()}
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Sign In
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-screen">
          <header className="bg-black/30 border-b border-gray-800 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-gray-800 p-2 rounded-lg" />
              <h1 className="text-xl font-semibold text-white">Vault</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-900 to-black">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}