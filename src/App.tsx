import { Refine, WelcomePage } from "@refinedev/core";
import { dataProvider } from "./providers/data-provider";
import { ShowProduct } from "./pages/products/show";
import { EditProduct } from "./pages/products/edit";
import { ListProducts } from "./pages/list";
import { CreateProduct } from "./pages/products/create";

function App() {
  return (
    <Refine dataProvider={dataProvider}>
      {/* <ShowProduct /> */}
      {/* <EditProduct/> */}
      <ListProducts/>
      {/* <CreateProduct/> */}
    </Refine>
  )
}

export default App
