import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const listVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.15,
		},
	},
};

export const itemVariants = {
	hidden: { opacity: 0, x: 30 },
	visible: { opacity: 1, x: 0 },
};

export const itemVariants2 = {
	hidden: { opacity: 0, y: 30 },
	visible: { opacity: 1, y: 0 },
};

export const itemVariants3 = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeOut" },
	},
};

export const containerVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 1,
			duration: 0.5,
		},
	},
};

export const itemYVariants = {
	hidden: { opacity: 0, y: 50 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8 },
	},
};
