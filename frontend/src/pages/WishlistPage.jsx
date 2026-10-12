import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductGrid from '../components/ProductGrid';
import {
  Container,
  PageHeader,
  Button,
  ButtonLink,
  EmptyState,
} from '../components/ui/Primitives';

const WishlistPage = () => {
  const { wishlist, addToCart, removeFromWishlist, getWishlistCount } = useAuth();
  const { showToast } = useToast();

  const moveAllToBag = () => {
    const available = wishlist.filter((item) => item.availability !== 'out-of-stock');
    if (!available.length) {
      showToast('Nothing in your wishlist is in stock', 'error');
      return;
    }
    available.forEach((item) => {
      addToCart(item);
      removeFromWishlist(item.id);
    });
    showToast(`Moved ${available.length} to your bag`, 'success');
  };

  if (wishlist.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Saved" title="Wishlist" meta="Empty" />
        <Container>
          <EmptyState
            eyebrow="Nothing saved"
            title="Your wishlist is empty"
            body="Tap the heart on any piece to keep it here for later."
            action={<ButtonLink to="/latest">Browse the Collection</ButtonLink>}
          />
        </Container>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Saved"
        title="Wishlist"
        meta={`${getWishlistCount()} ${getWishlistCount() === 1 ? 'piece' : 'pieces'}`}
      >
        <Button variant="outline" onClick={moveAllToBag}>
          Move All to Bag
        </Button>
      </PageHeader>

      <Container className="pb-24 md:pb-36">
        {/* The heart on each card already removes from the wishlist, so the
            card needs no special wishlist affordance here. */}
        <ProductGrid products={wishlist} stagger={0.08} />
      </Container>
    </>
  );
};

export default WishlistPage;
