import React from "react";

// const Home = React.lazy(() => import("./components/Home"));

const Home = React.lazy(() =>
  import("./components/Home").then((module) => ({ default: module.Home })),
);

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Home />
      </Suspense>
    </div>
  );
}

export default App;
