import { useTransition } from "@react-spring/core";

export function useConfigTransition(isOpen: boolean) {
  return useTransition(isOpen, {
    from: {
      maxHeight: "0rem",
      opacity: 0,
      marginTop: "0rem",
      paddingTop: "0rem",
      paddingBottom: "0rem",
    },
    enter: {
      maxHeight: "35rem",
      opacity: 1,
      marginTop: "1rem",
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
    },
    leave: {
      maxHeight: "0rem",
      opacity: 0,
      marginTop: "0rem",
      paddingTop: "0rem",
      paddingBottom: "0rem",
    },
    config: {
      tension: 250,
    },
  })
}