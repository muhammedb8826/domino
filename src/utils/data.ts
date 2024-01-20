export const simpleProducts = [
  {
    id: 1,
    name: "Book",
    price: 10,
    description: "A simple T-Shirt",
    image:
      "https://images.unsplash.com/photo-1584308967182-0c1b0b3f0f1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dCUyMHRzaGlydHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
  },
  {
    id: 2,
    name: "Mesh",
    price: 20,
    description: "A simple Banner",
    image:
      "https://images.unsplash.com/photo-1584308967182-0c1b0b3f0f1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dCUyMHRzaGlydHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
  },
  {
    id: 3,
    name: "Vinyl",
    price: 30,
    description: "A simple Banner",
    image:
      "https://images.unsplash.com/photo-1584308967182-0c1b0b3f0f1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dCUyMHRzaGlydHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
  },
  {
    id: 4,
    name: "Sticker",
    price: 40,
    description: "A simple Banner",
    image:
      "https://images.unsplash.com/photo-1584308967182-0c1b0b3f0f1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dCUyMHRzaGlydHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
  },
];

export const variableProducts = [
  {
    id: 1,
    name: "T-Shirt",
    price: 10,
    description: "A simple T-Shirt",
    image:
      "https://images.unsplash.com/photo-1584308967182-0c1b0b3f0f1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dCUyMHRzaGlydHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    attributes: [
      {
        name: "fabric",
        options: ["cotton", "polyester", "wool", "rayon", "linen"],
      },
      {
        name: "size",
        options: ["small", "medium", "large"],
      },
      {
        name: "color",
        options: ["red", "blue", "green", "yellow", "white", "black"],
      },
      {
        name: "style",
        options: ["v-neck", "crew-neck"],
      },
      {
        name: "placement",
        options: ["front", "back", "left sleeve", "right sleeve"],
      },
      {
        name: "side",
        options: ["single", "double"],
      },
      {
        name: "purpose",
        options: ["business", "personal", "gift"],
      },
      {
        name: "description",
        options: [
          "I want a picture of a cat on the front",
          "I want a picture of a dog on the back",
        ],
      },
    ],
  },

  {
    id: 2,
    name: "Banner",
    price: 10,
    description: "A simple Banner",
    image:
      "https://images.unsplash.com/photo-1584308967182-0c1b0b3f0f1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dCUyMHRzaGlydHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    attributes: [
      {
        name: "material",
        options: ["vinyl", "fabric", "mesh"],
      },
      {
        name: "height",
        options: [""],
      },
      {
        name: "width",
        options: [""],
      },
      {
        name: "unit",
        options: ["ft", "in", "cm", "m"],
      },
      {
        name: "purpose",
        options: ["business", "personal", "gift"],
      },
      {
        name: "description",
        options: [
          "I want a picture of a cat on the front",
          "I want a picture of a dog on the back",
        ],
      },
      {
        name: "side",
        options: ["single", "double"],
      },
    ],
  },

  {
    id: 3,
    name: "Sticker",
    price: 10,
    description: "A simple Sticker",
    image:
      "https://images.unsplash.com/photo-1584308967182-0c1b0b3f0f1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dCUyMHRzaGlydHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    attributes: [
      {
        name: "material",
        options: ["vinyl", "fabric", "mesh"],
      },
      {
        name: "height",
        options: ["10", "12", "15", "20", "25"],
      },
      {
        name: "width",
        options: ["10", "12", "15", "20", "25"],
      },
      {
        name: "unit",
        options: ["ft", "in", "cm", "m"],
      },
      {
        name: "purpose",
        options: ["business", "personal", "gift"],
      },
      {
        name: "description",
        options: [
          "I want a picture of a cat on the front",
          "I want a picture of a dog on the back",
        ],
      },
      {
        name: "side",
        options: ["single", "double"],
      },
    ],
  },
];
