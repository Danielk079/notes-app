export const NOTE_COLORS = [
  { bg: '#FF6B6B', light: '#FFE5E5', label: 'Coral' },
  { bg: '#4ECDC4', light: '#E0F7F5', label: 'Teal' },
  { bg: '#45B7D1', light: '#E0F4FA', label: 'Sky' },
  { bg: '#96CEB4', light: '#E8F5EE', label: 'Sage' },
  { bg: '#FFEAA7', light: '#FFFBE0', label: 'Yellow' },
  { bg: '#DDA0DD', light: '#F8E8F8', label: 'Plum' },
  { bg: '#98D8C8', light: '#E5F7F2', label: 'Seafoam' },
  { bg: '#F7DC6F', light: '#FEFAE0', label: 'Golden' },
  { bg: '#BB8FCE', light: '#F3E8F9', label: 'Lavender' },
  { bg: '#85C1E9', light: '#E4F2FC', label: 'Blue' },
  { bg: '#F0A500', light: '#FEF3DC', label: 'Amber' },
  { bg: '#E8A598', light: '#FCECEA', label: 'Blush' },
];

export const getRandomColor = () => {
  return NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
};

export const getColorByBg = (bg) => {
  return NOTE_COLORS.find(c => c.bg === bg) || NOTE_COLORS[0];
};

export const CATEGORY_COLORS = {
  Work: { bg: '#45B7D1', text: '#fff' },
  Personal: { bg: '#96CEB4', text: '#fff' },
  Ideas: { bg: '#FFEAA7', text: '#333' },
  Other: { bg: '#DDA0DD', text: '#fff' },
  All: { bg: '#BB8FCE', text: '#fff' },
};