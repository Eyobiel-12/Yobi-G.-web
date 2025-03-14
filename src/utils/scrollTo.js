export const scrollTo = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    const navHeight = 80; // Height of your navbar
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
}; 