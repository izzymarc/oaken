import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  Menu, 
  MessageSquare, 
  User, 
  LogOut, 
  Grid, 
  Briefcase,
  CalendarDays
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

export function Navigation() {
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();
  const [hasNotifications, setHasNotifications] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  
  // Simulate notifications and messages for demo purposes
  useEffect(() => {
    if (user) {
      setHasNotifications(true);
      setMessageCount(Math.floor(Math.random() * 5) + 1);
    }
  }, [user]);

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Grid className="h-4 w-4 mr-2" />,
      requiresAuth: true
    },
    {
      href: "/marketplace",
      label: "Marketplace",
      icon: <Briefcase className="h-4 w-4 mr-2" />,
      requiresAuth: false
    },
    {
      href: "/messages",
      label: "Messages",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
      badge: messageCount > 0,
      badgeContent: messageCount,
      requiresAuth: true
    },
  ];

  const DesktopNav = () => (
    <div className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <CalendarDays className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">EventWork</span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            {navItems.map((item) => 
              (!item.requiresAuth || (item.requiresAuth && user)) && (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href}>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <div className="flex items-center">
                        {item.icon}
                        {item.label}
                        {item.badge && (
                          <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                            {item.badgeContent}
                          </Badge>
                        )}
                      </div>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {hasNotifications && (
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
                  )}
                </Button>
              </motion.div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user.profileImage || undefined} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">{user.fullName[0]}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard">
                      <DropdownMenuItem className="cursor-pointer">
                        <Grid className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/messages">
                      <DropdownMenuItem className="cursor-pointer">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Messages</span>
                        {messageCount > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {messageCount}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/auth">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-blue-600 hover:bg-blue-700">Sign In</Button>
              </motion.div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  const MobileNav = () => (
    <div className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <CalendarDays className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">EventWork</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <Link href="/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="h-5 w-5" />
                  {messageCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                      {messageCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {hasNotifications && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
                )}
              </Button>
            </>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-6 py-6">
                <div className="flex flex-col space-y-2">
                  {user ? (
                    <div className="flex items-center gap-2 mb-6 pb-6 border-b">
                      <Avatar>
                        <AvatarImage src={user.profileImage || undefined} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">{user.fullName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.username}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 pb-6 border-b">
                      <Link href="/auth">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign In</Button>
                      </Link>
                    </div>
                  )}
                  
                  {navItems.map((item) => 
                    (!item.requiresAuth || (item.requiresAuth && user)) && (
                      <Link key={item.href} href={item.href}>
                        <div className="flex items-center py-3 cursor-pointer hover:bg-slate-50 px-2 rounded-md">
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                          {item.badge && (
                            <Badge variant="destructive" className="ml-auto">
                              {item.badgeContent}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    )
                  )}
                  
                  {user && (
                    <>
                      <Link href="/profile">
                        <div className="flex items-center py-3 cursor-pointer hover:bg-slate-50 px-2 rounded-md">
                          <User className="h-4 w-4 mr-2" />
                          <span>Profile</span>
                        </div>
                      </Link>
                      
                      <div 
                        className="flex items-center py-3 cursor-pointer hover:bg-slate-50 px-2 rounded-md text-red-600 mt-4"
                        onClick={() => logoutMutation.mutate()}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Log Out</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );

  return isMobile ? <MobileNav /> : <DesktopNav />;
}
