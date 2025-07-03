import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
	Maximize,
	Minimize,
	Pause,
	Play,
	RotateCcw,
	RotateCw,
	Volume2,
	VolumeX,
} from "lucide-react";

function VideoPlayer({
	width = "100%",
	height = "100%",
	url,
	onProgressUpdate,
	progressData,
	paused,
}) {
	const [playing, setPlaying] = useState(false);
	const [volume, setVolume] = useState(0.5);
	const [muted, setMuted] = useState(false);
	const [played, setPlayed] = useState(0);
	const [seeking, setSeeking] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showControls, setShowControls] = useState(true);

	const playerRef = useRef(null);
	const playerContainerRef = useRef(null);
	const controlsTimeoutRef = useRef(null);

	console.log("Video URL:", url);

	const secureUrl = url?.replace("http://", "https://");
	console.log("Secure URL:", secureUrl);

	const handleSeekChange = (newValue) => {
		// set the current value as played
		setPlayed(newValue[0]);
		setSeeking(true);
	};

	const handleSeekMouseUp = () => {
		setSeeking(false);
		playerRef?.current?.seekTo(played);
	};

	const handlePlayAndPause = () => {
		setPlaying(!playing);
	};

	const handleProgress = (state) => {
		if (!seeking) {
			setPlayed(state.played);
		}
	};

	const handleRewind = () => {
		// rewind for 5 seconds
		playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() - 5);
	};

	const handleForward = () => {
		// forward for 5 seconds
		playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() + 5);
	};

	const handleToggleMute = () => {
		setMuted(!muted);
	};

	const handleVolumeChange = (newValue) => {
		setVolume(newValue[0]);
	};

	const pad = (string) => {
		return ("0" + string).slice(-2);
	};

	const formatTime = (seconds) => {
		const date = new Date(seconds * 1000);
		const hh = date.getUTCHours();
		const mm = date.getUTCMinutes();
		const ss = pad(date.getUTCSeconds());

		if (hh) {
			return `${hh}:${pad(mm)}:${ss}}`;
		}

		return `${mm}:${ss}`;
	};

	const handleMouseMove = () => {
		setShowControls(true);
		clearTimeout(controlsTimeoutRef.current);
		controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
	};

	const handleFullScreen = useCallback(() => {
		const container = playerContainerRef?.current;

		if (!document.fullscreenElement) {
			if (container.requestFullscreen) {
				container.requestFullscreen();
			} else if (container.webkitRequestFullscreen) {
				container.webkitRequestFullscreen(); // For Safari
			} else if (container.mozRequestFullScreen) {
				container.mozRequestFullScreen(); // For Firefox
			} else if (container.msRequestFullscreen) {
				container.msRequestFullscreen(); // For IE/Edge
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		}
	}, []);

	useEffect(() => {
		const handleFullScreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener("fullscreenchange", handleFullScreenChange);

		return () => {
			document.removeEventListener("fullscreenchange", handleFullScreenChange);
		};
	}, []);

	useEffect(() => {
		if (played === 1) {
			onProgressUpdate({
				...progressData,
				progressValue: played,
			});
		}
	}, [played]);

	useEffect(() => {
		setPlaying(false);
	}, [paused]);

	return (
		<div
			ref={playerContainerRef}
			className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out font-inter ${
				isFullscreen ? "w-screen h-screen" : ""
			}`}
			style={{ width, height }}
			onMouseMove={handleMouseMove}
			onMouseLeave={() => setShowControls(false)}
		>
			<ReactPlayer
				ref={playerRef}
				className="absolute top-0 left-0"
				width="100%"
				height="100%"
				url={secureUrl}
				playing={playing}
				volume={volume}
				muted={muted}
				onProgress={handleProgress}
			/>
			{showControls && (
				<div
					className={`absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-2 sm:p-4 transition-opacity duration-300 ${
						showControls ? "opacity-100" : "opacity-0"
					}`}
				>
					<div className="flex flex-col items-end mb-1">
						<Slider
							value={[played * 100]}
							max={100}
							step={0.1}
							onValueChange={(value) => handleSeekChange([value[0] / 100])} // Divide  current value by 100
							onValueCommit={handleSeekMouseUp}
							className="w-full mb-1 bg-[#999] hover:bg-[#fdfdfd] border-[#666] rounded-full"
						/>
						<div className="text-white max-sm:text-sm">
							{formatTime(played * (playerRef?.current?.getDuration() || 0))} /{" "}
							{formatTime(playerRef?.current?.getDuration() || 0)}
						</div>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-y-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={handlePlayAndPause}
								className="mt-2 text-white bg-transparent hover:text-white hover:bg-gray-700"
							>
								{playing ? (
									<Pause className="size-4 sm:size-6" />
								) : (
									<Play className="size-4 sm:size-6" />
								)}
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleRewind}
								className="text-white bg-transparent hover:text-white hover:bg-gray-700"
							>
								<RotateCcw className="size-4 sm:size-6" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleForward}
								className="text-white bg-transparent hover:text-white hover:bg-gray-700"
							>
								<RotateCw className="size-4 sm:size-6" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleToggleMute}
								className="text-white bg-transparent hover:text-white hover:bg-gray-700"
							>
								{muted ? (
									<VolumeX className="size-4 sm:size-6" />
								) : (
									<Volume2 className="size-4 sm:size-6" />
								)}
							</Button>
							<Slider
								value={[volume * 100]}
								max={100}
								step={1}
								onValueChange={(value) => handleVolumeChange([value[0] / 100])}
								className="w-20 sm:w-24 bg-white border-[#666] rounded-full"
							/>
						</div>
						<div className="mt-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={handleFullScreen}
								className="text-white bg-transparent hover:text-white hover:bg-gray-700"
							>
								{isFullscreen ? (
									<Minimize className="size-4 sm:size-6" />
								) : (
									<Maximize className="size-4 sm:size-6" />
								)}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default VideoPlayer;
