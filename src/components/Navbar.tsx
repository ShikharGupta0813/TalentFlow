import React, { useState } from "react";
import { useLocation } from "react-router";
import { Bell, Sun, Moon, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

function Navbar() {
	const [dark, setDark] = useState(false);
	const location = useLocation();
	// Map route to page title
	const routeTitleMap: Record<string, string> = {
		"/dashboard": "DASHBOARD",
		"/jobs": "JOBS",
		"/candidates": "CANDIDATES",
		"/assignments": "ASSIGNMENTS",
	};
	// Find matching route
	const currentPath = Object.keys(routeTitleMap).find((path) => location.pathname.startsWith(path));
	const pageTitle = currentPath ? routeTitleMap[currentPath] : "";
	return (
		<div className="flex items-center justify-between px-6 py-4 bg-white shadow sticky top-0 z-10">
			<div className="flex items-center gap-3">
				{pageTitle && (
					<span className="text-2xl font-bold" style={{ color: '#0d9488' }}>{pageTitle}</span>
				)}
			</div>
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2 cursor-pointer">
					<Avatar>
						<span className="sr-only">Profile</span>
					</Avatar>
					<div>
						<div className="text-sm font-semibold">Shikhar Gupta</div>
						<div className="text-xs text-muted-foreground">ENTNT</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;