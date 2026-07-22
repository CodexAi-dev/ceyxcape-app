// Real customer reviews, migrated from the old CeyXcape website's
// `company_feedback` table. These are genuine 5-star reviews from real
// travellers — used in the homepage + about testimonials sections.

export type Review = {
  name: string;
  country: string;
  rating: number;
  subject: string;
  text: string;
};

export const REVIEWS: Review[] = [
  {
    name: 'Ramon Varela Sanchez',
    country: 'Spain',
    rating: 5,
    subject: 'Fantastic trip experience',
    text: 'We shared our trip during more than ten days and we had a fantastic experience. He was so kind every time and tried to help us with all our daily issues. He suggested lovely places and organized the perfect trip. I totally recommend their services as a driver and guide.',
  },
  {
    name: 'Saba',
    country: 'England',
    rating: 5,
    subject: 'Brilliant experience',
    text: 'Had such a fantastic time — we were looked after very well. Always prompt, sharing interesting information about Sri Lanka, friendly and fun. We recommended them to our friends who were travelling with their baby and they had a great time too. Thank you!',
  },
  {
    name: 'Ghazal',
    country: 'Iran',
    rating: 5,
    subject: 'Transportation during my stay in Sri Lanka',
    text: 'I had a great experience. They drove us several times, including from Anuradhapura to the airport. I was stuck during heavy rain, flooding and road closures and they were the only one honest about when it was clear to cross. Highly recommend.',
  },
  {
    name: 'Laurens',
    country: 'Netherlands',
    rating: 5,
    subject: 'Highly recommended',
    text: 'Dinesh drove us all around Sri Lanka during our summer holiday. He was always on time and made the effort to show us beautiful places. We only had to send a message and would receive a response almost immediately. The rides felt very safe and the price is really good — in short, highly recommended.',
  },
  {
    name: 'Jonas',
    country: 'Belgium',
    rating: 5,
    subject: 'Fantastic driver',
    text: 'We had a fantastic driver. We still needed to make an extra stop which wasn’t a problem at all. Would only recommend!',
  },
  {
    name: 'Mendil Laura',
    country: 'Netherlands',
    rating: 5,
    subject: 'Perfectly organised',
    text: 'Super organisation! Transfer from the airport to the hotel and everything else was on time and easy to organise. Very accommodating in every way.',
  },
  {
    name: 'Sami Tsegai',
    country: 'Netherlands',
    rating: 5,
    subject: 'The best week',
    text: 'We had the best week with Poorna. He took us to many different places across the island.',
  },
];
