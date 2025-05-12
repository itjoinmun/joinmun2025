export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, delay: 1, type: "tween" },
  },
};

export const slideInItemVariants = {
  hidden: {
    opacity: 0,
    x: 10,
  },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      //   duration: 0.5,
      delay: 0.15 * index,
      type: "spring",
    },
  }),
};
