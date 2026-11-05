import React from "react"
import { Heart, BookOpenCheck } from "lucide-react"
import { Book } from "../types"

interface Props {
    book: Book
    onToggleWishlist: (e: React.MouseEvent, book: Book) => void
    onToggleOwned: (e: React.MouseEvent, book: Book) => void
    className?: string
}

const buttonClassName =
    "p-1.5 rounded-full bg-black/80 hover:bg-black/70 transition-colors"

// Wishlist (heart) and owned (book) toggles, used on the book cards and in
// the book modal
const WishlistOwnedButtons: React.FC<Props> = ({
    book,
    onToggleWishlist,
    onToggleOwned,
    className = "",
}) => (
    <div className={`flex gap-1.5 ${className}`}>
        <button
            type="button"
            aria-label={
                book.is_wishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            onClick={(e) => onToggleWishlist(e, book)}
            className={buttonClassName}
        >
            <Heart
                size={20}
                className={book.is_wishlisted ? "text-brand" : "text-white"}
                fill={book.is_wishlisted ? "currentColor" : "none"}
            />
        </button>
        <button
            type="button"
            aria-label={
                book.is_owned ? "Remove from owned books" : "Mark as owned"
            }
            onClick={(e) => onToggleOwned(e, book)}
            className={buttonClassName}
        >
            <BookOpenCheck
                size={20}
                strokeWidth={3}
                className={book.is_owned ? "text-brand" : "text-white"}
            />
        </button>
    </div>
)

export default WishlistOwnedButtons
