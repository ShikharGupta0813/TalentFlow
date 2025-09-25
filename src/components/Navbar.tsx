import React, { useState } from "react";
import { Bell, Sun, Moon, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

function Navbar() {
const [dark, setDark] = useState(false);
return (
<div className="flex items-center justify-between px-6 py-4 bg-white shadow sticky top-0 z-10">
<div className="flex items-center gap-3">
</div>
<div className="flex items-center gap-4">
<div className="flex items-center gap-2 cursor-pointer">
<Avatar>
<span className="sr-only">Profile</span>
</Avatar>
<div>
<div className="text-sm font-semibold">Entnt Team</div>
<div className="text-xs text-muted-foreground">HR Manager</div>
</div>
</div>
</div>
</div>
);
};

export default Navbar;