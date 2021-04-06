export const createOffersTemplate = (offers) => {
  const offersList = offers.map((offer) => {
    return `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`;
  }).join('');
  return offersList;
};
