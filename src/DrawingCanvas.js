import React, { useRef, useEffect, useState } from 'react';

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Scratch Card
  useEffect(() => {
    // if (!autoPlay) {
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    const scratchCard = new Image();
    scratchCard.src =
      'http://159.223.51.198:5000/scratchcard/1688120057551-image-subtract-3.png';

    scratchCard.onload = () => {
      ctx.drawImage(scratchCard, 0, 0, canvas.width, canvas.height);
    };

    const startScratch = (e) => {
      e.preventDefault();
      canvas.addEventListener('mousemove', scratch);
      canvas.addEventListener('touchmove', scratch);
    };

    const scratch = (e) => {
      const bounds = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - bounds.left;
      const y = (e.clientY || e.touches[0].clientY) - bounds.top;

      ctx.globalCompositeOperation = 'destination-out';
      const pointerSize = 120;
      ctx.beginPath();
      ctx.arc(x, y, pointerSize / 2, 0, Math.PI * 2);
      ctx.fill();

      checkRevealed();
      if (scratchCard) {
        setIsRevealed(true);
      }
    };

    const checkRevealed = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let totalPixels = 0;
      let revealedPixels = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        const alpha = pixels[i + 3];
        if (alpha === 0) {
          revealedPixels++;
        }
        totalPixels++;
      }

      const percentage = (revealedPixels / totalPixels) * 100;
      canvas.addEventListener('mouseout', () => {
        if (percentage >= 55) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      });

      // if (percentage >= 55) {
      //   ctx.clearRect(0, 0, canvas.width, canvas.height);
      //   setTextVisible(true);
      //   setHighlightedBlur(true);
      //   setTimeout(() => {
      //     setStartPlay(false);
      //   }, 5000);
      //   updateScratch(true, true);
      //   flagRef.current = true;
      // }
    };

    const endScratch = () => {
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('touchmove', scratch);
    };

    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('touchstart', startScratch);
    canvas.addEventListener('mouseup', endScratch);
    canvas.addEventListener('touchend', endScratch);
    // canvas.addEventListener("mouseleave", endScratch);

    return () => {
      canvas.removeEventListener('mousedown', startScratch);
      canvas.removeEventListener('touchstart', startScratch);
      canvas.removeEventListener('mouseup', endScratch);
      canvas.removeEventListener('touchend', endScratch);
    };
    // }
  }, []);

  return (
    <div className="card card-img card-play " style={{ top: '7px' }}>
      <img
        src="../assets/images/circle1.png"
        style={{
          // position: "absolute",
          // bottom: "-17px",
          // width: "106%",
          // left: "-16px",
          // zIndex: "999",

          position: 'absolute',
          bottom: '-17px',
          width: '106.5%',
          left: '-18px',
          zIndex: '999',
        }}
      />
      <div
        // className="card-img play-card  "
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {isRevealed ? (
          <div
            className="card card-scratch"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              // zIndex: -2,
            }}
          >
            <div className="scratch-cards-scratch overlay-body">
              <div className="card-body px-5 py-4">
                <div className="row">
                  <div
                    key={index}
                    className="col-4 d-flex justify-content-center align-items-center mb-4"
                  >
                    <span className={`scratch-btn active`}>543</span>
                    <span className={`scratch-btn active`}>543</span>
                    <span className={`scratch-btn active`}>543</span>
                    <span className={`scratch-btn `}>86</span>
                    <span className={`scratch-btn `}>86</span>
                    <span className={`scratch-btn `}>86</span>
                    <span className={`scratch-btn `}>86</span>
                    <span className={`scratch-btn `}>86</span>
                    <span className={`scratch-btn `}>86</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <canvas
          ref={canvasRef}
          style={{ cursor: 'crosshair' }}
          className=" card-img play-card  card-play"
        />
      </div>
    </div>
  );
};

export default DrawingCanvas;
