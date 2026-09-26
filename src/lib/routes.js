/* Single place that decides where a record links to, so cards, search,
   the palette and bookmarks can never disagree about a URL. */

export function routeFor(item) {
  if (!item) return '/';
  switch (item.type) {
    case 'character':
      return `/c/${item.catId}/character/${item.id}`;
    case 'event':
      return `/events#${item.id}`;
    case 'merch':
      return `/merch/${item.id}`;
    case 'gallery':
      return `/c/${item.catId}?tab=gallery`;
    case 'video':
    case 'audio':
      return `/trailers#${item.id}`;
    case 'release':
      return `/c/${item.catId}?tab=releases`;
    case 'article':
    default:
      return `/c/${item.catId}/article/${item.id}`;
  }
}
