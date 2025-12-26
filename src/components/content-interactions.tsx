import { HeartIcon, MessageSquareIcon } from "lucide-react";

function ContentInteractionsCount() {
  return (
    <div className="flex items-center justify-between mb-12">
      <div className="flex items-center gap-6">
        <button
          className="flex items-center gap-2 transition-colors"
          type="button"
        >
          <HeartIcon className="size-6" />
          <span className="text-xs font-mono font-bold">100</span>
        </button>
        <div className="flex items-center gap-2 text-foreground/40">
          <MessageSquareIcon className="size-6" />
          <span className="text-xs font-mono font-bold">1000</span>
        </div>
      </div>
    </div>
  );
}

function ContentDiscussions() {
  // return (
  //   <div className="bg-surface/50 dark:bg-surface/10 rounded-lg p-6 md:p-10 border border-border/50">
  //     <h3 className="font-serif text-3xl text-ink mb-8">Discussion.</h3>

  //     {/* Comment List */}
  //     <div className="space-y-10 mb-12">
  //       {rootComments.length > 0 ? (
  //         rootComments.map((comment) => renderComment(comment))
  //       ) : (
  //         <p className="text-gray-400 italic text-sm font-normal">
  //           No thoughts shared yet. Be the first to start the conversation.
  //         </p>
  //       )}
  //     </div>

  //     {/* Root Comment Input */}
  //     {user ? (
  //       <div className="pt-8 border-t border-border/50">
  //         <span className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-4">
  //           Post a comment
  //         </span>
  //         <form onSubmit={(e) => handleCommentSubmit(e)} className="relative">
  //           <textarea
  //             value={newComment}
  //             onChange={(e) => setNewComment(e.target.value)}
  //             placeholder="Add to the discussion..."
  //             className="w-full bg-paper border border-border rounded p-4 text-ink focus:border-ink outline-none transition-colors h-32 resize-none placeholder:text-gray-400"
  //           />
  //           <button
  //             type="submit"
  //             disabled={!newComment.trim()}
  //             className="absolute bottom-4 right-4 p-2 bg-ink text-paper rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
  //           >
  //             <Send size={18} />
  //           </button>
  //         </form>
  //       </div>
  //     ) : (
  //       <div className="bg-paper p-8 text-center border border-border border-dashed rounded-lg">
  //         <p className="text-gray-500 text-sm mb-6">
  //           You must be logged in to participate in the discussion.
  //         </p>
  //         <Link
  //           to="/login"
  //           className="inline-block text-xs font-bold uppercase tracking-widest text-ink border border-ink px-6 py-3 rounded-sm hover:bg-ink hover:text-paper transition-all"
  //         >
  //           Login to Account
  //         </Link>
  //       </div>
  //     )}
  //   </div>
  // )
  //
  return null;
}

export function ContentInteractions() {
  return (
    <div className="mt-24 pt-12 border-t border-border">
      <ContentInteractionsCount />
    </div>
  );
}
