export default function StarRating({ rating, reviews, size = 'sm' }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating);
    const half = !filled && i < rating;
    return { filled, half };
  });

  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const starSize = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className="flex items-center gap-1">
      <span className={`${starSize} font-bold text-brand-yellow`}>
        {stars.map((s, i) => (
          <span key={i}>{s.filled ? '★' : s.half ? '⯨' : '☆'}</span>
        ))}
      </span>
      <span className={`${textSize} font-bold text-gray-800`}>{rating.toFixed(1)}</span>
      {reviews != null && (
        <span className={`${textSize} text-gray-400`}>({reviews})</span>
      )}
    </div>
  );
}
