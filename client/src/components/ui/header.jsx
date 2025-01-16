import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

function Header() {
	return (
		<header className="flex items-center px-4 border-b lg:px-6 h-14 shrink-0 font-inter">
			<Link
				to={"/"}
				className="flex items-center justify-center text-[#008080] hover:text-[#007070]"
			>
				<GraduationCap className="w-8 h-8 mr-3" />
				<span className="font-extrabold text-sm sm:text-base tracking-[0.02em]">
					SkillBridge
				</span>
			</Link>
		</header>
	);
}

export default Header;
