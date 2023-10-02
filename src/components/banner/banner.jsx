import "./banner.css";

import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

function Banner() {
  return (
    <ImageList
      className="gallery"
      sx={{ width: "100%", height: 500 }}
      cols={8}
      rowHeight={121}
    >
      {itemData.map((item) => (
        <ImageListItem
          key={item.img}
          cols={item.cols || 1}
          rows={item.rows || 1}
        >
          <img
            {...srcset(item.img, 121, item.rows, item.cols)}
            alt={item.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1517976487492-5750f3195933",
    title: "Breakfast",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1517976384346-3136801d605d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1541873676-a18131494184",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1465788786008-f75a725b34e9",
    title: "Coffee",
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1460186136353-977e9d6085a1",
    title: "Hats",
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1457364983758-510f8afa9f5f",
    title: "Honey",
    author: "@arwinneil",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1454789415558-bdda08f4eabb",
    title: "Basketball",
  },
  {
    img: "https://images.unsplash.com/photo-1457364847821-58861bbda116",
    title: "Fern",
  },
  {
    img: "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45",
    title: "Mushrooms",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1519241678948-28f18681ce14",
    title: "Tomato basil",
  },
  {
    img: "https://images.unsplash.com/photo-1447433589675-4aaa569f3e05",
    title: "Sea star",
  },
  {
    img: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2",
    title: "Bike",
    cols: 2,
  },
];

export default Banner;
