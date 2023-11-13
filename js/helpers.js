export const convertStringToNumber = (str) => {
  const noSpaceStr = String(str).replace(/\s+/g, "");
  const num = parseFloat(noSpaceStr);

  if (!isNaN(num) && isFinite(num)) {
    return num;
  } else {
    return false;
  }
};

export const reformatDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
};

export const animationNumber = (el, num) => {
  const fps = 60;
  const duration = 1000;
  const frameDuration = duration / fps;
  const totalFrame = Math.round(duration / frameDuration);

  let currentFrame = 0;

  const initialNumber = parseInt(el.textContent.replace(/[^0-9.-]+/g, ""));

  const increment = Math.trunc((num - initialNumber) / totalFrame);

  const animate = () => {
    currentFrame += 1;
    const newNum = initialNumber + increment * currentFrame;
    el.textContent = `${newNum.toLocaleString()} ₴`;

    if (currentFrame < totalFrame) {
      requestAnimationFrame(animate);
    } else {
      el.textContent = `${num.toLocaleString()} ₴`;
    }
  };

  requestAnimationFrame(animate);
};
