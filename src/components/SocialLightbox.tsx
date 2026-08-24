import { createPortal } from "react-dom";
import { Share2, MessageCircle, Heart, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface LightboxPhoto {
  id: string;
  mediaUrl: string;
  name: string;
  stars?: number;
  text?: string;
}

export function SocialLightbox({ 
  photo, 
  onClose 
}: { 
  photo: LightboxPhoto; 
  onClose: () => void; 
}) {
  const [likes, setLikes] = useState<number>(() => photo.name.length * 3 + 12);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleDoubleTap = () => {
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 1000);
    
    if (!hasLiked) {
      setHasLiked(true);
      setLikes(prev => prev + 1);
      toast.success("Disukai! ❤️");
    }
  };

  const toggleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikes(prev => prev - 1);
    } else {
      setHasLiked(true);
      setLikes(prev => prev + 1);
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 1000);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      name: "Pengunjung",
      text: commentInput,
      time: "Baru saja"
    };

    setComments(prev => [...prev, newComment]);
    setCommentInput("");
    toast.success("Komentar terkirim!");
  };

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.hash = photo.id;
    const shareUrl = url.toString();
    const shareText = `Lihat ulasan ${photo.name} untuk menu Ikan Bakar P. Tris! 🐟🔥`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Galeri Ikan Bakar P. Tris", text: shareText, url: shareUrl });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast.success("Tautan berhasil disalin ke clipboard!");
    }
  };

  const isVideo = photo.mediaUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i) || 
                  photo.mediaUrl.includes(".mp4") || 
                  photo.mediaUrl.includes(".webm") || 
                  photo.mediaUrl.includes(".mov");

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
      
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="md:hidden absolute top-4 left-4 z-[110] p-2 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 active:scale-95 transition-transform"
      >
        <X className="size-6" />
      </button>

      {/* Left: Media Area */}
      <div 
        className="relative flex-1 flex items-center justify-center bg-black/50 h-[50vh] md:h-full overflow-hidden"
        onDoubleClick={handleDoubleTap}
      >
        {isVideo ? (
          <video src={photo.mediaUrl} controls autoPlay className="w-full h-full object-contain animate-in zoom-in-95 duration-500" />
        ) : (
          <img src={photo.mediaUrl} className="w-full h-full object-contain animate-in zoom-in-95 duration-500 select-none" />
        )}
        
        {/* Giant Heart Animation */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <Heart className="size-32 text-red-500 fill-red-500 animate-in zoom-in-50 fade-in duration-300 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
          </div>
        )}
        
        {/* Double tap hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md text-white/70 text-xs tracking-wider animate-pulse hidden md:block">
          Double-tap to like
        </div>
      </div>

      {/* Right: Social Sidebar */}
      <div className="w-full md:w-[400px] bg-zinc-950 flex flex-col h-[50vh] md:h-full border-l border-white/10 animate-in slide-in-from-bottom-full md:slide-in-from-right-full duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-3.5 border-b border-white/10 bg-zinc-900/70 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-9 rounded-full bg-gradient-to-tr from-primary to-orange-500 p-[2px] shrink-0">
                <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center">
                  <User className="size-4 text-white/80" />
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-white text-sm truncate">{photo.name}</h3>
                <div className="flex text-gold text-[10px]">
                  {Array.from({ length: photo.stars || 5 }).map((_, i) => <span key={i}>★</span>)}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/80 active:scale-95 transition-all"
              aria-label="Tutup lightbox"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Comments Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 hide-scrollbar">
            {/* Original Review (Caption) */}
            {photo.text && (
              <div className="flex gap-3">
                <div className="size-8 rounded-full bg-zinc-800 shrink-0 flex items-center justify-center">
                  <User className="size-4 text-white/50" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white/90 leading-relaxed">
                    <span className="font-bold mr-2 text-white">{photo.name}</span>
                    {photo.text}
                  </p>
                  <p className="text-xs text-white/40 mt-1">Ulasan Pelanggan</p>
                </div>
              </div>
            )}

            {/* Admin Response */}
            <div className="flex gap-3 bg-primary/5 rounded-2xl p-3 border border-primary/10">
              <div className="size-8 rounded-full bg-primary/20 shrink-0 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">PT</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-primary mb-0.5">Admin Ikan Bakar P. Tris</p>
                <p className="text-xs text-white/90 leading-relaxed">
                  Terima kasih atas kunjungannya kak! Ditunggu kedatangannya kembali 🙏
                </p>
              </div>
            </div>

            {/* User Added Comments */}
            {comments.map(c => (
              <div key={c.id} className="flex gap-3 animate-in slide-in-from-right-4 fade-in">
                <div className="size-8 rounded-full bg-emerald-900/60 border border-emerald-500/20 shrink-0 flex items-center justify-center">
                  <User className="size-4 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white/90 leading-relaxed">
                    <span className="font-bold mr-2 text-emerald-400">{c.name}</span>
                    {c.text}
                  </p>
                  <p className="text-[11px] text-white/40 mt-0.5">{c.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions Bar */}
          <div className="p-3.5 border-t border-white/10 bg-zinc-900/70 shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleLike}
                  className="group flex items-center gap-1.5 transition-transform active:scale-75"
                  aria-label="Sukai foto"
                >
                  <Heart className={`size-6 transition-colors ${hasLiked ? "fill-red-500 text-red-500" : "text-white group-hover:text-red-400"}`} />
                  <span className="text-xs font-bold text-white/90">{likes}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="group flex items-center gap-1.5 transition-transform active:scale-75 text-white/80 hover:text-white"
                  aria-label="Bagikan foto"
                >
                  <Share2 className="size-5" />
                  <span className="text-xs font-semibold">Bagikan</span>
                </button>
              </div>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Tulis komentar lezat..." 
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full bg-zinc-800/80 rounded-full px-4 py-2.5 text-white text-xs sm:text-sm placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-primary border border-white/10 pr-16"
              />
              {commentInput.trim() && (
                <button
                  type="submit"
                  className="absolute right-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
                >
                  Kirim
                </button>
              )}
            </form>
          </div>
        </div>

      </div>,
      document.body
    );
  }
