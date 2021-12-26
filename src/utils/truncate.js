export default function truncate(str) {
  const splitStr = str.split(" ");
  let title = "";
  if (splitStr.length > 10) {
    const newStr = splitStr.splice(0, 9);
    title = newStr.join(" ");
  }
  title = str;
  return title + " ...";
}
