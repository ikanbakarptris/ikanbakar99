import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { reviewsQueryOptions } from "@/lib/reviews";
import { siteSettingsQueryOptions } from "@/lib/site-settings";
import { AnimateIn } from "@/components/AnimateIn";
import { Share2, MessageCircle, Heart, X, Send, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { createPortal } from "react-dom";

export const Route = createFileRoute("/galeri")({
  component: GaleriPage,
});

function GaleriPage() {
  const { data: reviewsData = [] } = useQuery(reviewsQueryOptions);
  const { data: settings } = useQuery(siteSettingsQueryOptions);
  
  // Only reviews that have media
  const galleryItems = reviewsData.filter(r => !!r.mediaUrl);
  const shopName = settings?.shop_name || "Ikanbakar99";

  // Lightbox State
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  // Social States (Simulated for MVP UX)
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [commentInput, setCommentInput] = useState("");
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  // Handle Double Tap to Like
  const handleDoubleTap = (id: string) => {
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 1000);
    
    if (!hasLiked[id]) {
      setHasLiked(prev => ({ ...prev, [id]: true }));
      setLikes(prev => ({ ...prev, [id]: (prev[id] || Math.floor(Math.random() * 50) + 10) + 1 }));
      toast.success("Disukai! ❤️");
    }
  };

  const toggleLike = (id: string) => {
    if (hasLiked[id]) {
      setHasLiked(prev => ({ ...prev, [id]: false }));
      setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) - 1 }));
    } else {
      setHasLiked(prev => ({ ...prev, [id]: true }));
      setLikes(prev => ({ ...prev, [id]: (prev[id] || Math.floor(Math.random() * 50) + 10) + 1 }));
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 1000);
    }
  };

  const handleAddComment = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      name: "Pengunjung Rahasia",
      text: commentInput,
      time: "Baru saja"
    };

    setComments(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), newComment]
    }));
    setCommentInput("");
    toast.success("Komentar terkirim!");
  };

  const handleShare = async (review: any) => {
    const url = new URL(window.location.href);
    url.hash = review.id;
    const shareUrl = url.toString();
    const shareText = `Lihat ulasan ${review.name} untuk menu Ikan Bakar P. Tris! 🐟🔥`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Galeri Ikan Bakar P. Tris", text: shareText, url: shareUrl });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast.success("Tautan berhasil disalin ke clipboard!");
    }
  };

  // Scroll to hash on load
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: "smooth", block: "center" }), 500);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="hover:opacity-80 transition-opacity min-w-0">
            <p className="truncate font-display text-xl font-bold tracking-tight text-foreground">{shopName}</p>
            <p className="truncate text-xs text-muted-foreground">Galeri Pelanggan</p>
          </Link>
          <Link to="/" className="text-sm font-semibold text-primary hover:underline">
            ← Kembali
          </Link>
        </div>
      </header>

      <main className="flex-1 pb-24">
        <section className="bg-gradient-to-b from-primary/5 via-primary/5 to-background py-10 border-b border-border/50 relative overflow-hidden">
          <AnimateIn className="mx-auto max-w-5xl px-4 text-center relative z-10">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl font-display text-foreground mb-4">
              Galeri Hidangan
            </h1>
            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto leading-relaxed">
              Jelajahi momen lezat yang dibagikan langsung oleh pelanggan kami. Bagikan foto favorit Anda ke teman atau keluarga!
            </p>
          </AnimateIn>
        </section>

        {/* Masonry-like Grid */}
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {galleryItems.map((review, i) => {
              const isVideo = review.mediaUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i);
              const likeCount = likes[review.id] || (review.name.length * 3 + 12); // dummy deterministic count

              return (
                <AnimateIn key={review.id} delay={i < 6 ? i * 100 : 0} className="group h-full">
                  <div 
                    id={review.id} 
                    className="relative flex flex-col h-full overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer will-change-transform"
                    onClick={() => setSelectedPhoto(review)}
                  >
                    <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                      {isVideo ? (
                        <video src={review.mediaUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                      ) : (
                        <img src={review.mediaUrl} loading={i < 4 ? "eager" : "lazy"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Hover Overlay Stats */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                        <div className="flex items-center gap-3 font-semibold text-sm">
                          <span className="flex items-center gap-1 drop-shadow-md"><Heart className="size-4 fill-white" /> {likeCount}</span>
                          <span className="flex items-center gap-1 drop-shadow-md"><MessageCircle className="size-4 fill-white" /> {(comments[review.id]?.length || 0) + 2}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </main>

      {/* FULLSCREEN IMMERSIVE LIGHTBOX */}
      {selectedPhoto && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
          
          {/* Mobile Close Button (Absolute) */}
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="md:hidden absolute top-4 left-4 z-50 p-2 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 active:scale-95 transition-transform"
          >
            <X className="size-6" />
          </button>

          {/* Left: Media Area */}
          <div 
            className="relative flex-1 flex items-center justify-center bg-black/50 h-[50vh] md:h-full overflow-hidden"
            onDoubleClick={() => handleDoubleTap(selectedPhoto.id)}
          >
            {selectedPhoto.mediaUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? (
              <video src={selectedPhoto.mediaUrl} controls autoPlay className="w-full h-full object-contain animate-in zoom-in-95 duration-500" />
            ) : (
              <img src={selectedPhoto.mediaUrl} className="w-full h-full object-contain animate-in zoom-in-95 duration-500 select-none" />
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
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-to-tr from-primary to-orange-500 p-[2px]">
                  <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center">
                    <User className="size-5 text-white/80" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{selectedPhoto.name}</h3>
                  <div className="flex text-gold text-[10px]">
                    {Array.from({ length: selectedPhoto.stars || 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedPhoto(null)} className="hidden md:flex p-2 rounded-full hover:bg-white/10 text-white/70 transition-colors">
                <X className="size-6" />
              </button>
            </div>

            {/* Comments Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-white/10 hide-scrollbar">
              {/* Original Review (Caption) */}
              <div className="flex gap-3">
                <div className="size-8 rounded-full bg-zinc-800 shrink-0 flex items-center justify-center"><User className="size-4 text-white/50" /></div>
                <div>
                  <p className="text-sm text-white/90 leading-relaxed">
                    <span className="font-bold mr-2">{selectedPhoto.name}</span>
                    {selectedPhoto.text}
                  </p>
                  <p className="text-xs text-white/40 mt-1">Diposting bersama ulasan</p>
                </div>
              </div>

              {/* Dummy Comments */}
              <div className="flex gap-3">
                <div className="size-8 rounded-full bg-blue-900 shrink-0 flex items-center justify-center"><User className="size-4 text-white/50" /></div>
                <div>
                  <p className="text-sm text-white/90 leading-relaxed">
                    <span className="font-bold mr-2">Admin Ikanbakar99</span>
                    Terima kasih atas ulasannya kak! Ditunggu kedatangannya kembali 🙏
                  </p>
                  <p className="text-xs text-white/40 mt-1">2 hari yang lalu</p>
                </div>
              </div>

              {/* User Added Comments */}
              {comments[selectedPhoto.id]?.map(c => (
                <div key={c.id} className="flex gap-3 animate-in slide-in-from-right-4 fade-in">
                  <div className="size-8 rounded-full bg-green-900 shrink-0 flex items-center justify-center"><User className="size-4 text-white/50" /></div>
                  <div>
                    <p className="text-sm text-white/90 leading-relaxed">
                      <span className="font-bold mr-2">{c.name}</span>
                      {c.text}
                    </p>
                    <p className="text-xs text-white/40 mt-1">{c.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions Bar */}
            <div className="p-4 border-t border-white/10 bg-zinc-900/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleLike(selectedPhoto.id)} className="group transition-transform active:scale-75">
                    <Heart className={`size-7 transition-colors ${hasLiked[selectedPhoto.id] ? "fill-red-500 text-red-500" : "text-white group-hover:text-white/70"}`} />
                  </button>
                  <button className="group transition-transform active:scale-75">
                    <MessageCircle className="size-7 text-white group-hover:text-white/70" />
                  </button>
                  <button onClick={() => handleShare(selectedPhoto)} className="group transition-transform active:scale-75">
                    <Share2 className="size-7 text-white group-hover:text-white/70" />
                  </button>
                </div>
              </div>
              <p className="text-white font-bold text-sm mb-3">
                {(likes[selectedPhoto.id] || (selectedPhoto.name.length * 3 + 12))} Suka
              </p>

              {/* Comment Input */}
              <form onSubmit={(e) => handleAddComment(e, selectedPhoto.id)} className="relative flex items-center">
                <input 
                  type="text" 
                  placeholder="Tambahkan komentar..." 
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full bg-transparent border-none text-white text-sm focus:ring-0 placeholder:text-white/40 pl-0 pr-10"
                />
                {commentInput.trim() && (
                  <button type="submit" className="absolute right-0 text-primary font-bold text-sm hover:text-primary/80 transition-colors">
                    Kirim
                  </button>
                )}
              </form>
            </div>
          </div>

        </div>
      , document.body)}
    </div>
  );
}
