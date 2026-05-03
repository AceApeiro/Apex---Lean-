async function fetchCSV() {
  const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTpNwubfBnETNUlfzzFn1PVjj6whCy9QgUMZ74dhmpMFJ-KN3kUeFGX-5AVLM8jn9wDEwzX-3wcOxHo/pub?gid=0&single=true&output=csv');
  const text = await res.text();
  console.log(text);
}
fetchCSV();
