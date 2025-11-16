import { ShareIcon } from "../icons/ShareIcon";

interface CardProps {
    title: string;
    link: string;
    type: "twitter" | "youtube";
}


export function Card({ title, link, type }: CardProps) {
    return (
        <div>
          
            <div className="p-4 bg-white rounded-md border-gray-200 max-w-72 border min-h-48 min-w-72">
        
                <div className="flex justify-between">
         
                    <div className="flex items-center text-md">
                        <div className="text-gray-500 pr-2">
             
                            <ShareIcon />
                        </div>
                        {title}
                    </div>
                 
                    <div className="flex items-center">
                        <div className="pr-2 text-gray-500">
                            {/* Clickable Share Icon that opens the link */}
                            <a href={link} target="_blank" rel="noopener noreferrer">
                                <ShareIcon />
                            </a>
                        </div>
                        <div className="text-gray-500">
                            
                            <ShareIcon />
                        </div>
                    </div>
                </div>

   
                <div className="pt-4">
                    {type === "youtube" && (function () {
                        // Normalize many YouTube URL forms into a proper embed URL
                        function getYouTubeEmbedUrl(raw: string) {
                            try {
                                const url = new URL(raw);
                                const host = url.hostname.toLowerCase();

                                // youtu.be short link
                                if (host.includes("youtu.be")) {
                                    const id = url.pathname.split("/").filter(Boolean)[0];
                                    return id ? `https://www.youtube.com/embed/${id}` : null;
                                }

                                // regular youtube domains
                                if (host.includes("youtube.com") || host.includes("www.youtube.com") || host.includes("m.youtube.com")) {
                                    // watch?v=VIDEO
                                    if (url.searchParams.has("v")) {
                                        const id = url.searchParams.get("v");
                                        return id ? `https://www.youtube.com/embed/${id}` : null;
                                    }

                                    // shorts: /shorts/VIDEO
                                    const parts = url.pathname.split("/").filter(Boolean);
                                    if (parts[0] === "shorts" && parts[1]) {
                                        return `https://www.youtube.com/embed/${parts[1]}`;
                                    }

                                    // already an embed or other path - try last path segment
                                    const last = parts[parts.length - 1];
                                    if (last && last.length >= 8) {
                                        return `https://www.youtube.com/embed/${last}`;
                                    }
                                }
                            } catch (e) {
                                return null;
                            }
                            return null;
                        }

                        const embedUrl = getYouTubeEmbedUrl(link);

                        if (embedUrl) {
                            return (
                                <iframe
                                    className="w-full"
                                    src={embedUrl}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                />
                            );
                        }

                        // fallback: open original link in a new tab if we can't embed
                        return (
                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                Open video in YouTube
                            </a>
                        );
                    })()}

                    {type === "twitter" && (
                        <blockquote className="twitter-tweet">
                            <a href={link.replace("x.com", "twitter.com")}></a>
                        </blockquote>
                    )}
                </div>
            </div>
        </div>
    );
}