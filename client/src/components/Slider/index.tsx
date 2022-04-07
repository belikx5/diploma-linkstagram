import "./slider.scss";
import React, { useMemo, useState } from "react";
import SliderControls from "./SliderControls";

import ReactPlayer from "react-player";
import { Image, Video } from "../../store/actionTypes/postActionTypes";

type SliderProps = {
  currentPost: { images: Image[]; videos: Video[] };
  isPostDetails?: boolean;
};

function Slider({ currentPost, isPostDetails = false }: SliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const media = useMemo(
    () => [
      ...currentPost.images.map((i) => ({
        ...i,
        media: i.image,
        isImage: true,
      })),
      ...currentPost.videos.map((v) => ({
        ...v,
        media: v.video,
        isImage: false,
      })),
    ],
    [currentPost]
  );
  const next = () => {
    setActiveIndex((current) => {
      return current === media.length - 1 ? 0 : current + 1;
    });
  };
  const prev = () => {
    setActiveIndex((current) => {
      return current === 0 ? media.length - 1 : current - 1;
    });
  };
  const goto = (num: number) => {
    setActiveIndex(num);
  };

  return (
    <div className={`slider ${isPostDetails ? "postDetails" : ""}`}>
      {media[activeIndex].isImage ? (
        <img
          src={media[activeIndex].media}
          alt={media[activeIndex].media}
          onClick={() => console.log("here")}
        />
      ) : (
        <ReactPlayer
          url={media[activeIndex].media}
          width='100%'
          height='100%'
          controls
        />
      )}
      <SliderControls
        dotsCount={media.length}
        activeDot={activeIndex}
        onGotoClick={goto}
        onNextClick={next}
        onPrevClick={prev}
      />
    </div>
  );
}

export default Slider;
