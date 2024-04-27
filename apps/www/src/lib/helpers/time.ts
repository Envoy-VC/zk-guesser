export const parseMinutes = (time: number) => {
  // convert seconds left to minutes and seconds
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // return formatted time
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};
