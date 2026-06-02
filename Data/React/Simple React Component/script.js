// Using Babel

function AddButton() {
  const [isLike, setLike] = React.useState(false);
  if (isLike) return <span>You liked the Button</span>;
  else return <button onClick={() => setLike(true)}>Like</button>;
}

const element = document.getElementById("app");
const root = ReactDOM.createRoot(element);
root.render(React.createElement(AddButton));

// Without using Babel

// function addButton() {
//   const [isLiked, setLike] = React.useState(false);
//   if (isLiked) {
//     return React.createElement("span", null, "You liked");
//   } else {
//     return React.createElement(
//       "button",
//       { onClick: () => setLike(true) },
//       "Like"
//     );
//   }
// }

// const domContainer = document.getElementById("app");
// const root = ReactDOM.createRoot(domContainer);
// root.render(React.createElement(addButton));
