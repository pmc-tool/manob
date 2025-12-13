// Item Social Share component (matching original PMC design with skewed buttons)
'use client';

import { useEffect, useState } from 'react';
import { Share2, Heart, X, Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';

interface ItemSocialShareProps {
  shareTitle: string;
  shareDescription: string;
  totalLikes?: number;
  isLiked?: boolean;
  productId?: string;
  onLikeClick?: (liked: boolean) => void;
}

export default function ItemSocialShare({
  shareTitle,
  shareDescription,
  totalLikes = 0,
  isLiked = false,
  productId,
  onLikeClick,
}: ItemSocialShareProps) {
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(totalLikes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCount(totalLikes);
    setLiked(isLiked);
  }, [totalLikes, isLiked]);

  const handleLikeClick = () => {
    if (onLikeClick) {
      onLikeClick(liked);
    }
    setLiked(!liked);
    setCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const shareToTwitter = () => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
    window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareToLinkedin = () => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const shareToWhatsapp = () => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
    window.open(`https://wa.me/?text=${url}`, '_blank');
  };

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <>
      <div className="mb-4 p-3 sm:p-4 relative rounded-lg shadow bg-white">
        <div className="flex items-center">
          {/* Share tip label */}
          <div className="share-tip fz12 uppercase tracking-wider flex items-center font-medium">
            Share
            <span className="ml-2 w-8 h-px bg-gray-200"></span>
          </div>

          {/* Share button (skewed) */}
          <div className="share-btn-wrapper ml-2.5 transform -skew-x-[10deg]">
            <button
              type="button"
              onClick={openModal}
              className="share-trigger h-10 leading-10 text-sm text-center cursor-pointer transition-colors duration-200 border border-gray-200 bg-transparent w-10 flex items-center justify-center"
              title="Share This Item"
            >
              <span className="transform skew-x-[10deg] flex items-center justify-center">
                <Share2 className="h-4 w-4" />
              </span>
            </button>
          </div>

          {/* Like button (skewed) */}
          <div className="like-btn-wrapper ml-2.5 transform -skew-x-[10deg]">
            <button
              type="button"
              onClick={handleLikeClick}
              className={`like-trigger h-10 leading-10 text-sm text-center cursor-pointer transition-colors duration-200 border bg-transparent w-20 flex items-center justify-center ${
                liked ? 'border-primary text-primary' : 'border-gray-200'
              }`}
              title="Save To List"
            >
              <span className="transform skew-x-[10deg] flex items-center justify-center gap-1">
                <Heart className={`h-4 w-4 ${liked ? 'fill-current text-primary' : ''}`} />
                {count}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={closeModal}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mt-3 mb-4">
              <h4 className="text-lg font-semibold mb-1">{shareTitle}</h4>
              <p className="text-sm text-gray-500">{shareDescription}</p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center social-share-btns mt-4 mb-3">
              {/* Twitter */}
              <button
                onClick={shareToTwitter}
                className="flex flex-col items-center text-center bg-transparent border-0 p-0"
              >
                <div className="social-icon w-13 h-13 rounded-full flex items-center justify-center text-white text-xl bg-[#00aced] hover:bg-[#0087ba] transition-colors">
                  <Twitter className="h-5 w-5" />
                </div>
                <span className="block fz13 mt-2">Twitter</span>
              </button>

              {/* Facebook */}
              <button
                onClick={shareToFacebook}
                className="flex flex-col items-center text-center bg-transparent border-0 p-0"
              >
                <div className="social-icon w-13 h-13 rounded-full flex items-center justify-center text-white text-xl bg-[#3b5998] hover:bg-[#2d4373] transition-colors">
                  <Facebook className="h-5 w-5" />
                </div>
                <span className="block fz13 mt-2">Facebook</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={shareToLinkedin}
                className="flex flex-col items-center text-center bg-transparent border-0 p-0"
              >
                <div className="social-icon w-13 h-13 rounded-full flex items-center justify-center text-white text-xl bg-[#007bb6] hover:bg-[#005983] transition-colors">
                  <Linkedin className="h-5 w-5" />
                </div>
                <span className="block fz13 mt-2">LinkedIn</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={shareToWhatsapp}
                className="flex flex-col items-center text-center bg-transparent border-0 p-0"
              >
                <div className="social-icon w-13 h-13 rounded-full flex items-center justify-center text-white text-xl bg-[#0d9f16] hover:bg-[#0a7f12] transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <span className="block fz13 mt-2">WhatsApp</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={copyToClipboard}
                className="flex flex-col items-center text-center bg-transparent border-0 p-0"
              >
                <div className="social-icon w-13 h-13 rounded-full flex items-center justify-center text-white text-xl bg-[#f1c40f] hover:bg-[#dab10d] transition-colors">
                  <LinkIcon className="h-5 w-5" />
                </div>
                <span className="block fz13 mt-2">{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
